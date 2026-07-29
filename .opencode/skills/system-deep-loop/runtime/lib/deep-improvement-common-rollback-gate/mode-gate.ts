// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Independent Mode Gate
// ───────────────────────────────────────────────────────────────────

import { readAuthorizationAudit } from '../authorized-ledger/index.js';
import {
  parseDeepImprovementCommonCertificateBundle,
  verifyDeepImprovementCommonCertificateOffline,
} from '../deep-improvement-common-certificates/index.js';
import {
  parseDeepImprovementCommonResumeDecision,
} from '../deep-improvement-common-resume-adapter/index.js';
import {
  DeepImprovementCommonArtifactKinds,
  readDeepImprovementCommonArtifact,
  readDeepImprovementPromotionEvidence,
} from '../deep-improvement-common-sealed-artifacts/index.js';
import {
  parseDeepImprovementCommonModeGateInput,
  parseDeepImprovementCommonParityReceipt,
} from '../deep-improvement-common-shadow-parity/index.js';
import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import { HealthAggregateStates } from '../health-degeneration-harness/index.js';
import { verifyClassificationManifest } from '../inflight-state-classification/index.js';
import { verifyPhase014RollbackEvidence } from '../rollback-drills/index.js';

import {
  DEEP_IMPROVEMENT_COMMON_ROLLBACK_GATE_SCHEMA_VERSION,
  DEEP_IMPROVEMENT_COMMON_ROLLBACK_MINIMUM_DAYS,
  DEEP_IMPROVEMENT_COMMON_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS,
} from './types.js';

import type {
  DeepImprovementCommonCertificateBundle,
  DeepImprovementCommonOfflineVerificationSuccess,
} from '../deep-improvement-common-certificates/index.js';
import type { DeepImprovementCommonResumeDecision } from '../deep-improvement-common-resume-adapter/index.js';
import type {
  DeepImprovementCommonArtifactKind,
  DeepImprovementCommonSealedArtifactBinding,
  DeepImprovementVerifiedSealedArtifact,
} from '../deep-improvement-common-sealed-artifacts/index.js';
import type { DeepImprovementCommonParityReceipt } from '../deep-improvement-common-shadow-parity/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type {
  DeepImprovementCommonGateDisposition,
  DeepImprovementCommonGateInputDisposition,
  DeepImprovementCommonGateInputKind,
  DeepImprovementCommonGateReasonCode,
  DeepImprovementCommonGateVerdict,
  DeepImprovementCommonLifecycleEvidenceKind,
  DeepImprovementCommonModeGateInput,
  DeepImprovementCommonModeGateResult,
  DeepImprovementCommonModeMigrationCertificate,
  DeepImprovementCommonRollbackWindowEvaluation,
  DeepImprovementCommonRollbackWindowInput,
} from './types.js';

interface LifecycleEvidenceIdentity {
  readonly eventDigest: string;
  readonly receiptDigest: string;
}

interface VerifiedCertificateEvidence {
  readonly disposition: DeepImprovementCommonGateInputDisposition;
  readonly result: DeepImprovementCommonOfflineVerificationSuccess | null;
  readonly bundle: DeepImprovementCommonCertificateBundle | null;
  readonly receiptDigests: readonly string[];
  readonly lifecycleEvidenceIdentities: readonly LifecycleEvidenceIdentity[];
}

interface VerifiedSealedEvidence {
  readonly disposition: DeepImprovementCommonGateInputDisposition;
  readonly artifactDigests: readonly string[];
  readonly lifecycleEvidenceIdentities: readonly LifecycleEvidenceIdentity[];
}

interface VerifiedParityEvidence {
  readonly disposition: DeepImprovementCommonGateInputDisposition;
  readonly receipts: readonly DeepImprovementCommonParityReceipt[];
  readonly lifecycleEvidenceIdentities: readonly LifecycleEvidenceIdentity[];
}

const HEX_40 = /^[a-f0-9]{40}$/u;
const HEX_64 = /^[a-f0-9]{64}$/u;
const TOKEN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/u;
const GATE_INPUT_KEYS = Object.freeze([
  'candidateSha',
  'baseSha',
  'sharedContractDigest',
  'writeSetDigest',
  'versions',
  'verifierIdentity',
  'verifierVersion',
  'authority',
  'parity',
  'sealedArtifacts',
  'certificates',
  'resumeEvidence',
  'lifecycle',
  'rollback',
  'rollbackWindow',
  'unresolvedRiskIds',
] as const);
const VERSION_BINDING_KEYS = Object.freeze([
  'eventEnvelopeVersion',
  'eventSchemaVersion',
  'reducerVersion',
  'projectionVersion',
] as const);
const WINDOW_KEYS = Object.freeze([
  'openedAt',
  'evaluatedAt',
  'executions',
  'unresolvedEvidenceCount',
  'lowTraffic',
] as const);
const WINDOW_EXECUTION_KEYS = Object.freeze([
  'executionId',
  'authorityState',
  'authorityEpoch',
  'result',
  'certificateDigest',
] as const);
const REQUIRED_LIFECYCLE: readonly DeepImprovementCommonLifecycleEvidenceKind[] = Object.freeze([
  'evaluator-epoch',
  'candidate-lineage',
  'raw-evaluation',
  'score-normalization',
  'canary-execution',
  'guarded-promotion',
  'abort',
  'restore',
  'replay',
  'resume',
  'duplicate-delivery',
  'unknown-effect',
  'incomplete-evidence',
]);
const INPUT_ORDER: readonly DeepImprovementCommonGateInputKind[] = Object.freeze([
  'shadow_parity',
  'sealed_artifacts',
  'certificates_receipts',
  'lifecycle_resume',
  'rollback_readiness',
]);
const REQUIRED_ARTIFACT_KINDS: readonly DeepImprovementCommonArtifactKind[] = Object.freeze([
  DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE,
  DeepImprovementCommonArtifactKinds.CANDIDATE_INPUT,
  DeepImprovementCommonArtifactKinds.BASELINE_INPUT,
  DeepImprovementCommonArtifactKinds.RAW_TRIAL_OUTPUT,
  DeepImprovementCommonArtifactKinds.CANARY_EPOCH,
  DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE,
]);

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function snapshotJson<T>(value: T): T {
  const sourceDigest = digest(value);
  const snapshot = structuredClone(value);
  if (digest(snapshot) !== sourceDigest) {
    throw new TypeError('Evidence changed while it was snapshotted');
  }
  return snapshot;
}

function isPlainRecord<T>(value: T): value is T & Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasExactKeys(value: object, keys: readonly string[]): boolean {
  const actual = Object.keys(value);
  const expected = new Set(keys);
  return actual.length === keys.length && actual.every((key) => expected.has(key));
}

function isToken(value: unknown): value is string {
  return typeof value === 'string' && TOKEN.test(value);
}

function isDigest(value: unknown): value is string {
  return typeof value === 'string' && HEX_64.test(value);
}

function sortCanonicalViews(values: readonly JsonObject[]): readonly JsonObject[] {
  return [...values].sort((left, right) => digest(left).localeCompare(digest(right)));
}

function resumeDecisionSemanticView(decision: DeepImprovementCommonResumeDecision): JsonObject {
  return {
    idempotencyKey: decision.idempotencyKey,
    requestDigest: decision.requestDigest,
    disposition: decision.disposition,
    compatibilityOutcome: decision.compatibilityOutcome,
    priorCertificateVerdict: decision.priorCertificateVerdict,
    offlineVerificationVerdict: decision.offlineVerificationVerdict,
    persistedFingerprint: decision.persistedFingerprint,
    currentFingerprint: decision.currentFingerprint,
    compatibility: sortCanonicalViews(decision.compatibility.map((entry) => ({
      component: entry.component,
      persistedVersion: entry.persistedVersion,
      persistedDigest: entry.persistedDigest,
      installedVersion: entry.installedVersion,
      installedDigest: entry.installedDigest,
      outcome: entry.outcome,
      revision: entry.revision,
    }))),
    branches: sortCanonicalViews(decision.branches.map((entry) => ({
      logicalOperationId: entry.logicalOperationId,
      operationKind: entry.operationKind,
      receiptIdentityDigest: entry.receiptIdentityDigest,
      disposition: entry.disposition,
      evidenceEventIds: [...entry.evidenceEventIds].sort(),
    }))),
    effects: sortCanonicalViews(decision.effects.map((entry) => ({
      effectId: entry.effectId,
      logicalEffectId: entry.logicalEffectId,
      applicationState: entry.applicationState,
      disposition: entry.disposition,
      intentEventId: entry.intentEventId,
      evidenceRefs: [...entry.evidenceRefs].sort(),
    }))),
    invalidation: {
      ...decision.invalidation,
      changedComponents: [...decision.invalidation.changedComponents].sort(),
      invalidatedOperationIds: [...decision.invalidation.invalidatedOperationIds].sort(),
      recoveryRequiredEffectIds: [...decision.invalidation.recoveryRequiredEffectIds].sort(),
    },
    lease: decision.lease,
  } as unknown as JsonObject;
}

function resumePathSemanticView(
  decision: DeepImprovementCommonResumeDecision,
  eventTailDigest: string,
  freshProjectionFingerprint: string,
): JsonObject {
  return {
    decision: resumeDecisionSemanticView(decision),
    eventTailDigest,
    freshProjectionFingerprint,
  };
}

function isReadyResumeDecision(decision: DeepImprovementCommonResumeDecision): boolean {
  return ['exact-reuse', 'compatible', 'migrate'].includes(decision.disposition)
    && ['exact', 'compatible', 'migrate'].includes(decision.compatibilityOutcome)
    && decision.offlineVerificationVerdict === 'valid'
    && decision.compatibility.every((entry) => (
      ['exact', 'compatible', 'migrate'].includes(entry.outcome)
    ))
    && decision.branches.every((entry) => (
      ['reuse', 'reexecute', 'compensate'].includes(entry.disposition)
    ))
    && decision.effects.every((entry) => (
      ['reuse', 'reexecute', 'compensate', 'reconcile'].includes(entry.disposition)
    ))
    && decision.invalidation.rebuildRequired === false;
}

function disposition(
  input: DeepImprovementCommonGateInputKind,
  value: DeepImprovementCommonGateDisposition,
  reasonCode: DeepImprovementCommonGateReasonCode | null,
  evidenceDigest: string | null,
): DeepImprovementCommonGateInputDisposition {
  return Object.freeze({ input, disposition: value, reasonCode, evidenceDigest });
}

function fail(
  input: DeepImprovementCommonGateInputKind,
  reasonCode: DeepImprovementCommonGateReasonCode,
  evidenceDigest: string | null = null,
): DeepImprovementCommonGateInputDisposition {
  const value = input === 'sealed_artifacts'
    ? 'not_ready'
    : input === 'rollback_readiness'
      ? 'rollback_required'
      : 'blocked';
  return disposition(input, value, reasonCode, evidenceDigest);
}

function overallVerdict(
  dispositions: readonly DeepImprovementCommonGateInputDisposition[],
): DeepImprovementCommonGateVerdict {
  if (dispositions.some((entry) => entry.disposition === 'rollback_required')) {
    return 'rollback_required';
  }
  if (dispositions.some((entry) => entry.disposition === 'blocked')) return 'blocked';
  if (dispositions.some((entry) => entry.disposition === 'not_ready')) return 'not_ready';
  return 'pass';
}

function malformedResult(): DeepImprovementCommonModeGateResult {
  const dispositions = Object.freeze(INPUT_ORDER.map((input) => fail(input, 'EVIDENCE_MALFORMED')));
  return Object.freeze({
    verdict: overallVerdict(dispositions),
    dispositions,
    certificate: null,
  });
}

function validateTopLevel<TState extends JsonObject>(
  input: DeepImprovementCommonModeGateInput<TState>,
): boolean {
  return isPlainRecord(input)
    && hasExactKeys(input, GATE_INPUT_KEYS)
    && HEX_40.test(input.candidateSha)
    && HEX_40.test(input.baseSha)
    && isDigest(input.sharedContractDigest)
    && isDigest(input.writeSetDigest)
    && isPlainRecord(input.versions)
    && hasExactKeys(input.versions, VERSION_BINDING_KEYS)
    && Number.isSafeInteger(input.versions.eventEnvelopeVersion)
    && input.versions.eventEnvelopeVersion > 0
    && isToken(input.versions.eventSchemaVersion)
    && isToken(input.versions.reducerVersion)
    && isToken(input.versions.projectionVersion)
    && isToken(input.verifierIdentity)
    && isToken(input.verifierVersion)
    && isPlainRecord(input.authority)
    && hasExactKeys(input.authority, ['state', 'epoch'])
    && input.authority.state === 'legacy_authoritative'
    && Number.isSafeInteger(input.authority.epoch)
    && input.authority.epoch > 0
    && Array.isArray(input.lifecycle)
    && Array.isArray(input.unresolvedRiskIds)
    && input.unresolvedRiskIds.every(isToken);
}

function snapshotModeGateInput<TState extends JsonObject>(
  input: DeepImprovementCommonModeGateInput<TState>,
): DeepImprovementCommonModeGateInput<TState> {
  const parityInput = input.parity;
  const sealedInput = input.sealedArtifacts;
  const certificateInput = input.certificates;
  const rollbackInput = input.rollback;
  const versionsInput = input.versions;
  const authorityInput = input.authority;
  const resumeInput = input.resumeEvidence;
  const lifecycleInput = input.lifecycle;
  const windowInput = input.rollbackWindow;
  const riskInput = input.unresolvedRiskIds;
  if (
    !isPlainRecord(versionsInput)
    || !hasExactKeys(versionsInput, VERSION_BINDING_KEYS)
    || !isPlainRecord(authorityInput)
    || !hasExactKeys(authorityInput, ['state', 'epoch'])
  ) {
    throw new TypeError('Gate bindings must use their closed shapes');
  }
  const parity = parityInput === null ? null : Object.freeze({
    manifest: snapshotJson(parityInput.manifest),
    modeGateInput: snapshotJson(parityInput.modeGateInput),
    receipts: Object.freeze(snapshotJson(parityInput.receipts)),
    authorizationAuditRootDirectory: parityInput.authorizationAuditRootDirectory,
    authorizationAuditLedgerId: parityInput.authorizationAuditLedgerId,
  });
  const sealedArtifacts = sealedInput === null ? null : Object.freeze({
    store: sealedInput.store,
    bindings: Object.freeze(snapshotJson(sealedInput.bindings)),
  });
  const certificates = certificateInput === null ? null : (() => {
    const verificationInput = certificateInput.verificationInput;
    const replayInput = verificationInput.replay;
    const replayExecutionInput = replayInput.replay;
    return Object.freeze({ verificationInput: Object.freeze({
      bundle: snapshotJson(verificationInput.bundle),
      projectionEvents: Object.freeze(snapshotJson(
        verificationInput.projectionEvents,
      )),
      artifactStore: verificationInput.artifactStore,
      replay: Object.freeze({
        ledger: replayInput.ledger,
        eventRegistry: replayInput.eventRegistry,
        versionRegistry: replayInput.versionRegistry,
        componentRegistry: replayInput.componentRegistry,
        runId: replayInput.runId,
        rangeStartSequence: replayInput.rangeStartSequence,
        rangeEndSequence: replayInput.rangeEndSequence,
        replay: Object.freeze({
          reducerId: replayExecutionInput.reducerId,
          reducerVersion: replayExecutionInput.reducerVersion,
          projectionSchemaVersion: replayExecutionInput.projectionSchemaVersion,
          initialState: Object.freeze(snapshotJson(replayExecutionInput.initialState)),
          replayInputDigests: Object.freeze(snapshotJson(
            replayExecutionInput.replayInputDigests,
          )),
        }),
      }),
      providers: verificationInput.providers,
      verificationTime: verificationInput.verificationTime,
    }) });
  })();
  const rollback = rollbackInput === null ? null : Object.freeze({
    phase014Evidence: Object.freeze({
      certificatePath: rollbackInput.phase014Evidence.certificatePath,
      expectedMode: rollbackInput.phase014Evidence.expectedMode,
      currentBindings: Object.freeze(snapshotJson(
        rollbackInput.phase014Evidence.currentBindings,
      )),
      certificationProvider: rollbackInput.phase014Evidence.certificationProvider,
    }),
    classificationManifest: Object.freeze(snapshotJson(rollbackInput.classificationManifest)),
    healthAggregate: Object.freeze(snapshotJson(rollbackInput.healthAggregate)),
    rollbackAnchorDigest: rollbackInput.rollbackAnchorDigest,
  });
  return Object.freeze({
    candidateSha: input.candidateSha,
    baseSha: input.baseSha,
    sharedContractDigest: input.sharedContractDigest,
    writeSetDigest: input.writeSetDigest,
    versions: Object.freeze({
      eventEnvelopeVersion: versionsInput.eventEnvelopeVersion,
      eventSchemaVersion: versionsInput.eventSchemaVersion,
      reducerVersion: versionsInput.reducerVersion,
      projectionVersion: versionsInput.projectionVersion,
    }),
    verifierIdentity: input.verifierIdentity,
    verifierVersion: input.verifierVersion,
    authority: Object.freeze({ state: authorityInput.state, epoch: authorityInput.epoch }),
    parity,
    sealedArtifacts,
    certificates,
    resumeEvidence: resumeInput === null
      ? null
      : Object.freeze(snapshotJson(resumeInput)),
    lifecycle: Object.freeze(snapshotJson(lifecycleInput)),
    rollback,
    rollbackWindow: Object.freeze(snapshotJson(windowInput)),
    unresolvedRiskIds: Object.freeze(snapshotJson(riskInput)),
  });
}

async function evaluateCertificates<TState extends JsonObject>(
  input: DeepImprovementCommonModeGateInput<TState>,
): Promise<VerifiedCertificateEvidence> {
  if (input.certificates == null) {
    return {
      disposition: fail('certificates_receipts', 'EVIDENCE_MISSING'),
      result: null,
      bundle: null,
      receiptDigests: [],
      lifecycleEvidenceIdentities: [],
    };
  }
  try {
    const result = await verifyDeepImprovementCommonCertificateOffline(
      input.certificates.verificationInput,
    );
    if (result.verdict !== 'valid') {
      return {
        disposition: fail('certificates_receipts', 'CERTIFICATE_RECEIPT_INVALID'),
        result: null,
        bundle: null,
        receiptDigests: [],
        lifecycleEvidenceIdentities: [],
      };
    }
    const bundle = parseDeepImprovementCommonCertificateBundle(
      input.certificates.verificationInput.bundle,
    );
    if (
      input.certificates.verificationInput.projectionEvents.some((entry) => (
        entry.envelope_version !== input.versions.eventEnvelopeVersion
      ))
      || bundle.receipts.some((entry) => entry.facts.authorityEpoch !== input.authority.epoch)
      || bundle.certificate.body.replayFingerprint !== result.replayFingerprint
      || bundle.certificate.body.projectionIntegrityDigest !== result.projectionIntegrityDigest
      || bundle.certificate.body.receiptChainDigest !== result.receiptChainDigest
      || bundle.certificate.body.artifactSetDigest !== result.artifactSetDigest
    ) {
      return {
        disposition: fail('certificates_receipts', 'EVIDENCE_STALE'),
        result: null,
        bundle: null,
        receiptDigests: [],
        lifecycleEvidenceIdentities: [],
      };
    }
    const receiptDigests = bundle.receipts.map((entry) => entry.receiptDigest).sort();
    return {
      disposition: disposition('certificates_receipts', 'ready', null, digest({
        certificateDigest: result.certificateDigest,
        replayFingerprint: result.replayFingerprint,
        projectionIntegrityDigest: result.projectionIntegrityDigest,
        receiptChainDigest: result.receiptChainDigest,
        artifactSetDigest: result.artifactSetDigest,
        receiptDigests,
      })),
      result,
      bundle,
      receiptDigests,
      lifecycleEvidenceIdentities: bundle.receipts.map((entry) => Object.freeze({
        eventDigest: entry.facts.resultEventDigest,
        receiptDigest: entry.receiptDigest,
      })),
    };
  } catch {
    return {
      disposition: fail('certificates_receipts', 'EVIDENCE_MALFORMED'),
      result: null,
      bundle: null,
      receiptDigests: [],
      lifecycleEvidenceIdentities: [],
    };
  }
}

async function evaluateParity<TState extends JsonObject>(
  input: DeepImprovementCommonModeGateInput<TState>,
  certificates: VerifiedCertificateEvidence,
): Promise<VerifiedParityEvidence> {
  if (input.parity == null) {
    return {
      disposition: fail('shadow_parity', 'EVIDENCE_MISSING'),
      receipts: [],
      lifecycleEvidenceIdentities: [],
    };
  }
  try {
    const reported = parseDeepImprovementCommonModeGateInput(input.parity.modeGateInput);
    const requiredFixtureIds = input.parity.manifest.cases
      .filter((entry) => entry.mode === 'deep-improvement-common')
      .map((entry) => entry.caseId)
      .sort();
    const receipts = input.parity.receipts.map((entry) => (
      parseDeepImprovementCommonParityReceipt(entry, input.parity!.manifest)
    ));
    const receiptFixtureIds = receipts.map((entry) => entry.fixtureId).sort();
    const receiptDigests = receipts.map((entry) => entry.receiptDigest).sort();
    const independentlyGreen = receipts.every((entry) => (
      entry.diffDispositions.length === 0
      && entry.legacyStreamDigest === entry.ledgerStreamDigest
      && entry.legacyProjectionFingerprint === entry.ledgerProjectionFingerprint
      && entry.parityCertificate !== null
      && entry.modeCertificateBinding !== null
      && entry.certificateStatus === 'issued'
    ));
    if (
      requiredFixtureIds.length === 0
      || digest(requiredFixtureIds) !== digest(receiptFixtureIds)
      || !independentlyGreen
    ) {
      return {
        disposition: fail('shadow_parity', 'PARITY_INVALID'),
        receipts,
        lifecycleEvidenceIdentities: [],
      };
    }
    if (
      reported.mode !== 'deep-improvement-common'
      || reported.baseSha !== input.baseSha
      || input.parity.manifest.baseSha !== input.baseSha
      || reported.manifestDigest !== input.parity.manifest.manifestDigest
      || digest(reported.fixtureIds) !== digest(requiredFixtureIds)
      || digest(reported.parityReceiptDigests) !== digest(receiptDigests)
      || receipts.some((entry) => (
        entry.eventSchemaVersion !== input.versions.eventSchemaVersion
        || entry.reducerVersion !== input.versions.reducerVersion
        || entry.projectionVersion !== input.versions.projectionVersion
      ))
    ) {
      return {
        disposition: fail('shadow_parity', 'EVIDENCE_STALE'),
        receipts,
        lifecycleEvidenceIdentities: [],
      };
    }
    if (certificates.result === null || certificates.bundle === null) {
      return {
        disposition: fail('shadow_parity', 'CERTIFICATE_RECEIPT_INVALID'),
        receipts,
        lifecycleEvidenceIdentities: [],
      };
    }
    const certificateBindingsMatch = receipts.every((receipt) => {
      const binding = receipt.modeCertificateBinding;
      return binding !== null
        && binding.certificateDigest === certificates.result!.certificateDigest
        && binding.verificationReceipt.verificationDigest
          === certificates.result!.verificationReceipt.verificationDigest
        && digest(binding.bundle) === digest(certificates.bundle);
    });
    if (!certificateBindingsMatch) {
      return {
        disposition: fail('shadow_parity', 'CERTIFICATE_RECEIPT_INVALID'),
        receipts,
        lifecycleEvidenceIdentities: [],
      };
    }

    let audit;
    try {
      audit = await readAuthorizationAudit(
        input.parity.authorizationAuditRootDirectory,
        input.parity.authorizationAuditLedgerId,
      );
    } catch {
      return {
        disposition: fail('shadow_parity', 'AUTHORIZED_PARITY_EVIDENCE_MISSING'),
        receipts,
        lifecycleEvidenceIdentities: [],
      };
    }
    const allowed = audit.entries.filter((entry) => (
      entry.decision.decision === 'allow'
      && entry.decision.mode === 'deep-improvement-common'
      && entry.decision.authority_state === 'legacy_authoritative'
    ));
    const everyReceiptAuthorized = receipts.every((receipt) => {
      const attestations = receipt.certificateEvidenceBindings.flatMap(
        (binding) => binding.attestationFinalDigests,
      );
      return attestations.length > 0
        && attestations.every((attestation) => allowed.some((entry) => (
          entry.decision.requested_event_digest === receipt.ledgerStreamDigest
          && entry.decision.evidence_digest === attestation
        )));
    });
    if (!everyReceiptAuthorized) {
      return {
        disposition: fail('shadow_parity', 'AUTHORIZED_PARITY_EVIDENCE_MISSING'),
        receipts,
        lifecycleEvidenceIdentities: [],
      };
    }
    return {
      disposition: disposition('shadow_parity', 'ready', null, digest({
        auditHead: audit.head,
        receiptDigests,
        reportedGateInputDigest: reported.gateInputDigest,
        independentlyVerifiedCertificateDigest: certificates.result.certificateDigest,
      })),
      receipts,
      lifecycleEvidenceIdentities: receipts.map((entry) => Object.freeze({
        eventDigest: entry.ledgerStreamDigest,
        receiptDigest: entry.receiptDigest,
      })),
    };
  } catch {
    return {
      disposition: fail('shadow_parity', 'EVIDENCE_MALFORMED'),
      receipts: [],
      lifecycleEvidenceIdentities: [],
    };
  }
}

function bindingForKind(
  bindings: readonly DeepImprovementCommonSealedArtifactBinding[],
  kind: DeepImprovementCommonArtifactKind,
): DeepImprovementCommonSealedArtifactBinding | undefined {
  return bindings.find((entry) => entry.artifactKind === kind);
}

async function evaluateSealed<TState extends JsonObject>(
  input: DeepImprovementCommonModeGateInput<TState>,
  certificates: VerifiedCertificateEvidence,
): Promise<VerifiedSealedEvidence> {
  if (input.sealedArtifacts == null || input.sealedArtifacts.bindings.length === 0) {
    return {
      disposition: fail('sealed_artifacts', 'EVIDENCE_MISSING'),
      artifactDigests: [],
      lifecycleEvidenceIdentities: [],
    };
  }
  try {
    if (certificates.bundle === null) {
      return {
        disposition: fail('sealed_artifacts', 'SEALED_ARTIFACT_INVALID'),
        artifactDigests: [],
        lifecycleEvidenceIdentities: [],
      };
    }
    const bindings = input.sealedArtifacts.bindings;
    if (
      bindings.length !== REQUIRED_ARTIFACT_KINDS.length
      || new Set(bindings.map((entry) => entry.artifactKind)).size !== REQUIRED_ARTIFACT_KINDS.length
      || REQUIRED_ARTIFACT_KINDS.some((kind) => bindingForKind(bindings, kind) === undefined)
    ) {
      return {
        disposition: fail('sealed_artifacts', 'SEALED_ARTIFACT_INVALID'),
        artifactDigests: [],
        lifecycleEvidenceIdentities: [],
      };
    }
    const now = new Date(input.certificates!.verificationInput.verificationTime);
    if (!Number.isFinite(now.getTime())) throw new TypeError('Invalid verification time');
    const verified: DeepImprovementVerifiedSealedArtifact[] = [];
    for (const binding of bindings) {
      const artifact = binding.artifactKind === DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE
        ? await readDeepImprovementPromotionEvidence(
            input.sealedArtifacts.store,
            binding,
            { now },
          )
        : await readDeepImprovementCommonArtifact(
            input.sealedArtifacts.store,
            binding,
            { accessRole: 'evaluator', now },
          );
      verified.push(artifact);
    }
    const body = certificates.bundle.certificate.body;
    const byKind = new Map(verified.map((entry) => [entry.binding.artifactKind, entry]));
    const evaluator = byKind.get(DeepImprovementCommonArtifactKinds.EVALUATOR_CAPSULE)!;
    const candidate = byKind.get(DeepImprovementCommonArtifactKinds.CANDIDATE_INPUT)!;
    const baseline = byKind.get(DeepImprovementCommonArtifactKinds.BASELINE_INPUT)!;
    const canary = byKind.get(DeepImprovementCommonArtifactKinds.CANARY_EPOCH)!;
    const promotion = byKind.get(DeepImprovementCommonArtifactKinds.PROMOTION_EVIDENCE)!;
    const artifactDigests = verified.map(
      (entry) => entry.binding.reference.qualified_digest,
    ).sort();
    if (
      body.evaluatorEpochId !== (evaluator.material as { evaluatorEpochId: string }).evaluatorEpochId
      || body.candidateId !== (candidate.material as { candidateId: string }).candidateId
      || body.baselineId !== (baseline.material as { baselineId: string }).baselineId
      || body.canaryEpochId !== (canary.material as { canaryEpochId: string }).canaryEpochId
      || body.evaluatorEpochId !== (promotion.material as { evaluatorEpochId: string }).evaluatorEpochId
      || digest(artifactDigests) !== digest(body.artifactClaims.map(
        (entry) => entry.binding.reference.qualified_digest,
      ).sort())
    ) {
      return {
        disposition: fail('sealed_artifacts', 'EVIDENCE_STALE'),
        artifactDigests: [],
        lifecycleEvidenceIdentities: [],
      };
    }
    return {
      disposition: disposition('sealed_artifacts', 'ready', null, digest(artifactDigests)),
      artifactDigests,
      lifecycleEvidenceIdentities: verified.map((entry) => Object.freeze({
        eventDigest: entry.descriptor.content_digest,
        receiptDigest: entry.binding.reference.descriptor_digest,
      })),
    };
  } catch {
    return {
      disposition: fail('sealed_artifacts', 'SEALED_ARTIFACT_INVALID'),
      artifactDigests: [],
      lifecycleEvidenceIdentities: [],
    };
  }
}

function evaluateLifecycle<TState extends JsonObject>(
  input: DeepImprovementCommonModeGateInput<TState>,
  authenticatedIdentities: readonly LifecycleEvidenceIdentity[],
): DeepImprovementCommonGateInputDisposition {
  if (input.resumeEvidence == null) return fail('lifecycle_resume', 'RESUME_INVALID');
  try {
    const rows = input.lifecycle;
    const kinds = rows.map((entry) => entry.kind).sort();
    const expected = [...REQUIRED_LIFECYCLE].sort();
    const eventDigests = rows.map((entry) => entry.eventDigest);
    const receiptDigests = rows.map((entry) => entry.receiptDigest);
    const identityKeys = rows.map((entry) => `${entry.eventDigest}:${entry.receiptDigest}`);
    if (
      rows.length !== expected.length
      || new Set(kinds).size !== expected.length
      || digest(kinds) !== digest(expected)
      || new Set(eventDigests).size !== expected.length
      || new Set(receiptDigests).size !== expected.length
      || new Set(identityKeys).size !== expected.length
      || rows.some((row) => (
        !isPlainRecord(row)
        || !hasExactKeys(row, ['kind', 'fixtureId', 'eventDigest', 'receiptDigest', 'status'])
        || !isToken(row.fixtureId)
        || !isDigest(row.eventDigest)
        || !isDigest(row.receiptDigest)
        || row.status !== 'covered'
      ))
    ) return fail('lifecycle_resume', 'LIFECYCLE_INCOMPLETE');
    const authenticatedIdentityKeys = new Set(authenticatedIdentities.map(
      (entry) => `${entry.eventDigest}:${entry.receiptDigest}`,
    ));
    if (authenticatedIdentityKeys.size < expected.length) {
      return fail('lifecycle_resume', 'EVIDENCE_MISSING');
    }
    if (identityKeys.some((identity) => !authenticatedIdentityKeys.has(identity))) {
      return fail('lifecycle_resume', 'EVIDENCE_STALE');
    }
    const legacyDecision = parseDeepImprovementCommonResumeDecision(
      input.resumeEvidence.legacyDecision,
    );
    const ledgerDecision = parseDeepImprovementCommonResumeDecision(
      input.resumeEvidence.ledgerDecision,
    );
    if (
      digest(resumePathSemanticView(
        legacyDecision,
        input.resumeEvidence.legacyEventTailDigest,
        input.resumeEvidence.legacyFreshProjectionFingerprint,
      )) !== digest(resumePathSemanticView(
        ledgerDecision,
        input.resumeEvidence.ledgerEventTailDigest,
        input.resumeEvidence.ledgerFreshProjectionFingerprint,
      ))
      || !isReadyResumeDecision(legacyDecision)
      || !isReadyResumeDecision(ledgerDecision)
    ) return fail('lifecycle_resume', 'RESUME_INVALID');
    return disposition('lifecycle_resume', 'ready', null, digest({
      rows,
      resumeEvidence: input.resumeEvidence,
    }));
  } catch {
    return fail('lifecycle_resume', 'EVIDENCE_MALFORMED');
  }
}

async function evaluateRollback<TState extends JsonObject>(
  input: DeepImprovementCommonModeGateInput<TState>,
): Promise<DeepImprovementCommonGateInputDisposition> {
  if (input.rollback == null) return fail('rollback_readiness', 'EVIDENCE_MISSING');
  try {
    if (
      !isDigest(input.rollback.rollbackAnchorDigest)
      || !verifyClassificationManifest(input.rollback.classificationManifest)
    ) return fail('rollback_readiness', 'ROLLBACK_REHEARSAL_INVALID');
    if (
      input.rollback.healthAggregate.state !== HealthAggregateStates.HEALTHY
      && input.rollback.healthAggregate.state !== HealthAggregateStates.RECOVERED
    ) return fail('rollback_readiness', 'HEALTH_NOT_GREEN');
    const verified = await verifyPhase014RollbackEvidence(input.rollback.phase014Evidence);
    if (!verified.ok) return fail('rollback_readiness', 'ROLLBACK_REHEARSAL_INVALID');
    const { certification, facts } = verified.certificate;
    if (
      facts.candidateSha !== input.candidateSha
      || facts.verifierIdentity !== input.verifierIdentity
      || certification.verifier_version !== input.verifierVersion
      || facts.bindings.rollbackAsset !== input.rollback.rollbackAnchorDigest
      || facts.classificationDigest !== input.rollback.classificationManifest.finalDigest
    ) return fail('rollback_readiness', 'EVIDENCE_STALE');
    return disposition('rollback_readiness', 'ready', null, digest({
      certificateDigest: verified.certificate.certificateDigest,
      candidateSha: facts.candidateSha,
      verifierIdentity: facts.verifierIdentity,
      verifierVersion: certification.verifier_version,
      classificationDigest: facts.classificationDigest,
      rollbackAnchorDigest: facts.bindings.rollbackAsset,
      healthAggregateDigest: digest(input.rollback.healthAggregate),
    }));
  } catch {
    return fail('rollback_readiness', 'EVIDENCE_MALFORMED');
  }
}

export function evaluateDeepImprovementCommonRollbackWindow(
  input: DeepImprovementCommonRollbackWindowInput,
): DeepImprovementCommonRollbackWindowEvaluation {
  if (
    !isPlainRecord(input)
    || !hasExactKeys(input, WINDOW_KEYS)
    || typeof input.openedAt !== 'string'
    || typeof input.evaluatedAt !== 'string'
    || !Array.isArray(input.executions)
    || !Number.isSafeInteger(input.unresolvedEvidenceCount)
    || input.unresolvedEvidenceCount < 0
    || typeof input.lowTraffic !== 'boolean'
    || input.executions.some((entry) => (
      !isPlainRecord(entry) || !hasExactKeys(entry, WINDOW_EXECUTION_KEYS)
    ))
  ) throw new TypeError('Rollback window input is malformed');
  const openedAt = Date.parse(input.openedAt);
  const evaluatedAt = Date.parse(input.evaluatedAt);
  if (!Number.isFinite(openedAt) || !Number.isFinite(evaluatedAt) || evaluatedAt < openedAt) {
    throw new TypeError('Rollback window input is malformed');
  }
  const validExecutions = input.executions.filter((entry) => (
    isToken(entry.executionId)
    && entry.authorityState === 'new_authoritative_reversible'
    && Number.isSafeInteger(entry.authorityEpoch)
    && entry.authorityEpoch > 0
    && entry.result === 'trusted-completion'
    && isDigest(entry.certificateDigest)
  ));
  const executionIdsByCertificate = new Map<string, Set<string>>();
  const certificateDigestsByExecution = new Map<string, Set<string>>();
  for (const entry of validExecutions) {
    const executionIds = executionIdsByCertificate.get(entry.certificateDigest) ?? new Set<string>();
    executionIds.add(entry.executionId);
    executionIdsByCertificate.set(entry.certificateDigest, executionIds);
    const certificateDigests = certificateDigestsByExecution.get(entry.executionId) ?? new Set<string>();
    certificateDigests.add(entry.certificateDigest);
    certificateDigestsByExecution.set(entry.executionId, certificateDigests);
  }
  const visitedExecutionIds = new Set<string>();
  const visitedCertificateDigests = new Set<string>();
  let successful = 0;
  // Linked execution and certificate identities represent one authoritative run.
  for (const entry of validExecutions) {
    if (
      visitedExecutionIds.has(entry.executionId)
      || visitedCertificateDigests.has(entry.certificateDigest)
    ) continue;
    successful += 1;
    const pendingExecutionIds = [entry.executionId];
    const pendingCertificateDigests = [entry.certificateDigest];
    while (pendingExecutionIds.length > 0 || pendingCertificateDigests.length > 0) {
      const executionId = pendingExecutionIds.pop();
      if (executionId !== undefined && !visitedExecutionIds.has(executionId)) {
        visitedExecutionIds.add(executionId);
        for (const certificateDigest of certificateDigestsByExecution.get(executionId) ?? []) {
          if (!visitedCertificateDigests.has(certificateDigest)) {
            pendingCertificateDigests.push(certificateDigest);
          }
        }
      }
      const certificateDigest = pendingCertificateDigests.pop();
      if (certificateDigest !== undefined && !visitedCertificateDigests.has(certificateDigest)) {
        visitedCertificateDigests.add(certificateDigest);
        for (const linkedExecutionId of executionIdsByCertificate.get(certificateDigest) ?? []) {
          if (!visitedExecutionIds.has(linkedExecutionId)) pendingExecutionIds.push(linkedExecutionId);
        }
      }
    }
  }
  const elapsedCalendarDays = Math.floor((evaluatedAt - openedAt) / 86_400_000);
  const minimumsMet = elapsedCalendarDays >= DEEP_IMPROVEMENT_COMMON_ROLLBACK_MINIMUM_DAYS
    && successful >= DEEP_IMPROVEMENT_COMMON_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS;
  const extended = input.lowTraffic || input.unresolvedEvidenceCount > 0;
  const core = Object.freeze({
    state: extended ? 'extended' as const : minimumsMet ? 'eligible_to_close' as const : 'open' as const,
    elapsedCalendarDays,
    successfulAuthoritativeExecutions: successful,
    minimumCalendarDays: DEEP_IMPROVEMENT_COMMON_ROLLBACK_MINIMUM_DAYS,
    minimumSuccessfulAuthoritativeExecutions:
      DEEP_IMPROVEMENT_COMMON_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS,
    unresolvedEvidenceCount: input.unresolvedEvidenceCount,
    lowTraffic: input.lowTraffic,
    windowClosed: false as const,
  });
  return Object.freeze({
    ...core,
    evaluationDigest: digest({ evaluation: core, inputDigest: digest(input) }),
  });
}

export class DeepImprovementCommonModeMigrationGate {
  public async evaluate<TState extends JsonObject>(
    input: DeepImprovementCommonModeGateInput<TState>,
  ): Promise<DeepImprovementCommonModeGateResult> {
    try {
      if (!isPlainRecord(input) || !hasExactKeys(input, GATE_INPUT_KEYS)) {
        return malformedResult();
      }
      const snapshot = snapshotModeGateInput(input);
      if (!validateTopLevel(snapshot)) return malformedResult();
      let window: DeepImprovementCommonRollbackWindowEvaluation | null = null;
      try {
        window = evaluateDeepImprovementCommonRollbackWindow(snapshot.rollbackWindow);
      } catch {
        window = null;
      }
      const certificates = await evaluateCertificates(snapshot);
      const [parity, sealed, rollback] = await Promise.all([
        evaluateParity(snapshot, certificates),
        evaluateSealed(snapshot, certificates),
        evaluateRollback(snapshot),
      ]);
      const lifecycle = evaluateLifecycle(snapshot, [
        ...parity.lifecycleEvidenceIdentities,
        ...sealed.lifecycleEvidenceIdentities,
        ...certificates.lifecycleEvidenceIdentities,
      ]);
      const dispositions = Object.freeze([
        parity.disposition,
        sealed.disposition,
        certificates.disposition,
        lifecycle,
        window === null ? fail('rollback_readiness', 'EVIDENCE_MALFORMED') : rollback,
      ].sort((left, right) => INPUT_ORDER.indexOf(left.input) - INPUT_ORDER.indexOf(right.input)));
      let verdict = overallVerdict(dispositions);
      if (snapshot.unresolvedRiskIds.length > 0 && verdict === 'pass') verdict = 'blocked';
      if (
        verdict !== 'pass'
        || window === null
        || certificates.result === null
        || certificates.bundle === null
        || snapshot.rollback === null
      ) {
        return Object.freeze({ verdict, dispositions, certificate: null });
      }
      const body = certificates.bundle.certificate.body;
      const certificateCore = Object.freeze({
        schemaVersion: DEEP_IMPROVEMENT_COMMON_ROLLBACK_GATE_SCHEMA_VERSION,
        certificateKind: 'mode-migration-readiness' as const,
        mode: 'deep-improvement-common' as const,
        readiness: 'ready-for-phase-014-consideration' as const,
        candidateSha: snapshot.candidateSha,
        baseSha: snapshot.baseSha,
        sharedContractDigest: snapshot.sharedContractDigest,
        writeSetDigest: snapshot.writeSetDigest,
        versions: Object.freeze({
          eventEnvelopeVersion: snapshot.versions.eventEnvelopeVersion,
          eventSchemaVersion: snapshot.versions.eventSchemaVersion,
          reducerVersion: snapshot.versions.reducerVersion,
          projectionVersion: snapshot.versions.projectionVersion,
        }),
        runId: body.runId,
        lineageId: body.lineageId,
        generation: body.generation,
        evaluatorEpochId: body.evaluatorEpochId,
        candidateId: body.candidateId,
        baselineId: body.baselineId,
        canaryEpochId: body.canaryEpochId,
        fixtureIds: Object.freeze(parity.receipts.map((entry) => entry.fixtureId).sort()),
        streamDigests: Object.freeze(parity.receipts.map((entry) => entry.ledgerStreamDigest).sort()),
        artifactDigests: Object.freeze([...sealed.artifactDigests]),
        receiptDigests: Object.freeze([
          ...parity.receipts.map((entry) => entry.receiptDigest),
          ...certificates.receiptDigests,
        ].sort()),
        runCertificateDigest: certificates.result.certificateDigest,
        replayFingerprint: certificates.result.replayFingerprint,
        projectionIntegrityDigest: certificates.result.projectionIntegrityDigest,
        receiptChainDigest: certificates.result.receiptChainDigest,
        artifactSetDigest: certificates.result.artifactSetDigest,
        verifierIdentity: snapshot.verifierIdentity,
        verifierVersion: snapshot.verifierVersion,
        authorityState: 'legacy_authoritative' as const,
        authorityEpoch: snapshot.authority.epoch,
        rollbackAnchorDigest: snapshot.rollback.rollbackAnchorDigest,
        rollbackWindow: window,
        dispositions,
        unresolvedRiskIds: Object.freeze([...snapshot.unresolvedRiskIds].sort()),
        authorityMutation: false as const,
        rollbackWindowClosed: false as const,
        cutoverCertificate: false as const,
      });
      const certificate: DeepImprovementCommonModeMigrationCertificate = Object.freeze({
        ...certificateCore,
        certificateDigest: digest(certificateCore),
      });
      return Object.freeze({ verdict: 'pass', dispositions, certificate });
    } catch {
      return malformedResult();
    }
  }
}
