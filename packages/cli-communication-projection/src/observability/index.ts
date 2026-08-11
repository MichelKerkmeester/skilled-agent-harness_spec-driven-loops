// ───────────────────────────────────────────────────────────────────
// MODULE: Observability Public API
// ───────────────────────────────────────────────────────────────────

export {
  createAssemblyTelemetryEvent,
  createCoreTelemetryEvent,
  emitCoreTelemetry,
} from './emitter.js';

export type {
  AssemblyTelemetryOptions,
  CoreTelemetryInput,
  EmittedTelemetry,
  SuppressedTelemetry,
  TelemetryCorrelationInput,
  TelemetryEmissionResult,
  TelemetrySink,
} from './emitter.js';
