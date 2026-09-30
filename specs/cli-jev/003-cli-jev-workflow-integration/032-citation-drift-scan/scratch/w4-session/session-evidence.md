# 032 session evidence: verification, review and commit

The orchestrator session's record for phase 032. The session wrote every brief, ran the proof plan from the final state itself and made the commits. No Claude leaf wrote a file (parent D5). The run-by-run notes are `notes.md` beside this file, and the facts the docs were written from are `docs/facts.txt`.

## 1. Build

- Design and rulings: `../w4-build/design.md` (Devin `deepseek-v4-1-flash-max`, before its daily quota ran out) and `../w4-build/rulings.md`. Ruling 7 added the batch lessons (git output buffer, a fast real-tree run, step order, no real-repository counts in tests) before any code step.
- Baseline, captured before any 032 file existed (`../w4-build/baseline/`): `run-script-tests.sh` 26 PASS lines and 3 FAIL lines, `1 failing: test_rename_tooling_fixture_harness.py`; `test-frontmatter-version.mjs` `PASS — 23 passed, 0 failed`.
- Code steps and both code fixes ran on DeepSeek V4.1 Flash through Cline (`--thinking xhigh`), each checked by `node --test` on the test file. The last printed `tests 32`, `pass 32`, `fail 0`.
- Docs d8a to d10h ran on Pi `llmgateway/mimo-v2.6-pro` at `high`, each written from the facts file. Step `d10d` set 2.2.3.0 in the five hub version fields after the changelog step (ruling 2).
- Deviation from design step 8: `shared/scripts/README.md` gets one row, for the script, which names `cite-drift-labels.jsonl` as the file `--draw` writes by default. The design's second row would describe a file that does not exist until the operator draws it.
- Step `d10h` (the playbook index) made its edit and then reported BLOCKED: `validate_document.py --type playbook` exits 1 with three `missing_required_section` errors. The session ran the same command on HEAD's copy: the same three errors, exit 1. They predate this phase, and restructuring the index is outside the frozen scope.

## 2. Session verification from the final state

Logging stubs for `jev` and `cli-deem` were first on `PATH`, and every output went to the session scratchpad (`$SP/w4v/032-proof`, `$SP/w4v/032-draw`). The script and its test were last written at 21:09 and 21:10, before the code recheck (21:17) and these proofs (21:27), so the proofs ran on the committed code.
- The default run exits 0 in 171 s: `citations=357 in_range=208 past_end=2 ambiguous=44 unresolved=103 refused=0 dead=2 commit=709b1078ee5d`, two `cite dead:` lines, `margin: 0.10`, the keep rule line and `stop: fewer than 40 labeled rows`. The stub log was never written.
- `--deem --out <dir>` with a stub backend adds only `deem arm skipped: stub backend` after one `cli-deem health` call. `--jev --out <dir>` with `auth status` exiting 3 adds only the identity line and `jev arm skipped: no credential` after `jev --version` and `jev auth status --provider official`. Neither writes a file in `<dir>`.
- `--deem` without `--out` exits 2 with `--deem and --jev need --out <dir> so every call is recorded`, before any call and with no stdout.
- `--draw --seed 20260929 --labels <scratchpad file>` exits 0 in 381 s with `draw: ... rows=40 live=20 constructed=20`: 20 live rows with `verdict` and `labeler` null, 20 constructed rows with `verdict: contradicts` and `labeler: construction`. No stub call. The file stays in the scratchpad, since the session commits no labels file (parent D4).
- `git status` changed during the runs only by the doc files the 031 and 033 queues were writing at the time. The key grep exits 1. The Python comment hygiene checker exits 0 on the script and its test.
- Tests from the final state: `run-script-tests.sh` 26 PASS and 3 FAIL lines with the same one failing file as the baseline; `test-frontmatter-version.mjs` `PASS — 23 passed, 0 failed`; `test-cite-drift-scan.mjs` `tests 32`, `pass 32`, `fail 0`.
- Session check, not a finding: the citing docs are read at HEAD, while a target's line count is read from the working tree. The design sets that ("a tracked path absent on disk -> `missing`"), so the dead list reflects the live tree.

## 3. Cross-family review

Read-only, split by author family. The SHA-1 over each review's files was equal before and after every run.

- **Code, reviewed by Pi MiMo** (954 s, `review-code-pi.md`): `VERDICT: FAIL`, 1 P0, 1 P1 and 3 P2.
  - P0: the drift flag's polarity was inverted. `noul` gives the probability that the window still shows the cited fact, so a row is drifted when that probability is below 0.5, but both arms flagged at `>= 0.5`. Fix `c8f` (DeepSeek) flags below the threshold and inverts both Brier inputs to match. Fix `c8g` moves the seven test expectations with it.
  - P1, ruled against by the session: the backend gates run under the label gate, so `--deem --out <dir>` below 40 labels still calls `cli-deem health`. The goal's criterion 2 and the design's proof plan run the gates on an unlabeled tree, and a gate check calls no model.
  - Recheck, Pi MiMo (214 s): `VERDICT: PASS`, the P0 closed, nothing new at P0 or P1.
- **Docs, reviewed by DeepSeek on Cline** (571 s, `review-docs-ds.md`): `VERDICT: FAIL`, 1 P1 and 4 P2.
  - P1: the catalog entry said a citation to a path outside the tracked files is refused. `resolveCitation` refuses a `.env` basename or an untracked file that exists on disk, and counts a path that matches nothing as `unresolved` (the real run: `refused=0 unresolved=103`). The reviewer also marked REQ-003's count clause not met. Session ruling: the code follows the design, whose census line carries both counts and whose test table refuses an untracked file. If every non-tracked target were refused, `unresolved` could never occur. So REQ-003's "a target outside `git ls-files`" is an untracked file, and the doc was wrong.
  - Fixed although rated P2, because the goal asks for docs true to the code: "Every run prints" the census was false for `--draw`; the draw refusal fires on any `labeler`, construction rows included; the entry's `version:` was 2.2.3.0 where a new leaf takes 2.2.0.0; and its Implementation table listed `cite-drift-labels.jsonl`, which exists only after an operator's `--draw` (the catalog package's `violations=7` against HEAD's 6).
  - Fix `f1` (MiMo) corrects all five in the catalog entry. Recheck, DeepSeek (154 s): `VERDICT: PASS`, all five closed.

P2 findings, recorded, not chased (parent D5):
1. MiMo: the draw refusal keys on any non-null `labeler`, so a fresh draw's 20 construction rows block a second `--draw` with "operator labels present". The catalog entry now says so.
2. MiMo: the request's `target` is the bare path, where REQ-009 names `path:line`. The citing sentence usually carries the line.
3. MiMo: the verdict tests feed counts that cannot occur together, and nothing covers `stop (sign test)`, `stop (flips)` or disagreeing Jev reruns.
4. DeepSeek and session: `doc.split('/')[2]` counts every folder under `.skilled/skills/` as a skill, so a real run prints an all-zero `skill .state:` line.
5. Session: the no-`--out` message names both switches whichever one was given. The spec asks only for exit 2 before any call.
6. Session: the default run takes about 3 minutes, since it reads every tracked doc at its commit.

## 4. Generated files and package checks

- `sync-skills-hermes.cjs` regenerated the drifted copies. The session staged only `.hermes/skills/sk-doc/SKILL.md`, which carries the version and the new script's clause.
- `parent-skill-check.cjs .skilled/skills/sk-doc`: `OK: parent-skill-check — all hard invariants passed, 0 warnings`.
- Catalog package `sk-doc`: `violations=6`, HEAD's count.
- Playbook package `sk-doc`: `scenarios=27` (HEAD 26), `violations=0`, one advisory warning.
- `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`. README verdict parity `PARITY PASS`. README manifest `manifest=reproducible`.

## 5. Commit

`c5d3ced36f` feat(sk-doc): the script, its test, the 13 docs and hub files and the Hermes copy, 16 files staged, not pushed. The staged set passed the key grep (exit 1). The pre-commit route-remint gate re-minted `sk-doc` and staged both manifests, 18 files in all. After the commit `compiled-route-guard.cjs` lists `sk-doc` fresh and `ci-leaf-manifest-freshness.cjs` prints `checked=15 fresh=15 failed=0`. The trigger index follows in its own commit.

## 6. Open for the operator

- The 40-row draw, then the operator's `supports`, `partial` or `contradicts` label on each live row, then a live Deem run, and a Jev run on the operator's yes.
- The P2 findings above.
