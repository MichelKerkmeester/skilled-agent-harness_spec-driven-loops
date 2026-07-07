// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Conflict Edge Overlay
// ───────────────────────────────────────────────────────────────

// A benchmark-only overlay of conflicts_with edges that gives the advisor
// conflict-rerank seam real mass to demote. The live advisor corpus carries
// only enhances, siblings, prerequisite_for and depends_on edges and zero
// conflicts_with edges, so the seam is structurally dormant against the live
// projection. Rather than write the live corpus (which the phase keeps
// read-only), this overlay is merged into the in-memory projection the harness
// already loads from the read-only backup copy, so the production
// scoreGraphCausalLaneSplit conflict path runs against real conflict edges
// without mutating any production data.
//
// Each edge models a real routing conflict where one intent should suppress a
// competitor it is routinely confused with. The graph-causal lane propagates a
// conflicts_with edge from a seed-matched source skill to its target with the
// fixed -0.35 multiplier, so a target that competes on raw lexical magnitude is
// demoted when the conflicting intent is also present. The weights are high so
// the conflict mass is large enough to move a near-tie, which is the only place
// a demotion can change a routing outcome.

export const CONFLICT_OVERLAY_EDGES = [
  // A review pass conflicts with implementing or looping over the same code.
  { sourceId: 'sk-code-review', targetId: 'sk-code', edgeType: 'conflicts_with', weight: 0.9, context: 'review-not-implement' },
  { sourceId: 'sk-code-review', targetId: 'deep-loop-workflows', edgeType: 'conflicts_with', weight: 0.85, context: 'single-pass-not-loop' },
  // A spec-kit save conflicts with the bare file-save command bridge.
  { sourceId: 'system-spec-kit', targetId: 'memory:save', edgeType: 'conflicts_with', weight: 0.9, context: 'speckit-not-bare-save' },
  // A structural code-graph query conflicts with editing the same code.
  { sourceId: 'system-code-graph', targetId: 'sk-code', edgeType: 'conflicts_with', weight: 0.85, context: 'structural-not-implement' },
  // A git worktree task conflicts with a generic code-implementation read.
  { sourceId: 'sk-git', targetId: 'sk-code', edgeType: 'conflicts_with', weight: 0.8, context: 'git-not-code' },
];

export function withConflictOverlay(projection) {
  return {
    ...projection,
    edges: [...projection.edges, ...CONFLICT_OVERLAY_EDGES],
  };
}
