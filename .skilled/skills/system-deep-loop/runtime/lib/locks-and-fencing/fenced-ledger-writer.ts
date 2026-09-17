// ───────────────────────────────────────────────────────────────────
// MODULE: Fenced Ledger Writer
// ───────────────────────────────────────────────────────────────────

import { randomUUID } from 'node:crypto';

import { AppendOnlyLedger } from '../authorized-ledger/index.js';
import { invokeAppendAuthorized } from '../authorized-ledger/append-only-ledger.js';
import { resolveFenceCapability } from './fence-capability.js';
import { FencedLeaseCoordinator } from './fenced-lease-coordinator.js';
import {
  LocksAndFencingError,
  LocksAndFencingErrorCodes,
} from './locks-and-fencing-errors.js';
import { AtomicityDomains, ProtectedResourceKinds } from './locks-and-fencing-types.js';

import type {
  DurableAppendReceipt,
  GatewayAllowProof,
  LedgerHead,
} from '../authorized-ledger/index.js';
import type { EventWritePreflight } from '../event-envelope/index.js';
import type { FenceCapability } from './fence-capability.js';
import type { FencedLease, ProtectedResourceIdentity } from './locks-and-fencing-types.js';

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
    return this.#coordinator.withFence(request.lease, () => async (capabilities) => {
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
      const capability = selectLedgerCapability(capabilities, request.ledger.ledgerId);
      return invokeAppendAuthorized(request.ledger, request.event, request.proof, capability);
    });
  }
}

// ───────────────────────────────────────────────────────────────────
// 2. CAPABILITY SELECTION
// ───────────────────────────────────────────────────────────────────

/** Pick the one minted capability bound to this ledger's resource, if any. */
export function selectLedgerCapability(
  capabilities: readonly FenceCapability[],
  ledgerId: string,
): FenceCapability {
  for (const capability of capabilities) {
    const fence = resolveFenceCapability(capability);
    if (
      fence
      && fence.resource.kind === ProtectedResourceKinds.LEDGER
      && fence.resource.components.ledgerId === ledgerId
    ) {
      return capability;
    }
  }
  throw new LocksAndFencingError(
    LocksAndFencingErrorCodes.INVALID_RESOURCE,
    'mutation',
    'No fenced capability was minted for this ledger resource',
    { ledgerId },
  );
}

// ───────────────────────────────────────────────────────────────────
// 3. ONE-SHOT PRODUCTION CONVENIENCE
// ───────────────────────────────────────────────────────────────────

const DEFAULT_APPEND_FENCE_TTL_MS = 30_000;
const DEFAULT_APPEND_FENCE_OWNER_ID = 'authorized-ledger-append-fence';

/**
 * Acquire, use, and release one short-lived fence for a single authorized
 * append. This is the mechanical replacement for the direct
 * `ledger.appendAuthorized(event, proof)` call sites the gateway-only
 * mutation ruling retired: it derives the expected head from the proof's
 * own recorded prior head, matching how it was authorized, so this does not
 * change ordinary single-writer append semantics.
 */
export async function appendAuthorizedThroughFence(
  ledger: AppendOnlyLedger,
  event: EventWritePreflight,
  proof: GatewayAllowProof,
): Promise<DurableAppendReceipt> {
  const coordinator = new FencedLeaseCoordinator({ rootDirectory: ledger.rootDirectory });
  const writer = new FencedLedgerWriter(coordinator);
  const resource: ProtectedResourceIdentity = Object.freeze({
    kind: ProtectedResourceKinds.LEDGER,
    components: Object.freeze({ ledgerId: ledger.ledgerId }),
    atomicityDomain: AtomicityDomains.SINGLE_HOST_FILESYSTEM,
  });
  const lease = await coordinator.acquire({
    resource,
    ownerId: DEFAULT_APPEND_FENCE_OWNER_ID,
    correlationId: randomUUID(),
    ttlMs: DEFAULT_APPEND_FENCE_TTL_MS,
  });
  try {
    return await writer.append({
      lease,
      ledger,
      event,
      proof,
      expectedHead: Object.freeze({
        ledgerId: ledger.ledgerId,
        sequence: proof.decision.prior_head_sequence,
        recordHash: proof.decision.prior_head_hash,
      }),
    });
  } finally {
    await coordinator.release(lease).catch(() => undefined);
  }
}
