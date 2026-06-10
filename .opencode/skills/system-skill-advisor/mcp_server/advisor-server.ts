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
  dispatchTool,
  TOOL_DEFINITIONS,
} from './tools/index.js';

import {
  closeDb as closeSkillGraphDb,
  getDb as getSkillGraphDb,
  indexSkillMetadata,
  initDb as initSkillGraphDb,
  resolveSkillGraphDbDir,
} from './lib/skill-graph/skill-graph-db.js';
import { ensureActiveEmbedder } from './lib/embedders/schema.js';
import { computeAdvisorSourceSignature } from './lib/freshness.js';
import { publishSkillGraphGeneration } from './lib/freshness/generation.js';
import { startSkillGraphDaemon, type SkillGraphDaemon } from './lib/daemon/lifecycle.js';
import type { SkillGraphFsWatcher } from './lib/daemon/watcher.js';
import { readAdvisorStatus } from './handlers/advisor-status.js';
import { runWithCallerContext, type MCPCallerContext } from './lib/context/caller-context.js';
import {
  getIpcBridgeStats,
  resolveIpcSocketPath,
  startIpcSocketServer,
  type IpcSocketServerHandle,
} from './lib/ipc/socket-server.js';
import {
  createLauncherIdleMonitor,
  type LauncherIdleMonitor,
} from './lib/ipc/launcher-idle-timeout.js';

type MCPResponse = {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
};

export { dispatchTool, TOOL_DEFINITIONS };

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
  const candidates = [
    path.join(workspaceRoot, '.opencode', 'skills', 'system-skill-advisor', 'mcp_server', 'node_modules', 'chokidar', 'index.js'),
    path.join(workspaceRoot, '.opencode', 'skills', 'system-spec-kit', 'mcp_server', 'node_modules', 'chokidar', 'index.js'),
  ];
  const chokidarPath = candidates.find((candidate) => fs.existsSync(candidate));
  if (!chokidarPath) {
    throw new Error(`Unable to load chokidar; checked ${candidates.map((candidate) => path.relative(workspaceRoot, candidate)).join(', ')}`);
  }
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
let ipcBridge: IpcSocketServerHandle | null = null;
let launcherIdleMonitor: LauncherIdleMonitor | null = null;
let shuttingDown = false;

async function shutdownAdvisor(reason: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  console.error(`[mk-skill-advisor-launcher] ${reason}`);
  if (launcherIdleMonitor) {
    launcherIdleMonitor.stop();
    launcherIdleMonitor = null;
  }
  if (ipcBridge) {
    await ipcBridge.close().catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[mk-skill-advisor-launcher] ipc-bridge close error: ${message}`);
    });
    ipcBridge = null;
  }
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function resolveTrustedCaller(metadata: Record<string, unknown>): boolean {
  if (metadata.trusted === false || metadata.callerAuthority === 'untrusted') {
    return false;
  }
  if (metadata.trusted === true || metadata.callerAuthority === 'trusted') {
    return true;
  }
  // _meta is caller-supplied, so absent/unknown transport metadata must fail
  // CLOSED (untrusted). The daemon owner can restore the legacy
  // default-trusted behavior for native MCP surfaces (e.g. /doctor repair
  // flows, whose clients send no _meta) by setting
  // MK_SKILL_ADVISOR_TRUST_DEFAULT=trusted in the daemon's own environment
  // (MCP registration env block / launcher env), which callers cannot forge.
  return process.env.MK_SKILL_ADVISOR_TRUST_DEFAULT === 'trusted';
}

export function buildCallerContext(extra: unknown): MCPCallerContext {
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

function createAdvisorMcpServer(): Server {
  const advisorServer = new Server(
    { name: 'mk_skill_advisor', version: '0.1.0' },
    { capabilities: { tools: {} } },
  );

  advisorServer.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOL_DEFINITIONS,
  }));

  advisorServer.setRequestHandler(CallToolRequestSchema, async (request): Promise<MCPResponse> => {
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

  return advisorServer;
}

const server = createAdvisorMcpServer();

export async function main(): Promise<void> {
  console.error(`[mk-skill-advisor-launcher] DB: ${resolveSkillGraphDbPath()}`);
  initSkillGraphDb(resolveSkillGraphDbDir());

  // Resolve the active embedder via the shared cascade if the
  // persisted pointer is the `'auto'` sentinel or references a manifest the
  // shared registry no longer knows about (legacy `embeddinggemma-300m`
  // pointer from a legacy install). The first scan or watcher tick
  // after this call routes through `refreshSkillEmbeddingsViaAdapter`
  // because `hasActiveEmbedderPointer` now returns true.
  try {
    const resolved = await ensureActiveEmbedder(getSkillGraphDb(), { contentType: 'text' });
    console.error(
      `[mk-skill-advisor-launcher] Active embedder: ${resolved.name} (${resolved.dim}-dim)`,
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(
      `[mk-skill-advisor-launcher] ensureActiveEmbedder failed: ${message}. Semantic-shadow scoring may degrade until the operator runs the swap runbook.`,
    );
  }

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
  launcherIdleMonitor = createLauncherIdleMonitor({
    serviceName: 'mk-skill-advisor-launcher',
    getActiveClientCount: () => getIpcBridgeStats().secondary_clients_count,
    onIdle: async () => {
      await shutdownAdvisor('launcher idle timeout');
      process.exit(0);
    },
    log: (message: string) => console.error(message),
  });
  ipcBridge = await startIpcSocketServer({
    socketPath: resolveIpcSocketPath(resolveSkillGraphDbDir()),
    createServer: () => createAdvisorMcpServer(),
    log: (message: string) => console.error(message),
    onActivity: () => launcherIdleMonitor?.markActivity(),
  });
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
    void shutdownAdvisor('fatal error').finally(() => process.exit(1));
  });
}
