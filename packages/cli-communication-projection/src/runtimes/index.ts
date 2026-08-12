// ───────────────────────────────────────────────────────────────────
// MODULE: Runtime Adapters Public API
// ───────────────────────────────────────────────────────────────────

export {
  assertRuntimeAdapterConformance,
  mapRuntimeGeneration,
} from './adapter.js';
export {
  assessRuntimeCompatibility,
  mapRuntimeCapability,
} from './capability.js';
export {
  ClaudeCapabilityRecords,
  ClaudeEventTypes,
  ClaudeRuntimePaths,
  claudeRuntimeAdapter,
  createClaudeRuntimeAdapter,
} from './claude.js';
export { RuntimeAdapterReasonCodes } from './types.js';

export type {
  RuntimeAdapter,
  RuntimeConformanceCase,
  RuntimeConformanceInput,
  RuntimeConformanceReport,
} from './adapter.js';
export type { RuntimeCompatibility } from './capability.js';
export type {
  ClaudeExtensionEvent,
  ClaudeMessageDisplayEvent,
  ClaudeRuntimeEvent,
  ClaudeTerminalEvent,
} from './claude.js';
export type {
  DegradationMode,
  PresentationTier,
  RuntimeAdapterInput,
  RuntimeAdapterReasonCode,
  RuntimeAdapterResult,
  RuntimeCanonicalState,
  RuntimeCapabilityClaim,
  RuntimeCapabilityEvidence,
  RuntimeCapabilityInput,
  RuntimeCapabilityRecord,
  RuntimeCapabilityState,
  RuntimeDegradedPresentation,
  RuntimeEnvelope,
  RuntimeExactOriginalEvent,
  RuntimeExactOriginalPresentation,
  RuntimeExtension,
  RuntimeFailClosedDefaults,
  RuntimeMappedEvent,
  RuntimePresentationInput,
  RuntimePresentationResult,
  RuntimeProjectionPresentation,
  RuntimeTelemetryRecord,
  RuntimeTestedVersions,
} from './types.js';
