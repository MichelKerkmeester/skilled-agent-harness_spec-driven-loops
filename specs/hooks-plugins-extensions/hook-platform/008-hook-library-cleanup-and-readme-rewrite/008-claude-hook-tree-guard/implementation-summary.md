---
title: "Implementation Summary"
description: "A Skilled Claude hook copied into the user settings now stays silent in a folder whose .skilled holds only data, such as a home folder with the Jev label store, and still reports drift inside a Skilled checkout."
trigger_phrases:
  - "claude hook tree guard implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/008-claude-hook-tree-guard"
    last_updated_at: "2026-11-16T11:44:18Z"
    last_updated_by: "generate-context"
    recent_action: "Guarded Claude hooks on .skilled/hooks"
    next_safe_action: "Sync user Claude hooks after merge"
    packet_purpose: "Purpose: A Skilled hook copied into the user settings stays silent in any folder that is not a Skilled checkout, and still reports drift inside one."
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json"
      - ".claude/settings.json"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts"
      - ".skilled/bin/tests/sync-claude-user-hooks.test.cjs"
    session_dedup:
      fingerprint: "sha256:4c024a467fcdbf9b9b3b3af73bd8305dee3a8807db75ed4c72bc634a54067cf9"
      session_id: "scaffold-008-claude-hook-tree-guard"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "a4c37e98-2c3a-4c20-a7bf-acbc32e31f29"
      workspace: "/Users/michelkerkmeester/worktrees/public/432-claude-hook-tree-guard"
      savedAt: "2026-11-16T11:44:18Z"
      locatorKind: "transcript_path"
      version: 1
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
| **Spec Folder** | 008-claude-hook-tree-guard |
| **Completed** | 2026-11-16 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

A Claude session started in your home folder no longer prints `mk claude hook could not resolve` on every Stop and tool call. Each Skilled hook now checks for `.skilled/hooks` before it runs, so a `.skilled` folder that only holds data, like `~/.skilled/.labels`, no longer lets it through.

### Phase 8: claude-hook-tree-guard

The registry names the tree a Claude hook needs, and the generator writes that check in front of every Claude command. It named `.skilled`, which also exists in a home folder that keeps the Jev label store. The user-level copy of the hooks runs in every folder, so in the home folder each hook passed the check, found no adapter and printed the drift notice. It now names `.skilled/hooks`, which a Skilled checkout and a vendored install hold and a data folder does not.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Modified | Claude's `requireTree` is `.skilled/hooks` |
| `.claude/settings.json` | Modified | Regenerated: all 36 Claude commands carry the new check |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts` | Modified | A folder whose `.skilled` holds only `.labels` must stay silent |
| `.skilled/bin/tests/sync-claude-user-hooks.test.cjs` | Modified | The pinned guard string |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs`, `.skilled/bin/sync-claude-user-hooks.mjs` | Modified | Comments say why the tree must be one only a checkout holds |
| `.skilled/bin/README.md` | Modified | The sync row names `.skilled/hooks` and the home-folder case |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The failure was reproduced first: the first Stop command from `.claude/settings.json`, run in a temp folder holding only `.skilled/.labels`, printed `Cannot find module`. The registry test then gained that case and failed on the old registry. The registry value changed, the generator rewrote the settings, and both tests, both sync checks and the reproduction were run again. The work was built in worktree 432 from main, because the bug came from a commit on main that the phase 7 branch does not have.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Check `.skilled/hooks`, not the adapter file | A check on the adapter file would also silence real drift inside a checkout, which is what the notice exists to report |
| Leave `~/.skilled/.labels` where it is | It is the operator's Jev label store, kept outside the repository on purpose |
| Do not rewrite `~/.claude/settings.json` here | It lives outside the repository. The session-start sync or a manual sync run refreshes it from the project file |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| First Stop command in a folder holding only `.skilled/.labels`, before | `Error: Cannot find module .../.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-stop.js` |
| Same, after | Exit 0, no output |
| Same command with `.skilled/hooks` present and no adapter, after | Prints the drift error, so drift is still reported |
| `hook-registration-sync.vitest.ts` on the old registry | 1 failed, 8 passed: `expected '.skilled' to be '.skilled/hooks'` |
| `hook-registration-sync.vitest.ts` after | 9 passed |
| `node --test .skilled/bin/tests/sync-claude-user-hooks.test.cjs` | pass 8, fail 0 |
| `sync-hook-registrations.cjs --check`, `sync-runtime-mirrors.cjs --check` | PASS for 4 files and 36 hooks, PASS for 260 mirrors |
| Guard strings in `.claude/settings.json` | 36 with `.skilled/hooks`, 0 with the bare `.skilled` |
| `quality-gate.cjs` over the changed files | `NO_BLOCKER_FOUND`, 0 findings |
| `.skilled/bin/README.md` | `validate_document.py` VALID. `hvr_scan.py` hard blockers went from 2 to 1: the semicolon in the edited row is gone, and the one at line 171 is in a row this phase did not touch |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The user settings keep the old check until they are synced.** `~/.claude/settings.json` holds its own copy of the commands. It picks up the fix at the next session start when `SYSTEM_CLAUDE_USER_HOOK_SYNC_ENABLED` is set, or when `node .skilled/bin/sync-claude-user-hooks.mjs` is run from the primary checkout after the fix reaches main.
2. **Sessions started before the phase 3 renames still run old adapter names.** They keep the hook commands they loaded at start, so only a restart clears their notices.
<!-- /ANCHOR:limitations -->

---
