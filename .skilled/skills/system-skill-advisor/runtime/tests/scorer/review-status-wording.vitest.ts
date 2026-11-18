// ───────────────────────────────────────────────────────────────────
// MODULE: Review Status Wording
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { scoreExplicitLane } from '../../lib/scorer/lanes/explicit.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';

const PROJECTION = createFixtureProjection([]);

function reviewBoost(prompt: string): boolean {
  return scoreExplicitLane(prompt, PROJECTION)
    .some((entry) => entry.skillId === 'sk-code' && entry.evidence.includes('token:review'));
}

// "In review" on a ticket names a tracker column, not a request to review code.
describe('review token boost and tracker status wording', () => {
  it('skips the code-review boost when review names a ticket status', () => {
    expect(reviewBoost('move my clickup ticket to in review')).toBe(false);
    expect(reviewBoost('set the jira issue status to review')).toBe(false);
    expect(reviewBoost('move this task into review')).toBe(false);
  });

  it('keeps the boost when review asks for a code review', () => {
    expect(reviewBoost('review my code')).toBe(true);
    expect(reviewBoost('review this PR before merge')).toBe(true);
    expect(reviewBoost('can you review the ticket parser changes')).toBe(true);
  });
});
