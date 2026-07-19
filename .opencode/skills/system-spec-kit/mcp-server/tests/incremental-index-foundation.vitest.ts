import { describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';

import { canonicalFingerprint, codeHash } from '../lib/storage/canonical-fingerprint';
import { createMemoStore } from '../lib/storage/memo';
import { planMemoizedIndexing } from '../lib/storage/incremental-index';

function createPlannerDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL,
      file_path TEXT NOT NULL,
      canonical_file_path TEXT,
      chunk_id TEXT,
      chunk_fingerprint TEXT,
      embedding_status TEXT DEFAULT 'success'
    );
  `);
  return db;
}

describe('incremental-index memo planning foundation', () => {
  it('reports memo and chunk hits for unchanged inputs', () => {
    const db = createPlannerDb();
    try {
      const componentPath = '/workspace/spec.md';
      const canonicalInput = { path: componentPath, contentHash: 'hash-a' };
      const currentCodeHash = codeHash(['parser-v1']);
      const store = createMemoStore(db);
      store.upsertMemoRecord({
        componentPath,
        inputFingerprint: canonicalFingerprint(canonicalInput),
        codeHash: currentCodeHash,
        outputBlob: '{}',
      });
      db.prepare(`
        INSERT INTO memory_index (id, spec_folder, file_path, canonical_file_path, chunk_id, chunk_fingerprint)
        VALUES (1, 'specs/test', ?, ?, 'anchor:intro', 'chunk-a')
      `).run(componentPath, componentPath);

      const plan = planMemoizedIndexing([
        {
          componentPath,
          canonicalInput,
          codeHash: currentCodeHash,
          chunks: [{ chunkId: 'anchor:intro', chunkFingerprint: 'chunk-a' }],
        },
      ], { invalidateDependents: true }, db);

      expect(plan).toMatchObject({
        memoHits: 1,
        memoMisses: 0,
        chunkHits: 1,
        chunkMisses: 0,
        dependencyInvalidated: 0,
        changedComponentPaths: [],
        unchangedComponentPaths: [componentPath],
      });
    } finally {
      db.close();
    }
  });

  it('treats code-hash changes as misses and invalidates dependents', () => {
    const db = createPlannerDb();
    try {
      const componentPath = '/workspace/spec.md';
      const childPath = '/workspace/spec.md#summary';
      const canonicalInput = { path: componentPath, contentHash: 'hash-a' };
      const store = createMemoStore(db);
      store.upsertMemoRecord({
        componentPath,
        inputFingerprint: canonicalFingerprint(canonicalInput),
        codeHash: codeHash(['parser-v1']),
        outputBlob: '{}',
      });
      store.upsertMemoRecord({
        componentPath: childPath,
        inputFingerprint: 'child-input',
        codeHash: 'child-code',
        outputBlob: '{}',
      });
      store.addDependencyEdge({ parentPath: componentPath, childPath, kind: 'chunk' });

      const plan = planMemoizedIndexing([
        {
          componentPath,
          canonicalInput,
          codeHash: codeHash(['parser-v2']),
          chunks: [{ chunkId: 'anchor:intro', chunkFingerprint: 'chunk-a' }],
        },
      ], { invalidateDependents: true }, db);

      expect(plan.memoHits).toBe(0);
      expect(plan.memoMisses).toBe(1);
      expect(plan.chunkHits).toBe(0);
      expect(plan.chunkMisses).toBe(1);
      expect(plan.changedComponentPaths).toEqual([componentPath]);
      expect(plan.invalidatedComponentPaths).toEqual([childPath]);
      expect(plan.dependencyInvalidated).toBe(1);
      expect(store.getMemoRecord(childPath, 'child-input', 'child-code')).toBeNull();
    } finally {
      db.close();
    }
  });
});
