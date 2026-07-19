// TEST: SAVE RESPONSE METADATA ADVISORY
// memory_save indexes document content only — packet metadata
// (description.json / graph-metadata.json) belongs to the generate-context
// save lane. The success response must say so explicitly, so resume and
// graph consumers never assume an MCP-routed save refreshed packet files.
import { describe, expect, it } from 'vitest';

import { buildSaveResponse } from '../handlers/save/response-builder.js';

function parseResponse(response: { content: Array<{ text: string }> }): Record<string, unknown> {
  return JSON.parse(response.content[0].text) as Record<string, unknown>;
}

function savedResult(overrides: Record<string, unknown> = {}): never {
  return {
    status: 'created',
    id: 101,
    specFolder: 'specs/000-fixture',
    title: 'Fixture Doc',
    triggerPhrases: [],
    contextType: 'implementation',
    importanceTier: 'normal',
    qualityScore: 0.9,
    qualityFlags: [],
    ...overrides,
  } as never;
}

describe('memory_save metadata-refresh advisory', () => {
  it('flags that packet metadata was not refreshed on canonical doc saves', () => {
    const response = parseResponse(buildSaveResponse({
      result: savedResult(),
      filePath: '/repo/specs/000-fixture/implementation-summary.md',
      asyncEmbedding: false,
      requestId: 'req-advisory-1',
    }));

    const data = (response.data ?? response) as Record<string, unknown>;
    expect(data.metadataRefresh).toEqual({
      refreshed: false,
      files: ['description.json', 'graph-metadata.json'],
      refreshedBy: 'generate-context save lane',
    });
    const hints = (response.hints ?? (data.hints as unknown)) as string[];
    expect(hints.join('\n')).toContain('generate-context save lane');
  });

  it('omits the advisory when the saved file IS packet metadata', () => {
    const response = parseResponse(buildSaveResponse({
      result: savedResult(),
      filePath: '/repo/specs/000-fixture/graph-metadata.json',
      asyncEmbedding: false,
      requestId: 'req-advisory-2',
    }));

    const data = (response.data ?? response) as Record<string, unknown>;
    expect(data.metadataRefresh).toBeUndefined();
  });

  it('omits the advisory for constitutional memories', () => {
    const response = parseResponse(buildSaveResponse({
      result: savedResult(),
      filePath: '/repo/.opencode/skills/system-spec-kit/constitutional/rule.md',
      asyncEmbedding: false,
      requestId: 'req-advisory-3',
    }));

    const data = (response.data ?? response) as Record<string, unknown>;
    expect(data.metadataRefresh).toBeUndefined();
  });
});
