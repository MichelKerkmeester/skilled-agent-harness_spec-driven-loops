import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { PipelineResult } from '../lib/search/pipeline/index.js';

vi.mock('../core/index.js', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    checkDatabaseUpdated: vi.fn(async () => false),
  };
});

vi.mock('../lib/search/pipeline/index.js', () => ({
  executePipeline: vi.fn(),
}));

vi.mock('../lib/code-graph-boundary.js', () => ({
  getGraphReadinessSnapshotFromMarker: vi.fn(() => ({
    freshness: 'fresh',
    action: 'none',
    reason: 'fixture graph is fresh',
  })),
}));

import { handleMemorySearch } from '../handlers/memory-search.js';
import { executePipeline } from '../lib/search/pipeline/index.js';

function pipelineFixture(): PipelineResult {
  return {
    results: [],
    metadata: {
      stage1: {
        searchType: 'hybrid',
        channelCount: 0,
        activeChannels: 0,
        channelTelemetry: {
          skippedChannels: ['fts', 'graph'],
          skippedChannelDetails: [
            { channel: 'fts', reason: 'Runtime database unavailable', type: 'runtime' },
            { channel: 'graph', reason: 'Runtime graph executor unavailable', type: 'runtime' },
          ],
          channelExceptions: [],
        },
        candidateCount: 0,
        constitutionalInjected: 0,
        durationMs: 1,
      },
      stage2: {
        sessionBoostApplied: 'off',
        causalBoostApplied: 'enabled',
        intentWeightsApplied: 'off',
        artifactRoutingApplied: 'off',
        feedbackSignalsApplied: 'off',
        channelExceptions: [{
          channel: 'graph',
          reason: 'graph context forced failure',
          source: 'graph-context-injection',
        }],
        graphContext: {
          activated: false,
          matchedConcepts: [],
          relatedMemoryIds: [],
          edgeTypes: [],
        },
        qualityFiltered: 0,
        durationMs: 1,
      },
      stage3: {
        rerankApplied: false,
        chunkReassemblyStats: {
          collapsedChunkHits: 0,
          chunkParents: 0,
          reassembled: 0,
          fallback: 0,
        },
        durationMs: 1,
      },
      stage4: {
        stateFiltered: 0,
        constitutionalInjected: 0,
        evidenceGapDetected: true,
        durationMs: 1,
      },
      timing: {
        stage1: 1,
        stage2: 1,
        stage3: 1,
        stage4: 1,
        total: 4,
      },
      channelTelemetry: {
        skippedChannels: ['fts', 'graph'],
        skippedChannelDetails: [
          { channel: 'fts', reason: 'Runtime database unavailable', type: 'runtime' },
          { channel: 'graph', reason: 'graph context forced failure', type: 'exception' },
        ],
        channelExceptions: [{
          channel: 'graph',
          reason: 'graph context forced failure',
          source: 'graph-context-injection',
        }],
        graphContext: {
          activated: false,
          matchedConcepts: [],
          relatedMemoryIds: [],
          edgeTypes: [],
        },
      },
    },
    annotations: {
      stateStats: {},
      featureFlags: {},
      evidenceGapWarning: 'Channel telemetry fixture gap',
    },
  };
}

describe('memory_search channel telemetry response', () => {
  beforeEach(() => {
    vi.mocked(executePipeline).mockResolvedValue(pipelineFixture());
    vi.stubEnv('SPECKIT_TOOL_CACHE', 'false');
    vi.stubEnv('SPECKIT_IMPLICIT_FEEDBACK_LOG', 'false');
  });

  afterEach(() => {
    vi.mocked(executePipeline).mockReset();
    vi.unstubAllEnvs();
  });

  it('serializes channel telemetry and reconciles runtime skips into the query plan', async () => {
    const response = await handleMemorySearch({
      query: 'serialized channel telemetry response',
      limit: 5,
      bypassCache: true,
      includeConstitutional: false,
      retrievalLevel: 'local',
      autoDetectIntent: false,
      enableSessionBoost: false,
      enableCausalBoost: true,
      trackAccess: false,
      rerank: false,
    });
    const serializedResponse = JSON.stringify(response);
    const responseCopy = JSON.parse(serializedResponse) as typeof response;
    const envelope = JSON.parse(responseCopy.content[0]?.text ?? '{}') as {
      data?: Record<string, unknown>;
    };
    const data = envelope.data ?? {};
    const telemetry = data.channelTelemetry as PipelineResult['metadata']['channelTelemetry'];
    const decision = data.searchDecisionEnvelope as {
      queryPlan?: { skippedChannels?: Array<{ channel: string; reason: string }> };
    };

    expect(telemetry).toMatchObject({
      skippedChannels: ['fts', 'graph'],
      channelExceptions: [expect.objectContaining({ source: 'graph-context-injection' })],
      graphContext: expect.objectContaining({ activated: false }),
    });
    expect(decision.queryPlan?.skippedChannels).toEqual(expect.arrayContaining([
      { channel: 'fts', reason: 'Runtime database unavailable' },
      { channel: 'graph', reason: 'graph context forced failure' },
    ]));
    expect(decision.queryPlan?.skippedChannels?.filter((entry) => entry.channel === 'graph')).toEqual([
      { channel: 'graph', reason: 'graph context forced failure' },
    ]);
  });

  it('serializes one precedence-resolved skip per channel for default routing overlap', async () => {
    const fixture = pipelineFixture();
    const callerDisableTelemetry = {
      skippedChannels: ['graph', 'degree'],
      skippedChannelDetails: [
        { channel: 'graph', reason: 'Disabled by caller', type: 'runtime' as const },
        { channel: 'degree', reason: 'Disabled by caller', type: 'runtime' as const },
      ],
      channelExceptions: [],
    };
    fixture.metadata.stage1.channelTelemetry = callerDisableTelemetry;
    fixture.metadata.channelTelemetry = callerDisableTelemetry;
    vi.mocked(executePipeline).mockResolvedValue(fixture);

    const response = await handleMemorySearch({
      query: 'fix bug',
      limit: 5,
      bypassCache: true,
      includeConstitutional: false,
      retrievalLevel: 'local',
      autoDetectIntent: false,
      enableSessionBoost: false,
      enableCausalBoost: false,
      trackAccess: false,
      rerank: false,
    });
    const responseCopy = JSON.parse(JSON.stringify(response)) as typeof response;
    const envelope = JSON.parse(responseCopy.content[0]?.text ?? '{}') as {
      data?: Record<string, unknown>;
    };
    const data = envelope.data ?? {};
    const telemetry = data.channelTelemetry as PipelineResult['metadata']['channelTelemetry'];
    const decision = data.searchDecisionEnvelope as {
      queryPlan?: { skippedChannels?: Array<{ channel: string; reason: string }> };
    };

    expect(telemetry?.skippedChannelDetails).toEqual([
      { channel: 'graph', reason: 'Disabled by caller', type: 'runtime' },
      { channel: 'degree', reason: 'Disabled by caller', type: 'runtime' },
    ]);
    expect(decision.queryPlan?.skippedChannels).toEqual([
      { channel: 'bm25', reason: 'Skipped by simple complexity route' },
      { channel: 'graph', reason: 'Disabled by caller' },
      { channel: 'degree', reason: 'Disabled by caller' },
    ]);
  });
});
