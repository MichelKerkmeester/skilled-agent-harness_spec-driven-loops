---
title: "Tasks: review-leaf-protocol"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "review leaf protocol"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: review-leaf-protocol

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

- [x] T001 Read the runner's stop-policy check and the lineage prompt builder; confirm the prompt already gives the absolute directory but not the copy-verbatim or stop-reason duties (`runtime/scripts/fanout-run.cjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add the two prompt sentences, the second only under `max-iterations` (`runtime/scripts/fanout-run.cjs`)
- [x] T003 Add the two Write Safety bullets to the agent contract; sync codex, pi and Claude mirrors; recompile the review contract (`.opencode/agents/deep-review.md`)
- [x] T004 [P] Resolve the child vitest from the runtime's own binary in the three determinism tests (`runtime/tests/unit`)
- [x] T005 Add the prompt test (`runtime/tests/unit/fanout-run.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Runner suite 117 of 117; determinism files 132 of 132
- [x] T007 Agent mirrors 12 of 12 in sync; contract drift OK for 3 commands
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
