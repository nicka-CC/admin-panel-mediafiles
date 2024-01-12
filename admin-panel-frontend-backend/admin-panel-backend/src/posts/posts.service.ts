import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostModel } from './posts.model';
import { PostsCategory } from './categories/category.model';
import { SeoService } from '../seo/seo.service';
import { SEO } from '../seo/seo.model';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';
import { CategoriesService } from './categories/categories.service';
import { SEOPreset } from '../seo/seo-presets/seo-presets.model';
import { PostDraft } from './drafts/drafts.model';
import { Op } from 'sequelize';
import { PublishUpdateDraftDto } from './drafts/dto/publish-update-draft.dto';
import { FilterDraftDto } from './drafts/dto/filter-draft.dto';
import { isArray } from 'class-validator';
import { PagesResponse } from './responses/posts.ok.responses';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DeleteDraftsDto } from './drafts/dto/delete-drafts.dto';
import { DraftsService } from './drafts/drafts.service';
import { PostsNotFoundResponse } from './responses/drafts.not-found.responses';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostModel)
    private postRepository: typeof PostModel,
    @Inject(forwardRef(() => CategoriesService))
    private postsCategoryService: CategoriesService,
    @Inject(SeoService)
    private seoService: SeoService,
    @Inject(DraftsService)
    private draftService: DraftsService,
    @Inject(UsersService)
    private usersService: UsersService,
  ) {}

  /**check drafts in database */
  private async _postsIdExistsCheck(post_ids: number[]): Promise<PostModel[]> {
    const posts: PostModel[] = await this.postRepository.findAll({
      where: { id: post_ids },
      include: { all: true },
    });
    if (posts.length !== post_ids.length) {
      posts.forEach((draft: PostModel): void => {
        const index: number = post_ids.indexOf(draft.id);
        post_ids.splice(index, 1);
      });
      throw new PostsNotFoundResponse(post_ids);
    }
    return posts;
  }

  /**get all posts */
  async getPosts(): Promise<PostModel[]> {
    return await this.postRepository.findAll({
      include: [
        {
          model: SEO,
        },
        {
          model: PostsCategory,
          include: [
            {
              model: SEOPreset,
            },
          ],
        },
        {
          model: User,
        },
        {
          model: PostDraft,
        },
      ],
    });
  }

  /**get draft posts for paggination */
  async getPostsPagination(page: number, per_page: number, draftFilter: FilterDraftDto): Promise<PagesResponse> {
    if (draftFilter.title) {
      draftFilter.title = { [Op.substring]: draftFilter.title };
    }
    if (draftFilter.category_id) {
      if (!isArray(draftFilter.category_id)) {
        draftFilter.category_id = [draftFilter.category_id];
      }
    }
    if (draftFilter.date_max && draftFilter.date_min) {
      draftFilter.createdAt = { createdAt: { [Op.between]: draftFilter.date_min } };
      delete draftFilter.date_min;
      delete draftFilter.date_max;
    } else if (draftFilter.date_min) {
      draftFilter.createdAt = { createdAt: { [Op.gte]: draftFilter.date_min } };
      delete draftFilter.date_min;
    } else if (draftFilter.date_max) {
      draftFilter.createdAt = { createdAt: { [Op.lte]: draftFilter.date_max } };
      delete draftFilter.date_max;
    }
    const offset: number = (page - 1) * per_page;
    return await this.postRepository
      .findAndCountAll({
        limit: per_page,
        offset: offset,
        order: ['createdAt'],
        attributes: ['id', 'title', 'status', 'visibility', 'updatedAt', 'manual_seo', 'draft_id'],
        where: { ...draftFilter },
        include: [
          {
            model: User,
            attributes: ['id', 'name'],
          },
          {
            model: PostsCategory,
            attributes: ['id', 'name', 'system_category'],
          },
          {
            model: PostDraft,
            attributes: ['id'],
          },
        ],
      })
      .then(({ count, rows }): PagesResponse => {
        return { current_page: page, total_pages: Math.ceil(count / per_page), count: count, rows: rows };
      });
  }

  /**get post by ID */
  async getPostByID(id: number): Promise<PostModel> {
    return await this.postRepository
      .findByPk(id, {
        include: [
          {
            model: SEO,
          },
          {
            model: PostsCategory,
            include: [
              {
                model: SEOPreset,
              },
            ],
          },
          {
            model: User,
          },
          {
            model: PostDraft,
          },
        ],
      })
      .then((post) => {
        if (!post) {
          throw new HttpException('Post not found', 404);
        }
        post.seo = this.seoService.seoSwitch(post.manual_seo, post.seo, post.category.seo_preset);
        return post;
      });
  }

  /**create new posts in database */
  async createPost(
    dto: CreatePostDto,
    status: 'DRAFT' | 'PUBLISHED' | 'WAIT_FOR_PUBLISH',
    seo: SEO,
    category: PostsCategory,
    user: User,
    draft: PostDraft,
  ): Promise<PostModel> {
    const postData: Omit<UpdatePostDto, 'seo'> = dto;
    const post: PostModel = await this.postRepository.create({
      ...postData,
      status: status,
      manual_seo: this.seoService.checkManualChangeSeo(dto.seo, category.seo_preset, undefined),
    });
    await post.$set('category', category);
    await post.$set('seo', seo);
    await post.$set('user', user);
    await post.$set('draft', draft);
    return await post.reload();
  }

  /**update post in database */
  async updatePost(
    post_id: number,
    dto: UpdatePostDto,
    status: 'DRAFT' | 'PUBLISHED' | 'WAIT_FOR_PUBLISH',
    category: PostsCategory,
    user: User,
  ): Promise<PostModel> {
    const post: PostModel = await this.postRepository.findOne({ where: { id: post_id }, include: [SEO] });
    if (!post) {
      throw new HttpException(`Пост с id ${post_id} не найден`, HttpStatus.NOT_FOUND);
    }
    const postData: Omit<UpdatePostDto, 'seo'> = dto;
    const updatedPost: PostModel = await this.postRepository
      .update(
        {
          ...postData,
          status: status,
          manual_seo: this.seoService.checkManualChangeSeo(
            dto.seo,
            category ? category.seo_preset : undefined,
            post.seo,
          ),
        },
        { where: { id: post_id }, returning: true },
      )
      .then(([, postModels]) => postModels[0]);
    await updatedPost.$set('category', category);
    await updatedPost.$set('user', user);
    return updatedPost.reload();
  }

  /**update status publication in database */
  async publishPostStatus(dto: PublishUpdateDraftDto): Promise<void> {
    const status: { status: 'DRAFT' | 'PUBLISHED' } = { status: undefined };
    if (dto.publish) {
      status.status = 'PUBLISHED';
    } else {
      status.status = 'DRAFT';
    }
    await this.postRepository.update(status, { where: { id: dto.ids } });
  }

  /**delete unpublication posts*/
  async deletePostsDrafts(dto: DeleteDraftsDto): Promise<void> {
    await this._postsIdExistsCheck(dto.ids);
    dto.ids.forEach((id: number) => this.draftService.cronDeleteJob(id));
    await this.postRepository.destroy({ where: { id: dto.ids } });
  }
}
