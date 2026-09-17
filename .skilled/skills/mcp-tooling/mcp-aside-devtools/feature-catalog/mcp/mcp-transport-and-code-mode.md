---
title: "Mcp"
description: "The Aside MCP transport: aside mcp over local stdio with one version-pinned repl tool, runtime rediscovery mandate, and Code Mode composition through the registered aside manual pending callable confirmation."
trigger_phrases:
  - "aside mcp"
  - "aside code mode"
  - "aside tools list"
  - "aside utcp manual"
version: 1.0.0.0
---

# Mcp (stdio transport and Code Mode composition)

<!-- sk-doc-template: skill_asset_feature-catalog -->

## 1. OVERVIEW

Carries the composition lane: browser work chained with other Code Mode tools through the Aside MCP server. `aside mcp` is a client-spawned local **stdio** process with no URL, port, token, or credential field; it inherits the logged-in CLI account/provider context. On `1.26.626.1517` (protocol `2024-11-05`) the live inventory is exactly **one tool, `repl`** (`title` + `code` inputs, persistent sandboxed ES2023+/Playwright REPL, 120-second call timeout) — version-pinned evidence, never a permanent contract.

The `aside` UTCP manual **is registered** in `.utcp_config.json` (2026-07-16; byte-true snapshot in [`../../assets/utcp-aside-manual.md`](../../assets/utcp-aside-manual.md)), and the Code Mode callable is **CONFIRMED by live discovery 2026-07-16** ([`../../references/discovery-fixture-2026-07-16.json`](../../references/discovery-fixture-2026-07-16.json)): the registry/discovery name is `aside.aside.repl` (dot-separated — not the previously predicted `aside.aside_repl` registry form); the TypeScript callable inside `call_tool_chain` is `aside.aside_repl(args)`. Per-session rediscovery still precedes first invocation.

---

## 2. HOW IT WORKS

Discovery first, always: `initialize` then `tools/list` against the spawned process (`bash examples/mcp-handshake-probe.sh` does both and reports the inventory), and — post-registration — Code Mode `search_tools()`/`list_tools()`/`tool_info()` on every intended callable. Because `tools.listChanged: true`, save the discovered schema as a versioned fixture and never hardcode tool names. Once discovery-confirmed, invoke inside `call_tool_chain()` with try/catch, explicit timeouts (the `repl` tool advertises 120 s), and cleanup in `finally`; verify artifacts independently of the tool response.

Constraints: a fresh `aside mcp` process is transport-healthy but browser-unbound — `listBrowserTabs()` fails with a binding error, not an auth error, and the supported binding procedure is **UNKNOWN**. There are no first-class `navigate`, `dom`, `screenshot`, `console`, or `network` MCP tools. Exactly one manual is registered; the dual-manual layout is an unresolved open question blocked on a multi-client isolation test. **UNKNOWN**: which permission mode (`Read only`/`Guard`/`Full access`) `aside mcp` inherits.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/mcp-wiring.md` | Shared | Transport, handshake, rediscovery mandate, registered-manual shape |
| `assets/utcp-aside-manual.md` | Asset | Byte-true snapshot of the registered manual + post-registration checklist |
| `mcp-servers/aside-mcp/README.md` | Server package | Registration pointer and remaining discovery steps |
| `examples/mcp-handshake-probe.sh` | Example | Initialize + tools/list probe with clean process shutdown |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/mcp-transport/mcp-handshake.md` | Manual playbook | ASD-008 stdio initialize handshake |
| `manual-testing-playbook/mcp-transport/tools-list-discovery.md` | Manual playbook | ASD-009 runtime inventory discovery with drift reporting |
| `manual-testing-playbook/mcp-transport/code-mode-discovery.md` | Manual playbook | ASD-011 Code Mode callable confirmation against the registered manual |

---

## 4. SOURCE METADATA

- Group: Mcp
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `mcp/mcp-transport-and-code-mode.md`

Related references:
- [repl-evidence-capture.md](../repl/repl-evidence-capture.md) covers the same REPL surface on the CLI lane
- [troubleshooting-recipes.md](../troubleshoot/troubleshooting-recipes.md) covers PROFILE_UNBOUND and dead-child classification
