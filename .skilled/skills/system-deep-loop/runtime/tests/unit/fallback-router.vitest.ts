// ───────────────────────────────────────────────────────────────────
// MODULE: Fallback Router Unit Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  createFallbackRouter,
  type ModelProfile,
  type ModelRegistry,
  resolveFallback,
} from '../../lib/deep-loop/fallback-router';

const requiredProfiles: readonly ModelProfile[] = [
  { id: 'swe-1.6', quota_pool: 'cognition-free', fallback_target: null },
  { id: 'deepseek-v4-pro', quota_pool: 'cognition-pro', fallback_target: null },
  { id: 'kimi-k2.6', quota_pool: 'cognition-pro', fallback_target: null },
  { id: 'qwen3.6', quota_pool: 'cognition-pro', fallback_target: null },
] as const;

const optionalProfiles: readonly ModelProfile[] = [
  { id: 'haiku', quota_pool: 'anthropic', fallback_target: null },
] as const;

/**
 * Builds a ModelRegistry with a fallback target set for the given source model.
 */
function registryWithFallback(sourceId: string, targetId: string | null): ModelRegistry {
  return {
    models: [...requiredProfiles, ...optionalProfiles].map((profile) =>
      profile.id === sourceId ? { ...profile, fallback_target: targetId } : profile,
    ),
  };
}

describe('fallback-router', () => {
  it('fails fast for the default SWE-1.6 registry state', () => {
    expect(resolveFallback('swe-1.6', registryWithFallback('swe-1.6', null))).toEqual({
      action: 'fail-fast',
      reason: 'cognition-free pool exhausted, no separate-pool fallback configured for swe-1.6',
    });
  });

  it('fails fast for the default Cognition Pro registry state', () => {
    expect(resolveFallback('deepseek-v4-pro', registryWithFallback('deepseek-v4-pro', null))).toEqual({
      action: 'fail-fast',
      reason: 'cognition-pro pool exhausted, no separate-pool fallback configured for deepseek-v4-pro',
    });
  });

  it('evaluates every required source and required target pool combination', () => {
    for (const source of requiredProfiles) {
      for (const target of requiredProfiles) {
        const result = resolveFallback(source.id, registryWithFallback(source.id, target.id));

        if (source.quota_pool === target.quota_pool) {
          expect(result).toMatchObject({
            action: 'fail-fast',
          });
          expect(result.reason).toContain('same-pool fallback rejected');
        } else {
          expect(result).toEqual({
            action: 'fallback',
            target: target.id,
            reason: `${source.quota_pool} pool exhausted, routing ${source.id} to separate ${target.quota_pool} pool target ${target.id}`,
          });
        }
      }
    }
  });

  it('routes SWE-1.6 to Haiku when the optional separate-pool target is populated', () => {
    expect(resolveFallback('swe-1.6', registryWithFallback('swe-1.6', 'haiku'))).toEqual({
      action: 'fallback',
      target: 'haiku',
      reason: 'cognition-free pool exhausted, routing swe-1.6 to separate anthropic pool target haiku',
    });
  });

  it('rejects same-pool Cognition Pro sibling fallback', () => {
    expect(resolveFallback('kimi-k2.6', registryWithFallback('kimi-k2.6', 'qwen3.6'))).toEqual({
      action: 'fail-fast',
      reason: 'cognition-pro pool exhausted, fallback target qwen3.6 shares the same pool; same-pool fallback rejected',
    });
  });

  it('routes an Anthropic source to a separate-pool target when populated', () => {
    expect(resolveFallback('haiku', registryWithFallback('haiku', 'swe-1.6'))).toEqual({
      action: 'fallback',
      target: 'swe-1.6',
      reason: 'anthropic pool exhausted, routing haiku to separate cognition-free pool target swe-1.6',
    });
  });

  it('fails fast when the configured target is absent from the registry', () => {
    expect(resolveFallback('swe-1.6', registryWithFallback('swe-1.6', 'missing-model'))).toEqual({
      action: 'fail-fast',
      reason: 'cognition-free pool exhausted, configured fallback missing-model is not in the registry',
    });
  });

  it('fails fast for unknown failed models', () => {
    expect(resolveFallback('missing-model', registryWithFallback('swe-1.6', null))).toEqual({
      action: 'fail-fast',
      reason: 'unknown model missing-model; no quota pool available for fallback routing',
    });
  });

  it('routes typed timeout failures with trace metadata', () => {
    const registry: ModelRegistry = {
      models: [
        {
          id: 'swe-1.6',
          quota_pool: 'cognition-free',
          fallback_target: null,
          onFailureTarget: { timeout: 'haiku' },
          routeScope: 'executor',
        },
        {
          id: 'haiku',
          quota_pool: 'anthropic',
          fallback_target: null,
          routeScope: 'executor',
        },
      ],
    };

    const router = createFallbackRouter(registry);

    expect(router.resolve('swe-1.6', ['swe-1.6', 'haiku'], {
      failureKind: 'timeout',
      routeGroupId: 'executor-fallback-1',
    })).toEqual({
      action: 'fallback',
      target: 'haiku',
      reason: 'cognition-free pool exhausted, routing swe-1.6 to separate anthropic pool target haiku',
      failureKind: 'timeout',
      routeGroupId: 'executor-fallback-1',
      hopIndex: 0,
    });
  });

  it('rejects cyclic fallback graphs before routing can dispatch', () => {
    const registry: ModelRegistry = {
      models: [
        {
          id: 'swe-1.6',
          quota_pool: 'cognition-free',
          fallback_target: null,
          onFailureTarget: { timeout: 'haiku' },
          routeScope: 'executor',
        },
        {
          id: 'haiku',
          quota_pool: 'anthropic',
          fallback_target: null,
          onFailureTarget: { timeout: 'swe-1.6' },
          routeScope: 'executor',
        },
      ],
    };

    expect(() => createFallbackRouter(registry)).toThrow(
      'fallback graph cycle detected: swe-1.6 -> haiku -> swe-1.6',
    );
  });
});
