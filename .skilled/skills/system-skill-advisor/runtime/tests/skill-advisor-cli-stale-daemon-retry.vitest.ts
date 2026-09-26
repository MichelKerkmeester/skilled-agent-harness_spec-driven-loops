// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor CLI Stale-Daemon Retry Tests
// ───────────────────────────────────────────────────────────────

import { mkdirSync } from 'node:fs';
import net from 'node:net';
import { StringDecoder } from 'node:string_decoder';

import { afterEach, describe, expect, it } from 'vitest';

import {
  cleanupSkillAdvisorScope,
  createIsolatedCliScope,
  parseJsonOutput,
  type IsolatedCliScope,
} from './skill-advisor-cli-test-utils.js';

import { runSkillAdvisorCli } from '../skill-advisor-cli.js';

interface FakeDaemon {
  readonly calls: Array<Record<string, unknown>>;
}

interface CliPayload {
  readonly status?: string;
  readonly data?: {
    readonly recommendations?: ReadonlyArray<{ readonly skillId?: string }>;
  };
  readonly error?: string;
  readonly exitCode?: number;
}

type FakeDaemonBehavior = 'reject-compiled-route-option' | 'reject-unrelated-option';

const scopes: IsolatedCliScope[] = [];
const servers: net.Server[] = [];
const sockets: net.Socket[] = [];

async function startFakeAdvisorDaemon(socketPath: string, behavior: FakeDaemonBehavior): Promise<FakeDaemon> {
  mkdirSync(socketPath.slice(0, socketPath.lastIndexOf('/')), { recursive: true, mode: 0o700 });
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
        if (!Object.prototype.hasOwnProperty.call(request, 'id')) continue;
        if (request.method === 'initialize') {
          socket.write(`${JSON.stringify({
            jsonrpc: '2.0',
            id: request.id,
            result: { advisorProtocol: '1' },
          })}\n`);
          continue;
        }
        if (request.method !== 'advisor.call') continue;

        const params = request.params as { readonly args?: Record<string, unknown> } | undefined;
        const args = params?.args ?? {};
        calls.push(args);
        const options = args.options;
        const hasCompiledRouteOption = typeof options === 'object'
          && options !== null
          && Object.prototype.hasOwnProperty.call(options, 'includeCompiledRoute');
        const errorMessage = behavior === 'reject-unrelated-option'
          ? 'Unrecognized key in options: unsupportedOption'
          : hasCompiledRouteOption
            ? 'Unrecognized key in options: includeCompiledRoute'
            : null;

        const response: Record<string, unknown> = errorMessage
          ? {
            jsonrpc: '2.0',
            id: request.id,
            error: { code: -32602, message: errorMessage },
          }
          : {
            jsonrpc: '2.0',
            id: request.id,
            result: {
              status: 'ok',
              data: {
                recommendations: [{ skillId: 'sk-code', confidence: 0.91, uncertainty: 0.12 }],
                freshness: 'live',
              },
            },
          };
        socket.write(`${JSON.stringify(response)}\n`);
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
  return { calls };
}

async function runRecommend(scope: IsolatedCliScope) {
  const originalEnv = { ...process.env };
  const stdout: string[] = [];
  const stderr: string[] = [];
  for (const key of Object.keys(process.env)) delete process.env[key];
  Object.assign(process.env, scope.env);
  let exitCode: number;
  try {
    exitCode = await runSkillAdvisorCli([
      'advisor_recommend',
      '--json',
      JSON.stringify({ prompt: 'Recommend a skill.', options: { includeCompiledRoute: false } }),
      '--format',
      'json',
      '--timeout-ms',
      '1000',
    ], {
      stdout: { write: (value: string) => { stdout.push(value); return true; } },
      stderr: { write: (value: string) => { stderr.push(value); return true; } },
    });
  } finally {
    for (const key of Object.keys(process.env)) delete process.env[key];
    Object.assign(process.env, originalEnv);
  }
  return { exitCode, stdout: stdout.join(''), stderr: stderr.join('') };
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

describe('skill-advisor CLI stale-daemon retry', () => {
  it('retries once without includeCompiledRoute when a stale daemon rejects that option', async () => {
    const scope = createIsolatedCliScope('stale-daemon-retry');
    scopes.push(scope);
    const daemon = await startFakeAdvisorDaemon(scope.socketPath, 'reject-compiled-route-option');

    const run = await runRecommend(scope);
    const payload = parseJsonOutput<CliPayload>(run);

    expect(run.exitCode, run.stderr).toBe(0);
    expect(payload.status).toBe('ok');
    expect(payload.data?.recommendations?.[0]?.skillId).toBe('sk-code');
    expect(daemon.calls).toHaveLength(2);
    expect((daemon.calls[0]?.options as Record<string, unknown>)?.includeCompiledRoute).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(daemon.calls[1]?.options ?? {}, 'includeCompiledRoute')).toBe(false);
  });

  it('does not retry unrelated invalid-parameter errors', async () => {
    const scope = createIsolatedCliScope('unrelated-invalid-parameter');
    scopes.push(scope);
    const daemon = await startFakeAdvisorDaemon(scope.socketPath, 'reject-unrelated-option');

    const run = await runRecommend(scope);
    const payload = parseJsonOutput<CliPayload>(run);

    expect(run.exitCode, run.stderr).toBe(64);
    expect(payload.status).toBe('error');
    expect(payload.exitCode).toBe(64);
    expect(payload.error).toContain('unsupportedOption');
    expect(daemon.calls).toHaveLength(1);
  });
});
