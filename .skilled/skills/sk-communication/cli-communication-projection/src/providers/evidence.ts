// ───────────────────────────────────────────────────────────────────
// MODULE: Content-Free Provider Evidence
// ───────────────────────────────────────────────────────────────────

import {
  TelemetryEventNames,
  TelemetryReasonCodes,
} from '../contracts/evidence.js';
import { createCoreTelemetryEvent } from '../observability/emitter.js';
import { ProviderExecutionReasonCodes } from './types.js';

import type { TelemetryReasonCode } from '../contracts/evidence.js';
import type { TelemetryEmissionResult } from '../observability/emitter.js';
import type {
  ProviderExecutionReasonCode,
  ProviderExecutionResult,
  ProviderTelemetryOptions,
} from './types.js';

/** Convert a terminal result into the shared closed telemetry allowlist. */
export function createProviderTelemetryEvent(
  result: ProviderExecutionResult,
  options: ProviderTelemetryOptions,
): TelemetryEmissionResult {
  return createCoreTelemetryEvent({
    eventName: TelemetryEventNames.PROVIDER_TERMINAL,
    runtime: options.runtime,
    providerId: result.providerId,
    modelId: result.modelId,
    privacyClass: result.privacyClass,
    outcome: result.status === 'candidate' ? 'accepted' : 'exact-original',
    reasonCode: telemetryReason(result.reasonCode),
    durations: {
      assemblyMs: 0,
      providerMs: result.durationMs,
      validationMs: 0,
      totalMs: Math.max(options.totalDurationMs ?? result.durationMs, result.durationMs),
    },
    byteCounts: {
      input: result.inputByteCount,
      output: result.outputByteCount,
    },
    attemptCount: result.attemptCount,
  });
}

function telemetryReason(reasonCode: ProviderExecutionReasonCode): TelemetryReasonCode {
  switch (reasonCode) {
    case ProviderExecutionReasonCodes.NONE:
      return TelemetryReasonCodes.NONE;
    case ProviderExecutionReasonCodes.CANCELLED:
      return TelemetryReasonCodes.CANCELLED;
    case ProviderExecutionReasonCodes.EMPTY_OUTPUT:
      return TelemetryReasonCodes.EMPTY_OUTPUT;
    case ProviderExecutionReasonCodes.PRIVACY_DENIED:
      return TelemetryReasonCodes.PRIVACY_DENIED;
    case ProviderExecutionReasonCodes.TIMEOUT:
      return TelemetryReasonCodes.TIMEOUT;
    case ProviderExecutionReasonCodes.UNSUPPORTED_CONTROL:
      return TelemetryReasonCodes.UNSUPPORTED_CONTROL;
    case ProviderExecutionReasonCodes.INVALID_PROVIDER:
    case ProviderExecutionReasonCodes.INVALID_RESPONSE:
      return TelemetryReasonCodes.INVALID_INPUT;
    case ProviderExecutionReasonCodes.EXPIRED_CREDENTIAL:
    case ProviderExecutionReasonCodes.MISSING_CREDENTIAL:
    case ProviderExecutionReasonCodes.PROVIDER_ERROR:
    case ProviderExecutionReasonCodes.TRUNCATED:
      return TelemetryReasonCodes.PROVIDER_ERROR;
  }
}
