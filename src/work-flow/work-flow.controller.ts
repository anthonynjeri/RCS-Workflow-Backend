import { Body, Controller, Post } from '@nestjs/common';
import { WorkFlowService } from './work-flow.service';
import { InboundMessageDto } from './_utils/dto/request/inbound-message.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateWorkFlowDto } from './_utils/dto/request/create-work-flow.dto';

@Controller('work-flow')
export class WorkFlowController {
  constructor(private readonly workFlowService: WorkFlowService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workflow configuration' })
  @ApiResponse({
    status: 201,
    description: 'The workflow has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid payload.' })
  async create(@Body() createWorkFlowDto: CreateWorkFlowDto) {
    return await this.workFlowService.createWorkFlow(createWorkFlowDto);
  }
  @Post('start-conversation')
  async startAConversation(@Body() workflowDto: InboundMessageDto) {
    console.log(workflowDto);
    const response =
      await this.workFlowService.handleInboundNodeMessages(workflowDto);
    console.log(response);
    return response;
  }

  @Post('test-send')
  async testWorkflowDirectly(
    @Body()
    body: {
      phoneNumber: string;
      name: string;
      entryNodeId: string;
      nodes: Record<string, any>;
    },
  ) {
    console.log(
      `🚀 Received live test request for number: ${body.phoneNumber}`,
    );

    await this.workFlowService.createWorkFlow({
      name: body.name,
      entryNodeId: body.entryNodeId,
      nodes: body.nodes,
    });

    const startDto = {
      phoneNumber: body.phoneNumber,
      postbackData: body.entryNodeId,
    };

    return await this.workFlowService.handleInboundNodeMessages(startDto);
  }
}
