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
} from './tools/index.js';

import type { ToolDefinition } from './tools/types.js';

type MCPResponse = {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
};

const TOOL_DEFINITIONS: ToolDefinition[] = [
  advisorRecommendTool,
  advisorRebuildTool,
  advisorStatusTool,
  advisorValidateTool,
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

async function dispatchTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
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
      return null;
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
  const requestParams = request.params as { name: string; arguments?: Record<string, unknown> };
  const name = requestParams.name;
  const args = requestParams.arguments ?? {};

  if (!TOOL_NAMES.has(name)) {
    return {
      isError: true,
      content: [{ type: 'text', text: `Unknown advisor tool: ${name}` }],
    };
  }

  try {
    const response = await dispatchTool(name, args);
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
