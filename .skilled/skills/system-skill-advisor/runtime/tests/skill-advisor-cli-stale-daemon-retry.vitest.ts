// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor CLI Stale-Daemon Retry Tests
// ───────────────────────────────────────────────────────────────

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import net from 'node:net';
import { join } from 'node:path';
import { StringDecoder } from 'node:string_decoder';

import { afterEach, describe, expect, it } from 'vitest';

import {
  cleanupSkillAdvisorScope,
  createIsolatedCliScope,
  parseJsonOutput,
  readSkillAdvisorLauncherPid,
  type IsolatedCliScope,
} from './skill-advisor-cli-test-utils.js';

import { ADVISOR_DISABLED_FLAGS } from '../lib/advisor-disabled.js';
import { runSkillAdvisorCli } from '../skill-advisor-cli.js';

interface FakeDaemon {
  readonly calls: Array<Record<string, unknown>>;
}

interface CliPayload {
  readonly status?: string;
  readonly data?: {
    readonly recommendations?: ReadonlyArray<{ readonly skillId?: string }>;
    readonly abstainReasons?: ReadonlyArray<string>;
    readonly warnings?: ReadonlyArray<string>;
    readonly freshness?: string;
  };
  readonly error?: string;
  readonly exitCode?: number;
}

type FakeDaemonBehavior = 'answer' | 'reject-compiled-route-option' | 'reject-unrelated-option';

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
        const errorMessage = behavior === 'answer'
          ? null
          : behavior === 'reject-unrelated-option'
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

async function runRecommend(scope: IsolatedCliScope, env: NodeJS.ProcessEnv = scope.env) {
  const originalEnv = { ...process.env };
  const stdout: string[] = [];
  const stderr: string[] = [];
  for (const key of Object.keys(process.env)) delete process.env[key];
  Object.assign(process.env, env);
  let exitCode: number;
  try {
    exitCode = await runSkillAdvisorCli([
      'advisor_recommend',
      '--json',
      JSON.stringify({ prompt: 'Recommend a skill.', options: { includeCompiledRoute: false, compiledRouteTopOnly: true } }),
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

function switchEnv(scope: IsolatedCliScope, flag?: string): NodeJS.ProcessEnv {
  const env = { ...scope.env };
  for (const name of ADVISOR_DISABLED_FLAGS) delete env[name];
  if (flag) env[flag] = '1';
  return env;
}

function flagsFile(scope: IsolatedCliScope): string {
  const filePath = join(scope.rootDir, 'hook-flags.env');
  writeFileSync(filePath, 'SYSTEM_SKILL_ADVISOR_DISABLED=1\n');
  return filePath;
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
    // A daemon that old knows neither option, so the retry carries neither.
    expect(Object.prototype.hasOwnProperty.call(daemon.calls[1]?.options ?? {}, 'compiledRouteTopOnly')).toBe(false);
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

describe('skill-advisor CLI disable switch', () => {
  // The resolver copies an MK_ value onto its new name when it loads, so the
  // reason an MK_ name gets depends on load order. The loop leaves those out.
  it.each(ADVISOR_DISABLED_FLAGS.filter((flag) => !flag.startsWith('MK_')).map((flag) => [flag]))('abstains under %s before it asks a warm daemon', async (flag) => {
    const scope = createIsolatedCliScope('disable-switch-warm');
    scopes.push(scope);
    const daemon = await startFakeAdvisorDaemon(scope.socketPath, 'answer');

    const run = await runRecommend(scope, switchEnv(scope, flag));
    const payload = parseJsonOutput<CliPayload>(run);

    expect(run.exitCode, run.stderr).toBe(0);
    expect(payload.status).toBe('ok');
    expect(payload.data?.recommendations).toEqual([]);
    expect(payload.data?.abstainReasons).toEqual([`Skill advisor disabled by ${flag}.`]);
    expect(payload.data?.warnings).toEqual(['ADVISOR_DISABLED']);
    expect(payload.data?.freshness).toBe('unavailable');
    expect(daemon.calls).toHaveLength(0);
  });

  it('still asks a warm daemon when no switch is set', async () => {
    const scope = createIsolatedCliScope('disable-switch-control');
    scopes.push(scope);
    const daemon = await startFakeAdvisorDaemon(scope.socketPath, 'answer');

    const run = await runRecommend(scope, switchEnv(scope));
    const payload = parseJsonOutput<CliPayload>(run);

    expect(run.exitCode, run.stderr).toBe(0);
    expect(payload.data?.recommendations?.[0]?.skillId).toBe('sk-code');
    expect(daemon.calls).toHaveLength(1);
  });

  it('abstains with no daemon and starts no launcher', async () => {
    const scope = createIsolatedCliScope('disable-switch-no-daemon');
    scopes.push(scope);

    const run = await runRecommend(scope, switchEnv(scope, 'SYSTEM_SKILL_ADVISOR_HOOK_DISABLED'));
    const payload = parseJsonOutput<CliPayload>(run);

    expect(run.exitCode, run.stderr).toBe(0);
    expect(payload.data?.recommendations).toEqual([]);
    expect(payload.data?.abstainReasons).toEqual(['Skill advisor disabled by SYSTEM_SKILL_ADVISOR_HOOK_DISABLED.']);
    expect(readSkillAdvisorLauncherPid(scope.skillAdvisorDbDir)).toBeNull();
    expect(existsSync(scope.socketPath)).toBe(false);
  }, 30_000);
});

describe('skill-advisor CLI kill switch, as the hooks resolve it', () => {
  it.each([
    ['SYSTEM_SKILL_ADVISOR_DISABLED', '1'],
    ['SYSTEM_SKILL_ADVISOR_DISABLED', 'true'],
    ['SYSTEM_SKILL_ADVISOR_HOOK_DISABLED', 'yes'],
    ['SYSTEM_HOOKS_DISABLED', '1'],
  ])('abstains under %s=%s before it asks a warm daemon', async (name, value) => {
    const scope = createIsolatedCliScope('kill-switch-name');
    scopes.push(scope);
    const daemon = await startFakeAdvisorDaemon(scope.socketPath, 'answer');

    const run = await runRecommend(scope, { ...switchEnv(scope), [name]: value });
    const payload = parseJsonOutput<CliPayload>(run);

    expect(run.exitCode, run.stderr).toBe(0);
    expect(payload.status).toBe('ok');
    expect(payload.data?.recommendations).toEqual([]);
    expect(payload.data?.abstainReasons).toEqual([`Skill advisor disabled by ${name}.`]);
    expect(payload.data?.warnings).toEqual(['ADVISOR_DISABLED']);
    expect(daemon.calls).toHaveLength(0);
  });

  it('abstains under a flags-file entry before it asks a warm daemon', async () => {
    const scope = createIsolatedCliScope('kill-switch-flags-file');
    scopes.push(scope);
    const daemon = await startFakeAdvisorDaemon(scope.socketPath, 'answer');

    const run = await runRecommend(scope, { ...switchEnv(scope), HOOK_FLAGS_CONFIG: flagsFile(scope) });
    const payload = parseJsonOutput<CliPayload>(run);

    expect(run.exitCode, run.stderr).toBe(0);
    expect(payload.data?.recommendations).toEqual([]);
    expect(payload.data?.abstainReasons).toEqual(['Skill advisor disabled by SYSTEM_SKILL_ADVISOR_DISABLED.']);
    expect(daemon.calls).toHaveLength(0);
  });

  it('still asks a warm daemon when the environment sets the switch to 0 over the file', async () => {
    const scope = createIsolatedCliScope('kill-switch-file-override');
    scopes.push(scope);
    const daemon = await startFakeAdvisorDaemon(scope.socketPath, 'answer');

    const run = await runRecommend(scope, {
      ...switchEnv(scope),
      HOOK_FLAGS_CONFIG: flagsFile(scope),
      SYSTEM_SKILL_ADVISOR_DISABLED: '0',
    });
    const payload = parseJsonOutput<CliPayload>(run);

    expect(run.exitCode, run.stderr).toBe(0);
    expect(payload.data?.recommendations?.[0]?.skillId).toBe('sk-code');
    expect(daemon.calls).toHaveLength(1);
  });
});
