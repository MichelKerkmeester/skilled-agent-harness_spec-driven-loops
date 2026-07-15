---
title: "Task Breakdown: MCP-tooling Spec Consolidation [skilled-agent-orchestration/140-mcp-spec-consolidation/tasks]"
description: "Task tracking for the mcp-tooling consolidation: recon, move, reference repair, regeneration, verification, and landing."
trigger_phrases:
  - "mcp consolidation tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/140-mcp-spec-consolidation"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Task breakdown authored"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 90
    status: "Complete"
---
# Task Breakdown: MCP-tooling Spec Consolidation

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

- [x] T-101 Enumerate + classify MCP-tooling candidates; 065 operator-excluded (evidence: purposes read, goal set)
- [x] T-102 Confirm all 8 movers committed at HEAD (evidence: git cat-file on origin tip)
- [x] T-103 Build chronological map, 8 movers → 001–008 (evidence: /tmp/mcp-map.json, clash=0)
- [x] T-104 Allocate isolated worktree off origin tip (evidence: `.worktrees/0044-skilled-mcp-tooling-consolidation`)


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-201 Single-phase git-mv all 8 packets into mcp-tooling/001-008 (evidence: contiguous 001–008, movers removed from SAO)
- [x] T-202 Confirm rename history preserved (evidence: 184 `R`-status entries)
- [x] T-203 Category-qualified identity rewrite scoped to mcp tree (evidence: 140 files / 360 replacements)
- [x] T-204 Bare-token rewrite for stale bare self-refs, scoped to mcp tree (evidence: 10 files / 17 replacements; residual = 0)
- [x] T-205 Regenerate description.json + graph-metadata.json per folder (evidence: 23 + 20, global-DB mtime unchanged)
- [x] T-206 Author mcp-tooling root JSONs; prune movers from SAO root (evidence: 8 children listed; SAO root 98→91)


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-301 Capture pre-migration strict-validate baseline (evidence: 8 movers at old SAO paths, 13 total errors)
- [x] T-302 Run strict-validate on migrated tree; measure by error count (evidence: post 12 errors)
- [x] T-303 Confirm regression-neutral delta (evidence: 0 folders gained errors; total 13→12; coco bare-ref fixed, figma improved)
- [x] T-304 Independent GPT-5.6-LUNA (max) read-only audit of 8 invariants
- [ ] T-305 Commit with explicit-path staging + fast-forward push
- [ ] T-306 Reindex memory+vector DB (operator-gated / skipped)


<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- All Phase 1–2 tasks `[x]` with evidence.
- Migration-invariant validators green; strict-validate regression-neutral vs baseline.
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
