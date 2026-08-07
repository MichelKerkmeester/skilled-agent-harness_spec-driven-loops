---
title: "Tasks: system-deep-loop Runtime Remediation (from dogfood findings)"
description: "Task ledger for triaging and (once confirmed) fixing real dogfood findings."
trigger_phrases:
  - "system-deep-loop remediation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-deep-alignment-mode/000-deep-loop-runtime-refinement"
    last_updated_at: "2026-07-11T08:54:42Z"
    last_updated_by: "claude"
    recent_action: "Phase 0 (triage) complete, Phase 1+ blocked on operator confirmation"
    next_safe_action: "Operator confirms remediation scope"
    blockers:
      - "No code changes made yet — awaiting operator confirmation"
    key_files:
      - "tasks.md"
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Tasks: system-deep-loop Runtime Remediation (from dogfood findings)

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `research/research.md` (all 17 sections, 47 findings) and `review/deep-review-findings-registry.json` (15 open P1 findings) in full.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P1] Cross-referenced findings corroborated by both loops independently (Tier 1) vs. single-loop-but-well-evidenced (Tier 2) vs. needs-more-investigation (Tier 3); result recorded in `spec.md:§5` (2 Tier-1, 5 Tier-2, 3 Tier-3 items).
- [x] T003 Spot-verified every Tier-1/Tier-2 candidate's cited file:line directly before including it in `spec.md` §5 — none taken purely on the source loop's word.
- [ ] T004 [B] Blocked on operator confirmation: which Tier-1/Tier-2 findings to actually fix, and in what order (Phase 1+ remediation in `plan.md`, not started).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

N/A for this planning-only pass — no code changes to verify. Fix-verification tasks will be added here once Phase 1+ remediation (per `plan.md`) is confirmed and started.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`. — Phase 0 complete; Phase 1+ intentionally not started.
- [ ] No `[B]` blocked tasks remaining. — T004 blocked on operator decision, by design.
- [ ] `validate.sh --strict` exits 0 for this folder.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source of findings**: `../../052-deep-loop-unification/008-divergent-mode-dogfood/`
<!-- /ANCHOR:cross-refs -->
