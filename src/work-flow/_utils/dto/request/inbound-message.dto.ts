import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class InboundMessageDto {
  @ApiProperty({
    description: 'Phone number of user',
    example: '33677068216',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'Post-Back data',
    example: 'join_group',
  })
  @IsString()
  postbackData?: string;
}
