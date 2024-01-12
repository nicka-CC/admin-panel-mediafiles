import { ApiProperty } from '@nestjs/swagger';
import { PostDraft } from '../drafts.model';

export class DraftsDeleteSuccess {
  @ApiProperty({ example: `Посты '{title}' успешно удалёны` })
  message: string;
  constructor(title: string[]) {
    this.message = `Посты '${title}' успешно удалёны`;
  }
}
