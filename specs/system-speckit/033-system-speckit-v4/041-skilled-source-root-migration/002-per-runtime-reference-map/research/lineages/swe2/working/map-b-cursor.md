## runtime:cursor — 7 files

| file | `.opencode` lines | what the reference does | origin | needed change | class |
|---|---|---|---|---|---|
| `.cursor/SYNC.md` | :3,23,32,33,37,46,56,59 (+4 more) | documents the runtime's derivation contract | authored | rewrite: the manifest describes `.opencode`-as-source; post-move it must describe `.skilled` as source and `.opencode` as consumer | manual |
| `.cursor/commands/goal-cursor.md` | :28,46 | hand-authored native command; embeds an executable `.opencode` path | authored (exempt from prompt generators per `command-scope.cjs`) | mechanical rewrite of the embedded command | mechanical |
| `.cursor/commands/vision.md` | :32 | hand-authored native command; embeds an executable `.opencode` path | authored (exempt from prompt generators per `command-scope.cjs`) | mechanical rewrite of the embedded command | mechanical |
| `.cursor/hooks.json` | :6,11,16,21,26,31,36,43 (+10 more) | registers runtime hooks — `.opencode` refs are generated command strings | generated — `sync-hook-registrations.cjs` from `hook-registry.json` | regenerate after registry `script` paths change (or compat) | regenerate |
| `.cursor/hooks/README.md` | :3,11,42,49,68,69 | documents the mirror surface | authored | mechanical rewrite of prose refs | mechanical |
| `.cursor/mcp.json` | :6 | registers the code_mode MCP server — `args`/`command` execs `.opencode/bin/mcp-code-mode-launcher.cjs` | authored | point the launcher arg at `.skilled/bin/mcp-code-mode-launcher.cjs` (or compat) | mechanical |
| `.cursor/rules/skill-routing.md` | :9,10,11,12,13,14,15,16 (+2 more) | routing rules + generated Gate-1 pointer block | authored + generated block — `sync-gate1-pointers.cjs` | rewrite authored refs (:9-16 list `.opencode/skills/*/SKILL.md`); regenerate the Gate-1 block | mechanical |
