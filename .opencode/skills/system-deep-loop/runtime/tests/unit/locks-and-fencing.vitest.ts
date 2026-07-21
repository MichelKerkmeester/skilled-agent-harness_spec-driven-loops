// ───────────────────────────────────────────────────────────────────
// MODULE: Locks and Fencing Contract Tests
// ───────────────────────────────────────────────────────────────────

import {
  appendFileSync,
  mkdtempSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
} from '../../lib/authorized-ledger/index.js';
import {
  AtomicityDomains,
  FencedLeaseCoordinator,
  FencedLedgerWriter,
  FencedShadowAdapter,
  FencedStateStore,
  LockLifecycleActions,
  LocksAndFencingErrorCodes,
  PROTECTED_WRITE_SURFACE_MANIFEST,
  ProtectedResourceKinds,
  bindReplayIdentity,
  canonicalizeProtectedResource,
  createLockLifecycleEventRegistry,
  initialLockLifecycleProjection,
  lockLifecycleReducerDefinition,
  prepareLockLifecycleEvidence,
  protectedWriteSurfaceManifestDigest,
  readLockLifecycleEvidence,
  recordLockLifecycleEvidence,
  replayIdentityFromFingerprint,
} from '../../lib/locks-and-fencing/index.js';
import {
  FIXTURE_AUDIT_LEDGER_ID,
  FIXTURE_AUTHORITY,
  FIXTURE_LEDGER_ID,
  createFixtureEvent,
  createFixtureEventRegistry,
  createFixturePolicyRegistry,
  createFixtureRequest,
} from '../fixtures/authorized-ledger-fixtures.js';

import type {
  GatewayAllowProof,
  TransitionAuthorizationRequest,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import type { EventWritePreflight, JsonObject } from '../../lib/event-envelope/index.js';
import type {
  FencedLease,
  LockLifecycleDecision,
  ProtectedResourceIdentity,
  ReplayFingerprintSource,
} from '../../lib/locks-and-fencing/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. FIXTURES
// ───────────────────────────────────────────────────────────────────

interface ControlState extends JsonObject {
  readonly status: string;
  readonly dispatchCount: number;
}

interface TestClock {
  readonly now: () => Date;
  advance(durationMs: number): void;
  rewind(durationMs: number): void;
}

interface LedgerHarness {
  readonly ledger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
  readonly policies: TransitionPolicyRegistry;
}

const temporaryRoots: string[] = [];

function temporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `locks-and-fencing-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function createClock(): TestClock {
  let currentMs = Date.now();
  return {
    now: () => new Date(currentMs),
    advance(durationMs: number): void {
      currentMs += durationMs;
    },
    rewind(durationMs: number): void {
      currentMs -= durationMs;
    },
  };
}

function createCoordinator(
  rootDirectory: string,
  clock: TestClock,
  prefix = 'lease',
  faultInjection?: () => void,
): FencedLeaseCoordinator {
  let nextId = 0;
  return new FencedLeaseCoordinator({
    rootDirectory,
    now: clock.now,
    randomId: () => `${prefix}-${++nextId}`,
    retryIntervalMs: 1,
    operationTimeoutMs: 100,
    faultInjection: faultInjection
      ? { afterJournalFsyncBeforeStateCommit: faultInjection }
      : undefined,
  });
}

function ledgerResource(ledgerId = 'lock-evidence-ledger'): ProtectedResourceIdentity {
  return {
    kind: ProtectedResourceKinds.LEDGER,
    components: { ledgerId },
    atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
  };
}

function lineageResource(lineageId: string): ProtectedResourceIdentity {
  return {
    kind: ProtectedResourceKinds.LINEAGE_STATE,
    components: {
      packetId: 'packet-1',
      runId: 'run-1',
      lineageId,
    },
    atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
  };
}

function checkpointResource(lineageId = 'lineage-1'): ProtectedResourceIdentity {
  return {
    kind: ProtectedResourceKinds.WAIT_CHECKPOINT,
    components: {
      packetId: 'packet-1',
      runId: 'run-1',
      lineageId,
      checkpointId: 'wait-1',
    },
    atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
  };
}

function mutableResourceCases(): readonly {
  readonly label: string;
  readonly resource: ProtectedResourceIdentity;
}[] {
  const atomicityDomain = AtomicityDomains.SINGLE_HOST_FILESYSTEM;
  return [
    {
      label: 'projection',
      resource: {
        kind: ProtectedResourceKinds.PROJECTION,
        components: { ledgerId: 'ledger-1', projectionId: 'projection-1' },
        atomicityDomain,
      },
    },
    { label: 'lineage state', resource: lineageResource('lineage-matrix') },
    { label: 'wait checkpoint', resource: checkpointResource('lineage-matrix') },
    {
      label: 'pause and resume',
      resource: {
        kind: ProtectedResourceKinds.PAUSE_RESUME,
        components: { packetId: 'packet-1', runId: 'run-1', lineageId: 'lineage-matrix' },
        atomicityDomain,
      },
    },
    {
      label: 'fan-out status',
      resource: {
        kind: ProtectedResourceKinds.FANOUT_STATUS,
        components: { packetId: 'packet-1', runId: 'run-1', statusStreamId: 'status-1' },
        atomicityDomain,
      },
    },
    {
      label: 'salvage merge',
      resource: {
        kind: ProtectedResourceKinds.MERGE_TARGET,
        components: { packetId: 'packet-1', runId: 'run-1', mergeTargetId: 'merge-1' },
        atomicityDomain,
      },
    },
    {
      label: 'council round',
      resource: {
        kind: ProtectedResourceKinds.COUNCIL_ROUND,
        components: { topicId: 'topic-1', roundId: 'round-1' },
        atomicityDomain,
      },
    },
  ];
}

function acquireRequest(
  resource: ProtectedResourceIdentity,
  ownerId: string,
  overrides: Readonly<{ ttlMs?: number; acquireTimeoutMs?: number; restoredFenceToken?: number }> = {},
): {
  readonly resource: ProtectedResourceIdentity;
  readonly ownerId: string;
  readonly correlationId: string;
  readonly ttlMs: number;
  readonly acquireTimeoutMs: number;
  readonly restoredFenceToken?: number;
} {
  return {
    resource,
    ownerId,
    correlationId: `correlation-${ownerId}`,
    ttlMs: overrides.ttlMs ?? 1_000,
    acquireTimeoutMs: overrides.acquireTimeoutMs ?? 0,
    ...(overrides.restoredFenceToken === undefined
      ? {}
      : { restoredFenceToken: overrides.restoredFenceToken }),
  };
}

function createLedgerHarness(rootDirectory: string): LedgerHarness {
  const registry = createFixtureEventRegistry();
  const policies = createFixturePolicyRegistry();
  const authorityProvider = () => FIXTURE_AUTHORITY;
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: FIXTURE_LEDGER_ID,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider,
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider,
  }, ledger, policies);
  return { ledger, gateway, policies };
}

async function authorize(
  harness: LedgerHarness,
  event: EventWritePreflight,
  requestId: string,
  overrides: Readonly<Partial<TransitionAuthorizationRequest>> = {},
): Promise<GatewayAllowProof> {
  const request = await createFixtureRequest(
    harness.ledger,
    event,
    harness.policies,
    requestId,
    overrides,
  );
  const result = await harness.gateway.authorize(request);
  if (result.verdict !== 'allow') throw new Error(`Expected allow, received ${result.reasonCode}`);
  return result.proof;
}

function replaySource(): ReplayFingerprintSource<ControlState> {
  return {
    descriptor: {
      fingerprint_version: 1,
      ledger_id: 'fixture-domain',
      run_id: 'run-1',
      range_start_sequence: 1,
      range_end_sequence: 2,
      final_digest: 'a'.repeat(64),
    },
  } as unknown as ReplayFingerprintSource<ControlState>;
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

// ───────────────────────────────────────────────────────────────────
// 2. RESOURCE AND LEASE CONTRACTS
// ───────────────────────────────────────────────────────────────────

describe('protected resource registry', () => {
  it('canonicalizes exact identities and rejects aliases, traversal, and unsupported domains', () => {
    const first = canonicalizeProtectedResource(lineageResource('lineage-1'));
    const second = canonicalizeProtectedResource({
      ...lineageResource('lineage-1'),
      components: { lineageId: 'lineage-1', runId: 'run-1', packetId: 'packet-1' },
    });
    expect(second).toEqual(first);
    expect(() => canonicalizeProtectedResource({
      ...lineageResource('lineage-1'),
      components: { packetId: 'packet-1', runId: 'run-1', lineage_id: 'lineage-1' },
    })).toThrow(expect.objectContaining({ code: LocksAndFencingErrorCodes.INVALID_RESOURCE }));
    expect(() => canonicalizeProtectedResource(lineageResource('../lineage-1'))).toThrow(
      expect.objectContaining({ code: LocksAndFencingErrorCodes.INVALID_RESOURCE }),
    );
    expect(() => canonicalizeProtectedResource({
      ...lineageResource('lineage-1'),
      resource_key: 'alias',
    })).toThrow(expect.objectContaining({ code: LocksAndFencingErrorCodes.INVALID_RESOURCE }));
    expect(() => canonicalizeProtectedResource({
      ...lineageResource('lineage-1'),
      atomicityDomain: 'multi-host-consensus',
    })).toThrow(expect.objectContaining({
      code: LocksAndFencingErrorCodes.UNSUPPORTED_ATOMICITY_DOMAIN,
    }));
  });

  it('freezes a unique replacement seam for every inventoried shipped writer', () => {
    const surfaceIds = PROTECTED_WRITE_SURFACE_MANIFEST.map((entry) => entry.surfaceId);
    expect(new Set(surfaceIds).size).toBe(surfaceIds.length);
    expect(surfaceIds).toEqual(expect.arrayContaining([
      'authorized-ledger-append',
      'cli-graph-writer',
      'council-round-state',
      'fanout-salvage-merge',
      'fanout-status-stream',
      'fanout-wait-checkpoint',
      'jsonl-repair-merge',
      'lineage-atomic-state',
      'loop-lock-owner',
      'pause-resume-transition',
    ]));
    expect(protectedWriteSurfaceManifestDigest()).toMatch(/^[a-f0-9]{64}$/u);
    expect(protectedWriteSurfaceManifestDigest()).toBe(protectedWriteSurfaceManifestDigest());
  });
});

describe('durable fencing leases', () => {
  it('admits one concurrent holder and ends contention at a typed bounded timeout', async () => {
    const root = temporaryRoot('winner');
    const clock = createClock();
    const coordinator = createCoordinator(root, clock);
    const resource = lineageResource('lineage-1');
    const results = await Promise.allSettled([
      coordinator.acquire(acquireRequest(resource, 'worker-a')),
      coordinator.acquire(acquireRequest(resource, 'worker-b')),
    ]);
    const grants = results.filter((result) => result.status === 'fulfilled');
    const failures = results.filter((result) => result.status === 'rejected');
    expect(grants).toHaveLength(1);
    expect(failures).toHaveLength(1);
    expect((grants[0] as PromiseFulfilledResult<FencedLease>).value.fenceToken).toBe(1);
    expect((failures[0] as PromiseRejectedResult).reason).toMatchObject({
      code: LocksAndFencingErrorCodes.LOCK_TIMEOUT,
    });
  });

  it('never reuses tokens across release, restart, restore, or rollback attempts', async () => {
    const root = temporaryRoot('monotonic');
    const clock = createClock();
    const resource = lineageResource('lineage-1');
    const firstCoordinator = createCoordinator(root, clock, 'first');
    const first = await firstCoordinator.acquire(acquireRequest(resource, 'worker-a'));
    await firstCoordinator.release(first);

    const restarted = createCoordinator(root, clock, 'restarted');
    const second = await restarted.acquire(acquireRequest(resource, 'worker-b'));
    expect(second.fenceToken).toBe(2);
    await restarted.release(second);
    await expect(restarted.acquire(acquireRequest(resource, 'worker-c', {
      restoredFenceToken: 1,
    }))).rejects.toMatchObject({ code: LocksAndFencingErrorCodes.TOKEN_ROLLBACK });
    const restored = await restarted.acquire(acquireRequest(resource, 'worker-c', {
      restoredFenceToken: 5,
    }));
    expect(restored.fenceToken).toBe(6);
  });

  it('rejects an expired live holder after takeover despite owner reuse or clock rewind', async () => {
    const root = temporaryRoot('takeover');
    const clock = createClock();
    const coordinator = createCoordinator(root, clock);
    const resource = lineageResource('lineage-1');
    const oldLease = await coordinator.acquire(acquireRequest(resource, 'shared-owner', {
      ttlMs: 20,
    }));
    clock.advance(21);
    const successor = await coordinator.acquire(acquireRequest(resource, 'shared-owner'));
    expect(successor.fenceToken).toBe(2);
    await expect(coordinator.withFence(oldLease, () => 'stale')).rejects.toMatchObject({
      code: LocksAndFencingErrorCodes.STALE_FENCE,
    });
    clock.rewind(1_000);
    await expect(coordinator.renew(oldLease, 1_000)).rejects.toMatchObject({
      code: LocksAndFencingErrorCodes.STALE_FENCE,
    });
    await expect(coordinator.release(oldLease)).rejects.toMatchObject({
      code: LocksAndFencingErrorCodes.STALE_FENCE,
    });
    expect((await coordinator.inspect(resource)).activeLease).toMatchObject({
      fenceToken: successor.fenceToken,
      leaseId: successor.leaseId,
    });
  });

  it('treats expiry as lease loss before renewal and requires a newer takeover token', async () => {
    const root = temporaryRoot('renewal-loss');
    const clock = createClock();
    const coordinator = createCoordinator(root, clock);
    const resource = lineageResource('lineage-1');
    const expired = await coordinator.acquire(acquireRequest(resource, 'worker-a', { ttlMs: 5 }));
    clock.advance(6);
    await expect(coordinator.renew(expired, 100)).rejects.toMatchObject({
      code: LocksAndFencingErrorCodes.LEASE_LOST,
    });
    const successor = await coordinator.acquire(acquireRequest(resource, 'worker-b'));
    expect(successor).toMatchObject({ acquisition: 'takeover', fenceToken: 2 });
  });

  it('recovers a journaled grant after a crash boundary without reusing its token', async () => {
    const root = temporaryRoot('crash');
    const clock = createClock();
    const resource = lineageResource('lineage-1');
    let shouldCrash = true;
    const crashing = createCoordinator(root, clock, 'crash', () => {
      if (!shouldCrash) return;
      shouldCrash = false;
      throw new Error('simulated process loss after journal fsync');
    });
    await expect(crashing.acquire(acquireRequest(resource, 'worker-a', {
      ttlMs: 20,
    }))).rejects.toThrow('simulated process loss');

    clock.advance(21);
    const recovered = createCoordinator(root, clock, 'recovered');
    const successor = await recovered.acquire(acquireRequest(resource, 'worker-b'));
    expect(successor.fenceToken).toBe(2);
    expect((await recovered.inspect(resource)).lastFenceToken).toBe(2);
  });

  it('fails closed on malformed journals and token overflow', async () => {
    const root = temporaryRoot('malformed');
    const clock = createClock();
    const coordinator = createCoordinator(root, clock);
    const resource = lineageResource('lineage-1');
    const lease = await coordinator.acquire(acquireRequest(resource, 'worker-a'));
    await coordinator.release(lease);
    appendFileSync(coordinator.storagePaths(resource).journalPath, '{"partial":true}\n', 'utf8');
    await expect(coordinator.inspect(resource)).rejects.toMatchObject({
      code: LocksAndFencingErrorCodes.MALFORMED_STATE,
    });

    const overflowResource = lineageResource('lineage-overflow');
    await expect(coordinator.acquire(acquireRequest(overflowResource, 'worker-b', {
      restoredFenceToken: Number.MAX_SAFE_INTEGER,
    }))).rejects.toMatchObject({ code: LocksAndFencingErrorCodes.FENCE_OVERFLOW });
  });

  it('rejects inverted and re-entrant guards before blocking', async () => {
    const root = temporaryRoot('order');
    const clock = createClock();
    const coordinator = createCoordinator(root, clock);
    const first = await coordinator.acquire(acquireRequest(lineageResource('lineage-a'), 'worker-a'));
    const second = await coordinator.acquire(acquireRequest(lineageResource('lineage-b'), 'worker-b'));
    const ordered = [first, second].sort((left, right) => (
      left.resource.orderKey < right.resource.orderKey ? -1 : 1
    ));
    await expect(coordinator.withFences([...ordered].reverse(), () => undefined)).rejects.toMatchObject({
      code: LocksAndFencingErrorCodes.LOCK_ORDER_VIOLATION,
    });
    await expect(coordinator.withFence(ordered[0], () => (
      coordinator.withFence(ordered[0], () => undefined)
    ))).rejects.toMatchObject({ code: LocksAndFencingErrorCodes.LOCK_ORDER_VIOLATION });
  });

  it('allows distinct lineages to overlap while retaining per-lineage exclusion', async () => {
    const root = temporaryRoot('parallel');
    const clock = createClock();
    const coordinator = createCoordinator(root, clock);
    const first = await coordinator.acquire(acquireRequest(lineageResource('lineage-a'), 'worker-a'));
    const second = await coordinator.acquire(acquireRequest(lineageResource('lineage-b'), 'worker-b'));
    let active = 0;
    let maxActive = 0;
    let releaseGate: () => void = () => undefined;
    let enteredBoth: () => void = () => undefined;
    const gate = new Promise<void>((resolveGate) => { releaseGate = resolveGate; });
    const both = new Promise<void>((resolveBoth) => { enteredBoth = resolveBoth; });
    const run = (lease: FencedLease): Promise<void> => coordinator.withFence(lease, async () => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      if (active === 2) enteredBoth();
      await gate;
      active -= 1;
    });
    const operations = [run(first), run(second)];
    await both;
    releaseGate();
    await Promise.all(operations);
    expect(maxActive).toBe(2);
  });

  it('emits bounded decisions for acquire, timeout, expiry, takeover, renew, reject, and release', async () => {
    const root = temporaryRoot('telemetry');
    const clock = createClock();
    const coordinator = createCoordinator(root, clock);
    const resource = lineageResource('lineage-1');
    const oldLease = await coordinator.acquire(acquireRequest(resource, 'worker-a', { ttlMs: 10 }));
    await expect(coordinator.acquire(acquireRequest(resource, 'worker-b'))).rejects.toMatchObject({
      code: LocksAndFencingErrorCodes.LOCK_TIMEOUT,
    });
    clock.advance(11);
    const successor = await coordinator.acquire(acquireRequest(resource, 'worker-b'));
    const renewed = await coordinator.renew(successor, 100);
    await expect(coordinator.withFence(oldLease, () => undefined)).rejects.toMatchObject({
      code: LocksAndFencingErrorCodes.STALE_FENCE,
    });
    await coordinator.release(renewed);
    const actions = new Set(coordinator.readTelemetry().map((event) => event.action));
    expect(actions).toEqual(new Set(Object.values(LockLifecycleActions)));
  });
});

// ───────────────────────────────────────────────────────────────────
// 3. GUARDED MUTATION CONTRACTS
// ───────────────────────────────────────────────────────────────────

describe('guarded state, fan-out, and resume mutations', () => {
  it('atomically validates fence, state version, continuity identity, and replay identity', async () => {
    const root = temporaryRoot('state');
    const clock = createClock();
    const coordinator = createCoordinator(root, clock);
    const store = new FencedStateStore(root, coordinator);
    const resource = checkpointResource();
    const oldLease = await coordinator.acquire(acquireRequest(resource, 'worker-a', { ttlMs: 10 }));
    const replayIdentity = replayIdentityFromFingerprint(replaySource());
    const first = await store.replace<ControlState>({
      lease: oldLease,
      expectedVersion: 0,
      continuityIdentity: 'continuity-1',
      replayIdentity,
      nextState: { status: 'waiting', dispatchCount: 0 },
    });
    expect(first).toMatchObject({ stateVersion: 1, fenceToken: 1 });
    await expect(store.replace<ControlState>({
      lease: oldLease,
      expectedVersion: 0,
      continuityIdentity: 'continuity-1',
      replayIdentity,
      nextState: { status: 'invalid', dispatchCount: 1 },
    })).rejects.toMatchObject({ code: LocksAndFencingErrorCodes.VERSION_CONFLICT });

    clock.advance(11);
    const successor = await coordinator.acquire(acquireRequest(resource, 'worker-b'));
    await expect(store.replace<ControlState>({
      lease: oldLease,
      expectedVersion: 1,
      continuityIdentity: 'continuity-1',
      replayIdentity,
      nextState: { status: 'stale-resume', dispatchCount: 1 },
    })).rejects.toMatchObject({ code: LocksAndFencingErrorCodes.STALE_FENCE });
    const resumed = await store.replace<ControlState>({
      lease: successor,
      expectedVersion: 1,
      continuityIdentity: 'continuity-1',
      replayIdentity,
      nextState: { status: 'resumed', dispatchCount: 1 },
    });
    expect(resumed).toMatchObject({ priorVersion: 1, stateVersion: 2, fenceToken: 2 });
    expect(store.readVerified<ControlState>(resource)).toMatchObject({
      stateVersion: 2,
      fenceToken: 2,
      state: { status: 'resumed', dispatchCount: 1 },
      replayIdentity: { finalDigest: 'a'.repeat(64) },
    });
  });

  it.each(mutableResourceCases())(
    'rejects stale $label mutations after a successor epoch',
    async ({ label, resource }) => {
      const root = temporaryRoot(label.replaceAll(' ', '-'));
      const clock = createClock();
      const coordinator = createCoordinator(root, clock);
      const store = new FencedStateStore(root, coordinator);
      const oldLease = await coordinator.acquire(acquireRequest(resource, 'worker-a', { ttlMs: 5 }));
      await store.replace<ControlState>({
        lease: oldLease,
        expectedVersion: 0,
        continuityIdentity: 'continuity-matrix',
        nextState: { status: 'owned-by-old-epoch', dispatchCount: 0 },
      });
      clock.advance(6);
      const successor = await coordinator.acquire(acquireRequest(resource, 'worker-b'));
      await expect(store.replace<ControlState>({
        lease: oldLease,
        expectedVersion: 1,
        continuityIdentity: 'continuity-matrix',
        nextState: { status: 'stale-write', dispatchCount: 1 },
      })).rejects.toMatchObject({ code: LocksAndFencingErrorCodes.STALE_FENCE });
      await expect(store.replace<ControlState>({
        lease: successor,
        expectedVersion: 1,
        continuityIdentity: 'continuity-matrix',
        nextState: { status: 'owned-by-successor', dispatchCount: 1 },
      })).resolves.toMatchObject({ stateVersion: 2, fenceToken: 2 });
    },
  );

  it('preserves the exact legacy result when the dark observation fails', async () => {
    const root = temporaryRoot('shadow');
    const clock = createClock();
    const coordinator = createCoordinator(root, clock);
    const lease = await coordinator.acquire(acquireRequest(lineageResource('lineage-1'), 'legacy'));
    const adapter = new FencedShadowAdapter(coordinator, { now: clock.now });
    const legacyResult = Object.freeze({ status: 'legacy-authoritative', exitCode: 0 });
    const returned = await adapter.run(
      lease,
      () => legacyResult,
      () => { throw Object.assign(new Error('dark unavailable'), { code: 'DARK_FAILED' }); },
    );
    expect(returned).toBe(legacyResult);
    expect(adapter.readTelemetry()).toMatchObject([{
      status: 'dark-failed',
      errorCode: 'DARK_FAILED',
      fenceToken: 1,
    }]);
  });
});

describe('fenced authorized ledger append', () => {
  it('admits one expected-head commit and rejects the competing append atomically', async () => {
    const root = temporaryRoot('ledger');
    const clock = createClock();
    const coordinator = createCoordinator(root, clock);
    const harness = createLedgerHarness(root);
    const lease = await coordinator.acquire(acquireRequest(
      ledgerResource(FIXTURE_LEDGER_ID),
      'ledger-writer',
      { ttlMs: 20 },
    ));
    const writer = new FencedLedgerWriter(coordinator);
    const priorHead = await harness.ledger.getVerifiedHead();
    const firstEvent = createFixtureEvent(createFixtureEventRegistry(), 1);
    const secondEvent = createFixtureEvent(createFixtureEventRegistry(), 2);
    const firstProof = await authorize(harness, firstEvent, 'fenced-ledger-first');
    const secondProof = await authorize(harness, secondEvent, 'fenced-ledger-second');
    const appends = await Promise.allSettled([
      writer.append({
        lease,
        ledger: harness.ledger,
        event: firstEvent,
        proof: firstProof,
        expectedHead: priorHead,
      }),
      writer.append({
        lease,
        ledger: harness.ledger,
        event: secondEvent,
        proof: secondProof,
        expectedHead: priorHead,
      }),
    ]);
    expect(appends.filter((result) => result.status === 'fulfilled')).toHaveLength(1);
    expect(appends.filter((result) => result.status === 'rejected')).toHaveLength(1);
    expect((appends.find((result) => result.status === 'rejected') as PromiseRejectedResult).reason)
      .toMatchObject({ code: LocksAndFencingErrorCodes.HEAD_CONFLICT });
    expect(await harness.ledger.getVerifiedHead()).toMatchObject({ sequence: 1 });

    clock.advance(21);
    await coordinator.acquire(acquireRequest(ledgerResource(FIXTURE_LEDGER_ID), 'successor'));
    const thirdEvent = createFixtureEvent(createFixtureEventRegistry(), 3);
    const thirdProof = await authorize(harness, thirdEvent, 'fenced-ledger-stale');
    await expect(writer.append({
      lease,
      ledger: harness.ledger,
      event: thirdEvent,
      proof: thirdProof,
      expectedHead: await harness.ledger.getVerifiedHead(),
    })).rejects.toMatchObject({ code: LocksAndFencingErrorCodes.STALE_FENCE });
    expect(await harness.ledger.getVerifiedHead()).toMatchObject({ sequence: 1 });
  });
});

// ───────────────────────────────────────────────────────────────────
// 4. TYPED LEDGER EVIDENCE
// ───────────────────────────────────────────────────────────────────

describe('lock lifecycle evidence', () => {
  it('writes only through the gateway, reads verified events, and reduces deterministically', async () => {
    const root = temporaryRoot('evidence');
    const clock = createClock();
    const coordinator = createCoordinator(root, clock);
    await coordinator.acquire(acquireRequest(lineageResource('lineage-1'), 'worker-a'));
    const observed = coordinator.readTelemetry()[0] as LockLifecycleDecision;
    const replayIdentity = replayIdentityFromFingerprint(replaySource());
    const decision = bindReplayIdentity(observed, replayIdentity);
    const registry = createLockLifecycleEventRegistry();
    const authorityProvider = () => FIXTURE_AUTHORITY;
    const ledger = new AppendOnlyLedger({
      rootDirectory: root,
      ledgerId: 'lock-evidence-ledger',
      auditLedgerId: 'lock-evidence-audit',
      authorityProvider,
    }, registry);
    const policies = createFixturePolicyRegistry();
    const gateway = new TransitionAuthorizationGateway({
      rootDirectory: root,
      auditLedgerId: 'lock-evidence-audit',
      authorityProvider,
    }, ledger, policies);
    const occurredAt = clock.now().toISOString();
    const event = prepareLockLifecycleEvidence(decision, registry, {
      eventId: 'lock-evidence-1',
      streamId: 'lock-resource-stream',
      streamSequence: 1,
      occurredAt,
      recordedAt: occurredAt,
      producer: { name: 'locks-and-fencing-tests', version: '1' },
      authorityEpoch: 1,
      correlationId: decision.correlationId,
      causationId: null,
      idempotencyKey: 'lock-evidence-idempotency-1',
    });
    const request = await createFixtureRequest(
      ledger,
      event,
      policies,
      'lock-evidence-request-1',
    );
    const receipt = await recordLockLifecycleEvidence(ledger, gateway, event, request);
    expect(receipt.receipt).toMatchObject({ sequence: 1, event_type: 'deep-loop.lock.lifecycle-recorded' });
    const evidence = await readLockLifecycleEvidence(ledger);
    expect(evidence).toMatchObject([{
      sequence: 1,
      payload: {
        action: 'acquired',
        replay_fingerprint: 'a'.repeat(64),
      },
    }]);

    const [verified] = await ledger.readVerifiedEvents();
    const reduced = lockLifecycleReducerDefinition().reduce(
      initialLockLifecycleProjection(),
      verified.event,
    );
    expect(reduced).toMatchObject({
      totalEvents: 1,
      actionCounts: { acquired: 1 },
      latestFenceByResource: { [decision.resourceDigest]: 1 },
    });
  });

  it('fails closed when the gateway denies the evidence capability', async () => {
    const root = temporaryRoot('evidence-denied');
    const clock = createClock();
    const coordinator = createCoordinator(root, clock);
    await coordinator.acquire(acquireRequest(lineageResource('lineage-1'), 'worker-a'));
    const decision = coordinator.readTelemetry()[0] as LockLifecycleDecision;
    const registry = createLockLifecycleEventRegistry();
    const authorityProvider = () => FIXTURE_AUTHORITY;
    const ledger = new AppendOnlyLedger({
      rootDirectory: root,
      ledgerId: 'lock-evidence-ledger',
      auditLedgerId: 'lock-evidence-audit',
      authorityProvider,
    }, registry);
    const policies = createFixturePolicyRegistry();
    const gateway = new TransitionAuthorizationGateway({
      rootDirectory: root,
      auditLedgerId: 'lock-evidence-audit',
      authorityProvider,
    }, ledger, policies);
    const timestamp = clock.now().toISOString();
    const event = prepareLockLifecycleEvidence(decision, registry, {
      eventId: 'lock-evidence-denied-1',
      streamId: 'lock-resource-stream',
      streamSequence: 1,
      occurredAt: timestamp,
      recordedAt: timestamp,
      producer: { name: 'locks-and-fencing-tests', version: '1' },
      authorityEpoch: 1,
      correlationId: decision.correlationId,
      causationId: null,
      idempotencyKey: 'lock-evidence-denied-idempotency-1',
    });
    const request = await createFixtureRequest(
      ledger,
      event,
      policies,
      'lock-evidence-denied-request-1',
      { capabilityId: 'read' },
    );
    await expect(recordLockLifecycleEvidence(ledger, gateway, event, request)).rejects.toMatchObject({
      code: LocksAndFencingErrorCodes.EVIDENCE_DENIED,
    });
    expect(await ledger.getVerifiedHead()).toMatchObject({ sequence: 0 });
  });

  it('rejects malformed lifecycle payloads at the canonical envelope boundary', async () => {
    const root = temporaryRoot('evidence-invalid');
    const clock = createClock();
    const coordinator = createCoordinator(root, clock);
    await coordinator.acquire(acquireRequest(lineageResource('lineage-1'), 'worker-a'));
    const decision = coordinator.readTelemetry()[0] as LockLifecycleDecision;
    const registry = createLockLifecycleEventRegistry();
    expect(() => prepareLockLifecycleEvidence({
      ...decision,
      resourceDigest: 'not-a-digest',
    }, registry, {
      eventId: 'lock-evidence-invalid-1',
      streamId: 'lock-resource-stream',
      streamSequence: 1,
      occurredAt: clock.now().toISOString(),
      recordedAt: clock.now().toISOString(),
      producer: { name: 'locks-and-fencing-tests', version: '1' },
      authorityEpoch: 1,
      correlationId: decision.correlationId,
      causationId: null,
      idempotencyKey: 'lock-evidence-invalid-idempotency-1',
    })).toThrow();
  });
});
