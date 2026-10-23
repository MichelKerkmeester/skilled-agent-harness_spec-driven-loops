---
title: "Tasks: Phase 5: weak-model-authoring-card"
description: "Task Format: T### [P?] Description (file path). Verify: the command whose output proves the task."
trigger_phrases:
  - "weak model authoring card tasks"
  - "card router edits"
  - "card sync guard tasks"
  - "level 1 smoke run brief"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: weak-model-authoring-card

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

**Task Format**: `T### [P?] Description (file path). Verify: the command whose output proves the task.`

Shell variables used below, set once by the conductor:
- `WORKTREE`: the build worktree path recorded in `../goal.md` section 4.
- `PHASE`: `$WORKTREE/specs/system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card`
- `S`: `.skilled/skills/system-spec-kit`
- `START`: the commit hash recorded by T002.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Check tools, provider and the two dependency phases (no file). Verify: `rg -c 'deepseek-v4.1-flash-1017' opencode.json` prints a number above 0, `which jq rg awk node` prints four paths, and `rg -c 'SPECKIT_TEMPLATE_SOURCE:.*\| v2\.3 -->' $S/templates/core/spec.md.tmpl $S/templates/core/plan.md.tmpl $S/templates/core/tasks.md.tmpl $S/templates/core/implementation-summary.md.tmpl` prints `3`, `1`, `1`, `1`. These stamp counts hold on the post-003 tree, and the tasks template prints `0` on the pre-003 tree. A count below 1 on any of the four templates means phase 003 is not closed: STOP and record the blocker in `goal.md` section 4.
- [ ] T002 Record the start state (`goal.md`, `scratch/status-start.txt`). Run `git -C "$WORKTREE" rev-parse HEAD`, write the hash into the Evidence cell of the `Start commit recorded` row in `goal.md` section 4 as `Start commit: <hash>`, then run `git -C "$WORKTREE" status --porcelain > "$PHASE/scratch/status-start.txt"`. Verify: `grep -c 'Start commit:' "$PHASE/goal.md"` prints `1` and `wc -l < "$PHASE/scratch/status-start.txt"` prints a number.
- [ ] T003 Locator pre-check, no edit yet (no file). Verify: these four commands print the four expected values.

  ```bash
  cd "$WORKTREE"
  awk '/^    "(PLAN|IMPLEMENT|INTAKE|TEMPLATE_AUTHORING)": \[$/ {inside=1} inside && /template-guide\.md/ {n++} inside && /^    \],$/ {inside=0} END {print n+0}' $S/SKILL.md
  awk '/^    "(PLAN|IMPLEMENT|INTAKE|TEMPLATE_AUTHORING)": \[$/ {inside=1} inside && /spec-authoring-card\.md/ {n++} inside && /^    \],$/ {inside=0} END {print n+0}' $S/SKILL.md
  grep -cF '**Task Format**: `T### [P?] Description (file path)`' $S/templates/core/tasks.md.tmpl
  grep -cF '[YOUR_VALUE_HERE: Implement core feature 1]' $S/templates/core/tasks.md.tmpl
  ```

  Expected: `4`, `0`, `1`, `1`. The token-form value `1` holds on the post-003 tree, where `tasks.md.tmpl` is stamped v2.3 and carries the token. On the pre-003 tree the fourth value is `0`, and phase 003 is the phase that makes it `1`. A `0` on the first line means the router already changed and this phase is stale: read `SKILL.md` and record the difference in `goal.md` section 4. A `0` on the fourth line means phase 003 is not closed: STOP.

  Also check the checklist locator, which must print `1`:

  ```bash
  grep -cF 'Read templates from `.skilled/skills/system-spec-kit/templates/`' $S/references/workflows/spec-folder-authoring-checklist.md
  ```
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Write the card (`$S/references/workflows/spec-authoring-card.md`). Copy the block in `plan.md` section 3.1, character for character, without the outer four-backtick fence. Verify: `wc -l < "$S/references/workflows/spec-authoring-card.md"` prints `172`, and the four scans below print nothing.

  ```bash
  cd "$WORKTREE"
  C=$S/references/workflows/spec-authoring-card.md
  rg -n -i '\b(preset|capabilit(y|ies)|kind|manifest)\b' "$C"
  rg -n $'\xe2\x80\x94' "$C"
  rg -n ';' "$C"
  rg -n '\[[A-Za-z][^]\[]{2,}\]' "$C"
  ```

  The first scan is the vocabulary `workflow-invariance.vitest.ts` bans. The second is the house voice rule. The third is the house voice rule for prose. The fourth is the unfilled-hint scan. A hit means the copy differs from `plan.md`: recopy, do not edit the card.

- [ ] T005 Change the four router rows and the one prose sentence (`$S/SKILL.md`). Use the edit tool with each old text exactly as written in `plan.md` sections 3.2 and 3.3. Each old text occurs once. Verify: the two counts below print `4` and `0`, and `rg -c '"references/templates/template-guide.md",' $S/SKILL.md` prints `1`.

  ```bash
  cd "$WORKTREE"
  awk '/^    "(PLAN|IMPLEMENT|INTAKE|TEMPLATE_AUTHORING)": \[$/ {inside=1} inside && /spec-authoring-card\.md/ {n++} inside && /^    \],$/ {inside=0} END {print n+0}' $S/SKILL.md
  awk '/^    "(PLAN|IMPLEMENT|INTAKE|TEMPLATE_AUTHORING)": \[$/ {inside=1} inside && /template-guide\.md/ {n++} inside && /^    \],$/ {inside=0} END {print n+0}' $S/SKILL.md
  ```

- [ ] T006 Change the checklist line (`$S/references/workflows/spec-folder-authoring-checklist.md`). Use the old and new text in `plan.md` section 3.7. Verify: `rg -c 'Read one rendered example' $S/references/workflows/spec-folder-authoring-checklist.md` prints `1` and `rg -c 'Read templates from' $S/references/workflows/spec-folder-authoring-checklist.md` prints nothing.

- [ ] T007 Add the `Verify:` slot to the task format (`$S/templates/core/tasks.md.tmpl`). Use the old and new text in `plan.md` section 3.4. Verify: `rg -c 'Verify: <command> prints <expected output>' $S/templates/core/tasks.md.tmpl` prints `1` and `grep -cF '**Task Format**: `T### [P?] Description (file path)`' $S/templates/core/tasks.md.tmpl` prints `0`.

- [ ] T008 Regenerate the two inventory files (`$S/leaf-manifest.json`, `$S/leaf-aliases.json`). Run both commands from `$WORKTREE` and read the output of each. Verify: `generate-leaf-manifest.cjs --check` prints `leaf-manifest.json OK`, `jq -r '.modes[0].leaves[]' $S/leaf-manifest.json | grep -c 'spec-authoring-card'` prints `1`, and `jq '[.[] | select(.diskPath == "references/workflows/spec-authoring-card.md")] | length' $S/leaf-aliases.json` prints `1`.

  ```bash
  cd "$WORKTREE"
  node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write $S
  node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix --skill system-spec-kit
  node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check $S
  ```

  The second command also reports other root metadata findings. A non-zero exit with both files written is recorded in `goal.md` section 4 and the task continues. A non-zero exit with no write is a blocker.

- [ ] T009 Write the guard (`$S/runtime/cli/spec/check-card-sync.sh`). Copy the block below without the outer four-backtick fence, then run `chmod +x` on it. Verify: `bash $S/runtime/cli/spec/check-card-sync.sh` prints nine `PASS` lines and `CARD SYNC OK`, and `echo $?` prints `0`.

````bash
#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: CHECK CARD SYNC
# ───────────────────────────────────────────────────────────────
# The authoring card is only useful when four surfaces agree: the card file,
# the router that loads it, the leaf inventory that lists it, and the checklist
# that sends a reader to a filled example. Each surface can be edited alone,
# and a reader then follows a path the others do not describe. This guard
# reads all four and fails on the first disagreement.
#
# Read-only. It writes no file and prints one PASS or FAIL line per check.
#
# Usage: check-card-sync.sh [--skill-root <path>]
# Exit codes: 0 every check passed, 1 one check failed, 2 bad invocation.
# ───────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

while [ "$#" -gt 0 ]; do
    case "$1" in
        --skill-root)
            [ "$#" -ge 2 ] || { echo "check-card-sync.sh: --skill-root needs a path" >&2; exit 2; }
            SKILL_ROOT="$2"
            shift 2
            ;;
        --help|-h)
            sed -n '2,14p' "${BASH_SOURCE[0]}"
            exit 0
            ;;
        *)
            echo "check-card-sync.sh: unknown option: $1" >&2
            exit 2
            ;;
    esac
done

CARD_REL="references/workflows/spec-authoring-card.md"
CARD="$SKILL_ROOT/$CARD_REL"
ROUTER="$SKILL_ROOT/SKILL.md"
LEAVES="$SKILL_ROOT/leaf-manifest.json"
ALIASES="$SKILL_ROOT/leaf-aliases.json"
CHECKLIST="$SKILL_ROOT/references/workflows/spec-folder-authoring-checklist.md"
MAX_LINES=260
STATUS=0

pass() { printf 'PASS %s\n' "$1"; }
fail_check() { printf 'FAIL %s: %s\n' "$1" "$2"; STATUS=1; }

# 1. The card exists and stays short enough to read in one pass.
if [ ! -f "$CARD" ]; then
    fail_check card-exists "missing $CARD_REL"
else
    LINES=$(wc -l < "$CARD" | tr -d ' ')
    if [ "$LINES" -le "$MAX_LINES" ]; then
        pass "card-exists ($LINES lines)"
    else
        fail_check card-length "$LINES lines, limit $MAX_LINES"
    fi
fi

# 2. Every authoring intent loads the card.
for INTENT in PLAN IMPLEMENT INTAKE TEMPLATE_AUTHORING; do
    if awk -v intent="$INTENT" '
        $0 == "    \"" intent "\": [" { inside = 1; next }
        inside && $0 == "    ]," { inside = 0 }
        inside && /spec-authoring-card\.md/ { found = 1 }
        END { exit(found ? 0 : 1) }
    ' "$ROUTER"; then
        pass "intent-$INTENT"
    else
        fail_check "intent-$INTENT" "does not load $CARD_REL"
    fi
done

# 3. The long guide is listed only in the on-demand level, not in an intent list.
GUIDE_IN_MAP=$(awk '
    /^RESOURCE_MAP = \{/ { map = 1; next }
    map && /^\}$/ { map = 0 }
    map && /"references\/templates\/template-guide\.md"/ { n++ }
    END { print n + 0 }
' "$ROUTER")
GUIDE_ON_DEMAND=$(awk '
    /"ON_DEMAND": \[/ { od = 1; next }
    od && /^    \],$/ { od = 0 }
    od && /"references\/templates\/template-guide\.md"/ { n++ }
    END { print n + 0 }
' "$ROUTER")
if [ "$GUIDE_IN_MAP" -eq 0 ] && [ "$GUIDE_ON_DEMAND" -eq 1 ]; then
    pass guide-on-demand-only
else
    fail_check guide-on-demand-only "in intent lists: $GUIDE_IN_MAP, in ON_DEMAND: $GUIDE_ON_DEMAND"
fi

# 4. The inventory lists the card and the identity projection agrees.
if jq -e --arg p "$CARD_REL" '.modes[].leaves | index($p) != null' "$LEAVES" > /dev/null; then
    pass leaf-manifest
else
    fail_check leaf-manifest "does not list $CARD_REL"
fi
if jq -e --arg p "$CARD_REL" '[.[] | select(.diskPath == $p)] | length > 0' "$ALIASES" > /dev/null; then
    pass leaf-aliases
else
    fail_check leaf-aliases "does not list $CARD_REL"
fi

# 5. The checklist sends a reader to a filled example, not the gated source root.
if rg -q 'Read templates from `\.skilled/skills/system-spec-kit/templates/`' "$CHECKLIST"; then
    fail_check checklist "still sends a reader to the templates root"
else
    pass checklist
fi

if [ "$STATUS" -ne 0 ]; then
    echo "CARD SYNC FAILED"
    exit 1
fi
echo "CARD SYNC OK"
````

  Then prove the guard fails when the card is missing. Use a copy, never the real tree:

  ```bash
  cd "$WORKTREE"
  N="$PHASE/scratch/test/guard-negative"
  rm -rf "$N"
  mkdir -p "$N/references/workflows" "$N/runtime/cli/spec"
  cp $S/SKILL.md $S/leaf-manifest.json $S/leaf-aliases.json "$N"/
  cp $S/references/workflows/spec-folder-authoring-checklist.md "$N/references/workflows/"
  cp $S/references/workflows/spec-authoring-card.md "$N/references/workflows/"
  cp $S/runtime/cli/spec/check-card-sync.sh "$N/runtime/cli/spec/"
  bash "$N/runtime/cli/spec/check-card-sync.sh" | tail -1
  rm "$N/references/workflows/spec-authoring-card.md"
  bash "$N/runtime/cli/spec/check-card-sync.sh" > "$N/fail.txt" 2>&1; echo "exit=$?"
  grep '^FAIL' "$N/fail.txt"
  tail -1 "$N/fail.txt"
  ```

  Expected: the first run prints `CARD SYNC OK`. The second run prints `exit=1`, then `FAIL card-exists: missing references/workflows/spec-authoring-card.md`, then `CARD SYNC FAILED`.

- [ ] T010 Wire the guard in (`$S/runtime/cli/spec/README.md`, `$S/runtime/cli/tests/card-sync.vitest.ts`). Add the README line from `plan.md` section 3.6, then write the test file from the same section. Verify: `cd $S && ./node_modules/.bin/vitest run runtime/cli/tests/card-sync.vitest.ts --no-cache --reporter=dot` prints `Test Files  1 passed (1)` and `Tests  1 passed (1)`.

- [ ] T011 Run the vocabulary test over the card (no file). Verify: the command below prints `Test Files  1 passed (1)` and `Tests  2 passed (2)`.

  ```bash
  cd "$WORKTREE/$S"
  WORKFLOW_INVARIANCE_EXTRA_PATHS="$WORKTREE/$S/references/workflows/spec-authoring-card.md" \
    ./node_modules/.bin/vitest run runtime/cli/tests/workflow-invariance.vitest.ts --no-cache --reporter=dot
  ```
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Run the Level 1 smoke test three times (`scratch/runs/T012-1.txt` to `T012-3.txt`). Runs are serial. Before the first run, measure the anchor counts of a fresh Level 1 scaffold:

  ```bash
  cd "$WORKTREE"
  mkdir -p "$PHASE/scratch/card-bench" "$PHASE/scratch/runs"
  bash $S/runtime/cli/spec/create.sh --skip-branch --level 1 --track zz-bench-card --short-name quiet-flag "Add a quiet flag to recommend-level.sh"
  P=specs/zz-bench-card/001-quiet-flag
  for f in spec plan tasks implementation-summary; do echo "$f $(rg -c '<!-- ANCHOR:' $P/$f.md)"; done > "$PHASE/scratch/card-bench/anchors-level1.txt"
  rm -r specs/zz-bench-card
  cat "$PHASE/scratch/card-bench/anchors-level1.txt"
  ```

  Expected on the templates this plan was written against: `spec 7`, `plan 7`, `tasks 6`, `implementation-summary 6`. A different count is not a failure: record the count you saw in `goal.md` section 4 and use that file as the baseline, because a later template edit may add an anchor.

  For each run `N` in 1, 2, 3: save `git status --porcelain` to `scratch/card-bench/status-before-$N.txt`, set `TASK=T012-$N`, save the brief below to `scratch/briefs/$TASK.txt` with the skeleton from `plan.md` and the packet folder line set to `specs/zz-bench-card/001-quiet-flag`, run `date +%s > "$PHASE/scratch/runs/$TASK.t0"`, dispatch it with the plan's Task tool instruction and write the subagent's final reply to `scratch/runs/$TASK.txt`, then run `date +%s > "$PHASE/scratch/runs/$TASK.t1"` and T013 before the next run.

  ```text
  ROLE: You are a documentation author working in this repository. You have one
  document to follow: the spec authoring card at
  .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md.
  Read it first. Do not open references/templates/template-guide.md.

  ALLOWED WRITE PATHS:
    specs/zz-bench-card/ and everything under it

  BANNED OPERATIONS: git commit, git push, git checkout, git switch, git branch, git reset,
  git stash, generate-context.js, /speckit:save, and any edit outside specs/zz-bench-card/.
  Do not edit recommend-level.sh. Do not edit anything under .skilled/.

  TASK: Follow the card to author one Level 1 packet.

  Feature: add a --quiet flag to .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh.
  With --quiet the script prints only its final recommended-level line. Without the flag its
  output is unchanged.

  Use these exact values in the card's steps 2 and 3:
    --loc 200 --files 3
    --level 1 --track zz-bench-card --short-name quiet-flag "Add a quiet flag to recommend-level.sh"

  The level helper prints Recommended Level: 1 (Baseline) for those values.

  The packet folder is specs/zz-bench-card/001-quiet-flag. Fill spec.md, plan.md and tasks.md
  as the card says. Fill implementation-summary.md as a planned-state summary: say the packet
  is planned and not implemented, and name the file the plan will change. Do not claim the flag
  is implemented. Run the card's step 9 until it prints RESULT: PASSED, at most three times.

  RETURN exactly one line: the last RESULT line validate.sh printed.
  ```

  Verify: `ls "$PHASE"/scratch/runs/T012-{1,2,3}.txt` lists three files and `cat "$PHASE"/scratch/runs/T012-{1,2,3}.txt | grep -c 'RESULT: PASSED'` prints `3`.

- [ ] T013 Measure each run, then delete its track (`scratch/card-bench/baseline.json`). After each run, before the next one starts, run this from `$WORKTREE` with `N` set to the run number. The `scratch/runs/T012-$N.t0` and `.t1` files hold the start and end times. After the third run, write `baseline.md` from `baseline.json` with the command below. Verify: `jq '.runs | length' "$PHASE/scratch/card-bench/baseline.json"` prints `3` after the third run and `grep -c 'out_of_scope_writes' "$PHASE/scratch/card-bench/baseline.md"` prints `2`.

  ```bash
  P=specs/zz-bench-card/001-quiet-flag
  M1=$(bash $S/runtime/cli/spec/validate.sh $P --strict 2>&1 | grep -c 'RESULT: PASSED')
  M2=$(grep -hoF '[YOUR_VALUE_HERE: ' $P/spec.md $P/plan.md $P/tasks.md $P/implementation-summary.md 2>/dev/null | wc -l | tr -d ' ')
  M3=0; while read f n; do have=$(rg -c '<!-- ANCHOR:' $P/$f.md 2>/dev/null || echo 0); [ "$have" -lt "$n" ] && M3=$((M3 + n - have)); done < "$PHASE/scratch/card-bench/anchors-level1.txt"
  git status --porcelain > "$PHASE/scratch/card-bench/status-after-$N.txt"
  M4=$(diff "$PHASE/scratch/card-bench/status-before-$N.txt" "$PHASE/scratch/card-bench/status-after-$N.txt" | grep '^>' | grep -v 'zz-bench-card' | grep -v '054-weak-model-spec-authoring/005-' | wc -l | tr -d ' ')
  M5=$(( $(cat "$PHASE/scratch/runs/T012-$N.t1") - $(cat "$PHASE/scratch/runs/T012-$N.t0") ))
  echo "{\"run\":$N,\"strict_passed\":$M1,\"leftover_tokens\":$M2,\"missing_anchors\":$M3,\"out_of_scope_writes\":$M4,\"seconds\":$M5}" >> "$PHASE/scratch/card-bench/runs.jsonl"
  jq -s '{runs: .}' "$PHASE/scratch/card-bench/runs.jsonl" > "$PHASE/scratch/card-bench/baseline.json"
  rm -r specs/zz-bench-card
  ```

  When `M4` is above 0, restore each listed path with `git restore --source="$START" -- <path>` before the next run and record the paths in `goal.md` section 4.

  After the third run, write `baseline.md` from `baseline.json`:

  ```bash
  jq -r '"# Card bench baseline\n\n- strict_passed: `1` when strict validation printed `RESULT: PASSED`, `0` otherwise.\n- leftover_tokens: count of unfilled `YOUR_VALUE_HERE` tokens in the four documents.\n- missing_anchors: anchors missing from the packet against `anchors-level1.txt`.\n- out_of_scope_writes: changed paths outside the bench track and this phase.\n- seconds: wall-clock seconds for the run.\n\n## Range", (.runs | "strict_passed \(min_by(.strict_passed).strict_passed) to \(max_by(.strict_passed).strict_passed)", "leftover_tokens \(min_by(.leftover_tokens).leftover_tokens) to \(max_by(.leftover_tokens).leftover_tokens)", "missing_anchors \(min_by(.missing_anchors).missing_anchors) to \(max_by(.missing_anchors).missing_anchors)", "out_of_scope_writes \(min_by(.out_of_scope_writes).out_of_scope_writes) to \(max_by(.out_of_scope_writes).out_of_scope_writes)", "seconds \(min_by(.seconds).seconds) to \(max_by(.seconds).seconds)")' "$PHASE/scratch/card-bench/baseline.json" > "$PHASE/scratch/card-bench/baseline.md"
  ```

- [ ] T014 Frontier review of the phase diff (`scratch/review/T014.txt`). Read `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` first. Save the block below as `$PHASE/scratch/review/T014-brief.txt`, then run this command from `$WORKTREE`. Verify: the file exists and every line matches `^(P0|P1|P2) ` or the single line `NO FINDINGS`.

  ```bash
  mkdir -p "$PHASE/scratch/review"
  codex -a never exec \
    --model gpt-6-luna \
    -c model_reasoning_effort="max" \
    -c service_tier="fast" \
    --sandbox read-only \
    -o "$PHASE/scratch/review/T014.txt" \
    "$(cat "$PHASE/scratch/review/T014-brief.txt")" </dev/null
  ```

  ```text
  You are a read-only reviewer. Do not edit, create or delete any file.
  Read the diff of the working tree against the commit named in
  specs/system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card/goal.md
  section 4 as Start commit.
  Check these claims against the files:
  (1) the card at .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md
      is at most 260 lines and every command in it is real,
  (2) the four RESOURCE_MAP intents in SKILL.md load the card and nothing else loads the guide,
  (3) leaf-manifest.json and leaf-aliases.json both list the card,
  (4) check-card-sync.sh fails when any of the above is false,
  (5) the checklist line and the tasks template line match the plan.
  Return one line per finding in this form, and nothing else:
  P0|P1|P2 <file>:<line> | <what is wrong> | <the fix>
  Return the single line NO FINDINGS when there are none.
  ```

- [ ] T015 Close the phase (this folder). Run `bash $S/runtime/cli/spec/validate.sh "$PHASE" --strict`, then `bash $S/runtime/cli/spec/check-card-sync.sh`, then `git -C "$WORKTREE" status --porcelain` and compare it with `scratch/status-start.txt`. Fill `implementation-summary.md` and mark each `acceptance-criteria.md` row. Verify: `bash $S/runtime/cli/spec/validate.sh "$PHASE" --strict` prints `RESULT: PASSED`, `bash $S/runtime/cli/spec/check-card-sync.sh` prints `CARD SYNC OK`, `rg -o '\| Unmet \|' "$PHASE/acceptance-criteria.md" | wc -l` prints `0`, `rg -o 'Not started' "$PHASE/implementation-summary.md" | wc -l` prints `0`, and the status diff lists only the nine declared paths and this phase folder.
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
- **Plan**: See `plan.md`, which holds the frozen card text, the router rows, the template row and the guard source
- **Phase 003 output**: See `../003-versioned-placeholder-gate/plan.md` section 3 for the token form and the stamp
- **Phase 001 baseline**: See `../001-template-drift-census-and-baseline/tasks.md` T009 and T010 for the five-metric shape this phase copies
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

- [ ] CHK-001 [P0] Phases 003 and 004 are closed, shown by the v2.3 stamp count and the token-form locator in T001 and T003
- [ ] CHK-002 [P0] T001 to T003 are done with their verify output recorded
- [ ] CHK-003 [P1] Every brief is saved under `scratch/briefs/` before dispatch
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `wc -l` on the card prints a number at or below 260
- [ ] CHK-011 [P0] The card carries none of the four banned words, no em dash and no semicolon
- [ ] CHK-012 [P0] All four intents load the card, shown by the T005 count of 4
- [ ] CHK-013 [P0] The guide appears once in `ON_DEMAND` and nowhere in `RESOURCE_MAP`
- [ ] CHK-014 [P0] Both inventory files list the card
- [ ] CHK-015 [P1] The checklist line points at a rendered example or a scaffold
- [ ] CHK-016 [P1] The tasks template declares the `Verify:` slot
- [ ] CHK-017 [P1] The guard is executable and its `--help` exits 0
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] `check-card-sync.sh` exits 0 with nine `PASS` lines on the changed tree
- [ ] CHK-021 [P0] The same guard exits 1 with `FAIL card-exists` on a copy without the card
- [ ] CHK-022 [P1] `card-sync.vitest.ts` passes
- [ ] CHK-023 [P1] `workflow-invariance.vitest.ts` passes with the card as an extra path
- [ ] CHK-024 [P1] `baseline.json` holds three runs with five metrics each
- [ ] CHK-025 [P1] At least one run records `strict_passed` 1 and `leftover_tokens` 0
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Every surface that named the guide as an intent load is updated, shown by the T005 count of 0
- [ ] CHK-FIX-002 [P0] Every surface that must name the card does, shown by the guard's nine checks
- [ ] CHK-FIX-003 [P0] The inventory is generated, never hand-edited, shown by `generate-leaf-manifest.cjs --check`
- [ ] CHK-FIX-004 [P1] The same-class inventory `rg -l 'template-guide\.md' $S` was run and each hit is either changed or recorded as a browse link
- [ ] CHK-FIX-005 [P1] The matrix of four intents by two tiers is reported as eight cells in `goal.md` section 4
- [ ] CHK-FIX-006 [P1] Evidence is pinned to the start commit recorded in T002
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No brief contains a credential, token or key
- [ ] CHK-031 [P0] No worker wrote outside its ALLOWED WRITE PATHS, shown by metric M4 and the T015 status diff
- [ ] CHK-032 [P1] Every worker brief carried the Task-subagent pre-resolution line for the spec-folder question
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` agree on the card path, the 260-line limit and the four intents
- [ ] CHK-041 [P1] `goal.md` section 4 records the start commit, each dispatch and each blocker
- [ ] CHK-042 [P2] `scratch/card-bench/baseline.md` explains each metric in one line
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Working files are under this phase's `scratch/` only
- [ ] CHK-051 [P1] `specs/zz-bench-card/` does not exist at phase close
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 0/17 |
| P1 Items | 26 | 0/26 |
| P2 Items | 9 | 0/9 |

**Verification Date**: not yet run
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001, ADR-002 and ADR-003 in `plan.md` are followed by T004, T008 and T009
- [ ] CHK-101 [P1] All three ADRs have status Accepted
- [ ] CHK-102 [P1] Each ADR names the alternative it rejected and why
- [ ] CHK-103 [P2] No migration applies to this phase
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Every card section stays under 20 lines (NFR-P01)
- [ ] CHK-111 [P1] Seconds per smoke run recorded as metric M5
- [ ] CHK-112 [P2] No load test applies to this phase
- [ ] CHK-113 [P2] The minimum and maximum of each metric are recorded in `baseline.md`
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback in `plan.md` section 7 was not needed, or was run and recorded
- [ ] CHK-121 [P0] Nothing outside the nine declared paths and this phase folder changed, shown by T015
- [ ] CHK-122 [P1] Phase 6 can start: the card exists and the guard is green
- [ ] CHK-123 [P1] `goal.md` section 4 names the next phase as ready
- [ ] CHK-124 [P2] No deployment applies to this phase
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] The frontier review ran read-only and its reply is saved
- [ ] CHK-131 [P1] No new dependency was installed
- [ ] CHK-132 [P2] No user data is handled by this phase
- [ ] CHK-133 [P2] No OWASP surface is touched by this phase
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` agree at close
- [ ] CHK-141 [P1] `implementation-summary.md` cites the card and the guard
- [ ] CHK-142 [P2] No user-facing documentation changes in this phase
- [ ] CHK-143 [P2] The card's section count is recorded for phase 6
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Conductor | Runs and verifies every task | Pending | |
| Frontier reviewer | Reads the diff read-only | Pending | |
| Operator | Merges the phase commit | Pending | |
<!-- /ANCHOR:sign-off -->
