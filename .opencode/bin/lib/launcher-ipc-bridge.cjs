'use strict';

const fs = require('fs');
const net = require('net');
const path = require('path');

const SOCKET_FILE_NAME = 'daemon-ipc.sock';

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

function maybeBridgeLeaseHolder(options) {
  const {
    serviceName,
    leaseResult,
    loggerPrefix,
    dbDir,
    legacyReport,
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
      return true;
    }
    writeLeaseHeld();
    return true;
  }

  const socketPath = getIpcSocketPath(serviceName, { dbDir });
  if (!socketPath.startsWith('tcp://') && !fs.existsSync(socketPath)) {
    writeLeaseHeld(' (no-bridge-socket)');
    return true;
  }

  process.stderr.write(`[${loggerPrefix}] bridging to lease holder pid=${ownerPid} socket=${socketPath}\n`);
  bridgeStdioToSocket(socketPath, {
    onError: () => {
      writeLeaseHeld(' (bridge-refused)');
    },
  });
  return true;
}

module.exports = {
  bridgeStdioToSocket,
  getIpcSocketPath,
  maybeBridgeLeaseHolder,
};
