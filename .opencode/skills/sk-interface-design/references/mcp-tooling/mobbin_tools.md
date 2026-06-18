---
title: "Mobbin MCP Tools Reference"
description: "Tool catalog for the Mobbin MCP (search_screens, search_flows): the verified Code Mode call convention, arguments, result shape, and troubleshooting. The critique-against discipline lives in design_references_mcp.md."
trigger_phrases:
  - "mobbin mcp tools"
  - "mobbin search_screens search_flows"
  - "mobbin code mode invocation"
  - "real app screens reference tooling"
importance_tier: normal
contextType: implementation
---

# Mobbin MCP Tools Reference

**MCP server:** `https://api.mobbin.com/mcp` (remote HTTP, OAuth, paid subscription)
**Bridge:** `npx -y mcp-remote https://api.mobbin.com/mcp` (stdio), the `mobbin` manual in `.utcp_config.json`
**Invocation:** Code Mode `call_tool_chain` (`mcp__code_mode__call_tool_chain`), accessed as `mobbin.mobbin_<tool>(args)`
**Runtime:** Code Mode must run on Node 24. isolated-vm has no Node 25 build, so `call_tool_chain` SIGSEGVs and drops the connection under Node 25.

---

## 1. OVERVIEW

Mobbin indexes real, shipped iOS and web app screens and flows. It exposes two natural-language search tools. Inside sk-interface-design these are a CRITIQUE-AGAINST reference: name the real-world default for a pattern, then deviate from it deliberately. The discipline (one reference, read live, never copy) lives in `design_references_mcp.md`; this file is the tool catalog.

---

## 2. PREREQUISITES

- Code Mode configured with the `mobbin` manual in `.utcp_config.json`, running on Node 24.
- A paid Mobbin subscription and a completed browser OAuth (mcp-remote opens the flow on first connect; the token caches under `~/.mcp-auth`).
- Manuals load at Code Mode startup, so a freshly-wired manual needs a Code Mode reconnect before its tools resolve.

---

## 3. AUTHENTICATION

OAuth, handled by the mcp-remote bridge. There is no token in `.utcp_config.json`: mcp-remote runs the browser authorization and caches it. If the `mobbin.*` tools resolve (visible via `search_tools` / `list_tools`), the bridge is connected and authorized.

---

## 4. TOOLS

| Tool | Arguments | Returns |
|------|-----------|---------|
| `mobbin.mobbin_search_screens` | `query` (NL, one screen), `platform` `"ios"\|"web"` (required), `mode?` `"standard"\|"deep"`, `limit?`, `exclude_screen_ids?`, `image_format?` `"webp"\|"jpg"` | `screens[]` of `{id, app_name, platform, image_url, mobbin_url}` plus inline image blocks |
| `mobbin.mobbin_search_flows` | `query` (NL, one journey), `platform` `"ios"\|"web"` (required), `limit?`, `page?` (max 20), `image_format?` | `flows[]` of `{id, name, actions[], app_name, platform, screen_count, screens[]}` plus preview image blocks |

**Query guidance (from the tools):** describe ONE screen or journey in plain language and be specific. Name a real app to filter to it (for example "Duolingo onboarding"). Do not combine multiple screens or intents in one query, do not use negations, do not use vague style words ("modern", "clean"), and do not put the platform in the query (use the parameter). `mode: "deep"` on search_screens runs an AI-scored pipeline for nuanced queries; `"standard"` is faster.

---

## 5. INVOCATION (CODE MODE, VERIFIED LIVE)

Call the tools synchronously inside the `call_tool_chain` TypeScript body. Top-level `await` is a syntax error (the isolate runs a script, not a module), and the tools resolve synchronously:

```typescript
const res = mobbin.mobbin_search_screens({
  query: "onboarding welcome screen with progress indicator",
  platform: "ios",
  limit: 3
});
const screens = (res.find(b => b && b.screens) || {}).screens || [];
// screens[i].mobbin_url is the citable link; screens[i].app_name is the source app
```

---

## 6. RESULT SHAPE

Each tool returns the MCP **content array**. The FIRST block is the parsed data object (`.screens` for search_screens, `.flows` for search_flows), followed by `type: "image"` blocks (webp or jpg) holding the previews. Extract the data with `res.find(b => b && b.screens)` (or `.flows`). Cite each result by its `mobbin_url`, and examine the images for actual content rather than judging from metadata alone.

---

## 7. TROUBLESHOOTING

| Symptom | Cause | Fix |
|---------|-------|-----|
| Every call returns `-32000 Connection closed` and the whole Code Mode connection drops | Code Mode is on Node 25 (isolated-vm SIGSEGV at isolate creation) | Run Code Mode on Node 24 and rebuild isolated-vm (the Code Mode launcher pin) |
| `mobbin.*` tools do not resolve | Manual not loaded, or OAuth not completed | Reconnect Code Mode (manuals load at startup); complete the browser OAuth |
| `await is only valid in async functions...` | Top-level `await` in the call_tool_chain body | Call synchronously, no `await` |

---

## 8. RELATED RESOURCES

- [`design_references_mcp.md`](../design-grounding/design_references_mcp.md) - the critique-against discipline that governs WHEN and HOW to use these tools (one reference, read live, never copy, grounding stays upstream).
- [`refero_tools.md`](./refero_tools.md) - the sibling real-world reference MCP (styles, screens, flows).
