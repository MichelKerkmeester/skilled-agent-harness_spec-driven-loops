---
title: "Tasks: Phase 3: drift-guard-warning-count"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "drift guard warning count tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: drift-guard-warning-count

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

- [x] T001 Run the umbrella and record the baseline: exit 0, 272 `[WARN]` lines, all from the alignment guard, all on stdout
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Build the warning count through DeepSeek V4.1 Flash at max (`run-all-drift-guards.sh`)
- [x] T003 Drop the builder's `2>&1`, which folded each guard's 281 stderr lines into stdout
- [x] T004 Build the README update through DeepSeek V4.1 Flash at max, then reword its table clause (`scripts/README.md`)
- [x] T005 Bump `SKILL.md` to 1.2.2.0, write `changelog/v1.2.2.0.md` and regenerate the Hermes copy
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Rerun the umbrella and confirm the counts, exit code and PASS lines
- [x] T007 Validate the README and changelog
- [x] T008 Run Hermes and route guard checks, then strict validation
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
