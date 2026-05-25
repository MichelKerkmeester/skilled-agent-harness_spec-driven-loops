import { describe, expect, it, vi } from 'vitest';

import { mergeCompactBrief, type MergeInput } from '@spec-kit/shared/compact-merger';
import { WorkingSetTracker } from '../../../system-code-graph/mcp_server/lib/working-set-tracker.js';

function createInput(overrides: Partial<MergeInput> = {}): MergeInput {
  return {
    constitutional: 'Rule: preserve packet-local continuity.',
    codeGraph: 'Active file: /repo/src/session-resume.ts\nSymbol: handleSessionResume',
    sessionState: 'Next: run context-preservation scenario verification.',
    triggered: 'Triggered memory: strict session binding applies.',
    ...overrides,
  };
}

describe('compact merger manual scenarios 257 and 258', () => {
  it('tracks files with recency-weighted ordering and serializes state', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-17T06:00:00.000Z'));

    try {
      const tracker = new WorkingSetTracker(3);
      tracker.trackFile('/repo/a.ts');
      vi.advanceTimersByTime(60_000);
      tracker.trackFile('/repo/b.ts');
      tracker.trackFile('/repo/b.ts');
      vi.advanceTimersByTime(60_000);
      tracker.trackSymbol('sym-1', 'SessionResume.handle', '/repo/c.ts');

      const topRoots = tracker.getTopRoots(3);
      expect(topRoots.map((entry) => entry.filePath)).toEqual(['/repo/b.ts', '/repo/c.ts', '/repo/a.ts']);
      expect(topRoots[0]).toMatchObject({ filePath: '/repo/b.ts', accessCount: 2 });
      expect(topRoots[1]?.symbolRefs).toContain('SessionResume.handle');

      const restored = WorkingSetTracker.deserialize(tracker.serialize());
      expect(restored.getTrackedFiles().sort()).toEqual(['/repo/a.ts', '/repo/b.ts', '/repo/c.ts']);
    } finally {
      vi.useRealTimers();
    }
  });

  it('evicts oldest files back to maxFiles when capacity is exceeded', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-17T06:00:00.000Z'));

    try {
      const tracker = new WorkingSetTracker(2);
      tracker.trackFile('/repo/old.ts');
      vi.advanceTimersByTime(60_000);
      tracker.trackFile('/repo/mid.ts');
      vi.advanceTimersByTime(60_000);
      tracker.trackFile('/repo/new.ts');

      expect(tracker.size).toBe(2);
      expect(tracker.getTrackedFiles().sort()).toEqual(['/repo/mid.ts', '/repo/new.ts']);
    } finally {
      vi.useRealTimers();
    }
  });

  it('renders all non-empty compact sections in priority order within budget', () => {
    const result = mergeCompactBrief(createInput(), 4000);

    expect(result.text).toContain('## Constitutional Rules');
    expect(result.text).toContain('## Active Files & Structural Context');
    expect(result.text).toContain('## Session State / Next Steps');
    expect(result.text).toContain('## Triggered Memories');
    expect(result.sections.map((section) => section.name)).toEqual([
      'Constitutional Rules',
      'Active Files & Structural Context',
      'Session State / Next Steps',
      'Triggered Memories',
    ]);
    expect(result.metadata.totalTokenEstimate).toBeLessThanOrEqual(4000);
    expect(result.metadata.sourceCount).toBe(4);
    expect(result.metadata.mergedAt).toEqual(expect.any(String));
    expect(result.metadata.deduplicatedFiles).toBe(0);
    expect(result.allocation.allocations.every((allocation) => (
      typeof allocation.floor === 'number'
      && typeof allocation.requested === 'number'
      && typeof allocation.granted === 'number'
      && typeof allocation.dropped === 'number'
    ))).toBe(true);
  });

  it('omits empty sources and respects tiny caller budgets', () => {
    const result = mergeCompactBrief(createInput({
      constitutional: '',
      codeGraph: '',
      triggered: '',
      sessionState: 'S'.repeat(4000),
    }), 1);

    expect(result.metadata.totalTokenEstimate).toBeLessThanOrEqual(1);
    expect(result.text).not.toContain('Constitutional Rules');
    expect(result.text).not.toContain('Triggered Memories');
    expect(result.sections.map((section) => section.name)).toEqual(['Session State / Next Steps']);
  });
});
