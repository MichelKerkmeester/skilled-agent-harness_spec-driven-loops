---
title: "Implementation Summary"
description: "Phase 9 ran the benchmark in four final sets and closed the packet: three failed criterion 5, and the fourth, after the fix-completeness note was corrected, passed it."
trigger_phrases:
  - "authoring benchmark and closeout implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout"
    last_updated_at: "2026-10-25T09:10:15Z"
    last_updated_by: "worker"
    recent_action: "Fixed the fix-completeness note, ran a second fresh set, criterion 5 passed and the phase closed"
    next_safe_action: "Operator reviews the local commits and decides about the push"
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
| **Completed** | 2026-10-25 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The packet ends with a measured before and after. Four final sets of three runs were measured, each against a baseline of the same model. The first three sets failed parent criterion 5 and the fourth passed it. **The deciding set is the second fresh set**: cli-devin `deepseek-v4-1-flash-1017-max` in a new disposable worktree, where every run passed strict validation, leftover hints were 0, 1 and 0 against a baseline maximum of 1, counted `missing_anchors` was 0, 0 and 0 against 0, and no run wrote outside its track. The first set, described next, is history: it ran on swe-2-max before any template fix, and its parent criterion 5 was FAIL on the frozen metric, because run 3 left 15 anchors in `tasks.md` where the baseline expects 21, so `missing_anchors` had a final maximum of 6 against 0.

History of the first set. The six anchors run 3 deleted are the optional Level 3 verification sections: `arch-verify`, `perf-verify`, `deploy-ready`, `compliance-verify`, `docs-verify` and `sign-off`. A diagnostic, chosen after the result and not a verdict, scores all six runs against the anchors the contract requires (`template-structure.js contract 3 tasks.md` lists 15 required and these 6 optional), and every run misses none. Three of the deletions went against the template's own fill notes, because the packet records ADR-001 (`plan.md` line 239 of run 3, kept as `scratch/bench-evidence/final-run-3/plan.txt`), states NFR-P01 (`spec.md` line 133 of run 3, kept as `scratch/bench-evidence/final-run-3/spec.txt`) and holds paired documents. The run's reply says "L3+ optional sections dropped (this is Level 3, not 3+)", so it read the `## L3+:` heading prefix as Level 3+ only. Run 3 also took 1822 seconds against 437 and 429, and the cause is unknown. The run log is `scratch/baseline/runs.jsonl`, the extras are in `runs-meta.jsonl` and the delta is `scratch/baseline/delta.json`.

### Third amendment: label fix and second final set

The fill note under each of the six `## L3+:` headings of the `tasks.md` template now opens with 'L3+ means Level 3 and above, so this section stays at Level 3.' The phase 004 plan rows, the golden snapshot and the guards match it, and the full suite passed again with the same counts. The operator ruled out the swe-2 models, so a new DeepSeek baseline of three runs at the packet start commit was taken by a separate agent, and three final runs ran on cli-devin `deepseek-v4-1-flash-1017-max` on the amended tree. Strict validation passed in all three and leftover hints were 0 in all three, but run 1 wrote a `tasks.md` without `deploy-ready`, `compliance-verify` and `sign-off`, so `missing_anchors` has a final maximum of 3 against a baseline maximum of 0 and criterion 5 fails again. Run 2 is contaminated, because its session read the frozen vocabulary files, and it is kept in the numbers and labelled. The first final set stays on record as history, measured on the earlier tree on swe-2-max.

### New anchor rule and fresh runs

The operator then chose "New rule, fresh runs". A rule script, `scratch/tools/justified-anchors.sh`, was committed with its scores on the twelve earlier packets before any fresh run: a frozen anchor missing from a packet counts unless it is an optional Level 3 `tasks.md` anchor whose fill-note condition holds. The first swe-2-max final set scores 0, 0 and 3 under it and the second DeepSeek set scores 0, 0 and 0. Three fresh runs then ran on cli-devin `deepseek-v4-1-flash-1017-max` in a disposable worktree with this packet's folder removed from its working tree. All three passed strict validation with no leftover hints, but run 1 deleted the whole required `fix-completeness` section, so counted `missing_anchors` is 1, 0 and 0 against a baseline maximum of 0 and criterion 5 fails for the third time. Run 3's deleted sections (`deploy-ready`, `compliance-verify`, `sign-off`) are excused by the rule.

### Fix-completeness note fixed and a second fresh set

The cause of the third failure was found and fixed at the source: strict validation does not check that required anchors are present, and the required `fix-completeness` fill note said 'Delete the rows that do not apply', which the failing run read as permission to delete the section. The note now says to keep the section and delete only rows. The anchor rule and criterion 5 did not change. After the full suite passed again with the same counts, a second fresh set ran on cli-devin `deepseek-v4-1-flash-1017-max` in a new disposable worktree with this packet's folder removed. All three runs passed strict validation, leftover hints were 0, 1 and 0 against a baseline maximum of 1, counted `missing_anchors` was 0, 0 and 0 against 0, and nothing was written outside the track. **Criterion 5 passes on this fourth final set.** The three earlier sets failed and stay on record, each labelled with its model, tree and rule. The PASS followed a fix made after a failure was understood, so it is not a first-try result, and three runs on one model give a range and not an effect size.

### Phase 9: authoring-benchmark-and-closeout

The closeout also published the benchmark report (the first set's verdict was FAIL, and each later set is a dated update in it), wrote the global changelog `v2.9.0.0` and bumped the version carrier, wrote the nested changelogs for phases 001 to 003 and this phase, regenerated the trigger index, confirmed the track roots and reconciled the parent phase map and goal log. `scratch/closeout/criteria.txt` holds one line for each parent criterion, seven PASS lines in the end, with the earlier C5 FAIL results kept as `C5-history` lines.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/` | Created | Report, results and source map |
| `.skilled/skills/system-spec-kit/benchmark/reports/README.md` | Modified | One run index row |
| `.skilled/changelog/system-spec-kit/v2.9.0.0.md` | Created | Global changelog entry |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modified | Version carrier moved from 2.8.5.0 to 2.9.0.0 |
| `.hermes/skills/system-spec-kit/SKILL.md` | Modified | Mirror of the version carrier, 2.8.5.0 to 2.9.0.0 |
| `specs/system-speckit/054-weak-model-spec-authoring/changelog/` | Created | Nested changelogs for phases 001 to 003 and this phase |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and three sidecars | Modified | Regenerated index |
| `specs/system-speckit/054-weak-model-spec-authoring/spec.md` and `goal.md` | Modified | Executor and commit lines, status, map and log |
| `specs/system-speckit/041-write-recipe-fixes/spec.md` | Modified | One map row |
| `specs/system-speckit/054-weak-model-spec-authoring/graph-metadata.json` | Modified | Derived metadata of the parent packet, regenerated by the repair step |
| `specs/system-speckit/041-write-recipe-fixes/graph-metadata.json` | Modified | Derived metadata of the 041 packet, regenerated by the repair step |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One Claude Code worker ran the phase and spawned no subagent. It ran three serial cli-devin swe-2-max dispatches of the frozen Level 3 brief for the first set and audited each run's Devin session. Every later set ran the same way on cli-devin `deepseek-v4-1-flash-1017-max`. It measured each run with the five commands recorded in `scratch/tools/run-final.sh`, wrote every number in the report from `delta.json` and the run files, and proved each parent criterion before ticking any box. The census for criterion 3 was rerun over the frozen folder list, which excludes this packet. One read-only frontier review on cli-codex gpt-6-luna read the closeout diff, and each finding is recorded in `goal.md` section 4. The operator moved the review from the cli-devin swe-2-max that parent D4 names.

### Operator handoff

- The original close-out made one local commit (14cd9aabcf), and the reconcile and the amendments added local commits after it (fab90dccbd, 23657e227e, e13115c7da and the closing commit of the fresh set). Nothing was pushed.
- Criterion 5 passed on the second fresh set, so the phase and the parent read Complete. Reviewing the local commits and the push are the operator's steps.
- The disposable worktrees `223-deepseek-final` and `224-deepseek-final2` and their branches are left in place for the operator to remove.
- No generated artifact needs a hand edit before review.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the frozen metric and the FAIL, and add a labelled diagnostic | The operator chose "Option 3 + diagnostic". Changing the metric after the result would hide the finding |
| Count bare hints plus value tokens for M2 | The two patterns are disjoint, so each unfilled instruction counts once on both sides |
| Use Level 3 for the final runs | The SWE 2 Max baseline is Level 3 |
| Prove parent criterion 3 on the frozen folder list | A live walk would compare different populations |
| Keep the first final set as history and label the second set as the final one | The sets differ in model and tree, so each is reported with its own baseline |
| Score every earlier set under the new rule before any fresh run | The operator's row claims two scores, and the script had to reproduce them first |
| Keep a contaminated run in the numbers | Dropping it would hide what the session read, and the verdict does not depend on it |
| Mark the phase and the parent Complete only after criterion 5 passed | The validator reads a Complete status with an unmet acceptance row as a failed closure, and every row is now Met |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Recursive strict validation on the packet | `RESULT: PASSED` |
| Strict validation on this phase folder | `RESULT: PASSED` |
| Parent criteria | C1 to C7 PASS (C5 on the second fresh set, after three failed final sets) |
| Census over 4688 folders | 4496 PASS and 192 FAIL before and after, 0 differing rows |
| Report rows | 6 in `results.csv` (first set) and 9 final or baseline rows in `results-amend3.csv` (second set, its baseline and the fresh set) |
| Full suite after the label fix | exit=0, 276 and 184 files passed, 4162 and 2085 tests passed |
| Criterion 3 sample after the label fix | 20 of 20 rows equal the census rows |
| Benchmark report markdown | `Total issues: 0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Criterion 5 failed three times before it passed.** `missing_anchors` had a final maximum of 6, 3 and (counted under the new rule) 1 against 0 on the first three final sets, and the fourth set passed. The result is a range over three runs on one model after a targeted template fix.
2. **The fix was made after the failure.** The `fix-completeness` note was corrected after a run deleted that section, and the next set passed. The report states this plainly, and a larger run count and a second model would be needed to separate a fix from variation.
3. **Three runs per side cannot support a significance claim.** One run produced the whole failure, so the sample cannot separate the template change from run-to-run variation.
4. **The fixture is one small feature and four documents.** A different feature shape or a Level 1 packet is not measured.
5. **Acceptance rows were Unmet until criterion 5 passed.** AC-010, AC-011 and AC-015 needed nine Complete map rows, seven PASS lines and a Complete status, and they are Met now.
6. **The validator does not enforce required anchors.** Strict validation checks the form of anchors and not that each required `tasks.md` anchor is present, so a packet without the required `fix-completeness` section passed. The template note was corrected to say to keep the section, and the validator rule is an open follow-up that is not fixed here.
<!-- /ANCHOR:limitations -->

---
