// ───────────────────────────────────────────────────────────────────
// MODULE: Model Benchmark Shadow Parity Public API
// ───────────────────────────────────────────────────────────────────

export {
  MODEL_BENCHMARK_COMPARATOR_VERSION,
  MODEL_BENCHMARK_LIFECYCLE_EVENT_MAP,
  MODEL_BENCHMARK_MODE_GATE_INPUT_VERSION,
  MODEL_BENCHMARK_PARITY_PROJECTION_VERSION,
  MODEL_BENCHMARK_REQUIRED_FIXTURE_SCENARIOS,
  MODEL_BENCHMARK_SHADOW_PARITY_SCHEMA_VERSION,
  MODEL_BENCHMARK_SHARED_PARITY_SERVICES,
  MODEL_BENCHMARK_VOLATILITY_ALLOWLIST,
  ModelBenchmarkResumeParityDivergenceError,
  canonicalizeModelBenchmarkEventStream,
  compareModelBenchmarkEventStreams,
  compileModelBenchmarkParityManifest,
  createModelBenchmarkLegacyResumeOracle,
  createModelBenchmarkModeGateInput,
  createModelBenchmarkParityCaseDefinition,
  createModelBenchmarkParityExecutors,
  driveModelBenchmarkResumeParity,
  modelBenchmarkParityInitialStateDigest,
  parseModelBenchmarkModeGateInput,
  parseModelBenchmarkParityReceipt,
  runModelBenchmarkParityCase,
  runModelBenchmarkParitySuite,
  verifyModelBenchmarkLifecycleEventMap,
  verifyModelBenchmarkParityModeCertificate,
} from './harness-adapter.js';

export type * from './types.js';
