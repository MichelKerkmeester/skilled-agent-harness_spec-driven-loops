// ───────────────────────────────────────────────────────────────────
// MODULE: Stale Trigger Index Fallback Tests
// ───────────────────────────────────────────────────────────────────
// A minimal host index keeps each fixture focused on what a zero-hit lookup
// recovers from disk, without making the generator choose a corpus first.

import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import { findStaleFallback } from '../retrieval/lib/unindexed-docs.mjs';
import {
  normalizeTriggerText,
  queryTokens,
} from '../retrieval/lib/normalize.mjs';
import { loadIndex, lookupWithFallback } from '../retrieval/lookup-trigger-index.mjs';

const RETRIEVAL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'retrieval');
const LOOKUP_SCRIPT = path.join(RETRIEVAL_DIR, 'lookup-trigger-index.mjs');
const HOST_INDEX_PATH = '.speckit-index/trigger-index.json';
const INDEXED_DOC_PATH = 'specs/indexed/001-reference/spec.md';
const INDEXED_PHRASE = 'indexed reference marker';

const tempRoots = new Set<string>();

interface RepoFixture {
  root: string;
  indexPath: string;
  loaded: ReturnType<typeof loadIndex>;
}

interface CliAnswer {
  results: Array<{ matchClass: string; path: string; phrases: string[]; score: number }>;
  staleFallback?: { available: boolean; files: number; matches: number; paths: string[]; truncated: boolean };
  totalCandidates: number;
  truncated: boolean;
}

interface StaleFallbackScan {
  results: CliAnswer['results'];
  staleFallback: NonNullable<CliAnswer['staleFallback']>;
}

afterEach(() => {
  for (const dir of tempRoots) {
    fs.rmSync(dir, { force: true, recursive: true });
  }
  tempRoots.clear();
});

function makeTempDir(prefix: string): string {
  const tempRoot = fs.realpathSync(os.tmpdir());
  const dir = fs.mkdtempSync(path.join(tempRoot, prefix));
  tempRoots.add(dir);
  return dir;
}

function writeDoc(root: string, relativePath: string, content: string): string {
  const absolute = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, content, 'utf8');
  return absolute;
}

function frontmatter(phrases: string[]): string {
  return [
    '---',
    'title: "Fallback fixture"',
    'trigger_phrases:',
    ...phrases.map((phrase) => `  - "${phrase}"`),
    '---',
    '',
    '# Fixture',
    '',
  ].join('\n');
}

function makeRepo(): RepoFixture {
  const root = makeTempDir('speckit-stale-fallback-');
  execFileSync('git', ['init', '--quiet'], { cwd: root, stdio: 'ignore' });
  writeDoc(root, INDEXED_DOC_PATH, frontmatter([INDEXED_PHRASE]));
  const indexPath = writeDoc(root, HOST_INDEX_PATH, `${JSON.stringify({
    manifestHash: 'fixture-manifest',
    normalization: {},
    paths: [INDEXED_DOC_PATH],
    phrases: { [INDEXED_PHRASE]: [0] },
    schemaVersion: 2,
  })}\n`);

  return { root, indexPath, loaded: loadIndex(indexPath) };
}

function addFallbackDoc(root: string, relativePath: string, phrases: string[]): string {
  return writeDoc(root, relativePath, frontmatter(phrases));
}

function runJson(root: string, prompt: string, args: string[] = []) {
  const run = spawnSync(process.execPath, [LOOKUP_SCRIPT, ...args, '--json', '--', prompt], {
    cwd: root,
    encoding: 'utf8',
  });
  return {
    answer: JSON.parse(run.stdout || '') as CliAnswer,
    status: run.status,
    stdout: run.stdout || '',
  };
}

function runHuman(root: string, prompt: string, args: string[] = []) {
  return spawnSync(process.execPath, [LOOKUP_SCRIPT, ...args, '--', prompt], {
    cwd: root,
    encoding: 'utf8',
  });
}

async function lookupFallback(
  loaded: ReturnType<typeof loadIndex>,
  prompt: string,
  options: { cwd: string; staleFallback: true },
): Promise<CliAnswer> {
  return await lookupWithFallback(loaded, prompt, options) as CliAnswer;
}

describe('stale trigger index fallback', () => {
  it('finds an untracked unindexed document through the CLI', () => {
    const fixture = makeRepo();
    const relativePath = 'specs/search/001-query/spec.md';
    addFallbackDoc(fixture.root, relativePath, ['silver badger retrieval']);

    const run = runJson(fixture.root, 'silver badger retrieval');

    expect(run.status).toBe(0);
    expect(run.answer.staleFallback?.matches).toBe(1);
    expect(run.answer.results.map((result) => result.path)).toContain(relativePath);
  });

  it('skips documents under scratch and archive directories', () => {
    const fixture = makeRepo();
    addFallbackDoc(fixture.root, 'specs/search/001-query/scratch/spec.md', ['silver badger retrieval']);
    addFallbackDoc(fixture.root, 'specs/z_archive/spec.md', ['silver badger retrieval']);

    const run = runJson(fixture.root, 'silver badger retrieval');

    expect(run.status).toBe(1);
    expect(run.answer.staleFallback?.files).toBe(0);
    expect(run.answer.results).toEqual([]);
  });

  it('ignores a markdown file whose name is not a spec document', () => {
    const fixture = makeRepo();
    addFallbackDoc(fixture.root, 'specs/search/001-query/notes.md', ['silver badger retrieval']);

    const run = runJson(fixture.root, 'silver badger retrieval');

    expect(run.status).toBe(1);
    expect(run.answer.staleFallback?.files).toBe(0);
    expect(run.answer.results).toEqual([]);
  });

  it('includes the research summary and excludes documents nested under research', () => {
    const fixture = makeRepo();
    const allowedPath = 'specs/search/001-query/research/research.md';
    const excludedPath = 'specs/search/001-query/research/iterations/spec.md';
    addFallbackDoc(fixture.root, allowedPath, ['silver badger retrieval']);
    addFallbackDoc(fixture.root, excludedPath, ['silver badger retrieval']);

    const run = runJson(fixture.root, 'silver badger retrieval');

    expect(run.status).toBe(0);
    expect(run.answer.results.map((result) => result.path)).toEqual([allowedPath]);
  });

  it('reports fallback unavailable outside a Git work tree without a scored result', async () => {
    const fixture = makeRepo();
    const outside = makeTempDir('speckit-stale-outside-git-');

    const answer = await lookupFallback(fixture.loaded, 'silver badger retrieval', {
      cwd: outside,
      staleFallback: true,
    });

    expect(answer.staleFallback).toEqual({
      available: false,
      files: 0,
      matches: 0,
      paths: [],
      truncated: false,
    });
    expect(answer.results).toEqual([]);
    expect(answer.results.some((result) => result.score > 0)).toBe(false);
  });

  it('walks the named root instead of the caller repository when one is given', async () => {
    const fixture = makeRepo();
    const relativePath = 'specs/search/001-query/spec.md';
    addFallbackDoc(fixture.root, relativePath, ['silver badger retrieval']);
    const outside = makeTempDir('speckit-stale-outside-git-');

    const answer = await lookupWithFallback(fixture.loaded, 'silver badger retrieval', {
      cwd: outside,
      repoRoot: fixture.root,
      staleFallback: true,
    }) as CliAnswer;

    expect(answer.staleFallback?.available).toBe(true);
    expect(answer.results.map((result) => result.path)).toEqual([relativePath]);
  });

  it('skips the scan when the index read lives outside the walked root', async () => {
    const fixture = makeRepo();
    addFallbackDoc(fixture.root, 'specs/search/001-query/spec.md', ['silver badger retrieval']);
    const elsewhere = makeTempDir('speckit-stale-foreign-index-');
    const foreignIndex = path.join(elsewhere, 'trigger-index.json');
    fs.copyFileSync(fixture.indexPath, foreignIndex);

    const answer = await lookupWithFallback(fixture.loaded, 'silver badger retrieval', {
      cwd: fixture.root,
      indexPath: foreignIndex,
      staleFallback: true,
    }) as CliAnswer;

    expect(answer.staleFallback).toBeUndefined();
    expect(answer.results).toEqual([]);
  });

  it('does not count an indexed document among stale fallback files', async () => {
    const fixture = makeRepo();

    const answer = await lookupFallback(fixture.loaded, 'silver badger retrieval', {
      cwd: fixture.root,
      staleFallback: true,
    });

    expect(answer.staleFallback?.files).toBe(0);
    expect(answer.staleFallback?.matches).toBe(0);
    expect(answer.results).toEqual([]);
  });

  it('keeps an explicit index lookup index-only', () => {
    const fixture = makeRepo();
    addFallbackDoc(fixture.root, 'specs/search/001-query/spec.md', ['silver badger retrieval']);

    const run = runJson(fixture.root, 'silver badger retrieval', ['--index', fixture.indexPath]);

    expect(run.status).toBe(1);
    expect(run.answer).not.toHaveProperty('staleFallback');
  });

  it('keeps fallback disabled when the CLI flag is set', () => {
    const fixture = makeRepo();
    addFallbackDoc(fixture.root, 'specs/search/001-query/spec.md', ['silver badger retrieval']);

    const run = runJson(fixture.root, 'silver badger retrieval', ['--no-stale-fallback']);

    expect(run.status).toBe(1);
    expect(run.answer).not.toHaveProperty('staleFallback');
  });

  it('does not add fallback metadata when the index already matches', () => {
    const fixture = makeRepo();
    addFallbackDoc(fixture.root, 'specs/search/001-query/spec.md', [INDEXED_PHRASE]);

    const run = runJson(fixture.root, INDEXED_PHRASE);

    expect(run.status).toBe(0);
    expect(run.answer).not.toHaveProperty('staleFallback');
    expect(run.answer.results.map((result) => result.path)).toEqual([INDEXED_DOC_PATH]);
  });

  it('scopes fallback results to the requested packet', () => {
    const fixture = makeRepo();
    addFallbackDoc(fixture.root, 'specs/search/002-other/spec.md', ['silver badger retrieval']);

    const run = runJson(fixture.root, 'silver badger retrieval', [
      '--spec-folder', 'specs/search/001-current',
    ]);

    expect(run.status).toBe(1);
    expect(run.answer.results).toEqual([]);
    expect(run.answer.staleFallback?.matches).toBe(0);
  });

  it('caps CLI results while reporting the total fallback candidates', () => {
    const fixture = makeRepo();
    addFallbackDoc(fixture.root, 'specs/search/001-query/a/spec.md', ['silver badger retrieval']);
    addFallbackDoc(fixture.root, 'specs/search/001-query/b/spec.md', ['silver badger retrieval']);

    const run = runJson(fixture.root, 'silver badger retrieval', ['--limit', '1']);

    expect(run.status).toBe(0);
    expect(run.answer.results).toHaveLength(1);
    expect(run.answer.truncated).toBe(true);
    expect(run.answer.totalCandidates).toBe(2);
  });

  it('caps fallback reads at maxFiles and keeps the first path by code-unit order', async () => {
    const fixture = makeRepo();
    const firstPath = 'specs/search/001-query/a/spec.md';
    const secondPath = 'specs/search/001-query/z/spec.md';
    addFallbackDoc(fixture.root, secondPath, ['silver badger retrieval']);
    addFallbackDoc(fixture.root, firstPath, ['silver badger retrieval']);
    const prompt = 'silver badger retrieval';

    const fallback = await findStaleFallback({
      indexedPaths: new Set(fixture.loaded.index.paths),
      maxFiles: 1,
      normalizedQuery: normalizeTriggerText(prompt),
      repoRoot: fixture.root,
      tokens: queryTokens(prompt).tokens,
    }) as StaleFallbackScan;

    expect(fallback.staleFallback.truncated).toBe(true);
    expect(fallback.staleFallback.files).toBe(1);
    expect(fallback.staleFallback.paths).toEqual([firstPath]);
  });

  it('prints byte-identical JSON for repeated lookups on the same tree', () => {
    const fixture = makeRepo();
    addFallbackDoc(fixture.root, 'specs/search/001-query/spec.md', ['silver badger retrieval']);

    const first = runJson(fixture.root, 'silver badger retrieval');
    const second = runJson(fixture.root, 'silver badger retrieval');

    expect(first.status).toBe(0);
    expect(second.status).toBe(0);
    expect(first.stdout).toBe(second.stdout);
  });

  it('skips fallback metadata for a prompt with no eligible token', () => {
    const fixture = makeRepo();
    addFallbackDoc(fixture.root, 'specs/search/001-query/spec.md', ['silver badger retrieval']);

    const run = runJson(fixture.root, 'a b');

    expect(run.status).toBe(1);
    expect(run.answer).not.toHaveProperty('staleFallback');
  });

  it('prints fallback counts in human-readable output', () => {
    const fixture = makeRepo();
    addFallbackDoc(fixture.root, 'specs/search/001-query/spec.md', ['silver badger retrieval']);

    const run = runHuman(fixture.root, 'silver badger retrieval');

    expect(run.status).toBe(0);
    expect(run.stdout).toMatch(/^fallback   : \d+ unindexed doc\(s\) read, \d+ match\(es\)$/m);
  });

  it('lists a repeated declared phrase only once in a fallback result', async () => {
    const fixture = makeRepo();
    const phrase = 'silver badger retrieval';
    const relativePath = 'specs/search/001-query/spec.md';
    addFallbackDoc(fixture.root, relativePath, [phrase, phrase]);

    const answer = await lookupFallback(fixture.loaded, phrase, {
      cwd: fixture.root,
      staleFallback: true,
    });
    const result = answer.results.find((candidate) => candidate.path === relativePath);

    expect(result?.phrases).toEqual([phrase]);
  });

  // A track may hold one level of named sub-tracks whose packets restart their
  // numbering, so the walk and its exclusions must work one folder deeper.
  it('finds a packet filed in a sub-track and applies the same exclusions there', () => {
    const fixture = makeRepo();
    const packetDoc = 'specs/search/indexing/001-query/spec.md';
    const summaryDoc = 'specs/search/indexing/001-query/research/research.md';
    addFallbackDoc(fixture.root, packetDoc, ['silver badger retrieval']);
    addFallbackDoc(fixture.root, summaryDoc, ['silver badger retrieval']);
    addFallbackDoc(fixture.root, 'specs/search/indexing/001-query/research/iterations/spec.md', ['silver badger retrieval']);
    addFallbackDoc(fixture.root, 'specs/search/indexing/z_archive/001-old/spec.md', ['silver badger retrieval']);
    addFallbackDoc(fixture.root, 'specs/search/indexing/001-query/scratch/spec.md', ['silver badger retrieval']);

    const run = runJson(fixture.root, 'silver badger retrieval');

    expect(run.status).toBe(0);
    expect(run.answer.results.map((result) => result.path).sort()).toEqual([summaryDoc, packetDoc].sort());
    expect(run.answer.staleFallback?.files).toBe(2);
  });

  it('scopes fallback results to a sub-track', () => {
    const fixture = makeRepo();
    const inside = 'specs/search/indexing/001-query/spec.md';
    addFallbackDoc(fixture.root, inside, ['silver badger retrieval']);
    addFallbackDoc(fixture.root, 'specs/search/ranking/001-query/spec.md', ['silver badger retrieval']);
    addFallbackDoc(fixture.root, 'specs/search/002-direct/spec.md', ['silver badger retrieval']);

    const run = runJson(fixture.root, 'silver badger retrieval', ['--spec-folder', 'specs/search/indexing']);

    expect(run.status).toBe(0);
    expect(run.answer.results.map((result) => result.path)).toEqual([inside]);
    expect(run.answer.staleFallback?.files).toBe(1);
  });

  // A scope that only starts with specs/ can still resolve outside the tree,
  // and the fallback must never score documents the index does not cover.
  it('refuses a scope that climbs out of the spec tree', () => {
    const fixture = makeRepo();
    addFallbackDoc(fixture.root, 'outside/001-escape/spec.md', ['silver badger retrieval']);

    const run = runJson(fixture.root, 'silver badger retrieval', ['--spec-folder', 'specs/../outside']);

    expect(run.status).toBe(1);
    expect(run.answer.staleFallback?.files).toBe(0);
    expect(run.answer.results).toEqual([]);
  });

  it('refuses a scope that reaches outside the spec tree through a link', () => {
    const fixture = makeRepo();
    addFallbackDoc(fixture.root, 'outside/001-escape/spec.md', ['silver badger retrieval']);
    fs.mkdirSync(path.join(fixture.root, 'specs', 'search'), { recursive: true });
    fs.symlinkSync(path.join(fixture.root, 'outside'), path.join(fixture.root, 'specs', 'search', 'linked'));

    const run = runJson(fixture.root, 'silver badger retrieval', ['--spec-folder', 'specs/search/linked']);

    expect(run.status).toBe(1);
    expect(run.answer.staleFallback?.files).toBe(0);
  });
});
