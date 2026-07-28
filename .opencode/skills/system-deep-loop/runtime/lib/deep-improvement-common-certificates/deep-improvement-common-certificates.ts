// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Certificates and Receipts
// ───────────────────────────────────────────────────────────────────

import { AppendOnlyLedger } from '../authorized-ledger/index.js';
import {
  DeepImprovementCommonWireEventTypes,
} from '../deep-improvement-common-ledger-schema/index.js';
import {
  deepImprovementCommonProjectionIntegrityDigest,
  foldDeepImprovementCommonEvents,
} from '../deep-improvement-common-reducers/index.js';
import {
  DeepImprovementArtifactReadError,
  DeepImprovementArtifactReadFailureCodes,
  DeepImprovementCommonArtifactKinds,
  readDeepImprovementCommonArtifact,
} from '../deep-improvement-common-sealed-artifacts/index.js';
import { canonicalBytes, canonicalJson, sha256Bytes } from '../event-envelope/index.js';
import {
  certifyBoundaryReceipt,
  verifyBoundaryReceiptCertification,
} from '../receipts-and-effect-recovery/index.js';
import { deriveReplayFingerprint } from '../replay-fingerprint/index.js';
import {
  SealedArtifactError,
  SealedArtifactErrorCodes,
} from '../sealed-reference-artifacts/index.js';
import {
  DeepImprovementCommonCertificateError,
  DeepImprovementCommonCertificateFailureCodes,
  DeepImprovementCommonTransitionKinds,
} from './deep-improvement-common-certificate-types.js';
import {
  parseDeepImprovementCommonCertificateBundle,
  parseDeepImprovementCommonRunCertificate,
  parseDeepImprovementCommonTransitionReceipt,
} from './deep-improvement-common-certificate-validation.js';

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type {
  DeepImprovementCommonEventStem,
  DeepImprovementCommonLedgerEvent,
} from '../deep-improvement-common-ledger-schema/index.js';
import type {
  DeepImprovementCommonProjectionState,
} from '../deep-improvement-common-reducers/index.js';
import type {
  DeepImprovementCommonArtifactKind,
  DeepImprovementCommonArtifactMaterial,
  DeepImprovementCommonSealedArtifactBinding,
  DeepImprovementVerifiedSealedArtifact,
  DeepImprovementEvaluatorCapsuleMaterial,
  DeepImprovementPromotionEvidenceMaterial,
} from '../deep-improvement-common-sealed-artifacts/index.js';
import type {
  BoundaryKind,
  BoundaryReceiptPayload,
  BoundaryScope,
  CertificationProfile,
  CertificationProviderRegistry,
  LedgerHeadFacts,
} from '../receipts-and-effect-recovery/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type {
  DeepImprovementCommonCertificateArtifactClaim,
  DeepImprovementCommonCertificateBundle,
  DeepImprovementCommonCertificateFailureCode,
  DeepImprovementCommonCertificateIssuerInput,
  DeepImprovementCommonCertificateVerdict,
  DeepImprovementCommonNamedDigestClosureRule,
  DeepImprovementCommonOfflineVerificationFailure,
  DeepImprovementCommonOfflineVerificationInput,
  DeepImprovementCommonOfflineVerificationResult,
  DeepImprovementCommonReceiptIdentity,
  DeepImprovementCommonRunCertificate,
  DeepImprovementCommonRunCertificateBody,
  DeepImprovementCommonTransitionKind,
  DeepImprovementCommonTransitionOutcome,
  DeepImprovementCommonTransitionReceipt,
  DeepImprovementCommonTransitionReceiptContext,
  DeepImprovementCommonTransitionReceiptFacts,
  DeepImprovementCommonTransitionReceiptInput,
} from './deep-improvement-common-certificate-types.js';

export const DEEP_IMPROVEMENT_COMMON_CERTIFICATE_VERSION = 1 as const;
export const DEEP_IMPROVEMENT_COMMON_RECEIPT_VERSION = 1 as const;

export const DEEP_IMPROVEMENT_COMMON_REQUIRED_TRANSITION_ORDER = Object.freeze([
  DeepImprovementCommonTransitionKinds.CANDIDATE_GENERATED,
  DeepImprovementCommonTransitionKinds.EVALUATOR_EPOCH_ESTABLISHED,
  DeepImprovementCommonTransitionKinds.EVALUATION_STARTED,
  DeepImprovementCommonTransitionKinds.CANDIDATE_SCORED,
  DeepImprovementCommonTransitionKinds.CANARY_CHECKED,
  DeepImprovementCommonTransitionKinds.PROMOTION_PROPOSED,
] as const);

export const DEEP_IMPROVEMENT_COMMON_NAMED_DIGEST_CLOSURE_RULES = Object.freeze([
  Object.freeze({
    containingArtifactKind: DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE,
    field: 'unresolvedEvidenceDigests[]',
    expectedArtifactKind: DeepImprovementCommonArtifactKinds.RAW_TRIAL_OUTPUT,
  }),
  Object.freeze({
    containingArtifactKind: DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE,
    field: 'vetoEvidenceDigests[]',
    expectedArtifactKind: DeepImprovementCommonArtifactKinds.RAW_TRIAL_OUTPUT,
  }),
] as const satisfies readonly DeepImprovementCommonNamedDigestClosureRule[]);

export const DEEP_IMPROVEMENT_COMMON_SHARED_CERTIFICATE_CONTRACT = Object.freeze({
  contractId: 'deep-improvement-common-certificates',
  contractVersion: 1,
  certificateVersion: DEEP_IMPROVEMENT_COMMON_CERTIFICATE_VERSION,
  receiptVersion: DEEP_IMPROVEMENT_COMMON_RECEIPT_VERSION,
  receiptIdentityVersion: 1,
  authority: 'dark-evidence-only',
  owner: 'deep-improvement-common',
  consumers: Object.freeze([
    'deep-improvement-common',
    'agent-improvement',
    'model-benchmark',
    'skill-benchmark',
  ]),
} as const);

const TRANSITION_EVENTS: Readonly<Record<
  DeepImprovementCommonTransitionKind,
  ReadonlySet<string>
>> = Object.freeze({
  'evaluator-epoch-established': new Set([
    DeepImprovementCommonWireEventTypes['deep_improvement_common.evaluation_epoch_sealed'],
  ]),
  'candidate-generated': new Set([
    DeepImprovementCommonWireEventTypes['deep_improvement_common.candidate_generated'],
  ]),
  'evaluation-started': new Set([
    DeepImprovementCommonWireEventTypes['deep_improvement_common.evaluation_started'],
  ]),
  'candidate-scored': new Set([
    DeepImprovementCommonWireEventTypes['deep_improvement_common.evaluation_normalized'],
    DeepImprovementCommonWireEventTypes['deep_improvement_common.evaluation_inconclusive'],
    DeepImprovementCommonWireEventTypes['deep_improvement_common.evaluation_failed'],
  ]),
  'canary-checked': new Set([
    DeepImprovementCommonWireEventTypes['deep_improvement_common.canary_gate_passed'],
    DeepImprovementCommonWireEventTypes['deep_improvement_common.canary_gate_failed'],
    DeepImprovementCommonWireEventTypes['deep_improvement_common.canary_vetoed'],
  ]),
  'promotion-proposed': new Set([
    DeepImprovementCommonWireEventTypes['deep_improvement_common.promotion_proposed'],
  ]),
  'promotion-authorized': new Set([
    DeepImprovementCommonWireEventTypes['deep_improvement_common.promotion_authorized'],
  ]),
  'promotion-blocked': new Set([
    DeepImprovementCommonWireEventTypes['deep_improvement_common.promotion_denied'],
  ]),
  'guarded-promotion': new Set([
    DeepImprovementCommonWireEventTypes['deep_improvement_common.promotion_shadow_started'],
    DeepImprovementCommonWireEventTypes['deep_improvement_common.promotion_canary_started'],
    DeepImprovementCommonWireEventTypes['deep_improvement_common.promotion_completed'],
  ]),
  aborted: new Set([
    DeepImprovementCommonWireEventTypes['deep_improvement_common.promotion_aborted'],
    DeepImprovementCommonWireEventTypes['deep_improvement_common.run_aborted'],
  ]),
  restored: new Set([
    DeepImprovementCommonWireEventTypes[
      'deep_improvement_common.promotion_baseline_restored'
    ],
  ]),
});

const TRANSITION_BOUNDARIES: Readonly<Record<
  DeepImprovementCommonTransitionKind,
  Readonly<{
    kind: BoundaryKind;
    scope: BoundaryScope;
    fromState: string;
    toState: string;
  }>
>> = Object.freeze({
  'evaluator-epoch-established': Object.freeze({
    kind: 'phase-enter', scope: 'phase', fromState: 'active', toState: 'awaiting-evaluation',
  }),
  'candidate-generated': Object.freeze({
    kind: 'phase-handoff', scope: 'phase', fromState: 'proposed', toState: 'generated',
  }),
  'evaluation-started': Object.freeze({
    kind: 'phase-enter', scope: 'phase', fromState: 'generated', toState: 'evaluating',
  }),
  'candidate-scored': Object.freeze({
    kind: 'phase-completion', scope: 'phase', fromState: 'evaluating', toState: 'scored',
  }),
  'canary-checked': Object.freeze({
    kind: 'phase-completion', scope: 'phase', fromState: 'sealed', toState: 'evaluated',
  }),
  'promotion-proposed': Object.freeze({
    kind: 'phase-handoff', scope: 'phase', fromState: 'evaluated', toState: 'promotion-proposed',
  }),
  'promotion-authorized': Object.freeze({
    kind: 'phase-completion', scope: 'phase', fromState: 'promotion-proposed', toState: 'authorized',
  }),
  'promotion-blocked': Object.freeze({
    kind: 'phase-abort', scope: 'phase', fromState: 'promotion-proposed', toState: 'blocked',
  }),
  'guarded-promotion': Object.freeze({
    kind: 'mode-completion', scope: 'mode', fromState: 'authorized', toState: 'completed',
  }),
  aborted: Object.freeze({
    kind: 'mode-abort', scope: 'mode', fromState: 'active', toState: 'aborted',
  }),
  restored: Object.freeze({
    kind: 'mode-handoff', scope: 'mode', fromState: 'aborted', toState: 'rolled-back',
  }),
});

interface ArtifactEvidence {
  readonly claim: DeepImprovementCommonCertificateArtifactClaim;
  readonly material: DeepImprovementCommonArtifactMaterial;
}

interface VerifiedArtifactSet {
  readonly claims: readonly DeepImprovementCommonCertificateArtifactClaim[];
  readonly byQualifiedDigest: ReadonlyMap<string, ArtifactEvidence>;
  readonly byContentDigest: ReadonlyMap<string, readonly ArtifactEvidence[]>;
}

function asJson(value: unknown): JsonObject {
  return value as JsonObject;
}

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(asJson(value)));
}

function contentDigest(qualifiedDigest: string): string {
  const separator = qualifiedDigest.indexOf(':');
  return separator < 0 ? qualifiedDigest : qualifiedDigest.slice(separator + 1);
}

function eventPayload(event: VerifiedLedgerEvent): Readonly<Record<string, unknown>> {
  return event.event.effective.envelope.payload as Readonly<Record<string, unknown>>;
}

function eventData(event: VerifiedLedgerEvent): Readonly<Record<string, unknown>> {
  const data = eventPayload(event).data;
  if (data === null || Array.isArray(data) || typeof data !== 'object') {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.LEDGER_INVALID,
      `event:${event.frame.sequence}`,
      'Authorized transition event has no closed data object',
    );
  }
  return data as Readonly<Record<string, unknown>>;
}

function eventStem(event: VerifiedLedgerEvent): DeepImprovementCommonEventStem {
  const stem = eventPayload(event).stem;
  if (typeof stem !== 'string') {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.LEDGER_INVALID,
      `event:${event.frame.sequence}`,
      'Authorized transition event has no typed stem',
    );
  }
  return stem as DeepImprovementCommonEventStem;
}

function findEvent(
  events: readonly VerifiedLedgerEvent[],
  eventId: string,
): VerifiedLedgerEvent {
  const matches = events.filter((event) => (
    event.event.effective.envelope.event_id === eventId
  ));
  if (matches.length !== 1) {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.AUTHORIZATION_INVALID,
      `event:${eventId}`,
      'A transition result must resolve exactly once in the verified authorized ledger',
    );
  }
  return matches[0] as VerifiedLedgerEvent;
}

function assertProjectionMatchesLedger(
  projectionEvents: readonly DeepImprovementCommonLedgerEvent[],
  ledgerEvents: readonly VerifiedLedgerEvent[],
): void {
  const verified = ledgerEvents.map((event) => event.event.effective.envelope);
  if (canonicalJson(asJson(projectionEvents)) !== canonicalJson(asJson(verified))) {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.PROJECTION_INVALID,
      'projection:ledger-events',
      'Projection events differ from the ordered authorized-ledger replay range',
      digest(verified),
      digest(projectionEvents),
    );
  }
}

function outcomeFor(
  transitionKind: DeepImprovementCommonTransitionKind,
  event: VerifiedLedgerEvent,
): DeepImprovementCommonTransitionOutcome {
  const type = event.event.effective.envelope.event_type;
  if (!TRANSITION_EVENTS[transitionKind].has(type)) {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.TRANSITION_INVALID,
      `transition:${transitionKind}`,
      'Transition kind does not match its authorized result event type',
    );
  }
  if (
    type === DeepImprovementCommonWireEventTypes['deep_improvement_common.canary_gate_failed']
    || type === DeepImprovementCommonWireEventTypes['deep_improvement_common.canary_vetoed']
    || type === DeepImprovementCommonWireEventTypes['deep_improvement_common.promotion_denied']
  ) return 'vetoed';
  if (
    type === DeepImprovementCommonWireEventTypes[
      'deep_improvement_common.evaluation_inconclusive'
    ]
  ) return 'uncertain';
  if (
    type === DeepImprovementCommonWireEventTypes['deep_improvement_common.evaluation_failed']
    && eventData(event).retryable === true
  ) return 'uncertain';
  if (
    type === DeepImprovementCommonWireEventTypes[
      'deep_improvement_common.promotion_baseline_restored'
    ]
  ) return 'recovered';
  return 'completed';
}

function head(
  ledgerId: string,
  sequence: number,
  recordHash: string,
): LedgerHeadFacts {
  return Object.freeze({
    ledger_id: ledgerId,
    sequence,
    record_hash: recordHash,
  });
}

function unsignedSharedReceipt(
  facts: DeepImprovementCommonTransitionReceiptFacts,
  receiptDigest: string,
  issuer: string,
  issuedAt: string,
): Omit<BoundaryReceiptPayload, 'certification'> {
  const boundary = TRANSITION_BOUNDARIES[facts.transitionKind];
  const fromHead = head(
    'authorized-ledger',
    Math.max(0, facts.attemptNumber - 1),
    facts.fromHeadHash,
  );
  const resultHead = head(
    'authorized-ledger',
    facts.attemptNumber,
    facts.resultHeadHash,
  );
  return Object.freeze({
    receipt_id: `dic-receipt:${facts.identity.digest}`,
    boundary_id: `dic-boundary:${facts.identity.digest}`,
    boundary_kind: boundary.kind,
    scope: boundary.scope,
    scope_id: facts.runId,
    from_state: boundary.fromState,
    to_state: boundary.toState,
    from_head: fromHead,
    result_head: resultHead,
    result_event_id: facts.resultEventId,
    result_event_type: facts.resultEventType,
    result_event_digest: facts.resultEventDigest,
    result_code: facts.outcome,
    evidence_digest: receiptDigest,
    artifact_digests: [
      ...facts.inputArtifactQualifiedDigests,
      ...facts.outputArtifactQualifiedDigests,
      ...facts.evidenceArtifactQualifiedDigests,
    ].map(contentDigest),
    replay_fingerprint: facts.replayFingerprint,
    authority_epoch: facts.authorityEpoch,
    correlation_id: facts.runId,
    causation_id: facts.resultEventId,
    issuer,
    issued_at: issuedAt,
    idempotency_key: `dic-receipt:v1:${facts.identity.digest}`,
  });
}

function profileFromReceipt(receipt: BoundaryReceiptPayload): CertificationProfile {
  return Object.freeze({
    scheme: receipt.certification.scheme,
    provider_id: receipt.certification.provider_id,
    key_id: receipt.certification.key_id,
    verifier_version: receipt.certification.verifier_version,
    trust_scope: receipt.certification.trust_scope,
  });
}

async function certifyShared(
  unsigned: Omit<BoundaryReceiptPayload, 'certification'>,
  profile: CertificationProfile,
  providers: CertificationProviderRegistry,
): Promise<BoundaryReceiptPayload> {
  const certification = await certifyBoundaryReceipt(unsigned, profile, providers);
  return Object.freeze({ ...unsigned, certification }) as BoundaryReceiptPayload;
}

async function verifyShared(
  actual: BoundaryReceiptPayload,
  expected: Omit<BoundaryReceiptPayload, 'certification'>,
  providers: CertificationProviderRegistry,
  location: string,
): Promise<void> {
  const { certification: _certification, ...unsigned } = actual;
  if (canonicalJson(unsigned) !== canonicalJson(expected)) {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.CERTIFICATION_INVALID,
      location,
      'Shared certification receipt does not bind the recomputed facts',
      digest(expected),
      digest(unsigned),
    );
  }
  await verifyBoundaryReceiptCertification(actual, providers, true);
}

/** Derive the stable identity reused by all three improvement variants. */
export function deriveDeepImprovementCommonReceiptIdentity(
  runId: string,
  input: Pick<
    DeepImprovementCommonTransitionReceiptInput,
    'transitionKind' | 'logicalOperationId' | 'effectIdempotencyKey'
  >,
): DeepImprovementCommonReceiptIdentity {
  const core = Object.freeze({
    identityVersion: 1 as const,
    runId,
    transitionKind: input.transitionKind,
    logicalOperationId: input.logicalOperationId,
    effectIdempotencyKey: input.effectIdempotencyKey,
  });
  return Object.freeze({ ...core, digest: digest(core) });
}

function referencesForReceipt(
  input: DeepImprovementCommonTransitionReceiptInput,
): readonly string[] {
  return [
    ...input.inputArtifactQualifiedDigests,
    ...input.outputArtifactQualifiedDigests,
    ...input.evidenceArtifactQualifiedDigests,
  ];
}

function assertReceiptReferences(
  input: DeepImprovementCommonTransitionReceiptInput,
  artifacts: VerifiedArtifactSet,
): void {
  const references = referencesForReceipt(input);
  if (new Set(references).size !== references.length) {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      `transition:${input.transitionKind}:artifacts`,
      'A receipt cannot reuse one artifact identity across input, output, and evidence roles',
    );
  }
  for (const reference of references) {
    if (!artifacts.byQualifiedDigest.has(reference)) {
      throw new DeepImprovementCommonCertificateError(
        DeepImprovementCommonCertificateFailureCodes.ARTIFACT_MISSING,
        `transition:${input.transitionKind}:artifacts`,
        'Receipt references an artifact outside the verified run closure',
      );
    }
  }
}

function buildTransitionFacts(
  input: DeepImprovementCommonTransitionReceiptInput,
  context: {
    readonly runId: string;
    readonly replayFingerprint: string;
    readonly priorReceipts: readonly DeepImprovementCommonTransitionReceipt[];
    readonly ledgerEvents: readonly VerifiedLedgerEvent[];
    readonly artifacts: VerifiedArtifactSet;
    readonly serviceVersion: string;
  },
): DeepImprovementCommonTransitionReceiptFacts {
  assertReceiptReferences(input, context.artifacts);
  const resultEvent = findEvent(context.ledgerEvents, input.resultEventId);
  const envelope = resultEvent.event.effective.envelope;
  const identity = deriveDeepImprovementCommonReceiptIdentity(context.runId, input);
  const predecessors = context.priorReceipts.length === 0
    ? []
    : [context.priorReceipts.at(-1) as DeepImprovementCommonTransitionReceipt];
  const predecessor = predecessors[0];
  if (predecessor !== undefined) {
    const predecessorEvent = findEvent(context.ledgerEvents, predecessor.facts.resultEventId);
    if (predecessorEvent.frame.sequence >= resultEvent.frame.sequence) {
      throw new DeepImprovementCommonCertificateError(
        DeepImprovementCommonCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
        `transition:${input.transitionKind}:predecessor`,
        'Receipt predecessor must name an earlier authorized ledger transition',
      );
    }
  }
  const transitionCore = Object.freeze({
    identity: identity.digest,
    predecessorReceiptIdentities: predecessors.map((receipt) => receipt.facts.identity.digest),
    predecessorReceiptDigests: predecessors.map((receipt) => receipt.receiptDigest),
    resultEventDigest: resultEvent.event.stored.digest,
    authorizationDecisionDigest: resultEvent.frame.authorization_ref.decision_digest,
    inputArtifactQualifiedDigests: input.inputArtifactQualifiedDigests,
    outputArtifactQualifiedDigests: input.outputArtifactQualifiedDigests,
    evidenceArtifactQualifiedDigests: input.evidenceArtifactQualifiedDigests,
    replayFingerprint: context.replayFingerprint,
  });
  const outcome = outcomeFor(input.transitionKind, resultEvent);
  return Object.freeze({
    receiptVersion: DEEP_IMPROVEMENT_COMMON_RECEIPT_VERSION,
    identity,
    predecessorReceiptIdentities: Object.freeze(predecessors.map((receipt) => receipt.facts.identity)),
    predecessorReceiptDigests: Object.freeze(predecessors.map((receipt) => receipt.receiptDigest)),
    runId: context.runId,
    transitionKind: input.transitionKind,
    logicalOperationId: input.logicalOperationId,
    effectIdempotencyKey: input.effectIdempotencyKey,
    attemptNumber: input.attemptNumber,
    resultEventId: input.resultEventId,
    resultEventType: envelope.event_type,
    resultEventDigest: resultEvent.event.stored.digest,
    authorizationDecisionDigest: resultEvent.frame.authorization_ref.decision_digest,
    fromHeadHash: resultEvent.frame.prev_record_hash,
    resultHeadHash: resultEvent.frame.record_hash,
    inputArtifactQualifiedDigests: Object.freeze([...input.inputArtifactQualifiedDigests]),
    outputArtifactQualifiedDigests: Object.freeze([...input.outputArtifactQualifiedDigests]),
    evidenceArtifactQualifiedDigests: Object.freeze([...input.evidenceArtifactQualifiedDigests]),
    outcome,
    uncertaintyState: outcome === 'uncertain' ? 'unknown-effect' : 'known',
    serviceVersion: context.serviceVersion,
    replayFingerprint: context.replayFingerprint,
    transitionFingerprint: digest(transitionCore),
    authorityEpoch: envelope.authority_epoch,
  });
}

async function verifiedArtifactSet(
  store: DeepImprovementCommonCertificateIssuerInput<JsonObject>['artifactStore'],
  bindings: readonly DeepImprovementCommonSealedArtifactBinding[],
  ledgerEvents: readonly VerifiedLedgerEvent[],
  verificationTime: string,
): Promise<VerifiedArtifactSet> {
  if (bindings.length === 0) {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.EVIDENCE_INCOMPLETE,
      'certificate:artifacts',
      'Certificate requires a non-empty sealed artifact closure',
    );
  }
  const evaluatorBinding = bindings.find((binding) => (
    binding.artifactKind === DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE
  ));
  if (!evaluatorBinding) {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.ARTIFACT_MISSING,
      'certificate:evaluator',
      'Certificate requires one evaluator capsule',
    );
  }
  const evaluator = await readDeepImprovementCommonArtifact(
    store,
    evaluatorBinding,
    { accessRole: 'evaluator' },
  );
  const evaluatorEpochId = (
    evaluator.material as DeepImprovementEvaluatorCapsuleMaterial
  ).evaluatorEpochId;
  const claims: DeepImprovementCommonCertificateArtifactClaim[] = [];
  const byQualifiedDigest = new Map<string, ArtifactEvidence>();
  const byContentDigestMutable = new Map<string, ArtifactEvidence[]>();
  for (const binding of bindings) {
    const verified = await readDeepImprovementCommonArtifact(store, binding, {
      accessRole: 'promotion',
      requiredEvaluationEpochId: evaluatorEpochId,
      requireFreshCanary: true,
      now: new Date(verificationTime),
    });
    const claim = Object.freeze({
      binding: verified.binding,
      descriptorDigest: verified.binding.reference.descriptor_digest,
      contentDigest: verified.descriptor.content_digest,
      canonicalizationVersion: verified.descriptor.canonicalization_version,
    });
    const qualified = verified.binding.reference.qualified_digest;
    if (byQualifiedDigest.has(qualified)) {
      throw new DeepImprovementCommonCertificateError(
        DeepImprovementCommonCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
        'certificate:artifacts',
        'Certificate artifact identities must be unique',
      );
    }
    assertArtifactOrigin(verified, ledgerEvents);
    const evidence = Object.freeze({ claim, material: verified.material });
    claims.push(claim);
    byQualifiedDigest.set(qualified, evidence);
    const values = byContentDigestMutable.get(claim.contentDigest) ?? [];
    values.push(evidence);
    byContentDigestMutable.set(claim.contentDigest, values);
  }
  const byContentDigest = new Map(
    [...byContentDigestMutable].map(([key, values]) => [key, Object.freeze(values)]),
  );
  const result = Object.freeze({
    claims: Object.freeze(claims),
    byQualifiedDigest,
    byContentDigest,
  });
  await verifyNamedDigestClosure(result, store, verificationTime);
  return result;
}

function assertArtifactOrigin(
  verified: DeepImprovementVerifiedSealedArtifact,
  ledgerEvents: readonly VerifiedLedgerEvent[],
): void {
  const origin = verified.material.originEvent;
  const event = findEvent(ledgerEvents, origin.eventId);
  const payload = eventPayload(event);
  if (payload.stem !== origin.eventStem || payload.payloadDigest !== origin.payloadDigest) {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.AUTHORIZATION_INVALID,
      `artifact:${verified.binding.reference.qualified_digest}:origin`,
      'Sealed artifact origin does not resolve to its exact authorized event',
    );
  }
}

async function verifyNamedDigestClosure(
  artifacts: VerifiedArtifactSet,
  store: DeepImprovementCommonOfflineVerificationInput<JsonObject>['artifactStore'],
  verificationTime: string,
): Promise<void> {
  const promotionEvidence = [...artifacts.byQualifiedDigest.values()].filter((entry) => (
    entry.claim.binding.artifactKind === DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE
  ));
  for (const entry of promotionEvidence) {
    const material = entry.material as DeepImprovementPromotionEvidenceMaterial;
    const fields = [
      ['unresolvedEvidenceDigests[]', material.unresolvedEvidenceDigests],
      ['vetoEvidenceDigests[]', material.vetoEvidenceDigests],
    ] as const;
    for (const [field, values] of fields) {
      for (const [index, plainDigest] of values.entries()) {
        const matches = artifacts.byContentDigest.get(plainDigest) ?? [];
        if (matches.length === 0) {
          throw new DeepImprovementCommonCertificateError(
            DeepImprovementCommonCertificateFailureCodes.ARTIFACT_MISSING,
            `artifact:${entry.claim.binding.reference.qualified_digest}:${field}:${index}`,
            'Named plain digest does not resolve to actually sealed content',
          );
        }
        if (matches.length !== 1) {
          throw new DeepImprovementCommonCertificateError(
            DeepImprovementCommonCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
            `artifact:${entry.claim.binding.reference.qualified_digest}:${field}:${index}`,
            'Named plain digest has ambiguous ownership in the run closure',
          );
        }
        const target = matches[0] as ArtifactEvidence;
        if (target.claim.binding.artifactKind !== DeepImprovementCommonArtifactKinds.RAW_TRIAL_OUTPUT) {
          throw new DeepImprovementCommonCertificateError(
            DeepImprovementCommonCertificateFailureCodes.ARTIFACT_WRONG_KIND,
            `artifact:${entry.claim.binding.reference.qualified_digest}:${field}:${index}`,
            'Named promotion evidence digest resolves to the wrong registered kind',
          );
        }
        await readDeepImprovementCommonArtifact(store, target.claim.binding, {
          accessRole: 'promotion',
          requiredEvaluationEpochId: material.evaluatorEpochId,
          now: new Date(verificationTime),
        });
      }
    }
  }
}

async function issueReceiptWithArtifacts(
  input: DeepImprovementCommonTransitionReceiptInput,
  context: DeepImprovementCommonTransitionReceiptContext,
  artifacts: VerifiedArtifactSet,
): Promise<DeepImprovementCommonTransitionReceipt> {
  const writerEvents = await context.receiptSubstrate.writer.readVerifiedEvents();
  const writerResultIds = new Set(writerEvents.map((event) => (
    event.event.effective.envelope.event_id
  )));
  for (const event of context.ledgerEvents) {
    if (!writerResultIds.has(event.event.effective.envelope.event_id)) {
      throw new DeepImprovementCommonCertificateError(
        DeepImprovementCommonCertificateFailureCodes.AUTHORIZATION_INVALID,
        `transition:${input.transitionKind}:writer`,
        'Receipt writer does not expose the verified authorized result event',
      );
    }
  }
  const facts = buildTransitionFacts(input, {
    runId: context.runId,
    replayFingerprint: context.replayFingerprint,
    priorReceipts: context.priorReceipts,
    ledgerEvents: context.ledgerEvents,
    artifacts,
    serviceVersion: context.serviceVersion,
  });
  const receiptDigest = digest(facts);
  const unsigned = unsignedSharedReceipt(
    facts,
    receiptDigest,
    context.issuer,
    context.issuedAt,
  );
  const sharedReceipt = await certifyShared(
    unsigned,
    context.certificationProfile,
    context.providers,
  );
  return parseDeepImprovementCommonTransitionReceipt({
    facts,
    receiptDigest,
    sharedReceipt,
  });
}

/** Issue one shared transition receipt from verified ledger and sealed-store evidence. */
export async function issueDeepImprovementCommonTransitionReceipt(
  input: DeepImprovementCommonTransitionReceiptInput,
  context: DeepImprovementCommonTransitionReceiptContext,
): Promise<DeepImprovementCommonTransitionReceipt> {
  const artifacts = await verifiedArtifactSet(
    context.artifactStore,
    context.artifactBindings,
    context.ledgerEvents,
    context.verificationTime,
  );
  return issueReceiptWithArtifacts(input, context, artifacts);
}

function requiredArtifact(
  artifacts: VerifiedArtifactSet,
  kind: DeepImprovementCommonArtifactKind,
): ArtifactEvidence {
  const matches = [...artifacts.byQualifiedDigest.values()].filter((entry) => (
    entry.claim.binding.artifactKind === kind
  ));
  if (matches.length !== 1) {
    throw new DeepImprovementCommonCertificateError(
      matches.length === 0
        ? DeepImprovementCommonCertificateFailureCodes.ARTIFACT_MISSING
        : DeepImprovementCommonCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      `certificate:artifact:${kind}`,
      'Certificate requires exactly one artifact of this shared kind',
    );
  }
  return matches[0] as ArtifactEvidence;
}

function rawArtifacts(artifacts: VerifiedArtifactSet): readonly ArtifactEvidence[] {
  const matches = [...artifacts.byQualifiedDigest.values()].filter((entry) => (
    entry.claim.binding.artifactKind === DeepImprovementCommonArtifactKinds.RAW_TRIAL_OUTPUT
  ));
  if (matches.length === 0) {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.ARTIFACT_MISSING,
      'certificate:raw-observations',
      'Certificate requires retained raw trial observations',
    );
  }
  return Object.freeze(matches);
}

function verdictFromEvents(
  events: readonly DeepImprovementCommonLedgerEvent[],
): DeepImprovementCommonCertificateVerdict {
  const stems = new Set(events.map((event) => event.payload.stem));
  if (
    stems.has('deep_improvement_common.run_aborted')
    || stems.has('deep_improvement_common.promotion_aborted')
  ) return 'ABORT';
  if (
    stems.has('deep_improvement_common.canary_gate_failed')
    || stems.has('deep_improvement_common.canary_vetoed')
    || stems.has('deep_improvement_common.promotion_denied')
  ) return 'FAIL';
  if (
    stems.has('deep_improvement_common.promotion_completed')
    && stems.has('deep_improvement_common.run_completed')
  ) return 'PASS';
  return 'INSUFFICIENT_EVIDENCE';
}

function verdictFromEvidence(
  events: readonly DeepImprovementCommonLedgerEvent[],
  promotion: DeepImprovementPromotionEvidenceMaterial,
): DeepImprovementCommonCertificateVerdict {
  const eventVerdict = verdictFromEvents(events);
  if (eventVerdict === 'ABORT') return eventVerdict;
  if (
    promotion.vetoEvidenceDigests.length > 0
    || promotion.targetRepair === 'fail'
    || promotion.baselinePreservation === 'fail'
    || promotion.criticalDimensions === 'fail'
    || promotion.evaluatorIntegrity === 'fail'
    || promotion.canaryOutcome === 'fail'
    || promotion.admissibility === 'ineligible'
  ) return 'FAIL';
  if (
    promotion.unresolvedEvidenceDigests.length > 0
    || promotion.targetRepair === 'inconclusive'
    || promotion.baselinePreservation === 'inconclusive'
    || promotion.criticalDimensions === 'inconclusive'
    || promotion.evaluatorIntegrity === 'inconclusive'
    || promotion.canaryOutcome === 'inconclusive'
    || promotion.uncertaintyLowerBound < promotion.uncertaintyThreshold
    || promotion.costMicros > promotion.costLimitMicros
  ) return 'INSUFFICIENT_EVIDENCE';
  return eventVerdict;
}

function assertRawReductionRelations(
  events: readonly DeepImprovementCommonLedgerEvent[],
  raws: readonly ArtifactEvidence[],
): void {
  const normalized = events.filter((event) => (
    event.payload.stem === 'deep_improvement_common.evaluation_normalized'
  ));
  if (normalized.length !== 1 || raws.length !== 1) {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.EVIDENCE_INCOMPLETE,
      'certificate:raw-reduction',
      'Shared certificate requires one normalized result and one retained raw trial',
    );
  }
  const normalizedScore = normalized[0]?.payload.data.scoreVector;
  const rawScore = (
    raws[0]?.material as DeepImprovementCommonArtifactMaterial & {
      readonly rawScoreVector: unknown;
    }
  ).rawScoreVector;
  if (canonicalJson(asJson(rawScore)) !== canonicalJson(asJson(normalizedScore))) {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.PROJECTION_INVALID,
      'certificate:raw-reduction',
      'Normalized ledger score does not reproduce the retained raw score vector',
      digest(rawScore),
      digest(normalizedScore),
    );
  }
}

function assertTransitionOrder(
  receipts: readonly DeepImprovementCommonTransitionReceipt[],
  verdict: DeepImprovementCommonCertificateVerdict,
): void {
  const identities = new Set<string>();
  let cursor = 0;
  for (const [index, receipt] of receipts.entries()) {
    if (identities.has(receipt.facts.identity.digest)) {
      throw new DeepImprovementCommonCertificateError(
        DeepImprovementCommonCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
        `receipt:${index}:identity`,
        'A stable receipt identity may appear only once',
      );
    }
    identities.add(receipt.facts.identity.digest);
    const expected = DEEP_IMPROVEMENT_COMMON_REQUIRED_TRANSITION_ORDER[cursor];
    if (receipt.facts.transitionKind === expected) cursor += 1;
    else if (
      DEEP_IMPROVEMENT_COMMON_REQUIRED_TRANSITION_ORDER.includes(
        receipt.facts.transitionKind as (typeof DEEP_IMPROVEMENT_COMMON_REQUIRED_TRANSITION_ORDER)[number],
      )
    ) {
      throw new DeepImprovementCommonCertificateError(
        DeepImprovementCommonCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
        `receipt:${index}:order`,
        'Shared lifecycle transition receipts are reordered',
      );
    }
  }
  if (cursor !== DEEP_IMPROVEMENT_COMMON_REQUIRED_TRANSITION_ORDER.length) {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.RECEIPT_MISSING,
      'receipt:required-order',
      'Certificate is missing one or more shared lifecycle receipts',
    );
  }
  const kinds = new Set(receipts.map((receipt) => receipt.facts.transitionKind));
  if (verdict === 'PASS' && (
    !kinds.has(DeepImprovementCommonTransitionKinds.PROMOTION_AUTHORIZED)
    || !kinds.has(DeepImprovementCommonTransitionKinds.GUARDED_PROMOTION)
  )) {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.RECEIPT_MISSING,
      'receipt:pass-terminal',
      'Passing certificate requires authorization and guarded-promotion receipts',
    );
  }
  if (verdict === 'FAIL' && !kinds.has(DeepImprovementCommonTransitionKinds.PROMOTION_BLOCKED)) {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.RECEIPT_MISSING,
      'receipt:fail-terminal',
      'Failed certificate requires a promotion-blocked receipt',
    );
  }
  if (verdict === 'ABORT' && !kinds.has(DeepImprovementCommonTransitionKinds.ABORTED)) {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.RECEIPT_MISSING,
      'receipt:abort-terminal',
      'Aborted certificate requires an explicit abort receipt',
    );
  }
}

function assertOutputOwnership(
  receipts: readonly DeepImprovementCommonTransitionReceipt[],
  artifacts: VerifiedArtifactSet,
): void {
  const owners = new Map<string, string>();
  for (const receipt of receipts) {
    for (const output of receipt.facts.outputArtifactQualifiedDigests) {
      const owner = owners.get(output);
      if (owner !== undefined && owner !== receipt.facts.identity.digest) {
        throw new DeepImprovementCommonCertificateError(
          DeepImprovementCommonCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
          `receipt:${receipt.facts.transitionKind}:outputs`,
          'One sealed output artifact cannot be owned by multiple transition identities',
        );
      }
      owners.set(output, receipt.facts.identity.digest);
    }
  }
  for (const reference of artifacts.byQualifiedDigest.keys()) {
    if (!owners.has(reference)) {
      throw new DeepImprovementCommonCertificateError(
        DeepImprovementCommonCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
        `artifact:${reference}:owner`,
        'Every certificate artifact must be owned by a receipt output',
      );
    }
  }
}

function orderedDependencyClosure(
  receipts: readonly DeepImprovementCommonTransitionReceipt[],
): readonly string[] {
  const ordered: string[] = [];
  for (const receipt of receipts) {
    ordered.push(
      ...receipt.facts.inputArtifactQualifiedDigests,
      ...receipt.facts.evidenceArtifactQualifiedDigests,
      ...receipt.facts.outputArtifactQualifiedDigests,
    );
  }
  const unique: string[] = [];
  const seen = new Set<string>();
  for (const reference of ordered) {
    if (!seen.has(reference)) {
      unique.push(reference);
      seen.add(reference);
    }
  }
  return Object.freeze(unique);
}

function compositeReplayFingerprint(
  runId: string,
  substrateReplayFingerprint: string,
  transitionInputs: readonly DeepImprovementCommonTransitionReceiptInput[],
  artifacts: VerifiedArtifactSet,
): string {
  const identities = transitionInputs.map((input) => (
    deriveDeepImprovementCommonReceiptIdentity(runId, input)
  ));
  return digest({
    contract: DEEP_IMPROVEMENT_COMMON_SHARED_CERTIFICATE_CONTRACT,
    substrateReplayFingerprint,
    artifacts: artifacts.claims.map((claim) => claim.binding.reference.qualified_digest),
    transitions: transitionInputs.map((input, index) => ({
      identityCore: {
        transitionKind: input.transitionKind,
        logicalOperationId: input.logicalOperationId,
        effectIdempotencyKey: input.effectIdempotencyKey,
      },
      predecessorIndex: index === 0 ? null : index - 1,
      resultEventId: input.resultEventId,
      inputArtifactQualifiedDigests: input.inputArtifactQualifiedDigests,
      outputArtifactQualifiedDigests: input.outputArtifactQualifiedDigests,
      evidenceArtifactQualifiedDigests: input.evidenceArtifactQualifiedDigests,
    })),
    identityCount: identities.length,
    namedDigestClosureRules: DEEP_IMPROVEMENT_COMMON_NAMED_DIGEST_CLOSURE_RULES,
  });
}

function certificateUnsignedReceipt(
  body: DeepImprovementCommonRunCertificateBody,
  certificateDigest: string,
  issuer: string,
  issuedAt: string,
  authorityEpoch: number,
): Omit<BoundaryReceiptPayload, 'certification'> {
  return Object.freeze({
    receipt_id: `dic-certificate:${certificateDigest}`,
    boundary_id: `dic-certificate-boundary:${certificateDigest}`,
    boundary_kind: 'mode-completion',
    scope: 'mode',
    scope_id: body.runId,
    from_state: 'active',
    to_state: body.verdict.toLowerCase().replaceAll('_', '-'),
    from_head: head('authorized-ledger', 0, body.startHeadHash),
    result_head: head('authorized-ledger', body.receiptDigests.length, body.finalHeadHash),
    result_event_id: `dic-certificate-event:${certificateDigest}`,
    result_event_type: 'deep-improvement-common.run-certificate',
    result_event_digest: certificateDigest,
    result_code: body.verdict.toLowerCase().replaceAll('_', '-'),
    evidence_digest: certificateDigest,
    artifact_digests: body.artifactClaims.map((claim) => claim.contentDigest),
    replay_fingerprint: body.replayFingerprint,
    authority_epoch: authorityEpoch,
    correlation_id: body.runId,
    causation_id: body.receiptIdentities.at(-1)?.digest ?? body.runId,
    issuer,
    issued_at: issuedAt,
    idempotency_key: `dic-certificate:v1:${certificateDigest}`,
  });
}

/** Issue the additive-dark run certificate from real reducers, ledger, and sealed artifacts. */
export async function issueDeepImprovementCommonRunCertificate<TState extends JsonObject>(
  input: DeepImprovementCommonCertificateIssuerInput<TState>,
): Promise<DeepImprovementCommonCertificateBundle> {
  if (!(input.replay.ledger instanceof AppendOnlyLedger)) {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.LEDGER_INVALID,
      'replay:ledger',
      'Certificate issuance requires the shipped authorized-ledger reader',
    );
  }
  if (input.replay.runId !== input.runId) {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.REPLAY_INVALID,
      'replay:runId',
      'Replay run identity differs from certificate identity',
    );
  }
  const allEvents = await input.replay.ledger.readVerifiedEvents();
  const coveredEvents = allEvents.slice(
    input.replay.rangeStartSequence - 1,
    input.replay.rangeEndSequence,
  );
  if (coveredEvents.length === 0) {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.LEDGER_INVALID,
      'replay:range',
      'Certificate replay range contains no authorized events',
    );
  }
  assertProjectionMatchesLedger(input.projectionEvents, coveredEvents);
  const folded = foldDeepImprovementCommonEvents(input.projectionEvents);
  if (folded.outcome !== 'projected') {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.PROJECTION_INVALID,
      'projection:fold',
      'Reducer projection requires a rebuild',
    );
  }
  if (
    folded.projection.run.runId !== input.runId
    || folded.projection.run.lineageId !== input.lineageId
    || folded.projection.run.generation !== input.generation
  ) {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.PROJECTION_INVALID,
      'projection:identity',
      'Reducer-derived run identity differs from certificate input',
    );
  }
  const replay = await deriveReplayFingerprint(input.replay);
  const artifacts = await verifiedArtifactSet(
    input.artifactStore,
    input.artifactBindings,
    coveredEvents,
    input.verificationTime,
  );
  const compositeReplay = compositeReplayFingerprint(
    input.runId,
    replay.descriptor.final_digest,
    input.transitionReceipts,
    artifacts,
  );
  const receipts: DeepImprovementCommonTransitionReceipt[] = [];
  const seenInputs = new Map<string, string>();
  for (const transitionInput of input.transitionReceipts) {
    const identity = deriveDeepImprovementCommonReceiptIdentity(input.runId, transitionInput);
    const canonicalInput = canonicalJson(asJson(transitionInput));
    const prior = seenInputs.get(identity.digest);
    if (prior === canonicalInput) continue;
    if (prior !== undefined) {
      throw new DeepImprovementCommonCertificateError(
        DeepImprovementCommonCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
        `receipt:${identity.digest}`,
        'One stable receipt identity is bound to conflicting transition inputs',
      );
    }
    const receipt = await issueReceiptWithArtifacts(transitionInput, {
      runId: input.runId,
      replayFingerprint: compositeReplay,
      priorReceipts: receipts,
      ledgerEvents: coveredEvents,
      artifactStore: input.artifactStore,
      artifactBindings: input.artifactBindings,
      certificationProfile: input.certificationProfile,
      providers: input.providers,
      receiptSubstrate: input.receiptSubstrate,
      serviceVersion: input.serviceVersion,
      issuer: input.issuer,
      issuedAt: input.issuedAt,
      verificationTime: input.verificationTime,
    }, artifacts);
    receipts.push(receipt);
    seenInputs.set(identity.digest, canonicalInput);
  }
  const evaluator = requiredArtifact(
    artifacts,
    DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
  );
  const candidate = requiredArtifact(
    artifacts,
    DeepImprovementCommonArtifactKinds.CANDIDATE_INPUT,
  );
  const baseline = requiredArtifact(
    artifacts,
    DeepImprovementCommonArtifactKinds.BASELINE_INPUT,
  );
  const canary = requiredArtifact(
    artifacts,
    DeepImprovementCommonArtifactKinds.CANARY_EPOCH,
  );
  const promotion = requiredArtifact(
    artifacts,
    DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE,
  );
  const raws = rawArtifacts(artifacts);
  const evaluatorMaterial = evaluator.material as DeepImprovementEvaluatorCapsuleMaterial;
  const candidateMaterial = candidate.material as DeepImprovementCommonArtifactMaterial & {
    readonly candidateId: string;
    readonly lineageId: string;
    readonly evaluatorEpochId: string;
  };
  const baselineMaterial = baseline.material as DeepImprovementCommonArtifactMaterial & {
    readonly baselineId: string;
    readonly lineageId: string;
    readonly evaluatorEpochId: string;
  };
  const canaryMaterial = canary.material as DeepImprovementCommonArtifactMaterial & {
    readonly canaryEpochId: string;
    readonly evaluatorEpochId: string;
  };
  const promotionMaterial = promotion.material as DeepImprovementPromotionEvidenceMaterial;
  const verdict = verdictFromEvidence(input.projectionEvents, promotionMaterial);
  assertTransitionOrder(receipts, verdict);
  assertOutputOwnership(receipts, artifacts);
  assertRawReductionRelations(input.projectionEvents, raws);
  if (
    candidateMaterial.lineageId !== input.lineageId
    || baselineMaterial.lineageId !== input.lineageId
    || candidateMaterial.evaluatorEpochId !== evaluatorMaterial.evaluatorEpochId
    || baselineMaterial.evaluatorEpochId !== evaluatorMaterial.evaluatorEpochId
    || canaryMaterial.evaluatorEpochId !== evaluatorMaterial.evaluatorEpochId
    || promotionMaterial.evaluatorEpochId !== evaluatorMaterial.evaluatorEpochId
  ) {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      'certificate:epochs',
      'Run lineage or evaluator epoch differs across the sealed dependency closure',
    );
  }
  const first = coveredEvents[0] as VerifiedLedgerEvent;
  const last = coveredEvents.at(-1) as VerifiedLedgerEvent;
  const receiptDigests = receipts.map((receipt) => receipt.receiptDigest);
  const body: DeepImprovementCommonRunCertificateBody = Object.freeze({
    certificateVersion: DEEP_IMPROVEMENT_COMMON_CERTIFICATE_VERSION,
    authority: 'dark-evidence-only',
    sharedContractId: 'deep-improvement-common-certificates',
    runId: input.runId,
    lineageId: input.lineageId,
    generation: input.generation,
    evaluatorEpochId: evaluatorMaterial.evaluatorEpochId,
    candidateId: candidateMaterial.candidateId,
    baselineId: baselineMaterial.baselineId,
    canaryEpochId: canaryMaterial.canaryEpochId,
    verdict,
    artifactClaims: artifacts.claims,
    artifactSetDigest: digest(artifacts.claims),
    evaluatorCapsuleQualifiedDigest: evaluator.claim.binding.reference.qualified_digest,
    candidateInputQualifiedDigest: candidate.claim.binding.reference.qualified_digest,
    baselineInputQualifiedDigest: baseline.claim.binding.reference.qualified_digest,
    rawObservationQualifiedDigests: Object.freeze(
      raws.map((entry) => entry.claim.binding.reference.qualified_digest),
    ),
    canaryEpochQualifiedDigest: canary.claim.binding.reference.qualified_digest,
    promotionEvidenceQualifiedDigest: promotion.claim.binding.reference.qualified_digest,
    namedDigestClosureRules: DEEP_IMPROVEMENT_COMMON_NAMED_DIGEST_CLOSURE_RULES,
    orderedDependencyClosure: orderedDependencyClosure(receipts),
    receiptIdentities: Object.freeze(receipts.map((receipt) => receipt.facts.identity)),
    receiptDigests: Object.freeze(receiptDigests),
    receiptChainDigest: digest(receiptDigests),
    substrateReplayFingerprint: replay.descriptor.final_digest,
    replayFingerprint: compositeReplay,
    replayFingerprintVersion: replay.descriptor.fingerprint_version,
    projectionIntegrityDigest: deepImprovementCommonProjectionIntegrityDigest(folded.projection),
    evaluatorPolicyDigest: evaluatorMaterial.policyDigest,
    budgetDigest: digest(evaluatorMaterial.budgetPolicy),
    vetoEvidenceDigests: Object.freeze([...promotionMaterial.vetoEvidenceDigests]),
    startHeadHash: first.frame.prev_record_hash,
    finalHeadHash: last.frame.record_hash,
  });
  const certificateDigest = digest(body);
  const authorityEpoch = receipts.at(-1)?.facts.authorityEpoch;
  if (authorityEpoch === undefined) {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.RECEIPT_MISSING,
      'certificate:terminal-receipt',
      'Certificate requires a terminal receipt',
    );
  }
  const unsigned = certificateUnsignedReceipt(
    body,
    certificateDigest,
    input.issuer,
    input.issuedAt,
    authorityEpoch,
  );
  const sharedCertificationReceipt = await certifyShared(
    unsigned,
    input.certificationProfile,
    input.providers,
  );
  const certificate = parseDeepImprovementCommonRunCertificate({
    body,
    certificateDigest,
    sharedCertificationReceipt,
  });
  return Object.freeze({
    bundleVersion: 1,
    certificate,
    receipts: Object.freeze(receipts),
  });
}

function equalCanonical(
  expected: unknown,
  actual: unknown,
  code: DeepImprovementCommonCertificateFailureCode,
  location: string,
  reason: string,
): void {
  if (canonicalJson(asJson(expected)) !== canonicalJson(asJson(actual))) {
    throw new DeepImprovementCommonCertificateError(
      code,
      location,
      reason,
      digest(expected),
      digest(actual),
    );
  }
}

async function verifyReceipts(
  bundle: DeepImprovementCommonCertificateBundle,
  ledgerEvents: readonly VerifiedLedgerEvent[],
  artifacts: VerifiedArtifactSet,
  providers: CertificationProviderRegistry,
  serviceVersion: string,
): Promise<void> {
  if (bundle.receipts.length !== bundle.certificate.body.receiptDigests.length) {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.RECEIPT_MISSING,
      'receipt:count',
      'Certificate receipt index and supplied bundle differ in length',
    );
  }
  assertTransitionOrder(bundle.receipts, bundle.certificate.body.verdict);
  assertOutputOwnership(bundle.receipts, artifacts);
  const verified: DeepImprovementCommonTransitionReceipt[] = [];
  for (const [index, receipt] of bundle.receipts.entries()) {
    const input: DeepImprovementCommonTransitionReceiptInput = {
      transitionKind: receipt.facts.transitionKind,
      logicalOperationId: receipt.facts.logicalOperationId,
      effectIdempotencyKey: receipt.facts.effectIdempotencyKey,
      attemptNumber: receipt.facts.attemptNumber,
      resultEventId: receipt.facts.resultEventId,
      inputArtifactQualifiedDigests: receipt.facts.inputArtifactQualifiedDigests,
      outputArtifactQualifiedDigests: receipt.facts.outputArtifactQualifiedDigests,
      evidenceArtifactQualifiedDigests: receipt.facts.evidenceArtifactQualifiedDigests,
    };
    const expected = buildTransitionFacts(input, {
      runId: bundle.certificate.body.runId,
      replayFingerprint: bundle.certificate.body.replayFingerprint,
      priorReceipts: verified,
      ledgerEvents,
      artifacts,
      serviceVersion,
    });
    equalCanonical(
      expected,
      receipt.facts,
      DeepImprovementCommonCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
      `receipt:${index}:facts`,
      'Receipt facts do not re-derive from authorized ledger and sealed evidence',
    );
    const recomputed = digest(expected);
    if (
      receipt.receiptDigest !== recomputed
      || bundle.certificate.body.receiptDigests[index] !== recomputed
      || bundle.certificate.body.receiptIdentities[index]?.digest !== expected.identity.digest
    ) {
      throw new DeepImprovementCommonCertificateError(
        DeepImprovementCommonCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
        `receipt:${index}:digest`,
        'Receipt digest or stable identity index does not recompute',
        recomputed,
        receipt.receiptDigest,
      );
    }
    const unsigned = unsignedSharedReceipt(
      expected,
      recomputed,
      receipt.sharedReceipt.issuer,
      receipt.sharedReceipt.issued_at,
    );
    await verifyShared(receipt.sharedReceipt, unsigned, providers, `receipt:${index}:certification`);
    verified.push(receipt);
  }
  const chainDigest = digest(bundle.receipts.map((receipt) => receipt.receiptDigest));
  if (chainDigest !== bundle.certificate.body.receiptChainDigest) {
    throw new DeepImprovementCommonCertificateError(
      DeepImprovementCommonCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
      'receipt:chain',
      'Receipt chain digest does not recompute in supplied order',
      chainDigest,
      bundle.certificate.body.receiptChainDigest,
    );
  }
  equalCanonical(
    orderedDependencyClosure(bundle.receipts),
    bundle.certificate.body.orderedDependencyClosure,
    DeepImprovementCommonCertificateFailureCodes.REPLAY_INVALID,
    'replay:ordered-dependency-closure',
    'Ordered artifact dependency closure differs from receipt order',
  );
}

function failureResult(error: unknown): DeepImprovementCommonOfflineVerificationFailure {
  let verdict: DeepImprovementCommonOfflineVerificationFailure['verdict'] = 'invalid';
  let code: DeepImprovementCommonCertificateFailureCode =
    DeepImprovementCommonCertificateFailureCodes.CERTIFICATE_INVALID;
  let evidenceLocation = 'certificate:unknown';
  let expectedDigest: string | null = null;
  let actualDigest: string | null = null;
  let failureReason = 'Offline verification failed without trusted evidence.';
  if (error instanceof DeepImprovementCommonCertificateError) {
    code = error.code;
    evidenceLocation = error.evidenceLocation;
    expectedDigest = error.expectedDigest;
    actualDigest = error.actualDigest;
    failureReason = error.message;
    if (
      code === DeepImprovementCommonCertificateFailureCodes.RECEIPT_MISSING
      || code === DeepImprovementCommonCertificateFailureCodes.EVIDENCE_INCOMPLETE
    ) verdict = 'incomplete';
    if (code === DeepImprovementCommonCertificateFailureCodes.UNSUPPORTED_VERSION) {
      verdict = 'unsupported';
    }
  } else if (error instanceof SealedArtifactError) {
    code = error.code === SealedArtifactErrorCodes.ARTIFACT_MISSING
      ? DeepImprovementCommonCertificateFailureCodes.ARTIFACT_MISSING
      : DeepImprovementCommonCertificateFailureCodes.ARTIFACT_MUTATED;
    evidenceLocation = `artifact:${error.phase}`;
    failureReason = error.message;
    if (error.code === SealedArtifactErrorCodes.ARTIFACT_MISSING) verdict = 'unverifiable';
  } else if (error instanceof DeepImprovementArtifactReadError) {
    code = error.code === DeepImprovementArtifactReadFailureCodes.STALE_CANARY
      ? DeepImprovementCommonCertificateFailureCodes.ARTIFACT_STALE
      : error.code === DeepImprovementArtifactReadFailureCodes.ACCESS_DENIED
        || error.code === DeepImprovementArtifactReadFailureCodes.LEAK_DETECTED
        ? DeepImprovementCommonCertificateFailureCodes.VISIBILITY_INVALID
        : error.code === DeepImprovementArtifactReadFailureCodes.EPOCH_MISMATCH
          ? DeepImprovementCommonCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID
          : DeepImprovementCommonCertificateFailureCodes.ARTIFACT_WRONG_KIND;
    evidenceLocation = 'artifact:verified-read';
    failureReason = error.message;
  } else if (error instanceof Error) {
    code = DeepImprovementCommonCertificateFailureCodes.CERTIFICATION_INVALID;
    evidenceLocation = 'substrate:verification';
    failureReason = error.message.slice(0, 512);
  }
  return Object.freeze({
    verdict,
    code,
    evidenceLocation,
    expectedDigest,
    actualDigest,
    failureReason,
    evidenceDigest: digest({
      verdict, code, evidenceLocation, expectedDigest, actualDigest, failureReason,
    }),
  });
}

/** Independently re-derive the certificate from offline ledger and sealed-store inputs. */
export async function verifyDeepImprovementCommonCertificateOffline<TState extends JsonObject>(
  input: DeepImprovementCommonOfflineVerificationInput<TState>,
): Promise<DeepImprovementCommonOfflineVerificationResult> {
  try {
    const bundle = parseDeepImprovementCommonCertificateBundle(input.bundle);
    const certificate = bundle.certificate;
    if (!(input.replay.ledger instanceof AppendOnlyLedger)) {
      throw new DeepImprovementCommonCertificateError(
        DeepImprovementCommonCertificateFailureCodes.LEDGER_INVALID,
        'replay:ledger',
        'Offline verification requires the shipped authorized-ledger reader',
      );
    }
    if (input.replay.runId !== certificate.body.runId) {
      throw new DeepImprovementCommonCertificateError(
        DeepImprovementCommonCertificateFailureCodes.REPLAY_INVALID,
        'replay:runId',
        'Replay run identity differs from certificate identity',
      );
    }
    equalCanonical(
      DEEP_IMPROVEMENT_COMMON_NAMED_DIGEST_CLOSURE_RULES,
      certificate.body.namedDigestClosureRules,
      DeepImprovementCommonCertificateFailureCodes.ARTIFACT_CLOSURE_INVALID,
      'artifact:named-digest-rules',
      'Certificate changes the frozen field-to-expected-kind closure map',
    );
    const allEvents = await input.replay.ledger.readVerifiedEvents();
    const coveredEvents = allEvents.slice(
      input.replay.rangeStartSequence - 1,
      input.replay.rangeEndSequence,
    );
    if (coveredEvents.length === 0) {
      throw new DeepImprovementCommonCertificateError(
        DeepImprovementCommonCertificateFailureCodes.LEDGER_INVALID,
        'replay:range',
        'Replay range contains no authorized events',
      );
    }
    assertProjectionMatchesLedger(input.projectionEvents, coveredEvents);
    const folded = foldDeepImprovementCommonEvents(input.projectionEvents);
    if (folded.outcome !== 'projected') {
      throw new DeepImprovementCommonCertificateError(
        DeepImprovementCommonCertificateFailureCodes.PROJECTION_INVALID,
        'projection:fold',
        'Projection requires a rebuild',
      );
    }
    const projectionDigest = deepImprovementCommonProjectionIntegrityDigest(folded.projection);
    if (projectionDigest !== certificate.body.projectionIntegrityDigest) {
      throw new DeepImprovementCommonCertificateError(
        DeepImprovementCommonCertificateFailureCodes.PROJECTION_INVALID,
        'projection:digest',
        'Projection integrity digest does not recompute',
        projectionDigest,
        certificate.body.projectionIntegrityDigest,
      );
    }
    const artifacts = await verifiedArtifactSet(
      input.artifactStore,
      certificate.body.artifactClaims.map((claim) => claim.binding),
      coveredEvents,
      input.verificationTime,
    );
    equalCanonical(
      artifacts.claims,
      certificate.body.artifactClaims,
      DeepImprovementCommonCertificateFailureCodes.ARTIFACT_MUTATED,
      'artifact:claims',
      'Artifact claims differ from real verified store reads',
    );
    const artifactSetDigest = digest(artifacts.claims);
    if (artifactSetDigest !== certificate.body.artifactSetDigest) {
      throw new DeepImprovementCommonCertificateError(
        DeepImprovementCommonCertificateFailureCodes.ARTIFACT_MUTATED,
        'artifact:set',
        'Artifact-set digest does not recompute',
        artifactSetDigest,
        certificate.body.artifactSetDigest,
      );
    }
    const replay = await deriveReplayFingerprint(input.replay);
    if (
      replay.descriptor.final_digest !== certificate.body.substrateReplayFingerprint
      || replay.descriptor.fingerprint_version !== certificate.body.replayFingerprintVersion
    ) {
      throw new DeepImprovementCommonCertificateError(
        DeepImprovementCommonCertificateFailureCodes.REPLAY_INVALID,
        'replay:substrate',
        'Authorized-ledger replay fingerprint does not recompute',
        replay.descriptor.final_digest,
        certificate.body.substrateReplayFingerprint,
      );
    }
    const transitionInputs = bundle.receipts.map((receipt): DeepImprovementCommonTransitionReceiptInput => ({
      transitionKind: receipt.facts.transitionKind,
      logicalOperationId: receipt.facts.logicalOperationId,
      effectIdempotencyKey: receipt.facts.effectIdempotencyKey,
      attemptNumber: receipt.facts.attemptNumber,
      resultEventId: receipt.facts.resultEventId,
      inputArtifactQualifiedDigests: receipt.facts.inputArtifactQualifiedDigests,
      outputArtifactQualifiedDigests: receipt.facts.outputArtifactQualifiedDigests,
      evidenceArtifactQualifiedDigests: receipt.facts.evidenceArtifactQualifiedDigests,
    }));
    const composite = compositeReplayFingerprint(
      certificate.body.runId,
      replay.descriptor.final_digest,
      transitionInputs,
      artifacts,
    );
    if (composite !== certificate.body.replayFingerprint) {
      throw new DeepImprovementCommonCertificateError(
        DeepImprovementCommonCertificateFailureCodes.REPLAY_INVALID,
        'replay:dependency-closure',
        'Ordered dependency-closure fingerprint does not recompute',
        composite,
        certificate.body.replayFingerprint,
      );
    }
    const serviceVersion = bundle.receipts[0]?.facts.serviceVersion;
    if (!serviceVersion) {
      throw new DeepImprovementCommonCertificateError(
        DeepImprovementCommonCertificateFailureCodes.RECEIPT_MISSING,
        'receipt:service-version',
        'Certificate has no shared receipt service version',
      );
    }
    await verifyReceipts(bundle, coveredEvents, artifacts, input.providers, serviceVersion);
    const first = coveredEvents[0] as VerifiedLedgerEvent;
    const last = coveredEvents.at(-1) as VerifiedLedgerEvent;
    if (
      first.frame.prev_record_hash !== certificate.body.startHeadHash
      || last.frame.record_hash !== certificate.body.finalHeadHash
    ) {
      throw new DeepImprovementCommonCertificateError(
        DeepImprovementCommonCertificateFailureCodes.LEDGER_INVALID,
        'ledger:heads',
        'Certificate heads differ from the verified replay range',
      );
    }
    const offlinePromotion = requiredArtifact(
      artifacts,
      DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE,
    ).material as DeepImprovementPromotionEvidenceMaterial;
    if (verdictFromEvidence(input.projectionEvents, offlinePromotion) !== certificate.body.verdict) {
      throw new DeepImprovementCommonCertificateError(
        DeepImprovementCommonCertificateFailureCodes.PROJECTION_INVALID,
        'certificate:verdict',
        'Certificate verdict does not re-derive from typed event evidence',
      );
    }
    const recomputedCertificateDigest = digest(certificate.body);
    if (recomputedCertificateDigest !== certificate.certificateDigest) {
      throw new DeepImprovementCommonCertificateError(
        DeepImprovementCommonCertificateFailureCodes.CERTIFICATE_INVALID,
        'certificate:digest',
        'Certificate body digest does not recompute',
        recomputedCertificateDigest,
        certificate.certificateDigest,
      );
    }
    const authorityEpoch = bundle.receipts.at(-1)?.facts.authorityEpoch;
    if (authorityEpoch === undefined) {
      throw new DeepImprovementCommonCertificateError(
        DeepImprovementCommonCertificateFailureCodes.RECEIPT_MISSING,
        'certificate:terminal-receipt',
        'Certificate has no terminal receipt',
      );
    }
    const certificateUnsigned = certificateUnsignedReceipt(
      certificate.body,
      certificate.certificateDigest,
      certificate.sharedCertificationReceipt.issuer,
      certificate.sharedCertificationReceipt.issued_at,
      authorityEpoch,
    );
    await verifyShared(
      certificate.sharedCertificationReceipt,
      certificateUnsigned,
      input.providers,
      'certificate:certification',
    );
    const verifierReceiptCore = Object.freeze({
      receiptVersion: 1 as const,
      certificateDigest: certificate.certificateDigest,
      verifierVersion: 'deep-improvement-common-offline-verifier@1',
      rulesetDigest: digest(DEEP_IMPROVEMENT_COMMON_NAMED_DIGEST_CLOSURE_RULES),
      replayFingerprint: certificate.body.replayFingerprint,
      evidenceDigests: Object.freeze([
        projectionDigest,
        certificate.body.receiptChainDigest,
        artifactSetDigest,
      ]),
    });
    return Object.freeze({
      verdict: 'valid',
      certificateDigest: certificate.certificateDigest,
      replayFingerprint: certificate.body.replayFingerprint,
      projectionIntegrityDigest: projectionDigest,
      receiptChainDigest: certificate.body.receiptChainDigest,
      artifactSetDigest,
      verificationReceipt: Object.freeze({
        ...verifierReceiptCore,
        verificationDigest: digest(verifierReceiptCore),
      }),
    });
  } catch (error: unknown) {
    return failureResult(error);
  }
}
