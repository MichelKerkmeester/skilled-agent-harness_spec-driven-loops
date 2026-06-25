// ───────────────────────────────────────────────────────────────
// TEST: Code Graph Auto-Trigger (Ensure Ready)
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReadyAction, GraphFreshness, ReadyResult } from '../lib/ensure-ready.js';

const mocks = vi.hoisted(() => ({
  getDbMock: vi.fn(),
  getStatsMock: vi.fn(),
  getLastGitHeadMock: vi.fn(),
  getLastGoldVerificationMock: vi.fn(),
  setLastDetectorProvenanceMock: vi.fn(),
  setLastGitHeadMock: vi.fn(),
  setCodeGraphScopeMock: vi.fn(),
  getStoredCodeGraphScopeMock: vi.fn(),
  getCodeGraphMetadataMock: vi.fn(),
  setCodeGraphMetadataMock: vi.fn(),
  getParseDiagnosticsSummaryMock: vi.fn(),
  recordParseDiagnosticMock: vi.fn(),
  clearParseDiagnosticMock: vi.fn(),
  upsertFileMock: vi.fn(),
  replaceNodesMock: vi.fn(),
  replaceEdgesMock: vi.fn(),
  ensureFreshFilesMock: vi.fn(),
  isFileStaleMock: vi.fn(),
  getTrackedFilesMock: vi.fn(),
  removeFileMock: vi.fn(),
  bumpCodeGraphGenerationMock: vi.fn(),
  codeGraphEdgeBitemporalReadsEnabledMock: vi.fn(() => false),
  indexFilesMock: vi.fn(),
  existsSyncMock: vi.fn(),
  execSyncMock: vi.fn(),
}));

// Mock code-graph-db to avoid real DB access
vi.mock('../lib/code-graph-db.js', () => ({
  getDb: mocks.getDbMock,
  getStats: mocks.getStatsMock,
  getLastGitHead: mocks.getLastGitHeadMock,
  getLastGoldVerification: mocks.getLastGoldVerificationMock,
  setLastDetectorProvenance: mocks.setLastDetectorProvenanceMock,
  setLastGitHead: mocks.setLastGitHeadMock,
  setCodeGraphScope: mocks.setCodeGraphScopeMock,
  getStoredCodeGraphScope: mocks.getStoredCodeGraphScopeMock,
  getCodeGraphMetadata: mocks.getCodeGraphMetadataMock,
  setCodeGraphMetadata: mocks.setCodeGraphMetadataMock,
  getParseDiagnosticsSummary: mocks.getParseDiagnosticsSummaryMock,
  recordParseDiagnostic: mocks.recordParseDiagnosticMock,
  clearParseDiagnostic: mocks.clearParseDiagnosticMock,
  upsertFile: mocks.upsertFileMock,
  replaceNodes: mocks.replaceNodesMock,
  replaceEdges: mocks.replaceEdgesMock,
  ensureFreshFiles: mocks.ensureFreshFilesMock,
  isFileStale: mocks.isFileStaleMock,
  getTrackedFiles: mocks.getTrackedFilesMock,
  removeFile: mocks.removeFileMock,
  bumpCodeGraphGeneration: mocks.bumpCodeGraphGenerationMock,
  codeGraphEdgeBitemporalReadsEnabled: mocks.codeGraphEdgeBitemporalReadsEnabledMock,
}));

vi.mock('node:fs', () => ({
  existsSync: mocks.existsSyncMock,
}));

vi.mock('node:child_process', () => ({
  execFileSync: mocks.execSyncMock,
}));

// Mock structural-indexer to avoid real parsing
vi.mock('../lib/structural-indexer.js', () => ({
  indexFiles: mocks.indexFilesMock,
}));

function createDbWithNodeCount(nodeCount: number) {
  return {
    prepare: vi.fn(() => ({
      get: vi.fn(() => ({ c: nodeCount })),
      all: vi.fn(() => []),
    })),
    transaction: vi.fn((fn: () => void) => fn),
  };
}

describe('ensure-ready', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.unstubAllEnvs();

    mocks.getDbMock.mockReturnValue(createDbWithNodeCount(0));
    mocks.getStatsMock.mockReturnValue({
      totalFiles: 0, totalNodes: 0, totalEdges: 0,
      lastScanTimestamp: null, dbFileSize: null, schemaVersion: 1,
      nodesByKind: {}, edgesByType: {}, parseHealthSummary: {},
    });
    mocks.getLastGitHeadMock.mockReturnValue(null);
    mocks.getLastGoldVerificationMock.mockReturnValue(null);
    mocks.getStoredCodeGraphScopeMock.mockReturnValue({
      fingerprint: 'code-graph-scope:v2:skills=none:agents=none:commands=none:specs=none:plugins=none',
      label: 'end-user code only',
      source: 'default',
    });
    mocks.getCodeGraphMetadataMock.mockReturnValue(null);
    mocks.getParseDiagnosticsSummaryMock.mockReturnValue({ affectedFiles: 0, recentErrors: [] });
    mocks.upsertFileMock.mockReturnValue(1);
    mocks.ensureFreshFilesMock.mockReturnValue({ fresh: [], stale: [] });
    mocks.isFileStaleMock.mockReturnValue(false);
    mocks.getTrackedFilesMock.mockReturnValue([]);
    mocks.indexFilesMock.mockResolvedValue([{
      filePath: '/tmp/test-root/stale.ts',
      language: 'typescript',
      nodes: [],
      edges: [],
      detectorProvenance: 'structured',
      contentHash: 'hash-1',
      parseHealth: 'clean',
      parseErrors: [],
      parseDurationMs: 5,
    }]);
    mocks.existsSyncMock.mockReturnValue(true);
    mocks.execSyncMock.mockReturnValue('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n');
  });

  describe('type exports', () => {
    it('ReadyAction accepts valid values', () => {
      const actions: ReadyAction[] = ['none', 'full_scan', 'selective_reindex'];
      expect(actions).toHaveLength(3);
    });

    it('GraphFreshness accepts valid values', () => {
      const levels: GraphFreshness[] = ['fresh', 'stale', 'empty'];
      expect(levels).toHaveLength(3);
    });

    it('ReadyResult has required shape', () => {
      const result: ReadyResult = {
        freshness: 'fresh',
        action: 'none',
        inlineIndexPerformed: false,
        reason: 'test',
      };
      expect(result.action).toBe('none');
      expect(result.reason).toBe('test');
      expect(result.files).toBeUndefined();
    });

    it('ReadyResult supports optional files array', () => {
      const result: ReadyResult = {
        freshness: 'stale',
        action: 'selective_reindex',
        files: ['a.ts', 'b.ts'],
        inlineIndexPerformed: true,
        reason: 'stale files',
      };
      expect(result.files).toHaveLength(2);
    });
  });

  describe('ensureCodeGraphReady', () => {
    it('returns refreshed readiness after a successful inline full scan', async () => {
      mocks.getDbMock
        .mockReturnValueOnce(createDbWithNodeCount(0))
        .mockReturnValue(createDbWithNodeCount(1));
      mocks.getTrackedFilesMock.mockReturnValue(['/tmp/test-root/stale.ts']);
      mocks.ensureFreshFilesMock.mockReturnValue({ fresh: ['/tmp/test-root/stale.ts'], stale: [] });

      const { ensureCodeGraphReady } = await import('../lib/ensure-ready.js');
      const result = await ensureCodeGraphReady('/tmp/test-root');

      expect(result.freshness).toBe('fresh');
      expect(result.action).toBe('none');
      expect(result.inlineIndexPerformed).toBe(true);
      expect(result.reason).toBe('all tracked files are up-to-date');
      expect(mocks.indexFilesMock).toHaveBeenCalledTimes(1);
    });

    it('removes deleted tracked files even when no reindex is needed', async () => {
      mocks.getDbMock.mockReturnValue(createDbWithNodeCount(1));
      mocks.getTrackedFilesMock.mockReturnValue(['/tmp/test-root/deleted.ts']);
      mocks.existsSyncMock.mockReturnValue(false);

      const { ensureCodeGraphReady } = await import('../lib/ensure-ready.js');
      const result = await ensureCodeGraphReady('/tmp/test-root');

      expect(result.action).toBe('none');
      expect(result.freshness).toBe('stale');
      expect(result.inlineIndexPerformed).toBe(false);
      expect(result.reason).toContain('removed 1 deleted tracked file(s)');
      expect(mocks.removeFileMock).toHaveBeenCalledWith('/tmp/test-root/deleted.ts');
      expect(mocks.indexFilesMock).not.toHaveBeenCalled();
    });

    it('reports stale work without indexing when read paths disable inline indexing', async () => {
      mocks.getDbMock.mockReturnValue(createDbWithNodeCount(1));
      mocks.getTrackedFilesMock.mockReturnValue(['/tmp/test-root/stale.ts']);
      mocks.ensureFreshFilesMock.mockReturnValue({ fresh: [], stale: ['/tmp/test-root/stale.ts'] });

      const { ensureCodeGraphReady } = await import('../lib/ensure-ready.js');
      const result = await ensureCodeGraphReady('/tmp/test-root', { allowInlineIndex: false });

      expect(result.action).toBe('selective_reindex');
      expect(result.freshness).toBe('stale');
      expect(result.inlineIndexPerformed).toBe(false);
      expect(result.files).toEqual(['/tmp/test-root/stale.ts']);
      expect(result.reason).toContain('inline auto-index skipped for read path');
      expect(mocks.indexFilesMock).not.toHaveBeenCalled();
    });

    it('performs selective inline reindex for small stale sets when allowed', async () => {
      mocks.getDbMock.mockReturnValue(createDbWithNodeCount(1));
      mocks.getTrackedFilesMock.mockReturnValue(['/tmp/test-root/stale.ts']);
      mocks.ensureFreshFilesMock
        .mockReturnValueOnce({ fresh: [], stale: ['/tmp/test-root/stale.ts'] })
        .mockReturnValueOnce({ fresh: ['/tmp/test-root/stale.ts'], stale: [] });

      const { ensureCodeGraphReady } = await import('../lib/ensure-ready.js');
      const result = await ensureCodeGraphReady('/tmp/test-root', {
        allowInlineIndex: true,
        allowInlineFullScan: false,
      });

      expect(result.action).toBe('none');
      expect(result.freshness).toBe('fresh');
      expect(result.inlineIndexPerformed).toBe(true);
      expect(result.files).toBeUndefined();
      expect(result.reason).toBe('all tracked files are up-to-date');
      expect(mocks.indexFilesMock).toHaveBeenCalledTimes(1);
      expect(mocks.setLastDetectorProvenanceMock).toHaveBeenCalledWith('structured');
    });

    it('rechecks tracked files on immediate fresh-to-stale transitions', async () => {
      mocks.getDbMock.mockReturnValue(createDbWithNodeCount(1));
      mocks.getTrackedFilesMock.mockReturnValue(['/tmp/test-root/stale.ts']);
      mocks.ensureFreshFilesMock
        .mockReturnValueOnce({ fresh: ['/tmp/test-root/stale.ts'], stale: [] })
        .mockReturnValueOnce({ fresh: [], stale: ['/tmp/test-root/stale.ts'] })
        .mockReturnValueOnce({ fresh: ['/tmp/test-root/stale.ts'], stale: [] });

      const { ensureCodeGraphReady } = await import('../lib/ensure-ready.js');
      const first = await ensureCodeGraphReady('/tmp/test-root', {
        allowInlineIndex: true,
        allowInlineFullScan: false,
      });
      const second = await ensureCodeGraphReady('/tmp/test-root', {
        allowInlineIndex: true,
        allowInlineFullScan: false,
      });

      expect(first.freshness).toBe('fresh');
      expect(first.inlineIndexPerformed).toBe(false);
      expect(second.freshness).toBe('fresh');
      expect(second.inlineIndexPerformed).toBe(true);
      expect(mocks.ensureFreshFilesMock).toHaveBeenCalledTimes(3);
      expect(mocks.indexFilesMock).toHaveBeenCalledTimes(1);
      expect(mocks.indexFilesMock).toHaveBeenCalledWith(
        expect.objectContaining({ rootDir: '/tmp/test-root' }),
        // BUG-06: indexWithTimeout now also threads a deadline `signal`, so
        // match on the meaningful option rather than the exact object.
        expect.objectContaining({ specificFiles: ['/tmp/test-root/stale.ts'] }),
      );
    });

    it('allows selective inline reindex after git HEAD changes when the stale set is small', async () => {
      const newHead = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';
      mocks.getDbMock.mockReturnValue(createDbWithNodeCount(1));
      mocks.getLastGitHeadMock
        .mockReturnValueOnce('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
        .mockReturnValue(newHead);
      mocks.execSyncMock.mockReturnValue(`${newHead}\n`);
      mocks.getTrackedFilesMock.mockReturnValue(['/tmp/test-root/stale.ts']);
      mocks.ensureFreshFilesMock
        .mockReturnValueOnce({ fresh: [], stale: ['/tmp/test-root/stale.ts'] })
        .mockReturnValueOnce({ fresh: ['/tmp/test-root/stale.ts'], stale: [] });

      const { ensureCodeGraphReady } = await import('../lib/ensure-ready.js');
      const result = await ensureCodeGraphReady('/tmp/test-root', {
        allowInlineIndex: true,
        allowInlineFullScan: false,
      });

      expect(result.action).toBe('none');
      expect(result.freshness).toBe('fresh');
      expect(result.inlineIndexPerformed).toBe(true);
      expect(result.files).toBeUndefined();
      expect(result.reason).toBe('all tracked files are up-to-date');
      expect(mocks.indexFilesMock).toHaveBeenCalledTimes(1);
      expect(mocks.setLastDetectorProvenanceMock).toHaveBeenCalledWith('structured');
      expect(mocks.setLastGitHeadMock).toHaveBeenCalledWith(newHead);
    });

    it('keeps git HEAD drift as full-scan territory when tracked files look up-to-date on disk', async () => {
      mocks.getDbMock.mockReturnValue(createDbWithNodeCount(1));
      mocks.getLastGitHeadMock.mockReturnValue('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
      mocks.execSyncMock.mockImplementation((command: string, args: string[]) => (
        args[0] === 'diff'
          ? 'fresh.ts\n'
          : 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\n'
      ));
      mocks.getTrackedFilesMock.mockReturnValue(['/tmp/test-root/fresh.ts']);
      mocks.ensureFreshFilesMock.mockReturnValue({ fresh: ['/tmp/test-root/fresh.ts'], stale: [] });

      const { ensureCodeGraphReady } = await import('../lib/ensure-ready.js');
      const result = await ensureCodeGraphReady('/tmp/test-root', {
        allowInlineIndex: true,
        allowInlineFullScan: false,
      });

      expect(result.action).toBe('full_scan');
      expect(result.freshness).toBe('stale');
      expect(result.inlineIndexPerformed).toBe(false);
      expect(result.reason).toContain('git HEAD changed: aaaaaaaa -> bbbbbbbb');
      expect(result.reason).toContain('tracked files appear up-to-date on disk');
      expect(result.reason).toContain('inline full scan skipped for read path');
      expect(mocks.indexFilesMock).not.toHaveBeenCalled();
    });

    it('refreshes detected stale files when the full scan guard blocks a broad refresh', async () => {
      const staleFiles = Array.from({ length: 51 }, (_, index) => `/tmp/test-root/stale-${index}.ts`);
      mocks.getDbMock.mockReturnValue(createDbWithNodeCount(1));
      mocks.getTrackedFilesMock.mockReturnValue(staleFiles);
      mocks.ensureFreshFilesMock
        .mockReturnValueOnce({ fresh: [], stale: staleFiles })
        .mockReturnValueOnce({ fresh: staleFiles, stale: [] });

      const { ensureCodeGraphReady } = await import('../lib/ensure-ready.js');
      const result = await ensureCodeGraphReady('/tmp/test-root', {
        allowInlineIndex: true,
        allowInlineFullScan: false,
      });

      expect(result.action).toBe('none');
      expect(result.freshness).toBe('fresh');
      expect(result.inlineIndexPerformed).toBe(true);
      expect(mocks.indexFilesMock).toHaveBeenCalledWith(
        expect.objectContaining({ rootDir: '/tmp/test-root' }),
        expect.objectContaining({ specificFiles: staleFiles }),
      );
    });

    it('allows guarded inline full scan when stored scope matches active scope and parse backlog is clean', async () => {
      const staleFiles = Array.from({ length: 51 }, (_, index) => `/tmp/test-root/stale-${index}.ts`);
      mocks.getDbMock.mockReturnValue(createDbWithNodeCount(1));
      mocks.getTrackedFilesMock.mockReturnValue(staleFiles);
      mocks.ensureFreshFilesMock
        .mockReturnValueOnce({ fresh: [], stale: staleFiles })
        .mockReturnValueOnce({ fresh: staleFiles, stale: [] });

      const { ensureCodeGraphReady } = await import('../lib/ensure-ready.js');
      const result = await ensureCodeGraphReady('/tmp/test-root', {
        allowInlineIndex: true,
        allowInlineFullScan: false,
        allowGuardedInlineFullScan: true,
      });

      expect(result.freshness).toBe('fresh');
      expect(result.action).toBe('none');
      expect(result.inlineIndexPerformed).toBe(true);
      expect(result.autoRescanSafety).toBe('allowed');
      expect(result.selfHealAttempted).toBe(true);
      expect(mocks.indexFilesMock).toHaveBeenCalledTimes(1);
    });

    it('refreshes detected stale files when parse diagnostics block a broad refresh', async () => {
      const staleFiles = Array.from({ length: 51 }, (_, index) => `/tmp/test-root/stale-${index}.ts`);
      mocks.getDbMock.mockReturnValue(createDbWithNodeCount(1));
      mocks.getTrackedFilesMock.mockReturnValue(staleFiles);
      mocks.ensureFreshFilesMock
        .mockReturnValueOnce({ fresh: [], stale: staleFiles })
        .mockReturnValueOnce({ fresh: staleFiles, stale: [] });
      mocks.getParseDiagnosticsSummaryMock.mockReturnValue({ affectedFiles: 1, recentErrors: [] });

      const { ensureCodeGraphReady } = await import('../lib/ensure-ready.js');
      const result = await ensureCodeGraphReady('/tmp/test-root', {
        allowInlineIndex: true,
        allowInlineFullScan: false,
        allowGuardedInlineFullScan: true,
      });

      expect(result.action).toBe('none');
      expect(result.freshness).toBe('fresh');
      expect(result.inlineIndexPerformed).toBe(true);
      expect(result.autoRescanSafety).toBe('blocked');
      expect(result.autoRescanBlockReason).toBe('parse_error_backlog');
      expect(mocks.indexFilesMock).toHaveBeenCalledWith(
        expect.objectContaining({ rootDir: '/tmp/test-root' }),
        expect.objectContaining({ specificFiles: staleFiles }),
      );
    });

    it('auto-establishes an empty graph on the default end-user scope (guarded read path, no explicit scan)', async () => {
      // OR-5-01: isolate isDefaultEndUserScope as the SOLE cause of the allow.
      // Active scope = default (all .opencode opt-ins off) so isDefaultEndUserScope=true.
      vi.stubEnv('SPECKIT_CODE_GRAPH_INDEX_SKILLS', '');
      vi.stubEnv('SPECKIT_CODE_GRAPH_INDEX_AGENTS', '');
      vi.stubEnv('SPECKIT_CODE_GRAPH_INDEX_COMMANDS', '');
      vi.stubEnv('SPECKIT_CODE_GRAPH_INDEX_SPECS', '');
      vi.stubEnv('SPECKIT_CODE_GRAPH_INDEX_PLUGINS', '');
      // OR-5-01: stored scope DELIBERATELY mismatches the active default scope
      // (skills=all vs skills=none) so the evaluateGuardedFullScan -> shouldAutoRescan
      // fallback would BLOCK with scope_mismatch. With the fallback blocking, the
      // ONLY path that can yield autoRescanSafety:'allowed' / inlineIndexPerformed:true
      // is the firstTimeAutoEstablish empty-graph branch (isDefaultEndUserScope).
      // Neutralizing that branch (firstTimeAutoEstablish=false) therefore FLIPS the
      // result to blocked/no-scan and fails this test against un-fixed code.
      mocks.getStoredCodeGraphScopeMock.mockReturnValue({
        fingerprint: 'code-graph-scope:v2:skills=all:agents=none:commands=none:specs=none:plugins=none',
        label: 'skills included',
        source: 'scan-argument',
      });
      // Empty graph on first detect, populated after the establishing scan.
      mocks.getDbMock
        .mockReturnValueOnce(createDbWithNodeCount(0))
        .mockReturnValue(createDbWithNodeCount(1));
      mocks.getTrackedFilesMock.mockReturnValue(['/tmp/test-root/stale.ts']);
      mocks.ensureFreshFilesMock.mockReturnValue({ fresh: ['/tmp/test-root/stale.ts'], stale: [] });

      const { ensureCodeGraphReady } = await import('../lib/ensure-ready.js');
      const result = await ensureCodeGraphReady('/tmp/test-root', {
        allowInlineIndex: true,
        allowInlineFullScan: false,
        allowGuardedInlineFullScan: true,
      });

      // Empty + default scope => auto-establish: the full scan ran without an
      // explicit code_graph_scan, despite allowInlineFullScan being false AND the
      // scope-mismatch fallback that would otherwise block.
      expect(mocks.indexFilesMock).toHaveBeenCalledTimes(1);
      expect(result.inlineIndexPerformed).toBe(true);
      expect(result.autoRescanSafety).toBe('allowed');
    });

    it('does NOT auto-establish an empty graph when .opencode is opted in (keeps the manual gate)', async () => {
      // OR-5-01: isolate isDefaultEndUserScope=false as the gate that keeps the
      // manual code_graph_scan requirement. Opted-in (large) scope: active scope is
      // non-default (skills=all), so isDefaultEndUserScope(active)=false and
      // firstTimeAutoEstablish=false in the fixed code.
      vi.stubEnv('SPECKIT_CODE_GRAPH_INDEX_SKILLS', 'true');
      // OR-5-01: stored scope stays the default (skills=none) from beforeEach so it
      // MISMATCHES the opted-in active scope (skills=all). Parse backlog is clean (0),
      // so the ONLY reason the guarded fallback blocks is scope_mismatch — NOT a
      // dirty backlog (guard_disabled / parse_error_backlog). Asserting the block
      // reason ties this test to the scope path rather than an incidental block.
      mocks.getParseDiagnosticsSummaryMock.mockReturnValue({ affectedFiles: 0, recentErrors: [] });
      mocks.getDbMock.mockReturnValue(createDbWithNodeCount(0));
      mocks.getTrackedFilesMock.mockReturnValue([]);

      const { ensureCodeGraphReady } = await import('../lib/ensure-ready.js');
      const result = await ensureCodeGraphReady('/tmp/test-root', {
        allowInlineIndex: true,
        allowInlineFullScan: false,
        allowGuardedInlineFullScan: true,
      });

      // Opted-in scope keeps the manual gate: neutralizing the isDefaultEndUserScope
      // clause in firstTimeAutoEstablish would make the empty graph short-circuit to
      // autoRescanSafety:'allowed' and run the scan, FLIPPING these expectations and
      // failing this test against un-fixed code.
      expect(mocks.indexFilesMock).not.toHaveBeenCalled();
      expect(result.action).toBe('full_scan');
      expect(result.inlineIndexPerformed).toBe(false);
      expect(result.autoRescanSafety).toBe('blocked');
      expect(result.autoRescanBlockReason).toBe('scope_mismatch');
    });
  });

  describe('getGraphFreshness', () => {
    it('returns a valid GraphFreshness value', async () => {
      const { getGraphFreshness } = await import('../lib/ensure-ready.js');
      const freshness = getGraphFreshness('/tmp/test-root');

      expect(['fresh', 'stale', 'empty']).toContain(freshness);
    });
  });
});
