import { ApiProperty } from '@nestjs/swagger';
import { HttpException, HttpStatus } from '@nestjs/common';

export class DraftNotFoundResponse extends HttpException {
  @ApiProperty({ example: 404 })
  statusCode: HttpStatus.NOT_FOUND;

  @ApiProperty({ example: 'Пост с id {id} не найден' })
  message: string;
  constructor(id: number) {
    super(`Пост с id ${id} не найден`, 404);
  }
}

export class DraftsNotFoundResponse extends HttpException {
  @ApiProperty({ example: 404 })
  statusCode: HttpStatus.NOT_FOUND;

  @ApiProperty({ example: 'Посты с id {id} не найдены' })
  message: string;

  constructor(ids: number[]) {
    super(`Посты с id ${ids} не найдены`, 404);
  }
}
