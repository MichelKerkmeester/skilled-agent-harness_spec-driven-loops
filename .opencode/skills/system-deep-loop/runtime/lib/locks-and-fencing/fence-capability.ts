// ───────────────────────────────────────────────────────────────────
// MODULE: Fence Capability
// ───────────────────────────────────────────────────────────────────
//
// An unforgeable, process-local proof that the coordinator revalidated a
// lease immediately before a guarded primitive is allowed to run. The class
// itself carries a private brand so no plain object literal or type
// assertion can satisfy the type structurally; the capability's real state
// lives only in a module-private WeakMap that a constructed-but-unminted
// instance is never a key of, so possessing the class does not confer
// authority. Only `mintFenceCapability` (called from inside the
// coordinator's own guarded critical section) ever inserts a real entry.

import type { CanonicalProtectedResource } from './locks-and-fencing-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. OPAQUE CAPABILITY
// ───────────────────────────────────────────────────────────────────

/** Opaque per-lease authority token; a bare instance carries no minted state. */
export class FenceCapability {
  readonly #brand = true;
}

export interface FenceCapabilityState {
  readonly resource: CanonicalProtectedResource;
  readonly fenceToken: number;
  /** Re-run the coordinator's current-lease assertion; throws when displaced. */
  readonly reassert: () => void;
}

const capabilityState = new WeakMap<FenceCapability, FenceCapabilityState>();

/** Mint one capability bound to state a validator can re-run on demand. */
export function mintFenceCapability(state: FenceCapabilityState): FenceCapability {
  const capability = new FenceCapability();
  capabilityState.set(capability, state);
  return capability;
}

/** Resolve a capability's real state, or null when it was never minted here. */
export function resolveFenceCapability(
  capability: FenceCapability,
): FenceCapabilityState | null {
  return capabilityState.get(capability) ?? null;
}
