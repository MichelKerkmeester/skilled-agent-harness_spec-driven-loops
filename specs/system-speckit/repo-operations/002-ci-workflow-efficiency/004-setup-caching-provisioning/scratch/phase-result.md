## Gate after R12

Command: `bash .github/scripts/check-gate-inputs.sh`

Output:

```text
files=45 inputs_resolved=235 dynamic_inputs=9 twin_pairs=340 failures=0
RESULT: PASSED
```

Command: `bash .github/scripts/tests/check-gate-inputs.test.sh | tail -1`

Output: `check-gate-inputs: 54 passed, 0 failed`

Command: `python3 -c "import yaml,glob; [yaml.safe_load(open(f)) for f in glob.glob('.github/workflows/*.yml')]"`

Output: no output; exit `0`.

---

## R14 cold run

Dispatch: `gh workflow run opencode-plugin-tests.yml --ref main -f cold=true`, then `gh workflow run opencode-dual-version.yml --ref main -f cold=true`. `git merge-base --is-ancestor HEAD origin/main` printed `adoption-on-main`. `hooks-node-tests.yml` has no dispatch trigger.

| Run id | Workflow | Head sha | Conclusion | `provisioning` lines | Provision summary |
|---|---|---|---|---|---|
| 40107101405 | OpenCode Plugin Tests | `0029a3ead5` | success | 11 | `provisioned: 11 installed, 5 built, 3 already present, 0 failed` |
| 40107567830 | OpenCode Dual-Version Battery (3 jobs) | `b0b52243f0` | success | 11 per job | same summary in all three jobs |

The restore and save steps did not run in either dispatch. Raw per-job figures are in `scratch/cache-adoption-runs.md`.

---

## R14 warm run

The first push runs at `0029a3ead5` missed the cache and saved one entry (1121994943 bytes). Two warm sets followed. Per-job figures, restore seconds and logs are in `scratch/cache-adoption-runs.md`.

| Set | Run ids | Conclusion | Restore | Provision summary | Provision step seconds |
|---|---|---|---|---|---|
| Warm A, push at `e00fef3e76` | 40107240022, 40107240008, 40107239943 | all success | hit | `0 installed, 3 built, 14 already present, 0 failed` | 45, 46, 41/46/42 |
| Warm B, attempt 2 at `0029a3ead5` | 40107034084, 40107034118, 40107034090 | all success | hit | `0 installed, 0 built, 14 already present, 0 failed` | 45, 34, 44/36/29 |

The provision step was 56 to 67 s before the action. Warm B saves about 25 s at the median, not 40 s.

Static checks: `grep -c 'uses: ./.github/actions/setup'` printed `1`, `1`, `2` for hooks, plugin and dual-version. `grep -c 'bun@1.3.9'` printed `0` for each. `grep -c "'.github/actions/\*\*'"` printed `2` for each.

Gate: `bash .github/scripts/check-gate-inputs.sh` printed `files=46 inputs_resolved=254 dynamic_inputs=39 twin_pairs=340 failures=0` and `RESULT: PASSED`.

### Round 2 after dropping `~/.npm`

Operator ruling 2026-10-24: drop `~/.npm` from the cached paths, re-run one cold and one warm round, and accept the saving. The change is `a4d92ea8e0`; main was `113d8b56d1` for the miss round and `75ef2608d0` for the dispatches. Per-job figures are in `scratch/cache-adoption-runs.md` under `Round 2`.

| Set | Run ids | Conclusion | Restore | Provision summary | Provision step seconds |
|---|---|---|---|---|---|
| Miss, push at `113d8b56d1` | 40108770493, 40108770392, 40108770355 | all success | not found, one save won | `11 installed, 5 built, 3 already present, 0 failed` | 71, 87, 90/57/66 |
| Cold, `cold=true` at `75ef2608d0` | 40109540094, 40109542114 | all success | skipped | `11 installed, 5 built, 3 already present, 0 failed` | 65, 50/52/50 |
| Warm dispatch, `cold=false` at `75ef2608d0` | 40109118557, 40109120309 | all success | hit | `0 installed, 2 built, 14 already present, 0 failed` | 35, 40/35/34 |
| Warm rerun, attempt 2 at `113d8b56d1` | 40108770493, 40108770392, 40108770355 | all success | hit | `0 installed, 0 built, 14 already present, 0 failed` | 34, 29, 30/30/30 |

The new entry is 864407808 bytes, down from 1121994943. A clean warm hit saves 31 s at the median against the 61 s baseline median (22 to 38 s per job), against 25 s before the trim. AC-006 is met at that figure under the operator ruling.

## R15 merge

The merged workflow `opencode-plugin-tests.yml` ran on the `.hermes`-only probe commit `666844f806` as run 40125544828 and concluded `success`. The same push carried workflow edits to other files, but none of them is under a path the merged workflow listens to apart from `.hermes/**`, so the `.hermes` file is what started it. The probe went to main under the operator ruling of 2026-10-24 (branch pushes would not have started the workflow, whose push trigger lists only `main` and `skilled/**`), and the probe file `.hermes/probe-trigger.txt` is removed by the next commit that touches main.

The job `plugin-and-hook-tests` ran every suite the two earlier workflows ran:

| Suite group | Merged run 40125544828 | Hook run 40113489465 and plugin run 40113489438 before the merge |
|---|---|---|
| Hook `node:test` files collected | 30 | 30 |
| Hook tests, pass, fail | 906, 904, 0 | 906, 904, 0 |
| Hook installer test (`install-hooks.test.sh`) | ran, 2 log lines name it | ran |
| Plugin suites (`.opencode/plugins/tests/*.test.cjs`) tests, pass, fail | 533, 533, 0 | 533, 533, 0 |

The log names only three plugin test files by path because `node --test` prints test names, not file names. The collected counts are the comparable figure, and they match the pre-merge runs. Provisioning ran once, through the shared action, instead of twice.

## Final gates

Run in the worktree at `a60192ef4e`, after every workflow change of the phase, on 2026-10-24.

```text
bash .github/scripts/tests/check-gate-inputs.test.sh | tail -1   ->  check-gate-inputs: 57 passed, 0 failed   (exit 0)
bash .github/scripts/check-gate-inputs.sh                         ->  files=45 inputs_resolved=250 dynamic_inputs=39 twin_pairs=336 failures=0, RESULT: PASSED   (exit 0)
python3 -c "import yaml,glob; ..." over every workflow and action YAML  ->  parsed, no output   (exit 0)
```

Differences from the figures the task expected: the fixture suite reports 57 passed where the task said 54 (the suite grew with the phase's fixtures), and the gate reports `files=45` where the task said 46, because the merge deleted `hooks-node-tests.yml`. `inputs_resolved` 250 is at least 236 and `twin_pairs` 336 is at least 311.

The ephemeral-id search (`\bR[0-9]+\b|\bD[0-9]+\b|[Pp]hase 0[0-9]`) over the `.github` changes of the last eight commits printed nothing.

## Phase delta

Collected 2026-10-25T19:53Z. Every figure below is computed from files on disk with the arithmetic shown.

- **24 h gate:** T070G (`ea39cd7b2c`) reached main in the push whose head is `a60192ef4e`. That push created its runs at 2026-10-24T19:41:04Z (for example run 40126415686 of `OpenCode Plugin Tests`). The after window is 2026-10-24T19:41:04Z to 2026-10-25T19:41:04Z, so it starts after every workflow change of this phase and is exactly 24 h long. The collection ran 12 min after it closed.
- **Before:** `scratch/phase-baseline.md`, the 001 dataset. Its window is 2026-10-22T07:07:25Z to 2026-10-23T06:35:03Z (23.46 h), and its per-day figures are already scaled to 24 h.
- **After:** `scratch/runs-after.json`, the task's `gh run list --limit 1000` output. It holds 1000 runs from 2026-10-24T14:27:26Z on, so the window is covered in full, with 635 runs inside it. `scratch/runs-after-jobs/` holds the `gh run view --json jobs` output of every sampled run.
- **Method, the baseline's own:** runs in window counts every run of the workflow, whatever its event, branch or conclusion. Billed minutes per run are the sum over non-skipped jobs of ceil(job seconds / 60). The per-run figure is the median over the five latest completed runs of any conclusion, here limited to runs created after the window start so no pre-change run enters the sample. The estimate is runs in window times that median. The after window is 24 h, so it needs no scaling.
- **Names:** every touched workflow kept its `name:`. `hooks-node-tests.yml` (`Hook Node Tests`) is deleted by `2759de1119` and has 0 runs in the after window. Its suites run inside `OpenCode Plugin Tests`, so the two count as one row carrying both pre-merge numbers.

Before and after are estimated billed runner-min per 24 h. Delta is after minus before, raw.

| Workflow | Runs, before to after | Median billed min per run, before to after | Before | After | Delta | After sample (run ids) |
|---|---|---|---:|---:|---:|---|
| `opencode-plugin-tests` (merged with `hooks-node-tests`) | hooks 61 and plugin 61, to 27 | hooks 4 and plugin 3, to 4 | 250 + 187 = 437 | 27 x 4 = 108 | -329 | 40227758067, 40223075123, 40222644233, 40221911419, 40221900066 (cancelled, 0 min) |
| `opencode-dual-version` | 7 to 9 | 9 to 8 | 64 | 9 x 8 = 72 | +8 | 40227757964, 40221900031, 40218472506, 40212025338, 40208730244 |
| `spec-kit-check` | 50 to 15 | 25 to 19 | 1279 | 15 x 19 = 285 | -994 | 40222644267, 40221900076, 40221314296, 40219246883, 40218472492 (all five failed) |
| `routing-registry-drift` | 6 to 15 | 5 to 5 | 31 | 15 x 5 = 75 | +44 | 40227758084, 40222644264, 40221900028, 40221492509, 40221314227 |
| `skill-advisor-stress` | 0 to 9 | 2 to 2 | 0 (no runs in the 001 window) | 9 x 2 = 18 | +18 (no measured baseline) | 40227758000, 40222644327, 40221314233, 40219246783, 40200559835 |
| `sk-doc-script-tests` | 73 to 41 | 6 to 7 | 448 | 41 x 7 = 287 | -161 | 40227757991, 40223075258, 40222644243, 40221911319, 40221900045 |
| `sk-doc-rename-harness` | 2 to 4 | 3 to 3 | 6 | 4 x 3 = 12 | +6 | 40220156937, 40149635404, 40148156997, 40147795930 (four completed runs) |
| `deep-loop-runtime` | 5 to 7 | 12 to 12 | 61 | 7 x 12 = 84 | +23 | 40222644332, 40212025321, 40205175824, 40200559901, 40149635429 |
| `skill-doc-frontmatter` | 7 to 12 | 1 to 1 | 7 | 12 x 1 = 12 | +5 | 40227758060, 40222644339, 40219246819, 40212025157, 40208730117 |
| `playbook-operator-contract` | 73 to 42 | 2 to 2 | 149 | 42 x 2 = 84 | -65 | 40227758045, 40223075148, 40222644251, 40221911355, 40221900055 |
| `gate-inputs` | 73 to 41 | 2 to 2 | 149 | 41 x 2 = 82 | -67 | 40227758006, 40223075135, 40222644334, 40221911410, 40221900013 |
| `command-tree-parity` | 73 to 16 | 4 to 3 | 299 | 16 x 3 = 48 | -251 | 40227757984, 40222644273, 40221900044, 40221492543, 40221314292 |
| `naming-standard-guard` | 0 to 2 | 2 to 2 | 0 (no runs in the 001 window) | 2 x 2 = 4 | +4 (no measured baseline) | 40200559839, 40148157029 (two completed runs) |
| `rule-canary-sync` | 73 to 41 | 2 to 1 | 149 | 41 x 1 = 41 | -108 | 40227757949, 40223075142, 40222644228, 40221911366, 40221900101 |
| **Fourteen rows, summed** | | | 3079 | 1212 | -1867 | |

### Reading the delta

- **What this phase owns.** The raw deltas also carry phase 002 (the rebuild fan-out removal, which cut each unfiltered push workflow from 73 to 49 runs), phase 003 (the path filters, which cut `command-tree-parity` to 16) and a different day's traffic. The per-run median column is the part this phase changes. That split is inferred, and what would confirm it is a window with this phase reverted, which nobody ran.
- **Biggest wins.** The merge turns two runs per push, 4 and 3 billed min, into one run of 4, and the 61 runs of `Hook Node Tests` are gone: -329 raw. `rule-canary-sync` drops from 2 to 1 billed min per run with the sparse checkout: -108 raw. `spec-kit-check` is -994 raw, but this phase changed none of its triggers or test steps (its only lasting change here is the pip cache), so most of that is the run count falling from 50 to 15.
- **`spec-kit-check` sample.** 11 of its 15 window runs failed, all five sampled runs at the step `Runtime vitest project`, a test step and not a setup step. The four green runs in the window bill 16, 20, 16 and 19 min (runs 40200559859, 40187743399, 40170908787, 40147796034), a median of 17.5, so the lower per-run figure is not only an artifact of runs that stop early.
- **Regressions.** `routing-registry-drift` is +44, but its per-run median holds at 5 and its runs rose from 6 to 15, so the rise is run count. Its install step fell from 83 s to 67 s (`scratch/npm-dedupe.md`), which does not cross a billed-minute boundary. `deep-loop-runtime` (+23), `opencode-dual-version` (+8), `sk-doc-rename-harness` (+6) and `skill-doc-frontmatter` (+5) are run-count effects too, with per-run medians flat or lower. `skill-advisor-stress` (+18) and `naming-standard-guard` (+4) had no runs in the 001 window, which held no pull-request runs, so their baselines are unmeasured rather than zero. The one per-run regression is `sk-doc-script-tests`, 6 to 7 billed min. Its cause is UNKNOWN: this phase left that file at its pre-phase state apart from the pip cache line, and no job here was profiled step by step.
- **Sample notes.** The `opencode-plugin-tests` sample keeps one cancelled run (40221900066, 0 billed min), as the baseline's rule does. Without it the median is 4.5 and the estimate 121.5. `sk-doc-rename-harness` had four and `naming-standard-guard` two completed runs since the window start, so their medians rest on fewer than five runs.
- **Later commits inside the window.** `4b7d3d8941`, `b1315701ca`, `8ff7da700d`, `9480d99e6d`, `03abdb20d8` and `09e0275d27` reached main inside the window and touch these workflow files. They add token scopes, job timeouts, repository switches and comment rewording. None changes a trigger path or a step, so none changes the work a run does.
