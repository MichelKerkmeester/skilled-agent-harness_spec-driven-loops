// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Independent Mode Gate
// ───────────────────────────────────────────────────────────────────

import {
  readAuthorizationAudit,
} from '../authorized-ledger/index.js';
import {
  parseDeepResearchCertificateBundle,
  verifyDeepResearchCertificateOffline,
} from '../deep-research-certificates/index.js';
import {
  parseDeepResearchModeGateInput,
  parseDeepResearchParityReceipt,
} from '../deep-research-shadow-parity/index.js';
import {
  DEEP_RESEARCH_ARTIFACT_KIND_REGISTRY,
  readDeepResearchArtifact,
} from '../deep-research-sealed-artifacts/index.js';
import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import { HealthAggregateStates } from '../health-degeneration-harness/index.js';
import { verifyClassificationManifest } from '../inflight-state-classification/index.js';
import { verifyPhase014RollbackEvidence } from '../rollback-drills/index.js';

import {
  DEEP_RESEARCH_ROLLBACK_GATE_SCHEMA_VERSION,
  DEEP_RESEARCH_ROLLBACK_MINIMUM_DAYS,
  DEEP_RESEARCH_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS,
} from './types.js';

import type { JsonObject } from '../event-envelope/index.js';
import type { DeepResearchResumeDecision } from '../deep-research-resume-adapter/index.js';
import type {
  DeepResearchGateDisposition,
  DeepResearchGateInputDisposition,
  DeepResearchGateInputKind,
  DeepResearchGateReasonCode,
  DeepResearchGateVerdict,
  DeepResearchLifecycleEvidenceKind,
  DeepResearchModeGateInput,
  DeepResearchModeGateResult,
  DeepResearchModeMigrationCertificate,
  DeepResearchRollbackWindowEvaluation,
  DeepResearchRollbackWindowInput,
} from './types.js';
import type { DeepResearchParityReceipt } from '../deep-research-shadow-parity/index.js';

interface LifecycleEvidenceIdentity {
  readonly eventDigest: string;
  readonly receiptDigest: string;
}

const HEX_40 = /^[a-f0-9]{40}$/u;
const HEX_64 = /^[a-f0-9]{64}$/u;
const TOKEN = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/u;
const REQUIRED_LIFECYCLE: readonly DeepResearchLifecycleEvidenceKind[] = Object.freeze([
  'init',
  'gather-analyze',
  'convergence',
  'synthesis',
  'memory-save',
  'crash-resume',
  'source-refresh',
  'quarantine',
  'contradiction',
  'incomplete-run',
]);
const INPUT_ORDER: readonly DeepResearchGateInputKind[] = Object.freeze([
  'shadow_parity',
  'sealed_artifacts',
  'certificates_receipts',
  'lifecycle_resume',
  'rollback_readiness',
]);
const VERSION_BINDING_KEYS = Object.freeze([
  'eventEnvelopeVersion',
  'eventSchemaVersion',
  'reducerVersion',
  'projectionVersion',
] as const);
const SAFE_RESUME_COMPATIBILITY_OUTCOMES = new Set<
  DeepResearchResumeDecision['compatibilityOutcome']
>(['exact', 'compatible', 'migrate']);
const SAFE_RESUME_MANIFEST_DISPOSITIONS = new Set<
  DeepResearchResumeDecision['manifestDisposition']
>(['original', 'restart']);
const SAFE_RESUME_BRANCH_DISPOSITIONS = new Set<
  DeepResearchResumeDecision['branches'][number]['disposition']
>(['reuse', 'reexecute', 'compensate']);
const SAFE_RESUME_EFFECT_DISPOSITIONS = new Set<
  DeepResearchResumeDecision['effects'][number]['disposition']
>(['reexecute', 'compensate', 'reconcile']);

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonObject));
}

function isToken(value: unknown): value is string {
  return typeof value === 'string' && TOKEN.test(value);
}

function isDigest(value: unknown): value is string {
  return typeof value === 'string' && HEX_64.test(value);
}

function hasExactKeys(value: object, keys: readonly string[]): boolean {
  const actual = Object.keys(value);
  const expected = new Set(keys);
  return actual.length === keys.length && actual.every((key) => expected.has(key));
}

function sortCanonicalViews(values: readonly JsonObject[]): readonly JsonObject[] {
  return [...values].sort((left, right) => digest(left).localeCompare(digest(right)));
}

function resumeDecisionSemanticView(decision: DeepResearchResumeDecision): JsonObject {
  const {
    decisionId: ignoredDecisionId,
    decisionDigest: ignoredDecisionDigest,
    decisionReason: ignoredDecisionReason,
    compatibility: ignoredCompatibility,
    branches: ignoredBranches,
    effects: ignoredEffects,
    invalidation: ignoredInvalidation,
    forensicReceiptDigests,
    verifiedArtifactDigests,
    ...semanticDecision
  } = decision;
  void ignoredDecisionId;
  void ignoredDecisionDigest;
  void ignoredDecisionReason;
  void ignoredCompatibility;
  void ignoredBranches;
  void ignoredEffects;
  void ignoredInvalidation;
  const compatibility = sortCanonicalViews(decision.compatibility.map((entry) => {
    const { decisionReason: ignored, ...semanticEntry } = entry;
    void ignored;
    return semanticEntry as unknown as JsonObject;
  }));
  const branches = sortCanonicalViews(decision.branches.map((entry) => {
    const {
      attemptId: ignoredAttemptId,
      decisionReason: ignoredDecisionReason,
      evidenceEventIds,
      ...semanticEntry
    } = entry;
    void ignoredAttemptId;
    void ignoredDecisionReason;
    return {
      ...semanticEntry,
      evidenceEventIds: [...evidenceEventIds].sort(),
    } as unknown as JsonObject;
  }));
  const effects = sortCanonicalViews(decision.effects.map((entry) => {
    const { decisionReason: ignored, attemptRefs, ...semanticEntry } = entry;
    void ignored;
    return {
      ...semanticEntry,
      attemptRefs: [...attemptRefs].sort(),
    } as unknown as JsonObject;
  }));
  const invalidation = {
    ...decision.invalidation,
    changedSourceVersionIds: [...decision.invalidation.changedSourceVersionIds].sort(),
    invalidatedEvidenceIds: [...decision.invalidation.invalidatedEvidenceIds].sort(),
    invalidatedClaimVersionIds: [...decision.invalidation.invalidatedClaimVersionIds].sort(),
    reopenedQuestionIds: [...decision.invalidation.reopenedQuestionIds].sort(),
    reopenedLogicalLeafIds: [...decision.invalidation.reopenedLogicalLeafIds].sort(),
  };
  return {
    ...semanticDecision,
    compatibility,
    branches,
    effects,
    invalidation,
    forensicReceiptDigests: [...forensicReceiptDigests].sort(),
    verifiedArtifactDigests: [...verifiedArtifactDigests].sort(),
  } as unknown as JsonObject;
}

function resumePathSemanticView(
  decision: DeepResearchResumeDecision,
  eventTailDigest: string,
  freshProjectionFingerprint: string,
): JsonObject {
  return {
    decision: resumeDecisionSemanticView(decision),
    eventTailDigest,
    freshProjectionFingerprint,
  };
}

function isReadyResumeDecision(decision: DeepResearchResumeDecision): boolean {
  return SAFE_RESUME_COMPATIBILITY_OUTCOMES.has(decision.compatibilityOutcome)
    && SAFE_RESUME_MANIFEST_DISPOSITIONS.has(decision.manifestDisposition)
    && decision.compatibility.every((entry) => (
      SAFE_RESUME_COMPATIBILITY_OUTCOMES.has(entry.outcome)
    ))
    && decision.branches.every((entry) => (
      SAFE_RESUME_BRANCH_DISPOSITIONS.has(entry.disposition)
    ))
    && decision.effects.every((entry) => (
      SAFE_RESUME_EFFECT_DISPOSITIONS.has(entry.disposition)
    ));
}

function disposition(
  input: DeepResearchGateInputKind,
  value: DeepResearchGateDisposition,
  reasonCode: DeepResearchGateReasonCode | null,
  evidenceDigest: string | null,
): DeepResearchGateInputDisposition {
  return Object.freeze({ input, disposition: value, reasonCode, evidenceDigest });
}

function fail(
  input: DeepResearchGateInputKind,
  reasonCode: DeepResearchGateReasonCode,
  evidenceDigest: string | null = null,
): DeepResearchGateInputDisposition {
  const value = input === 'sealed_artifacts'
    ? 'not_ready'
    : input === 'rollback_readiness'
      ? 'rollback_required'
      : 'blocked';
  return disposition(input, value, reasonCode, evidenceDigest);
}

function overallVerdict(
  dispositions: readonly DeepResearchGateInputDisposition[],
): DeepResearchGateVerdict {
  if (dispositions.some((entry) => entry.disposition === 'rollback_required')) {
    return 'rollback_required';
  }
  if (dispositions.some((entry) => entry.disposition === 'blocked')) return 'blocked';
  if (dispositions.some((entry) => entry.disposition === 'not_ready')) return 'not_ready';
  return 'pass';
}

function validateTopLevel<TState extends JsonObject>(input: DeepResearchModeGateInput<TState>): boolean {
  return HEX_40.test(input.candidateSha)
    && HEX_40.test(input.baseSha)
    && isDigest(input.sharedContractDigest)
    && isDigest(input.writeSetDigest)
    && hasExactKeys(input.versions, VERSION_BINDING_KEYS)
    && Number.isSafeInteger(input.versions.eventEnvelopeVersion)
    && input.versions.eventEnvelopeVersion > 0
    && isToken(input.versions.eventSchemaVersion)
    && isToken(input.versions.reducerVersion)
    && isToken(input.versions.projectionVersion)
    && isToken(input.verifierIdentity)
    && isToken(input.verifierVersion)
    && input.authority.state === 'legacy_authoritative'
    && Number.isSafeInteger(input.authority.epoch)
    && input.authority.epoch > 0
    && input.unresolvedRiskIds.every(isToken);
}

async function evaluateParity<TState extends JsonObject>(
  input: DeepResearchModeGateInput<TState>,
): Promise<Readonly<{
  disposition: DeepResearchGateInputDisposition;
  receipts: readonly DeepResearchParityReceipt[];
  lifecycleEvidenceIdentities: readonly LifecycleEvidenceIdentity[];
}>> {
  if (input.parity == null) {
    return {
      disposition: fail('shadow_parity', 'EVIDENCE_MISSING'),
      receipts: [],
      lifecycleEvidenceIdentities: [],
    };
  }
  try {
    const reported = parseDeepResearchModeGateInput(input.parity.modeGateInput);
    const requiredFixtureIds = input.parity.manifest.cases
      .filter((entry) => entry.mode === 'deep-research')
      .map((entry) => entry.caseId)
      .sort();
    const receipts = input.parity.receipts.map((entry) => (
      parseDeepResearchParityReceipt(entry, input.parity!.manifest)
    ));
    const receiptFixtureIds = receipts.map((entry) => entry.fixtureId).sort();
    if (
      requiredFixtureIds.length === 0
      || digest(requiredFixtureIds) !== digest(receiptFixtureIds)
      || receipts.some((entry) => (
        entry.exitStatus !== 'green'
        || entry.diffDispositions.length !== 0
        || entry.parityCertificate === null
        || entry.certificateStatus !== 'issued'
      ))
    ) {
      return {
        disposition: fail('shadow_parity', 'PARITY_INVALID'),
        receipts,
        lifecycleEvidenceIdentities: [],
      };
    }
    if (
      reported.baseSha !== input.baseSha
      || input.parity.manifest.baseSha !== input.baseSha
      || reported.manifestDigest !== input.parity.manifest.manifestDigest
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
      && entry.decision.mode === 'deep-research'
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
    const evidenceDigest = digest({
      auditHead: audit.head,
      receiptDigests: receipts.map((entry) => entry.receiptDigest).sort(),
      reportedGateInputDigest: reported.gateInputDigest,
    });
    return {
      disposition: disposition('shadow_parity', 'ready', null, evidenceDigest),
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

async function evaluateSealed<TState extends JsonObject>(
  input: DeepResearchModeGateInput<TState>,
): Promise<Readonly<{
  disposition: DeepResearchGateInputDisposition;
  artifactDigests: readonly string[];
  lifecycleEvidenceIdentities: readonly LifecycleEvidenceIdentity[];
}>> {
  if (input.sealedArtifacts == null || input.sealedArtifacts.bindings.length === 0) {
    return {
      disposition: fail('sealed_artifacts', 'EVIDENCE_MISSING'),
      artifactDigests: [],
      lifecycleEvidenceIdentities: [],
    };
  }
  try {
    const verified = await Promise.all(input.sealedArtifacts.bindings.map((binding) => (
      readDeepResearchArtifact(input.sealedArtifacts!.store, binding)
    )));
    const lifecycleByKind = new Map(DEEP_RESEARCH_ARTIFACT_KIND_REGISTRY.map(
      (entry) => [entry.artifactKind, entry.lifecycle],
    ));
    const observed = new Set(verified.map((entry) => lifecycleByKind.get(entry.binding.artifactKind)));
    const required = ['init', 'gather', 'analyze', 'convergence', 'synthesize', 'memory-save'];
    if (required.some((entry) => !observed.has(entry as never))) {
      return {
        disposition: fail('sealed_artifacts', 'SEALED_ARTIFACT_INVALID'),
        artifactDigests: [],
        lifecycleEvidenceIdentities: [],
      };
    }
    const artifactDigests = verified.map(
      (entry) => entry.binding.reference.qualified_digest,
    ).sort();
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

async function evaluateCertificates<TState extends JsonObject>(
  input: DeepResearchModeGateInput<TState>,
): Promise<Readonly<{
  disposition: DeepResearchGateInputDisposition;
  receiptDigests: readonly string[];
  certificateDigest: string | null;
  replayFingerprint: string | null;
  lifecycleEvidenceIdentities: readonly LifecycleEvidenceIdentity[];
}>> {
  if (input.certificates == null) {
    return {
      disposition: fail('certificates_receipts', 'EVIDENCE_MISSING'),
      receiptDigests: [],
      certificateDigest: null,
      replayFingerprint: null,
      lifecycleEvidenceIdentities: [],
    };
  }
  try {
    const result = await verifyDeepResearchCertificateOffline(
      input.certificates.verificationInput,
    );
    if (result.verdict !== 'valid') {
      return {
        disposition: fail('certificates_receipts', 'CERTIFICATE_RECEIPT_INVALID'),
        receiptDigests: [],
        certificateDigest: null,
        replayFingerprint: null,
        lifecycleEvidenceIdentities: [],
      };
    }
    const bundle = parseDeepResearchCertificateBundle(
      input.certificates.verificationInput.bundle,
    );
    if (
      input.certificates.verificationInput.projectionEvents.some((entry) => (
        entry.envelope_version !== input.versions.eventEnvelopeVersion
      ))
      || bundle.receipts.some((entry) => entry.facts.authorityEpoch !== input.authority.epoch)
    ) {
      return {
        disposition: fail('certificates_receipts', 'EVIDENCE_STALE'),
        receiptDigests: [],
        certificateDigest: null,
        replayFingerprint: null,
        lifecycleEvidenceIdentities: [],
      };
    }
    const receiptDigests = bundle.receipts
      .map((entry) => entry.receiptDigest)
      .sort();
    return {
      disposition: disposition(
        'certificates_receipts',
        'ready',
        null,
        digest({ certificateDigest: result.certificateDigest, receiptDigests }),
      ),
      receiptDigests,
      certificateDigest: result.certificateDigest,
      replayFingerprint: result.replayFingerprint,
      lifecycleEvidenceIdentities: bundle.receipts.map((entry) => Object.freeze({
        eventDigest: entry.facts.resultEventDigest,
        receiptDigest: entry.receiptDigest,
      })),
    };
  } catch {
    return {
      disposition: fail('certificates_receipts', 'EVIDENCE_MALFORMED'),
      receiptDigests: [],
      certificateDigest: null,
      replayFingerprint: null,
      lifecycleEvidenceIdentities: [],
    };
  }
}

function evaluateLifecycle<TState extends JsonObject>(
  input: DeepResearchModeGateInput<TState>,
  authenticatedIdentities: readonly LifecycleEvidenceIdentity[],
): DeepResearchGateInputDisposition {
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
        !isToken(row.fixtureId)
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
    const resume = input.resumeEvidence;
    if (
      digest(resumePathSemanticView(
        resume.legacyDecision,
        resume.legacyEventTailDigest,
        resume.legacyFreshProjectionFingerprint,
      )) !== digest(resumePathSemanticView(
        resume.ledgerDecision,
        resume.ledgerEventTailDigest,
        resume.ledgerFreshProjectionFingerprint,
      ))
    ) return fail('lifecycle_resume', 'RESUME_INVALID');
    if (
      !isReadyResumeDecision(resume.legacyDecision)
      || !isReadyResumeDecision(resume.ledgerDecision)
    ) return fail('lifecycle_resume', 'RESUME_INVALID');
    return disposition('lifecycle_resume', 'ready', null, digest({ rows, resume }));
  } catch {
    return fail('lifecycle_resume', 'EVIDENCE_MALFORMED');
  }
}

async function evaluateRollback<TState extends JsonObject>(
  input: DeepResearchModeGateInput<TState>,
): Promise<DeepResearchGateInputDisposition> {
  if (input.rollback == null) return fail('rollback_readiness', 'EVIDENCE_MISSING');
  if (
    !isDigest(input.rollback.rollbackAnchorDigest)
    || !verifyClassificationManifest(input.rollback.classificationManifest)
  ) return fail('rollback_readiness', 'ROLLBACK_REHEARSAL_INVALID');
  if (
    input.rollback.healthAggregate.state !== HealthAggregateStates.HEALTHY
    && input.rollback.healthAggregate.state !== HealthAggregateStates.RECOVERED
  ) return fail('rollback_readiness', 'HEALTH_NOT_GREEN');
  try {
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

export function evaluateDeepResearchRollbackWindow(
  input: DeepResearchRollbackWindowInput,
): DeepResearchRollbackWindowEvaluation {
  const openedAt = Date.parse(input.openedAt);
  const evaluatedAt = Date.parse(input.evaluatedAt);
  if (
    !Number.isFinite(openedAt)
    || !Number.isFinite(evaluatedAt)
    || evaluatedAt < openedAt
    || !Number.isSafeInteger(input.unresolvedEvidenceCount)
    || input.unresolvedEvidenceCount < 0
  ) throw new TypeError('Rollback window input is malformed');
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
  // Shared identity links belong to one execution component and earn one threshold credit.
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
        for (const executionIdForDigest of executionIdsByCertificate.get(certificateDigest) ?? []) {
          if (!visitedExecutionIds.has(executionIdForDigest)) {
            pendingExecutionIds.push(executionIdForDigest);
          }
        }
      }
    }
  }
  const elapsedCalendarDays = Math.floor((evaluatedAt - openedAt) / 86_400_000);
  const minimumsMet = elapsedCalendarDays >= DEEP_RESEARCH_ROLLBACK_MINIMUM_DAYS
    && successful >= DEEP_RESEARCH_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS;
  const extended = input.lowTraffic || input.unresolvedEvidenceCount > 0;
  const core = Object.freeze({
    state: extended ? 'extended' as const : minimumsMet ? 'eligible_to_close' as const : 'open' as const,
    elapsedCalendarDays,
    successfulAuthoritativeExecutions: successful,
    minimumCalendarDays: DEEP_RESEARCH_ROLLBACK_MINIMUM_DAYS,
    minimumSuccessfulAuthoritativeExecutions:
      DEEP_RESEARCH_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS,
    unresolvedEvidenceCount: input.unresolvedEvidenceCount,
    lowTraffic: input.lowTraffic,
    windowClosed: false as const,
  });
  return Object.freeze({
    ...core,
    evaluationDigest: digest({
      evaluation: core,
      inputDigest: digest(input),
    }),
  });
}

export class DeepResearchModeMigrationGate {
  public async evaluate<TState extends JsonObject>(
    input: DeepResearchModeGateInput<TState>,
  ): Promise<DeepResearchModeGateResult> {
    let window: DeepResearchRollbackWindowEvaluation | null = null;
    try {
      window = evaluateDeepResearchRollbackWindow(input.rollbackWindow);
    } catch {
      window = null;
    }
    const [parity, sealed, certificates, rollback] = await Promise.all([
      evaluateParity(input),
      evaluateSealed(input),
      evaluateCertificates(input),
      evaluateRollback(input),
    ]);
    const lifecycle = evaluateLifecycle(input, [
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
    let topLevelValid = false;
    try {
      topLevelValid = validateTopLevel(input);
    } catch {
      topLevelValid = false;
    }
    if (!topLevelValid) verdict = 'blocked';
    if (topLevelValid && input.unresolvedRiskIds.length > 0 && verdict === 'pass') verdict = 'blocked';
    if (verdict !== 'pass') {
      return Object.freeze({ verdict, dispositions, certificate: null });
    }
    const certificateCore = Object.freeze({
      schemaVersion: DEEP_RESEARCH_ROLLBACK_GATE_SCHEMA_VERSION,
      certificateKind: 'mode-migration-readiness' as const,
      mode: 'deep-research' as const,
      readiness: 'ready-for-phase-014-consideration' as const,
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
      fixtureIds: Object.freeze(parity.receipts.map((entry) => entry.fixtureId).sort()),
      streamDigests: Object.freeze(parity.receipts.map((entry) => entry.ledgerStreamDigest).sort()),
      artifactDigests: Object.freeze([...sealed.artifactDigests]),
      receiptDigests: Object.freeze([
        ...parity.receipts.map((entry) => entry.receiptDigest),
        ...certificates.receiptDigests,
      ].sort()),
      runCertificateDigest: certificates.certificateDigest!,
      replayFingerprint: certificates.replayFingerprint!,
      verifierIdentity: input.verifierIdentity,
      verifierVersion: input.verifierVersion,
      authorityState: 'legacy_authoritative' as const,
      authorityEpoch: input.authority.epoch,
      rollbackAnchorDigest: input.rollback!.rollbackAnchorDigest,
      rollbackWindow: window!,
      dispositions,
      unresolvedRiskIds: Object.freeze([...input.unresolvedRiskIds].sort()),
      authorityMutation: false as const,
      rollbackWindowClosed: false as const,
      cutoverCertificate: false as const,
    });
    const certificate: DeepResearchModeMigrationCertificate = Object.freeze({
      ...certificateCore,
      certificateDigest: digest(certificateCore),
    });
    return Object.freeze({ verdict: 'pass', dispositions, certificate });
  }
}
