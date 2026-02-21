// ---------------------------------------------------------------
// TEST: Deep Semantic Bridge Runtime Wiring (Spec 138)
// Verifies memory-search deep variant builder consumes semantic bridges
// in runtime path when graph-unified is enabled.
// ---------------------------------------------------------------

import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockExpandQuery = vi.fn<(query: string) => string[]>();
const mockBuildSemanticBridgeMap = vi.fn<(graph: unknown) => Map<string, string[]>>();
const mockExpandQueryWithBridges = vi.fn<(query: string, bridgeMap: Map<string, string[]>) => string[]>();
const mockIsGraphUnifiedEnabled = vi.fn<() => boolean>();
const mockSkillGraphGet = vi.fn<(skillRoot: string) => Promise<unknown>>();

vi.mock('../lib/search/query-expander', () => ({
  expandQuery: (query: string) => mockExpandQuery(query),
  buildSemanticBridgeMap: (graph: unknown) => mockBuildSemanticBridgeMap(graph),
  expandQueryWithBridges: (query: string, bridgeMap: Map<string, string[]>) =>
    mockExpandQueryWithBridges(query, bridgeMap),
}));

vi.mock('../lib/search/graph-flags', () => ({
  isGraphUnifiedEnabled: () => mockIsGraphUnifiedEnabled(),
}));

vi.mock('../lib/search/skill-graph-cache', () => ({
  skillGraphCache: {
    get: (skillRoot: string) => mockSkillGraphGet(skillRoot),
  },
}));

vi.mock('../core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../core')>();
  return {
    ...actual,
    DEFAULT_BASE_PATH: '/tmp/speckit-base',
  };
});

import { __testables } from '../handlers/memory-search';

const { buildDeepQueryVariants } = __testables;

describe('Deep semantic bridge runtime wiring', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExpandQuery.mockReturnValue(['memory retrieval']);
    mockBuildSemanticBridgeMap.mockReturnValue(new Map([['memory', ['retrieval']]]));
    mockExpandQueryWithBridges.mockImplementation((query) => [query, 'retrieval retrieval']);
    mockIsGraphUnifiedEnabled.mockReturnValue(true);
    mockSkillGraphGet.mockResolvedValue({ nodes: new Map(), edges: [] });
  });

  it('expands deep query variants with semantic bridges when graph-unified is enabled', async () => {
    const variants = await buildDeepQueryVariants('memory retrieval');

    expect(mockSkillGraphGet).toHaveBeenCalledWith('/tmp/speckit-base/.opencode/skill');
    expect(mockBuildSemanticBridgeMap).toHaveBeenCalledTimes(1);
    expect(mockExpandQueryWithBridges).toHaveBeenCalledWith('memory retrieval', expect.any(Map));
    expect(variants).toContain('memory retrieval');
    expect(variants).toContain('retrieval retrieval');
  });

  it('returns lexical variants only when graph-unified is disabled', async () => {
    mockIsGraphUnifiedEnabled.mockReturnValue(false);
    mockExpandQuery.mockReturnValue(['memory retrieval', 'memory search']);

    const variants = await buildDeepQueryVariants('memory retrieval');

    expect(mockSkillGraphGet).not.toHaveBeenCalled();
    expect(mockExpandQueryWithBridges).not.toHaveBeenCalled();
    expect(variants).toEqual(['memory retrieval', 'memory search']);
  });

  it('falls back to lexical variants when bridge expansion fails', async () => {
    mockExpandQuery.mockReturnValue(['alpha beta', 'alpha query']);
    mockSkillGraphGet.mockRejectedValue(new Error('graph unavailable'));

    const variants = await buildDeepQueryVariants('alpha beta');

    expect(variants).toEqual(['alpha beta', 'alpha query']);
  });
});
