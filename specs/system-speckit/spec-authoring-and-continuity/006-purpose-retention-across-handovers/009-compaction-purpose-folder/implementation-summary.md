---
title: "Implementation Summary"
description: "Planned, not built. This phase holds the plan for nine edits that give the compaction recovery a fallback folder and keep both adapters from reading a spec outside the project. No file outside this packet has changed yet."
trigger_phrases:
  - "compaction purpose folder implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/009-compaction-purpose-folder"
    last_updated_at: "2026-11-14T06:14:05Z"
    last_updated_by: "template-author"
    recent_action: "Planned nine edits for the compaction purpose folder"
    next_safe_action: "Build phase 006 first, then review plan.md section 4 and build with /speckit:implement"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts"
      - ".skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-compaction-purpose-folder"
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
| **Spec Folder** | 009-compaction-purpose-folder |
| **Completed** | Not built. Planned 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

Nothing is built yet. This packet holds the plan that answers findings 4 and 9 of the independent review of the purpose-carry work, and the compaction-test part of finding 10.

### Phase 9: compaction-purpose-folder

The purpose line after a compaction needs a pinned `lastSpecFolder`, and the Stop hook pins none when the transcript names several packets. Both compaction adapters also open `spec.md` wherever the stored folder points. `plan.md` section 4 holds nine edits that add a fallback to the folder the cached brief names, refuse a folder outside the project and move the tests to repo-relative folders.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md` | Created | The plan for the nine edits |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Not delivered. Planning ran the three Measured Behavior commands in `spec.md` and counted every search text in `plan.md` section 4 once with `rg -c -F`. It could not start `node`, so the replacement code and the four new tests were not run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Fall back at recovery time and leave the Stop hook alone | The Stop hook's folder is also the autosave target, so a guess there writes continuity into the wrong packet. A guess at recovery time only chooses which purpose to show |
| Read the fallback folder from the cached brief | The brief is already in hook state when the recovery runs, so no new state field is needed |
| Each adapter keeps its own containment check | The Pi adapter loads the helper from `dist/` at run time and shares no import with the Claude adapter |
| No sanitizer pass over the purpose line | `sanitizeRecoveredPayload` drops lines by their first words, and the purpose line always opens with the helper's own label |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| The three Measured Behavior commands in `spec.md` | Run 2026-11-14: two unchecked resolves, a null result for several packets and three tests that store an absolute folder |
| Search texts in `plan.md` section 4 | Each of the seventeen counted `1` |
| The nine edits | Not run. Tasks T001 to T018 are open |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The fallback folder is a guess.** The brief names the most-referenced folder in the transcript tail, which may not be the packet in hand. A pinned `lastSpecFolder` always wins, and the brief shows the same folder as `Active spec folder:`.
2. **No real compaction has been observed.** How often a session reaches a compaction with no pinned folder is not measured. The check is a real compaction in an operator session after phases 006 and 009 are built.
<!-- /ANCHOR:limitations -->

---
