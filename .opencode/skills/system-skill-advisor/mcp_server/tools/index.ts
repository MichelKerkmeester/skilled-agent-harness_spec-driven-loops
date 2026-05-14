// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Tool Descriptors
// ───────────────────────────────────────────────────────────────

import {
  handleAdvisorRebuild,
  handleAdvisorRecommend,
  handleAdvisorStatus,
  handleAdvisorValidate,
} from '../handlers/index.js';
import type { MCPCallerContext } from '../../../system-spec-kit/mcp_server/lib/context/caller-context.js';

export { advisorRecommendTool } from './advisor-recommend.js';
export { advisorRebuildTool } from './advisor-rebuild.js';
export { advisorStatusTool } from './advisor-status.js';
export { advisorValidateTool } from './advisor-validate.js';
export {
  skillGraphQueryTool,
  skillGraphScanTool,
  skillGraphStatusTool,
  skillGraphToolDefinitions,
  skillGraphValidateTool,
} from './skill-graph-tools.js';
export * as skillGraphTools from './skill-graph-tools.js';

type MCPResponse = {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
};

function toMCP(result: { content: Array<{ type: string; text: string }> }): MCPResponse {
  return {
    content: result.content.map((entry) => ({ type: 'text' as const, text: entry.text })),
  };
}

export async function dispatchTool(
  name: string,
  args: Record<string, unknown>,
  callerContext?: MCPCallerContext | null,
): Promise<MCPResponse | null> {
  switch (name) {
    case 'advisor_recommend':
      return toMCP(await handleAdvisorRecommend(args));
    case 'advisor_rebuild':
      return toMCP(await handleAdvisorRebuild(args));
    case 'advisor_status':
      return toMCP(await handleAdvisorStatus(args));
    case 'advisor_validate':
      return toMCP(await handleAdvisorValidate(args));
    default: {
      const module = await import('./skill-graph-tools.js');
      return module.handleTool(name, args, callerContext);
    }
  }
}
