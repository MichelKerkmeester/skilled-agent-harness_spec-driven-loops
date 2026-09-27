---
title: "Tasks: Phase 11: spec-validator-fixes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "spec validator fixes tasks"
  - "ac coverage unresolved citation tasks"
  - "check-goal goal.md path tasks"
  - "spec validator verification checklist"
  - "create.sh phase label tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: spec-validator-fixes

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] T001 Record the baseline: `bash .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh` (25 passed), `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` (15 pass) and the exit 2 of `check-goal.cjs` on `006-goal-criteria-lint/goal.md`
- [ ] T002 Read the owner contracts: `system-spec-kit/SKILL.md`, `references/validation/validation-rules.md` section on `AC_COVERAGE`, `sk-create-goal/SKILL.md`, `sk-create-goal/scripts/README.md` and the `sk-code` rules for shell and Node
- [ ] T003 Rerun `git log -5 --format='%h %ad %s' --date=short` and `git status --short` on every file in Files to Change. Stop and report any change newer than the one recorded in `goal.md`'s log
- [ ] T004 Get the orchestrator's order for phase 006's `git diff --quiet` check against this build
- [ ] T005 [P] Confirm `rg -n 'has_file_line' .skilled/skills/system-spec-kit/runtime/cli/rules/` shows only `check-ac-coverage.sh:291` and `:346`
- [ ] T006 [P] Record the `create.sh` baseline: `bash .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh` prints `10 passed, 0 failed (of 10)`, and `create.sh:1489`, `:1511` and `:1523` still build labels from `_i`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Find the repository root once in `run_check()` and pass the folder and root to both awk parsers (`.skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh`)
- [ ] T008 Add the resolution rule to `_ac_analyze_canonical()`: absolute as written, else folder, else root, readable file and 1 <= line <= line count, and collect `AC-ID (path:line)` for each unresolved citation without touching the covered count (`check-ac-coverage.sh`)
- [ ] T009 Add the same rule to `_ac_analyze_traceability()` (`check-ac-coverage.sh`)
- [ ] T010 Append the unresolved list as a fifth TSV field, write `-` for an empty id list, and read it in `run_check()` into one `Unresolved evidence citation(s):` detail (`check-ac-coverage.sh`)
- [ ] T011 [P] In `main()`, replace a packet argument whose basename is `goal.md` and that is not a directory with its folder (`.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs`)
- [ ] T012 [P] Add unresolved citations to the `AC_COVERAGE` paragraph (`.skilled/skills/system-spec-kit/references/validation/validation-rules.md`)
- [ ] T013 [P] Say that `<packet>` may be the folder or its `goal.md` in section 5 (`.skilled/skills/sk-doc/sk-create-goal/scripts/README.md`)
- [ ] T014 In the child loop, set the phase number from the child folder's `NNN` prefix with `10#` and use it in the labels at `:1489`, `:1511` and `:1523` (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`)
- [ ] T015 Keep code comments free of spec paths, phase numbers and REQ or task ids. Comments state the durable reason only
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Add canonical-parser cases: a packet-relative citation that resolves, a missing file, a line past the end and a root-relative citation inside a temporary `git init` repository (`.skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh`)
- [ ] T017 Add legacy-parser cases: a resolving citation and a missing file in a merged `tasks.md` traceability table (`tests/check-ac-coverage.sh`)
- [ ] T018 [P] Add command-line cases: a `goal.md` path matches the folder's stdout and exit 0, and another file path exits 2 with `packet path is not a directory` (`.skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs`)
- [ ] T019 Run both suites in full and compare with the T001 baseline
- [ ] T020 Time `validate.sh --strict` on the packet with the most citations before and after, and record both numbers
- [ ] T021 Run `validate.sh --strict` on one real packet with unresolved citations and confirm the new detail and an unchanged ratio
- [ ] T022 Record the owner's answer on counting (option A, B or C), or record that none was requested
- [ ] T023 Extend the description-generator stub to log `--description`, then add an append-mode case asserting "Phase 2" and "Phase 3" for `002-implementation` and `003-integration` in the stub log, `graph-metadata.json` and the `spec.md` title (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh`)
- [ ] T024 Run `tests/test-phase-system.sh` in full and compare with the T006 baseline
- [ ] T025 Record the owner's answer on label detection (option A, B or C), or record that none was requested
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available, including the 006 build order
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `bash -n` passes on both changed shell files and `node --check` passes on `check-goal.cjs`
- [ ] CHK-011 [P0] No new stderr output from either validator on the existing fixtures
- [ ] CHK-012 [P1] An unreadable citation is reported and never stops the rule
- [ ] CHK-013 [P1] Code follows the owner patterns: the detail line mirrors `Malformed evidence citation(s):`, and the checker stays read-only
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual `validate.sh --strict` run on a real packet shows the detail and the unchanged ratio
- [ ] CHK-022 [P1] Edge cases tested: missing file, line past the end, legacy parser, non-goal file path, a new parent's single child
- [ ] CHK-023 [P1] Error scenarios validated: git unavailable falls back to the working directory
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. The citation check is `class-of-bug` (two parser copies). The `goal.md` path is `instance-only`. The `create.sh` label is `class-of-bug` (three label sites)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented: the rule prints citation text only, never file content
- [ ] CHK-032 [P1] Auth/authz working correctly: not applicable, no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate and free of spec paths and ids
- [ ] CHK-042 [P2] `validation-rules.md` and the sk-create-goal `scripts/README.md` updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not verified. The phase is Planned
<!-- /ANCHOR:summary -->

---

