---
title: "Tasks: Phase 5: claim-corrections"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "claim corrections tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: claim-corrections

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

- [x] T001 Reproduce each claim: ceiling report, test count with its git history, and the checker's `--all` output
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P] Build the ceiling row correction through DeepSeek V4.1 Flash at max
- [x] T003 [P] Build the test count correction through DeepSeek V4.1 Flash at max
- [x] T004 [P] Build the header comment through DeepSeek V4.1 Flash at max, then pluralize "the other" to "the others" (`check-agent-mirror-sync.cjs`)
- [x] T005 Bump `SKILL.md` to 1.19.2.0, write `changelog/v1.19.2.0.md` and regenerate the Hermes copy
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Rerun the three commands
- [x] T007 Run `node --check` on the checker
- [x] T008 Run Hermes and strict validation
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
