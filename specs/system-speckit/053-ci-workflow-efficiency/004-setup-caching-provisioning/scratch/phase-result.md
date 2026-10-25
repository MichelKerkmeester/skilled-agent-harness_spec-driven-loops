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
