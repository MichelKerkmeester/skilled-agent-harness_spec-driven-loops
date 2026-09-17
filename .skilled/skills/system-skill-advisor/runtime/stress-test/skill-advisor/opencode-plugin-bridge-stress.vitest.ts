// ───────────────────────────────────────────────────────────────
// MODULE: sa-034 — OpenCode Plugin Stress Test
// ───────────────────────────────────────────────────────────────

import { EventEmitter } from 'node:events';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Snapshot/restore env mutations so test failures do not leak
// SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED across tests.
import { snapshotEnv } from '../../lib/test-helpers/env-snapshot.js';

const mockedBridge = vi.hoisted(() => ({
  spawn: vi.fn(),
}));

vi.mock('node:child_process', () => ({
  spawn: mockedBridge.spawn,
}));

import MkSkillAdvisorPlugin from '../../../../../plugins/system-skill-advisor.js';

function cliResponse(recommendations: ReadonlyArray<Record<string, unknown>> = [
  { skillId: 'system-spec-kit', confidence: 0.91, uncertainty: 0.18 },
]) {
  return JSON.stringify({
    status: 'ok',
    data: { freshness: 'live', recommendations },
  });
}

function makeChild(stdout: string, closeCode = 0) {
  const child = new EventEmitter() as EventEmitter & {
    stdout: EventEmitter & { setEncoding: ReturnType<typeof vi.fn> };
    stdin: { end: ReturnType<typeof vi.fn> };
    kill: ReturnType<typeof vi.fn>;
  };
  child.stdout = new EventEmitter() as EventEmitter & { setEncoding: ReturnType<typeof vi.fn> };
  child.stdout.setEncoding = vi.fn();
  child.stdin = { end: vi.fn() };
  child.kill = vi.fn(() => true);
  queueMicrotask(() => {
    child.stdout.emit('data', stdout);
    child.emit('close', closeCode);
  });
  return child;
}

async function makePlugin(options: Record<string, unknown> = {}) {
  return MkSkillAdvisorPlugin({ directory: process.cwd() }, options);
}

async function runTransform(hooks: Awaited<ReturnType<typeof makePlugin>>, prompt: string, sessionID = 'sa-034') {
  const output = { system: [] as string[] };
  await hooks['experimental.chat.system.transform']?.({
    sessionID,
    prompt,
    model: { providerID: 'test', modelID: 'test' },
  } as never, output as never);
  return output;
}

function cliArgvAt(index: number): readonly string[] {
  return (mockedBridge.spawn.mock.calls[index]?.[1] as readonly string[] | undefined) ?? [];
}

describe('sa-034 — OpenCode plugin stress', () => {
  // Env keys mutated by these tests; snapshot before each, restore after.
  let restoreEnv: (() => void) | null = null;

  beforeEach(() => {
    // Snapshot env keys before any test mutation so afterEach restores
    // the original values (or unsets keys that were undefined) even on test failure.
    restoreEnv = snapshotEnv([
      'SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED',
      'SPECKIT_SKILL_ADVISOR_HOOK_DISABLED',
    ]);
    vi.useRealTimers();
    vi.clearAllMocks();
    delete process.env.SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED;
    delete process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED;
    mockedBridge.spawn.mockImplementation(() => makeChild(cliResponse()));
  });

  afterEach(() => {
    // Restore env keys snapshotted in beforeEach (runs even on failure)
    if (restoreEnv) {
      restoreEnv();
      restoreEnv = null;
    }
  });

  it('exposes the canonical plugin surface and status tool only', async () => {
    const hooks = await makePlugin();

    expect(hooks.event).toBeTypeOf('function');
    expect(hooks['experimental.chat.system.transform']).toBeTypeOf('function');
    expect(hooks.tool?.spec_kit_skill_advisor_status).toBeDefined();
    expect(hooks).not.toHaveProperty('onUserPromptSubmitted');
    expect(hooks).not.toHaveProperty('onSessionStart');
  });

  it('deduplicates concurrent prompt transforms through one advisor process', async () => {
    let closeChild: (() => void) | null = null;
    mockedBridge.spawn.mockImplementation(() => {
      const child = new EventEmitter() as EventEmitter & {
        stdout: EventEmitter & { setEncoding: ReturnType<typeof vi.fn> };
        stdin: { end: ReturnType<typeof vi.fn> };
        kill: ReturnType<typeof vi.fn>;
      };
      child.stdout = new EventEmitter() as EventEmitter & { setEncoding: ReturnType<typeof vi.fn> };
      child.stdout.setEncoding = vi.fn();
      child.stdin = { end: vi.fn() };
      child.kill = vi.fn(() => true);
      closeChild = () => {
        child.stdout.emit('data', cliResponse());
        child.emit('close', 0);
      };
      return child;
    });
    const hooks = await makePlugin({ cacheTTLMs: 5000 });

    const first = runTransform(hooks, 'generate packet 044 stress tests');
    const second = runTransform(hooks, 'generate packet 044 stress tests');
    await vi.waitFor(() => expect(mockedBridge.spawn).toHaveBeenCalled());
    closeChild?.();
    const outputs = await Promise.all([first, second]);

    expect(mockedBridge.spawn).toHaveBeenCalledTimes(1);
    expect(outputs[0].system[0]).toContain('system-spec-kit');
    expect(outputs[1].system[0]).toContain('system-spec-kit');
    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('advisor_lookups=2');
    expect(status).toContain('cache_hits=1');
    expect(status).toContain('cache_misses=1');
  });

  it('sends prompt-safe bounded CLI requests and clamps long returned briefs', async () => {
    mockedBridge.spawn.mockImplementation(() => makeChild(cliResponse([
      { skillId: 'system-spec-kit', confidence: 0.91, uncertainty: 0.18 },
    ])));
    // The CLI argv carries a fixed overhead (CLI path, flags, serialized options)
    // of roughly 276 bytes, so the prompt budget must clear that to be binding at all.
    const maxPromptBytes = 700;
    const hooks = await makePlugin({
      maxPromptBytes,
      maxBriefChars: 64,
      maxTokens: 12,
      thresholdConfidence: 0.8,
    });
    const prompt = `implement stress tests with secret@example.com ${'y'.repeat(2000)}`;

    const output = await runTransform(hooks, prompt);

    expect(output.system[0]).toHaveLength(64);
    expect(output.system[0]).toContain('Advisor:');
    const argv = cliArgvAt(0);
    const optionsIndex = argv.indexOf('--options');
    const requestOptions = JSON.parse(argv[optionsIndex + 1] ?? '{}') as Record<string, unknown>;
    expect(requestOptions.confidenceThreshold).toBe(0.8);
    const promptArg = argv[argv.indexOf('--prompt') + 1] ?? '';
    expect(Buffer.byteLength(promptArg, 'utf8')).toBeLessThan(Buffer.byteLength(prompt, 'utf8'));
    const invocationBytes = argv.reduce((total, arg) => total + Buffer.byteLength(arg, 'utf8') + 1, 0);
    expect(invocationBytes).toBeLessThanOrEqual(maxPromptBytes);
  });

  it('honors disabled env aliases without invoking the advisor', async () => {
    process.env.SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED = '1';
    const hooks = await makePlugin();

    const output = await runTransform(hooks, 'generate packet 044 stress tests');
    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});

    expect(output.system).toEqual([]);
    expect(mockedBridge.spawn).not.toHaveBeenCalled();
    expect(status).toContain('enabled=false');
    expect(status).toContain('disabled_reason=SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED');
  });
});
