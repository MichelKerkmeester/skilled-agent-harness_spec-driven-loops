// ───────────────────────────────────────────────────────────────────
// MODULE: Stream-Fold Gauges Public API
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. EXPORTS
// ───────────────────────────────────────────────────────────────────

export { GaugeRegistry } from './gauge-registry.js';
export {
  compareGaugeDark,
  gaugeEvidenceEventDefinitions,
  prepareGaugeComparisonEvidence,
  prepareGaugeResultEvidence,
  recordGaugeEvidence,
} from './gauge-evidence.js';
export {
  replayGauge,
  replayGaugeFromLedger,
} from './gauge-replay.js';
export {
  COST_USAGE_EVENT_TYPE,
  HEALTH_INPUT_EVENT_TYPE,
  NOVELTY_DISPOSITION_EVENT_TYPE,
  PROGRESS_OBLIGATION_EVENT_TYPE,
  PROGRESS_WORK_EVENT_TYPE,
  STANDARD_GAUGE_MANIFEST,
  StandardGaugeIds,
  createStandardGaugeRegistry,
} from './standard-gauges.js';
export {
  StreamFoldGaugeError,
  StreamFoldGaugeErrorCodes,
} from './stream-fold-gauge-errors.js';
export {
  GAUGE_COMPARISON_EVENT_TYPE,
  GAUGE_RESULT_EVENT_TYPE,
  GaugeFamilies,
} from './stream-fold-gauge-types.js';

export type { GaugeLedgerReplayInput } from './gauge-replay.js';
export type { StandardGaugeOptions } from './standard-gauges.js';
export type {
  AcceptedGaugeEvent,
  DarkGaugeComparison,
  DarkGaugeComparisonOutcome,
  GaugeCheckpoint,
  GaugeCheckpointProvenance,
  GaugeCheckpointStatus,
  GaugeComputationMode,
  GaugeDefinition,
  GaugeEvidenceAppendInput,
  GaugeEvidenceAppendResult,
  GaugeEvidenceEnvelopeInput,
  GaugeFamily,
  GaugeFingerprintProjection,
  GaugeRegistryEntry,
  GaugeReplayInput,
  GaugeReplayOutcome,
  GaugeResultEnvelope,
  GaugeUnknownEventPolicy,
  LegacyGaugeSurface,
} from './stream-fold-gauge-types.js';
export type {
  StreamFoldGaugeErrorCode,
  StreamFoldGaugeErrorPhase,
} from './stream-fold-gauge-errors.js';
