# clickup-mcp

The official ClickUp MCP server is remote and hosted by ClickUp. There is no
package to vendor into this folder, `npm install` here does nothing useful.

## Source

- **Server:** `https://mcp.clickup.com/mcp`
- **Docs:** https://developer.clickup.com/docs/connect-an-ai-assistant-to-clickups-mcp-server

## Auth

OAuth 2.1 + PKCE only. ClickUp does not support API keys or access tokens for
this server. The first connection opens a browser to authorize, there is no
token or workspace ID to configure.

## Connect via Code Mode

Register the manual in `.utcp_config.json` under `manual_call_templates`, this
uses the generic `mcp-remote` bridge package (fetched on demand via `npx`, not
ClickUp-specific) to reach the remote server over stdio:

```json
{
  "name": "clickup",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "clickup": {
        "transport": "stdio",
        "command": "npx",
        "args": ["mcp-remote", "https://mcp.clickup.com/mcp"],
        "env": {}
      }
    }
  }
}
```

See `../../INSTALL_GUIDE.md §4` for other clients (native remote-MCP support,
or the same `mcp-remote` bridge for other stdio-only clients).
