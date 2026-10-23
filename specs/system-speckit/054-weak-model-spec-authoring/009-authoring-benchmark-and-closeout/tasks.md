---
title: "Tasks: Phase 9: authoring-benchmark-and-closeout"
description: "Task Format: T### [P?] Description (file path). Each task names its verify command and its expected output, and every metric command is literal."
trigger_phrases:
  - "authoring benchmark and closeout tasks"
  - "final baseline run tasks"
  - "packet closeout tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: authoring-benchmark-and-closeout

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
- `PKT`: `$WORKTREE/specs/system-speckit/054-weak-model-spec-authoring`
- `PHASE`: `$PKT/009-authoring-benchmark-and-closeout`
- `SC`: `$PHASE/scratch`
- `S`: `.skilled/skills/system-spec-kit`
- `P1`: `$PKT/001-template-drift-census-and-baseline`
- `P3`: `$PKT/003-versioned-placeholder-gate`
- `START`: the commit hash in `$SC/baseline/start-commit.txt`, recorded by T003.

Every command runs from `$WORKTREE` unless the task says otherwise. Numbers printed in a Verify line that depend on the run are written as a rule, not as a fixed value. The one fixed number, the phase 1 baseline count of 97 leftover hints, is quoted from `../001-template-drift-census-and-baseline/implementation-summary.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Check the tools and the configured model (no file). Verify: `rg -c 'deepseek-v4.1-flash-1017' opencode.json` prints a number above 0, and `for t in jq rg awk node python3 git perl; do command -v "$t" || echo "MISSING $t"; done` prints seven paths and no `MISSING` line.

- [ ] T002 Check that every prior phase and the write-recipe child are closed (no file). Run the block below. Verify: the first line reads `8 RESULT: PASSED`, the second reads `RESULT: PASSED`, then `BASELINE_OK`, `CENSUS_OK`, `DRIFT_GUARD_OK`, `CARD_GUARD_OK`, `NESTED_OK` and a final `RESULT: PASSED`. When one line is missing or a child fails, write the missing path or the failing child in `goal.md` section 4 and stop the phase. This phase does not edit another phase folder.

  ```bash
  cd "$WORKTREE"
  for d in $PKT/00[1-8]-*/; do bash $S/runtime/cli/spec/validate.sh "$d" --strict 2>&1 | grep 'RESULT:' | tail -1; done | sort | uniq -c | sed 's/^ *//'
  bash $S/runtime/cli/spec/validate.sh specs/system-speckit/041-write-recipe-fixes/006-fix-write-recipe-move-destination --strict 2>&1 | grep 'RESULT:' | tail -1
  test -s "$P1/scratch/baseline/baseline.json" && jq -e '.runs | length == 3' "$P1/scratch/baseline/baseline.json" > /dev/null && test -s "$P1/scratch/baseline/hints-v2.2.txt" && echo BASELINE_OK
  test -s "$P3/scratch/census/folders.txt" && test -s "$P3/scratch/census/b-before.tsv" && test -s "$P3/scratch/census/shard-0.txt" && echo CENSUS_OK
  test -f "$S/runtime/cli/spec/check-example-drift.sh" && echo DRIFT_GUARD_OK
  test -f "$S/runtime/cli/spec/check-card-sync.sh" && echo CARD_GUARD_OK
  test -s "$S/runtime/cli/dist/spec-folder/nested-changelog.js" && echo NESTED_OK
  bash $S/runtime/cli/spec/validate.sh "$PKT" --recursive --strict 2>&1 | grep 'RESULT:' | tail -1
  ```

- [ ] T003 Record the start state (`goal.md`, `scratch/baseline/status-start.txt`, `scratch/baseline/suite-final.txt`). Run the block below, then write the hash into `goal.md` section 4 as a row `| Phase start commit | Done | <the 40 character hash> |`. Verify: `grep -cE 'Phase start commit \| Done \| [0-9a-f]{40}' "$PHASE/goal.md"` prints `1`, `tail -1 "$SC/baseline/suite-final.txt"` prints `exit=0`, and `wc -l < "$SC/baseline/status-start.txt"` prints a number. A suite exit other than 0 stops the phase with the failing summary lines in `goal.md` section 4.

  ```bash
  cd "$WORKTREE"
  mkdir -p "$SC/baseline" "$SC/runs" "$SC/briefs" "$SC/review" "$SC/closeout" "$SC/index" "$SC/tools" "$SC/test"
  git rev-parse HEAD | tee "$SC/baseline/start-commit.txt"
  git status --porcelain > "$SC/baseline/status-start.txt"
  npm --prefix "$WORKTREE/$S" test > "$SC/baseline/suite-final.txt" 2>&1; echo "exit=$?" >> "$SC/baseline/suite-final.txt"
  ```
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Build the final vocabulary and anchor list (`scratch/baseline/hints-v2.3.txt`, `scratch/baseline/anchors-v2.3.txt`). Run the block below. It scaffolds one Level 2 packet, extracts the distinct value tokens and the anchor count of each of the four documents, then deletes the throwaway track. Verify: `wc -l < "$SC/baseline/hints-v2.3.txt"` prints a number above 50, `cat "$SC/baseline/anchors-v2.3.txt"` prints four lines, and `test ! -e specs/zz-bench-hints && echo TRACK_GONE` prints `TRACK_GONE`. Record both counts in `goal.md` section 4.

  ```bash
  cd "$WORKTREE"
  bash $S/runtime/cli/spec/create.sh --skip-branch --level 2 --track zz-bench-hints --short-name recommend-level-quiet-flag "Add a quiet flag to recommend-level.sh"
  P=specs/zz-bench-hints/001-recommend-level-quiet-flag
  rg -o --no-filename '\[YOUR_VALUE_HERE: [^]]*\]' $P/spec.md $P/plan.md $P/tasks.md $P/acceptance-criteria.md | sort -u > "$SC/baseline/hints-v2.3.txt"
  for f in spec plan tasks acceptance-criteria; do echo "$f $(rg -c '<!-- ANCHOR:' $P/$f.md)"; done > "$SC/baseline/anchors-v2.3.txt"
  rm -r specs/zz-bench-hints
  ```

- [ ] T005 Run the final baseline three times, serially (`scratch/runs/T005-1.txt` to `T005-3.txt`, `scratch/baseline/runs.jsonl`). For each run `N` in 1, 2, 3, in order:
  1. Save `git status --porcelain` to `$SC/baseline/status-before-$N.txt`.
  2. Save `date +%s` to `$SC/runs/T005-$N.t0` before the Task call.
  3. Build the brief as the skeleton in `plan.md` section AI EXECUTION PROTOCOL followed by the frozen task block below, save it as `$SC/briefs/T005-$N.txt`, set `TASK=T005-$N`, and dispatch it with the Task tool as the plan's Dispatch Command says. When the subagent returns, write its final reply verbatim to `$SC/runs/T005-$N.txt` with the write tool, then run `date +%s > "$SC/runs/T005-$N.t1"`.
  4. Run T006 for that run before starting the next one.

  Verify: `for n in 1 2 3; do test -s "$SC/runs/T005-$n.txt" && test -s "$SC/runs/T005-$n.t0" && test -s "$SC/runs/T005-$n.t1" && test -s "$SC/baseline/status-before-$n.txt" && echo "run-$n recorded"; done` prints `run-1 recorded`, `run-2 recorded` and `run-3 recorded`, and the frozen-text check prints `TASK_FROZEN`.

  Frozen task block, copied from `../001-template-drift-census-and-baseline/tasks.md` T009 with no word changed:

  ```text
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

  Frozen-text check, run after the three briefs exist:

  ```bash
  cd "$WORKTREE"
  awk '/TASK: Write the planning documents/,/RETURN exactly one line/' "$P1/tasks.md" | sed -E 's/^[[:space:]]+//' > "$SC/baseline/task-phase1.txt"
  awk '/TASK: Write the planning documents/,/RETURN exactly one line/' "$SC/briefs/T005-1.txt" | sed -E 's/^[[:space:]]+//' > "$SC/baseline/task-final.txt"
  cmp "$SC/baseline/task-phase1.txt" "$SC/baseline/task-final.txt" && echo TASK_FROZEN
  ```

- [ ] T006 Measure each final run, then delete its track (part of `scratch/baseline/baseline.json`). Run the block below after run `N` stops, with `N` set to the run number, before the next dispatch. Verify: after the third run, `jq '.runs | length' "$SC/baseline/baseline.json"` prints `3`, `jq '.runs[] | keys | length' "$SC/baseline/baseline.json"` prints `6` three times, and `test ! -e specs/zz-bench-authoring && echo TRACK_GONE` prints `TRACK_GONE`.

  ```bash
  cd "$WORKTREE"
  P=specs/zz-bench-authoring/001-recommend-level-quiet-flag
  H22="$P1/scratch/baseline/hints-v2.2.txt"
  A23="$SC/baseline/anchors-v2.3.txt"
  T0=$(cat "$SC/runs/T005-$N.t0")
  M1=$(bash $S/runtime/cli/spec/validate.sh $P --strict 2>&1 | grep -c 'RESULT: PASSED')
  M2=$( { grep -F -o -f "$H22" $P/spec.md $P/plan.md $P/tasks.md $P/acceptance-criteria.md 2>/dev/null; rg -o --no-filename '\[YOUR_VALUE_HERE: [^]]*\]' $P/spec.md $P/plan.md $P/tasks.md $P/acceptance-criteria.md 2>/dev/null; } | wc -l | tr -d ' ')
  M3=0; while read f n; do have=$(rg -c '<!-- ANCHOR:' $P/$f.md 2>/dev/null || echo 0); [ "$have" -lt "$n" ] && M3=$((M3 + n - have)); done < "$A23"
  git status --porcelain > "$SC/baseline/status-after-$N.txt"
  M4=$(diff "$SC/baseline/status-before-$N.txt" "$SC/baseline/status-after-$N.txt" | grep '^>' | grep -v 'zz-bench-authoring' | grep -v '054-weak-model-spec-authoring/009-' | wc -l | tr -d ' ')
  M5=$(( $(date +%s) - T0 ))
  echo "{\"run\":$N,\"strict_passed\":$M1,\"leftover_hints\":$M2,\"missing_anchors\":$M3,\"out_of_scope_writes\":$M4,\"seconds\":$M5}" >> "$SC/baseline/runs.jsonl"
  jq -s '{runs: .}' "$SC/baseline/runs.jsonl" > "$SC/baseline/baseline.json"
  rm -r specs/zz-bench-authoring
  ```

  When `M4` is above 0, restore each listed path with `git restore --source="$START" -- <path>` before the next run and record the paths in `goal.md` section 4. When a run did not create the packet folder, record the run output in `goal.md` section 4, re-dispatch once, and keep the failed run id in the log.

- [ ] T007 Write the delta for the five metrics (`scratch/baseline/delta.json`, `scratch/baseline/delta.md`). Run the block below. Verify: `jq '.metrics | length' "$SC/baseline/delta.json"` prints `5`, `grep -cE '^\| (strict_passed|leftover_hints|missing_anchors|out_of_scope_writes|seconds) \|' "$SC/baseline/delta.md"` prints `5`, and the last command prints `true`. When it prints `false`, write `C5 FAILED: final lowest leftover_hints is not below the baseline lowest` in `goal.md` section 4, run T008 only, then write `STOP` in `goal.md` section 4 and stop the closeout. Do not tick the parent criterion and do not publish a changelog.

  ```bash
  cd "$WORKTREE"
  B="$P1/scratch/baseline/baseline.json"
  F="$SC/baseline/baseline.json"
  jq -n --slurpfile b "$B" --slurpfile f "$F" '
    def stat($runs; $k):
      {min: ($runs | map(.[$k]) | min),
       max: ($runs | map(.[$k]) | max),
       mean: (($runs | map(.[$k]) | add) / ($runs | length))};
    ["strict_passed","leftover_hints","missing_anchors","out_of_scope_writes","seconds"] as $keys
    | {metrics: ($keys | map(. as $k | {metric: $k, baseline: stat($b[0].runs; $k), final: stat($f[0].runs; $k)}))}
    | .metrics |= map(. + {delta_mean: (.final.mean - .baseline.mean)})
  ' > "$SC/baseline/delta.json"
  jq -r '
    def one: (.*10 | round) / 10;
    "# Authoring delta\n",
    "- Baseline: three runs of the frozen task, recorded in `../001-template-drift-census-and-baseline/scratch/baseline/baseline.json`.",
    "- Final: three runs of the same task, recorded in `scratch/baseline/baseline.json`.",
    "- Each cell is the minimum, the maximum and the mean over three runs.",
    "- Three runs cannot support a significance claim. The table reports a range, not an effect size.\n",
    "| Metric | Baseline min | Baseline max | Baseline mean | Final min | Final max | Final mean | Delta of means |",
    "|--------|--------------|--------------|---------------|-----------|-----------|------------|----------------|",
    (.metrics[] | "| \(.metric) | \(.baseline.min) | \(.baseline.max) | \(.baseline.mean | one) | \(.final.min) | \(.final.max) | \(.final.mean | one) | \(.delta_mean | one) |")
  ' "$SC/baseline/delta.json" > "$SC/baseline/delta.md"
  jq -e '([.metrics[] | select(.metric=="leftover_hints")][0]) | .final.min < .baseline.min' "$SC/baseline/delta.json"
  ```

- [ ] T008 Write the benchmark report and its index row (`$S/benchmark/reports/$DATE--model-eval--authoring-baseline/`, `$S/benchmark/reports/README.md`). Read `../008-playbook-run-in-worktree/spec.md`, `../008-playbook-run-in-worktree/plan.md` and `../008-playbook-run-in-worktree/implementation-summary.md` for the report shape phase 8 accepted, and read `.skilled/skills/sk-doc/sk-create-benchmark/SKILL.md` sections 3 and 5 for the required package shape and the report contract, before composing the report. Run the block below, which writes `results.csv`, `README.md` and `source.md` from `delta.json` and inserts one index row. Verify: `awk 'NR>1' "$REPORT/results.csv" | wc -l` prints `6`, `grep -c '^## [0-9]' "$REPORT/README.md"` prints `10`, `grep -c 'model-eval--authoring-baseline' "$S/benchmark/reports/README.md"` prints `1`, and the script prints `NAME_OK`.

  ```bash
  cd "$WORKTREE"
  DATE=$(date +%F)
  NAME="$DATE--model-eval--authoring-baseline"
  REPORT="$S/benchmark/reports/$NAME"
  DELTA="$SC/baseline/delta.json"
  B="$P1/scratch/baseline/baseline.json"
  F="$SC/baseline/baseline.json"
  echo "$NAME" | grep -qE '^[0-9]{4}-[0-9]{2}-[0-9]{2}--[a-z0-9]+(-[a-z0-9]+)*--[a-z0-9]+(-[a-z0-9]+)*$' && echo NAME_OK
  mkdir -p "$REPORT"
  {
    echo 'side,run,strict_passed,leftover_hints,missing_anchors,out_of_scope_writes,seconds'
    jq -r '.runs[] | "baseline,\(.run),\(.strict_passed),\(.leftover_hints),\(.missing_anchors),\(.out_of_scope_writes),\(.seconds)"' "$B"
    jq -r '.runs[] | "final,\(.run),\(.strict_passed),\(.leftover_hints),\(.missing_anchors),\(.out_of_scope_writes),\(.seconds)"' "$F"
  } > "$REPORT/results.csv"
  val() { jq -r --arg m "$1" --arg s "$2" --arg k "$3" '.metrics[] | select(.metric==$m) | .[$s][$k]' "$DELTA"; }
  L_B_MIN=$(val leftover_hints baseline min); L_B_MAX=$(val leftover_hints baseline max)
  L_F_MIN=$(val leftover_hints final min);   L_F_MAX=$(val leftover_hints final max)
  VERDICT=$(jq -r 'if ([.metrics[] | select(.metric=="leftover_hints")][0].final.min < [.metrics[] | select(.metric=="leftover_hints")][0].baseline.min) then "PASS" else "FAIL" end' "$DELTA")
  {
    printf '# %s\n\n' "$NAME"
    printf '> system-spec-kit · model-eval · authoring-baseline · DeepSeek V4.1 Flash max\n\n---\n\n'
    printf '## 1. HEADLINE / OVERVIEW\n\n'
    printf '**Verdict: %s**\n\n' "$VERDICT"
    printf 'Three baseline runs and three final runs of one frozen authoring task. Leftover hints: minimum %s to %s on the baseline side, minimum %s to %s on the final side. The final lowest count is %s the baseline lowest.\n\n' "$L_B_MIN" "$L_B_MAX" "$L_F_MIN" "$L_F_MAX" "$( [ "$VERDICT" = PASS ] && echo below || echo not below )"
    printf '## 2. AGGREGATE RESULTS\n\n'
    echo '| Metric | Baseline min | Baseline max | Baseline mean | Final min | Final max | Final mean | Delta of means |'
    echo '|--------|--------------|--------------|---------------|-----------|-----------|------------|----------------|'
    jq -r 'def one: (.*10 | round) / 10; .metrics[] | "| \(.metric) | \(.baseline.min) | \(.baseline.max) | \(.baseline.mean | one) | \(.final.min) | \(.final.max) | \(.final.mean | one) | \(.delta_mean | one) |"' "$DELTA"
    printf '\n## 3. METHODOLOGY\n\n'
    cat <<'MD' | sed 's/^  //'
  Fixture: one Level 2 packet for a `--quiet` flag on `recommend-level.sh`. The task text is frozen and copied from the phase 1 baseline with no word changed. Each side is three serial runs by `llmgateway/deepseek-v4.1-flash-1017#max`. The measured documents are `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md`. The throwaway track is deleted after each measurement.

  ## 4. PER-CANDIDATE PROFILES

  | Side | Tree | What the worker saw |
  |---|---|---|
  | baseline | Before the packet changes | v2.2 templates, bare bracketed hints, the hand-written examples |
  | final | After phases 1 to 8 | v2.3 value tokens, section fill guidance, the authoring card, the guards |

  ## 5. PROCESS NOTES

  The baseline side is the phase 1 measurement and was not rerun. The final side ran after every phase closed, so the worker saw the tree the packet ships. A run that left its track behind was restored before the next dispatch.

  ## 6. FINDINGS

  The load-bearing number is the lowest leftover hint count on each side. A lower final minimum means at least one worker filled more of the packet with no hint left. The range matters as much as the minimum: a wide final range means the templates help some runs and not others.

  ## 7. CAVEATS

  Three runs per side cannot support a significance claim. The fixture is one small feature and four documents. The model is one model at one effort. A template change and a card change landed together, so this report cannot separate their effects.

  ## 8. RECOMMENDATIONS

  - **Apply now.** Keep the v2.3 token gate and the card. Both are measured on the same task.
  - **Validate first.** Rerun this report after the next template change with a new date and the same variant.
  - **Future.** Add a second feature shape if a future packet needs to know whether the gain holds outside one small feature.

  ## 9. REPRODUCIBILITY

MD
    printf '%s\n' '```bash' \
      'bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --skip-branch --level 2 --track zz-bench-hints --short-name recommend-level-quiet-flag "Add a quiet flag to recommend-level.sh"' \
      'rg -o --no-filename "\[YOUR_VALUE_HERE: [^]]*\]" specs/zz-bench-hints/001-recommend-level-quiet-flag/*.md | sort -u > hints.txt' \
      '```'
    printf '\nThe three final runs take 1 to 2 hours. The metric commands are in `tasks.md` T006. The raw run logs stay in the source packet named in `source.md`.\n\n'
    printf '## 10. CROSS-LINKS\n\n'
    printf -- '- Source packet: `specs/system-speckit/054-weak-model-spec-authoring`\n'
    printf -- '- Baseline measurement: `specs/system-speckit/054-weak-model-spec-authoring/001-template-drift-census-and-baseline/scratch/baseline/baseline.json`\n'
    printf -- '- Delta: `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/baseline/delta.json`\n'
  } > "$REPORT/README.md"
  {
    printf '# system-spec-kit Benchmark Sources\n\n'
    printf '> system-spec-kit · model-eval · authoring-baseline\n\n---\n\n'
    printf '## 1. OVERVIEW\n\n'
    printf 'This map names where the raw evidence behind this folder lives. The folder holds curated outputs only.\n\n'
    printf '| Resource | Purpose |\n|---|---|\n'
    printf '| Target skill | `.skilled/skills/system-spec-kit` |\n'
    printf '| Source packet | `specs/system-speckit/054-weak-model-spec-authoring` |\n'
    printf '| Baseline runs | `specs/system-speckit/054-weak-model-spec-authoring/001-template-drift-census-and-baseline/scratch/baseline/baseline.json` |\n'
    printf '| Final runs | `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/baseline/baseline.json` |\n'
    printf '| Metric commands | `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/tasks.md` T006 |\n'
    printf '| Delta | `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/baseline/delta.json` |\n'
    printf '| Run briefs | `specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/briefs/T005-*.txt` |\n'
    printf '| Model | `llmgateway/deepseek-v4.1-flash-1017#max` |\n\n'
    printf '## 2. BOUNDARY\n\n'
    printf 'The corpus is an input and is never rewritten by a run. This folder holds outputs only, and a run whose result changes gets a new folder rather than overwriting this one.\n\n'
    printf 'Last updated %s.\n' "$DATE"
  } > "$REPORT/source.md"
  ROW="| $DATE | [\`$NAME/\`](./$NAME/) | DeepSeek V4.1 Flash max, frozen authoring task | 3 baseline and 3 final runs, 5 metrics | **$VERDICT** | \`054-weak-model-spec-authoring\` |"
  ROW="$ROW" perl -pi -e 'if (/^## 2\. RUN INDEX/) { $in = 1 } if ($in && /^\|---\|/ && !$done) { $_ .= "$ENV{ROW}\n"; $done = 1 }' "$S/benchmark/reports/README.md"
  echo INDEX_ROW_ADDED
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py "$REPORT/README.md" | tail -2
  ```

- [ ] T009 Write the global changelog and bump the version carrier (`.skilled/changelog/system-spec-kit/v2.9.0.0.md`, `$S/SKILL.md`). Read `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` and `.skilled/skills/system-spec-kit/references/workflows/nested-changelog.md` first, and read two existing entries under `.skilled/changelog/system-spec-kit/` to copy their compact format. Confirm `$S/SKILL.md` still reads `version: 2.8.5.0`. When it reads a higher version, bump its minor segment and name the entry `v<that version>.md`, and record the actual path in `goal.md` section 4. Write the file with the block below, then run the three checks. The block is indented two spaces so it sits inside this list. Remove those two spaces, so the first line `---` starts in column 0. Verify: `head -1 .skilled/changelog/system-spec-kit/v2.9.0.0.md` prints `---`, `rg -c '^version: 2.9.0.0$' $S/SKILL.md` prints `1`, `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/changelog/system-spec-kit/v2.9.0.0.md` prints `Total issues: 0`, and `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/changelog/system-spec-kit/v2.9.0.0.md` prints `hard blockers: 0`.

  ```markdown
  ---
  title: "system-spec-kit v2.9.0.0, templates a weak model can follow"
  description: "New packets ship every hint in the five core templates as a value token, the validator gates an unfilled token after Draft, each core section says how to fill it, and a short authoring card replaces the long guide as the first read."
  trigger_phrases:
    - "system-spec-kit v2.9.0.0"
    - "system-spec-kit 2.9.0.0"
    - "value token gate"
    - "spec authoring card"
  importance_tier: "normal"
  contextType: "general"
  version: 2.9.0.0
  ---

  # v2.9.0.0, Templates a Weak Model Can Follow

  A weak model can now see what a template still needs, because every hint in the five core templates is a value token that fails validation once the packet leaves Draft. The four authoring intents also load a short card rather than the long guide, and the examples no longer teach the defects the old text carried.

  > Spec folder: `specs/system-speckit/054-weak-model-spec-authoring` (Level 2)

  &nbsp;

  ## What's New at a Glance

  - **An unfilled hint can no longer pass as finished.** A doc stamped v2.3 warns while the spec is Draft and fails strict validation at any other status.
  - **Every core section says how to fill it.** Each section carries a short instruction and a good and weak example.
  - **Authoring starts on one page.** The router loads a short card for the four authoring intents.
  - **The examples stop teaching the old defects.** Their descriptions, stale checklist lines and anchors now match the templates.
  - **Commands and agents name the new gate and the card.** A speckit or doctor run describes the same authoring path a worker follows.
  - **The playbook and catalog cover the new behavior.** A focused run report records each scenario result.
  - **The result is measured, not asserted.** Three runs of one frozen authoring task on each side give a range for five metrics.

  &nbsp;

  ## Upgrade

  No migration required. Existing packets keep their verdict, because the token gate applies only to docs stamped v2.3. Scaffold a new packet to get the new templates and the authoring card.
  ```

  ```bash
  cd "$WORKTREE"
  perl -pi -e 's/^version: 2\.8\.5\.0$/version: 2.9.0.0/' $S/SKILL.md
  rg -c '^version: 2\.9\.0\.0$' $S/SKILL.md
  ```

- [ ] T010 Close this phase's own documents (`spec.md`, `acceptance-criteria.md`, `goal.md`, `implementation-summary.md`). Set `spec.md` Status to `Complete` and the `**Status:**` line in `acceptance-criteria.md` to `**Status:** Complete`. Replace every `| Unmet | - |` cell in `acceptance-criteria.md` with `| Met | - |`. Set `**Closeable:** No` to `**Closeable:** Yes` and replace the sentence under it with one sentence naming the seven parent proofs and the fifteen acceptance rows. Replace the planned `implementation-summary.md` with the block below, removing the two-space list indent so the first line `---` starts in column 0, then substitute the four `__` tokens with `perl -pi -e` from `delta.json`. Verify: `head -1 "$PHASE/implementation-summary.md"` prints `---`, `rg -c '\| Met \| - \|' "$PHASE/acceptance-criteria.md"` prints `15`, `rg -c '\| Unmet \| - \|' "$PHASE/acceptance-criteria.md"` prints `0`, `rg -c '^\*\*Closeable:\*\* Yes$' "$PHASE/acceptance-criteria.md"` prints `1`, `rg -c '^\*\*Status:\*\* Complete$' "$PHASE/acceptance-criteria.md"` prints `1`, and `rg -c '^__' "$PHASE/implementation-summary.md"` prints `0`.

  ```markdown
  ---
  title: "Implementation Summary"
  description: "Phase 9 closed the packet: three final runs of the frozen authoring task measured the before and after for five metrics, and every generated artifact was reconciled before the operator handoff."
  trigger_phrases:
    - "authoring benchmark and closeout implementation summary"
  importance_tier: "normal"
  contextType: "general"
  _memory:
    continuity:
      packet_pointer: "system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout"
      last_updated_at: "__DATE__T00:00:00Z"
      last_updated_by: "conductor"
      recent_action: "Closed the phase and wrote the operator handoff"
      next_safe_action: "Operator commits and pushes the packet"
      blockers: []
      key_files:
        - "specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/baseline/delta.json"
      session_dedup:
        fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
        session_id: "054-weak-model-spec-authoring-closeout"
        parent_session_id: null
      completion_pct: 100
      open_questions: []
      answered_questions: []
  ---
  <!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
  # Implementation Summary

  <!-- SPECKIT_LEVEL: 3 -->
  <!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

  ---

  <!-- ANCHOR:metadata -->
  ## Metadata

  | Field | Value |
  |-------|-------|
  | **Spec Folder** | 009-authoring-benchmark-and-closeout |
  | **Status** | Complete |
  | **Completed** | __DATE__ |
  | **Level** | 3 |
  <!-- /ANCHOR:metadata -->

  ---

  <!-- ANCHOR:what-built -->
  ## What Was Built

  The packet now ends with a measured before and after rather than a claim. Three final runs of the frozen authoring task are recorded beside the phase 1 baseline, and the report folds both sides into one range per metric. The final lowest `leftover_hints` is __L_F_MIN__ against __L_B_MIN__ on the baseline side. The run log is `scratch/baseline/runs.jsonl` and the delta is `scratch/baseline/delta.json`.

  ### Phase 9: authoring-benchmark-and-closeout

  The closeout also published the benchmark report, wrote the global and nested changelogs, regenerated the trigger index, refreshed the track roots and reconciled the parent phase map, the parent goal log and the 041 phase map. Each of the seven parent criteria carries one PASS line in `scratch/closeout/criteria.txt`.

  ### Files Changed

  | File | Action | Purpose |
  |------|--------|---------|
  | `.skilled/skills/system-spec-kit/benchmark/reports/__REPORT_NAME__/` | Created | Report, results and source map |
  | `.skilled/skills/system-spec-kit/benchmark/reports/README.md` | Modified | One run index row |
  | `.skilled/changelog/system-spec-kit/v2.9.0.0.md` | Created | Global changelog entry |
  | `specs/system-speckit/054-weak-model-spec-authoring/changelog/` | Created | Root and phase nested changelogs |
  | `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and three sidecars | Modified | Regenerated index |
  | `specs/system-speckit/graph-metadata.json` | Modified | Refreshed track children |
  | `specs/system-speckit/054-weak-model-spec-authoring/spec.md` and `goal.md` | Modified | Status, map and log |
  | `specs/system-speckit/041-write-recipe-fixes/spec.md` | Modified | One map row |
  <!-- /ANCHOR:what-built -->

  ---

  <!-- ANCHOR:how-delivered -->
  ## How It Was Delivered

  The conductor dispatched three serial Task subagents that inherited the DeepSeek V4.1 Flash max session model, measured each run with the five commands in `tasks.md` T006, wrote every number from `delta.json`, and proved each parent criterion before ticking its box. One read-only frontier review read the closeout diff and each finding was applied or recorded in `goal.md` section 4.

  ### Operator handoff

  - Nothing in this packet was committed. Nothing was pushed.
  - `git status --porcelain` holds every change in the working tree.
  - The commit and the push are the operator's steps. The swarm ran no `git commit` and no `git push`.
  - No generated artifact needs a hand edit before the commit.
  <!-- /ANCHOR:how-delivered -->

  ---

  <!-- ANCHOR:decisions -->
  ## Key Decisions

  | Decision | Why |
  |----------|-----|
  | Count bare hints plus value tokens for M2 | The two patterns are disjoint, so each unfilled instruction counts once on both sides |
  | Name the report `model-eval--authoring-baseline` | The run measures a model on the authoring task, and the feature name lets a later model reuse it |
  | Prove parent criterion 3 on the frozen folder list | A live walk would compare different populations |
  <!-- /ANCHOR:decisions -->

  ---

  <!-- ANCHOR:verification -->
  ## Verification

  | Check | Result |
  |-------|--------|
  | Recursive strict validation on the packet | `RESULT: PASSED` |
  | Strict validation on this phase folder | `RESULT: PASSED` |
  | `check-goal.cjs` on the parent and nine children | `RESULT: PASSED (5/5 checks)` ten times |
  | Trigger index check | exit 0 |
  | Track root dry run | `system-speckit: up to date`, exit 0 |
  | Report rows | 6 |
  | Seven parent criteria | 7 PASS lines |
  | Benchmark report markdown | `Total issues: 0` |
  <!-- /ANCHOR:verification -->

  ---

  <!-- ANCHOR:limitations -->
  ## Known Limitations

  1. **Three runs per side cannot support a significance claim.** The report gives a range and says so.
  2. **The fixture is one small feature and four documents.** A different feature shape or a Level 1 packet is not measured.
  3. **The template gate and the authoring card landed together.** This report cannot separate their effects.
  <!-- /ANCHOR:limitations -->

  ---
  ```

  ```bash
  cd "$WORKTREE"
  DATE=$(date +%F)
  REPORT_NAME="$DATE--model-eval--authoring-baseline"
  L_B_MIN=$(jq -r '.metrics[] | select(.metric=="leftover_hints") | .baseline.min' "$SC/baseline/delta.json")
  L_F_MIN=$(jq -r '.metrics[] | select(.metric=="leftover_hints") | .final.min' "$SC/baseline/delta.json")
  perl -pi -e 's/\| Unmet \| - \|/| Met | - |/g' "$PHASE/acceptance-criteria.md"
  perl -pi -e 's/^\*\*Closeable:\*\* No$/**Closeable:** Yes/' "$PHASE/acceptance-criteria.md"
  perl -pi -e 's/^\*\*Status:\*\* Draft$/**Status:** Complete/' "$PHASE/acceptance-criteria.md"
  perl -0pi -e 's/The phase has not started\. This statement is rewritten when the phase closes\./The packet closed on the seven parent proofs in `scratch\/closeout\/criteria.txt` and the fifteen acceptance rows in this file./' "$PHASE/acceptance-criteria.md"
  perl -pi -e "s/__DATE__/$DATE/g; s/__L_B_MIN__/$L_B_MIN/g; s/__L_F_MIN__/$L_F_MIN/g; s/__REPORT_NAME__/$REPORT_NAME/g" "$PHASE/implementation-summary.md"
  perl -pi -e 's/\| \*\*Status\*\* \| Draft \|/| **Status** | Complete |/' "$PHASE/spec.md"
  ```

- [ ] T011 Write the two nested changelogs (`$PKT/changelog/`). Read `.skilled/skills/system-spec-kit/references/workflows/nested-changelog.md` and `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` before the first run. Run the generator twice, once for the packet root and once for this phase. Verify: `test -s "$PKT/changelog/changelog-054-root.md" && test -s "$PKT/changelog/changelog-054-009-authoring-benchmark-and-closeout.md" && echo NESTED_FILES_OK` prints `NESTED_FILES_OK`, and the two `validate_document.py` commands in the block print `Total issues: 0`. When a file already exists, rerun the generator, which regenerates it in place, and record that in `goal.md` section 4.

  ```bash
  cd "$WORKTREE"
  node $S/runtime/cli/dist/spec-folder/nested-changelog.js "$PKT" --write
  node $S/runtime/cli/dist/spec-folder/nested-changelog.js "$PHASE" --write
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py "$PKT/changelog/changelog-054-root.md" | tail -2
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py "$PKT/changelog/changelog-054-009-authoring-benchmark-and-closeout.md" | tail -2
  ```

- [ ] T012 Regenerate the trigger index and prove only its four artifacts changed (`$S/runtime/data/trigger-index.json`, `$S/runtime/cli/retrieval/fixtures/`). Run the block below. Verify: the check line prints `check exit=0`, and the `wc -l` line prints `0`, which means the generator added no changed path under `$S/runtime` beyond the four index artifacts.

  ```bash
  cd "$WORKTREE"
  git status --porcelain -- "$S/runtime" > "$SC/index/before.txt"
  node $S/runtime/cli/retrieval/generate-trigger-index.mjs
  node $S/runtime/cli/retrieval/generate-trigger-index.mjs --check; echo "check exit=$?"
  git status --porcelain -- "$S/runtime" > "$SC/index/after.txt"
  diff "$SC/index/before.txt" "$SC/index/after.txt" | grep '^>' | grep -vE 'trigger-index|corpus-manifest|generation-diagnostics|phrase-variants' | wc -l | tr -d ' '
  cat "$SC/index/after.txt"
  ```

- [ ] T013 Refresh the track roots (`specs/system-speckit/graph-metadata.json`). Run `node $S/runtime/cli/spec/refresh-track-roots.mjs --help` first. It prints `unknown argument: --help` and exits 2, so the usage in the file header is the authority: `--specs <dir> --track <name> [--apply]`. Then run the block below. Verify: the first run prints `system-speckit:` with a change or `up to date`, the second run prints `system-speckit: up to date`, its exit is `0`, and the `cmp` line prints `CHILDREN_MATCH` when the stored ids equal the numbered folders on disk.

  ```bash
  cd "$WORKTREE"
  node $S/runtime/cli/spec/refresh-track-roots.mjs --specs specs --track system-speckit --apply; echo "apply exit=$?"
  node $S/runtime/cli/spec/refresh-track-roots.mjs --specs specs --track system-speckit; echo "dry exit=$?"
  jq -r '.children_ids[]' specs/system-speckit/graph-metadata.json | sort > "$SC/index/children-json.txt"
  ls -d specs/system-speckit/[0-9][0-9][0-9]-* | sed 's#specs/system-speckit/##' | sort > "$SC/index/children-disk.txt"
  cmp "$SC/index/children-json.txt" "$SC/index/children-disk.txt" && echo CHILDREN_MATCH
  ```

- [ ] T014 Reconcile the parent maps and the parent goal log (`../spec.md`, `../goal.md`, `specs/system-speckit/041-write-recipe-fixes/spec.md`). Run the block below. It changes only the nine `Pending` rows inside the parent phase map, the parent spec Status row, the 041 row that names `006-fix-write-recipe-move-destination`, and the `last_updated_at` and `last_updated_by` fields of the six continuity blocks. Then update the parent goal progress rows with the list after the block, matching each existing row exactly and appending the new rows after the `BASE_REF` row so no row is duplicated. Verify: `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs "$PKT"` prints `RESULT: PASSED (5/5 checks)`, the loop over the nine children prints nine `RESULT: PASSED (5/5 checks)` lines, `sed -n '/ANCHOR:phase-map/,/\/ANCHOR:phase-map/p' "$PKT/spec.md" | rg -c '\| Complete \|$'` prints `9`, the same range prints `0` for `Pending`, `rg -c '006-fix-write-recipe-move-destination.*Complete' specs/system-speckit/041-write-recipe-fixes/spec.md` prints `1`.

  ```bash
  cd "$WORKTREE"
  perl -0pi -e 's{(<!-- ANCHOR:phase-map -->)(.*?)(<!-- /ANCHOR:phase-map -->)}{my ($a,$b,$c)=($1,$2,$3); $b =~ s/\| Pending \|/| Complete |/g; "$a$b$c"}se' "$PKT/spec.md"
  perl -pi -e 's/^\| \*\*Status\*\* \| Draft \|$/| **Status** | Complete |/' "$PKT/spec.md"
  perl -pi -e 's/^\| \*\*Status\*\* \| Draft \|$/| **Status** | Complete |/' "$PHASE/spec.md"
  perl -pi -e 's/\| Draft \|$/| Complete |/ if /006-fix-write-recipe-move-destination/' specs/system-speckit/041-write-recipe-fixes/spec.md
  NOW=$(date -u +%FT%TZ)
  for f in "$PKT/goal.md" "$PKT/spec.md" "$PHASE/goal.md" "$PHASE/spec.md" "$PHASE/acceptance-criteria.md" "$PHASE/implementation-summary.md"; do
    perl -pi -e "s/^    last_updated_at: .*/    last_updated_at: \"$NOW\"/; s/^    last_updated_by: .*/    last_updated_by: \"conductor\"/" "$f"
  done
  echo MAPS_RECONCILED
  for d in "$PKT"/0??-*/; do node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs "$d" | tail -1; done
  node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs "$PKT" | tail -1
  node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder "$PHASE" --apply
  node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder "$PKT" --apply
  node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/system-speckit/041-write-recipe-fixes --apply
  ```

  Update these five existing rows in the progress table in `../goal.md` section 4. Match the exact row text quoted here, replace only the `Pending` state and the empty evidence cell, and never append a duplicate:
  - "| Launch precondition 1: workspace chosen (A worktree or B branch) | Pending | |" becomes "| Launch precondition 1: workspace chosen (A worktree or B branch) | Done | <WORKTREE> |".
  - "| Launch precondition 2: `opencode.json` names `llmgateway/deepseek-v4.1-flash-1017` and OpenCode v2 is logged in to llmgateway | Pending | |" becomes "| Launch precondition 2: `opencode.json` names `llmgateway/deepseek-v4.1-flash-1017` and OpenCode v2 is logged in to llmgateway | Done | <the line count from T001> |".
  - "| Launch precondition 4: conductor is an OpenCode v2 session with the goal bound | Pending | |" becomes "| Launch precondition 4: conductor is an OpenCode v2 session with the goal bound | Done | interactive OpenCode v2 session, goal bound |".
  - "| WORKTREE path | Pending | |" becomes "| WORKTREE path | Done | <WORKTREE> |".
  - "| Start commit | Pending | |" becomes "| Start commit | Done | <the hash from T003> |".

  Append these five rows immediately after the row that starts "| BASE_REF |", which keeps its `Pending` state, so each one is added once and no existing row is duplicated:
  - "| Final baseline | Done | 3 runs, baseline.json holds 5 metrics per run |"
  - "| Benchmark report | Done | <the report folder path> |"
  - "| Trigger index | Done | check exit=0 |"
  - "| Track roots | Done | system-speckit: up to date |"
  - "| Changelogs | Done | <the global path and the two nested paths> |"
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Prove each of the seven criteria in `../goal.md` section 3 (`scratch/closeout/criteria.txt`). Write the script below and run it. Each block prints one line, `C<n> PASS <evidence>` or `C<n> FAIL <reason>`. Verify: `grep -c '^C[1-7] PASS ' "$SC/closeout/criteria.txt"` prints `7` and `rg -c '^\| Parent criteria \| Done \| 7 PASS lines' "$PKT/goal.md"` prints `1`. When a line reads FAIL, write it in `goal.md` section 4, leave the matching parent box unticked in T017 and do not claim the packet is closeable.

  ```bash
  cd "$WORKTREE"
  C="$SC/closeout/criteria.txt"
  : > "$C"

  # C1: recursive strict on the packet.
  OUT=$(bash $S/runtime/cli/spec/validate.sh "$PKT" --recursive --strict 2>&1 | grep 'RESULT:' | tail -1)
  if [ "$OUT" = "RESULT: PASSED" ]; then echo "C1 PASS $OUT" >> "$C"; else echo "C1 FAIL $OUT" >> "$C"; fi

  # C2: the token gate on a fresh v2.3 packet and on an old stamp.
  rm -rf specs/zz-bench-closeout
  bash $S/runtime/cli/spec/create.sh --skip-branch --level 1 --track zz-bench-closeout --short-name gate "Gate" > "$SC/closeout/c2-create.txt" 2>&1
  P=specs/zz-bench-closeout/001-gate
  D=$(bash $S/runtime/cli/spec/validate.sh $P --strict 2>&1 | grep 'RESULT:' | tail -1)
  perl -pi -e 's/\| \*\*Status\*\* \| Draft \|/| **Status** | Complete |/' $P/spec.md
  K=$(env SPECKIT_RULES=PLACEHOLDER_FILLED bash $S/runtime/cli/spec/validate.sh $P --strict 2>&1 | grep -c 'placeholder(s) found')
  perl -pi -e 's/\| \*\*Status\*\* \| Complete \|/| **Status** | Draft |/' $P/spec.md
  perl -pi -e 's/\| v2\.3 -->/| v2.2 -->/' $P/spec.md $P/plan.md $P/tasks.md
  V=$(env SPECKIT_RULES=PLACEHOLDER_FILLED bash $S/runtime/cli/spec/validate.sh $P --strict 2>&1 | grep -c 'placeholder(s) found')
  rm -rf specs/zz-bench-closeout
  if [ "$D" = "RESULT: PASSED" ] && [ "$K" -ge 1 ] && [ "$V" -ge 1 ]; then echo "C2 PASS draft=$D complete_errors=$K v22_errors=$V" >> "$C"; else echo "C2 FAIL draft=$D complete_errors=$K v22_errors=$V" >> "$C"; fi

  # C3: the frozen phase 3 census, rerun on the final tree.
  ORCH="$S/runtime/dist/lib/validation/orchestrator.js"
  for i in 0 1 2; do env -u SPECKIT_RULES node "$P3/scratch/tools/strict-census.mjs" "$ORCH" "$P3/scratch/census/shard-$i.txt" > "$SC/closeout/b-final-$i.tsv" 2> "$SC/closeout/b-final-$i.err" & done
  wait
  cat "$SC/closeout/b-final-"[012].tsv | LC_ALL=C sort > "$SC/closeout/b-final.tsv"
  cut -f1,2,5 "$P3/scratch/census/b-before.tsv" > "$SC/closeout/b-before.cut"
  cut -f1,2,5 "$SC/closeout/b-final.tsv" > "$SC/closeout/b-final.cut"
  DIFFROWS=$(diff "$SC/closeout/b-before.cut" "$SC/closeout/b-final.cut" | grep -c '^[<>]')
  BCOUNT=$(cut -f2 "$P3/scratch/census/b-before.tsv" | sort | uniq -c | tr -s ' ' | tr '\n' ' ')
  FCOUNT=$(cut -f2 "$SC/closeout/b-final.tsv" | sort | uniq -c | tr -s ' ' | tr '\n' ' ')
  if [ "$DIFFROWS" = "0" ]; then echo "C3 PASS CENSUS_SAME gate B before[$BCOUNT] after[$FCOUNT]" >> "$C"; else echo "C3 FAIL diff_rows=$DIFFROWS before[$BCOUNT] after[$FCOUNT]" >> "$C"; fi

  # C4: the two guards.
  AOUT=$(bash $S/runtime/cli/spec/check-example-drift.sh 2>&1); AR=$?
  A=$(printf '%s\n' "$AOUT" | tail -1)
  BOUT=$(bash $S/runtime/cli/spec/check-card-sync.sh 2>&1); BR=$?
  B=$(printf '%s\n' "$BOUT" | tail -1)
  if [ "$A" = "EXAMPLE_DRIFT_OK" ] && [ "$B" = "CARD SYNC OK" ] && [ "$AR" = "0" ] && [ "$BR" = "0" ]; then echo "C4 PASS $A $B" >> "$C"; else echo "C4 FAIL $A rc=$AR $B rc=$BR" >> "$C"; fi

  # C5: the report covers five metrics on two sides of three runs, and the lowest hint count fell.
  N=$(jq '.metrics | length' "$SC/baseline/delta.json")
  BRUNS=$(jq '.runs | length' "$P1/scratch/baseline/baseline.json")
  FRUNS=$(jq '.runs | length' "$SC/baseline/baseline.json")
  LOW=$(jq -r '([.metrics[] | select(.metric=="leftover_hints")][0]) | "\(.baseline.min) -> \(.final.min)"' "$SC/baseline/delta.json")
  OK=$(jq -r 'if ([.metrics[] | select(.metric=="leftover_hints")][0].final.min < [.metrics[] | select(.metric=="leftover_hints")][0].baseline.min) then "yes" else "no" end' "$SC/baseline/delta.json")
  if [ "$N" = "5" ] && [ "$BRUNS" = "3" ] && [ "$FRUNS" = "3" ] && [ "$OK" = "yes" ]; then echo "C5 PASS metrics=$N runs=$BRUNS+$FRUNS leftover_min=$LOW" >> "$C"; else echo "C5 FAIL metrics=$N runs=$BRUNS+$FRUNS leftover_min=$LOW" >> "$C"; fi

  # C6: every playbook scenario this packet added has a PASS or an escalated FAIL.
  REPORTS="$S/benchmark/reports"
  REPORT=$(for d in "$REPORTS"/*--manual-testing-playbook--*/; do test -s "$d/source.md" && rg -q '054-weak-model-spec-authoring' "$d/source.md" && echo "$d"; done | sort | tail -1)
  ADDED=$({ git diff --name-only "$START" -- "$S/manual-testing-playbook/"; git ls-files --others --exclude-standard -- "$S/manual-testing-playbook/"; } | sort -u | rg '\.md$' | rg -v 'manual-testing-playbook\.md$')
  MISS=0; LINES=""
  if [ -z "$REPORT" ]; then echo "C6 FAIL MISSING-008-REPORT" >> "$C"; elif [ -z "$ADDED" ]; then echo "C6 FAIL NO_SCENARIO_FILES" >> "$C"; else
    for f in $ADDED; do
      SLUG=$(basename "$(dirname "$f")")-$(basename "$f" .md)
      NUM=$(rg -m1 -o '^title: "([0-9]+)' -r '$1' "$f")
      V=$(awk -F, -v id="$SLUG" -v num="$NUM" 'NR==1{for(i=1;i<=NF;i++){if($i=="scenario_id")s=i; if($i=="verdict")v=i}; next} ($s==id || $s==num){print $v}' "$REPORT/results.csv" | head -1)
      if [ "$V" != "PASS" ]; then
        if rg -q 'FAIL' "$PKT/008-playbook-run-in-worktree/goal.md" && { rg -q --fixed-strings "$SLUG" "$PKT/008-playbook-run-in-worktree/goal.md" || rg -q --fixed-strings "$NUM" "$PKT/008-playbook-run-in-worktree/goal.md"; }; then V="FAIL-LOGGED"; else MISS=$((MISS+1)); fi
      fi
      LINES="$LINES $SLUG=$V"
    done
    if [ "$MISS" = "0" ]; then echo "C6 PASS$LINES" >> "$C"; else echo "C6 FAIL missing=$MISS$LINES" >> "$C"; fi
  fi

  # C7: swarm commits stay local and nothing is pushed.
  HEAD=$(git rev-parse HEAD)
  COUNT=$(git log --oneline "$START..HEAD" | wc -l | tr -d ' ')
  REMOTE=$(git branch -r --contains HEAD | wc -l | tr -d ' ')
  if [ "$COUNT" = "0" ] || [ "$REMOTE" = "0" ]; then echo "C7 PASS head=$HEAD commits_since_start=$COUNT remote_branches_with_head=$REMOTE" >> "$C"; else echo "C7 FAIL head=$HEAD start=$START commits_since_start=$COUNT remote_branches_with_head=$REMOTE" >> "$C"; fi

  cat "$C"
  PASSES=$(grep -c '^C[1-7] PASS ' "$C")
  N="$PASSES" perl -0pi -e 's{^(\| BASE_REF \|.*\n)}{$1 . "| Parent criteria | Done | $ENV{N} PASS lines in scratch/closeout/criteria.txt |\n"}me unless /\| Parent criteria \|/' "$PKT/goal.md"
  echo "CRITERIA_LOGGED passes=$PASSES"
  ```

- [ ] T016 Frontier review of the closeout diff (`scratch/review/T016.txt`). Read `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` first. Save the block below as `$SC/review/T016-brief.txt`, then run the command. Verify: the file exists, the format check below prints `T016_FORMAT ... bad=0` with exactly one of `findings` or `no_findings` non-zero. Apply each finding or record it in `goal.md` section 4 as `T016-APPLIED <finding>` or `T016-RECORDED <finding> <reason>`, and check `test "$(grep -cE '^(P0|P1|P2) ' "$SC/review/T016.txt")" -eq "$(grep -cE '^T016-(APPLIED|RECORDED) ' "$PHASE/goal.md")" && echo T016_COUNTS_MATCH` prints `T016_COUNTS_MATCH`.

  ```bash
  mkdir -p "$PHASE/scratch/review"
  codex -a never exec \
    --model gpt-6-luna \
    -c model_reasoning_effort="max" \
    -c service_tier="fast" \
    --sandbox read-only \
    -o "$PHASE/scratch/review/T016.txt" \
    "$(cat "$PHASE/scratch/review/T016-brief.txt")" </dev/null
  ```

  Format check, run after the reviewer exits:

  ```bash
  awk '/^(P0|P1|P2) /{f++;next} /^NO FINDINGS$/{n++;next} {b++} END{printf "T016_FORMAT findings=%d no_findings=%d bad=%d\n", f, n, b}' "$PHASE/scratch/review/T016.txt"
  ```

  Expected output: `T016_FORMAT findings=<n> no_findings=0 bad=0` where `<n>` equals the P0/P1/P2 line count, or `T016_FORMAT findings=0 no_findings=1 bad=0`.

  ```text
  You are a read-only reviewer. Do not edit, create or delete any file.
  Read the working tree diff against the commit named as Phase start commit in
  specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/goal.md
  section 4.
  Check these claims against the files and the commands:
  (1) every number in the benchmark report folder matches scratch/baseline/delta.json,
  (2) the report folder name follows the date--subject--variant grammar and the ten sections are present,
  (3) the global changelog follows the compact template and claims nothing the packet did not do,
  (4) the two nested changelogs name the right packet and phase,
  (5) the parent phase map, the parent goal log and the 041 phase map row match the observed state,
  (6) each of the seven PASS lines in scratch/closeout/criteria.txt is backed by the command it names.
  Return one line per finding in this form, and nothing else:
  P0|P1|P2 <file>:<line> | <what is wrong> | <the fix>
  Return the single line NO FINDINGS when there are none.
  ```

- [ ] T017 Close the phase and tick the parent goal (this folder, `../goal.md`). Run the block below. It runs strict validation on this folder and on the packet, compares the final status with the start status, and ticks the seven completion boxes only when all seven `C<n>` lines read PASS. When one line reads FAIL it ticks none and writes `PARENT_NOT_TICKED` in `goal.md` section 4. Verify: both validations print `RESULT: PASSED`, `bash $S/runtime/cli/rules/check-placeholders.sh "$PHASE"` prints nothing and exits 0, the parent completion anchor holds seven `[x]` rows and zero `[ ]` rows, this phase's goal holds six `[x]` rows, and the undeclared count line in the block prints `0` for a status delta that lists only paths under this phase folder and the declared paths in `spec.md` section 3.

  ```bash
  cd "$WORKTREE"
  if [ "$(grep -c '^C[1-7] PASS ' "$SC/closeout/criteria.txt")" = "7" ]; then
    perl -0pi -e 's{(<!-- ANCHOR:completion -->)(.*?)(<!-- /ANCHOR:completion -->)}{my ($a,$b,$c)=($1,$2,$3); $b =~ s/^- \[ \] /- [x] /gm; "$a$b$c"}se' "$PKT/goal.md"
    perl -pi -e 's/^    completion_pct: \d+$/    completion_pct: 100/' "$PKT/goal.md"
    perl -0pi -e 's{(<!-- ANCHOR:completion -->)(.*?)(<!-- /ANCHOR:completion -->)}{my ($a,$b,$c)=($1,$2,$3); $b =~ s/^- \[ \] /- [x] /gm; "$a$b$c"}se' "$PHASE/goal.md"
    perl -pi -e 's/^    completion_pct: \d+$/    completion_pct: 100/' "$PHASE/goal.md"
    echo PARENT_TICKED_7
  else
    echo "PARENT_NOT_TICKED passes=$(grep -c '^C[1-7] PASS ' "$SC/closeout/criteria.txt")"
  fi
  node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder "$PHASE" --apply
  node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder "$PKT" --apply
  node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/system-speckit/041-write-recipe-fixes --apply
  bash $S/runtime/cli/spec/validate.sh "$PHASE" --strict 2>&1 | grep 'RESULT:' | tail -1
  bash $S/runtime/cli/spec/validate.sh "$PKT" --recursive --strict 2>&1 | grep 'RESULT:' | tail -1
  bash $S/runtime/cli/rules/check-placeholders.sh "$PHASE"; echo "placeholder exit=$?"
  node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs "$PKT" | tail -1
  git status --porcelain > "$SC/baseline/status-end.txt"
  diff "$SC/baseline/status-start.txt" "$SC/baseline/status-end.txt" | grep '^>' | sed 's/^> //' > "$SC/baseline/status-delta.txt"
  cat "$SC/baseline/status-delta.txt"
  awk '{print $2}' "$SC/baseline/status-delta.txt" | rg -v '^(\.skilled/(skills/system-spec-kit/(benchmark/reports/|SKILL\.md$|runtime/data/trigger-index\.json$|runtime/cli/retrieval/fixtures/(corpus-manifest|generation-diagnostics|phrase-variants)\.json$)|changelog/system-spec-kit/v2\.[0-9]+\.[0-9]+\.[0-9]+\.md$)|specs/system-speckit/(graph-metadata\.json$|041-write-recipe-fixes/spec\.md$|054-weak-model-spec-authoring/(spec\.md$|goal\.md$|changelog/|009-authoring-benchmark-and-closeout/)))' | wc -l | tr -d ' '
  sed -n '/ANCHOR:completion/,/\/ANCHOR:completion/p' "$PKT/goal.md" | grep -c '^- \[x\]'
  sed -n '/ANCHOR:completion/,/\/ANCHOR:completion/p' "$PKT/goal.md" | grep -c '^- \[ \]' || true
  sed -n '/ANCHOR:completion/,/\/ANCHOR:completion/p' "$PHASE/goal.md" | grep -c '^- \[x\]'
  ```
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every acceptance criterion marked `Met` with its evidence
- [ ] Seven parent criteria carry a PASS line and seven parent boxes are ticked
- [ ] Recursive strict on the packet prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, which holds the metric definitions and the ADRs
- **Parent goal**: See `../goal.md` section 3 for the closure gate
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

- [ ] CHK-001 [P0] Phases 1 to 8 and the write-recipe child are closed, shown by T002
- [ ] CHK-002 [P0] `opencode.json` names `llmgateway/deepseek-v4.1-flash-1017`, shown by T001
- [ ] CHK-003 [P1] Every brief is saved under `scratch/briefs/` before dispatch
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The five metric commands are copied from `tasks.md` T006 with no edit
- [ ] CHK-011 [P0] Every number in the report is written from `delta.json`, never by hand
- [ ] CHK-012 [P1] The frozen task block matches phase 1, shown by `TASK_FROZEN`
- [ ] CHK-013 [P1] No script embeds a packet path, phase number or task id in a code comment
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] `baseline.json` holds three runs with five metrics each
- [ ] CHK-021 [P0] The delta holds five metrics with a minimum, a maximum and a mean per side
- [ ] CHK-022 [P1] The report folder holds six result rows and ten sections
- [ ] CHK-023 [P1] A run that failed or timed out is recorded with its error, not replaced
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Every parent criterion has one PASS line or one FAIL line, never neither
- [ ] CHK-FIX-002 [P0] A parent box is ticked only after its PASS line exists
- [ ] CHK-FIX-003 [P0] The 041 map row and the nine parent map rows match the observed state
- [ ] CHK-FIX-004 [P1] The trigger index changed only in its four artifacts
- [ ] CHK-FIX-005 [P1] The track children equal the numbered folders on disk
- [ ] CHK-FIX-006 [P1] The version carrier and the changelog file name agree
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the phase start commit, not a branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No brief contains a credential, token or key
- [ ] CHK-031 [P0] No worker ran with write access outside `specs/zz-bench-authoring/`
- [ ] CHK-032 [P1] Every worker prompt carried the AGENTS.md pre-resolution for the spec-folder question
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` agree on the five metrics
- [ ] CHK-041 [P1] `goal.md` section 4 records the start commit, each run and each blocker
- [ ] CHK-042 [P2] `delta.md` explains each metric in one line
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Working files are under this phase's `scratch/` only
- [ ] CHK-051 [P1] `specs/zz-bench-hints`, `specs/zz-bench-authoring` and `specs/zz-bench-closeout` do not exist at phase close
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

- [ ] CHK-100 [P0] ADR-001 through ADR-006 in `plan.md` are followed by T006 to T015
- [ ] CHK-101 [P1] Every ADR has status Accepted
- [ ] CHK-102 [P1] Each ADR names the alternative it rejected and why
- [ ] CHK-103 [P2] No migration applies to this phase
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Each run returned within 30 minutes or was re-dispatched once (NFR-P01)
- [ ] CHK-111 [P1] Seconds per final run recorded as M5
- [ ] CHK-112 [P2] No load test applies to this phase
- [ ] CHK-113 [P2] The minimum and the maximum of each metric are in `delta.md`
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback in `plan.md` section 7 was not needed, or was run and recorded
- [ ] CHK-121 [P0] Nothing outside the declared scope changed, shown by T017
- [ ] CHK-122 [P1] The operator can commit without editing a generated artifact
- [ ] CHK-123 [P1] `implementation-summary.md` holds the operator handoff list
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
- [ ] CHK-141 [P1] `implementation-summary.md` cites `delta.json` and the report folder
- [ ] CHK-142 [P2] The changelog entry names one path per changed surface
- [ ] CHK-143 [P2] The seven PASS lines name the command that proved each criterion
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Conductor | Runs and verifies every task | Pending | |
| Frontier reviewer | Reads the closeout diff read-only | Pending | |
| Operator | Commits and pushes the packet | Pending | |
<!-- /ANCHOR:sign-off -->
