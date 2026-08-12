// ───────────────────────────────────────────────────────────────────
// MODULE: Provider Public API
// ───────────────────────────────────────────────────────────────────

export { getProviderAdapter } from './adapters.js';
export { compilePromptControls } from './controls.js';
export { createProviderTelemetryEvent } from './evidence.js';
export { executeProviderRoute } from './executor.js';
export {
  createLlamaCppModelRecord,
  createOllamaModelRecord,
  createOpenCodeGoDeepSeekV4FlashRecord,
} from './presets.js';
export {
  createProviderRegistry,
  mergeCapabilitySnapshot,
  validateProviderModelRecord,
} from './registry.js';
export {
  ProviderExecutionReasonCodes,
  ProviderFamilies,
  ProviderPrivacyFactNames,
} from './types.js';

export type { ControlCompilation } from './controls.js';
export type { ExecuteProviderRouteInput } from './executor.js';
export type {
  LocalProviderPresetOptions,
  OpenCodeGoPresetOptions,
} from './presets.js';
export type { ProviderRegistry } from './registry.js';
export type {
  MutableJsonObject,
  ParsedProviderCandidate,
  ParsedProviderFailure,
  ParsedProviderResponse,
  PreparedProviderRequest,
  ProviderAdapter,
  ProviderCandidateResult,
  ProviderCapabilityMerge,
  ProviderCapabilityEvidence,
  ProviderCapabilitySnapshot,
  ProviderCostRecord,
  ProviderCredentialStatus,
  ProviderExecutionReasonCode,
  ProviderExecutionResult,
  ProviderExactOriginalResult,
  ProviderFamily,
  ProviderModelRecord,
  ProviderPreparationInput,
  ProviderPrivacyFact,
  ProviderPrivacyFactName,
  ProviderRequestPreparation,
  ProviderTelemetryOptions,
  ProviderTransport,
  ProviderWireRequest,
  ProviderWireResponse,
  UnsupportedProviderRequest,
} from './types.js';
