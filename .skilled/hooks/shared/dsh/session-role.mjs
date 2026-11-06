// ───────────────────────────────────────────────────────────────────
// MODULE: Session Role
// ───────────────────────────────────────────────────────────────────

// The lineage patch applies before the guards patch inserts the repo-guards row, so it
// cannot change that row's config. It mounts its own marker plugin instead, and the
// marker lives on a process-wide symbol because the loader may give the two plugin
// files separate module instances.
const LINEAGE_LEAF = Symbol.for('skilled.repo-guards.lineage-leaf');

/** Mark this process as a fan-out leaf, a headless child composed with the lineage patch. */
export function markLineageLeaf() {
  globalThis[LINEAGE_LEAF] = true;
}

/**
 * Whether this process is a fan-out leaf.
 *
 * Read it when an event fires, never while plugins apply: the loader does not wait
 * for one row to finish applying before it applies the next.
 *
 * @returns {boolean} True when the lineage patch mounted its marker.
 */
export function isLineageLeaf() {
  return globalThis[LINEAGE_LEAF] === true;
}
