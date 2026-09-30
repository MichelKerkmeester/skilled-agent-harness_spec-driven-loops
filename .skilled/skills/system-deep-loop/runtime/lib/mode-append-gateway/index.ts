// ───────────────────────────────────────────────────────────────────
// MODULE: Mode Append Gateway Public API
// ───────────────────────────────────────────────────────────────────

export {
  ModeAppendGatewayErrorCodes,
  appendModeEvent,
} from './append-mode-event.js';

export type {
  AppendModeEventError,
  AppendModeEventOptions,
  AppendModeEventOutcome,
  AppendModeEventResult,
  ModeAppendGatewayErrorCode,
  ModeAppendReceipt,
} from './append-mode-event.js';

export {
  CutoverBindingError,
  CutoverBindingErrorCodes,
  createDefaultEnvironment,
  resolveCutoverBinding,
} from './resolve-cutover-binding.js';

export type {
  CutoverBindingEnvironment,
  CutoverBindingErrorCode,
  ResolveCutoverBindingOptions,
  ResolvedCutoverBinding,
} from './resolve-cutover-binding.js';
