// ───────────────────────────────────────────────────────────────────
// MODULE: Path Coverage Termination Public API
// ───────────────────────────────────────────────────────────────────

export { evaluatePathCoverageTermination } from './evaluator.js';
export {
  MODE_COVERAGE_PROFILES,
  ModeCoverageProfileError,
  ModeCoverageProfileRegistry,
  modeCoverageProfiles,
  validateModeCoverageProfile,
} from './profiles.js';
export {
  createEmptyPathCoverageProjection,
  reducePathCoverage,
} from './reducer.js';
export { createPathCoverageShadowEvaluation } from './shadow.js';
export {
  compileCoverageUniverse,
  isCoverageCertificateCurrent,
  mintSuccessorCoverageUniverse,
  validateCoverageUniverse,
} from './universe.js';
export {
  COVERAGE_UNIVERSE_SCHEMA_VERSION,
  PATH_COVERAGE_PROJECTION_VERSION,
  PATH_COVERAGE_SCHEMA_VERSION,
} from './types.js';

export type * from './types.js';
