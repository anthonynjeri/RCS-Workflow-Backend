import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateWorkFlowDto {
  @ApiProperty({
    example: 'Hack-5',
    description: 'The name of the workflow',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'START',
    description: 'The starting node identifier',
  })
  @IsString()
  @IsOptional()
  entryNodeId?: string;

  @ApiProperty({
    description: 'The JSON structure defining the workflow nodes',
    example: {
      START: {
        type: 'TEXT',
        text: 'Hello and welcome to Hack-5, What would you like to learn about hack-5?',
        suggestions: [
          {
            type: 'REPLY',
            text: 'See group Members',
            postbackData: 'view_members',
            nextNode: 'members_node',
          },
          {
            type: 'REPLY',
            text: 'Join group',
            postbackData: 'join_group',
            nextNode: 'support_node',
          },
        ],
      },
      members_node: {
        type: 'TEXT',
        text: 'Click on a member to see profile',
        suggestions: [
          {
            type: 'REPLY',
            text: 'Anthony',
            postbackData: 'go_to_anthony',
            nextNode: 'anthony_node',
          },
          {
            type: 'REPLY',
            text: 'Thomas',
            postbackData: 'go_to_thomas',
            nextNode: 'thomas_node',
          },
        ],
      },
      thomas_node: { type: 'TEXT', text: 'Simplon Student', suggestions: [] },
      anthony_node: { type: 'TEXT', text: 'Simplon Student', suggestions: [] },
      support_node: {
        type: 'TEXT',
        text: "The admin has been notified and you'll be added to the group after vetting",
        suggestions: [],
      },
    },
  })
  @IsObject()
  nodes: Record<string, any>;
}
