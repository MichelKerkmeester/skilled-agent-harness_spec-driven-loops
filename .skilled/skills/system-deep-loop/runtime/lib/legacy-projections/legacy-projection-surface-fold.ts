// ───────────────────────────────────────────────────────────────────
// MODULE: Legacy Projection Surface Fold
// ───────────────────────────────────────────────────────────────────

import type { LedgerHead } from '../authorized-ledger/index.js';
import type { EventReadResult } from '../event-envelope/index.js';
import type {
  LegacyProjectionContract,
  LegacyProjectionFormat,
  LegacyProjectionSurfaceContract,
} from './legacy-projection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. SURFACE FOLD
// ───────────────────────────────────────────────────────────────────

/** One folded artifact's published identity and bytes. */
export interface FoldedSurfaceArtifact {
  readonly artifactId: string;
  readonly relativePath: string;
  readonly format: LegacyProjectionFormat;
  readonly bytes: Uint8Array;
}

/**
 * Fold every artifact a multi-file surface projects by composing the existing
 * single-artifact contract — each artifact folds from its own base state
 * through its own reduce over the shared events, then serializes. Deterministic
 * order is the order buildArtifacts returns. The head and replayFingerprint
 * parameters are accepted so a later round can bind each artifact into the full
 * parity-validated fold without changing this call site; this foundation layer
 * performs the straightforward per-artifact fold only.
 */
export function foldLegacyProjectionSurface(
  surface: LegacyProjectionSurfaceContract,
  events: readonly EventReadResult[],
  _head: LedgerHead,
  _replayFingerprint?: unknown,
): ReadonlyArray<FoldedSurfaceArtifact> {
  const artifacts = surface.buildArtifacts(events);
  const encoder = new TextEncoder();
  return artifacts.map((contract) => foldOneArtifact(contract, events, encoder));
}

function foldOneArtifact(
  contract: LegacyProjectionContract<any>,
  events: readonly EventReadResult[],
  encoder: TextEncoder,
): FoldedSurfaceArtifact {
  let state: any = contract.base.state;
  for (const event of events) {
    state = contract.reduce(state, event);
  }
  const serialized = contract.serialize(state);
  const bytes = typeof serialized === 'string'
    ? encoder.encode(serialized)
    : Uint8Array.from(serialized);
  return Object.freeze({
    artifactId: contract.artifactId,
    relativePath: contract.relativePath,
    format: contract.format,
    bytes: Uint8Array.from(bytes),
  });
}
