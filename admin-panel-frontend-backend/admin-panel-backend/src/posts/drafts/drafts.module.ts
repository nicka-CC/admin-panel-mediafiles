import { forwardRef, Module } from '@nestjs/common';
import { DraftsService } from './drafts.service';
import { DraftsController } from './drafts.controller';
import { UsersModule } from '../../users/users.module';
import { CategoriesModule } from '../categories/categories.module';
import { PostsModule } from '../posts.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostDraft } from './drafts.model';
import { SeoModule } from '../../seo/seo.module';
import { TemplatesModule } from '../../templates/templates.module';
import { SeoPresetsModule } from '../../seo/seo-presets/seo-presets.module';

@Module({
  providers: [DraftsService],
  controllers: [DraftsController],
  imports: [
    SequelizeModule.forFeature([PostDraft]),
    UsersModule,
    CategoriesModule,
    TemplatesModule,
    SeoModule,
    SeoPresetsModule,
    forwardRef(() => PostsModule),
  ],
  exports: [DraftsService]
})
export class DraftsModule {}
