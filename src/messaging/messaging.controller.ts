import { Body, Controller, Param, Post, Query } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { ApiProperty } from '@nestjs/swagger';
import { SendMessageDto } from './_utils/dto/request/send-message.dto';

@Controller('callbacks')
export class MessagingController {
  constructor(private readonly callbacksService: MessagingService) {}

  @Post('sendMessage')
  @ApiProperty({
    description: 'sendMessage',
    example: '3360000001, message:"whatever',
  })
  async send(@Body() messageDto: SendMessageDto) {
    return this.callbacksService.sendMessage(messageDto);
  }

  @Post('cardMessage')
  @ApiProperty({
    description: 'Sending a message in card format',
  })
  async sendCard(@Body() messageDto: SendMessageDto) {
    return this.callbacksService.sendCardMessage(messageDto);
  }
}
