import { Injectable } from '@nestjs/common';
import { MessagingRepository } from './messaging.repository';
import { SendMessageDto } from './_utils/dto/request/send-message.dto';
import { WorkFlowNodeDto } from '../work-flow/_utils/dto/response/work-flow-node.dto';

@Injectable()
export class MessagingService {
  constructor(private callBacksRepository: MessagingRepository) {}

  async sendMessage(messageDto: SendMessageDto) {
    return this.callBacksRepository.sendMessage(messageDto);
  }

  async sendCardMessage(messageDto: SendMessageDto) {
    return this.callBacksRepository.sendCardMessage(messageDto);
  }

  // async sendWorkFlowNode(
  //   phoneNumber: string,
  //   workflowNodeDto: WorkFlowNodeDto,
  // ) {
  //   return this.callBacksRepository.sendWorkflowNode(
  //     phoneNumber,
  //     workflowNodeDto,
  //   );
  // }
}
