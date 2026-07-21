// ───────────────────────────────────────────────────────────────────
// MODULE: Cross-Mode Legacy Parity Observation
// ───────────────────────────────────────────────────────────────────

import { ClosureResponsibilities } from './types.js';

import type { ClosureResponsibility } from './types.js';

/** Shipped surfaces remain executable inputs rather than copied authorities. */
export const LegacyParitySources = Object.freeze({
  [ClosureResponsibilities.EVIDENCE]: Object.freeze([
    'deep-loop/evidence-contract',
    'deep-loop/permissions-gate',
  ]),
  [ClosureResponsibilities.RECEIPTS_EFFECTS]: Object.freeze([
    'deep-loop/executor-audit',
    'deep-loop/receipt-crypto',
    'deep-loop/post-dispatch-validate',
    'deep-loop/atomic-state',
    'deep-loop/continuity-thread',
  ]),
  [ClosureResponsibilities.ADJUDICATION]: Object.freeze([
    'council/multi-seat-dispatch',
    'council/adjudicator-verdict-scoring',
    'council/convergence',
  ]),
  [ClosureResponsibilities.BUDGETS]: Object.freeze([
    'council/cost-guards',
  ]),
  [ClosureResponsibilities.PROJECTIONS]: Object.freeze([
    'shared/synthesis/resource-map',
  ]),
} as const satisfies Record<ClosureResponsibility, readonly string[]>);

/** Observable closure comparison that cannot replace the legacy result. */
export interface ShadowComparison<TShadow> {
  readonly status: 'matched' | 'diverged' | 'failed';
  readonly result: TShadow | null;
  readonly failure: string | null;
}

/** Additive-dark result retaining the legacy value as the only authority. */
export interface AdditiveDarkOutcome<TLegacy, TShadow> {
  readonly legacyAuthority: 'authoritative';
  readonly legacyResult: TLegacy;
  readonly shadow: Readonly<ShadowComparison<TShadow>>;
}

/** Observe closure parity while always returning the legacy result as authority. */
export async function compareAdditiveDark<TLegacy, TShadow>(
  legacyResult: TLegacy,
  runShadow: () => Promise<TShadow>,
  equivalent: (legacy: TLegacy, shadow: TShadow) => boolean,
): Promise<Readonly<AdditiveDarkOutcome<TLegacy, TShadow>>> {
  try {
    const result = await runShadow();
    return Object.freeze({
      legacyAuthority: 'authoritative',
      legacyResult,
      shadow: Object.freeze({
        status: equivalent(legacyResult, result)
          ? 'matched' as const
          : 'diverged' as const,
        result,
        failure: null,
      }),
    });
  } catch (error: unknown) {
    return Object.freeze({
      legacyAuthority: 'authoritative',
      legacyResult,
      shadow: Object.freeze({
        status: 'failed',
        result: null,
        failure: error instanceof Error ? error.message : String(error),
      }),
    });
  }
}
