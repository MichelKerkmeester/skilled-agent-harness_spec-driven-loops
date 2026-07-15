---
title: "Task Breakdown: system-speckit Spec Consolidation [skilled-agent-orchestration/145-speckit-spec-consolidation/tasks]"
description: "Task tracking for the system-speckit consolidation: recon, two-phase move, reference repair, regeneration, verification, and landing."
trigger_phrases:
  - "system-speckit consolidation tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-speckit-spec-consolidation"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Task breakdown authored"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 90
    status: "Complete"
---
# Task Breakdown: system-speckit Spec Consolidation

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

- [x] T-101 Enumerate + classify candidates by CONTENT; 10 clear movers to system-speckit, 030-cmd-spec-kit-codex-skill-routing operator-kept in SAO, code-graph side confirmed empty (evidence: problem statements read; grep hits on code-graph terms were tool-usage, not engine work)
- [x] T-102 Confirm the 10 movers committed at HEAD; capture pre-migration baseline (evidence: combined baseline 370 errors over 16 source-path folders, full-depth per-packet recursive)
- [x] T-103 Build chronological interleave map, 16 packets → 001–016 (evidence: SAO movers→001/006/009-016; existing 026→002, 027→003, 028→004, 030→005, 029→007, 031→008; via `git log --follow` creation dates)
- [x] T-104 Allocate isolated worktree off origin tip (evidence: `.worktrees/0051-skilled-speckit-spec-consolidation` off `82f4d2eea4`)


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-201 Two-phase git-mv the whole track into system-speckit/001-016 (evidence: contiguous 001–016, 0 `__mig_tmp_`, 10 movers removed from SAO, 18359 renames)
- [x] T-202 Confirm rename history preserved (evidence: `R`-status renames, 0 in-place modifications outside renames)
- [x] T-203 Reference repair: qualified-before-bare, slug-qualified, `/`-excluded left boundary, single-scan order-safe, scoped to the migrated tree (evidence: 7511 files changed, 14607 qualified + 2276 bare hits, 0 residual current-track paths in the 16 new dirs)
- [x] T-206 Author track-root spec.md + graph-metadata + description + context-index; set `related_to` to schema-valid object; recompute root fingerprint via `computeSourceFingerprintForFolder` (evidence: root children_ids=17, real source_fingerprint, object-shaped related_to)
- [x] T-204 Author track-root children_ids (16 packets + z_archive) (evidence: root graph-metadata lists system-speckit/001-016 + z_archive)
- [x] T-205 Backfill graph-metadata + generate-description per folder from the main tree (evidence: 16/16 drift=0, packet_id corrected to system-speckit/00X, global-DB mtime unchanged 2026-07-02 08:59:29)


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-301 Capture pre-migration strict-validate baseline (evidence: 370 total errors, full-depth over 16 source packets)
- [x] T-302 Run strict-validate on migrated tree; measure by error count (evidence: per-packet recursive; every new packet's error count equals its source baseline exactly — 001:10, 002:72, 003:56, 004:59, 005:16, 006:48, 007:8, 008:9, 009:10, 010:11, 011:10, 012:9, 013:26, 014:9, 015:8, 016:9 = 370)
- [x] T-303 Confirm regression-neutral-or-better (evidence: 0 packets gained errors; 370 → 370; 0 fingerprint mismatches; remaining errors are pre-existing template/scaffold/frontmatter debt a rename/repair/regen cannot create)
- [x] T-304 Deterministic self-identity origin-vs-worktree count-parity check (evidence: ancient-path self-identity refs — z_archive/, 03--commands-and-skills/, hyphenated system-spec-kit/ — are pre-existing debt, count-parity confirmed; 0 migration-created broken current-track self-refs)
- [ ] T-305 Commit with explicit-path staging; rebase onto current origin; prune movers from origin's SAO root; fast-forward push (operator approval gated)
- [ ] T-306 Reindex memory+vector DB (operator-gated / skipped)


<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- All Phase 1–2 tasks `[x]` with evidence.
- Migration-invariant validators green; strict-validate regression-neutral (370 → 370) vs baseline.
- Self-identity count-parity recorded.
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
