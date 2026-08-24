// ───────────────────────────────────────────────────────────────────
// MODULE: AppendOnlyLedger Single-Writer Read Cache Tests
// ───────────────────────────────────────────────────────────────────
//
// Proves the opt-in, default-off verified-events read cache: with the flag
// on, repeated reads take the cross-process lock once and serve subsequent
// reads from the in-instance memo; the instance's own append invalidates the
// memo so the next read rescans and reflects the new event. With the flag
// off (the default) every read still takes the lock, and a flag-on reader
// stays byte-identical to a lock-per-read reader over the same directory.

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  AppendOnlyLedger,
  TransitionAuthorizationGateway,
  TransitionPolicyRegistry,
} from '../../lib/authorized-ledger/index.js';
import { ImmutableFrameStore } from '../../lib/authorized-ledger/immutable-frame-store.js';
import {
  FIXTURE_AUDIT_LEDGER_ID,
  FIXTURE_AUTHORITY,
  FIXTURE_LEDGER_ID,
  createFixtureEvent,
  createFixtureEventRegistry,
  createFixturePolicyRegistry,
  createFixtureRequest,
} from '../fixtures/authorized-ledger-fixtures.js';
import { appendAuthorizedForTest } from '../fixtures/authorized-ledger-test-helper.js';

import type {
  GatewayAllowProof,
  PolicyEvaluationInput,
} from '../../lib/authorized-ledger/index.js';
import type { EventTypeRegistry, EventWritePreflight } from '../../lib/event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. HARNESS
// ───────────────────────────────────────────────────────────────────

interface Harness {
  readonly rootDirectory: string;
  readonly registry: EventTypeRegistry;
  readonly policies: TransitionPolicyRegistry;
  readonly ledger: AppendOnlyLedger;
  readonly gateway: TransitionAuthorizationGateway;
}

const tempRoots: string[] = [];

function makeRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `ledger-read-cache-${label}-`));
  tempRoots.push(root);
  return root;
}

function pinRequestIdentity(
  context: Readonly<{ evaluationInput: PolicyEvaluationInput }>,
): { actorId: string; capabilityId: string; evidenceDigest: string } {
  return {
    actorId: context.evaluationInput.actorId,
    capabilityId: context.evaluationInput.capabilityId,
    evidenceDigest: context.evaluationInput.evidenceDigest,
  };
}

function buildHarness(rootDirectory: string, singleWriterReadCache: boolean): Harness {
  const registry = createFixtureEventRegistry();
  const policies = createFixturePolicyRegistry();
  const authorityProvider = () => FIXTURE_AUTHORITY;
  const ledger = new AppendOnlyLedger({
    rootDirectory,
    ledgerId: FIXTURE_LEDGER_ID,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider,
    singleWriterReadCache,
  }, registry);
  const gateway = new TransitionAuthorizationGateway({
    rootDirectory,
    auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
    authorityProvider,
    identityResolver: pinRequestIdentity,
  }, ledger, policies);
  return { rootDirectory, registry, policies, ledger, gateway };
}

async function authorize(
  harness: Harness,
  event: EventWritePreflight,
  requestId: string,
): Promise<GatewayAllowProof> {
  const request = await createFixtureRequest(harness.ledger, event, harness.policies, requestId);
  const result = await harness.gateway.authorize(request);
  expect(result.verdict).toBe('allow');
  if (result.verdict !== 'allow') throw new Error(`Expected allow, received ${result.reasonCode}`);
  return result.proof;
}

/**
 * Count cross-process lock acquisitions on the DOMAIN frame store only,
 * filtering out the audit-ledger store the scan also locks. The point is to
 * show the domain read lock is taken once, not N times.
 */
function spyDomainLocks(): { count: () => number; restore: () => void } {
  let n = 0;
  const original = ImmutableFrameStore.prototype.withExclusiveLock;
  const spy = vi.spyOn(ImmutableFrameStore.prototype, 'withExclusiveLock')
    .mockImplementation(function (this: ImmutableFrameStore, operation) {
      if (this.ledgerId === FIXTURE_LEDGER_ID) n += 1;
      return original.call(this, operation);
    });
  return { count: () => n, restore: () => spy.mockRestore() };
}

afterEach(() => {
  while (tempRoots.length > 0) {
    const dir = tempRoots.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

// ───────────────────────────────────────────────────────────────────
// 2. TESTS
// ───────────────────────────────────────────────────────────────────

describe('AppendOnlyLedger single-writer read cache', () => {
  it('serves repeated reads from the memo and rescans after an append (flag on)', async () => {
    const root = makeRoot('hit-invalidate');
    const harness = buildHarness(root, true);
    const locks = spyDomainLocks();
    try {
      // Warm: the first read scans and memoizes.
      await harness.ledger.readVerifiedEvents();
      const warmCount = locks.count();
      expect(warmCount).toBe(1);

      // Repeated reads hit the memo: no further domain lock acquisitions.
      const repeats = 5;
      for (let i = 0; i < repeats; i++) {
        await harness.ledger.readVerifiedEvents();
        await harness.ledger.getVerifiedHead();
      }
      expect(locks.count()).toBe(warmCount);

      // The instance's own append invalidates the memo.
      const event = createFixtureEvent(harness.registry, 1);
      const proof = await authorize(harness, event, 'request-1');
      await appendAuthorizedForTest(harness.ledger, event, proof);

      // The next read must rescan and reflect the newly committed event.
      const events = await harness.ledger.readVerifiedEvents();
      expect(events).toHaveLength(1);
      expect(events[0].event.effective.envelope.event_id).toBe('fixture-event-1');
      expect(locks.count()).toBeGreaterThan(warmCount);
    } finally {
      locks.restore();
    }
  });

  it('flag-on reads stay byte-identical to lock-per-read reads after each append', async () => {
    const root = makeRoot('byte-equality');
    // The flag-on ledger is the sole writer; the flag-off ledger is a
    // parallel reader that always rescans.
    const writer = buildHarness(root, true);
    const readerLedger = new AppendOnlyLedger({
      rootDirectory: root,
      ledgerId: FIXTURE_LEDGER_ID,
      auditLedgerId: FIXTURE_AUDIT_LEDGER_ID,
      authorityProvider: () => FIXTURE_AUTHORITY,
    }, createFixtureEventRegistry());

    async function compare() {
      const onEvents = await writer.ledger.readVerifiedEvents();
      const offEvents = await readerLedger.readVerifiedEvents();
      expect(JSON.stringify(onEvents)).toBe(JSON.stringify(offEvents));
      const onHead = await writer.ledger.getVerifiedHead();
      const offHead = await readerLedger.getVerifiedHead();
      expect(JSON.stringify(onHead)).toBe(JSON.stringify(offHead));
    }

    await compare();

    const event1 = createFixtureEvent(writer.registry, 1);
    const proof1 = await authorize(writer, event1, 'request-1');
    await appendAuthorizedForTest(writer.ledger, event1, proof1);
    await compare();

    const event2 = createFixtureEvent(writer.registry, 2);
    const proof2 = await authorize(writer, event2, 'request-2');
    await appendAuthorizedForTest(writer.ledger, event2, proof2);
    await compare();
  });

  it('takes the domain lock on every read when the flag is unset (default off)', async () => {
    const root = makeRoot('default-off');
    const harness = buildHarness(root, false);
    const locks = spyDomainLocks();
    try {
      const reads = 4;
      for (let i = 0; i < reads; i++) {
        await harness.ledger.readVerifiedEvents();
      }
      expect(locks.count()).toBe(reads);
    } finally {
      locks.restore();
    }
  });
});
