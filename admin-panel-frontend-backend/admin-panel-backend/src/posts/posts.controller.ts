import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostModel } from './posts.model';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RoleProperties } from '../roles/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../roles/roles.guard';
import { ValidationResponse } from '../validation/app.validation.response';
import { ForbiddenAccessExceptionResponse } from '../roles/responses/roles.forbidden.responses';
import { FilterDraftDto } from './drafts/dto/filter-draft.dto';
import { PagesResponse } from './responses/posts.ok.responses';
import { UnauthorizedExceptionResponse } from 'src/auth/responses/auth.unauthorized.responses';
import { DeleteDraftsDto } from './drafts/dto/delete-drafts.dto';
import { DraftNotFoundResponse } from './drafts/responses/drafts.not-found.responses';
import { DraftsDeleteSuccess } from './drafts/responses/drafts.ok.responses';

@ApiTags('Посты')
@Controller('posts')
export class PostsController {
  constructor(
    @Inject(PostsService)
    private postsService: PostsService,
  ) {}
  //GET
  /**get draft posts for paggination */
  @UsePipes(new ValidationPipe())
  @RoleProperties({ admin_panel_access: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Черновики постов с пагинацией' })
  @ApiOkResponse({ type: PagesResponse })
  @ApiBadRequestResponse({ status: 400, description: 'Error: Validation', type: ValidationResponse })
  @ApiForbiddenResponse({ type: ForbiddenAccessExceptionResponse })
  @Get('/posts-drafts/:current_page/:per_page')
  async getDraftsPagination(
    @Param('current_page', new ParseIntPipe()) page: number,
    @Param('per_page', new ParseIntPipe()) per_page: number,
    @Query() draftsFilter: FilterDraftDto,
  ): Promise<PagesResponse> {
    return await this.postsService.getPostsPagination(page, per_page, draftsFilter);
  }

  /**get all posts */
  @UsePipes(new ValidationPipe())
  @RoleProperties({ admin_panel_access: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Получение всех постов' })
  @Get('/posts')
  async getPosts(): Promise<PostModel[]> {
    return await this.postsService.getPosts();
  }

  /**get post by ID */
  @UsePipes(new ValidationPipe())
  @RoleProperties({ admin_panel_access: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Получение поста по айти' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @Get('/posts/:id')
  async getPostById(@Param('id') id: number): Promise<PostModel> {
    return await this.postsService.getPostByID(id);
  }

  /**delete unpublication posts */
  // @UsePipes(new ValidationPipe())
  @RoleProperties({ admin_panel_access: true, save_posts: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Удаление неопубликованного поста' })
  @ApiOkResponse({ description: 'Success', type: DraftsDeleteSuccess })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedExceptionResponse })
  @ApiForbiddenResponse({ description: 'Error: Forbidden', type: ForbiddenAccessExceptionResponse })
  @ApiNotFoundResponse({ description: 'Error: Not Found', type: DraftNotFoundResponse })
  @Delete('/delete/:id')
  async deletePostDrafts(@Body() dto: DeleteDraftsDto): Promise<void> {
    return await this.postsService.deletePostsDrafts(dto);
  }
}
