---
title: "Tasks: Phase 18: holdout-row-retirement"
description: "Ordered worker-sized tasks that run a count-only leak check, delete the sealed holdout row suppressed-codex-abstain by its id, recapture the scorer eval baseline with the scoring date unchanged and add one README sentence on how a sealed row is retired, with no holdout prompt text read or printed by any task."
trigger_phrases:
  - "holdout row retirement tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 18: holdout-row-retirement

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
| `[C]` | Coordinator task: a gate, a build, a full-suite run, a baseline capture with `--write`, the leak check, a parent spec edit or the close-out. No worker runs it |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every command runs from the repository root unless a task says `in ADV`. A short name stands for the path or command below. Set the path names once with `export ADV=.skilled/skills/system-skill-advisor/runtime RA=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy PF=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/018-holdout-row-retirement SP=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/018-holdout-row-retirement/scratch PL=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/018-holdout-row-retirement/scratch/planning`.
- `G` is `git -c core.fsmonitor=false`. `BASE` is the commit T001 records with `G rev-parse --short HEAD`. `VX <file>` is `env -u AI_SESSION_CHILD npx vitest run <file>` in `ADV`, with `<file>` relative to `ADV`. `VALL` is `env -u AI_SESSION_CHILD npx vitest run` in `ADV`, which must report 0 failed.
- `HP` is `$RA/holdout-prompts.jsonl`, the sealed holdout. `SEB` is `$RA/scorer-eval-baseline.json`. `RAR` is `$RA/README.md`. `PS` is `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md`.
- `HCOUNT` is `jq -c 'del(.prompt) | .id' $HP | wc -l | tr -d ' '`, the sealed row count. `HROW` is `jq -c 'del(.prompt) | select(.id=="suppressed-codex-abstain")' $HP`, which prints the row's other fields and never its prompt.
- `HASHES` is `jq -c '{capturedAt, corpusSha256, holdoutSha256, ambiguitySha256}' $SEB`. `BASEM` is `jq -c '.metrics' $SEB`. `OTHERM` is `jq -c '.metrics | del(.holdout_top1)' $SEB`. `HOLDM` is `jq -c '.metrics.holdout_top1' $SEB`. `FILEHASH` is `printf 'sha256:%s\n' "$(shasum -a 256 $HP | cut -d' ' -f1)"`.
- `EVALM` is `env -u SPECKIT_EVAL_BASELINE_SCORING_DATE node $RA/capture-scorer-eval-baseline.mjs | jq -c '.metrics'`, the live metrics under the recorded scoring date. At planning the committed `HOLDM` read `{"correct":50,"total":66,"accuracy":0.7576}` and `VERDICT` read 50 of 66 live, and T001 records the real values.
- `FLOOR` is `node $RA/capture-command-routing-baseline.mjs | jq -c '.metrics.typed_recall_at_1, .metrics.false_offer, .attachedMetrics.typed, .attachedMetrics.plain.tune'`, the four command capture floor lines.
- `VERDICT` is `node $PL/probe-holdout-row-verdict.mjs`, which prints the holdout total, the correct count and the retired row's id, gold, top skill and verdict, or `"present":false` once it is gone. `OVERLAP` is `node --import ./.skilled/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs $PL/probe-overlap-counts.mts`. `LEAK` is `node $PL/probe-leak-scan.mjs`, the count-only leak check. Each probe's first comment line says how to run it.

Rules for every task:
- Never read, print, quote or copy the prompt text of any holdout row. Never open `HP` with `Read`, `cat`, `head`, `tail`, `less`, an editor, `git diff`, `git show` or `git log -p`. Read it only through `HCOUNT`, `HROW`, `G diff --numstat`, a `jq` filter that deletes `.prompt` first or a probe in `PL`. Never run `capture-scorer-eval-baseline.mjs` with `--misses`, because it prints each failing prompt. `$ADV/scripts/skill-graph.json` and the `cli-external-orchestration` metadata hold one sealed text, so never print their lines either. Use `jq` paths, key names and counts.
- Each task is one change to the files it names. Re-read every file a task names before the first edit, except `HP`, which no task opens. Phases 016 and 017 edited the README after this plan was written. When a line or phrase a task quotes is not in the file, change nothing and mark the task `[B]` with the line found in its place.
- No worker runs a build, the full suite, a capture with `--write`, a daemon or a model session, and no task writes under the home folder.
- Do not edit `AGENTS.md`, `PS` outside T009, another phase folder, any `package.json`, `build-holdout.mjs`, any fixture, any routing corpus other than `HP`, `skill-graph.json` or any `cli-external-orchestration` file. Add no dependency.
- A `.md` edit outside this folder routes through `sk-doc` before the first write. A doc sentence holds no em dash and no semicolon.
- When a verify prints something other than the expected output, do not change anything to match it. Mark the task `[B]` with the printed line.

Worker lanes. A lane is one worker running its tasks in order. The two worker tasks own different files and run in parallel.
- Setup, the coordinator: T001, T002.
- Wave 1 after T002: worker A runs T003, worker B runs T005 and the coordinator runs T004 once T003 ends.
- Verification, one at a time after wave 1: T006, T007, T008, T009, all `[C]`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [C] Confirm phases 016 and 017 are committed and record the before numbers (`$SP/before.txt`). Run `G log -1 --format=%h -- .skilled/commands/create/sk-skill.md`, `G ls-files --error-unmatch $ADV/tests/derive-command-bridges-strings.vitest.ts`, `G status --porcelain -- $HP $SEB $RAR` and `G rev-parse --short HEAD`, which is `BASE`, then `npm run build` in `ADV`, `HCOUNT`, `HROW`, `HASHES`, `BASEM`, `OTHERM`, `HOLDM`, `EVALM`, `VERDICT`, `OVERLAP`, `FLOOR`, `VX tests/parity/scorer-eval-baseline-ratchet.vitest.ts` and `VX tests/parity/holdout-independent.vitest.ts`, and write each short name with its output or its exit code into `before.txt`. When a phase is not committed, one of the three files is dirty or a gate is red, stop and mark the phase `[B]` with that line, because a recapture over a red baseline would pin an unrelated change. Verify: the `log` prints a hash, `ls-files` exits 0, the `status` prints nothing, the build exits 0, `HROW` prints one line holding `"id":"suppressed-codex-abstain"`, `EVALM` equals `BASEM` character for character, `VERDICT` prints a `holdout total` equal to `HCOUNT`, a `correct` equal to the `correct` in `HOLDM` and a `row` line holding either `"correct":false` or `"correct":true`, both `VX` runs report 0 failed and `wc -l < $SP/before.txt` prints at least 16.
- [x] T002 [C] Run the leak check before any edit (`$SP/leak-before.txt`). Read Q6 in `$PF/spec.md` section 10 first. When the operator has not answered it, mark this task `[B]` with `Q6 unanswered` and stop, because the literal rule fires on the eight rows the planning reading names. Otherwise run `LEAK > $SP/leak-before.txt` and compare its three summary lines, `rows with a hit in data, three words or more:`, `rows with a hit in data, under three words:` and `rows with a hit in code only:`, with their planning readings in `$PF/spec.md` section 2. Under the recommended answer, stop and report when the first of them names a row other than `suppressed-codex-abstain` or when any of the three names a row its planning reading does not. Under the literal answer, stop and report when the line `rows with a hit:` names a row other than `suppressed-codex-abstain`. Report ids, paths and counts only. Verify: the run exits 0 and the `positive control:` line prints the sealed set as `N of N` with `N` equal to the `HCOUNT` in `$SP/before.txt` and the command holdout set as `M of M`. The stop rule the operator chose did not fire, or this task is `[B]` with the line that fired it.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Wave 1, worker A: the sealed file
- [x] T003 [P] Delete the sealed row `suppressed-codex-abstain` (`HP`). Never open, print or diff `HP`, because every line of it is sealed prompt text: no `Read`, `cat`, `head`, `tail`, editor, `git diff`, `git show` or `git log -p` on it. First run `grep -c '"id":"suppressed-codex-abstain"' $HP` and expect `1`, and when it prints anything else change nothing and mark the task `[B]` with that number. Then run `grep -v '"id":"suppressed-codex-abstain"' $HP > $HP.tmp && mv $HP.tmp $HP`, which drops that one line and keeps every other line byte for byte. Then run `VX tests/parity/scorer-eval-baseline-ratchet.vitest.ts` and see it fail in the test `fixture hashes match the pinned baseline (no silent fixture drift)` with the message `holdout changed`, the failure T004's recapture clears. Verify: `G diff --numstat -- $HP | cut -f1,2` prints `0` and `1` separated by a tab, `HCOUNT` prints the `HCOUNT` value in `$SP/before.txt` minus 1, `HROW` prints nothing, `test -e $HP.tmp` exits 1 and the ratchet run reports 1 failed test, or 2 failed when the `VERDICT` row line in `$SP/before.txt` holds `"correct":true`, the second being `holdout top-1 holds exactly and clears the release floor`.

### Wave 1, coordinator: the baseline
- [x] T004 [C] Recapture the scorer eval baseline after T003 (`SEB`, `$SP/after.txt`). Run `env -u SPECKIT_EVAL_BASELINE_SCORING_DATE node $RA/capture-scorer-eval-baseline.mjs --write > /dev/null`, never with `--misses`, then `HASHES`, `OTHERM`, `HOLDM`, `FILEHASH` and `G diff --numstat -- $SEB`, and write each short name with its output into `after.txt`. Verify: in `HASHES` the `capturedAt`, `corpusSha256` and `ambiguitySha256` equal their `$SP/before.txt` values and `holdoutSha256` equals `FILEHASH`. `OTHERM` equals its `before.txt` line character for character. `HOLDM` prints a `total` one below the `before.txt` total and an `accuracy` equal to `correct / total` rounded to four places (for example `0.7692` for 50 of 65). Its `correct` equals the `before.txt` correct when the `before.txt` `VERDICT` row line holds `"correct":false`, and is one below it when that line holds `"correct":true`. The `--numstat` line prints the same number of added and deleted lines, at most 5 each.

### Wave 1, worker B: the README
- [x] T005 [P] Say in the routing-accuracy README how a sealed row is retired (`RAR`). Re-read `RAR` first. In the table row that starts ``| `holdout-prompts.jsonl` |``, replace `Frozen holdout written by` with `Frozen holdout first written by`, and after `as its unseen split.` add ``The file has been edited by hand since it was sealed, so `build-holdout.mjs --write` would now write a different set of rows. A sealed row is retired by deleting its line and recapturing `scorer-eval-baseline.json`, whose `holdoutSha256` fails the ratchet until that recapture runs.`` When the row or either quoted phrase is not in the file, change nothing and mark the task `[B]` with the row found. Verify: `rg -c 'Frozen holdout written by' $RAR` prints nothing, `rg -c 'A sealed row is retired by deleting its line' $RAR` prints 1, ``rg -c '^\| `holdout-prompts.jsonl` \|' $RAR`` prints 1 and ``rg '^\| `holdout-prompts.jsonl` \|' $RAR | rg -c '\x{2014}|\x{3B}'`` prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 [C] Run the gates after the retirement (`$SP/after.txt`). Run `VX tests/parity/scorer-eval-baseline-ratchet.vitest.ts`, `VX tests/parity/holdout-independent.vitest.ts`, `VX tests/parity/scorer-eval-baseline-capture-date.vitest.ts`, `VALL`, `BASEM`, `EVALM`, `FLOOR`, `VERDICT` and `OVERLAP`, and append each short name with its result to `after.txt`. Verify: the three `VX` runs and `VALL` report 0 failed, `EVALM` equals `BASEM` character for character and each of the four `FLOOR` lines equals its `$SP/before.txt` line. `VERDICT` prints a `holdout total` one below the `before.txt` `HCOUNT` and a `row` line holding `"present":false`. Every `OVERLAP` line prints an `all` count above 0.
- [x] T007 [C] Rerun the leak check and prove this phase's files hold no holdout text (`$SP/leak-after.txt`, `$SP/after.txt`). Run `LEAK > $SP/leak-after.txt`, then `node $PL/probe-leak-scan.mjs --paths $(find $PF -type f) $RAR $SEB` and append its output to `after.txt`. Verify: the `positive control:` line prints the sealed set as `N of N` with `N` one below the `before.txt` `HCOUNT`, the line `rows with a hit in data, three words or more: []` is present, the under-three-words and code-only lines equal their `$SP/leak-before.txt` lines character for character and the `--paths` run prints `rows with a hit: 0 []`.
- [x] T008 [C] Check the boundaries. Verify: `G diff --name-only BASE -- .skilled .opencode AGENTS.md` prints exactly the three paths of `HP`, `SEB` and `RAR`, `G status --porcelain --untracked-files=all -- .skilled .opencode` lists no untracked file, `G diff --numstat BASE -- $HP | cut -f1,2` prints `0` and `1`, `G diff --quiet BASE -- $RA/build-holdout.mjs $ADV/scripts/skill-graph.json .skilled/skills/cli-external-orchestration $ADV/lib $ADV/tests` exits 0, `G diff --name-only BASE -- '*.ts' '*.mjs' '*.cjs' '*.js' '*.py'` prints nothing and `G diff --stat BASE -- '*package.json' '*package-lock.json'` prints nothing.
- [x] T009 [C] Close out (`PS`, `implementation-summary.md`, `acceptance-criteria.md`). Re-read `PS` and set the Status cell of phase map row 18 to `Complete`. Write the summary from `$SP/before.txt`, `$SP/after.txt` and the two leak records, mark each acceptance row with the evidence observed, run `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder $PF --apply` and then strict validation. Verify: ``rg -c '^\| 18 \| 018-holdout-row-retirement/ \|.*\| Complete \|$' $PS`` prints 1 and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $PF --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `$SP/after.txt` shows the holdout total one below `$SP/before.txt` with every other metric equal, and `$SP/leak-after.txt` holds an empty data line at three words or more
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Review report**: `../review/review-report.md` section 9, Holdout handling
- **Operator decision**: `../goal.md` line 176
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task gets `[B]` and one line naming what blocks it. A metric other than the holdout values that moves blocks the phase.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phases 016 and 017 are committed, Q6 is answered and the before numbers and the leak record are in `scratch/` (T001, T002). Evidence: `scratch/before.txt:1-8` (phase 016 at `ec1869dae8`, the phase 017 test tracked, BASE `11f3a30814`), Q6 answered at `spec.md` section 10, `scratch/before.txt` and `scratch/leak-before.txt` present.
- [x] CHK-002 [P0] Each task line ends with a verify clause: `rg -c '^- \[[ xB]\] T[0-9].*Verify: ' tasks.md` and `rg -c '^- \[[ xB]\] T[0-9]' tasks.md` print the same number. Evidence: both print 9 at close-out.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No source file changed: `G diff --name-only BASE -- '*.ts' '*.mjs' '*.cjs' '*.js' '*.py'` prints nothing (T008). Evidence: rerun at close-out against `11f3a30814`, it prints nothing and exits 0, while the same form with `'*.json' '*.md'` lists two routing-accuracy files.
- [x] CHK-011 [P1] The sealed file keeps every other line: `G diff --numstat BASE -- $HP` reads one line deleted and none added (T003, T008). Evidence: `git diff --stat 11f3a30814 -- .skilled` at close-out shows the sealed file with 1 deletion and no insertion, and `HCOUNT` prints 65 against 66 at `scratch/before.txt:12`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] The ratchet failed on the holdout hash after T003 and passed after T004 (T003, T006). Evidence: the failure after T003 is `scratch/coordinator-record.txt:10` and the pass after T004 is `scratch/after.txt:13-15`.
- [x] CHK-021 [P0] The baseline moved only in `holdout_top1`, `holdoutSha256` and `capturedAtSha`, and `capturedAt` is unchanged (T004). Evidence: `scratch/after.txt:12` reads 4 lines added and 4 deleted, the baseline diff at close-out shows those four as `capturedAtSha`, `holdoutSha256`, the holdout total and the holdout accuracy, and `capturedAt` reads `2026-10-11` at `scratch/before.txt:16` and `scratch/after.txt:4`.
- [x] CHK-022 [P0] The independence gate, the capture-date test and the full suite report 0 failed and the four floor lines equal their before lines (T006). Evidence: `scratch/after.txt:16-24` (6, 2 and 1796 passed with 6 skipped, no failure line), `scratch/after.txt:30-33` equal `scratch/before.txt:38-41`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding has a class: `instance-only` for this row, with the same-class search run as the leak check over every sealed and command holdout row (T002, T007). Evidence: `scratch/leak-before.txt:1` and `scratch/leak-after.txt:1` check every sealed and command holdout row, and `scratch/leak-before.txt:5` names this row alone.
- [x] CHK-FIX-002 [P0] Same-class producers: after T004 the leak check's data line at three words or more names no row (T007). Evidence: `scratch/leak-after.txt:5`.
- [x] CHK-FIX-003 [P0] Consumers of the changed files are the ones `plan.md` lists, and its two `rg` inventories print no unlisted file. Evidence: rerun at close-out, the first lists the 6 files `plan.md` names and the second adds the command capture, `doctor-phrase-reach.cjs` and its test, six advisor tests, the CI workflow, two changelogs, a reference doc and a retrieval allowlist.
- [x] CHK-FIX-004 [P1] Evidence names the commit it ran on: `scratch/before.txt` and `scratch/after.txt` name `BASE`. Evidence: `scratch/before.txt:8` and the last line of `scratch/after.txt` name `11f3a30814`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No task printed holdout prompt text, and the `--paths` check over this folder, the README and the baseline prints `rows with a hit: 0 []` (T007). Evidence: the `--paths` check is `scratch/after.txt:47`, and `scratch/coordinator-record.txt:16` records that no command opened or diffed the sealed file.
- [x] CHK-031 [P0] No task ran a capture with `--misses` or showed `HP` through `git diff`, `git show` or `git log -p`. Evidence: `scratch/coordinator-record.txt:14-16` records the one capture run and the commands never run.
- [x] CHK-032 [P0] No task started a model session or wrote under the home folder. Evidence: `scratch/coordinator-record.txt:4` and `:16` record that the coordinator ran T003 with no model session and wrote nothing under the home folder.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` state the same files, rules and stop rule. Evidence: read at close-out, `spec.md` section 3, the `plan.md` affected surfaces, the `tasks.md` rules and AC-005 name the same three files and parent row 18, and `spec.md` Q6, the `plan.md` dependencies, T002 and AC-004 state the same stop rule.
- [x] CHK-041 [P1] The README row says the sealed file is edited by hand and how a sealed row is retired (T005). Evidence: the T005 `rg` checks rerun at close-out print nothing, 1, 1 and nothing.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The before and after records and the leak records live in `scratch/` only, and no temporary file remains: `test -e $HP.tmp` exits 1. Evidence: `find` over this folder lists the four records under `scratch/` only, and `test -e $HP.tmp` exits 1 at close-out.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 5 | 5/5 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-13
<!-- /ANCHOR:summary -->

---
