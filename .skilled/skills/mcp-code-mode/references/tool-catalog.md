---
title: Tool Catalog - Configured MCP Manuals
description: Runtime-discovered catalog of the MCP manuals configured for Code Mode.
trigger_phrases:
  - "code mode tool catalog"
  - "available mcp tools list"
  - "search tools discovery"
  - "tools per mcp server"
  - "tool name lookup"
importance_tier: normal
contextType: general
version: 1.0.2.0
---

# Tool Catalog - Configured MCP Manuals

Open this reference when a Code Mode task needs the live callable tools for a configured manual.

---

## 1. OVERVIEW

### Purpose

This reference lists the MCP manuals configured for Code Mode and explains how to discover callable tools and schemas in the live session.

### When to Use

- When you need the configured manual list for a Code Mode task.
- When a workflow needs a configured manual's live callable names or schemas.

### Core Principle

Code Mode does not maintain a hand-counted static tool inventory. The configured manual names below are the current wiring surface; callable names and schemas must be discovered from the live session.

---

## 2. RUNTIME DISCOVERY

Use the exact tool name returned by `list_tools()` or `search_tools()`. Call `tool_info()` before composing a new workflow so parameter names and output envelopes come from the live schema.

```typescript
const matches = await search_tools({
  task_description: "the user's task",
  limit: 10
});

const allTools = await list_tools();
const info = await tool_info({
  tool_name: "<exact name returned by discovery>"
});
```

---

## 3. CONFIGURED MANUALS

- This table names manuals, not tools.
- A manual may be disabled, unauthenticated, or changed between sessions.
- Discovery is authoritative for the callable inventory.

The current `.utcp_config.json` contains these thirteen manual names:

| Manual name | Role |
|---|---|
| `chrome_devtools_1` | Chrome DevTools instance |
| `chrome_devtools_2` | Chrome DevTools instance |
| `aside` | Aside MCP bridge |
| `clickup_official` | Official ClickUp MCP |
| `figma` | Figma MCP |
| `github` | GitHub MCP |
| `gitkraken` | GitKraken MCP |
| `magnific` | Magnific MCP |
| `refero` | Refero design-research transport |
| `mobbin` | Mobbin design-research transport |
| `notion` | Notion MCP |
| `obsidian` | Obsidian MCP |
| `webflow` | Webflow MCP |

---

## 4. CALLING CONTRACT

Do not infer a tool from a service label, a remembered catalog, or a similarly named manual. If discovery does not return a callable, stop and report the missing or unavailable manual.

The TypeScript namespace is derived from the manual and tool name returned by discovery. For example, the confirmed Mobbin callable is:

```typescript
const mobbinSearch = await tool_info({
  tool_name: "mobbin.mobbin_search_screens"
});

const result = await mobbin.mobbin_search_screens({
  query: "mobile banking onboarding",
  limit: 5
});
```

---

## 5. CONFIGURATION AUTHORITY

- The configured manual list is sourced from `.utcp_config.json`.
- The generated Code Mode `leaf-manifest.json` owns which catalog and workflow resources are routable.
- The live MCP session owns tool names, schemas, authentication state, and availability.

The command below checks resource-manifest currency; it does not replace runtime tool discovery.

```bash
node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs \
  --check .skilled/skills/mcp-code-mode
```

