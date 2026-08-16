---
title: "Tasks: Phase 3 live-verification-and-sync"
description: "Task ledger for live runtime proof and repository closeout."
trigger_phrases:
  - "live-verification-and-sync tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests/003-live-verification-and-sync"
    last_updated_at: "2026-08-16T11:00:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Created live closeout task ledger"
    next_safe_action: "Execute T901"
    blockers: []
    key_files: ["../../../../../.pi/PLUGINS.md", "../../../../../.pi/SYNC.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 3 live-verification-and-sync

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending · `[x]` complete · `[P]` parallelizable · `[B]` blocked.

<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T901 Confirm install post-state and supported model.
- [ ] T902 Define redacted live evidence outputs and rollback receipt.

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T903 Run `/fast on`, `/fast off`, and explicit flag checks.
- [ ] T904 Run an RPC-mode session and capture the namespaced `setStatus("pi-fast-mode-w-subagent-support", ...)` request JSON as the indicator evidence artifact; record optional widget behavior separately.
- [ ] T905 Spawn a real child session on `openai-codex/gpt-5.6-luna` (serviceTier priority) and capture that it inherited `PI_FAST_MODE_W_SUBAGENT_SUPPORT=1` and applied the handoff state.

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T906 Alpha-sort `.pi/PLUGINS.md` (fork in, legacy removed).
- [ ] T907 Run `sync-pi-configs.sh --check` (exit 0) and inspect the final diff/status.
- [ ] T908 Record the rollback receipt (fork removal, legacy reinstall, settings/docs revert) and authorized commit evidence.

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
