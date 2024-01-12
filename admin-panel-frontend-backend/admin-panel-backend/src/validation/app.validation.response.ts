import { ApiProperty } from '@nestjs/swagger';

const validationMessage: string[] = [
  'fieldName1 - error message 1',
  'fieldName1 - error message 2',
  'fieldName2 - error message 3',
];
const validationError = 'Bad Request';
export class ValidationResponse {
  constructor() {
    this.statusCode = 400;
    this.message = validationMessage;
    this.error = validationError;
  }
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: validationMessage })
  message: string[];

  @ApiProperty({ example: validationError })
  error: string;
}
