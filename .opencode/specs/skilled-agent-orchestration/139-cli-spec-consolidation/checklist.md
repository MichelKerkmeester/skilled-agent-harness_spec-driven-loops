---
title: "Verification Checklist: CLI Spec Consolidation [skilled-agent-orchestration/139-cli-spec-consolidation/checklist]"
description: "QA verification for the cli-external-orchestration consolidation: structural integrity, reference correctness, metadata regeneration, and regression-neutral validation."
trigger_phrases:
  - "cli consolidation checklist"
  - "renumber verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/139-cli-spec-consolidation"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Verification checklist authored"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 90
    status: "Complete"
---
# Verification Checklist: CLI Spec Consolidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Each item is checked against real command output or file evidence. Load-bearing structural claims cite the exact count or path they were verified against.


<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] Mover set classified with evidence and operator-confirmed (Corrected set: drop 086, add 120)
- [x] Numbering scheme confirmed (chronological)
- [x] Mover availability verified (013/030 deferred; 5 committed movers)
- [x] Isolated worktree created off origin tip


<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] Renames use two-phase temp→final (no transient collision) — evidence: contiguity assert passed
- [x] Reference rewrites are category-qualified / CEO-tree-scoped (no bare-token z_archive-twin corruption) — evidence: revert + rebuild after first-pass false positive
- [x] Deterministic + idempotent token map (re-runnable) — evidence: /tmp/cli-tokens*.json
- [x] No edits to files outside the migration path set — evidence: rewrite scoped to `.opencode/specs`


<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CEO track holds exactly 28 contiguous packets 001–028 — evidence: rename verify + LUNA invariant 1
- [x] Zero residual stale-identity paths in CEO tree — evidence: residual grep = 0
- [x] Multi-phase parents' children_ids resolve on disk (026, 027 incl. 009) — evidence: GRAPH_METADATA_CHILD_DRIFT PASS
- [x] Regen succeeded for all folders — evidence: gd_ok=90/0, bf_ok=85/0
- [x] Strict-validate regression-neutral vs baseline — evidence: 0 new error categories; integrity 3→1


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] Every packet targeted by the map was moved/renumbered (28/28) — no partial migration
- [x] Reference repair reached zero residual stale-identity paths (not "mostly fixed")
- [x] Root-level metadata created AND the SAO root cleaned of movers (both directions)
- [x] Deferred items (013/030, reindex) are recorded, not silently dropped


<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] No destructive op outside migration paths — evidence: explicit path lists only
- [x] No global-DB write from worktree — evidence: speckit-eval.db mtime unchanged across regen
- [x] Concurrent-session files untouched — evidence: 013/030 left as-is; isolated worktree


<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] Packet documents map, decisions, and honest scope boundaries
- [x] Deferred items (013/030, reindex) recorded explicitly
- [x] Pre-existing doc-debt named as out-of-scope (not silently owned)


<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CEO track-root JSONs created (description + graph-metadata, 28 children)
- [x] SAO root children_ids pruned of movers (100→98)
- [x] Rename history preserved (`R` status) — evidence: 958 renames


<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Status | Evidence |
|----------|--------|----------|
| Structural integrity | PASS | 28 contiguous, 0 temp, movers moved |
| Reference correctness | PASS | residual = 0; LUNA audit |
| Metadata regeneration | PASS | 90/90 + 85/85; DB unpolluted |
| Regression delta | NEUTRAL | 0 new error categories; integrity improved |
| Landing | PENDING | commit + FF push |
| Reindex | DEFERRED | MAIN post-merge, gated |


<!-- /ANCHOR:summary -->
---
