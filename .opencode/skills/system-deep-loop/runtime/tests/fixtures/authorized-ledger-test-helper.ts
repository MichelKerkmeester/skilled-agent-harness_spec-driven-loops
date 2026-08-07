// ───────────────────────────────────────────────────────────────────
// MODULE: Authorized Ledger Test Helper
// ───────────────────────────────────────────────────────────────────

import {
  AtomicityDomains,
  FencedLeaseCoordinator,
  FencedLedgerWriter,
  ProtectedResourceKinds,
  canonicalizeProtectedResource,
} from '../../lib/locks-and-fencing/index.js';

import type {
  AppendOnlyLedger,
  DurableAppendReceipt,
  GatewayAllowProof,
} from '../../lib/authorized-ledger/index.js';
import type { EventWritePreflight } from '../../lib/event-envelope/index.js';
import type { FencedLease } from '../../lib/locks-and-fencing/index.js';

function ledgerResource(ledger: AppendOnlyLedger): ReturnType<typeof canonicalizeProtectedResource> {
  return canonicalizeProtectedResource({
    kind: ProtectedResourceKinds.LEDGER,
    atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
    components: { ledgerId: ledger.ledgerId },
  });
}

/** Acquire the ledger fence and append through the gateway-only guarded writer. */
export async function appendAuthorizedForTest(
  ledger: AppendOnlyLedger,
  event: EventWritePreflight,
  proof: GatewayAllowProof,
): Promise<DurableAppendReceipt> {
  const coordinator = new FencedLeaseCoordinator({
    rootDirectory: ledger.rootDirectory,
    retryIntervalMs: 1,
    operationTimeoutMs: 5_000,
  });
  const lease = await coordinator.acquire({
    resource: ledgerResource(ledger),
    ownerId: `authorized-ledger-test:${process.pid}`,
    correlationId: `append:${event.identity.eventId}`,
    ttlMs: 60_000,
    acquireTimeoutMs: 5_000,
  });
  try {
    const writer = new FencedLedgerWriter(coordinator);
    return await writer.append({
      lease,
      ledger,
      event,
      proof,
      expectedHead: await ledger.getVerifiedHead(),
    });
  } finally {
    await coordinator.release(lease).catch(() => undefined);
  }
}

/** Exercise the raw ledger primitive with no fence at all, bypassing the guarded writer. */
export function appendAuthorizedWithoutFenceForTest(
  ledger: AppendOnlyLedger,
  event: EventWritePreflight,
  proof: GatewayAllowProof,
): Promise<DurableAppendReceipt> {
  return ledger.appendAuthorized(event, proof);
}

/** Append through the guarded writer using a previously acquired lease, for stale-fence tests. */
export async function appendAuthorizedWithCapabilityForTest(
  ledger: AppendOnlyLedger,
  event: EventWritePreflight,
  proof: GatewayAllowProof,
  lease: FencedLease,
): Promise<DurableAppendReceipt> {
  const coordinator = new FencedLeaseCoordinator({ rootDirectory: ledger.rootDirectory });
  const writer = new FencedLedgerWriter(coordinator);
  return writer.append({
    lease,
    ledger,
    event,
    proof,
    expectedHead: await ledger.getVerifiedHead(),
  });
}
