import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock core/db-state so checkDatabaseUpdated does not throw when the database
// directory cannot be resolved in the test environment (same pattern as the
// memory-save UX regression suite).
vi.mock('../core/db-state', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    checkDatabaseUpdated: vi.fn(async () => false),
  };
});

vi.mock('../core', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    checkDatabaseUpdated: vi.fn(async () => false),
  };
});

import * as handler from '../handlers/memory-save';
import * as vectorIndex from '../lib/search/vector-index';

const TEST_DB_DIR = path.join(os.tmpdir(), `speckit-supersede-reindex-${process.pid}`);
const TEST_DB_PATH = path.join(TEST_DB_DIR, 'speckit-memory.db');
const FIXTURE_ROOT = path.join(
  process.cwd(),
  'tmp-test-fixtures',
  'specs',
  'system-spec-kit',
  '999-supersede-reindex-fixtures',
);
const FIXTURE_DOC_PATH = path.join(FIXTURE_ROOT, 'handover.md');
const FIXTURE_MATCH = '%999-supersede-reindex-fixtures%';

const ORIGINAL_ENV = {
  SPECKIT_AUTO_ENTITIES: process.env.SPECKIT_AUTO_ENTITIES,
  SPECKIT_MEMORY_SUMMARIES: process.env.SPECKIT_MEMORY_SUMMARIES,
  SPECKIT_ENTITY_LINKING: process.env.SPECKIT_ENTITY_LINKING,
  SPECKIT_QUALITY_LOOP: process.env.SPECKIT_QUALITY_LOOP,
  SPECKIT_SAVE_QUALITY_GATE: process.env.SPECKIT_SAVE_QUALITY_GATE,
};

// Reuses the canonical fixture-doc shape proven to pass the durable-memory gate
// in memory-save-ux-regressions; `body` is the only varying part so successive
// writes produce a different content_hash (the same-path re-index trigger).
function writeFixtureDoc(version: string, body: string): void {
  fs.mkdirSync(path.dirname(FIXTURE_DOC_PATH), { recursive: true });
  fs.writeFileSync(FIXTURE_DOC_PATH, [
    '---',
    'title: "Supersede Reindex Fixture"',
    'description: "Durable regression fixture for same-path re-index supersede coverage."',
    'trigger_phrases:',
    '  - "supersede-reindex"',
    '  - "memory-index-dedup"',
    'importance_tier: "important"',
    'contextType: "implementation"',
    '_memory:',
    '  continuity:',
    '    packet_pointer: "system-spec-kit/999-supersede-reindex-fixtures"',
    '    last_updated_at: "2026-04-15T07:30:00Z"',
    '    last_updated_by: "vitest-fixture"',
    `    recent_action: "Indexed ${version} of the supersede fixture"`,
    '    next_safe_action: "Re-index with changed content to exercise supersede"',
    '    blockers: []',
    '    key_files:',
    '      - "implementation-summary.md"',
    '    completion_pct: 50',
    '    open_questions: []',
    '    answered_questions: []',
    '---',
    '',
    '<!-- SPECKIT_LEVEL: 3 -->',
    '# Supersede Reindex Fixture',
    '',
    '<!-- ANCHOR:overview -->',
    '## Overview',
    '',
    `${body}`,
    '',
    '<!-- /ANCHOR:overview -->',
    '',
    '<!-- ANCHOR:evidence -->',
    '## Distinguishing Evidence',
    '',
    `- ${body}`,
    '- Same canonical path re-indexed with changed content.',
    '',
    '<!-- /ANCHOR:evidence -->',
    '',
  ].join('\n'), 'utf8');
}

interface IndexRow {
  id: number;
  importance_tier: string | null;
  content_text: string | null;
}

function fixtureRows(): IndexRow[] {
  const db = vectorIndex.getDb();
  return db
    .prepare(
      'SELECT id, importance_tier, content_text FROM memory_index '
      + 'WHERE file_path LIKE ? OR spec_folder LIKE ? ORDER BY id',
    )
    .all(FIXTURE_MATCH, FIXTURE_MATCH) as IndexRow[];
}

function activeProjectionTargets(): number[] {
  const db = vectorIndex.getDb();
  const rows = db
    .prepare(
      'SELECT active_memory_id FROM active_memory_projection WHERE active_memory_id IN '
      + '(SELECT id FROM memory_index WHERE file_path LIKE ? OR spec_folder LIKE ?)',
    )
    .all(FIXTURE_MATCH, FIXTURE_MATCH) as Array<{ active_memory_id: number }>;
  return rows.map((row) => row.active_memory_id);
}

function cleanupFixtureRows(): void {
  const db = vectorIndex.getDb();
  if (!db) return;
  db.prepare(
    'DELETE FROM active_memory_projection WHERE active_memory_id IN '
    + '(SELECT id FROM memory_index WHERE file_path LIKE ? OR spec_folder LIKE ?)',
  ).run(FIXTURE_MATCH, FIXTURE_MATCH);
  db.prepare(
    'DELETE FROM memory_lineage WHERE memory_id IN '
    + '(SELECT id FROM memory_index WHERE file_path LIKE ? OR spec_folder LIKE ?)',
  ).run(FIXTURE_MATCH, FIXTURE_MATCH);
  db.prepare(
    'DELETE FROM memory_history WHERE memory_id IN '
    + '(SELECT id FROM memory_index WHERE file_path LIKE ? OR spec_folder LIKE ?)',
  ).run(FIXTURE_MATCH, FIXTURE_MATCH);
  db.prepare('DELETE FROM memory_index WHERE file_path LIKE ? OR spec_folder LIKE ?').run(
    FIXTURE_MATCH,
    FIXTURE_MATCH,
  );
}

beforeAll(() => {
  fs.mkdirSync(TEST_DB_DIR, { recursive: true });
  const previousMemoryDbPath = process.env.MEMORY_DB_PATH;
  process.env.MEMORY_DB_PATH = TEST_DB_PATH;
  try {
    vectorIndex.closeDb();
  } catch {
    // Ignore cleanup errors in tests
  }
  vectorIndex.initializeDb();
  if (previousMemoryDbPath === undefined) delete process.env.MEMORY_DB_PATH;
  else process.env.MEMORY_DB_PATH = previousMemoryDbPath;
});

beforeEach(() => {
  // Keep the re-index test focused on the persistence/supersede path and away
  // from optional enrichment that can spawn additional index rows.
  process.env.SPECKIT_AUTO_ENTITIES = 'false';
  process.env.SPECKIT_MEMORY_SUMMARIES = 'false';
  process.env.SPECKIT_ENTITY_LINKING = 'false';
  process.env.SPECKIT_QUALITY_LOOP = 'false';
  delete process.env.SPECKIT_SAVE_QUALITY_GATE;
});

afterEach(() => {
  cleanupFixtureRows();
  fs.rmSync(FIXTURE_ROOT, { recursive: true, force: true });
  if (ORIGINAL_ENV.SPECKIT_AUTO_ENTITIES === undefined) delete process.env.SPECKIT_AUTO_ENTITIES;
  else process.env.SPECKIT_AUTO_ENTITIES = ORIGINAL_ENV.SPECKIT_AUTO_ENTITIES;
  if (ORIGINAL_ENV.SPECKIT_MEMORY_SUMMARIES === undefined) delete process.env.SPECKIT_MEMORY_SUMMARIES;
  else process.env.SPECKIT_MEMORY_SUMMARIES = ORIGINAL_ENV.SPECKIT_MEMORY_SUMMARIES;
  if (ORIGINAL_ENV.SPECKIT_ENTITY_LINKING === undefined) delete process.env.SPECKIT_ENTITY_LINKING;
  else process.env.SPECKIT_ENTITY_LINKING = ORIGINAL_ENV.SPECKIT_ENTITY_LINKING;
  if (ORIGINAL_ENV.SPECKIT_QUALITY_LOOP === undefined) delete process.env.SPECKIT_QUALITY_LOOP;
  else process.env.SPECKIT_QUALITY_LOOP = ORIGINAL_ENV.SPECKIT_QUALITY_LOOP;
  if (ORIGINAL_ENV.SPECKIT_SAVE_QUALITY_GATE === undefined) delete process.env.SPECKIT_SAVE_QUALITY_GATE;
  else process.env.SPECKIT_SAVE_QUALITY_GATE = ORIGINAL_ENV.SPECKIT_SAVE_QUALITY_GATE;
});

afterAll(() => {
  try {
    vectorIndex.closeDb();
  } catch {
    // Ignore cleanup errors in tests
  }
  fs.rmSync(TEST_DB_DIR, { recursive: true, force: true });
  fs.rmSync(FIXTURE_ROOT, { recursive: true, force: true });
});

describe('memory_index_scan same-path re-index supersede', () => {
  it('supersedes a changed doc by deprecating the predecessor, leaving one active row', async () => {
    writeFixtureDoc('v1', 'Initial fixture body describing the original handover state.');
    // Spec docs index under warn-only during scan/force reindex (memory-index.ts),
    // so the sufficiency floor is advisory here — matching real scan behavior.
    await handler.index_memory_file_from_scan(FIXTURE_DOC_PATH, { force: true, qualityGateMode: 'warn-only' });

    const afterFirst = fixtureRows();
    expect(afterFirst).toHaveLength(1);
    const firstId = afterFirst[0].id;

    // Re-index the SAME path with changed content (new content_hash) — this is
    // the same-path supersede branch that previously appended a deprecated
    // duplicate row.
    writeFixtureDoc('v2', 'Revised fixture body reflecting the superseding handover state.');
    await handler.index_memory_file_from_scan(FIXTURE_DOC_PATH, { force: true, qualityGateMode: 'warn-only' });

    const afterSecond = fixtureRows();
    const active = afterSecond.filter((row) => row.importance_tier !== 'deprecated');
    const deprecated = afterSecond.filter((row) => row.importance_tier === 'deprecated');
    // Core regression: exactly one ACTIVE row per logical key (the active-row guard).
    // The predecessor is retired by deprecation BEFORE the new insert — kept for
    // lineage/history, removed from the active-row guard — so it coexists with the
    // partial unique index instead of colliding (insert-then-delete would throw).
    expect(active).toHaveLength(1);
    expect(deprecated).toHaveLength(1);
    expect(deprecated[0].id).toBe(firstId);

    const survivor = active[0];
    // The active row is the NEW version (append happened), not the predecessor.
    expect(survivor.id).not.toBe(firstId);
    // Surviving active content reflects v2.
    expect(survivor.content_text ?? '').toContain('superseding handover state');

    // The active projection points at the surviving active row only.
    expect(activeProjectionTargets()).toEqual([survivor.id]);
  });
});
