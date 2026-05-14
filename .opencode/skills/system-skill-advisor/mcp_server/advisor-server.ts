// ───────────────────────────────────────────────────────────────
// MODULE: Advisor MCP Server
// ───────────────────────────────────────────────────────────────

import path from 'node:path';

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import {
  handleAdvisorRebuild,
  handleAdvisorRecommend,
  handleAdvisorStatus,
  handleAdvisorValidate,
} from './handlers/index.js';
import {
  advisorRebuildTool,
  advisorRecommendTool,
  advisorStatusTool,
  advisorValidateTool,
  skillGraphToolDefinitions,
  skillGraphTools,
} from './tools/index.js';

import type { ToolDefinition } from './tools/types.js';
import { runWithCallerContext, type MCPCallerContext } from '../../system-spec-kit/mcp_server/lib/context/caller-context.js';

type MCPResponse = {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
};

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  advisorRecommendTool,
  advisorRebuildTool,
  advisorStatusTool,
  advisorValidateTool,
  ...skillGraphToolDefinitions,
];

const TOOL_NAMES = new Set(TOOL_DEFINITIONS.map((tool) => tool.name));

function resolveSkillGraphDbPath(): string {
  const dbDir = process.env.SYSTEM_SKILL_ADVISOR_DB_DIR
    ? path.resolve(process.env.SYSTEM_SKILL_ADVISOR_DB_DIR)
    : path.resolve(
      process.cwd(),
      '.opencode',
      'skills',
      'system-skill-advisor',
      'mcp_server',
      'database',
    );
  return path.join(dbDir, 'skill-graph.sqlite');
}

function toMCP(result: { content: Array<{ type: string; text: string }> }): MCPResponse {
  return {
    content: result.content.map((entry) => ({ type: 'text' as const, text: entry.text })),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function resolveTrustedCaller(metadata: Record<string, unknown>): boolean {
  if (metadata.trusted === false || metadata.callerAuthority === 'untrusted') {
    return false;
  }
  return metadata.trusted === true || metadata.callerAuthority === 'trusted' || metadata.transport === undefined;
}

function buildCallerContext(extra: unknown): MCPCallerContext {
  const metadata = isRecord(extra) ? { ...extra } : {};
  return {
    sessionId: typeof metadata.sessionId === 'string' ? metadata.sessionId : null,
    transport: 'stdio',
    connectedAt: new Date().toISOString(),
    callerPid: typeof metadata.pid === 'number' && Number.isFinite(metadata.pid) ? metadata.pid : undefined,
    trusted: resolveTrustedCaller(metadata),
    metadata,
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
    default:
      return skillGraphTools.handleTool(name, args, callerContext);
  }
}

const server = new Server(
  { name: 'system_skill_advisor', version: '0.1.0' },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOL_DEFINITIONS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request): Promise<MCPResponse> => {
  const requestParams = request.params as { name: string; arguments?: Record<string, unknown>; _meta?: unknown };
  const name = requestParams.name;
  const args = requestParams.arguments ?? {};

  if (!TOOL_NAMES.has(name)) {
    return {
      isError: true,
      content: [{ type: 'text', text: `Unknown advisor tool: ${name}` }],
    };
  }

  try {
    const callerContext = buildCallerContext(requestParams._meta);
    const response = await runWithCallerContext(
      callerContext,
      async () => dispatchTool(name, args, callerContext),
    );
    if (response) return response;
    return {
      isError: true,
      content: [{ type: 'text', text: `Unhandled advisor tool: ${name}` }],
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      isError: true,
      content: [{ type: 'text', text: JSON.stringify({ status: 'error', error: message }) }],
    };
  }
});

export async function main(): Promise<void> {
  console.error(`[skill-advisor-launcher] DB: ${resolveSkillGraphDbPath()}`);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

const isMain = process.argv[1] && decodeURIComponent(import.meta.url).endsWith(process.argv[1].replace(/\\/g, '/'));

if (isMain) {
  main().catch((error: unknown) => {
    console.error('[skill-advisor-launcher] Fatal error:', error);
    process.exit(1);
  });
}
