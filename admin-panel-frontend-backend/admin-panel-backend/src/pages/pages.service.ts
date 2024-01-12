import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Page } from './pages.model';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PageDraft } from './drafts/drafts.model';
import { User } from '../users/user.model';
import { TemplateModel } from '../templates/template.model';
import { SEOPreset } from '../seo/seo-presets/seo-presets.model';
import { SeoService } from '../seo/seo.service';
import { SEO } from '../seo/seo.model';
import { DeletePageDto } from './dto/delete-page.dto';
import { DraftsService } from './drafts/drafts.service';
import { GetForPageIntf } from 'src/files/interfaces/service.interfaces';
import { DraftsNotFoundResponse } from '../posts/drafts/responses/drafts.not-found.responses';

@Injectable()
export class PagesService {
  constructor(
    @InjectModel(Page) private pageRepository: typeof Page,
    @Inject(SeoService) private readonly seoService: SeoService,
    @Inject(forwardRef(() => DraftsService)) private readonly draftsService: DraftsService,
  ) {}

  /**get one page*/
  async getPages(): Promise<Page[]> {
    return await this.pageRepository.findAll({
      include: [{ model: User }, { model: SEO }, { model: SEOPreset }, { model: TemplateModel }, { model: PageDraft }],
    });
  }

  /**get pages for paggination*/
  async getPagesPagination(page: number, per_page: number): Promise<GetForPageIntf<Page>> {
    return await this.pageRepository
      .findAndCountAll({
        limit: per_page,
        offset: (page - 1) * per_page,
        order: ['createdAt'],
        attributes: ['id', 'title', 'status', 'manual_seo'],
        include: [
          { model: User, attributes: { exclude: ['password', 'refresh_token', 'ban_reason'] } },
          { model: PageDraft, attributes: ['id'] },
        ],
      })
      .then(({ rows, count }) => {
        return { current_page: page, total_pages: Math.ceil(count / per_page), count: count, rows: rows };
      });
  }

  //**get pages by ID */
  async getPageByID(id: number): Promise<Page> {
    return await this.pageRepository
      .findByPk(id, {
        include: [
          { model: User },
          { model: SEO },
          { model: SEOPreset },
          { model: TemplateModel },
          { model: PageDraft },
        ],
      })
      .then((page) => {
        if (!page) {
          throw new HttpException('Page not found', 404);
        }
        page.seo = this.seoService.seoSwitch(page.manual_seo, page.seo, page.seo_preset);
        return page;
      });
  }

  /**create new page*/
  async createPage(
    dto: CreatePageDto,
    status: 'PUBLISHED' | 'DRAFT' | 'WAIT_FOR_PUBLISH',
    draft: PageDraft,
    user: User,
    seo: SEO,
    template?: TemplateModel,
    seo_preset?: SEOPreset,
  ): Promise<Page> {
    const page: Page = await this.pageRepository.create({
      ...dto,
      status: status,
      manual_seo: this.seoService.checkManualChangeSeo(dto.seo, seo_preset, undefined),
    });
    await page.$set('user', user);
    await page.$set('template', template);
    await page.$set('seo', seo);
    await page.$set('seo_preset', seo_preset);
    await page.$set('draft', draft);
    return await page.reload();
  }

  /**update information page*/
  async updatePage(
    id: number,
    dto: UpdatePageDto,
    status: 'PUBLISHED' | 'DRAFT' | 'WAIT_FOR_PUBLISH',
    user: User,
    template?: TemplateModel,
    seo_preset?: SEOPreset,
  ): Promise<Page> {
    const page: Page = await this.pageRepository.findOne({ where: { id: id }, include: [SEO] });
    if (!page) {
      throw new HttpException(`Страница с id ${id} не найдена`, HttpStatus.NOT_FOUND);
    }
    const { seo, ...pageData } = dto;
    const updatedPage: Page = await this.pageRepository
      .update(
        { ...pageData, status: status, manual_seo: this.seoService.checkManualChangeSeo(seo, seo_preset, page.seo) },
        { where: { id }, returning: true },
      )
      .then(([, pages]) => pages[0]);
    await this.seoService.updateSeo(updatedPage.seo_id, seo);
    await updatedPage.$set('user', user);
    await updatedPage.$set('template', template);
    await updatedPage.$set('seo_preset', seo_preset);
    return await updatedPage.reload();
  }

  /**delete one or more pages*/
  async deletePages(dto: DeletePageDto): Promise<void> {
    const pages: Page[] = await this.pagesIdExistsCheck(dto.ids);
    pages.forEach((page: Page): void => {
      this.draftsService.cronDeleteJob(page.id);
    });
    await this.pageRepository.destroy({ where: { id: dto.ids } });
  }

  /**check pages in database*/
  private async pagesIdExistsCheck(page_ids: number[]): Promise<Page[]> {
    const pages: Page[] = await this.pageRepository.findAll({
      where: { id: page_ids },
      include: { all: true },
    });
    if (pages.length !== page_ids.length) {
      pages.forEach((draft: Page): void => {
        const index: number = page_ids.indexOf(draft.id);
        page_ids.splice(index, 1);
      });
      throw new DraftsNotFoundResponse(page_ids);
    }
    return pages;
  }
}
