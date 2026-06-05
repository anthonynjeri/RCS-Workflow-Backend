import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkFlowNodeInterface } from '../interface/work-flow-node.interface';

@Entity('work-flow')
export class Workflow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 'START' })
  entryNodeId: string;

  @Column({ type: 'json' })
  nodes: Record<string, WorkFlowNodeInterface>;

  @CreateDateColumn()
  createdAt: Date;
}
