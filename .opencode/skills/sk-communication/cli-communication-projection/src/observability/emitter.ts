// ───────────────────────────────────────────────────────────────────
// MODULE: Content-Free Lifecycle Evidence
// ───────────────────────────────────────────────────────────────────

import { createHmac } from 'node:crypto';

import {
  TelemetryEventNames,
  TelemetryReasonCodes,
} from '../contracts/evidence.js';
import { validateTelemetryEvent } from '../contracts/validate-evidence.js';
import { isRecord } from '../contracts/validator-utils.js';
import { AssemblyReasonCodes } from '../core/assembly-types.js';

import type { PrivacyClass } from '../contracts/context.js';
import type { TelemetryEvent } from '../contracts/evidence.js';
import type { ValidationIssue } from '../contracts/common.js';
import type { AssemblyTerminalResult } from '../core/assembly-types.js';

/** Optional rotating HMAC input used for unlinkable correlation. */
export interface TelemetryCorrelationInput {
  readonly value: string | Uint8Array;
  readonly hmacKey: string | Uint8Array;
  readonly rotationId: string;
}

/** Closed input shape accepted by the core telemetry emitter. */
export interface CoreTelemetryInput {
  readonly eventName: TelemetryEvent['eventName'];
  readonly runtime: TelemetryEvent['runtime'];
  readonly providerId: string | null;
  readonly modelId: string | null;
  readonly privacyClass: TelemetryEvent['privacyClass'];
  readonly outcome: TelemetryEvent['outcome'];
  readonly reasonCode: TelemetryEvent['reasonCode'];
  readonly durations: TelemetryEvent['durations'];
  readonly byteCounts: TelemetryEvent['byteCounts'];
  readonly attemptCount: number;
  readonly correlation?: TelemetryCorrelationInput;
}

/** Successful evidence creation. */
export interface EmittedTelemetry {
  readonly status: 'emitted';
  readonly event: TelemetryEvent;
}

/** Content-free reason why an evidence event was not emitted. */
export interface SuppressedTelemetry {
  readonly status: 'suppressed';
  readonly reasonCode: 'invalid-evidence' | 'sink-failed';
  readonly issues: readonly ValidationIssue[];
}

/** Result of evidence construction or delivery. */
export type TelemetryEmissionResult = EmittedTelemetry | SuppressedTelemetry;

/** Sink that receives only validated allowlisted telemetry records. */
export type TelemetrySink = (event: TelemetryEvent) => void;

/** Optional privacy and correlation values for an assembly terminal event. */
export interface AssemblyTelemetryOptions {
  readonly privacyClass: PrivacyClass;
  readonly providerId?: string | null;
  readonly modelId?: string | null;
  readonly correlation?: TelemetryCorrelationInput;
}

const INPUT_KEYS = [
  'eventName',
  'runtime',
  'providerId',
  'modelId',
  'privacyClass',
  'outcome',
  'reasonCode',
  'durations',
  'byteCounts',
  'attemptCount',
  'correlation',
] as const;
const CORRELATION_KEYS = ['value', 'hmacKey', 'rotationId'] as const;
const SAFE_IDENTIFIER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,191}$/;

/** Build a validated telemetry event while rejecting every non-allowlisted field. */
export function createCoreTelemetryEvent(input: unknown): TelemetryEmissionResult {
  if (!isRecord(input)) {
    return suppressed('invalid-evidence', [{
      path: '$',
      code: 'type',
      message: 'Telemetry input must be an object.',
    }]);
  }

  const issues: ValidationIssue[] = [];
  for (const key of Object.keys(input)) {
    if (!(INPUT_KEYS as readonly string[]).includes(key)) {
      issues.push({
        path: `$.${key}`,
        code: 'unknown_key',
        message: 'Field is not permitted at the telemetry boundary.',
      });
    }
  }
  const correlation = createCorrelation(input.correlation, issues);
  if (issues.length > 0) {
    return suppressed('invalid-evidence', issues);
  }

  const candidate = {
    contractKind: 'telemetry',
    schemaVersion: '1.0.0',
    eventName: input.eventName,
    runtime: input.runtime,
    providerId: input.providerId ?? null,
    modelId: input.modelId ?? null,
    privacyClass: input.privacyClass,
    outcome: input.outcome,
    reasonCode: input.reasonCode,
    durations: input.durations,
    byteCounts: input.byteCounts,
    attemptCount: input.attemptCount,
    correlationDigest: correlation?.digest ?? null,
    keyRotationId: correlation?.rotationId ?? null,
  };
  const result = validateTelemetryEvent(candidate);
  if (!result.success) {
    return suppressed('invalid-evidence', result.issues);
  }
  return Object.freeze({
    status: 'emitted',
    event: deepFreeze(structuredClone(result.value)),
  });
}

/** Deliver one validated event and suppress sink failures without copying messages. */
export function emitCoreTelemetry(
  input: unknown,
  sink: TelemetrySink,
): TelemetryEmissionResult {
  const result = createCoreTelemetryEvent(input);
  if (result.status === 'suppressed') {
    return result;
  }
  try {
    sink(result.event);
    return result;
  } catch (error: unknown) {
    return suppressed('sink-failed', [{
      path: '$',
      code: 'sink_failed',
      message: 'Telemetry sink rejected the validated event.',
    }]);
  }
}

/** Convert an assembly terminal result into closed, content-free telemetry. */
export function createAssemblyTelemetryEvent(
  result: AssemblyTerminalResult,
  options: AssemblyTelemetryOptions,
): TelemetryEmissionResult {
  const reasonCode = toTelemetryReason(result);
  const input = {
    eventName: TelemetryEventNames.ASSEMBLY_TERMINAL,
    runtime: result.key.runtime,
    providerId: options.providerId ?? null,
    modelId: options.modelId ?? null,
    privacyClass: options.privacyClass,
    outcome: result.status === 'completed' ? 'accepted' : 'exact-original',
    reasonCode,
    durations: {
      assemblyMs: result.durationMs,
      providerMs: 0,
      validationMs: 0,
      totalMs: result.durationMs,
    },
    byteCounts: {
      input: result.inputByteCount,
      output: result.outputByteCount,
    },
    attemptCount: result.key.attempt,
    ...(options.correlation === undefined
      ? {}
      : { correlation: options.correlation }),
  };
  return createCoreTelemetryEvent(input);
}

function createCorrelation(
  input: unknown,
  issues: ValidationIssue[],
): { readonly digest: string; readonly rotationId: string } | null {
  if (input === undefined) {
    return null;
  }
  if (!isRecord(input)) {
    issues.push({
      path: '$.correlation',
      code: 'type',
      message: 'Correlation input must be an object.',
    });
    return null;
  }
  for (const key of Object.keys(input)) {
    if (!(CORRELATION_KEYS as readonly string[]).includes(key)) {
      issues.push({
        path: `$.correlation.${key}`,
        code: 'unknown_key',
        message: 'Field is not permitted in correlation input.',
      });
    }
  }

  const value = input.value;
  const hmacKey = input.hmacKey;
  const rotationId = input.rotationId;
  const valueValid = typeof value === 'string' || value instanceof Uint8Array;
  const keyValid = (typeof hmacKey === 'string' && hmacKey.length > 0)
    || (hmacKey instanceof Uint8Array && hmacKey.byteLength > 0);
  const rotationValid = typeof rotationId === 'string'
    && SAFE_IDENTIFIER_PATTERN.test(rotationId);
  if (!valueValid) {
    issues.push({
      path: '$.correlation.value',
      code: 'type',
      message: 'Correlation value must be bytes or a string.',
    });
  }
  if (!keyValid) {
    issues.push({
      path: '$.correlation.hmacKey',
      code: 'type',
      message: 'Correlation HMAC key must be non-empty.',
    });
  }
  if (!rotationValid) {
    issues.push({
      path: '$.correlation.rotationId',
      code: 'type',
      message: 'Rotation identifier must be a bounded safe identifier.',
    });
  }
  if (!valueValid || !keyValid || !rotationValid) {
    return null;
  }

  const digest = createHmac('sha256', hmacKey).update(value).digest('hex');
  return Object.freeze({
    digest: `hmac-sha256:${digest}`,
    rotationId,
  });
}

function toTelemetryReason(
  result: AssemblyTerminalResult,
): TelemetryEvent['reasonCode'] {
  switch (result.reasonCode) {
    case AssemblyReasonCodes.COMPLETED:
      return TelemetryReasonCodes.NONE;
    case AssemblyReasonCodes.CANCELLED:
      return TelemetryReasonCodes.CANCELLED;
    case AssemblyReasonCodes.TIMEOUT:
      return TelemetryReasonCodes.TIMEOUT;
    case AssemblyReasonCodes.EMPTY_OUTPUT:
      return TelemetryReasonCodes.EMPTY_OUTPUT;
    case AssemblyReasonCodes.SOURCE_FAILED:
      return TelemetryReasonCodes.INCOMPLETE_SOURCE;
    case AssemblyReasonCodes.BYTE_LIMIT:
    case AssemblyReasonCodes.CONFLICTING_DUPLICATE:
    case AssemblyReasonCodes.CORRUPT_ENCODING:
    case AssemblyReasonCodes.EVENT_LIMIT:
    case AssemblyReasonCodes.INVALID_INPUT:
    case AssemblyReasonCodes.RETRY_LIMIT:
      return TelemetryReasonCodes.INVALID_INPUT;
  }
}

function suppressed(
  reasonCode: SuppressedTelemetry['reasonCode'],
  issues: readonly ValidationIssue[],
): SuppressedTelemetry {
  return Object.freeze({
    status: 'suppressed',
    reasonCode,
    issues: Object.freeze([...issues]),
  });
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
