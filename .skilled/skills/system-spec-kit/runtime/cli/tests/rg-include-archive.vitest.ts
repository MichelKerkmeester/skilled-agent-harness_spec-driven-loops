// ───────────────────────────────────────────────────────────────────
// MODULE: RG Wrapper Archive Mode Tests
// ───────────────────────────────────────────────────────────────────
// Archive search is opt-in. The default recipes keep the archive exclusion,
// the opt-in recipes drop only that exclusion, and a hit inside an archive
// says so in both the record and the human summary. Those properties are
// tested together because any one of them failing turns archived evidence
// into ordinary-looking live evidence.
//
// Every search runs the real ripgrep through the wrapper against a fresh
// tree under the system temp directory, so no case depends on or mutates
// this checkout.
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { resolveRipgrep } from '../retrieval/lib/rg-lane.mjs';
import {
  EXIT_MATCH,
  EXIT_NO_MATCH,
  assertRecipeParity,
  countRecipe,
  formatSummary,
  parseArgs,
  pathRecipe,
  search,
  structuredRecipe,
} from '../retrieval/rg-wrapper.mjs';

const ARCHIVE_GLOB = '!**/z_archive/**';
const ROOTS = ['specs', '.skilled'];
const BUILDERS = [
  ['structured', structuredRecipe],
  ['path', pathRecipe],
  ['count', countRecipe],
] as const;

const tempRoots = new Set<string>();

const ripgrepAvailable = spawnSync(resolveRipgrep(), ['--version'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'ignore'],
}).status === 0;

afterEach(() => {
  for (const dir of tempRoots) fs.rmSync(dir, { force: true, recursive: true });
  tempRoots.clear();
});

function makeTree(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rg-wrapper-archive-'));
  tempRoots.add(dir);
  return dir;
}

function write(root: string, relativePath: string, lines: string[]): void {
  const absolute = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${lines.join('\n')}\n`, 'utf8');
}

// ───────────────────────────────────────────────────────────────────
// Recipe shape
// ───────────────────────────────────────────────────────────────────

describe('archive mode recipe shape', () => {
  it('keeps the archive exclusion in the default vector for every recipe', () => {
    for (const [recipe, build] of BUILDERS) {
      const baseline = build('archive reach', ROOTS);
      const explicitOff = build('archive reach', ROOTS, { includeArchive: false });

      expect(baseline, recipe).toContain(ARCHIVE_GLOB);
      expect(explicitOff, recipe).toEqual(baseline);
    }
  });

  it('drops only the archive exclusion under archive mode and stays in parity with the shared lane', () => {
    for (const [recipe, build] of BUILDERS) {
      const baseline = build('archive reach', ROOTS);
      const archived = build('archive reach', ROOTS, { includeArchive: true });

      // Drop the flag and its value together; keeping the bare `--glob` would
      // make the comparison describe a vector ripgrep cannot receive.
      const withoutArchivePair = baseline.filter((argument: string, index: number) => (
        argument !== ARCHIVE_GLOB && baseline[index + 1] !== ARCHIVE_GLOB
      ));
      expect(archived, recipe).not.toContain(ARCHIVE_GLOB);
      expect(archived, recipe).toEqual(withoutArchivePair);
      expect(archived, recipe).toContain('!**/node_modules/**');
    }

    expect(assertRecipeParity('archive reach', ROOTS, { includeArchive: true })).toEqual([]);
  });
});

// ───────────────────────────────────────────────────────────────────
// Search behavior
// ───────────────────────────────────────────────────────────────────

describe('archive search behavior', () => {
  it.skipIf(!ripgrepAvailable)('a phrase that survives only in an archived spec is a miss until archive mode is requested', () => {
    const cwd = makeTree();
    const archivedSpec = 'specs/demo/z_archive/001-old/spec.md';
    write(cwd, archivedSpec, ['archived only phrase', '']);

    // A phrase outside the default corpus is a clean miss, not a broken
    // invocation, so the status has to be 1 rather than an error.
    const liveOnly = search('structured', 'archived only phrase', { cwd, roots: ['specs'] });
    expect(liveOnly.exitCode).toBe(EXIT_NO_MATCH);
    expect(liveOnly.outcome).toBe('no-match');
    expect(liveOnly.results).toEqual([]);

    const withArchive = search('structured', 'archived only phrase', {
      cwd,
      includeArchive: true,
      roots: ['specs'],
    });
    expect(withArchive.exitCode).toBe(EXIT_MATCH);
    expect(withArchive.outcome).toBe('match');
    expect(withArchive.results).toHaveLength(1);
    for (const row of withArchive.results) {
      expect(row.archived).toBe(true);
      expect(row.path).toBe(archivedSpec);
    }

    const printed = formatSummary(withArchive)
      .split('\n')
      .filter((line) => line.includes(archivedSpec));
    expect(printed.length).toBeGreaterThan(0);
    for (const line of printed) expect(line).toContain('[archived]');
  });

  it.skipIf(!ripgrepAvailable)('labels only the archived hit when a live file carries the same phrase', () => {
    const cwd = makeTree();
    const liveSpec = 'specs/demo/live-packet/spec.md';
    const archivedSpec = 'specs/demo/z_archive/001-old/spec.md';
    write(cwd, liveSpec, ['coexisting phrase', '']);
    write(cwd, archivedSpec, ['coexisting phrase', '']);

    const liveOnly = search('structured', 'coexisting phrase', { cwd, roots: ['specs'] });
    expect(liveOnly.exitCode).toBe(EXIT_MATCH);
    expect(liveOnly.results.map((row: { path: string }) => row.path)).toEqual([liveSpec]);

    // Archive mode widens the corpus; it must not relabel a live hit. Only
    // the file actually under z_archive carries the marker.
    const withArchive = search('structured', 'coexisting phrase', {
      cwd,
      includeArchive: true,
      roots: ['specs'],
    });
    const byPath = new Map(
      withArchive.results.map((row: { archived?: boolean, path: string }) => [row.path, row]),
    );
    expect(byPath.get(liveSpec)?.archived).toBe(false);
    expect(byPath.get(archivedSpec)?.archived).toBe(true);

    const summaryLines = formatSummary(withArchive).split('\n');
    const liveLine = summaryLines.find((line) => line.includes(liveSpec));
    const archivedLine = summaryLines.find((line) => line.includes(archivedSpec));
    expect(liveLine).toBeDefined();
    expect(archivedLine).toBeDefined();
    expect(liveLine).not.toContain('[archived]');
    expect(archivedLine).toContain('[archived]');
  });

  it.skipIf(!ripgrepAvailable)('reaches archived graph metadata only through the opt-in metadata lane', () => {
    const cwd = makeTree();
    const metadata = 'specs/demo/z_archive/001-old/graph-metadata.json';
    write(cwd, metadata, ['{', '  "note": "metadata only phrase"', '}']);

    const liveOnly = search('structured', 'metadata only phrase', { cwd, roots: ['specs'] });
    expect(liveOnly.exitCode).toBe(EXIT_NO_MATCH);
    expect(liveOnly.jsonLane).toBeUndefined();
    expect(Object.hasOwn(liveOnly, 'jsonLane')).toBe(false);
    expect(Object.hasOwn(liveOnly, 'includeArchive')).toBe(false);

    // The metadata lane is a second invocation, so a miss in .md files still
    // has to become a match when archived metadata carries the phrase.
    const withArchive = search('structured', 'metadata only phrase', {
      cwd,
      includeArchive: true,
      roots: ['specs'],
    });
    expect(withArchive.exitCode).toBe(EXIT_MATCH);
    expect(withArchive.outcome).toBe('match');
    expect(withArchive.includeArchive).toBe(true);
    expect(withArchive.jsonLane?.paths).toContain(metadata);
  });
});

// ───────────────────────────────────────────────────────────────────
// Argument parsing
// ───────────────────────────────────────────────────────────────────

describe('archive mode argument parsing', () => {
  it('accepts --include-archive and keeps the default parsed shape unchanged', () => {
    const optedIn = parseArgs(['structured', 'phrase', '--include-archive']);
    expect(optedIn.includeArchive).toBe(true);
    expect(Object.keys(optedIn)).toContain('includeArchive');

    // The flag must stay out of the enumerable shape when it is off, because
    // callers treat the parsed record as the set of options requested.
    const defaulted = parseArgs(['structured', 'phrase']);
    expect(defaulted.includeArchive).toBe(false);
    expect(Object.keys(defaulted)).not.toContain('includeArchive');
  });
});
