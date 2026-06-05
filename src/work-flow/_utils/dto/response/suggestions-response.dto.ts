import { ApiProperty } from '@nestjs/swagger';

export class SuggestionsResponseDto {
  @ApiProperty({
    description: 'The type of suggestion',
    example: 'REPLY',
  })
  type: string;
  @ApiProperty({
    description: 'The text contained in the suggestion',
    example: 'random text',
  })
  text: string;

  @ApiProperty({
    description: 'The postbackData contained in the suggestion',
    example: 'send_info',
  })
  postbackData?: string;
}
