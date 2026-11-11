# Iteration 1: What sets the cli lane's time inside upgrade-legacy

## Focus

The packet's known limitation 1 says the `cli` lane did not get faster because `tests/upgrade-legacy.vitest.ts` takes about 400 s alone and sets the lane's time. This iteration opened that file to find out where its seconds actually go, and whether the time can be cut without removing an assertion. Deferred to later iterations: the 12 serial deep-loop files, the core lane's import figure, and ledger caching.

## Actions Taken

1. Located the file and the runner that isolates it (`run-cli-tests.sh`).
2. Counted its structure: 2370 lines, 65 `it` blocks in 5 `describe` blocks, 1 `beforeAll`, 0 `beforeEach`, 3 `afterEach`.
3. Counted its process work: 74 `runUpgrade([...])` call sites, 7 `validate(` calls, 3 `validateJson(` calls, 13 direct `git` execs, 37 `manifest(` call sites.
4. Read `beforeAll`, `resetSandbox`, `refreshCopiedDistMtimes`, `manifest`, `commitChanges`.
5. Traced one `runUpgrade` call into `upgrade-legacy.mjs` and then into `validate.sh`, and counted the process chain per packet validation.
6. Measured the copy payload and the dist-file count, and timed bare `node`, `bash` and `git` startup on this machine.
7. Read Vitest's own summary reporter to check how the reported `import` figure is computed.

## Findings

1. The suite is a single 2370-line file with 65 tests over one shared sandbox: `beforeAll` copies the whole skill tree (3115 files, 35.8 MB excluding `node_modules`) into a temp dir, symlinks three `node_modules` back, runs `git init` and commits the entire copy as the baseline. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:194]`
2. The file's dominant work is process creation, not computation: 74 `runUpgrade` call sites each spawn `node .../upgrade-legacy.mjs`, and every packet validation inside that CLI spawns `bash validate.sh`, which spawns two more node processes — one for the dist-freshness check and one for the validation orchestrator. One assertion can therefore cost three or four process starts. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:33]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:951]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:405]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:421]`
3. The double validation is by design, not waste: `validateAll` validates every packet in scope before any repair, and a repaired packet is validated again to prove the repair worked. Removing either pass would change what the command guarantees, so it is not a speed lever. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:988]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1190]`
4. Bare process startup is not the cost: `node -e ""` measures 0.020 s and `bash -c true` and `git rev-parse` measure under 0.005 s on this machine, so 74 node starts are about 1.5 s. The seconds are inside each child's module load and its own work, not in the spawn itself. `[SOURCE: measured: /usr/bin/time -p node -e "" x3 = 0.020 s each]`
5. The freshness check that `validate.sh` runs before every validation is cheap in itself: the watched source set for the `validation-orchestrator` entry is 16 files / 344 KB, so the extra node process costs startup plus a small hash, not a tree walk. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:89]` `[SOURCE: measured: watched source files = 16, bytes = 343682]`
6. Three of the five `describe` blocks reset the sandbox after every test (`afterEach(resetSandbox)`), and two do not. That makes 58 of the 65 tests provably order-independent and shardable, and leaves 7 (`planLayoutMove`'s 6 and `layout links`' 1) without a proven independence guarantee. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:231]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:1932]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:2272]`
7. The reset itself is not free and is paid once per test: `git reset --hard`, `rm -rf` of six paths, then `refreshCopiedDistMtimes`, which walks the copied `runtime` tree and calls `utimesSync` on every file under a `dist/` path — 734 such files in the real tree. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:90]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:132]` `[SOURCE: measured: find .skilled/skills/system-spec-kit/runtime -path '*/dist/*' -type f | wc -l = 734]`
8. Vitest's reported `import` time is a sum over files, not wall time: the summary line computes `collectTime = sum(files, file => file.collectDuration)` and prints it beside the wall `executionTime`. A 300 s import figure therefore cannot be read as 300 s of wall clock, which matters for the packet's framing of the core lane. `[SOURCE: .skilled/skills/system-spec-kit/node_modules/vitest/dist/chunks/index.UpGiHP7g.js:2465]` `[SOURCE: .skilled/skills/system-spec-kit/node_modules/vitest/dist/chunks/index.UpGiHP7g.js:2474]`
9. The one structural lever this file offers is sharding, not trimming: 58 self-resetting tests can move into separate files, each with its own sandbox, and Vitest already runs cli files in parallel. The copy cost is paid once per shard (about 35.8 MB), while the per-test process work parallelises. A 4-shard split is an estimate of roughly 400 s down to 120-150 s wall on this machine, and it must be measured, not claimed. `[INFERENCE: from findings 2, 4 and 6 plus the cli project's fileParallelism: true at .skilled/skills/system-spec-kit/vitest.config.ts:57]`

## Ruled Out

- **Cutting node startup.** Measured at 0.020 s per start, so even eliminating every spawn saves seconds, not minutes. `[SOURCE: measured: /usr/bin/time -p node -e ""]`
- **Shrinking the sandbox copy.** The payload is 35.8 MB of 3115 files, paid once in `beforeAll`, so it cannot explain a 400 s file.
- **Removing the second validation pass.** It is the proof that a repair worked; removing it would drop an assertion the file exists to make. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1190]`
- **Merging `validate.sh`'s freshness check into the orchestrator.** It would save one 20 ms process per validation while changing a guard that fails closed on a stale build; not worth the risk for seconds.

## Dead Ends

- No checked-in timing profile for the cli lane was found in the packet or the skill tree, so the per-test split of the 400 s is not yet known. A profile is the next evidence needed before any saving is claimed. `[SOURCE: fd -e json 'profile|timing|slow' .skilled/skills/system-deep-loop/runtime → no results]`

## Edge Cases

- Ambiguous input: the topic says "the cli lane's upgrade-legacy file sets its time". Read narrowly as the single file `tests/upgrade-legacy.vitest.ts`, not the two sibling `upgrade-legacy-*.vitest.ts` files, because `run-cli-tests.sh` isolates exactly that path. The siblings were not investigated this iteration.
- Contradictory evidence: the packet reports the core lane's `import` time as a cost to cut, while Vitest reports it as a per-file sum. Both statements are cited; the resolution is finding 8 and the question is carried forward rather than marked answered.
- Missing dependencies: none.
- Partial success: none; all planned reads completed.

## Sources Consulted

- `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:33`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:90`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:132`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:194`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:231`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:1932`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:2272`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:951`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:988`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1190`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:405`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:421`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:89`
- `.skilled/skills/system-spec-kit/vitest.config.ts:57`
- `.skilled/skills/system-spec-kit/node_modules/vitest/dist/chunks/index.UpGiHP7g.js:2465`
- `.skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh`
- `.skilled/skills/system-spec-kit/runtime/vitest.config.ts`
- measured: `/usr/bin/time -p node -e ""` x3 = 0.020 s each; `bash -c true` and `git rev-parse` under 0.005 s
- measured: `find ... -path '*/dist/*' -type f | wc -l` = 734; copy payload 35.8 MB / 3115 files

## Assessment

- New information ratio: 0.93
- Questions addressed: Q2 (what sets the cli lane's time inside upgrade-legacy)
- Questions answered: none fully; Q2 moved from "the file is 400 s" to a named cost structure and one measurable lever, and is carried forward pending a per-test profile

## Reflection

- What worked and why: following one `runUpgrade` call all the way into `validate.sh` turned an opaque "400 s file" into a countable process chain. Counting call sites before reading bodies kept the read budget small and made the structural claim checkable.
- What did not work and why: looking for a checked-in timing profile found nothing, so the per-test split of the 400 s is still inferred rather than measured. No arithmetic over process counts can substitute for that profile.
- What I would do differently: measure one representative `runUpgrade` invocation's wall time early, so the process-count model is calibrated rather than assumed.

## Recommended Next Focus

Before any shard is proposed as a win, obtain a per-test timing split of `upgrade-legacy.vitest.ts` — the cheapest path is a single `vitest run --project cli tests/upgrade-legacy.vitest.ts --reporter=json` profile, read as evidence. In parallel, carry the import-sum correction (finding 8) into the core-lane question, because the packet's third open item may be framed on a metric that cannot move wall time the way the packet expects.

## Questions Answered

- None fully. Q2 is partially answered with a named cost structure.

## Questions Remaining

- 5 of 5 key questions remain open; Q2 is the one this iteration advanced.
