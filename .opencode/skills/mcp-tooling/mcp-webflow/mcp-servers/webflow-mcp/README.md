---
title: "webflow-mcp"
description: "The official Webflow MCP 2.0 server, reached through this project's Code Mode as a local stdio registration with WEBFLOW_TOKEN (deterministic automation default per the frozen contract); remote OAuth documented as the alternative."
trigger_phrases:
  - "webflow mcp server"
  - "webflow token"
  - "webflow code mode"
---

# webflow-mcp

> The official Webflow MCP 2.0 server (`webflow-mcp-server`, npm), reached through this project's Code Mode as a manual stdio registration. Nothing is vendored here: `npx -y webflow-mcp-server@latest` runs on demand. Manual registration, not a vendored server.

---

## 1. OVERVIEW

The Webflow MCP server exposes Webflow's Data API v2 and Designer API as a bounded combined-tool surface. It is registered as the `webflow` manual in the repo's `.utcp_config.json`, which launches `npx -y webflow-mcp-server@latest` as a stdio server with `WEBFLOW_TOKEN` from the environment. The manual is validated as-is: verify, never re-add, never edit.

Access requires a Webflow token with at least the read scopes of the target site (see `../references/mcp-wiring.md` §3). Unauthenticated or under-scoped requests fail per tool with Webflow API errors.

## 2. QUICK START

The server needs no local install beyond npx. Confirm it is reachable through Code Mode:

```ts
const tools = await list_tools();
const webflow = tools.filter(t => t.name.startsWith("webflow.webflow."));
```

If discovery fails: confirm `WEBFLOW_TOKEN` is exported in the operator environment (namespaced `webflow_WEBFLOW_TOKEN` in `.env.example`), and see `../references/troubleshooting.md`.

## 3. VERSION PINNING (REQUIRED before live use)

`webflow-mcp-server@latest` is the registration default; **pin the exact version** in the manual and record the tested endpoint surface in `../references/tool-surface.md` before the first authenticated session. Rationale: the research found a version-surface contradiction between the public README (`/sse`) and the hosted docs (`/mcp`) — the pinned version's actual tool set is the only trustworthy inventory.

## 4. SAFETY

- Read-only + draft-safe: allowed (scope checks).
- Destructive / publish / deploy: operator confirmation required; publishing is staging-first (`publishToWebflowSubdomain`, never `customDomains` from smoke).
- Designer-family operations require `sk-design` pairing.
- Full policy: `../references/mcp-wiring.md` §6 and the packet safety matrix.
