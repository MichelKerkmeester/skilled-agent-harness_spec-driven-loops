// ───────────────────────────────────────────────────────────────────
// MODULE: Skill Benchmark Reducers Public API
// ───────────────────────────────────────────────────────────────────

export {
  SKILL_BENCHMARK_EVENT_ROUTING,
  SKILL_BENCHMARK_FOLD_BRANCHES,
  SKILL_BENCHMARK_ORDERING_POLICY_VERSION,
  SKILL_BENCHMARK_PROJECTION_CODEC_VERSION,
  SKILL_BENCHMARK_PROJECTION_FIELD_OWNERSHIP,
  SKILL_BENCHMARK_PROJECTION_SCHEMA_VERSION,
  SKILL_BENCHMARK_REDUCER_ID,
  SKILL_BENCHMARK_REDUCER_SET,
  SKILL_BENCHMARK_REDUCER_SURFACE,
  SKILL_BENCHMARK_REDUCER_VERSION,
  SKILL_BENCHMARK_SPECIFIC_FOLD_BRANCHES,
  createSkillBenchmarkProjectionState,
  foldSkillBenchmarkEvents,
  projectSkillBenchmarkLegacyView,
  reduceSkillBenchmarkVerifiedEvent,
  skillBenchmarkProjectionIntegrityDigest,
  verifySkillBenchmarkReducerSurface,
} from './skill-benchmark-reducer.js';
export {
  SkillBenchmarkReducerError,
  assertSkillBenchmarkLegacyProjection,
  assertSkillBenchmarkProjectionState,
  immutableProjectionClone,
  isDeepFrozenProjection,
} from './skill-benchmark-projection-schema.js';

export type * from './skill-benchmark-projection-types.js';
export type {
  SkillBenchmarkReducerSurface,
} from './skill-benchmark-reducer.js';
