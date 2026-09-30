# 021 session evidence: verification, review and commit

The orchestrator session's record for phase 021. There is no `../w4-build/build-evidence.md`: the session ran the build itself from `../w4-build/briefs/` under parent D5, and this file is the phase's build record. The design is `../w4-build/design.md`, the session's rulings are `../w4-build/rulings.md`, and the zero-call run first recorded after the code steps is `../w4-build/replay-run.txt`.

## 1. Build

- Baseline (`../w4-build/baseline/node-test.txt`): `node --test` on `sk-create-skill/scripts/tests/` `pass 46`, `fail 1`. The failure is `skill-root-metadata-contract.test.cjs`.
- Code c1 to c7: Devin DeepSeek (`deepseek-v4-1-flash-max`), each exit 0 with `STATUS: DONE`.
- Docs d08 to d15b: Pi MiMo (`llmgateway/mimo-v2.6-pro`, `high`), each exit 0 with `STATUS: DONE` (255 s to 1,023 s).

## 2. Session verification from the final state

S is `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs`. Logging stubs for `jev` and `cli-deem` were first on `PATH`, and outputs went to the session scratchpad.

- Criteria 1 and 2: `node S --report <dir>` exit 0, stub log never created, `<dir>` holds only `report.json`. Per hub: `hub=sk-doc gold=25 unscored=1 unknown=3 unresolvable=0 tied=2 precision=0.8132 recall=0.8746 f1=0.8259 exact=19`; mcp-tooling, system-deep-loop, cli-external-orchestration and sk-design each at `f1=1.000` with every gold row exact (15, 6, 5 and 4); `hub=sk-code gold=1 unscored=1 surface slice not replayed`; `hub=cli-classifier stage1-only`; `total gold=56 scored=55 tied=2 mean_f1=0.9209 exact=49`; `router reads: not measured`; `replay verdict: stop (prose arm covers 0 of 55 rows) N=55 P=0 keyword_f1=n/a prose_f1=n/a`. The design's proof table expected N=56. The scorer counts 55 because sk-code's one gold row is unscored.
- Criterion 3: `node --test .../leaf-route-replay.test.cjs` `tests 37`, `pass 37`, `fail 0` after the review fixes (33 before them). The whole `scripts/tests/` folder: `tests 80`, `pass 79`, `fail 1` before the fixes, and the one failure is the baseline's.
- Criterion 4: `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on S exit 1. `git status --porcelain` before and after the run differed only by `?? .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/`, which phase 031's code step created during the run.
- Criterion 5: `validate_document.py` `Total issues: 0` on all nine changed docs, with the playbook index at `--type playbook` and the catalog index at `--type feature_catalog`.
- Comment hygiene checker exit 0 on S and its test.
- Generators before the commit:
  - `generate-leaf-manifest.cjs --check .skilled/skills/sk-doc` OK.
  - `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`.
  - README verdict parity `PARITY PASS: verdict diff is empty`.
  - `sync-skills-hermes.cjs` regenerated `.hermes/skills/sk-create-skill/SKILL.md`.
- Catalog package `--package sk-doc`: `violations=7` before the fixes and `violations=6` after, against a HEAD extract. The one new warning was `phantom_root_row` at `feature-catalog.md:52`, where the new block wrote `ROUTER.md` in backticks. The package validator refuses `sk-create-skill` as a playbook package root, at HEAD too, so no playbook package check runs for it.

## 3. Cross-family review

Read-only, split by author family, briefs `review-pi.md` and `review-ds.md`, logs in `logs/`. SHA-1 over the 11 files in `files.txt` `55a6ac43bf44d9e398c270f1b5078b8883894506` before and after both runs.

- Pi MiMo on the code DeepSeek wrote (820 s): `VERDICT: FAIL`, 1 P1 and 3 P2.
- DeepSeek on the docs MiMo wrote (330 s, on Cline): `VERDICT: FAIL`, 1 P1 and 5 P2. It reran the plain run, the key grep and `validate.sh --strict` (`RESULT: PASSED`).

P1 findings and how each closed:
1. MiMo: three Deem skip lines had no test (`not reachable`, `model` with its `deem: found=` line, `bad health response`), though `makeStubs` already had the stub cases. Fix `fix/f1.md` (DeepSeek) added three `deemGate` tests: 36 of 36 passed.
2. DeepSeek: no test ran `readProse` on a real file. Fix `fix/f2.md` (DeepSeek) added `readProse parses pairs and counts unparsed lines`: 37 of 37 passed.

Doc fixes, although rated P2 or found by the session, because the goal asks for docs true to the code (`fix/f3.md`, Pi MiMo):
1. DeepSeek: the catalog entry said a malformed prose line is "counted unparsed". `main` never prints the count. The entry now says such a line is "skipped and never guessed".
2. DeepSeek: the playbook index said only SKL-007 links the hub catalog. It now names SKL-007 and SKL-008.
3. Session: the `phantom_root_row` warning. The clause now reads "recounts each hub's router-file reads behind the block", and the package is back to 6 warnings.

Rechecks, read-only, by the other family:
- `fix/recheck-pi.md`, MiMo on f1 and f2 (66 s): both closed, `VERDICT: PASS`.
- `fix/recheck-ds.md`, DeepSeek on f3 (51 s): all three closed, `VERDICT: PASS`.
- SHA-1 over `files.txt` `29b3b34d2a08298ecfdb4a7a99cb3489104f87f1` before and after both rechecks.

P2 findings, recorded, not chased (parent D5):
1. MiMo: the `kill` and `stop (coverage)` verdicts are tested only as `decideVerdict` labels, never as a printed `verdict <backend>:` line.
2. MiMo: a `jev auth test` exit 2 stops with `jev arm stopped: auth test failed`, where the exit map gives exit 2 `usage error`.
3. MiMo: the README names the switches but not the gate commands (`jev auth status --provider <p>`, `cli-deem health`) or the skip lines.
4. DeepSeek: a `jev auth test` spawn past 90 s is recorded `unmeasured`, where REQ-007 says `unmeasured_timeout`.
5. DeepSeek: no test drives the Jev arm to a verdict line.
6. DeepSeek (recheck note): the JSDoc of `readProse` and one test name still say "counted" for the unparsed lines, which `main` does not print.

## 4. Commit

`fcacc26bf3` feat(sk-create-skill): 14 files, not pushed.
- Contents: the script, its test, the nine docs, the Hermes copy and the two `activation/sk-doc/manifest.json` copies the pre-commit route-remint gate re-minted.
- Before the commit, `node --test` on the test file gave `pass 37`.
- After it, `compiled-route-guard.cjs` exit 0: "All hubs fresh or excused".

## 5. Open for the operator

- A prose file covering at least 90 percent of the 55 scored rows (`--prose <file>`), then the replay verdict. A Jev or Deem tie-break run follows on the operator's yes.
- The P2 findings above.
