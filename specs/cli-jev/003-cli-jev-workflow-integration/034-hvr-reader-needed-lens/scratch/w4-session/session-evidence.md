# 034 session evidence: verification, review and commit

The orchestrator session's record for phase 034. The session wrote every brief, ran the proof plan from the final state itself and made the commits. No Claude leaf wrote a file (parent D5). The run-by-run notes are `notes.md` beside this file, and the facts the docs were written from are `docs/facts.txt`.

## 1. Build

- Design and rulings: `../w4-build/design.md` (DeepSeek V4.1 Flash on Cline, after Devin's quota ran out) and `../w4-build/rulings.md`.
- Code steps c1 to c10 and every code fix ran on DeepSeek V4.1 Flash through Cline (`--thinking xhigh`).
  - After c8 the test run stopped at `NameError: name 'FLAG_AT' is not defined`: the design lists the constant, but no step defined it. Fix `c8f`. Steps c9 and c10 then ran without a per-step check, since step 10 adds functions step 8's tests call.
  - The final test run failed one check: it counted `auth test` calls with `call[:1] == ["auth", "test"]`, which is never true. Fix `c10f` corrected the slice, and the test file printed `ALL PASS`.
- Docs d11 to d18 ran on Pi `llmgateway/mimo-v2.6-pro` at `high` after 032's commit `c5d3ced36f`, each written from the facts file.
  - Versions: the packet `SKILL.md` moves to 1.2.0.0 beside `changelog/v1.2.0.0.md`; the catalog entry is 2.2.0.0 and scenario HVT-004 is 1.2.0.0; index and README versions stay as they were, as 032 left the index it edited.
  - Deviation from design steps 11 and 15: the labels file gets no README row and no catalog source row of its own, since it does not exist and the session commits none. Parent D4 outranks the phase's ruling 4, which had the session commit the draw.

## 2. Session verification from the final state

Logging stubs for `jev` and `cli-deem` were first on `PATH`, and every output went to the session scratchpad (`$SP/w4v/034f-proof`, `$SP/w4v/034f-draw`). These runs used the committed code.
- The default run exits 0 in 207 s: `census: ... files=7920 sections=107218 flagged=51057 in_band_5_80=40965 refused=5`, `candidates=0`, `candidates=2` and `candidates=786` for synonym cycling, significance inflation and false ranges, the three questions with their SHA-256 digests, `margin: 0.10`, the keep rule, `labels: labeled=0 of 150` and `stop: fewer than 150 labeled rows`. The stub log was never written.
- `--deem --out <dir>` adds only `deem arm skipped: stub backend` after one `cli-deem health` call. `--jev --out <dir>` adds only the identity line and `jev arm skipped: no credential` after `jev --version` and `jev auth status --provider official`. Neither writes a file in `<dir>`.
- `--deem` without `--out` exits 2 with `--jev and --deem need --out <dir> so every call is recorded`, before any call and with no stdout.
- The census commit differs between the runs, and `git status` changed during them, only because the session committed 029 and 030's doc queue edited `runtime/README.md` in those minutes. The jev and deem runs went through while 029's closure docs were staged, the case the last code fix closes.
- `--draw --seed 20260929 --labels <scratchpad file>` on the committed code exits 0 in 184 s: `rows=150`, 50 per category, with `candidate_rows` 0, 2 and 25, every label empty, no text field and no stub call. The file stays in the scratchpad, since the session commits no labels file (parent D4).
- The key grep exits 1. The Python comment hygiene checker exits 0 on the script and its test. `hvr_scan.py` is byte-identical to HEAD.
- Tests: `test_hvr_reader_lens.py` prints 42 `PASS` lines and `ALL PASS`; the unchanged `test_hvr_scan.py` prints 11 and `ALL PASS`. sk-doc's `run-script-tests.sh` prints 26 PASS lines with the same one failing file as 032's baseline (`test_rename_tooling_fixture_harness.py`), and `test-frontmatter-version.mjs` `PASS — 23 passed, 0 failed`.
- All eight docs pass `validate_document.py` (exit 0).

## 3. Cross-family review

Read-only, split by author family. The SHA-1 over each review's files was equal before and after every run.

- **Code, reviewed by Pi MiMo** (796 s, `review-code-pi.md`): `VERDICT: FAIL`, 2 P1 and 3 P2.
  - P1: the Deem fallback pointed one folder too high and ran the `.mjs` client with Python, where REQ-007 names `node`. Fixes `c11f` and `c11g`.
  - P1: no check read `report.json`. Fix `c11h` checks each column's stored verdict line, categories and identity fields against the printed run.
  - Recheck, Pi MiMo (167 s): `VERDICT: PASS`.
- **Session finding, P1, missed by the review:** the census read each section's text at the recorded commit, but ran the scanner on the working tree, so two runs at one commit printed different counts while the doc queues edited skill docs (REQ-002). Fix `c12f` (DeepSeek) writes the committed text into a temporary folder outside the repository and scans that; `c12g` checks that a working-tree edit leaves the census unchanged. Recheck, Pi MiMo (292 s): `VERDICT: PASS`.
- **Session finding before the doc review:** the packet playbook package failed with `BAKED_RUN_TRANSCRIPT`, a dated session run with live counts in the scenario's Expected paragraph. Fix `f0` (MiMo, 214 s) deletes that sentence.
- **Docs, reviewed by DeepSeek on Cline** (717 s, `review-docs-ds.md`): `VERDICT: FAIL`, 1 P1, no P2.
  - P1 (REQ-002): `tracked_files` listed the git index while the census reads each file at HEAD, so a staged, uncommitted file (the reviewer used 029's staged catalog entry) killed the default and `--draw` runs with a traceback. The same class 033's review found. Fixed at the source the same way: `c13f` (DeepSeek) lists HEAD's tree and `c13g` adds the check "census leaves out a staged, uncommitted doc".
  - Recheck, Pi MiMo (369 s): `VERDICT: PASS`.

P2 findings, recorded, not chased (parent D5):
1. MiMo: a column that fails coverage or kill still prints its three category lines before the verdict, where the design says the verdict line prints alone.
2. MiMo: every column line prints `p50=none p95=none`, where the design fixes the measured latencies.
3. MiMo: K counts non-refused rows, not the category's labeled rows, so an untracked drawn doc re-bases coverage.
4. MiMo: `scan_batch`'s docstring still calls its second parameter the repository, and a relative scanner path passed through `deps` would resolve against the temporary folder, though no switch sets one.
5. Session: the default run takes about 3.5 minutes on the real tree.

## 4. Generated files and package checks

- `sync-skills-hermes.cjs` regenerated the copy. The session staged `.hermes/skills/sk-create-with-human-voice/SKILL.md` only.
- `parent-skill-check.cjs .skilled/skills/sk-doc`: `OK`, 0 warnings.
- Catalog package `sk-doc`: `violations=6`, HEAD's count.
- Playbook package `sk-doc/sk-create-with-human-voice`: `PASS ... scenarios=10 ... violations=0 warnings=0`, one scenario more than HEAD's 9.
- `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`. README verdict parity `PARITY PASS`. README manifest `manifest=reproducible`.

## 5. Commit

`2588231589` feat(sk-doc): the script, its test, the eight docs and the Hermes copy, 11 files staged, not pushed. The staged set passed the key grep (exit 1). The pre-commit route-remint gate re-minted `sk-doc` and staged both manifests, 13 files in all. After the commit `compiled-route-guard.cjs` lists `sk-doc` fresh. The trigger index follows in its own commit.

## 6. Open for the operator

- The 150-row draw (`--draw --seed <n>`), then the operator's label on each row, then a live Deem run, and a Jev run on the operator's yes.
- The P2 findings above.
