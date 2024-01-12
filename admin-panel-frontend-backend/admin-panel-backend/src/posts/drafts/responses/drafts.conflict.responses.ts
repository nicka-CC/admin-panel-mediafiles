import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export class DraftsConflictResponse {
  @ApiProperty({ example: HttpStatus.CONFLICT })
  statusCode: number = HttpStatus.CONFLICT;

  @ApiProperty({ example: `Пост с названием '{title}' уже существует` })
  message: any;

  constructor(title: string) {
    this.message = `Пост с названием '${title}' уже существует`;
  }
}
