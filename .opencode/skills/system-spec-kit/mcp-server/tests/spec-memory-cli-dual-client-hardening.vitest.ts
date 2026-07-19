// -----------------------------------------------------------------------------
// MODULE: Spec Memory CLI Dual Client Hardening Tests
// -----------------------------------------------------------------------------

import { mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import net from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { StringDecoder } from 'node:string_decoder';

import { afterAll, afterEach, describe, expect, it } from 'vitest';

import { runSpecMemoryCli } from '../spec-memory-cli.js';

interface CapturedIo {
  readonly stdout: { write: (chunk: string) => boolean };
  readonly stderr: { write: (chunk: string) => boolean };
  readonly output: () => { readonly stdout: string; readonly stderr: string };
}

interface RuntimeScope {
  readonly rootDir: string;
  readonly socketDir: string;
  readonly socketPath: string;
  readonly memoryDbPath: string;
}

interface RpcResponse {
  readonly jsonrpc?: string;
  readonly id?: unknown;
  readonly result?: unknown;
  readonly error?: unknown;
}

interface FakeDaemon {
  readonly server: net.Server;
  readonly identity: string;
  readonly calls: Array<Record<string, unknown>>;
  readonly connectionIdentities: string[];
}

const tempDirs: string[] = [];
const servers: net.Server[] = [];
const originalEnv = new Map<string, string | undefined>();
for (const key of ['SPECKIT_IPC_SOCKET_DIR', 'SPECKIT_DAEMON_REELECTION', 'MEMORY_DB_PATH']) {
  originalEnv.set(key, process.env[key]);
}

function captureIo(): CapturedIo {
  let stdout = '';
  let stderr = '';
  return {
    stdout: {
      write(chunk: string): boolean {
        stdout += chunk;
        return true;
      },
    },
    stderr: {
      write(chunk: string): boolean {
        stderr += chunk;
        return true;
      },
    },
    output: () => ({ stdout, stderr }),
  };
}

function restoreEnv(): void {
  for (const [key, value] of originalEnv) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

function createRuntimeScope(): RuntimeScope {
  const rootDir = mkdtempSync(join(tmpdir(), 'spec-memory-dual-client-'));
  const socketDir = join(rootDir, 'ipc');
  const socketPath = join(socketDir, 'daemon-ipc.sock');
  mkdirSync(socketDir, { recursive: true, mode: 0o700 });
  tempDirs.push(rootDir);
  process.env.SPECKIT_IPC_SOCKET_DIR = socketDir;
  process.env.SPECKIT_DAEMON_REELECTION = 'on';
  process.env.MEMORY_DB_PATH = join(rootDir, 'memory.sqlite');
  return { rootDir, socketDir, socketPath, memoryDbPath: process.env.MEMORY_DB_PATH };
}

async function startFakeDaemon(socketPath: string): Promise<FakeDaemon> {
  const identity = `daemon-${process.pid}-${Date.now()}`;
  const calls: Array<Record<string, unknown>> = [];
  const connectionIdentities: string[] = [];
  const server = net.createServer((socket) => {
    connectionIdentities.push(identity);
    let buffer = '';
    const decoder = new StringDecoder('utf8');
    socket.on('data', (chunk) => {
      buffer += Buffer.isBuffer(chunk) ? decoder.write(chunk) : String(chunk ?? '');
      let newlineIndex = buffer.indexOf('\n');
      while (newlineIndex !== -1) {
        const line = buffer.slice(0, newlineIndex).trim();
        buffer = buffer.slice(newlineIndex + 1);
        newlineIndex = buffer.indexOf('\n');
        if (!line) continue;
        const request = JSON.parse(line) as Record<string, unknown>;
        calls.push(request);
        if (!Object.prototype.hasOwnProperty.call(request, 'id')) continue;
        if (request.method === 'initialize') {
          socket.write(`${JSON.stringify({
            jsonrpc: '2.0',
            id: request.id,
            result: {
              protocolVersion: '2025-06-18',
              capabilities: {},
              serverInfo: { name: 'fake-mk-spec-memory', version: identity },
            },
          })}\n`);
          continue;
        }
        if (request.method === 'tools/call') {
          socket.write(`${JSON.stringify({
            jsonrpc: '2.0',
            id: request.id,
            result: {
              content: [{ type: 'text', text: JSON.stringify({ status: 'ok', identity }) }],
            },
          })}\n`);
        }
      }
    });
  });

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(socketPath, () => {
      server.off('error', reject);
      resolve();
    });
  });
  servers.push(server);
  return { server, identity, calls, connectionIdentities };
}

async function readRpcResponse(socket: net.Socket, id: number): Promise<RpcResponse> {
  return await new Promise<RpcResponse>((resolve, reject) => {
    let buffer = '';
    const decoder = new StringDecoder('utf8');
    const timer = setTimeout(() => reject(new Error(`timed out waiting for ${id}`)), 1000);
    const onData = (chunk: Buffer | string): void => {
      buffer += Buffer.isBuffer(chunk) ? decoder.write(chunk) : String(chunk ?? '');
      let newlineIndex = buffer.indexOf('\n');
      while (newlineIndex !== -1) {
        const line = buffer.slice(0, newlineIndex).trim();
        buffer = buffer.slice(newlineIndex + 1);
        newlineIndex = buffer.indexOf('\n');
        if (!line) continue;
        const parsed = JSON.parse(line) as RpcResponse;
        if (parsed.id !== id) continue;
        clearTimeout(timer);
        socket.off('data', onData);
        resolve(parsed);
        return;
      }
    };
    socket.on('data', onData);
    socket.once('error', reject);
  });
}

async function mcpToolCall(socketPath: string): Promise<{ readonly identity: string; readonly serverVersion: string }> {
  const socket = net.createConnection(socketPath);
  await new Promise<void>((resolve, reject) => {
    socket.once('connect', resolve);
    socket.once('error', reject);
  });
  try {
    socket.write(`${JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'mcp-test-client', version: '0.0.0' } },
    })}\n`);
    const initialize = await readRpcResponse(socket, 1) as { readonly result?: { readonly serverInfo?: { readonly version?: string } } };
    socket.write(`${JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} })}\n`);
    socket.write(`${JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'memory_stats', arguments: {} } })}\n`);
    const tool = await readRpcResponse(socket, 2) as { readonly result?: { readonly content?: Array<{ readonly text?: string }> } };
    const text = tool.result?.content?.[0]?.text ?? '{}';
    const payload = JSON.parse(text) as { readonly identity?: string };
    return { identity: payload.identity ?? '', serverVersion: initialize.result?.serverInfo?.version ?? '' };
  } finally {
    socket.end();
    socket.destroy();
  }
}

async function closeTrackedServers(): Promise<void> {
  while (servers.length > 0) {
    const server = servers.pop();
    if (!server) continue;
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

async function cleanup(): Promise<void> {
  await closeTrackedServers();
  restoreEnv();
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
}

afterEach(async () => {
  await cleanup();
});

afterAll(async () => {
  await cleanup();
});

describe('spec-memory CLI dual client hardening', () => {
  it('serves MCP and CLI clients from one IPC server without changing daemon identity', async () => {
    const scope = createRuntimeScope();
    const daemon = await startFakeDaemon(scope.socketPath);
    const io = captureIo();

    const [mcpResult, cliExitCode] = await Promise.all([
      mcpToolCall(scope.socketPath),
      runSpecMemoryCli(['memory_stats', '--format', 'json', '--timeout-ms', '1000'], io),
    ]);
    const cliPayload = JSON.parse(io.output().stdout) as { readonly status?: string; readonly identity?: string };

    expect(cliExitCode).toBe(0);
    expect(cliPayload.status).toBe('ok');
    expect(cliPayload.identity).toBe(daemon.identity);
    expect(mcpResult.identity).toBe(daemon.identity);
    expect(mcpResult.serverVersion).toBe(daemon.identity);
    expect(new Set(daemon.connectionIdentities)).toEqual(new Set([daemon.identity]));
    expect(daemon.calls.filter((call) => call.method === 'tools/call')).toHaveLength(2);
  });
});
