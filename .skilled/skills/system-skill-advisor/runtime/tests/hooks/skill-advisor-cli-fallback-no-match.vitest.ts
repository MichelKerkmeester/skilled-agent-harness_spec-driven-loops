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

  const stdin = {
    written: '',
    on: () => stdin,
    end(text?: string) {
      stdin.written += text ?? '';
    },
  };
  const child = new EventEmitter() as EventEmitter & {
    pid: number;
    stdout: typeof stdout;
    stdin: typeof stdin;
  };
  child.pid = 1234;
  child.stdout = stdout;
  child.stdin = stdin;
  queueMicrotask(() => {
    stdout.emit('data', stdoutText);
    child.emit('close', 0, null);
  });
  return child;
}

describe('skill advisor CLI fallback no-match diagnostics', () => {
  it('sends the payload on stdin, keeps the prompt out of argv and skips compiled routing', async () => {
    let child: ReturnType<typeof mockCliChild> | undefined;
    mockedChild.spawn.mockImplementation(() => {
      child = mockCliChild(JSON.stringify({ data: { freshness: 'live', recommendations: [] } }));
      return child;
    });

    try {
      await buildSkillAdvisorBriefFromCli(
        'Inspect the hook',
        { workspaceRoot: process.cwd(), runtime: 'pi', timeoutMs: 1_000 },
        { env: {}, now: () => 1 },
      );

      const spawnCall = mockedChild.spawn.mock.calls[0] as readonly unknown[] | undefined;
      const cliArgs = spawnCall?.[1] as readonly string[] | undefined;
      expect(cliArgs).toBeDefined();
      expect(child).toBeDefined();
      if (!cliArgs || !child) return;

      expect(cliArgs[cliArgs.indexOf('--json') + 1]).toBe('-');
      expect(cliArgs.some((argument) => argument.includes('Inspect the hook'))).toBe(false);

      const payload = JSON.parse(child.stdin.written) as {
        prompt?: string;
        options?: { includeCompiledRoute?: boolean };
      };
      expect(payload.prompt).toBe('Inspect the hook');
      expect(payload.options?.includeCompiledRoute).toBe(false);
    } finally {
      mockedChild.spawn.mockReset();
    }
  });

  it('sends at most the advisor prompt limit on stdin', async () => {
    let child: ReturnType<typeof mockCliChild> | undefined;
    mockedChild.spawn.mockImplementation(() => {
      child = mockCliChild(JSON.stringify({ data: { freshness: 'live', recommendations: [] } }));
      return child;
    });
    const prompt = 'Inspect the hook '.repeat(1000);

    try {
      await buildSkillAdvisorBriefFromCli(
        prompt,
        { workspaceRoot: process.cwd(), runtime: 'pi', timeoutMs: 1_000 },
        { env: {}, now: () => 1 },
      );

      expect(child).toBeDefined();
      if (!child) return;
      const payload = JSON.parse(child.stdin.written) as { prompt?: string };
      expect(payload.prompt).toBe(prompt.slice(0, 10_000));
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
