import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateClientWorkflowDto {
  @ApiProperty({
    description: 'Name of the node ',
    example: 'START',
  })
  @IsString()
  nodeName: string;
}
