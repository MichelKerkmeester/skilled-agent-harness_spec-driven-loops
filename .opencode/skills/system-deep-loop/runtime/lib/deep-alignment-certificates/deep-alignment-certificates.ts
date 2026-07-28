// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Certificates and Receipts
// ───────────────────────────────────────────────────────────────────

import { AppendOnlyLedger } from '../authorized-ledger/index.js';
import {
  DeepAlignmentWireEventTypes,
} from '../deep-alignment-ledger-schema/index.js';
import {
  deepAlignmentProjectionIntegrityDigest,
  foldDeepAlignmentEvents,
} from '../deep-alignment-reducers/index.js';
import {
  DEEP_ALIGNMENT_ARTIFACT_KIND_REGISTRY,
  DeepAlignmentArtifactKinds,
  readDeepAlignmentArtifact,
} from '../deep-alignment-sealed-artifacts/index.js';
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
  DeepAlignmentCertificateError,
  DeepAlignmentCertificateFailureCodes,
  DeepAlignmentTransitionKinds,
} from './deep-alignment-certificate-types.js';
import {
  parseDeepAlignmentCertificateBundle,
  parseDeepAlignmentRunCertificate,
  parseDeepAlignmentTransitionReceipt,
} from './deep-alignment-certificate-validation.js';

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type { DeepAlignmentLedgerEvent } from '../deep-alignment-ledger-schema/index.js';
import type {
  DeepAlignmentProjectionState,
} from '../deep-alignment-reducers/index.js';
import type {
  DeepAlignmentArtifactKind,
  DeepAlignmentArtifactLifecycle,
  DeepAlignmentArtifactMaterial,
  DeepAlignmentSealedArtifactBinding,
  DeepAlignmentVerifiedSealedArtifact,
} from '../deep-alignment-sealed-artifacts/index.js';
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
  DeepAlignmentCertificateArtifactClaim,
  DeepAlignmentCertificateApplicabilityEvidence,
  DeepAlignmentCertificateAuthorityEvidence,
  DeepAlignmentCertificateBundle,
  DeepAlignmentCertificateConformanceEvidence,
  DeepAlignmentCertificateConvergenceEvidence,
  DeepAlignmentCertificateIssuerInput,
  DeepAlignmentCertificateLifecycleResult,
  DeepAlignmentNamedDigestClosureRule,
  DeepAlignmentCertificateStatusEvidence,
  DeepAlignmentOfflineVerificationFailure,
  DeepAlignmentOfflineVerificationInput,
  DeepAlignmentOfflineVerificationResult,
  DeepAlignmentRunCertificate,
  DeepAlignmentRunCertificateBody,
  DeepAlignmentTransitionDisposition,
  DeepAlignmentTransitionKind,
  DeepAlignmentTransitionReceipt,
  DeepAlignmentTransitionReceiptFacts,
  DeepAlignmentTransitionReceiptInput,
  DeepAlignmentTransitionReceiptSubstrate,
} from './deep-alignment-certificate-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED TRANSITION PROFILE
// ───────────────────────────────────────────────────────────────────

export const DEEP_ALIGNMENT_CERTIFICATE_VERSION = 1 as const;
export const DEEP_ALIGNMENT_RECEIPT_VERSION = 1 as const;

export const DEEP_ALIGNMENT_REQUIRED_TRANSITION_ORDER = Object.freeze([
  DeepAlignmentTransitionKinds.INIT,
  DeepAlignmentTransitionKinds.AUTHORITY,
  DeepAlignmentTransitionKinds.SCOPE,
  DeepAlignmentTransitionKinds.LANE,
  DeepAlignmentTransitionKinds.SUBJECT,
  DeepAlignmentTransitionKinds.APPLICABILITY,
  DeepAlignmentTransitionKinds.PASS,
  DeepAlignmentTransitionKinds.OBSERVATION,
  DeepAlignmentTransitionKinds.COVERAGE,
  DeepAlignmentTransitionKinds.CONVERGENCE,
  DeepAlignmentTransitionKinds.SYNTHESIS,
  DeepAlignmentTransitionKinds.REPORT,
  DeepAlignmentTransitionKinds.CONTINUITY,
  DeepAlignmentTransitionKinds.COMPLETION,
] as const);

const REQUIRED_TRANSITION_CARDINALITY: Readonly<Record<
  (typeof DEEP_ALIGNMENT_REQUIRED_TRANSITION_ORDER)[number],
  'exactly-one' | 'at-least-one'
>> = Object.freeze({
  init: 'exactly-one',
  authority: 'at-least-one',
  scope: 'at-least-one',
  lane: 'at-least-one',
  subject: 'at-least-one',
  applicability: 'at-least-one',
  'dimension-pass': 'at-least-one',
  observation: 'at-least-one',
  coverage: 'at-least-one',
  convergence: 'exactly-one',
  synthesis: 'exactly-one',
  report: 'exactly-one',
  continuity: 'at-least-one',
  completion: 'exactly-one',
});

const REQUIRED_TRANSITION_RANK = new Map<DeepAlignmentTransitionKind, number>(
  DEEP_ALIGNMENT_REQUIRED_TRANSITION_ORDER.map((kind, index) => [kind, index]),
);

const TRANSITION_BOUNDARIES: Readonly<Record<
  DeepAlignmentTransitionKind,
  Readonly<{ kind: BoundaryKind; scope: BoundaryScope; fromState: string; toState: string }>
>> = Object.freeze({
  init: Object.freeze({ kind: 'mode-enter', scope: 'mode', fromState: 'planned', toState: 'active' }),
  authority: Object.freeze({ kind: 'phase-enter', scope: 'phase', fromState: 'active', toState: 'active' }),
  scope: Object.freeze({ kind: 'phase-enter', scope: 'phase', fromState: 'active', toState: 'active' }),
  lane: Object.freeze({ kind: 'phase-enter', scope: 'phase', fromState: 'active', toState: 'active' }),
  subject: Object.freeze({ kind: 'phase-enter', scope: 'phase', fromState: 'active', toState: 'active' }),
  applicability: Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'active', toState: 'active' }),
  'dimension-pass': Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'active', toState: 'active' }),
  observation: Object.freeze({ kind: 'phase-enter', scope: 'phase', fromState: 'active', toState: 'active' }),
  candidate: Object.freeze({ kind: 'phase-enter', scope: 'phase', fromState: 'active', toState: 'active' }),
  evidence: Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'active', toState: 'active' }),
  verification: Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'active', toState: 'active' }),
  proof: Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'active', toState: 'active' }),
  adjudication: Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'active', toState: 'active' }),
  conformance: Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'active', toState: 'active' }),
  lineage: Object.freeze({ kind: 'phase-handoff', scope: 'phase', fromState: 'active', toState: 'active' }),
  deviation: Object.freeze({ kind: 'phase-handoff', scope: 'phase', fromState: 'active', toState: 'active' }),
  'witness-replay': Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'active', toState: 'active' }),
  coverage: Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'active', toState: 'active' }),
  convergence: Object.freeze({ kind: 'phase-pause', scope: 'phase', fromState: 'active', toState: 'converging' }),
  'blocked-stop': Object.freeze({ kind: 'mode-pause', scope: 'mode', fromState: 'converging', toState: 'blocked' }),
  synthesis: Object.freeze({ kind: 'phase-handoff', scope: 'phase', fromState: 'converging', toState: 'active' }),
  report: Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'active', toState: 'active' }),
  continuity: Object.freeze({ kind: 'mode-handoff', scope: 'mode', fromState: 'active', toState: 'active' }),
  completion: Object.freeze({ kind: 'mode-completion', scope: 'mode', fromState: 'active', toState: 'complete' }),
  recovery: Object.freeze({ kind: 'mode-resume', scope: 'mode', fromState: 'paused', toState: 'active' }),
});

const TRANSITION_EVENT_TYPES: Readonly<Record<
  DeepAlignmentTransitionKind,
  ReadonlySet<string>
>> = Object.freeze({
  init: new Set([DeepAlignmentWireEventTypes['deep_alignment.run_initialized']]),
  authority: new Set([
    DeepAlignmentWireEventTypes['deep_alignment.authority_reference_bound'],
    DeepAlignmentWireEventTypes['deep_alignment.authority_validation_recorded'],
    DeepAlignmentWireEventTypes['deep_alignment.authority_epoch_compatibility_recorded'],
  ]),
  scope: new Set([
    DeepAlignmentWireEventTypes['deep_alignment.scope_resolved'],
    DeepAlignmentWireEventTypes['deep_alignment.dimension_ordered'],
    DeepAlignmentWireEventTypes['deep_alignment.protocol_plan_recorded'],
  ]),
  'dimension-pass': new Set([
    DeepAlignmentWireEventTypes['deep_alignment.dimension_pass_started'],
    DeepAlignmentWireEventTypes['deep_alignment.dimension_pass_completed'],
  ]),
  lane: new Set([
    DeepAlignmentWireEventTypes['deep_alignment.lane_plan_recorded'],
    DeepAlignmentWireEventTypes['deep_alignment.lane_started'],
    DeepAlignmentWireEventTypes['deep_alignment.lane_completed'],
  ]),
  subject: new Set([DeepAlignmentWireEventTypes['deep_alignment.subject_snapshot_bound']]),
  applicability: new Set([DeepAlignmentWireEventTypes['deep_alignment.applicability_evaluated']]),
  observation: new Set([
    DeepAlignmentWireEventTypes['deep_alignment.observation_recorded'],
    DeepAlignmentWireEventTypes['deep_alignment.observation_reconciled'],
  ]),
  candidate: new Set([DeepAlignmentWireEventTypes['deep_alignment.finding_candidate_emitted']]),
  evidence: new Set([DeepAlignmentWireEventTypes['deep_alignment.evidence_receipt_bound']]),
  verification: new Set([DeepAlignmentWireEventTypes['deep_alignment.finding_verification_recorded']]),
  proof: new Set([DeepAlignmentWireEventTypes['deep_alignment.proof_witness_recorded']]),
  adjudication: new Set([DeepAlignmentWireEventTypes['deep_alignment.claim_adjudication_recorded']]),
  conformance: new Set([DeepAlignmentWireEventTypes['deep_alignment.conformance_assessment_recorded']]),
  lineage: new Set([
    DeepAlignmentWireEventTypes['deep_alignment.finding_lineage_recorded'],
    DeepAlignmentWireEventTypes['deep_alignment.finding_state_changed'],
  ]),
  deviation: new Set([
    DeepAlignmentWireEventTypes['deep_alignment.known_deviation_recorded'],
    DeepAlignmentWireEventTypes['deep_alignment.known_deviation_invalidated'],
  ]),
  'witness-replay': new Set([DeepAlignmentWireEventTypes['deep_alignment.authority_witness_replayed']]),
  coverage: new Set([DeepAlignmentWireEventTypes['deep_alignment.applicability_coverage_recorded']]),
  convergence: new Set([
    DeepAlignmentWireEventTypes['deep_alignment.convergence_evaluated'],
    DeepAlignmentWireEventTypes['deep_alignment.graph_convergence_evaluated'],
  ]),
  'blocked-stop': new Set([
    DeepAlignmentWireEventTypes['deep_alignment.blocked_stop_recorded'],
    DeepAlignmentWireEventTypes['deep_alignment.pause_recorded'],
  ]),
  synthesis: new Set([DeepAlignmentWireEventTypes['deep_alignment.synthesis_started']]),
  report: new Set([DeepAlignmentWireEventTypes['deep_alignment.review_report_committed']]),
  continuity: new Set([
    DeepAlignmentWireEventTypes['deep_alignment.continuity_save_requested'],
    DeepAlignmentWireEventTypes['deep_alignment.continuity_save_completed'],
    DeepAlignmentWireEventTypes['deep_alignment.continuity_save_failed'],
  ]),
  completion: new Set([DeepAlignmentWireEventTypes['deep_alignment.run_completed']]),
  recovery: new Set([
    DeepAlignmentWireEventTypes['deep_alignment.run_resumed'],
    DeepAlignmentWireEventTypes['deep_alignment.run_restarted'],
    DeepAlignmentWireEventTypes['deep_alignment.recovery_started'],
  ]),
});

function closureRule(
  containingArtifactKind: DeepAlignmentArtifactKind,
  field: string,
  expectedArtifactKinds: readonly DeepAlignmentArtifactKind[],
  cardinality: DeepAlignmentNamedDigestClosureRule['cardinality'],
  allowEmpty = false,
): DeepAlignmentNamedDigestClosureRule {
  return Object.freeze({
    containingArtifactKind,
    field,
    expectedArtifactKinds: Object.freeze([...expectedArtifactKinds]),
    cardinality,
    allowEmpty,
  });
}

const CONVERGENCE_INPUT_KINDS = Object.freeze([
  DeepAlignmentArtifactKinds.LANE_CONFIGURATION,
  DeepAlignmentArtifactKinds.RULE_MANIFEST,
  DeepAlignmentArtifactKinds.APPLICABILITY_DECISION,
  DeepAlignmentArtifactKinds.DISCOVERY_MANIFEST,
  DeepAlignmentArtifactKinds.TARGET_SNAPSHOT,
  DeepAlignmentArtifactKinds.DETECTOR_INPUT,
  DeepAlignmentArtifactKinds.VERIFIER_INPUT,
  DeepAlignmentArtifactKinds.WITNESS_MATRIX,
  DeepAlignmentArtifactKinds.FINDING_EVIDENCE,
  DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION,
] as const);

export const DEEP_ALIGNMENT_NAMED_DIGEST_CLOSURE_RULES = Object.freeze([
  closureRule(DeepAlignmentArtifactKinds.APPLICABILITY_DECISION, 'subjectSnapshotDigest', [DeepAlignmentArtifactKinds.TARGET_SNAPSHOT], 'scalar'),
  closureRule(DeepAlignmentArtifactKinds.DETECTOR_INPUT, 'subjectSnapshotDigest', [DeepAlignmentArtifactKinds.TARGET_SNAPSHOT], 'scalar'),
  closureRule(DeepAlignmentArtifactKinds.DETECTOR_INPUT, 'applicabilityDecisionDigest', [DeepAlignmentArtifactKinds.APPLICABILITY_DECISION], 'scalar'),
  closureRule(DeepAlignmentArtifactKinds.VERIFIER_INPUT, 'subjectSnapshotDigest', [DeepAlignmentArtifactKinds.TARGET_SNAPSHOT], 'scalar'),
  closureRule(DeepAlignmentArtifactKinds.VERIFIER_INPUT, 'applicabilityDecisionDigest', [DeepAlignmentArtifactKinds.APPLICABILITY_DECISION], 'scalar'),
  closureRule(DeepAlignmentArtifactKinds.WITNESS_MATRIX, 'subjectSnapshotDigest', [DeepAlignmentArtifactKinds.TARGET_SNAPSHOT], 'scalar'),
  closureRule(DeepAlignmentArtifactKinds.FINDING_EVIDENCE, 'subjectSnapshotDigest', [DeepAlignmentArtifactKinds.TARGET_SNAPSHOT], 'scalar'),
  closureRule(DeepAlignmentArtifactKinds.FINDING_EVIDENCE, 'authorityDigest', [DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE], 'scalar'),
  closureRule(DeepAlignmentArtifactKinds.FINDING_EVIDENCE, 'applicabilityDecisionDigest', [DeepAlignmentArtifactKinds.APPLICABILITY_DECISION], 'scalar'),
  closureRule(DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION, 'findingDigest', [DeepAlignmentArtifactKinds.FINDING_EVIDENCE], 'scalar'),
  closureRule(DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION, 'subjectSnapshotDigest', [DeepAlignmentArtifactKinds.TARGET_SNAPSHOT], 'scalar'),
  closureRule(DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION, 'authorityDigest', [DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE], 'scalar'),
  closureRule(DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT, 'orderedInputDigests', CONVERGENCE_INPUT_KINDS, 'array'),
  closureRule(DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT, 'findingsViewDigest', [DeepAlignmentArtifactKinds.FINDING_EVIDENCE], 'scalar'),
  closureRule(DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT, 'exceptionViewDigest', [DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION], 'scalar'),
  closureRule(DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT, 'unresolvedFindingDigests', [DeepAlignmentArtifactKinds.FINDING_EVIDENCE], 'array', true),
  closureRule(DeepAlignmentArtifactKinds.ALIGNMENT_REPORT, 'orderedInputDigests', [
    DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT,
    DeepAlignmentArtifactKinds.FINDING_EVIDENCE,
    DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION,
  ], 'array'),
  closureRule(DeepAlignmentArtifactKinds.ALIGNMENT_REPORT, 'convergenceSnapshotDigest', [DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT], 'scalar'),
  closureRule(DeepAlignmentArtifactKinds.ALIGNMENT_REPORT, 'findingsViewDigest', [DeepAlignmentArtifactKinds.FINDING_EVIDENCE], 'scalar'),
  closureRule(DeepAlignmentArtifactKinds.ALIGNMENT_REPORT, 'exceptionViewDigest', [DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION], 'scalar'),
  closureRule(DeepAlignmentArtifactKinds.ALIGNMENT_REPORT, 'unresolvedFindingDigests', [DeepAlignmentArtifactKinds.FINDING_EVIDENCE], 'array', true),
  closureRule(DeepAlignmentArtifactKinds.ALIGNMENT_REPORT, 'reportDigest', [DeepAlignmentArtifactKinds.ALIGNMENT_REPORT], 'scalar'),
  closureRule(DeepAlignmentArtifactKinds.RESUME_SAVE_HANDOFF, 'affectedLaneDigests', [DeepAlignmentArtifactKinds.LANE_CONFIGURATION], 'array', true),
  closureRule(DeepAlignmentArtifactKinds.RESUME_SAVE_HANDOFF, 'affectedFindingDigests', [DeepAlignmentArtifactKinds.FINDING_EVIDENCE], 'array', true),
  closureRule(DeepAlignmentArtifactKinds.RESUME_SAVE_HANDOFF, 'offeredViewDigest', [DeepAlignmentArtifactKinds.ALIGNMENT_REPORT], 'scalar'),
] as const satisfies readonly DeepAlignmentNamedDigestClosureRule[]);

interface TransitionDispositionEvidence {
  readonly disposition: DeepAlignmentTransitionDisposition;
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
  readonly receiptSubstrate: DeepAlignmentTransitionReceiptSubstrate;
  readonly issuer: string;
  readonly issuedAt: string;
}

interface TransitionReceiptContext extends TransitionReceiptBaseContext {
  readonly artifactStore?: DeepAlignmentCertificateIssuerInput<JsonObject>['artifactStore'];
  readonly artifactBindings?: readonly DeepAlignmentSealedArtifactBinding[];
  readonly artifactKindsByQualifiedDigest?: ReadonlyMap<string, DeepAlignmentArtifactKind>;
}

interface PreparedTransitionReceiptContext extends TransitionReceiptBaseContext {
  readonly artifactEvidenceByQualifiedDigest: ReadonlyMap<string, ArtifactReferenceEvidence>;
  readonly memoryHandoffCorrespondenceByQualifiedDigest: ReadonlyMap<
    string,
    MemoryHandoffCorrespondence
  >;
}

interface ArtifactReferenceEvidence {
  readonly kind: DeepAlignmentArtifactKind;
  readonly material: DeepAlignmentArtifactMaterial;
  readonly contentDigest: string;
  readonly qualifiedDigest: string;
}

interface VerifiedArtifactSet {
  readonly claims: readonly DeepAlignmentCertificateArtifactClaim[];
  readonly evidenceByQualifiedDigest: ReadonlyMap<string, ArtifactReferenceEvidence>;
}

interface MemoryHandoffCorrespondence {
  readonly finalReferenceSetDigest: string;
  readonly offeredViewDigests: ReadonlySet<string>;
}

interface TransitionArtifactProfile {
  readonly inputLifecycles: ReadonlySet<DeepAlignmentArtifactLifecycle>;
  readonly outputLifecycles: ReadonlySet<DeepAlignmentArtifactLifecycle>;
}

interface TransitionOutputClaim {
  readonly transitionKind: DeepAlignmentTransitionKind;
  readonly logicalOperationId: string;
  readonly inputArtifactQualifiedDigests: readonly string[];
  readonly outputArtifactQualifiedDigests: readonly string[];
}

const ALL_ARTIFACT_LIFECYCLES = new Set<DeepAlignmentArtifactLifecycle>(
  DEEP_ALIGNMENT_ARTIFACT_KIND_REGISTRY.map((entry) => entry.lifecycle),
);
const ARTIFACT_LIFECYCLE_BY_KIND = new Map<
  DeepAlignmentArtifactKind,
  DeepAlignmentArtifactLifecycle
>(DEEP_ALIGNMENT_ARTIFACT_KIND_REGISTRY.map((entry) => [entry.artifactKind, entry.lifecycle]));

function artifactLifecycles(
  ...values: readonly DeepAlignmentArtifactLifecycle[]
): ReadonlySet<DeepAlignmentArtifactLifecycle> {
  return new Set(values);
}

const TRANSITION_ARTIFACT_PROFILES: Readonly<Record<
  DeepAlignmentTransitionKind,
  TransitionArtifactProfile
>> = Object.freeze({
  init: Object.freeze({
    inputLifecycles: artifactLifecycles('init/scope'),
    outputLifecycles: artifactLifecycles('init/scope'),
  }),
  authority: Object.freeze({
    inputLifecycles: artifactLifecycles('init/scope'),
    outputLifecycles: artifactLifecycles('init/scope'),
  }),
  scope: Object.freeze({
    inputLifecycles: artifactLifecycles('init/scope', 'discover'),
    outputLifecycles: artifactLifecycles('init/scope', 'discover'),
  }),
  lane: Object.freeze({
    inputLifecycles: artifactLifecycles('init/scope', 'discover'),
    outputLifecycles: artifactLifecycles('init/scope', 'discover'),
  }),
  subject: Object.freeze({
    inputLifecycles: artifactLifecycles('init/scope', 'discover'),
    outputLifecycles: artifactLifecycles('discover'),
  }),
  applicability: Object.freeze({
    inputLifecycles: artifactLifecycles('init/scope', 'discover', 'iterate/check'),
    outputLifecycles: artifactLifecycles('iterate/check'),
  }),
  'dimension-pass': Object.freeze({
    inputLifecycles: artifactLifecycles('init/scope', 'discover', 'iterate/check'),
    outputLifecycles: artifactLifecycles('discover', 'iterate/check'),
  }),
  observation: Object.freeze({
    inputLifecycles: artifactLifecycles('discover', 'iterate/check'),
    outputLifecycles: artifactLifecycles('iterate/check'),
  }),
  candidate: Object.freeze({
    inputLifecycles: artifactLifecycles('discover', 'iterate/check'),
    outputLifecycles: artifactLifecycles('iterate/check'),
  }),
  evidence: Object.freeze({
    inputLifecycles: artifactLifecycles('discover', 'iterate/check'),
    outputLifecycles: artifactLifecycles('iterate/check'),
  }),
  verification: Object.freeze({
    inputLifecycles: artifactLifecycles('discover', 'iterate/check', 'witness/exception'),
    outputLifecycles: artifactLifecycles('iterate/check'),
  }),
  proof: Object.freeze({
    inputLifecycles: artifactLifecycles('discover', 'iterate/check'),
    outputLifecycles: artifactLifecycles('witness/exception'),
  }),
  adjudication: Object.freeze({
    inputLifecycles: artifactLifecycles('iterate/check', 'witness/exception'),
    outputLifecycles: artifactLifecycles('iterate/check'),
  }),
  conformance: Object.freeze({
    inputLifecycles: artifactLifecycles('iterate/check', 'witness/exception'),
    outputLifecycles: artifactLifecycles('iterate/check'),
  }),
  lineage: Object.freeze({
    inputLifecycles: artifactLifecycles('iterate/check'),
    outputLifecycles: artifactLifecycles('iterate/check'),
  }),
  deviation: Object.freeze({
    inputLifecycles: artifactLifecycles('iterate/check', 'witness/exception'),
    outputLifecycles: artifactLifecycles('witness/exception'),
  }),
  'witness-replay': Object.freeze({
    inputLifecycles: artifactLifecycles('init/scope', 'discover', 'witness/exception'),
    outputLifecycles: artifactLifecycles('witness/exception'),
  }),
  coverage: Object.freeze({
    inputLifecycles: artifactLifecycles('discover', 'iterate/check'),
    outputLifecycles: artifactLifecycles('iterate/check'),
  }),
  convergence: Object.freeze({
    inputLifecycles: artifactLifecycles('iterate/check', 'witness/exception', 'convergence/report'),
    outputLifecycles: artifactLifecycles('convergence/report'),
  }),
  'blocked-stop': Object.freeze({
    inputLifecycles: artifactLifecycles('convergence/report'),
    outputLifecycles: artifactLifecycles('convergence/report'),
  }),
  synthesis: Object.freeze({
    inputLifecycles: artifactLifecycles('iterate/check', 'witness/exception', 'convergence/report'),
    outputLifecycles: artifactLifecycles('convergence/report'),
  }),
  report: Object.freeze({
    inputLifecycles: artifactLifecycles('convergence/report'),
    outputLifecycles: artifactLifecycles('convergence/report'),
  }),
  continuity: Object.freeze({
    inputLifecycles: ALL_ARTIFACT_LIFECYCLES,
    outputLifecycles: artifactLifecycles('resume/save'),
  }),
  completion: Object.freeze({
    inputLifecycles: ALL_ARTIFACT_LIFECYCLES,
    outputLifecycles: artifactLifecycles('convergence/report', 'resume/save'),
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
  verified: DeepAlignmentVerifiedSealedArtifact,
): ArtifactReferenceEvidence {
  let decoded: unknown;
  try {
    decoded = JSON.parse(new TextDecoder().decode(Uint8Array.from(verified.bytes)));
  } catch {
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
      `artifact:${verified.binding.reference.qualified_digest}`,
      'Verified artifact bytes do not expose their canonical material identity',
    );
  }
  const capsule = recordValue(decoded);
  const material = recordValue(capsule?.material);
  if (capsule?.artifactKind !== verified.binding.artifactKind || !material) {
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
      `artifact:${verified.binding.reference.qualified_digest}`,
      'Verified artifact material identity disagrees with its sealed binding',
    );
  }
  return Object.freeze({
    kind: verified.binding.artifactKind,
    material: material as unknown as DeepAlignmentArtifactMaterial,
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
  input: DeepAlignmentTransitionReceiptInput,
): string {
  return `da-transition:${digest({
    runId,
    transitionKind: input.transitionKind,
    logicalOperationId: input.logicalOperationId,
  })}`;
}

function eventData(event: VerifiedLedgerEvent): Readonly<Record<string, unknown>> {
  const payload = event.event.effective.envelope.payload;
  const data = payload.data;
  if (data === null || Array.isArray(data) || typeof data !== 'object') {
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.LEDGER_INVALID,
      `event:${event.frame.sequence}`,
      'Transition result event is missing its closed data object',
    );
  }
  return data as Readonly<Record<string, unknown>>;
}

function eventScope(event: VerifiedLedgerEvent): Readonly<Record<string, unknown>> {
  const scope = recordValue(event.event.effective.envelope.payload.scope);
  if (!scope) {
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.LEDGER_INVALID,
      `event:${event.frame.sequence}`,
      'Transition result event is missing its closed scope object',
    );
  }
  return scope;
}

function primaryArtifactIdentity(evidence: ArtifactReferenceEvidence): string | null {
  const material = evidence.material as unknown as Readonly<Record<string, unknown>>;
  const field = evidence.kind === DeepAlignmentArtifactKinds.TARGET_SNAPSHOT
    ? 'snapshotDigest'
    : evidence.kind === DeepAlignmentArtifactKinds.APPLICABILITY_DECISION
      ? 'materialDigest'
      : evidence.kind === DeepAlignmentArtifactKinds.FINDING_EVIDENCE
        ? 'materialDigest'
        : evidence.kind === DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT
          ? 'materialDigest'
          : evidence.kind === DeepAlignmentArtifactKinds.ALIGNMENT_REPORT
            ? 'reportDigest'
            : evidence.kind === DeepAlignmentArtifactKinds.RESUME_SAVE_HANDOFF
              ? 'continuityPayloadDigest'
              : 'materialDigest';
  const value = material[field];
  return typeof value === 'string' ? value : null;
}

function memoryHandoffCorrespondences(
  transitions: readonly DeepAlignmentTransitionReceiptInput[],
  evidenceByQualifiedDigest: ReadonlyMap<string, ArtifactReferenceEvidence>,
): ReadonlyMap<string, MemoryHandoffCorrespondence> {
  const correspondences = new Map<string, MemoryHandoffCorrespondence>();
  for (const transition of transitions) {
    if (transition.transitionKind !== DeepAlignmentTransitionKinds.CONTINUITY) continue;
    const offeredViewDigests = new Set<string>();
    for (const reference of transition.inputArtifactQualifiedDigests) {
      const evidence = evidenceByQualifiedDigest.get(reference);
      if (!evidence || ARTIFACT_LIFECYCLE_BY_KIND.get(evidence.kind) !== 'convergence/report') continue;
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
        throw new DeepAlignmentCertificateError(
          DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
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
  const data = recordValue(payload?.data);
  const scope = recordValue(payload?.scope);
  const material = evidence.material as unknown as Readonly<Record<string, unknown>>;
  const stem = payload?.stem;
  if (
    typeof stem !== 'string'
    || !(stem in DeepAlignmentWireEventTypes)
    || DeepAlignmentWireEventTypes[stem as keyof typeof DeepAlignmentWireEventTypes]
      !== envelope.event_type
    || material.authorityEpochId !== scope?.authorityEpochId
    || !data
  ) {
    return false;
  }
  switch (evidence.kind) {
    case DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE:
      return (
        stem === 'deep_alignment.authority_validation_recorded'
        || stem === 'deep_alignment.authority_epoch_compatibility_recorded'
        || (
          stem === 'deep_alignment.authority_reference_bound'
          && material.authorityId === data.authorityId
          && material.authoritySourceDigest === data.authoritySourceDigest
        )
      );
    case DeepAlignmentArtifactKinds.LANE_CONFIGURATION:
      return (
        typeof scope?.laneId === 'string'
        && material.laneId === scope.laneId
      ) || stem === 'deep_alignment.run_initialized'
        || stem === 'deep_alignment.scope_resolved'
        || stem === 'deep_alignment.dimension_ordered'
        || stem === 'deep_alignment.lane_completed';
    case DeepAlignmentArtifactKinds.RULE_MANIFEST:
      return (
        stem === 'deep_alignment.lane_plan_recorded'
        && material.ruleIrDigest === data.ruleIrDigest
      ) || stem === 'deep_alignment.protocol_plan_recorded';
    case DeepAlignmentArtifactKinds.APPLICABILITY_DECISION:
      return (
        stem === 'deep_alignment.applicability_evaluated'
        && material.laneId === scope?.laneId
        && material.subjectId === scope?.subjectId
        && material.ruleId === scope?.ruleId
        && material.decisionId === envelope.event_id
        && material.materialDigest === data.decisionDigest
        && String(material.result).replace('-', '_') === data.result
      ) || (
        stem === 'deep_alignment.applicability_coverage_recorded'
        && material.laneId === scope?.laneId
      );
    case DeepAlignmentArtifactKinds.DISCOVERY_MANIFEST:
      return (
        stem === 'deep_alignment.scope_resolved'
        && material.selectedScopeDigest === data.targetSetDigest
      ) || stem === 'deep_alignment.dimension_pass_started'
        || stem === 'deep_alignment.dimension_pass_completed';
    case DeepAlignmentArtifactKinds.TARGET_SNAPSHOT:
      return (
        stem === 'deep_alignment.subject_snapshot_bound'
        && material.subjectId === scope?.subjectId
        && material.subjectDigest === data.subjectDigest
      ) || (
        stem === 'deep_alignment.lane_started'
        && material.snapshotDigest === data.subjectSnapshotDigest
      );
    case DeepAlignmentArtifactKinds.DETECTOR_INPUT:
      return (
        stem === 'deep_alignment.observation_recorded'
        && material.laneId === scope?.laneId
        && material.ruleId === scope?.ruleId
      ) || (
        (
          stem === 'deep_alignment.evidence_receipt_bound'
          || stem === 'deep_alignment.observation_reconciled'
          || stem === 'deep_alignment.finding_candidate_emitted'
        )
        && material.laneId === scope?.laneId
        && material.ruleId === scope?.ruleId
      );
    case DeepAlignmentArtifactKinds.VERIFIER_INPUT:
      return stem === 'deep_alignment.finding_verification_recorded'
        && material.subjectSnapshotDigest === data.subjectSnapshotDigest;
    case DeepAlignmentArtifactKinds.WITNESS_MATRIX:
      return (
        stem === 'deep_alignment.proof_witness_recorded'
        && stringArray(material.witnessDigests).includes(String(data.witnessDigest))
      ) || (
        stem === 'deep_alignment.authority_witness_replayed'
        && material.laneId === scope?.laneId
        && material.ruleId === scope?.ruleId
      );
    case DeepAlignmentArtifactKinds.FINDING_EVIDENCE:
      return (
        stem === 'deep_alignment.finding_verification_recorded'
        || stem === 'deep_alignment.claim_adjudication_recorded'
        || stem === 'deep_alignment.conformance_assessment_recorded'
        || stem === 'deep_alignment.finding_candidate_emitted'
        || stem === 'deep_alignment.finding_lineage_recorded'
        || stem === 'deep_alignment.finding_state_changed'
      ) && material.findingId === scope?.findingId;
    case DeepAlignmentArtifactKinds.GOVERNED_EXCEPTION:
      return (
        stem === 'deep_alignment.known_deviation_recorded'
        || stem === 'deep_alignment.known_deviation_invalidated'
      ) && material.exceptionId === scope?.deviationId;
    case DeepAlignmentArtifactKinds.CONVERGENCE_SNAPSHOT:
      return (
        stem === 'deep_alignment.convergence_evaluated'
        || stem === 'deep_alignment.graph_convergence_evaluated'
      ) && material.coverageDigest === data.dimensionCoverageDigest
        || stem === 'deep_alignment.synthesis_started'
        || stem === 'deep_alignment.blocked_stop_recorded'
        || stem === 'deep_alignment.pause_recorded';
    case DeepAlignmentArtifactKinds.ALIGNMENT_REPORT:
      return (
        stem === 'deep_alignment.review_report_committed'
        && material.reportDigest === data.reportDigest
      ) || stem === 'deep_alignment.run_completed';
    case DeepAlignmentArtifactKinds.RESUME_SAVE_HANDOFF:
      return (
        stem === 'deep_alignment.continuity_save_requested'
        || stem === 'deep_alignment.continuity_save_completed'
        || stem === 'deep_alignment.continuity_save_failed'
      ) && material.continuityPayloadDigest === data.continuityPayloadDigest
        || stem === 'deep_alignment.run_resumed'
        || stem === 'deep_alignment.run_restarted'
        || stem === 'deep_alignment.recovery_started';
    default: {
      const exhaustiveKind: never = evidence.kind;
      return exhaustiveKind;
    }
  }
}

function assertProjectionMatchesVerifiedLedger(
  projectionEvents: readonly DeepAlignmentLedgerEvent[],
  ledgerEvents: readonly VerifiedLedgerEvent[],
): void {
  const verifiedEnvelopes = ledgerEvents.map((event) => event.event.effective.envelope);
  if (canonicalJson(asJson(projectionEvents)) !== canonicalJson(asJson(verifiedEnvelopes))) {
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.PROJECTION_INVALID,
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
    case DeepAlignmentWireEventTypes['deep_alignment.authority_validation_recorded']:
      return data.authorityStatus === 'valid'
        ? null
        : { disposition: 'blocked', dispositionReason: 'Authority validation is not valid.' };
    case DeepAlignmentWireEventTypes['deep_alignment.lane_completed']:
      return data.status === 'complete'
        ? null
        : data.status === 'blocked'
          ? { disposition: 'blocked', dispositionReason: 'Alignment lane is blocked.' }
          : { disposition: 'incomplete', dispositionReason: 'Alignment lane is incomplete.' };
    case DeepAlignmentWireEventTypes['deep_alignment.applicability_evaluated']:
      return data.result === 'blocked'
        ? { disposition: 'blocked', dispositionReason: 'Applicability evaluation is blocked.' }
        : data.result === 'unresolved'
          ? { disposition: 'incomplete', dispositionReason: 'Applicability remains unresolved.' }
          : null;
    case DeepAlignmentWireEventTypes['deep_alignment.dimension_pass_completed']:
      if (data.passStatus === 'blocked') {
        return { disposition: 'blocked', dispositionReason: 'Dimension pass is blocked.' };
      }
      if (data.passStatus === 'incomplete') {
        return { disposition: 'incomplete', dispositionReason: 'Dimension pass is incomplete.' };
      }
      return null;
    case DeepAlignmentWireEventTypes['deep_alignment.observation_recorded']:
      return data.freshness === 'fresh' && data.causalRelevance === 'direct'
        ? null
        : { disposition: 'in_doubt', dispositionReason: 'Observation freshness or causal relevance is unresolved.' };
    case DeepAlignmentWireEventTypes['deep_alignment.evidence_receipt_bound']:
      return data.freshness === 'fresh'
        ? null
        : { disposition: 'in_doubt', dispositionReason: 'Evidence receipt is stale or unresolved.' };
    case DeepAlignmentWireEventTypes['deep_alignment.observation_reconciled']:
      return data.reconciliationOutcome === 'confirmed'
        ? null
        : { disposition: 'in_doubt', dispositionReason: 'Late evidence changes or supersedes the observation.' };
    case DeepAlignmentWireEventTypes['deep_alignment.finding_verification_recorded']:
      return data.result === 'confirmed' || data.result === 'disproved'
        ? null
        : data.result === 'blocked'
          ? { disposition: 'blocked', dispositionReason: 'Independent finding verification is blocked.' }
          : { disposition: 'incomplete', dispositionReason: 'Independent finding verification is inconclusive.' };
    case DeepAlignmentWireEventTypes['deep_alignment.proof_witness_recorded']:
      return data.outcome === 'supports'
        ? null
        : { disposition: 'incomplete', dispositionReason: 'Proof witness does not support the verified claim.' };
    case DeepAlignmentWireEventTypes['deep_alignment.claim_adjudication_recorded']:
      return data.outcome === 'accepted'
        ? null
        : { disposition: 'incomplete', dispositionReason: 'Candidate was not accepted as an active finding.' };
    case DeepAlignmentWireEventTypes['deep_alignment.conformance_assessment_recorded']:
      return data.conformanceStatus === 'blocked'
        ? { disposition: 'blocked', dispositionReason: 'Conformance assessment is blocked.' }
        : data.conformanceStatus === 'inconclusive' || data.conformanceStatus === 'untested'
          ? { disposition: 'incomplete', dispositionReason: 'Conformance assessment is unresolved.' }
          : null;
    case DeepAlignmentWireEventTypes['deep_alignment.authority_witness_replayed']:
      return data.replayOutcome === 'accepted'
        ? null
        : data.replayOutcome === 'blocked'
          ? { disposition: 'blocked', dispositionReason: 'Authority witness replay is blocked.' }
          : { disposition: 'in_doubt', dispositionReason: 'Authority witness replay is degraded.' };
    case DeepAlignmentWireEventTypes['deep_alignment.applicability_coverage_recorded']:
      return stringArray(data.unresolvedRuleIds).length === 0
        && stringArray(data.untestedRuleIds).length === 0
        && stringArray(data.blockedRuleIds).length === 0
        ? null
        : { disposition: 'incomplete', dispositionReason: 'Applicability coverage has unresolved required rules.' };
    case DeepAlignmentWireEventTypes['deep_alignment.continuity_save_failed']:
      return data.retryable === true
        ? { disposition: 'in_doubt', dispositionReason: 'Continuity effect requires reconciliation before retry.' }
        : { disposition: 'failed', dispositionReason: 'Continuity persistence failed conclusively.' };
    default:
      return null;
  }
}

function transitionDisposition(
  transitionKind: DeepAlignmentTransitionKind,
  event: VerifiedLedgerEvent,
): TransitionDispositionEvidence {
  const eventType = event.event.effective.envelope.event_type;
  if (!TRANSITION_EVENT_TYPES[transitionKind].has(eventType)) {
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.LEDGER_INVALID,
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
    case 'authority':
      return { disposition: 'succeeded', dispositionReason: 'Authorized authority evidence is durable.' };
    case 'scope':
      return { disposition: 'succeeded', dispositionReason: 'Authorized scope evidence is durable.' };
    case 'lane':
      return { disposition: 'succeeded', dispositionReason: 'Authorized lane evidence is durable.' };
    case 'subject':
      return { disposition: 'succeeded', dispositionReason: 'Authorized subject snapshot evidence is durable.' };
    case 'applicability':
      return { disposition: 'succeeded', dispositionReason: 'Authorized applicability evidence is durable.' };
    case 'dimension-pass':
      return { disposition: 'succeeded', dispositionReason: 'Authorized dimension-pass evidence is durable.' };
    case 'observation':
      return { disposition: 'succeeded', dispositionReason: 'Authorized raw observation evidence is durable.' };
    case 'candidate':
      return { disposition: 'succeeded', dispositionReason: 'Authorized raw candidate evidence is durable.' };
    case 'evidence':
      return { disposition: 'succeeded', dispositionReason: 'Authorized independent evidence is durable.' };
    case 'verification':
      return { disposition: 'succeeded', dispositionReason: 'Authorized independent verification evidence is durable.' };
    case 'proof':
      return { disposition: 'succeeded', dispositionReason: 'Authorized proof witness evidence is durable.' };
    case 'adjudication':
      return { disposition: 'succeeded', dispositionReason: 'Authorized adjudication evidence is durable.' };
    case 'conformance':
      return { disposition: 'succeeded', dispositionReason: 'Authorized conformance disposition is durable.' };
    case 'lineage':
      return { disposition: 'succeeded', dispositionReason: 'Authorized finding lineage is durable.' };
    case 'deviation':
      return { disposition: 'succeeded', dispositionReason: 'Authorized deviation chronology is durable.' };
    case 'witness-replay':
      return { disposition: 'succeeded', dispositionReason: 'Authorized authority witness replay is durable.' };
    case 'coverage':
      return { disposition: 'succeeded', dispositionReason: 'Authorized applicability coverage is durable.' };
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
          throw new DeepAlignmentCertificateError(
            DeepAlignmentCertificateFailureCodes.CONVERGENCE_INVALID,
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
      if (eventType === DeepAlignmentWireEventTypes['deep_alignment.recovery_started']) {
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
          throw new DeepAlignmentCertificateError(
            DeepAlignmentCertificateFailureCodes.LEDGER_INVALID,
            'transition:recovery',
            'Recovery event carries an unregistered compatibility decision',
          );
      }
    }
    default: {
      const exhaustiveKind: never = transitionKind;
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.UNSUPPORTED_VERSION,
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
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.CERTIFICATION_INVALID,
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
  input: DeepAlignmentTransitionReceiptInput,
  artifactEvidenceByQualifiedDigest: ReadonlyMap<string, ArtifactReferenceEvidence>,
): void {
  const referencesByRole = [
    ['inputs', input.inputArtifactQualifiedDigests],
    ['outputs', input.outputArtifactQualifiedDigests],
  ] as const;
  const references = referencesByRole.flatMap(([, roleReferences]) => roleReferences);
  if (input.outputArtifactQualifiedDigests.length === 0) {
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.EVIDENCE_INCOMPLETE,
      `transition:${input.transitionKind}:outputs`,
      'Every transition receipt requires at least one verified output artifact',
    );
  }
  if (new Set(references).size !== references.length) {
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.CERTIFICATE_INVALID,
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
        throw new DeepAlignmentCertificateError(
          DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
          `transition:${input.transitionKind}:${role}`,
          'Transition receipt references an artifact outside the verified run set',
        );
      }
      const lifecycle = ARTIFACT_LIFECYCLE_BY_KIND.get(evidence.kind);
      if (!lifecycle || !allowedLifecycles.has(lifecycle)) {
        throw new DeepAlignmentCertificateError(
          DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
          `transition:${input.transitionKind}:${role}`,
          'Transition receipt references a verified artifact of the wrong kind',
        );
      }
    }
  }
}

function requireArtifactEventCorrespondence(
  input: DeepAlignmentTransitionReceiptInput,
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
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
        `transition:${input.transitionKind}:outputs`,
        'Transition output artifact identity does not correspond to its authorized result event',
      );
    }
  }

  for (const reference of input.inputArtifactQualifiedDigests) {
    if (!context.artifactEvidenceByQualifiedDigest.has(reference)) {
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
        `transition:${input.transitionKind}:inputs`,
        'Transition input artifact identity is outside the verified run closure',
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
        throw new DeepAlignmentCertificateError(
          DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
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
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.LEDGER_INVALID,
      `event:${resultEventId}`,
      'Transition result event must resolve exactly once in the authorized ledger',
    );
  }
  return matches[0] as VerifiedLedgerEvent;
}

function buildTransitionFacts(
  input: DeepAlignmentTransitionReceiptInput,
  context: Omit<PreparedTransitionReceiptContext, 'receiptSubstrate'>,
): DeepAlignmentTransitionReceiptFacts {
  requireArtifactReferences(input, context.artifactEvidenceByQualifiedDigest);
  const event = findResultEvent(context.ledgerEvents, input.resultEventId);
  requireArtifactEventCorrespondence(input, event, context);
  const envelope = event.event.effective.envelope;
  const evidence = transitionDisposition(input.transitionKind, event);
  const heads = eventHeads(event);
  return Object.freeze({
    receiptVersion: DEEP_ALIGNMENT_RECEIPT_VERSION,
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
  facts: DeepAlignmentTransitionReceiptFacts,
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
  facts: DeepAlignmentTransitionReceiptFacts,
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
  substrate: DeepAlignmentTransitionReceiptSubstrate,
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
  facts: DeepAlignmentTransitionReceiptFacts,
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
  store: DeepAlignmentCertificateIssuerInput<JsonObject>['artifactStore'],
  bindings: readonly DeepAlignmentSealedArtifactBinding[],
): Promise<VerifiedArtifactSet> {
  if (bindings.length === 0) {
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.EVIDENCE_INCOMPLETE,
      'certificate:artifacts',
      'Run certificate requires a non-empty sealed-reference set',
    );
  }
  const claims: DeepAlignmentCertificateArtifactClaim[] = [];
  const evidenceByQualifiedDigest = new Map<string, ArtifactReferenceEvidence>();
  for (const binding of bindings) {
    const verified = await readDeepAlignmentArtifact(store, binding);
    const qualifiedDigest = verified.binding.reference.qualified_digest;
    if (evidenceByQualifiedDigest.has(qualifiedDigest)) {
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
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
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
        `artifact:${index}`,
        'Verified artifact evidence is absent from the run closure',
      );
    }
    if (byContentDigest.has(evidence.contentDigest)) {
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
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
  for (const rule of DEEP_ALIGNMENT_NAMED_DIGEST_CLOSURE_RULES) {
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
        (rule.cardinality === 'array'
          && (!Array.isArray(raw) || !raw.every((entry) => typeof entry === 'string')))
        || (!rule.allowEmpty && values.length === 0)
        || (rule.cardinality === 'scalar' && values.length !== 1)
      ) {
        throw new DeepAlignmentCertificateError(
          DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
          `artifact:${container.kind}:${rule.field}`,
          'Named digest field does not match its declared closure cardinality',
        );
      }
      for (const [position, plainDigest] of values.entries()) {
        const selfOwnedReportDigest = (
          rule.containingArtifactKind === DeepAlignmentArtifactKinds.ALIGNMENT_REPORT
          && rule.field === 'reportDigest'
          && material.reportDigest === plainDigest
          && material.materialDigest === plainDigest
        );
        const referenced = selfOwnedReportDigest
          ? container
          : byContentDigest.get(plainDigest);
        if (!referenced) {
          throw new DeepAlignmentCertificateError(
            DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
            `artifact:${container.kind}:${rule.field}:${position}`,
            'Named digest does not resolve to actually sealed content in the run closure',
            null,
            plainDigest,
          );
        }
        if (!rule.expectedArtifactKinds.includes(referenced.kind)) {
          throw new DeepAlignmentCertificateError(
            DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
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
          typeof containerMaterial.authorityEpochId !== 'string'
          || referencedMaterial.authorityEpochId !== containerMaterial.authorityEpochId
        ) {
          throw new DeepAlignmentCertificateError(
            DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
            `artifact:${container.kind}:${rule.field}:${position}`,
            'Named digest resolves across a stale authority epoch',
          );
        }
        const containerIndex = claimIndex.get(container.qualifiedDigest);
        const referencedIndex = claimIndex.get(referenced.qualifiedDigest);
        if (
          !selfOwnedReportDigest
          && (
          containerIndex === undefined
          || referencedIndex === undefined
          || referencedIndex >= containerIndex
          )
        ) {
          throw new DeepAlignmentCertificateError(
            DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
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
        if (!selfOwnedReportDigest && !ownsReference) {
          throw new DeepAlignmentCertificateError(
            DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
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
  transitions: readonly TransitionOutputClaim[],
): void {
  const referenced = new Set(transitions.flatMap((transition) => [
    ...transition.inputArtifactQualifiedDigests,
    ...transition.outputArtifactQualifiedDigests,
  ]));
  for (const evidence of artifacts.evidenceByQualifiedDigest.values()) {
    if (!referenced.has(evidence.qualifiedDigest)) {
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.AUTHORIZATION_INVALID,
        `artifact:${evidence.qualifiedDigest}`,
        'Every sealed artifact must be owned by an authorized transition receipt',
      );
    }
  }
}

function assertReducerArtifactOwnership(
  artifacts: VerifiedArtifactSet,
  projection: DeepAlignmentProjectionState,
): void {
  const evidence = [...artifacts.evidenceByQualifiedDigest.values()];
  const reference = projection.authorityAlignment.references.find(
    (candidate) => candidate.authorityEpochId === projection.run.authorityEpochId,
  );
  const authorityOwners = evidence.filter((candidate) => {
    if (candidate.kind !== DeepAlignmentArtifactKinds.AUTHORITY_CAPSULE) return false;
    const material = candidate.material as unknown as Readonly<Record<string, unknown>>;
    return material.authorityEpochId === projection.run.authorityEpochId
      && material.authorityId === reference?.authorityId
      && material.materialRef === reference?.authorityCapsuleRef;
  });
  if (!reference || authorityOwners.length !== 1) {
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.AUTHORIZATION_INVALID,
      'artifact:authority-owner',
      'The active authority must resolve to exactly one reducer-owned sealed capsule',
    );
  }

  for (const decision of projection.applicability.decisions) {
    const owners = evidence.filter((candidate) => {
      if (candidate.kind !== DeepAlignmentArtifactKinds.APPLICABILITY_DECISION) return false;
      const material = candidate.material as unknown as Readonly<Record<string, unknown>>;
      return material.decisionId === decision.decisionId
        && material.laneId === decision.laneId
        && material.subjectId === decision.subjectId
        && material.ruleId === decision.ruleId
        && material.materialDigest === decision.decisionDigest
        && String(material.result).replace('-', '_') === decision.result;
    });
    if (owners.length !== 1) {
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.AUTHORIZATION_INVALID,
        `artifact:applicability-owner:${decision.decisionId}`,
        'Each applicability claim must resolve to exactly one reducer-owned sealed decision',
      );
    }
  }
}

async function issueTransitionReceiptWithEvidence(
  input: DeepAlignmentTransitionReceiptInput,
  context: PreparedTransitionReceiptContext,
): Promise<DeepAlignmentTransitionReceipt> {
  const facts = buildTransitionFacts(input, context);
  const receiptDigest = digest(facts);
  const event = findResultEvent(context.ledgerEvents, facts.resultEventId);
  const sharedReceipt = await issueSharedTransitionReceipt(
    facts,
    receiptDigest,
    event,
    context,
  );
  return parseDeepAlignmentTransitionReceipt({ facts, receiptDigest, sharedReceipt });
}

/** Issue one transition receipt from a real authorized result event. */
export async function issueDeepAlignmentTransitionReceipt(
  input: DeepAlignmentTransitionReceiptInput,
  context: TransitionReceiptContext,
): Promise<DeepAlignmentTransitionReceipt> {
  if (!context.artifactStore || !context.artifactBindings) {
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
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
  projection: DeepAlignmentProjectionState,
): DeepAlignmentCertificateConvergenceEvidence {
  const evaluation = projection.reviewLoop.evaluations.at(-1);
  if (!evaluation) {
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.CONVERGENCE_INVALID,
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

function authorityEvidence(
  projection: DeepAlignmentProjectionState,
): DeepAlignmentCertificateAuthorityEvidence {
  const validationEventId = projection.authorityAlignment.activeValidationEventId;
  const validation = projection.authorityAlignment.validations.find(
    (entry) => entry.producerEventId === validationEventId,
  );
  const reference = projection.authorityAlignment.references.find(
    (entry) => entry.authorityEpochId === projection.run.authorityEpochId,
  );
  if (
    projection.authorityAlignment.status !== 'valid'
    || !validation
    || validation.authorityStatus !== 'valid'
    || !reference
  ) {
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.STATUS_INVALID,
      'projection:authority',
      'Trusted certificate issuance requires reducer-derived live authority evidence',
    );
  }
  return Object.freeze({
    authorityEpochId: reference.authorityEpochId,
    authorityId: reference.authorityId,
    authorityCapsuleRef: reference.authorityCapsuleRef,
    validationEventId: validation.producerEventId,
    validationDigest: validation.validationDigest,
  });
}

function applicabilityEvidence(
  projection: DeepAlignmentProjectionState,
): DeepAlignmentCertificateApplicabilityEvidence {
  const coverage = projection.applicability.coverage.at(-1);
  if (!coverage) {
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.EVIDENCE_INCOMPLETE,
      'projection:applicability',
      'Run certificate requires reducer-derived applicability coverage',
    );
  }
  return Object.freeze({
    coverageDigest: coverage.coverageDigest,
    unresolvedRuleIds: Object.freeze([...coverage.unresolvedRuleIds]),
    blockedRuleIds: Object.freeze([...coverage.blockedRuleIds]),
  });
}

function conformanceEvidence(
  projection: DeepAlignmentProjectionState,
): DeepAlignmentCertificateConformanceEvidence {
  return Object.freeze({
    overallVerdict: projection.conformance.overallVerdict,
    activeFindingIds: Object.freeze([...projection.conformance.activeFindingIds]),
    hardVetoFindingIds: Object.freeze([...projection.conformance.hardVetoFindingIds]),
  });
}

function statusEvidence(
  projection: DeepAlignmentProjectionState,
): DeepAlignmentCertificateStatusEvidence {
  const status = projection.status.provenance.at(-1);
  if (!status) {
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.STATUS_INVALID,
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
  projection: DeepAlignmentProjectionState,
  receipts: readonly DeepAlignmentTransitionReceipt[],
): DeepAlignmentCertificateLifecycleResult {
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
    && projection.reviewLoop.terminalDecision === 'pass'
    && projection.authorityAlignment.status === 'valid'
    && projection.applicability.coverage.every((coverage) => (
      coverage.unresolvedRuleIds.length === 0
      && coverage.untestedRuleIds.length === 0
      && coverage.blockedRuleIds.length === 0
    ))
    && projection.lanePlan.lanes.every((lane) => lane.status === 'complete')
    && projection.conformance.overallVerdict === 'PASS'
    && projection.conformance.activeFindingIds.length === 0
    && projection.conformance.hardVetoFindingIds.length === 0
    && openObligationIds(projection).length === 0
    && !hasUntrustedReceipt
  ) {
    return 'trusted-completion';
  }
  return 'incomplete';
}

function outputArtifactQualifiedDigests(
  claims: readonly DeepAlignmentCertificateArtifactClaim[],
): readonly string[] {
  const outputs = claims
    .filter((claim) => (
      claim.binding.artifactKind === DeepAlignmentArtifactKinds.ALIGNMENT_REPORT
      || claim.binding.artifactKind === DeepAlignmentArtifactKinds.RESUME_SAVE_HANDOFF
    ))
    .map((claim) => claim.binding.reference.qualified_digest);
  if (outputs.length === 0) {
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.EVIDENCE_INCOMPLETE,
      'certificate:outputs',
      'Run certificate requires a sealed synthesis or handoff output',
    );
  }
  return Object.freeze(outputs);
}

function openObligationIds(projection: DeepAlignmentProjectionState): readonly string[] {
  return uniqueSorted([
    ...projection.reviewLoop.obligations
      .filter((obligation) => obligation.status !== 'resolved')
      .map((obligation) => obligation.obligationId),
    ...projection.reviewLoop.blockerIds,
  ]);
}

function assertTransitionOrder(receipts: readonly DeepAlignmentTransitionReceipt[]): void {
  const requiredCounts = new Map<DeepAlignmentTransitionKind, number>();
  let lastRank = -1;
  const logicalOperations = new Map<string, DeepAlignmentTransitionReceipt>();
  for (const [index, receipt] of receipts.entries()) {
    const facts = receipt.facts;
    const existing = logicalOperations.get(facts.logicalOperationId);
    if (existing && canonicalJson(existing) !== canonicalJson(receipt)) {
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
        `receipt:${index}`,
        'Logical operation identity is bound to conflicting receipt facts',
      );
    }
    if (existing) continue;
    logicalOperations.set(facts.logicalOperationId, receipt);
    const rank = REQUIRED_TRANSITION_RANK.get(facts.transitionKind);
    if (rank !== undefined) {
      const priorCount = requiredCounts.get(facts.transitionKind) ?? 0;
      if (priorCount === 0 && rank < lastRank) {
        throw new DeepAlignmentCertificateError(
          DeepAlignmentCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
          `receipt:${index}`,
          'Required transition receipts are out of lifecycle order',
        );
      }
      if (priorCount === 0) lastRank = rank;
      requiredCounts.set(facts.transitionKind, priorCount + 1);
    }
  }
  for (const requiredKind of DEEP_ALIGNMENT_REQUIRED_TRANSITION_ORDER) {
    const count = requiredCounts.get(requiredKind) ?? 0;
    if (count === 0) {
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.RECEIPT_MISSING,
        `receipt:${requiredKind}`,
        'Complete run evidence requires every lifecycle transition kind',
      );
    }
    if (REQUIRED_TRANSITION_CARDINALITY[requiredKind] === 'exactly-one' && count !== 1) {
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
        `receipt:${requiredKind}`,
        'Once-per-run lifecycle transitions cannot have multiple logical receipts',
      );
    }
  }
}

function assertTransitionCoverage(
  receipts: readonly DeepAlignmentTransitionReceipt[],
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
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.RECEIPT_MISSING,
        `receipt:event:${eventId}`,
        'Every authorized Deep Alignment state transition requires exactly one receipt',
      );
    }
  }
}

function certificateCertificationInput(
  body: DeepAlignmentRunCertificateBody,
  certificateDigest: string,
  lastReceipt: DeepAlignmentTransitionReceipt,
  issuer: string,
  issuedAt: string,
  certificationProfile: CertificationProfile,
): ReceiptCertificationInput {
  return {
    receiptId: `deep-alignment-certificate:${certificateDigest}`,
    boundaryId: `da-certificate:${certificateDigest}`,
    boundaryKind: 'mode-completion',
    scope: 'mode',
    scopeId: body.runId,
    fromState: 'active',
    toState: body.statusEvidence.state,
    fromHead: body.startHead,
    resultHead: body.finalHead,
    resultEventId: lastReceipt.facts.resultEventId,
    resultEventType: 'deep-alignment.run-certificate',
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
    idempotencyKey: `deep-alignment-certificate:v1:${certificateDigest}`,
    certificationProfile,
  };
}

/** Issue a dark-only run certificate after re-deriving every load-bearing fact. */
export async function issueDeepAlignmentRunCertificate<TState extends JsonObject>(
  input: DeepAlignmentCertificateIssuerInput<TState>,
): Promise<DeepAlignmentCertificateBundle> {
  if (!(input.replay.ledger instanceof AppendOnlyLedger)) {
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.LEDGER_INVALID,
      'replay:ledger',
      'Certificate issuance requires the shipped authorized-ledger reader',
    );
  }
  if (input.replay.runId !== input.runId) {
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.REPLAY_INVALID,
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
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.LEDGER_INVALID,
      'replay:range',
      'Certificate replay range contains no authorized events',
    );
  }
  assertProjectionMatchesVerifiedLedger(input.projectionEvents, coveredEvents);
  const folded = foldDeepAlignmentEvents(input.projectionEvents);
  if (folded.outcome !== 'projected') {
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.PROJECTION_INVALID,
      'projection:fold',
      'Reducer projection requires a rebuild and cannot be certified',
    );
  }
  if (
    folded.projection.run.runId !== input.runId
    || folded.projection.run.sessionId !== input.sessionId
    || folded.projection.run.generation !== input.generation
  ) {
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.PROJECTION_INVALID,
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
  assertArtifactEventsAuthorized(artifacts, input.transitionReceipts);
  assertReducerArtifactOwnership(artifacts, folded.projection);
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
  const receipts: DeepAlignmentTransitionReceipt[] = [];
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
  const body: DeepAlignmentRunCertificateBody = Object.freeze({
    certificateVersion: DEEP_ALIGNMENT_CERTIFICATE_VERSION,
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
    namedDigestClosureRules: DEEP_ALIGNMENT_NAMED_DIGEST_CLOSURE_RULES,
    orderedDependencyClosureDigest,
    receiptDigests: Object.freeze(receiptDigests),
    receiptChainDigest: digest(receiptDigests),
    replayFingerprint,
    replayFingerprintVersion: derivedReplay.descriptor.fingerprint_version,
    projectionIntegrityDigest: deepAlignmentProjectionIntegrityDigest(folded.projection),
    authorityEvidence: authorityEvidence(folded.projection),
    applicabilityEvidence: applicabilityEvidence(folded.projection),
    conformanceEvidence: conformanceEvidence(folded.projection),
    convergenceEvidence: convergenceEvidence(folded.projection),
    statusEvidence: statusEvidence(folded.projection),
    outputArtifactQualifiedDigests: outputArtifactQualifiedDigests(claims),
    openObligationIds: openObligationIds(folded.projection),
  });
  const certificateDigest = digest(body);
  const lastReceipt = receipts.at(-1) as DeepAlignmentTransitionReceipt;
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
  const certificate = parseDeepAlignmentRunCertificate({
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
  code: DeepAlignmentCertificateError['code'],
  location: string,
  failureReason: string,
  expected: unknown,
  actual: unknown,
): never {
  throw new DeepAlignmentCertificateError(
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
  code: DeepAlignmentCertificateError['code'],
  location: string,
  failureReason: string,
): void {
  if (canonicalJson(expected) !== canonicalJson(actual)) {
    mismatch(code, location, failureReason, expected, actual);
  }
}

async function verifyArtifacts(
  certificate: DeepAlignmentRunCertificate,
  store: DeepAlignmentOfflineVerificationInput<JsonObject>['artifactStore'],
): Promise<VerifiedArtifactSet> {
  const verifiedClaims: DeepAlignmentCertificateArtifactClaim[] = [];
  const evidenceByQualifiedDigest = new Map<string, ArtifactReferenceEvidence>();
  for (const [index, claim] of certificate.body.artifactClaims.entries()) {
    const verified = await readDeepAlignmentArtifact(store, claim.binding);
    const recomputed: DeepAlignmentCertificateArtifactClaim = Object.freeze({
      binding: verified.binding,
      descriptorDigest: verified.binding.reference.descriptor_digest,
      contentDigest: verified.descriptor.content_digest,
      canonicalizationVersion: verified.descriptor.canonicalization_version,
    });
    equalCanonical(
      recomputed,
      claim,
      DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
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
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
      'artifact:set',
      'Verified sealed-reference set contains duplicate identities',
    );
  }
  const recomputedSetDigest = digest(verifiedClaims);
  if (recomputedSetDigest !== certificate.body.artifactSetDigest) {
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
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
  bundle: DeepAlignmentCertificateBundle,
  replayFingerprint: string,
  coveredEvents: readonly VerifiedLedgerEvent[],
  ledgerEvents: readonly VerifiedLedgerEvent[],
  artifactEvidenceByQualifiedDigest: ReadonlyMap<string, ArtifactReferenceEvidence>,
  providers: CertificationProviderRegistry,
): Promise<void> {
  if (bundle.receipts.length !== bundle.certificate.body.receiptDigests.length) {
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.RECEIPT_MISSING,
      'receipt:count',
      'Certificate receipt index and supplied receipt bundle have different lengths',
    );
  }
  assertTransitionOutputArtifactUniqueness(bundle.receipts.map((receipt) => receipt.facts));
  assertTransitionOrder(bundle.receipts);
  assertTransitionCoverage(bundle.receipts, coveredEvents);
  const receiptInputs = bundle.receipts.map((receipt): DeepAlignmentTransitionReceiptInput => ({
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
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.REPLAY_INVALID,
        `receipt:${index}:replay`,
        'Transition receipt does not bind the recomputed run replay fingerprint',
        replayFingerprint,
        receipt.facts.replayFingerprint,
      );
    }
    const input: DeepAlignmentTransitionReceiptInput = {
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
      DeepAlignmentCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
      `receipt:${index}:facts`,
      'Transition receipt facts do not re-derive from authorized ledger evidence',
    );
    const recomputedReceiptDigest = digest(expectedFacts);
    if (
      receipt.receiptDigest !== recomputedReceiptDigest
      || bundle.certificate.body.receiptDigests[index] !== recomputedReceiptDigest
    ) {
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
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
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.RECEIPT_MISSING,
        `receipt:${index}:durable-event`,
        'Shared transition receipt must resolve exactly once in the authorized ledger',
      );
    }
    const durableReceiptEvent = receiptEvents[0] as VerifiedLedgerEvent;
    equalCanonical(
      durableReceiptEvent.event.effective.envelope.payload,
      receipt.sharedReceipt,
      DeepAlignmentCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
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
    throw new DeepAlignmentCertificateError(
      DeepAlignmentCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
      'receipt:chain',
      'Receipt-chain digest does not recompute in supplied order',
      recomputedChainDigest,
      bundle.certificate.body.receiptChainDigest,
    );
  }
}

function failureResult(error: unknown): DeepAlignmentOfflineVerificationFailure {
  let verdict: DeepAlignmentOfflineVerificationFailure['verdict'] = 'invalid';
  let code: DeepAlignmentOfflineVerificationFailure['code'] =
    DeepAlignmentCertificateFailureCodes.CERTIFICATE_INVALID;
  let evidenceLocation = 'certificate:unknown';
  let expectedDigest: string | null = null;
  let actualDigest: string | null = null;
  let failureReason = 'Offline verification failed without trusted evidence.';

  if (error instanceof DeepAlignmentCertificateError) {
    code = error.code;
    evidenceLocation = error.evidenceLocation;
    expectedDigest = error.expectedDigest;
    actualDigest = error.actualDigest;
    failureReason = error.message;
    if (error.code === DeepAlignmentCertificateFailureCodes.RECEIPT_MISSING
      || error.code === DeepAlignmentCertificateFailureCodes.EVIDENCE_INCOMPLETE) {
      verdict = 'incomplete';
    }
  } else if (error instanceof SealedArtifactError) {
    code = DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID;
    evidenceLocation = `artifact:${error.phase}`;
    failureReason = error.message;
    if (error.code === SealedArtifactErrorCodes.ARTIFACT_MISSING) verdict = 'unverifiable';
  } else if (error instanceof Error) {
    code = DeepAlignmentCertificateFailureCodes.CERTIFICATION_INVALID;
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
export async function verifyDeepAlignmentCertificateOffline<TState extends JsonObject>(
  input: DeepAlignmentOfflineVerificationInput<TState>,
): Promise<DeepAlignmentOfflineVerificationResult> {
  try {
    const bundle = parseDeepAlignmentCertificateBundle(input.bundle);
    const certificate = bundle.certificate;
    const recomputedCertificateDigest = digest(certificate.body);
    if (!(input.replay.ledger instanceof AppendOnlyLedger)) {
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.LEDGER_INVALID,
        'replay:ledger',
        'Offline verification requires the shipped authorized-ledger reader',
      );
    }
    if (input.replay.runId !== certificate.body.runId) {
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.REPLAY_INVALID,
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
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.LEDGER_INVALID,
        'replay:range',
        'Replay range contains no verified authorized events',
      );
    }
    assertProjectionMatchesVerifiedLedger(input.projectionEvents, coveredEvents);
    const folded = foldDeepAlignmentEvents(input.projectionEvents);
    if (folded.outcome !== 'projected') {
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.PROJECTION_INVALID,
        'projection:fold',
        'Projection evidence requires a rebuild',
      );
    }
    const recomputedProjectionDigest = deepAlignmentProjectionIntegrityDigest(folded.projection);
    if (recomputedProjectionDigest !== certificate.body.projectionIntegrityDigest) {
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.PROJECTION_INVALID,
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
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.PROJECTION_INVALID,
        'projection:identity',
        'Projection run identity differs from the certificate identity',
      );
    }
    equalCanonical(
      convergenceEvidence(folded.projection),
      certificate.body.convergenceEvidence,
      DeepAlignmentCertificateFailureCodes.CONVERGENCE_INVALID,
      'projection:convergence',
      'Convergence evidence does not re-derive from the reducer projection',
    );
    equalCanonical(
      authorityEvidence(folded.projection),
      certificate.body.authorityEvidence,
      DeepAlignmentCertificateFailureCodes.STATUS_INVALID,
      'projection:authority',
      'Authority evidence does not re-derive from the reducer projection',
    );
    equalCanonical(
      applicabilityEvidence(folded.projection),
      certificate.body.applicabilityEvidence,
      DeepAlignmentCertificateFailureCodes.PROJECTION_INVALID,
      'projection:applicability',
      'Applicability evidence does not re-derive from the reducer projection',
    );
    equalCanonical(
      conformanceEvidence(folded.projection),
      certificate.body.conformanceEvidence,
      DeepAlignmentCertificateFailureCodes.PROJECTION_INVALID,
      'projection:conformance',
      'Conformance evidence does not re-derive from the reducer projection',
    );
    equalCanonical(
      statusEvidence(folded.projection),
      certificate.body.statusEvidence,
      DeepAlignmentCertificateFailureCodes.STATUS_INVALID,
      'projection:status',
      'Status evidence does not re-derive from the reducer projection',
    );

    const verifiedArtifacts = await verifyArtifacts(
      certificate,
      input.artifactStore,
    );
    assertArtifactEventsAuthorized(verifiedArtifacts, bundle.receipts.map((receipt) => receipt.facts));
    assertReducerArtifactOwnership(verifiedArtifacts, folded.projection);
    equalCanonical(
      DEEP_ALIGNMENT_NAMED_DIGEST_CLOSURE_RULES,
      certificate.body.namedDigestClosureRules,
      DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
      'artifact:named-digest-closure-rules',
      'Certificate changes the frozen field-to-expected-kind closure map',
    );
    const orderedDependencyClosureDigest = verifyNamedDigestClosure(verifiedArtifacts);
    if (
      orderedDependencyClosureDigest
      !== certificate.body.orderedDependencyClosureDigest
    ) {
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
        'artifact:ordered-dependency-closure',
        'Ordered named-digest dependency closure does not recompute',
        orderedDependencyClosureDigest,
        certificate.body.orderedDependencyClosureDigest,
      );
    }
    equalCanonical(
      outputArtifactQualifiedDigests(verifiedArtifacts.claims),
      certificate.body.outputArtifactQualifiedDigests,
      DeepAlignmentCertificateFailureCodes.ARTIFACT_INVALID,
      'artifact:outputs',
      'Certificate outputs do not re-derive from verified sealed artifacts',
    );
    equalCanonical(
      openObligationIds(folded.projection),
      certificate.body.openObligationIds,
      DeepAlignmentCertificateFailureCodes.PROJECTION_INVALID,
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
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.REPLAY_INVALID,
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
      DeepAlignmentCertificateFailureCodes.LEDGER_INVALID,
      'ledger:start-head',
      'Certificate start head differs from the verified replay range',
    );
    equalCanonical(
      recomputedFinalHead,
      certificate.body.finalHead,
      DeepAlignmentCertificateFailureCodes.LEDGER_INVALID,
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
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.STATUS_INVALID,
        'certificate:lifecycle',
        'Certificate lifecycle result does not follow verified projection and receipt evidence',
      );
    }
    if (recomputedCertificateDigest !== certificate.certificateDigest) {
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.CERTIFICATE_INVALID,
        'certificate:digest',
        'Certificate body digest does not recompute',
        recomputedCertificateDigest,
        certificate.certificateDigest,
      );
    }
    const lastReceipt = bundle.receipts.at(-1);
    if (!lastReceipt) {
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.RECEIPT_MISSING,
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
      throw new DeepAlignmentCertificateError(
        DeepAlignmentCertificateFailureCodes.EVIDENCE_INCOMPLETE,
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
