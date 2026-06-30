Act as a skill designer and adversarial reviewer. READ-ONLY task: do not create, modify, or delete any file. Output your COMPLETE findings as your final reply (structured markdown).

GOAL: design the new `mcp-open-design` skill and adversarially stress-test the terminal-control claims about the Open Design desktop app.

CONTEXT:
- We are creating `.opencode/skills/mcp-open-design` — a skill that teaches a terminal agent (opencode / Claude Code) to drive the installed Open Design desktop app from the terminal (NOT via the app's chat UI). Model it on the EXISTING skill at `.opencode/skills/mcp-magicpath` — READ its `SKILL.md` in full as the template: section structure, ALWAYS/NEVER rules, resource-loading table, smart-routing, and how it wires an external design tool into the workflow.
- Open Design (v0.9.0, installed at `/Applications/Open Design.app`) exposes: an `od` CLI (engine `bin/vela`), a stdio MCP server `od mcp` (tools: `list_projects, get_active_context, get_file, search_files, list_files, get_artifact, get_project, create_artifact`), and headless verbs (`automation, ui, artifacts, media, research, plugin, tools, memory`). Installed per-agent via `od mcp install <agent>` (supports opencode + claude). It bundles ~150 design-systems + ~139 skills + 111 design-templates and bills itself "the official open-source, local-first Claude Design alternative," working with opencode/claude. The daemon runs from the desktop app over Unix sockets (`/tmp/open-design/ipc/release-stable/*.sock`); `od mcp` auto-discovers the live daemon URL.
- Sibling skill `sk-design-interface` (design judgment) will integrate with this new skill.

TASKS:
1. Propose the `mcp-open-design` SKILL.md design: section outline mirroring mcp-magicpath (WHEN TO USE / SMART ROUTING / HOW IT WORKS / RULES / REFERENCES / SUCCESS CRITERIA / INTEGRATION POINTS), the ALWAYS and NEVER rules, the wiring instructions (`od mcp install opencode|claude` plus a manual MCP config fallback), which OD verbs to surface vs omit, and the integration hook with `sk-design-interface`.
2. Adversarial cross-check — stress these and flag what MUST be verified live: (a) does the daemon need to be running for `od mcp` to work? (b) does `od mcp` work when the desktop app is CLOSED (can `od --no-open` run a headless daemon)? (c) is `127.0.0.1:7456` real or socket-only on the desktop build? (d) is `create_artifact` mutating — is it safe to expose, and how to gate it? (e) any account/auth requirement to use the local tools?
3. What to EXCLUDE (scope discipline) and the three biggest risks to the skill being inaccurate.

METHOD: READ-ONLY (read `mcp-magicpath/SKILL.md` and, if useful, the Open Design bundle). Do not write files. Be concrete and cite what you read.
