import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class SmsWebhookBodyDto {
  @IsString()
  type: string;
  @IsString()
  postbackData?: string;
  @IsString()
  text?: string;
}

export class SmsWebhookRecipientDto {
  @IsString()
  to: string;
}

export class SmsWebhookPayloadDto {
  @IsString()
  direction: string;

  @Type(() => SmsWebhookRecipientDto)
  recipient: SmsWebhookRecipientDto;

  @Type(() => SmsWebhookBodyDto)
  body: SmsWebhookBodyDto;
}
