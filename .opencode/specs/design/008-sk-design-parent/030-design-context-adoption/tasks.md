---
title: "Tasks: adopt the sk-design context-loading contract"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "context loading contract tasks"
  - "sk-design adoption build tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/030-design-context-adoption"
    last_updated_at: "2026-06-27T15:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Marked all build + verify tasks complete"
    next_safe_action: "Optional follow-ups; otherwise phase complete"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-030-design-context-adoption"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: adopt the sk-design context-loading contract

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

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

- [x] T001 Explore pass to pin exact insertion points across the design + dispatch skills
- [x] T002 Create the `030` packet; capture git baseline `3c170c46de`
- [x] T003 Author four file-scoped cli-codex prompts (allowed-write lists) + sequential driver
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 T-A: shared `context_loading_contract.md` + `context_loaded_card.md` + `proof_of_application_card.md`
- [x] T005 T-B: hub bundle rule + interface/foundations/audit SKILL hooks + `contrast_pair_inventory.md`
- [x] T006 T-C: cli-opencode design dispatch template + MiniMax-M3 Design-Task variant
- [x] T007 T-D: four manual-test scenarios (skipped register, late contrast, ad-hoc audit, thin small-model)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Independent router/anchor-intact check on the four edited SKILLs; confirm scope (18 files only)
- [x] T009 Fresh opus reviewer: coherence + cross-refs + sk-doc alignment; 6 safe fixes applied (PASS-WITH-FIXES)
- [x] T010 Author wrapper docs; generate metadata; run `validate.sh --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] 18 files validate clean; routers/anchors intact; strict validation clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Spec (research)**: `../029-design-context-loading/research/research.md`
<!-- /ANCHOR:cross-refs -->
