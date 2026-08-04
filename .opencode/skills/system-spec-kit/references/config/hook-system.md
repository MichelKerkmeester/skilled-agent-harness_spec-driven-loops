---
title: Hook System Reference
description: Current hook registration, runtime vocabulary, lifecycle behavior, and fallback contracts for Spec Kit prompt-time and session hooks.
trigger_phrases:
  - "hook system reference"
  - "hook registration matrix"
  - "runtime hook vocabulary"
  - "hook lifecycle behavior"
  - "opencode timeout fallback"
importance_tier: important
contextType: implementation
version: 3.6.0.35
---

# Hook System Reference

Current hook registration, runtime vocabulary, lifecycle behavior, and fallback contracts for Spec Kit prompt-time and session hooks.

---

## 1. OVERVIEW

The maintained native hook source set is `system-spec-kit/mcp-server/hooks/{claude,codex,cursor,devin}/`, with compiled twins under `system-spec-kit/mcp-server/dist/hooks/{claude,codex,cursor,devin}/`. OpenCode prompt-time advisor delivery is the plugin bridge, not a source-hook tree.

Prompt delivery, startup wiring, compaction, and shutdown handling differ by runtime, but all adapters use the same retrieval primitives and fail-open recovery path.

---

## 2. HOOK REGISTRATION

Claude Code registers the maintained compiled adapter in `.claude/settings.json`:

```json
{
  "hooks": {
    "UserPromptSubmit": [{ "hooks": [{ "type": "command", "command": "node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude/user-prompt-submit.js", "timeout": 3 }] }],
    "PreCompact": [{ "hooks": [{ "type": "command", "command": "node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude/compact-inject.js", "timeout": 3 }] }],
    "SessionStart": [{ "hooks": [{ "type": "command", "command": "node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude/session-prime.js", "timeout": 3 }] }],
    "Stop": [{ "hooks": [{ "type": "command", "command": "node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude/session-stop.js", "async": true, "timeout": 10 }] }]
  }
}
```

The other native registrations are `.codex/hooks.json`, `.cursor/hooks.json`, and `.devin/hooks.v1.json`. Each points at the maintained runtime directory under `system-spec-kit/mcp-server/`; the Codex prompt adapter is registered and present at `.opencode/skills/system-spec-kit/mcp-server/dist/hooks/codex/user-prompt-submit.js`.

OpenCode prompt-time advisor delivery is registered through `.opencode/plugins/mk-skill-advisor.js`, which calls `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`. There is no checked-in `.opencode/settings.json` hook template and no native OpenCode source-hook adapter in this tree.

---

## 3. CANONICAL RUNTIME VOCABULARY

| Runtime | Prompt-time advisor | Session start | Compaction | Cleanup | Transport |
| --- | --- | --- | --- | --- | --- |
| Claude | `UserPromptSubmit` | `SessionStart` | `PreCompact` | `Stop` | Native command hooks |
| Codex | `UserPromptSubmit` | `SessionStart` | `PreCompact` | `Stop` | Native command hooks |
| Cursor | `beforeSubmitPrompt` | `sessionStart` | `preCompact` | `sessionEnd` | Native command hooks |
| Devin | `UserPromptSubmit` | `SessionStart` | runtime-specific lifecycle event | `Stop` | Native command hooks |
| OpenCode | `experimental.chat.system.transform` | plugin `event` handlers | plugin event handlers | plugin event handlers | Skill Advisor plugin bridge |

When a runtime cannot deliver automatic advisor context, use `/speckit:resume`, then the explicit memory or advisor fallback. OpenCode's bridge probes the warm advisor CLI and treats exit `75` as retryable fail-open behavior.

---

## 4. HOOK LIFECYCLE

1. **Prompt-time advisor** — native `UserPromptSubmit`/`beforeSubmitPrompt` adapters in Claude, Codex, Cursor, and Devin; `experimental.chat.system.transform` in the OpenCode plugin bridge.
2. **Compaction** — runtime-specific compact hooks where registered; stdout is not assumed to be a model-visible channel during precompute.
3. **Session start** — runtime-specific startup adapters prime the session with the shared recovery payload.
4. **Session cleanup** — runtime-specific stop/end adapters record cleanup evidence where supported.

---

## 5. SCRIPT LOCATIONS

| Runtime | Source | Compiled |
| --- | --- | --- |
| Claude | `mcp-server/hooks/claude/*.ts` | `mcp-server/dist/hooks/claude/*.js` |
| Codex | `mcp-server/hooks/codex/*.ts` | `mcp-server/dist/hooks/codex/*.js` |
| Cursor | `mcp-server/hooks/cursor/*.ts` | `mcp-server/dist/hooks/cursor/*.js` |
| Devin | `mcp-server/hooks/devin/*.ts` | `mcp-server/dist/hooks/devin/*.js` |
| OpenCode | `.opencode/plugins/mk-skill-advisor.js` and `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs` | Plugin bridge entrypoint |

---

## 6. RUNTIME HOOK MATRIX

| Runtime | Prompt hook | Lifecycle | Registration source | Manual fallback |
| --- | --- | --- | --- | --- |
| Claude | yes (`UserPromptSubmit`) | yes (`SessionStart`, `PreCompact`, `Stop`) | `.claude/settings.json` | `/speckit:resume`, `/memory:save`, direct MCP tools |
| Codex | yes (`UserPromptSubmit`) | yes (`SessionStart`, `PreCompact`, `Stop`) | `.codex/hooks.json` | `/speckit:resume`, direct MCP tools |
| Cursor | yes (`beforeSubmitPrompt`) | yes (`sessionStart`, `preCompact`, `sessionEnd`) | `.cursor/hooks.json` | `/speckit:resume`, direct MCP tools |
| Devin | yes (`UserPromptSubmit`) | yes (`SessionStart`, `Stop`) | `.devin/hooks.v1.json` | `/speckit:resume`, direct MCP tools |
| OpenCode | yes (`experimental.chat.system.transform`) | plugin events | `.opencode/plugins/mk-skill-advisor.js` | `/speckit:resume`, `session_bootstrap()`, direct MCP tools |

---

## 7. INSTALLATION DRIFT CHECK

From a linked worktree, run the project-scoped check with its required flag:

```bash
node .opencode/bin/install-codex-hooks.mjs --check --allow-worktree
```

The command checks project registration and project adapter paths. A report about the user-global installation is workstation state, not a repository defect. This reference documents the distinction and does not repair user-global files; any global repair is a separate operator action.

---

## 8. OPENCODE TIMEOUT FALLBACK

The timeout flag's ownership is the `system-skill-advisor` hub because its live consumers are `mcp-server/lib/subprocess.ts`, `mcp-server/lib/skill-advisor-brief.ts`, `mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`, and `mcp-server/scripts/skill_advisor.py`. See the advisor hub's runtime contract for `SPECKIT_OPENCODE_HOOK_TIMEOUT_MS` and its default `3000` ms. This sibling reference is a pointer, not the owner of that flag.

---

## 9. VALIDATION

```bash
npm --prefix .opencode/skills/system-spec-kit/mcp-server run build
npm --prefix .opencode/skills/system-skill-advisor/mcp-server run build
```

The complete adapter matrix and smoke commands live in [`skill-advisor-hook.md`](../../../system-skill-advisor/hooks/skill-advisor-hook.md).
