import { BelongsTo, Column, DataType, ForeignKey, HasOne, Model, Table } from 'sequelize-typescript';
import { PostsCategory } from '../categories/category.model';
import { User } from '../../users/user.model';
import { PostModel } from '../posts.model';
import { ApiProperty } from '@nestjs/swagger';
import { SEO } from '../../seo/seo.model';

export interface PostDraftCreationAttrs {
  title: string;
  announcement?: string;
  text?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'WAIT_FOR_PUBLISH';
  visibility: boolean;
  date_to_publish?: Date;
  seo_id: number;
  manual_seo: boolean;
}

@Table({ tableName: 'post_draft' })
export class PostDraft extends Model<PostDraft, PostDraftCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор поста' })
  @Column({ type: DataType.INTEGER, autoIncrement: true, unique: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: 'Новый пост', description: 'Название поста' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ApiProperty({ example: 'Анонс', description: 'Анонс поста' })
  @Column({ type: DataType.STRING, allowNull: true, defaultValue: '' })
  announcement: string;

  @ApiProperty({ example: '<p>Текст поста</p>', description: 'Текст поста' })
  @Column({ type: DataType.TEXT, allowNull: true, defaultValue: '' })
  text: string;

  @ApiProperty({ example: 'DRAFT | PUBLISHED | WAIT_FOR_PUBLISH', description: 'Статус поста' })
  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'DRAFT' })
  status: 'DRAFT' | 'PUBLISHED' | 'WAIT_FOR_PUBLISH';

  @ApiProperty({ example: false, description: 'Видимость поста (true = открыт / false = скрыт)' })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  visibility: boolean;

  @ApiProperty({
    example: '2023-08-17T01:23:08.069Z',
    description: 'Дата, когда опубликуется или применятся изменения поста',
  })
  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  date_to_publish: Date;

  @ForeignKey(() => SEO)
  seo_id: number;

  @BelongsTo(() => SEO)
  seo: SEO;

  @ApiProperty({ example: false })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  manual_seo: boolean;

  @ApiProperty({ example: 1, description: 'Уникальный идентификатор присущей посту категории' })
  @ForeignKey(() => PostsCategory)
  category_id: number;

  @BelongsTo(() => PostsCategory)
  category: PostsCategory;

  @ApiProperty({ example: 1, description: 'Уникальный идентификатор создателя/последнего редактора поста' })
  @ForeignKey(() => User)
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @ApiProperty({ example: 1, description: 'Уникальный идентификатор поста' })
  @ForeignKey(() => PostModel)
  post_id: number;

  @BelongsTo(() => PostModel, { onDelete: 'CASCADE' })
  post: PostModel;
}
