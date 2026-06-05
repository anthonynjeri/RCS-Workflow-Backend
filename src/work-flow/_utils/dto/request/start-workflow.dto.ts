import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class StartWorkflowDto {
  @ApiProperty({
    description: 'Phone number of user',
    example: '33677068216',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'Id of a workflow',
    example: 'oi23de-d4rn43-feij45-fefo',
  })
  @IsString()
  @IsNotEmpty()
  workflowId: string;
}
