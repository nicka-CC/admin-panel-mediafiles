import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SeoDto } from '../../seo/dto/create-seo.dto';
import { IsBoolean, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Новая запись', description: 'Название поста' })
  @IsString()
  @MaxLength(64)
  readonly title: string;

  @ApiPropertyOptional({ example: 'Анонс', description: 'Анонс поста' })
  @IsString()
  readonly announcement?: string;

  @ApiProperty({ example: '<p>Текст новой записи<p>', description: 'Содержанине поста' })
  @IsString()
  @MinLength(0)
  readonly text?: string;

  @ApiProperty({ example: false, description: 'Видимость поста (true = открыт / false = скрыт)' })
  @IsBoolean()
  readonly visibility: boolean;

  @ApiPropertyOptional({ example: 1, description: 'id категории поста' })
  @IsOptional()
  @IsNumber()
  readonly category_id?: number;

  @ApiProperty({ type: SeoDto })
  seo: SeoDto;
}
