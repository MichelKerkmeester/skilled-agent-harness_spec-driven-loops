# figma-mcp

The OPTIONAL Figma MCP for the mcp-figma skill, reached through this project's Code Mode. Nothing is installed here: it is a manual registration, not a vendored server.

## 1. OVERVIEW

The community Framelink `figma-developer-mcp` server wraps the Figma REST API and simplifies file data for coding agents (design context an agent can turn into code). It is already registered as the `figma` manual in the repo's `.utcp_config.json` (stdio, launched via `npx figma-developer-mcp`), so no install step is needed here. It is third-party, not Figma's official MCP.

## Use

The MCP is opt-in for pulling design context and referenced images/SVGs into the agent for codegen. Discover the live tools first (`get_figma_data` and `download_figma_images` are currently confirmed), and do not assume any tool exists or is read-only. The primary surface is the `figma-ds-cli` (see `../figma-cli/`), which authors, modifies, and exports in the live Figma Desktop session. Wiring, the prefixed `.env` token, and the discover-first flow are documented in `../../references/mcp_wiring.md`.

## Source

- **npm:** https://www.npmjs.com/package/figma-developer-mcp
