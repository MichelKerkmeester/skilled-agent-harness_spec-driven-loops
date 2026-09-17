// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Recommend Unavailable Tests
// ───────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it, vi } from 'vitest';

const { mockScoreAdvisorPrompt, mockReadAdvisorStatus } = vi.hoisted(() => ({
  mockScoreAdvisorPrompt: vi.fn(),
  mockReadAdvisorStatus: vi.fn(),
}));

vi.mock('../../lib/scorer/fusion.js', () => ({
  scoreAdvisorPrompt: mockScoreAdvisorPrompt,
}));

vi.mock('../../handlers/advisor-status.js', () => ({
  readAdvisorStatus: mockReadAdvisorStatus,
}));

import { advisorPromptCache } from '../../lib/prompt-cache.js';
import { handleAdvisorRecommend } from '../../handlers/advisor-recommend.js';

type HandlerResponse = Awaited<ReturnType<typeof handleAdvisorRecommend>>;

function parseResponse(response: HandlerResponse): { status: string; data: Record<string, unknown> } {
  return JSON.parse(response.content[0].text) as { status: string; data: Record<string, unknown> };
}

afterEach(() => {
  advisorPromptCache.clear();
  vi.restoreAllMocks();
  mockReadAdvisorStatus.mockReset();
  mockScoreAdvisorPrompt.mockReset();
});

describe('advisor_recommend unavailable freshness fail-open', () => {
  it('returns empty recommendations without scoring when advisor status is unavailable', async () => {
    mockReadAdvisorStatus.mockReturnValue({
      freshness: 'unavailable',
      generation: 0,
      trustState: {
        state: 'unavailable',
        reason: 'ADVISOR_STATUS_UNAVAILABLE',
        generation: 0,
        checkedAt: '2026-04-28T00:00:00.000Z',
        lastLiveAt: null,
      },
      lastGenerationBump: null,
      lastScanAt: null,
      skillCount: 0,
      laneWeights: {
        explicit_author: 0.42,
        lexical: 0.28,
        graph_causal: 0.13,
        derived_generated: 0.12,
        semantic_shadow: 0.05,
      },
      errors: ['database disk image is malformed'],
    });
    mockScoreAdvisorPrompt.mockReturnValue({
      recommendations: [{
        skill: 'system-spec-kit',
        score: 0.9,
        confidence: 0.95,
        uncertainty: 0.05,
        dominantLane: 'explicit_author',
        laneContributions: [],
        lifecycleStatus: 'active',
      }],
      topSkill: 'system-spec-kit',
      unknown: false,
      ambiguous: false,
      metrics: { candidateCount: 1, liveLaneCount: 5 },
    });

    const response = parseResponse(await handleAdvisorRecommend({
      prompt: 'Implement a spec folder workflow',
    }));

    expect(response.status).toBe('ok');
    expect(response.data.freshness).toBe('unavailable');
    expect(response.data.recommendations).toEqual([]);
    expect(response.data.trustState).toEqual(expect.objectContaining({
      state: 'unavailable',
      reason: 'advisor_unavailable',
    }));
    expect(response.data.warnings).toEqual([
      'advisor_unavailable',
      'database disk image is malformed',
    ]);
    expect(response.data.abstainReasons).toEqual([
      'Skill advisor freshness is unavailable; returning fail-open empty recommendations.',
    ]);
    expect(mockScoreAdvisorPrompt).not.toHaveBeenCalled();
  });

  it('serves recommendations when unavailable status has usable stale trust state', async () => {
    mockReadAdvisorStatus.mockReturnValue({
      freshness: 'unavailable',
      generation: 7,
      trustState: {
        state: 'stale',
        reason: 'SIGTERM',
        generation: 7,
        checkedAt: '2026-04-28T00:00:00.000Z',
        lastLiveAt: null,
      },
      lastGenerationBump: '2026-04-28T00:00:00.000Z',
      lastScanAt: '2026-04-28T00:00:00.000Z',
      skillCount: 42,
      laneWeights: {
        explicit_author: 0.42,
        lexical: 0.28,
        graph_causal: 0.13,
        derived_generated: 0.12,
        semantic_shadow: 0.05,
      },
    });
    mockScoreAdvisorPrompt.mockReturnValue({
      recommendations: [{
        skill: 'system-spec-kit',
        score: 0.9,
        confidence: 0.95,
        uncertainty: 0.05,
        dominantLane: 'explicit_author',
        laneContributions: [],
        lifecycleStatus: 'active',
      }],
      topSkill: 'system-spec-kit',
      unknown: false,
      ambiguous: false,
      metrics: { candidateCount: 1, liveLaneCount: 5 },
    });

    const response = parseResponse(await handleAdvisorRecommend({
      prompt: 'Implement a spec folder workflow',
    }));

    expect(response.status).toBe('ok');
    expect(response.data.freshness).toBe('stale');
    expect(response.data.recommendations).toEqual([
      expect.objectContaining({ skillId: 'system-spec-kit' }),
    ]);
    expect(response.data.warnings).toEqual(['SIGTERM']);
    expect(mockScoreAdvisorPrompt).toHaveBeenCalledWith(
      'Implement a spec folder workflow',
      expect.objectContaining({
        runtimeLaneHealth: {
          graph_causal: {
            status: 'runtime_degraded',
            reason: 'SIGTERM',
          },
        },
      }),
    );
  });
});
