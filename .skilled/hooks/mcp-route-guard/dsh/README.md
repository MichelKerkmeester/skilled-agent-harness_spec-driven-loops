---
title: "MCP Route Guard: DSH tools/pre-execute Adapter"
description: "DSH adapter that gates native MCP calls on the shared route-guard core, denies a warn because DSH has no advisory channel, and enforces the Code Mode mount allowlist."
trigger_phrases:
  - "dsh mcp route guard"
  - "dsh code mode allowlist"
  - "dsh tools pre execute"
version: 1.0.0.0
---

# MCP Route Guard: DSH tools/pre-execute Adapter

---

## 1. OVERVIEW

`dsh/` holds the DSH adapter for the MCP route guard. DSH loads it through `.dsh/plugins/repo-guards/adapters/mcp-route-guard.mjs`, a relative link to this file. The bundle calls `registerMcpRouteGuard`, which registers the handler on `tools/pre-execute`.

The adapter applies the shared core to every `mcp__*` call. It adds a mount rule the other runtimes do not have. The `code_mode` server exposes only `call_tool_chain`, `list_tools`, `search_tools` and `tool_info`.

A warn from the core becomes a deny reason, because DSH has no advisory channel. The adapter fails closed. A core throw logs a warning and denies the call.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `mcp-route-guard.mjs` | Registers the `tools/pre-execute` handler and applies the core plus the mount allowlist. |

`registerMcpRouteGuard` returns at once when the `mcp-route-guard` concern is off, so no handler is registered. A call whose name is not a string or does not start with `mcp__` goes straight to `next()`.

For a native call, the handler runs `evaluateNativeMcpCall()` on `exec.name`. The core reads the Code Mode manifest, `.utcp_config.json`, from the checkout. The adapter takes that checkout from its own location, four levels above the `dsh/` folder, which is the repository root.

A `code_mode` tool outside the allowlist is denied with a reason that names the tool and the four exposed tools. A `warn` verdict becomes `{kind: 'deny', reason}`, with the core's warnings joined as the reason.

`MCP_ROUTE_GUARD_DISABLED` silences the allowlist rule too, so the core's kill switch covers the whole guard. The module exports `ERROR_POLICY = 'fail-closed'`.

A throw from the core logs a warning through `ctx.logger.warn` and denies the call with a `could not evaluate` reason. A logging failure cannot change that decision.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/mcp-route-guard/tests/dsh-mcp-route-guard.test.mjs
```

Expected result: every test passes.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern README with the policy table and the per-runtime matrix.
- [`../lib/mcp-route-guard.cjs`](../lib/mcp-route-guard.cjs): the shared core this adapter calls.
- [`../../shared/hook-flags.mjs`](../../shared/hook-flags.mjs): the ESM kill-switch resolver.
- [`../../../../.dsh/plugins/repo-guards/README.md`](../../../../.dsh/plugins/repo-guards/README.md): the bundle that loads this adapter.
