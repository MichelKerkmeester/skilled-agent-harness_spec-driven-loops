#!/usr/bin/env bash
# Print the OPTIONAL Code Mode wiring for the Framelink figma MCP manual.
# PRINTS ONLY — never edits .utcp_config.json or .env. The official Figma Dev Mode
# MCP is out of scope for this skill release.

set -euo pipefail

cat <<'EOF'
== Optional Figma MCP via Code Mode (Framelink) — print only ==

This project already ships a Code Mode manual named "figma" (figma-developer-mcp).
If it is missing from .utcp_config.json, add this entry under manual_call_templates[]:

{
  "name": "figma",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "figma": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "figma-developer-mcp@latest", "--stdio"],
        "env": { "FIGMA_API_KEY": "${FIGMA_API_KEY}" }
      }
    }
  }
}

Then add the token to .env (Code Mode PREFIXES the variable with the manual name):

  figma_FIGMA_API_KEY=figd_your_token_here

Get a token: Figma -> Settings -> Security -> Personal access tokens.

Verify in Code Mode (do not guess tool names):
  list_tools()                       # confirm a "figma.*" manual appears
  search_tools({ task_description: "figma design file", limit: 10 })
  tool_info({ tool_name: "figma.figma_<tool>" })

Call pattern (naming = {manual}.{manual}_{tool}):
  call_tool_chain({ code: `
    const data = await figma.figma_get_file({ /* args per tool_info */ });
    return { data };
  ` })

This script changed nothing. Edit .utcp_config.json / .env yourself after review.
EOF
