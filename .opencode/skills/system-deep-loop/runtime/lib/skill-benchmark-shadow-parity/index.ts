// ───────────────────────────────────────────────────────────────────
// MODULE: Skill Benchmark Shadow Parity Public API
// ───────────────────────────────────────────────────────────────────

export {
  SKILL_BENCHMARK_COMPARATOR_VERSION,
  SKILL_BENCHMARK_LIFECYCLE_EVENT_MAP,
  SKILL_BENCHMARK_MODE_GATE_INPUT_VERSION,
  SKILL_BENCHMARK_PARITY_PROJECTION_VERSION,
  SKILL_BENCHMARK_REQUIRED_FIXTURE_SCENARIOS,
  SKILL_BENCHMARK_SHADOW_PARITY_SCHEMA_VERSION,
  SKILL_BENCHMARK_SHARED_PARITY_SERVICES,
  SKILL_BENCHMARK_VOLATILITY_ALLOWLIST,
  SkillBenchmarkResumeParityDivergenceError,
  canonicalizeSkillBenchmarkEventStream,
  compareSkillBenchmarkEventStreams,
  compileSkillBenchmarkParityManifest,
  createSkillBenchmarkLegacyResumeOracle,
  createSkillBenchmarkModeGateInput,
  createSkillBenchmarkParityCaseDefinition,
  createSkillBenchmarkParityExecutors,
  driveSkillBenchmarkResumeParity,
  skillBenchmarkParityInitialStateDigest,
  parseSkillBenchmarkModeGateInput,
  parseSkillBenchmarkParityReceipt,
  runSkillBenchmarkParityCase,
  runSkillBenchmarkParitySuite,
  verifySkillBenchmarkLifecycleEventMap,
  verifySkillBenchmarkParityModeCertificate,
} from './harness-adapter.js';

export type * from './types.js';
