// ───────────────────────────────────────────────────────────────────
// MODULE: Semantic Communities Unit Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  canonicalBytes,
  canonicalJson,
  readEvent,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';
import {
  computeGraphNoveltyDelta,
  computeWindowedGraphNoveltyDelta,
} from '../../lib/coverage-graph/coverage-graph-signals.js';
import {
  admitSemanticEquivalenceEdge,
  computeSemanticNoveltyShadow,
  createEmptySemanticCommunityProjection,
  createSemanticClaimRecord,
  createSemanticCommunityEventRegistry,
  createSemanticProjectionHistory,
  defineSemanticProjectionConfig,
  prepareSemanticClaimObservationEvent,
  projectSemanticClaimIncrementally,
  rebuildSemanticCommunityProjection,
  rebuildSemanticCommunityProjectionFromLedger,
  retrieveNamespaceCandidates,
  semanticCandidateSetDigest,
  semanticCommunityCoverageSnapshot,
  semanticCommunityIdentityDigest,
  semanticCommunityReplayComponentDefinition,
  semanticCoverageEdgeBoundary,
  transitionSemanticProjectionVersion,
} from '../../lib/semantic-communities/index.js';

import type {
  LedgerHead,
  LedgerRecordFrame,
  VerifiedLedgerEvent,
} from '../../lib/authorized-ledger/index.js';
import type {
  CoverageEdge,
  CoverageNode,
  CoverageSnapshot,
  SemanticCandidateAssessment,
  SemanticClaimObservation,
  SemanticClaimRecord,
  SemanticNamespaceRecord,
  SemanticProjectionConfig,
  SemanticProjectionConfigInput,
} from '../../lib/semantic-communities/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURE CONTRACT
// ───────────────────────────────────────────────────────────────────

const TIMESTAMP = '2026-07-21T08:00:00.000Z';
const NAMESPACE: SemanticNamespaceRecord = {
  spec_folder: 'specs/semantic-community-fixture',
  loop_type: 'research',
  session_id: 'semantic-community-fixture',
};
const QUALITY_GATE = Object.freeze({ precision: 1, recall: 1 });

interface PairFixture {
  readonly score: number;
  readonly decision: SemanticCandidateAssessment['equivalence_decision'];
}

type PairFixtures = Readonly<Record<string, PairFixture>>;

function digest(value: unknown): string {
  return sha256Bytes(canonicalBytes(value));
}

function pairKey(left: string, right: string): string {
  return [left, right].sort().join('|');
}

function config(
  overrides: Partial<SemanticProjectionConfigInput> = {},
): SemanticProjectionConfig {
  return defineSemanticProjectionConfig({
    modelName: 'fixture-semantic-model',
    modelVersion: '2026-07-01',
    normalizationVersion: 'nfkc-lowercase-v1',
    metric: 'cosine',
    thresholdPolicyId: 'fixture-equivalence-threshold',
    thresholdPolicyVersion: '1',
    equivalenceThreshold: 0.8,
    candidateLimit: 64,
    equivalenceEvaluatorId: 'fixture-equivalence-evaluator',
    equivalenceEvaluatorVersion: '1',
    cohesionPolicyId: 'fixture-cross-community-cohesion',
    cohesionPolicyVersion: '1',
    cohesionScoreThreshold: 0.93,
    minimumCrossCommunityRatio: 0.75,
    ...overrides,
  });
}

function claim(
  claimId: string,
  sequence: number,
  rawText: string,
  evidenceLinks: readonly string[] = [],
  namespace: SemanticNamespaceRecord = NAMESPACE,
): SemanticClaimRecord {
  return createSemanticClaimRecord({
    node: {
      id: claimId,
      specFolder: namespace.spec_folder,
      loopType: namespace.loop_type,
      sessionId: namespace.session_id,
      kind: 'CLAIM',
      name: rawText,
      contentHash: digest({ rawText }),
      iteration: sequence,
    },
    rawText,
    normalizedFingerprint: digest(rawText.normalize('NFKC').toLowerCase()),
    evidenceLinks,
    origin: {
      ledger_id: 'semantic-source-ledger',
      sequence,
      event_id: `source-event-${claimId}`,
      record_hash: digest({ claimId, sequence }),
    },
  });
}

function assessment(
  query: SemanticClaimRecord,
  candidate: SemanticClaimRecord,
  rank: number,
  candidates: readonly SemanticClaimRecord[],
  pair: PairFixture,
  activeConfig: SemanticProjectionConfig,
): SemanticCandidateAssessment {
  const retrievalMethod = 'namespace-bounded-fixture';
  const retrievalVersion = '1';
  return {
    candidate_claim_id: candidate.claim_id,
    model_name: activeConfig.model_name,
    model_version: activeConfig.model_version,
    metric: activeConfig.metric,
    score: pair.score,
    threshold_policy_id: activeConfig.threshold_policy_id,
    threshold_policy_version: activeConfig.threshold_policy_version,
    admission_threshold: activeConfig.equivalence_threshold,
    candidate_retrieval_method: retrievalMethod,
    candidate_retrieval_version: retrievalVersion,
    candidate_rank: rank,
    candidate_set_digest: semanticCandidateSetDigest(
      query.claim_id,
      candidates.map((entry) => entry.claim_id),
      retrievalMethod,
      retrievalVersion,
    ),
    equivalence_decision: pair.decision,
    equivalence_evaluator_id: activeConfig.equivalence_evaluator_id,
    equivalence_evaluator_version: activeConfig.equivalence_evaluator_version,
    equivalence_evidence_digest: digest({
      endpoints: pairKey(query.claim_id, candidate.claim_id),
      decision: pair.decision,
      score: pair.score,
    }),
  };
}

function observationsFor(
  orderedClaims: readonly SemanticClaimRecord[],
  pairs: PairFixtures,
  activeConfig: SemanticProjectionConfig,
): SemanticClaimObservation[] {
  const observations: SemanticClaimObservation[] = [];
  const prior: SemanticClaimRecord[] = [];
  for (const current of orderedClaims) {
    const candidates = [...prior].sort((left, right) => left.claim_id.localeCompare(right.claim_id));
    observations.push({
      projection_version: activeConfig.projection_version,
      config_digest: activeConfig.config_digest,
      claim: current,
      candidate_assessments: candidates.map((candidate, index) => assessment(
        current,
        candidate,
        index + 1,
        candidates,
        pairs[pairKey(current.claim_id, candidate.claim_id)] ?? {
          score: 0.1,
          decision: 'distinct',
        },
        activeConfig,
      )),
    });
    prior.push(current);
  }
  return observations;
}

function qualityReport(
  projection: ReturnType<typeof rebuildSemanticCommunityProjection>,
  expectedEquivalentPairs: readonly string[],
): { precision: number; recall: number } {
  const admitted = new Set(Object.values(projection.edges).map(
    (edge) => pairKey(edge.source_id, edge.target_id),
  ));
  const expected = new Set(expectedEquivalentPairs);
  const truePositives = [...admitted].filter((pair) => expected.has(pair)).length;
  const falsePositives = [...admitted].filter((pair) => !expected.has(pair)).length;
  const falseNegatives = [...expected].filter((pair) => !admitted.has(pair)).length;
  return {
    precision: truePositives / Math.max(1, truePositives + falsePositives),
    recall: truePositives / Math.max(1, truePositives + falseNegatives),
  };
}

function stableProjectionBytes(
  projection: ReturnType<typeof rebuildSemanticCommunityProjection>,
): Readonly<{
  identityDigest: string;
  communities: string;
  memberships: string;
  edges: string;
}> {
  return Object.freeze({
    identityDigest: semanticCommunityIdentityDigest(projection),
    communities: canonicalJson(projection.communities),
    memberships: canonicalJson(projection.memberships),
    edges: canonicalJson(projection.edges),
  });
}

function replayEvents(
  observations: readonly SemanticClaimObservation[],
): { events: VerifiedLedgerEvent[]; head: LedgerHead } {
  const registry = createSemanticCommunityEventRegistry();
  const events: VerifiedLedgerEvent[] = [];
  let priorHash = '0'.repeat(64);
  observations.forEach((observation, index) => {
    const sequence = index + 1;
    const event = prepareSemanticClaimObservationEvent(observation, registry, {
      eventId: `semantic-observation-${sequence}`,
      streamId: 'semantic-community-stream',
      streamSequence: sequence,
      occurredAt: TIMESTAMP,
      recordedAt: TIMESTAMP,
      producer: { name: 'semantic-community-tests', version: '1' },
      authorityEpoch: 1,
      correlationId: 'semantic-community-replay',
      causationId: sequence === 1 ? null : `semantic-observation-${sequence - 1}`,
      idempotencyKey: `semantic-community-${sequence}`,
    });
    const recordHash = digest({ sequence, event: event.canonicalDigest, priorHash });
    const frame: LedgerRecordFrame = {
      frame_version: 1,
      ledger_id: 'semantic-community-ledger',
      sequence,
      prev_record_hash: priorHash,
      canonical_event_hash: event.canonicalDigest,
      authorization_ref: {
        audit_ledger_id: 'semantic-community-audit',
        audit_sequence: sequence,
        audit_record_hash: digest({ audit: sequence }),
        decision_id: `semantic-decision-${sequence}`,
        decision_digest: digest({ decision: sequence }),
        request_digest: digest({ request: sequence }),
        policy_digest: digest({ policy: 'semantic-community' }),
        authority_epoch: 1,
      },
      receipt: {
        ledger_id: 'semantic-community-ledger',
        sequence,
        event_id: event.identity.eventId,
        event_type: event.identity.eventType,
        event_version: event.identity.eventVersion,
        stream_id: event.identity.streamId,
        stream_sequence: event.identity.streamSequence,
        committed_at: TIMESTAMP,
      },
      canonical_event_bytes: Buffer.from(event.canonicalBytes).toString('base64'),
      record_hash: recordHash,
    };
    events.push({ frame, event: readEvent(event.canonicalBytes, registry) });
    priorHash = recordHash;
  });
  return {
    events,
    head: {
      ledgerId: 'semantic-community-ledger',
      sequence: events.length,
      recordHash: priorHash,
    },
  };
}

// ───────────────────────────────────────────────────────────────────
// 2. ADMISSION AND SEMANTIC QUALITY
// ───────────────────────────────────────────────────────────────────

describe('semantic equivalence admission', () => {
  it('requires complete versioned provenance and canonical pair-local edge bytes', () => {
    const activeConfig = config();
    const alpha = claim('claim-alpha', 1, 'Retries use exponential backoff.');
    const zulu = claim('claim-zulu', 2, 'Backoff grows exponentially between retries.');
    const candidateSet = [alpha];
    const equivalent = assessment(
      zulu,
      alpha,
      1,
      candidateSet,
      { score: 0.97, decision: 'equivalent' },
      activeConfig,
    );
    const observation = observationsFor(
      [alpha, zulu],
      { [pairKey(alpha.claim_id, zulu.claim_id)]: { score: 0.97, decision: 'equivalent' } },
      activeConfig,
    )[1];
    const edge = admitSemanticEquivalenceEdge(observation, alpha, equivalent, activeConfig);
    const reverseObservation = observationsFor(
      [zulu, alpha],
      { [pairKey(alpha.claim_id, zulu.claim_id)]: { score: 0.97, decision: 'equivalent' } },
      activeConfig,
    )[1];
    const reverseEdge = admitSemanticEquivalenceEdge(
      reverseObservation,
      zulu,
      reverseObservation.candidate_assessments[0],
      activeConfig,
    );

    expect(edge).toMatchObject({
      source_id: 'claim-alpha',
      target_id: 'claim-zulu',
      model_name: activeConfig.model_name,
      model_version: activeConfig.model_version,
      metric: activeConfig.metric,
      threshold_policy_id: activeConfig.threshold_policy_id,
      threshold_policy_version: activeConfig.threshold_policy_version,
      candidate_retrieval_method: 'namespace-bounded-fixture',
      candidate_retrieval_version: '1',
    });
    expect(edge?.candidate_set_digest).toMatch(/^[a-f0-9]{64}$/);
    expect(edge?.equivalence_evidence_digest).toMatch(/^[a-f0-9]{64}$/);
    expect(edge).toMatchObject({
      candidate_rank: 1,
      originating_event_id: 'source-event-claim-alpha',
      originating_event_sequence: 1,
    });
    expect(canonicalJson(edge)).toBe(canonicalJson(reverseEdge));
    expect(semanticCoverageEdgeBoundary(edge as NonNullable<typeof edge>)).toMatchObject({
      relation: 'SEMANTIC_EQUIVALENT',
      sourceId: 'claim-alpha',
      targetId: 'claim-zulu',
      weight: 0.97,
    });
  });

  it('rejects topical-only proximity even above the numeric threshold', () => {
    const activeConfig = config();
    const retry = claim('claim-retry', 1, 'Retries use exponential backoff.');
    const cache = claim('claim-cache', 2, 'Cache eviction uses exponential aging.');
    const topical = assessment(
      cache,
      retry,
      1,
      [retry],
      { score: 0.99, decision: 'topical_only' },
      activeConfig,
    );
    const observation: SemanticClaimObservation = {
      projection_version: activeConfig.projection_version,
      config_digest: activeConfig.config_digest,
      claim: cache,
      candidate_assessments: [topical],
    };

    expect(admitSemanticEquivalenceEdge(observation, retry, topical, activeConfig)).toBeNull();
  });

  it('rejects candidate provenance that does not commit the observed bounded set', () => {
    const activeConfig = config({ candidateLimit: 2 });
    const current = claim('claim-current', 3, 'Current claim.');
    const first = claim('claim-first', 1, 'First candidate.');
    const second = claim('claim-second', 2, 'Second candidate.');
    const candidates = [first, second];
    const valid = assessment(
      current,
      first,
      1,
      candidates,
      { score: 0.97, decision: 'equivalent' },
      activeConfig,
    );
    const observation: SemanticClaimObservation = {
      projection_version: activeConfig.projection_version,
      config_digest: activeConfig.config_digest,
      claim: current,
      candidate_assessments: [
        { ...valid, candidate_set_digest: digest(['forged']) },
        assessment(
          current,
          second,
          2,
          candidates,
          { score: 0.1, decision: 'distinct' },
          activeConfig,
        ),
      ],
    };

    expect(() => admitSemanticEquivalenceEdge(
      observation,
      first,
      observation.candidate_assessments[0],
      activeConfig,
    )).toThrow(/does not describe the observed candidate set/);
  });

  it('rejects over-budget neighborhoods, invalid scores, and unsafe claim text atomically', () => {
    const activeConfig = config({ candidateLimit: 1 });
    const current = claim('bounded-current', 3, 'Current bounded claim.');
    const first = claim('bounded-first', 1, 'First bounded candidate.');
    const second = claim('bounded-second', 2, 'Second bounded candidate.');
    const candidates = [first, second];
    const overBudget: SemanticClaimObservation = {
      projection_version: activeConfig.projection_version,
      config_digest: activeConfig.config_digest,
      claim: current,
      candidate_assessments: [
        assessment(
          current,
          first,
          1,
          candidates,
          { score: 0.97, decision: 'equivalent' },
          activeConfig,
        ),
        {
          ...assessment(
            current,
            second,
            1,
            candidates,
            { score: 0.96, decision: 'equivalent' },
            activeConfig,
          ),
          candidate_rank: 2,
        },
      ],
    };
    const empty = createEmptySemanticCommunityProjection(NAMESPACE, activeConfig);
    const emptyBytes = canonicalJson(empty);
    expect(() => projectSemanticClaimIncrementally(
      empty,
      overBudget,
      activeConfig,
    )).toThrow(/exceeds the configured bound/);
    expect(canonicalJson(empty)).toBe(emptyBytes);

    const invalidScore = {
      ...overBudget,
      candidate_assessments: [{
        ...overBudget.candidate_assessments[0],
        candidate_set_digest: semanticCandidateSetDigest(
          current.claim_id,
          [first.claim_id],
          'namespace-bounded-fixture',
          '1',
        ),
        score: Number.NaN,
      }],
    };
    expect(() => admitSemanticEquivalenceEdge(
      invalidScore,
      first,
      invalidScore.candidate_assessments[0],
      activeConfig,
    )).toThrow(/finite number/);
    expect(() => claim('malformed-claim', 4, '\ud800')).toThrow(/malformed Unicode/);
    expect(() => claim('oversized-claim', 5, 'x'.repeat(65_537))).toThrow(
      /canonical JSON limit/,
    );
  });
});

describe('semantic fixture quality', () => {
  it('meets declared precision and recall for paraphrases and distinct neighbors', () => {
    const activeConfig = config();
    const claims = [
      claim('retry-a', 1, 'Retries wait longer after each failure.'),
      claim('retry-b', 2, 'Each retry increases the delay.'),
      claim('cache-a', 3, 'Cache entries expire after their time to live.'),
    ];
    const pairs: PairFixtures = {
      [pairKey('retry-a', 'retry-b')]: { score: 0.97, decision: 'equivalent' },
      [pairKey('retry-a', 'cache-a')]: { score: 0.96, decision: 'topical_only' },
    };
    const projection = rebuildSemanticCommunityProjection(
      NAMESPACE,
      observationsFor(claims, pairs, activeConfig),
      activeConfig,
    );
    const report = qualityReport(projection, [pairKey('retry-a', 'retry-b')]);

    expect(report.precision).toBeGreaterThanOrEqual(QUALITY_GATE.precision);
    expect(report.recall).toBeGreaterThanOrEqual(QUALITY_GATE.recall);
    expect(Object.keys(projection.communities)).toHaveLength(2);
    expect(projection.memberships['retry-a'].community_id).toBe(
      projection.memberships['retry-b'].community_id,
    );
    expect(projection.memberships['cache-a'].community_id).not.toBe(
      projection.memberships['retry-a'].community_id,
    );
  });
});

// ───────────────────────────────────────────────────────────────────
// 3. PROJECTION DETERMINISM
// ───────────────────────────────────────────────────────────────────

describe('community projection determinism', () => {
  it('keeps a bridge claim ambiguous unless cross-community cohesion passes', () => {
    const activeConfig = config();
    const claims = [
      claim('alpha-1', 1, 'Alpha requires bounded retries.'),
      claim('alpha-2', 2, 'Alpha retry attempts are capped.'),
      claim('beta-1', 3, 'Beta writes are idempotent.'),
      claim('beta-2', 4, 'Repeated Beta writes have one effect.'),
      claim('bridge', 5, 'Bounded retries and idempotent writes reduce failures.'),
    ];
    const pairs: PairFixtures = {
      [pairKey('alpha-1', 'alpha-2')]: { score: 0.98, decision: 'equivalent' },
      [pairKey('beta-1', 'beta-2')]: { score: 0.98, decision: 'equivalent' },
      [pairKey('bridge', 'alpha-1')]: { score: 0.99, decision: 'equivalent' },
      [pairKey('bridge', 'beta-1')]: { score: 0.99, decision: 'equivalent' },
    };
    const projection = rebuildSemanticCommunityProjection(
      NAMESPACE,
      observationsFor(claims, pairs, activeConfig),
      activeConfig,
    );

    expect(projection.memberships.bridge).toMatchObject({
      status: 'ambiguous',
      community_id: null,
    });
    expect(projection.memberships.bridge.candidate_community_ids).toHaveLength(2);
    expect(Object.keys(projection.communities)).toHaveLength(2);
  });

  it('records merge and split lineage only through explicit cohesion and version changes', () => {
    const guardedConfig = config();
    const permissiveConfig = config({
      modelVersion: '2026-07-21-permissive',
      thresholdPolicyVersion: '2',
      minimumCrossCommunityRatio: 0,
    });
    const reguardedConfig = config({
      modelVersion: '2026-07-21-reguarded',
      thresholdPolicyVersion: '3',
      minimumCrossCommunityRatio: 0.75,
    });
    const claims = [
      claim('lineage-alpha-1', 1, 'Alpha requires bounded retries.'),
      claim('lineage-alpha-2', 2, 'Alpha retry attempts are capped.'),
      claim('lineage-beta-1', 3, 'Beta writes are idempotent.'),
      claim('lineage-beta-2', 4, 'Repeated Beta writes have one effect.'),
      claim('lineage-bridge', 5, 'Bounded retries and idempotent writes reduce failures.'),
    ];
    const pairs: PairFixtures = {
      [pairKey('lineage-alpha-1', 'lineage-alpha-2')]: {
        score: 0.98,
        decision: 'equivalent',
      },
      [pairKey('lineage-beta-1', 'lineage-beta-2')]: {
        score: 0.98,
        decision: 'equivalent',
      },
      [pairKey('lineage-bridge', 'lineage-alpha-1')]: {
        score: 0.99,
        decision: 'equivalent',
      },
      [pairKey('lineage-bridge', 'lineage-beta-1')]: {
        score: 0.99,
        decision: 'equivalent',
      },
    };
    const guarded = rebuildSemanticCommunityProjection(
      NAMESPACE,
      observationsFor(claims, pairs, guardedConfig),
      guardedConfig,
    );
    expect(Object.keys(guarded.communities)).toHaveLength(2);

    const merged = transitionSemanticProjectionVersion(
      createSemanticProjectionHistory(guarded),
      observationsFor(claims, pairs, permissiveConfig),
      permissiveConfig,
    );
    expect(Object.keys(merged.projection.communities)).toHaveLength(1);
    expect(merged.projection.lineage.some((entry) => entry.lineage_kind === 'merge')).toBe(true);

    const split = transitionSemanticProjectionVersion(
      merged.history,
      observationsFor(claims, pairs, reguardedConfig),
      reguardedConfig,
    );
    expect(Object.keys(split.projection.communities)).toHaveLength(2);
    expect(split.projection.memberships['lineage-bridge'].status).toBe('ambiguous');
    expect(split.projection.lineage.filter(
      (entry) => entry.lineage_kind === 'split',
    )).toHaveLength(2);
  });

  it('makes every incremental prefix byte-identical to a full replay of that prefix', () => {
    const activeConfig = config();
    const claims = [
      claim('concept-a1', 1, 'A uses deterministic ordering.'),
      claim('concept-a2', 2, 'A ordering is deterministic.'),
      claim('unrelated', 3, 'B encrypts stored tokens.'),
      claim('concept-a3', 4, 'A produces the same ordering on replay.'),
    ];
    const pairs: PairFixtures = {
      [pairKey('concept-a1', 'concept-a2')]: { score: 0.98, decision: 'equivalent' },
      [pairKey('concept-a1', 'concept-a3')]: { score: 0.97, decision: 'equivalent' },
      [pairKey('concept-a2', 'concept-a3')]: { score: 0.96, decision: 'equivalent' },
    };
    const observations = observationsFor(claims, pairs, activeConfig);
    let incremental = createEmptySemanticCommunityProjection(NAMESPACE, activeConfig);
    observations.forEach((observation, index) => {
      const result = projectSemanticClaimIncrementally(incremental, observation, activeConfig);
      incremental = result.projection;
      const rebuilt = rebuildSemanticCommunityProjection(
        NAMESPACE,
        observations.slice(0, index + 1),
        activeConfig,
      );
      expect(stableProjectionBytes(incremental)).toEqual(stableProjectionBytes(rebuilt));
      if (observation.claim.claim_id === 'concept-a3') {
        expect(result.telemetry.rescanned_claim_ids).toEqual([
          'concept-a1',
          'concept-a2',
          'concept-a3',
        ]);
        expect(result.telemetry.rescanned_claim_ids).not.toContain('unrelated');
      }
    });
  });

  it('keeps bridge-first, bridge-middle, and four other arrival orders byte-identical', () => {
    const activeConfig = config();
    const byId = {
      alpha1: claim('arrival-alpha-1', 1, 'Alpha requires bounded retries.'),
      alpha2: claim('arrival-alpha-2', 2, 'Alpha retry attempts are capped.'),
      beta1: claim('arrival-beta-1', 3, 'Beta writes are idempotent.'),
      beta2: claim('arrival-beta-2', 4, 'Repeated Beta writes have one effect.'),
      bridge: claim(
        'arrival-bridge',
        5,
        'Bounded retries and idempotent writes reduce failures.',
      ),
      distinct: claim('arrival-distinct', 6, 'Tokens are encrypted at rest.'),
    };
    const pairs: PairFixtures = {
      [pairKey('arrival-alpha-1', 'arrival-alpha-2')]: {
        score: 0.98,
        decision: 'equivalent',
      },
      [pairKey('arrival-beta-1', 'arrival-beta-2')]: {
        score: 0.98,
        decision: 'equivalent',
      },
      [pairKey('arrival-bridge', 'arrival-alpha-1')]: {
        score: 0.99,
        decision: 'equivalent',
      },
      [pairKey('arrival-bridge', 'arrival-beta-1')]: {
        score: 0.99,
        decision: 'equivalent',
      },
    };
    const orders: ReadonlyArray<readonly (keyof typeof byId)[]> = [
      ['alpha1', 'alpha2', 'beta1', 'beta2', 'bridge', 'distinct'],
      ['bridge', 'alpha1', 'alpha2', 'beta1', 'beta2', 'distinct'],
      ['alpha1', 'alpha2', 'bridge', 'beta1', 'beta2', 'distinct'],
      ['distinct', 'beta2', 'beta1', 'alpha2', 'alpha1', 'bridge'],
      ['beta1', 'bridge', 'alpha1', 'beta2', 'distinct', 'alpha2'],
      ['alpha2', 'distinct', 'beta2', 'bridge', 'alpha1', 'beta1'],
    ];
    const projections = orders.map((order) => {
      const observations = observationsFor(
        order.map((claimId) => byId[claimId]),
        pairs,
        activeConfig,
      );
      let incremental = createEmptySemanticCommunityProjection(NAMESPACE, activeConfig);
      observations.forEach((observation) => {
        incremental = projectSemanticClaimIncrementally(
          incremental,
          observation,
          activeConfig,
        ).projection;
      });
      const rebuilt = rebuildSemanticCommunityProjection(
        NAMESPACE,
        observations,
        activeConfig,
      );
      expect(stableProjectionBytes(incremental)).toEqual(stableProjectionBytes(rebuilt));
      return incremental;
    });
    const expectedBytes = stableProjectionBytes(projections[0]);
    projections.slice(1).forEach((projection) => {
      expect(stableProjectionBytes(projection)).toEqual(expectedBytes);
    });

    const partition = Object.values(projections[0].communities)
      .map((community) => community.member_claim_ids)
      .sort((left, right) => {
        const leftBytes = canonicalJson(left);
        const rightBytes = canonicalJson(right);
        return leftBytes < rightBytes ? -1 : leftBytes > rightBytes ? 1 : 0;
      });
    expect(partition).toEqual([
      ['arrival-alpha-1', 'arrival-alpha-2'],
      ['arrival-beta-1', 'arrival-beta-2'],
      ['arrival-distinct'],
    ]);
    expect(projections[0].memberships['arrival-bridge']).toMatchObject({
      status: 'ambiguous',
      community_id: null,
    });
    expect(projections[0].memberships['arrival-bridge'].candidate_community_ids)
      .toHaveLength(2);
  });

  it('rejects a re-observed claim without mutating committed projection bytes', () => {
    const activeConfig = config();
    const observation = observationsFor(
      [claim('duplicate-claim', 1, 'Claim identities cannot be reused.')],
      {},
      activeConfig,
    )[0];
    const first = projectSemanticClaimIncrementally(
      createEmptySemanticCommunityProjection(NAMESPACE, activeConfig),
      observation,
      activeConfig,
    ).projection;
    const committedBytes = canonicalJson(first);

    expect(() => projectSemanticClaimIncrementally(first, observation, activeConfig)).toThrow(
      /cannot be observed twice/,
    );
    expect(canonicalJson(first)).toBe(committedBytes);
  });

  it('rejects duplicate candidate ranks after the bounded-count guard', () => {
    const activeConfig = config();
    const first = claim('rank-first', 1, 'First ranked candidate.');
    const second = claim('rank-second', 2, 'Second ranked candidate.');
    const previous = rebuildSemanticCommunityProjection(
      NAMESPACE,
      observationsFor([first, second], {}, activeConfig),
      activeConfig,
    );
    const current = claim('rank-current', 3, 'Current ranked claim.');
    const candidates = [first, second];
    const malformed: SemanticClaimObservation = {
      projection_version: activeConfig.projection_version,
      config_digest: activeConfig.config_digest,
      claim: current,
      candidate_assessments: candidates.map((candidate) => assessment(
        current,
        candidate,
        1,
        candidates,
        { score: 0.1, decision: 'distinct' },
        activeConfig,
      )),
    };
    const committedBytes = canonicalJson(previous);

    expect(() => projectSemanticClaimIncrementally(previous, malformed, activeConfig)).toThrow(
      /complete bounded permutation/,
    );
    expect(canonicalJson(previous)).toBe(committedBytes);
  });

  it('replays verified envelope events to byte-identical typed projection bytes', () => {
    const activeConfig = config();
    const claims = [
      claim('replay-a', 1, 'Replay uses canonical bytes.'),
      claim('replay-b', 2, 'Canonical bytes drive replay.'),
      claim('replay-distinct', 3, 'The UI uses a blue theme.'),
    ];
    const observations = observationsFor(claims, {
      [pairKey('replay-a', 'replay-b')]: { score: 0.98, decision: 'equivalent' },
    }, activeConfig);
    const fixture = replayEvents(observations);
    const first = rebuildSemanticCommunityProjectionFromLedger(
      fixture.events,
      NAMESPACE,
      activeConfig,
      fixture.head,
    );
    const second = rebuildSemanticCommunityProjectionFromLedger(
      fixture.events,
      NAMESPACE,
      activeConfig,
      fixture.head,
    );

    expect(first.digest).toBe(second.digest);
    expect(Buffer.from(first.canonicalBytes)).toEqual(Buffer.from(second.canonicalBytes));
    expect(canonicalJson(first.state.communities)).toBe(canonicalJson(second.state.communities));
    expect(canonicalJson(first.state.memberships)).toBe(canonicalJson(second.state.memberships));
    const replayComponent = semanticCommunityReplayComponentDefinition(activeConfig);
    expect(replayComponent).toMatchObject({
      reducerId: 'semantic-community-projector',
      reducerVersion: activeConfig.projection_version,
      projectionSchemaVersion: 'semantic-community-projection@1',
      requiredReplayInputKeys: ['initial_state', 'semantic_projection_config'],
    });
  });
});

// ───────────────────────────────────────────────────────────────────
// 4. DRIFT, ISOLATION, AND NOVELTY
// ───────────────────────────────────────────────────────────────────

describe('projection versions and namespace isolation', () => {
  it('rejects a reused projection version with a mismatched config digest', () => {
    const activeConfig = config();
    const projection = rebuildSemanticCommunityProjection(
      NAMESPACE,
      observationsFor([
        claim('collision-claim', 1, 'Projection versions bind their configuration.'),
      ], {}, activeConfig),
      activeConfig,
    );
    const history = createSemanticProjectionHistory(projection);
    const historyBytes = canonicalJson(history);
    const collidingConfig = Object.freeze({
      ...activeConfig,
      config_digest: digest({ collision: activeConfig.config_digest }),
    }) as SemanticProjectionConfig;

    expect(() => transitionSemanticProjectionVersion(
      history,
      [],
      collidingConfig,
    )).toThrow(/collision would rewrite historical membership/);
    expect(canonicalJson(history)).toBe(historyBytes);
  });

  it('retains historical membership and rebuilds a changed model into a new version', () => {
    const firstConfig = config();
    const secondConfig = config({
      modelVersion: '2026-07-20',
      equivalenceThreshold: 0.85,
      thresholdPolicyVersion: '2',
    });
    const claims = [
      claim('drift-a', 1, 'A claim survives model drift.'),
      claim('drift-b', 2, 'Model drift preserves the A claim.'),
    ];
    const pairs: PairFixtures = {
      [pairKey('drift-a', 'drift-b')]: { score: 0.97, decision: 'equivalent' },
    };
    const firstProjection = rebuildSemanticCommunityProjection(
      NAMESPACE,
      observationsFor(claims, pairs, firstConfig),
      firstConfig,
    );
    const originalBytes = canonicalJson(firstProjection);
    const transition = transitionSemanticProjectionVersion(
      createSemanticProjectionHistory(firstProjection),
      observationsFor(claims, pairs, secondConfig),
      secondConfig,
    );

    expect(secondConfig.projection_version).not.toBe(firstConfig.projection_version);
    expect(Object.keys(transition.history.versions)).toHaveLength(2);
    expect(canonicalJson(
      transition.history.versions[firstConfig.projection_version],
    )).toBe(originalBytes);
    expect(transition.recomputedClaimIds).toEqual(['drift-a', 'drift-b']);
    expect(transition.projection.lineage.every(
      (entry) => entry.projection_version === secondConfig.projection_version,
    )).toBe(true);
  });

  it('excludes cross-namespace candidates and rejects cross-namespace admission', () => {
    const activeConfig = config();
    const local = claim('namespace-local', 1, 'Namespace-local claim.');
    const foreignNamespace: SemanticNamespaceRecord = {
      spec_folder: 'specs/foreign-semantic-community',
      loop_type: 'research',
      session_id: 'foreign-semantic-community',
    };
    const foreign = claim('namespace-foreign', 2, 'Namespace-local claim.', [], foreignNamespace);
    const candidate = assessment(
      local,
      foreign,
      1,
      [foreign],
      { score: 0.99, decision: 'equivalent' },
      activeConfig,
    );
    const observation: SemanticClaimObservation = {
      projection_version: activeConfig.projection_version,
      config_digest: activeConfig.config_digest,
      claim: local,
      candidate_assessments: [candidate],
    };

    expect(retrieveNamespaceCandidates(local, [foreign], activeConfig)).toEqual([]);
    expect(() => admitSemanticEquivalenceEdge(
      observation,
      foreign,
      candidate,
      activeConfig,
    )).toThrow(/outside the claim namespace/);
  });
});

describe('dual-direction novelty shadow', () => {
  it('deduplicates concept novelty while retaining new evidence and legacy parity', () => {
    const activeConfig = config();
    const claims = [
      claim('novelty-a', 1, 'Writes use idempotency keys.', ['source-old']),
      claim('novelty-b', 2, 'Idempotency keys make repeated writes safe.', ['source-old']),
      claim('novelty-c', 3, 'Repeated writes are safe with idempotency keys.', ['source-new']),
    ];
    const pairs: PairFixtures = {
      [pairKey('novelty-a', 'novelty-b')]: { score: 0.98, decision: 'equivalent' },
      [pairKey('novelty-a', 'novelty-c')]: { score: 0.97, decision: 'equivalent' },
      [pairKey('novelty-b', 'novelty-c')]: { score: 0.96, decision: 'equivalent' },
    };
    const observations = observationsFor(claims, pairs, activeConfig);
    let projection = createEmptySemanticCommunityProjection(NAMESPACE, activeConfig);
    const first = projectSemanticClaimIncrementally(projection, observations[0], activeConfig);
    projection = first.projection;
    const second = projectSemanticClaimIncrementally(projection, observations[1], activeConfig);
    projection = second.projection;
    const third = projectSemanticClaimIncrementally(projection, observations[2], activeConfig);

    expect(first.novelty.concept).toBe('new_community');
    expect(second.novelty).toMatchObject({
      concept: 'existing_community_member',
      evidence: 'no_new_evidence',
      concept_novelty_increment: 0,
      evidence_novelty_increment: 0,
    });
    expect(third.novelty).toMatchObject({
      concept: 'existing_community_member',
      evidence: 'new_evidence',
      concept_novelty_increment: 0,
      evidence_novelty_increment: 1,
    });
    expect(third.novelty.classifications).toEqual([
      'existing_community_member',
      'new_evidence',
    ]);

    const distinctClaim = claim(
      'novelty-distinct',
      4,
      'Encrypted backups use a separate key.',
      ['source-distinct'],
    );
    const distinctObservation = observationsFor(
      [...claims, distinctClaim],
      pairs,
      activeConfig,
    )[3];
    const distinct = projectSemanticClaimIncrementally(
      third.projection,
      distinctObservation,
      activeConfig,
    );
    expect(distinct.novelty).toMatchObject({
      concept: 'new_community',
      evidence: 'new_evidence',
      concept_novelty_increment: 1,
      evidence_novelty_increment: 1,
    });

    const legacyNodes: CoverageNode[] = [
      {
        id: 'finding-old', specFolder: 'legacy', loopType: 'review', sessionId: 'legacy',
        kind: 'FINDING', name: 'old', createdAt: '2026-07-21T07:59:00.000Z',
      },
      {
        id: 'source-new', specFolder: 'legacy', loopType: 'review', sessionId: 'legacy',
        kind: 'SOURCE', name: 'new', createdAt: '2026-07-21T08:01:00.000Z',
      },
    ];
    const legacyEdges: CoverageEdge[] = [{
      id: 'evidence-new', specFolder: 'legacy', loopType: 'review', sessionId: 'legacy',
      sourceId: 'source-new', targetId: 'finding-old', relation: 'EVIDENCE_FOR',
      weight: 1, createdAt: '2026-07-21T08:02:00.000Z',
    }];
    const legacySnapshots: CoverageSnapshot[] = [{
      specFolder: 'legacy', loopType: 'review', sessionId: 'legacy', iteration: 1,
      metrics: {}, nodeCount: 1, edgeCount: 0, createdAt: TIMESTAMP,
    }];
    const legacyExpected = computeGraphNoveltyDelta(
      legacyNodes,
      legacyEdges,
      legacySnapshots,
    );
    const legacyWindowedExpected = computeWindowedGraphNoveltyDelta(
      legacyNodes,
      legacyEdges,
      legacySnapshots,
      1,
    );
    const shadow = computeSemanticNoveltyShadow(third.novelty, {
      nodes: legacyNodes,
      edges: legacyEdges,
      snapshots: legacySnapshots,
      slidingWindowSize: 1,
    });

    expect(shadow.authority).toBe('legacy_coverage_graph');
    expect(shadow.legacy_graph_novelty_delta).toBe(legacyExpected);
    expect(shadow.legacy_windowed_graph_novelty_delta).toBe(legacyWindowedExpected);
    expect(shadow.semantic).toBe(third.novelty);
    expect(semanticCommunityCoverageSnapshot(third.projection, 3).metrics).toMatchObject({
      semantic_shadow_only: true,
      semantic_projection_version: activeConfig.projection_version,
    });
  });
});
