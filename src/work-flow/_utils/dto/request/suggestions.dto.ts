import { ApiProperty } from '@nestjs/swagger';

export class SuggestionsDto {
  @ApiProperty({
    description: 'text to be sent from suggestion',
    example: 'suggestion',
  })
  text?: string;
  @ApiProperty({
    description: 'PostBack data that helps reference or point to a node',
    example: 'go_to_suggestion',
  })
  postbackData?: string;
  @ApiProperty({
    description: 'Next node to rendered base on the choice',
    example: 'SUGGESTION',
  })
  nextNode?: string;
}
