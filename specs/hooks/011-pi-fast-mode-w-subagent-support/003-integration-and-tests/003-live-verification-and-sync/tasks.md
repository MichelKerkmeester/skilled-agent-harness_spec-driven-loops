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
    last_updated_at: "2026-08-17T03:36:31Z"
    last_updated_by: "claude-code"
    recent_action: "All live/closeout tasks executed; RPC + child checks exit 0"
    next_safe_action: "Close out the 003-integration-and-tests workstream"
    blockers: []
    key_files: ["../../../../../.pi/PLUGINS.md", "../../../../../.pi/SYNC.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 100
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

- [x] T901 Confirm install post-state and supported model. — install post-state confirmed from `002-install-transition`; child model `openai-codex/gpt-5.6-luna` (serviceTier priority).
- [x] T902 Define redacted live evidence outputs and rollback receipt. — redacted live evidence outputs defined in phase `scratch/`; `002-install-transition` rollback snapshot + receipt reused.

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T903 Run `/fast on`, `/fast off`, and explicit flag checks. — `/fast on` → `enabled:true`; `/fast off` → `enabled:false`; `pi --fast` → `enabled:true` (RPC, exit 0).
- [x] T904 Run an RPC-mode session and capture the namespaced `setStatus("pi-fast-mode-w-subagent-support", ...)` request JSON as the indicator evidence artifact; record optional widget behavior separately. — RPC session on `openai-codex/gpt-5.6-luna` emitted `setStatus` + the `fast` indicator (exit 0); no `setWidget` used.
- [x] T905 Spawn a real child session on `openai-codex/gpt-5.6-luna` (serviceTier priority) and capture that it inherited `PI_FAST_MODE_W_SUBAGENT_SUPPORT=1` and applied the handoff state. — child `pi` with `PI_FAST_MODE_W_SUBAGENT_SUPPORT=1` → `enabled:true`; `=0` → `enabled:false` (negative control).

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T906 Alpha-sort `.pi/PLUGINS.md` (fork in, legacy removed). — `.pi/PLUGINS.md` alpha-sorted with the fork; no `#### pi-gpt-fast-mode` header remains.
- [x] T907 Run `sync-pi-configs.sh --check` (exit 0) and inspect the final diff/status. — `sync-pi-configs.sh --check` exit 0 (`ok: settings.json`, `ok: statusline.sh`); final `.pi/` diff inspected.
- [x] T908 Record the rollback receipt (fork removal, legacy reinstall, settings/docs revert) and authorized commit evidence. — rollback receipt reused from `002`; `.pi/` change committed on the environment branch (operator-authorized).

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
