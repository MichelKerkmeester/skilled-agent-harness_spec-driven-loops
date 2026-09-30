# 029 session evidence: verification, review and commit

The orchestrator session's record for phase 029. The session wrote every brief, ran the proof plan from the final state itself and made the commits. No Claude leaf wrote a file (parent D5). The run-by-run notes are `notes.md` beside this file, and the facts the docs were written from are `docs/facts.txt`.

## 1. Build

- Design and rulings: `../w4-build/design.md` (Devin `deepseek-v4-1-flash-max`) and `../w4-build/rulings.md`.
- Code steps c1 to c7 and every code fix ran on DeepSeek V4.1 Flash through Cline (`--thinking xhigh`), each checked by the test file.
  - After c2 the check failed 1 of 12: design section 3's `no headroom` case cannot pass the label gate first. Ruling 5 and fix `c2f` (test only) gave it 201 rows with 20 negatives.
  - c5 failed 1 of 27 with `ReferenceError: stubs is not defined` in a case table. Fix `c5f` (test only).
  - The last code step printed `Tests 33 passed (33)`.
- Docs d8 to d15 ran on Pi `llmgateway/mimo-v2.6-pro` at `high` after 028's commit `97200ea481`, each written from the facts file: runtime changelog v1.8.0.0, F058, DLR-058, the hub version unchanged.

## 2. Session verification from the final state

Logging stubs for `jev` and `cli-deem` were first on `PATH`, and every output went to the session scratchpad (`$SP/w4v/029f-proof`). These runs used the committed code, after the comment fix `c8f`.
- The default run exits 0 in 3 s: `registries: 413`, `findings: 2771 (P0 96, P1 1298, P2 1377, other 0)`, the transition lines, `p0 rows: 95 in 37 registries (one 21, two or more 16)`, `labels needed: 20 P0 negatives among 95 P0 rows`, the baseline, question, margin, keep rule and power lines, and `stop: fewer than 20 labeled P0 negatives`. The stub log was never written.
- `--deem --out <dir>` and `--jev --out <dir>` each add only `deem arm skipped: label gate` or `jev arm skipped: label gate`, call no stub, and write only `report.json`.
- `--deem` without `--out` exits 2 with `--deem needs --out <dir> so every call is recorded`, before any call and with no stdout.
- `--write-label-sheet specs/inside-sheet.jsonl` exits 2 with `refusing to write the label sheet inside the repository` and writes no file. Outside the repository the sheet holds 95 rows, every `label` empty (the earlier run in `$SP/w4v/029`).
- `git status --porcelain` was equal before and after. The key grep exits 1. The Python comment hygiene checker exits 0 on the script and its test.
- Tests: `score-severity-replay.vitest.ts` prints `Tests 33 passed (33)`.
- Runtime suite with the staged state (`npx vitest run tests/unit/` from `runtime`, leaving out 030's in-progress test file), 1,093 s: `Test Files 127 passed (127)`, `Tests 2489 passed (2489)`. After 028 it held 126 files and 2,456 tests, and after 033 the same, so this phase adds one file and its 33 tests and no failure.
- All eight docs pass `validate_document.py` (exit 0).

## 3. Cross-family review

Read-only, split by author family. The SHA-1 over each review's files was equal before and after every run.

- **Code, reviewed by Pi MiMo** (879 s, `review-code-pi.md`): `VERDICT: PASS`, REQ-001 to REQ-010 met, REQ-011 not checked (docs not yet written), 6 P2.
- **Docs, reviewed by DeepSeek on Cline** (398 s, `review-docs-ds.md`): `VERDICT: FAIL`, 1 P1 and 6 P2.
  - P1: REQ-011 says `SKILL.md`, both READMEs, the changelog, the catalog entry and the playbook entry each name the script, the gate and both switches. The hub sentence named only the script. Fix `f1` (MiMo) names the stop line, `--jev` and `--deem`, `--out <dir>` and the backend gates.
  - Fixed although rated P2: a JSDoc comment gave `P2-001` as an example of an id shape. Its reason was sound and the hygiene checker passed it, but the repository bans finding ids in code comments, and an id-shaped literal falls in that class. Fix `c8f` (DeepSeek, the code's author) keeps the reason without the literal. The session had ruled the other way after the code review, and this reverses that ruling.
- **Rechecks:**
  - Pi MiMo on `c8f` (271 s): `VERDICT: PASS`.
  - DeepSeek on `f1` (73 s): `VERDICT: PASS`, checking all six docs REQ-011 names.

P2 findings, recorded, not chased (parent D5):
1. The `USAGE` comment says the line prints whenever the run cannot start, but nothing prints it.
2. A timed-out or exit-1/4 `jev auth test` stops as `usage error` and logs `unmeasured`, where REQ-009 gives `unmeasured_timeout` past 90 s.
3. `recorded` ranks only rows carrying a P0 probability, not the registry's own order (REQ-010).
4. The label-sheet refusal is lexical, not realpath, so a symlink into the tree gets past it.
5. The test "an unreadable registry exits 2" asserts only the `loadRegistries` throw, never `main`'s exit 2.
6. One of the 95 P0 rows comes from a test fixture registry under `deep-review/scripts/tests/fixtures/`.

## 4. Generated files and package checks

- `sync-skills-hermes.cjs` regenerated the drifted copies. The session staged only `.hermes/skills/system-deep-loop/SKILL.md`.
- The three compiled deep command contracts were recompiled from this phase's staged tree (`recompile-contracts.sh`): `[CONTRACT DRIFT] OK commands=3`, with the new hub `SKILL.md` digest.
- Catalog package `system-deep-loop/runtime`: one added `packet_history_metadata` warning, on the new entry's `Feature ID: F058` line, a line every runtime entry carries. 030's files, on disk at the time and not staged, account for the rest of the difference.
- Playbook package: `PASS ... scenarios=57 ... violations=0`, one scenario more than 028's 56, with the typed census matching.
- `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`. README verdict parity `PARITY PASS`. README manifest `manifest=reproducible`.

## 5. Commit

`2239858286` feat(deep-loop): the script, its test, the eight docs, the Hermes copy and the three recompiled contracts, 14 files staged, not pushed. The staged set passed the key grep (exit 1). The pre-commit route-remint gate re-minted `system-deep-loop` and staged both manifests, 16 files in all. After the commit `compiled-route-guard.cjs` lists `system-deep-loop` fresh. The trigger index follows in its own commit.

## 6. Open for the operator

- The label sheet written outside the repository and at least 20 labeled P0 negatives, then a live Deem run, and a Jev run on the operator's yes.
- The P2 findings above.
