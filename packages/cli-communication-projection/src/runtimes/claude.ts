// ───────────────────────────────────────────────────────────────────
// MODULE: Claude Runtime Adapter
// ───────────────────────────────────────────────────────────────────

import {
  EventKinds,
  EventPhases,
  TerminalStatuses,
} from '../contracts/event.js';
import { validateEventEnvelope } from '../contracts/validate-event.js';
import { deepFreeze } from '../fidelity/freeze.js';
import { RenderModes } from '../render/types.js';
import { mapRuntimeGeneration } from './adapter.js';
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

/** Supported Claude presentation paths. */
export const ClaudeRuntimePaths = {
  HEADLESS: 'claude-headless-message-display',
  INTERACTIVE: 'claude-interactive-message-display',
} as const;

/** Claude event classes accepted by the reference adapter. */
export const ClaudeEventTypes = {
  CANCELLED: 'cancelled',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  EXTENSION: 'extension',
  MESSAGE_DISPLAY: 'message-display',
  TIMEOUT: 'timeout',
} as const;

/** Metadata-only MessageDisplay event whose bytes remain in the canonical record. */
export interface ClaudeMessageDisplayEvent {
  readonly type: 'message-display';
  readonly eventId: string;
  readonly index: number;
  readonly final: boolean;
  readonly sourceTimestamp: string | null;
}

/** Terminal Claude lifecycle event. */
export interface ClaudeTerminalEvent {
  readonly type: 'cancelled' | 'disconnect' | 'error' | 'timeout';
  readonly eventId: string;
  readonly index: number;
  readonly sourceTimestamp: string | null;
}

/** Namespaced Claude metadata retained without promoting it into the portable core. */
export interface ClaudeExtensionEvent {
  readonly type: 'extension';
  readonly eventId: string;
  readonly index: number;
  readonly final: boolean;
  readonly sourceTimestamp: string | null;
  readonly namespace: string;
  readonly value: JsonObject;
}

/** Claude events translated by the reference adapter. */
export type ClaudeRuntimeEvent =
  | ClaudeExtensionEvent
  | ClaudeMessageDisplayEvent
  | ClaudeTerminalEvent;

const CONFIRMED_YES: RuntimeCapabilityClaim = Object.freeze({
  state: 'yes',
  confidence: 'confirmed',
});
const CONFIRMED_NO: RuntimeCapabilityClaim = Object.freeze({
  state: 'no',
  confidence: 'confirmed',
});
const TESTED_RUNTIME_VERSION = '2.1.228';
const TESTED_PROTOCOL_VERSION = '1.0.0';
const EVIDENCE_DATE = '2026-08-12T00:00:00.000Z';

/** Version-pinned Claude capability records for headless and interactive paths. */
export const ClaudeCapabilityRecords: readonly RuntimeCapabilityRecord[] = Object.freeze([
  mapRuntimeCapability({
    runtime: 'claude',
    pathId: ClaudeRuntimePaths.HEADLESS,
    protocol: 'claude-headless-stream-json',
    testedVersions: {
      runtime: TESTED_RUNTIME_VERSION,
      protocol: TESTED_PROTOCOL_VERSION,
    },
    evidence: {
      observedAt: EVIDENCE_DATE,
      source: 'claude-code-headless-and-hook-documentation',
      completeMessage: CONFIRMED_YES,
      atomicRenderDecision: CONFIRMED_YES,
      safePresentationBoundary: CONFIRMED_YES,
      append: CONFIRMED_NO,
      sidecar: CONFIRMED_NO,
    },
  }),
  mapRuntimeCapability({
    runtime: 'claude',
    pathId: ClaudeRuntimePaths.INTERACTIVE,
    protocol: 'claude-message-display',
    testedVersions: {
      runtime: TESTED_RUNTIME_VERSION,
      protocol: TESTED_PROTOCOL_VERSION,
    },
    evidence: {
      observedAt: EVIDENCE_DATE,
      source: 'claude-code-message-display-documentation',
      completeMessage: CONFIRMED_YES,
      atomicRenderDecision: CONFIRMED_NO,
      safePresentationBoundary: CONFIRMED_YES,
      append: CONFIRMED_YES,
      sidecar: CONFIRMED_YES,
    },
  }),
]);

/** Create a Claude adapter, optionally with fixture-pinned capability records. */
export function createClaudeRuntimeAdapter(
  capabilities: readonly RuntimeCapabilityRecord[] = ClaudeCapabilityRecords,
): RuntimeAdapter<ClaudeRuntimeEvent> {
  const records = deepFreeze(structuredClone(capabilities));
  return Object.freeze({
    adapterVersion: 'runtime-adapter/1.0.0',
    runtime: 'claude',
    capabilities: records,
    adapt(input: RuntimeAdapterInput<ClaudeRuntimeEvent>): RuntimeAdapterResult {
      return adaptClaudeEvent(records, input);
    },
    present(input: RuntimePresentationInput): RuntimePresentationResult {
      return presentClaudeDecision(records, input);
    },
  });
}

/** Default Claude reference adapter. */
export const claudeRuntimeAdapter = createClaudeRuntimeAdapter();

function adaptClaudeEvent(
  capabilities: readonly RuntimeCapabilityRecord[],
  input: RuntimeAdapterInput<ClaudeRuntimeEvent>,
): RuntimeAdapterResult {
  const generation = mapRuntimeGeneration(input);
  const record = findCapability(capabilities, input.envelope.pathId);
  if (record === undefined) {
    return exactEvent(
      input,
      generation,
      null,
      'safe-native',
      RuntimeAdapterReasonCodes.UNSUPPORTED_PATH,
    );
  }
  if (
    input.envelope.runtime !== 'claude'
    || input.envelope.protocol !== record.protocol
  ) {
    return exactEvent(
      input,
      generation,
      null,
      record.presentationTier,
      RuntimeAdapterReasonCodes.INVALID_EVENT,
    );
  }
  const compatibility = assessRuntimeCompatibility(
    record,
    input.envelope.runtimeVersion,
    input.envelope.protocolVersion,
  );
  if (!compatibility.compatible) {
    return exactEvent(
      input,
      generation,
      null,
      record.presentationTier,
      compatibility.reasonCode,
    );
  }

  const event = createEventEnvelope(input, record);
  const validation = validateEventEnvelope(event);
  if (!validation.success) {
    return exactEvent(
      input,
      generation,
      null,
      record.presentationTier,
      RuntimeAdapterReasonCodes.INVALID_EVENT,
    );
  }
  const reasonCode = terminalReason(input.envelope.event);
  if (reasonCode !== RuntimeAdapterReasonCodes.NONE) {
    return exactEvent(input, generation, event, record.presentationTier, reasonCode);
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
  input: RuntimeAdapterInput<ClaudeRuntimeEvent>,
  record: RuntimeCapabilityRecord,
): EventEnvelope {
  const runtimeEvent = input.envelope.event;
  const lifecycle = lifecycleFor(runtimeEvent);
  const originalId = input.canonical.exactOriginal.originalId;
  const isExtension = runtimeEvent.type === ClaudeEventTypes.EXTENSION;
  return deepFreeze({
    contractKind: 'event',
    schemaVersion: '1.0.0',
    runtime: 'claude',
    runtimeVersion: input.envelope.runtimeVersion,
    adapterSchemaVersion: '1.0.0',
    sessionId: input.envelope.sessionId,
    turnId: input.envelope.turnId,
    messageId: input.envelope.messageId,
    itemId: null,
    partId: runtimeEvent.type === ClaudeEventTypes.MESSAGE_DISPLAY && !runtimeEvent.final
      ? `part-${runtimeEvent.index}`
      : null,
    toolCallId: null,
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

function lifecycleFor(event: ClaudeRuntimeEvent): Pick<
  EventEnvelope,
  'kind' | 'phase' | 'terminalStatus'
> {
  switch (event.type) {
    case ClaudeEventTypes.MESSAGE_DISPLAY:
      return event.final
        ? {
          kind: EventKinds.ASSISTANT_MESSAGE,
          phase: EventPhases.FINAL,
          terminalStatus: TerminalStatuses.COMPLETED,
        }
        : {
          kind: EventKinds.ASSISTANT_MESSAGE_DELTA,
          phase: EventPhases.STREAMING,
          terminalStatus: TerminalStatuses.NONE,
        };
    case ClaudeEventTypes.CANCELLED:
      return {
        kind: EventKinds.CANCELLATION,
        phase: EventPhases.CANCELLED,
        terminalStatus: TerminalStatuses.CANCELLED,
      };
    case ClaudeEventTypes.DISCONNECT:
    case ClaudeEventTypes.ERROR:
    case ClaudeEventTypes.TIMEOUT:
      return {
        kind: EventKinds.ERROR,
        phase: EventPhases.FAILED,
        terminalStatus: TerminalStatuses.FAILED,
      };
    case ClaudeEventTypes.EXTENSION:
      return event.final
        ? {
          kind: EventKinds.EXTENSION,
          phase: EventPhases.FINAL,
          terminalStatus: TerminalStatuses.COMPLETED,
        }
        : {
          kind: EventKinds.EXTENSION,
          phase: EventPhases.STREAMING,
          terminalStatus: TerminalStatuses.NONE,
        };
  }
}

function payloadFor(event: ClaudeRuntimeEvent, originalId: string): JsonObject {
  switch (event.type) {
    case ClaudeEventTypes.MESSAGE_DISPLAY:
      return Object.freeze({ textOriginalId: originalId });
    case ClaudeEventTypes.CANCELLED:
      return Object.freeze({ reasonCode: RuntimeAdapterReasonCodes.CANCELLED });
    case ClaudeEventTypes.DISCONNECT:
      return Object.freeze({ reasonCode: RuntimeAdapterReasonCodes.DISCONNECTED });
    case ClaudeEventTypes.ERROR:
      return Object.freeze({ reasonCode: RuntimeAdapterReasonCodes.RUNTIME_FAILURE });
    case ClaudeEventTypes.TIMEOUT:
      return Object.freeze({ reasonCode: RuntimeAdapterReasonCodes.TIMEOUT });
    case ClaudeEventTypes.EXTENSION:
      return Object.freeze({});
  }
}

function terminalReason(event: ClaudeRuntimeEvent): RuntimeAdapterReasonCode {
  switch (event.type) {
    case ClaudeEventTypes.CANCELLED:
      return RuntimeAdapterReasonCodes.CANCELLED;
    case ClaudeEventTypes.DISCONNECT:
      return RuntimeAdapterReasonCodes.DISCONNECTED;
    case ClaudeEventTypes.ERROR:
      return RuntimeAdapterReasonCodes.RUNTIME_FAILURE;
    case ClaudeEventTypes.TIMEOUT:
      return RuntimeAdapterReasonCodes.TIMEOUT;
    case ClaudeEventTypes.EXTENSION:
    case ClaudeEventTypes.MESSAGE_DISPLAY:
      return RuntimeAdapterReasonCodes.NONE;
  }
}

function presentClaudeDecision(
  capabilities: readonly RuntimeCapabilityRecord[],
  input: RuntimePresentationInput,
): RuntimePresentationResult {
  const record = findCapability(capabilities, input.pathId);
  if (record === undefined) {
    return exactPresentation(
      input,
      'safe-native',
      RuntimeAdapterReasonCodes.UNSUPPORTED_PATH,
    );
  }
  const compatibility = assessRuntimeCompatibility(
    record,
    input.runtimeVersion,
    input.protocolVersion,
  );
  if (!compatibility.compatible) {
    return exactPresentation(input, record.presentationTier, compatibility.reasonCode);
  }
  if (input.renderDecision.status !== 'projection') {
    return exactPresentation(
      input,
      record.presentationTier,
      RuntimeAdapterReasonCodes.PROJECTION_REJECTED,
    );
  }

  if (record.presentationTier === 'full-projection') {
    if (input.renderDecision.mode !== RenderModes.ATOMIC_REPLACE) {
      return exactPresentation(
        input,
        record.presentationTier,
        RuntimeAdapterReasonCodes.UNSUPPORTED_PRESENTATION,
      );
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
      telemetry: telemetry(
        record,
        'degraded',
        RuntimeAdapterReasonCodes.ATOMIC_REPLACE_UNAVAILABLE,
      ),
    });
  }
  return exactPresentation(
    input,
    record.presentationTier,
    mode === 'original-only'
      ? RuntimeAdapterReasonCodes.ORIGINAL_SELECTED
      : RuntimeAdapterReasonCodes.UNKNOWN_CAPABILITY,
  );
}

function exactEvent(
  input: RuntimeAdapterInput<ClaudeRuntimeEvent>,
  generation: ReturnType<typeof mapRuntimeGeneration>,
  event: EventEnvelope | null,
  tier: PresentationTier,
  reasonCode: Exclude<RuntimeAdapterReasonCode, 'none'>,
): RuntimeAdapterResult {
  return deepFreeze({
    status: 'exact-original',
    reasonCode,
    generation,
    event,
    exactOriginal: input.canonical.exactOriginal,
    presentationTier: tier,
    telemetry: telemetryFor(input.envelope.pathId, tier, 'exact-original', reasonCode),
  });
}

function exactPresentation(
  input: RuntimePresentationInput,
  tier: PresentationTier,
  reasonCode: Exclude<RuntimeAdapterReasonCode, 'none'>,
): RuntimeExactOriginalPresentation {
  return deepFreeze({
    status: 'exact-original',
    mode: 'original-only',
    reasonCode,
    presentationTier: tier,
    exactOriginal: input.renderDecision.exactOriginal,
    projectionText: null,
    originalSuppressed: false,
    telemetry: telemetryFor(input.pathId, tier, 'exact-original', reasonCode),
  });
}

function findCapability(
  capabilities: readonly RuntimeCapabilityRecord[],
  pathId: string,
): RuntimeCapabilityRecord | undefined {
  return capabilities.find((record) => record.runtime === 'claude' && record.pathId === pathId);
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
  return telemetryFor(record.pathId, record.presentationTier, status, reasonCode);
}

function telemetryFor(
  pathId: string,
  tier: PresentationTier,
  status: RuntimeTelemetryRecord['status'],
  reasonCode: RuntimeAdapterReasonCode,
): RuntimeTelemetryRecord {
  return Object.freeze({
    telemetryVersion: 'runtime-telemetry/1.0.0',
    eventName: 'runtime-adapter-terminal',
    runtime: 'claude',
    pathId,
    presentationTier: tier,
    status,
    reasonCode,
  });
}
