# 035 session evidence: verification, review, fixes, draw and commit

The orchestrator session's record for phase 035. The session reran the proof plan from the final state itself; where this file and `../w4-build/build-evidence.md` disagree, this file wins.

## 1. Build

A build orchestrator leaf (Opus 5.5 xhigh, under parent D5 as it stood before the 2026-09-29 amendment) ran code briefs 01 to 13 (with 01b, 02b, 05b and a second attempt of 04) through Devin `deepseek-v4-1-flash-max`, all exit 0, and wrote the doc briefs 20 to 27 with their prepared text. The operator then said "Dont use opus" and chose "Stop them now" and "No Claude leaves". The session stopped the leaf while brief 14 was starting: Devin had only read files, and `score-injection-screen.mjs` and its test were unchanged since brief 13 (both written at 17:15). The session then ran, itself, brief 14 through Devin (323 s, `STATUS: DONE`, test file at 40 cases) and briefs 20 to 27 through Pi `llmgateway/mimo-v2.6-pro` at `high` (each `STATUS: DONE`, the prepared-text ones `cmp` equal).

The hub check then failed `13b-version` (SKILL.md 1.1.0.0 against changelog v1.2.0.0). Two Pi fix briefs closed it: `f1` set `SKILL.md` to 1.2.0.0, and `f2` set the same version in `ROUTER.md`, `description.json`, `hub-router.json` and `mode-registry.json` (invariant 13a). After them `parent-skill-check.cjs .skilled/skills/cli-classifier` prints `OK: parent-skill-check — all hard invariants passed, 0 warnings`.

## 2. Session verification from the final state

- Criterion 1: `STUB_LOG=<log> PATH="<stubs>:$PATH" node score-injection-screen.mjs` exit 0, the two `fetch census:` lines (`state_files=486 records=6661 ... naming_webfetch=82 naming_websearch=61 files_with_either=31 unparsed_lines=5`), `corpus census: ... files=185 refused=2 excluded=1`, one `corpus:` line per source (`total sections=1138 in_band=1022 lexical_hits=0`), the lexical and instruction hash lines, `margin: 0.10`, the keep-rule line, `labels: labeled=30 of 90 planted_sentences=0 of 30` after the draw (the 30 planted rows are labeled by construction), `stop: fewer than 90 labeled rows`; the stub log was never written.
- Criterion 2: a stub `cli-deem` reporting backend `stub` with `--deem --out <dir>`: exit 0, last line `deem arm skipped: stub backend`. A stub `jev` whose `auth status` exits 3 with `--jev --out <dir>`: exit 0, `jev: path=<stub>/jev provider=official` then `jev arm skipped: no credential`. Both stdout prefixes byte-identical to the census; neither `--out` folder was created.
- Criterion 3: `node --test .../tests/score-injection-screen.test.mjs` `tests 40`, `pass 40`, `fail 0`, exit 0, before and after the draw.
- Criterion 5: `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the scorer exit 1; `git diff --stat .claude/settings.json .skilled/hooks` empty; `git status --porcelain` on the hub, `.claude` and `.skilled/hooks` equal before and after the runs; `validate_document.py` exit 0 on all 8 changed hub docs (the catalog root with `--type feature_catalog`, the playbook root with `--type playbook`).
- Comment hygiene checker exit 0 on the scorer and its test.

## 3. Cross-family review

Read-only, split by author family, briefs `review-pi.md` and `review-devin.md` (each carries the diff), logs in `logs/`. The SHA-1 over the 14 reviewed files was equal before and after both runs.

- Pi MiMo on the code Devin wrote (952 s): `VERDICT: PASS`, 3 P2.
- Devin DeepSeek on the docs and version fields Pi wrote (489 s): `VERDICT: FAIL`, 3 P1 and 3 P2.

P1 findings and how each closed:
1. `.hermes/skills/cli-classifier/SKILL.md` was not regenerated (`sync-skills-hermes.cjs --check` printed `DRIFT cli-classifier`). The Hermes copies are the session's generator: `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` (`Wrote 3 of 72`), then `--check` `PASS: 72 Hermes skill copies in sync`.
2. `MAX_ROWS_PER_SOURCE = 30` against REQ-004's "no more than 20 from one source group (proposed)", with no deviation recorded. Ruling by the session: 30 stands. The in-band section counts per source are supercov-main 837, jev-cli-main 139, claude-jev-main 28, pi-jev-context-main 8, social posts 5, jev-review-main 5, external websites 0, so a cap of 20 can draw at most 20+20+20+8+5+5 = 78 rows, short of the 90 the design needs, and a cap of 30 can draw 106. REQ-004's proposed cap is amended at closure with this reason. Pi raised the same point as a P2 with the same arithmetic.
3. `labels.jsonl` and `planted.jsonl` were never drawn (T015). The session ran `node .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs --draw --seed 20260929` on the real tree (exit 0, stub log empty): `draw: seed=20260929 commit=6aa7ca0980d0c385d925ec3b048fd2db87464807 rows=90 natural=60 planted=30`, per source `claude-jev-main` 21, `jev-cli-main` 30, `jev-review-main` 1, `pi-jev-context-main` 6, `social posts` 2, `supercov-main` 30. `labels.jsonl` 90 rows, no text field, the 60 natural rows `label: null`, the 30 planted rows labeled with `labeler: "construction"`; `planted.jsonl` 30 rows, every `sentence: null`. A second draw with the same seed into other paths was byte-identical. No model wrote a label (parent D4).

Session note on the draw: a check of the overwrite refusal ran `--draw --seed 1` and succeeded, because the refusal fires only once a label or planted sentence from the operator exists, and the construction labels are not operator content. The session then redrew with seed 20260929 and confirmed the files byte-identical to the first draw. The refusal is covered by the test `draw refuses to overwrite ...` in the test file.

Recheck: Devin, read-only, `fix/recheck.md` (106 s): findings 1, 2 and 3 closed, `VERDICT: PASS`, the ruling on 2 confirmed on the census numbers. SHA-1 over the reviewed files plus the Hermes copy and both drawn files `fd7fcefd6fad5dc4bff3b3d77eef07320a7ad045` before and after.

P2 findings, recorded, not chased (parent D5):
1. Pi: the test `keep rule` compares the module's constant with itself, so the keep-rule line is never pinned.
2. Pi: `spawnCall`'s timeout branch (`unmeasured_timeout`) is never exercised.
3. Devin: `README.md:8` stays at version 1.1.0.0 while the release is 1.2.0.0.
4. Devin: `manual-testing-playbook.md:4` stays at 1.1.0.0.
5. Devin: `SKILL.md:158` "Hub changelog" still links `changelog/v1.1.0.0.md`.

## 4. Generated files

- Hermes copy `.hermes/skills/cli-classifier/SKILL.md` regenerated (above).
- README verdict parity `diff_entries=0`; README manifest `manifest=reproducible`.
- `compiled-route-guard.cjs` reports `cli-classifier stale-manifest` before the commit, since `SKILL.md`, `hub-router.json` and `mode-registry.json` changed; the pre-commit route-remint gate re-mints it.

## 5. Commit

`3d0641004b` feat(cli-classifier): the scorer, its test, `labels.jsonl`, `planted.jsonl`, the 8 docs, the changelog, the four version files and the Hermes copy, 19 files with the two activation manifests, not pushed. Before it the SHA-1 over the 14 reviewed files was still `d371d08d6b1ffec10aa5af4d812c1783976be746` and the recheck set still `fd7fcefd6fad5dc4bff3b3d77eef07320a7ad045`. The pre-commit route-remint gate re-minted `cli-classifier` and staged both manifests. After the commit `compiled-route-guard.cjs` exit 0 (all hubs fresh), `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`, `parent-skill-check.cjs` all hard invariants passed. The trigger index follows in its own commit.

## 6. Open for the operator

- The 60 natural labels in `labels.jsonl` and the 30 planted sentences in `planted.jsonl`, then a live Deem run, and a Jev run on the operator's yes.
- The P2 findings above.

## 7. Closure

- Closure: Pi MiMo, stopped at its 30-minute limit (exit 142) after it had edited all five phase docs and re-derived `graph-metadata.json`. The session checked the result from the final state: `repair-derived.cjs` (dry run) `repairable=0`, `validate.sh --strict` `RESULT: PASSED` with Errors 0 and Warnings 0, `check-goal.cjs` `RESULT: PASSED (5/5 checks)`, `goal.cjs packet` `packet_durable_chars=3987`. Status is `Complete`, REQ-004's cap reads 30 with the 78-row reason, and T016 and T017 stay `[B]` for the operator.
- T020's tick says a `cli-deem.test.mjs` rerun was inferred. The session ran it after the closure: `node --test .skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs` `tests 34`, `pass 34`, `fail 0`, exit 0, the same as T002's baseline of 34 of 34.
