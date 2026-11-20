---
title: "Implementation Summary"
description: "The transcript scorer now sorts every recorded behaviour run by the workflow it loaded before acting and reports a per-runtime load rate, the first number in this packet that measures the core need rather than delivery. The final arm loaded a real workflow on 6 of 16 owned rows on Claude and 15 of 16 on devin."
trigger_phrases:
  - "workflow outcome measure implementation summary"
  - "workflow load rate per runtime"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/019-workflow-outcome-measure"
    last_updated_at: "2026-11-14T08:30:00Z"
    last_updated_by: "claude"
    recent_action: "Closed the phase with every criterion met"
    next_safe_action: "Build phase 020"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs"
      - ".skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts"
    session_dedup:
      fingerprint: "sha256:a5aef06f2c01a15a99f748e81c3b685f81f0f3696ca32281c32bdea24cb8ef9b"
      session_id: "902263b7-69bf-49b1-b7a2-3a705ce392a2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-workflow-outcome-measure |
| **Status** | Complete |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The packet can now say how often a model loaded a real workflow before it acted, not only how often a command was offered. On the stored final arm a real workflow was loaded on 15 of 16 owned rows on devin and 6 of 16 on Claude, so the outcome differs far more between runtimes than the delivery counts suggested.

### Phase 19: workflow-outcome-measure

Each recorded run is sorted into one path. `command` means it read the command's own document or the host expanded the command before its first write. `skill` means it loaded the owning skill's `SKILL.md` or `ROUTER.md`, through the skill tool or through a hub `compiled-route.cjs` call before its first write. `improvised` means it wrote without loading either, `none` means it loaded nothing and wrote nothing, and `noOwner` means the row expects no command. Under decision D7 the command path and the skill path count the same, so a model keeps its free choice and only skipping the workflow lowers the number.

The headline reading is `loadRate`, the runs that loaded a workflow out of every owned run the arm scored. It was added after two independent reviews found that the planned `share`, which counts only runs that wrote, drops a run that worked the task without loading a workflow and wrote nothing. `share` stays as the secondary reading. `noneActed` counts the `none` runs that read files, ran shell steps or loaded another skill, leaving out the gate lookups and rule reads every session runs.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | Modified | `workflowPath`, the owner table read, the per-arm `workflow` block with `loadRate`, `share` and `noneActed`, and its text line |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | Modified | 21 new cases: 16 for `workflowPath`, 5 for the summary block |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | Modified | The scorer row names the `workflow` block, `loadRate` and `noneActed`, and says a load is not every step followed |
| `scratch/workflow-pre.json`, `scratch/workflow-final.json` | Created | The before arm and the final arm scored by the committed scorer |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The start commit `BASE` is `23e7eee17b`. Both arms were captured with the unchanged scorer first. The OpenCode database needed no override (`OPENCODE_DB unset`), every runtime scored 24 of 24 in both arms except dsh in the final arm at 23 of 24 with one `locator_unavailable`, and the devin reader keeps every tool argument (532 of 532 and 356 of 356 events), so the devin rule was not needed. Tests came first: the new cases failed for the named reason, 6, then 14, then 16 failing, before any code. DeepSeek v4.1 flash workers built one task each, and an Opus verifier checked each task before the next started. The coordinator built the three follow-ups that the checks and the reviews raised, T024 to T026, each with failing tests first.

Per runtime, from `WFSHOW` over the two scratch files. A share is the runs that loaded a workflow out of the runs that wrote. A load rate is the runs that loaded a workflow out of every owned run.

| Runtime | Before load rate | Final load rate | Before share | Final share |
|---------|------------------|-----------------|--------------|-------------|
| claude | 4 of 16 | 6 of 16 | 4 of 4 | 6 of 6 |
| codex | 0 of 16 | not run | 0 of 0 | not run |
| devin | 12 of 16 | 15 of 16 | 12 of 12 | 15 of 15 |
| dsh | 10 of 16 | 12 of 15 | 10 of 12 | 12 of 14 |
| opencode | 9 of 16 | 7 of 16 | 9 of 11 | 7 of 10 |
| pi | 3 of 16 | 5 of 16 | 3 of 7 | 5 of 6 |

In the final arm the unloaded runs that were `ask` rows, where waiting without loading is allowed, number 4 of 10 on Claude, 3 of 10 on pi, 2 of 6 on opencode, 1 of 1 on devin and 0 of 1 on dsh.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `loadRate` is the headline and `share` the secondary reading (T025, spec Q10) | The share left out every owned run that wrote nothing, so Claude read 6 of 6 while it loaded a workflow on 6 of 16 owned rows. Both independent reviews found this. Taken without the operator under D1 |
| Gate lookups and rule reads do not count as acting, and another skill's load does (T026) | Every Claude session runs the Gate 1 lookup first, so at least two runs that did no task work counted as acting. Taken without the operator under D1 |
| A redirected `compiled-route.cjs` call counts as a hub load when it is the first write, and `--hub` must start a word (T024) | Q6 meant a redirected hub dispatch to count, and under the strict position rule it never could. No stored run moved |
| The devin rule was not applied (T013) | T003 found every devin tool event keeps its path or command |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Scorer test file (`VX`) | PASS, `Tests  82 passed (82)` |
| Full advisor suite (`VALL`) | PASS, `Test Files  184 passed (184)`, `Tests  1838 passed | 6 skipped (1844)`, 21 more than the 1817 at `BASE` |
| `npm run typecheck` | PASS, exit 0 |
| Quality gate over the scorer and its tests | PASS, exit 0, `p0_blocking 0`, `p1_open 0`, `p2_open 0` |
| Old fields unchanged (T018) | PASS, both `diff` runs over `OLDF` printed nothing and exited 0 |
| Counts add up (`SUMOK`) | PASS, `true` for both scratch files |
| Boundaries (T019) | PASS, no reader, corpus, runner, bridge table, `lib` file or `package.json` changed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A load is not every step followed.** The measure shows a workflow was opened before the model acted. A run that opened it and then improvised still counts as loaded.
2. **Only the tuned command rows, one run each.** Each arm holds at most 16 owned runs per runtime on rows whose phrases were tuned, so a difference of one or two runs cannot show "more often". A paired arm on untuned rows with repeats needs an operator decision, because the operator ruled out more behaviour arms on 2026-11-13.
3. **The arms differ in more than the brief.** The commit, the arena state and the runtimes in each arm changed between the before and final runs, and Codex ran only in the before arm.
4. **An `ask` row that waited lowers the load rate.** Waiting without loading is allowed on such a row, so the rate understates those runtimes. The counts above say how many unloaded runs were `ask` rows.
5. **A load of a skill other than the owner counts as improvised.** A run that loaded `system-spec-kit` for its gates on a `sk-doc` row is not counted as following the owner's workflow.
<!-- /ANCHOR:limitations -->
