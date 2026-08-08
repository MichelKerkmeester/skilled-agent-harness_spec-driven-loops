// ───────────────────────────────────────────────────────────────────
// MODULE: Shared Ownership Composition
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Minimal model identity used by the ownership boundary predicates. */
export type OwnershipModel = {
  /** Provider namespace for the model. */
  provider: string;
  /** Provider-local model identifier. */
  id: string;
};

/** Expected ownership sets used to exercise both extension boundaries. */
export type OwnershipFixture = {
  /** Models that belong to the DeepPi extension. */
  owned: readonly OwnershipModel[];
  /** Models that belong to the Pi Cache Optimizer extension. */
  excluded: readonly OwnershipModel[];
};

/** Classifies whether an extension claims a model. */
export type OwnershipBoundaryPredicate = (model: OwnershipModel) => boolean;

/** Result of comparing the expected owner with all predicates that claim a model. */
export type OwnershipResult = {
  /** Stable provider/model key used in assertion messages. */
  modelId: string;
  /** Owner declared by the shared fixture. */
  expectedOwner: 'deep-pi' | 'pi-cache-optimizer';
  /** Owners returned by the supplied boundary predicates. */
  actualOwners: string[];
};

// ───────────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/**
 * Compose ownership results from both extension boundary predicates.
 *
 * @param fixture - Expected ownership sets for the supported model identities.
 * @param deepPiPredicate - Predicate that claims models for DeepPi.
 * @param cacheOptimizerPredicate - Predicate that claims models for Pi Cache Optimizer.
 * @returns One result per fixture model, including every predicate that claims it.
 */
export function composeOneOwner(
  fixture: OwnershipFixture,
  deepPiPredicate: OwnershipBoundaryPredicate,
  cacheOptimizerPredicate: OwnershipBoundaryPredicate,
): OwnershipResult[] {
  const cases = [
    ...fixture.owned.map((model) => ({ model, expectedOwner: 'deep-pi' as const })),
    ...fixture.excluded.map((model) => ({ model, expectedOwner: 'pi-cache-optimizer' as const })),
  ];

  return cases.map(({ model, expectedOwner }) => {
    // Treat the optimizer predicate as a veto so only one extension reacts to each model.
    const actualOwners = [
      ...(deepPiPredicate(model) ? ['deep-pi'] : []),
      ...(!cacheOptimizerPredicate(model) ? ['pi-cache-optimizer'] : []),
    ];
    return {
      modelId: `${model.provider}/${model.id}`,
      expectedOwner,
      actualOwners,
    };
  });
}
