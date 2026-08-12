// ───────────────────────────────────────────────────────────────────
// MODULE: Fail-Closed Release Readiness Gate
// ───────────────────────────────────────────────────────────────────

import { RuntimeIds } from '../contracts/common.js';
import { createSha256Digest } from '../contracts/exact-original.js';
import { assertHumanCertifiable } from '../evaluation/types.js';
import { deepFreeze } from '../fidelity/freeze.js';
import { ReleaseAbortReasonCodes } from './evidence.js';
import { assessSupportMatrixFreshness } from './support-matrix.js';

import type { RuntimeId } from '../contracts/common.js';
import type {
  PrivacyCanaryEvidence,
  ReleaseAbort,
  ReleaseAbortReasonCode,
  ReleaseCheckEvidence,
  ReleaseEvidenceInput,
  ReleaseEvidenceInputName,
  ReleaseEvidenceManifest,
  ReleaseEvidenceManifestEntry,
  ReleaseEvidenceManifestReference,
  ReleaseEvidenceReferenceInput,
  ReleaseEvidenceStatus,
  ReleaseReadinessDecision,
  RuntimeSmokeEvidence,
} from './evidence.js';
import type { SupportMatrix as SupportMatrixRecord } from './types.js';

interface EvaluatedEvidence {
  readonly entry: ReleaseEvidenceManifestEntry;
  readonly abort: ReleaseAbort | null;
}

type DatedEvidenceState = 'fresh' | 'invalid' | 'stale';

const REQUIRED_RUNTIMES = Object.values(RuntimeIds) as readonly RuntimeId[];
const SHA256_PATTERN = /^sha256:[a-f0-9]{64}$/u;

/** Assemble every independent release input and block on any unusable evidence. */
export function evaluateReleaseReadiness(
  input: ReleaseEvidenceInput,
  now: string,
): ReleaseReadinessDecision {
  const evaluatedAt = normalizeTimestamp(now);
  const evaluated = [
    evaluateSupportMatrix(input.supportMatrix, now),
    evaluateDoctor(input.doctor, evaluatedAt),
    evaluateRuntimeSmokes(input.runtimeSmokes, evaluatedAt),
    evaluateCheckGroup(
      'provider-contracts',
      input.providerContracts,
      ReleaseAbortReasonCodes.PROVIDER_CONTRACTS_MISSING,
      ReleaseAbortReasonCodes.PROVIDER_CONTRACT_FAILED,
      evaluatedAt,
    ),
    evaluateCheckGroup(
      'fidelity-negative-controls',
      input.fidelityNegativeControls,
      ReleaseAbortReasonCodes.FIDELITY_NEGATIVE_CONTROLS_MISSING,
      ReleaseAbortReasonCodes.FIDELITY_NEGATIVE_CONTROL_FAILED,
      evaluatedAt,
    ),
    evaluatePrivacyCanaries(input.privacyCanaries, evaluatedAt),
    evaluateEvaluation(input.evaluation, evaluatedAt),
    evaluateStrictPacketValidation(input.strictPacketValidation, evaluatedAt),
  ];
  const aborts: ReleaseAbort[] = [];
  if (evaluatedAt === null) {
    aborts.push({
      inputName: 'release-time',
      reasonCode: ReleaseAbortReasonCodes.RELEASE_TIME_INVALID,
    });
  }
  for (const result of evaluated) {
    if (result.abort !== null) {
      aborts.push(result.abort);
    }
  }

  const overallDecision = aborts.length === 0 ? 'release-ready' : 'blocked';
  const manifest = createManifest(
    evaluatedAt,
    overallDecision,
    evaluated.map((result) => result.entry),
  );
  return deepFreeze({
    decisionVersion: 'release-readiness/1.0.0',
    overallDecision,
    aborts,
    manifest,
  });
}

function evaluateSupportMatrix(
  matrix: SupportMatrixRecord | undefined,
  now: string,
): EvaluatedEvidence {
  if (matrix === undefined) {
    return blocked(
      'support-matrix',
      'missing',
      ReleaseAbortReasonCodes.SUPPORT_MATRIX_MISSING,
      [],
      0,
    );
  }
  if (
    matrix.version !== 'support-matrix/1.0.0'
    || !Array.isArray(matrix.rows)
    || matrix.rows.length === 0
    || !SHA256_PATTERN.test(matrix.contentFreeDigest)
  ) {
    return blocked(
      'support-matrix',
      'invalid',
      ReleaseAbortReasonCodes.SUPPORT_MATRIX_INCOMPLETE,
      [],
      Array.isArray(matrix.rows) ? matrix.rows.length : 0,
    );
  }

  const references = matrix.rows.map((row) => ({
    evidenceRef: row.evidenceRef,
    observedAt: row.testedDate,
    expiresAt: row.expiryDate,
  }));
  const freshness = assessSupportMatrixFreshness(matrix, now);
  if (freshness.decision !== 'allow') {
    return blocked(
      'support-matrix',
      'stale',
      ReleaseAbortReasonCodes.SUPPORT_MATRIX_STALE,
      references,
      matrix.rows.length,
    );
  }
  return passed('support-matrix', references, matrix.rows.length);
}

function evaluateDoctor(
  doctor: ReleaseEvidenceInput['doctor'],
  evaluatedAt: string | null,
): EvaluatedEvidence {
  if (doctor === undefined) {
    return blocked('doctor', 'missing', ReleaseAbortReasonCodes.DOCTOR_MISSING, [], 0);
  }
  const referenceFailure = evaluateReferenceFailure('doctor', doctor, evaluatedAt);
  if (referenceFailure !== null) {
    return referenceFailure;
  }
  const result = doctor.result;
  if (
    result.reportVersion !== 'compatibility-doctor/1.0.0'
    || result.overallDecision !== 'ready'
    || result.routeSelection !== 'proposed'
    || result.contentFree !== true
  ) {
    return blocked(
      'doctor',
      'fail',
      ReleaseAbortReasonCodes.DOCTOR_NOT_READY,
      [doctor],
      1,
    );
  }
  return passed('doctor', [doctor], 1);
}

function evaluateRuntimeSmokes(
  smokes: readonly RuntimeSmokeEvidence[] | undefined,
  evaluatedAt: string | null,
): EvaluatedEvidence {
  if (smokes === undefined || smokes.length === 0) {
    return blocked(
      'runtime-smokes',
      'missing',
      ReleaseAbortReasonCodes.RUNTIME_SMOKES_MISSING,
      [],
      0,
    );
  }
  const referenceFailure = evaluateReferencesFailure(
    'runtime-smokes',
    smokes,
    evaluatedAt,
  );
  if (referenceFailure !== null) {
    return referenceFailure;
  }
  const runtimes = smokes.map((smoke) => smoke.runtime);
  const uniqueRuntimes = new Set(runtimes);
  if (
    smokes.length !== REQUIRED_RUNTIMES.length
    || uniqueRuntimes.size !== REQUIRED_RUNTIMES.length
    || REQUIRED_RUNTIMES.some((runtime) => !uniqueRuntimes.has(runtime))
  ) {
    return blocked(
      'runtime-smokes',
      'invalid',
      ReleaseAbortReasonCodes.RUNTIME_SMOKES_INCOMPLETE,
      smokes,
      smokes.length,
    );
  }
  if (smokes.some((smoke) => smoke.status !== 'pass')) {
    return blocked(
      'runtime-smokes',
      'fail',
      ReleaseAbortReasonCodes.RUNTIME_SMOKE_FAILED,
      smokes,
      smokes.length,
    );
  }
  return passed('runtime-smokes', smokes, smokes.length);
}

function evaluateCheckGroup(
  inputName: Extract<ReleaseEvidenceInputName,
    'fidelity-negative-controls' | 'provider-contracts'>,
  checks: readonly ReleaseCheckEvidence[] | undefined,
  missingReason: ReleaseAbortReasonCode,
  failedReason: ReleaseAbortReasonCode,
  evaluatedAt: string | null,
): EvaluatedEvidence {
  if (checks === undefined || checks.length === 0) {
    return blocked(inputName, 'missing', missingReason, [], 0);
  }
  const referenceFailure = evaluateReferencesFailure(inputName, checks, evaluatedAt);
  if (referenceFailure !== null) {
    return referenceFailure;
  }
  if (checks.some((check) => check.status !== 'pass')) {
    return blocked(inputName, 'fail', failedReason, checks, checks.length);
  }
  return passed(inputName, checks, checks.length);
}

function evaluatePrivacyCanaries(
  canaries: readonly PrivacyCanaryEvidence[] | undefined,
  evaluatedAt: string | null,
): EvaluatedEvidence {
  if (canaries === undefined || canaries.length === 0) {
    return blocked(
      'privacy-canaries',
      'missing',
      ReleaseAbortReasonCodes.PRIVACY_CANARIES_MISSING,
      [],
      0,
    );
  }
  const referenceFailure = evaluateReferencesFailure(
    'privacy-canaries',
    canaries,
    evaluatedAt,
  );
  if (referenceFailure !== null) {
    return referenceFailure;
  }
  if (canaries.some((canary) => !Number.isSafeInteger(canary.leakCount)
    || canary.leakCount < 0)) {
    return blocked(
      'privacy-canaries',
      'invalid',
      ReleaseAbortReasonCodes.EVIDENCE_INVALID,
      canaries,
      canaries.length,
    );
  }
  if (canaries.some((canary) => canary.leakCount > 0)) {
    return blocked(
      'privacy-canaries',
      'fail',
      ReleaseAbortReasonCodes.PRIVACY_CANARY_LEAK,
      canaries,
      canaries.length,
    );
  }
  if (canaries.some((canary) => canary.status !== 'pass')) {
    return blocked(
      'privacy-canaries',
      'fail',
      ReleaseAbortReasonCodes.PRIVACY_CANARY_FAILED,
      canaries,
      canaries.length,
    );
  }
  return passed('privacy-canaries', canaries, canaries.length);
}

function evaluateEvaluation(
  evaluation: ReleaseEvidenceInput['evaluation'],
  evaluatedAt: string | null,
): EvaluatedEvidence {
  if (evaluation === undefined) {
    return blocked(
      'evaluation',
      'missing',
      ReleaseAbortReasonCodes.EVALUATION_MISSING,
      [],
      0,
    );
  }
  const referenceFailure = evaluateReferenceFailure(
    'evaluation',
    evaluation,
    evaluatedAt,
  );
  if (referenceFailure !== null) {
    return referenceFailure;
  }

  let isHumanCertifiable = true;
  try {
    assertHumanCertifiable(evaluation.result);
  } catch {
    isHumanCertifiable = false;
  }
  if (
    !isHumanCertifiable
    || evaluation.result.evidenceClass !== 'human'
    || evaluation.result.isProvisional !== false
  ) {
    return blocked(
      'evaluation',
      'provisional',
      ReleaseAbortReasonCodes.EVALUATION_NOT_HUMAN_CERTIFIABLE,
      [evaluation],
      1,
    );
  }
  if (
    evaluation.result.gateVersion !== 'evaluation-release-gate/1.0.0'
    || evaluation.result.status !== 'pass'
    || evaluation.result.releaseApproved !== true
  ) {
    return blocked(
      'evaluation',
      'fail',
      ReleaseAbortReasonCodes.EVALUATION_NOT_APPROVED,
      [evaluation],
      1,
    );
  }
  return passed('evaluation', [evaluation], 1);
}

function evaluateStrictPacketValidation(
  validation: ReleaseCheckEvidence | undefined,
  evaluatedAt: string | null,
): EvaluatedEvidence {
  if (validation === undefined) {
    return blocked(
      'strict-packet-validation',
      'missing',
      ReleaseAbortReasonCodes.STRICT_PACKET_VALIDATION_MISSING,
      [],
      0,
    );
  }
  const referenceFailure = evaluateReferenceFailure(
    'strict-packet-validation',
    validation,
    evaluatedAt,
  );
  if (referenceFailure !== null) {
    return referenceFailure;
  }
  if (validation.status !== 'pass') {
    return blocked(
      'strict-packet-validation',
      'fail',
      ReleaseAbortReasonCodes.STRICT_PACKET_VALIDATION_FAILED,
      [validation],
      1,
    );
  }
  return passed('strict-packet-validation', [validation], 1);
}

function evaluateReferencesFailure(
  inputName: ReleaseEvidenceInputName,
  references: readonly ReleaseEvidenceReferenceInput[],
  evaluatedAt: string | null,
): EvaluatedEvidence | null {
  const states = references.map((reference) => assessDatedEvidence(reference, evaluatedAt));
  if (states.includes('invalid')) {
    return blocked(
      inputName,
      'invalid',
      ReleaseAbortReasonCodes.EVIDENCE_INVALID,
      references,
      references.length,
    );
  }
  if (states.includes('stale')) {
    return blocked(
      inputName,
      'stale',
      ReleaseAbortReasonCodes.EVIDENCE_STALE,
      references,
      references.length,
    );
  }
  return null;
}

function evaluateReferenceFailure(
  inputName: ReleaseEvidenceInputName,
  reference: ReleaseEvidenceReferenceInput,
  evaluatedAt: string | null,
): EvaluatedEvidence | null {
  return evaluateReferencesFailure(inputName, [reference], evaluatedAt);
}

function assessDatedEvidence(
  reference: ReleaseEvidenceReferenceInput,
  evaluatedAt: string | null,
): DatedEvidenceState {
  const observedAt = normalizeTimestamp(reference.observedAt);
  const expiresAt = normalizeTimestamp(reference.expiresAt);
  if (
    evaluatedAt === null
    || reference.evidenceRef.trim().length === 0
    || observedAt === null
    || expiresAt === null
    || observedAt > evaluatedAt
    || expiresAt < observedAt
  ) {
    return 'invalid';
  }
  return evaluatedAt > expiresAt ? 'stale' : 'fresh';
}

function passed(
  inputName: ReleaseEvidenceInputName,
  references: readonly ReleaseEvidenceReferenceInput[],
  resultCount: number,
): EvaluatedEvidence {
  return {
    entry: createEntry(inputName, 'pass', 'passed', references, resultCount),
    abort: null,
  };
}

function blocked(
  inputName: ReleaseEvidenceInputName,
  status: Exclude<ReleaseEvidenceStatus, 'pass'>,
  reasonCode: ReleaseAbortReasonCode,
  references: readonly ReleaseEvidenceReferenceInput[],
  resultCount: number,
): EvaluatedEvidence {
  return {
    entry: createEntry(inputName, status, reasonCode, references, resultCount),
    abort: { inputName, reasonCode },
  };
}

function createEntry(
  inputName: ReleaseEvidenceInputName,
  status: ReleaseEvidenceStatus,
  reasonCode: ReleaseEvidenceManifestEntry['reasonCode'],
  references: readonly ReleaseEvidenceReferenceInput[],
  resultCount: number,
): ReleaseEvidenceManifestEntry {
  return {
    inputName,
    status,
    reasonCode,
    resultCount,
    references: createManifestReferences(references),
  };
}

function createManifestReferences(
  references: readonly ReleaseEvidenceReferenceInput[],
): ReleaseEvidenceManifestReference[] {
  return references.flatMap((reference) => {
    const observedAt = normalizeTimestamp(reference.observedAt);
    const expiresAt = normalizeTimestamp(reference.expiresAt);
    if (reference.evidenceRef.trim().length === 0 || observedAt === null || expiresAt === null) {
      return [];
    }
    return [{
      referenceDigest: createSha256Digest(
        new TextEncoder().encode(reference.evidenceRef),
      ),
      observedAt,
      expiresAt,
    }];
  }).sort(compareManifestReferences);
}

function createManifest(
  evaluatedAt: string | null,
  overallDecision: ReleaseReadinessDecision['overallDecision'],
  entries: readonly ReleaseEvidenceManifestEntry[],
): ReleaseEvidenceManifest {
  const metadata = {
    manifestVersion: 'release-evidence-manifest/1.0.0' as const,
    evaluatedAt,
    overallDecision,
    entries,
  };
  const contentFreeDigest = createSha256Digest(
    new TextEncoder().encode(JSON.stringify(metadata)),
  );
  return deepFreeze({ ...metadata, contentFreeDigest });
}

function normalizeTimestamp(value: string): string | null {
  if (/^\d{4}-\d{2}-\d{2}$/u.test(value)) {
    const timestamp = Date.parse(`${value}T00:00:00.000Z`);
    return !Number.isNaN(timestamp)
      && new Date(timestamp).toISOString().slice(0, 10) === value
      ? `${value}T00:00:00.000Z`
      : null;
  }
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return null;
  }
  const normalized = new Date(timestamp).toISOString();
  return normalized === value ? normalized : null;
}

function compareManifestReferences(
  left: ReleaseEvidenceManifestReference,
  right: ReleaseEvidenceManifestReference,
): number {
  const leftKey = `${left.referenceDigest}:${left.observedAt}:${left.expiresAt}`;
  const rightKey = `${right.referenceDigest}:${right.observedAt}:${right.expiresAt}`;
  return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;
}
