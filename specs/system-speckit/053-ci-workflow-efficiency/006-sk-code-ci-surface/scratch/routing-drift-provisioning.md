# routing-drift provisioning

Investigation only. No workflow and no action file was changed. Observed on 2026-10-25. The tree export used for the experiments is HEAD as of 10:17 local time, whose `routing-registry-drift.yml` is byte-identical to the working tree's.

## Verdict

Narrowing is safe for what the job loads, and it is worth about 21 seconds of wall-clock per run. It is not worth a change to the shared action. If the saving is wanted, restore the job's previous inline install for `routing-drift` alone and leave `golden-prompt-gate` on the action.

- Needed: 3 of the 14 provisioned trees. These are `.skilled/skills/system-spec-kit/node_modules`, `.skilled/skills/system-spec-kit/shared/dist` and `.skilled/skills/sk-doc/node_modules`.
- Not needed: the other 11 trees, the bun toolchain, the cache save and the two spec-kit rebuilds the walk ran in two of the three action runs.
- Measured: the setup step takes 31 to 36 s with the action and 13 to 14 s with the inline install it replaced.

## What the job runs

Job `routing-drift` in `.github/workflows/routing-registry-drift.yml` (lines 128 to 227). After checkout, setup-node and the action call at `:140-141`, its commands are:

1. `:145` vitest (pinned `vitest@4.0.18` through `npx --yes`) over `routing-registry-drift-guard`, `routing-parity-deep-skills` and `routing-parity-deep-council` in the advisor runtime folder.
2. `:159` `node .skilled/bin/compiled-route-guard.cjs`.
3. `:172` `node .skilled/bin/compiled-route-admission.cjs` twice (`--hub system-deep-loop`, then `--all --warn-only`).
4. `:182` `parent-skill-check.cjs` once per hub that carries a `mode-registry.json`.
5. `:192` three `ci-*` scripts under `sk-doc/sk-create-skill/scripts/`.
6. `:203` `skill_graph_compiler.py --validate-only`. It imports only the Python standard library (`argparse json os re sys datetime typing`, `skill_graph_compiler.py:18-24`).
7. `:214` `generate-router-intent-signals.cjs --check`.
8. `:221` `skill-graph-freshness.cjs --strict`.

## What the action provisions

`.github/actions/setup/action.yml` takes two inputs only, `cache` and `bun-version` (`:11-17`). Neither chooses which trees to provision, so the job cannot narrow it through an input. Its steps are:

1. Read the Node major for the cache key (`:22-24`).
2. Restore one cache that holds the 20 paths listed at `:31-50` (`:26-51`).
3. Install bun with `oven-sh/setup-bun` (`:53-55`).
4. Run `provision_worktree`, which walks the 14 packages in `.skilled/skills/sk-git/scripts/worktree-provision-paths.txt` and rebuilds a package whose sources changed (`:57-61`).
5. Save the cache on a miss (`:63-87`).

## Measured in CI

Commands:

```
gh run list --workflow routing-registry-drift.yml --branch main --limit 10 --json databaseId,conclusion,createdAt,headSha,event,status
gh run view <id> --json jobs,headSha,conclusion
```

The list holds 10 runs. Seven succeeded. The five newest successes are below. Seconds are `completedAt` minus `startedAt` of the job `Registry == advisor maps ...` and of its step.

| Run | Commit | Job s | Checkout s | Setup step | Setup step s |
|---|---|---:|---:|---|---:|
| 40149635371 | `03abdb20d8` | 92 | 18 | action | 36 |
| 40147795990 | `8ff7da700d` | 90 | 21 | action | 36 |
| 40123498148 | `1c0c3534cf` | 119 | 51 | action | 31 |
| 40113489423 | `c903c0d103` | 98 | 51 | inline install | 14 |
| 40107239945 | `e00fef3e76` | 98 | 52 | inline install | 13 |

Only the top three runs call the action. The bottom two predate it and ran the inline install (`npm ci` for spec-kit, a `tsc --build` of the shared package, `npm ci` for sk-doc). The other steps are the same in all five runs.

- Mean setup step with the action: (36 + 36 + 31) / 3 = 34.3 s.
- Mean setup step with the inline install: (14 + 13) / 2 = 13.5 s.
- Difference: 20.8 s. The pairwise range is 17 s (31 against 14) to 23 s (36 against 13).
- Mean job time over all five runs: 99.4 s. Checkout alone swings between 18 s and 52 s, so whole-job times are not a fair comparison. Job time without checkout is 74, 69 and 68 s with the action and 47 and 46 s without it.

### Where the 36 seconds go

Log of run 40149635371 (`gh run view 40149635371 --job 121038233337 --log`):

- Cache restore: 29.1 s (`duration_ms=29104`). It fetched 834 MB (`Cache Size: ~834 MB (874775660 B)`) and extracted it with `tar`. Runs 40147795990 and 40123498148 show the same 834 MB hit.
- setup-bun: 1.1 s (01:13:17.557 to 01:13:18.699).
- `provision_worktree`: 4.5 s (`duration_ms=4454`). It printed `provisioned: 0 installed, 2 built, 14 already present, 0 failed` and rebuilt `system-spec-kit/runtime` and `system-spec-kit/runtime/cli`. This job loads neither build.
- Cache save: skipped on a hit.

These add up to 34.8 s against the 36 s the API reports.

## What the job needs

Method. A sandbox holds the tracked files of HEAD with no provisioned tree. `specs` is a symlink to this worktree's `specs`, and `git init` gives scripts a repository. Each experiment clones chosen provisioned paths from this worktree into a copy of the sandbox with `cp -cR`. Then it replays the job's 11 commands, with stdin closed, and reads each exit code. The 11 are the vitest run, `compiled-route-guard`, the two admission runs, the parent-skill loop, the three `ci-*` scripts, the graph compiler, the intent-signal check and the freshness check.

```
git ls-tree -z --name-only HEAD | grep -zv '^specs$' | xargs -0 git archive HEAD | tar -x -C <sandbox>
ln -s <worktree>/specs <sandbox>/specs
git init -q <sandbox>
cp -cR <worktree>/<path> <sandbox>/<path>
```

Result. "9 of 11" always means the same two commands fail: the parent-skill check loop and `ci-skill-root-metadata.cjs`. The other nine pass in every row, including the vitest step.

| Provisioned paths in the sandbox | Commands passing |
|---|---:|
| none | 9 of 11 |
| the 19 cache paths other than `.git/provision-stamps` | 11 of 11 |
| spec-kit `node_modules`, spec-kit `shared/dist`, sk-doc `node_modules` | 11 of 11 |
| same three with `PATH` stripped of `~/.bun/bin` | 11 of 11 |
| the three without sk-doc `node_modules` | 9 of 11 |
| the three without spec-kit `shared/dist` | 9 of 11 |
| the three without spec-kit `node_modules` | 9 of 11 |
| spec-kit `shared/dist` alone | 9 of 11 |

Each removal breaks the job in its own way:

- No sk-doc `node_modules`: `@spec-kit/shared/frontmatter/parse-frontmatter.js is not built here`. That folder only holds the link `@spec-kit/shared -> ../../../system-spec-kit/shared` (4 KB).
- No `shared/dist`: `Cannot find module '.skilled/skills/sk-doc/node_modules/@spec-kit/shared/dist/frontmatter/parse-frontmatter.js'`.
- No spec-kit `node_modules`: `Cannot find package 'js-yaml' imported from .skilled/skills/system-spec-kit/shared/dist/frontmatter/parse-frontmatter.js`.

So the job's only load-time need from the dependency trees is the shared frontmatter parser (the built `shared/dist`, reached through the sk-doc link) and its dependencies in the spec-kit `node_modules`, with `js-yaml` the first to fail. Everything else passes with nothing provisioned. The vitest step passes in the empty sandbox with a vitest binary that sits outside the repository.

Size of what is needed, local uncompressed (`du -sk`): spec-kit `node_modules` 514,552 KB, `shared/dist` 1,184 KB and sk-doc `node_modules` 4 KB, 515,740 KB together. The full cache list is 2,200,340 KB, so the needed part is 23.4 percent of the bytes.

## Saving and recommendation

Safe. Observed twice over: the sandbox passes all 11 commands on the three-path set at HEAD, and CI runs 40113489423 and 40107239945 passed on Node 20 with that install before the action replaced it.

Worth it. Modest. The saving is 21 s of wall-clock per run, about a fifth of the job. It is a latency gain only. Both the 92 s and the 71 s case round up to two billed minutes, so the sampled runs would not bill fewer minutes (INFERRED from per-job minute rounding, not checked against this account).

Path. Restore the inline block for `routing-drift` only. It is the text removed from this job by `git show 1c0c3534cf -- .github/workflows/routing-registry-drift.yml`:

```
npm --prefix .opencode/skills/system-spec-kit ci
( cd .opencode/skills/system-spec-kit/shared && ../node_modules/.bin/tsc --build )
npm --prefix .opencode/skills/sk-doc ci
```

Keep `golden-prompt-gate` on the action. Its setup step fell from 66 and 62 s to 35, 37 and 31 s, so the action pays off there. The earlier caching packet's keep verdict for this file rested on the two jobs added together (`004-setup-caching-provisioning/scratch/npm-dedupe.md:9`), which hides that `routing-drift` alone got slower. Judged per job, the packet's own rule (keep only when the warm step is at least 10 s shorter) fails for `routing-drift`: its step is about 21 s longer. Do not add a tree-selection input to the action for this. It would change the cache key every caller shares to save one job's seconds.

Two comments are now untrue and were left alone: `.github/workflows/routing-registry-drift.yml:148-152` says the job installs only vitest rather than the full skill, and `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts:20-21` says the routing job runs against a checkout with no local install.

## Limits and what is INFERRED

- The sandbox ran Node v26.8.2, Python 3.9.6 and the local vitest 4.1.11. CI uses Node 20, Python 3.x and `vitest@4.0.18`. The two older CI runs are the only Node 20 evidence for the narrow set.
- The copied `node_modules` come from this worktree, not from a fresh `npm ci`.
- `specs` pointed at this worktree's `specs`, which holds other work in progress.
- INFERRED: that the narrow restore would cost far less than 29 s. Only the byte share (23.4 percent) was measured, not a compressed cache.
- INFERRED: that spec-kit `node_modules` is needed in full. The run only showed `js-yaml` failing first.
- A first attempt to trace module resolution with a loader hook hung the node processes. I killed it and used none of its output.
