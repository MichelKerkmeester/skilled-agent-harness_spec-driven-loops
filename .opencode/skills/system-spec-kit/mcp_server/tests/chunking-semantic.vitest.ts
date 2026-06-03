// TEST: semanticChunk budget bounding + Unicode-safe truncation
// Verifies the chunker never returns text longer than maxLength (UTF-16 units),
// honors the budget guard on the critical-section loop, and does not split
// surrogate pairs at the truncation boundary.
import { describe, it, expect, vi } from 'vitest';
import {
  semanticChunk,
  RESERVED_OVERVIEW,
  RESERVED_OUTCOME,
} from '../../shared/chunking';

// Lone-surrogate detector: a high surrogate not followed by a low surrogate,
// or a low surrogate not preceded by a high surrogate.
const LONE_SURROGATE = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/;

describe('semanticChunk bounding', () => {
  it('returns input unchanged when within maxLength', () => {
    const text = 'short content';
    expect(semanticChunk(text, 1000)).toBe(text);
  });

  it('never exceeds maxLength when many critical sections overflow the budget', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const maxLength = 1200;
    // Build a document with many oversized "decision" sections that, under the
    // old unconditional critical loop, would push remainingBudget far negative.
    const criticalBlocks = Array.from({ length: 40 }, (_, i) =>
      `## decision ${i}\n${'we chose this approach because '.repeat(20)}`,
    ).join('\n\n');
    const overviewFiller = 'a'.repeat(RESERVED_OVERVIEW);
    const outcomeFiller = 'z'.repeat(RESERVED_OUTCOME);
    const text = `${overviewFiller}\n\n${criticalBlocks}\n\n${outcomeFiller}`;

    const result = semanticChunk(text, maxLength);
    expect(result.length).toBeLessThanOrEqual(maxLength);
    expect(result.length).toBeGreaterThan(0);
  });

  it('produces bounded output for tiny maxLength values', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const text = `alpha ${'x'.repeat(200)} omega`;
    for (const maxLength of [32, 64, 400]) {
      const result = semanticChunk(text, maxLength);
      expect(result.length).toBeLessThanOrEqual(maxLength);
    }
  });

  it('does not split a surrogate pair at the truncation boundary', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    // Astral-plane emoji (2 UTF-16 units each) packed so the cut lands on a pair.
    const emoji = '😀';
    const text = `intro text ${emoji.repeat(300)} closing remarks here`;
    const result = semanticChunk(text, 50);
    expect(result.length).toBeLessThanOrEqual(50);
    expect(LONE_SURROGATE.test(result)).toBe(false);
  });

  it('prefers a word boundary when truncating', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const text = `search_query: alpha ${'x'.repeat(80)}`;
    const result = semanticChunk(text, 32);
    expect(result.length).toBeLessThanOrEqual(32);
    // Whitespace-preference trims the trailing partial word rather than slicing
    // it mid-token, while keeping the leading content intact.
    expect(result).toContain('search_query: alpha');
    expect(result).not.toContain('search_query: alpha x');
  });
});
