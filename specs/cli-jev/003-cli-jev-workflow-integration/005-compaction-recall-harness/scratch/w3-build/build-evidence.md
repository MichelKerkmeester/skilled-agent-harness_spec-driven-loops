# Build evidence: 005-compaction-recall-harness

Build orchestrator leaf, 2026-09-28, worktree `069-cli-jev-workflow-integration`, HEAD `2d101bd6d8` at the start. Nothing here is committed. `W` = `specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness/scratch/w3-build`. This file is filled in as the build runs, and the final sections are written at the end.

## 1. Baseline (captured before the first code dispatch)

| Gate | Command | Result | Exit |
|---|---|---|---|
| Runtime suite (supported runner) | `npm run test:sharded` in `runtime/` | every shard `FileNotFoundError ... runtime/node_modules/.bin/vitest`, then `[sharded] 12 shard(s), 12 failing` | 1 |
| Runtime suite (same 12 shards, hoisted vitest) | `W/baseline/run-shards.sh` = `../node_modules/.bin/vitest run --shard=i/12` per shard | files 259 passed, 3 failed, 3 skipped, and tests 3984 passed, 9 failed, 21 skipped (`W/baseline/shards/aggregate.txt`). Failing: `authorized-ledger.vitest.ts` (1 test), `completion-evidence-pi-extension.vitest.ts` (file), `spec-gate-pi-extension.vitest.ts` (7 tests) | shards 3, 5, 6 exit 1, rest 0 |
| cli project suite | from `runtime/cli`: `npx vitest run --config ../../vitest.config.ts --project cli` | `Test Files 157 passed \| 3 skipped (160)`, `Tests 1602 passed \| 19 skipped (1621)`, 360 s | 0 |
| validate_document, 5 docs to change | `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <doc>` | all `VALID`, and the two index files carry the `document_type_fallback` warning | 0 each |
| Playbook package | `validate-playbook-package.cjs --package system-spec-kit` | `PASS ... scenarios=85 ... violations=0 warnings=1` | 0 |
| Catalog package | `validate_catalog_package.py --package system-spec-kit` | `WARN tier=warn violations=85` | 0 |
| Skill root metadata | `ci-skill-root-metadata.cjs` | `checked=16 passed=16 failed=0 fixed=0` | 0 |
| Hermes copies | `sync-skills-hermes.cjs --check` | `PASS: 73 Hermes skill copies in sync` | 0 |
| Phase strict validate | `validate.sh <phase> --strict` | `Errors: 0  Warnings: 0`, `RESULT: PASSED` | 0 |
| Code route | `verify_alignment_drift.py --root .../runtime/scripts` | `PASS`, 3 files, 0 findings | 0 |

## 2. Proof plan

| Row | Command | Expected |
|---|---|---|
| G1 (goal criterion 1) | from `runtime/`: `npm test -- --run tests/compaction-recall.vitest.ts`, and the same file through the hoisted binary `npx vitest run tests/compaction-recall.vitest.ts` | 12 passed, exit 0 |
| G2 (criterion 2, spec proof 2 and 4) | census over the transcript directory with `--newest-compacted 15`, then `W/runs/count-boundaries.mjs` over the 15 basenames the census used | `method:`, `scope:`, `selection:`, one `row` per boundary, one `stop:` line, and the scope total equals the independent count |
| G3 (criterion 3, REQ-001) | the G2 run with stub `jev` and `cli-deem` first on `PATH`, logging each call | both logs absent or empty |
| G4 (criterion 4, REQ-006) | `grep -niE 'api_key\|apikey\|secret\|bearer' S T` | no match, exit 1 |
| G5 (criterion 5, REQ-007) | `git status --porcelain` against the allowed paths, plus a size and mtime listing of the transcript directory before and after the census | only Files to Change paths, and no census-caused change in the directory |
| G6 (criterion 6) | `validate.sh <phase> --strict` | `RESULT: PASSED` |
| T020 | `node S --out $OUT`, then `node S --transcripts $NAMED --out $NAMED/r.json` | `no transcripts named` exit 2, then `refused: report path inside transcript directory` exit 2 |
| Canary (spec proof 3) | vitest canary case, and `grep -c CANARY-` on a fixture-run report | 0 |
| Code route | `verify_alignment_drift.py --root .../runtime/scripts/compaction-recall` | exit 0 |
| Skill docs | `validate_document.py` on every changed or created skill doc | exit 0 each |
| Suites | runtime shards and the `cli` project, baseline against final | no new failure |

## 3. Dispatches (one at a time, `W/briefs/run-brief.sh`, logs in `W/logs/`)

Each row: after the dispatch I read `<NN>.last.txt`, diffed `<NN>.pre-status.txt` against `<NN>.post-status.txt` (paths of the parallel 003 and 006 lanes left out), diffed S and T against the `<NN>.pre.*` copies, ran `node --check S` and ran the focused suite from `runtime/`: `perl -e 'alarm shift; exec @ARGV' 300 npx vitest run tests/compaction-recall.vitest.ts` (output in `<NN>.vitest.txt`).

| NN | Brief | Executor, model | Seconds | Handback | Status diff (own lane) | Focused suite |
|---|---|---|---|---|---|---|
| 00 | fixtures (cp of 6 files) | pi, llmgateway/mimo-v2.6-pro | 56 | DONE | F added | n/a, `cmp` same for all 6 |
| 01 | core census | devin, deepseek-v4-1-flash-max | 236 | DONE | S and T added, nothing else | `Tests 3 passed (3)`, exit 0 |
| 02 | `--newest-compacted` | devin, same | 537 | DONE | S and T only | `Tests 5 passed (5)`, exit 0 |
| 03 | fit port and fit column | devin, same | 388 | DONE | S and T only | `Tests 6 passed (6)`, exit 0 |
| 04 | offline reduction, stop line share | devin, same | 160 | DONE | S and T only | `Tests 6 passed (6)`, exit 0 |
| 05 | recorded brief and summary | devin, same | 636 | DONE | S and T only | `Tests 7 passed (7)`, exit 0 |
| 06 | five must-survive rules | devin, same | 715 | DONE | S and T only | `Tests 9 passed (9)`, exit 0 |
| 07 | `--replay` | devin, same | 434 | DONE | S and T only, nothing under `runtime/dist` or `runtime/hooks` | `Tests 10 passed (10)`, exit 0 |
| 08 | string guard, privacy and zero-call cases | devin, same | 562 | DONE | S and T only | `Tests 12 passed (12)`, exit 0 |
| 09 | scripts README | pi, llmgateway/mimo-v2.6-pro | 59 | DONE | `runtime/scripts/README.md` only, +4/-1 | n/a |
| 10 | SKILL.md version and Quick Reference row | pi, same | 34 | DONE | `SKILL.md` only, +2/-1 | n/a |
| 11 | skill README paragraph | pi, same | 62 | DONE | `README.md` only, +6/-0 | n/a |
| 12 | changelog v4.3.0.0 (cp) | pi, same | 38 | DONE | `changelog/v4.3.0.0.md` added, `cmp` same | n/a |
| 13 | catalog entry (cp) | pi, same | 32 | DONE | catalog entry added, `cmp` same | n/a |
| 14 | catalog index block | pi, same | 45 | DONE | `feature-catalog.md` only, +16/-0, headings at 106 and 122 | n/a |
| 15 | playbook scenario 460 (cp) | pi, same | 28 | DONE | scenario added, `cmp` same | n/a |
| 16 | playbook index row | pi, same | 40 | DONE | `manual-testing-playbook.md` only, +1/-0, row at 202 | n/a |

Notes on the dispatches:
- Before 04, I edited brief 04 step 4 to say that x in the stop line is the share of `fit_throw` rows, not the count. The core brief had printed the count. This was a brief correction before the first dispatch, not a re-dispatch.
- Before 06, I replaced the raw U+2028 character in brief 06 with the text `'\u2028'`, so the executor reads an escape and not an invisible byte.
- The port check is independent of Devin's own claim. `node W/runs/port-diff.mjs` imports the vendored `state.ts` and `transcript.ts` (type-stripped by Node 26) next to S and compares `collectToolCalls`, `fitState` (at 25000 and 4000 tokens), `estimateTokens` and `toMessage` on seeded synthetic messages and the 36 fixture records. It printed `cases=428 mismatches=0 fixture_records=36 stages={"full":48,"inputs<=60":2,"inputs<=200":4,"texts abridged":2,"throw":61,"old messages left out":6,"old calls compacted":5}`, exit 0. `truncatedResultText` matches `compact.ts:138-144` line for line by eye.
- The tree changed outside this lane during the dispatches, and none of it came from these briefs. Parallel lane 003 committed `1da5b193d2` on top of `975f57f2f0` (HEAD was `2d101bd6d8` at baseline). `.hermes/skills/sk-create-goal/SKILL.md` turned `M` at 23:04 during dispatch 05. That file is the Hermes copy of sk-create-goal, which is lane 006's, and Devin's handback does not name it.

Brief count: 17 briefs, 17 dispatches, 0 re-dispatches, 0 BLOCKED. Devin ran 8 (01 to 08) and Pi ran 9 (00, 09 to 16). Brief 09's accept line said +3/-1. Git counts the replaced sentence line as one insertion and one deletion, so the true figure is +4/-1 with exactly the named text. I accepted it. A first loop over 12 and 13 failed before dispatch because zsh does not word-split `$n`, so `run-brief.sh` got bad arguments and exited 1 in 0 s. It wrote no log and changed no file. I then ran 12 and 13 one at a time. This is not counted as a re-dispatch because no executor ran.

Before brief 08, I widened the guard's allowed basenames in brief 08 and in `ref/design.md` section 11 from "files this run read" to every file the run listed (read, stopped or skipped as oversized). The old wording would have voided a census that skipped an oversized file. After brief 08, I corrected one sentence in `briefs/content/catalog-entry.md` before brief 13 copied it: "up to the size it had when it was listed" became "just before the census read it". The non-selection path stats again when it parses.

## 4. Checks at the final state

| Row | Command | Result line | Exit |
|---|---|---|---|
| G1, hoisted | from `runtime/`: `npx vitest run tests/compaction-recall.vitest.ts` (`W/final/g1-hoisted.txt`) | `Test Files 1 passed (1)`, `Tests 12 passed (12)` | 0 |
| G1, as written | from `runtime/`: `npm test -- --run tests/compaction-recall.vitest.ts` (`W/final/g1-npm-test.txt`) | `FileNotFoundError: ... runtime/node_modules/.bin/vitest`, `npm error Lifecycle script test failed` | 1 |
| G2 | `PATH=<stub>:$PATH node S --transcripts ~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public --newest-compacted 15 --out <session scratchpad>/d4/report.json` | `scope: 15 main-session files, 0 subagent files, 171 boundaries (171 main, 0 subagent)` and one `stop:` line (section 5), 5 s | 0 |
| G2, independent count | `node W/runs/count-boundaries.mjs <dir> <the 15 basenames>`, run straight after | `total files=15 boundaries=171`, every file equal to the census (section 5) | 0 |
| G2, independent selection | the same count over all 87 top-level files, newest first by mtime | the newest 15 with a boundary are the census's 15 in the same order, and the 15th is file 29, matching `29 read`. `total files=87 boundaries=253` | 0 |
| G2, text cross-check | `grep -c '"subtype":"compact_boundary"'` per file over the 15 | sum 171 | 0 |
| G3 | stub `jev` and `cli-deem` first on `PATH` for the G2 run, each appending to a log | the log directory is empty after the run: no `jev.log`, no `cli-deem.log` | n/a |
| G4 | `grep -niE 'api_key\|apikey\|secret\|bearer' S T` | no output | 1 |
| G5, tree | `git status --porcelain` before and after the G2 run | identical (`diff` exit 0) | 0 |
| G5, transcripts | `W/runs/list-dir.mjs` (name, size, mtime of 87 top-level files) before and after the G2 run | identical (`diff` exit 0) | 0 |
| G6 | `validate.sh specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness --strict` | `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED` | 0 |
| T020 a | `node S --out <scratch>/out.json` | `no transcripts named` | 2 |
| T020 b | `node S --transcripts <scratch>/named --out <scratch>/named/r.json` | `refused: report path inside transcript directory`, no file written | 2 |
| T020 c | the same through a symlink to `named`, `--out` under the real `named` | `refused: report path inside transcript directory` | 2 |
| T020 d | a named file, `--out` beside it | `refused: report path inside transcript directory` | 2 |
| Canary | vitest case `the report holds no CANARY- string`, and `grep -c CANARY-` on a fixture-run report | case passes, count `0` | 0 |
| Fixture rehearsal of scenario 460 | playbook steps 1 to 4 with the report in the session scratchpad | method, `scope: 6 main-session files, 0 subagent files, 4 boundaries (4 main, 0 subagent)`, 4 `row` lines, `totals:`, one `stop:` line. stderr names `malformed-line.jsonl:2` and `unknown-type.jsonl:3`. Status diff empty, canary count 0 | 1 (expected) |
| Code route | `verify_alignment_drift.py --root runtime/scripts/compaction-recall` | `PASS`, `Scanned files: 0`. The checker scans only git-tracked files (`verify_alignment_drift.py:204`), and S is untracked | 0 |
| Code route, untracked copy | the same checker on a copy of S and T outside any git tree | `PASS`, `Scanned files: 2`, `Findings: 0` | 0 |
| Code route, folder | the same checker on `runtime/scripts` | `PASS`, `Scanned files: 3`, `Findings: 0` | 0 |
| Comment hygiene | `python3 .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh <file>` on S and on T | clean | 0 each |
| No spawn | `grep -nE 'child_process\|spawnSync\|spawn\(\|execFile\|execSync' S` | no output | 1 |
| Port | `node W/runs/port-diff.mjs` | `cases=428 mismatches=0` | 0 |
| Skill docs | `validate_document.py` on `SKILL.md`, `README.md`, `runtime/scripts/README.md`, `changelog/v4.3.0.0.md`, `feature-catalog/feature-catalog.md`, the catalog entry, `manual-testing-playbook/manual-testing-playbook.md` and scenario 460 | 8 of 8 `VALID`. The two index files carry the `document_type_fallback` warning, as at baseline | 0 each |
| Playbook package | `validate-playbook-package.cjs --package system-spec-kit` | `PASS ... scenarios=86 ... violations=0 warnings=1` (baseline 85 scenarios, same violations and warnings) | 0 |
| Catalog package | `validate_catalog_package.py --package system-spec-kit` | `WARN tier=warn violations=85` (baseline 85, delta 0, none on the new entry) | 0 |
| Skill root metadata | `ci-skill-root-metadata.cjs` | `checked=16 passed=16 failed=0 fixed=0` | 0 |
| Hermes copies | `sync-skills-hermes.cjs --check` | `DRIFT system-spec-kit`, `FAIL: 1 drifted, 0 stale` (baseline `PASS: 73`). This is the expected result of the `SKILL.md` edit. Not regenerated, left open | 1 |

### Suites, baseline against final

| Suite | Baseline | Final | Delta |
|---|---|---|---|
| Runtime, 12 shards through the hoisted binary (`W/baseline/run-shards.sh`, then `W/baseline/sum-shards.sh`) | files 259 passed, 3 failed, 3 skipped, tests 3984 passed, 9 failed, 21 skipped, shards 3, 5, 6 exit 1 | files 261 passed, 2 failed, 3 skipped, tests 3997 passed, 8 failed, 21 skipped, shards 3, 6 exit 1 (`W/final/shards/aggregate.txt`) | +1 file and +12 tests (`compaction-recall.vitest.ts`, 12 passed, shard output line `runtime/tests/compaction-recall.vitest.ts (12 tests)`). No new failure |
| Failing set | `authorized-ledger.vitest.ts` (1 test), `completion-evidence-pi-extension.vitest.ts` (file), `spec-gate-pi-extension.vitest.ts` (7 tests) | `completion-evidence-pi-extension.vitest.ts` (file), `spec-gate-pi-extension.vitest.ts` (7 tests) | `authorized-ledger.vitest.ts` passed in the final run (53 tests). It is a concurrency test in `system-deep-loop`, which this build does not touch, so I count it as flaky, not as fixed. The other two are unchanged and outside this lane |
| `cli` project, from `runtime/cli`: `npx vitest run --config ../../vitest.config.ts --project cli` | `Test Files 157 passed \| 3 skipped (160)`, `Tests 1602 passed \| 19 skipped (1621)`, exit 0 | the same two lines, exit 0, 349 s (`W/final/cli-vitest.txt`) | 0 |

The `ps` byte count stayed between 171832 and 177668 on every final shard (baseline 177561 to 197183), so the known ENOBUFS `ps` flake does not explain any failure.

## 5. D4 census record

Before recording anything, I matched every stdout line of the G2 run against a strict pattern of the allowed classes. All 171 `row` lines matched, 0 lines fell outside the six known line kinds, and stderr was 0 bytes. The row lines hold only basenames, line numbers, uuids, enum labels and numbers. This file records only the five summary lines and the per-file counts. The raw stdout, the report and the listings stay in the session scratchpad, outside the repository.

```text
method: parsed JSON records with type=system, subtype=compact_boundary and compactMetadata present
scope: 15 main-session files, 0 subagent files, 171 boundaries (171 main, 0 subagent)
selection: newest 15 compacted main-session files by modification time, 29 read
totals: compactions=171 sessions_read=29 sessions_stopped=0 sessions_skipped_oversized=0 partial_tails=0 fit_throws=1 briefs_recorded=168 briefs_absent=3 markers=166 summary_recall_avg=0.36 brief_recall_avg=0.05 uncheckable=58 violations=8344 briefs_replayed=0
stop: arm not built (fit_throws=0.01, offline_reduction_upper_bound=0.47, kept_tokens_ratio=3.65)
```

The stop line fires on the third condition only. The median kept-token ratio is 3.65, which is above 3. The fit throw share (0.01) and the reduction bound (0.47) both pass.

| Basename (census order, newest first) | Census rows | Independent count |
|---|---|---|
| `13974574-59f7-48b5-b4cd-aa93ca9ca737.jsonl` | 3 | 3 |
| `75aab0e6-dcc7-401b-9d10-f48248374023.jsonl` | 29 | 29 |
| `0da7a8f2-8dab-43fc-965f-5a5c7eb6ec05.jsonl` | 30 | 30 |
| `77e196db-4770-40ab-8376-6fa85629e782.jsonl` | 35 | 35 |
| `17193ad8-031f-432d-a47f-2b525f70e851.jsonl` | 7 | 7 |
| `fb879d4c-5543-4760-8339-b0f3499f278d.jsonl` | 31 | 31 |
| `abb8eac5-f92d-4f79-aab2-f81adb6c378b.jsonl` | 5 | 5 |
| `0c3eaa67-d9c2-4f09-a546-1be4055e458e.jsonl` | 2 | 2 |
| `10acd3b7-9d67-43fb-8d4e-29ef1038707b.jsonl` | 4 | 4 |
| `8e0737a4-1047-45ee-8191-2539a6b1307e.jsonl` | 3 | 3 |
| `345a80cf-8fa0-4d6f-b0a2-f7b159bb00f4.jsonl` | 3 | 3 |
| `4d019a71-c1db-4720-89f5-89fd31c7d18f.jsonl` | 1 | 1 |
| `6d11af6f-653e-4807-aca8-1c09c81640c1.jsonl` | 12 | 12 |
| `5ec36523-00d4-4729-9865-288332746464.jsonl` | 3 | 3 |
| `83bba4ba-2c8f-4302-8626-53089a28089d.jsonl` | 3 | 3 |
| total | 171 | 171 |

Both runs used the same 15 basenames. The census and the count ran back to back and agreed, so no live-append rerun was needed. The directory listing did not change between the two listings around the census. The newest selected file, `13974574-...`, is this orchestrator's own live session. The census reads each file only up to its stat size. The live-file question stays open, as the brief says.

## 6. Deviations

1. **Recorded brief rule.** `spec.md:85` names the first `hook_success` `SessionStart:compact` attachment in the window. The build takes the first such attachment whose `command` contains `session-prime` (design section 7), because several hooks answer that event.
   - Survey over 87 top-level files and 246 boundaries: the first-success rule found the marker in only 10 of 246. The session-prime rule gave 239 present, 237 with the marker, 3 `hook_cancelled` and 4 none.
   - Live census: 168 recorded, 166 with the marker, 3 absent.
   - Fixture `recorded-brief.jsonl` puts another hook's success first, so the rule is pinned.
2. **Partial tail.** An unterminated last line that does not parse counts in `partial_tails` and does not stop the session. A live session can end mid-line.
3. **Stage names in row lines.** Row lines print stage names with spaces as underscores (`fit=texts_abridged`). The report keeps the vendored names.
4. **Replayed marker.** A replayed brief has `briefMarker` null, because `session-prime` adds the marker at injection and the replayed builder output cannot carry it.
5. **Stop line x.** x is the share of `fit_throw` rows (design section 5). `totals.fit_throws` stays a count.
6. **Script size.** S is 1604 lines (1193 not blank or comment), against the `spec.md:116` estimate of 690 to 730 LOC. The difference is mostly JSDoc, the ported vendored functions and the guard.
7. **Executor roster, D5 against the spec roster.** `spec.md:49` and `plan.md:103` name Devin, Pi on Cline `cline-pass/cline-pass/deepseek-v4.1-flash` and Cursor. Parent D5 wins, so the build used Devin `deepseek-v4-1-flash-max` and Pi `llmgateway/mimo-v2.6-pro` only. Pi on Cline and Cursor were not used.
8. **G1 runner.** The goal's `npm test -- --run ...` form fails for an environment reason (section 7). The same file passes 12 of 12 through the hoisted binary. Both results are recorded.
9. **Scripts README sentence.** Brief 09 replaced the line-19 sentence (section 7).

## 7. Stale premises

- `runtime/scripts/README.md:19` said the folder holds the `package.json` scripts "plus one maintenance tool". All three scripts there (`finalize-dist.mjs`, `run-tests.mjs`, `run-tests-sharded.mjs`) are `package.json` scripts. The sentence now names the census instead.
- `goal.md:89`, `plan.md:115` and `tasks.md:69` run `npm test -- --run tests/compaction-recall.vitest.ts`. `runtime/scripts/run-tests.mjs:10` resolves `runtime/node_modules/.bin/vitest`, which this worktree does not have, because vitest is hoisted to the skill-level `node_modules`. Every `npm test` and `npm run test:sharded` call fails at baseline for this reason.
- `spec.md:85`: the first-success brief rule (deviation 1).
- `spec.md:68`: 212 boundaries in 93 main-session files as of 2026-09-27. The directory now holds 87 top-level files with 253 boundaries, 2 of them empty files. The directory rotates, so treat these as moving numbers.
- `spec.md:116`: the LOC estimate (deviation 6).
- `verify_alignment_drift.py:204` skips untracked files. The code-route row therefore gives no signal on a new file until it is committed, which is why I also ran the untracked-copy check.

## 8. Open items

- **Hermes copies.** `sync-skills-hermes.cjs --check` reports `DRIFT system-spec-kit` after the `SKILL.md` edit. Regenerating (the same script without `--check`) is for the closure step. It was not run here.
- **Trigger index.** Not regenerated, per the brief.
- **Commit and review.** Nothing is committed. `plan.md:103` gives the cross-family review of S and T and the path-scoped commit to the parent orchestrator session.
- **G1 runner.** `npm test` stays broken in this worktree until the runtime package gets its own `node_modules/.bin/vitest` or `run-tests.mjs:10` resolves the hoisted binary. Neither was done: the first is an install (D7) and the second is out of scope. The exact install command is UNKNOWN.
- **Negative reduction and the guard.** `score-compaction-recall.mjs:1414` (`STOP_LINE_PATTERN`) accepts only unsigned numbers. A probe on synthetic text shows that truncation can add up to 25 estimated tokens to one result just over the 420-character threshold, so a segment's reduction can be negative. If the median were ever negative, the stop line would print `-0.xx` and the guard would void the census. The live census median is 0.47, so this did not fire. P2.
- **JSDoc wording.** `score-compaction-recall.mjs:454` says each unpinned result "counts again as the text kept after truncation". The code adds the untruncated text to one total and the truncated text to the other, so the comment misdescribes correct code. P2.
- **Live-file question.** Left open, per the brief.
- **Temp output outside the repository.** `compaction-recall.vitest.ts` creates `mkdtemp` folders under the system temp directory and never removes them. 211 `compaction-recall-*` folders are there now, all holding synthetic fixture output. Devin's brief 05 smoke checks also left `/tmp/crc-smoke/` (6 files, synthetic). Both are outside my write scope, so I did not delete them. Adding cleanup to T is a small follow-up. P2.
