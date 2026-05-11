// ───────────────────────────────────────────────────────────────
// MODULE: Council Graph Query Handler
// ───────────────────────────────────────────────────────────────

import type { CouncilNamespace } from '../../lib/council-graph/council-graph-db.js';
import {
  findConvergenceBlockers,
  findDecisionSupport,
  findEvidenceChain,
  findUnresolvedDisagreements,
  rankHotNodes,
} from '../../lib/council-graph/council-graph-query.js';

export type CouncilGraphQueryType =
  | 'unresolved_disagreements'
  | 'evidence_chain'
  | 'decision_support'
  | 'convergence_blockers'
  | 'hot_nodes';

export interface CouncilGraphQueryArgs {
  specFolder: string;
  sessionId: string;
  queryType: CouncilGraphQueryType;
  nodeId?: string;
  limit?: number;
  maxDepth?: number;
}

export async function handleCouncilGraphQuery(
  args: CouncilGraphQueryArgs,
): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    if (!args.specFolder || typeof args.specFolder !== 'string') {
      return errorResponse('specFolder is required');
    }
    if (!args.sessionId || typeof args.sessionId !== 'string') {
      return errorResponse('sessionId is required');
    }

    const ns: CouncilNamespace = { specFolder: args.specFolder, sessionId: args.sessionId };
    const limit = Math.min(Math.max(args.limit ?? 50, 1), 200);

    switch (args.queryType) {
      case 'unresolved_disagreements': {
        const disagreements = findUnresolvedDisagreements(ns);
        return okResponse({
          queryType: args.queryType,
          namespace: buildNamespacePayload(ns),
          disagreements: disagreements.slice(0, limit),
          totalUnresolved: disagreements.length,
          sourceOfTruth: 'derived_from_ai_council_artifacts',
        });
      }
      case 'evidence_chain': {
        if (!args.nodeId) return errorResponse('nodeId is required for evidence_chain query');
        const maxDepth = Math.min(Math.max(args.maxDepth ?? 10, 1), 20);
        const chain = findEvidenceChain(ns, args.nodeId, maxDepth);
        return okResponse({
          queryType: args.queryType,
          namespace: buildNamespacePayload(ns),
          rootNodeId: args.nodeId,
          chain: chain.slice(0, limit),
          totalSteps: chain.length,
          maxDepth,
          sourceOfTruth: 'derived_from_ai_council_artifacts',
        });
      }
      case 'decision_support': {
        const support = findDecisionSupport(ns, args.nodeId).slice(0, limit);
        return okResponse({
          queryType: args.queryType,
          namespace: buildNamespacePayload(ns),
          support,
          totalReturned: support.length,
          sourceOfTruth: 'derived_from_ai_council_artifacts',
        });
      }
      case 'convergence_blockers': {
        const blockers = findConvergenceBlockers(ns);
        return okResponse({
          queryType: args.queryType,
          namespace: buildNamespacePayload(ns),
          blockers: {
            unresolvedCriticalDisagreements: blockers.unresolvedCriticalDisagreements.slice(0, limit),
            lowConfidenceDecisions: blockers.lowConfidenceDecisions.slice(0, limit),
            unsupportedDecisions: blockers.unsupportedDecisions.slice(0, limit),
          },
          totals: {
            unresolvedCriticalDisagreements: blockers.unresolvedCriticalDisagreements.length,
            lowConfidenceDecisions: blockers.lowConfidenceDecisions.length,
            unsupportedDecisions: blockers.unsupportedDecisions.length,
          },
          sourceOfTruth: 'derived_from_ai_council_artifacts',
        });
      }
      case 'hot_nodes': {
        const hotNodes = rankHotNodes(ns, limit);
        return okResponse({
          queryType: args.queryType,
          namespace: buildNamespacePayload(ns),
          hotNodes,
          totalReturned: hotNodes.length,
          sourceOfTruth: 'derived_from_ai_council_artifacts',
        });
      }
      default:
        return errorResponse(`Unknown queryType: "${args.queryType}"`);
    }
  } catch (err: unknown) {
    return errorResponse(`Council graph query failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

function buildNamespacePayload(ns: CouncilNamespace): Record<string, unknown> {
  return { specFolder: ns.specFolder, ...(ns.sessionId ? { sessionId: ns.sessionId } : {}) };
}

function okResponse(data: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  return { content: [{ type: 'text', text: JSON.stringify({ status: 'ok', data }, null, 2) }] };
}

function errorResponse(error: string): { content: Array<{ type: string; text: string }> } {
  return { content: [{ type: 'text', text: JSON.stringify({ status: 'error', error }) }] };
}
