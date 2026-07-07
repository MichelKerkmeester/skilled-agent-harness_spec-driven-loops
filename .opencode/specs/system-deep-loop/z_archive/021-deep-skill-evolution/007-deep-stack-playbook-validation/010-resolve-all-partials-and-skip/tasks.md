---
title: "Tasks: Resolve all 007 PARTIALs + DR-032 SKIP (Phase 010)"
description: "Task list for the five-category PARTIAL/SKIP resolution."
trigger_phrases:
  - "resolve all partials tasks"
  - "007 phase 010 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/007-deep-stack-playbook-validation/010-resolve-all-partials-and-skip"
    last_updated_at: "2026-05-28T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "All 31 PARTIAL + 1 SKIP resolved - 177/177 PASS, matrix READY"
    next_safe_action: "validate --strict all touched + parent reconcile + report"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-deep-loop-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Resolve all 007 PARTIALs + DR-032 SKIP (Phase 010)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[~]` | Partial / residual kept |

**Task Format**: `T### Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Inventory 31 PARTIAL + 1 SKIP across 002/003/004/005; assign fix-classes A–E
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 (A) Broaden field-greps for CP-042/043/046/055/056; re-verify against 009 artifacts
- [x] T003 (B) Investigate DAC-026 (count) + DAC-029..032 (≥10× bar); fix stale expectations if implementation confirmed correct
- [x] T004 (C) Live opencode re-run: E2E-020..024 (deep-agent-improvement)
- [x] T005 (C) Live opencode re-run: DR-016/020/021/022/023/024/033 (deep-research)
- [x] T006 (C) Live opencode re-run: DRV-023/033/034 (deep-review)
- [x] T007 (C) Live opencode re-run: DAC-005/006/025 (deep-ai-council)
- [x] T008 (D) Build DR-032 blocked_stop fixture; run
- [x] T009 (E) 5D-010 scorer empty-dimension decision (+ code + vitest, or documented)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Flip 002/003/004/005 ledgers + summary lines (PASS where verified; PARTIAL+reason for residuals)
- [x] T011 Re-tally `release-readiness-matrix.md`; recompute verdict
- [x] T012 validate.sh --strict 010 + touched 007 children + parent; reconcile parent cursor
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every PARTIAL/SKIP flipped PASS with evidence OR kept PARTIAL with documented reason
- [x] Matrix re-tallied + verdict recomputed; all packets validate --strict
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../009-cp-copilot-to-opencode-swap` (CP swap + the 5 category-A scenarios)
- **Consuming**: `../002`/`../003`/`../004`/`../005` ledgers; `../006-release-readiness-synthesis/release-readiness-matrix.md`
<!-- /ANCHOR:cross-refs -->
