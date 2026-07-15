---
title: "Task Breakdown: system-code-graph Active-Packet Renumber [skilled-agent-orchestration/146-codegraph-active-renumber/tasks]"
description: "Task tracking for the system-code-graph 001-011 to 025-035 renumber: recon, single-phase move, reference repair, regeneration, root authoring, verification, and landing."
trigger_phrases:
  - "system-code-graph renumber tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/146-codegraph-active-renumber"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Task breakdown authored"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 90
    status: "Complete"
---
# Task Breakdown: system-code-graph Active-Packet Renumber

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete · `[ ]` pending · `[~]` in progress
- Each task carries evidence where it is a load-bearing claim.


<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-101 Recon: confirm 11 active packets `001-011` + `z_archive/001-024`; track clean vs origin (evidence: `ls` + `git status --porcelain` clean for `system-code-graph`)
- [x] T-102 Capture pre-renumber baseline, full-depth per-packet recursive SUM (evidence: 11-packet error SUM = 29; root own-errors = 4; DB mtime `2026-07-02 08:59:29`)
- [x] T-103 Confirm renumber map + slug decisions (evidence: `001-011`→`025-035`; `codegraph`→`code-graph` on 026/027/028/033; `010`→`034-code-graph-scatter-from-027`; all operator-approved)
- [x] T-104 Allocate isolated worktree off origin tip (evidence: `.worktrees/0052-skilled-codegraph-active-renumber` off `413f463c22b`)


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-201 Single-phase git-mv `001-011` → `025-035` (evidence: 11 moves; targets were empty ⇒ collision-free; contiguous `025-035` + `z_archive`)
- [x] T-202 Confirm rename history preserved (evidence: 2,033 `R` — 1,255 pure R + 778 RM; 0 delete+add; change set scoped, 0 paths outside `system-code-graph/` + this record)
- [x] T-203 Reference repair: qualified-before-bare, full-path map, `/`-excluded left boundary, single-scan order-safe, scoped to the renamed trees (evidence: 778 files changed, 5,045 qualified + 109 bare hits, 0 residual old current-track paths in `025-035`)
- [x] T-204 Author track-root children_ids (`025-035` + z_archive) (evidence: root graph-metadata children_ids = 12)
- [x] T-205 Backfill graph-metadata + generate-description per folder from the main tree, children-first (evidence: 118/120 folders regen'd; 2 non-spec stubs correctly skipped; DB mtime unchanged)
- [x] T-206 Author track-root spec.md + description + context-index; set `related_to` to schema-valid object; recompute root fingerprint via `computeSourceFingerprintForFolder` (evidence: root children_ids=12, real source_fingerprint, object-shaped related_to → record packet)


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-301 Capture pre-renumber strict-validate baseline (evidence: 11-packet SUM = 29; root own = 4, full-depth)
- [x] T-302 Run strict-validate on renamed tree; measure by error count via aligned old→new SUM (evidence: 025:2, 026-029:0, 030:0, 031:1, 032:13, 033:0, 034:5, 035:1 = post 22)
- [x] T-303 Confirm regression-neutral-or-better (evidence: packet delta −7 (29→22), every packet ≤ 0; root 4→2; net −9; 0 packets gained errors)
- [x] T-304 Verify no renumber-created broken self-identity (evidence: residual old-qualified-ref grep in `025-035` = 0; remaining errors are pre-existing template/scaffold/integrity debt)
- [ ] T-305 Commit with explicit-path staging; rebase onto current origin; fast-forward push (operator approval gated)
- [ ] T-306 Reindex memory+vector DB (operator-gated / deferred)


<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- All Phase 1–2 tasks `[x]` with evidence.
- Migration-invariant validators green; strict-validate regression-neutral-or-better (29 → 22 packets; root 4 → 2) vs baseline.
- No renumber-created broken current-track self-refs.
- Commit pushed fast-forward; reindex deferred per operator.


<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Spec**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Summary**: `implementation-summary.md`


<!-- /ANCHOR:cross-refs -->
---
