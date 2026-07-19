// TEST: History Legacy-Table Rebuild Atomicity
// The legacy memory_history rebuild (RENAME -> CREATE -> INSERT -> DROP) must run
// inside a single transaction so a crash mid-rebuild rolls back instead of
// stranding the audit log in an empty new table the re-run guard no longer trips.
import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as history from '../lib/storage/history';

describe('history legacy-table rebuild atomicity', () => {
  let db: Database.Database;

  function seedLegacyHistory(): void {
    db.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY,
        title TEXT,
        spec_folder TEXT
      )
    `);
    db.prepare('INSERT INTO memory_index (id, title, spec_folder) VALUES (?, ?, ?)')
      .run(1, 'Memory 1', 'specs/001-history');

    // Legacy schema: the CHECK(actor IN ...) + FOREIGN KEY trip the rebuild guard.
    db.exec(`
      CREATE TABLE memory_history (
        id TEXT PRIMARY KEY,
        memory_id INTEGER NOT NULL,
        prev_value TEXT,
        new_value TEXT,
        event TEXT NOT NULL CHECK(event IN ('ADD', 'UPDATE', 'DELETE')),
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0,
        actor TEXT DEFAULT 'system' CHECK(actor IN ('user', 'system', 'hook', 'decay')),
        FOREIGN KEY (memory_id) REFERENCES memory_index(id)
      )
    `);
    db.prepare(`
      INSERT INTO memory_history (id, memory_id, prev_value, new_value, event, actor)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('legacy-row', 1, 'before', 'after', 'UPDATE', 'system');
  }

  beforeEach(() => {
    db = new Database(':memory:');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    db.close();
  });

  it('rolls back the whole rebuild when the copy fails, preserving the audit log', () => {
    seedLegacyHistory();

    // Fail on the INSERT...SELECT/DROP step, after RENAME + CREATE. Without an
    // enclosing transaction this would leave an empty new table + orphaned
    // memory_history_old and strand the row permanently.
    const realExec = db.exec.bind(db);
    vi.spyOn(db, 'exec').mockImplementation((sql: string) => {
      if (/INSERT INTO memory_history/i.test(sql) && /memory_history_old/i.test(sql)) {
        throw new Error('simulated crash during history rebuild');
      }
      return realExec(sql);
    });

    expect(() => history.init(db)).toThrow(/simulated crash during history rebuild/);

    vi.restoreAllMocks();

    // The original table and its row must survive the rolled-back rebuild.
    const tables = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('memory_history','memory_history_old')",
    ).all() as Array<{ name: string }>;
    const tableNames = tables.map((row) => row.name);
    expect(tableNames).toContain('memory_history');
    expect(tableNames).not.toContain('memory_history_old');

    const rows = db.prepare('SELECT id, prev_value, new_value FROM memory_history').all() as Array<{
      id: string;
      prev_value: string | null;
      new_value: string | null;
    }>;
    expect(rows).toEqual([{ id: 'legacy-row', prev_value: 'before', new_value: 'after' }]);
  });

  it('completes the rebuild and carries the legacy row forward on success', () => {
    seedLegacyHistory();

    history.init(db);

    const schema = db.prepare(
      "SELECT sql FROM sqlite_master WHERE type='table' AND name='memory_history'",
    ).get() as { sql: string };
    expect(schema.sql).not.toMatch(/FOREIGN KEY/);
    expect(schema.sql).not.toMatch(/CHECK\(actor IN/);

    const row = db.prepare('SELECT id, new_value FROM memory_history WHERE id = ?').get('legacy-row') as {
      id: string;
      new_value: string | null;
    };
    expect(row).toEqual({ id: 'legacy-row', new_value: 'after' });
  });
});
