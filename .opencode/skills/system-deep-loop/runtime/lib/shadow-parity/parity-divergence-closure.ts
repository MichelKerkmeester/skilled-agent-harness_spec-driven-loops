// ───────────────────────────────────────────────────────────────────
// MODULE: Shadow Parity Divergence Closure
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import { SHADOW_PARITY_SCHEMA_VERSION } from './shadow-parity-types.js';

import type { JsonValue } from '../event-envelope/index.js';
import type {
  ParityDivergenceClosureResult,
  ParityDivergenceRecord,
  ShadowParityCaseResult,
} from './shadow-parity-types.js';

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value as JsonValue));
}

/** Close evidence only after the complete affected case set reruns green. */
export function closeParityDivergence(input: Readonly<{
  divergence: ParityDivergenceRecord;
  requiredCaseIds: readonly string[];
  rerunResults: readonly ShadowParityCaseResult[];
}>): ParityDivergenceClosureResult {
  const requiredCaseIds = Array.from(new Set(input.requiredCaseIds)).sort();
  const results = new Map(input.rerunResults.map((result) => [result.caseId, result]));
  if (
    requiredCaseIds.length === 0
    || results.size !== requiredCaseIds.length
    || requiredCaseIds.some((caseId) => !results.has(caseId))
  ) {
    return Object.freeze({
      ok: false,
      refusal: Object.freeze({
        code: 'PARTIAL_CASE_SET' as const,
        message: 'Divergence closure requires the complete affected case set',
        expectedDigest: digest(requiredCaseIds),
        actualDigest: digest(Array.from(results.keys()).sort()),
      }),
    });
  }
  const passes = requiredCaseIds.map((caseId) => results.get(caseId));
  if (passes.some((result) => (
    !result
    || !result.ok
    || result.openDivergenceCount !== 0
    || result.mode !== input.divergence.mode
    || result.authorityMutation
  ))) {
    return Object.freeze({
      ok: false,
      refusal: Object.freeze({
        code: 'OPEN_DIVERGENCE' as const,
        message: 'Assignment or reproduction cannot close divergence without a green rerun',
        expectedDigest: null,
        actualDigest: input.divergence.divergenceId,
      }),
    });
  }
  const rerunEvidenceDigests = passes.map((result) => (
    result && result.ok ? result.evidenceDigest : ''
  ));
  const core = Object.freeze({
    schema_version: SHADOW_PARITY_SCHEMA_VERSION,
    divergence_id: input.divergence.divergenceId,
    case_id: input.divergence.caseId,
    mode: input.divergence.mode,
    required_case_ids: requiredCaseIds,
    rerun_evidence_digests: rerunEvidenceDigests,
    status: 'closed' as const,
  });
  return Object.freeze({
    ok: true,
    closure: Object.freeze({
      ...core,
      closure_digest: digest(core),
    }),
  });
}
