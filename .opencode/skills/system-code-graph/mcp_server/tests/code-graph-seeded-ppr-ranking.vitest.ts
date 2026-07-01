import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  resolveSeeds: vi.fn(),
  getCodeGraphGeneration: vi.fn(() => 0),
  getDb: vi.fn(() => ({
    prepare: vi.fn(() => ({
      get: vi.fn(() => ({ last: null })),
    })),
  })),
  queryOutline: vi.fn(() => [] as Array<Record<string, unknown>>),
  queryEdgesFrom: vi.fn(),
  queryEdgesTo: vi.fn(),
}));

vi.mock('../lib/seed-resolver.js', () => ({
  resolveSeeds: mocks.resolveSeeds,
}));

vi.mock('../lib/code-graph-db.js', () => ({
  getCodeGraphGeneration: mocks.getCodeGraphGeneration,
  getDb: mocks.getDb,
  queryOutline: mocks.queryOutline,
  queryEdgesFrom: mocks.queryEdgesFrom,
  queryEdgesTo: mocks.queryEdgesTo,
}));

import {
  buildContext,
  computeBoundedPersonalizedPageRank,
} from '../lib/code-graph-context.js';

interface MockNode {
  readonly fqName: string;
  readonly kind: string;
  readonly filePath: string;
  readonly startLine: number;
  readonly contentHash?: string;
}

function node(fqName: string, line: number): MockNode {
  return {
    fqName,
    kind: 'function',
    filePath: `src/${fqName.toLowerCase().replaceAll('.', '-')}.ts`,
    startLine: line,
    contentHash: `hash-${fqName}`,
  };
}

function edge(
  sourceId: string,
  targetId: string,
  edgeType: 'CALLS' | 'IMPORTS',
  sourceNode: MockNode,
  options: {
    weight?: number;
    confidence?: number;
    evidenceClass?: 'EXTRACTED' | 'STRUCTURED' | 'INFERRED' | 'AMBIGUOUS';
  } = {},
) {
  return {
    edge: {
      sourceId,
      targetId,
      edgeType,
      weight: options.weight ?? 1,
      metadata: options.evidenceClass || options.confidence !== undefined
        ? {
          confidence: options.confidence ?? 1,
          evidenceClass: options.evidenceClass ?? 'EXTRACTED',
        }
        : undefined,
    },
    sourceNode,
  };
}

function outgoing(
  sourceId: string,
  targetId: string,
  edgeType: 'CALLS' | 'IMPORTS',
  targetNode: MockNode,
  options: {
    weight?: number;
    confidence?: number;
    evidenceClass?: 'EXTRACTED' | 'STRUCTURED' | 'INFERRED' | 'AMBIGUOUS';
  } = {},
) {
  return {
    edge: {
      sourceId,
      targetId,
      edgeType,
      weight: options.weight ?? 1,
      metadata: options.evidenceClass || options.confidence !== undefined
        ? {
          confidence: options.confidence ?? 1,
          evidenceClass: options.evidenceClass ?? 'EXTRACTED',
        }
        : undefined,
    },
    targetNode,
  };
}

describe('seeded PPR impact ranking', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
    mocks.resolveSeeds.mockReturnValue([
      {
        filePath: 'src/alpha.ts',
        startLine: 10,
        endLine: 20,
        symbolId: 'alpha',
        fqName: 'Alpha.run',
        kind: 'function',
        confidence: 0.95,
        resolution: 'exact',
      },
    ]);
    mocks.getCodeGraphGeneration.mockReturnValue(1);
    mocks.queryOutline.mockReturnValue([]);
    mocks.queryEdgesFrom.mockReturnValue([]);
    mocks.queryEdgesTo.mockReturnValue([]);
  });

  it('keeps the impact path on the existing flat ranking when the flag is off', () => {
    delete process.env.SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING;
    mocks.queryEdgesTo.mockImplementation((symbolId, edgeType) => (
      symbolId === 'alpha' && edgeType === 'CALLS'
        ? [
          edge('caller-b', 'alpha', 'CALLS', node('Caller.beta', 20)),
          edge('caller-a', 'alpha', 'CALLS', node('Caller.alpha', 10)),
        ]
        : []
    ));

    const result = buildContext({
      queryMode: 'impact',
      input: 'impact of Alpha.run',
      seeds: [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }],
      deadlineMs: 400,
    });

    expect(mocks.queryEdgesFrom).not.toHaveBeenCalled();
    expect(result.graphContext[0].edges.map((relationship) => relationship.from)).toEqual([
      'Caller.alpha',
      'Caller.beta',
    ]);
  });

  it('uses the flagged PPR path for impact and returns multi-hop candidates by score', () => {
    vi.stubEnv('SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING', 'true');
    mocks.queryEdgesTo.mockImplementation((symbolId, edgeType) => {
      if (edgeType !== 'CALLS') return [];
      if (symbolId === 'alpha') {
        return [
          edge('direct', 'alpha', 'CALLS', node('Direct.caller', 10), { confidence: 1, evidenceClass: 'EXTRACTED' }),
          edge('middle', 'alpha', 'CALLS', node('Middle.caller', 20), { confidence: 1, evidenceClass: 'EXTRACTED' }),
        ];
      }
      if (symbolId === 'middle') {
        return [
          edge('central', 'middle', 'CALLS', node('Central.caller', 30), { confidence: 1, evidenceClass: 'EXTRACTED' }),
        ];
      }
      return [];
    });
    mocks.queryEdgesFrom.mockImplementation((symbolId, edgeType) => {
      if (edgeType !== 'CALLS') return [];
      if (symbolId === 'direct') {
        return [
          outgoing('direct', 'alpha', 'CALLS', node('Alpha.run', 1), { confidence: 1, evidenceClass: 'EXTRACTED' }),
        ];
      }
      if (symbolId === 'middle') {
        return [
          outgoing('middle', 'alpha', 'CALLS', node('Alpha.run', 1), { confidence: 1, evidenceClass: 'EXTRACTED' }),
        ];
      }
      if (symbolId === 'central') {
        return [
          outgoing('central', 'middle', 'CALLS', node('Middle.caller', 20), { confidence: 1, evidenceClass: 'EXTRACTED' }),
        ];
      }
      return [];
    });

    const result = buildContext({
      queryMode: 'impact',
      input: 'impact of Alpha.run',
      seeds: [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }],
      deadlineMs: 400,
    });

    const callers = result.graphContext[0].edges.map((relationship) => relationship.from);
    expect(callers).toContain('Central.caller');
    expect(callers.indexOf('Middle.caller')).toBeLessThan(callers.indexOf('Central.caller'));
    expect(result.graphContext[0].why_included).toBeUndefined();
  });

  it('leaves neighborhood mode on the single-hop path even when the flag is enabled', () => {
    vi.stubEnv('SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING', 'true');
    mocks.queryEdgesFrom.mockImplementation((symbolId, edgeType) => (
      symbolId === 'alpha' && edgeType === 'CALLS'
        ? [outgoing('alpha', 'callee', 'CALLS', node('Alpha.callee', 40))]
        : []
    ));

    const result = buildContext({
      queryMode: 'neighborhood',
      input: 'impact of Alpha.run',
      seeds: [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }],
      deadlineMs: 400,
    });

    expect(result.graphContext[0].edges.map((relationship) => relationship.to)).toContain('Alpha.callee');
    expect(mocks.queryEdgesTo).toHaveBeenCalledWith('alpha', 'CALLS');
    expect(mocks.queryEdgesTo).not.toHaveBeenCalledWith('callee', 'CALLS');
  });

  it('keeps inferred two-hop paths below an observed one-hop path', () => {
    vi.stubEnv('SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING', 'true');
    mocks.queryEdgesTo.mockImplementation((symbolId, edgeType) => {
      if (edgeType !== 'CALLS') return [];
      if (symbolId === 'alpha') {
        return [
          edge('observed', 'alpha', 'CALLS', node('Observed.direct', 10), { confidence: 1, evidenceClass: 'EXTRACTED' }),
          edge('inferred-middle', 'alpha', 'CALLS', node('Inferred.middle', 20), { confidence: 0.6, evidenceClass: 'INFERRED' }),
        ];
      }
      if (symbolId === 'inferred-middle') {
        return [
          edge('inferred-far', 'inferred-middle', 'CALLS', node('Inferred.far', 30), { confidence: 0.6, evidenceClass: 'INFERRED' }),
        ];
      }
      return [];
    });
    mocks.queryEdgesFrom.mockImplementation((symbolId, edgeType) => {
      if (edgeType !== 'CALLS') return [];
      if (symbolId === 'observed') {
        return [outgoing('observed', 'alpha', 'CALLS', node('Alpha.run', 1), { confidence: 1, evidenceClass: 'EXTRACTED' })];
      }
      if (symbolId === 'inferred-middle') {
        return [outgoing('inferred-middle', 'alpha', 'CALLS', node('Alpha.run', 1), { confidence: 0.6, evidenceClass: 'INFERRED' })];
      }
      if (symbolId === 'inferred-far') {
        return [outgoing('inferred-far', 'inferred-middle', 'CALLS', node('Inferred.middle', 20), { confidence: 0.6, evidenceClass: 'INFERRED' })];
      }
      return [];
    });

    const result = buildContext({
      queryMode: 'impact',
      input: 'blast radius of Alpha.run',
      seeds: [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }],
      deadlineMs: 400,
    });
    const callers = result.graphContext[0].edges.map((relationship) => relationship.from);

    expect(callers.indexOf('Observed.direct')).toBeLessThan(callers.indexOf('Inferred.far'));
  });

  it('uses differentiated confidence metadata as PPR transition weight gradient', () => {
    vi.stubEnv('SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING', 'true');
    vi.stubEnv('SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION', 'true');
    mocks.queryEdgesTo.mockImplementation((symbolId, edgeType) => {
      if (edgeType !== 'CALLS') return [];
      if (symbolId === 'alpha') {
        return [
          edge('low-confidence', 'alpha', 'CALLS', node('Low.confidence', 10), { confidence: 0.3, evidenceClass: 'AMBIGUOUS' }),
          edge('high-confidence', 'alpha', 'CALLS', node('High.confidence', 20), { confidence: 0.9, evidenceClass: 'EXTRACTED' }),
        ];
      }
      return [];
    });
    mocks.queryEdgesFrom.mockImplementation((symbolId, edgeType) => {
      if (edgeType !== 'CALLS') return [];
      if (symbolId === 'low-confidence') {
        return [outgoing('low-confidence', 'alpha', 'CALLS', node('Alpha.run', 1), { confidence: 0.3, evidenceClass: 'AMBIGUOUS' })];
      }
      if (symbolId === 'high-confidence') {
        return [outgoing('high-confidence', 'alpha', 'CALLS', node('Alpha.run', 1), { confidence: 0.9, evidenceClass: 'EXTRACTED' })];
      }
      return [];
    });

    const result = buildContext({
      queryMode: 'impact',
      input: 'impact of Alpha.run',
      seeds: [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }],
      deadlineMs: 400,
    });
    const callers = result.graphContext[0].edges.map((relationship) => relationship.from);

    expect(callers.indexOf('High.confidence')).toBeLessThan(callers.indexOf('Low.confidence'));
  });

  it('bounds the power method by the configured iteration cap', () => {
    const result = computeBoundedPersonalizedPageRank({
      seeds: ['alpha'],
      maxHops: 3,
      maxIterations: 2,
      damping: 0.85,
      convergenceEpsilon: 0,
      readEdges: (nodeIds) => nodeIds.flatMap((nodeId) => {
        if (nodeId === 'alpha') return [{ from: 'alpha', to: 'beta', weight: 1 }];
        if (nodeId === 'beta') return [{ from: 'beta', to: 'gamma', weight: 1 }];
        return [{ from: 'gamma', to: 'alpha', weight: 1 }];
      }),
    });

    expect(result.iterations).toBe(2);
    expect(result.boundedReason).toBe('iteration_cap');
    expect(result.scores.get('beta')).toBeGreaterThan(0);
  });
});
