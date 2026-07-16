---
title: "aside-mcp"
description: "Setup pointer for the Aside MCP server (aside mcp, local stdio) and the registered aside UTCP manual in .utcp_config.json."
trigger_phrases:
  - "aside mcp server"
  - "aside utcp manual"
  - "register aside mcp"
  - "aside code mode setup"
version: 1.0.0.0
---

# aside-mcp

> Nothing to install here. The Aside MCP server is built into the `aside` binary and launched on demand as `aside mcp` over stdio. The UTCP manual below **is registered** in `.utcp_config.json` (2026-07-16); verify with jq, do not re-add it.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Confirming how the Aside MCP server will be configured for Code Mode. There is no separate package to install. |
| **Invoke with** | Code Mode `call_tool_chain({ code: "..." })` — the `aside` manual is registered; confirm callables via discovery in a fresh Code Mode session first. |
| **Works on** | `aside mcp` over local stdio, spawned by the client; no URL, port, token, or env credential. |
| **Produces** | A runtime-discovered tool surface (exactly one `repl` tool on the pinned version `1.26.626.1517`, protocol `2024-11-05`). |

---

## 2. OVERVIEW

### Why This Package Exists

mcp-aside-devtools routes composition work — browser operations chained with other Code Mode tools — through the Aside MCP server. That server is not vendored source: it ships inside the `aside` binary (install via [`../aside-cli/README.md`](../aside-cli/README.md)). This folder documents the transport facts and mirrors the registered manual object; the canonical byte-true snapshot lives in [`../../assets/utcp_aside_manual.md`](../../assets/utcp_aside_manual.md).

### What It Does

`aside mcp` speaks MCP over stdio and inherits the logged-in CLI account/provider context; there is no published transport credential, and no evidence of a remote HTTP/SSE endpoint. The live-probed inventory is **one tool, `repl`** (`title` + `code` inputs, persistent sandboxed ES2023+/Playwright REPL, 120 s call timeout). With `tools.listChanged: true`, that inventory is version-pinned evidence — every consumer must rediscover at runtime (`initialize` → `tools/list`; post-registration `search_tools()`/`tool_info()`), never hardcode it. A fresh MCP process is browser-unbound until a task/profile binding exists; the supported binding procedure is an open question.

---

## 3. REGISTERED UTCP MANUAL

> **Status: REGISTERED** (2026-07-16). This entry is present in `.utcp_config.json` `manual_call_templates[]` — verify with `jq '.manual_call_templates[] | select(.name == "aside")' .utcp_config.json`, do not re-add it. Post-registration discovery ran 2026-07-16 (fixture: `references/discovery_fixture_2026-07-16.json`): registry name `aside.aside.repl`, TS callable `aside.aside_repl(args)`.

The registered entry in `.utcp_config.json` `manual_call_templates[]`:

```json
{
  "name": "aside",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "aside": {
        "transport": "stdio",
        "command": "aside",
        "args": ["mcp"],
        "env": {}
      }
    }
  }
}
```

Post-registration checklist (remaining steps):

1. Resolve `command: "aside"` to an absolute path via `command -v aside` under the Code Mode server's environment if PATH differs.
2. `jq empty .utcp_config.json` — syntax gate.
3. Code Mode `search_tools({ task_description: "Aside browser automation", limit: 20 })`, then `tool_info()` on every intended callable.
4. Callable naming, confirmed by live discovery 2026-07-16 (`references/discovery_fixture_2026-07-16.json`): registry/discovery name `aside.aside.repl` (dot-separated); TS callable `aside.aside_repl(args)` per the `{manual_name}.{manual_name}_{tool_name}` convention — re-verify per session, never assume.
5. Invoke only discovered callables inside `call_tool_chain()`; structured `{ success, data, errors, timestamp }` returns; explicit timeouts; cleanup in `finally`; preserve stderr/timeout detail without leaking browser data.

`env: {}` is deliberate: auth is account/session-based (signed-in Aside account), not env-var — unlike API-key manuals such as `clickup_official`.

### UNRESOLVED: Single vs Dual Manual

Register **one** manual. The dual-manual layout (`aside_1`/`aside_2`, mirroring `chrome_devtools_1/2`) was proposed by one research lineage and eliminated by another because Aside has no `--isolated=true` equivalent and no isolation guarantee. Current posture is one manual plus a single-writer lock per account/profile; a controlled multi-client isolation test must precede any second manual, as a separate decision.

---

## 4. RELATED DOCUMENTS

- [`../../references/mcp_wiring.md`](../../references/mcp_wiring.md) — transport, handshake, discovery, and binding detail
- [`../../references/session_management.md`](../../references/session_management.md) — daemon lifecycle and concurrency posture
- [`../aside-cli/README.md`](../aside-cli/README.md) — installing the binary that hosts this server
- Source: https://docs.aside.com/help/developers#use-mcp · https://docs.aside.com/changelog/components.md
