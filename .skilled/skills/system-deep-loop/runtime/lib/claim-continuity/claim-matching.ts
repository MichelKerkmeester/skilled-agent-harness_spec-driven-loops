// ───────────────────────────────────────────────────────────────────
// MODULE: Deterministic Claim Matching
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  ContinuityIdentityKinds,
  continuityDigest,
  requireRegisteredIdentity,
} from '../deep-loop/continuity-identity/index.js';
import {
  ClaimContinuityError,
  ClaimContinuityErrorCodes,
  ClaimMatchDecisions,
  ClaimMatchReasons,
} from './claim-continuity-types.js';

import type { ContinuityIdentityState } from '../deep-loop/continuity-identity/index.js';
import type {
  ClaimContinuityState,
  ClaimMatchDecision,
  ClaimMatchPolicy,
  ClaimMatchReason,
  ClaimSemanticCandidate,
  RecordClaimMatchInput,
} from './claim-continuity-types.js';

export interface EvaluatedClaimMatch {
  readonly matchRecordId: string;
  readonly aliases: string[];
  readonly candidates: ClaimSemanticCandidate[];
  readonly decision: ClaimMatchDecision;
  readonly reason: ClaimMatchReason;
  readonly resolvedClaimId: string | null;
  readonly policyDigest: string;
}

const HASH_PATTERN = /^[a-f0-9]{64}$/;
const NAMESPACE_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function boundedString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '' || value.length > 512) {
    throw new ClaimContinuityError(
      ClaimContinuityErrorCodes.INVALID_INPUT,
      `${field} must be a non-empty bounded string`,
      { field },
    );
  }
  return value;
}

/** Normalize display aliases for exact lookup without treating wording as identity. */
export function normalizeClaimAlias(value: string): string {
  return boundedString(value, 'alias')
    .normalize('NFKC')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('en-US');
}

/** Content fingerprint is lookup evidence only; it is never a durable claim key. */
export function claimTextFingerprint(value: string): string {
  const normalized = normalizeClaimAlias(value);
  return sha256Bytes(canonicalBytes({ normalized }));
}

function validatePolicy(policy: ClaimMatchPolicy): string {
  boundedString(policy.policy_version, 'policy.policy_version');
  if (
    !Number.isFinite(policy.equivalence_threshold)
    || !Number.isFinite(policy.ambiguity_floor)
    || policy.equivalence_threshold < 0
    || policy.equivalence_threshold > 1
    || policy.ambiguity_floor < 0
    || policy.ambiguity_floor > policy.equivalence_threshold
  ) {
    throw new ClaimContinuityError(
      ClaimContinuityErrorCodes.INVALID_INPUT,
      'Claim match thresholds must define a closed interval within zero and one',
    );
  }
  return continuityDigest(policy);
}

function canonicalCandidate(
  candidate: ClaimSemanticCandidate,
  identityState: Readonly<ContinuityIdentityState>,
): ClaimSemanticCandidate {
  const claimRef = requireRegisteredIdentity(
    identityState,
    candidate.claim_ref,
    ContinuityIdentityKinds.CLAIM,
  );
  if (
    !NAMESPACE_PATTERN.test(candidate.namespace)
    || !HASH_PATTERN.test(candidate.normalized_fingerprint)
    || !Number.isFinite(candidate.similarity_score)
    || candidate.similarity_score < 0
    || candidate.similarity_score > 1
    || !['equivalent', 'distinct', 'topical_only'].includes(candidate.semantic_decision)
    || typeof candidate.community_consensus !== 'boolean'
  ) {
    throw new ClaimContinuityError(
      ClaimContinuityErrorCodes.INVALID_INPUT,
      'Semantic candidate is malformed',
      { claimId: claimRef.id },
    );
  }
  boundedString(candidate.community_id, 'candidate.community_id');
  boundedString(candidate.community_projection_version, 'candidate.community_projection_version');
  if (!HASH_PATTERN.test(candidate.provenance_digest)) {
    throw new ClaimContinuityError(
      ClaimContinuityErrorCodes.INVALID_INPUT,
      'Semantic candidate provenance must be content addressed',
      { claimId: claimRef.id },
    );
  }
  return {
    ...candidate,
    claim_ref: claimRef,
  };
}

function canonicalCandidates(
  candidates: readonly ClaimSemanticCandidate[],
  identityState: Readonly<ContinuityIdentityState>,
): ClaimSemanticCandidate[] {
  const byClaim = new Map<string, ClaimSemanticCandidate>();
  for (const candidate of candidates) {
    const normalized = canonicalCandidate(candidate, identityState);
    const previous = byClaim.get(normalized.claim_ref.id);
    if (previous && continuityDigest(previous) !== continuityDigest(normalized)) {
      throw new ClaimContinuityError(
        ClaimContinuityErrorCodes.MATCH_CONFLICT,
        'Candidate set gives conflicting assessments for one claim',
        { claimId: normalized.claim_ref.id },
      );
    }
    byClaim.set(normalized.claim_ref.id, normalized);
  }
  return [...byClaim.values()].sort((left, right) => (
    compareCodeUnits(left.claim_ref.id, right.claim_ref.id)
    || compareCodeUnits(left.community_id, right.community_id)
    || compareCodeUnits(left.provenance_digest, right.provenance_digest)
  ));
}

function exactMatches(
  state: Readonly<ClaimContinuityState>,
  namespace: string,
  aliases: readonly string[],
  fingerprint: string,
): { local: string[]; foreign: string[] } {
  const aliasSet = new Set(aliases);
  const local = new Set<string>();
  const foreign = new Set<string>();
  for (const record of Object.values(state.records)) {
    const matches = record.normalized_fingerprints.includes(fingerprint)
      || record.aliases.some((alias) => aliasSet.has(alias));
    if (!matches) continue;
    (record.namespace === namespace ? local : foreign).add(record.claim_ref.id);
  }
  return {
    local: [...local].sort(compareCodeUnits),
    foreign: [...foreign].sort(compareCodeUnits),
  };
}

/** Evaluate exact and semantic evidence into one replay-stable closed decision. */
export function evaluateClaimMatch(
  state: Readonly<ClaimContinuityState>,
  identityState: Readonly<ContinuityIdentityState>,
  input: RecordClaimMatchInput,
): EvaluatedClaimMatch {
  const observationId = boundedString(input.observationId, 'observationId');
  if (!NAMESPACE_PATTERN.test(input.namespace)) {
    throw new ClaimContinuityError(
      ClaimContinuityErrorCodes.INVALID_INPUT,
      'Claim namespace is malformed',
    );
  }
  if (!HASH_PATTERN.test(input.normalizedFingerprint)) {
    throw new ClaimContinuityError(
      ClaimContinuityErrorCodes.INVALID_INPUT,
      'Normalized claim fingerprint must be a SHA-256 digest',
    );
  }
  if (!HASH_PATTERN.test(input.provenanceDigest)) {
    throw new ClaimContinuityError(
      ClaimContinuityErrorCodes.INVALID_INPUT,
      'Match provenance must be content addressed',
    );
  }
  const aliases = [...new Set(input.aliases.map(normalizeClaimAlias))].sort(compareCodeUnits);
  const candidates = canonicalCandidates(input.semanticCandidates, identityState);
  const policyDigest = validatePolicy(input.policy);
  const exact = exactMatches(
    state,
    input.namespace,
    aliases,
    input.normalizedFingerprint,
  );

  let decision: ClaimMatchDecision;
  let reason: ClaimMatchReason;
  let resolvedClaimId: string | null = null;
  if (exact.foreign.length > 0) {
    decision = ClaimMatchDecisions.UNRESOLVED;
    reason = ClaimMatchReasons.CROSS_NAMESPACE_COLLISION;
  } else if (exact.local.length > 1) {
    decision = ClaimMatchDecisions.UNRESOLVED;
    reason = ClaimMatchReasons.EXACT_COLLISION;
  } else if (exact.local.length === 1) {
    const exactId = exact.local[0];
    const incompatible = candidates.some((candidate) => (
      candidate.claim_ref.id !== exactId
      && candidate.semantic_decision === 'equivalent'
      && candidate.similarity_score >= input.policy.ambiguity_floor
    ));
    if (incompatible) {
      decision = ClaimMatchDecisions.UNRESOLVED;
      reason = ClaimMatchReasons.COMMUNITY_DISAGREEMENT;
    } else {
      decision = ClaimMatchDecisions.REUSE;
      resolvedClaimId = exactId;
      reason = state.records[exactId]?.normalized_fingerprints.includes(
        input.normalizedFingerprint,
      )
        ? ClaimMatchReasons.EXACT_FINGERPRINT
        : ClaimMatchReasons.EXACT_ALIAS;
    }
  } else {
    const unknown = candidates.filter((candidate) => (
      state.records[candidate.claim_ref.id] === undefined
    ));
    const foreign = candidates.filter((candidate) => (
      candidate.namespace !== input.namespace
      && candidate.similarity_score >= input.policy.ambiguity_floor
    ));
    const disagreement = candidates.some((candidate) => (
      !candidate.community_consensus
      && candidate.similarity_score >= input.policy.ambiguity_floor
    ));
    const weak = candidates.filter((candidate) => (
      candidate.namespace === input.namespace
      && candidate.semantic_decision !== 'distinct'
      && candidate.similarity_score >= input.policy.ambiguity_floor
      && candidate.similarity_score < input.policy.equivalence_threshold
    ));
    const qualifying = candidates.filter((candidate) => (
      candidate.namespace === input.namespace
      && candidate.community_consensus
      && candidate.semantic_decision === 'equivalent'
      && candidate.similarity_score >= input.policy.equivalence_threshold
    ));
    if (unknown.length > 0) {
      decision = ClaimMatchDecisions.UNRESOLVED;
      reason = ClaimMatchReasons.UNKNOWN_CANDIDATE;
    } else if (foreign.length > 0) {
      decision = ClaimMatchDecisions.UNRESOLVED;
      reason = ClaimMatchReasons.CROSS_NAMESPACE_COLLISION;
    } else if (disagreement) {
      decision = ClaimMatchDecisions.UNRESOLVED;
      reason = ClaimMatchReasons.COMMUNITY_DISAGREEMENT;
    } else if (qualifying.length > 1) {
      decision = ClaimMatchDecisions.UNRESOLVED;
      reason = ClaimMatchReasons.MULTIPLE_QUALIFYING;
    } else if (weak.length > 0) {
      decision = ClaimMatchDecisions.UNRESOLVED;
      reason = ClaimMatchReasons.WEAK_SIMILARITY;
    } else if (qualifying.length === 1) {
      decision = ClaimMatchDecisions.REUSE;
      reason = ClaimMatchReasons.SEMANTIC_EQUIVALENCE;
      resolvedClaimId = qualifying[0].claim_ref.id;
    } else {
      decision = ClaimMatchDecisions.MINT;
      reason = candidates.length > 0
        ? ClaimMatchReasons.EXPLICITLY_DISTINCT
        : ClaimMatchReasons.NO_CANDIDATE;
    }
  }

  const decisionBody = {
    observation_id: observationId,
    namespace: input.namespace,
    aliases,
    normalized_fingerprint: input.normalizedFingerprint,
    policy_version: input.policy.policy_version,
    policy_digest: policyDigest,
    candidate_set: candidates,
    decision,
    reason,
    resolved_claim_id: resolvedClaimId,
    provenance_digest: input.provenanceDigest,
  };
  return Object.freeze({
    matchRecordId: `claim-match-${continuityDigest(decisionBody)}`,
    aliases,
    candidates,
    decision,
    reason,
    resolvedClaimId,
    policyDigest,
  });
}
