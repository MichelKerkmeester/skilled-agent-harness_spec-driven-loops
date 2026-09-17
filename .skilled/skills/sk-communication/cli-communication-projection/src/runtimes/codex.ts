// ───────────────────────────────────────────────────────────────────
// MODULE: Codex Runtime Adapter
// ───────────────────────────────────────────────────────────────────

import {
  EventKinds,
  EventPhases,
  TerminalStatuses,
} from '../contracts/event.js';
import { validateEventEnvelope } from '../contracts/validate-event.js';
import { deepFreeze } from '../fidelity/freeze.js';
import { RenderModes } from '../render/types.js';
import {
  mapRuntimeGeneration,
  sanitizeRuntimeTelemetryPathId,
} from './adapter.js';
import {
  assessRuntimeCompatibility,
  mapRuntimeCapability,
} from './capability.js';
import { RuntimeAdapterReasonCodes } from './types.js';

import type { JsonObject } from '../contracts/common.js';
import type { EventEnvelope } from '../contracts/event.js';
import type { RuntimeAdapter } from './adapter.js';
import type {
  PresentationTier,
  RuntimeAdapterInput,
  RuntimeAdapterReasonCode,
  RuntimeAdapterResult,
  RuntimeCapabilityClaim,
  RuntimeCapabilityRecord,
  RuntimeExactOriginalPresentation,
  RuntimePresentationInput,
  RuntimePresentationResult,
  RuntimeTelemetryRecord,
} from './types.js';

/** Supported Codex presentation paths. */
export const CodexRuntimePaths = {
  APP_SERVER: 'codex-app-server-client',
} as const;

/** Supported Codex App Server event classes. */
export const CodexEventTypes = {
  AGENT_MESSAGE: 'agent-message',
  AGENT_MESSAGE_DELTA: 'agent-message-delta',
  CANCELLED: 'cancelled',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  EXTENSION: 'extension',
  THREAD_STARTED: 'thread-started',
  TIMEOUT: 'timeout',
  TOOL_CALL: 'tool-call',
  TOOL_RESULT: 'tool-result',
  TURN_COMPLETED: 'turn-completed',
} as const;

/** Metadata-only Codex content event whose bytes remain canonical. */
export interface CodexContentEvent {
  readonly type: 'agent-message' | 'agent-message-delta' | 'tool-call' | 'tool-result';
  readonly eventId: string;
  readonly index: number;
  readonly sourceTimestamp: string | null;
  readonly itemId: string | null;
  readonly toolCallId: string | null;
}

/** Codex thread and turn lifecycle event. */
export interface CodexLifecycleEvent {
  readonly type: 'thread-started' | 'turn-completed';
  readonly eventId: string;
  readonly index: number;
  readonly sourceTimestamp: string | null;
}

/** Terminal Codex App Server lifecycle event. */
export interface CodexTerminalEvent {
  readonly type: 'cancelled' | 'disconnect' | 'error' | 'timeout';
  readonly eventId: string;
  readonly index: number;
  readonly sourceTimestamp: string | null;
}

/** Namespaced Codex metadata retained outside the portable core. */
export interface CodexExtensionEvent {
  readonly type: 'extension';
  readonly eventId: string;
  readonly index: number;
  readonly final: boolean;
  readonly sourceTimestamp: string | null;
  readonly namespace: string;
  readonly value: JsonObject;
}

/** Codex App Server events translated by this adapter. */
export type CodexRuntimeEvent =
  | CodexContentEvent
  | CodexExtensionEvent
  | CodexLifecycleEvent
  | CodexTerminalEvent;

const CONFIRMED_YES: RuntimeCapabilityClaim = Object.freeze({
  state: 'yes',
  confidence: 'confirmed',
});
const CONFIRMED_NO: RuntimeCapabilityClaim = Object.freeze({
  state: 'no',
  confidence: 'confirmed',
});
const TESTED_RUNTIME_VERSION = '0.147.0';
const TESTED_PROTOCOL_VERSION = '1.0.0';
const EVIDENCE_DATE = '2026-08-12T00:00:00.000Z';

/** Version-pinned Codex App Server client capability record. */
export const CodexCapabilityRecords: readonly RuntimeCapabilityRecord[] = Object.freeze([
  mapRuntimeCapability({
    runtime: 'codex',
    pathId: CodexRuntimePaths.APP_SERVER,
    protocol: 'codex-app-server-json-rpc',
    testedVersions: {
      runtime: TESTED_RUNTIME_VERSION,
      protocol: TESTED_PROTOCOL_VERSION,
    },
    evidence: {
      observedAt: EVIDENCE_DATE,
      source: 'codex-app-server-client-observation',
      completeMessage: CONFIRMED_YES,
      atomicRenderDecision: CONFIRMED_YES,
      safePresentationBoundary: CONFIRMED_YES,
      append: CONFIRMED_NO,
      sidecar: CONFIRMED_NO,
    },
  }),
]);

/** Create a Codex adapter with an App Server client-owned presentation boundary. */
export function createCodexRuntimeAdapter(
  capabilities: readonly RuntimeCapabilityRecord[] = CodexCapabilityRecords,
): RuntimeAdapter<CodexRuntimeEvent> {
  const records = deepFreeze(structuredClone(capabilities));
  return Object.freeze({
    adapterVersion: 'runtime-adapter/1.0.0',
    runtime: 'codex',
    capabilities: records,
    adapt(input: RuntimeAdapterInput<CodexRuntimeEvent>): RuntimeAdapterResult {
      return adaptCodexEvent(records, input);
    },
    present(input: RuntimePresentationInput): RuntimePresentationResult {
      return presentCodexDecision(records, input);
    },
  });
}

/** Default Codex App Server adapter. */
export const codexRuntimeAdapter = createCodexRuntimeAdapter();

function adaptCodexEvent(
  capabilities: readonly RuntimeCapabilityRecord[],
  input: RuntimeAdapterInput<CodexRuntimeEvent>,
): RuntimeAdapterResult {
  const generation = mapRuntimeGeneration(input);
  const record = findCapability(capabilities, input.envelope.pathId);
  if (record === undefined) {
    return exactEvent(capabilities, input, generation, null, RuntimeAdapterReasonCodes.UNSUPPORTED_PATH);
  }
  if (input.envelope.runtime !== 'codex' || input.envelope.protocol !== record.protocol) {
    return exactEvent(capabilities, input, generation, null, RuntimeAdapterReasonCodes.INVALID_EVENT);
  }
  const compatibility = assessRuntimeCompatibility(
    record,
    input.envelope.runtimeVersion,
    input.envelope.protocolVersion,
  );
  if (!compatibility.compatible) {
    return exactEvent(capabilities, input, generation, null, compatibility.reasonCode);
  }

  const event = createEventEnvelope(input, record);
  if (!validateEventEnvelope(event).success) {
    return exactEvent(capabilities, input, generation, null, RuntimeAdapterReasonCodes.INVALID_EVENT);
  }
  const reasonCode = terminalReason(input.envelope.event);
  if (reasonCode !== RuntimeAdapterReasonCodes.NONE) {
    return exactEvent(capabilities, input, generation, event, reasonCode);
  }
  return deepFreeze({
    status: 'mapped',
    reasonCode: RuntimeAdapterReasonCodes.NONE,
    generation,
    event,
    exactOriginal: null,
    presentationTier: record.presentationTier,
    telemetry: telemetry(record, 'mapped', RuntimeAdapterReasonCodes.NONE),
  });
}

function createEventEnvelope(
  input: RuntimeAdapterInput<CodexRuntimeEvent>,
  record: RuntimeCapabilityRecord,
): EventEnvelope {
  const runtimeEvent = input.envelope.event;
  const lifecycle = lifecycleFor(runtimeEvent);
  const originalId = input.canonical.exactOriginal.originalId;
  const isExtension = runtimeEvent.type === CodexEventTypes.EXTENSION;
  const isContent = isContentEvent(runtimeEvent);
  return deepFreeze({
    contractKind: 'event',
    schemaVersion: '1.0.0',
    runtime: 'codex',
    runtimeVersion: input.envelope.runtimeVersion,
    adapterSchemaVersion: '1.0.0',
    sessionId: input.envelope.sessionId,
    turnId: input.envelope.turnId,
    messageId: input.envelope.messageId,
    itemId: isContent ? runtimeEvent.itemId : null,
    partId: runtimeEvent.type === CodexEventTypes.AGENT_MESSAGE_DELTA
      ? `part-${runtimeEvent.index}`
      : null,
    toolCallId: isContent ? runtimeEvent.toolCallId : null,
    parentId: null,
    eventId: runtimeEvent.eventId,
    kind: lifecycle.kind,
    phase: lifecycle.phase,
    sourceTimestamp: runtimeEvent.sourceTimestamp,
    order: {
      sourceSequence: runtimeEvent.index,
      arrivalIndex: runtimeEvent.index,
      assemblyIndex: null,
    },
    canonicalPayloadRef: originalId,
    payload: isExtension ? {} : payloadFor(runtimeEvent, originalId),
    extensions: isExtension
      ? { [runtimeEvent.namespace]: structuredClone(runtimeEvent.value) }
      : {},
    terminalStatus: lifecycle.terminalStatus,
    capabilityConfidence: record.evidence.safePresentationBoundary.confidence,
  });
}

function lifecycleFor(event: CodexRuntimeEvent): Pick<
  EventEnvelope,
  'kind' | 'phase' | 'terminalStatus'
> {
  switch (event.type) {
    case CodexEventTypes.AGENT_MESSAGE_DELTA:
      return { kind: EventKinds.ASSISTANT_MESSAGE_DELTA, phase: EventPhases.STREAMING, terminalStatus: TerminalStatuses.NONE };
    case CodexEventTypes.AGENT_MESSAGE:
      return { kind: EventKinds.ASSISTANT_MESSAGE, phase: EventPhases.FINAL, terminalStatus: TerminalStatuses.COMPLETED };
    case CodexEventTypes.TOOL_CALL:
      return { kind: EventKinds.TOOL_CALL, phase: EventPhases.CREATED, terminalStatus: TerminalStatuses.NONE };
    case CodexEventTypes.TOOL_RESULT:
      return { kind: EventKinds.TOOL_RESULT, phase: EventPhases.FINAL, terminalStatus: TerminalStatuses.COMPLETED };
    case CodexEventTypes.THREAD_STARTED:
      return { kind: EventKinds.EXTENSION, phase: EventPhases.CREATED, terminalStatus: TerminalStatuses.NONE };
    case CodexEventTypes.TURN_COMPLETED:
      return { kind: EventKinds.EXTENSION, phase: EventPhases.FINAL, terminalStatus: TerminalStatuses.COMPLETED };
    case CodexEventTypes.CANCELLED:
      return { kind: EventKinds.CANCELLATION, phase: EventPhases.CANCELLED, terminalStatus: TerminalStatuses.CANCELLED };
    case CodexEventTypes.DISCONNECT:
    case CodexEventTypes.ERROR:
    case CodexEventTypes.TIMEOUT:
      return { kind: EventKinds.ERROR, phase: EventPhases.FAILED, terminalStatus: TerminalStatuses.FAILED };
    case CodexEventTypes.EXTENSION:
      return event.final
        ? { kind: EventKinds.EXTENSION, phase: EventPhases.FINAL, terminalStatus: TerminalStatuses.COMPLETED }
        : { kind: EventKinds.EXTENSION, phase: EventPhases.STREAMING, terminalStatus: TerminalStatuses.NONE };
  }
}

function payloadFor(event: CodexRuntimeEvent, originalId: string): JsonObject {
  switch (event.type) {
    case CodexEventTypes.AGENT_MESSAGE:
    case CodexEventTypes.AGENT_MESSAGE_DELTA:
      return Object.freeze({ textOriginalId: originalId });
    case CodexEventTypes.TOOL_CALL:
      return Object.freeze({ toolInputOriginalId: originalId });
    case CodexEventTypes.TOOL_RESULT:
      return Object.freeze({ toolResultOriginalId: originalId });
    case CodexEventTypes.THREAD_STARTED:
    case CodexEventTypes.TURN_COMPLETED:
      return Object.freeze({ lifecycleOriginalId: originalId });
    case CodexEventTypes.CANCELLED:
      return Object.freeze({ reasonCode: RuntimeAdapterReasonCodes.CANCELLED });
    case CodexEventTypes.DISCONNECT:
      return Object.freeze({ reasonCode: RuntimeAdapterReasonCodes.DISCONNECTED });
    case CodexEventTypes.ERROR:
      return Object.freeze({ reasonCode: RuntimeAdapterReasonCodes.RUNTIME_FAILURE });
    case CodexEventTypes.TIMEOUT:
      return Object.freeze({ reasonCode: RuntimeAdapterReasonCodes.TIMEOUT });
    case CodexEventTypes.EXTENSION:
      return Object.freeze({});
  }
}

function terminalReason(event: CodexRuntimeEvent): RuntimeAdapterReasonCode {
  switch (event.type) {
    case CodexEventTypes.CANCELLED:
      return RuntimeAdapterReasonCodes.CANCELLED;
    case CodexEventTypes.DISCONNECT:
      return RuntimeAdapterReasonCodes.DISCONNECTED;
    case CodexEventTypes.ERROR:
      return RuntimeAdapterReasonCodes.RUNTIME_FAILURE;
    case CodexEventTypes.TIMEOUT:
      return RuntimeAdapterReasonCodes.TIMEOUT;
    default:
      return RuntimeAdapterReasonCodes.NONE;
  }
}

function presentCodexDecision(
  capabilities: readonly RuntimeCapabilityRecord[],
  input: RuntimePresentationInput,
): RuntimePresentationResult {
  const record = findCapability(capabilities, input.pathId);
  if (record === undefined) {
    return exactPresentation(capabilities, input, RuntimeAdapterReasonCodes.UNSUPPORTED_PATH);
  }
  const compatibility = assessRuntimeCompatibility(record, input.runtimeVersion, input.protocolVersion);
  if (!compatibility.compatible) {
    return exactPresentation(capabilities, input, compatibility.reasonCode);
  }
  if (input.renderDecision.status !== 'projection') {
    return exactPresentation(capabilities, input, RuntimeAdapterReasonCodes.PROJECTION_REJECTED);
  }
  if (record.presentationTier !== 'full-projection' || input.renderDecision.mode !== RenderModes.ATOMIC_REPLACE) {
    return exactPresentation(capabilities, input, RuntimeAdapterReasonCodes.UNSUPPORTED_PRESENTATION);
  }
  return deepFreeze({
    status: 'projection',
    mode: 'atomic-replace',
    reasonCode: RuntimeAdapterReasonCodes.NONE,
    presentationTier: 'full-projection',
    exactOriginal: input.renderDecision.exactOriginal,
    projectionText: input.renderDecision.projectionText,
    originalSuppressed: true,
    telemetry: telemetry(record, 'projection', RuntimeAdapterReasonCodes.NONE),
  });
}

function exactEvent(
  capabilities: readonly RuntimeCapabilityRecord[],
  input: RuntimeAdapterInput<CodexRuntimeEvent>,
  generation: ReturnType<typeof mapRuntimeGeneration>,
  event: EventEnvelope | null,
  reasonCode: Exclude<RuntimeAdapterReasonCode, 'none'>,
): RuntimeAdapterResult {
  return deepFreeze({
    status: 'exact-original',
    reasonCode,
    generation,
    event,
    exactOriginal: input.canonical.exactOriginal,
    presentationTier: 'safe-native',
    telemetry: telemetryFor(
      capabilities,
      input.envelope.pathId,
      'safe-native',
      'exact-original',
      reasonCode,
    ),
  });
}

function exactPresentation(
  capabilities: readonly RuntimeCapabilityRecord[],
  input: RuntimePresentationInput,
  reasonCode: Exclude<RuntimeAdapterReasonCode, 'none'>,
): RuntimeExactOriginalPresentation {
  return deepFreeze({
    status: 'exact-original',
    mode: 'original-only',
    reasonCode,
    presentationTier: 'safe-native',
    exactOriginal: input.renderDecision.exactOriginal,
    projectionText: null,
    originalSuppressed: false,
    telemetry: telemetryFor(
      capabilities,
      input.pathId,
      'safe-native',
      'exact-original',
      reasonCode,
    ),
  });
}

function isContentEvent(event: CodexRuntimeEvent): event is CodexContentEvent {
  return event.type === CodexEventTypes.AGENT_MESSAGE
    || event.type === CodexEventTypes.AGENT_MESSAGE_DELTA
    || event.type === CodexEventTypes.TOOL_CALL
    || event.type === CodexEventTypes.TOOL_RESULT;
}

function findCapability(
  capabilities: readonly RuntimeCapabilityRecord[],
  pathId: string,
): RuntimeCapabilityRecord | undefined {
  return capabilities.find((record) => record.runtime === 'codex' && record.pathId === pathId);
}

function telemetry(
  record: RuntimeCapabilityRecord,
  status: RuntimeTelemetryRecord['status'],
  reasonCode: RuntimeAdapterReasonCode,
): RuntimeTelemetryRecord {
  return telemetryFor([record], record.pathId, record.presentationTier, status, reasonCode);
}

function telemetryFor(
  capabilities: readonly RuntimeCapabilityRecord[],
  pathId: string,
  tier: PresentationTier,
  status: RuntimeTelemetryRecord['status'],
  reasonCode: RuntimeAdapterReasonCode,
): RuntimeTelemetryRecord {
  return Object.freeze({
    telemetryVersion: 'runtime-telemetry/1.0.0',
    eventName: 'runtime-adapter-terminal',
    runtime: 'codex',
    pathId: sanitizeRuntimeTelemetryPathId(pathId, capabilities),
    presentationTier: tier,
    status,
    reasonCode,
  });
}
