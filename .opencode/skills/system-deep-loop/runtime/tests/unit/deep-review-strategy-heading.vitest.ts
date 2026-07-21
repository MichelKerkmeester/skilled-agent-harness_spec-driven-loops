import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

// Regression coverage for the deep-review reducer's strategy-heading upsert. The
// strategy file is authored by an agent and may arrive in the canonical numbered
// dialect ("## 11. RULED OUT DIRECTIONS") or an un-numbered one ("## Ruled Out
// Directions"), or without the section at all. The reducer must resolve all three
// without halting the loop, while still failing closed on a genuinely corrupt file
// when the create-missing bootstrap is not requested.

const nodeRequire = createRequire(import.meta.url);
const { upsertHeadingSectionBefore } = nodeRequire('../../scripts/reduce-state.cjs') as {
  upsertHeadingSectionBefore: (
    content: string,
    heading: string,
    body: string,
    beforeHeading: string,
    options?: { createMissing?: boolean },
  ) => string;
};

const HEADING = '10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER';
const BEFORE = '11. RULED OUT DIRECTIONS';
const BODY = '- Completed pivots: 0';

describe('upsertHeadingSectionBefore — strategy-heading dialect tolerance', () => {
  it('inserts before a canonical numbered heading, preserving it (normal path unchanged)', () => {
    const content = '# Deep Review Strategy\n\n## 11. RULED OUT DIRECTIONS\n[none]\n';
    const out = upsertHeadingSectionBefore(content, HEADING, BODY, BEFORE);
    expect(out).toContain('## 10A. SATURATED');
    expect(out).toContain('## 11. RULED OUT DIRECTIONS');
    expect(out.indexOf('## 10A. SATURATED')).toBeLessThan(out.indexOf('## 11. RULED OUT DIRECTIONS'));
  });

  it('inserts before an un-numbered heading dialect, preserving the authored text verbatim', () => {
    const content = '# Deep Review Strategy\n\n## Ruled Out Directions\n[none]\n';
    const out = upsertHeadingSectionBefore(content, HEADING, BODY, BEFORE);
    expect(out).toContain('## 10A. SATURATED');
    // The authored heading is kept as-is, not silently renumbered.
    expect(out).toContain('## Ruled Out Directions');
  });

  it('bootstraps (appends) when the insertion heading is absent and createMissing is set', () => {
    const content = '# Deep Review Strategy\n\n## Topic\nx\n';
    const out = upsertHeadingSectionBefore(content, HEADING, BODY, BEFORE, { createMissing: true });
    expect(out).toContain('## 10A. SATURATED');
    expect(out.startsWith('# Deep Review Strategy')).toBe(true);
  });

  it('fails closed (throws) when the insertion heading is absent without createMissing', () => {
    const content = '# Deep Review Strategy\n\n## Topic\nx\n';
    expect(() => upsertHeadingSectionBefore(content, HEADING, BODY, BEFORE)).toThrow(/Missing insertion heading/);
  });

  it('updates an existing section in place — idempotent, no duplicate', () => {
    const base = '# Deep Review Strategy\n\n## 11. RULED OUT DIRECTIONS\n[none]\n';
    const seeded = upsertHeadingSectionBefore(base, HEADING, 'old body', BEFORE);
    const updated = upsertHeadingSectionBefore(seeded, HEADING, 'new body', BEFORE);
    expect(updated.match(/## 10A\. SATURATED/g)?.length).toBe(1);
    expect(updated).toContain('new body');
    expect(updated).not.toContain('old body');
  });
});
