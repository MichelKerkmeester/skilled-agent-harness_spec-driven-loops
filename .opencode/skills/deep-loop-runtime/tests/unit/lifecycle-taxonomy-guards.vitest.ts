import { describe, expect, it, vi } from 'vitest';

import { createRequire } from 'node:module';

const nodeRequire = createRequire(import.meta.url);

type LoopActiveStatus = 'running' | 'waiting' | 'paused' | 'idle' | 'stopped';

interface ResumeResolveGate {
  waitForResume: () => Promise<void>;
  resolveResume: () => boolean;
  readonly resumeResolve: (() => boolean) | null;
  isResolved: () => boolean;
}

const TAXONOMY = '../../lib/deep-loop/lifecycle-taxonomy.cjs';

const taxonomy = nodeRequire(TAXONOMY) as {
  LoopActiveStatus: Record<LoopActiveStatus, LoopActiveStatus>;
  LEGAL_TRANSITIONS: Record<LoopActiveStatus, readonly LoopActiveStatus[]>;
  createResumeResolveGate: () => ResumeResolveGate;
};

describe('lifecycle taxonomy guards', () => {
  it('declares legal and illegal active-state transitions', () => {
    expect(Object.keys(taxonomy.LEGAL_TRANSITIONS).sort()).toEqual([
      'idle',
      'paused',
      'running',
      'stopped',
      'waiting',
    ]);

    expect(taxonomy.LEGAL_TRANSITIONS.running).toContain(taxonomy.LoopActiveStatus.waiting);
    expect(taxonomy.LEGAL_TRANSITIONS.stopped).not.toContain(taxonomy.LoopActiveStatus.running);
  });

  it('resolves a resumeResolve paused-wait gate once', async () => {
    const gate = taxonomy.createResumeResolveGate();
    const settled = vi.fn();
    const wait = gate.waitForResume().then(settled);
    const resumeResolve = gate.resumeResolve;

    expect(resumeResolve).toEqual(expect.any(Function));
    expect(resumeResolve?.()).toBe(true);
    expect(gate.resumeResolve).toBeNull();
    expect(gate.resolveResume()).toBe(false);
    expect(resumeResolve?.()).toBe(false);

    await wait;

    expect(settled).toHaveBeenCalledTimes(1);
    expect(gate.isResolved()).toBe(true);
  });
});
