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

`.skilled/hooks/mcp-route-guard/tests/` holds the `node --test` suite for the DSH adapter in `../dsh/mcp-route-guard.mjs`. The suite calls `registerMcpRouteGuard()` with a fake plugin context and asserts the verdict its `tools/pre-execute` handler returns. No DSH install is needed.

The suite imports the real shared core from `../lib/mcp-route-guard.cjs`. A stub replaces it only where a case needs to show that the core is skipped or that a throw fails closed. One case writes a small `.utcp_config.json` manifest in a temporary folder and compares the DSH deny reason with the reason the Pi extension would produce.

---

## 2. FILES

The folder is flat. It holds this README and one suite.

| File | Responsibility |
|---|---|
| `dsh-mcp-route-guard.test.mjs` | The `node --test` suite. It builds the fake context and asserts the verdict from each call. |

`harness()` returns `handlers`, `logs` and `ctx`. `ctx.on()` records each handler in the `handlers` map, and `ctx.logger` records `warn` and `error` entries in the `logs` array. Each case fetches the `tools/pre-execute` handler and calls it directly. The file has no error path of its own, since it asserts behavior.

---

## 3. BOUNDARIES AND FLOW

The cases run in one Node process. The allow and deny cases read the checkout manifest. The kill-switch case returns before the core reads a manifest. The parity case creates its own manifest folder under `os.tmpdir()` and removes it in a `finally` block. No other case writes to disk.

| Boundary | Rule |
|---|---|
| Runtime | No DSH process. Each case calls the recorded handler with a fake context. |
| Core | The real core is the default. A stub stands in where a case needs to show that the core is skipped or that a throw fails closed. |
| Filesystem | The parity case writes a `.utcp_config.json` into a temporary folder and deletes it. |
| Network | Nothing connects out. |

The kill-switch case sets `env: { [guardCore.DISABLED_ENV]: '1' }`. `guardCore.DISABLED_ENV` is `MCP_ROUTE_GUARD_DISABLED`. The handler evaluates the call, then reads the switch before the mount allowlist runs. A tool that the allowlist would deny reaches `next()` while the switch is on.

Main flow:

```text
╭──────────────────────────────────────────╮
│ test case                                │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ harness()                                │
│ ctx.on records the handler               │
│ ctx.logger records warn and error lines  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ registerMcpRouteGuard(ctx, options)      │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ tools/pre-execute handler                │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ verdict returned to the test             │
└──────────────────────────────────────────┘
```

---

## 4. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/mcp-route-guard/tests/dsh-mcp-route-guard.test.mjs
```

Expected result: the runner passes every case and exits 0. Its summary reports `pass 6` and `fail 0`.

---

## 5. RELATED

- The [concern README](../README.md) sets out the routing rule and the runtime coverage.
- The [DSH adapter](../dsh/mcp-route-guard.mjs) is the module under test.
- The [shared core](../lib/mcp-route-guard.cjs) decides allow or warn before the adapter applies its mount rule.
- The [core suite](../lib/mcp-route-guard.test.cjs) covers the policy decisions. It also drives the Claude and Cursor adapters.
