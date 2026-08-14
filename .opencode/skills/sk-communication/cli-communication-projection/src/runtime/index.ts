// ───────────────────────────────────────────────────────────────────
// MODULE: Projection Runtime Public API
// ───────────────────────────────────────────────────────────────────

export { projectMessage } from './project-message.js';
export {
  GateReasonCodes,
  consultPreProjectionGate,
  evaluatePreProjectionGate,
} from './gate.js';

export type {
  OriginalMessage,
  ProjectedMessage,
  ProjectMessageFallbackReason,
  ProjectMessageInput,
  ProjectMessageResult,
} from './project-message.js';
export type { GateDecision, GateReasonCode } from './gate.js';
