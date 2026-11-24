// ───────────────────────────────────────────────────────────────────
// MODULE: CLI Socket Ownership Tests
// ───────────────────────────────────────────────────────────────────

import { chmodSync, mkdirSync, symlinkSync } from 'node:fs';
import net from 'node:net';
import { dirname, join } from 'node:path';
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
  readonly connectionCount: number;
}

interface RecommendPayload {
  readonly status?: string;
  readonly degraded?: boolean;
  readonly source?: string;
}

const scopes: IsolatedCliScope[] = [];
const servers: net.Server[] = [];
const sockets: net.Socket[] = [];

function makeScope(label: string): IsolatedCliScope {
  const scope = createIsolatedCliScope(label);
  scopes.push(scope);
  return scope;
}

function toolPayload(command: unknown): Record<string, unknown> {
  if (command === 'advisor_recommend') {
    return {
      status: 'ok',
      data: {
        recommendations: [{ skillId: 'sk-code', confidence: 0.91, uncertainty: 0.12 }],
        freshness: 'live',
        trustState: { state: 'live', generation: 3 },
      },
    };
  }
  return {
    status: 'ok',
    data: {
      freshness: 'live',
      generation: 3,
      trustState: { state: 'live', generation: 3 },
    },
  };
}

async function startFakeAdvisorDaemon(socketPath: string): Promise<FakeDaemon> {
  mkdirSync(dirname(socketPath), { recursive: true, mode: 0o700 });
  let connectionCount = 0;
  const server = net.createServer((socket) => {
    connectionCount += 1;
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
        if (!Object.prototype.hasOwnProperty.call(request, 'id')) continue;
        if (request.method === 'initialize') {
          socket.write(`${JSON.stringify({
            jsonrpc: '2.0',
            id: request.id,
            result: { advisorProtocol: '1', generation: 3, trustState: 'live' },
          })}\n`);
          continue;
        }
        if (request.method === 'advisor.call') {
          const params = request.params as { readonly command?: unknown } | undefined;
          socket.write(`${JSON.stringify({
            jsonrpc: '2.0',
            id: request.id,
            result: toolPayload(params?.command),
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
  return {
    server,
    get connectionCount() {
      return connectionCount;
    },
  };
}

function runRecommend(scope: IsolatedCliScope) {
  return runSkillAdvisorShimAsync([
    'advisor_recommend',
    '--json',
    JSON.stringify({ prompt: 'Use sk-code to verify this isolated CLI request.', options: { topK: 1 } }),
    '--format',
    'json',
    '--timeout-ms',
    '5000',
  ], scope.env, { timeoutMs: 30_000 });
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

describe('skill-advisor CLI socket ownership checks', () => {
  it('refuses a group-writable socket directory without connecting', async () => {
    const scope = makeScope('group-writable-socket');
    const daemon = await startFakeAdvisorDaemon(scope.socketPath);
    chmodSync(scope.socketDir, 0o770);

    const run = await runRecommend(scope);
    expect(daemon.connectionCount).toBe(0);
    expect([0, 75]).toContain(run.exitCode);
    if (run.exitCode === 0) {
      expect(parseJsonOutput<RecommendPayload>(run)).toMatchObject({
        status: 'ok',
        degraded: true,
        source: 'local-scorer',
      });
    } else {
      expect(`${run.stdout}\n${run.stderr}`).toContain('socket not trusted');
    }
  });

  it('refuses a symlinked socket directory before connecting', async () => {
    const scope = makeScope('symlinked-socket');
    const realSocketDir = join(scope.rootDir, 'real-ipc');
    const linkedSocketDir = join(scope.rootDir, 'ipc-link');
    mkdirSync(realSocketDir, { recursive: true, mode: 0o700 });
    symlinkSync(realSocketDir, linkedSocketDir, 'dir');
    scope.env.SPECKIT_IPC_SOCKET_DIR = linkedSocketDir;
    const daemon = await startFakeAdvisorDaemon(join(linkedSocketDir, 'daemon-ipc.sock'));

    const run = await runRecommend(scope);
    expect(daemon.connectionCount).toBe(0);
    expect([0, 75]).toContain(run.exitCode);
    if (run.exitCode === 0) {
      expect(parseJsonOutput<RecommendPayload>(run)).toMatchObject({
        status: 'ok',
        degraded: true,
        source: 'local-scorer',
      });
    } else {
      expect(`${run.stdout}\n${run.stderr}`).toContain('socket not trusted');
    }
  });

  it('returns the retryable exit for a non-recommend tool on a refused socket', async () => {
    const scope = makeScope('refused-status-socket');
    const daemon = await startFakeAdvisorDaemon(scope.socketPath);
    chmodSync(scope.socketDir, 0o770);

    const run = await runSkillAdvisorShimAsync([
      'advisor_status',
      '--workspace-root',
      repoRoot,
      '--format',
      'json',
      '--timeout-ms',
      '5000',
    ], scope.env, { timeoutMs: 30_000 });

    expect(run.exitCode).toBe(75);
    expect(`${run.stdout}\n${run.stderr}`).toContain('socket not trusted');
    expect(daemon.connectionCount).toBe(0);
  });
});
