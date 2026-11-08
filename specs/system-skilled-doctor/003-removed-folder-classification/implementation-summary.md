---
title: "Implementation Summary"
description: "An upstream file added inside a skill-root remove folder is now pending removal, not a live edit, so apply deletes it; Barter items 1 to 5 were verified already fixed."
trigger_phrases:
  - "removed folder classification implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/003-removed-folder-classification"
    last_updated_at: "2026-11-08T16:58:14Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-removed-folder-classification"
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
| **Spec Folder** | 003-removed-folder-classification |
| **Completed** | 2026-11-08 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

A skill-root overlay that removes folders no longer blocks when upstream adds a file inside one. `status` shows the file as `overlay-edited`, and `apply` deletes it and exits 0. Barter can drop the two `repin.exclude` entries it added to get past this.

### Overlay engine treats upstream files inside a skill-root remove folder as removed, not live-edited; verify Barter items 1 to 5

The planner already deleted these files, but a deletion never got a state record, so the classifier read the live file as your edit and told you to capture it. The planner now tags a declared removal and the classifier reads the tag first. A file the `replace` list names keeps its overlay copy, and capture on a removed path refuses and writes nothing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modified | Tag and classify declared removals |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs` | Modified | Status, apply, replace and capture cases |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs` | Modified | `repin --stage` case |
| `.skilled/skills/system-skilled-doctor/references/overlays.md`, `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` | Modified | `live-edited` rows |
| `.skilled/skills/system-skilled-doctor/changelog/v1.1.2.0.md`, `SKILL.md` | Created, Modified | Release note and version |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

A Devin DeepSeek flash-max worker wrote the failing tests and the fix, and a flash-high worker ran the item 1 to 5 checks. The orchestrator then ran the new tests against the old engine (4 fail), the four suites (62/62), `run-all.sh` (7 suites, 1077 node tests), a temp-tree reproduction of Barter's manifest shape, and every item 1 to 5 check again. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Tag removals in the planner instead of storing deletions in state | The planner knows a path is a declared removal; state only records bytes written |
| Leave the tracked `.skilled/specs` link and host index auto-selection alone | Both are operator design calls, and the handover only asked to consider the second |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| New tests on the old engine | FAIL as intended: pass 0, fail 4 |
| Four overlay suites | PASS: 62/62 (baseline 58/58) |
| `run-all.sh` | PASS: 7 suites, 1077/1077 node tests |
| Temp-tree reproduction | PASS: apply exits 0, second status `RESULT: PASSED` |
| Items 1 to 5 checks | PASS: 64/64, 59/59, 19/19, lookup exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The status line still names an overlay source for a removal.** It reads `(overlay: skilled-overlays/src/changelog/...)` although no such source exists. The fix hint is right; the parenthetical is cosmetic.
<!-- /ANCHOR:limitations -->

---


