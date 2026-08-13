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
export {
  CodexCapabilityRecords,
  CodexEventTypes,
  CodexRuntimePaths,
  codexRuntimeAdapter,
  createCodexRuntimeAdapter,
} from './codex.js';
export {
  CursorCapabilityRecords,
  CursorEventTypes,
  CursorRuntimePaths,
  createCursorRuntimeAdapter,
  cursorRuntimeAdapter,
} from './cursor.js';
export {
  DevinCapabilityRecords,
  DevinEventTypes,
  DevinRuntimePaths,
  createDevinRuntimeAdapter,
  devinRuntimeAdapter,
} from './devin.js';
export {
  OpenCodeCapabilityRecords,
  OpenCodeEventTypes,
  OpenCodeRuntimePaths,
  createOpenCodeRuntimeAdapter,
  openCodeRuntimeAdapter,
} from './opencode.js';
export {
  PiCapabilityRecords,
  PiEventTypes,
  PiRuntimePaths,
  createPiRuntimeAdapter,
  piRuntimeAdapter,
  presentPiSynchronousTransform,
} from './pi.js';
export {
  RuntimeCapabilityMatrix,
  createRuntimeCapabilityMatrix,
  resolveRuntimeCapability,
} from './matrix.js';
export { RuntimeAdapterReasonCodes } from './types.js';

export type {
  RuntimeAdapter,
  RuntimeConformanceCase,
  RuntimeConformanceInput,
  RuntimeConformanceReport,
} from './adapter.js';
export type { RuntimeCompatibility } from './capability.js';
export type {
  RuntimeCapabilityMatrixEntry,
  RuntimeCapabilityMatrixResolution,
} from './matrix.js';
export type {
  ClaudeExtensionEvent,
  ClaudeMessageDisplayEvent,
  ClaudeRuntimeEvent,
  ClaudeTerminalEvent,
} from './claude.js';
export type {
  CodexContentEvent,
  CodexExtensionEvent,
  CodexLifecycleEvent,
  CodexRuntimeEvent,
  CodexTerminalEvent,
} from './codex.js';
export type {
  CursorAgentMessageChunkEvent,
  CursorExtensionEvent,
  CursorLifecycleEvent,
  CursorRuntimeEvent,
  CursorTerminalEvent,
  CursorToolEvent,
} from './cursor.js';
export type {
  DevinAgentMessageChunkEvent,
  DevinExtensionEvent,
  DevinLifecycleEvent,
  DevinRuntimeEvent,
  DevinTerminalEvent,
  DevinToolEvent,
} from './devin.js';
export type {
  OpenCodeExtensionEvent,
  OpenCodeLifecycleEvent,
  OpenCodeMessagePartEvent,
  OpenCodeRuntimeEvent,
  OpenCodeTerminalEvent,
  OpenCodeToolEvent,
} from './opencode.js';
export type {
  PiExtensionEvent,
  PiMessageEvent,
  PiRuntimeEvent,
  PiSynchronousPresentationInput,
  PiTerminalEvent,
  PiToolEvent,
} from './pi.js';
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
