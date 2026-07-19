// ───────────────────────────────────────────────────────────────
// TEST: Scoped-scan specDocFiles/graphMetadataFiles discovery-gate parity
// ───────────────────────────────────────────────────────────────
// A scoped scan (the Layer-2 git-hook drift-marker path) used to build its
// candidate file lists from a raw fs.existsSync check alone, with no filename
// allowlist or path-eligibility gate — unlike the full-tree walker, which applies
// both. These tests fix a real, reproduced gap: a renamed non-spec file surfaced
// to a scoped scan got indexed as a spec document. The DB layer is fully mocked
// (matching this handler's existing test suite) since the fix lives entirely in
// path-eligibility gating, not in DB behavior; fs itself is real so the fixture
// files' on-disk existence drives the same fs.existsSync check the handler runs.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import Database from 'better-sqlite3';

import {
  appendMemoryDriftSuspects,
  readMemoryDriftSuspects,
} from '../lib/storage/memory-drift-healing';

// ──────────────────────────────────────────────────────────────
// 1. HOISTED MOCKS
// ──────────────────────────────────────────────────────────────

const mocks = vi.hoisted(() => ({
  mockAcquireIndexScanLease: vi.fn(),
  mockCompleteIndexScanLease: vi.fn(),
  mockCheckDatabaseUpdated: vi.fn(),
  mockProcessBatches: vi.fn(),
  mockRequireDb: vi.fn(() => ({
    prepare: vi.fn(() => ({
      all: vi.fn(() => []),
      get: vi.fn(() => undefined),
    })),
  })),
  mockCategorizeFilesForIndexing: vi.fn((files: string[]) => ({
    toIndex: files,
    toUpdate: [] as string[],
    toSkip: [] as string[],
    toDelete: [] as string[],
  })),
  mockBatchUpdateMtimes: vi.fn(() => ({ updated: 0 })),
  mockListIndexedRecordIdsForDeletedPaths: vi.fn((): number[] => []),
  mockSweepOrphanIndexRows: vi.fn(() => ({
    swept: 1,
    nextCursor: null,
    scannedRows: 1,
    orphanRecordIds: [999],
  })),
  mockDeleteMemory: vi.fn((): boolean => true),
  mockGetDb: vi.fn(() => ({
    exec: vi.fn(),
    prepare: vi.fn(() => ({ get: vi.fn(() => undefined), run: vi.fn() })),
  })),
  mockRunPostMutationHooks: vi.fn(() => ({ latencyMs: 0 })),
  mockIndexMemoryFile: vi.fn(async () => ({ status: 'indexed', id: 1, specFolder: 'specs/test' })),
  mockRepairNeedsRebuildSentinel: vi.fn(),
}));

// ──────────────────────────────────────────────────────────────
// 2. MODULE MOCKS (mirrors handler-memory-index-scan-jobs.vitest.ts)
// ──────────────────────────────────────────────────────────────

vi.mock('../core', () => ({
  checkDatabaseUpdated: mocks.mockCheckDatabaseUpdated,
}));

vi.mock('../core/db-state', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../core/db-state')>();
  return {
    ...actual,
    acquireIndexScanLease: mocks.mockAcquireIndexScanLease,
    completeIndexScanLease: mocks.mockCompleteIndexScanLease,
  };
});

vi.mock('../utils', () => ({
  processBatches: mocks.mockProcessBatches,
  requireDb: mocks.mockRequireDb,
  toErrorMessage: (error: unknown) => (error instanceof Error ? error.message : String(error)),
}));

vi.mock('../lib/providers/embeddings', () => ({
  getEmbeddingProfile: vi.fn(() => null),
}));

// Full-tree discovery is mocked out entirely: every test in this file exercises the
// scopedScanPaths.length > 0 branch this fix touches, so a real directory walk
// against the process's actual working tree is neither needed nor safe to trigger.
vi.mock('../handlers/memory-index-discovery', () => ({
  findSpecDocuments: vi.fn((): string[] => []),
  findConstitutionalFiles: vi.fn((): string[] => []),
  findGraphMetadataFiles: vi.fn((): string[] => []),
  detectSpecLevel: vi.fn(() => null),
}));

vi.mock('../lib/storage/incremental-index', () => ({
  categorizeFilesForIndexing: mocks.mockCategorizeFilesForIndexing,
  batchUpdateMtimes: mocks.mockBatchUpdateMtimes,
  listIndexedRecordIdsForDeletedPaths: mocks.mockListIndexedRecordIdsForDeletedPaths,
  sweepOrphanIndexRows: mocks.mockSweepOrphanIndexRows,
}));

vi.mock('../lib/search/vector-index', () => ({
  deleteMemory: mocks.mockDeleteMemory,
  getDb: mocks.mockGetDb,
}));

vi.mock('../handlers/mutation-hooks', () => ({
  runPostMutationHooks: mocks.mockRunPostMutationHooks,
}));

vi.mock('../lib/response/envelope', () => ({
  createMCPSuccessResponse: (payload: unknown) => ({
    content: [{ type: 'text', text: JSON.stringify(payload) }],
  }),
  createMCPErrorResponse: (payload: unknown) => ({
    content: [{ type: 'text', text: JSON.stringify(payload) }],
  }),
}));

vi.mock('../handlers/memory-save', () => ({
  indexMemoryFile: mocks.mockIndexMemoryFile,
}));

vi.mock('../lib/governance/scope-governance', () => ({
  requiresGovernedIngest: vi.fn(() => false),
  validateGovernedIngest: vi.fn(() => ({ allowed: true, issues: [] })),
}));

vi.mock('../lib/runtime/memory-runtime-guard', () => ({
  ensureMemoryRuntimeInitialized: vi.fn(async () => undefined),
}));

vi.mock('../lib/utils/canonical-path', () => ({
  getCanonicalPathKey: (p: string) => p,
}));

vi.mock('../handlers/memory-index-alias', () => ({
  EMPTY_ALIAS_CONFLICT_SUMMARY: { groups: 0, divergentHashGroups: 0 },
  createDefaultDivergenceReconcileSummary: () => ({ retriesScheduled: 0, escalated: 0, errors: [] }),
  detectAliasConflictsFromIndex: vi.fn(() => ({ groups: 0, divergentHashGroups: 0 })),
  summarizeAliasConflicts: vi.fn(() => ({ groups: 0, divergentHashGroups: 0 })),
  runDivergenceReconcileHooks: vi.fn(() => ({ retriesScheduled: 0, escalated: 0, errors: [] })),
}));

vi.mock('../lib/storage/checkpoints', () => ({
  getRestoreBarrierStatus: vi.fn(() => null),
  repairNeedsRebuildSentinel: mocks.mockRepairNeedsRebuildSentinel,
}));

// ──────────────────────────────────────────────────────────────
// 3. MODULE UNDER TEST (imported after all vi.mock() calls)
// ──────────────────────────────────────────────────────────────

import * as scanHandler from '../handlers/memory-index';

// ──────────────────────────────────────────────────────────────
// 4. HELPERS
// ──────────────────────────────────────────────────────────────

function parseEnvelope(response: { content: Array<{ text: string }> }): { data: Record<string, unknown> } {
  return JSON.parse(response.content[0].text) as { data: Record<string, unknown> };
}

// Mirrors the pre-fix scoped-scan filter (memory-index.ts:598-600 before this
// packet's change): existence only, no filename allowlist or eligibility gate.
// Used only to prove the fixture reproduces a real bug, not a speculative one.
function preFixScopedFilter(scopedPaths: string[]): string[] {
  return scopedPaths.filter((filePath) => fs.existsSync(filePath));
}

describe('memory_index_scan scoped-scan discovery-gate parity', () => {
  let tempRoot: string;

  beforeEach(() => {
    vi.clearAllMocks();
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'scoped-scan-gating-'));

    mocks.mockAcquireIndexScanLease.mockResolvedValue({
      acquired: true,
      reason: 'ok',
      waitSeconds: 0,
      lastIndexScan: 0,
      scanStartedAt: 0,
      leaseExpiryMs: 120000,
      cooldownMs: 60000,
    });
    mocks.mockCompleteIndexScanLease.mockResolvedValue(undefined);
    mocks.mockCheckDatabaseUpdated.mockResolvedValue(false);
    mocks.mockCategorizeFilesForIndexing.mockImplementation((files: string[]) => ({
      toIndex: files,
      toUpdate: [],
      toSkip: [],
      toDelete: [],
    }));
    mocks.mockBatchUpdateMtimes.mockReturnValue({ updated: 0 });
    mocks.mockListIndexedRecordIdsForDeletedPaths.mockReturnValue([]);
    mocks.mockSweepOrphanIndexRows.mockReturnValue({
      swept: 0,
      nextCursor: null,
      scannedRows: 0,
      orphanRecordIds: [],
    });
    mocks.mockDeleteMemory.mockReturnValue(true);
    mocks.mockGetDb.mockReturnValue({
      exec: vi.fn(),
      prepare: vi.fn(() => ({ get: vi.fn(() => undefined), all: vi.fn(() => []), run: vi.fn() })),
    });
    mocks.mockRunPostMutationHooks.mockReturnValue({ latencyMs: 0 });
    mocks.mockRequireDb.mockReturnValue({
      prepare: vi.fn(() => ({ all: vi.fn(() => []), get: vi.fn(() => undefined) })),
    });
    mocks.mockIndexMemoryFile.mockResolvedValue({ status: 'indexed', id: 1, specFolder: 'specs/test' });
    mocks.mockRepairNeedsRebuildSentinel.mockReturnValue({
      sentinelPresent: false,
      attempted: false,
      cleared: false,
      summary: null,
      error: null,
    });
    mocks.mockProcessBatches.mockImplementation(
      async (files: string[], worker: (file: string) => Promise<unknown>) => Promise.all(files.map(worker)),
    );
  });

  afterEach(() => {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  it('includes only the legitimate spec.md rename and excludes a renamed non-spec file, and reproduces the pre-fix bug on the identical fixture', async () => {
    const leafDir = path.join(tempRoot, '.opencode', 'specs', 'demo', '010-gating-leaf');
    fs.mkdirSync(leafDir, { recursive: true });
    const specDocPath = path.join(leafDir, 'spec.md');
    fs.writeFileSync(specDocPath, '# spec');
    // A renamed non-spec file (e.g. a scratch/evidence asset) the git-hook drift
    // marker still names in its scoped path list, even though it is not indexable.
    const nonSpecPath = path.join(leafDir, 'evidence.png');
    fs.writeFileSync(nonSpecPath, 'not-a-spec-doc');

    const scopedPaths = [specDocPath, nonSpecPath];

    // Proves this is a real regression fix: the OLD filter (existence only) would
    // have wrongly included the non-spec file too.
    const preFixIncluded = preFixScopedFilter(scopedPaths);
    expect(preFixIncluded).toContain(nonSpecPath);
    expect(preFixIncluded).toContain(specDocPath);

    const result = await scanHandler.handleMemoryIndexScan({
      scopedPaths,
      includeConstitutional: false,
      includeSpecDocs: true,
      incremental: false,
      force: false,
    });

    const { data } = parseEnvelope(result);
    expect(data.scanned).toBe(1);
    const indexedPaths = mocks.mockIndexMemoryFile.mock.calls.map((call) => call[0]);
    expect(indexedPaths).toEqual([specDocPath]);
    expect(indexedPaths).not.toContain(nonSpecPath);
  });

  it('routes a renamed graph-metadata.json into graphMetadataFiles instead of force-emptying it', async () => {
    const leafDir = path.join(tempRoot, '.opencode', 'specs', 'demo', '011-graph-leaf');
    fs.mkdirSync(leafDir, { recursive: true });
    const graphMetadataPath = path.join(leafDir, 'graph-metadata.json');
    fs.writeFileSync(graphMetadataPath, JSON.stringify({ packet_id: '011-graph-leaf' }));

    const result = await scanHandler.handleMemoryIndexScan({
      scopedPaths: [graphMetadataPath],
      includeConstitutional: false,
      includeSpecDocs: true,
      incremental: false,
      force: false,
    });

    const { data } = parseEnvelope(result);
    expect(data.scanned).toBe(1);
    const indexedPaths = mocks.mockIndexMemoryFile.mock.calls.map((call) => call[0]);
    expect(indexedPaths).toEqual([graphMetadataPath]);
  });

  it('produces an empty, crash-free specDocFiles when every scoped path is ineligible', async () => {
    const leafDir = path.join(tempRoot, '.opencode', 'specs', 'demo', '012-empty-leaf');
    fs.mkdirSync(leafDir, { recursive: true });
    const nonSpecPath = path.join(leafDir, 'notes.txt');
    fs.writeFileSync(nonSpecPath, 'not a spec document');

    const result = await scanHandler.handleMemoryIndexScan({
      scopedPaths: [nonSpecPath],
      includeConstitutional: false,
      includeSpecDocs: true,
      incremental: false,
      force: false,
    });

    const { data } = parseEnvelope(result);
    expect(data.status).toBe('complete');
    expect(data.scanned).toBe(0);
    expect(mocks.mockIndexMemoryFile).not.toHaveBeenCalled();
  });

  it('keeps global maintenance and unrelated backfills out of scoped repair mode', async () => {
    const leafDir = path.join(tempRoot, '.opencode', 'specs', 'demo', '013-scoped-repair');
    fs.mkdirSync(leafDir, { recursive: true });
    const specDocPath = path.join(leafDir, 'spec.md');
    fs.writeFileSync(specDocPath, '# scoped repair');
    const onPhase = vi.fn();

    const result = await scanHandler.runIndexScan({
      scopedPaths: [specDocPath],
      includeConstitutional: false,
      includeSpecDocs: true,
      incremental: false,
      force: false,
    }, { onPhase });

    const { data } = parseEnvelope(result);
    const phases = onPhase.mock.calls.map(([phase]) => phase);
    expect(data).toMatchObject({
      repairMode: 'scoped',
      repairStatus: 'complete',
      globalMaintenanceSkipped: true,
      orphanSwept: 0,
      suspectTombstoned: 0,
      postInsertEnrichmentRepaired: 0,
      nearDuplicateRepaired: 0,
    });
    expect(phases).not.toEqual(expect.arrayContaining([
      'orphan-sweep',
      'suspect-confirmation',
      'enrichment-repair',
      'trigger-backfill',
      'near-dup-repair',
    ]));
    expect(mocks.mockSweepOrphanIndexRows).not.toHaveBeenCalled();
    expect(mocks.mockRepairNeedsRebuildSentinel).not.toHaveBeenCalled();
  });

  it('limits real-database stale cleanup to scoped candidates and preserves unrelated suspects', async () => {
    const database = new Database(path.join(tempRoot, 'scoped-repair.sqlite'));
    const scopedStalePath = path.join(tempRoot, '.opencode', 'specs', 'demo', '014-scoped-stale', 'spec.md');
    const unrelatedStalePath = path.join(tempRoot, '.opencode', 'specs', 'demo', '015-unrelated', 'spec.md');
    try {
      database.exec(`
        CREATE TABLE memory_index (
          id INTEGER PRIMARY KEY,
          file_path TEXT NOT NULL,
          canonical_file_path TEXT,
          file_mtime_ms REAL,
          content_hash TEXT,
          embedding_status TEXT NOT NULL
        );
      `);
      database.prepare(`
        INSERT INTO memory_index (
          id, file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status
        ) VALUES (?, ?, ?, NULL, NULL, 'success')
      `).run(41, scopedStalePath, scopedStalePath);
      database.prepare(`
        INSERT INTO memory_index (
          id, file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status
        ) VALUES (?, ?, ?, NULL, NULL, 'success')
      `).run(42, unrelatedStalePath, unrelatedStalePath);
      appendMemoryDriftSuspects(database, [42], '2026-07-09T00:00:00.000Z');

      const realIncrementalIndex = await vi.importActual<typeof import('../lib/storage/incremental-index')>(
        '../lib/storage/incremental-index',
      );
      realIncrementalIndex.init(database);
      mocks.mockCategorizeFilesForIndexing.mockImplementation(
        (files: string[], options?: { staleCandidatePaths?: string[] }) => (
          realIncrementalIndex.categorizeFilesForIndexing(files, options)
        ),
      );
      mocks.mockListIndexedRecordIdsForDeletedPaths.mockImplementation(
        (paths: string[]) => realIncrementalIndex.listIndexedRecordIdsForDeletedPaths(paths),
      );
      mocks.mockDeleteMemory.mockImplementation((id: number) => (
        database.prepare('DELETE FROM memory_index WHERE id = ?').run(id).changes === 1
      ));
      mocks.mockGetDb.mockReturnValue(database);
      mocks.mockRequireDb.mockReturnValue(database);

      const result = await scanHandler.runIndexScan({
        scopedPaths: [scopedStalePath],
        includeConstitutional: false,
        includeSpecDocs: true,
        incremental: true,
        force: false,
      });

      const { data } = parseEnvelope(result);
      const remainingRows = database.prepare('SELECT id FROM memory_index ORDER BY id').all() as Array<{ id: number }>;
      expect(data).toMatchObject({
        repairMode: 'scoped',
        repairStatus: 'complete',
        staleDeleted: 0,
        suspectTombstoned: 0,
      });
      expect(remainingRows.map((row) => row.id)).toEqual([41, 42]);
      expect(readMemoryDriftSuspects(database).map((suspect) => suspect.id)).toEqual([41, 42]);
      expect(mocks.mockSweepOrphanIndexRows).not.toHaveBeenCalled();
    } finally {
      database.close();
    }
  });

  it('excludes a graph-metadata.json-named path outside .opencode/specs instead of falsely including it', async () => {
    const outsideDir = path.join(tempRoot, 'not-a-specs-root');
    fs.mkdirSync(outsideDir, { recursive: true });
    const outsidePath = path.join(outsideDir, 'graph-metadata.json');
    fs.writeFileSync(outsidePath, JSON.stringify({ packet_id: 'outside' }));

    const result = await scanHandler.handleMemoryIndexScan({
      scopedPaths: [outsidePath],
      includeConstitutional: false,
      includeSpecDocs: true,
      incremental: false,
      force: false,
    });

    const { data } = parseEnvelope(result);
    expect(data.scanned).toBe(0);
    expect(mocks.mockIndexMemoryFile).not.toHaveBeenCalled();
  });

  it('leaves full-tree (non-scoped) discovery untouched: findSpecDocuments still drives scanning when no scopedPaths are given', async () => {
    // No scopedPaths means the scoped-scan branch this fix touches never runs; the
    // full-tree walker path (findSpecDocuments/findGraphMetadataFiles, unmodified by
    // this fix) is exercised instead, matching this handler's existing test coverage.
    const result = await scanHandler.handleMemoryIndexScan({
      includeConstitutional: false,
      includeSpecDocs: true,
      incremental: false,
      force: false,
    });

    const { data } = parseEnvelope(result);
    expect(data.status).toBe('complete');
    // No real spec tree under the mocked DEFAULT_BASE_PATH, so nothing is found —
    // the assertion is that this completes cleanly via the untouched full-tree path.
    expect(data.scanned).toBe(0);
  });
});
