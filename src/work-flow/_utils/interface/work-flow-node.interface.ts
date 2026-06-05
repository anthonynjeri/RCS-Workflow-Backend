export type RcsMessageType = 'BASIC' | 'TEXT' | 'CARD' | 'CAROUSEL' | 'FILE';

export type SuggestionType =
  | 'REPLY'
  | 'OPEN_URL'
  | 'DIAL_PHONE'
  | 'SHOW_LOCATION'
  | 'REQUEST_LOCATION'
  | 'CREATE_CALENDAR_EVENT';

export interface WorkflowSuggestion {
  type: SuggestionType;
  text: string;
  postbackData: string;
  nextNode?: string;
  url?: string;
  phoneNumber?: string;
  latitude?: number;
  longitude?: number;
  startTime?: string;
  endTime?: string;
  title?: string;
  description?: string;
}

export interface CardContent {
  title?: string;
  description?: string;
  media?: {
    fileUrl: string;
    height?: 'SMALL' | 'MEDIUM' | 'LARGE';
  };
  suggestions?: WorkflowSuggestion[];
}

export interface WorkFlowNodeInterface {
  type: RcsMessageType;
  text?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  orientation?: 'VERTICAL' | 'HORIZONTAL';
  content?: CardContent;
  cardWidth?: 'SMALL' | 'MEDIUM';
  contents?: CardContent[];
  suggestions?: WorkflowSuggestion[];
}
