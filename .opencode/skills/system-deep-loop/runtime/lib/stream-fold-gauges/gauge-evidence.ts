// ───────────────────────────────────────────────────────────────────
// MODULE: Stream-Fold Gauge Evidence
// ───────────────────────────────────────────────────────────────────

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
} from '../authorized-ledger/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  canonicalBytes,
  canonicalJson,
  prepareEventWrite,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  StreamFoldGaugeError,
  StreamFoldGaugeErrorCodes,
} from './stream-fold-gauge-errors.js';
import {
  GAUGE_COMPARISON_EVENT_TYPE,
  GAUGE_RESULT_EVENT_TYPE,
} from './stream-fold-gauge-types.js';

import type {
  EventTypeDefinition,
  EventTypeRegistry,
  EventWritePreflight,
  JsonObject,
  JsonValue,
} from '../event-envelope/index.js';
import type {
  DarkGaugeComparison,
  DarkGaugeComparisonOutcome,
  GaugeEvidenceAppendInput,
  GaugeEvidenceAppendResult,
  GaugeEvidenceEnvelopeInput,
  GaugeResultEnvelope,
  LegacyGaugeSurface,
} from './stream-fold-gauge-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────────

const MAX_DIFFERING_PATHS = 256;

function isObject(value: unknown): value is JsonObject {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function hasExactFields(value: JsonObject, fields: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const expected = [...fields].sort();
  return actual.length === expected.length
    && actual.every((field, index) => field === expected[index]);
}

function decodeCanonicalPayload(
  encoded: unknown,
  digest: unknown,
): JsonObject | null {
  if (typeof encoded !== 'string' || typeof digest !== 'string') return null;
  try {
    const bytes = Buffer.from(encoded, 'base64');
    if (
      bytes.length === 0
      || bytes.toString('base64') !== encoded
      || sha256Bytes(bytes) !== digest
    ) return null;
    const parsed = JSON.parse(bytes.toString('utf8')) as unknown;
    if (!isObject(parsed) || Buffer.from(canonicalBytes(parsed)).toString('base64') !== encoded) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function validateGaugeResultPayload(payload: Readonly<JsonObject>): boolean {
  if (!hasExactFields(payload as JsonObject, [
    'gauge_id',
    'gauge_version',
    'kind',
    'result',
    'result_bytes_base64',
    'result_digest',
  ])) return false;
  if (
    payload.kind !== 'gauge-result'
    || typeof payload.gauge_id !== 'string'
    || typeof payload.gauge_version !== 'string'
    || !isObject(payload.result)
  ) return false;
  const decoded = decodeCanonicalPayload(payload.result_bytes_base64, payload.result_digest);
  return decoded !== null && canonicalJson(decoded) === canonicalJson(payload.result);
}

function validateGaugeComparisonPayload(payload: Readonly<JsonObject>): boolean {
  if (!hasExactFields(payload as JsonObject, [
    'comparison',
    'comparison_bytes_base64',
    'comparison_digest',
    'gauge_id',
    'gauge_version',
    'kind',
  ])) return false;
  if (
    payload.kind !== 'gauge-comparison'
    || typeof payload.gauge_id !== 'string'
    || typeof payload.gauge_version !== 'string'
    || !isObject(payload.comparison)
  ) return false;
  const decoded = decodeCanonicalPayload(
    payload.comparison_bytes_base64,
    payload.comparison_digest,
  );
  return decoded !== null && canonicalJson(decoded) === canonicalJson(payload.comparison);
}

function evidenceEnvelope(
  eventType: string,
  payload: JsonObject,
  input: GaugeEvidenceEnvelopeInput,
): JsonObject {
  return {
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: input.eventId,
    event_type: eventType,
    event_version: 1,
    stream_id: input.streamId,
    stream_sequence: input.streamSequence,
    occurred_at: input.occurredAt,
    recorded_at: input.recordedAt,
    producer: input.producer as unknown as JsonObject,
    authority_epoch: input.authorityEpoch,
    correlation_id: input.correlationId,
    causation_id: input.causationId,
    idempotency_key: input.idempotencyKey,
    payload,
  };
}

function collectDifferingPaths(
  left: JsonValue | undefined,
  right: JsonValue | undefined,
  path: string,
  differences: string[],
): void {
  if (differences.length >= MAX_DIFFERING_PATHS) return;
  if (left === undefined || right === undefined) {
    if (left !== right) differences.push(path);
    return;
  }
  if (canonicalJson(left) === canonicalJson(right)) return;
  if (Array.isArray(left) && Array.isArray(right)) {
    const length = Math.max(left.length, right.length);
    for (let index = 0; index < length; index += 1) {
      collectDifferingPaths(left[index], right[index], `${path}[${index}]`, differences);
    }
    return;
  }
  if (isObject(left) && isObject(right)) {
    const keys = Array.from(new Set([...Object.keys(left), ...Object.keys(right)])).sort();
    for (const key of keys) {
      collectDifferingPaths(left[key], right[key], `${path}.${key}`, differences);
    }
    return;
  }
  differences.push(path);
}

// ───────────────────────────────────────────────────────────────────
// 2. EVENT CONTRACTS
// ───────────────────────────────────────────────────────────────────

/** Return typed evidence event definitions for composition into the caller registry. */
export function gaugeEvidenceEventDefinitions(): readonly EventTypeDefinition[] {
  return Object.freeze([
    Object.freeze({
      eventType: GAUGE_RESULT_EVENT_TYPE,
      currentVersion: 1,
      versions: [{
        version: 1,
        payload: {
          requiredFields: [
            'gauge_id',
            'gauge_version',
            'kind',
            'result',
            'result_bytes_base64',
            'result_digest',
          ],
          validate: validateGaugeResultPayload,
        },
      }],
      upcasters: [],
    }),
    Object.freeze({
      eventType: GAUGE_COMPARISON_EVENT_TYPE,
      currentVersion: 1,
      versions: [{
        version: 1,
        payload: {
          requiredFields: [
            'comparison',
            'comparison_bytes_base64',
            'comparison_digest',
            'gauge_id',
            'gauge_version',
            'kind',
          ],
          validate: validateGaugeComparisonPayload,
        },
      }],
      upcasters: [],
    }),
  ]);
}

/** Prepare canonical result evidence without granting append authority. */
export function prepareGaugeResultEvidence(
  result: GaugeResultEnvelope,
  envelope: GaugeEvidenceEnvelopeInput,
  registry: EventTypeRegistry,
): EventWritePreflight {
  const bytes = canonicalBytes(result);
  return prepareEventWrite(evidenceEnvelope(GAUGE_RESULT_EVENT_TYPE, {
    kind: 'gauge-result',
    gauge_id: result.gaugeId,
    gauge_version: result.gaugeVersion,
    result: result as JsonObject,
    result_bytes_base64: Buffer.from(bytes).toString('base64'),
    result_digest: sha256Bytes(bytes),
  }, envelope), registry);
}

/** Prepare bounded comparison evidence without carrying either compared value. */
export function prepareGaugeComparisonEvidence(
  comparison: DarkGaugeComparison,
  envelope: GaugeEvidenceEnvelopeInput,
  registry: EventTypeRegistry,
): EventWritePreflight {
  const bytes = canonicalBytes(comparison);
  return prepareEventWrite(evidenceEnvelope(GAUGE_COMPARISON_EVENT_TYPE, {
    kind: 'gauge-comparison',
    gauge_id: comparison.gaugeId,
    gauge_version: comparison.gaugeVersion,
    comparison: comparison as JsonObject,
    comparison_bytes_base64: Buffer.from(bytes).toString('base64'),
    comparison_digest: sha256Bytes(bytes),
  }, envelope), registry);
}

// ───────────────────────────────────────────────────────────────────
// 3. DARK COMPARISON
// ───────────────────────────────────────────────────────────────────

/** Compute bounded parity evidence while preserving the exact legacy result reference. */
export function compareGaugeDark<TLegacy extends JsonObject>(
  surface: LegacyGaugeSurface,
  legacyResult: TLegacy,
  gaugeOutput: Readonly<JsonObject>,
  gaugeId: string,
  gaugeVersion: string,
): DarkGaugeComparisonOutcome<TLegacy> {
  const legacyBytes = canonicalBytes(legacyResult);
  const gaugeBytes = canonicalBytes(gaugeOutput);
  const differingPaths: string[] = [];
  collectDifferingPaths(legacyResult, gaugeOutput as JsonObject, '$', differingPaths);
  return Object.freeze({
    legacyResult,
    evidence: Object.freeze({
      comparisonSchemaVersion: 1,
      surface,
      gaugeId,
      gaugeVersion,
      legacyHash: sha256Bytes(legacyBytes),
      gaugeOutputHash: sha256Bytes(gaugeBytes),
      parity: differingPaths.length === 0,
      differingPaths: Object.freeze(differingPaths) as unknown as string[],
    }),
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. AUTHORIZED PUBLICATION
// ───────────────────────────────────────────────────────────────────

/** Append durable gauge evidence only after one exact gateway allow. */
export async function recordGaugeEvidence(
  gateway: TransitionAuthorizationGateway,
  ledger: AppendOnlyLedger,
  input: GaugeEvidenceAppendInput,
): Promise<GaugeEvidenceAppendResult> {
  if (
    !(gateway instanceof TransitionAuthorizationGateway)
    || !(ledger instanceof AppendOnlyLedger)
    || input.request.event.canonicalDigest !== input.event.canonicalDigest
    || input.request.event.identity.eventId !== input.event.identity.eventId
  ) {
    throw new StreamFoldGaugeError(
      StreamFoldGaugeErrorCodes.PUBLICATION_FAILED,
      'publication',
      'Gauge evidence publication requires one exact shipped gateway and ledger request',
    );
  }
  const authorization = await gateway.authorize(input.request);
  if (authorization.verdict !== 'allow') {
    throw new StreamFoldGaugeError(
      StreamFoldGaugeErrorCodes.PUBLICATION_DENIED,
      'publication',
      'Gauge evidence authorization was denied',
      { reasonCode: authorization.reasonCode },
    );
  }
  try {
    const receipt = await ledger.appendAuthorized(input.event, authorization.proof);
    return Object.freeze({ status: 'appended', receipt, event: input.event });
  } catch (error: unknown) {
    throw new StreamFoldGaugeError(
      StreamFoldGaugeErrorCodes.PUBLICATION_FAILED,
      'publication',
      'Authorized gauge evidence append failed closed',
      { cause: error instanceof Error ? error.name : 'unknown' },
    );
  }
}
