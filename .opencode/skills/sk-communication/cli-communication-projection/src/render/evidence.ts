// ───────────────────────────────────────────────────────────────────
// MODULE: Fidelity and Render Evidence
// ───────────────────────────────────────────────────────────────────

import {
  TelemetryEventNames,
  TelemetryReasonCodes,
} from '../contracts/evidence.js';
import { isRecord } from '../contracts/validator-utils.js';
import { createCoreTelemetryEvent } from '../observability/emitter.js';
import { FidelityReasonCodes } from '../fidelity/types.js';
import { RenderReasonCodes } from './types.js';

import type { RuntimeId, ValidationIssue } from '../contracts/common.js';
import type { PrivacyClass } from '../contracts/context.js';
import type { TelemetryEvent } from '../contracts/evidence.js';
import type { FidelityOutcome, FidelityReasonCode } from '../fidelity/types.js';
import type {
  TelemetryCorrelationInput,
  TelemetryEmissionResult,
} from '../observability/emitter.js';
import type { RenderDecision, RenderReasonCode } from './types.js';

/** Closed timing, provider, privacy, and correlation values for terminal evidence. */
export interface ProjectionTelemetryOptions {
  readonly runtime: RuntimeId;
  readonly privacyClass: PrivacyClass;
  readonly providerId: string | null;
  readonly modelId: string | null;
  readonly providerMs: number;
  readonly validationMs: number;
  readonly totalMs: number;
  readonly attemptCount: number;
  readonly correlation?: TelemetryCorrelationInput;
}

const OPTION_KEYS = [
  'runtime',
  'privacyClass',
  'providerId',
  'modelId',
  'providerMs',
  'validationMs',
  'totalMs',
  'attemptCount',
  'correlation',
] as const;

/** Convert one fidelity result into validated content-free evidence. */
export function createFidelityTelemetryEvent(
  result: FidelityOutcome,
  options: unknown,
): TelemetryEmissionResult {
  const checked = validateOptions(options);
  if (checked.status === 'suppressed') {
    return checked;
  }
  return createCoreTelemetryEvent({
    eventName: TelemetryEventNames.VALIDATION_TERMINAL,
    runtime: checked.value.runtime,
    providerId: checked.value.providerId,
    modelId: checked.value.modelId,
    privacyClass: checked.value.privacyClass,
    outcome: result.status === 'accepted' ? 'accepted' : 'exact-original',
    reasonCode: fidelityTelemetryReason(result.reasonCode),
    durations: {
      assemblyMs: 0,
      providerMs: checked.value.providerMs,
      validationMs: checked.value.validationMs,
      totalMs: checked.value.totalMs,
    },
    byteCounts: {
      input: result.exactOriginal.byteLength,
      output: result.projectionByteLength,
    },
    attemptCount: checked.value.attemptCount,
    ...(checked.value.correlation === undefined
      ? {}
      : { correlation: checked.value.correlation }),
  });
}

/** Convert one render decision into validated content-free evidence. */
export function createRenderTelemetryEvent(
  result: RenderDecision,
  options: unknown,
): TelemetryEmissionResult {
  const checked = validateOptions(options);
  if (checked.status === 'suppressed') {
    return checked;
  }
  const outputBytes = result.status === 'projection'
    ? new TextEncoder().encode(result.projectionText).byteLength
    : result.exactOriginal.byteLength;
  return createCoreTelemetryEvent({
    eventName: TelemetryEventNames.PROJECTION_TERMINAL,
    runtime: checked.value.runtime,
    providerId: checked.value.providerId,
    modelId: checked.value.modelId,
    privacyClass: checked.value.privacyClass,
    outcome: result.status === 'projection' ? 'accepted' : 'exact-original',
    reasonCode: renderTelemetryReason(result.reasonCode),
    durations: {
      assemblyMs: 0,
      providerMs: checked.value.providerMs,
      validationMs: checked.value.validationMs,
      totalMs: checked.value.totalMs,
    },
    byteCounts: {
      input: result.exactOriginal.byteLength,
      output: outputBytes,
    },
    attemptCount: checked.value.attemptCount,
    ...(checked.value.correlation === undefined
      ? {}
      : { correlation: checked.value.correlation }),
  });
}

type CheckedOptions =
  | { readonly status: 'valid'; readonly value: ProjectionTelemetryOptions }
  | { readonly status: 'suppressed'; readonly reasonCode: 'invalid-evidence'; readonly issues: readonly ValidationIssue[] };

function validateOptions(options: unknown): CheckedOptions {
  if (!isRecord(options)) {
    return suppressed('$', 'type');
  }
  const unknownKey = Object.keys(options)
    .find((key) => !(OPTION_KEYS as readonly string[]).includes(key));
  if (unknownKey !== undefined) {
    return suppressed(`$.${unknownKey}`, 'unknown_key');
  }
  return { status: 'valid', value: options as unknown as ProjectionTelemetryOptions };
}

function fidelityTelemetryReason(reason: FidelityReasonCode): TelemetryEvent['reasonCode'] {
  switch (reason) {
    case FidelityReasonCodes.ACCEPTED:
      return TelemetryReasonCodes.NONE;
    case FidelityReasonCodes.CANCELLED:
    case FidelityReasonCodes.PROVIDER_CANCELLED:
      return TelemetryReasonCodes.CANCELLED;
    case FidelityReasonCodes.EMPTY_OUTPUT:
      return TelemetryReasonCodes.EMPTY_OUTPUT;
    case FidelityReasonCodes.PROVIDER_ERROR:
      return TelemetryReasonCodes.PROVIDER_ERROR;
    case FidelityReasonCodes.JUDGE_TIMEOUT:
    case FidelityReasonCodes.PROVIDER_TIMEOUT:
      return TelemetryReasonCodes.TIMEOUT;
    case FidelityReasonCodes.SOURCE_CHANGED:
    case FidelityReasonCodes.TRUNCATED_OUTPUT:
      return TelemetryReasonCodes.INCOMPLETE_SOURCE;
    case FidelityReasonCodes.INVALID_ENCODING:
    case FidelityReasonCodes.INVALID_INPUT:
    case FidelityReasonCodes.OUTPUT_LIMIT:
      return TelemetryReasonCodes.INVALID_INPUT;
    default:
      return TelemetryReasonCodes.VALIDATION_REJECTED;
  }
}

function renderTelemetryReason(reason: RenderReasonCode): TelemetryEvent['reasonCode'] {
  switch (reason) {
    case RenderReasonCodes.PROJECTION_ACCEPTED:
      return TelemetryReasonCodes.NONE;
    case RenderReasonCodes.INCOMPLETE_SOURCE:
    case RenderReasonCodes.SOURCE_CHANGED:
      return TelemetryReasonCodes.INCOMPLETE_SOURCE;
    case RenderReasonCodes.INVALID_INPUT:
      return TelemetryReasonCodes.INVALID_INPUT;
    case RenderReasonCodes.UNSUPPORTED_MODE:
      return TelemetryReasonCodes.UNSUPPORTED_CONTROL;
    case RenderReasonCodes.ORIGINAL_SELECTED:
    case RenderReasonCodes.VALIDATION_REJECTED:
      return TelemetryReasonCodes.VALIDATION_REJECTED;
  }
}

function suppressed(path: string, code: string): CheckedOptions {
  return Object.freeze({
    status: 'suppressed',
    reasonCode: 'invalid-evidence',
    issues: Object.freeze([{
      path,
      code,
      message: 'Evidence options must use only the closed content-free allowlist.',
    }]),
  });
}
