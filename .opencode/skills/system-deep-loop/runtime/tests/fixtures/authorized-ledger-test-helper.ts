// ───────────────────────────────────────────────────────────────────
// MODULE: Authorized Ledger Test Helper
// ───────────────────────────────────────────────────────────────────

import { appendAuthorizedInternal } from '../../lib/authorized-ledger/append-only-ledger.js';
import {
  AtomicityDomains,
  FencedLeaseCoordinator,
  ProtectedResourceKinds,
  canonicalizeProtectedResource,
} from '../../lib/locks-and-fencing/index.js';

import type {
  AppendOnlyLedger,
  DurableAppendReceipt,
  GatewayAllowProof,
} from '../../lib/authorized-ledger/index.js';
import type { EventWritePreflight } from '../../lib/event-envelope/index.js';
import type { FenceCapability } from '../../lib/locks-and-fencing/index.js';

/** Acquire the ledger fence before exercising the internal append bridge in tests. */
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
  const resource = canonicalizeProtectedResource({
    kind: ProtectedResourceKinds.LEDGER,
    atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
    components: { ledgerId: ledger.ledgerId },
  });
  const lease = await coordinator.acquire({
    resource,
    ownerId: `authorized-ledger-test:${process.pid}`,
    correlationId: `append:${event.identity.eventId}`,
    ttlMs: 60_000,
    acquireTimeoutMs: 5_000,
  });
  try {
    return await coordinator.withFence(lease, (context) => () => appendAuthorizedInternal(
      ledger,
      event,
      proof,
      context.fenceCapabilities[0],
    ));
  } finally {
    await coordinator.release(lease).catch(() => undefined);
  }
}

/** Exercise the primitive without a capability to prove the boundary fails closed. */
export function appendAuthorizedWithoutFenceForTest(
  ledger: AppendOnlyLedger,
  event: EventWritePreflight,
  proof: GatewayAllowProof,
): Promise<DurableAppendReceipt> {
  return appendAuthorizedInternal(
    ledger,
    event,
    proof,
    undefined as never,
  );
}

/** Invoke the primitive with a previously captured capability for stale-fence tests. */
export function appendAuthorizedWithCapabilityForTest(
  ledger: AppendOnlyLedger,
  event: EventWritePreflight,
  proof: GatewayAllowProof,
  fenceCapability: FenceCapability,
): Promise<DurableAppendReceipt> {
  return appendAuthorizedInternal(ledger, event, proof, fenceCapability);
}
