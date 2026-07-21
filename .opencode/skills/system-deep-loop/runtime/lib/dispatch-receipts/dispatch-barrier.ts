// ───────────────────────────────────────────────────────────────────
// MODULE: Durable Dispatch Barrier
// ───────────────────────────────────────────────────────────────────

import { AuthorizedEvidenceWriter } from '../receipts-and-effect-recovery/index.js';
import {
  LINEAGE_DISPATCH_RESOLVED_EVENT_TYPE,
  prepareLineageDispatchResolvedEvent,
} from './event-contract.js';
import {
  dispatchReceiptEvidenceFromVerified,
  unresolvedDispatchHandoff,
} from './evidence.js';
import {
  DispatchReceiptError,
  DispatchReceiptErrorCodes,
} from './errors.js';
import { verifyAdapterInvocationFingerprint } from './fingerprint.js';

import type {
  DispatchBarrierResult,
  DispatchWithReceiptInput,
  ResolvedAdapterInvocation,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────────

function failureCode(error: unknown): string {
  return error !== null
    && typeof error === 'object'
    && 'code' in error
    && typeof error.code === 'string'
    ? error.code
    : 'UNEXPECTED_FAILURE';
}

async function routeUnresolved(
  route: DispatchWithReceiptInput<unknown, unknown, unknown, unknown>['routeUnresolved'],
  handoff: ReturnType<typeof unresolvedDispatchHandoff>,
): Promise<void> {
  if (!route) return;
  try {
    await route(handoff);
  } catch {
    throw new DispatchReceiptError(
      DispatchReceiptErrorCodes.RECOVERY_ROUTING_FAILED,
      'recovery',
      'Receipt-only dispatch could not enter recovery and salvage routing',
      { dispatchId: handoff.evidence.dispatchId },
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 2. DISPATCH
// ───────────────────────────────────────────────────────────────────

/** Resolve, authorize, durably append, and only then cross the spawn boundary. */
export async function dispatchWithDurableReceipt<
  TExpandedConfig,
  TCapabilities,
  TManifestLeaf,
  TResult,
>(
  input: DispatchWithReceiptInput<
    TExpandedConfig,
    TCapabilities,
    TManifestLeaf,
    TResult
  >,
): Promise<DispatchBarrierResult<TResult>> {
  if (!(input.writer instanceof AuthorizedEvidenceWriter)) {
    throw new DispatchReceiptError(
      DispatchReceiptErrorCodes.INVALID_INPUT,
      'input',
      'Dispatch requires the authorized evidence writer',
    );
  }

  const expandedConfig = await input.pipeline.expandConfiguration();
  const capabilities = await input.pipeline.validateCapabilities(expandedConfig);
  const manifestLeaf = await input.pipeline.expandManifest(expandedConfig, capabilities);
  const invocation: ResolvedAdapterInvocation = await input.pipeline.resolveAdapter(
    manifestLeaf,
    capabilities,
    expandedConfig,
  );
  const launch = verifyAdapterInvocationFingerprint(invocation);
  const event = prepareLineageDispatchResolvedEvent(
    input.envelope,
    launch,
    input.registry,
    input.macProvider,
  );

  let appended;
  try {
    appended = await input.writer.append(event);
  } catch (error: unknown) {
    const existing = await input.writer.findEvent(event.identity.eventId).catch(() => null);
    if (
      existing?.event.effective.envelope.event_type === LINEAGE_DISPATCH_RESOLVED_EVENT_TYPE
      && existing.event.stored.digest !== event.canonicalDigest
    ) {
      throw new DispatchReceiptError(
        DispatchReceiptErrorCodes.DISPATCH_ID_CONFLICT,
        'append',
        'Dispatch identity is already bound to different canonical launch facts',
        { dispatchId: input.envelope.dispatchId },
      );
    }
    throw new DispatchReceiptError(
      DispatchReceiptErrorCodes.DURABLE_APPEND_FAILED,
      'append',
      'Authorized dispatch receipt did not reach durable verified storage',
      {
        dispatchId: input.envelope.dispatchId,
        substrateCode: failureCode(error),
      },
    );
  }
  const { evidence } = dispatchReceiptEvidenceFromVerified(
    appended.verified,
    appended.status === 'appended' ? 'dispatch-resolved' : 'unresolved',
  );

  if (appended.status === 'idempotent') {
    const handoff = unresolvedDispatchHandoff(evidence);
    await routeUnresolved(
      input.routeUnresolved as DispatchWithReceiptInput<unknown, unknown, unknown, unknown>['routeUnresolved'],
      handoff,
    );
    return Object.freeze({
      authority: 'legacy-authoritative',
      event,
      evidence: handoff.evidence,
      handoff,
      receipt: appended.receipt,
      status: 'unresolved',
    });
  }

  input.faultInjection?.afterDurableAppendBeforeSpawn?.();
  const spawnResult = await input.spawn(invocation, evidence);
  return Object.freeze({
    authority: 'legacy-authoritative',
    event,
    evidence,
    receipt: appended.receipt,
    spawnResult,
    status: 'spawned',
  });
}
