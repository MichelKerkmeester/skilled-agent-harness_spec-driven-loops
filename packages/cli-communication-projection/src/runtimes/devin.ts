// ───────────────────────────────────────────────────────────────────
// MODULE: Devin Runtime Adapter
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

/** Supported Devin ACP presentation paths. */
export const DevinRuntimePaths = {
  ACP: 'devin-acp-client',
} as const;

/** Devin ACP events accepted by the adapter. */
export const DevinEventTypes = {
  AGENT_MESSAGE_CHUNK: 'agent-message-chunk',
  CANCELLED: 'cancelled',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  EXTENSION: 'extension',
  SESSION_COMPLETED: 'session-completed',
  SESSION_CREATED: 'session-created',
  TIMEOUT: 'timeout',
  TOOL_CALL: 'tool-call',
  TOOL_RESULT: 'tool-result',
} as const;

/** Metadata-only Devin ACP message chunk. */
export interface DevinAgentMessageChunkEvent {
  readonly type: 'agent-message-chunk';
  readonly eventId: string;
  readonly index: number;
  readonly final: boolean;
  readonly sourceTimestamp: string | null;
}

/** Metadata-only Devin ACP tool event. */
export interface DevinToolEvent {
  readonly type: 'tool-call' | 'tool-result';
  readonly eventId: string;
  readonly index: number;
  readonly sourceTimestamp: string | null;
  readonly toolCallId: string;
}

/** Devin ACP session lifecycle event. */
export interface DevinLifecycleEvent {
  readonly type: 'session-created' | 'session-completed';
  readonly eventId: string;
  readonly index: number;
  readonly sourceTimestamp: string | null;
}

/** Terminal Devin ACP lifecycle event. */
export interface DevinTerminalEvent {
  readonly type: 'cancelled' | 'disconnect' | 'error' | 'timeout';
  readonly eventId: string;
  readonly index: number;
  readonly sourceTimestamp: string | null;
}

/** Unknown Devin ACP extension retained under its supplied namespace. */
export interface DevinExtensionEvent {
  readonly type: 'extension';
  readonly eventId: string;
  readonly index: number;
  readonly final: boolean;
  readonly sourceTimestamp: string | null;
  readonly namespace: string;
  readonly value: JsonObject;
}

/** Devin ACP events translated without Cursor-specific assumptions. */
export type DevinRuntimeEvent =
  | DevinAgentMessageChunkEvent
  | DevinExtensionEvent
  | DevinLifecycleEvent
  | DevinTerminalEvent
  | DevinToolEvent;

const CONFIRMED_YES: RuntimeCapabilityClaim = Object.freeze({
  state: 'yes',
  confidence: 'confirmed',
});
const CONFIRMED_NO: RuntimeCapabilityClaim = Object.freeze({
  state: 'no',
  confidence: 'confirmed',
});
const TESTED_RUNTIME_VERSION = '3000.4.16';
const TESTED_PROTOCOL_VERSION = '1.0.0';
const EVIDENCE_DATE = '2026-08-12T00:00:00.000Z';

/** Independent version-pinned Devin ACP capability record. */
export const DevinCapabilityRecords: readonly RuntimeCapabilityRecord[] = Object.freeze([
  mapRuntimeCapability({
    runtime: 'devin',
    pathId: DevinRuntimePaths.ACP,
    protocol: 'devin-agent-client-protocol',
    testedVersions: {
      runtime: TESTED_RUNTIME_VERSION,
      protocol: TESTED_PROTOCOL_VERSION,
    },
    evidence: {
      observedAt: EVIDENCE_DATE,
      source: 'devin-acp-client-observation',
      completeMessage: CONFIRMED_YES,
      atomicRenderDecision: CONFIRMED_YES,
      safePresentationBoundary: CONFIRMED_YES,
      append: CONFIRMED_NO,
      sidecar: CONFIRMED_NO,
    },
  }),
]);

/** Create a Devin ACP adapter with client-owned presentation. */
export function createDevinRuntimeAdapter(
  capabilities: readonly RuntimeCapabilityRecord[] = DevinCapabilityRecords,
): RuntimeAdapter<DevinRuntimeEvent> {
  const records = deepFreeze(structuredClone(capabilities));
  return Object.freeze({
    adapterVersion: 'runtime-adapter/1.0.0',
    runtime: 'devin',
    capabilities: records,
    adapt(input: RuntimeAdapterInput<DevinRuntimeEvent>): RuntimeAdapterResult {
      return adaptDevinEvent(records, input);
    },
    present(input: RuntimePresentationInput): RuntimePresentationResult {
      return presentDevinDecision(records, input);
    },
  });
}

/** Default Devin ACP adapter. */
export const devinRuntimeAdapter = createDevinRuntimeAdapter();

function adaptDevinEvent(
  capabilities: readonly RuntimeCapabilityRecord[],
  input: RuntimeAdapterInput<DevinRuntimeEvent>,
): RuntimeAdapterResult {
  const generation = mapRuntimeGeneration(input);
  const record = findCapability(capabilities, input.envelope.pathId);
  if (record === undefined) {
    return exactEvent(capabilities, input, generation, null, RuntimeAdapterReasonCodes.UNSUPPORTED_PATH);
  }
  if (input.envelope.runtime !== 'devin' || input.envelope.protocol !== record.protocol) {
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
  input: RuntimeAdapterInput<DevinRuntimeEvent>,
  record: RuntimeCapabilityRecord,
): EventEnvelope {
  const runtimeEvent = input.envelope.event;
  const lifecycle = lifecycleFor(runtimeEvent);
  const originalId = input.canonical.exactOriginal.originalId;
  const isExtension = runtimeEvent.type === DevinEventTypes.EXTENSION;
  return deepFreeze({
    contractKind: 'event',
    schemaVersion: '1.0.0',
    runtime: 'devin',
    runtimeVersion: input.envelope.runtimeVersion,
    adapterSchemaVersion: '1.0.0',
    sessionId: input.envelope.sessionId,
    turnId: input.envelope.turnId,
    messageId: input.envelope.messageId,
    itemId: null,
    partId: runtimeEvent.type === DevinEventTypes.AGENT_MESSAGE_CHUNK && !runtimeEvent.final
      ? `part-${runtimeEvent.index}`
      : null,
    toolCallId: isToolEvent(runtimeEvent) ? runtimeEvent.toolCallId : null,
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

function lifecycleFor(event: DevinRuntimeEvent): Pick<
  EventEnvelope,
  'kind' | 'phase' | 'terminalStatus'
> {
  switch (event.type) {
    case DevinEventTypes.AGENT_MESSAGE_CHUNK:
      return event.final
        ? { kind: EventKinds.ASSISTANT_MESSAGE, phase: EventPhases.FINAL, terminalStatus: TerminalStatuses.COMPLETED }
        : { kind: EventKinds.ASSISTANT_MESSAGE_DELTA, phase: EventPhases.STREAMING, terminalStatus: TerminalStatuses.NONE };
    case DevinEventTypes.TOOL_CALL:
      return { kind: EventKinds.TOOL_CALL, phase: EventPhases.CREATED, terminalStatus: TerminalStatuses.NONE };
    case DevinEventTypes.TOOL_RESULT:
      return { kind: EventKinds.TOOL_RESULT, phase: EventPhases.FINAL, terminalStatus: TerminalStatuses.COMPLETED };
    case DevinEventTypes.SESSION_CREATED:
      return { kind: EventKinds.EXTENSION, phase: EventPhases.CREATED, terminalStatus: TerminalStatuses.NONE };
    case DevinEventTypes.SESSION_COMPLETED:
      return { kind: EventKinds.EXTENSION, phase: EventPhases.FINAL, terminalStatus: TerminalStatuses.COMPLETED };
    case DevinEventTypes.CANCELLED:
      return { kind: EventKinds.CANCELLATION, phase: EventPhases.CANCELLED, terminalStatus: TerminalStatuses.CANCELLED };
    case DevinEventTypes.DISCONNECT:
    case DevinEventTypes.ERROR:
    case DevinEventTypes.TIMEOUT:
      return { kind: EventKinds.ERROR, phase: EventPhases.FAILED, terminalStatus: TerminalStatuses.FAILED };
    case DevinEventTypes.EXTENSION:
      return event.final
        ? { kind: EventKinds.EXTENSION, phase: EventPhases.FINAL, terminalStatus: TerminalStatuses.COMPLETED }
        : { kind: EventKinds.EXTENSION, phase: EventPhases.STREAMING, terminalStatus: TerminalStatuses.NONE };
  }
}

function payloadFor(event: DevinRuntimeEvent, originalId: string): JsonObject {
  switch (event.type) {
    case DevinEventTypes.AGENT_MESSAGE_CHUNK:
      return Object.freeze({ textOriginalId: originalId });
    case DevinEventTypes.TOOL_CALL:
      return Object.freeze({ toolInputOriginalId: originalId });
    case DevinEventTypes.TOOL_RESULT:
      return Object.freeze({ toolResultOriginalId: originalId });
    case DevinEventTypes.SESSION_CREATED:
    case DevinEventTypes.SESSION_COMPLETED:
      return Object.freeze({ lifecycleOriginalId: originalId });
    case DevinEventTypes.CANCELLED:
      return Object.freeze({ reasonCode: RuntimeAdapterReasonCodes.CANCELLED });
    case DevinEventTypes.DISCONNECT:
      return Object.freeze({ reasonCode: RuntimeAdapterReasonCodes.DISCONNECTED });
    case DevinEventTypes.ERROR:
      return Object.freeze({ reasonCode: RuntimeAdapterReasonCodes.RUNTIME_FAILURE });
    case DevinEventTypes.TIMEOUT:
      return Object.freeze({ reasonCode: RuntimeAdapterReasonCodes.TIMEOUT });
    case DevinEventTypes.EXTENSION:
      return Object.freeze({});
  }
}

function terminalReason(event: DevinRuntimeEvent): RuntimeAdapterReasonCode {
  switch (event.type) {
    case DevinEventTypes.CANCELLED:
      return RuntimeAdapterReasonCodes.CANCELLED;
    case DevinEventTypes.DISCONNECT:
      return RuntimeAdapterReasonCodes.DISCONNECTED;
    case DevinEventTypes.ERROR:
      return RuntimeAdapterReasonCodes.RUNTIME_FAILURE;
    case DevinEventTypes.TIMEOUT:
      return RuntimeAdapterReasonCodes.TIMEOUT;
    default:
      return RuntimeAdapterReasonCodes.NONE;
  }
}

function presentDevinDecision(
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
  input: RuntimeAdapterInput<DevinRuntimeEvent>,
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
    telemetry: telemetryFor(capabilities, input.envelope.pathId, 'safe-native', 'exact-original', reasonCode),
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
    telemetry: telemetryFor(capabilities, input.pathId, 'safe-native', 'exact-original', reasonCode),
  });
}

function isToolEvent(event: DevinRuntimeEvent): event is DevinToolEvent {
  return event.type === DevinEventTypes.TOOL_CALL || event.type === DevinEventTypes.TOOL_RESULT;
}

function findCapability(
  capabilities: readonly RuntimeCapabilityRecord[],
  pathId: string,
): RuntimeCapabilityRecord | undefined {
  return capabilities.find((record) => record.runtime === 'devin' && record.pathId === pathId);
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
    runtime: 'devin',
    pathId: sanitizeRuntimeTelemetryPathId(pathId, capabilities),
    presentationTier: tier,
    status,
    reasonCode,
  });
}
