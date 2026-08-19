import { Injectable } from '@nestjs/common';
import { WorkFlowRepository } from './work-flow.repository';
import { InboundMessageDto } from './_utils/dto/request/inbound-message.dto';
import { CreateWorkFlowDto } from './_utils/dto/request/create-work-flow.dto';

@Injectable()
export class WorkFlowService {
  constructor(private readonly workFlowRepository: WorkFlowRepository) {}

  async createWorkFlow(createWorkflowDto: CreateWorkFlowDto) {
    return this.workFlowRepository.create(createWorkflowDto);
  }

  async findAllWorkflows() {
    return this.workFlowRepository.findAll();
  }

  async findWorkflowById(id: string) {
    return this.workFlowRepository.findById(id);
  }

  async handleInboundNodeMessages(
    workFlowDto: InboundMessageDto,
    workflowId?: string,
  ) {
    return await this.workFlowRepository.handleInboundNodeMessages(
      workFlowDto,
      workflowId,
    );
  }
}
