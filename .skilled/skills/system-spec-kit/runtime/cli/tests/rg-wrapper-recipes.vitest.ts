// ───────────────────────────────────────────────────────────────────
// MODULE: RG Wrapper Recipes Tests
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { stableStringify } from '../retrieval/lib/artifact.mjs';
import { shapeRankedMatches } from '../retrieval/lib/rg-lane.mjs';
import {
  DEFAULT_SEARCH_ROOTS,
  EXIT_ERROR_FLOOR,
  EXIT_MATCH,
  EXIT_NO_MATCH,
  RECIPES,
  assertRecipeParity,
  countRecipe,
  formatSummary,
  parseArgs,
  RECIPE_BUILDERS,
  pathRecipe,
  search,
  structuredRecipe,
  searchRootsFor,
} from '../retrieval/rg-wrapper.mjs';

const tempRoots = new Set<string>();

afterEach(() => {
  for (const dir of tempRoots) fs.rmSync(dir, { force: true, recursive: true });
  tempRoots.clear();
});

function makeCorpus(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rg-wrapper-'));
  tempRoots.add(dir);

  write(dir, 'specs/track/001-packet/spec.md', [
    '---',
    'title: "Packet"',
    'trigger_phrases:',
    '  - "declared only in frontmatter"',
    '---',
    '',
    '<!-- ANCHOR:scope -->',
    '## Scope',
    '',
    '<!-- /ANCHOR:scope -->',
    '',
  ]);
  write(dir, 'specs/track/001-packet/body.md', ['A phrase that exists only in prose.', '']);
  write(dir, 'specs/track/001-packet/z_archive/old.md', ['archived only phrase', '']);
  write(dir, 'specs/track/001-packet/node_modules/vendor.md', ['vendored only phrase', '']);
  write(dir, 'specs/track/001-packet/scratch/draft.md', ['scratch only phrase', '']);
  return dir;
}

function makeFloodCorpus(fileCount: number, matchesPerFile: number): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rg-wrapper-flood-'));
  tempRoots.add(dir);

  for (let fileIndex = 0; fileIndex < fileCount; fileIndex += 1) {
    const lines = Array.from({ length: matchesPerFile }, () => `flood marker ${fileIndex}`);
    write(dir, `specs/track/001-packet/file-${String(fileIndex).padStart(2, '0')}.md`, lines);
  }

  return dir;
}

function write(root: string, relativePath: string, lines: string[]): void {
  const absolute = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${lines.join('\n')}\n`, 'utf8');
}

function rankedRow(filePath: string, line: number) {
  return {
    evidenceField: 'body' as const,
    line,
    matchClass: 'exact' as const,
    packetPath: 'specs/track/001-packet',
    path: filePath,
    text: `match ${line}`,
  };
}

// ───────────────────────────────────────────────────────────────────
// Recipe shape
// ───────────────────────────────────────────────────────────────────

describe('recipe builders', () => {
  it('spells the structured recipe exactly as the convention writes it', () => {
    expect(structuredRecipe('phrase', ['specs', '.skilled'])).toEqual([
      '--no-config', '--hidden', '--json', '--fixed-strings', '--ignore-case',
      '--glob', '*.md', '--glob', '!**/z_archive/**', '--glob', '!**/node_modules/**', '--glob', '!**/.git/**', '--glob', '!**/scratch/**',
      '--', 'phrase', 'specs', '.skilled',
    ]);
  });

  it('spells the path recipe exactly as the convention writes it', () => {
    expect(pathRecipe('phrase', ['specs', '.skilled'])).toEqual([
      '--no-config', '--hidden', '--fixed-strings', '--ignore-case',
      '--files-with-matches', '--max-count', '1',
      '--glob', '*.md', '--glob', '!**/z_archive/**', '--glob', '!**/node_modules/**', '--glob', '!**/.git/**', '--glob', '!**/scratch/**',
      '--', 'phrase', 'specs', '.skilled',
    ]);
  });

  it('spells the count recipe exactly as the convention writes it', () => {
    expect(countRecipe('phrase', ['specs', '.skilled'])).toEqual([
      '--no-config', '--hidden', '--fixed-strings', '--ignore-case', '--count',
      '--glob', '*.md', '--glob', '!**/z_archive/**', '--glob', '!**/node_modules/**', '--glob', '!**/.git/**', '--glob', '!**/scratch/**',
      '--', 'phrase', 'specs', '.skilled',
    ]);
  });

  it('never combines an output mode with another', () => {
    const exclusive = ['--json', '--files-with-matches', '--count', '--count-matches', '--files'];
    for (const recipe of RECIPES) {
      const argv = recipe === 'structured'
        ? structuredRecipe('phrase')
        : recipe === 'path' ? pathRecipe('phrase') : countRecipe('phrase');
      expect(argv.filter((arg: string) => exclusive.includes(arg))).toHaveLength(1);
    }
  });

  it('passes --no-config on every recipe, so ambient configuration cannot filter a result', () => {
    expect(structuredRecipe('p')).toContain('--no-config');
    expect(pathRecipe('p')).toContain('--no-config');
    expect(countRecipe('p')).toContain('--no-config');
  });

  it('keeps a phrase that opens with a hyphen out of the flag position', () => {
    const argv = pathRecipe('--not-a-flag');
    expect(argv[argv.indexOf('--not-a-flag') - 1]).toBe('--');
  });

  it('carries the same flag set as the shared retrieval lane', () => {
    expect(assertRecipeParity('phrase', DEFAULT_SEARCH_ROOTS)).toEqual([]);
    for (const recipe of Object.values(RECIPE_BUILDERS)) {
      const argv = recipe('phrase', DEFAULT_SEARCH_ROOTS);
      expect(argv).toContain('--hidden');
      expect(argv).toContain('!**/.git/**');
    }
  });
});

// ───────────────────────────────────────────────────────────────────
// Exit mapping
// ───────────────────────────────────────────────────────────────────

describe('exit mapping', () => {
  it('maps a match to exit 0 on every recipe', () => {
    const cwd = makeCorpus();
    for (const recipe of RECIPES) {
      const record = search(recipe, 'declared only in frontmatter', { cwd, roots: ['specs'] });
      expect(record.exitCode, recipe).toBe(EXIT_MATCH);
      expect(record.outcome, recipe).toBe('match');
    }
  });

  it('maps a clean miss to exit 1 and a valid empty result, never an error', () => {
    const cwd = makeCorpus();
    const record = search('path', 'a phrase no document declares', { cwd, roots: ['specs'] });
    expect(record.exitCode).toBe(EXIT_NO_MATCH);
    expect(record.outcome).toBe('no-match');
    expect(record.paths).toEqual([]);
    expect(record.stderr).toBe('');
  });

  it('maps a bad invocation to exit 2 and surfaces the stderr text', () => {
    const cwd = makeCorpus();
    const record = search('path', 'anything', { cwd, roots: ['no-such-root'] });
    expect(record.exitCode).toBeGreaterThanOrEqual(EXIT_ERROR_FLOOR);
    expect(record.outcome).toBe('error');
    expect(record.stderr).not.toBe('');
    expect(record.paths).toBeNull();
  });

  it('does not parse the empty stdout of a failed invocation as a miss', () => {
    const cwd = makeCorpus();
    const record = search('structured', 'anything', { cwd, roots: ['no-such-root'] });
    expect(record.results).toBeNull();
  });
});

// ───────────────────────────────────────────────────────────────────
// Evidence and ranking
// ───────────────────────────────────────────────────────────────────

describe('caller-side ranking', () => {
  it('classifies an anchor marker hit as anchor evidence with its line number', () => {
    const cwd = makeCorpus();
    const record = search('structured', 'ANCHOR:scope', { cwd, roots: ['specs'] });
    expect(record.exitCode).toBe(EXIT_MATCH);
    expect(record.results[0].evidenceField).toBe('anchor-marker');
    expect(record.results[0].line).toBeGreaterThan(0);
  });

  it('excludes archived, vendored and scratch trees from every recipe', () => {
    const cwd = makeCorpus();
    for (const phrase of ['archived only phrase', 'vendored only phrase', 'scratch only phrase']) {
      const record = search('path', phrase, { cwd, roots: ['specs'] });
      expect(record.exitCode, phrase).toBe(EXIT_NO_MATCH);
    }
  });
});

describe('per-file flood control', () => {
  it('keeps one top-ranked row per file before applying the file limit', () => {
    const ranked = [
      ...Array.from({ length: 25 }, (_, index) => rankedRow('specs/track/001-packet/a.md', index + 1)),
      rankedRow('specs/track/001-packet/b.md', 1),
      rankedRow('specs/track/001-packet/c.md', 1),
      rankedRow('specs/track/001-packet/d.md', 1),
    ];

    const shaped = shapeRankedMatches(ranked, { limit: 20 });

    expect(shaped.results).toHaveLength(4);
    expect(shaped.results[0].path).toBe('specs/track/001-packet/a.md');
    expect(shaped.results[0].moreInFile).toBe(24);
    expect(shaped.matchCount).toBe(28);
    expect(shaped.fileCount).toBe(4);
    expect(shaped.hidden).toEqual({ files: 0, matches: 0 });
  });

  it('reports hidden file and match totals when the file limit cuts results', () => {
    const cwd = makeFloodCorpus(30, 3);
    const record = search('structured', 'flood marker', { cwd, limit: 20, roots: ['specs'] });

    expect(record.results).toHaveLength(20);
    expect(record.hidden).toEqual({ files: 10, matches: 30 });
    expect(record.matchCount).toBe(90);
    expect(record.fileCount).toBe(30);
    expect(record.truncated).toBe(true);
  });

  it('treats a zero limit as uncapped', () => {
    const cwd = makeFloodCorpus(30, 1);
    const record = search('structured', 'flood marker', { cwd, limit: 0, roots: ['specs'] });

    expect(record.results).toHaveLength(30);
    expect(record.hidden).toEqual({ files: 0, matches: 0 });
    expect(record.truncated).toBe(false);
  });

  // The human view must print every shaped row: a second cut there would hide
  // files that neither a suffix nor the tail line accounts for.
  it('prints every shaped file in the human summary when the limit exceeds twenty', () => {
    const cwd = makeFloodCorpus(30, 1);
    const record = search('structured', 'flood marker', { cwd, limit: 0, roots: ['specs'] });
    const rows = formatSummary(record).split('\n').filter((line) => line.includes('file-'));

    expect(rows).toHaveLength(30);
  });

  it('prints the exact per-file and hidden-file elision strings', () => {
    const record = {
      command: 'rg --no-config --hidden --json ...',
      exitCode: 0,
      fileCount: 30,
      hidden: { files: 10, matches: 30 },
      limit: 20,
      matchCount: 83,
      outcome: 'match',
      recipe: 'structured',
      results: [
        { evidenceField: 'trigger_phrases', line: 12, moreInFile: 33, path: 'specs/track/001-packet/spec.md' },
        ...Array.from({ length: 19 }, (_, index) => ({
          evidenceField: 'body',
          line: index + 1,
          moreInFile: 0,
          path: `specs/track/001-packet/file-${index}.md`,
        })),
      ],
      unparsedLines: 0,
    };
    const formatted = formatSummary(record);

    expect(formatted).toContain('(+33 more in this file)');
    expect(formatted.split('\n')).toContain('  +10 more files with 30 matches');

    const noElision = formatSummary({
      ...record,
      fileCount: 20,
      hidden: { files: 0, matches: 0 },
      matchCount: 20,
      results: record.results.map((result) => ({ ...result, moreInFile: 0 })),
    });
    expect(noElision).not.toContain('more in this file');
    expect(noElision).not.toContain('more files with');
  });

  it('returns zero totals and an empty result for a clean structured miss', () => {
    const cwd = makeCorpus();
    const record = search('structured', 'a phrase no document declares', { cwd, roots: ['specs'] });

    expect(record.exitCode).toBe(EXIT_NO_MATCH);
    expect(record.results).toEqual([]);
    expect(record.matchCount).toBe(0);
    expect(record.fileCount).toBe(0);
    expect(record.hidden).toEqual({ files: 0, matches: 0 });
    expect(record.truncated).toBe(false);
  });

  it('accepts whole non-negative limits and rejects invalid values', () => {
    expect(parseArgs(['structured', 'phrase', '--limit', '0']).limit).toBe(0);
    expect(parseArgs(['structured', 'phrase', '--limit', '20']).limit).toBe(20);
    for (const limit of ['-1', '2junk', '1.9', '9'.repeat(400)]) {
      expect(() => parseArgs(['structured', 'phrase', '--limit', limit]))
        .toThrow('--limit requires a non-negative integer');
    }
  });

  it('keeps the structured recipe free of --max-count and aligned with the shared lane', () => {
    expect(structuredRecipe('phrase')).not.toContain('--max-count');
    expect(assertRecipeParity('phrase', DEFAULT_SEARCH_ROOTS)).toEqual([]);
  });

  it('ranks a frontmatter hit above a body hit', () => {
    const cwd = makeCorpus();
    const record = search('structured', 'only', { cwd, roots: ['specs'] });
    expect(record.exitCode).toBe(EXIT_MATCH);
    const fields = record.results.map((result: { evidenceField: string }) => result.evidenceField);
    expect(fields[0]).toBe('trigger_phrases');
    expect(fields).toContain('body');
    expect(fields.indexOf('trigger_phrases')).toBeLessThan(fields.indexOf('body'));
  });
});

// ───────────────────────────────────────────────────────────────────
// CLI parsing
// ───────────────────────────────────────────────────────────────────

describe('argument parsing', () => {
  it('accepts a recipe, a phrase and the documented flags', () => {
    expect(parseArgs(['structured', 'grep convention', '--json'])).toEqual({
      json: true,
      limit: 20,
      phrase: 'grep convention',
      recipe: 'structured',
      root: undefined,
      roots: undefined,
    });
  });

  it('searches the source root under the name the checkout gives it', () => {
    for (const name of ['.skilled', '.opencode']) {
      const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'rg-wrapper-source-root-'));
      try {
        const sentinel = path.join(cwd, name, 'skills', 'system-spec-kit', 'SKILL.md');
        fs.mkdirSync(path.dirname(sentinel), { recursive: true });
        fs.writeFileSync(sentinel, '---\nname: system-spec-kit\n---\n');
        expect(searchRootsFor(cwd)).toEqual(['specs', name]);
      } finally {
        fs.rmSync(cwd, { recursive: true, force: true });
      }
    }
  });

  it('refuses an unknown recipe, a missing phrase and an unknown flag', () => {
    expect(() => parseArgs(['fuzzy', 'phrase'])).toThrow(/must be one of/);
    expect(() => parseArgs(['count'])).toThrow(/phrase is required/);
    expect(() => parseArgs(['path', 'foo', 'bar'])).toThrow(/unexpected extra argument/);
    expect(() => parseArgs(['count', 'phrase', '--sort'])).toThrow(/unknown argument/);
    expect(() => parseArgs(['count', 'phrase', '--root'])).toThrow(/requires a value/);
  });
});
