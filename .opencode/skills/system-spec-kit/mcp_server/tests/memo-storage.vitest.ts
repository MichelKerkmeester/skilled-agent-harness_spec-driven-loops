import { describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';

import { createMemoStore } from '../lib/storage/memo';

describe('memo storage foundation', () => {
  it('upserts memo records and reads them by input and code hash', () => {
    const db = new Database(':memory:');
    try {
      const store = createMemoStore(db);
      store.upsertMemoRecord({
        componentPath: '/workspace/spec.md',
        inputFingerprint: 'input-a',
        codeHash: 'code-a',
        outputBlob: JSON.stringify({ rowIds: [1, 2] }),
      });

      expect(store.getMemoRecord('/workspace/spec.md', 'input-a', 'code-a')).toMatchObject({
        componentPath: '/workspace/spec.md',
        inputFingerprint: 'input-a',
        codeHash: 'code-a',
        outputBlob: JSON.stringify({ rowIds: [1, 2] }),
      });
      expect(store.getMemoRecord('/workspace/spec.md', 'input-a', 'code-b')).toBeNull();
    } finally {
      db.close();
    }
  });

  it('walks dependency edges transitively and invalidates dependent memo rows only', () => {
    const db = new Database(':memory:');
    try {
      const store = createMemoStore(db);
      store.addDependencyEdge({ parentPath: 'source', childPath: 'child-a', kind: 'derived' });
      store.addDependencyEdge({ parentPath: 'child-a', childPath: 'child-b', kind: 'derived' });
      store.upsertMemoRecord({ componentPath: 'source', inputFingerprint: 'i', codeHash: 'c', outputBlob: '{}' });
      store.upsertMemoRecord({ componentPath: 'child-a', inputFingerprint: 'i', codeHash: 'c', outputBlob: '{}' });
      store.upsertMemoRecord({ componentPath: 'child-b', inputFingerprint: 'i', codeHash: 'c', outputBlob: '{}' });
      store.upsertMemoRecord({ componentPath: 'unrelated', inputFingerprint: 'i', codeHash: 'c', outputBlob: '{}' });

      const result = store.invalidateDependents(['source']);

      expect(result.invalidatedPaths).toEqual(['child-a', 'child-b']);
      expect(result.deletedMemoRecords).toBe(2);
      expect(store.getMemoRecord('source', 'i', 'c')).not.toBeNull();
      expect(store.getMemoRecord('child-a', 'i', 'c')).toBeNull();
      expect(store.getMemoRecord('child-b', 'i', 'c')).toBeNull();
      expect(store.getMemoRecord('unrelated', 'i', 'c')).not.toBeNull();
    } finally {
      db.close();
    }
  });

  it('rejects dependency cycles', () => {
    const db = new Database(':memory:');
    try {
      const store = createMemoStore(db);
      store.addDependencyEdge({ parentPath: 'a', childPath: 'b', kind: 'derived' });
      store.addDependencyEdge({ parentPath: 'b', childPath: 'c', kind: 'derived' });

      expect(() => store.addDependencyEdge({ parentPath: 'c', childPath: 'a', kind: 'derived' }))
        .toThrow(/cycle/);
    } finally {
      db.close();
    }
  });
});
