// ---------------------------------------------------------------
// MODULE: Dynamic Token Budget Allocation
// Adjusts returned context size by query complexity tier (Sprint 3, T007)
// ---------------------------------------------------------------

import { type QueryComplexityTier } from './query-classifier';

/* -----------------------------------------------------------
   1. TYPES & CONSTANTS
----------------------------------------------------------------*/

/** Budget (in tokens) allocated per complexity tier. */
interface TokenBudgetConfig {
  /** Simple query budget: 1500 tokens. */
  simple: number;
  /** Moderate query budget: 2500 tokens. */
  moderate: number;
  /** Complex query budget: 4000 tokens. */
  complex: number;
}

/** Result of a token budget lookup. */
interface BudgetResult {
  /** The complexity tier that determined the budget. */
  tier: QueryComplexityTier;
  /** The allocated token budget. */
  budget: number;
  /** Whether the dynamic flag was active (false = default fallback used). */
  applied: boolean;
}

/** Default budget when the feature flag is disabled — treat everything as complex. */
const DEFAULT_BUDGET = 4000;

/** Default tier-to-budget mapping when dynamic allocation is enabled. */
const DEFAULT_TOKEN_BUDGET_CONFIG: TokenBudgetConfig = {
  simple: 1500,
  moderate: 2500,
  complex: 4000,
};

/* -----------------------------------------------------------
   2. FEATURE FLAG
----------------------------------------------------------------*/

/**
 * Check whether dynamic token budget allocation is enabled.
 * Default: DISABLED. Only enabled when SPECKIT_DYNAMIC_TOKEN_BUDGET is explicitly "true".
 */
function isDynamicTokenBudgetEnabled(): boolean {
  const raw = process.env.SPECKIT_DYNAMIC_TOKEN_BUDGET?.toLowerCase()?.trim();
  return raw === 'true';
}

/* -----------------------------------------------------------
   3. BUDGET RESOLUTION
----------------------------------------------------------------*/

/**
 * Get the token budget for a given query complexity tier.
 *
 * When SPECKIT_DYNAMIC_TOKEN_BUDGET is disabled (default), returns the DEFAULT_BUDGET
 * (4000) for all queries regardless of tier, with applied=false.
 *
 * When enabled, maps tier to the configured budget:
 *   simple   → 1500 tokens
 *   moderate → 2500 tokens
 *   complex  → 4000 tokens
 *
 * @param tier   - The complexity tier from the query classifier
 * @param config - Optional custom budget config (overrides DEFAULT_TOKEN_BUDGET_CONFIG)
 * @returns BudgetResult with tier, budget, and applied flag
 */
function getTokenBudget(
  tier: QueryComplexityTier,
  config?: TokenBudgetConfig,
): BudgetResult {
  // Feature flag gate: return default when disabled
  if (!isDynamicTokenBudgetEnabled()) {
    return {
      tier,
      budget: DEFAULT_BUDGET,
      applied: false,
    };
  }

  const effectiveConfig = config ?? DEFAULT_TOKEN_BUDGET_CONFIG;
  const budget = effectiveConfig[tier] ?? DEFAULT_BUDGET;

  return {
    tier,
    budget,
    applied: true,
  };
}

/* -----------------------------------------------------------
   4. EXPORTS
----------------------------------------------------------------*/

export {
  // Types
  type TokenBudgetConfig,
  type BudgetResult,

  // Constants
  DEFAULT_BUDGET,
  DEFAULT_TOKEN_BUDGET_CONFIG,

  // Functions
  getTokenBudget,
  isDynamicTokenBudgetEnabled,
};
