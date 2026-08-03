---
title: "mcp-webflow Install Guide"
description: "Operator steps to connect the mcp-webflow mode to Webflow MCP 2.0: create the token, export it, verify discovery, and pin the server version."
trigger_phrases:
  - "webflow install"
  - "webflow setup"
  - "webflow token setup"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# mcp-webflow Install Guide

## Prerequisites

- Node 22.3.0+ (local server path)
- A Webflow account with owner/admin rights on the target site
- (Recommended) a dedicated **test workspace + test site** for any mutating work

## 1. Create a token

1. Webflow → Site settings → Integrations → **API access**.
2. Generate a Site Token for the target site.
3. Select the **least privilege scopes** for your use (read-only baseline: `cms:read`, `pages:read`, `sites:read`, `assets:read`, `components:read`, `forms:read`, `authorized_user:read`).

## 2. Export the token

The Code Mode manual resolves `${WEBFLOW_TOKEN}` from the operator environment:

```bash
export WEBFLOW_TOKEN=your_token_value_here
```

Never commit or log the value. `.env.example` documents the namespaced `webflow_WEBFLOW_TOKEN` name only.

## 3. Verify discovery (per session)

```ts
const tools = await list_tools();
const webflow = tools.filter(t => t.name.startsWith("webflow.webflow."));
```

If empty, see `references/troubleshooting.md`.

## 4. Pin the server version (required before live use)

The registration uses `webflow-mcp-server@latest`; **pin the exact version** after the first verified session and record the discovered tool set in `references/tool-surface.md` (the README and hosted docs disagree on the surface — live discovery is authoritative).

## 5. Verify with the doctor

Run `scripts/doctor.sh` after setup: it checks node/npx versions, confirms the `webflow` manual exists in `.utcp_config.json` (verify-only, never re-adds), checks token presence **as a boolean only** (never prints values), and parses the config. See `scripts/README.md`.

## 6. Designer tools (Bridge App)

Designer-family tools (`de*`) need the Bridge App open in the Designer: remote OAuth auto-installs it to authorized sites; local mode requires a registered/published MCP Bridge App Designer extension. Data API tools work with Webflow closed. All Designer-family work pairs with `sk-design`.

## 7. Remote OAuth alternative (operator preference)

`npx -y mcp-remote https://mcp.webflow.com/sse` with browser OAuth per site/workspace; interactive consent, auth state under `~/.mcp-auth`. See `references/mcp-wiring.md` §5.

## Safety reminder

- Destructive, publish, and deploy classes require operator confirmation.
- Publishing from smoke flows: `publishToWebflowSubdomain` only — never production `customDomains`.
- Designer-family operations require `sk-design` pairing.
