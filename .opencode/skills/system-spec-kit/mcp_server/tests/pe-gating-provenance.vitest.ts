import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let database: Database.Database;

function createDatabase(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT,
      file_path TEXT,
      canonical_file_path TEXT,
      anchor_id TEXT,
      title TEXT,
      trigger_phrases TEXT,
      importance_weight REAL DEFAULT 0.5,
      created_at TEXT,
      updated_at TEXT,
      importance_tier TEXT DEFAULT 'normal',
      content_text TEXT,
      content_hash TEXT,
      stability REAL,
      difficulty REAL,
      last_review TEXT,
      review_count INTEGER DEFAULT 0,
      source_kind TEXT,
      provenance_source TEXT,
      provenance_actor TEXT,
      context_type TEXT,
      file_mtime_ms REAL,
      encoding_intent TEXT,
      document_type TEXT,
      spec_level INTEGER,
      quality_score REAL,
      quality_flags TEXT
    )
  `);
  return db;
}

function seedMemory(id = 101): void {
  const now = new Date().toISOString();
  database.prepare(`
    INSERT INTO memory_index (
      id, spec_folder, file_path, canonical_file_path, title, created_at, updated_at,
      importance_tier, stability, difficulty, last_review, review_count, source_kind
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    'system-spec-kit/provenance-fixture',
    '/workspace/provenance/spec.md',
    '/workspace/provenance/spec.md',
    'Existing memory',
    now,
    now,
    'normal',
    2,
    3,
    now,
    0,
    'human',
  );
}

function parsedMemory() {
  return {
    specFolder: 'system-spec-kit/provenance-fixture',
    filePath: '/workspace/provenance/spec.md',
    title: 'Automated update',
    triggerPhrases: ['automated provenance'],
    content: 'Automated caller updates the row while preserving provenance.',
    contentHash: 'hash-next',
    contextType: 'spec',
    importanceTier: 'important',
    documentType: 'spec',
    qualityScore: 0.9,
    qualityFlags: [],
  };
}

async function loadPeGating() {
  vi.resetModules();

  vi.doMock('../utils/index.js', () => ({
    requireDb: vi.fn(() => database),
    toErrorMessage: (error: unknown) => error instanceof Error ? error.message : String(error),
  }));
  vi.doMock('../lib/cognitive/fsrs-scheduler.js', () => ({
    DEFAULT_INITIAL_STABILITY: 2,
    DEFAULT_INITIAL_DIFFICULTY: 3,
    GRADE_GOOD: 3,
    calculateElapsedDays: vi.fn(() => 1),
    calculateRetrievability: vi.fn(() => 0.8),
    updateStability: vi.fn(() => 4),
  }));
  vi.doMock('../lib/search/vector-index.js', () => ({
    vectorSearch: vi.fn(() => []),
    indexMemory: vi.fn((params: Record<string, unknown>) => {
      const nextId = 202;
      const now = new Date().toISOString();
      database.prepare(`
        INSERT INTO memory_index (
          id, spec_folder, file_path, canonical_file_path, title, trigger_phrases,
          importance_weight, created_at, updated_at, content_text, document_type, quality_score, quality_flags
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        nextId,
        params.specFolder,
        params.filePath,
        params.filePath,
        params.title,
        JSON.stringify(params.triggerPhrases ?? []),
        params.importanceWeight ?? 0.5,
        now,
        now,
        params.contentText ?? null,
        params.documentType ?? 'memory',
        params.qualityScore ?? 0,
        JSON.stringify(params.qualityFlags ?? []),
      );
      return nextId;
    }),
  }));
  vi.doMock('../lib/storage/incremental-index.js', () => ({
    getFileMetadata: vi.fn(() => null),
  }));
  vi.doMock('../lib/storage/history.js', () => ({
    recordHistory: vi.fn(),
  }));
  vi.doMock('../lib/storage/lineage-state.js', () => ({
    recordLineageTransition: vi.fn(),
    retirePredecessorForActiveReindex: vi.fn(),
  }));
  vi.doMock('../lib/search/encoding-intent.js', () => ({
    classifyEncodingIntent: vi.fn(() => 'document'),
  }));
  vi.doMock('../lib/search/search-flags.js', () => ({
    isEncodingIntentEnabled: vi.fn(() => false),
  }));
  vi.doMock('../lib/storage/document-helpers.js', () => ({
    calculateDocumentWeight: vi.fn(() => 0.7),
    isSpecDocumentType: vi.fn(() => false),
  }));
  vi.doMock('../lib/spec/spec-level.js', () => ({
    detectSpecLevelFromParsed: vi.fn(() => null),
  }));

  return import('../handlers/pe-gating.js');
}

describe('PE mutation provenance', () => {
  beforeEach(() => {
    database = createDatabase();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
    database.close();
  });

  it('tags PE update rows with automated caller provenance', async () => {
    seedMemory();
    const { updateExistingMemory } = await loadPeGating();

    const result = updateExistingMemory(
      101,
      parsedMemory(),
      new Float32Array([0.2, 0.8]),
      {},
      { provenanceSource: 'agent-save', provenanceActor: 'opencode-agent', tool: 'memory_save' },
    );

    expect(result.status).toBe('updated');
    const row = database.prepare(`
      SELECT source_kind, provenance_source, provenance_actor
      FROM memory_index
      WHERE id = ?
    `).get(result.id) as { source_kind: string; provenance_source: string; provenance_actor: string };
    expect(row).toEqual({
      source_kind: 'agent',
      provenance_source: 'agent-save',
      provenance_actor: 'opencode-agent',
    });
  });

  it('tags PE reinforce rows with automated caller provenance', async () => {
    seedMemory();
    const { reinforceExistingMemory } = await loadPeGating();

    const result = reinforceExistingMemory(101, parsedMemory(), {
      provenanceSource: 'system-scheduler',
      provenanceActor: 'daemon-scheduler',
      tool: 'memory_save',
    });

    expect(result.status).toBe('reinforced');
    const row = database.prepare(`
      SELECT source_kind, provenance_source, provenance_actor
      FROM memory_index
      WHERE id = ?
    `).get(101) as { source_kind: string; provenance_source: string; provenance_actor: string };
    expect(row).toEqual({
      source_kind: 'system',
      provenance_source: 'system-scheduler',
      provenance_actor: 'daemon-scheduler',
    });
  });
});
