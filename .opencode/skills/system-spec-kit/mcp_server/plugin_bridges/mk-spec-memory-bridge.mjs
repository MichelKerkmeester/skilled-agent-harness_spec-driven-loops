#!/usr/bin/env node
'use strict';

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const SERVICE_NAME = 'mk-spec-memory';
const DEFAULT_SOCKET_DIR = '/tmp/mk-spec-memory';
const DEFAULT_TIMEOUT_MS = 2500;
const DEFAULT_PROBE_TIMEOUT_MS = 100;
const MAX_STDIO_BYTES = 1024 * 1024;
const CLI_SHIM = fileURLToPath(new URL('../../../../bin/spec-memory.cjs', import.meta.url));
const BRIDGE_PATH = fileURLToPath(new URL('../../../../bin/lib/launcher-ipc-bridge.cjs', import.meta.url));
const DB_DIR = fileURLToPath(new URL('../database', import.meta.url));
const REPO_ROOT = fileURLToPath(new URL('../../../../..', import.meta.url));
const PROMPT_SAFE_REQUESTS = new Set(['brief', 'status']);
const PROMPT_SAFE_TOOLS = new Set(['session_resume', 'memory_health']);

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

function recordField(record, field) {
  if (!isRecord(record)) return null;
  const value = record[field];
  return isRecord(value) ? value : null;
}

function arrayField(record, field) {
  if (!isRecord(record)) return [];
  const value = record[field];
  return Array.isArray(value) ? value : [];
}

function renderContinuityBrief(payload, maxChars = 2400) {
  const data = unwrapData(payload);
  const sections = [];
  const transport = recordField(data, 'opencodeTransport');
  const systemBlock = recordField(transport, 'systemTransform');
  const messageBlock = arrayField(transport, 'messagesTransform').find(isRecord);
  const transportBlock = systemBlock ?? messageBlock;
  if (transportBlock) {
    const title = stringField(transportBlock, 'title');
    const content = stringField(transportBlock, 'content');
    if (content) {
      sections.push(title ? `${title}\n${content}` : content);
    }
  }

  const cachedDecision = recordField(data, 'cachedSummary');
  const cachedSummary = recordField(cachedDecision, 'cachedSummary');
  const continuity = stringField(cachedSummary, 'startupHint')
    ?? stringField(cachedSummary, 'continuityText')
    ?? stringField(cachedSummary, 'summaryText');
  if (continuity) {
    sections.push(continuity);
  }

  const structuralContext = recordField(data, 'structuralContext');
  const structuralSummary = stringField(structuralContext, 'summary');
  if (structuralSummary) {
    sections.push(`Structural context: ${structuralSummary}`);
  }

  const codeGraph = recordField(data, 'codeGraph');
  if (codeGraph) {
    const status = stringField(codeGraph, 'status') ?? 'unknown';
    const files = codeGraph.fileCount ?? 'unknown';
    const nodes = codeGraph.nodeCount ?? 'unknown';
    sections.push(`Code graph: status=${status}; files=${String(files)}; nodes=${String(nodes)}`);
  }

  const hints = arrayField(data, 'hints')
    .filter((hint) => typeof hint === 'string' && hint.trim())
    .slice(0, 3);
  if (hints.length > 0) {
    sections.push(`Hints:\n${hints.map((hint) => `- ${hint.trim()}`).join('\n')}`);
  }

  const brief = sections.join('\n\n').trim();
  if (!brief) return null;
  return brief.length <= maxChars ? brief : `${brief.slice(0, Math.max(1, maxChars - 3)).trimEnd()}...`;
}

function capOutput(current, chunk) {
  if (current.length >= MAX_STDIO_BYTES) return current;
  return (current + String(chunk)).slice(0, MAX_STDIO_BYTES);
}

async function readStdin() {
  let input = '';
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) {
    input += chunk;
  }
  return input;
}

function parseInput(text) {
  if (!text.trim()) {
    return {};
  }
  const parsed = JSON.parse(text);
  return isRecord(parsed) ? parsed : {};
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
        action: 'run npm run build --workspace=@spec-kit/mcp-server',
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

async function runCli(input) {
  const startedAt = Date.now();
  const timeoutMs = positiveInt(Number(input.timeoutMs), DEFAULT_TIMEOUT_MS);
  const probeTimeoutMs = Math.min(positiveInt(Number(input.probeTimeoutMs), DEFAULT_PROBE_TIMEOUT_MS), timeoutMs);
  const request = typeof input.request === 'string' && input.request.trim()
    ? input.request.trim()
    : 'brief';
  const toolName = typeof input.toolName === 'string' && input.toolName.trim()
    ? input.toolName.trim()
    : (request === 'status' ? 'memory_health' : 'session_resume');
  const promptSafePolicy = promptSafeSpecMemoryBridgePolicy({ request, toolName });
  if (!promptSafePolicy.allowed) {
    return skipped(promptSafePolicy.reason, {
      route: 'prompt_safe_policy',
      request,
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
      socketPath: probe.socketPath ? '[spec-memory-socket]' : null,
      exitCode: 75,
    });
  }

  const remainingMs = Math.max(1, timeoutMs - afterProbeMs);
  const args = isRecord(input.args) ? { ...input.args } : {};
  if (toolName === 'session_resume') {
    args.minimal = args.minimal !== false;
    if (typeof input.specFolder === 'string' && input.specFolder.trim()) {
      args.specFolder = input.specFolder.trim();
    }
    if (typeof input.sessionId === 'string' && input.sessionId.trim()) {
      args.sessionId = input.sessionId.trim();
    }
  }

  return new Promise((resolveResult) => {
    const child = spawn(process.execPath, [
      CLI_SHIM,
      toolName,
      '--json',
      JSON.stringify(args),
      '--format',
      'json',
      '--timeout-ms',
      String(remainingMs),
      '--warm-only',
    ], {
      cwd: typeof input.workspaceRoot === 'string' && input.workspaceRoot.trim() ? input.workspaceRoot.trim() : REPO_ROOT,
      env: {
        ...process.env,
        SPECKIT_IPC_SOCKET_DIR: process.env.SPECKIT_IPC_SOCKET_DIR ?? DEFAULT_SOCKET_DIR,
        SPECKIT_SPEC_MEMORY_CLI_PROMPT_TIME: '1',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    let settled = false;
    let timedOut = false;
    const finish = (exitCode, error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      const payload = parseStdout(stdout);
      const durationMs = Date.now() - startedAt;
      if (exitCode === 0 && payload) {
        resolveResult(response({
          status: 'ok',
          brief: input.request === 'status' ? null : renderContinuityBrief(payload, positiveInt(Number(input.maxBriefChars), 2400)),
          data: payload,
          metadata: {
            route: 'cli',
            toolName,
            warm: true,
            durationMs,
            exitCode,
            socketPath: '[spec-memory-socket]',
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
      child.kill('SIGTERM');
      setTimeout(() => {
        if (!settled) child.kill('SIGKILL');
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
    child.on('error', (error) => finish(null, error.message));
    child.on('close', (code) => finish(code, null));
  });
}

function promptSafeSpecMemoryBridgePolicy(input) {
  const request = typeof input?.request === 'string' ? input.request.trim() : '';
  const toolName = typeof input?.toolName === 'string' ? input.toolName.trim() : '';
  if (!PROMPT_SAFE_REQUESTS.has(request)) {
    return { allowed: false, reason: 'prompt_request_not_allowed' };
  }
  if (!PROMPT_SAFE_TOOLS.has(toolName)) {
    return { allowed: false, reason: 'prompt_tool_not_allowed' };
  }
  return { allowed: true, reason: 'prompt_safe' };
}

async function main() {
  const input = parseInput(await readStdin());
  return runCli(input);
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

export { classifyCliFailure, promptSafeSpecMemoryBridgePolicy, renderContinuityBrief, response, runCli, warmProbe };
