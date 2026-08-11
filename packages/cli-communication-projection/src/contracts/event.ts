// ───────────────────────────────────────────────────────────────────
// MODULE: Canonical Event Contract
// ───────────────────────────────────────────────────────────────────

import type {
  ConfidenceState,
  ContractHeader,
  JsonObject,
  RuntimeId,
} from './common.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Independent order coordinates retained from a runtime event stream. */
export interface EventOrder {
  readonly sourceSequence: number | null;
  readonly arrivalIndex: number;
  readonly assemblyIndex: number | null;
}

/** Runtime-neutral immutable event envelope. */
export interface EventEnvelope extends ContractHeader {
  readonly contractKind: 'event';
  readonly runtime: RuntimeId;
  readonly runtimeVersion: string;
  readonly adapterSchemaVersion: string;
  readonly sessionId: string;
  readonly turnId: string | null;
  readonly messageId: string | null;
  readonly itemId: string | null;
  readonly partId: string | null;
  readonly toolCallId: string | null;
  readonly parentId: string | null;
  readonly eventId: string;
  readonly kind: EventKind;
  readonly phase: EventPhase;
  readonly sourceTimestamp: string | null;
  readonly order: EventOrder;
  readonly canonicalPayloadRef: string;
  readonly payload: JsonObject;
  readonly extensions: JsonObject;
  readonly terminalStatus: TerminalStatus;
  readonly capabilityConfidence: ConfidenceState;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** Portable event categories; runtime-only events use `extension`. */
export const EventKinds = {
  ASSISTANT_MESSAGE: 'assistant-message',
  ASSISTANT_MESSAGE_DELTA: 'assistant-message-delta',
  CANCELLATION: 'cancellation',
  ERROR: 'error',
  EXTENSION: 'extension',
  TOOL_CALL: 'tool-call',
  TOOL_RESULT: 'tool-result',
} as const;

/** Portable event category. */
export type EventKind = typeof EventKinds[keyof typeof EventKinds];

/** Lifecycle phase of one immutable event. */
export const EventPhases = {
  CANCELLED: 'cancelled',
  CREATED: 'created',
  FAILED: 'failed',
  FINAL: 'final',
  STREAMING: 'streaming',
} as const;

/** Event lifecycle phase. */
export type EventPhase = typeof EventPhases[keyof typeof EventPhases];

/** Terminal state represented by an event. */
export const TerminalStatuses = {
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  FAILED: 'failed',
  NONE: 'none',
} as const;

/** Event terminal state. */
export type TerminalStatus = typeof TerminalStatuses[keyof typeof TerminalStatuses];
