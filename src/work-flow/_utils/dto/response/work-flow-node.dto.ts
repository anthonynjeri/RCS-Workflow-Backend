import { ApiProperty } from '@nestjs/swagger';
import { SuggestionsResponseDto } from './suggestions-response.dto';

export class WorkFlowNodeDto {
  @ApiProperty()
  text?: string;
  @ApiProperty()
  suggestions?: SuggestionsResponseDto[];
}
