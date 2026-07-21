// ───────────────────────────────────────────────────────────────────
// MODULE: Continuity Identity Contract Tests
// ───────────────────────────────────────────────────────────────────

import {
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  CONTINUITY_IDENTITY_MINTED_EVENT,
  CONTINUITY_WRITE_CAPABILITY,
  ContinuityIdentityErrorCodes,
  ContinuityIdentityKinds,
  ContinuityModes,
  assertIdentityKind,
  continuityDigest,
  continuityEvidenceDigest,
  createContinuityFrontier,
  createContinuityIdentityEventRegistry,
  createContinuityIdentityRuntime,
  deriveContinuityReplayFingerprint,
  identityRefFromTokenDigest,
  legacyAliasDigest,
  mintIdentity as mintIdentityValue,
  mintRequestTokenDigest,
  parseIdentity,
  resolveAlias,
  restoreContinuityFrontier,
  validateAliasNamespace,
  validateIdentityBearingDomainPayload,
  validateIdentityRef,
} from '../../lib/deep-loop/continuity-identity/index.js';
import {
  CURRENT_ENVELOPE_VERSION,
  canonicalBytes,
  prepareEventWrite,
  readEvent,
  sha256Bytes,
} from '../../lib/event-envelope/index.js';

import type {
  ContinuityIdentityFrontier,
  ContinuityIdentityKind,
  ContinuityIdentityRef,
  ContinuityIdentityRuntime,
  ContinuityMode,
  ContinuityWriteContext,
  MintIdentityInput,
} from '../../lib/deep-loop/continuity-identity/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURES
// ───────────────────────────────────────────────────────────────────

const FIXED_TIMESTAMP = '2026-07-21T10:00:00.000Z';
const FIXED_AUTHORITY = Object.freeze({ state: 'shadowing' as const, epoch: 1 });
const temporaryRoots: string[] = [];

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `continuity-identities-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function token(index: number): string {
  return sha256Bytes(canonicalBytes({ fixture_token: index }));
}

function createHarness(
  label = 'case',
  overrides: Readonly<{
    rootDirectory?: string;
    capabilityId?: string;
    beforeDomainCommit?: () => void;
  }> = {},
): {
  readonly runtime: ContinuityIdentityRuntime;
  readonly rootDirectory: string;
  readonly context: (mode?: ContinuityMode) => ContinuityWriteContext;
} {
  const rootDirectory = overrides.rootDirectory ?? temporaryRoot(label);
  const runtime = createContinuityIdentityRuntime({
    rootDirectory,
    authorityProvider: () => FIXED_AUTHORITY,
    faultInjection: overrides.beforeDomainCommit
      ? { beforeDomainCommit: overrides.beforeDomainCommit }
      : undefined,
  });
  return {
    runtime,
    rootDirectory,
    context: (mode = ContinuityModes.RESEARCH): ContinuityWriteContext => ({
      timestamp: FIXED_TIMESTAMP,
      producer: { name: 'continuity-identity-tests', version: '1' },
      authorityEpoch: 1,
      correlationId: 'continuity-fixture-correlation',
      causationId: null,
      mode,
      actorId: 'continuity-fixture-actor',
      capabilityId: overrides.capabilityId ?? CONTINUITY_WRITE_CAPABILITY,
      evidenceDigest: continuityEvidenceDigest({ fixture: 'continuity-evidence' }),
      policy: runtime.policy,
    }),
  };
}

async function mint(
  harness: ReturnType<typeof createHarness>,
  kind: ContinuityIdentityKind,
  index: number,
  overrides: Readonly<Partial<MintIdentityInput>> = {},
): Promise<ContinuityIdentityRef> {
  const result = await harness.runtime.service.mintIdentity({
    kind,
    mintRequestToken: token(index),
    provenance: { source: `fixture-${index}` },
    context: harness.context(),
    ...overrides,
  });
  return result.value;
}

function redigestFrontier(
  frontier: ContinuityIdentityFrontier,
  overrides: Readonly<Record<string, unknown>>,
): ContinuityIdentityFrontier {
  const { frontier_digest: ignored, ...priorCore } = frontier;
  void ignored;
  const core = { ...priorCore, ...overrides };
  return {
    ...core,
    frontier_digest: continuityDigest(core),
  } as unknown as ContinuityIdentityFrontier;
}

afterEach(() => {
  while (temporaryRoots.length > 0) {
    const root = temporaryRoots.pop();
    if (root) rmSync(root, { recursive: true, force: true });
  }
});

// ───────────────────────────────────────────────────────────────────
// 2. IDENTITY SHAPE AND AUTHORIZATION
// ───────────────────────────────────────────────────────────────────

describe('continuity identity shape and authorization', () => {
  it('round-trips every registered kind and rejects malformed or cross-kind refs', () => {
    const kinds = Object.values(ContinuityIdentityKinds);
    for (const [index, kind] of kinds.entries()) {
      const ref = mintIdentityValue(kind, token(index + 1));
      expect(parseIdentity(ref.id)).toEqual(ref);
      expect(validateIdentityRef(ref)).toEqual(ref);
      expect(assertIdentityKind(ref, kind)).toEqual(ref);
    }

    expect(() => parseIdentity('dli.v2.claim.' + 'a'.repeat(64))).toThrowError();
    expect(() => parseIdentity('dli.v1.unknown.' + 'a'.repeat(64))).toThrowError();
    const claim = mintIdentityValue(ContinuityIdentityKinds.CLAIM, token(20));
    expect(() => validateIdentityRef({ ...claim, kind: 'lineage' })).toThrowError();
    expect(() => assertIdentityKind(claim, ContinuityIdentityKinds.LINEAGE)).toThrowError();
  });

  it('rejects non-random-sized mint tokens and path-like alias namespaces', () => {
    expect(() => mintRequestTokenDigest('short')).toThrowError();
    expect(() => validateAliasNamespace('../session')).toThrowError();
    expect(() => validateAliasNamespace('session/id')).toThrowError();
    expect(validateAliasNamespace('legacy-session-id')).toBe('legacy-session-id');
  });

  it('binds payload validators into a stable registry digest and rejects forged mint IDs', () => {
    const first = createContinuityIdentityEventRegistry();
    const second = createContinuityIdentityEventRegistry();
    expect(first.digest).toBe(second.digest);

    const tokenDigest = mintRequestTokenDigest(token(30));
    const wrongRef = identityRefFromTokenDigest(ContinuityIdentityKinds.CLAIM, 'f'.repeat(64));
    expect(() => prepareEventWrite({
      envelope_version: CURRENT_ENVELOPE_VERSION,
      event_id: 'forged-mint',
      event_type: CONTINUITY_IDENTITY_MINTED_EVENT,
      event_version: 1,
      stream_id: 'continuity-identities',
      stream_sequence: 1,
      occurred_at: FIXED_TIMESTAMP,
      recorded_at: FIXED_TIMESTAMP,
      producer: { name: 'continuity-tests', version: '1' },
      authority_epoch: 1,
      correlation_id: 'forged-mint',
      causation_id: null,
      idempotency_key: 'forged-mint',
      payload: {
        identity_ref: wrongRef,
        mint_request_token_digest: tokenDigest,
        provenance_digest: 'a'.repeat(64),
      },
    }, first)).toThrowError();
  });

  it('fails closed when the dark write capability is absent', async () => {
    const harness = createHarness('denied', { capabilityId: 'legacy-write' });
    await expect(harness.runtime.service.mintIdentity({
      kind: ContinuityIdentityKinds.CLAIM,
      mintRequestToken: token(40),
      provenance: { source: 'denied' },
      context: harness.context(),
    })).rejects.toMatchObject({ code: ContinuityIdentityErrorCodes.AUTHORIZATION_DENIED });
    await expect(harness.runtime.ledger.getVerifiedHead()).resolves.toMatchObject({ sequence: 0 });
  });
});

// ───────────────────────────────────────────────────────────────────
// 3. MINTING AND LIFECYCLE
// ───────────────────────────────────────────────────────────────────

describe('idempotent minting and lifecycle distinction', () => {
  it('returns one recorded logical identity on exact retries', async () => {
    const harness = createHarness('retry');
    const input: MintIdentityInput = {
      kind: ContinuityIdentityKinds.LINEAGE,
      mintRequestToken: token(50),
      provenance: { source: 'retry-fixture' },
      context: harness.context(),
    };
    const first = await harness.runtime.service.mintIdentity(input);
    const retry = await harness.runtime.service.mintIdentity(input);

    expect(first.status).toBe('appended');
    expect(retry.status).toBe('idempotent');
    expect(retry.value).toEqual(first.value);
    expect(await harness.runtime.ledger.readVerifiedEvents()).toHaveLength(1);
  });

  it('recovers the same ID after authorization succeeds but domain commit is interrupted', async () => {
    const rootDirectory = temporaryRoot('crash');
    let shouldCrash = true;
    const crashing = createHarness('unused', {
      rootDirectory,
      beforeDomainCommit: () => {
        if (shouldCrash) throw new Error('simulated process interruption');
      },
    });
    const input: MintIdentityInput = {
      kind: ContinuityIdentityKinds.CANDIDATE,
      mintRequestToken: token(60),
      provenance: { source: 'crash-fixture' },
      context: crashing.context(),
    };
    await expect(crashing.runtime.service.mintIdentity(input)).rejects.toThrowError();
    shouldCrash = false;

    const recovered = createHarness('unused', { rootDirectory });
    const result = await recovered.runtime.service.mintIdentity({
      ...input,
      context: recovered.context(),
    });
    expect(result.value).toEqual(mintIdentityValue(ContinuityIdentityKinds.CANDIDATE, token(60)));
    expect(await recovered.runtime.ledger.readVerifiedEvents()).toHaveLength(1);
  });

  it('collapses concurrent exact mint requests to one accepted entity', async () => {
    const harness = createHarness('concurrent');
    const input: MintIdentityInput = {
      kind: ContinuityIdentityKinds.CLAIM,
      mintRequestToken: token(70),
      provenance: { source: 'concurrent-fixture' },
      context: harness.context(),
    };
    const [left, right] = await Promise.all([
      harness.runtime.service.mintIdentity(input),
      harness.runtime.service.mintIdentity(input),
    ]);
    expect(left.value).toEqual(right.value);
    expect(await harness.runtime.ledger.readVerifiedEvents()).toHaveLength(1);
  });

  it('accepts one concurrent provenance and rejects token reuse with another', async () => {
    const harness = createHarness('conflict');
    const base = {
      kind: ContinuityIdentityKinds.CLAIM,
      mintRequestToken: token(80),
      context: harness.context(),
    };
    const outcomes = await Promise.allSettled([
      harness.runtime.service.mintIdentity({ ...base, provenance: { source: 'left' } }),
      harness.runtime.service.mintIdentity({ ...base, provenance: { source: 'right' } }),
    ]);
    expect(outcomes.filter((outcome) => outcome.status === 'fulfilled')).toHaveLength(1);
    expect(outcomes.filter((outcome) => outcome.status === 'rejected')).toHaveLength(1);
    expect(await harness.runtime.ledger.readVerifiedEvents()).toHaveLength(1);
  });

  it('keeps identity independent of reorder, labels, paths, text, timestamps, and hashes', () => {
    const stableToken = token(90);
    const coordinates = [
      {
        order: 1,
        iteration: 1,
        label: 'alpha',
        title: 'first',
        path: '/first',
        text: 'one',
        timestamp: 'old',
        hash: 'a',
      },
      {
        order: 9,
        iteration: 20,
        label: 'renamed',
        title: 'second',
        path: '/second',
        text: 'two',
        timestamp: 'new',
        hash: 'b',
      },
    ];
    const identities = coordinates.map(() => (
      mintIdentityValue(ContinuityIdentityKinds.LINEAGE, stableToken).id
    ));
    expect(new Set(identities)).toEqual(new Set([identities[0]]));
  });

  it('mints a linked child for a true fork without mutating the parent', async () => {
    const harness = createHarness('fork');
    const parent = await mint(harness, ContinuityIdentityKinds.LINEAGE, 100);
    const child = await mint(harness, ContinuityIdentityKinds.LINEAGE, 101, {
      parent: { ref: parent, relationshipKind: 'forked_from' },
    });
    const state = await harness.runtime.service.readState();

    expect(child.id).not.toBe(parent.id);
    expect(state.identities[parent.id]?.ref).toEqual(parent);
    expect(state.relationships).toContainEqual(expect.objectContaining({
      relationship_kind: 'forked_from',
      subject_ref: child,
      related_ref: parent,
    }));

    const restarted = await mint(harness, ContinuityIdentityKinds.LINEAGE, 102, {
      parent: { ref: parent, relationshipKind: 'continues_from' },
    });
    const restartedState = await harness.runtime.service.readState();
    expect(restarted.id).not.toBe(parent.id);
    expect(restartedState.relationships).toContainEqual(expect.objectContaining({
      relationship_kind: 'continues_from',
      subject_ref: restarted,
      related_ref: parent,
    }));

    await expect(harness.runtime.service.mintIdentity({
      kind: ContinuityIdentityKinds.LINEAGE,
      mintRequestToken: token(101),
      provenance: { source: 'fixture-101' },
      parent: { ref: parent, relationshipKind: 'continues_from' },
      context: harness.context(),
    })).rejects.toMatchObject({ code: ContinuityIdentityErrorCodes.TOKEN_CONFLICT });
  });

  it('records retry and resume attempts under one logical mode session', async () => {
    const harness = createHarness('attempt');
    const session = await mint(harness, ContinuityIdentityKinds.MODE_SESSION, 110);
    await harness.runtime.service.recordAttempt({
      modeSessionRef: session,
      attemptId: 'attempt-one',
      attemptNumber: 1,
      transition: 'new',
      context: harness.context(),
    });
    await harness.runtime.service.recordAttempt({
      modeSessionRef: session,
      attemptId: 'attempt-two',
      attemptNumber: 2,
      transition: 'resume',
      context: harness.context(),
    });
    const state = await harness.runtime.service.readState();
    expect(state.attempts[session.id]).toHaveLength(2);
    expect(state.attempts[session.id]?.every((attempt) => (
      attempt.mode_session_ref.id === session.id
    ))).toBe(true);

    await expect(harness.runtime.service.recordAttempt({
      modeSessionRef: session,
      attemptId: 'attempt-four',
      attemptNumber: 4,
      transition: 'retry',
      context: harness.context(),
    })).rejects.toMatchObject({ code: ContinuityIdentityErrorCodes.ATTEMPT_CONFLICT });
  });
});

// ───────────────────────────────────────────────────────────────────
// 4. RESUME, HANDOVER, AND REPLAY
// ───────────────────────────────────────────────────────────────────

describe('resume, handover, and replay', () => {
  async function frontierFixture(label: string) {
    const harness = createHarness(label);
    const session = await mint(harness, ContinuityIdentityKinds.MODE_SESSION, 120);
    const lineage = await mint(harness, ContinuityIdentityKinds.LINEAGE, 121);
    const claim = await mint(harness, ContinuityIdentityKinds.CLAIM, 122);
    const candidate = await mint(harness, ContinuityIdentityKinds.CANDIDATE, 123);
    await harness.runtime.service.recordAttempt({
      modeSessionRef: session,
      attemptId: 'handover-attempt',
      attemptNumber: 1,
      transition: 'new',
      context: harness.context(),
    });
    const fingerprint = await deriveContinuityReplayFingerprint(
      harness.runtime.ledger,
      harness.runtime.eventRegistry,
      'handover-run',
    );
    const frontier = createContinuityFrontier({
      fingerprint,
      modeSessionRef: session,
      lineageRefs: [lineage],
      activeClaimRefs: [claim],
      activeCandidateRefs: [candidate],
      attempt: { attempt_id: 'handover-attempt', attempt_number: 1 },
    });
    return { harness, session, lineage, claim, candidate, fingerprint, frontier };
  }

  it('restores the same typed frontier, cursor, and replay fingerprint', async () => {
    const fixture = await frontierFixture('frontier');
    const restored = await restoreContinuityFrontier(
      JSON.parse(JSON.stringify(fixture.frontier)),
      fixture.harness.runtime.ledger,
      fixture.harness.runtime.eventRegistry,
    );
    expect(restored.frontier).toEqual(fixture.frontier);
    expect(restored.state.identities[fixture.claim.id]?.ref).toEqual(fixture.claim);
    expect(restored.fingerprint.descriptor.final_digest).toBe(
      fixture.fingerprint.descriptor.final_digest,
    );
  });

  it('rejects tampered, missing, and wrong-kind frontier references', async () => {
    const fixture = await frontierFixture('invalid-frontier');
    const tampered = {
      ...fixture.frontier,
      frontier_digest: 'f'.repeat(64),
    };
    await expect(restoreContinuityFrontier(
      tampered,
      fixture.harness.runtime.ledger,
      fixture.harness.runtime.eventRegistry,
    )).rejects.toMatchObject({ code: ContinuityIdentityErrorCodes.INVALID_FRONTIER });

    const missingClaim = mintIdentityValue(ContinuityIdentityKinds.CLAIM, token(124));
    const missing = redigestFrontier(fixture.frontier, { active_claim_refs: [missingClaim] });
    await expect(restoreContinuityFrontier(
      missing,
      fixture.harness.runtime.ledger,
      fixture.harness.runtime.eventRegistry,
    )).rejects.toMatchObject({ code: ContinuityIdentityErrorCodes.UNKNOWN_IDENTITY });

    const wrongKind = redigestFrontier(fixture.frontier, {
      active_claim_refs: [fixture.lineage],
    });
    await expect(restoreContinuityFrontier(
      wrongKind,
      fixture.harness.runtime.ledger,
      fixture.harness.runtime.eventRegistry,
    )).rejects.toMatchObject({ code: ContinuityIdentityErrorCodes.WRONG_KIND });
  });

  it('rejects a stale cursor before dispatch after the ledger advances', async () => {
    const fixture = await frontierFixture('stale-frontier');
    await fixture.harness.runtime.service.bindAlias({
      namespace: 'legacy-claim',
      legacyId: 'claim-after-frontier',
      subjectRef: fixture.claim,
      context: fixture.harness.context(),
    });
    await expect(restoreContinuityFrontier(
      fixture.frontier,
      fixture.harness.runtime.ledger,
      fixture.harness.runtime.eventRegistry,
    )).rejects.toMatchObject({ code: ContinuityIdentityErrorCodes.STALE_FRONTIER });
  });

  it('derives byte-identical state and replay identity from the same authorized prefix', async () => {
    const fixture = await frontierFixture('deterministic-replay');
    const second = await deriveContinuityReplayFingerprint(
      fixture.harness.runtime.ledger,
      fixture.harness.runtime.eventRegistry,
      'handover-run',
    );
    expect(Buffer.from(second.descriptorBytes)).toEqual(Buffer.from(fixture.fingerprint.descriptorBytes));
    expect(second.projection.state).toEqual(fixture.fingerprint.projection.state);
  });

  it('fails explicitly when stored ledger bytes are tampered', async () => {
    const fixture = await frontierFixture('tamper');
    const framePath = join(
      fixture.harness.rootDirectory,
      'continuity-identities',
      'frames',
      '0000000000000001.frame',
    );
    const frame = JSON.parse(readFileSync(framePath, 'utf8')) as Record<string, unknown>;
    frame.canonical_event_hash = 'f'.repeat(64);
    writeFileSync(framePath, `${JSON.stringify(frame)}\n`, 'utf8');
    await expect(deriveContinuityReplayFingerprint(
      fixture.harness.runtime.ledger,
      fixture.harness.runtime.eventRegistry,
      'tampered-run',
    )).rejects.toThrowError();
  });

  it('rejects future event versions at the canonical read boundary', () => {
    const registry = createContinuityIdentityEventRegistry();
    const tokenDigest = mintRequestTokenDigest(token(130));
    const ref = identityRefFromTokenDigest(ContinuityIdentityKinds.CLAIM, tokenDigest);
    const future = {
      envelope_version: CURRENT_ENVELOPE_VERSION,
      event_id: 'future-mint',
      event_type: CONTINUITY_IDENTITY_MINTED_EVENT,
      event_version: 2,
      stream_id: 'continuity-identities',
      stream_sequence: 1,
      occurred_at: FIXED_TIMESTAMP,
      recorded_at: FIXED_TIMESTAMP,
      producer: { name: 'continuity-tests', version: '1' },
      authority_epoch: 1,
      correlation_id: 'future-mint',
      causation_id: null,
      idempotency_key: 'future-mint',
      payload: {
        identity_ref: ref,
        mint_request_token_digest: tokenDigest,
        provenance_digest: 'a'.repeat(64),
      },
    };
    expect(() => readEvent(canonicalBytes(future), registry)).toThrowError();
  });
});

// ───────────────────────────────────────────────────────────────────
// 5. CROSS-MODE AND DARK COMPATIBILITY
// ───────────────────────────────────────────────────────────────────

describe('cross-mode references and dark legacy aliases', () => {
  it('preserves one source claim across every registered mode boundary', async () => {
    const harness = createHarness('cross-mode');
    const claim = await mint(harness, ContinuityIdentityKinds.CLAIM, 140);
    const modes = Object.values(ContinuityModes);
    const sessions: ContinuityIdentityRef[] = [];
    for (const [index, mode] of modes.entries()) {
      sessions.push(await mint(harness, ContinuityIdentityKinds.MODE_SESSION, 141 + index, {
        provenance: { mode },
        context: harness.context(mode),
      }));
    }
    for (let index = 0; index < modes.length - 1; index += 1) {
      await harness.runtime.service.recordCrossModeReference({
        subjectRef: claim,
        sourceModeSessionRef: sessions[index],
        targetModeSessionRef: sessions[index + 1],
        sourceMode: modes[index],
        targetMode: modes[index + 1],
        context: harness.context(modes[index]),
      });
    }
    const state = await harness.runtime.service.readState();
    expect(state.cross_mode_references).toHaveLength(modes.length - 1);
    expect(state.cross_mode_references.every((record) => (
      record.subject_ref.id === claim.id
      && record.subject_ref.kind === ContinuityIdentityKinds.CLAIM
    ))).toBe(true);
  });

  it('records dark aliases through the existing adapter and never changes legacy results', async () => {
    const harness = createHarness('dark-alias');
    const first = await mint(harness, ContinuityIdentityKinds.CLAIM, 150);
    const second = await mint(harness, ContinuityIdentityKinds.CLAIM, 151);
    const session = await mint(harness, ContinuityIdentityKinds.MODE_SESSION, 152);
    const lineage = await mint(harness, ContinuityIdentityKinds.LINEAGE, 153);
    const candidate = await mint(harness, ContinuityIdentityKinds.CANDIDATE, 154);
    const legacyResult = Object.freeze({ status: 'legacy-ok', value: 7 });
    const observed = await harness.runtime.darkObserver.recordAliasAfterLegacy(
      'runtime-observability',
      legacyResult,
      {
        namespace: 'legacy-finding',
        legacyId: 'F-001',
        subjectRef: first,
        context: harness.context(),
      },
    );
    expect(observed).toBe(legacyResult);
    expect(harness.runtime.darkObserver.readTelemetry().at(-1)?.status).toBe('appended');

    const legacySources = [
      { namespace: 'legacy-session-id', legacyId: 'session-001', subjectRef: session },
      { namespace: 'legacy-lineage-label', legacyId: 'minority-lineage', subjectRef: lineage },
      { namespace: 'legacy-graph-node-id', legacyId: 'graph-node-001', subjectRef: first },
      { namespace: 'legacy-candidate-id', legacyId: 'candidate-001', subjectRef: candidate },
      { namespace: 'legacy-continuity-text', legacyId: 'What remains?', subjectRef: first },
    ] as const;
    for (const source of legacySources) {
      await expect(harness.runtime.darkObserver.recordAliasAfterLegacy(
        'runtime-observability',
        legacyResult,
        { ...source, context: harness.context() },
      )).resolves.toBe(legacyResult);
    }
    const state = await harness.runtime.service.readState();
    expect(resolveAlias(state, 'legacy-finding', 'F-001')).toEqual(first);
    for (const source of legacySources) {
      expect(resolveAlias(state, source.namespace, source.legacyId)).toEqual(source.subjectRef);
    }

    const collisionResult = await harness.runtime.darkObserver.recordAliasAfterLegacy(
      'runtime-observability',
      legacyResult,
      {
        namespace: 'legacy-finding',
        legacyId: 'F-001',
        subjectRef: second,
        context: harness.context(),
      },
    );
    expect(collisionResult).toBe(legacyResult);
    expect(harness.runtime.darkObserver.readTelemetry().at(-1)).toMatchObject({
      status: 'rejected',
      errorCode: ContinuityIdentityErrorCodes.ALIAS_AMBIGUOUS,
    });
    expect(legacyAliasDigest('legacy-finding', 'F-001')).toMatch(/^[a-f0-9]{64}$/);
  });

  it('validates downstream typed subjects without cloning or mode-local rewriting', async () => {
    const harness = createHarness('downstream');
    const session = await mint(harness, ContinuityIdentityKinds.MODE_SESSION, 160);
    const lineage = await mint(harness, ContinuityIdentityKinds.LINEAGE, 161);
    const claim = await mint(harness, ContinuityIdentityKinds.CLAIM, 162);
    const state = await harness.runtime.service.readState();
    const refs = validateIdentityBearingDomainPayload({
      subject_ref: claim,
      lineage_ref: lineage,
      mode_session_ref: session,
    }, state);
    expect(refs.map((ref) => ref.id)).toEqual([claim.id, lineage.id, session.id]);

    const missing = mintIdentityValue(ContinuityIdentityKinds.CLAIM, token(163));
    expect(() => validateIdentityBearingDomainPayload({ subject_ref: missing }, state))
      .toThrowError();
  });
});
