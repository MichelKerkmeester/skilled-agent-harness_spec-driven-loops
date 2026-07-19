// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Apply Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for code_graph_apply.

import {
  applyCodeGraph,
  type CodeGraphApplyArgs,
} from '../lib/apply-orchestrator.js';

function buildResponse(payload: object): { content: Array<{ type: 'text'; text: string }> } {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify(payload, null, 2),
    }],
  };
}

/** Run a verification-gated code-graph recovery operation. */
export async function handleCodeGraphApply(
  args: CodeGraphApplyArgs,
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  try {
    const result = await applyCodeGraph(args);
    return buildResponse({
      status: result.status,
      result,
    });
  } catch (error: unknown) {
    return buildResponse({
      status: 'error',
      error: `code_graph_apply failed: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}
