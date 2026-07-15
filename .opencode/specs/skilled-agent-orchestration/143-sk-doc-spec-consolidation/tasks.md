---
title: "Task Breakdown: sk-doc Spec Consolidation [skilled-agent-orchestration/143-sk-doc-spec-consolidation/tasks]"
description: "Task tracking for the sk-doc consolidation: recon, two-phase move, reference repair, regeneration, verification, and landing."
trigger_phrases:
  - "sk-doc consolidation tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/143-sk-doc-spec-consolidation"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Task breakdown authored"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 90
    status: "Complete"
---
# Task Breakdown: sk-doc Spec Consolidation

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

- [x] T-101 Enumerate + classify documentation candidates; 15 clear movers selected, 017-cmd-create-prompt/032/077/069/072 + 112 operator-excluded (evidence: purposes read, scope confirmed)
- [x] T-102 Confirm the 15 movers committed at HEAD; capture pre-migration baseline (evidence: combined baseline 94 errors over source paths, full-depth)
- [x] T-103 Build chronological interleave map, 19 packets → 001–019 + 999 kept (evidence: SAO movers→001-014/016; existing sk-doc 014→015, 016→017, 015→018, 017→019)
- [x] T-104 Allocate isolated worktree off origin tip (evidence: `.worktrees/0049-skilled-sk-doc-spec-consolidation`)


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-201 Two-phase git-mv the whole track into sk-doc/001-019 (evidence: contiguous 001–019, 0 `__mig_tmp_`, 15 movers removed from SAO, 2404 renames)
- [x] T-202 Confirm rename history preserved (evidence: `R`-status renames, no delete+add duplication)
- [x] T-203 Reference repair: qualified-before-bare, slug-qualified, `/`-excluded left boundary, scoped to the migrated tree (evidence: 1797 files changed, 0 residual in load-bearing .md/.json; residuals only in frozen .out/.codexlog)
- [x] T-206 Author track-root spec.md + graph-metadata + description + context-index; fix `related_to` to schema-valid object; recompute root fingerprint (evidence: root integrity 0 violations; canonical-save root-spec + source-docs checks PASS)
- [x] T-204 Author track-root children_ids (20 packets + z_archive) (evidence: root graph-metadata child-drift PASS; disk-path consistency PASS)
- [x] T-205 Backfill graph-metadata per folder (evidence: global-DB mtime unchanged 2026-07-02 08:59:29)


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-301 Capture pre-migration strict-validate baseline (evidence: 94 total errors, full-depth over source paths)
- [x] T-302 Run strict-validate on migrated tree; measure by error count (evidence: full-depth per-packet recursive; all remaining errors pre-existing template/scaffold/frontmatter debt)
- [x] T-303 Confirm regression-neutral-or-better; verify no coverage gap (evidence: 0 folders gained errors; 0 fingerprint mismatches; 0 migration-created broken self-refs — 258 non-resolving self-identity refs are pre-existing, verified by origin-vs-worktree count parity)
- [x] T-304 Independent GPT-5.6-LUNA (max) read-only audit (evidence: migration invariants verified with file:line)
- [ ] T-305 Commit with explicit-path staging; rebase onto current origin; prune 15 movers from origin's SAO root; fast-forward push (operator approval gated)
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
