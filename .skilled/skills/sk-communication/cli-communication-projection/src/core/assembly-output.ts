// ───────────────────────────────────────────────────────────────────
// MODULE: Terminal Assembly Output
// ───────────────────────────────────────────────────────────────────

import {
  EventKinds,
  TerminalStatuses,
} from '../contracts/event.js';
import { decodeExactOriginal } from '../contracts/exact-original.js';
import { normalizeEvent } from './normalizer.js';
import { AssemblyReasonCodes } from './assembly-types.js';

import type { EventEnvelope } from '../contracts/event.js';
import type { ExactOriginalRecord } from '../contracts/exact-original.js';
import type {
  AssemblyOrderSnapshot,
  AssemblyReasonCode,
  AssemblyTerminalBase,
  AssemblyTerminalResult,
  BufferedAssemblyEvent,
  ExactOriginalAssembly,
  GenerationKey,
} from './assembly-types.js';

/** Ordered terminal view used to build a candidate or exact-original outcome. */
export interface TerminalAssemblySnapshot {
  readonly buffered: readonly BufferedAssemblyEvent[];
  readonly events: readonly EventEnvelope[];
  readonly order: AssemblyOrderSnapshot;
}

/** Derive source, arrival, and assembly views without mutating stored events. */
export function createAssemblySnapshot(
  events: readonly BufferedAssemblyEvent[],
): TerminalAssemblySnapshot {
  const arrival = [...events].sort(compareArrival);
  const source = [...events].sort(compareSource);
  const assembly = [...source];
  const indexedEvents = assembly.map((entry, index) => withAssemblyIndex(entry.event, index));
  const buffered = assembly.map((entry, index) => ({
    event: indexedEvents[index] ?? entry.event,
    original: entry.original,
  }));
  const order: AssemblyOrderSnapshot = deepFreeze({
    source: source.map((entry) => ({
      eventId: entry.event.eventId,
      index: entry.event.order.sourceSequence,
    })),
    arrival: arrival.map((entry) => ({
      eventId: entry.event.eventId,
      index: entry.event.order.arrivalIndex,
    })),
    assembly: indexedEvents.map((event) => ({
      eventId: event.eventId,
      index: event.order.assemblyIndex,
    })),
  });
  return Object.freeze({
    buffered: Object.freeze(buffered),
    events: Object.freeze(indexedEvents),
    order,
  });
}

/** Decode a successful terminal snapshot or select a typed exact-original fallback. */
export function completeAssembly(
  base: AssemblyTerminalBase,
  events: readonly BufferedAssemblyEvent[],
): AssemblyTerminalResult {
  const finalMessage = [...events].reverse().find((entry) =>
    entry.event.kind === EventKinds.ASSISTANT_MESSAGE
      && entry.event.terminalStatus === TerminalStatuses.COMPLETED,
  );
  const contentRecords = finalMessage === undefined
    ? events
      .filter((entry) => entry.event.kind === EventKinds.ASSISTANT_MESSAGE_DELTA)
      .map((entry) => entry.original)
    : [finalMessage.original];
  const byteParts = contentRecords.map((record) => Buffer.from(decodeExactOriginal(record)));
  const bytes = Buffer.concat(byteParts);
  if (bytes.byteLength === 0) {
    return createFallbackAssembly(base, AssemblyReasonCodes.EMPTY_OUTPUT);
  }

  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    if (text.length === 0) {
      return createFallbackAssembly(base, AssemblyReasonCodes.EMPTY_OUTPUT);
    }
    return deepFreeze({
      ...base,
      status: 'completed',
      reasonCode: AssemblyReasonCodes.COMPLETED,
      outputByteCount: bytes.byteLength,
      text,
    });
  } catch (error: unknown) {
    return createFallbackAssembly(base, AssemblyReasonCodes.CORRUPT_ENCODING);
  }
}

/** Freeze a terminal exact-original result with no raw diagnostic copy. */
export function createFallbackAssembly(
  base: AssemblyTerminalBase,
  reasonCode: Exclude<AssemblyReasonCode, 'completed'>,
): ExactOriginalAssembly {
  return deepFreeze({
    ...base,
    status: 'exact-original',
    reasonCode,
    outputByteCount: base.exactOriginal.byteLength,
  });
}

/** Create a terminal fallback before mutable generation state is allocated. */
export function createEmptyFallback(
  key: GenerationKey,
  exactOriginal: ExactOriginalRecord,
  reasonCode: Exclude<AssemblyReasonCode, 'completed'>,
  timestampMs: number,
): ExactOriginalAssembly {
  return deepFreeze({
    status: 'exact-original',
    key,
    reasonCode,
    exactOriginal,
    events: [],
    order: { source: [], arrival: [], assembly: [] },
    startedAtMs: timestampMs,
    terminalAtMs: timestampMs,
    durationMs: 0,
    inputByteCount: 0,
    outputByteCount: exactOriginal.byteLength,
  });
}

/** Detach caller-owned exact bytes before retaining them in mutable state. */
export function freezeExactOriginal(record: ExactOriginalRecord): ExactOriginalRecord {
  if (Object.isFrozen(record) && Object.isFrozen(record.provenance)) {
    return record;
  }
  return deepFreeze(structuredClone(record));
}

function compareArrival(
  left: BufferedAssemblyEvent,
  right: BufferedAssemblyEvent,
): number {
  return left.event.order.arrivalIndex - right.event.order.arrivalIndex
    || left.event.eventId.localeCompare(right.event.eventId);
}

function compareSource(
  left: BufferedAssemblyEvent,
  right: BufferedAssemblyEvent,
): number {
  const leftSource = left.event.order.sourceSequence;
  const rightSource = right.event.order.sourceSequence;
  if (leftSource === null && rightSource !== null) {
    return 1;
  }
  if (leftSource !== null && rightSource === null) {
    return -1;
  }
  if (leftSource !== null && rightSource !== null && leftSource !== rightSource) {
    return leftSource - rightSource;
  }
  return compareArrival(left, right);
}

function withAssemblyIndex(event: EventEnvelope, assemblyIndex: number): EventEnvelope {
  const result = normalizeEvent({
    ...event,
    order: {
      ...event.order,
      assemblyIndex,
    },
  });
  if (!result.success) {
    throw new Error('Internal assembly order must remain a valid event envelope.');
  }
  return result.value;
}

function deepFreeze<TValue>(value: TValue): TValue {
  if (typeof value !== 'object' || value === null || Object.isFrozen(value)) {
    return value;
  }
  for (const child of Object.values(value)) {
    deepFreeze(child);
  }
  return Object.freeze(value);
}
