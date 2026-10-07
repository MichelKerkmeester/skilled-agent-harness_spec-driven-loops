---
title: "Tasks: Let the deep-loop cli-pi executor reach DeepSeek V4.1 Flash through opencode-go"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cli pi opencode go route tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Let the deep-loop cli-pi executor reach DeepSeek V4.1 Flash through opencode-go

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

- [x] T001 Baseline the three runtime test files: 260 tests, one flaky failure on the first run and none on the second
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add `opencode-go/deepseek-v4.1-flash` to `PI_ALLOWED_MODELS` and `PI_MODEL_PROVIDERS` and use a provider-named literal as the selector (`fanout-run.cjs`)
- [x] T003 Add the literal to `PI_SUPPORTED_MODELS` (`executor-config.ts`)
- [x] T004 Roster test and command test (`executor-config.vitest.ts`, `fanout-run.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Rerun the three test files: 261 tests, 0 failed, exit 0
- [x] T006 Revert the selector line and watch the new test fail with `opencode-go/opencode-go/deepseek-v4.1-flash`, then restore it
- [x] T007 Live `pi` canary on `opencode-go/deepseek-v4.1-flash` at `--thinking max`: `CANARY-OK`, exit 0, no error
- [x] T008 Update the cli-pi route row and the PI-017 roster count and line range
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



