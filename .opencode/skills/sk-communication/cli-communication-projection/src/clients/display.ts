// ───────────────────────────────────────────────────────────────────
// MODULE: Client-Owned Display Presentation
// ───────────────────────────────────────────────────────────────────

import { deepFreeze } from '../fidelity/freeze.js';
import { RuntimeAdapterReasonCodes } from '../runtimes/types.js';
import {
  ClientPresentationReasonCodes,
  canClaimFullProjectionParity,
} from './types.js';

import type {
  ClientDisplayInput,
  ClientOriginalOnlyApplication,
  ClientPresentationApplication,
} from './types.js';

/** Apply one adapter outcome without exposing any canonical writer to the client. */
export function applyDisplayPresentation(
  input: ClientDisplayInput,
): ClientPresentationApplication {
  const outcome = input.outcome;
  if (outcome.status === 'exact-original') {
    return originalOnly(outcome.reasonCode);
  }

  const replacement = Object.freeze({
    messageId: input.messageId,
    projectionText: outcome.projectionText,
  });
  if (outcome.status === 'degraded') {
    if (outcome.mode !== 'append') {
      return originalOnly(RuntimeAdapterReasonCodes.ATOMIC_REPLACE_UNAVAILABLE);
    }
    if (!input.surface.appendAfterOriginal(replacement)) {
      return originalOnly(ClientPresentationReasonCodes.DISPLAY_COMMIT_FAILED);
    }
    return deepFreeze({
      clientContractVersion: 'client-presentation/1.0.0',
      status: 'degraded',
      mode: 'append',
      reasonCode: RuntimeAdapterReasonCodes.ATOMIC_REPLACE_UNAVAILABLE,
      originalVisible: true,
      projectionVisible: true,
    });
  }

  if (!canClaimFullProjectionParity(input.ownership)) {
    return originalOnly(RuntimeAdapterReasonCodes.ATOMIC_REPLACE_UNAVAILABLE);
  }
  if (!input.surface.commitAtomicReplacement(replacement)) {
    return originalOnly(ClientPresentationReasonCodes.DISPLAY_COMMIT_FAILED);
  }
  return deepFreeze({
    clientContractVersion: 'client-presentation/1.0.0',
    status: 'projection',
    mode: 'atomic-replace',
    reasonCode: RuntimeAdapterReasonCodes.NONE,
    originalVisible: false,
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
