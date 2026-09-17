---
title: "MCP Route Guard: Code Mode Routing Advisory"
description: "Advisory guard that nudges native external MCP tool calls toward Code Mode's call_tool_chain, with one runtime-neutral core and six per-runtime adapters."
trigger_phrases:
  - "mcp route guard"
  - "code mode routing advisory"
  - "call_tool_chain nudge"
---

# MCP Route Guard: Code Mode Routing Advisory

---

## 1. OVERVIEW

`mcp-route-guard/` decides whether a native external MCP tool call (any `mcp__*` / `mcp_*` tool name) should carry a just-in-time advisory that nudges the model toward Code Mode's `call_tool_chain` instead of calling the server directly. Code Mode wraps the same external tools behind one batched entrypoint and cuts the context a raw MCP round-trip would spend, so the guard exists to keep the model on the cheap path without ever forcing it.

The concern is one runtime-neutral policy core plus a thin adapter per runtime. The core makes the decision; each adapter only translates its runtime's event shape into the core's input and delivers the result. Two outcomes exist and no more: `allow` (stay silent) and `warn` (attach the advisory). The guard has no deny path, and the call it comments on always proceeds.

The single most important property is that it **fails open**. A malformed payload, a missing manifest, an unparsable tool name, or any internal error resolves to `allow`, so a bug in the guard can never block a correct or unrelated MCP call.

---

## 2. WHAT IT DOES

The guard runs on every native external MCP call, before the call executes. It parses the tool name into a `(server, tool)` pair, normalizes the server token so a manifest manual name and its live connector spelling collapse onto one family id (`clickup_official` and `claude_ai_ClickUp` both become `clickup`), and then decides:

| Condition | Decision |
|---|---|
| Server is one of our own internal servers (token starts with `system_` or the pre-rename `mk_`, or is `code_mode` / `sequential_thinking`) | `allow`: never nudge Code Mode to wrap its own siblings |
| Server family IS registered in the Code Mode manifest (`.utcp_config.json`) | `warn`: the call is routable, so advise it |
| Server family is NOT in the manifest, default (manifest-strict) mode | `allow`: stay silent so every advisory the operator sees is actionable |
| Server family is NOT in the manifest, broad mode enabled | `warn`: a coverage advisory suggesting the operator register a manual |
| Anything goes wrong | `allow`, fail open |

When the decision is `warn`, it injects exactly this text as model-visible context (delivered per runtime, see Section 3):

```text
mcp-route-guard: native call to "<server>" -- Code Mode can route this family via the "<manual>" manual (call_tool_chain); route through Code Mode for the ~98% context reduction the mcp-code-mode SKILL mandates.
```

The manifest family set is cached by file mtime, so a manifest edit widens coverage on the very next call with no restart and no per-call re-parse.

---

## 3. PER-RUNTIME DELIVERY

Every runtime evaluates the **same** `lib/mcp-route-guard.cjs` core. What differs is the event each runtime fires, the payload shape that event carries, and how the advisory is handed back. The core understands two packed tool-name shapes only: Claude's `mcp__<server>__<tool>` and OpenCode's `<server>_<tool>`. Any runtime whose event does not already present one of those shapes has to reshape its payload before calling the core, which is the main source of per-runtime code.

| Runtime | Adapter | Event / wiring | Payload difference it handles | Delivery |
|---|---|---|---|---|
| **Claude** | `claude/mcp-route-guard.cjs` | `PreToolUse` hook, matcher `mcp__claude_ai_.*` in `.claude/settings.json` | Already packed as `mcp__<server>__<tool>`; parsed straight from stdin JSON | `additionalContext` advisory in the PreToolUse result; never a `permissionDecision` |
| **Codex** | `codex/mcp-route-guard.cjs` | Codex hook entry (installed into `.codex/hooks.json`) | Same packed shape via stdin | Runtime advisory envelope |
| **Devin** | `devin/mcp-route-guard.cjs` | Devin hook entry (`.devin/hooks.v1.json`) | Same packed shape via stdin | Runtime advisory envelope |
| **Cursor** | `cursor/mcp-route-guard.mjs` | `beforeMCPExecution` event | Payload splits server and tool into SEPARATE fields (`mcp_server_name` + a bare `tool_name`); a bare tool name matches nothing, so the adapter recombines them into the packed shape first | Recombines, then `spawnSync`s the Claude adapter so the two runtimes cannot drift |
| **Pi** | `pi/mcp-route-guard.ts` | `tool_call` event, discovered via `.pi/extensions/` | Filters on the `mcp_` prefix, then dynamic-imports the core | Attaches the core's warnings to the tool call |
| **OpenCode** | `.opencode/plugins/mcp-route-guard.js` | Plugin, loaded by OpenCode's flat glob over `.opencode/plugins/` | Native OpenCode plugin API | Plugin advisory |

The three CommonJS adapters (`claude`, `codex`, `devin`) share one stdin parser, `../../shared/hook-adapter-shared.cjs`, which collects raw stdin and fail-open-parses the JSON. Cursor deliberately does not reimplement the decision: it reshapes its payload and shells out to the Claude adapter, so a future change to the advisory logic lands in both without a second edit.

Two runtimes are mirrored rather than hosted here. OpenCode's real plugin cannot live in this tree because its loader globs `.opencode/plugins/` by a flat pattern, so `opencode/mcp-route-guard.js` is a browsability-only symlink back into that folder and nothing loads through it. Pi loads in the other direction: the real `pi/mcp-route-guard.ts` lives here, and `.pi/extensions/mcp-route-guard.ts` is the symlink Pi discovers.

---

## 4. DIRECTORY TREE

```text
mcp-route-guard/
+-- lib/
|   +-- mcp-route-guard.cjs        # runtime-neutral policy core (parse, normalize, decide)
|   `-- mcp-route-guard.test.cjs   # node --test suite for the core
+-- claude/   mcp-route-guard.cjs  # PreToolUse adapter
+-- codex/    mcp-route-guard.cjs  # Codex hook adapter
+-- devin/    mcp-route-guard.cjs  # Devin hook adapter
+-- cursor/   mcp-route-guard.mjs  # beforeMCPExecution adapter (recombines + spawnSync)
+-- pi/       mcp-route-guard.ts   # Pi tool_call extension (symlinked from .pi/extensions/)
`-- opencode/ mcp-route-guard.js   # browsability symlink -> ../../../plugins/mcp-route-guard.js
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lib/mcp-route-guard.cjs` | The entire policy: tool-name parsing for both shapes, server-token normalization, internal-server exemption, mtime-cached manifest family set, and the `allow` / `warn` decision. Imports Node builtins only. |
| `claude/mcp-route-guard.cjs` | Claude `PreToolUse` adapter. Reads the matched payload, evaluates the core, emits an `additionalContext` advisory on a `warn`. Never emits a permission decision. |
| `codex/mcp-route-guard.cjs`, `devin/mcp-route-guard.cjs` | Codex and Devin hook adapters over the same packed shape and shared stdin parser. |
| `cursor/mcp-route-guard.mjs` | Cursor `beforeMCPExecution` adapter. Recombines the split server/tool fields into the packed shape, then `spawnSync`s the Claude adapter. |
| `pi/mcp-route-guard.ts` | Pi `tool_call` extension. Prefix-filters, honors the kill-switch, dynamic-imports the core. |

`.opencode/plugins/mcp-route-guard.js` is the OpenCode adapter; it imports this same `lib/` core.

---

## 6. CONFIGURATION

The guard is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive).

| Variable | Effect |
|---|---|
| `MCP_ROUTE_GUARD_DISABLED=1` | Full no-op on every call, in every runtime. The core short-circuits to `allow` and each adapter checks the shared resolver. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |
| `MCP_ROUTE_GUARD_BROAD_MODE=1` | Opt-in. Also advise on external servers the manifest cannot route yet, so the operator is nudged to register a manual. Off by default so every advisory stays actionable. |

Set a flag inline for one command, export it for a session, or persist it in `.opencode/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file, so a persisted default can be overridden for a single session.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | The core imports Node builtins only. Adapters import their concern's `../lib/` and, for the CommonJS ones, `../../shared/hook-adapter-shared.cjs`. No adapter imports anything outside this tree. |
| Decisions | `allow` or `warn` only. Advisory by contract; it can never block or deny an MCP call. |
| Failure | Fails open. Malformed stdin, a missing or oversized manifest, an unparsable tool name, or any internal error resolves to `allow`. |
| Output | The core never writes stdout or stderr. Each adapter owns its own transport and logging. |

---

## 8. VALIDATION

```bash
node --test .opencode/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs
```

Expected result: all tests pass.

```bash
node -e "import('./.opencode/plugins/mcp-route-guard.js').then(()=>console.log('ok'))"
```

Expected result: `ok`, with no module-resolution error (confirms the OpenCode adapter still resolves this core).

---

## 9. RELATED

- [`../README.md`](../README.md): the unified hooks tree this concern lives in, with the full kill-switch index and coverage matrix.
- [`../injection-contract.md`](../injection-contract.md): the advisory's exact injected text and its visibility to the operator.
- [`../shared/README.md`](../shared/README.md): the shared stdin parser and kill-switch resolver the adapters use.
- [`../../skills/mcp-code-mode/SKILL.md`](../../skills/mcp-code-mode/SKILL.md): the Code Mode workflow this guard routes toward.
