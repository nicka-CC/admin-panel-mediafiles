import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';
import { CreatePostDto } from '../../dto/create-post.dto';

export class CreatePostDraftDto extends CreatePostDto {
  @ApiPropertyOptional({
    example: '2023-08-17T01:23:08.069Z',
    description: 'Дата, когда опубликуется и применятся изменения поста',
  })
  @IsOptional()
  @IsDate()
  readonly date_to_publish?: Date;
}
