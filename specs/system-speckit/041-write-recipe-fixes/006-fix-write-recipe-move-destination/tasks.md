---
title: "Tasks: Phase 6: fix-write-recipe-move-destination"
description: "Task Format: T### [P?] Description (file path). Each task names its verify command with the output it must print, and the known row is written out literally."
trigger_phrases:
  - "fix write recipe move destination tasks"
  - "known row move destination"
  - "applier verify commands"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: fix-write-recipe-move-destination

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

Shell variables used below, set once by the conductor in the build worktree:
- `WORKTREE`: the build worktree path recorded in `../../054-weak-model-spec-authoring/goal.md` section 4.
- `PHASE_REL`: `specs/system-speckit/041-write-recipe-fixes/006-fix-write-recipe-move-destination`
- `PHASE`: `$WORKTREE/$PHASE_REL`
- `S`: `.skilled/skills/system-spec-kit`
- `RECIPE`: `$S/references/workflows/spec-folder-write-recipe.md`
- `APPLIER`: `$WORKTREE/specs/system-speckit/054-weak-model-spec-authoring/002-template-and-example-defect-repair/scratch/tools/apply_row.py`
- `LED`: `$WORKTREE/specs/system-speckit/054-weak-model-spec-authoring/001-template-drift-census-and-baseline/scratch/ledger/ledger.jsonl`
- `KR`: `$PHASE/scratch/known-rows.jsonl`
- `START`: the commit hash recorded by T002.
- `C` and `R`: set inside the T005 and T007 blocks that use them, so run each block and its Verify command in the same shell.

Every command runs from `$WORKTREE` unless the task says otherwise. Paths in the known row are relative to that directory.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Check the tools and the applier (no file). Run the block below. Verify: it prints `APPLIER_OK`, a line that starts with `Python 3.`, a line that starts with `jq-`, a line that starts with `ripgrep ` and `1`. When `APPLIER_OK` is missing, write `BLOCKED applier missing` in `goal.md` section 4 and STOP the phase. The applier is the only writer of the recipe.

  ```bash
  cd "$WORKTREE"
  test -f "$APPLIER" && echo APPLIER_OK
  python3 --version
  jq --version
  rg --version | head -1
  grep -cF -- '  <spec-folder>' "$RECIPE"
  ```

- [ ] T002 Record the start state (`goal.md`, `scratch/status-start.txt`, `scratch/suite-start.txt`). Run the block below. Write the printed hash into the `Start commit` row of `goal.md` section 4 as `| Start commit | Done | <the 40 character hash> |`. Verify: `grep -cE 'Start commit \| Done \| [0-9a-f]{40}' "$PHASE/goal.md"` prints `1`, and `tail -1 "$PHASE/scratch/suite-start.txt"` starts with `exit=`.

  ```bash
  cd "$WORKTREE"
  git rev-parse HEAD
  git status --porcelain > "$PHASE/scratch/status-start.txt"
  npm --prefix "$WORKTREE/$S" test > "$PHASE/scratch/suite-start.txt" 2>&1; echo "exit=$?" >> "$PHASE/scratch/suite-start.txt"
  ```

- [ ] T003 Save the known row (`scratch/known-rows.jsonl`). Run the heredoc block exactly as written. The file holds one JSON object with the fields `id`, `file`, `locator` and `expected_text`. The locator spans four lines so that one apply adds both the new destination and the sentence. Verify: the commands under the block print `1`, then `1`, then `1`.

  ```bash
  cd "$WORKTREE"
  cat > "$KR" <<'JSONL'
{"id": "K-041-006-01", "file": ".skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md", "locator": "  <spec-folder>\n```\n\nVerification gate: confirm the final path is under `specs/` or `.opencode/specs/` and matches the packet pointer.", "expected_text": "  specs/system-speckit/078-opencode-authoring-recipe\n```\n\nThe `system-speckit` track in the destination above is an example, so substitute the track you chose in the pre-conditions.\n\nVerification gate: confirm the final path is under `specs/` or `.opencode/specs/` and matches the packet pointer."}
JSONL
  ```

  ```bash
  cd "$WORKTREE"
  jq -c . "$KR" | wc -l | tr -d ' '
  python3 -I -c "import json,sys; r=json.loads(open(sys.argv[1],encoding='utf-8').read().strip()); t=open(sys.argv[2],encoding='utf-8').read(); print(t.count(r['locator'])); print(t.count('  <spec-folder>'))" "$KR" "$RECIPE"
  ```

  A line other than `1` means the tree changed after this packet was written. Do not rebuild the locator and do not edit the recipe by hand. Write `BLOCKED locator drifted` with the printed line in `goal.md` section 4, mark this task `[B]` and skip T004.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Apply the known row (`scratch/applied.txt` and the recipe file). Run the block below. Do not edit the recipe by hand. Verify: the five commands under the block print `1`, `1`, `0`, `1` and `1`. When the first prints `0`, read `scratch/applied.txt`, record its line in `goal.md` section 4 and mark this task `[B]`.

  ```bash
  cd "$WORKTREE"
  python3 -I "$APPLIER" "$KR" K-041-006-01 . > "$PHASE/scratch/applied.txt" 2>&1; echo "exit=$?" >> "$PHASE/scratch/applied.txt"
  cat "$PHASE/scratch/applied.txt"
  ```

  ```bash
  cd "$WORKTREE"
  grep -c '^APPLIED K-041-006-01 ' "$PHASE/scratch/applied.txt"
  grep -c '^exit=0$' "$PHASE/scratch/applied.txt"
  grep -cF -- '  <spec-folder>' "$RECIPE"
  grep -cF -- '  specs/system-speckit/078-opencode-authoring-recipe' "$RECIPE"
  grep -cF -- 'The `system-speckit` track in the destination above is an example, so substitute the track you chose in the pre-conditions.' "$RECIPE"
  ```

- [ ] T005 Sweep the ledger rows with `owner_phase` `041-006` (`scratch/census.txt`). Skip the sweep when the ledger is missing. Run the block below. Verify: `grep -c '^BLOCKED ' "$C"` prints `0`, and `grep -cvE '^(APPLIED|SKIP-GONE|LEDGER-MISSING)( |$)' "$C"` prints `0`. A `BLOCKED` line is recorded in `goal.md` section 4 and the phase continues. A row whose evidence no longer reproduces is `SKIP-GONE`, which is the expected result for the known row's own ledger entry.

  ```bash
  cd "$WORKTREE"
  C="$PHASE/scratch/census.txt"
  : > "$C"
  if [ -s "$LED" ]; then
    for id in $(jq -r 'select(.owner_phase=="041-006") | .id' "$LED"); do
      cmd=$(jq -r --arg i "$id" 'select(.id==$i) | .evidence_cmd' "$LED")
      exp=$(jq -r --arg i "$id" 'select(.id==$i) | .evidence_expect' "$LED")
      if ! bash -c "$cmd" 2>&1 | grep -qF -- "$exp"; then echo "SKIP-GONE $id" >> "$C"; continue; fi
      if out=$(python3 -I "$APPLIER" "$LED" "$id" . 2>&1); then echo "APPLIED $id" >> "$C"; else echo "BLOCKED $id $out" >> "$C"; fi
    done
  else
    echo "LEDGER-MISSING" >> "$C"
  fi
  ```

- [ ] T006 Check the diff names only the recipe file (`scratch/changed-files.txt`). Run the block below. Verify: `wc -l < "$PHASE/scratch/changed-files.txt" | tr -d ' '` prints `1`, and `grep -c '^\.skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe\.md$' "$PHASE/scratch/changed-files.txt"` prints `1`. Restore a second path with `git restore --source="$START" -- <path>`, record it in `goal.md` section 4 and mark this task `[B]`.

  ```bash
  cd "$WORKTREE"
  git diff --name-only | grep -v "^$PHASE_REL/" | sort > "$PHASE/scratch/changed-files.txt"
  ```
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Recheck every row (`scratch/recheck.txt`). Run the block below. Verify: `grep -c '^YES ' "$R"` prints `0`, `grep -c '^bare=0$' "$R"` prints `1`, `grep -c '^destination=1$' "$R"` prints `1` and `grep -c '^sentence=1$' "$R"` prints `1`.

  ```bash
  cd "$WORKTREE"
  R="$PHASE/scratch/recheck.txt"
  : > "$R"
  echo "bare=$(grep -cF -- '  <spec-folder>' "$RECIPE")" >> "$R"
  echo "destination=$(grep -cF -- '  specs/system-speckit/078-opencode-authoring-recipe' "$RECIPE")" >> "$R"
  echo "sentence=$(grep -cF -- 'The `system-speckit` track in the destination above is an example, so substitute the track you chose in the pre-conditions.' "$RECIPE")" >> "$R"
  if [ -s "$LED" ]; then
    for id in $(jq -r 'select(.owner_phase=="041-006") | .id' "$LED"); do
      cmd=$(jq -r --arg i "$id" 'select(.id==$i) | .evidence_cmd' "$LED")
      exp=$(jq -r --arg i "$id" 'select(.id==$i) | .evidence_expect' "$LED")
      if bash -c "$cmd" 2>&1 | grep -qF -- "$exp"; then echo "YES $id" >> "$R"; fi
    done
  else
    echo "LEDGER-MISSING" >> "$R"
  fi
  ```

- [ ] T008 Run the spec-kit suite and compare (`scratch/suite-end.txt`). Run the first block. It takes several minutes. Then run the second block. Verify: the second block prints `SUITE_MATCH`. When the 054 phase 001 start file is absent, the second block compares with this phase's own start run and you write `REF-SUBSTITUTED` in `goal.md` section 4. When it prints `SUITE_DIFF`, read the diff, rerun the first block once and compare again. A second diff marks this task `[B]`.

  ```bash
  cd "$WORKTREE"
  npm --prefix "$WORKTREE/$S" test > "$PHASE/scratch/suite-end.txt" 2>&1; echo "exit=$?" >> "$PHASE/scratch/suite-end.txt"
  ```

  ```bash
  cd "$WORKTREE"
  REF="$WORKTREE/specs/system-speckit/054-weak-model-spec-authoring/001-template-drift-census-and-baseline/scratch/baseline/suite-start.txt"
  if [ -s "$REF" ]; then SRC_START="$REF"; else SRC_START="$PHASE/scratch/suite-start.txt"; fi
  for w in start end; do
    if [ "$w" = start ]; then src="$SRC_START"; else src="$PHASE/scratch/suite-end.txt"; fi
    { grep -E '^ *(Test Files|Tests) ' "$src" | sed -E 's/^ +//; s/ +$//'; tail -1 "$src"; } > "$PHASE/scratch/suite-$w-summary.txt"
  done
  diff "$PHASE/scratch/suite-start-summary.txt" "$PHASE/scratch/suite-end-summary.txt" && echo SUITE_MATCH || echo SUITE_DIFF
  ```

- [ ] T009 Frontier review of the diff (`scratch/review/T009.txt`). Read `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` section 3 first. Write the brief with the first block and send it with the second block. Verify: `grep -cvE '^(P[012]) |^NO FINDINGS$' "$PHASE/scratch/review/T009.txt"` prints `0`, `test -s "$PHASE/scratch/review/T009.txt" && echo REVIEW_NONEMPTY` prints `REVIEW_NONEMPTY` and `test -f "$PHASE/scratch/review/T009.err" && echo ERR_FILE` prints `ERR_FILE`.

  ```bash
  cd "$WORKTREE"
  mkdir -p "$PHASE/scratch/briefs" "$PHASE/scratch/review"
  cat > "$PHASE/scratch/briefs/T009.txt" <<BRIEF
  GATE 3 IS PRE-RESOLVED. You are a non-interactive read-only reviewer. AI_SESSION_CHILD=1 is set.
  You write nothing, so no documentation-scope question applies. Do not edit, create or delete any file.
  ROLE: You are a read-only reviewer of a text diff. Your output is checked line by line by a script.
  Run: git diff $START -- .skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md
  Read the file at HEAD and the working file. Check these five things:
  (1) The only changed lines are the Step 2 destination line and the two added lines after the code block.
  (2) The new destination is specs/system-speckit/078-opencode-authoring-recipe and the line keeps its two leading spaces.
  (3) The added sentence says the track is an example and the reader substitutes the track they selected.
  (4) No other line in the file changed, and the Step 2 block still reads as a working command.
  (5) The added prose holds no em dash and no semicolon.
  Start each finding with its severity, then a space, then the file, line, wrong text and fix:
  P0 <file>:<line> | <what is wrong> | <the fix>
  Write P1 or P2 in place of P0 for a lesser finding.
  Return the single line NO FINDINGS when there are none.
  BRIEF
  ```

  ```bash
  cd "$WORKTREE"
  AI_SESSION_CHILD=1 codex exec --model gpt-6-luna -c model_reasoning_effort="high" -c service_tier="fast" \
    -c approval_policy=never --sandbox read-only "$(cat "$PHASE/scratch/briefs/T009.txt")" </dev/null \
    > "$PHASE/scratch/review/T009.txt" 2> "$PHASE/scratch/review/T009.err" &
  PID=$!; wait "$PID"; kill -9 "$PID" 2>/dev/null; pkill -9 -P "$PID" 2>/dev/null
  ```

- [ ] T010 Apply the review findings and close the phase (this folder). For each `P0` or `P1` line, write one row into `scratch/review-rows.jsonl` with `file` set to `.skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md` and the finding's line as `locator` and that line with the third column applied as `expected_text`, numbered `R-041-006-01`, `R-041-006-02` and so on in the order the findings appear. Apply them with `for id in $(jq -r .id "$PHASE/scratch/review-rows.jsonl"); do python3 -I "$APPLIER" "$PHASE/scratch/review-rows.jsonl" "$id" .; done`, then rerun T004's verify block, T007 and T008. For each `P2` line, do the same or write the reason it was not fixed in `goal.md` section 4. A finding that asks for a change outside the recipe file is not applied. Write it in `goal.md` section 4 and raise it to the operator. Then run `bash $S/runtime/cli/spec/validate.sh "$PHASE" --strict`, fill `implementation-summary.md` with what changed and the T004, T005, T006, T007 and T008 results, and mark each row of `acceptance-criteria.md` `Met` with its evidence. Verify: the validate command prints `RESULT: PASSED`, and `grep -cE '^\| AC-00[1-6] \|.*\| Met \| - \|$' "$PHASE/acceptance-criteria.md"` prints `6`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every acceptance criterion marked `Met` with its evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, which holds the known row and the AI execution protocol
- **Phase 1 ledger**: See `../../054-weak-model-spec-authoring/001-template-drift-census-and-baseline/scratch/ledger/ledger.jsonl`
- **Phase 2 applier**: See `../../054-weak-model-spec-authoring/002-template-and-example-defect-repair/scratch/tools/apply_row.py`
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

- [ ] CHK-001 [P0] The applier exists at the path in `plan.md` section 6, shown by T001
- [ ] CHK-002 [P0] T001 to T003 done with their verify output recorded
- [ ] CHK-003 [P1] The known row is saved under `scratch/known-rows.jsonl` before the first apply
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `scratch/known-rows.jsonl` parses with `jq -c .`
- [ ] CHK-011 [P0] The locator occurs exactly once before the apply, shown by T003
- [ ] CHK-012 [P1] No model edited the recipe, shown by `scratch/applied.txt`
- [ ] CHK-013 [P1] The added sentence holds no em dash and no semicolon
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] T007 prints `bare=0` and 0 `YES` lines
- [ ] CHK-022 [P1] T008 prints `SUITE_MATCH`
- [ ] CHK-023 [P1] A row that failed is recorded with its error and not silently dropped
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] The known row ends as `APPLIED` in `scratch/applied.txt`
- [ ] CHK-FIX-002 [P0] Every owner `041-006` row is `APPLIED`, `SKIP-GONE` or `BLOCKED` in `scratch/census.txt`
- [ ] CHK-FIX-003 [P0] `scratch/changed-files.txt` names only the recipe file
- [ ] CHK-FIX-004 [P1] The same class was searched over the whole recipe file, not one line
- [ ] CHK-FIX-005 [P1] The adjacent placeholders are listed in `goal.md` section 4
- [ ] CHK-FIX-006 [P1] Evidence is pinned to the start commit recorded in T002
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No brief contains a credential, token or key
- [ ] CHK-031 [P0] The applier wrote only the recipe file
- [ ] CHK-032 [P1] The reviewer ran with `AI_SESSION_CHILD=1` and `--sandbox read-only`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks agree on the known row
- [ ] CHK-041 [P1] `goal.md` section 4 records the start commit and each blocker
- [ ] CHK-042 [P2] `scratch/applied.txt` and `scratch/census.txt` are kept as the record of what ran
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Working files are under this phase's `scratch/` only
- [ ] CHK-051 [P1] `scratch/test/` holds only the authoring-time applier test
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 23 | 0/23 |
| P2 Items | 9 | 0/9 |

**Verification Date**: not yet run
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001 and ADR-002 in `plan.md` are followed by T003 and T004
- [ ] CHK-101 [P1] Both ADRs have status Accepted
- [ ] CHK-102 [P1] Each ADR names the alternative it rejected and why
- [ ] CHK-103 [P2] No migration applies to this phase
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] The apply took one applier call, shown by `scratch/applied.txt` (NFR-P01)
- [ ] CHK-111 [P1] The recipe's `version:` was not edited by hand, shown by a diff with no `version:` line
- [ ] CHK-112 [P2] No load test applies to this phase
- [ ] CHK-113 [P2] The suite run time is recorded in `goal.md` section 4
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback in `plan.md` section 7 was not needed, or was run and recorded
- [ ] CHK-121 [P0] Nothing outside this phase folder and the recipe changed, shown by T006
- [ ] CHK-122 [P1] The parent 041 phase map row can move to Complete: the recipe is fixed and the suite matches
- [ ] CHK-123 [P1] `goal.md` section 4 names the next action as the operator commit
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
- [ ] CHK-141 [P1] `implementation-summary.md` cites `applied.txt` and the T008 result
- [ ] CHK-142 [P2] The recipe is the only reference doc changed
- [ ] CHK-143 [P2] The count of owner `041-006` rows applied and skipped is recorded for the operator
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Conductor | Runs and verifies every task | Pending | |
| Frontier reviewer | Reads the diff read-only | Pending | |
| Operator | Commits the recipe fix | Pending | |
<!-- /ANCHOR:sign-off -->

