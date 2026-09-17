// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Daemon Server
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

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
import { findAdvisorWorkspaceRoot } from './lib/utils/workspace-root.js';
import { computeAdvisorSourceSignature } from './lib/freshness.js';
import { publishSkillGraphGeneration } from './lib/freshness/generation.js';
import { startSkillGraphDaemon, type SkillGraphDaemon } from './lib/daemon/lifecycle.js';
import type { SkillGraphFsWatcher } from './lib/daemon/watcher.js';
import { readAdvisorStatus } from './handlers/advisor-status.js';
import { runWithCallerContext, type CallerContext } from './lib/context/caller-context.js';
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
  // Walk up from this module's own location to the repo root — the directory
  // whose .opencode/skills tree contains this advisor. This is robust to the
  // source-vs-dist depth difference (the compiled file lives one level deeper
  // under dist/runtime/) and can never resolve a subdirectory cwd, which is
  // what created stray nested .opencode/.state/advisor directories whenever the
  // advisor ran with a subdirectory as its working directory.
  let dir = import.meta.dirname;
  for (let i = 0; i < 12; i += 1) {
    if (fs.existsSync(path.join(dir, '.opencode', 'skills', 'system-skill-advisor'))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }

  // Module walk-up failed (unusual). Fall back to the anchored resolver rather
  // than a raw cwd, which could be a specs/<packet> subdir and would seed a
  // stray state tree there.
  return findAdvisorWorkspaceRoot(process.cwd());
}

async function loadSkillGraphWatchFactory(): Promise<(paths: string[], options: Record<string, unknown>) => SkillGraphFsWatcher> {
  const workspaceRoot = resolveWorkspaceRoot();
  const candidates = [
    path.join(workspaceRoot, '.opencode', 'skills', 'system-skill-advisor', 'runtime', 'node_modules', 'chokidar', 'index.js'),
    path.join(workspaceRoot, '.opencode', 'skills', 'system-spec-kit', 'runtime', 'node_modules', 'chokidar', 'index.js'),
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
      '[system-skill-advisor-launcher] Skill graph: scanned=%d indexed=%d skipped=%d edges=%d rejected=%d deleted=%d',
      result.scannedFiles,
      result.indexedFiles,
      result.skippedFiles,
      result.indexedEdges,
      result.rejectedEdges,
      result.deletedNodes,
    );
    return;
  }

  console.error(`[system-skill-advisor-launcher] Skill graph ${trigger}: indexed=${result.indexedFiles}`);
}

async function startupSkillGraphScan(): Promise<void> {
  const skillGraphSourceDir = resolveSkillGraphSourceDir();
  if (!skillGraphSourceDir) {
    console.warn('[system-skill-advisor-launcher] Skill graph source directory not found; skipping startup scan');
    return;
  }

  try {
    const result = indexSkillMetadata(skillGraphSourceDir);
    logSkillGraphIndexResult('startup-scan', result);
    const workspaceRoot = resolveWorkspaceRoot();
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
        `[system-skill-advisor-launcher] Skill graph post-index assertion failed: ${status.freshness}/${status.trustState.state}`,
      );
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('[system-skill-advisor-launcher] Skill graph startup scan failed:', message);
  }
}

let skillGraphDaemon: SkillGraphDaemon | null = null;
let ipcBridge: IpcSocketServerHandle | null = null;
let launcherIdleMonitor: LauncherIdleMonitor | null = null;
let shuttingDown = false;

async function shutdownAdvisor(reason: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  console.error(`[system-skill-advisor-launcher] ${reason}`);
  if (launcherIdleMonitor) {
    launcherIdleMonitor.stop();
    launcherIdleMonitor = null;
  }
  if (ipcBridge) {
    await ipcBridge.close().catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[system-skill-advisor-launcher] ipc-bridge close error: ${message}`);
    });
    ipcBridge = null;
  }
  if (skillGraphDaemon) {
    await skillGraphDaemon.shutdown(reason);
    skillGraphDaemon = null;
  }
  closeSkillGraphDb();
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
  // default-trusted behavior for maintenance flows that send no caller
  // authority (e.g. /doctor repair flows) by setting
  // SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT=trusted in the daemon's own environment
  // (launcher env), which callers cannot forge.
  return process.env.SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT === 'trusted';
}

export function buildCallerContext(extra: unknown): CallerContext {
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

// The advisor's own wire dialect, versioned independently of MCP. It is an
// integer-valued string because frame shapes, not capabilities, decide when it moves.
const ADVISOR_PROTOCOL_VERSION = '1';

// Codes the CLI maps onto its exit taxonomy: a bad method or argument is a usage
// failure, a shutting-down daemon is retryable, protocol disagreement has its own
// exit, and a handler failure is a runtime error.
const JSON_RPC_METHOD_NOT_FOUND = -32601;
const JSON_RPC_INVALID_PARAMS = -32602;
const JSON_RPC_INTERNAL_ERROR = -32603;
const JSON_RPC_INVALID_REQUEST = -32600;
const JSON_RPC_DAEMON_UNAVAILABLE = -32000;

function jsonRpcResult(id: unknown, result: unknown): Record<string, unknown> {
  return { jsonrpc: '2.0', id: id ?? null, result };
}

function jsonRpcError(id: unknown, code: number, message: string): Record<string, unknown> {
  return { jsonrpc: '2.0', id: id ?? null, error: { code, message } };
}

function handleInitializeFrame(id: unknown, params: unknown): Record<string, unknown> {
  const clientProtocol = isRecord(params) && typeof params.advisorProtocol === 'string'
    ? params.advisorProtocol
    : null;
  if (clientProtocol !== ADVISOR_PROTOCOL_VERSION) {
    const clientVersion = clientProtocol === null ? 'omitted advisorProtocol' : `"${clientProtocol}"`;
    return jsonRpcError(
      id,
      JSON_RPC_INVALID_REQUEST,
      `advisor protocol disagreement: daemon "${ADVISOR_PROTOCOL_VERSION}", client ${clientVersion}`,
    );
  }
  const status = readAdvisorStatus({ workspaceRoot: resolveWorkspaceRoot() });
  return jsonRpcResult(id, {
    advisorProtocol: ADVISOR_PROTOCOL_VERSION,
    generation: status.generation,
    trustState: status.trustState.state,
  });
}

async function handleAdvisorCallFrame(id: unknown, params: unknown): Promise<Record<string, unknown>> {
  if (!isRecord(params) || typeof params.command !== 'string') {
    return jsonRpcError(id, JSON_RPC_INVALID_PARAMS, 'advisor.call requires a command name');
  }
  const command = params.command;
  if (!TOOL_NAMES.has(command)) {
    return jsonRpcError(id, JSON_RPC_METHOD_NOT_FOUND, `Unknown advisor command: ${command}`);
  }
  const args = params.args ?? {};
  if (!isRecord(args)) {
    return jsonRpcError(id, JSON_RPC_INVALID_PARAMS, 'advisor.call args must be an object');
  }
  // Caller authority rides along in the optional caller block, the same assertion
  // the CLI has always made. Without it the tools see an untrusted caller, so
  // mutations stay refused.
  const callerContext = buildCallerContext(params._meta);
  try {
    const response = await runWithCallerContext(
      callerContext,
      async () => dispatchTool(command, args, callerContext),
    );
    if (!response) {
      return jsonRpcError(id, JSON_RPC_INTERNAL_ERROR, `Unhandled advisor command: ${command}`);
    }
    const text = response.content[0]?.text ?? '';
    return jsonRpcResult(id, JSON.parse(text) as unknown);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    // A schema rejection is bad arguments, not a broken handler.
    if (error instanceof Error && error.name === 'ZodError') {
      return jsonRpcError(id, JSON_RPC_INVALID_PARAMS, message);
    }
    return jsonRpcError(id, JSON_RPC_INTERNAL_ERROR, message);
  }
}

// Frame entry point: a JSON-RPC envelope in, an envelope or silence out. A
// notification is answered with silence, never an error.
async function handleAdvisorFrame(frame: unknown): Promise<Record<string, unknown> | null> {
  if (!isRecord(frame) || frame.jsonrpc !== '2.0' || typeof frame.method !== 'string') {
    return jsonRpcError(isRecord(frame) ? frame.id : null, JSON_RPC_INVALID_REQUEST, 'Invalid JSON-RPC request frame');
  }
  const method = frame.method;
  // The MCP lifecycle notification is gone from this protocol; a client that
  // still sends it is ignored rather than corrected.
  if (method === 'notifications/initialized') {
    return null;
  }
  if (!Object.prototype.hasOwnProperty.call(frame, 'id')) {
    return null;
  }
  const id = frame.id ?? null;
  if (shuttingDown) {
    return jsonRpcError(id, JSON_RPC_DAEMON_UNAVAILABLE, 'advisor daemon is shutting down');
  }
  try {
    if (method === 'initialize') {
      return handleInitializeFrame(id, frame.params);
    }
    if (method === 'advisor.call') {
      return await handleAdvisorCallFrame(id, frame.params);
    }
    return jsonRpcError(id, JSON_RPC_METHOD_NOT_FOUND, `Unknown method: ${method}`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return jsonRpcError(id, JSON_RPC_INTERNAL_ERROR, message);
  }
}

export async function main(): Promise<void> {
  console.error(`[system-skill-advisor-launcher] DB: ${resolveSkillGraphDbPath()}`);
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
      `[system-skill-advisor-launcher] Active embedder: ${resolved.name} (${resolved.dim}-dim)`,
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(
      `[system-skill-advisor-launcher] ensureActiveEmbedder failed: ${message}. Semantic-shadow scoring may degrade until the operator runs the swap runbook.`,
    );
  }

  await startupSkillGraphScan();
  const watchFactory = await loadSkillGraphWatchFactory();
  skillGraphDaemon = await startSkillGraphDaemon({
    workspaceRoot: resolveWorkspaceRoot(),
    skillsRoot: resolveSkillGraphSourceDir() ?? undefined,
    generationReason: 'advisor-server-watcher-reindex',
    watchFactory,
  });
  console.error(`[system-skill-advisor-launcher] Skill graph daemon active=${skillGraphDaemon.active}`);
  launcherIdleMonitor = createLauncherIdleMonitor({
    serviceName: 'system-skill-advisor-launcher',
    getActiveClientCount: () => getIpcBridgeStats().secondary_clients_count,
    onIdle: async () => {
      await shutdownAdvisor('launcher idle timeout');
      process.exit(0);
    },
    log: (message: string) => console.error(message),
  });
  ipcBridge = await startIpcSocketServer({
    socketPath: resolveIpcSocketPath(resolveSkillGraphDbDir()),
    frameHandler: handleAdvisorFrame,
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
    console.error('[system-skill-advisor-launcher] Fatal error:', error);
    void shutdownAdvisor('fatal error').finally(() => process.exit(1));
  });
}
