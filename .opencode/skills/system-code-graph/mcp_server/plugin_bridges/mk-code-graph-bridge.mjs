#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Code Graph Plugin Bridge                                               ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const SERVICE_NAME = 'mk-code-index';
const DEFAULT_SOCKET_DIR = '/tmp/mk-code-index';
const DEFAULT_TIMEOUT_MS = 2500;
const DEFAULT_PROBE_TIMEOUT_MS = 100;
const MAX_STDIO_BYTES = 1024 * 1024;
const EXIT_SETTLE_GRACE_MS = 25;
const TERMINATION_GRACE_MS = 100;
const CLI_SHIM = fileURLToPath(new URL('../../../../bin/code-index.cjs', import.meta.url));
const BRIDGE_PATH = fileURLToPath(new URL('../../../../bin/lib/launcher-ipc-bridge.cjs', import.meta.url));
const DB_DIR = fileURLToPath(new URL('../database', import.meta.url));
const REPO_ROOT = fileURLToPath(new URL('../../../../..', import.meta.url));
// Normalized form folds snake/kebab/camel into one key so the maintenance blocklist
// cannot be bypassed by passing --tool codeGraphScan instead of code_graph_scan; the
// downstream CLI resolves all three alias casings to the same canonical maintenance tool.
function normalizeToolName(name) {
  return String(name).replace(/[-_]/g, '').toLowerCase();
}

const MAINTENANCE_TOOLS = new Set([
  'code_graph_scan',
  'code_graph_apply',
  'code_graph_verify',
].map(normalizeToolName));

function response(args) {
  return {
    status: ['ok', 'skipped', 'fail_open'].includes(args.status) ? args.status : 'fail_open',
    brief: typeof args.brief === 'string' && args.brief.trim() ? args.brief : null,
    data: args.data ?? null,
    metadata: args.metadata && typeof args.metadata === 'object' ? args.metadata : {},
    ...(args.error ? { error: String(args.error).toUpperCase().replace(/[^A-Z0-9_]/g, '_') || 'UNKNOWN' } : {}),
  };
}

function failOpen(error, metadata = {}) {
  return response({ status: 'fail_open', brief: null, data: null, error, metadata });
}

function skipped(error, metadata = {}) {
  return response({ status: 'skipped', brief: null, data: null, error, metadata });
}

function positiveInt(value, fallback) {
  return Number.isFinite(value) && value > 0 ? Math.trunc(value) : fallback;
}

function isRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function unwrapData(payload) {
  return isRecord(payload) && Object.prototype.hasOwnProperty.call(payload, 'data')
    ? payload.data
    : payload;
}

function stringField(record, field) {
  if (!isRecord(record)) return null;
  const value = record[field];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function scalarField(record, field) {
  if (!isRecord(record)) return null;
  const value = record[field];
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return null;
}

function recordField(record, field) {
  if (!isRecord(record)) return null;
  const value = record[field];
  return isRecord(value) ? value : null;
}

function capOutput(current, chunk) {
  if (current.length >= MAX_STDIO_BYTES) return current;
  return (current + String(chunk)).slice(0, MAX_STDIO_BYTES);
}

function parseStdout(stdout) {
  const trimmed = stdout.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

function classifyCliFailure(exitCode, stderr, timedOut) {
  const staleDist = exitCode === 69 && /dist entrypoint is (stale|missing)/i.test(stderr);
  if (staleDist) {
    return {
      status: 'fail_open',
      brief: 'dist stale, rebuild required',
      error: 'dist_stale_rebuild_required',
      retryable: false,
      metadata: {
        state: 'dist_stale_rebuild_required',
        staleDist: true,
        rebuildRequired: true,
        action: 'run tsc -p .opencode/skills/system-code-graph/tsconfig.json',
      },
    };
  }
  const retryable = exitCode === 75 || timedOut;
  return {
    status: retryable ? 'skipped' : 'fail_open',
    brief: null,
    error: timedOut ? 'timeout' : `exit_${exitCode ?? 'unknown'}`,
    retryable,
    metadata: {},
  };
}

function withDefaultSocketEnv(fn) {
  const previous = process.env.SPECKIT_IPC_SOCKET_DIR;
  if (!previous) {
    process.env.SPECKIT_IPC_SOCKET_DIR = DEFAULT_SOCKET_DIR;
  }
  try {
    return fn();
  } finally {
    if (!previous) {
      delete process.env.SPECKIT_IPC_SOCKET_DIR;
    }
  }
}

async function warmProbe(timeoutMs) {
  if (!existsSync(CLI_SHIM) || !existsSync(BRIDGE_PATH)) {
    return { warm: false, reason: 'missing_runtime_assets' };
  }
  const require = createRequire(import.meta.url);
  const bridge = require(BRIDGE_PATH);
  return withDefaultSocketEnv(async () => {
    const socketPath = bridge.getIpcSocketPath(SERVICE_NAME, { dbDir: DB_DIR });
    if (!socketPath.startsWith('tcp://') && !existsSync(socketPath)) {
      return { warm: false, reason: 'socket_absent', socketPath };
    }
    if (process.platform === 'darwin' && !socketPath.startsWith('tcp://') && Buffer.byteLength(socketPath) > 103) {
      return { warm: false, reason: 'socket_path_too_long', socketPath };
    }
    const probe = await bridge.probeDaemon(socketPath, {
      timeoutMs: Math.max(1, timeoutMs),
      deepProbe: true,
    });
    return probe.status === 'alive'
      ? { warm: true, reason: probe.reason ?? 'alive', socketPath }
      : { warm: false, reason: probe.reason ?? probe.status, socketPath };
  });
}

function renderCodeGraphBrief(payload, maxChars = 2400) {
  const data = unwrapData(payload);
  const root = isRecord(payload) ? payload : null;
  const readiness = recordField(data, 'readiness');
  const fallback = recordField(data, 'fallbackDecision');
  const status = root ? stringField(root, 'status') ?? 'unknown' : 'unknown';
  const message = root ? stringField(root, 'message') ?? stringField(root, 'error') : null;
  const parts = [
    `status=${status}`,
    `freshness=${scalarField(data, 'freshness') ?? scalarField(data, 'canonicalReadiness') ?? scalarField(readiness, 'canonicalReadiness') ?? 'unknown'}`,
    `files=${scalarField(data, 'totalFiles') ?? 'unknown'}`,
    `nodes=${scalarField(data, 'totalNodes') ?? 'unknown'}`,
    `edges=${scalarField(data, 'totalEdges') ?? 'unknown'}`,
  ];
  const sections = [`Code graph status: ${parts.join('; ')}`];
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
  if (!brief) return null;
  return brief.length <= maxChars ? brief : `${brief.slice(0, Math.max(1, maxChars - 3)).trimEnd()}...`;
}

function buildTransportPlan(brief) {
  return {
    interfaceVersion: '1.0',
    transportOnly: true,
    retrievalPolicyOwner: 'runtime',
    event: {
      hook: 'event',
      trackedPayloadKinds: ['code_graph_status'],
      summary: 'Track code graph readiness hints',
    },
    systemTransform: {
      hook: 'experimental.chat.system.transform',
      title: 'OpenCode Code Graph Digest',
      payloadKind: 'code_graph_status',
      dedupeKey: 'system:code_graph_status',
      content: brief,
    },
    messagesTransform: [{
      hook: 'experimental.chat.messages.transform',
      title: 'OpenCode Code Graph Context',
      payloadKind: 'code_graph_status',
      dedupeKey: 'messages:code_graph_status:0',
      content: brief,
    }],
    compaction: {
      hook: 'experimental.session.compacting',
      title: 'OpenCode Code Graph Compaction Note',
      payloadKind: 'code_graph_status',
      dedupeKey: 'compaction:code_graph_status',
      content: brief,
    },
  };
}

function readOptionValue(tokens, index, flagName) {
  const nextValue = tokens[index + 1];
  if (typeof nextValue !== 'string' || !nextValue.trim()) {
    throw new Error(`${flagName} requires a value`);
  }
  return { value: nextValue.trim(), nextIndex: index + 2 };
}

function parseArgs(argv) {
  const options = {
    minimal: false,
    specFolder: undefined,
    toolName: 'code-graph-status',
    args: {},
    timeoutMs: DEFAULT_TIMEOUT_MS,
    probeTimeoutMs: DEFAULT_PROBE_TIMEOUT_MS,
    maxBriefChars: 2400,
  };

  for (let index = 0; index < argv.length;) {
    const value = argv[index];
    if (value === '--minimal') {
      options.minimal = true;
      index += 1;
      continue;
    }
    if (value === '--spec-folder') {
      const read = readOptionValue(argv, index, value);
      options.specFolder = read.value;
      index = read.nextIndex;
      continue;
    }
    if (value === '--tool' || value === '--tool-name') {
      const read = readOptionValue(argv, index, value);
      options.toolName = read.value;
      index = read.nextIndex;
      continue;
    }
    if (value === '--json') {
      const read = readOptionValue(argv, index, value);
      const parsed = JSON.parse(read.value);
      options.args = isRecord(parsed) ? parsed : {};
      index = read.nextIndex;
      continue;
    }
    if (value === '--timeout-ms') {
      const read = readOptionValue(argv, index, value);
      options.timeoutMs = positiveInt(Number(read.value), DEFAULT_TIMEOUT_MS);
      index = read.nextIndex;
      continue;
    }
    if (value === '--probe-timeout-ms') {
      const read = readOptionValue(argv, index, value);
      options.probeTimeoutMs = positiveInt(Number(read.value), DEFAULT_PROBE_TIMEOUT_MS);
      index = read.nextIndex;
      continue;
    }
    if (value === '--max-brief-chars') {
      const read = readOptionValue(argv, index, value);
      options.maxBriefChars = positiveInt(Number(read.value), 2400);
      index = read.nextIndex;
      continue;
    }
    index += 1;
  }

  return options;
}

async function runCli(input) {
  const startedAt = Date.now();
  const timeoutMs = positiveInt(Number(input.timeoutMs), DEFAULT_TIMEOUT_MS);
  const probeTimeoutMs = Math.min(positiveInt(Number(input.probeTimeoutMs), DEFAULT_PROBE_TIMEOUT_MS), timeoutMs);
  const toolName = typeof input.toolName === 'string' && input.toolName.trim()
    ? input.toolName.trim()
    : 'code-graph-status';
  if (MAINTENANCE_TOOLS.has(normalizeToolName(toolName))) {
    return skipped('maintenance_tool_blocked', {
      route: 'prompt_safe_policy',
      toolName,
      retryable: false,
      durationMs: Date.now() - startedAt,
    });
  }

  const probe = await warmProbe(probeTimeoutMs);
  const afterProbeMs = Date.now() - startedAt;
  if (!probe.warm) {
    return skipped(probe.reason, {
      route: 'warm_probe',
      retryable: true,
      durationMs: afterProbeMs,
      socketPath: probe.socketPath ? '[code-index-socket]' : null,
      exitCode: 75,
    });
  }

  const remainingMs = Math.max(1, timeoutMs - afterProbeMs);
  const args = isRecord(input.args) ? { ...input.args } : {};
  const cliArgs = [
    CLI_SHIM,
    toolName,
    '--format',
    'json',
    '--timeout-ms',
    String(remainingMs),
    '--warm-only',
  ];
  if (Object.keys(args).length > 0) {
    cliArgs.push('--json', JSON.stringify(args));
  }

  return new Promise((resolveResult) => {
    const child = spawn(process.execPath, cliArgs, {
      cwd: typeof input.workspaceRoot === 'string' && input.workspaceRoot.trim() ? input.workspaceRoot.trim() : REPO_ROOT,
      detached: process.platform !== 'win32',
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
    let exitTimer = null;
    let terminationTimer = null;
    const killProcessGroup = (signal) => {
      if (process.platform !== 'win32' && child.pid) {
        try {
          process.kill(-child.pid, signal);
          return;
        } catch {
          // Fall through when the process group has already exited.
        }
      }
      try {
        child.kill(signal);
      } catch {
        // Settlement remains timer-bounded even when the direct child is gone.
      }
    };
    const finish = (exitCode, error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      clearTimeout(exitTimer);
      clearTimeout(terminationTimer);
      const payload = parseStdout(stdout);
      const durationMs = Date.now() - startedAt;
      if (exitCode === 0 && payload) {
        const brief = renderCodeGraphBrief(payload, positiveInt(Number(input.maxBriefChars), 2400));
        const opencodeTransport = brief ? buildTransportPlan(brief) : null;
        resolveResult(response({
          status: 'ok',
          brief,
          data: {
            toolName,
            ...(!input.minimal ? { codeGraphStatus: payload } : {}),
            ...(opencodeTransport ? { opencodeTransport } : {}),
          },
          metadata: {
            route: 'cli',
            toolName,
            warm: true,
            durationMs,
            exitCode,
            specFolder: typeof input.specFolder === 'string' && input.specFolder.trim()
              ? input.specFolder.trim()
              : null,
            socketPath: '[code-index-socket]',
          },
        }));
        return;
      }
      const failure = classifyCliFailure(exitCode, stderr, timedOut);
      resolveResult(response({
        status: failure.status,
        brief: failure.brief,
        data: payload,
        error: error ?? failure.error,
        metadata: {
          route: 'cli',
          toolName,
          warm: true,
          durationMs,
          exitCode,
          retryable: failure.retryable,
          ...failure.metadata,
          stderr: stderr ? '[stderr-present]' : null,
        },
      }));
    };
    const timer = setTimeout(() => {
      timedOut = true;
      killProcessGroup('SIGTERM');
      terminationTimer = setTimeout(() => {
        if (!settled) {
          killProcessGroup('SIGKILL');
          finish(null, 'timeout');
        }
      }, TERMINATION_GRACE_MS);
      terminationTimer.unref?.();
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
    child.on('error', (error) => finish(null, error.message));
    child.on('exit', (code) => {
      exitTimer = setTimeout(() => finish(code, null), EXIT_SETTLE_GRACE_MS);
      exitTimer.unref?.();
    });
    child.on('close', (code) => finish(code, null));
  });
}

async function main() {
  return runCli(parseArgs(process.argv.slice(2)));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main()
    .then((payload) => {
      process.stdout.write(JSON.stringify(payload));
    })
    .catch((error) => {
      process.stdout.write(JSON.stringify(failOpen(error?.code ?? error?.name ?? 'UNKNOWN')));
    });
}

export { classifyCliFailure, renderCodeGraphBrief, response, runCli, warmProbe };
