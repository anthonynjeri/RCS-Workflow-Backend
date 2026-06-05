import { Module } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { MessagingModule } from '../messaging/messaging.module';
import { WorkFlowModule } from '../work-flow/work-flow.module';

@Module({
  imports: [MessagingModule, WorkFlowModule],
  providers: [WebhooksService],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
