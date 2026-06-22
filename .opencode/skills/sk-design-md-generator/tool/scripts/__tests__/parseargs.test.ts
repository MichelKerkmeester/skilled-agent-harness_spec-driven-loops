import { describe, it, expect } from 'vitest';
import { parseArgs } from '../extract';

// parseArgs takes process.argv form (it slices the leading [node, script]).
const pa = (...a: string[]) => parseArgs(['node', 'extract', ...a]);

// Regression coverage for the flag-handling fixes: order-independent --fast (never
// clobbers an explicit value) and interaction capture being on by default.
describe('parseArgs flag handling', () => {
  it('--fast does NOT clobber an explicit --max-pages/--concurrency (order-independent)', () => {
    expect(pa('https://x.com', '--max-pages', '10', '--fast').maxPages).toBe(10);
    expect(pa('https://x.com', '--fast', '--max-pages', '10').maxPages).toBe(10);
    expect(pa('https://x.com', '--fast', '--concurrency', '3').concurrency).toBe(3);
  });

  it('--fast applies its defaults only when no explicit value is given', () => {
    expect(pa('https://x.com', '--fast').maxPages).toBe(5);
    expect(pa('https://x.com', '--fast').concurrency).toBe(8);
  });

  it('interaction capture is default-ON; --fast still captures; --fast-no-interaction opts out', () => {
    expect(pa('https://x.com').noInteraction).toBe(false);
    expect(pa('https://x.com', '--fast').noInteraction).toBe(false);
    const fni = pa('https://x.com', '--fast-no-interaction');
    expect(fni.noInteraction).toBe(true);
    expect(fni.maxPages).toBe(5);
    expect(pa('https://x.com', '--no-interaction').noInteraction).toBe(true);
  });
});
