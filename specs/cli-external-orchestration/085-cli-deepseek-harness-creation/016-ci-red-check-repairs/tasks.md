---
title: "Tasks: Phase 16: ci-red-check-repairs"
description: "Ordered tasks for the four causes behind the five red CI workflows, each reproduced locally, repaired and rechecked."
trigger_phrases:
  - "ci red check repairs tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 16: ci-red-check-repairs

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

- [x] T001 Read each failing workflow's log on `3a4e34734a` and name its cause. Verify: one cause per workflow. Evidence: `spec.md` Measured Behavior.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Ignore `/.dsh/prompts/local-*` and untrack the stub (`.gitignore`, `.dsh/prompts/local-skilled-alignment.md`). Verify: `sync-prompts-dsh.cjs --check` prints `PASS`. Evidence: `PASS: 44 prompt stubs are in sync.`, and `sync-runtime-mirrors.cjs --check` prints `PASS: 241 mirrors across 10 trees are in sync.` with the provisioned private link in place.
- [x] T003 Stub `dsh` on a temporary PATH in the variable-`DSH_HOME` case (`.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs`). Verify: without `~/.local/bin` it printed `fail 1` before and `fail 0` after. Evidence: before `pass 46`, `fail 1`; after `pass 47`, `fail 0`, with and without `dsh` installed.
- [x] T004 [P] Remove the dates from three recorded results and name the blocker in its SKIP rule (three DSH playbook scenarios). Verify: `validate-playbook-package.cjs --strict` reports `cli-deepseek-harness violations=0`. Evidence: `violations=0`. The doctor playbook's two SKIPs were fixed here too, then reverted on finding the same fix committed in worktree 324.
- [x] T005 [P] Refresh the durable-directory manifest with `--write` and correct the one drifted verdict line (`.skilled/skills/sk-doc/scripts/tests/code-folder/`). Verify: both tests exit 0. Evidence: manifest `directories=919`, the count CI derived; `PARITY PASS: verdict diff is empty`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run the sk-doc runner as CI does. Verify: no `FAIL` line. Evidence: `implementation-summary.md` Verification.
- [x] T007 Confirm the five workflows on the pushed commit. Verify: each reports success. Evidence: `implementation-summary.md` Verification.
- [x] T008 After later commits moved the hooks README warning to line 281 and added three folders, compare README verdicts without finding positions, and refresh the directory manifest again (`.skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py`, `code-folder/durable-directory-manifest.json`). Verify: the plain run drops from 1 diff to 0, and a changed finding message still fails. Evidence: `diff_entries=1` before, `PARITY PASS: verdict diff is empty` after; the mutated message gave `diff_entries=1`; manifest `directories=922`, the count CI derived; runner 55 of 55.
- [x] T009 Clear the four checks still red on `aded37b8fd` (`history-locator.vitest.ts`, `check_no_new_snake_case.py`, `opencode-version-battery.cjs`, 19 workflows). Verify: each fails first and passes after. Evidence: history-locator 6 of 50 failing before, 50 of 50 after; the naming guard's new test fails before and the CI range `c497ee3517` prints `PASS` after; the battery's new C9 test fails before and 56 of 56 pass after; the 19 workflows parse and `actionlint` exits 0.
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
