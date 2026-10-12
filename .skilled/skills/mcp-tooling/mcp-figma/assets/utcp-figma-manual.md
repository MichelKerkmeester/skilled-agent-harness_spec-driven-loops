---
title: Figma Code Mode Manual - Framelink figma snippet
description: Paste-ready .utcp_config.json manual entry plus .env note for the optional community Framelink figma MCP via Code Mode.
trigger_phrases:
  - "figma code mode manual"
  - "framelink figma utcp config"
  - "figma developer mcp snippet"
  - "figma mcp env key"
importance_tier: normal
contextType: implementation
version: 1.0.0.2
---

# Figma Code Mode Manual - Framelink figma snippet

Paste-ready `.utcp_config.json` manual entry and the matching `.env` note for the OPTIONAL community Framelink `figma` MCP, wired through this project's Code Mode.

---

## 1. OVERVIEW

### Purpose

The mcp-figma skill works fully with the `figma-ds-cli` alone. This asset is for the opt-in path only: when the agent must pull design context FROM Figma (design data, variables, screenshots) as model input. It packages the community Framelink `figma-developer-mcp` manual entry (stdio) and its prefixed `.env` key so the manual can be added to Code Mode's `.utcp_config.json`.

This is the community Framelink MCP, not the official Figma Dev Mode MCP server. The official Dev Mode MCP stays out of scope (future option only) and must not be promoted as the wiring here.

### Usage

Add the manual object below into the `manual_call_templates` array of the project's `.utcp_config.json`, then put the prefixed key in `.env` (see [env-template.md](./env-template.md)). Code Mode names the manual `figma`, so calls are `figma.figma_<tool>` via `call_tool_chain()`, and the env var is prefixed `figma_`. Always discover the live surface with `search_tools()` / `tool_info()` before invoking, and do not assume a tool exists.

---

## 2. UTCP MANUAL ENTRY

**Key Points**:
- Manual `name` is `figma` → call namespace is `figma.figma_<tool>` and env prefix is `figma_`.
- Transport is `stdio`, and the server is the community `figma-developer-mcp` (Framelink), launched on demand via `npx`.
- The server needs a Figma personal access token, referenced as `${FIGMA_API_KEY}` and supplied in `.env` as `figma_FIGMA_API_KEY`.
- Live-confirmed tools are `get_figma_data` and `download_figma_images`, but verify the rest of the surface at runtime.

**Template** (add to `manual_call_templates` in `.utcp_config.json`):

```json
{
  "name": "figma",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "figma": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "figma-developer-mcp", "--stdio"],
        "env": {
          "FIGMA_API_KEY": "${FIGMA_API_KEY}"
        }
      }
    }
  }
}
```

**Field Guidelines**:

**`name`**:
- Manual namespace. Keep it `figma` so calls resolve as `figma.figma_<tool>` and env vars resolve as `figma_<VAR>`.

**`args`**:
- `["-y", "figma-developer-mcp", "--stdio"]` runs the Framelink server on demand over stdio. The `-y` flag avoids an interactive npx prompt.

**`env.FIGMA_API_KEY`**:
- References `${FIGMA_API_KEY}`. Code Mode prefixes it with the manual name, so the actual `.env` key is `figma_FIGMA_API_KEY`.

---

## 3. .ENV NOTE

**Key Points**:
- Code Mode prefixes every env var with `{manual_name}_`. With manual `figma`, the `.env` key is `figma_FIGMA_API_KEY` (NOT bare `FIGMA_API_KEY`).
- The value is a Figma personal access token from Figma → Settings → Account → Personal Access Tokens.
- Never commit `.env`, and never paste the token into user-facing output.

**Template** (add to `.env`):

```bash
# Figma (Code Mode prefixes env vars with the manual name "figma")
figma_FIGMA_API_KEY=figd_your_token_here
```

---

## 4. CALL EXAMPLE

**Discover first, then call** through Code Mode's `call_tool_chain()`:

```typescript
call_tool_chain({
  code: `
    // 1) Confirm the manual + tool names exist before relying on them.
    const info = await tool_info({ tool_name: "figma.figma_get_figma_data" });
    // 2) Live-confirmed read tool: pull design data for a file/node.
    const data = await figma.figma_get_figma_data({ fileKey: "<file-key>" });
    return { ok: true, info };
  `
});
```

The other live-confirmed tool is `figma.figma_download_figma_images` (export node images). Treat both as read-only context pulls. The CLI (`figma-ds-cli`) remains the surface for any authoring or mutation.

---

## 5. RELATED RESOURCES

- [env-template.md](./env-template.md) - The prefixed `.env` line for the Figma token.
- [mcp-wiring.md](../references/mcp-wiring.md) - The full optional Figma MCP wiring reference (discovery, gating, Code Mode env-var prefix).
