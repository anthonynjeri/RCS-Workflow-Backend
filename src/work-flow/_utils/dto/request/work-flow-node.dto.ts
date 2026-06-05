import { IsOptional, IsString } from 'class-validator';
import { SuggestionsDto } from './suggestions.dto';

export class WorkFlowNodeDTO {
  @IsString()
  name: string;

  @IsOptional()
  text: string;

  @IsOptional()
  suggestions?: SuggestionsDto[];
}
