---
title: "Tasks: Phase 2 install-transition"
description: "Task ledger for the reversible package replacement and command ownership probe."
trigger_phrases:
  - "install-transition tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests/002-install-transition"
    last_updated_at: "2026-08-16T18:45:28Z"
    last_updated_by: "claude-code"
    recent_action: "Executed install transition: fork installed, pi-gpt removed, /fast owned"
    next_safe_action: "Continue to 003-live-verification-and-sync"
    blockers: []
    key_files: ["../../../../../.pi/settings.json"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: Phase 2 install-transition

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending · `[x]` complete · `[P]` parallelizable · `[B]` blocked.

<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T801 Record the LOCAL-PATH install decision and the rollback snapshot location (`scratch/rollback-snapshot/`). — DEVIATION: installed user-scope (`pi install ./path`, no `-l`) per the operator "global replace" choice, since `pi-gpt-fast-mode` is user-scoped.
- [x] T802 Capture pre-state BEFORE any mutation: copy `.pi/settings.json`, run `pi list`, save receipts in the rollback snapshot and record the exact rollback command. — `settings.json.before` + `pi list` saved to `scratch/rollback-snapshot/` before the first `pi` mutation.

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T803 Remove `pi-gpt-fast-mode`, install the fork from the local path, and reconcile `.pi/settings.json` and both npm scopes. — DEVIATION: `pi install` fork → verify load → `pi remove` pi-gpt (safer than one atomic op); `.pi/settings.json` swapped, dead config removed.

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T804 Verify the fork is present and `pi-gpt-fast-mode` is absent, with `pi list` and `npm ls` agreeing. — `pi list` = 0 pi-gpt, fork present (3 refs); 0 pi-gpt on disk (user + project).
- [x] T805 Query RPC `get_commands`, filter extension entries, and assert the fork source path owns bare `/fast` with no unexpected suffix. — `get_commands` (exit 0) shows `"name":"fast"` from the fork's `src/index.ts`, no `/fast:1` suffix.
- [x] T806 Record post-state inventory and no-stray-file result; confirm no live-UX or repo-sync work was performed here. — post-state recorded; `.pi/PLUGINS.md` updated with the swap; no live TUI toggle or child-session run.

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remain.
- [x] Handoff criteria in `spec.md` are evidenced.

<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
<!-- /ANCHOR:cross-refs -->
