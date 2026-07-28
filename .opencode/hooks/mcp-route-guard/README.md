---
title: "MCP Route Guard: Code Mode Routing Advisory"
description: "Advisory guard nudging native external MCP tool calls toward Code Mode's call_tool_chain, with adapters for Claude, Cursor, Devin and Codex."
trigger_phrases:
  - "mcp route guard"
  - "code mode routing advisory"
---

# MCP Route Guard: Code Mode Routing Advisory

---

## 1. OVERVIEW

`mcp-route-guard/` decides whether a native external MCP tool call (an `mcp__*` tool name) should carry a just-in-time advisory nudging the model toward Code Mode's `call_tool_chain` instead. The core parses either runtime's tool-name shape, normalizes the server token so manifest and connector spellings collide onto one family id, exempts internal `mk_` servers, and consults an mtime-cached manifest of Code-Mode-capable families.

Only two decisions exist: `allow` (silent) and `warn` (attach the advisory). The guard never denies a call and never writes stdout/stderr from the core.

---

## 2. DIRECTORY TREE

```text
mcp-route-guard/
+-- lib/
|   +-- mcp-route-guard.cjs        # runtime-neutral policy core
|   `-- mcp-route-guard.test.cjs   # node --test
+-- claude/   mcp-route-guard.cjs
+-- codex/    mcp-route-guard.cjs
+-- devin/    mcp-route-guard.cjs
`-- cursor/   mcp-route-guard.mjs
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `lib/mcp-route-guard.cjs` | The whole policy: tool-name parsing, server-token normalization, `mk_` exemption, manifest cache, allow/warn decision. |
| `{claude,codex,devin}/mcp-route-guard.cjs` | PreToolUse (`mcp__.*` matcher) adapters. Parse stdin via `../../shared/hook-adapter-shared.cjs`, call the core, emit the runtime's advisory envelope. |
| `cursor/mcp-route-guard.mjs` | `beforeMCPExecution` adapter. Normalizes Cursor's split server/tool payload, then `spawnSync`s the Claude adapter so the two runtimes cannot drift. |

OpenCode reaches the same core through `.opencode/plugins/mk-mcp-route-guard.js`; Pi through `.pi/extensions/mcp-route-guard.ts`.

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | The core imports Node builtins only. Adapters import `../lib/` and (CommonJS ones) `../../shared/hook-adapter-shared.cjs` — nothing outside this tree. |
| Decisions | `allow` or `warn` only. This guard is advisory by contract; it can never block an MCP call. |
| Failure | Fails open: malformed stdin, a missing manifest, or any internal error resolves to `allow`. |

---

## 5. VALIDATION

```bash
node --test .opencode/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs
```

Expected result: all tests pass.

---

## 6. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in.
- [`../../skills/system-spec-kit/references/hooks/injection-contract.md`](../../skills/system-spec-kit/references/hooks/injection-contract.md): the advisory's exact injected text and visibility.
- [`../../skills/mcp-code-mode/SKILL.md`](../../skills/mcp-code-mode/SKILL.md): the Code Mode workflow this guard routes toward.
