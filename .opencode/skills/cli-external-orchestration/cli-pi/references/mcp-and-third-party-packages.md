---
title: "Pi MCP and Third-Party Packages"
description: "Boundary guide for Pi MCP integrations, pi-mcp-extension, trust, and documented-but-unconfirmed package behavior."
trigger_phrases:
  - "pi mcp"
  - "pi-mcp-extension"
  - "pi third-party package"
  - "pi streamable http"
  - "pi stdio"
importance_tier: important
contextType: implementation
version: 1.1.0.0
---

# Pi MCP and Third-Party Packages

This reference separates Pi's first-party CLI from community packages that extend it.

Phase 007 confirmed pi-mcp-extension's stdio transport live. It did not live-verify a full successful provider-backed dispatch through the package. Source: [Pi contract pin](../../../../specs/cli-external-orchestration/031-cli-pi-creation/001-pi-contract-pin/implementation-summary.md).

## 1. OVERVIEW

### Core Principle

Pi's core stays intentionally small; MCP is a third-party package (`pi-mcp-extension`), not a built-in Pi feature. A package's README is not a Pi CLI contract.

### Purpose

Separates confirmed first-party Pi behavior from community-package behavior, and tracks which transports and install paths have moved from documented-only to live-confirmed.

### When to Use

- A request names MCP, pi-mcp-extension, stdio, streamable HTTP, SSE, or package installation
- Deciding whether a package claim is confirmed by the local pin or only by the package's own docs

---

## 2. FIRST-PARTY BOUNDARY

Per Pi docs, unconfirmed: Pi keeps the core small and does not include built-in MCP or sub-agent workflows. Those capabilities can be added through extensions or packages. Source: [Using Pi](https://pi.dev/docs/latest/usage).

Therefore:

- Pi CLI is first-party.
- Pi's extension and package loading mechanism is first-party.
- A named npm extension is not automatically first-party.
- A package's README is not a Pi contract.
- This packet must label package behavior separately.

---

## 3. PI-MCP-EXTENSION

pi-mcp-extension is a community package, not a first-party Pi feature. Its package page is separate from the Pi CLI contract: [Pi package page](https://pi.dev/packages/pi-mcp-extension).

**Confirmed (phase 007):** the install verb below was run live and the package was installed into `.pi/settings.json`'s `packages` array. Phase 007 confirmed `pi-mcp-extension`'s own install only.

~~~bash
pi install npm:pi-mcp-extension
~~~

**Confirmed (phase 007):** `.pi/mcp.json`'s stdio-transport config shape (`{command, args, env, transport: "stdio", lifecycle}`) connects live. A `pi --offline --approve` session showed `sequential_thinking` and `system-spec-memory` both connected, with `system-spec-memory`'s full real tool surface present (`memory_context`, `session_resume`, `memory_save`, `memory_delete`, etc.). That observation is a dated transport record: `system-spec-memory` has since been retired, so reproduce the check against a server the current `.pi/mcp.json` still registers. Other configured servers in that same file failed to connect in the test environment for an unrelated, already-diagnosed reason (a missing built TypeScript toolchain in that specific worktree, confirmed present in the main tree) — not a stdio-transport limitation.

Per Pi docs, unconfirmed: streamable HTTP and SSE transport, and the package's documented global-vs-project config-override precedence. Neither has been live-tested in this packet.

Treat the package as optional and untrusted until:

1. The exact version is pinned.
2. The source is reviewed.
3. The project trust decision is explicit.
4. The config path is isolated.
5. A harmless server is tested.
6. Startup and shutdown are observed.

---

## 4. MCP TRANSPORT DECISION

Transport terms must not be conflated:

| Transport | Status in this packet | Safe statement |
|---|---|---|
| stdio | **Confirmed live (phase 007)** | Two stdio servers connected in the phase-007 run; both have since been retired from `.pi/mcp.json`, so re-confirm against the servers it registers now |
| streamable HTTP | Documented-only for pi-mcp-extension | Do not claim live connection |
| SSE | Documented-only for pi-mcp-extension | Do not claim live connection |
| Pi RPC JSONL | Confirmed as Pi's process protocol | It is not MCP transport |

Pi RPC and MCP are different layers. RPC connects a caller to Pi. MCP connects an extension to a tool server. See [pi-tools.md](./pi-tools.md) §2 for RPC's own sibling-comparison framing.

---

## 5. CONFIGURATION SCOPE

Per Pi docs, unconfirmed: pi-mcp-extension reads an agent-level config and a project-level config, with project settings able to override global settings. Source: [pi-mcp-extension](https://pi.dev/packages/pi-mcp-extension).

If testing this behavior:

- Use a temporary project.
- Use a server that returns no sensitive data.
- Use a unique tool prefix.
- Capture the effective configuration.
- Remove the package and config afterward.

Never copy a production MCP configuration into a delegated prompt.

---

## 6. INSTALL REVIEW

Before any package install:

| Question | Required answer |
|---|---|
| Is the package required? | A named task requires it |
| Is it community-owned? | Yes, unless the Pi project explicitly owns it |
| What code executes? | Extensions and package dependencies are reviewed |
| What files change? | Settings, lockfiles, package directories |
| What trust is needed? | Project-local approval is explicit |
| What rolls back? | Remove package and restore settings |
| How is it tested? | Safe server, captured logs, cleanup |

The package source is not an authority over the hub's routing or advisor identity.

---

## 7. MCP PROMPTS

Use this handoff shape when a task explicitly requests MCP:

~~~text
Package: <community package name>
Version: <exact version or UNKNOWN>
Transport: stdio | streamable-http | SSE | UNKNOWN
Config scope: project | global | temporary
Server: <non-sensitive name>
Trust approval: granted | not granted
Verification: <safe probe>
Rollback: <removal and restore steps>
~~~

If version or transport is unknown, stop at documentation and say so.

---

## 8. SECURITY RULES

- Review community package source before install.
- Never install a package only because a model suggested it.
- Do not pass credentials in prompts.
- Use least privilege for MCP tools.
- Prefer a temporary project for first install.
- Capture stderr and startup errors.
- Treat server URLs and commands as executable configuration.
- Remove unused packages.
- Re-run repository validation after settings changes.

---

## 9. ROUTING RULES

Route to this reference when the request names MCP, pi-mcp-extension, stdio, streamable HTTP, SSE, or package installation. Route to [agent-delegation.md](./agent-delegation.md) when the request is about child agents. Route to [native-skills-and-extensions.md](./native-skills-and-extensions.md) when the request is about skills, prompt templates, or extension discovery.

The hub still routes the outer task through cli-pi. A package must not create a second workflow mode or a second advisor identity.

---

## 10. CONFIDENCE CHECKLIST

- [ ] First-party versus community status is explicit.
- [ ] Stdio behavior is cited to phase 007, not stated as a documentation claim.
- [ ] HTTP and SSE behavior are not claimed as live.
- [ ] RPC is not confused with MCP.
- [ ] Trust and rollback are stated.
- [ ] Credentials are absent from prompts.

