---
title: "Implementation Summary"
description: "Nothing is built yet. The plan adds one helper that reads a packet's purpose sentence and leads the post-compaction context with it on Claude, Codex, Cursor, DSH and Pi."
trigger_phrases:
  - "compaction purpose line implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/004-compaction-purpose-line"
    last_updated_at: "2026-11-13T21:41:52Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-compaction-purpose-line"
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
| **Spec Folder** | 004-compaction-purpose-line |
| **Completed** | Not completed. Planned 2026-11-13 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

Nothing is built yet. This phase is planned and no runtime file has changed.

### Phase 4: compaction-purpose-line

When the plan is built, a session that compacts gets back one sentence that says why its packet exists, ahead of the files and topics it already gets. The sentence comes from the packet's own `### Purpose`, or its phase parent's, or its `goal.md` Objective, through one helper that child 005 will also use.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| None yet | Planned | The eleven planned files are listed in `spec.md` section 3 and `plan.md` section 4 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Not delivered. Planning ran the baseline in the worktree and applied every planned edit to a scratch copy of the runtime outside the repository. Those dry-run results are recorded in `plan.md` section 5 as expectations, not as results of this phase.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| The section is added in `session-prime.ts`, not in the PreCompact cache | `session-prime` already holds `lastSpecFolder` when it prints, and one edit there reaches Claude, Codex, Cursor and DSH on every compact path, including the one with no cache |
| The helper lives in `runtime/lib/spec/` beside `is-phase-parent.ts` | It reuses `isPhaseParent` with a relative import, and hooks, `runtime/lib/continuity` and the built `dist` copy can all load it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Implementation checks | Not run. Nothing is built yet |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **Devin and OpenCode stay without a purpose line.** Devin does not pass `PostCompaction` output to the model, and OpenCode's post-compaction text knows no spec folder. `/speckit:resume` still recovers the packet on both.
<!-- /ANCHOR:limitations -->

---
