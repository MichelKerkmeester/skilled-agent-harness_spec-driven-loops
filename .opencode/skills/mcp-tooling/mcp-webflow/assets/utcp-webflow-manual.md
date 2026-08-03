# Registered `webflow` manual — reference shape

The entry below is the **reference shape** of the registered `webflow` manual in
`.utcp_config.json` (registered 2026-08-02). Treat it as a reference only: the live config is
authoritative — verify, never re-add, never edit.

```json
{
  "name": "webflow",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "webflow": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "webflow-mcp-server@latest"],
        "env": { "WEBFLOW_TOKEN": "${WEBFLOW_TOKEN}" }
      }
    }
  }
}
```

- `transport: stdio` — Code Mode consumes stdio; the official server ships as a Node CLI.
- `args` resolve the server via npx; **pin the exact version** after the first verified session.
- `env` binds the token placeholder from the operator environment — the value never lives in the
  repository. `.env.example` documents the namespaced name `webflow_WEBFLOW_TOKEN` only.
- Server runtime: Node 22.3.0+.
