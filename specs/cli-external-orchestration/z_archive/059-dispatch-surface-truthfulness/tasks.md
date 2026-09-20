---
title: "Tasks: Dispatch Surface Truthfulness"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Remove the exhausted default model and correct the deep-loop executor roster so a dispatch surface cannot silently lie

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

- [x] T001 Confirm the cause is quota, not a hang — `--print-logs --log-level DEBUG` surfaced `Monthly usage limit reached. Resets in 7 days` for `opencode-go/deepseek-v4-flash`
- [x] T002 Read the runtime roster — `EXECUTOR_KINDS` exports seven executors including `cli-cursor`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Remove the hardcoded default at all three sites that stated it (`cli-opencode/SKILL.md`)
- [x] T004 Add the pre-flight liveness check, naming the debug level that reveals the quota message
- [x] T005 Correct the executor roster in the authored source (`deep-review-presentation.txt`)
- [x] T006 Regenerate the compiled contract with the compiler's write flag, not by hand
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Roster diff — authored source and compiled contract now list exactly the runtime's executors
- [x] T008 Pre-flight proven on both sides: the exhausted model reports quota, two live models answer at exit 0
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



