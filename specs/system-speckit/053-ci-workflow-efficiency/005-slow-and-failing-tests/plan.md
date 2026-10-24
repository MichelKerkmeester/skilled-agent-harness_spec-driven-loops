---
title: "Implementation Plan: Phase 5: slow-and-failing-tests"
description: "Probe the spec-kit CLI vitest project three times with file parallelism, flip the cli project when the probe is green or shard it when a fixture collides, then re-pull the latest 40 runs of deep-loop-runtime, diagram-corpus and skill-advisor-stress, fix what is still real without a retry, and record the five single old failures closed."
trigger_phrases:
  - "slow and failing tests plan"
  - "phase 5 slow and failing tests plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: slow-and-failing-tests

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Vitest 4.1.11, GitHub Actions YAML, bash |
| **Framework** | Vitest projects (`--project cli` and `--project root`), the `Spec-Kit Check` workflow, the spec-kit CLI suite |
| **Storage** | None. The run data is read through `gh`; the probe logs and the re-check table are plain files under `scratch/` |
| **Testing** | `npx vitest run --config ../../vitest.config.ts --project cli`, the same project through a probe config, `npm run test:stress`, `node scripts/check-diagram-corpus.cjs`, `node scripts/check-contract-drift.cjs`, `gh run list` and `gh run view` |

### Overview
Prove file parallelism safe with three local runs of the `cli` project, then set `fileParallelism: true` at `vitest.config.ts:67` with a comment that states why the files are independent. If any probe run collides on a fixture, leave the config serial and run two `--shard` halves inside the existing `CLI vitest project` step. Then re-pull the latest 40 runs of the three workflows that carry real failures, fix only what the re-check still shows, add a fast-fail drift check to the deep-loop job, and record the five single old failures closed. No retry is added anywhere.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented [EVIDENCE: spec.md Executive Summary and section 3 read 2026-10-25]
- [x] Success criteria measurable [EVIDENCE: spec.md SC-001 to SC-005 each name a number or a count, and every AC row carries a runnable check, read 2026-10-25]
- [x] Dependencies identified (`gh` scopes, a checkout with the spec-kit, deep-loop and advisor dependencies installed; no operator decision) [EVIDENCE: `gh run list` and `gh run view` read the runs on 2026-10-25 from this checkout]

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The probe recorded, the config flip or the shard applied, and the CLI step under 400 s with 5 green CI runs
  - The 400 s ceiling is judged on the median of five green runs on main, by the operator ruling of 2026-10-24 on AC-003, recorded in `decision-record.md` (ADR-003 amendment) and measured in `scratch/r20-ci-step.md`.
- [ ] Each of the three workflows at 10 green runs or a filed root cause, and the five stale failures recorded closed
- [ ] `check-gate-inputs.sh` and `validate.sh --strict` both `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Probe-gated config change with a conditional workflow fallback, plus a re-check-first failure triage that never retries.

### Key Components
- **CLI vitest project** (`.skilled/skills/system-spec-kit/vitest.config.ts:56-72`): the `cli` project, rooted at `runtime/cli`, including `tests/**/*.vitest.ts` at `:59-61`, with `fileParallelism: false` at `:67`. 183 files are collected today.
- **Root vitest project** (`vitest.config.ts:26-55`): the `root` project, which also sets `fileParallelism: false` at `:50` and stays serial because its suites share mutable state (`.skilled/skills/system-spec-kit/runtime/vitest.config.ts:36-38`).
- **Check job** (`.github/workflows/spec-kit-check.yml:65-144`): the single job that runs the CLI project at `:124-128`; its `CLI vitest project` step is 791 s of the job's 1,215 s in run `39909844384`.
- **Run data** (`gh run list --workflow ... --limit 40`, `gh run view <id> --log-failed`): the only source for the re-check, the stale confirmations and the green streaks.
- **Deep-loop drift checker** (`.skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs`): checks the three compiled contracts against their sources and exits 2 on `STALE_SOURCE_DIGEST`; the fast-fail step runs it before the 12-minute suite.
- **Diagram corpus checker** (`.skilled/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs`): prints `RESULT: PASSED` or names the metadata family failure, including the version-versus-anchor-era class at `scripts/families/metadata.cjs:47`.
- **Advisor stress suite** (`.skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts`): the plugin-bridge suite whose `default is not a function` failure was the sampled cause.

### Data Flow
The probe copies the real config into the same directory with one setting flipped, runs the `cli` project three times, and is deleted before the real config is touched. The real config then either flips one line or leaves it serial while the workflow runs two shards. In parallel, the re-check pulls 40 runs per workflow, reads the failed logs for every non-success row, and turns each into either a fix or a recorded root cause. CI supplies the final numbers: the step seconds from `gh run view --json jobs` and the green streak from `gh run list`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `vitest.config.ts:67` | Producer of the `cli` project's `fileParallelism` | update: `false` becomes `true` with a stated reason | `grep -n -B3 'fileParallelism' .skilled/skills/system-spec-kit/vitest.config.ts` shows `true` at the cli project and `false` at the root project |
| `vitest.config.ts:14-17` | Comment claiming both projects share the parallelism setting | update: say the timeouts are shared and only the CLI project runs in parallel | `sed -n '10,22p' .skilled/skills/system-spec-kit/vitest.config.ts` |
| `vitest.config.ts:50` | Producer of the root project's setting | unchanged: the root project stays serial | `grep -c 'fileParallelism: false' .skilled/skills/system-spec-kit/vitest.config.ts` returns 1 |
| `spec-kit-check.yml:124-128` | Consumer of the project, the step the saving is measured on | update only if R19 collides: two `--shard` halves with both statuses propagated | `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/spec-kit-check.yml'))"` exits 0 and `grep -c -- '--shard=' .github/workflows/spec-kit-check.yml` returns 2 |
| `deep-loop-runtime.yml:51-60` | Consumer of the compiled contracts, through the suite | update: a `check-contract-drift.cjs` step after the install and before the suite, because 13 of the latest 40 runs carry `STALE_SOURCE_DIGEST` | `grep -n 'check-contract-drift' .github/workflows/deep-loop-runtime.yml` returns one line, below the install step and above the suite step |
| `check-contract-drift.cjs` | Producer of the drift verdict | unchanged; reused as the fast-fail | `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` prints `OK commands=3` and exits 0 on a fresh tree |
| `diagram-corpus.yml:35-61` + `check-diagram-corpus.cjs` | Producer of the corpus verdict | unchanged unless the latest run fails | `cd .skilled/skills/sk-design/sk-design-diagram && node scripts/check-diagram-corpus.cjs` prints `RESULT: PASSED` |
| `skill-advisor-stress.yml:64-66` + the stress suite | Producer of the stress verdict | unchanged unless the latest run fails | `npm run test:stress -- --config vitest.stress.config.ts` exits 0 from the advisor runtime |
| `.github/workflows/README.md:32,34,41,46,47,54,56,57` | Documentation consumer of the workflow rows | unchanged: no check name, trigger or job count changes | `git diff --stat .github/workflows/README.md` returns nothing |

Required inventories:
- Same-class producers: `rg -n 'fileParallelism' .skilled/skills --glob 'vitest.config.ts'` returns 5 sites in 4 files, because `.opencode/skills` is a symlink to `../.skilled/skills`: `system-spec-kit/vitest.config.ts:50,67`, `system-spec-kit/runtime/vitest.config.ts:38`, `system-skill-advisor/runtime/vitest.config.ts:39` and `system-deep-loop/runtime/vitest.config.ts:20`. Only the `:67` site changes; the other four stay serial.
- Consumers of changed symbols: `rg -n 'fileParallelism|--project cli|CLI vitest project' .github .skilled --glob '!**/node_modules/**'` finds the config sites, the `spec-kit-check.yml:124-128` step, the CLI package's `test` script and the research citations. No other consumer reads the setting.
- Matrix axes: project (`root`, `cli`) x `fileParallelism` (`false`, `true`) x mode (`none`, `shard=1/2`, `shard=2/2`). Required rows: root+false (unchanged), cli+false serial baseline, cli+true probe three times, cli+shard=1/2, cli+shard=2/2. The two shard rows exist only when the probe collides.
- Algorithm invariant: every collected test file runs exactly once in the selected mode, and the step fails if any file fails. Adversarial cases: a file that writes a fixed path under the repo, a file that binds a fixed port, a file that reuses a fixed SQLite file, a file that reads another test's temp directory. The probe's log text is the detector; the shard is the fallback.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Implementation Notes

- **R19 gates R20.** The probe runs first and the real config is not touched until it finishes. The probe config is a copy in the same directory, so `__dirname` resolves identically; it differs from the real file only at the `cli` project's `fileParallelism` line, and it is deleted before the real edit.
- **Path A is expected.** Three green probe runs choose the config flip. The stated reason in the config is behavioural: the suites that write build their own fixture roots, and serial execution made the project the check job's longest step.
- **Path B is the fallback.** If any probe run collides, the config stays `false` and `spec-kit-check.yml:124-128` runs two shards. The exact block is in T013, with `status=0`, two `wait ... || status=1` lines and `exit "$status"` so a failure in either half fails the step. `set -e` is deliberately absent, because it would abort before the second `wait`.
- **R21 re-checks first.** The current sample, read on 2026-10-23, has deep-loop-runtime 13 failures in 40, diagram-corpus 12 and skill-advisor-stress 10, while the newest 3, 1 and 3 runs respectively are green. The phase records that state before it fixes anything; it does not assume the research phase's counts are still current.
- **The deep-loop fix is two parts.** Run `check-contract-drift.cjs` first: when it exits 2, regenerate every contract the log names with `compile-command-contracts.cjs --command <id> --write`; when it exits 0, the tree is already fresh and only the second part lands. Then put `check-contract-drift.cjs` before the suite so the same fact fails in seconds rather than after about 12 minutes. The existing `check-contract-drift.vitest.ts` keeps the assertion; no retry is added.
- **No ephemeral ids in code.** No R-id, D-id, phase number or spec path goes into a config comment, a test name, a workflow step name or a commit message. The ids live in these spec documents only.
- **No operator decision gates this phase.** The review lists none for R19 to R21; the only choices are technical and are decided by the probe and the re-check.
- **The numbers.** 791 s is the `CLI vitest project` step in run `39909844384`; the project collects 183 files; R20 is ~460 runner-min/day standalone, ~138 after R1, plus about 525 s of wall on the slowest job; R19 and R21 save 0 runner-minutes.
- **This worktree is partly provisioned.** `.skilled/skills/system-spec-kit/node_modules` holds vitest 4.1.11 and `runtime/dist` and `shared/dist` exist, but `runtime/cli/dist` is absent and `.skilled/node_modules`, the deep-loop runtime and the advisor runtime are not installed. Every vitest, drift-check and stress task therefore runs after T002's build and install; the probe cannot start before it.
- **Line anchors can move under parallel phases.** `003-trigger-and-job-hygiene` adds a concurrency block above `jobs:` in `spec-kit-check.yml` and `deep-loop-runtime.yml`, and `004-setup-caching-provisioning` edits the install steps; either shifts every line below by a few. The tasks name the step (`CLI vitest project`, `Install the deep-loop runtime and the shared package it links`, `Run the deep-loop runtime suites`) as well as the current line, so re-read the file and locate the step before editing. A stale line is not a stale change.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The `cli` project serial baseline and three parallel probe runs, each collecting the same 183 files | `npx vitest run --config ../../vitest.config.ts --project cli` and `--config ../../vitest.config.parallel-probe.ts` from `.skilled/skills/system-spec-kit/runtime/cli` |
| Unit | The two shard halves, run sequentially, when R19 collides | `npx vitest run --config ../../vitest.config.ts --project cli --shard=1/2` then `--shard=2/2` |
| Integration | The `Spec-Kit Check` workflow after the change: step seconds and 5 green runs | `gh run list --workflow spec-kit-check.yml`, `gh run view <id> --json jobs` |
| Negative | A stale compiled contract must fail the fast-fail step before the suite | Copy the current contract aside, write the `b1f6c78` version over it, run `check-contract-drift.cjs`, restore, rerun |
| Manual | The three workflows' 40-run re-check and the 10-run green streak | `gh run list --limit 40`, `gh run view --log-failed`, `gh workflow run diagram-corpus.yml` |
| Manual | The five stale failures, each with a later green run | `gh run list --workflow <name> --limit 100 --json conclusion,createdAt,headSha` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `002-rebuild-fanout-removal` baseline | Internal | Yellow until phase 002 lands | The after-R1 ~138 runner-min/day figure is unanchored; the standalone ~460 and the CI acceptance still hold |
| `gh` with `repo` and `actions` scopes | External | Green | No re-check, no failed logs and no green streak; the phase cannot close |
| A checkout with `.skilled/skills/system-spec-kit`, `.skilled/skills/system-deep-loop` and `.skilled/skills/system-skill-advisor` installed | Internal | Yellow in this worktree (no build) | The probe, the stress suite and the drift checker cannot run locally; T002 provisions them |
| `007-workflow-hygiene-on-off-control` | Internal | Pending | It sizes R24's timeouts after this phase's final job shapes; a late deep-loop step change forces a re-measure |
| `003-trigger-and-job-hygiene`, `004-setup-caching-provisioning` | Internal | Parallel | None in substance; 003 adds a concurrency block above `jobs:` in `spec-kit-check.yml` and `deep-loop-runtime.yml` and 004 edits their install steps, which shifts the line anchors this phase cites but not the steps it edits |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The parallel project collides on a fixture, the CI step does not fall under 400 s, or the fast-fail drift step fails a fresh tree.
- **Procedure**: Revert the single commit that carries the config line and its comment, or the commit that carries the shard step. If the fast-fail step false-fails, delete the one step from `deep-loop-runtime.yml`. The R21 test or script fixes are independent and stay. No state, cache or data is created, so the revert is the whole rollback.
<!-- /ANCHOR:rollback -->



---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (install, serial baseline, R19 probe) ──► Change (R20 config or shard) ──► Re-check (R21 fixes and stale table) ──► Verify (step seconds, 5 and 10 green runs)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `002-rebuild-fanout-removal` baseline for the after-R1 figure; no operator decision | Change |
| Change | Setup's R19 decision | Re-check, Verify |
| Re-check | The current 40-run samples; no other phase | Verify |
| Verify | Change, Re-check, and real CI traffic for the green streaks | `007-workflow-hygiene-on-off-control` |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | ~1.5 hours: install, one serial baseline (~13 minutes) and three parallel probes (~8-13 minutes each) |
| Change | Low | ~30 minutes: one config line and comment, or one workflow step |
| Re-check | Med | ~1 hour: 40 runs per workflow, failed-log reads, the five stale confirmations, and any test fix |
| Verify | Med | 5 green `Spec-Kit Check` runs, then 10 green runs per workflow, which depends on repository traffic |
| **Total** | | **~3-4 hours of work across several days of CI observation** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not applicable, no data changes [EVIDENCE: n/a because the two commits change only workflow YAML]
- [x] Feature flag configured - not applicable; the one `fileParallelism` line is the switch [EVIDENCE: n/a because the shard branch left `vitest.config.ts` unmodified and the split sits in the workflow step]
- [x] Monitoring alerts set - the CI step seconds and the 5-run green streak are the monitoring [EVIDENCE: n/a because no alert exists; `scratch/r20-ci-step.md` records the step seconds per run, four of five read on 2026-10-25]

### Rollback Procedure
1. Revert the config commit, or the shard-step commit, on `main`.
2. Confirm the `CLI vitest project` step returns to its serial duration and the `Spec-Kit Check` workflow is green.
3. If the fast-fail drift step is the problem, delete that step and confirm `deep-loop-runtime` runs the suite as before.
4. No stakeholder notice is needed; nothing user-facing changed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The probe logs and the re-check table stay as a record of what was measured; a revert is visible as a divergence from them.
<!-- /ANCHOR:enhanced-rollback -->

---


<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
002 baseline (or the 001 dataset as provisional) ──► T001, T002
                                                          │
                                                          ▼
┌────────────────────────────────────────────────────────────────────┐
│ R19 probe. Serial order inside this block.                          │
│ T003 header ──► T004 serial ──► T005 probe config ──► T006-T008     │
│ three parallel runs ──► T009 delete the probe config ──► T010 outcome│
└───────────────────────────────┬────────────────────────────────────┘
                                ▼
                    outcome: parallel ──► T011, T012 (config)
                    outcome: shard ────► T013, T014 (workflow step)
                                │
                                ▼
┌────────────────────────────────────────────────────────────────────┐
│ R21 re-check. T015-T017 pull the runs, T018 builds the tables,       │
│ T019-T021 read the failed logs and write the root causes.            │
└───────────────────────────────┬────────────────────────────────────┘
                                ▼
┌────────────────────────────────────────────────────────────────────┐
│ R21 fixes. T023-T026 deep-loop drift and fast-fail; T027 diagram;    │
│ T028 advisor; T029 stale; T030 no retry; T031 gates.                 │
└───────────────────────────────┬────────────────────────────────────┘
                                ▼
┌────────────────────────────────────────────────────────────────────┐
│ T032 commit R20 ──► T033 commit R21 (when it changed) ──► T034-T037  │
│ CI measurements and streaks ──► T038 AC rows ──► T039 ──► T040 closure               │
└────────────────────────────────────────────────────────────────────┘
```

The R19 block is strictly serial: the real config is not touched until the probe config is deleted, so no run can pick up a half-flipped tree. The R21 re-check runs beside the probe, because it reads only `gh` data and writes only `scratch/`, so it can start while the probe runs. The R21 fixes wait for the re-check, and the commits wait for both, because one commit per concern is easier to revert than a mixed one.

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline rows (T001, T002) | `002-rebuild-fanout-removal` and its `scratch/baseline-24h/summary.md`, or the 001 dataset when that file is absent | `scratch/r20-ci-step.md` with the reference row, and a provisioned tree | T004, T023, T024, T026, T027, T028 |
| R19 probe (T003 to T010) | T002 | `scratch/r19-probe.md` with one serial row, three parallel rows and one outcome token | T011, T013 |
| R20 config flip (T011, T012) | T010 records `outcome: parallel` | `fileParallelism: true` at `vitest.config.ts:67`, a rewritten comment, the root project still serial | T031, T033 |
| R20 shard fallback (T013, T014) | T010 records `outcome: shard` | Two `--shard` halves inside the existing step, both statuses propagated | T031, T033 |
| Run pull (T015 to T018) | `gh` with `repo` | Three JSON files and `scratch/r21-recheck.md` with three run tables and three summary rows | T019 to T021 |
| Failed-log read (T019 to T021) | T018 | Three failure extracts and a root-cause row per distinct class | T022 to T028 |
| Deep-loop drift fix (T023 to T026) | T002, T021 | A fresh contract when the checker exits 2, a fast-fail step before the suite, a proven negative | T030, T033 |
| Diagram and advisor fixes (T027, T028) | T002, T021 | The newest run recorded closed, or one corrected version or module-shape line | T033 |
| Stale confirmations (T029) | `gh` | Five rows with date, SHA, later green run and `closed` | T039 |
| No-retry proof (T030) | T023 to T029 | An empty grep over the three workflows and the unstaged diff of the workflow files | T033 |
| Gates and commits (T031 to T033) | Every edit above | `RESULT: PASSED`, a clean YAML parse, two validated commit messages, no ephemeral id in the diff | T034 to T040 |
| CI measurement and streaks (T034 to T037) | T032, real CI traffic | The post-change step seconds, 5 green `Spec-Kit Check` runs, 10 green runs per workflow or a filed row | T038 to T040 |
| Closure (T038 to T040) | Every task above | Every acceptance row `Met`, `validate.sh --strict` `RESULT: PASSED`, one closure commit | `007-workflow-hygiene-on-off-control` |
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **T001 and T002, the baseline row and the provisioned tree** - ~20 minutes plus one install and build - CRITICAL
2. **T003 to T005, the probe header, the serial baseline and the probe config** - ~15 minutes of edits plus one ~13-minute serial run - CRITICAL
3. **T006 to T008, the three parallel probes** - three runs of about 4 to 13 minutes each - CRITICAL
4. **T009 and T010, the deleted probe config and the recorded outcome** - ~5 minutes - CRITICAL
5. **T011 and T012, the config flip and its proof** - ~10 minutes - CRITICAL
6. **T013 and T014, the shard fallback** - ~20 minutes plus two local halves, and they replace step 5 rather than follow it - CRITICAL
7. **T015 to T021, the run pull and the root causes** - ~1 hour, and it can start beside step 2 - CRITICAL
8. **T023 to T028, the drift fix, the fast-fail step and the two conditional fixes** - ~45 minutes plus one negative proof - CRITICAL
9. **T029 and T030, the five stale confirmations and the no-retry proof** - ~20 minutes - CRITICAL
10. **T031 to T033, the gates and the two commits** - ~30 minutes - CRITICAL
11. **T034 to T037, the CI measurement and the green streaks** - one `Spec-Kit Check` run plus 5, then 10 runs per workflow, which is days of wall clock at this repository's traffic - CRITICAL
12. **T038 to T040, the acceptance rows, the packet validation and the closure commit** - ~20 minutes - CRITICAL

**Total Critical Path**: ~3.5 to 4 hours of hands-on work inside a wall-clock window of two to ten days, set by the serial and probe runs, the 5-run `Spec-Kit Check` streak, and the 10-run streaks on three path-filtered workflows.

**Parallel Opportunities**:
- T015 to T021 read only `gh` data and write only `scratch/`, so the whole R21 re-check can run while the probe runs.
- T023 to T026 and T027 and T028 touch different files, so the deep-loop work and the two conditional fixes can run in any order.
- T028 and T029 read `gh` and the diff, so they can run as soon as T027 is done.
- T033 and T034 both read the same post-change run, and T035 to T037 each watch a different workflow, so the three streaks are observed in parallel.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | The before-state is recorded and the tree is provisioned | `scratch/r20-ci-step.md` carries the reference row with `791`; `npx vitest --version` prints `4.1.11`; `test -d .skilled/skills/system-spec-kit/runtime/cli/dist` exits `0` | After T001 and T002 |
| M2 | The probe has run and its outcome is recorded | `scratch/r19-probe.md` holds one serial row, three parallel rows, each with an exit code and a duration, and exactly one `outcome:` line; the probe config is gone | After T003 to T010 |
| M3 | One of the two R20 paths is on disk and proven | `grep -c 'fileParallelism: true'` returns `1` and `fileParallelism: false` returns `1`, or `grep -c -- '--shard='` returns `2` with both waits present | After T011 and T012, or T013 and T014 |
| M4 | The re-check names every live cause | `scratch/r21-recheck.md` holds three run tables, three summary rows and a root-cause row per distinct class, each naming the test, the error class and the first failing SHA | After T015 to T021 |
| M5 | The fixes and the stale confirmations are recorded | `check-contract-drift.cjs` exits `0` and the fast-fail step is above the suite; the five stale rows end in `closed`; the no-retry greps print nothing | After T023 to T030 |
| M6 | The gates pass and the change is committed | `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`; every workflow parses; two commit messages validate; the ephemeral-id grep prints nothing | After T031 to T033 |
| M7 | The CI numbers and streaks are recorded, and the packet closes | The `CLI vitest project` step is under `400` s; 5 `Spec-Kit Check` runs are green; each workflow has 10 green runs or a `filed` row; every AC row is `Met`; `validate.sh --strict` prints `RESULT: PASSED`; the closure commit is clean | After T034 to T040 |
<!-- /ANCHOR:milestones -->

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Probe the setting on a copy, then change the real config

**Status**: Proposed

**Context**: The `cli` project sets `fileParallelism: false` at `vitest.config.ts:67` without a stated reason, and 183 files run one at a time. Turning it on in the real file before measuring would put the repository's slowest step behind an untested assumption.

**Decision**: Copy the real config to `vitest.config.parallel-probe.ts` in the same directory, flip the one `cli` setting, run the project three times, delete the copy, then edit the real file only when all three runs exit 0.

**Consequences**:
- The probe proves the setting against the real suite before the shared config changes.
- A failed probe leaves the real config untouched, and the fallback is one workflow step.
- The copy lives beside the original so `__dirname` resolves identically; it is deleted before the real edit, so no untracked config survives.

**Alternatives Rejected**:
- Flip the real config and revert on failure: a red `main` between the two commits, and the slowest step is exactly where a red run is most expensive.
- Run a subset of files: it would miss the fixture collision the probe exists to find.

The formal records, including every design choice this plan freezes, are `decision-record.md` ADR-001 to ADR-010.

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation

T001 to T014. The baseline row, the provisioned tree, the serial run, the probe config, the three parallel runs, the recorded outcome, and the one R20 path that outcome selects. Nothing here may be reordered: T002 gates every vitest task, T003 to T009 produce the only evidence the outcome may rest on, and T010 must record the outcome before T011 or T013 runs.

### Tier 2: Parallel Execution

T015 to T029. The R21 re-check, the deep-loop drift fix and fast-fail step, the two conditional fixes, the five stale confirmations and the no-retry proof. T015 to T018 may start beside T003. T023 to T028 touch disjoint files and may run in any order.

### Tier 3: Integration

T031 to T040. The gates, the two commits, the CI measurement, the 5- and 10-run streaks, the acceptance rows, the packet validation and the closure commit. Every task here reads the result of Tier 2, and T038 to T040 wait for the streaks.

### Pre-Task Checklist

Before every task, confirm all five:
- [ ] The file named in the task exists at that path, and the quoted anchor text is on it.
- [ ] The line number in the task matches the anchor's current line. A mismatch means an earlier task or a parallel phase moved it: re-read the file and locate the anchor text before editing.
- [ ] The task's `Check` command has not already been run against a partially edited file.
- [ ] No earlier task's `Rollback` is pending.
- [ ] The task's acceptance-criterion id is recorded, so its evidence lands in `acceptance-criteria.md`.

### Execution Rules

| Rule | Statement |
|------|-----------|
| TASK-SEQ | Run the tasks in numeric order. T015 to T021 may run beside T003 to T010; every other task keeps its position. |
| TASK-SCOPE | Change only the file named in the task, and only the lines the anchor names. A nearby improvement is a separate task and is not in this phase. |
| TASK-ANCHOR | Quote the anchor before editing. If the exact text is absent, stop rather than guessing at a similar line. |
| TASK-COUNT | Run the task's `Check` and compare against `Expected`. A count that differs is a failed task, not a rounding difference. |
| TASK-IDS | Write no R-id, D-id or phase number into a config comment, a test name, a workflow step name or a commit message. |
| TASK-NORETRY | Add no `retry`, `rerun` or `continue-on-error` to any workflow, and rerun no failed run to manufacture a streak. |
| TASK-EVIDENCE | Paste each `Check` output into the matching acceptance row. An unrecorded check is an unmet criterion. |

### Status Reporting Format

Report each task in four lines:

```text
T### <status: done | blocked | rolled-back>
Check: <the command's last line, or the count it printed>
Evidence: <file:line, run id, or scratch path>
Next: <the next task number, or the escalation reason>
```

### Blocked Task Protocol

A task is blocked when its anchor is absent after a re-read, its check fails twice, or a `gh` read is refused. On a block:
1. Do not edit the file. Record the task number, the command and its output in `scratch/r21-recheck.md` or `scratch/r19-probe.md`, whichever the task owns.
2. Run the task's `Rollback` line when the task had already changed the file.
3. Stop the phase. A blocked task is reported, never worked around: the phase's gates assume every earlier edit landed exactly as written.
4. Resume only when the missing file or scope exists, then re-run the blocked task from its `Pre-Task Checklist` entry.
<!-- /ANCHOR:ai-execution -->

---
