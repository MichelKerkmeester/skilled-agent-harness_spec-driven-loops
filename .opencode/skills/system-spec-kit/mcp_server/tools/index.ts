// ───────────────────────────────────────────────────────────────
// MODULE: Index
// ───────────────────────────────────────────────────────────────
// Re-exports all tool dispatch modules for context-server (T303).
import * as contextTools from './context-tools.js';
import * as memoryTools from './memory-tools.js';
import * as causalTools from './causal-tools.js';
import * as checkpointTools from './checkpoint-tools.js';
import * as lifecycleTools from './lifecycle-tools.js';
// Code-graph MCP dispatch moved to standalone system_code_graph server per ADR-002.
import { validateToolArgs } from '../schemas/tool-input-schemas.js';
import { handleCouncilGraphConvergence } from '../handlers/council-graph/convergence.js';
import { handleCouncilGraphQuery } from '../handlers/council-graph/query.js';
import { handleCouncilGraphStatus } from '../handlers/council-graph/status.js';
import { handleCouncilGraphUpsert } from '../handlers/council-graph/upsert.js';
import { parseArgs } from './types.js';
import type { MCPCallerContext } from '../lib/context/caller-context.js';
import type { MCPResponse } from './types.js';

function toMCP(result: { content: Array<{ type: string; text: string }> }): MCPResponse {
  return {
    content: result.content.map((entry) => ({ type: 'text' as const, text: entry.text })),
  };
}

export const councilGraphTools = {
  TOOL_NAMES: new Set([
    'council_graph_upsert',
    'council_graph_query',
    'council_graph_status',
    'council_graph_convergence',
  ]),
  async handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
    switch (name) {
      case 'council_graph_upsert':
        return toMCP(await handleCouncilGraphUpsert(parseArgs<Parameters<typeof handleCouncilGraphUpsert>[0]>(args)));
      case 'council_graph_query':
        return toMCP(await handleCouncilGraphQuery(parseArgs<Parameters<typeof handleCouncilGraphQuery>[0]>(args)));
      case 'council_graph_status':
        return toMCP(await handleCouncilGraphStatus(parseArgs<Parameters<typeof handleCouncilGraphStatus>[0]>(args)));
      case 'council_graph_convergence':
        return toMCP(await handleCouncilGraphConvergence(parseArgs<Parameters<typeof handleCouncilGraphConvergence>[0]>(args)));
      default:
        return null;
    }
  },
};

const SCHEMA_VALIDATED_TOOL_NAMES = new Set<string>([
  ...councilGraphTools.TOOL_NAMES,
]);

export { contextTools, memoryTools, causalTools, checkpointTools, lifecycleTools };

export type { MCPResponse } from './types.js';

/** All tool dispatch modules in priority order */
export const ALL_DISPATCHERS = [
  contextTools,
  memoryTools,
  causalTools,
  checkpointTools,
  lifecycleTools,
  // codeGraphTools intentionally omitted: standalone system_code_graph owns MCP dispatch per ADR-002.
  // skillGraphTools intentionally omitted: standalone mk_skill_advisor owns MCP dispatch per 013/009/008.
  councilGraphTools,
] as const;

/** Dispatch a tool call to the appropriate module. Returns null if unrecognized. */
export async function dispatchTool(
  name: string,
  args: Record<string, unknown>,
  callerContext?: MCPCallerContext | null,
): Promise<import('./types.js').MCPResponse | null> {
  for (const dispatcher of ALL_DISPATCHERS) {
    if (dispatcher.TOOL_NAMES.has(name)) {
      const validatedArgs = SCHEMA_VALIDATED_TOOL_NAMES.has(name)
        ? validateToolArgs(name, args)
        : args;
      return dispatcher.handleTool(name, validatedArgs);
    }
  }
  return null;
}
