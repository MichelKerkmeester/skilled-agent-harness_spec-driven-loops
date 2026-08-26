import Database from 'better-sqlite3';
import { gzipSync } from 'node:zlib';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import * as checkpointStorage from '../lib/storage/checkpoints.js';
import { createMemoryIndexTestDatabase } from './fixtures/memory-index-db.js';

let database: Database.Database;

function insertCheckpoint(name: string, memories: Array<Record<string, unknown>>): void {
  const snapshot = {
    memories,
    workingMemory: [],
    timestamp: new Date().toISOString(),
  };
  database.prepare(`
    INSERT INTO checkpoints (name, created_at, memory_snapshot, metadata)
    VALUES (?, ?, ?, ?)
  `).run(
    name,
    new Date().toISOString(),
    gzipSync(Buffer.from(JSON.stringify(snapshot))),
    JSON.stringify({ memoryCount: memories.length }),
  );
}

beforeEach(() => {
  database = createMemoryIndexTestDatabase({
    includeCheckpoints: true,
    includeWorkingMemory: true,
  });
  checkpointStorage.init(database);
});

afterEach(() => {
  database.close();
});

describe('checkpoint_restore README row round-trip', () => {
  it('restores README rows unchanged without emitting governance_audit', () => {
    const readmePath = '/workspace/.opencode/skills/system-spec-kit/mcp-server/README.md';
    insertCheckpoint('clean-readme', [
      {
        id: 7001,
        spec_folder: 'system-spec-kit/mcp-server',
        file_path: readmePath,
        canonical_file_path: readmePath,
        title: 'Repo README',
        importance_weight: 0.9,
        created_at: '2026-04-24T00:00:00Z',
        updated_at: '2026-04-24T00:00:00Z',
        importance_tier: 'important',
      },
    ]);

    const result = checkpointStorage.restoreCheckpoint('clean-readme', true);

    expect(result.errors).toEqual([]);
    expect(result.restored).toBe(1);

    const restored = database.prepare(`
      SELECT importance_tier
      FROM memory_index
      WHERE id = 7001
    `).get() as { importance_tier: string };
    expect(restored.importance_tier).toBe('important');

    const auditCount = database.prepare(`
      SELECT COUNT(*) AS count
      FROM governance_audit
    `).get() as { count: number };
    expect(auditCount.count).toBe(0);
  });
});
