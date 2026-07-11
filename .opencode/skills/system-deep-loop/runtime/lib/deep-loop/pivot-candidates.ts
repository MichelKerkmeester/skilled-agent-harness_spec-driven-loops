// ───────────────────────────────────────────────────────────────────
// MODULE: Divergent Pivot Candidates
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** A mode-owned decision that a candidate remains inside its allowed boundary. */
export interface PivotBoundaryVerdict {
  readonly status: 'within_boundary';
  readonly rationale: string;
}

/** Generic candidate contract shared by every divergent pivot consumer. */
export interface PivotCandidate {
  readonly id: string;
  readonly title: string;
  readonly focus: string;
  readonly evidenceRefs: readonly string[];
  readonly relevanceRationale: string;
  readonly boundaryVerdict: PivotBoundaryVerdict;
  readonly fingerprint: string;
  readonly seatProvenance: readonly string[];
}

export type PivotCandidateRejectionCode =
  | 'invalid_candidate'
  | 'invalid_prior_candidate'
  | 'duplicate_id'
  | 'exact_duplicate'
  | 'materially_similar';

/** A fail-closed reason produced while validating or deduplicating a candidate. */
export interface PivotCandidateRejection {
  readonly code: PivotCandidateRejectionCode;
  readonly field?: string;
  readonly message: string;
  readonly priorCandidateId?: string;
  readonly similarity?: number;
}

export type PivotCandidateValidation =
  | { readonly valid: true; readonly candidate: PivotCandidate }
  | { readonly valid: false; readonly rejections: readonly PivotCandidateRejection[] };

export type PivotCandidateDeduplication =
  | {
    readonly accepted: true;
    readonly candidate: PivotCandidate;
    readonly normalizedFingerprint: string;
    readonly maxSimilarity: number;
  }
  | {
    readonly accepted: false;
    readonly candidate?: PivotCandidate;
    readonly normalizedFingerprint?: string;
    readonly maxSimilarity: number;
    readonly rejections: readonly PivotCandidateRejection[];
  };

export type RejectedPivotCandidateDeduplication = Extract<
  PivotCandidateDeduplication,
  { readonly accepted: false }
>;

export interface PivotCandidateDeduplicationOptions {
  readonly candidateSimilarityThreshold?: number;
}

export interface PivotCandidateSetDeduplication {
  readonly accepted: readonly PivotCandidate[];
  readonly rejected: readonly RejectedPivotCandidateDeduplication[];
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const DEFAULT_CANDIDATE_SIMILARITY_THRESHOLD = 0.85;

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizedText(value: string): string {
  return value.normalize('NFKC').toLowerCase().replace(/\s+/gu, ' ').trim();
}

function nonEmptyString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
}

function nonEmptyStringArray(value: unknown): readonly string[] | null {
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }
  const normalized = value.map(nonEmptyString);
  return normalized.every((entry): entry is string => entry !== null) ? normalized : null;
}

function invalidField(field: string, message: string): PivotCandidateRejection {
  return { code: 'invalid_candidate', field, message };
}

function candidateTokens(candidate: PivotCandidate): Set<string> {
  const materialText = normalizedText([
    candidate.title,
    candidate.focus,
  ].join(' '));
  return new Set(materialText.match(/[\p{L}\p{N}]+/gu) ?? []);
}

function normalizedThreshold(value: number | undefined): number {
  const threshold = value ?? DEFAULT_CANDIDATE_SIMILARITY_THRESHOLD;
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1) {
    throw new TypeError('candidateSimilarityThreshold must be a finite number from 0 through 1.');
  }
  return threshold;
}

function parsePriorCandidates(
  priorCandidates: readonly unknown[],
): { candidates: readonly PivotCandidate[]; rejections: readonly PivotCandidateRejection[] } {
  const candidates: PivotCandidate[] = [];
  const rejections: PivotCandidateRejection[] = [];

  priorCandidates.forEach((prior, index) => {
    const validation = validatePivotCandidate(prior);
    if (validation.valid) {
      candidates.push(validation.candidate);
      return;
    }
    rejections.push({
      code: 'invalid_prior_candidate',
      field: `priorCandidates[${index}]`,
      message: `Prior candidate at index ${index} is invalid: ${validation.rejections
        .map((rejection) => rejection.message)
        .join('; ')}`,
    });
  });

  return { candidates, rejections };
}

// ───────────────────────────────────────────────────────────────────
// 4. EXPORTED LOGIC
// ───────────────────────────────────────────────────────────────────

/** Normalize a stable fingerprint for exact duplicate comparisons. */
export function normalizePivotCandidateFingerprint(fingerprint: string): string {
  return normalizedText(fingerprint);
}

/**
 * Compute deterministic Jaccard token similarity over candidate material.
 *
 * Titles and focuses form the comparison corpus. Rationales, evidence locations,
 * and provenance are excluded because they describe support, not the direction.
 */
export function computePivotCandidateSimilarity(
  left: PivotCandidate,
  right: PivotCandidate,
): number {
  const leftTokens = candidateTokens(left);
  const rightTokens = candidateTokens(right);
  const union = new Set([...leftTokens, ...rightTokens]);
  if (union.size === 0) {
    return normalizedText(left.focus) === normalizedText(right.focus) ? 1 : 0;
  }
  let intersectionSize = 0;
  for (const token of leftTokens) {
    if (rightTokens.has(token)) {
      intersectionSize += 1;
    }
  }
  return intersectionSize / union.size;
}

/** Validate an unknown value against the complete generic candidate contract. */
export function validatePivotCandidate(input: unknown): PivotCandidateValidation {
  if (!isRecord(input)) {
    return {
      valid: false,
      rejections: [invalidField('candidate', 'Candidate must be an object.')],
    };
  }

  const rejections: PivotCandidateRejection[] = [];
  const id = nonEmptyString(input.id);
  const title = nonEmptyString(input.title);
  const focus = nonEmptyString(input.focus);
  const evidenceRefs = nonEmptyStringArray(input.evidenceRefs);
  const relevanceRationale = nonEmptyString(input.relevanceRationale);
  const fingerprint = nonEmptyString(input.fingerprint);
  const seatProvenance = nonEmptyStringArray(input.seatProvenance);

  if (id === null) rejections.push(invalidField('id', 'Candidate id must be a non-empty string.'));
  if (title === null) rejections.push(invalidField('title', 'Candidate title must be a non-empty string.'));
  if (focus === null) rejections.push(invalidField('focus', 'Candidate focus must be a non-empty string.'));
  if (evidenceRefs === null) {
    rejections.push(invalidField('evidenceRefs', 'Candidate evidenceRefs must contain non-empty strings.'));
  }
  if (relevanceRationale === null) {
    rejections.push(invalidField(
      'relevanceRationale',
      'Candidate relevanceRationale must be a non-empty string.',
    ));
  }
  if (fingerprint === null) {
    rejections.push(invalidField('fingerprint', 'Candidate fingerprint must be a non-empty string.'));
  }
  if (seatProvenance === null) {
    rejections.push(invalidField(
      'seatProvenance',
      'Candidate seatProvenance must contain non-empty strings.',
    ));
  }

  const boundary = input.boundaryVerdict;
  const boundaryStatus = isRecord(boundary) ? boundary.status : null;
  const boundaryRationale = isRecord(boundary) ? nonEmptyString(boundary.rationale) : null;
  if (boundaryStatus !== 'within_boundary') {
    rejections.push(invalidField(
      'boundaryVerdict.status',
      'Candidate boundaryVerdict.status must be "within_boundary".',
    ));
  }
  if (boundaryRationale === null) {
    rejections.push(invalidField(
      'boundaryVerdict.rationale',
      'Candidate boundaryVerdict.rationale must be a non-empty string.',
    ));
  }

  if (rejections.length > 0) {
    return { valid: false, rejections };
  }

  return {
    valid: true,
    candidate: {
      id: id as string,
      title: title as string,
      focus: focus as string,
      evidenceRefs: evidenceRefs as readonly string[],
      relevanceRationale: relevanceRationale as string,
      boundaryVerdict: {
        status: 'within_boundary',
        rationale: boundaryRationale as string,
      },
      fingerprint: fingerprint as string,
      seatProvenance: seatProvenance as readonly string[],
    },
  };
}

/** Validate one candidate and reject exact or materially similar prior directions. */
export function deduplicatePivotCandidate(
  input: unknown,
  priorCandidates: readonly unknown[],
  options: PivotCandidateDeduplicationOptions = {},
): PivotCandidateDeduplication {
  const threshold = normalizedThreshold(options.candidateSimilarityThreshold);
  const validation = validatePivotCandidate(input);
  if (!validation.valid) {
    return { accepted: false, maxSimilarity: 0, rejections: validation.rejections };
  }

  const parsedPrior = parsePriorCandidates(priorCandidates);
  if (parsedPrior.rejections.length > 0) {
    return {
      accepted: false,
      candidate: validation.candidate,
      normalizedFingerprint: normalizePivotCandidateFingerprint(validation.candidate.fingerprint),
      maxSimilarity: 0,
      rejections: parsedPrior.rejections,
    };
  }

  const candidate = validation.candidate;
  const normalizedFingerprint = normalizePivotCandidateFingerprint(candidate.fingerprint);
  const rejections: PivotCandidateRejection[] = [];
  let maxSimilarity = 0;

  for (const prior of parsedPrior.candidates) {
    if (prior.id === candidate.id) {
      rejections.push({
        code: 'duplicate_id',
        message: `Candidate id "${candidate.id}" already exists.`,
        priorCandidateId: prior.id,
      });
      continue;
    }
    if (normalizePivotCandidateFingerprint(prior.fingerprint) === normalizedFingerprint) {
      rejections.push({
        code: 'exact_duplicate',
        message: `Candidate fingerprint matches prior candidate "${prior.id}".`,
        priorCandidateId: prior.id,
        similarity: 1,
      });
      maxSimilarity = 1;
      continue;
    }

    const similarity = computePivotCandidateSimilarity(candidate, prior);
    maxSimilarity = Math.max(maxSimilarity, similarity);
    if (similarity >= threshold) {
      rejections.push({
        code: 'materially_similar',
        message: `Candidate is materially similar to prior candidate "${prior.id}".`,
        priorCandidateId: prior.id,
        similarity,
      });
    }
  }

  if (rejections.length > 0) {
    return {
      accepted: false,
      candidate,
      normalizedFingerprint,
      maxSimilarity,
      rejections,
    };
  }

  return { accepted: true, candidate, normalizedFingerprint, maxSimilarity };
}

/** Validate and deduplicate an ordered candidate set, including within-set duplicates. */
export function deduplicatePivotCandidates(
  inputs: readonly unknown[],
  priorCandidates: readonly unknown[],
  options: PivotCandidateDeduplicationOptions = {},
): PivotCandidateSetDeduplication {
  const accepted: PivotCandidate[] = [];
  const rejected: RejectedPivotCandidateDeduplication[] = [];
  const comparisonSet: unknown[] = [...priorCandidates];

  for (const input of inputs) {
    const result = deduplicatePivotCandidate(input, comparisonSet, options);
    if (result.accepted) {
      accepted.push(result.candidate);
      comparisonSet.push(result.candidate);
    } else {
      rejected.push(result);
    }
  }

  return { accepted, rejected };
}
