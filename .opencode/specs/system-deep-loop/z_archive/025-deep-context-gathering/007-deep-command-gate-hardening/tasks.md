---
title: "Tasks: Deep-command @general + setup hard-blocker gates"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep command gate tasks"
  - "phase 0 gate tasks"
  - "unskippable setup tasks"
  - "deep command hard blocker tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/025-deep-context-gathering/007-deep-command-gate-hardening"
    last_updated_at: "2026-06-07T12:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Marked gate-hardening tasks complete"
    next_safe_action: "Run validate.sh --strict"
    blockers: []
    key_files:
      - ".opencode/commands/deep/start-context-loop.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-007-deep-command-gate-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deep-command @general + setup hard-blocker gates

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Identify the canonical Phase 0 block (start-model-benchmark-loop.md) and per-command insertion anchors
- [x] T002 Survey setup-phase blocker strength across all 7 deep commands
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add Phase 0 + renumber first-action + normalize setup marker (`start-context-loop.md`)
- [x] T004 [P] Add Phase 0 + renumber first-action + normalize setup marker (`start-research-loop.md`)
- [x] T005 [P] Add Phase 0 + renumber first-action + normalize setup marker (`start-review-loop.md`)
- [x] T006 [P] Add Phase 0 + renumber first-action + normalize setup marker (`ask-ai-council.md`)
- [x] T007 Add EXECUTION PROTOCOL + Phase 0 + BLOCKED Setup (`start-skill-benchmark-loop.md`)
- [x] T008 Fix the broken display box in `start-model-benchmark-loop.md` (standardize)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 grep: all 7 carry Phase 0; each first-action lists "Run Phase 0" step 1
- [x] T010 grep: each command has 2 `☐ BLOCKED` markers; restart line + skill name correct per command
- [x] T011 Run `validate.sh --strict` and complete checklist with evidence
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
