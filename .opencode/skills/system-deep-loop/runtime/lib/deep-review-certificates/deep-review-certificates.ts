// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Certificates and Receipts
// ───────────────────────────────────────────────────────────────────

import { AppendOnlyLedger } from '../authorized-ledger/index.js';
import {
  DeepReviewWireEventTypes,
} from '../deep-review-ledger-schema/index.js';
import {
  deepReviewProjectionIntegrityDigest,
  foldDeepReviewEvents,
} from '../deep-review-reducers/index.js';
import {
  DEEP_REVIEW_ARTIFACT_KIND_REGISTRY,
  DeepReviewArtifactKinds,
  readDeepReviewArtifact,
} from '../deep-review-sealed-artifacts/index.js';
import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  BoundaryReceiptIssuer,
  BoundaryRegistry,
  certifyBoundaryReceipt,
  verifyBoundaryReceiptEvent,
  verifyBoundaryReceiptCertification,
} from '../receipts-and-effect-recovery/index.js';
import { deriveReplayFingerprint } from '../replay-fingerprint/index.js';
import {
  SealedArtifactError,
  SealedArtifactErrorCodes,
} from '../sealed-reference-artifacts/index.js';
import {
  DeepReviewCertificateError,
  DeepReviewCertificateFailureCodes,
  DeepReviewTransitionKinds,
} from './deep-review-certificate-types.js';
import {
  parseDeepReviewCertificateBundle,
  parseDeepReviewRunCertificate,
  parseDeepReviewTransitionReceipt,
} from './deep-review-certificate-validation.js';

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type { DeepReviewLedgerEvent } from '../deep-review-ledger-schema/index.js';
import type {
  DeepReviewProjectionState,
} from '../deep-review-reducers/index.js';
import type {
  DeepReviewArtifactKind,
  DeepReviewArtifactLifecycle,
  DeepReviewArtifactMaterial,
  DeepReviewSealedArtifactBinding,
  DeepReviewVerifiedSealedArtifact,
} from '../deep-review-sealed-artifacts/index.js';
import type {
  BoundaryKind,
  BoundaryDefinition,
  BoundaryReceiptPayload,
  BoundaryScope,
  CertificationProfile,
  CertificationProviderRegistry,
  LedgerHeadFacts,
} from '../receipts-and-effect-recovery/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type {
  DeepReviewCertificateArtifactClaim,
  DeepReviewCertificateBundle,
  DeepReviewCertificateConvergenceEvidence,
  DeepReviewCertificateIssuerInput,
  DeepReviewCertificateLifecycleResult,
  DeepReviewNamedDigestClosureRule,
  DeepReviewCertificateStatusEvidence,
  DeepReviewOfflineVerificationFailure,
  DeepReviewOfflineVerificationInput,
  DeepReviewOfflineVerificationResult,
  DeepReviewRunCertificate,
  DeepReviewRunCertificateBody,
  DeepReviewTransitionDisposition,
  DeepReviewTransitionKind,
  DeepReviewTransitionReceipt,
  DeepReviewTransitionReceiptFacts,
  DeepReviewTransitionReceiptInput,
  DeepReviewTransitionReceiptSubstrate,
} from './deep-review-certificate-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED TRANSITION PROFILE
// ───────────────────────────────────────────────────────────────────

export const DEEP_REVIEW_CERTIFICATE_VERSION = 1 as const;
export const DEEP_REVIEW_RECEIPT_VERSION = 1 as const;

export const DEEP_REVIEW_REQUIRED_TRANSITION_ORDER = Object.freeze([
  DeepReviewTransitionKinds.INIT,
  DeepReviewTransitionKinds.SCOPE,
  DeepReviewTransitionKinds.PASS,
  DeepReviewTransitionKinds.CANDIDATE,
  DeepReviewTransitionKinds.EVIDENCE,
  DeepReviewTransitionKinds.ADJUDICATION,
  DeepReviewTransitionKinds.LINEAGE,
  DeepReviewTransitionKinds.REVIEW_DEPTH,
  DeepReviewTransitionKinds.CONVERGENCE,
  DeepReviewTransitionKinds.SYNTHESIS,
  DeepReviewTransitionKinds.REPORT,
  DeepReviewTransitionKinds.CONTINUITY,
  DeepReviewTransitionKinds.COMPLETION,
] as const);

const REQUIRED_TRANSITION_CARDINALITY: Readonly<Record<
  (typeof DEEP_REVIEW_REQUIRED_TRANSITION_ORDER)[number],
  'exactly-one' | 'at-least-one'
>> = Object.freeze({
  init: 'exactly-one',
  scope: 'at-least-one',
  'dimension-pass': 'at-least-one',
  candidate: 'at-least-one',
  evidence: 'at-least-one',
  adjudication: 'at-least-one',
  lineage: 'at-least-one',
  'review-depth': 'at-least-one',
  convergence: 'exactly-one',
  synthesis: 'exactly-one',
  report: 'exactly-one',
  continuity: 'at-least-one',
  completion: 'exactly-one',
});

const REQUIRED_TRANSITION_RANK = new Map<DeepReviewTransitionKind, number>(
  DEEP_REVIEW_REQUIRED_TRANSITION_ORDER.map((kind, index) => [kind, index]),
);

const TRANSITION_BOUNDARIES: Readonly<Record<
  DeepReviewTransitionKind,
  Readonly<{ kind: BoundaryKind; scope: BoundaryScope; fromState: string; toState: string }>
>> = Object.freeze({
  init: Object.freeze({ kind: 'mode-enter', scope: 'mode', fromState: 'planned', toState: 'active' }),
  scope: Object.freeze({ kind: 'phase-enter', scope: 'phase', fromState: 'active', toState: 'active' }),
  'dimension-pass': Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'active', toState: 'active' }),
  candidate: Object.freeze({ kind: 'phase-enter', scope: 'phase', fromState: 'active', toState: 'active' }),
  evidence: Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'active', toState: 'active' }),
  adjudication: Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'active', toState: 'active' }),
  lineage: Object.freeze({ kind: 'phase-handoff', scope: 'phase', fromState: 'active', toState: 'active' }),
  'review-depth': Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'active', toState: 'active' }),
  convergence: Object.freeze({ kind: 'phase-pause', scope: 'phase', fromState: 'active', toState: 'converging' }),
  'blocked-stop': Object.freeze({ kind: 'mode-pause', scope: 'mode', fromState: 'converging', toState: 'blocked' }),
  synthesis: Object.freeze({ kind: 'phase-handoff', scope: 'phase', fromState: 'converging', toState: 'active' }),
  report: Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'active', toState: 'active' }),
  continuity: Object.freeze({ kind: 'mode-handoff', scope: 'mode', fromState: 'active', toState: 'active' }),
  completion: Object.freeze({ kind: 'mode-completion', scope: 'mode', fromState: 'active', toState: 'complete' }),
  recovery: Object.freeze({ kind: 'mode-resume', scope: 'mode', fromState: 'paused', toState: 'active' }),
});

const TRANSITION_EVENT_TYPES: Readonly<Record<
  DeepReviewTransitionKind,
  ReadonlySet<string>
>> = Object.freeze({
  init: new Set([DeepReviewWireEventTypes['deep_review.run_initialized']]),
  scope: new Set([
    DeepReviewWireEventTypes['deep_review.scope_resolved'],
    DeepReviewWireEventTypes['deep_review.dimension_ordered'],
    DeepReviewWireEventTypes['deep_review.protocol_plan_recorded'],
  ]),
  'dimension-pass': new Set([
    DeepReviewWireEventTypes['deep_review.dimension_pass_started'],
    DeepReviewWireEventTypes['deep_review.dimension_pass_completed'],
  ]),
  candidate: new Set([DeepReviewWireEventTypes['deep_review.finding_candidate_emitted']]),
  evidence: new Set([
    DeepReviewWireEventTypes['deep_review.evidence_observed'],
    DeepReviewWireEventTypes['deep_review.evidence_reconciled'],
  ]),
  adjudication: new Set([DeepReviewWireEventTypes['deep_review.claim_adjudication_recorded']]),
  lineage: new Set([
    DeepReviewWireEventTypes['deep_review.finding_lineage_recorded'],
    DeepReviewWireEventTypes['deep_review.finding_state_changed'],
  ]),
  'review-depth': new Set([DeepReviewWireEventTypes['deep_review.review_depth_recorded']]),
  convergence: new Set([
    DeepReviewWireEventTypes['deep_review.convergence_evaluated'],
    DeepReviewWireEventTypes['deep_review.graph_convergence_evaluated'],
  ]),
  'blocked-stop': new Set([
    DeepReviewWireEventTypes['deep_review.blocked_stop_recorded'],
    DeepReviewWireEventTypes['deep_review.pause_recorded'],
  ]),
  synthesis: new Set([DeepReviewWireEventTypes['deep_review.synthesis_started']]),
  report: new Set([DeepReviewWireEventTypes['deep_review.review_report_committed']]),
  continuity: new Set([
    DeepReviewWireEventTypes['deep_review.continuity_save_requested'],
    DeepReviewWireEventTypes['deep_review.continuity_save_completed'],
    DeepReviewWireEventTypes['deep_review.continuity_save_failed'],
  ]),
  completion: new Set([DeepReviewWireEventTypes['deep_review.run_completed']]),
  recovery: new Set([
    DeepReviewWireEventTypes['deep_review.run_resumed'],
    DeepReviewWireEventTypes['deep_review.run_restarted'],
    DeepReviewWireEventTypes['deep_review.recovery_started'],
  ]),
});

function closureRule(
  containingArtifactKind: DeepReviewArtifactKind,
  field: string,
  expectedArtifactKinds: readonly DeepReviewArtifactKind[],
  cardinality: DeepReviewNamedDigestClosureRule['cardinality'],
): DeepReviewNamedDigestClosureRule {
  return Object.freeze({
    containingArtifactKind,
    field,
    expectedArtifactKinds: Object.freeze([...expectedArtifactKinds]),
    cardinality,
  });
}

const PASS_INPUT_KINDS = Object.freeze([
  DeepReviewArtifactKinds.TARGET_SNAPSHOT,
  DeepReviewArtifactKinds.SCOPE_REFERENCE_SET,
  DeepReviewArtifactKinds.REVIEW_CONTRACT,
  DeepReviewArtifactKinds.CONTEXT_SNAPSHOT,
  DeepReviewArtifactKinds.CAPABILITY_COMMITMENT,
  DeepReviewArtifactKinds.PROMPT_RUBRIC,
  DeepReviewArtifactKinds.POLICY_INPUT,
] as const);

export const DEEP_REVIEW_NAMED_DIGEST_CLOSURE_RULES = Object.freeze([
  closureRule(DeepReviewArtifactKinds.DIMENSION_PASS, 'orderedInputDigests', PASS_INPUT_KINDS, 'array'),
  closureRule(DeepReviewArtifactKinds.DIMENSION_PASS, 'selectedTargetDigests', [DeepReviewArtifactKinds.TARGET_SNAPSHOT], 'array'),
  closureRule(DeepReviewArtifactKinds.DIMENSION_PASS, 'searchLedgerDigest', [DeepReviewArtifactKinds.SCOPE_REFERENCE_SET], 'scalar'),
  closureRule(DeepReviewArtifactKinds.DIMENSION_PASS, 'diagnosticsDigest', [DeepReviewArtifactKinds.CONTEXT_SNAPSHOT], 'scalar'),
  closureRule(DeepReviewArtifactKinds.DIMENSION_PASS, 'observationDigests', [DeepReviewArtifactKinds.CONTEXT_SNAPSHOT], 'array'),
  closureRule(DeepReviewArtifactKinds.DIMENSION_PASS, 'graphEventDigest', [DeepReviewArtifactKinds.CONTEXT_SNAPSHOT], 'scalar'),
  closureRule(DeepReviewArtifactKinds.DIMENSION_PASS, 'iterationDigest', [DeepReviewArtifactKinds.REVIEW_CONTRACT], 'scalar'),
  closureRule(DeepReviewArtifactKinds.DIMENSION_PASS, 'deltaDigest', [DeepReviewArtifactKinds.CONTEXT_SNAPSHOT], 'scalar'),
  closureRule(DeepReviewArtifactKinds.CANDIDATE_EVIDENCE, 'claimDigest', [DeepReviewArtifactKinds.DIMENSION_PASS], 'scalar'),
  closureRule(DeepReviewArtifactKinds.CANDIDATE_EVIDENCE, 'evidenceDigests', [DeepReviewArtifactKinds.DIMENSION_PASS], 'array'),
  closureRule(DeepReviewArtifactKinds.CANDIDATE_EVIDENCE, 'intermediateFactDigests', [DeepReviewArtifactKinds.DIMENSION_PASS], 'array'),
  closureRule(DeepReviewArtifactKinds.CANDIDATE_EVIDENCE, 'reproductionDigest', [DeepReviewArtifactKinds.DIMENSION_PASS], 'scalar'),
  closureRule(DeepReviewArtifactKinds.CANDIDATE_EVIDENCE, 'refutationDigest', [DeepReviewArtifactKinds.DIMENSION_PASS], 'scalar'),
  closureRule(DeepReviewArtifactKinds.ADJUDICATION_EVIDENCE, 'claimDigest', [DeepReviewArtifactKinds.CANDIDATE_EVIDENCE], 'scalar'),
  closureRule(DeepReviewArtifactKinds.ADJUDICATION_EVIDENCE, 'evidenceDigests', [DeepReviewArtifactKinds.CANDIDATE_EVIDENCE], 'array'),
  closureRule(DeepReviewArtifactKinds.ADJUDICATION_EVIDENCE, 'intermediateFactDigests', [DeepReviewArtifactKinds.CANDIDATE_EVIDENCE], 'array'),
  closureRule(DeepReviewArtifactKinds.ADJUDICATION_EVIDENCE, 'reproductionDigest', [DeepReviewArtifactKinds.CANDIDATE_EVIDENCE], 'scalar'),
  closureRule(DeepReviewArtifactKinds.ADJUDICATION_EVIDENCE, 'refutationDigest', [DeepReviewArtifactKinds.CANDIDATE_EVIDENCE], 'scalar'),
  closureRule(DeepReviewArtifactKinds.CONVERGENCE_WITNESS, 'orderedInputDigests', [
    DeepReviewArtifactKinds.DIMENSION_PASS,
    DeepReviewArtifactKinds.CANDIDATE_EVIDENCE,
    DeepReviewArtifactKinds.ADJUDICATION_EVIDENCE,
  ], 'array'),
  closureRule(DeepReviewArtifactKinds.CONVERGENCE_WITNESS, 'gateResultDigests', [DeepReviewArtifactKinds.ADJUDICATION_EVIDENCE], 'array'),
  closureRule(DeepReviewArtifactKinds.SYNTHESIS_VIEW, 'reportDigest', [DeepReviewArtifactKinds.DIMENSION_PASS], 'scalar'),
  closureRule(DeepReviewArtifactKinds.SYNTHESIS_REPORT, 'reportDigest', [DeepReviewArtifactKinds.DIMENSION_PASS], 'scalar'),
  closureRule(DeepReviewArtifactKinds.RESUME_HANDOFF, 'priorReferenceSetDigest', [DeepReviewArtifactKinds.SYNTHESIS_REPORT], 'scalar'),
  closureRule(DeepReviewArtifactKinds.RESUME_HANDOFF, 'changedInputDigest', [DeepReviewArtifactKinds.TARGET_SNAPSHOT], 'scalar'),
] as const satisfies readonly DeepReviewNamedDigestClosureRule[]);

interface TransitionDispositionEvidence {
  readonly disposition: DeepReviewTransitionDisposition;
  readonly dispositionReason: string;
}

interface ReceiptCertificationInput {
  readonly receiptId: string;
  readonly boundaryId: string;
  readonly boundaryKind: BoundaryKind;
  readonly scope: BoundaryScope;
  readonly scopeId: string;
  readonly fromState: string;
  readonly toState: string;
  readonly fromHead: LedgerHeadFacts;
  readonly resultHead: LedgerHeadFacts;
  readonly resultEventId: string;
  readonly resultEventType: string;
  readonly resultEventDigest: string;
  readonly resultCode: string;
  readonly evidenceDigest: string;
  readonly artifactDigests: readonly string[];
  readonly replayFingerprint: string;
  readonly authorityEpoch: number;
  readonly correlationId: string;
  readonly causationId: string;
  readonly issuer: string;
  readonly issuedAt: string;
  readonly idempotencyKey: string;
  readonly certificationProfile: CertificationProfile;
}

interface TransitionReceiptBaseContext {
  readonly runId: string;
  readonly replayFingerprint: string;
  readonly priorReceiptDigest: string | null;
  readonly ledgerEvents: readonly VerifiedLedgerEvent[];
  readonly certificationProfile: CertificationProfile;
  readonly providers: CertificationProviderRegistry;
  readonly receiptSubstrate: DeepReviewTransitionReceiptSubstrate;
  readonly issuer: string;
  readonly issuedAt: string;
}

interface TransitionReceiptContext extends TransitionReceiptBaseContext {
  readonly artifactStore?: DeepReviewCertificateIssuerInput<JsonObject>['artifactStore'];
  readonly artifactBindings?: readonly DeepReviewSealedArtifactBinding[];
  readonly artifactKindsByQualifiedDigest?: ReadonlyMap<string, DeepReviewArtifactKind>;
}

interface PreparedTransitionReceiptContext extends TransitionReceiptBaseContext {
  readonly artifactEvidenceByQualifiedDigest: ReadonlyMap<string, ArtifactReferenceEvidence>;
  readonly memoryHandoffCorrespondenceByQualifiedDigest: ReadonlyMap<
    string,
    MemoryHandoffCorrespondence
  >;
}

interface ArtifactReferenceEvidence {
  readonly kind: DeepReviewArtifactKind;
  readonly material: DeepReviewArtifactMaterial;
  readonly contentDigest: string;
  readonly qualifiedDigest: string;
}

interface VerifiedArtifactSet {
  readonly claims: readonly DeepReviewCertificateArtifactClaim[];
  readonly evidenceByQualifiedDigest: ReadonlyMap<string, ArtifactReferenceEvidence>;
}

interface MemoryHandoffCorrespondence {
  readonly finalReferenceSetDigest: string;
  readonly offeredViewDigests: ReadonlySet<string>;
}

interface TransitionArtifactProfile {
  readonly inputLifecycles: ReadonlySet<DeepReviewArtifactLifecycle>;
  readonly outputLifecycles: ReadonlySet<DeepReviewArtifactLifecycle>;
}

interface TransitionOutputClaim {
  readonly transitionKind: DeepReviewTransitionKind;
  readonly logicalOperationId: string;
  readonly outputArtifactQualifiedDigests: readonly string[];
}

const ALL_ARTIFACT_LIFECYCLES = new Set<DeepReviewArtifactLifecycle>(
  DEEP_REVIEW_ARTIFACT_KIND_REGISTRY.map((entry) => entry.lifecycle),
);
const ARTIFACT_LIFECYCLE_BY_KIND = new Map<
  DeepReviewArtifactKind,
  DeepReviewArtifactLifecycle
>(DEEP_REVIEW_ARTIFACT_KIND_REGISTRY.map((entry) => [entry.artifactKind, entry.lifecycle]));

function artifactLifecycles(
  ...values: readonly DeepReviewArtifactLifecycle[]
): ReadonlySet<DeepReviewArtifactLifecycle> {
  return new Set(values);
}

const TRANSITION_ARTIFACT_PROFILES: Readonly<Record<
  DeepReviewTransitionKind,
  TransitionArtifactProfile
>> = Object.freeze({
  init: Object.freeze({
    inputLifecycles: artifactLifecycles('scope-init'),
    outputLifecycles: artifactLifecycles('scope-init'),
  }),
  scope: Object.freeze({
    inputLifecycles: artifactLifecycles('scope-init'),
    outputLifecycles: artifactLifecycles('scope-init'),
  }),
  'dimension-pass': Object.freeze({
    inputLifecycles: artifactLifecycles('scope-init', 'dimension-pass'),
    outputLifecycles: artifactLifecycles('dimension-pass'),
  }),
  candidate: Object.freeze({
    inputLifecycles: artifactLifecycles('dimension-pass'),
    outputLifecycles: artifactLifecycles('candidate-adjudication'),
  }),
  evidence: Object.freeze({
    inputLifecycles: artifactLifecycles('dimension-pass', 'candidate-adjudication'),
    outputLifecycles: artifactLifecycles('candidate-adjudication'),
  }),
  adjudication: Object.freeze({
    inputLifecycles: artifactLifecycles('candidate-adjudication'),
    outputLifecycles: artifactLifecycles('candidate-adjudication'),
  }),
  lineage: Object.freeze({
    inputLifecycles: artifactLifecycles('candidate-adjudication'),
    outputLifecycles: artifactLifecycles('candidate-adjudication'),
  }),
  'review-depth': Object.freeze({
    inputLifecycles: artifactLifecycles('dimension-pass', 'candidate-adjudication'),
    outputLifecycles: artifactLifecycles('dimension-pass'),
  }),
  convergence: Object.freeze({
    inputLifecycles: artifactLifecycles('dimension-pass', 'candidate-adjudication', 'convergence'),
    outputLifecycles: artifactLifecycles('convergence'),
  }),
  'blocked-stop': Object.freeze({
    inputLifecycles: artifactLifecycles('convergence'),
    outputLifecycles: artifactLifecycles('convergence'),
  }),
  synthesis: Object.freeze({
    inputLifecycles: artifactLifecycles('dimension-pass', 'candidate-adjudication', 'convergence'),
    outputLifecycles: artifactLifecycles('synthesis'),
  }),
  report: Object.freeze({
    inputLifecycles: artifactLifecycles('synthesis'),
    outputLifecycles: artifactLifecycles('synthesis'),
  }),
  continuity: Object.freeze({
    inputLifecycles: ALL_ARTIFACT_LIFECYCLES,
    outputLifecycles: artifactLifecycles('resume-save'),
  }),
  completion: Object.freeze({
    inputLifecycles: ALL_ARTIFACT_LIFECYCLES,
    outputLifecycles: artifactLifecycles('synthesis', 'resume-save'),
  }),
  recovery: Object.freeze({
    inputLifecycles: ALL_ARTIFACT_LIFECYCLES,
    outputLifecycles: ALL_ARTIFACT_LIFECYCLES,
  }),
});

function asJson(value: unknown): JsonObject {
  return value as JsonObject;
}

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(asJson(value)));
}

function uniqueSorted(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)].sort());
}

function contentDigest(qualifiedDigest: string): string {
  const separator = qualifiedDigest.indexOf(':');
  return separator === -1 ? qualifiedDigest : qualifiedDigest.slice(separator + 1);
}

function recordValue(value: unknown): Readonly<Record<string, unknown>> | null {
  if (value === null || Array.isArray(value) || typeof value !== 'object') return null;
  return value as Readonly<Record<string, unknown>>;
}

function stringArray(value: unknown): readonly string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string')
    ? value
    : [];
}

function artifactEvidence(
  verified: DeepReviewVerifiedSealedArtifact,
): ArtifactReferenceEvidence {
  let decoded: unknown;
  try {
    decoded = JSON.parse(new TextDecoder().decode(Uint8Array.from(verified.bytes)));
  } catch {
    throw new DeepReviewCertificateError(
      DeepReviewCertificateFailureCodes.ARTIFACT_INVALID,
      `artifact:${verified.binding.reference.qualified_digest}`,
      'Verified artifact bytes do not expose their canonical material identity',
    );
  }
  const capsule = recordValue(decoded);
  const material = recordValue(capsule?.material);
  if (capsule?.artifactKind !== verified.binding.artifactKind || !material) {
    throw new DeepReviewCertificateError(
      DeepReviewCertificateFailureCodes.ARTIFACT_INVALID,
      `artifact:${verified.binding.reference.qualified_digest}`,
      'Verified artifact material identity disagrees with its sealed binding',
    );
  }
  return Object.freeze({
    kind: verified.binding.artifactKind,
    material: material as unknown as DeepReviewArtifactMaterial,
    contentDigest: verified.descriptor.content_digest,
    qualifiedDigest: verified.binding.reference.qualified_digest,
  });
}

function headFacts(
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

function eventHeads(event: VerifiedLedgerEvent): {
  readonly fromHead: LedgerHeadFacts;
  readonly resultHead: LedgerHeadFacts;
} {
  return Object.freeze({
    fromHead: headFacts(
      event.frame.ledger_id,
      event.frame.sequence - 1,
      event.frame.prev_record_hash,
    ),
    resultHead: headFacts(
      event.frame.ledger_id,
      event.frame.sequence,
      event.frame.record_hash,
    ),
  });
}

function transitionId(
  runId: string,
  input: DeepReviewTransitionReceiptInput,
): string {
  return `dr-transition:${digest({
    runId,
    transitionKind: input.transitionKind,
    logicalOperationId: input.logicalOperationId,
  })}`;
}

function eventData(event: VerifiedLedgerEvent): Readonly<Record<string, unknown>> {
  const payload = event.event.effective.envelope.payload;
  const data = payload.data;
  if (data === null || Array.isArray(data) || typeof data !== 'object') {
    throw new DeepReviewCertificateError(
      DeepReviewCertificateFailureCodes.LEDGER_INVALID,
      `event:${event.frame.sequence}`,
      'Transition result event is missing its closed data object',
    );
  }
  return data as Readonly<Record<string, unknown>>;
}

function eventScope(event: VerifiedLedgerEvent): Readonly<Record<string, unknown>> {
  const scope = recordValue(event.event.effective.envelope.payload.scope);
  if (!scope) {
    throw new DeepReviewCertificateError(
      DeepReviewCertificateFailureCodes.LEDGER_INVALID,
      `event:${event.frame.sequence}`,
      'Transition result event is missing its closed scope object',
    );
  }
  return scope;
}

function primaryArtifactIdentity(evidence: ArtifactReferenceEvidence): string | null {
  const material = evidence.material as unknown as Readonly<Record<string, unknown>>;
  const field = evidence.kind === DeepReviewArtifactKinds.DIMENSION_PASS
    ? 'deltaDigest'
    : evidence.kind === DeepReviewArtifactKinds.CANDIDATE_EVIDENCE
      || evidence.kind === DeepReviewArtifactKinds.ADJUDICATION_EVIDENCE
      ? 'claimDigest'
      : evidence.kind === DeepReviewArtifactKinds.CONVERGENCE_WITNESS
        ? 'graphConvergenceDigest'
        : evidence.kind === DeepReviewArtifactKinds.SYNTHESIS_VIEW
          || evidence.kind === DeepReviewArtifactKinds.SYNTHESIS_REPORT
          ? 'reportDigest'
          : evidence.kind === DeepReviewArtifactKinds.RESUME_HANDOFF
            ? 'priorReferenceSetDigest'
            : 'materialDigest';
  const value = field === null ? null : material[field];
  return typeof value === 'string' ? value : null;
}

function memoryHandoffCorrespondences(
  transitions: readonly DeepReviewTransitionReceiptInput[],
  evidenceByQualifiedDigest: ReadonlyMap<string, ArtifactReferenceEvidence>,
): ReadonlyMap<string, MemoryHandoffCorrespondence> {
  const correspondences = new Map<string, MemoryHandoffCorrespondence>();
  for (const transition of transitions) {
    if (transition.transitionKind !== DeepReviewTransitionKinds.CONTINUITY) continue;
    const offeredViewDigests = new Set<string>();
    for (const reference of transition.inputArtifactQualifiedDigests) {
      const evidence = evidenceByQualifiedDigest.get(reference);
      if (!evidence || ARTIFACT_LIFECYCLE_BY_KIND.get(evidence.kind) !== 'synthesis') continue;
      const identity = primaryArtifactIdentity(evidence);
      if (identity !== null) offeredViewDigests.add(identity);
    }
    const correspondence = Object.freeze({
      finalReferenceSetDigest: digest(transition.inputArtifactQualifiedDigests),
      offeredViewDigests,
    });
    for (const reference of transition.outputArtifactQualifiedDigests) {
      const existing = correspondences.get(reference);
      if (existing && (
        existing.finalReferenceSetDigest !== correspondence.finalReferenceSetDigest
      )) {
        throw new DeepReviewCertificateError(
          DeepReviewCertificateFailureCodes.ARTIFACT_INVALID,
          'transition:continuity:outputs',
          'One continuity artifact cannot represent conflicting final reference sets',
        );
      }
      correspondences.set(reference, correspondence);
    }
  }
  return correspondences;
}

function artifactCorrespondsToEvent(
  evidence: ArtifactReferenceEvidence,
  event: VerifiedLedgerEvent,
  _memoryHandoffCorrespondence?: MemoryHandoffCorrespondence,
): boolean {
  const envelope = event.event.effective.envelope;
  const payload = recordValue(envelope.payload);
  const material = evidence.material as unknown as Readonly<Record<string, unknown>>;
  const stem = payload?.stem;
  return typeof stem === 'string'
    && stem in DeepReviewWireEventTypes
    && DeepReviewWireEventTypes[stem as keyof typeof DeepReviewWireEventTypes]
      === envelope.event_type
    && material.eventStem === stem
    && material.eventId === envelope.event_id
    && material.authorityEpoch === envelope.authority_epoch;
}

function assertProjectionMatchesVerifiedLedger(
  projectionEvents: readonly DeepReviewLedgerEvent[],
  ledgerEvents: readonly VerifiedLedgerEvent[],
): void {
  const verifiedEnvelopes = ledgerEvents.map((event) => event.event.effective.envelope);
  if (canonicalJson(asJson(projectionEvents)) !== canonicalJson(asJson(verifiedEnvelopes))) {
    throw new DeepReviewCertificateError(
      DeepReviewCertificateFailureCodes.PROJECTION_INVALID,
      'projection:ledger-events',
      'Projection events must exactly match the ordered authorized-ledger replay range',
      digest(verifiedEnvelopes),
      digest(projectionEvents),
    );
  }
}

function resultQualityDisposition(
  eventType: string,
  data: Readonly<Record<string, unknown>>,
): TransitionDispositionEvidence | null {
  switch (eventType) {
    case DeepReviewWireEventTypes['deep_review.dimension_pass_completed']:
      if (data.passStatus === 'blocked') {
        return { disposition: 'blocked', dispositionReason: 'Dimension pass is blocked.' };
      }
      if (data.passStatus === 'incomplete') {
        return { disposition: 'incomplete', dispositionReason: 'Dimension pass is incomplete.' };
      }
      return null;
    case DeepReviewWireEventTypes['deep_review.evidence_observed']:
    case DeepReviewWireEventTypes['deep_review.evidence_reconciled']:
      if (
        data.causalProximityStatus !== 'direct'
        || data.stabilityStatus !== 'stable'
        || data.relevanceStatus !== 'relevant'
      ) {
        return { disposition: 'in_doubt', dispositionReason: 'Evidence quality remains unresolved.' };
      }
      return null;
    case DeepReviewWireEventTypes['deep_review.claim_adjudication_recorded']:
      return data.adjudicationOutcome === 'accepted'
        ? null
        : { disposition: 'incomplete', dispositionReason: 'Candidate was not accepted as an active finding.' };
    case DeepReviewWireEventTypes['deep_review.continuity_save_failed']:
      return data.retryable === true
        ? { disposition: 'in_doubt', dispositionReason: 'Continuity effect requires reconciliation before retry.' }
        : { disposition: 'failed', dispositionReason: 'Continuity persistence failed conclusively.' };
    default:
      return null;
  }
}

function transitionDisposition(
  transitionKind: DeepReviewTransitionKind,
  event: VerifiedLedgerEvent,
): TransitionDispositionEvidence {
  const eventType = event.event.effective.envelope.event_type;
  if (!TRANSITION_EVENT_TYPES[transitionKind].has(eventType)) {
    throw new DeepReviewCertificateError(
      DeepReviewCertificateFailureCodes.LEDGER_INVALID,
      `transition:${transitionKind}`,
      'Transition kind does not match the authorized result event type',
    );
  }
  const data = eventData(event);
  const qualityDisposition = resultQualityDisposition(eventType, data);
  if (qualityDisposition) return qualityDisposition;
  switch (transitionKind) {
    case 'init':
      return { disposition: 'succeeded', dispositionReason: 'Authorized run initialization is durable.' };
    case 'scope':
      return { disposition: 'succeeded', dispositionReason: 'Authorized scope evidence is durable.' };
    case 'dimension-pass':
      return { disposition: 'succeeded', dispositionReason: 'Authorized dimension-pass evidence is durable.' };
    case 'candidate':
      return { disposition: 'succeeded', dispositionReason: 'Authorized raw candidate evidence is durable.' };
    case 'evidence':
      return { disposition: 'succeeded', dispositionReason: 'Authorized independent evidence is durable.' };
    case 'adjudication':
      return { disposition: 'succeeded', dispositionReason: 'Authorized adjudication evidence is durable.' };
    case 'lineage':
      return { disposition: 'succeeded', dispositionReason: 'Authorized finding lineage is durable.' };
    case 'review-depth':
      return { disposition: 'succeeded', dispositionReason: 'Authorized review-depth evidence is durable.' };
    case 'convergence': {
      switch (data.decision) {
        case 'blocked':
          return { disposition: 'blocked', dispositionReason: 'Convergence evaluation is blocked.' };
        case 'continue':
          return { disposition: 'incomplete', dispositionReason: 'Convergence requires another iteration.' };
        case 'converged':
          return { disposition: 'succeeded', dispositionReason: 'Convergence evidence supports completion.' };
        case 'incomplete':
          return { disposition: 'incomplete', dispositionReason: 'Convergence evidence is incomplete.' };
        case 'recover':
          return { disposition: 'in_doubt', dispositionReason: 'Convergence requires recovery evidence.' };
        default:
          throw new DeepReviewCertificateError(
            DeepReviewCertificateFailureCodes.CONVERGENCE_INVALID,
            'transition:convergence',
            'Convergence event carries an unregistered decision',
          );
      }
    }
    case 'blocked-stop':
      return { disposition: 'blocked', dispositionReason: 'Authorized blocked-stop evidence prevents completion.' };
    case 'synthesis':
      return { disposition: 'succeeded', dispositionReason: 'Authorized synthesis output is durable.' };
    case 'report':
      return { disposition: 'succeeded', dispositionReason: 'Authorized review-report publication is durable.' };
    case 'continuity':
      return { disposition: 'succeeded', dispositionReason: 'Authorized continuity evidence is durable.' };
    case 'completion':
      return data.terminalStatus === 'completed' && data.verdict === 'pass'
        ? { disposition: 'succeeded', dispositionReason: 'Authorized run completion is durable.' }
        : data.terminalStatus === 'blocked'
          ? { disposition: 'blocked', dispositionReason: 'Run completion is blocked.' }
          : { disposition: 'incomplete', dispositionReason: 'Run completion is explicitly incomplete.' };
    case 'recovery': {
      if (eventType === DeepReviewWireEventTypes['deep_review.recovery_started']) {
        return { disposition: 'applied', dispositionReason: 'Authorized recovery work started.' };
      }
      switch (data.compatibilityDecision) {
        case 'exact':
          return { disposition: 'applied', dispositionReason: 'Recovery reused the exact persisted runtime contract.' };
        case 'compatible':
          return { disposition: 'applied', dispositionReason: 'Recovery reused a compatible persisted runtime contract.' };
        case 'migrate':
          return { disposition: 'in_doubt', dispositionReason: 'Recovery requires a verified migration before reuse.' };
        case 'pin-old-runtime':
          return { disposition: 'in_doubt', dispositionReason: 'Recovery requires the prior runtime before reuse.' };
        case 'blocked':
          return { disposition: 'blocked', dispositionReason: 'Recovery compatibility is blocked.' };
        default:
          throw new DeepReviewCertificateError(
            DeepReviewCertificateFailureCodes.LEDGER_INVALID,
            'transition:recovery',
            'Recovery event carries an unregistered compatibility decision',
          );
      }
    }
    default: {
      const exhaustiveKind: never = transitionKind;
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.UNSUPPORTED_VERSION,
        'transition:kind',
        `Unsupported transition kind ${String(exhaustiveKind)}`,
      );
    }
  }
}

// ───────────────────────────────────────────────────────────────────
// 2. SHARED CERTIFICATION PROFILE
// ───────────────────────────────────────────────────────────────────

function unsignedSharedReceipt(input: ReceiptCertificationInput): Omit<
  BoundaryReceiptPayload,
  'certification'
> {
  return Object.freeze({
    receipt_id: input.receiptId,
    boundary_id: input.boundaryId,
    boundary_kind: input.boundaryKind,
    scope: input.scope,
    scope_id: input.scopeId,
    from_state: input.fromState,
    to_state: input.toState,
    from_head: input.fromHead,
    result_head: input.resultHead,
    result_event_id: input.resultEventId,
    result_event_type: input.resultEventType,
    result_event_digest: input.resultEventDigest,
    result_code: input.resultCode,
    evidence_digest: input.evidenceDigest,
    artifact_digests: [...input.artifactDigests],
    replay_fingerprint: input.replayFingerprint,
    authority_epoch: input.authorityEpoch,
    correlation_id: input.correlationId,
    causation_id: input.causationId,
    issuer: input.issuer,
    issued_at: input.issuedAt,
    idempotency_key: input.idempotencyKey,
  });
}

async function certifySharedReceipt(
  input: ReceiptCertificationInput,
  providers: CertificationProviderRegistry,
): Promise<BoundaryReceiptPayload> {
  const unsigned = unsignedSharedReceipt(input);
  const certification = await certifyBoundaryReceipt(
    unsigned,
    input.certificationProfile,
    providers,
  );
  return Object.freeze({ ...unsigned, certification }) as BoundaryReceiptPayload;
}

function profileFromSharedReceipt(receipt: BoundaryReceiptPayload): CertificationProfile {
  return Object.freeze({
    scheme: receipt.certification.scheme,
    provider_id: receipt.certification.provider_id,
    key_id: receipt.certification.key_id,
    verifier_version: receipt.certification.verifier_version,
    trust_scope: receipt.certification.trust_scope,
  });
}

async function verifySharedReceipt(
  actual: BoundaryReceiptPayload,
  expectedInput: Omit<ReceiptCertificationInput, 'certificationProfile' | 'issuedAt'>,
  providers: CertificationProviderRegistry,
  location: string,
): Promise<void> {
  const expected = unsignedSharedReceipt({
    ...expectedInput,
    issuedAt: actual.issued_at,
    certificationProfile: profileFromSharedReceipt(actual),
  });
  const { certification: _certification, ...actualUnsigned } = actual;
  if (canonicalJson(expected) !== canonicalJson(actualUnsigned)) {
    throw new DeepReviewCertificateError(
      DeepReviewCertificateFailureCodes.CERTIFICATION_INVALID,
      location,
      'Shared certification receipt does not bind the recomputed domain facts',
      digest(expected),
      digest(actualUnsigned),
    );
  }
  await verifyBoundaryReceiptCertification(actual, providers, true);
}

// ───────────────────────────────────────────────────────────────────
// 3. TRANSITION RECEIPTS
// ───────────────────────────────────────────────────────────────────

function requireArtifactReferences(
  input: DeepReviewTransitionReceiptInput,
  artifactEvidenceByQualifiedDigest: ReadonlyMap<string, ArtifactReferenceEvidence>,
): void {
  const referencesByRole = [
    ['inputs', input.inputArtifactQualifiedDigests],
    ['outputs', input.outputArtifactQualifiedDigests],
  ] as const;
  const references = referencesByRole.flatMap(([, roleReferences]) => roleReferences);
  if (input.outputArtifactQualifiedDigests.length === 0) {
    throw new DeepReviewCertificateError(
      DeepReviewCertificateFailureCodes.EVIDENCE_INCOMPLETE,
      `transition:${input.transitionKind}:outputs`,
      'Every transition receipt requires at least one verified output artifact',
    );
  }
  if (new Set(references).size !== references.length) {
    throw new DeepReviewCertificateError(
      DeepReviewCertificateFailureCodes.CERTIFICATE_INVALID,
      `transition:${input.transitionKind}:artifacts`,
      'Transition artifact references must be unique across inputs and outputs',
    );
  }
  const profile = TRANSITION_ARTIFACT_PROFILES[input.transitionKind];
  for (const [role, roleReferences] of referencesByRole) {
    const allowedLifecycles = role === 'inputs'
      ? profile.inputLifecycles
      : profile.outputLifecycles;
    for (const reference of roleReferences) {
      const evidence = artifactEvidenceByQualifiedDigest.get(reference);
      if (!evidence) {
        throw new DeepReviewCertificateError(
          DeepReviewCertificateFailureCodes.ARTIFACT_INVALID,
          `transition:${input.transitionKind}:${role}`,
          'Transition receipt references an artifact outside the verified run set',
        );
      }
      const lifecycle = ARTIFACT_LIFECYCLE_BY_KIND.get(evidence.kind);
      if (!lifecycle || !allowedLifecycles.has(lifecycle)) {
        throw new DeepReviewCertificateError(
          DeepReviewCertificateFailureCodes.ARTIFACT_INVALID,
          `transition:${input.transitionKind}:${role}`,
          'Transition receipt references a verified artifact of the wrong kind',
        );
      }
    }
  }
}

function requireArtifactEventCorrespondence(
  input: DeepReviewTransitionReceiptInput,
  resultEvent: VerifiedLedgerEvent,
  context: Omit<PreparedTransitionReceiptContext, 'receiptSubstrate'>,
): void {
  for (const reference of input.outputArtifactQualifiedDigests) {
    const evidence = context.artifactEvidenceByQualifiedDigest.get(reference);
    const memoryHandoffCorrespondence = context
      .memoryHandoffCorrespondenceByQualifiedDigest.get(reference);
    if (!evidence || !artifactCorrespondsToEvent(
      evidence,
      resultEvent,
      memoryHandoffCorrespondence,
    )) {
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.ARTIFACT_INVALID,
        `transition:${input.transitionKind}:outputs`,
        'Transition output artifact identity does not correspond to its authorized result event',
      );
    }
  }

  const inputEvidence = input.inputArtifactQualifiedDigests.map((reference) => Object.freeze({
    evidence: context.artifactEvidenceByQualifiedDigest.get(reference),
    memoryHandoffCorrespondence: context
      .memoryHandoffCorrespondenceByQualifiedDigest.get(reference),
  }));
  for (const { evidence, memoryHandoffCorrespondence } of inputEvidence) {
    if (!evidence || !context.ledgerEvents.some((event) => artifactCorrespondsToEvent(
      evidence,
      event,
      memoryHandoffCorrespondence,
    ))) {
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.ARTIFACT_INVALID,
        `transition:${input.transitionKind}:inputs`,
        'Transition input artifact identity has no corresponding authorized provenance event',
      );
    }
  }

}

function assertTransitionOutputArtifactUniqueness(
  transitions: readonly TransitionOutputClaim[],
): void {
  const owners = new Map<string, string>();
  for (const transition of transitions) {
    for (const output of transition.outputArtifactQualifiedDigests) {
      const owner = owners.get(output);
      if (owner !== undefined && owner !== transition.logicalOperationId) {
        throw new DeepReviewCertificateError(
          DeepReviewCertificateFailureCodes.ARTIFACT_INVALID,
          `transition:${transition.transitionKind}:outputs`,
          'A sealed output artifact can belong to only one logical transition receipt',
        );
      }
      owners.set(output, transition.logicalOperationId);
    }
  }
}

function findResultEvent(
  events: readonly VerifiedLedgerEvent[],
  resultEventId: string,
): VerifiedLedgerEvent {
  const matches = events.filter(
    (event) => event.event.effective.envelope.event_id === resultEventId,
  );
  if (matches.length !== 1) {
    throw new DeepReviewCertificateError(
      DeepReviewCertificateFailureCodes.LEDGER_INVALID,
      `event:${resultEventId}`,
      'Transition result event must resolve exactly once in the authorized ledger',
    );
  }
  return matches[0] as VerifiedLedgerEvent;
}

function buildTransitionFacts(
  input: DeepReviewTransitionReceiptInput,
  context: Omit<PreparedTransitionReceiptContext, 'receiptSubstrate'>,
): DeepReviewTransitionReceiptFacts {
  requireArtifactReferences(input, context.artifactEvidenceByQualifiedDigest);
  const event = findResultEvent(context.ledgerEvents, input.resultEventId);
  requireArtifactEventCorrespondence(input, event, context);
  const envelope = event.event.effective.envelope;
  const evidence = transitionDisposition(input.transitionKind, event);
  const heads = eventHeads(event);
  return Object.freeze({
    receiptVersion: DEEP_REVIEW_RECEIPT_VERSION,
    runId: context.runId,
    transitionId: transitionId(context.runId, input),
    transitionKind: input.transitionKind,
    logicalOperationId: input.logicalOperationId,
    attemptIds: Object.freeze([...input.attemptIds]),
    resultEventId: input.resultEventId,
    resultEventType: envelope.event_type,
    resultEventDigest: event.event.stored.digest,
    authorizationDecisionDigest: event.frame.authorization_ref.decision_digest,
    fromHead: heads.fromHead,
    resultHead: heads.resultHead,
    inputArtifactQualifiedDigests: Object.freeze([...input.inputArtifactQualifiedDigests]),
    outputArtifactQualifiedDigests: Object.freeze([...input.outputArtifactQualifiedDigests]),
    resultDisposition: evidence.disposition,
    dispositionReason: evidence.dispositionReason,
    replayFingerprint: context.replayFingerprint,
    authorityEpoch: envelope.authority_epoch,
    priorReceiptDigest: context.priorReceiptDigest,
  });
}

function boundaryDefinition(
  facts: DeepReviewTransitionReceiptFacts,
): BoundaryDefinition {
  const boundary = TRANSITION_BOUNDARIES[facts.transitionKind];
  return Object.freeze({
    boundaryKind: boundary.kind,
    scope: boundary.scope,
    action: boundary.kind.slice(boundary.kind.indexOf('-') + 1) as BoundaryDefinition['action'],
    resultEventType: facts.resultEventType,
    allowedFromStates: Object.freeze([boundary.fromState]),
    toState: boundary.toState,
    resultCode: facts.resultDisposition,
  });
}

function projectBoundaryResult(
  event: VerifiedLedgerEvent,
  facts: DeepReviewTransitionReceiptFacts,
  receiptDigest: string,
): VerifiedLedgerEvent {
  const boundary = TRANSITION_BOUNDARIES[facts.transitionKind];
  const artifactDigests = [
    ...facts.inputArtifactQualifiedDigests,
    ...facts.outputArtifactQualifiedDigests,
  ].map(contentDigest);
  return Object.freeze({
    ...event,
    event: Object.freeze({
      ...event.event,
      effective: Object.freeze({
        ...event.event.effective,
        envelope: Object.freeze({
          ...event.event.effective.envelope,
          payload: Object.freeze({
            boundary_id: facts.transitionId,
            scope_id: facts.runId,
            from_state: boundary.fromState,
            to_state: boundary.toState,
            result_code: facts.resultDisposition,
            evidence_digest: receiptDigest,
            artifact_digests: [...artifactDigests],
            replay_fingerprint: facts.replayFingerprint,
          }),
        }),
      }),
    }),
  });
}

function boundaryReceiptWriter(
  substrate: DeepReviewTransitionReceiptSubstrate,
  projectedResult: VerifiedLedgerEvent,
) {
  const resultEventId = projectedResult.event.effective.envelope.event_id;
  return Object.freeze({
    append: substrate.writer.append.bind(substrate.writer),
    findEvent: substrate.writer.findEvent.bind(substrate.writer),
    async readVerifiedEvents(): Promise<readonly VerifiedLedgerEvent[]> {
      const events = await substrate.writer.readVerifiedEvents();
      return Object.freeze(events.map((event) => (
        event.event.effective.envelope.event_id === resultEventId ? projectedResult : event
      )));
    },
  });
}

async function issueSharedTransitionReceipt(
  facts: DeepReviewTransitionReceiptFacts,
  receiptDigest: string,
  event: VerifiedLedgerEvent,
  context: PreparedTransitionReceiptContext,
): Promise<BoundaryReceiptPayload> {
  const boundaries = new BoundaryRegistry([boundaryDefinition(facts)]);
  const issuer = new BoundaryReceiptIssuer({
    writer: boundaryReceiptWriter(
      context.receiptSubstrate,
      projectBoundaryResult(event, facts, receiptDigest),
    ),
    registry: context.receiptSubstrate.registry,
    boundaries,
    providers: context.providers,
    producer: context.receiptSubstrate.producer,
    now: () => new Date(context.issuedAt),
  });
  const issued = await issuer.issue({
    boundaryId: facts.transitionId,
    boundaryKind: TRANSITION_BOUNDARIES[facts.transitionKind].kind,
    scopeId: facts.runId,
    resultEventId: facts.resultEventId,
    issuer: context.issuer,
    certificationProfile: context.certificationProfile,
    issuedAt: context.issuedAt,
  });
  return issued.payload;
}

async function verifiedArtifactSet(
  store: DeepReviewCertificateIssuerInput<JsonObject>['artifactStore'],
  bindings: readonly DeepReviewSealedArtifactBinding[],
): Promise<VerifiedArtifactSet> {
  if (bindings.length === 0) {
    throw new DeepReviewCertificateError(
      DeepReviewCertificateFailureCodes.EVIDENCE_INCOMPLETE,
      'certificate:artifacts',
      'Run certificate requires a non-empty sealed-reference set',
    );
  }
  const claims: DeepReviewCertificateArtifactClaim[] = [];
  const evidenceByQualifiedDigest = new Map<string, ArtifactReferenceEvidence>();
  for (const binding of bindings) {
    const verified = await readDeepReviewArtifact(store, binding);
    const qualifiedDigest = verified.binding.reference.qualified_digest;
    if (evidenceByQualifiedDigest.has(qualifiedDigest)) {
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.ARTIFACT_INVALID,
        'certificate:artifacts',
        'Run certificate cannot contain duplicate sealed-reference identities',
      );
    }
    evidenceByQualifiedDigest.set(qualifiedDigest, artifactEvidence(verified));
    claims.push(Object.freeze({
      binding: verified.binding,
      descriptorDigest: verified.binding.reference.descriptor_digest,
      contentDigest: verified.descriptor.content_digest,
      canonicalizationVersion: verified.descriptor.canonicalization_version,
    }));
  }
  return Object.freeze({
    claims: Object.freeze(claims),
    evidenceByQualifiedDigest,
  });
}

function verifyNamedDigestClosure(
  artifacts: VerifiedArtifactSet,
): string {
  const byContentDigest = new Map<string, ArtifactReferenceEvidence>();
  const claimIndex = new Map<string, number>();
  for (const [index, claim] of artifacts.claims.entries()) {
    const evidence = artifacts.evidenceByQualifiedDigest.get(
      claim.binding.reference.qualified_digest,
    );
    if (!evidence) {
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.ARTIFACT_INVALID,
        `artifact:${index}`,
        'Verified artifact evidence is absent from the run closure',
      );
    }
    if (byContentDigest.has(evidence.contentDigest)) {
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.ARTIFACT_INVALID,
        `artifact:${index}`,
        'A named plain digest has ambiguous ownership in the run closure',
      );
    }
    byContentDigest.set(evidence.contentDigest, evidence);
    claimIndex.set(evidence.qualifiedDigest, index);
  }

  const orderedClosure: Array<Readonly<{
    containingQualifiedDigest: string;
    field: string;
    position: number;
    referencedQualifiedDigest: string;
  }>> = [];
  for (const rule of DEEP_REVIEW_NAMED_DIGEST_CLOSURE_RULES) {
    const containers = [...artifacts.evidenceByQualifiedDigest.values()]
      .filter((evidence) => evidence.kind === rule.containingArtifactKind);
    for (const container of containers) {
      const material = container.material as unknown as Readonly<Record<string, unknown>>;
      const raw = material[rule.field];
      const values = rule.cardinality === 'array'
        ? stringArray(raw)
        : typeof raw === 'string'
          ? [raw]
          : [];
      if (
        values.length === 0
        || (rule.cardinality === 'scalar' && values.length !== 1)
      ) {
        throw new DeepReviewCertificateError(
          DeepReviewCertificateFailureCodes.ARTIFACT_INVALID,
          `artifact:${container.kind}:${rule.field}`,
          'Named digest field does not match its declared closure cardinality',
        );
      }
      for (const [position, plainDigest] of values.entries()) {
        const referenced = byContentDigest.get(plainDigest);
        if (!referenced) {
          throw new DeepReviewCertificateError(
            DeepReviewCertificateFailureCodes.ARTIFACT_INVALID,
            `artifact:${container.kind}:${rule.field}:${position}`,
            'Named digest does not resolve to actually sealed content in the run closure',
            null,
            plainDigest,
          );
        }
        if (!rule.expectedArtifactKinds.includes(referenced.kind)) {
          throw new DeepReviewCertificateError(
            DeepReviewCertificateFailureCodes.ARTIFACT_INVALID,
            `artifact:${container.kind}:${rule.field}:${position}`,
            'Named digest resolves to a sealed artifact of the wrong kind',
            digest(rule.expectedArtifactKinds),
            digest(referenced.kind),
          );
        }
        const containerMaterial = material;
        const referencedMaterial = referenced.material as unknown as
          Readonly<Record<string, unknown>>;
        if (
          typeof containerMaterial.authorityEpoch !== 'number'
          || referencedMaterial.authorityEpoch !== containerMaterial.authorityEpoch
        ) {
          throw new DeepReviewCertificateError(
            DeepReviewCertificateFailureCodes.ARTIFACT_INVALID,
            `artifact:${container.kind}:${rule.field}:${position}`,
            'Named digest resolves across a stale authority epoch',
          );
        }
        const containerIndex = claimIndex.get(container.qualifiedDigest);
        const referencedIndex = claimIndex.get(referenced.qualifiedDigest);
        if (
          containerIndex === undefined
          || referencedIndex === undefined
          || referencedIndex >= containerIndex
        ) {
          throw new DeepReviewCertificateError(
            DeepReviewCertificateFailureCodes.ARTIFACT_INVALID,
            `artifact:${container.kind}:${rule.field}:${position}`,
            'Named digest dependency is stale, reordered, or not predecessor-owned',
          );
        }
        const dependencies = Array.isArray(containerMaterial.dependencies)
          ? containerMaterial.dependencies
          : [];
        const ownsReference = dependencies.some((dependency) => {
          const candidate = recordValue(dependency);
          const reference = recordValue(candidate?.reference);
          return candidate?.artifactKind === referenced.kind
            && reference?.qualified_digest === referenced.qualifiedDigest;
        });
        if (!ownsReference) {
          throw new DeepReviewCertificateError(
            DeepReviewCertificateFailureCodes.ARTIFACT_INVALID,
            `artifact:${container.kind}:${rule.field}:${position}`,
            'Named digest is not owned by the containing artifact dependency closure',
          );
        }
        orderedClosure.push(Object.freeze({
          containingQualifiedDigest: container.qualifiedDigest,
          field: rule.field,
          position,
          referencedQualifiedDigest: referenced.qualifiedDigest,
        }));
      }
    }
  }
  return digest(orderedClosure);
}

function assertArtifactEventsAuthorized(
  artifacts: VerifiedArtifactSet,
  ledgerEvents: readonly VerifiedLedgerEvent[],
): void {
  for (const evidence of artifacts.evidenceByQualifiedDigest.values()) {
    const matches = ledgerEvents.filter((event) => artifactCorrespondsToEvent(evidence, event));
    if (matches.length !== 1) {
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.AUTHORIZATION_INVALID,
        `artifact:${evidence.qualifiedDigest}`,
        'Sealed artifact provenance must resolve to exactly one authorized ledger event',
      );
    }
  }
}

async function issueTransitionReceiptWithEvidence(
  input: DeepReviewTransitionReceiptInput,
  context: PreparedTransitionReceiptContext,
): Promise<DeepReviewTransitionReceipt> {
  const facts = buildTransitionFacts(input, context);
  const receiptDigest = digest(facts);
  const event = findResultEvent(context.ledgerEvents, facts.resultEventId);
  const sharedReceipt = await issueSharedTransitionReceipt(
    facts,
    receiptDigest,
    event,
    context,
  );
  return parseDeepReviewTransitionReceipt({ facts, receiptDigest, sharedReceipt });
}

/** Issue one transition receipt from a real authorized result event. */
export async function issueDeepReviewTransitionReceipt(
  input: DeepReviewTransitionReceiptInput,
  context: TransitionReceiptContext,
): Promise<DeepReviewTransitionReceipt> {
  if (!context.artifactStore || !context.artifactBindings) {
    throw new DeepReviewCertificateError(
      DeepReviewCertificateFailureCodes.ARTIFACT_INVALID,
      `transition:${input.transitionKind}:artifacts`,
      'Transition receipt issuance requires sealed-store artifact evidence',
    );
  }
  const artifacts = await verifiedArtifactSet(context.artifactStore, context.artifactBindings);
  return issueTransitionReceiptWithEvidence(input, {
    ...context,
    artifactEvidenceByQualifiedDigest: artifacts.evidenceByQualifiedDigest,
    memoryHandoffCorrespondenceByQualifiedDigest: memoryHandoffCorrespondences(
      [input],
      artifacts.evidenceByQualifiedDigest,
    ),
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. RUN CERTIFICATE ISSUANCE
// ───────────────────────────────────────────────────────────────────

function convergenceEvidence(
  projection: DeepReviewProjectionState,
): DeepReviewCertificateConvergenceEvidence {
  const evaluation = projection.reviewLoop.evaluations.at(-1);
  if (!evaluation) {
    throw new DeepReviewCertificateError(
      DeepReviewCertificateFailureCodes.CONVERGENCE_INVALID,
      'projection:convergence',
      'Run certificate requires one reducer-derived convergence evaluation',
    );
  }
  return Object.freeze({
    eligibility: projection.reviewLoop.eligibility,
    outcome: projection.reviewLoop.outcome,
    evaluationEventId: evaluation.producerEventId,
    policyFingerprint: evaluation.policyFingerprint,
    evaluatorFingerprint: digest({
      policyFingerprint: evaluation.policyFingerprint,
      graphDigest: evaluation.graphDigest,
    }),
    evidenceTailHash: evaluation.graphDigest ?? evaluation.rawSignals.observationDigest,
    blockerIds: Object.freeze([...projection.reviewLoop.blockerIds]),
  });
}

function statusEvidence(
  projection: DeepReviewProjectionState,
): DeepReviewCertificateStatusEvidence {
  const status = projection.status.provenance.at(-1);
  if (!status) {
    throw new DeepReviewCertificateError(
      DeepReviewCertificateFailureCodes.STATUS_INVALID,
      'projection:status',
      'Run certificate requires reducer-derived status provenance',
    );
  }
  return Object.freeze({
    state: projection.status.state,
    terminal: projection.status.terminal,
    statusEventId: status.producerEventId,
  });
}

function lifecycleResult(
  projection: DeepReviewProjectionState,
  receipts: readonly DeepReviewTransitionReceipt[],
): DeepReviewCertificateLifecycleResult {
  if (projection.status.state === 'blocked') return 'blocked';
  if (projection.status.state === 'failed') return 'failed';
  const hasUntrustedReceipt = receipts.some((receipt) => (
    receipt.facts.resultDisposition !== 'succeeded'
    && receipt.facts.resultDisposition !== 'applied'
  ));
  if (
    projection.status.state === 'complete'
    && projection.status.terminal
    && projection.reviewLoop.outcome === 'converged'
    && projection.reviewLoop.eligibility === 'STOP_ELIGIBLE'
    && openObligationIds(projection).length === 0
    && !hasUntrustedReceipt
  ) {
    return 'trusted-completion';
  }
  return 'incomplete';
}

function outputArtifactQualifiedDigests(
  claims: readonly DeepReviewCertificateArtifactClaim[],
): readonly string[] {
  const outputs = claims
    .filter((claim) => (
      claim.binding.artifactKind === DeepReviewArtifactKinds.SYNTHESIS_REPORT
      || claim.binding.artifactKind === DeepReviewArtifactKinds.RESUME_HANDOFF
    ))
    .map((claim) => claim.binding.reference.qualified_digest);
  if (outputs.length === 0) {
    throw new DeepReviewCertificateError(
      DeepReviewCertificateFailureCodes.EVIDENCE_INCOMPLETE,
      'certificate:outputs',
      'Run certificate requires a sealed synthesis or handoff output',
    );
  }
  return Object.freeze(outputs);
}

function openObligationIds(projection: DeepReviewProjectionState): readonly string[] {
  return uniqueSorted([
    ...projection.reviewLoop.obligations
      .filter((obligation) => obligation.status !== 'resolved')
      .map((obligation) => obligation.obligationId),
    ...projection.reviewLoop.blockerIds,
  ]);
}

function assertTransitionOrder(receipts: readonly DeepReviewTransitionReceipt[]): void {
  const requiredCounts = new Map<DeepReviewTransitionKind, number>();
  let lastRank = -1;
  const logicalOperations = new Map<string, DeepReviewTransitionReceipt>();
  for (const [index, receipt] of receipts.entries()) {
    const facts = receipt.facts;
    const existing = logicalOperations.get(facts.logicalOperationId);
    if (existing && canonicalJson(existing) !== canonicalJson(receipt)) {
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
        `receipt:${index}`,
        'Logical operation identity is bound to conflicting receipt facts',
      );
    }
    if (existing) continue;
    logicalOperations.set(facts.logicalOperationId, receipt);
    const rank = REQUIRED_TRANSITION_RANK.get(facts.transitionKind);
    if (rank !== undefined) {
      if (rank < lastRank) {
        throw new DeepReviewCertificateError(
          DeepReviewCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
          `receipt:${index}`,
          'Required transition receipts are out of lifecycle order',
        );
      }
      lastRank = rank;
      requiredCounts.set(facts.transitionKind, (requiredCounts.get(facts.transitionKind) ?? 0) + 1);
    }
  }
  for (const requiredKind of DEEP_REVIEW_REQUIRED_TRANSITION_ORDER) {
    const count = requiredCounts.get(requiredKind) ?? 0;
    if (count === 0) {
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.RECEIPT_MISSING,
        `receipt:${requiredKind}`,
        'Complete run evidence requires every lifecycle transition kind',
      );
    }
    if (REQUIRED_TRANSITION_CARDINALITY[requiredKind] === 'exactly-one' && count !== 1) {
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
        `receipt:${requiredKind}`,
        'Once-per-run lifecycle transitions cannot have multiple logical receipts',
      );
    }
  }
}

function assertTransitionCoverage(
  receipts: readonly DeepReviewTransitionReceipt[],
  coveredEvents: readonly VerifiedLedgerEvent[],
): void {
  const receiptsByEvent = new Map<string, number>();
  for (const receipt of receipts) {
    receiptsByEvent.set(
      receipt.facts.resultEventId,
      (receiptsByEvent.get(receipt.facts.resultEventId) ?? 0) + 1,
    );
  }
  for (const event of coveredEvents) {
    const eventId = event.event.effective.envelope.event_id;
    const eventType = event.event.effective.envelope.event_type;
    const transitionKind = Object.entries(TRANSITION_EVENT_TYPES)
      .find(([, eventTypes]) => eventTypes.has(eventType))?.[0];
    if (!transitionKind || receiptsByEvent.get(eventId) !== 1) {
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.RECEIPT_MISSING,
        `receipt:event:${eventId}`,
        'Every authorized Deep Review state transition requires exactly one receipt',
      );
    }
  }
}

function certificateCertificationInput(
  body: DeepReviewRunCertificateBody,
  certificateDigest: string,
  lastReceipt: DeepReviewTransitionReceipt,
  issuer: string,
  issuedAt: string,
  certificationProfile: CertificationProfile,
): ReceiptCertificationInput {
  return {
    receiptId: `deep-review-certificate:${certificateDigest}`,
    boundaryId: `dr-certificate:${certificateDigest}`,
    boundaryKind: 'mode-completion',
    scope: 'mode',
    scopeId: body.runId,
    fromState: 'active',
    toState: body.statusEvidence.state,
    fromHead: body.startHead,
    resultHead: body.finalHead,
    resultEventId: lastReceipt.facts.resultEventId,
    resultEventType: 'deep-review.run-certificate',
    resultEventDigest: certificateDigest,
    resultCode: body.lifecycleResult,
    evidenceDigest: certificateDigest,
    artifactDigests: body.artifactClaims.map((claim) => claim.contentDigest),
    replayFingerprint: body.replayFingerprint,
    authorityEpoch: lastReceipt.facts.authorityEpoch,
    correlationId: body.runId,
    causationId: lastReceipt.facts.resultEventId,
    issuer,
    issuedAt,
    idempotencyKey: `deep-review-certificate:v1:${certificateDigest}`,
    certificationProfile,
  };
}

/** Issue a dark-only run certificate after re-deriving every load-bearing fact. */
export async function issueDeepReviewRunCertificate<TState extends JsonObject>(
  input: DeepReviewCertificateIssuerInput<TState>,
): Promise<DeepReviewCertificateBundle> {
  if (!(input.replay.ledger instanceof AppendOnlyLedger)) {
    throw new DeepReviewCertificateError(
      DeepReviewCertificateFailureCodes.LEDGER_INVALID,
      'replay:ledger',
      'Certificate issuance requires the shipped authorized-ledger reader',
    );
  }
  if (input.replay.runId !== input.runId) {
    throw new DeepReviewCertificateError(
      DeepReviewCertificateFailureCodes.REPLAY_INVALID,
      'replay:runId',
      'Replay fingerprint run identity differs from the certificate run identity',
    );
  }
  const ledgerEvents = await input.replay.ledger.readVerifiedEvents();
  const coveredEvents = ledgerEvents.slice(
    input.replay.rangeStartSequence - 1,
    input.replay.rangeEndSequence,
  );
  if (coveredEvents.length === 0) {
    throw new DeepReviewCertificateError(
      DeepReviewCertificateFailureCodes.LEDGER_INVALID,
      'replay:range',
      'Certificate replay range contains no authorized events',
    );
  }
  assertProjectionMatchesVerifiedLedger(input.projectionEvents, coveredEvents);
  const folded = foldDeepReviewEvents(input.projectionEvents);
  if (folded.outcome !== 'projected') {
    throw new DeepReviewCertificateError(
      DeepReviewCertificateFailureCodes.PROJECTION_INVALID,
      'projection:fold',
      'Reducer projection requires a rebuild and cannot be certified',
    );
  }
  if (
    folded.projection.run.runId !== input.runId
    || folded.projection.run.sessionId !== input.sessionId
    || folded.projection.run.generation !== input.generation
  ) {
    throw new DeepReviewCertificateError(
      DeepReviewCertificateFailureCodes.PROJECTION_INVALID,
      'projection:identity',
      'Reducer-derived run identity differs from the certificate identity',
    );
  }
  const derivedReplay = await deriveReplayFingerprint(input.replay);
  const artifacts = await verifiedArtifactSet(
    input.artifactStore,
    input.artifactBindings,
  );
  const claims = artifacts.claims;
  assertArtifactEventsAuthorized(artifacts, coveredEvents);
  const orderedDependencyClosureDigest = verifyNamedDigestClosure(artifacts);
  const replayFingerprint = digest({
    substrateReplayFingerprint: derivedReplay.descriptor.final_digest,
    orderedDependencyClosureDigest,
  });
  const memoryHandoffCorrespondenceByQualifiedDigest = memoryHandoffCorrespondences(
    input.transitionReceipts,
    artifacts.evidenceByQualifiedDigest,
  );
  assertTransitionOutputArtifactUniqueness(input.transitionReceipts);
  const receipts: DeepReviewTransitionReceipt[] = [];
  const logicalOperationInputs = new Map<string, string>();
  let priorReceiptDigest: string | null = null;
  for (const transitionInput of input.transitionReceipts) {
    const canonicalInput = canonicalJson(asJson(transitionInput));
    const priorInput = logicalOperationInputs.get(transitionInput.logicalOperationId);
    if (priorInput === canonicalInput) continue;
    const receipt = await issueTransitionReceiptWithEvidence(transitionInput, {
      runId: input.runId,
      replayFingerprint,
      priorReceiptDigest,
      ledgerEvents: coveredEvents,
      artifactEvidenceByQualifiedDigest: artifacts.evidenceByQualifiedDigest,
      memoryHandoffCorrespondenceByQualifiedDigest,
      certificationProfile: input.certificationProfile,
      providers: input.providers,
      receiptSubstrate: input.receiptSubstrate,
      issuer: input.issuer,
      issuedAt: input.issuedAt,
    });
    receipts.push(receipt);
    logicalOperationInputs.set(transitionInput.logicalOperationId, canonicalInput);
    priorReceiptDigest = receipt.receiptDigest;
  }
  assertTransitionOrder(receipts);
  assertTransitionCoverage(receipts, coveredEvents);

  const firstEvent = coveredEvents[0] as VerifiedLedgerEvent;
  const finalEvent = coveredEvents.at(-1) as VerifiedLedgerEvent;
  const receiptDigests = receipts.map((receipt) => receipt.receiptDigest);
  const body: DeepReviewRunCertificateBody = Object.freeze({
    certificateVersion: DEEP_REVIEW_CERTIFICATE_VERSION,
    authority: 'dark-evidence-only',
    runId: input.runId,
    sessionId: input.sessionId,
    generation: input.generation,
    lifecycleResult: lifecycleResult(folded.projection, receipts),
    startHead: headFacts(
      firstEvent.frame.ledger_id,
      firstEvent.frame.sequence - 1,
      firstEvent.frame.prev_record_hash,
    ),
    finalHead: headFacts(
      finalEvent.frame.ledger_id,
      finalEvent.frame.sequence,
      finalEvent.frame.record_hash,
    ),
    artifactClaims: claims,
    artifactSetDigest: digest(claims),
    namedDigestClosureRules: DEEP_REVIEW_NAMED_DIGEST_CLOSURE_RULES,
    orderedDependencyClosureDigest,
    receiptDigests: Object.freeze(receiptDigests),
    receiptChainDigest: digest(receiptDigests),
    replayFingerprint,
    replayFingerprintVersion: derivedReplay.descriptor.fingerprint_version,
    projectionIntegrityDigest: deepReviewProjectionIntegrityDigest(folded.projection),
    convergenceEvidence: convergenceEvidence(folded.projection),
    statusEvidence: statusEvidence(folded.projection),
    outputArtifactQualifiedDigests: outputArtifactQualifiedDigests(claims),
    openObligationIds: openObligationIds(folded.projection),
  });
  const certificateDigest = digest(body);
  const lastReceipt = receipts.at(-1) as DeepReviewTransitionReceipt;
  const sharedCertificationReceipt = await certifySharedReceipt(
    certificateCertificationInput(
      body,
      certificateDigest,
      lastReceipt,
      input.issuer,
      input.issuedAt,
      input.certificationProfile,
    ),
    input.providers,
  );
  const certificate = parseDeepReviewRunCertificate({
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

// ───────────────────────────────────────────────────────────────────
// 5. OFFLINE VERIFICATION
// ───────────────────────────────────────────────────────────────────

function mismatch(
  code: DeepReviewCertificateError['code'],
  location: string,
  failureReason: string,
  expected: unknown,
  actual: unknown,
): never {
  throw new DeepReviewCertificateError(
    code,
    location,
    failureReason,
    digest(expected),
    digest(actual),
  );
}

function equalCanonical(
  expected: unknown,
  actual: unknown,
  code: DeepReviewCertificateError['code'],
  location: string,
  failureReason: string,
): void {
  if (canonicalJson(expected) !== canonicalJson(actual)) {
    mismatch(code, location, failureReason, expected, actual);
  }
}

async function verifyArtifacts(
  certificate: DeepReviewRunCertificate,
  store: DeepReviewOfflineVerificationInput<JsonObject>['artifactStore'],
): Promise<VerifiedArtifactSet> {
  const verifiedClaims: DeepReviewCertificateArtifactClaim[] = [];
  const evidenceByQualifiedDigest = new Map<string, ArtifactReferenceEvidence>();
  for (const [index, claim] of certificate.body.artifactClaims.entries()) {
    const verified = await readDeepReviewArtifact(store, claim.binding);
    const recomputed: DeepReviewCertificateArtifactClaim = Object.freeze({
      binding: verified.binding,
      descriptorDigest: verified.binding.reference.descriptor_digest,
      contentDigest: verified.descriptor.content_digest,
      canonicalizationVersion: verified.descriptor.canonicalization_version,
    });
    equalCanonical(
      recomputed,
      claim,
      DeepReviewCertificateFailureCodes.ARTIFACT_INVALID,
      `artifact:${index}`,
      'Certificate artifact claim differs from the successful shared verified-read',
    );
    verifiedClaims.push(recomputed);
    evidenceByQualifiedDigest.set(
      verified.binding.reference.qualified_digest,
      artifactEvidence(verified),
    );
  }
  const identities = verifiedClaims.map((claim) => claim.binding.reference.qualified_digest);
  if (new Set(identities).size !== identities.length) {
    throw new DeepReviewCertificateError(
      DeepReviewCertificateFailureCodes.ARTIFACT_INVALID,
      'artifact:set',
      'Verified sealed-reference set contains duplicate identities',
    );
  }
  const recomputedSetDigest = digest(verifiedClaims);
  if (recomputedSetDigest !== certificate.body.artifactSetDigest) {
    throw new DeepReviewCertificateError(
      DeepReviewCertificateFailureCodes.ARTIFACT_INVALID,
      'artifact:set',
      'Artifact-set digest does not recompute from verified sealed references',
      recomputedSetDigest,
      certificate.body.artifactSetDigest,
    );
  }
  return Object.freeze({
    claims: Object.freeze(verifiedClaims),
    evidenceByQualifiedDigest,
  });
}

async function verifyReceipts(
  bundle: DeepReviewCertificateBundle,
  replayFingerprint: string,
  coveredEvents: readonly VerifiedLedgerEvent[],
  ledgerEvents: readonly VerifiedLedgerEvent[],
  artifactEvidenceByQualifiedDigest: ReadonlyMap<string, ArtifactReferenceEvidence>,
  providers: CertificationProviderRegistry,
): Promise<void> {
  if (bundle.receipts.length !== bundle.certificate.body.receiptDigests.length) {
    throw new DeepReviewCertificateError(
      DeepReviewCertificateFailureCodes.RECEIPT_MISSING,
      'receipt:count',
      'Certificate receipt index and supplied receipt bundle have different lengths',
    );
  }
  assertTransitionOutputArtifactUniqueness(bundle.receipts.map((receipt) => receipt.facts));
  assertTransitionOrder(bundle.receipts);
  assertTransitionCoverage(bundle.receipts, coveredEvents);
  const receiptInputs = bundle.receipts.map((receipt): DeepReviewTransitionReceiptInput => ({
    transitionKind: receipt.facts.transitionKind,
    logicalOperationId: receipt.facts.logicalOperationId,
    attemptIds: receipt.facts.attemptIds,
    resultEventId: receipt.facts.resultEventId,
    inputArtifactQualifiedDigests: receipt.facts.inputArtifactQualifiedDigests,
    outputArtifactQualifiedDigests: receipt.facts.outputArtifactQualifiedDigests,
  }));
  const memoryHandoffCorrespondenceByQualifiedDigest = memoryHandoffCorrespondences(
    receiptInputs,
    artifactEvidenceByQualifiedDigest,
  );
  let priorReceiptDigest: string | null = null;
  for (const [index, receipt] of bundle.receipts.entries()) {
    if (receipt.facts.replayFingerprint !== replayFingerprint) {
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.REPLAY_INVALID,
        `receipt:${index}:replay`,
        'Transition receipt does not bind the recomputed run replay fingerprint',
        replayFingerprint,
        receipt.facts.replayFingerprint,
      );
    }
    const input: DeepReviewTransitionReceiptInput = {
      transitionKind: receipt.facts.transitionKind,
      logicalOperationId: receipt.facts.logicalOperationId,
      attemptIds: receipt.facts.attemptIds,
      resultEventId: receipt.facts.resultEventId,
      inputArtifactQualifiedDigests: receipt.facts.inputArtifactQualifiedDigests,
      outputArtifactQualifiedDigests: receipt.facts.outputArtifactQualifiedDigests,
    };
    const expectedFacts = buildTransitionFacts(input, {
      runId: bundle.certificate.body.runId,
      replayFingerprint,
      priorReceiptDigest,
      ledgerEvents: coveredEvents,
      artifactEvidenceByQualifiedDigest,
      memoryHandoffCorrespondenceByQualifiedDigest,
      certificationProfile: profileFromSharedReceipt(receipt.sharedReceipt),
      providers,
      issuer: receipt.sharedReceipt.issuer,
      issuedAt: receipt.sharedReceipt.issued_at,
    });
    equalCanonical(
      expectedFacts,
      receipt.facts,
      DeepReviewCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
      `receipt:${index}:facts`,
      'Transition receipt facts do not re-derive from authorized ledger evidence',
    );
    const recomputedReceiptDigest = digest(expectedFacts);
    if (
      receipt.receiptDigest !== recomputedReceiptDigest
      || bundle.certificate.body.receiptDigests[index] !== recomputedReceiptDigest
    ) {
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
        `receipt:${index}:digest`,
        'Receipt digest or certificate receipt index does not recompute',
        recomputedReceiptDigest,
        receipt.receiptDigest,
      );
    }
    const receiptEvents = ledgerEvents.filter((event) => (
      event.event.effective.envelope.event_id === receipt.sharedReceipt.receipt_id
    ));
    if (receiptEvents.length !== 1) {
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.RECEIPT_MISSING,
        `receipt:${index}:durable-event`,
        'Shared transition receipt must resolve exactly once in the authorized ledger',
      );
    }
    const durableReceiptEvent = receiptEvents[0] as VerifiedLedgerEvent;
    equalCanonical(
      durableReceiptEvent.event.effective.envelope.payload,
      receipt.sharedReceipt,
      DeepReviewCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
      `receipt:${index}:durable-event`,
      'Bundled transition receipt differs from its durable authorized-ledger event',
    );
    const resultEvent = findResultEvent(coveredEvents, expectedFacts.resultEventId);
    const projectedResult = projectBoundaryResult(
      resultEvent,
      expectedFacts,
      recomputedReceiptDigest,
    );
    const verificationEvents = ledgerEvents.map((event) => (
      event.event.effective.envelope.event_id === expectedFacts.resultEventId
        ? projectedResult
        : event
    ));
    await verifyBoundaryReceiptEvent(
      durableReceiptEvent,
      verificationEvents,
      new BoundaryRegistry([boundaryDefinition(expectedFacts)]),
      providers,
    );
    priorReceiptDigest = receipt.receiptDigest;
  }
  const recomputedChainDigest = digest(bundle.receipts.map((receipt) => receipt.receiptDigest));
  if (recomputedChainDigest !== bundle.certificate.body.receiptChainDigest) {
    throw new DeepReviewCertificateError(
      DeepReviewCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
      'receipt:chain',
      'Receipt-chain digest does not recompute in supplied order',
      recomputedChainDigest,
      bundle.certificate.body.receiptChainDigest,
    );
  }
}

function failureResult(error: unknown): DeepReviewOfflineVerificationFailure {
  let verdict: DeepReviewOfflineVerificationFailure['verdict'] = 'invalid';
  let code: DeepReviewOfflineVerificationFailure['code'] =
    DeepReviewCertificateFailureCodes.CERTIFICATE_INVALID;
  let evidenceLocation = 'certificate:unknown';
  let expectedDigest: string | null = null;
  let actualDigest: string | null = null;
  let failureReason = 'Offline verification failed without trusted evidence.';

  if (error instanceof DeepReviewCertificateError) {
    code = error.code;
    evidenceLocation = error.evidenceLocation;
    expectedDigest = error.expectedDigest;
    actualDigest = error.actualDigest;
    failureReason = error.message;
    if (error.code === DeepReviewCertificateFailureCodes.RECEIPT_MISSING
      || error.code === DeepReviewCertificateFailureCodes.EVIDENCE_INCOMPLETE) {
      verdict = 'incomplete';
    }
  } else if (error instanceof SealedArtifactError) {
    code = DeepReviewCertificateFailureCodes.ARTIFACT_INVALID;
    evidenceLocation = `artifact:${error.phase}`;
    failureReason = error.message;
    if (error.code === SealedArtifactErrorCodes.ARTIFACT_MISSING) verdict = 'unverifiable';
  } else if (error instanceof Error) {
    code = DeepReviewCertificateFailureCodes.CERTIFICATION_INVALID;
    evidenceLocation = 'substrate:verification';
    failureReason = error.message.slice(0, 512);
  }
  const evidenceDigest = digest({
    verdict,
    code,
    evidenceLocation,
    expectedDigest,
    actualDigest,
    failureReason,
  });
  return Object.freeze({
    verdict,
    code,
    evidenceLocation,
    expectedDigest,
    actualDigest,
    failureReason,
    evidenceDigest,
  });
}

/** Re-read, re-fold, and re-derive the entire certificate without live services. */
export async function verifyDeepReviewCertificateOffline<TState extends JsonObject>(
  input: DeepReviewOfflineVerificationInput<TState>,
): Promise<DeepReviewOfflineVerificationResult> {
  try {
    const bundle = parseDeepReviewCertificateBundle(input.bundle);
    const certificate = bundle.certificate;
    const recomputedCertificateDigest = digest(certificate.body);
    if (!(input.replay.ledger instanceof AppendOnlyLedger)) {
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.LEDGER_INVALID,
        'replay:ledger',
        'Offline verification requires the shipped authorized-ledger reader',
      );
    }
    if (input.replay.runId !== certificate.body.runId) {
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.REPLAY_INVALID,
        'replay:runId',
        'Replay run identity differs from the certificate identity',
      );
    }
    const ledgerEvents = await input.replay.ledger.readVerifiedEvents();
    const coveredEvents = ledgerEvents.slice(
      input.replay.rangeStartSequence - 1,
      input.replay.rangeEndSequence,
    );
    const firstEvent = coveredEvents[0];
    const finalEvent = coveredEvents.at(-1);
    if (!firstEvent || !finalEvent) {
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.LEDGER_INVALID,
        'replay:range',
        'Replay range contains no verified authorized events',
      );
    }
    assertProjectionMatchesVerifiedLedger(input.projectionEvents, coveredEvents);
    const folded = foldDeepReviewEvents(input.projectionEvents);
    if (folded.outcome !== 'projected') {
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.PROJECTION_INVALID,
        'projection:fold',
        'Projection evidence requires a rebuild',
      );
    }
    const recomputedProjectionDigest = deepReviewProjectionIntegrityDigest(folded.projection);
    if (recomputedProjectionDigest !== certificate.body.projectionIntegrityDigest) {
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.PROJECTION_INVALID,
        'projection:digest',
        'Projection integrity digest does not recompute from typed events',
        recomputedProjectionDigest,
        certificate.body.projectionIntegrityDigest,
      );
    }
    if (
      folded.projection.run.runId !== certificate.body.runId
      || folded.projection.run.sessionId !== certificate.body.sessionId
      || folded.projection.run.generation !== certificate.body.generation
    ) {
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.PROJECTION_INVALID,
        'projection:identity',
        'Projection run identity differs from the certificate identity',
      );
    }
    equalCanonical(
      convergenceEvidence(folded.projection),
      certificate.body.convergenceEvidence,
      DeepReviewCertificateFailureCodes.CONVERGENCE_INVALID,
      'projection:convergence',
      'Convergence evidence does not re-derive from the reducer projection',
    );
    equalCanonical(
      statusEvidence(folded.projection),
      certificate.body.statusEvidence,
      DeepReviewCertificateFailureCodes.STATUS_INVALID,
      'projection:status',
      'Status evidence does not re-derive from the reducer projection',
    );

    const verifiedArtifacts = await verifyArtifacts(
      certificate,
      input.artifactStore,
    );
    assertArtifactEventsAuthorized(verifiedArtifacts, coveredEvents);
    equalCanonical(
      DEEP_REVIEW_NAMED_DIGEST_CLOSURE_RULES,
      certificate.body.namedDigestClosureRules,
      DeepReviewCertificateFailureCodes.ARTIFACT_INVALID,
      'artifact:named-digest-closure-rules',
      'Certificate changes the frozen field-to-expected-kind closure map',
    );
    const orderedDependencyClosureDigest = verifyNamedDigestClosure(verifiedArtifacts);
    if (
      orderedDependencyClosureDigest
      !== certificate.body.orderedDependencyClosureDigest
    ) {
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.ARTIFACT_INVALID,
        'artifact:ordered-dependency-closure',
        'Ordered named-digest dependency closure does not recompute',
        orderedDependencyClosureDigest,
        certificate.body.orderedDependencyClosureDigest,
      );
    }
    equalCanonical(
      outputArtifactQualifiedDigests(verifiedArtifacts.claims),
      certificate.body.outputArtifactQualifiedDigests,
      DeepReviewCertificateFailureCodes.ARTIFACT_INVALID,
      'artifact:outputs',
      'Certificate outputs do not re-derive from verified sealed artifacts',
    );
    equalCanonical(
      openObligationIds(folded.projection),
      certificate.body.openObligationIds,
      DeepReviewCertificateFailureCodes.PROJECTION_INVALID,
      'projection:obligations',
      'Open obligations do not re-derive from the projection',
    );

    const replay = await deriveReplayFingerprint(input.replay);
    const replayFingerprint = digest({
      substrateReplayFingerprint: replay.descriptor.final_digest,
      orderedDependencyClosureDigest,
    });
    if (
      replayFingerprint !== certificate.body.replayFingerprint
      || replay.descriptor.fingerprint_version !== certificate.body.replayFingerprintVersion
    ) {
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.REPLAY_INVALID,
        'replay:fingerprint',
        'Replay fingerprint does not re-derive from the authorized ledger and registries',
        replayFingerprint,
        certificate.body.replayFingerprint,
      );
    }
    const recomputedStartHead = headFacts(
      firstEvent.frame.ledger_id,
      firstEvent.frame.sequence - 1,
      firstEvent.frame.prev_record_hash,
    );
    const recomputedFinalHead = headFacts(
      finalEvent.frame.ledger_id,
      finalEvent.frame.sequence,
      finalEvent.frame.record_hash,
    );
    equalCanonical(
      recomputedStartHead,
      certificate.body.startHead,
      DeepReviewCertificateFailureCodes.LEDGER_INVALID,
      'ledger:start-head',
      'Certificate start head differs from the verified replay range',
    );
    equalCanonical(
      recomputedFinalHead,
      certificate.body.finalHead,
      DeepReviewCertificateFailureCodes.LEDGER_INVALID,
      'ledger:final-head',
      'Certificate final head differs from the verified replay range',
    );

    await verifyReceipts(
      bundle,
      replayFingerprint,
      coveredEvents,
      ledgerEvents,
      verifiedArtifacts.evidenceByQualifiedDigest,
      input.providers,
    );
    const recomputedLifecycleResult = lifecycleResult(folded.projection, bundle.receipts);
    if (recomputedLifecycleResult !== certificate.body.lifecycleResult) {
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.STATUS_INVALID,
        'certificate:lifecycle',
        'Certificate lifecycle result does not follow verified projection and receipt evidence',
      );
    }
    if (recomputedCertificateDigest !== certificate.certificateDigest) {
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.CERTIFICATE_INVALID,
        'certificate:digest',
        'Certificate body digest does not recompute',
        recomputedCertificateDigest,
        certificate.certificateDigest,
      );
    }
    const lastReceipt = bundle.receipts.at(-1);
    if (!lastReceipt) {
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.RECEIPT_MISSING,
        'receipt:last',
        'Certificate has no terminal transition receipt',
      );
    }
    const certificateCertification = certificateCertificationInput(
      certificate.body,
      certificate.certificateDigest,
      lastReceipt,
      certificate.sharedCertificationReceipt.issuer,
      certificate.sharedCertificationReceipt.issued_at,
      profileFromSharedReceipt(certificate.sharedCertificationReceipt),
    );
    await verifySharedReceipt(
      certificate.sharedCertificationReceipt,
      certificateCertification,
      input.providers,
      'certificate:certification',
    );

    if (certificate.body.lifecycleResult !== 'trusted-completion') {
      throw new DeepReviewCertificateError(
        DeepReviewCertificateFailureCodes.EVIDENCE_INCOMPLETE,
        'certificate:lifecycle',
        'Certificate evidence is coherent but does not establish trusted completion',
      );
    }
    return Object.freeze({
      verdict: 'valid',
      certificateDigest: certificate.certificateDigest,
      replayFingerprint,
      projectionIntegrityDigest: recomputedProjectionDigest,
      receiptChainDigest: certificate.body.receiptChainDigest,
      artifactSetDigest: certificate.body.artifactSetDigest,
    });
  } catch (error: unknown) {
    return failureResult(error);
  }
}
