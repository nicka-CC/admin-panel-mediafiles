import { Body, Controller, Get, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { DraftsService } from './drafts.service';
import { CreateDraftDto } from './dto/create-draft.dto';
import { UserId } from '../../decorators/user-id.decorator';
import { UpdatePageDraftDto } from './dto/update-draft.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../roles/roles.guard';
import { RoleProperties } from '../../roles/roles.decorator';
import { PageDraft } from './drafts.model';
import { ValidationResponse } from '../../validation/app.validation.response';
import { UnauthorizedExceptionResponse } from '../../auth/responses/auth.unauthorized.responses';
import { ForbiddenAccessExceptionResponse } from '../../roles/responses/roles.forbidden.responses';

@Controller('pages')
@ApiTags('Страницы')
export class DraftsController {
  constructor(@Inject(DraftsService) private readonly draftsService: DraftsService) {}

  //POST
  /**create original and draft page*/
  @RoleProperties({ admin_panel_access: true, save_pages: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Создание страницы без публикации' })
  @ApiCreatedResponse({ description: 'Success', type: PageDraft })
  @ApiBadRequestResponse({ status: 400, description: 'Error: Validation', type: ValidationResponse })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedExceptionResponse })
  @ApiForbiddenResponse({ description: 'Error: Forbidden', type: ForbiddenAccessExceptionResponse })
  @Post('/create-save')
  async createSavePage(@Body() dto: CreateDraftDto, @UserId() user_id: number): Promise<PageDraft> {
    return await this.draftsService.createSavePage(dto, user_id);
  }

  /**create draft page and planned publication*/
  @RoleProperties({ admin_panel_access: true, publish_pages: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Создание страницы с публикацией' })
  @ApiOkResponse({ description: 'Success', type: PageDraft })
  @ApiBadRequestResponse({ status: 400, description: 'Error: Validation', type: ValidationResponse })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedExceptionResponse })
  @ApiForbiddenResponse({ description: 'Error: Forbidden', type: ForbiddenAccessExceptionResponse })
  @Post('create-publish')
  async createPublishPage(@Body() dto: CreateDraftDto, @UserId() user_id: number): Promise<PageDraft> {
    return await this.draftsService.createPublishPage(dto, user_id);
  }

  //GET
  /**get all drafts pages*/
  @RoleProperties({ admin_panel_access: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Получение всех черновиков страниц' })
  @ApiOkResponse({ description: 'Success', type: [PageDraft] })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedExceptionResponse })
  @ApiForbiddenResponse({ description: 'Error: Forbidden', type: ForbiddenAccessExceptionResponse })
  @Get('drafts')
  async getDrafts(): Promise<PageDraft[]> {
    return await this.draftsService.getPageDrafts();
  }

  /**get draft-page by id */
  @RoleProperties({ admin_panel_access: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Получение черновика страницы по айди' })
  @ApiNotFoundResponse({ description: 'Page draft not found' })
  @ApiOkResponse({ description: 'Success', type: PageDraft })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedExceptionResponse })
  @ApiForbiddenResponse({ description: 'Error: Forbidden', type: ForbiddenAccessExceptionResponse })
  @Get('draft/:id')
  async getDraftById(@Param('id') id: number): Promise<PageDraft> {
    return await this.draftsService.getPageDraftById(id);
  }

  //PATCH
  /**update page without publication*/
  @RoleProperties({ admin_panel_access: true, publish_pages: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Обновление страницы без публикации' })
  @ApiOkResponse({ description: 'Success', type: PageDraft })
  @ApiBadRequestResponse({ status: 400, description: 'Error: Validation', type: ValidationResponse })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedExceptionResponse })
  @ApiForbiddenResponse({ description: 'Error: Forbidden', type: ForbiddenAccessExceptionResponse })
  @Patch('update-publish/:id')
  async updatePublishPage(
    @Body() dto: UpdatePageDraftDto,
    @Param('id') draft_id: number,
    @UserId() user_id: number,
  ): Promise<PageDraft> {
    return await this.draftsService.updatePublishDraft(dto, draft_id, user_id);
  }

  /**update and save just page draft*/
  @RoleProperties({ admin_panel_access: true, publish_pages: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Обновление и сохранение только черновиков' })
  @ApiOkResponse({ description: 'Success', type: PageDraft })
  @ApiBadRequestResponse({ status: 400, description: 'Error: Validation', type: ValidationResponse })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedExceptionResponse })
  @ApiForbiddenResponse({ description: 'Error: Forbidden', type: ForbiddenAccessExceptionResponse })
  @ApiNotFoundResponse({ description: 'Page draft not found' })
  @Patch('update-draft/:id')
  async updateAndSaveDraft(
    @Body() dto: UpdatePageDraftDto,
    @Param('id') draft_id: number,
    @UserId() user_id: number,
  ): Promise<PageDraft> {
    return await this.draftsService.updateDraft(dto, draft_id, 'DRAFT', user_id, true);
  }
}
