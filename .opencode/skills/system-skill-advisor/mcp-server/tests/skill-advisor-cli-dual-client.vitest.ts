import { mkdirSync } from 'node:fs';
import net from 'node:net';
import { StringDecoder } from 'node:string_decoder';

import { afterEach, describe, expect, it } from 'vitest';

import {
  cleanupSkillAdvisorScope,
  createIsolatedCliScope,
  parseJsonOutput,
  repoRoot,
  runSkillAdvisorShimAsync,
  type IsolatedCliScope,
} from './skill-advisor-cli-test-utils.js';

interface FakeDaemon {
  readonly server: net.Server;
  readonly identity: string;
  readonly calls: Array<Record<string, unknown>>;
  readonly connectionIdentities: string[];
}

interface RpcResponse {
  readonly jsonrpc?: string;
  readonly id?: unknown;
  readonly result?: {
    readonly serverInfo?: { readonly version?: string };
    readonly content?: Array<{ readonly text?: string }>;
  };
  readonly error?: unknown;
}

interface CliPayload {
  readonly status?: string;
  readonly data?: {
    readonly identity?: string;
    readonly recommendations?: ReadonlyArray<{ readonly skillId?: string }>;
  };
}

const scopes: IsolatedCliScope[] = [];
const servers: net.Server[] = [];
const sockets: net.Socket[] = [];

function trustState(generation: number) {
  return {
    state: 'live',
    reason: null,
    generation,
    checkedAt: '2026-06-09T00:00:00.000Z',
    lastLiveAt: '2026-06-09T00:00:00.000Z',
  };
}

function toolPayload(name: unknown, identity: string): Record<string, unknown> {
  if (name === 'advisor_recommend') {
    return {
      status: 'ok',
      data: {
        identity,
        recommendations: [{ skillId: 'sk-code', confidence: 0.91, uncertainty: 0.12 }],
        freshness: 'live',
        trustState: trustState(3),
      },
    };
  }
  return {
    status: 'ok',
    data: {
      identity,
      freshness: 'live',
      generation: 3,
      trustState: trustState(3),
    },
  };
}

async function startFakeAdvisorDaemon(socketPath: string): Promise<FakeDaemon> {
  mkdirSync(socketPath.slice(0, socketPath.lastIndexOf('/')), { recursive: true, mode: 0o700 });
  const identity = `fake-skill-advisor-${process.pid}-${Date.now()}`;
  const calls: Array<Record<string, unknown>> = [];
  const connectionIdentities: string[] = [];
  const server = net.createServer((socket) => {
    sockets.push(socket);
    socket.once('close', () => {
      const index = sockets.indexOf(socket);
      if (index !== -1) sockets.splice(index, 1);
    });
    connectionIdentities.push(identity);
    const decoder = new StringDecoder('utf8');
    let buffer = '';
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
              serverInfo: { name: 'fake-mk-skill-advisor', version: identity },
            },
          })}\n`);
          continue;
        }
        if (request.method === 'tools/call') {
          const params = request.params as { readonly name?: unknown } | undefined;
          socket.write(`${JSON.stringify({
            jsonrpc: '2.0',
            id: request.id,
            result: {
              content: [{ type: 'text', text: JSON.stringify(toolPayload(params?.name, identity)) }],
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
    const decoder = new StringDecoder('utf8');
    let buffer = '';
    const timer = setTimeout(() => reject(new Error(`timed out waiting for rpc ${id}`)), 1000);
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

async function callMcpAdvisorStatus(socketPath: string): Promise<{ readonly identity: string; readonly serverVersion: string }> {
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
    const initialize = await readRpcResponse(socket, 1);
    socket.write(`${JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} })}\n`);
    socket.write(`${JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: { name: 'advisor_status', arguments: { workspaceRoot: repoRoot } },
    })}\n`);
    const tool = await readRpcResponse(socket, 2);
    const text = tool.result?.content?.[0]?.text ?? '{}';
    const payload = JSON.parse(text) as CliPayload;
    return {
      identity: payload.data?.identity ?? '',
      serverVersion: initialize.result?.serverInfo?.version ?? '',
    };
  } finally {
    socket.end();
    socket.destroy();
  }
}

async function cleanup(): Promise<void> {
  while (sockets.length > 0) {
    sockets.pop()?.destroy();
  }
  while (servers.length > 0) {
    const server = servers.pop();
    if (!server) continue;
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
  while (scopes.length > 0) {
    const scope = scopes.pop();
    if (scope) await cleanupSkillAdvisorScope(scope);
  }
}

afterEach(async () => {
  await cleanup();
});

describe('skill-advisor CLI dual-client daemon coverage', () => {
  it('serves an MCP client and the CLI shim from one resident daemon', async () => {
    const scope = createIsolatedCliScope('dual-client');
    scopes.push(scope);
    const daemon = await startFakeAdvisorDaemon(scope.socketPath);

    const [mcpResult, cliRun] = await Promise.all([
      callMcpAdvisorStatus(scope.socketPath),
      runSkillAdvisorShimAsync([
        'advisor_recommend',
        '--json',
        JSON.stringify({ prompt: 'Use sk-code to implement the CLI bridge test.', options: { topK: 1 } }),
        '--format',
        'json',
        '--timeout-ms',
        '1000',
      ], scope.env, { timeoutMs: 5000 }),
    ]);
    const cliPayload = parseJsonOutput<CliPayload>(cliRun);

    expect(cliRun.exitCode, cliRun.stderr).toBe(0);
    expect(cliPayload.status).toBe('ok');
    expect(cliPayload.data?.identity).toBe(daemon.identity);
    expect(cliPayload.data?.recommendations?.[0]?.skillId).toBe('sk-code');
    expect(mcpResult.identity).toBe(daemon.identity);
    expect(mcpResult.serverVersion).toBe(daemon.identity);
    expect(new Set(daemon.connectionIdentities)).toEqual(new Set([daemon.identity]));
    expect(daemon.calls.filter((call) => call.method === 'tools/call')).toHaveLength(2);
  });
});
