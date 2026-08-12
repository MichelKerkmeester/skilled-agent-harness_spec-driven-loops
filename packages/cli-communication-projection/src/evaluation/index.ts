// ───────────────────────────────────────────────────────────────────
// MODULE: Evaluation Public API
// ───────────────────────────────────────────────────────────────────

export {
  EVALUATION_BASELINE_PLACEHOLDERS,
} from './baselines.js';
export {
  EVALUATION_CORPUS_MANIFEST,
  EVALUATION_CORPUS_VERSION,
  createCorpusManifest,
  loadEvaluationCorpus,
  verifyCorpusIntegrity,
} from './corpus.js';
export { runVariancePilot } from './pilot.js';
export { createRunManifest } from './run-manifest.js';

export type {
  BaselineComparison,
  EvaluationBaselineRecord,
} from './baselines.js';
export type { RunVariancePilotInput } from './pilot.js';
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

