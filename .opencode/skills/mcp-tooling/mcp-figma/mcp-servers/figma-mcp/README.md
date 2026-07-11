---
title: "figma-mcp"
description: "The optional Figma MCP for the mcp-figma skill, reached through this project's Code Mode. A manual registration, not a vendored server."
trigger_phrases:
  - "figma mcp code mode"
  - "figma-developer-mcp"
  - "framelink figma"
---

# figma-mcp

> The OPTIONAL Figma MCP for the mcp-figma skill, reached through this project's Code Mode. Nothing is installed here: it is a manual registration, not a vendored server.

---

## 1. OVERVIEW

The community Framelink `figma-developer-mcp` server wraps the Figma REST API and simplifies file data for coding agents, turning a Figma file into design context an agent can use for codegen. It is already registered as the `figma` manual in the repo's `.utcp_config.json` (stdio, launched via `npx figma-developer-mcp`), so no install step happens in this folder. It is third-party, not Figma's official MCP.

The `figma-ds-cli` (see [`../figma-cli/`](../figma-cli/)) remains the primary surface: it authors, modifies, and exports in the live Figma Desktop session. This MCP runs only the other direction, pulling design context out of Figma and into the agent.

---

## 2. QUICK START

This manual needs no local install. Confirm it is reachable through Code Mode instead:

```ts
// Discover the live tool set before calling anything
const tools = await list_tools();
const info = await tool_info({ tool_name: "figma.figma_get_figma_data" });
```

Expected result: `list_tools()` includes the `figma` manual, and `tool_info()` returns a concrete schema for `figma.figma_get_figma_data` (or `figma.figma_download_figma_images`), the two live-confirmed tools.

---

## 3. CONFIGURATION

| Option | Value | Notes |
|---|---|---|
| Manual name | `figma` | Set in `.utcp_config.json` |
| Transport | stdio, `npx -y figma-developer-mcp --stdio` | No local vendoring |
| `.env` key | `figma_FIGMA_API_KEY` | Code Mode prefixes every manual's env vars with the manual name |
| Call syntax | `figma.figma_<tool>` | Single dot plus underscore, not `figma.figma.<tool>` |

---

## 4. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| A Code Mode `figma.figma_<tool>` call fails | The token is missing, or a tool name was assumed instead of discovered | Confirm `figma_FIGMA_API_KEY` is in `.env`, then run `search_tools()` or `tool_info()` before relying on any tool |
| `Variable 'figma_FIGMA_API_KEY' not found` | A bare `FIGMA_API_KEY` was set instead of the prefixed key | Use `figma_FIGMA_API_KEY`, since Code Mode prefixes every manual's env vars with the manual name |

---

## 5. RELATED RESOURCES

### Related Documents

| Document | Purpose |
|---|---|
| [`../figma-cli/README.md`](../figma-cli/README.md) | The primary CLI transport this MCP is an optional alternative to |
| [`../../references/mcp_wiring.md`](../../references/mcp_wiring.md) | Full wiring: the registered manual, the `.env` token, discovery, and a `call_tool_chain` example |
| [`../../SKILL.md`](../../SKILL.md) | Runtime contract for the mcp-figma skill |

### Source

- npm: [`figma-developer-mcp`](https://www.npmjs.com/package/figma-developer-mcp)
