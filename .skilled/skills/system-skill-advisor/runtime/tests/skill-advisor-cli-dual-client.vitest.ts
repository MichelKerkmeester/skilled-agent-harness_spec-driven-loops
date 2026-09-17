// Concurrent CLI shim calls against one resident daemon over the advisor's own
// wire dialect. Both clients must complete independently and the daemon must see
// one tool call per client.

import { mkdirSync } from 'node:fs';
import net from 'node:net';
import { StringDecoder } from 'node:string_decoder';

import { afterEach, describe, expect, it } from 'vitest';

import {
  cleanupSkillAdvisorScope,
  createIsolatedCliScope,
  parseJsonOutput,
  runSkillAdvisorShimAsync,
  type IsolatedCliScope,
} from './skill-advisor-cli-test-utils.js';

interface FakeDaemon {
  readonly server: net.Server;
  readonly identity: string;
  readonly calls: Array<Record<string, unknown>>;
}

interface RpcResponse {
  readonly id?: unknown;
  readonly result?: unknown;
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
  const server = net.createServer((socket) => {
    sockets.push(socket);
    socket.once('close', () => {
      const index = sockets.indexOf(socket);
      if (index !== -1) sockets.splice(index, 1);
    });
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
              advisorProtocol: '1',
              generation: 3,
              trustState: 'live',
            },
          })}\n`);
          continue;
        }
        if (request.method === 'advisor.call') {
          const params = request.params as { readonly command?: unknown } | undefined;
          socket.write(`${JSON.stringify({
            jsonrpc: '2.0',
            id: request.id,
            result: toolPayload(params?.command, identity),
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
  return { server, identity, calls };
}

function runRecommend(prompt: string, scope: IsolatedCliScope) {
  return runSkillAdvisorShimAsync([
    'advisor_recommend',
    '--json',
    JSON.stringify({ prompt, options: { topK: 1 } }),
    '--format',
    'json',
    '--timeout-ms',
    '1000',
  ], scope.env, { timeoutMs: 5000 });
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

describe('skill-advisor CLI concurrent daemon coverage', () => {
  it('serves two concurrent CLI shim calls from one resident daemon', async () => {
    const scope = createIsolatedCliScope('concurrent-clients');
    scopes.push(scope);
    const daemon = await startFakeAdvisorDaemon(scope.socketPath);

    const [firstRun, secondRun] = await Promise.all([
      runRecommend('Use sk-code to implement the CLI bridge test.', scope),
      runRecommend('Use sk-code to review the concurrent daemon path.', scope),
    ]);
    const firstPayload = parseJsonOutput<CliPayload>(firstRun);
    const secondPayload = parseJsonOutput<CliPayload>(secondRun);

    expect(firstRun.exitCode, firstRun.stderr).toBe(0);
    expect(secondRun.exitCode, secondRun.stderr).toBe(0);
    for (const payload of [firstPayload, secondPayload]) {
      expect(payload.status).toBe('ok');
      expect(payload.data?.identity).toBe(daemon.identity);
      expect(payload.data?.recommendations?.[0]?.skillId).toBe('sk-code');
    }
    expect(daemon.calls.filter((call) => call.method === 'advisor.call')).toHaveLength(2);
  });
});
