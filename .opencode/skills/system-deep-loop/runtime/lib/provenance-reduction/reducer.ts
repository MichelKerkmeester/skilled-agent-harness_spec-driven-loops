// ───────────────────────────────────────────────────────────────────
// MODULE: Provenance-Balanced Reduction
// ───────────────────────────────────────────────────────────────────

import {
  AdjudicationStatuses,
  digestCandidateContent,
  normalizeCandidateContentForJudging,
} from '../blinded-adjudication/index.js';
import { reducerInputDigest } from '../conditional-fanin/index.js';
import { canonicalJson } from '../event-envelope/index.js';
import { isLeafResultPayload } from '../result-envelopes/index.js';
import {
  PROVENANCE_IDENTITY_VERSION,
  PROVENANCE_LEDGER_VERSION,
  PROVENANCE_REDUCTION_VERSION,
  PROVENANCE_SCHEDULER_VERSION,
} from './types.js';
import {
  canonicalIdentityKey,
  normalizeSourceBucketId,
  stableDigest,
} from './identity.js';

import type { JsonObject, JsonValue } from '../event-envelope/index.js';
import type {
  AdjudicationAudit,
  BlindedMergeRequest,
  CandidateDisposition,
  CandidateProvenance,
  CanonicalReductionItem,
  ConflictVariant,
  ContributorRecord,
  FleetScopeReceipt,
  ProvenanceReductionOutput,
  ProvenanceReductionPolicy,
  ProvenanceReductionReceipt,
  ProvenanceReductionResult,
  RationalWeight,
  ReduceProvenanceInput,
  ReductionCandidate,
  ReductionConflictSet,
  ReductionLedgerEvent,
  ReductionShadowReceipt,
  SourceBucketSchedule,
} from './types.js';

interface CandidateOccurrence {
  readonly baseDigest: string;
  readonly candidate: ReductionCandidate;
  readonly candidateId: string;
  readonly contributor: ContributorRecord;
  readonly exactKey: string;
  readonly payloadDigest: string;
  readonly sourceBucketId: string;
}

interface InvalidOccurrence {
  readonly candidateId: string;
  readonly inputDigest: string;
  readonly reasonCode: string;
}

interface ReductionUnit {
  readonly candidateIds: readonly string[];
  readonly canonicalItemId: string;
  readonly contributors: readonly ContributorRecord[];
  readonly exactKeys: readonly string[];
  readonly payload: JsonValue;
  readonly payloadDigest: string;
  readonly primaryBranchId: string;
  readonly primarySourceBucketId: string;
  readonly rank: number;
  readonly semanticEquivalenceKey: string | null;
  readonly supportBucketIds: readonly string[];
}

interface MutableSchedule {
  readonly cap: number;
  readonly configuredWeight: RationalWeight;
  readonly deferredItemIds: string[];
  readonly eligibleItemIds: string[];
  readonly selectedItemIds: string[];
  readonly sourceBucketId: string;
}

interface ValidatedUpstream {
  readonly envelopes: ReadonlyMap<
  string,
  ReduceProvenanceInput['conditionalInput']['orderedEnvelopes'][number]
  >;
  readonly registrations: ReadonlyMap<string, CandidateProvenance>;
}

const FLEET_STATUSES = new Set([
  'admitted',
  'cancelled',
  'excluded',
  'failed',
  'invalid',
  'timed-out',
]);
const MAX_NORMALIZED_WEIGHT_SHARE = 10_000;
const MAX_POLICY_WEIGHT_TERM = 1_000;
const MAX_REDUCTION_CANDIDATES = 10_000;
const MAX_SOURCE_BUCKETS = 1_000;

function asObject(value: unknown): Record<string, unknown> | null {
  if (value === null || Array.isArray(value) || typeof value !== 'object') return null;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null
    ? value as Record<string, unknown>
    : null;
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new TypeError(`${field} must be a non-empty string`);
  }
  return value;
}

function requireNullableString(value: unknown, field: string): string | null {
  if (value === null) return null;
  return requireString(value, field);
}

function requireNonNegativeInteger(value: unknown, field: string): number {
  if (!Number.isSafeInteger(value) || Number(value) < 0) {
    throw new TypeError(`${field} must be a non-negative safe integer`);
  }
  return Number(value);
}

function jsonObject(value: unknown): JsonObject {
  return JSON.parse(canonicalJson(value)) as JsonObject;
}

function sortedUnique(values: readonly string[]): string[] {
  return [...new Set(values)].sort();
}

function safeInputDigest(value: unknown): string {
  try {
    return stableDigest(value);
  } catch {
    const category = value === null
      ? 'null'
      : Array.isArray(value)
        ? 'array'
        : typeof value;
    return stableDigest({ category, canonicalizable: false });
  }
}

function parseIdentity(value: unknown): ReductionCandidate['identity'] {
  const identity = asObject(value);
  if (!identity) throw new TypeError('identity must be a plain object');
  if (identity.type === 'claim') {
    return Object.freeze({
      namespace: requireString(identity.namespace, 'identity.namespace'),
      stableId: requireString(identity.stableId, 'identity.stableId'),
      type: 'claim' as const,
    });
  }
  if (identity.type === 'repository') {
    return Object.freeze({
      repositoryName: requireNullableString(identity.repositoryName, 'identity.repositoryName'),
      type: 'repository' as const,
      url: requireNullableString(identity.url, 'identity.url'),
    });
  }
  throw new TypeError('identity.type is unsupported');
}

function parseProvenance(value: unknown): CandidateProvenance {
  const provenance = asObject(value);
  if (!provenance) throw new TypeError('provenance must be a plain object');
  return Object.freeze({
    dispatchReceiptId: requireString(provenance.dispatchReceiptId, 'provenance.dispatchReceiptId'),
    executorKind: requireString(provenance.executorKind, 'provenance.executorKind'),
    invocationFingerprint: requireString(
      provenance.invocationFingerprint,
      'provenance.invocationFingerprint',
    ),
    leafId: requireString(provenance.leafId, 'provenance.leafId'),
    logicalBranchId: requireString(provenance.logicalBranchId, 'provenance.logicalBranchId'),
    modelFamily: requireString(provenance.modelFamily, 'provenance.modelFamily'),
    modelId: requireString(provenance.modelId, 'provenance.modelId'),
    parentBranchId: requireNullableString(provenance.parentBranchId, 'provenance.parentBranchId'),
    providerId: requireString(provenance.providerId, 'provenance.providerId'),
    resultDigest: requireString(provenance.resultDigest, 'provenance.resultDigest'),
    resultEnvelopeId: requireString(provenance.resultEnvelopeId, 'provenance.resultEnvelopeId'),
  });
}

function parseCandidate(value: unknown): ReductionCandidate {
  const candidate = asObject(value);
  if (!candidate) throw new TypeError('candidate must be a plain object');
  const payload = JSON.parse(canonicalJson(candidate.payload)) as JsonValue;
  return Object.freeze({
    identity: parseIdentity(candidate.identity),
    judgeContent: requireNullableString(candidate.judgeContent, 'judgeContent'),
    payload,
    provenance: parseProvenance(candidate.provenance),
    rank: requireNonNegativeInteger(candidate.rank, 'rank'),
    semanticEquivalenceKey: requireNullableString(
      candidate.semanticEquivalenceKey,
      'semanticEquivalenceKey',
    ),
  });
}

function validatePolicy(policy: ProvenanceReductionPolicy): Map<string, RationalWeight> {
  if (
    policy.reducerVersion !== PROVENANCE_REDUCTION_VERSION
    || policy.identityVersion !== PROVENANCE_IDENTITY_VERSION
    || policy.schedulerVersion !== PROVENANCE_SCHEDULER_VERSION
    || !Number.isSafeInteger(policy.policyVersion)
    || policy.policyVersion <= 0
    || policy.policyId.trim().length === 0
    || !Number.isSafeInteger(policy.outputCapacity)
    || policy.outputCapacity <= 0
    || !Number.isSafeInteger(policy.perSourceContributionCap)
    || policy.perSourceContributionCap <= 0
  ) {
    throw new TypeError('Unsupported or invalid provenance reduction policy');
  }
  for (const value of [
    policy.adjudicationPolicyVersion,
    policy.adjudicationReferenceDigest,
    policy.adjudicationRubricDigest,
  ]) {
    if (value.trim().length === 0) throw new TypeError('Adjudication policy fields are required');
  }
  const weights = new Map<string, RationalWeight>();
  for (const weight of policy.weights) {
    if (
      !Number.isSafeInteger(weight.numerator)
      || !Number.isSafeInteger(weight.denominator)
      || weight.numerator <= 0
      || weight.denominator <= 0
      || weight.numerator > MAX_POLICY_WEIGHT_TERM
      || weight.denominator > MAX_POLICY_WEIGHT_TERM
      || weight.sourceBucketId.trim().length === 0
      || weights.has(weight.sourceBucketId)
    ) {
      throw new TypeError('Policy weights must be unique bounded positive rationals');
    }
    weights.set(weight.sourceBucketId, Object.freeze({ ...weight }));
  }
  if (weights.size === 0) throw new TypeError('At least one source weight is required');
  return weights;
}

function canonicalPolicy(policy: ProvenanceReductionPolicy): ProvenanceReductionPolicy {
  return Object.freeze({
    ...policy,
    weights: Object.freeze([...policy.weights]
      .map((weight) => Object.freeze({ ...weight }))
      .sort((left, right) => left.sourceBucketId.localeCompare(right.sourceBucketId))),
  });
}

function canonicalSourceRegistrations(input: ReduceProvenanceInput): CandidateProvenance[] {
  return [...input.sourceRegistrations]
    .map((registration) => parseProvenance(registration))
    .sort((left, right) => left.resultEnvelopeId.localeCompare(right.resultEnvelopeId));
}

function validateUpstream(
  input: ReduceProvenanceInput,
): ValidatedUpstream {
  const receipt = input.partialFailure.policyEvaluationReceipt;
  if (
    receipt.finality !== 'final'
    || (receipt.verdict !== 'proceed' && receipt.verdict !== 'proceed_degraded')
  ) {
    throw new TypeError('Partial-failure handoff is not a final reduction request');
  }

  const conditional = input.conditionalInput.orderedEnvelopes;
  const partial = input.partialFailure.successfulEnvelopes;
  const conditionalPairs = conditional.map((envelope) => (
    `${envelope.result_envelope_id}:${envelope.result_digest}`
  ));
  const partialPairs = partial.map((envelope) => (
    `${envelope.result_envelope_id}:${envelope.result_digest}`
  ));
  if (
    new Set(conditionalPairs).size !== conditionalPairs.length
    || [...conditionalPairs].sort().join('|') !== [...partialPairs].sort().join('|')
  ) {
    throw new TypeError('Conditional and partial-failure successful envelope sets differ');
  }
  const reconstructedDigest = reducerInputDigest(conditional.map((envelope) => Object.freeze({
    resultDigest: envelope.result_digest,
    resultEnvelopeId: envelope.result_envelope_id,
  })));
  if (reconstructedDigest !== input.conditionalInput.reducerInputDigest) {
    throw new TypeError('Conditional reducer input digest is invalid');
  }
  if (
    [...receipt.successful_result_envelope_ids].sort().join('|')
    !== conditional.map((envelope) => envelope.result_envelope_id).sort().join('|')
  ) {
    throw new TypeError('Partial-failure receipt does not bind the conditional reducer inputs');
  }

  const envelopes = new Map<string, typeof conditional[number]>();
  for (const envelope of conditional) {
    if (!isLeafResultPayload(envelope) || envelope.result_status !== 'succeeded') {
      throw new TypeError('Provenance reduction accepts only successful result envelopes');
    }
    envelopes.set(envelope.result_envelope_id, envelope);
  }
  if (input.sourceRegistrations.length !== envelopes.size) {
    throw new TypeError('Source registration count must equal the successful envelope count');
  }
  const registrations = new Map<string, CandidateProvenance>();
  for (const rawRegistration of input.sourceRegistrations) {
    const registration = parseProvenance(rawRegistration);
    const envelope = envelopes.get(registration.resultEnvelopeId);
    if (!envelope || registrations.has(registration.resultEnvelopeId)) {
      throw new TypeError('Source registrations must bind each successful envelope exactly once');
    }
    if (
      envelope.result_digest !== registration.resultDigest
      || envelope.invocation_fingerprint !== registration.invocationFingerprint
      || envelope.logical_branch_id !== registration.logicalBranchId
      || envelope.leaf_id !== registration.leafId
      || envelope.dispatch_receipt_id !== registration.dispatchReceiptId
    ) {
      throw new TypeError('Source registration differs from its successful envelope');
    }
    registrations.set(registration.resultEnvelopeId, registration);
  }
  return Object.freeze({ envelopes, registrations });
}

function fleetScope(input: ReduceProvenanceInput): {
  readonly admittedBuckets: ReadonlySet<string>;
  readonly receipt: FleetScopeReceipt;
} {
  if (input.fleet.length === 0 || input.fleet.length > MAX_SOURCE_BUCKETS) {
    throw new TypeError('Fleet manifest must contain a bounded non-empty source set');
  }
  const statuses = new Map<string, string>();
  for (const entry of input.fleet) {
    if (!FLEET_STATUSES.has(entry.status)) throw new TypeError('Fleet status is unsupported');
    if (entry.reasonCode !== null && entry.reasonCode.trim().length === 0) {
      throw new TypeError('Fleet reason code cannot be empty');
    }
    const bucketId = normalizeSourceBucketId(entry.modelFamily);
    const previous = statuses.get(bucketId);
    if (previous !== undefined && previous !== entry.status) {
      throw new TypeError('A source bucket cannot have conflicting fleet states');
    }
    statuses.set(bucketId, entry.status);
  }
  const byStatus = (status: string): string[] => [...statuses]
    .filter(([, value]) => value === status)
    .map(([bucketId]) => bucketId)
    .sort();
  const partialReceipt = input.partialFailure.policyEvaluationReceipt;
  const isPartial = [...statuses.values()].some((status) => status !== 'admitted')
    || input.partialFailure.degradedMarker !== null
    || partialReceipt.failed > 0
    || partialReceipt.pending > 0
    || partialReceipt.not_awaited > 0
    || partialReceipt.verdict === 'proceed_degraded';
  const admitted = byStatus('admitted');
  return Object.freeze({
    admittedBuckets: new Set(admitted),
    receipt: Object.freeze({
      admitted: Object.freeze(admitted),
      cancelled: Object.freeze(byStatus('cancelled')),
      consensusScope: isPartial ? 'partial-fleet' : 'full-fleet',
      excluded: Object.freeze(byStatus('excluded')),
      expected: Object.freeze([...statuses.keys()].sort()),
      failed: Object.freeze(byStatus('failed')),
      invalid: Object.freeze(byStatus('invalid')),
      timedOut: Object.freeze(byStatus('timed-out')),
    }),
  });
}

function contributorRecord(
  candidate: ReductionCandidate,
  payloadDigest: string,
  envelope: ReduceProvenanceInput['conditionalInput']['orderedEnvelopes'][number],
): ContributorRecord {
  const { provenance } = candidate;
  const sourceBucketId = normalizeSourceBucketId(provenance.modelFamily);
  const evidenceLocators = [...envelope.evidence, ...envelope.artifacts]
    .concat(envelope.parsed_result_reference === null ? [] : [envelope.parsed_result_reference])
    .map((reference) => `${reference.kind}:${reference.reference}:${reference.digest}`)
    .sort();
  const facts = {
    dispatchReceiptId: provenance.dispatchReceiptId,
    executorKind: provenance.executorKind,
    evidenceLocators: Object.freeze(evidenceLocators),
    invocationFingerprint: provenance.invocationFingerprint,
    leafId: provenance.leafId,
    logicalBranchId: provenance.logicalBranchId,
    modelFamily: provenance.modelFamily,
    modelId: provenance.modelId,
    parentBranchId: provenance.parentBranchId,
    providerId: provenance.providerId,
    resultDigest: provenance.resultDigest,
    resultEnvelopeId: provenance.resultEnvelopeId,
    sourceBucketId,
    sourceLocalPayloadDigest: payloadDigest,
    sourceRank: candidate.rank,
    successfulDisposition: 'admitted-success' as const,
  };
  return Object.freeze({
    contributorId: `contributor-${stableDigest(facts)}`,
    ...facts,
  });
}

function bindCandidate(
  candidate: ReductionCandidate,
  envelopes: ReadonlyMap<string, ReduceProvenanceInput['conditionalInput']['orderedEnvelopes'][number]>,
  registrations: ReadonlyMap<string, CandidateProvenance>,
  admittedBuckets: ReadonlySet<string>,
  policyWeights: ReadonlyMap<string, RationalWeight>,
): Omit<CandidateOccurrence, 'candidateId'> {
  const envelope = envelopes.get(candidate.provenance.resultEnvelopeId);
  if (!envelope) throw new TypeError('candidate-envelope-not-admitted');
  const registration = registrations.get(candidate.provenance.resultEnvelopeId);
  if (!registration || stableDigest(registration) !== stableDigest(candidate.provenance)) {
    throw new TypeError('candidate-provenance-registration-mismatch');
  }
  if (
    envelope.result_digest !== candidate.provenance.resultDigest
    || envelope.invocation_fingerprint !== candidate.provenance.invocationFingerprint
    || envelope.logical_branch_id !== candidate.provenance.logicalBranchId
    || envelope.leaf_id !== candidate.provenance.leafId
    || envelope.dispatch_receipt_id !== candidate.provenance.dispatchReceiptId
  ) {
    throw new TypeError('candidate-provenance-envelope-mismatch');
  }
  const sourceBucketId = normalizeSourceBucketId(candidate.provenance.modelFamily);
  if (!admittedBuckets.has(sourceBucketId)) throw new TypeError('candidate-source-not-admitted');
  if (!policyWeights.has(sourceBucketId)) throw new TypeError('candidate-source-weight-missing');
  const exactKey = canonicalIdentityKey(candidate.identity);
  const payloadDigest = stableDigest(candidate.payload);
  const contributor = contributorRecord(candidate, payloadDigest, envelope);
  const baseDigest = stableDigest({
    contributorId: contributor.contributorId,
    exactKey,
    judgeContent: candidate.judgeContent,
    payloadDigest,
    rank: candidate.rank,
    semanticEquivalenceKey: candidate.semanticEquivalenceKey,
  });
  return Object.freeze({
    baseDigest,
    candidate,
    contributor,
    exactKey,
    payloadDigest,
    sourceBucketId,
  });
}

function parseOccurrences(
  input: ReduceProvenanceInput,
  envelopes: ReadonlyMap<string, ReduceProvenanceInput['conditionalInput']['orderedEnvelopes'][number]>,
  registrations: ReadonlyMap<string, CandidateProvenance>,
  admittedBuckets: ReadonlySet<string>,
  policyWeights: ReadonlyMap<string, RationalWeight>,
): { readonly invalid: readonly InvalidOccurrence[]; readonly valid: readonly CandidateOccurrence[] } {
  if (input.candidates.length > MAX_REDUCTION_CANDIDATES) {
    throw new TypeError('Candidate set exceeds the provenance reduction limit');
  }
  const parsed: Array<Omit<CandidateOccurrence, 'candidateId'>> = [];
  const invalidBase: Array<{ readonly inputDigest: string; readonly reasonCode: string }> = [];
  for (const raw of input.candidates) {
    const inputDigest = safeInputDigest(raw);
    try {
      const candidate = parseCandidate(raw);
      parsed.push(bindCandidate(
        candidate,
        envelopes,
        registrations,
        admittedBuckets,
        policyWeights,
      ));
    } catch (error) {
      invalidBase.push(Object.freeze({
        inputDigest,
        reasonCode: error instanceof TypeError
          ? error.message.toLocaleLowerCase('en-US').replace(/[^a-z0-9]+/gu, '-').replace(/^-|-$/gu, '')
          : 'invalid-candidate',
      }));
    }
  }

  const occurrenceIndex = new Map<string, number>();
  const valid = [...parsed]
    .sort((left, right) => left.baseDigest.localeCompare(right.baseDigest))
    .map((entry) => {
      const ordinal = occurrenceIndex.get(entry.baseDigest) ?? 0;
      occurrenceIndex.set(entry.baseDigest, ordinal + 1);
      return Object.freeze({
        ...entry,
        candidateId: `candidate-${entry.baseDigest}-${ordinal}`,
      });
    });
  const invalidIndex = new Map<string, number>();
  const invalid = invalidBase
    .sort((left, right) => {
      const digestOrder = left.inputDigest.localeCompare(right.inputDigest);
      return digestOrder !== 0 ? digestOrder : left.reasonCode.localeCompare(right.reasonCode);
    })
    .map((entry) => {
      const key = `${entry.inputDigest}:${entry.reasonCode}`;
      const ordinal = invalidIndex.get(key) ?? 0;
      invalidIndex.set(key, ordinal + 1);
      return Object.freeze({
        ...entry,
        candidateId: `invalid-${stableDigest(entry)}-${ordinal}`,
      });
    });
  return Object.freeze({ invalid: Object.freeze(invalid), valid: Object.freeze(valid) });
}

function uniqueContributors(occurrences: readonly CandidateOccurrence[]): ContributorRecord[] {
  const contributors = new Map<string, ContributorRecord>();
  for (const occurrence of occurrences) {
    contributors.set(occurrence.contributor.contributorId, occurrence.contributor);
  }
  return [...contributors.values()].sort((left, right) => (
    left.contributorId.localeCompare(right.contributorId)
  ));
}

function makeUnit(occurrences: readonly CandidateOccurrence[]): ReductionUnit {
  const first = occurrences[0];
  const contributors = uniqueContributors(occurrences);
  const supportBucketIds = sortedUnique(contributors.map((entry) => entry.sourceBucketId));
  const primarySourceBucketId = supportBucketIds[0];
  const primaryBranchId = contributors
    .filter((entry) => entry.sourceBucketId === primarySourceBucketId)
    .map((entry) => entry.logicalBranchId)
    .sort()[0];
  const exactKeys = sortedUnique(occurrences.map((entry) => entry.exactKey));
  const payloadDigest = first.payloadDigest;
  return Object.freeze({
    candidateIds: Object.freeze(occurrences.map((entry) => entry.candidateId).sort()),
    canonicalItemId: `item-${stableDigest({ exactKeys, payloadDigest })}`,
    contributors: Object.freeze(contributors),
    exactKeys: Object.freeze(exactKeys),
    payload: first.candidate.payload,
    payloadDigest,
    primaryBranchId,
    primarySourceBucketId,
    rank: Math.min(...occurrences.map((entry) => entry.candidate.rank)),
    semanticEquivalenceKey: (() => {
      const semanticKeys = sortedUnique(occurrences.flatMap((entry) => (
        entry.candidate.semanticEquivalenceKey === null
          ? []
          : [entry.candidate.semanticEquivalenceKey]
      )));
      return semanticKeys.length === 1 ? semanticKeys[0] : null;
    })(),
    supportBucketIds: Object.freeze(supportBucketIds),
  });
}

function exactReduction(occurrences: readonly CandidateOccurrence[]): {
  readonly conflicts: readonly ReductionConflictSet[];
  readonly dispositions: readonly CandidateDisposition[];
  readonly units: readonly ReductionUnit[];
} {
  const byKey = new Map<string, CandidateOccurrence[]>();
  for (const occurrence of occurrences) {
    const group = byKey.get(occurrence.exactKey) ?? [];
    group.push(occurrence);
    byKey.set(occurrence.exactKey, group);
  }
  const conflicts: ReductionConflictSet[] = [];
  const dispositions: CandidateDisposition[] = [];
  const units: ReductionUnit[] = [];
  for (const exactKey of [...byKey.keys()].sort()) {
    const group = byKey.get(exactKey) ?? [];
    const byPayload = new Map<string, CandidateOccurrence[]>();
    for (const occurrence of group) {
      const payloadGroup = byPayload.get(occurrence.payloadDigest) ?? [];
      payloadGroup.push(occurrence);
      byPayload.set(occurrence.payloadDigest, payloadGroup);
    }
    if (byPayload.size > 1) {
      const variants: ConflictVariant[] = [...byPayload.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([payloadDigest, entries]) => {
          const contributors = uniqueContributors(entries);
          return Object.freeze({
            contributorIds: Object.freeze(contributors.map((entry) => entry.contributorId)),
            contributors: Object.freeze(contributors),
            payload: entries[0].candidate.payload,
            payloadDigest,
          });
        });
      const conflictId = `conflict-${stableDigest({ exactKey, variants })}`;
      conflicts.push(Object.freeze({ conflictId, exactKey, variants: Object.freeze(variants) }));
      for (const occurrence of group) {
        dispositions.push(Object.freeze({
          candidateId: occurrence.candidateId,
          kind: 'conflicted',
          reasonCode: 'contradictory-payload-under-exact-key',
          targetId: conflictId,
        }));
      }
      continue;
    }
    units.push(makeUnit(group));
  }
  return Object.freeze({
    conflicts: Object.freeze(conflicts),
    dispositions: Object.freeze(dispositions),
    units: Object.freeze(units),
  });
}

function mergeUnits(units: readonly ReductionUnit[], preferred: ReductionUnit): ReductionUnit {
  const contributors = new Map<string, ContributorRecord>();
  for (const unit of units) {
    for (const contributor of unit.contributors) contributors.set(contributor.contributorId, contributor);
  }
  const orderedContributors = [...contributors.values()].sort((left, right) => (
    left.contributorId.localeCompare(right.contributorId)
  ));
  const supportBucketIds = sortedUnique(orderedContributors.map((entry) => entry.sourceBucketId));
  const primarySourceBucketId = supportBucketIds[0];
  const primaryBranchId = orderedContributors
    .filter((entry) => entry.sourceBucketId === primarySourceBucketId)
    .map((entry) => entry.logicalBranchId)
    .sort()[0];
  const exactKeys = sortedUnique(units.flatMap((unit) => unit.exactKeys));
  return Object.freeze({
    candidateIds: Object.freeze(sortedUnique(units.flatMap((unit) => unit.candidateIds))),
    canonicalItemId: `item-${stableDigest({ exactKeys, payloadDigest: preferred.payloadDigest })}`,
    contributors: Object.freeze(orderedContributors),
    exactKeys: Object.freeze(exactKeys),
    payload: preferred.payload,
    payloadDigest: preferred.payloadDigest,
    primaryBranchId,
    primarySourceBucketId,
    rank: Math.min(...units.map((unit) => unit.rank)),
    semanticEquivalenceKey: preferred.semanticEquivalenceKey,
    supportBucketIds: Object.freeze(supportBucketIds),
  });
}

async function adjudicateSemanticGroups(
  input: ReduceProvenanceInput,
  occurrences: readonly CandidateOccurrence[],
  initialUnits: readonly ReductionUnit[],
): Promise<{
  readonly adjudications: readonly AdjudicationAudit[];
  readonly mergedCandidateIds: ReadonlySet<string>;
  readonly units: readonly ReductionUnit[];
}> {
  const occurrenceById = new Map(occurrences.map((entry) => [entry.candidateId, entry]));
  const bySemantic = new Map<string, ReductionUnit[]>();
  const untouched: ReductionUnit[] = [];
  for (const unit of initialUnits) {
    if (unit.semanticEquivalenceKey === null) {
      untouched.push(unit);
    } else {
      const group = bySemantic.get(unit.semanticEquivalenceKey) ?? [];
      group.push(unit);
      bySemantic.set(unit.semanticEquivalenceKey, group);
    }
  }

  const adjudications: AdjudicationAudit[] = [];
  const mergedCandidateIds = new Set<string>();
  const reduced = [...untouched];
  for (const semanticKey of [...bySemantic.keys()].sort()) {
    const units = (bySemantic.get(semanticKey) ?? [])
      .sort((left, right) => left.canonicalItemId.localeCompare(right.canonicalItemId));
    if (units.length < 2) {
      reduced.push(...units);
      continue;
    }
    const candidateRows: Array<{ digest: string; content: string; unit: ReductionUnit }> = [];
    let failClosedReason = 'adjudicator-missing-or-inconclusive';
    try {
      for (const unit of units) {
        const contents = sortedUnique(unit.candidateIds.map((candidateId) => {
          const content = occurrenceById.get(candidateId)?.candidate.judgeContent;
          if (content === null || content === undefined) {
            throw new TypeError('judge-content-missing');
          }
          return normalizeCandidateContentForJudging(content);
        }));
        if (contents.length !== 1) throw new TypeError('judge-content-conflict');
        candidateRows.push({
          content: contents[0],
          digest: digestCandidateContent(contents[0]),
          unit,
        });
      }
      if (new Set(candidateRows.map((entry) => entry.digest)).size !== candidateRows.length) {
        throw new TypeError('judge-content-digest-collision');
      }
      candidateRows.sort((left, right) => left.digest.localeCompare(right.digest));
      const replayFingerprint = stableDigest({
        candidateDigests: candidateRows.map((entry) => entry.digest),
        policyVersion: input.policy.adjudicationPolicyVersion,
        referenceDigest: input.policy.adjudicationReferenceDigest,
        rubricDigest: input.policy.adjudicationRubricDigest,
        semanticKey,
      });
      const request: BlindedMergeRequest = Object.freeze({
        candidates: Object.freeze(candidateRows.map((entry) => Object.freeze({
          candidateDigest: entry.digest,
          content: entry.content,
        }))),
        policyVersion: input.policy.adjudicationPolicyVersion,
        referenceDigest: input.policy.adjudicationReferenceDigest,
        replayFingerprint,
        rubricDigest: input.policy.adjudicationRubricDigest,
      });
      const verdict = input.adjudicator ? await input.adjudicator.adjudicate(request) : null;
      const stable = verdict !== null
        && verdict.status === AdjudicationStatuses.STABLE
        && verdict.preferredCandidateDigest !== null
        && candidateRows.some((entry) => entry.digest === verdict.preferredCandidateDigest)
        && verdict.replayFingerprint === replayFingerprint
        && verdict.counterfactualEvidenceIds.length > 0
        && verdict.legacyAuthority === 'canonical'
        && verdict.serviceAuthority === 'shadow-only';
      if (!stable || verdict === null || verdict.preferredCandidateDigest === null) {
        failClosedReason = 'unstable-inconclusive-or-unbound-verdict';
        throw new TypeError(failClosedReason);
      }
      const preferred = candidateRows.find((entry) => (
        entry.digest === verdict.preferredCandidateDigest
      ));
      if (!preferred) throw new TypeError('preferred-candidate-missing');
      const merged = mergeUnits(units, preferred.unit);
      reduced.push(merged);
      for (const unit of units) {
        if (unit.canonicalItemId !== preferred.unit.canonicalItemId) {
          unit.candidateIds.forEach((candidateId) => mergedCandidateIds.add(candidateId));
        }
      }
      adjudications.push(Object.freeze({
        adjudicationId: verdict.adjudicationId,
        candidateBindings: Object.freeze(candidateRows.map((entry) => Object.freeze({
          candidateDigest: entry.digest,
          canonicalItemId: entry.unit.canonicalItemId,
        }))),
        candidateDigests: Object.freeze(candidateRows.map((entry) => entry.digest)),
        counterfactualEvidenceIds: Object.freeze([...verdict.counterfactualEvidenceIds].sort()),
        preferredCandidateDigest: verdict.preferredCandidateDigest,
        replayFingerprint,
        semanticEquivalenceKey: semanticKey,
        status: 'stable',
        verdictEvidenceId: verdict.verdictEvidenceId,
      }));
    } catch {
      reduced.push(...units);
      const candidateDigests = candidateRows.map((entry) => entry.digest).sort();
      adjudications.push(Object.freeze({
        adjudicationId: null,
        candidateBindings: Object.freeze(candidateRows.map((entry) => Object.freeze({
          candidateDigest: entry.digest,
          canonicalItemId: entry.unit.canonicalItemId,
        })).sort((left, right) => left.candidateDigest.localeCompare(right.candidateDigest))),
        candidateDigests: Object.freeze(candidateDigests),
        counterfactualEvidenceIds: Object.freeze([]),
        preferredCandidateDigest: null,
        replayFingerprint: stableDigest({ candidateDigests, failClosedReason, semanticKey }),
        semanticEquivalenceKey: semanticKey,
        status: 'failed-closed',
        verdictEvidenceId: null,
      }));
    }
  }
  return Object.freeze({
    adjudications: Object.freeze(adjudications),
    mergedCandidateIds,
    units: Object.freeze(reduced.sort((left, right) => (
      left.canonicalItemId.localeCompare(right.canonicalItemId)
    ))),
  });
}

function gcd(left: bigint, right: bigint): bigint {
  let a = left;
  let b = right;
  while (b !== 0n) {
    const next = a % b;
    a = b;
    b = next;
  }
  return a;
}

function normalizedShares(weights: readonly RationalWeight[]): ReadonlyMap<string, number> {
  if (weights.length === 0) return new Map();
  let commonDenominator = 1n;
  for (const weight of weights) {
    const denominator = BigInt(weight.denominator);
    commonDenominator = (commonDenominator * denominator) / gcd(commonDenominator, denominator);
  }
  const raw = weights.map((weight) => ({
    sourceBucketId: weight.sourceBucketId,
    value: BigInt(weight.numerator) * (commonDenominator / BigInt(weight.denominator)),
  }));
  const divisor = raw.reduce((current, entry) => gcd(current, entry.value), raw[0].value);
  const shares = new Map<string, number>();
  for (const entry of raw) {
    const share = Number(entry.value / divisor);
    if (!Number.isSafeInteger(share) || share <= 0 || share > MAX_NORMALIZED_WEIGHT_SHARE) {
      throw new TypeError('Policy weights cannot be normalized safely');
    }
    shares.set(entry.sourceBucketId, share);
  }
  return shares;
}

function branchQueues(units: readonly ReductionUnit[]): Map<string, ReductionUnit[]> {
  const queues = new Map<string, ReductionUnit[]>();
  for (const unit of units) {
    const queue = queues.get(unit.primaryBranchId) ?? [];
    queue.push(unit);
    queues.set(unit.primaryBranchId, queue);
  }
  for (const queue of queues.values()) {
    queue.sort((left, right) => {
      const rankOrder = left.rank - right.rank;
      return rankOrder !== 0
        ? rankOrder
        : left.canonicalItemId.localeCompare(right.canonicalItemId);
    });
  }
  return queues;
}

function nextFromBranches(
  queues: Map<string, ReductionUnit[]>,
  cursor: { value: number },
): ReductionUnit | null {
  const branchIds = [...queues.keys()].sort();
  if (branchIds.length === 0) return null;
  const minimumSupport = Math.min(...branchIds.map((branchId) => (
    queues.get(branchId)?.[0]?.supportBucketIds.length ?? Number.POSITIVE_INFINITY
  )));
  for (let offset = 0; offset < branchIds.length; offset += 1) {
    const index = (cursor.value + offset) % branchIds.length;
    const branchId = branchIds[index];
    const queue = queues.get(branchId) ?? [];
    if ((queue[0]?.supportBucketIds.length ?? Number.POSITIVE_INFINITY) !== minimumSupport) continue;
    const next = queue.shift();
    if (next) {
      cursor.value = (index + 1) % branchIds.length;
      return next;
    }
  }
  return null;
}

function scheduleUnits(
  units: readonly ReductionUnit[],
  policy: ProvenanceReductionPolicy,
  weights: ReadonlyMap<string, RationalWeight>,
): {
  readonly excluded: ReadonlyMap<string, 'capacity-excluded' | 'quota-deferred'>;
  readonly schedules: readonly SourceBucketSchedule[];
  readonly selected: readonly ReductionUnit[];
} {
  const byBucket = new Map<string, ReductionUnit[]>();
  for (const unit of units) {
    const entries = byBucket.get(unit.primarySourceBucketId) ?? [];
    entries.push(unit);
    byBucket.set(unit.primarySourceBucketId, entries);
  }
  const bucketIds = [...byBucket.keys()].sort();
  const configured = bucketIds.map((bucketId) => {
    const weight = weights.get(bucketId);
    if (!weight) throw new TypeError('Eligible bucket lacks a versioned policy weight');
    return weight;
  });
  const shares = normalizedShares(configured);
  const queues = new Map(bucketIds.map((bucketId) => [bucketId, branchQueues(byBucket.get(bucketId) ?? [])]));
  const cursors = new Map(bucketIds.map((bucketId) => [bucketId, { value: 0 }]));
  const mutableSchedules = new Map<string, MutableSchedule>();
  for (const bucketId of bucketIds) {
    const weight = weights.get(bucketId);
    if (!weight) throw new TypeError('Eligible bucket lacks a configured weight');
    mutableSchedules.set(bucketId, {
      cap: policy.perSourceContributionCap,
      configuredWeight: weight,
      deferredItemIds: [],
      eligibleItemIds: (byBucket.get(bucketId) ?? []).map((unit) => unit.canonicalItemId).sort(),
      selectedItemIds: [],
      sourceBucketId: bucketId,
    });
  }

  const selected: ReductionUnit[] = [];
  const hasQueued = (bucketId: string): boolean => [...(queues.get(bucketId)?.values() ?? [])]
    .some((queue) => queue.length > 0);
  const take = (bucketId: string): boolean => {
    if (selected.length >= policy.outputCapacity) return false;
    const schedule = mutableSchedules.get(bucketId);
    const queue = queues.get(bucketId);
    const cursor = cursors.get(bucketId);
    if (!schedule || !queue || !cursor || schedule.selectedItemIds.length >= schedule.cap) return false;
    const unit = nextFromBranches(queue, cursor);
    if (!unit) return false;
    selected.push(unit);
    schedule.selectedItemIds.push(unit.canonicalItemId);
    return true;
  };

  while (selected.length < policy.outputCapacity) {
    const eligible = bucketIds.filter((bucketId) => {
      const schedule = mutableSchedules.get(bucketId);
      return schedule !== undefined
        && schedule.selectedItemIds.length < schedule.cap
        && hasQueued(bucketId);
    });
    if (eligible.length === 0) break;
    let progressed = false;
    for (const bucketId of eligible) {
      if (take(bucketId)) progressed = true;
      if (selected.length >= policy.outputCapacity) break;
    }
    if (selected.length >= policy.outputCapacity) break;
    const maximumShare = Math.max(...eligible.map((bucketId) => shares.get(bucketId) ?? 1));
    for (let round = 2; round <= maximumShare; round += 1) {
      for (const bucketId of eligible) {
        if ((shares.get(bucketId) ?? 1) >= round && take(bucketId)) progressed = true;
        if (selected.length >= policy.outputCapacity) break;
      }
      if (selected.length >= policy.outputCapacity) break;
    }
    if (!progressed) break;
  }

  const excluded = new Map<string, 'capacity-excluded' | 'quota-deferred'>();
  for (const bucketId of bucketIds) {
    const schedule = mutableSchedules.get(bucketId);
    const remaining = [...(queues.get(bucketId)?.values() ?? [])]
      .flat()
      .sort((left, right) => left.canonicalItemId.localeCompare(right.canonicalItemId));
    if (!schedule) continue;
    const reason = schedule.selectedItemIds.length >= schedule.cap
      ? 'quota-deferred'
      : 'capacity-excluded';
    for (const unit of remaining) {
      excluded.set(unit.canonicalItemId, reason);
      schedule.deferredItemIds.push(unit.canonicalItemId);
    }
    schedule.deferredItemIds.sort();
  }

  const schedules: SourceBucketSchedule[] = [...mutableSchedules.values()]
    .sort((left, right) => left.sourceBucketId.localeCompare(right.sourceBucketId))
    .map((schedule) => Object.freeze({
      ...schedule,
      configuredWeight: Object.freeze({ ...schedule.configuredWeight }),
      deferredItemIds: Object.freeze([...schedule.deferredItemIds]),
      eligibleItemIds: Object.freeze([...schedule.eligibleItemIds]),
      selectedItemIds: Object.freeze([...schedule.selectedItemIds]),
    }));
  return Object.freeze({
    excluded,
    schedules: Object.freeze(schedules),
    selected: Object.freeze(selected),
  });
}

function buildDispositions(
  invalid: readonly InvalidOccurrence[],
  exact: ReturnType<typeof exactReduction>,
  semantic: Awaited<ReturnType<typeof adjudicateSemanticGroups>>,
  schedule: ReturnType<typeof scheduleUnits>,
): CandidateDisposition[] {
  const dispositions = [...exact.dispositions];
  for (const entry of invalid) {
    dispositions.push(Object.freeze({
      candidateId: entry.candidateId,
      kind: 'invalid',
      reasonCode: entry.reasonCode,
      targetId: null,
    }));
  }
  for (const unit of semantic.units) {
    const selected = schedule.selected.some((entry) => entry.canonicalItemId === unit.canonicalItemId);
    const excluded = schedule.excluded.get(unit.canonicalItemId);
    const orderedIds = [...unit.candidateIds].sort();
    for (let index = 0; index < orderedIds.length; index += 1) {
      const candidateId = orderedIds[index];
      if (semantic.mergedCandidateIds.has(candidateId)) {
        dispositions.push(Object.freeze({
          candidateId,
          kind: 'adjudicated-merged',
          reasonCode: 'stable-blinded-verdict',
          targetId: unit.canonicalItemId,
        }));
      } else if (selected && index === 0) {
        dispositions.push(Object.freeze({
          candidateId,
          kind: 'selected',
          reasonCode: 'weighted-fair-schedule',
          targetId: unit.canonicalItemId,
        }));
      } else if (selected) {
        dispositions.push(Object.freeze({
          candidateId,
          kind: 'duplicate-merged',
          reasonCode: 'same-key-compatible-payload',
          targetId: unit.canonicalItemId,
        }));
      } else {
        dispositions.push(Object.freeze({
          candidateId,
          kind: excluded ?? 'capacity-excluded',
          reasonCode: excluded === 'quota-deferred'
            ? 'source-contribution-cap-exhausted'
            : 'global-output-capacity-exhausted',
          targetId: unit.canonicalItemId,
        }));
      }
    }
  }
  return dispositions.sort((left, right) => left.candidateId.localeCompare(right.candidateId));
}

function outputItems(selected: readonly ReductionUnit[]): CanonicalReductionItem[] {
  return selected.map((unit, outputPosition) => Object.freeze({
    canonicalItemId: unit.canonicalItemId,
    contributorIds: Object.freeze(unit.contributors.map((entry) => entry.contributorId)),
    contributors: unit.contributors,
    effectiveSourceCount: unit.supportBucketIds.length,
    exactKeys: unit.exactKeys,
    outputPosition,
    payload: unit.payload,
    payloadDigest: unit.payloadDigest,
    primarySourceBucketId: unit.primarySourceBucketId,
    supportBucketIds: unit.supportBucketIds,
  }));
}

function ledgerEvent(eventType: string, payload: unknown): Omit<ReductionLedgerEvent, 'sequence'> {
  const frozenPayload = Object.freeze(jsonObject(payload));
  const eventDigest = stableDigest({
    eventType,
    eventVersion: PROVENANCE_LEDGER_VERSION,
    payload: frozenPayload,
  });
  return Object.freeze({
    eventDigest,
    eventId: `reduction-event-${eventDigest}`,
    eventType,
    eventVersion: PROVENANCE_LEDGER_VERSION,
    payload: frozenPayload,
  });
}

function buildLedger(
  occurrences: readonly CandidateOccurrence[],
  invalid: readonly InvalidOccurrence[],
  dedupUnits: readonly ReductionUnit[],
  conflicts: readonly ReductionConflictSet[],
  adjudications: readonly AdjudicationAudit[],
  schedules: readonly SourceBucketSchedule[],
  dispositions: readonly CandidateDisposition[],
  output: ProvenanceReductionOutput,
  input: ReduceProvenanceInput,
  fleet: FleetScopeReceipt,
  policyDigest: string,
): ReductionLedgerEvent[] {
  const pending: Array<Omit<ReductionLedgerEvent, 'sequence'>> = [];
  pending.push(ledgerEvent('policy.bound', {
    policy: canonicalPolicy(input.policy),
    policyDigest,
  }));
  pending.push(ledgerEvent('fleet.scoped', fleet));
  pending.push(ledgerEvent('partial-failure.bound', {
    degradedMarkerId: input.partialFailure.degradedMarker?.marker_id ?? null,
    evaluationDigest: input.partialFailure.policyEvaluationReceipt.evaluation_digest,
    policyDigest: input.partialFailure.policyEvaluationReceipt.policy_digest,
    receiptId: input.partialFailure.policyEvaluationReceipt.receipt_id,
    replayFingerprint: input.partialFailure.policyEvaluationReceipt.replay_fingerprint,
  }));
  for (const registration of canonicalSourceRegistrations(input)) {
    pending.push(ledgerEvent('source.registered', registration));
  }
  for (const occurrence of occurrences) {
    pending.push(ledgerEvent('candidate.accepted', {
      candidate: occurrence.candidate,
      candidateId: occurrence.candidateId,
      contributor: occurrence.contributor,
      exactKey: occurrence.exactKey,
      payloadDigest: occurrence.payloadDigest,
      resultEnvelopeId: occurrence.candidate.provenance.resultEnvelopeId,
      sourceBucketId: occurrence.sourceBucketId,
    }));
  }
  for (const entry of invalid) pending.push(ledgerEvent('candidate.invalid', entry));
  for (const unit of dedupUnits) pending.push(ledgerEvent('dedup.grouped', {
    candidateIds: unit.candidateIds,
    canonicalItemId: unit.canonicalItemId,
    contributors: unit.contributors,
    exactKeys: unit.exactKeys,
    payload: unit.payload,
    payloadDigest: unit.payloadDigest,
    supportBucketIds: unit.supportBucketIds,
  }));
  for (const conflict of conflicts) pending.push(ledgerEvent('conflict.formed', conflict));
  for (const adjudication of adjudications) pending.push(ledgerEvent('adjudication.resolved', adjudication));
  for (const schedule of schedules) pending.push(ledgerEvent('bucket.scheduled', schedule));
  for (const disposition of dispositions) pending.push(ledgerEvent('candidate.dispositioned', disposition));
  pending.push(ledgerEvent('reduction.completed', {
    conditionalDecisionId: input.conditionalInput.decisionId,
    conditionalReducerInputDigest: input.conditionalInput.reducerInputDigest,
    conflictIds: conflicts.map((entry) => entry.conflictId),
    dispositionDigest: stableDigest(dispositions),
    identityVersion: input.policy.identityVersion,
    outputDigest: output.outputDigest,
    outputOrder: output.items.map((entry) => entry.canonicalItemId),
    partialFailureEvaluationDigest: input.partialFailure.policyEvaluationReceipt.evaluation_digest,
    policyDigest,
    policyId: input.policy.policyId,
    policyVersion: input.policy.policyVersion,
    reducerVersion: input.policy.reducerVersion,
    schedulerVersion: input.policy.schedulerVersion,
    sourceRegistrationDigest: stableDigest(canonicalSourceRegistrations(input)),
  }));
  pending.sort((left, right) => {
    const typeOrder = left.eventType.localeCompare(right.eventType);
    return typeOrder !== 0 ? typeOrder : left.eventId.localeCompare(right.eventId);
  });
  return pending.map((event, sequence) => Object.freeze({ ...event, sequence }));
}

function shadowReceipt(
  legacyOutput: JsonValue | null | undefined,
  output: ProvenanceReductionOutput,
): ReductionShadowReceipt {
  const legacyOutputDigest = legacyOutput === null || legacyOutput === undefined
    ? null
    : stableDigest(legacyOutput);
  const reducerOutputDigest = stableDigest(output);
  const classification: ReductionShadowReceipt['classification'] = legacyOutputDigest === null
    ? 'legacy-not-observed'
    : legacyOutputDigest === reducerOutputDigest
      ? 'byte-identical'
      : 'different';
  const core = {
    classification,
    legacyAuthority: 'authoritative' as const,
    legacyOutputDigest,
    reducerAuthority: 'shadow-only' as const,
    reducerOutputDigest,
  };
  return Object.freeze({ ...core, receiptDigest: stableDigest(core) });
}

/** Reduce decision-bound successful envelopes into deterministic shadow output and evidence. */
export async function reduceProvenance(
  input: ReduceProvenanceInput,
): Promise<ProvenanceReductionResult> {
  const weights = validatePolicy(input.policy);
  const policyDigest = stableDigest(canonicalPolicy(input.policy));
  const upstream = validateUpstream(input);
  const fleet = fleetScope(input);
  for (const bucketId of fleet.receipt.expected) {
    if (!weights.has(bucketId)) {
      throw new TypeError('Every expected fleet bucket requires an explicit policy weight');
    }
  }
  for (const registration of upstream.registrations.values()) {
    const sourceBucketId = normalizeSourceBucketId(registration.modelFamily);
    if (!fleet.admittedBuckets.has(sourceBucketId) || !weights.has(sourceBucketId)) {
      throw new TypeError('Successful source registration is not admitted by fleet policy');
    }
  }
  const parsed = parseOccurrences(
    input,
    upstream.envelopes,
    upstream.registrations,
    fleet.admittedBuckets,
    weights,
  );
  const exact = exactReduction(parsed.valid);
  const semantic = await adjudicateSemanticGroups(input, parsed.valid, exact.units);
  const scheduled = scheduleUnits(semantic.units, input.policy, weights);
  const dispositions = buildDispositions(parsed.invalid, exact, semantic, scheduled);
  const items = outputItems(scheduled.selected);
  const outputCore = {
    conflicts: exact.conflicts,
    dispositions: Object.freeze(dispositions),
    items: Object.freeze(items),
    outputVersion: PROVENANCE_REDUCTION_VERSION as typeof PROVENANCE_REDUCTION_VERSION,
  };
  const output: ProvenanceReductionOutput = Object.freeze({
    ...outputCore,
    outputDigest: stableDigest(outputCore),
  });
  const ledger = buildLedger(
    parsed.valid,
    parsed.invalid,
    exact.units,
    exact.conflicts,
    semantic.adjudications,
    scheduled.schedules,
    dispositions,
    output,
    input,
    fleet.receipt,
    policyDigest,
  );
  const ledgerEventDigests = ledger.map((event) => event.eventDigest);
  const ledgerHeadDigest = stableDigest(ledgerEventDigests);
  const dispositionDigest = stableDigest(dispositions);
  const sourceRegistrationDigest = stableDigest(canonicalSourceRegistrations(input));
  const replayFingerprint = stableDigest({
    conditionalReducerInputDigest: input.conditionalInput.reducerInputDigest,
    ledgerHeadDigest,
    outputDigest: output.outputDigest,
    partialFailureReplayFingerprint: input.partialFailure.policyEvaluationReceipt.replay_fingerprint,
    policyDigest,
    sourceRegistrationDigest,
  });
  const receiptCore = {
    acceptedCandidateIds: Object.freeze(parsed.valid.map((entry) => entry.candidateId).sort()),
    adjudications: semantic.adjudications,
    authority: Object.freeze({
      legacyFanIn: 'authoritative' as const,
      provenanceReducer: 'shadow-only' as const,
    }),
    conditionalDecisionId: input.conditionalInput.decisionId,
    conditionalReducerInputDigest: input.conditionalInput.reducerInputDigest,
    conflictIds: Object.freeze(exact.conflicts.map((entry) => entry.conflictId)),
    dispositionDigest,
    fleet: fleet.receipt,
    invalidCandidateIds: Object.freeze(parsed.invalid.map((entry) => entry.candidateId).sort()),
    ledgerEventDigests: Object.freeze(ledgerEventDigests),
    ledgerHeadDigest,
    outputDigest: output.outputDigest,
    outputOrder: Object.freeze(items.map((entry) => entry.canonicalItemId)),
    degradedMarkerId: input.partialFailure.degradedMarker?.marker_id ?? null,
    partialFailureEvaluationDigest: input.partialFailure.policyEvaluationReceipt.evaluation_digest,
    partialFailurePolicyDigest: input.partialFailure.policyEvaluationReceipt.policy_digest,
    partialFailureReceiptId: input.partialFailure.policyEvaluationReceipt.receipt_id,
    partialFailureReplayFingerprint: input.partialFailure.policyEvaluationReceipt.replay_fingerprint,
    policyDigest,
    policyId: input.policy.policyId,
    policyVersion: input.policy.policyVersion,
    reducerVersion: PROVENANCE_REDUCTION_VERSION as typeof PROVENANCE_REDUCTION_VERSION,
    replayFingerprint,
    schedules: scheduled.schedules,
    sourceRegistrationDigest,
  };
  const receipt: ProvenanceReductionReceipt = Object.freeze({
    ...receiptCore,
    receiptDigest: stableDigest(receiptCore),
  });
  return Object.freeze({
    ledger: Object.freeze(ledger),
    output,
    outputBytes: canonicalJson(output),
    receipt,
    shadow: shadowReceipt(input.legacyOutput, output),
  });
}
