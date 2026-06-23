---
title: "Refero MCP Tools Reference"
description: "Tool catalog for the Refero MCP (8 tools across styles, screens, flows): the styles-first mental model, the verified Code Mode call convention, arguments, result shape, and troubleshooting. The critique-against discipline lives in design_references_mcp.md."
trigger_phrases:
  - "refero mcp tools"
  - "refero search_styles search_screens search_flows"
  - "refero get_style get_screen get_flow"
  - "refero code mode invocation"
importance_tier: normal
contextType: implementation
version: 1.5.0.3
---

# Refero MCP Tools Reference

**MCP server:** `https://api.refero.design/mcp` (remote HTTP, OAuth, paid subscription)
**Bridge:** `npx -y mcp-remote https://api.refero.design/mcp` (stdio), the `refero` manual in `.utcp_config.json`
**Invocation:** Code Mode `call_tool_chain` (`mcp__code_mode__call_tool_chain`), accessed as `refero.refero_<tool>(args)` (note the doubled `refero_` prefix, for example `refero.refero_refero_search_styles`)
**Runtime:** Code Mode must run on Node 24. isolated-vm has no Node 25 build, so `call_tool_chain` SIGSEGVs and drops the connection under Node 25.

---

## 1. OVERVIEW

Refero is a large library of real shipped UI, organized into three layers: **styles** (visual direction from marketing/product pages), **screens** (concrete in-app UI patterns), and **flows** (multi-step journeys). Inside sk-design-interface these are a CRITIQUE-AGAINST reference; the discipline (one reference, read live, never copy) lives in `design_references_mcp.md`, and this file is the tool catalog.

Refero's own guidance reinforces the skill's anti-default mandate: "do not average references into a safe middle. A dark, acid, or saturated reference should not become a warm cream canvas with muted accents. Strong references should stay strong or be rejected, not softened into generic AI taste." Treat a style as a reference ingredient, never a wholesale copy.

---

## 2. THE STYLES -> SCREENS -> FLOWS MODEL

- **Styles** are the starting point for visual direction (typography, palette, layout, surfaces, the design language). Search styles FIRST for look-and-feel. Coverage is web marketing/product pages, not in-app or iOS screens.
- **Screens** are for concrete interface decisions (page structure, component choices, states, copy, product-specific patterns).
- **Flows** are for journey logic (step count, entry/exit states, decision points, recovery paths), not visual style.

Search to find UUIDs, then `get_*` to retrieve full detail before deciding.

---

## 3. PREREQUISITES & AUTHENTICATION

- Code Mode configured with the `refero` manual in `.utcp_config.json`, running on Node 24.
- A paid Refero subscription and a completed browser OAuth via mcp-remote (token caches under `~/.mcp-auth`; no token in the config).
- Manuals load at Code Mode startup, so a freshly-wired manual needs a reconnect before its tools resolve.

---

## 4. TOOLS

### Styles (visual direction)

| Tool | Arguments | Returns |
|------|-----------|---------|
| `refero_search_styles` | `query` (semantic, aesthetic/domain/brand), `page?`, `response_format?` `"json"\|"md"` | `records[]` of `{platform, title, url, uuid, preview_url, description}` |
| `refero_get_style` | `style_id` OR `style_ids[]` (max 3-4 per call), `response_format?` | Full style reference (tokens, typography, layout, spacing, surfaces, components, do/don't); ~10-15k chars each |

### Screens (concrete UI patterns)

| Tool | Arguments | Returns |
|------|-----------|---------|
| `refero_search_screens` | `query` (concrete UI: screen type, component, state, company), `platform` `"ios"\|"web"`, `page?`, `response_format?` | `records[]` of `{uuid, site, page_url, refero_url, thumbnail_url, hex_colors, ux_patterns, ui_elements, page_types, platform, content}` |
| `refero_get_screen` | `screen_id` OR `screen_ids[]`, `response_format?` | Full metadata for the given screen UUIDs |
| `refero_get_similar_screens` | `screen_id`, `limit?` (1-20, default 10), `response_format?` | Screens visually/functionally similar to the given one |
| `refero_get_screen_image` | `screen_id`, `image_size?` `"thumbnail"\|"full"` | The raw screenshot as a base64 image for visual analysis |

### Flows (journey logic)

| Tool | Arguments | Returns |
|------|-----------|---------|
| `refero_search_flows` | `query` (task/journey: "cancel subscription", "checkout"), `platform` `"ios"\|"web"`, `page?`, `response_format?` | `records[]` of flow summaries |
| `refero_get_flow` | `flow_id` OR `flow_ids[]` (max 10), `response_format?` | Full flow: all screens with goal/action/system_response per step |

---

## 5. INVOCATION (CODE MODE, VERIFIED LIVE)

Call synchronously inside the `call_tool_chain` body (no top-level `await`). With `response_format: "json"` each search returns a single object `{ pagination, records }` (NOT a content array like Mobbin):

```typescript
const styles = refero.refero_refero_search_styles({
  query: "editorial monochrome saas landing page",
  response_format: "json"
});
const list = styles.records || [];               // [{ uuid, title, url, preview_url, description, platform }]
const full = refero.refero_refero_get_style({ style_id: list[0].uuid, response_format: "json" });
// cite by record.url (styles) or record.refero_url (screens)
```

---

## 6. RESULT SHAPE

With `response_format: "json"` (recommended for programmatic use), searches return `{ pagination: {count, page, next_page, total_count, total_pages}, records: [...] }`. With the default `"md"` they return markdown reference text. `get_screen_image` returns a base64 image. Style records carry `url` + `preview_url`; screen records carry `refero_url` + `thumbnail_url` plus `hex_colors`, `ux_patterns`, `ui_elements`, and `page_types`. Full styles are large (10-15k chars), so keep `get_style` batches to 3-4 UUIDs.

---

## 7. TROUBLESHOOTING

| Symptom | Cause | Fix |
|---------|-------|-----|
| Every call returns `-32000 Connection closed` and Code Mode drops | Code Mode is on Node 25 (isolated-vm SIGSEGV) | Run Code Mode on Node 24 and rebuild isolated-vm (see the launcher pin) |
| `refero.*` tools do not resolve | Manual not loaded, or OAuth not completed | Reconnect Code Mode; complete the browser OAuth |
| Sparse flow results | Query too specific | Broaden the query, or search screens and reconstruct the journey |
| `await is only valid in async functions...` | Top-level `await` in the call_tool_chain body | Call synchronously, no `await` |

---

## 8. RELATED RESOURCES

- [`design_references_mcp.md`](../design-grounding/design_references_mcp.md) - the critique-against discipline that governs WHEN and HOW to use these tools (one reference, read live, never copy, grounding stays upstream).
- [`mobbin_tools.md`](./mobbin_tools.md) - the sibling real-world reference MCP (screens, flows).
