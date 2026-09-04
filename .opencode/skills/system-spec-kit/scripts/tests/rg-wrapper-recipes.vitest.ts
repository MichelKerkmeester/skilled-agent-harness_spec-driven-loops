import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  DEFAULT_SEARCH_ROOTS,
  EXIT_ERROR_FLOOR,
  EXIT_MATCH,
  EXIT_NO_MATCH,
  RECIPES,
  assertRecipeParity,
  countRecipe,
  parseArgs,
  RECIPE_BUILDERS,
  pathRecipe,
  search,
  structuredRecipe,
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
    'A phrase that exists only in prose.',
    '<!-- /ANCHOR:scope -->',
    '',
  ]);
  write(dir, 'specs/track/001-packet/z_archive/old.md', ['archived only phrase', '']);
  write(dir, 'specs/track/001-packet/node_modules/vendor.md', ['vendored only phrase', '']);
  return dir;
}

function write(root: string, relativePath: string, lines: string[]): void {
  const absolute = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${lines.join('\n')}\n`, 'utf8');
}

// ───────────────────────────────────────────────────────────────
// Recipe shape
// ───────────────────────────────────────────────────────────────

describe('recipe builders', () => {
  it('spells the structured recipe exactly as the convention writes it', () => {
    expect(structuredRecipe('phrase', ['specs', '.opencode'])).toEqual([
      '--no-config', '--hidden', '--json', '--fixed-strings', '--ignore-case',
      '--glob', '*.md', '--glob', '!**/z_archive/**', '--glob', '!**/node_modules/**', '--glob', '!**/.git/**',
      '--', 'phrase', 'specs', '.opencode',
    ]);
  });

  it('spells the path recipe exactly as the convention writes it', () => {
    expect(pathRecipe('phrase', ['specs', '.opencode'])).toEqual([
      '--no-config', '--hidden', '--fixed-strings', '--ignore-case',
      '--files-with-matches', '--max-count', '1',
      '--glob', '*.md', '--glob', '!**/z_archive/**', '--glob', '!**/node_modules/**', '--glob', '!**/.git/**',
      '--', 'phrase', 'specs', '.opencode',
    ]);
  });

  it('spells the count recipe exactly as the convention writes it', () => {
    expect(countRecipe('phrase', ['specs', '.opencode'])).toEqual([
      '--no-config', '--hidden', '--fixed-strings', '--ignore-case', '--count',
      '--glob', '*.md', '--glob', '!**/z_archive/**', '--glob', '!**/node_modules/**', '--glob', '!**/.git/**',
      '--', 'phrase', 'specs', '.opencode',
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

// ───────────────────────────────────────────────────────────────
// Exit mapping
// ───────────────────────────────────────────────────────────────

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

// ───────────────────────────────────────────────────────────────
// Evidence and ranking
// ───────────────────────────────────────────────────────────────

describe('caller-side ranking', () => {
  it('ranks a frontmatter hit above a body hit', () => {
    const cwd = makeCorpus();
    const record = search('structured', 'only', { cwd, roots: ['specs'] });
    expect(record.exitCode).toBe(EXIT_MATCH);
    const fields = record.results.map((result: { evidenceField: string }) => result.evidenceField);
    expect(fields[0]).toBe('trigger_phrases');
    expect(fields).toContain('body');
    expect(fields.indexOf('trigger_phrases')).toBeLessThan(fields.indexOf('body'));
  });

  it('classifies an anchor marker hit as anchor evidence with its line number', () => {
    const cwd = makeCorpus();
    const record = search('structured', 'ANCHOR:scope', { cwd, roots: ['specs'] });
    expect(record.exitCode).toBe(EXIT_MATCH);
    expect(record.results[0].evidenceField).toBe('anchor-marker');
    expect(record.results[0].line).toBeGreaterThan(0);
  });

  it('excludes archived and vendored trees from every recipe', () => {
    const cwd = makeCorpus();
    for (const phrase of ['archived only phrase', 'vendored only phrase']) {
      const record = search('path', phrase, { cwd, roots: ['specs'] });
      expect(record.exitCode, phrase).toBe(EXIT_NO_MATCH);
    }
  });
});

// ───────────────────────────────────────────────────────────────
// CLI parsing
// ───────────────────────────────────────────────────────────────

describe('argument parsing', () => {
  it('accepts a recipe, a phrase and the documented flags', () => {
    expect(parseArgs(['structured', 'grep convention', '--json'])).toEqual({
      json: true,
      phrase: 'grep convention',
      recipe: 'structured',
      root: undefined,
      roots: [...DEFAULT_SEARCH_ROOTS],
    });
  });

  it('refuses an unknown recipe, a missing phrase and an unknown flag', () => {
    expect(() => parseArgs(['fuzzy', 'phrase'])).toThrow(/must be one of/);
    expect(() => parseArgs(['count'])).toThrow(/phrase is required/);
    expect(() => parseArgs(['path', 'foo', 'bar'])).toThrow(/unexpected extra argument/);
    expect(() => parseArgs(['count', 'phrase', '--sort'])).toThrow(/unknown argument/);
    expect(() => parseArgs(['count', 'phrase', '--root'])).toThrow(/requires a value/);
  });
});
