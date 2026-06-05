import { Injectable } from '@nestjs/common';
import { WorkFlowRepository } from './work-flow.repository';
import { InboundMessageDto } from './_utils/dto/request/inbound-message.dto';
import { MessagingService } from '../messaging/messaging.service';
import { CreateWorkFlowDto } from './_utils/dto/request/create-work-flow.dto';

@Injectable()
export class WorkFlowService {
  constructor(
    private readonly workFlowRepository: WorkFlowRepository,
    private readonly messagingService: MessagingService,
  ) {}

  async createWorkFlow(createWorkflowDto: CreateWorkFlowDto) {
    return this.workFlowRepository.create(createWorkflowDto);
  }
  async handleInboundNodeMessages(workFlowDto: InboundMessageDto) {
    return await this.workFlowRepository.handleInboundNodeMessages(workFlowDto);
  }

  // async startNewOutBoundWorkFlow(phoneNumber: string) {
  //   const session =
  //     await this.workFlowRepository.startNewOutBoundWorkFlow(phoneNumber);
  //
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //   const nodeToSend = this.workFlowRepository.workflow[session.currentNodeId];
  //   const messageToSend = await this.messagingService.sendWorkFlowNode(
  //     phoneNumber,
  //     nodeToSend,
  //   );
  //   console.log(messageToSend);
  //   return messageToSend;
  // }
}
