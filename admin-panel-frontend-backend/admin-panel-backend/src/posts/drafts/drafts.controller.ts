import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { DraftsService } from './drafts.service';
import { PostDraft } from './drafts.model';
import { CreatePostDraftDto } from './dto/create-draft.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { UserId } from '../../decorators/user-id.decorator';
import { UpdateDraftDto } from './dto/update-draft.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RolesGuard } from '../../roles/roles.guard';
import { RoleProperties } from '../../roles/roles.decorator';
import { DraftsConflictResponse } from './responses/drafts.conflict.responses';
import { ForbiddenAccessExceptionResponse } from '../../roles/responses/roles.forbidden.responses';
import { UnauthorizedExceptionResponse } from '../../auth/responses/auth.unauthorized.responses';
import { ValidationResponse } from '../../validation/app.validation.response';
import { DraftsDeleteSuccess } from './responses/drafts.ok.responses';
import { DraftNotFoundResponse, DraftsNotFoundResponse } from './responses/drafts.not-found.responses';
import { DeleteDraftsDto } from './dto/delete-drafts.dto';
import { PublishUpdateDraftDto } from './dto/publish-update-draft.dto';

@ApiTags('Посты')
@Controller('posts')
export class DraftsController {
  constructor(
    @Inject(DraftsService)
    private draftService: DraftsService,
  ) {}
  //GET
  /**get all drafts */
  @RoleProperties({ admin_panel_access: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Получение всех черновиков записей' })
  @Get('/drafts')
  async getDrafts(): Promise<PostDraft[]> {
    return await this.draftService.getPostDrafts();
  }

  /**get post draft by id */
  @RoleProperties({ admin_panel_access: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Получение черновика записи по айди' })
  @ApiNotFoundResponse({ description: 'Post draft not found' })
  @ApiOkResponse({ description: 'Success', type: PostDraft })
  @Get('/drafts/:id')
  async getDraftById(@Param('id') id: number): Promise<PostDraft> {
    return await this.draftService.getPostDraftByIdController(id);
  }

  //POST
  /**create new post without publication */
  // @UsePipes(new ValidationPipe())
  @RoleProperties({ admin_panel_access: true, save_posts: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Создание нового поста без публикации' })
  @ApiCreatedResponse({ description: 'Success', type: PostDraft })
  @ApiBadRequestResponse({ status: 400, description: 'Error: Validation', type: ValidationResponse })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedExceptionResponse })
  @ApiForbiddenResponse({ description: 'Error: Forbidden', type: ForbiddenAccessExceptionResponse })
  @ApiConflictResponse({ description: 'Error: Conflict', type: DraftsConflictResponse })
  @Post('/save')
  async savePost(@Body() dto: CreatePostDraftDto, @UserId() user_id: number): Promise<PostDraft> {
    return await this.draftService.createSaveDraft(dto, user_id);
  }

  /**create new posts with sheduled publication */
  // @UsePipes(new ValidationPipe())
  @RoleProperties({ admin_panel_access: true, publish_posts: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Создание нового поста с последующей публикацией' })
  @ApiCreatedResponse({ description: 'Success', type: PostDraft })
  @ApiBadRequestResponse({ status: 400, description: 'Error: Validation', type: ValidationResponse })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedExceptionResponse })
  @ApiForbiddenResponse({ description: 'Error: Forbidden', type: ForbiddenAccessExceptionResponse })
  @ApiConflictResponse({ description: 'Error: Conflict', type: DraftsConflictResponse })
  @Post('/publish')
  async publishPost(@Body() dto: CreatePostDraftDto, @UserId() user_id: number) {
    return await this.draftService.createPublishDraft(dto, user_id);
  }

  //PATCH
  /**update post with after publication */
  // @UsePipes(new ValidationPipe())
  @RoleProperties({ admin_panel_access: true, publish_posts: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Обновление поста с последующей публикацией' })
  @ApiOkResponse({ description: 'Success', type: PostDraft })
  @ApiBadRequestResponse({ status: 400, description: 'Error: Validation', type: ValidationResponse })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedExceptionResponse })
  @ApiForbiddenResponse({ description: 'Error: Forbidden', type: ForbiddenAccessExceptionResponse })
  @ApiNotFoundResponse({ description: 'Error: Not Found', type: DraftNotFoundResponse })
  @ApiConflictResponse({ description: 'Error: Conflict', type: DraftsConflictResponse })
  @Patch('/update-publish/:id')
  async updatePublishPost(
    @Param('id', ParseIntPipe) post_id: number,
    @Body() dto: UpdateDraftDto,
    @UserId() user_id: number,
  ): Promise<PostDraft> {
    return await this.draftService.updatePublishDraft(dto, post_id, user_id);
  }

  /**update just draft post */
  @RoleProperties({ admin_panel_access: true, publish_posts: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Обновление черновика поста' })
  @ApiOkResponse({ description: 'Success', type: PostDraft })
  @ApiBadRequestResponse({ status: 400, description: 'Error: Validation', type: ValidationResponse })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedExceptionResponse })
  @ApiForbiddenResponse({ description: 'Error: Forbidden', type: ForbiddenAccessExceptionResponse })
  @ApiNotFoundResponse({ description: 'Error: Not Found', type: DraftNotFoundResponse })
  @Patch('/update-draft/:id')
  async updateAndSaveDraft(
    @Param('id', ParseIntPipe) draft_id: number,
    @Body() dto: UpdateDraftDto,
    @UserId() user_id: number,
  ): Promise<PostDraft> {
    return await this.draftService.updateDraft(dto, 'DRAFT', draft_id, user_id, true);
  }

  /**update posts with publication */
  // @UsePipes(new ValidationPipe())
  @RoleProperties({ admin_panel_access: true, publish_posts: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Обновление постов с публикацией' })
  @ApiOkResponse({ description: 'Success', type: [PostDraft] })
  @ApiBadRequestResponse({ status: 400, description: 'Error: Validation', type: ValidationResponse })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedExceptionResponse })
  @ApiForbiddenResponse({ description: 'Error: Forbidden', type: ForbiddenAccessExceptionResponse })
  @ApiNotFoundResponse({ description: 'Error: Not Found', type: DraftsNotFoundResponse })
  @Patch('/update-multiple-publish')
  async updatePublishPosts(@Body() dto: PublishUpdateDraftDto): Promise<void> {
    return await this.draftService.publishDraftsStatus(dto);
  }
}
