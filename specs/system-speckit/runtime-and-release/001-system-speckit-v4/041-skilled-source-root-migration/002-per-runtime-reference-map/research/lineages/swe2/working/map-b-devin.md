## runtime:devin — 4 files

| file | `.opencode` lines | what the reference does | origin | needed change | class |
|---|---|---|---|---|---|
| `.devin/SYNC.md` | :3,20,30,35,39,55,58,100 (+4 more) | documents the runtime's derivation contract | authored | rewrite: the manifest describes `.opencode`-as-source; post-move it must describe `.skilled` as source and `.opencode` as consumer | manual |
| `.devin/hooks.v1.json` | :8,13,18,23,28,33,45,50 (+15 more) | registers runtime hooks — `.opencode` refs are generated command strings | generated — `sync-hook-registrations.cjs` from `hook-registry.json` | regenerate after registry `script` paths change (or compat) | regenerate |
| `.devin/hooks/README.md` | :3,11,42,62,63 | documents the mirror surface | authored | mechanical rewrite of prose refs | mechanical |
| `.devin/mcp_config.json` | :6 | registers the code_mode MCP server — `args`/`command` execs `.opencode/bin/mcp-code-mode-launcher.cjs` | authored | point the launcher arg at `.skilled/bin/mcp-code-mode-launcher.cjs` (or compat) | mechanical |
