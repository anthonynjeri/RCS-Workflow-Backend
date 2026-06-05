import { Injectable } from '@nestjs/common';
import { SmsmodeRcsClient } from '@smsmode/rcs';
import { ConfigService } from '@nestjs/config';
import {
  EnvironmentVariables,
  SmsModeConfig,
} from '../_utils/config/env.config';
import { SendMessageDto } from './_utils/dto/request/send-message.dto';
import { WorkFlowNodeInterface } from '../work-flow/_utils/interface/work-flow-node.interface';

@Injectable()
export class MessagingRepository {
  private rcsClient: SmsmodeRcsClient;
  constructor(
    private configService: ConfigService<EnvironmentVariables, true>,
  ) {
    this.rcsClient = new SmsmodeRcsClient({
      apiKey:
        configService.get<SmsModeConfig>('SMSMODE').SMS_MODE_CLIENT_API_KEY,
    });
  }

  async sendMessage(messageDto: SendMessageDto) {
    console.log((messageDto.message, messageDto.phoneNumber));
    const message = await this.rcsClient.send({
      recipient: { to: `${messageDto.phoneNumber}` },
      body: { type: 'TEXT', text: messageDto.message },
      callbackUrlMo:
        'https://smsmode-hack-team-5.ngrok.dev/Rcs-Workflow-Backend-API/webhooks/rcs/mo',
      callbackUrlStatus:
        'https://smsmode-hack-team-5.ngrok.dev/Rcs-Workflow-Backend-API/webhooks/rcs/status',
    });

    console.log(message);
    return message;
  }

  async sendCardMessage(messageDto: SendMessageDto) {
    const message = await this.rcsClient.send({
      recipient: { to: `${messageDto.phoneNumber}` },
      body: {
        type: 'TEXT',
        text: messageDto.message,

        suggestions: [
          {
            type: 'REPLY',
            text: 'Get more info',
            postbackData: 'view_members',
          },
        ],
      },
      callbackUrlMo:
        'https://smsmode-hack-team-5.ngrok.dev/Rcs-Workflow-Backend-API/webhooks/rcs/mo',
      callbackUrlStatus:
        'https://smsmode-hack-team-5.ngrok.dev/Rcs-Workflow-Backend-API/webhooks/rcs/status',
    });

    return message;
  }

  async sendWorkflowNode(phoneNumber: string, node: WorkFlowNodeInterface) {
    const payload: any = {
      type: node.type,
      ...(node.text && { text: node.text }),
      ...(node.fileUrl && { fileUrl: node.fileUrl }),
      ...(node.thumbnailUrl && { thumbnailUrl: node.thumbnailUrl }),
      ...(node.orientation && { orientation: node.orientation }),
      ...(node.cardWidth && { cardWidth: node.cardWidth }),
      ...(node.content && { content: this.formatCardContent(node.content) }),
      ...(node.contents && {
        contents: node.contents.map((c) => this.formatCardContent(c)),
      }),
    };

    if (node.suggestions && node.suggestions.length > 0) {
      payload.suggestions = node.suggestions.map((suggestion) =>
        this.formatSuggestion(suggestion),
      );
    }

    try {
      return await this.rcsClient.send({
        recipient: { to: phoneNumber },
        body: payload,
        callbackUrlMo:
          'https://smsmode-hack-team-5.ngrok.dev/Rcs-Workflow-Backend-API/webhooks/rcs/mo',
        callbackUrlStatus:
          'https://smsmode-hack-team-5.ngrok.dev/Rcs-Workflow-Backend-API/webhooks/rcs/status',
      });
    } catch (error) {
      console.error(
        'Failed to send dynamic RCS message via smsmode API:',
        error,
      );
      throw error;
    }
  }

  private formatSuggestion(suggestion: any) {
    return {
      type: suggestion.type,
      text: suggestion.text,
      postbackData: suggestion.postbackData,
      ...(suggestion.url && { url: suggestion.url }),
      ...(suggestion.phoneNumber && { phoneNumber: suggestion.phoneNumber }),
      ...(suggestion.latitude && { latitude: suggestion.latitude }),
      ...(suggestion.longitude && { longitude: suggestion.longitude }),
      ...(suggestion.startTime && { startTime: suggestion.startTime }),
      ...(suggestion.endTime && { endTime: suggestion.endTime }),
      ...(suggestion.title && { title: suggestion.title }),
      ...(suggestion.description && { description: suggestion.description }),
    };
  }

  private formatCardContent(content: any) {
    return {
      ...(content.title && { title: content.title }),
      ...(content.description && { description: content.description }),
      ...(content.media && { media: content.media }),
      ...(content.suggestions && {
        suggestions: content.suggestions.map((s: any) =>
          this.formatSuggestion(s),
        ),
      }),
    };
  }
}
