# Build evidence: 003 goal verifier, to the label gate

Build orchestrator leaf, 2026-09-28. Worktree 069 at HEAD `996cf85eef` when this build started. Executors by Bash through the session's `dispatch.sh`: Devin `deepseek-v4-1-flash-max` and Pi `llmgateway/mimo-v2.6-pro` at `--thinking high` (operator roster of 2026-09-28 20:30). This file records counts, dates, file names and hashes only. It holds no session or row text.

## 1. Baselines (before the first dispatch)

| Gate | Command | Result | Exit |
|------|---------|--------|------|
| Goal hooks suite | `node --test` on the six files in `.skilled/hooks/goal/README.md` section 8 | tests 146, pass 146, fail 0 | 0 |
| Plugin goal suites, plain | `node --test .skilled/plugins/tests/opencode-goal-*.test.cjs .skilled/plugins/tests/goal-doc-contract.test.cjs` | tests 143, pass 8, fail 135, every failure `ERR_MODULE_NOT_FOUND` for `@opencode-ai/plugin` | 1 |
| Plugin goal suites, `--preserve-symlinks --preserve-symlinks-main` | same files | tests 143, pass 142, fail 1 (the doc-contract test spawns a nested `node --test` without the flag, same module error) | 1 |
| Goal README | `validate_document.py .skilled/hooks/goal/README.md` | `VALID`, 0 issues | 0 |
| Hub README | `validate_document.py .skilled/hooks/README.md` | `VALID`, 0 issues | 0 |
| Phase strict validate | `validate.sh <phase> --strict` | `Errors: 0  Warnings: 0`, `RESULT: PASSED` | 0 |
| Phase goal | `check-goal.cjs <phase>` | `RESULT: PASSED (5/5 checks)` | 0 |
| Alignment drift | `verify_alignment_drift.py --root .skilled/hooks/goal` | 13 files, 0 findings | 0 |

Environment finding: this worktree has no `.opencode/node_modules`, so the OpenCode goal plugin cannot load under plain Node here (the main checkout has it). `.skilled/node_modules/@opencode-ai/plugin` exists in both, and Node finds it when the plugin is loaded through the `.skilled/plugins` symlink with `--preserve-symlinks`. Installing `.opencode/node_modules` would be an install (parent D7), so the build does not do it. The plugin suites are unchanged by this phase and are recorded only as context.

Raw logs: `baseline/`.

## 2. Proof plan

Criteria from the phase `goal.md`, read at the label gate (parent D4).

| # | Criterion | Command | Expected |
|---|-----------|---------|----------|
| 1 | Census prints its method first, per-session counts, no text, named error on an unknown type | `node .skilled/hooks/goal/lib/count-pi-goal-nudges.mjs --dir ~/.pi/agent/sessions` to a file, read exit; grep the output for message text; `node --test .../count-pi-goal-nudges.test.mjs` | Line 1 starts `method:`, exit 0, no message text, test passes including the unknown-type case |
| 2 | Scorer with no flag: stop under 30 rows, else three arms, tables with `unclear` on its own row, errors per check, clamp count, stubs log no call | `node --test .../score-verifier-labeled-set.test.cjs`; scorer on the builder's unlabeled file | Tests pass; the unlabeled file prints `stop: fewer than 30 rows`, exit 0 |
| 3 | `stop: no headroom` names the clamp fix, no model arm code | scorer test's no-headroom case; `grep -c` for model-arm code | Line and finding printed; 0 model-arm matches |
| 4 | At the label gate no model arm and no `--jev` or `--deem` flag | scorer with `--jev` and with `--deem` | `error: unknown flag`, exit 2 |
| 5 | Keep or drop past the gate | none at the gate | Not applicable at the label gate |
| 6 | Plugin unchanged at the gate | `git diff --quiet -- .opencode/plugins/opencode-goal.js` | exit 0 |
| 7 | Scope | `git status --porcelain` | Only the census, builder, scorer, their tests, the two hooks READMEs, this phase scratch, and the untracked fixture |
| extra | Builder run | builder on `~/.pi/agent/sessions` | Row count, per-source counts, sha256, file untracked and never staged |
| extra | Goal hooks suite | the section 8 command plus the three new tests | 146 plus the new tests, 0 fail |
| extra | Docs | `validate_document.py` on both READMEs | exit 0 each |

## 3. Census run (orchestrator, read only, parent D4 and phase D10)

Command: `node .skilled/hooks/goal/lib/count-pi-goal-nudges.mjs --dir ~/.pi/agent/sessions`, bounded by a 300 s alarm. Exit 0 in 7 s, 43 stdout lines, empty stderr. The raw output stayed outside the repository.

No-text check: every one of the 43 lines matches one of the three fixed shapes (`method:`, `session: file=<path>.jsonl <counters>`, `totals:`), 0 non-matching, and `grep -c -E "goal_verify|Evidence|reason=|\[active_goal"` finds 0.

Method line, verbatim: `method: unit=one custom_message record with customType goal-verify-nudge, files_scanned=5919, window=2026-07-29..2026-08-10 from the record timestamp field`

Totals line, verbatim: `totals: sessions_with_nudges=41 nudges=1822 not-met=407 unclear=1415 other_verdict=0 met=not_recorded too_short=243 blocking=407 truncated=431 no_completion=621 weak_link=120 other=0 first=2026-07-29 last=2026-08-10`

An independent count I ran before the build (a throwaway walk over the same directory, outside the repository) found the same 1,822 records, 407 `not-met` and 1,415 `unclear`, and the same five reason counts.

Reconciliation of the two recorded figures, by project directory (only this repository's directory is named):

| Scope | Files | Nudges | Dates |
|-------|-------|--------|-------|
| `--Users-michelkerkmeester-MEGA-Development-Code_Environment-Public--`, top level | 27 | 1,452 | 2026-07-29 to 2026-08-10 |
| Same directory, session files in nested subfolders | 10 | 164 | 2026-08-10 |
| One directory of a worktree of this repository | 1 | 5 | 2026-08-08 |
| One other project's directory | 3 | 201 | 2026-08-10 |
| Whole `~/.pi/agent/sessions` | 41 | 1,822 | 2026-07-29 to 2026-08-10 |

- The raw count of 1,616 matches in 37 files (2026-09-27) is this repository's directory with its nested files: 1,452 + 164 in 27 + 10 files.
- The final synthesis's 1,457 nudges in 28 sessions is this repository's 27 top-level files plus the one worktree file: 1,452 + 5 in 27 + 1. It left out the nested files.
- Every recorded nudge is dated 2026-07-29 to 2026-08-10, so none comes from after the 2026-09-27 delivery change. For the open question "Does the operator still run Pi goals?" the census shows no recorded nudge after 2026-08-10. Whether goals ran later without a non-`met` turn being written is not visible in these files.
- Pi records no `met` turn, so the census has no denominator (as the spec says).

## 4. Builder run at the label gate (orchestrator, read only on `~/.pi`)

Command: `node .skilled/hooks/goal/lib/build-verifier-fixture.cjs --pi ~/.pi/agent/sessions --out .skilled/hooks/goal/lib/verifier-labeled-set.jsonl`, 300 s alarm. Pi sessions only: the operator has named no Claude transcript directory, so no `--claude` (open question, below). The output file did not exist before the run.

Result: exit 0 in 10 s, empty stderr. Stdout, verbatim: `built: rows=50 pi=50 claude=0 candidates_pi=1257 candidates_claude=0 skipped_pi_no_turn=144 skipped_pi_no_objective=421 skipped_claude=0 pi_recorded_reproduced=38 out=.skilled/hooks/goal/lib/verifier-labeled-set.jsonl`

| Measure | Value |
|---------|-------|
| Rows | 50 (pi 50, claude 0) |
| Candidates plus skips | 1,257 + 144 + 421 = 1,822, equal to the census total |
| Rows per recorded reason | too_short 10, blocking 10, truncated 10, no_completion 10, weak_link 10 |
| Rows longer than 1,200 characters | 20 |
| Empty `label` | 50 of 50 (no model wrote a label) |
| Empty `prelabel` | 50 of 50 (no Claude rows) |
| Rows whose recorded verdict and reason goal-core reproduces on the paired turn text and the objective line from the injected brief | 38 of 50 |
| File mode, size | `-rw-------`, 261,233 bytes |
| sha256 | `25f40db46985169a63ae28a2b7fcb2e289c62360ec6db1a36c66810fa5e66f4f` |
| `git status --porcelain -- <file>` | `?? .skilled/hooks/goal/lib/verifier-labeled-set.jsonl` (untracked, not ignored). Never staged or copied |

Inferred, not verified: the 12 rows that do not reproduce most likely differ because Pi judged against the goal record's full objective, while the builder recovers only the `objective:` line of the injected brief (a preview, and for a packet-bound goal the slice headline). Comparing the objectives would need the goal records, which this build did not read.

## 5. Dispatches

One dispatch at a time through `dispatch.sh`. After each: read `<NN>.last.txt` for the HANDBACK, diff `git status --porcelain` for this phase's paths (`.skilled/hooks/`, `.opencode/plugins/`, this phase folder), diff the touched files against a snapshot, and run the brief's own check plus its test.

| Brief | Executor | Seconds | Files | Result | Orchestrator check |
|-------|----------|---------|-------|--------|--------------------|
| 01 census | devin | 349 | `count-pi-goal-nudges.mjs`, `.test.mjs` (new) | DONE | Test 3 of 3 pass. Review: the method line at `:205` dropped "from the record timestamp field", which REQ-013 requires, so 01b |
| 01b census method line | pi | 78 | same two files, one line each | DONE | `diff` against the snapshot shows exactly the two lines; test 3 of 3 pass |
| 02 builder, Pi path | devin | 765 | `build-verifier-fixture.cjs`, `.test.cjs` (new) | DONE | Test 3 of 3 pass; code read in full, matches the brief |
| 03 builder, Claude path | pi | 616 | same two files | DONE | Test 5 of 5 pass; `diff -u` against the snapshot shows only the named edits (header, new section, `buildRows`, `--claude`, stdout line, export, renumbered dividers) |
| 04 scorer loader | devin | 315 | `score-verifier-labeled-set.cjs`, `.test.cjs` (new) | DONE | Test 5 of 5 pass; code read in full, matches the brief |
| 05 scorer report lines | pi | 236 | `score-verifier-labeled-set.cjs`, `.test.cjs` | DONE | `diff -u` against the snapshot shows only the new REPORT section, the renumbered EXPORTS divider and the extended export; test 6 of 6 pass |
| 06 scorer arms and CLI | devin | 230 | `score-verifier-labeled-set.cjs`, `.test.cjs` | DONE | Tree diff shows only the two scorer files (two new `system-spec-kit` paths belong to a parallel build). `diff -u` shows imports, constants, ARMS, MAIN, renumbered dividers, exports and the main guard; the IMPORTS "None" line was replaced, a correct deviation from "keep existing lines". Test 9 of 9 pass; no `goal-verifier-score-` temp dir left; real goal state dir unchanged (README only). Both file headers now stale, so 07b |
| 07 scorer stop and gate lines | pi | 352 | `score-verifier-labeled-set.cjs`, `.test.cjs` | DONE | Tree status unchanged; `diff -u` shows only `decisionLines`, the three-line `main` change, the export and the three appended tests; test 12 of 12 pass |
| 07b scorer and test file headers | pi | 90 | `score-verifier-labeled-set.cjs`, `.test.cjs` | DONE | `diff` shows only the header box lines; box widths uniform; test 12 of 12 pass |
| 08 goal hooks README | pi | 440 | `.skilled/hooks/goal/README.md` | DONE | `git diff` shows exactly the five edits (+24/-5); no em dash added (the file holds 2, both in HEAD); `validate_document.py` VALID, 0 issues, exit 0. New `sk-doc` paths in the tree belong to a parallel build |

Totals: 11 briefs, Devin 4 (01, 02, 04, 06), Pi 7 (01b, 03, 05, 07, 07b, 08, 09), pi-cline 0, Cursor 0 (retired). No brief failed, no dispatch hit a rate limit and none was retried. 01b and 07b are follow-up briefs for defects found in review, not retries: 01b restores the method-line wording REQ-013 requires, 07b rewrites the two file headers that 06 made stale. Every brief is under 90 lines.

## 6. Final checks (from the final state)

| Check | Command | Result | Exit |
|-------|---------|--------|------|
| Proof 1, census | census run in section 3; `node --test .../count-pi-goal-nudges.test.mjs` inside the suite below | Line 1 starts `method:` and names the timestamp field, 0 text markers, unknown-type test passes | 0 |
| Proof 2, scorer on the unlabeled fixture | `node --preserve-symlinks .../score-verifier-labeled-set.cjs --set .skilled/hooks/goal/lib/verifier-labeled-set.jsonl` | `scorer: rows=50 labeled=0 unlabeled=50 claude=0 pi=50`, `stop: fewer than 30 rows`, empty stderr. Output holds no row text | 0 |
| Proof 2, scorer on a synthetic 30-row set | same, `--set` a synthetic set in the session scratchpad (the test's SET30) | 3 arms, 4 table rows each with `unclear` on its own row, `clamp_defects: 1`, `wrapper: held=1`, `better: arm=tail_window false_met=0 false_not_met_rate=0.00`, `stop: no headroom` and the clamp-fix finding | 0 |
| Proof 2, stub binaries | scorer test "main scores the set through the plugin arms" | Stub `jev` and `cli-deem` on `PATH` write no log | 0 |
| Proof 3, no model-arm code | `grep -n -E "spawn\|execFile\|execSync\|child_process\|127\.0\.0\.1\|8300\|fetch\(\|'jev'\|cli-deem\|deem"` on the scorer | 2 matches, both text: the header sentence "It spawns no model binary" and the output line `gate: deem arm condition holds`. 0 call sites | 0 |
| Proof 4, flags | scorer with `--jev`, then `--deem` | `error: unknown flag --jev`, `error: unknown flag --deem`, empty stdout | 2 each |
| Proof 6, plugin unchanged | `git diff --quiet -- .opencode/plugins/opencode-goal.js` | no diff | 0 |
| D8, redaction code unchanged | `git diff --quiet -- .skilled/hooks/goal/lib/goal-core.cjs .skilled/skills/system-spec-kit/shared/parsing/secret-scrubber.ts` | no diff | 0 |
| Scorer without the symlink flag | `node .../score-verifier-labeled-set.cjs --set <synthetic set>` | `error: cannot load the goal plugin at <path>: ERR_MODULE_NOT_FOUND. Where .opencode/node_modules is absent, run node with --preserve-symlinks` | 2 |
| Goal hooks suite | the README section 8 `node --test` block, now nine files | tests 166, pass 166, fail 0 (baseline 146, delta +20: census 3, builder 5, scorer 12) | 0 |
| Plugin goal suites, plain | as baseline | tests 143, pass 8, fail 135 (delta 0) | 1 |
| Plugin goal suites, symlink flags | as baseline | tests 143, pass 142, fail 1, the same doc-contract test (delta 0) | 1 |
| Goal README | `validate_document.py .skilled/hooks/goal/README.md` | `VALID`, 0 issues | 0 |
| Hub README | `validate_document.py .skilled/hooks/README.md` | `VALID`, 0 issues | 0 |
| Alignment drift, tracked | `verify_alignment_drift.py --root .skilled/hooks/goal` | 13 files, 0 findings (delta 0). The script scans only `git ls-files` paths, so it skips the six new untracked files | 0 |
| Alignment drift, new files | same script on a copy of the six new code files outside any checkout, default and `--check-exact-headers` | 6 files, 0 findings each run; copy removed | 0 |
| Syntax | `node --check` on the six new code files | all clean | 0 |
| Comment hygiene | `grep -n -E "specs/\|REQ-[0-9]\|\bT0[0-9]{2}\b\|\bD[0-9]\b\|phase 0\|packet [0-9]\|003-goal\|cli-jev/"` on the six files | 0 matches | 1 (no match) |
| Em dash | `grep -c` for U+2014 on the six files | 0 in each. The goal README holds 2, both in HEAD; the edit adds none | n/a |
| Phase strict validate | `validate.sh <phase> --strict` | `Errors: 0  Warnings: 0`, `RESULT: PASSED` | 0 |
| Phase goal | `check-goal.cjs <phase>` | `RESULT: PASSED (5/5 checks)` | 0 |
| Fixture | `shasum -a 256`, `ls -l`, `git status --porcelain`, `git check-ignore` | sha256 unchanged `25f40db4...66f4f`, `-rw-------`, 261,233 bytes, `??`, not ignored | n/a |
| Real goal state | `find .skilled/skills/.state/goal -type f` before and after the scorer runs | 1 file (its README) both times; no `goal-verifier-score-` temp dir left | n/a |

## 7. Deviations

- `build-verifier-fixture.test.cjs` added. The spec file table (`spec.md:128-132`) lists no builder test. Criterion 7 names "their tests" and the sk-code coverage floor needs one, and the builder refuses to overwrite and writes mode `0600`, which only a test proves.
- A Claude row's native `goal_status` result goes to `prelabel`, and `label` stays empty on every row. `spec.md:54` says Claude rows "arrive pre-labeled"; parent D4 (no model writes a label) wins, and the operator's open question at `spec.md:271` stays open.
- Not built, because the build list in the orchestrator brief leaves them out: T028's optional claims column (`tasks.md:61`, REQ-015 at `spec.md:183`) and the census `--from`/`--to` window (`plan.md:100`). The census covers every date, as T026 (`tasks.md:54`) asks.
- The scorer test has no fake Deem server (`spec.md:132`). No Deem arm exists at the label gate, so stub `jev` and `cli-deem` on `PATH` are the zero-call proof.
- The goal README section 7 Imports row changed: "Nothing imports the plugin." (`README.md:145` before the edit) became false once the scorer imported the plugin for its `__test` helpers.
- Brief 06 replaced the IMPORTS placeholder "None: label, verdict and reason handling is pure string work." against the brief's "keep existing lines". The line had become false, so the replacement stands.
- The scorer loads the plugin through the `.skilled/plugins` link and needs `--preserve-symlinks` in this worktree. The tests spawn it with the flag, and without it the scorer exits 2 with a named error. The README command for the scorer is not shown, so no doc states the flag outside the error text.
- Executor roster: the operator's amendment of 2026-09-28 20:30 (Devin plus Pi on MiMo V2.6 Pro, Cursor retired) replaced the roster that `plan.md:118` and `goal.md:187` state (Pi on Cline DeepSeek, Cursor Grok). This build followed the amendment. The phase docs are outside this build's write scope and still name the old roster.
- The prompt-quality card's Tier 2 improver pass was not run: it needs an agent dispatch, which this build may not make. Each brief was checked by hand against the card's one-change, literal-text and accept-line rules instead.

## 8. Stale premises

| Where | Premise | What this build found |
|-------|---------|------------------------|
| `spec.md:247`, `spec.md:265`, `goal.md:202` | 1,457 nudges in 28 sessions against 1,616 matches in 37 files | Both are subsets of 1,822 in 41 files; section 3 reconciles them |
| `spec.md:263` | "Pi's 253 truncation-branch nudges" | The census counts 431 `truncated` nudges over all 41 files. The scope of the 253 figure is UNKNOWN from this build |
| `spec.md:264` | Does the operator still run Pi goals | No recorded nudge after 2026-08-10 (section 3) |
| `spec.md:273` | Totals before and after the 2026-09-27 delivery change | All 1,822 are dated before it, 0 after |
| `plan.md:118`, `goal.md:187` | Executor roster | Superseded by the operator's 2026-09-28 20:30 amendment (section 7) |
| `.skilled/hooks/goal/README.md:145` (before the edit) | "Nothing imports the plugin." | Made false by the scorer and corrected in brief 08 |

## 9. Open items

- Finding for the redaction owners (T023, phase D8, not edited here). Confirmed on synthetic strings: a value of 19 to 23 characters after `TYPESAFE_API_KEY=` or `SERVICE_TOKEN=` survives `goal-core.cjs:374` (`redactEvidence`), the plugin's regex chain at `opencode-goal.js:465-474` and `secret-scrubber.ts:128` (`scrubSecrets`). A bare `API_KEY=` is redacted by all three. Cause: `\b` cannot match between `_` and `API` or `TOKEN`, because `_` is a word character, and the generic rule needs 48 characters. Owners: the goal hooks and plugin owners for the first two, system-spec-kit for the scrubber.
- Open operator questions, recorded and not answered: whether a Claude row's native pre-label may stand under parent D4 (`spec.md:271`), and which Claude transcript directory the builder reads (`spec.md:272`). Until then the fixture holds Pi rows only.
- The fixture `.skilled/hooks/goal/lib/verifier-labeled-set.jsonl` is untracked and not ignored. It holds the operator's own conversation text and this repository is public. Whoever commits this phase must leave it out of every commit (REQ-012). Labeling it is the operator's next step, and the scorer needs 30 labeled rows.
- 12 of the 50 rows do not reproduce their recorded verdict and reason (section 4). The cause stated there is inferred.
- The plugin suites cannot load in this worktree without `.opencode/node_modules`. Installing it is an install (parent D7), so the build did not.
- Cross-family code review and the path-scoped commit are the orchestrator session's (`plan.md:118`). Nothing here is staged or committed.
