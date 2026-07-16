---
title: Aside MCP Wiring
description: Aside MCP server transport, handshake, version-pinned tool inventory, runtime rediscovery procedure, and the Code Mode UTCP registration posture.
trigger_phrases:
  - "aside mcp server"
  - "aside tools list"
  - "aside utcp manual"
  - "aside code mode"
  - "aside mcp handshake"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Aside MCP Wiring

How the Aside MCP server is launched, what it exposed when live-probed, why the tool inventory must be rediscovered at runtime, and how the registered Code Mode manual is shaped.

---

## 1. TRANSPORT

`aside mcp` is a client-spawned local **stdio** process. The published client configuration is:

```json
{
  "mcpServers": {
    "aside": { "command": "aside", "args": ["mcp"] }
  }
}
```

No URL, port, bearer token, API-key env var, or OAuth field appears in any published or live-observed surface; there is no evidence for a remote HTTP/SSE endpoint on this exported server. Auth is account/session-based: the MCP server inherits the logged-in CLI account/provider context and exposes no account/auth option of its own.

---

## 2. HANDSHAKE AND TOOL INVENTORY (VERSION-PINNED)

Live handshake observed 2026-07-16 against installed version `1.26.626.1517`:

```json
{
  "protocolVersion": "2024-11-05",
  "capabilities": {"tools": {"listChanged": true}},
  "serverInfo": {"name": "aside", "version": "1.26.626.1517"}
}
```

Live `tools/list` returned exactly **one tool: `repl`**:
- Required inputs: `title` (string) + `code` (string); `execution.taskSupport: forbidden`.
- Persistent sandboxed ES2023+ REPL with Playwright APIs; 120-second call timeout; no default/external modules; no `import`/`require`.
- Advertised helpers include `page`, `tabs`, `listBrowserTabs`, `attachBrowserTab(targetId)`, `attachActiveBrowserTab`, `getTabByTargetId`, `openTab(url)`, `closeTab`, `snapshot(page, options?)`, `page.screenshot(options)`, locator screenshots, `page.pdf`, `annotatedScreenshot`, `console.log`, `display`, `fetch`, `sleep`, `fs`, `pwd`, `path`, `Buffer`.

There are **no** first-class `navigate`, `dom`, `screenshot`, `console`, or `network` MCP tools in this version.

### Rediscovery Is Mandatory

Because `tools.listChanged: true` and the schema is runtime-discovered, the one-tool inventory is version-pinned evidence, not a permanent contract. Before any invocation path:

1. `initialize` → `tools/list` against the spawned process (or capture via `scripts/doctor.sh`).
2. After UTCP registration: Code Mode `search_tools()` / `list_tools()` / `tool_info()` on every intended callable.
3. Save the discovered schema as a versioned fixture; never hardcode tool names or input schemas.

---

## 3. BROWSER-PROFILE BINDING

A fresh `aside mcp` process is transport-healthy but **not browser-capable by itself**. Live probe: `listBrowserTabs()` returned:

```text
This task is not bound to a browser profile. Open it in Aside browser and try again.
```

Starting the MCP server does not grant control of an arbitrary browser; a task/profile binding is a prerequisite. Report this state (`PROFILE_UNBOUND`) distinctly from auth failure — it is not a missing bearer token.

**UNKNOWN**: the supported user-facing procedure for binding an MCP process to an existing Aside browser task/profile is undocumented. When the error appears, surface it verbatim with the docs pointer and stop; do not improvise a binding workaround.

---

## 4. CODE MODE REGISTRATION (REGISTERED)

> **Registration status: REGISTERED** (2026-07-16). The `aside` manual below is present in `.utcp_config.json` `manual_call_templates[]` — verify with jq, do not re-add it. The canonical byte-true snapshot lives in [`../assets/utcp_aside_manual.md`](../assets/utcp_aside_manual.md). Callable discovery is still pending: it needs a fresh Code Mode session (manuals load at startup), and `aside.aside_repl` remains unconfirmed until `tool_info()` returns it.

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

Registration notes:
- `command: "aside"` assumes PATH; resolve the absolute path via `command -v aside` under the Code Mode server's environment and substitute if needed.
- `env: {}` is correct — auth is account/session-based, not env-var.
- Post-registration validation: `jq empty .utcp_config.json` → Code Mode `search_tools({ task_description: "Aside browser automation", limit: 20 })` → `tool_info()` on every intended callable → invoke only discovered `aside.aside_<tool>()` inside `call_tool_chain()` → return structured `{ success, data, errors, timestamp }` → preserve stderr/timeout details without leaking browser data.
- Expected callable per the repository convention `{manual_name}.{manual_name}_{tool_name}`: `aside.aside_repl`. **UNKNOWN until confirmed** by post-registration discovery.

### UNRESOLVED: Single vs Dual Manual

One lineage proposed registering `aside_1`/`aside_2` manuals (mirroring `chrome_devtools_1/2`) for parallel agent sessions; another explicitly eliminated cloning Chrome's dual-isolated-manual layout because Aside has no `--isolated=true` equivalent and no isolation guarantee. **Current posture: ONE manual + a single-writer lock per account/profile.** The live browser-binding finding (one profile-bound task per MCP process, binding procedure undocumented) weighs toward the conservative position, but the deciding multi-client isolation test has not been run. Do not add a second manual without that evidence and a separate decision.

---

## 5. INVOCATION PATTERN

Once discovery-confirmed (the manual is registered; confirmation needs a fresh Code Mode session), run MCP browser operations inside `call_tool_chain()` with explicit timeouts (the `repl` tool advertises a 120-second call timeout), try/catch around every call, and cleanup in `finally`. Verify artifacts independently of the tool response (a screenshot is a non-empty file with PNG magic bytes; structured capture must parse and contain a known marker).

Operational lifecycle notes: connection failures preserve stderr and timeout details — distinguish a dead stdio child from an unavailable/incompatible Aside daemon/browser. Observed idle telemetry on `1.26.626.1517`: `discoveryIdleTimeoutMs: 300000`, `replIdleTimeoutMs: 1800000` — diagnostic observations, not configuration guarantees, and their cross-release stability is UNKNOWN.

---

## 6. REFERENCES AND RELATED RESOURCES

- [aside_cli_reference.md](./aside_cli_reference.md) — CLI surface and REPL helpers.
- [session_management.md](./session_management.md) — daemon, binding, and concurrency model.
- [troubleshooting.md](./troubleshooting.md) — MCP failure taxonomy and recovery.
- [../mcp-servers/aside-mcp/README.md](../mcp-servers/aside-mcp/README.md) — registration package pointer.
- Repository contracts: `.opencode/skills/mcp-code-mode/SKILL.md` (naming convention, discovery, structured results).
- Primary sources: https://docs.aside.com/help/developers#use-mcp, https://docs.aside.com/changelog/components.md.
