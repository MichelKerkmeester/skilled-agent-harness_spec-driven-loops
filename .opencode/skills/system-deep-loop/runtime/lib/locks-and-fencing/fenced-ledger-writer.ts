// ───────────────────────────────────────────────────────────────────
// MODULE: Fenced Ledger Writer
// ───────────────────────────────────────────────────────────────────

import { AppendOnlyLedger } from '../authorized-ledger/index.js';
import { appendAuthorizedInternal } from '../authorized-ledger/append-only-ledger.js';
import { FencedLeaseCoordinator } from './fenced-lease-coordinator.js';
import {
  LocksAndFencingError,
  LocksAndFencingErrorCodes,
} from './locks-and-fencing-errors.js';
import {
  AtomicityDomains,
  ProtectedResourceKinds,
} from './locks-and-fencing-types.js';
import { canonicalizeProtectedResource } from './protected-resource-registry.js';

import type {
  DurableAppendReceipt,
  GatewayAllowProof,
  LedgerHead,
} from '../authorized-ledger/index.js';
import type { EventWritePreflight } from '../event-envelope/index.js';
import type { FenceCapability, FencedLease } from './locks-and-fencing-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. GUARDED APPEND
// ───────────────────────────────────────────────────────────────────

export interface FencedLedgerAppendRequest {
  readonly lease: FencedLease;
  readonly ledger: AppendOnlyLedger;
  readonly event: EventWritePreflight;
  readonly proof: GatewayAllowProof;
  readonly expectedHead: LedgerHead;
}

/** Bind the current fence and expected ledger head to one guarded append operation. */
export class FencedLedgerWriter {
  readonly #coordinator: FencedLeaseCoordinator;

  public constructor(coordinator: FencedLeaseCoordinator) {
    this.#coordinator = coordinator;
  }

  /** Append through the existing single-use authorization boundary while the fence is held. */
  public async append(request: FencedLedgerAppendRequest): Promise<DurableAppendReceipt> {
    const resource = request.lease.resource;
    if (
      resource.kind !== ProtectedResourceKinds.LEDGER
      || resource.components.ledgerId !== request.ledger.ledgerId
      || request.expectedHead.ledgerId !== request.ledger.ledgerId
    ) {
      throw new LocksAndFencingError(
        LocksAndFencingErrorCodes.INVALID_RESOURCE,
        'mutation',
        'Ledger fence does not match the protected ledger identity',
        {
          ledgerId: request.ledger.ledgerId,
          resourceDigest: resource.resourceDigest,
        },
      );
    }
    return this.#coordinator.withFence(request.lease, (context) => async () => {
      const currentHead = await request.ledger.getVerifiedHead();
      if (
        currentHead.sequence !== request.expectedHead.sequence
        || currentHead.recordHash !== request.expectedHead.recordHash
      ) {
        throw new LocksAndFencingError(
          LocksAndFencingErrorCodes.HEAD_CONFLICT,
          'mutation',
          'Ledger head changed before the fenced append committed',
          {
            actualSequence: currentHead.sequence,
            expectedSequence: request.expectedHead.sequence,
            resourceDigest: resource.resourceDigest,
          },
        );
      }
      return appendAuthorizedInternal(
        request.ledger,
        request.event,
        request.proof,
        context.fenceCapabilities[0],
      );
    });
  }
}

/** Acquire the ledger fence for callers that already hold a durable gateway proof. */
export async function appendFencedLedgerRecord(
  ledger: AppendOnlyLedger,
  event: EventWritePreflight,
  proof: GatewayAllowProof,
): Promise<DurableAppendReceipt> {
  const coordinator = new FencedLeaseCoordinator({ rootDirectory: ledger.rootDirectory });
  const resource = canonicalizeProtectedResource({
    kind: ProtectedResourceKinds.LEDGER,
    atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
    components: { ledgerId: ledger.ledgerId },
  });
  const expectedHead: LedgerHead = {
    ledgerId: ledger.ledgerId,
    sequence: proof.decision.prior_head_sequence,
    recordHash: proof.decision.prior_head_hash,
  };
  const lease = await coordinator.acquire({
    resource,
    ownerId: `authorized-ledger-writer:${process.pid}`,
    correlationId: proof.decision.request_id,
    ttlMs: 60_000,
    acquireTimeoutMs: 5_000,
  });
  try {
    return await new FencedLedgerWriter(coordinator).append({
      lease,
      ledger,
      event,
      proof,
      expectedHead,
    });
  } finally {
    await coordinator.release(lease).catch(() => undefined);
  }
}

/** Append while the caller's multi-resource fence guard is active. */
export async function appendFencedLedgerRecordUnderHeldFence(
  ledger: AppendOnlyLedger,
  event: EventWritePreflight,
  proof: GatewayAllowProof,
  expectedHead: LedgerHead,
  fenceCapability: FenceCapability,
): Promise<DurableAppendReceipt> {
  const currentHead = await ledger.getVerifiedHead();
  if (
    currentHead.sequence !== expectedHead.sequence
    || currentHead.recordHash !== expectedHead.recordHash
  ) {
    throw new LocksAndFencingError(
      LocksAndFencingErrorCodes.HEAD_CONFLICT,
      'mutation',
      'Ledger head changed before the held-fence append committed',
      {
        actualSequence: currentHead.sequence,
        expectedSequence: expectedHead.sequence,
        ledgerId: ledger.ledgerId,
      },
    );
  }
  return appendAuthorizedInternal(
    ledger,
    event,
    proof,
    fenceCapability,
  );
}
