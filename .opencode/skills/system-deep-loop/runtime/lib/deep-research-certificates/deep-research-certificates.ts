// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Certificates and Receipts
// ───────────────────────────────────────────────────────────────────

import { AppendOnlyLedger } from '../authorized-ledger/index.js';
import {
  DeepResearchWireEventTypes,
} from '../deep-research-ledger-schema/index.js';
import {
  deepResearchProjectionIntegrityDigest,
  foldDeepResearchEvents,
} from '../deep-research-reducers/index.js';
import {
  DEEP_RESEARCH_ARTIFACT_KIND_REGISTRY,
  DeepResearchArtifactKinds,
  readDeepResearchArtifact,
} from '../deep-research-sealed-artifacts/index.js';
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
  DeepResearchCertificateError,
  DeepResearchCertificateFailureCodes,
  DeepResearchTransitionKinds,
} from './deep-research-certificate-types.js';
import {
  parseDeepResearchCertificateBundle,
  parseDeepResearchRunCertificate,
  parseDeepResearchTransitionReceipt,
} from './deep-research-certificate-validation.js';

import type { VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type { DeepResearchLedgerEvent } from '../deep-research-ledger-schema/index.js';
import type {
  DeepResearchProjectionState,
} from '../deep-research-reducers/index.js';
import type {
  DeepResearchArtifactKind,
  DeepResearchArtifactLifecycle,
  DeepResearchArtifactMaterial,
  DeepResearchSealedArtifactBinding,
  DeepResearchVerifiedSealedArtifact,
} from '../deep-research-sealed-artifacts/index.js';
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
  DeepResearchCertificateArtifactClaim,
  DeepResearchCertificateBundle,
  DeepResearchCertificateConvergenceEvidence,
  DeepResearchCertificateIssuerInput,
  DeepResearchCertificateLifecycleResult,
  DeepResearchCertificateStatusEvidence,
  DeepResearchOfflineVerificationFailure,
  DeepResearchOfflineVerificationInput,
  DeepResearchOfflineVerificationResult,
  DeepResearchRunCertificate,
  DeepResearchRunCertificateBody,
  DeepResearchTransitionDisposition,
  DeepResearchTransitionKind,
  DeepResearchTransitionReceipt,
  DeepResearchTransitionReceiptFacts,
  DeepResearchTransitionReceiptInput,
  DeepResearchTransitionReceiptSubstrate,
} from './deep-research-certificate-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED TRANSITION PROFILE
// ───────────────────────────────────────────────────────────────────

export const DEEP_RESEARCH_CERTIFICATE_VERSION = 1 as const;
export const DEEP_RESEARCH_RECEIPT_VERSION = 1 as const;

export const DEEP_RESEARCH_REQUIRED_TRANSITION_ORDER = Object.freeze([
  DeepResearchTransitionKinds.INIT,
  DeepResearchTransitionKinds.GATHER,
  DeepResearchTransitionKinds.ANALYZE,
  DeepResearchTransitionKinds.CONVERGENCE,
  DeepResearchTransitionKinds.SYNTHESIS,
  DeepResearchTransitionKinds.MEMORY_SAVE,
] as const);

const REQUIRED_TRANSITION_CARDINALITY: Readonly<Record<
  (typeof DEEP_RESEARCH_REQUIRED_TRANSITION_ORDER)[number],
  'exactly-one' | 'at-least-one'
>> = Object.freeze({
  init: 'exactly-one',
  gather: 'at-least-one',
  analyze: 'at-least-one',
  convergence: 'exactly-one',
  synthesis: 'exactly-one',
  'memory-save': 'exactly-one',
});

const REQUIRED_TRANSITION_RANK = new Map<DeepResearchTransitionKind, number>(
  DEEP_RESEARCH_REQUIRED_TRANSITION_ORDER.map((kind, index) => [kind, index]),
);

const TRANSITION_BOUNDARIES: Readonly<Record<
  DeepResearchTransitionKind,
  Readonly<{ kind: BoundaryKind; scope: BoundaryScope; fromState: string; toState: string }>
>> = Object.freeze({
  init: Object.freeze({ kind: 'mode-enter', scope: 'mode', fromState: 'planned', toState: 'active' }),
  gather: Object.freeze({ kind: 'phase-enter', scope: 'phase', fromState: 'active', toState: 'active' }),
  analyze: Object.freeze({ kind: 'phase-completion', scope: 'phase', fromState: 'active', toState: 'active' }),
  convergence: Object.freeze({ kind: 'phase-pause', scope: 'phase', fromState: 'active', toState: 'evaluated' }),
  synthesis: Object.freeze({ kind: 'phase-handoff', scope: 'phase', fromState: 'evaluated', toState: 'synthesized' }),
  'memory-save': Object.freeze({ kind: 'mode-handoff', scope: 'mode', fromState: 'synthesized', toState: 'persisted' }),
  recovery: Object.freeze({ kind: 'mode-resume', scope: 'mode', fromState: 'paused', toState: 'active' }),
});

const TRANSITION_EVENT_TYPES: Readonly<Record<
  DeepResearchTransitionKind,
  ReadonlySet<string>
>> = Object.freeze({
  init: new Set([DeepResearchWireEventTypes['deep_research.run_initialized']]),
  gather: new Set([DeepResearchWireEventTypes['deep_research.source_captured']]),
  analyze: new Set([
    DeepResearchWireEventTypes['deep_research.evidence_admission_decided'],
    DeepResearchWireEventTypes['deep_research.claim_asserted'],
    DeepResearchWireEventTypes['deep_research.claim_relation_recorded'],
    DeepResearchWireEventTypes['deep_research.claim_superseded'],
  ]),
  convergence: new Set([
    DeepResearchWireEventTypes['deep_research.convergence_evaluated'],
    DeepResearchWireEventTypes['deep_research.convergence_blocked'],
  ]),
  synthesis: new Set([DeepResearchWireEventTypes['deep_research.synthesis_committed']]),
  'memory-save': new Set([
    DeepResearchWireEventTypes['deep_research.memory_save_completed'],
    DeepResearchWireEventTypes['deep_research.memory_save_failed'],
  ]),
  recovery: new Set([
    DeepResearchWireEventTypes['deep_research.run_resumed'],
    DeepResearchWireEventTypes['deep_research.run_restarted'],
  ]),
});

interface TransitionDispositionEvidence {
  readonly disposition: DeepResearchTransitionDisposition;
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
  readonly receiptSubstrate: DeepResearchTransitionReceiptSubstrate;
  readonly issuer: string;
  readonly issuedAt: string;
}

interface TransitionReceiptContext extends TransitionReceiptBaseContext {
  readonly artifactStore?: DeepResearchCertificateIssuerInput<JsonObject>['artifactStore'];
  readonly artifactBindings?: readonly DeepResearchSealedArtifactBinding[];
  readonly artifactKindsByQualifiedDigest?: ReadonlyMap<string, DeepResearchArtifactKind>;
}

interface PreparedTransitionReceiptContext extends TransitionReceiptBaseContext {
  readonly artifactEvidenceByQualifiedDigest: ReadonlyMap<string, ArtifactReferenceEvidence>;
  readonly memoryHandoffCorrespondenceByQualifiedDigest: ReadonlyMap<
    string,
    MemoryHandoffCorrespondence
  >;
}

interface ArtifactReferenceEvidence {
  readonly kind: DeepResearchArtifactKind;
  readonly material: DeepResearchArtifactMaterial;
  readonly contentDigest: string;
}

interface VerifiedArtifactSet {
  readonly claims: readonly DeepResearchCertificateArtifactClaim[];
  readonly evidenceByQualifiedDigest: ReadonlyMap<string, ArtifactReferenceEvidence>;
}

interface MemoryHandoffCorrespondence {
  readonly finalReferenceSetDigest: string;
  readonly offeredViewDigests: ReadonlySet<string>;
}

interface TransitionArtifactProfile {
  readonly inputLifecycles: ReadonlySet<DeepResearchArtifactLifecycle>;
  readonly outputLifecycles: ReadonlySet<DeepResearchArtifactLifecycle>;
}

interface TransitionOutputClaim {
  readonly transitionKind: DeepResearchTransitionKind;
  readonly logicalOperationId: string;
  readonly outputArtifactQualifiedDigests: readonly string[];
}

const ALL_ARTIFACT_LIFECYCLES = new Set<DeepResearchArtifactLifecycle>(
  DEEP_RESEARCH_ARTIFACT_KIND_REGISTRY.map((entry) => entry.lifecycle),
);
const ARTIFACT_LIFECYCLE_BY_KIND = new Map<
  DeepResearchArtifactKind,
  DeepResearchArtifactLifecycle
>(DEEP_RESEARCH_ARTIFACT_KIND_REGISTRY.map((entry) => [entry.artifactKind, entry.lifecycle]));

function artifactLifecycles(
  ...values: readonly DeepResearchArtifactLifecycle[]
): ReadonlySet<DeepResearchArtifactLifecycle> {
  return new Set(values);
}

const TRANSITION_ARTIFACT_PROFILES: Readonly<Record<
  DeepResearchTransitionKind,
  TransitionArtifactProfile
>> = Object.freeze({
  init: Object.freeze({
    inputLifecycles: artifactLifecycles('init'),
    outputLifecycles: artifactLifecycles('init'),
  }),
  gather: Object.freeze({
    inputLifecycles: artifactLifecycles('init', 'gather'),
    outputLifecycles: artifactLifecycles('gather'),
  }),
  analyze: Object.freeze({
    inputLifecycles: artifactLifecycles('init', 'gather', 'analyze'),
    outputLifecycles: artifactLifecycles('analyze'),
  }),
  convergence: Object.freeze({
    inputLifecycles: artifactLifecycles('init', 'gather', 'analyze', 'convergence'),
    outputLifecycles: artifactLifecycles('convergence'),
  }),
  synthesis: Object.freeze({
    inputLifecycles: artifactLifecycles(
      'init',
      'gather',
      'analyze',
      'convergence',
      'synthesize',
    ),
    outputLifecycles: artifactLifecycles('synthesize'),
  }),
  'memory-save': Object.freeze({
    inputLifecycles: ALL_ARTIFACT_LIFECYCLES,
    outputLifecycles: artifactLifecycles('memory-save'),
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
  verified: DeepResearchVerifiedSealedArtifact,
): ArtifactReferenceEvidence {
  let decoded: unknown;
  try {
    decoded = JSON.parse(new TextDecoder().decode(Uint8Array.from(verified.bytes)));
  } catch {
    throw new DeepResearchCertificateError(
      DeepResearchCertificateFailureCodes.ARTIFACT_INVALID,
      `artifact:${verified.binding.reference.qualified_digest}`,
      'Verified artifact bytes do not expose their canonical material identity',
    );
  }
  const capsule = recordValue(decoded);
  const material = recordValue(capsule?.material);
  if (capsule?.artifactKind !== verified.binding.artifactKind || !material) {
    throw new DeepResearchCertificateError(
      DeepResearchCertificateFailureCodes.ARTIFACT_INVALID,
      `artifact:${verified.binding.reference.qualified_digest}`,
      'Verified artifact material identity disagrees with its sealed binding',
    );
  }
  return Object.freeze({
    kind: verified.binding.artifactKind,
    material: material as unknown as DeepResearchArtifactMaterial,
    contentDigest: verified.descriptor.content_digest,
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
  input: DeepResearchTransitionReceiptInput,
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
    throw new DeepResearchCertificateError(
      DeepResearchCertificateFailureCodes.LEDGER_INVALID,
      `event:${event.frame.sequence}`,
      'Transition result event is missing its closed data object',
    );
  }
  return data as Readonly<Record<string, unknown>>;
}

function eventScope(event: VerifiedLedgerEvent): Readonly<Record<string, unknown>> {
  const scope = recordValue(event.event.effective.envelope.payload.scope);
  if (!scope) {
    throw new DeepResearchCertificateError(
      DeepResearchCertificateFailureCodes.LEDGER_INVALID,
      `event:${event.frame.sequence}`,
      'Transition result event is missing its closed scope object',
    );
  }
  return scope;
}

function primaryArtifactIdentity(evidence: ArtifactReferenceEvidence): string | null {
  const material = evidence.material as unknown as Readonly<Record<string, unknown>>;
  const lifecycle = ARTIFACT_LIFECYCLE_BY_KIND.get(evidence.kind);
  const field = lifecycle === 'init'
    ? 'materialDigest'
    : lifecycle === 'gather'
      ? 'responseDigest'
      : lifecycle === 'analyze'
        ? 'observationDigest'
        : lifecycle === 'convergence'
          ? 'snapshotDigest'
          : lifecycle === 'synthesize'
            ? 'outputDigest'
            : lifecycle === 'memory-save'
              ? 'continuityPayloadDigest'
              : null;
  const value = field === null ? null : material[field];
  return typeof value === 'string' ? value : null;
}

function memoryHandoffCorrespondences(
  transitions: readonly DeepResearchTransitionReceiptInput[],
  evidenceByQualifiedDigest: ReadonlyMap<string, ArtifactReferenceEvidence>,
): ReadonlyMap<string, MemoryHandoffCorrespondence> {
  const correspondences = new Map<string, MemoryHandoffCorrespondence>();
  for (const transition of transitions) {
    if (transition.transitionKind !== DeepResearchTransitionKinds.MEMORY_SAVE) continue;
    const offeredViewDigests = new Set<string>();
    for (const reference of transition.inputArtifactQualifiedDigests) {
      const evidence = evidenceByQualifiedDigest.get(reference);
      if (!evidence || ARTIFACT_LIFECYCLE_BY_KIND.get(evidence.kind) !== 'synthesize') continue;
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
        throw new DeepResearchCertificateError(
          DeepResearchCertificateFailureCodes.ARTIFACT_INVALID,
          'transition:memory-save:outputs',
          'One memory handoff artifact cannot represent conflicting final reference sets',
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
  memoryHandoffCorrespondence?: MemoryHandoffCorrespondence,
): boolean {
  const eventType = event.event.effective.envelope.event_type;
  const data = eventData(event);
  const scope = eventScope(event);
  const material = evidence.material as unknown as Readonly<Record<string, unknown>>;
  const lifecycle = ARTIFACT_LIFECYCLE_BY_KIND.get(evidence.kind);

  switch (eventType) {
    case DeepResearchWireEventTypes['deep_research.run_initialized']: {
      if (lifecycle !== 'init') return false;
      const expectedField = evidence.kind === DeepResearchArtifactKinds.OBJECTIVE
        ? 'charterDigest'
        : evidence.kind === DeepResearchArtifactKinds.MODE_CONFIGURATION
          ? 'configDigest'
          : evidence.kind === DeepResearchArtifactKinds.CAPABILITY_COMMITMENT
            ? 'executorFingerprint'
            : evidence.kind === DeepResearchArtifactKinds.POLICY_INPUT
              ? 'replayFingerprint'
              : null;
      if (expectedField === null) {
        return evidence.kind === DeepResearchArtifactKinds.PLAN_FRONTIER
          || evidence.kind === DeepResearchArtifactKinds.SEARCH_RECIPE;
      }
      return material.materialDigest === data[expectedField];
    }
    case DeepResearchWireEventTypes['deep_research.source_captured']:
      return lifecycle === 'gather'
        && material.sourceVersionId === scope.sourceVersionId
        && material.sourceIdentityDigest === data.sourceIdentityDigest
        && material.responseDigest === data.contentDigest;
    case DeepResearchWireEventTypes['deep_research.evidence_admission_decided']: {
      const passageDigests = Array.isArray(data.passageLocators)
        ? data.passageLocators.flatMap((locator) => {
            const value = recordValue(locator)?.passageDigest;
            return typeof value === 'string' ? [value] : [];
          })
        : [];
      const expectedStatus = data.disposition === 'admit'
        ? 'admitted'
        : data.disposition === 'degrade'
          ? 'degraded'
          : data.disposition === 'quarantine'
            ? 'quarantined'
            : null;
      return lifecycle === 'analyze'
        && material.observationId === scope.evidenceId
        && material.status === expectedStatus
        && passageDigests.every((value) => stringArray(material.evidenceDigests).includes(value));
    }
    case DeepResearchWireEventTypes['deep_research.claim_asserted']:
      return lifecycle === 'analyze'
        && material.observationId === data.claimId
        && material.observationDigest === data.normalizedClaimDigest
        && material.status === data.claimStatus;
    case DeepResearchWireEventTypes['deep_research.claim_relation_recorded']:
      return lifecycle === 'analyze'
        && material.observationId === data.claimId
        && material.status === data.claimStatus;
    case DeepResearchWireEventTypes['deep_research.claim_superseded']:
      return lifecycle === 'analyze'
        && material.observationId === data.successorClaimVersionId
        && material.status === 'resolved';
    case DeepResearchWireEventTypes['deep_research.convergence_evaluated']:
    case DeepResearchWireEventTypes['deep_research.convergence_blocked']:
      return lifecycle === 'convergence'
        && material.decision === data.decision
        && material.snapshotDigest === data.evidenceTailHash;
    case DeepResearchWireEventTypes['deep_research.synthesis_committed']:
      return lifecycle === 'synthesize'
        && material.outputId === data.reportRevision
        && material.outputDigest === data.reportDigest;
    case DeepResearchWireEventTypes['deep_research.memory_save_completed']:
    case DeepResearchWireEventTypes['deep_research.memory_save_failed']:
      return lifecycle === 'memory-save'
        && material.targetPacket === data.targetPacket
        && material.continuityPayloadDigest === data.continuityPayloadDigest
        && memoryHandoffCorrespondence !== undefined
        && material.finalReferenceSetDigest
          === memoryHandoffCorrespondence.finalReferenceSetDigest
        && typeof material.offeredViewDigest === 'string'
        && memoryHandoffCorrespondence.offeredViewDigests.has(material.offeredViewDigest);
    case DeepResearchWireEventTypes['deep_research.run_resumed']:
    case DeepResearchWireEventTypes['deep_research.run_restarted']:
      return primaryArtifactIdentity(evidence) === data.priorTailDigest;
    default:
      return false;
  }
}

function assertProjectionMatchesVerifiedLedger(
  projectionEvents: readonly DeepResearchLedgerEvent[],
  ledgerEvents: readonly VerifiedLedgerEvent[],
): void {
  const verifiedEnvelopes = ledgerEvents.map((event) => event.event.effective.envelope);
  if (canonicalJson(asJson(projectionEvents)) !== canonicalJson(asJson(verifiedEnvelopes))) {
    throw new DeepResearchCertificateError(
      DeepResearchCertificateFailureCodes.PROJECTION_INVALID,
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
    case DeepResearchWireEventTypes['deep_research.source_captured']:
      switch (data.instructionScanResult) {
        case 'clean':
          return null;
        case 'flagged':
          return { disposition: 'quarantined', dispositionReason: 'Source capture is quarantined by instruction scanning.' };
        case 'unknown':
          return { disposition: 'in_doubt', dispositionReason: 'Source capture instruction scanning is unresolved.' };
        default:
          throw new DeepResearchCertificateError(
            DeepResearchCertificateFailureCodes.LEDGER_INVALID,
            'transition:gather',
            'Gather event carries an unregistered instruction scan result',
          );
      }
    case DeepResearchWireEventTypes['deep_research.evidence_admission_decided']: {
      let admissionDisposition: TransitionDispositionEvidence | null;
      switch (data.disposition) {
        case 'admit':
          admissionDisposition = null;
          break;
        case 'degrade':
          admissionDisposition = {
            disposition: 'in_doubt',
            dispositionReason: 'Analysis evidence was admitted only in degraded form.',
          };
          break;
        case 'quarantine':
          admissionDisposition = {
            disposition: 'quarantined',
            dispositionReason: 'Analysis evidence is quarantined by its admission decision.',
          };
          break;
        default:
          throw new DeepResearchCertificateError(
            DeepResearchCertificateFailureCodes.LEDGER_INVALID,
            'transition:analyze',
            'Analysis event carries an unregistered evidence admission disposition',
          );
      }

      switch (data.contaminationStatus) {
        case 'clean':
          return admissionDisposition;
        case 'contaminated':
          return {
            disposition: 'quarantined',
            dispositionReason: 'Analysis evidence is quarantined because contamination is confirmed.',
          };
        case 'suspected':
          return admissionDisposition?.disposition === 'quarantined'
            ? admissionDisposition
            : {
                disposition: 'in_doubt',
                dispositionReason: 'Analysis evidence remains in doubt because contamination is suspected.',
              };
        case 'unknown':
          return admissionDisposition?.disposition === 'quarantined'
            ? admissionDisposition
            : {
                disposition: 'in_doubt',
                dispositionReason: 'Analysis evidence remains in doubt because contamination status is unknown.',
              };
        default:
          throw new DeepResearchCertificateError(
            DeepResearchCertificateFailureCodes.LEDGER_INVALID,
            'transition:analyze',
            'Analysis event carries an unregistered contamination status',
          );
      }
    }
    case DeepResearchWireEventTypes['deep_research.claim_asserted']:
    case DeepResearchWireEventTypes['deep_research.claim_relation_recorded']:
      switch (data.claimStatus) {
        case 'supported':
          return null;
        case 'contested':
          return { disposition: 'in_doubt', dispositionReason: 'Analysis claim remains contested.' };
        case 'unresolved':
          return { disposition: 'incomplete', dispositionReason: 'Analysis claim remains unresolved.' };
        default:
          throw new DeepResearchCertificateError(
            DeepResearchCertificateFailureCodes.LEDGER_INVALID,
            'transition:analyze',
            'Analysis event carries an unregistered claim status',
          );
      }
    default:
      return null;
  }
}

function transitionDisposition(
  transitionKind: DeepResearchTransitionKind,
  event: VerifiedLedgerEvent,
): TransitionDispositionEvidence {
  const eventType = event.event.effective.envelope.event_type;
  if (!TRANSITION_EVENT_TYPES[transitionKind].has(eventType)) {
    throw new DeepResearchCertificateError(
      DeepResearchCertificateFailureCodes.LEDGER_INVALID,
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
    case 'gather':
      return { disposition: 'succeeded', dispositionReason: 'Authorized source capture passed instruction scanning.' };
    case 'analyze':
      return { disposition: 'succeeded', dispositionReason: 'Authorized analysis evidence passed registered quality checks.' };
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
          throw new DeepResearchCertificateError(
            DeepResearchCertificateFailureCodes.CONVERGENCE_INVALID,
            'transition:convergence',
            'Convergence event carries an unregistered decision',
          );
      }
    }
    case 'synthesis':
      return { disposition: 'succeeded', dispositionReason: 'Authorized synthesis output is durable.' };
    case 'memory-save':
      if (eventType === DeepResearchWireEventTypes['deep_research.memory_save_completed']) {
        return { disposition: 'succeeded', dispositionReason: 'Memory handoff persistence is durable.' };
      }
      return data.retryable === true
        ? { disposition: 'in_doubt', dispositionReason: 'Memory handoff outcome requires reconciliation before retry.' }
        : { disposition: 'failed', dispositionReason: 'Memory handoff persistence failed conclusively.' };
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
          throw new DeepResearchCertificateError(
            DeepResearchCertificateFailureCodes.LEDGER_INVALID,
            'transition:recovery',
            'Recovery event carries an unregistered compatibility decision',
          );
      }
    }
    default: {
      const exhaustiveKind: never = transitionKind;
      throw new DeepResearchCertificateError(
        DeepResearchCertificateFailureCodes.UNSUPPORTED_VERSION,
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
    throw new DeepResearchCertificateError(
      DeepResearchCertificateFailureCodes.CERTIFICATION_INVALID,
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
  input: DeepResearchTransitionReceiptInput,
  artifactEvidenceByQualifiedDigest: ReadonlyMap<string, ArtifactReferenceEvidence>,
): void {
  const referencesByRole = [
    ['inputs', input.inputArtifactQualifiedDigests],
    ['outputs', input.outputArtifactQualifiedDigests],
  ] as const;
  const references = referencesByRole.flatMap(([, roleReferences]) => roleReferences);
  if (input.outputArtifactQualifiedDigests.length === 0) {
    throw new DeepResearchCertificateError(
      DeepResearchCertificateFailureCodes.EVIDENCE_INCOMPLETE,
      `transition:${input.transitionKind}:outputs`,
      'Every transition receipt requires at least one verified output artifact',
    );
  }
  if (new Set(references).size !== references.length) {
    throw new DeepResearchCertificateError(
      DeepResearchCertificateFailureCodes.CERTIFICATE_INVALID,
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
        throw new DeepResearchCertificateError(
          DeepResearchCertificateFailureCodes.ARTIFACT_INVALID,
          `transition:${input.transitionKind}:${role}`,
          'Transition receipt references an artifact outside the verified run set',
        );
      }
      const lifecycle = ARTIFACT_LIFECYCLE_BY_KIND.get(evidence.kind);
      if (!lifecycle || !allowedLifecycles.has(lifecycle)) {
        throw new DeepResearchCertificateError(
          DeepResearchCertificateFailureCodes.ARTIFACT_INVALID,
          `transition:${input.transitionKind}:${role}`,
          'Transition receipt references a verified artifact of the wrong kind',
        );
      }
    }
  }
}

function requireArtifactEventCorrespondence(
  input: DeepResearchTransitionReceiptInput,
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
      throw new DeepResearchCertificateError(
        DeepResearchCertificateFailureCodes.ARTIFACT_INVALID,
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
      throw new DeepResearchCertificateError(
        DeepResearchCertificateFailureCodes.ARTIFACT_INVALID,
        `transition:${input.transitionKind}:inputs`,
        'Transition input artifact identity has no corresponding authorized provenance event',
      );
    }
  }

  if (input.transitionKind === 'analyze' && inputEvidence.length > 0) {
    const sourceIdentities = new Set(inputEvidence.flatMap(({ evidence }) => {
      if (!evidence || ARTIFACT_LIFECYCLE_BY_KIND.get(evidence.kind) !== 'gather') return [];
      const material = evidence.material as unknown as Readonly<Record<string, unknown>>;
      return typeof material.responseDigest === 'string' ? [material.responseDigest] : [];
    }));
    const outputClaimsSource = input.outputArtifactQualifiedDigests.some((reference) => {
      const evidence = context.artifactEvidenceByQualifiedDigest.get(reference);
      const material = evidence?.material as unknown as Readonly<Record<string, unknown>> | undefined;
      return typeof material?.sourceArtifactDigest === 'string'
        && sourceIdentities.has(material.sourceArtifactDigest);
    });
    if (sourceIdentities.size > 0 && !outputClaimsSource) {
      throw new DeepResearchCertificateError(
        DeepResearchCertificateFailureCodes.ARTIFACT_INVALID,
        'transition:analyze:inputs',
        'Analysis inputs do not include the source provenance claimed by the result artifact',
      );
    }
  }

  if (input.transitionKind === 'convergence' || input.transitionKind === 'synthesis') {
    const inputIdentities = inputEvidence.flatMap(({ evidence }) => {
      const identity = evidence ? primaryArtifactIdentity(evidence) : null;
      return identity === null ? [] : [identity];
    });
    const outputProvenance = input.outputArtifactQualifiedDigests.flatMap((reference) => {
      const evidence = context.artifactEvidenceByQualifiedDigest.get(reference);
      const material = evidence?.material as unknown as Readonly<Record<string, unknown>> | undefined;
      return stringArray(material?.orderedInputDigests);
    });
    const inputIdentitySet = new Set(inputIdentities);
    const outputProvenanceSet = new Set(outputProvenance);
    if (
      inputIdentitySet.size !== outputProvenanceSet.size
      || ![...inputIdentitySet].every((identity) => outputProvenanceSet.has(identity))
    ) {
      throw new DeepResearchCertificateError(
        DeepResearchCertificateFailureCodes.ARTIFACT_INVALID,
        `transition:${input.transitionKind}:inputs`,
        'Transition result artifact does not bind every declared input identity',
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
        throw new DeepResearchCertificateError(
          DeepResearchCertificateFailureCodes.ARTIFACT_INVALID,
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
    throw new DeepResearchCertificateError(
      DeepResearchCertificateFailureCodes.LEDGER_INVALID,
      `event:${resultEventId}`,
      'Transition result event must resolve exactly once in the authorized ledger',
    );
  }
  return matches[0] as VerifiedLedgerEvent;
}

function buildTransitionFacts(
  input: DeepResearchTransitionReceiptInput,
  context: Omit<PreparedTransitionReceiptContext, 'receiptSubstrate'>,
): DeepResearchTransitionReceiptFacts {
  requireArtifactReferences(input, context.artifactEvidenceByQualifiedDigest);
  const event = findResultEvent(context.ledgerEvents, input.resultEventId);
  requireArtifactEventCorrespondence(input, event, context);
  const envelope = event.event.effective.envelope;
  const evidence = transitionDisposition(input.transitionKind, event);
  const heads = eventHeads(event);
  return Object.freeze({
    receiptVersion: DEEP_RESEARCH_RECEIPT_VERSION,
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
  facts: DeepResearchTransitionReceiptFacts,
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
  facts: DeepResearchTransitionReceiptFacts,
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
  substrate: DeepResearchTransitionReceiptSubstrate,
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
  facts: DeepResearchTransitionReceiptFacts,
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
  store: DeepResearchCertificateIssuerInput<JsonObject>['artifactStore'],
  bindings: readonly DeepResearchSealedArtifactBinding[],
): Promise<VerifiedArtifactSet> {
  if (bindings.length === 0) {
    throw new DeepResearchCertificateError(
      DeepResearchCertificateFailureCodes.EVIDENCE_INCOMPLETE,
      'certificate:artifacts',
      'Run certificate requires a non-empty sealed-reference set',
    );
  }
  const claims: DeepResearchCertificateArtifactClaim[] = [];
  const evidenceByQualifiedDigest = new Map<string, ArtifactReferenceEvidence>();
  for (const binding of bindings) {
    const verified = await readDeepResearchArtifact(store, binding);
    const qualifiedDigest = verified.binding.reference.qualified_digest;
    if (evidenceByQualifiedDigest.has(qualifiedDigest)) {
      throw new DeepResearchCertificateError(
        DeepResearchCertificateFailureCodes.ARTIFACT_INVALID,
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
  input: DeepResearchTransitionReceiptInput,
  context: PreparedTransitionReceiptContext,
): Promise<DeepResearchTransitionReceipt> {
  const facts = buildTransitionFacts(input, context);
  const receiptDigest = digest(facts);
  const event = findResultEvent(context.ledgerEvents, facts.resultEventId);
  const sharedReceipt = await issueSharedTransitionReceipt(
    facts,
    receiptDigest,
    event,
    context,
  );
  return parseDeepResearchTransitionReceipt({ facts, receiptDigest, sharedReceipt });
}

/** Issue one transition receipt from a real authorized result event. */
export async function issueDeepResearchTransitionReceipt(
  input: DeepResearchTransitionReceiptInput,
  context: TransitionReceiptContext,
): Promise<DeepResearchTransitionReceipt> {
  if (!context.artifactStore || !context.artifactBindings) {
    throw new DeepResearchCertificateError(
      DeepResearchCertificateFailureCodes.ARTIFACT_INVALID,
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
  projection: DeepResearchProjectionState,
): DeepResearchCertificateConvergenceEvidence {
  const evaluation = projection.convergence.evaluations.at(-1);
  if (!evaluation) {
    throw new DeepResearchCertificateError(
      DeepResearchCertificateFailureCodes.CONVERGENCE_INVALID,
      'projection:convergence',
      'Run certificate requires one reducer-derived convergence evaluation',
    );
  }
  return Object.freeze({
    eligibility: projection.convergence.eligibility,
    outcome: projection.convergence.outcome,
    evaluationEventId: evaluation.producerEventId,
    policyFingerprint: evaluation.policyFingerprint,
    evaluatorFingerprint: evaluation.evaluatorFingerprint,
    evidenceTailHash: evaluation.evidenceTailHash,
    blockerIds: Object.freeze([...projection.convergence.blockerIds]),
  });
}

function statusEvidence(
  projection: DeepResearchProjectionState,
): DeepResearchCertificateStatusEvidence {
  const status = projection.status.provenance.at(-1);
  if (!status) {
    throw new DeepResearchCertificateError(
      DeepResearchCertificateFailureCodes.STATUS_INVALID,
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
  projection: DeepResearchProjectionState,
  receipts: readonly DeepResearchTransitionReceipt[],
): DeepResearchCertificateLifecycleResult {
  if (projection.status.state === 'blocked') return 'blocked';
  if (projection.status.state === 'failed') return 'failed';
  if (projection.status.state === 'quarantined') return 'quarantined';
  const hasUntrustedReceipt = receipts.some((receipt) => (
    receipt.facts.resultDisposition !== 'succeeded'
    && receipt.facts.resultDisposition !== 'applied'
  ));
  if (
    projection.status.state === 'converged'
    && projection.status.terminal
    && projection.convergence.outcome === 'converged'
    && projection.convergence.eligibility === 'STOP_ELIGIBLE'
    && openObligationIds(projection).length === 0
    && !hasUntrustedReceipt
  ) {
    return 'trusted-completion';
  }
  return 'incomplete';
}

function outputArtifactQualifiedDigests(
  claims: readonly DeepResearchCertificateArtifactClaim[],
): readonly string[] {
  const outputs = claims
    .filter((claim) => (
      claim.binding.artifactKind === DeepResearchArtifactKinds.SYNTHESIS_REPORT
      || claim.binding.artifactKind === DeepResearchArtifactKinds.MEMORY_HANDOFF
    ))
    .map((claim) => claim.binding.reference.qualified_digest);
  if (outputs.length === 0) {
    throw new DeepResearchCertificateError(
      DeepResearchCertificateFailureCodes.EVIDENCE_INCOMPLETE,
      'certificate:outputs',
      'Run certificate requires a sealed synthesis or handoff output',
    );
  }
  return Object.freeze(outputs);
}

function openObligationIds(projection: DeepResearchProjectionState): readonly string[] {
  return uniqueSorted([
    ...projection.claimLedger.gapObligations.map((obligation) => obligation.obligationId),
    ...projection.convergence.blockerIds,
  ]);
}

function assertTransitionOrder(receipts: readonly DeepResearchTransitionReceipt[]): void {
  const requiredCounts = new Map<DeepResearchTransitionKind, number>();
  let lastRank = -1;
  const logicalOperations = new Map<string, DeepResearchTransitionReceipt>();
  for (const [index, receipt] of receipts.entries()) {
    const facts = receipt.facts;
    const existing = logicalOperations.get(facts.logicalOperationId);
    if (existing && canonicalJson(existing) !== canonicalJson(receipt)) {
      throw new DeepResearchCertificateError(
        DeepResearchCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
        `receipt:${index}`,
        'Logical operation identity is bound to conflicting receipt facts',
      );
    }
    if (existing) continue;
    logicalOperations.set(facts.logicalOperationId, receipt);
    const rank = REQUIRED_TRANSITION_RANK.get(facts.transitionKind);
    if (rank !== undefined) {
      if (rank < lastRank) {
        throw new DeepResearchCertificateError(
          DeepResearchCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
          `receipt:${index}`,
          'Required transition receipts are out of lifecycle order',
        );
      }
      lastRank = rank;
      requiredCounts.set(facts.transitionKind, (requiredCounts.get(facts.transitionKind) ?? 0) + 1);
    }
  }
  for (const requiredKind of DEEP_RESEARCH_REQUIRED_TRANSITION_ORDER) {
    const count = requiredCounts.get(requiredKind) ?? 0;
    if (count === 0) {
      throw new DeepResearchCertificateError(
        DeepResearchCertificateFailureCodes.RECEIPT_MISSING,
        `receipt:${requiredKind}`,
        'Complete run evidence requires every lifecycle transition kind',
      );
    }
    if (REQUIRED_TRANSITION_CARDINALITY[requiredKind] === 'exactly-one' && count !== 1) {
      throw new DeepResearchCertificateError(
        DeepResearchCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
        `receipt:${requiredKind}`,
        'Once-per-run lifecycle transitions cannot have multiple logical receipts',
      );
    }
  }
}

function certificateCertificationInput(
  body: DeepResearchRunCertificateBody,
  certificateDigest: string,
  lastReceipt: DeepResearchTransitionReceipt,
  issuer: string,
  issuedAt: string,
  certificationProfile: CertificationProfile,
): ReceiptCertificationInput {
  return {
    receiptId: `deep-research-certificate:${certificateDigest}`,
    boundaryId: `dr-certificate:${certificateDigest}`,
    boundaryKind: 'mode-completion',
    scope: 'mode',
    scopeId: body.runId,
    fromState: 'active',
    toState: body.statusEvidence.state,
    fromHead: body.startHead,
    resultHead: body.finalHead,
    resultEventId: lastReceipt.facts.resultEventId,
    resultEventType: 'deep-research.run-certificate',
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
    idempotencyKey: `deep-research-certificate:v1:${certificateDigest}`,
    certificationProfile,
  };
}

/** Issue a dark-only run certificate after re-deriving every load-bearing fact. */
export async function issueDeepResearchRunCertificate<TState extends JsonObject>(
  input: DeepResearchCertificateIssuerInput<TState>,
): Promise<DeepResearchCertificateBundle> {
  if (!(input.replay.ledger instanceof AppendOnlyLedger)) {
    throw new DeepResearchCertificateError(
      DeepResearchCertificateFailureCodes.LEDGER_INVALID,
      'replay:ledger',
      'Certificate issuance requires the shipped authorized-ledger reader',
    );
  }
  if (input.replay.runId !== input.runId) {
    throw new DeepResearchCertificateError(
      DeepResearchCertificateFailureCodes.REPLAY_INVALID,
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
    throw new DeepResearchCertificateError(
      DeepResearchCertificateFailureCodes.LEDGER_INVALID,
      'replay:range',
      'Certificate replay range contains no authorized events',
    );
  }
  assertProjectionMatchesVerifiedLedger(input.projectionEvents, coveredEvents);
  const folded = foldDeepResearchEvents(input.projectionEvents);
  if (folded.outcome !== 'projected') {
    throw new DeepResearchCertificateError(
      DeepResearchCertificateFailureCodes.PROJECTION_INVALID,
      'projection:fold',
      'Reducer projection requires a rebuild and cannot be certified',
    );
  }
  if (
    folded.projection.run.runId !== input.runId
    || folded.projection.run.lineageId !== input.lineageId
    || folded.projection.run.generation !== input.generation
  ) {
    throw new DeepResearchCertificateError(
      DeepResearchCertificateFailureCodes.PROJECTION_INVALID,
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
  const memoryHandoffCorrespondenceByQualifiedDigest = memoryHandoffCorrespondences(
    input.transitionReceipts,
    artifacts.evidenceByQualifiedDigest,
  );
  assertTransitionOutputArtifactUniqueness(input.transitionReceipts);
  const receipts: DeepResearchTransitionReceipt[] = [];
  const logicalOperationInputs = new Map<string, string>();
  let priorReceiptDigest: string | null = null;
  for (const transitionInput of input.transitionReceipts) {
    const canonicalInput = canonicalJson(asJson(transitionInput));
    const priorInput = logicalOperationInputs.get(transitionInput.logicalOperationId);
    if (priorInput === canonicalInput) continue;
    const receipt = await issueTransitionReceiptWithEvidence(transitionInput, {
      runId: input.runId,
      replayFingerprint: derivedReplay.descriptor.final_digest,
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

  const firstEvent = coveredEvents[0] as VerifiedLedgerEvent;
  const finalEvent = coveredEvents.at(-1) as VerifiedLedgerEvent;
  const receiptDigests = receipts.map((receipt) => receipt.receiptDigest);
  const body: DeepResearchRunCertificateBody = Object.freeze({
    certificateVersion: DEEP_RESEARCH_CERTIFICATE_VERSION,
    authority: 'dark-evidence-only',
    runId: input.runId,
    lineageId: input.lineageId,
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
    receiptDigests: Object.freeze(receiptDigests),
    receiptChainDigest: digest(receiptDigests),
    replayFingerprint: derivedReplay.descriptor.final_digest,
    replayFingerprintVersion: derivedReplay.descriptor.fingerprint_version,
    projectionIntegrityDigest: deepResearchProjectionIntegrityDigest(folded.projection),
    convergenceEvidence: convergenceEvidence(folded.projection),
    statusEvidence: statusEvidence(folded.projection),
    outputArtifactQualifiedDigests: outputArtifactQualifiedDigests(claims),
    openObligationIds: openObligationIds(folded.projection),
  });
  const certificateDigest = digest(body);
  const lastReceipt = receipts.at(-1) as DeepResearchTransitionReceipt;
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
  const certificate = parseDeepResearchRunCertificate({
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
  code: DeepResearchCertificateError['code'],
  location: string,
  failureReason: string,
  expected: unknown,
  actual: unknown,
): never {
  throw new DeepResearchCertificateError(
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
  code: DeepResearchCertificateError['code'],
  location: string,
  failureReason: string,
): void {
  if (canonicalJson(expected) !== canonicalJson(actual)) {
    mismatch(code, location, failureReason, expected, actual);
  }
}

async function verifyArtifacts(
  certificate: DeepResearchRunCertificate,
  store: DeepResearchOfflineVerificationInput<JsonObject>['artifactStore'],
): Promise<VerifiedArtifactSet> {
  const verifiedClaims: DeepResearchCertificateArtifactClaim[] = [];
  const evidenceByQualifiedDigest = new Map<string, ArtifactReferenceEvidence>();
  for (const [index, claim] of certificate.body.artifactClaims.entries()) {
    const verified = await readDeepResearchArtifact(store, claim.binding);
    const recomputed: DeepResearchCertificateArtifactClaim = Object.freeze({
      binding: verified.binding,
      descriptorDigest: verified.binding.reference.descriptor_digest,
      contentDigest: verified.descriptor.content_digest,
      canonicalizationVersion: verified.descriptor.canonicalization_version,
    });
    equalCanonical(
      recomputed,
      claim,
      DeepResearchCertificateFailureCodes.ARTIFACT_INVALID,
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
    throw new DeepResearchCertificateError(
      DeepResearchCertificateFailureCodes.ARTIFACT_INVALID,
      'artifact:set',
      'Verified sealed-reference set contains duplicate identities',
    );
  }
  const recomputedSetDigest = digest(verifiedClaims);
  if (recomputedSetDigest !== certificate.body.artifactSetDigest) {
    throw new DeepResearchCertificateError(
      DeepResearchCertificateFailureCodes.ARTIFACT_INVALID,
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
  bundle: DeepResearchCertificateBundle,
  replayFingerprint: string,
  coveredEvents: readonly VerifiedLedgerEvent[],
  ledgerEvents: readonly VerifiedLedgerEvent[],
  artifactEvidenceByQualifiedDigest: ReadonlyMap<string, ArtifactReferenceEvidence>,
  providers: CertificationProviderRegistry,
): Promise<void> {
  if (bundle.receipts.length !== bundle.certificate.body.receiptDigests.length) {
    throw new DeepResearchCertificateError(
      DeepResearchCertificateFailureCodes.RECEIPT_MISSING,
      'receipt:count',
      'Certificate receipt index and supplied receipt bundle have different lengths',
    );
  }
  assertTransitionOutputArtifactUniqueness(bundle.receipts.map((receipt) => receipt.facts));
  assertTransitionOrder(bundle.receipts);
  const receiptInputs = bundle.receipts.map((receipt): DeepResearchTransitionReceiptInput => ({
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
      throw new DeepResearchCertificateError(
        DeepResearchCertificateFailureCodes.REPLAY_INVALID,
        `receipt:${index}:replay`,
        'Transition receipt does not bind the recomputed run replay fingerprint',
        replayFingerprint,
        receipt.facts.replayFingerprint,
      );
    }
    const input: DeepResearchTransitionReceiptInput = {
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
      DeepResearchCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
      `receipt:${index}:facts`,
      'Transition receipt facts do not re-derive from authorized ledger evidence',
    );
    const recomputedReceiptDigest = digest(expectedFacts);
    if (
      receipt.receiptDigest !== recomputedReceiptDigest
      || bundle.certificate.body.receiptDigests[index] !== recomputedReceiptDigest
    ) {
      throw new DeepResearchCertificateError(
        DeepResearchCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
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
      throw new DeepResearchCertificateError(
        DeepResearchCertificateFailureCodes.RECEIPT_MISSING,
        `receipt:${index}:durable-event`,
        'Shared transition receipt must resolve exactly once in the authorized ledger',
      );
    }
    const durableReceiptEvent = receiptEvents[0] as VerifiedLedgerEvent;
    equalCanonical(
      durableReceiptEvent.event.effective.envelope.payload,
      receipt.sharedReceipt,
      DeepResearchCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
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
    throw new DeepResearchCertificateError(
      DeepResearchCertificateFailureCodes.RECEIPT_CHAIN_INVALID,
      'receipt:chain',
      'Receipt-chain digest does not recompute in supplied order',
      recomputedChainDigest,
      bundle.certificate.body.receiptChainDigest,
    );
  }
}

function failureResult(error: unknown): DeepResearchOfflineVerificationFailure {
  let verdict: DeepResearchOfflineVerificationFailure['verdict'] = 'invalid';
  let code: DeepResearchOfflineVerificationFailure['code'] =
    DeepResearchCertificateFailureCodes.CERTIFICATE_INVALID;
  let evidenceLocation = 'certificate:unknown';
  let expectedDigest: string | null = null;
  let actualDigest: string | null = null;
  let failureReason = 'Offline verification failed without trusted evidence.';

  if (error instanceof DeepResearchCertificateError) {
    code = error.code;
    evidenceLocation = error.evidenceLocation;
    expectedDigest = error.expectedDigest;
    actualDigest = error.actualDigest;
    failureReason = error.message;
    if (error.code === DeepResearchCertificateFailureCodes.RECEIPT_MISSING
      || error.code === DeepResearchCertificateFailureCodes.EVIDENCE_INCOMPLETE) {
      verdict = 'incomplete';
    }
  } else if (error instanceof SealedArtifactError) {
    code = DeepResearchCertificateFailureCodes.ARTIFACT_INVALID;
    evidenceLocation = `artifact:${error.phase}`;
    failureReason = error.message;
    if (error.code === SealedArtifactErrorCodes.ARTIFACT_MISSING) verdict = 'unverifiable';
  } else if (error instanceof Error) {
    code = DeepResearchCertificateFailureCodes.CERTIFICATION_INVALID;
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
export async function verifyDeepResearchCertificateOffline<TState extends JsonObject>(
  input: DeepResearchOfflineVerificationInput<TState>,
): Promise<DeepResearchOfflineVerificationResult> {
  try {
    const bundle = parseDeepResearchCertificateBundle(input.bundle);
    const certificate = bundle.certificate;
    const recomputedCertificateDigest = digest(certificate.body);
    if (!(input.replay.ledger instanceof AppendOnlyLedger)) {
      throw new DeepResearchCertificateError(
        DeepResearchCertificateFailureCodes.LEDGER_INVALID,
        'replay:ledger',
        'Offline verification requires the shipped authorized-ledger reader',
      );
    }
    if (input.replay.runId !== certificate.body.runId) {
      throw new DeepResearchCertificateError(
        DeepResearchCertificateFailureCodes.REPLAY_INVALID,
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
      throw new DeepResearchCertificateError(
        DeepResearchCertificateFailureCodes.LEDGER_INVALID,
        'replay:range',
        'Replay range contains no verified authorized events',
      );
    }
    assertProjectionMatchesVerifiedLedger(input.projectionEvents, coveredEvents);
    const folded = foldDeepResearchEvents(input.projectionEvents);
    if (folded.outcome !== 'projected') {
      throw new DeepResearchCertificateError(
        DeepResearchCertificateFailureCodes.PROJECTION_INVALID,
        'projection:fold',
        'Projection evidence requires a rebuild',
      );
    }
    const recomputedProjectionDigest = deepResearchProjectionIntegrityDigest(folded.projection);
    if (recomputedProjectionDigest !== certificate.body.projectionIntegrityDigest) {
      throw new DeepResearchCertificateError(
        DeepResearchCertificateFailureCodes.PROJECTION_INVALID,
        'projection:digest',
        'Projection integrity digest does not recompute from typed events',
        recomputedProjectionDigest,
        certificate.body.projectionIntegrityDigest,
      );
    }
    if (
      folded.projection.run.runId !== certificate.body.runId
      || folded.projection.run.lineageId !== certificate.body.lineageId
      || folded.projection.run.generation !== certificate.body.generation
    ) {
      throw new DeepResearchCertificateError(
        DeepResearchCertificateFailureCodes.PROJECTION_INVALID,
        'projection:identity',
        'Projection run identity differs from the certificate identity',
      );
    }
    equalCanonical(
      convergenceEvidence(folded.projection),
      certificate.body.convergenceEvidence,
      DeepResearchCertificateFailureCodes.CONVERGENCE_INVALID,
      'projection:convergence',
      'Convergence evidence does not re-derive from the reducer projection',
    );
    equalCanonical(
      statusEvidence(folded.projection),
      certificate.body.statusEvidence,
      DeepResearchCertificateFailureCodes.STATUS_INVALID,
      'projection:status',
      'Status evidence does not re-derive from the reducer projection',
    );

    const verifiedArtifacts = await verifyArtifacts(
      certificate,
      input.artifactStore,
    );
    equalCanonical(
      outputArtifactQualifiedDigests(verifiedArtifacts.claims),
      certificate.body.outputArtifactQualifiedDigests,
      DeepResearchCertificateFailureCodes.ARTIFACT_INVALID,
      'artifact:outputs',
      'Certificate outputs do not re-derive from verified sealed artifacts',
    );
    equalCanonical(
      openObligationIds(folded.projection),
      certificate.body.openObligationIds,
      DeepResearchCertificateFailureCodes.PROJECTION_INVALID,
      'projection:obligations',
      'Open obligations do not re-derive from the projection',
    );

    const replay = await deriveReplayFingerprint(input.replay);
    if (
      replay.descriptor.final_digest !== certificate.body.replayFingerprint
      || replay.descriptor.fingerprint_version !== certificate.body.replayFingerprintVersion
    ) {
      throw new DeepResearchCertificateError(
        DeepResearchCertificateFailureCodes.REPLAY_INVALID,
        'replay:fingerprint',
        'Replay fingerprint does not re-derive from the authorized ledger and registries',
        replay.descriptor.final_digest,
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
      DeepResearchCertificateFailureCodes.LEDGER_INVALID,
      'ledger:start-head',
      'Certificate start head differs from the verified replay range',
    );
    equalCanonical(
      recomputedFinalHead,
      certificate.body.finalHead,
      DeepResearchCertificateFailureCodes.LEDGER_INVALID,
      'ledger:final-head',
      'Certificate final head differs from the verified replay range',
    );

    await verifyReceipts(
      bundle,
      replay.descriptor.final_digest,
      coveredEvents,
      ledgerEvents,
      verifiedArtifacts.evidenceByQualifiedDigest,
      input.providers,
    );
    const recomputedLifecycleResult = lifecycleResult(folded.projection, bundle.receipts);
    if (recomputedLifecycleResult !== certificate.body.lifecycleResult) {
      throw new DeepResearchCertificateError(
        DeepResearchCertificateFailureCodes.STATUS_INVALID,
        'certificate:lifecycle',
        'Certificate lifecycle result does not follow verified projection and receipt evidence',
      );
    }
    if (recomputedCertificateDigest !== certificate.certificateDigest) {
      throw new DeepResearchCertificateError(
        DeepResearchCertificateFailureCodes.CERTIFICATE_INVALID,
        'certificate:digest',
        'Certificate body digest does not recompute',
        recomputedCertificateDigest,
        certificate.certificateDigest,
      );
    }
    const lastReceipt = bundle.receipts.at(-1);
    if (!lastReceipt) {
      throw new DeepResearchCertificateError(
        DeepResearchCertificateFailureCodes.RECEIPT_MISSING,
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
      throw new DeepResearchCertificateError(
        DeepResearchCertificateFailureCodes.EVIDENCE_INCOMPLETE,
        'certificate:lifecycle',
        'Certificate evidence is coherent but does not establish trusted completion',
      );
    }
    return Object.freeze({
      verdict: 'valid',
      certificateDigest: certificate.certificateDigest,
      replayFingerprint: replay.descriptor.final_digest,
      projectionIntegrityDigest: recomputedProjectionDigest,
      receiptChainDigest: certificate.body.receiptChainDigest,
      artifactSetDigest: certificate.body.artifactSetDigest,
    });
  } catch (error: unknown) {
    return failureResult(error);
  }
}
