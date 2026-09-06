// ───────────────────────────────────────────────────────────────────
// TEST: Fact Coercion
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { coerceFactToText, coerceFactsToText } from '../utils/fact-coercion.js';

describe('coerceFactToText', () => {
  it('passes a string through and reports its source shape', () => {
    expect(coerceFactToText('lease cleanup runs unconditionally')).toMatchObject({
      text: 'lease cleanup runs unconditionally',
      sourceType: 'string',
    });
  });

  it('drops a nullish value with a named reason instead of an empty string', () => {
    const coerced = coerceFactToText(null);
    expect(coerced.text).toBe('');
    expect(coerced.dropReason).toBe('nullish');
    expect(coerced.sourceType).toBe('nullish');
  });
});

describe('coerceFactsToText', () => {
  it('keeps only the facts that coerce to non-empty text', () => {
    const texts = coerceFactsToText(['kept', null, undefined, 42], { component: 'test', fieldPath: 'facts' });
    expect(texts).toContain('kept');
    expect(texts).not.toContain('');
  });
});
