import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PageDraft } from './drafts.model';
import { CreateDraftDto } from './dto/create-draft.dto';
import { SeoService } from '../../seo/seo.service';
import { UsersService } from '../../users/users.service';
import { SEOPreset } from '../../seo/seo-presets/seo-presets.model';
import { User } from '../../users/user.model';
import { SeoPresetsService } from '../../seo/seo-presets/seo-presets.service';
import { TemplatesService } from '../../templates/templates.service';
import { TemplateModel } from '../../templates/template.model';
import { UpdatePageDraftDto } from './dto/update-draft.dto';
import { SEO } from '../../seo/seo.model';
import { PagesService } from '../pages.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Page } from '../pages.model';
import { UpdateDraftDto } from '../../posts/drafts/dto/update-draft.dto';
import { ProcessDataInterface } from './inerface/draft.interface';
import { ForbiddenMethodUnallowResponse } from 'src/roles/responses/roles.forbidden.responses';

@Injectable()
export class DraftsService {
  constructor(
    @InjectModel(PageDraft) private pageDraftRepository: typeof PageDraft,
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(SeoPresetsService) private readonly seoPresetsService: SeoPresetsService,
    @Inject(SeoService) private readonly seoService: SeoService,
    @Inject(TemplatesService) private readonly templatesService: TemplatesService,
    @Inject(forwardRef(() => PagesService)) private readonly pagesService: PagesService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  private async _getPageDraftById(id: number): Promise<PageDraft> {
    const draft: PageDraft = await this.pageDraftRepository.findOne({
      where: { id },
      include: [User, TemplateModel, SEOPreset, Page],
    });
    if (!draft) {
      throw new HttpException('Page draft not found', 404);
    }
    return draft;
  }
  /**
   * Возвращает все черновики
   * Returns all drafts
   */
  async getPageDrafts(): Promise<PageDraft[]> {
    return await this.pageDraftRepository.findAll({
      include: [
        { model: User, attributes: ['id', 'name'] },
        { model: TemplateModel },
        { model: SEOPreset },
        { model: Page },
      ],
    });
  }

  /**
   * Возвращает черновик страницы по её id
   * Returns the draft page by its id
   */
  async getPageDraftById(id: number): Promise<PageDraft> {
    const draft: PageDraft = await this.pageDraftRepository
      .findOne({
        where: { id },
        include: [User, TemplateModel, SEOPreset, Page, SEO],
      })
      .then((pageDraft) => {
        if (!pageDraft) {
          throw new HttpException('Page draft not found', 404);
        }
        pageDraft.seo = this.seoService.seoSwitch(pageDraft.manual_seo, pageDraft.seo, pageDraft.seo_preset);
        return pageDraft;
      });

    return draft;
  }

  /**
   * Создаёт черновик страницы и оригинал
   * Creates a draft page and an original
   */
  private async createPageAndDraft(
    dto: CreateDraftDto,
    status: 'PUBLISHED' | 'DRAFT' | 'WAIT_FOR_PUBLISH',
    user_id: number,
  ): Promise<PageDraft> {
    const processedData: ProcessDataInterface = await this.processData(dto, user_id);
    const draftData: Omit<CreateDraftDto, 'seo'> = dto;
    const draft: PageDraft = await this.pageDraftRepository.create({
      ...draftData,
      date_to_publish: processedData.date_to_publish,
      status: status,
      manual_seo: this.seoService.checkManualChangeSeo(dto.seo, processedData.seoPreset, undefined),
    });
    const seo: SEO = await this.seoPresetsService.createSeoPresetDrafts(processedData.seoPreset, dto.seo);
    await draft.$set('user', processedData.user);
    await draft.$set('seo_preset', processedData.seoPreset);
    await draft.$set('template', processedData.template);
    const page: Page = await this.pagesService.createPage(
      dto,
      status,
      draft,
      processedData.user,
      seo,
      processedData.template,
      processedData.seoPreset,
    );
    await draft.$set('page', page);
    await draft.$set('seo', seo);
    return await draft.reload();
  }

  /**
   * Обновляет данные черновика
   * Updates the draft data
   */
  async updateDraft(
    dto: UpdatePageDraftDto,
    draft_id: number,
    status: 'PUBLISHED' | 'DRAFT' | 'WAIT_FOR_PUBLISH',
    user_id: number,
    save?: boolean,
  ): Promise<PageDraft> {
    const draftExists: PageDraft = await this.pageDraftRepository.findOne({
      where: { id: draft_id },
      include: [SEO, Page],
    });
    if (!draftExists) {
      throw new HttpException(`Черновик с id ${draft_id} не найден`, HttpStatus.NOT_FOUND);
    }
    if (save && draftExists.page.status == 'WAIT_FOR_PUBLISH') {
      throw new ForbiddenMethodUnallowResponse();
    }
    const processedData: ProcessDataInterface = await this.processData(dto, user_id);
    const draftData: Omit<UpdatePageDraftDto, 'seo'> = dto;
    const draft: PageDraft = await this.pageDraftRepository
      .update(
        {
          ...draftData,
          manual_seo: this.seoService.checkManualChangeSeo(dto.seo, processedData.seoPreset, draftExists.seo),
          date_to_publish: processedData.date_to_publish,
          status: status,
        },
        { where: { id: draft_id }, returning: true },
      )
      .then(([, pageDrafts]) => pageDrafts[0]);
    await this.seoService.updateSeo(draftExists.seo.id, dto.seo);
    await draft.$set('user', processedData.user);
    if (processedData.template) {
      await draft.$set('template', processedData.template);
    }
    return await draft.reload();
  }

  /**
   * Создаёт черновик страницы и её оригинал с последующей публикацией (в зависимости от dto.date_to_publish)
   * Creates a draft of the page and its original with subsequent publication (depending on dto.date_to_publish)
   */
  async createPublishPage(dto: CreateDraftDto, user_id: number): Promise<PageDraft> {
    if (!dto.date_to_publish || (dto.date_to_publish instanceof Date && dto.date_to_publish.getTime() <= Date.now())) {
      return await this.createPageAndDraft(dto, 'PUBLISHED', user_id);
    } else {
      const draft: PageDraft = await this.createPageAndDraft(dto, 'WAIT_FOR_PUBLISH', user_id);
      await this.cronPublishJob(draft.date_to_publish, draft.page_id, draft.id);
      return draft;
    }
  }

  /**
   * Создаёт черновик страницы и её оригинал без публикации
   * Creates a draft of a page and its original without publishing it
   */
  async createSavePage(dto: CreateDraftDto, user_id: number): Promise<PageDraft> {
    return await this.createPageAndDraft(dto, 'DRAFT', user_id);
  }

  /**
   * Обновляет черновик страницы с последющей публикацией (в зависимости от dto.date_to_publish)
   * Updates the draft page with the latest publication (depending on dto.date_to_publish)
   */
  async updatePublishDraft(dto: UpdateDraftDto, draft_id: number, user_id: number): Promise<PageDraft> {
    this.cronDeleteJob(draft_id);
    if (!dto.date_to_publish || dto.date_to_publish.getTime() <= Date.now()) {
      const updatedDraft: PageDraft = await this.updateDraft(dto, draft_id, 'PUBLISHED', user_id);
      await this.pagesService.updatePage(
        updatedDraft.page_id,
        dto,
        'PUBLISHED',
        updatedDraft.user,
        updatedDraft.template,
      );
      return updatedDraft;
    } else {
      const updatedDraft: PageDraft = await this.updateDraft(dto, draft_id, 'WAIT_FOR_PUBLISH', user_id);
      const page: Page = await this.pagesService.updatePage(
        updatedDraft.page_id,
        dto,
        'WAIT_FOR_PUBLISH',
        updatedDraft.user,
        updatedDraft.template,
      );
      await this.cronPublishJob(dto.date_to_publish, page.id, updatedDraft.id);
      return updatedDraft;
    }
  }

  /**
   * Создание Cron-работы по передаче данных из черновика страницы на её оригинал.
   * Create a Cron job to transfer data from a draft page to its original.
   */
  private async cronPublishJob(date: Date, page_id: number, draft_id: number): Promise<void> {
    const job_name = `Wait for publish page ${page_id}`;
    const job: CronJob = new CronJob(date, async (): Promise<void> => {
      const draft: PageDraft = await this._getPageDraftById(draft_id);
      await this.pagesService.updatePage(
        draft.page_id,
        {
          title: draft.title,
          text: draft.text,
          template_id: draft.template_id,
          seo_preset_id: draft.seo_preset_id,
          seo: draft.seo,
        },
        'PUBLISHED',
        draft.user,
        draft.template,
        draft.seo_preset,
      );
      if (draft.status !== 'PUBLISHED') {
        await draft.update({ status: 'PUBLISHED' });
      }
    });
    this.schedulerRegistry.addCronJob(job_name, job);
    job.start();
  }

  /**
   * Удаление работы Cron по id страницы
   * Deleting Cron job by page id
   */
  cronDeleteJob(page_id: number): void {
    try {
      const job: CronJob = this.schedulerRegistry.getCronJob(`Wait for publish page ${page_id}`);
      if (job) {
        this.schedulerRegistry.deleteCronJob(`Wait for publish page ${page_id}`);
      }
    } catch (e) {}
  }

  /**
   * Получает сущности, указанные в DTO из БД (пользователь, SEO-пресет, шаблон, SeoDto, PageData)
   * Gets the entities specified in the DTO from the database (user, SEO preset, template, SeoDto, PageData)
   */
  private async processData(dto: CreateDraftDto | UpdatePageDraftDto, user_id: number): Promise<ProcessDataInterface> {
    const user: User = await this.usersService.getUserById(user_id);
    const seoPreset: SEOPreset = await this.getSeoPreset(dto.seo_preset_id);
    const template: TemplateModel = await this.getTemplate(dto.template_id);
    return {
      user: user,
      seoPreset: seoPreset,
      template: template,
      date_to_publish: dto.date_to_publish,
    };
  }

  /**
   * Поиск шаблона (если указан). В случае неудачи будет ошибка о ненайденном шаблоне. Если шаблон не указан, вернётся undefined
   * Search for a template (if specified). If it fails, there will be an error about an undiscovered template. If no template is specified, undefined will be returned
   */
  private async getTemplate(template_id: number | undefined): Promise<TemplateModel | undefined> {
    if (!template_id) {
      return;
    }
    const template: TemplateModel = await this.templatesService.getTemplateById(template_id);
    if (!template) {
      throw new HttpException(`Шаблон с id ${template_id} не найден`, HttpStatus.NOT_FOUND);
    }
    return template;
  }

  /**
   * Поиск SEO-пресета (если указан). В случае неудачи будет ошибка о ненайденном SEO-пресете. Если пресет не указан, вернётся undefined
   * Search for SEO preset (if specified). If unsuccessful, there will be an error about not found SEO preset. If no preset is specified, undefined will be returned
   */
  private async getSeoPreset(seo_preset_id: number | undefined): Promise<SEOPreset | undefined> {
    if (!seo_preset_id) {
      return;
    }
    const seoPreset: SEOPreset = await this.seoPresetsService.getSeoPresetById(seo_preset_id);
    if (!seoPreset) {
      throw new HttpException(`SEO-пресет с id ${seo_preset_id} не найден`, HttpStatus.NOT_FOUND);
    }
    return seoPreset;
  }
}
