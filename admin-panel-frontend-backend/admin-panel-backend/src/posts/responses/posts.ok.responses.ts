import { ApiProperty } from '@nestjs/swagger';
import { PostDraft } from '../drafts/drafts.model';
import { PostModel } from '../posts.model';

export class PagesResponse {
  @ApiProperty({ example: 1 })
  count: number;
  @ApiProperty({ example: 1 })
  current_page: number;
  @ApiProperty({ example: 1 })
  total_pages: number;
  @ApiProperty({ type: [PostDraft] })
  rows: PostModel[];
}
