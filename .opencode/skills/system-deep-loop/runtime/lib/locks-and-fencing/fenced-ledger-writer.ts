// ───────────────────────────────────────────────────────────────────
// MODULE: Fenced Ledger Writer
// ───────────────────────────────────────────────────────────────────

import { AppendOnlyLedger } from '../authorized-ledger/index.js';
import { FencedLeaseCoordinator } from './fenced-lease-coordinator.js';
import {
  LocksAndFencingError,
  LocksAndFencingErrorCodes,
} from './locks-and-fencing-errors.js';
import { ProtectedResourceKinds } from './locks-and-fencing-types.js';

import type {
  DurableAppendReceipt,
  GatewayAllowProof,
  LedgerHead,
} from '../authorized-ledger/index.js';
import type { EventWritePreflight } from '../event-envelope/index.js';
import type { FencedLease } from './locks-and-fencing-types.js';

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
    return this.#coordinator.withFence(request.lease, () => async () => {
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
      return request.ledger.appendAuthorized(request.event, request.proof);
    });
  }
}
