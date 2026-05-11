// ───────────────────────────────────────────────────────────────
// MODULE: Council Graph Upsert Handler
// ───────────────────────────────────────────────────────────────

import {
  batchUpsert,
  clampWeight,
  isCouncilNodeKind,
  isCouncilRelation,
  VALID_KINDS,
  VALID_RELATIONS,
  type CouncilEdge,
  type CouncilNode,
} from '../../lib/council-graph/council-graph-db.js';

export interface CouncilGraphUpsertArgs {
  specFolder: string;
  sessionId: string;
  nodes?: Array<{
    id: string;
    kind: string;
    name: string;
    artifactPath?: string;
    contentHash?: string;
    roundId?: string;
    metadata?: Record<string, unknown>;
  }>;
  edges?: Array<{
    id: string;
    sourceId: string;
    targetId: string;
    relation: string;
    weight?: number;
    artifactPath?: string;
    metadata?: Record<string, unknown>;
  }>;
}

export async function handleCouncilGraphUpsert(
  args: CouncilGraphUpsertArgs,
): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    if (!args.specFolder || typeof args.specFolder !== 'string') {
      return errorResponse('specFolder is required and must be a string');
    }
    if (!args.sessionId || typeof args.sessionId !== 'string') {
      return errorResponse('sessionId is required and must be a string');
    }

    const inputNodes = args.nodes ?? [];
    const inputEdges = args.edges ?? [];
    if (inputNodes.length === 0 && inputEdges.length === 0) {
      return okResponse({
        insertedNodes: 0,
        insertedEdges: 0,
        rejectedEdges: 0,
        rejectedSelfLoops: [],
        noOp: true,
        namespace: buildNamespacePayload(args.specFolder, args.sessionId),
        sourceOfTruth: 'derived_from_ai_council_artifacts',
      });
    }

    const validationErrors: string[] = [];
    const nodes: CouncilNode[] = [];
    const edges: CouncilEdge[] = [];
    const rejectedSelfLoops: string[] = [];

    for (const node of inputNodes) {
      if (!node.id || typeof node.id !== 'string') {
        validationErrors.push('Node missing required id');
        continue;
      }
      if (!isCouncilNodeKind(node.kind)) {
        validationErrors.push(`Invalid node kind "${node.kind}". Valid: ${VALID_KINDS.join(', ')}`);
        continue;
      }
      if (!node.name || typeof node.name !== 'string') {
        validationErrors.push(`Node "${node.id}" missing required name`);
        continue;
      }

      nodes.push({
        id: node.id,
        specFolder: args.specFolder,
        sessionId: args.sessionId,
        kind: node.kind,
        name: node.name,
        artifactPath: node.artifactPath,
        contentHash: node.contentHash,
        roundId: node.roundId,
        metadata: node.metadata,
      });
    }

    for (const edge of inputEdges) {
      if (!edge.id || typeof edge.id !== 'string') {
        validationErrors.push('Edge missing required id');
        continue;
      }
      if (!edge.sourceId || !edge.targetId) {
        validationErrors.push(`Edge "${edge.id}" missing sourceId or targetId`);
        continue;
      }
      if (edge.sourceId === edge.targetId) {
        rejectedSelfLoops.push(edge.id);
        continue;
      }
      if (!isCouncilRelation(edge.relation)) {
        validationErrors.push(`Invalid relation "${edge.relation}". Valid: ${VALID_RELATIONS.join(', ')}`);
        continue;
      }

      edges.push({
        id: edge.id,
        specFolder: args.specFolder,
        sessionId: args.sessionId,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
        relation: edge.relation,
        weight: clampWeight(edge.weight ?? 1.0),
        artifactPath: edge.artifactPath,
        metadata: edge.metadata,
      });
    }

    if (validationErrors.length > 0) {
      return errorResponse(validationErrors.join('; '));
    }

    const result = batchUpsert(nodes, edges);
    return okResponse({
      insertedNodes: result.insertedNodes,
      insertedEdges: result.insertedEdges,
      rejectedEdges: result.rejectedEdges,
      rejectedSelfLoops,
      namespace: buildNamespacePayload(args.specFolder, args.sessionId),
      sourceOfTruth: 'derived_from_ai_council_artifacts',
    });
  } catch (err: unknown) {
    return errorResponse(`Council graph upsert failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

function buildNamespacePayload(specFolder: string, sessionId: string): Record<string, unknown> {
  return { specFolder, sessionId };
}

function okResponse(data: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  return { content: [{ type: 'text', text: JSON.stringify({ status: 'ok', data }, null, 2) }] };
}

function errorResponse(error: string): { content: Array<{ type: string; text: string }> } {
  return { content: [{ type: 'text', text: JSON.stringify({ status: 'error', error }) }] };
}
