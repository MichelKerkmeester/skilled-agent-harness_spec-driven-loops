'use strict';

const fs = require('fs');
const net = require('net');
const path = require('path');
const { StringDecoder } = require('string_decoder');

const SOCKET_FILE_NAME = 'daemon-ipc.sock';
const DEFAULT_PROBE_TIMEOUT_MS = 5000;
const MAX_PROBE_TIMEOUT_MS = 6999;
const DEFAULT_MODEL_SERVER_LOADING_MAX_MS = 150000;
const JSON_RPC_PROTOCOL_VERSION = '2025-06-18';
const MODEL_SERVER_HEALTH_PATH = '/api/health';
let nextProbeId = 1;

function parsePositiveInteger(value, fallback) {
  if (value === undefined || value === null || String(value).trim() === '') return fallback;
  const parsed = Number.parseInt(String(value).trim(), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function clampProbeTimeoutMs(value) {
  return Math.min(value, MAX_PROBE_TIMEOUT_MS);
}

function resolveProbeTimeoutMs(options = {}) {
  if (Number.isFinite(options.timeoutMs) && options.timeoutMs > 0) {
    return clampProbeTimeoutMs(options.timeoutMs);
  }
  return clampProbeTimeoutMs(parsePositiveInteger(
    (options.env ?? process.env).SPECKIT_PROBE_TIMEOUT_MS,
    DEFAULT_PROBE_TIMEOUT_MS,
  ));
}

function repoRoot() {
  return path.resolve(__dirname, '..', '..', '..');
}

function defaultDbDirForService(serviceName) {
  const root = repoRoot();
  if (serviceName === 'mk-spec-memory') {
    return path.join(root, '.opencode', 'skills', 'system-spec-kit', 'mcp_server', 'database');
  }
  if (serviceName === 'mk-code-index') {
    return process.env.SPECKIT_CODE_GRAPH_DB_DIR
      ? path.resolve(process.env.SPECKIT_CODE_GRAPH_DB_DIR)
      : path.join(root, '.opencode', '.spec-kit', 'code-graph', 'database');
  }
  if (serviceName === 'mk-skill-advisor') {
    const advisorOverride = process.env.MK_SKILL_ADVISOR_DB_DIR ?? process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
    return advisorOverride
      ? path.resolve(advisorOverride)
      : path.join(root, '.opencode', 'skills', 'system-skill-advisor', 'mcp_server', 'database');
  }
  throw new Error(`Unknown MCP service name: ${serviceName}`);
}

function getIpcSocketPath(serviceName, options = {}) {
  if (process.env.SPECKIT_IPC_SOCKET_DIR?.startsWith('tcp://')) {
    return process.env.SPECKIT_IPC_SOCKET_DIR;
  }
  const socketDir = process.env.SPECKIT_IPC_SOCKET_DIR
    ? path.resolve(process.env.SPECKIT_IPC_SOCKET_DIR)
    : path.resolve(options.dbDir ?? defaultDbDirForService(serviceName));
  return path.join(socketDir, SOCKET_FILE_NAME);
}

function toConnectionOptions(socketPath) {
  if (!socketPath.startsWith('tcp://')) {
    return socketPath;
  }
  const url = new URL(socketPath);
  return {
    host: url.hostname,
    port: Number.parseInt(url.port, 10),
  };
}

function bridgeStdioToSocket(socketPath, options = {}) {
  const input = options.stdin ?? process.stdin;
  const output = options.stdout ?? process.stdout;
  const exit = options.exit ?? ((code) => process.exit(code));
  const socket = net.createConnection(toConnectionOptions(socketPath));
  let closed = false;

  const closeOnce = (code = 0) => {
    if (closed) return;
    closed = true;
    input.unpipe(socket);
    socket.unpipe(output);
    socket.destroy();
    exit(code);
  };

  socket.once('connect', () => {
    options.onConnect?.(socket);
    input.pipe(socket);
    socket.pipe(output);
  });

  socket.once('error', (error) => {
    options.onError?.(error);
    closeOnce(0);
  });

  socket.once('close', () => {
    closeOnce(0);
  });

  input.once('end', () => {
    socket.end();
  });
  input.once('close', () => {
    closeOnce(0);
  });
  output.once('error', () => {
    closeOnce(0);
  });

  return socket;
}

function probeDaemon(socketPath, options = {}) {
  const timeoutMs = resolveProbeTimeoutMs(options);
  const connect = options.connect ?? ((connectionOptions) => net.createConnection(connectionOptions));
  // deepProbe=true REQUIRES a JSON-RPC initialize reply to call the daemon alive (detects a hung daemon
  // that accepts the connection but never responds). Without it, a bare socket 'connect' counts as alive
  // (connect-ok) — only safe for callers that genuinely need connection-liveness, NOT for the reap/bridge
  // decision (which always passes deepProbe:true). See maybeBridgeLeaseHolder.
  const deepProbe = options.deepProbe === true;
  const id = nextProbeId++;
  const request = `${JSON.stringify({
    jsonrpc: '2.0',
    id,
    method: 'initialize',
    params: {
      protocolVersion: JSON_RPC_PROTOCOL_VERSION,
      capabilities: {},
      clientInfo: { name: 'liveness-probe', version: '0' },
    },
  })}\n`;

  return new Promise((resolve) => {
    let socket;
    let settled = false;
    let buffer = '';
    let timer;
    // Hold a multibyte char split across chunk boundaries until complete, so a probe reply
    // carrying CJK/emoji (e.g. serverInfo strings) is not corrupted to U+FFFD mid-parse.
    const decoder = new StringDecoder('utf8');

    const finish = (status, reason) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      if (socket) socket.destroy();
      resolve({ status, reason });
    };

    try {
      socket = connect(toConnectionOptions(socketPath));
    } catch (error) {
      finish('dead', error instanceof Error ? error.message : 'connect-threw');
      return;
    }

    timer = setTimeout(() => finish('dead', 'timeout'), timeoutMs);
    timer.unref?.();

    socket.once('connect', () => {
      if (!deepProbe) {
        finish('alive', 'connect-ok');
        return;
      }
      socket.write(request);
    });
    socket.on('data', (chunk) => {
      buffer += Buffer.isBuffer(chunk) ? decoder.write(chunk) : String(chunk ?? '');
      let newlineIndex = buffer.indexOf('\n');
      while (newlineIndex !== -1) {
        const line = buffer.slice(0, newlineIndex).trim();
        buffer = buffer.slice(newlineIndex + 1);
        newlineIndex = buffer.indexOf('\n');
        if (!line) continue;
        try {
          const parsed = JSON.parse(line);
          if (
            parsed &&
            parsed.jsonrpc === '2.0' &&
            parsed.id === id &&
            (Object.prototype.hasOwnProperty.call(parsed, 'result') ||
              Object.prototype.hasOwnProperty.call(parsed, 'error'))
          ) {
            finish('alive', 'json-rpc-reply');
            return;
          }
        } catch {
          // Ignore malformed or unrelated frames; the bounded probe decides liveness.
        }
      }
    });
    socket.once('error', (error) => {
      finish('dead', error instanceof Error ? error.message : 'socket-error');
    });
    socket.once('close', () => {
      finish('dead', 'closed-before-reply');
    });
  });
}

function parseHttpJsonResponse(buffer) {
  const raw = buffer.toString('utf8');
  const headerEnd = raw.indexOf('\r\n\r\n');
  if (headerEnd === -1) return null;
  const statusLine = raw.slice(0, raw.indexOf('\r\n'));
  const statusMatch = statusLine.match(/^HTTP\/\d(?:\.\d)?\s+(\d+)/);
  if (!statusMatch) return null;
  const statusCode = Number.parseInt(statusMatch[1], 10);
  const bodyRaw = raw.slice(headerEnd + 4).trim();
  let body = null;
  try {
    body = bodyRaw ? JSON.parse(bodyRaw) : null;
  } catch {
    return { statusCode, body: null };
  }
  return { statusCode, body };
}

function probeModelServer(socketPath, options = {}) {
  const timeoutMs = resolveProbeTimeoutMs(options);
  const loadingMaxMs = Number.isFinite(options.loadingMaxMs) && options.loadingMaxMs > 0
    ? options.loadingMaxMs
    : parsePositiveInteger(
      (options.env ?? process.env).SPECKIT_HF_MODEL_SERVER_LOADING_MAX_MS,
      DEFAULT_MODEL_SERVER_LOADING_MAX_MS,
    );
  const nowMs = typeof options.nowMs === 'function' ? options.nowMs : () => Date.now();
  const connect = options.connect ?? ((connectionOptions) => net.createConnection(connectionOptions));
  const request = `GET ${MODEL_SERVER_HEALTH_PATH} HTTP/1.1\r\nHost: localhost\r\nAccept: application/json\r\nConnection: close\r\n\r\n`;

  return new Promise((resolve) => {
    let socket;
    let settled = false;
    let chunks = [];
    let timer;

    // Carry the parsed health body so callers (the idle-eviction tick) can read
    // lastSuccessfulEmbedAt / inFlight. The 'alive' branches below pass parsed.body as the 3rd arg.
    const finish = (status, reason, health) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      if (socket) socket.destroy();
      resolve({ status, reason, health });
    };

    try {
      socket = connect(toConnectionOptions(socketPath));
    } catch (error) {
      finish('dead', error instanceof Error ? error.message : 'connect-threw');
      return;
    }

    timer = setTimeout(() => finish('dead', 'timeout'), timeoutMs);
    timer.unref?.();

    socket.once('connect', () => {
      socket.write(request);
    });
    socket.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk ?? '')));
    });
    socket.once('end', () => {
      const parsed = parseHttpJsonResponse(Buffer.concat(chunks));
      const state = parsed && parsed.body && typeof parsed.body === 'object'
        ? parsed.body.state
        : null;
      if (parsed && parsed.statusCode >= 200 && parsed.statusCode < 300 && state === 'ready') {
        finish('alive', `health-${state}`, parsed.body);
        return;
      }
      if (parsed && parsed.statusCode >= 200 && parsed.statusCode < 300 && state === 'loading') {
        const loadStartedAt = parsed.body.loadStartedAt;
        const loadProgressAt = parsed.body.loadProgressAt;
        // The loading budget is per model-load attempt; device fallback re-stamps loadProgressAt.
        const loadingMarker = Number.isFinite(loadProgressAt) && loadProgressAt > 0
          ? loadProgressAt
          : loadStartedAt;
        if (Number.isFinite(loadingMarker) && loadingMarker > 0 && nowMs() - loadingMarker > loadingMaxMs) {
          finish('dead', 'loading-wedged');
          return;
        }
        finish('alive', 'health-loading', parsed.body);
        return;
      }
      finish('dead', state === 'error' ? 'health-error' : 'health-not-ready');
    });
    socket.once('error', (error) => {
      finish('dead', error instanceof Error ? error.message : 'socket-error');
    });
    socket.once('close', () => {
      if (!settled && chunks.length === 0) finish('dead', 'closed-before-reply');
    });
  });
}

async function maybeBridgeLeaseHolder(options) {
  const {
    serviceName,
    leaseResult,
    loggerPrefix,
    dbDir,
    legacyReport,
    probeTimeoutMs,
    connect,
    bridge,
  } = options;
  const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
  const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
  const ownerPid = leaseResult.ownerPid;
  const writeLeaseHeld = (suffix = '') => {
    process.stdout.write(`LEASE_HELD_BY:${ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
  };

  if (process.env.SPECKIT_LAUNCHER_BRIDGE_DISABLED === '1') {
    if (legacyReport) {
      legacyReport(leaseResult);
      return { action: 'report', reason: 'bridge-disabled' };
    }
    writeLeaseHeld();
    return { action: 'report', reason: 'bridge-disabled' };
  }

  const socketPath = getIpcSocketPath(serviceName, { dbDir });
  if (!socketPath.startsWith('tcp://') && !fs.existsSync(socketPath)) {
    writeLeaseHeld(' (no-bridge-socket)');
    return { action: 'report', reason: 'no-bridge-socket', socketPath };
  }

  // deepProbe: REQUIRE a JSON-RPC reply, not just a socket accept. The reap/bridge decision must
  // detect a HUNG daemon (event loop wedged / deadlocked — it still accepts the UDS connection but
  // never services requests). A connect-ok-only probe would bridge a client to the wedged daemon and
  // hang it forever, never respawning. The raised probe timeout (default 5000ms, < the 7000ms launcher
  // grace) already prevents false-reaping a busy-but-responsive daemon mid-FTS-merge, so deep probing
  // does not regress that.
  const probe = await probeDaemon(socketPath, { timeoutMs: probeTimeoutMs, connect, deepProbe: true });
  if (probe.status !== 'alive') {
    process.stderr.write(`[${loggerPrefix}] lease holder pid=${ownerPid} socket=${socketPath} failed liveness probe: ${probe.reason}\n`);
    return { action: 'respawn', reason: probe.reason, socketPath };
  }

  process.stderr.write(`[${loggerPrefix}] bridging to lease holder pid=${ownerPid} socket=${socketPath}\n`);
  const bridgeToSocket = bridge ?? bridgeStdioToSocket;
  // Await so an injected reconnecting bridge (whose start() resolves after the first
  // attach) is fully wired before returning. The raw bridge returns a socket, not a
  // promise, so Promise.resolve keeps the original fire-and-forget timing for it.
  await Promise.resolve(bridgeToSocket(socketPath, {
    onError: () => {
      writeLeaseHeld(' (bridge-refused)');
    },
  }));
  return { action: 'bridge', socketPath };
}

module.exports = {
  DEFAULT_MODEL_SERVER_LOADING_MAX_MS,
  bridgeStdioToSocket,
  getIpcSocketPath,
  maybeBridgeLeaseHolder,
  probeDaemon,
  probeModelServer,
  toConnectionOptions,
};
