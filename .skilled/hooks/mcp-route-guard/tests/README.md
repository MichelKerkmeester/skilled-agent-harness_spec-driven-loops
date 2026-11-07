---
title: "MCP Route Guard: DSH Adapter Tests"
description: "node --test suite for the DSH adapter, covering the Code Mode mount allowlist, the core kill switch, the fail-closed throw policy and deny-reason parity with Pi."
trigger_phrases:
  - "dsh mcp route guard tests"
  - "code mode allowlist test"
  - "mcp route guard test"
version: 1.0.0.0
---

# MCP Route Guard: DSH Adapter Tests

---

## 1. OVERVIEW

`tests/` holds the automated checks for the DSH adapter. The suite drives `registerMcpRouteGuard()` with a fake plugin context and a stubbed core, then asserts the handler verdicts directly. It runs under `node --test` and needs no running dsh install.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`dsh-mcp-route-guard.test.mjs`](./dsh-mcp-route-guard.test.mjs) | `node --test` suite | Asserts that an allowlisted `code_mode` tool reaches `next()`, an unlisted one is denied, the core kill switch disables the mount rule, a non-MCP tool is not evaluated, a core throw fails closed with one log line, and a routable external tool is denied with the Pi reason text. | Not applicable, the suite asserts behavior. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the policy table and the per-runtime matrix.
- [`../dsh/mcp-route-guard.mjs`](../dsh/mcp-route-guard.mjs): the adapter under test.
- [`../lib/mcp-route-guard.cjs`](../lib/mcp-route-guard.cjs): the shared core the parity case compares against.
