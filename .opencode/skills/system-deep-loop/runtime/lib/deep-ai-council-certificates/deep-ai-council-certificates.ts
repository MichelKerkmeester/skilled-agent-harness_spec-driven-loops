// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Certificates and Receipts
// ───────────────────────────────────────────────────────────────────

import { AppendOnlyLedger } from '../authorized-ledger/index.js';
import {
  DeepAiCouncilWireEventTypes,
} from '../deep-ai-council-ledger-schema/index.js';
import {
  deepAiCouncilProjectionIntegrityDigest,
  foldDeepAiCouncilEvents,
} from '../deep-ai-council-reducers/index.js';
import {
  DEEP_AI_COUNCIL_ARTIFACT_KIND_REGISTRY,
  DeepAiCouncilArtifactKinds,
  readDeepAiCouncilArtifact,
} from '../deep-ai-council-sealed-artifacts/index.js';
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
  DeepAiCouncilCertificateError,
  DeepAiCouncilCertificateFailureCodes,
  DeepAiCouncilTransitionKinds,
} from './deep-ai-council-certificate-types.js';
import {
  parseDeepAiCouncilCertificateBundle,
  parseDeepAiCouncilRunCertificate,
  parseDeepAiCouncilTransitionReceipt,
} from './deep-ai-council-certificate-validation.js';

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type { DeepAiCouncilLedgerEvent } from '../deep-ai-council-ledger-schema/index.js';
import type {
  DeepAiCouncilProjectionState,
} from '../deep-ai-council-reducers/index.js';
import type {
  DeepAiCouncilArtifactKind,
  DeepAiCouncilArtifactLifecycle,
  DeepAiCouncilArtifactMaterial,
  DeepAiCouncilSealedArtifactBinding,
  DeepAiCouncilVerifiedSealedArtifact,
} from '../deep-ai-council-sealed-artifacts/index.js';
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
  DeepAiCouncilCertificateArtifactClaim,
  DeepAiCouncilCertificateBundle,
  DeepAiCouncilCertificateConvergenceEvidence,
  DeepAiCouncilCertificateIssuerInput,
  DeepAiCouncilCertificateLifecycleResult,
  DeepAiCouncilCertificateStatusEvidence,
  DeepAiCouncilCertificateTestGateEvidence,
  DeepAiCouncilOfflineVerificationFailure,
  DeepAiCouncilOfflineVerificationInput,
  DeepAiCouncilOfflineVerificationResult,
  DeepAiCouncilRunCertificate,
  DeepAiCouncilRunCertificateBody,
  DeepAiCouncilTransitionDisposition,
  DeepAiCouncilTransitionKind,
  DeepAiCouncilTransitionReceipt,
  DeepAiCouncilTransitionReceiptFacts,
  DeepAiCouncilTransitionReceiptInput,
  DeepAiCouncilTransitionReceiptSubstrate,
} from './deep-ai-council-certificate-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED TRANSITION PROFILE
// ───────────────────────────────────────────────────────────────────

export const DEEP_AI_COUNCIL_CERTIFICATE_VERSION = 1 as const;
export const DEEP_AI_COUNCIL_RECEIPT_VERSION = 1 as const;

export const DEEP_AI_COUNCIL_REQUIRED_TRANSITION_ORDER = Object.freeze([
  DeepAiCouncilTransitionKinds.INIT,
  DeepAiCouncilTransitionKinds.SEAT_SELECT_DISPATCH,
  DeepAiCouncilTransitionKinds.SEAT_RETURN,
  DeepAiCouncilTransitionKinds.CRITIQUE_ROUND,
  DeepAiCouncilTransitionKinds.CANDIDATE_BLIND_JUDGE,
  DeepAiCouncilTransitionKinds.SYNTHESIS,
  DeepAiCouncilTransitionKinds.CONVERGENCE,
  DeepAiCouncilTransitionKinds.ARTIFACT_COMMIT,
  DeepAiCouncilTransitionKinds.COUNCIL_TEST_GATE,
  DeepAiCouncilTransitionKinds.COMPLETE,
] as const);

const REQUIRED_TRANSITION_CARDINALITY: Readonly<Record<
  (typeof DEEP_AI_COUNCIL_REQUIRED_TRANSITION_ORDER)[number],
  'exactly-one' | 'at-least-one'
>> = Object.freeze({
  init: 'exactly-one',
  'seat-select-dispatch': 'at-least-one',
  'seat-return': 'at-least-one',
  'critique-round': 'at-least-one',
  'candidate-blind-judge': 'at-least-one',
  synthesis: 'exactly-one',
  convergence: 'exactly-one',
  'artifact-commit': 'exactly-one',
  'council-test-gate': 'exactly-one',
  complete: 'exactly-one',
});

const REQUIRED_TRANSITION_RANK = new Map<DeepAiCouncilTransitionKind, number>(
  DEEP_AI_COUNCIL_REQUIRED_TRANSITION_ORDER.map((kind, index) => [kind, index]),
);

const TRANSITION_BOUNDARIES: Readonly<Record<
  DeepAiCouncilTransitionKind,
  Readonly<{ kind: BoundaryKind; scope: BoundaryScope; fromState: string; toState: string }>
>> = Object.freeze({
  init: Object.freeze({ kind: 'mode-enter', scope: 'mode', fromState: 'planned', toState: 'admitted' }),
  'seat-select-dispatch': Object.freeze({ kind: 'phase-enter', scope: 'phase', fromState: 'deliberating', toState: 'deliberating' }),
  'seat-return': Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'deliberating', toState: 'deliberating' }),
  'critique-round': Object.freeze({ kind: 'phase-enter', scope: 'phase', fromState: 'critiquing', toState: 'critiquing' }),
  'candidate-blind-judge': Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'adjudicating', toState: 'adjudicating' }),
  synthesis: Object.freeze({ kind: 'phase-handoff', scope: 'phase', fromState: 'converging', toState: 'converging' }),
  convergence: Object.freeze({ kind: 'phase-pause', scope: 'phase', fromState: 'converging', toState: 'converging' }),
  'artifact-commit': Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'testing', toState: 'testing' }),
  'council-test-gate': Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'testing', toState: 'testing' }),
  complete: Object.freeze({ kind: 'mode-completion', scope: 'mode', fromState: 'testing', toState: 'complete' }),
  recovery: Object.freeze({ kind: 'mode-resume', scope: 'mode', fromState: 'paused', toState: 'deliberating' }),
});

const TRANSITION_EVENT_TYPES: Readonly<Record<
  DeepAiCouncilTransitionKind,
  ReadonlySet<string>
>> = Object.freeze({
  init: new Set([DeepAiCouncilWireEventTypes['ai_council.run_initialized']]),
  'seat-select-dispatch': new Set([
    DeepAiCouncilWireEventTypes['ai_council.seat_selected'],
    DeepAiCouncilWireEventTypes['ai_council.seat_dispatched'],
  ]),
  'seat-return': new Set([
    DeepAiCouncilWireEventTypes['ai_council.proposal_observed'],
    DeepAiCouncilWireEventTypes['ai_council.seat_returned'],
  ]),
  'critique-round': new Set([
    DeepAiCouncilWireEventTypes['ai_council.critique_round_started'],
    DeepAiCouncilWireEventTypes['ai_council.critique_recorded'],
  ]),
  'candidate-blind-judge': new Set([
    DeepAiCouncilWireEventTypes['ai_council.candidate_blinded'],
    DeepAiCouncilWireEventTypes['ai_council.pairwise_judgment_recorded'],
    DeepAiCouncilWireEventTypes['ai_council.bias_audit_recorded'],
    DeepAiCouncilWireEventTypes['ai_council.adjudication_decision'],
  ]),
  synthesis: new Set([DeepAiCouncilWireEventTypes['ai_council.deliberation_synthesized']]),
  convergence: new Set([
    DeepAiCouncilWireEventTypes['ai_council.convergence_evaluated'],
    DeepAiCouncilWireEventTypes['ai_council.convergence_blocked'],
  ]),
  'artifact-commit': new Set([DeepAiCouncilWireEventTypes['ai_council.artifact_committed']]),
  'council-test-gate': new Set([
    DeepAiCouncilWireEventTypes['ai_council.council_test_gate_evaluated'],
  ]),
  recovery: new Set([
    DeepAiCouncilWireEventTypes['ai_council.run_resumed'],
    DeepAiCouncilWireEventTypes['ai_council.run_restarted'],
  ]),
  complete: new Set([DeepAiCouncilWireEventTypes['ai_council.council_complete']]),
});

interface TransitionDispositionEvidence {
  readonly disposition: DeepAiCouncilTransitionDisposition;
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
  readonly receiptSubstrate: DeepAiCouncilTransitionReceiptSubstrate;
  readonly issuer: string;
  readonly issuedAt: string;
}

interface TransitionReceiptContext extends TransitionReceiptBaseContext {
  readonly artifactStore?: DeepAiCouncilCertificateIssuerInput<JsonObject>['artifactStore'];
  readonly artifactBindings?: readonly DeepAiCouncilSealedArtifactBinding[];
}

interface PreparedTransitionReceiptContext extends TransitionReceiptBaseContext {
  readonly artifactEvidenceByQualifiedDigest: ReadonlyMap<string, ArtifactReferenceEvidence>;
}

interface ArtifactReferenceEvidence {
  readonly kind: DeepAiCouncilArtifactKind;
  readonly material: DeepAiCouncilArtifactMaterial;
  readonly contentDigest: string;
  readonly qualifiedDigest: string;
}

interface VerifiedArtifactSet {
  readonly claims: readonly DeepAiCouncilCertificateArtifactClaim[];
  readonly evidenceByQualifiedDigest: ReadonlyMap<string, ArtifactReferenceEvidence>;
}

interface TransitionArtifactProfile {
  readonly inputLifecycles: ReadonlySet<DeepAiCouncilArtifactLifecycle>;
  readonly outputLifecycles: ReadonlySet<DeepAiCouncilArtifactLifecycle>;
}

interface TransitionOutputClaim {
  readonly transitionKind: DeepAiCouncilTransitionKind;
  readonly logicalOperationId: string;
  readonly outputArtifactQualifiedDigests: readonly string[];
}

const ALL_ARTIFACT_LIFECYCLES = new Set<DeepAiCouncilArtifactLifecycle>(
  DEEP_AI_COUNCIL_ARTIFACT_KIND_REGISTRY.map((entry) => entry.lifecycle),
);
const ARTIFACT_LIFECYCLE_BY_KIND = new Map<
  DeepAiCouncilArtifactKind,
  DeepAiCouncilArtifactLifecycle
>(DEEP_AI_COUNCIL_ARTIFACT_KIND_REGISTRY.map((entry) => [entry.artifactKind, entry.lifecycle]));

function artifactLifecycles(
  ...values: readonly DeepAiCouncilArtifactLifecycle[]
): ReadonlySet<DeepAiCouncilArtifactLifecycle> {
  return new Set(values);
}

const TRANSITION_ARTIFACT_PROFILES: Readonly<Record<
  DeepAiCouncilTransitionKind,
  TransitionArtifactProfile
>> = Object.freeze({
  init: Object.freeze({
    inputLifecycles: artifactLifecycles('init'),
    outputLifecycles: artifactLifecycles('init'),
  }),
  'seat-select-dispatch': Object.freeze({
    inputLifecycles: artifactLifecycles('init'),
    outputLifecycles: artifactLifecycles('init'),
  }),
  'seat-return': Object.freeze({
    inputLifecycles: artifactLifecycles('init', 'deliberate'),
    outputLifecycles: artifactLifecycles('deliberate'),
  }),
  'critique-round': Object.freeze({
    inputLifecycles: artifactLifecycles('init', 'deliberate', 'critique'),
    outputLifecycles: artifactLifecycles('critique'),
  }),
  'candidate-blind-judge': Object.freeze({
    inputLifecycles: artifactLifecycles('init', 'deliberate', 'critique', 'judge'),
    outputLifecycles: artifactLifecycles('judge'),
  }),
  synthesis: Object.freeze({
    inputLifecycles: artifactLifecycles(
      'init',
      'deliberate',
      'critique',
      'judge',
      'converge',
    ),
    outputLifecycles: artifactLifecycles('synthesize'),
  }),
  convergence: Object.freeze({
    inputLifecycles: artifactLifecycles(
      'init',
      'deliberate',
      'critique',
      'judge',
      'converge',
      'synthesize',
    ),
    outputLifecycles: artifactLifecycles('converge'),
  }),
  'artifact-commit': Object.freeze({
    inputLifecycles: ALL_ARTIFACT_LIFECYCLES,
    outputLifecycles: artifactLifecycles('artifact'),
  }),
  'council-test-gate': Object.freeze({
    inputLifecycles: ALL_ARTIFACT_LIFECYCLES,
    outputLifecycles: artifactLifecycles('test-gate'),
  }),
  complete: Object.freeze({
    inputLifecycles: ALL_ARTIFACT_LIFECYCLES,
    outputLifecycles: artifactLifecycles('artifact', 'synthesize', 'test-gate', 'converge'),
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

function eventStem(event: VerifiedLedgerEvent): string | null {
  const payload = recordValue(event.event.effective.envelope.payload);
  return typeof payload?.stem === 'string' ? payload.stem : null;
}

function artifactEvidence(
  verified: DeepAiCouncilVerifiedSealedArtifact,
): ArtifactReferenceEvidence {
  let decoded: unknown;
  try {
    decoded = JSON.parse(new TextDecoder().decode(Uint8Array.from(verified.bytes)));
  } catch {
    throw new DeepAiCouncilCertificateError(
      DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID,
      `artifact:${verified.binding.reference.qualified_digest}`,
      'Verified artifact bytes do not expose their canonical material identity',
    );
  }
  const capsule = recordValue(decoded);
  const material = recordValue(capsule?.material);
  if (capsule?.artifactKind !== verified.binding.artifactKind || !material) {
    throw new DeepAiCouncilCertificateError(
      DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID,
      `artifact:${verified.binding.reference.qualified_digest}`,
      'Verified artifact material identity disagrees with its sealed binding',
    );
  }
  return Object.freeze({
    kind: verified.binding.artifactKind,
    material: material as unknown as DeepAiCouncilArtifactMaterial,
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
  input: DeepAiCouncilTransitionReceiptInput,
): string {
  return `dac-transition:${digest({
    runId,
    transitionKind: input.transitionKind,
    logicalOperationId: input.logicalOperationId,
  })}`;
}

function eventData(event: VerifiedLedgerEvent): Readonly<Record<string, unknown>> {
  const payload = event.event.effective.envelope.payload;
  const data = payload.data;
  if (data === null || Array.isArray(data) || typeof data !== 'object') {
    throw new DeepAiCouncilCertificateError(
      DeepAiCouncilCertificateFailureCodes.LEDGER_INVALID,
      `event:${event.frame.sequence}`,
      'Transition result event is missing its closed data object',
    );
  }
  return data as Readonly<Record<string, unknown>>;
}

function sourceRangeMatchesEvent(
  material: Readonly<Record<string, unknown>>,
  event: VerifiedLedgerEvent,
): boolean {
  const sourceRange = recordValue(material.sourceEventRange);
  const stem = eventStem(event);
  const materialScope = recordValue(material.scope);
  const eventScope = recordValue(event.event.effective.envelope.payload.scope);
  return sourceRange !== null
    && sourceRange.lastEventId === event.event.effective.envelope.event_id
    && sourceRange.lastStem === stem
    && material.authorityEpoch === event.event.effective.envelope.authority_epoch
    && materialScope !== null
    && eventScope !== null
    && materialScope.runId === eventScope.runId
    && materialScope.roundId === eventScope.roundId;
}

function artifactCorrespondsToEvent(
  evidence: ArtifactReferenceEvidence,
  event: VerifiedLedgerEvent,
): boolean {
  const eventType = event.event.effective.envelope.event_type;
  const data = eventData(event);
  const material = evidence.material as unknown as Readonly<Record<string, unknown>>;
  const lifecycle = ARTIFACT_LIFECYCLE_BY_KIND.get(evidence.kind);

  if (!sourceRangeMatchesEvent(material, event)) return false;

  switch (eventType) {
    case DeepAiCouncilWireEventTypes['ai_council.run_initialized']: {
      if (lifecycle !== 'init') return false;
      switch (evidence.kind) {
        case DeepAiCouncilArtifactKinds.TARGET_SNAPSHOT:
          return material.materialDigest === data.targetDigest;
        case DeepAiCouncilArtifactKinds.COUNCIL_STRATEGY:
          return material.materialDigest === data.strategyDigest;
        case DeepAiCouncilArtifactKinds.CONVERGENCE_POLICY:
          return material.materialDigest === data.convergencePolicyDigest;
        case DeepAiCouncilArtifactKinds.PROTOCOL_POLICY:
          return material.materialDigest === data.configDigest;
        case DeepAiCouncilArtifactKinds.TEST_FIXTURE:
          return material.materialDigest === data.testGatePolicyDigest;
        default:
          return material.replayFingerprint === data.initialReplayFingerprint;
      }
    }
    case DeepAiCouncilWireEventTypes['ai_council.seat_selected']:
    case DeepAiCouncilWireEventTypes['ai_council.seat_dispatched']:
      return lifecycle === 'init'
        && (evidence.kind === DeepAiCouncilArtifactKinds.PROMPT_CAPABILITY
          || evidence.kind === DeepAiCouncilArtifactKinds.REASONING_METHOD
          || evidence.kind === DeepAiCouncilArtifactKinds.SEAT_ROSTER);
    case DeepAiCouncilWireEventTypes['ai_council.proposal_observed']:
    case DeepAiCouncilWireEventTypes['ai_council.seat_returned']:
      return lifecycle === 'deliberate'
        && material.materialDigest === data.artifactDigest;
    case DeepAiCouncilWireEventTypes['ai_council.critique_round_started']:
      return lifecycle === 'critique'
        || lifecycle === 'deliberate';
    case DeepAiCouncilWireEventTypes['ai_council.critique_recorded']:
      return lifecycle === 'critique'
        && material.materialDigest === data.critiqueArtifactDigest;
    case DeepAiCouncilWireEventTypes['ai_council.candidate_blinded']:
      return lifecycle === 'judge'
        && material.materialDigest === data.artifactDigest;
    case DeepAiCouncilWireEventTypes['ai_council.pairwise_judgment_recorded']:
    case DeepAiCouncilWireEventTypes['ai_council.bias_audit_recorded']:
      return lifecycle === 'judge'
        && material.materialDigest === data.inputDigest;
    case DeepAiCouncilWireEventTypes['ai_council.adjudication_decision']:
      return lifecycle === 'judge'
        || lifecycle === 'converge';
    case DeepAiCouncilWireEventTypes['ai_council.deliberation_synthesized']:
      return lifecycle === 'synthesize'
        && material.materialDigest === data.selectedPlanDigest;
    case DeepAiCouncilWireEventTypes['ai_council.convergence_evaluated']:
    case DeepAiCouncilWireEventTypes['ai_council.convergence_blocked']:
      return lifecycle === 'converge';
    case DeepAiCouncilWireEventTypes['ai_council.artifact_committed']:
      return lifecycle === 'artifact'
        && material.materialDigest === data.contentDigest;
    case DeepAiCouncilWireEventTypes['ai_council.council_test_gate_evaluated']:
      return lifecycle === 'test-gate'
        && material.materialDigest === data.testSuiteDigest;
    case DeepAiCouncilWireEventTypes['ai_council.council_complete']:
      return lifecycle === 'artifact'
        || lifecycle === 'synthesize'
        || lifecycle === 'test-gate'
        || lifecycle === 'converge';
    case DeepAiCouncilWireEventTypes['ai_council.run_resumed']:
    case DeepAiCouncilWireEventTypes['ai_council.run_restarted']:
      return typeof material.materialDigest === 'string'
        && material.materialDigest === data.priorTailDigest;
    default:
      return false;
  }
}

function assertProjectionMatchesVerifiedLedger(
  projectionEvents: readonly DeepAiCouncilLedgerEvent[],
  ledgerEvents: readonly VerifiedLedgerEvent[],
): void {
  const verifiedEnvelopes = ledgerEvents.map((event) => event.event.effective.envelope);
  if (canonicalJson(asJson(projectionEvents)) !== canonicalJson(asJson(verifiedEnvelopes))) {
    throw new DeepAiCouncilCertificateError(
      DeepAiCouncilCertificateFailureCodes.PROJECTION_INVALID,
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
    case DeepAiCouncilWireEventTypes['ai_council.proposal_observed']:
    case DeepAiCouncilWireEventTypes['ai_council.seat_returned']:
      switch (data.responseStatus) {
        case 'returned':
          return null;
        case 'partial':
          return { disposition: 'in_doubt', dispositionReason: 'Seat proposal returned only partial evidence.' };
        case 'timeout':
          return { disposition: 'in_doubt', dispositionReason: 'Seat proposal timed out before durable return.' };
        case 'failed':
          return { disposition: 'failed', dispositionReason: 'Seat proposal failed conclusively.' };
        default:
          throw new DeepAiCouncilCertificateError(
            DeepAiCouncilCertificateFailureCodes.LEDGER_INVALID,
            'transition:seat-return',
            'Proposal event carries an unregistered response status',
          );
      }
    case DeepAiCouncilWireEventTypes['ai_council.critique_recorded']:
      switch (data.challengeDisposition) {
        case 'accepted':
        case 'rejected':
          return null;
        case 'contested':
          return { disposition: 'in_doubt', dispositionReason: 'Critique challenge remains contested.' };
        case 'unresolved':
          return { disposition: 'incomplete', dispositionReason: 'Critique challenge remains unresolved.' };
        default:
          throw new DeepAiCouncilCertificateError(
            DeepAiCouncilCertificateFailureCodes.LEDGER_INVALID,
            'transition:critique-round',
            'Critique event carries an unregistered challenge disposition',
          );
      }
    case DeepAiCouncilWireEventTypes['ai_council.pairwise_judgment_recorded']:
      switch (data.judgmentStatus) {
        case 'consistent':
          return null;
        case 'inconsistent':
          return { disposition: 'in_doubt', dispositionReason: 'Pairwise judgment order evidence is inconsistent.' };
        case 'abstained':
          return { disposition: 'incomplete', dispositionReason: 'Pairwise judgment abstained from selection.' };
        default:
          throw new DeepAiCouncilCertificateError(
            DeepAiCouncilCertificateFailureCodes.LEDGER_INVALID,
            'transition:candidate-blind-judge',
            'Judgment event carries an unregistered judgment status',
          );
      }
    case DeepAiCouncilWireEventTypes['ai_council.bias_audit_recorded']:
      switch (data.detectorResult) {
        case 'passed':
          return null;
        case 'flagged':
          return { disposition: 'in_doubt', dispositionReason: 'Bias audit flagged the comparison.' };
        case 'inconclusive':
          return { disposition: 'in_doubt', dispositionReason: 'Bias audit remained inconclusive.' };
        default:
          throw new DeepAiCouncilCertificateError(
            DeepAiCouncilCertificateFailureCodes.LEDGER_INVALID,
            'transition:candidate-blind-judge',
            'Bias audit event carries an unregistered detector result',
          );
      }
    default:
      return null;
  }
}

function transitionDisposition(
  transitionKind: DeepAiCouncilTransitionKind,
  event: VerifiedLedgerEvent,
): TransitionDispositionEvidence {
  const eventType = event.event.effective.envelope.event_type;
  if (!TRANSITION_EVENT_TYPES[transitionKind].has(eventType)) {
    throw new DeepAiCouncilCertificateError(
      DeepAiCouncilCertificateFailureCodes.LEDGER_INVALID,
      `transition:${transitionKind}`,
      'Transition kind does not match the authorized result event type',
    );
  }
  const data = eventData(event);
  const qualityDisposition = resultQualityDisposition(eventType, data);
  if (qualityDisposition) return qualityDisposition;
  switch (transitionKind) {
    case 'init':
      return { disposition: 'succeeded', dispositionReason: 'Authorized council initialization is durable.' };
    case 'seat-select-dispatch':
      return { disposition: 'succeeded', dispositionReason: 'Authorized seat selection and dispatch is durable.' };
    case 'seat-return':
      return { disposition: 'succeeded', dispositionReason: 'Authorized seat proposal observation is durable.' };
    case 'critique-round':
      return { disposition: 'succeeded', dispositionReason: 'Authorized critique round evidence is durable.' };
    case 'candidate-blind-judge':
      if (eventType === DeepAiCouncilWireEventTypes['ai_council.adjudication_decision']) {
        return data.disposition === 'selected'
          ? { disposition: 'succeeded', dispositionReason: 'Authorized adjudication selected a candidate.' }
          : { disposition: 'incomplete', dispositionReason: 'Adjudication left candidate selection unresolved.' };
      }
      return { disposition: 'succeeded', dispositionReason: 'Authorized blinded judgment evidence is durable.' };
    case 'synthesis':
      return { disposition: 'succeeded', dispositionReason: 'Authorized deliberation synthesis is durable.' };
    case 'convergence': {
      switch (data.decision) {
        case 'blocked':
          return { disposition: 'blocked', dispositionReason: 'Convergence evaluation is blocked.' };
        case 'continue':
          return { disposition: 'incomplete', dispositionReason: 'Convergence requires another round.' };
        case 'converged':
          return { disposition: 'succeeded', dispositionReason: 'Convergence evidence supports completion.' };
        case 'incomplete':
          return { disposition: 'incomplete', dispositionReason: 'Convergence evidence is incomplete.' };
        case 'non-converged':
          return { disposition: 'blocked', dispositionReason: 'Convergence evaluation is non-converged.' };
        default:
          throw new DeepAiCouncilCertificateError(
            DeepAiCouncilCertificateFailureCodes.CONVERGENCE_INVALID,
            'transition:convergence',
            'Convergence event carries an unregistered decision',
          );
      }
    }
    case 'artifact-commit':
      return { disposition: 'succeeded', dispositionReason: 'Authorized council artifact publication is durable.' };
    case 'council-test-gate':
      switch (data.verdict) {
        case 'pass':
          return { disposition: 'succeeded', dispositionReason: 'Council test gate passed required checks.' };
        case 'fail':
          return { disposition: 'failed', dispositionReason: 'Council test gate failed required checks.' };
        case 'blocked':
          return { disposition: 'blocked', dispositionReason: 'Council test gate is blocked.' };
        default:
          throw new DeepAiCouncilCertificateError(
            DeepAiCouncilCertificateFailureCodes.TEST_GATE_INVALID,
            'transition:council-test-gate',
            'Council test gate event carries an unregistered verdict',
          );
      }
    case 'complete':
      return data.terminalStatus === 'completed'
        ? { disposition: 'succeeded', dispositionReason: 'Authorized council completion is durable.' }
        : data.terminalStatus === 'non-converged'
          ? { disposition: 'blocked', dispositionReason: 'Council completion is explicitly non-converged.' }
          : { disposition: 'incomplete', dispositionReason: 'Council completion is explicitly incomplete.' };
    case 'recovery': {
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
          throw new DeepAiCouncilCertificateError(
            DeepAiCouncilCertificateFailureCodes.LEDGER_INVALID,
            'transition:recovery',
            'Recovery event carries an unregistered compatibility decision',
          );
      }
    }
    default: {
      const exhaustiveKind: never = transitionKind;
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.UNSUPPORTED_VERSION,
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
    throw new DeepAiCouncilCertificateError(
      DeepAiCouncilCertificateFailureCodes.CERTIFICATION_INVALID,
      location,
      'Shared certification receipt does not bind the recomputed domain facts',
      digest(expected),
      digest(actualUnsigned),
    );
  }
  await verifyBoundaryReceiptCertification(actual, providers, true);
}

// ───────────────────────────────────────────────────────────────────
// 3. PLAIN-DIGEST DEPENDENCY CLOSURE
// ───────────────────────────────────────────────────────────────────

function verifyDependencyDigestsClosure(artifacts: VerifiedArtifactSet): string {
  const byContentDigest = new Map<string, ArtifactReferenceEvidence>();
  const claimIndex = new Map<string, number>();
  for (const [index, claim] of artifacts.claims.entries()) {
    const evidence = artifacts.evidenceByQualifiedDigest.get(
      claim.binding.reference.qualified_digest,
    );
    if (!evidence) {
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID,
        `artifact:${index}`,
        'Verified artifact evidence is absent from the run closure',
      );
    }
    if (byContentDigest.has(evidence.contentDigest)) {
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID,
        `artifact:${index}`,
        'A plain dependency digest has ambiguous ownership in the run closure',
      );
    }
    byContentDigest.set(evidence.contentDigest, evidence);
    claimIndex.set(evidence.qualifiedDigest, index);
  }

  const orderedClosure: Array<Readonly<{
    containingQualifiedDigest: string;
    position: number;
    referencedContentDigest: string;
    referencedQualifiedDigest: string;
  }>> = [];

  for (const evidence of artifacts.evidenceByQualifiedDigest.values()) {
    const material = evidence.material as unknown as Readonly<Record<string, unknown>>;
    const dependencyDigests = stringArray(material.dependencyDigests);
    for (const [position, plainDigest] of dependencyDigests.entries()) {
      const referenced = byContentDigest.get(plainDigest);
      if (!referenced) {
        throw new DeepAiCouncilCertificateError(
          DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID,
          `artifact:${evidence.qualifiedDigest}:dependencyDigests:${position}`,
          'Dependency digest does not resolve to actually sealed content in the run closure',
          null,
          plainDigest,
        );
      }
      const referencedMaterial = referenced.material as unknown as Readonly<Record<string, unknown>>;
      if (
        typeof material.authorityEpoch !== 'number'
        || referencedMaterial.authorityEpoch !== material.authorityEpoch
      ) {
        throw new DeepAiCouncilCertificateError(
          DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID,
          `artifact:${evidence.qualifiedDigest}:dependencyDigests:${position}`,
          'Dependency digest resolves across a stale authority epoch',
        );
      }
      const containerIndex = claimIndex.get(evidence.qualifiedDigest);
      const referencedIndex = claimIndex.get(referenced.qualifiedDigest);
      if (
        containerIndex === undefined
        || referencedIndex === undefined
        || referencedIndex >= containerIndex
      ) {
        throw new DeepAiCouncilCertificateError(
          DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID,
          `artifact:${evidence.qualifiedDigest}:dependencyDigests:${position}`,
          'Dependency digest is stale, reordered, or not predecessor-owned',
        );
      }
      orderedClosure.push(Object.freeze({
        containingQualifiedDigest: evidence.qualifiedDigest,
        position,
        referencedContentDigest: plainDigest,
        referencedQualifiedDigest: referenced.qualifiedDigest,
      }));
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
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.AUTHORIZATION_INVALID,
        `artifact:${evidence.qualifiedDigest}`,
        'Sealed artifact provenance must resolve to exactly one authorized ledger event',
      );
    }
  }
}

// ───────────────────────────────────────────────────────────────────
// 4. TRANSITION RECEIPTS
// ───────────────────────────────────────────────────────────────────

function requireArtifactReferences(
  input: DeepAiCouncilTransitionReceiptInput,
  artifactEvidenceByQualifiedDigest: ReadonlyMap<string, ArtifactReferenceEvidence>,
): void {
  const referencesByRole = [
    ['inputs', input.inputArtifactQualifiedDigests],
    ['outputs', input.outputArtifactQualifiedDigests],
  ] as const;
  const references = referencesByRole.flatMap(([, roleReferences]) => roleReferences);
  if (input.outputArtifactQualifiedDigests.length === 0) {
    throw new DeepAiCouncilCertificateError(
      DeepAiCouncilCertificateFailureCodes.EVIDENCE_INCOMPLETE,
      `transition:${input.transitionKind}:outputs`,
      'Every transition receipt requires at least one verified output artifact',
    );
  }
  if (new Set(references).size !== references.length) {
    throw new DeepAiCouncilCertificateError(
      DeepAiCouncilCertificateFailureCodes.CERTIFICATE_INVALID,
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
        throw new DeepAiCouncilCertificateError(
          DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID,
          `transition:${input.transitionKind}:${role}`,
          'Transition receipt references an artifact outside the verified run set',
        );
      }
      const lifecycle = ARTIFACT_LIFECYCLE_BY_KIND.get(evidence.kind);
      if (!lifecycle || !allowedLifecycles.has(lifecycle)) {
        throw new DeepAiCouncilCertificateError(
          DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID,
          `transition:${input.transitionKind}:${role}`,
          'Transition receipt references a verified artifact of the wrong kind',
        );
      }
    }
  }
}

function requireArtifactEventCorrespondence(
  input: DeepAiCouncilTransitionReceiptInput,
  resultEvent: VerifiedLedgerEvent,
  context: Omit<PreparedTransitionReceiptContext, 'receiptSubstrate'>,
): void {
  for (const reference of input.outputArtifactQualifiedDigests) {
    const evidence = context.artifactEvidenceByQualifiedDigest.get(reference);
    if (!evidence || !artifactCorrespondsToEvent(evidence, resultEvent)) {
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID,
        `transition:${input.transitionKind}:outputs`,
        'Transition output artifact identity does not correspond to its authorized result event',
      );
    }
  }

  for (const reference of input.inputArtifactQualifiedDigests) {
    const evidence = context.artifactEvidenceByQualifiedDigest.get(reference);
    if (!evidence || !context.ledgerEvents.some((event) => (
      artifactCorrespondsToEvent(evidence, event)
    ))) {
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID,
        `transition:${input.transitionKind}:inputs`,
        'Transition input artifact identity has no corresponding authorized provenance event',
      );
    }
  }

  if (input.transitionKind === 'convergence' || input.transitionKind === 'synthesis') {
    const inputDigests = input.inputArtifactQualifiedDigests.flatMap((reference) => {
      const evidence = context.artifactEvidenceByQualifiedDigest.get(reference);
      return evidence ? [evidence.contentDigest] : [];
    });
    const outputDependencies = input.outputArtifactQualifiedDigests.flatMap((reference) => {
      const evidence = context.artifactEvidenceByQualifiedDigest.get(reference);
      const material = evidence?.material as unknown as Readonly<Record<string, unknown>> | undefined;
      return stringArray(material?.dependencyDigests);
    });
    const inputDigestSet = new Set(inputDigests);
    const outputDependencySet = new Set(outputDependencies);
    if (
      inputDigestSet.size === 0
      || inputDigestSet.size !== outputDependencySet.size
      || ![...inputDigestSet].every((value) => outputDependencySet.has(value))
    ) {
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID,
        `transition:${input.transitionKind}:inputs`,
        'Transition result artifact does not bind every declared input dependency digest',
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
        throw new DeepAiCouncilCertificateError(
          DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID,
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
    throw new DeepAiCouncilCertificateError(
      DeepAiCouncilCertificateFailureCodes.LEDGER_INVALID,
      `event:${resultEventId}`,
      'Transition result event must resolve exactly once in the authorized ledger',
    );
  }
  return matches[0] as VerifiedLedgerEvent;
}

function buildTransitionFacts(
  input: DeepAiCouncilTransitionReceiptInput,
  context: Omit<PreparedTransitionReceiptContext, 'receiptSubstrate'>,
): DeepAiCouncilTransitionReceiptFacts {
  requireArtifactReferences(input, context.artifactEvidenceByQualifiedDigest);
  const event = findResultEvent(context.ledgerEvents, input.resultEventId);
  requireArtifactEventCorrespondence(input, event, context);
  const envelope = event.event.effective.envelope;
  const evidence = transitionDisposition(input.transitionKind, event);
  const heads = eventHeads(event);
  return Object.freeze({
    receiptVersion: DEEP_AI_COUNCIL_RECEIPT_VERSION,
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
  facts: DeepAiCouncilTransitionReceiptFacts,
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
  facts: DeepAiCouncilTransitionReceiptFacts,
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
  substrate: DeepAiCouncilTransitionReceiptSubstrate,
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
  facts: DeepAiCouncilTransitionReceiptFacts,
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
  store: DeepAiCouncilCertificateIssuerInput<JsonObject>['artifactStore'],
  bindings: readonly DeepAiCouncilSealedArtifactBinding[],
): Promise<VerifiedArtifactSet> {
  if (bindings.length === 0) {
    throw new DeepAiCouncilCertificateError(
      DeepAiCouncilCertificateFailureCodes.EVIDENCE_INCOMPLETE,
      'certificate:artifacts',
      'Run certificate requires a non-empty sealed-reference set',
    );
  }
  const claims: DeepAiCouncilCertificateArtifactClaim[] = [];
  const evidenceByQualifiedDigest = new Map<string, ArtifactReferenceEvidence>();
  for (const binding of bindings) {
    const verified = await readDeepAiCouncilArtifact(store, binding);
    const qualifiedDigest = verified.binding.reference.qualified_digest;
    if (evidenceByQualifiedDigest.has(qualifiedDigest)) {
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID,
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

async function issueTransitionReceiptWithEvidence(
  input: DeepAiCouncilTransitionReceiptInput,
  context: PreparedTransitionReceiptContext,
): Promise<DeepAiCouncilTransitionReceipt> {
  const facts = buildTransitionFacts(input, context);
  const receiptDigest = digest(facts);
  const event = findResultEvent(context.ledgerEvents, facts.resultEventId);
  const sharedReceipt = await issueSharedTransitionReceipt(
    facts,
    receiptDigest,
    event,
    context,
  );
  return parseDeepAiCouncilTransitionReceipt({ facts, receiptDigest, sharedReceipt });
}

/** Issue one transition receipt from a real authorized result event. */
export async function issueDeepAiCouncilTransitionReceipt(
  input: DeepAiCouncilTransitionReceiptInput,
  context: TransitionReceiptContext,
): Promise<DeepAiCouncilTransitionReceipt> {
  if (!context.artifactStore || !context.artifactBindings) {
    throw new DeepAiCouncilCertificateError(
      DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID,
      `transition:${input.transitionKind}:artifacts`,
      'Transition receipt issuance requires sealed-store artifact evidence',
    );
  }
  const artifacts = await verifiedArtifactSet(context.artifactStore, context.artifactBindings);
  return issueTransitionReceiptWithEvidence(input, {
    ...context,
    artifactEvidenceByQualifiedDigest: artifacts.evidenceByQualifiedDigest,
  });
}

// ───────────────────────────────────────────────────────────────────
// 5. RUN CERTIFICATE ISSUANCE
// ───────────────────────────────────────────────────────────────────

function convergenceEvidence(
  projection: DeepAiCouncilProjectionState,
): DeepAiCouncilCertificateConvergenceEvidence {
  const evaluation = projection.convergence.evaluations.at(-1);
  if (!evaluation) {
    throw new DeepAiCouncilCertificateError(
      DeepAiCouncilCertificateFailureCodes.CONVERGENCE_INVALID,
      'projection:convergence',
      'Run certificate requires one reducer-derived convergence evaluation',
    );
  }
  return Object.freeze({
    outcome: projection.convergence.outcome,
    eligible: projection.convergence.eligible,
    evaluationEventId: evaluation.producerEventId,
    decision: evaluation.decision,
    rawAgreement: evaluation.rawAgreement,
    calibratedSupport: evaluation.calibratedSupport,
    effectiveSeatCount: evaluation.effectiveSeatCount,
    blockerIds: Object.freeze([...projection.convergence.blockerIds]),
  });
}

function statusEvidence(
  projection: DeepAiCouncilProjectionState,
): DeepAiCouncilCertificateStatusEvidence {
  const status = projection.status.provenance.at(-1);
  if (!status) {
    throw new DeepAiCouncilCertificateError(
      DeepAiCouncilCertificateFailureCodes.STATUS_INVALID,
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

function testGateEvidence(
  projection: DeepAiCouncilProjectionState,
): DeepAiCouncilCertificateTestGateEvidence {
  const evaluation = projection.testGate.evaluations.at(-1);
  if (!evaluation) {
    throw new DeepAiCouncilCertificateError(
      DeepAiCouncilCertificateFailureCodes.TEST_GATE_INVALID,
      'projection:test-gate',
      'Run certificate requires reducer-derived council test gate evidence',
    );
  }
  return Object.freeze({
    verdict: projection.testGate.verdict,
    evaluationEventId: evaluation.producerEventId,
    testSuiteDigest: evaluation.testSuiteDigest,
    fixtureManifestDigest: evaluation.fixtureManifestDigest,
    artifactCompleteness: evaluation.artifactCompleteness,
    criticalFailureRefs: Object.freeze([...evaluation.criticalFailureRefs]),
  });
}

function lifecycleResult(
  projection: DeepAiCouncilProjectionState,
  receipts: readonly DeepAiCouncilTransitionReceipt[],
): DeepAiCouncilCertificateLifecycleResult {
  if (projection.status.state === 'blocked') return 'blocked';
  if (projection.status.state === 'failed') return 'failed';
  if (projection.status.state === 'non-converged') return 'blocked';
  const hasUntrustedReceipt = receipts.some((receipt) => (
    receipt.facts.resultDisposition !== 'succeeded'
    && receipt.facts.resultDisposition !== 'applied'
  ));
  if (
    projection.status.state === 'complete'
    && projection.status.terminal
    && projection.convergence.outcome === 'converged'
    && projection.convergence.eligible
    && projection.testGate.verdict === 'pass'
    && openObligationIds(projection).length === 0
    && !hasUntrustedReceipt
  ) {
    return 'trusted-completion';
  }
  return 'incomplete';
}

function outputArtifactQualifiedDigests(
  claims: readonly DeepAiCouncilCertificateArtifactClaim[],
): readonly string[] {
  const outputs = claims
    .filter((claim) => (
      claim.binding.artifactKind === DeepAiCouncilArtifactKinds.COUNCIL_ARTIFACT
      || claim.binding.artifactKind === DeepAiCouncilArtifactKinds.SYNTHESIS
      || claim.binding.artifactKind === DeepAiCouncilArtifactKinds.TEST_GATE_EVIDENCE
    ))
    .map((claim) => claim.binding.reference.qualified_digest);
  if (outputs.length === 0) {
    throw new DeepAiCouncilCertificateError(
      DeepAiCouncilCertificateFailureCodes.EVIDENCE_INCOMPLETE,
      'certificate:outputs',
      'Run certificate requires a sealed council artifact, synthesis, or gate output',
    );
  }
  return Object.freeze(outputs);
}

function openObligationIds(projection: DeepAiCouncilProjectionState): readonly string[] {
  return uniqueSorted([
    ...projection.convergence.blockerIds,
    ...projection.convergence.hardVetoRefs,
  ]);
}

function assertTransitionOrder(receipts: readonly DeepAiCouncilTransitionReceipt[]): void {
  const requiredCounts = new Map<DeepAiCouncilTransitionKind, number>();
  let lastRank = -1;
  const logicalOperations = new Map<string, DeepAiCouncilTransitionReceipt>();
  for (const [index, receipt] of receipts.entries()) {
    const facts = receipt.facts;
    const existing = logicalOperations.get(facts.logicalOperationId);
    if (existing && canonicalJson(existing) !== canonicalJson(receipt)) {
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
        `receipt:${index}`,
        'Logical operation identity is bound to conflicting receipt facts',
      );
    }
    if (existing) continue;
    logicalOperations.set(facts.logicalOperationId, receipt);
    const rank = REQUIRED_TRANSITION_RANK.get(facts.transitionKind);
    if (rank !== undefined) {
      if (rank < lastRank) {
        throw new DeepAiCouncilCertificateError(
          DeepAiCouncilCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
          `receipt:${index}`,
          'Required transition receipts are out of lifecycle order',
        );
      }
      lastRank = rank;
      requiredCounts.set(facts.transitionKind, (requiredCounts.get(facts.transitionKind) ?? 0) + 1);
    }
  }
  for (const requiredKind of DEEP_AI_COUNCIL_REQUIRED_TRANSITION_ORDER) {
    const count = requiredCounts.get(requiredKind) ?? 0;
    if (count === 0) {
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.RECEIPT_MISSING,
        `receipt:${requiredKind}`,
        'Complete run evidence requires every lifecycle transition kind',
      );
    }
    if (REQUIRED_TRANSITION_CARDINALITY[requiredKind] === 'exactly-one' && count !== 1) {
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
        `receipt:${requiredKind}`,
        'Once-per-run lifecycle transitions cannot have multiple logical receipts',
      );
    }
  }
}

function certificateCertificationInput(
  body: DeepAiCouncilRunCertificateBody,
  certificateDigest: string,
  lastReceipt: DeepAiCouncilTransitionReceipt,
  issuer: string,
  issuedAt: string,
  certificationProfile: CertificationProfile,
): ReceiptCertificationInput {
  return {
    receiptId: `deep-ai-council-certificate:${certificateDigest}`,
    boundaryId: `dac-certificate:${certificateDigest}`,
    boundaryKind: 'mode-completion',
    scope: 'mode',
    scopeId: body.runId,
    fromState: 'testing',
    toState: body.statusEvidence.state,
    fromHead: body.startHead,
    resultHead: body.finalHead,
    resultEventId: lastReceipt.facts.resultEventId,
    resultEventType: 'deep-ai-council.run-certificate',
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
    idempotencyKey: `deep-ai-council-certificate:v1:${certificateDigest}`,
    certificationProfile,
  };
}

/** Issue a dark-only run certificate after re-deriving every load-bearing fact. */
export async function issueDeepAiCouncilRunCertificate<TState extends JsonObject>(
  input: DeepAiCouncilCertificateIssuerInput<TState>,
): Promise<DeepAiCouncilCertificateBundle> {
  if (!(input.replay.ledger instanceof AppendOnlyLedger)) {
    throw new DeepAiCouncilCertificateError(
      DeepAiCouncilCertificateFailureCodes.LEDGER_INVALID,
      'replay:ledger',
      'Certificate issuance requires the shipped authorized-ledger reader',
    );
  }
  if (input.replay.runId !== input.runId) {
    throw new DeepAiCouncilCertificateError(
      DeepAiCouncilCertificateFailureCodes.REPLAY_INVALID,
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
    throw new DeepAiCouncilCertificateError(
      DeepAiCouncilCertificateFailureCodes.LEDGER_INVALID,
      'replay:range',
      'Certificate replay range contains no authorized events',
    );
  }
  assertProjectionMatchesVerifiedLedger(input.projectionEvents, coveredEvents);
  const folded = foldDeepAiCouncilEvents(input.projectionEvents);
  if (folded.outcome !== 'projected') {
    throw new DeepAiCouncilCertificateError(
      DeepAiCouncilCertificateFailureCodes.PROJECTION_INVALID,
      'projection:fold',
      'Reducer projection requires a rebuild and cannot be certified',
    );
  }
  if (
    folded.projection.run.runId !== input.runId
    || folded.projection.run.roundId !== input.roundId
    || folded.projection.run.generation !== input.generation
  ) {
    throw new DeepAiCouncilCertificateError(
      DeepAiCouncilCertificateFailureCodes.PROJECTION_INVALID,
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
  const orderedDependencyClosureDigest = verifyDependencyDigestsClosure(artifacts);
  const replayFingerprint = digest({
    substrateReplayFingerprint: derivedReplay.descriptor.final_digest,
    orderedDependencyClosureDigest,
  });
  assertTransitionOutputArtifactUniqueness(input.transitionReceipts);
  const receipts: DeepAiCouncilTransitionReceipt[] = [];
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

  const firstEvent = coveredEvents[0] as VerifiedLedgerEvent;
  const finalEvent = coveredEvents.at(-1) as VerifiedLedgerEvent;
  const receiptDigests = receipts.map((receipt) => receipt.receiptDigest);
  const body: DeepAiCouncilRunCertificateBody = Object.freeze({
    certificateVersion: DEEP_AI_COUNCIL_CERTIFICATE_VERSION,
    authority: 'dark-evidence-only',
    runId: input.runId,
    roundId: input.roundId,
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
    orderedDependencyClosureDigest,
    receiptDigests: Object.freeze(receiptDigests),
    receiptChainDigest: digest(receiptDigests),
    replayFingerprint,
    replayFingerprintVersion: derivedReplay.descriptor.fingerprint_version,
    projectionIntegrityDigest: deepAiCouncilProjectionIntegrityDigest(folded.projection),
    convergenceEvidence: convergenceEvidence(folded.projection),
    statusEvidence: statusEvidence(folded.projection),
    testGateEvidence: testGateEvidence(folded.projection),
    outputArtifactQualifiedDigests: outputArtifactQualifiedDigests(claims),
    openObligationIds: openObligationIds(folded.projection),
  });
  const certificateDigest = digest(body);
  const lastReceipt = receipts.at(-1) as DeepAiCouncilTransitionReceipt;
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
  const certificate = parseDeepAiCouncilRunCertificate({
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
// 6. OFFLINE VERIFICATION
// ───────────────────────────────────────────────────────────────────

function mismatch(
  code: DeepAiCouncilCertificateError['code'],
  location: string,
  failureReason: string,
  expected: unknown,
  actual: unknown,
): never {
  throw new DeepAiCouncilCertificateError(
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
  code: DeepAiCouncilCertificateError['code'],
  location: string,
  failureReason: string,
): void {
  if (canonicalJson(expected) !== canonicalJson(actual)) {
    mismatch(code, location, failureReason, expected, actual);
  }
}

async function verifyArtifacts(
  certificate: DeepAiCouncilRunCertificate,
  store: DeepAiCouncilOfflineVerificationInput<JsonObject>['artifactStore'],
): Promise<VerifiedArtifactSet> {
  const verifiedClaims: DeepAiCouncilCertificateArtifactClaim[] = [];
  const evidenceByQualifiedDigest = new Map<string, ArtifactReferenceEvidence>();
  for (const [index, claim] of certificate.body.artifactClaims.entries()) {
    const verified = await readDeepAiCouncilArtifact(store, claim.binding);
    const recomputed: DeepAiCouncilCertificateArtifactClaim = Object.freeze({
      binding: verified.binding,
      descriptorDigest: verified.binding.reference.descriptor_digest,
      contentDigest: verified.descriptor.content_digest,
      canonicalizationVersion: verified.descriptor.canonicalization_version,
    });
    equalCanonical(
      recomputed,
      claim,
      DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID,
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
    throw new DeepAiCouncilCertificateError(
      DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID,
      'artifact:set',
      'Verified sealed-reference set contains duplicate identities',
    );
  }
  const recomputedSetDigest = digest(verifiedClaims);
  if (recomputedSetDigest !== certificate.body.artifactSetDigest) {
    throw new DeepAiCouncilCertificateError(
      DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID,
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
  bundle: DeepAiCouncilCertificateBundle,
  replayFingerprint: string,
  coveredEvents: readonly VerifiedLedgerEvent[],
  ledgerEvents: readonly VerifiedLedgerEvent[],
  artifactEvidenceByQualifiedDigest: ReadonlyMap<string, ArtifactReferenceEvidence>,
  providers: CertificationProviderRegistry,
): Promise<void> {
  if (bundle.receipts.length !== bundle.certificate.body.receiptDigests.length) {
    throw new DeepAiCouncilCertificateError(
      DeepAiCouncilCertificateFailureCodes.RECEIPT_MISSING,
      'receipt:count',
      'Certificate receipt index and supplied receipt bundle have different lengths',
    );
  }
  assertTransitionOutputArtifactUniqueness(bundle.receipts.map((receipt) => receipt.facts));
  assertTransitionOrder(bundle.receipts);
  let priorReceiptDigest: string | null = null;
  for (const [index, receipt] of bundle.receipts.entries()) {
    if (receipt.facts.replayFingerprint !== replayFingerprint) {
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.REPLAY_INVALID,
        `receipt:${index}:replay`,
        'Transition receipt does not bind the recomputed run replay fingerprint',
        replayFingerprint,
        receipt.facts.replayFingerprint,
      );
    }
    const input: DeepAiCouncilTransitionReceiptInput = {
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
      certificationProfile: profileFromSharedReceipt(receipt.sharedReceipt),
      providers,
      issuer: receipt.sharedReceipt.issuer,
      issuedAt: receipt.sharedReceipt.issued_at,
    });
    equalCanonical(
      expectedFacts,
      receipt.facts,
      DeepAiCouncilCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
      `receipt:${index}:facts`,
      'Transition receipt facts do not re-derive from authorized ledger evidence',
    );
    const recomputedReceiptDigest = digest(expectedFacts);
    if (
      receipt.receiptDigest !== recomputedReceiptDigest
      || bundle.certificate.body.receiptDigests[index] !== recomputedReceiptDigest
    ) {
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
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
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.RECEIPT_MISSING,
        `receipt:${index}:durable-event`,
        'Shared transition receipt must resolve exactly once in the authorized ledger',
      );
    }
    const durableReceiptEvent = receiptEvents[0] as VerifiedLedgerEvent;
    equalCanonical(
      durableReceiptEvent.event.effective.envelope.payload,
      receipt.sharedReceipt,
      DeepAiCouncilCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
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
    throw new DeepAiCouncilCertificateError(
      DeepAiCouncilCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
      'receipt:chain',
      'Receipt-chain digest does not recompute in supplied order',
      recomputedChainDigest,
      bundle.certificate.body.receiptChainDigest,
    );
  }
}

function failureResult(error: unknown): DeepAiCouncilOfflineVerificationFailure {
  let verdict: DeepAiCouncilOfflineVerificationFailure['verdict'] = 'invalid';
  let code: DeepAiCouncilOfflineVerificationFailure['code'] =
    DeepAiCouncilCertificateFailureCodes.CERTIFICATE_INVALID;
  let evidenceLocation = 'certificate:unknown';
  let expectedDigest: string | null = null;
  let actualDigest: string | null = null;
  let failureReason = 'Offline verification failed without trusted evidence.';

  if (error instanceof DeepAiCouncilCertificateError) {
    code = error.code;
    evidenceLocation = error.evidenceLocation;
    expectedDigest = error.expectedDigest;
    actualDigest = error.actualDigest;
    failureReason = error.message;
    if (error.code === DeepAiCouncilCertificateFailureCodes.RECEIPT_MISSING
      || error.code === DeepAiCouncilCertificateFailureCodes.EVIDENCE_INCOMPLETE) {
      verdict = 'incomplete';
    }
  } else if (error instanceof SealedArtifactError) {
    code = DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID;
    evidenceLocation = `artifact:${error.phase}`;
    failureReason = error.message;
    if (error.code === SealedArtifactErrorCodes.ARTIFACT_MISSING) verdict = 'unverifiable';
  } else if (error instanceof Error) {
    code = DeepAiCouncilCertificateFailureCodes.CERTIFICATION_INVALID;
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
export async function verifyDeepAiCouncilCertificateOffline<TState extends JsonObject>(
  input: DeepAiCouncilOfflineVerificationInput<TState>,
): Promise<DeepAiCouncilOfflineVerificationResult> {
  try {
    const bundle = parseDeepAiCouncilCertificateBundle(input.bundle);
    const certificate = bundle.certificate;
    const recomputedCertificateDigest = digest(certificate.body);
    if (!(input.replay.ledger instanceof AppendOnlyLedger)) {
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.LEDGER_INVALID,
        'replay:ledger',
        'Offline verification requires the shipped authorized-ledger reader',
      );
    }
    if (input.replay.runId !== certificate.body.runId) {
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.REPLAY_INVALID,
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
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.LEDGER_INVALID,
        'replay:range',
        'Replay range contains no verified authorized events',
      );
    }
    assertProjectionMatchesVerifiedLedger(input.projectionEvents, coveredEvents);
    const folded = foldDeepAiCouncilEvents(input.projectionEvents);
    if (folded.outcome !== 'projected') {
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.PROJECTION_INVALID,
        'projection:fold',
        'Projection evidence requires a rebuild',
      );
    }
    const recomputedProjectionDigest = deepAiCouncilProjectionIntegrityDigest(folded.projection);
    if (recomputedProjectionDigest !== certificate.body.projectionIntegrityDigest) {
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.PROJECTION_INVALID,
        'projection:digest',
        'Projection integrity digest does not recompute from typed events',
        recomputedProjectionDigest,
        certificate.body.projectionIntegrityDigest,
      );
    }
    if (
      folded.projection.run.runId !== certificate.body.runId
      || folded.projection.run.roundId !== certificate.body.roundId
      || folded.projection.run.generation !== certificate.body.generation
    ) {
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.PROJECTION_INVALID,
        'projection:identity',
        'Projection run identity differs from the certificate identity',
      );
    }
    equalCanonical(
      convergenceEvidence(folded.projection),
      certificate.body.convergenceEvidence,
      DeepAiCouncilCertificateFailureCodes.CONVERGENCE_INVALID,
      'projection:convergence',
      'Convergence evidence does not re-derive from the reducer projection',
    );
    equalCanonical(
      statusEvidence(folded.projection),
      certificate.body.statusEvidence,
      DeepAiCouncilCertificateFailureCodes.STATUS_INVALID,
      'projection:status',
      'Status evidence does not re-derive from the reducer projection',
    );
    equalCanonical(
      testGateEvidence(folded.projection),
      certificate.body.testGateEvidence,
      DeepAiCouncilCertificateFailureCodes.TEST_GATE_INVALID,
      'projection:test-gate',
      'Test gate evidence does not re-derive from the reducer projection',
    );

    const verifiedArtifacts = await verifyArtifacts(
      certificate,
      input.artifactStore,
    );
    assertArtifactEventsAuthorized(verifiedArtifacts, coveredEvents);
    const orderedDependencyClosureDigest = verifyDependencyDigestsClosure(verifiedArtifacts);
    if (
      orderedDependencyClosureDigest
      !== certificate.body.orderedDependencyClosureDigest
    ) {
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID,
        'artifact:ordered-dependency-closure',
        'Ordered dependency closure does not recompute',
        orderedDependencyClosureDigest,
        certificate.body.orderedDependencyClosureDigest,
      );
    }
    equalCanonical(
      outputArtifactQualifiedDigests(verifiedArtifacts.claims),
      certificate.body.outputArtifactQualifiedDigests,
      DeepAiCouncilCertificateFailureCodes.ARTIFACT_INVALID,
      'artifact:outputs',
      'Certificate outputs do not re-derive from verified sealed artifacts',
    );
    equalCanonical(
      openObligationIds(folded.projection),
      certificate.body.openObligationIds,
      DeepAiCouncilCertificateFailureCodes.PROJECTION_INVALID,
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
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.REPLAY_INVALID,
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
      DeepAiCouncilCertificateFailureCodes.LEDGER_INVALID,
      'ledger:start-head',
      'Certificate start head differs from the verified replay range',
    );
    equalCanonical(
      recomputedFinalHead,
      certificate.body.finalHead,
      DeepAiCouncilCertificateFailureCodes.LEDGER_INVALID,
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
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.STATUS_INVALID,
        'certificate:lifecycle',
        'Certificate lifecycle result does not follow verified projection and receipt evidence',
      );
    }
    if (recomputedCertificateDigest !== certificate.certificateDigest) {
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.CERTIFICATE_INVALID,
        'certificate:digest',
        'Certificate body digest does not recompute',
        recomputedCertificateDigest,
        certificate.certificateDigest,
      );
    }
    const lastReceipt = bundle.receipts.at(-1);
    if (!lastReceipt) {
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.RECEIPT_MISSING,
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
      throw new DeepAiCouncilCertificateError(
        DeepAiCouncilCertificateFailureCodes.EVIDENCE_INCOMPLETE,
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
