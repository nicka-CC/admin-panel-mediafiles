import { Body, Controller, Delete, Get, Inject, Param, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { PagesService } from './pages.service';
import { DeletePageDto } from './dto/delete-page.dto';
import { RoleProperties } from '../roles/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../roles/roles.guard';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ValidationResponse } from '../validation/app.validation.response';
import { UnauthorizedExceptionResponse } from '../auth/responses/auth.unauthorized.responses';
import { ForbiddenAccessExceptionResponse } from '../roles/responses/roles.forbidden.responses';
import { Page } from './pages.model';
import { GetForPageIntf } from 'src/files/interfaces/service.interfaces';

@Controller('pages')
@ApiTags('Страницы')
export class PagesController {
  constructor(@Inject(PagesService) private readonly pagesService: PagesService) {}

  //GET
  /**get page*/
  @RoleProperties({ admin_panel_access: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Получение всех страниц' })
  @Get('/pages')
  async getPages(): Promise<Page[]> {
    return await this.pagesService.getPages();
  }

  /**get pages for paggination*/
  @UsePipes(new ValidationPipe())
  @RoleProperties({ admin_panel_access: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Получение страницы для пагинации' })
  @Get('/pages/:page/:per_page')
  async getPagesPagination(
    @Param('page') page: number,
    @Param('per_page') per_page: number,
  ): Promise<GetForPageIntf<Page>> {
    return await this.pagesService.getPagesPagination(page, per_page);
  }

  //**get pages by ID */
  @UsePipes(new ValidationPipe())
  @RoleProperties({ admin_panel_access: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Получение страницы по айди' })
  @ApiNotFoundResponse({ description: 'Page not found' })
  @Get('/pages/:id')
  async getPageById(@Param('id') id: number) {
    return await this.pagesService.getPageByID(id);
  }

  //DELETE
  // @UsePipes(new ValidationPipe())
  /**delete one or more pages*/
  @RoleProperties({ admin_panel_access: true, save_pages: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Удаление страниц' })
  @ApiBadRequestResponse({ status: 400, description: 'Error: Validation', type: ValidationResponse })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized', type: UnauthorizedExceptionResponse })
  @ApiForbiddenResponse({ description: 'Error: Forbidden', type: ForbiddenAccessExceptionResponse })
  @Delete('/delete')
  async deletePages(@Body() dto: DeletePageDto) {
    return await this.pagesService.deletePages(dto);
  }
}
