// ───────────────────────────────────────────────────────────────────
// MODULE: Message Assembly Input Validation
// ───────────────────────────────────────────────────────────────────

import { RuntimeIds } from '../contracts/common.js';
import { validateExactOriginal } from '../contracts/validate-event.js';
import { isRecord } from '../contracts/validator-utils.js';

import type {
  RuntimeId,
  ValidationIssue,
  ValidationResult,
} from '../contracts/common.js';
import type {
  GenerationKey,
  MessageAssemblerOptions,
  StartGenerationInput,
} from './assembly-types.js';

/** Fully resolved finite bounds used by mutable assembler state. */
export interface ResolvedAssemblerOptions {
  readonly maxBytes: number;
  readonly maxEvents: number;
  readonly idleTimeoutMs: number;
  readonly maxAttempts: number;
  readonly maxTerminalGenerations: number;
}

/** Structurally validated ingest input whose event contracts are checked in-state. */
export interface ParsedIngestEventInput {
  readonly key: GenerationKey;
  readonly event: unknown;
  readonly original: unknown;
  readonly observedAtMs: number;
}

const DEFAULT_OPTIONS: ResolvedAssemblerOptions = Object.freeze({
  maxBytes: 4 * 1024 * 1024,
  maxEvents: 10_000,
  idleTimeoutMs: 30_000,
  maxAttempts: 3,
  maxTerminalGenerations: 1_000,
});
const OPTION_KEYS = Object.keys(DEFAULT_OPTIONS);

/** Validate constructor options and resolve every finite resource bound. */
export function parseMessageAssemblerOptions(
  input: unknown,
): ResolvedAssemblerOptions {
  if (!isRecord(input)) {
    throw new TypeError('Message assembler options must be an object.');
  }
  for (const key of Object.keys(input)) {
    if (!OPTION_KEYS.includes(key)) {
      throw new TypeError('Message assembler options contain an unknown field.');
    }
  }

  const options = input as Readonly<Record<keyof MessageAssemblerOptions, unknown>>;
  const resolved: ResolvedAssemblerOptions = {
    maxBytes: options.maxBytes ?? DEFAULT_OPTIONS.maxBytes,
    maxEvents: options.maxEvents ?? DEFAULT_OPTIONS.maxEvents,
    idleTimeoutMs: options.idleTimeoutMs ?? DEFAULT_OPTIONS.idleTimeoutMs,
    maxAttempts: options.maxAttempts ?? DEFAULT_OPTIONS.maxAttempts,
    maxTerminalGenerations:
      options.maxTerminalGenerations ?? DEFAULT_OPTIONS.maxTerminalGenerations,
  } as ResolvedAssemblerOptions;
  for (const [name, value] of Object.entries(resolved)) {
    if (!Number.isSafeInteger(value) || value <= 0) {
      throw new RangeError(`${name} must be a positive safe integer.`);
    }
  }
  return Object.freeze(resolved);
}

/** Validate a generation-open request before mutable state is allocated. */
export function parseStartGenerationInput(
  input: unknown,
): ValidationResult<StartGenerationInput> {
  if (!isRecord(input)) {
    return failure(input, [{
      path: '$',
      code: 'type',
      message: 'Generation start input must be an object.',
    }]);
  }

  const issues: ValidationIssue[] = [];
  const key = parseGenerationKey(input.key, issues);
  const startedAtMs = parseTimestamp(input.startedAtMs, '$.startedAtMs', issues);
  const originalResult = validateExactOriginal(input.exactOriginal);
  if (!originalResult.success) {
    issues.push(...prefixIssues('$.exactOriginal', originalResult.issues));
  }
  if (
    issues.length > 0
    || key === null
    || startedAtMs === null
    || !originalResult.success
  ) {
    return failure(input, issues);
  }
  return {
    success: true,
    value: {
      key,
      exactOriginal: originalResult.value,
      startedAtMs,
    },
  };
}

/** Validate the outer ingest boundary before generation-specific contract checks. */
export function parseIngestEventInput(
  input: unknown,
): ValidationResult<ParsedIngestEventInput> {
  if (!isRecord(input)) {
    return failure(input, [{
      path: '$',
      code: 'type',
      message: 'Event ingest input must be an object.',
    }]);
  }

  const issues: ValidationIssue[] = [];
  const key = parseGenerationKey(input.key, issues);
  const observedAtMs = parseTimestamp(input.observedAtMs, '$.observedAtMs', issues);
  if (issues.length > 0 || key === null || observedAtMs === null) {
    return failure(input, issues);
  }
  return {
    success: true,
    value: {
      key,
      event: input.event,
      original: input.original,
      observedAtMs,
    },
  };
}

function parseGenerationKey(
  input: unknown,
  issues: ValidationIssue[],
): GenerationKey | null {
  if (!isRecord(input)) {
    issues.push({
      path: '$.key',
      code: 'type',
      message: 'Generation key must be an object.',
    });
    return null;
  }

  const runtime = typeof input.runtime === 'string'
    && (Object.values(RuntimeIds) as readonly string[]).includes(input.runtime)
    ? input.runtime as RuntimeId
    : null;
  const sessionId = parseIdentifier(input.sessionId, '$.key.sessionId', issues);
  const turnId = parseIdentifier(input.turnId, '$.key.turnId', issues);
  const messageId = parseIdentifier(input.messageId, '$.key.messageId', issues);
  const generationId = parseIdentifier(input.generationId, '$.key.generationId', issues);
  const attempt = typeof input.attempt === 'number'
    && Number.isSafeInteger(input.attempt)
    && input.attempt >= 1
    ? input.attempt
    : null;
  if (runtime === null) {
    issues.push({
      path: '$.key.runtime',
      code: 'enum',
      message: 'Generation runtime is not supported.',
    });
  }
  if (attempt === null) {
    issues.push({
      path: '$.key.attempt',
      code: 'range',
      message: 'Generation attempt must be a positive safe integer.',
    });
  }
  if (
    runtime === null
    || sessionId === null
    || turnId === null
    || messageId === null
    || generationId === null
    || attempt === null
  ) {
    return null;
  }
  return { runtime, sessionId, turnId, messageId, generationId, attempt };
}

function parseIdentifier(
  input: unknown,
  path: string,
  issues: ValidationIssue[],
): string | null {
  if (typeof input === 'string' && input.length > 0) {
    return input;
  }
  issues.push({
    path,
    code: 'type',
    message: 'Generation identifiers must be non-empty strings.',
  });
  return null;
}

function parseTimestamp(
  input: unknown,
  path: string,
  issues: ValidationIssue[],
): number | null {
  if (typeof input === 'number' && Number.isFinite(input) && input >= 0) {
    return input;
  }
  issues.push({
    path,
    code: 'range',
    message: 'Timestamp must be a non-negative finite number.',
  });
  return null;
}

function prefixIssues(
  prefix: string,
  issues: readonly ValidationIssue[],
): ValidationIssue[] {
  return issues.map((issue) => ({
    ...issue,
    path: issue.path === '$' ? prefix : `${prefix}${issue.path.slice(1)}`,
  }));
}

function failure(
  originalInput: unknown,
  issues: readonly ValidationIssue[],
): ValidationResult<never> {
  return {
    success: false,
    issues: Object.freeze([...issues]),
    originalInput,
  };
}
