import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

// Regression coverage for the deep-review reducer's strategy-heading upsert. The
// strategy file is authored by an agent and may arrive in the canonical numbered
// dialect ("## 11. RULED OUT DIRECTIONS") or an un-numbered one ("## Ruled Out
// Directions"), or without the section at all. The reducer must resolve all three
// without halting the loop, while still failing closed on a genuinely corrupt file
// when the create-missing bootstrap is not requested.

const nodeRequire = createRequire(import.meta.url);
const { upsertHeadingSectionBefore, replaceAnchorSection } = nodeRequire('../../scripts/reduce-state.cjs') as {
  upsertHeadingSectionBefore: (
    content: string,
    heading: string,
    body: string,
    beforeHeading: string,
    options?: { createMissing?: boolean },
  ) => string;
  replaceAnchorSection: (
    content: string,
    anchorId: string,
    heading: string,
    body: string,
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

// Regression coverage for replaceAnchorSection's dialect fallback. The
// deep-review-strategy.md template wraps each machine-owned section in
// `<!-- MACHINE-OWNED: START/END -->` comments keyed by heading text, while
// the reducer's primary contract keys sections by `<!-- ANCHOR:id -->`
// comments. Without a fallback, a freshly-templated file has zero ANCHOR
// comments, so the reducer either throws (createMissing:false) or appends a
// second copy of the section (createMissing:true) instead of updating the
// MACHINE-OWNED-wrapped section already in the file.
describe('replaceAnchorSection — MACHINE-OWNED template dialect fallback', () => {
  const ANCHOR_ID = 'review-dimensions';
  const HEADING_TEXT = '3. REVIEW DIMENSIONS (remaining)';
  const BODY = '- [ ] D1 Correctness';

  it('updates a MACHINE-OWNED-wrapped section in place instead of appending a duplicate', () => {
    const template = [
      '# Deep Review Strategy',
      '',
      '## 3. REVIEW DIMENSIONS (remaining)',
      '<!-- MACHINE-OWNED: START -->',
      '- [ ] D1 Correctness, Logic errors',
      '- [ ] D2 Security',
      '<!-- MACHINE-OWNED: END -->',
      '',
      '---',
      '',
      '## 4. NON-GOALS',
      '[none]',
      '',
    ].join('\n');

    // No createMissing flag: this must resolve via the heading fallback, not
    // the create-missing bootstrap path, proving the fallback alone (not a
    // bootstrap flag) is what stops the duplication.
    const out = replaceAnchorSection(template, ANCHOR_ID, HEADING_TEXT, BODY);

    expect(out.match(/## 3\. REVIEW DIMENSIONS \(remaining\)/g)?.length).toBe(1);
    expect(out).toContain(BODY);
    // The originally-templated content for this section is gone -- it was
    // replaced in place, not left behind alongside an appended duplicate.
    expect(out).not.toContain('D2 Security');
    // The unrelated section below is untouched.
    expect(out).toContain('## 4. NON-GOALS');
  });

  it('is idempotent once normalized to the ANCHOR dialect', () => {
    const template = [
      '## 3. REVIEW DIMENSIONS (remaining)',
      '<!-- MACHINE-OWNED: START -->',
      '- [ ] D1 Correctness',
      '<!-- MACHINE-OWNED: END -->',
      '',
    ].join('\n');
    const once = replaceAnchorSection(template, ANCHOR_ID, HEADING_TEXT, BODY, { createMissing: true });
    const twice = replaceAnchorSection(once, ANCHOR_ID, HEADING_TEXT, BODY, { createMissing: true });
    expect(twice.match(/## 3\. REVIEW DIMENSIONS \(remaining\)/g)?.length).toBe(1);
    expect(twice).toBe(once);
  });

  it('still bootstraps by appending when the heading is genuinely absent and createMissing is set', () => {
    const content = '# Deep Review Strategy\n\n## Topic\nx\n';
    const out = replaceAnchorSection(content, ANCHOR_ID, HEADING_TEXT, BODY, { createMissing: true });
    expect(out).toContain(`<!-- ANCHOR:${ANCHOR_ID} -->`);
    expect(out).toContain(BODY);
  });

  it('fails closed with a MISSING_ANCHOR code when the heading is absent and createMissing is not set', () => {
    const content = '# Deep Review Strategy\n\n## Topic\nx\n';
    let caught: (Error & { code?: string }) | null = null;
    try {
      replaceAnchorSection(content, ANCHOR_ID, HEADING_TEXT, BODY);
    } catch (error) {
      caught = error as Error & { code?: string };
    }
    expect(caught).not.toBeNull();
    expect(caught?.message).toMatch(/Missing machine-owned anchor/);
    expect(caught?.code).toBe('MISSING_ANCHOR');
  });
});
