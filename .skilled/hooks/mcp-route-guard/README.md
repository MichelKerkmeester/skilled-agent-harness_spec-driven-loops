---
title: "MCP Route Guard: Code Mode Routing Advisory"
description: "Decides whether a native external MCP tool call should carry a Code Mode routing advisory, with one runtime-neutral core and one adapter per runtime."
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

`mcp-route-guard/` decides whether a native external MCP tool call should carry a routing advisory. A native call is any tool named `mcp__*` or `mcp_*`. The advisory nudges the model toward Code Mode's `call_tool_chain` instead of calling the server directly.

Code Mode wraps the same external tools behind one batched entrypoint. It cuts the context that a raw MCP round-trip would otherwise spend. The guard exists to keep the model on that cheap path.

The concern is one runtime-neutral policy core plus a thin adapter per runtime. The core makes the decision. Each adapter translates its runtime's event shape and delivers the result. The core returns `allow` or `warn` and nothing stronger.

The core fails open. A malformed payload, a missing or oversized manifest, an unparsable tool name or any internal error resolves to `allow`. Two adapters add a deny of their own, and Section 3 names both.

---

## 2. HOW IT WORKS

The guard runs before a native external MCP call executes. It parses the tool name into a `(server, tool)` pair. Then it normalizes the server token, so a manifest manual name and its live connector spelling collapse onto one family id. `clickup_official` and `claude_ai_ClickUp` both become `clickup`.

| Condition | Decision |
|---|---|
| The token starts with `system_` or `mk_`, or is `code_mode` or `sequential_thinking` | `allow`: never nudge Code Mode to wrap its own siblings |
| The server family is registered in the Code Mode manifest, `.utcp_config.json` | `warn`: the call is routable, so advise it |
| The family is absent from the manifest, in the default manifest-strict mode | `allow`: stay silent so every advisory stays useful |
| The family is absent from the manifest, with broad mode on | `warn`: a coverage advisory asking the operator to register a manual |
| Anything goes wrong | `allow`, fail open |

A `warn` carries one of two texts. A routable family gets this one:

```text
mcp-route-guard: native call to "<server>" -- Code Mode can route this family via the "<manual>" manual (call_tool_chain); route through Code Mode for the ~98% context reduction the mcp-code-mode SKILL mandates.
```

An unrouteable family in broad mode gets this one:

```text
mcp-route-guard: native call to "<server>" (family "<family>") -- no Code Mode manual registers this family in .utcp_config.json yet; register one to make this call routable.
```

The manifest family set is cached by file mtime. A manifest edit widens coverage on the very next call, with no restart and no per-call re-parse.

The core understands two packed tool-name shapes only. Claude packs `mcp__<server>__<tool>`. OpenCode packs `<server>_<tool>`. A runtime whose event presents neither shape reshapes its payload before the core sees it.

Four adapters read stdin through `../../shared/hook-adapter-shared.cjs`, and each requires it by that path. It collects raw stdin and parses the JSON fail-open. Every adapter except Cursor imports the core from `../lib/`, and Cursor reaches it through the Claude adapter. The core itself imports Node builtins and the shared truthiness helper only.

In Claude, Codex and Devin, invalid stdin, a missing payload or a thrown error exits 0 with no output. In Pi, a failed import or a core error returns `undefined`, so the call proceeds.

Two adapters can refuse a call. DSH turns a `warn` into a deny, because its pre-execute event has no advisory channel. Vibe turns a `warn` into a deny too, under a `strict` hook. Every other adapter only attaches or logs the advisory.

The core never writes stdout or stderr. Each adapter owns its own transport and its own logging.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `PreToolUse` | `claude/mcp-route-guard.cjs` | `.skilled/hooks/mcp-route-guard/claude/mcp-route-guard.cjs` | An `additionalContext` advisory, never a `permissionDecision`. |
| Codex | `PreToolUse` | `codex/mcp-route-guard.cjs` | `.skilled/hooks/mcp-route-guard/codex/mcp-route-guard.cjs` | The same `additionalContext` envelope. |
| Devin | `PreToolUse` | `devin/mcp-route-guard.cjs` | `.skilled/hooks/mcp-route-guard/devin/mcp-route-guard.cjs` | The same `additionalContext` envelope. |
| Cursor | `beforeMCPExecution` | `cursor/mcp-route-guard.mjs` | `.skilled/hooks/mcp-route-guard/cursor/mcp-route-guard.mjs` | `permission: "allow"`, with the advisory as `agent_message`. |
| Pi | `tool_call` | `pi/mcp-route-guard.ts` | `.skilled/hooks/mcp-route-guard/pi/mcp-route-guard.ts` | The advisory as the tool call's `reason`. |
| DSH | `tools/pre-execute` | `dsh/mcp-route-guard.mjs` | `.skilled/hooks/mcp-route-guard/dsh/mcp-route-guard.mjs` | A deny, with the advisory as the reason. |
| OpenCode | `tool.execute.before` | `opencode/mcp-route-guard.js` | `.opencode/plugins/mcp-route-guard.js` | One line in `mcp-route-guard.log`, never console output. |
| Vibe | `pre_tool` | None | `.vibe/plugins/repo-guards/mcp-route-guard.mjs` | A deny, with the advisory as the reason. |

Claude registers `PreToolUse` with the matcher `mcp__claude_ai_.*` in `.claude/settings.json`, at a 5-second timeout. Codex registers `PreToolUse` with the matcher `mcp__.*` in `.codex/hooks.json`, at 5 seconds. Devin registers `PreToolUse` with the matcher `^mcp__.*$` in `.devin/hooks.v1.json`, at 5 seconds. Cursor registers `beforeMCPExecution` with no matcher and a 10-second timeout.

Codex stays silent today, because its only MCP server, `code_mode`, is exempt.

Cursor's payload splits the server and the tool into separate fields. `mcp_server_name` holds the server and `tool_name` holds a bare tool name. A bare tool name matches nothing, so the adapter recombines both into the packed shape. It then `spawnSync`s the Claude adapter, which owns the advisory text.

The adapter takes `workspace_roots[0]` as the project folder and gives the child 3000 ms and a 1 MB buffer. Invalid JSON, a spawn failure, a timeout or non-JSON child output returns a plain `permission: allow`.

Pi filters on the `mcp_` prefix, then dynamic-imports the core. `.pi/extensions/mcp-route-guard.ts` is the one-line entry file Pi discovers, and it re-exports `pi/mcp-route-guard.ts`.

DSH registers `tools/pre-execute` through `.dsh/plugins/repo-guards/index.mjs`. `.dsh/plugins/repo-guards/adapters/mcp-route-guard.mjs` is a symlink to `dsh/mcp-route-guard.mjs`. DSH also denies a `code_mode` tool outside its allowlist of `call_tool_chain`, `list_tools`, `search_tools` and `tool_info`. It fails closed. A core failure logs a warning and denies the call, with a reason naming the tool. `MCP_ROUTE_GUARD_DISABLED` turns off the allowlist rule too.

Vibe registers the hook in `.vibe/hooks.toml` as `mcp-route-guard`, of type `pre_tool`, with `strict = true`. Vibe names an MCP call by its route, as `mcp_<server>.<tool>`. The hook repacks that into `mcp__<server>__<tool>` before the core judges it. It strips the core's own label from the reason, because Vibe prefixes the hook name. A thrown error allows the call and writes to stderr.

OpenCode loads the plugin by its flat glob over `.opencode/plugins/`. `opencode/mcp-route-guard.js` is a browsability symlink back into that folder, and nothing loads through it. The plugin appends to `mcp-route-guard.log` under the source root's `logs/` folder. It rotates that log to `.1` once the file passes 256 KB. It never writes to stdout or stderr, because OpenCode paints plugin output onto the prompt line.

---

## 4. DIRECTORY TREE

```text
mcp-route-guard/
+-- lib/
|   +-- mcp-route-guard.cjs        # runtime-neutral policy core
|   `-- mcp-route-guard.test.cjs   # node --test suite for the core
+-- claude/   mcp-route-guard.cjs  # PreToolUse adapter
+-- codex/    mcp-route-guard.cjs  # PreToolUse adapter
+-- devin/    mcp-route-guard.cjs  # PreToolUse adapter
+-- cursor/   mcp-route-guard.mjs  # beforeMCPExecution adapter
+-- pi/       mcp-route-guard.ts   # tool_call extension
+-- dsh/      mcp-route-guard.mjs  # tools/pre-execute adapter
+-- opencode/ mcp-route-guard.js   # browsability symlink -> .opencode/plugins/mcp-route-guard.js
`-- tests/    dsh-mcp-route-guard.test.mjs  # node --test suite for the DSH adapter
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lib/mcp-route-guard.cjs` | The whole policy: parsing for both shapes, server-token normalization, the internal-server exemption, the mtime-cached manifest family set and the `allow` / `warn` decision. |
| `claude/mcp-route-guard.cjs` | The Claude `PreToolUse` adapter. It reads the payload, evaluates the core and emits an `additionalContext` advisory on a `warn`. |
| `codex/mcp-route-guard.cjs` | The Codex `PreToolUse` adapter over the same packed shape and the shared stdin parser. |
| `devin/mcp-route-guard.cjs` | The Devin `PreToolUse` adapter. It treats a whitespace-only `cwd` as absent. |
| `cursor/mcp-route-guard.mjs` | The Cursor `beforeMCPExecution` adapter. It recombines the split fields, then `spawnSync`s the Claude adapter. |
| `pi/mcp-route-guard.ts` | The Pi `tool_call` extension. It prefix-filters, honors the kill-switch and dynamic-imports the core. |
| `dsh/mcp-route-guard.mjs` | The DSH `tools/pre-execute` adapter. It denies on a `warn`, on a core failure and on a `code_mode` tool outside the allowlist. |
| `lib/mcp-route-guard.test.cjs` | The `node --test` suite for the core and for the Claude and Cursor adapters. |
| `tests/dsh-mcp-route-guard.test.mjs` | The `node --test` suite for the DSH adapter. |

`.opencode/plugins/mcp-route-guard.js` is the OpenCode adapter, and it imports this same `lib/` core.

---

## 6. CONFIGURATION

The guard is on by default. A switch is on when its value is `1`, `true`, `yes` or `on`, in any case.

| Variable | Effect |
|---|---|
| `MCP_ROUTE_GUARD_DISABLED=1` | A full no-op on every call, in every runtime. The core short-circuits to `allow` and each adapter checks the shared resolver. |
| `SYSTEM_HOOKS_DISABLED=1` | The master switch. It turns off this concern along with every other repository hook. |
| `MCP_ROUTE_GUARD_BROAD_MODE=1` | Opt-in. It also advises on external servers the manifest cannot route yet. |

Broad mode reads only the exact value `1`, so `true` does not enable it.

Set a switch inline for one command or export it for a session. The off switches can be persisted in `.skilled/hooks/hook-flags.env`, but broad mode is read only from the environment. That file is a gitignored copy of `hook-flags.env.example`. The environment always wins over the file.

---

## 7. VALIDATION

```bash
node --test .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs
```

Expected result: all tests pass.

```bash
node --test .skilled/hooks/mcp-route-guard/tests/dsh-mcp-route-guard.test.mjs
```

Expected result: all tests pass.

```bash
node -e "import('./.opencode/plugins/mcp-route-guard.js').then(()=>console.log('ok'))"
```

Expected result: `ok`, with no module-resolution error, which confirms the OpenCode adapter still resolves this core.

---

## 8. RELATED

- [`../README.md`](../README.md): the hooks tree, with the switch index and the coverage matrix.
- [`../injection-contract.md`](../injection-contract.md): the advisory's exact injected text and its visibility to the operator.
- [`../shared/README.md`](../shared/README.md): the shared stdin parser and the switch resolver the adapters use.
- [`../../skills/mcp-code-mode/SKILL.md`](../../skills/mcp-code-mode/SKILL.md): the Code Mode workflow this guard routes toward.
