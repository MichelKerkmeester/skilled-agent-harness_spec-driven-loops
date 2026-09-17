// Effective-consumption invariants for compiled routing:
//   - the OpenCode plugin renders the served compiled outcome into the injected
//     system-context
//   - a =0 kill invalidates a previously-cached compiled brief

import { EventEmitter } from 'node:events';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockedChild = vi.hoisted(() => ({ spawn: vi.fn() }));
vi.mock('node:child_process', () => ({ spawn: mockedChild.spawn }));

import MkSkillAdvisorPlugin from '../../../../plugins/system-skill-advisor.js';

const FLAG = 'SPECKIT_COMPILED_ROUTING';

// ── Plugin render + cache invalidation (end-to-end via mocked advisor child) ─

function makeChild(stdout: string) {
  const child = new EventEmitter() as EventEmitter & {
    stdout: EventEmitter & { setEncoding: ReturnType<typeof vi.fn> };
    stderr: EventEmitter & { setEncoding: ReturnType<typeof vi.fn> };
    stdin: { end: ReturnType<typeof vi.fn> };
    kill: ReturnType<typeof vi.fn>;
  };
  child.stdout = new EventEmitter() as EventEmitter & { setEncoding: ReturnType<typeof vi.fn> };
  child.stderr = new EventEmitter() as EventEmitter & { setEncoding: ReturnType<typeof vi.fn> };
  child.stdout.setEncoding = vi.fn();
  child.stderr.setEncoding = vi.fn();
  child.stdin = { end: vi.fn() };
  child.kill = vi.fn(() => true);
  queueMicrotask(() => {
    child.stdout.emit('data', stdout);
    child.emit('close', 0);
  });
  return child;
}

function childStdout(compiledRoute?: Record<string, unknown>) {
  return JSON.stringify({
    status: 'ok',
    data: {
      freshness: 'live',
      recommendations: [{
        skillId: 'sk-code',
        confidence: 0.91,
        uncertainty: 0.23,
        ...(compiledRoute ? { compiledRoute } : {}),
      }],
    },
  });
}

function mockAdvisorChild(stdout: string) {
  mockedChild.spawn.mockImplementation(() => makeChild(stdout));
}

async function makePlugin(options: Record<string, unknown> = {}) {
  return await MkSkillAdvisorPlugin({ directory: process.cwd() } as never, {
    sourceSignatureOverride: 'fixed-signature',
    cacheTTLMs: 60_000,
    ...options,
  } as never);
}

async function runPrompt(hooks: Awaited<ReturnType<typeof makePlugin>>, prompt: string) {
  const output = { system: [] as string[] };
  await hooks['experimental.chat.system.transform']?.(
    { sessionID: 's-test', prompt } as never,
    output as never,
  );
  return output.system;
}

describe('plugin renders the served compiled outcome into system-context', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    delete process.env.SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED;
    delete process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED;
    const reset = await MkSkillAdvisorPlugin({ directory: process.cwd() } as never, {} as never);
    await reset.event?.({ event: { type: 'server.instance.disposed', properties: { directory: process.cwd() } } } as never);
  });
  afterEach(() => { delete process.env[FLAG]; });

  it('injects an additive compiled-routing line when a decision is served', async () => {
    mockAdvisorChild(childStdout({ action: 'route', hubId: 'sk-code', targets: ['quality'], servingAuthority: 'compiled', fingerprint: 'abc123', generation: 3 }));
    const system = await runPrompt(await makePlugin(), 'implement feature X');
    const compiledLine = system.find((line) => line.startsWith('Compiled routing'));
    expect(compiledLine).toBeTruthy();
    expect(compiledLine).toContain('outcome=route');
    expect(compiledLine).toContain('hub=sk-code');
  });

  it('injects no compiled line when no decision is served (byte-identical legacy brief)', async () => {
    mockAdvisorChild(childStdout());
    const system = await runPrompt(await makePlugin(), 'implement feature X');
    expect(system.some((line) => line.startsWith('Compiled routing'))).toBe(false);
    // Exactly the legacy single brief entry.
    expect(system).toHaveLength(1);
  });

  it('=0 kill invalidates a previously-cached compiled brief (not re-served)', async () => {
    mockAdvisorChild(childStdout({ action: 'route', hubId: 'sk-code', targets: ['quality'], servingAuthority: 'compiled', fingerprint: 'abc123', generation: 3 }));
    process.env[FLAG] = '1';
    const hooks = await makePlugin();

    await runPrompt(hooks, 'implement feature X');
    const afterFirst = mockedChild.spawn.mock.calls.length;
    await runPrompt(hooks, 'implement feature X');
    expect(mockedChild.spawn.mock.calls.length).toBe(afterFirst); // served from cache, no respawn

    process.env[FLAG] = '0';
    await runPrompt(hooks, 'implement feature X');
    expect(mockedChild.spawn.mock.calls.length).toBeGreaterThan(afterFirst); // kill flips serving fingerprint -> cache miss
  });
});
