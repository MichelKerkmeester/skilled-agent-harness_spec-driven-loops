// MODULE: Deep-Loop Post-Dispatch Validator

import { appendFileSync, existsSync, readFileSync, statSync } from 'node:fs';

import type { ExecutorKind } from './executor-config.js';

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
  /**
   * Per-iteration delta file path (e.g. `deltas/iter-003.jsonl`). When supplied,
   * the validator asserts the file exists and is non-empty. The file is the
   * structured-delta stream that complements the canonical state-log append —
   * it MUST include at least one record whose `type === 'iteration'` so the
   * reducer can rehydrate iteration state from the delta after interruption.
   */
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

export type PostDispatchValidateResult =
  | { ok: true }
  | {
      ok: false;
      reason:
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
        | 'verification_degraded';
      details: string;
    };

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

/**
 * Canonical iteration record type. The reducer counts records where
 * `type === CANONICAL_ITERATION_TYPE` ONLY. Variants such as
 * `"iteration_delta"`, `"iter"`, or any other spelling are silently ignored and
 * will surface as iteration-count drift in the reducer output.
 */
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
      // fall through
    }
  }
  return null;
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

export function computeVerificationConfidence(stages: VerificationStageScores): number {
  let score = 0;
  if (stages.compiled) score += 0.35;
  if (stages.executed) score += 0.25;
  if (stages.testsPassed) score += 0.25;
  if (stages.lintClean) score += 0.1;
  if (stages.autoFixed) score -= 0.05;
  return Math.max(0, Math.min(1, Number(score.toFixed(4))));
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

export function validateIterationOutputs(input: PostDispatchValidateInput): PostDispatchValidateResult {
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

    // Canonical type guard: the state-log append MUST use `"type":"iteration"`.
    // Variants such as `"iteration_delta"` are silently dropped by the reducer.
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

    // Per-iteration delta file assertion (when requested by the caller).
    if (input.deltaFilePath) {
      if (!existsSync(input.deltaFilePath)) {
        return { ok: false, reason: 'delta_file_missing', details: input.deltaFilePath };
      }
      if (statSync(input.deltaFilePath).size === 0) {
        return { ok: false, reason: 'delta_file_empty', details: input.deltaFilePath };
      }
      const deltaContent = readFileSync(input.deltaFilePath, 'utf8');
      const deltaIterationRecord = findLastIterationRecord(deltaContent);
      if (!deltaIterationRecord) {
        return {
          ok: false,
          reason: 'delta_file_missing_iteration_record',
          details: `${input.deltaFilePath} has no record with type='${CANONICAL_ITERATION_TYPE}'`,
        };
      }
    }

    const verificationResult = runOptionalVerificationPass(input.iterationFile, input.recipeConfig);
    if (!verificationResult.ok) {
      appendFileSync(
        input.stateLogPath,
        `${buildVerificationDegradedEvent({
          confidence: verificationResult.confidence,
          threshold: verificationResult.threshold,
          language: verificationResult.language,
          details: verificationResult.details,
        })}\n`,
        'utf8',
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

  return { ok: true };
}

export class PostDispatchValidationError extends Error {
  result: PostDispatchValidateResult;

  constructor(result: PostDispatchValidateResult) {
    super(result.ok ? 'Post-dispatch validation unexpectedly succeeded' : `${result.reason}: ${result.details}`);
    this.name = 'PostDispatchValidationError';
    this.result = result;
  }
}

export function validateOrThrow(input: PostDispatchValidateInput): void {
  const result = validateIterationOutputs(input);

  if (!result.ok) {
    throw new PostDispatchValidationError(result);
  }
}
