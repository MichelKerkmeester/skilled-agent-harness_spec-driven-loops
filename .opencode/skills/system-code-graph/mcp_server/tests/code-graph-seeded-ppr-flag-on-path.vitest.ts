// ───────────────────────────────────────────────────────────────
// MODULE: Seeded-PPR Impact Ranking Flag ON-Path Gate Contract
// ───────────────────────────────────────────────────────────────

import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  resolveSeeds: vi.fn(),
  getCodeGraphGeneration: vi.fn(() => 1),
  getDb: vi.fn(() => ({ prepare: vi.fn(() => ({ get: vi.fn(() => ({ last: null })) })) })),
  queryOutline: vi.fn(() => [] as Array<Record<string, unknown>>),
  queryEdgesFrom: vi.fn(),
  queryEdgesTo: vi.fn(),
}));

vi.mock('../lib/seed-resolver.js', () => ({ resolveSeeds: mocks.resolveSeeds }));
vi.mock('../lib/code-graph-db.js', () => ({
  getCodeGraphGeneration: mocks.getCodeGraphGeneration,
  getDb: mocks.getDb,
  queryOutline: mocks.queryOutline,
  queryEdgesFrom: mocks.queryEdgesFrom,
  queryEdgesTo: mocks.queryEdgesTo,
}));

import { buildContext } from '../lib/code-graph-context.js';

const FLAG = 'SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING';

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

function incoming(sourceId: string, targetId: string, sourceNode: MockNode) {
  return {
    edge: {
      sourceId,
      targetId,
      edgeType: 'CALLS' as const,
      weight: 1,
      metadata: { confidence: 1, evidenceClass: 'EXTRACTED' as const },
    },
    sourceNode,
  };
}

function outgoing(sourceId: string, targetId: string, targetNode: MockNode) {
  return {
    edge: {
      sourceId,
      targetId,
      edgeType: 'CALLS' as const,
      weight: 1,
      metadata: { confidence: 1, evidenceClass: 'EXTRACTED' as const },
    },
    targetNode,
  };
}

function wireMultiHopGraph(): void {
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
  mocks.queryOutline.mockReturnValue([]);
  mocks.queryEdgesTo.mockImplementation((symbolId: string, edgeType?: string) => {
    if (edgeType !== 'CALLS') return [];
    if (symbolId === 'alpha') {
      return [
        incoming('direct', 'alpha', node('Direct.caller', 10)),
        incoming('middle', 'alpha', node('Middle.caller', 20)),
      ];
    }
    if (symbolId === 'middle') {
      return [incoming('central', 'middle', node('Central.caller', 30))];
    }
    return [];
  });
  mocks.queryEdgesFrom.mockImplementation((symbolId: string, edgeType?: string) => {
    if (edgeType !== 'CALLS') return [];
    if (symbolId === 'middle') return [outgoing('middle', 'alpha', node('Alpha.run', 1))];
    if (symbolId === 'central') return [outgoing('central', 'middle', node('Middle.caller', 20))];
    return [];
  });
}

async function runImpact() {
  return buildContext({
    queryMode: 'impact',
    input: 'impact of Alpha.run',
    seeds: [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }],
    deadlineMs: 400,
  });
}

describe('seeded-PPR impact ranking flag gate flips the path', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
    mocks.getCodeGraphGeneration.mockReturnValue(1);
    wireMultiHopGraph();
  });

  it('flag OFF stays on the flat single-hop path', async () => {
    delete process.env[FLAG];
    const result = await runImpact();
    const callers = result.graphContext[0].edges.map((e) => e.from);

    expect(callers).toContain('Direct.caller');
    expect(callers).toContain('Middle.caller');
    expect(callers).not.toContain('Central.caller');
    expect(mocks.queryEdgesTo).not.toHaveBeenCalledWith('middle', 'CALLS');
  });

  it('flag ON switches to the seeded-PPR walk and surfaces the deeper caller', async () => {
    vi.stubEnv(FLAG, 'true');
    const result = await runImpact();
    const callers = result.graphContext[0].edges.map((e) => e.from);

    expect(callers).toContain('Central.caller');
    expect(mocks.queryEdgesTo).toHaveBeenCalledWith('middle', 'CALLS');
  });

  it('flag ON is not byte-identical to flag OFF on the same graph', async () => {
    delete process.env[FLAG];
    const off = (await runImpact()).graphContext[0].edges.map((e) => e.from);

    vi.clearAllMocks();
    wireMultiHopGraph();
    vi.stubEnv(FLAG, 'true');
    const on = (await runImpact()).graphContext[0].edges.map((e) => e.from);

    expect(JSON.stringify(on)).not.toBe(JSON.stringify(off));
    expect(on.length).toBeGreaterThan(off.length);
  });
});
