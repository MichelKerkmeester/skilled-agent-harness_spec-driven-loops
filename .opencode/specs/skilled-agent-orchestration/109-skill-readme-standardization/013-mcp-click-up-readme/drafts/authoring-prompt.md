Spec folder: skilled-agent-orchestration/z_archive/109-skill-readme-standardization/013-mcp-click-up-readme (pre-approved, skip Gate 3). OUTPUT-ONLY task: do NOT write, create or edit any file. Return ONLY the finished README markdown in a single fenced ```markdown block as your final message. No preamble, no commentary.

Role: You are a technical writer rewriting the README for the `mcp-click-up` skill in a specific house voice.

Context you must use:
- The factual map is in `.opencode/specs/skilled-agent-orchestration/z_archive/109-skill-readme-standardization/013-mcp-click-up-readme/context/context-report.md`. Read it. Every fact, path and command must come from it (or from re-reading `.opencode/skills/mcp-click-up/` to confirm).
- The required structure and voice are in `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md`. Read it and follow the fillable scaffold exactly.
- The golden example is `.opencode/skills/sk-git/README.md`, and the same-archetype sibling already in this voice is `.opencode/skills/mcp-chrome-devtools/README.md`. Read at least one; yours should read like the mcp-chrome-devtools sibling.
- The voice rules are in `.opencode/skills/sk-doc/references/global/hvr_rules.md`. Read and obey them.

Hard requirements on facts (the current README is WRONG on MCP integration, so follow these exactly):
- MCP tool naming is `clickup.clickup_{tool_name}` (all lowercase, underscores). Do NOT write `clickup_official.clickup_official_*` anywhere.
- The MCP call pattern is the array form: `call_tool_chain([{ tool: "clickup.clickup_search_tasks", input: { ... } }])`. Do NOT use the `call_tool_chain({ code: "..." })` form.
- The official MCP server registers in the platform MCP config under `opencode.json` `mcpServers` (or `.mcp.json` / `claude_desktop_config.json`) with server key `"clickup"` and env `CLICKUP_API_KEY` plus `CLICKUP_TEAM_ID`. Do NOT mention `.utcp_config.json` or `manual_call_templates` or the server key `clickup_official`.
- Do NOT cite any version number, do NOT include a Version History section, and do NOT pin a count of operations, cupt commands, MCP tools or test scenarios (the docs disagree on these).
- The cupt install is `bash .opencode/skills/mcp-click-up/scripts/install.sh`, then `cupt auth` (or `cupt config --api-token pk_xxx`). Every cited path must resolve.

Structure and voice:
- Numbered ALL-CAPS H2 sections with `---` dividers, a numbered OVERVIEW section, sequential numbering. No table of contents.
- Frontmatter (title `mcp-click-up`, one-sentence description, trigger_phrases such as "clickup", "cupt", "task management", "time tracking", "click up"), then H1, then a one-line `>` blockquote pitch.
- Section 1 = AT A GLANCE (4-row table). Section 2 = OVERVIEW with "Why This Skill Exists" (problem-first) then "What It Does". Then QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, an optional VERIFICATION, and a final RELATED DOCUMENTS section. Drop any section that does not fit and renumber.
- Voice: no em dashes, no semicolons, no Oxford commas, no banned words, no setup phrases. Lead with the reader. Prose carries the explanation; tables only for genuine 4-plus-item lookups. Vary subsection counts.
- Lead the distinctive value: it drives ClickUp from the agent through two paths with operation-based routing, a fast cupt CLI for daily task ops (with a dry-run safety net) and the official ClickUp MCP for documents, goals and bulk work, plus agent safety invariants that force a status check and a dry-run before any completion. In QUICK START show the cupt install plus a `cupt list`/`cupt done --dry-run` command and a `call_tool_chain([...])` MCP example. In HOW IT WORKS cover the operation routing, the cupt path, the MCP path, the safety invariants, and the example workflows. INTEGRATION states the boundary with `mcp-code-mode` (which owns the MCP transport) and that only the official server is used.
- Target length roughly 230 to 330 lines. Every command shows its expected output.

Return the complete README as one ```markdown fenced block. Nothing else.
