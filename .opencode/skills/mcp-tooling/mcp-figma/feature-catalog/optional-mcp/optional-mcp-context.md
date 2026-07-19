---
title: "Optional MCP context"
description: "Pull design context FROM Figma as model input through the community Framelink figma manual in this repo's Code Mode; opt-in, discovery-first, and never the official Dev Mode MCP."
trigger_phrases:
  - "figma mcp"
  - "framelink figma mcp"
  - "figma code mode"
  - "figma_FIGMA_API_KEY"
  - "pull figma design context"
version: 1.0.0.2
---

# Optional MCP context (Code Mode figma.figma_<tool>)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The skill works fully with the CLI alone. When the agent must pull design context FROM Figma as model input, this opt-in path uses the community Framelink `figma-developer-mcp` manual, already registered as `figma` in this repo's Code Mode (`.utcp_config.json`, stdio). The CLI is the primary surface, and the MCP is opt-in.

The caller reaches this path only when CLI inspection is not enough and design data must enter the model as context. It is READ-ONLY. The boundary to hold: the OFFICIAL Figma Dev Mode MCP is out of scope for this release and is not a supported path, so it is mentioned at most as a future option, never promoted. Note that `figma-ds-cli` itself does not ship or spawn its own MCP (source-verified zero hits), and its daemon is a private HTTP/WebSocket bridge, not an MCP server.

---

## 2. HOW IT WORKS

The Framelink `figma` manual needs a Figma personal token in `.env` as `figma_FIGMA_API_KEY` (Code Mode prefixes the manual name). Calls go through `call_tool_chain()` with the naming `figma.figma_<tool>`. The agent always discovers first with `search_tools()` / `tool_info()` before invoking, and never claims a tool works until discovery confirms it. Live-confirmed tools are `get_figma_data` and `download_figma_images` (reached as `figma.figma_get_figma_data` and `figma.figma_download_figma_images`). Discovering the manual and confirming a concrete tool name and schema is the read-only first step; pulling design context with a confirmed tool is the opt-in read action.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/mcp-wiring.md` | Shared | Code Mode `figma` manual wiring, `.env` token, and `figma.figma_<tool>` naming |
| `scripts/print-utcp-snippets.sh` | Script | Prints the Code Mode `.utcp_config.json` snippet for the `figma` manual |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/optional-mcp/framelink-discovery.md` | Manual playbook | Discovers the `figma` manual and tool names live before any invocation |

---

## 4. SOURCE METADATA

- Group: Optional MCP Context
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `optional-mcp/optional-mcp-context.md`

Related references:
- [connect-and-daemon.md](../../feature-catalog/connect-and-daemon/connect-and-daemon.md) covers the primary CLI transport this path is an optional alternative to
- [inspect.md](../inspect/inspect.md) covers the CLI read-only inspect verbs that cover most read needs
