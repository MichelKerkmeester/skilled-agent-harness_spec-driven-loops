---
title: "MCP Route Guard: DSH Adapter Tests"
description: "node --test suite for the DSH adapter. It covers the Code Mode mount allowlist, the core kill switch, the fail-closed throw policy and deny-reason parity with Pi."
trigger_phrases:
  - "dsh mcp route guard tests"
  - "code mode allowlist test"
  - "mcp route guard test"
version: 1.0.0.0
---

# MCP Route Guard: DSH Adapter Tests

---

## 1. OVERVIEW

`tests/` holds the automated checks for the DSH adapter in `dsh/`. The suite drives `registerMcpRouteGuard()` with a fake plugin context. It uses the real core, and a stubbed core only for the non-MCP and throw cases. It then asserts the handler verdicts directly, under `node --test` and with no running dsh install.

The cases cover the `code_mode` mount allowlist and the core kill switch. An allowlisted tool reaches `next()`, while an unlisted one is denied. A non-MCP tool is not evaluated, so the core never sees it. A throw from the core fails closed, logs one warning and returns a deny verdict. One case compares the deny reason with a local copy of the Pi extension's reason logic.

DSH registers the adapter on `tools/pre-execute` through its repo-guards bundle in `.dsh/plugins/repo-guards/index.mjs`.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dsh-mcp-route-guard.test.mjs` | The `node --test` suite for the DSH adapter. |

The suite builds a fake plugin context that records handlers and log lines. It registers the guard on `tools/pre-execute` and calls that handler directly. Each case asserts the returned `kind` and, on a deny, the reason text. The file has no error path of its own, since it asserts behavior.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/mcp-route-guard/tests/dsh-mcp-route-guard.test.mjs
```

Expected result: all tests pass.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern README with the policy table and the per-runtime matrix.
- [`../dsh/mcp-route-guard.mjs`](../dsh/mcp-route-guard.mjs): the adapter under test.
- [`../lib/mcp-route-guard.cjs`](../lib/mcp-route-guard.cjs): the shared core the parity case compares against.
