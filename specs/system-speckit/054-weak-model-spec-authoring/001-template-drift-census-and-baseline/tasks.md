---
title: "Tasks: Phase 1: template-drift-census-and-baseline"
description: "Task Format: T### [P?] Description (file path). Each task names its verify command, and each dispatched task carries its full worker brief."
trigger_phrases:
  - "template drift census and baseline tasks"
  - "census lane brief"
  - "baseline authoring run"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: template-drift-census-and-baseline

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`, then `Verify:` with the command whose output proves the task.

Shell variables used below, set once by the conductor:
- `WORKTREE`: the build worktree path recorded in `../goal.md` section 4.
- `PHASE`: `$WORKTREE/specs/system-speckit/054-weak-model-spec-authoring/001-template-drift-census-and-baseline`
- `S`: `.skilled/skills/system-spec-kit`
- `START`: the commit hash recorded by T003.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Check tools and provider (no file). Verify: `rg -c 'deepseek-v4.1-flash-1017' opencode.json && which jq rg` prints a number above 0 and two paths.
- [ ] T002 Prove the worktree can validate (no file). Verify: `cd "$WORKTREE" && bash $S/runtime/cli/spec/validate.sh specs/system-speckit/041-write-recipe-fixes/001-fix-write-recipe-backfill-flag --strict | grep 'RESULT:'` prints `RESULT: PASSED`. When it fails because `node_modules` or `dist` is missing, follow the worktree provisioning in `.skilled/skills/sk-git/SKILL.md` and retry once. When it still fails, STOP the phase.
- [ ] T003 Record the start state (`goal.md`, `scratch/baseline/status-start.txt`). Run `git -C "$WORKTREE" rev-parse HEAD`, write the hash into `goal.md` section 4 as `Start commit`, then run `git -C "$WORKTREE" status --porcelain > "$PHASE/scratch/baseline/status-start.txt"`, then run the spec-kit suite once with `npm --prefix "$WORKTREE/$S" test > "$PHASE/scratch/baseline/suite-start.txt" 2>&1; echo "exit=$?" >> "$PHASE/scratch/baseline/suite-start.txt"`. Phases 2 to 5 compare their suite runs with this file. Verify: `grep -c 'Start commit' "$PHASE/goal.md"` prints `1`, and `tail -1 "$PHASE/scratch/baseline/suite-start.txt"` prints an `exit=` line.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P] Dispatch census lanes A, B and C (`scratch/ledger/lane-a.jsonl`, `lane-b.jsonl`, `lane-c.jsonl`). Write one brief per lane to `scratch/briefs/T004-A.txt`, `T004-B.txt` and `T004-C.txt`, each made of the skeleton in `plan.md` section AI EXECUTION PROTOCOL followed by the lane text below, then make three Task calls in one message, one per lane, with the plan's dispatch rule, writing each reply to `scratch/runs/T004-A.txt`, `T004-B.txt` and `T004-C.txt`. Verify: `for l in a b c; do jq -c . "$PHASE/scratch/ledger/lane-$l.jsonl" > /dev/null && echo "lane-$l JSON_OK"; done` prints three `JSON_OK` lines.

  Lane text, with `<LANE>`, `<PATHS>` and `<OUT>` filled from this table:

  | LANE | PATHS | OUT |
  |------|-------|-----|
  | A | `.skilled/skills/system-spec-kit/templates/` except its `examples/` folder | `scratch/ledger/lane-a.jsonl` |
  | B | `.skilled/skills/system-spec-kit/templates/examples/` | `scratch/ledger/lane-b.jsonl` |
  | C | `.skilled/skills/system-spec-kit/references/templates/`, `.skilled/skills/system-spec-kit/references/workflows/` and `.skilled/skills/system-spec-kit/SKILL.md` | `scratch/ledger/lane-c.jsonl` |

  ```text
  TASK: You audit lane <LANE>. Read every file under <PATHS>. Find defects of the eight
  classes listed below. For each defect, append one line of JSON to <OUT> (the path is
  relative to the spec folder above). Each line is one object with exactly these ten string
  fields: id, lane, file, locator, defect_class, observed, expected_text, owner_phase,
  evidence_cmd, evidence_expect.

  FIELD RULES
  - id: L-<LANE>-001, L-<LANE>-002 and so on.
  - file: the path from the repository root.
  - locator: text copied exactly from the file that occurs exactly once in it. Check it with
    grep -cF -- '<locator>' <file>, which must print 1. Pick a locator with no single quote.
  - observed: one sentence saying what is wrong.
  - expected_text: the exact finished text that should replace the locator. Write OWNED BY
    PHASE when owner_phase is 003, 004 or 005. Write DELETE FILE for a dead file.
  - owner_phase: the owner given for the class below.
  - evidence_cmd: one read-only command, run from the repository root, that shows the defect.
    Prefer grep -cF -- '<locator>' <file>. Never use >, rm, mv, cp, git, tee, bash or sh.
  - evidence_expect: the exact text, or the count, that evidence_cmd prints while the defect
    exists. Never leave it empty.

  CLASSES (run each command from the repository root, S=.skilled/skills/system-spec-kit)
  1. leaked-description, owner 002: rg -n -e '^description: "Note ' -e '^description: "Level 3,' -e '^description: "[a-z]' -e '^description: ".*-->' <PATHS>
     A description that starts lowercase or holds the end of an HTML comment.
  2. stale-reference, owner 002: rg -n -i 'checklist\.md' <PATHS>, and
     rg -o --no-filename '\.skilled/[A-Za-z0-9_./+-]+' <PATHS> | sort -u | while read p; do test -e "$p" || echo "MISSING $p"; done
  3. unresolved-placeholder, owner 002, or 041-006 when the file is
     spec-folder-write-recipe.md: rg -n '<spec-folder>|<path>|<track>' <PATHS>
     Report it only on a prose line or a command a reader would copy, not where the text
     defines the placeholder.
  4. self-contradiction, owner 002: two lines in the same file that state opposite rules
     for the same thing. Use grep -cF on one of the two lines as evidence_cmd.
  5. dead-file, owner 002: a non-markdown file that nothing references. For each one,
     rg -l --hidden '<its basename>' .skilled --glob '!<its path>' | wc -l prints 0.
  6. gate-anchor-crossing, owner 004, lane A only: for each .tmpl file run
     awk 'BEGIN{d=0} /<!-- IF /{d++} /<!-- \/IF -->/{d--} /<!-- ANCHOR:/{match($0,/ANCHOR:[a-z0-9-]+/); a[substr($0,RSTART+7,RLENGTH-7)]=d} /<!-- \/ANCHOR:/{match($0,/ANCHOR:[a-z0-9-]+/); n=substr($0,RSTART+7,RLENGTH-7); if (a[n]!=d) print FILENAME":"NR": anchor "n" opens at "a[n]" closes at "d}' <file>
  7. unenforced-hint, owner 003, lane A only: rg -c '\[[A-Za-z][^]\[]{2,}\]' $S/templates/core/
     One row per file with a count above 0.
  8. doc-code-mismatch, owner 003: rg -n '\[PLACEHOLDER\]' <PATHS>, and any sentence that
     names a validator rule or behavior you can show does not exist.

  ALSO WRITE scratch/ledger/lane-<LANE>.read.txt with one line per file you opened.

  If you are unsure whether something is a defect, still write the row. A script keeps only
  rows whose evidence_cmd prints evidence_expect.

  VERIFY before you finish: jq -c . <OUT> > /dev/null && echo JSON_OK
  RETURN exactly one line: [T004-<LANE>] DONE - <number of rows> rows
  ```

  Each lane's ALLOWED WRITE PATHS are its `<OUT>` file and its `.read.txt` file.

- [ ] T005 Check lane coverage (`scratch/ledger/coverage.txt`). Run this block from `$WORKTREE`. It writes one line per lane.

  ```bash
  for l in a b c; do
    case $l in
      a) t=$(find $S/templates -type f -not -path '*/examples/*' | wc -l | tr -d ' ') ;;
      b) t=$(find $S/templates/examples -type f | wc -l | tr -d ' ') ;;
      c) t=$(ls $S/references/templates/*.md $S/references/workflows/*.md $S/SKILL.md | wc -l | tr -d ' ') ;;
    esac
    if [ -f "$PHASE/scratch/ledger/lane-$l.read.txt" ]; then n=$(wc -l < "$PHASE/scratch/ledger/lane-$l.read.txt" | tr -d ' '); else n=0; fi
    echo "lane-$l $n of $t files read"
  done > "$PHASE/scratch/ledger/coverage.txt"
  ```

  Verify: `awk '{ if ($2 < $4 * 0.9) bad++ } END { print bad + 0 }' "$PHASE/scratch/ledger/coverage.txt"` prints `0`.

  This block writes each lane's unread paths to `scratch/ledger/lane-<l>.missing.txt`:

  ```bash
  for l in a b c; do
    case $l in
      a) find $S/templates -type f -not -path '*/examples/*' ;;
      b) find $S/templates/examples -type f ;;
      c) ls $S/references/templates/*.md $S/references/workflows/*.md $S/SKILL.md ;;
    esac | sort > "$PHASE/scratch/ledger/lane-$l.all.txt"
    comm -23 "$PHASE/scratch/ledger/lane-$l.all.txt" <(sort "$PHASE/scratch/ledger/lane-$l.read.txt") > "$PHASE/scratch/ledger/lane-$l.missing.txt"
    echo "lane-$l missing $(wc -l < "$PHASE/scratch/ledger/lane-$l.missing.txt" | tr -d ' ')"
  done
  ```

  It prints `lane-a missing 0`, `lane-b missing 0` and `lane-c missing 0` when every lane read every file. A lane under 90 percent is re-dispatched once with the paths in `scratch/ledger/lane-<l>.missing.txt` listed in its brief.

- [ ] T006 Reduce to verified rows (`scratch/ledger/candidates.jsonl`, `ledger.jsonl`, `dropped.jsonl`, `unsafe.jsonl`). Run this script from `$WORKTREE`. Verify: `wc -l "$PHASE"/scratch/ledger/{ledger,dropped,unsafe}.jsonl` prints three counts, and `ledger.jsonl` is not empty.

  ```bash
  L="$PHASE/scratch/ledger"
  cat "$L/lane-a.jsonl" "$L/lane-b.jsonl" "$L/lane-c.jsonl" > "$L/candidates.jsonl"
  : > "$L/ledger.jsonl"; : > "$L/dropped.jsonl"; : > "$L/unsafe.jsonl"
  F='(\s>|>>|[0-9&]>|\brm\b|\bmv\b|\bcp\b|\bgit\b|\btee\b|\bcurl\b|\bwget\b|\bnode\b|\bpython|\bchmod\b|\bdd\b|\bbash\b|\bsh\b)'
  while IFS= read -r row; do
    cmd=$(printf '%s' "$row" | jq -r .evidence_cmd); exp=$(printf '%s' "$row" | jq -r .evidence_expect)
    if printf '%s' "$cmd" | rg -q "$F"; then printf '%s\n' "$row" >> "$L/unsafe.jsonl"; continue; fi
    if [ -z "$exp" ]; then printf '%s\n' "$row" >> "$L/dropped.jsonl"; continue; fi
    out=$(bash -c "$cmd" 2>&1)
    if printf '%s' "$out" | grep -qF -- "$exp"; then printf '%s\n' "$row" >> "$L/ledger.jsonl"; else printf '%s\n' "$row" >> "$L/dropped.jsonl"; fi
  done < "$L/candidates.jsonl"
  ```

  This script was tested on four sample rows before it was written here: a reproducing row was kept, a non-reproducing row and an empty-expect row were dropped, and a row whose command used `tee` was quarantined without running.

- [ ] T007 Check the five confirmed defects are in the ledger (no file). Verify: each of these five commands prints a number of at least 1, and the first prints at least 18, one for each of the 18 exact lines in `plan.md` section 3.

  ```bash
  jq -r 'select(.defect_class=="leaked-description") | .file' "$PHASE/scratch/ledger/ledger.jsonl" | grep -c examples/
  jq -r 'select(.locator|contains("Checklist.md fully verified")) | .file' "$PHASE/scratch/ledger/ledger.jsonl" | wc -l
  jq -r 'select(.file|endswith("spec-folder-write-recipe.md")) | select(.defect_class=="unresolved-placeholder") | .id' "$PHASE/scratch/ledger/ledger.jsonl" | wc -l
  jq -r 'select(.file|endswith("spec-folder-authoring-checklist.md")) | select(.defect_class=="unresolved-placeholder") | .id' "$PHASE/scratch/ledger/ledger.jsonl" | wc -l
  jq -r 'select(.file|endswith("template-style-guide.md")) | .id' "$PHASE/scratch/ledger/ledger.jsonl" | wc -l
  ```

  A missing defect is added by the conductor as a row in the frozen schema, using the locator in `plan.md` section 3, then T006's reproduce check is run on that row alone.

- [ ] T008 Build the hint list (`scratch/baseline/hints-v2.2.txt`). Run from `$WORKTREE`. Verify: `wc -l < "$PHASE/scratch/baseline/hints-v2.2.txt"` prints a number above 50, and `ls specs/zz-bench-hints 2>&1` reports no such directory.

  ```bash
  bash $S/runtime/cli/spec/create.sh --skip-branch --level 2 --track zz-bench-hints --short-name recommend-level-quiet-flag "Add a quiet flag to recommend-level.sh"
  P=specs/zz-bench-hints/001-recommend-level-quiet-flag
  rg -o --no-filename '\[[A-Za-z][^]\[]{2,}\]' $P/spec.md $P/plan.md $P/tasks.md $P/acceptance-criteria.md | sort -u > "$PHASE/scratch/baseline/hints-v2.2.txt"
  for f in spec plan tasks acceptance-criteria; do echo "$f $(rg -c '<!-- ANCHOR:' $P/$f.md)"; done > "$PHASE/scratch/baseline/anchors-v2.2.txt"
  rm -r specs/zz-bench-hints
  ```

  This sequence was run once while this spec was written. On the unchanged templates it produced 87 hint strings, 97 leftover occurrences in the unfilled scaffold and a strict result of `RESULT: PASSED`, which is the defect phase 3 fixes.

- [ ] T009 Run the baseline three times (`scratch/runs/T009-1.txt` to `T009-3.txt`, `scratch/baseline/runs.jsonl`). Runs are serial. Before each run, save `git status --porcelain` to `scratch/baseline/status-before-<n>.txt` and run `date +%s > "$PHASE/scratch/runs/T009-<n>.t0"`. Dispatch this brief, saved as `scratch/briefs/T009-<n>.txt`, as one Task call with the plan's dispatch rule, writing to `scratch/runs/T009-<n>.txt`, then run `date +%s > "$PHASE/scratch/runs/T009-<n>.t1"`. Verify: `for n in 1 2 3; do test -s "$PHASE/scratch/runs/T009-$n.txt" && test -s "$PHASE/scratch/runs/T009-$n.t0" && test -s "$PHASE/scratch/baseline/status-before-$n.txt" && echo "run-$n recorded"; done` prints `run-1 recorded`, `run-2 recorded` and `run-3 recorded`.

  ```text
  (the skeleton block from plan.md, with the spec folder line set to:
    specs/zz-bench-authoring/001-recommend-level-quiet-flag)

  ROLE: You are a documentation author working in this repository. Follow the
  system-spec-kit skill for how spec documents are written.

  ALLOWED WRITE PATHS:
    specs/zz-bench-authoring/ and everything under it

  BANNED OPERATIONS: git commit, git push, git checkout, git switch, git branch, git reset,
  git stash, generate-context.js, /speckit:save, and any edit outside specs/zz-bench-authoring/.
  Do not edit recommend-level.sh.

  TASK: Write the planning documents for one small feature.

  Feature: add a --quiet flag to .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh.
  With --quiet the script prints only its final recommended-level line. Without the flag its
  output is unchanged.

  Steps:
  1. Run: bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --skip-branch --level 2 --track zz-bench-authoring --short-name recommend-level-quiet-flag "Add a quiet flag to recommend-level.sh"
  2. In the folder it created, fill spec.md, plan.md, tasks.md and acceptance-criteria.md
     for this feature. Leave implementation-summary.md as it was created.
  3. Run: bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/zz-bench-authoring/001-recommend-level-quiet-flag --strict
  4. Fix what it reports and run it again, at most three times in all.

  RETURN exactly one line: the folder path, then the last RESULT line validate.sh printed.
  ```

- [ ] T010 Measure each run, then delete its track (`scratch/baseline/baseline.json`). After each run, before the next one starts, run this from `$WORKTREE` with `N` set to the run number and `T0=$(cat "$PHASE/scratch/runs/T009-$N.t0")`. Verify: `jq '.runs | length' "$PHASE/scratch/baseline/baseline.json"` prints `3` after the third run.

  ```bash
  P=specs/zz-bench-authoring/001-recommend-level-quiet-flag
  M1=$(bash $S/runtime/cli/spec/validate.sh $P --strict 2>&1 | grep -c 'RESULT: PASSED')
  M2=$(cat $P/spec.md $P/plan.md $P/tasks.md $P/acceptance-criteria.md 2>/dev/null | grep -F -o -f "$PHASE/scratch/baseline/hints-v2.2.txt" | wc -l | tr -d ' ')
  M3=0; while read f n; do have=$(rg -c '<!-- ANCHOR:' $P/$f.md 2>/dev/null || echo 0); [ "$have" -lt "$n" ] && M3=$((M3 + n - have)); done < "$PHASE/scratch/baseline/anchors-v2.2.txt"
  git status --porcelain > "$PHASE/scratch/baseline/status-after-$N.txt"
  M4=$(diff "$PHASE/scratch/baseline/status-before-$N.txt" "$PHASE/scratch/baseline/status-after-$N.txt" | grep '^>' | grep -v 'zz-bench-authoring' | grep -v '054-weak-model-spec-authoring/001-' | wc -l | tr -d ' ')
  M5=$(( $(date +%s) - T0 ))
  echo "{\"run\":$N,\"strict_passed\":$M1,\"leftover_hints\":$M2,\"missing_anchors\":$M3,\"out_of_scope_writes\":$M4,\"seconds\":$M5}" >> "$PHASE/scratch/baseline/runs.jsonl"
  jq -s '{runs: .}' "$PHASE/scratch/baseline/runs.jsonl" > "$PHASE/scratch/baseline/baseline.json"
  rm -r specs/zz-bench-authoring
  ```

  When `M4` is above 0, restore each listed path with `git restore --source="$START" -- <path>` before the next run and record the paths in `goal.md` section 4.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Frontier review of the ledger (`scratch/review/T011.txt`). Read `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` first. Save the brief block below to `scratch/briefs/T011.txt`, then run the command block after it from `$WORKTREE`. The command block runs one read-only `codex exec` dispatch and writes the reply to `scratch/review/T011.txt`. Verify: `test -s "$PHASE/scratch/review/T011.txt" && awk 'NF && $0 != "NO FINDINGS" && $0 !~ /^(P0|P1|P2) /{bad++} END{print bad+0}' "$PHASE/scratch/review/T011.txt"` prints `0`.

  ```text
  You are a read-only reviewer. Do not edit, create or delete any file.
  Read specs/system-speckit/054-weak-model-spec-authoring/001-template-drift-census-and-baseline/scratch/ledger/ledger.jsonl
  and dropped.jsonl in the same folder. For each ledger row, open the named file and check:
  (1) the defect is real, (2) expected_text is correct finished text, (3) owner_phase is right.
  For each dropped row, check whether it is a real defect that was described badly.
  Then read the files under .skilled/skills/system-spec-kit/templates/,
  references/templates/ and references/workflows/ once more for defects the ledger misses.
  Return one line per finding in this form, and nothing else:
  P0|P1|P2 <ledger id or NEW> <file>:<line> | <what is wrong> | <the fix>
  Return the single line NO FINDINGS when there are none.
  ```

  The reply path is the redirect on the `codex exec` line:

  ```bash
  cd "$WORKTREE"
  mkdir -p "$PHASE/scratch/review"
  AI_SESSION_CHILD=1 codex exec --model gpt-6-luna -c model_reasoning_effort="max" -c service_tier="fast" \
    -c approval_policy=never --sandbox read-only "$(cat "$PHASE/scratch/briefs/T011.txt")" </dev/null \
    > "$PHASE/scratch/review/T011.txt" 2> "$PHASE/scratch/review/T011.err" &
  PID=$!; wait "$PID"; kill -9 "$PID" 2>/dev/null; pkill -9 -P "$PID" 2>/dev/null
  ```

- [ ] T012 Apply review findings (`scratch/ledger/ledger.jsonl`, `goal.md`). For each finding, fix the row, add a NEW row through T006's reproduce check or record in `goal.md` section 4 why it was not applied. Write one line per finding in `goal.md` section 4 as `T012-APPLIED <finding id>` or `T012-RECORDED <finding id> <reason>`. Write no T012 line when T011 is `NO FINDINGS`. Verify: `test "$(grep -cE '^(P0|P1|P2) ' "$PHASE/scratch/review/T011.txt")" -eq "$(grep -cE '^T012-(APPLIED|RECORDED) ' "$PHASE/goal.md")" && echo T012_COUNTS_MATCH` prints `T012_COUNTS_MATCH`.

- [ ] T013 Write `scratch/baseline/baseline.md` (`scratch/baseline/baseline.md`). One table of the three runs and their five metrics, then the minimum and maximum of each metric. Write one row per run as `| <run> | <strict_passed> | <leftover_hints> | <missing_anchors> | <out_of_scope_writes> | <seconds> |`, for example `| 1 | 1 | 87 | 0 | 0 | 420 |`. Verify: `grep -c '^| [123] |' "$PHASE/scratch/baseline/baseline.md"` prints `3`.

- [ ] T014 Close the phase (this folder). Run `bash $S/runtime/cli/spec/validate.sh "$PHASE" --strict`, then compare `git -C "$WORKTREE" status --porcelain` with `scratch/baseline/status-start.txt`. Fill `implementation-summary.md` and mark each `acceptance-criteria.md` row. Verify: `bash $S/runtime/cli/spec/validate.sh "$PHASE" --strict | grep 'RESULT:'` prints `RESULT: PASSED`, and `diff "$PHASE/scratch/baseline/status-start.txt" <(git -C "$WORKTREE" status --porcelain) | grep '^[<>]' | grep -v '054-weak-model-spec-authoring/001-' | wc -l | tr -d ' '` prints `0`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every acceptance criterion marked `Met`, `Waived` or `Superseded` with its evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, which holds the ledger schema and the AI execution protocol
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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Launch preconditions recorded as met in `../goal.md` section 4
- [ ] CHK-002 [P0] T001 to T003 done with their verify output recorded
- [ ] CHK-003 [P1] Every brief saved under `scratch/briefs/` before dispatch
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every lane file parses with `jq -c .`
- [ ] CHK-011 [P0] No row in `ledger.jsonl` has an empty `evidence_expect`
- [ ] CHK-012 [P1] `unsafe.jsonl` rows were read by the conductor, and none was run
- [ ] CHK-013 [P1] Every `locator` in `ledger.jsonl` occurs once in its file, checked with `grep -cF`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] T007 shows all five confirmed defects in the ledger
- [ ] CHK-022 [P1] Three baseline runs measured with all five metrics
- [ ] CHK-023 [P1] A run that failed or timed out is recorded with its error, not silently replaced
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each ledger row has a `defect_class` from the eight in `plan.md` section 3.
- [ ] CHK-FIX-002 [P0] Each class was searched over its whole lane directory, not one file.
- [ ] CHK-FIX-003 [P0] Each row names one `owner_phase`.
- [ ] CHK-FIX-004 [P1] The reproduce script quarantined every command with a redirect or a banned tool.
- [ ] CHK-FIX-005 [P1] The matrix of three lanes by eight classes is reported as 24 counts in `goal.md` section 4.
- [ ] CHK-FIX-006 [P1] Baseline runs started from the same tree, shown by identical `status-before-*.txt` files.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the start commit recorded in T003.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No brief contains a credential, token or key
- [ ] CHK-031 [P0] No worker-written command ran unless it passed the unsafe filter in T006
- [ ] CHK-032 [P1] Every worker ran as a Task subagent, and its brief carried the pre-resolution preamble
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks agree on the five confirmed defects
- [ ] CHK-041 [P1] `goal.md` section 4 records the start commit, each dispatch and each blocker
- [ ] CHK-042 [P2] `scratch/baseline/baseline.md` explains each metric in one line
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Working files are under this phase's `scratch/` only
- [ ] CHK-051 [P1] `specs/zz-bench-authoring/` and `specs/zz-bench-hints/` do not exist at phase close
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 24 | 0/24 |
| P2 Items | 9 | 0/9 |

**Verification Date**: not yet run
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001 and ADR-002 in `plan.md` are followed by T006 and T009
- [ ] CHK-101 [P1] Both ADRs have status Accepted
- [ ] CHK-102 [P1] Each ADR names the alternative it rejected and why
- [ ] CHK-103 [P2] No migration applies to this phase
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Each lane returned within 30 minutes or was re-dispatched once (NFR-P01)
- [ ] CHK-111 [P1] Seconds per baseline run recorded as metric M5
- [ ] CHK-112 [P2] No load test applies to this phase
- [ ] CHK-113 [P2] Baseline minimum and maximum recorded in `baseline.md`
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback in `plan.md` section 7 was not needed, or was run and recorded
- [ ] CHK-121 [P0] Nothing outside this phase folder changed, shown by T014
- [ ] CHK-122 [P1] Phase 2 can start: `ledger.jsonl` and `baseline.json` exist
- [ ] CHK-123 [P1] `goal.md` section 4 names the next phase as ready
- [ ] CHK-124 [P2] No deployment applies to this phase
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Frontier review ran read-only and its reply is saved
- [ ] CHK-131 [P1] No new dependency was installed
- [ ] CHK-132 [P2] No user data is handled by this phase
- [ ] CHK-133 [P2] No OWASP surface is touched by this phase
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` agree at close
- [ ] CHK-141 [P1] `implementation-summary.md` cites `ledger.jsonl` and `baseline.json`
- [ ] CHK-142 [P2] No user-facing documentation changes in this phase
- [ ] CHK-143 [P2] Ledger row counts per lane recorded for phase 2
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Conductor | Runs and verifies every task | Pending | |
| Frontier reviewer | Reads the ledger read-only | Pending | |
| Operator | Merges the phase commit | Pending | |
<!-- /ANCHOR:sign-off -->


