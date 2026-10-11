---
title: "Tasks: Phase 6: hook-late-write-test"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "hook late write test tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: hook-late-write-test

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

- [x] T000 Capture the before numbers the goal criteria compare against (`goal.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T001 Add the write delay and the late-write test through a cli-pi build (`hook-stdin-deadline.test.mjs`)
- [x] T002 Write the changelog through a cli-pi build (`changelog/v2.7.2.1.md`)
- [x] T003 Bump the version line through a cli-pi build (`SKILL.md`)
- [x] T004 Regenerate the Hermes copy and the trigger index (`.hermes/skills/system-spec-kit/SKILL.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Rerun the suite, the mutant and both `--check` modes (`goal.md`)
- [x] T006 Strict-validate this phase (`spec.md`)
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
