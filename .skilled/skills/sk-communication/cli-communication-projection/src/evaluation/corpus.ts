// ───────────────────────────────────────────────────────────────────
// MODULE: Secret-Free Evaluation Corpus
// ───────────────────────────────────────────────────────────────────

import { createSha256Digest } from '../contracts/exact-original.js';
import { PrivacyClasses } from '../contracts/context.js';
import { ProtectedSpanKinds } from '../fidelity/types.js';

import type { FixtureProvenance, PrivacyClass } from '../contracts/index.js';
import type { ProtectedSpanKind } from '../fidelity/types.js';
import type {
  CorpusManifest,
  EvaluationCase,
  EvaluationCorpus,
  ExpectedProtectedSpan,
} from './types.js';

/** Version pinned to the exact metadata and digest below. */
export const EVALUATION_CORPUS_VERSION = 'evaluation-corpus/1.0.0';

const CAPTURED_AT = '2026-08-12T00:00:00.000Z';
const SHA256_PATTERN = /^sha256:[a-f0-9]{64}$/u;

const CORPUS_CASES: readonly EvaluationCase[] = Object.freeze([
  createCase('concise-command', 'concise-instruction', PrivacyClasses.LOCAL_OFFLINE, [
    span(ProtectedSpanKinds.COMMAND, 1),
    span(ProtectedSpanKinds.FLAG, 2),
    span(ProtectedSpanKinds.PATH, 1),
  ]),
  createCase('structured-warning', 'risk-and-caveat', PrivacyClasses.HOSTED_ZDR, [
    span(ProtectedSpanKinds.HEADING, 1),
    span(ProtectedSpanKinds.INLINE_CODE, 2),
    span(ProtectedSpanKinds.URL, 1),
  ]),
  createCase('recovery-steps', 'ordered-recovery', PrivacyClasses.LOCAL_NETWORKED, [
    span(ProtectedSpanKinds.LIST_MARKER, 3),
    span(ProtectedSpanKinds.IDENTIFIER, 1),
    span(ProtectedSpanKinds.NUMBER, 2),
  ]),
  createCase('configuration-explanation', 'technical-explanation', PrivacyClasses.HOSTED_RETAINED, [
    span(ProtectedSpanKinds.FENCED_CODE, 1),
    span(ProtectedSpanKinds.VARIABLE, 2),
    span(ProtectedSpanKinds.CONFIGURED_LITERAL, 1),
  ]),
  createCase('fallback-boundary', 'exact-original-fallback', PrivacyClasses.UNKNOWN, [
    span(ProtectedSpanKinds.QUOTED_LITERAL, 1),
    span(ProtectedSpanKinds.HASH, 1),
  ]),
]);

/** Pinned manifest; changing any case metadata requires a corpus version update. */
export const EVALUATION_CORPUS_MANIFEST: CorpusManifest = Object.freeze({
  corpusVersion: EVALUATION_CORPUS_VERSION,
  caseCount: CORPUS_CASES.length,
  contentFreeDigest: 'sha256:24f5d2b2ac6efc61bb0998f6360d40eff8d331ce82b338c63cfeb6eef019a861',
});

/** Load the immutable built-in corpus after checking its version and digest. */
export function loadEvaluationCorpus(): EvaluationCorpus {
  if (!verifyCorpusIntegrity(CORPUS_CASES, EVALUATION_CORPUS_MANIFEST)) {
    throw new Error('Built-in evaluation corpus failed its integrity check.');
  }
  return Object.freeze({
    manifest: EVALUATION_CORPUS_MANIFEST,
    cases: CORPUS_CASES,
  });
}

/** Create content-free integrity metadata for caller-owned synthetic cases. */
export function createCorpusManifest(
  cases: readonly EvaluationCase[],
  corpusVersion: string,
): CorpusManifest {
  return Object.freeze({
    corpusVersion,
    caseCount: cases.length,
    contentFreeDigest: createCorpusDigest(cases),
  });
}

/** Verify corpus shape, version consistency, uniqueness, and pinned digest. */
export function verifyCorpusIntegrity(
  cases: readonly EvaluationCase[],
  manifest: CorpusManifest,
): boolean {
  if (
    cases.length === 0
    || manifest.caseCount !== cases.length
    || manifest.corpusVersion.length === 0
    || !SHA256_PATTERN.test(manifest.contentFreeDigest)
  ) {
    return false;
  }
  const caseIds = new Set<string>();
  for (const evaluationCase of cases) {
    if (
      evaluationCase.id.length === 0
      || caseIds.has(evaluationCase.id)
      || evaluationCase.corpusVersion !== manifest.corpusVersion
      || evaluationCase.category.length === 0
      || !isSyntheticProvenance(evaluationCase.provenance)
      || !isPrivacyClass(evaluationCase.privacyClass)
      || evaluationCase.expectedProtectedSpans.length === 0
      || !hasValidSpanExpectations(evaluationCase.expectedProtectedSpans)
    ) {
      return false;
    }
    caseIds.add(evaluationCase.id);
  }
  return createCorpusDigest(cases) === manifest.contentFreeDigest;
}

function createCorpusDigest(cases: readonly EvaluationCase[]): string {
  const canonicalCases = [...cases]
    .sort((left, right) => compareText(left.id, right.id))
    .map((evaluationCase) => ({
      id: evaluationCase.id,
      provenance: {
        sourceFamily: evaluationCase.provenance.sourceFamily,
        sourceVersion: evaluationCase.provenance.sourceVersion,
        captureMethod: evaluationCase.provenance.captureMethod,
        sanitizationStatus: evaluationCase.provenance.sanitizationStatus,
        capturedAt: evaluationCase.provenance.capturedAt,
      },
      category: evaluationCase.category,
      expectedProtectedSpans: [...evaluationCase.expectedProtectedSpans]
        .sort((left, right) => compareText(left.kind, right.kind))
        .map((expectation) => ({ kind: expectation.kind, count: expectation.count })),
      privacyClass: evaluationCase.privacyClass,
      corpusVersion: evaluationCase.corpusVersion,
    }));
  return createSha256Digest(new TextEncoder().encode(JSON.stringify(canonicalCases)));
}

function createCase(
  id: string,
  category: string,
  privacyClass: PrivacyClass,
  expectedProtectedSpans: readonly ExpectedProtectedSpan[],
): EvaluationCase {
  const provenance: FixtureProvenance = Object.freeze({
    sourceFamily: 'portable-cli-synthetic-evaluation',
    sourceVersion: '1.0.0',
    captureMethod: 'synthetic',
    sanitizationStatus: 'synthetic',
    capturedAt: CAPTURED_AT,
  });
  return Object.freeze({
    id,
    provenance,
    category,
    expectedProtectedSpans: Object.freeze([...expectedProtectedSpans]),
    privacyClass,
    corpusVersion: EVALUATION_CORPUS_VERSION,
  });
}

function span(kind: ProtectedSpanKind, count: number): ExpectedProtectedSpan {
  return Object.freeze({ kind, count });
}

function hasValidSpanExpectations(
  expectations: readonly ExpectedProtectedSpan[],
): boolean {
  const kinds = new Set<ProtectedSpanKind>();
  const allowedKinds = Object.values(ProtectedSpanKinds) as readonly ProtectedSpanKind[];
  for (const expectation of expectations) {
    if (
      !allowedKinds.includes(expectation.kind)
      || kinds.has(expectation.kind)
      || !Number.isInteger(expectation.count)
      || expectation.count < 1
    ) {
      return false;
    }
    kinds.add(expectation.kind);
  }
  return true;
}

function isSyntheticProvenance(provenance: FixtureProvenance): boolean {
  return provenance.captureMethod === 'synthetic'
    && provenance.sanitizationStatus === 'synthetic'
    && provenance.sourceFamily.length > 0
    && provenance.sourceVersion.length > 0
    && provenance.capturedAt.length > 0;
}

function isPrivacyClass(value: PrivacyClass): boolean {
  return (Object.values(PrivacyClasses) as readonly PrivacyClass[]).includes(value);
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}
