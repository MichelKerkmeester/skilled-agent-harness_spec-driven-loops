// ───────────────────────────────────────────────────────────────────
// MODULE: Fidelity Boundary Types
// ───────────────────────────────────────────────────────────────────

import type { ValidationIssue } from '../contracts/common.js';
import type { ExactOriginalRecord } from '../contracts/exact-original.js';

/** Pinned Markdown interpretation shared by protection and validation. */
export const ProtectedMarkdownDialect = Object.freeze({
  name: 'portable-commonmark-safe',
  dialectVersion: 'commonmark-0.31.2+gfm-tables',
  parserName: 'portable-protected-markdown',
  parserVersion: '1.0.0',
  policyVersion: 'protected-spans/1.0.0',
});

/** Technical span classes retained exactly from the canonical original. */
export const ProtectedSpanKinds = {
  COMMAND: 'command',
  CONFIGURED_LITERAL: 'configured-literal',
  FENCED_CODE: 'fenced-code',
  FLAG: 'flag',
  HASH: 'hash',
  HEADING: 'heading',
  HTML: 'html',
  IDENTIFIER: 'identifier',
  INDENTED_CODE: 'indented-code',
  INLINE_CODE: 'inline-code',
  LINK: 'link',
  LIST_MARKER: 'list-marker',
  NUMBER: 'number',
  PATH: 'path',
  QUOTED_LITERAL: 'quoted-literal',
  RUNTIME_EXTENSION: 'runtime-extension',
  TABLE: 'table',
  URL: 'url',
  VARIABLE: 'variable',
} as const;

/** Protected technical span class. */
export type ProtectedSpanKind =
  typeof ProtectedSpanKinds[keyof typeof ProtectedSpanKinds];

/** Stable fidelity outcomes and deterministic veto reasons. */
export const FidelityReasonCodes = {
  ACCEPTED: 'accepted',
  CANCELLED: 'cancelled',
  CAVEAT_CHANGED: 'caveat-changed',
  EMPTY_OUTPUT: 'empty-output',
  FACT_ADDED: 'fact-added',
  FACT_OMITTED: 'fact-omitted',
  INVALID_ENCODING: 'invalid-encoding',
  INVALID_INPUT: 'invalid-input',
  JUDGE_FAILED: 'judge-failed',
  JUDGE_REJECTED: 'judge-rejected',
  JUDGE_TIMEOUT: 'judge-timeout',
  JUDGE_UNAVAILABLE: 'judge-unavailable',
  MARKDOWN_STRUCTURE_CHANGED: 'markdown-structure-changed',
  NEXT_STEP_CHANGED: 'next-step-changed',
  OUTPUT_LIMIT: 'output-limit',
  PLACEHOLDER_CHANGED: 'placeholder-changed',
  PLACEHOLDER_DUPLICATE: 'placeholder-duplicate',
  PLACEHOLDER_MISSING: 'placeholder-missing',
  PLACEHOLDER_REORDERED: 'placeholder-reordered',
  PLACEHOLDER_UNEXPECTED: 'placeholder-unexpected',
  POLARITY_CHANGED: 'polarity-changed',
  PRIORITY_CHANGED: 'priority-changed',
  PROTECTED_BYTES_CHANGED: 'protected-bytes-changed',
  PROVIDER_CANCELLED: 'provider-cancelled',
  PROVIDER_ERROR: 'provider-error',
  PROVIDER_TIMEOUT: 'provider-timeout',
  REFUSAL_OUTPUT: 'refusal-output',
  REQUIREMENT_STRENGTH_CHANGED: 'requirement-strength-changed',
  SOURCE_CHANGED: 'source-changed',
  TRUNCATED_OUTPUT: 'truncated-output',
  UNCERTAINTY_CHANGED: 'uncertainty-changed',
  VALIDATOR_FAILED: 'validator-failed',
} as const;

/** Fidelity acceptance or rejection reason. */
export type FidelityReasonCode =
  typeof FidelityReasonCodes[keyof typeof FidelityReasonCodes];

/** One exact span retained in the immutable restoration table. */
export interface ProtectedSpan {
  readonly index: number;
  readonly kind: ProtectedSpanKind;
  readonly charStart: number;
  readonly charEnd: number;
  readonly byteStart: number;
  readonly byteEnd: number;
  readonly byteLength: number;
  readonly bytesBase64: string;
  readonly sha256: string;
  readonly token: string;
}

/** Immutable protected document kept on the trusted side of inference. */
export interface ProtectedDocument {
  readonly dialect: typeof ProtectedMarkdownDialect;
  readonly namespace: string;
  readonly sourceSha256: string;
  readonly sourceByteLength: number;
  readonly encodedText: string;
  readonly spans: readonly ProtectedSpan[];
  readonly configuredLiteralCount: number;
  readonly exactOriginal: ExactOriginalRecord;
}

/** Input for deterministic protection of one valid UTF-8 source. */
export interface ProtectMarkdownInput {
  readonly sourceText: string;
  readonly exactOriginal: ExactOriginalRecord;
  readonly configuredLiterals?: readonly string[];
}

/** Successful protected document creation. */
export interface ProtectedMarkdownResult {
  readonly status: 'protected';
  readonly document: ProtectedDocument;
}

/** Safe fallback when a valid original exists but protection cannot proceed. */
export interface ProtectionFallback {
  readonly status: 'exact-original';
  readonly reasonCode: FidelityReasonCode;
  readonly exactOriginal: ExactOriginalRecord;
  readonly issues: readonly ValidationIssue[];
}

/** Rejected boundary input that did not contain a valid stored original. */
export interface FidelityInputRejection {
  readonly status: 'rejected';
  readonly reasonCode: 'invalid-input';
  readonly issues: readonly ValidationIssue[];
}

/** Result of protected document creation. */
export type ProtectMarkdownResult =
  | FidelityInputRejection
  | ProtectedMarkdownResult
  | ProtectionFallback;

/** Content-free result of checking one deterministic rule. */
export interface FidelityCheck {
  readonly ruleId: FidelityReasonCode;
  readonly status: 'passed' | 'failed';
  readonly expectedCount: number | null;
  readonly actualCount: number | null;
}

/** Restored candidate after every placeholder invariant passes. */
export interface RestoredProtectedSpans {
  readonly status: 'restored';
  readonly text: string;
  readonly bytes: Uint8Array;
  readonly byteLength: number;
  readonly checks: readonly FidelityCheck[];
}

/** Placeholder or protected-byte rejection with exact-original fallback. */
export interface ProtectedSpanRejection {
  readonly status: 'rejected';
  readonly reasonCode: Exclude<FidelityReasonCode, 'accepted'>;
  readonly exactOriginal: ExactOriginalRecord;
  readonly checks: readonly FidelityCheck[];
}

/** Result of restoring a protected candidate. */
export type RestoreProtectedSpansResult =
  | ProtectedSpanRejection
  | RestoredProtectedSpans;

/** Terminal provider state consumed before deterministic validation. */
export type ProviderTerminalState =
  | 'cancelled'
  | 'error'
  | 'success'
  | 'timeout'
  | 'truncated';

/** Whether the optional conservative judge participates. */
export type JudgeMode = 'disabled' | 'required';

/** Complete deterministic and optional-judge validation request. */
export interface ProjectionValidationInput {
  readonly protection: ProtectedDocument;
  readonly candidateText: string;
  readonly providerTerminal: ProviderTerminalState;
  readonly allPartsComplete: boolean;
  readonly currentSourceSha256: string;
  readonly judgeMode: JudgeMode;
  readonly maximumOutputBytes?: number;
  readonly minimumContentRatio?: number;
  readonly judgeTimeoutMs?: number;
  readonly signal?: AbortSignal;
}

/** Trusted input supplied to an optional reject-only judge. */
export interface RejectOnlyJudgeRequest {
  readonly sourceText: string;
  readonly candidateText: string;
  readonly signal: AbortSignal;
}

/** A judge can accept for continued processing or add a rejection. */
export type RejectOnlyJudge = (
  request: RejectOnlyJudgeRequest,
) => Promise<'accept' | 'reject'>;

/** Candidate accepted after every configured veto stage. */
export interface AcceptedFidelityOutcome {
  readonly status: 'accepted';
  readonly reasonCode: 'accepted';
  readonly sourceSha256: string;
  readonly projectionSha256: string;
  readonly projectionByteLength: number;
  readonly projectionText: string;
  readonly validationProfileVersion: 'fidelity/1.0.0';
  readonly exactOriginal: ExactOriginalRecord;
  readonly checks: readonly FidelityCheck[];
}

/** Exact-original outcome selected by a deterministic or judge veto. */
export interface ExactOriginalFidelityOutcome {
  readonly status: 'exact-original';
  readonly reasonCode: Exclude<FidelityReasonCode, 'accepted'>;
  readonly sourceSha256: string;
  readonly projectionSha256: null;
  readonly projectionByteLength: number;
  readonly projectionText: null;
  readonly validationProfileVersion: 'fidelity/1.0.0';
  readonly exactOriginal: ExactOriginalRecord;
  readonly checks: readonly FidelityCheck[];
}

/** Terminal fidelity decision with a valid exact original. */
export type FidelityOutcome = AcceptedFidelityOutcome | ExactOriginalFidelityOutcome;

/** Public result of candidate validation. */
export type FidelityValidationResult = FidelityInputRejection | FidelityOutcome;
