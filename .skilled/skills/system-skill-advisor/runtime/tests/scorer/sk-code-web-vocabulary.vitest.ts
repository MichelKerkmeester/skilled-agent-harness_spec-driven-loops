// ───────────────────────────────────────────────────────────────
// MODULE: sk-code Web Vocabulary Contract Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import { scoreExplicitLane } from '../../lib/scorer/lanes/explicit.js';
import { scoreLexicalLane } from '../../lib/scorer/lanes/lexical.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';
import type { SkillProjection } from '../../lib/scorer/types.js';

// A bare sk-code entry with no metadata, so any evidence comes from the
// lanes' own boost and hint tables rather than from graph metadata.
const BARE_SK_CODE: SkillProjection = {
  id: 'sk-code',
  kind: 'skill',
  family: 'sk-code',
  category: 'code',
  name: 'sk-code',
  description: '',
  keywords: [],
  domains: [],
  intentSignals: [],
  derivedTriggers: [],
  derivedKeywords: [],
  sourcePath: null,
  lifecycleStatus: 'active',
};

const projection = createFixtureProjection([BARE_SK_CODE]);

function skCodeEvidence(matches: ReturnType<typeof scoreExplicitLane>): readonly string[] {
  return matches.find((match) => match.skillId === 'sk-code')?.evidence ?? [];
}

describe('sk-code web and motion vocabulary', () => {
  // The web surface left the sk-code hub, so web and motion words must not
  // pull a prompt toward it on their own.
  it('gives sk-code no explicit or lexical evidence for web and motion words', () => {
    const prompt = 'css animation with motion on a mobile viewport';

    expect(skCodeEvidence(scoreExplicitLane(prompt, projection))).toEqual([]);
    expect(skCodeEvidence(scoreLexicalLane(prompt, projection))).toEqual([]);
  });

  it('keeps the boosts for the code surfaces sk-code still serves', () => {
    const prompt = 'fix a typescript vitest';

    expect(skCodeEvidence(scoreExplicitLane(prompt, projection)))
      .toEqual(expect.arrayContaining(['token:typescript', 'token:vitest']));
    expect(skCodeEvidence(scoreLexicalLane(prompt, projection)))
      .toEqual(expect.arrayContaining(['hint:typescript', 'hint:vitest']));
  });
});
