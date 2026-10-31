
## 3. Dispatch log

One change per brief, dispatched one at a time through `scratchpad/w3/dispatch.sh`. Each brief is `briefs/<NN>-*.md`, assembled by `briefs/assemble.sh` from `_preamble.txt`, a persona block, `bodies/<NN>-*.txt` and `_post.txt` (RUN CONTEXT, DON'T and HANDBACK verbatim from the shared blocks). Every result was read from `logs/<NN>.last.txt`, the tree was diffed with `git status --porcelain` before and after, and the brief's own check was rerun by the orchestrator. Every dispatch returned `STATUS: DONE` and touched only its named files.

| Brief | Executor | Seconds | Change | Orchestrator check after |
|-------|----------|---------|--------|--------------------------|
| 01 pure-helpers | devin | 63 | new S and T: `nearestRank`, `rotations`, `optionArgs`, `readProbabilities`, `topKey`, `orderFromMaps` | T `9 passed (9)` |
| 02 keep-rule | devin | 146 | `judgeColumn`, `verdictLineFor`, `columnLine` | T `17 passed (17)` |
| 03 timed-child | devin | 99 | `childMain`, `runTimedChild`, `childEnv` | T `22 passed (22)` |
| 04 advisor-timing | devin | 70 | `timeAdvisor`, `advisorLine`, `headroomLine` | T `25 passed (25)` |
| 05 main-default | devin | 132 | `main` zero-call default, `--child` mode, entry guard | T `31 passed (31)` |
| 06 deem-arm | devin | 278 | `runArm` for Deem | T `1 failed \| 34 passed (35)`: a timing test flaked under machine load, see 06b |
| 06b timing-test-margin | devin | 19 | test only: the `late` timing test no longer pins `killed=0` and asserts `p95 > 2200` | covered by the 07 run |
| 07 jev-arm | devin | 279 | `runArm` for Jev: cost line, auth test, `--provider` on every call, exit handling | T `38 passed (38)` |
| 08 main-arms | devin | 186 | both gates and arms wired into `main`, Jev first | T `42 passed (42)` |
| 09 report | devin | 88 | `buildReport`, `report.json` when a switch is set | T `45 passed (45)` |
| 13 playbook-pin | devin | 91 | `manual-testing-playbook.vitest.ts` six `48` pins to `49` | `grep -c 49` 6, `grep -c 48` 0 |
| 10 new-docs | pi | 138 | copied three staged files: catalog entry, playbook SC-007, `changelog/v0.14.0.0.md` | `cmp` same on all three |
| 11 catalog-index | pi | 43 | `feature-catalog.md`: 45 features, scorer-fusion 8, index row | grep 3, diff +3/-2 |
| 12 playbook-index | pi | 64 | `manual-testing-playbook.md`: 49 twice, `SC-001..SC-007` twice, SC-007 row | grep 5 and 0, diff +5/-4 |
| 14 skill-md | pi | 183 | `SKILL.md` version `0.14.0.0` and one package-reference bullet | grep 2, diff +2/-1 |
| 15 readme | pi | 103 | `README.md` §8 verification row | grep 1, validator 0 issues |
| 16 runtime-readmes | pi | 38 | routing-accuracy README (code files 4, row) and parity README (tree line, row) | grep 2 and 2 |
| 17 leaf-manifest | devin | 15 | ran `ci-skill-root-metadata.cjs --fix --skill system-skill-advisor` | `checked=1 passed=1 failed=0` |

Totals: 18 dispatches, devin 12 (11 code or test briefs plus the scoped generator run), pi 6 (docs given as literal text). One re-dispatch (06b), no BLOCKED brief, no brief failed its own check twice.

## 4. Files changed by this phase

| File | Brief (executor) |
|------|------------------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs` (new, 710 lines) | 01-09 (devin) |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/score-suggested-order.vitest.ts` (new, 856 lines, 45 tests) | 01-09, 06b (devin) |
| `.skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts` | 13 (devin) |
| `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/suggested-order-eval.md` (new) | 10 (pi) |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/suggested-order-eval.md` (new) | 10 (pi) |
| `.skilled/skills/system-skill-advisor/changelog/v0.14.0.0.md` (new) | 10 (pi) |
| `.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md` | 11 (pi) |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md` | 12 (pi) |
| `.skilled/skills/system-skill-advisor/SKILL.md` | 14 (pi) |
| `.skilled/skills/system-skill-advisor/README.md` | 15 (pi) |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | 16 (pi) |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/README.md` | 16 (pi) |
| `.skilled/skills/system-skill-advisor/leaf-manifest.json`, `leaf-aliases.json` (generated, +2 and +10) | 17 (devin, generator) |

The three new doc texts were written by this orchestrator as literal text under `content/` and validated by type before the copy (`validate_document.py --type feature_catalog|playbook_feature|changelog`: 0 issues each). No build target was edited by the orchestrator.

## 5. Proof plan results (final state, after every brief landed)

Porcelain comparisons are judged on this phase's paths: other orchestrators changed `sk-communication`, `sk-doc`, `sk-create-skill` and `system-deep-loop` files during every run, and briefs 13 and 17 landed while P2-jev and P1-final ran. No run of `S` changed a tracked path.

| Row | Command and log | Result | Verdict |
|-----|-----------------|--------|---------|
| P1 | `runs/p1.*` (16:53-16:56, before the doc briefs) and `runs/p1-final.*` (17:12-17:15, after them), logging stubs first on PATH | exit 0 both. `baseline: holdout_top1=53/70`; comparators scorer 0.7811, confidence 0.7766, always_second 0.5498, rerank 0.7588; `power: movable=23 decided_ceiling=99 min_wins=16 win_rate_80=0.749`; `advisor child: p50=683 p95=949 max=1752 over_2200=0 children=241 killed=0` then, final, `p50=629 p95=929 max=2500 over_2200=4 children=241 killed=1`; `planned calls: jev=334 deem=333`; `margin: 0.05`; `keep rule: ...`. Neither stub log exists after either run. The two stdouts are identical once the `advisor child:` line is masked | PASS |
| P2 | `runs/p2-deem.*`, `runs/p2-jev.*` | exit 0 each. Against P1 with `advisor child:` masked, p2-deem adds only `deem arm skipped: stub backend`; p2-jev adds only `jev: path=<scratch>/stubs/p2-jev/jev provider=official` and `jev arm skipped: no credential`. Stub logs: `health` for cli-deem; `--version` and `auth status --provider official` for jev. Each `report.json` has `headroom: ok`, `columns: {}`, `stopped: {}` and the 10 census lines | PASS |
| P3 | `node_modules/.bin/vitest run tests/parity/score-suggested-order.vitest.ts` (`logs/p3-vitest.txt`) | `Test Files 1 passed (1)`, `Tests 45 passed (45)`, 41.2 s. REQ-011 cases present: movable headroom at 4 rows, latency headroom, a tie in the mean-probability order kept in scorer order, `none` first kept as scorer order, partial map `unmeasured`, both gate skips byte-identical to the base lines, child killed at 2,500 ms `unmeasured_timeout`, `keep`, `kill`, `stop (margin)`, `stop (coverage)`, `stop (latency)`, and every stub `jev` line carrying exactly one `--provider` | PASS |

## 7. Re-dispatches

- 06 -> 06b. Brief 06's own run of T ended `1 failed | 34 passed (35)`: `times the advisor child on each prompt and reports the latency stop` expected `killed=0`, but under the parallel orchestrators' load a 2,300 ms stub child plus node startup crossed the 2,500 ms kill. The script was right and the test pinned machine speed. 06b (test only) dropped the `killed` pin and asserts `p95 > 2200`, which holds whether or not the child is killed. No other brief failed its check.

## 8. Deviations and decisions (each recorded, none silent)

1. Deem health timeout. REQ-002 says `cli-deem health` within 2,000 ms, but it also says the gates are 002's `deemGate` unchanged, and that gate uses `HEALTH_TIMEOUT_MS = 10000`. The gate was imported unchanged, so the 10,000 ms bound holds. The phase docs should pick one.
2. "Byte-identical" skip output. A skip run re-measures the advisor, so its `advisor child:` numbers can never match another run's. P2 compares with that one line masked. Everything else is byte-identical.
3. REQ-010 refusal order. `--jev` or `--deem` without `--out` exits 2 before any output, as this phase's REQ-010 asks. 002's script refused after its gate. This phase's text was followed.
4. Verdict line `p`. The `p=` field prints the sign-test P(X >= W). The loss-test value goes to `report.json` as `p_loss`.
5. Flips. F counts, per measured row, 3 minus the count of the most common top answer, so a three-way split adds 2. That follows the spec's flip definition literally.
6. Margin tolerance. `20*(SA-SB) >= M` is evaluated with a 1e-9 tolerance so a float sum that equals the margin is not lost to rounding.
7. `none`. A row keeps the scorer's order only when `none`'s mean is strictly above every cluster key's mean. A tie with a key does not abstain.
8. Option labels. One `optionArgs` helper serves both backends and appends ` [key]` when two cluster skills share a projection description, so no two options are identical text.
9. Child daemons. `childEnv` sets `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=1` (unless already set) so the advisor daemon the hook starts for the capture env's temp database idles out after a minute instead of 30.
10. Size. The script is 710 lines against the plan's 350-500 estimate, and T is 856 lines with 45 tests. The extra is the timed child, both arms' exit handling and the report.
11. Generated leaf files. The spec names `ci-skill-root-metadata.cjs --fix` for `leaf-manifest.json` and `leaf-aliases.json`. It ran scoped with `--skill system-skill-advisor` (brief 17, executor) because `sk-communication`'s root was stale from another orchestrator's work and an unscoped `--fix` would have written it.

## 9. Premises that no longer match the docs

- The Deem source commit is now `3883f79261e5c61d3e8f230cad02b50c6d2b1891` (health at 16:52 and 17:15). 002's docs recorded `c8a5523`. The model commit is unchanged at `8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21`.
- `cli-deem` is not on PATH in this environment. 002's `deemCommand` falls back to the repo client `.skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs`, which is what P4 used.
- A real `jev` sits at `~/.local/bin/jev` with a stored key, so any `--jev` test run on this machine needs a stub first on PATH. Every `--jev` run in this build used one.
- The advisor-only timing is load-sensitive. Across four real runs p95 ranged 929 to 1,296 ms and 0 to 4 children of 241 were killed at 2,500 ms while other orchestrators ran suites in the same tree. The first child after a cold start pays the temp database's daemon start (about 2,281 ms in the probes).

## 10. Open items (not this orchestrator's to close)

- J1, T018: live Jev run pending the operator's yes. It sends routing-corpus prompts and skill projection descriptions (both committed) to the hosted classifier, about 334 calls. Exact command from the worktree root, provider chosen by `JEV_PROVIDER` (default `official`): `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs --jev --out specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/scratch/w4-build/runs/jev`. Whether Jev returns a probability for every submitted key stays UNKNOWN until then.
- Session generators, check only here: `sync-skills-hermes.cjs --check` reports `DRIFT system-skill-advisor` (the Hermes copy of `SKILL.md` lags the version bump and new bullet), and `generate-trigger-index.mjs --check` lists `changelog/v0.14.0.0.md` and `feature-catalog/scorer-fusion/suggested-order-eval.md` as stale for this phase. Both need the session's regeneration. The other drift in those two outputs belongs to other phases.
- Phase docs (`tasks.md`, `implementation-summary.md`, `goal.md`'s verdict log) belong to the closure leaf. This build did not edit them.
- Cross-family review of the script and the commit are the session's.
