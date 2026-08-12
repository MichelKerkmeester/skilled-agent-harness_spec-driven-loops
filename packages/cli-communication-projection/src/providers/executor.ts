// ───────────────────────────────────────────────────────────────────
// MODULE: Bounded Provider Execution
// ───────────────────────────────────────────────────────────────────

import { PrivacyClasses } from '../contracts/context.js';
import { freezeExactOriginal, deepFreeze } from '../fidelity/freeze.js';
import { getProviderAdapter } from './adapters.js';
import { ProviderExecutionReasonCodes } from './types.js';
import { selectPrivacyRoute } from '../privacy/router.js';

import type { PromptProfileRecord } from '../contracts/prompt.js';
import type { ProtectedDocument, ProviderTerminalState } from '../fidelity/types.js';
import type { PrivacyRoute } from '../privacy/types.js';
import type {
  ProviderCredentialStatus,
  ProviderExecutionReasonCode,
  ProviderExecutionResult,
  ProviderModelRecord,
  ProviderTransport,
} from './types.js';

/** Dependencies for one privacy-approved, bounded provider execution. */
export interface ExecuteProviderRouteInput {
  readonly route: PrivacyRoute;
  readonly prompt: PromptProfileRecord;
  readonly document: ProtectedDocument;
  readonly transport: ProviderTransport;
  readonly credentialStatus: ProviderCredentialStatus;
  readonly now: string;
  readonly signal?: AbortSignal;
  readonly nowMs?: () => number;
}

interface AttemptCandidate {
  readonly status: 'candidate';
  readonly text: string;
  readonly inputByteCount: number;
  readonly outputByteCount: number;
}

interface AttemptFailure {
  readonly status: 'failure';
  readonly reasonCode: Exclude<ProviderExecutionReasonCode, 'none' | 'privacy-denied'>;
  readonly terminal: Exclude<ProviderTerminalState, 'success'>;
  readonly inputByteCount: number;
}

type AttemptResult = AttemptCandidate | AttemptFailure;

/** Execute only the attempts approved by the transport-free privacy router. */
export async function executeProviderRoute(
  input: ExecuteProviderRouteInput,
): Promise<ProviderExecutionResult> {
  const clock = input.nowMs ?? (() => performance.now());
  const startedAt = clock();
  const exactOriginal = freezeExactOriginal(input.document.exactOriginal);
  if (input.route.status === 'denied') {
    return exactResult({
      record: null,
      exactOriginal,
      privacyClass: input.route.evaluations[0]?.privacyClass ?? PrivacyClasses.UNKNOWN,
      attemptCount: 0,
      inputByteCount: 0,
      durationMs: elapsed(clock, startedAt),
      reasonCode: ProviderExecutionReasonCodes.PRIVACY_DENIED,
      terminal: 'error',
    });
  }
  const verifiedRoute = selectPrivacyRoute({
    records: input.route.attempts,
    candidateProviderIds: [input.route.primary.provider.providerId],
    policy: input.route.policy,
    now: input.now,
  });
  if (
    verifiedRoute.status === 'denied'
    || !sameAttemptPlan(input.route.attempts, verifiedRoute.attempts)
  ) {
    return exactResult({
      record: null,
      exactOriginal,
      privacyClass: input.route.primary.provider.privacyClass,
      attemptCount: 0,
      inputByteCount: 0,
      durationMs: elapsed(clock, startedAt),
      reasonCode: ProviderExecutionReasonCodes.PRIVACY_DENIED,
      terminal: 'error',
    });
  }
  if (input.signal?.aborted === true) {
    return exactResult({
      record: verifiedRoute.primary,
      exactOriginal,
      attemptCount: 0,
      inputByteCount: 0,
      durationMs: elapsed(clock, startedAt),
      reasonCode: ProviderExecutionReasonCodes.CANCELLED,
      terminal: 'cancelled',
    });
  }

  let attemptCount = 0;
  let lastRecord: ProviderModelRecord = verifiedRoute.primary;
  let lastFailure: AttemptFailure = {
    status: 'failure',
    reasonCode: ProviderExecutionReasonCodes.INVALID_PROVIDER,
    terminal: 'error',
    inputByteCount: 0,
  };
  for (const record of verifiedRoute.attempts) {
    attemptCount += 1;
    lastRecord = record;
    const result = await runAttempt(input, record);
    if (result.status === 'candidate') {
      return deepFreeze({
        status: 'candidate',
        reasonCode: ProviderExecutionReasonCodes.NONE,
        providerTerminal: 'success',
        providerId: record.provider.providerId,
        modelId: record.provider.modelId,
        privacyClass: record.provider.privacyClass,
        exactOriginal,
        attemptCount,
        inputByteCount: result.inputByteCount,
        outputByteCount: result.outputByteCount,
        durationMs: elapsed(clock, startedAt),
        candidateText: result.text,
      });
    }
    lastFailure = result;
    if (
      result.reasonCode === ProviderExecutionReasonCodes.CANCELLED
      || (result.reasonCode === ProviderExecutionReasonCodes.UNSUPPORTED_CONTROL
        && input.prompt.unsupportedControlBehavior === 'exact-original')
    ) {
      break;
    }
  }
  return exactResult({
    record: lastRecord,
    exactOriginal,
    attemptCount,
    inputByteCount: lastFailure.inputByteCount,
    durationMs: elapsed(clock, startedAt),
    reasonCode: lastFailure.reasonCode,
    terminal: lastFailure.terminal,
  });
}

async function runAttempt(
  input: ExecuteProviderRouteInput,
  record: ProviderModelRecord,
): Promise<AttemptResult> {
  const controller = new AbortController();
  let timedOut = false;
  const abortFromCaller = (): void => controller.abort();
  if (input.signal?.aborted === true) {
    controller.abort();
  } else {
    input.signal?.addEventListener('abort', abortFromCaller, { once: true });
  }
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, record.timeoutMs);

  const adapter = getProviderAdapter(record.family);
  const prepared = adapter.prepare({
    record,
    prompt: input.prompt,
    document: input.document,
    now: input.now,
    signal: controller.signal,
  });
  if (prepared.status === 'unsupported') {
    clearTimeout(timeout);
    input.signal?.removeEventListener('abort', abortFromCaller);
    return failure(
      prepared.reasonCode === 'unsupported-control'
        ? ProviderExecutionReasonCodes.UNSUPPORTED_CONTROL
        : ProviderExecutionReasonCodes.INVALID_PROVIDER,
      'error',
      0,
    );
  }

  const aborted = new Promise<AttemptFailure>((resolve) => {
    controller.signal.addEventListener('abort', () => {
      resolve(failure(
        timedOut
          ? ProviderExecutionReasonCodes.TIMEOUT
          : ProviderExecutionReasonCodes.CANCELLED,
        timedOut ? 'timeout' : 'cancelled',
        0,
      ));
    }, { once: true });
  });
  const operation = performTransport(input, record, prepared.request, adapter.parse);
  try {
    return await Promise.race([operation, aborted]);
  } finally {
    clearTimeout(timeout);
    input.signal?.removeEventListener('abort', abortFromCaller);
  }
}

async function performTransport(
  input: ExecuteProviderRouteInput,
  record: ProviderModelRecord,
  request: Parameters<ProviderTransport>[0],
  parse: ReturnType<typeof getProviderAdapter>['parse'],
): Promise<AttemptResult> {
  try {
    if (record.authorizationScheme === 'bearer') {
      const status = await input.credentialStatus(
        record.provider.credentialReference,
        request.signal,
      );
      if (status !== 'available') {
        return failure(
          status === 'expired'
            ? ProviderExecutionReasonCodes.EXPIRED_CREDENTIAL
            : ProviderExecutionReasonCodes.MISSING_CREDENTIAL,
          'error',
          0,
        );
      }
    }
    if (request.signal.aborted) {
      return failure(ProviderExecutionReasonCodes.CANCELLED, 'cancelled', 0);
    }
    const inputByteCount = new TextEncoder().encode(JSON.stringify(request.body)).byteLength;
    const response = await input.transport(request);
    if (request.signal.aborted) {
      return failure(ProviderExecutionReasonCodes.CANCELLED, 'cancelled', inputByteCount);
    }
    const parsed = parse(response);
    if (parsed.status === 'failure') {
      return failure(parsed.reasonCode, parsed.terminal, inputByteCount);
    }
    return Object.freeze({
      status: 'candidate',
      text: parsed.text,
      inputByteCount,
      outputByteCount: parsed.outputByteCount,
    });
  } catch (error: unknown) {
    return failure(
      request.signal.aborted
        ? ProviderExecutionReasonCodes.CANCELLED
        : ProviderExecutionReasonCodes.PROVIDER_ERROR,
      request.signal.aborted ? 'cancelled' : 'error',
      0,
    );
  }
}

interface ExactResultInput {
  readonly record: ProviderModelRecord | null;
  readonly exactOriginal: ProviderExecutionResult['exactOriginal'];
  readonly privacyClass?: ProviderExecutionResult['privacyClass'];
  readonly attemptCount: number;
  readonly inputByteCount: number;
  readonly durationMs: number;
  readonly reasonCode: Exclude<ProviderExecutionReasonCode, 'none'>;
  readonly terminal: Exclude<ProviderTerminalState, 'success'>;
}

function exactResult(input: ExactResultInput): ProviderExecutionResult {
  return deepFreeze({
    status: 'exact-original',
    reasonCode: input.reasonCode,
    providerTerminal: input.terminal,
    providerId: input.record?.provider.providerId ?? null,
    modelId: input.record?.provider.modelId ?? null,
    privacyClass: input.privacyClass
      ?? input.record?.provider.privacyClass
      ?? PrivacyClasses.UNKNOWN,
    exactOriginal: input.exactOriginal,
    attemptCount: input.attemptCount,
    inputByteCount: input.inputByteCount,
    outputByteCount: 0,
    durationMs: input.durationMs,
    candidateText: null,
  });
}

function failure(
  reasonCode: AttemptFailure['reasonCode'],
  terminal: AttemptFailure['terminal'],
  inputByteCount: number,
): AttemptFailure {
  return Object.freeze({ status: 'failure', reasonCode, terminal, inputByteCount });
}

function elapsed(clock: () => number, startedAt: number): number {
  return Math.max(0, Math.round(clock() - startedAt));
}

function sameAttemptPlan(
  expected: readonly ProviderModelRecord[],
  actual: readonly ProviderModelRecord[],
): boolean {
  return expected.length === actual.length
    && expected.every((record, index) =>
      record.provider.providerId === actual[index]?.provider.providerId);
}
