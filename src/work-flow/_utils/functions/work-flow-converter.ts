export interface FrontendWorkflowData {
  tableau1: Array<{
    id: string;
    type: string;
    data: {
      question: string;
      options: string[];
      media: any[];
    };
  }>;
  tableau2: Array<{
    id: string;
    source: string;
    target: string;
    data?: {
      label?: string;
      optionIndex?: number;
    };
  }>;
}

export const convertToBackendPayload = (
  frontendData: FrontendWorkflowData,
  workflowName: string = 'Hack-5',
) => {
  const nodes = frontendData.tableau1;
  const edges = frontendData.tableau2;
  const backendNodes: Record<string, any> = {};

  nodes.forEach((node) => {
    const outgoingEdges = edges.filter((edge) => edge.source === node.id);

    const suggestions = outgoingEdges.map((edge) => {
      const optionText = edge.data?.label || 'Suivant';
      return {
        type: 'REPLY',
        text: optionText,
        postbackData: optionText.toUpperCase().trim().replace(/\s+/g, '_'),
        nextNode: edge.target,
      };
    });

    backendNodes[node.id] = {
      type: 'TEXT',
      text: node.data.question || '',
      suggestions: suggestions,
    };
  });

  return {
    name: workflowName,
    entryNodeId: 'node_root_primary',
    nodes: backendNodes,
  };
};
