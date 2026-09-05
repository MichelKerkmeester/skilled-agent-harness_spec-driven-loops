import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import {
  CATEGORY_SEVERITY,
  MAX_PHRASE_LENGTH,
  MAX_TRIGGER_LIST_MEMBERS,
  VARIANTS,
  analyzeAnchors,
  bodyPreimage,
  classifyDiff,
  classifyNaming,
  classifyVariant,
  declaredTriggerMembers,
  deduplicateTriggerPhrases,
  degradesFrontmatter,
  filterTriggerPhrases,
  insertTriggerDeclaration,
  isConformingAnchorId,
  judgeTriggerPhrase,
  missingCanonicalKeys,
  packetFolderTokens,
  planDocument,
  readAnchorMarker,
  rewriteAliasKey,
} from '../retrieval/lib/grep-convention.mjs';

// Four of these eight documents are deliberately unparseable. They are safe to
// name `.md` because the corpus walker prunes fixture directories outside
// `specs/`; without that rule the trigger index would read them and fail
// publication closed for the whole corpus.
const FIXTURE_DIR = fileURLToPath(new URL('../retrieval/fixtures/grep-convention/', import.meta.url));
const FIXTURE_REPO_DIR = '.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/grep-convention';

function fixture(label: string): { path: string; text: string } {
  const name = `${label}.md`;
  return {
    path: `${FIXTURE_REPO_DIR}/${name}`,
    text: fs.readFileSync(path.join(FIXTURE_DIR, name), 'utf8'),
  };
}

function doc(lines: string[]): string {
  return `${lines.join('\n')}\n`;
}

// ───────────────────────────────────────────────────────────────
// Variant taxonomy
// ───────────────────────────────────────────────────────────────

describe('variant classifier', () => {
  it('resolves each of the eight fixtures to its own label', () => {
    const observed = VARIANTS.map((label: string) => classifyVariant(fixture(label).text).variant);
    expect(observed).toEqual([...VARIANTS]);
  });

  it('covers every label exactly once, so the eight partition the corpus', () => {
    expect(new Set(VARIANTS).size).toBe(VARIANTS.length);
    expect(VARIANTS.length).toBe(8);
  });

  it('separates a document with no block from one whose block lacks the key', () => {
    expect(classifyVariant(fixture('missing').text).detail).toBe('no-frontmatter-block');
    const keyless = doc(['---', 'title: "Keyless"', 'contextType: "general"', '---', '', '# Keyless', '']);
    const classified = classifyVariant(keyless);
    expect(classified.variant).toBe('missing');
    expect(classified.detail).toBe('no-trigger-key');
  });

  it('labels a well-formed populated list conforming, sub-counted apart from an empty one', () => {
    expect(classifyVariant(fixture('valid-empty').text).detail).toBe('empty-list');
    const populated = doc(['---', 'trigger_phrases:', '  - "retrofit pipeline"', '---', '', '# Doc', '']);
    const classified = classifyVariant(populated);
    expect(classified.variant).toBe('valid-empty');
    expect(classified.detail).toBe('populated-list');
  });

  it('treats a list past the member ceiling as oversized rather than deduplicating it', () => {
    const members = Array.from({ length: MAX_TRIGGER_LIST_MEMBERS + 1 }, (_, i) => `  - "distinct phrase ${i}"`);
    const oversized = doc(['---', 'trigger_phrases:', ...members, '---', '', '# Doc', '']);
    expect(classifyVariant(oversized).variant).toBe('oversized');
    expect(classifyVariant(oversized).detail).toBe('oversized-list');

    const atCeiling = Array.from({ length: MAX_TRIGGER_LIST_MEMBERS }, (_, i) => `  - "distinct phrase ${i}"`);
    const allowed = doc(['---', 'trigger_phrases:', ...atCeiling, '---', '', '# Doc', '']);
    expect(classifyVariant(allowed).variant).toBe('valid-empty');
  });

  it('reads the declared members as written, before dedupe or normalization', () => {
    const declared = declaredTriggerMembers(fixture('duplicate').text);
    expect(declared.key).toBe('trigger_phrases');
    expect(declared.members.map((member: { raw: string }) => member.raw.trim()))
      .toEqual(['"spec kit retrieval"', '"Spec-Kit Retrieval"']);
  });
});

// ───────────────────────────────────────────────────────────────
// Per-variant handling
// ───────────────────────────────────────────────────────────────

describe('per-variant handlers', () => {
  it('leaves the malformed fixture byte-identical and reports exactly one row', () => {
    const { path: relativePath, text } = fixture('malformed-or-unclosed');
    const planned = planDocument({ relativePath, text });

    expect(planned.nextText).toBe(text);
    expect(planned.diagnostics).toHaveLength(1);
    expect(planned.diagnostics[0]).toMatchObject({
      category: 'malformed-or-unclosed',
      path: relativePath,
      severity: 'error',
    });
    expect(planned.diagnostics[0].line).toBeGreaterThan(0);
  });

  it.each(['non-yaml', 'wrong-list-type', 'non-string-members', 'oversized'])(
    'skips %s without rewriting a byte',
    (label) => {
      const { path: relativePath, text } = fixture(label);
      const planned = planDocument({ relativePath, text });
      expect(planned.nextText).toBe(text);
      expect(planned.actions).toContain('skipped');
      expect(planned.diagnostics.filter((row: { category: string }) => row.category === label)).toHaveLength(1);
    },
  );

  it('never truncates an oversized phrase', () => {
    const { path: relativePath, text } = fixture('oversized');
    const longest = text.split('\n').find((line) => line.trim().startsWith('- '))!;
    expect(longest.length).toBeGreaterThan(MAX_PHRASE_LENGTH);
    expect(planDocument({ relativePath, text }).nextText).toContain(longest);
  });

  it('accepts a valid empty list as conforming, with no diagnostic row', () => {
    const { path: relativePath, text } = fixture('valid-empty');
    const planned = planDocument({ relativePath, text });
    expect(planned.nextText).toBe(text);
    expect(planned.diagnostics).toHaveLength(0);
  });

  it('keeps the first duplicate in document order and reports every removal', () => {
    const source = doc([
      '---',
      'trigger_phrases:',
      '  - "spec kit retrieval"',
      '  - "Spec-Kit Retrieval"',
      "  - 'spec  kit  retrieval'",
      '  - "atomic processor rename"',
      '---',
      '',
      '# Doc',
      '',
    ]);
    const result = deduplicateTriggerPhrases(source);

    expect(result.removed).toHaveLength(2);
    expect(result.removed.map((entry: { normalized: string }) => entry.normalized))
      .toEqual(['spec kit retrieval', 'spec kit retrieval']);
    expect(result.text).toContain('  - "spec kit retrieval"');
    expect(result.text).not.toContain('Spec-Kit Retrieval');
    expect(result.text).toContain('  - "atomic processor rename"');
  });

  it('deduplicates a flow sequence inside the one line whose members changed', () => {
    const source = doc(['---', 'trigger_phrases: ["alpha beta", "Alpha-Beta", "gamma delta"]', '---', '', '# Doc', '']);
    const result = deduplicateTriggerPhrases(source);
    expect(result.removed).toHaveLength(1);
    expect(result.text).toContain('trigger_phrases: ["alpha beta", "gamma delta"]');
  });

  it('emits one duplicate row per removed member', () => {
    const { path: relativePath, text } = fixture('duplicate');
    const rows = planDocument({ relativePath, text })
      .diagnostics.filter((row: { category: string }) => row.category === 'duplicate');
    expect(rows).toHaveLength(1);
    expect(rows[0].rawKey).toBe('"Spec-Kit Retrieval"');
  });
});

// ───────────────────────────────────────────────────────────────
// Frontmatter creation and key preservation
// ───────────────────────────────────────────────────────────────

describe('frontmatter creation', () => {
  it('creates a block from the first heading and an empty list, never a fallback phrase', () => {
    const { text } = fixture('missing');
    const next = insertTriggerDeclaration(text, 'no-frontmatter-block');
    expect(next.startsWith('---\ntitle: "Missing Frontmatter Fixture"\ntrigger_phrases: []\n---\n')).toBe(true);
    expect(next).toContain('Body prose the retrofit never rewrites.');
  });

  it('reports the canonical keys it will not synthesize', () => {
    const { path: relativePath, text } = fixture('missing');
    const planned = planDocument({ relativePath, text });
    const reported = planned.diagnostics
      .filter((row: { rawKey: string | null }) => row.rawKey !== null)
      .map((row: { rawKey: string }) => row.rawKey)
      .sort();
    expect(reported).toEqual(['contextType', 'description', 'importance_tier']);
    expect(planned.nextText).not.toMatch(/^description:/m);
  });

  it('appends the key to an existing block without reordering or dropping anything', () => {
    const source = doc([
      '---',
      'title: "Keyless"',
      'importance_tier: "important"',
      '_memory:',
      '  continuity:',
      '    completion_pct: 0',
      '---',
      '',
      '# Keyless',
      '',
    ]);
    const next = insertTriggerDeclaration(source, 'no-trigger-key');
    const block = next.split('---')[1].trim().split('\n').map((line) => line.trim());

    expect(block[0]).toBe('title: "Keyless"');
    expect(block[1]).toBe('importance_tier: "important"');
    expect(block).toContain('_memory:');
    expect(block).toContain('completion_pct: 0');
    expect(block[block.length - 1]).toBe('trigger_phrases: []');
  });

  it('refuses to append a key into a block holding a single-line flow mapping', () => {
    // A flow mapping parses on its own and stops parsing the moment a block key
    // is appended beneath it, so the "insert the missing key" handler would turn
    // a readable declaration into an unreadable one. Both write gates are blind
    // to this: the edit is inside the frontmatter block, so the body preimage
    // holds and every changed line buckets as frontmatter.
    const source = doc(['---', '{"hubId":"sk-code","schemaVersion":"V1"}', '---', '', '# Policy Card', '']);
    expect(classifyVariant(source).variant).toBe('missing');
    expect(classifyVariant(source).detail).toBe('no-trigger-key');

    const naive = insertTriggerDeclaration(source, 'no-trigger-key');
    expect(classifyVariant(naive).variant).toBe('non-yaml');
    expect(degradesFrontmatter(source, naive)).toEqual({ from: 'missing', to: 'non-yaml' });
    expect(bodyPreimage(naive).digest).toBe(bodyPreimage(source).digest);
    expect(classifyDiff(source, naive).counts.other).toBe(0);

    const planned = planDocument({ relativePath: `${FIXTURE_REPO_DIR}/policy-card.md`, text: source });
    expect(planned.nextText).toBe(source);
    expect(planned.actions).toContain('refused-unsafe-edit');
    expect(planned.diagnostics.some((row: { reason: string }) => /edit refused/.test(row.reason))).toBe(true);
  });

  it('refuses to start a block on a canonical document it cannot finish', () => {
    // A block holding only a title and an empty list fails the frontmatter
    // contract's required scalars, where an absent block is a continuity
    // warning. Half a block is a worse validation state than none, and the
    // scalars it lacks are an author's to write, not this tool's to invent.
    const body = doc(['# Feature Specification', '', 'Prose the retrofit never rewrites.', '']);

    for (const basename of ['spec.md', 'plan.md', 'tasks.md', 'decision-record.md', 'implementation-summary.md']) {
      const planned = planDocument({ relativePath: `specs/track/001-packet/${basename}`, text: body });
      expect(planned.nextText, basename).toBe(body);
      expect(planned.actions, basename).toContain('refused-partial-canonical-block');
      expect(planned.diagnostics.some((row: { reason: string }) => /needs an authored frontmatter block/.test(row.reason)), basename).toBe(true);
    }
  });

  it('still creates a block on a non-canonical document', () => {
    const body = doc(['# Research Note', '', 'Prose.', '']);
    const planned = planDocument({ relativePath: 'specs/track/001-packet/research/research.md', text: body });
    expect(planned.nextText).not.toBe(body);
    expect(planned.actions).toContain('inserted-frontmatter-block');
  });

  it('still adds the missing key when a canonical document already has a block', () => {
    // Those documents already carry the other scalars, so completing the block
    // moves them toward the contract instead of half-starting one.
    const source = doc(['---', 'title: "Spec"', 'description: "A spec."', 'importance_tier: "normal"', 'contextType: "general"', '---', '', '# Spec', '']);
    const planned = planDocument({ relativePath: 'specs/track/001-packet/spec.md', text: source });
    expect(planned.actions).toContain('inserted-trigger-key');
    expect(planned.nextText).toContain('trigger_phrases: []');
    expect(bodyPreimage(planned.nextText).digest).toBe(bodyPreimage(source).digest);
  });

  it('reports no degradation for an edit that leaves the block parseable', () => {
    const source = doc(['---', 'title: "Doc"', '---', '', '# Doc', '']);
    const next = insertTriggerDeclaration(source, 'no-trigger-key');
    expect(classifyVariant(next).variant).toBe('valid-empty');
    expect(degradesFrontmatter(source, next)).toBeNull();
  });

  it('rewrites only the alias key line and preserves the members verbatim', () => {
    const source = doc(['---', 'title: "Aliased"', 'triggerPhrases:', "  - 'unquoted style kept'", '---', '', '# Doc', '']);
    const next = rewriteAliasKey(source);
    expect(next).toContain('trigger_phrases:');
    expect(next).not.toContain('triggerPhrases');
    expect(next).toContain("  - 'unquoted style kept'");
    expect(next).toContain('title: "Aliased"');
  });

  it('reports every canonical key a block does not declare', () => {
    expect(missingCanonicalKeys(fixture('valid-empty').text)).toEqual([]);
    expect(missingCanonicalKeys(doc(['---', 'title: "T"', '---', '']))).toEqual([
      'contextType', 'description', 'importance_tier', 'trigger_phrases',
    ]);
  });
});

// ───────────────────────────────────────────────────────────────
// Anchor grammar
// ───────────────────────────────────────────────────────────────

describe('anchor parser', () => {
  it('reads a marker only when it is the whole line', () => {
    expect(readAnchorMarker('<!-- ANCHOR:scope -->')).toEqual({ id: 'scope', kind: 'open' });
    expect(readAnchorMarker('  <!-- /ANCHOR:scope -->  ')).toEqual({ id: 'scope', kind: 'close' });
    expect(readAnchorMarker('prose <!-- ANCHOR:scope --> more prose')).toBeNull();
    expect(readAnchorMarker('`<!-- ANCHOR:scope -->`')).toBeNull();
  });

  it('accepts lower-kebab ids and the typed-id exception, and nothing else', () => {
    expect(isConformingAnchorId('phase-context')).toBe(true);
    expect(isConformingAnchorId('adr-001')).toBe(true);
    expect(isConformingAnchorId('DECISION-pipeline-003')).toBe(true);
    expect(isConformingAnchorId('AC2-closure-gate')).toBe(true);
    expect(isConformingAnchorId('Phase_Context')).toBe(false);
    expect(isConformingAnchorId('phaseContext')).toBe(false);
  });

  it('reports an unmatched opener, an orphan closer and a duplicated id without repairing them', () => {
    const source = doc([
      '---', 'trigger_phrases: []', '---',
      '<!-- ANCHOR:one -->', 'body', '<!-- /ANCHOR:one -->',
      '<!-- ANCHOR:one -->', 'body', '<!-- /ANCHOR:one -->',
      '<!-- /ANCHOR:orphan -->',
      '<!-- ANCHOR:never-closed -->', 'body',
    ]);
    const anchors = analyzeAnchors(source);

    expect(anchors.duplicates.map((entry: { id: string }) => entry.id)).toEqual(['one']);
    expect(anchors.unmatched.map((entry: { id: string }) => entry.id)).toEqual(['orphan', 'never-closed']);
    expect(source).toBe(source);
  });

  it('does not read a marker quoted inside a fenced example as a real marker', () => {
    const source = doc([
      '---', 'trigger_phrases: []', '---',
      'The grammar is:', '', '```text', '<!-- ANCHOR:section-id -->', '<!-- /ANCHOR:section-id -->', '```', '',
    ]);
    expect(analyzeAnchors(source).markers).toHaveLength(0);
    expect(analyzeAnchors(source).unmatched).toHaveLength(0);
  });
});

// ───────────────────────────────────────────────────────────────
// Body preimage
// ───────────────────────────────────────────────────────────────

describe('body preimage hasher', () => {
  const body = ['# Title', '', 'Prose that must not move.', '', 'More prose.', ''];

  it('is unchanged by inserting a frontmatter block in front of a document that had none', () => {
    const before = doc(body);
    const after = insertTriggerDeclaration(before, 'no-frontmatter-block');
    expect(bodyPreimage(after).digest).toBe(bodyPreimage(before).digest);
  });

  it('is unchanged by adding or removing a whole-line anchor marker', () => {
    const before = doc(['---', 'trigger_phrases: []', '---', ...body]);
    const after = doc(['---', 'trigger_phrases: []', '---', '<!-- ANCHOR:intro -->', ...body, '<!-- /ANCHOR:intro -->']);
    expect(bodyPreimage(after).digest).toBe(bodyPreimage(before).digest);
    expect(bodyPreimage(after).removedMarkerLines).toHaveLength(2);
  });

  it('is unchanged by any edit inside the frontmatter block', () => {
    const before = doc(['---', 'triggerPhrases:', '  - "alpha beta"', '---', ...body]);
    expect(bodyPreimage(rewriteAliasKey(before)).digest).toBe(bodyPreimage(before).digest);
  });

  it('changes when a single body character changes', () => {
    const before = doc(['---', 'trigger_phrases: []', '---', ...body]);
    const after = before.replace('More prose.', 'More prose!');
    expect(bodyPreimage(after).digest).not.toBe(bodyPreimage(before).digest);
  });

  it('changes when a trailing newline is dropped, so terminators stay protected', () => {
    const before = doc(['---', 'trigger_phrases: []', '---', ...body]);
    expect(bodyPreimage(before.trimEnd()).digest).not.toBe(bodyPreimage(before).digest);
  });

  it('protects a marker-shaped line that sits inside a fenced example', () => {
    const withFence = doc([
      '---', 'trigger_phrases: []', '---',
      '```text', '<!-- ANCHOR:section-id -->', '```', '',
    ]);
    const damaged = withFence.replace('<!-- ANCHOR:section-id -->', '<!-- ANCHOR:renamed-id -->');
    expect(bodyPreimage(damaged).digest).not.toBe(bodyPreimage(withFence).digest);
  });
});

// ───────────────────────────────────────────────────────────────
// Trigger allowlist
// ───────────────────────────────────────────────────────────────

describe('trigger allowlist filter', () => {
  it('rejects every generic workflow word the convention names', () => {
    for (const word of ['session', 'context', 'memory', 'summary', 'feature', 'update', 'file', 'document', 'section']) {
      expect(judgeTriggerPhrase(word), word).not.toBeNull();
    }
    for (const word of ['memory', 'summary', 'feature', 'update', 'file', 'document', 'section']) {
      expect(judgeTriggerPhrase(word)?.negativeClass, word).toBe('generic-workflow-word');
    }
  });

  it('rejects a phrase whose every token is a stop word', () => {
    expect(judgeTriggerPhrase('the and of')?.negativeClass).toBe('stop-word-only');
  });

  it('rejects a whole prose sentence', () => {
    expect(judgeTriggerPhrase('This is a sentence about retrieval.')?.negativeClass).toBe('prose-sentence');
    expect(judgeTriggerPhrase('one two three four five six seven eight nine ten eleven')?.negativeClass)
      .toBe('prose-sentence');
  });

  it('admits distinctive domain phrases', () => {
    for (const phrase of ['worktree', 'grep convention', 'normalizeTriggerText', 'anchor-unmatched', 'exit 2 on config error']) {
      expect(judgeTriggerPhrase(phrase)).toBeNull();
    }
  });

  it('names the editor fallback that produced a session or context phrase', () => {
    for (const word of ['session', 'context']) {
      const verdict = judgeTriggerPhrase(word)!;
      expect(verdict.negativeClass).toBe('editor-fallback');
      expect(verdict.reason).toMatch(/ensureMinTriggerPhrases/);
    }
  });

  it('names the folder-token fallback shape without claiming to know the phrase came from it', () => {
    const folderTokens = packetFolderTokens('specs/sk-git/004-worktree-naming/spec.md');
    expect(folderTokens).toEqual(['worktree', 'naming']);

    const verdict = judgeTriggerPhrase('worktree', { folderTokens })!;
    expect(verdict.negativeClass).toBe('folder-token-fallback');
    expect(verdict.reason).toMatch(/shape the frontmatter editor/);
    expect(judgeTriggerPhrase('worktree naming grammar', { folderTokens })).toBeNull();
  });

  it('partitions a list into what may be written and what is only reported', () => {
    const filtered = filterTriggerPhrases([
      { line: 4, raw: 'grep convention' },
      { line: 5, raw: 'session' },
    ]);
    expect(filtered.accepted.map((entry: { raw: string }) => entry.raw)).toEqual(['grep convention']);
    expect(filtered.rejected).toHaveLength(1);
    expect(filtered.rejected[0].line).toBe(5);
  });

  it('reports a fallback phrase without deleting or rewriting it', () => {
    const source = doc(['---', 'trigger_phrases:', '  - "session"', '---', '', '# Doc', '']);
    const planned = planDocument({ relativePath: `${FIXTURE_REPO_DIR}/inline.md`, text: source });

    expect(planned.nextText).toBe(source);
    const rows = planned.diagnostics.filter((row: { category: string }) => row.category === 'generic-trigger');
    expect(rows).toHaveLength(1);
    expect(rows[0].severity).toBe('warn');
    expect(rows[0].reason).toMatch(/ensureMinTriggerPhrases/);
    expect(rows[0].reason).toMatch(/never adopted as index input/);
  });
});

// ───────────────────────────────────────────────────────────────
// Naming grammar
// ───────────────────────────────────────────────────────────────

describe('naming grammar', () => {
  it('passes a conforming packet path', () => {
    expect(classifyNaming('specs/system-speckit/049-memory-decommission/spec.md')).toEqual([]);
  });

  it('reports a directory that claims to be a packet but breaks the grammar', () => {
    const reported = classifyNaming('specs/track/01-two-digit/spec.md');
    expect(reported).toHaveLength(1);
    expect(reported[0].segment).toBe('01-two-digit');
  });

  it('reports an uppercase basename and leaves ordinary directory names alone', () => {
    const reported = classifyNaming('specs/track/001-packet/research/BRIEFING.md');
    expect(reported.map((entry: { segment: string }) => entry.segment)).toEqual(['BRIEFING.md']);
  });
});

// ───────────────────────────────────────────────────────────────
// Diff classifier
// ───────────────────────────────────────────────────────────────

describe('diff classifier', () => {
  const body = ['# Title', '', 'Prose that must not move.', ''];

  it('buckets a frontmatter-only edit with nothing in the other bucket', () => {
    const before = doc(['---', 'triggerPhrases:', '  - "alpha beta"', '---', ...body]);
    const counts = classifyDiff(before, rewriteAliasKey(before)).counts;
    expect(counts).toEqual({ anchorMarker: 0, frontmatter: 2, other: 0 });
  });

  it('buckets an inserted block as frontmatter', () => {
    const before = doc(body);
    const counts = classifyDiff(before, insertTriggerDeclaration(before, 'no-frontmatter-block')).counts;
    expect(counts.other).toBe(0);
    expect(counts.frontmatter).toBeGreaterThan(0);
  });

  it('buckets a whole-line marker insertion as a marker', () => {
    const before = doc(['---', 'trigger_phrases: []', '---', ...body]);
    const after = doc(['---', 'trigger_phrases: []', '---', '<!-- ANCHOR:intro -->', ...body, '<!-- /ANCHOR:intro -->']);
    const counts = classifyDiff(before, after).counts;
    expect(counts.other).toBe(0);
    expect(counts.anchorMarker).toBe(2);
  });

  it('puts a body edit in the other bucket, which is what fails the diff rule', () => {
    const before = doc(['---', 'trigger_phrases: []', '---', ...body]);
    const after = before.replace('Prose that must not move.', 'Prose that moved.');
    const result = classifyDiff(before, after);
    expect(result.counts.other).toBeGreaterThan(0);
    expect(result.changed.some((change: { bucket: string }) => change.bucket === 'other')).toBe(true);
  });

  it('puts a marker inserted mid-paragraph in the other bucket', () => {
    const before = doc(['---', 'trigger_phrases: []', '---', ...body]);
    const after = before.replace('Prose that must not move.', 'Prose <!-- ANCHOR:sneak --> that must not move.');
    expect(classifyDiff(before, after).counts.other).toBeGreaterThan(0);
  });

  it('reports no change when nothing changed', () => {
    const before = doc(['---', 'trigger_phrases: []', '---', ...body]);
    expect(classifyDiff(before, before)).toEqual({ changed: [], counts: { anchorMarker: 0, frontmatter: 0, other: 0 } });
  });
});

// ───────────────────────────────────────────────────────────────
// Severity and idempotence
// ───────────────────────────────────────────────────────────────

describe('diagnostics severity', () => {
  it('marks the seven non-conforming variants and the preimage mismatch an error', () => {
    for (const variant of VARIANTS) {
      if (variant === 'valid-empty') continue;
      expect(CATEGORY_SEVERITY[variant], variant).toBe('error');
    }
    expect(CATEGORY_SEVERITY['preimage-mismatch']).toBe('error');
  });

  it('marks every class a human still has to weigh a warning', () => {
    for (const category of ['generic-trigger', 'anchor-unmatched', 'anchor-duplicate', 'alias-hit', 'naming-exception']) {
      expect(CATEGORY_SEVERITY[category], category).toBe('warn');
    }
  });

  it('emits no row at all for the conforming variant', () => {
    expect(CATEGORY_SEVERITY['valid-empty']).toBeUndefined();
  });

  it('reads severity from the table rather than from the caller', () => {
    const { path: relativePath, text } = fixture('duplicate');
    for (const row of planDocument({ relativePath, text }).diagnostics) {
      expect(row.severity).toBe(CATEGORY_SEVERITY[row.category]);
    }
  });
});

describe('idempotence', () => {
  it.each([...VARIANTS])('re-planning a processed %s document changes nothing further', (label) => {
    const { path: relativePath, text } = fixture(label);
    const once = planDocument({ relativePath, text }).nextText;
    const twice = planDocument({ relativePath, text: once }).nextText;
    expect(twice).toBe(once);
  });

  it('preserves the body preimage across every fixture that the handlers rewrite', () => {
    for (const label of VARIANTS) {
      const { path: relativePath, text } = fixture(label);
      const next = planDocument({ relativePath, text }).nextText;
      expect(bodyPreimage(next).digest, label).toBe(bodyPreimage(text).digest);
      expect(classifyDiff(text, next).counts.other, label).toBe(0);
    }
  });
});
