import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  DEFAULT_EMBEDDING,
  EXIT_ERROR_FLOOR,
  EXIT_MATCH,
  EXIT_NO_MATCH,
  SUBCOMMANDS,
  ZVEC_BIN_ENV,
  index,
  matchClassFor,
  normalizeHits,
  parseAgentMarkdown,
  parseArgs,
  parseCoverage,
  probeOllama,
  readLaneConfig,
  resolveZvecGrep,
  search,
  spawnArgv,
  status,
} from '../retrieval/zvec-lane.mjs';

const FIXTURES = path.resolve(__dirname, '..', 'retrieval', 'fixtures');
const STUB = path.join(FIXTURES, 'zvec-stub.cjs');
const QUERY_OUTPUT = fs.readFileSync(path.join(FIXTURES, 'zvec-query-output.txt'), 'utf8');

const tempRoots = new Set<string>();

afterEach(() => {
  for (const dir of tempRoots) fs.rmSync(dir, { force: true, recursive: true });
  tempRoots.clear();
});

function tempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempRoots.add(dir);
  return dir;
}

function write(root: string, relativePath: string, lines: string[]): void {
  const absolute = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${lines.join('\n')}\n`, 'utf8');
}

// A port nothing listens on, so the status probe never reaches a live
// embedding server from a unit test and fails fast instead of hanging.
const DEAD_OLLAMA_URL = 'http://127.0.0.1:1';

function stubEnv(scenario: string): NodeJS.ProcessEnv {
  return {
    ...process.env,
    [ZVEC_BIN_ENV]: STUB,
    ZVEC_STUB_SCENARIO: scenario,
    ZVEC_GREP_OLLAMA_URL: DEAD_OLLAMA_URL,
  };
}

// ───────────────────────────────────────────────────────────────
// Binary resolution
// ───────────────────────────────────────────────────────────────

describe('binary resolution', () => {
  it('prefers an explicit override over everything else', () => {
    const onPath = tempDir('zvec-path-');
    fs.writeFileSync(path.join(onPath, 'zg'), '#!/bin/sh\n', { mode: 0o755 });

    expect(resolveZvecGrep({ PATH: onPath, [ZVEC_BIN_ENV]: '/custom/zg' })).toEqual({
      entry: '/custom/zg',
      source: 'env',
    });
  });

  it('takes an installed zg from PATH when no override is set', () => {
    const onPath = tempDir('zvec-path-');
    const installed = path.join(onPath, 'zg');
    fs.writeFileSync(installed, '#!/bin/sh\n', { mode: 0o755 });

    expect(resolveZvecGrep({ PATH: onPath })).toEqual({ entry: installed, source: 'path' });
  });

  it('walks PATH in order, so the first executable zg wins', () => {
    const first = tempDir('zvec-first-');
    const second = tempDir('zvec-second-');
    fs.writeFileSync(path.join(first, 'zg'), '#!/bin/sh\n', { mode: 0o755 });
    fs.writeFileSync(path.join(second, 'zg'), '#!/bin/sh\n', { mode: 0o755 });

    expect(resolveZvecGrep({ PATH: [first, second].join(path.delimiter) }).entry)
      .toBe(path.join(first, 'zg'));
  });

  it('skips a non-executable zg on PATH rather than resolving a file it cannot spawn', () => {
    const onPath = tempDir('zvec-path-');
    fs.writeFileSync(path.join(onPath, 'zg'), '#!/bin/sh\n', { mode: 0o644 });

    expect(resolveZvecGrep({ PATH: onPath }).source).not.toBe('path');
  });

  it('falls back past PATH to the fork checkout, or to the bare name when neither exists', () => {
    const empty = tempDir('zvec-empty-');
    const resolution = resolveZvecGrep({ PATH: empty, HOME: process.env.HOME });

    // The last two rungs are machine-dependent by design: the fork checkout
    // answers only where it is cloned. Both outcomes are asserted so the test
    // proves the order rather than the machine.
    if (resolution.source === 'fork-clone') {
      expect(fs.statSync(resolution.entry).isFile()).toBe(true);
      expect(resolution.entry.endsWith(path.join('zvec-grep', 'dist', 'cli', 'index.js'))).toBe(true);
    } else {
      expect(resolution).toEqual({ entry: 'zg', source: 'fallback' });
    }
  });

  it('returns the bare tool name when no rung answers, so the spawn error names the tool', () => {
    const empty = tempDir('zvec-empty-');
    expect(resolveZvecGrep({ HOME: empty, PATH: empty })).toEqual({ entry: 'zg', source: 'fallback' });
  });

  it('runs a non-executable module through the interpreter and an executable directly', () => {
    expect(spawnArgv(STUB, ['status'])).toEqual({
      args: [STUB, 'status'],
      executable: process.execPath,
    });
    expect(spawnArgv('/usr/bin/env', ['status'])).toEqual({
      args: ['status'],
      executable: '/usr/bin/env',
    });
  });
});

// ───────────────────────────────────────────────────────────────
// Rank-tuple normalization
// ───────────────────────────────────────────────────────────────

describe('rank-tuple normalization', () => {
  it('extracts every ranked hit from the captured output and ignores the presentation around it', () => {
    const parsed = parseAgentMarkdown(QUERY_OUTPUT);

    expect(parsed.unparsedHeaders).toBe(0);
    expect(parsed.hits.map((hit: { rank: number }) => hit.rank)).toEqual([1, 2, 3, 4]);
    expect(parsed.hits[0]).toEqual({
      endLine: 133,
      line: 113,
      matchedBy: 'fts+vector',
      path: '.opencode/skills/system-spec-kit/references/structure/grep-convention.md',
      rangeLabel: '113-133',
      rank: 1,
      score: 0.0328,
    });
  });

  it('reads a single-line range and a non-line locator without losing either', () => {
    const parsed = parseAgentMarkdown(QUERY_OUTPUT);

    expect(parsed.hits[2].line).toBe(812);
    expect(parsed.hits[2].endLine).toBe(812);
    expect(parsed.hits[2].rangeLabel).toBe('812');

    expect(parsed.hits[3].line).toBeNull();
    expect(parsed.hits[3].rangeLabel).toBe('bytes:0-4096');
    expect(parsed.hits[3].path).toBe('.opencode/skills/system-spec-kit/data/trigger-index.json');
  });

  it('normalizes the captured output into the shared rank tuple with the semantic score attached', () => {
    const cwd = tempDir('zvec-corpus-');
    write(cwd, '.opencode/skills/system-spec-kit/references/structure/grep-convention.md', [
      '---', 'title: "Grep Convention"', '---', '', '# Body starts here',
    ]);
    write(cwd, 'specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/spec.md', [
      '---', 'title: "Trigger Index Replacement"', 'trigger_phrases:', '  - "trigger index"', '---', '', 'Body.',
    ]);
    write(cwd, '.opencode/skills/system-spec-kit/scripts/retrieval/retrofit-convention.mjs', ['// no frontmatter']);
    write(cwd, '.opencode/skills/system-spec-kit/data/trigger-index.json', ['{}']);

    const results = normalizeHits(parseAgentMarkdown(QUERY_OUTPUT).hits, { cwd });

    expect(results).toHaveLength(4);
    for (const result of results) expect(result.lane).toBe('zvec');

    // Every field the ripgrep wrapper emits is present, so a caller can merge
    // the two lanes on one shape, plus the score ripgrep has no analogue for.
    expect(Object.keys(results[0]).sort()).toEqual([
      'evidenceField', 'lane', 'line', 'matchClass', 'packetPath', 'path', 'rangeLabel', 'rank', 'score',
    ]);

    expect(results.map((result: { matchClass: string }) => result.matchClass))
      .toEqual(['lexical-and-semantic', 'semantic', 'lexical', 'semantic']);
    expect(results[0].score).toBe(0.0328);
    expect(results[0].packetPath).toBe('.opencode/skills/system-spec-kit/references/structure');
  });

  it('classifies a hit inside the leading frontmatter apart from a body hit and an unlocated one', () => {
    const cwd = tempDir('zvec-corpus-');
    write(cwd, '.opencode/skills/system-spec-kit/references/structure/grep-convention.md', [
      '---', 'title: "Grep Convention"', '---', '', '# Body',
    ]);
    write(cwd, 'specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/spec.md', [
      '---', 'title: "Trigger Index Replacement"', 'trigger_phrases:', '  - "trigger index"', '---', '', 'Body.',
    ]);
    write(cwd, '.opencode/skills/system-spec-kit/scripts/retrieval/retrofit-convention.mjs', ['// no frontmatter']);
    write(cwd, '.opencode/skills/system-spec-kit/data/trigger-index.json', ['{}']);

    const fields = normalizeHits(parseAgentMarkdown(QUERY_OUTPUT).hits, { cwd })
      .map((result: { evidenceField: string }) => result.evidenceField);

    expect(fields).toEqual(['body', 'frontmatter', 'body', 'unlocated']);
  });

  it('preserves the tool rank rather than re-sorting on a tuple that cannot see the fusion score', () => {
    const cwd = tempDir('zvec-corpus-');
    const results = normalizeHits(parseAgentMarkdown(QUERY_OUTPUT).hits, { cwd });
    expect(results.map((result: { rank: number }) => result.rank)).toEqual([1, 2, 3, 4]);
  });

  it('counts a header it cannot locate instead of dropping it, so loss is never read as a miss', () => {
    const parsed = parseAgentMarkdown('#1 matchedBy=vector score=0.5 a-path-with-no-range\n');
    expect(parsed.hits).toHaveLength(0);
    expect(parsed.unparsedHeaders).toBe(1);
  });

  it('reports a null score when the tool printed none, rather than inventing a zero', () => {
    const parsed = parseAgentMarkdown('#1 matchedBy=fts docs/alpha.md:12\n');
    expect(parsed.hits[0].score).toBeNull();
  });

  it('names the retrieval path without borrowing the lexical scorer class names', () => {
    expect(matchClassFor('fts+vector')).toBe('lexical-and-semantic');
    expect(matchClassFor('fts')).toBe('lexical');
    expect(matchClassFor('vector')).toBe('semantic');
    expect(matchClassFor('something-new')).toBe('unclassified');
  });
});

// ───────────────────────────────────────────────────────────────
// Exit mapping
// ───────────────────────────────────────────────────────────────

describe('exit mapping', () => {
  it('maps a query with hits to exit 0', () => {
    const cwd = tempDir('zvec-run-');
    const record = search('anything', { cwd, env: stubEnv('hits') });

    expect(record.exitCode).toBe(EXIT_MATCH);
    expect(record.outcome).toBe('match');
    expect(record.results).toHaveLength(2);
  });

  it('maps a clean miss to exit 1 even though the tool itself exits 0', () => {
    const cwd = tempDir('zvec-run-');
    const record = search('anything', { cwd, env: stubEnv('empty') });

    expect(record.toolStatus).toBe(0);
    expect(record.exitCode).toBe(EXIT_NO_MATCH);
    expect(record.outcome).toBe('no-match');
    expect(record.results).toEqual([]);
  });

  it('maps a query fault to exit 2 and surfaces the stderr text', () => {
    const cwd = tempDir('zvec-run-');
    const record = search('anything', { cwd, env: stubEnv('fault') });

    expect(record.exitCode).toBe(EXIT_ERROR_FLOOR);
    expect(record.outcome).toBe('error');
    expect(record.stderr).toContain('ZVEC_GREP.ENGINE.INDEX.MISSING');
    expect(record.results).toBeUndefined();
  });

  it('maps a ready index to exit 0 and reads the embedding schema from the manifest', () => {
    const cwd = tempDir('zvec-run-');
    write(cwd, '.zvec-grep/manifest.json', [JSON.stringify({
      embedding: { dimension: 768, metric: 'cosine', model: 'nomic-embed-text-v1.5', provider: 'local' },
      indexPolicy: 'enabled',
      rootPaths: [{ absolutePath: cwd, globs: ['specs/**/*.md'], recursive: true }],
      updatedTime: 1788520178427,
    })]);

    const record = status({ cwd, env: stubEnv('ready') });

    expect(record.exitCode).toBe(EXIT_MATCH);
    expect(record.outcome).toBe('ready');
    expect(record.indexPresent).toBe(true);
    expect(record.embedding).toEqual({
      dimension: 768, metric: 'cosine', model: 'nomic-embed-text-v1.5', provider: 'local',
    });
    expect(record.rootPaths).toEqual([{ globs: ['specs/**/*.md'], path: cwd, recursive: true }]);
  });

  it('reports the embedder separately: unreachable Ollama is named, not folded into the index state', () => {
    const cwd = tempDir('zvec-run-');
    const record = status({ cwd, env: stubEnv('ready') });

    expect(record.ollama).toEqual({
      url: DEAD_OLLAMA_URL, reachable: false, models: null, error: expect.any(String),
    });
    expect(record.outcome).toBe('ready');
  });

  it('probes nothing for a non-Ollama embedding reference', () => {
    const cwd = tempDir('zvec-run-');
    write(cwd, '.zvec-grep-lane.json', [JSON.stringify({
      schemaVersion: 1, mode: 'direct', embedding: 'local/nomic-embed-text-v1.5', globs: ['specs/**/*.md'],
    })]);

    expect(probeOllama('local/nomic-embed-text-v1.5', stubEnv('ready'))).toBeNull();
    expect(status({ cwd, env: stubEnv('ready') }).ollama).toBeNull();
  });

  it('maps a missing index to exit 1, a valid empty answer rather than a fault', () => {
    const cwd = tempDir('zvec-run-');
    const record = status({ cwd, env: stubEnv('unready') });

    expect(record.exitCode).toBe(EXIT_NO_MATCH);
    expect(record.outcome).toBe('not-ready');
    expect(record.indexPresent).toBe(false);
    expect(record.embedding).toBeNull();
  });

  it('separates a status fault from a not-ready index, which the tool reports identically', () => {
    const cwd = tempDir('zvec-run-');
    const faulted = status({ cwd, env: stubEnv('fault') });
    const unready = status({ cwd, env: stubEnv('unready') });

    // Same exit, and both print an `Error:` line. Only the sentence differs, so
    // that sentence is the whole discriminator.
    expect(faulted.toolStatus).toBe(unready.toolStatus);
    expect(faulted.stderr).toMatch(/^Error:/m);

    expect(faulted.exitCode).toBe(EXIT_ERROR_FLOOR);
    expect(unready.exitCode).toBe(EXIT_NO_MATCH);
    expect(faulted.stderr).toContain('ZVEC_GREP.ENGINE.MANIFEST.INVALID');
  });

  it('reports the index state the not-ready verdict names, rather than a bare boolean', () => {
    const cwd = tempDir('zvec-run-');
    expect(status({ cwd, env: stubEnv('unready') }).indexState).toBe('undecided');
  });

  it('does not print the captured stderr twice when the failure text repeats it', () => {
    const cwd = tempDir('zvec-run-');
    const record = status({ cwd, env: stubEnv('fault') });
    const occurrences = String(record.stderr).split('ZVEC_GREP.ENGINE.MANIFEST.INVALID').length - 1;
    expect(occurrences).toBe(1);
  });

  it('maps a successful index build to exit 0 and a failed one to exit 2', () => {
    const cwd = tempDir('zvec-run-');
    expect(index({ cwd, env: stubEnv('hits') }).exitCode).toBe(EXIT_MATCH);

    const faulted = index({ cwd, env: stubEnv('fault') });
    expect(faulted.exitCode).toBe(EXIT_ERROR_FLOOR);
    expect(faulted.stderr).toContain('ZVEC_GREP.ENGINE.EMBEDDING.LOAD');
  });

  it('records which rung of the resolution order answered on every subcommand', () => {
    const cwd = tempDir('zvec-run-');
    for (const record of [
      search('anything', { cwd, env: stubEnv('hits') }),
      status({ cwd, env: stubEnv('ready') }),
      index({ cwd, env: stubEnv('hits') }),
    ]) {
      expect(record.binary).toBe(STUB);
      expect(record.binarySource).toBe('env');
      expect(record.mode).toBe('direct');
    }
  });
});

// ───────────────────────────────────────────────────────────────
// Execution mode and scope
// ───────────────────────────────────────────────────────────────

describe('execution mode and scope', () => {
  it('forces direct mode on every invocation, so an exported server mode cannot reroute a call', () => {
    const cwd = tempDir('zvec-run-');
    const record = search('anything', { cwd, env: { ...stubEnv('hits'), ZVEC_GREP_MODE: 'server' } });

    expect(record.mode).toBe('direct');
    expect(record.command).toContain('--mode direct');
  });

  it('passes the committed glob set to an index build', () => {
    const cwd = tempDir('zvec-run-');
    write(cwd, '.zvec-grep-lane.json', [JSON.stringify({
      embedding: 'local/some-model',
      globs: ['specs/**/*.md', '!**/scratch/**'],
    })]);

    const record = index({ cwd, env: stubEnv('hits'), resetPaths: true });

    expect(record.command).toContain("--glob 'specs/**/*.md'");
    expect(record.command).toContain("--glob '!**/scratch/**'");
    expect(record.command).toContain('--embedding local/some-model');
    expect(record.selectionReplaced).toBe(true);
  });

  it('reports an absent scope file rather than pretending a default was declared', () => {
    const cwd = tempDir('zvec-run-');
    const config = readLaneConfig(cwd);

    expect(config.present).toBe(false);
    expect(config.globs).toEqual([]);
    expect(config.embedding).toBe(DEFAULT_EMBEDDING);
  });

  it('says whether an index build actually replaced the stored file selection', () => {
    const cwd = tempDir('zvec-run-');
    expect(index({ cwd, env: stubEnv('hits') }).selectionReplaced).toBe(false);
    expect(index({ cwd, env: stubEnv('hits'), rebuild: true }).selectionReplaced).toBe(true);
  });

  it('scrapes the coverage counts the status text prints, and reports nothing when it prints none', () => {
    const ready = [
      '✓ Workspace index is ready',
      '  Coverage    ████ 100%  120 / 120 files',
      '  Entities    4,096',
      '  Truncated   0 fragments',
      '  Queue       0 pending · 0 failed',
    ].join('\n');

    expect(parseCoverage(ready)).toEqual({
      entities: 4096, failed: 0, indexedFiles: 120, pending: 0, totalFiles: 120, truncated: 0,
    });
    expect(parseCoverage('? Workspace index is not configured')).toEqual({});
  });

  it('anchors each count to its own label instead of reading across a newline', () => {
    // The tool prints label-then-number on aligned rows. An unanchored pattern
    // reads the Entities value as the Truncated one, which is silent and
    // plausible: the count is real, it just belongs to the row above.
    const counts = parseCoverage(['  Entities    6', '  Truncated   0 fragments'].join('\n'));
    expect(counts.entities).toBe(6);
    expect(counts.truncated).toBe(0);
  });

  it('passes --hidden, without which the whole dotted .opencode tree is dropped in silence', () => {
    const cwd = tempDir('zvec-run-');
    expect(index({ cwd, env: stubEnv('hits') }).command).toContain('--hidden');
  });
});

// ───────────────────────────────────────────────────────────────
// CLI parsing
// ───────────────────────────────────────────────────────────────

describe('argument parsing', () => {
  it('accepts each subcommand with the documented flags', () => {
    expect(parseArgs(['search', 'a concept query', '--limit', '5', '--json'])).toEqual({
      json: true, limit: 5, query: 'a concept query', rebuild: false, resetPaths: false, root: undefined, subcommand: 'search',
    });
    expect(parseArgs(['index', '--rebuild', '--root', '/tmp/x']).rebuild).toBe(true);
    expect(parseArgs(['status']).subcommand).toBe('status');
  });

  it('refuses an unknown subcommand, a missing query and an unknown flag', () => {
    expect(() => parseArgs(['fuzzy'])).toThrow(/must be one of/);
    expect(() => parseArgs(['search'])).toThrow(/query is required/);
    expect(() => parseArgs(['status', '--sort'])).toThrow(/unknown argument/);
    expect(() => parseArgs(['status', '--root'])).toThrow(/requires a value/);
    expect(() => parseArgs(['search', 'q', '--limit', 'many'])).toThrow(/positive integer/);
  });

  it('exposes exactly the three documented subcommands', () => {
    expect([...SUBCOMMANDS]).toEqual(['index', 'status', 'search']);
  });
});
