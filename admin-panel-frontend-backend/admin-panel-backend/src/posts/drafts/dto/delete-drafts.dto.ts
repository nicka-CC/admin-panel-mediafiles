import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteDraftsDto {
  @ApiProperty({
    example: [1],
    description: 'id постов',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Number)
  readonly ids: number[];
}
