import { CreatePageDto } from '../../dto/create-page.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';

export class CreateDraftDto extends CreatePageDto {
  @ApiPropertyOptional({
    example: '2023-08-17T01:23:08.069Z',
    description: 'Дата, когда опубликуется и применятся изменения поста',
  })
  @IsOptional()
  @IsDate()
  date_to_publish?: Date;
}
