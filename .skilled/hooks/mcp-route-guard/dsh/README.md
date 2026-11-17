---
title: "DSH MCP Route Guard: tools/pre-execute Adapter"
description: "DSH adapter that gates native MCP calls on the shared route-guard core, denies a warn because DSH has no advisory channel, and enforces the Code Mode mount allowlist."
trigger_phrases:
  - "dsh mcp route guard"
  - "dsh code mode allowlist"
  - "dsh tools pre execute"
version: 1.0.0.0
---

# DSH MCP Route Guard: tools/pre-execute Adapter

---

## 1. OVERVIEW

`.skilled/hooks/mcp-route-guard/dsh/` holds the DSH adapter for the MCP route guard. It runs at `tools/pre-execute` and puts every `mcp__*` call through the shared core in `.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs`.

DSH registers the adapter in `.dsh/plugins/repo-guards/index.mjs`. That bundle imports it through the `mcp-route-guard.mjs` link under `.dsh/plugins/repo-guards/adapters/`. Its `apply()` calls `registerMcpRouteGuard(ctx, options.mcpRouteGuard)`. The adapter registers the handler with `ctx.on('tools/pre-execute', ...)`, the event name written in the adapter itself.

`registerMcpRouteGuard` reads the concern switch first. It calls `isHookEnabled('mcp-route-guard')` from `.skilled/hooks/shared/hook-flags.mjs`, which resolves through the shared `hook-flags.cjs`. The concern switch is `MCP_ROUTE_GUARD_DISABLED`. `SYSTEM_HOOKS_DISABLED` is the master switch. When the concern is off, the function returns and registers no handler.

Inside the handler, the adapter reads `exec.name` before it calls the core. A name that is not a string or does not start with `mcp__` goes to `next()` at once.

The adapter adds a mount rule the other runtimes do not have. A `code_mode` tool outside the allowlist is denied. The reason names the tool and the four tools the mount exposes: `call_tool_chain`, `list_tools`, `search_tools` and `tool_info`.

A `warn` verdict from the core becomes `{kind: 'deny', reason}`. The adapter joins the core warnings into the reason, because DSH pre-execute has no advisory channel.

`MCP_ROUTE_GUARD_DISABLED` also silences the mount allowlist. The handler tests `isTruthy(env[core.DISABLED_ENV])` before the allowlist rule runs, so one switch turns off the whole guard.

A throw from the core logs through `ctx.logger.warn` and denies the call with a reason that says it could not evaluate the tool. A logging failure cannot change that decision. The module exports `ERROR_POLICY = 'fail-closed'`.

The adapter resolves the checkout from its own path, four levels above this folder. A DSH session that runs in another directory still reads the checkout's `.utcp_config.json`.

---

## 2. DIRECTORY TREE

The folder is flat. It holds the README and one adapter.

| File | Responsibility |
|---|---|
| `mcp-route-guard.mjs` | The `tools/pre-execute` adapter. It reads the concern switch and evaluates `mcp__*` names on the shared core. It applies the Code Mode allowlist and denies on a warning or a core throw. |

---

## 3. VALIDATION

Run the suite from the repository root.

```bash
node --test .skilled/hooks/mcp-route-guard/tests/dsh-mcp-route-guard.test.mjs
```

Expected result: every test passes. The runner reports `fail 0` and exits 0.

The suite drives this adapter with a stub plugin context. It covers the mount allowlist, the core kill switch, the fail-closed throw policy and the deny-reason parity with the Pi extension.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern README with the policy table and the runtime matrix.
- [`../lib/mcp-route-guard.cjs`](../lib/mcp-route-guard.cjs): the shared core this adapter calls.
- [`../tests/dsh-mcp-route-guard.test.mjs`](../tests/dsh-mcp-route-guard.test.mjs): the suite that drives this adapter.
- [`../../shared/hook-flags.mjs`](../../shared/hook-flags.mjs): the ESM switch resolver the adapter imports.
- [`../../../../.dsh/plugins/repo-guards/index.mjs`](../../../../.dsh/plugins/repo-guards/index.mjs): the bundle that registers the adapter.
