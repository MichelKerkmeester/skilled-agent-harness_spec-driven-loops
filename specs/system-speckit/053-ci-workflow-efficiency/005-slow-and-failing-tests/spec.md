---
title: "Feature Specification: Phase 5: slow-and-failing-tests"
description: "The spec-kit check job spends 791 s of its 1,215 s in one serial vitest project, because the CLI project runs 183 test files one at a time; deep-loop-runtime, diagram-corpus and skill-advisor-stress carry 13, 12 and 10 failures in their latest 40-run samples, and five other workflows carry a single old failure each. This phase probes file parallelism three times, flips the CLI project when the probe is green or shards it when a fixture collides, re-checks the three red workflows and fixes what is still real without a retry, and records the five stale failures closed."
trigger_phrases:
  - "slow and failing tests"
  - "phase 5 slow and failing tests"
  - "spec kit cli vitest file parallelism"
  - "deep loop diagram corpus skill advisor stress failures"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: slow-and-failing-tests

<!-- SPECKIT_LEVEL: 3 -->
---

<!-- ANCHOR:metadata -->
## EXECUTIVE SUMMARY

`spec-kit-check`'s `check` job spends 791 s of its 1,215 s in one serial vitest project, because the `cli` project runs 183 test files one at a time. Three workflows also carry real, deterministic failures rather than flake, and the newest runs of two of them already pass, so the research phase's failure counts are no longer current. This phase proves file parallelism safe with a three-run probe, flips the `cli` project or shards the step when a fixture collides, re-checks the latest 40 runs of the three workflows, fixes what is still real without a retry, and records five single old failures closed.

**Key Decisions**: the probe decides between one config line and a two-way shard, and the phase adds no retry anywhere. No operator decision gates this phase.

**Critical Dependencies**: a `gh` session with the `repo` scope, a checkout with the spec-kit CLI built, and the 002 baseline for the after-R1 figure only.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In progress |
| **Created** | 2026-10-23 |
| **Branch** | `main (work in any checkout level with origin/main; push with git push origin HEAD:main)` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 9 |
| **Predecessor** | 002-rebuild-fanout-removal (baseline only) |
| **Successor** | 006-sk-code-ci-surface |
| **Handoff Criteria** | The `CLI vitest project` step is under 400 s on CI with 5 consecutive green `Spec-Kit Check` runs; deep-loop-runtime, diagram-corpus and skill-advisor-stress each show 10 consecutive green runs or a filed root cause in `scratch/r21-recheck.md`; the five single old failures are recorded closed; `bash .github/scripts/check-gate-inputs.sh` and `validate.sh --strict` both print `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the CI efficiency implementation phases specification. It carries R19, R20 and R21 of `001-research/research/synthesis-reviews/final-review.md` (`:401-428`) and the phase-005 gate in that review's phase plan (`:571-577`).

**Scope Boundary**: One vitest project setting and its comment, or one workflow step if the probe finds a fixture collision; one re-check table; one fast-fail drift step; and conditional test or script fixes for the failures that are still real. No trigger, path filter, concurrency group, cache, timeout, permission, switch, check name or workflow job count changes.

**Dependencies**:
- `002-rebuild-fanout-removal` for the baseline only. R20's saving is ~460 runner-min/day standalone on today's 50 `spec-kit-check` runs per window, and ~138 runner-min/day after R1 leaves 15 (`final-review.md:410-417`). This phase can run in parallel with `003-trigger-and-job-hygiene` and `004-setup-caching-provisioning`, and it needs nothing from them.
- `gh` authenticated with the `repo` scope, for the 40-run re-pull, the failed-log reads and the 5- and 10-run green streaks. The current token carries `repo` and `workflow`, and every read this phase needs worked with it.
- A checkout with the spec-kit, deep-loop and skill-advisor dependencies installed. The worktree that authored this plan carries `node_modules` for the spec-kit package and `runtime/dist`, but not `runtime/cli/dist` and not the deep-loop or advisor trees, so the probe cannot run until T002 builds and installs them.
- No operator decision gates this phase. The review lists none for R19 to R21, and this phase adds none.
- `007-workflow-hygiene-on-off-control` depends on this phase's final job shapes, because R24 sizes its timeouts after R20 and after the deep-loop step this phase adds.

**Deliverables**:
- `scratch/r19-probe.md`: one serial baseline row and three parallel probe rows, each with duration, exit code and any failing test.
- `.skilled/skills/system-spec-kit/vitest.config.ts`: the cli project at `:67` set to `fileParallelism: true` with a stated reason, or `.github/workflows/spec-kit-check.yml:124-128` carrying a two-way `--shard` if the probe collides.
- `scratch/r20-ci-step.md`: the before and after `CLI vitest project` seconds and the 5-run green streak.
- `scratch/r21-recheck.md`: the latest-40-run table per workflow, the root cause of every failure still present, and the five stale failures recorded closed.
- `.github/workflows/deep-loop-runtime.yml`: a `check-contract-drift.cjs` step before the full suite, because 13 of the latest 40 runs carry `STALE_SOURCE_DIGEST`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`spec-kit-check`'s `check` job is the repository's most expensive job at 1,215 s, and 791 s of it, 65.1%, is one step: the `CLI vitest project` at `spec-kit-check.yml:124-128` runs 183 test files one after another because the `cli` project sets `fileParallelism: false` at `.skilled/skills/system-spec-kit/vitest.config.ts:67` without a stated reason (`iteration-005.md:30-69`). The same serial shape recurs at four other sites in three other configs, but only this project is the wall-clock tail. Separately, three workflows carry real, deterministic failures rather than flake: deep-loop-runtime 13 of its latest 40 runs, diagram-corpus 12 and skill-advisor-stress 10, and the newest runs of all three now pass, so the research phase's failure counts can no longer be assumed current (`final-review.md:184`, `iteration-007.md:28-95`). Five more workflows carry one old failure each and have been green since (`final-review.md:419-428`). A retry would mask these failures, because they correlate across independent workflows on the same commits (`research.md:113`).

### Purpose
Cut the CLI vitest step to under 400 s without a fixture collision, and turn the red-main noise into a current, root-caused signal rather than a retry.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R19: a three-run local probe of the `cli` project with `fileParallelism: true`, recording duration, exit code and any failing test, plus one serial baseline run for comparison.
- R20: set `fileParallelism: true` on the `cli` project at `vitest.config.ts:67` with a stated reason; if R19 finds a fixture collision, run two `--shard` halves inside the single `CLI vitest project` step at `spec-kit-check.yml:124-128`.
- R21: re-pull the latest 40 runs of deep-loop-runtime, diagram-corpus and skill-advisor-stress; root-cause and fix each workflow still failing, with no retry; add a fast-fail `check-contract-drift.cjs` step to `deep-loop-runtime.yml`, because 13 of the latest 40 runs carry `STALE_SOURCE_DIGEST`.
- R21: confirm the single old failures in repo-rules-corpus (2026-09-18), chart-corpus (2026-10-12), opencode-dual-version (2026-10-20), routing-registry-drift (2026-10-17) and strict-pass-freshness-report (2026-09-07) are stale, and record them closed.
- The measurement records in `scratch/r19-probe.md`, `scratch/r20-ci-step.md` and `scratch/r21-recheck.md`, and the no-retry guard.

### Out of Scope
- Timeouts, least-privilege permissions and the on/off switch: `007-workflow-hygiene-on-off-control` owns R24 to R26.
- The rebuild fan-out and its baseline: `002-rebuild-fanout-removal` owns R1 and R2.
- Trigger filters, concurrency groups, path filters and checkout depth: `003-trigger-and-job-hygiene` owns R3 to R11.
- Caching, the composite setup action and npm dedupe: `004-setup-caching-provisioning` owns R12 to R18.
- The `sk-code-ci` surface and `/doctor:ci`: `006-sk-code-ci-surface` and `009-doctor-ci-review-wiring` own R22, R23 and R29.
- Any retry, rerun or `continue-on-error` around the failing suites: the research phase rejected retries because there is no flake signature (`research.md:113`).
- Any change to what a test asserts beyond the root cause the re-check names, and any change to a check name, workflow trigger or job count.
- The parent `spec.md`, `description.json` and `graph-metadata.json`: the orchestrator owns them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/vitest.config.ts` | Modify | `fileParallelism: true` at `:67` with a stated reason; the comment at `:14-17` no longer claims both projects share the parallelism setting |
| `.github/workflows/spec-kit-check.yml` | Modify only if R19 collides | Two `--shard` halves in the `CLI vitest project` step at `:124-128`, with both exit codes propagated |
| `.github/workflows/deep-loop-runtime.yml` | Modify | A `check-contract-drift.cjs` step between the install step at `:51-57` and the suite at `:59-60`, because 13 of the latest 40 runs carry `STALE_SOURCE_DIGEST` |
| `.skilled/skills/sk-design/sk-design-diagram/scripts/README.md` or `scripts/families/metadata.cjs` | Modify only if diagram-corpus still fails | Correct the `version:` line at `README.md:9` or the anchor-era expectation at `metadata.cjs:47` |
| `.skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts` | Modify only if skill-advisor-stress still fails | Correct the module-shape assumption the log names, at `:20` or `:101-104` |
| `scratch/r19-probe.md` | Create | Serial baseline plus three parallel probe rows and the R19 outcome |
| `scratch/r20-ci-step.md` | Create | The before and after step seconds and the 5-run green streak |
| `scratch/r21-recheck.md` | Create | The 40-run tables, the root-cause rows and the five stale confirmations |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | **R19.** The `cli` project runs three times locally with file parallelism on, through a probe config that differs from `.skilled/skills/system-spec-kit/vitest.config.ts` only in that one setting, and `scratch/r19-probe.md` records the serial baseline, the three durations, the three exit codes and any failing test. Three green runs choose parallelism; any fixture collision chooses `--shard` |
| REQ-002 | **R20.** `.skilled/skills/system-spec-kit/vitest.config.ts:67` sets `fileParallelism: true` for the `cli` project with a comment that states why the project's files are independent, and the comment at `:10-17` no longer claims both projects share the parallelism setting. If REQ-001 chose sharding, `.github/workflows/spec-kit-check.yml:124-128` runs `--shard=1/2` and `--shard=2/2` as two background processes and exits non-zero when either half fails |
| REQ-003 | **R20.** The `CLI vitest project` step falls from 791 s to under 400 s on a real `Spec-Kit Check` run, and the next 5 `Spec-Kit Check` runs are all green |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | **R21.** The latest 40 runs of deep-loop-runtime, diagram-corpus and skill-advisor-stress are re-pulled into `scratch/r21-recheck.md`; every failure still present has a root cause naming the failing test, the error class and the first failing SHA, and a fix in the file the cause names, with no retry, rerun or `continue-on-error` added |
| REQ-005 | **R21.** The single old failures in repo-rules-corpus (2026-09-18, `6cbaf58`), chart-corpus (2026-10-12, `f3b4e90`), opencode-dual-version (2026-10-20, `7584ad7`), routing-registry-drift (2026-10-17, `407de0d`) and strict-pass-freshness-report (2026-09-07, `bbf1ffa`) are each confirmed stale by a later green run and recorded closed in `scratch/r21-recheck.md` |
| REQ-006 | **R21.** deep-loop-runtime, diagram-corpus and skill-advisor-stress each show 10 consecutive green runs, or a filed root-cause row in `scratch/r21-recheck.md` for a workflow that stays red |
| REQ-007 | `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`, every workflow parses as YAML, and `validate.sh --strict` on this folder prints `RESULT: PASSED` |

R19's saving is 0: it is the probe that decides R20. R20's saving is ~460 runner-min/day standalone, ~138 after R1, plus about 525 s of wall on the slowest job (`final-review.md:410-417`). R21's saving is signal, not minutes (`final-review.md:419-428`).

### Per-R-id detail

#### R19 - the three-run probe (REQ-001)

- **Functional requirements**: one serial baseline run and three parallel runs of the `cli` project. The probe config is a copy of `.skilled/skills/system-spec-kit/vitest.config.ts` in the same directory, and it differs at exactly one line: the `cli` project's `fileParallelism`. Each run records its exit code, its duration and its log. The probe records one outcome token, `parallel` or `shard`, and the probe config is deleted before the real config is touched.
- **Edge cases**: the project collects 0 files; the probe config fails to parse; a run exits non-zero with no test failure, which is out of memory on a 4-vCPU runner; a run exits non-zero on an assertion that has nothing to do with concurrency.
- **Risks with mitigation**: a local green that does not hold on CI is the main risk, and it is mitigated by treating the probe as a pass/fail gate rather than a duration gate, by adding 5 green CI runs to the acceptance, and by keeping the two-way shard one task away. A probe config left behind is mitigated by a `test ! -e` check before the real edit.
- **Rollback**: delete `scratch/r19-probe.md`, the four `scratch/r19-*.log` files and `.skilled/skills/system-spec-kit/vitest.config.parallel-probe.ts`. The real config is unchanged, so there is nothing else to undo.

#### R20 - the config flip or the two-way shard (REQ-002, REQ-003)

- **Functional requirements**: when the probe is green three times, the `cli` project at `vitest.config.ts:67` sets `fileParallelism: true` and carries a comment that states why its files are independent; the root project at `:50` stays `false`, and the comment at `:14-17` stops claiming both projects share the setting. When any probe run collides, the config stays serial and the `CLI vitest project` step at `spec-kit-check.yml:124-128` runs `--shard=1/2` and `--shard=2/2` as two background processes, waits for both, and exits non-zero when either half fails.
- **Edge cases**: a fixture collision names `EEXIST`, `EADDRINUSE`, `SQLITE_BUSY` or a path, port or database another file owns; an out-of-memory exit names no test at all; the step still exceeds 400 s after the flip, which is the shard trigger and not a reason to relax the ceiling; a file added later joins the same project and the same mode.
- **Risks with mitigation**: parallel files colliding on a shared fixture is the main risk, mitigated by three probe runs, by reading the failure text rather than the exit code, and by a one-line revert. A shard half whose failure is swallowed is mitigated by `set -uo pipefail` without `-e`, two `wait ... || status=1` lines and `exit "$status"`.
- **Rollback**: revert the one commit that carries the config line and its comment, or the commit that carries the shard block. `git revert <sha>` restores the serial step, and no state, cache or data is created.

#### R21 - the re-check, the root causes and the stale confirmations (REQ-004, REQ-005, REQ-006)

- **Functional requirements**: the latest 40 runs of deep-loop-runtime, diagram-corpus and skill-advisor-stress are pulled into `scratch/r21-recheck.md`, with one run table and one summary row per workflow. Every failure still present gets a root-cause row that names the failing test, the error class and the first failing SHA, and a fix in the file the cause names. The `STALE_SOURCE_DIGEST` class gets a fast-fail step in `deep-loop-runtime.yml` before the 12-minute suite. The five single old failures are confirmed stale against a later green run and recorded closed. No retry, rerun or `continue-on-error` is added.
- **Edge cases**: a workflow whose newest run already passes, which is recorded closed rather than fixed; a failure class that appears in the window but not in the newest run; a workflow with fewer than 40 runs in its history; a workflow that stays red after its fix, which takes the filed-root-cause branch; a failed run that is tempting to rerun.
- **Risks with mitigation**: the counts move between the research phase and this phase, mitigated by re-pulling rather than trusting the earlier numbers. The 10-green watch depends on repository traffic, mitigated by dispatching diagram-corpus and by waiting for natural runs on the other two. A retry could manufacture a green streak, mitigated by a task that proves none was added.
- **Rollback**: the R21 test and script fixes are independent of R20 and stay; reverting the fast-fail step means deleting the one step from `deep-loop-runtime.yml`; reverting a fix means `git revert` of that one commit. The scratch records stay as the evidence of what was measured.

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The `CLI vitest project` step is under 400 s on CI, down from 791 s, and 5 consecutive `Spec-Kit Check` runs are green.
- **SC-002**: The probe is recorded and the decision is explicit: three green parallel runs choose the config flip, and any collision chooses the two-way shard.
- **SC-003**: Each of deep-loop-runtime, diagram-corpus and skill-advisor-stress shows 10 consecutive green runs, or a filed root cause that names the test, the error class and the SHA.
- **SC-004**: The five single old failures are recorded closed with their date, SHA and the later green run that proves them stale.
- **SC-005**: No retry, rerun or `continue-on-error` is added to any of the three workflows.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `002-rebuild-fanout-removal` baseline | R20's after-R1 number is unanchored | Use the standalone ~460 runner-min/day figure until the baseline exists; the CI acceptance does not depend on it |
| Dependency | `gh` with `repo` and `actions` scopes | No re-check, no failed logs, no green streak | Record the commands and their output in `scratch/`; a missing scope is a blocker, not a workaround |
| Dependency | A checkout with the spec-kit, deep-loop and advisor dependencies installed | The probe and the stress suite cannot run | T002 installs them; this worktree has no build, so the tasks run in a provisioned checkout |
| Risk | The 183 CLI files share a fixture or a fixed path that only collides under parallelism | Intermittent red runs after the flip | R19 runs the probe three times and reads the failure text for `EEXIST`, `EADDRINUSE`, `SQLITE_BUSY` or a shared temp path; any hit chooses the shard, and the config flip is one line to revert |
| Risk | The local probe is faster or slower than the 4-vCPU runner, so three local greens do not prove CI | A collision appears only on CI | The probe decides pass/fail, not duration; the CI acceptance adds 5 green runs, and a collision there reverts to the shard |
| Risk | The 10-green watch depends on repository traffic, and diagram-corpus, deep-loop-runtime and skill-advisor-stress are path-filtered | The phase stays open for days or weeks | diagram-corpus has `workflow_dispatch` at `:15` and can be dispatched; the other two wait for natural runs, and a failed run is never rerun to manufacture a streak |
| Risk | The `STALE_SOURCE_DIGEST` class recurs whenever a commit edits a contract source without recompiling | A red run that costs 12 minutes before its first signal | The fast-fail step checks the same fact in seconds; the existing `check-contract-drift.vitest.ts` keeps the assertion, and the contract is regenerated with `--write` |
| Risk | The diagram-corpus and skill-advisor-stress failures are already fixed, so the phase looks like it did nothing | No code change for two of the three workflows | The re-check is the deliverable: it records the newest green run and the fixed cause, which is exactly what R21 asks for |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The `CLI vitest project` step completes in under 400 s on CI, against 791 s in run `39909844384` and 776-950 s across four sampled runs (`iteration-005.md:32-47`).
- **NFR-P02**: The change is worth ~460 runner-min/day standalone and ~138 after R1, plus about 525 s of wall on the slowest job (`final-review.md:415`). The probe itself saves nothing.

### Security
- **NFR-S01**: No new secret, token, permission or scope. The phase edits a vitest config, at most one workflow step, and test or script files that already run read-only.
- **NFR-S02**: No value from a pull request, a branch name or the run environment is interpolated into a new shell command; the shard arguments are the fixed literals `1/2` and `2/2`.

### Reliability
- **NFR-R01**: Parallel and shard modes each run every test file exactly once; 5 consecutive CI runs prove the mode does not drop or duplicate a file.
- **NFR-R02**: No retry, rerun or `continue-on-error` is added. A failing test stays a failing run, and a workflow that stays red is recorded with its root cause instead of being retried.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty change: if the CLI project collects 0 files, the run exits non-zero by vitest's default and the probe records it; the config change is not made.
- Maximum length: 183 files is the current count under `tests/**/*.vitest.ts`; a later file addition joins the same project and the same mode.
- Invalid format: a probe config that fails to parse stops the probe before any run; the real config is untouched and the task retries the copy.

### Error Scenarios
- Fixture collision: the probe log names the test and the path; the decision switches to the two-way shard, and the config stays serial.
- Out of memory on 4 vCPU: vitest exits non-zero without a test failure; the decision switches to the shard, which bounds each process to half the files.
- CI step still over 400 s: the acceptance fails, the shard is applied, and the step is re-measured rather than the threshold relaxed.
- A workflow stays red after the fix: `scratch/r21-recheck.md` records the failing test, error class and first failing SHA, and AC-006 takes its filed-root-cause branch.
- A failed run is tempting to rerun: the phase forbids it; a rerun of a failed run is not a green run and is recorded as a retry if it happens.

### State Transitions
- Probe to change: the probe config is deleted before the real config is edited, so no untracked config survives.
- Config to shard: reverting the one `fileParallelism` line and applying the shard step is the fallback; the two are never both active.
- Partial completion: the R20 change and its measurement can land before R21 closes; the phase stays open until the green streak or the filed root cause exists.
- Rollback: revert the config line or the shard step; no state, cache or data is created.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | 1 config line and comment, at most 1 workflow step, at most 3 test or script files, 3 scratch records |
| Risk | 7/25 | Parallel files can collide on a fixture; the fallback is a two-way shard and a one-line revert |
| Research | 5/20 | The research phase measured the step and the failures; this phase re-checks 40 runs per workflow and runs one probe |
| Multi-Agent | 2/15 | One executor and one workstream. No second agent owns a file, and the three R21 workflows are read through `gh` rather than delegated |
| Coordination | 4/15 | One upstream baseline (002), one `gh` session, and green streaks that wait on repository traffic. No operator answer is needed |
| **Total** | **23/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The 183 CLI files share a mutable fixture or a fixed path that only collides under parallelism | H | M | The probe runs three times and reads the log for `EEXIST`, `EADDRINUSE`, `SQLITE_BUSY` or a shared temp path; a hit chooses the shard, and the config flip is one line to revert (T004 to T008) |
| R-002 | The local probe is faster or slower than the 4-vCPU runner, so three local greens do not prove CI | M | M | The probe decides pass or fail, never duration; the CI acceptance adds 5 green runs, and a collision there reverts to the shard (T004 to T008, T034, T035) |
| R-003 | The 10-green watch depends on repository traffic, and two of the three workflows are path-filtered | M | H | diagram-corpus has `workflow_dispatch` and is dispatched one run at a time; the other two wait for natural runs; a failed run is never rerun (T036) |
| R-004 | The `STALE_SOURCE_DIGEST` class recurs whenever a commit edits a contract source without recompiling | M | M | The fast-fail step checks the same fact in seconds before the 12-minute suite, and `check-contract-drift.vitest.ts` keeps the assertion (T023 to T026) |
| R-005 | The diagram-corpus and skill-advisor-stress failures are already fixed, so the phase looks like it did nothing | L | H | The re-check is the deliverable: it records the newest green run and the cause the log named, which is exactly what R21 asks for (T017 to T022, T027, T028) |
| R-006 | The CLI step's wall time varies with runner load, so one post-change sample can miss the 400 s ceiling | M | M | The acceptance reads the first post-change run and the next 5 runs, and a miss applies the shard rather than relaxing the ceiling (T034, T035) |
| R-007 | A pre-existing red test unrelated to concurrency is mistaken for a collision | M | L | The probe log is classified: a collision token chooses the shard, and an assertion failure is fixed in the file the log names before the probe is rerun (T010) |
| R-008 | `gh` cannot read a failed log or a job timing | M | L | The command and its error are recorded in `scratch/`; a missing scope is a blocker, never a workaround (T015 to T021) |
| R-009 | Phase 003 or 004 shifts the line numbers this phase cites, because both edit `spec-kit-check.yml` and `deep-loop-runtime.yml` above the steps here | M | H | Every task quotes the step name and the anchor text as well as the line, and the pre-task checklist re-reads the file before editing (all tasks) |
| R-010 | A two-way shard hides one half's failure behind the other's success | M | L | `set -uo pipefail` without `-e`, two `wait ... \|\| status=1` lines and `exit "$status"`; a deliberately broken half proves the step fails (T013, T014) |
| R-011 | A rerun manufactures a green streak and hides a live failure | M | L | A task proves no retry, rerun or `continue-on-error` was added, and a rerun is recorded as a retry rather than as a green run (T030) |

## 11. USER STORIES

### US-001: Cut the slowest step in the check job (Priority: P0)

**As a** maintainer who pays for the repository's CI minutes, **I want** the `cli` vitest project to run its 183 files in parallel, or in two shards when a fixture collides, **so that** the `CLI vitest project` step falls from 791 s to under 400 s and the `check` job stops setting the wall-clock tail.

**Acceptance criteria:** AC-001, AC-002, AC-003, AC-011.

---

### US-002: Turn a stale failure count into a current, named cause (Priority: P1)

**As a** reviewer reading a red `main`, **I want** the latest 40 runs of deep-loop-runtime, diagram-corpus and skill-advisor-stress re-checked, and every failure that is still present root-caused or recorded closed, **so that** a red run means a current cause with a named test rather than a number carried over from the research phase.

**Acceptance criteria:** AC-004, AC-005, AC-006, AC-009.

---

### US-003: Keep the fix honest and the job shape final (Priority: P1)

**As the** author of `007-workflow-hygiene-on-off-control`, **I want** the phase to prove that no retry was added, that the five old failures are stale, and that the job shapes it leaves behind are the ones timeouts will be sized on, **so that** the timeout work measures a stable job and a green run still means something.

**Acceptance criteria:** AC-005, AC-007, AC-008, AC-010.

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---

## 12. OPEN QUESTIONS

- Do the 183 CLI test files share a mutable fixture that only collides under parallelism? R19 answers it with three runs; a collision is the shard trigger, not a redesign.
- Will 10 green runs accumulate at this repository's traffic? diagram-corpus can be dispatched through `workflow_dispatch` at `:15`; deep-loop-runtime and skill-advisor-stress are path-filtered, so the phase waits for natural runs rather than rerunning a failed one.
- Is 791 s a stable baseline? Four samples read 776, 791, 950 and 795 s (`iteration-005.md:47`), so the step moves with runner load. The acceptance is an absolute ceiling of 400 s on the first post-change run plus 5 green runs, not a ratio against 791.
- Does the `STALE_SOURCE_DIGEST` class still appear in the latest 40 deep-loop-runtime runs? The sample read on 2026-10-23 has 13 failures, the newest on `b1f6c78` at 2026-10-22, and the newest three runs pass, so the class is in the window and its fix may already be in the tree. The re-check records which, and the fast-fail step is added either way because the class recurs whenever a contract source is edited without recompiling.
<!-- /ANCHOR:questions -->

---

