// ───────────────────────────────────────────────────────────────────
// MODULE: Event and Original Validators
// ───────────────────────────────────────────────────────────────────

import {
  CaptureMethods,
  ConfidenceStates,
  ContractKinds,
  RuntimeIds,
  SanitizationStatuses,
} from './common.js';
import { EventKinds, EventPhases, TerminalStatuses } from './event.js';
import { verifyExactOriginal } from './exact-original.js';
import {
  ValidationCollector,
  expectEnum,
  expectIsoDate,
  expectNonNegativeInteger,
  expectNullableString,
  expectRecord,
  expectString,
  isJsonValue,
  validateHeader,
} from './validator-utils.js';

import type { EventEnvelope } from './event.js';
import type { ExactOriginalRecord } from './exact-original.js';
import type { ValidationResult } from './common.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const NAMESPACED_EXTENSION_PATTERN = /^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+$/;
const SHA256_PATTERN = /^sha256:[a-f0-9]{64}$/;

// ───────────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/** Validate an immutable runtime-neutral event without normalizing it. */
export function validateEventEnvelope(input: unknown): ValidationResult<EventEnvelope> {
  const collector = new ValidationCollector();
  const record = expectRecord(input, '$', collector);
  if (record === null) {
    return collector.result(input);
  }

  validateHeader(record, ContractKinds.EVENT, '$', collector);
  expectEnum(record, 'runtime', Object.values(RuntimeIds), '$', collector);
  expectString(record, 'runtimeVersion', '$', collector);
  expectString(record, 'adapterSchemaVersion', '$', collector);
  expectString(record, 'sessionId', '$', collector);
  for (const key of [
    'turnId',
    'messageId',
    'itemId',
    'partId',
    'toolCallId',
    'parentId',
  ]) {
    expectNullableString(record, key, '$', collector);
  }
  expectString(record, 'eventId', '$', collector);
  const kind = expectEnum(record, 'kind', Object.values(EventKinds), '$', collector);
  const phase = expectEnum(record, 'phase', Object.values(EventPhases), '$', collector);
  expectIsoDate(record, 'sourceTimestamp', '$', collector, true);
  expectString(record, 'canonicalPayloadRef', '$', collector);
  const terminalStatus = expectEnum(
    record,
    'terminalStatus',
    Object.values(TerminalStatuses),
    '$',
    collector,
  );
  expectEnum(
    record,
    'capabilityConfidence',
    Object.values(ConfidenceStates),
    '$',
    collector,
  );

  validateEventOrder(record.order, collector);
  validateJsonObject(record.payload, '$.payload', collector);
  const extensions = validateJsonObject(record.extensions, '$.extensions', collector);
  if (extensions !== null) {
    for (const key of Object.keys(extensions)) {
      collector.require(
        NAMESPACED_EXTENSION_PATTERN.test(key),
        `$.extensions.${key}`,
        'namespace',
        'Extension keys must use a stable dotted namespace.',
      );
    }
  }

  if (kind === EventKinds.CANCELLATION) {
    collector.require(
      record.terminalStatus === TerminalStatuses.CANCELLED,
      '$.terminalStatus',
      'terminal_state',
      'Cancellation events must carry a cancelled terminal state.',
    );
  }
  if (kind === EventKinds.ERROR || phase === EventPhases.FAILED) {
    collector.require(
      record.terminalStatus === TerminalStatuses.FAILED,
      '$.terminalStatus',
      'terminal_state',
      'Failed events must carry a failed terminal state.',
    );
  }
  if (phase === EventPhases.STREAMING) {
    collector.require(
      record.terminalStatus === TerminalStatuses.NONE,
      '$.terminalStatus',
      'terminal_state',
      'Streaming events cannot claim a terminal state.',
    );
  }
  if (phase === EventPhases.CREATED) {
    collector.require(
      terminalStatus === TerminalStatuses.NONE,
      '$.terminalStatus',
      'terminal_state',
      'Created events cannot claim a terminal state.',
    );
  }
  if (phase === EventPhases.FINAL) {
    collector.require(
      terminalStatus === TerminalStatuses.COMPLETED,
      '$.terminalStatus',
      'terminal_state',
      'Final events must carry a completed terminal state.',
    );
  }
  if (phase === EventPhases.CANCELLED) {
    collector.require(
      terminalStatus === TerminalStatuses.CANCELLED,
      '$.terminalStatus',
      'terminal_state',
      'Cancelled events must carry a cancelled terminal state.',
    );
  }

  return collector.result(input);
}

/** Validate one assembled event stream without rewriting its order coordinates. */
export function validateEventStream(
  input: unknown,
): ValidationResult<readonly EventEnvelope[]> {
  const collector = new ValidationCollector();
  collector.require(Array.isArray(input), '$', 'type', 'Expected an event array.');
  if (!Array.isArray(input)) {
    return collector.result(input);
  }

  collector.require(input.length > 0, '$', 'sample_size', 'Event stream cannot be empty.');
  const sourceCoordinates = new Set<string>();
  let streamIdentity: string | null = null;
  let hasTerminalEvent = false;

  for (const [index, eventValue] of input.entries()) {
    const result = validateEventEnvelope(eventValue);
    if (!result.success) {
      collector.append(`$[${index}]`, result.issues);
      continue;
    }

    const event = result.value;
    const currentIdentity = JSON.stringify([
      event.runtime,
      event.sessionId,
      event.turnId,
    ]);
    if (streamIdentity === null) {
      streamIdentity = currentIdentity;
    } else {
      collector.require(
        currentIdentity === streamIdentity,
        `$[${index}]`,
        'stream_identity',
        'All events in one stream must belong to the same runtime turn.',
      );
    }
    const sourceSequence = event.order.sourceSequence;
    if (sourceSequence !== null) {
      const coordinate = JSON.stringify([
        event.runtime,
        event.sessionId,
        event.turnId,
        sourceSequence,
      ]);
      collector.require(
        !sourceCoordinates.has(coordinate),
        `$[${index}].order.sourceSequence`,
        'duplicate_sequence',
        'Source sequence coordinates must be unique within a runtime turn.',
      );
      sourceCoordinates.add(coordinate);
    }
    hasTerminalEvent ||= event.terminalStatus !== TerminalStatuses.NONE;
  }

  collector.require(
    hasTerminalEvent,
    '$',
    'missing_terminal',
    'Event stream must contain a terminal event.',
  );
  return collector.result(input);
}

/** Validate exact bytes, digest, and provenance for an original record. */
export function validateExactOriginal(
  input: unknown,
): ValidationResult<ExactOriginalRecord> {
  const collector = new ValidationCollector();
  const record = expectRecord(input, '$', collector);
  if (record === null) {
    return collector.result(input);
  }

  validateHeader(record, ContractKinds.EXACT_ORIGINAL, '$', collector);
  expectString(record, 'originalId', '$', collector);
  expectString(record, 'contentType', '$', collector);
  expectEnum(record, 'encoding', ['base64'], '$', collector);
  const bytesBase64 = expectString(record, 'bytesBase64', '$', collector);
  expectNonNegativeInteger(record, 'byteLength', '$', collector);
  const sha256 = expectString(record, 'sha256', '$', collector);
  if (sha256 !== null) {
    collector.require(
      SHA256_PATTERN.test(sha256),
      '$.sha256',
      'digest',
      'Expected a lowercase sha256 digest with its algorithm prefix.',
    );
  }

  if (bytesBase64 !== null) {
    const decoded = Buffer.from(bytesBase64, 'base64');
    collector.require(
      decoded.toString('base64') === bytesBase64,
      '$.bytesBase64',
      'base64',
      'Expected canonical base64 without ignored characters.',
    );
  }

  validateProvenance(record.provenance, collector);
  if (
    bytesBase64 !== null
    && sha256 !== null
    && typeof record.byteLength === 'number'
    && SHA256_PATTERN.test(sha256)
  ) {
    collector.require(
      verifyExactOriginal(record as unknown as ExactOriginalRecord),
      '$',
      'exact_bytes',
      'Byte length or digest does not match the stored original bytes.',
    );
  }

  return collector.result(input);
}

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function validateEventOrder(value: unknown, collector: ValidationCollector): void {
  const order = expectRecord(value, '$.order', collector);
  if (order === null) {
    return;
  }

  for (const key of ['sourceSequence', 'assemblyIndex']) {
    const coordinate = order[key];
    collector.require(
      coordinate === null
        || (typeof coordinate === 'number'
          && Number.isInteger(coordinate)
          && coordinate >= 0),
      `$.order.${key}`,
      'order',
      'Expected null or a non-negative integer.',
    );
  }
  expectNonNegativeInteger(order, 'arrivalIndex', '$.order', collector);
}

function validateJsonObject(
  value: unknown,
  path: string,
  collector: ValidationCollector,
): Record<string, unknown> | null {
  const record = expectRecord(value, path, collector);
  if (record !== null) {
    collector.require(
      isJsonValue(record),
      path,
      'json',
      'Expected finite, acyclic JSON-compatible values.',
    );
  }
  return record;
}

function validateProvenance(value: unknown, collector: ValidationCollector): void {
  const record = expectRecord(value, '$.provenance', collector);
  if (record === null) {
    return;
  }

  expectString(record, 'sourceFamily', '$.provenance', collector);
  expectString(record, 'sourceVersion', '$.provenance', collector);
  expectEnum(
    record,
    'captureMethod',
    Object.values(CaptureMethods),
    '$.provenance',
    collector,
  );
  expectEnum(
    record,
    'sanitizationStatus',
    Object.values(SanitizationStatuses),
    '$.provenance',
    collector,
  );
  expectIsoDate(record, 'capturedAt', '$.provenance', collector);
}
