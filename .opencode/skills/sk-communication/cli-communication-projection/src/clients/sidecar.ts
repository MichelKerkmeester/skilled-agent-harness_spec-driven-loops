// ───────────────────────────────────────────────────────────────────
// MODULE: Sidecar Presentation
// ───────────────────────────────────────────────────────────────────

import { deepFreeze } from '../fidelity/freeze.js';
import { RuntimeAdapterReasonCodes } from '../runtimes/types.js';
import { ClientPresentationReasonCodes } from './types.js';

import type {
  ClientOriginalOnlyApplication,
  ClientPresentationApplication,
  ClientSidecarInput,
} from './types.js';

/** Present only an adapter-selected sidecar projection beside the untouched original. */
export function applySidecarPresentation(
  input: ClientSidecarInput,
): ClientPresentationApplication {
  const outcome = input.outcome;
  if (outcome.status !== 'degraded' || outcome.mode !== 'sidecar') {
    return originalOnly(
      outcome.status === 'exact-original'
        ? outcome.reasonCode
        : RuntimeAdapterReasonCodes.ATOMIC_REPLACE_UNAVAILABLE,
    );
  }

  const committed = input.surface.presentProjection(Object.freeze({
    messageId: input.messageId,
    projectionText: outcome.projectionText,
  }));
  if (!committed) {
    return originalOnly(ClientPresentationReasonCodes.SIDECAR_COMMIT_FAILED);
  }
  return deepFreeze({
    clientContractVersion: 'client-presentation/1.0.0',
    status: 'degraded',
    mode: 'sidecar',
    reasonCode: RuntimeAdapterReasonCodes.ATOMIC_REPLACE_UNAVAILABLE,
    originalVisible: true,
    projectionVisible: true,
  });
}

function originalOnly(
  reasonCode: ClientOriginalOnlyApplication['reasonCode'],
): ClientOriginalOnlyApplication {
  return deepFreeze({
    clientContractVersion: 'client-presentation/1.0.0',
    status: 'exact-original',
    mode: 'original-only',
    reasonCode,
    originalVisible: true,
    projectionVisible: false,
  });
}
