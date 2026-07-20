// Effective-consumption invariants for compiled routing:
//   - the bridge child-env allowlist forwards SPECKIT_COMPILED_ROUTING (no-dist
//     fallback spawn path)
//   - buildNativeBrief carries the compiled decision as a top-level
//     metadata.compiledRouteSummary instead of dropping it at the rebuild
//   - each 4-action outcome (route/clarify/defer/reject) survives; a legacy
//     recommendation with no compiled decision yields no summary (clean degrade)
//   - the OpenCode plugin renders the served outcome into the injected
//     system-context, and a =0 kill invalidates a previously-cached compiled brief

import { EventEmitter } from 'node:events';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockedChild = vi.hoisted(() => ({ spawn: vi.fn() }));
vi.mock('node:child_process', () => ({ spawn: mockedChild.spawn }));

// The bridge imports the MCP SDK client only for its CLI/MCP-subprocess fallback
// path, which these tests never exercise (buildNativeBrief runs with injected
// modules). Stub the SDK subpaths so importing the bridge module does not require
// resolving the SDK's export map in the vitest ESM context.
vi.mock('@modelcontextprotocol/sdk/client/index.js', () => ({ Client: class {} }));
vi.mock('@modelcontextprotocol/sdk/client/stdio.js', () => ({ StdioClientTransport: class {} }));

import * as bridge from '../plugin-bridges/mk-skill-advisor-bridge.mjs';

import MkSkillAdvisorPlugin from '../../../../plugins/mk-skill-advisor.js';

const FLAG = 'SPECKIT_COMPILED_ROUTING';

// ── Bridge propagation (no-dist fallback spawn path) ────────────────────────

describe('bridge child-env allowlist forwards the compiled-routing flag', () => {
  it('forwards =1 to the bridge-spawned child', () => {
    expect(bridge.createChildEnv({ SPECKIT_COMPILED_ROUTING: '1', PATH: '/usr/bin' }).SPECKIT_COMPILED_ROUTING).toBe('1');
  });

  it('forwards the kill value =0', () => {
    expect(bridge.createChildEnv({ SPECKIT_COMPILED_ROUTING: '0', PATH: '/usr/bin' }).SPECKIT_COMPILED_ROUTING).toBe('0');
  });

  it('adds no key when unset', () => {
    expect(Object.prototype.hasOwnProperty.call(bridge.createChildEnv({ PATH: '/usr/bin' }), 'SPECKIT_COMPILED_ROUTING')).toBe(false);
  });
});

// ── Bridge decision threading (buildNativeBrief) ────────────────────────────

function fakeModules(recommendations: unknown[]) {
  return {
    loadNativeAdvisorModules: async () => ({
      handleAdvisorRecommend: async () => ({
        content: [{
          text: JSON.stringify({
            data: {
              recommendations,
              freshness: 'live',
              ambiguous: false,
              cache: { hit: false },
            },
          }),
        }],
      }),
      renderAdvisorBrief: () => 'ADVISOR BRIEF TEXT',
    }),
  };
}

function briefInput() {
  return { workspaceRoot: '/ws', prompt: 'quality review of the code', thresholdConfidence: 0.8, maxTokens: 80, probe: { generation: 1 } };
}

function compiledRec(action: string) {
  return {
    skillId: 'sk-code',
    confidence: 0.9,
    uncertainty: 0.1,
    score: 0.9,
    compiledRoute: { hubId: 'sk-code', action, targets: ['quality'], effectivePolicyHash: 'abc123', generation: 3 },
  };
}

describe('buildNativeBrief threads the compiled decision to top-level metadata', () => {
  it('carries a compiledRouteSummary derived from the attached decision', async () => {
    const response = await bridge.buildNativeBrief(briefInput(), fakeModules([compiledRec('route')]));
    expect(response.metadata.compiledRouteSummary).toEqual({
      outcome: 'route',
      hubId: 'sk-code',
      targets: ['quality'],
      servingAuthority: 'compiled',
      fingerprint: 'abc123',
      generation: 3,
    });
    // The route/legacy fields are unchanged: threading is additive.
    expect(response.brief).toBe('ADVISOR BRIEF TEXT');
    expect(response.status).toBe('ok');
  });

  for (const action of ['route', 'clarify', 'defer', 'reject']) {
    it(`surfaces the ${action} outcome`, async () => {
      const response = await bridge.buildNativeBrief(briefInput(), fakeModules([compiledRec(action)]));
      expect(response.metadata.compiledRouteSummary.outcome).toBe(action);
    });
  }

  it('adds no summary for a legacy recommendation (clean degrade to legacy shape)', async () => {
    const legacyRec = { skillId: 'sk-code', confidence: 0.9, uncertainty: 0.1, score: 0.9 };
    const response = await bridge.buildNativeBrief(briefInput(), fakeModules([legacyRec]));
    expect(response.metadata.compiledRouteSummary).toBeUndefined();
    expect(response.brief).toBe('ADVISOR BRIEF TEXT');
  });
});

// ── Plugin render + cache invalidation (end-to-end via mocked bridge) ────────

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

function bridgeStdout(compiledRouteSummary?: Record<string, unknown>) {
  return JSON.stringify({
    brief: 'Advisor: live; use sk-code 0.91/0.23 pass.',
    status: 'ok',
    metadata: {
      freshness: 'live',
      cacheHit: false,
      recommendationCount: 1,
      tokenCap: 80,
      skillLabel: 'sk-code',
      ...(compiledRouteSummary ? { compiledRouteSummary } : {}),
    },
  });
}

function mockBridge(stdout: string) {
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
    mockBridge(bridgeStdout({ outcome: 'route', hubId: 'sk-code', targets: ['quality'], servingAuthority: 'compiled', fingerprint: 'abc123', generation: 3 }));
    const system = await runPrompt(await makePlugin(), 'implement feature X');
    const compiledLine = system.find((line) => line.startsWith('Compiled routing'));
    expect(compiledLine).toBeTruthy();
    expect(compiledLine).toContain('outcome=route');
    expect(compiledLine).toContain('hub=sk-code');
  });

  it('injects no compiled line when no decision is served (byte-identical legacy brief)', async () => {
    mockBridge(bridgeStdout());
    const system = await runPrompt(await makePlugin(), 'implement feature X');
    expect(system.some((line) => line.startsWith('Compiled routing'))).toBe(false);
    // Exactly the legacy single brief entry.
    expect(system).toHaveLength(1);
  });

  it('=0 kill invalidates a previously-cached compiled brief (not re-served)', async () => {
    mockBridge(bridgeStdout({ outcome: 'route', hubId: 'sk-code', targets: ['quality'], servingAuthority: 'compiled', fingerprint: 'abc123', generation: 3 }));
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
