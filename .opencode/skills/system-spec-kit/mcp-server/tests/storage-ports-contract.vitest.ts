// -------------------------------------------------------------------
// TEST: STORAGE PORT CONTRACTS
// -------------------------------------------------------------------

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import Database from 'better-sqlite3';
import { describe, expect, it } from 'vitest';

import {
  BetterSqliteContentionPolicy,
  BetterSqliteGraphTraversal,
  BetterSqliteMaintenance,
  BetterSqliteVectorStore,
  PackedBm25LexicalSearch,
  type ContentionPolicy,
  type GraphTraversal,
  type LexicalSearch,
  type Maintenance,
  type VectorMetadata,
  type VectorStore,
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

interface EnvSnapshot {
  readonly EMBEDDING_DIM: string | undefined;
  readonly MEMORY_ALLOWED_PATHS: string | undefined;
}

type VectorFixtureMetadata = VectorMetadata & {
  readonly spec_folder: string;
  readonly file_path: string;
  readonly title: string;
};

function snapshotEnv(): EnvSnapshot {
  return {
    EMBEDDING_DIM: process.env.EMBEDDING_DIM,
    MEMORY_ALLOWED_PATHS: process.env.MEMORY_ALLOWED_PATHS,
  };
}

function restoreEnv(snapshot: EnvSnapshot): void {
  if (snapshot.EMBEDDING_DIM === undefined) {
    delete process.env.EMBEDDING_DIM;
  } else {
    process.env.EMBEDDING_DIM = snapshot.EMBEDDING_DIM;
  }
  if (snapshot.MEMORY_ALLOWED_PATHS === undefined) {
    delete process.env.MEMORY_ALLOWED_PATHS;
  } else {
    process.env.MEMORY_ALLOWED_PATHS = snapshot.MEMORY_ALLOWED_PATHS;
  }
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
  insertCausal.run('2', '3', 'enabled', 0.5);

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
      { sourceId: 2, targetId: 3, relation: 'enabled', strength: 0.5 },
    ],
    dependencyEdges: [
      { parentPath: 'root', childPath: 'child' },
      { parentPath: 'child', childPath: 'grandchild' },
    ],
  });
}

function createBetterSqliteVectorSubject(): ContractSubject<VectorStore<VectorFixtureMetadata>> {
  const env = snapshotEnv();
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vector-store-port-'));
  process.env.EMBEDDING_DIM = '4';
  process.env.MEMORY_ALLOWED_PATHS = tempDir;
  const store = new BetterSqliteVectorStore({ dbPath: path.join(tempDir, 'context-index.sqlite') });
  return {
    port: store,
    cleanup: () => {
      void store.close();
      restoreEnv(env);
      fs.rmSync(tempDir, { recursive: true, force: true });
    },
  };
}

function createBetterSqliteMaintenanceSubject(): ContractSubject<Maintenance> {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'maintenance-port-'));
  const database = new Database(path.join(tempDir, 'maintenance.sqlite'));
  database.pragma('auto_vacuum = INCREMENTAL');
  database.exec('VACUUM');
  database.pragma('journal_mode = WAL');
  database.exec(`
    CREATE TABLE records (id INTEGER PRIMARY KEY, value TEXT NOT NULL);
    INSERT INTO records (value) VALUES ('kept'), ('deleted');
    DELETE FROM records WHERE value = 'deleted';
  `);

  return {
    port: new BetterSqliteMaintenance(database),
    cleanup: () => {
      database.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
    },
  };
}

function createBetterSqliteContentionSubject(): ContractSubject<ContentionPolicy> & { database: Database.Database } {
  const database = new Database(':memory:');
  database.exec('CREATE TABLE writes (id INTEGER PRIMARY KEY, value TEXT NOT NULL)');
  return {
    database,
    port: new BetterSqliteContentionPolicy({
      database,
      sleep: async () => undefined,
      sleepSync: () => undefined,
    }),
    cleanup: () => database.close(),
  };
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
        expect(results.get(3)).toEqual({ nodeId: 3, minHop: 2, maxWalkScore: 2 });
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

function runVectorStoreContract(
  label: string,
  createSubject: () => ContractSubject<VectorStore<VectorFixtureMetadata>>,
): void {
  describe(label, () => {
    it('stores vectors and returns ranked matches through the port', async () => {
      const subject = createSubject();
      try {
        await subject.port.upsert({
          id: 'left',
          embedding: [1, 0, 0, 0],
          metadata: {
            spec_folder: 'specs/vector-port',
            file_path: 'left.md',
            title: 'Left vector',
          },
        });
        await subject.port.upsert({
          id: 'right',
          embedding: [0, 1, 0, 0],
          metadata: {
            spec_folder: 'specs/vector-port',
            file_path: 'right.md',
            title: 'Right vector',
          },
        });

        const results = await subject.port.search([1, 0, 0, 0], { limit: 2, minScore: 0 });

        expect(results).toHaveLength(2);
        expect(results[0]?.metadata.title).toBe('Left vector');
        expect(results[0]?.score).toBeGreaterThanOrEqual(results[1]?.score ?? 0);

        const stored = await subject.port.get(String(results[0]?.id));
        expect(stored?.metadata.title).toBe('Left vector');
        expect(await subject.port.delete(String(results[0]?.id))).toBe(true);
        expect(await subject.port.get(String(results[0]?.id))).toBeNull();
      } finally {
        subject.cleanup();
      }
    });

    it('treats caller-supplied upsert ids as advisory and assigns canonical ids', async () => {
      const subject = createSubject();
      try {
        await subject.port.upsert({
          id: 'caller-chosen-id',
          embedding: [0, 0, 1, 0],
          metadata: {
            spec_folder: 'specs/vector-port',
            file_path: 'advisory.md',
            title: 'Advisory id vector',
          },
        });

        const results = await subject.port.search([0, 0, 1, 0], { limit: 1, minScore: 0 });
        expect(results).toHaveLength(1);
        const assignedId = String(results[0]?.id);
        expect(assignedId).not.toBe('caller-chosen-id');

        const stored = await subject.port.get(assignedId);
        expect(stored?.metadata.title).toBe('Advisory id vector');
        expect(String(stored?.id)).toBe(assignedId);

        expect(await subject.port.get('caller-chosen-id')).toBeNull();
      } finally {
        subject.cleanup();
      }
    });

    it('clears the full store scope, including lookups by assigned id', async () => {
      const subject = createSubject();
      try {
        await subject.port.upsert({
          id: 'clear-me',
          embedding: [1, 0, 0, 0],
          metadata: {
            spec_folder: 'specs/vector-port',
            file_path: 'clear.md',
            title: 'Clear vector',
          },
        });

        const before = await subject.port.search([1, 0, 0, 0], { limit: 1, minScore: 0 });
        expect(before).toHaveLength(1);
        const assignedId = String(before[0]?.id);

        await subject.port.clear();

        expect(await subject.port.search([1, 0, 0, 0], { limit: 5, minScore: 0 })).toEqual([]);
        expect(await subject.port.get(assignedId)).toBeNull();
      } finally {
        subject.cleanup();
      }
    });
  });
}

function runMaintenanceContract(
  label: string,
  createSubject: () => ContractSubject<Maintenance>,
): void {
  describe(label, () => {
    it('reports storage integrity through the port', () => {
      const subject = createSubject();
      try {
        expect(subject.port.integrityCheck().ok).toBe(true);
      } finally {
        subject.cleanup();
      }
    });

    it('runs vacuum and checkpoint maintenance through the port', () => {
      const subject = createSubject();
      try {
        expect(subject.port.vacuum().ok).toBe(true);
        expect(subject.port.checkpoint({ mode: 'truncate' }).ok).toBe(true);
      } finally {
        subject.cleanup();
      }
    });
  });
}

function runContentionPolicyContract(
  label: string,
  createSubject: () => ContractSubject<ContentionPolicy>,
): void {
  describe(label, () => {
    it('retries transient failures through the port', async () => {
      const subject = createSubject();
      try {
        let attempts = 0;

        const result = await subject.port.withRetry(() => {
          attempts += 1;
          if (attempts === 1) {
            const error = new Error('SQLITE_BUSY: database is locked');
            (error as unknown as { code: string }).code = 'SQLITE_BUSY';
            throw error;
          }
          return 'ok';
        }, { attempts: 2 });

        expect(result).toBe('ok');
        expect(attempts).toBe(2);
      } finally {
        subject.cleanup();
      }
    });

    it('runs exclusive write sections through the port', async () => {
      const subject = createSubject();
      try {
        const result = await subject.port.withWriteLock(() => 'locked', { sync: true });

        expect(result).toBe('locked');
      } finally {
        subject.cleanup();
      }
    });

    it('derives the attempt budget from the retry-delay schedule', async () => {
      const subject = createSubject();
      try {
        let attempts = 0;

        const result = await subject.port.withRetry(() => {
          attempts += 1;
          if (attempts < 3) {
            const error = new Error('SQLITE_BUSY: database is locked');
            (error as unknown as { code: string }).code = 'SQLITE_BUSY';
            throw error;
          }
          return 'ok';
        }, { retryDelaysMs: [0, 0] });

        expect(result).toBe('ok');
        expect(attempts).toBe(3);
      } finally {
        subject.cleanup();
      }
    });

    it('honors shouldAbort between retries and resolves undefined', async () => {
      const subject = createSubject();
      try {
        let attempts = 0;

        const result = await subject.port.withRetry(() => {
          attempts += 1;
          const error = new Error('SQLITE_BUSY: database is locked');
          (error as unknown as { code: string }).code = 'SQLITE_BUSY';
          throw error;
        }, { retryDelaysMs: [0, 0], shouldAbort: () => attempts >= 2 });

        expect(result).toBeUndefined();
        expect(attempts).toBe(2);
      } finally {
        subject.cleanup();
      }
    });

    it('returns a non-thenable value in sync mode', () => {
      const subject = createSubject();
      try {
        const result = subject.port.withRetry(() => 'sync-ok', { sync: true });

        expect(result).toBe('sync-ok');
        expect(result).not.toHaveProperty('then');
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

runVectorStoreContract('BetterSqliteVectorStore contract', createBetterSqliteVectorSubject);

runVectorStoreContract('FakeVectorStore contract', () => ({
  port: new FakeVectorStore<VectorFixtureMetadata>(),
  cleanup: () => {},
}));

runMaintenanceContract('BetterSqliteMaintenance contract', createBetterSqliteMaintenanceSubject);

runMaintenanceContract('FakeMaintenance contract', () => ({
  port: new FakeMaintenance({ ok: true, message: 'healthy' }),
  cleanup: () => {},
}));

runContentionPolicyContract('BetterSqliteContentionPolicy contract', createBetterSqliteContentionSubject);

runContentionPolicyContract('FakeContentionPolicy contract', () => ({
  port: new FakeContentionPolicy(),
  cleanup: () => {},
}));

describe('BetterSqliteContentionPolicy', () => {
  it('applies better-sqlite busy_timeout pragmas through the port', () => {
    const subject = createBetterSqliteContentionSubject();
    try {
      subject.port.setBusyTimeout(subject.database, 1234);

      expect(subject.database.pragma('busy_timeout', { simple: true })).toBe(1234);
    } finally {
      subject.cleanup();
    }
  });
});

describe('storage port fakes', () => {
  it('FakeVectorStore assigns ids by metadata identity and returns cosine-ranked matches', () => {
    const store = new FakeVectorStore<VectorFixtureMetadata & { readonly type: string }>();
    const leftMetadata = {
      spec_folder: 'specs/fake-vector',
      file_path: 'left.md',
      title: 'Left axis',
      type: 'axis',
    };
    store.upsert({ id: 'left', embedding: [1, 0], metadata: leftMetadata });
    store.upsert({
      id: 'right',
      embedding: [0, 1],
      metadata: {
        spec_folder: 'specs/fake-vector',
        file_path: 'right.md',
        title: 'Right axis',
        type: 'axis',
      },
    });

    const results = store.search([1, 0], { limit: 2, minScore: 0 });

    expect(results.map((result) => result.metadata.file_path)).toEqual(['left.md', 'right.md']);
    const leftId = String(results[0]?.id);
    expect(leftId).not.toBe('left');
    expect(store.get('left')).toBeNull();
    expect(store.get(leftId)?.metadata.type).toBe('axis');

    store.upsert({ id: 'ignored-replacement-id', embedding: [0.5, 0], metadata: leftMetadata });
    expect(store.search([1, 0], { limit: 5, minScore: 0 })).toHaveLength(2);
    expect(String(store.get(leftId)?.id)).toBe(leftId);

    expect(store.delete('left')).toBe(false);
    expect(store.delete(leftId)).toBe(true);
    expect(store.get(leftId)).toBeNull();
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
        const error = new Error('SQLITE_BUSY: database is locked');
        (error as unknown as { code: string }).code = 'SQLITE_BUSY';
        throw error;
      }
      return 'ok';
    }, { attempts: 2 });

    expect(result).toBe('ok');
    expect(attempts).toBe(2);
    await expect(policy.withWriteLock(() => 'locked')).resolves.toBe('locked');
    const database = new Database(':memory:');
    policy.setBusyTimeout(database, 250);
    database.close();
    expect(policy.busyTimeouts).toEqual([250]);
  });
});
