---
title: "Implementation Summary"
description: "Planned, not built. This phase holds the plan for eight edits that give the relaunch note and the resume brief the purpose rule and the three line shapes the helper prints. No file outside this packet has changed yet."
trigger_phrases:
  - "hop purpose rule parity implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/008-hop-purpose-rule-parity"
    last_updated_at: "2026-11-14T06:14:05Z"
    last_updated_by: "template-author"
    recent_action: "Planned eight edits that give every hop one purpose rule"
    next_safe_action: "Build phase 007 first, then review plan.md section 4 and build with /speckit:implement"
    blockers: []
    key_files:
      - ".skilled/commands/speckit/handoff.md"
      - ".skilled/hooks/session-relaunch/lib/nudge.cjs"
      - ".skilled/commands/speckit/assets/speckit-resume-auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-hop-purpose-rule-parity"
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
| **Spec Folder** | 008-hop-purpose-rule-parity |
| **Completed** | Not built. Planned 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

Nothing is built yet. This packet holds the plan that answers finding 6 of the independent review of the purpose-carry work, and the nudge-test part of finding 10.

### Phase 8: hop-purpose-rule-parity

The four hops state the purpose by three rules and five label shapes. The relaunch note copies the whole Purpose and does not skip the scaffold sentence. `plan.md` section 3 states the one rule, and section 4 holds the eight edits that put it into `handoff.md`, `nudge.cjs`, both resume assets and the presentation file.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md` | Created | The plan for the eight edits |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Not delivered. Planning ran the two Measured Behavior commands in `spec.md` and counted every search text in `plan.md` section 4 once with `rg -c -F`. It could not start `node` or `python3`, so the test and mirror baselines in `plan.md` section 5 are the values phases 002 and 003 recorded.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| The helper's three line shapes win | Code prints them, two live continuity blocks store them and three test files assert them. Moving the two text rules changes nothing stored |
| One sentence in the relaunch note | A note that copies a whole Purpose cannot read the same as the one-sentence line on the other hops |
| Edit the four texts and add no command | The texts give the same line today, and a command would add a second entry point to the helper with no caller that needs it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| The label check in `spec.md` | Run 2026-11-14: twelve lines with five shapes across six files |
| The scaffold check in `spec.md` | Run 2026-11-14: `1` for both resume assets and the helper, no line for `handoff.md` or `nudge.cjs` |
| Search texts in `plan.md` section 4 | Each of the seven distinct texts counted `1` in its file |
| The eight edits | Not run. Tasks T001 to T018 are open |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **No test proves what a model prints.** The resume brief and the relaunch note are written by a model that follows these texts. The workaround is a live `/speckit:resume` and a live `/speckit:handoff` in an operator session.
<!-- /ANCHOR:limitations -->

---
