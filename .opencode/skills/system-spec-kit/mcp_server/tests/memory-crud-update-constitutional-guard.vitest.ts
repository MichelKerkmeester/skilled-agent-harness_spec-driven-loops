import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ensureGovernanceRuntime } from '../lib/governance/scope-governance.js';

let database: Database.Database;

function createTestDatabase(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT,
      file_path TEXT NOT NULL,
      canonical_file_path TEXT,
      anchor_id TEXT,
      title TEXT,
      trigger_phrases TEXT,
      importance_weight REAL DEFAULT 0.5,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      importance_tier TEXT DEFAULT 'normal',
      content_text TEXT,
      embedding_status TEXT DEFAULT 'success',
      parent_id INTEGER,
      tenant_id TEXT,
      user_id TEXT,
      agent_id TEXT,
      session_id TEXT,
      source_kind TEXT,
      provenance_source TEXT,
      provenance_actor TEXT,
      delete_after TEXT,
      is_pinned INTEGER DEFAULT 0
    );

    CREATE TABLE active_memory_projection (
      logical_key TEXT PRIMARY KEY,
      root_memory_id INTEGER,
      active_memory_id INTEGER,
      updated_at TEXT
    )
  `);
  ensureGovernanceRuntime(db);
  return db;
}

function seedMemory(filePath: string, sourceKind: string | null = 'human', tier = 'important', isPinned = false): number {
  const now = new Date().toISOString();
  database.prepare(`
      INSERT INTO memory_index (
        id, spec_folder, file_path, canonical_file_path, anchor_id, title,
        trigger_phrases, importance_weight, created_at, updated_at, importance_tier, source_kind, is_pinned
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    101,
    'system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants',
    filePath,
    filePath,
    null,
    'Wave 1 fixture',
    JSON.stringify(['wave-1']),
    0.5,
    now,
    now,
    tier,
    sourceKind,
    isPinned ? 1 : 0,
  );
  database.prepare(`
    INSERT INTO active_memory_projection (
      logical_key, root_memory_id, active_memory_id, updated_at
    ) VALUES (?, ?, ?, ?)
  `).run(
    `${'system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants'}::${filePath}::_`,
    101,
    101,
    now,
  );
  return 101;
}

async function loadHandler() {
  vi.resetModules();

  vi.doMock('../core/index.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../core/index.js')>();
    return {
      ...actual,
      checkDatabaseUpdated: vi.fn(async () => false),
    };
  });

  vi.doMock('../lib/search/vector-index.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../lib/search/vector-index.js')>();
    return {
      ...actual,
      getDb: vi.fn(() => database),
      getMemory: vi.fn((id: number) => actual.getMemory(id, database)),
      updateMemory: vi.fn((params: Parameters<typeof actual.updateMemory>[0]) => actual.updateMemory(params, database)),
      updateEmbeddingStatus: vi.fn(),
    };
  });

  vi.doMock('../lib/search/bm25-index.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../lib/search/bm25-index.js')>();
    return {
      ...actual,
      isBm25Enabled: vi.fn(() => false),
    };
  });

  vi.doMock('../lib/storage/history.js', () => ({
    recordHistory: vi.fn(),
  }));

  vi.doMock('./memory-crud-utils.js', () => ({
    appendMutationLedgerSafe: vi.fn(() => true),
    getMemoryHashSnapshot: vi.fn(() => null),
  }));

  vi.doMock('./mutation-hooks.js', () => ({
    runPostMutationHooks: vi.fn(() => ({
      latencyMs: 0,
      triggerCacheCleared: false,
      constitutionalCacheCleared: false,
      toolCacheInvalidated: 0,
      graphSignalsCacheCleared: false,
      coactivationCacheCleared: false,
      errors: [],
    })),
  }));

  vi.doMock('../hooks/mutation-feedback.js', () => ({
    buildMutationHookFeedback: vi.fn(() => ({ hints: [], data: {} })),
  }));

  return import('../handlers/memory-crud-update.js');
}

beforeEach(() => {
  database = createTestDatabase();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
  database.close();
});

describe('memory_update constitutional tier guard', () => {
  it('downgrades a non-constitutional path back to important and writes governance_audit', async () => {
    const memoryId = seedMemory('/workspace/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/plan.md');
    const { handleMemoryUpdate } = await loadHandler();

    await handleMemoryUpdate({
      id: memoryId,
      importanceTier: 'constitutional',
    });

    const row = database.prepare(`
      SELECT importance_tier
      FROM memory_index
      WHERE id = ?
    `).get(memoryId) as { importance_tier: string };
    expect(row.importance_tier).toBe('important');

    const audits = database.prepare(`
      SELECT action
      FROM governance_audit
      ORDER BY id ASC
    `).all() as Array<{ action: string }>;
    expect(audits).toEqual([
      { action: 'tier_downgrade_non_constitutional_path' },
    ]);
  });

  it('preserves constitutional tier for rows inside /constitutional/ without an audit row', async () => {
    const memoryId = seedMemory('/workspace/.opencode/skills/system-spec-kit/constitutional/gate-enforcement.md');
    const { handleMemoryUpdate } = await loadHandler();

    await handleMemoryUpdate({
      id: memoryId,
      importanceTier: 'constitutional',
    });

    const row = database.prepare(`
      SELECT importance_tier
      FROM memory_index
      WHERE id = ?
    `).get(memoryId) as { importance_tier: string };
    expect(row.importance_tier).toBe('constitutional');

    const auditCount = database.prepare(`
      SELECT COUNT(*) AS count
      FROM governance_audit
    `).get() as { count: number };
    expect(auditCount.count).toBe(0);
  });

  it('records governance_audit when a non-constitutional row moves from constitutional to critical', async () => {
    const filePath = '/workspace/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/plan.md';
    const memoryId = seedMemory(filePath);
    database.prepare('UPDATE memory_index SET importance_tier = ? WHERE id = ?').run('constitutional', memoryId);
    const { handleMemoryUpdate } = await loadHandler();

    await handleMemoryUpdate({
      id: memoryId,
      importanceTier: 'critical',
    });

    const row = database.prepare(`
      SELECT importance_tier
      FROM memory_index
      WHERE id = ?
    `).get(memoryId) as { importance_tier: string };
    expect(row.importance_tier).toBe('critical');

    const audits = database.prepare(`
      SELECT action
      FROM governance_audit
      ORDER BY id ASC
    `).all() as Array<{ action: string }>;
    expect(audits).toEqual([
      { action: 'tier_downgrade_non_constitutional_path' },
      { action: 'tier_downgrade_non_constitutional_path' },
    ]);
  });

  it('skips automated overwrites of protected manual fields while persisting safe fields and a hint', async () => {
    const filePath = '/workspace/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/plan.md';
    const memoryId = seedMemory(filePath, 'human');
    const { handleMemoryUpdate } = await loadHandler();

    const response = await handleMemoryUpdate({
      id: memoryId,
      title: 'Automated title should not land',
      importanceWeight: 0.8,
      __provenanceContext: { provenanceSource: 'memory_index_scan', provenanceActor: 'system-scan' },
    } as never);

    const row = database.prepare(`
      SELECT title, importance_weight, source_kind, provenance_source, provenance_actor
      FROM memory_index
      WHERE id = ?
    `).get(memoryId) as {
      title: string;
      importance_weight: number;
      source_kind: string;
      provenance_source: string | null;
      provenance_actor: string | null;
    };
    expect(row).toEqual({
      title: 'Wave 1 fixture',
      importance_weight: 0.8,
      source_kind: 'human',
      provenance_source: 'memory_index_scan',
      provenance_actor: 'system-scan',
    });
    expect(JSON.stringify(response)).toContain('skipped to protect manual data');
    expect(JSON.stringify(response)).toContain('title');
  });

  it('ignores forged source_kind fields when internal provenance is automated', async () => {
    const filePath = '/workspace/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/plan.md';
    const memoryId = seedMemory(filePath, 'human');
    const { handleMemoryUpdate } = await loadHandler();

    const response = await handleMemoryUpdate({
      id: memoryId,
      title: 'Forged human title',
      source_kind: 'human',
      sourceKind: 'human',
      __provenanceContext: { provenanceSource: 'system-hook', provenanceActor: 'agent-worker' },
    } as never);

    const row = database.prepare('SELECT title, source_kind FROM memory_index WHERE id = ?')
      .get(memoryId) as { title: string; source_kind: string };
    expect(row.title).toBe('Wave 1 fixture');
    expect(row.source_kind).toBe('human');
    expect(JSON.stringify(response)).toContain('skipped to protect manual data');
  });

  it('allows human writes over automated rows and flips source_kind to human', async () => {
    const filePath = '/workspace/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/plan.md';
    const memoryId = seedMemory(filePath, 'agent');
    const { handleMemoryUpdate } = await loadHandler();

    await handleMemoryUpdate({
      id: memoryId,
      triggerPhrases: ['human', 'correction'],
    });

    const row = database.prepare('SELECT trigger_phrases, source_kind FROM memory_index WHERE id = ?')
      .get(memoryId) as { trigger_phrases: string; source_kind: string };
    expect(JSON.parse(row.trigger_phrases)).toEqual(['human', 'correction']);
    expect(row.source_kind).toBe('human');
  });

  it('treats legacy ambiguous source_kind as protected for automated payload partitioning', async () => {
    const filePath = '/workspace/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants/plan.md';
    const memoryId = seedMemory(filePath, null);
    const { handleMemoryUpdate } = await loadHandler();

    await handleMemoryUpdate({
      id: memoryId,
      title: 'Ambiguous overwrite',
      importanceWeight: 0.7,
      __provenanceContext: { provenanceSource: 'import-batch', provenanceActor: 'batch-importer' },
    } as never);

    const row = database.prepare('SELECT title, importance_weight, source_kind FROM memory_index WHERE id = ?')
      .get(memoryId) as { title: string; importance_weight: number; source_kind: string };
    expect(row.title).toBe('Wave 1 fixture');
    expect(row.importance_weight).toBe(0.7);
    expect(row.source_kind).toBe('human');
  });

  it('skips protected fields on constitutional rows while persisting safe fields', async () => {
    const filePath = '/workspace/.opencode/skills/system-spec-kit/constitutional/gate-enforcement.md';
    const memoryId = seedMemory(filePath, 'system', 'constitutional');
    const { handleMemoryUpdate } = await loadHandler();

    const response = await handleMemoryUpdate({
      id: memoryId,
      importanceTier: 'normal',
      importanceWeight: 0.9,
      __provenanceContext: { provenanceSource: 'agent-enrichment', provenanceActor: 'agent' },
    } as never);

    const row = database.prepare('SELECT importance_tier, importance_weight, source_kind FROM memory_index WHERE id = ?')
      .get(memoryId) as { importance_tier: string; importance_weight: number; source_kind: string };
    expect(row.importance_tier).toBe('constitutional');
    expect(row.importance_weight).toBe(0.9);
    expect(row.source_kind).toBe('system');
    expect(JSON.stringify(response)).toContain('skipped to protect manual data');
  });

  it('skips automated protected-field overwrites on critical rows', async () => {
    const filePath = '/workspace/.opencode/specs/system-spec-kit/critical-row/spec.md';
    const memoryId = seedMemory(filePath, 'system', 'critical');
    const { handleMemoryUpdate } = await loadHandler();

    const response = await handleMemoryUpdate({
      id: memoryId,
      title: 'Automated critical retitle',
      importanceTier: 'normal',
      importanceWeight: 0.85,
      __provenanceContext: { provenanceSource: 'agent-enrichment', provenanceActor: 'agent' },
    } as never);

    const row = database.prepare('SELECT title, importance_tier, importance_weight, source_kind FROM memory_index WHERE id = ?')
      .get(memoryId) as { title: string; importance_tier: string; importance_weight: number; source_kind: string };
    expect(row.title).toBe('Wave 1 fixture');
    expect(row.importance_tier).toBe('critical');
    expect(row.importance_weight).toBe(0.85);
    expect(row.source_kind).toBe('system');
    expect(JSON.stringify(response)).toContain('skipped to protect manual data');
  });

  it('skips automated protected-field overwrites on pinned rows', async () => {
    const filePath = '/workspace/.opencode/specs/system-spec-kit/pinned-row/spec.md';
    const memoryId = seedMemory(filePath, 'agent', 'important', true);
    const { handleMemoryUpdate } = await loadHandler();

    const response = await handleMemoryUpdate({
      id: memoryId,
      title: 'Automated pinned retitle',
      triggerPhrases: ['automated'],
      importanceWeight: 0.75,
      __provenanceContext: { provenanceSource: 'agent-enrichment', provenanceActor: 'agent' },
    } as never);

    const row = database.prepare('SELECT title, trigger_phrases, importance_weight, source_kind FROM memory_index WHERE id = ?')
      .get(memoryId) as { title: string; trigger_phrases: string; importance_weight: number; source_kind: string };
    expect(row.title).toBe('Wave 1 fixture');
    expect(JSON.parse(row.trigger_phrases)).toEqual(['wave-1']);
    expect(row.importance_weight).toBe(0.75);
    expect(row.source_kind).toBe('agent');
    expect(JSON.stringify(response)).toContain('skipped to protect manual data');
  });
});
