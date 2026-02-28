// ---------------------------------------------------------------
// MODULE: Pipeline Index
// Sprint 5 (R6): Public API for the 4-stage retrieval pipeline
// ---------------------------------------------------------------

export { executePipeline } from './orchestrator';
export type {
  PipelineConfig,
  PipelineResult,
  PipelineRow,
  Stage4ReadonlyRow,
  Stage1Input,
  Stage1Output,
  Stage2Input,
  Stage2Output,
  Stage3Input,
  Stage3Output,
  Stage4Input,
  Stage4Output,
  ScoreSnapshot,
  IntentWeightsConfig,
  ArtifactRoutingConfig,
} from './types';
export { captureScoreSnapshot, verifyScoreInvariant } from './types';
