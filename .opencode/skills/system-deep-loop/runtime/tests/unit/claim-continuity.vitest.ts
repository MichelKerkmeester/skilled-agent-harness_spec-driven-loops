// ───────────────────────────────────────────────────────────────────
// MODULE: Claim Continuity Contract Tests
// ───────────────────────────────────────────────────────────────────

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  CLAIM_CONTRADICTION_RECORDED_EVENT,
  CLAIM_CONTINUITY_REDUCER_VERSION,
  CLAIM_CONTINUITY_WRITE_CAPABILITY,
  CLAIM_SUPERSESSION_RECORDED_EVENT,
  ClaimContinuityErrorCodes,
  ClaimContinuityShadowObserver,
  ClaimMatchDecisions,
  applyClaimContinuityEvent,
  claimContinuityEvidenceDigest,
  claimContinuityInitialState,
  claimTextFingerprint,
  compareClaimShadow,
  createClaimContinuityFrontier,
  createClaimContinuityRuntime,
  deriveClaimContinuityReplayFingerprint,
  readClaimContinuityProjection,
  restoreClaimContinuityFrontier,
} from '../../lib/claim-continuity/index.js';
import {
  CONTINUITY_WRITE_CAPABILITY,
  ContinuityIdentityKinds,
  ContinuityModes,
  continuityDigest,
  continuityEvidenceDigest,
  createContinuityFrontier,
  createContinuityIdentityRuntime,
  deriveContinuityReplayFingerprint,
  identityRefFromTokenDigest,
  mintRequestTokenDigest,
  provenanceDigest,
  readContinuityIdentityProjection,
  restoreContinuityFrontier,
} from '../../lib/deep-loop/continuity-identity/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  canonicalBytes,
  prepareEventWrite,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';

import type { TransitionAuthorizationRequest } from '../../lib/authorized-ledger/index.js';
import type {
  ClaimContinuityFrontier,
  ClaimContinuityRuntime,
  ClaimContinuityWriteContext,
  ClaimSemanticCandidate,
  RecordClaimMatchInput,
} from '../../lib/claim-continuity/index.js';
import type {
  ContinuityIdentityRef,
  ContinuityIdentityRuntime,
  ContinuityWriteContext,
} from '../../lib/deep-loop/continuity-identity/index.js';
import type { JsonObject } from '../../lib/event-envelope/index.js';

const FIXED_TIMESTAMP = '2026-07-21T10:00:00.000Z';
const FIXED_AUTHORITY = Object.freeze({ state: 'shadowing' as const, epoch: 1 });
const temporaryRoots: string[] = [];

interface Harness {
  readonly rootDirectory: string;
  readonly identity: ContinuityIdentityRuntime;
  readonly claims: ClaimContinuityRuntime;
  readonly identityContext: () => ContinuityWriteContext;
  readonly claimContext: () => ClaimContinuityWriteContext;
}

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `claim-continuity-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function token(index: number): string {
  return sha256Bytes(canonicalBytes({ claim_fixture_token: index }));
}

function createHarness(
  label: string,
  options: Readonly<{
    rootDirectory?: string;
    beforeClaimCommit?: () => void;
    claimCapability?: string;
  }> = {},
): Harness {
  const rootDirectory = options.rootDirectory ?? temporaryRoot(label);
  const identity = createContinuityIdentityRuntime({
    rootDirectory,
    authorityProvider: () => FIXED_AUTHORITY,
  });
  const claims = createClaimContinuityRuntime({
    rootDirectory,
    authorityProvider: () => FIXED_AUTHORITY,
    faultInjection: options.beforeClaimCommit
      ? { beforeDomainCommit: options.beforeClaimCommit }
      : undefined,
  }, identity);
  return {
    rootDirectory,
    identity,
    claims,
    identityContext: (): ContinuityWriteContext => ({
      timestamp: FIXED_TIMESTAMP,
      producer: { name: 'claim-continuity-tests', version: '1' },
      authorityEpoch: 1,
      correlationId: 'claim-continuity-correlation',
      causationId: null,
      mode: ContinuityModes.RESEARCH,
      actorId: 'claim-continuity-actor',
      capabilityId: CONTINUITY_WRITE_CAPABILITY,
      evidenceDigest: continuityEvidenceDigest({ fixture: 'identity' }),
      policy: identity.policy,
    }),
    claimContext: (): ClaimContinuityWriteContext => ({
      timestamp: FIXED_TIMESTAMP,
      producer: { name: 'claim-continuity-tests', version: '1' },
      authorityEpoch: 1,
      correlationId: 'claim-continuity-correlation',
      causationId: null,
      mode: ContinuityModes.RESEARCH,
      actorId: 'claim-continuity-actor',
      capabilityId: options.claimCapability ?? CLAIM_CONTINUITY_WRITE_CAPABILITY,
      evidenceDigest: claimContinuityEvidenceDigest({ fixture: 'claim' }),
      policy: claims.policy,
    }),
  };
}

function candidate(
  ref: ContinuityIdentityRef,
  namespace: string,
  score: number,
  decision: ClaimSemanticCandidate['semantic_decision'] = 'equivalent',
  consensus = true,
): ClaimSemanticCandidate {
  return {
    claim_ref: ref,
    namespace,
    normalized_fingerprint: token(800),
    similarity_score: score,
    semantic_decision: decision,
    community_id: `community-${ref.id.slice(-12)}`,
    community_projection_version: 'semantic-v1',
    community_consensus: consensus,
    provenance_digest: sha256Bytes(canonicalBytes({ ref: ref.id, score, decision, consensus })),
  };
}

function matchInput(
  harness: Harness,
  input: Readonly<{
    observationId: string;
    text: string;
    namespace?: string;
    aliases?: readonly string[];
    candidates?: readonly ClaimSemanticCandidate[];
    provenance?: Readonly<JsonObject>;
  }>,
): RecordClaimMatchInput {
  const provenance = input.provenance ?? { source: `source-${input.observationId}` };
  return {
    observationId: input.observationId,
    namespace: input.namespace ?? 'research-claims',
    aliases: input.aliases ?? [input.text],
    normalizedFingerprint: claimTextFingerprint(input.text),
    semanticCandidates: input.candidates ?? [],
    policy: {
      policy_version: 'claim-match-v1',
      equivalence_threshold: 0.9,
      ambiguity_floor: 0.65,
    },
    provenanceDigest: provenanceDigest(provenance),
    context: harness.claimContext(),
  };
}

async function createClaim(
  harness: Harness,
  input: Readonly<{
    index: number;
    observationId: string;
    text: string;
    namespace?: string;
    aliases?: readonly string[];
    candidates?: readonly ClaimSemanticCandidate[];
    admit?: boolean;
  }>,
) {
  const provenance = { source: `source-${input.observationId}` };
  const matchRequest = matchInput(harness, { ...input, provenance });
  const match = await harness.claims.service.recordMatch(matchRequest);
  expect(match.value.decision).toBe(ClaimMatchDecisions.MINT);
  const minted = await harness.claims.service.mintClaim({
    matchRecordId: match.value.match_record_id,
    identityMint: {
      mintRequestToken: token(input.index),
      provenance,
      context: harness.identityContext(),
    },
    context: harness.claimContext(),
  });
  const observation = await harness.claims.service.attachObservation({
    claimRef: minted.value.claim_ref,
    matchRecordId: match.value.match_record_id,
    observationId: input.observationId,
    rawText: input.text,
    normalizedFingerprint: matchRequest.normalizedFingerprint,
    aliases: matchRequest.aliases,
    sourceEventId: `source-event-${input.observationId}`,
    provenanceDigest: matchRequest.provenanceDigest,
    context: harness.claimContext(),
  });
  if (input.admit ?? true) {
    await harness.claims.service.recordLifecycle({
      claimRef: minted.value.claim_ref,
      transition: 'admit',
      rationaleRef: `admit-${input.observationId}`,
      context: harness.claimContext(),
    });
  }
  return {
    ref: minted.value.claim_ref,
    match: match.value,
    observation: observation.value,
    matchRequest,
    provenance,
  };
}

async function appendRelationship(
  harness: Harness,
  eventType: string,
  eventId: string,
  payload: JsonObject,
): Promise<void> {
  const identity = await readContinuityIdentityProjection(
    harness.identity.ledger,
    harness.identity.eventRegistry,
  );
  const claims = await readClaimContinuityProjection(
    harness.claims.ledger,
    harness.claims.eventRegistry,
    identity.state,
    identity.digest,
  );
  const context = harness.claimContext();
  const event = prepareEventWrite({
    envelope_version: CURRENT_ENVELOPE_VERSION,
    event_id: eventId,
    event_type: eventType,
    event_version: 1,
    stream_id: harness.claims.ledger.ledgerId,
    stream_sequence: claims.ledgerHead.sequence + 1,
    occurred_at: context.timestamp,
    recorded_at: context.timestamp,
    producer: context.producer,
    authority_epoch: context.authorityEpoch,
    correlation_id: context.correlationId,
    causation_id: context.causationId,
    idempotency_key: eventId,
    payload,
  }, harness.claims.eventRegistry);
  const request: TransitionAuthorizationRequest = {
    requestId: `${eventId}-authorization`,
    mode: context.mode,
    event,
    priorHead: claims.ledgerHead,
    priorStateVersion: CLAIM_CONTINUITY_REDUCER_VERSION,
    priorStateFingerprint: claims.digest,
    actorId: context.actorId,
    capabilityId: context.capabilityId,
    authorityEpoch: context.authorityEpoch,
    policy: context.policy,
    evidenceDigest: context.evidenceDigest,
  };
  const authorization = await harness.claims.gateway.authorize(request);
  if (authorization.verdict !== 'allow') throw new Error(authorization.reasonCode);
  await harness.claims.ledger.appendAuthorized(event, authorization.proof);
}

function relationshipBase(relationshipId: string): JsonObject {
  return {
    relationship_id: relationshipId,
    evidence_refs: [`evidence-${relationshipId}`],
    provenance_refs: [`provenance-${relationshipId}`],
    independence_refs: [`independence-${relationshipId}`],
    detector_version: 'relationship-detector-v1',
    evidence_snapshot_ref: `snapshot-${relationshipId}`,
    relation_action: 'assert',
    retracts_event_id: null,
  };
}

function redigestFrontier(
  frontier: ClaimContinuityFrontier,
  overrides: Readonly<Record<string, unknown>>,
): ClaimContinuityFrontier {
  const { frontier_digest: ignored, ...prior } = frontier;
  void ignored;
  const core = { ...prior, ...overrides };
  return {
    ...core,
    frontier_digest: continuityDigest(core),
  } as unknown as ClaimContinuityFrontier;
}

afterEach(() => {
  while (temporaryRoots.length > 0) {
    const root = temporaryRoots.pop();
    if (root) rmSync(root, { recursive: true, force: true });
  }
});

describe('sole claim key and idempotent minting', () => {
  it('returns the phase-007 claim ID on retry and concurrent exact mint requests', async () => {
    const harness = createHarness('mint-retry');
    const request = matchInput(harness, {
      observationId: 'mint-retry-observation',
      text: 'The verified prefix is deterministic.',
    });
    const match = await harness.claims.service.recordMatch(request);
    const provenance = { source: 'source-mint-retry-observation' };
    const input = {
      matchRecordId: match.value.match_record_id,
      identityMint: {
        mintRequestToken: token(1),
        provenance,
        context: harness.identityContext(),
      },
      context: harness.claimContext(),
    };
    const [left, right] = await Promise.all([
      harness.claims.service.mintClaim(input),
      harness.claims.service.mintClaim(input),
    ]);
    const retry = await harness.claims.service.mintClaim(input);
    expect(left.value.claim_ref).toEqual(right.value.claim_ref);
    expect(retry.value.claim_ref).toEqual(left.value.claim_ref);
    expect(left.value.claim_ref.kind).toBe(ContinuityIdentityKinds.CLAIM);
    expect(Object.keys((await harness.claims.service.readState()).records)).toEqual([
      left.value.claim_ref.id,
    ]);
  });

  it('accepts only the earliest equivalent mint decision and explicitly conflicts the other', async () => {
    const harness = createHarness('equivalent-concurrency');
    const text = 'One fingerprint cannot fragment under concurrent discovery.';
    const first = await harness.claims.service.recordMatch(matchInput(harness, {
      observationId: 'concurrent-one',
      text,
    }));
    const second = await harness.claims.service.recordMatch(matchInput(harness, {
      observationId: 'concurrent-two',
      text,
    }));
    const outcomes = await Promise.allSettled([
      harness.claims.service.mintClaim({
        matchRecordId: first.value.match_record_id,
        identityMint: {
          mintRequestToken: token(2),
          provenance: { source: 'source-concurrent-one' },
          context: harness.identityContext(),
        },
        context: harness.claimContext(),
      }),
      harness.claims.service.mintClaim({
        matchRecordId: second.value.match_record_id,
        identityMint: {
          mintRequestToken: token(3),
          provenance: { source: 'source-concurrent-two' },
          context: harness.identityContext(),
        },
        context: harness.claimContext(),
      }),
    ]);
    expect(outcomes.filter((outcome) => outcome.status === 'fulfilled')).toHaveLength(1);
    expect(outcomes.filter((outcome) => outcome.status === 'rejected')).toHaveLength(1);
    expect(Object.keys((await harness.claims.service.readState()).records)).toHaveLength(1);
  });

  it('rejects wrong-kind and coordinate-like substitutes for the durable key', async () => {
    const harness = createHarness('key-types');
    const session = await harness.identity.service.mintIdentity({
      kind: ContinuityIdentityKinds.MODE_SESSION,
      mintRequestToken: token(4),
      provenance: { source: 'wrong-kind' },
      context: harness.identityContext(),
    });
    for (const invalid of [
      session.value,
      1,
      '/packet/claim',
      FIXED_TIMESTAMP,
      token(5),
      'community-42',
    ]) {
      await expect(harness.claims.service.attachEvidence({
        claimRef: invalid as ContinuityIdentityRef,
        evidenceRef: 'invalid-key-evidence',
        sourceRef: 'invalid-key-source',
        stance: 'support',
        independenceKey: 'invalid-key-independence',
        isDuplicate: false,
        provenanceDigest: token(6),
        context: harness.claimContext(),
      })).rejects.toThrowError();
    }
  });
});

describe('deterministic matching and fail-closed ambiguity', () => {
  it('reuses an exact fingerprint without minting a second claim identity', async () => {
    const harness = createHarness('exact-fingerprint-reuse');
    const text = 'An exact fingerprint resolves to the registered claim.';
    const original = await createClaim(harness, {
      index: 9,
      observationId: 'exact-fingerprint-original',
      text,
    });
    const duplicate = await harness.claims.service.recordMatch(matchInput(harness, {
      observationId: 'exact-fingerprint-duplicate',
      text,
    }));

    expect(duplicate.value).toMatchObject({
      decision: 'reuse',
      reason: 'exact_fingerprint',
      resolved_claim_ref: original.ref,
    });
    expect(Object.keys((await harness.claims.service.readState()).records)).toEqual([
      original.ref.id,
    ]);
    expect(Object.keys((await harness.identity.service.readState()).identities)).toHaveLength(1);
  });

  it('reuses a paraphrase deterministically and mints an explicitly distinct neighbor', async () => {
    const harness = createHarness('paraphrase');
    const original = await createClaim(harness, {
      index: 10,
      observationId: 'original',
      text: 'Authorized ledger replay is deterministic.',
    });
    const paraphraseInput = matchInput(harness, {
      observationId: 'paraphrase',
      text: 'Replaying an authorized ledger yields stable results.',
      candidates: [candidate(original.ref, 'research-claims', 0.96)],
    });
    const forward = await harness.claims.service.recordMatch(paraphraseInput);
    const replayed = await harness.claims.service.recordMatch({
      ...paraphraseInput,
      semanticCandidates: [...paraphraseInput.semanticCandidates].reverse(),
    });
    expect(forward.value).toEqual(replayed.value);
    expect(forward.value.decision).toBe('reuse');
    expect(forward.value.resolved_claim_ref).toEqual(original.ref);
    await harness.claims.service.attachObservation({
      claimRef: original.ref,
      matchRecordId: forward.value.match_record_id,
      observationId: 'paraphrase',
      rawText: paraphraseInput.aliases[0],
      normalizedFingerprint: paraphraseInput.normalizedFingerprint,
      aliases: paraphraseInput.aliases,
      sourceEventId: 'source-event-paraphrase',
      provenanceDigest: paraphraseInput.provenanceDigest,
      context: harness.claimContext(),
    });
    const neighbor = await createClaim(harness, {
      index: 11,
      observationId: 'distinct-neighbor',
      text: 'Ledger compaction is deterministic.',
      candidates: [candidate(original.ref, 'research-claims', 0.94, 'distinct')],
    });
    expect(neighbor.ref.id).not.toBe(original.ref.id);
    expect(Object.keys((await harness.claims.service.readState()).records)).toHaveLength(2);
  });

  it('blocks remint and attachment for multiple, weak, cross-namespace, and disputed matches', async () => {
    const harness = createHarness('ambiguity');
    const first = await createClaim(harness, {
      index: 20,
      observationId: 'ambiguity-first',
      text: 'Claim one.',
    });
    const second = await createClaim(harness, {
      index: 21,
      observationId: 'ambiguity-second',
      text: 'Claim two.',
      candidates: [candidate(first.ref, 'research-claims', 0.95, 'distinct')],
    });
    const cases = [
      matchInput(harness, {
        observationId: 'multiple-candidates',
        text: 'Ambiguous proposition.',
        candidates: [
          candidate(first.ref, 'research-claims', 0.95),
          candidate(second.ref, 'research-claims', 0.96),
        ],
      }),
      matchInput(harness, {
        observationId: 'weak-candidate',
        text: 'Weakly related proposition.',
        candidates: [candidate(first.ref, 'research-claims', 0.75)],
      }),
      matchInput(harness, {
        observationId: 'community-disagreement',
        text: 'Disputed proposition.',
        candidates: [candidate(first.ref, 'research-claims', 0.97, 'equivalent', false)],
      }),
      matchInput(harness, {
        observationId: 'cross-namespace',
        text: 'Claim one.',
        namespace: 'review-claims',
      }),
    ];
    const identityCount = Object.keys((await harness.identity.service.readState()).identities).length;
    for (const [index, request] of cases.entries()) {
      const unresolved = await harness.claims.service.recordMatch(request);
      expect(unresolved.value.decision).toBe('unresolved');
      await expect(harness.claims.service.mintClaim({
        matchRecordId: unresolved.value.match_record_id,
        identityMint: {
          mintRequestToken: token(30 + index),
          provenance: { source: `source-${request.observationId}` },
          context: harness.identityContext(),
        },
        context: harness.claimContext(),
      })).rejects.toMatchObject({ code: ClaimContinuityErrorCodes.UNRESOLVED_MATCH });
      await expect(harness.claims.service.attachObservation({
        claimRef: first.ref,
        matchRecordId: unresolved.value.match_record_id,
        observationId: request.observationId,
        rawText: request.aliases[0],
        normalizedFingerprint: request.normalizedFingerprint,
        aliases: request.aliases,
        sourceEventId: `blocked-${request.observationId}`,
        provenanceDigest: request.provenanceDigest,
        context: harness.claimContext(),
      })).rejects.toMatchObject({ code: ClaimContinuityErrorCodes.UNRESOLVED_MATCH });
    }
    expect(Object.keys((await harness.identity.service.readState()).identities)).toHaveLength(
      identityCount,
    );
    expect((await harness.claims.service.readState()).unresolved_match_ids).toHaveLength(4);
  });
});

describe('append-only lifecycle and epistemic folding', () => {
  it('retains duplicate-source provenance while only independent support changes status', async () => {
    const harness = createHarness('duplicate-source');
    const claim = await createClaim(harness, {
      index: 40,
      observationId: 'duplicate-source-claim',
      text: 'Independent evidence supports this claim.',
    });
    const primary = {
      claimRef: claim.ref,
      evidenceRef: 'evidence-primary',
      sourceRef: 'source-primary',
      stance: 'support',
      independenceKey: 'independence-primary',
      isDuplicate: false,
      provenanceDigest: token(41),
      context: harness.claimContext(),
    } as const;
    const firstWrite = await harness.claims.service.attachEvidence(primary);
    const retry = await harness.claims.service.attachEvidence(primary);
    expect(firstWrite.status).toBe('appended');
    expect(retry.status).toBe('idempotent');
    await harness.claims.service.attachEvidence({
      claimRef: claim.ref,
      evidenceRef: 'evidence-duplicate',
      sourceRef: 'source-primary',
      stance: 'support',
      independenceKey: 'independence-primary',
      isDuplicate: true,
      provenanceDigest: token(42),
      context: harness.claimContext(),
    });
    await expect(harness.claims.service.attachEvidence({
      claimRef: claim.ref,
      evidenceRef: 'evidence-mislabeled',
      sourceRef: 'source-primary',
      stance: 'support',
      independenceKey: 'independence-primary',
      isDuplicate: false,
      provenanceDigest: token(43),
      context: harness.claimContext(),
    })).rejects.toMatchObject({ code: ClaimContinuityErrorCodes.EVENT_CONFLICT });
    const record = (await harness.claims.service.readState()).records[claim.ref.id];
    expect(record.epistemic_status).toBe('supported');
    expect(record.evidence).toHaveLength(2);
    expect(record.evidence[1].is_duplicate).toBe(true);
  });

  it('enforces the proposed-active-retracted transition table with exact retries', async () => {
    const harness = createHarness('lifecycle-table');
    const claim = await createClaim(harness, {
      index: 45,
      observationId: 'lifecycle-table-claim',
      text: 'Lifecycle transitions are explicit.',
      admit: false,
    });
    await expect(harness.claims.service.recordLifecycle({
      claimRef: claim.ref,
      transition: 'retract',
      rationaleRef: 'premature-retraction',
      context: harness.claimContext(),
    })).rejects.toMatchObject({ code: ClaimContinuityErrorCodes.TRANSITION_CONFLICT });
    const admission = {
      claimRef: claim.ref,
      transition: 'admit' as const,
      rationaleRef: 'valid-admission',
      context: harness.claimContext(),
    };
    expect((await harness.claims.service.recordLifecycle(admission)).status).toBe('appended');
    expect((await harness.claims.service.recordLifecycle(admission)).status).toBe('idempotent');
    await expect(harness.claims.service.recordLifecycle({
      ...admission,
      rationaleRef: 'second-admission',
    })).rejects.toMatchObject({ code: ClaimContinuityErrorCodes.TRANSITION_CONFLICT });
    const retraction = {
      claimRef: claim.ref,
      transition: 'retract' as const,
      rationaleRef: 'valid-retraction',
      context: harness.claimContext(),
    };
    expect((await harness.claims.service.recordLifecycle(retraction)).status).toBe('appended');
    expect((await harness.claims.service.recordLifecycle(retraction)).status).toBe('idempotent');
    await expect(harness.claims.service.recordLifecycle({
      ...admission,
      rationaleRef: 'post-retraction-admission',
    })).rejects.toMatchObject({ code: ClaimContinuityErrorCodes.TRANSITION_CONFLICT });
    expect((await harness.claims.service.readState()).records[claim.ref.id].lifecycle)
      .toBe('retracted');
  });

  it('keeps lifecycle and epistemic status orthogonal through contradiction, refutation, and retraction', async () => {
    const harness = createHarness('contradictory-evidence');
    const left = await createClaim(harness, {
      index: 50,
      observationId: 'contradiction-left',
      text: 'The system converged.',
    });
    const right = await createClaim(harness, {
      index: 51,
      observationId: 'contradiction-right',
      text: 'The system did not converge.',
      candidates: [candidate(left.ref, 'research-claims', 0.95, 'distinct')],
    });
    await harness.claims.service.attachEvidence({
      claimRef: left.ref,
      evidenceRef: 'support-left',
      sourceRef: 'source-left',
      stance: 'support',
      independenceKey: 'independent-left',
      isDuplicate: false,
      provenanceDigest: token(52),
      context: harness.claimContext(),
    });
    const [leftRef, rightRef] = [left.ref, right.ref].sort((a, b) => a.id.localeCompare(b.id));
    await appendRelationship(
      harness,
      CLAIM_CONTRADICTION_RECORDED_EVENT,
      'contradiction-asserted',
      {
        ...relationshipBase('contradiction-one'),
        left_claim_id: leftRef,
        right_claim_id: rightRef,
        incompatibility_scope: 'same-run convergence outcome',
        semantic_community_ids: ['community-convergence'],
      },
    );
    let state = await harness.claims.service.readState();
    expect(state.records[left.ref.id]).toMatchObject({
      lifecycle: 'active',
      epistemic_status: 'contested',
    });
    await harness.claims.service.recordAdjudication({
      claimRef: left.ref,
      outcome: 'refuted',
      evidenceRefs: ['support-left'],
      rationaleRef: 'adjudication-left',
      context: harness.claimContext(),
    });
    await harness.claims.service.recordLifecycle({
      claimRef: left.ref,
      transition: 'retract',
      rationaleRef: 'retraction-left',
      context: harness.claimContext(),
    });
    state = await harness.claims.service.readState();
    expect(state.records[left.ref.id]).toMatchObject({
      lifecycle: 'retracted',
      epistemic_status: 'refuted',
    });
    expect(state.records[left.ref.id].evidence).toHaveLength(1);
    expect(state.records[left.ref.id].active_relationship_ids).toEqual(['contradiction-one']);
  });

  it('uses compensating correction events and retains the voided evidence record', async () => {
    const harness = createHarness('correction');
    const claim = await createClaim(harness, {
      index: 60,
      observationId: 'correction-claim',
      text: 'A source initially appeared supportive.',
    });
    const evidence = await harness.claims.service.attachEvidence({
      claimRef: claim.ref,
      evidenceRef: 'corrected-evidence',
      sourceRef: 'corrected-source',
      stance: 'support',
      independenceKey: 'corrected-independence',
      isDuplicate: false,
      provenanceDigest: token(61),
      context: harness.claimContext(),
    });
    expect((await harness.claims.service.readState()).records[claim.ref.id].epistemic_status)
      .toBe('supported');
    await harness.claims.service.recordCorrection({
      claimRef: claim.ref,
      targetEventId: evidence.value.event_id,
      rationaleRef: 'source-was-miscoded',
      context: harness.claimContext(),
    });
    const state = await harness.claims.service.readState();
    const record = state.records[claim.ref.id];
    expect(record.epistemic_status).toBe('unassessed');
    expect(record.evidence).toContainEqual(expect.objectContaining({
      event_id: evidence.value.event_id,
      effective: false,
    }));
    expect(record.corrected_event_ids).toContain(evidence.value.event_id);
    expect(state.event_journal.map((entry) => entry.event_type)).toContain(
      'deep-loop.claim.correction-recorded',
    );
  });

  it('rejects a second correction before append and keeps the ledger healthy', async () => {
    const harness = createHarness('duplicate-correction');
    const claim = await createClaim(harness, {
      index: 62,
      observationId: 'duplicate-correction-claim',
      text: 'A correction must remain replayable.',
    });
    const evidence = await harness.claims.service.attachEvidence({
      claimRef: claim.ref,
      evidenceRef: 'duplicate-correction-evidence',
      sourceRef: 'duplicate-correction-source',
      stance: 'support',
      independenceKey: 'duplicate-correction-independence',
      isDuplicate: false,
      provenanceDigest: token(63),
      context: harness.claimContext(),
    });
    const headBeforeCorrection = await harness.claims.ledger.getVerifiedHead();

    await harness.claims.service.recordCorrection({
      claimRef: claim.ref,
      targetEventId: evidence.value.event_id,
      rationaleRef: 'first-correction-rationale',
      context: harness.claimContext(),
    });
    const headAfterFirstCorrection = await harness.claims.ledger.getVerifiedHead();
    await expect(harness.claims.service.recordCorrection({
      claimRef: claim.ref,
      targetEventId: evidence.value.event_id,
      rationaleRef: 'second-correction-rationale',
      context: harness.claimContext(),
    })).rejects.toMatchObject({ code: ClaimContinuityErrorCodes.EVENT_CONFLICT });
    const headAfterRejectedCorrection = await harness.claims.ledger.getVerifiedHead();

    expect(headAfterFirstCorrection.sequence).toBe(headBeforeCorrection.sequence + 1);
    expect(headAfterRejectedCorrection).toEqual(headAfterFirstCorrection);
    expect((await harness.claims.service.readState()).records[claim.ref.id].corrected_event_ids)
      .toEqual([evidence.value.event_id]);

    const unrelated = await createClaim(harness, {
      index: 64,
      observationId: 'post-correction-unrelated',
      text: 'An unrelated claim remains writable after rejection.',
    });
    expect(unrelated.ref.id).not.toBe(claim.ref.id);
    expect(Object.keys((await harness.claims.service.readState()).records)).toHaveLength(2);
  });

  it('gives a materially different successor a new identity without rewriting its predecessor', async () => {
    const harness = createHarness('supersession');
    const predecessor = await createClaim(harness, {
      index: 70,
      observationId: 'predecessor',
      text: 'The threshold is 0.8.',
    });
    const successor = await createClaim(harness, {
      index: 71,
      observationId: 'successor',
      text: 'The threshold is 0.9 after recalibration.',
      candidates: [candidate(predecessor.ref, 'research-claims', 0.93, 'distinct')],
    });
    await appendRelationship(
      harness,
      CLAIM_SUPERSESSION_RECORDED_EVENT,
      'supersession-asserted',
      {
        ...relationshipBase('supersession-one'),
        predecessor_claim_id: predecessor.ref,
        successor_claim_id: successor.ref,
        replacement_scope: 'calibrated threshold',
        strength_rationale: 'new calibration evidence',
      },
    );
    const state = await harness.claims.service.readState();
    expect(successor.ref.id).not.toBe(predecessor.ref.id);
    expect(state.records[predecessor.ref.id].lifecycle).toBe('superseded');
    expect(state.records[successor.ref.id].lifecycle).toBe('active');
    expect(state.records[predecessor.ref.id].observations[0].raw_text)
      .toBe('The threshold is 0.8.');
    expect(state.relationships['supersession-one']).toMatchObject({
      source_claim_ref: predecessor.ref,
      target_claim_ref: successor.ref,
      active: true,
    });
  });
});

describe('crash retry, replay, resume, and handover', () => {
  it('recovers claim registration after identity mint succeeds and claim append crashes', async () => {
    const rootDirectory = temporaryRoot('crash-retry');
    let shouldCrash = false;
    const crashing = createHarness('unused', {
      rootDirectory,
      beforeClaimCommit: () => {
        if (shouldCrash) throw new Error('simulated claim commit interruption');
      },
    });
    const request = matchInput(crashing, {
      observationId: 'crash-observation',
      text: 'Crash retry preserves claim identity.',
    });
    const match = await crashing.claims.service.recordMatch(request);
    shouldCrash = true;
    const mintInput = {
      matchRecordId: match.value.match_record_id,
      identityMint: {
        mintRequestToken: token(80),
        provenance: { source: 'source-crash-observation' },
        context: crashing.identityContext(),
      },
      context: crashing.claimContext(),
    };
    await expect(crashing.claims.service.mintClaim(mintInput)).rejects.toThrowError();
    shouldCrash = false;
    const recovered = createHarness('unused', { rootDirectory });
    const result = await recovered.claims.service.mintClaim({
      ...mintInput,
      identityMint: { ...mintInput.identityMint, context: recovered.identityContext() },
      context: recovered.claimContext(),
    });
    expect(result.value.claim_ref).toEqual(
      identityRefFromTokenDigest(
        ContinuityIdentityKinds.CLAIM,
        mintRequestTokenDigest(token(80)),
      ),
    );
    expect(Object.keys((await recovered.claims.service.readState()).records)).toEqual([
      result.value.claim_ref.id,
    ]);
  });

  it('produces identical incremental and full replay state and projection hashes', async () => {
    const harness = createHarness('replay');
    const claim = await createClaim(harness, {
      index: 90,
      observationId: 'replay-claim',
      text: 'Incremental folding equals replay.',
    });
    const counterclaim = await createClaim(harness, {
      index: 92,
      observationId: 'replay-counterclaim',
      text: 'Incremental folding differs from replay.',
      candidates: [candidate(claim.ref, 'research-claims', 0.94, 'distinct')],
    });
    await harness.claims.service.attachEvidence({
      claimRef: claim.ref,
      evidenceRef: 'replay-evidence',
      sourceRef: 'replay-source',
      stance: 'qualification',
      independenceKey: 'replay-independence',
      isDuplicate: false,
      provenanceDigest: token(91),
      context: harness.claimContext(),
    });
    const [leftRef, rightRef] = [claim.ref, counterclaim.ref]
      .sort((left, right) => left.id.localeCompare(right.id));
    await appendRelationship(
      harness,
      CLAIM_CONTRADICTION_RECORDED_EVENT,
      'replay-contradiction',
      {
        ...relationshipBase('replay-relationship'),
        left_claim_id: leftRef,
        right_claim_id: rightRef,
        incompatibility_scope: 'replay parity',
        semantic_community_ids: ['community-replay'],
      },
    );
    const identity = await readContinuityIdentityProjection(
      harness.identity.ledger,
      harness.identity.eventRegistry,
    );
    const full = await readClaimContinuityProjection(
      harness.claims.ledger,
      harness.claims.eventRegistry,
      identity.state,
      identity.digest,
    );
    let incremental = claimContinuityInitialState(identity.digest);
    for (const verified of await harness.claims.ledger.readVerifiedEvents()) {
      incremental = applyClaimContinuityEvent(incremental, verified.event, identity.state);
    }
    expect(incremental).toEqual(full.state);
    expect(sha256Bytes(canonicalBytes(incremental))).toBe(full.digest);
    const firstFingerprint = await deriveClaimContinuityReplayFingerprint(
      harness.claims.ledger,
      harness.claims.eventRegistry,
      'claim-replay-run',
      identity.state,
      identity.digest,
    );
    const secondFingerprint = await deriveClaimContinuityReplayFingerprint(
      harness.claims.ledger,
      harness.claims.eventRegistry,
      'claim-replay-run',
      identity.state,
      identity.digest,
    );
    expect(firstFingerprint.descriptor.final_digest).toBe(
      secondFingerprint.descriptor.final_digest,
    );
    expect(firstFingerprint.projection.state).toEqual(full.state);
  });

  async function handoverFixture() {
    const harness = createHarness('handover');
    const claim = await createClaim(harness, {
      index: 100,
      observationId: 'handover-claim',
      text: 'Resume restores the exact claim frontier.',
    });
    const session = await harness.identity.service.mintIdentity({
      kind: ContinuityIdentityKinds.MODE_SESSION,
      mintRequestToken: token(101),
      provenance: { source: 'handover-session' },
      context: harness.identityContext(),
    });
    await harness.identity.service.recordAttempt({
      modeSessionRef: session.value,
      attemptId: 'handover-attempt',
      attemptNumber: 1,
      transition: 'new',
      context: harness.identityContext(),
    });
    const identityFingerprint = await deriveContinuityReplayFingerprint(
      harness.identity.ledger,
      harness.identity.eventRegistry,
      'identity-handover-run',
    );
    const identityFrontier = createContinuityFrontier({
      fingerprint: identityFingerprint,
      modeSessionRef: session.value,
      lineageRefs: [],
      activeClaimRefs: [claim.ref],
      activeCandidateRefs: [],
      attempt: { attempt_id: 'handover-attempt', attempt_number: 1 },
    });
    const restoredIdentity = await restoreContinuityFrontier(
      identityFrontier,
      harness.identity.ledger,
      harness.identity.eventRegistry,
    );
    const claimFingerprint = await deriveClaimContinuityReplayFingerprint(
      harness.claims.ledger,
      harness.claims.eventRegistry,
      'claim-handover-run',
      restoredIdentity.state,
      restoredIdentity.fingerprint.descriptor.projection_digest,
    );
    const frontier = createClaimContinuityFrontier({
      identityFrontier: restoredIdentity,
      fingerprint: claimFingerprint,
    });
    return { harness, claim, session: session.value, restoredIdentity, frontier };
  }

  it('round-trips resume and handover and rejects a stale claim cursor', async () => {
    const fixture = await handoverFixture();
    const restored = await restoreClaimContinuityFrontier(
      JSON.parse(JSON.stringify(fixture.frontier)),
      fixture.restoredIdentity,
      fixture.harness.identity.ledger,
      fixture.harness.identity.eventRegistry,
      fixture.harness.claims.ledger,
      fixture.harness.claims.eventRegistry,
    );
    expect(restored.frontier).toEqual(fixture.frontier);
    expect(restored.state.records[fixture.claim.ref.id].lifecycle).toBe('active');
    await fixture.harness.claims.service.attachEvidence({
      claimRef: fixture.claim.ref,
      evidenceRef: 'post-frontier-evidence',
      sourceRef: 'post-frontier-source',
      stance: 'qualification',
      independenceKey: 'post-frontier-independence',
      isDuplicate: false,
      provenanceDigest: token(102),
      context: fixture.harness.claimContext(),
    });
    await expect(restoreClaimContinuityFrontier(
      fixture.frontier,
      fixture.restoredIdentity,
      fixture.harness.identity.ledger,
      fixture.harness.identity.eventRegistry,
      fixture.harness.claims.ledger,
      fixture.harness.claims.eventRegistry,
    )).rejects.toMatchObject({ code: ClaimContinuityErrorCodes.STALE_FRONTIER });
  });

  it('rejects wrong-kind, missing, and ambiguous active references before new work', async () => {
    const fixture = await handoverFixture();
    const missing = identityRefFromTokenDigest(ContinuityIdentityKinds.CLAIM, token(110));
    const variants = [
      redigestFrontier(fixture.frontier, { active_claim_refs: [fixture.session] }),
      redigestFrontier(fixture.frontier, { active_claim_refs: [missing] }),
      redigestFrontier(fixture.frontier, {
        active_claim_refs: [fixture.claim.ref, fixture.claim.ref],
      }),
    ];
    for (const frontier of variants) {
      await expect(restoreClaimContinuityFrontier(
        frontier,
        fixture.restoredIdentity,
        fixture.harness.identity.ledger,
        fixture.harness.identity.eventRegistry,
        fixture.harness.claims.ledger,
        fixture.harness.claims.eventRegistry,
      )).rejects.toThrowError();
    }
    await fixture.harness.identity.service.mintIdentity({
      kind: ContinuityIdentityKinds.CANDIDATE,
      mintRequestToken: token(111),
      provenance: { source: 'identity-frontier-advanced' },
      context: fixture.harness.identityContext(),
    });
    await expect(restoreClaimContinuityFrontier(
      fixture.frontier,
      fixture.restoredIdentity,
      fixture.harness.identity.ledger,
      fixture.harness.identity.eventRegistry,
      fixture.harness.claims.ledger,
      fixture.harness.claims.eventRegistry,
    )).rejects.toThrowError();
    expect(await fixture.harness.claims.ledger.getVerifiedHead()).toMatchObject({
      sequence: fixture.frontier.claim_ledger_cursor.sequence,
    });
  });
});

describe('dark legacy comparison', () => {
  it('reports divergence while returning the exact authoritative legacy result', async () => {
    const harness = createHarness('shadow');
    const claim = await createClaim(harness, {
      index: 120,
      observationId: 'shadow-claim',
      text: 'Shadow output is non-authoritative.',
    });
    const record = (await harness.claims.service.readState()).records[claim.ref.id];
    const legacySnapshot = {
      legacy_key: 'legacy-finding-7',
      lifecycle: 'open',
      epistemic_status: 'unknown',
    };
    const comparison = compareClaimShadow(legacySnapshot, record);
    expect(comparison.authority).toBe('legacy');
    expect(comparison.divergent_fields).toEqual(['lifecycle', 'epistemic_status']);
    const observer = new ClaimContinuityShadowObserver();
    const legacyResult = { finding: 'unchanged', converged: false };
    expect(observer.observe(legacyResult, legacySnapshot, record)).toBe(legacyResult);
    expect(observer.comparisons()).toEqual([comparison]);
    expect(harness.claims.authority).toBe('legacy');
  });

  it('denies claim events without the isolated dark write capability', async () => {
    const harness = createHarness('denied', { claimCapability: 'legacy-write' });
    await expect(harness.claims.service.recordMatch(matchInput(harness, {
      observationId: 'denied-observation',
      text: 'Unauthorized shadow write.',
    }))).rejects.toMatchObject({ code: ClaimContinuityErrorCodes.AUTHORIZATION_DENIED });
    expect(await harness.claims.ledger.getVerifiedHead()).toMatchObject({ sequence: 0 });
  });
});
