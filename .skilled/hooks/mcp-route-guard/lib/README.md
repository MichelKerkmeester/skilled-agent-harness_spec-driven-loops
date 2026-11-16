---
title: "MCP Route Guard: Shared Policy Core"
description: "Runtime-neutral core that parses a native MCP tool name, normalizes the server family, exempts internal servers and decides allow or warn from the Code Mode manifest."
trigger_phrases:
  - "mcp route guard core"
  - "utcp manifest families"
  - "mcp route decision"
version: 1.0.0.0
---

# MCP Route Guard: Shared Policy Core

---

## 1. OVERVIEW

`lib/` holds the runtime-neutral policy for the MCP route guard. The core exports `evaluateNativeMcpCall()`, which takes a tool name, a project directory and an environment. It parses the Claude `mcp__<server>__<tool>` shape or the OpenCode `<server>_<tool>` shape. Then it normalizes the server token and exempts the repository's own servers.

The manual family set comes from `.utcp_config.json`, cached by file mtime. An edit widens coverage on the next call. An unchanged file is not parsed again. The only decisions are `allow` and `warn`. The core never writes stdout or stderr.

The core fails open. In the default mode, a missing, oversized or unparsable manifest returns `allow`. An unknown tool name or any internal error returns `allow` in every mode. With `MCP_ROUTE_GUARD_BROAD_MODE=1`, a call the manifest cannot cover returns `warn`. The manifest cap is 1_048_576 bytes.

Two environment switches change the decision. `MCP_ROUTE_GUARD_DISABLED` turns the guard into a no-op on every call. `MCP_ROUTE_GUARD_BROAD_MODE=1` also advises on external families the manifest cannot route yet.

Claude, Codex, Devin, Pi, DSH, OpenCode and Vibe import the core. Cursor reaches it through the Claude adapter instead. The core imports Node builtins and `isTruthy` from `../../shared/hook-flags.cjs`.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `mcp-route-guard.cjs` | The policy core. It parses, normalizes, exempts and decides. |
| `mcp-route-guard.test.cjs` | The suite for the core, the Claude adapter and the Cursor adapter. |

`mcp-route-guard.cjs` exports `evaluateNativeMcpCall()` plus the parsing, normalization and manifest helpers. It also exports the constants and helpers the suite reads directly.

`mcp-route-guard.test.cjs` covers both tool-name shapes, token normalization, the internal-server exemption, the mtime cache, broad mode and the fail-open paths. It spawns the Claude and Cursor adapters and asserts their output.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs
```

Expected result: `[mcp-route-guard] 18/18 assertions passed` and exit 0.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern README with the decision table, the runtime coverage and the configuration.
- [`../claude/mcp-route-guard.cjs`](../claude/mcp-route-guard.cjs): the Claude `PreToolUse` adapter over this core.
- [`../../shared/hook-flags.cjs`](../../shared/hook-flags.cjs): the switch resolver the core imports for `isTruthy`.
