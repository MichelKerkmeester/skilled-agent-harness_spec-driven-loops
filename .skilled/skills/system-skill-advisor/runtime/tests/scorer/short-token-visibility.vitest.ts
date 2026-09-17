// ───────────────────────────────────────────────────────────────
// MODULE: Short Content Token Visibility Contract Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import { tokenize } from '../../lib/scorer/text.js';

// A two-character executor name used to fall below the tokenizer's length floor, so every
// token lane was blind to it. The hub then scored only where an exact authored phrase
// happened to cover the wording, and any ordinary variation of that wording returned
// nothing at all. Short filler is already carried by the stop-word list, so the floor was
// rejecting short CONTENT words and nothing else.
describe('short content tokens', () => {
  it('keeps a two-character name the stop-word list does not cover', () => {
    expect(tokenize('delegate this to pi')).toContain('pi');
    expect(tokenize('pi agent')).toContain('pi');
  });

  it('still drops short filler, which the stop-word list owns', () => {
    const tokens = tokenize('go to it and do as we do');
    for (const filler of ['go', 'to', 'it', 'do', 'as', 'we']) {
      expect(tokens).not.toContain(filler);
    }
  });

  it('still drops single characters, which carry no routing signal', () => {
    expect(tokenize('a b c pi')).toStrictEqual(['pi']);
  });
});
