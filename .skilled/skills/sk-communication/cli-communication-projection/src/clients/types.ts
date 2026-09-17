// ───────────────────────────────────────────────────────────────────
// MODULE: Client Presentation Types
// ───────────────────────────────────────────────────────────────────

import type { RuntimeAdapterReasonCode, RuntimePresentationResult } from '../runtimes/types.js';

/** Failures introduced while applying an already-decided presentation outcome. */
export const ClientPresentationReasonCodes = {
  DISPLAY_COMMIT_FAILED: 'display-commit-failed',
  SIDECAR_COMMIT_FAILED: 'sidecar-commit-failed',
} as const;

/** Typed reason retained after a client applies or safely rejects an outcome. */
export type ClientPresentationReasonCode =
  | RuntimeAdapterReasonCode
  | typeof ClientPresentationReasonCodes[keyof typeof ClientPresentationReasonCodes];

/** Ownership required before a client may claim full-projection parity. */
export interface ClientPresentationOwnership {
  readonly ownsCompleteMessage: boolean;
  readonly ownsAtomicRenderDecision: boolean;
}

/** Complete replacement passed to one client-owned display transaction. */
export interface ClientCompleteMessageReplacement {
  readonly messageId: string;
  readonly projectionText: string;
}

/** Client-owned display operations that never receive canonical state. */
export interface ClientDisplaySurface {
  commitAtomicReplacement(replacement: ClientCompleteMessageReplacement): boolean;
  appendAfterOriginal(replacement: ClientCompleteMessageReplacement): boolean;
}

/** Projection rendered outside the native message surface. */
export interface ClientSidecarProjection {
  readonly messageId: string;
  readonly projectionText: string;
}

/** Separate view that cannot suppress or replace the native message. */
export interface ClientSidecarSurface {
  presentProjection(projection: ClientSidecarProjection): boolean;
}

/** Inputs shared by complete-message and sidecar clients. */
export interface ClientPresentationInput {
  readonly messageId: string;
  readonly outcome: RuntimePresentationResult;
}

/** Input to a client-owned message display. */
export interface ClientDisplayInput extends ClientPresentationInput {
  readonly ownership: ClientPresentationOwnership;
  readonly surface: ClientDisplaySurface;
}

/** Input to a separate projection view. */
export interface ClientSidecarInput extends ClientPresentationInput {
  readonly surface: ClientSidecarSurface;
}

/** Atomically committed complete-message projection. */
export interface ClientProjectionApplication {
  readonly clientContractVersion: 'client-presentation/1.0.0';
  readonly status: 'projection';
  readonly mode: 'atomic-replace';
  readonly reasonCode: 'none';
  readonly originalVisible: false;
  readonly projectionVisible: true;
}

/** Projection displayed without changing the native original. */
export interface ClientDegradedApplication {
  readonly clientContractVersion: 'client-presentation/1.0.0';
  readonly status: 'degraded';
  readonly mode: 'append' | 'sidecar';
  readonly reasonCode: 'atomic-replace-unavailable';
  readonly originalVisible: true;
  readonly projectionVisible: true;
}

/** No committed projection; the already-visible original remains authoritative. */
export interface ClientOriginalOnlyApplication {
  readonly clientContractVersion: 'client-presentation/1.0.0';
  readonly status: 'exact-original';
  readonly mode: 'original-only';
  readonly reasonCode: Exclude<ClientPresentationReasonCode, 'none'>;
  readonly originalVisible: true;
  readonly projectionVisible: false;
}

/** Result of applying one runtime presentation outcome to a client surface. */
export type ClientPresentationApplication =
  | ClientDegradedApplication
  | ClientOriginalOnlyApplication
  | ClientProjectionApplication;

/** Confirm the only ownership combination eligible for full-projection parity. */
export function canClaimFullProjectionParity(
  ownership: ClientPresentationOwnership,
): boolean {
  return ownership.ownsCompleteMessage && ownership.ownsAtomicRenderDecision;
}
