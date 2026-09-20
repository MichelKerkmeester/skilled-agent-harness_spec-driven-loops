---
title: "Tasks: Retire the Gemini 3.8 Flash route from cli-devin"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "retire gemini devin tasks"
  - "devin allowlist removal tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Retire the Gemini 3.8 Flash route from cli-devin

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

- [x] T001 Inventory every registration of the uid across skills and runtime (ripgrep)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Remove the uid and record the reason (runtime/lib/deep-loop/executor-config.ts, runtime/scripts/fanout-run.cjs)
- [x] T003 Move the uid to the rejected list (runtime/tests/unit/fanout-run.vitest.ts)
- [x] T004 Remove the family and add the retirement note (cli-devin/SKILL.md, cli-devin/references/providers-and-models.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Run the deep-loop typecheck and the two unit files
- [x] T006 Validate the two cli-devin documents
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
