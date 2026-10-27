// ───────────────────────────────────────────────────────────────────
// MODULE: Fanout Effect Dispatch Unit Tests
// ───────────────────────────────────────────────────────────────────
// A lineage that is dispatched again under the session id it already holds is a resume, and a
// resume must reach the executor. The effect ledger keys one logical effect per lineage and
// attempt, so these cases drive the gateway through the same lineage directory more than once.

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { dispatchExecutorEffect } from '../../lib/deep-loop/fanout-effect-dispatch.js';
import type { ExecutorSpawnResult } from '../../lib/deep-loop/fanout-effect-dispatch.js';

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length > 0) {
    rmSync(tempDirs.pop()!, { recursive: true, force: true });
  }
});

function makeLineageDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'fanout-effect-dispatch-'));
  tempDirs.push(dir);
  return dir;
}

const authorityProvider = () => ({ state: 'legacy_authoritative' as const, epoch: 1 });

function dispatchOnce(input: {
  lineageDir: string;
  sessionId?: string;
  attempt?: number;
  prompt?: string;
  dispatch: () => Promise<ExecutorSpawnResult>;
}): Promise<ExecutorSpawnResult> {
  return dispatchExecutorEffect({
    lineageDir: input.lineageDir,
    canonicalMode: 'deep-research',
    sessionId: input.sessionId ?? 'fanout-lane-1',
    lineageLabel: 'lane',
    attempt: input.attempt ?? 1,
    command: 'opencode',
    cmdArgs: ['run', input.prompt ?? 'same prompt'],
    dispatchOpts: { cwd: input.lineageDir, timeoutMs: 1_000 },
    dispatch: input.dispatch,
    authorityProvider,
  });
}

describe('dispatchExecutorEffect — a lineage dispatched again under its own session id', () => {
  it('reaches the executor on a second dispatch after the first one was confirmed', async () => {
    const lineageDir = makeLineageDir();
    let calls = 0;
    const dispatch = async (): Promise<ExecutorSpawnResult> => {
      calls += 1;
      return { status: 0, signal: null, stdout: `run ${calls}` };
    };

    const first = await dispatchOnce({ lineageDir, dispatch });
    const second = await dispatchOnce({ lineageDir, dispatch });

    expect(first.status).toBe(0);
    expect(calls).toBe(2);
    expect(second.error).toBeUndefined();
    expect(second.status).toBe(0);
    expect(second.stdout).toBe('run 2');
  });

  it('reaches the executor when the resumed prompt differs from the one first dispatched', async () => {
    const lineageDir = makeLineageDir();
    let calls = 0;
    const dispatch = async (): Promise<ExecutorSpawnResult> => {
      calls += 1;
      return { status: 0, signal: null, stdout: `run ${calls}` };
    };

    await dispatchOnce({ lineageDir, prompt: 'first prompt', dispatch });
    const second = await dispatchOnce({ lineageDir, prompt: 'resume prompt', dispatch });

    expect(calls).toBe(2);
    expect(second.error).toBeUndefined();
    expect(second.status).toBe(0);
  });

  it('reaches the executor when the earlier dispatch died before it was confirmed', async () => {
    const lineageDir = makeLineageDir();
    const crashed = async (): Promise<ExecutorSpawnResult> => {
      throw new Error('supervisor lost the executor mid-run');
    };
    await dispatchOnce({ lineageDir, dispatch: crashed }).catch(() => undefined);

    let calls = 0;
    const second = await dispatchOnce({
      lineageDir,
      dispatch: async () => {
        calls += 1;
        return { status: 0, signal: null, stdout: 'resumed' };
      },
    });

    expect(calls).toBe(1);
    expect(second.error).toBeUndefined();
    expect(second.stdout).toBe('resumed');
  });

  it('keeps one dispatch per ledger identity across three consecutive resumes', async () => {
    const lineageDir = makeLineageDir();
    let calls = 0;
    const dispatch = async (): Promise<ExecutorSpawnResult> => {
      calls += 1;
      return { status: 0, signal: null, stdout: `run ${calls}` };
    };

    for (let i = 0; i < 3; i += 1) {
      const result = await dispatchOnce({ lineageDir, dispatch });
      expect(result.error).toBeUndefined();
      expect(result.stdout).toBe(`run ${i + 1}`);
    }
    expect(calls).toBe(3);
  });
});
