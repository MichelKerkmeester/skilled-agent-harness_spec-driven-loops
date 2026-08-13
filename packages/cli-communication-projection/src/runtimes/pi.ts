// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Runtime Adapter
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
  DegradationMode,
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

/** Supported Pi presentation paths. */
export const PiRuntimePaths = {
  JSON_RPC: 'pi-json-rpc-client',
  DISPLAY_TRANSFORMER: 'pi-synchronous-display-transformer',
} as const;

/** Pi events accepted at both supported capture boundaries. */
export const PiEventTypes = {
  CANCELLED: 'cancelled',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  EXTENSION: 'extension',
  MESSAGE_END: 'message-end',
  MESSAGE_START: 'message-start',
  MESSAGE_UPDATE: 'message-update',
  TIMEOUT: 'timeout',
  TOOL_CALL: 'tool-call',
  TOOL_RESULT: 'tool-result',
} as const;

/** Metadata-only Pi message lifecycle event. */
export interface PiMessageEvent {
  readonly type: 'message-start' | 'message-update' | 'message-end';
  readonly eventId: string;
  readonly index: number;
  readonly sourceTimestamp: string | null;
}

/** Metadata-only Pi tool event whose bytes remain canonical. */
export interface PiToolEvent {
  readonly type: 'tool-call' | 'tool-result';
  readonly eventId: string;
  readonly index: number;
  readonly sourceTimestamp: string | null;
  readonly toolCallId: string;
}

/** Terminal Pi lifecycle event. */
export interface PiTerminalEvent {
  readonly type: 'cancelled' | 'disconnect' | 'error' | 'timeout';
  readonly eventId: string;
  readonly index: number;
  readonly sourceTimestamp: string | null;
}

/** Namespaced Pi metadata retained outside the portable core. */
export interface PiExtensionEvent {
  readonly type: 'extension';
  readonly eventId: string;
  readonly index: number;
  readonly final: boolean;
  readonly sourceTimestamp: string | null;
  readonly namespace: string;
  readonly value: JsonObject;
}

/** Pi events translated by this adapter. */
export type PiRuntimeEvent =
  | PiExtensionEvent
  | PiMessageEvent
  | PiTerminalEvent
  | PiToolEvent;

/** Sync transformer input that distinguishes projection readiness. */
export interface PiSynchronousPresentationInput extends RuntimePresentationInput {
  readonly asyncProjectionAvailable: boolean;
}

const CONFIRMED_YES: RuntimeCapabilityClaim = Object.freeze({
  state: 'yes',
  confidence: 'confirmed',
});
const CONFIRMED_NO: RuntimeCapabilityClaim = Object.freeze({
  state: 'no',
  confidence: 'confirmed',
});
const TESTED_RUNTIME_VERSION = '0.84.1';
const TESTED_JSON_RPC_VERSION = '2.0.0';
const TESTED_TRANSFORMER_VERSION = '1.0.0';
const EVIDENCE_DATE = '2026-08-12T00:00:00.000Z';

/** Version-pinned Pi async and synchronous capability records. */
export const PiCapabilityRecords: readonly RuntimeCapabilityRecord[] = Object.freeze([
  mapRuntimeCapability({
    runtime: 'pi',
    pathId: PiRuntimePaths.JSON_RPC,
    protocol: 'pi-json-rpc',
    testedVersions: {
      runtime: TESTED_RUNTIME_VERSION,
      protocol: TESTED_JSON_RPC_VERSION,
    },
    evidence: {
      observedAt: EVIDENCE_DATE,
      source: 'pi-json-rpc-client-observation',
      completeMessage: CONFIRMED_YES,
      atomicRenderDecision: CONFIRMED_YES,
      safePresentationBoundary: CONFIRMED_YES,
      append: CONFIRMED_NO,
      sidecar: CONFIRMED_NO,
    },
  }),
  mapRuntimeCapability({
    runtime: 'pi',
    pathId: PiRuntimePaths.DISPLAY_TRANSFORMER,
    protocol: 'pi-display-transformer',
    testedVersions: {
      runtime: TESTED_RUNTIME_VERSION,
      protocol: TESTED_TRANSFORMER_VERSION,
    },
    evidence: {
      observedAt: EVIDENCE_DATE,
      source: 'pi-synchronous-display-transformer-observation',
      completeMessage: CONFIRMED_YES,
      atomicRenderDecision: CONFIRMED_NO,
      safePresentationBoundary: CONFIRMED_YES,
      append: CONFIRMED_YES,
      sidecar: CONFIRMED_YES,
    },
  }),
]);

/** Create a Pi adapter with independent asynchronous and synchronous paths. */
export function createPiRuntimeAdapter(
  capabilities: readonly RuntimeCapabilityRecord[] = PiCapabilityRecords,
): RuntimeAdapter<PiRuntimeEvent> {
  const records = deepFreeze(structuredClone(capabilities));
  return Object.freeze({
    adapterVersion: 'runtime-adapter/1.0.0',
    runtime: 'pi',
    capabilities: records,
    adapt(input: RuntimeAdapterInput<PiRuntimeEvent>): RuntimeAdapterResult {
      return adaptPiEvent(records, input);
    },
    present(input: RuntimePresentationInput): RuntimePresentationResult {
      return presentPiDecision(records, input);
    },
  });
}

/** Default Pi runtime adapter. */
export const piRuntimeAdapter = createPiRuntimeAdapter();

/** Preserve the original when the synchronous transformer outruns async projection. */
export function presentPiSynchronousTransform(
  input: PiSynchronousPresentationInput,
  capabilities: readonly RuntimeCapabilityRecord[] = PiCapabilityRecords,
): RuntimePresentationResult {
  if (input.pathId !== PiRuntimePaths.DISPLAY_TRANSFORMER) {
    return exactPresentation(capabilities, input, RuntimeAdapterReasonCodes.UNSUPPORTED_PATH);
  }
  if (!input.asyncProjectionAvailable) {
    return exactPresentation(capabilities, input, RuntimeAdapterReasonCodes.ORIGINAL_SELECTED);
  }
  return presentPiDecision(capabilities, input);
}

function adaptPiEvent(
  capabilities: readonly RuntimeCapabilityRecord[],
  input: RuntimeAdapterInput<PiRuntimeEvent>,
): RuntimeAdapterResult {
  const generation = mapRuntimeGeneration(input);
  const record = findCapability(capabilities, input.envelope.pathId);
  if (record === undefined) {
    return exactEvent(capabilities, input, generation, null, RuntimeAdapterReasonCodes.UNSUPPORTED_PATH);
  }
  if (input.envelope.runtime !== 'pi' || input.envelope.protocol !== record.protocol) {
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
  input: RuntimeAdapterInput<PiRuntimeEvent>,
  record: RuntimeCapabilityRecord,
): EventEnvelope {
  const runtimeEvent = input.envelope.event;
  const lifecycle = lifecycleFor(runtimeEvent);
  const originalId = input.canonical.exactOriginal.originalId;
  const isExtension = runtimeEvent.type === PiEventTypes.EXTENSION;
  return deepFreeze({
    contractKind: 'event',
    schemaVersion: '1.0.0',
    runtime: 'pi',
    runtimeVersion: input.envelope.runtimeVersion,
    adapterSchemaVersion: '1.0.0',
    sessionId: input.envelope.sessionId,
    turnId: input.envelope.turnId,
    messageId: input.envelope.messageId,
    itemId: null,
    partId: runtimeEvent.type === PiEventTypes.MESSAGE_UPDATE
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

function lifecycleFor(event: PiRuntimeEvent): Pick<
  EventEnvelope,
  'kind' | 'phase' | 'terminalStatus'
> {
  switch (event.type) {
    case PiEventTypes.MESSAGE_START:
      return { kind: EventKinds.ASSISTANT_MESSAGE_DELTA, phase: EventPhases.CREATED, terminalStatus: TerminalStatuses.NONE };
    case PiEventTypes.MESSAGE_UPDATE:
      return { kind: EventKinds.ASSISTANT_MESSAGE_DELTA, phase: EventPhases.STREAMING, terminalStatus: TerminalStatuses.NONE };
    case PiEventTypes.MESSAGE_END:
      return { kind: EventKinds.ASSISTANT_MESSAGE, phase: EventPhases.FINAL, terminalStatus: TerminalStatuses.COMPLETED };
    case PiEventTypes.TOOL_CALL:
      return { kind: EventKinds.TOOL_CALL, phase: EventPhases.CREATED, terminalStatus: TerminalStatuses.NONE };
    case PiEventTypes.TOOL_RESULT:
      return { kind: EventKinds.TOOL_RESULT, phase: EventPhases.FINAL, terminalStatus: TerminalStatuses.COMPLETED };
    case PiEventTypes.CANCELLED:
      return { kind: EventKinds.CANCELLATION, phase: EventPhases.CANCELLED, terminalStatus: TerminalStatuses.CANCELLED };
    case PiEventTypes.DISCONNECT:
    case PiEventTypes.ERROR:
    case PiEventTypes.TIMEOUT:
      return { kind: EventKinds.ERROR, phase: EventPhases.FAILED, terminalStatus: TerminalStatuses.FAILED };
    case PiEventTypes.EXTENSION:
      return event.final
        ? { kind: EventKinds.EXTENSION, phase: EventPhases.FINAL, terminalStatus: TerminalStatuses.COMPLETED }
        : { kind: EventKinds.EXTENSION, phase: EventPhases.STREAMING, terminalStatus: TerminalStatuses.NONE };
  }
}

function payloadFor(event: PiRuntimeEvent, originalId: string): JsonObject {
  switch (event.type) {
    case PiEventTypes.MESSAGE_START:
    case PiEventTypes.MESSAGE_UPDATE:
    case PiEventTypes.MESSAGE_END:
      return Object.freeze({ textOriginalId: originalId });
    case PiEventTypes.TOOL_CALL:
      return Object.freeze({ toolInputOriginalId: originalId });
    case PiEventTypes.TOOL_RESULT:
      return Object.freeze({ toolResultOriginalId: originalId });
    case PiEventTypes.CANCELLED:
      return Object.freeze({ reasonCode: RuntimeAdapterReasonCodes.CANCELLED });
    case PiEventTypes.DISCONNECT:
      return Object.freeze({ reasonCode: RuntimeAdapterReasonCodes.DISCONNECTED });
    case PiEventTypes.ERROR:
      return Object.freeze({ reasonCode: RuntimeAdapterReasonCodes.RUNTIME_FAILURE });
    case PiEventTypes.TIMEOUT:
      return Object.freeze({ reasonCode: RuntimeAdapterReasonCodes.TIMEOUT });
    case PiEventTypes.EXTENSION:
      return Object.freeze({});
  }
}

function terminalReason(event: PiRuntimeEvent): RuntimeAdapterReasonCode {
  switch (event.type) {
    case PiEventTypes.CANCELLED:
      return RuntimeAdapterReasonCodes.CANCELLED;
    case PiEventTypes.DISCONNECT:
      return RuntimeAdapterReasonCodes.DISCONNECTED;
    case PiEventTypes.ERROR:
      return RuntimeAdapterReasonCodes.RUNTIME_FAILURE;
    case PiEventTypes.TIMEOUT:
      return RuntimeAdapterReasonCodes.TIMEOUT;
    default:
      return RuntimeAdapterReasonCodes.NONE;
  }
}

function presentPiDecision(
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

  if (record.presentationTier === 'full-projection') {
    if (input.renderDecision.mode !== RenderModes.ATOMIC_REPLACE) {
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

  const mode = selectDegradation(record, input.preferredDegradationModes);
  if (mode === 'append' || mode === 'sidecar') {
    return deepFreeze({
      status: 'degraded',
      mode,
      reasonCode: RuntimeAdapterReasonCodes.ATOMIC_REPLACE_UNAVAILABLE,
      presentationTier: 'safe-native',
      exactOriginal: input.renderDecision.exactOriginal,
      projectionText: input.renderDecision.projectionText,
      originalSuppressed: false,
      telemetry: telemetry(record, 'degraded', RuntimeAdapterReasonCodes.ATOMIC_REPLACE_UNAVAILABLE),
    });
  }
  return exactPresentation(
    capabilities,
    input,
    mode === 'original-only'
      ? RuntimeAdapterReasonCodes.ORIGINAL_SELECTED
      : RuntimeAdapterReasonCodes.UNKNOWN_CAPABILITY,
  );
}

function exactEvent(
  capabilities: readonly RuntimeCapabilityRecord[],
  input: RuntimeAdapterInput<PiRuntimeEvent>,
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

function isToolEvent(event: PiRuntimeEvent): event is PiToolEvent {
  return event.type === PiEventTypes.TOOL_CALL || event.type === PiEventTypes.TOOL_RESULT;
}

function findCapability(
  capabilities: readonly RuntimeCapabilityRecord[],
  pathId: string,
): RuntimeCapabilityRecord | undefined {
  return capabilities.find((record) => record.runtime === 'pi' && record.pathId === pathId);
}

function selectDegradation(
  record: RuntimeCapabilityRecord,
  preferred: readonly DegradationMode[] | undefined,
): DegradationMode | undefined {
  const candidates = preferred ?? record.allowedDegradationModes;
  return candidates.find((mode) => record.allowedDegradationModes.includes(mode));
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
    runtime: 'pi',
    pathId: sanitizeRuntimeTelemetryPathId(pathId, capabilities),
    presentationTier: tier,
    status,
    reasonCode,
  });
}
