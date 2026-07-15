---
title: "Task Breakdown: system-skill-advisor Spec Consolidation [skilled-agent-orchestration/142-skill-advisor-spec-consolidation/tasks]"
description: "Task tracking for the system-skill-advisor consolidation: recon, two-phase move, reference repair, regeneration, verification, and landing."
trigger_phrases:
  - "skill-advisor consolidation tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/142-skill-advisor-spec-consolidation"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Task breakdown authored"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 90
    status: "Complete"
---
# Task Breakdown: system-skill-advisor Spec Consolidation

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

- [x] T-101 Enumerate + classify skill-advisor candidates; Core 4 selected, 030/069/072 operator-excluded (evidence: purposes read, scope confirmed)
- [x] T-102 Confirm the 4 movers committed at HEAD; capture pre-migration baseline (evidence: combined baseline 18 errors — SSA 4 + movers 14)
- [x] T-103 Build chronological interleave map, 18 packets → 000–017 (evidence: movers→001/002/003/012; existing 001→004 … 013→017; 000 anchor)
- [x] T-104 Allocate isolated worktree off origin tip (evidence: `.worktrees/0048-skilled-skill-advisor-spec-consolidation`)


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-201 Two-phase git-mv the whole track into system-skill-advisor/000-017 (evidence: contiguous 000–017, 0 `__mig_tmp_`, movers removed from SAO)
- [x] T-202 Confirm rename history preserved (evidence: `R`-status renames, no delete+add duplication)
- [x] T-203 Reference repair: qualified-before-bare, slug-qualified, scoped to the migrated tree (evidence: 0 residual in load-bearing .md/.json; residuals only in frozen .out/.codexlog)
- [x] T-206 Repair 2 in-scope stale self-identity fields to current basename (evidence: 003 impl-summary Spec Folder `084`→`003`; 012 `system-skill-advisor/012-…`→bare `012-…`; both cleared SPEC_DOC_INTEGRITY)
- [x] T-204 Author track-root children_ids 000–017; recompute root + 000-anchor fingerprints (evidence: root graph-metadata lists 18 children; 0 fingerprint mismatches)
- [x] T-205 Backfill graph-metadata per folder (evidence: global-DB mtime unchanged 2026-07-02 08:59:29)


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-301 Capture pre-migration strict-validate baseline (evidence: combined 18 total errors)
- [x] T-302 Run strict-validate on migrated tree; measure by error count (evidence: post 8 errors, all pre-existing template/scaffold/frontmatter debt + 1 cross-tree dangling ref)
- [x] T-303 Confirm regression-neutral-or-better; verify no coverage gap (evidence: 0 folders gained errors; 0 fingerprint mismatches)
- [x] T-304 Independent GPT-5.6-LUNA (max) read-only audit (evidence: A/C/D/E/F PASS; caught P1 prefix-collision on invariant B)
- [x] T-307 Fix LUNA P1 + re-verify (evidence: anchored revert of `004-skill-graph/004-…`→`001-…` across 9 child files + parent children_ids + README; deterministic self-identity detector = 0 corrupted refs; tree-wide count unchanged at 8)
- [ ] T-305 Commit with explicit-path staging; rebase onto current origin; prune 4 movers from origin's SAO root; fast-forward push (operator approval gated)
- [ ] T-306 Reindex memory+vector DB (operator-gated / skipped)


<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- All Phase 1–2 tasks `[x]` with evidence.
- Migration-invariant validators green; strict-validate regression-neutral-or-better vs baseline.
- LUNA audit verdict recorded.
- Commit pushed fast-forward; reindex skipped per operator.


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
