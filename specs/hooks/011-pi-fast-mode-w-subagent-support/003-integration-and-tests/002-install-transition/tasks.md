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
    last_updated_at: "2026-08-16T11:00:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Created install transition task ledger"
    next_safe_action: "Execute T801"
    blockers: []
    key_files: ["../../../../../.pi/settings.json"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 0
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

- [ ] T801 Record the LOCAL-PATH install decision (`pi install -l <local-package-path>`) and the rollback snapshot location (`scratch/rollback-snapshot/`).
- [ ] T802 Capture pre-state BEFORE any mutation: copy `.pi/settings.json`, run `pi list`, and run `npm ls` for the user (`~/.pi/agent/`) and project (`.pi/`) scopes; save receipts in the rollback snapshot and record the exact rollback command.

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T803 Perform the ONE bounded remove-then-install operation: remove `pi-gpt-fast-mode`, then install the fork from the local path; reconcile `.pi/settings.json` and both npm scopes.

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T804 Verify the fork is present and `pi-gpt-fast-mode` is absent, with `pi list` and `npm ls` agreeing.
- [ ] T805 Query RPC `get_commands` / `pi.getCommands()`, filter extension entries, and assert the fork source path owns bare `/fast` with no unexpected suffix.
- [ ] T806 Record post-state inventory and no-stray-file result; confirm no live-UX or repo-sync work was performed here.

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remain.
- [ ] Handoff criteria in `spec.md` are evidenced.

<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
<!-- /ANCHOR:cross-refs -->
