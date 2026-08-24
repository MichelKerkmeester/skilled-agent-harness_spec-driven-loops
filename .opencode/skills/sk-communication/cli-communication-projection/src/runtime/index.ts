// ───────────────────────────────────────────────────────────────────
// MODULE: Projection Runtime Public API
// ───────────────────────────────────────────────────────────────────

export { projectMessage } from './project-message.js';
export { runExternalCliProjection } from './external-cli-projection.js';
export { runLocalProjection } from './local-projection.js';
export {
  GateReasonCodes,
  consultPreProjectionGate,
  evaluatePreProjectionGate,
} from './gate.js';

export type { ExternalCliProjectionInput } from './external-cli-projection.js';
export type { LocalProjectionInput } from './local-projection.js';

export type {
  OriginalMessage,
  ProjectedMessage,
  ProjectMessageFallbackReason,
  ProjectMessageInput,
  ProjectMessageResult,
} from './project-message.js';
export type { GateDecision, GateReasonCode } from './gate.js';
