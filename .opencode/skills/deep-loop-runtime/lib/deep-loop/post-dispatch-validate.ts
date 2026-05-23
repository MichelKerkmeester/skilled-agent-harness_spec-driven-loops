// MODULE: Deep-Loop Post-Dispatch Validator

import { existsSync, readFileSync, statSync } from 'node:fs';

import type { ExecutorKind } from './executor-config.js';
import { appendJsonlRecord, repairJsonlTail } from './jsonl-repair.js';

// ───── TYPE DEFINITIONS ─────

export type VerificationLanguage = 'python' | 'typescript' | 'javascript' | 'rust' | 'go';

export type PostDispatchRecipeConfig = {
  verification_enabled?: boolean;
  verification_languages?: VerificationLanguage[];
  verification_threshold?: number;
};

export type PostDispatchValidateInput = {
  iterationFile: string;
  stateLogPath: string;
  previousStateLogSize: number;
  requiredJsonlFields: string[];
  executorKind?: ExecutorKind;
  deltaFilePath?: string;
  recipeConfig?: PostDispatchRecipeConfig;
};

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
  | 'v2_missing_ledger'
  | 'v2_uncited_ledger_row'
  | 'v2_broken_linked_finding'
  | 'v2_shallow_finding_details'
  | 'delta_iteration_id_mismatch';

export type PostDispatchValidateResult =
  | { ok: true; warnings?: PostDispatchAdvisory[] }
  | {
      ok: false;
      reason: PostDispatchFailureReason;
      details: string;
      warnings?: PostDispatchAdvisory[];
    };

// ───── DOMAIN ERRORS ─────

export class PostDispatchValidationError extends Error {
  result: PostDispatchValidateResult;

  constructor(result: PostDispatchValidateResult) {
    super(result.ok ? 'Post-dispatch validation unexpectedly succeeded' : `${result.reason}: ${result.details}`);
    this.name = 'PostDispatchValidationError';
    this.result = result;
  }
}

// ───── CONSTANTS ─────

const CANONICAL_ITERATION_TYPE = 'iteration' as const;
const DEFAULT_VERIFICATION_THRESHOLD = 0.5;
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
  'findingDetails',
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

// ───── HELPERS ─────

function getLastNonEmptyLine(content: string): string | null {
  const lines = content.split(/\r?\n/);

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index];
    if (line.trim() !== '') {
      return line;
    }
  }

  return null;
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

function isLegacyNonTrivialReviewRecord(record: Record<string, unknown>): boolean {
  return (Array.isArray(record.findingDetails) && record.findingDetails.length > 0)
    || (Array.isArray(record.dimensions) && record.dimensions.length > 1);
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
    }
  }

  return failures;
}

// ───── EXPORTS ─────

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
export function validateIterationOutputs(input: PostDispatchValidateInput): PostDispatchValidateResult {
  const warnings: PostDispatchAdvisory[] = [];

  repairJsonlTail(input.stateLogPath);

  if (statSync(input.stateLogPath).size <= input.previousStateLogSize) {
    return {
      ok: false,
      reason: 'jsonl_not_appended',
      details: `no new records since ${input.previousStateLogSize} bytes`,
    };
  }

  const stateLogContent = readFileSync(input.stateLogPath, 'utf8');
  const lastLine = getLastNonEmptyLine(stateLogContent);

  try {
    const parsedRecord = JSON.parse(lastLine ?? '');
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

    const requiredFields = new Set([
      ...input.requiredJsonlFields,
      ...(
        input.requiredJsonlFields.includes('findingsSummary') || input.requiredJsonlFields.includes('filesReviewed')
          ? REVIEW_ITERATION_FIELDS
          : []
      ),
    ]);
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
        const identityFailure = v2Failures.find((failure) => failure.reason === 'delta_iteration_id_mismatch');
        if (identityFailure) {
          return {
            ok: false,
            reason: identityFailure.reason,
            details: identityFailure.details,
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
  } catch (error: unknown) {
    const details = error instanceof Error ? error.message : String(error);
    return { ok: false, reason: 'jsonl_parse_error', details };
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
