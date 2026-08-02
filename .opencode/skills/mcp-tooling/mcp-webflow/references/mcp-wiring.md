---
title: "Webflow MCP Wiring (via Code Mode)"
description: "Wiring the official Webflow MCP 2.0 through this project's Code Mode: the registered webflow manual, the local stdio server with WEBFLOW_TOKEN, the remote OAuth alternative, doubled-prefix callable naming, and the mandatory discovery-first contract."
trigger_phrases:
  - "webflow mcp wiring"
  - "webflow utcp manual"
  - "webflow code mode"
  - "webflow token"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Webflow MCP Wiring (via Code Mode)

> **Transport identity (frozen by Phase 2, D2):** official `webflow-mcp-server` (npm), local stdio registration with `WEBFLOW_TOKEN` as the deterministic automation default; remote OAuth (`https://mcp.webflow.com/sse` via the `mcp-remote` bridge) documented as the operator-preference alternative. Version pinning and the README-vs-hosted surface reconciliation are mandatory before first live use.

---

## 1. OVERVIEW

Webflow MCP 2.0 exposes Webflow's Data API v2 and Designer API as a bounded combined-tool surface (18 tool modules). This skill reaches it through the repo's **Code Mode** transport. Code Mode consumes stdio; the official server ships as a Node CLI (`npx -y webflow-mcp-server@latest`), so the registered `webflow` manual is a plain stdio registration — no bridge needed for the local path. The remote OAuth surface speaks remote HTTP and requires the `mcp-remote` bridge; see §5.

Claims below are tagged **[CONFIRMED]** (read from this repo's config or cited official docs at research time), **[INFERRED]** (supported but not exercised end-to-end), or **[UNKNOWN]** (requires an authenticated session or a provisioned test site).

## 2. THE REGISTERED `webflow` MANUAL

Registered in `.utcp_config.json` (manual call template, type `mcp`):

```json
{
  "name": "webflow",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "webflow": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "webflow-mcp-server@latest"],
        "env": { "WEBFLOW_TOKEN": "${WEBFLOW_TOKEN}" }
      }
    }
  }
}
```

**Validated as-is: verify, never re-add, never edit the entry.** The env placeholder resolves from the operator's environment (`.env.example` documents the namespaced `webflow_WEBFLOW_TOKEN`).

## 3. AUTHENTICATION (least privilege, frozen D3)

- **Baseline**: a Site Token scoped to the dedicated **test site** with read-only scopes (`cms:read`, `pages:read`, `sites:read`, `assets:read`, `components:read`, `forms:read`, `authorized_user:read`).
- **Escalation**: `sites:write` only for the staging-subdomain publish test (Phase 8).
- **Never**: workspace tokens for writes; production `customDomains` publishes; token values in repository files or logs.
- Role gate: only site owners/admins can authorize the MCP server (documented in the install guide).

## 4. DISCOVERY-FIRST CONTRACT

Before invoking any Webflow tool:

```ts
const tools = await list_tools();            // live discovery per session
const webflow = tools.filter(t => t.name.startsWith("webflow.webflow."));
```

Expected callable names follow the Code Mode convention `{manual}.{manual}_{tool}` (registry `webflow.webflow.<tool>` / TypeScript `webflow.webflow_<tool>`) — UNVERIFIED until authenticated discovery (mobbin precedent: `mobbin.mobbin.search_screens` / `mobbin.mobbin_search_screens`). The research-time inventory (18 modules: pages, cms, sites, workflows, scripts, components, dePages, deElement, deVariable, aiChat, comments, enterprise, rules, webhooks, localDeMCPConnection, …) is the baseline in `tool-surface.md`; **always re-discover per session** — never call from memory.

## 5. REMOTE OAUTH ALTERNATIVE

The remote surface (`https://mcp.webflow.com/sse`, experimental `mcp-remote` transport) can be reached through the same bridge pattern as `refero`: `npx -y mcp-remote https://mcp.webflow.com/sse` as a stdio manual, with browser OAuth consent per site/workspace and auth state under `~/.mcp-auth`. Not registered by default; operator decision required (interactive consent is not automation-friendly).

## 6. SAFETY BOUNDARY (frozen D4/D5, summary)

- Read-only and draft-safe mutations pass without a gate (scope check only).
- Destructive (`delete_*`, `remove_*`), publish (`publish_site`, `publish_collection_items`, publish-status changes), and deploy (`run_workflow`, script registration) classes **require operator confirmation** and rollback evidence.
- Nothing auto-publishes; honor `Retry-After` on 429; never blind-replay ambiguous non-idempotent writes.
- Designer-family operations must load `sk-design` first (D6).
