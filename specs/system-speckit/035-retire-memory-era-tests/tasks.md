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
- [x] T020 Send the description generator's output to stderr and parse `--json` stdout strictly (`runtime/cli/spec/create.sh`, `runtime/cli/tests/test-phase-system.js`)
- [x] T021 Replace the renderer's regex fallback with a plain-JavaScript copy of the renderer (`runtime/cli/templates/inline-gate-renderer.sh`)
- [x] T022 Read a template path given before `--level` in both renderers (`runtime/cli/templates/inline-gate-renderer.{ts,sh}`)
- [x] T023 Replace the level contract fallback with a plain-JavaScript copy of the resolver (`runtime/cli/lib/template-utils.sh`)
- [x] T024 Fill the phase map of `specs/sk-design/020-chart-and-diagram-review`
- [x] T028 Warn on stderr for each generated file skipped for want of a build (`runtime/cli/spec/create.sh`)
- [x] T029 Give `specs/sk-design/020-chart-and-diagram-review/synthesis.md` a title, description and trigger phrases
- [x] T032 Stop `--level phase-parent` without the description generator, as `--phase` does (`runtime/cli/spec/create.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 The three phase tests pass and leave the checkout and the temp directory unchanged
- [x] T016 The `cli` vitest project passes, with the two renamed files collected
- [x] T017 The sk-doc README snapshot tests pass
- [x] T018 The suites that drive create.sh and validate.sh pass after each fix
- [x] T019 A search outside history finds no reference to a deleted file
- [x] T025 Each fallback matches its TypeScript source in a parity test that failed before its port, and an injected defect turns that test red (`runtime/cli/tests/inline-gate-renderer-fallback.vitest.ts`, `level-contract-fallback.vitest.ts`)
- [x] T026 From a `git archive` export with no install, create.sh scaffolds Level 2 and 3 packets that differ from a tsx scaffold only in timestamps
- [x] T027 A search of `specs/` finds no `spec.md` still holding the phase row marker
- [x] T030 A scaffold with no build reports every skipped generator, and the test turns red when a warning is removed (`runtime/cli/tests/create-without-build.vitest.ts`)
- [x] T031 sk-design/020 validates with no errors or warnings, and recursively with one pre-existing warning per child
- [x] T033 A phase parent with no build exits 1 with the `--phase` message, and the test fails with only that check removed
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
