// ───────────────────────────────────────────────────────────────
// MODULE: Council Graph Status Handler
// ───────────────────────────────────────────────────────────────

import { getStats, type CouncilNamespace } from '../../lib/council-graph/council-graph-db.js';
import { computeCouncilSignals } from './convergence.js';

export interface CouncilGraphStatusArgs {
  specFolder: string;
  sessionId: string;
}

export async function handleCouncilGraphStatus(
  args: CouncilGraphStatusArgs,
): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    if (!args.specFolder || typeof args.specFolder !== 'string') {
      return errorResponse('specFolder is required');
    }
    if (!args.sessionId || typeof args.sessionId !== 'string') {
      return errorResponse('sessionId is required');
    }

    const ns: CouncilNamespace = { specFolder: args.specFolder, sessionId: args.sessionId };
    const stats = getStats(args.specFolder, args.sessionId);
    const readiness = stats.totalNodes === 0 ? 'empty' : 'ready';

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'ok',
          data: {
            namespace: ns,
            readiness,
            sourceOfTruth: 'derived_from_ai_council_artifacts',
            notes: [
              'Council graph rows are derived from packet-local ai-council artifacts and may be rebuilt.',
            ],
            recovery: {
              mode: 'derived_replay',
              boundedCleanup: 'delete rows for this specFolder/sessionId from council_nodes, council_edges, and council_snapshots, then replay ai-council artifacts',
              artifactAuthority: 'ai-council/**',
              safeActions: [
                'keep ai-council/** artifacts unchanged',
                'discard only derived council graph rows for this namespace',
                'replay nodes and edges from packet-local artifacts',
                'rerun council_graph_status and council_graph_convergence',
              ],
            },
            totalNodes: stats.totalNodes,
            totalEdges: stats.totalEdges,
            nodesByKind: stats.nodesByKind,
            edgesByRelation: stats.edgesByRelation,
            snapshotCount: stats.snapshotCount,
            schemaVersion: stats.schemaVersion,
            dbFileSize: stats.dbFileSize,
            signals: stats.totalNodes > 0 ? computeCouncilSignals(ns) : null,
          },
        }, null, 2),
      }],
    };
  } catch (err: unknown) {
    return errorResponse(`Council graph status failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

function errorResponse(error: string): { content: Array<{ type: string; text: string }> } {
  return { content: [{ type: 'text', text: JSON.stringify({ status: 'error', error }) }] };
}
