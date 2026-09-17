// ───────────────────────────────────────────────────────────────────
// MODULE: Observability Public API
// ───────────────────────────────────────────────────────────────────

export {
  createAssemblyTelemetryEvent,
  createCoreTelemetryEvent,
  emitCoreTelemetry,
} from './emitter.js';
export { aggregateLifecycleEvents } from './aggregation.js';
export {
  createRotatingCorrelationDigest,
  verifyCorrelationRotationUnlinkability,
} from './correlation.js';
export {
  createTelemetryExport,
  inspectTelemetryExport,
} from './export.js';
export {
  REDACTION_CANARIES,
  assertNoRedactionCanaryLeak,
  scanForRedactionCanaries,
} from './redaction.js';

export type {
  AssemblyTelemetryOptions,
  CoreTelemetryInput,
  EmittedTelemetry,
  SuppressedTelemetry,
  TelemetryCorrelationInput,
  TelemetryEmissionResult,
  TelemetrySink,
} from './emitter.js';
export type {
  AggregationCounters,
  AggregationRates,
  ObservabilityAggregate,
  PresentationTierAggregationBucket,
  RuntimeAggregationBucket,
  RuntimeTierAggregationBucket,
} from './aggregation.js';
export type {
  CorrelationCoordinates,
  CorrelationDigestResult,
  CorrelationRotationOptions,
  CorrelationUnlinkabilityResult,
  CreatedCorrelationDigest,
  RejectedCorrelationDigest,
} from './correlation.js';
export type {
  DisabledTelemetryExport,
  EnabledTelemetryExport,
  TelemetryExportFinding,
  TelemetryExportInspection,
  TelemetryExportOptions,
  TelemetryExportResult,
} from './export.js';
export type {
  RedactionCanary,
  RedactionCanaryFinding,
} from './redaction.js';
