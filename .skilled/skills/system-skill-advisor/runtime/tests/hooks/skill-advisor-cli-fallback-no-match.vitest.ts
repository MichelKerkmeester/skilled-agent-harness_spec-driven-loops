// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor CLI Fallback No-Match Diagnostics Tests
// ───────────────────────────────────────────────────────────────

import { EventEmitter } from 'node:events';
import { describe, expect, it, vi } from 'vitest';

import {
  buildSkillAdvisorBriefFromCli,
  resultFromCliData,
} from '../../../hooks/lib/skill-advisor-cli-fallback.js';

const mockedChild = vi.hoisted(() => ({ spawn: vi.fn() }));
vi.mock('node:child_process', () => ({ spawn: mockedChild.spawn }));

const OPTIONS = { maxTokens: 80 } as never;

function build(data: Record<string, unknown>) {
  return resultFromCliData({
    data: data as never,
    options: OPTIONS,
    startedAt: 0,
    now: () => 1,
  }) as unknown as {
    status: string;
    freshness: string;
    diagnostics: Record<string, unknown> | null;
  };
}

const PASSING_RECOMMENDATION = {
  skillId: 'sk-git',
  confidence: 0.95,
  uncertainty: 0.1,
};

function mockCliChild(stdoutText: string) {
  const stdout = new EventEmitter() as EventEmitter & {
    setEncoding: (encoding: string) => void;
    read: () => null;
  };
  stdout.setEncoding = () => undefined;
  stdout.read = () => null;

  const child = new EventEmitter() as EventEmitter & {
    pid: number;
    stdout: typeof stdout;
  };
  child.pid = 1234;
  child.stdout = stdout;
  queueMicrotask(() => {
    stdout.emit('data', stdoutText);
    child.emit('close', 0, null);
  });
  return child;
}

describe('skill advisor CLI fallback no-match diagnostics', () => {
  it('does not request compiled routing data in the CLI payload', async () => {
    mockedChild.spawn.mockImplementation(() => mockCliChild(JSON.stringify({
      data: { freshness: 'live', recommendations: [] },
    })));

    try {
      await buildSkillAdvisorBriefFromCli(
        'Inspect the hook',
        { workspaceRoot: process.cwd(), runtime: 'pi', timeoutMs: 1_000 },
        { env: {}, now: () => 1 },
      );

      const spawnCall = mockedChild.spawn.mock.calls[0] as readonly unknown[] | undefined;
      const cliArgs = spawnCall?.[1] as readonly string[] | undefined;
      expect(cliArgs).toBeDefined();
      if (!cliArgs) return;

      const payloadIndex = cliArgs.indexOf('--json') + 1;
      expect(payloadIndex).toBeGreaterThan(0);
      if (payloadIndex <= 0) return;

      const encodedPayload = cliArgs[payloadIndex];
      expect(typeof encodedPayload).toBe('string');
      if (typeof encodedPayload !== 'string') return;

      const payload = JSON.parse(encodedPayload) as {
        options?: { includeCompiledRoute?: boolean };
      };
      expect(payload.options?.includeCompiledRoute).toBe(false);
    } finally {
      mockedChild.spawn.mockReset();
    }
  });

  it('reports a live advisor with nothing to recommend as a no-match, not an outage', () => {
    const result = build({ freshness: 'live', recommendations: [] });

    expect(result.status).toBe('skipped');
    expect(result.freshness).toBe('live');
    // The advisor answered. Naming an error code or class here is what made a
    // successful empty result read as a transport failure.
    expect(result.diagnostics?.errorMessage).toBe('CLI_ADVISOR_NO_MATCH');
    expect(result.diagnostics?.reason).toBe('no_recommendation');
    expect(result.diagnostics?.errorCode).toBeUndefined();
    expect(result.diagnostics?.errorClass).toBeUndefined();
  });

  it('still reports an unreachable advisor as unavailable', () => {
    const result = build({ freshness: 'unavailable', recommendations: [] });

    expect(result.status).toBe('fail_open');
    expect(result.diagnostics?.errorMessage).toBe('CLI_ADVISOR_UNAVAILABLE');
    expect(result.diagnostics?.errorCode).toBe('NON_ZERO_EXIT');
  });

  it('leaves a successful recommendation free of diagnostics', () => {
    const result = build({ freshness: 'live', recommendations: [PASSING_RECOMMENDATION] });

    expect(result.status).toBe('ok');
    expect(result.diagnostics).toBeNull();
  });
});
