import { BelongsTo, Column, DataType, ForeignKey, HasOne, Model, Table } from 'sequelize-typescript';
import { PostsCategory } from './categories/category.model';
import { User } from '../users/user.model';
import { SEO } from '../seo/seo.model';
import { PostDraft } from './drafts/drafts.model';
import { ApiProperty } from '@nestjs/swagger';

export interface PostCreationAttrs {
  title: string;
  announce?: string;
  text?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'WAIT_FOR_PUBLISH';
  visibility: boolean;
  seo_id: number;
  manual_seo: boolean;
}

@Table({ tableName: 'post' })
export class PostModel extends Model<PostModel, PostCreationAttrs> {
  @ApiProperty({ example: 1, description: 'id страницы' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, allowNull: true, defaultValue: '' })
  announcement: string;

  @Column({ type: DataType.TEXT, allowNull: false, defaultValue: '' })
  text: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'DRAFT' })
  status: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  visibility: boolean;

  @ForeignKey(() => SEO)
  seo_id: number;

  @BelongsTo(() => SEO)
  seo: SEO;

  @ApiProperty({ example: false })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  manual_seo: boolean;

  @ForeignKey(() => PostsCategory)
  category_id: number;

  @BelongsTo(() => PostsCategory, { onDelete: 'CASCADE' })
  category: PostsCategory;

  @ForeignKey(() => User)
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => PostDraft)
  draft_id: number;

  @HasOne(() => PostDraft, { onDelete: 'CASCADE' })
  draft: PostDraft;
}
