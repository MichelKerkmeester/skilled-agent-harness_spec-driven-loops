---
title: "Cross-runtime tool fallback"
description: "Cross-runtime tool fallback ensures context injection remains available when runtime hooks are missing or unavailable."
trigger_phrases:
  - "cross-runtime tool fallback"
  - "runtime hooks unavailable fallback"
  - "context injection fallback"
  - "hook missing recovery"
  - "spec kit resume fallback"
---

# Cross-runtime tool fallback

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Claude Code uses native hooks. Codex CLI now has native `SessionStart` and `UserPromptSubmit` hooks when `codex_hooks = true` and user-level `~/.codex/hooks.json` registers the Spec Kit commands; older or restricted deployments fall back to the tool path or prompt wrapper. Copilot CLI uses the shared `.claude/settings.local.json` matcher wrappers as its effective prompt/startup surface; those Copilot-safe wrappers carry top-level `type`, `bash`, and `timeoutSec` fields, and the `UserPromptSubmit` and `SessionStart` wrappers run the Spec Kit writer commands because Copilot hook stdout is not prompt-mutating. OpenCode uses plugin-based hooks (`@opencode-ai/plugin` plugins under `.opencode/plugins/`, such as `mk-spec-memory.js` and `mk-code-graph.js`). When hooks fail or are unavailable in any runtime, recover through the canonical tool-based path starting with `/speckit:resume`, which resolves `handover.md -> _memory.continuity -> spec docs`; `session_bootstrap()` and `session_resume()` remain the lower-level recovery surfaces for structural bootstrap and detailed merged state. Runtime detection identifies the active runtime and its current hook policy.

---

## 2. HOW IT WORKS

Runtime detection is the source of truth for hook-aware fallback. It identifies the active runtime, classifies the current hook policy as `enabled`, `disabled_by_scope`, `unavailable`, or `unknown`, and then lets packet recovery fall back through `/speckit:resume` and the `handover.md -> _memory.continuity -> spec docs` chain when runtime hooks are missing. The contract is intentionally runtime-specific rather than "all shells behave the same." For Copilot, `enabled` means the shared `.claude/settings.local.json` wrappers are present in a Copilot-safe shape and can run the top-level writer commands on `UserPromptSubmit` and `SessionStart` to refresh managed custom instructions and compact-cache state; it does not mean hook stdout injects `additionalContext`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-code-graph/mcp_server/lib/runtime-detection.ts` | Lib | Runtime identification and hook policy |
| `mcp_server/context-server.ts` | Server | Startup recovery guidance and tool routing hints |
| `mcp_server/tests/runtime-detection.vitest.ts` | Tests | Runtime env simulation and detection |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/runtime-detection.vitest.ts` | Automated test | Runtime env simulation and detection |

---

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `22--context-preservation/cross-runtime-fallback.md`
Related references:
- [stop-token-tracking.md](stop-token-tracking.md) — Stop hook token tracking
- [runtime-detection.md](runtime-detection.md) — Runtime detection and hook policy
