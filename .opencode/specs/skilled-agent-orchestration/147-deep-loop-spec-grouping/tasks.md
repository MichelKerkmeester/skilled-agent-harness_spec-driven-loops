---
title: "Task Breakdown: system-deep-loop Spec Grouping [skilled-agent-orchestration/147-deep-loop-spec-grouping/tasks]"
description: "Task tracking for re-nesting 18 system-deep-loop packets under four phase parents: recon, canary, move, reference repair, regeneration, parent phase-maps, verification, and landing."
trigger_phrases:
  - "deep-loop grouping tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/147-deep-loop-spec-grouping"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Task breakdown authored"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 90
    status: "Complete"
---
# Task Breakdown: system-deep-loop Spec Grouping

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

- [x] T-101 Recon: 4 parents' next child numbers (054→013, 038→008, 052→009, 030→012) + confirm 18 sources top-level (evidence: `find -maxdepth 1` + 18/18 present)
- [x] T-102 Size reference blast radius (evidence: 221 files reference old basenames; ~38 external — historical/concurrent/aggregate — classified as deferred, not rewritten)
- [x] T-103 Capture pre-move baseline, full-depth per-parent + per-packet recursive SUM (evidence: parents 47 [054=34,038=8,052=3,030=2] + moved 14 = **61**; DB mtime `2026-07-02 08:59:29`)
- [x] T-104 Allocate isolated worktree off origin tip (evidence: `.worktrees/0053-skilled-deep-loop-spec-grouping` off `60fd0301cb`; local==origin 0/0)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-201 Canary move 055→030/012 + regen; confirm nested `parent_id` derived and parent children_ids updated (evidence: child parent_id=`system-deep-loop/030-deep-loop-improved`; 030 children_ids=12; canary child 1→0 errors)
- [x] T-202 Whole-subtree git-mv the remaining 17 (evidence: 17 moved, 0 stragglers, R-status renames; 053/064 carried their children)
- [x] T-203 Reference repair: qualified-token + `Spec Folder` row, scoped to moved subtrees (evidence: 284 replacements / 171 files + 12 Spec-Folder rows; residual qualified old-path grep = 0; 15 leaf rows match new leaf, 3 have no row, 2 are phase parents)
- [x] T-204 Regenerate identity per moved spec folder, deepest-first (evidence: 27 child folders regen'd via generate-description + backfill from the main tree; DB mtime unchanged)
- [x] T-205 Recompute parent children_ids (evidence: 030=12, 038=14, 052=12, 054=18)
- [x] T-206 Update phase-documentation maps in 030 (+`012`), 038 (+`008-014`), 052 (+`006-012`, completing a pre-existing gap); 054 has no map (prose spec) — re-backfill edited parents (evidence: backfill dry-run `changed=0` on all four parents)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-301 Capture pre-move strict-validate baseline (evidence: 4-parent + 18-packet recursive SUM = **61**, full-depth)
- [x] T-302 Run strict-validate on the four parent subtrees post-move; measure by error count via aligned pre/post SUM (evidence: 030:1, 038:15, 052:3, 054:34 = post **53**)
- [x] T-303 Confirm regression-neutral-or-better (evidence: grand 61 → 53, **net −8**; regen cleared stale GENERATED_METADATA_INTEGRITY across moved packets; 0 folders gained a move-created error)
- [x] T-304 Verify no move-created broken self-identity (evidence: residual qualified-ref grep in moved subtrees = 0; each moved leaf `Spec Folder` row = new leaf; remaining errors are pre-existing template/scaffold/integrity debt)
- [ ] T-305 Commit with explicit-path staging; rebase onto current origin; fast-forward push (operator approval gated)
- [ ] T-306 Reindex memory+vector DB (operator-gated / deferred)

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- All Phase 1–2 tasks `[x]` with evidence.
- Migration-invariant validators green; strict-validate regression-neutral-or-better (61 → 53) vs baseline.
- No move-created broken self-refs; linked top-level reduced 29 → 11.
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
