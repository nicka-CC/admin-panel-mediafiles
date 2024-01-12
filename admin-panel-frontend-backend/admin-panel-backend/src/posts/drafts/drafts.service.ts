import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostDraft } from './drafts.model';
import { PostModel } from '../posts.model';
import { User } from '../../users/user.model';
import { PostsCategory } from '../categories/category.model';
import { SEO } from '../../seo/seo.model';
import { UsersService } from '../../users/users.service';
import { CategoriesService } from '../categories/categories.service';
import { SeoService } from '../../seo/seo.service';
import { PostsService } from '../posts.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CreatePostDraftDto } from './dto/create-draft.dto';
import { CronJob } from 'cron';
import { UpdateDraftDto } from './dto/update-draft.dto';
import { PublishUpdateDraftDto } from './dto/publish-update-draft.dto';
import { ProcessData } from './interface/drafts.interface';
import { SeoPresetsService } from 'src/seo/seo-presets/seo-presets.service';
import { SEOPreset } from '../../seo/seo-presets/seo-presets.model';
import { ForbiddenMethodUnallowResponse } from 'src/roles/responses/roles.forbidden.responses';

@Injectable()
export class DraftsService {
  constructor(
    @InjectModel(PostDraft)
    private readonly postsDraftsRepository: typeof PostDraft,
    @Inject(UsersService)
    private readonly usersService: UsersService,
    @Inject(CategoriesService)
    private readonly categoriesService: CategoriesService,
    @Inject(SeoPresetsService)
    private readonly seoPresetService: SeoPresetsService,
    @Inject(SeoService)
    private readonly seoService: SeoService,
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async _getPostDraftById(id: number): Promise<PostDraft> {
    return await this.postsDraftsRepository.findOne({ where: { id }, include: [PostsCategory, User, PostModel] });
  }

  /**create draft, post in database */
  private async _createDraftAndPost(
    dto: CreatePostDraftDto,
    status: 'DRAFT' | 'PUBLISHED' | 'WAIT_FOR_PUBLISH',
    user_id: number,
  ): Promise<PostDraft> {
    const collectedData: ProcessData = await this._processData(dto, user_id);
    const draft: PostDraft = await this.postsDraftsRepository.create({
      ...dto,
      status: status,
      manual_seo: this.seoService.checkManualChangeSeo(
        dto.seo,
        collectedData.category ? collectedData.category.seo_preset : undefined,
        undefined,
      ),
    });
    await draft.$set('user', collectedData.user);
    await draft.$set('category', collectedData.category);
    const seo: SEO = await this.seoPresetService.createSeoPresetDrafts(collectedData.category.seo_preset, dto.seo);
    if (draft.status === 'WAIT_FOR_PUBLISH' || draft.status === 'DRAFT') {
      const post: PostModel = await this.postsService.createPost(
        {
          ...dto,
          visibility: false,
          seo: dto.seo,
        },
        status,
        seo,
        collectedData.category,
        collectedData.user,
        draft,
      );
      await draft.$set('post', post);
    } else {
      const post: PostModel = await this.postsService.createPost(
        dto,
        draft.status,
        seo,
        collectedData.category,
        collectedData.user,
        draft,
      );
      await draft.$set('post', post);
    }
    await draft.$set('seo', seo);
    return await draft.reload();
  }

  /**adding post, draft and time to the cron scheduler */
  private async _cronPublishJob(date: Date, post_id: number, draft_id: number): Promise<void> {
    const job_name = `Wait for publish post ${post_id}`;
    const job: CronJob = new CronJob(date, async (): Promise<void> => {
      const draft: PostDraft = await this._getPostDraftById(draft_id);
      await this.postsService.updatePost(
        post_id,
        {
          title: draft.title,
          announcement: draft.announcement,
          text: draft.text,
          visibility: draft.visibility,
          category_id: draft.category_id,
          seo: draft.seo,
        },
        'PUBLISHED',
        draft.category,
        draft.user,
      );
      if (draft.status !== 'PUBLISHED') {
        await draft.$set('status', 'PUBLISHED');
      }
    });
    this.schedulerRegistry.addCronJob(job_name, job);
    job.start();
  }

  /**deleting a post from the cron scheduler */
  cronDeleteJob(post_id: number): void {
    try {
      const job: CronJob = this.schedulerRegistry.getCronJob(`Wait for publish post ${post_id}`);
      if (job) {
        this.schedulerRegistry.deleteCronJob(`Wait for publish post ${post_id}`);
      }
    } catch (e) {}
  }

  /**information about the user and the post with which the creation or update is performed*/
  private async _processData(dto: CreatePostDraftDto | UpdateDraftDto, user_id: number): Promise<ProcessData> {
    const user: User = await this.usersService.getUserById(user_id);
    const category: PostsCategory | undefined = await this._categoryCheck(dto.category_id);
    return {
      user: user,
      category: category,
    };
  }

  /**check category post in database */
  private async _categoryCheck(category_id: number | undefined): Promise<PostsCategory | undefined> {
    if (!category_id) {
      return;
    }
    const category: PostsCategory = await this.categoriesService.getCategoryById(category_id);
    if (!category) {
      throw new HttpException(`Категория с id ${category_id} не найдена`, HttpStatus.NOT_FOUND);
    }
    return category;
  }

  /**get all drafts post */
  async getPostDrafts(): Promise<PostDraft[]> {
    return await this.postsDraftsRepository.findAll({
      include: [PostsCategory, User, PostModel],
    });
  }

  /**get draft post by ID */
  async getPostDraftByIdController(id: number): Promise<PostDraft> {
    return await this.postsDraftsRepository
      .findOne({ where: { id }, include: [{ model: PostsCategory, include: [SEOPreset] }, User, PostModel, SEO] })
      .then((postDraft: PostDraft) => {
        if (!postDraft) {
          throw new HttpException('Post draft not found', 404);
        }
        postDraft.seo = this.seoService.seoSwitch(postDraft.manual_seo, postDraft.seo, postDraft.category.seo_preset);
        return postDraft;
      });
  }

  /**create new posts with sheduled publication */
  async createPublishDraft(dto: CreatePostDraftDto, user_id: number): Promise<PostDraft> {
    if (!dto.date_to_publish || dto.date_to_publish.getTime() <= Date.now()) {
      return await this._createDraftAndPost(dto, 'PUBLISHED', user_id);
    } else {
      const draft: PostDraft = await this._createDraftAndPost(dto, 'WAIT_FOR_PUBLISH', user_id);
      await this._cronPublishJob(draft.date_to_publish, draft.post.id, draft.id);
      return draft;
    }
  }

  /**create new post without publication */
  async createSaveDraft(dto: CreatePostDraftDto, user_id: number): Promise<PostDraft> {
    return await this._createDraftAndPost(dto, 'DRAFT', user_id);
  }

  /**update draft in database */
  async updateDraft(
    dto: UpdateDraftDto,
    status: 'DRAFT' | 'PUBLISHED' | 'WAIT_FOR_PUBLISH',
    draft_id: number,
    user_id: number,
    save?: boolean,
  ): Promise<PostDraft> {
    const draft: PostDraft = await this.postsDraftsRepository.findOne({
      where: { id: draft_id },
      include: [{ model: SEO }, { model: PostsCategory, include: [SEOPreset] }, { model: PostModel }],
    });
    if (!draft) {
      throw new HttpException(`Черновик поста с id ${draft_id} не найден`, HttpStatus.NOT_FOUND);
    }
    if (save && draft.post.status == 'WAIT_FOR_PUBLISH') {
      throw new ForbiddenMethodUnallowResponse();
    }
    const collectedData: ProcessData = await this._processData(dto, user_id);
    const draftData: Omit<UpdateDraftDto, 'seo'> = dto;
    await this.postsDraftsRepository
      .update(
        {
          ...draftData,
          status: status,
          manual_seo: this.seoService.checkManualChangeSeo(
            dto.seo,
            // seo_preset из категории черновика или из новой категории
            (collectedData.category ? collectedData.category.seo_preset : undefined)
              ? collectedData.category.seo_preset
              : draft.category.seo_preset,
            draft.seo,
          ),
        },
        { where: { id: draft_id }, returning: true },
      )
      .then(([, postDrafts]) => postDrafts[0]);
    await this.seoService.updateSeo(draft.seo.id, dto.seo);
    return await draft.reload();
  }
  /**update post with after publication */
  async updatePublishDraft(dto: UpdateDraftDto, draft_id: number, user_id: number): Promise<PostDraft> {
    this.cronDeleteJob(draft_id);
    if (!dto.date_to_publish || dto.date_to_publish.getTime() <= Date.now()) {
      const draft: PostDraft = await this.updateDraft(dto, 'PUBLISHED', draft_id, user_id);
      await this.postsService.updatePost(
        draft.post_id,
        {
          title: draft.title,
          announcement: draft.announcement,
          text: draft.text,
          visibility: draft.visibility,
          category_id: draft.category_id,
          seo: draft.seo,
        },
        'PUBLISHED',
        draft.category,
        draft.user,
      );
      return draft;
    } else {
      const draft: PostDraft = await this.updateDraft(dto, 'WAIT_FOR_PUBLISH', draft_id, user_id);
      await this.postsService.updatePost(draft_id, dto, 'WAIT_FOR_PUBLISH', draft.category, draft.user);
      await this._cronPublishJob(draft.date_to_publish, draft.post.id, draft_id);
      return draft;
    }
  }

  /**update posts with publication */
  async publishDraftsStatus(dto: PublishUpdateDraftDto): Promise<void> {
    const status: { status: 'DRAFT' | 'PUBLISHED' } = { status: undefined };
    for (const id of dto.ids) {
      this.cronDeleteJob(id);
    }
    if (dto.publish) {
      status.status = 'PUBLISHED';
    } else {
      status.status = 'DRAFT';
    }
    await this.postsDraftsRepository.update(status, { where: { id: dto.ids } });
    await this.postsService.publishPostStatus(dto);
  }
}
