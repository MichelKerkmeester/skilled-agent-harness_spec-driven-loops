---
title: "Implementation Summary"
description: "Research phase complete: a 7-iteration deep-research run diagnosed why deep-loop runs stay narrow and designed an opt-in expansive-depth frontier sub-mode, plus a register of default-path defects."
trigger_phrases:
  - "expansive depth mode implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode"
    last_updated_at: "2026-11-17T11:51:35Z"
    last_updated_by: "generate-context"
    recent_action: "Generation 2 research synthesized (5 iterations)"
    next_safe_action: "Plan Slice A completed-run extension"
    packet_purpose: "Purpose: Produce a research-backed design for an additive, opt-in expansive-depth sub-mode that widens and deepens a run's scope, grounded in the current convergence and focus code and in the 002-graph-engineering program."
    blockers: []
    key_files:
      - "research/research.md"
      - "research/resource-map.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:2088c1e4437f3061bd63975059960c6ebb10e14588be75e53898d13f9a592446"
      session_id: "scaffold-007-expansive-depth-mode"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-expansive-depth-mode |
| **Completed** | 2026-11-17 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

You now have a diagnosis and a design, not code. The run found that deep-research and deep-review stay narrow because every stop signal and focus source is tied to the questions written at init. It then designed an opt-in `--depth-mode=expansive` frontier that widens and deepens scope without changing default runs.

### Expansive-depth sub-mode for deep-research and deep-review

The design lets a leaf propose typed frontier nodes and has the workflow admit them under depth, fan-out, budget and dedupe caps. Admitted nodes are written to `research/inbox.jsonl`, which already grows the counted question set. Next Focus is picked from the open frontier, and one `frontierOpen` veto in `convergence.cjs` keeps a run going while frontier nodes remain open. The full design, the worked decompositions of both example targets and the file-by-file integration map are in `research/research.md`.

No runtime code changed. The run also produced a defect register (D1-D9 in `research/research.md` §13), which includes the corrected `--config-dir` routing defect for single-executor research runs.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Synthesis: diagnosis, design, integration map, defect register |
| `research/iterations/iteration-001.md` to `iteration-007.md` | Created | Per-iteration evidence narratives |
| `research/resource-map.md` | Created | Files the run cited, from the deltas |
| `spec.md` | Modified | Generated findings fence under Open Questions |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The work ran through `/deep:research:auto` with the native executor. There were seven `@deep-research` iterations. Each one was checked by `verify-iteration.cjs` and folded in by the reducer and the graph upsert. Convergence stopped the loop legally, on `all_questions_answered` with the graph at STOP_ALLOWED, at the iteration-8 check. One `blocked_stop` was recovered in iteration 7. Nothing was committed or pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| A separate `--depth-mode` flag, not a fifth `--convergence-mode` value | It composes with `divergent` and `sliding-window` instead of excluding them |
| A modifier flag, not a mode-registry entry | A registry mode binds one command, agent and loop type, and expansive applies to both loop types |
| Ship the default-path defects separately | Each one changes default behavior, so it does not belong inside an opt-in |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `verify-iteration.cjs`, iterations 1-7 | PASS, 7 of 7, each warning that the route proof came from the delta file (defect D7) |
| `convergence.cjs` stop decision | STOP, converged, all_questions_answered, graph STOP_ALLOWED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **Design only.** Nothing is implemented. Plan the build with `/speckit:plan` from `research/research.md` §11.
2. **Steered trajectory.** The orchestrator set `next_focus` by hand in iterations 2-7, so this run is not evidence of how default focus selection behaves.
<!-- /ANCHOR:limitations -->

---


