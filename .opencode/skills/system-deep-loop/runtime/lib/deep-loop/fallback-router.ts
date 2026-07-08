// ───────────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Fallback Router
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

export type FallbackAction = 'fallback' | 'fail-fast';

/** Executor result category used by typed fallback route selection. */
export type FallbackRouteOutcome = 'success' | 'failure';

/** Failure classes that can select a targeted fallback route. */
export type FallbackFailureKind =
  | 'timeout'
  | 'auth-failure'
  | 'quota-exceeded'
  | 'executor-error'
  | (string & {});

/** Per-failure target map for typed fallback routes. */
export interface FallbackFailureTargets {
  readonly default?: string;
  readonly [failureKind: string]: string | undefined;
}

/** Fallback decision returned to dispatch callers. */
export type FallbackRoute = {
  readonly action: FallbackAction;
  readonly target?: string;
  readonly reason: string;
  readonly failureKind?: FallbackFailureKind;
  readonly routeGroupId?: string;
  readonly hopIndex?: number;
};

/** Runtime context attached to a routed fallback decision. */
export interface FallbackRouteContext {
  readonly outcome?: FallbackRouteOutcome;
  readonly failureKind?: FallbackFailureKind;
  readonly routeGroupId?: string;
  readonly hopIndex?: number;
}

/** Model routing profile used by fallback graph resolution. */
export type ModelProfile = {
  readonly id: string;
  readonly quota_pool: string;
  readonly fallback_target: string | null;
  readonly failureKind?: FallbackFailureKind;
  readonly onSuccessTarget?: string | null;
  readonly onFailureTarget?: string | FallbackFailureTargets | null;
  readonly routeScope?: string;
};

/** Registry of model profiles available to the fallback router. */
export type ModelRegistry = {
  readonly models: readonly ModelProfile[];
};

/** Configuration for validating fallback graph edges before dispatch. */
export interface FallbackGraphValidationOptions {
  readonly maxHops?: number;
}

/** Validated router that binds a registry after graph preflight. */
export interface FallbackRouter {
  resolve(
    failedModelId: string,
    approvedModelIds?: readonly string[],
    context?: FallbackRouteContext,
  ): FallbackRoute;
}

type TargetKind = 'legacy' | 'success' | 'failure';

interface TargetSelection {
  readonly target: string | null;
  readonly kind: TargetKind;
  readonly failureKind?: FallbackFailureKind;
}

interface FallbackEdge {
  readonly source: ModelProfile;
  readonly targetId: string;
  readonly kind: TargetKind;
  readonly failureKind?: string;
}

const DEFAULT_MAX_HOPS = 1;

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function findModel(registry: ModelRegistry, modelId: string): ModelProfile | undefined {
  return registry.models.find((model) => model.id === modelId);
}

function isFailureTargets(
  value: string | FallbackFailureTargets | null | undefined,
): value is FallbackFailureTargets {
  return typeof value === 'object' && value !== null;
}

function selectFailureTarget(
  failedModel: ModelProfile,
  failureKind: FallbackFailureKind | undefined,
): TargetSelection {
  const configuredTarget = failedModel.onFailureTarget;
  const effectiveFailureKind = failureKind ?? failedModel.failureKind;

  if (typeof configuredTarget === 'string') {
    return { target: configuredTarget, kind: 'failure', failureKind: effectiveFailureKind };
  }

  if (isFailureTargets(configuredTarget)) {
    const mappedTarget =
      effectiveFailureKind === undefined
        ? configuredTarget.default ?? null
        : configuredTarget[effectiveFailureKind] ?? configuredTarget.default ?? null;

    return {
      target: mappedTarget,
      kind: 'failure',
      failureKind: effectiveFailureKind,
    };
  }

  return {
    target: failedModel.fallback_target,
    kind: 'legacy',
    failureKind: effectiveFailureKind,
  };
}

function selectTarget(failedModel: ModelProfile, context: FallbackRouteContext | undefined): TargetSelection {
  if (context?.outcome === 'success' && failedModel.onSuccessTarget !== undefined) {
    return {
      target: failedModel.onSuccessTarget,
      kind: 'success',
      failureKind: context.failureKind ?? failedModel.failureKind,
    };
  }

  return selectFailureTarget(failedModel, context?.failureKind);
}

function createTrace(
  failedModelId: string,
  context: FallbackRouteContext | undefined,
): Pick<FallbackRoute, 'routeGroupId' | 'hopIndex'> | undefined {
  if (context === undefined) return undefined;

  return {
    routeGroupId: context.routeGroupId ?? `${failedModelId}:${context.failureKind ?? context.outcome ?? 'fallback'}`,
    hopIndex: context.hopIndex ?? 0,
  };
}

function withRouteMetadata(
  route: FallbackRoute,
  trace: Pick<FallbackRoute, 'routeGroupId' | 'hopIndex'> | undefined,
  failureKind: FallbackFailureKind | undefined,
): FallbackRoute {
  if (trace === undefined && failureKind === undefined) return route;

  return {
    ...route,
    ...(failureKind === undefined ? {} : { failureKind }),
    ...trace,
  };
}

function describeTargetKind(selection: TargetSelection): string {
  if (selection.kind === 'success') return 'success target';
  if (selection.kind === 'failure') return 'failure target';
  return 'fallback';
}

function collectTargets(profile: ModelProfile): readonly FallbackEdge[] {
  const edges: FallbackEdge[] = [];

  if (profile.fallback_target !== null) {
    edges.push({ source: profile, targetId: profile.fallback_target, kind: 'legacy' });
  }

  if (profile.onSuccessTarget !== undefined && profile.onSuccessTarget !== null) {
    edges.push({ source: profile, targetId: profile.onSuccessTarget, kind: 'success' });
  }

  if (typeof profile.onFailureTarget === 'string') {
    edges.push({
      source: profile,
      targetId: profile.onFailureTarget,
      kind: 'failure',
      failureKind: profile.failureKind,
    });
  } else if (isFailureTargets(profile.onFailureTarget)) {
    for (const [failureKind, targetId] of Object.entries(profile.onFailureTarget)) {
      if (targetId !== undefined) {
        edges.push({ source: profile, targetId, kind: 'failure', failureKind });
      }
    }
  }

  return edges;
}

function buildEdges(registry: ModelRegistry): readonly FallbackEdge[] {
  return registry.models.flatMap((profile) => collectTargets(profile));
}

function assertKnownTargets(registry: ModelRegistry, edges: readonly FallbackEdge[]): void {
  for (const edge of edges) {
    if (findModel(registry, edge.targetId) === undefined) {
      throw new Error(`fallback graph references missing ${edge.kind} target ${edge.targetId} from ${edge.source.id}`);
    }
  }
}

function assertScopesDoNotWiden(registry: ModelRegistry, edges: readonly FallbackEdge[]): void {
  for (const edge of edges) {
    const target = findModel(registry, edge.targetId);
    if (target === undefined) continue;

    const hasScopedEdge = edge.source.routeScope !== undefined || target.routeScope !== undefined;
    if (hasScopedEdge && edge.source.routeScope !== target.routeScope) {
      throw new Error(`fallback graph cross-scope route rejected from ${edge.source.id} to ${target.id}`);
    }
  }
}

function assertNoCycles(edges: readonly FallbackEdge[]): void {
  const adjacency = new Map<string, readonly string[]>();
  for (const edge of edges) {
    adjacency.set(edge.source.id, [...(adjacency.get(edge.source.id) ?? []), edge.targetId]);
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();

  function visit(modelId: string, path: readonly string[]): void {
    if (visiting.has(modelId)) {
      throw new Error(`fallback graph cycle detected: ${[...path, modelId].join(' -> ')}`);
    }

    if (visited.has(modelId)) return;

    visiting.add(modelId);
    for (const targetId of adjacency.get(modelId) ?? []) {
      visit(targetId, [...path, modelId]);
    }
    visiting.delete(modelId);
    visited.add(modelId);
  }

  for (const sourceId of adjacency.keys()) {
    visit(sourceId, []);
  }
}

function assertMaxHops(edges: readonly FallbackEdge[], maxHops: number): void {
  const adjacency = new Map<string, readonly string[]>();
  for (const edge of edges) {
    adjacency.set(edge.source.id, [...(adjacency.get(edge.source.id) ?? []), edge.targetId]);
  }

  function walk(sourceId: string, hopCount: number): void {
    if (hopCount > maxHops) {
      throw new Error(`fallback graph max-hop violation from ${sourceId}; allowed ${maxHops} hops`);
    }

    for (const targetId of adjacency.get(sourceId) ?? []) {
      walk(targetId, hopCount + 1);
    }
  }

  for (const sourceId of adjacency.keys()) {
    walk(sourceId, 0);
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/**
 * Validate fallback graph edges before any dispatch uses them.
 *
 * Checks missing targets, cycles, cross-scope edges, and configured hop limits
 * without mutating the registry.
 *
 * @param registry - The model registry with fallback configurations.
 * @param options - Validation limits for graph traversal.
 * @throws Error when the fallback graph is unsafe to dispatch.
 */
export function validateFallbackGraph(
  registry: ModelRegistry,
  options: FallbackGraphValidationOptions = {},
): void {
  const edges = buildEdges(registry);
  const maxHops = options.maxHops ?? DEFAULT_MAX_HOPS;

  assertKnownTargets(registry, edges);
  assertScopesDoNotWiden(registry, edges);
  assertNoCycles(edges);
  assertMaxHops(edges, maxHops);
}

/**
 * Create a router after validating configured fallback edges.
 *
 * @param registry - The model registry with fallback configurations.
 * @param options - Validation limits for graph traversal.
 * @returns A router bound to the validated registry.
 * @throws Error when the fallback graph is unsafe to dispatch.
 */
export function createFallbackRouter(
  registry: ModelRegistry,
  options: FallbackGraphValidationOptions = {},
): FallbackRouter {
  validateFallbackGraph(registry, options);

  return {
    resolve(
      failedModelId: string,
      approvedModelIds?: readonly string[],
      context?: FallbackRouteContext,
    ): FallbackRoute {
      return resolveFallback(failedModelId, registry, approvedModelIds, context);
    },
  };
}

/**
 * Resolve the fallback route when a model exhausts its quota pool.
 *
 * Checks whether the failed model has a configured fallback target in a
 * different quota pool and returns the appropriate route.
 *
 * The optional approval set closes the substitution gap: routing only ever
 * resolves to a model the caller approved. The configured `fallback_target` is
 * the approved route by definition, so the guard rejects only a target the
 * caller never sanctioned, and never the legitimate cross-pool fallback. When
 * the set is omitted, the configured target is treated as approved (existing
 * behavior), so this is additive.
 *
 * @param failedModelId - The model ID that failed.
 * @param registry - The model registry with fallback configurations.
 * @param approvedModelIds - Optional set of model IDs the caller approved; when
 *   provided, a target outside the set returns fail-fast instead of routing.
 * @param context - Optional typed route context for failure kind and trace data.
 * @returns A route indicating whether to fallback or fail-fast, with a reason.
 */
export function resolveFallback(
  failedModelId: string,
  registry: ModelRegistry,
  approvedModelIds?: readonly string[],
  context?: FallbackRouteContext,
): FallbackRoute {
  const trace = createTrace(failedModelId, context);
  const failedModel = findModel(registry, failedModelId);
  if (failedModel === undefined) {
    return withRouteMetadata(
      {
        action: 'fail-fast',
        reason: `unknown model ${failedModelId}; no quota pool available for fallback routing`,
      },
      trace,
      context?.failureKind,
    );
  }

  const selection = selectTarget(failedModel, context);
  if (selection.target === null) {
    return withRouteMetadata(
      {
        action: 'fail-fast',
        reason: `${failedModel.quota_pool} pool exhausted, no separate-pool fallback configured for ${failedModel.id}`,
      },
      trace,
      selection.failureKind,
    );
  }

  const targetModel = findModel(registry, selection.target);
  if (targetModel === undefined) {
    return withRouteMetadata(
      {
        action: 'fail-fast',
        reason: `${failedModel.quota_pool} pool exhausted, configured ${describeTargetKind(selection)} ${selection.target} is not in the registry`,
      },
      trace,
      selection.failureKind,
    );
  }

  if (targetModel.quota_pool === failedModel.quota_pool) {
    return withRouteMetadata(
      {
        action: 'fail-fast',
        reason: `${failedModel.quota_pool} pool exhausted, fallback target ${targetModel.id} shares the same pool; same-pool fallback rejected`,
      },
      trace,
      selection.failureKind,
    );
  }

  if (approvedModelIds !== undefined && !approvedModelIds.includes(targetModel.id)) {
    return withRouteMetadata(
      {
        action: 'fail-fast',
        reason: `${failedModel.quota_pool} pool exhausted, fallback target ${targetModel.id} is not in the caller-approved model set; unapproved substitution rejected`,
      },
      trace,
      selection.failureKind,
    );
  }

  return withRouteMetadata(
    {
      action: 'fallback',
      target: targetModel.id,
      reason: `${failedModel.quota_pool} pool exhausted, routing ${failedModel.id} to separate ${targetModel.quota_pool} pool target ${targetModel.id}`,
    },
    trace,
    selection.failureKind,
  );
}
