---
title: "Implementation Plan: Phase 8: consolidation-decision"
description: "Re-measure the nine always-run workflows' 13 jobs after phases 002 to 007, recompute the merge upper bound from job seconds and the checkouts the jobs pay, and record the before and after numbers, the signal cost and D8's answer in one decision record. No workflow changes unless the operator approves a merge, and a merge is confined to the eight always-run workflows in the FRESHNESS switch group."
trigger_phrases:
  - "consolidation decision plan"
  - "phase 8 consolidation decision plan"
  - "always-run workflow merge measurement"
  - "job consolidation cost arithmetic"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: consolidation-decision

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions YAML; Node.js 20/22 for the cost script; bash for the gates; the `gh` CLI for run and job data |
| **Framework** | GitHub Actions triggers and job-level `vars.*` switches, the composite setup action from phase 004, and the repository's twin-filter gate |
| **Storage** | `scratch/` JSON and markdown only; no runtime storage |
| **Testing** | `bash .github/scripts/check-gate-inputs.sh`; a YAML parse of all workflows; `node scratch/consolidation-cost.mjs --check`; `gh run list` and `gh run view --json jobs`; `validate.sh --strict` |

### Overview
This is a measurement and decision phase. It takes the 001 dataset and the 002 post-R1 baseline as the before numbers, a fresh 24 h snapshot after phase 007 as the after numbers, computes job seconds and billed minutes per job, and recomputes the merge upper bound from the 13 jobs and the checkouts they pay. The decision record is the deliverable. No workflow changes unless D8 says yes, and a merge stays inside the FRESHNESS switch group.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified: the 002 baseline exists, phases 003 to 007 have landed, D8 is asked, and `gh` holds `repo` and `actions`

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing: `node scratch/consolidation-cost.mjs --check` exits 0, `check-gate-inputs.sh` prints `RESULT: PASSED`, and every workflow parses
- [ ] Docs updated: the decision record, the before table, the cost table, and under D8 = yes the README table and switch-group section
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Decision gate: measure, record, decide, then execute only on approval. The measurement is reproducible from saved JSON; the decision is one document; the execution is one conditional commit.

### Key Components
- **The nine always-run workflows and their 13 jobs**: `advisory-checks.yml:2-6` (job `advisory` at `:17`), `changed-packet-validation.yml:3-7` (`changed-packets` at `:13`), `command-tree-parity.yml:3-8` (`command-tree-parity` at `:14`, `hermes-mirror` at `:46`), `dispatch-enforcement-guard.yml:3-8` (`dispatch-enforcement-guard` at `:14`, `hooks-vitest` at `:52`), `gate-inputs.yml:2-6` (`gate-inputs` at `:12`), `message-contract.yml:7-11` (`message-contract` at `:17`), `playbook-operator-contract.yml:2-11` (`operator-contract` at `:14`), `rule-canary-sync.yml:2-6` (`rule-canary` at `:9`) and `sk-doc-script-tests.yml:8-12` (`sk-doc-scripts` at `:18`, `catalog-packages` at `:58`, `citation-drift` at `:75`).
- **The 001 dataset** (`001-research/scratch/ci-run-data/summary.md:7-20,45-56`): 73 runs in a 23.5 h window per workflow, 25 billed minutes per push across the 13 jobs, 1,866 runner-min/day, and the per-job medians that sum to 1,065 job-seconds.
- **The 002 post-R1 baseline** (`002-rebuild-fanout-removal/scratch/baseline-24h/summary.md`): the before number once R1 removes 35 of 73 push SHAs (`final-review.md:57`).
- **The post-007 snapshot** (`scratch/runs-after.json`, `scratch/jobs/`, `scratch/window.json`): the after number, taken at least 24 h after the last phase lands.
- **The cost script** (`scratch/consolidation-cost.mjs`): reads the snapshot, computes seconds, billed minutes, per-workflow per-day figures and the merge bound, and re-derives the decision record's numbers under `--check`.
- **The switch groups** (`007-workflow-hygiene-on-off-control/spec.md:149`): FRESHNESS is the six workflows at `.github/workflows/README.md:66` plus `naming-standard-guard.yml` at `:67`, `gate-inputs.yml` at `:68` and `changed-packet-validation.yml` at `:70`, 9 files and 13 jobs. MESSAGES is `message-contract.yml` at `:73`. Eight of the nine always-run workflows are FRESHNESS; `message-contract.yml` is MESSAGES.
- **The conditional merge** (`.github/workflows/always-run-guards.yml`): one workflow, one job, one checkout at `fetch-depth: 0`, every approved step preserved by name and guarded by `if: always()`, one timeout and one `vars.SKILLED_CI_FRESHNESS` switch.

### Data Flow
The 001 dataset and the 002 baseline give the before numbers → a fresh 24 h snapshot after phase 007 gives the after numbers → per-job seconds become billed minutes at `ceil(seconds / 60)` → the approved set's job sum minus one checkout per merged job (11 checkouts for the FRESHNESS eight's 12 jobs, 12 checkouts for the review's nine-workflow bound) gives the merged job's seconds → the difference between the current billed minutes and the merged billed minutes is the saving per push → multiplied by the measured runs per day it is the merge bound → the decision record states both bounds and D8's answer → no answer means no merge, and a yes means one commit that creates the merged workflow, deletes the approved files and updates the README.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The nine always-run workflow files | Producer of the 13 jobs and 25 billed minutes per push | unchanged under the default; merged only on D8 = yes | `git diff --stat "$(cat scratch/phase-start-sha.txt)"..HEAD -- .github/workflows` is empty under the default |
| `.github/workflows/README.md:64-75` | The push/PR table and the switch-group source | unchanged under the default; updated only on D8 = yes | `sed -n '64,75p' .github/workflows/README.md` matches the YAML before and after |
| `007-workflow-hygiene-on-off-control`'s switch-group assignment | Consumer of the workflow count and group membership | read-only; a merge leaves one FRESHNESS workflow fewer | `grep -c 'SKILLED_CI_FRESHNESS' .github/workflows/*.yml` before and after a merge |
| `009-doctor-ci-review-wiring`'s `/doctor:ci report` | Lists every workflow and its switch state (`001-research/research/research.md:176`) | read-only; a merge lowers the count by the number of deleted files | the report lists the merged file once, with the FRESHNESS switch |
| `message-contract.yml:7-11` | The required context, in the MESSAGES group | excluded from every merge | `grep -c 'message-contract' .github/workflows/always-run-guards.yml` is 0 under D8 = yes |
| `trigger-index-rebuild.yml` | R1's skip and the rebuild path; not one of the nine | unchanged | `git diff --stat "$(cat scratch/phase-start-sha.txt)"..HEAD -- .github/workflows/trigger-index-rebuild.yml` is empty |
| `scratch/` | The phase's only output under the default | create the inventory, baseline, snapshot, cost table and decision record | every file exists and `node scratch/consolidation-cost.mjs --check` exits 0 |

Required inventories:
- Same-class producers: `python3 -c "import glob, yaml; print([(f, sorted(yaml.safe_load(open(f))['jobs'])) for f in glob.glob('.github/workflows/*.yml')])"` lists every workflow's jobs; the nine named files must produce 13 jobs. A Python parse of each file's `on.push` block shows no `paths:` and no `paths-ignore:`, which is what makes them always-run; a `grep -L 'paths:'` would give the wrong answer once R4 adds a filter to `command-tree-parity.yml`.
- Consumers of the decision: `.github/workflows/README.md:64-75`, `007-workflow-hygiene-on-off-control/scratch/switch-groups.md`, and `009-doctor-ci-review-wiring`'s report (`001-research/research/research.md:176`). The active ruleset requires only message-contract's context, so a merge renames no required check.
- Matrix axes: D8 answer (no, yes) × candidate set (eight FRESHNESS workflows, all nine, a subset) × measurement source (001 dataset, 002 baseline, post-007 snapshot). Required rows: no merge + all nine (the default); merge + eight FRESHNESS (the legal shape); merge + all nine (rejected: crosses into MESSAGES); merge + a subset (rejected: the phase fixes one candidate set so every task is deterministic); 001-only (stale, rejected as the decision number); post-007 (required).
- Algorithm invariant: the merge saving is the current billed minutes per push minus the merged job's billed minutes, where the merged job's seconds are the sum of the member job seconds minus one checkout per member less one, and no merge crosses a switch group. Adversarial cases: a job with no checkout, a job with zero samples, a skipped run, a renamed workflow, a step that must not run after a failure, and message-contract in the candidate set.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Implementation Notes

- **D8 defaults to no merge, and it is answered after the numbers exist.** R27 calls the risk high if merged and says the per-check signal is lost (`final-review.md:500-501`). The upper bound is 1,241-1,606 runner-min/day at today's volume, and most of it is checkout and rounding that R1 removes on 35 of 73 pushes. The alternative is one line: merge the eight FRESHNESS always-run workflows into one workflow with one job inside `SKILLED_CI_FRESHNESS`, worth at most the measured bound. The answer is recorded in `scratch/d8-answer.md` by T012, after T011 has written the measurements, and before any merge task runs.
- **The nine and the 13.** The nine always-run workflows are the six at `.github/workflows/README.md:66` plus `gate-inputs.yml` at `:68`, `changed-packet-validation.yml` at `:70` and `message-contract.yml` at `:73`; they are the 001 dataset's nine, and R4 later filters `command-tree-parity.yml`. Their jobs are 1 + 1 + 2 + 2 + 1 + 1 + 1 + 1 + 3 = 13. The 001 per-job medians sum to 1,065 seconds and 25 billed minutes per push (`001-research/scratch/ci-run-data/summary.md:45-56`; `iteration-019.md:68-77`).
- **The bound's arithmetic, and why it is stale.** One merged job keeps one checkout, so its work is `1,065 s - 12 x checkout`. At the measured 50-76 s checkout (`iteration-019.md:75-77`) that is 153-465 s, or 3-8 billed minutes against 25 today, a saving of 17-22 minutes per push over 73 pushes, or 1,241-1,606 runner-min/day (`iteration-019.md:68-69`). R1 removes 35 of those 73 pushes, so the same per-push saving on 38 human pushes is about 646-836 runner-min/day before R4, R6 and R8 remove further work. That projection is inferred; T009 measures the post-007 number and the decision record quotes the measured one.
- **The FRESHNESS eight are the merge candidate set.** Their 12 jobs total 987 job-seconds and 23 billed minutes per push, so the same arithmetic is `987 s - 11 x 50..76 s = 151..437 s`, 3-8 billed minutes, a saving of 15-20 minutes per push. At 73 pushes that is 1,095-1,460 runner-min/day, and at 38 it is 570-760; both are derived from the 001 medians and are quoted only as the expectation T009 replaces with a measurement.
- **The FRESHNESS group is the legal merge boundary.** Phase 007 puts the six at README:66 plus `naming-standard-guard.yml`, `gate-inputs.yml` and `changed-packet-validation.yml` in FRESHNESS, 9 files and 13 jobs (`007-workflow-hygiene-on-off-control/spec.md:149`). Eight of the nine always-run workflows are in it. `message-contract.yml` is MESSAGES and its context is required (`001-research/research/research.md:189`), so it is excluded: a job that answered both variables would let one group's switch govern the other group's checks.
- **The candidate set is fixed, not chosen at run time.** D8 offers two answers, `no` and `yes`, and `yes` merges all eight FRESHNESS always-run workflows. A subset answer is a re-plan, not a task: the arithmetic, the step order and the README edits are all written for the full set, and a subset would need a different plan. T012 stops on any third answer.
- **R14 and R15 do not touch the nine.** R14's composite action is adopted in `hooks-node-tests.yml`, `opencode-plugin-tests.yml` and `opencode-dual-version.yml` (`final-review.md:353`), and R15 merges the first two. None is one of the nine. R27 names them because they are the last job-shape changes before the decision and a merged always-run job would inherit the setup shape they define. The nine keep their plain `actions/checkout`; if the post-007 tree shows otherwise, the cost script locates checkout by the step name matching `actions/checkout` and marks a job with none.
- **Measurement is job-level, not run-level.** A run's wall clock includes the wait for a runner and the gaps between jobs; billing and `timeout-minutes` see job execution only (`final-review.md:28-33`). The snapshot therefore reads `gh run view <id> --json jobs` and computes each job's `completedAt - startedAt`. Billed minutes are `ceil(seconds / 60)` per job, the GitHub rule the 001 dataset uses (`001-research/scratch/ci-run-data/summary.md:5`), and per-day figures scale the window by `24 / 23.5`.
- **The 40-run target has a floor.** The 001 window gave every one of the nine 73 runs, but after R1 the same window gives about 38. The snapshot takes 40 runs per workflow or every run in the 24 h window, whichever is smaller, and extends to 48 h when fewer than 20 remain. A job with no successful run is sized from its failed runs and marked `failed-only`; a job with no run is `no-sample` and takes no part in the subtraction.
- **The merged checkout must keep `fetch-depth: 0`.** `changed-packet-validation.yml:17-19` checks out with `fetch-depth: 0` and diffs against the pull request base or the previous tip, so a single shallow checkout would break it. The merged job therefore pays the depth-0 checkout, and the measured saving is lower than the 50-76 s shallow estimate implies. The cost script measures the checkout term from the snapshot rather than assuming either value.
- **The merged `on:` is the union, including the schedule.** `playbook-operator-contract.yml:9-10` carries `schedule: - cron: '17 6 * * *'`; dropping it would silently end the daily run. The union is bare `pull_request:` because `advisory-checks.yml`, `gate-inputs.yml` and `playbook-operator-contract.yml` answer every pull request, `push: branches: [main, 'skilled/**']`, `workflow_dispatch:` and that `schedule:`.
- **The merge shape, if approved.** One workflow, `.github/workflows/always-run-guards.yml`, one job, one checkout, the eight workflows' steps in their original order, every step name preserved, every step after the checkout guarded by `if: always() && (<original condition>)` or `if: always()`, the fail-closed blocks kept verbatim, one `timeout-minutes` re-sized from the merged job's own samples and one `if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'`. The steps are ordered by Node major: the Node 20 group first, then `actions/setup-node` at 22, then the Node 22 group, with `actions/setup-python` before every Python step. A step from a workflow with no `setup-node` (`rule-canary-sync.yml:13-15`) goes in the Node 20 group, the major a runner without `setup-node` provides today. The eight approved files are deleted in the same commit. `message-contract.yml`, `naming-standard-guard.yml` and every TESTS, REVIEW or REPORTS workflow stay out.
- **A merge edits two protected workflows, and D8 = yes is the confirmation.** `dispatch-enforcement-guard.yml` and `gate-inputs.yml` are protected by function (`001-research/research/research.md:184-187`): one is the sole enforcer of an invariant with no local gate, the other is a guard whose failure invalidates other workflows' inputs. The safety rule there requires a second, named confirmation before a protected workflow is edited. D8 = yes is that confirmation, and it is recorded before T015 runs; no merge task may start on an unanswered D8.
- **The default path changes nothing in `.github/workflows/`.** The decision record is a `scratch/` document; under D8 = no the phase's own diff over the workflow tree is empty, and the phase closes on the record alone. T014 proves the empty diff with the phase start SHA recorded in T001.
- **Two decision documents, one purpose each.** `decision-record.md` holds this phase's design ADRs, one per frozen choice and one for D8. R27's deliverable is `scratch/consolidation-decision.md`, a measured decision record with Context, Candidates, Measurements, Signal cost, Recommendation and D8 answer sections. The measured record quotes numbers the ADRs do not repeat.
- **No ephemeral ids in code.** No R-id, D-id or phase number goes into a workflow comment, a step name, a job name or a README sentence. The decision record and these spec documents may cite them; the packet commit's id scan skips Markdown and the merge commit's scan is scoped to `.github/`, so the scratch record does not trip either.
- **Two commits, not one.** The decision record is `docs(ci): record the consolidation decision`. A merge, if approved, is a separate `ci(workflows): merge the always-run freshness guards`, so a failed probe names the commit that caused it and a revert restores the deleted files without touching the record.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | The twin-filter gate over the whole tree | `bash .github/scripts/check-gate-inputs.sh` (expected `RESULT: PASSED`, `failures=0`) |
| Static | Every workflow file parses | `python3 -c "import yaml,glob; [yaml.safe_load(open(f)) for f in glob.glob('.github/workflows/*.yml')]"` |
| Unit | The cost arithmetic: seconds, `ceil(seconds / 60)`, the 13-job sum, the 11-checkout subtraction for the 12-job FRESHNESS set, the per-day scaling | `node scratch/consolidation-cost.mjs --check` (expected exit 0) |
| Integration | The default path leaves the workflow tree unchanged | `git diff --stat "$(cat scratch/phase-start-sha.txt)"..HEAD -- .github/workflows` (expected empty) |
| Integration | The merged job runs every step after a failure | One test branch with a forced failure; `gh run view <id> --json jobs --jq '.jobs[] | {name, conclusion, steps: [.steps[] | {name, conclusion}]}'` |
| Manual | The post-007 snapshot and the re-measure | `gh run list --limit 1000 --json ...` and `gh run view <id> --json jobs` |
| Manual | The decision record's numbers reproduce | `node scratch/consolidation-cost.mjs --check` against the saved JSON |
| Docs | The packet validates | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `002-rebuild-fanout-removal` baseline | Internal | Pending | No post-R1 before number; the phase stays `[B]` |
| `003-trigger-and-job-hygiene` | Internal | Pending | R4, R6 and R8 have not moved the nine's volume or shape |
| `004-setup-caching-provisioning` | Internal | Pending | R14 and R15 have not landed; R27 names them, and the tree is not final |
| `005-slow-and-failing-tests` | Internal | Pending | The suite shapes are not final; the snapshot would be taken on a moving tree |
| `006-sk-code-ci-surface` | Internal | Pending | The merge has no recorded rule set to satisfy |
| `007-workflow-hygiene-on-off-control` | Internal | Pending | The switch groups, timeouts and permissions the merge reads do not exist |
| Operator decision D8 | Internal | Yellow until answered | No merge may start; the default is no merge |
| `gh` with `repo` and `actions` scopes | External | Green | No run list, no job samples, no decision record |
| A test branch or fork | Internal | Green | No merge probe; the decision record still closes |
| `009-doctor-ci-review-wiring` | Internal | Blocked on this phase | Its report reads the workflow count and switch state this phase can change |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The decision record's numbers do not reproduce from the saved JSON, a merge loses a check signal or a step does not run after a failure, or `check-gate-inputs.sh` fails.
- **Procedure**: The decision record and the cost artifacts are documents; delete or correct the record and re-run the script. A merge reverts as one commit: `git revert <merge-commit>` restores the deleted workflow files and the README rows. The measurement artifacts stay, because they record what was measured and a revert is visible as a divergence from them. Under the default, there is nothing to revert in `.github/workflows/`.
<!-- /ANCHOR:rollback -->

---




---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
002 baseline ──┐
               ├──► Setup (D8 default, inventory, start SHA) ──► Before table ──┐
003-007 ───────┘                                                               ├──► Cost table ──► Decision record ──► D8
               └──► After snapshot (24 h) ────────────────────────────────────┘                                       │
                                                                                    no ◄──────────────────────────────┴──► yes
                                                                                     │                                       │
                                                                                     └──► Verify gates ◄── Merge + probe ────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 002 to 007 | Before table, after snapshot |
| Measurement | Setup | Cost table |
| Decision | Measurement, D8 | Merge, verification |
| Merge (conditional) | Decision with D8 = yes | Verification |
| Verify | Decision (no) or Merge (yes) | 009 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Measurement | Medium | 2-4 hours |
| Decision | Low | 1-2 hours |
| Merge (only on D8 = yes) | High | 4-8 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **5-10 hours without a merge; 9-18 hours with one** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The 002 baseline and the post-007 snapshot are saved under `scratch/`
- [ ] D8's answer is recorded before any merge task runs
- [ ] A test branch exists for the merge probe
- [ ] `node scratch/consolidation-cost.mjs --check` exits 0 before the decision is written

### Rollback Procedure
1. Correct or delete the decision record; no workflow is involved under the default.
2. For a merge, revert the merge commit, which restores the deleted workflow files and the README rows.
3. Re-run `bash .github/scripts/check-gate-inputs.sh` and the YAML parse to confirm the restored tree.
4. Record the revert and the reason in the decision record so the next measurement starts from the restored shape.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The phase writes documents and, only on approval, workflow files under version control.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
 002 baseline ──┐
 003 to 007 ────┤
                ▼
        ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
        │    Setup      │────►│  Measurement  │────►│   Decision    │
        │  T001-T003    │     │  T004-T010    │     │     T011      │
        └───────────────┘     └───────────────┘     └───────┬───────┘
                                                            │
                                                     D8 (operator, T012)
                                                            │
                                    ┌───────────────────────┴───────────────────────┐
                                    ▼                                               ▼
                            ┌───────────────┐                               ┌───────────────┐
                            │   No merge    │                               │     Merge     │
                            │     T014      │                               │  T015-T020    │
                            └───────┬───────┘                               └───────┬───────┘
                                    └───────────────────┬───────────────────────────┘
                                                        ▼
                                                ┌───────────────┐
                                                │    Verify     │
                                                │  T021-T025    │
                                                └───────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase start SHA (T001) | None | `scratch/phase-start-sha.txt` | T014's empty-diff proof, T022's and T023's commits |
| Dependency check and inventory (T002) | 002 to 007 landed | `scratch/pre-merge-inventory.md`, 9 workflows and 13 jobs | T003, every measurement task |
| Before table (T003) | T002, the 001 summary, the 002 baseline | `scratch/consolidation-baseline.md` | T011's Measurements section |
| Snapshot (T004 to T007) | T002, `gh` with `repo` and `actions` | `scratch/runs-after.json`, `scratch/jobs/`, `scratch/window.json`, `scratch/snapshot-window.md` | T008 to T010 |
| Cost table (T008 to T010) | T003, the snapshot | `scratch/consolidation-cost.mjs`, `.json`, `.md` | T011 |
| Decision record (T011, T013) | T003, T010 | `scratch/consolidation-decision.md` | T012, T022, T024 |
| D8 answer (T012) | T011 | `scratch/d8-answer.md` | T014 (no), T015 to T020 (yes) |
| No-merge proof (T014) | T001, D8 = no | `scratch/no-merge.md` | T024's AC-006 row |
| Merge (T015 to T020) | D8 = yes, the tree | `.github/workflows/always-run-guards.yml`, eight deletions, three README edits, `scratch/merge-probe.md` | T023, T024's AC-007 and AC-009 rows |
| Verification (T021 to T025) | T014 or T020 | `scratch/phase-result.md`, the closed criteria | `009-doctor-ci-review-wiring` |
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **T002 - confirm the dependency phases and record the post-007 inventory** - 1 hour - CRITICAL, because every workflow count, job count and step name below it is provisional until phase 007's switches and timeouts are in the tree.
2. **T004 to T007 - the post-007 snapshot** - 2 hours, plus the 24 h wait for the window to fill - CRITICAL, because no after number exists until the run list, the 40-run index and the job JSON are saved.
3. **T008 to T010 - the cost script and its check** - 2 hours - CRITICAL, because the decision record quotes only numbers the script reproduces.
4. **T011 - the decision record's six written sections** - 1 hour - CRITICAL, because D8 cannot be put to the operator before the recommendation exists.
5. **T012 - D8** - operator latency, no upper bound - CRITICAL, because the merge tasks are barred until it is answered and the phase cannot close without the answer.
6. **T015 to T020 - the merge and its probe, only on D8 = yes** - 6 hours - CRITICAL on the yes path, because a merge without a passing probe has no evidence that the later steps still run.
7. **T021 to T025 - the gates, the commits and the criteria** - 1 hour - CRITICAL, because a green gate is the only closure evidence.

**Total Critical Path**: 7 hours plus the 24 h window and operator latency on D8; 13 hours on the D8 = yes path.

**Parallel Opportunities**:
- T003 (the before table) can run beside T004 to T007 (the snapshot), because it reads the 001 summary and the 002 baseline rather than the new data.
- T008 (the cost script) can be written and `node --check`ed while T006 is still fetching job JSON, as long as T009 runs after T007.
- T022 (the decision-record commit) can run as soon as T013 is written, in parallel with T014's no-merge proof.
- T017 to T019 (the three README edits) can run in any order once T016 has deleted the member files, because each edits a different table.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup recorded | T001 to T003 done; `scratch/phase-start-sha.txt` holds one 40-character SHA, `scratch/pre-merge-inventory.md` names 9 workflows and 13 jobs, and `scratch/consolidation-baseline.md` holds 26 table lines with the 1,065 s and 25 min totals | Phase 1 exit |
| M2 | Measured | T004 to T010 done; `scratch/window.json` names 9 workflows, `scratch/jobs/` holds 9 directories, and `node scratch/consolidation-cost.mjs --check` exits 0 | Phase 2 exit |
| M3 | Decision written | T011 done; `scratch/consolidation-decision.md` carries five of the six sections and the line `D8: pending` | Phase 3 exit |
| M4 | D8 answered | T012 and T013 done; `scratch/d8-answer.md` holds one `D8=` line and the decision record holds the same answer | Phase 4 exit |
| M5 | Closed | T014 to T025 done; under D8 = no the workflow diff is empty, under D8 = yes one job carries every step and the probe records a later step running after a failure, and `check-gate-inputs.sh`, the YAML parse and `validate.sh --strict` all print `RESULT: PASSED` | Phase 5 exit |
<!-- /ANCHOR:milestones -->

## L3: ARCHITECTURE DECISION RECORD

The formal records, with context, constraints, alternatives, five checks and the tasks each choice gates, are `decision-record.md` ADR-001 to ADR-006. This table is the one-screen index.

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | No always-run workflow is merged without an operator yes; the default is no merge | R27 calls the risk high and the per-check signal loss real, and the saving is an upper bound built on a volume R1 removes |
| ADR-002 | The candidate set is the eight always-run FRESHNESS workflows, 12 jobs; `message-contract.yml` is excluded | One job answering two switch variables would let one group's switch govern the other group's checks, and message-contract's context is required |
| ADR-003 | Measurement is job-level seconds, `ceil(seconds / 60)` per job, scaled by `24 / 23.5` | Billing and `timeout-minutes` see job execution; a run's wall clock includes queueing and would overstate every figure |
| ADR-004 | A merge is one workflow, one job, the trigger union with the schedule, steps ordered by Node major, `fetch-depth: 0` and `if: always()` on every step after the checkout | One checkout is the whole saving, and a member needs full history and a daily schedule that a shallow, unscheduled merge would silently drop |
| ADR-005 | This phase keeps two decision documents: `decision-record.md` for design choices, `scratch/consolidation-decision.md` for the measured decision | R27 asks for a record carrying before and after numbers; the ADR file asks for frozen choices. Merging them would put measurements inside a document that must not change after approval |
| ADR-006 | D8 = yes is the second named confirmation that a protected workflow may be edited | `dispatch-enforcement-guard.yml` and `gate-inputs.yml` are protected by function, and the research's safety rule requires a named confirmation before either is edited |

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read `tasks.md` and confirm the task id, its file, its quoted anchor and its line number.
- [ ] Re-read the file the task edits; confirm the quoted anchor is still on the named line and belongs to the workflow or table the task names.
- [ ] Confirm the task is not `[B]`; if it is, record the blocker in `scratch/phase-result.md` and stop before editing.
- [ ] Confirm every number the task writes comes from `scratch/consolidation-cost.json` or `scratch/consolidation-baseline.md`, never from this plan and never from a sibling phase.

### Execution Rules
| Rule | Description |
|------|-------------|
| TASK-SEQ | Run T001 to T025 in order. T002 is the only `[B]` task, and its blocker is another phase. T014 and T015 to T020 are mutually exclusive, selected by D8's answer. |
| TASK-SCOPE | Write only `.github/workflows/always-run-guards.yml`, the eight named member workflow files, `.github/workflows/README.md` and this phase's `scratch/`. Every other path is read-only. |
| TASK-PROOF | Run the task's check and read both its output and its exit status before marking the task `[x]`. |
| TASK-ANCHOR | Locate the quoted text. A moved line is not a changed edit; an absent anchor is a stop, not a nearby edit. |
| TASK-COMMENT | No workflow comment, step name, job name or README sentence added by this phase carries an R-id, a D-id or a phase number. |
| TASK-GATE | No merge task runs before `scratch/d8-answer.md` exists and holds `D8=yes`. |

### Status Reporting Format
After each task: `Task T### complete. Files: <paths>. Proof: <command> -> <observed output/exit>.` At a phase boundary, report the task range, the files changed and the gate that passed.

### Blocked Task Protocol
If a task cannot run, stop and record the blocker in `scratch/phase-result.md` with the task id, the command that failed and its output. Do not substitute a different file, a different number or a different command. A `[B]` task stays blocked until its dependency's proof exists; a failed gate is repaired, not waived.
