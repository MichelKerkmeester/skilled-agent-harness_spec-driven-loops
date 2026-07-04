// ───────────────────────────────────────────────────────────────
// MODULE: Causal Graph Hygiene Migration Tests
// ───────────────────────────────────────────────────────────────

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.resolve(__dirname, '..');

function runScript(scriptName: string, args: string[]): Record<string, unknown> {
  const output = execFileSync('node', [path.join(SERVER_ROOT, 'scripts/migrations', scriptName), ...args], {
    cwd: SERVER_ROOT,
    encoding: 'utf8',
  });
  return JSON.parse(output) as Record<string, unknown>;
}

describe('causal graph hygiene migration scripts', () => {
  let tmpDir: string;
  let dbPath: string;
  let db: Database.Database;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'causal-graph-hygiene-'));
    dbPath = path.join(tmpDir, 'memory.db');
    db = new Database(dbPath);
    db.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY,
        title TEXT,
        file_path TEXT NOT NULL DEFAULT '',
        canonical_file_path TEXT,
        content_text TEXT,
        deleted_at TEXT,
        importance_tier TEXT DEFAULT 'normal'
      );
      CREATE TABLE causal_edges (
        id INTEGER PRIMARY KEY,
        source_id TEXT NOT NULL,
        target_id TEXT NOT NULL,
        source_anchor TEXT,
        target_anchor TEXT,
        relation TEXT NOT NULL,
        strength REAL DEFAULT 1.0,
        evidence TEXT,
        created_by TEXT DEFAULT 'manual',
        extraction_method TEXT DEFAULT 'manual',
        derived_id TEXT
      );
      CREATE TABLE memory_surrogates (
        id INTEGER PRIMARY KEY,
        memory_id INTEGER NOT NULL UNIQUE,
        aliases_json TEXT NOT NULL DEFAULT '[]',
        headings_json TEXT NOT NULL DEFAULT '[]',
        summary TEXT NOT NULL DEFAULT '',
        questions_json TEXT NOT NULL DEFAULT '[]',
        generated_at INTEGER NOT NULL DEFAULT 0
      );
    `);
  });

  afterEach(() => {
    db.close();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('down-weights entity-linker supports edges only when baseline-gated apply is requested', () => {
    db.exec(`
      INSERT INTO causal_edges (id, source_id, target_id, relation, strength, created_by)
      VALUES (1, '1', '2', 'supports', 0.7, 'entity_linker'),
             (2, '2', '3', 'supports', 0.7, 'manual')
    `);

    const dryRun = runScript('downweight-entity-linker-supports.mjs', ['--db', dbPath]);
    expect(dryRun).toMatchObject({ mode: 'dry-run', candidateRows: 1, updated: 0 });

    const apply = runScript('downweight-entity-linker-supports.mjs', [
      '--db', dbPath,
      '--apply',
      '--baseline-count', '1',
      '--checkpoint-name', 'fixture-checkpoint',
    ]);
    const rows = db.prepare('SELECT id, strength FROM causal_edges ORDER BY id').all() as Array<{ id: number; strength: number }>;

    expect(apply).toMatchObject({ mode: 'apply', updated: 1 });
    expect(rows).toEqual([{ id: 1, strength: 0.05 }, { id: 2, strength: 0.7 }]);
  });

  it('backfills derived ids as a dry-run-default gated migration', () => {
    db.exec(`
      INSERT INTO causal_edges (id, source_id, target_id, relation, created_by, extraction_method)
      VALUES (1, '10', '20', 'derived_from', 'auto', 'frontmatter'),
             (2, '30', '40', 'supports', 'manual', 'manual')
    `);

    const dryRun = runScript('backfill-derived-causal-edge-ids.mjs', ['--db', dbPath]);
    expect(dryRun).toMatchObject({ mode: 'dry-run', candidateRows: 1, backfilled: 0 });

    const apply = runScript('backfill-derived-causal-edge-ids.mjs', [
      '--db', dbPath,
      '--apply',
      '--baseline-count', '1',
      '--checkpoint-name', 'fixture-checkpoint',
    ]);
    const generated = db.prepare('SELECT derived_id FROM causal_edges WHERE id = 1').get() as { derived_id: string | null };
    const manual = db.prepare('SELECT derived_id FROM causal_edges WHERE id = 2').get() as { derived_id: string | null };

    expect(apply).toMatchObject({ mode: 'apply', backfilled: 1 });
    expect(generated.derived_id).toMatch(/^[a-f0-9]{64}$/);
    expect(manual.derived_id).toBeNull();
  });

  it('regenerates placeholder surrogate questions from stored titles when baseline-gated apply is requested', () => {
    db.exec(`
      INSERT INTO memory_index (id, title, file_path, importance_tier)
      VALUES (1, 'Real Title', 'real.md', 'normal')
    `);
    db.prepare(`
      INSERT INTO memory_surrogates (memory_id, questions_json, generated_at)
      VALUES (1, ?, 1)
    `).run(JSON.stringify(['What is Memory 1?', 'How does Memory 1 work?']));

    const dryRun = runScript('regenerate-placeholder-surrogate-titles.mjs', ['--db', dbPath]);
    expect(dryRun).toMatchObject({ mode: 'dry-run', candidateRows: 1, updated: 0 });

    const apply = runScript('regenerate-placeholder-surrogate-titles.mjs', [
      '--db', dbPath,
      '--apply',
      '--baseline-count', '1',
      '--checkpoint-name', 'fixture-checkpoint',
    ]);
    const row = db.prepare('SELECT questions_json FROM memory_surrogates WHERE memory_id = 1').get() as { questions_json: string };

    expect(apply).toMatchObject({ mode: 'apply', updated: 1 });
    expect(JSON.parse(row.questions_json)).toEqual(['What is real title?', 'How does real title work?']);
  });
});
