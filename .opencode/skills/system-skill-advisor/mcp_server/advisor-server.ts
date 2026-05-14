// ───────────────────────────────────────────────────────────────
// MODULE: Advisor MCP Server
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

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
import {
  closeDb as closeSkillGraphDb,
  indexSkillMetadata,
  initDb as initSkillGraphDb,
  resolveSkillGraphDbDir,
} from './lib/skill-graph/skill-graph-db.js';
import { computeAdvisorSourceSignature } from './lib/freshness.js';
import { publishSkillGraphGeneration } from './lib/freshness/generation.js';
import { startSkillGraphDaemon, type SkillGraphDaemon } from './lib/daemon/lifecycle.js';
import type { SkillGraphFsWatcher } from './lib/daemon/watcher.js';
import { readAdvisorStatus } from './handlers/advisor-status.js';
import { runWithCallerContext, type MCPCallerContext } from './lib/context/caller-context.js';

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
  return path.join(resolveSkillGraphDbDir(), 'skill-graph.sqlite');
}

function resolveSkillGraphSourceDir(): string | null {
  const candidates = Array.from(new Set([
    path.resolve(process.cwd(), '.opencode', 'skills'),
    path.resolve(import.meta.dirname, '..', '..', '..', '..', '.opencode', 'skills'),
  ]));

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function resolveWorkspaceRoot(): string {
  const candidates = Array.from(new Set([
    process.cwd(),
    path.resolve(import.meta.dirname, '..', '..', '..', '..'),
  ]));

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, '.opencode', 'skills'))) {
      return candidate;
    }
  }

  return process.cwd();
}

async function loadSkillGraphWatchFactory(): Promise<(paths: string[], options: Record<string, unknown>) => SkillGraphFsWatcher> {
  const workspaceRoot = resolveWorkspaceRoot();
  const chokidarPath = path.join(
    workspaceRoot,
    '.opencode',
    'skills',
    'system-spec-kit',
    'mcp_server',
    'node_modules',
    'chokidar',
    'index.js',
  );
  const chokidarModule = await import(pathToFileURL(chokidarPath).href) as {
    default?: { watch?: (paths: string[], options: Record<string, unknown>) => SkillGraphFsWatcher };
    watch?: (paths: string[], options: Record<string, unknown>) => SkillGraphFsWatcher;
  };
  const watch = chokidarModule.default?.watch ?? chokidarModule.watch;
  if (!watch) {
    throw new Error(`Unable to load chokidar watch factory from ${chokidarPath}`);
  }
  return watch;
}

function logSkillGraphIndexResult(trigger: string, result: ReturnType<typeof indexSkillMetadata>): void {
  if (trigger === 'startup-scan') {
    console.error(
      '[mk-skill-advisor-launcher] Skill graph: scanned=%d indexed=%d skipped=%d edges=%d rejected=%d deleted=%d',
      result.scannedFiles,
      result.indexedFiles,
      result.skippedFiles,
      result.indexedEdges,
      result.rejectedEdges,
      result.deletedNodes,
    );
    return;
  }

  console.error(`[mk-skill-advisor-launcher] Skill graph ${trigger}: indexed=${result.indexedFiles}`);
}

async function startupSkillGraphScan(): Promise<void> {
  const skillGraphSourceDir = resolveSkillGraphSourceDir();
  if (!skillGraphSourceDir) {
    console.warn('[mk-skill-advisor-launcher] Skill graph source directory not found; skipping startup scan');
    return;
  }

  try {
    const result = indexSkillMetadata(skillGraphSourceDir);
    logSkillGraphIndexResult('startup-scan', result);
    const workspaceRoot = process.cwd();
    const sourceSignature = computeAdvisorSourceSignature(workspaceRoot);
    publishSkillGraphGeneration({
      workspaceRoot,
      changedPaths: [skillGraphSourceDir],
      reason: 'advisor-server-startup-scan',
      state: 'live',
      sourceSignature,
    });
    const status = readAdvisorStatus({ workspaceRoot });
    if (status.freshness !== 'live' || status.trustState.state === 'absent') {
      publishSkillGraphGeneration({
        workspaceRoot,
        changedPaths: [skillGraphSourceDir],
        reason: 'advisor-server-post-index-assertion-failed',
        state: 'stale',
        sourceSignature,
      });
      console.warn(
        `[mk-skill-advisor-launcher] Skill graph post-index assertion failed: ${status.freshness}/${status.trustState.state}`,
      );
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('[mk-skill-advisor-launcher] Skill graph startup scan failed:', message);
  }
}

let transport: StdioServerTransport | null = null;
let skillGraphDaemon: SkillGraphDaemon | null = null;
let shuttingDown = false;

async function shutdownAdvisor(reason: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  console.error(`[mk-skill-advisor-launcher] ${reason}`);
  if (skillGraphDaemon) {
    await skillGraphDaemon.shutdown(reason);
    skillGraphDaemon = null;
  }
  closeSkillGraphDb();
  if (transport) {
    transport.close();
    transport = null;
  }
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
  { name: 'mk_skill_advisor', version: '0.1.0' },
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
  console.error(`[mk-skill-advisor-launcher] DB: ${resolveSkillGraphDbPath()}`);
  initSkillGraphDb(resolveSkillGraphDbDir());
  await startupSkillGraphScan();
  const watchFactory = await loadSkillGraphWatchFactory();
  skillGraphDaemon = await startSkillGraphDaemon({
    workspaceRoot: process.cwd(),
    skillsRoot: resolveSkillGraphSourceDir() ?? undefined,
    generationReason: 'advisor-server-watcher-reindex',
    watchFactory,
  });
  console.error(`[mk-skill-advisor-launcher] Skill graph daemon active=${skillGraphDaemon.active}`);
  transport = new StdioServerTransport();
  await server.connect(transport);
}

const isMain = process.argv[1] && decodeURIComponent(import.meta.url).endsWith(process.argv[1].replace(/\\/g, '/'));

if (isMain) {
  process.once('SIGINT', () => {
    void shutdownAdvisor('SIGINT').finally(() => process.exit(0));
  });
  process.once('SIGTERM', () => {
    void shutdownAdvisor('SIGTERM').finally(() => process.exit(0));
  });
  main().catch((error: unknown) => {
    console.error('[mk-skill-advisor-launcher] Fatal error:', error);
    closeSkillGraphDb();
    process.exit(1);
  });
}
