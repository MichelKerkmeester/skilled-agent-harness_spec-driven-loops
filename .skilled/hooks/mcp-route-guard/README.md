---
title: "MCP Route Guard: Code Mode Routing Advisory"
description: "Checks native MCP calls against the Code Mode manifest and reports route warnings, with DSH and Vibe denying warned calls."
trigger_phrases:
  - "mcp route guard"
  - "code mode routing advisory"
  - "call_tool_chain nudge"
  - "opencode mcp route guard"
  - "opencode routing advisory"
  - "opencode plugin link"
importance_tier: "normal"
contextType: "reference"
---

# MCP Route Guard: Code Mode Routing Advisory

---

## 1. OVERVIEW

`mcp-route-guard/` checks native MCP tool names against the manuals in `.utcp_config.json`. A matching family produces a route warning that points to `call_tool_chain`. DSH and Vibe return that warning as a denial reason.

The shared policy core lives in `lib/mcp-route-guard.cjs`. Cursor packs its split server and tool fields, then runs the Claude adapter to reach that core.

The concern key is `mcp-route-guard`. Set `MCP_ROUTE_GUARD_DISABLED=1` to turn it off. `SYSTEM_HOOKS_DISABLED=1` turns off every repository hook except the sk-git message gate, which has no off switch.

---

## 2. HOW IT WORKS

`evaluateNativeMcpCall` parses `mcp__<server>__<tool>` names and OpenCode's `<server>_<tool>` names. `normalizeServerToken` maps a connector spelling to a manifest family. `loadManifestFamilies` reads `manual_call_templates` from `.utcp_config.json`.

`isInternalServerToken` exempts names that start with `system_` or `mk_` and the exact names `code_mode` and `sequential_thinking`.

| Condition | Decision |
|---|---|
| A parsed external family has a manifest manual | `warn` |
| A parsed external family has no manual in default mode | `allow` |
| A parsed external family has no manual and broad mode is exactly `1` | `warn` |
| The server name is internal | `allow` |
| The name cannot be parsed or the core catches an unexpected error | `allow` |

Manifest-strict mode is the default. Set `MCP_ROUTE_GUARD_BROAD_MODE=1` to warn on parsed families that have no manifest manual.

DSH adds a mount rule. While the guard is enabled, it denies `code_mode` calls outside `call_tool_chain`, `list_tools`, `search_tools` and `tool_info`.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `PreToolUse` | `claude/mcp-route-guard.cjs` | `.skilled/hooks/mcp-route-guard/claude/mcp-route-guard.cjs` | `additionalContext` warning. |
| Codex | `PreToolUse` | `codex/mcp-route-guard.cjs` | `.skilled/hooks/mcp-route-guard/codex/mcp-route-guard.cjs` | `additionalContext` warning. |
| Cursor | `beforeMCPExecution` | `cursor/mcp-route-guard.mjs` | `.skilled/hooks/mcp-route-guard/cursor/mcp-route-guard.mjs` | `permission: allow` with a warning in `agent_message`. |
| Devin | `PreToolUse` | `devin/mcp-route-guard.cjs` | `.skilled/hooks/mcp-route-guard/devin/mcp-route-guard.cjs` | `additionalContext` warning. |
| OpenCode | `tool.execute.before` | `opencode/mcp-route-guard.js` | `.opencode/plugins/mcp-route-guard.js` | Warnings and errors go to a log. |
| Pi | `tool_call` | `pi/mcp-route-guard.ts` | `.skilled/hooks/mcp-route-guard/pi/mcp-route-guard.ts` | A warning in the tool call's `reason`. |
| DSH | `tools/pre-execute` | `dsh/mcp-route-guard.mjs` | `.skilled/hooks/mcp-route-guard/dsh/mcp-route-guard.mjs` | Denies a warning or a core error. |
| Vibe | `pre_tool` | `vibe/mcp-route-guard.mjs` | `.vibe/plugins/repo-guards/mcp-route-guard.mjs` | Denies a warning. |

- Claude registers `PreToolUse` in `.claude/settings.json` with matcher `mcp__claude_ai_.*` and a 5-second timeout.
- Codex registers `PreToolUse` in `.codex/hooks.json` with matcher `mcp__.*` and a 5-second timeout.
- Cursor registers `beforeMCPExecution` in `.cursor/hooks.json` with no matcher and a 10-second timeout.
- Devin registers `PreToolUse` in `.devin/hooks.v1.json` with matcher `^mcp__.*$` and a 5-second timeout.
- OpenCode loads `.opencode/plugins/mcp-route-guard.js` from the `.opencode/plugins/*.js` glob. The plugin registers `tool.execute.before`.
- Pi discovers `.pi/extensions/mcp-route-guard.ts`. That entry re-exports `pi/mcp-route-guard.ts`, which registers `tool_call`.
- DSH loads the guard bundle from `.dsh/plugins/repo-guards/index.mjs`. The bundle imports `.dsh/plugins/repo-guards/adapters/mcp-route-guard.mjs`, a link to `dsh/mcp-route-guard.mjs`, which registers `tools/pre-execute`.
- Vibe registers `mcp-route-guard` in `.vibe/hooks.toml` as a strict `pre_tool` hook. It runs `.vibe/plugins/repo-guards/mcp-route-guard.mjs`.

Claude and Codex exit 0 with no output when the input is invalid or the core returns no warning. Devin follows the same path. Cursor returns `permission: allow` without an `agent_message` when the child returns no warning. Pi returns `undefined` when it has no warning or catches an error. OpenCode writes warnings and evaluation errors to its log and prints nothing to stdout or stderr. DSH logs a core error and denies the call. Vibe writes caught errors to stderr and exits 0, which lets the call proceed.

---

## 4. DIRECTORY TREE

```text
mcp-route-guard/
├── README.md
├── lib/
│   ├── mcp-route-guard.cjs
│   └── mcp-route-guard.test.cjs
├── claude/mcp-route-guard.cjs
├── codex/mcp-route-guard.cjs
├── cursor/mcp-route-guard.mjs
├── devin/mcp-route-guard.cjs
├── dsh/mcp-route-guard.mjs
├── opencode/mcp-route-guard.js -> ../../../../.opencode/plugins/mcp-route-guard.js
├── pi/mcp-route-guard.ts
├── tests/dsh-mcp-route-guard.test.mjs
└── vibe/mcp-route-guard.mjs -> ../../../../.vibe/plugins/repo-guards/mcp-route-guard.mjs
```

Claude, Codex, Cursor, Devin, DSH and Pi each have a short adapter README in their folder. OpenCode and Vibe have mirror links instead.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lib/mcp-route-guard.cjs` | The shared policy core and its exported helpers. |
| `.utcp_config.json` | The manifest names the core matches. |
| `.skilled/hooks/shared/hook-flags.cjs` | Resolves the concern and master switches. |
| `.skilled/hooks/shared/hook-adapter-shared.cjs` | Reads stdin for Claude, Codex, Devin and Cursor. Its fail-open JSON parser serves Claude, Codex and Devin. Cursor parses the input itself. |
| `lib/mcp-route-guard.test.cjs` | Checks core decisions and the Claude and Cursor adapters. |
| `tests/dsh-mcp-route-guard.test.mjs` | Checks the DSH allowlist and deny behavior. |

---

## 6. CONFIGURATION

The guard is on by default. The shared switch resolver treats `1`, `true`, `yes` or `on` as enabled values, without regard to case.

| Switch | Effect |
|---|---|
| `MCP_ROUTE_GUARD_DISABLED=1` | Turns off this guard, including the DSH mount rule. |
| `SYSTEM_HOOKS_DISABLED=1` | Turns off every repository hook except the sk-git message gate. |
| `MCP_ROUTE_GUARD_BROAD_MODE=1` | Warns on parsed server families with no manifest manual. |

Set disable flags in the process environment or `.skilled/hooks/hook-flags.env`. The process environment wins over that file. Broad mode reads only the process environment and turns on only for the exact value `1`.

---

## 7. VALIDATION

Run the commands from the repository root.

```bash
bun .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs
```

Expected output: `[mcp-route-guard] 18/18 assertions passed` and exit status 0.

```bash
TMPDIR=/private/tmp deno test --no-remote --no-check --allow-read=.,/private/tmp --allow-write=/private/tmp --allow-env --allow-sys .skilled/hooks/mcp-route-guard/tests/dsh-mcp-route-guard.test.mjs
```

Expected output: `ok | 6 passed | 0 failed` and exit status 0.

```bash
MCP_ROUTE_GUARD_DISABLED=1 bun .skilled/hooks/mcp-route-guard/claude/mcp-route-guard.cjs < /dev/null
```

Expected output: no stdout or stderr and exit status 0.

---

## 8. RELATED

- [Hooks tree](../README.md): the hook concerns and runtime coverage matrix.
- [Shared helpers](../shared/README.md): the switch resolver and stdin helpers.
