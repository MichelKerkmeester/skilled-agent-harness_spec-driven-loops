// ───────────────────────────────────────────────────────────────
// MODULE: Code Index CLI Warm Fallback
// ───────────────────────────────────────────────────────────────
// Shared hook helper for bounded code graph reads without cold starts.

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SERVICE_NAME = 'mk-code-index';
const DEFAULT_SOCKET_DIR = '/tmp/mk-code-index';
const DEFAULT_PROBE_TIMEOUT_MS = 80;
const MIN_CLI_TIMEOUT_MS = 25;
const MAX_STDIO_BYTES = 1024 * 1024;

interface RepoPaths {
  readonly repoRoot: string;
  readonly cliShim: string;
  readonly bridgePath: string;
  readonly dbDir: string;
}

interface BridgeModule {
  readonly getIpcSocketPath: (serviceName: string, options?: { dbDir?: string }) => string;
  readonly probeDaemon: (socketPath: string, options?: { timeoutMs?: number; deepProbe?: boolean }) => Promise<{ status: string; reason?: string }>;
}

export interface WarmCodeIndexCliResult {
  readonly status: 'ok' | 'skipped' | 'fail_open';
  readonly payload: unknown | null;
  readonly stdout: string;
  readonly stderr: string;
  readonly exitCode: number | null;
  readonly durationMs: number;
  readonly reason?: string;
}

export interface WarmCodeIndexCliOptions {
  readonly toolName: string;
  readonly args?: Record<string, unknown>;
  readonly timeoutMs: number;
  readonly probeTimeoutMs?: number;
}

type WarmCodeIndexCliObserver = (result: WarmCodeIndexCliResult) => void;

function currentFilePath(): string {
  return fileURLToPath(import.meta.url);
}

function findRepoPaths(startFile = currentFilePath()): RepoPaths | null {
  let current = dirname(startFile);

  while (true) {
    const opencodeDir = join(current, '.opencode');
    const cliShim = join(opencodeDir, 'bin', 'code-index.cjs');
    const bridgePath = join(opencodeDir, 'bin', 'lib', 'launcher-ipc-bridge.cjs');
    if (existsSync(cliShim) && existsSync(bridgePath)) {
      return {
        repoRoot: current,
        cliShim,
        bridgePath,
        dbDir: join(opencodeDir, 'skills', 'system-code-graph', 'mcp_server', 'database'),
      };
    }

    const parent = dirname(current);
    if (parent === current) {
      return null;
    }
    current = parent;
  }
}

function loadBridge(bridgePath: string): BridgeModule {
  const require = createRequire(import.meta.url);
  return require(bridgePath) as BridgeModule;
}

function isSocketPathUsable(socketPath: string): boolean {
  if (socketPath.startsWith('tcp://')) {
    return true;
  }
  if (process.platform === 'darwin' && Buffer.byteLength(socketPath) > 103) {
    return false;
  }
  return existsSync(socketPath);
}

async function probeWarmDaemon(
  paths: RepoPaths,
  timeoutMs: number,
): Promise<{ warm: boolean; reason: string; socketPath?: string }> {
  const previousSocketDir = process.env.SPECKIT_IPC_SOCKET_DIR;
  if (!previousSocketDir) {
    process.env.SPECKIT_IPC_SOCKET_DIR = DEFAULT_SOCKET_DIR;
  }

  try {
    const bridge = loadBridge(paths.bridgePath);
    const socketPath = bridge.getIpcSocketPath(SERVICE_NAME, { dbDir: paths.dbDir });
    if (!isSocketPathUsable(socketPath)) {
      return { warm: false, reason: 'socket_absent', socketPath };
    }
    const probe = await bridge.probeDaemon(socketPath, {
      timeoutMs: Math.max(1, timeoutMs),
      deepProbe: true,
    });
    if (probe.status !== 'alive') {
      return { warm: false, reason: probe.reason ?? probe.status, socketPath };
    }
    return { warm: true, reason: probe.reason ?? 'alive', socketPath };
  } catch (error: unknown) {
    return {
      warm: false,
      reason: error instanceof Error ? error.message : String(error),
    };
  } finally {
    if (!previousSocketDir) {
      delete process.env.SPECKIT_IPC_SOCKET_DIR;
    }
  }
}

function capOutput(current: string, chunk: unknown): string {
  if (current.length >= MAX_STDIO_BYTES) {
    return current;
  }
  return (current + String(chunk)).slice(0, MAX_STDIO_BYTES);
}

function parseCliStdout(stdout: string): unknown | null {
  const trimmed = stdout.trim();
  if (!trimmed) {
    return null;
  }
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return null;
  }
}

function hasArgs(args: Record<string, unknown> | undefined): args is Record<string, unknown> {
  return Boolean(args && Object.keys(args).length > 0);
}

export async function runWarmCodeIndexCliTool(
  options: WarmCodeIndexCliOptions,
): Promise<WarmCodeIndexCliResult> {
  const startedAt = Date.now();
  const timeoutMs = Math.max(1, Math.trunc(options.timeoutMs));
  const paths = findRepoPaths();
  if (!paths) {
    return {
      status: 'skipped',
      payload: null,
      stdout: '',
      stderr: '',
      exitCode: null,
      durationMs: Date.now() - startedAt,
      reason: 'repo_paths_unavailable',
    };
  }

  const probeTimeoutMs = Math.min(
    Math.max(1, Math.trunc(options.probeTimeoutMs ?? DEFAULT_PROBE_TIMEOUT_MS)),
    timeoutMs,
  );
  const warm = await probeWarmDaemon(paths, probeTimeoutMs);
  const afterProbeMs = Date.now() - startedAt;
  if (!warm.warm) {
    return {
      status: 'skipped',
      payload: null,
      stdout: '',
      stderr: '',
      exitCode: 75,
      durationMs: afterProbeMs,
      reason: warm.reason,
    };
  }

  const remainingMs = Math.max(0, timeoutMs - afterProbeMs);
  if (remainingMs < MIN_CLI_TIMEOUT_MS) {
    return {
      status: 'skipped',
      payload: null,
      stdout: '',
      stderr: '',
      exitCode: 75,
      durationMs: Date.now() - startedAt,
      reason: 'budget_exhausted_before_cli',
    };
  }

  const cliArgs = [
    '.opencode/bin/code-index.cjs',
    options.toolName,
    '--format',
    'json',
    '--timeout-ms',
    String(Math.max(1, Math.trunc(remainingMs))),
    '--warm-only',
  ];
  if (hasArgs(options.args)) {
    cliArgs.push('--json', JSON.stringify(options.args));
  }

  return new Promise<WarmCodeIndexCliResult>((resolveResult) => {
    const child = spawn(process.execPath, cliArgs, {
      cwd: paths.repoRoot,
      env: {
        ...process.env,
        SPECKIT_IPC_SOCKET_DIR: process.env.SPECKIT_IPC_SOCKET_DIR ?? DEFAULT_SOCKET_DIR,
        SPECKIT_CODE_INDEX_CLI_PROMPT_TIME: '1',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    let settled = false;
    let timedOut = false;
    const finish = (exitCode: number | null, reason?: string): void => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      const payload = parseCliStdout(stdout);
      const status: WarmCodeIndexCliResult['status'] = exitCode === 0 && payload
        ? 'ok'
        : 'fail_open';
      resolveResult({
        status,
        payload,
        stdout,
        stderr,
        exitCode,
        durationMs: Date.now() - startedAt,
        ...(reason ? { reason } : {}),
      });
    };
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGTERM');
      setTimeout(() => {
        if (!settled) {
          child.kill('SIGKILL');
        }
      }, 100).unref?.();
    }, remainingMs);
    timer.unref?.();

    child.stdout?.setEncoding?.('utf8');
    child.stderr?.setEncoding?.('utf8');
    child.stdout?.on('data', (chunk) => {
      stdout = capOutput(stdout, chunk);
    });
    child.stderr?.on('data', (chunk) => {
      stderr = capOutput(stderr, chunk);
    });
    child.on('error', (error) => {
      finish(null, error.message);
    });
    child.on('close', (code) => {
      finish(code, timedOut ? 'timeout' : undefined);
    });
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function unwrapData(payload: unknown): unknown {
  if (!isRecord(payload)) {
    return payload;
  }
  return Object.prototype.hasOwnProperty.call(payload, 'data') ? payload.data : payload;
}

function stringField(record: unknown, field: string): string | null {
  if (!isRecord(record)) {
    return null;
  }
  const value = record[field];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function recordField(record: unknown, field: string): Record<string, unknown> | null {
  if (!isRecord(record)) {
    return null;
  }
  const value = record[field];
  return isRecord(value) ? value : null;
}

function scalarField(record: unknown, field: string): string | null {
  if (!isRecord(record)) {
    return null;
  }
  const value = record[field];
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return null;
}

export function renderCodeIndexCliStatusBrief(payload: unknown, maxChars = 1600): string | null {
  const data = unwrapData(payload);
  const root = isRecord(payload) ? payload : null;
  const status = root ? stringField(root, 'status') ?? 'unknown' : 'unknown';
  const message = root ? stringField(root, 'message') ?? stringField(root, 'error') : null;
  const readiness = recordField(data, 'readiness');
  const fallback = recordField(data, 'fallbackDecision');
  const parts = [
    `status=${status}`,
    `freshness=${scalarField(data, 'freshness') ?? scalarField(data, 'canonicalReadiness') ?? scalarField(readiness, 'canonicalReadiness') ?? 'unknown'}`,
    `files=${scalarField(data, 'totalFiles') ?? 'unknown'}`,
    `nodes=${scalarField(data, 'totalNodes') ?? 'unknown'}`,
    `edges=${scalarField(data, 'totalEdges') ?? 'unknown'}`,
  ];
  const sections = [`Code graph CLI status: ${parts.join('; ')}`];

  const readinessReason = stringField(readiness, 'reason') ?? stringField(data, 'blockReason');
  const action = scalarField(readiness, 'action') ?? scalarField(data, 'requiredAction') ?? scalarField(fallback, 'nextTool');
  if (readinessReason || action) {
    sections.push(`Readiness: ${readinessReason ?? 'no reason reported'}${action ? `; action=${action}` : ''}`);
  }

  const trustState = scalarField(data, 'trustState') ?? scalarField(readiness, 'trustState');
  const lastScanAt = scalarField(data, 'lastScanAt') ?? scalarField(data, 'lastPersistedAt');
  if (trustState || lastScanAt) {
    sections.push(`Trust: ${trustState ?? 'unknown'}${lastScanAt ? `; lastScanAt=${lastScanAt}` : ''}`);
  }

  if (message) {
    sections.push(`Message: ${message}`);
  }

  const brief = sections.join('\n').trim();
  if (!brief) {
    return null;
  }
  return brief.length <= maxChars ? brief : `${brief.slice(0, Math.max(1, maxChars - 3)).trimEnd()}...`;
}

export async function buildWarmCodeGraphStatusSection(options: {
  readonly title: string;
  readonly timeoutMs: number;
  readonly includeRetryableStatus?: boolean;
  readonly onResult?: WarmCodeIndexCliObserver;
}): Promise<{ title: string; content: string } | null> {
  const result = await runWarmCodeIndexCliTool({
    toolName: 'code-graph-status',
    timeoutMs: options.timeoutMs,
  });
  options.onResult?.(result);
  if (result.status === 'ok') {
    const brief = renderCodeIndexCliStatusBrief(result.payload);
    return brief ? { title: options.title, content: brief } : null;
  }
  if (options.includeRetryableStatus && result.exitCode === 75) {
    return {
      title: options.title,
      content: `Code-index CLI warm fallback skipped: ${result.reason ?? 'daemon unavailable'}; retryable exit=75; no cold spawn attempted.`,
    };
  }
  return null;
}
