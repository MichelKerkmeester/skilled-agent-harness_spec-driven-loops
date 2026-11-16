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

`lib/` holds the runtime-neutral policy for the MCP route guard. Every adapter imports `mcp-route-guard.cjs` and passes a tool name, a project directory and an environment. The core parses the Claude `mcp__<server>__<tool>` shape or the OpenCode `<server>_<tool>` shape, normalizes the server token, exempts the repo's own servers, and reads the manual family set from `.utcp_config.json` with an mtime cache. The only decisions are `allow` and `warn`, and the core never writes stdout or stderr.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`mcp-route-guard.cjs`](./mcp-route-guard.cjs) | Shared core | Exports `evaluateNativeMcpCall()` plus the parsing, normalization and manifest helpers. The manifest family set is cached by file mtime, so an edit widens coverage on the next call. | Fails open. A missing, oversized or unparsable manifest, an unknown tool name or any internal error returns `allow`. |
| [`mcp-route-guard.test.cjs`](./mcp-route-guard.test.cjs) | `node --test` suite | Covers both tool-name shapes, token normalization, the internal-server exemption, the mtime cache, broad mode and the fail-open paths. | Not applicable, the suite asserts behavior. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the full decision table and configuration.
- [`../claude/mcp-route-guard.cjs`](../claude/mcp-route-guard.cjs): one adapter over this core.
- [`../../shared/hook-flags.cjs`](../../shared/hook-flags.cjs): the kill-switch resolver the core imports for `isTruthy`.
