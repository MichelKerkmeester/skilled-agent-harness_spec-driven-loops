// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Context Handler Tests
// ───────────────────────────────────────────────────────────────

import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  buildContext: vi.fn(),
  resolveSeeds: vi.fn((..._args: unknown[]) => [] as Array<Record<string, unknown>>),
  getLastDetectorProvenance: vi.fn(() => 'structured'),
  getStats: vi.fn(() => ({
    lastScanTimestamp: '2026-04-17T00:00:00.000Z',
    graphQualitySummary: {
      detectorProvenanceSummary: null,
      graphEdgeEnrichmentSummary: null,
    },
  })),
  getDb: vi.fn(() => ({
    prepare: vi.fn(() => ({
      get: vi.fn(() => ({ last: null })),
    })),
  })),
  queryOutline: vi.fn((..._args: unknown[]) => [] as Array<Record<string, unknown>>),
  queryEdgesFrom: vi.fn((..._args: unknown[]) => [] as Array<Record<string, unknown>>),
  queryEdgesTo: vi.fn((..._args: unknown[]) => [] as Array<Record<string, unknown>>),
  ensureCodeGraphReady: vi.fn(async () => ({
    freshness: 'fresh',
    action: 'none',
    inlineIndexPerformed: false,
    reason: 'ok',
  })),
}));

vi.mock('../lib/code-graph-context.js', () => ({
  buildContext: mocks.buildContext,
}));

vi.mock('../lib/seed-resolver.js', () => ({
  resolveSeeds: mocks.resolveSeeds,
}));

vi.mock('../lib/ensure-ready.js', () => ({
  ensureCodeGraphReady: mocks.ensureCodeGraphReady,
}));

vi.mock('../lib/code-graph-db.js', () => ({
  getLastDetectorProvenance: mocks.getLastDetectorProvenance,
  getStats: mocks.getStats,
  getDb: mocks.getDb,
  queryOutline: mocks.queryOutline,
  queryEdgesFrom: mocks.queryEdgesFrom,
  queryEdgesTo: mocks.queryEdgesTo,
}));

import { handleCodeGraphContext } from '../handlers/context.js';

describe('code-graph-context handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.resolveSeeds.mockReturnValue([]);
    mocks.getDb.mockReturnValue({
      prepare: vi.fn(() => ({
        get: vi.fn(() => ({ last: null })),
      })),
    });
    mocks.queryOutline.mockReturnValue([]);
    mocks.queryEdgesFrom.mockReturnValue([]);
    mocks.queryEdgesTo.mockReturnValue([]);
    mocks.buildContext.mockReturnValue({
      queryMode: 'neighborhood',
      resolvedAnchors: [],
      graphContext: [],
      textBrief: 'brief',
      combinedSummary: 'summary',
      nextActions: ['next'],
      metadata: {
        totalNodes: 0,
        totalEdges: 0,
        budgetUsed: 10,
        budgetLimit: 1200,
        deadlineMs: 400,
        partialOutput: {
          isPartial: false,
          reasons: [],
          omittedSections: 0,
          omittedAnchors: 0,
          truncatedText: false,
        },
        freshness: { lastScanAt: null, staleness: 'unknown' },
      },
    });
  });

  it('uses bounded inline refresh settings and returns readiness metadata', async () => {
    const result = await handleCodeGraphContext({
      subject: 'SomeSymbol',
      queryMode: 'neighborhood',
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(mocks.ensureCodeGraphReady).toHaveBeenCalledWith(process.cwd(), {
      allowInlineIndex: true,
      allowInlineFullScan: false,
      allowGuardedInlineFullScan: true,
    });
    expect(parsed.data.readiness).toEqual({
      freshness: 'fresh',
      action: 'none',
      inlineIndexPerformed: false,
      reason: 'ok',
      canonicalReadiness: 'ready',
      trustState: 'live',
    });
    expect(parsed.data.canonicalReadiness).toBe('ready');
    expect(parsed.data.trustState).toBe('live');
    expect(parsed.data.lastPersistedAt).toBe('2026-04-17T00:00:00.000Z');
    expect(mocks.buildContext).toHaveBeenCalledWith(expect.objectContaining({
      deadlineMs: 400,
    }));
    expect(parsed.data.graphMetadata).toEqual({
      detectorProvenance: 'structured',
    });
    expect(parsed.data.combinedSummary).toBe('summary');
  });

  it('returns an explicit blocked contract when readiness requires a full scan', async () => {
    mocks.ensureCodeGraphReady.mockResolvedValueOnce({
      freshness: 'empty',
      action: 'full_scan',
      inlineIndexPerformed: false,
      reason: 'graph is empty (0 nodes)',
    });

    const result = await handleCodeGraphContext({
      subject: 'SomeSymbol',
      queryMode: 'neighborhood',
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.status).toBe('blocked');
    expect(parsed.data).toMatchObject({
      blocked: true,
      degraded: true,
      graphAnswersOmitted: true,
      requiredAction: 'code_graph_scan',
    });
    expect(mocks.buildContext).not.toHaveBeenCalled();
  });

  it('surfaces readiness crash details when ensureCodeGraphReady throws', async () => {
    mocks.ensureCodeGraphReady.mockRejectedValueOnce(new Error('db locked'));

    const result = await handleCodeGraphContext({
      subject: 'SomeSymbol',
      queryMode: 'neighborhood',
    });
    const parsed = JSON.parse(result.content[0].text);

    // PR 4 / F71 step 5: readiness-crash now surfaces canonical V2
    // freshness='error' (instead of collapsing to 'empty') so V3
    // canonicalReadiness='missing' and V5-widened trustState='unavailable'
    // flow naturally through buildReadinessBlock — no manual injection.
    expect(parsed.data.readiness).toEqual({
      freshness: 'error',
      action: 'none',
      inlineIndexPerformed: false,
      reason: 'readiness_check_crashed',
      error: 'db locked',
      canonicalReadiness: 'missing',
      trustState: 'unavailable',
    });
    expect(parsed.data.canonicalReadiness).toBe('missing');
    expect(parsed.data.trustState).toBe('unavailable');
  });

  it('counts every remaining anchor when a deadline expires mid-build', async () => {
    const { buildContext: actualBuildContext } = await vi.importActual<typeof import('../lib/code-graph-context.js')>(
      '../lib/code-graph-context.js',
    );

    mocks.resolveSeeds.mockReturnValue([
      {
        filePath: 'src/alpha.ts',
        startLine: 10,
        endLine: 20,
        symbolId: 'symbol-alpha',
        fqName: 'Alpha.run',
        kind: 'function',
        confidence: 0.95,
        resolution: 'exact',
      },
      {
        filePath: 'src/beta.ts',
        startLine: 30,
        endLine: 40,
        symbolId: 'symbol-beta',
        fqName: 'Beta.run',
        kind: 'function',
        confidence: 0.94,
        resolution: 'exact',
      },
      {
        filePath: 'src/gamma.ts',
        startLine: 50,
        endLine: 60,
        symbolId: 'symbol-gamma',
        fqName: 'Gamma.run',
        kind: 'function',
        confidence: 0.93,
        resolution: 'exact',
      },
    ]);
    mocks.queryEdgesFrom.mockImplementation((symbolId, ..._rest: unknown[]) => (
      symbolId === 'symbol-alpha'
        ? [
          {
            edge: { sourceId: symbolId, targetId: 'callee-1', edgeType: 'CALLS' },
            targetNode: { fqName: 'callee.one', kind: 'function', filePath: 'src/dependency.ts', startLine: 5 },
          },
          {
            edge: { sourceId: symbolId, targetId: 'callee-2', edgeType: 'CALLS' },
            targetNode: { fqName: 'callee.two', kind: 'function', filePath: 'src/dependency.ts', startLine: 15 },
          },
        ]
        : []
    ));

    const hrtimeSpy = vi.spyOn(process.hrtime, 'bigint');
    hrtimeSpy
      .mockReturnValueOnce(0n)
      .mockReturnValueOnce(0n)
      .mockReturnValueOnce(0n)
      .mockReturnValueOnce(6_000_000n)
      .mockReturnValue(6_000_000n);

    try {
      const result = actualBuildContext({
        queryMode: 'neighborhood',
        seeds: [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }],
        deadlineMs: 5,
      });

      expect(result.graphContext).toHaveLength(1);
      expect(result.graphContext[0].partial).toMatchObject({
        reason: 'deadline',
        omittedEdges: 1,
      });
      expect(result.metadata.partialOutput).toEqual({
        isPartial: true,
        reasons: ['deadline'],
        omittedSections: 1,
        omittedAnchors: 2,
        truncatedText: false,
      });
    } finally {
      hrtimeSpy.mockRestore();
    }
  });

  it('propagates edge reason and step through context payloads', async () => {
    const { buildContext: actualBuildContext } = await vi.importActual<typeof import('../lib/code-graph-context.js')>(
      '../lib/code-graph-context.js',
    );

    mocks.resolveSeeds.mockReturnValue([
      {
        filePath: 'src/alpha.ts',
        startLine: 10,
        endLine: 20,
        symbolId: 'symbol-alpha',
        fqName: 'Alpha.run',
        kind: 'function',
        confidence: 0.95,
        resolution: 'exact',
      },
    ]);
    mocks.queryEdgesFrom.mockReturnValue([
      {
        edge: {
          sourceId: 'symbol-alpha',
          targetId: 'callee-1',
          edgeType: 'CALLS',
          weight: 0.8,
          metadata: {
            confidence: 0.8,
            detectorProvenance: 'heuristic',
            evidenceClass: 'INFERRED',
            reason: 'heuristic-name-match',
            step: 'resolve',
          },
        },
        targetNode: { fqName: 'callee.one', kind: 'function', filePath: 'src/dependency.ts', startLine: 5 },
      },
    ]);

    const result = actualBuildContext({
      queryMode: 'neighborhood',
      seeds: [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }],
      deadlineMs: 400,
    });

    expect(result.graphContext[0].edges[0]).toMatchObject({
      from: 'Alpha.run',
      to: 'callee.one',
      type: 'CALLS',
      confidence: 0.8,
      detectorProvenance: 'heuristic',
      evidenceClass: 'INFERRED',
      reason: 'heuristic-name-match',
      step: 'resolve',
    });
    expect(result.textBrief).toContain('reason=heuristic-name-match');
    expect(result.textBrief).toContain('step=resolve');
    expect(result.graphContext[0]).not.toHaveProperty('why_included');
  });

  it('emits context why_included edge chains only when includeTrace is true', async () => {
    const { buildContext: actualBuildContext } = await vi.importActual<typeof import('../lib/code-graph-context.js')>(
      '../lib/code-graph-context.js',
    );

    mocks.resolveSeeds.mockReturnValue([
      {
        filePath: 'src/alpha.ts',
        startLine: 10,
        endLine: 20,
        symbolId: 'symbol-alpha',
        fqName: 'Alpha.run',
        kind: 'function',
        confidence: 0.95,
        resolution: 'exact',
      },
    ]);
    mocks.queryEdgesFrom.mockImplementation((symbolId, edgeType, ..._rest: unknown[]) => (
      symbolId === 'symbol-alpha' && edgeType === 'CALLS'
        ? [
          {
            edge: {
              sourceId: 'symbol-alpha',
              targetId: 'callee-1',
              edgeType: 'CALLS',
              weight: 0.8,
              metadata: {
                confidence: 0.8,
                detectorProvenance: 'heuristic',
                evidenceClass: 'INFERRED',
                reason: 'heuristic-name-match',
                step: 'resolve',
              },
            },
            targetNode: { fqName: 'callee.one', kind: 'function', filePath: 'src/dependency.ts', startLine: 5 },
          },
        ]
        : []
    ));
    mocks.queryEdgesTo.mockReturnValue([]);

    const compact = actualBuildContext({
      queryMode: 'neighborhood',
      seeds: [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }],
      deadlineMs: 400,
    });
    expect(compact.graphContext[0]).not.toHaveProperty('why_included');

    const traced = actualBuildContext({
      queryMode: 'neighborhood',
      seeds: [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }],
      deadlineMs: 400,
      includeTrace: true,
    });

    expect(traced.graphContext[0].why_included).toEqual([
      {
        filePath: 'src/alpha.ts',
        depth: 0,
        edgeChain: [],
        confidence: 0.95,
        ambiguous: false,
        truncationReason: null,
      },
      {
        filePath: 'src/dependency.ts',
        depth: 1,
        edgeChain: [
          {
            from: 'Alpha.run',
            to: 'callee.one',
            fromFile: 'src/alpha.ts',
            toFile: 'src/dependency.ts',
            edgeType: 'CALLS',
            confidence: 0.8,
            detectorProvenance: 'heuristic',
            evidenceClass: 'INFERRED',
            reason: 'heuristic-name-match',
            step: 'resolve',
          },
        ],
        confidence: 0.8,
        // INFERRED edge => uncertain inclusion, flagged ambiguous for neighbors.
        ambiguous: true,
        truncationReason: null,
      },
    ]);
  });

  it('surfaces omittedAnchors for multi-anchor deadline timeouts through the handler payload', async () => {
    const { buildContext: actualBuildContext } = await vi.importActual<typeof import('../lib/code-graph-context.js')>(
      '../lib/code-graph-context.js',
    );

    mocks.buildContext.mockImplementation((args) => actualBuildContext(args));
    mocks.resolveSeeds.mockReturnValue([
      {
        filePath: 'src/alpha.ts',
        startLine: 10,
        endLine: 20,
        symbolId: 'symbol-alpha',
        fqName: 'Alpha.run',
        kind: 'function',
        confidence: 0.95,
        resolution: 'exact',
      },
      {
        filePath: 'src/beta.ts',
        startLine: 30,
        endLine: 40,
        symbolId: 'symbol-beta',
        fqName: 'Beta.run',
        kind: 'function',
        confidence: 0.94,
        resolution: 'exact',
      },
      {
        filePath: 'src/gamma.ts',
        startLine: 50,
        endLine: 60,
        symbolId: 'symbol-gamma',
        fqName: 'Gamma.run',
        kind: 'function',
        confidence: 0.93,
        resolution: 'exact',
      },
    ]);
    mocks.queryEdgesFrom.mockImplementation((symbolId, ..._rest: unknown[]) => (
      symbolId === 'symbol-alpha'
        ? [
          {
            edge: { sourceId: symbolId, targetId: 'callee-1', edgeType: 'CALLS' },
            targetNode: { fqName: 'callee.one', kind: 'function', filePath: 'src/dependency.ts', startLine: 5 },
          },
          {
            edge: { sourceId: symbolId, targetId: 'callee-2', edgeType: 'CALLS' },
            targetNode: { fqName: 'callee.two', kind: 'function', filePath: 'src/dependency.ts', startLine: 15 },
          },
        ]
        : []
    ));

    const hrtimeSpy = vi.spyOn(process.hrtime, 'bigint');
    hrtimeSpy
      .mockReturnValueOnce(0n)
      .mockReturnValueOnce(0n)
      .mockReturnValueOnce(0n)
      .mockReturnValueOnce(401_000_000n)
      .mockReturnValue(401_000_000n);

    try {
      const result = await handleCodeGraphContext({
        queryMode: 'neighborhood',
        seeds: [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }],
      });
      const parsed = JSON.parse(result.content[0].text);

      expect(parsed.data.anchors).toHaveLength(3);
      expect(parsed.data.graphContext).toHaveLength(1);
      expect(parsed.data.graphContext[0].partial).toMatchObject({
        reason: 'deadline',
      });
      expect(parsed.data.metadata.partialOutput).toEqual({
        isPartial: true,
        reasons: ['deadline'],
        omittedSections: 1,
        omittedAnchors: 2,
        truncatedText: false,
      });
      expect(parsed.data.metadata.partialOutput.omittedAnchors).toBe(
        parsed.data.anchors.length - parsed.data.graphContext.length,
      );
    } finally {
      hrtimeSpy.mockRestore();
    }
  });
});

describe('context why_included breadcrumb accuracy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.resolveSeeds.mockReturnValue([
      {
        filePath: 'src/alpha.ts',
        startLine: 10,
        endLine: 20,
        symbolId: 'symbol-alpha',
        fqName: 'Alpha.run',
        kind: 'function',
        confidence: 0.95,
        resolution: 'exact',
      },
    ]);
    mocks.queryEdgesTo.mockReturnValue([]);
  });

  async function importBuildContext() {
    const { buildContext } = await vi.importActual<typeof import('../lib/code-graph-context.js')>(
      '../lib/code-graph-context.js',
    );
    return buildContext;
  }

  it('marks a neighbor reached via an INFERRED edge as ambiguous and a STRUCTURED one as not', async () => {
    const buildContext = await importBuildContext();
    mocks.queryEdgesFrom.mockImplementation((symbolId, edgeType, ..._rest: unknown[]) => (
      symbolId === 'symbol-alpha' && edgeType === 'CALLS'
        ? [
          {
            edge: {
              sourceId: 'symbol-alpha', targetId: 'inferred-callee', edgeType: 'CALLS', weight: 0.8,
              metadata: { confidence: 0.8, detectorProvenance: 'heuristic', evidenceClass: 'INFERRED' },
            },
            targetNode: { fqName: 'inferred.callee', kind: 'function', filePath: 'src/inferred.ts', startLine: 5 },
          },
          {
            edge: {
              sourceId: 'symbol-alpha', targetId: 'structured-callee', edgeType: 'CALLS', weight: 0.99,
              metadata: { confidence: 0.99, detectorProvenance: 'structured', evidenceClass: 'STRUCTURED' },
            },
            targetNode: { fqName: 'structured.callee', kind: 'function', filePath: 'src/structured.ts', startLine: 9 },
          },
        ]
        : []
    ));

    const result = buildContext({
      queryMode: 'neighborhood',
      seeds: [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }],
      deadlineMs: 400,
      includeTrace: true,
    });
    const why = result.graphContext[0].why_included ?? [];
    const inferred = why.find((entry) => entry.filePath === 'src/inferred.ts');
    const structured = why.find((entry) => entry.filePath === 'src/structured.ts');
    expect(inferred?.ambiguous).toBe(true);
    expect(structured?.ambiguous).toBe(false);
  });

  it('keeps every same-depth edge in edgeChain when a file is reachable via multiple edges', async () => {
    const buildContext = await importBuildContext();
    // Two distinct depth-1 edges to the SAME file (CALLS to two symbols both
    // living in src/dependency.ts) — the breadcrumb must retain both reasons.
    mocks.queryEdgesFrom.mockImplementation((symbolId, edgeType, ..._rest: unknown[]) => (
      symbolId === 'symbol-alpha' && edgeType === 'CALLS'
        ? [
          {
            edge: {
              sourceId: 'symbol-alpha', targetId: 'callee-1', edgeType: 'CALLS', weight: 0.9,
              metadata: { confidence: 0.9, evidenceClass: 'STRUCTURED' },
            },
            targetNode: { fqName: 'dep.one', kind: 'function', filePath: 'src/dependency.ts', startLine: 5 },
          },
          {
            edge: {
              sourceId: 'symbol-alpha', targetId: 'callee-2', edgeType: 'CALLS', weight: 0.7,
              metadata: { confidence: 0.7, evidenceClass: 'STRUCTURED' },
            },
            targetNode: { fqName: 'dep.two', kind: 'function', filePath: 'src/dependency.ts', startLine: 25 },
          },
        ]
        : []
    ));

    const result = buildContext({
      queryMode: 'neighborhood',
      seeds: [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }],
      deadlineMs: 400,
      includeTrace: true,
    });
    const dep = (result.graphContext[0].why_included ?? []).find((entry) => entry.filePath === 'src/dependency.ts');
    expect(dep).toBeDefined();
    expect(dep?.edgeChain).toHaveLength(2);
    expect(dep?.edgeChain.map((step) => step.to)).toEqual(['dep.one', 'dep.two']);
    // Overall confidence collapses to the minimum across the retained edges.
    expect(dep?.confidence).toBe(0.7);
  });

  it('does not stamp the complete depth-0 anchor breadcrumb with a section-level truncation reason', async () => {
    const buildContext = await importBuildContext();
    // A neighbor edge whose target lacks a filePath cannot be recorded as a
    // why_included entry; force the trace-limit branch is not needed here —
    // instead assert the anchor entry is never falsely flagged even when the
    // section is otherwise partial. Drive a deadline mid-expansion.
    mocks.queryEdgesFrom.mockImplementation((symbolId, edgeType, ..._rest: unknown[]) => (
      symbolId === 'symbol-alpha' && edgeType === 'CALLS'
        ? [
          {
            edge: { sourceId: 'symbol-alpha', targetId: 'callee-1', edgeType: 'CALLS', weight: 0.9, metadata: { confidence: 0.9 } },
            targetNode: { fqName: 'dep.one', kind: 'function', filePath: 'src/dependency.ts', startLine: 5 },
          },
        ]
        : []
    ));

    const hrtimeSpy = vi.spyOn(process.hrtime, 'bigint');
    // start, then exceed budget so the expansion section is marked partial.
    hrtimeSpy.mockReturnValueOnce(0n).mockReturnValue(401_000_000n);
    try {
      const result = buildContext({
        queryMode: 'neighborhood',
        seeds: [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }],
        deadlineMs: 400,
        includeTrace: true,
      });
      const why = result.graphContext[0].why_included ?? [];
      const anchorEntry = why.find((entry) => entry.depth === 0);
      // The depth-0 anchor is recorded in full before any deadline check, so
      // its breadcrumb must stay truncationReason: null even when the section
      // hit its deadline (the regression: it was stamped 'deadline').
      expect(anchorEntry).toBeDefined();
      expect(anchorEntry?.truncationReason).toBeNull();
    } finally {
      hrtimeSpy.mockRestore();
    }
  });

  it('does not propagate textBrief budget truncation onto structured why_included entries', async () => {
    const buildContext = await importBuildContext();
    // Many neighbors with long names so the human-readable textBrief overflows
    // the token budget while the structured why_included is returned in full.
    mocks.queryEdgesFrom.mockImplementation((symbolId, edgeType, ..._rest: unknown[]) => (
      symbolId === 'symbol-alpha' && edgeType === 'CALLS'
        ? Array.from({ length: 8 }, (_unused, index) => ({
          edge: { sourceId: 'symbol-alpha', targetId: `callee-${index}`, edgeType: 'CALLS' as const, weight: 0.9, metadata: { confidence: 0.9 } },
          targetNode: {
            fqName: `dependency.module.path.segment.reallyLongCalleeSymbolName${index}`,
            kind: 'function',
            filePath: `src/dependency-${index}.ts`,
            startLine: index + 1,
          },
        }))
        : []
    ));

    const result = buildContext({
      queryMode: 'neighborhood',
      seeds: [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }],
      deadlineMs: 400,
      includeTrace: true,
      budgetTokens: 20,
    });
    // Budget partiality is surfaced at the result level...
    expect(result.metadata.partialOutput.reasons).toContain('budget');
    // ...but never stamped onto the structured breadcrumbs.
    const stamped = (result.graphContext[0].why_included ?? []).filter((entry) => entry.truncationReason === 'budget');
    expect(stamped).toEqual([]);
  });
});
