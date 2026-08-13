// ───────────────────────────────────────────────────────────────────
// MODULE: Core Test Helpers
// ───────────────────────────────────────────────────────────────────

import {
  createExactOriginalRecord,
} from '../../src/index.js';

import type {
  EventEnvelope,
  EventKind,
  EventPhase,
  ExactOriginalRecord,
  FixtureProvenance,
  GenerationKey,
  TerminalStatus,
} from '../../src/index.js';

const provenance: FixtureProvenance = {
  sourceFamily: 'core-test',
  sourceVersion: '1.0.0',
  captureMethod: 'synthetic',
  sanitizationStatus: 'synthetic',
  capturedAt: '2026-08-11T12:00:00.000Z',
};

/** Options for a synthetic immutable event envelope. */
export interface SyntheticEventOptions {
  readonly key: GenerationKey;
  readonly eventId: string;
  readonly kind: EventKind;
  readonly phase: EventPhase;
  readonly terminalStatus: TerminalStatus;
  readonly sourceSequence: number | null;
  readonly arrivalIndex: number;
  readonly original: ExactOriginalRecord;
}

/** Create a synthetic text original with deterministic provenance. */
export function createTextOriginal(
  originalId: string,
  text: string,
): ExactOriginalRecord {
  return createExactOriginalRecord(
    originalId,
    new TextEncoder().encode(text),
    'text/plain; charset=utf-8',
    provenance,
  );
}

/** Create a synthetic byte original with deterministic provenance. */
export function createByteOriginal(
  originalId: string,
  bytes: Uint8Array,
): ExactOriginalRecord {
  return createExactOriginalRecord(
    originalId,
    bytes,
    'application/octet-stream',
    provenance,
  );
}

/** Create one fully valid runtime-neutral test event. */
export function createSyntheticEvent(
  options: SyntheticEventOptions,
): EventEnvelope {
  const carriesText = options.kind === 'assistant-message'
    || options.kind === 'assistant-message-delta';
  return {
    contractKind: 'event',
    schemaVersion: '1.0.0',
    runtime: options.key.runtime,
    runtimeVersion: 'synthetic-1',
    adapterSchemaVersion: '1.0.0',
    sessionId: options.key.sessionId,
    turnId: options.key.turnId,
    messageId: options.key.messageId,
    itemId: null,
    partId: carriesText ? `part-${options.sourceSequence ?? options.arrivalIndex}` : null,
    toolCallId: null,
    parentId: null,
    eventId: options.eventId,
    kind: options.kind,
    phase: options.phase,
    sourceTimestamp: null,
    order: {
      sourceSequence: options.sourceSequence,
      arrivalIndex: options.arrivalIndex,
      assemblyIndex: null,
    },
    canonicalPayloadRef: options.original.originalId,
    payload: carriesText ? { textOriginalId: options.original.originalId } : {},
    extensions: {
      'test.fixture': {
        synthetic: true,
      },
    },
    terminalStatus: options.terminalStatus,
    capabilityConfidence: 'confirmed',
  };
}

/** Create one isolated generation key. */
export function createGenerationKey(
  generationId: string,
  attempt = 1,
): GenerationKey {
  return {
    runtime: 'codex',
    sessionId: 'session-core',
    turnId: 'turn-core',
    messageId: 'message-core',
    generationId,
    attempt,
  };
}
