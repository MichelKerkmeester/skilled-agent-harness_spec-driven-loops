---
title: "Tasks: Orchestrate NDP-Safe Universal Routing"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "orchestrate universal routing"
  - "orchestrate registry delegation"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/009-orchestrate-universal-routing"
    last_updated_at: "2026-07-01T15:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 14 tasks complete; validate.sh --strict passing"
    next_safe_action: "Proceed to phase 010"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-009-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Orchestrate NDP-Safe Universal Routing

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] T001 Confirm phase 008 is complete.
- [x] T002 Re-read `orchestrate.md` (`.opencode` and `.claude`); line numbers unchanged from phase 008 planning (Priority table :97-105, NDP LEAF list :116, Agent Files table :180-188, Task-format block :206-207).
- [x] T003 Re-confirmed `mode-registry.json`'s 4 entries; used `agent` field values directly (`deep-context`, `deep-research`, `deep-review`, `ai-council`) for the new rows.
- [x] T004 Grep found no other doc quoting the Priority table verbatim.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Added `@deep-context` (priority 2, grouped near `@context`) and `@deep-review` (priority 7, grouped near `@review`) rows; renumbered existing rows 2-7 to 3-9.
- [x] T006 Added `@deep-context` to the NDP LEAF list (`@deep-review` was already present from earlier in-flight work).
- [x] T007 Added `@deep-context` and `@deep-review` rows to the Agent Files table.
- [x] T008 Added an explicit registry-backed resolution rule paragraph after the Task Format block (the `Deep Route:` field itself already cited `mode-registry.json` as `source_of_truth` from the earlier in-flight edit; the missing piece was the explicit "look it up, never infer" instruction plus a stop-before-dispatch clause for unmatched modes).
- [x] T009 Added a 4th Illegal Chain example (`Orch(0) → @deep(1)`) plus an explicit prose boundary statement in the NDP section.
- [x] T010 [P] Mirrored T005-T009 to `.claude/agents/orchestrate.md` (file paths adjusted to `.claude/agents/*.md`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Traced both: `/deep:context` -> Priority row 2 -> `@deep-context` -> registry `agent: "deep-context"` (match); `/deep:review` -> Priority row 7 -> `@deep-review` -> registry `agent: "deep-review"` (match). No judgment call needed in either.
- [x] T012 Grep confirmed symmetric occurrence counts across both runtime files (`@deep-context`: 4, `@deep-research`: 6, `@deep-review`: 5, `@ai-council`: 6 -- identical in `.opencode` and `.claude`).
- [x] T013 `git diff` confirmed only priority numbers changed on existing rows; task-type text, agent names, tiers, skills, and subagent_type all byte-identical.
- [x] T014 Ran `validate.sh --strict`: see `implementation-summary.md` Verification.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual trace passes (T011).
- [x] Cross-table consistency confirmed (T012).
- [x] Non-deep routing unchanged (T013).
- [x] Strict spec validation passes (T014).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Predecessor**: `../008-mode-d-ai-council-identity-fix/`
- **Research**: `../007-gpt-behavioral-hardening-research/research/research.md`
<!-- /ANCHOR:cross-refs -->

---
