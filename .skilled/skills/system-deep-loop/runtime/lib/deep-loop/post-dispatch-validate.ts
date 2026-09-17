// ───────────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Post-Dispatch Validator
// ───────────────────────────────────────────────────────────────────

import { existsSync, readFileSync, renameSync, rmSync, statSync, truncateSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { validateEvidenceContract } from './evidence-contract.js';
import { appendJsonlRecord } from './jsonl-repair.js';
import { deriveReceiptKeyForDispatch } from './executor-audit.js';
import { canonicalReceiptJson, verifyReceipt } from './receipt-crypto.js';
import type { ExecutorKind } from './executor-config.js';

// ───── 1. TYPE DEFINITIONS ─────

export type VerificationLanguage = 'python' | 'typescript' | 'javascript' | 'rust' | 'go';

export type PostDispatchRecipeConfig = {
  verification_enabled?: boolean;
  verification_languages?: VerificationLanguage[];
  verification_threshold?: number;
  judge_quarantine_enabled?: boolean;
};

export type RouteProofExpectation = {
  mode: string;
  targetAgent: string;
  resolvedRoute: string;
  requireAgentDefinitionLoaded?: boolean;
};

export type DispatchReceiptExpectation = {
  receiptDir: string;
  dispatchId: string;
};

export type PostDispatchValidateInput = {
  iterationFile: string;
  stateLogPath: string;
  previousStateLogSize: number;
  requiredJsonlFields: string[];
  executorKind?: ExecutorKind;
  deltaFilePath?: string;
  routeProof?: RouteProofExpectation;
  recipeConfig?: PostDispatchRecipeConfig;
  // When set, the validator requires a structurally intact, intent-bound
  // dispatch receipt pair (intent + completion) before accepting the
  // state-log append; a mac that fails to cryptographically correlate is
  // reported as a warning, not a blocking failure (see
  // validateDispatchReceipt). Dispatches that did not opt into receipts omit
  // it and keep legacy behavior.
  dispatchReceipt?: DispatchReceiptExpectation;
};

/** Failure class recorded for a hardened judge attempt. */
export type JudgeFailureKind = 'model_error' | 'parse_error' | 'slow_timeout' | 'unknown';

/** Persistence destinations protected by judge-card quarantine. */
export type JudgePersistenceSurface = 'persistence' | 'convergence' | 'coverage';

/** A failed judge attempt with retry and timeout diagnostics. */
export interface JudgeAttemptFailure {
  attempt: number;
  kind: JudgeFailureKind;
  message: string;
  fastTimedOut: boolean;
  formatStripRetried: boolean;
}

/** Retry, timeout, and parser configuration for a hardened judge call. */
export interface JudgeHardeningConfig {
  maxAttempts?: number;
  backoffMs?: number | ((attempt: number) => number);
  fastTimeoutMs?: number;
  slowTimeoutMs?: number;
  now?: () => string;
  sleep?: (ms: number) => Promise<void>;
}

/** Input for running one model-backed judge call through hardening layers. */
export interface JudgeHardeningInput<TCard extends Record<string, unknown>> extends JudgeHardeningConfig {
  invoke: () => Promise<string>;
  parse?: (record: Record<string, unknown>) => TCard;
  fallbackReason?: string;
}

/** Metadata attached to neutral judge fallback cards. */
export interface JudgeFallbackMetadata {
  attempts: number;
  maxAttempts: number;
  failureKind: JudgeFailureKind;
  failures: JudgeAttemptFailure[];
  formatStripRetries: number;
  fastTimeouts: number;
  slowTimeouts: number;
  generatedAt: string;
}

/** Input for constructing a neutral quarantined judge fallback card. */
export interface JudgeFallbackInput {
  reason: string;
  failures: JudgeAttemptFailure[];
  maxAttempts: number;
  formatStripRetries: number;
  fastTimeouts: number;
  slowTimeouts: number;
  now?: () => string;
}

/** Neutral card emitted when judge retries cannot produce a parseable score. */
export interface NeutralJudgeFallbackCard extends Record<string, unknown> {
  type: 'judge_fallback_card';
  fallback: true;
  quarantined: true;
  score: 0.5;
  confidence: 0;
  reason: string;
  metadata: JudgeFallbackMetadata;
}

/** Result from a hardened judge call. */
export type JudgeHardeningResult<TCard extends Record<string, unknown>> =
  | {
      ok: true;
      card: TCard;
      attempts: number;
      failures: JudgeAttemptFailure[];
      formatStripRetries: number;
      fastTimeouts: number;
      slowTimeouts: number;
    }
  | {
      ok: false;
      card: NeutralJudgeFallbackCard;
      attempts: number;
      failures: JudgeAttemptFailure[];
      formatStripRetries: number;
      fastTimeouts: number;
      slowTimeouts: number;
    };

/** Writer callback for a judge card persistence surface. */
export type JudgePersistenceWriter<TCard extends Record<string, unknown>> = (
  card: TCard,
  surface: JudgePersistenceSurface,
) => void | Promise<void>;

/** Persistence writers guarded by the quarantine boundary. */
export type JudgePersistenceWriters<TCard extends Record<string, unknown>> = Partial<
  Record<JudgePersistenceSurface, JudgePersistenceWriter<TCard>>
>;

/** Summary of judge-card persistence after quarantine checks. */
export interface JudgePersistenceResult {
  persisted: boolean;
  writtenSurfaces: JudgePersistenceSurface[];
  skippedSurfaces: JudgePersistenceSurface[];
  reason?: 'quarantined' | 'no_writer';
}

export type VerificationStageScores = {
  compiled: boolean;
  executed: boolean;
  testsPassed: boolean;
  lintClean: boolean;
  autoFixed: boolean;
};

export type VerificationPassResult =
  | { ok: true; skipped: true; reason: 'verification_disabled' | 'no_code_output' }
  | {
      ok: true;
      skipped: false;
      confidence: number;
      threshold: number;
      language: VerificationLanguage;
      stages: VerificationStageScores;
    }
  | {
      ok: false;
      reason: 'verification_degraded';
      confidence: number;
      threshold: number;
      language: VerificationLanguage;
      details: string;
      stages: VerificationStageScores;
    };

export type PostDispatchAdvisory = { code: string; detail: string; fieldPath?: string };

type PostDispatchFailureReason =
  | 'iteration_file_missing'
  | 'iteration_file_empty'
  | 'jsonl_not_appended'
  | 'jsonl_missing_fields'
  | 'jsonl_parse_error'
  | 'jsonl_wrong_type'
  | 'delta_file_missing'
  | 'delta_file_empty'
  | 'delta_file_missing_iteration_record'
  | 'executor_missing'
  | 'dispatch_failure_logged'
  | 'verification_degraded'
  | 'route_proof_missing'
  | 'route_proof_mismatch'
  | 'dispatch_receipt_missing'
  | 'dispatch_receipt_invalid_mac'
  | 'dispatch_receipt_intent_mismatch'
  | 'v2_missing_ledger'
  | 'v2_uncited_ledger_row'
  | 'v2_broken_linked_finding'
  | 'v2_shallow_finding_details'
  | 'delta_iteration_id_mismatch'
  | 'state_delta_iteration_mismatch';

export type PostDispatchValidateResult =
  | { ok: true; warnings?: PostDispatchAdvisory[] }
  | {
      ok: false;
      reason: PostDispatchFailureReason;
      details: string;
      warnings?: PostDispatchAdvisory[];
    };

// ───── 2. DOMAIN ERRORS ─────

export class PostDispatchValidationError extends Error {
  result: PostDispatchValidateResult;

  constructor(result: PostDispatchValidateResult) {
    super(result.ok ? 'Post-dispatch validation unexpectedly succeeded' : `${result.reason}: ${result.details}`);
    this.name = 'PostDispatchValidationError';
    this.result = result;
  }
}

class JudgeTimeoutError extends Error {
  kind: 'slow_timeout';

  constructor(message: string) {
    super(message);
    this.name = 'JudgeTimeoutError';
    this.kind = 'slow_timeout';
  }
}

// ───── 3. CONSTANTS ─────

const CANONICAL_ITERATION_TYPE = 'iteration' as const;
const DEFAULT_VERIFICATION_THRESHOLD = 0.5;
const DEFAULT_JUDGE_MAX_ATTEMPTS = 1;
const DEFAULT_JUDGE_BACKOFF_MS = 0;
const DEFAULT_JUDGE_FAST_TIMEOUT_MS = 10_000;
const DEFAULT_JUDGE_SLOW_TIMEOUT_MS = 60_000;
const JUDGE_PERSISTENCE_SURFACES = ['persistence', 'convergence', 'coverage'] as const;
const SUPPORTED_VERIFICATION_LANGUAGES = new Set<VerificationLanguage>([
  'python',
  'typescript',
  'javascript',
  'rust',
  'go',
]);
const REVIEW_ITERATION_FIELDS = [
  'type',
  'iteration',
  'mode',
  'run',
  'status',
  'focus',
  'dimensions',
  'filesReviewed',
  'findingsCount',
  'findingsSummary',
  'findingsNew',
  'newFindingsRatio',
  'sessionId',
  'generation',
  'lineageMode',
  'timestamp',
  'durationMs',
] as const;
const V2_SCOPE_CLASSES = new Set(['trivial', 'standard', 'complex']);
const V2_ENFORCEMENT_MODES = new Set(['strict', 'warn', 'skip']);
const V2_GRAPH_COVERAGE_MODES = new Set(['graph', 'graphless_fallback', 'unavailable_blocked']);

type V2EnforcementMode = 'warn' | 'strict' | 'off';
type V2ValidationFailure = {
  reason: PostDispatchFailureReason;
  details: string;
  fieldPath?: string;
};
type IterationRecordWithLogRegion = Record<string, unknown> & {
  logOffset?: number;
  logSize?: number;
  logPath?: string;
};
type JsonlLineRegion = {
  rawLine: string;
  startOffset: number;
  nextOffset: number;
  parsed: unknown;
};

// ───── 4. HELPERS ─────

type JudgeParseResult =
  | { ok: true; record: Record<string, unknown>; formatStripRetried: boolean }
  | { ok: false; error: string; formatStripRetried: boolean };

function normalizePositiveInteger(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(1, Math.floor(value));
}

function normalizeNonNegativeInteger(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(0, Math.floor(value));
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolveSleep) => {
    setTimeout(resolveSleep, ms);
  });
}

function resolveJudgeBackoffMs(backoff: JudgeHardeningConfig['backoffMs'], attempt: number): number {
  if (typeof backoff === 'function') {
    return normalizeNonNegativeInteger(backoff(attempt), DEFAULT_JUDGE_BACKOFF_MS);
  }
  return normalizeNonNegativeInteger(backoff, DEFAULT_JUDGE_BACKOFF_MS);
}

function parseJsonObject(text: string): { ok: true; record: Record<string, unknown> } | { ok: false; error: string } {
  try {
    const parsed: unknown = JSON.parse(text);
    if (!isObjectRecord(parsed)) {
      return { ok: false, error: 'judge response JSON is not an object' };
    }
    return { ok: true, record: parsed };
  } catch (error: unknown) {
    return { ok: false, error: errorMessage(error) };
  }
}

function stripMarkdownJsonFence(text: string): string {
  const trimmed = text.trim();
  const match = trimmed.match(/^```(?:json)?\s*\r?\n?([\s\S]*?)\r?\n?```\s*$/i);
  return match?.[1]?.trim() ?? trimmed;
}

function parseJudgeJsonWithFormatStrip(text: string): JudgeParseResult {
  const trimmed = text.trim();
  if (trimmed === '') {
    return { ok: false, error: 'judge response was empty', formatStripRetried: false };
  }

  const direct = parseJsonObject(trimmed);
  if (direct.ok) {
    return { ok: true, record: direct.record, formatStripRetried: false };
  }

  const stripped = stripMarkdownJsonFence(trimmed);
  if (stripped !== trimmed) {
    const strippedParse = parseJsonObject(stripped);
    if (strippedParse.ok) {
      return { ok: true, record: strippedParse.record, formatStripRetried: true };
    }
    return { ok: false, error: strippedParse.error, formatStripRetried: true };
  }

  return { ok: false, error: direct.error, formatStripRetried: false };
}

async function callJudgeWithDualTimeouts(
  invoke: () => Promise<string>,
  fastTimeoutMs: number,
  slowTimeoutMs: number,
): Promise<{ text: string; fastTimedOut: boolean }> {
  const normalizedSlowTimeoutMs = Math.max(fastTimeoutMs, slowTimeoutMs);
  const operation = invoke();
  let fastTimer: ReturnType<typeof setTimeout> | undefined;

  const fastResult = await (async (): Promise<
    | { kind: 'response'; text: string }
    | { kind: 'fast_timeout' }
  > => {
    try {
      return await Promise.race<
        | { kind: 'response'; text: string }
        | { kind: 'fast_timeout' }
      >([
        operation.then((text) => ({ kind: 'response', text })),
        new Promise<{ kind: 'fast_timeout' }>((resolveTimeout) => {
          fastTimer = setTimeout(() => resolveTimeout({ kind: 'fast_timeout' }), fastTimeoutMs);
        }),
      ]);
    } finally {
      if (fastTimer !== undefined) {
        clearTimeout(fastTimer);
      }
    }
  })();

  if (fastResult.kind === 'response') {
    return { text: fastResult.text, fastTimedOut: false };
  }

  let slowTimer: ReturnType<typeof setTimeout> | undefined;
  const remainingTimeoutMs = Math.max(0, normalizedSlowTimeoutMs - fastTimeoutMs);
  try {
    const text = await Promise.race([
      operation,
      new Promise<never>((_, reject) => {
        slowTimer = setTimeout(() => {
          reject(new JudgeTimeoutError(`judge slow timeout after ${normalizedSlowTimeoutMs}ms`));
        }, remainingTimeoutMs);
      }),
    ]);
    return { text, fastTimedOut: true };
  } catch (error: unknown) {
    operation.catch(() => undefined);
    throw error;
  } finally {
    if (slowTimer !== undefined) {
      clearTimeout(slowTimer);
    }
  }
}

function clampByteOffset(value: number, contentLength: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(Math.floor(value), contentLength));
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}

function isNonEmptyStringArray(value: unknown): value is string[] {
  return isStringArray(value) && value.length > 0;
}

function isVerificationLanguage(value: string): value is VerificationLanguage {
  return SUPPORTED_VERIFICATION_LANGUAGES.has(value as VerificationLanguage);
}

function normalizeFenceLanguage(language: string): VerificationLanguage | null {
  const normalized = language.trim().toLowerCase();
  if (normalized === 'py' || normalized === 'python') return 'python';
  if (normalized === 'ts' || normalized === 'tsx' || normalized === 'typescript') return 'typescript';
  if (normalized === 'js' || normalized === 'mjs' || normalized === 'javascript') return 'javascript';
  if (normalized === 'rs' || normalized === 'rust') return 'rust';
  if (normalized === 'go' || normalized === 'golang') return 'go';
  return null;
}

function extractCodeBlocks(
  content: string,
  allowedLanguages: VerificationLanguage[],
): Array<{ language: VerificationLanguage; code: string }> {
  const blocks: Array<{ language: VerificationLanguage; code: string }> = [];
  const fencePattern = /```([a-zA-Z0-9_-]+)\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;

  while ((match = fencePattern.exec(content)) !== null) {
    const language = normalizeFenceLanguage(match[1] ?? '');
    if (language && (allowedLanguages.length === 0 || allowedLanguages.includes(language))) {
      blocks.push({ language, code: match[2] ?? '' });
    }
  }

  return blocks;
}

function bracesBalanced(code: string): boolean {
  let balance = 0;
  for (const char of code) {
    if (char === '{') balance += 1;
    if (char === '}') balance -= 1;
    if (balance < 0) return false;
  }
  return balance === 0;
}

function hasPlaceholderOrTruncation(code: string): boolean {
  return /TODO|NotImplementedError|pass\s+#\s*placeholder|\[\.\.\. truncated|\.\.\. rest of|\.\.\. more/i.test(code);
}

function hasObviousRuntimeFailure(code: string): boolean {
  return /throw new Error|raise\s+\w*Error|panic!\s*\(|process\.exit\s*\(\s*1\s*\)|Deno\.exit\s*\(\s*1\s*\)/.test(code);
}

function hasSyntaxShape(language: VerificationLanguage, code: string): boolean {
  if (code.trim() === '') return false;
  if (hasPlaceholderOrTruncation(code)) return false;
  if (language === 'javascript' || language === 'typescript' || language === 'rust' || language === 'go') {
    return bracesBalanced(code);
  }
  if (language === 'python') {
    return !/^\s*(def|class|if|for|while|try|with)\b[^\n:]*$/m.test(code);
  }
  return true;
}

function scoreCodeBlock(language: VerificationLanguage, code: string): VerificationStageScores {
  const compiled = hasSyntaxShape(language, code);
  const executed = compiled && !hasObviousRuntimeFailure(code);
  const testsPassed = executed && !/assert\s+false|expect\([^)]*\)\.toBeFalsy\(\)|FAIL:/i.test(code);
  const lintClean = compiled && !/[ \t]+$/m.test(code) && !hasPlaceholderOrTruncation(code);

  return {
    compiled,
    executed,
    testsPassed,
    lintClean,
    autoFixed: false,
  };
}

function buildVerificationDegradedEvent(input: {
  confidence: number;
  threshold: number;
  language: VerificationLanguage;
  details: string;
}): string {
  return JSON.stringify({
    type: 'event',
    event: 'verification_degraded',
    status: 'degraded',
    confidence: input.confidence,
    threshold: input.threshold,
    language: input.language,
    reason: 'verification_degraded',
    detail: input.details,
    timestamp: new Date().toISOString(),
  });
}

function getV2EnforcementMode(): V2EnforcementMode {
  const raw = process.env.DEEP_REVIEW_V2_ENFORCEMENT?.trim().toLowerCase();
  if (raw === 'strict' || raw === 'off' || raw === 'warn') {
    return raw;
  }
  return 'warn';
}

// The evidence contract defaults to advisory: malformed metadata warns, absent
// metadata is silent, and only an explicit strict opt-in turns it into a hard
// failure. This mirrors the v2 off/warn/strict pattern so operators tune it the
// same way; the default keeps every legacy exchange passing.
function getEvidenceEnforcementMode(): V2EnforcementMode {
  const raw = process.env.DEEP_LOOP_EVIDENCE_ENFORCEMENT?.trim().toLowerCase();
  if (raw === 'strict' || raw === 'off' || raw === 'warn') {
    return raw;
  }
  return 'warn';
}

// Turn an evidence-contract validation into advisory warnings. Absent and
// well-formed payloads produce nothing; a malformed payload produces one
// advisory per offending field path. Never throws, never blocks.
function evidenceAdvisories(record: Record<string, unknown>): PostDispatchAdvisory[] {
  const validation = validateEvidenceContract(record.evidence);
  if (validation.status !== 'malformed') {
    return [];
  }
  return validation.issues.map((issue) => ({
    code: 'evidence_contract_malformed',
    detail: issue.detail,
    fieldPath: `evidence.${issue.fieldPath}`,
  }));
}

function isLegacyNonTrivialReviewRecord(record: Record<string, unknown>): boolean {
  return (Array.isArray(record.findingDetails) && record.findingDetails.length > 0)
    || (Array.isArray(record.dimensions) && record.dimensions.length > 1);
}

function isReviewIterationValidation(input: PostDispatchValidateInput): boolean {
  return input.requiredJsonlFields.includes('findingsSummary') || input.requiredJsonlFields.includes('filesReviewed');
}

function hasPositiveCount(value: unknown): boolean {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function hasPositiveSeverityCount(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (!isObjectRecord(value)) {
    return false;
  }
  return ['P0', 'P1', 'P2'].some((severity) => hasPositiveCount(value[severity]));
}

function reviewRecordNeedsFindingDetails(record: Record<string, unknown>): boolean {
  return hasPositiveCount(record.findingsCount)
    || hasPositiveSeverityCount(record.findingsSummary)
    || hasPositiveSeverityCount(record.findingsNew);
}

function requiredJsonlFieldSet(
  input: PostDispatchValidateInput,
  record: Record<string, unknown>,
): Set<string> {
  const reviewValidation = isReviewIterationValidation(input);
  const inputFields = reviewValidation
    ? input.requiredJsonlFields.filter((field) => field !== 'findingDetails')
    : input.requiredJsonlFields;
  const requiredFields = new Set([
    ...inputFields,
    ...(reviewValidation ? REVIEW_ITERATION_FIELDS : []),
  ]);

  if (reviewValidation && reviewRecordNeedsFindingDetails(record)) {
    requiredFields.add('findingDetails');
  }

  return requiredFields;
}

// The three model-written route-proof fields. When a structurally valid
// dispatch receipt pair is present (see validateDispatchReceipt) these become
// advisory: the receipt facts were written by the engine's own dispatch
// wrapper, not self-reported by the model, so they are treated as more
// reliable than the model-written fields regardless of whether the mac
// cryptographically correlates (it cannot, across a real process boundary —
// see loadAndVerifyReceipt). A dispatch that omits or disagrees with the
// model-written fields is accepted (warned, not blocked). `mode` is
// engine-determined, never demoted.
const ROUTE_PROOF_MODEL_FIELDS = ['target_agent', 'agent_definition_loaded', 'resolved_route'] as const;

type RouteProofOutcome = {
  failure: Extract<PostDispatchValidateResult, { ok: false }> | null;
  warnings: PostDispatchAdvisory[];
};

function routeProofMismatch(
  source: string,
  field: string,
  actual: unknown,
  expected: unknown,
): Extract<PostDispatchValidateResult, { ok: false }> {
  return {
    ok: false,
    reason: 'route_proof_mismatch',
    details: `${source}.${field}='${String(actual)}' expected '${String(expected)}'`,
  };
}

function validateRouteProofRecord(
  record: Record<string, unknown>,
  routeProof: RouteProofExpectation | undefined,
  source: string,
  modelFieldsAdvisory: boolean,
): RouteProofOutcome {
  if (!routeProof) return { failure: null, warnings: [] };

  // Legacy strict behavior: all four route-proof fields are required and their
  // values are hard-enforced. Preserved unchanged when no receipt is configured.
  if (!modelFieldsAdvisory) {
    const requiredFields = ['mode', ...ROUTE_PROOF_MODEL_FIELDS];
    const missingFields = requiredFields.filter((field) => !(field in record));
    if (missingFields.length > 0) {
      return {
        failure: {
          ok: false,
          reason: 'route_proof_missing',
          details: `${source} missing route-proof fields: ${missingFields.join(',')}`,
        },
        warnings: [],
      };
    }
    if (record.mode !== routeProof.mode) {
      return { failure: routeProofMismatch(source, 'mode', record.mode, routeProof.mode), warnings: [] };
    }
    if (record.target_agent !== routeProof.targetAgent) {
      return { failure: routeProofMismatch(source, 'target_agent', record.target_agent, routeProof.targetAgent), warnings: [] };
    }
    if (routeProof.requireAgentDefinitionLoaded !== false && record.agent_definition_loaded !== true) {
      return {
        failure: { ok: false, reason: 'route_proof_mismatch', details: `${source}.agent_definition_loaded must be true` },
        warnings: [],
      };
    }
    if (record.resolved_route !== routeProof.resolvedRoute) {
      return { failure: routeProofMismatch(source, 'resolved_route', record.resolved_route, routeProof.resolvedRoute), warnings: [] };
    }
    return { failure: null, warnings: [] };
  }

  // Advisory mode: a valid dispatch receipt is present, so the receipt-derived
  // route facts are authoritative. `mode` stays engine-enforced; the three
  // model-written fields surface as warnings instead of hard failures.
  if (!('mode' in record)) {
    return {
      failure: {
        ok: false,
        reason: 'route_proof_missing',
        details: `${source} missing route-proof fields: mode`,
      },
      warnings: [],
    };
  }
  if (record.mode !== routeProof.mode) {
    return { failure: routeProofMismatch(source, 'mode', record.mode, routeProof.mode), warnings: [] };
  }

  const advisorySuffix = ' (advisory; valid dispatch receipt present)';
  const warnings: PostDispatchAdvisory[] = [];

  if (!('target_agent' in record)) {
    warnings.push({ code: 'route_proof_missing', detail: `${source} missing route-proof field: target_agent${advisorySuffix}`, fieldPath: 'target_agent' });
  } else if (record.target_agent !== routeProof.targetAgent) {
    warnings.push({ code: 'route_proof_mismatch', detail: `${source}.target_agent='${String(record.target_agent)}' expected '${routeProof.targetAgent}'${advisorySuffix}`, fieldPath: 'target_agent' });
  }

  if (!('agent_definition_loaded' in record)) {
    warnings.push({ code: 'route_proof_missing', detail: `${source} missing route-proof field: agent_definition_loaded${advisorySuffix}`, fieldPath: 'agent_definition_loaded' });
  } else if (routeProof.requireAgentDefinitionLoaded !== false && record.agent_definition_loaded !== true) {
    warnings.push({ code: 'route_proof_mismatch', detail: `${source}.agent_definition_loaded must be true${advisorySuffix}`, fieldPath: 'agent_definition_loaded' });
  }

  if (!('resolved_route' in record)) {
    warnings.push({ code: 'route_proof_missing', detail: `${source} missing route-proof field: resolved_route${advisorySuffix}`, fieldPath: 'resolved_route' });
  } else if (record.resolved_route !== routeProof.resolvedRoute) {
    warnings.push({ code: 'route_proof_mismatch', detail: `${source}.resolved_route='${String(record.resolved_route)}' expected '${routeProof.resolvedRoute}'${advisorySuffix}`, fieldPath: 'resolved_route' });
  }

  return { failure: null, warnings };
}

// ───── DISPATCH RECEIPT VALIDATION ─────

// Facts shared by the pre-dispatch INTENT and the post-dispatch COMPLETION:
// both cover exactly what the engine intended, so they must agree. The
// completion-only facts (child pid/exit/signal/session) are excluded from the
// intent binding comparison, so the binding is over the agreed-upon intent.
const RECEIPT_BOUND_FACT_KEYS = ['command', 'args', 'cwd', 'executor', 'iteration'] as const;

function receiptFilePath(receiptDir: string, dispatchId: string, phase: 'intent' | 'completion'): string {
  return join(receiptDir, `dispatch-${dispatchId}.${phase}.json`);
}

type LoadedReceipt =
  | { ok: true; record: Record<string, unknown>; warnings: PostDispatchAdvisory[] }
  | { ok: false; result: Extract<PostDispatchValidateResult, { ok: false }> };

// Load one receipt file and assert it is a structurally well-formed dispatch
// receipt for this dispatch/phase: valid JSON, the right type/version/phase,
// the expected dispatchId, a facts object, and a non-empty mac field. A
// receipt that exists but is unparseable, structurally wrong, or missing its
// mac is rejected as invalid — distinct from a receipt that simply was never
// written (missing).
//
// The mac is still recomputed and compared against the derived key, but a
// mismatch is reported as a warning, not a structural failure: the signing
// key is derived from an in-process run-master secret that is freshly random
// per process and never persisted (executor-audit.ts), so a validator running
// in a different process than the writer recomputes a different key by
// construction and cannot reproduce the mac even for a completely legitimate
// receipt. A mismatch means "different process," not "tampered."
function loadAndVerifyReceipt(
  receiptPath: string,
  phase: 'intent' | 'completion',
  expectedDispatchId: string,
  key: string,
): LoadedReceipt {
  if (!existsSync(receiptPath)) {
    return {
      ok: false,
      result: {
        ok: false,
        reason: 'dispatch_receipt_missing',
        details: `${phase} receipt missing: ${receiptPath}`,
      },
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(receiptPath, 'utf8'));
  } catch (error) {
    return {
      ok: false,
      result: {
        ok: false,
        reason: 'dispatch_receipt_invalid_mac',
        details: `${phase} receipt is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
      },
    };
  }

  if (!isObjectRecord(parsed)) {
    return {
      ok: false,
      result: {
        ok: false,
        reason: 'dispatch_receipt_invalid_mac',
        details: `${phase} receipt is not a JSON object`,
      },
    };
  }

  if (parsed.type !== 'dispatch_receipt' || parsed.version !== 1) {
    return {
      ok: false,
      result: {
        ok: false,
        reason: 'dispatch_receipt_invalid_mac',
        details: `${phase} receipt is not a dispatch_receipt (type/version)`,
      },
    };
  }
  if (parsed.phase !== phase) {
    return {
      ok: false,
      result: {
        ok: false,
        reason: 'dispatch_receipt_invalid_mac',
        details: `${phase} receipt has phase='${String(parsed.phase)}' expected '${phase}'`,
      },
    };
  }
  if (parsed.dispatchId !== expectedDispatchId) {
    return {
      ok: false,
      result: {
        ok: false,
        reason: 'dispatch_receipt_invalid_mac',
        details: `${phase} receipt dispatchId='${String(parsed.dispatchId)}' expected '${expectedDispatchId}'`,
      },
    };
  }
  if (!isObjectRecord(parsed.facts)) {
    return {
      ok: false,
      result: {
        ok: false,
        reason: 'dispatch_receipt_invalid_mac',
        details: `${phase} receipt missing facts object`,
      },
    };
  }

  const mac = parsed.mac;
  if (typeof mac !== 'string' || mac === '') {
    return {
      ok: false,
      result: {
        ok: false,
        reason: 'dispatch_receipt_invalid_mac',
        details: `${phase} receipt missing mac`,
      },
    };
  }

  const warnings: PostDispatchAdvisory[] = [];
  if (!verifyReceipt(parsed, mac, key)) {
    warnings.push({
      code: 'dispatch_receipt_mac_uncorrelated',
      detail: `${phase} receipt mac did not correlate with this process's derived key (expected when the validator runs in a different process than the writer; not evidence of tampering)`,
      fieldPath: 'mac',
    });
  }

  return { ok: true, record: parsed, warnings };
}

function canonicalBoundFacts(facts: Record<string, unknown>): string {
  const bound: Record<string, unknown> = {};
  for (const factKey of RECEIPT_BOUND_FACT_KEYS) {
    if (factKey in facts) {
      bound[factKey] = facts[factKey];
    }
  }
  return canonicalReceiptJson(bound);
}

/** Outcome of validating a dispatch receipt pair: a blocking failure (or
 * null), plus any advisory warnings — e.g. a mac that could not be
 * cryptographically correlated to this process's derived key. */
type DispatchReceiptOutcome = {
  failure: Extract<PostDispatchValidateResult, { ok: false }> | null;
  warnings: PostDispatchAdvisory[];
};

/**
 * Validate an engine-authored dispatch receipt pair when the dispatch opted
 * into receipts. Returns a blocking failure when the receipt pair is missing,
 * structurally invalid, or the completion does not bind to its intent.
 * Returns warnings (never a failure) when a receipt's mac cannot be
 * cryptographically correlated to this process's derived key.
 *
 * The signing key is derived from an in-memory run-master secret that is
 * freshly random per process and never persisted to disk (see
 * executor-audit.ts). That means the mac genuinely correlates a receipt only
 * when the writer and this validator share one live process; it cannot
 * authenticate a receipt across a real writer-process/validator-process
 * boundary — a separate CLI invocation, a resumed run after a process
 * restart — because that process derives a different key from a different
 * secret. Structural well-formedness, dispatch-identity fields, and the
 * intent/completion equality check below do not depend on the secret and stay
 * fully enforced regardless of process boundaries.
 */
function validateDispatchReceipt(expectation: DispatchReceiptExpectation): DispatchReceiptOutcome {
  const key = deriveReceiptKeyForDispatch(expectation.dispatchId);
  const warnings: PostDispatchAdvisory[] = [];

  const intentPath = receiptFilePath(expectation.receiptDir, expectation.dispatchId, 'intent');
  const intent = loadAndVerifyReceipt(intentPath, 'intent', expectation.dispatchId, key);
  if (!intent.ok) {
    return { failure: intent.result, warnings };
  }
  warnings.push(...intent.warnings);

  const completionPath = receiptFilePath(expectation.receiptDir, expectation.dispatchId, 'completion');
  const completion = loadAndVerifyReceipt(completionPath, 'completion', expectation.dispatchId, key);
  if (!completion.ok) {
    return { failure: completion.result, warnings };
  }
  warnings.push(...completion.warnings);

  const intentFacts = intent.record.facts;
  const completionFacts = completion.record.facts;
  if (!isObjectRecord(intentFacts) || !isObjectRecord(completionFacts)) {
    return {
      failure: {
        ok: false,
        reason: 'dispatch_receipt_invalid_mac',
        details: 'receipt facts object missing',
      },
      warnings,
    };
  }

  // Bind the INTENT to its COMPLETION: the completion must countersign the same
  // dispatch the engine intended. A completion whose base intent facts diverge
  // is a countersign of a different dispatch and must be rejected. This
  // equality check is plain structural comparison over the facts objects — it
  // does not depend on the mac, so it holds regardless of which process wrote
  // which half of the pair.
  if (canonicalBoundFacts(intentFacts) !== canonicalBoundFacts(completionFacts)) {
    return {
      failure: {
        ok: false,
        reason: 'dispatch_receipt_intent_mismatch',
        details: 'completion does not bind to intent: base facts (command/args/cwd/executor/iteration) diverge',
      },
      warnings,
    };
  }

  return { failure: null, warnings };
}

function v2Failure(
  reason: PostDispatchFailureReason,
  details: string,
  fieldPath?: string,
): V2ValidationFailure {
  return { reason, details, fieldPath };
}

function warningsFromV2Failures(failures: V2ValidationFailure[]): PostDispatchAdvisory[] {
  return failures.map((failure) => ({
    code: `warn_${failure.reason}`,
    detail: failure.details,
    fieldPath: failure.fieldPath,
  }));
}

function findLastIterationRecord(content: string): Record<string, unknown> | null {
  const lines = content.split(/\r?\n/);
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index]?.trim();
    if (!line) continue;
    try {
      const parsed = JSON.parse(line);
      if (isObjectRecord(parsed) && parsed.type === CANONICAL_ITERATION_TYPE) {
        return parsed;
      }
    } catch {
    }
  }
  return null;
}

function findLastJsonlRegion(content: Buffer, startByte = 0): JsonlLineRegion | null {
  const regions: JsonlLineRegion[] = [];
  let startOffset = clampByteOffset(startByte, content.length);

  while (startOffset < content.length) {
    const newlineOffset = content.indexOf(0x0a, startOffset);
    const lineEndOffset = newlineOffset === -1 ? content.length : newlineOffset;
    const nextOffset = newlineOffset === -1 ? content.length : newlineOffset + 1;
    const rawEndOffset = lineEndOffset > startOffset && content[lineEndOffset - 1] === 0x0d
      ? lineEndOffset - 1
      : lineEndOffset;
    const rawLine = content.toString('utf8', startOffset, rawEndOffset);

    if (rawLine.trim() !== '') {
      const parsed = JSON.parse(rawLine);
      regions.push({
        rawLine,
        startOffset,
        nextOffset,
        parsed,
      });
    }

    startOffset = nextOffset;
  }

  return regions.at(-1) ?? null;
}

function repairJsonlTailSince(path: string, startByte: number): void {
  const content = readFileSync(path);
  let startOffset = clampByteOffset(startByte, content.length);
  let validEndOffset = startOffset;

  while (startOffset < content.length) {
    const newlineOffset = content.indexOf(0x0a, startOffset);
    const lineEndOffset = newlineOffset === -1 ? content.length : newlineOffset;
    const nextOffset = newlineOffset === -1 ? content.length : newlineOffset + 1;
    const rawEndOffset = lineEndOffset > startOffset && content[lineEndOffset - 1] === 0x0d
      ? lineEndOffset - 1
      : lineEndOffset;
    const rawLine = content.toString('utf8', startOffset, rawEndOffset);

    if (rawLine.trim() !== '') {
      try {
        JSON.parse(rawLine);
      } catch {
        break;
      }
    }

    validEndOffset = nextOffset;
    startOffset = nextOffset;
  }

  if (validEndOffset < content.length) {
    truncateSync(path, validEndOffset);
  }
}

function buildStampedJsonlContent(
  content: Buffer,
  region: JsonlLineRegion,
  record: Record<string, unknown>,
  logOffset: number,
  logPath: string,
): Buffer {
  let logSize = Math.max(0, content.length - logOffset);
  let stampedLine = Buffer.from(`${region.rawLine}\n`, 'utf8');

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const stampedRecord: IterationRecordWithLogRegion = {
      ...record,
      logOffset,
      logSize,
      logPath,
    };
    stampedLine = Buffer.from(`${JSON.stringify(stampedRecord)}\n`, 'utf8');
    const nextContentSize = region.startOffset + stampedLine.length + (content.length - region.nextOffset);
    const nextLogSize = Math.max(0, nextContentSize - logOffset);
    if (nextLogSize === logSize) {
      break;
    }
    logSize = nextLogSize;
  }

  return Buffer.concat([
    content.subarray(0, region.startOffset),
    stampedLine,
    content.subarray(region.nextOffset),
  ]);
}

function writeBufferAtomic(filePath: string, content: Buffer): void {
  const tempPath = `${filePath}.tmp.${process.pid}.${Date.now()}`;

  try {
    writeFileSync(tempPath, content);
    renameSync(tempPath, filePath);
  } catch (error) {
    rmSync(tempPath, { force: true });
    throw error;
  }
}

function stampIterationLogRegion(
  input: PostDispatchValidateInput,
  content: Buffer,
  region: JsonlLineRegion,
  record: Record<string, unknown>,
): void {
  if (record.type !== CANONICAL_ITERATION_TYPE) {
    return;
  }

  const logOffset = Math.max(0, Math.min(input.previousStateLogSize, region.startOffset));
  const stampedContent = buildStampedJsonlContent(
    content,
    region,
    record,
    logOffset,
    resolve(input.stateLogPath),
  );
  writeBufferAtomic(input.stateLogPath, stampedContent);
}

function validateV2IterationRecord(
  record: Record<string, unknown>,
  deltaIterationRecord: Record<string, unknown> | null,
): V2ValidationFailure[] {
  const failures: V2ValidationFailure[] = [];
  const applicability = record.reviewDepthApplicability;
  const targetSelection = record.targetSelection;
  const searchCoverage = record.searchCoverage;

  if (!isObjectRecord(applicability)) {
    failures.push(v2Failure('jsonl_missing_fields', 'reviewDepthApplicability must be an object', 'reviewDepthApplicability'));
  } else {
    if (!V2_SCOPE_CLASSES.has(String(applicability.scopeClass))) {
      failures.push(v2Failure('jsonl_missing_fields', 'reviewDepthApplicability.scopeClass must be trivial, standard, or complex', 'reviewDepthApplicability.scopeClass'));
    }
    if (!V2_ENFORCEMENT_MODES.has(String(applicability.enforcement))) {
      failures.push(v2Failure('jsonl_missing_fields', 'reviewDepthApplicability.enforcement must be strict, warn, or skip', 'reviewDepthApplicability.enforcement'));
    }
  }

  if (!isObjectRecord(targetSelection)) {
    failures.push(v2Failure('jsonl_missing_fields', 'targetSelection must be an object', 'targetSelection'));
  } else {
    if (!Array.isArray(targetSelection.selectedTargets)) {
      failures.push(v2Failure('jsonl_missing_fields', 'targetSelection.selectedTargets must be an array', 'targetSelection.selectedTargets'));
    }
    if (!Array.isArray(targetSelection.discoveryMethods)) {
      failures.push(v2Failure('jsonl_missing_fields', 'targetSelection.discoveryMethods must be an array', 'targetSelection.discoveryMethods'));
    }
  }

  if (!isObjectRecord(searchCoverage)) {
    failures.push(v2Failure('jsonl_missing_fields', 'searchCoverage must be an object', 'searchCoverage'));
  } else {
    if (!V2_GRAPH_COVERAGE_MODES.has(String(searchCoverage.graphCoverageMode))) {
      failures.push(v2Failure('jsonl_missing_fields', 'searchCoverage.graphCoverageMode must be graph, graphless_fallback, or unavailable_blocked', 'searchCoverage.graphCoverageMode'));
    }
  }

  const scopeClass = isObjectRecord(applicability) && typeof applicability.scopeClass === 'string'
    ? applicability.scopeClass
    : '';
  const enforcement = isObjectRecord(applicability) && typeof applicability.enforcement === 'string'
    ? applicability.enforcement
    : '';
  const nonTrivialScope = scopeClass !== 'trivial' || enforcement !== 'skip';

  if (nonTrivialScope) {
    if (!Array.isArray(record.searchLedger) || record.searchLedger.length === 0) {
      failures.push(v2Failure('v2_missing_ledger', 'non-trivial v2 records must include at least one searchLedger row', 'searchLedger'));
    }

    const findingIds = new Set(
      Array.isArray(record.findingDetails)
        ? record.findingDetails
            .filter(isObjectRecord)
            .map((finding) => (typeof finding.id === 'string' ? finding.id : null))
            .filter((id): id is string => id !== null)
        : [],
    );

    if (Array.isArray(record.searchLedger)) {
      for (let index = 0; index < record.searchLedger.length; index += 1) {
        const row = record.searchLedger[index];
        if (!isObjectRecord(row)) {
          failures.push(v2Failure('jsonl_missing_fields', `searchLedger[${index}] must be an object`, `searchLedger[${index}]`));
          continue;
        }
        const actions = Array.isArray(row.searchActions) ? row.searchActions : [];
        if (
          actions.length === 0
          || actions.some((action) => !isObjectRecord(action) || !isNonEmptyStringArray(action.evidenceRefs))
        ) {
          failures.push(v2Failure('v2_uncited_ledger_row', `searchLedger[${index}] must cite evidenceRefs on every searchActions entry`, `searchLedger[${index}].searchActions`));
        }
        if (row.disposition === 'finding') {
          const linkedFindingId = typeof row.linkedFindingId === 'string' ? row.linkedFindingId : '';
          if (!linkedFindingId || !findingIds.has(linkedFindingId)) {
            failures.push(v2Failure('v2_broken_linked_finding', `searchLedger[${index}] linkedFindingId '${linkedFindingId || '[missing]'}' is not present in findingDetails[].id`, `searchLedger[${index}].linkedFindingId`));
          }
        }
      }
    }

    if (Array.isArray(record.findingDetails)) {
      for (let index = 0; index < record.findingDetails.length; index += 1) {
        const finding = record.findingDetails[index];
        if (!isObjectRecord(finding)) continue;
        const disposition = typeof finding.disposition === 'string' ? finding.disposition : 'active';
        if (disposition !== 'active') continue;
        if (!isNonEmptyStringArray(finding.affectedSurfaceHints) || typeof finding.scopeProof !== 'string' || finding.scopeProof.trim() === '') {
          const id = typeof finding.id === 'string' ? finding.id : `index ${index}`;
          failures.push(v2Failure('v2_shallow_finding_details', `active finding ${id} must include non-empty scopeProof and affectedSurfaceHints`, `findingDetails[${index}]`));
        }
      }
    }
  }

  if (deltaIterationRecord) {
    const stateIteration = typeof record.iteration === 'number' ? record.iteration : record.run;
    const deltaIteration = typeof deltaIterationRecord.iteration === 'number'
      ? deltaIterationRecord.iteration
      : deltaIterationRecord.run;
    if (typeof stateIteration === 'number' && typeof deltaIteration === 'number' && stateIteration !== deltaIteration) {
      failures.push(v2Failure(
        'delta_iteration_id_mismatch',
        `state-log iteration ${stateIteration} does not match delta iteration ${deltaIteration}`,
        'iteration',
      ));
    } else if (canonicalReceiptJson(record) !== canonicalReceiptJson(deltaIterationRecord)) {
      failures.push(v2Failure(
        'state_delta_iteration_mismatch',
        'state-log and delta canonical iteration records differ',
      ));
    }
  }

  return failures;
}

// ───── 5. EXPORTS ─────

/**
 * Build a neutral fallback card for an exhausted judge path.
 *
 * @param input - Failure metadata used to construct the fallback card.
 * @returns A quarantined neutral score card.
 */
export function createNeutralJudgeFallbackCard(input: JudgeFallbackInput): NeutralJudgeFallbackCard {
  const failureKind = input.failures.at(-1)?.kind ?? 'unknown';

  return {
    type: 'judge_fallback_card',
    fallback: true,
    quarantined: true,
    score: 0.5,
    confidence: 0,
    reason: input.reason,
    metadata: {
      attempts: input.failures.length,
      maxAttempts: input.maxAttempts,
      failureKind,
      failures: input.failures,
      formatStripRetries: input.formatStripRetries,
      fastTimeouts: input.fastTimeouts,
      slowTimeouts: input.slowTimeouts,
      generatedAt: input.now?.() ?? new Date().toISOString(),
    },
  };
}

/**
 * Check whether a value is marked for judge quarantine.
 *
 * @param value - Candidate judge card or state record.
 * @returns True when the value must be excluded from write paths.
 */
export function isQuarantinedJudgeCard(value: unknown): value is Record<string, unknown> & { quarantined: true } {
  return isObjectRecord(value) && value.quarantined === true;
}

/**
 * Run a model-backed judge call with retry, timeout, parse, and fallback guards.
 *
 * @param input - Judge invocation and hardening configuration.
 * @returns A parsed judge card or a quarantined neutral fallback card.
 */
export async function runJudgeWithHardening<TCard extends Record<string, unknown>>(
  input: JudgeHardeningInput<TCard>,
): Promise<JudgeHardeningResult<TCard>> {
  const maxAttempts = normalizePositiveInteger(input.maxAttempts, DEFAULT_JUDGE_MAX_ATTEMPTS);
  const fastTimeoutMs = normalizeNonNegativeInteger(input.fastTimeoutMs, DEFAULT_JUDGE_FAST_TIMEOUT_MS);
  const slowTimeoutMs = normalizeNonNegativeInteger(input.slowTimeoutMs, DEFAULT_JUDGE_SLOW_TIMEOUT_MS);
  const sleep = input.sleep ?? defaultSleep;
  const failures: JudgeAttemptFailure[] = [];
  let formatStripRetries = 0;
  let fastTimeouts = 0;
  let slowTimeouts = 0;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    let fastTimedOut = false;
    try {
      const response = await callJudgeWithDualTimeouts(input.invoke, fastTimeoutMs, slowTimeoutMs);
      fastTimedOut = response.fastTimedOut;
      if (response.fastTimedOut) {
        fastTimeouts += 1;
      }

      const parsed = parseJudgeJsonWithFormatStrip(response.text);
      if (parsed.formatStripRetried) {
        formatStripRetries += 1;
      }
      if (!parsed.ok) {
        failures.push({
          attempt,
          kind: 'parse_error',
          message: parsed.error,
          fastTimedOut,
          formatStripRetried: parsed.formatStripRetried,
        });
      } else {
        try {
          const card = input.parse ? input.parse(parsed.record) : (parsed.record as TCard);
          return {
            ok: true,
            card,
            attempts: attempt,
            failures,
            formatStripRetries,
            fastTimeouts,
            slowTimeouts,
          };
        } catch (error: unknown) {
          failures.push({
            attempt,
            kind: 'parse_error',
            message: errorMessage(error),
            fastTimedOut,
            formatStripRetried: parsed.formatStripRetried,
          });
        }
      }
    } catch (error: unknown) {
      const kind: JudgeFailureKind = error instanceof JudgeTimeoutError ? 'slow_timeout' : 'model_error';
      if (kind === 'slow_timeout') {
        slowTimeouts += 1;
      }
      failures.push({
        attempt,
        kind,
        message: errorMessage(error),
        fastTimedOut,
        formatStripRetried: false,
      });
    }

    if (attempt < maxAttempts) {
      const backoffMs = resolveJudgeBackoffMs(input.backoffMs, attempt);
      if (backoffMs > 0) {
        await sleep(backoffMs);
      }
    }
  }

  const card = createNeutralJudgeFallbackCard({
    reason: input.fallbackReason ?? 'judge failed after hardened retries',
    failures,
    maxAttempts,
    formatStripRetries,
    fastTimeouts,
    slowTimeouts,
    now: input.now,
  });

  return {
    ok: false,
    card,
    attempts: maxAttempts,
    failures,
    formatStripRetries,
    fastTimeouts,
    slowTimeouts,
  };
}

/**
 * Persist a judge card only when it is not quarantined.
 *
 * @param card - Judge card to write.
 * @param writers - Optional writers for each persistence surface.
 * @returns A summary of written and skipped surfaces.
 */
export async function persistJudgeCardUnlessQuarantined<TCard extends Record<string, unknown>>(
  card: TCard,
  writers: JudgePersistenceWriters<TCard>,
): Promise<JudgePersistenceResult> {
  const configuredSurfaces = JUDGE_PERSISTENCE_SURFACES.filter((surface) => writers[surface] !== undefined);

  if (isQuarantinedJudgeCard(card)) {
    return {
      persisted: false,
      writtenSurfaces: [],
      skippedSurfaces: configuredSurfaces.length > 0 ? configuredSurfaces : [...JUDGE_PERSISTENCE_SURFACES],
      reason: 'quarantined',
    };
  }

  const writtenSurfaces: JudgePersistenceSurface[] = [];
  for (const surface of JUDGE_PERSISTENCE_SURFACES) {
    const writer = writers[surface];
    if (!writer) {
      continue;
    }
    await writer(card, surface);
    writtenSurfaces.push(surface);
  }

  return {
    persisted: writtenSurfaces.length > 0,
    writtenSurfaces,
    skippedSurfaces: JUDGE_PERSISTENCE_SURFACES.filter((surface) => !writtenSurfaces.includes(surface)),
    reason: writtenSurfaces.length === 0 ? 'no_writer' : undefined,
  };
}

/**
 * Compute a verification confidence score from stage scores.
 *
 * Weighted scoring: compiled (0.35), executed (0.25), testsPassed (0.25),
 * lintClean (0.1), minus autoFixed penalty (0.05).
 *
 * @param stages - Verification stage scores.
 * @returns Confidence score in [0.0, 1.0].
 */
export function computeVerificationConfidence(stages: VerificationStageScores): number {
  let score = 0;
  if (stages.compiled) score += 0.35;
  if (stages.executed) score += 0.25;
  if (stages.testsPassed) score += 0.25;
  if (stages.lintClean) score += 0.1;
  if (stages.autoFixed) score -= 0.05;
  return Math.max(0, Math.min(1, Number(score.toFixed(4))));
}

/**
 * Run optional verification pass on code blocks extracted from the iteration file.
 *
 * Scans the iteration file for fenced code blocks in configured languages
 * and scores their quality against the threshold.
 *
 * @param iterationFile - Path to the iteration output file.
 * @param recipeConfig - Verification recipe configuration.
 * @returns Pass result with confidence, threshold, and language info.
 */
export function runOptionalVerificationPass(
  iterationFile: string,
  recipeConfig?: PostDispatchRecipeConfig,
): VerificationPassResult {
  if (recipeConfig?.verification_enabled !== true) {
    return { ok: true, skipped: true, reason: 'verification_disabled' };
  }

  const configuredLanguages = (recipeConfig.verification_languages ?? []).filter(isVerificationLanguage);
  const threshold = recipeConfig.verification_threshold ?? DEFAULT_VERIFICATION_THRESHOLD;
  const content = readFileSync(iterationFile, 'utf8');
  const codeBlocks = extractCodeBlocks(content, configuredLanguages);

  if (codeBlocks.length === 0) {
    return { ok: true, skipped: true, reason: 'no_code_output' };
  }

  const scoredBlocks = codeBlocks.map((block) => {
    const stages = scoreCodeBlock(block.language, block.code);
    return {
      language: block.language,
      confidence: computeVerificationConfidence(stages),
      stages,
    };
  });
  const lowest = scoredBlocks.reduce((currentLowest, candidate) =>
    candidate.confidence < currentLowest.confidence ? candidate : currentLowest,
  );

  if (lowest.confidence < threshold) {
    return {
      ok: false,
      reason: 'verification_degraded',
      confidence: lowest.confidence,
      threshold,
      language: lowest.language,
      details: `verification confidence ${lowest.confidence.toFixed(2)} below threshold ${threshold.toFixed(2)}`,
      stages: lowest.stages,
    };
  }

  return {
    ok: true,
    skipped: false,
    confidence: lowest.confidence,
    threshold,
    language: lowest.language,
    stages: lowest.stages,
  };
}

/**
 * Validate post-dispatch iteration outputs.
 *
 * Verifies that the JSONL state log was appended, the iteration file exists
 * and is non-empty, required fields are present, and optional v2 depth checks
 * and code verification passes are applied.
 *
 * @param input - Validation input with paths, field requirements, and config.
 * @returns Validation result indicating pass/fail with details.
 */
// Heuristic behavioral signals for an iteration's prose — drift nudges toward the
// fable-5 signature (result-first openers, lean hedging, evidence-backed claims).
// These are advisory only: callers see them in `warnings`, never in the `ok` verdict.
function computeBehavioralAdvisories(text: string): PostDispatchAdvisory[] {
  const out: PostDispatchAdvisory[] = [];
  const firstLine = (text.split('\n').find((l) => l.trim() && !l.trim().startsWith('#')) || '').trim();
  if (/^(?:I'?ll\b|I will\b|Let me\b|Let's\b|I'?m going to\b|Now I\b|First,?\s+I\b|I need to\b)/i.test(firstLine)) {
    out.push({ code: 'behavioral_self_opener', detail: 'iteration opens with self-narration; prefer a result-first opener' });
  }
  const caveats = (text.match(/\b(?:however|that said|worth noting|keep in mind|bear in mind|on the other hand|to be fair)\b/gi) || []).length;
  if (caveats >= 4) {
    out.push({ code: 'behavioral_high_caveat', detail: `${caveats} hedging caveats; keep only load-bearing qualifiers` });
  }
  let claims = 0;
  let backed = 0;
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    if (/\b(?:done|completed?|verified|passes|passing|works|confirmed|shipped)\b/i.test(sentence)) {
      claims += 1;
      if (/(?:\[SOURCE:|`[^`]+`|\b[\w./-]+\.(?:ts|js|cjs|py|sh|md|json|yaml)\b|:\d+\b|\bvalidate\.sh\b|\bvitest\b|\bPASS)/.test(sentence)) backed += 1;
    }
  }
  if (claims >= 2 && backed / claims < 0.5) {
    out.push({ code: 'behavioral_uncited_completion', detail: `${claims - backed}/${claims} completion claims lack nearby evidence` });
  }
  return out;
}

export function validateIterationOutputs(input: PostDispatchValidateInput): PostDispatchValidateResult {
  const warnings: PostDispatchAdvisory[] = [];

  repairJsonlTailSince(input.stateLogPath, input.previousStateLogSize);

  if (statSync(input.stateLogPath).size <= input.previousStateLogSize) {
    return {
      ok: false,
      reason: 'jsonl_not_appended',
      details: `no new records since ${input.previousStateLogSize} bytes`,
    };
  }

  const stateLogContent = readFileSync(input.stateLogPath);
  const currentRecordRegion = findLastJsonlRegion(stateLogContent, input.previousStateLogSize);

  try {
    if (!currentRecordRegion) {
      return {
        ok: false,
        reason: 'jsonl_parse_error',
        details: 'No JSONL record found in current append',
      };
    }

    const parsedRecord = currentRecordRegion.parsed;
    if (!isObjectRecord(parsedRecord)) {
      return {
        ok: false,
        reason: 'jsonl_parse_error',
        details: 'Last JSONL line is not an object',
      };
    }

    if (parsedRecord.type === 'event' && parsedRecord.event === 'dispatch_failure') {
      return {
        ok: false,
        reason: 'dispatch_failure_logged',
        details:
          typeof parsedRecord.reason === 'string'
            ? `dispatch_failure:${parsedRecord.reason}${typeof parsedRecord.detail === 'string' ? `:${parsedRecord.detail}` : ''}`
            : 'dispatch_failure',
      };
    }

    if (input.recipeConfig?.judge_quarantine_enabled === true && isQuarantinedJudgeCard(parsedRecord)) {
      return {
        ok: true,
        warnings: [
          {
            code: 'judge_card_quarantined',
            detail: 'quarantined judge card skipped before post-dispatch writes',
            fieldPath: 'quarantined',
          },
        ],
      };
    }

    if (!existsSync(input.iterationFile)) {
      return { ok: false, reason: 'iteration_file_missing', details: input.iterationFile };
    }

    if (statSync(input.iterationFile).size === 0) {
      return { ok: false, reason: 'iteration_file_empty', details: input.iterationFile };
    }

    if (parsedRecord.type !== CANONICAL_ITERATION_TYPE) {
      return {
        ok: false,
        reason: 'jsonl_wrong_type',
        details: `last record uses type='${String(parsedRecord.type)}' (expected '${CANONICAL_ITERATION_TYPE}')`,
      };
    }

    const requiredFields = requiredJsonlFieldSet(input, parsedRecord);
    const missingFields = [...requiredFields].filter((field) => !(field in parsedRecord));

    if (missingFields.length > 0) {
      return {
        ok: false,
        reason: 'jsonl_missing_fields',
        details: `missing: ${missingFields.join(',')}`,
      };
    }

    if (requiredFields.has('filesReviewed') && !Array.isArray(parsedRecord.filesReviewed)) {
      return {
        ok: false,
        reason: 'jsonl_missing_fields',
        details: 'filesReviewed must be an array of reviewed file paths',
      };
    }
    if (requiredFields.has('dimensions') && !Array.isArray(parsedRecord.dimensions)) {
      return {
        ok: false,
        reason: 'jsonl_missing_fields',
        details: 'dimensions must be an array',
      };
    }
    if (requiredFields.has('findingDetails') && !Array.isArray(parsedRecord.findingDetails)) {
      return {
        ok: false,
        reason: 'jsonl_missing_fields',
        details: 'findingDetails must be an array',
      };
    }
    if (requiredFields.has('newFindingsRatio') && typeof parsedRecord.newFindingsRatio !== 'number') {
      return {
        ok: false,
        reason: 'jsonl_missing_fields',
        details: 'newFindingsRatio must be a number',
      };
    }

    if (input.executorKind && input.executorKind !== 'native' && !isObjectRecord(parsedRecord.executor)) {
      return {
        ok: false,
        reason: 'executor_missing',
        details: `missing executor provenance for non-native executor kind '${input.executorKind}'`,
      };
    }

    let deltaIterationRecord: Record<string, unknown> | null = null;
    if (input.deltaFilePath) {
      if (!existsSync(input.deltaFilePath)) {
        return { ok: false, reason: 'delta_file_missing', details: input.deltaFilePath };
      }
      if (statSync(input.deltaFilePath).size === 0) {
        return { ok: false, reason: 'delta_file_empty', details: input.deltaFilePath };
      }
      const deltaContent = readFileSync(input.deltaFilePath, 'utf8');
      deltaIterationRecord = findLastIterationRecord(deltaContent);
      if (!deltaIterationRecord) {
        return {
          ok: false,
          reason: 'delta_file_missing_iteration_record',
          details: `${input.deltaFilePath} has no record with type='${CANONICAL_ITERATION_TYPE}'`,
        };
      }
    }

    // A structurally valid, intent-bound dispatch receipt pair makes the
    // model-written route-proof fields advisory: the receipt facts were
    // written by the engine's own dispatch wrapper, not self-reported by the
    // model, so a dispatch that omits or disagrees with them is accepted
    // (warned, not blocked) once the receipt pair itself checks out. This
    // does not require the mac to cryptographically correlate — see
    // validateDispatchReceipt for why it cannot, across a real process
    // boundary. When no receipt is configured, route-proof keeps its legacy
    // strict behavior.
    let modelFieldsAdvisory = false;
    if (input.dispatchReceipt) {
      const receiptOutcome = validateDispatchReceipt(input.dispatchReceipt);
      if (receiptOutcome.failure) {
        return receiptOutcome.failure;
      }
      warnings.push(...receiptOutcome.warnings);
      modelFieldsAdvisory = true;
    }

    const stateRouteProof = validateRouteProofRecord(parsedRecord, input.routeProof, 'state_log', modelFieldsAdvisory);
    if (stateRouteProof.failure) {
      return stateRouteProof.failure;
    }
    warnings.push(...stateRouteProof.warnings);

    if (deltaIterationRecord) {
      const deltaRouteProof = validateRouteProofRecord(deltaIterationRecord, input.routeProof, 'delta', modelFieldsAdvisory);
      if (deltaRouteProof.failure) {
        return deltaRouteProof.failure;
      }
      warnings.push(...deltaRouteProof.warnings);
    }

    if (parsedRecord.reviewDepthSchemaVersion !== 2) {
      if (isLegacyNonTrivialReviewRecord(parsedRecord)) {
        warnings.push({
          code: 'legacy_unversioned_record',
          detail: 'non-trivial review record has no reviewDepthSchemaVersion: 2 discriminator; v2 depth checks skipped',
          fieldPath: 'reviewDepthSchemaVersion',
        });
      }
    } else {
      const enforcementMode = getV2EnforcementMode();
      if (enforcementMode === 'off') {
        if (Array.isArray(parsedRecord.searchLedger) && parsedRecord.searchLedger.length > 0) {
          warnings.push({
            code: 'ledger_present_but_unverified',
            detail: 'DEEP_REVIEW_V2_ENFORCEMENT=off skipped v2 searchLedger validation',
            fieldPath: 'searchLedger',
          });
        }
      } else {
        const v2Failures = validateV2IterationRecord(parsedRecord, deltaIterationRecord);
        const parityFailure = v2Failures.find(
          (failure) => failure.reason === 'delta_iteration_id_mismatch'
            || failure.reason === 'state_delta_iteration_mismatch',
        );
        if (parityFailure) {
          return {
            ok: false,
            reason: parityFailure.reason,
            details: parityFailure.details,
            warnings: warnings.length > 0 ? warnings : undefined,
          };
        }
        if (v2Failures.length > 0 && enforcementMode === 'strict') {
          return {
            ok: false,
            reason: v2Failures[0].reason,
            details: v2Failures[0].details,
            warnings: warnings.length > 0 ? warnings : undefined,
          };
        }
        if (v2Failures.length > 0) {
          warnings.push({
            code: 'applicability_strict_unenforced',
            detail: 'DEEP_REVIEW_V2_ENFORCEMENT=warn converted v2 depth failures to advisories',
            fieldPath: 'reviewDepthApplicability.enforcement',
          });
          warnings.push(...warningsFromV2Failures(v2Failures));
        }
      }
    }

    // Optional evidence contract: malformed metadata warns, absent metadata is
    // silent, and the verdict stays ok:true so a legacy exchange that omits the
    // metadata still passes. No new blocking failure reason is introduced; the
    // strict opt-in marks the advisory without rejecting the exchange.
    if (getEvidenceEnforcementMode() !== 'off') {
      const evidenceWarnings = evidenceAdvisories(parsedRecord);
      if (evidenceWarnings.length > 0) {
        if (getEvidenceEnforcementMode() === 'strict') {
          warnings.push({
            code: 'evidence_contract_strict_unenforced',
            detail: 'DEEP_LOOP_EVIDENCE_ENFORCEMENT=strict surfaced malformed evidence as advisories; no blocking reason is defined yet',
            fieldPath: 'evidence',
          });
        }
        warnings.push(...evidenceWarnings);
      }
    }

    const verificationResult = runOptionalVerificationPass(input.iterationFile, input.recipeConfig);
    if (!verificationResult.ok) {
      appendJsonlRecord(
        input.stateLogPath,
        JSON.parse(buildVerificationDegradedEvent({
          confidence: verificationResult.confidence,
          threshold: verificationResult.threshold,
          language: verificationResult.language,
          details: verificationResult.details,
        })),
      );
      return {
        ok: false,
        reason: 'verification_degraded',
        details: verificationResult.details,
      };
    }

    stampIterationLogRegion(input, stateLogContent, currentRecordRegion, parsedRecord);
  } catch (error: unknown) {
    const details = error instanceof Error ? error.message : String(error);
    return { ok: false, reason: 'jsonl_parse_error', details };
  }

  try {
    warnings.push(...computeBehavioralAdvisories(readFileSync(input.iterationFile, 'utf8')));
  } catch {
    // Behavioral advisory is best-effort and verdict-neutral; never fail on it.
  }

  return warnings.length > 0 ? { ok: true, warnings } : { ok: true };
}

/**
 * Validate iteration outputs and throw on failure.
 *
 * @param input - Validation input with paths, field requirements, and config.
 * @throws {@link PostDispatchValidationError} If validation fails.
 */
export function validateOrThrow(input: PostDispatchValidateInput): void {
  const result = validateIterationOutputs(input);

  if (!result.ok) {
    throw new PostDispatchValidationError(result);
  }
}
