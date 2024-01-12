import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostModel } from './posts.model';
import { SeoModule } from '../seo/seo.module';
import { CategoriesModule } from './categories/categories.module';
import { ModulesModule } from '../modules/modules.module';
import { PostsInit } from './posts.init';
import { DraftsModule } from './drafts/drafts.module';
import { UsersModule } from '../users/users.module';
import { TemplatesModule } from '../templates/templates.module';

@Module({
  providers: [PostsService, PostsInit],
  imports: [
    SequelizeModule.forFeature([PostModel]),
    SeoModule,
    forwardRef(() => CategoriesModule),
    ModulesModule,
    UsersModule,
    TemplatesModule,
    forwardRef(() => DraftsModule),
  ],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
