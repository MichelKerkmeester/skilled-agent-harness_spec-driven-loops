---
title: "Implementation Summary"
description: "Built and gated: one helper reads a packet's purpose sentence and the post-compaction context on Claude, Codex, Cursor, DSH and Pi now opens with it."
trigger_phrases:
  - "compaction purpose line implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/004-compaction-purpose-line"
    last_updated_at: "2026-11-13T23:44:14Z"
    last_updated_by: "markdown-agent"
    recent_action: "Built 2026-11-14 by a DeepSeek Harness worker and gated, all 28 tasks ticked"
    next_safe_action: "None for the build. A real compaction would show the Packet Purpose section in a live recovery"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts"
      - ".skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-compaction-purpose-line"
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
| **Spec Folder** | 004-compaction-purpose-line |
| **Completed** | 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

A session that compacts now gets back one sentence that says why its packet exists, ahead of the files and topics it already got. The measurement of the built brief moved from `purpose_heading=0 purpose_text=0` to `purpose_heading=1 purpose_text=1`.

### Phase 4: compaction-purpose-line

The new helper `packet-purpose.ts` returns the packet's own `### Purpose`, else the nearest phase parent's, else the `goal.md` Objective. It fails soft to null. The Claude `session-prime` hook leads the compact sections with a `## Packet Purpose` section built from the last active spec folder. The Pi `session-compact-context` hook does the same through the built `dist` copy. Child 005 imports the same helper.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts` | Created (141 lines) | Purpose helper: `resolvePacketPurpose` and `formatPacketPurpose` |
| `.skilled/skills/system-spec-kit/runtime/tests/packet-purpose.vitest.ts` | Created (62 lines) | Four helper tests |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts` | Modified (+23 -1) | `buildPacketPurposeSection` and the compact-path `unshift` |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts` | Modified (+27 -2) | `readPacketPurposeSection` and the Pi message section |
| `.skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts` | Modified (+59 -0) | Two compact tests |
| `.skilled/skills/system-spec-kit/runtime/tests/history-locator-adapters.vitest.ts` | Modified (+33 -1) | Pi edge assertion and the Pi purpose test |
| `.skilled/skills/system-spec-kit/runtime/lib/spec/README.md` | Modified (+4 -1) | Current-state line, key-file row and two entrypoint rows |
| `.skilled/skills/system-spec-kit/runtime/lib/MODULE-MAP.md` | Modified (+1 -0) | Key-file line |
| `.skilled/skills/system-spec-kit/runtime/lib/README.md` | Modified (+1 -0) | Key-file row |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/README.md` | Modified (+1 -1) | session-prime row names the Packet Purpose section |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/README.md` | Modified (+1 -1) | session-compact-context row names the Packet Purpose section |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

On 2026-11-14 one DeepSeek Harness worker (`dsh --profile headless`, LLM Gateway `deepseek-v4.1-flash-1017` at max) applied the plan's literal edits in worktree 371. It exited 0 with a `completed` final event and ran no builds or tests. Its handback was a claim, so the orchestrating session checked the files itself. It found the replacement text present in 17 of 17 edits. It built the runtime and the cli (both exit 0) and reran the gates. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| The section is added in `session-prime.ts`, not in the PreCompact cache | `session-prime` already holds `lastSpecFolder` when it prints, and one edit there reaches Claude, Codex, Cursor and DSH on every compact path, including the one with no cache |
| The helper lives in `runtime/lib/spec/` beside `is-phase-parent.ts` | It reuses `isPhaseParent` with a relative import, and hooks, `runtime/lib/continuity` and the built `dist` copy can all load it |
| The purpose section goes first | The budget cut drops trailing sections, and why the work exists outlasts the transcript detail after it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

Before is `gates-371-baseline.txt`, taken before any edit. After is `gates-371-final.txt`, taken after all five builds.

| Check | Before | After |
|-------|--------|-------|
| Four existing hook test files | `Test Files  4 passed (4)`, `Tests  64 passed (64)` | - |
| Hook test files with the new helper test | - | `Test Files  5 passed (5)`, `Tests  71 passed (71)` |
| Helper test alone | file did not exist | `Test Files  1 passed (1)`, `Tests  4 passed (4)` |
| Brief measurement | `purpose_heading=0 purpose_text=0` | `purpose_heading=1 purpose_text=1` |
| Runtime typecheck | exit 0 | exit 0 |
| eslint on the four code files | not measured | exit 0, no output |
| Files changed outside `specs/` | none | the eleven above, nine modified and two new |
| Real compaction on a live session | not run | Not run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **No real compaction was triggered.** The measurement renders the built `session-prime` brief and the tests cover both hooks, but nobody has seen the section in a live recovery.
2. **Devin and OpenCode stay without a purpose line.** Devin does not pass `PostCompaction` output to the model, and OpenCode's post-compaction text knows no spec folder. `/speckit:resume` still recovers the packet on both.
<!-- /ANCHOR:limitations -->

---
