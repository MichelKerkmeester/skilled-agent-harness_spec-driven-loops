# Fix evidence: four review P1s in 005-compaction-recall-harness

Fix orchestrator leaf, 2026-09-29, worktree `069-cli-jev-workflow-integration`, HEAD `810540da45` at the start and at the end. Nothing here is committed. `X` = `specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness/scratch/w3-build/fix`. `S`, `T` and `F` are the script, the test and the fixtures directory under `.skilled/skills/system-spec-kit/runtime/`. The earlier build's `build-evidence.md` was read and not edited.

## 1. Baseline (before the first dispatch)

| Check | Command | Result | Exit |
|---|---|---|---|
| Copies | `cp` of S, T and F into `X/baseline/`, plus `git status --porcelain` into `X/baseline/git-status.txt` | `S.mjs`, `T.vitest.ts`, `F/` (6 files) | 0 |
| Focused suite | from `runtime/`: `perl -e 'alarm shift; exec @ARGV' 300 npx vitest run tests/compaction-recall.vitest.ts` (`X/logs/vitest-baseline.txt`) | `Tests 12 passed (12)` | 0 |
| Fixture run | `node S --transcripts F --out X/before.json` | stdout 2134 bytes, last line `stop: arm not built (fit_throws=0.00, offline_reduction_upper_bound=0.00, kept_tokens_ratio=0.18)`, stderr names `malformed-line.jsonl:2` and `unknown-type.jsonl:3`, `grep -c CANARY-` 0 | 1 (two fixtures stop, as designed) |
| P1-A, real path | `node .skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs` | stderr `no transcripts named`, stdout empty | 2 |
| P1-A, symlink path | the same through `.claude/skills/...` | no output | 0 (bug confirmed) |
| P1-B, exact case | `node S --transcripts D --out D/r.json` (D = a scratch dir holding one copy of `F/clean.jsonl`) | `refused: report path inside transcript directory` | 2 |
| P1-B, upper case | `node S --transcripts D --out <D upper-cased>/r-upper.json` | census printed, `r-upper.json` written inside D | 0 (bug confirmed) |
| P1-B, `..cache` | `node S --transcripts D --out D/..cache/r.json` | census printed, report written inside D | 0 (bug confirmed) |
| P1-C, P1-D | read of T | 12 `it` blocks. `main` is reached only by spawned runs, so deleting the guard call leaves every case green, and no case covers no-transcripts, `--max-file-bytes`, `partial_tails`, `uncheckable` or `stop: arm may be specified` | n/a |

Correction to the brief, recorded before any dispatch: the script writes every command-line refusal (`no transcripts named`, `refused: ...`) to **stderr**, not stdout (`parseCliArgs` JSDoc: "the first refusal message for stderr", and `main` writes `parsed.message` through `process.stderr.write`). The brief's "stdout `no transcripts named`" is taken as intent: the new cases assert that stderr equals the message and that stdout is empty. Moving the message to stdout would be a behavior change outside the four P1s.

Probes run before writing briefs, on synthetic copies only: `--max-file-bytes 1` over one fixture gives `sessions_skipped_oversized=1`, `stop: no boundaries`, exit 0. `spec.md` REQ-013 names no exit code and section 5 gives `stop: no boundaries` for zero boundaries, and the empty-directory edge case exits 0, so the code matches the spec and the case pins exit 0. An unparseable unterminated tail gives `partial_tails=1`, exit 0 (the code's behavior today, pinned as the brief says). An inline boundary whose last instruction is `CANARY- keep going` gives `r4=uncheckable`, `r2=1/1/1`, both recall averages 1.00.

## 2. Dispatches (one at a time, `X/briefs/run-brief.sh`, logs in `X/logs/`)

After each dispatch I read `<NN>.last.txt` (handback, stray questions, auth errors), diffed `<NN>.pre-status.txt` against `<NN>.post-status.txt`, diffed S and T against the `<NN>.pre.*` copies and F against `<NN>.pre-fixtures.txt`, ran the brief's own check, and ran the focused suite (`X/logs/vitest-<NN>.txt`).

| NN | Brief (lines) | Finding | Executor, model | Seconds | Handback | Own-lane diff | Focused suite |
|---|---|---|---|---|---|---|---|
| 01 | `01-harness` (89) | harness for P1-A to P1-D | pi, `llmgateway/mimo-v2.6-pro` | 276 | DONE | T only: imports, `TEMP_DIRS`, `tempDir`, `transcriptDir`, `runScript`, `afterEach` cleanup | 12 passed, exit 0 |
| 02 | `02-entry-guard` (87) | P1-A | devin, `deepseek-v4-1-flash-max` | 130 | DONE | S: guard becomes `isEntryPoint()` (realpath both sides, catch false). T: symlink case | 13 passed, exit 0 |
| 03 | `03-containment` (89) | P1-B | devin, same | 94 | DONE | S: `isAbsolute` import dropped, `isInsideDirectory` replaced by `isInsideByIdentity` (dev and ino walk to the root), `outputInsideTranscripts` uses it. T: `..cache` case | 14 passed, exit 0 |
| 04 | `04-containment-case` (84) | P1-B tests 1, 2 | pi, mimo | 54 | DONE | T only: `basename` import, `CASE_INSENSITIVE` probe, exact-case case, `it.skipIf(!CASE_INSENSITIVE)` upper-case case | 16 passed, exit 0 (not skipped: APFS is case-insensitive) |
| 05 | `05-containment-link` (74) | P1-B tests 4, 5 | pi, mimo | 194 | DONE | T only: symlink-out refused, outside accepted and written | 18 passed, exit 0 |
| 06 | `06-guard-seam` (80) | P1-C | devin, same | 53 | DONE | S: `main(argv, hooks = {})`, JSDoc `@param` line, 4-line `beforeGuard` block above the guard comment. T: `vi` import, `vi.restoreAllMocks()` in `afterEach`, in-process planted-string case | 19 passed, exit 0 |
| 07 | `07-refusal-oversized` (76) | P1-D items 1, 2 | pi, mimo | 191 | DONE | T only | 21 passed, exit 0 |
| 08 | `08-tail-stopline` (75) | P1-D items 3, 5 | pi, mimo | 95 | DONE | T only | 23 passed, exit 0 |
| 09 | `09-uncheckable` (76) | P1-D item 4 | pi, mimo | 106 | DONE | T only, inline temp transcript, no file added to F | 24 passed, exit 0 |

9 briefs, 9 dispatches, 0 re-dispatches, 0 BLOCKED. Devin ran 3 (02, 03, 06), Pi ran 6 (01, 04, 05, 07, 08, 09). Cursor was not used. Every `<NN>.status` shows exit 0, no `.log` holds an auth or key error, no handback asks a question, and every pre/post status diff is empty (S, T and F were already untracked). F is byte-identical to `X/baseline/F` at the end (`diff -r` exit 0).

## 3. Checks at the final state

| Gate | Command | Result line | Exit |
|---|---|---|---|
| Focused suite | from `runtime/`: `perl -e 'alarm shift; exec @ARGV' 300 npx vitest run tests/compaction-recall.vitest.ts` (`X/logs/vitest-final.txt`) | `Test Files 1 passed (1)`, `Tests 24 passed (24)` (12 old + 12 new) | 0 |
| Old cases untouched | `diff X/baseline/T.vitest.ts T` | the only removed lines are the three import lines (7, 9, 12); every other change is an insertion, so the 12 old `it` blocks are unchanged | n/a |
| New cases pin the fixes | final T pointed at `X/baseline/S.mjs` through a throwaway config in `X` (`X/logs/final-T-on-baseline-S.txt`) | red on the old script: the symlink case (P1-A), the `..cache` and upper-case cases (P1-B), the planted-string case (P1-C). The three `--replay` cases also fail there only because a copy outside `runtime/` cannot reach `../../dist` | 1 (expected) |
| P1-A | `node .claude/skills/.../score-compaction-recall.mjs`, then `node .skilled/skills/.../score-compaction-recall.mjs` (`X/logs/final-gates-1.txt`) | both: stderr `no transcripts named`, stdout 0 bytes | 2 and 2 |
| P1-B (`X/logs/final-gates-p1b.txt`, D a scratch dir with one fixture copy) | upper-cased `--out <D upper>/r-upper.json` | `refused: report path inside transcript directory`, no `r-upper.json` in D | 2 |
| | exact-case `--out D/r.json`; `--out D/..cache/r.json`; `--out` through a symlink to D | refused, each | 2, 2, 2 |
| | `--out` outside D | report written, stderr empty, `stop: arm not built (...)`; D still holds only `clean.jsonl` | 0 |
| P1-C mutation | copy S to `X/mutation/`, delete the 4-line `if (hasFreeText(...)) {...}` block in the copy with one `perl -0pe` line (`X/logs/mutation-diff.txt`), point copies of T at the control and the mutant, run `-t 'planted string'` | control: `Tests 1 passed \| 23 skipped (24)`, exit 0. Mutant: `× main voids the census and writes no report when a planted string reaches the guard`, `AssertionError: expected +0 to be 1`, exit 1 (`X/logs/mutation-control.txt`, `mutation-mutant.txt`). Copies deleted | 0 / 1 |
| Syntax | `node --check S` | no output | 0 |
| Code route, scripts | `python3 .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py --root runtime/scripts/compaction-recall` | `PASS`, `Scanned files: 0`, `Errors: 0`, `Warnings: 0` | 0 |
| Code route, tests | the same with `--root runtime/tests` | `PASS`, `Scanned files: 136`, `Errors: 0`, `Warnings: 0` | 0 |
| Code route, untracked S and T | both runs again with `GIT_DIR=/nonexistent-git-dir`, so `git ls-files` fails and the checker scans every file under the root (it skips untracked files otherwise, `tracked_paths`) | scripts: `Scanned files: 1`, `Findings: 0`, `Errors: 0`, `Warnings: 0`. Tests: `Scanned files: 137`, `Findings: 0`, `Errors: 0`, `Warnings: 0` | 0, 0 |
| Comment hygiene | `python3 .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh S`, then T | no output | 0, 0 |
| Key grep | `grep -niE 'api_key\|apikey\|secret\|bearer\|token=' S T` | no match | 1 |
| Spawn grep | `grep -nE 'child_process\|spawn\|execSync\|execFile\|fetch\(' S` | no match | 1 |
| Normal run unchanged | `node S --transcripts F --out X/after.json`, then `diff` of `before.json`/`after.json`, stdout and stderr | all three `diff` exit 0 | run 1, diffs 0 |
| Tree | `git status --porcelain` (`X/logs/final-git-status.txt`) against `X/baseline/git-status.txt` | identical: the earlier build's paths, S, T, F and `scratch/w3-build/` only | 0 |
| Temp output | `compaction-recall-*` dirs in the OS temp dir before and after the final suite run | delta 31, all from the 12 old cases (1 big, 1 empty, 14 out, 2 selection, 13 stub); the new cases leave none | n/a |

## 4. Deviations

1. **Brief split, 5 planned to 9.** Each planned brief exceeded 90 lines once the verbatim blocks (47 lines) were added: planned 1 became 01 (harness) and 02 (P1-A), planned 2 became 03 (script change plus the `..cache` case), 04 and 05 (the other four cases), planned 5 became 08 (items 3 and 5) and 09 (item 4). Planned 3 and 4 are 06 and 07.
2. **Refusals on stderr** (section 1): the cases assert stderr, not stdout.
3. **Privacy line placement.** The "never read `~/.claude`, `~/.pi` or any transcript or session file" line sits in every brief's task body, Pi's included, so RUN CONTEXT, DON'T and HANDBACK stay verbatim.
4. **Old text by range in brief 03.** Steps 2 and 3 name the old text by line range, first line and closing brace instead of quoting all 13 lines, to stay under 90 lines. The executor's diff matched the intended replacement exactly.
5. **Harness, not helper edits.** New cases use a new `runScript` that registers the stub dir from the existing `makeStubs()` for cleanup, so `makeStubs` and `runCensus` stay as they were.
6. **Executor side effect.** Devin's brief 02 run made a throwaway symlink in the OS temp dir for its own proof run (path not reported, outside the repository). Devin also ran read-only `git status --short`. Nothing else outside S and T changed.

## 5. Open (recorded, not chased)

- P2: the `partial_tail` case pins exit 0, the code's behavior, which is in tension with REQ-003 ("no record is skipped with only a warning"), as the session records.
- P2: T's header says every census run has stub binaries first on PATH. The in-process planted-string case calls `main` with no stubs on PATH, as the brief directs. It spawns nothing, and the stub-log case still checks the spawned runs.
- P2 carried from the build: the 12 old cases still leave 31 temp dirs per run.
- The phase's spec docs are not edited (closure leaf). Nothing is committed.
