// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Context Lazy Weighted Walk Tests
// ───────────────────────────────────────────────────────────────

import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  existsSync: vi.fn(() => false),
  resolveSeeds: vi.fn(),
  getCodeGraphGeneration: vi.fn(() => 1),
  getDb: vi.fn(() => ({ prepare: vi.fn(() => ({ get: vi.fn(() => ({ last: null })) })) })),
  queryOutline: vi.fn(() => [] as Array<Record<string, unknown>>),
  queryEdgesFrom: vi.fn(() => [] as Array<Record<string, unknown>>),
  queryEdgesTo: vi.fn(() => [] as Array<Record<string, unknown>>),
}));

vi.mock('node:fs', async () => {
  const actual = await vi.importActual<typeof import('node:fs')>('node:fs');
  return { ...actual, existsSync: mocks.existsSync };
});

vi.mock('../lib/seed-resolver.js', () => ({ resolveSeeds: mocks.resolveSeeds }));
vi.mock('../lib/code-graph-db.js', () => ({
  getCodeGraphGeneration: mocks.getCodeGraphGeneration,
  getDb: mocks.getDb,
  queryOutline: mocks.queryOutline,
  queryEdgesFrom: mocks.queryEdgesFrom,
  queryEdgesTo: mocks.queryEdgesTo,
}));

describe('code-graph-context weighted-walk lazy import', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.clearAllMocks();
    mocks.existsSync.mockReturnValue(false);
    mocks.resolveSeeds.mockReturnValue([
      {
        filePath: 'src/alpha.ts',
        startLine: 1,
        endLine: 1,
        symbolId: 'alpha',
        fqName: 'Alpha.run',
        kind: 'function',
        confidence: 0.95,
        resolution: 'exact',
      },
    ]);
  });

  it('does not resolve the shared weighted-walk artifact for non-PPR context modes', async () => {
    const { buildContext } = await import('../lib/code-graph-context.js');

    const result = await buildContext({
      queryMode: 'neighborhood',
      seeds: [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }],
      deadlineMs: 400,
    });

    expect(result.queryMode).toBe('neighborhood');
    expect(mocks.existsSync).not.toHaveBeenCalled();
  });

  it('fails the PPR path clearly when the shared weighted-walk artifact is missing', async () => {
    vi.stubEnv('SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING', 'true');
    const { buildContext } = await import('../lib/code-graph-context.js');

    await expect(buildContext({
      queryMode: 'impact',
      seeds: [{ filePath: 'src/placeholder.ts', startLine: 1, endLine: 1 }],
      deadlineMs: 400,
    })).rejects.toThrow('Memory weighted-walk traversal module not found');
  });

  it('resolves via the second (deeper) candidate URL when only it exists on disk', async () => {
    const { resolveMemoryWeightedWalkModuleUrl } = await import('../lib/code-graph-context.js');
    // The first (shallower) candidate lives under .../skills/system-spec-kit/...;
    // the second (deeper fallback) candidate omits the /skills/ segment. Fail
    // the first, succeed the second, and assert the second wins the .find().
    mocks.existsSync.mockImplementation((candidatePath: unknown) => (
      typeof candidatePath === 'string' && !candidatePath.includes(`${'/'}skills${'/'}system-spec-kit${'/'}`)
    ));

    const resolved = resolveMemoryWeightedWalkModuleUrl();

    expect(mocks.existsSync).toHaveBeenCalledTimes(2);
    expect(resolved.href).not.toContain('/skills/system-spec-kit/');
    expect(resolved.href).toContain('/system-spec-kit/mcp_server/dist/lib/graph/bfs-traversal.js');
  });
});
