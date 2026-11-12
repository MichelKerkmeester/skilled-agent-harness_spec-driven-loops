---
title: "Implementation Plan: Phase 15: hook-suite-job-split"
description: "Move the `hooks-vitest` job out of `.github/workflows/dispatch-enforcement-guard.yml` into a new `.github/workflows/hook-vitest-suites.yml` that copies the guard file's triggers, permissions, concurrency, environment, switch, timeout and steps, then list the new file in the three README entries. Prove it with a YAML parse of both files, a census showing the hook vitest command in exactly one workflow, and a `/doctor:ci report` run that reports 33 workflows with no error and no drift flag."
trigger_phrases:
  - "hook suite job split plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 15: hook-suite-job-split

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML (GitHub Actions) |
| **Framework** | GitHub Actions, with the repository's `/doctor:ci report` as the workflow parser |
| **Storage** | None |
| **Testing** | `yaml` parse in Node, `rg` census, `/doctor:ci report` extraction |

### Overview
Move one job, unchanged, into a workflow file named for it: `hooks-vitest` leaves `.github/workflows/dispatch-enforcement-guard.yml` and lands in `.github/workflows/hook-vitest-suites.yml` under the workflow name `Hook Vitest Suites`. The guard file keeps its dispatch job and its fail-closed suite check, and the README gains the three entries the repository's CI report reads. Prove it with a parse of both files, a census that finds the hook vitest command in exactly one workflow, and a report run with no error and no row flag.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `rg -l 'hooks/vitest\.config\.ts' .github/workflows` prints only `.github/workflows/hook-vitest-suites.yml`
- [ ] The `/doctor:ci report` extraction prints `34 0 0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-responsibility workflow split.

### Key Components
- **New workflow file**: `.github/workflows/hook-vitest-suites.yml` is named `Hook Vitest Suites` and owns one job, `hooks-vitest`, with the guard file's `on`, `permissions`, `concurrency`, `env`, job condition, timeout, pinned steps, install command and run line copied verbatim.
- **Trimmed guard workflow**: `.github/workflows/dispatch-enforcement-guard.yml` keeps the `dispatch-enforcement-guard` job and its fail-closed check that the dispatch rule suite exists before `node --test` runs it.
- **Workflow inventory**: `.github/workflows/README.md` is the table source `/doctor:ci report` reads for a workflow's purpose, so the new file needs a contents row, a coverage-table entry and a `SKILLED_CI_FRESHNESS` entry.

The change is a file move, not a behavior change, and it needs a new file rather than a renamed job: the job name `Every hook vitest suite passes` already says what it runs, and it is the workflow title that files a hook failure under `Dispatch Enforcement Guard`. Keeping the job name also keeps the check label unchanged.

### Data Flow
A push or pull request matching `main` or `skilled/**`, or a manual dispatch, starts both workflows. Each runs its one job to completion, and each job keeps the ten-minute timeout and its `vars.SKILLED_CI` and `vars.SKILLED_CI_FRESHNESS` condition. Because the job count, steps, install and command are unchanged, runner seconds and the slowest workflow stay as they are today.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup records the two-job list, the one-workflow census and the 33-file baseline. Implementation creates `hook-vitest-suites.yml`, removes the job from the guard file and adds the three README entries. Verification reruns the parse, the census and the report and expects `34 0 0`.

The baseline is 33 rather than the 32 this plan first recorded: a sibling packet added a workflow file to the same worktree before this phase ran. The counts in this plan and in `spec.md` were corrected to the tree this phase ran on, and the two drift values, parse errors and flags, stay at zero either way.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The job's own suite does not run in this change; it runs where it already ran, from a different file. The proof is structural and runs on the checkout: `rg -l 'hooks/vitest\.config\.ts' .github/workflows` must print one line, and the CI report extraction must print `33 0 0`. The first CI run on the change exercises the moved job under its new workflow name.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Node 22 with the `yaml` package under `.skilled/node_modules`, already installed because `/doctor:ci report` loads it.
- `rg`, used for the census in both the measured baseline and the final check.
- The CI profile at `.skilled/skills/sk-code/sk-code-ci/repository/ci.json`, which supplies the README and switch checks. No new package.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the new workflow does not appear in the Actions run list, or the hook suite stops running on a push or pull request it used to answer. Rollback: revert the single change set that touches the three files - delete `hook-vitest-suites.yml`, restore the `hooks-vitest` job in `dispatch-enforcement-guard.yml` and drop the README entries. No data, state or test change needs undoing.
<!-- /ANCHOR:rollback -->

---
