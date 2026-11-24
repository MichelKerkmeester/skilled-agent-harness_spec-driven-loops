// ───────────────────────────────────────────────────────────────────
// MODULE: Stage-One Loop Subject
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { scoreExplicitLane } from '../../lib/scorer/lanes/explicit.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';

const PROJECTION = createFixtureProjection([]);

function hasEvidence(prompt: string, skillId: string, reason: string): boolean {
  return scoreExplicitLane(prompt, PROJECTION)
    .some((entry) => entry.skillId === skillId && entry.evidence.includes(reason));
}

// A pass count reads as a loop ask only where the command gate would read one,
// so the lane and the offered command cannot disagree on what the prompt asks.
describe('stage-one loop rules read pass counts as the gate does', () => {
  it('keeps the loop lane when the passes ask for the run', () => {
    const prompt = 'review the parser in several passes';
    expect(hasEvidence(prompt, 'system-deep-loop', 'review-loop')).toBe(true);
    expect(hasEvidence(prompt, 'sk-code', 'iterative-review-vs-pr-disambiguation')).toBe(true);
  });

  it('drops the loop lane when the passes report runs that already happened', () => {
    const prompt = 'several passes of the linter failed, review the config';
    expect(hasEvidence(prompt, 'system-deep-loop', 'review-loop')).toBe(false);
    expect(hasEvidence(prompt, 'sk-code', 'iterative-review-vs-pr-disambiguation')).toBe(false);
  });

  it('drops the research loop when a hyphenated count names the subject', () => {
    expect(hasEvidence('research three-pass vs two-pass compilers', 'system-deep-loop', 'research-loop')).toBe(false);
  });

  // A bare loop word fires this lane on its own, so it would pin nothing here: the
  // prompt has to arrive as a pass count instead. "Several passes" is a raw
  // multi-pass ask whose runs already happened, so the ask alone drops it, and the
  // complaint about the hang is what keeps the lane.
  it('keeps the loop lane on a stuck run that quotes its passes', () => {
    const prompt = 'my deep review is stuck, it ran several passes and hangs';
    expect(hasEvidence(prompt, 'system-deep-loop', 'review-loop')).toBe(true);
    expect(hasEvidence(prompt, 'sk-code', 'iterative-review-vs-pr-disambiguation')).toBe(true);
  });
});
