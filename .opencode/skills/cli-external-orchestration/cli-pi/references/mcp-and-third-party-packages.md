---
title: "Pi MCP and Third-Party Packages"
description: "Boundary guide for Pi MCP integrations, pi-subagents, pi-mcp-extension, trust, and documented-but-unconfirmed package behavior."
trigger_phrases:
  - "pi mcp"
  - "pi-mcp-extension"
  - "pi-subagents package"
  - "pi third-party package"
  - "pi streamable http"
  - "pi stdio"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Pi MCP and Third-Party Packages

This reference separates Pi's first-party CLI from community packages that extend it.

The local pin confirmed the pi-subagents install path. It did not live-verify pi-mcp-extension, MCP transport behavior, or a successful provider-backed session. Source: [Pi contract pin](../../../../specs/cli-external-orchestration/031-cli-pi-creation/001-pi-contract-pin/implementation-summary.md).

## 1. FIRST-PARTY BOUNDARY

Per Pi docs, unconfirmed: Pi keeps the core small and does not include built-in MCP or sub-agent workflows. Those capabilities can be added through extensions or packages. Source: [Using Pi](https://pi.dev/docs/latest/usage).

Therefore:

- Pi CLI is first-party.
- Pi's extension and package loading mechanism is first-party.
- A named npm extension is not automatically first-party.
- A package's README is not a Pi contract.
- This packet must label package behavior separately.

## 2. pi-subagents

pi-subagents is a community package, not a first-party Pi feature. The local pin confirmed this command:

~~~bash
pi install npm:pi-subagents -l --approve
~~~

The package installed four packages into a project-local .pi npm directory during the pin. The observed package included agents, prompts, skills, source, and an index file. This confirms the installation observation only.

The untrusted form failed:

~~~bash
pi install npm:pi-subagents -l
~~~

The observed failure said the project was not trusted and required --approve. This trust gate applies to the install operation in the pinned environment.

Do not claim that every pi-subagents command, agent type, or model setting is confirmed by that install.

## 3. pi-mcp-extension

pi-mcp-extension is a community package, not a first-party Pi feature. Its package page is separate from the Pi CLI contract: [Pi package page](https://pi.dev/packages/pi-mcp-extension).

Per Pi docs, unconfirmed for this packet: the documented install verb is:

~~~bash
pi install npm:pi-mcp-extension
~~~

Per Pi docs, unconfirmed: the package page describes global and project MCP configuration and shows streamable HTTP and stdio configuration examples. The page also lists SSE as a transport option. None of those paths has been live-verified in this packet.

Treat the package as optional and untrusted until:

1. The exact version is pinned.
2. The source is reviewed.
3. The project trust decision is explicit.
4. The config path is isolated.
5. A harmless server is tested.
6. Startup and shutdown are observed.

## 4. MCP TRANSPORT DECISION

Transport terms must not be conflated:

| Transport | Status in this packet | Safe statement |
|---|---|---|
| stdio | Documented-only for pi-mcp-extension | Do not claim live support |
| streamable HTTP | Documented-only for pi-mcp-extension | Do not claim live connection |
| SSE | Documented-only for pi-mcp-extension | Do not claim live connection |
| Pi RPC JSONL | Confirmed as Pi's process protocol | It is not MCP transport |

Pi RPC and MCP are different layers. RPC connects a caller to Pi. MCP connects an extension to a tool server.

## 5. CONFIGURATION SCOPE

Per Pi docs, unconfirmed: pi-mcp-extension reads an agent-level config and a project-level config, with project settings able to override global settings. Source: [pi-mcp-extension](https://pi.dev/packages/pi-mcp-extension).

If testing this behavior:

- Use a temporary project.
- Use a server that returns no sensitive data.
- Use a unique tool prefix.
- Capture the effective configuration.
- Remove the package and config afterward.

Never copy a production MCP configuration into a delegated prompt.

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

## 9. ROUTING RULES

Route to this reference when the request names MCP, pi-mcp-extension, pi-subagents, stdio, streamable HTTP, SSE, or package installation. Route to [agent-delegation.md](./agent-delegation.md) when the request is about child agents. Route to [native-skills-and-extensions.md](./native-skills-and-extensions.md) when the request is about skills, prompt templates, or extension discovery.

The hub still routes the outer task through cli-pi. A package must not create a second workflow mode or a second advisor identity.

## 10. CONFIDENCE CHECKLIST

- [ ] First-party versus community status is explicit.
- [ ] pi-subagents install is cited to the local pin.
- [ ] pi-mcp-extension claims are labeled documented but unconfirmed.
- [ ] Stdio behavior is not claimed as live.
- [ ] HTTP behavior is not claimed as live.
- [ ] RPC is not confused with MCP.
- [ ] Trust and rollback are stated.
- [ ] Credentials are absent from prompts.

