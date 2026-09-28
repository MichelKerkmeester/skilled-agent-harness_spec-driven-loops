# Build Evidence: 002-advisor-jev-tiebreak-arm (wave 3 build orchestrator)

Worktree `069-cli-jev-workflow-integration`, HEAD at hand-off `10697dcceb`. Every command ran from the worktree root unless a `cd` is shown. Raw outputs sit in `baseline/`, `logs/` and `runs/` beside this file.

## 1. Baseline (before the first dispatch)

| Gate | Command | Result | Exit |
|------|---------|--------|------|
| Advisor dist build (T001) | `cd .skilled/skills/system-skill-advisor/runtime && npm run build` | tsc and postbuild ran, 3.2 s | 0 |
| Advisor vitest, full | `cd .skilled/skills/system-skill-advisor/runtime && node_modules/.bin/vitest run` | `Test Files 129 passed (129)`, `Tests 971 passed \| 6 skipped (977)`, 179 s; `ps` table 772,782 bytes before, 773,923 after (under 1,048,576) | 0 |
| Advisor typecheck | `npm run typecheck` (same dir) | no diagnostics | 0 |
| validate_document.py | on SKILL.md, README.md, feature-catalog.md, manual-testing-playbook.md, routing-accuracy/README.md, tests/parity/README.md, scorer-fusion/ambiguity.md (catalog and playbook), changelog/v0.11.1.0.md | 9 of 9 exit 0: seven print `Total issues: 0`; the two index files print `Total issues: 1`, the README-rules fallback note (`document_type_fallback`), and 0 with `--type playbook` / `--type feature_catalog` | 0 each |
| Package validators | `validate-playbook-package.cjs --package system-skill-advisor`; `validate_catalog_package.py --package system-skill-advisor` | playbook `scenarios=47 violations=0 warnings=1`; catalog `WARN tier=warn violations=8` (0 fail, 8 warn) | 0, 0 |
| Skill-root metadata | `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | `checked=16 passed=16 failed=0 fixed=0` | 0 |
| Hermes copies | `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` | `PASS: 73 Hermes skill copies in sync` | 0 |
| Trigger index | `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` | already stale before this build: `008-cli-classifier-hub/implementation-summary.md` (added "cli deem build result") | 1 |
| Phase docs | `validate.sh specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm --strict` | `Errors: 0 Warnings: 0`, `RESULT: PASSED` | 0 |
| Tree | `git status --porcelain` | empty at start; later only the closure leaf's 016 edits and this scratch folder | - |

Planning probe (`probe-census.mjs`, this folder, read-only, not a build target): holdout top-1 53/70; labeled 177 rows, 93 eligible, 22 movable, 61 gold-first, 10 gold-outside, 164 gold-in-top-3; holdout 64 rows, 18 eligible, 1 movable, 15 gold-first, 2 gold-outside, 49 top-3; largest cluster 10, no cluster over 25, no `ambiguousWith` member outside the visible order; 4.6 s to score. Confirmed: the built census printed the same numbers (`runs/p1-default.stdout.txt`, `runs/p1-final.stdout.txt`). With 23 movable rows the census is neither `no headroom` nor `underpowered`, so T007 builds every task.

## 2. Proof plan (fixed before the first dispatch)

`S=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs`, `V=tests/parity/score-jev-tiebreak.vitest.ts` run from the advisor runtime dir.

| Row | Criterion | Command | Expected |
|-----|-----------|---------|----------|
| P1 | Goal 1 | `PATH="$STUB:$PATH" node $S` with logging stub `jev` and `cli-deem` | `census: file=labeled rows=177 ...` and `file=holdout rows=64 ...` with eligible, movable, gold_first, gold_outside, gold_top3; `baseline: holdout_top1=53/70`; four `comparator:` lines (scorer, confidence, always_second, rerank) with mrr, right1, right3; a `power:` line; exit 0; neither stub log exists |
| P2 | Goal 2 | the same with `--jev` (stub `auth status` exit 3, `JEV_PROVIDER=openrouter`), stub version `0.2.3`, `--deem` with stub health reporting a stub backend and model `deem-1.5` | `jev: path=... provider=openrouter` then `jev arm skipped: no credential`; `jev arm skipped: version` with a details line; `deem arm skipped: stub backend`; `deem arm skipped: model`; each exit 0, stdout starting with the default run's stdout byte for byte, stub logs holding no judgment |
| P3 | Goal 3 | `grep -nE 'API_KEY\|TYPESAFE' $S`; stub run passing the Jev gate; stub `--deem` run | no match, exit 1; every logged `auth status`, `auth test`, `choice`, `noul` line carries one `--provider` value; no logged `cli-deem` line carries `--provider` or a key |
| P4 | Goal 4 | `node_modules/.bin/vitest run $V` | exit 0 with cases for a missing rerun answer kept out of the sign test, `jev arm stopped: key rejected`, `unmeasured_timeout`, `deem arm stopped: model commit changed mid-run` and a fake-server `--deem` column with its order-flip rate and commit pair |
| P5 | Goal 5 | `node $S --jev --out runs/jev` (keyed, provider `official`) and `node $S --deem --out runs/deem` (live `127.0.0.1:8300`) | Jev: a `calls.jsonl` whose every line has wall time, exit code, provider, model and status, and wins, losses, ties, abstentions, unmeasured, exact p, flip rate, p50, p95 and one `verdict:` line. Deem: a calibration line with accuracy, F1, Brier, 5-bin ECE and a fitted temperature beside 0.9843, and a Deem column with its order-flip rate, the commit pair and one `verdict:` line |
| P6 | Goal 6 | `git status --porcelain` before and after each script run, and at close | identical before and after each run; at close only the allowed paths |
| P7 | Goal 7 | `validate.sh <phase> --strict` | `RESULT: PASSED` (the closure leaf owns the phase docs) |
| G1 | Parent 4 | advisor full vitest | no failure beyond the 971 passed, 6 skipped baseline |
| G2 | Parent 3 | `validate_document.py` on each changed skill doc | exit 0 each |
| G3 | T039, T041 | `ci-skill-root-metadata.cjs`, `sync-skills-hermes.cjs --check`, ratchet 53/70 after the doc edits | exit 0, 0, holdout still 53/70 |

## 3. Dispatch log

| NN | Brief | Executor | Files allowed | Result |
|----|-------|----------|---------------|--------|
| 01 | `briefs/01-pure-math.md`: create the script with the pure math and the vitest file | cursor, 223 s, exit 0 | `score-jev-tiebreak.mjs`, `score-jev-tiebreak.vitest.ts` (create) | DONE. Tree diff: the 2 allowed files only. Orchestrator reran `node --check` (exit 0), the import line (`16 0.680`, exit 0) and `vitest run tests/parity/score-jev-tiebreak.vitest.ts` (`Tests 7 passed (7)`, exit 0) |
| 02 | `briefs/02-load-census.md`: `loadCensus()` under the capture env | cursor, 272 s, exit 0 | same 2 files | DONE. Tree diff: the 2 allowed files only. Orchestrator reran `node --check` (exit 0), the loader line (`53 241 195`, exit 0) and the vitest file (`Tests 8 passed (8)`, exit 0) |
| 03 | `briefs/03-census-summary.md`: `summarizeCensus()` lines, voiding and headroom | cursor, 242 s, exit 0 | same 2 files | DONE. Tree diff: the 2 allowed files only. `node --check` exit 0; vitest `Tests 10 passed (10)`, exit 0; code read against the brief |
| 04 | `briefs/04-comparators.md`: confidence, always-second and rerank comparators | cursor, 296 s, exit 0 | same 2 files | DONE. Tree diff: the 2 allowed files only. `node --check` exit 0; vitest `Tests 11 passed (11)`, exit 0; code read against the brief |
| 05 | `briefs/05-main-entry.md`: `main()`, direct-run guard, default-run test | cursor, 304 s, exit 0 | same 2 files | DONE. Tree diff: the 2 allowed files only. `node --check` exit 0; vitest `Tests 14 passed (14)`, exit 0. Orchestrator's real default run with logging stubs first on PATH: exit 0, porcelain identical before and after, no stub log (`runs/p1-default.stdout.txt`) |
| 06 | `briefs/06-jev-gate.md`: identity line and three Jev checks | cursor, 357 s, exit 0 | same 2 files | DONE. Tree diff: the 2 allowed files only. `node --check` exit 0; `grep -cE 'API_KEY\|TYPESAFE'` prints 0; vitest `Tests 17 passed (17)`, exit 0; code read against the brief |
| 07 | `briefs/07-deem-gate.md`: `cli-deem health` gate and four skip lines | cursor, 268 s, exit 0 | same 2 files | DONE. Tree diff: the 2 allowed files only. `node --check` exit 0; vitest `Tests 23 passed (23)`, exit 0; code read against the brief |
| 08 | `briefs/08-column-keep-rule.md`: `summarizeColumn()` and the Keep Rule | cursor, 329 s, exit 0 | same 2 files | DONE. Tree diff: the 2 allowed files only. `node --check` exit 0; vitest `Tests 27 passed (27)`, exit 0; code read against the brief and the Keep Rule order (underpowered, kill, keep, inconclusive). `recordsByRow` is a plain object keyed by row id, carried into later briefs |
| 09 | `briefs/09-column-lines.md`: `columnLines()` and `verdictLine()` | cursor, 117 s, exit 0 | same 2 files | DONE. Tree diff: the 2 allowed files only. `node --check` exit 0; vitest `Tests 27 passed (27)` (assertions added inside existing cases), exit 0 |
| 10 | `briefs/10-spawn-helpers.md`: `spawnCall()` and `writeCall()` | devin, 167 s, exit 0 | same 2 files | DONE. Diff against pre-dispatch copies: only the brief's edits in the 2 files. `node --check` exit 0; `3 hi false`; vitest `Tests 31 passed (31)`, exit 0 |
| 11 | `briefs/11-jev-arm.md`: `runJevArm()`, exit handling, `calls.jsonl`, wired into `main` | cursor, 505 s, exit 0 | same 2 files | DONE. Tree diff: the 2 allowed files only. `node --check` exit 0; vitest `Tests 34 passed (34)`, exit 0. Review found two gaps, sent to brief 16: the stopping call is not written to `calls.jsonl`, and an `auth test` body without `model` leaves `model=undefined` |
| 12 | `briefs/12-deem-arm.md`: `runDeemArm()` choice arm, rotations, exit 4 recheck, commit pair on every call | cursor, 522 s, exit 0 | same 2 files | Code DONE, but the full file went to 37 passed, 1 failed: the older gate test "prints the health line when the pinned torch backend answers" expected only the health line, and the arm now runs after it. Not a code defect |
| 12b | `briefs/12b-deem-gate-test-fix.md`: that one test's stub refuses judgments with exit 2 and the expectation reads the four lines | devin, 621 s, exit 0 | vitest file only | DONE. Diff: only that `it()` block; script byte-identical to its pre-copy. vitest `Tests 38 passed (38)`, exit 0 |
| 13 | `briefs/13-deem-calibration.md`: R21's Deem half, `calibrationMetrics()`, one `cli-deem noul` per label on every passing `--deem` run | cursor, 705 s, exit 0 | same 2 files | DONE. Tree diff: the 2 allowed files only. `node --check` exit 0; vitest `Tests 41 passed (41)`, exit 0 (`logs/13.vitest.txt`). Code read: the calibration runs after the choice block, so it also runs at `no headroom` and `underpowered`; a stop during the noul pass after a finished choice column still leaves that column's verdict line printed (recorded as an open item) |
| 14 | `briefs/14-jev-stop-record.md`: the call that stops the Jev arm is written to `calls.jsonl` before the stop; a missing `auth test` model reads `unknown` | devin, 144 s, exit 0 | same 2 files | DONE. Diff against pre-copies (`logs/14.pre.*`): only the brief's edits. `node --check` exit 0; vitest `Tests 42 passed (42)`, exit 0 (`logs/14.vitest.txt`). Closes the two gaps found in the brief 11 review |
| 15 | `briefs/15-jev-calibration.md`: R21's Jev half, `mode: 'calibration'` in `runJevArm`, run by `main` only at `underpowered` | cursor, 280 s, exit 0 | same 2 files | DONE. Tree diff: the 2 allowed files only; script diff read against the brief. `node --check` exit 0; vitest `Tests 43 passed (43)`, exit 0 (`logs/15.vitest.txt`). A label counts only when all 3 passes return a probability; its pair uses the mean of the 3 |
| 16 | `briefs/16-column-compare.md`: `compareColumns()` and `compareLine()` on rows both columns decided, `decidedRr` per column, printed by `main` when both choice columns ran | devin, 245 s, exit 0 | same 2 files | DONE. Diff against pre-copies (`logs/16.pre.*`): only the brief's edits. `node --check` exit 0; vitest `Tests 45 passed (45)`, exit 0 (`logs/16.vitest.txt`). The bound is a one-sided 95% normal-approximation bound on the mean paired reciprocal-rank gap, printed both ways because no direction was pre-registered |
| 17 | `briefs/17-report-json.md`: `buildReport()` and `report.json` in `--out` with `columns.<backend>.verdict` holding the outcome, the printed line and the four keep conditions | cursor, 273 s, exit 0 | same 2 files | DONE. Tree diff: the 2 allowed files only; script diff read against the brief. `node --check` exit 0; vitest `Tests 46 passed (46)`, exit 0 (`logs/17.vitest.txt`) |
| 18 | `briefs/18-fake-server.md`: fake-server `--deem` test, the real `cli-deem` client against a scripted `127.0.0.1` server with a temp `CLI_DEEM_HOME` (hand-made `.git/HEAD`, no git command) | cursor, 425 s, exit 0 | vitest file only | DONE. Script byte-identical to its pre-copy; test diff read against the brief. vitest `Tests 47 passed (47)`, exit 0 (`logs/18.vitest.txt`): own column, `flip=0.0952`, commit pair `abc1234`/fixed sha, `unmeasured_over25=1`, 23 calls |
| 20 | `briefs/20-ra-readme.md`: routing-accuracy README row and code-file count 2 to 3 | pi, 66 s, exit 0 | that README | DONE. `git diff`: the two literal edits only. `validate_document.py` exit 0, `Total issues: 0` |
| 21 | `briefs/21-parity-readme.md`: parity README tree line and key-files row | pi, 23 s, exit 0 | that README | DONE. `git diff`: the two edits only. `validate_document.py` exit 0, `Total issues: 0`; grep 2 |
| 22 | `briefs/22-catalog-entry.md`: create `feature-catalog/scorer-fusion/tie-break-eval.md` from `content/catalog-tie-break-eval.md` | pi, 38 s, exit 0 | new file | DONE. `cmp` exit 0 (byte-identical); `validate_document.py` exit 0, `Total issues: 0` |
| 23 | `briefs/23-catalog-index.md`: catalog count 43 to 44, scorer-fusion 6 to 7, section 5 row | pi, 18 s, exit 0 | `feature-catalog.md` | DONE. `git diff`: the three edits only. `validate_document.py` exit 0 (README-rules fallback note, as at baseline); grep 2 |
| 24 | `briefs/24-playbook-scenario.md`: create `manual-testing-playbook/scorer-fusion/tie-break-eval.md` (SC-006) from `content/playbook-tie-break-eval.md` | pi, 15 s, exit 0 | new file | DONE. `cmp` exit 0; `validate_document.py` exit 0, `Total issues: 0` |
| 25 | `briefs/25-playbook-index.md`: playbook counts 47 to 48, wave 8 and section 14 ranges, SC-006 row | pi, 31 s, exit 0 | `manual-testing-playbook.md` | DONE. `git diff`: the five edits only. `validate_document.py` exit 0 (fallback note, as at baseline); grep 5 |
| 26 | `briefs/26-inventory-test.md`: `runtime/tests/manual-testing-playbook.vitest.ts` 47 to 48 on six lines (deviation D-1 below) | devin, 119 s, exit 0 | that test file | DONE. `git diff`: the six lines only; grep `47` 0, `48` 6. `vitest run tests/manual-testing-playbook.vitest.ts`: `Tests 1 passed (1)`, exit 0 |
| 27 | `briefs/27-changelog.md`: create `changelog/v0.13.0.0.md` from `content/changelog-v0.13.0.0.md` (deviation D-2 below) | pi, 17 s, exit 0 | new file | DONE. `cmp` exit 0; `validate_document.py` exit 0, `Total issues: 0` |
| 28 | `briefs/28-skill-md.md`: `SKILL.md` version 0.11.1.0 to 0.13.0.0 and one pointer bullet | pi, 18 s, exit 0 | `SKILL.md` | DONE. `git diff`: the version line and one added bullet; `description` and the Keywords comment untouched. `validate_document.py` exit 0, `Total issues: 0`; grep 2 |
| 29 | `briefs/29-readme.md`: README section 8 row for the offline eval | pi, 16 s, exit 0 | `README.md` | DONE. `git diff`: one added row. `validate_document.py` exit 0, `Total issues: 0`; grep 1 |

No brief was re-dispatched. One corrective brief, 12b, followed brief 12 because brief 12's new arm made an older gate test's expectation stale. Every executor handback read `STATUS: DONE`, with no stray question and no auth error, and every tree diff showed only the files its brief allowed. 35 dispatches by executor (from `logs/*.status`): cursor 21 (01 to 09, 11, 12, 13, 15, 17, 18, 30 to 34 in section 10 and 35 in section 11), devin 5 (10, 12b, 14, 16, 26), pi 9 (20 to 25, 27 to 29).

## 4. Regeneration (the phase's named generated files, run by the orchestrator)

| Step | Command | Result | Exit |
|------|---------|--------|------|
| Leaf manifest and aliases | `ci-skill-root-metadata.cjs` before, `--fix`, then again | before `checked=16 passed=15 failed=1` (system-skill-advisor); `--fix` `fixed=1`; after `checked=16 passed=16 failed=0 fixed=0`. Diff: the two new leaves added to `leaf-manifest.json` (+2) and `leaf-aliases.json` (+10) | 1, 0, 0 |
| Hermes copy | `sync-skills-hermes.cjs --check`, then without `--check`, then `--check` | `DRIFT system-skill-advisor`; `Wrote 1 of 73 Hermes skill copies`; `PASS: 73 Hermes skill copies in sync`. Diff: `.hermes/skills/system-skill-advisor/SKILL.md` (+2/-1) | 1, 0, 0 |
| Trigger index | `generate-trigger-index.mjs --check`, then the generator, then `--check` | before: 3 stale (the new changelog and catalog entry, plus the 008 doc stale since baseline). The first rebuild also listed two gitignored local files, `runtime/tests/scorer/sweep-reports/*/research/*.md` (born 11:45, before this session), in `corpus-manifest.json`. They were moved aside, the index rebuilt, and moved back (sha1 identical before and after), so the manifest adds only the three new docs (23,311 to 23,314 paths). After: `trigger index matches the corpus`, 0 stale, 0 obsolete, with the usual manifest-hash note because the ignored files exist locally | 1, 0, 0 |

## 5. Phase gates from the final state

| Row | Command | Result | Exit | Verdict |
|-----|---------|--------|------|---------|
| P1 | `PATH=<stub dir>:$PATH node $S` with logging `jev` and `cli-deem` stubs (`runs/proof/p1.*`) | census lines per file and split with all five counts, `baseline: holdout_top1=53/70`, four `comparator:` lines, `power: movable=23 decided_ceiling=99 min_wins=16 win_rate_80=0.749`; neither stub log exists; porcelain same; stdout byte-identical to the no-stub census | 0 | PASS |
| P2 | stub `auth status` exit 3 with `JEV_PROVIDER=openrouter`; stub version `jev 0.2.3`; `--deem` with a stub backend; `--deem` with model `deem-1.5` (`runs/proof/p2*`) | `jev: path=... provider=openrouter` then `jev arm skipped: no credential`; `jev arm skipped: version` then `jev: found="jev 0.2.3" path=...`; `deem arm skipped: stub backend`; `deem arm skipped: model` then `deem: found="deem-1.5"`. Each stdout starts with the default stdout byte for byte; stub logs hold only `--version`, `auth status --provider openrouter` or `health` | 0 each | PASS |
| P3 | `grep -nE 'API_KEY\|TYPESAFE' $S`; stub runs passing each gate (`runs/proof/p3*`) | no match; Jev stub log 336 lines, 335 with exactly one `--provider openrouter` (the other is `--version`), no other provider; `cli-deem` stub log 529 lines (1 `health`, 333 `choice`, 195 `noul`), none with `--provider` or a key-like word | 1 (grep), 0, 0 | PASS |
| P4 | `vitest run tests/parity/score-jev-tiebreak.vitest.ts` | before the review fixes `Tests 47 passed (47)`; final `Tests 52 passed (52)` (section 10): missing rerun answer kept out of the sign test, `jev arm stopped: key rejected`, `unmeasured_timeout`, `deem arm stopped: model commit changed mid-run`, the fake-server `--deem` column with `flip=0.1429` and its commit pair | 0 | PASS |
| P5 Jev | `env -u JEV_PROVIDER node $S --jev --out runs/jev` (keyed, provider `official`), 16:10:17 to 16:16:26 | cost line before the first billed call: `jev: payload=routing corpus prompts and skill projection descriptions planned_calls=334 est_input_tokens=76857`; `jev: auth_test provider=official model=jev-1.13.0`; 334 `calls.jsonl` lines, every one with wall time, exit code, provider, model and status (302 measured, 30 abstained, 2 unmeasured on exit 1); latency p50 377 ms, p95 2830 ms; `report.json` with the four conditions | 0 | PASS |
| P5 Deem | `node $S --deem --out runs/deem-review` (live 127.0.0.1:8300, after the orchestrator session restarted the server), 16:59:13 to 17:01:05 | see section 10: health line with the commit pair, cost line, five column lines with the order-flip rate, one `verdict:` line, the calibration line beside 0.9843; 528 `calls.jsonl` lines, every one with backend, model, both commits, wall time, exit code and status; porcelain the same before and after. Earlier attempts kept as evidence: `runs/deem-skipped*` (server down, 16:18), `runs/deem-stopped*` (exit 2 on a duplicate option description, fixed by brief 30), `runs/deem-void*` (full run, verdict VOID: computed with the old flip count) | 0 | PASS |
| P6 | `git status --porcelain` before and after every script run | identical for the census, P1 to P3, the Jev run and the Deem run (`runs/*.pre.txt`, `*.post.txt`) | - | PASS |
| P7 | `validate.sh <phase> --strict`; `check-goal.cjs <phase>` | `Errors: 0 Warnings: 0`, `RESULT: PASSED`; `RESULT: PASSED (5/5 checks)` | 0, 0 | PASS |
| G1 | advisor `vitest run`, full | before the review fixes `Tests 1018 passed \| 6 skipped (1024)`; final (section 10) `Test Files 130 passed (130)`, `Tests 1023 passed \| 6 skipped (1029)`, 197 s, `ps` table 235,189 bytes before, 234,835 after. Delta against baseline: +1 file, +52 tests (the new file), 0 failures | 0 | PASS |
| G1b | advisor `npm run typecheck`; spec-kit `cli/tests/trigger-index.vitest.ts` (`--project cli`) | no diagnostics; `Tests 57 passed (57)` | 0, 0 | PASS |
| G2 | `validate_document.py` on the 9 changed skill docs and the Hermes copy (`logs/final-validate-document.txt`) | all exit 0; `Total issues: 0` on eight, `Total issues: 1` (the fallback note, same as baseline) on the two index files, which print 0 with `--type` | 0 each | PASS |
| G2b | playbook and catalog package validators | playbook `scenarios=48 violations=0 warnings=1` (same warning); catalog 0 fail, 8 warn, the same findings (one line number moved 127 to 128) | 0, 0 | PASS |
| G3 | `ci-skill-root-metadata.cjs`; `sync-skills-hermes.cjs --check`; ratchet `tests/parity/scorer-eval-baseline-ratchet.vitest.ts` after the doc edits; census | `passed=16 failed=0`; `PASS: 73`; `Tests 7 passed (7)`; `baseline: holdout_top1=53/70` before any model run | 0, 0, 0, 0 | PASS |

Verdict lines for the parent log (T042):
- `verdict: kill backend=jev decided=38 wins=11 losses=27 p_win=0.9975 p_loss=0.0069 flip=0.0153 provider=official model=jev-1.13.0`
- Deem (final, section 10): `verdict: kill backend=deem decided=38 wins=8 losses=30 p_win=0.9999 p_loss=0.0002 flip=0.3123 model=deem-0.8-v1 model_commit=8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21 source_commit=c8a5523c5a7ead9a2132363edfcffd1ec86a6dbc`. No `compare:` line printed, because each run had one column.

Jev column, as printed: `rows=111 measured=109 wins=11 losses=27 ties=61 abstentions=10 unmeasured=2 unstable=0`, `movable_wins=11 gold_demotions=21 none_on_gold_in_cluster=7`, `tau03_inside_wins=2 tau03_inside_losses=3 tau03_outside_wins=9 tau03_outside_losses=24`, `mrr=0.7301 right1=64 right3=95 scorer_mrr=0.7771 confidence_mrr=0.7725 always_second_mrr=0.5508 heldout_mrr=0.7091 rerank_mrr=0.7500`. The Jev calibration half did not run: it runs only at `underpowered`, and the census has 23 movable rows.

## 6. Files changed (final `git status --porcelain`, 20 lines)

- Created by executors: `runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` (briefs 01 to 17), `runtime/tests/parity/score-jev-tiebreak.vitest.ts` (01 to 18), `feature-catalog/scorer-fusion/tie-break-eval.md` (22), `manual-testing-playbook/scorer-fusion/tie-break-eval.md` (24), `changelog/v0.13.0.0.md` (27).
- Modified by executors: `runtime/scripts/routing-accuracy/README.md` (20), `runtime/tests/parity/README.md` (21), `feature-catalog/feature-catalog.md` (23), `manual-testing-playbook/manual-testing-playbook.md` (25), `runtime/tests/manual-testing-playbook.vitest.ts` (26), `SKILL.md` (28), `README.md` (29). All under `.skilled/skills/system-skill-advisor/`.
- Regenerated by the orchestrator: `leaf-manifest.json`, `leaf-aliases.json`, `.hermes/skills/system-skill-advisor/SKILL.md`, `system-spec-kit/runtime/data/trigger-index.json` and its three fixtures.
- This scratch folder.

## 7. Deviations

- D-1, parent over child. `runtime/tests/manual-testing-playbook.vitest.ts` is not in `spec.md` Files to Change, so editing it breaks phase criterion 6 (only listed paths change). Parent D6 requires the playbook scenario, and parent criterion 4 requires the suite to fail nothing beyond baseline; that test pins 47 scenarios and fails at 48. The parent wins, so brief 26 changed its six `47`s to `48`.
- D-2, changelog number. The spec says the entry is numbered after `v0.11.1.0.md`, but `main` already carries `v0.11.2.0.md` and `v0.12.0.0.md` (commit `47432cf846`) and its `SKILL.md` reads `0.12.0.0`. A `v0.12.0.0` here would collide on merge, so the entry is `v0.13.0.0` and `SKILL.md` moved 0.11.1.0 to 0.13.0.0. The new docs carry `version: 0.13.0.0` (anchor 0.13, build 0 for a new file).
- D-3, literal text by sidecar. The three new docs are 30 to 95 lines, which cannot fit a brief under 90 lines, so their full literal text sits in `content/` and the briefs had the executor copy it byte for byte (`cmp` exit 0 each).
- D-4, report directories. T016 and T036 say `--out` outside the repository; the build prompt names `scratch/w3-build/runs/`. REQ-006 allows an operator-named directory inside the repository, and the porcelain stayed the same.
- D-5, `--deem` server and runs. The server was down at 16:18 and was not started here; the orchestrator session restarted it. The build prompt allows one live `--deem` run; four ran against the local server (nothing leaves the machine): skipped (down), stopped (exit 2, a script defect fixed by brief 30), VOID (old flip count, per the orchestrator's review) and the final one after the review fixes.
- Interpretation choices, recorded once: the column comparison uses the normal approximation for its one-sided 95% bounds and prints both; a Jev calibration label counts only when all 3 passes return a probability and uses their mean; a stop during the Deem `noul` pass after a finished choice column still leaves that column's verdict line printed.

## 8. Premises that no longer match

- `score-outcome-rerank.mjs:38` imports the outcome-weighted rerank module, which commit `6b99eb68d2a` deleted; T002 cites `:40-51` and `:85-123` of that script. The eval inlines the blend (fused score times a Beta(1, 1) posterior of train-half outcomes).
- Hand-off note: "Deem serves `deem-0.8-v1` on torch with commit pair `8cbabbb` / `7cf293f`". At build time nothing listened on 8300. `~/.local/share/deem/update.log` shows `2026-09-28T12:16:22Z updated: model 8cbabbb, source c8a5523`, and `server.log` ends at 14:16:22 local with a `resource_tracker` shutdown warning; `server.pid` names 28162, which is not running. The source commit is now `c8a5523`. Inferred, not confirmed: the server started by the scheduled update did not outlive that update job.
- `runtime/scripts/routing-accuracy/README.md` tables 2 of the folder's 8 code files and `runtime/tests/parity/README.md` 1 of 6 test files. The build added only its own rows (the code-file count now reads 3, matching its table); the older gaps remain.
- `spec.md` Files to Change omits `runtime/tests/manual-testing-playbook.vitest.ts`, which pins the scenario count (see D-1).

## 9. Open items

1. Closed: the Deem live run finished after the server restart and the review fixes (section 10). Its verdict is `kill`, so no Deem `keep` exists for phase 009 from this phase.
2. Scratch contents: `probe-census.mjs` (planning probe) and `logs/*.pre.*` (pre-dispatch copies used for diffs) are evidence, not build targets; the committing session decides whether to keep them.
3. Cross-family review of the script and test (parent D5) is the orchestrator session's.

## 10. Deem live run, review fixes and final reruns

### First live attempts after the restart

- 16:27:48, `runs/deem-stopped*`: health `model_commit=8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21 source_commit=c8a5523c5a7ead9a2132363edfcffd1ec86a6dbc`, then `deem arm stopped: usage error`, `deem: partial_rows=14`. The stopping call (`rr-iter2-022`, exit 2) sent `memory:save` and `command-memory-save`, an alias pair with one identical projection description, and `cli-deem` refuses two options that share a description (its `buildQuestion`). 16 of the 111 eligible rows carry that pair; Jev maps options by key, so its run was unaffected. The stopped arm printed no verdict.
- Brief 30 (`briefs/30-deem-unique-options.md`, cursor, 110 s): a description shared inside one cluster gets ` [key]` in the Deem arm only. Diff read against pre-copies; `node --check` exit 0; vitest `Tests 48 passed (48)`; an offline check over the real census found 0 of 111 rows still sharing an option description.
- 16:32:10, `runs/deem-void*`: 528 calls, `verdict: kill backend=deem decided=38 wins=8 losses=30 p_win=0.9999 p_loss=0.0002 flip=0.2613 ...`. VOID: the orchestrator's cross-family review found the flip count did not match the fixed Keep Rule (P0 below). Output kept.

### Review fixes (cross-family review, VERDICT: FAIL)

| Fix | Brief | Executor | Change | Check |
|-----|-------|----------|--------|-------|
| P0 flip count | `briefs/31-flip-unstable.md` | cursor, 124 s | a row with three different answers counts 3 non-modal answers, not `3 - maxFreq` = 2; new case: 25 rows, 22 unanimous wins and 3 three-way splits give `flip` 0.1200, flip condition not held, not `keep`; fake-server assertion 0.0952 to 0.1429 | diff read; `node --check` 0; vitest `49 passed (49)` |
| P1 Deem verdict after calibration | `briefs/32-deem-verdict-after-calibration.md` | cursor, 106 s | Deem column lines and verdict print only after the `noul` pass completes; new stub case: `noul` exit 3 gives `deem arm stopped: backend refused`, no `verdict:` or `column:` line, `report.json` `columns: {}` and `stopped.deem` set | diff read; `node --check` 0; vitest `50 passed (50)` |
| P1 retry record | `briefs/33-retry-record.md` | cursor, 284 s | an exit-4 first attempt is written to `calls.jsonl` (status `unmeasured`) and its wall time enters p50/p95, for Jev and, by the same field, Deem; the Jev case now expects 6 lines for the all-exit-4 row and `calls.jsonl` choice lines equal the stub log's 21; new case: a retried 1000 ms attempt sets p95 to 1000 | diff read; `node --check` 0; vitest `51 passed (51)` |
| P2 `--jev` needs `--out` (moved by brief 35, section 11) | `briefs/34-jev-needs-out.md` | cursor, 170 s | `--jev` without `--out` returns 2 before any call; gate tests and one arm test now pass `--out <tmp>`; new case pins the refusal with an empty stub log | diff read; `node --check` 0; vitest `52 passed (52)`; CLI check `node $S --jev` with a logging stub: exit 2, `--jev needs --out <dir> so every billed call is recorded`, empty stdout, no stub log |

The keyed Jev run needs no rerun. Its `calls.jsonl` has no exit 4, and timing rules out a hidden retry (under the old code a retried first attempt left no line): the file's first to last write spans 364 to 366 s, the recorded wall times after the first line sum to 364.4 s, and one hidden retry would add at least 2.3 s (2 s backoff plus a first attempt). Recomputing the Jev column from its `calls.jsonl` with the fixed code gives the printed verdict line byte for byte (`runs/jev-recheck.txt`); it has no three-way rows (`unstable=0`).

### Final reruns (after brief 34)

| Check | Result | Exit |
|-------|--------|------|
| `vitest run tests/parity/score-jev-tiebreak.vitest.ts` | `Tests 52 passed (52)` (`logs/34.vitest.txt`) | 0 |
| advisor full `vitest run` | `Test Files 130 passed (130)`, `Tests 1023 passed \| 6 skipped (1029)`, 197 s; `ps` 235,189 bytes before, 234,835 after (`logs/final3-advisor-vitest.*`) | 0 |
| advisor `npm run typecheck` | no diagnostics | 0 |
| `grep -nE 'API_KEY\|TYPESAFE' $S` | no match | 1 |
| default run (`runs/p1-review.*`) | census byte-identical to the first default run; porcelain the same | 0 |
| proof P1 to P3 with stubs (`runs/proof/`, earlier set in `runs/proof-before-review/`) | same results as section 5; the Jev stub runs now pass `--out` | 0 each |

### Final live Deem run, 16:59:13 to 17:01:05 (`runs/deem-review*`)

Full stdout (the ten census lines are byte-identical to the default run and not repeated):

```text
deem: health backend=torch model=deem-0.8-v1 model_commit=8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21 source_commit=c8a5523c5a7ead9a2132363edfcffd1ec86a6dbc
deem: nothing leaves the machine planned_calls=528 est_wall_s=34.6 unmeasured_over25=0
column: backend=deem rows=111 measured=111 wins=8 losses=30 ties=44 abstentions=12 unmeasured=0 unstable=17
column: backend=deem movable_wins=8 gold_demotions=24 none_on_gold_in_cluster=9 p_win=0.9999 p_loss=0.0002 flip=0.3123
column: backend=deem tau03_inside_wins=1 tau03_inside_losses=6 tau03_outside_wins=7 tau03_outside_losses=24
column: backend=deem mrr=0.7015 right1=60 right3=97 scorer_mrr=0.7811 confidence_mrr=0.7766 always_second_mrr=0.5498 heldout_mrr=0.7047 rerank_mrr=0.7588
column: backend=deem latency_p50_ms=241 latency_p95_ms=340
verdict: kill backend=deem decided=38 wins=8 losses=30 p_win=0.9999 p_loss=0.0002 flip=0.3123 model=deem-0.8-v1 model_commit=8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21 source_commit=c8a5523c5a7ead9a2132363edfcffd1ec86a6dbc
calibration: backend=deem n=195 measured=195 accuracy=0.4974 f1=0.4432 brier=0.4217 ece5=0.4137 temperature=10.00 archived_f1=0.9843
```

- Commit pair: model `8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21`, source `c8a5523c5a7ead9a2132363edfcffd1ec86a6dbc`, the same on all 528 call lines.
- Keep Rule (spec section 4), in order: 38 decided rows (not `underpowered`); P(X >= 30 losses) = 0.0002 <= 0.05, so `kill`. None of the four keep conditions held (`report.json`: sign 0.9999, MRR 0.7015 below every comparator, right@3 97 below the scorer's 99, flip 0.3123 above 0.10). Not a `keep`.
- R21 Deem half: 195 of 195 labels measured, accuracy 0.4974, F1 0.4432, Brier 0.4217, 5-bin ECE 0.4137, fitted temperature 10.00 against the archived F1 0.9843. The fit sits at the top of its 0.05 to 10.00 grid, so the true optimum is at or beyond 10: the raw `noul` probabilities carry close to no signal for this question.
- Records: 528 `calls.jsonl` lines (333 choice, 195 `noul`), all exit 0 (483 measured, 45 abstained), no missing field. Every answer is identical to the VOID run's, so the change in `flip` (0.2613 to 0.3123) comes from the fixed count alone: 17 unstable rows, one extra flip each, over 333 calls.
- `git status --porcelain` identical before and after; `server.log` grew 745 to 1274 lines (1 health plus 528 decisions).

## 11. Review round 2 (one new P1)

The P1, confirmed by the orchestrator session: brief 34 put the `--out` refusal before the census and the Jev gate. A run where Jev is unavailable then exited 2 with only the refusal, which broke parent D1 (dormant means today's behavior), REQ-002, criterion 2 and playbook step 3.

| Fix | Brief | Executor | Change | Check |
|-----|-------|----------|--------|-------|
| P1 refusal placement | `briefs/35-out-refusal-after-gate.md` | cursor, 181 s | the refusal now sits after `jevGate` and fires only when the gate passed and the census allows billed calls (`ok` or `underpowered`) and `--out` is missing; a failed gate keeps census, skip lines and exit 0 with or without `--out`; the three gate tests run without `--out` again; the refusal test now spawns the script with a passing stub gate and expects exit 2, the message on stderr, the census on stdout and a stub log of only `--version` and `auth status --provider openrouter` | diff against `logs/35.pre.*` shows only the brief's edits; porcelain line set unchanged |

"Zero stub calls" is read as zero billed calls: the refusal comes after the gate, so the gate's two unbilled checks (`--version`, `auth status`) still run.

Final-state checks:

| Check | Command | Result | Exit |
|-------|---------|--------|------|
| Syntax | `node --check $S` | no output | 0 |
| Eval test file | `vitest run tests/parity/score-jev-tiebreak.vitest.ts` | `Tests 52 passed (52)` (`logs/35.vitest.txt`) | 0 |
| Default run | `env -u JEV_PROVIDER node $S` (`runs/p1-r2.*`) | census byte-identical to the first default run; stderr empty; porcelain the same | 0 |
| Repro, Jev unavailable | `PATH=/usr/bin:/bin:<node-only dir> node $S --jev </dev/null` (`runs/repro35b.*`) | census, then `jev: path=none provider=official`, `jev arm skipped: jev not on PATH`; stderr empty; porcelain the same | 0 |
| Repro as literally written | `PATH=/usr/bin:/bin:$(dirname $(command -v node)) node $S --jev </dev/null` (`runs/repro35-jev-on-path.*`) | on this machine `node` lives in `~/.local/bin`, which also holds `jev`, and the `official` key is stored, so the gate passes: census, `jev: path=/Users/michelkerkmeester/.local/bin/jev provider=official`, then stderr `--jev needs --out <dir> so every billed call is recorded`. That is the intended refusal for a passing gate, and no billed call is made; a symlink-only node dir was used for the row above | 2 |
| Advisor suite, full | `vitest run` (`logs/final4-advisor-vitest.*`) | `Test Files 130 passed (130)`, `Tests 1023 passed \| 6 skipped (1029)`, 199 s; `ps` table 222,592 bytes before, 223,405 after; against the 971 / 6 baseline: +52 tests, 0 failures | 0 |
| Typecheck | `npm run typecheck` | no diagnostics | 0 |

The live Deem verdict of section 10 stands: brief 35 changes only the `--jev` path in `main`.

## 12. Open items added by review round 2 (recorded, no code change)

4. Keep Rule question, settle before any Deem rerun on a new commit pair (reviewer P2 a). Brief 30 gives the alias pair `memory:save` and `command-memory-save` distinct option text, and the modal pick counts them as separate answers. Counting alias-equivalent picks as one answer changes the Deem column. The reviewer reports unstable 17 to 13, flip 0.3123 to 0.2643, verdict still kill 38/8/30. An offline recount here from `runs/deem-review/calls.jsonl` (`runs/p2a-alias-check.txt`, canonical key through `mergedSkillForAlias`) agrees on unstable 13 and flip 0.2643 but gives `decided=37 wins=8 losses=29 p_loss=0.0004`: still `kill`. The difference in decided rows is UNKNOWN until one canonicalization rule is fixed in the Keep Rule.
5. Open test gap (reviewer P2 b): the brief 30 case's stub `cli-deem` ignores option text, so it proves the `[key]` suffix reaches the argument list but not that the real client accepts the options or maps the answer back. The fake-server test uses distinct descriptions and does not cover it either.
