import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { publishJson } from '../retrieval/lib/artifact.mjs';
import {
  activeRowSql,
  escapeLikePattern,
  legacyQueryTokens,
  legacySearch,
  openLegacyDatabase,
  parseTriggerPhrases,
  searchableTiersFilter,
  specFolderLikePattern,
  timestampBoost,
} from '../retrieval/lib/legacy-lane.mjs';
import {
  frontmatterFieldLines,
  isAnchorMarker,
  parseJsonLines,
  pathOnlyRecipe,
  rankMatches,
  resolveRipgrep,
  runRecipe,
  structuredRecipe,
} from '../retrieval/lib/rg-lane.mjs';
import {
  buildIntersection,
  canonicalDatabasePath,
  classifyDivergence,
  isExcludedTree,
  legacySpecFolder,
  runCase,
} from '../retrieval/parity-check.mjs';
import { loadIndex } from '../retrieval/lookup-trigger-index.mjs';

const require = createRequire(path.resolve(__dirname, '..', '..', 'mcp-server') + path.sep);
const Database = require('better-sqlite3');

const tempRoots = new Set<string>();

afterEach(() => {
  for (const dir of tempRoots) fs.rmSync(dir, { force: true, recursive: true });
  tempRoots.clear();
});

function makeTempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'parity-check-'));
  tempRoots.add(dir);
  return dir;
}

type Row = {
  createdAt?: string;
  deletedAt?: string | null;
  expiresAt?: string | null;
  id: number;
  importanceTier?: string | null;
  importanceWeight?: number;
  inProjection?: boolean;
  path: string;
  phrases: string[] | string;
  specFolder?: string;
  updatedAt?: string;
};

const CLOCK = Date.parse('2026-01-31T00:00:00.000Z');

/**
 * Builds a synthetic database shaped like the one the lane queries: the row
 * table plus the projection it joins, and nothing else.
 */
function makeDatabase(rows: Row[]): string {
  const dir = makeTempDir();
  const file = path.join(dir, 'synthetic.sqlite');
  const db = new Database(file);
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT,
      file_path TEXT,
      trigger_phrases TEXT,
      importance_weight REAL,
      created_at TEXT,
      updated_at TEXT,
      expires_at TEXT,
      deleted_at TEXT,
      importance_tier TEXT
    );
    CREATE TABLE active_memory_projection (active_memory_id INTEGER PRIMARY KEY);
  `);
  const insert = db.prepare(`
    INSERT INTO memory_index
      (id, spec_folder, file_path, trigger_phrases, importance_weight, created_at, updated_at, expires_at, deleted_at, importance_tier)
    VALUES (@id, @specFolder, @filePath, @phrases, @weight, @created, @updated, @expires, @deleted, @tier)
  `);
  const project = db.prepare('INSERT INTO active_memory_projection (active_memory_id) VALUES (?)');

  for (const row of rows) {
    insert.run({
      created: row.createdAt ?? '2026-01-01T00:00:00.000Z',
      deleted: row.deletedAt ?? null,
      expires: row.expiresAt ?? null,
      filePath: row.path,
      id: row.id,
      phrases: typeof row.phrases === 'string' ? row.phrases : JSON.stringify(row.phrases),
      specFolder: row.specFolder ?? path.posix.dirname(row.path).replace(/^specs\//, ''),
      tier: row.importanceTier ?? 'normal',
      updated: row.updatedAt ?? '2026-01-15T00:00:00.000Z',
      weight: row.importanceWeight ?? 0.5,
    });
    if (row.inProjection !== false) project.run(row.id);
  }
  db.close();
  return file;
}

/** Builds a synthetic artifact in the shape the lookup library reads. */
function makeIndex(phrases: Record<string, string[]>): ReturnType<typeof loadIndex> {
  const dir = makeTempDir();
  const file = path.join(dir, 'trigger-index.json');
  const paths = [...new Set(Object.values(phrases).flat())].sort();
  publishJson(file, {
    manifestHash: 'synthetic',
    normalization: {},
    paths,
    phrases: Object.fromEntries(
      Object.entries(phrases).map(([phrase, owners]) => [phrase, owners.map((owner) => paths.indexOf(owner)).sort((a, b) => a - b)]),
    ),
    schemaVersion: 2,
  });
  return loadIndex(file);
}

function search(file: string, query: string, options: Record<string, unknown> = {}) {
  const db = openLegacyDatabase(file);
  try {
    return legacySearch(db, query, { limit: 20, nowMs: CLOCK, ...options });
  } finally {
    db.close();
  }
}

describe('legacy lane replay: scoring classes', () => {
  const file = () => makeDatabase([
    { id: 1, path: 'specs/t/001-a/spec.md', phrases: ['alpha beta gamma'] },
    { id: 2, path: 'specs/t/001-a/plan.md', phrases: ['alpha beta gamma delta'] },
    { id: 3, path: 'specs/t/002-b/spec.md', phrases: ['gamma beta alpha'] },
    { id: 4, path: 'specs/t/002-b/plan.md', phrases: ['alpha'] },
  ]);

  it('scores a whole normalized phrase as an exact match', () => {
    const result = search(file(), 'alpha beta gamma');
    const exact = result.results.find((row) => row.path === 'specs/t/001-a/spec.md');
    expect(exact?.matchClass).toBe('exact');
    expect(exact?.matchScore).toBe(1);
  });

  it('scores a phrase that contains the query above one the query contains', () => {
    const result = search(file(), 'alpha beta gamma');
    const byPath = new Map(result.results.map((row) => [row.path, row]));
    expect(byPath.get('specs/t/001-a/plan.md')?.matchClass).toBe('phrase-containment');
    expect(byPath.get('specs/t/001-a/plan.md')?.matchScore).toBeCloseTo(0.94, 10);

    const longer = search(file(), 'alpha beta gamma delta epsilon');
    const contained = longer.results.find((row) => row.path === 'specs/t/001-a/plan.md');
    expect(contained?.matchClass).toBe('query-containment');
    expect(contained?.matchScore).toBeCloseTo(0.88, 10);
  });

  it('admits token overlap at the coverage floor and rejects below it', () => {
    const atFloor = makeDatabase([
      { id: 1, path: 'specs/t/001-a/spec.md', phrases: ['aaa bbb ccc ddd'] },
    ]);
    // Four of five query tokens are shared, which is exactly the 0.8 floor.
    const admitted = search(atFloor, 'ddd ccc bbb aaa zzz');
    expect(admitted.results[0]?.matchClass).toBe('token-overlap');
    expect(admitted.results[0]?.matchScore).toBeCloseTo(0.6, 10);

    // Three of five falls below it and the row is dropped, not merely ranked low.
    expect(search(atFloor, 'ccc bbb aaa yyy zzz').results).toHaveLength(0);
  });

  it('gives a single-token phrase no score unless the query equals it', () => {
    expect(search(file(), 'alpha beta').results.some((row) => row.path === 'specs/t/002-b/plan.md')).toBe(false);
    const exact = search(file(), 'alpha').results.find((row) => row.path === 'specs/t/002-b/plan.md');
    expect(exact?.matchClass).toBe('exact');
  });
});

describe('legacy lane replay: eligibility filters', () => {
  it('drops deleted and expired rows and keeps a future expiry', () => {
    const file = makeDatabase([
      { id: 1, path: 'specs/t/001-a/spec.md', phrases: ['alpha beta gamma'] },
      { deletedAt: '2026-01-02T00:00:00.000Z', id: 2, path: 'specs/t/001-a/plan.md', phrases: ['alpha beta gamma'] },
      { expiresAt: '2020-01-01T00:00:00.000Z', id: 3, path: 'specs/t/001-a/tasks.md', phrases: ['alpha beta gamma'] },
      { expiresAt: '2999-01-01T00:00:00.000Z', id: 4, path: 'specs/t/001-a/notes.md', phrases: ['alpha beta gamma'] },
    ]);
    const paths = search(file, 'alpha beta gamma').results.map((row) => row.path);
    expect(paths).toContain('specs/t/001-a/spec.md');
    expect(paths).toContain('specs/t/001-a/notes.md');
    expect(paths).not.toContain('specs/t/001-a/plan.md');
    expect(paths).not.toContain('specs/t/001-a/tasks.md');
  });

  it('drops a row the active projection does not carry', () => {
    const file = makeDatabase([
      { id: 1, inProjection: false, path: 'specs/t/001-a/spec.md', phrases: ['alpha beta gamma'] },
    ]);
    expect(search(file, 'alpha beta gamma').results).toHaveLength(0);
  });

  it('drops a row whose stored phrase list is not a JSON array', () => {
    const file = makeDatabase([
      { id: 1, path: 'specs/t/001-a/spec.md', phrases: 'alpha beta gamma' },
    ]);
    expect(search(file, 'alpha beta gamma').results).toHaveLength(0);
    expect(parseTriggerPhrases('alpha')).toEqual([]);
    expect(parseTriggerPhrases('["alpha"]')).toEqual(['alpha']);
    expect(parseTriggerPhrases(null)).toEqual([]);
  });

  it('scopes to a folder and to its descendants', () => {
    const file = makeDatabase([
      { id: 1, path: 'specs/t/001-a/spec.md', phrases: ['alpha beta gamma'], specFolder: 't/001-a' },
      { id: 2, path: 'specs/t/001-a/002-child/spec.md', phrases: ['alpha beta gamma'], specFolder: 't/001-a/002-child' },
      { id: 3, path: 'specs/t/001-a-sibling/spec.md', phrases: ['alpha beta gamma'], specFolder: 't/001-a-sibling' },
    ]);
    const paths = search(file, 'alpha beta gamma', { specFolder: 't/001-a' }).results.map((row) => row.path);
    expect(paths.sort()).toEqual(['specs/t/001-a/002-child/spec.md', 'specs/t/001-a/spec.md']);
  });

  it('escapes a folder whose name carries a LIKE wildcard', () => {
    expect(escapeLikePattern('a_b%c')).toBe('a\\_b\\%c');
    expect(specFolderLikePattern('t/100%')).toBe('t/100\\%/%');
    const file = makeDatabase([
      { id: 1, path: 'specs/t/a_b/spec.md', phrases: ['alpha beta gamma'], specFolder: 't/a_b' },
      { id: 2, path: 'specs/t/axb/child/spec.md', phrases: ['alpha beta gamma'], specFolder: 't/axb/child' },
    ]);
    const paths = search(file, 'alpha beta gamma', { specFolder: 't/a_b' }).results.map((row) => row.path);
    expect(paths).toEqual(['specs/t/a_b/spec.md']);
  });
});

describe('legacy lane replay: gate and window', () => {
  it('drops tokens below three characters and keeps only the first eight', () => {
    expect(legacyQueryTokens('ab cde fgh')).toEqual(['cde', 'fgh']);
    expect(legacyQueryTokens('aaa bbb ccc ddd eee fff ggg hhh iii jjj')).toHaveLength(8);
    expect(legacyQueryTokens('aaa aaa bbb')).toEqual(['aaa', 'bbb']);
  });

  it('cuts candidates at the pre-scoring window and sees past it when unwindowed', () => {
    const rows: Row[] = [];
    for (let i = 1; i <= 40; i += 1) {
      rows.push({
        id: i,
        path: `specs/t/001-a/doc-${String(i).padStart(3, '0')}.md`,
        phrases: ['alpha beta gamma'],
        updatedAt: `2026-01-${String((i % 28) + 1).padStart(2, '0')}T00:00:00.000Z`,
      });
    }
    const file = makeDatabase(rows);
    const windowed = search(file, 'alpha beta gamma', { limit: 3 });
    expect(windowed.candidateLimit).toBe(9);
    expect(windowed.candidateRowCount).toBe(9);
    expect(windowed.saturated).toBe(true);
    expect(windowed.results).toHaveLength(3);

    const unwindowed = search(file, 'alpha beta gamma', { limit: 3, windowed: false });
    expect(unwindowed.candidateLimit).toBeNull();
    expect(unwindowed.results).toHaveLength(40);
  });

  it('adds importance and recency on top of the match score, and clamps at one', () => {
    const file = makeDatabase([
      { id: 1, importanceWeight: 1, path: 'specs/t/001-a/spec.md', phrases: ['alpha beta gamma'], updatedAt: '2026-01-30T00:00:00.000Z' },
      { id: 2, importanceWeight: 0, path: 'specs/t/001-a/plan.md', phrases: ['alpha beta gamma'], updatedAt: '2020-01-01T00:00:00.000Z' },
    ]);
    const boosted = search(file, 'alpha beta gamma delta').results;
    expect(boosted[0].path).toBe('specs/t/001-a/spec.md');
    expect(boosted[0].matchScore).toBe(boosted[1].matchScore);
    expect(boosted[0].score).toBeGreaterThan(boosted[1].score);

    // An exact match already sits at the ceiling, so the boost cannot separate
    // two rows that both matched exactly.
    const exact = search(file, 'alpha beta gamma').results;
    expect(exact.map((row) => row.score)).toEqual([1, 1]);
  });

  it('reads the recency clock from the caller so a replay is reproducible', () => {
    expect(timestampBoost('2026-01-31T00:00:00.000Z', CLOCK)).toBe(1);
    expect(timestampBoost('2026-01-01T00:00:00.000Z', CLOCK)).toBeCloseTo(0.5, 10);
    expect(timestampBoost('not a date', CLOCK)).toBe(0);
    expect(timestampBoost(null, CLOCK)).toBe(0);
  });
});

describe('searchable tier predicate', () => {
  it('drops the predicate entirely once cold rows are admitted', () => {
    expect(searchableTiersFilter('m', { includeCold: true })).toBe('1=1');
    expect(searchableTiersFilter('m', { includeArchived: true, includeCold: true })).toBe('1=1');
  });

  it('excludes deprecated alone, and archived too when archives are not requested', () => {
    expect(searchableTiersFilter('m', {})).toBe("(m.importance_tier IS NULL OR lower(m.importance_tier) NOT IN ('deprecated','archived'))");
    expect(searchableTiersFilter('m', { includeArchived: true })).toBe("(m.importance_tier IS NULL OR lower(m.importance_tier) NOT IN ('deprecated'))");
    expect(activeRowSql('m', { includeCold: true })).toBe('m.deleted_at IS NULL AND 1=1');
  });
});

describe('path policy', () => {
  it('folds an absolute stored path and the specs alias onto the repo-relative form', () => {
    expect(canonicalDatabasePath('/Users/x/Repo/specs/t/001-a/spec.md')).toBe('specs/t/001-a/spec.md');
    expect(canonicalDatabasePath('/Users/x/Repo/.opencode/skills/a/README.md')).toBe('.opencode/skills/a/README.md');
    expect(canonicalDatabasePath('.opencode/specs/t/001-a/spec.md')).toBe('specs/t/001-a/spec.md');
    expect(canonicalDatabasePath('specs/t/001-a/spec.md')).toBe('specs/t/001-a/spec.md');
  });

  it('maps a scope argument between the two lanes and names excluded trees', () => {
    expect(legacySpecFolder('specs/t/001-a')).toBe('t/001-a');
    expect(legacySpecFolder(null)).toBeNull();
    expect(isExcludedTree('specs/t/z_archive/001-a/spec.md')).toBe(true);
    expect(isExcludedTree('specs/t/001-a/scratch/notes.md')).toBe(true);
    expect(isExcludedTree('specs/t/001-a/spec.md')).toBe(false);
  });
});

describe('corpus intersection', () => {
  it('keeps only paths the database, the manifest and the index all carry', () => {
    const file = makeDatabase([
      { id: 1, path: '/Repo/specs/t/001-a/spec.md', phrases: ['alpha beta'] },
      { id: 2, path: '/Repo/specs/t/001-a/gone.md', phrases: ['alpha beta'] },
      { id: 3, path: '/Repo/specs/t/z_archive/old.md', phrases: ['alpha beta'] },
    ]);
    const loaded = makeIndex({ 'alpha beta': ['specs/t/001-a/spec.md', 'specs/t/001-a/unseen.md'] });
    const db = openLegacyDatabase(file);
    try {
      const intersection = buildIntersection(db, {
        includedPaths: ['specs/t/001-a/spec.md', 'specs/t/001-a/gone.md', 'specs/t/001-a/unseen.md'],
      }, loaded.index);
      expect([...intersection.comparable]).toEqual(['specs/t/001-a/spec.md']);
      expect(intersection.stats.databasePathsWithPhrases).toBe(3);
      expect(intersection.stats.databaseOutsideManifest).toBe(1);
      expect(intersection.stats.indexOutsideDatabase).toBe(1);
      expect(intersection.stats.expiredRows).toBe(0);
    } finally {
      db.close();
    }
  });
});

describe('divergence classification', () => {
  const intersection = {
    comparable: new Set(['specs/t/001-a/spec.md']),
    databasePhrases: new Map([['specs/t/001-a/spec.md', new Set(['alpha beta'])]]),
    indexPhrases: new Map([['specs/t/001-a/spec.md', new Set(['alpha beta'])]]),
    stats: {},
  } as never;

  const base = {
    indexArm: { orderedPaths: [] as string[] },
    intersection,
    legacyArm: { candidateLimit: 60, candidateRowCount: 60, unwindowedByPath: new Map() },
    limit: 20,
  };

  it('names the legacy candidate window when the unwindowed pass scores the path', () => {
    const legacyArm = { ...base.legacyArm, unwindowedByPath: new Map([['specs/t/001-a/spec.md', { matchClass: 'exact', score: 1 }]]) };
    const verdict = classifyDivergence({ ...base, documentPath: 'specs/t/001-a/spec.md', legacyArm, missingFrom: 'legacy' });
    expect(verdict?.mechanism).toBe('legacy-candidate-window');
    expect(verdict?.evidence).toContain('60');
  });

  it('names the index result window when the path ranks below the cut', () => {
    const orderedPaths = Array.from({ length: 25 }, (_, i) => `specs/t/001-a/doc-${i}.md`);
    orderedPaths[22] = 'specs/t/001-a/spec.md';
    const verdict = classifyDivergence({ ...base, documentPath: 'specs/t/001-a/spec.md', indexArm: { orderedPaths }, missingFrom: 'index' });
    expect(verdict?.mechanism).toBe('index-result-window');
  });

  it('names corpus drift when the two phrase sets disagree', () => {
    const drifted = {
      ...intersection,
      databasePhrases: new Map([['specs/t/001-a/spec.md', new Set(['alpha beta', 'stale phrase'])]]),
    } as never;
    const verdict = classifyDivergence({ ...base, documentPath: 'specs/t/001-a/spec.md', intersection: drifted, missingFrom: 'index' });
    expect(verdict?.mechanism).toBe('corpus-drift');
    expect(verdict?.evidence).toContain('stale phrase');
  });

  it('names excluded trees and non-Markdown rows before anything else', () => {
    expect(classifyDivergence({ ...base, documentPath: 'specs/t/z_archive/a.md', missingFrom: 'index' })?.mechanism).toBe('excluded-tree');
    expect(classifyDivergence({ ...base, documentPath: 'specs/t/001-a/description.json', missingFrom: 'index' })?.mechanism).toBe('non-markdown-row');
  });

  it('returns null when no mechanism accounts for the path', () => {
    expect(classifyDivergence({ ...base, documentPath: 'specs/t/001-a/spec.md', missingFrom: 'legacy' })).toBeNull();
  });
});

describe('ripgrep lane', () => {
  function makeCorpus(): { doc: string; root: string } {
    const root = makeTempDir();
    const doc = path.join(root, 'specs', 't', '001-a', 'spec.md');
    fs.mkdirSync(path.dirname(doc), { recursive: true });
    fs.writeFileSync(doc, [
      '---',
      'title: "Alpha Beta"',
      'trigger_phrases:',
      '  - "alpha beta"',
      '  - "gamma"',
      '---',
      '',
      '<!-- ANCHOR:summary -->',
      'The body mentions alpha beta as prose.',
      '<!-- /ANCHOR:summary -->',
      '',
    ].join('\n'), 'utf8');
    return { doc, root };
  }

  it('maps the three exit classes', () => {
    const { root } = makeCorpus();
    expect(runRecipe(pathOnlyRecipe('alpha beta', ['specs']), { cwd: root }).outcome).toBe('match');
    expect(runRecipe(pathOnlyRecipe('zzq-absent', ['specs']), { cwd: root }).outcome).toBe('no-match');

    const broken = runRecipe(pathOnlyRecipe('alpha beta', ['no-such-root']), { cwd: root });
    expect(broken.outcome).toBe('error');
    expect(broken.exitCode).toBeGreaterThanOrEqual(2);
    expect(broken.stderr.length).toBeGreaterThan(0);
  });

  it('searches hidden directories under a root, so dotted documentation is never a silent miss', () => {
    const { root } = makeCorpus();
    fs.mkdirSync(path.join(root, 'specs', '.hidden-state'), { recursive: true });
    fs.writeFileSync(path.join(root, 'specs', '.hidden-state', 'README.md'), '# hidden\n\nzzq-hidden-token lives here\n', 'utf8');

    const execution = runRecipe(pathOnlyRecipe('zzq-hidden-token', ['specs']), { cwd: root });
    expect(execution.outcome).toBe('match');
    expect(execution.stdout).toContain('.hidden-state/README.md');
  });

  it('records the documented command line whatever binary was resolved', () => {
    const execution = runRecipe(pathOnlyRecipe('alpha beta', ['specs']), { cwd: makeCorpus().root });
    expect(execution.command.startsWith('rg --no-config --hidden --fixed-strings --ignore-case')).toBe(true);
    expect(execution.command).toContain("-- 'alpha beta' specs");
    expect(resolveRipgrep({ SPECKIT_RG_BIN: '/tmp/rg' } as never)).toBe('/tmp/rg');
    const located = resolveRipgrep({} as never);
    expect(located === 'rg' || path.isAbsolute(located)).toBe(true);
  });

  it('keeps only match records and counts what did not parse', () => {
    const parsed = parseJsonLines([
      JSON.stringify({ data: { path: { text: 'a.md' } }, type: 'begin' }),
      JSON.stringify({ data: { line_number: 9, lines: { text: 'hit\n' }, path: { text: 'a.md' } }, type: 'match' }),
      'not json',
      JSON.stringify({ type: 'summary' }),
    ].join('\n'));
    expect(parsed.matches).toEqual([{ line: 9, path: 'a.md', text: 'hit' }]);
    expect(parsed.unparsedLines).toBe(1);
  });

  it('maps frontmatter field lines and recognizes anchor markup', () => {
    const fields = frontmatterFieldLines(makeCorpusText());
    expect([...fields.triggerLines].sort((a, b) => a - b)).toEqual([3, 4, 5]);
    expect([...fields.descriptionLines]).toEqual([2]);
    expect(fields.frontmatterEnd).toBe(6);
    expect(isAnchorMarker('<!-- ANCHOR:summary -->')).toBe(true);
    expect(isAnchorMarker('<!-- /ANCHOR:summary -->')).toBe(true);
    expect(isAnchorMarker('plain prose')).toBe(false);
    // A file with no leading marker has no frontmatter, so nothing is a field.
    expect(frontmatterFieldLines('# Title\n').frontmatterEnd).toBe(0);
  });

  it('ranks trigger evidence above anchor and body evidence', () => {
    const { root } = makeCorpus();
    const execution = runRecipe(structuredRecipe('alpha beta', ['specs']), { cwd: root });
    expect(execution.outcome).toBe('match');
    const ranked = rankMatches(parseJsonLines(execution.stdout).matches, { cwd: root, normalizedQuery: 'alpha beta' });
    expect(ranked.map((row) => row.evidenceField)).toEqual(['trigger_phrases', 'title-or-description', 'body']);
    expect(ranked[0].line).toBe(4);
    expect(ranked[0].packetPath).toBe('specs/t/001-a');
  });

  function makeCorpusText(): string {
    return [
      '---',
      'title: "Alpha Beta"',
      'trigger_phrases:',
      '  - "alpha beta"',
      '  - "gamma"',
      '---',
      '',
      'body',
      '',
    ].join('\n');
  }
});

describe('case execution', () => {
  function fixture() {
    const root = makeTempDir();
    const doc = path.join(root, 'specs', 't', '001-a', 'spec.md');
    fs.mkdirSync(path.dirname(doc), { recursive: true });
    fs.writeFileSync(doc, '---\ntrigger_phrases:\n  - "alpha beta"\n---\n\nbody\n', 'utf8');

    const file = makeDatabase([
      { id: 1, path: '/Repo/specs/t/001-a/spec.md', phrases: ['alpha beta'] },
    ]);
    const loaded = makeIndex({ 'alpha beta': ['specs/t/001-a/spec.md'] });
    const db = openLegacyDatabase(file);
    const intersection = buildIntersection(db, { includedPaths: ['specs/t/001-a/spec.md'] }, loaded.index);
    return { db, intersection, loaded, root };
  }

  it('passes when both arms return the declared owner', () => {
    const { db, intersection, loaded, root } = fixture();
    try {
      const result = runCase({
        db,
        intersection,
        limit: 20,
        loaded,
        nowMs: CLOCK,
        repoRoot: root,
        roots: ['specs'],
        testCase: {
          allowedDivergence: [],
          class: 'exact-phrase',
          expectedPaths: ['specs/t/001-a/spec.md'],
          id: 'synthetic-exact',
          query: 'alpha beta',
          specFolder: null,
        },
      });
      expect(result.verdict).toBe('PASS');
      expect(result.divergences).toEqual([]);
      expect(result.expectedMisses).toEqual([]);
      expect(result.legacy.comparedRows[0].matchClass).toBe('exact');
      expect(result.index.comparedPaths).toEqual(['specs/t/001-a/spec.md']);
      expect(result.ripgrep.invocations[0].outcome).toBe('match');
    } finally {
      db.close();
    }
  });

  it('fails when a declared owner is absent from an arm for no reason the harness can verify', () => {
    const { db, intersection, loaded, root } = fixture();
    try {
      const result = runCase({
        db,
        intersection,
        limit: 20,
        loaded,
        nowMs: CLOCK,
        repoRoot: root,
        roots: ['specs'],
        testCase: {
          allowedDivergence: [],
          class: 'exact-phrase',
          // Neither arm can return this path, and nothing explains the absence.
          expectedPaths: ['specs/t/001-a/spec.md', 'specs/t/001-a/absent.md'],
          id: 'synthetic-miss',
          query: 'alpha beta',
          specFolder: null,
        },
      });
      expect(result.verdict).toBe('FAIL');
      expect(result.unexplainedCount).toBe(2);
      expect(result.expectedMisses.every((row) => row.mechanism === null)).toBe(true);
    } finally {
      db.close();
    }
  });

  it('reports a mechanism the case never declared instead of hiding it', () => {
    const root = makeTempDir();
    const doc = path.join(root, 'specs', 't', '001-a', 'spec.md');
    fs.mkdirSync(path.dirname(doc), { recursive: true });
    fs.writeFileSync(doc, '---\ntrigger_phrases:\n  - "alpha beta"\n---\n\nbody\n', 'utf8');

    // The index knows a second owner the database row set never had.
    const file = makeDatabase([
      { id: 1, path: '/Repo/specs/t/001-a/spec.md', phrases: ['alpha beta'] },
      { id: 2, path: '/Repo/specs/t/001-a/plan.md', phrases: ['unrelated phrase here'] },
    ]);
    const loaded = makeIndex({ 'alpha beta': ['specs/t/001-a/spec.md', 'specs/t/001-a/plan.md'] });
    const db = openLegacyDatabase(file);
    try {
      const intersection = buildIntersection(db, {
        includedPaths: ['specs/t/001-a/spec.md', 'specs/t/001-a/plan.md'],
      }, loaded.index);
      const result = runCase({
        db,
        intersection,
        limit: 20,
        loaded,
        nowMs: CLOCK,
        repoRoot: root,
        roots: ['specs'],
        testCase: {
          allowedDivergence: [],
          class: 'exact-phrase',
          expectedPaths: [],
          id: 'synthetic-drift',
          query: 'alpha beta',
          specFolder: null,
        },
      });
      expect(result.verdict).toBe('PASS');
      expect(result.divergences).toHaveLength(1);
      expect(result.divergences[0]).toMatchObject({ direction: 'indexOnly', mechanism: 'corpus-drift' });
      expect(result.undeclaredMechanisms).toEqual(['corpus-drift']);
    } finally {
      db.close();
    }
  });
});
