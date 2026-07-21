// ────────────────────────────────────────────────────────────────
// MODULE: Next Focus Tests
// ──────────────────────────────────────────────────────────────

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
} from '../../lib/authorized-ledger/index.js';
import {
  DEFAULT_CANDIDATE_SIMILARITY_THRESHOLD,
  deduplicatePivotCandidates,
  validatePivotCandidate,
} from '../../lib/deep-loop/pivot-candidates.js';
import { canonicalBytes, sha256Bytes } from '../../lib/event-envelope/index.js';
import {
  NEXT_FOCUS_CANDIDATE_SIMILARITY_THRESHOLD,
  NextFocusError,
  NextFocusErrorCodes,
  compareNextFocusShadow,
  compareScoredNextFocusCandidates,
  createNextFocusEventRegistry,
  createNextFocusSourceSnapshot,
  deriveNextFocusCandidates,
  prepareNextFocusEvent,
  recordNextFocusDecision,
  replayNextFocusDecision,
  selectNextFocus,
  validateNextFocusCandidate,
} from '../../lib/next-focus/index.js';
import {
  FIXTURE_AUTHORITY,
  createFixturePolicyRegistry,
} from '../fixtures/authorized-ledger-fixtures.js';

import type {
  GatewayAllowProof,
  TransitionAuthorizationRequest,
} from '../../lib/authorized-ledger/index.js';
import type { EventWritePreflight } from '../../lib/event-envelope/index.js';
import type {
  NextFocusCandidate,
  NextFocusDecision,
  NextFocusDerivationSnapshot,
  NextFocusRegionInput,
  RequiredNextFocusSignal,
  ScoredNextFocusCandidate,
} from '../../lib/next-focus/index.js';

const TIMESTAMP = '2026-07-21T09:00:00.000Z';
const EVIDENCE_IDS = Object.freeze(['evidence-a', 'evidence-b']);
const temporaryRoots: string[] = [];

function signal(bps: number, evidenceIds: readonly string[] = ['evidence-a']): RequiredNextFocusSignal {
  return { applicability: 'required', bps, evidenceIds };
}

function coverageRegion(
  candidateId: string,
  coverageGapBps: number,
  noveltyDecayBps: number,
  focus = `Investigate coverage region ${candidateId}`,
): NextFocusRegionInput {
  return {
    kind: 'coverage_gap',
    candidateId,
    title: `Coverage ${candidateId}`,
    focus,
    relevanceRationale: 'The coverage graph exposes an unanswered region.',
    boundaryRationale: 'The direction remains inside the active research boundary.',
    seatProvenance: ['scout'],
    gap: {
      nodeId: `gap-${candidateId}`,
      kind: 'QUESTION',
      name: `Gap ${candidateId}`,
      reason: 'No incoming answer edge.',
    },
    coverageGap: signal(coverageGapBps),
    noveltyDecay: signal(noveltyDecayBps, ['evidence-b']),
  };
}

function contradictionRegion(
  candidateId: string,
  contradictionUrgencyBps: number,
  noveltyDecayBps: number,
  focus = `Resolve contradiction region ${candidateId}`,
): NextFocusRegionInput {
  return {
    kind: 'open_contradiction',
    candidateId,
    title: `Contradiction ${candidateId}`,
    focus,
    relevanceRationale: 'An unresolved contradiction blocks a stable conclusion.',
    boundaryRationale: 'The disputed relationship is in the active research boundary.',
    seatProvenance: ['skeptic'],
    relationshipId: `contradiction-${candidateId}`,
    contradictionUrgency: signal(contradictionUrgencyBps),
    noveltyDecay: signal(noveltyDecayBps, ['evidence-b']),
  };
}

function communityRegion(
  candidateId: string,
  coverageGapBps: number,
  noveltyDecayBps: number,
): NextFocusRegionInput {
  return {
    kind: 'under_covered_community',
    candidateId,
    title: `Community ${candidateId}`,
    focus: `Expand semantic community ${candidateId}`,
    relevanceRationale: 'A semantic community has insufficient evidence coverage.',
    boundaryRationale: 'The community belongs to the active projection.',
    seatProvenance: ['synthesizer'],
    communityId: `community-${candidateId}`,
    coverageGap: signal(coverageGapBps),
    noveltyDecay: signal(noveltyDecayBps, ['evidence-b']),
  };
}

function derivation(regions: readonly NextFocusRegionInput[]): NextFocusDerivationSnapshot {
  return {
    projectionWatermark: 'projection-watermark-7',
    projectionVersion: 'projection-v3',
    evidenceIds: EVIDENCE_IDS,
    regions,
  };
}

function select(
  regions: readonly NextFocusRegionInput[],
  overrides: Readonly<{
    candidates?: readonly unknown[];
    priorCandidates?: readonly unknown[];
    previousFocus?: string | null;
  }> = {},
): NextFocusDecision {
  const input = derivation(regions);
  return selectNextFocus({
    runId: 'run-next-focus',
    sourceIteration: 12,
    expectedProjectionWatermark: input.projectionWatermark,
    expectedProjectionVersion: input.projectionVersion,
    sourceSnapshot: createNextFocusSourceSnapshot(input),
    candidates: overrides.candidates ?? deriveNextFocusCandidates(input),
    priorCandidates: overrides.priorCandidates,
    previousFocus: overrides.previousFocus ?? 'legacy focus',
  });
}

function scored(
  candidate: NextFocusCandidate,
  values: Readonly<{
    scoreBps: number;
    contradictionUrgencyBps: number;
    coverageGapBps: number;
    noveltyDecayBps: number;
  }>,
): ScoredNextFocusCandidate {
  return { rank: 1, candidate, ...values };
}

interface LedgerHarness {
  readonly rootDirectory: string;
  readonly ledger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
  readonly policies: ReturnType<typeof createFixturePolicyRegistry>;
}

function ledgerHarness(): LedgerHarness {
  const rootDirectory = mkdtempSync(join(tmpdir(), 'next-focus-ledger-'));
  temporaryRoots.push(rootDirectory);
  const registry = createNextFocusEventRegistry();
  const policies = createFixturePolicyRegistry();
  const authorityProvider = () => FIXTURE_AUTHORITY;
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: 'next-focus-shadow',
    auditLedgerId: 'next-focus-shadow-audit',
    authorityProvider,
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: 'next-focus-shadow-audit',
    authorityProvider,
  }, ledger, policies);
  return { rootDirectory, ledger, gateway, policies };
}

function eventFor(
  decision: NextFocusDecision,
  streamSequence = 1,
  recordedAt = TIMESTAMP,
): EventWritePreflight {
  return prepareNextFocusEvent({
    decision,
    streamId: 'next-focus-shadow-stream',
    streamSequence,
    occurredAt: TIMESTAMP,
    recordedAt,
    producer: { name: 'next-focus-tests', version: '1' },
    authorityEpoch: FIXTURE_AUTHORITY.epoch,
    correlationId: 'next-focus-correlation',
    causationId: null,
  }, createNextFocusEventRegistry());
}

async function authorize(
  harness: LedgerHarness,
  event: EventWritePreflight,
): Promise<GatewayAllowProof> {
  const policy = harness.policies.resolve('fixture-capability-policy', 1);
  const request: TransitionAuthorizationRequest = {
    requestId: `authorize-${event.canonicalDigest}`,
    mode: 'research',
    event,
    priorHead: await harness.ledger.getVerifiedHead(),
    priorStateVersion: 'next-focus-shadow@1',
    priorStateFingerprint: sha256Bytes(canonicalBytes({ focus: 'legacy focus' })),
    actorId: 'next-focus-selector',
    capabilityId: 'write',
    authorityEpoch: FIXTURE_AUTHORITY.epoch,
    policy: {
      policyId: policy.policyId,
      policyVersion: policy.policyVersion,
      policyDigest: policy.digest,
    },
    evidenceDigest: sha256Bytes(canonicalBytes(event.envelope.payload)),
  };
  const result = await harness.gateway.authorize(request);
  expect(result.verdict).toBe('allow');
  if (result.verdict !== 'allow') throw new Error(`Authorization denied: ${result.reasonCode}`);
  return result.proof;
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('next-focus candidate derivation and safety', () => {
  it('derives every region kind from one immutable snapshot', () => {
    const candidates = deriveNextFocusCandidates(derivation([
      coverageRegion('a', 7_000, 2_000),
      contradictionRegion('b', 8_000, 3_000),
      communityRegion('c', 6_000, 1_000),
    ]));

    expect(candidates.map((candidate) => candidate.regionKind)).toEqual([
      'coverage_gap',
      'open_contradiction',
      'under_covered_community',
    ]);
    expect(new Set(candidates.map((candidate) => candidate.projectionWatermark)).size).toBe(1);
    expect(new Set(candidates.map((candidate) => candidate.sourceFingerprint)).size).toBe(1);
    expect(candidates.every((candidate) => (
      JSON.stringify(candidate.evidenceRefs) === JSON.stringify(candidates[0].evidenceRefs)
    ))).toBe(true);
    expect(candidates[0].signals.contradictionUrgency).toMatchObject({
      applicability: 'not_applicable',
      bps: 0,
      evidenceIds: [],
    });
    expect(candidates[1].signals.coverageGap).toMatchObject({
      applicability: 'not_applicable',
      bps: 0,
      evidenceIds: [],
    });
    expect(Object.isFrozen(candidates[0])).toBe(true);
    expect(Object.isFrozen(candidates[0].signals)).toBe(true);
  });

  it('preserves the shipped generic validation and deduplication semantics', () => {
    const invalid = { id: '' };
    expect(validateNextFocusCandidate(invalid)).toEqual(validatePivotCandidate(invalid));
    expect(NEXT_FOCUS_CANDIDATE_SIMILARITY_THRESHOLD)
      .toBe(DEFAULT_CANDIDATE_SIMILARITY_THRESHOLD);

    const candidates = deriveNextFocusCandidates(derivation([
      coverageRegion('a', 5_000, 2_000, 'Investigate the identical frontier'),
      communityRegion('b', 5_000, 2_000),
    ]));
    const similar = Object.freeze({
      ...candidates[1],
      title: candidates[0].title,
      focus: candidates[0].focus,
      fingerprint: `${candidates[1].fingerprint}-distinct`,
    });
    const cases = [
      { candidate: similar, code: 'materially_similar' },
      {
        candidate: { ...similar, fingerprint: candidates[0].fingerprint },
        code: 'exact_duplicate',
      },
      { candidate: { ...similar, id: candidates[0].id }, code: 'duplicate_id' },
    ];
    for (const fixture of cases) {
      const ordered = [candidates[0], fixture.candidate];
      const shipped = deduplicatePivotCandidates(ordered, []);
      const decision = select([], { candidates: ordered });
      const shippedCodes = shipped.rejected.flatMap((entry) => (
        entry.rejections.map((rejection) => rejection.code)
      ));
      const nextFocusCodes = decision.rejectedCandidates.flatMap((entry) => (
        entry.rejections.map((rejection) => rejection.code)
      ));
      expect(nextFocusCodes).toEqual(shippedCodes);
      expect(nextFocusCodes).toContain(fixture.code);
    }
  });

  it('rejects mixed projection snapshots instead of reconciling them', () => {
    const input = derivation([coverageRegion('a', 5_000, 2_000)]);
    const candidate = deriveNextFocusCandidates(input)[0];
    const mixed = { ...candidate, projectionWatermark: 'different-watermark' };

    expect(() => select([], { candidates: [mixed] })).toThrowError(
      expect.objectContaining({ code: NextFocusErrorCodes.MIXED_SNAPSHOT }),
    );
  });

  it('errors when required evidence is missing and never fabricates a zero', () => {
    const malformed = {
      ...contradictionRegion('a', 7_000, 2_000),
      contradictionUrgency: undefined,
    } as unknown as NextFocusRegionInput;
    expect(() => deriveNextFocusCandidates(derivation([malformed]))).toThrowError(
      expect.objectContaining({ code: NextFocusErrorCodes.INVALID_SIGNAL }),
    );

    const candidate = deriveNextFocusCandidates(
      derivation([coverageRegion('b', 4_000, 1_000)]),
    )[0];
    const silentZero = {
      ...candidate,
      signals: {
        ...candidate.signals,
        coverageGap: { applicability: 'required', bps: 0, evidenceIds: [] },
      },
    };
    expect(() => select([], { candidates: [silentZero] })).toThrowError(
      expect.objectContaining({ code: NextFocusErrorCodes.INVALID_SIGNAL }),
    );
  });

  it('rejects fractional, non-finite, and out-of-range basis points', () => {
    for (const invalidBps of [-1, 10_001, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(() => deriveNextFocusCandidates(derivation([
        coverageRegion('invalid', invalidBps, 1_000),
      ]))).toThrowError(expect.objectContaining({ code: NextFocusErrorCodes.INVALID_SIGNAL }));
    }
  });

  it('fails closed for every required candidate field family', () => {
    const candidate = deriveNextFocusCandidates(
      derivation([coverageRegion('complete', 5_000, 1_000)]),
    )[0];
    const malformed: readonly unknown[] = [
      { ...candidate, id: '' },
      { ...candidate, regionId: '' },
      { ...candidate, focus: '' },
      { ...candidate, evidenceRefs: [] },
      { ...candidate, boundaryVerdict: { status: 'outside_boundary', rationale: 'outside' } },
      { ...candidate, fingerprint: '' },
      { ...candidate, seatProvenance: [] },
      { ...candidate, projectionWatermark: '' },
      { ...candidate, regionKind: 'unsupported' },
      { ...candidate, signals: { ...candidate.signals, noveltyDecay: undefined } },
    ];
    for (const input of malformed) {
      expect(validateNextFocusCandidate(input).valid).toBe(false);
    }
  });
});

describe('next-focus deterministic scoring and selection', () => {
  it('uses integer basis points and produces byte-stable rankings', () => {
    const regions = [
      coverageRegion('z', 7_500, 2_250),
      contradictionRegion('m', 8_000, 1_500),
      communityRegion('a', 4_500, 500),
    ];
    const forward = select(regions);
    const reverse = select([...regions].reverse());

    expect(forward.outcome).toBe('next_focus_selected');
    expect(forward.rankedFrontier.every((entry) => Number.isInteger(entry.scoreBps))).toBe(true);
    expect(forward.rankedFrontier[0].scoreBps).toBe(
      forward.rankedFrontier[0].coverageGapBps
      + forward.rankedFrontier[0].contradictionUrgencyBps
      + (10_000 - forward.rankedFrontier[0].noveltyDecayBps),
    );
    expect(canonicalBytes(forward)).toEqual(canonicalBytes(reverse));
  });

  it('implements every comparator tier in the declared order', () => {
    const [leftCandidate, rightCandidate] = deriveNextFocusCandidates(derivation([
      coverageRegion('a', 4_000, 2_000),
      coverageRegion('b', 4_000, 2_000),
    ]));
    const base = {
      scoreBps: 10_000,
      contradictionUrgencyBps: 5_000,
      coverageGapBps: 4_000,
      noveltyDecayBps: 2_000,
    };

    expect(compareScoredNextFocusCandidates(
      scored(leftCandidate, { ...base, scoreBps: 10_001 }),
      scored(rightCandidate, base),
    )).toBeLessThan(0);
    expect(compareScoredNextFocusCandidates(
      scored(leftCandidate, { ...base, contradictionUrgencyBps: 5_001 }),
      scored(rightCandidate, base),
    )).toBeLessThan(0);
    expect(compareScoredNextFocusCandidates(
      scored(leftCandidate, { ...base, coverageGapBps: 4_001 }),
      scored(rightCandidate, base),
    )).toBeLessThan(0);
    expect(compareScoredNextFocusCandidates(
      scored(leftCandidate, { ...base, noveltyDecayBps: 1_999 }),
      scored(rightCandidate, base),
    )).toBeLessThan(0);
    expect(compareScoredNextFocusCandidates(
      scored(leftCandidate, base),
      scored(rightCandidate, base),
    )).toBeLessThan(0);
  });

  it('selects the same winner for every input enumeration order', () => {
    const regions = [
      coverageRegion('c', 6_000, 6_000),
      coverageRegion('a', 6_000, 6_000),
      coverageRegion('b', 6_000, 6_000),
    ];
    const permutations = [
      regions,
      [regions[2], regions[0], regions[1]],
      [...regions].reverse(),
    ];
    const decisions = permutations.map((entries) => select(entries));

    expect(decisions.map((decision) => decision.rankedFrontier[0].candidate.id))
      .toEqual(['a', 'a', 'a']);
    expect(new Set(decisions.map((decision) => decision.candidateSetFingerprint)).size).toBe(1);
  });

  it('records unavailability for an empty accepted frontier', () => {
    const decision = select([]);
    expect(decision).toMatchObject({
      outcome: 'next_focus_unavailable',
      unavailableReason: 'empty_accepted_frontier',
      rankedFrontier: [],
      comparatorTrace: [],
    });
    expect('selectedCandidate' in decision).toBe(false);
  });

  it('keeps the legacy focus authoritative in dark comparison output', () => {
    const state = { currentFocus: 'legacy focus' };
    const decision = select([coverageRegion('a', 8_000, 1_000)]);
    const comparison = compareNextFocusShadow(decision, state.currentFocus);

    expect(comparison.authoritativeFocus).toBe('legacy focus');
    expect(comparison.recommendedFocus).toBe('Investigate coverage region a');
    expect(state.currentFocus).toBe('legacy focus');
  });
});

describe('next-focus event recording and replay', () => {
  it('records the complete decision contract in a typed event', () => {
    const decision = select([coverageRegion('a', 8_000, 1_000)]);
    const event = eventFor(decision);

    expect(event.envelope.event_id).toBe(decision.decisionId);
    expect(event.envelope.payload).toMatchObject({
      outcome: 'next_focus_selected',
      policy_version: decision.policyVersion,
      source_projection_watermark: 'projection-watermark-7',
      source_fingerprint: decision.sourceSnapshot.sourceFingerprint,
      candidate_set_fingerprint: decision.candidateSetFingerprint,
    });
    expect(event.envelope.payload.ranked_frontier).toEqual(decision.rankedFrontier);
    expect(event.envelope.payload.comparator_trace).toEqual(decision.comparatorTrace);
  });

  it('accepts semantic retries and fails closed on conflicting identity reuse', async () => {
    const harness = ledgerHarness();
    const decision = select([coverageRegion('a', 8_000, 1_000)]);
    const event = eventFor(decision);
    const proof = await authorize(harness, event);

    const first = await recordNextFocusDecision(harness.ledger, event, proof);
    const retryEvent = eventFor(decision, 9, '2026-07-21T09:00:01.000Z');
    const retry = await recordNextFocusDecision(harness.ledger, retryEvent, proof);
    expect(first.idempotent).toBe(false);
    expect(retry.idempotent).toBe(true);
    expect(retry.receipt.recordHash).toBe(first.receipt.recordHash);
    expect((await harness.ledger.readVerifiedEvents())).toHaveLength(1);

    const changedDecision = select([coverageRegion('a', 1_000, 9_000)]);
    expect(changedDecision.decisionId).toBe(decision.decisionId);
    await expect(recordNextFocusDecision(
      harness.ledger,
      eventFor(changedDecision, 2),
      proof,
    )).rejects.toMatchObject({ code: NextFocusErrorCodes.CONFLICTING_REPLAY });
  });

  it('accepts a recomputed retry when invalid candidates arrive in a different order', async () => {
    const harness = ledgerHarness();
    const [winner, invalidA, invalidB] = deriveNextFocusCandidates(derivation([
      coverageRegion('winner', 8_000, 1_000),
      coverageRegion('invalid-a', 5_000, 2_000),
      coverageRegion('invalid-b', 4_000, 3_000),
    ]));
    const missingRegionId = { ...invalidA, regionId: '' };
    const missingProjectionVersion = { ...invalidB, projectionVersion: '' };
    const firstDecision = select([], {
      candidates: [missingProjectionVersion, winner, missingRegionId],
    });
    const retryDecision = select([], {
      candidates: [missingRegionId, winner, missingProjectionVersion],
    });
    const firstEvent = eventFor(firstDecision);
    const retryEvent = eventFor(retryDecision, 2, '2026-07-21T09:00:01.000Z');

    expect(firstDecision.decisionId).toBe(retryDecision.decisionId);
    expect(firstDecision.rankedFrontier).toEqual(retryDecision.rankedFrontier);
    expect(firstDecision.rejectedCandidates.map((entry) => entry.candidateId))
      .toEqual(['invalid-a', 'invalid-b']);
    expect(canonicalBytes(firstEvent.envelope.payload))
      .toEqual(canonicalBytes(retryEvent.envelope.payload));

    const proof = await authorize(harness, firstEvent);
    const first = await recordNextFocusDecision(harness.ledger, firstEvent, proof);
    const retry = await recordNextFocusDecision(harness.ledger, retryEvent, proof);
    expect(first.idempotent).toBe(false);
    expect(retry.idempotent).toBe(true);
    expect(retry.receipt.recordHash).toBe(first.receipt.recordHash);
    expect((await harness.ledger.readVerifiedEvents())).toHaveLength(1);
  });

  it('restores focus from the stored event instead of a changed live ranking', async () => {
    const harness = ledgerHarness();
    const storedDecision = select([coverageRegion('stored', 9_000, 500)]);
    const event = eventFor(storedDecision);
    const proof = await authorize(harness, event);
    await recordNextFocusDecision(harness.ledger, event, proof);

    const changedLiveDecision = select([coverageRegion('live', 10_000, 0)]);
    expect(changedLiveDecision.rankedFrontier[0].candidate.focus)
      .toBe('Investigate coverage region live');
    const replay = replayNextFocusDecision(
      await harness.ledger.readVerifiedEvents(),
      storedDecision.decisionId,
    );
    expect(replay.restoredFocus).toBe('Investigate coverage region stored');
    expect(replay.decision.candidateSetFingerprint).toBe(storedDecision.candidateSetFingerprint);
  });

  it('replays an unavailable event without inventing a direction', async () => {
    const harness = ledgerHarness();
    const decision = select([]);
    const event = eventFor(decision);
    const proof = await authorize(harness, event);
    await recordNextFocusDecision(harness.ledger, event, proof);

    const replay = replayNextFocusDecision(
      await harness.ledger.readVerifiedEvents(),
      decision.decisionId,
    );
    expect(replay.decision.outcome).toBe('next_focus_unavailable');
    expect(replay.restoredFocus).toBeNull();
  });

  it('rejects candidate-set fingerprint drift during replay', async () => {
    const harness = ledgerHarness();
    const decision = select([coverageRegion('stored', 9_000, 500)]);
    const event = eventFor(decision);
    const proof = await authorize(harness, event);
    await recordNextFocusDecision(harness.ledger, event, proof);
    const verified = (await harness.ledger.readVerifiedEvents())[0];
    const drifted = {
      ...verified,
      event: {
        ...verified.event,
        effective: {
          ...verified.event.effective,
          envelope: {
            ...verified.event.effective.envelope,
            payload: {
              ...verified.event.effective.envelope.payload,
              candidate_set_fingerprint: '0'.repeat(64),
            },
          },
        },
      },
    } as typeof verified;

    expect(() => replayNextFocusDecision([drifted], decision.decisionId)).toThrowError(
      expect.objectContaining({ code: NextFocusErrorCodes.REPLAY_INTEGRITY }),
    );
  });

  it('exposes typed errors for conflicting or corrupted replay evidence', () => {
    const error = new NextFocusError(
      NextFocusErrorCodes.CONFLICTING_REPLAY,
      'conflict',
      { decisionId: 'decision' },
    );
    expect(error).toMatchObject({
      name: 'NextFocusError',
      code: NextFocusErrorCodes.CONFLICTING_REPLAY,
    });
  });
});
