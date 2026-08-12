// ───────────────────────────────────────────────────────────────────
// MODULE: Evaluation Public API
// ───────────────────────────────────────────────────────────────────

export {
  EVALUATION_BASELINE_PLACEHOLDERS,
} from './baselines.js';
export {
  buildMaskedReviewPacket,
  verifyMaskedReviewPacket,
} from './blinding.js';
export {
  EVALUATION_CORPUS_MANIFEST,
  EVALUATION_CORPUS_VERSION,
  createCorpusManifest,
  loadEvaluationCorpus,
  verifyCorpusIntegrity,
} from './corpus.js';
export { runVariancePilot } from './pilot.js';
export {
  MAXIMUM_PAIRED_RATINGS_PER_STRATUM,
  MINIMUM_PAIRED_RATINGS_PER_STRATUM,
  calculatePoweredSampleSize,
} from './power.js';
export {
  assertFrozenPreRegistration,
  freezePreRegistration,
} from './preregistration.js';
export { createRunManifest } from './run-manifest.js';
export {
  evaluateFidelityVeto,
  evaluateFidelityVetoes,
} from './fidelity-veto.js';
export { evaluateDimensionNonInferiority } from './noninferiority.js';
export { evaluateReleaseGate } from './gate.js';
export { createReleaseReport } from './report.js';

export type {
  BaselineComparison,
  EvaluationBaselineRecord,
} from './baselines.js';
export type {
  BlindComparisonInput,
  BlindOrderRecord,
  MaskedPresentation,
  MaskedReviewBundle,
  MaskedReviewPacket,
} from './blinding.js';
export type {
  EvaluationFidelityCandidate,
  EvaluationFidelityVetoDecision,
} from './fidelity-veto.js';
export type {
  BlindReviewerRating,
  DiagnosticEvaluationMetric,
  EvaluateReleaseGateInput,
  ReleaseGateDecision,
  StratumReleaseEvidence,
  StratumReleaseGateDecision,
} from './gate.js';
export type {
  DimensionNonInferiorityInput,
  DimensionNonInferiorityResult,
  PairedConfidenceInterval,
} from './noninferiority.js';
export type {
  CreateReleaseReportInput,
  EvaluationReleaseReport,
  ReleaseReportClaim,
  ReleaseReportDimension,
  ReleaseReportFidelity,
  ReleaseReportOperationalMetrics,
  ReleaseReportStratum,
  StratumOperationalMetricsInput,
} from './report.js';
export type { RunVariancePilotInput } from './pilot.js';
export type {
  PowerAnalysisInput,
  PoweredSampleSize,
} from './power.js';
export type {
  CreatePreRegistrationInput,
  EvaluationStopRules,
  EvaluationStratum,
  FrozenPreRegistration,
  NonInferiorityMargins,
  PresentationTier,
  ReviewerAssignment,
  StratumSamplePlan,
  StratumSamplePlanInput,
} from './preregistration.js';
export type { CreateRunManifestInput } from './run-manifest.js';
export type {
  CorpusManifest,
  EvaluationCase,
  EvaluationCorpus,
  ExpectedProtectedSpan,
  PilotCandidateInput,
  PilotCandidateProducer,
  PilotCandidateScorer,
  PilotSample,
  PilotScoringInput,
  PilotStratum,
  PilotVarianceEstimate,
  RunEnvironmentMetadata,
  RunManifest,
  RunRuntimeMetadata,
} from './types.js';
