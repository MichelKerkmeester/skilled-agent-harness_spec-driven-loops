---
title: "Verification Checklist: Phase 3 live-verification-and-sync"
description: "Evidence checklist for live runtime proof and repository closeout."
trigger_phrases:
  - "live-verification-and-sync checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests/003-live-verification-and-sync"
    last_updated_at: "2026-08-16T11:00:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Created live closeout checklist"
    next_safe_action: "Capture redacted runtime and sync evidence"
    blockers: []
    key_files: ["checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Phase 3 live-verification-and-sync

<!-- ANCHOR:protocol -->
## Verification Protocol

- [ ] CHK-901 [P1] Record commands, exit codes, redacted output, and the runtime surface used.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-902 [P1] Install-transition handoff and rollback snapshot exist.
- [ ] CHK-903 [P1] Supported child model (`openai-codex/gpt-5.6-luna`, serviceTier priority) and live evidence locations are recorded.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-904 [P1] Runtime defects are routed to their owning source child rather than hidden in closeout.
- [ ] CHK-905 [P1] The default indicator contract remains namespaced `setStatus`.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-906 [P1] `/fast on` and `/fast off` agree with persisted/env state.
- [ ] CHK-907 [P1] Explicit `--fast` behavior is observed.
- [ ] CHK-908 [P1] RPC `setStatus("pi-fast-mode-w-subagent-support", ...)` request JSON is captured from an RPC-mode session as the indicator evidence; a TUI textual/screenshot capture is optional.
- [ ] CHK-909 [P1] A real child spawned on `openai-codex/gpt-5.6-luna` inherits `PI_FAST_MODE_W_SUBAGENT_SUPPORT=1` and applies the handoff state.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-910 [P1] Optional widget behavior is recorded separately from the status contract.
- [ ] CHK-911 [P1] Namespaced `setStatus` composes with — does not replace — the built-in/custom footer; no default behavior depends on `setFooter` or the rejected footer wrapper.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-912 [P1] Live output is redacted and contains no credentials.
- [ ] CHK-913 [P1] Child env evidence confirms only the boolean handoff value crosses the boundary.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-914 [P1] `.pi/PLUGINS.md` is alpha-sorted and contains the fork, not the legacy entry.
- [ ] CHK-915 [P1] `sync-pi-configs.sh --check` exits 0.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-916 [P1] Final `.pi` status contains only intended files — no stray `.pi` files and no stale plugin entry.
- [ ] CHK-917 [P1] Rollback receipt is executable and names the fork removal, legacy reinstall, and settings/docs restore path.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-918 [P1] Final live-verification handoff criteria are satisfied and evidence is appended here.
- [ ] CHK-919 [P1] Final diff/status after the last closeout mutation shows only intended changes (no post-verification drift).
- [ ] CHK-920 [P1] Commit receipt is recorded only when the operator authorizes the commit.
<!-- /ANCHOR:summary -->
