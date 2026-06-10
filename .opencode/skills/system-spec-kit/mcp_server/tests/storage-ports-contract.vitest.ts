// -------------------------------------------------------------------
// TEST: STORAGE PORT CONTRACTS
// -------------------------------------------------------------------

import Database from 'better-sqlite3';
import { describe, expect, it } from 'vitest';

import {
  BetterSqliteGraphTraversal,
  PackedBm25LexicalSearch,
  type GraphTraversal,
  type LexicalSearch,
} from '../lib/storage/ports';
import {
  FakeContentionPolicy,
  FakeGraphTraversal,
  FakeLexicalSearch,
  FakeMaintenance,
  FakeVectorStore,
} from './fakes/storage-ports';

interface ContractSubject<TPort> {
  readonly port: TPort;
  readonly cleanup: () => void;
}

function createGraphFixtureDb(): Database.Database {
  const database = new Database(':memory:');
  database.exec(`
    CREATE TABLE causal_edges (
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL,
      strength REAL
    );
    CREATE TABLE dependency_edges (
      parent_path TEXT NOT NULL,
      child_path TEXT NOT NULL
    );
  `);

  const insertCausal = database.prepare(`
    INSERT INTO causal_edges (source_id, target_id, relation, strength)
    VALUES (?, ?, ?, ?)
  `);
  insertCausal.run('1', '2', 'supports', 0.5);
  insertCausal.run('2', '3', 'enabled', 0.25);

  const insertDependency = database.prepare(`
    INSERT INTO dependency_edges (parent_path, child_path)
    VALUES (?, ?)
  `);
  insertDependency.run('root', 'child');
  insertDependency.run('child', 'grandchild');

  return database;
}

function createFakeGraphTraversal(): FakeGraphTraversal {
  return new FakeGraphTraversal({
    causalEdges: [
      { sourceId: 1, targetId: 2, relation: 'supports', strength: 0.5 },
      { sourceId: 2, targetId: 3, relation: 'enabled', strength: 0.25 },
    ],
    dependencyEdges: [
      { parentPath: 'root', childPath: 'child' },
      { parentPath: 'child', childPath: 'grandchild' },
    ],
  });
}

function runGraphTraversalContract(
  label: string,
  createSubject: () => ContractSubject<GraphTraversal>,
): void {
  describe(label, () => {
    it('collects weighted causal neighbors with hop and score aggregation', () => {
      const subject = createSubject();
      try {
        const results = subject.port.collectCausalWeightedNeighbors(
          [1],
          2,
          { supports: 2, enabled: 4 },
        );

        expect(results.get(2)).toEqual({ nodeId: 2, minHop: 1, maxWalkScore: 1 });
        expect(results.get(3)).toEqual({ nodeId: 3, minHop: 2, maxWalkScore: 1 });
        expect(results.has(1)).toBe(false);
      } finally {
        subject.cleanup();
      }
    });

    it('collects dependency children through directed reachability', () => {
      const subject = createSubject();
      try {
        expect(subject.port.collectDependencyReachability(['root'])).toEqual(['child', 'grandchild']);
      } finally {
        subject.cleanup();
      }
    });

    it('exposes generic directed reachability for caller-supplied readers', () => {
      const subject = createSubject();
      try {
        const reached = subject.port.collectDirectedReachability({
          roots: ['a'],
          readEdges: (nodeIds) => nodeIds.includes('a')
            ? [{ from: 'a', to: 'b' }, { from: 'a', to: 'c' }]
            : [],
        });

        expect(reached).toEqual(['b', 'c']);
      } finally {
        subject.cleanup();
      }
    });
  });
}

function runLexicalSearchContract(
  label: string,
  createSubject: () => ContractSubject<LexicalSearch>,
): void {
  describe(label, () => {
    it('indexes fielded documents and returns ranked query matches', () => {
      const subject = createSubject();
      try {
        subject.port.addDocumentFields('auth', {
          title: 'Auth guard',
          trigger_phrases: ['authentication', 'login'],
          content_generic: 'auth/module.md',
          body: 'Guarded login access for memory search',
        });
        subject.port.addDocumentFields('cache', {
          title: 'Cache invalidation',
          trigger_phrases: ['cache'],
          content_generic: 'cache/module.md',
          body: 'Background cache refresh notes',
        });

        const results = subject.port.search('auth guard', { limit: 1 });

        expect(results).toHaveLength(1);
        expect(results[0]?.id).toBe('auth');
        expect(results[0]?.score).toBeGreaterThan(0);
      } finally {
        subject.cleanup();
      }
    });

    it('removes and clears indexed documents', () => {
      const subject = createSubject();
      try {
        subject.port.addDocument('one', 'memory search document');
        subject.port.addDocument('two', 'cache refresh document');

        expect(subject.port.getStats().documentCount).toBe(2);
        expect(subject.port.removeDocument('one')).toBe(true);
        expect(subject.port.search('memory', { limit: 5 })).toEqual([]);

        subject.port.clear();
        expect(subject.port.getStats()).toEqual({
          documentCount: 0,
          termCount: 0,
          avgDocLength: 0,
        });
      } finally {
        subject.cleanup();
      }
    });
  });
}

runGraphTraversalContract('BetterSqliteGraphTraversal contract', () => {
  const database = createGraphFixtureDb();
  return {
    port: new BetterSqliteGraphTraversal(database),
    cleanup: () => database.close(),
  };
});

runGraphTraversalContract('FakeGraphTraversal contract', () => ({
  port: createFakeGraphTraversal(),
  cleanup: () => {},
}));

runLexicalSearchContract('PackedBm25LexicalSearch contract', () => ({
  port: new PackedBm25LexicalSearch(),
  cleanup: () => {},
}));

runLexicalSearchContract('FakeLexicalSearch contract', () => ({
  port: new FakeLexicalSearch(),
  cleanup: () => {},
}));

describe('storage port fakes', () => {
  it('FakeVectorStore stores vectors and returns cosine-ranked matches', () => {
    const store = new FakeVectorStore<{ readonly type: string }>();
    store.upsert({ id: 'left', embedding: [1, 0], metadata: { type: 'axis' } });
    store.upsert({ id: 'right', embedding: [0, 1], metadata: { type: 'axis' } });

    const results = store.search([1, 0], { limit: 2, minScore: 0 });

    expect(results.map((result) => result.id)).toEqual(['left', 'right']);
    expect(store.get('left')?.metadata.type).toBe('axis');
    expect(store.delete('left')).toBe(true);
    expect(store.get('left')).toBeNull();
  });

  it('FakeMaintenance records calls and returns configured results', () => {
    const maintenance = new FakeMaintenance({ ok: true, message: 'healthy' });

    expect(maintenance.integrityCheck()).toEqual({ ok: true, message: 'healthy' });
    expect(maintenance.vacuum()).toEqual({ ok: true, message: 'healthy' });
    expect(maintenance.checkpoint({ mode: 'truncate' })).toEqual({ ok: true, message: 'healthy' });
    expect(maintenance.calls).toEqual(['integrityCheck', 'vacuum', 'checkpoint:truncate']);
  });

  it('FakeContentionPolicy retries transient failures', async () => {
    const policy = new FakeContentionPolicy();
    let attempts = 0;

    const result = await policy.withRetry(() => {
      attempts += 1;
      if (attempts === 1) {
        throw new Error('busy');
      }
      return 'ok';
    }, { attempts: 2 });

    expect(result).toBe('ok');
    expect(attempts).toBe(2);
    await expect(policy.withWriteLock(() => 'locked')).resolves.toBe('locked');
  });
});
