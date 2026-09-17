// ───────────────────────────────────────────────────────────────────
// MODULE: Bounded Rewrite Context Selection
// ───────────────────────────────────────────────────────────────────

import {
  ContextAbsentReasons,
} from '../contracts/context.js';
import {
  validateBoundedContext,
  validatePrivacyDecision,
} from '../contracts/validate-policy.js';
import { isRecord } from '../contracts/validator-utils.js';

import type {
  BoundedContextRecord,
  ContextAbsentReason,
  PrivacyDecision,
} from '../contracts/context.js';
import type {
  ValidationIssue,
  ValidationResult,
} from '../contracts/common.js';

/** Request-scoped transcript message made available to context selection. */
export interface TranscriptMessageView {
  readonly messageId: string;
  readonly role: 'assistant' | 'system' | 'tool' | 'user';
  readonly isMeta: boolean;
  readonly textOriginalId: string;
  readonly text: string;
}

/** Fresh point-in-time transcript view; null represents an unavailable transcript. */
export interface TranscriptView {
  readonly observedAt: string;
  readonly messages: readonly TranscriptMessageView[];
}

/** Policy and request data required for deterministic context selection. */
export interface ContextSelectionInput {
  readonly contextId: string;
  readonly transcript: TranscriptView | null;
  readonly privacy: PrivacyDecision;
  readonly now: string;
  readonly maximumAgeMs: number;
  readonly limitCodepoints: number;
  readonly noContextFallback: 'exact-original' | 'rewrite-without-context';
}

/** Contract record plus ephemeral text that callers must discard after the request. */
export interface BoundedContextSelection {
  readonly record: BoundedContextRecord;
  readonly selectedText: string | null;
}

/** Select the last non-meta user message under freshness, privacy, and size bounds. */
export function selectBoundedContext(
  input: unknown,
): ValidationResult<BoundedContextSelection> {
  const inputResult = parseInput(input);
  if (!inputResult.success) {
    return inputResult;
  }
  const request = inputResult.value;

  const privacy = deepFreeze(structuredClone(request.privacy));
  const nowMs = Date.parse(request.now);
  const transcript = request.transcript;
  const messages = transcript?.messages ?? [];
  const userMessages = messages.filter((message) => message.role === 'user');
  const eligibleMessages = userMessages.filter((message) => !message.isMeta);
  const lastUser = userMessages.at(-1) ?? null;
  const selected = eligibleMessages.at(-1) ?? null;
  const measured = selected ?? lastUser;
  const codepoints = measured === null ? [] : Array.from(measured.text);
  const selectedCodepoints = codepoints.slice(0, request.limitCodepoints);
  const truncatedText = selectedCodepoints.join('');

  const freshness = determineFreshness(transcript, nowMs, request.maximumAgeMs);
  const absentReason = determineAbsentReason(
    transcript,
    privacy,
    freshness,
    userMessages.length,
    selected,
  );
  const isPresent = absentReason === null;
  const record: BoundedContextRecord = deepFreeze({
    contractKind: 'bounded-context',
    schemaVersion: '1.0.0',
    contextId: request.contextId,
    outcome: isPresent ? 'present' : 'absent',
    selectedMessage: isPresent && selected !== null
      ? {
        messageId: selected.messageId,
        role: 'user',
        isMeta: false,
        textOriginalId: selected.textOriginalId,
      }
      : null,
    truncation: {
      unit: 'codepoints',
      limit: request.limitCodepoints,
      originalUnits: codepoints.length,
      selectedUnits: selectedCodepoints.length,
      wasTruncated: selectedCodepoints.length < codepoints.length,
    },
    privacy,
    absentReason,
    transcriptFreshness: {
      state: freshness,
      observedAt: transcript?.observedAt ?? request.now,
      maximumAgeMs: request.maximumAgeMs,
    },
    noContextFallback: request.noContextFallback,
  });

  const recordResult = validateBoundedContext(record);
  if (!recordResult.success) {
    return failure(input, recordResult.issues);
  }

  return {
    success: true,
    value: Object.freeze({
      record,
      selectedText: isPresent ? truncatedText : null,
    }),
  };
}

function parseInput(input: unknown): ValidationResult<ContextSelectionInput> {
  const issues: ValidationIssue[] = [];
  if (!isRecord(input)) {
    return failure(input, [{
      path: '$',
      code: 'type',
      message: 'Context selection input must be an object.',
    }]);
  }

  const contextId = typeof input.contextId === 'string' && input.contextId.length > 0
    ? input.contextId
    : null;
  const now = typeof input.now === 'string' && isIsoDate(input.now) ? input.now : null;
  const maximumAgeMs = typeof input.maximumAgeMs === 'number'
    && Number.isSafeInteger(input.maximumAgeMs)
    && input.maximumAgeMs >= 0
    ? input.maximumAgeMs
    : null;
  const limitCodepoints = typeof input.limitCodepoints === 'number'
    && Number.isSafeInteger(input.limitCodepoints)
    && input.limitCodepoints > 0
    ? input.limitCodepoints
    : null;
  const noContextFallback = input.noContextFallback === 'exact-original'
    || input.noContextFallback === 'rewrite-without-context'
    ? input.noContextFallback
    : null;
  requireCondition(contextId !== null, '$.contextId', 'type', issues);
  requireCondition(now !== null, '$.now', 'date', issues);
  requireCondition(maximumAgeMs !== null, '$.maximumAgeMs', 'range', issues);
  requireCondition(limitCodepoints !== null, '$.limitCodepoints', 'range', issues);
  requireCondition(
    noContextFallback !== null,
    '$.noContextFallback',
    'enum',
    issues,
  );

  const transcript = parseTranscript(input.transcript, issues);
  const privacyResult = validatePrivacyDecision(input.privacy);
  if (!privacyResult.success) {
    issues.push(...privacyResult.issues.map((issue) => ({
      ...issue,
      path: issue.path === '$' ? '$.privacy' : `$.privacy${issue.path.slice(1)}`,
    })));
  }
  if (
    issues.length > 0
    || contextId === null
    || now === null
    || maximumAgeMs === null
    || limitCodepoints === null
    || noContextFallback === null
    || transcript === undefined
    || !privacyResult.success
  ) {
    return failure(input, issues);
  }

  return {
    success: true,
    value: {
      contextId,
      transcript,
      privacy: privacyResult.value,
      now,
      maximumAgeMs,
      limitCodepoints,
      noContextFallback,
    },
  };
}

function parseTranscript(
  input: unknown,
  issues: ValidationIssue[],
): TranscriptView | null | undefined {
  if (input === null) {
    return null;
  }
  if (!isRecord(input)) {
    issues.push({
      path: '$.transcript',
      code: 'type',
      message: 'Transcript must be null or an object.',
    });
    return undefined;
  }
  const observedAt = typeof input.observedAt === 'string' && isIsoDate(input.observedAt)
    ? input.observedAt
    : null;
  requireCondition(observedAt !== null, '$.transcript.observedAt', 'date', issues);
  if (!Array.isArray(input.messages)) {
    issues.push({
      path: '$.transcript.messages',
      code: 'type',
      message: 'Transcript messages must be an array.',
    });
    return undefined;
  }

  const messages: TranscriptMessageView[] = [];
  for (const [index, messageInput] of input.messages.entries()) {
    const path = `$.transcript.messages[${index}]`;
    if (!isRecord(messageInput)) {
      issues.push({ path, code: 'type', message: 'Transcript message must be an object.' });
      continue;
    }
    const messageId = typeof messageInput.messageId === 'string'
      && messageInput.messageId.length > 0
      ? messageInput.messageId
      : null;
    const textOriginalId = typeof messageInput.textOriginalId === 'string'
      && messageInput.textOriginalId.length > 0
      ? messageInput.textOriginalId
      : null;
    const role = isTranscriptRole(messageInput.role) ? messageInput.role : null;
    const isMeta = typeof messageInput.isMeta === 'boolean' ? messageInput.isMeta : null;
    const text = typeof messageInput.text === 'string' ? messageInput.text : null;
    requireCondition(messageId !== null, `${path}.messageId`, 'type', issues);
    requireCondition(textOriginalId !== null, `${path}.textOriginalId`, 'type', issues);
    requireCondition(role !== null, `${path}.role`, 'enum', issues);
    requireCondition(isMeta !== null, `${path}.isMeta`, 'type', issues);
    requireCondition(text !== null, `${path}.text`, 'type', issues);
    if (
      messageId !== null
      && textOriginalId !== null
      && role !== null
      && isMeta !== null
      && text !== null
    ) {
      messages.push({ messageId, role, isMeta, textOriginalId, text });
    }
  }
  return observedAt === null ? undefined : { observedAt, messages };
}

function isTranscriptRole(
  value: unknown,
): value is TranscriptMessageView['role'] {
  return value === 'assistant'
    || value === 'system'
    || value === 'tool'
    || value === 'user';
}

function determineFreshness(
  transcript: TranscriptView | null,
  nowMs: number,
  maximumAgeMs: number,
): 'fresh' | 'stale' | 'unknown' {
  if (transcript === null) {
    return 'unknown';
  }
  const ageMs = nowMs - Date.parse(transcript.observedAt);
  if (ageMs < 0) {
    return 'unknown';
  }
  return ageMs > maximumAgeMs ? 'stale' : 'fresh';
}

function determineAbsentReason(
  transcript: TranscriptView | null,
  privacy: PrivacyDecision,
  freshness: 'fresh' | 'stale' | 'unknown',
  userMessageCount: number,
  selected: TranscriptMessageView | null,
): ContextAbsentReason | null {
  if (transcript === null || freshness === 'unknown') {
    return ContextAbsentReasons.TRANSCRIPT_UNAVAILABLE;
  }
  if (privacy.decision === 'deny') {
    return ContextAbsentReasons.PRIVACY_DENIED;
  }
  if (freshness === 'stale') {
    return ContextAbsentReasons.STALE_TRANSCRIPT;
  }
  if (userMessageCount === 0) {
    return ContextAbsentReasons.NO_USER_MESSAGE;
  }
  if (selected === null) {
    return ContextAbsentReasons.META_ONLY;
  }
  return null;
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)
    && !Number.isNaN(Date.parse(value));
}

function requireCondition(
  condition: boolean,
  path: string,
  code: string,
  issues: ValidationIssue[],
): void {
  if (!condition) {
    issues.push({ path, code, message: 'Context selection input is invalid.' });
  }
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

function deepFreeze<TValue>(value: TValue): TValue {
  if (typeof value !== 'object' || value === null || Object.isFrozen(value)) {
    return value;
  }
  for (const child of Object.values(value)) {
    deepFreeze(child);
  }
  return Object.freeze(value);
}
