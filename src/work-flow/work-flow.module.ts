import { Module } from '@nestjs/common';
import { WorkFlowController } from './work-flow.controller';
import { WorkFlowService } from './work-flow.service';
import { WorkFlowRepository } from './work-flow.repository';
import { MessagingModule } from '../messaging/messaging.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowConversation } from './_utils/entity/work-flow-conversation.entity';
import { Workflow } from './_utils/entity/work-flow.entity';

@Module({
  imports: [
    MessagingModule,
    TypeOrmModule.forFeature([WorkflowConversation, Workflow]),
  ],
  controllers: [WorkFlowController],
  providers: [WorkFlowService, WorkFlowRepository],
  exports: [WorkFlowService, WorkFlowRepository],
})
export class WorkFlowModule {}
