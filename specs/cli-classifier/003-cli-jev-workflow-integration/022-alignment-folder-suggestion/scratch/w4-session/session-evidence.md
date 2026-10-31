# 022 session evidence: verification, review and commit

The orchestrator session's record for phase 022. The session reran the proof plan from the final state itself; where this file and `../w4-build/build-evidence.md` disagree, this file wins.

## 1. Build

A build orchestrator leaf (Opus 5.5 xhigh, under parent D5 as it stood before the 2026-09-29 amendment) captured the baseline and ran the code dispatches 01 to 08 (with 01b, 01c, 02b and 03b) through Devin `deepseek-v4-1-flash-max`, recorded in `../w4-build/build-evidence.md` sections 1 to 3. The operator then said "Dont use opus" and chose "Stop them now" and "No Claude leaves", and the session stopped the leaf after dispatch 09a (Devin, 60 s, exit 0: a rename of `replayPath`'s `path` parameter to `savePath`, which Devin found already in place and did not write). It had written no doc briefs. The session wrote nine (`../w4-build/briefs/d01.md` to `d09.md`) and ran them through Pi `llmgateway/mimo-v2.6-pro` at `high`, each exit 0 with `STATUS: DONE` (78 s to 550 s).

The leaf's stray `no-such-report-dir/` at the worktree root (build evidence, "Stray folder") was moved to the session scratchpad, not deleted.

## 2. Session verification from the final state

`$SP/w4v/gates-022.sh`, run once from the final state, with logging stubs for `jev` and `cli-deem` first on `PATH` and every output under the session scratchpad.

- G1: `npx tsx evals/score-alignment-suggestion.ts --report <dir>` exit 0, 0 stub calls: `committed: files=6 events=3 skipped_source=1`, `committed path cli: aligned=0 moderate=1 low=2 infrastructure=0 below50=2 with_alternatives=0 without_alternatives=2 hard_blocks=2 picks=0`, `committed path data:` all zero, `replay cli: validateContentAlignment root=specs numbered_folders=0 decision=low alternatives listed: 0`, `replay data: validateFolderAlignment root=synthetic numbered_folders=3 decision=low alternatives listed: 2`, `transcript events: not measured`.
- G2: `--transcripts <empty dir> --rows-out <file>` exit 0, `rows written: 0`. `--score <rows> --deem --out <dir>` exit 0, `stop: fewer than 30 labeled rows (0 labeled)`, the `--out` folder not created, 0 stub calls. `--report ./inside-report` exit 2, `refused: --report path is inside the repository`, no folder made.
- G3: `npx vitest run --config ../../vitest.config.ts --project cli tests/score-alignment-suggestion.vitest.ts` `Tests 42 passed (42)`, exit 0.
- G4: `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the script exit 1; `git status --porcelain` on the skill equal before and after G1 and G2.
- G5: `validate_document.py` exit 0 on all 9 changed docs (the catalog index with `--type feature_catalog`, the playbook index with `--type playbook`). Comment hygiene checker exit 0 on the script and its test.
- Suites against the leaf's baseline: cli project suite `Test Files 158 passed | 3 skipped (161)`, `Tests 1644 passed | 19 skipped (1663)`, exit 0 (baseline 157 files and 1,602 tests: +1 file, +42 tests). `npm run typecheck` exit 0. Both import policy checks and the architecture boundary check exit 0. Code route `verify_alignment_drift.py` `Findings: 0`.
- Packages: playbook `PASS package=system-spec-kit tier=FAIL_CLOSED scenarios=87 ... violations=0 warnings=1` (baseline 86 scenarios). Catalog `WARN tier=warn violations=86` against the baseline's 85. The one new warning is `root_leaf_description_mismatch` on the new entry: the root block's description and the leaf's frontmatter `description` say the same thing in different words.
- Generators: `sync-skills-hermes.cjs --check` `PASS: 72 Hermes skill copies in sync` (the `system-spec-kit` copy regenerated).

## 3. Cross-family review

Read-only, split by author family, briefs `review-pi.md` and `review-devin.md` (each carries the diff), logs in `logs/`. SHA-1 over the 12 reviewed files in `files.txt` `66cc989898bf8a32a738e4c646175288ddec153f` before and after both runs.

- Pi MiMo on the code Devin wrote (798 s): `VERDICT: PASS`, REQ-001 to REQ-009 met, 3 P2.
- Devin DeepSeek on the docs Pi wrote (393 s): `VERDICT: PASS`, REQ-001 to REQ-010 met, 5 P2.

Fixed although rated P2, because the goal asks for docs true to the code (Pi fix briefs `fix/f1.md` to `fix/f4.md`, run in parallel, each exit 0 with `STATUS: DONE` and its validator exit 0):
1. Devin: the changelog and the catalog entry said `--rows-out` writes one row per event, while the writer keeps only low or infrastructure events that list alternatives. Both now say so (`f1`, `f2`).
2. Devin: the catalog entry carried `version: 4.3.0.0`, now 4.4.0.0 (`f1`).
3. Session: the catalog entry's overview used the brief's shorthand `S` for the script ("S measures", "S holds"), now "The script measures" and "It holds" (`f1`). The same search over every doc committed for 019, 020, 023, 024 and 035 found no other case.
4. Session: the catalog package warning `root_leaf_description_mismatch`. The root block's description now equals the entry's frontmatter (`f3`), and the package is back to the baseline's `violations=85`.
5. Devin: the evals README tree omitted the script. One tree line added (`f4`).

P2 findings, recorded, not chased (parent D5):
1. Pi and Devin: the arm-start `jev auth test` record in `calls.jsonl` uses `status: "auth"` with `row_id: null`, outside REQ-007's three statuses.
2. Pi: a retried exit-4 call leaves one record, not one per spawn, so the first exit 4 is never recorded.
3. Pi: the rows writer can emit `target: null` when a data-path event's `Alignment check:` header sits more than 8 lines from its decision, and `--score` then rejects the whole file with `bad row at line N`.
4. Devin: the Jev auth-test call has no exit-4 retry, and exit 130 prints `auth test failed` where phase 002 prints `interrupted`.
5. Devin: the trigger index is stale for the new docs until the session rebuilds it after the commit.

Recheck: Devin, read-only, `fix/recheck.md` (64 s): all four fixes closed, `VERDICT: PASS`. SHA-1 over the reviewed files `d33c0a9df5278b37610b19d3e35d1d1f0a8f1607` before and after.

## 4. Commit

`ba70806077` feat(system-spec-kit): the script, its test, the 10 docs and the Hermes copy, 12 files, not pushed. Before it `sync-skills-hermes.cjs --check` listed no drift for `system-spec-kit`, `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`, README verdict parity `PARITY PASS` and the README manifest `manifest=reproducible`. `system-spec-kit` is not a compiled hub, so no re-mint ran. The trigger index follows in its own commit.

## 5. Open for the operator

- 30 operator labels on a row sheet built from the operator's transcripts (`--transcripts <dir> --rows-out <file>`), then a live Deem run, and a Jev run on the operator's yes.
- The P2 findings above.

## 6. Scratch kept out of the commit

- The stray `no-such-report-dir/` the build leaf's test run wrote at the worktree root was moved to the session scratchpad (build evidence, "Stray folder").
- Closure: Pi MiMo, 1,419 s, exit 0. The session reran from the final state: `repair-derived.cjs` (dry run) `repairable=0`, `validate.sh --strict` `RESULT: PASSED` with Errors 0 and Warnings 0, `check-goal.cjs` `RESULT: PASSED (5/5 checks)`, `goal.cjs packet` `packet_durable_chars=3580`. Status `Complete` at the label-gate stop.
