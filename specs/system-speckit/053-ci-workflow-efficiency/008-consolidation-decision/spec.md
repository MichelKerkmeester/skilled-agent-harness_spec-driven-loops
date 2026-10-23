---
title: "Feature Specification: Phase 8: consolidation-decision"
description: "The nine always-run workflows spend 13 jobs and about 1,866 runner-minutes a day on every push, and the research's merge estimate of 1,241-1,606 is an upper bound whose inputs have all moved: R1 removes 35 of 73 push SHAs, R4 removes 30 of 38 human pushes from command-tree-parity, R6 and R8 change two of the nine, and phases 004 to 007 change the job shapes around them. This phase re-measures the nine after phases 002 to 007, records the before and after numbers in a decision record, and merges any of them only on an operator yes."
trigger_phrases:
  - "consolidation decision"
  - "phase 8 consolidation decision"
  - "always-run workflow consolidation"
  - "job consolidation decision gate"
  - "ci merge upper bound re-measure"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: consolidation-decision

<!-- SPECKIT_LEVEL: 3 -->
---

<!-- ANCHOR:metadata -->
## EXECUTIVE SUMMARY

Nine workflows run on every push with no path filter. They spend 13 jobs and 25 billed minutes per push, about 1,866 runner-minutes a day at the volume the 001 dataset measured. The research priced merging them into one job at 1,241-1,606 runner-minutes a day, and every input to that number has since moved: R1 removes 35 of 73 push SHAs, R4 filters one of the nine, R6 and R8 change two more, and phases 004 to 007 change the job shapes, timeouts and switches around them. This phase re-measures the nine after those phases land, records the before and after numbers, and merges nothing unless the operator answers D8 yes.

**Key Decisions**: D8, whether any always-run workflow is merged, with no merge as the default; the FRESHNESS switch group as the only legal merge boundary.

**Critical Dependencies**: phases 002 to 007 landed, the 002 post-R1 baseline, and `gh` authenticated with `repo` and `actions`.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-10-23 |
| **Branch** | `worktrees/214-ci-efficiency-phase-plans` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 9 |
| **Predecessor** | 007-workflow-hygiene-on-off-control |
| **Successor** | 009-doctor-ci-review-wiring |
| **Handoff Criteria** | `scratch/consolidation-decision.md` carries the nine workflows' 13 jobs measured before and after phases 002 to 007, the recomputed merge upper bound and D8's answer; under D8 = no, `git diff --stat "$(cat scratch/phase-start-sha.txt)"..HEAD -- .github/workflows` is empty; under D8 = yes, one workflow carries one job with every step preserved and `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`; and `validate.sh --strict` on this folder prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the CI efficiency implementation phases specification. It carries R27 of `001-research/research/synthesis-reviews/final-review.md` (`:495-503`) and the phase-008 gate in that review's phase plan (`:594-598`). Its operator decision is D8 (`:621`).

**Scope Boundary**: Measurement and decision only. The phase reads the nine always-run workflows, the 001 dataset, the 002 baseline and the post-007 tree, and writes its own `scratch/` records. It changes no workflow, script, check or switch unless D8 approves a merge, and a merge is confined to one switch group.

**Dependencies**:
- `002-rebuild-fanout-removal` (R1, R2) for the post-R1 baseline. R1 removes 35 of 73 push SHAs (`final-review.md:57`), so every "today's volume" figure halves before this phase measures.
- `003-trigger-and-job-hygiene` (R3 to R11). R4 removes 30 of 38 human pushes from `command-tree-parity.yml` (~265 runner-min/day standalone, ~123 after R1, `final-review.md:247`); R6 changes `dispatch-enforcement-guard.yml`'s shape (~75-150 standalone, 39-78 after R1, `:271`); R8 drops full history from `rule-canary-sync.yml` (~39 after R1, `:295`). R3, R5, R7, R9, R10 and R11 do not move the nine's push numbers.
- `004-setup-caching-provisioning` (R12 to R18). R14 lands the composite setup action (~145 standalone, ~74 after R1, `final-review.md:358`) and R15 merges `hooks-node-tests.yml` into `opencode-plugin-tests.yml` (124 standalone, ~53 after R1, ~27 after R1 and R14, `:370`). Neither workflow is one of the nine; R27 names them because they are the last job-shape changes before the decision.
- `005-slow-and-failing-tests` (R19 to R21). It changes the spec-kit CLI step and the failing suites; the nine are untouched, but the tree must be stable before the after snapshot.
- `006-sk-code-ci-surface` (R22, R23). It records the workflow rules the merge must satisfy, including the protected set and the switch shape.
- `007-workflow-hygiene-on-off-control` (R24 to R26). It assigns the switch groups: FRESHNESS is the six workflows at `.github/workflows/README.md:66` plus `naming-standard-guard.yml` at `:67`, `gate-inputs.yml` at `:68` and `changed-packet-validation.yml` at `:70`, 9 files and 13 jobs (`007-workflow-hygiene-on-off-control/spec.md:149`); MESSAGES is `message-contract.yml` at `:73`. Eight of the nine always-run workflows are FRESHNESS; `message-contract.yml` is MESSAGES.
- D8 (`final-review.md:621`), planned as its own pre-build task.
- `gh` authenticated with `repo` and `actions`, for the run list and the job JSON.
- A test branch for the conditional merge probe.

**Deliverables**:
- `scratch/consolidation-baseline.md`: the nine workflows and 13 jobs with the 001 and 002 before numbers.
- `scratch/window.json`, `scratch/runs-after.json` and `scratch/jobs/`: the post-007 snapshot and the window it covers.
- `scratch/consolidation-cost.mjs` and `scratch/consolidation-cost.md`: the reproducible arithmetic.
- `scratch/consolidation-decision.md`: the decision record with the before and after numbers and D8's answer.
- Under D8 = yes only: one merged workflow, the README rows and `scratch/merge-probe.md`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Nine workflows run on every push with no path filter: eight on `main` or `skilled/**`, and `message-contract.yml` on every branch. They are `advisory-checks.yml`, `changed-packet-validation.yml`, `command-tree-parity.yml`, `dispatch-enforcement-guard.yml`, `gate-inputs.yml`, `message-contract.yml`, `playbook-operator-contract.yml`, `rule-canary-sync.yml` and `sk-doc-script-tests.yml` (`.github/workflows/README.md:66,68,70,73`). The 001 dataset counted these nine as always-run; phase 003's R4 later filters one of them, `command-tree-parity.yml`, which is part of why the after number is lower. Their 13 jobs total 1,065 job-seconds and 25 billed minutes per push, and the research's merge estimate is an upper bound of 1,241-1,606 runner-minutes a day at today's volume (`001-research/research/iterations/iteration-019.md:68-77`). Every input to that bound has moved: R1 removes 35 of 73 push SHAs, R4 removes 30 of 38 human pushes from one of the nine, R6 and R8 change two more, and phases 004 to 007 change the job shapes around them and the switch and timeout settings every job will carry. A decision made from the old number would price a merge on volume that no longer exists.

### Purpose
Produce one decision record that carries the nine workflows' 13 jobs measured before and after phases 002 to 007, the recomputed merge upper bound on the post-007 volume, the signal cost of collapsing 13 contexts into one, and D8's answer, and merge nothing unless the operator says yes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R27: the before table from the 001 dataset (`001-research/scratch/ci-run-data/summary.md:7-20,45-56`) and the 002 post-R1 baseline.
- R27: the after snapshot, at least 24 h after phase 007 lands, with 40 runs per workflow or every run in the window, whichever is smaller.
- R27: the recomputed merge bound for the eight always-run FRESHNESS workflows, 12 jobs, with `message-contract.yml` excluded because it is MESSAGES and its context is required (`001-research/research/research.md:189`).
- R27: `scratch/consolidation-decision.md`, the decision record with the before and after numbers, the signal cost, the recommendation and D8's answer.
- D8: a merge of the approved subset into one workflow and one job inside `SKILLED_CI_FRESHNESS`, only on an operator yes, with every step preserved and guarded by `if: always()`.
- Under D8 = yes only: `.github/workflows/README.md`'s contents table, push/PR table and switch-group section, and `scratch/merge-probe.md`.

### Out of Scope
- Any change to what a check verifies, its assertions, its fixtures or its exit codes.
- Merging `message-contract.yml`, `naming-standard-guard.yml` or any workflow outside the always-run FRESHNESS set: message-contract is MESSAGES and its context is required; naming-standard-guard is not always-run.
- Merging across switch groups: one job answering two variables would make one group's switch govern another group's checks.
- Re-running the 001 research or re-deriving its 20 iterations.
- `/doctor:ci` and its report: `009-doctor-ci-review-wiring` owns it, and it reads this phase's decision.
- The parent `spec.md`, `description.json` and `graph-metadata.json`: the orchestrator owns them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/phase-start-sha.txt` | Create | The commit the phase started on, so its own diff range is exact |
| `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/pre-merge-inventory.md` | Create | The post-007 job inventory |
| `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/consolidation-baseline.md` | Create | The 9 workflow rows and 13 job rows with the 001 and 002 before numbers |
| `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/runs-after.json` | Create | The 1,000-run list taken after phase 007 |
| `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/jobs/<workflow>/index.json` | Create | The newest 40 run ids per workflow |
| `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/jobs/<workflow>/<run-id>.json` | Create | Job-level samples for the nine workflows |
| `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/window.json` | Create | The machine-readable window start, end and hours per workflow |
| `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/snapshot-window.md` | Create | The human rendering of the window and its run counts |
| `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/consolidation-cost.mjs` | Create | The arithmetic: job seconds, billed minutes, merge bound, `--check` |
| `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/consolidation-cost.json` | Create | The machine-readable form of the computed table |
| `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/consolidation-cost.md` | Create | The computed table the decision record quotes |
| `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/consolidation-decision.md` | Create | The decision record with the before and after numbers and D8's answer |
| `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/d8-answer.md` | Create | D8's answer as one line, written before any merge task |
| `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/no-merge.md` | Create only if D8 = no | The empty-diff proof |
| `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/merge-probe.md` | Create only if D8 = yes | The forced-failure probe |
| `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/phase-result.md` | Create | The gate outputs and, under D8 = yes, the post-merge re-measure |
| `.github/workflows/always-run-guards.yml` | Create only if D8 = yes | One workflow, one job, the approved always-run steps |
| `.github/workflows/advisory-checks.yml`, `changed-packet-validation.yml`, `command-tree-parity.yml`, `dispatch-enforcement-guard.yml`, `gate-inputs.yml`, `playbook-operator-contract.yml`, `rule-canary-sync.yml`, `sk-doc-script-tests.yml` | Delete only if D8 = yes | Their steps move into the merged file |
| `.github/workflows/README.md` | Modify only if D8 = yes | The contents table, the push/PR table and the switch-group section |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional requirements by R-id

| R-id | What the phase must make true | Requirements | Tasks |
|------|-------------------------------|--------------|-------|
| R27 | The nine always-run workflows and their 13 jobs are measured before and after phases 002 to 007, the merge bound is recomputed from job seconds and the checkouts the jobs pay, and one decision record carries both numbers, the signal cost, the recommendation and D8's answer | REQ-001, REQ-002, REQ-006 | T002 to T011, T015, T020, T021 |
| D8 | No workflow file is merged unless the operator answers yes; the default is no merge; the answer is recorded before any merge task runs; a merge is one workflow, one job, one switch group, with every step preserved and guarded | REQ-003, REQ-004 | T012 to T020 |
| Cross-cutting | The gates pass, the README names the merged file once under a merge, and no ephemeral id enters a workflow comment, a step name, a job name or a README sentence | REQ-005, REQ-007, REQ-008 | T017 to T019, T021 to T025 |

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | **R27.** Re-measure the nine always-run workflows and their 13 jobs after phases 002 to 007. The before table carries the 001 dataset rows (73 runs, 25 billed minutes per push, 1,866 runner-min/day) and the 002 post-R1 baseline; the after table carries a fresh snapshot at least 24 h after phase 007, with at least 40 runs per workflow or every run in the window, whichever is smaller |
| REQ-002 | **R27.** `scratch/consolidation-decision.md` names the nine workflows, their 13 jobs, the eight-workflow FRESHNESS candidate set and the exclusion of `message-contract.yml`; it carries the before and after numbers, the recomputed merge upper bound at today's volume (1,241-1,606 runner-min/day) and on the post-007 volume, the signal cost, the recommendation and D8's answer |
| REQ-003 | **D8.** No workflow file is merged unless the operator answers yes. The default is no merge, and the no-merge path leaves `.github/workflows/` byte-identical over the phase's own diff range. The answer is recorded as one `D8=` line in `scratch/d8-answer.md` and copied into `scratch/consolidation-decision.md` before any merge task runs |
| REQ-004 | **R27, D8 = yes only.** The merge is one workflow, one job, one switch group (`SKILLED_CI_FRESHNESS`), one checkout, one `timeout-minutes` and one `vars.*` switch. Every merged step keeps its name and fail-closed block, and every step after the checkout carries `if: always() && (<original condition>)` or `if: always()` when it had none. `message-contract.yml` and every workflow outside the eight-workflow FRESHNESS set stay unmerged |
| REQ-005 | The gates pass: `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`, every workflow parses as YAML, and `validate.sh --strict` on this folder prints `RESULT: PASSED` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The measurement is reproducible. Job seconds run from `startedAt` to `completedAt`; billed minutes are `ceil(seconds / 60)` per job; per-day figures scale the window by `24 / 23.5`; a skipped run and a job with no timestamps are excluded and counted. Every number in the decision record names a run id, the 002 baseline or the 001 summary |
| REQ-007 | Under D8 = yes, `.github/workflows/README.md`'s contents table, push/PR table and switch-group section name the merged file once each, and `009-doctor-ci-review-wiring`'s report can still list every workflow and its switch state |
| REQ-008 | No ephemeral artifact id appears in a code comment: no R-id, D-id or phase number is added to a workflow comment, a step name, a job name or a README sentence. The decision record and these spec documents may cite them |

### Edge cases by R-id

| R-id | Edge case | Handling |
|------|-----------|----------|
| R27 | Fewer than 40 runs in the 24 h window | Use every run in the window; below 20, extend to 48 h and record both spans in `scratch/window.json` and `scratch/snapshot-window.md` |
| R27 | A job with no successful run | Size it from its failed runs and mark it `failed-only`; a job with no run at all is `no-sample` and takes no part in the subtraction |
| R27 | A skipped run, or a run whose `jobs` array is empty | Exclude it from the medians and count it in the cost table; a skipped workflow has no job time |
| R27 | A workflow deleted by an earlier phase | `hooks-node-tests.yml` is not one of the nine; if a named file is gone, re-read the tree and record the replacement rather than measuring a missing file |
| R27 | A checkout step renamed or replaced | Locate it by the step name matching `actions/checkout`, never by the step's position; mark a job with no such step `no-checkout` and subtract only the checkouts that exist |
| R27 | The nine's member set changes because R4 filters `command-tree-parity.yml` | The candidate set stays the eight FRESHNESS files; the filter changes the run count, not the membership |
| D8 | A merged step that must not run after a failure | Its condition becomes `if: always() && (<original condition>)`; a step with no condition becomes `if: always()`; the probe forces one failure and reads every later step |
| D8 | A member needs full history (`changed-packet-validation.yml:17-19` diffs against the base) | The single merged checkout carries `fetch-depth: 0`, so the measured checkout term is the depth-0 time, not the shallow median |
| D8 | A merge that would include `message-contract.yml` | Rejected: the job would answer both `SKILLED_CI_FRESHNESS` and `SKILLED_CI_MESSAGES` and its context is required (`001-research/research/research.md:189`) |
| D8 | A member carries a `schedule:` trigger (`playbook-operator-contract.yml:9-10`) | The merged `on:` keeps the union, including `schedule: - cron: '17 6 * * *'`; dropping it would silently end the daily run |

### Risks by R-id

| R-id | Risk | Mitigation |
|------|------|------------|
| R27 | The 1,241-1,606 bound is mistaken for the post-007 saving | The decision record shows both numbers, labels the first "today's volume", and quotes the measured second |
| R27 | A thin sample overstates or understates the median | Every sample count is printed beside its median; below 20 runs the window doubles and both spans are recorded |
| R27 | `gh` hits its rate limit mid-snapshot | Stop, record the command and the error, resume from the saved page; never interpolate a missing run |
| D8 | A merged job loses the per-check signal | Every merged step carries `if: always()`, and the probe forces one failure and reads the later steps |
| D8 | A merge crosses switch groups | Only the eight FRESHNESS workflows are candidates; `message-contract.yml` is excluded |
| D8 | The merged job's serial wall clock delays the push tail | `spec-kit-check.yml`'s 1,178 s remains the tail (`001-research/scratch/ci-run-data/summary.md:9`); the probe records the merged job's wall clock |
| D8 | The merged checkout at depth 0 costs more than the shallow members did | The cost script measures the checkout term from the snapshot; the decision record quotes the measured value, not the 50-76 s estimate |

### Rollback by R-id

| R-id | Rollback |
|------|----------|
| R27 | The measurement artifacts are documents under `scratch/`. Delete or correct the wrong one and re-run `node scratch/consolidation-cost.mjs`; no repository file is involved |
| D8 | A merge reverts as one commit: `git revert <merge-commit>` restores the eight deleted workflow files and the README rows, and leaves the decision record in place. Under the default there is nothing to revert in `.github/workflows/` |

R27's saving is an upper bound of 1,241-1,606 runner-min/day at today's volume, and far less after R1 (`final-review.md:500`). The bound is built from 13 jobs at 1,065 job-seconds and 25 billed minutes per push: one merged job keeps one checkout, so its work is `1,065 s - 12 x checkout`, which is 153-465 s at the measured 50-76 s checkout (`iteration-019.md:75-77`), or 3-8 billed minutes, a saving of 17-22 minutes per push over 73 pushes (`iteration-019.md:68-69`). R1 removes 35 of those 73 pushes, so the same per-push saving on 38 human pushes is about 646-836 runner-min/day before R4, R6 and R8 remove further work; the phase measures that number rather than asserting it. The FRESHNESS eight are 12 jobs and 987 job-seconds, so the same arithmetic gives `987 s - 11 x 50..76 s = 151..437 s`, 3-8 billed minutes against 23, and 15-20 minutes per push. The phase's own saving is 0 unless D8 says yes.

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/consolidation-baseline.md` carries 9 workflow rows and 13 job rows, the 1,065 job-second and 25 billed-minute totals, and the 1,241-1,606 runner-min/day bound with its arithmetic.
- **SC-002**: The post-007 snapshot reproduces every recorded per-workflow figure through `node scratch/consolidation-cost.mjs --check`, and the decision record shows the bound at today's volume beside the bound on the post-007 volume.
- **SC-003**: `scratch/consolidation-decision.md` names the nine workflows, the eight-workflow FRESHNESS candidate set, the `message-contract.yml` exclusion, the signal cost and D8's answer.
- **SC-004**: Under D8 = no, the phase's own diff over `.github/workflows` is empty; under D8 = yes, one workflow carries one job, every merged step appears once, every step after the checkout carries `if: always()`, and the gates pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `002-rebuild-fanout-removal` and its `scratch/baseline-24h/summary.md` | The post-R1 before number is missing | T002 marks the phase `[B]` until the baseline exists |
| Dependency | Phases 003 to 007 and their `scratch/` results | The after snapshot is taken on a shape that later phases change | T002 checks each phase's result and the tree; the snapshot waits for 007 |
| Dependency | Operator decision D8 | No merge may start, and the phase cannot say whether the operator wants one | T012 records the default, no merge, and gates T014 to T020 |
| Dependency | `gh` with `repo` and `actions` scopes | No run list, no job samples, no decision record | Every command and its output is recorded under `scratch/`; a missing scope is a blocker, not an estimate |
| Risk | Fewer than 40 runs per workflow in the post-R1 24 h window | A thin sample overstates or understates the median | Use every run in the window; extend to 48 h when fewer than 20 |
| Risk | The checkout step is renamed or absorbed by another action | The merge arithmetic loses its checkout term | Locate checkout by the step name matching `actions/checkout`; mark a job with no checkout and exclude it from the subtraction |
| Risk | A merged job loses the per-check signal | A failing step stops the later checks | Every merged step carries `if: always()`, and the probe forces one failure and reads the later steps |
| Risk | A merge crosses switch groups | One variable would govern another group's checks | Only the eight FRESHNESS workflows are candidates; `message-contract.yml` is excluded |
| Risk | The 1,241-1,606 bound is mistaken for the post-007 saving | The operator approves a merge on a stale number | The decision record shows both numbers, labels the first "today's volume", and recomputes the second |
| Risk | The merged checkout must keep `fetch-depth: 0` for one member | The merged job's checkout costs the depth-0 time, so the saving is smaller than the shallow estimate | The cost script measures the checkout term from the snapshot, and the decision record quotes the measured value |
<!-- /ANCHOR:risks -->

---



---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The post-007 snapshot is about 360 `gh run view` calls, taken once and kept as JSON; a second arithmetic pass must not re-spend it.
- **NFR-P02**: The decision record is produced in one sitting from `scratch/consolidation-cost.md`; no number is recomputed by hand.

### Security
- **NFR-S01**: Every `gh` call is read-only (`gh run list`, `gh run view`). The phase writes no repository variable, reads no secret and adds no permission; a merge keeps `permissions: contents: read`.
- **NFR-S02**: The measurement records run ids, SHAs and job names only; no token, PR body or commit message text is copied into `scratch/`.

### Reliability
- **NFR-R01**: `node scratch/consolidation-cost.mjs --check` reproduces every recorded number from the saved JSON, so a mistyped figure fails the check rather than the reader.
- **NFR-R02**: A missing sample is marked `thin`, `no-sample` or `failed-only`, never estimated; a skipped run is excluded and counted.
- **NFR-R03**: Under D8 = no, the phase changes no workflow, so the only failure mode is a wrong decision record, which is correctable by editing one file.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Fewer than 40 runs in 24 h: use every run in the window; fewer than 20: extend the window to 48 h and record both spans.
- A job with no successful run: size it from its failed runs and mark it `failed-only`; a job with no run at all is `no-sample` and takes no part in the merge subtraction.
- A skipped run: `conclusion: skipped` is excluded from the medians and counted in the table.
- A run whose `jobs` array is empty: excluded and counted, because a skipped workflow has no job time.

### Error Scenarios
- `gh` rate limit or a missing scope: stop the snapshot and record the command and the error; resume from the saved page, never interpolate.
- A workflow deleted by an earlier phase: `hooks-node-tests.yml` is not one of the nine; if a named file is gone, re-read the tree and record the replacement rather than measuring a missing file.
- A checkout step renamed or replaced: locate it by the step name matching `actions/checkout`; if a job has none, mark it `no-checkout` and subtract only the checkouts that exist.
- A merged step that must not run after a failure: its condition becomes `if: always() && (<original condition>)`; a step with no condition becomes `if: always()`. The probe forces one failure and reads every later step.
- A merge that would include `message-contract.yml`: rejected, because the job would answer both `SKILLED_CI_FRESHNESS` and `SKILLED_CI_MESSAGES` and its context is required (`001-research/research/research.md:189`).

### State Transitions
- Partial completion: the before table, the after snapshot, the cost table and the decision record land in that order, so no document quotes a number the previous one has not produced.
- D8 = no: the phase closes with the decision record and no workflow diff; T015 to T020 are cancelled, not blocked.
- D8 = yes: the merge is one commit after the decision record, so a failed probe names the merge commit and a revert restores the deleted workflow files.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One decision record, the scratch measurement set, and a conditional merge of at most eight workflow files |
| Risk | 14/25 | 13 check contexts collapse into one if merged, the merged job is serial, and the saving rests on a checkout term that a later action can change |
| Research | 10/20 | Re-measure 13 jobs across nine workflows and reconcile six phases' results, but no new checker or parser to read |
| Multi-Agent | 3/15 | One executor, one workstream: the measurement and the decision are a single serial pass, and no task can run beside another without quoting an unfinished number |
| Coordination | 7/15 | Six phases must have landed, one operator decision gates the merge, and one successor phase reads the outcome |
| **Total** | **42/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The post-007 sample is too thin to distinguish the merge saving from run-to-run noise | H | M | Print every sample count beside its median; extend to 48 h below 20 runs; mark a job `thin` rather than quoting a two-run median |
| R-002 | The 002 baseline or a phase 003 to 007 result is missing when the phase starts | H | M | T002 is `[B]` until the baseline exists and stops the measurement when a named phase result is absent |
| R-003 | `gh` loses its `actions` scope or hits the rate limit mid-snapshot | M | L | Every page is saved before the next call; a failure stops the snapshot and records the command and the error |
| R-004 | A merged job stops running a later check after the first failure | H | M | Every merged step carries `if: always()`, and T020 forces one failure and reads every later step |
| R-005 | The merge includes `message-contract.yml` or crosses into MESSAGES | H | L | The candidate set is the eight FRESHNESS files; T015 asserts the merged file does not name message-contract |
| R-006 | The single merged checkout drops `fetch-depth: 0` and `changed-packet-validation` can no longer diff against its base | H | M | T015 gives the checkout `fetch-depth: 0`, and T020's probe reads the changed-packet step's conclusion |
| R-007 | The merged `on:` drops `playbook-operator-contract.yml`'s daily schedule | M | M | T015 copies the union including `schedule: - cron: '17 6 * * *'`, and T015's own check asserts the `schedule:` key exists |
| R-008 | A step from a workflow with no `setup-node` lands in the Node 22 group and behaves differently | M | L | Such steps go in the Node 20 group, the major a runner without `setup-node` provides; T020 reads each step's conclusion |

## 11. USER STORIES

### US-001: The operator gets a measured merge decision (Priority: P0)

**As an** operator who owns the CI budget, **I want** the nine always-run workflows re-measured after every optimisation phase has landed, **so that** a merge is priced on the volume that exists rather than on the volume the research measured.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-001 to AC-004).

---

### US-002: The maintainer keeps the per-check signal unless a merge is approved (Priority: P1)

**As a** maintainer reading a red run, **I want** the default path to change no workflow and any approved merge to keep every step name and run every step after a failure, **so that** one failing check still names itself and never hides the checks behind it.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-005 to AC-009).

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---

## 12. OPEN QUESTIONS

- Will the post-007 measurement leave a material saving? The review's 1,241-1,606 is today's volume; R1 removes 35 of 73 push SHAs, so the expectation is about 646-836 runner-min/day before R4, R6 and R8 remove further work. T009 records the observed number rather than assuming the projection.
- Does R14 change the nine's checkout? Its adoption list is `hooks-node-tests.yml`, `opencode-plugin-tests.yml` and `opencode-dual-version.yml` (`final-review.md:353`), none of them in the nine, so the expectation is no. T002 re-reads the tree, and the cost script locates checkout by the step name matching `actions/checkout`.
- Does a merged job's 8-10 minute serial wall-clock hurt the push tail? `spec-kit-check.yml`'s 1,178 s remains the tail (`001-research/scratch/ci-run-data/summary.md:9`), so the expectation is no; T020 records the merged job's wall clock if D8 says yes.
<!-- /ANCHOR:questions -->
