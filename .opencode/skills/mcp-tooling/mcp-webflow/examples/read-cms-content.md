---
title: "Example: read CMS content and page metadata"
description: "Read-only Webflow session: discover tools, list CMS items, read page metadata. No confirmation gates needed."
trigger_phrases: ["webflow read example", "webflow cms read"]
importance_tier: normal
contextType: example
version: 1.0.0.0
---

# Read CMS content and page metadata (RO class)

## Scenario

The user asks: "List the blog posts in the Webflow test site's CMS and show their titles."

## Flow

1. **Discover first** — confirm the live tool names:
   ```ts
   const tools = await list_tools();
   const webflow = tools.filter(t => t.name.startsWith("webflow.webflow."));
   ```
2. **Scope check** — the token must carry `cms:read` (+ `sites:read` for site lookup).
3. **Read**:
   ```ts
   const sites = await call_tool_chain({ tool: "webflow.webflow.data_sites_tool", action: "list_sites", params: {} });
   const items = await call_tool_chain({ tool: "webflow.webflow.data_cms_tool", action: "list_collection_items", params: { collectionId: "<id>", limit: 20 } });
   ```
4. **Report** — titles + updated timestamps; no confirmation needed (RO class).

## Guardrails

- Never mutate from a read request.
- If a tool name differs from the research inventory, record it in `references/tool-surface.md` after verifying.
