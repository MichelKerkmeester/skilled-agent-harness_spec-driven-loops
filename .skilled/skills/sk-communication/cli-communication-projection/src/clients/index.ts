// ───────────────────────────────────────────────────────────────────
// MODULE: Client Presentation Public API
// ───────────────────────────────────────────────────────────────────

export { applyDisplayPresentation } from './display.js';
export { applySidecarPresentation } from './sidecar.js';
export {
  ClientPresentationReasonCodes,
  canClaimFullProjectionParity,
} from './types.js';

export type {
  ClientCompleteMessageReplacement,
  ClientDegradedApplication,
  ClientDisplayInput,
  ClientDisplaySurface,
  ClientOriginalOnlyApplication,
  ClientPresentationApplication,
  ClientPresentationInput,
  ClientPresentationOwnership,
  ClientPresentationReasonCode,
  ClientProjectionApplication,
  ClientSidecarInput,
  ClientSidecarProjection,
  ClientSidecarSurface,
} from './types.js';
