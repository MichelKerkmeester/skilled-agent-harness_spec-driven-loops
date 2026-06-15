---
title: "Tasks: Phase 6: Thin + standardize CLI cards"
description: "Task tracking for thinning 4 CLI prompt-quality cards and reconciling the cli-devin semantic fork."
trigger_phrases:
  - "thin cli cards tasks"
  - "cli prompt card tasks"
  - "006 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/130-prompt-knowledge-layering/006-thin-and-standardize-cli-cards"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "sonnet-impl"
    recent_action: "All tasks complete"
    next_safe_action: "Proceed to phase 007"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-006-thin-and-standardize-cli-cards"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: Thin + standardize CLI cards

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Confirm phase 005 hub profiles exist for all active small models
- [x] T002 Confirm canonical card in sk-prompt carries current framework table and CLEAR scoring
- [x] T003 [P] Verify duplication guard script is operational and baseline line counts are known (cli-opencode 96, cli-gemini 89, cli-codex 90, cli-claude-code 90, cli-devin 49)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Thin cli-opencode prompt_quality_card.md from 96 to 37 lines: remove inline framework table, add canonical card link, repoint per-model note to hub profile
- [x] T005 Thin cli-gemini prompt_quality_card.md from 89 to 35 lines: remove inline framework table, add canonical card link, repoint per-model note to hub profile
- [x] T006 Thin cli-codex prompt_quality_card.md from 90 to 28 lines: remove inline framework table, add canonical card link, repoint per-model note to hub profile
- [x] T007 Thin cli-claude-code prompt_quality_card.md from 90 to 44 lines: remove inline framework table, add canonical card link, repoint per-model note to hub profile
- [x] T008 Reconcile cli-devin prompt_quality_card.md: adopt canonical CLEAR axes, reframe STAR/BUILD/ATLAS as model-selection MECHANICS addendum, move permission-mode check to "not a CLEAR axis" addendum, delegate SWE-1.6 contract to hub profile
- [x] T009 Add 3-tier precedence rule (hub profile > card default > CLEAR baseline) to canonical sk-prompt card and repoint per-model note in each delegating mirror to the hub
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run duplication guard on cli-opencode card — confirm GREEN (framework table absent)
- [x] T011 Run duplication guard on cli-gemini card — confirm GREEN
- [x] T012 Run duplication guard on cli-codex card — confirm GREEN
- [x] T013 Run duplication guard on cli-claude-code card — confirm GREEN
- [x] T014 Run duplication guard on cli-devin card — confirm GREEN (STAR/BUILD/ATLAS absent as framework labels)
- [x] T015 Run full 5-card duplication guard sweep — all 5 cards exit GREEN simultaneously
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
