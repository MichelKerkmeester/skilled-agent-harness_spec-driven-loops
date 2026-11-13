---
title: "Tasks: Phase 23: ci-sparse-big-suites"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "ci sparse big suites tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 23: ci-sparse-big-suites

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup


- [x] T001 Run the spec-kit, deep-loop and sk-doc suites in a scratch clone without the four folder kinds (`.skilled/skills/system-spec-kit/runtime/package.json`). Verify: each suite's failing tests are listed. Evidence: 10, 72 and 2 failing.
- [x] T002 Run the same suites in the same clone with the full checkout (`.skilled/skills/system-deep-loop/runtime/package.json`). Verify: the two lists are compared. Evidence: 1, 71 and 0 failing, so 9, 1 and 2 tests fail only without loop state. Listed in spec.md under Measured Behavior.
- [x] T003 Read the paths the six dependent test files use (`.skilled/skills/system-deep-loop/runtime/tests/helpers/legacy-real-log.ts`). Verify: each path exists in the repository. Evidence: two archived packets and one archived fixture folder for the CLI suites, five recorded loop logs for deep-loop.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation


- [x] T004 Prove the narrowed patterns in the scratch clone (`.skilled/skills/system-spec-kit/runtime/cli/tests/gate-3-classifier.vitest.ts`). Verify: the dependent files pass. Evidence: the three CLI files pass 74 tests with 1 skipped, and `deep-research-ledger-schema.vitest.ts` passes 52.
- [x] T005 Add the sparse checkout to the `cli-vitest` and `runtime-vitest` jobs (`.github/workflows/spec-kit-check.yml`). Verify: `grep -c 'sparse-checkout-cone-mode: false' .github/workflows/spec-kit-check.yml` prints 2.
- [x] T006 Add the sparse checkout to the deep-loop job and keep its fetch depth (`.github/workflows/deep-loop-runtime.yml`). Verify: `actionlint` exits 0 and `grep -c 'fetch-depth: 2' .github/workflows/deep-loop-runtime.yml` prints 1.
- [x] T007 Describe the three jobs and update two cited line numbers (`.github/workflows/README.md`, `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md`). Verify: `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py` prints `PARITY PASS`.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification


- [x] T008 Read the checks on the pull request (`.github/workflows/spec-kit-check.yml`). Verify: `gh pr checks 104` shows no failing check. Evidence: 35 pass, 0 fail, 2 Dependabot jobs skip, on the first run.
- [x] T009 Compare test totals with `main` for every edited job (`.github/workflows/deep-loop-runtime.yml`). Verify: the totals are equal. Evidence: CLI shards 797, 1,076 and 646 passed with 7, 10 and 5 skipped, runtime 1,649 passed with 13 skipped, deep-loop 2,885 passed with 8 skipped, the same on both sides.
- [x] T010 Compare the checkout step with `main` (`.github/workflows/spec-kit-check.yml`). Verify: the times are recorded. Evidence: 32 to 37 s for the five edited jobs. On `main` the same jobs took 23 to 60 s in the run compared, and 21 to 80 s across 48 steps in six runs with a median near 57 s.

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
