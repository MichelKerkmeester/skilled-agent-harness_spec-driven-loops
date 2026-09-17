// ───────────────────────────────────────────────────────────────────
// MODULE: Fence Capability
// ───────────────────────────────────────────────────────────────────
//
// A process-local marker naming which resource and fence token a caller
// claims to hold. The class carries a private brand so no plain object
// literal or type assertion can satisfy the type structurally, and its
// claimed state lives only in a module-private WeakMap a constructed-but-
// unminted instance is never a key of. Neither property makes the claim
// itself trustworthy: a validator must always re-check the claimed
// resource and fence token against the coordinator's own durable state
// before treating a capability as current, never trust the capability's
// self-reported fields alone.

import type { CanonicalProtectedResource } from './locks-and-fencing-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. OPAQUE CAPABILITY
// ───────────────────────────────────────────────────────────────────

/** Opaque per-lease claim; a bare instance carries no minted state. */
export class FenceCapability {
  readonly #brand = true;
}

export interface FenceCapabilityState {
  readonly resource: CanonicalProtectedResource;
  readonly fenceToken: number;
}

const capabilityState = new WeakMap<FenceCapability, FenceCapabilityState>();

/** Mint one capability naming the resource and fence token it claims. */
export function mintFenceCapability(state: FenceCapabilityState): FenceCapability {
  const capability = new FenceCapability();
  capabilityState.set(capability, state);
  return capability;
}

/** Resolve a capability's claimed state, or null when it was never minted here. */
export function resolveFenceCapability(
  capability: FenceCapability,
): FenceCapabilityState | null {
  return capabilityState.get(capability) ?? null;
}
