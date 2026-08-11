// ───────────────────────────────────────────────────────────────────
// MODULE: Fidelity Validation Pipeline
// ───────────────────────────────────────────────────────────────────

import { createSha256Digest, decodeExactOriginal } from '../contracts/exact-original.js';
import { validateExactOriginal } from '../contracts/validate-event.js';
import { isRecord } from '../contracts/validator-utils.js';
import {
  createMarkdownStructureSignature,
  hasUnpairedSurrogate,
} from './dialect.js';
import { deepFreeze, freezeExactOriginal } from './freeze.js';
import { restoreProtectedSpans } from './protected-spans.js';
import {
  compareSemanticMeaning,
  countContentCodepoints,
  isUnexpectedRefusal,
} from './semantics.js';
import { FidelityReasonCodes } from './types.js';

import type { ValidationIssue } from '../contracts/common.js';
import type { ExactOriginalRecord } from '../contracts/exact-original.js';
import type {
  FidelityCheck,
  FidelityInputRejection,
  FidelityOutcome,
  FidelityReasonCode,
  FidelityValidationResult,
  ProjectionValidationInput,
  ProtectedDocument,
  ProviderTerminalState,
  RejectOnlyJudge,
} from './types.js';

const INPUT_KEYS = [
  'protection',
  'candidateText',
  'providerTerminal',
  'allPartsComplete',
  'currentSourceSha256',
  'judgeMode',
  'maximumOutputBytes',
  'minimumContentRatio',
  'judgeTimeoutMs',
  'signal',
] as const;
const PROVIDER_TERMINALS: readonly ProviderTerminalState[] = [
  'cancelled',
  'error',
  'success',
  'timeout',
  'truncated',
];
const SHA256_PATTERN = /^sha256:[a-f0-9]{64}$/u;
const DEFAULT_JUDGE_TIMEOUT_MS = 30_000;
const DEFAULT_MINIMUM_CONTENT_RATIO = 0.2;
const MAX_OUTPUT_BYTES = 64 * 1024 * 1024;

/** Validate a protected provider candidate and select acceptance or exact original. */
export async function validateProjectionCandidate(
  input: unknown,
  judge?: RejectOnlyJudge,
): Promise<FidelityValidationResult> {
  try {
    return await validateProjectionCandidateInternal(input, judge);
  } catch (error: unknown) {
    try {
      if (isRecord(input) && isRecord(input.protection)) {
        const exactResult = validateExactOriginal(input.protection.exactOriginal);
        if (exactResult.success) {
          return fallbackFromExactOriginal(
            exactResult.value,
            FidelityReasonCodes.VALIDATOR_FAILED,
            [],
            null,
            null,
          );
        }
      }
    } catch (recoveryError: unknown) {
      return rejectedInput([issue('$', 'validator_failed', 'Validation failed closed.')]);
    }
    return rejectedInput([issue('$', 'validator_failed', 'Validation failed closed.')]);
  }
}

async function validateProjectionCandidateInternal(
  input: unknown,
  judge?: RejectOnlyJudge,
): Promise<FidelityValidationResult> {
  if (!isRecord(input) || !isRecord(input.protection)) {
    return rejectedInput([issue('$', 'type', 'Validation input and protection are required.')]);
  }
  const protection = input.protection as unknown as ProtectedDocument;
  const originalResult = validateExactOriginal(protection.exactOriginal);
  if (!originalResult.success) {
    return rejectedInput(prefixIssues('$.protection.exactOriginal', originalResult.issues));
  }

  const inputIssues = validateInput(input);
  if (inputIssues.length > 0) {
    return fallbackFromExactOriginal(
      originalResult.value,
      FidelityReasonCodes.INVALID_INPUT,
      [],
      null,
      null,
    );
  }
  const request = input as unknown as ProjectionValidationInput;
  const checks: FidelityCheck[] = [];

  if (request.signal?.aborted === true) {
    return fallback(protection, FidelityReasonCodes.CANCELLED, checks, null, null);
  }
  if (request.currentSourceSha256 !== protection.sourceSha256) {
    return fallback(protection, FidelityReasonCodes.SOURCE_CHANGED, checks, 1, 0);
  }

  const providerFailure = providerFailureReason(request.providerTerminal);
  if (providerFailure !== null) {
    return fallback(protection, providerFailure, checks, null, null);
  }
  if (!request.allPartsComplete) {
    return fallback(protection, FidelityReasonCodes.TRUNCATED_OUTPUT, checks, 1, 0);
  }
  if (request.candidateText.trim().length === 0) {
    return fallback(protection, FidelityReasonCodes.EMPTY_OUTPUT, checks, 1, 0);
  }
  if (hasUnpairedSurrogate(request.candidateText)) {
    return fallback(protection, FidelityReasonCodes.INVALID_ENCODING, checks, null, null);
  }

  const candidateBytes = new TextEncoder().encode(request.candidateText);
  const maximumOutputBytes = request.maximumOutputBytes
    ?? Math.min(
      MAX_OUTPUT_BYTES,
      Math.max(protection.sourceByteLength * 4, protection.sourceByteLength + 65_536),
    );
  if (candidateBytes.byteLength > maximumOutputBytes) {
    return fallback(
      protection,
      FidelityReasonCodes.OUTPUT_LIMIT,
      checks,
      maximumOutputBytes,
      candidateBytes.byteLength,
    );
  }

  const restored = restoreProtectedSpans(protection, request.candidateText);
  if (restored.status === 'rejected') {
    if ('issues' in restored) {
      return fallbackFromExactOriginal(
        originalResult.value,
        FidelityReasonCodes.INVALID_INPUT,
        [],
        null,
        null,
      );
    }
    return deepFreeze({
      status: 'exact-original',
      reasonCode: restored.reasonCode,
      sourceSha256: protection.sourceSha256,
      projectionSha256: null,
      projectionByteLength: protection.exactOriginal.byteLength,
      projectionText: null,
      validationProfileVersion: 'fidelity/1.0.0',
      exactOriginal: protection.exactOriginal,
      checks: restored.checks,
    });
  }
  checks.push(...restored.checks);

  let sourceText: string;
  try {
    sourceText = new TextDecoder('utf-8', { fatal: true })
      .decode(decodeExactOriginal(protection.exactOriginal));
  } catch (error: unknown) {
    return fallback(protection, FidelityReasonCodes.INVALID_ENCODING, checks, null, null);
  }

  if (restored.text !== sourceText) {
    if (isUnexpectedRefusal(sourceText, restored.text)) {
      return fallback(protection, FidelityReasonCodes.REFUSAL_OUTPUT, checks, 0, 1);
    }
    const minimumRatio = request.minimumContentRatio ?? DEFAULT_MINIMUM_CONTENT_RATIO;
    const sourceContent = countContentCodepoints(sourceText);
    const candidateContent = countContentCodepoints(restored.text);
    if (sourceContent > 0 && candidateContent / sourceContent < minimumRatio) {
      return fallback(
        protection,
        FidelityReasonCodes.TRUNCATED_OUTPUT,
        checks,
        Math.ceil(sourceContent * minimumRatio),
        candidateContent,
      );
    }

    const sourceStructure = createMarkdownStructureSignature(sourceText);
    const candidateStructure = createMarkdownStructureSignature(restored.text);
    if (sourceStructure !== candidateStructure) {
      return fallback(
        protection,
        FidelityReasonCodes.MARKDOWN_STRUCTURE_CHANGED,
        checks,
        1,
        0,
      );
    }

    const semanticDifference = compareSemanticMeaning(sourceText, restored.text);
    if (semanticDifference !== null) {
      return fallback(
        protection,
        semanticDifference.reasonCode,
        checks,
        semanticDifference.expectedCount,
        semanticDifference.actualCount,
      );
    }
  }
  checks.push(passed(FidelityReasonCodes.MARKDOWN_STRUCTURE_CHANGED));
  checks.push(passed(FidelityReasonCodes.FACT_ADDED));
  checks.push(passed(FidelityReasonCodes.POLARITY_CHANGED));
  checks.push(passed(FidelityReasonCodes.REQUIREMENT_STRENGTH_CHANGED));
  checks.push(passed(FidelityReasonCodes.PRIORITY_CHANGED));

  if (request.judgeMode === 'required') {
    if (judge === undefined) {
      return fallback(protection, FidelityReasonCodes.JUDGE_UNAVAILABLE, checks, 1, 0);
    }
    const judgeResult = await runJudge(
      judge,
      sourceText,
      restored.text,
      request.judgeTimeoutMs ?? DEFAULT_JUDGE_TIMEOUT_MS,
      request.signal,
    );
    if (judgeResult !== 'accept') {
      return fallback(protection, judgeReason(judgeResult), checks, 1, 0);
    }
    checks.push(passed(FidelityReasonCodes.JUDGE_REJECTED));
  }

  const projectionBytes = new TextEncoder().encode(restored.text);
  checks.push(passed(FidelityReasonCodes.ACCEPTED));
  return deepFreeze({
    status: 'accepted',
    reasonCode: FidelityReasonCodes.ACCEPTED,
    sourceSha256: protection.sourceSha256,
    projectionSha256: createSha256Digest(projectionBytes),
    projectionByteLength: projectionBytes.byteLength,
    projectionText: restored.text,
    validationProfileVersion: 'fidelity/1.0.0',
    exactOriginal: protection.exactOriginal,
    checks,
  });
}

function validateInput(input: Record<string, unknown>): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const key of Object.keys(input)) {
    if (!(INPUT_KEYS as readonly string[]).includes(key)) {
      issues.push(issue(`$.${key}`, 'unknown_key', 'Field is not permitted at this boundary.'));
    }
  }
  if (typeof input.candidateText !== 'string') {
    issues.push(issue('$.candidateText', 'type', 'Candidate text must be a string.'));
  }
  if (
    typeof input.providerTerminal !== 'string'
    || !PROVIDER_TERMINALS.includes(input.providerTerminal as ProviderTerminalState)
  ) {
    issues.push(issue('$.providerTerminal', 'enum', 'Provider terminal state is invalid.'));
  }
  if (typeof input.allPartsComplete !== 'boolean') {
    issues.push(issue('$.allPartsComplete', 'type', 'Part completeness must be boolean.'));
  }
  if (
    typeof input.currentSourceSha256 !== 'string'
    || !SHA256_PATTERN.test(input.currentSourceSha256)
  ) {
    issues.push(issue('$.currentSourceSha256', 'digest', 'Current source digest is invalid.'));
  }
  if (input.judgeMode !== 'disabled' && input.judgeMode !== 'required') {
    issues.push(issue('$.judgeMode', 'enum', 'Judge mode is invalid.'));
  }
  validateOptionalInteger(input.maximumOutputBytes, '$.maximumOutputBytes', 1, MAX_OUTPUT_BYTES, issues);
  validateOptionalNumber(input.minimumContentRatio, '$.minimumContentRatio', 0.01, 1, issues);
  validateOptionalInteger(input.judgeTimeoutMs, '$.judgeTimeoutMs', 1, 120_000, issues);
  if (input.signal !== undefined && !isAbortSignal(input.signal)) {
    issues.push(issue('$.signal', 'type', 'Signal must implement the AbortSignal contract.'));
  }
  return issues;
}

function providerFailureReason(
  terminal: ProviderTerminalState,
): Exclude<FidelityReasonCode, 'accepted'> | null {
  switch (terminal) {
    case 'success':
      return null;
    case 'error':
      return FidelityReasonCodes.PROVIDER_ERROR;
    case 'cancelled':
      return FidelityReasonCodes.PROVIDER_CANCELLED;
    case 'timeout':
      return FidelityReasonCodes.PROVIDER_TIMEOUT;
    case 'truncated':
      return FidelityReasonCodes.TRUNCATED_OUTPUT;
  }
}

type JudgeRunResult = 'accept' | 'cancelled' | 'failed' | 'reject' | 'timeout';

async function runJudge(
  judge: RejectOnlyJudge,
  sourceText: string,
  candidateText: string,
  timeoutMs: number,
  externalSignal?: AbortSignal,
): Promise<JudgeRunResult> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let removeAbortListener: (() => void) | undefined;
  const judgePromise = Promise.resolve()
    .then(() => judge({ sourceText, candidateText, signal: controller.signal }))
    .then((result): JudgeRunResult => result === 'accept' || result === 'reject' ? result : 'failed')
    .catch((): JudgeRunResult => 'failed');
  const timeoutPromise = new Promise<JudgeRunResult>((resolve) => {
    timer = setTimeout(() => {
      controller.abort();
      resolve('timeout');
    }, timeoutMs);
  });
  const cancellationPromise = new Promise<JudgeRunResult>((resolve) => {
    if (externalSignal === undefined) {
      return;
    }
    const onAbort = (): void => {
      controller.abort();
      resolve('cancelled');
    };
    externalSignal.addEventListener('abort', onAbort, { once: true });
    removeAbortListener = () => externalSignal.removeEventListener('abort', onAbort);
  });

  try {
    return await Promise.race([judgePromise, timeoutPromise, cancellationPromise]);
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    removeAbortListener?.();
  }
}

function judgeReason(result: Exclude<JudgeRunResult, 'accept'>): Exclude<FidelityReasonCode, 'accepted'> {
  switch (result) {
    case 'reject':
      return FidelityReasonCodes.JUDGE_REJECTED;
    case 'timeout':
      return FidelityReasonCodes.JUDGE_TIMEOUT;
    case 'cancelled':
      return FidelityReasonCodes.CANCELLED;
    case 'failed':
      return FidelityReasonCodes.JUDGE_FAILED;
  }
}

function fallback(
  protection: ProtectedDocument,
  reasonCode: Exclude<FidelityReasonCode, 'accepted'>,
  checks: readonly FidelityCheck[],
  expectedCount: number | null,
  actualCount: number | null,
): FidelityOutcome {
  return fallbackFromExactOriginal(
    protection.exactOriginal,
    reasonCode,
    checks,
    expectedCount,
    actualCount,
  );
}

function fallbackFromExactOriginal(
  exactOriginal: ExactOriginalRecord,
  reasonCode: Exclude<FidelityReasonCode, 'accepted'>,
  checks: readonly FidelityCheck[],
  expectedCount: number | null,
  actualCount: number | null,
): FidelityOutcome {
  const safeExactOriginal = freezeExactOriginal(exactOriginal);
  return deepFreeze({
    status: 'exact-original',
    reasonCode,
    sourceSha256: safeExactOriginal.sha256,
    projectionSha256: null,
    projectionByteLength: safeExactOriginal.byteLength,
    projectionText: null,
    validationProfileVersion: 'fidelity/1.0.0',
    exactOriginal: safeExactOriginal,
    checks: [...checks, {
      ruleId: reasonCode,
      status: 'failed',
      expectedCount,
      actualCount,
    }],
  });
}

function passed(ruleId: FidelityReasonCode): FidelityCheck {
  return Object.freeze({
    ruleId,
    status: 'passed',
    expectedCount: null,
    actualCount: null,
  });
}

function rejectedInput(issues: readonly ValidationIssue[]): FidelityInputRejection {
  return deepFreeze({ status: 'rejected', reasonCode: 'invalid-input', issues: [...issues] });
}

function validateOptionalInteger(
  value: unknown,
  path: string,
  minimum: number,
  maximum: number,
  issues: ValidationIssue[],
): void {
  if (
    value !== undefined
    && (typeof value !== 'number'
      || !Number.isInteger(value)
      || value < minimum
      || value > maximum)
  ) {
    issues.push(issue(path, 'range', 'Expected a bounded integer.'));
  }
}

function validateOptionalNumber(
  value: unknown,
  path: string,
  minimum: number,
  maximum: number,
  issues: ValidationIssue[],
): void {
  if (
    value !== undefined
    && (typeof value !== 'number'
      || !Number.isFinite(value)
      || value < minimum
      || value > maximum)
  ) {
    issues.push(issue(path, 'range', 'Expected a bounded finite number.'));
  }
}

function isAbortSignal(value: unknown): value is AbortSignal {
  return isRecord(value)
    && typeof value.aborted === 'boolean'
    && typeof value.addEventListener === 'function'
    && typeof value.removeEventListener === 'function';
}

function issue(path: string, code: string, message: string): ValidationIssue {
  return Object.freeze({ path, code, message });
}

function prefixIssues(
  path: string,
  issues: readonly ValidationIssue[],
): ValidationIssue[] {
  return issues.map((entry) => ({
    ...entry,
    path: `${path}${entry.path === '$' ? '' : entry.path.slice(1)}`,
  }));
}
