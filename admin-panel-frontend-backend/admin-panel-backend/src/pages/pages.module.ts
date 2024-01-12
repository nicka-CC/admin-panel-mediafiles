import { forwardRef, Module } from '@nestjs/common';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Page } from './pages.model';
import { DraftsModule } from './drafts/drafts.module';
import { SeoModule } from '../seo/seo.module';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [PagesService],
  controllers: [PagesController],
  imports: [SequelizeModule.forFeature([Page]), forwardRef(() => DraftsModule), SeoModule, UsersModule],
  exports: [PagesService],
})
export class PagesModule {}
