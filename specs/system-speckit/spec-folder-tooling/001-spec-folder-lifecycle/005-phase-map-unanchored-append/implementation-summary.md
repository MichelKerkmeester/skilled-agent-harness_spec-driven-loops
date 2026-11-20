---
title: "Implementation Summary"
description: "create.sh --phase --parent now adds a row to a parent's existing phase map when that map has no phase-map anchor, instead of appending a second map."
trigger_phrases:
  - "phase map unanchored append implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/001-spec-folder-lifecycle/005-phase-map-unanchored-append"
    last_updated_at: "2026-11-20T15:51:39Z"
    last_updated_by: "claude-opus"
    recent_action: "Fixed the un-anchored phase map append in create.sh and added its regression case"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-phase-map-unanchored-append"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 005-phase-map-unanchored-append |
| **Completed** | 2026-11-20 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

Adding a phase to a parent whose map was written by hand now adds one row to that map. You no longer get a second PHASE DOCUMENTATION MAP at the end of the file to fold back by hand.

### create.sh adds a row to an un-anchored parent phase map

When the parent has no `phase-map` anchor but has a `## Phase Documentation Map` heading with a table under it, `create.sh` wraps that section in the anchor pair. It then orders the new row's cells by the table's own header and lets the existing anchored append insert it. The next append finds the anchor and takes the anchored path directly. A map without a handoff table does not get one.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modified | Wrap an un-anchored map in the anchor and order new rows by its header |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh` | Modified | Regression case for a hand-written map with Status before Description and its table on the last line |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The suite ran first as a baseline at 12 of 12. Then the new case ran against the unfixed script and failed 3 of its 3 checks, reproducing the duplicate map. After the fix the suite passed 15 of 15. This phase was then created with the fixed `create.sh --phase --parent`. This parent's map was already anchored, so that run exercised the unchanged anchored path, not the new one.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Wrap the section in the anchor, then reuse the anchored append | The anchored path stays untouched, and later appends to the same parent go straight to it |
| Order new cells by the table header | Hand-written maps follow `phase-definitions.md` §3 with Status before Description, and `sync-phase-map-status.ts` reads Status by column name |
| Require a table row under the heading | Without a table the rows would have nowhere to land, so the old append path still runs |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `bash tests/test-phase-system.sh` before the change | PASS, 12 passed, 0 failed (of 12) |
| New case against the unfixed script | FAIL as expected, 12 passed, 3 failed (of 15) |
| `bash tests/test-phase-system.sh` after the fix | PASS, 15 passed, 0 failed (of 15) |
| `bash -n` and `shellcheck -S warning` on the changed block | PASS, no findings |
| `validate.sh --strict --recursive` on the parent | PASS, `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **Handoff rows are not added to a hand-written map.** A map with no `| From | To |` table gets no handoff rows. Add that table first when the parent should track handoffs.
2. **New rows are not styled like hand-written ones.** The folder cell is plain `NNN-name/`, without the backticks a hand-written map may use. Edit the row if the style matters.
<!-- /ANCHOR:limitations -->

---
