import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PublishUpdateDraftDto {
  @ApiProperty({ example: [1] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Number)
  readonly ids: number[];

  @ApiProperty({ example: false })
  @IsBoolean()
  readonly publish: boolean;
}
