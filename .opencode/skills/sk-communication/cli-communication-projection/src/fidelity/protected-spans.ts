// ───────────────────────────────────────────────────────────────────
// MODULE: Protected Span Codec
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';

import { createSha256Digest, decodeExactOriginal } from '../contracts/exact-original.js';
import { validateExactOriginal } from '../contracts/validate-event.js';
import { isRecord } from '../contracts/validator-utils.js';
import { collectProtectedRanges, hasUnpairedSurrogate } from './dialect.js';
import { deepFreeze, freezeExactOriginal } from './freeze.js';
import {
  FidelityReasonCodes,
  ProtectedMarkdownDialect,
  ProtectedSpanKinds,
} from './types.js';

import type { ValidationIssue } from '../contracts/common.js';
import type {
  FidelityCheck,
  FidelityInputRejection,
  FidelityReasonCode,
  ProtectMarkdownResult,
  ProtectedDocument,
  ProtectedSpan,
  RestoreProtectedSpansResult,
} from './types.js';

const PROTECT_INPUT_KEYS = ['sourceText', 'exactOriginal', 'configuredLiterals'] as const;
const TOKEN_SCAN = /⟦pcp:v1:[^:⟧]+:\d+:[^⟧]+⟧/gu;
const SHA256_PATTERN = /^sha256:[a-f0-9]{64}$/u;
const MAX_CONFIGURED_LITERALS = 256;
const MAX_CONFIGURED_LITERAL_LENGTH = 4096;

/** Protect exact technical spans before a candidate leaves the trusted boundary. */
export function protectMarkdown(input: unknown): ProtectMarkdownResult {
  if (!isRecord(input)) {
    return rejectedInput([issue('$', 'type', 'Protection input must be an object.')]);
  }

  const exactResult = validateExactOriginal(input.exactOriginal);
  if (!exactResult.success) {
    return rejectedInput(prefixIssues('$.exactOriginal', exactResult.issues));
  }
  const exactOriginal = freezeExactOriginal(exactResult.value);
  const issues = validateProtectInput(input);
  if (issues.length > 0) {
    return protectionFallback(exactOriginal, FidelityReasonCodes.INVALID_INPUT, issues);
  }

  const sourceText = input.sourceText as string;
  if (hasUnpairedSurrogate(sourceText)) {
    return protectionFallback(exactOriginal, FidelityReasonCodes.INVALID_ENCODING, [
      issue('$.sourceText', 'encoding', 'Source text must contain valid Unicode scalar values.'),
    ]);
  }
  const sourceBytes = new TextEncoder().encode(sourceText);
  if (
    sourceBytes.byteLength !== exactOriginal.byteLength
    || createSha256Digest(sourceBytes) !== exactOriginal.sha256
  ) {
    return protectionFallback(exactOriginal, FidelityReasonCodes.SOURCE_CHANGED, [
      issue('$.sourceText', 'source_digest', 'Source text does not match the stored original.'),
    ]);
  }

  const configuredLiterals = input.configuredLiterals === undefined
    ? []
    : input.configuredLiterals as readonly string[];
  const ranges = collectProtectedRanges(sourceText, configuredLiterals);
  const namespace = createCollisionFreeNamespace(sourceText);
  const spans: ProtectedSpan[] = [];
  const encodedParts: string[] = [];
  let charCursor = 0;
  let byteCursor = 0;

  for (const [index, range] of ranges.entries()) {
    const prose = sourceText.slice(charCursor, range.start);
    encodedParts.push(prose);
    byteCursor += new TextEncoder().encode(prose).byteLength;

    const spanText = sourceText.slice(range.start, range.end);
    const bytes = new TextEncoder().encode(spanText);
    const sha256 = createSha256Digest(bytes);
    const token = createToken(namespace, index, sha256);
    encodedParts.push(token);
    spans.push(deepFreeze({
      index,
      kind: range.kind,
      charStart: range.start,
      charEnd: range.end,
      byteStart: byteCursor,
      byteEnd: byteCursor + bytes.byteLength,
      byteLength: bytes.byteLength,
      bytesBase64: Buffer.from(bytes).toString('base64'),
      sha256,
      token,
    }));
    byteCursor += bytes.byteLength;
    charCursor = range.end;
  }
  encodedParts.push(sourceText.slice(charCursor));

  const document: ProtectedDocument = deepFreeze({
    dialect: ProtectedMarkdownDialect,
    namespace,
    sourceSha256: exactOriginal.sha256,
    sourceByteLength: exactOriginal.byteLength,
    encodedText: encodedParts.join(''),
    spans,
    configuredLiteralCount: configuredLiterals.length,
    exactOriginal,
  });
  return Object.freeze({ status: 'protected', document });
}

/** Restore exact span bytes only when set, count, order, and identity all match. */
export function restoreProtectedSpans(
  document: ProtectedDocument,
  candidateText: string,
): RestoreProtectedSpansResult | FidelityInputRejection {
  const documentIssues = validateProtectedDocument(document);
  if (documentIssues.length > 0) {
    return rejectedInput(documentIssues);
  }
  if (typeof candidateText !== 'string') {
    return protectedRejection(document, FidelityReasonCodes.INVALID_INPUT, null, null);
  }
  if (hasUnpairedSurrogate(candidateText)) {
    return protectedRejection(document, FidelityReasonCodes.INVALID_ENCODING, null, null);
  }

  const expected = document.spans.map((span) => span.token);
  const actual = [...candidateText.matchAll(TOKEN_SCAN)].map((match) => match[0]);
  const actualCounts = countValues(actual);
  if (expected.some((token) => (actualCounts.get(token) ?? 0) > 1)) {
    return protectedRejection(
      document,
      FidelityReasonCodes.PLACEHOLDER_DUPLICATE,
      expected.length,
      actual.length,
    );
  }

  const changed = document.spans.some((span) =>
    !actualCounts.has(span.token)
      && candidateText.includes(`⟦pcp:v1:${document.namespace}:${span.index}:`));
  if (changed) {
    return protectedRejection(
      document,
      FidelityReasonCodes.PLACEHOLDER_CHANGED,
      expected.length,
      actual.length,
    );
  }

  const expectedSet = new Set(expected);
  if (actual.some((token) => !expectedSet.has(token))) {
    return protectedRejection(
      document,
      FidelityReasonCodes.PLACEHOLDER_UNEXPECTED,
      expected.length,
      actual.length,
    );
  }
  if (expected.some((token) => !actualCounts.has(token))) {
    return protectedRejection(
      document,
      FidelityReasonCodes.PLACEHOLDER_MISSING,
      expected.length,
      actual.length,
    );
  }
  if (actual.some((token, index) => token !== expected[index])) {
    return protectedRejection(
      document,
      FidelityReasonCodes.PLACEHOLDER_REORDERED,
      expected.length,
      actual.length,
    );
  }

  const replacements = new Map<string, string>();
  for (const span of document.spans) {
    const bytes = Uint8Array.from(Buffer.from(span.bytesBase64, 'base64'));
    if (
      bytes.byteLength !== span.byteLength
      || createSha256Digest(bytes) !== span.sha256
    ) {
      return protectedRejection(
        document,
        FidelityReasonCodes.PROTECTED_BYTES_CHANGED,
        span.byteLength,
        bytes.byteLength,
      );
    }
    try {
      replacements.set(span.token, new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    } catch (error: unknown) {
      return protectedRejection(document, FidelityReasonCodes.INVALID_ENCODING, null, null);
    }
  }

  const text = candidateText.replace(TOKEN_SCAN, (token) => replacements.get(token) ?? token);
  const bytes = new TextEncoder().encode(text);
  const checks = Object.freeze([
    check(FidelityReasonCodes.PLACEHOLDER_MISSING, 'passed', expected.length, actual.length),
    check(FidelityReasonCodes.PROTECTED_BYTES_CHANGED, 'passed', expected.length, actual.length),
  ]);
  return deepFreeze({
    status: 'restored',
    text,
    bytes,
    byteLength: bytes.byteLength,
    checks,
  });
}

function validateProtectInput(input: Record<string, unknown>): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const key of Object.keys(input)) {
    if (!(PROTECT_INPUT_KEYS as readonly string[]).includes(key)) {
      issues.push(issue(`$.${key}`, 'unknown_key', 'Field is not permitted at this boundary.'));
    }
  }
  if (typeof input.sourceText !== 'string' || input.sourceText.length === 0) {
    issues.push(issue('$.sourceText', 'type', 'Source text must be a non-empty string.'));
  }
  if (input.configuredLiterals !== undefined) {
    if (!Array.isArray(input.configuredLiterals)) {
      issues.push(issue('$.configuredLiterals', 'type', 'Configured literals must be an array.'));
    } else {
      if (input.configuredLiterals.length > MAX_CONFIGURED_LITERALS) {
        issues.push(issue('$.configuredLiterals', 'limit', 'Too many configured literals.'));
      }
      const seen = new Set<string>();
      for (const [index, value] of input.configuredLiterals.entries()) {
        if (
          typeof value !== 'string'
          || value.length === 0
          || value.length > MAX_CONFIGURED_LITERAL_LENGTH
        ) {
          issues.push(issue(
            `$.configuredLiterals[${index}]`,
            'type',
            'Configured literals must be bounded non-empty strings.',
          ));
        } else if (seen.has(value)) {
          issues.push(issue(
            `$.configuredLiterals[${index}]`,
            'duplicate',
            'Configured literals must be unique.',
          ));
        } else {
          seen.add(value);
        }
      }
    }
  }
  return issues;
}

function validateProtectedDocument(document: unknown): ValidationIssue[] {
  if (!isRecord(document)) {
    return [issue('$', 'type', 'Protected document must be an object.')];
  }
  const issues: ValidationIssue[] = [];
  const exact = validateExactOriginal(document.exactOriginal);
  if (!exact.success) {
    issues.push(...prefixIssues('$.exactOriginal', exact.issues));
    return issues;
  }
  if (document.sourceSha256 !== exact.value.sha256) {
    issues.push(issue('$.sourceSha256', 'source_digest', 'Protected source digest is invalid.'));
  }
  if (document.sourceByteLength !== exact.value.byteLength) {
    issues.push(issue('$.sourceByteLength', 'source_length', 'Protected source length is invalid.'));
  }
  if (
    !isRecord(document.dialect)
    || JSON.stringify(document.dialect) !== JSON.stringify(ProtectedMarkdownDialect)
  ) {
    issues.push(issue('$.dialect', 'dialect', 'Protected Markdown dialect is not supported.'));
  }
  const namespace = typeof document.namespace === 'string' ? document.namespace : null;
  if (namespace === null || !/^[a-f0-9]{24}$/u.test(namespace)) {
    issues.push(issue('$.namespace', 'namespace', 'Placeholder namespace is invalid.'));
  }
  if (typeof document.encodedText !== 'string' || !Array.isArray(document.spans)) {
    issues.push(issue('$', 'type', 'Protected document text and spans are required.'));
    return issues;
  }
  if (
    typeof document.configuredLiteralCount !== 'number'
    || !Number.isInteger(document.configuredLiteralCount)
    || document.configuredLiteralCount < 0
    || document.configuredLiteralCount > MAX_CONFIGURED_LITERALS
  ) {
    issues.push(issue(
      '$.configuredLiteralCount',
      'range',
      'Configured literal count is invalid.',
    ));
  }

  const originalBytes = decodeExactOriginal(exact.value);
  let sourceText: string;
  try {
    sourceText = new TextDecoder('utf-8', { fatal: true }).decode(originalBytes);
  } catch (error: unknown) {
    issues.push(issue('$.exactOriginal', 'encoding', 'Protected source is not valid UTF-8.'));
    return issues;
  }
  const tokens = new Set<string>();
  const encodedParts: string[] = [];
  const spanKinds = Object.values(ProtectedSpanKinds) as readonly string[];
  let previousCharEnd = 0;
  let previousByteEnd = 0;
  let canReconstruct = true;
  for (const [index, value] of document.spans.entries()) {
    if (!isRecord(value)) {
      issues.push(issue(`$.spans[${index}]`, 'type', 'Protected span must be an object.'));
      canReconstruct = false;
      continue;
    }
    const token = value.token;
    const charStart = value.charStart;
    const charEnd = value.charEnd;
    const byteStart = value.byteStart;
    const byteEnd = value.byteEnd;
    const byteLength = value.byteLength;
    const bytesBase64 = value.bytesBase64;
    const sha256 = value.sha256;
    if (
      value.index !== index
      || typeof value.kind !== 'string'
      || !spanKinds.includes(value.kind)
      || typeof token !== 'string'
      || typeof charStart !== 'number'
      || typeof charEnd !== 'number'
      || !Number.isInteger(charStart)
      || !Number.isInteger(charEnd)
      || charStart < previousCharEnd
      || charEnd <= charStart
      || charEnd > sourceText.length
      || typeof byteStart !== 'number'
      || typeof byteEnd !== 'number'
      || typeof byteLength !== 'number'
      || !Number.isInteger(byteStart)
      || !Number.isInteger(byteEnd)
      || !Number.isInteger(byteLength)
      || byteStart < previousByteEnd
      || byteEnd <= byteStart
      || byteEnd > originalBytes.byteLength
      || byteLength !== byteEnd - byteStart
      || typeof bytesBase64 !== 'string'
      || typeof sha256 !== 'string'
      || !SHA256_PATTERN.test(sha256)
    ) {
      issues.push(issue(`$.spans[${index}]`, 'span', 'Protected span metadata is invalid.'));
      canReconstruct = false;
      continue;
    }
    const bytes = Uint8Array.from(Buffer.from(bytesBase64, 'base64'));
    const sourceSlice = originalBytes.slice(byteStart, byteEnd);
    const prose = sourceText.slice(previousCharEnd, charStart);
    const spanTextBytes = new TextEncoder().encode(sourceText.slice(charStart, charEnd));
    const calculatedByteStart = previousByteEnd + new TextEncoder().encode(prose).byteLength;
    if (
      byteStart !== calculatedByteStart
      || bytes.byteLength !== byteLength
      || bytesBase64 !== Buffer.from(bytes).toString('base64')
      || !Buffer.from(bytes).equals(Buffer.from(sourceSlice))
      || !Buffer.from(bytes).equals(Buffer.from(spanTextBytes))
      || createSha256Digest(bytes) !== sha256
      || token !== createToken(namespace ?? '', index, sha256)
      || tokens.has(token)
      || sourceText.includes(token)
    ) {
      issues.push(issue(`$.spans[${index}]`, 'span_identity', 'Protected span identity is invalid.'));
    }
    encodedParts.push(prose, token);
    previousCharEnd = charEnd;
    previousByteEnd = byteEnd;
    tokens.add(token);
  }
  if (canReconstruct) {
    encodedParts.push(sourceText.slice(previousCharEnd));
    if (encodedParts.join('') !== document.encodedText) {
      issues.push(issue('$.encodedText', 'encoded_text', 'Protected text does not match its spans.'));
    }
  }
  return issues;
}

function createCollisionFreeNamespace(sourceText: string): string {
  let attempt = 0;
  while (true) {
    const namespace = createHash('sha256')
      .update(ProtectedMarkdownDialect.policyVersion)
      .update('\0')
      .update(sourceText)
      .update('\0')
      .update(String(attempt))
      .digest('hex')
      .slice(0, 24);
    if (!sourceText.includes(`⟦pcp:v1:${namespace}:`)) {
      return namespace;
    }
    attempt += 1;
  }
}

function createToken(namespace: string, index: number, sha256: string): string {
  return `⟦pcp:v1:${namespace}:${index}:${sha256.slice('sha256:'.length, 'sha256:'.length + 12)}⟧`;
}

function protectedRejection(
  document: ProtectedDocument,
  reasonCode: Exclude<FidelityReasonCode, 'accepted'>,
  expectedCount: number | null,
  actualCount: number | null,
): RestoreProtectedSpansResult {
  return deepFreeze({
    status: 'rejected',
    reasonCode,
    exactOriginal: document.exactOriginal,
    checks: [check(reasonCode, 'failed', expectedCount, actualCount)],
  });
}

function protectionFallback(
  exactOriginal: ProtectedDocument['exactOriginal'],
  reasonCode: Exclude<FidelityReasonCode, 'accepted'>,
  issues: readonly ValidationIssue[],
): ProtectMarkdownResult {
  return deepFreeze({ status: 'exact-original', reasonCode, exactOriginal, issues: [...issues] });
}

function rejectedInput(issues: readonly ValidationIssue[]): FidelityInputRejection {
  return deepFreeze({ status: 'rejected', reasonCode: 'invalid-input', issues: [...issues] });
}

function check(
  ruleId: FidelityReasonCode,
  status: FidelityCheck['status'],
  expectedCount: number | null,
  actualCount: number | null,
): FidelityCheck {
  return Object.freeze({ ruleId, status, expectedCount, actualCount });
}

function countValues(values: readonly string[]): ReadonlyMap<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
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
