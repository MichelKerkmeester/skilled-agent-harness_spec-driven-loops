// ───────────────────────────────────────────────────────────────────
// MODULE: Cross-Mode Evidence Closure
// ───────────────────────────────────────────────────────────────────

import { validateEvidenceContract } from '../deep-loop/evidence-contract.js';
import { ClosureOwnerIds } from './types.js';
import { cloneFrozenJson, eventIdentity, verifySealedInputs } from './internal.js';

import type {
  EvidenceClaimClass,
  EvidenceContractValidation,
  EvidenceScopeState,
} from '../deep-loop/evidence-contract.js';
import type { JsonObject } from '../event-envelope/index.js';
import type { CrossModeClosureContext } from './types.js';

/** Mode evidence and shared metadata accepted by the evidence owner. */
export interface EvidenceNormalizationInput {
  readonly rawEvidence: Readonly<JsonObject>;
  readonly claimClass: EvidenceClaimClass;
  readonly wouldConfirm: string;
  readonly gateDelta: string;
  readonly scopeState: EvidenceScopeState;
  readonly childResultVerified: boolean;
  readonly provenance: Readonly<JsonObject>;
}

/** Evidence result retaining the complete mode payload and attached proof context. */
export interface NormalizedEvidence {
  readonly ownerId: typeof ClosureOwnerIds.evidence;
  readonly validation: EvidenceContractValidation;
  readonly rawEvidence: Readonly<JsonObject>;
  readonly contract: Readonly<JsonObject>;
  readonly sealedReferenceDigests: readonly string[];
  readonly provenance: Readonly<JsonObject>;
}

/** Attach shared proof metadata without interpreting mode-owned evidence. */
export async function normalizeEvidence(
  context: CrossModeClosureContext,
  input: Readonly<EvidenceNormalizationInput>,
): Promise<Readonly<NormalizedEvidence>> {
  const sealedReferenceDigests = await verifySealedInputs(context);
  const contract = cloneFrozenJson({
    claim_class: input.claimClass,
    would_confirm: input.wouldConfirm,
    gate_delta: input.gateDelta,
    scope_state: input.scopeState,
    child_result_verified: input.childResultVerified,
  });
  return Object.freeze({
    ownerId: ClosureOwnerIds.evidence,
    validation: Object.freeze(validateEvidenceContract(contract)),
    rawEvidence: cloneFrozenJson(input.rawEvidence),
    contract,
    sealedReferenceDigests,
    provenance: cloneFrozenJson({
      ...input.provenance,
      mode_identity: context.modeIdentity,
      ...eventIdentity(context),
    }),
  });
}
