// ───────────────────────────────────────────────────────────────────
// MODULE: Evaluation Artifact Types
// ───────────────────────────────────────────────────────────────────

import type {
  FixtureProvenance,
  PrivacyClass,
  RuntimeId,
} from '../contracts/index.js';
import type { ProtectedSpanKind } from '../fidelity/types.js';

/** Origin of subjective reviewer evidence used by an evaluation decision. */
export type EvidenceClass = 'human' | 'llm-proxy';

/** Provenance fields carried by any result that might be presented as release evidence. */
export interface EvidenceProvenance {
  readonly evidenceClass: EvidenceClass;
  readonly isProvisional: boolean;
}

/** Resolve mixed reviewer evidence conservatively to proxy provenance. */
export function resolveEvidenceClass(
  evidenceClasses: readonly EvidenceClass[],
): EvidenceClass {
  return evidenceClasses.includes('llm-proxy') ? 'llm-proxy' : 'human';
}

/** Refuse provisional evidence at a human-certification boundary. */
export function assertHumanCertifiable<T extends EvidenceProvenance>(
  result: T,
): asserts result is T & { readonly evidenceClass: 'human'; readonly isProvisional: false } {
  if (result.evidenceClass === 'llm-proxy') {
    throw new TypeError('LLM proxy evidence is PROVISIONAL and cannot be human-certified.');
  }
  if (result.isProvisional) {
    throw new TypeError('Provisional evidence cannot be human-certified.');
  }
}

/** Content-free expectation for protected span coverage in one case. */
export interface ExpectedProtectedSpan {
  readonly kind: ProtectedSpanKind;
  readonly count: number;
}

/** One synthetic, versioned evaluation case without prompt or response content. */
export interface EvaluationCase {
  readonly id: string;
  readonly provenance: FixtureProvenance;
  readonly category: string;
  readonly expectedProtectedSpans: readonly ExpectedProtectedSpan[];
  readonly privacyClass: PrivacyClass;
  readonly corpusVersion: string;
}

/** Integrity metadata for a content-free evaluation corpus. */
export interface CorpusManifest {
  readonly corpusVersion: string;
  readonly caseCount: number;
  readonly contentFreeDigest: string;
}

/** Immutable corpus returned after its pinned metadata passes validation. */
export interface EvaluationCorpus {
  readonly manifest: CorpusManifest;
  readonly cases: readonly EvaluationCase[];
}

/** Host metadata recorded without environment variables or process arguments. */
export interface RunEnvironmentMetadata {
  readonly nodeVersion: string;
  readonly platform: string;
  readonly architecture: string;
}

/** Runtime coordinates needed to reproduce one evaluation route. */
export interface RunRuntimeMetadata {
  readonly runtimeId: RuntimeId;
  readonly runtimeVersion: string;
  readonly protocolVersion: string;
  readonly pathId: string;
}

/** Deterministic run description containing no source or candidate content. */
export interface RunManifest {
  readonly manifestVersion: 'evaluation-run/1.0.0';
  readonly corpusVersion: string;
  readonly corpusDigest: string;
  readonly caseOrder: readonly string[];
  readonly seed: string;
  readonly environment: RunEnvironmentMetadata;
  readonly runtime: RunRuntimeMetadata;
  readonly reproducibilityDigest: string;
}

/** One provider-model and prompt-profile pilot stratum. */
export interface PilotStratum {
  readonly providerId: string;
  readonly modelId: string;
  readonly promptProfileId: string;
}

/** Deterministic coordinates passed to an injected fixture producer. */
export interface PilotCandidateInput extends PilotStratum {
  readonly evaluationCase: EvaluationCase;
  readonly sampleIndex: number;
}

/** Candidate producer used only in memory during the variance pilot. */
export type PilotCandidateProducer = (
  input: PilotCandidateInput,
) => Promise<string> | string;

/** Ephemeral scorer input whose candidate is never copied into an artifact. */
export interface PilotScoringInput extends PilotCandidateInput {
  readonly candidate: string;
}

/** Numeric scorer applied to one injected candidate. */
export type PilotCandidateScorer = (
  input: PilotScoringInput,
) => Promise<number> | number;

/** Content-free numeric observation retained from one pilot repetition. */
export interface PilotSample extends PilotStratum {
  readonly caseId: string;
  readonly sampleIndex: number;
  readonly score: number;
}

/** Sample variance for one provider-model and prompt-profile stratum. */
export interface PilotVarianceEstimate extends PilotStratum {
  readonly estimateVersion: 'pilot-variance/1.0.0';
  readonly purpose: 'variance-planning-only';
  readonly sampleCount: number;
  readonly mean: number;
  readonly variance: number;
  readonly samples: readonly PilotSample[];
}
