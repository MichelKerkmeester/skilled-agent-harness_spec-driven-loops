---
title: "Tasks: Phase 2: webflow-runtime-and-references"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "webflow runtime and references tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: webflow-runtime-and-references

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

- [x] T001 Read `test-minified-runtime.mjs` and both fixture families, and record the before output (no warning, known-good exit 0, known-bad exit 1)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Build the skip counter and warning line through DeepSeek V4.1 Flash at max (`test-minified-runtime.mjs`)
- [x] T003 [P] Build the evidence subsection removal through DeepSeek V4.1 Flash at max (`scroll-interceptor-and-related.md`)
- [x] T004 Bump `SKILL.md` to 1.1.3.0 and write `changelog/v1.1.3.0.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Rerun both fixture families and confirm the warning and verdicts
- [x] T006 Validate the edited reference and the changelog
- [x] T007 Run Hermes, trigger index and compiled route checks, then strict validation
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
