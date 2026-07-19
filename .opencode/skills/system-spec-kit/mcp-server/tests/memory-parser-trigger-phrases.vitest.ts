import { describe, expect, it } from 'vitest';

import { extractTriggerPhrases } from '../lib/parsing/memory-parser';

describe('memory parser trigger phrase frontmatter', () => {
  it('preserves apostrophes in quoted and unquoted trigger phrases', () => {
    const content = [
      '---',
      'title: "Apostrophe Fixture"',
      'trigger_phrases:',
      '  - "user\'s trigger phrase"',
      "  - team's operational memory",
      'importance_tier: normal',
      '---',
      'Body',
    ].join('\n');

    expect(extractTriggerPhrases(content)).toEqual([
      "user's trigger phrase",
      "team's operational memory",
    ]);
  });

  it('folds multi-line YAML list phrases and caps case-insensitive duplicates', () => {
    const content = [
      '---',
      'title: "Multiline Fixture"',
      'trigger_phrases:',
      '  - >',
      '    multi line',
      '    trigger phrase',
      '  - Multi Line Trigger Phrase',
      '  - "second useful phrase"',
      'importance_tier: normal',
      '---',
      'Body',
    ].join('\n');

    expect(extractTriggerPhrases(content)).toEqual([
      'multi line trigger phrase',
      'second useful phrase',
    ]);
  });
});
