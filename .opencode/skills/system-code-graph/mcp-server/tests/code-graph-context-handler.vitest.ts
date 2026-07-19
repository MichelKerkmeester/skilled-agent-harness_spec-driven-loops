// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Context Handler Tests
// ───────────────────────────────────────────────────────────────

import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  buildContext: vi.fn(),
  resolveSeeds: vi.fn((..._args: unknown[]) => [] as Array<Record<string, unknown>>),
  getLastDetectorProvenance: vi.fn(() => 'structured'),
  getCodeGraphGeneration: vi.fn(() => 0),
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
  getCodeGraphGeneration: mocks.getCodeGraphGeneration,
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
    vi.unstubAllEnvs();
    vi.clearAllMocks();
    mocks.resolveSeeds.mockReturnValue([]);
    mocks.getCodeGraphGeneration.mockReturnValue(0);
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
        freshness: { lastScanAt: null, staleness: 'unknown', generation: 0 },
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
      const result = await actualBuildContext({
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

    const result = await actualBuildContext({
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

  it('renders non-code doc node kinds in context text', async () => {
    const { buildContext: actualBuildContext } = await vi.importActual<typeof import('../lib/code-graph-context.js')>(
      '../lib/code-graph-context.js',
    );

    mocks.resolveSeeds.mockReturnValue([
      {
        filePath: 'docs/readme.md',
        startLine: 1,
        endLine: 1,
        symbolId: 'heading-root',
        fqName: 'heading:root/title#1',
        kind: 'heading',
        confidence: 0.95,
        resolution: 'exact',
      },
    ]);
    mocks.queryEdgesFrom.mockImplementation((symbolId, edgeType, ..._rest: unknown[]) => (
      symbolId === 'heading-root' && edgeType === 'CONTAINS'
        ? [
          {
            edge: {
              sourceId: 'heading-root',
              targetId: 'heading-child',
              edgeType: 'CONTAINS',
              weight: 1,
              metadata: { confidence: 1, detectorProvenance: 'regex', evidenceClass: 'EXTRACTED' },
            },
            targetNode: { fqName: 'heading:root/title#1/usage#1', kind: 'heading', filePath: 'docs/readme.md', startLine: 4 },
          },
          {
            edge: {
              sourceId: 'heading-root',
              targetId: 'key-child',
              edgeType: 'CONTAINS',
              weight: 1,
              metadata: { confidence: 1, detectorProvenance: 'structured', evidenceClass: 'EXTRACTED' },
            },
            targetNode: { fqName: 'key:scripts.test', kind: 'key', filePath: 'package.json', startLine: 6 },
          },
        ]
        : []
    ));
    mocks.queryEdgesTo.mockReturnValue([]);

    const result = await actualBuildContext({
      queryMode: 'neighborhood',
      seeds: [{ filePath: 'docs/readme.md', startLine: 1, endLine: 1 }],
      deadlineMs: 400,
    });

    expect(result.graphContext[0].nodes.map((node) => node.kind)).toEqual(['heading', 'key']);
    expect(result.textBrief).toContain('heading heading:root/title#1/usage#1 (docs/readme.md:4)');
    expect(result.textBrief).toContain('key key:scripts.test (package.json:6)');
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

    const compact = await actualBuildContext({
      queryMode: 'neighborhood',
      seeds: [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }],
      deadlineMs: 400,
    });
    expect(compact.graphContext[0]).not.toHaveProperty('why_included');

    const traced = await actualBuildContext({
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
    vi.unstubAllEnvs();
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
    vi.stubEnv('SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION', 'true');
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

    const result = await buildContext({
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

  it('marks a neighbor reached via an AMBIGUOUS edge as ambiguous', async () => {
    vi.stubEnv('SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION', 'true');
    const buildContext = await importBuildContext();
    mocks.queryEdgesFrom.mockImplementation((symbolId, edgeType, ..._rest: unknown[]) => (
      symbolId === 'symbol-alpha' && edgeType === 'CALLS'
        ? [
          {
            edge: {
              sourceId: 'symbol-alpha', targetId: 'ambiguous-callee', edgeType: 'CALLS', weight: 0.3,
              metadata: { confidence: 0.3, detectorProvenance: 'heuristic', evidenceClass: 'AMBIGUOUS' },
            },
            targetNode: { fqName: 'ambiguous.callee', kind: 'function', filePath: 'src/ambiguous.ts', startLine: 3 },
          },
        ]
        : []
    ));

    const result = await buildContext({
      queryMode: 'neighborhood',
      seeds: [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }],
      deadlineMs: 400,
      includeTrace: true,
    });
    const why = result.graphContext[0].why_included ?? [];
    const ambiguous = why.find((entry) => entry.filePath === 'src/ambiguous.ts');
    expect(ambiguous?.ambiguous).toBe(true);
  });

  it('reflects the differentiation flag toggled mid-session, not just at process start', async () => {
    const buildContext = await importBuildContext();
    mocks.queryEdgesFrom.mockImplementation((symbolId, edgeType, ..._rest: unknown[]) => (
      symbolId === 'symbol-alpha' && edgeType === 'CALLS'
        ? [
          {
            edge: {
              sourceId: 'symbol-alpha', targetId: 'mixed-state-callee', edgeType: 'CALLS', weight: 0.9,
              metadata: { confidence: 0.9, detectorProvenance: 'structured', evidenceClass: 'EXTRACTED' },
            },
            targetNode: { fqName: 'mixed.state.callee', kind: 'function', filePath: 'src/mixed-state.ts', startLine: 7 },
          },
        ]
        : []
    ));
    const seeds = [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }];

    delete process.env.SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION;
    const flagOff = await buildContext({ queryMode: 'neighborhood', seeds, deadlineMs: 400, includeTrace: true });
    const offEntry = (flagOff.graphContext[0].why_included ?? []).find((entry) => entry.filePath === 'src/mixed-state.ts');
    // Legacy tier is 0.8/INFERRED -- INFERRED counts as ambiguous by design.
    expect(offEntry?.confidence).toBe(0.8);
    expect(offEntry?.ambiguous).toBe(true);

    process.env.SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION = 'true';
    const flagOn = await buildContext({ queryMode: 'neighborhood', seeds, deadlineMs: 400, includeTrace: true });
    const onEntry = (flagOn.graphContext[0].why_included ?? []).find((entry) => entry.filePath === 'src/mixed-state.ts');
    expect(onEntry?.confidence).toBe(0.9);
    expect(onEntry?.ambiguous).toBe(false);

    delete process.env.SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION;
  });

  it('leaves IMPORTS-edge confidence and evidence metadata unaffected by the CALLS-only differentiation flag', async () => {
    const buildContext = await importBuildContext();
    mocks.queryEdgesFrom.mockImplementation((symbolId, edgeType, ..._rest: unknown[]) => (
      symbolId === 'symbol-alpha' && edgeType === 'IMPORTS'
        ? [
          {
            edge: {
              sourceId: 'symbol-alpha', targetId: 'imported-module', edgeType: 'IMPORTS', weight: 0.95,
              metadata: { confidence: 0.95, detectorProvenance: 'structured', evidenceClass: 'EXTRACTED' },
            },
            targetNode: { fqName: 'imported.module', kind: 'file', filePath: 'src/imported.ts', startLine: 1 },
          },
        ]
        : []
    ));
    const seeds = [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }];

    delete process.env.SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION;
    const flagOff = await buildContext({ queryMode: 'neighborhood', seeds, deadlineMs: 400, includeTrace: true });
    expect(flagOff.graphContext[0].edges[0]).toMatchObject({
      confidence: 0.95,
      detectorProvenance: 'structured',
      evidenceClass: 'EXTRACTED',
    });
    const offEntry = (flagOff.graphContext[0].why_included ?? []).find((entry) => entry.filePath === 'src/imported.ts');
    expect(offEntry?.confidence).toBe(0.95);
    expect(offEntry?.ambiguous).toBe(false);

    process.env.SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION = 'true';
    const flagOn = await buildContext({ queryMode: 'neighborhood', seeds, deadlineMs: 400, includeTrace: true });
    expect(flagOn.graphContext[0].edges[0]).toMatchObject({
      confidence: 0.95,
      detectorProvenance: 'structured',
      evidenceClass: 'EXTRACTED',
    });
    const onEntry = (flagOn.graphContext[0].why_included ?? []).find((entry) => entry.filePath === 'src/imported.ts');
    expect(onEntry?.confidence).toBe(0.95);
    expect(onEntry?.ambiguous).toBe(false);

    delete process.env.SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION;
  });

  it('keeps every same-depth edge in edgeChain when a file is reachable via multiple edges', async () => {
    vi.stubEnv('SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION', 'true');
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

    const result = await buildContext({
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
      const result = await buildContext({
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

    const result = await buildContext({
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

describe('code graph context rank-time trust', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
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
    mocks.queryEdgesFrom.mockReturnValue([]);
    mocks.queryEdgesTo.mockReturnValue([]);
  });

  async function importBuildContext() {
    const { buildContext } = await vi.importActual<typeof import('../lib/code-graph-context.js')>(
      '../lib/code-graph-context.js',
    );
    return buildContext;
  }

  it('keeps neutral and absent trust results byte-identical to baseline order', async () => {
    const buildContext = await importBuildContext();
    mocks.getCodeGraphGeneration.mockReturnValue(7);
    const baselineTargets = [
      { id: 'neutral-a', name: 'neutral.alpha', file: 'src/neutral-a.ts', line: 11 },
      { id: 'neutral-b', name: 'neutral.beta', file: 'src/neutral-b.ts', line: 22 },
      { id: 'neutral-c', name: 'neutral.gamma', file: 'src/neutral-c.ts', line: 33 },
    ];
    mocks.queryEdgesFrom.mockImplementation((symbolId, edgeType, ..._rest: unknown[]) => (
      symbolId === 'symbol-alpha' && edgeType === 'CALLS'
        ? [
          {
            edge: { sourceId: 'symbol-alpha', targetId: baselineTargets[0].id, edgeType: 'CALLS', weight: 0.2 },
            targetNode: { fqName: baselineTargets[0].name, kind: 'function', filePath: baselineTargets[0].file, startLine: baselineTargets[0].line },
          },
          {
            edge: {
              sourceId: 'symbol-alpha',
              targetId: baselineTargets[1].id,
              edgeType: 'CALLS',
              weight: 0.9,
              metadata: { confidence: 1 },
            },
            targetNode: { fqName: baselineTargets[1].name, kind: 'function', filePath: baselineTargets[1].file, startLine: baselineTargets[1].line },
          },
          {
            edge: {
              sourceId: 'symbol-alpha',
              targetId: baselineTargets[2].id,
              edgeType: 'CALLS',
              weight: 0.6,
              metadata: { confidence: 1, evidenceClass: 'UNKNOWN' },
            },
            targetNode: { fqName: baselineTargets[2].name, kind: 'function', filePath: baselineTargets[2].file, startLine: baselineTargets[2].line },
          },
        ]
        : []
    ));

    const result = await buildContext({
      queryMode: 'neighborhood',
      seeds: [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }],
      deadlineMs: 400,
    });
    const actualBytes = JSON.stringify({
      edges: result.graphContext[0].edges.map((edge) => edge.to),
      nodes: result.graphContext[0].nodes.map((node) => node.name),
    });
    const baselineBytes = JSON.stringify({
      edges: baselineTargets.map((target) => target.name),
      nodes: baselineTargets.map((target) => target.name),
    });

    expect(actualBytes).toBe(baselineBytes);
    expect(result.metadata.freshness.generation).toBe(7);
  });

  it('normalizes persisted edge confidence metadata to the legacy tier when differentiation is off', async () => {
    delete process.env.SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION;
    const buildContext = await importBuildContext();
    mocks.queryEdgesFrom.mockImplementation((symbolId, edgeType, ..._rest: unknown[]) => (
      symbolId === 'symbol-alpha' && edgeType === 'CALLS'
        ? [
          {
            edge: {
              sourceId: 'symbol-alpha',
              targetId: 'low-confidence-callee',
              edgeType: 'CALLS',
              weight: 0.1,
              metadata: { confidence: 0.1, detectorProvenance: 'structured', evidenceClass: 'EXTRACTED' },
            },
            targetNode: { fqName: 'low.confidence', kind: 'function', filePath: 'src/low.ts', startLine: 5 },
          },
        ]
        : []
    ));

    const result = await buildContext({
      queryMode: 'neighborhood',
      seeds: [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }],
      deadlineMs: 400,
      includeTrace: true,
    });

    expect(result.graphContext[0].edges[0]).toMatchObject({
      confidence: 0.8,
      detectorProvenance: 'heuristic',
      evidenceClass: 'INFERRED',
    });
    const calleeTrace = result.graphContext[0].why_included?.find((entry) => entry.filePath === 'src/low.ts');
    expect(calleeTrace).toMatchObject({
      confidence: 0.8,
      ambiguous: true,
      edgeChain: [expect.objectContaining({ confidence: 0.8, evidenceClass: 'INFERRED' })],
    });
  });

  it('boosts trusted impact callers while preserving neutral peer order', async () => {
    vi.stubEnv('SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION', 'true');
    const buildContext = await importBuildContext();
    mocks.queryEdgesTo.mockImplementation((symbolId, edgeType, ..._rest: unknown[]) => (
      symbolId === 'symbol-alpha' && edgeType === 'CALLS'
        ? [
          {
            edge: { sourceId: 'neutral-first', targetId: 'symbol-alpha', edgeType: 'CALLS', weight: 0.99 },
            sourceNode: { fqName: 'Neutral.first', kind: 'function', filePath: 'src/neutral-first.ts', startLine: 12 },
          },
          {
            edge: {
              sourceId: 'trusted-caller',
              targetId: 'symbol-alpha',
              edgeType: 'CALLS',
              weight: 0.1,
              metadata: { confidence: 0.95, evidenceClass: 'EXTRACTED' },
            },
            sourceNode: { fqName: 'Trusted.caller', kind: 'function', filePath: 'src/trusted.ts', startLine: 8 },
          },
          {
            edge: { sourceId: 'neutral-second', targetId: 'symbol-alpha', edgeType: 'CALLS', weight: 0.8 },
            sourceNode: { fqName: 'Neutral.second', kind: 'function', filePath: 'src/neutral-second.ts', startLine: 34 },
          },
        ]
        : []
    ));

    const result = await buildContext({
      queryMode: 'impact',
      seeds: [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }],
      deadlineMs: 400,
    });
    const callers = result.graphContext[0].edges.map((edge) => edge.from);

    expect(callers).toEqual(['Trusted.caller', 'Neutral.first', 'Neutral.second']);
    expect(callers.filter((caller) => caller.startsWith('Neutral.'))).toEqual(['Neutral.first', 'Neutral.second']);
  });

  it('keeps equal-trust impact caller order stable when database row order shifts', async () => {
    const buildContext = await importBuildContext();
    const rows = {
      alpha: {
        edge: { sourceId: 'caller-alpha', targetId: 'symbol-alpha', edgeType: 'CALLS' as const, weight: 0.8 },
        sourceNode: { fqName: 'Caller.alpha', kind: 'function', filePath: 'src/alpha.ts', startLine: 11, contentHash: 'hash-a' },
      },
      beta: {
        edge: { sourceId: 'caller-beta', targetId: 'symbol-alpha', edgeType: 'CALLS' as const, weight: 0.8 },
        sourceNode: { fqName: 'Caller.beta', kind: 'function', filePath: 'src/beta.ts', startLine: 22, contentHash: 'hash-b' },
      },
      gamma: {
        edge: { sourceId: 'caller-gamma', targetId: 'symbol-alpha', edgeType: 'CALLS' as const, weight: 0.8 },
        sourceNode: { fqName: 'Caller.gamma', kind: 'function', filePath: 'src/gamma.ts', startLine: 33, contentHash: 'hash-c' },
      },
    };
    const shiftedOrders = [
      [rows.beta, rows.gamma, rows.alpha],
      [rows.gamma, rows.alpha, rows.beta],
    ];
    let callsQueryCount = 0;
    mocks.queryEdgesTo.mockImplementation((symbolId, edgeType, ..._rest: unknown[]) => {
      if (symbolId !== 'symbol-alpha' || edgeType !== 'CALLS') return [];
      const order = shiftedOrders[Math.min(callsQueryCount, shiftedOrders.length - 1)];
      callsQueryCount += 1;
      return order;
    });

    const first = await buildContext({
      queryMode: 'impact',
      seeds: [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }],
      deadlineMs: 400,
    });
    const second = await buildContext({
      queryMode: 'impact',
      seeds: [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }],
      deadlineMs: 400,
    });
    const firstCallers = first.graphContext[0].edges.map((edge) => edge.from);
    const secondCallers = second.graphContext[0].edges.map((edge) => edge.from);

    expect(firstCallers).toEqual(['Caller.alpha', 'Caller.beta', 'Caller.gamma']);
    expect(secondCallers).toEqual(firstCallers);
  });
});
