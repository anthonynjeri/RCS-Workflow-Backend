import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('workflow_conversation')
export class WorkflowConversation {
  @PrimaryColumn()
  phoneNumber: string;

  @Column({ default: 'START' })
  currentNodeId: string;

  @Column()
  workflowId: string;

  @UpdateDateColumn()
  lastInteraction: Date;
}
