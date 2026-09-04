import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import Database from 'better-sqlite3';
import { describe, expect, it } from 'vitest';

function createFixtureDb(): string {
  const dir = mkdtempSync(join(tmpdir(), 'frontmatter-tier-retrofix-'));
  const dbPath = join(dir, 'fixture.sqlite');
  const db = new Database(dbPath);
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      importance_tier TEXT,
      document_type TEXT,
      content_text TEXT,
      updated_at TEXT
    );
  `);
  const insert = db.prepare(`
    INSERT INTO memory_index (id, importance_tier, document_type, content_text, updated_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `);
  insert.run(1, 'critical', 'memory', '# Notes\nBody quotes [CRITICAL] output');
  insert.run(2, 'critical', 'memory', '---\nimportance_tier: critical\n---\nBody quotes [CRITICAL] output');
  insert.run(3, 'important', 'memory', '---\nimportance_tier: normal\n---\nBody quotes [IMPORTANT] output');
  insert.run(4, 'normal', 'memory', '# Normal\nBody quotes [CRITICAL] output');
  db.close();
  return dbPath;
}

describe('frontmatter-only tier retro-fix migration', () => {
  it('defaults to dry-run and counts rows inflated by body markers only', () => {
    const dbPath = createFixtureDb();

    const output = execFileSync('node', [
      'scripts/migrations/retrofix-frontmatter-only-tiers.mjs',
      '--db',
      dbPath,
    ], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });
    const result = JSON.parse(output) as Record<string, unknown>;

    expect(result).toMatchObject({
      script: 'retrofix-frontmatter-only-tiers',
      mode: 'dry-run',
      eligibleRows: 2,
      criticalRows: 1,
      importantRows: 1,
      updated: 0,
    });
  });

  it('applies audited frontmatter recompute and rolls back from the audit trail', () => {
    const dbPath = createFixtureDb();

    const applyOutput = execFileSync('node', [
      'scripts/migrations/retrofix-frontmatter-only-tiers.mjs',
      '--db',
      dbPath,
      '--apply',
      '--baseline-count',
      '2',
      '--checkpoint-name',
      'pre-retrofix-fixture',
    ], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });
    const applyResult = JSON.parse(applyOutput) as Record<string, unknown>;

    const afterApplyDb = new Database(dbPath, { readonly: true });
    const appliedRows = afterApplyDb.prepare('SELECT id, importance_tier FROM memory_index ORDER BY id').all() as Array<Record<string, unknown>>;
    const auditCount = (afterApplyDb.prepare('SELECT COUNT(*) AS count FROM memory_tier_migration_audit').get() as { count: number }).count;
    afterApplyDb.close();

    expect(applyResult).toMatchObject({ mode: 'apply', audited: 2, updated: 2 });
    expect(auditCount).toBe(2);
    expect(appliedRows).toEqual([
      { id: 1, importance_tier: 'normal' },
      { id: 2, importance_tier: 'critical' },
      { id: 3, importance_tier: 'normal' },
      { id: 4, importance_tier: 'normal' },
    ]);

    const rollbackOutput = execFileSync('node', [
      'scripts/migrations/retrofix-frontmatter-only-tiers.mjs',
      '--db',
      dbPath,
      '--rollback',
      '--baseline-count',
      '2',
      '--checkpoint-name',
      'pre-retrofix-fixture',
    ], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });
    const rollbackResult = JSON.parse(rollbackOutput) as Record<string, unknown>;

    const afterRollbackDb = new Database(dbPath, { readonly: true });
    const restoredRows = afterRollbackDb.prepare('SELECT id, importance_tier FROM memory_index ORDER BY id').all() as Array<Record<string, unknown>>;
    afterRollbackDb.close();

    expect(rollbackResult).toMatchObject({ mode: 'rollback', restored: 2, rollbackAuditRows: 2 });
    expect(restoredRows).toEqual([
      { id: 1, importance_tier: 'critical' },
      { id: 2, importance_tier: 'critical' },
      { id: 3, importance_tier: 'important' },
      { id: 4, importance_tier: 'normal' },
    ]);
  });
});
