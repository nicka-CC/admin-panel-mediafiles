import { forwardRef, Module } from '@nestjs/common';
import { DraftsService } from './drafts.service';
import { DraftsController } from './drafts.controller';
import { SeoModule } from '../../seo/seo.module';
import { UsersModule } from '../../users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { PageDraft } from './drafts.model';
import { TemplatesModule } from '../../templates/templates.module';
import { SeoPresetsModule } from '../../seo/seo-presets/seo-presets.module';
import { PagesModule } from '../pages.module';

@Module({
  providers: [DraftsService],
  controllers: [DraftsController],
  imports: [
    SequelizeModule.forFeature([PageDraft]),
    SeoModule,
    TemplatesModule,
    SeoPresetsModule,
    forwardRef(() => PagesModule),
    UsersModule,
  ],
  exports: [DraftsService],
})
export class DraftsModule {}
