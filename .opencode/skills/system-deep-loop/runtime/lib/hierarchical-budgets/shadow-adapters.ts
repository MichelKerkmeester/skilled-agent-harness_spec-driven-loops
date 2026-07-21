// ───────────────────────────────────────────────────────────────────
// MODULE: Hierarchical Budget Shadow Adapters
// ───────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';

import type {
  BudgetDecision,
  HierarchicalBudgetAuthority,
  ReserveBudgetInput,
} from './budget-authority.js';
import type { JsonObject } from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

interface LegacyGuardDecision {
  readonly continue_allowed: boolean;
  readonly stop_reasons: string[];
  readonly upper_bound: JsonObject;
}

interface LegacyFanOutModule {
  readonly evaluateLineageBudgetCap: (input: JsonObject) => LegacyGuardDecision;
  readonly evaluateAggregateBudgetCap: (input: JsonObject) => LegacyGuardDecision;
}

interface LegacyCouncilModule {
  readonly evaluateCouncilCostGuards: (input: JsonObject) => LegacyGuardDecision;
}

export interface FanOutShadowInput {
  readonly reservation: ReserveBudgetInput;
  readonly lineage: JsonObject;
  readonly guards?: JsonObject;
  readonly maxRetries?: number;
}

export interface FanOutAggregateBaselineInput {
  readonly lineages: JsonObject[];
  readonly guards?: JsonObject;
  readonly maxRetries?: number;
}

export interface DarkAdmissionComparison {
  readonly authority: 'legacy';
  readonly authoritativeDispatchAllowed: boolean;
  readonly legacyDecision: Readonly<LegacyGuardDecision>;
  readonly budgetDecision: BudgetDecision | null;
  readonly parity: 'match' | 'typed-accounting-delta' | 'legacy-denied';
  readonly shadowStopReason: 'incomplete-budget-exhausted' | null;
  readonly converged: false;
}

// ───────────────────────────────────────────────────────────────────
// 2. LEGACY BASELINES
// ───────────────────────────────────────────────────────────────────

const require = createRequire(import.meta.url);
const legacyFanOut = require('../../scripts/fanout-run.cjs') as LegacyFanOutModule;
const legacyCouncil = require('../council/cost-guards.cjs') as LegacyCouncilModule;

/** Evaluate the shipped aggregate fan-out ceiling without changing its authority. */
export function evaluateLegacyFanOutAggregate(
  input: FanOutAggregateBaselineInput,
): LegacyGuardDecision {
  return legacyFanOut.evaluateAggregateBudgetCap({
    lineages: input.lineages,
    guards: input.guards ?? {},
    maxRetries: input.maxRetries ?? 0,
  });
}

/** Evaluate the shipped council stop tuple for shadow-parity evidence. */
export function evaluateLegacyCouncilGuard(input: JsonObject): LegacyGuardDecision {
  return legacyCouncil.evaluateCouncilCostGuards(input);
}

// ───────────────────────────────────────────────────────────────────
// 3. SHADOW CONSUMERS
// ───────────────────────────────────────────────────────────────────

/** Share budget admission with fan-out while leaving the legacy result canonical. */
export class FanOutBudgetShadowAdapter {
  readonly #authority: HierarchicalBudgetAuthority;

  public constructor(authority: HierarchicalBudgetAuthority) {
    this.#authority = authority;
  }

  /** Compare one legacy lineage decision with the dark typed admission result. */
  public async admit(input: FanOutShadowInput): Promise<DarkAdmissionComparison> {
    const legacyDecision = legacyFanOut.evaluateLineageBudgetCap({
      lineage: input.lineage,
      guards: input.guards ?? {},
      maxRetries: input.maxRetries ?? 0,
    });
    if (!legacyDecision.continue_allowed) {
      return Object.freeze({
        authority: 'legacy',
        authoritativeDispatchAllowed: false,
        legacyDecision,
        budgetDecision: null,
        parity: 'legacy-denied',
        shadowStopReason: null,
        converged: false,
      });
    }

    const budgetResult = await this.#authority.admit(input.reservation);
    const isMatch = budgetResult.decision.dispatchAllowed;
    return Object.freeze({
      authority: 'legacy',
      authoritativeDispatchAllowed: true,
      legacyDecision,
      budgetDecision: budgetResult.decision,
      parity: isMatch ? 'match' : 'typed-accounting-delta',
      shadowStopReason: isMatch ? null : 'incomplete-budget-exhausted',
      converged: false,
    });
  }
}

/** Share the same admission call with convergence without redefining exhaustion. */
export class ValueOfComputationBudgetShadowAdapter {
  readonly #authority: HierarchicalBudgetAuthority;

  public constructor(authority: HierarchicalBudgetAuthority) {
    this.#authority = authority;
  }

  /** Return the legacy continuation decision plus a non-authoritative budget comparison. */
  public async admit(
    legacyShouldContinue: boolean,
    reservation: ReserveBudgetInput,
  ): Promise<Readonly<{
    authority: 'legacy';
    authoritativeSampleAllowed: boolean;
    budgetDecision: BudgetDecision | null;
    shadowStopReason: 'incomplete-budget-exhausted' | null;
    converged: false;
  }>> {
    if (!legacyShouldContinue) {
      return Object.freeze({
        authority: 'legacy',
        authoritativeSampleAllowed: false,
        budgetDecision: null,
        shadowStopReason: null,
        converged: false,
      });
    }
    const budgetResult = await this.#authority.admit(reservation);
    return Object.freeze({
      authority: 'legacy',
      authoritativeSampleAllowed: true,
      budgetDecision: budgetResult.decision,
      shadowStopReason: budgetResult.decision.dispatchAllowed
        ? null
        : 'incomplete-budget-exhausted',
      converged: false,
    });
  }
}
