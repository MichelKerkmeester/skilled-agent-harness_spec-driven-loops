---
title: "Task Breakdown: sk-prompt Spec Consolidation [skilled-agent-orchestration/141-sk-prompt-spec-consolidation/tasks]"
description: "Task tracking for the sk-prompt consolidation: recon, two-phase move, reference repair, regeneration, verification, and landing."
trigger_phrases:
  - "sk-prompt consolidation tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/141-sk-prompt-spec-consolidation"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Task breakdown authored"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 90
    status: "Complete"
---
# Task Breakdown: sk-prompt Spec Consolidation

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

- [x] T-101 Enumerate + classify sk-prompt candidates; 017/032/077 operator-excluded (evidence: purposes read, scope confirmed)
- [x] T-102 Confirm the 3 movers committed at HEAD; capture pre-migration baseline (evidence: baseline total errors = 25)
- [x] T-103 Build chronological interleave map, 6 packets → 001–006 (evidence: existing 003/068/105 + movers 071/121/124)
- [x] T-104 Allocate isolated worktree off origin tip (evidence: `.worktrees/0046-skilled-sk-prompt-consolidation`)


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-201 Two-phase git-mv all 6 packets into sk-prompt/001-006 (evidence: contiguous 001–006, movers removed from SAO)
- [x] T-202 Confirm rename history preserved (evidence: `R`-status renames + source-side deletions)
- [x] T-203 Reference repair: qualified-before-bare, slug-qualified, scoped to sk-prompt tree (evidence: residual = 0)
- [x] T-204 Author sk-prompt root JSONs (none existed); prune dangling movers from SAO root (evidence: 6 children listed; SAO root 3 dangling entries removed)
- [x] T-205 Regenerate description.json + graph-metadata.json per folder (evidence: 47 folders, global-DB mtime unchanged)


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-301 Capture pre-migration strict-validate baseline (evidence: 25 total errors across the 6 packets)
- [x] T-302 Run strict-validate on migrated tree; measure by error count (evidence: post 11 errors)
- [x] T-303 Confirm regression-neutral-or-better; verify no coverage gap (evidence: 004 covers all 17 children; delta 25→11 is regen fixing stale metadata)
- [x] T-304 Independent GPT-5.6-LUNA (max) read-only audit
- [ ] T-305 Commit with explicit-path staging + fast-forward push
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
