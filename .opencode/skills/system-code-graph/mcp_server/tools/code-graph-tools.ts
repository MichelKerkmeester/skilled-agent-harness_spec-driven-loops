// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Tools
// ───────────────────────────────────────────────────────────────
// Dispatch for code graph MCP tools: scan, query, status, context, verify, apply, detect_changes.
import {
  handleCodeGraphScan,
  handleCodeGraphQuery,
  handleCodeGraphStatus,
  handleCodeGraphContext,
  handleClassifyQueryIntent,
  handleCodeGraphVerify,
  handleCodeGraphApply,
  handleDetectChanges,
  // PHASE-002-IMPORT-SLOT: handleCodeGraphHldLld (027/002)
  // PHASE-003-IMPORT-SLOT: handleCodeGraphTrace (027/003)
  // PHASE-004-IMPORT-SLOT: handleCodeGraphImpactAnalysis (027/004)
} from '../handlers/index.js';

import type { MCPResponse } from '../lib/shared/mcp-types.js';
import { parseArgs } from '../lib/shared/mcp-types.js';

/** Tool names handled by this module */
export const TOOL_NAMES = new Set([
  'code_graph_scan',
  'code_graph_query',
  'code_graph_status',
  'code_graph_context',
  'code_graph_classify_query_intent',
  'code_graph_verify',
  'code_graph_apply',
  'detect_changes',
  // PHASE-002-TOOLNAME-SLOT: 'code_graph_hld_lld' (027/002)
  // PHASE-003-TOOLNAME-SLOT: 'code_graph_trace' (027/003)
  // PHASE-004-TOOLNAME-SLOT: 'code_graph_impact_analysis' (027/004)
]);

/** Coerce handler response to MCPResponse (fix type literal narrowing) */
function toMCP(result: { content: Array<{ type: string; text: string }> }): MCPResponse {
  return {
    content: result.content.map(c => ({ type: 'text' as const, text: c.text })),
  };
}

function getMissingRequiredStringArgs(args: Record<string, unknown>, requiredKeys: string[]): string[] {
  return requiredKeys.filter((key) => {
    const value = args[key];
    return typeof value !== 'string' || value.trim().length === 0;
  });
}

function validationError(tool: string, missingKeys: string[]): MCPResponse {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        status: 'error',
        error: `Missing required field${missingKeys.length === 1 ? '' : 's'}: ${missingKeys.join(', ')}`,
        tool,
      }),
    }],
  };
}

/** Dispatch a tool call. Returns null if tool name not handled. */
export async function handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
  switch (name) {
    case 'code_graph_scan':
      return toMCP(await handleCodeGraphScan(parseArgs<Parameters<typeof handleCodeGraphScan>[0]>(args)));
    case 'code_graph_query': {
      const missingKeys = getMissingRequiredStringArgs(args, ['operation', 'subject']);
      if (missingKeys.length > 0) {
        return validationError(name, missingKeys);
      }
      return toMCP(await handleCodeGraphQuery(parseArgs<Parameters<typeof handleCodeGraphQuery>[0]>(args)));
    }
    case 'code_graph_status':
      parseArgs<Record<string, never>>(args);
      return toMCP(await handleCodeGraphStatus());
    case 'code_graph_context':
      return toMCP(await handleCodeGraphContext(parseArgs<Parameters<typeof handleCodeGraphContext>[0]>(args)));
    case 'code_graph_classify_query_intent': {
      const missingKeys = getMissingRequiredStringArgs(args, ['query']);
      if (missingKeys.length > 0) {
        return validationError(name, missingKeys);
      }
      return toMCP(await handleClassifyQueryIntent(parseArgs<Parameters<typeof handleClassifyQueryIntent>[0]>(args)));
    }
    case 'code_graph_verify':
      return toMCP(await handleCodeGraphVerify(parseArgs<Parameters<typeof handleCodeGraphVerify>[0]>(args)));
    case 'code_graph_apply':
      return toMCP(await handleCodeGraphApply(parseArgs<Parameters<typeof handleCodeGraphApply>[0]>(args)));
    case 'detect_changes': {
      const missingKeys = getMissingRequiredStringArgs(args, ['diff']);
      if (missingKeys.length > 0) {
        return validationError(name, missingKeys);
      }
      return toMCP(await handleDetectChanges(parseArgs<Parameters<typeof handleDetectChanges>[0]>(args)));
    }
    // PHASE-002-DISPATCH-SLOT: case 'code_graph_hld_lld' (027/002)
    // PHASE-003-DISPATCH-SLOT: case 'code_graph_trace' (027/003)
    // PHASE-004-DISPATCH-SLOT: case 'code_graph_impact_analysis' (027/004)
    default:
      return null;
  }
}
