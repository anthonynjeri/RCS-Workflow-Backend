import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    description: 'Phone number of recipient',
    example: '33615031180',
  })
  @IsNotEmpty()
  phoneNumber: number;

  @ApiProperty({
    description: 'Message to send',
    example: 'Salut thomas ca va chef!?',
  })
  @IsNotEmpty()
  message: string;
}
