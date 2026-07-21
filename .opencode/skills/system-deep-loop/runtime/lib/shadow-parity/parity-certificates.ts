// ───────────────────────────────────────────────────────────────────
// MODULE: Shadow Parity Certificates
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  SHADOW_PARITY_SCHEMA_VERSION,
  TRANSITION_ROLLBACK_MINIMUM_DAYS,
  TRANSITION_ROLLBACK_MINIMUM_SUCCESSFUL_RUNS,
} from './shadow-parity-types.js';

import type { JsonObject, JsonValue } from '../event-envelope/index.js';
import type {
  ParityCaseManifest,
  ParityCertificate,
  ParityCertificateBindings,
  ParityCertificateIssuanceResult,
  ParityCertificateRefusal,
  ParityCertificateRefusalCode,
  ParityCertificateVerificationResult,
  ShadowParityCaseResult,
} from './shadow-parity-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────────

interface ParityCertificateCore {
  readonly schema_version: typeof SHADOW_PARITY_SCHEMA_VERSION;
  readonly mode: string;
  readonly base_sha: string;
  readonly manifest_digest: string;
  readonly case_ids: string[];
  readonly case_evidence_digests: string[];
  readonly reference_set_digests: string[];
  readonly attestation_final_digests: string[];
  readonly bindings: ParityCertificateBindings;
  readonly evidence_digest: string;
  readonly open_divergence_count: 0;
  readonly authority_state: 'legacy_authoritative';
  readonly authority_mutation: false;
  readonly rollback_minimum_days: typeof TRANSITION_ROLLBACK_MINIMUM_DAYS;
  readonly rollback_minimum_successful_runs:
    typeof TRANSITION_ROLLBACK_MINIMUM_SUCCESSFUL_RUNS;
}

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonValue));
}

function refusal(
  code: ParityCertificateRefusalCode,
  message: string,
  expectedDigest: string | null = null,
  actualDigest: string | null = null,
): ParityCertificateRefusal {
  return Object.freeze({ code, message, expectedDigest, actualDigest });
}

function sortedUnique(values: readonly string[]): string[] {
  return Array.from(new Set(values)).sort((left, right) => left.localeCompare(right));
}

function certificateCore(
  certificate: ParityCertificateCore,
): ParityCertificateCore {
  return Object.freeze({
    schema_version: certificate.schema_version,
    mode: certificate.mode,
    base_sha: certificate.base_sha,
    manifest_digest: certificate.manifest_digest,
    case_ids: Object.freeze([...certificate.case_ids]) as unknown as string[],
    case_evidence_digests: Object.freeze([
      ...certificate.case_evidence_digests,
    ]) as unknown as string[],
    reference_set_digests: Object.freeze([
      ...certificate.reference_set_digests,
    ]) as unknown as string[],
    attestation_final_digests: Object.freeze([
      ...certificate.attestation_final_digests,
    ]) as unknown as string[],
    bindings: Object.freeze({ ...certificate.bindings }),
    evidence_digest: certificate.evidence_digest,
    open_divergence_count: 0,
    authority_state: 'legacy_authoritative',
    authority_mutation: false,
    rollback_minimum_days: TRANSITION_ROLLBACK_MINIMUM_DAYS,
    rollback_minimum_successful_runs:
      TRANSITION_ROLLBACK_MINIMUM_SUCCESSFUL_RUNS,
  });
}

function requiredCaseIds(manifest: ParityCaseManifest, mode: string): string[] {
  return manifest.cases
    .filter((entry) => entry.mode === mode)
    .map((entry) => entry.caseId)
    .sort((left, right) => left.localeCompare(right));
}

// ───────────────────────────────────────────────────────────────────
// 2. CERTIFICATE ISSUANCE
// ───────────────────────────────────────────────────────────────────

/** Issue immutable parity evidence only for a complete zero-divergence mode set. */
export function issueParityCertificate(input: Readonly<{
  manifest: ParityCaseManifest;
  mode: string;
  caseResults: readonly ShadowParityCaseResult[];
  bindings: ParityCertificateBindings;
}>): ParityCertificateIssuanceResult {
  const requiredIds = requiredCaseIds(input.manifest, input.mode);
  if (input.manifest.caseCount === 0 || requiredIds.length === 0) {
    return Object.freeze({
      ok: false,
      refusal: refusal(
        'ZERO_DISCOVERY',
        'Parity certificate requires a non-zero closed mode case set',
      ),
    });
  }

  const resultsByCase = new Map<string, ShadowParityCaseResult>();
  for (const result of input.caseResults) {
    const existing = resultsByCase.get(result.caseId);
    if (existing) {
      const existingDigest = existing.ok
        ? existing.evidenceDigest
        : existing.divergence.divergenceId;
      const presentedDigest = result.ok
        ? result.evidenceDigest
        : result.divergence.divergenceId;
      if (existingDigest !== presentedDigest || existing.ok !== result.ok) {
        return Object.freeze({
          ok: false,
          refusal: refusal(
            'DUPLICATE_CONFLICT',
            'One parity case identity was presented with conflicting evidence',
            existingDigest,
            presentedDigest,
          ),
        });
      }
      continue;
    }
    resultsByCase.set(result.caseId, result);
  }

  for (const [caseId, result] of resultsByCase) {
    if (!requiredIds.includes(caseId) || result.mode !== input.mode) {
      return Object.freeze({
        ok: false,
        refusal: refusal(
          'WRONG_MODE',
          'Parity evidence contains a case outside the requested mode closure',
        ),
      });
    }
  }
  if (
    resultsByCase.size !== requiredIds.length
    || requiredIds.some((caseId) => !resultsByCase.has(caseId))
  ) {
    return Object.freeze({
      ok: false,
      refusal: refusal(
        'PARTIAL_CASE_SET',
        'Parity certificate requires every case in the closed mode manifest',
        digest(requiredIds),
        digest(Array.from(resultsByCase.keys()).sort()),
      ),
    });
  }

  const passes = [];
  for (const caseId of requiredIds) {
    const result = resultsByCase.get(caseId);
    if (!result || !result.ok) {
      return Object.freeze({
        ok: false,
        refusal: refusal(
          'OPEN_DIVERGENCE',
          'A mode with any unresolved divergence cannot be parity-passed',
          null,
          result && !result.ok ? result.divergence.divergenceId : null,
        ),
      });
    }
    if (
      result.openDivergenceCount !== 0
      || result.authorityMutation
      || result.authorityState !== 'legacy_authoritative'
      || result.runs.length < 2
    ) {
      return Object.freeze({
        ok: false,
        refusal: refusal(
          'UNVERIFIABLE',
          'Parity pass evidence is incomplete or claims an authority mutation',
        ),
      });
    }
    passes.push(result);
  }

  const caseEvidenceDigests = passes.map((entry) => entry.evidenceDigest);
  const referenceSetDigests = sortedUnique(
    passes.map((entry) => entry.referenceSetDigest),
  );
  const attestationFinalDigests = sortedUnique(passes.flatMap((entry) => (
    entry.runs.flatMap((run) => [
      run.legacy.finalDigest,
      run.dark.finalDigest,
    ])
  )));
  const evidenceDigest = digest({
    case_ids: requiredIds,
    case_evidence_digests: caseEvidenceDigests,
    reference_set_digests: referenceSetDigests,
    attestation_final_digests: attestationFinalDigests,
  });
  const core = certificateCore({
    schema_version: SHADOW_PARITY_SCHEMA_VERSION,
    mode: input.mode,
    base_sha: input.manifest.baseSha,
    manifest_digest: input.manifest.manifestDigest,
    case_ids: requiredIds,
    case_evidence_digests: caseEvidenceDigests,
    reference_set_digests: referenceSetDigests,
    attestation_final_digests: attestationFinalDigests,
    bindings: Object.freeze({ ...input.bindings }),
    evidence_digest: evidenceDigest,
    open_divergence_count: 0,
    authority_state: 'legacy_authoritative',
    authority_mutation: false,
    rollback_minimum_days: TRANSITION_ROLLBACK_MINIMUM_DAYS,
    rollback_minimum_successful_runs:
      TRANSITION_ROLLBACK_MINIMUM_SUCCESSFUL_RUNS,
  });
  const certificate: ParityCertificate = Object.freeze({
    ...core,
    certificate_digest: digest(core),
  });
  return Object.freeze({ ok: true, certificate });
}

// ───────────────────────────────────────────────────────────────────
// 3. FRESHNESS VERIFICATION
// ───────────────────────────────────────────────────────────────────

/** Verify integrity and freshness without exposing an authority transition seam. */
export function verifyParityCertificate(
  certificate: ParityCertificate | null,
  expected: Readonly<{
    manifest: ParityCaseManifest;
    mode: string;
    bindings: ParityCertificateBindings;
    caseEvidenceDigests: readonly string[];
    referenceSetDigests: readonly string[];
    attestationFinalDigests: readonly string[];
  }>,
): ParityCertificateVerificationResult {
  if (!certificate) {
    return Object.freeze({
      ok: false,
      refusal: refusal('UNVERIFIABLE', 'Parity certificate is missing'),
    });
  }
  const suppliedCore = certificateCore(certificate);
  const calculatedDigest = digest(suppliedCore);
  if (calculatedDigest !== certificate.certificate_digest) {
    return Object.freeze({
      ok: false,
      refusal: refusal(
        'UNVERIFIABLE',
        'Parity certificate commitment does not match its canonical fields',
        calculatedDigest,
        certificate.certificate_digest,
      ),
    });
  }
  if (certificate.mode !== expected.mode) {
    return Object.freeze({
      ok: false,
      refusal: refusal('WRONG_MODE', 'Parity certificate is bound to another mode'),
    });
  }
  const requiredIds = requiredCaseIds(expected.manifest, expected.mode);
  if (
    requiredIds.length === 0
    || digest(requiredIds) !== digest(certificate.case_ids)
  ) {
    return Object.freeze({
      ok: false,
      refusal: refusal(
        'PARTIAL_CASE_SET',
        'Parity certificate case closure does not match the current manifest',
        digest(requiredIds),
        digest(certificate.case_ids),
      ),
    });
  }
  const actualEvidenceDigest = digest({
    case_ids: certificate.case_ids,
    case_evidence_digests: certificate.case_evidence_digests,
    reference_set_digests: certificate.reference_set_digests,
    attestation_final_digests: certificate.attestation_final_digests,
  });
  if (actualEvidenceDigest !== certificate.evidence_digest) {
    return Object.freeze({
      ok: false,
      refusal: refusal(
        'UNVERIFIABLE',
        'Parity certificate evidence commitment does not match its evidence fields',
        actualEvidenceDigest,
        certificate.evidence_digest,
      ),
    });
  }
  const expectedEvidenceDigest = digest({
    case_ids: requiredIds,
    case_evidence_digests: expected.caseEvidenceDigests,
    reference_set_digests: sortedUnique(expected.referenceSetDigests),
    attestation_final_digests: sortedUnique(expected.attestationFinalDigests),
  });
  const expectedFreshness: JsonObject = {
    base_sha: expected.manifest.baseSha,
    manifest_digest: expected.manifest.manifestDigest,
    bindings: expected.bindings,
  };
  const actualFreshness: JsonObject = {
    base_sha: certificate.base_sha,
    manifest_digest: certificate.manifest_digest,
    bindings: certificate.bindings,
  };
  const expectedDigest = digest(expectedFreshness);
  const actualDigest = digest(actualFreshness);
  if (expectedDigest !== actualDigest) {
    return Object.freeze({
      ok: false,
      refusal: refusal(
        'STALE_EVIDENCE',
        'Parity certificate is stale for the current baseline, manifest, or code contracts',
        expectedDigest,
        actualDigest,
      ),
    });
  }
  if (expectedEvidenceDigest !== actualEvidenceDigest) {
    return Object.freeze({
      ok: false,
      refusal: refusal(
        'STALE_EVIDENCE',
        'Parity certificate is stale for the current sealed inputs or replay evidence',
        expectedEvidenceDigest,
        actualEvidenceDigest,
      ),
    });
  }
  if (
    certificate.open_divergence_count !== 0
    || certificate.authority_mutation
    || certificate.authority_state !== 'legacy_authoritative'
    || certificate.rollback_minimum_days !== TRANSITION_ROLLBACK_MINIMUM_DAYS
    || certificate.rollback_minimum_successful_runs
      !== TRANSITION_ROLLBACK_MINIMUM_SUCCESSFUL_RUNS
    || certificate.case_evidence_digests.length !== requiredIds.length
    || certificate.reference_set_digests.length === 0
    || certificate.attestation_final_digests.length === 0
    || digest(certificate.reference_set_digests)
      !== digest(sortedUnique(certificate.reference_set_digests))
    || digest(certificate.attestation_final_digests)
      !== digest(sortedUnique(certificate.attestation_final_digests))
  ) {
    return Object.freeze({
      ok: false,
      refusal: refusal(
        'UNVERIFIABLE',
        'Parity certificate does not contain complete shadow-only evidence',
      ),
    });
  }
  return Object.freeze({
    ok: true,
    certificateDigest: certificate.certificate_digest,
  });
}
