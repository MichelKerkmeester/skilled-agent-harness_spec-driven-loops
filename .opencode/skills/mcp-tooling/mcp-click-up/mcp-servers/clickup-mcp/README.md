# clickup-mcp

Official ClickUp MCP server embedded in the mcp-click-up skill.

## Source

- **GitHub:** https://github.com/clickup/clickup-mcp-server
- **npm:** https://www.npmjs.com/package/@clickup/mcp-server

## Install

```bash
npm install
```

Vendors `@clickup/mcp-server` into `node_modules/` for local use.

## Configuration

Set these environment variables before starting:

| Variable | Description |
|----------|-------------|
| `CLICKUP_API_KEY` | Personal API Token from https://app.clickup.com/settings/apps |
| `CLICKUP_TEAM_ID` | Numeric workspace ID (run `cupt status` to find it) |

## Run via npx (no install needed)

```bash
npx -y @clickup/mcp-server
```

## Run from local node_modules

```bash
npm install
node node_modules/@clickup/mcp-server/dist/index.js
```

## Platform config (OpenCode / Code Mode)

```json
{
  "mcp": {
    "code_mode": {
      "type": "local",
      "command": ["node", ".opencode/skills/mcp-code-mode/mcp_server/dist/index.js"],
      "environment": {
        "UTCP_CONFIG_FILE": ".utcp_config.json"
      }
    }
  }
}
```

In `.utcp_config.json`, register ClickUp under `manual_call_templates`:

```json
{
  "name": "clickup_official",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "clickup_official": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "@clickup/mcp-server"],
        "env": {
          "CLICKUP_API_KEY": "${CLICKUP_API_KEY}",
          "CLICKUP_TEAM_ID": "${CLICKUP_TEAM_ID}"
        }
      }
    }
  }
}
```

See `../../INSTALL_GUIDE.md §4` for full platform-specific config blocks.
