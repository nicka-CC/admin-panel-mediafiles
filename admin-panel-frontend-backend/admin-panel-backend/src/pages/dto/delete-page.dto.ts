import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class DeletePageDto {
  @ApiProperty({ example: [1], description: 'id страниц' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Number)
  ids: number[];
}
