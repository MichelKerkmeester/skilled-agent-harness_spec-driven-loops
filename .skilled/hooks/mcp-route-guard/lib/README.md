---
title: "MCP Route Guard Library: Shared Policy Core"
description: "Runtime-neutral core that parses a native MCP tool name, normalizes the server family, exempts internal servers and decides allow or warn from the Code Mode manifest."
trigger_phrases:
  - "mcp route guard core"
  - "utcp manifest families"
  - "mcp route decision"
version: 1.0.0.0
---

# MCP Route Guard Library: Shared Policy Core

---

## 1. OVERVIEW

`lib/` holds the runtime-neutral policy for the MCP route guard. Each runtime adapter reaches `evaluateNativeMcpCall()` in `mcp-route-guard.cjs` for one native MCP tool call, directly or through the Claude adapter. The core answers with `allow` or `warn`. It never prints, so each adapter carries its own transport and writes its own output.

The core fails open. A family with a manual in `.utcp_config.json` gets `warn` and an advisory that names the manual. A name the core cannot classify gets `allow`. So does an unexpected error inside the core.

A manifest the core cannot read leaves the family set empty, and a file larger than 1 MiB counts as unreadable. In the default mode an external family then gets `allow`, so a broken manifest cannot block a call. Broad mode is the exception. It warns on a parsed external family that no manual names.

---

## 2. ARCHITECTURE

Adapters sit above the core. They hand it a tool name and the context it needs: a project directory and an environment object.

```text
╭──────────────────────────────────────────────────────────────────╮
│                      mcp-route-guard/lib/                        │
╰──────────────────────────────────────────────────────────────────╯

┌───────────────────────┐         ┌───────────────────────────────┐
│ Runtime adapters      │ ──────▶ │ evaluateNativeMcpCall()       │
│ one per runtime       │         │ mcp-route-guard.cjs           │
└───────────────────────┘         └───────────────┬───────────────┘
                                                  │ reads
                                                  ▼
                                  ┌───────────────────────────────┐
                                  │ .utcp_config.json             │
                                  │ manual_call_templates[].name  │
                                  └───────────────────────────────┘
```

The dependency runs one way. Adapters call `lib/`, and nothing here imports an adapter or a runtime SDK. The core loads two Node builtins, `node:fs` and `node:path`. Its one project import is `isTruthy` from [the shared switch resolver](../../shared/hook-flags.cjs).

The family set comes from the manifest. It is cached per manifest path, and a changed mtime forces one re-read. An edited manifest therefore widens coverage on the next call, and an unchanged file is not parsed again.

Claude, Codex, Devin, DSH, Pi, OpenCode and Vibe load the core directly. Cursor reaches it through the Claude adapter. [The concern README](../README.md) lists the entry file for each runtime.

---

## 3. FILES

| File | Responsibility |
|---|---|
| `mcp-route-guard.cjs` | The policy core. It parses a tool name, normalizes the server family, exempts internal names and returns the decision. |
| `mcp-route-guard.test.cjs` | The suite for the core and for the Claude and Cursor adapters. |

`mcp-route-guard.cjs` exports `evaluateNativeMcpCall()` and the helpers behind it: `normalizeServerToken()`, `isInternalServerToken()`, `parseClaudeShape()`, `parseOpenCodeShape()`, `resolveManifestPath()` and `loadManifestFamilies()`. It also exports four constants: `MANIFEST_RELATIVE_PATH`, `DISABLED_ENV`, `BROAD_MODE_ENV` and `INTERNAL_RAW_TOKENS`.

`mcp-route-guard.test.cjs` drives the core decisions from a table of tool names. It covers the normalization bridge, the internal exemption, the fail-open paths, the manifest cache and the two switches. Integration cases spawn the Claude and Cursor adapters and assert what each prints.

The cache holds one entry per manifest path, so one process can judge calls for more than one project. A failed stat drops that path's entry. A read or parse failure and an oversized file each store an empty family set, which keeps the next call from paying for the same failure.

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Two Node builtins and the shared `isTruthy` helper. No adapter and no runtime SDK. |
| Exports | `evaluateNativeMcpCall()` plus the helpers and constants listed under FILES. |
| Ownership | The decision and the advisory text. Transport and output belong to each adapter. |
| State | One manifest family cache per process, keyed by manifest path and refreshed when the file mtime moves. |

### Main flow

```text
1. Return allow when MCP_ROUTE_GUARD_DISABLED is on, or when the tool name is empty or not a string.
2. Resolve .utcp_config.json under projectDir, or under the process working directory, and load its family set.
3. Parse the mcp__<server>__<tool> shape, then the <server>_<tool> shape.
4. Normalize the server token and return allow for an internal name.
5. Return warn when the family has a manual, or when broad mode is on and the family is external. Otherwise return allow.
6. Return allow from the catch block, so an unexpected error never blocks a call.
```

### Switches

Two environment values change the answer. `MCP_ROUTE_GUARD_DISABLED` accepts `1`, `true`, `yes` or `on` in any case, and it returns `allow` for every call. `MCP_ROUTE_GUARD_BROAD_MODE` turns on only for the exact value `1`, and it warns on a parsed external family with no manual. The core reads both from the environment object in the request. With no `env` field it reads `process.env`.

The core reads `MCP_ROUTE_GUARD_DISABLED` itself, so a direct caller cannot bypass the switch. The adapters also gate on the same key through the shared resolver before they reach this file.

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `evaluateNativeMcpCall()` | Function | Returns `allow` or `warn` for one native MCP tool call, with the advisory in `warnings`. |
| `normalizeServerToken()` | Function | Maps a connector or manifest spelling to one family id, or to an empty string. |
| `resolveManifestPath()` | Function | Joins `projectDir`, or the current process directory, with `.utcp_config.json`. |
| `loadManifestFamilies()` | Function | Returns the cached family map for a manifest path. |
| `mcp-route-guard.cjs` | Module | The module the adapters load, directly or through the Claude adapter. |

Normalization lowercases the token and turns hyphens into underscores. It then strips a leading `claude_ai_` and the trailing `_official` or `_<number>` markers. That bridge is what lets a connector spelling and a manifest spelling land on the same family.

An internal name is one that starts with `system_` or `mk_`, or one that matches the fixed names `code_mode` and `sequential_thinking`. The core returns `allow` for those names, so its own servers never draw a routing nudge.

---

## 6. VALIDATION

Run from the repository root.

```bash
node .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs
```

Expected output: `[mcp-route-guard] 18/18 assertions passed` and exit status 0.

The suite builds each manifest in a temporary folder and removes it when the run ends. It strips `*_DISABLED` names from the environment and points `HOOK_FLAGS_CONFIG` at a file that does not exist, so a switch saved on your machine cannot hide a result.

---

## 7. RELATED

- [the concern README](../README.md): the policy table and the runtime coverage.
- [the Claude adapter](../claude/mcp-route-guard.cjs): the `PreToolUse` entry that imports this core, and the file Cursor spawns.
- [the Cursor adapter](../cursor/mcp-route-guard.mjs): the `beforeMCPExecution` entry that packs a name and runs the Claude adapter.
- [the hooks tree](../../README.md): the switch index and the coverage matrix.
