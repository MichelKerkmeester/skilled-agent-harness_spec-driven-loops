---
title: "Tasks: Phase 6: command-contract-structural [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "017-search-and-output-intelligence-implementation/006-command-contract-structural"
    last_updated_at: "2026-06-17T08:30:00Z"
    last_updated_by: "implementer"
    recent_action: "Shipped /memory:search arg header + salience inversion; tasks superseded"
    next_safe_action: "FOLLOW-UP: live A/B --command execute-rate run on Kimi/MiMo (cannot run here)"
    blockers: []
    key_files:
      - ".opencode/commands/memory/search.md"
      - ".opencode/commands/memory/assets/search_presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-006-command-contract-structural"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "How to stop weak models dropping the query? -> compute ARGS_PRESENT/QUERY in shell, invert salience, gate the ask-path."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: command-contract-structural

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

- [x] T001 Confirm renderer expands `$ARGUMENTS` one word per argument inside `` !`…` `` injections
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add §0 ARGUMENT RESOLUTION shell header joining argv into `QUERY` + emitting `ARGS_PRESENT` (search.md)
- [x] T005 Reorder sections so RETRIEVAL/ANALYSIS precede the gated STARTUP (search.md)
- [x] T006 Add imperative no-ask guard + arg-echo self-correction rule bound to `ARGS_PRESENT`/`QUERY` (search.md)
- [x] T007 Gate presentation §1 Startup Question Policy behind `ARGS_PRESENT=false` (search_presentation.txt)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Manual check: a populated `/memory:search "<query>"` executes retrieval, not the startup question
- [x] T009 Edge cases: multi-word query joined; embedded double-quotes escaped in `QUERY`
- [x] T010 `implementation-summary.md` written (live A/B execute-rate is a documented follow-up)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

