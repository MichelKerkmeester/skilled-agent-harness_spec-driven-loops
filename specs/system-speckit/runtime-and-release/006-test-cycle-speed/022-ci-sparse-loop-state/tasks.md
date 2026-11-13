---
title: "Tasks: Phase 22: ci-sparse-loop-state"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "ci sparse loop state tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 22: ci-sparse-loop-state

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


- [x] T001 Prove the exclusion patterns in a local clone (`.github/workflows/opencode-plugin-tests.yml`). Verify: no loop-state file is checked out. Evidence: 46,049 files checked out, 88,252 skipped, 0 loop-state files left.
- [x] T002 Find which areas read loop-state paths (`.skilled/skills/system-deep-loop/runtime/tests/helpers/legacy-real-log.ts`). Verify: `git grep` for concrete research, review, scratch and archive paths. Evidence: spec-kit 22 files, deep-loop 4 and sk-doc 4, so those suites keep the full checkout.
- [x] T003 Read the checkout time of each candidate on `main` (`.github/workflows/hook-vitest-suites.yml`). Verify: `gh run view` per workflow. Evidence: 56 to 68 s, listed in spec.md under Measured Behavior.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation


- [x] T004 Add the sparse checkout to nine checkout steps (`.github/workflows/opencode-plugin-tests.yml`, `.github/workflows/hook-vitest-suites.yml`, `.github/workflows/sk-git-script-tests.yml`, `.github/workflows/skill-advisor-stress.yml`, `.github/workflows/opencode-dual-version.yml`, `.github/workflows/command-tree-parity.yml`, `.github/workflows/playbook-operator-contract.yml`). Verify: `grep -c 'sparse-checkout-cone-mode: false'` prints 1 for five files and 2 for `opencode-dual-version.yml` and `command-tree-parity.yml`, and `actionlint` exits 0.
- [x] T005 Name the archived packet a plugin test reads again after the exclusions (`.github/workflows/opencode-plugin-tests.yml`). Verify: the plugin job passes with 582 tests. Evidence: the first run failed 2 of 582 with `ENOENT` on that packet's `graph-metadata.json`, the second passed 582 of 582.
- [x] T006 Describe the checkouts and fix the divider the README check requires (`.github/workflows/README.md`). Verify: `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py` prints `PARITY PASS`.
- [x] T007 Update three cited line numbers (`.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md`). Verify: `grep -n 'uses: ./.github/actions/setup'` prints line 106 for `opencode-plugin-tests.yml` and lines 121 and 203 for `opencode-dual-version.yml`.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification


- [x] T008 Read the checks on the pull request (`.github/workflows/opencode-plugin-tests.yml`). Verify: `gh pr checks 103` shows no failing check. Evidence: 33 pass, 0 fail, 2 Dependabot jobs skip, on the second run.
- [x] T009 Compare test counts with `main` for every edited workflow (`.github/workflows/skill-advisor-stress.yml`). Verify: the counts are equal. Evidence: plugin tests 1,594 and 582, hook vitest 491, sk-git 1, advisor 65 and 1,393 with 8 skipped, dual-version 84, and the four mirror counts of command-tree-parity, all equal on both sides. The playbook check prints the same two warnings on both sides.
- [x] T010 Compare the checkout step with `main` (`.github/workflows/command-tree-parity.yml`). Verify: each edited checkout is shorter. Evidence: 56 to 59 s down to 32 to 34 s for five workflows and 56 s down to 11 s for the advisor workflow. `opencode-dual-version.yml` measured 34, 33 and 34 s against 68, 26 and 29 s, so two of its three steps were not faster than their last run on `main`.

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
