// ───────────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Plural Noun
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { scoreExplicitLane } from '../../lib/scorer/lanes/explicit.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';

const PROJECTION = createFixtureProjection([]);

interface HubSignal {
  readonly score: number;
  readonly evidence: readonly string[];
}

function hubSignal(prompt: string): HubSignal {
  const match = scoreExplicitLane(prompt, PROJECTION)
    .find((entry) => entry.skillId === 'system-deep-loop');
  return { score: match?.score ?? 0, evidence: [...(match?.evidence ?? [])].sort() };
}

// A count in front of the noun asks for the same run one more of it would, so
// "two research loops" has to reach the loop hub exactly as "a research loop"
// does. A plural noun is a word, not a different request.
describe('the loop rules read a plural loop noun as the singular', () => {
  it('gives the plural research prompt the singular research-loop signal', () => {
    const singular = hubSignal('run a research loop on the cache and pick the better one');
    const plural = hubSignal('run two research loops on the cache and pick the better one');
    expect(singular.evidence).toContain('research-loop');
    expect(plural).toEqual(singular);
  });

  it('gives the plural review prompt the singular review-loop signal', () => {
    const singular = hubSignal('run a review loop of the importer');
    const plural = hubSignal('run two review loops of the importer');
    expect(singular.evidence).toContain('review-loop');
    expect(plural).toEqual(singular);
  });
});
