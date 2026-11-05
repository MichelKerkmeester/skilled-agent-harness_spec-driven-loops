// ───────────────────────────────────────────────────────────────
// MODULE: Negated Write Surface Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import { scoreExplicitLane } from '../../lib/scorer/lanes/explicit.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';
import type { SkillProjection } from '../../lib/scorer/types.js';

// A bare sk-doc entry, so any evidence comes from the lane's own anchors.
const BARE_SK_DOC: SkillProjection = {
  id: 'sk-doc',
  kind: 'skill',
  family: 'sk-doc',
  category: 'documentation',
  name: 'sk-doc',
  description: '',
  keywords: [],
  domains: [],
  intentSignals: [],
  derivedTriggers: [],
  derivedKeywords: [],
  sourcePath: null,
  lifecycleStatus: 'active',
};

const projection = createFixtureProjection([BARE_SK_DOC]);

function hasWriteDocSurface(prompt: string): boolean {
  const evidence = scoreExplicitLane(prompt.toLowerCase(), projection)
    .find((match) => match.skillId === 'sk-doc')?.evidence ?? [];
  return evidence.includes('write-doc-surface');
}

// A negated write verb forbids the write, so it must not anchor a doc-write surface.
describe('negated write surface', () => {
  it.each([
    'Write the README for this package',
    'Update the taxonomy docs with the final labels',
    'Review the taxonomy and then update the README',
  ])('anchors sk-doc when the prompt asks for a doc write: %s', (prompt) => {
    expect(hasWriteDocSurface(prompt)).toBe(true);
  });

  it.each([
    'Review the routing taxonomy only; don’t write anything back yet.',
    "Review the routing taxonomy only; don't write anything back yet.",
    'Audit the docs but do not edit anything',
    'Check the README without changing it',
  ])('leaves sk-doc unanchored when every write verb is negated: %s', (prompt) => {
    expect(hasWriteDocSurface(prompt)).toBe(false);
  });
});
