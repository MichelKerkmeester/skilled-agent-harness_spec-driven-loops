// MODULE: Deep-Loop Fallback Router

// ───── TYPE DEFINITIONS ─────

export type FallbackAction = 'fallback' | 'fail-fast';

export type FallbackRoute = {
  readonly action: FallbackAction;
  readonly target?: string;
  readonly reason: string;
};

export type ModelProfile = {
  readonly id: string;
  readonly quota_pool: string;
  readonly fallback_target: string | null;
};

export type ModelRegistry = {
  readonly models: readonly ModelProfile[];
};

// ───── HELPERS ─────

function findModel(registry: ModelRegistry, modelId: string): ModelProfile | undefined {
  return registry.models.find((model) => model.id === modelId);
}

// ───── CORE LOGIC ─────

/**
 * Resolve the fallback route when a model exhausts its quota pool.
 *
 * Checks whether the failed model has a configured fallback target in a
 * different quota pool and returns the appropriate route.
 *
 * @param failedModelId - The model ID that failed.
 * @param registry - The model registry with fallback configurations.
 * @returns A route indicating whether to fallback or fail-fast, with a reason.
 */
export function resolveFallback(failedModelId: string, registry: ModelRegistry): FallbackRoute {
  const failedModel = findModel(registry, failedModelId);
  if (failedModel === undefined) {
    return {
      action: 'fail-fast',
      reason: `unknown model ${failedModelId}; no quota pool available for fallback routing`,
    };
  }

  if (failedModel.fallback_target === null) {
    return {
      action: 'fail-fast',
      reason: `${failedModel.quota_pool} pool exhausted, no separate-pool fallback configured for ${failedModel.id}`,
    };
  }

  const targetModel = findModel(registry, failedModel.fallback_target);
  if (targetModel === undefined) {
    return {
      action: 'fail-fast',
      reason: `${failedModel.quota_pool} pool exhausted, configured fallback ${failedModel.fallback_target} is not in the registry`,
    };
  }

  if (targetModel.quota_pool === failedModel.quota_pool) {
    return {
      action: 'fail-fast',
      reason: `${failedModel.quota_pool} pool exhausted, fallback target ${targetModel.id} shares the same pool; same-pool fallback rejected`,
    };
  }

  return {
    action: 'fallback',
    target: targetModel.id,
    reason: `${failedModel.quota_pool} pool exhausted, routing ${failedModel.id} to separate ${targetModel.quota_pool} pool target ${targetModel.id}`,
  };
}
