import { ApiProperty } from '@nestjs/swagger';
import { SuggestionsDto } from './suggestions.dto';

export class CreateWorkflowNodeDTO {
  @ApiProperty({
    description: 'Main text of the workflow node',
    example: "Yes No Maybe I don't know",
  })
  text: string;

  @ApiProperty({
    description: 'An array of suggestions',
  })
  suggestions: SuggestionsDto[];
}
