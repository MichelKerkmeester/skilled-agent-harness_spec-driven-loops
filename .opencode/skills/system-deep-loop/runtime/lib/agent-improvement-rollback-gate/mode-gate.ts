// ───────────────────────────────────────────────────────────────────
// MODULE: Agent Improvement Independent Mode Gate
// ───────────────────────────────────────────────────────────────────

import { readAuthorizationAudit } from '../authorized-ledger/index.js';
import {
  parseAgentImprovementCertificateBundle,
  verifyAgentImprovementCertificateOffline,
} from '../agent-improvement-certificates/index.js';
import {
  parseAgentImprovementResumeDecision,
} from '../agent-improvement-resume-adapter/index.js';
import {
  AgentImprovementArtifactKinds,
  readAgentImprovementArtifact,
} from '../agent-improvement-sealed-artifacts/index.js';
import {
  parseAgentImprovementModeGateInput,
  parseAgentImprovementParityReceipt,
} from '../agent-improvement-shadow-parity/index.js';
import {
  DeepImprovementCommonModeMigrationGate,
  evaluateDeepImprovementCommonRollbackWindow,
} from '../deep-improvement-common-rollback-gate/index.js';
import { AGENT_IMPROVEMENT_EVENT_VERSION } from '../agent-improvement-ledger-schema/index.js';
import {
  AGENT_IMPROVEMENT_PROJECTION_SCHEMA_VERSION,
  AGENT_IMPROVEMENT_REDUCER_VERSION,
} from '../agent-improvement-reducers/index.js';
import { canonicalBytes, CURRENT_ENVELOPE_VERSION, sha256Bytes } from '../event-envelope/index.js';
import { matchesArtifactClaimSet, matchesInstalledVersionBindings } from '../mode-contracts/index.js';

import {
  AGENT_IMPROVEMENT_ROLLBACK_GATE_SCHEMA_VERSION,
  AGENT_IMPROVEMENT_ROLLBACK_MINIMUM_DAYS,
  AGENT_IMPROVEMENT_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS,
} from './types.js';

import type {
  AgentImprovementCertificateBundle,
  AgentImprovementOfflineVerificationSuccess,
} from '../agent-improvement-certificates/index.js';
import type { AgentImprovementResumeDecision } from '../agent-improvement-resume-adapter/index.js';
import type {
  AgentImprovementArtifactKind,
  AgentImprovementSealedArtifactBinding,
  AgentImprovementVerifiedSealedArtifact,
} from '../agent-improvement-sealed-artifacts/index.js';
import type { AgentImprovementParityReceipt } from '../agent-improvement-shadow-parity/index.js';
import type { DeepImprovementCommonModeGateResult } from '../deep-improvement-common-rollback-gate/index.js';
import type { JsonObject } from '../event-envelope/index.js';
import type {
  AgentImprovementGateDisposition,
  AgentImprovementGateInputDisposition,
  AgentImprovementGateInputKind,
  AgentImprovementGateReasonCode,
  AgentImprovementGateVerdict,
  AgentImprovementLifecycleEvidenceKind,
  AgentImprovementModeGateInput,
  AgentImprovementModeGateResult,
  AgentImprovementModeMigrationCertificate,
  AgentImprovementRollbackWindowEvaluation,
  AgentImprovementRollbackWindowInput,
} from './types.js';

interface LifecycleEvidenceIdentity {
  readonly eventDigest: string;
  readonly receiptDigest: string;
}

interface VerifiedCertificateEvidence {
  readonly disposition: AgentImprovementGateInputDisposition;
  readonly result: AgentImprovementOfflineVerificationSuccess | null;
  readonly bundle: AgentImprovementCertificateBundle | null;
  readonly commonGate: DeepImprovementCommonModeGateResult;
  readonly receiptDigests: readonly string[];
  readonly lifecycleEvidenceIdentities: readonly LifecycleEvidenceIdentity[];
}

interface VerifiedParityEvidence {
  readonly disposition: AgentImprovementGateInputDisposition;
  readonly receipts: readonly AgentImprovementParityReceipt[];
  readonly lifecycleEvidenceIdentities: readonly LifecycleEvidenceIdentity[];
}

interface VerifiedSealedEvidence {
  readonly disposition: AgentImprovementGateInputDisposition;
  readonly artifactDigests: readonly string[];
  readonly lifecycleEvidenceIdentities: readonly LifecycleEvidenceIdentity[];
}

const HEX_40 = /^[a-f0-9]{40}$/u;
const HEX_64 = /^[a-f0-9]{64}$/u;
const TOKEN = /^[A-Za-z0-9][A-Za-z0-9._:/@+-]{0,255}$/u;
const GATE_INPUT_KEYS = Object.freeze([
  'candidateSha',
  'baseSha',
  'sharedContractDigest',
  'writeSetDigest',
  'versions',
  'verifierIdentity',
  'verifierVersion',
  'authority',
  'commonGateInput',
  'parity',
  'sealedArtifacts',
  'certificates',
  'resumeEvidence',
  'lifecycle',
  'rollbackWindow',
  'unresolvedRiskIds',
] as const);
const VERSION_BINDING_KEYS = Object.freeze([
  'eventEnvelopeVersion',
  'eventSchemaVersion',
  'reducerVersion',
  'projectionVersion',
] as const);
const INSTALLED_VERSION_BINDINGS = Object.freeze({
  eventEnvelopeVersion: CURRENT_ENVELOPE_VERSION,
  eventSchemaVersion: `agent-improvement-event@${AGENT_IMPROVEMENT_EVENT_VERSION}`,
  reducerVersion: AGENT_IMPROVEMENT_REDUCER_VERSION,
  projectionVersion: AGENT_IMPROVEMENT_PROJECTION_SCHEMA_VERSION,
});
const INPUT_ORDER: readonly AgentImprovementGateInputKind[] = Object.freeze([
  'shadow_parity',
  'sealed_artifacts',
  'certificates_receipts',
  'lifecycle_resume',
  'rollback_readiness',
]);
const REQUIRED_LIFECYCLE: readonly AgentImprovementLifecycleEvidenceKind[] = Object.freeze([
  'agent-ir',
  'change-contract',
  'proposal',
  'causal-analysis',
  'behavior-coverage',
  'transfer',
  'canary',
  'promotion',
  'abort',
  'restore',
  'replay',
  'resume',
  'unknown-effect',
]);
const REQUIRED_ARTIFACT_KINDS: readonly AgentImprovementArtifactKind[] = Object.freeze([
  AgentImprovementArtifactKinds.CANDIDATE_PROPOSAL,
  AgentImprovementArtifactKinds.BEHAVIOR_COVERAGE,
  AgentImprovementArtifactKinds.TRIAL_TRAJECTORY,
]);

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
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

function snapshotJson<T>(value: T): T {
  const before = digest(value);
  const snapshot = structuredClone(value);
  if (digest(snapshot) !== before) throw new TypeError('Evidence changed while it was snapshotted');
  return snapshot;
}

function disposition(
  input: AgentImprovementGateInputKind,
  value: AgentImprovementGateDisposition,
  reasonCode: AgentImprovementGateReasonCode | null,
  evidenceDigest: string | null,
): AgentImprovementGateInputDisposition {
  return Object.freeze({ input, disposition: value, reasonCode, evidenceDigest });
}

function fail(
  input: AgentImprovementGateInputKind,
  reasonCode: AgentImprovementGateReasonCode,
): AgentImprovementGateInputDisposition {
  return disposition(
    input,
    input === 'sealed_artifacts'
      ? 'not_ready'
      : input === 'rollback_readiness' ? 'rollback_required' : 'blocked',
    reasonCode,
    null,
  );
}

function overallVerdict(
  dispositions: readonly AgentImprovementGateInputDisposition[],
): AgentImprovementGateVerdict {
  if (dispositions.some((entry) => entry.disposition === 'rollback_required')) {
    return 'rollback_required';
  }
  if (dispositions.some((entry) => entry.disposition === 'blocked')) return 'blocked';
  if (dispositions.some((entry) => entry.disposition === 'not_ready')) return 'not_ready';
  return 'pass';
}

function malformedResult(): AgentImprovementModeGateResult {
  const dispositions = Object.freeze(INPUT_ORDER.map((input) => fail(input, 'EVIDENCE_MALFORMED')));
  return Object.freeze({ verdict: 'blocked', dispositions, certificate: null });
}

function validateTopLevel<TState extends JsonObject>(
  input: AgentImprovementModeGateInput<TState>,
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
    && matchesInstalledVersionBindings(input.versions, INSTALLED_VERSION_BINDINGS)
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

function snapshotInput<TState extends JsonObject>(
  input: AgentImprovementModeGateInput<TState>,
): AgentImprovementModeGateInput<TState> {
  const certificateEvidence = input.certificates === null ? null : (() => {
    const verification = input.certificates.verificationInput;
    try {
      return Object.freeze({ verificationInput: Object.freeze({
        bundle: snapshotJson(verification.bundle),
        projectionEvents: Object.freeze(snapshotJson(verification.projectionEvents)),
        artifactStore: verification.artifactStore,
        replay: Object.freeze({
          ...verification.replay,
          replay: Object.freeze({
            ...verification.replay.replay,
            initialState: Object.freeze(snapshotJson(verification.replay.replay.initialState)),
            replayInputDigests: Object.freeze(snapshotJson(
              verification.replay.replay.replayInputDigests,
            )),
          }),
        }),
        commonVerification: Object.freeze({
          bundle: snapshotJson(verification.commonVerification.bundle),
          projectionEvents: Object.freeze(snapshotJson(
            verification.commonVerification.projectionEvents,
          )),
          artifactStore: verification.commonVerification.artifactStore,
          replay: Object.freeze({
            ledger: verification.commonVerification.replay.ledger,
            eventRegistry: verification.commonVerification.replay.eventRegistry,
            versionRegistry: verification.commonVerification.replay.versionRegistry,
            componentRegistry: verification.commonVerification.replay.componentRegistry,
            runId: verification.commonVerification.replay.runId,
            rangeStartSequence: verification.commonVerification.replay.rangeStartSequence,
            rangeEndSequence: verification.commonVerification.replay.rangeEndSequence,
            replay: Object.freeze({
              reducerId: verification.commonVerification.replay.replay.reducerId,
              reducerVersion: verification.commonVerification.replay.replay.reducerVersion,
              projectionSchemaVersion:
                verification.commonVerification.replay.replay.projectionSchemaVersion,
              initialState: Object.freeze(snapshotJson(
                verification.commonVerification.replay.replay.initialState,
              )),
              replayInputDigests: Object.freeze(snapshotJson(
                verification.commonVerification.replay.replay.replayInputDigests,
              )),
            }),
          }),
          providers: verification.commonVerification.providers,
          verificationTime: verification.commonVerification.verificationTime,
        }),
        providers: verification.providers,
      }) });
    } catch {
      // Malformed evidence still reaches the typed offline verifier; it can never become valid.
      return Object.freeze({ verificationInput: verification });
    }
  })();
  return Object.freeze({
    candidateSha: input.candidateSha,
    baseSha: input.baseSha,
    sharedContractDigest: input.sharedContractDigest,
    writeSetDigest: input.writeSetDigest,
    versions: Object.freeze({
      eventEnvelopeVersion: input.versions.eventEnvelopeVersion,
      eventSchemaVersion: input.versions.eventSchemaVersion,
      reducerVersion: input.versions.reducerVersion,
      projectionVersion: input.versions.projectionVersion,
    }),
    verifierIdentity: input.verifierIdentity,
    verifierVersion: input.verifierVersion,
    authority: Object.freeze({ state: input.authority.state, epoch: input.authority.epoch }),
    commonGateInput: input.commonGateInput,
    parity: input.parity === null ? null : Object.freeze({
      manifest: snapshotJson(input.parity.manifest),
      modeGateInput: snapshotJson(input.parity.modeGateInput),
      receipts: Object.freeze(snapshotJson(input.parity.receipts)),
      authorizationAuditRootDirectory: input.parity.authorizationAuditRootDirectory,
      authorizationAuditLedgerId: input.parity.authorizationAuditLedgerId,
    }),
    sealedArtifacts: input.sealedArtifacts === null ? null : Object.freeze({
      store: input.sealedArtifacts.store,
      bindings: Object.freeze(snapshotJson(input.sealedArtifacts.bindings)),
    }),
    certificates: certificateEvidence,
    resumeEvidence: input.resumeEvidence === null
      ? null : Object.freeze(snapshotJson(input.resumeEvidence)),
    lifecycle: Object.freeze(snapshotJson(input.lifecycle)),
    rollbackWindow: Object.freeze(snapshotJson(input.rollbackWindow)),
    unresolvedRiskIds: Object.freeze(snapshotJson(input.unresolvedRiskIds)),
  });
}

async function evaluateCertificates<TState extends JsonObject>(
  input: AgentImprovementModeGateInput<TState>,
): Promise<VerifiedCertificateEvidence> {
  const commonGate = await new DeepImprovementCommonModeMigrationGate().evaluate(
    input.commonGateInput,
  );
  const empty = {
    result: null,
    bundle: null,
    commonGate,
    receiptDigests: Object.freeze([]),
    lifecycleEvidenceIdentities: Object.freeze([]),
  } as const;
  if (input.certificates === null) {
    return { disposition: fail('certificates_receipts', 'EVIDENCE_MISSING'), ...empty };
  }
  try {
    const result = await verifyAgentImprovementCertificateOffline(
      input.certificates.verificationInput,
    );
    if (result.verdict !== 'valid') {
      return { disposition: fail('certificates_receipts', 'MODE_CERTIFICATE_INVALID'), ...empty };
    }
    if (commonGate.verdict !== 'pass' || commonGate.certificate === null) {
      return { disposition: fail('certificates_receipts', 'COMMON_GATE_INVALID'), ...empty };
    }
    const bundle = parseAgentImprovementCertificateBundle(
      input.certificates.verificationInput.bundle,
    );
    const body = bundle.certificate.body;
    const commonBody = bundle.commonBundle.certificate.body;
    if (
      input.candidateSha !== input.commonGateInput.candidateSha
      || input.baseSha !== input.commonGateInput.baseSha
      || input.sharedContractDigest !== input.commonGateInput.sharedContractDigest
      || input.writeSetDigest !== input.commonGateInput.writeSetDigest
      || input.authority.epoch !== input.commonGateInput.authority.epoch
      || digest(input.rollbackWindow) !== digest(input.commonGateInput.rollbackWindow)
      || body.commonCertificateDigest !== bundle.commonBundle.certificate.certificateDigest
      || body.commonCertificateDigest !== commonGate.certificate.runCertificateDigest
      || body.runId !== commonBody.runId
      || body.lineageId !== commonBody.lineageId
      || body.generation !== commonBody.generation
      || body.candidateId !== commonBody.candidateId
      || body.evaluationEpochId !== commonBody.evaluatorEpochId
      || body.canaryEpochId !== commonBody.canaryEpochId
      || input.certificates.verificationInput.projectionEvents.some((event) => (
        event.envelope_version !== input.versions.eventEnvelopeVersion
      ))
      || bundle.receipts.some((receipt) => receipt.facts.authorityEpoch !== input.authority.epoch)
    ) {
      return { disposition: fail('certificates_receipts', 'EVIDENCE_STALE'), ...empty };
    }
    const receiptDigests = bundle.receipts.map((receipt) => receipt.receiptDigest).sort();
    return {
      disposition: disposition('certificates_receipts', 'ready', null, digest({
        certificateDigest: result.certificateDigest,
        commonGateCertificateDigest: commonGate.certificate.certificateDigest,
        replayFingerprint: result.replayFingerprint,
        projectionIntegrityDigest: result.projectionIntegrityDigest,
        receiptChainDigest: result.receiptChainDigest,
        artifactSetDigest: result.artifactSetDigest,
        receiptDigests,
      })),
      result,
      bundle,
      commonGate,
      receiptDigests,
      lifecycleEvidenceIdentities: Object.freeze(bundle.receipts.map((receipt) => ({
        eventDigest: receipt.facts.resultEventDigest,
        receiptDigest: receipt.receiptDigest,
      }))),
    };
  } catch {
    return { disposition: fail('certificates_receipts', 'EVIDENCE_MALFORMED'), ...empty };
  }
}

async function evaluateParity<TState extends JsonObject>(
  input: AgentImprovementModeGateInput<TState>,
  certificates: VerifiedCertificateEvidence,
): Promise<VerifiedParityEvidence> {
  const empty = { receipts: Object.freeze([]), lifecycleEvidenceIdentities: Object.freeze([]) };
  if (input.parity === null) {
    return { disposition: fail('shadow_parity', 'EVIDENCE_MISSING'), ...empty };
  }
  try {
    const parityInput = input.parity;
    const reported = parseAgentImprovementModeGateInput(parityInput.modeGateInput);
    const requiredFixtureIds = parityInput.manifest.cases
      .filter((entry) => entry.mode === 'agent-improvement')
      .map((entry) => entry.caseId)
      .sort();
    const receipts = parityInput.receipts.map((entry) => (
      parseAgentImprovementParityReceipt(entry, parityInput.manifest)
    ));
    const receiptFixtureIds = receipts.map((receipt) => receipt.fixtureId).sort();
    const receiptDigests = receipts.map((receipt) => receipt.receiptDigest).sort();
    const independentlyGreen = receipts.every((receipt) => (
      receipt.diffDispositions.length === 0
      && receipt.legacyStreamDigest === receipt.ledgerStreamDigest
      && receipt.legacyProjectionFingerprint === receipt.ledgerProjectionFingerprint
      && receipt.parityCertificate !== null
      && receipt.modeCertificateBinding !== null
      && receipt.certificateStatus === 'issued'
    ));
    if (
      requiredFixtureIds.length === 0
      || digest(requiredFixtureIds) !== digest(receiptFixtureIds)
      || !independentlyGreen
    ) {
      return { disposition: fail('shadow_parity', 'PARITY_INVALID'), receipts, lifecycleEvidenceIdentities: [] };
    }
    if (
      reported.mode !== 'agent-improvement'
      || reported.baseSha !== input.baseSha
      || parityInput.manifest.baseSha !== input.baseSha
      || reported.manifestDigest !== parityInput.manifest.manifestDigest
      || digest(reported.fixtureIds) !== digest(requiredFixtureIds)
      || digest(reported.parityReceiptDigests) !== digest(receiptDigests)
      || receipts.some((receipt) => (
        receipt.eventSchemaVersion !== input.versions.eventSchemaVersion
        || receipt.reducerVersion !== input.versions.reducerVersion
        || receipt.projectionVersion !== input.versions.projectionVersion
      ))
    ) {
      return { disposition: fail('shadow_parity', 'EVIDENCE_STALE'), receipts, lifecycleEvidenceIdentities: [] };
    }
    if (certificates.result === null || certificates.bundle === null) {
      return { disposition: fail('shadow_parity', 'CERTIFICATE_RECEIPT_INVALID'), receipts, lifecycleEvidenceIdentities: [] };
    }
    const certificateResult = certificates.result;
    const certificateBundle = certificates.bundle;
    const modeBindingsMatch = receipts.every((receipt) => {
      const binding = receipt.modeCertificateBinding;
      return binding !== null
        && binding.certificateDigest === certificateResult.certificateDigest
        && binding.verificationReceipt.verificationDigest
          === certificateResult.verificationReceipt.verificationDigest
        && digest(binding.bundle) === digest(certificateBundle);
    });
    const commonParityDigests = new Set(
      input.commonGateInput.parity?.receipts.map((entry) => (
        isPlainRecord(entry) && typeof entry.receiptDigest === 'string'
          ? entry.receiptDigest : ''
      )) ?? [],
    );
    if (
      !modeBindingsMatch
      || receipts.some((receipt) => !commonParityDigests.has(receipt.commonParityReceiptDigest))
    ) {
      return { disposition: fail('shadow_parity', 'CERTIFICATE_RECEIPT_INVALID'), receipts, lifecycleEvidenceIdentities: [] };
    }
    let audit;
    try {
      audit = await readAuthorizationAudit(
        parityInput.authorizationAuditRootDirectory,
        parityInput.authorizationAuditLedgerId,
      );
    } catch {
      return { disposition: fail('shadow_parity', 'AUTHORIZED_PARITY_EVIDENCE_MISSING'), receipts, lifecycleEvidenceIdentities: [] };
    }
    const allowed = audit.entries.filter((entry) => (
      entry.decision.decision === 'allow'
      && entry.decision.mode === 'agent-improvement'
      && (entry.decision.authority_state === 'legacy_authoritative'
        || entry.decision.authority_state === 'shadowing')
    ));
    const everyReceiptAuthorized = receipts.every((receipt) => {
      const attestations = receipt.certificateEvidenceBindings.flatMap(
        (binding) => binding.attestationFinalDigests,
      );
      return attestations.length > 0 && attestations.every((attestation) => allowed.some((entry) => (
        entry.decision.requested_event_digest === receipt.ledgerStreamDigest
        && entry.decision.evidence_digest === attestation
      )));
    });
    if (!everyReceiptAuthorized) {
      return { disposition: fail('shadow_parity', 'AUTHORIZED_PARITY_EVIDENCE_MISSING'), receipts, lifecycleEvidenceIdentities: [] };
    }
    return {
      disposition: disposition('shadow_parity', 'ready', null, digest({
        auditHead: audit.head,
        receiptDigests,
        reportedGateInputDigest: reported.gateInputDigest,
        independentlyVerifiedCertificateDigest: certificateResult.certificateDigest,
      })),
      receipts,
      lifecycleEvidenceIdentities: receipts.map((receipt) => ({
        eventDigest: receipt.ledgerStreamDigest,
        receiptDigest: receipt.receiptDigest,
      })),
    };
  } catch {
    return { disposition: fail('shadow_parity', 'EVIDENCE_MALFORMED'), ...empty };
  }
}

function material(artifact: AgentImprovementVerifiedSealedArtifact): Record<string, unknown> {
  const decoded = JSON.parse(new TextDecoder().decode(Uint8Array.from(artifact.bytes))) as unknown;
  if (!isPlainRecord(decoded) || !isPlainRecord(decoded.material)) {
    throw new TypeError('Verified artifact has no closed material capsule');
  }
  return decoded.material;
}

async function evaluateSealed<TState extends JsonObject>(
  input: AgentImprovementModeGateInput<TState>,
  certificates: VerifiedCertificateEvidence,
): Promise<VerifiedSealedEvidence> {
  const empty = { artifactDigests: Object.freeze([]), lifecycleEvidenceIdentities: Object.freeze([]) };
  if (input.sealedArtifacts === null || input.sealedArtifacts.bindings.length === 0) {
    return { disposition: fail('sealed_artifacts', 'EVIDENCE_MISSING'), ...empty };
  }
  try {
    if (certificates.bundle === null) {
      return { disposition: fail('sealed_artifacts', 'SEALED_ARTIFACT_INVALID'), ...empty };
    }
    const bindings = input.sealedArtifacts.bindings;
    const kinds = bindings.map((binding) => binding.artifactKind);
    if (
      bindings.length !== REQUIRED_ARTIFACT_KINDS.length
      || new Set(kinds).size !== REQUIRED_ARTIFACT_KINDS.length
      || REQUIRED_ARTIFACT_KINDS.some((kind) => !kinds.includes(kind))
    ) return { disposition: fail('sealed_artifacts', 'SEALED_ARTIFACT_INVALID'), ...empty };
    const body = certificates.bundle.certificate.body;
    const verified: AgentImprovementVerifiedSealedArtifact[] = [];
    for (const binding of bindings) {
      verified.push(await readAgentImprovementArtifact(
        input.sealedArtifacts.store,
        binding,
        { requiredEvaluationEpochId: body.evaluationEpochId },
      ));
    }
    const byKind = new Map(verified.map((artifact) => [artifact.binding.artifactKind, artifact]));
    const proposalArtifact = byKind.get(AgentImprovementArtifactKinds.CANDIDATE_PROPOSAL);
    const coverageArtifact = byKind.get(AgentImprovementArtifactKinds.BEHAVIOR_COVERAGE);
    const trialArtifact = byKind.get(AgentImprovementArtifactKinds.TRIAL_TRAJECTORY);
    if (
      proposalArtifact === undefined
      || coverageArtifact === undefined
      || trialArtifact === undefined
    ) return { disposition: fail('sealed_artifacts', 'SEALED_ARTIFACT_INVALID'), ...empty };
    const proposal = material(proposalArtifact);
    const coverage = material(coverageArtifact);
    const trial = material(trialArtifact);
    const artifactDigests = verified.map(
      (artifact) => artifact.binding.reference.qualified_digest,
    ).sort();
    if (
      !matchesArtifactClaimSet(
        artifactDigests,
        certificates.bundle.certificate.body.artifactClaims,
        certificates.bundle.certificate.body.artifactSetDigest,
      )
      || proposal.candidateId !== body.candidateId
      || proposal.candidateAgentIrDigest !== body.agentIrDigest
      || coverage.evaluationEpochId !== body.evaluationEpochId
      || coverage.coverageOutcome !== 'covered'
      || coverage.criticalInvariantOutcome !== 'pass'
      || !Array.isArray(coverage.clauseDigests) || coverage.clauseDigests.length === 0
      || !Array.isArray(coverage.behaviorFamilyIds) || coverage.behaviorFamilyIds.length === 0
      || !Array.isArray(coverage.authorityConflictCaseDigests)
      || coverage.authorityConflictCaseDigests.length === 0
      || !Array.isArray(coverage.transitionCaseDigests) || coverage.transitionCaseDigests.length === 0
      || !Array.isArray(coverage.sideEffectOracleDigests) || coverage.sideEffectOracleDigests.length === 0
      || !Array.isArray(coverage.perturbationDigests) || coverage.perturbationDigests.length === 0
      || !Array.isArray(coverage.untouchedFamilySentinelDigests)
      || coverage.untouchedFamilySentinelDigests.length === 0
      || !Array.isArray(coverage.semanticVariantDigests) || coverage.semanticVariantDigests.length === 0
      || !Array.isArray(coverage.executorDigests) || coverage.executorDigests.length === 0
      || trial.evaluationEpochId !== body.evaluationEpochId
      || trial.candidateProposalReference == null
      || !isDigest(trial.executorFingerprint)
      || !isDigest(trial.environmentDigest)
      || !isDigest(trial.integrityObservationDigest)
    ) return { disposition: fail('sealed_artifacts', 'EVIDENCE_STALE'), ...empty };
    return {
      disposition: disposition('sealed_artifacts', 'ready', null, digest(artifactDigests)),
      artifactDigests,
      lifecycleEvidenceIdentities: verified.map((artifact) => ({
        eventDigest: artifact.descriptor.content_digest,
        receiptDigest: artifact.binding.reference.descriptor_digest,
      })),
    };
  } catch {
    return { disposition: fail('sealed_artifacts', 'SEALED_ARTIFACT_INVALID'), ...empty };
  }
}

function canonicalViews(values: readonly unknown[]): readonly unknown[] {
  return [...values].sort((left, right) => digest(left).localeCompare(digest(right)));
}

function resumeSemanticView(decision: AgentImprovementResumeDecision): JsonObject {
  return {
    idempotencyKey: decision.idempotencyKey,
    requestDigest: decision.requestDigest,
    authority: decision.authority,
    legacyAuthority: decision.legacyAuthority,
    productionCompletion: decision.productionCompletion,
    disposition: decision.disposition,
    priorCertificateDisposition: decision.priorCertificateDisposition,
    offlineVerificationVerdict: decision.offlineVerificationVerdict,
    persistedFingerprint: decision.persistedFingerprint,
    currentFingerprint: decision.currentFingerprint,
    compatibility: canonicalViews(decision.compatibility.map((entry) => ({
      component: entry.component,
      persistedVersion: entry.persistedVersion,
      persistedDigest: entry.persistedDigest,
      installedVersion: entry.installedVersion,
      installedDigest: entry.installedDigest,
      outcome: entry.outcome,
      revision: entry.revision,
    }))),
    branches: canonicalViews(decision.branches.map((entry) => ({
      candidateId: entry.candidateId,
      mutationId: entry.mutationId,
      profileRefs: [...entry.profileRefs].sort(),
      behaviorFamilyIds: [...entry.behaviorFamilyIds].sort(),
      logicalOperationId: entry.logicalOperationId,
      receiptIdentityDigest: entry.receiptIdentityDigest,
      disposition: entry.disposition,
      evidenceEventIds: [...entry.evidenceEventIds].sort(),
    }))),
    effects: canonicalViews(decision.effects.map((entry) => ({
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
      invalidatedCandidateIds: [...decision.invalidation.invalidatedCandidateIds].sort(),
      recoveryRequiredEffectIds: [...decision.invalidation.recoveryRequiredEffectIds].sort(),
    },
    sharedDecision: decision.sharedDecision,
    lease: decision.lease,
  } as unknown as JsonObject;
}

function isReadyResumeDecision(
  decision: AgentImprovementResumeDecision,
  bundle: AgentImprovementCertificateBundle,
): boolean {
  const safeDisposition = ['exact-reuse', 'compatible', 'migrate'].includes(decision.disposition);
  const fingerprints = [decision.persistedFingerprint, decision.currentFingerprint];
  return safeDisposition
    && decision.authority === 'dark-evidence-only'
    && decision.legacyAuthority === 'unchanged'
    && decision.productionCompletion === false
    && decision.offlineVerificationVerdict === 'valid'
    && decision.priorCertificateDisposition === 'PASS'
    && fingerprints.every((fingerprint) => fingerprint !== null
      && fingerprint.runId === bundle.certificate.body.runId
      && fingerprint.certificateDigest === bundle.certificate.certificateDigest
      && fingerprint.replayFingerprint === bundle.certificate.body.replayFingerprint)
    && decision.compatibility.every((entry) => ['exact', 'compatible', 'migrate'].includes(entry.outcome))
    && decision.branches.every((entry) => ['reuse', 'reexecute', 'compensate'].includes(entry.disposition))
    && decision.effects.every((entry) => ['reuse', 'reexecute', 'compensate', 'reconcile'].includes(entry.disposition))
    && decision.invalidation.newLineageRequired === false;
}

function evaluateLifecycle<TState extends JsonObject>(
  input: AgentImprovementModeGateInput<TState>,
  certificates: VerifiedCertificateEvidence,
  authenticatedIdentities: readonly LifecycleEvidenceIdentity[],
): AgentImprovementGateInputDisposition {
  if (input.resumeEvidence === null || certificates.bundle === null) {
    return fail('lifecycle_resume', 'RESUME_INVALID');
  }
  try {
    const rows = input.lifecycle;
    const kinds = rows.map((row) => row.kind).sort();
    const expected = [...REQUIRED_LIFECYCLE].sort();
    const identities = rows.map((row) => `${row.eventDigest}:${row.receiptDigest}`);
    if (
      rows.length !== expected.length
      || new Set(kinds).size !== expected.length
      || digest(kinds) !== digest(expected)
      || new Set(rows.map((row) => row.eventDigest)).size !== expected.length
      || new Set(rows.map((row) => row.receiptDigest)).size !== expected.length
      || new Set(identities).size !== expected.length
      || rows.some((row) => !isPlainRecord(row)
        || !hasExactKeys(row, ['kind', 'fixtureId', 'eventDigest', 'receiptDigest', 'status'])
        || !isToken(row.fixtureId) || !isDigest(row.eventDigest)
        || !isDigest(row.receiptDigest) || row.status !== 'covered')
    ) return fail('lifecycle_resume', 'LIFECYCLE_INCOMPLETE');
    const authenticated = new Set(authenticatedIdentities.map(
      (entry) => `${entry.eventDigest}:${entry.receiptDigest}`,
    ));
    if (authenticated.size < expected.length) return fail('lifecycle_resume', 'EVIDENCE_MISSING');
    if (identities.some((identity) => !authenticated.has(identity))) {
      return fail('lifecycle_resume', 'EVIDENCE_STALE');
    }
    const legacy = parseAgentImprovementResumeDecision(input.resumeEvidence.legacyDecision);
    const ledger = parseAgentImprovementResumeDecision(input.resumeEvidence.ledgerDecision);
    if (
      digest({
        decision: resumeSemanticView(legacy),
        tail: input.resumeEvidence.legacyEventTailDigest,
        projection: input.resumeEvidence.legacyFreshProjectionFingerprint,
      }) !== digest({
        decision: resumeSemanticView(ledger),
        tail: input.resumeEvidence.ledgerEventTailDigest,
        projection: input.resumeEvidence.ledgerFreshProjectionFingerprint,
      })
      || !isReadyResumeDecision(legacy, certificates.bundle)
      || !isReadyResumeDecision(ledger, certificates.bundle)
    ) return fail('lifecycle_resume', 'RESUME_INVALID');
    return disposition('lifecycle_resume', 'ready', null, digest({ rows, resume: input.resumeEvidence }));
  } catch {
    return fail('lifecycle_resume', 'EVIDENCE_MALFORMED');
  }
}

function rollbackDisposition(
  commonGate: DeepImprovementCommonModeGateResult,
): AgentImprovementGateInputDisposition {
  const common = commonGate.dispositions.find((entry) => entry.input === 'rollback_readiness');
  if (commonGate.verdict !== 'pass' || common === undefined || common.disposition !== 'ready') {
    return fail('rollback_readiness', 'COMMON_GATE_INVALID');
  }
  return disposition('rollback_readiness', 'ready', null, common.evidenceDigest);
}

export function evaluateAgentImprovementRollbackWindow(
  input: AgentImprovementRollbackWindowInput,
): AgentImprovementRollbackWindowEvaluation {
  const evaluation = evaluateDeepImprovementCommonRollbackWindow(input);
  if (
    evaluation.minimumCalendarDays !== AGENT_IMPROVEMENT_ROLLBACK_MINIMUM_DAYS
    || evaluation.minimumSuccessfulAuthoritativeExecutions
      !== AGENT_IMPROVEMENT_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS
  ) throw new TypeError('Common rollback-window policy diverged from the mode contract');
  return evaluation as AgentImprovementRollbackWindowEvaluation;
}

export class AgentImprovementModeMigrationGate {
  public async evaluate<TState extends JsonObject>(
    input: AgentImprovementModeGateInput<TState>,
  ): Promise<AgentImprovementModeGateResult> {
    try {
      if (!isPlainRecord(input) || !hasExactKeys(input, GATE_INPUT_KEYS)) return malformedResult();
      const snapshot = snapshotInput(input);
      if (!validateTopLevel(snapshot)) return malformedResult();
      let window: AgentImprovementRollbackWindowEvaluation | null = null;
      try {
        window = evaluateAgentImprovementRollbackWindow(snapshot.rollbackWindow);
      } catch {
        window = null;
      }
      const certificates = await evaluateCertificates(snapshot);
      const [parity, sealed] = await Promise.all([
        evaluateParity(snapshot, certificates),
        evaluateSealed(snapshot, certificates),
      ]);
      const lifecycle = evaluateLifecycle(snapshot, certificates, [
        ...parity.lifecycleEvidenceIdentities,
        ...sealed.lifecycleEvidenceIdentities,
        ...certificates.lifecycleEvidenceIdentities,
      ]);
      const dispositions = Object.freeze([
        parity.disposition,
        sealed.disposition,
        certificates.disposition,
        lifecycle,
        window === null
          ? fail('rollback_readiness', 'EVIDENCE_MALFORMED')
          : rollbackDisposition(certificates.commonGate),
      ].sort((left, right) => INPUT_ORDER.indexOf(left.input) - INPUT_ORDER.indexOf(right.input)));
      let verdict = overallVerdict(dispositions);
      if (snapshot.unresolvedRiskIds.length > 0 && verdict === 'pass') verdict = 'blocked';
      if (
        verdict !== 'pass'
        || window === null
        || certificates.result === null
        || certificates.bundle === null
        || certificates.commonGate.certificate === null
        || snapshot.commonGateInput.rollback === null
      ) return Object.freeze({ verdict, dispositions, certificate: null });
      const body = certificates.bundle.certificate.body;
      const certificateCore = Object.freeze({
        schemaVersion: AGENT_IMPROVEMENT_ROLLBACK_GATE_SCHEMA_VERSION,
        certificateKind: 'mode-migration-readiness' as const,
        mode: 'agent-improvement' as const,
        readiness: 'ready-for-phase-014-consideration' as const,
        candidateSha: snapshot.candidateSha,
        baseSha: snapshot.baseSha,
        sharedContractDigest: snapshot.sharedContractDigest,
        writeSetDigest: snapshot.writeSetDigest,
        versions: snapshot.versions,
        runId: body.runId,
        lineageId: body.lineageId,
        generation: body.generation,
        candidateId: body.candidateId,
        parentCandidateId: body.parentCandidateId,
        agentIrDigest: body.agentIrDigest,
        changeContractDigest: body.changeContractDigest,
        mutationProposalDigest: body.mutationProposalDigest,
        evaluationEpochId: body.evaluationEpochId,
        canaryEpochId: body.canaryEpochId,
        fixtureIds: Object.freeze(parity.receipts.map((receipt) => receipt.fixtureId).sort()),
        streamDigests: Object.freeze(parity.receipts.map((receipt) => receipt.ledgerStreamDigest).sort()),
        artifactDigests: Object.freeze([...sealed.artifactDigests]),
        receiptDigests: Object.freeze([
          ...parity.receipts.map((receipt) => receipt.receiptDigest),
          ...certificates.receiptDigests,
        ].sort()),
        runCertificateDigest: certificates.result.certificateDigest,
        commonGateCertificateDigest: certificates.commonGate.certificate.certificateDigest,
        commonRunCertificateDigest:
          certificates.bundle.commonBundle.certificate.certificateDigest,
        replayFingerprint: certificates.result.replayFingerprint,
        projectionIntegrityDigest: certificates.result.projectionIntegrityDigest,
        receiptChainDigest: certificates.result.receiptChainDigest,
        artifactSetDigest: certificates.result.artifactSetDigest,
        verifierIdentity: snapshot.verifierIdentity,
        verifierVersion: snapshot.verifierVersion,
        authorityState: 'legacy_authoritative' as const,
        authorityEpoch: snapshot.authority.epoch,
        rollbackAnchorDigest: snapshot.commonGateInput.rollback.rollbackAnchorDigest,
        rollbackWindow: window,
        dispositions,
        unresolvedRiskIds: Object.freeze([...snapshot.unresolvedRiskIds].sort()),
        authorityMutation: false as const,
        rollbackWindowClosed: false as const,
        cutoverCertificate: false as const,
        candidateDispatched: false as const,
        legacyWriterRetired: false as const,
      });
      const certificate: AgentImprovementModeMigrationCertificate = Object.freeze({
        ...certificateCore,
        certificateDigest: digest(certificateCore),
      });
      return Object.freeze({ verdict: 'pass', dispositions, certificate });
    } catch {
      return malformedResult();
    }
  }
}
