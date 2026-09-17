// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Runtime Adapter
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

/** Supported OpenCode stable client presentation paths. */
export const OpenCodeRuntimePaths = {
  SERVER_SSE: 'opencode-server-sse-stable-client',
} as const;

/** Stable OpenCode server and SSE event classes. */
export const OpenCodeEventTypes = {
  CANCELLED: 'cancelled',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  EXTENSION: 'extension',
  MESSAGE_PART: 'message-part',
  SERVER_CONNECTED: 'server-connected',
  SESSION_IDLE: 'session-idle',
  TIMEOUT: 'timeout',
  TOOL_CALL: 'tool-call',
  TOOL_RESULT: 'tool-result',
} as const;

/** Metadata-only OpenCode message part. */
export interface OpenCodeMessagePartEvent {
  readonly type: 'message-part';
  readonly eventId: string;
  readonly index: number;
  readonly final: boolean;
  readonly sourceTimestamp: string | null;
  readonly partId: string;
}

/** Metadata-only OpenCode tool event. */
export interface OpenCodeToolEvent {
  readonly type: 'tool-call' | 'tool-result';
  readonly eventId: string;
  readonly index: number;
  readonly sourceTimestamp: string | null;
  readonly toolCallId: string;
}

/** Stable server or session lifecycle event. */
export interface OpenCodeLifecycleEvent {
  readonly type: 'server-connected' | 'session-idle';
  readonly eventId: string;
  readonly index: number;
  readonly sourceTimestamp: string | null;
}

/** Terminal OpenCode server lifecycle event. */
export interface OpenCodeTerminalEvent {
  readonly type: 'cancelled' | 'disconnect' | 'error' | 'timeout';
  readonly eventId: string;
  readonly index: number;
  readonly sourceTimestamp: string | null;
}

/** Namespaced SSE metadata retained outside the portable core. */
export interface OpenCodeExtensionEvent {
  readonly type: 'extension';
  readonly eventId: string;
  readonly index: number;
  readonly final: boolean;
  readonly sourceTimestamp: string | null;
  readonly namespace: string;
  readonly value: JsonObject;
}

/** OpenCode stable server events translated by this adapter. */
export type OpenCodeRuntimeEvent =
  | OpenCodeExtensionEvent
  | OpenCodeLifecycleEvent
  | OpenCodeMessagePartEvent
  | OpenCodeTerminalEvent
  | OpenCodeToolEvent;

const CONFIRMED_YES: RuntimeCapabilityClaim = Object.freeze({
  state: 'yes',
  confidence: 'confirmed',
});
const CONFIRMED_NO: RuntimeCapabilityClaim = Object.freeze({
  state: 'no',
  confidence: 'confirmed',
});
const TESTED_RUNTIME_VERSION = '1.18.11';
const TESTED_PROTOCOL_VERSION = '3.1.0';
const EVIDENCE_DATE = '2026-08-12T00:00:00.000Z';

/** Version-pinned OpenCode server, SSE, and stable client capability record. */
export const OpenCodeCapabilityRecords: readonly RuntimeCapabilityRecord[] = Object.freeze([
  mapRuntimeCapability({
    runtime: 'opencode',
    pathId: OpenCodeRuntimePaths.SERVER_SSE,
    protocol: 'opencode-server-sse-stable-client',
    testedVersions: {
      runtime: TESTED_RUNTIME_VERSION,
      protocol: TESTED_PROTOCOL_VERSION,
    },
    evidence: {
      observedAt: EVIDENCE_DATE,
      source: 'opencode-server-openapi-sse-generated-client-observation',
      completeMessage: CONFIRMED_YES,
      atomicRenderDecision: CONFIRMED_YES,
      safePresentationBoundary: CONFIRMED_YES,
      append: CONFIRMED_NO,
      sidecar: CONFIRMED_NO,
    },
  }),
]);

/** Create an OpenCode adapter over the stable server and generated client boundary. */
export function createOpenCodeRuntimeAdapter(
  capabilities: readonly RuntimeCapabilityRecord[] = OpenCodeCapabilityRecords,
): RuntimeAdapter<OpenCodeRuntimeEvent> {
  const records = deepFreeze(structuredClone(capabilities));
  return Object.freeze({
    adapterVersion: 'runtime-adapter/1.0.0',
    runtime: 'opencode',
    capabilities: records,
    adapt(input: RuntimeAdapterInput<OpenCodeRuntimeEvent>): RuntimeAdapterResult {
      return adaptOpenCodeEvent(records, input);
    },
    present(input: RuntimePresentationInput): RuntimePresentationResult {
      return presentOpenCodeDecision(records, input);
    },
  });
}

/** Default OpenCode stable server adapter. */
export const openCodeRuntimeAdapter = createOpenCodeRuntimeAdapter();

function adaptOpenCodeEvent(
  capabilities: readonly RuntimeCapabilityRecord[],
  input: RuntimeAdapterInput<OpenCodeRuntimeEvent>,
): RuntimeAdapterResult {
  const generation = mapRuntimeGeneration(input);
  const record = findCapability(capabilities, input.envelope.pathId);
  if (record === undefined) {
    return exactEvent(capabilities, input, generation, null, RuntimeAdapterReasonCodes.UNSUPPORTED_PATH);
  }
  if (input.envelope.runtime !== 'opencode' || input.envelope.protocol !== record.protocol) {
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
  input: RuntimeAdapterInput<OpenCodeRuntimeEvent>,
  record: RuntimeCapabilityRecord,
): EventEnvelope {
  const runtimeEvent = input.envelope.event;
  const lifecycle = lifecycleFor(runtimeEvent);
  const originalId = input.canonical.exactOriginal.originalId;
  const isExtension = runtimeEvent.type === OpenCodeEventTypes.EXTENSION;
  return deepFreeze({
    contractKind: 'event',
    schemaVersion: '1.0.0',
    runtime: 'opencode',
    runtimeVersion: input.envelope.runtimeVersion,
    adapterSchemaVersion: '1.0.0',
    sessionId: input.envelope.sessionId,
    turnId: input.envelope.turnId,
    messageId: input.envelope.messageId,
    itemId: null,
    partId: runtimeEvent.type === OpenCodeEventTypes.MESSAGE_PART ? runtimeEvent.partId : null,
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

function lifecycleFor(event: OpenCodeRuntimeEvent): Pick<
  EventEnvelope,
  'kind' | 'phase' | 'terminalStatus'
> {
  switch (event.type) {
    case OpenCodeEventTypes.MESSAGE_PART:
      return event.final
        ? { kind: EventKinds.ASSISTANT_MESSAGE, phase: EventPhases.FINAL, terminalStatus: TerminalStatuses.COMPLETED }
        : { kind: EventKinds.ASSISTANT_MESSAGE_DELTA, phase: EventPhases.STREAMING, terminalStatus: TerminalStatuses.NONE };
    case OpenCodeEventTypes.TOOL_CALL:
      return { kind: EventKinds.TOOL_CALL, phase: EventPhases.CREATED, terminalStatus: TerminalStatuses.NONE };
    case OpenCodeEventTypes.TOOL_RESULT:
      return { kind: EventKinds.TOOL_RESULT, phase: EventPhases.FINAL, terminalStatus: TerminalStatuses.COMPLETED };
    case OpenCodeEventTypes.SERVER_CONNECTED:
      return { kind: EventKinds.EXTENSION, phase: EventPhases.CREATED, terminalStatus: TerminalStatuses.NONE };
    case OpenCodeEventTypes.SESSION_IDLE:
      return { kind: EventKinds.EXTENSION, phase: EventPhases.FINAL, terminalStatus: TerminalStatuses.COMPLETED };
    case OpenCodeEventTypes.CANCELLED:
      return { kind: EventKinds.CANCELLATION, phase: EventPhases.CANCELLED, terminalStatus: TerminalStatuses.CANCELLED };
    case OpenCodeEventTypes.DISCONNECT:
    case OpenCodeEventTypes.ERROR:
    case OpenCodeEventTypes.TIMEOUT:
      return { kind: EventKinds.ERROR, phase: EventPhases.FAILED, terminalStatus: TerminalStatuses.FAILED };
    case OpenCodeEventTypes.EXTENSION:
      return event.final
        ? { kind: EventKinds.EXTENSION, phase: EventPhases.FINAL, terminalStatus: TerminalStatuses.COMPLETED }
        : { kind: EventKinds.EXTENSION, phase: EventPhases.STREAMING, terminalStatus: TerminalStatuses.NONE };
  }
}

function payloadFor(event: OpenCodeRuntimeEvent, originalId: string): JsonObject {
  switch (event.type) {
    case OpenCodeEventTypes.MESSAGE_PART:
      return Object.freeze({ textOriginalId: originalId });
    case OpenCodeEventTypes.TOOL_CALL:
      return Object.freeze({ toolInputOriginalId: originalId });
    case OpenCodeEventTypes.TOOL_RESULT:
      return Object.freeze({ toolResultOriginalId: originalId });
    case OpenCodeEventTypes.SERVER_CONNECTED:
    case OpenCodeEventTypes.SESSION_IDLE:
      return Object.freeze({ lifecycleOriginalId: originalId });
    case OpenCodeEventTypes.CANCELLED:
      return Object.freeze({ reasonCode: RuntimeAdapterReasonCodes.CANCELLED });
    case OpenCodeEventTypes.DISCONNECT:
      return Object.freeze({ reasonCode: RuntimeAdapterReasonCodes.DISCONNECTED });
    case OpenCodeEventTypes.ERROR:
      return Object.freeze({ reasonCode: RuntimeAdapterReasonCodes.RUNTIME_FAILURE });
    case OpenCodeEventTypes.TIMEOUT:
      return Object.freeze({ reasonCode: RuntimeAdapterReasonCodes.TIMEOUT });
    case OpenCodeEventTypes.EXTENSION:
      return Object.freeze({});
  }
}

function terminalReason(event: OpenCodeRuntimeEvent): RuntimeAdapterReasonCode {
  switch (event.type) {
    case OpenCodeEventTypes.CANCELLED:
      return RuntimeAdapterReasonCodes.CANCELLED;
    case OpenCodeEventTypes.DISCONNECT:
      return RuntimeAdapterReasonCodes.DISCONNECTED;
    case OpenCodeEventTypes.ERROR:
      return RuntimeAdapterReasonCodes.RUNTIME_FAILURE;
    case OpenCodeEventTypes.TIMEOUT:
      return RuntimeAdapterReasonCodes.TIMEOUT;
    default:
      return RuntimeAdapterReasonCodes.NONE;
  }
}

function presentOpenCodeDecision(
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
  input: RuntimeAdapterInput<OpenCodeRuntimeEvent>,
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

function isToolEvent(event: OpenCodeRuntimeEvent): event is OpenCodeToolEvent {
  return event.type === OpenCodeEventTypes.TOOL_CALL
    || event.type === OpenCodeEventTypes.TOOL_RESULT;
}

function findCapability(
  capabilities: readonly RuntimeCapabilityRecord[],
  pathId: string,
): RuntimeCapabilityRecord | undefined {
  return capabilities.find((record) => record.runtime === 'opencode' && record.pathId === pathId);
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
    runtime: 'opencode',
    pathId: sanitizeRuntimeTelemetryPathId(pathId, capabilities),
    presentationTier: tier,
    status,
    reasonCode,
  });
}
