import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class FilterDraftDto {
  @ApiPropertyOptional({ description: 'Фильтрация по названию', example: 'Новый', type: String })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  title?: string | object;

  @ApiPropertyOptional({ description: 'id категорий', type: Number, isArray: true })
  @IsOptional()
  @IsNumber()
  category_id?: number[] | object;

  @ApiPropertyOptional({ description: 'Нижний порог даты создания, Date() instance' })
  @IsOptional()
  @IsDate()
  date_min?: Date;

  @ApiPropertyOptional({ description: 'Верхний порог даты создания, Date() instance' })
  @IsOptional()
  @IsDate()
  date_max?: Date;
  createdAt?: object;
}
