// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Projection SQLite-Fallback Test
// ───────────────────────────────────────────────────────────────
//
// Asserts that loadAdvisorProjection() distinguishes three cases:
//   1. SQLite read succeeds → source: 'sqlite'.
//   2. SQLite DB does not exist → source: 'filesystem' (legitimate first run).
//   3. SQLite read THROWS → source: 'filesystem-fallback' with fallbackReason
//      populated AND a console.warn surfaced for operator visibility.

import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import Database from 'better-sqlite3';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadAdvisorProjection } from '../../lib/scorer/projection.js';

const workspaces: string[] = [];
const ADVISOR_DB_RELATIVE_PATH = join(
  '.opencode',
  'skills',
  'system-skill-advisor',
  'mcp-server',
  'database',
  'skill-graph.sqlite',
);
const DERIVED_PATH_FIXTURE = {
  key_files: ['.opencode/skills/x/assets/patterns/wait-patterns.js'],
  source_docs: ['references/architecture.md'],
};

function workspace(name: string): string {
  const root = join(tmpdir(), `${name}-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  workspaces.push(root);
  return root;
}

function write(filePath: string, content: string | Buffer): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
}

function writeFilesystemSkill(root: string): string {
  const skillDir = join(root, '.opencode', 'skills', 'sample-skill');
  write(join(skillDir, 'SKILL.md'), [
    '---',
    'name: sample-skill',
    'description: Sample test skill',
    '---',
    '# sample-skill',
    '',
  ].join('\n'));
  write(join(skillDir, 'graph-metadata.json'), JSON.stringify({
    schema_version: 1,
    skill_id: 'sample-skill',
    family: 'system',
    category: 'test',
    domains: ['test'],
    intent_signals: ['test'],
    derived: DERIVED_PATH_FIXTURE,
  }));
  return skillDir;
}

function writeSqliteFixture(root: string, sourcePath: string): void {
  const dbPath = join(root, ADVISOR_DB_RELATIVE_PATH);
  mkdirSync(dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  try {
    db.exec(`
      CREATE TABLE skill_nodes (
        id TEXT PRIMARY KEY,
        family TEXT NOT NULL,
        category TEXT NOT NULL,
        domains TEXT,
        intent_signals TEXT,
        derived TEXT,
        source_path TEXT NOT NULL,
        embedding BLOB,
        embedding_model_id TEXT
      );
      CREATE TABLE skill_edges (
        source_id TEXT NOT NULL,
        target_id TEXT NOT NULL,
        edge_type TEXT NOT NULL,
        weight REAL NOT NULL,
        context TEXT NOT NULL
      );
      CREATE TABLE skill_docs (
        skill_id TEXT NOT NULL,
        doc_path TEXT NOT NULL,
        trigger_phrases TEXT NOT NULL,
        importance_tier TEXT
      );
    `);
    db.prepare(`
      INSERT INTO skill_nodes (id, family, category, domains, intent_signals, derived, source_path)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'sample-skill',
      'system',
      'test',
      '["test"]',
      '["test"]',
      JSON.stringify(DERIVED_PATH_FIXTURE),
      sourcePath,
    );
    db.prepare(`
      INSERT INTO skill_edges (source_id, target_id, edge_type, weight, context)
      VALUES (?, ?, ?, ?, ?)
    `).run('sample-skill', 'related-skill', 'enhances', 0.8, 'fixture edge');
    db.prepare(`
      INSERT INTO skill_docs (skill_id, doc_path, trigger_phrases, importance_tier)
      VALUES (?, ?, ?, ?)
    `).run('sample-skill', 'references/guide.md', '["distinctive doc route"]', 'important');
  } finally {
    db.close();
  }
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of workspaces.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('F-004-A4-01: loadAdvisorProjection surfaces SQLite failures explicitly', () => {
  it('returns source=filesystem when the SQLite DB does not exist (legitimate first run)', () => {
    const root = workspace('advisor-projection-no-db');
    // Create a single skill on disk so the filesystem projection has content.
    const skillDir = join(root, '.opencode', 'skills', 'sample-skill');
    write(join(skillDir, 'SKILL.md'), [
      '---',
      'name: sample-skill',
      'description: Sample test skill',
      '---',
      '# sample-skill',
      '',
    ].join('\n'));
    write(join(skillDir, 'graph-metadata.json'), JSON.stringify({
      schema_version: 1,
      skill_id: 'sample-skill',
      family: 'system',
      category: 'test',
      domains: ['test'],
      intent_signals: ['test'],
    }));

    const projection = loadAdvisorProjection(root);
    expect(projection.source).toBe('filesystem');
    expect(projection.fallbackReason).toBeUndefined();
  });

  it('preserves the current edge and doc-trigger degradation contract across all sources', () => {
    const previousDocTriggers = process.env.SPECKIT_ADVISOR_DOC_TRIGGERS;
    process.env.SPECKIT_ADVISOR_DOC_TRIGGERS = 'true';
    try {
      const sqliteRoot = workspace('advisor-projection-sqlite-parity');
      const sqliteSkillDir = writeFilesystemSkill(sqliteRoot);
      writeSqliteFixture(sqliteRoot, join(sqliteSkillDir, 'graph-metadata.json'));

      const filesystemRoot = workspace('advisor-projection-filesystem-parity');
      writeFilesystemSkill(filesystemRoot);

      const fallbackRoot = workspace('advisor-projection-fallback-parity');
      writeFilesystemSkill(fallbackRoot);
      write(join(fallbackRoot, ADVISOR_DB_RELATIVE_PATH), Buffer.from('corrupt sqlite fixture'));
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      const sqlite = loadAdvisorProjection(sqliteRoot);
      const filesystem = loadAdvisorProjection(filesystemRoot);
      const fallback = loadAdvisorProjection(fallbackRoot);
      const sqliteSkill = sqlite.skills.find((entry) => entry.id === 'sample-skill');
      const filesystemSkill = filesystem.skills.find((entry) => entry.id === 'sample-skill');
      const fallbackSkill = fallback.skills.find((entry) => entry.id === 'sample-skill');

      expect(sqlite.source).toBe('sqlite');
      expect(sqlite.edges).not.toHaveLength(0);
      expect(sqliteSkill?.docTriggers).toEqual(expect.arrayContaining([
        expect.objectContaining({ docPath: 'references/guide.md' }),
      ]));
      expect(sqliteSkill?.derivedKeywords).toContain('wait patterns');
      expect(sqliteSkill?.derivedKeywords).not.toEqual(expect.arrayContaining([
        'assets', 'patterns', 'references', 'js', 'md',
      ]));

      expect(filesystem.source).toBe('filesystem');
      expect(filesystem.edges).toEqual([]);
      expect(filesystemSkill?.docTriggers).toBeUndefined();
      expect(filesystemSkill?.derivedKeywords).toContain('wait patterns');
      expect(filesystemSkill?.derivedKeywords).not.toEqual(expect.arrayContaining([
        'assets', 'patterns', 'references', 'js', 'md',
      ]));

      expect(fallback.source).toBe('filesystem-fallback');
      expect(fallback.edges).toEqual([]);
      expect(fallbackSkill?.docTriggers).toBeUndefined();
    } finally {
      if (previousDocTriggers === undefined) delete process.env.SPECKIT_ADVISOR_DOC_TRIGGERS;
      else process.env.SPECKIT_ADVISOR_DOC_TRIGGERS = previousDocTriggers;
    }
  });

  // drift: verified against shipped behavior during Unit H
  it('returns source=filesystem-fallback with a reason when the SQLite DB is corrupt', () => {
    const root = workspace('advisor-projection-corrupt-db');
    // Write a corrupt sqlite file at the path that loadSqliteProjection looks
    // for. better-sqlite3 will throw when it tries to open this.
    const dbPath = join(root, ADVISOR_DB_RELATIVE_PATH);
    write(dbPath, Buffer.from('this is not a valid SQLite database'));
    // Also add a filesystem skill so the fallback has content to return.
    const skillDir = join(root, '.opencode', 'skills', 'sample-skill');
    write(join(skillDir, 'SKILL.md'), [
      '---',
      'name: sample-skill',
      'description: Sample test skill',
      '---',
      '# sample-skill',
      '',
    ].join('\n'));
    write(join(skillDir, 'graph-metadata.json'), JSON.stringify({
      schema_version: 1,
      skill_id: 'sample-skill',
      family: 'system',
      category: 'test',
    }));

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const projection = loadAdvisorProjection(root);
    expect(projection.source).toBe('filesystem-fallback');
    expect(projection.fallbackReason).toBeDefined();
    expect(projection.fallbackReason!.length).toBeGreaterThan(0);
    expect(warnSpy).toHaveBeenCalled();
    expect(warnSpy.mock.calls[0]?.[0]).toContain('SQLite projection failed');
    // Filesystem fallback still returns the on-disk skill content.
    expect(projection.skills.some((entry) => entry.id === 'sample-skill')).toBe(true);
  });
});
