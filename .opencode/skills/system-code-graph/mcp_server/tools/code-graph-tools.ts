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
  // Reserved import slots for future hld/lld, trace, and impact-analysis handlers.
} from '../handlers/index.js';

import type { MCPResponse } from '../lib/shared/mcp-types.js';
import { parseArgs } from '../lib/shared/mcp-types.js';
import { CODE_GRAPH_TOOL_SCHEMAS, validateToolArgs } from '../tool-schemas.js';

/**
 * Tool names handled by this module, derived from the schema registry so the
 * membership gate cannot drift from the advertised tool surface. tool-schemas
 * is the single source of truth; the dispatch switch below adds the one thing
 * a schema can't carry — which handler each name maps to.
 */
export const TOOL_NAMES = new Set(CODE_GRAPH_TOOL_SCHEMAS.map((schema) => schema.name));

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
  // BUG-04 fix: enforce the published inputSchema (enum / additionalProperties /
  // minLength) before dispatch for known tools, so malformed calls are rejected
  // with a field-specific error rather than reaching handlers. Required-field
  // presence is still checked per-case below; numeric range stays handler-clamped.
  if (TOOL_NAMES.has(name)) {
    try {
      validateToolArgs(name, args);
    } catch (err) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: 'error',
            error: err instanceof Error ? err.message : String(err),
            tool: name,
          }),
        }],
      };
    }
  }

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
    // Reserved dispatch slots for future hld/lld, trace, and impact-analysis cases.
    default:
      return null;
  }
}
