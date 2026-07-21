// ───────────────────────────────────────────────────────────────────
// MODULE: Stopping Clock Shadow Bridge
// ───────────────────────────────────────────────────────────────────

import type {
  LegacyConvergenceShadowResult,
  StoppingClockArbitrationResult,
} from './stopping-clock-types.js';

/** Pair shadow evidence with the exact legacy result object that remains authoritative. */
export function createStoppingClocksShadowResult<TLegacy>(
  authoritative: TLegacy,
  stoppingClocks: StoppingClockArbitrationResult,
): LegacyConvergenceShadowResult<TLegacy> {
  return Object.freeze({
    authority: 'legacy-convergence',
    authoritative,
    stopping_clocks_shadow: stoppingClocks,
  });
}
