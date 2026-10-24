# Cache adoption runs (2026-10-24)

Raw observations for the cold dispatch and the warm proof of the cached setup action on `main`. The action is `.github/actions/setup/action.yml` as committed in `fafaaa4e49` plus the key fix `5efe36e731`. The adoption call sites are commit `68e735d630`. Main was `0029a3ead5` when the push runs started, then moved to `e00fef3e76` and `b0b52243f0` while the measurements ran. Neither later commit touched a manifest the cache key hashes, so every run below used the same key.

Cache key in every run: `provision-Linux-node22-bun1.3.9-a003991fcfe3e97427e24ee9df924fed8a8f85c4d25e8e0e231c099e23840cd9`.

Reading guide: the action is one composite step in each job, so the API reports one "Provision ..." step. The restore, bun setup, walk and save times below come from the timestamps in the step log. The walk prints `provisioned: <installed> installed, <built> built, <present> already present, <failed> failed`. It never prints the older phrase `skipped already present`.

## Cache entry

```
gh api repos/:owner/:repo/actions/caches --jq '.actions_caches[] | select(.key|startswith("provision-"))'
key        provision-Linux-node22-bun1.3.9-a003991fcfe3e97427e24ee9df924fed8a8f85c4d25e8e0e231c099e23840cd9
ref        refs/heads/main
size       1121994943 bytes (about 1.12 GB)
created    2026-10-24T15:29:03Z (saved by the dual-version "Battery on OpenCode v2" job of run 40107034090)
last used  2026-10-24T15:38:40Z
```

Exactly one `provision-` entry exists. Nothing was deleted.

## Runs

Step seconds are the "Provision ..." step. Job seconds are the whole job.

### First run after the merge, cache miss (push at `0029a3ead5`, attempt 1)

| Run id | Workflow | Event | Conclusion | Restore step | Provision summary | Provision step | Job seconds | Save step |
|---|---|---|---|---|---|---|---|---|
| 40107034084 | OpenCode Plugin Tests | push | success | `Cache not found for input keys` | 11 installed, 5 built, 3 already present, 0 failed | 89 s | 147 | ran, `Failed to save: Unable to reserve cache ... another job may be creating this cache` |
| 40107034118 | Hook Node Tests | push | success | `Cache not found` | 11 installed, 5 built, 3 already present, 0 failed | 56 s | 173 | ran, same reserve warning |
| 40107034090 | OpenCode Dual-Version Battery, job "Both versions installed at once" | push | success | `Cache not found` | 11 installed, 5 built, 3 already present, 0 failed | 70 s | 157 | ran, same reserve warning |
| 40107034090 | same run, job "Battery on OpenCode v1" | push | success | `Cache not found` | 11 installed, 5 built, 3 already present, 0 failed | 88 s | 184 | ran, same reserve warning |
| 40107034090 | same run, job "Battery on OpenCode v2" | push | success | `Cache not found` | 11 installed, 5 built, 3 already present, 0 failed | 57 s | 145 | ran, `Cache saved with key: provision-Linux-node22-...` |

All five job instances started inside the same minute, so all five missed and all five installed. One save won the reservation and the other four logged a non-fatal reserve warning. The workflow stayed green.

### Cold path (T028): `workflow_dispatch` with `cold=true` on main

| Run id | Workflow | Event | Head sha | Conclusion | Restore step | Provision summary | Provision step | Job seconds | Save step |
|---|---|---|---|---|---|---|---|---|---|
| 40107101405 | OpenCode Plugin Tests | workflow_dispatch | `0029a3ead5` | success | not run (`if: inputs.cache == 'true'` false) | 11 installed, 5 built, 3 already present, 0 failed | 55 s | 96 | skipped |
| 40107567830 | OpenCode Dual-Version Battery, "Battery on OpenCode v1" | workflow_dispatch | `b0b52243f0` | success | not run | 11 installed, 5 built, 3 already present, 0 failed | 57 s | 155 | skipped |
| 40107567830 | same run, "Both versions installed at once" | workflow_dispatch | `b0b52243f0` | success | not run | 11 installed, 5 built, 3 already present, 0 failed | 52 s | 104 | skipped |
| 40107567830 | same run, "Battery on OpenCode v2" | workflow_dispatch | `b0b52243f0` | success | not run | 11 installed, 5 built, 3 already present, 0 failed | 51 s | 119 | skipped |

Each cold log holds eleven `provisioning <tree> (npm ci|bun install)` lines, so the install path ran. The `Cache hit for: bun-...` lines in these logs belong to the `setup-bun` action's own cache, not to the provision cache. `hooks-node-tests.yml` has no `workflow_dispatch` trigger and no `cold` input, so it has no cold run.

The first dual-version dispatch, run 40107103375, ended `cancelled`. It was pending behind the running push run in the `OpenCode Dual-Version Battery-refs/heads/main` concurrency group and a newer push run (main moved to `e00fef3e76`) replaced it. That is concurrency behaviour and not a workflow failure. It was dispatched again after the push runs finished, which gave 40107567830.

### Warm run A: the first hit after the save (push at `e00fef3e76`)

Main moved on to a commit that changed spec-kit and advisor sources but no cache-key input, so these runs hit the cache and the walk rebuilt the outputs whose stamps no longer matched the new sources.

| Run id | Workflow | Event | Conclusion | Restore step | Provision summary | Provision step | Job seconds | Save step |
|---|---|---|---|---|---|---|---|---|
| 40107240022 | OpenCode Plugin Tests | push | success | `Cache hit for: provision-...` then `Cache restored successfully` | 0 installed, 3 built, 14 already present, 0 failed | 45 s | 82 | skipped |
| 40107240008 | Hook Node Tests | push | success | hit, restored | 0 installed, 3 built, 14 already present, 0 failed | 46 s | 158 | skipped |
| 40107239943 | OpenCode Dual-Version Battery, "Both versions installed at once" | push | success | hit, restored | 0 installed, 3 built, 14 already present, 0 failed | 41 s | 101 | skipped |
| 40107239943 | same run, "Battery on OpenCode v1" | push | success | hit, restored | 0 installed, 3 built, 14 already present, 0 failed | 46 s | 118 | skipped |
| 40107239943 | same run, "Battery on OpenCode v2" | push | success | hit, restored | 0 installed, 3 built, 14 already present, 0 failed | 42 s | 106 | skipped |

The three rebuilt outputs were `system-spec-kit/runtime`, `system-spec-kit/runtime/cli` and `system-skill-advisor/runtime`, each logged as `rebuilding ... (sources changed since its last build)`. That is the walk working as designed, since the cache key hashes manifests and not sources.

### Warm run B: attempt 2 of the first-miss runs (same commit as the save, `0029a3ead5`)

This is the clean warm case, the cache was saved from this exact source tree.

| Run id | Workflow | Event | Conclusion | Restore step | Restore seconds | Provision summary | Provision step | Job seconds | Save step |
|---|---|---|---|---|---|---|---|---|---|
| 40107034084 attempt 2 | OpenCode Plugin Tests | push | success | `Cache hit for: provision-...`, `Cache restored from key` | 29 | 0 installed, 0 built, 14 already present, 0 failed | 45 s | 116 | skipped |
| 40107034118 attempt 2 | Hook Node Tests | push | success | hit, restored | 15 | 0 installed, 0 built, 14 already present, 0 failed | 34 s | 170 | skipped |
| 40107034090 attempt 2 | OpenCode Dual-Version Battery, "Both versions installed at once" | push | success | hit, restored | 23 | 0 installed, 0 built, 14 already present, 0 failed | 44 s | 149 | skipped |
| 40107034090 attempt 2 | same run, "Battery on OpenCode v1" | push | success | hit, restored | 17 | 0 installed, 0 built, 14 already present, 0 failed | 36 s | 131 | skipped |
| 40107034090 attempt 2 | same run, "Battery on OpenCode v2" | push | success | hit, restored | 18 | 0 installed, 0 built, 14 already present, 0 failed | 29 s | 119 | skipped |

## Comparison

| Case | Provision step range | Median |
|---|---|---|
| Phase baseline (spec.md SC-001) | 56 to 67 s | 61 s |
| Cache miss with install and save (first run) | 56 to 89 s | 70 s |
| Cold dispatch, cache off | 51 to 57 s | 55 s |
| Warm A, hit plus 3 rebuilds | 41 to 46 s | 45 s |
| Warm B, hit and nothing to rebuild | 29 to 45 s | 36 s |

Warm B against the 56 to 67 s baseline saves about 25 s at the median (11 to 38 s across instances), not the 40 s the criterion names. The restore of the 1.12 GB entry costs 15 to 29 s and the walk costs 2 to 4 s. Whole-job seconds are noisy because the checkout step alone varied from 35 to 52 s between instances. Against the 002 job baselines (hooks 194 s, plugin 138 s, dual 156/148/127 s) the warm B jobs ran 170 s (24 s shorter), 116 s (22 s shorter) and 119/131/149 s. The pairing of the dual-version baselines to jobs is not stated, so only the sums are comparable.

## Static checks (AC-005)

```
grep -c 'uses: ./.github/actions/setup'    hooks-node-tests.yml 1   opencode-plugin-tests.yml 1   opencode-dual-version.yml 2
grep -c 'bun@1.3.9'                        hooks-node-tests.yml 0   opencode-plugin-tests.yml 0   opencode-dual-version.yml 0
grep -c "'.github/actions/\*\*'"           hooks-node-tests.yml 2   opencode-plugin-tests.yml 2   opencode-dual-version.yml 2
```

## Gate

```
bash .github/scripts/check-gate-inputs.sh
files=46 inputs_resolved=254 dynamic_inputs=39 twin_pairs=340 failures=0
RESULT: PASSED
exit 0
```

## Findings to carry forward

1. The `skipped already present` phrase in T029 and AC-006 is stale. The walk prints per-tree `provisioning` lines only for trees it installs and a final `provisioned: ...` summary, so the warm proof is the summary `0 installed, 0 built, 14 already present`.
2. A warm cache plus changed sources shows `N built`, which is correct and not a cache miss. The cache key hashes manifests, so only the build stamps notice a source change.
3. When several jobs miss the same key at once, each installs and each tries to save, and all but one log `Failed to save: Unable to reserve cache`. It is a warning and the jobs stay green.
4. The saved entry is 1.12 GB, so a restore costs 15 to 29 s. That restore cost is why the warm saving is closer to 25 s than 40 s.
