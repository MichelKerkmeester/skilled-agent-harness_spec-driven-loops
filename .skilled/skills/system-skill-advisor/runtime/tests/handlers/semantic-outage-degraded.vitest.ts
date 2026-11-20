import { describe, expect, it } from 'vitest';

import { mergeSemanticShadowRuntimeLaneHealth } from '../../handlers/advisor-recommend.js';

describe('semantic shadow outage lane health', () => {
  it('marks prompt embedding failures as runtime degraded', () => {
    expect(
      mergeSemanticShadowRuntimeLaneHealth(undefined, 'prompt_embedding_unreachable'),
    ).toEqual({
      semantic_shadow: {
        status: 'runtime_degraded',
        reason: 'prompt_embedding_unreachable',
      },
    });
  });

  it.each([null, 'lane_weight_zero'] as const)(
    'does not add semantic shadow health for %s',
    (disabledReason) => {
      const runtimeLaneHealth = mergeSemanticShadowRuntimeLaneHealth(undefined, disabledReason);
      expect(runtimeLaneHealth?.semantic_shadow).toBeUndefined();
    },
  );

  it('keeps stale graph health alongside semantic shadow degradation', () => {
    const graphCausalHealth = {
      status: 'runtime_degraded' as const,
      reason: 'skill_graph_stale',
    };

    expect(mergeSemanticShadowRuntimeLaneHealth(
      { graph_causal: graphCausalHealth },
      'prompt_embedding_unreachable',
    )).toEqual({
      graph_causal: graphCausalHealth,
      semantic_shadow: {
        status: 'runtime_degraded',
        reason: 'prompt_embedding_unreachable',
      },
    });
  });
});
