---
title: "Implementation Summary: Phase 2 install-transition"
description: "Closeout record for the reversible installed extension transition."
trigger_phrases:
  - "install-transition implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests/002-install-transition"
    last_updated_at: "2026-08-16T18:45:28Z"
    last_updated_by: "claude-code"
    recent_action: "Swapped pi-gpt-fast-mode for the fork; /fast owned by fork; config writes on load"
    next_safe_action: "Continue to 003-live-verification-and-sync"
    blockers: []
    key_files: ["implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Summary: Phase 2 install-transition

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-install-transition |
| **Status** | Complete |
| **Completed** | 2026-08-16 |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The live install transition. `pi-gpt-fast-mode` was removed from Pi (user + project scope; 0 in `pi list`, 0 on disk) and the `pi-fast-mode-w-subagent-support` fork was installed user-scoped from its local `packages/` path. `.pi/settings.json` now references the fork's path in place of pi-gpt; the dead `.pi/extensions/pi-gpt-fast-mode.json` config was removed; `.pi/PLUGINS.md` documents the fork. A rollback snapshot was captured first. The fork owns bare `/fast` and its config engine runs live.

<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Rollback snapshot captured, then `pi install ./packages/pi-fast-mode-w-subagent-support` (user scope), verified the fork loads, then `pi remove npm:pi-gpt-fast-mode`. Ownership confirmed with a live RPC `get_commands` probe. The `.pi/` config changes were committed separately on the environment branch (`skilled/v4.0.0.0`); these spec docs live on the packet branch.

<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Global (user-scope) replace, not `-l` project | The extension being replaced, `pi-gpt-fast-mode`, is user-scoped; replacing at the same scope avoids both loading and double `service_tier` injection. |
| Install → verify-loaded → remove, not one atomic op | Confirm the new extension loads before removing the working one; smaller failure blast. |
| Remove the tracked pi-gpt project config | The repo shipped pi-gpt as the project extension; the swap makes the fork the committed project extension. |

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Pre-state snapshot | `cp .pi/settings.json` + `pi list` | captured in `scratch/rollback-snapshot/` |
| Fork installed | `pi install ./packages/... ` | user-scoped, 3 refs in `pi list` |
| Legacy absent | `pi list` / `find` | 0 `pi-gpt-fast-mode` (pi list + on disk) |
| Bare `/fast` owner | RPC `get_commands` | `"name":"fast"` from the fork's `src/index.ts` (exit 0) |
| Engine runs live | load session | fork wrote config (`enabled:false`, 12 targets) |
| Settings valid | `python3 -m json.tool` | clean |

<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Deviations from the plan, recorded honestly**: installed user-scoped (global replace per operator) rather than `-l` project; run as install-then-verify-then-remove rather than one atomic operation.
2. **A concurrent `defaultProvider/defaultModel` edit rode along** in the `.pi/settings.json` commit (`openai-codex/gpt-5.6-luna` → `opencode-go/deepseek-v4-flash`) — not part of this transition; git cannot exclude within-file changes from a pathspec commit.
3. **Full live proof is deferred** to `003-live-verification-and-sync`: the RPC `get_commands` ownership probe passed, but an interactive `/fast` on/off toggle and a real child-session handoff are operator-run TUI checks.
<!-- /ANCHOR:limitations -->
