// ───────────────────────────────────────────────────────────────
// MODULE: Spec Memory CLI Warm Fallback
// ───────────────────────────────────────────────────────────────
// Shared hook helper for bounded CLI recovery without prompt-time cold starts.

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SERVICE_NAME = 'mk-spec-memory';
const DEFAULT_SOCKET_DIR = '/tmp/mk-spec-memory';
const DEFAULT_PROBE_TIMEOUT_MS = 80;
const MIN_CLI_TIMEOUT_MS = 25;
const MAX_STDIO_BYTES = 1024 * 1024;
const EXIT_SETTLE_GRACE_MS = 25;

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

export interface WarmSpecMemoryCliResult {
  readonly status: 'ok' | 'skipped' | 'fail_open';
  readonly payload: unknown | null;
  readonly stdout: string;
  readonly stderr: string;
  readonly exitCode: number | null;
  readonly durationMs: number;
  readonly reason?: string;
}

export interface WarmSpecMemoryCliOptions {
  readonly toolName: string;
  readonly args?: Record<string, unknown>;
  readonly timeoutMs: number;
  readonly probeTimeoutMs?: number;
  readonly sessionId?: string;
}

type WarmSpecMemoryCliObserver = (result: WarmSpecMemoryCliResult) => void;

function currentFilePath(): string {
  return fileURLToPath(import.meta.url);
}

function findRepoPaths(startFile = currentFilePath()): RepoPaths | null {
  let current = dirname(startFile);

  while (true) {
    const opencodeDir = join(current, '.opencode');
    const cliShim = join(opencodeDir, 'bin', 'spec-memory.cjs');
    const bridgePath = join(opencodeDir, 'bin', 'lib', 'launcher-ipc-bridge.cjs');
    if (existsSync(cliShim) && existsSync(bridgePath)) {
      return {
        repoRoot: current,
        cliShim,
        bridgePath,
        dbDir: join(opencodeDir, 'skills', 'system-spec-kit', 'mcp_server', 'database'),
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

export async function runWarmSpecMemoryCliTool(
  options: WarmSpecMemoryCliOptions,
): Promise<WarmSpecMemoryCliResult> {
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
      exitCode: warm.reason === 'socket_absent' ? 75 : null,
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
    '.opencode/bin/spec-memory.cjs',
    options.toolName,
    '--json',
    JSON.stringify(options.args ?? {}),
    '--format',
    'json',
    '--timeout-ms',
    String(Math.max(1, Math.trunc(remainingMs))),
    '--warm-only',
  ];
  if (options.sessionId) {
    cliArgs.push('--session-id', options.sessionId);
  }

  return new Promise<WarmSpecMemoryCliResult>((resolveResult) => {
    const child = spawn(process.execPath, cliArgs, {
      cwd: paths.repoRoot,
      env: {
        ...process.env,
        SPECKIT_IPC_SOCKET_DIR: process.env.SPECKIT_IPC_SOCKET_DIR ?? DEFAULT_SOCKET_DIR,
        SPECKIT_SPEC_MEMORY_CLI_PROMPT_TIME: '1',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: true,
    });
    let stdout = '';
    let stderr = '';
    let settled = false;
    let timedOut = false;
    const killProcessGroup = (): void => {
      const pid = child.pid;
      if (typeof pid !== 'number') {
        return;
      }
      try {
        // The shim runs the dist CLI as a grandchild via spawnSync; killing
        // only the shim leaves that grandchild holding the stdio pipes.
        process.kill(-pid, 'SIGKILL');
      } catch {
        // ESRCH: the group already exited.
      }
    };
    const finish = (exitCode: number | null, reason?: string): void => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      try {
        const stdoutRest = child.stdout?.read() as string | null | undefined;
        if (stdoutRest) {
          stdout = capOutput(stdout, stdoutRest);
        }
        const stderrRest = child.stderr?.read() as string | null | undefined;
        if (stderrRest) {
          stderr = capOutput(stderr, stderrRest);
        }
      } catch {
        // Best-effort drain only.
      }
      const payload = parseCliStdout(stdout);
      const status: WarmSpecMemoryCliResult['status'] = exitCode === 0 && payload
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
      killProcessGroup();
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
    child.on('exit', (code) => {
      // 'close' never fires while a surviving grandchild holds the stdio
      // pipes; settle shortly after exit so a held pipe cannot block the
      // hook. 'close' below still wins the race in the normal case.
      setTimeout(() => {
        finish(code, timedOut ? 'timeout' : undefined);
      }, EXIT_SETTLE_GRACE_MS).unref?.();
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

function arrayField(record: unknown, field: string): unknown[] {
  if (!isRecord(record)) {
    return [];
  }
  const value = record[field];
  return Array.isArray(value) ? value : [];
}

export function renderSpecMemoryCliBrief(payload: unknown, maxChars = 2000): string | null {
  const data = unwrapData(payload);
  const sections: string[] = [];
  const cachedDecision = recordField(data, 'cachedSummary');
  const cachedSummary = recordField(cachedDecision, 'cachedSummary');
  const continuity = stringField(cachedSummary, 'startupHint')
    ?? stringField(cachedSummary, 'continuityText')
    ?? stringField(cachedSummary, 'summaryText');
  if (continuity) {
    sections.push(continuity);
  }

  const memory = recordField(data, 'memory');
  const memoryText = stringField(memory, 'formattedContext')
    ?? stringField(memory, 'context')
    ?? stringField(memory, 'summary')
    ?? stringField(memory, 'text');
  if (memoryText && !sections.includes(memoryText)) {
    sections.push(memoryText);
  }

  const payloadContract = recordField(data, 'payloadContract');
  const payloadSummary = stringField(payloadContract, 'summary');
  if (payloadSummary) {
    sections.push(payloadSummary);
  }

  const structuralContext = recordField(data, 'structuralContext');
  const structuralSummary = stringField(structuralContext, 'summary');
  if (structuralSummary) {
    sections.push(`Structural context: ${structuralSummary}`);
  }

  const codeGraph = recordField(data, 'codeGraph');
  if (codeGraph) {
    const status = stringField(codeGraph, 'status') ?? 'unknown';
    const files = codeGraph.fileCount ?? codeGraph.files ?? 'unknown';
    const nodes = codeGraph.nodeCount ?? codeGraph.nodes ?? 'unknown';
    sections.push(`Code graph: status=${status}; files=${String(files)}; nodes=${String(nodes)}`);
  }

  const hints = arrayField(data, 'hints')
    .filter((hint): hint is string => typeof hint === 'string' && hint.trim().length > 0)
    .slice(0, 3);
  if (hints.length > 0) {
    sections.push(`Hints:\n${hints.map((hint) => `- ${hint.trim()}`).join('\n')}`);
  }

  if (sections.length === 0) {
    const fallback = stringField(data, 'summary')
      ?? stringField(data, 'message')
      ?? stringField(data, 'text');
    if (fallback) {
      sections.push(fallback);
    }
  }

  const brief = sections.join('\n\n').trim();
  if (!brief) {
    return null;
  }
  return brief.length <= maxChars ? brief : `${brief.slice(0, Math.max(1, maxChars - 3)).trimEnd()}...`;
}

export async function buildWarmSessionResumeSection(options: {
  readonly title: string;
  readonly specFolder?: string;
  readonly sessionId?: string;
  readonly timeoutMs: number;
  readonly onResult?: WarmSpecMemoryCliObserver;
}): Promise<{ title: string; content: string } | null> {
  const args: Record<string, unknown> = { minimal: true };
  if (options.specFolder) {
    args.specFolder = options.specFolder;
  }
  if (options.sessionId) {
    args.sessionId = options.sessionId;
  }
  const result = await runWarmSpecMemoryCliTool({
    toolName: 'session_resume',
    args,
    sessionId: options.sessionId,
    timeoutMs: options.timeoutMs,
  });
  options.onResult?.(result);
  if (result.status !== 'ok') {
    return null;
  }
  const brief = renderSpecMemoryCliBrief(result.payload);
  return brief ? { title: options.title, content: brief } : null;
}

export async function buildWarmMemoryContextSection(options: {
  readonly title: string;
  readonly input: string;
  readonly sessionId?: string;
  readonly timeoutMs: number;
  readonly onResult?: WarmSpecMemoryCliObserver;
}): Promise<{ title: string; content: string } | null> {
  const trimmedInput = options.input.trim();
  if (trimmedInput.length < 3) {
    return null;
  }
  const args: Record<string, unknown> = {
    input: trimmedInput.slice(0, 4000),
    mode: 'quick',
    limit: 5,
    includeContent: false,
  };
  if (options.sessionId) {
    args.sessionId = options.sessionId;
  }
  const result = await runWarmSpecMemoryCliTool({
    toolName: 'memory_context',
    args,
    sessionId: options.sessionId,
    timeoutMs: options.timeoutMs,
  });
  options.onResult?.(result);
  if (result.status !== 'ok') {
    return null;
  }
  const brief = renderSpecMemoryCliBrief(result.payload);
  return brief ? { title: options.title, content: brief } : null;
}
