import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { CORPUS_ROOTS, EXCLUDED_DIR_NAMES, FIXTURE_DIR_PATTERN, isExcludedDirectory } from '../retrieval/lib/corpus.mjs';
import { DEFAULT_ROOTS, GLOBS } from '../retrieval/lib/rg-lane.mjs';
import {
  EXCLUDED_DIR_NAMES as RETROFIT_EXCLUDED_DIR_NAMES,
  NOT_PRUNED_DELTA as RETROFIT_NOT_PRUNED_DELTA,
} from '../retrieval/retrofit-convention.mjs';
import {
  EXCLUDE_GLOBS as SWEEP_EXCLUDE_GLOBS,
  GLOB_DELTA as SWEEP_GLOB_DELTA,
} from '../retrieval/sweep-memory-residue.mjs';

// ───────────────────────────────────────────────────────────────
// The two-lane divergence table
// ───────────────────────────────────────────────────────────────
// This is the single source of truth this test enforces. It must match
// Section 9 of references/retrieval/retrieval-conventions.md exactly: a
// change to either side that is not mirrored in the other, or not recorded
// here with a reason, fails one of the assertions below rather than drifting
// in silently.

const CONVENTIONS_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  'references',
  'retrieval',
  'retrieval-conventions.md',
);

/** Directory names pruned unconditionally by both lanes, wherever they appear. */
const SHARED_UNIVERSAL_EXCLUSIONS = Object.freeze(['.git', 'node_modules', 'scratch', 'z_archive']);

/**
 * Every directory-name exclusion the trigger index applies unconditionally.
 * Read directly off corpus.mjs's real policy set (not a hand-copied guess),
 * so a name added there without an update here fails loudly by set diff.
 */
const TRIGGER_INDEX_UNIVERSAL_EXCLUSIONS = Array.from(EXCLUDED_DIR_NAMES).sort();

/** The negative `--glob '!**\/<name>/**'` directory names ripgrep's lane excludes. */
function ripgrepUniversalExclusions(globs: readonly string[]): string[] {
  const names: string[] = [];
  for (const value of globs) {
    const match = /^!\*\*\/(.+)\/\*\*$/.exec(value);
    if (match) names.push(match[1]);
  }
  return names.sort();
}

/**
 * Conditionally-scoped divergences: exclusions that are not a flat directory
 * name in either lane's universal set, so they need their own probe. Each
 * entry names the reason the two lanes are allowed to disagree, so this array
 * doubles as the divergence table's exclusion half.
 */
const SCOPED_DIVERGENCES: ReadonlyArray<{
  name: string;
  ripgrepExcludes: boolean;
  reason: string;
  triggerIndexExcludes: boolean;
}> = Object.freeze([
  {
    name: 'research/lineages (directly under a research parent)',
    reason:
      'the trigger index protects its curated phrase index from unauthored transcript noise; '
      + 'ripgrep is a raw evidence lane with no ranking to protect and must still reach lineage evidence',
    ripgrepExcludes: false,
    triggerIndexExcludes: true,
  },
  {
    name: 'fixtures / __fixtures__ / test-fixtures / *-fixtures directories outside specs/',
    reason:
      "the trigger index's exemption is scoped to outside specs/ to protect real spec documents that live "
      + "under packet directories named for fixtures; ripgrep has no equivalent scoping and an unscoped "
      + 'exclusion would regress that real content',
    ripgrepExcludes: false,
    triggerIndexExcludes: true,
  },
]);

// ───────────────────────────────────────────────────────────────
// Root coverage
// ───────────────────────────────────────────────────────────────

describe('root coverage parity', () => {
  it('walks the roots the coverage decision names, in both lanes', () => {
    expect(Array.from(CORPUS_ROOTS)).toEqual(['specs', '.opencode/skills', '.opencode/install-guides']);
    expect(Array.from(DEFAULT_ROOTS)).toEqual(['specs', '.opencode']);
  });

  it('keeps every trigger-index root reachable under a ripgrep root', () => {
    // Every trigger-index root must sit under one of ripgrep's broader roots,
    // so the trigger index's coverage is always a subset of ripgrep's - the
    // asymmetry runs one way by design (Section 9, root coverage table).
    for (const triggerRoot of CORPUS_ROOTS) {
      const covered = DEFAULT_ROOTS.some(
        (rgRoot) => triggerRoot === rgRoot || triggerRoot.startsWith(`${rgRoot}/`),
      );
      expect(covered, `trigger-index root "${triggerRoot}" is not reachable under any ripgrep root`).toBe(true);
    }
  });

  it('keeps root README.md and the five runtime mirrors out of both lanes', () => {
    const decidedOut = ['README.md', '.claude', '.codex', '.cursor', '.devin', '.pi'];
    for (const entry of decidedOut) {
      expect(CORPUS_ROOTS, `${entry} must not join the trigger-index roots`).not.toContain(entry);
      expect(DEFAULT_ROOTS, `${entry} must not join the ripgrep roots`).not.toContain(entry);
    }
  });
});

// ───────────────────────────────────────────────────────────────
// Exclusion coverage
// ───────────────────────────────────────────────────────────────

describe('exclusion coverage parity', () => {
  it('agrees on every universally-excluded directory name', () => {
    // corpus.mjs's real exclusion set must be exactly the shared table below -
    // an addition or removal on either side without updating this test is the
    // undocumented divergence this suite exists to catch.
    expect(TRIGGER_INDEX_UNIVERSAL_EXCLUSIONS).toEqual([...SHARED_UNIVERSAL_EXCLUSIONS].sort());
    expect(ripgrepUniversalExclusions(GLOBS)).toEqual([...SHARED_UNIVERSAL_EXCLUSIONS].sort());
  });

  it('excludes each shared universal name in both lanes identically', () => {
    for (const name of SHARED_UNIVERSAL_EXCLUSIONS) {
      const triggerExcludes = EXCLUDED_DIR_NAMES.has(name);
      const ripgrepExcludes = ripgrepUniversalExclusions(GLOBS).includes(name);
      expect(triggerExcludes, `trigger index does not exclude "${name}"`).toBe(true);
      expect(ripgrepExcludes, `ripgrep does not exclude "${name}"`).toBe(true);
    }
  });

  it('keeps the two named scoped divergences exactly as documented, no more and no fewer', () => {
    // research/lineages: excluded by the trigger index only under a research parent.
    expect(isExcludedDirectory('lineages', 'research', 'track/research/lineages')).toBe(true);
    expect(isExcludedDirectory('lineages', 'not-research', 'track/not-research/lineages')).toBe(false);

    // fixture-named directories: excluded by the trigger index only outside specs/.
    expect(FIXTURE_DIR_PATTERN.test('fixtures')).toBe(true);
    expect(isExcludedDirectory('fixtures', 'x', 'other/track/fixtures')).toBe(true);
    expect(isExcludedDirectory('fixtures', 'x', 'specs/track/fixtures')).toBe(false);

    // Neither scoped exclusion is a flat directory name ripgrep's glob set
    // negates - that is exactly the divergence SCOPED_DIVERGENCES records.
    const ripgrepFlatNames = ripgrepUniversalExclusions(GLOBS);
    expect(ripgrepFlatNames, 'ripgrep must not have converged the research/lineages divergence silently')
      .not.toContain('research/lineages');
    expect(ripgrepFlatNames, 'ripgrep must not have converged the fixtures divergence silently')
      .not.toContain('fixtures');

    for (const entry of SCOPED_DIVERGENCES) {
      expect(entry.triggerIndexExcludes, entry.name).toBe(true);
      expect(entry.ripgrepExcludes, entry.name).toBe(false);
      expect(entry.reason.length, `${entry.name} must carry a reason`).toBeGreaterThan(0);
    }
  });
});

// ───────────────────────────────────────────────────────────────
// Doc-versus-code parity: the documented recipes must copy the code exactly
// ───────────────────────────────────────────────────────────────

describe('retrieval-conventions.md glob parity', () => {
  /**
   * Section 2 only. Section 3's worked example deliberately narrows the
   * positional scope to one packet and drops the exclusion globs to keep the
   * example short - it is not a fifth copy of the Section 2 recipe and must
   * not be compared against GLOBS.
   */
  function section2Text(markdown: string): string {
    const start = markdown.indexOf('## 2. THE RECIPES');
    const end = markdown.indexOf('## 3. SCOPING BY TRACK AND PACKET');
    expect(start, 'Section 2 heading must exist').toBeGreaterThanOrEqual(0);
    expect(end, 'Section 3 heading must exist').toBeGreaterThan(start);
    return markdown.slice(start, end);
  }

  function extractDocGlobBlocks(markdown: string): string[][] {
    const blocks = markdown.match(/```text\nrg --no-config[\s\S]*?\n```/g) ?? [];
    return blocks.map((block) => Array.from(block.matchAll(/--glob '([^']+)'/g), (m) => m[1]));
  }

  it('carries a Section 2 recipe for every code path', () => {
    expect(fs.existsSync(CONVENTIONS_PATH)).toBe(true);
    const markdown = fs.readFileSync(CONVENTIONS_PATH, 'utf8');
    const blocks = extractDocGlobBlocks(section2Text(markdown));
    expect(blocks.length).toBeGreaterThan(0);

    const codeGlobs = GLOBS.filter((_, index) => GLOBS[index - 1] === '--glob');
    for (const [blockIndex, docGlobs] of blocks.entries()) {
      expect(docGlobs, `documented recipe #${blockIndex + 1} must copy the code's glob list verbatim`)
        .toEqual(codeGlobs);
    }
  });
});

// ───────────────────────────────────────────────────────────────
// Two more consumers of the shared corpus policy: the grep-convention
// retrofit pipeline and the memory-residue sweep. Each imports the real
// EXCLUDED_DIR_NAMES set rather than keeping its own hand-copied list, and
// declares every place its effective exclusions differ from that set as a
// named, reasoned delta. These tests read the real deltas off each module
// (not a hand-copied guess) and rebuild the expected effective set from
// nothing but the shared table plus the declared deltas, so an undeclared
// drift on either side fails here instead of surfacing as a silent behavior
// change in the pipeline or the sweep.
// ───────────────────────────────────────────────────────────────

describe('retrofit-convention.mjs exclusion parity', () => {
  it('derives its effective exclusion set from the shared table minus its declared delta, and nothing else', () => {
    const expected = [...EXCLUDED_DIR_NAMES]
      .filter((name) => !RETROFIT_NOT_PRUNED_DELTA.some((entry) => entry.name === name))
      .sort();
    expect([...RETROFIT_EXCLUDED_DIR_NAMES].sort()).toEqual(expected);
  });

  it('carries a reason for every delta entry, and only subtracts names the shared table actually has', () => {
    for (const entry of RETROFIT_NOT_PRUNED_DELTA) {
      expect(entry.reason.length, `delta entry "${entry.name}" must carry a reason`).toBeGreaterThan(0);
      expect(EXCLUDED_DIR_NAMES.has(entry.name), `delta entry "${entry.name}" is not in the shared table it claims to subtract from`).toBe(true);
    }
  });

  it('still does not exclude a research/lineages directory, the corpus compound rule this pipeline never adopted', () => {
    // Not a flat name, so it cannot appear in NOT_PRUNED_DELTA - the pipeline
    // simply never calls the corpus's compound name+parent check at all.
    expect(RETROFIT_EXCLUDED_DIR_NAMES.has('lineages')).toBe(false);
    expect(isExcludedDirectory('lineages', 'research', 'specs/track/research/lineages')).toBe(true);
  });
});

describe('sweep-memory-residue.mjs exclusion parity', () => {
  it('derives its "anywhere" globs from the shared table minus the names its delta re-scopes, and nothing else', () => {
    const deltaGlobs = SWEEP_GLOB_DELTA.map((entry) => entry.glob);
    const rescopedNames = SWEEP_GLOB_DELTA
      .map((entry) => /^!(?:\*\*\/)?([^/]+)\/\*\*$/.exec(entry.glob)?.[1])
      .filter((name): name is string => Boolean(name) && EXCLUDED_DIR_NAMES.has(name as string));
    const expectedAnywhere = [...EXCLUDED_DIR_NAMES]
      .filter((name) => !rescopedNames.includes(name))
      .sort()
      .map((name) => `!**/${name}/**`);

    expect([...SWEEP_EXCLUDE_GLOBS].sort()).toEqual([...expectedAnywhere, ...deltaGlobs].sort());
  });

  it('carries a reason for every delta entry', () => {
    for (const entry of SWEEP_GLOB_DELTA) {
      expect(entry.reason.length, `delta entry "${entry.glob}" must carry a reason`).toBeGreaterThan(0);
    }
  });

  it('re-scopes .git to root-only rather than dropping it, and adds .worktrees with no counterpart in the shared table', () => {
    const globs = SWEEP_GLOB_DELTA.map((entry) => entry.glob);
    expect(globs).toContain('!.git/**');
    expect(globs).not.toContain('!**/.git/**');
    expect(globs).toContain('!.worktrees/**');
    expect(EXCLUDED_DIR_NAMES.has('.worktrees')).toBe(false);
  });

  it('still excludes research/lineages, converging with the corpus for the same reason', () => {
    expect(SWEEP_EXCLUDE_GLOBS).toContain('!**/research/lineages/**');
  });

  it('does not adopt the corpus fixture-directory exclusion - residue must still be reachable inside a fixture tree', () => {
    expect(SWEEP_EXCLUDE_GLOBS.some((glob) => /fixture/i.test(glob))).toBe(false);
    expect(FIXTURE_DIR_PATTERN.test('fixtures')).toBe(true);
  });
});
