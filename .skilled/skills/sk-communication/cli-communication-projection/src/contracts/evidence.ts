// ───────────────────────────────────────────────────────────────────
// MODULE: Telemetry, Benchmark, and Evaluation Contracts
// ───────────────────────────────────────────────────────────────────

import type { ContractHeader, RuntimeId } from './common.js';
import type { PrivacyClass } from './context.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Content-free byte counters for one projection lifecycle event. */
export interface TelemetryByteCounts {
  readonly input: number;
  readonly output: number;
}

/** Content-free timing counters for one projection lifecycle event. */
export interface TelemetryDurations {
  readonly assemblyMs: number;
  readonly providerMs: number;
  readonly validationMs: number;
  readonly totalMs: number;
}

/** Allowlisted content-free observability event. */
export interface TelemetryEvent extends ContractHeader {
  readonly contractKind: 'telemetry';
  readonly eventName: TelemetryEventName;
  readonly runtime: RuntimeId;
  readonly providerId: string | null;
  readonly modelId: string | null;
  readonly privacyClass: PrivacyClass;
  readonly outcome: 'accepted' | 'exact-original' | 'rejected';
  readonly reasonCode: TelemetryReasonCode;
  readonly durations: TelemetryDurations;
  readonly byteCounts: TelemetryByteCounts;
  readonly attemptCount: number;
  readonly correlationDigest: string | null;
  readonly keyRotationId: string | null;
}

/** Machine and runtime context required for reproducible measurements. */
export interface BenchmarkEnvironment {
  readonly platform: string;
  readonly release: string;
  readonly architecture: string;
  readonly cpu: string;
  readonly logicalCpuCount: number;
  readonly totalMemoryBytes: number;
  readonly nodeVersion: string;
  readonly powerMode: string;
}

/** Reproducible latency profile for one benchmark scenario. */
export interface BenchmarkRecord extends ContractHeader {
  readonly contractKind: 'benchmark';
  readonly benchmarkId: string;
  readonly scenario: string;
  readonly environment: BenchmarkEnvironment;
  readonly mode: 'cold' | 'warm';
  readonly warmupRuns: number;
  readonly measuredRuns: number;
  readonly sampleUnit: 'milliseconds';
  readonly p50: number;
  readonly p95: number;
  readonly recordedAt: string;
}

/** Human-review rubric dimension with a bounded score range. */
export interface EvaluationRubricDimension {
  readonly name: EvaluationDimensionName;
  readonly minimumScore: number;
  readonly maximumScore: number;
  readonly blocking: boolean;
}

/** Baseline variance inputs collected before setting parity margins. */
export interface BaselineVarianceInput {
  readonly dimension: EvaluationDimensionName;
  readonly status: 'measured' | 'pending';
  readonly referenceToReference: number | null;
  readonly humanToHuman: number | null;
}

/** Sample-size rule that prevents unbounded or opportunistic evaluation. */
export interface EvaluationSampleSizeRule {
  readonly minimumRepetitions: number;
  readonly minimumPairs: number;
  readonly maximumPairs: number;
  readonly alpha: number;
  readonly power: number;
}

/** One immutable source/reference-output pair in the parity corpus. */
export interface EvaluationCorpusCase {
  readonly caseId: string;
  readonly category: string;
  readonly sourceOriginalId: string;
  readonly referenceOutputId: string;
}

/** Blinded non-inferiority evaluation contract. */
export interface EvaluationManifest extends ContractHeader {
  readonly contractKind: 'evaluation';
  readonly evaluationId: string;
  readonly corpusVersion: string;
  readonly cases: readonly EvaluationCorpusCase[];
  readonly blindOrderManifestId: string;
  readonly reviewerCount: number;
  readonly rubric: readonly EvaluationRubricDimension[];
  readonly baselineVarianceInputs: readonly BaselineVarianceInput[];
  readonly sampleSizeRule: EvaluationSampleSizeRule;
  readonly marginStatus: 'baseline-derived' | 'provisional-zero-tolerance';
  readonly nonInferiorityMargins: Readonly<Record<EvaluationDimensionName, number>>;
  readonly confidenceRule: string;
  readonly inconclusivePolicy: 'block-release' | 'collect-more-until-cap';
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** Content-free lifecycle events permitted in telemetry. */
export const TelemetryEventNames = {
  ASSEMBLY_TERMINAL: 'assembly-terminal',
  PROJECTION_TERMINAL: 'projection-terminal',
  PROVIDER_TERMINAL: 'provider-terminal',
  VALIDATION_TERMINAL: 'validation-terminal',
} as const;

/** Telemetry lifecycle event name. */
export type TelemetryEventName =
  typeof TelemetryEventNames[keyof typeof TelemetryEventNames];

/** Stable content-free reasons permitted at the telemetry boundary. */
export const TelemetryReasonCodes = {
  CANCELLED: 'cancelled',
  EMPTY_OUTPUT: 'empty-output',
  INCOMPLETE_SOURCE: 'incomplete-source',
  INVALID_INPUT: 'invalid-input',
  NONE: 'none',
  PRIVACY_DENIED: 'privacy-denied',
  PROVIDER_ERROR: 'provider-error',
  TIMEOUT: 'timeout',
  UNSUPPORTED_CONTROL: 'unsupported-control',
  UNSUPPORTED_SCHEMA: 'unsupported-schema',
  VALIDATION_REJECTED: 'validation-rejected',
} as const;

/** Content-free telemetry reason. */
export type TelemetryReasonCode =
  typeof TelemetryReasonCodes[keyof typeof TelemetryReasonCodes];

/** Human evaluation dimensions kept separate during scoring. */
export const EvaluationDimensionNames = {
  DIRECTNESS: 'directness',
  FLUENCY: 'fluency',
  MEANING_PRESERVATION: 'meaning-preservation',
  REFERENCE_LIKENESS: 'reference-likeness',
} as const;

/** Human evaluation dimension. */
export type EvaluationDimensionName =
  typeof EvaluationDimensionNames[keyof typeof EvaluationDimensionNames];
