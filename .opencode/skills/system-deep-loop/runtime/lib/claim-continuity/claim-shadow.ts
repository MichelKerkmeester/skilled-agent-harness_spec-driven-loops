// ───────────────────────────────────────────────────────────────────
// MODULE: Non-Authoritative Claim Shadow Comparison
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';

import type { ClaimContinuityRecord } from './claim-continuity-types.js';
import type {
  ClaimShadowComparison,
  LegacyClaimFindingSnapshot,
} from './claim-continuity-types.js';

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

/** Compare projections without changing the result returned by the legacy path. */
export function compareClaimShadow(
  legacy: LegacyClaimFindingSnapshot,
  shadow: ClaimContinuityRecord,
): ClaimShadowComparison {
  const divergentFields: string[] = [];
  if (legacy.lifecycle !== shadow.lifecycle) divergentFields.push('lifecycle');
  if (legacy.epistemic_status !== shadow.epistemic_status) {
    divergentFields.push('epistemic_status');
  }
  const body = {
    authority: 'legacy' as const,
    legacy_key_digest: digest({ legacy_key: legacy.legacy_key }),
    claim_ref: shadow.claim_ref,
    divergent_fields: divergentFields,
  };
  return Object.freeze({
    ...body,
    comparison_digest: digest(body),
  });
}

/** Bounded observer proves shadow work cannot replace a legacy return value. */
export class ClaimContinuityShadowObserver {
  readonly #capacity: number;
  readonly #comparisons: ClaimShadowComparison[] = [];

  public constructor(capacity = 256) {
    if (!Number.isSafeInteger(capacity) || capacity <= 0) {
      throw new TypeError('Shadow comparison capacity must be a positive integer');
    }
    this.#capacity = capacity;
  }

  public observe<TLegacy>(
    legacyResult: TLegacy,
    legacySnapshot: LegacyClaimFindingSnapshot,
    shadow: ClaimContinuityRecord,
  ): TLegacy {
    this.#comparisons.push(compareClaimShadow(legacySnapshot, shadow));
    if (this.#comparisons.length > this.#capacity) this.#comparisons.shift();
    return legacyResult;
  }

  public comparisons(): readonly ClaimShadowComparison[] {
    return Object.freeze([...this.#comparisons]);
  }
}
