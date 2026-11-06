// ───────────────────────────────────────────────────────────────────
// MODULE: Lineage Leaf Marker
// ───────────────────────────────────────────────────────────────────

import { markLineageLeaf } from './adapters/session-role.mjs';

export const name = 'repo-guards-lineage-leaf';

/** Mounted only by the lineage patch: marks the session as a fan-out leaf. */
export function apply() {
  markLineageLeaf();
}
