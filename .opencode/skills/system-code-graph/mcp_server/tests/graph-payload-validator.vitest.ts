import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../lib/shared/shared-payload.js', () => ({
  attachStructuralTrustFields: vi.fn((payload) => ({
    ...payload,
    parserProvenance: 'regex',
    evidenceStatus: 'confirmed',
    freshnessAuthority: 'live',
  })),
  attachGraphEdgeEnrichment: vi.fn((payload) => payload),
  buildStructuralTrustFromProvenance: vi.fn(() => ({
    parserProvenance: 'regex',
    evidenceStatus: 'confirmed',
    freshnessAuthority: 'live',
  })),
  StructuralTrustPayloadError: class StructuralTrustPayloadError extends Error {},
  validateStructuralTrustPayload: vi.fn(),
}));

describe('code graph query trust emission', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.doUnmock('../lib/shared/shared-payload.js');
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.doUnmock('../lib/shared/shared-payload.js');
  });

  // drift: verified against shipped behavior during Unit H
  it('emits separate trust axes on code-graph payloads', async () => {
    vi.doMock('../lib/ensure-ready.js', () => ({
      ensureCodeGraphReady: vi.fn(async () => ({
        freshness: 'fresh',
        action: 'none',
        inlineIndexPerformed: false,
        reason: 'ready',
      })),
    }));

    vi.doMock('../lib/code-graph-db.js', () => ({
      queryOutline: vi.fn(() => [{
        name: 'handleOutline',
        kind: 'function',
        fqName: 'src/file.ts::handleOutline',
        startLine: 7,
        signature: '() => void',
        symbolId: 'sym-1',
      }]),
      getDb: vi.fn(),
      resolveSubjectFilePath: vi.fn((subject: string) => subject),
      queryEdgesFrom: vi.fn(() => []),
      queryEdgesTo: vi.fn(() => []),
      getLastDetectorProvenance: vi.fn(() => 'structured'),
      queryStartupHighlights: vi.fn(() => []),
    }));

    vi.doMock('../lib/shared/shared-payload.js', () => ({
      attachStructuralTrustFields: vi.fn((payload) => ({
        ...payload,
        parserProvenance: 'regex',
        evidenceStatus: 'confirmed',
        freshnessAuthority: 'live',
      })),
      attachGraphEdgeEnrichment: vi.fn((payload) => payload),
      buildStructuralTrustFromProvenance: vi.fn(() => ({
        parserProvenance: 'regex',
        evidenceStatus: 'confirmed',
        freshnessAuthority: 'live',
      })),
      StructuralTrustPayloadError: class extends Error {},
      validateStructuralTrustPayload: vi.fn(() => ({
        parserProvenance: 'regex',
        evidenceStatus: 'confirmed',
        freshnessAuthority: 'live',
      })),
    }));

    vi.doMock('../../../system-spec-kit/mcp_server/lib/context/opencode-transport.js', () => ({
      coerceSharedPayloadEnvelope: vi.fn(),
    }));

    const { handleCodeGraphQuery } = await import('../handlers/query.js');
    const result = await handleCodeGraphQuery({ operation: 'outline', subject: 'src/file.ts' });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.data.parserProvenance).toBe('regex');
    expect(parsed.data.evidenceStatus).toBe('confirmed');
    expect(parsed.data.freshnessAuthority).toBe('live');
    expect(parsed.data.graphMetadata).toEqual({
      detectorProvenance: 'structured',
      detectorProvenanceSource: 'last-persisted-scan',
    });
    expect(parsed.data).not.toHaveProperty('trust');
    expect(parsed.data).not.toHaveProperty('confidence');
  });

  it('fails closed when query emission validation rejects the trust payload', async () => {
    vi.doMock('../lib/ensure-ready.js', () => ({
      ensureCodeGraphReady: vi.fn(async () => ({
        freshness: 'fresh',
        action: 'none',
        inlineIndexPerformed: false,
        reason: 'ready',
      })),
    }));

    vi.doMock('../lib/code-graph-db.js', () => ({
      queryOutline: vi.fn(() => []),
      getDb: vi.fn(),
      resolveSubjectFilePath: vi.fn((subject: string) => subject),
      queryEdgesFrom: vi.fn(() => []),
      queryEdgesTo: vi.fn(() => []),
      getLastDetectorProvenance: vi.fn(() => 'structured'),
      queryStartupHighlights: vi.fn(() => []),
    }));

    let throwOnAttach = false;
    vi.doMock('../lib/shared/shared-payload.js', () => {
      class MockStructuralTrustPayloadError extends Error {}
      return {
        attachStructuralTrustFields: vi.fn(() => {
          if (throwOnAttach) {
            throw new MockStructuralTrustPayloadError(
              'code_graph_query outline payload rejects collapsed scalar fields: trust.',
            );
          }
          return {};
        }),
        attachGraphEdgeEnrichment: vi.fn((payload) => payload),
        buildStructuralTrustFromProvenance: vi.fn(() => ({
          parserProvenance: 'regex',
          evidenceStatus: 'confirmed',
          freshnessAuthority: 'live',
        })),
        StructuralTrustPayloadError: MockStructuralTrustPayloadError,
        validateStructuralTrustPayload: vi.fn(),
      };
    });

    vi.doMock('../../../system-spec-kit/mcp_server/lib/context/opencode-transport.js', () => ({
      coerceSharedPayloadEnvelope: vi.fn(),
    }));

    throwOnAttach = true;

    const { handleCodeGraphQuery } = await import('../handlers/query.js');

    await expect(handleCodeGraphQuery({
      operation: 'outline',
      subject: 'src/file.ts',
    })).rejects.toThrow('collapsed scalar fields');
  });
});
