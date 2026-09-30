# Build evidence: 017-deem-search-narrowing-arm

Build orchestrator leaf, 2026-09-28, worktree `069-cli-jev-workflow-integration`. HEAD at the start was `64968e9b58`; phase 002's follow-up commits moved it to `996cf85eef` during the build. Nothing here is committed. Paths below are relative to the worktree root, and `W` means `specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build`.

## 1. Result

- Zero-call run: `headroom: a 10-point gain fits above 68/256`, so the live Deem run went ahead.
- Live Deem run: `verdict deem: stop (margin) K=256 M=256 A=10 B=68 W=5 L=63 F=461 p=1.000 model=deem-0.8-v1 model_commit=8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21 source_commit=c8a5523c5a7ead9a2132363edfcffd1ec86a6dbc`. A stop keeps phase 009 Planned (parent D4).
- No live `--jev` run: T018 closes as "not requested". The Jev arm is proven on stubs only.

## 2. Files changed

| File | Change | Brief | Executor |
|---|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` | Create, 2,051 lines | 01 to 12 | cursor (01 to 05), devin (06 to 12) |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts` | Create, 1,244 lines, 33 tests | 01 to 12 | cursor (01 to 05), devin (06 to 12) |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` | Modify, +4/-2 | 13 | pi |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modify, +3/-1 (version 4.1.3.0 to 4.2.0.0, one sentence) | 14 | pi |
| `.skilled/skills/system-spec-kit/README.md` | Modify, +5 | 15 | pi |
| `.skilled/skills/system-spec-kit/changelog/v4.2.0.0.md` | Create | 16 | pi |
| `.skilled/skills/system-spec-kit/feature-catalog/retrieval/track-narrowing-measurement.md` | Create, then one rewording | 17, 22 | pi |
| `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` | Modify, +16 (index block under section 8) | 18 | pi |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/track-narrowing-measurement.md` | Create (scenario 459), then one line naming the switches | 19, 21 | pi |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` | Modify, +1 row in section 7.8 | 20 | pi |

The orchestrator wrote only under `W`: briefs, content files, logs, run output, `runs/live-deem.sh` and this file. The two-file stub `cli-deem` and `jev` dirs of the zero-call runs were removed after their checks.

## 3. Briefs and dispatches

23 briefs, 24 dispatches. By executor: cursor 5 plus 1 killed attempt, devin 8, pi 10, pi-fallback 0. Dispatches 01 to 22 ran before the operator's roster change of 2026-09-28 20:30 local, on the old routes: cursor on grok-4.7-xhigh-fast, devin on deepseek-v4-1-flash-max and pi on Cline DeepSeek v4.1 flash xhigh. The `.status` lines of that time record no model. Brief 23, the review fix, ran after the change on devin (`model=deepseek-v4-1-flash-max` in its `.status`). Neither the retired cursor route nor the new pi route on `llmgateway/mimo-v2.6-pro` was used. Each brief is 56 to 73 lines, carries the shared blocks and an `Accept when` line. After every dispatch the orchestrator diffed `git status --porcelain` against the pre-dispatch copy and ran the brief's own check.

| Brief | Executor | Seconds | Orchestrator check after it |
|---|---|---|---|
| 01 test set | cursor | 450 | focused vitest 3 passed |
| 02 lookup baseline | cursor | 290 | 5 passed |
| 03 ripgrep baseline | cursor | 211 | 7 passed |
| 04 baseline summary | cursor | 248 | 9 passed |
| 05 probes | cursor | 212 | 10 passed |
| 06 verdict, attempt 1 | cursor | 1,385, killed (exit 143) | no file changed |
| 06 verdict | devin | 354 | 15 passed |
| 07 default entry point | devin | 567 | 18 passed |
| 08 Deem gate | devin | 477 | 21 passed |
| 09 Deem arm | devin | 530 | 24 passed |
| 10 report.json and requalify | devin | 595 | 27 passed |
| 11 Jev gate | devin | 130 | 30 passed |
| 12 Jev arm | devin | 352 | 33 passed |
| 13 retrieval README | pi | 104 | grep 3, validate_document exit 0 |
| 14 SKILL.md | pi | 48 | greps 1 and 1, exit 0 |
| 15 skill README | pi | 50 | grep 1, exit 0 |
| 16 changelog | pi | 35 | cmp exit 0, exit 0 |
| 17 catalog entry | pi | 22 | cmp exit 0, exit 0 |
| 18 catalog index | pi | 133 | grep 1, exit 0 |
| 19 playbook scenario | pi | 27 | cmp exit 0, exit 0 |
| 20 playbook index | pi | 26 | grep 1, exit 0 |
| 21 playbook switches | pi | 22 | cmp exit 0, exit 0 |
| 22 catalog wording | pi | 26 | cmp exit 0, exit 0 |
| 23 early `--out` refusal (review P1) | devin | 94 | node --check exit 0, grep 2, focused vitest 33 passed |

Re-dispatches:
- **06 moved from cursor to devin.** The cursor run sat 23 minutes at 0 CPU with no output and no file change, so it was killed (PID 64224) and redispatched to devin. Every later code brief went to devin.
- **21 was added after the playbook check.** REQ-014 asks every doc to name both switches, and scenario 459 named neither.
- **23 fixed the cross-family review's P1.** `--deem` or `--jev` without `--out` was refused only after the zero-call report and a passing gate, so gate spawns reached the stub log and a failing gate exited 0. Spec REQ-008 and AC-008 want exit 2 before any call. The cause was the session's brief, which pointed at phase 002's pattern. The check now sits right after `parseArgs`, the two late checks are gone, and both vitest refusal cases assert exit 2, the stderr line, empty stdout and no stub log.
- **22 was added after the full-suite failure.** `tests/workflow-invariance.vitest.ts` bans the bare word "manifest" on catalog and playbook surfaces, and catalog line 32 said "index manifest hash". The line now reads `manifestHash`.

## 4. Checks

| Check | Result line | Exit |
|---|---|---|
| `node --check .../score-track-narrowing.mjs` | no output | 0 |
| `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' .../score-track-narrowing.mjs` | no match | 1 |
| Comment-hygiene grep for REQ, task, phase or packet ids in both code files | no match | 1 |
| Focused vitest `tests/score-track-narrowing.vitest.ts` (after brief 23) | `Tests 33 passed (33)` | 0 |
| Real-tree refusal after brief 23: `node S --deem` and `node S --jev`, stub `cli-deem` and `jev` first on `PATH` | stdout 0 bytes, stderr `--deem needs --out <dir> so every call is recorded` and `--jev needs --out <dir> so every call is recorded`, stub log absent | 2 each |
| Doc grep for a refusal said to follow the gate, over the 6 narrowing docs | no such line; the only `refus` hit is the retrieval README line 83 about the index generator | n/a |
| Full `cli` vitest, attempt 1 (before brief 22) | `Tests 1 failed \| 1601 passed \| 19 skipped (1621)`, the one failure being workflow-invariance | 1 |
| `tests/workflow-invariance.vitest.ts` + `tests/playbook-provenance-paths.vitest.ts` after brief 22 | `Tests 5 passed (5)` | 0 |
| Full `cli` vitest, attempt 2 (under load) | `Tests 1 failed \| 1601 passed \| 19 skipped (1621)`, the one failure being `progressive-validation.vitest.ts` T-PB2-07d `Test timed out in 120000ms` | 1 |
| `tests/progressive-validation.vitest.ts` alone | `Tests 52 passed (52)` | 0 |
| Full `cli` vitest, attempt 3 (before brief 23) | `Test Files 157 passed \| 3 skipped (160)`, `Tests 1602 passed \| 19 skipped (1621)`, 356.5 s | 0 |
| Full `cli` vitest, final (after brief 23) | `Test Files 157 passed \| 3 skipped (160)`, `Tests 1602 passed \| 19 skipped (1621)`, 361.9 s | 0 |
| `validate_document.py` on 8 changed skill docs | all `VALID`; the two index files keep the `document_type_fallback` warning they had at baseline | 0 each |
| `validate-playbook-package.cjs --package system-spec-kit` | `PASS ... scenarios=85 ... violations=0 warnings=1` | 0 |
| `validate_catalog_package.py --package system-spec-kit` | `WARN tier=warn violations=85` (0 fail, 85 warn) | 0 |
| `ci-skill-root-metadata.cjs` | `checked=16 passed=16 failed=0` | 0 |
| `sync-skills-hermes.cjs --check` | `DRIFT system-spec-kit`, `FAIL: 1 drifted` (expected, open) | 1 |
| `generate-trigger-index.mjs --check` | stale: `changelog/v4.2.0.0.md`, `feature-catalog/retrieval/track-narrowing-measurement.md`, `002-advisor-jev-tiebreak-arm/implementation-summary.md` (expected-stale) | 1 |
| `validate.sh <phase> --strict` | `Errors: 0  Warnings: 0`, `RESULT: PASSED`; `git status` unchanged by it | 0 |
| `git diff --stat -- runtime/data retrieval/lib retrieval/fixtures .skilled/hooks AGENTS.md` | empty | 0 |

## 5. Baselines and deltas

| Gate | Baseline (before the first dispatch) | Final | Delta |
|---|---|---|---|
| `cli` vitest project | 156 files passed, 3 skipped; 1,569 tests passed, 19 skipped; exit 0; 7m47s | 157 files passed, 3 skipped; 1,602 tests passed, 19 skipped; exit 0 | +1 file, +33 tests, 0 new failures |
| Trigger index `--check` | exit 0 at `64968e9b58`; a scratch rebuild matched the committed index (12,386 paths) | exit 1, three stale docs | expected-stale, see section 8 |
| Playbook package | PASS, scenarios=84, warnings=1 | PASS, scenarios=85, warnings=1 | +1 scenario |
| Catalog package | 85 warn, 0 fail | 85 warn, 0 fail | none |
| Skill root metadata | 16/16 | 16/16 | none |
| Hermes copies | PASS 73 in sync | DRIFT system-spec-kit | +1 drift, open |
| validate_document, 5 existing docs | exit 0 each | exit 0 each, plus 3 new docs exit 0 | none |

## 6. Runs

| Run | Code | Result |
|---|---|---|
| `runs/zero-call-prelim` | after brief 08 | exit 0, wall 2,452.7 s under load, no stub call |
| `runs/zero-call-final-attempt1` | final | exit 2: `ripgrep failed on deleted: rg: specs/.repair-fixture-jDjTf6: No such file or directory`. The full `cli` suite ran at the same time and removed its temp fixture mid-walk. Rerun alone |
| `runs/zero-call-final` | final | exit 0, wall 1,944.1 s, `calls.log` absent in the stub dir, `git status` unchanged, stdout byte-identical to the prelim |
| `runs/deem-live-1` | sha `b9197509bacbc4db4cd1ca5c256c84405e73c5fe03696e38ef8a1bdeb29d9eb5` | 18:26:14Z to 19:02:58Z, exit 0, wall 2,202.0 s |

The zero-call and live runs used script sha `b9197509...`, which predates brief 23. Brief 23 changes only the refusal for a missing `--out`: the zero-call path and the arm logic are unchanged, and a run with `--out` never reached the removed checks. So the runs were not repeated, and the verdict stands; the reviewer reproduced `stop (margin)` K=256 M=256 A=10 B=68 W=5 L=63 F=461. The script sha after brief 23 is `594e3eff87f589f4bfc56192e593f9426683fcbd029d3b93b8e0000114165dad`.

Zero-call output, both final runs: `index manifestHash: fdebd12ad1be6133cd344556b5bcdc81ce8736127474d99919f70150342ca67f` (equal to the committed index's `manifestHash`), `test set: tracks=16 kept=256 usable=1727 placeholder=67 leak=185 residual=49`, `baseline lookup: 17/256 right (0.0664)`, `baseline ripgrep: 68/256 right (0.2656)`, `baseline method: ripgrep 68/256 right`, `margin: 0.10`, `keep rule: coverage 10*M >= 9*K, margin 10*(A-B) >= M, sign test p < 0.05, flips 10*F <= 3*M`, `options: 17 sha256=5562c17ce61772689d2ddcbb87a7ebf2513f6aa397ae714e206f746f4727bc7f`, `headroom: a 10-point gain fits above 68/256`, `planned calls: 810 per arm, 256 rows and 14 probes in 3 orders each`, `paraphrase probes: total=20 gold-less=6 lookup=0/14 ripgrep=8/14`.

Live Deem run:
- The hold rule passed: `git status --porcelain -- specs/` showed only `W`.
- `cli-deem health` before and after printed the same pair: `{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21","source_commit":"c8a5523c5a7ead9a2132363edfcffd1ec86a6dbc"}`. The pair did not change, so one run stands.
- Arm lines: `deem: nothing leaves the machine; planned calls: 810; estimated wall time: 53.1 s at 65.6 ms per call, the 2-option p50 from deem-local.md`, then `column deem: rows=256 measured=256 unmeasured=0 unstable=209 abstained=0 flip_rate=0.6003 latency_p50_ms=703 latency_p95_ms=728`, the verdict line in section 1, and `paraphrase probes: total=20 gold-less=6 lookup=0/14 ripgrep=8/14 deem=0/14`.
- `out/calls.jsonl`: 810 lines (768 test, 42 probe), all `measured`, exit 0, attempt 1, 0 lines missing `wallMs`, `exitCode`, `modelId`, `modelCommit` or `sourceCommit`. 270 row ids each hold orders 0, 1 and 2, and every line carries the pair above.
- `out/report.json`: `options: 17`, a 64-hex `optionSetSha256` equal to the stdout hash, `columns.deem.line` equal to the stdout verdict line, `modelCommit` and `sourceCommit` equal to the health pair, `requalify.deem: null`.
- `git status --porcelain` was the same before and after the run.

## 7. Proof plan

| Row | Command or evidence | Result |
|---|---|---|
| Goal 1: default run | `runs/zero-call-final`: exit 0, prints `baseline lookup:`, `baseline ripgrep:`, `margin: 0.10`, `planned calls:`; the stub `cli-deem` and `jev` logged nothing | PASS |
| Goal 2: stub skips byte-identical | vitest `skips a stub backend with the rest of the output byte-identical` and `prints the jev path and provider official first, then skips with no credential` (fixture corpus) | PASS |
| Goal 3: vitest file | 33 passed, 0 failed, exit 0 | PASS |
| Goal 4: live Deem verdict and calls.jsonl | `verdict deem: stop (margin) ...`; 810 lines with all five fields | PASS |
| Goal 5: no key, one provider | grep exit 1; vitest `runs every jev call under one provider and prints keep on stub answers` | PASS |
| Goal 6: changed paths | final `git status --porcelain` lists only the ten files in section 2 plus `W` | PASS |
| Goal 7: strict validation | `RESULT: PASSED` | PASS |
| AC-001 | as goal 1, status unchanged by the run | PASS |
| AC-002 | vitest test-set and own-folder cases; real tree keeps at most 20 per track | PASS |
| AC-003 | same denominator 256; `manifestHash` equals `node -p "require('./.skilled/skills/system-spec-kit/runtime/data/trigger-index.json').manifestHash"` | PASS |
| AC-004 | vitest verdict cases: keep, margin, coverage, sign test and flips | PASS |
| AC-005 | vitest stub-backend case on the fixture corpus, not on the real tree | PASS |
| AC-006 | status as goal 6; protected-path diff empty | PASS |
| AC-007 | 3 orders per row in `calls.jsonl`; `options: 17`, 64-hex hash | PASS |
| AC-008 | notice and planned calls print first; every call recorded; after brief 23, `--deem` or `--jev` without `--out` exits 2 with no stdout and an empty stub log (vitest and real-tree check) | PASS |
| AC-009 | report pair equals the start health pair; requalify vitest cases pass | PASS |
| AC-010 | probe line has gold-less count and hits per method; verdict does not read probes (keep with 0 probes and with 1 probe) | PASS |
| AC-011 | 33 passed | PASS |
| AC-012 | vitest Jev gate cases | PASS |
| AC-013 | grep exit 1; stub Jev log one provider. The fixture sends 3 `-o` pairs; the real set is 17 per `report.json` | PASS |
| AC-014 | `score-track-narrowing` found in all five docs, `track-narrowing-measurement` in both index files, validate_document exit 0 | PASS |

## 8. Deviations and stale premises

Deviations, each with its reason:
- **Resolved by brief 23: the late `--out` refusal.** The build first followed the brief's phase-002 pattern and refused after a passing gate, against REQ-008 and AC-008. The review flagged it as P1, and it now refuses before any output or call.
- **New skip lines.** `deem arm skipped: no headroom` and `jev arm skipped: no headroom` print when the zero-call run leaves no headroom.
- **Planned calls include probes.** They are `3*(K+P)` = 810, because the gold-bearing probes are asked too so the probe line can report model hits (REQ-010). REQ-008 says "rows times 3" (768).
- **Wall time goes to stderr** so stdout stays byte-identical run to run (NFR-R01).
- **The script is 2,051 lines** against the 450 to 550 LOC estimate (`spec.md:111`), with JSDoc on every export.
- **Version and changelog.** SKILL.md goes 4.1.3.0 to 4.2.0.0 with changelog `v4.2.0.0.md`, a minor bump for a new feature under sk-create-changelog's rules, matching how the last release moved SKILL.md.
- **Skill README gets a four-line paragraph**, not "one line" (`spec.md:115`). The file wraps at 100 columns, and REQ-014 needs the name, the default and both switches.
- **Retrieval README says "All six scripts"** instead of "All five", to stay true.
- **New docs came from literal content files.** The orchestrator wrote them under `W/briefs/content/` to sk-doc's templates, and pi copied them byte for byte (cmp exit 0). This kept every brief under 90 lines.
- **Scenario 459 proves the stub-backend skip through the vitest case**, since the playbook runs real commands and the stub is the thing under test.
- **Baselines were captured to `W/baseline/` before the first dispatch.** This file was written at the end.
- **The coordinator widened the hold rule mid-build.** Any path under a `/scratch/` directory is now exempt, and `runs/live-deem.sh` matches. The live run had already passed the stricter rule, when `git status --porcelain -- specs/` showed only `W`.
- **The brief had the Deem updater schedule wrong (a session error, `017-build-prompt.md:52`).** It said :15 past 00/06/12/18Z; the launchd job actually fires near 20:27Z and 02:27Z. The coordinator corrected it mid-build, and `runs/live-deem.sh` now holds from 20:17Z to 20:37Z and from 02:17Z to 02:37Z. The live run was 18:26Z to 19:03Z, with the pair unchanged.

Stale premises:
- **`spec.md:119` "The fresh index from phase 010".** The index is now stale by three docs: phase 002's `implementation-summary.md` (changed by commits after `64968e9b58`) and this phase's two new docs.
- **`spec.md:232` NFR-P02 "about 777 calls at 65.6 ms is about 51 s".** The real figures are 810 calls, p50 703 ms and p95 728 ms, about 9.5 minutes of calls. The 65.6 ms 2-option p50 does not hold at 17 options plus a node spawn per call.
- **`spec.md:231` NFR-P01 ripgrep cost UNKNOWN.** It is now measured: 1,944 s alone and 2,453 s under load.
- **`acceptance-criteria.md:73` (AC-014) and `tasks.md:72` (T022) name `.skilled/skills/sk-doc/scripts/validate_document.py`.** The validator is `.skilled/skills/sk-doc/shared/scripts/validate_document.py`.
- **`goal.md` stratification estimate of about 259 rows.** The build counts 256 kept, 1,727 usable, 67 placeholder and 185 leak.

## 9. Open items

- **Cross-family review of the code** ran with verdict FAIL on one P1, now fixed by brief 23. A re-review of the fix is the session's call.
- **The Hermes copy is back in sync.** Someone outside this build regenerated `.hermes/skills/system-spec-kit/SKILL.md`, and `sync-skills-hermes.cjs --check` now prints `PASS: 73 Hermes skill copies in sync` (exit 0). This build did not write that file.
- **The trigger index and its fixtures stay stale** until the session rebuilds them from committed content after the commit.
- **T018, a live `--jev` run, was not requested.**
- **Phase docs are untouched.** `tasks.md`, `acceptance-criteria.md` statuses, `implementation-summary.md` and the `goal.md` log still need updating, and the verdict line in section 1 goes in the goal log.
- **P2 finding, the ripgrep baseline aborts (exit 2) when a directory under `specs/` vanishes mid-run.** Never run the tool alongside the `cli` suite.
- **Load-driven flake, T-PB2-07d.** `progressive-validation.vitest.ts` timed out once while the machine was loaded (load average above 9). The file passed alone (52/52) and in the final full run.
- **Finding, Deem answers by option position.** Order 0 picks `agents` on 238 of 256 rows, order 1 mostly `hooks` or `cli-external-orchestration`, and order 2 picks `cli-jev` on 208. That gives 209 unstable rows and a flip rate of 0.6003. It is recorded here and nothing was tuned.
- **Note, `report.json` p is a float rendering** (`0.9999999999999971`); the keep decision uses the exact BigInt comparison.
- **P2 review nit, inside `jevGate` a local `path` shadows the `node:path` import.** It has no effect today.
- **Cross-family review P2s, recorded open, not fixed (parent D5):**
  - Planned calls are 810, not 768. Amend REQ-008 and NFR-P02 at closure.
  - Reusing an `--out` dir truncates the earlier `calls.jsonl` and `report.json` (`score-track-narrowing.mjs:1244`, `:2042`, line numbers from the review).
  - A recheck that fails on model or backend prints `server gone` (`:1358`).
  - The stub-backend and wrong-model stubs exit 0, while the real `cli-deem` exits 3 (`score-track-narrowing.vitest.ts:727`, `:754`).
  - No test covers a Deem exit-4 passing recheck, `server gone`, the Jev exit-4 backoff or the 90 s timeout. The stub Jev run sends 3 options, not 17.
- **The review's one P1 is fixed by brief 23**, and no P0 or P1 is open.
- **Nothing is committed or pushed.**
