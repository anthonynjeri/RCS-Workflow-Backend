import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkflowConversation } from './_utils/entity/work-flow-conversation.entity';
import { InboundMessageDto } from './_utils/dto/request/inbound-message.dto';
import { Repository } from 'typeorm';
import { MessagingRepository } from '../messaging/messaging.repository';
import { Workflow } from './_utils/entity/work-flow.entity';
import { WorkflowSuggestion } from './_utils/interface/work-flow-node.interface';
import { CreateWorkFlowDto } from './_utils/dto/request/create-work-flow.dto';

@Injectable()
export class WorkFlowRepository {
  constructor(
    @InjectRepository(WorkflowConversation)
    private workflowConversationRepository: Repository<WorkflowConversation>,
    @InjectRepository(Workflow)
    private workflowRepository: Repository<Workflow>,
    private messagingService: MessagingRepository,
  ) {}

  async create(createWorkFlowDto: CreateWorkFlowDto) {
    const createdWorkflow = this.workflowRepository.create(createWorkFlowDto);
    return await this.workflowRepository.save(createdWorkflow);
  }

  async findAll() {
    return this.workflowRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: string) {
    const workflow = await this.workflowRepository.findOneBy({ id });
    if (!workflow) throw new NotFoundException(`Workflow ${id} not found.`);
    return workflow;
  }

  async handleInboundNodeMessages(
    workFlowDto: InboundMessageDto,
    workflowId?: string,
  ) {
    // Resolve the session first so we can use its stored workflowId when no explicit id is given
    let session = await this.workflowConversationRepository.findOneBy({
      phoneNumber: workFlowDto.phoneNumber,
    });

    const resolvedWorkflowId = workflowId ?? session?.workflowId;

    const workflowConfig = resolvedWorkflowId
      ? await this.workflowRepository.findOneBy({ id: resolvedWorkflowId })
      : await this.workflowRepository.findOne({
          where: { name: 'Hack-5' },
          order: { createdAt: 'DESC' },
        });
    if (!workflowConfig)
      throw new NotFoundException('Workflow configuration not found.');

    const workflowNodes = workflowConfig.nodes;

    if (!session) {
      session = this.workflowConversationRepository.create({
        phoneNumber: workFlowDto.phoneNumber,
        currentNodeId: workflowConfig.entryNodeId,
        workflowId: workflowConfig.id,
      });
      await this.workflowConversationRepository.save(session);
    } else if (workflowId && session.workflowId !== workflowId) {
      // A new workflow is being sent to this user — reset their session
      session.currentNodeId = workflowConfig.entryNodeId;
      session.workflowId = workflowConfig.id;
      await this.workflowConversationRepository.update(
        { phoneNumber: workFlowDto.phoneNumber },
        { currentNodeId: workflowConfig.entryNodeId, workflowId: workflowConfig.id },
      );
    }

    const currentNode = workflowNodes[session.currentNodeId];
    if (!currentNode)
      throw new NotFoundException(`Node ${session.currentNodeId} missing.`);

    let nextNodeKey = session.currentNodeId;

    // Normalize incoming postback payload
    const incomingPostback = workFlowDto.postbackData || null;

    if (incomingPostback) {
      const allPossibleSuggestions: WorkflowSuggestion[] = [
        ...(currentNode.suggestions || []),
      ];

      if (currentNode.content?.suggestions) {
        allPossibleSuggestions.push(...currentNode.content.suggestions);
      }
      if (currentNode.contents) {
        currentNode.contents.forEach((card) => {
          if (card.suggestions)
            allPossibleSuggestions.push(...card.suggestions);
        });
      }

      const transition = allPossibleSuggestions.find(
        (suggestion) => suggestion.postbackData === incomingPostback,
      );

      if (transition && transition.nextNode) {
        nextNodeKey = transition.nextNode;
      } else if (incomingPostback === workflowConfig.entryNodeId) {
        nextNodeKey = workflowConfig.entryNodeId;
      } else {
        const hasOutboundRoutes =
          (currentNode.suggestions && currentNode.suggestions.length > 0) ||
          (currentNode.content?.suggestions &&
            currentNode.content.suggestions.length > 0) ||
          (currentNode.contents &&
            currentNode.contents.some(
              (cardContent) =>
                cardContent.suggestions && cardContent.suggestions.length > 0,
            ));

        if (!hasOutboundRoutes) {
          nextNodeKey = workflowConfig.entryNodeId;
        }
      }
    } else {
      const hasOutboundRoutes =
        (currentNode.suggestions && currentNode.suggestions.length > 0) ||
        (currentNode.content?.suggestions &&
          currentNode.content.suggestions.length > 0) ||
        (currentNode.contents &&
          currentNode.contents.some(
            (c) => c.suggestions && c.suggestions.length > 0,
          ));

      if (
        session.currentNodeId === workflowConfig.entryNodeId ||
        !hasOutboundRoutes
      ) {
        nextNodeKey = workflowConfig.entryNodeId;
      }
    }

    // console.log('--- ROUTING ROUTINE DIAGNOSTIC ---');
    // console.log(`Phone: ${workFlowDto.phoneNumber}`);
    // console.log(`Current position in DB: ${session.currentNodeId}`);
    // console.log(`Targeting next node: ${nextNodeKey}`);
    // console.log('----------------------------------');

    const nodeToSend = workflowNodes[nextNodeKey];
    if (!nodeToSend)
      throw new NotFoundException(`Destination node ${nextNodeKey} not found.`);

    await this.messagingService.sendWorkflowNode(
      session.phoneNumber,
      nodeToSend,
    );

    await this.workflowConversationRepository.update(
      { phoneNumber: session.phoneNumber },
      { currentNodeId: nextNodeKey },
    );
  }
}
