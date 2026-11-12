---
title: "Feature Specification: Phase 8: spec-kit-check-parallel-jobs"
description: "One job in spec-kit-check.yml runs the CLI vitest project, the legacy lanes and the runtime vitest project in series, and that job sets the wait after a spec-kit push. Split the three suites into parallel jobs and keep every test command unchanged."
trigger_phrases:
  - "spec kit check parallel jobs"
  - "phase 8 spec kit check parallel jobs"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: spec-kit-check-parallel-jobs

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/350-test-ci-wait-cuts` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 17 |
| **Predecessor** | 007-test-and-ci-bloat-research |
| **Successor** | 009-legacy-lane-overlap-measurement |
| **Handoff Criteria** | The three suite jobs pass on a pull-request run from the branch, `gh run view` shows their durations, and `validate.sh --strict --quiet` prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the specification *Shorten the wait after a push by rearranging CI checks and removing dead test infrastructure*.

**Scope Boundary**: One file, `.github/workflows/spec-kit-check.yml`. The three suite steps become three jobs, and no test command, trigger path, timeout or sibling job changes.

**Dependencies**:
- Phase 7 records the serial job timing in `../007-test-and-ci-bloat-research/research/research.md` section 3.
- The operator's go-ahead to push and open a pull request to `main`, because the post-change timing exists only in a GitHub run and the workflow's `push` trigger accepts only `main` and `skilled/**`.

**Deliverables**:
- `cli-vitest`, `legacy-lanes` and `runtime-vitest` jobs, each with its own checkout, Node setup and install-and-build step.
- A `check` job that keeps the CLI check gate, the typecheck and the shared package tests.
- One `gh run view` reading of the three job durations from a pull-request run.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `check` job in `.github/workflows/spec-kit-check.yml` runs the `CLI vitest project`, `Legacy module lanes and the bash validation suites` and `Runtime vitest project` steps one after another. In run 43174399120 that job took 867 s, which research section 3 states as about 830 s, and the three suite steps took 490 s, 161 s and 79 s. The two shorter suites sit behind the CLI step in the same job, so the 240 s they take adds to the wait after a spec-kit push even though the CLI step is longer than both together.

### Purpose
Run the three suites as three parallel jobs, each with its own checkout and install, so the wait after a spec-kit push approaches the CLI suite plus its own setup. Every test command stays exactly as it is.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ gh run view 43174399120 --json jobs --jq '.jobs[] | select(.name | startswith("Typecheck")) | "job: \(.name)", "  started \(.startedAt)  completed \(.completedAt)  duration \((.completedAt|fromdateiso8601) - (.startedAt|fromdateiso8601)) s", (.steps[] | select(.name | test("^(Install and build the spec-kit packages|CLI vitest project|Legacy module lanes and the bash validation suites|Runtime vitest project)$")) | "  \(.name): \((.completedAt|fromdateiso8601) - (.startedAt|fromdateiso8601)) s")'
job: Typecheck, import policy and test suites for the spec-kit packages
  started 2026-11-12T07:21:51Z  completed 2026-11-12T07:36:18Z  duration 867 s
  Install and build the spec-kit packages: 73 s
  CLI vitest project: 490 s
  Legacy module lanes and the bash validation suites: 161 s
  Runtime vitest project: 79 s
```

Run 43174399120 is the run research section 3 cites. The job and step times above are observed. The estimate that the job falls to about 590 s comes from research section 4 and stays inferred until the pull-request run records the three job durations.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Split the three suite steps of the `check` job into `cli-vitest`, `legacy-lanes` and `runtime-vitest`.
- Give each suite job its own checkout, Setup Node and the existing install-and-build step.
- Keep the `Install ripgrep` step in the CLI job, because the recipe and residue-sweep suites that spawn `rg` live in the CLI project.
- Leave the `check` job with the CLI check gate, the typecheck and the shared package tests.
- Preserve every trigger path, the `concurrency` block, the `mirrors` job and the `doctor-scripts` job.

### Out of Scope
- Editing any test command or test file. This phase proves the same suites still run.
- Narrowing the legacy lanes. Phase 9 measures whether the CLI project already covers them.
- Path-filtering `sk-doc-script-tests.yml`. Phase 10 owns that change.
- Rolling out the sparse checkout. Phase 11 owns that change.
- Renaming the `check` job. Its name is the existing status context, and the shared package tests still run there.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/spec-kit-check.yml` | Modify | Move the three suite steps out of `check` into three parallel jobs, each with its own checkout and install |

### Regression

None. Every test file, assertion and command still runs, and no trigger path changes. The split can only widen coverage on a failing push, because a failure in one suite no longer stops the other two from starting.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The three suites run as three jobs with no `needs:` edge between them. | YAML lists `cli-vitest`, `legacy-lanes` and `runtime-vitest`, and each job's `needs` is absent. |
| REQ-002 | Each suite job keeps its own checkout, Node setup and install-and-build step. | Each job has one `actions/checkout`, one `Setup Node` and one `Install and build the spec-kit packages`, and the workflow has six checkouts in total. |
| REQ-003 | Every test command stays byte-identical to the pre-change text. | The four suite and lane command lines each appear once, and the `run:` blocks are copied without an edit. |
| REQ-004 | The `check` job keeps the CLI check gate, the typecheck and the shared package tests and runs no suite. | `check` has five steps: checkout, Setup Node, install and build, CLI check gate and typecheck, shared package tests. |
| REQ-005 | The edited workflow parses and lints clean. | The YAML parser prints six job keys and `actionlint` prints `actionlint-ok`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The trigger paths and the `mirrors` and `doctor-scripts` jobs stay unchanged. | The parse prints `push=24 pr=24`, and those two jobs keep 4 and 5 steps. |
| REQ-007 | One pull-request run records the three job durations. | `gh run view` prints three `success` lines with a duration in seconds, and the CLI job carries the longest duration. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The YAML parser prints `check,cli-vitest,doctor-scripts,legacy-lanes,mirrors,runtime-vitest`.
- **SC-002**: `actionlint .github/workflows/spec-kit-check.yml && echo actionlint-ok` prints `actionlint-ok`.
- **SC-003**: The four suite and lane command lines appear once each, so the combined `rg -c` count prints 4.
- **SC-004**: After the operator-approved push and pull request to `main`, `gh run view` prints one line per suite job, each with `success` and a duration in seconds.
- **SC-005**: The three job durations are recorded beside the 867 s baseline, so the wait saved is a measured number and not only the research estimate.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Operator go-ahead to push and open a pull request | The post-change timing cannot be read, and the phase stays Draft | Ask once, after every local task passes |
| Dependency | Authenticated `gh` CLI | No run evidence is reachable | Confirmed: `gh run list` returned runs on 2026-11-12 |
| Risk | Three extra installs and three extra checkouts add runner minutes | Medium cost, no added wait | Accept: the installs run in parallel, and this phase cuts wait, not billed minutes |
| Risk | Runner duration varies between runs | The saving differs from the estimate | Record the run id and compare job durations, not one step from another run |
| Risk | A suite depends on state left by a sibling step | One new job fails on the first run | Read the failing step, add the missing setup step, and rerun |
| Risk | The split changes a required status check | A merge gate stops reporting | Research section 9 records `message-contract-required` as the only required check, so no gate is lost |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the `check` job be renamed now that it no longer runs the suites? Decision: no. Its name is the existing status context, and the shared package tests still run there.
- What timeout should each suite job carry? Decision: 51 minutes, copied from the current `check` job, because this phase has no measurement that justifies a tighter limit.
- Does the proof need the workflow's `push` trigger widened to this branch? Decision: no. The branch opens a pull request to `main`, which the existing `pull_request` trigger already accepts, and every trigger path stays untouched.
- How many billed runner minutes does the split add? UNKNOWN. Three installs and three checkouts add work, and this phase measures wait, not billing.
<!-- /ANCHOR:questions -->

---
