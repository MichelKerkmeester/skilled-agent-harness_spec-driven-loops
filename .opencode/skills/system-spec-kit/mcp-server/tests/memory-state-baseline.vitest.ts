import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import Database from 'better-sqlite3';
import { captureMemoryStateBaselineSnapshot } from '../lib/eval/memory-state-baseline';
import { closeEvalDb, getEvalDbPath } from '../lib/eval/eval-db';

const originalSpecKitDbDir = process.env.SPEC_KIT_DB_DIR;
const originalSpeckitDbDir = process.env.SPECKIT_DB_DIR;
const originalMemoryDbPath = process.env.MEMORY_DB_PATH;

function createContextDb(dbPath: string): void {
  const db = new Database(dbPath);
  try {
    db.exec(`
      CREATE TABLE schema_version (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        version INTEGER NOT NULL
      );
      INSERT INTO schema_version (id, version) VALUES (1, 21);

      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY,
        spec_folder TEXT,
        session_id TEXT,
        context_type TEXT
      );
    `);

    db.prepare(`
      INSERT INTO memory_index (id, spec_folder, session_id, context_type)
      VALUES (?, ?, ?, ?)
    `).run(1, 'specs/015-hydra', 'session-a', 'implementation');
    db.prepare(`
      INSERT INTO memory_index (id, spec_folder, session_id, context_type)
      VALUES (?, ?, ?, ?)
    `).run(2, 'specs/015-hydra', '', 'unknown');
    db.prepare(`
      INSERT INTO memory_index (id, spec_folder, session_id, context_type)
      VALUES (?, ?, ?, ?)
    `).run(3, '', 'session-c', 'decision');
  } finally {
    db.close();
  }
}

describe('Memory state baseline snapshots', () => {
  let tempDir = '';

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'memory-state-baseline-'));
    closeEvalDb();
  });

  afterEach(() => {
    closeEvalDb();
    if (originalSpecKitDbDir === undefined) delete process.env.SPEC_KIT_DB_DIR;
    else process.env.SPEC_KIT_DB_DIR = originalSpecKitDbDir;
    if (originalSpeckitDbDir === undefined) delete process.env.SPECKIT_DB_DIR;
    else process.env.SPECKIT_DB_DIR = originalSpeckitDbDir;
    if (originalMemoryDbPath === undefined) delete process.env.MEMORY_DB_PATH;
    else process.env.MEMORY_DB_PATH = originalMemoryDbPath;
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('captures and persists baseline metrics beside the target context db', () => {
    const contextDbPath = path.join(tempDir, 'nested', 'context-index.sqlite');
    fs.mkdirSync(path.dirname(contextDbPath), { recursive: true });
    createContextDb(contextDbPath);

    const snapshot = captureMemoryStateBaselineSnapshot({
      contextDbPath,
      evalRunId: 42,
      persist: true,
      specFolder: 'specs/014-hydra-db-based-features',
    });

    expect(snapshot.evalRunId).toBe(42);
    expect(snapshot.metrics['isolation.memory_rows_total']).toBe(3);
    expect(snapshot.metrics['isolation.distinct_spec_folders']).toBe(1);
    expect(snapshot.metrics['isolation.unscoped_rows']).toBe(1);
    expect(snapshot.metrics['isolation.missing_session_scope_rows']).toBe(1);
    expect(snapshot.metrics['isolation.unknown_context_type_rows']).toBe(1);
    expect(snapshot.metrics['schema.version']).toBe(21);
    expect(snapshot.persistedRows).toBe(Object.keys(snapshot.metrics).length);

    const evalDbPath = getEvalDbPath();
    expect(evalDbPath).toBe(path.join(path.dirname(contextDbPath), 'speckit-eval.db'));

    const evalDb = new Database(evalDbPath || ':memory:', { readonly: true });
    try {
      const row = evalDb.prepare(`
        SELECT COUNT(*) AS total
        FROM eval_metric_snapshots
        WHERE eval_run_id = 42 AND channel = 'memory-state-baseline'
      `).get() as { total: number };
      expect(row.total).toBe(Object.keys(snapshot.metrics).length);
    } finally {
      evalDb.close();
    }
  });

  it('returns zeroed isolation metrics when the target context db is absent', () => {
    const snapshot = captureMemoryStateBaselineSnapshot({
      contextDbPath: path.join(tempDir, 'missing.sqlite'),
      evalRunId: 7,
    });

    expect(snapshot.metrics['isolation.memory_rows_total']).toBe(0);
    expect(snapshot.metrics['isolation.distinct_spec_folders']).toBe(0);
    expect(snapshot.metrics['schema.version']).toBe(0);
    expect(snapshot.persistedRows).toBeUndefined();
  });

  it('uses the shared resolver when no context db path is supplied', () => {
    const primaryDir = path.join(tempDir, 'primary-db');
    const secondaryDir = path.join(tempDir, 'secondary-db');
    const memoryDbPath = path.join(tempDir, 'memory-path-parent', 'custom-name.sqlite');
    fs.mkdirSync(primaryDir, { recursive: true });
    fs.mkdirSync(secondaryDir, { recursive: true });

    process.env.SPEC_KIT_DB_DIR = primaryDir;
    process.env.SPECKIT_DB_DIR = secondaryDir;
    process.env.MEMORY_DB_PATH = memoryDbPath;

    const contextDbPath = path.join(fs.realpathSync(primaryDir), path.basename(memoryDbPath));
    createContextDb(contextDbPath);

    const snapshot = captureMemoryStateBaselineSnapshot({
      evalRunId: 84,
    });

    expect(snapshot.metrics['isolation.memory_rows_total']).toBe(3);
    expect(snapshot.metadata.contextDbPath).toBe(contextDbPath);
    expect(getEvalDbPath()).toBe(path.join(path.dirname(contextDbPath), 'speckit-eval.db'));
  });
});
