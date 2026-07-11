---
title: "SessionStart priming (Claude)"
description: "Claude-specific SessionStart priming via stdout with source routing (compact/startup/resume/clear). For cross-runtime startup payload parity see the shared startup payload entry."
trigger_phrases:
  - "sessionstart priming"
  - "SessionStart hook"
  - "session priming stdout injection"
  - "compact startup resume clear routing"
  - "claude sessionstart context"
version: 3.6.0.9
---

# SessionStart priming (Claude)

<!-- sk-doc-template: skill_asset_feature_catalog -->

> **Scope note:** This page documents the Claude-specific SessionStart priming path. All three supported runtimes (Claude, Copilot, OpenCode) now transport the same compact startup shared-payload (including `graphQualitySummary`) through their runtime-specific hooks — see `../ux-hooks/21-shared-provenance-and-copilot-compact-cache-parity.md` and `references/config/hook_system.md` (Shared Startup Payload Parity section) for the cross-runtime matrix.

## 1. OVERVIEW

SessionStart priming injects context via stdout on Claude Code SessionStart based on source routing (compact/startup/resume/clear).

This hook handles four session start scenarios: after compaction it reads the cached PreCompact payload, on fresh startup it surfaces a Spec Kit Memory overview plus the shared startup payload (`graphQualitySummary`, `sharedPayloadTransport`), on resume it loads prior session state, and after /clear it provides minimal context. The output is written to stdout for Claude Code to inject into the conversation. The same payload shape is transported by `hooks/copilot/session-prime.ts` and `hooks/opencode/session-start.ts`.

---

## 2. HOW IT WORKS

The SessionStart hook routes by `source` field from stdin JSON. For `compact`: reads cached payload from hook state, injects, clears cache. For `startup`: outputs Spec Kit Memory tool overview. For `resume`: loads lastSpecFolder from hook state and points recovery back to `/speckit:resume` with the `handover.md -> _memory.continuity -> spec docs` chain. For `clear`: minimal output. Token budget: 2000 for startup/resume, 4000 for compact.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/hooks/claude/session-prime.ts` | Hook | SessionStart injection with source routing |
| `mcp_server/hooks/claude/hook-state.ts` | Hook | Per-session state management |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/hook-session-start.vitest.ts` | Automated test | Source routing, cache read, output formatting |

---

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `context-preservation/session-start-priming.md`
Related references:
- [precompact-hook.md](precompact-hook.md) — PreCompact hook context caching
- [stop-token-tracking.md](stop-token-tracking.md) — Stop hook token tracking
