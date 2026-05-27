// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Scan Tests
// ───────────────────────────────────────────────────────────────

import { afterEach, beforeEach, describe, expect, it, test, vi } from 'vitest';
import { basename, join, resolve } from 'node:path';
import {
  CODE_GRAPH_INDEX_AGENTS_ENV,
  CODE_GRAPH_INDEX_COMMANDS_ENV,
  CODE_GRAPH_INDEX_PLUGINS_ENV,
  CODE_GRAPH_INDEX_SKILLS_ENV,
  CODE_GRAPH_INDEX_SPECS_ENV,
} from '../lib/index-scope-policy.js';

const mocks = vi.hoisted(() => ({
  execSyncMock: vi.fn(),
  existsSyncMock: vi.fn(),
  realpathSyncMock: vi.fn(),
  indexFilesMock: vi.fn(),
  executeBatteryMock: vi.fn(),
  loadGoldBatteryMock: vi.fn(),
  getCodeGraphMetadataMock: vi.fn(),
  getGraphFreshnessMock: vi.fn(),
  getGraphReadinessSnapshotMock: vi.fn(),
  getLastFailedScanMock: vi.fn(),
  getLastGitHeadMock: vi.fn(),
  getLastGoldVerificationMock: vi.fn(),
  getParseDiagnosticsSummaryMock: vi.fn(),
  persistIndexedFileResultMock: vi.fn(),
  recordFailedScanMock: vi.fn(),
  recordParseDiagnosticMock: vi.fn(),
  setCodeGraphMetadataMock: vi.fn(),
  setCodeGraphScopeMock: vi.fn(),
  setLastDetectorProvenanceMock: vi.fn(),
  setLastDetectorProvenanceSummaryMock: vi.fn(),
  setLastGraphEdgeEnrichmentSummaryMock: vi.fn(),
  clearLastGraphEdgeEnrichmentSummaryMock: vi.fn(),
  setLastGitHeadMock: vi.fn(),
  setLastGoldVerificationMock: vi.fn(),
  isFileStaleMock: vi.fn(),
  upsertFileMock: vi.fn(),
  replaceNodesMock: vi.fn(),
  replaceEdgesMock: vi.fn(),
  removeFileMock: vi.fn(),
  getTrackedFilesMock: vi.fn(),
  getStatsMock: vi.fn(),
  getStoredCodeGraphScopeMock: vi.fn(),
  countStaleButValidParseDiagnosticsMock: vi.fn(),
  countTrackedSkillFilesMock: vi.fn(),
  recordCandidateManifestMock: vi.fn(),
  resolveCrossFileCallEdgesMock: vi.fn(),
  hasCrossFileCallResolutionActivityMock: vi.fn(),
  getSkipListSummaryMock: vi.fn(),
  getParserHealthMock: vi.fn(),
}));

function withPreParseSkippedCount<T>(
  results: T[],
  preParseSkippedCount = 0,
): T[] & { preParseSkippedCount: number } {
  return Object.assign(results, { preParseSkippedCount });
}

vi.mock('node:child_process', () => ({
  execSync: mocks.execSyncMock,
}));

vi.mock('node:fs', () => ({
  existsSync: mocks.existsSyncMock,
  realpathSync: mocks.realpathSyncMock,
}));

vi.mock('../lib/structural-indexer.js', () => ({
  indexFiles: mocks.indexFilesMock,
}));

vi.mock('../lib/gold-query-verifier.js', () => ({
  executeBattery: mocks.executeBatteryMock,
  loadGoldBattery: mocks.loadGoldBatteryMock,
  DEFAULT_GOLD_BATTERY_PATH: '/mock/code-graph-gold-queries.json',
}));

vi.mock('../lib/ensure-ready.js', () => ({
  getGraphFreshness: mocks.getGraphFreshnessMock,
  getGraphReadinessSnapshot: mocks.getGraphReadinessSnapshotMock,
  persistIndexedFileResult: mocks.persistIndexedFileResultMock,
  recordCandidateManifest: mocks.recordCandidateManifestMock,
}));

vi.mock('../lib/cross-file-edge-resolver.js', () => ({
  resolveCrossFileCallEdges: mocks.resolveCrossFileCallEdgesMock,
  hasCrossFileCallResolutionActivity: mocks.hasCrossFileCallResolutionActivityMock,
}));

vi.mock('../lib/code-graph-db.js', () => ({
  getLastGitHead: mocks.getLastGitHeadMock,
  getCodeGraphMetadata: mocks.getCodeGraphMetadataMock,
  getLastFailedScan: mocks.getLastFailedScanMock,
  getLastGoldVerification: mocks.getLastGoldVerificationMock,
  getParseDiagnosticsSummary: mocks.getParseDiagnosticsSummaryMock,
  countStaleButValidParseDiagnostics: mocks.countStaleButValidParseDiagnosticsMock,
  recordFailedScan: mocks.recordFailedScanMock,
  recordParseDiagnostic: mocks.recordParseDiagnosticMock,
  setCodeGraphMetadata: mocks.setCodeGraphMetadataMock,
  setCodeGraphScope: mocks.setCodeGraphScopeMock,
  setLastDetectorProvenance: mocks.setLastDetectorProvenanceMock,
  setLastDetectorProvenanceSummary: mocks.setLastDetectorProvenanceSummaryMock,
  setLastGraphEdgeEnrichmentSummary: mocks.setLastGraphEdgeEnrichmentSummaryMock,
  clearLastGraphEdgeEnrichmentSummary: mocks.clearLastGraphEdgeEnrichmentSummaryMock,
  setLastGitHead: mocks.setLastGitHeadMock,
  setLastGoldVerification: mocks.setLastGoldVerificationMock,
  isFileStale: mocks.isFileStaleMock,
  upsertFile: mocks.upsertFileMock,
  replaceNodes: mocks.replaceNodesMock,
  replaceEdges: mocks.replaceEdgesMock,
  removeFile: mocks.removeFileMock,
  getTrackedFiles: mocks.getTrackedFilesMock,
  getStats: mocks.getStatsMock,
  getStoredCodeGraphScope: mocks.getStoredCodeGraphScopeMock,
  countTrackedSkillFiles: mocks.countTrackedSkillFilesMock,
}));

vi.mock('../lib/parser-skip-list.js', () => ({
  getSkipListSummary: mocks.getSkipListSummaryMock,
}));

vi.mock('../lib/tree-sitter-parser.js', () => ({
  getParserHealth: mocks.getParserHealthMock,
  resetParserHealth: vi.fn(),
}));

import { handleCodeGraphScan, relativizeScanError } from '../handlers/scan.js';
import { handleCodeGraphStatus } from '../handlers/status.js';

describe('relativizeScanError multi-path safety', () => {
  const workspaceRoot = '/workspace';
  const absA = join(workspaceRoot, 'src', 'a.ts');
  const absB = join(workspaceRoot, 'src', 'b.ts');
  const absC = join(workspaceRoot, 'src', 'c.ts');

  test.each([
    [
      'colon-delimited two paths',
      `${absA}:${absB}: parse error`,
      expect.stringMatching(/^src\/a\.ts:src\/b\.ts: parse error$/),
    ],
    [
      'NUL-delimited two paths',
      `${absA}\x00${absB}`,
      expect.stringMatching(/^src\/a\.ts\x00src\/b\.ts$/),
    ],
    [
      'quoted path',
      `failed to parse "${absA}" — see "${absB}"`,
      expect.stringMatching(/^failed to parse "src\/a\.ts" — see "src\/b\.ts"$/),
    ],
    [
      'bracketed path list',
      `[${absA}, ${absB}, ${absC}]`,
      expect.stringMatching(/^\[src\/a\.ts, src\/b\.ts, src\/c\.ts\]$/),
    ],
    [
      'mixed delimiters',
      `${absA}:${absB}\x00 (${absC})`,
      expect.stringMatching(/^src\/a\.ts:src\/b\.ts\x00 \(src\/c\.ts\)$/),
    ],
    [
      'no abs paths',
      'simple error message',
      'simple error message',
    ],
  ])('relativizeScanError handles %s', (_description, input, expected) => {
    const result = relativizeScanError(input, workspaceRoot);
    expect(result).toEqual(expected);
    expect(result).not.toMatch(new RegExp(workspaceRoot.replace(/\//g, '\\/')));
  });
});

describe('handleCodeGraphScan', () => {
  const indexScopeEnvKeys = [
    CODE_GRAPH_INDEX_SKILLS_ENV,
    CODE_GRAPH_INDEX_AGENTS_ENV,
    CODE_GRAPH_INDEX_COMMANDS_ENV,
    CODE_GRAPH_INDEX_SPECS_ENV,
    CODE_GRAPH_INDEX_PLUGINS_ENV,
  ] as const;
  let originalIndexScopeEnv: Partial<Record<(typeof indexScopeEnvKeys)[number], string | undefined>> = {};

  beforeEach(() => {
    originalIndexScopeEnv = Object.fromEntries(
      indexScopeEnvKeys.map((key) => [key, process.env[key]]),
    );
    for (const key of indexScopeEnvKeys) {
      delete process.env[key];
    }
    vi.clearAllMocks();

    mocks.execSyncMock.mockReturnValue('new-head\n');
    mocks.executeBatteryMock.mockResolvedValue({
      batteryPath: '<in-memory>',
      queryCount: 1,
      pass_policy: {
        overall_pass_rate: 0.9,
        edge_focus_pass_rate: 0.8,
      },
      overall_pass_rate: 1,
      edge_focus_pass_rate: 1,
      overallPassRate: 1,
      categoryPassRates: {
        'mcp-tool': 1,
      },
      missingSymbols: [],
      unexpectedErrors: [],
      passed: true,
      probes: [],
    });
    mocks.loadGoldBatteryMock.mockReturnValue({
      schema_version: 1,
      pass_policy: {
        overall_pass_rate: 0.9,
        edge_focus_pass_rate: 0.8,
      },
      queries: [],
    });
    mocks.getCodeGraphMetadataMock.mockReturnValue(null);
    mocks.getStoredCodeGraphScopeMock.mockReturnValue({
      fingerprint: 'code-graph-scope:v2:skills=none:agents=none:commands=none:specs=none:plugins=none',
      label: 'end-user code only; .opencode skill, agent, command, specs and plugins excluded',
    });
    mocks.countTrackedSkillFilesMock.mockReturnValue(0);
    mocks.getGraphFreshnessMock.mockReturnValue('fresh');
    mocks.getGraphReadinessSnapshotMock.mockReturnValue({
      freshness: 'fresh',
      action: 'none',
      reason: 'all tracked files are up-to-date',
    });
    mocks.getLastGitHeadMock.mockReturnValue('old-head');
    mocks.getLastGoldVerificationMock.mockReturnValue(null);
    mocks.getLastFailedScanMock.mockReturnValue(null);
    mocks.getParseDiagnosticsSummaryMock.mockReturnValue({
      affectedFiles: 0,
      recentErrors: [],
    });
    mocks.countStaleButValidParseDiagnosticsMock.mockReturnValue(0);
    mocks.getSkipListSummaryMock.mockReturnValue({
      count: 0,
      lastSeenAt: null,
      sample: [],
    });
    mocks.getParserHealthMock.mockReturnValue('ok');
    mocks.recordFailedScanMock.mockImplementation((record) => ({
      ...record,
      recordedAt: '2026-05-06T00:00:00.000Z',
    }));
    mocks.recordParseDiagnosticMock.mockReturnValue({
      filePath: '/workspace/broken.ts',
      errorMessage: 'synthetic parse failure',
      errorCount: 1,
      lastSeenAt: '2026-05-06T00:00:00.000Z',
    });
    mocks.isFileStaleMock.mockReturnValue(false);
    mocks.existsSyncMock.mockReturnValue(true);
    mocks.realpathSyncMock.mockImplementation((path: string) => path);
    mocks.upsertFileMock.mockReturnValue(1);
    mocks.persistIndexedFileResultMock.mockImplementation((result) => {
      if (result.parseHealth === 'error') {
        mocks.recordParseDiagnosticMock(result.filePath, result.parseErrors.join('; '));
        return;
      }
      const fileId = mocks.upsertFileMock(
        result.filePath,
        result.language,
        result.contentHash,
        result.nodes.length,
        result.edges.length,
        result.parseHealth,
        result.parseDurationMs,
        { fileMtimeMs: 0 },
      );
      mocks.replaceNodesMock(fileId, result.nodes);
      mocks.replaceEdgesMock(result.nodes.map((node: { symbolId: string }) => node.symbolId), result.edges);
      mocks.upsertFileMock(
        result.filePath,
        result.language,
        result.contentHash,
        result.nodes.length,
        result.edges.length,
        result.parseHealth,
        result.parseDurationMs,
      );
    });
    mocks.getTrackedFilesMock.mockReturnValue(['/workspace/removed.ts']);
    mocks.getStatsMock.mockReturnValue({
      totalFiles: 1,
      totalNodes: 1,
      totalEdges: 0,
      nodesByKind: { function: 1 },
      edgesByType: {},
      parseHealthSummary: { clean: 1 },
      lastScanTimestamp: '2026-04-17T00:00:00.000Z',
      lastGitHead: 'old-head',
      dbFileSize: 1024,
      schemaVersion: 4,
      graphQualitySummary: {
        detectorProvenanceSummary: null,
        graphEdgeEnrichmentSummary: null,
      },
    });
    mocks.resolveCrossFileCallEdgesMock.mockReturnValue({
      resolved: 0,
      unresolved: 0,
      ambiguousSkipped: 0,
    });
    mocks.hasCrossFileCallResolutionActivityMock.mockReturnValue(false);
    mocks.indexFilesMock.mockResolvedValue(withPreParseSkippedCount([{
      filePath: '/workspace/current.ts',
      language: 'typescript',
      contentHash: 'hash-1',
      nodes: [{
        symbolId: 'current::symbol',
      }],
      edges: [],
      detectorProvenance: 'structured',
      parseHealth: 'clean',
      parseDurationMs: 10,
      parseErrors: [],
    }]));
  });

  afterEach(() => {
    for (const key of indexScopeEnvKeys) {
      const originalValue = originalIndexScopeEnv[key];
      if (originalValue === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = originalValue;
      }
    }
  });

  it('honors incremental scans when git HEAD changes', async () => {
    mocks.isFileStaleMock.mockReturnValue(true);

    const response = await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: true,
    });

    const payload = JSON.parse(response.content[0].text) as {
      status: string;
      data: {
        filesIndexed: number;
        filesSkipped: number;
        fullReindexTriggered: boolean;
        currentGitHead: string | null;
        previousGitHead: string | null;
        canonicalReadiness: string;
        trustState: string;
        lastPersistedAt: string | null;
        detectorProvenanceSummary: {
          dominant: string;
          counts: Record<string, number>;
        };
      };
    };

    expect(payload.status).toBe('ok');
    expect(payload.data.filesIndexed).toBe(1);
    expect(payload.data.filesSkipped).toBe(0);
    expect(payload.data.fullReindexTriggered).toBe(false);
    expect(payload.data.previousGitHead).toBe('old-head');
    expect(payload.data.currentGitHead).toBe('new-head');
    expect(payload.data.canonicalReadiness).toBe('ready');
    expect(payload.data.trustState).toBe('live');
    expect(payload.data.lastPersistedAt).toBe('2026-04-17T00:00:00.000Z');
    expect(mocks.execSyncMock).toHaveBeenCalledWith('git rev-parse HEAD', expect.objectContaining({
      cwd: process.cwd(),
      encoding: 'utf-8',
    }));
    expect(mocks.indexFilesMock).toHaveBeenCalledWith(expect.any(Object), { skipFreshFiles: true });
    expect(mocks.removeFileMock).not.toHaveBeenCalled();
    expect(mocks.isFileStaleMock).toHaveBeenCalledWith('/workspace/current.ts', {
      currentContentHash: 'hash-1',
    });
    expect(mocks.upsertFileMock).toHaveBeenCalled();
    expect(mocks.recordCandidateManifestMock).toHaveBeenCalledWith(mocks.getTrackedFilesMock.mock.results.at(-1)?.value);
    expect(payload.data.detectorProvenanceSummary).toEqual({
      dominant: 'structured',
      counts: {
        structured: 1,
      },
    });
    expect(mocks.setLastDetectorProvenanceMock).toHaveBeenCalledWith('structured');
    expect(mocks.setLastDetectorProvenanceSummaryMock).toHaveBeenCalledWith({
      dominant: 'structured',
      counts: {
        structured: 1,
      },
    });
    expect(mocks.setLastGitHeadMock).toHaveBeenCalledWith('new-head');
    expect(mocks.setCodeGraphScopeMock).toHaveBeenCalledWith(expect.objectContaining({
      fingerprint: 'code-graph-scope:v2:skills=none:agents=none:commands=none:specs=none:plugins=none',
      includeSkills: false,
    }));
  });

  it('passes includeSkills through to the indexer config for one-call opt-in scans', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');

    await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: false,
      includeSkills: true,
      forceScopeChange: true,
    });

    expect(mocks.indexFilesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        scopePolicy: expect.objectContaining({
          includeSkills: true,
          source: 'scan-argument',
          fingerprint: 'code-graph-scope:v2:skills=all:agents=none:commands=none:specs=none:plugins=none',
        }),
        excludeGlobs: expect.not.arrayContaining(['**/.opencode/skills/**']),
      }),
      expect.any(Object),
    );
    expect(mocks.setCodeGraphScopeMock).toHaveBeenCalledWith(expect.objectContaining({
      includeSkills: true,
      source: 'scan-argument',
    }));
  });

  it('lets includeSkills false override an env opt-in for one-call end-user scans', async () => {
    process.env[CODE_GRAPH_INDEX_SKILLS_ENV] = 'true';
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');

    await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: false,
      includeSkills: false,
    });

    expect(mocks.indexFilesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        scopePolicy: expect.objectContaining({
          includeSkills: false,
          source: 'scan-argument',
          fingerprint: 'code-graph-scope:v2:skills=none:agents=none:commands=none:specs=none:plugins=none',
        }),
        excludeGlobs: expect.arrayContaining(['**/.opencode/skills/**']),
      }),
      expect.any(Object),
    );
    expect(mocks.setCodeGraphScopeMock).toHaveBeenCalledWith(expect.objectContaining({
      includeSkills: false,
      source: 'scan-argument',
    }));
  });

  it('passes granular includeSkills lists through to the indexer config', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');

    await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: false,
      includeSkills: ['sk-doc', 'sk-code-review'],
    });

    expect(mocks.indexFilesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        scopePolicy: expect.objectContaining({
          includeSkills: true,
          includedSkillsList: ['sk-code-review', 'sk-doc'],
          source: 'scan-argument',
          fingerprint: 'code-graph-scope:v2:skills=list[sk-code-review,sk-doc]:agents=none:commands=none:specs=none:plugins=none',
        }),
        excludeGlobs: expect.not.arrayContaining(['**/.opencode/skills/**']),
      }),
      expect.any(Object),
    );
  });

  it.each([
    ['agents', CODE_GRAPH_INDEX_AGENTS_ENV, 'includeAgents', '**/.opencode/agents/**'],
    ['commands', CODE_GRAPH_INDEX_COMMANDS_ENV, 'includeCommands', '**/.opencode/commands/**'],
    ['specs', CODE_GRAPH_INDEX_SPECS_ENV, 'includeSpecs', '**/.opencode/specs/**'],
    ['plugins', CODE_GRAPH_INDEX_PLUGINS_ENV, 'includePlugins', '**/.opencode/plugins/**'],
  ] as const)(
    'passes .opencode/%s env and per-call inclusion through to the indexer config',
    async (_name, envKey, inputKey, glob) => {
      process.env[envKey] = 'true';
      mocks.execSyncMock.mockReturnValue('same-head\n');
      mocks.getLastGitHeadMock.mockReturnValue('same-head');

      await handleCodeGraphScan({
        rootDir: process.cwd(),
        incremental: false,
      });

      expect(mocks.indexFilesMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          scopePolicy: expect.objectContaining({
            [inputKey]: true,
            source: 'env',
          }),
          excludeGlobs: expect.not.arrayContaining([glob]),
        }),
        expect.any(Object),
      );

      mocks.indexFilesMock.mockClear();
      await handleCodeGraphScan({
        rootDir: process.cwd(),
        incremental: false,
        [inputKey]: false,
      });

      expect(mocks.indexFilesMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          scopePolicy: expect.objectContaining({
            [inputKey]: false,
            source: 'scan-argument',
          }),
          excludeGlobs: expect.arrayContaining([glob]),
        }),
        expect.any(Object),
      );
    },
  );

  it('reports status activeScope from the stored scan scope after an env override scan', async () => {
    process.env[CODE_GRAPH_INDEX_SKILLS_ENV] = 'true';
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');

    await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: false,
      includeSkills: false,
    });

    const storedPolicy = mocks.setCodeGraphScopeMock.mock.calls.at(-1)?.[0];
    mocks.getStoredCodeGraphScopeMock.mockReturnValue({
      fingerprint: storedPolicy.fingerprint,
      label: storedPolicy.label,
      includeSkills: storedPolicy.includeSkills,
      includedSkillsList: storedPolicy.includedSkillsList,
      includeAgents: storedPolicy.includeAgents,
      includeCommands: storedPolicy.includeCommands,
      includeSpecs: storedPolicy.includeSpecs,
      includePlugins: storedPolicy.includePlugins,
      source: storedPolicy.source,
    });
    mocks.getStatsMock.mockReturnValue({
      totalFiles: 1,
      totalNodes: 1,
      totalEdges: 0,
      nodesByKind: { function: 1 },
      edgesByType: {},
      parseHealthSummary: { clean: 1 },
      lastScanTimestamp: '2026-04-17T00:00:00.000Z',
      lastGitHead: 'same-head',
      dbFileSize: 1024,
      schemaVersion: 1,
      graphQualitySummary: {
        detectorProvenanceSummary: null,
        graphEdgeEnrichmentSummary: null,
      },
    });

    const response = await handleCodeGraphStatus();
    const payload = JSON.parse(response.content[0].text) as {
      data: {
        activeScope: {
          includeSkills: boolean;
          includedSkills: 'all' | 'none' | string[];
          includedAgents: 'all' | 'none';
          includedCommands: 'all' | 'none';
          includedSpecs: 'all' | 'none';
          includedPlugins: 'all' | 'none';
          includeAgents: boolean;
          includeCommands: boolean;
          includeSpecs: boolean;
          includePlugins: boolean;
          source: string;
          fingerprint: string;
          label: string;
        };
        storedScope: {
          includeSkills: boolean;
          includedSkillsList: 'all' | 'none' | string[];
          includeAgents: boolean;
          includeCommands: boolean;
          includeSpecs: boolean;
          includePlugins: boolean;
          source: string;
          fingerprint: string;
          label: string;
        };
        scopeMismatch: boolean;
      };
    };

    expect(payload.data.activeScope.includeSkills).toBe(false);
    expect(payload.data.activeScope.includedSkills).toBe('none');
    expect(payload.data.activeScope.includedAgents).toBe('none');
    expect(payload.data.activeScope.includedCommands).toBe('none');
    expect(payload.data.activeScope.includedSpecs).toBe('none');
    expect(payload.data.activeScope.includedPlugins).toBe('none');
    expect(payload.data.activeScope.source).toBe('scan-argument');
    expect(payload.data.storedScope).toMatchObject({
      fingerprint: payload.data.activeScope.fingerprint,
      label: payload.data.activeScope.label,
      includeSkills: payload.data.activeScope.includeSkills,
      includedSkillsList: payload.data.activeScope.includedSkills,
      includeAgents: payload.data.activeScope.includeAgents,
      includeCommands: payload.data.activeScope.includeCommands,
      includeSpecs: payload.data.activeScope.includeSpecs,
      includePlugins: payload.data.activeScope.includePlugins,
      source: payload.data.activeScope.source,
    });
    expect(payload.data.scopeMismatch).toBe(false);
  });

  it('passes the canonical rootDir into the indexer config', async () => {
    const workspaceRoot = resolve(process.cwd());
    const aliasRoot = join(workspaceRoot, 'alias');
    const canonicalSkillRoot = join(workspaceRoot, '.opencode', 'skill');
    mocks.realpathSyncMock.mockImplementation((path: string) => {
      if (path === workspaceRoot) {
        return workspaceRoot;
      }
      if (path === resolve(aliasRoot)) {
        return canonicalSkillRoot;
      }
      return path;
    });
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');

    await handleCodeGraphScan({
      rootDir: aliasRoot,
      incremental: false,
    });

    expect(mocks.indexFilesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        rootDir: canonicalSkillRoot,
        scopePolicy: expect.objectContaining({
          includeSkills: false,
        }),
      }),
      expect.any(Object),
    );
    expect(mocks.execSyncMock).toHaveBeenCalledWith('git rev-parse HEAD', expect.objectContaining({
      cwd: canonicalSkillRoot,
      encoding: 'utf-8',
    }));
  });

  it('does not expose the workspace prefix in invalid rootDir errors', async () => {
    const workspaceRoot = resolve(process.cwd());
    const brokenRoot = join(workspaceRoot, 'missing-link');
    mocks.realpathSyncMock.mockImplementation((path: string) => {
      if (path === workspaceRoot) {
        return workspaceRoot;
      }
      throw new Error('broken symlink');
    });

    const response = await handleCodeGraphScan({
      rootDir: brokenRoot,
      incremental: false,
    });
    const payload = JSON.parse(response.content[0].text) as { status: string; error: string };

    expect(payload.status).toBe('error');
    expect(payload.error).toContain('missing-link');
    expect(payload.error).not.toContain(workspaceRoot);
  });

  it('uses basenames instead of absolute paths for out-of-workspace rootDir errors', async () => {
    const workspaceRoot = resolve(process.cwd());
    const outsideRoot = resolve(workspaceRoot, '..', 'outside-secret');
    mocks.realpathSyncMock.mockImplementation((path: string) => {
      if (path === workspaceRoot) {
        return workspaceRoot;
      }
      if (path === outsideRoot) {
        return outsideRoot;
      }
      return path;
    });

    const response = await handleCodeGraphScan({
      rootDir: outsideRoot,
      incremental: false,
    });
    const payload = JSON.parse(response.content[0].text) as { status: string; error: string };

    expect(payload.status).toBe('error');
    expect(payload.error).toContain(basename(outsideRoot));
    expect(payload.error).not.toContain(workspaceRoot);
    expect(payload.error).not.toContain(outsideRoot);
  });

  it('returns scan warnings without absolute workspace paths', async () => {
    const workspaceRoot = resolve(process.cwd());
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.indexFilesMock.mockResolvedValue(Object.assign([], {
      warnings: [
        `[structural-indexer] Aborting descent at maxDepth=80: ${join(workspaceRoot, 'src')}`,
        `[structural-indexer] Aborting walk at ${resolve(workspaceRoot, '..', 'outside-warning')}`,
      ],
      capExceeded: { maxNodes: false, depth: true, gitignoreSize: false },
    }));

    const response = await handleCodeGraphScan({
      rootDir: workspaceRoot,
      incremental: false,
    });
    const payload = JSON.parse(response.content[0].text) as { data: { warnings: string[] } };

    expect(payload.data.warnings).toContain('[structural-indexer] Aborting descent at maxDepth=80: src');
    expect(payload.data.warnings).toContain('[structural-indexer] Aborting walk at outside-warning');
    expect(payload.data.warnings.join('\n')).not.toContain(workspaceRoot);
  });

  it('returns data.errors with workspace-relative parse failure paths', async () => {
    const workspaceRoot = resolve(process.cwd());
    const brokenFile = join(workspaceRoot, 'mcp_server', 'broken.ts');
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.indexFilesMock.mockResolvedValue(withPreParseSkippedCount([{
      filePath: brokenFile,
      language: 'typescript',
      contentHash: 'hash-parse-error',
      nodes: [],
      edges: [],
      detectorProvenance: 'ast',
      parseHealth: 'error',
      parseDurationMs: 10,
      parseErrors: [`Unexpected token in ${brokenFile}`],
    }]));

    const response = await handleCodeGraphScan({
      rootDir: workspaceRoot,
      incremental: false,
    });
    const payload = JSON.parse(response.content[0].text) as { data: { errors: string[] } };

    expect(payload.data.errors[0]).toContain('mcp_server/broken.ts');
    expect(payload.data.errors[0]).not.toContain(workspaceRoot);
    expect(payload.data.errors[0]).not.toContain(process.cwd());
    expect(payload.data.errors[0]).not.toMatch(/^\/Users\//);
  });

  it('optionally runs verification for explicit full scans and attaches the result', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');

    const response = await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: false,
      verify: true,
    });

    const payload = JSON.parse(response.content[0].text) as {
      status: string;
      data: {
        verification: {
          batteryPath: string;
          passed: boolean;
        };
      };
    };

    expect(payload.status).toBe('ok');
    expect(payload.data.verification).toEqual(expect.objectContaining({
      passed: true,
      batteryPath: expect.stringContaining('code-graph-gold-queries.json'),
    }));
    expect(mocks.loadGoldBatteryMock).toHaveBeenCalledWith(expect.stringContaining('code-graph-gold-queries.json'));
    expect(mocks.executeBatteryMock).toHaveBeenCalledWith(
      mocks.loadGoldBatteryMock.mock.results[0]?.value,
      expect.any(Function),
    );
    expect(mocks.setLastGoldVerificationMock).toHaveBeenCalledWith(payload.data.verification);
  });

  it('does not run verification for incremental scans even when verify is requested', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');

    await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: true,
      verify: true,
    });

    expect(mocks.loadGoldBatteryMock).not.toHaveBeenCalled();
    expect(mocks.executeBatteryMock).not.toHaveBeenCalled();
    expect(mocks.setLastGoldVerificationMock).not.toHaveBeenCalled();
  });

  it('reseeds the edge distribution baseline on a full scan when the persisted baseline metadata is malformed', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.getCodeGraphMetadataMock.mockReturnValue('{malformed');
    mocks.indexFilesMock.mockResolvedValue(withPreParseSkippedCount([{
      filePath: '/workspace/current.ts',
      language: 'typescript',
      contentHash: 'hash-1',
      nodes: [{ symbolId: 'current::symbol' }],
      edges: [{
        sourceId: 'current::symbol',
        targetId: 'dep::symbol',
        edgeType: 'CALLS',
        weight: 1,
        metadata: {},
      }],
      detectorProvenance: 'structured',
      parseHealth: 'clean',
      parseDurationMs: 10,
      parseErrors: [],
    }]));

    await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: false,
    });

    expect(mocks.setCodeGraphMetadataMock).toHaveBeenCalledWith(
      'edge_distribution_baseline',
      expect.any(String),
    );

    const persistedBaseline = mocks.setCodeGraphMetadataMock.mock.calls.find(
      ([key]) => key === 'edge_distribution_baseline',
    )?.[1];
    expect(JSON.parse(persistedBaseline)).toMatchObject({
      CALLS: 1,
    });
  });

  it('persists a full-scan edge baseline and surfaces the next drift summary in status', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.indexFilesMock.mockResolvedValue(withPreParseSkippedCount([{
      filePath: '/workspace/current.ts',
      language: 'typescript',
      contentHash: 'hash-1',
      nodes: [{ symbolId: 'current::symbol' }],
      edges: [{
        sourceId: 'current::symbol',
        targetId: 'dep::symbol',
        edgeType: 'CALLS',
        weight: 1,
        metadata: {},
      }],
      detectorProvenance: 'structured',
      parseHealth: 'clean',
      parseDurationMs: 10,
      parseErrors: [],
    }]));

    await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: false,
    });

    const persistedBaseline = mocks.setCodeGraphMetadataMock.mock.calls.find(
      ([key]) => key === 'edge_distribution_baseline',
    )?.[1];
    expect(persistedBaseline).toBeDefined();

    mocks.getCodeGraphMetadataMock.mockImplementation((key: string) => (
      key === 'edge_distribution_baseline' ? persistedBaseline : null
    ));
    mocks.getStatsMock.mockReturnValue({
      totalFiles: 1,
      totalNodes: 1,
      totalEdges: 2,
      nodesByKind: { function: 1 },
      edgesByType: { CALLS: 1, IMPORTS: 1 },
      parseHealthSummary: { clean: 1 },
      lastScanTimestamp: '2026-04-17T00:00:00.000Z',
      lastGitHead: 'same-head',
      dbFileSize: 1024,
      schemaVersion: 1,
      graphQualitySummary: {
        detectorProvenanceSummary: null,
        graphEdgeEnrichmentSummary: null,
      },
    });

    const response = await handleCodeGraphStatus();
    const payload = JSON.parse(response.content[0].text) as {
      status: string;
      data: {
        edgeDriftSummary: {
          share_drift: Record<string, number>;
          psi: number;
          jsd: number;
          flagged: boolean;
        };
      };
    };

    expect(payload.status).toBe('ok');
    expect(payload.data.edgeDriftSummary).toMatchObject({
      flagged: true,
    });
    expect(payload.data.edgeDriftSummary.share_drift.CALLS).toBeCloseTo(-0.5);
    expect(payload.data.edgeDriftSummary.share_drift.IMPORTS).toBeCloseTo(0.5);
    expect(payload.data.edgeDriftSummary.psi).toBeGreaterThan(0);
    expect(payload.data.edgeDriftSummary.jsd).toBeGreaterThan(0);
  });

  it('clears the persisted edge-enrichment summary when a later scan reports no summary', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.isFileStaleMock.mockReturnValue(true);
    mocks.indexFilesMock
      .mockResolvedValueOnce(withPreParseSkippedCount([{
        filePath: '/workspace/current.ts',
        language: 'typescript',
        contentHash: 'hash-1',
        nodes: [{ symbolId: 'current::symbol' }],
        edges: [{
          sourceId: 'current::symbol',
          targetId: 'dep::symbol',
          edgeType: 'CALLS',
          weight: 1,
          metadata: { confidence: 0.95, detectorProvenance: 'structured', evidenceClass: 'EXTRACTED' },
        }],
        detectorProvenance: 'structured',
        parseHealth: 'clean',
        parseDurationMs: 10,
        parseErrors: [],
      }]))
      .mockResolvedValueOnce(withPreParseSkippedCount([{
        filePath: '/workspace/current.ts',
        language: 'typescript',
        contentHash: 'hash-2',
        nodes: [{ symbolId: 'current::symbol' }],
        edges: [{
          sourceId: 'current::symbol',
          targetId: 'dep::symbol',
          edgeType: 'CALLS',
          weight: 1,
          metadata: {},
        }],
        detectorProvenance: 'structured',
        parseHealth: 'clean',
        parseDurationMs: 10,
        parseErrors: [],
      }]));

    await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: true,
    });
    await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: true,
    });

    expect(mocks.setLastGraphEdgeEnrichmentSummaryMock).toHaveBeenCalledWith({
      edgeEvidenceClass: 'direct_call',
      numericConfidence: 0.95,
    });
    expect(mocks.clearLastGraphEdgeEnrichmentSummaryMock).toHaveBeenCalledTimes(1);
  });

  it('preserves persisted summaries for no-op incremental scans that skip fresh files before parse', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.indexFilesMock.mockImplementationOnce(async (_config, options) => {
      expect(options).toEqual({ skipFreshFiles: true });
      return withPreParseSkippedCount([], 3);
    });

    const response = await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: true,
    });

    const payload = JSON.parse(response.content[0].text) as {
      status: string;
      data: {
        filesScanned: number;
        filesIndexed: number;
        filesSkipped: number;
        graphEdgeEnrichmentSummary: null;
      };
    };

    expect(payload.status).toBe('ok');
    expect(payload.data.filesScanned).toBe(0);
    expect(payload.data.filesIndexed).toBe(0);
    expect(payload.data.filesSkipped).toBe(3);
    expect(payload.data.graphEdgeEnrichmentSummary).toBeNull();
    expect(mocks.indexFilesMock).toHaveBeenCalledWith(expect.any(Object), { skipFreshFiles: true });
    expect(mocks.isFileStaleMock).not.toHaveBeenCalled();
    expect(mocks.setLastGraphEdgeEnrichmentSummaryMock).not.toHaveBeenCalled();
    expect(mocks.clearLastGraphEdgeEnrichmentSummaryMock).not.toHaveBeenCalled();
  });

  it('passes the parser content hash into stale checks during incremental scans', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.isFileStaleMock.mockReturnValue(true);

    await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: true,
    });

    expect(mocks.isFileStaleMock).toHaveBeenCalledWith('/workspace/current.ts', {
      currentContentHash: 'hash-1',
    });
  });

  it('removes deleted tracked files during incremental scans', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.getTrackedFilesMock.mockReturnValue(['/workspace/current.ts', '/workspace/deleted.ts']);
    mocks.existsSyncMock.mockImplementation((filePath: string) => filePath !== '/workspace/deleted.ts');

    const response = await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: true,
    });

    const payload = JSON.parse(response.content[0].text) as {
      status: string;
      data: {
        filesIndexed: number;
        filesSkipped: number;
        fullReindexTriggered: boolean;
      };
    };

    expect(payload.status).toBe('ok');
    expect(payload.data.filesIndexed).toBe(0);
    expect(payload.data.filesSkipped).toBe(1);
    expect(payload.data.fullReindexTriggered).toBe(false);
    expect(mocks.removeFileMock).toHaveBeenCalledWith('/workspace/deleted.ts');
    expect(mocks.upsertFileMock).not.toHaveBeenCalled();
  });

  it('blocks scope-mismatched full scan even when the candidate scan has nodes', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.getStatsMock.mockReturnValue({
      totalFiles: 5600,
      totalNodes: 56000,
      totalEdges: 7000,
      nodesByKind: { function: 56000 },
      edgesByType: { CALLS: 7000 },
      parseHealthSummary: { clean: 5600 },
      lastScanTimestamp: '2026-04-17T00:00:00.000Z',
      lastGitHead: 'same-head',
      dbFileSize: 1024,
      schemaVersion: 4,
      graphQualitySummary: {
        detectorProvenanceSummary: null,
        graphEdgeEnrichmentSummary: null,
      },
    });
    mocks.getStoredCodeGraphScopeMock.mockReturnValue({
      fingerprint: 'code-graph-scope:v2:skills=all:agents=none:commands=none:specs=none:plugins=none',
      label: 'all .opencode skill files included; agent, command, specs and plugins excluded',
      includeSkills: true,
      includedSkillsList: null,
      includeAgents: false,
      includeCommands: false,
      includeSpecs: false,
      includePlugins: false,
      source: 'scan-argument',
    });
    mocks.indexFilesMock.mockResolvedValue(withPreParseSkippedCount(Array.from({ length: 5 }, (_value, index) => ({
      filePath: `/workspace/current-${index}.ts`,
      language: 'typescript',
      contentHash: `hash-${index}`,
      nodes: [{ symbolId: `current-${index}::symbol` }],
      edges: [],
      detectorProvenance: 'structured',
      parseHealth: 'clean',
      parseDurationMs: 10,
      parseErrors: [],
    }))));

    const response = await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: false,
    });
    const payload = JSON.parse(response.content[0].text) as {
      status: string;
      reason: string;
      data: {
        totalNodes: number;
        failedScan: { reason: string };
        warnings: string[];
      };
    };

    expect(payload.status).toBe('blocked');
    expect(payload.reason).toBe('scope_change_scan_rejected');
    expect(payload.data.totalNodes).toBe(56000);
    expect(payload.data.failedScan.reason).toBe('scope_change_scan_rejected');
    expect(payload.data.warnings).toEqual(expect.arrayContaining([
      expect.stringContaining('forceScopeChange: true'),
    ]));
    expect(mocks.removeFileMock).not.toHaveBeenCalled();
    expect(mocks.persistIndexedFileResultMock).not.toHaveBeenCalled();
    expect(mocks.setLastGitHeadMock).not.toHaveBeenCalled();
    expect(mocks.setCodeGraphScopeMock).not.toHaveBeenCalled();
    expect(mocks.recordCandidateManifestMock).not.toHaveBeenCalled();
  });

  it('blocks scope-mismatched scan with includeGlobs/excludeGlobs even when no scope-folder flags differ', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.getStatsMock.mockReturnValue({
      totalFiles: 3,
      totalNodes: 42,
      totalEdges: 7,
      nodesByKind: { function: 42 },
      edgesByType: { CALLS: 7 },
      parseHealthSummary: { clean: 3 },
      lastScanTimestamp: '2026-04-17T00:00:00.000Z',
      lastGitHead: 'same-head',
      dbFileSize: 1024,
      schemaVersion: 4,
      graphQualitySummary: {
        detectorProvenanceSummary: null,
        graphEdgeEnrichmentSummary: null,
      },
    });
    mocks.getStoredCodeGraphScopeMock.mockReturnValue({
      fingerprint: 'code-graph-scope:v3:skills=none:agents=none:commands=none:specs=none:plugins=none:includeGlobs=[**%2F*.ts]:excludeGlobs=[]',
      label: 'end-user code only; .opencode skill, agent, command, specs and plugins excluded',
      source: 'scan-argument',
    });
    mocks.indexFilesMock.mockResolvedValue(withPreParseSkippedCount([{
      filePath: '/workspace/src/current.ts',
      language: 'typescript',
      contentHash: 'hash-current',
      nodes: [{ symbolId: 'current::symbol' }],
      edges: [],
      detectorProvenance: 'structured',
      parseHealth: 'clean',
      parseDurationMs: 10,
      parseErrors: [],
    }]));

    const response = await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: false,
      includeGlobs: ['**/*.ts'],
      excludeGlobs: ['**/*'],
    });
    const payload = JSON.parse(response.content[0].text) as {
      status: string;
      reason: string;
      data: { warnings: string[] };
    };

    expect(payload.status).toBe('blocked');
    expect(payload.reason).toBe('scope_change_scan_rejected');
    expect(payload.data.warnings).toEqual(expect.arrayContaining([
      expect.stringContaining('candidate scope fingerprint'),
    ]));
    expect(mocks.persistIndexedFileResultMock).not.toHaveBeenCalled();
    expect(mocks.setCodeGraphScopeMock).not.toHaveBeenCalled();
  });

  it('allows forceScopeChange to replace a populated graph with a different nonzero scope', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.getStatsMock.mockReturnValue({
      totalFiles: 5600,
      totalNodes: 56000,
      totalEdges: 7000,
      nodesByKind: { function: 56000 },
      edgesByType: { CALLS: 7000 },
      parseHealthSummary: { clean: 5600 },
      lastScanTimestamp: '2026-04-17T00:00:00.000Z',
      lastGitHead: 'same-head',
      dbFileSize: 1024,
      schemaVersion: 4,
      graphQualitySummary: {
        detectorProvenanceSummary: null,
        graphEdgeEnrichmentSummary: null,
      },
    });
    mocks.getStoredCodeGraphScopeMock.mockReturnValue({
      fingerprint: 'code-graph-scope:v2:skills=all:agents=none:commands=none:specs=none:plugins=none',
      label: 'all .opencode skill files included; agent, command, specs and plugins excluded',
      includeSkills: true,
      includedSkillsList: null,
      includeAgents: false,
      includeCommands: false,
      includeSpecs: false,
      includePlugins: false,
      source: 'scan-argument',
    });
    mocks.indexFilesMock.mockResolvedValue(withPreParseSkippedCount(Array.from({ length: 5 }, (_value, index) => ({
      filePath: `/workspace/current-${index}.ts`,
      language: 'typescript',
      contentHash: `hash-${index}`,
      nodes: [{ symbolId: `current-${index}::symbol` }],
      edges: [],
      detectorProvenance: 'structured',
      parseHealth: 'clean',
      parseDurationMs: 10,
      parseErrors: [],
    }))));

    const response = await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: false,
      forceScopeChange: true,
    });
    const payload = JSON.parse(response.content[0].text) as { status: string };

    expect(payload.status).toBe('ok');
    expect(mocks.persistIndexedFileResultMock).toHaveBeenCalledTimes(5);
    expect(mocks.setCodeGraphScopeMock).toHaveBeenCalledWith(expect.objectContaining({
      fingerprint: 'code-graph-scope:v2:skills=none:agents=none:commands=none:specs=none:plugins=none',
    }));
  });

  it('allows a dramatic nonzero shrink when the stored scan scope is unchanged', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.getStatsMock.mockReturnValue({
      totalFiles: 5600,
      totalNodes: 56000,
      totalEdges: 7000,
      nodesByKind: { function: 56000 },
      edgesByType: { CALLS: 7000 },
      parseHealthSummary: { clean: 5600 },
      lastScanTimestamp: '2026-04-17T00:00:00.000Z',
      lastGitHead: 'same-head',
      dbFileSize: 1024,
      schemaVersion: 4,
      graphQualitySummary: {
        detectorProvenanceSummary: null,
        graphEdgeEnrichmentSummary: null,
      },
    });
    mocks.indexFilesMock.mockResolvedValue(withPreParseSkippedCount(Array.from({ length: 5 }, (_value, index) => ({
      filePath: `/workspace/current-${index}.ts`,
      language: 'typescript',
      contentHash: `hash-${index}`,
      nodes: [{ symbolId: `current-${index}::symbol` }],
      edges: [],
      detectorProvenance: 'structured',
      parseHealth: 'clean',
      parseDurationMs: 10,
      parseErrors: [],
    }))));

    const response = await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: false,
    });
    const payload = JSON.parse(response.content[0].text) as { status: string };

    expect(payload.status).toBe('ok');
    expect(mocks.persistIndexedFileResultMock).toHaveBeenCalledTimes(5);
    expect(mocks.setCodeGraphScopeMock).toHaveBeenCalledWith(expect.objectContaining({
      fingerprint: 'code-graph-scope:v2:skills=none:agents=none:commands=none:specs=none:plugins=none',
    }));
  });

  it('does not wipe populated graph when subsequent full scan returns 0 nodes', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.getStatsMock.mockReturnValue({
      totalFiles: 3,
      totalNodes: 42,
      totalEdges: 7,
      nodesByKind: { function: 42 },
      edgesByType: { CALLS: 7 },
      parseHealthSummary: { clean: 3 },
      lastScanTimestamp: '2026-04-17T00:00:00.000Z',
      lastGitHead: 'same-head',
      dbFileSize: 1024,
      schemaVersion: 4,
      graphQualitySummary: {
        detectorProvenanceSummary: null,
        graphEdgeEnrichmentSummary: null,
      },
    });
    mocks.indexFilesMock.mockResolvedValue(withPreParseSkippedCount([]));

    const response = await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: false,
    });
    const payload = JSON.parse(response.content[0].text) as {
      status: string;
      reason: string;
      data: {
        totalNodes: number;
        failedScan: { reason: string };
      };
    };

    expect(payload.status).toBe('blocked');
    expect(payload.reason).toBe('zero_node_scan_rejected');
    expect(payload.data.totalNodes).toBe(42);
    expect(payload.data.failedScan.reason).toBe('zero_node_scan_rejected');
    expect(mocks.removeFileMock).not.toHaveBeenCalled();
    expect(mocks.persistIndexedFileResultMock).not.toHaveBeenCalled();
    expect(mocks.setLastGitHeadMock).not.toHaveBeenCalled();
    expect(mocks.setCodeGraphScopeMock).not.toHaveBeenCalled();
    expect(mocks.recordCandidateManifestMock).not.toHaveBeenCalled();
  });

  it('allows an explicit forceZeroNodeReset to bypass the zero-node guard', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.indexFilesMock.mockResolvedValue(withPreParseSkippedCount([]));

    const response = await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: false,
      forceZeroNodeReset: true,
    });
    const payload = JSON.parse(response.content[0].text) as { status: string };

    expect(payload.status).toBe('ok');
    expect(mocks.removeFileMock).toHaveBeenCalledWith('/workspace/removed.ts');
    expect(mocks.setLastGitHeadMock).toHaveBeenCalledWith('same-head');
    expect(mocks.setCodeGraphScopeMock).toHaveBeenCalled();
  });

  it('does not promote live metadata when parse error ratio exceeds threshold', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.indexFilesMock.mockResolvedValue(withPreParseSkippedCount([
      {
        filePath: '/workspace/current.ts',
        language: 'typescript',
        contentHash: 'hash-clean',
        nodes: [{ symbolId: 'current::symbol' }],
        edges: [],
        detectorProvenance: 'structured',
        parseHealth: 'clean',
        parseDurationMs: 10,
        parseErrors: [],
      },
      {
        filePath: '/workspace/broken-a.ts',
        language: 'typescript',
        contentHash: 'hash-error-a',
        nodes: [],
        edges: [],
        detectorProvenance: 'ast',
        parseHealth: 'error',
        parseDurationMs: 10,
        parseErrors: ['native parser crashed A'],
      },
      {
        filePath: '/workspace/broken-b.ts',
        language: 'typescript',
        contentHash: 'hash-error-b',
        nodes: [],
        edges: [],
        detectorProvenance: 'ast',
        parseHealth: 'error',
        parseDurationMs: 10,
        parseErrors: ['native parser crashed B'],
      },
    ]));

    const response = await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: false,
    });
    const payload = JSON.parse(response.content[0].text) as {
      status: string;
      data: {
        failedScan: { reason: string };
        warnings: string[];
      };
    };

    expect(payload.status).toBe('ok');
    expect(payload.data.failedScan.reason).toBe('parse_error_threshold_exceeded');
    expect(payload.data.warnings.join('\n')).toContain('parse error ratio');
    expect(mocks.removeFileMock).not.toHaveBeenCalled();
    expect(mocks.setLastGitHeadMock).not.toHaveBeenCalled();
    expect(mocks.setCodeGraphScopeMock).not.toHaveBeenCalled();
    expect(mocks.setLastDetectorProvenanceSummaryMock).not.toHaveBeenCalled();
    expect(mocks.recordCandidateManifestMock).not.toHaveBeenCalled();
  });

  it('keeps skip-list-heavy parse bypass scans promotable', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.indexFilesMock.mockResolvedValue(withPreParseSkippedCount([
      {
        filePath: '/workspace/current-a.ts',
        language: 'typescript',
        contentHash: 'hash-clean-a',
        nodes: [{ symbolId: 'current-a::symbol' }],
        edges: [],
        detectorProvenance: 'structured',
        parseHealth: 'clean',
        parseDurationMs: 10,
        parseErrors: [],
      },
      {
        filePath: '/workspace/current-b.ts',
        language: 'typescript',
        contentHash: 'hash-clean-b',
        nodes: [{ symbolId: 'current-b::symbol' }],
        edges: [],
        detectorProvenance: 'structured',
        parseHealth: 'clean',
        parseDurationMs: 10,
        parseErrors: [],
      },
      {
        filePath: '/workspace/skip-a.sh',
        language: 'shell',
        contentHash: 'hash-skip-a',
        nodes: [],
        edges: [],
        detectorProvenance: 'ast',
        parseHealth: 'error',
        parseDurationMs: 10,
        parseErrors: ['Parser skipped by skip-list (B1): known native parser crash'],
      },
      {
        filePath: '/workspace/skip-b.sh',
        language: 'shell',
        contentHash: 'hash-skip-b',
        nodes: [],
        edges: [],
        detectorProvenance: 'ast',
        parseHealth: 'error',
        parseDurationMs: 10,
        parseErrors: ['Parser skipped by skip-list (B2): known wasm trap'],
      },
      {
        filePath: '/workspace/skip-c.sh',
        language: 'shell',
        contentHash: 'hash-skip-c',
        nodes: [],
        edges: [],
        detectorProvenance: 'ast',
        parseHealth: 'error',
        parseDurationMs: 10,
        parseErrors: ['Parser skipped by skip-list (B1): known native parser crash'],
      },
      {
        filePath: '/workspace/broken.ts',
        language: 'typescript',
        contentHash: 'hash-error',
        nodes: [],
        edges: [],
        detectorProvenance: 'ast',
        parseHealth: 'error',
        parseDurationMs: 10,
        parseErrors: ['native parser crashed'],
      },
    ]));

    const response = await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: false,
    });
    const payload = JSON.parse(response.content[0].text) as {
      status: string;
      data: {
        errors: string[];
        failedScan: null;
        parserSkipListBypassCount: number;
        warnings: string[];
      };
    };

    expect(payload.status).toBe('ok');
    expect(payload.data.parserSkipListBypassCount).toBe(3);
    expect(payload.data.failedScan).toBeNull();
    expect(payload.data.errors.join('\n')).toContain('native parser crashed');
    expect(payload.data.errors.join('\n')).not.toContain('Parser skipped by skip-list');
    expect(payload.data.warnings.join('\n')).not.toContain('parse error ratio');
    expect(mocks.recordFailedScanMock).not.toHaveBeenCalled();
    expect(mocks.recordCandidateManifestMock).toHaveBeenCalledWith(mocks.getTrackedFilesMock.mock.results.at(-1)?.value);
    expect(mocks.setLastGitHeadMock).toHaveBeenCalledWith('same-head');
    expect(mocks.setCodeGraphScopeMock).toHaveBeenCalled();
  });

  it('records candidate manifest even when individual files parse-error', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.indexFilesMock.mockResolvedValue(withPreParseSkippedCount([
      {
        filePath: '/workspace/current.ts',
        language: 'typescript',
        contentHash: 'hash-clean',
        nodes: [{ symbolId: 'current::symbol' }],
        edges: [],
        detectorProvenance: 'structured',
        parseHealth: 'clean',
        parseDurationMs: 10,
        parseErrors: [],
      },
      {
        filePath: '/workspace/broken.ts',
        language: 'typescript',
        contentHash: 'hash-error',
        nodes: [],
        edges: [],
        detectorProvenance: 'ast',
        parseHealth: 'error',
        parseDurationMs: 10,
        parseErrors: ['native parser crashed'],
      },
    ]));

    const response = await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: false,
    });
    const payload = JSON.parse(response.content[0].text) as {
      status: string;
      data: {
        errors: string[];
        failedScan: null;
      };
    };

    expect(payload.status).toBe('ok');
    expect(payload.data.errors.join('\n')).toContain('native parser crashed');
    expect(payload.data.failedScan).toBeNull();
    expect(mocks.recordCandidateManifestMock).toHaveBeenCalledWith(mocks.getTrackedFilesMock.mock.results.at(-1)?.value);
    expect(mocks.setLastGitHeadMock).toHaveBeenCalledWith('same-head');
  });

  it('prioritizes structural persistence errors in failed scan metadata', async () => {
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.persistIndexedFileResultMock.mockImplementation((result) => {
      if (result.filePath === '/workspace/structural.ts') {
        throw new Error('database is locked');
      }
      if (result.parseHealth === 'error') {
        mocks.recordParseDiagnosticMock(result.filePath, result.parseErrors.join('; '));
      }
    });
    mocks.indexFilesMock.mockResolvedValue(withPreParseSkippedCount([
      {
        filePath: '/workspace/broken.ts',
        language: 'typescript',
        contentHash: 'hash-error',
        nodes: [],
        edges: [],
        detectorProvenance: 'ast',
        parseHealth: 'error',
        parseDurationMs: 10,
        parseErrors: ['Tree contains syntax errors (partial parse)'],
      },
      {
        filePath: '/workspace/structural.ts',
        language: 'typescript',
        contentHash: 'hash-clean',
        nodes: [{ symbolId: 'structural::symbol' }],
        edges: [],
        detectorProvenance: 'structured',
        parseHealth: 'clean',
        parseDurationMs: 10,
        parseErrors: [],
      },
    ]));

    const response = await handleCodeGraphScan({
      rootDir: process.cwd(),
      incremental: false,
    });
    const payload = JSON.parse(response.content[0].text) as {
      status: string;
      data: {
        failedScan: { reason: string; errors: string[] };
      };
    };

    expect(payload.status).toBe('ok');
    expect(payload.data.failedScan.reason).toBe('structural_persistence_error');
    expect(payload.data.failedScan.errors[0]).toContain('structural.ts: database is locked');
    expect(payload.data.failedScan.errors.join('\n')).toContain('Tree contains syntax errors');
    expect(mocks.setLastGitHeadMock).not.toHaveBeenCalled();
    expect(mocks.recordCandidateManifestMock).not.toHaveBeenCalled();
  });

  it('exposes parse diagnostics in scan and status responses', async () => {
    const workspaceRoot = resolve(process.cwd());
    const brokenFile = join(workspaceRoot, 'src', 'broken.ts');
    const diagnostics = {
      affectedFiles: 1,
      recentErrors: [{
        filePath: brokenFile,
        errorMessage: `Unexpected token in ${brokenFile}`,
        errorCount: 2,
        lastSeenAt: '2026-05-06T00:00:00.000Z',
      }],
    };
    mocks.execSyncMock.mockReturnValue('same-head\n');
    mocks.getLastGitHeadMock.mockReturnValue('same-head');
    mocks.getParseDiagnosticsSummaryMock.mockReturnValue(diagnostics);
    mocks.countStaleButValidParseDiagnosticsMock.mockReturnValue(1);

    const scanResponse = await handleCodeGraphScan({
      rootDir: workspaceRoot,
      incremental: false,
    });
    const scanPayload = JSON.parse(scanResponse.content[0].text) as {
      data: {
        parseDiagnostics: {
          affectedFiles: number;
          recentErrors: Array<{ filePath: string; errorMessage: string; errorCount: number }>;
        };
        staleButValidGraphFiles: number;
      };
    };

    expect(scanPayload.data.parseDiagnostics.affectedFiles).toBe(1);
    expect(scanPayload.data.parseDiagnostics.recentErrors[0]).toMatchObject({
      filePath: 'src/broken.ts',
      errorMessage: 'Unexpected token in src/broken.ts',
      errorCount: 2,
    });
    expect(scanPayload.data.staleButValidGraphFiles).toBe(1);

    mocks.getStatsMock.mockReturnValue({
      totalFiles: 1,
      totalNodes: 1,
      totalEdges: 0,
      nodesByKind: { function: 1 },
      edgesByType: {},
      parseHealthSummary: { clean: 1 },
      lastScanTimestamp: '2026-04-17T00:00:00.000Z',
      lastGitHead: 'same-head',
      dbFileSize: 1024,
      schemaVersion: 4,
      graphQualitySummary: {
        detectorProvenanceSummary: null,
        graphEdgeEnrichmentSummary: null,
      },
    });

    const statusResponse = await handleCodeGraphStatus();
    const statusPayload = JSON.parse(statusResponse.content[0].text) as {
      data: {
        parseDiagnostics: { affectedFiles: number };
        staleButValidGraphFiles: number;
      };
    };

    expect(statusPayload.data.parseDiagnostics.affectedFiles).toBe(1);
    expect(statusPayload.data.staleButValidGraphFiles).toBe(1);
  });
});
