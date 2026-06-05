import { Body, Controller, Get, Post } from '@nestjs/common';
import { WorkFlowService } from '../work-flow/work-flow.service';
import { InboundMessageDto } from '../work-flow/_utils/dto/request/inbound-message.dto';

@Controller('webhooks/rcs')
export class WebhooksController {
  constructor(private readonly workflowService: WorkFlowService) {}

  @Post('mo')
  async handleCallbacks(@Body() payload: any) {
    console.log(
      'Incoming Webhook Payload from smsmode:',
      JSON.stringify(payload, null, 2),
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const phoneNumber = payload.recipient.to;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const postBackData = payload.body.postbackData;
    console.log(phoneNumber, postBackData);

    const dto: InboundMessageDto = {
      phoneNumber: phoneNumber as string,
      postbackData: postBackData as string,
    };
    if (phoneNumber) {
      await this.workflowService.handleInboundNodeMessages(dto);
    }

    return { received: true };
  }

  @Get('status')
  handleMessageStatus() {
    return { received: true };
  }
}
