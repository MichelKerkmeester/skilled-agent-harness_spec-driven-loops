import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import Database from 'better-sqlite3';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { handleMemoryDelete } from '../../handlers/memory-crud-delete';
import {
  ensureIdempotencyReceiptSchemaForTests,
  runMigrations,
  SCHEMA_VERSION,
} from '../../lib/search/vector-index-schema';
import {
  clearSemanticTriggerCache,
  computeSemanticTriggerShadow,
} from '../../lib/triggers/semantic-trigger-matcher';
import {
  deriveIdempotencyReceiptKey,
  isMemoryIdempotencyEnabled,
  lookupIdempotencyReceipt,
  storeIdempotencyReceipt,
} from '../../lib/storage/idempotency-receipts';
import { TOOL_DEFINITIONS } from '../../tool-schemas';
import {
  createMemoryDbFixture,
  disposeMemoryDbFixture,
  seedMemoryRow,
} from '../../tests/helpers/memory-db-fixture';
import { loadTriggerGoldens, syntheticVector } from '../../tests/trigger-golden-fixture';
import {
  createTriggerDatabase,
  insertGoldenTriggerEmbeddings,
  storeQueryEmbedding,
  triggerTestProfile,
} from '../../tests/trigger-shadow-db-fixture';
import { CODE_GRAPH_TOOL_SCHEMAS } from '../../../../system-code-graph/mcp_server/tool-schemas.js';
import { SKILL_ADVISOR_CLI_TOOL_MANIFEST } from '../../../../system-skill-advisor/mcp_server/skill-advisor-cli-manifest.js';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../../..');
const cliShims = {
  specMemory: join(repoRoot, '.opencode/bin/spec-memory.cjs'),
  codeIndex: join(repoRoot, '.opencode/bin/code-index.cjs'),
  skillAdvisor: join(repoRoot, '.opencode/bin/skill-advisor.cjs'),
};

const tempRoots: string[] = [];
const originalEnv = new Map<string, string | undefined>();
for (const key of [
  'SPECKIT_MEMORY_IDEMPOTENCY',
  'SPECKIT_SOFT_DELETE_TOMBSTONES',
  'SPECKIT_SEMANTIC_TRIGGERS',
  'SPECKIT_IPC_SOCKET_DIR',
  'SPECKIT_DAEMON_REELECTION',
]) {
  originalEnv.set(key, process.env[key]);
}

type CliEnvelope = {
  status?: unknown;
  data?: {
    count?: unknown;
    tools?: Array<{ name?: unknown }>;
  };
};

function restoreEnv(): void {
  for (const [key, value] of originalEnv) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

function makeTempRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `${label}-`));
  tempRoots.push(root);
  return root;
}

function createMigrationDatabase(): Database.Database {
  const database = new Database(':memory:');
  database.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT,
      file_path TEXT,
      title TEXT,
      content_text TEXT,
      trigger_phrases TEXT,
      provenance_source TEXT,
      updated_at TEXT,
      document_type TEXT,
      delete_after TEXT
    );
    INSERT INTO memory_index (id, spec_folder, file_path, title, provenance_source, updated_at, document_type, delete_after)
    VALUES
      (1, 'specs/a', '/tmp/a.md', 'Manual row', 'manual operator', '2026-06-10T00:00:00.000Z', 'spec', NULL),
      (2, 'specs/a', '/tmp/b.md', 'Import row', 'memory_index_scan', '2026-06-10T01:00:00.000Z', 'plan', '2026-06-09T00:00:00.000Z'),
      (3, 'specs/a', '/tmp/c.md', 'Agent row', 'opencode automation', '2026-06-10T02:00:00.000Z', 'tasks', NULL);
  `);
  // The causal-edge migrations (v38 bi-temporal window, v39 closure provenance,
  // v40 derived identity, v41 fact-text/retention) hard-require causal_edges and
  // its pre-existing extracted_at column; the bi-temporal/currentness/derived/
  // fact_text columns and the memory_lineage + edge_vector_embeddings tables are
  // added by the migrations themselves. Seeded empty so every backfill is a no-op
  // and the repeated-run upgrades stay idempotent on the causal surface too.
  database.exec(`
    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY,
      source_id TEXT,
      target_id TEXT,
      relation TEXT,
      extracted_at TEXT
    );
  `);
  return database;
}

function tableColumns(database: Database.Database, tableName: string): string[] {
  return (database.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>)
    .map((column) => column.name);
}

function indexSql(database: Database.Database, indexName: string): string {
  return (database.prepare(`
    SELECT sql FROM sqlite_master
    WHERE type = 'index' AND name = ?
  `).get(indexName) as { sql?: string | null } | undefined)?.sql ?? '';
}

function responseFor(id: number) {
  return {
    content: [{
      type: 'text' as const,
      text: JSON.stringify({ data: { id }, hints: [], meta: { tool: 'memory_save' } }),
    }],
    isError: false,
  };
}

function createReceiptDatabase(): Database.Database {
  const database = new Database(':memory:');
  database.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT,
      content_hash TEXT,
      embedding_status TEXT,
      updated_at TEXT
    );
  `);
  ensureIdempotencyReceiptSchemaForTests(database, 'stress');
  database.prepare(`
    INSERT INTO memory_index (id, spec_folder, content_hash, embedding_status, updated_at)
    VALUES (1, 'specs/stress', 'hash-a', 'success', '2026-06-10T00:00:00.000Z')
  `).run();
  return database;
}

function parseMemoryResponse<TResponse>(response: { content: Array<{ text: string }> }): TResponse {
  return JSON.parse(response.content[0].text) as TResponse;
}

function daemonProcessRows(): string[] {
  const out = execFileSync('ps', ['-axo', 'pid,ppid,command'], { encoding: 'utf8' });
  return out
    .split('\n')
    .filter((line) => /node .*\.opencode\/bin\/mk-(spec-memory|code-index|skill-advisor)-launcher\.cjs/.test(line))
    .map((line) => line.trim().replace(/\s+/g, ' '))
    .sort();
}

function runShim(shimPath: string, args: string[], label: string) {
  const root = makeTempRoot(label);
  const socketDir = join(root, 'ipc');
  mkdirSync(socketDir, { recursive: true, mode: 0o700 });
  return spawnSync(process.execPath, [shimPath, ...args], {
    cwd: repoRoot,
    env: {
      ...process.env,
      SPECKIT_IPC_SOCKET_DIR: socketDir,
      SPECKIT_DAEMON_REELECTION: '0',
      SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE: '1',
      SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE: '1',
      SPECKIT_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE: '1',
      MK_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE: '1',
    },
    encoding: 'utf8',
    timeout: 30_000,
    maxBuffer: 1024 * 1024,
  });
}

function expectListTools(shimPath: string, expectedNames: string[], label: string): void {
  const result = runShim(shimPath, ['list-tools', '--format', 'json'], label);
  expect(result.status, result.stderr).toBe(0);
  const envelope = JSON.parse(result.stdout) as CliEnvelope;
  const names = (envelope.data?.tools ?? []).map((tool) => tool.name).sort();

  expect(envelope.status).toBe('ok');
  expect(envelope.data?.count).toBe(expectedNames.length);
  expect(names).toEqual([...expectedNames].sort());
}

afterEach(() => {
  restoreEnv();
  clearSemanticTriggerCache();
  vi.restoreAllMocks();
  vi.useRealTimers();
  while (tempRoots.length > 0) {
    const root = tempRoots.pop();
    if (root) rmSync(root, { recursive: true, force: true });
  }
});

describe('release-cleanup stress coverage for new memory and CLI surfaces', () => {
  it('keeps additive migrations idempotent across repeated isolated database upgrades', async () => {
    expect(SCHEMA_VERSION).toBe(41);

    const databases = Array.from({ length: 12 }, () => createMigrationDatabase());
    try {
      await Promise.all(databases.map(async (database) => {
        runMigrations(database, 34, 41);
        runMigrations(database, 34, 41);
        runMigrations(database, 36, 41);
      }));

      for (const database of databases) {
        const columns = tableColumns(database, 'memory_index');
        expect(columns).toEqual(expect.arrayContaining([
          'source_kind',
          'near_duplicate_of',
          'last_dedup_checked_at',
          'deleted_at',
        ]));
        expect(tableColumns(database, 'memory_idempotency_receipts')).toEqual(expect.arrayContaining([
          'receipt_key',
          'operation',
          'payload_hash',
          'response_payload',
        ]));
        expect(indexSql(database, 'idx_memory_idempotency_receipts_operation')).toContain('memory_idempotency_receipts');
        expect(indexSql(database, 'idx_memory_active_recall')).toContain('WHERE deleted_at IS NULL');
        expect(indexSql(database, 'idx_memory_purgeable_retention')).toContain('WHERE deleted_at IS NOT NULL');

        const rows = database.prepare('SELECT id, source_kind FROM memory_index ORDER BY id ASC').all() as Array<{ id: number; source_kind: string }>;
        expect(rows).toEqual([
          { id: 1, source_kind: 'human' },
          { id: 2, source_kind: 'import' },
          { id: 3, source_kind: 'agent' },
        ]);
      }
    } finally {
      for (const database of databases) database.close();
    }
  });

  it('keeps idempotency default-off stable and replays receipt retries when explicitly gated on', () => {
    delete process.env.SPECKIT_MEMORY_IDEMPOTENCY;
    expect(isMemoryIdempotencyEnabled()).toBe(false);

    process.env.SPECKIT_MEMORY_IDEMPOTENCY = 'true';
    expect(isMemoryIdempotencyEnabled()).toBe(true);

    const database = createReceiptDatabase();
    try {
      const input = {
        operation: 'memory_save' as const,
        contentHash: 'hash-a',
        requestFingerprint: { filePath: '/tmp/spec.md', tenantId: null },
        payload: { filePath: '/tmp/spec.md', force: false },
      };
      const key = deriveIdempotencyReceiptKey(input);
      storeIdempotencyReceipt(database, key, responseFor(1), 1);

      const results = Array.from({ length: 80 }, () => lookupIdempotencyReceipt(database, input));
      expect(results.every((result) => result.status === 'replay')).toBe(true);
      expect((database.prepare('SELECT COUNT(*) AS count FROM memory_index').get() as { count: number }).count).toBe(1);
      expect((database.prepare('SELECT COUNT(*) AS count FROM memory_idempotency_receipts').get() as { count: number }).count).toBe(1);

      const conflict = lookupIdempotencyReceipt(database, {
        ...input,
        payload: { filePath: '/tmp/spec.md', force: true },
      });
      expect(conflict.status).toBe('conflict');
    } finally {
      database.close();
    }
  });

  it('keeps hard delete default behavior and preserves first tombstone under repeated gated delete', async () => {
    let database = createMemoryDbFixture();
    try {
      delete process.env.SPECKIT_SOFT_DELETE_TOMBSTONES;
      seedMemoryRow(database, { id: 1, specFolder: 'specs/stress-delete' });
      const hardDelete = parseMemoryResponse<{ data: { deleted: number } }>(
        await handleMemoryDelete({ id: 1, confirm: true }),
      );
      expect(hardDelete.data.deleted).toBe(1);
      expect((database.prepare('SELECT COUNT(*) AS count FROM memory_index WHERE id = 1').get() as { count: number }).count).toBe(0);
    } finally {
      disposeMemoryDbFixture(database);
    }

    database = createMemoryDbFixture();
    try {
      process.env.SPECKIT_SOFT_DELETE_TOMBSTONES = 'true';
      for (let id = 1; id <= 40; id += 1) {
        seedMemoryRow(database, { id, specFolder: 'specs/stress-delete' });
      }

      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-06-10T00:00:00.000Z'));
      await Promise.all(Array.from({ length: 40 }, (_value, index) => handleMemoryDelete({ id: index + 1, confirm: true })));

      vi.setSystemTime(new Date('2026-06-11T00:00:00.000Z'));
      await Promise.all(Array.from({ length: 40 }, (_value, index) => handleMemoryDelete({ id: index + 1, confirm: true })));

      const rows = database.prepare(`
        SELECT deleted_at, COUNT(*) AS count
        FROM memory_index
        GROUP BY deleted_at
      `).all() as Array<{ deleted_at: string | null; count: number }>;
      expect(rows).toEqual([{ deleted_at: '2026-06-10T00:00:00.000Z', count: 40 }]);
    } finally {
      disposeMemoryDbFixture(database);
    }
  });

  it('keeps semantic trigger shadow disabled by default and stable when loaded', () => {
    const database = createTriggerDatabase();
    try {
      const fixture = loadTriggerGoldens();
      const options = {
        ...fixture.options,
        profileKey: triggerTestProfile.key,
        modelId: triggerTestProfile.model,
        dimensions: triggerTestProfile.dim,
      };
      insertGoldenTriggerEmbeddings(database, fixture);

      const prompts = fixture.cases.slice(0, 20).flatMap((golden) => [
        golden.variants.exact,
        golden.variants.paraphrase,
        golden.variants.distractor,
      ]);
      for (const golden of fixture.cases.slice(0, 20)) {
        storeQueryEmbedding(database, golden.variants.exact, syntheticVector(triggerTestProfile.dim, golden.basis, 'exact'));
        storeQueryEmbedding(database, golden.variants.paraphrase, syntheticVector(triggerTestProfile.dim, golden.basis, 'paraphrase'));
        storeQueryEmbedding(database, golden.variants.distractor, syntheticVector(triggerTestProfile.dim, golden.basis, 'distractor'));
      }

      delete process.env.SPECKIT_SEMANTIC_TRIGGERS;
      const disabled = prompts.map((prompt) => computeSemanticTriggerShadow(database, prompt, [], options));
      expect(disabled.every((stats) => stats.status === 'disabled' && stats.semanticCount === 0)).toBe(true);

      process.env.SPECKIT_SEMANTIC_TRIGGERS = 'true';
      clearSemanticTriggerCache();
      const enabled = prompts.map((prompt) => computeSemanticTriggerShadow(database, prompt, [], options));
      expect(enabled.every((stats) => stats.status === 'computed')).toBe(true);
      expect(enabled.reduce((sum, stats) => sum + (stats.thresholdBands?.total ?? 0), 0)).toBe(40 * prompts.length);
      expect(enabled.filter((stats) => stats.semanticCount > 0).length).toBeGreaterThanOrEqual(20);
    } finally {
      database.close();
    }
  });

  it('keeps CLI front-door shims isolated, count-locked, and warm-only retryable without reaping host daemons', () => {
    const before = daemonProcessRows();

    expectListTools(cliShims.specMemory, TOOL_DEFINITIONS.map((tool) => tool.name), 'spec-memory-cli-stress');
    expectListTools(cliShims.codeIndex, CODE_GRAPH_TOOL_SCHEMAS.map((tool) => tool.name), 'code-index-cli-stress');
    expectListTools(cliShims.skillAdvisor, SKILL_ADVISOR_CLI_TOOL_MANIFEST.map((tool) => tool.name), 'skill-advisor-cli-stress');

    expect(TOOL_DEFINITIONS).toHaveLength(39);
    expect(CODE_GRAPH_TOOL_SCHEMAS).toHaveLength(8);
    expect(SKILL_ADVISOR_CLI_TOOL_MANIFEST).toHaveLength(9);

    const warmOnlyRuns = [
      runShim(cliShims.specMemory, ['memory_health', '--warm-only', '--format', 'json', '--timeout-ms', '1000'], 'spec-memory-warm-only'),
      runShim(cliShims.codeIndex, ['code_graph_status', '--warm-only', '--format', 'json', '--timeout-ms', '1000'], 'code-index-warm-only'),
      runShim(cliShims.skillAdvisor, [
        'advisor_recommend',
        '--json',
        JSON.stringify({ prompt: 'route this prompt' }),
        '--warm-only',
        '--format',
        'json',
        '--timeout-ms',
        '1000',
      ], 'skill-advisor-warm-only'),
    ];
    expect(warmOnlyRuns.map((run) => run.status)).toEqual([75, 75, 75]);

    const after = daemonProcessRows();
    expect(after).toEqual(before);
  });
});
