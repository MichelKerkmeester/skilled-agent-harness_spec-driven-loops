---
title: "OpenCode Plugin Entrypoints"
description: "Six plugin entrypoint files OpenCode auto-loads at startup. Helper bridge modules live with their owning skills, not in this folder."
---

# OpenCode Plugin Entrypoints

OpenCode 1.3.17+ auto-loads JavaScript files in `.opencode/plugins/` at session start. This folder is intentionally limited to those entrypoint files so helper modules cannot be mistaken for plugins. Helpers and bridges live alongside their owning skills under `.opencode/skills/.../mcp_server/`.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. CURRENT ENTRYPOINTS](#3--current-entrypoints)
- [4. BRIDGE MODULES](#4--bridge-modules)
- [5. CONFIGURATION](#5--configuration)
- [6. UPGRADE NOTES](#6--upgrade-notes)
- [7. RELATED](#7--related)

---

## 1. OVERVIEW

This folder is OpenCode's local-plugin mounting point. Every `.js` file here is auto-loaded once per session and must export a default plugin factory **and nothing else**.

> **Default-export only — load-bearing.** OpenCode treats *every* export of a plugin module as its own plugin and invokes each one. A stray named export (a helper function, a constant, even a test surface) is loaded as a plugin, throws when invoked, and silently drops the **entire file** — including its real default plugin, which then never registers its tools or hooks. Keep the only `export` the `default`; hang any test surface off the default function as a property (e.g. `MyPlugin.__test = {...}`). Helper code, transports, schemas, and bridges live elsewhere so the auto-loader cannot pick up non-plugin modules.

---

## 2. QUICK START

When OpenCode boots, every `.js` file in this folder is invoked once. To add a new plugin:

1. Create the entrypoint here (`my-plugin.js`) with a **default export only** — no named exports (every named export is loaded as its own plugin; see Overview). Attach any test surface as a property on the default function.
2. Co-locate any bridge / transport / schema modules under the owning skill, not here.
3. Smoke-test from both the project root and any symlinked workspace before shipping.

---

## 3. CURRENT ENTRYPOINTS

| File | Role |
|---|---|
| `mk-skill-advisor.js` | Prompt-time Skill Advisor plugin. Surfaces a compact skill recommendation when a user prompt arrives. Routes via `mk-skill-advisor-bridge.mjs`. |
| `mk-code-graph.js` | Transport-backed code-graph context plugin (OpenCode session integration). Routes context requests via `mk-code-graph-bridge.mjs`. The underlying MCP server name stays `mk-code-index` for stable tool-prefix `mcp__mk_code_index__*`. |
| `mk-spec-memory.js` | Prompt-time Spec Kit Memory continuity plugin. Injects a continuity brief via `experimental.chat.system.transform` and exposes `mk_spec_memory_status`. Routes via the spec-kit warm CLI bridge. |
| `mk-goal.js` | The `/goal` plugin. Owns per-session goal state (atomic, hex(sessionID)-keyed, fail-closed), injects the active goal each turn via `experimental.chat.system.transform`, exposes `mk_goal`/`mk_goal_status` tools, accounts usage over the `event()` lifecycle, and (default-off) can drive guarded autonomous continuation. Default-export only; test surface on `MkGoalPlugin.__test`. |
| `mk-deep-loop-guard.js` | Detection-layer `tool.execute.before` plugin for Task-tool dispatches targeting deep-loop sub-agents. Flags (default) or blocks (`MK_DEEP_LOOP_GUARD_REJECT=1`) a Deep Route header whose declared `mode` disagrees with `mode-registry.json`'s entry for the actual `subagent_type` being dispatched. Fails open on registry read errors. |
| `session-cleanup.js` | Session-end MCP cleanup plugin. OpenCode has no JSON SessionEnd hook, so this listens for the `server.instance.disposed` / `global.disposed` dispose lifecycle events and runs `.opencode/scripts/session-cleanup.sh` to reclaim the session's MCP helper descendants. Best-effort and bounded; never blocks teardown. |

---

## 4. BRIDGE MODULES

Helper bridge modules are co-located with their owning skill, not in this folder:

- **mk-skill-advisor** bridge: `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs`
- **mk-code-graph** bridge: `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs`
- **opencode message schema**: `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-opencode-message-schema.mjs`

This keeps plugin entrypoints minimal and lets owning skills own their bridge contracts.

**Naming asymmetry note:** The plugin and bridge are named `mk-code-graph` (matching the `system-code-graph` skill folder). The underlying MCP server name remains `mk-code-index` (tool prefix `mcp__mk_code_index__*`), kept stable to avoid breaking tool consumers.

---

## 5. CONFIGURATION

Both plugins support a **4-tier configuration precedence** (highest to lowest):

1. **Raw plugin options** (passed programmatically at plugin registration)
2. **Config file** (`~/.config/opencode/plugin/<plugin-name>.json`)
3. **Environment variables** (plugin-specific prefix, see tables below)
4. **Defaults** (hardcoded in each plugin)

### 5.1 mk-skill-advisor config

| Config File Path | `~/.config/opencode/plugin/mk-skill-advisor.json` |
|---|---|

| Field | Env Var | Default | Description |
|---|---|---|---|
| `cacheTTLMs` | `MK_SKILL_ADVISOR_CACHE_TTL_MS` | `300000` (5 min) | Advisor cache TTL in ms |
| `thresholdConfidence` | `MK_SKILL_ADVISOR_THRESHOLD_CONFIDENCE` | `0.8` | Minimum advisor confidence |
| `maxTokens` | `MK_SKILL_ADVISOR_MAX_TOKENS` | `80` | Maximum brief tokens |
| `nodeBinaryOverride` | `MK_SKILL_ADVISOR_NODE_BINARY` | `node` (falls back to `SPEC_KIT_PLUGIN_NODE_BINARY`) | Node binary for bridge subprocess |
| `bridgeTimeoutMs` | `MK_SKILL_ADVISOR_BRIDGE_TIMEOUT_MS` | `10000` | Bridge subprocess timeout in ms |
| `maxPromptBytes` | `MK_SKILL_ADVISOR_MAX_PROMPT_BYTES` | `65536` (64 KiB) | Maximum bridge prompt payload bytes |
| `maxBriefChars` | `MK_SKILL_ADVISOR_MAX_BRIEF_CHARS` | `2048` (2 KiB) | Maximum injected brief character count |
| `maxCacheEntries` | `MK_SKILL_ADVISOR_MAX_CACHE_ENTRIES` | `1000` | Maximum advisor cache entries |
| `enabled` | — (use `MK_SKILL_ADVISOR_HOOK_DISABLED=1` / `MK_SKILL_ADVISOR_PLUGIN_DISABLED=1`) | `true` | Plugin enabled state |

Config file fields use the **camelCase** option names shown above. Example:

```json
{
  "cacheTTLMs": 600000,
  "thresholdConfidence": 0.7,
  "maxTokens": 120
}
```

### 5.2 mk-code-graph config

| Config File Path | `~/.config/opencode/plugin/mk-code-graph.json` |
|---|---|

| Field | Env Var | Default | Description |
|---|---|---|---|
| `cacheTtlMs` | `MK_CODE_GRAPH_CACHE_TTL_MS` | `5000` | Transport cache TTL in ms |
| `specFolder` | `MK_CODE_GRAPH_SPEC_FOLDER` | _(auto-detect)_ | Override spec folder |
| `nodeBinary` | `MK_CODE_GRAPH_NODE_BINARY` | `node` (falls back to `SPEC_KIT_PLUGIN_NODE_BINARY`) | Node binary for bridge subprocess |
| `bridgeTimeoutMs` | `MK_CODE_GRAPH_BRIDGE_TIMEOUT_MS` | `15000` | Bridge subprocess timeout in ms |

Example config file:

```json
{
  "cacheTtlMs": 10000,
  "specFolder": "my-feature-foldername"
}
```

### 5.3 Failure Modes

- **No config file**: Behavior is unchanged (env + defaults apply).
- **Malformed config file** (invalid JSON): Silent fall-through — `loadConfig()` returns `{}` and the plugin proceeds with env + defaults.
- All disable env vars (`MK_SKILL_ADVISOR_HOOK_DISABLED=1`, `MK_SKILL_ADVISOR_PLUGIN_DISABLED=1`, legacy `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`, `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED=1`) are **preserved unchanged**.

---

## 6. UPGRADE NOTES

When upgrading OpenCode beyond 1.3.17, rerun the 026/007/009 discovery probe:

1. Inspect the local plugin glob OpenCode uses.
2. Add a temporary no-default-export file in this folder.
3. Confirm the regression guard fails as expected.
4. Remove the temporary file.
5. Smoke `opencode` from both the Public root and the Barter symlinked workspace.

---

## 7. RELATED

- `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/` — advisor bridge home
- `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/` — spec-kit bridge modules
- `.opencode/skills/system-skill-advisor/mcp_server/hooks/` — sibling hook entrypoints (different runtime contract)
