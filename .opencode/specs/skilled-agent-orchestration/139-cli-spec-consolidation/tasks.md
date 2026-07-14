---
title: "Task Breakdown: CLI Spec Consolidation [skilled-agent-orchestration/139-cli-spec-consolidation/tasks]"
description: "Task tracking for the cli-external-orchestration consolidation: recon, rename, reference repair, regeneration, verification, and landing."
trigger_phrases:
  - "cli consolidation tasks"
  - "renumber tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/139-cli-spec-consolidation"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Task breakdown authored"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 90
    status: "Complete"
---
# Task Breakdown: CLI Spec Consolidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete · `[ ]` pending · `[~]` in progress
- Each task carries evidence (command, count, or file) where it is a load-bearing claim.


<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-101 Enumerate CEO + SAO CLI-skill packets; classify movers (evidence: 4 ambiguous folders read, corrected set confirmed by operator)
- [x] T-102 Resolve mover availability (evidence: 013/030 untracked → deferred; 120/122/125/134/135 committed at HEAD)
- [x] T-103 Build chronological renumber map, 28 folders → 001–028 (evidence: /tmp/cli-map.json, unique nums + slugs asserted)
- [x] T-104 Allocate isolated worktree off origin tip (evidence: `.worktrees/0043-skilled-cli-spec-consolidation`)


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-201 Two-phase git-mv all 28 folders (evidence: contiguous 001–028, no temp leftovers, movers removed from SAO)
- [x] T-202 Confirm rename history preserved (evidence: 958 `R`-status entries)
- [x] T-203 Category-qualified reference rewrite worktree-wide (evidence: 271 files / 1944 replacements)
- [x] T-204 CEO-tree-scoped identity rewrite for stale z_archive origins (evidence: 380 files / 921 replacements; residual = 0)
- [x] T-205 Regenerate description.json + graph-metadata.json per folder (evidence: gd_ok=90/0, bf_ok=85/0, global-DB mtime unchanged)
- [x] T-206 Author CEO track-root JSONs; prune movers from SAO root (evidence: 28 children listed; SAO root 100→98)


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-301 Capture pre-migration strict-validate baseline (evidence: MAIN CEO PASSED=0 FAILED=24)
- [x] T-302 Run strict-validate --recursive on migrated tree (evidence: migration-invariants all PASS; 0 new error categories)
- [x] T-303 Confirm regression-neutral delta (evidence: metadata-integrity 3→1; no new `x` categories vs baseline)
- [x] T-304 Independent GPT-5.6-LUNA (max) read-only audit of 8 invariants
- [ ] T-305 Commit with explicit-path staging + fast-forward push
- [ ] T-306 Reindex memory+vector DB (deferred to MAIN post-merge)


<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- All Phase 1–2 tasks `[x]` with evidence.
- Migration-invariant validators green; strict-validate regression-neutral vs baseline.
- LUNA audit verdict recorded.
- Commit pushed fast-forward; reindex tracked as a deferred follow-up.


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
