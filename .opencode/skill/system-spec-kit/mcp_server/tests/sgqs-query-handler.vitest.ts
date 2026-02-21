// ---------------------------------------------------------------
// TEST: SGQS Query Handler Runtime Coverage
// ---------------------------------------------------------------

import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../lib/search/skill-graph-cache', () => ({
  skillGraphCache: {
    isWarm: vi.fn(() => true),
    invalidate: vi.fn(),
    get: vi.fn(),
  },
}));

import {
  handleMemorySkillGraphQuery,
  handleMemorySkillGraphInvalidate,
} from '../handlers/sgqs-query';
import { skillGraphCache } from '../lib/search/skill-graph-cache';

interface Envelope {
  summary?: string;
  data?: Record<string, unknown>;
}

function parseEnvelope(response: { content: Array<{ text: string }> }): Envelope {
  return JSON.parse(response.content[0]?.text ?? '{}') as Envelope;
}

describe('SGQS query handler runtime', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns validation error for oversized query payload', async () => {
    const query = 'x'.repeat(4097);
    const result = await handleMemorySkillGraphQuery({ queryString: query });

    expect(result.isError).toBe(true);
    const envelope = parseEnvelope(result);
    expect(String(envelope.data?.error ?? '')).toContain('maximum length');
  });

  it('executes query path using cached graph', async () => {
    const graph = {
      nodes: new Map([
        ['system-spec-kit/memory', {
          id: 'system-spec-kit/memory',
          labels: [':Node'],
          properties: { name: 'memory' },
          skill: 'system-spec-kit',
          path: 'system-spec-kit/memory',
        }],
      ]),
      edges: [] as Array<{ id: string; type: string; source: string; target: string; properties: Record<string, string> }>,
      edgeById: new Map(),
      outbound: new Map(),
      inbound: new Map(),
    };

    vi.mocked(skillGraphCache.get).mockResolvedValue(graph as never);

    const result = await handleMemorySkillGraphQuery({
      queryString: 'MATCH (n:Node) RETURN n.id',
    });

    expect(result.isError).not.toBe(true);
    const envelope = parseEnvelope(result);
    expect(String(envelope.summary ?? '')).toContain('SGQS query returned');
    expect(Number(envelope.data?.rowCount ?? 0)).toBeGreaterThanOrEqual(1);
    expect(vi.mocked(skillGraphCache.get)).toHaveBeenCalledTimes(1);
    expect(String(vi.mocked(skillGraphCache.get).mock.calls[0]?.[0] ?? '')).toContain('.opencode/skill');
  });

  it('returns error envelope when cache/query setup fails', async () => {
    vi.mocked(skillGraphCache.get).mockRejectedValue(new Error('cache failed'));

    const result = await handleMemorySkillGraphQuery({
      queryString: 'MATCH (n:Node) RETURN n.id',
    });

    expect(result.isError).toBe(true);
    const envelope = parseEnvelope(result);
    expect(String(envelope.data?.error ?? '')).toContain('cache failed');
  });

  it('covers invalidate warm and cold paths', async () => {
    vi.mocked(skillGraphCache.isWarm).mockReturnValueOnce(true).mockReturnValueOnce(false);

    const warm = await handleMemorySkillGraphInvalidate({});
    const warmEnvelope = parseEnvelope(warm);
    expect(warm.isError).not.toBe(true);
    expect(String(warmEnvelope.summary ?? '')).toContain('was warm');

    const cold = await handleMemorySkillGraphInvalidate({});
    const coldEnvelope = parseEnvelope(cold);
    expect(cold.isError).not.toBe(true);
    expect(String(coldEnvelope.summary ?? '')).toContain('already cold');
    expect(vi.mocked(skillGraphCache.invalidate)).toHaveBeenCalledTimes(2);
  });
});
