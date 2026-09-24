---
title: "Tasks: Retire memory-era tests and revive the phase tests"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "retire memory-era tests"
  - "dead spec-kit test files"
  - "test-phase-validation cannot load"
  - "manual playbook runner retired"
  - "memory-quality test never collected"
  - "phase map rows never filled"
  - "empty phase child skipped"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Retire memory-era tests and revive the phase tests

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

- [x] T001 Trace each dead test to the module or layout it needs, and confirm the live embedding factory is covered elsewhere
- [x] T002 List every live reference to the files to delete, outside `specs/` and the changelogs
- [x] T003 Record the baseline: the phase tests throw at load, the bash test stops at case 1, the factory test exits 1, the sk-doc snapshots pass
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Delete the retired-code tests and the archive folder, and update `package.json`, `runtime/vitest.config.ts`, `CONTRIBUTING.md`, the quality-lane docs and the sk-doc snapshots
- [x] T005 Retire the playbook runner, its fixture, its allowlist entries and its doc references
- [x] T006 Revive the phase tests: ES-module header, throwaway repo, generator stub, real renderer, one work root (`runtime/cli/tests/test-phase-*.{js,sh}`)
- [x] T007 Bring stale assertions up to date: March phase scores, four-column map, one validation document per folder, create.sh status line ahead of JSON
- [x] T008 Sharpen the assertions that caught defects, and confirm each fails on the unfixed code
- [x] T009 Match the template's phase and handoff row markers (`runtime/cli/spec/create.sh`)
- [x] T010 Append phase and handoff rows where each table ends (`runtime/cli/spec/create.sh`)
- [x] T011 Validate an empty phase child, keep skipping an artifact-only one (`runtime/cli/spec/validate.sh`)
- [x] T012 Rename the memory-quality tests to `.vitest.ts`
- [x] T013 Add the phase tests to `test:legacy` and `test:validation` (`runtime/cli/package.json`)
- [x] T014 Delete `test-five-checks.js`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 The three phase tests pass and leave the checkout and the temp directory unchanged
- [x] T016 The `cli` vitest project passes, with the two renamed files collected
- [x] T017 The sk-doc README snapshot tests pass
- [x] T018 The suites that drive create.sh and validate.sh pass after each fix
- [x] T019 A search outside history finds no reference to a deleted file
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
