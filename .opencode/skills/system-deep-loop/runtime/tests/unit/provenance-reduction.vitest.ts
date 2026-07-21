import { describe, expect, it } from 'vitest';

import {
  AdjudicationDecisionKinds,
  AdjudicationStatuses,
} from '../../lib/blinded-adjudication/index.js';
import { reducerInputDigest } from '../../lib/conditional-fanin/index.js';
import {
  canonicalBytes,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  normalizeSourceBucketId,
  reduceProvenance,
  replayProvenanceLedger,
  replayProvenanceReduction,
} from '../../lib/provenance-reduction/index.js';
import { buildLeafResultPayload } from '../../lib/result-envelopes/index.js';

import type {
  AdjudicationStatus,
  AdjudicationVerdict,
} from '../../lib/blinded-adjudication/index.js';
import type { DecisionBoundReductionInput } from '../../lib/conditional-fanin/index.js';
import type { DispatchReceiptPayload } from '../../lib/dispatch-receipts/index.js';
import type { JsonValue } from '../../lib/event-envelope/index.js';
import type {
  PartialFailureReductionRequest,
  PolicyEvaluationReceipt,
} from '../../lib/partial-failure-policy/index.js';
import type {
  BlindedMergePort,
  BlindedMergeRequest,
  ProvenanceReductionPolicy,
  ReduceProvenanceInput,
  ReductionCandidate,
  SourceProvenanceRegistration,
  SourceFleetEntry,
} from '../../lib/provenance-reduction/index.js';
import type { LeafResultPayload } from '../../lib/result-envelopes/index.js';

const HASH_A = 'a'.repeat(64);
const HASH_B = 'b'.repeat(64);
const HASH_C = 'c'.repeat(64);

function dispatchReceipt(id: string, branchId = `branch-${id}`): DispatchReceiptPayload {
  return {
    adapter_identity: 'fixture-adapter',
    adapter_version: '1',
    attempt_id: `attempt-${id}`,
    canonicalization_version: '1',
    capability_row_id: 'fixture-capability',
    dispatch_id: `dispatch-${id}`,
    effective_config_digest: HASH_A,
    event_name: 'dispatch-resolved',
    executable_identity: 'fixture',
    executable_version: '1',
    executor_kind: 'fixture-executor',
    fingerprint_algorithm: 'sha256',
    fingerprint_namespace: 'fixture',
    fingerprint_version: 1,
    input_digest: HASH_A,
    invocation_fingerprint: `inv:${HASH_B}`,
    leaf_id: `leaf-${id}`,
    logical_branch_id: branchId,
    mac: null,
    mac_key_id: 'none',
    mac_key_provider_id: 'none',
    mac_scheme: 'none',
    mac_trust_scope: 'ledger-only',
    mac_verifier_version: '1',
    model: null,
    prompt_digest: HASH_A,
    reasoning_effort: null,
    receipt_id: `receipt-${id}`,
    run_id: 'run-1',
    search_policy: 'off',
    service_tier: null,
  };
}

function successfulEnvelope(
  id: string,
  branchId = `branch-${id}`,
  includeEvidence = false,
): LeafResultPayload {
  const parsedResult = { answer: `answer-${id}` };
  return buildLeafResultPayload(dispatchReceipt(id, branchId), {
    artifacts: [],
    completedAt: '2026-07-21T12:00:01.000Z',
    cost: { amount: 1, currency: 'USD', provenance: 'measured' },
    durationMs: 1_000,
    errorClassification: null,
    errorDigest: null,
    evidence: includeEvidence ? [{
      digest: HASH_C,
      kind: 'fixture',
      reference: `artifact://evidence/${id}`,
      required: true,
    }] : [],
    parsedResult,
    parsedResultDigest: sha256Bytes(canonicalBytes(parsedResult)),
    parsedResultReference: null,
    replayFingerprint: HASH_A,
    resultSchemaVersion: 1,
    salvageSummary: { disposition: 'none', fragment_count: 0 },
    startedAt: '2026-07-21T12:00:00.000Z',
    status: 'succeeded',
    usage: {
      input_tokens: 1,
      output_tokens: 1,
      provenance: 'measured',
      total_tokens: 2,
    },
  }, 1);
}

function conditionalInput(envelopes: readonly LeafResultPayload[]): DecisionBoundReductionInput {
  return {
    decisionId: 'decision-1',
    orderedEnvelopes: Object.freeze([...envelopes]),
    reducerInputDigest: reducerInputDigest(envelopes.map((envelope) => ({
      resultDigest: envelope.result_digest,
      resultEnvelopeId: envelope.result_envelope_id,
    }))),
  };
}

function policy(families: readonly string[], overrides: Partial<ProvenanceReductionPolicy> = {}): ProvenanceReductionPolicy {
  return {
    adjudicationPolicyVersion: 'semantic-merge@1',
    adjudicationReferenceDigest: HASH_B,
    adjudicationRubricDigest: HASH_A,
    identityVersion: 1,
    outputCapacity: 32,
    perSourceContributionCap: 16,
    policyId: 'provenance-balanced-fixture',
    policyVersion: 1,
    reducerVersion: 1,
    schedulerVersion: 1,
    weights: families.map((modelFamily) => ({
      denominator: 1,
      numerator: 1,
      sourceBucketId: normalizeSourceBucketId(modelFamily),
    })),
    ...overrides,
  };
}

function fleet(
  families: readonly string[],
  status: SourceFleetEntry['status'] = 'admitted',
): SourceFleetEntry[] {
  return families.map((modelFamily) => ({ modelFamily, reasonCode: null, status }));
}

function partialFailure(
  envelopes: readonly LeafResultPayload[],
  options: {
    degraded?: boolean;
    failed?: number;
    notAwaited?: number;
    pending?: number;
  } = {},
): PartialFailureReductionRequest {
  const failed = options.failed ?? 0;
  const notAwaited = options.notAwaited ?? 0;
  const pending = options.pending ?? 0;
  const admitted = envelopes.length + failed + pending;
  const receipt: PolicyEvaluationReceipt = {
    admitted,
    admitted_set_digest: HASH_A,
    applicability: 'applicable',
    boundary_state: 'terminal',
    decision_epoch_id: 'epoch-1',
    evaluated_at: '2026-07-21T12:00:02.000Z',
    evaluation_digest: HASH_B,
    event_name: 'partial-failure-policy-evaluated',
    failed,
    failed_logical_branch_ids: Array.from({ length: failed }, (_, index) => `failed-${index}`),
    finality: 'final',
    not_awaited: notAwaited,
    ordered_input_ids: envelopes.map((envelope) => envelope.result_envelope_id),
    pending,
    policy_digest: HASH_C,
    policy_id: 'partial-policy',
    policy_mode: 'quorum',
    policy_version: 1,
    reason_codes: options.degraded ? ['failure-tolerated'] : ['success-threshold-met'],
    receipt_id: 'partial-receipt-1',
    replay_fingerprint: HASH_A,
    required_success_count: 1,
    retry_event_ids: [],
    run_id: 'run-1',
    success_fraction: { denominator: admitted, numerator: envelopes.length },
    succeeded: envelopes.length,
    successful_result_envelope_ids: envelopes.map((envelope) => envelope.result_envelope_id),
    terminal_failure_ids: Array.from({ length: failed }, (_, index) => `failure-${index}`),
    tolerated_failure_ceiling: failed,
    verdict: options.degraded ? 'proceed_degraded' : 'proceed',
  };
  return {
    degradedMarker: options.degraded ? {
      admitted,
      degraded: true,
      failed,
      failed_logical_branch_ids: [...receipt.failed_logical_branch_ids],
      finality: 'final',
      marker_id: 'degraded-1',
      marker_type: 'degraded',
      not_awaited: notAwaited,
      policy_evaluation_receipt_id: receipt.receipt_id,
      policy_id: receipt.policy_id,
      policy_version: receipt.policy_version,
      reason_codes: ['failure-tolerated'],
      success_fraction: receipt.success_fraction,
      succeeded: envelopes.length,
      tolerated_failure_ceiling: failed,
    } : null,
    policyEvaluationReceipt: receipt,
    successfulEnvelopes: Object.freeze([...envelopes]),
  };
}

function candidate(
  envelope: LeafResultPayload,
  modelFamily: string,
  identity: ReductionCandidate['identity'],
  payload: JsonValue,
  options: {
    judgeContent?: string | null;
    modelId?: string;
    parentBranchId?: string | null;
    providerId?: string;
    rank?: number;
    semanticEquivalenceKey?: string | null;
  } = {},
): ReductionCandidate {
  return {
    identity,
    judgeContent: options.judgeContent ?? null,
    payload,
    provenance: {
      dispatchReceiptId: envelope.dispatch_receipt_id,
      executorKind: 'fixture-executor',
      invocationFingerprint: envelope.invocation_fingerprint,
      leafId: envelope.leaf_id,
      logicalBranchId: envelope.logical_branch_id,
      modelFamily,
      modelId: options.modelId ?? `${modelFamily}-model`,
      parentBranchId: options.parentBranchId ?? null,
      providerId: options.providerId ?? `${modelFamily}-provider`,
      resultDigest: envelope.result_digest,
      resultEnvelopeId: envelope.result_envelope_id,
    },
    rank: options.rank ?? 0,
    semanticEquivalenceKey: options.semanticEquivalenceKey ?? null,
  };
}

function sourceRegistration(
  envelope: LeafResultPayload,
  modelFamily: string,
): SourceProvenanceRegistration {
  return candidate(
    envelope,
    modelFamily,
    { namespace: 'registration', stableId: envelope.result_envelope_id, type: 'claim' },
    null,
  ).provenance;
}

function input(
  envelopes: readonly LeafResultPayload[],
  candidates: readonly unknown[],
  families: readonly string[],
  overrides: Partial<ReduceProvenanceInput> = {},
): ReduceProvenanceInput {
  const sourceRegistrations = envelopes.map((envelope, index) => {
    const matching = candidates.find((entry) => {
      if (entry === null || Array.isArray(entry) || typeof entry !== 'object') return false;
      const provenance = (entry as { provenance?: unknown }).provenance;
      return provenance !== null
        && typeof provenance === 'object'
        && (provenance as { resultEnvelopeId?: unknown }).resultEnvelopeId
          === envelope.result_envelope_id;
    }) as ReductionCandidate | undefined;
    return matching?.provenance
      ?? sourceRegistration(envelope, families[index] ?? families[0]);
  });
  return {
    candidates,
    conditionalInput: conditionalInput(envelopes),
    fleet: fleet(families),
    partialFailure: partialFailure(envelopes),
    policy: policy(families),
    sourceRegistrations,
    ...overrides,
  };
}

function verdict(
  request: BlindedMergeRequest,
  status: AdjudicationStatus,
  preferredCandidateDigest: string | null,
): AdjudicationVerdict {
  return {
    adjudicationId: 'adjudication-1',
    counterfactualEvidenceIds: status === 'stable' ? ['counterfactual-1'] : [],
    cycles: [],
    decisionKind: AdjudicationDecisionKinds.DEEP_REVIEW,
    independence: {
      clusters: [{ clusterId: 'cluster-1', judgeIds: ['judge-1'], sharedSignals: [] }],
      competenceEstimatesAdvisory: {},
      competenceWeightsCorrectCorrelation: false,
      configuredSeatCount: 1,
      effectiveIndependentCount: 1,
      observedSeatCount: 1,
      residualCorrelationWarnings: [],
    },
    legacyAuthority: 'canonical',
    minorityEvidenceIds: [],
    pairwiseGraph: [],
    preferredCandidateDigest,
    rawScoreEvidenceIds: ['raw-1'],
    reductionEvidenceId: 'reduction-1',
    replayFingerprint: request.replayFingerprint,
    serviceAuthority: 'shadow-only',
    status,
    tiePairIds: [],
    verdictEvidenceId: 'verdict-1',
    vetoEvidenceIds: [],
  };
}

describe('provenance-balanced reduction', () => {
  it('is byte-identical across completion, enumeration, resume, and salvage permutations', async () => {
    const envelopes = [
      successfulEnvelope('sol'),
      successfulEnvelope('luna'),
      successfulEnvelope('glm'),
    ];
    const candidates = [
      candidate(envelopes[0], 'SOL', {
        repositoryName: null,
        type: 'repository',
        url: 'https://www.GitHub.com/Org/Repo.git?position=1#producer',
      }, { score: 7 }),
      candidate(envelopes[1], 'LUNA', {
        repositoryName: 'github.com/org/repo.git',
        type: 'repository',
        url: null,
      }, { score: 7 }),
      candidate(envelopes[2], 'GLM', {
        namespace: 'Finding',
        stableId: 'UNIQUE-1',
        type: 'claim',
      }, { finding: 'minority' }),
    ];
    const permutations = [
      candidates,
      [...candidates].reverse(),
      [candidates[2], candidates[0], candidates[1]],
    ];
    const registrations = candidates.map((entry) => entry.provenance);
    const results = await Promise.all(permutations.map((entries, index) => reduceProvenance(input(
      envelopes,
      entries,
      ['SOL', 'LUNA', 'GLM'],
      {
        fleet: index % 2 === 0
          ? fleet(['SOL', 'LUNA', 'GLM'])
          : fleet(['SOL', 'LUNA', 'GLM']).reverse(),
        partialFailure: partialFailure(index % 2 === 0 ? envelopes : [...envelopes].reverse()),
        policy: policy(['SOL', 'LUNA', 'GLM'], {
          weights: index % 2 === 0
            ? policy(['SOL', 'LUNA', 'GLM']).weights
            : [...policy(['SOL', 'LUNA', 'GLM']).weights].reverse(),
        }),
        sourceRegistrations: index % 2 === 0
          ? registrations
          : [...registrations].reverse(),
      },
    ))));

    expect(new Set(results.map((result) => result.outputBytes)).size).toBe(1);
    expect(new Set(results.map((result) => result.receipt.receiptDigest)).size).toBe(1);
    expect(new Set(results.map((result) => result.receipt.replayFingerprint)).size).toBe(1);
    expect(replayProvenanceReduction(results[0])).toEqual({
      ledgerHeadDigest: results[0].receipt.ledgerHeadDigest,
      outputDigest: results[0].output.outputDigest,
      receiptDigest: results[0].receipt.receiptDigest,
      replayFingerprint: results[0].receipt.replayFingerprint,
    });
    const projection = replayProvenanceLedger(results[0].ledger);
    expect(projection.outputOrder).toEqual(results[0].receipt.outputOrder);
    expect(projection.sourceRegistrationDigest).toBe(
      results[0].receipt.sourceRegistrationDigest,
    );

    const parity = await reduceProvenance(input(envelopes, candidates, ['SOL', 'LUNA', 'GLM'], {
      legacyOutput: JSON.parse(results[0].outputBytes) as JsonValue,
    }));
    expect(parity.shadow.classification).toBe('byte-identical');
    expect(parity.receipt.authority).toEqual({
      legacyFanIn: 'authoritative',
      provenanceReducer: 'shadow-only',
    });
  });

  it('retains every contributor while duplicate input occurrences remain dispositioned', async () => {
    const envelopes = [
      successfulEnvelope('sol-1', 'sol-clone-1', true),
      successfulEnvelope('sol-2', 'sol-clone-2'),
      successfulEnvelope('luna-1'),
    ];
    const identity = { namespace: 'claim', stableId: 'same-claim', type: 'claim' as const };
    const base = candidate(envelopes[0], 'SOL', identity, { value: 'same' });
    const duplicateFlood = Array.from({ length: 20 }, () => base);
    const result = await reduceProvenance(input(envelopes, [
      ...duplicateFlood,
      candidate(envelopes[1], 'SOL', identity, { value: 'same' }),
      candidate(envelopes[2], 'LUNA', identity, { value: 'same' }),
    ], ['SOL', 'LUNA']));

    expect(result.output.items).toHaveLength(1);
    expect(result.output.items[0].contributors).toHaveLength(3);
    expect(result.output.items[0].contributors.some((entry) => (
      entry.evidenceLocators.includes(`fixture:artifact://evidence/sol-1:${HASH_C}`)
    ))).toBe(true);
    expect(result.output.items[0].contributors.every((entry) => (
      entry.sourceLocalPayloadDigest === result.output.items[0].payloadDigest
      && entry.sourceRank === 0
    ))).toBe(true);
    expect(result.output.items[0].effectiveSourceCount).toBe(2);
    expect(result.output.items[0].supportBucketIds).toEqual([
      normalizeSourceBucketId('LUNA'),
      normalizeSourceBucketId('SOL'),
    ]);
    expect(result.output.dispositions).toHaveLength(22);
    expect(result.output.dispositions.filter((entry) => entry.kind === 'duplicate-merged')).toHaveLength(21);
  });

  it('gives every eligible source a slot before weighted extras and clones cannot mint support', async () => {
    const envelopes = [
      successfulEnvelope('a-1', 'a-clone-1'),
      successfulEnvelope('a-2', 'a-clone-2'),
      successfulEnvelope('a-3', 'a-clone-3'),
      successfulEnvelope('b-1'),
    ];
    const candidates = [
      candidate(envelopes[0], 'A', { namespace: 'n', stableId: 'a-1', type: 'claim' }, { value: 1 }),
      candidate(envelopes[1], 'A', { namespace: 'n', stableId: 'a-2', type: 'claim' }, { value: 2 }),
      candidate(envelopes[2], 'A', { namespace: 'n', stableId: 'a-3', type: 'claim' }, { value: 3 }),
      candidate(envelopes[3], 'B', { namespace: 'n', stableId: 'b-1', type: 'claim' }, { value: 4 }),
    ];
    const weighted = policy(['A', 'B'], {
      outputCapacity: 4,
      weights: [
        { denominator: 1, numerator: 9, sourceBucketId: normalizeSourceBucketId('A') },
        { denominator: 1, numerator: 1, sourceBucketId: normalizeSourceBucketId('B') },
      ],
    });
    const result = await reduceProvenance(input(envelopes, candidates, ['A', 'B'], { policy: weighted }));

    expect(result.output.items.map((entry) => entry.primarySourceBucketId)).toEqual([
      normalizeSourceBucketId('A'),
      normalizeSourceBucketId('B'),
      normalizeSourceBucketId('A'),
      normalizeSourceBucketId('A'),
    ]);
    expect(result.output.items.every((entry) => entry.effectiveSourceCount === 1)).toBe(true);
  });

  it('preserves minority work and defers quota exhaustion instead of erasing it', async () => {
    const envelopes = [
      successfulEnvelope('sol-1'),
      successfulEnvelope('sol-2'),
      successfulEnvelope('luna-1'),
    ];
    const candidates = [
      candidate(envelopes[0], 'SOL', { namespace: 'n', stableId: 'sol-1', type: 'claim' }, { value: 1 }),
      candidate(envelopes[1], 'SOL', { namespace: 'n', stableId: 'sol-2', type: 'claim' }, { value: 2 }),
      candidate(envelopes[2], 'LUNA', { namespace: 'n', stableId: 'minority', type: 'claim' }, { value: 3 }),
    ];
    const result = await reduceProvenance(input(envelopes, candidates, ['SOL', 'LUNA'], {
      policy: policy(['SOL', 'LUNA'], { outputCapacity: 8, perSourceContributionCap: 1 }),
    }));

    expect(result.output.items.map((entry) => entry.primarySourceBucketId)).toContain(
      normalizeSourceBucketId('LUNA'),
    );
    expect(result.output.dispositions.some((entry) => entry.kind === 'quota-deferred')).toBe(true);
    expect(result.output.dispositions).toHaveLength(candidates.length);

    const capacityLimited = await reduceProvenance(input(envelopes, candidates, ['SOL', 'LUNA'], {
      policy: policy(['SOL', 'LUNA'], { outputCapacity: 1, perSourceContributionCap: 8 }),
    }));
    expect(capacityLimited.output.dispositions.some((entry) => (
      entry.kind === 'capacity-excluded'
    ))).toBe(true);
  });

  it('forms typed conflicts and dispositions malformed provenance without overwrites', async () => {
    const envelopes = [successfulEnvelope('sol'), successfulEnvelope('luna')];
    const identity = { namespace: 'claim', stableId: 'conflict', type: 'claim' as const };
    const malformed = {
      ...candidate(envelopes[0], 'SOL', {
        namespace: 'claim',
        stableId: 'malformed',
        type: 'claim',
      }, { value: 3 }),
      provenance: { modelFamily: 'SOL' },
    };
    const emptyIdentity = {
      ...candidate(envelopes[0], 'SOL', identity, { value: 3 }),
      identity: { namespace: 'claim', stableId: '   ', type: 'claim' },
    };
    const unsupportedIdentity = {
      ...candidate(envelopes[0], 'SOL', identity, { value: 4 }),
      identity: { digest: HASH_A, type: 'free-form' },
    };
    const result = await reduceProvenance(input(envelopes, [
      candidate(envelopes[0], 'SOL', identity, { value: 1 }),
      candidate(envelopes[1], 'LUNA', identity, { value: 2 }),
      malformed,
      emptyIdentity,
      unsupportedIdentity,
    ], ['SOL', 'LUNA']));

    expect(result.output.conflicts).toHaveLength(1);
    expect(result.output.conflicts[0].variants).toHaveLength(2);
    expect(result.output.items).toHaveLength(0);
    expect(result.output.dispositions.map((entry) => entry.kind).sort()).toEqual([
      'conflicted',
      'conflicted',
      'invalid',
      'invalid',
      'invalid',
    ]);
    expect(result.receipt.invalidCandidateIds).toHaveLength(3);
  });

  it('sends semantic contests through an identity-free port and merges only a stable verdict', async () => {
    const envelopes = [successfulEnvelope('sol'), successfulEnvelope('luna')];
    const requests: BlindedMergeRequest[] = [];
    const adjudicator: BlindedMergePort = {
      async adjudicate(request) {
        requests.push(request);
        return verdict(request, AdjudicationStatuses.STABLE, request.candidates[0].candidateDigest);
      },
    };
    const candidates = [
      candidate(
        envelopes[0],
        'SOL',
        { namespace: 'claim', stableId: 'alpha', type: 'claim' },
        { answer: 'alpha' },
        { judgeContent: 'Alpha evidence', semanticEquivalenceKey: 'semantic-1' },
      ),
      candidate(
        envelopes[1],
        'LUNA',
        { namespace: 'claim', stableId: 'beta', type: 'claim' },
        { answer: 'beta' },
        { judgeContent: 'Beta evidence', semanticEquivalenceKey: 'semantic-1' },
      ),
    ];
    const result = await reduceProvenance(input(envelopes, candidates, ['SOL', 'LUNA'], { adjudicator }));

    expect(requests).toHaveLength(1);
    expect(JSON.stringify(requests[0])).not.toMatch(
      /producer|provider|model|position|branch|leaf|executor|invocation/iu,
    );
    expect(result.output.items).toHaveLength(1);
    expect(result.output.items[0].contributors).toHaveLength(2);
    expect(result.receipt.adjudications[0].status).toBe('stable');
    expect(result.output.dispositions.some((entry) => entry.kind === 'adjudicated-merged')).toBe(true);
  });

  it('fails closed for unstable, missing, or identity-leaking adjudication evidence', async () => {
    const envelopes = [successfulEnvelope('sol'), successfulEnvelope('luna')];
    let calls = 0;
    const adjudicator: BlindedMergePort = {
      async adjudicate(request) {
        calls += 1;
        return verdict(request, AdjudicationStatuses.UNSTABLE, null);
      },
    };
    const candidates = [
      candidate(
        envelopes[0],
        'SOL',
        { namespace: 'claim', stableId: 'alpha', type: 'claim' },
        { answer: 'alpha' },
        { judgeContent: 'Author: SOL producer', semanticEquivalenceKey: 'semantic-1' },
      ),
      candidate(
        envelopes[1],
        'LUNA',
        { namespace: 'claim', stableId: 'beta', type: 'claim' },
        { answer: 'beta' },
        { judgeContent: 'Beta evidence', semanticEquivalenceKey: 'semantic-1' },
      ),
    ];
    const leaking = await reduceProvenance(input(envelopes, candidates, ['SOL', 'LUNA'], { adjudicator }));
    expect(calls).toBe(0);
    expect(leaking.output.items).toHaveLength(2);
    expect(leaking.receipt.adjudications[0].status).toBe('failed-closed');

    const safeCandidates = candidates.map((entry, index) => ({
      ...entry,
      judgeContent: index === 0 ? 'Alpha evidence' : 'Beta evidence',
    }));
    const unstable = await reduceProvenance(input(envelopes, safeCandidates, ['SOL', 'LUNA'], { adjudicator }));
    expect(calls).toBe(1);
    expect(unstable.output.items).toHaveLength(2);
    expect(unstable.receipt.adjudications[0].status).toBe('failed-closed');

    const inconclusivePort: BlindedMergePort = {
      async adjudicate(request) {
        return verdict(request, AdjudicationStatuses.INCONCLUSIVE, null);
      },
    };
    const inconclusive = await reduceProvenance(input(envelopes, safeCandidates, ['SOL', 'LUNA'], {
      adjudicator: inconclusivePort,
    }));
    const missing = await reduceProvenance(input(envelopes, safeCandidates, ['SOL', 'LUNA']));
    expect(inconclusive.output.items).toHaveLength(2);
    expect(missing.output.items).toHaveLength(2);
    expect(missing.receipt.adjudications[0].status).toBe('failed-closed');
  });

  it('records full fleet categories and never labels degraded survivors full-fleet', async () => {
    const envelopes = [successfulEnvelope('sol')];
    const families = ['SOL', 'LUNA', 'GLM', 'QWEN', 'KIMI', 'NOVA'];
    const manifest: SourceFleetEntry[] = [
      { modelFamily: 'SOL', reasonCode: null, status: 'admitted' },
      { modelFamily: 'LUNA', reasonCode: 'executor-failed', status: 'failed' },
      { modelFamily: 'GLM', reasonCode: 'deadline', status: 'timed-out' },
      { modelFamily: 'QWEN', reasonCode: 'cancelled', status: 'cancelled' },
      { modelFamily: 'KIMI', reasonCode: 'invalid-envelope', status: 'invalid' },
      { modelFamily: 'NOVA', reasonCode: 'policy-excluded', status: 'excluded' },
    ];
    const result = await reduceProvenance(input(envelopes, [
      candidate(
        envelopes[0],
        'SOL',
        { namespace: 'claim', stableId: 'survivor', type: 'claim' },
        { answer: 'survived' },
      ),
    ], families, {
      fleet: manifest,
      partialFailure: partialFailure(envelopes, { degraded: true, failed: 1 }),
    }));

    expect(result.receipt.fleet.consensusScope).toBe('partial-fleet');
    expect(result.receipt.fleet.expected).toHaveLength(6);
    expect(result.receipt.fleet.admitted).toEqual([normalizeSourceBucketId('SOL')]);
    expect(result.receipt.fleet.failed).toEqual([normalizeSourceBucketId('LUNA')]);
    expect(result.receipt.fleet.timedOut).toEqual([normalizeSourceBucketId('GLM')]);
    expect(result.receipt.fleet.cancelled).toEqual([normalizeSourceBucketId('QWEN')]);
    expect(result.receipt.fleet.invalid).toEqual([normalizeSourceBucketId('KIMI')]);
    expect(result.receipt.fleet.excluded).toEqual([normalizeSourceBucketId('NOVA')]);
  });

  it('rejects a forged reducer-input digest before reducing candidates', async () => {
    const envelopes = [successfulEnvelope('sol')];
    const forged: DecisionBoundReductionInput = {
      ...conditionalInput(envelopes),
      reducerInputDigest: HASH_C,
    };
    await expect(reduceProvenance(input(envelopes, [], ['SOL'], {
      conditionalInput: forged,
    }))).rejects.toThrow('Conditional reducer input digest is invalid');

    const relabeled = candidate(
      envelopes[0],
      'LUNA',
      { namespace: 'claim', stableId: 'relabelled', type: 'claim' },
      { value: 'cannot steal a bucket' },
    );
    const guarded = await reduceProvenance(input(envelopes, [relabeled], ['SOL', 'LUNA'], {
      sourceRegistrations: [sourceRegistration(envelopes[0], 'SOL')],
    }));
    expect(guarded.output.items).toHaveLength(0);
    expect(guarded.output.dispositions[0].kind).toBe('invalid');
  });
});
