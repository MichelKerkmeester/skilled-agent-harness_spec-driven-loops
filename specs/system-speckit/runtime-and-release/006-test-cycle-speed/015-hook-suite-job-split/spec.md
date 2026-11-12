---
title: "Feature Specification: Phase 15: hook-suite-job-split"
description: "`.github/workflows/dispatch-enforcement-guard.yml` runs two jobs with different owners: the dispatch rule engine suite and the whole `.skilled/hooks` vitest tree. The workflow is named and protected for the guard, so a red run on the hook suite reads as a guard failure and the run list does not say what broke. This phase moves the hook vitest job into `.github/workflows/hook-vitest-suites.yml` with the same triggers, switch and test command."
trigger_phrases:
  - "hook suite job split"
  - "phase 15 hook suite job split"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 15: hook-suite-job-split

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/350-test-ci-wait-cuts` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 17 |
| **Predecessor** | 014-dead-runner-and-step-cleanup |
| **Successor** | 016-local-test-timing-profile |
| **Handoff Criteria** | `rg -l 'hooks/vitest\.config\.ts' .github/workflows` prints only `.github/workflows/hook-vitest-suites.yml`, each workflow file lists one job, the `/doctor:ci report` extraction prints `34 0 0` (33 workflow files before the split plus the new one), and the packet validator prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the Shorten the wait after a push by rearranging CI checks and removing dead test infrastructure specification.

**Scope Boundary**: `.github/workflows/dispatch-enforcement-guard.yml`, the new `.github/workflows/hook-vitest-suites.yml`, and the three inventory entries the new file needs in `.github/workflows/README.md`. No test file, hook, vitest config, trigger, path filter or command changes.

**Dependencies**:
- GitHub Actions on `ubuntu-latest` with Node 22 and the pinned `actions/checkout` and `actions/setup-node` SHAs the guard workflow already uses.
- The `yaml` package under `.skilled/node_modules`, the parser `/doctor:ci report` already loads, for the parse checks.
- The CI profile at `.skilled/skills/sk-code/sk-code-ci/repository/ci.json`, which owns the README row and switch checks the report applies.

**Deliverables**:
- `hook-vitest-suites.yml` holding the moved `hooks-vitest` job under the workflow name `Hook Vitest Suites`.
- `dispatch-enforcement-guard.yml` holding only the `dispatch-enforcement-guard` job.
- The new file named in the README contents table, the push-versus-pull-request coverage table and the `SKILLED_CI_FRESHNESS` row.
- A parse check over both files and a census showing the hook vitest command in exactly one workflow.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`dispatch-enforcement-guard.yml` holds two jobs: `dispatch-enforcement-guard` runs `node --test` over one dispatch rule suite, and `hooks-vitest` runs the whole `.skilled/hooks` vitest tree (Measured Behavior). The hook job's own step comment names what it covers: the runtime adapter suites, Pi's preflight lint and directive dedup, and the Codex shell-tool names. None of that is dispatch enforcement, yet the run is titled `Dispatch Enforcement Guard`.

The failure is diagnostic rather than downtime. A broken hook suite turns the guard's name red, and an operator reading the run list cannot tell whether dispatch enforcement broke or an adapter rename did. The repository's protected set also lists the file for the guard role, so the hook suite rides inside protection whose rationale does not cover it.

### Purpose
Move the hook vitest job into a workflow named for it, so a red run names the hook suites, and leave `dispatch-enforcement-guard.yml` owning only the guard, with the same triggers and the same test command on the moved job.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the repository root on 2026-11-12.

```text
$ node -e "const Y=require('./.skilled/node_modules/yaml'),fs=require('fs');console.log(Object.keys(Y.parse(fs.readFileSync('.github/workflows/dispatch-enforcement-guard.yml','utf8')).jobs).join(','))"
dispatch-enforcement-guard,hooks-vitest

$ rg -n 'name: Every hook vitest suite passes|hooks/vitest\.config\.ts' .github/workflows/dispatch-enforcement-guard.yml
54:    name: Every hook vitest suite passes
70:        run: .skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts

$ rg -l 'hooks/vitest\.config\.ts' .github/workflows
.github/workflows/dispatch-enforcement-guard.yml

$ ls .github/workflows/*.yml | wc -l
      32
```

Section 2 quotes the two-job list and the one-workflow census from this block.

The 32-file count is the reading taken when this packet was planned. A sibling packet added a workflow file to the same worktree before this phase ran, so the pre-split tree carried 33 workflow files and the post-split report reads `34 0 0`. The two proof values that matter to this phase, the parse-error count and the flag count, stay at zero.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `.github/workflows/hook-vitest-suites.yml` that owns the `hooks-vitest` job under the workflow name `Hook Vitest Suites`, with the guard workflow's events, permissions, concurrency, environment and job condition.
- Remove the `hooks-vitest` job from `.github/workflows/dispatch-enforcement-guard.yml`, so that file holds only `dispatch-enforcement-guard`.
- Add the new file to the README contents table, the push-versus-pull-request coverage table and the `SKILLED_CI_FRESHNESS` row.
- Prove the move with a parse of both files and a census that finds the hook vitest command in exactly one workflow.

### Out of Scope
- Changing the test command, the tree it collects or `.skilled/hooks/vitest.config.ts` - the phase must run exactly what runs today.
- Changing triggers, path filters, concurrency, timeout or switch variables - a job that keeps its definition does not need a new event.
- Adding the new file to `protected` in `repository/ci.json` - protection covers guard classes, and a test suite is not one.
- Saving waiting time - research section 1 finds the wait equals the slowest workflow and names only `Spec-Kit Check` and `sk-doc Script Tests` as the ones that set it.
- Sparse checkout or job parallelization - separate phases in the parent packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/hook-vitest-suites.yml` | Create | Carries the moved `hooks-vitest` job with the guard workflow's triggers, switch and command |
| `.github/workflows/dispatch-enforcement-guard.yml` | Modify | Drops the `hooks-vitest` job and keeps the dispatch guard |
| `.github/workflows/README.md` | Modify | Lists the new workflow in both tables and in the `SKILLED_CI_FRESHNESS` row |

**Regression the change stops catching**: none. Every trigger, the job condition, the steps and the run command move unchanged; only the file that owns the job changes. Research section 9 records that no workflow is a required check apart from `message-contract.yml`, so no required status context depends on this file either.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The hook vitest job runs from a workflow file of its own | `.github/workflows/hook-vitest-suites.yml` exists, parses, and its `jobs` key lists only `hooks-vitest` |
| REQ-002 | The guard workflow owns only the dispatch guard | `.github/workflows/dispatch-enforcement-guard.yml` parses and its `jobs` key lists only `dispatch-enforcement-guard` |
| REQ-003 | The moved job keeps its triggers, switch, steps and command | Parsing both files gives equal `on`, `permissions`, `concurrency` and `env`; the two jobs' `if` strings are equal; the run line reads `.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts` |
| REQ-004 | The hook vitest command runs in exactly one workflow | `rg -l 'hooks/vitest\.config\.ts' .github/workflows` prints one line, `.github/workflows/hook-vitest-suites.yml` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The workflow inventory documents the new file | `rg -c 'hook-vitest-suites\.yml' .github/workflows/README.md` prints `3`: one contents row, one coverage-table entry and one `SKILLED_CI_FRESHNESS` entry |
| REQ-006 | The workflow directory still parses and carries no drift flag | The `/doctor:ci report` extraction prints `34 0 0`, meaning 34 workflows (33 before the split plus the new file), no parse error and no row, switch, timeout, permissions or pin flag |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The hook vitest command appears in exactly one workflow: `rg -l 'hooks/vitest\.config\.ts' .github/workflows` prints one line, `.github/workflows/hook-vitest-suites.yml`.
- **SC-002**: Both workflow files parse and the directory carries no drift: `node .skilled/commands/doctor/scripts/ci-report.cjs --json --no-gh` piped into the flag counter prints `34 0 0`.
- **SC-003**: The split is named for what it runs: the new file's `name` reads `Hook Vitest Suites` and its only job is `hooks-vitest`, while the guard file's only job is `dispatch-enforcement-guard`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | GitHub Actions runner, Node 22 and the pinned `actions/checkout` and `actions/setup-node` SHAs | The new workflow cannot start if a SHA or the Node version is wrong | Copy the workflow-level blocks and the two pinned steps from the guard file verbatim; the report flags an unpinned `uses` as `uses-unpinned` |
| Dependency | The `yaml` package under `.skilled/node_modules` and the CI profile the report reads | The parse and drift checks cannot run | Run `npm --prefix .skilled ci` first; if the package is still missing, use `python3` with PyYAML as phase 014 does |
| Risk | The README drifts from the workflow directory | Med | Add the contents row, the coverage entry and the switch-row entry in one task, then run the report; the report flags a missing contents row as `readme-row-missing` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The move keeps every trigger and the test command unchanged, so no behavior or scope question blocks it.
<!-- /ANCHOR:questions -->

---
