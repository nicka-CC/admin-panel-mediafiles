import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';
import { UpdatePageDto } from '../../dto/update-page.dto';

export class UpdatePageDraftDto extends UpdatePageDto {
  @ApiPropertyOptional({
    example: '2023-08-17T01:23:08.069Z',
    description: 'Дата, когда опубликуется и применятся изменения поста',
  })
  @IsOptional()
  @IsDate()
  date_to_publish?: Date;
}
