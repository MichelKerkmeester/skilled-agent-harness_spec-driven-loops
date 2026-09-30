# 030 session evidence: verification, review and commit

The orchestrator session's record for phase 030. The session wrote every brief, ran the proof plan from the final state itself and made the commits. No Claude leaf wrote a file (parent D5). The run-by-run notes are `notes.md` beside this file, and the facts the docs were written from are `docs/facts.txt`.

## 1. Build

- Design and rulings: `../w4-build/design.md` (DeepSeek V4.1 Flash on Cline, after Devin's quota ran out) and `../w4-build/rulings.md`.
- Code steps c1 to c9 and every code fix ran on DeepSeek V4.1 Flash through Cline (`--thinking xhigh`).
  - c1 wrote the fixtures and the three walker tests first, as design step C1 says, so its check failed 3 of 3 (`walkRuns is not a function`) until c2.
  - c7 failed 2 of 28 with `summarizeColumn is not defined`: step C7's Jev arm calls a function step C9 adds. As in 027, c8 and c9 ran with no per-step check, then the test file once: `Tests 39 passed (39)`.
  - Session finding carried from 033: `spawnSync` stops at a 1 MB `maxBuffer` by default, and `git ls-files -z` prints 15.7 MB on this repository. Fix `c10f` sets `maxBuffer` on the listing call, with the check on (exit 0).
- Docs ran on Pi `llmgateway/mimo-v2.6-pro` at `high`, each written from the facts file.
  - The three new files first, while 029's docs were in review, since they share no file with 029: runtime changelog v1.9.0.0, F059 and DLR-059, each `version: 1.9.0.0`.
  - The shared-file steps D1, D2, D3 and both index steps after 029's commit `2239858286`.
  - Step D7, the version pass, did not run. Ruling 3 runs it only when `parent-skill-check.cjs` reports `13b-version`, and it reports `PASS: 13b-version: SKILL.md version 3.0.1.0 matches the newest changelog entry`. The hub version stays as it was.

## 2. Session verification from the final state

Logging stubs for `jev` and `cli-deem` were first on `PATH`, and every output went to the session scratchpad (`$SP/w4v/030f-proof`). These runs used the staged code, after every fix.
- The default run exits 0 in 1 s: `runs: research=57 review=46`, `pairs: research=19 review=105`, the class lines, four `merge decisions:` lines, the `title rule:` and `body fields:` lines, `merge undecidable: 12` and `stop: fewer than 40 labeled pairs`. The stub log was never written.
- `--deem --out <dir>` and `--jev --out <dir>` each add only `deem arm skipped: label gate` or `jev arm skipped: label gate`, call no stub, and write only `report.json`.
- `--deem` without `--out` exits 2 with `--deem needs --out <dir> so every call is recorded`, before any call and with no stdout.
- `--write-pair-sheet ./.pair-sheet.jsonl` exits 2 with `refusing to write the pair sheet inside the repository` and writes no file. Outside the repository the sheet holds 60 rows (the earlier run in `$SP/w4v/030`).
- `git status --porcelain` was equal before and after. The key grep exits 1. The comment hygiene checker exits 0 on the script and its test. `fanout-merge.cjs` is unchanged.
- Proof 2's 39-row label fixture and the stub-backend and exit-3 runs past the gate need label files the session does not write (parent D4). The tests cover them.
- Tests: `score-fanout-pairs.vitest.ts` prints `Tests 42 passed (42)`.
- Runtime suite with the staged state (`npx vitest run tests/unit/` from `runtime`), 1,116 s: `Test Files 128 passed (128)`, `Tests 2531 passed (2531)`. After 029 it held 127 files and 2,489 tests, so this phase adds one file and its 42 tests and no failure.
- All eight docs pass `validate_document.py` (exit 0), the two indexes with `--type feature_catalog` and `--type playbook`.

## 3. Cross-family review

Read-only, split by author family. The SHA-1 over each review's files was equal before and after every run.

- **Code, reviewed by Pi MiMo** (683 s, `review-code-pi.md`): `VERDICT: FAIL`, 1 P0, 1 P1 and 4 P2.
  - P0: `mergeDecision` read a one-side drop as `same`. The merge also returns one finding when it drops one side before comparing (a review finding not `active`, or a finding with no id or title). Fix `c11f` asks the merge about each side alone first and returns `undecidable` when either side does not survive alone, and `c11g` adds the test. On the real tree all nine `same` decisions were one-side drops: the cross-body review line moved from `same=9 different=93` to `same=0 different=93` under both settings, and `merge undecidable` from 3 to 12.
  - P1: no test ran the requalify lines. `c11h` and `c11i` add one test per arm, with a stored identity that differs and one that does not.
  - Recheck, Pi MiMo (270 s): `VERDICT: PASS`, both closed, no new P0 or P1.
- **Docs, reviewed by DeepSeek on Cline** (380 s, `review-docs-ds.md`): `VERDICT: FAIL`, 2 P1 and 4 P2, REQ-011 not met.
  - P1: the hub `SKILL.md` fan-out sentence named neither the label gate nor a switch.
  - P1: the `runtime/scripts/README.md` row named the switches but not the gate.
  - Fix `f1` (MiMo, 118 s) names the 40-pair and 10-cross-body gate, the stop lines, `--jev`, `--deem` and `--out <dir>` in both.
  - Recheck, DeepSeek on Cline (109 s): `VERDICT: PASS`, both closed, REQ-011 met across all six docs it names, the other replay sentences byte-identical to HEAD.

P2 findings, recorded, not chased (parent D5):
1. `C = expected * M` leaves out the measured calls of a partly measured pair, where the Keep Rule says C is the column's measured calls (both reviews).
2. `nearestRank` is exported with no caller and no test.
3. The test helper `labeledFixture` is never called.
4. The Jev withholding check proves the registry paths exist at `origin/main`, but the text sent is read from the working tree, so a tracked registry edited locally sends unpublished text (both reviews).
5. The stub-backend skip test drives `deemGate` alone instead of comparing census bytes around it.
6. The Jev withholding guard reads `registries.length > 0` where both lookups must resolve, a case `main` cannot reach.

## 4. Generated files and package checks

- `sync-skills-hermes.cjs` wrote 1 of 72 copies. The session staged `.hermes/skills/system-deep-loop/SKILL.md` only, and its fan-out line matches the hub's line 111.
- The three compiled deep command contracts were recompiled from this phase's staged tree (`recompile-contracts.sh`): `[CONTRACT DRIFT] OK commands=3`.
- `parent-skill-check.cjs .skilled/skills/system-deep-loop`: `OK`, 0 warnings.
- Catalog package `system-deep-loop/runtime`: `violations=176`, the new one a `packet_history_metadata` warning on the F059 entry's `Feature ID` line, a line every runtime entry carries.
- Playbook package: `PASS ... scenarios=58 categories=12 ... violations=0`, one scenario more than 029's 57, with the typed census matching.
- `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`. README verdict parity `PARITY PASS`. README manifest `manifest=reproducible`.

## 5. Commit

`fe84dd1899` feat(deep-loop): the script, its test, the eight docs, the Hermes copy and the three recompiled contracts, 14 files staged, not pushed. The staged set passed the key grep (exit 1). The pre-commit route-remint gate re-minted `system-deep-loop` and staged both manifests, 16 files in all. After the commit `compiled-route-guard.cjs` lists `system-deep-loop` fresh. The trigger index follows in its own commit.

## 6. Open for the operator

- The pair sheet written outside the repository and at least 40 labeled pairs, 10 of them cross-body, then a live Deem run, and a Jev run on the operator's yes.
- The P2 findings above.
