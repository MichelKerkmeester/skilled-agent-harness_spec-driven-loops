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

`dsh/` holds the DSH adapter for the MCP route guard. DSH loads it through `.dsh/plugins/repo-guards/adapters/mcp-route-guard.mjs`, a relative link to this file, and the bundle registers it on `tools/pre-execute`. The adapter applies the shared core to every `mcp__*` call and adds a mount rule the other runtimes do not have: the `code_mode` server exposes only `call_tool_chain`, `list_tools`, `search_tools` and `tool_info`. A warn from the core becomes a deny reason because DSH has no advisory channel.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`mcp-route-guard.mjs`](./mcp-route-guard.mjs) | `tools/pre-execute` | Runs `evaluateNativeMcpCall()` on `exec.name`, denies a `code_mode` tool outside the allowlist, and turns a `warn` verdict into `{kind: 'deny', reason}`. Exports `registerMcpRouteGuard` and `ERROR_POLICY = 'fail-closed'`. | Fails closed. A core throw logs a warning and denies the call with a `could not evaluate` reason. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the policy table and the per-runtime matrix.
- [`../lib/mcp-route-guard.cjs`](../lib/mcp-route-guard.cjs): the shared core this adapter calls.
- [`../../shared/hook-flags.mjs`](../../shared/hook-flags.mjs): the ESM kill-switch resolver.
- [`../../../../.dsh/plugins/repo-guards/README.md`](../../../../.dsh/plugins/repo-guards/README.md): the bundle that loads this adapter.
