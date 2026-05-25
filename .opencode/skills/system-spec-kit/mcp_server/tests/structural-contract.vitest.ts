import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CodeGraphStatsSnapshot } from '../lib/code-graph-boundary.js';
import type { StructuralBootstrapContract } from '../lib/session/structural-bootstrap-contract.js';

const {
  getGraphFreshnessFromMarkerMock,
  getGraphStatsFromMarkerMock,
} = vi.hoisted(() => ({
  getGraphFreshnessFromMarkerMock: vi.fn(),
  getGraphStatsFromMarkerMock: vi.fn(),
}));

vi.mock('../lib/code-graph-boundary.js', () => ({
  getGraphFreshnessFromMarker: getGraphFreshnessFromMarkerMock,
  getGraphStatsFromMarker: getGraphStatsFromMarkerMock,
}));

vi.mock('../hooks/memory-surface.js', () => ({
  isSessionPrimed: vi.fn(() => false),
  getLastActiveSessionId: vi.fn(() => null),
}));

vi.mock('../lib/session/context-metrics.js', () => ({
  getSessionMetrics: vi.fn(() => ({ currentSpecFolder: null })),
  computeQualityScore: vi.fn(() => ({ level: 'unknown', score: 0 })),
  getLastToolCallAt: vi.fn(() => null),
}));

import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';

function graphStats(overrides: Partial<CodeGraphStatsSnapshot> = {}): CodeGraphStatsSnapshot {
  return {
    totalFiles: 42,
    totalNodes: 1200,
    totalEdges: 800,
    nodesByKind: {
      function: 500,
      variable: 300,
      class: 200,
      interface: 150,
      type: 50,
    },
    edgesByType: {},
    parseHealthSummary: {},
    lastScanTimestamp: '2026-04-23T00:00:00.000Z',
    lastGitHead: null,
    dbFileSize: null,
    schemaVersion: 3,
    ...overrides,
  };
}

function mockBoundary(
  graphFreshness: 'fresh' | 'stale' | 'empty' | 'error',
  stats: CodeGraphStatsSnapshot | null = graphStats(),
): void {
  getGraphFreshnessFromMarkerMock.mockReturnValue(graphFreshness);
  getGraphStatsFromMarkerMock.mockReturnValue(stats);
}

function contractFor(
  sourceSurface: StructuralBootstrapContract['sourceSurface'] = 'session_bootstrap',
): StructuralBootstrapContract {
  return buildStructuralBootstrapContract(sourceSurface);
}

describe('buildStructuralBootstrapContract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockBoundary('fresh');
  });

  it('returns ready status with highlights when graph freshness is fresh', () => {
    const contract = contractFor('auto-prime');

    expect(contract.status).toBe('ready');
    expect(contract.summary).toContain('42 files');
    expect(contract.summary).toContain('1200 nodes');
    expect(contract.summary).toContain('800 edges');
    expect(contract.summary).toContain('(fresh)');
    expect(contract.highlights).toContain('function: 500');
    expect(contract.recommendedAction).toContain('code_graph_query');
    expect(contract.sourceSurface).toBe('auto-prime');
    expect(contract.provenance?.producer).toBe('session_snapshot');
    expect(contract.provenance?.trustState).toBe('live');
  });

  it('returns stale status when graph freshness is stale', () => {
    mockBoundary('stale');

    const contract = contractFor('session_bootstrap');

    expect(contract.status).toBe('stale');
    expect(contract.summary).toContain('(stale)');
    expect(contract.recommendedAction).toContain('bounded inline refresh');
    expect(contract.sourceSurface).toBe('session_bootstrap');
    expect(contract.provenance?.trustState).toBe('stale');
  });

  it('returns stale highlights for populated stale graphs', () => {
    mockBoundary('stale', graphStats({
      nodesByKind: { function: 9, class: 4, interface: 2 },
    }));

    const contract = contractFor('session_resume');

    expect(contract.status).toBe('stale');
    expect(contract.summary).toContain('(stale)');
    expect(contract.highlights).toEqual(['function: 9', 'class: 4', 'interface: 2']);
  });

  it('maps empty graph freshness to missing status', () => {
    mockBoundary('empty', null);

    const contract = contractFor('session_resume');

    expect(contract.status).toBe('missing');
    expect(contract.summary).toContain('No structural context');
    expect(contract.highlights).toBeUndefined();
    expect(contract.recommendedAction).toContain('session_bootstrap');
    expect(contract.sourceSurface).toBe('session_resume');
    expect(contract.provenance?.trustState).toBe('absent');
  });

  it('maps error graph freshness to missing status', () => {
    mockBoundary('error', null);

    const contract = contractFor('session_health');

    expect(contract.status).toBe('missing');
    expect(contract.summary).toContain('No structural context');
    expect(contract.sourceSurface).toBe('session_health');
    expect(contract.provenance?.trustState).toBe('absent');
  });

  it('uses scan guidance instead of self-referential bootstrap guidance during session_bootstrap', () => {
    mockBoundary('empty', null);

    const contract = contractFor('session_bootstrap');

    expect(contract.status).toBe('missing');
    expect(contract.recommendedAction).toContain('code_graph_scan');
    expect(contract.recommendedAction).not.toContain('Call session_bootstrap first');
  });

  it('preserves sourceSurface in the contract and provenance for every supported surface', () => {
    const surfaces: StructuralBootstrapContract['sourceSurface'][] = [
      'auto-prime',
      'session_bootstrap',
      'session_resume',
      'session_health',
    ];

    for (const surface of surfaces) {
      const contract = contractFor(surface);
      expect(contract.sourceSurface).toBe(surface);
      expect(contract.provenance?.sourceSurface).toBe(surface);
    }
  });

  it('records session snapshot provenance source refs', () => {
    const contract = contractFor('session_health');

    expect(contract.provenance).toMatchObject({
      producer: 'session_snapshot',
      sourceSurface: 'session_health',
      trustState: 'live',
      lastUpdated: '2026-04-23T00:00:00.000Z',
      sourceRefs: ['code-graph-db', 'session-snapshot'],
    });
    expect(Date.parse(contract.provenance?.generatedAt ?? '')).not.toBeNaN();
  });

  it('populates lastUpdated from marker stats for ready contracts', () => {
    mockBoundary('fresh', graphStats({ lastScanTimestamp: '2026-05-01T12:00:00.000Z' }));

    const contract = contractFor('auto-prime');

    expect(contract.status).toBe('ready');
    expect(contract.provenance?.lastUpdated).toBe('2026-05-01T12:00:00.000Z');
  });

  it('populates lastUpdated from marker stats for stale contracts', () => {
    mockBoundary('stale', graphStats({ lastScanTimestamp: '2026-04-01T12:00:00.000Z' }));

    const contract = contractFor('session_resume');

    expect(contract.status).toBe('stale');
    expect(contract.provenance?.lastUpdated).toBe('2026-04-01T12:00:00.000Z');
  });

  it('uses null lastUpdated when reachable marker stats have no timestamp', () => {
    mockBoundary('fresh', graphStats({ lastScanTimestamp: null }));

    const contract = contractFor('session_bootstrap');

    expect(contract.status).toBe('ready');
    expect(contract.provenance?.lastUpdated).toBeNull();
  });

  it('falls back gracefully when reachable marker stats are absent', () => {
    mockBoundary('fresh', null);

    const contract = contractFor('session_bootstrap');

    expect(contract.status).toBe('ready');
    expect(contract.summary).toBe('Code graph available (structural context ready)');
    expect(contract.highlights).toBeUndefined();
    expect(contract.provenance?.lastUpdated).toBeNull();
  });

  it('falls back gracefully when reachable marker stats throw', () => {
    getGraphFreshnessFromMarkerMock.mockReturnValue('stale');
    getGraphStatsFromMarkerMock.mockImplementation(() => {
      throw new Error('marker unreadable');
    });

    const contract = contractFor('session_health');

    expect(contract.status).toBe('stale');
    expect(contract.summary).toContain('structural context may be outdated');
    expect(contract.highlights).toBeUndefined();
    expect(contract.provenance?.lastUpdated).toBeNull();
  });

  it('limits highlights to the top five node kinds in descending count order', () => {
    mockBoundary('fresh', graphStats({
      nodesByKind: {
        interface: 25,
        function: 100,
        type: 20,
        class: 75,
        enum: 10,
        variable: 50,
        method: 40,
      },
    }));

    const contract = contractFor('session_bootstrap');

    expect(contract.highlights).toEqual([
      'function: 100',
      'class: 75',
      'variable: 50',
      'method: 40',
      'interface: 25',
    ]);
  });

  it('keeps the structural contract within the documented hard ceiling', () => {
    mockBoundary('fresh', graphStats({
      nodesByKind: Object.fromEntries(
        Array.from({ length: 12 }, (_, index) => [
          `very_long_symbol_kind_name_${index}_with_extra_budget_pressure`,
          1000 - index,
        ]),
      ),
    }));

    const contract = contractFor('session_bootstrap');
    const estimatedTokens = Math.ceil(JSON.stringify({
      summary: contract.summary,
      highlights: contract.highlights,
      recommendedAction: contract.recommendedAction,
    }).length / 4);

    expect(estimatedTokens).toBeLessThanOrEqual(500);
    expect(contract.highlights?.length).toBeLessThanOrEqual(5);
  });

  it('uses the current structural status vocabulary only', () => {
    const statuses = new Set<StructuralBootstrapContract['status']>();

    mockBoundary('fresh');
    statuses.add(contractFor().status);
    mockBoundary('stale');
    statuses.add(contractFor().status);
    mockBoundary('empty', null);
    statuses.add(contractFor().status);
    mockBoundary('error', null);
    statuses.add(contractFor().status);

    expect([...statuses].sort()).toEqual(['missing', 'ready', 'stale']);
    expect(statuses.has('missing')).toBe(true);
  });
});
