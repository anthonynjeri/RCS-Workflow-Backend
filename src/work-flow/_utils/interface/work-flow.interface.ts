import { SuggestionInterface } from './suggestion.interface';

export interface WorkFlowInterface {
  text: string;
  suggestions: SuggestionInterface[];
  isTerminal: boolean;
}
