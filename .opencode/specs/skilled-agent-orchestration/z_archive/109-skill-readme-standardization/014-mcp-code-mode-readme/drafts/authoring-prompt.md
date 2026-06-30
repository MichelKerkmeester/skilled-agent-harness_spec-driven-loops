Spec folder: skilled-agent-orchestration/z_archive/109-skill-readme-standardization/014-mcp-code-mode-readme (pre-approved, skip Gate 3). OUTPUT-ONLY task: do NOT write, create or edit any file. Return ONLY the finished README markdown in a single fenced ```markdown block as your final message. No preamble, no commentary.

Role: You are a technical writer rewriting the README for the `mcp-code-mode` skill in a specific house voice.

Context you must use:
- The factual map is in `.opencode/specs/skilled-agent-orchestration/z_archive/109-skill-readme-standardization/014-mcp-code-mode-readme/context/context-report.md`. Read it. Every fact, path and command must come from it (or from re-reading `.opencode/skills/mcp-code-mode/` to confirm).
- The required structure and voice are in `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md`. Read it and follow the fillable scaffold exactly.
- The golden example is `.opencode/skills/sk-git/README.md`, and a same-family sibling already in this voice is `.opencode/skills/mcp-chrome-devtools/README.md`. Read at least one.
- The voice rules are in `.opencode/skills/sk-doc/references/global/hvr_rules.md`. Read and obey them.

Hard requirements on facts:
- The canonical call form for THIS skill is the code form: `call_tool_chain({ code: "...TypeScript..." })`. Use it. Do NOT use the array `call_tool_chain([{ tool, input }])` form here.
- The four core tools are `search_tools`, `list_tools`, `tool_info`, `call_tool_chain`. You may mention the auxiliary runtime tools `register_manual` and `get_required_keys_for_tool` where relevant.
- You MUST document the naming rule and its number-one-error translation: tool naming is `{manual_name}.{manual_name}_{tool_name}`; `list_tools()` returns dotted `a.b.c` names but a call uses the dot-then-underscore form `a.a_b_c()`; `tool_info()` shows the correct syntax.
- You MUST mention the `.env` prefix gotcha: env vars are prefixed by the manual name (`clickup_CLICKUP_API_KEY`, not `CLICKUP_API_KEY`). Setup is `.utcp_config.json` plus `.env` at the project root.
- The context-reduction figure is consistent and may be cited: roughly 98% (about 1.6k tokens versus 141k for 47 tools), flat as servers grow.
- Do NOT cite any version number (the docs say 1.0.7.0, 1.0.9 and 2.0.0). Do NOT pin a manual count, a tool count or a catalog count (the docs disagree). Do NOT cite `.DS_Store`. Every cited path must resolve.

Structure and voice:
- Numbered ALL-CAPS H2 sections with `---` dividers, a numbered OVERVIEW section, sequential numbering. No table of contents.
- Frontmatter (title `mcp-code-mode`, one-sentence description, trigger_phrases such as "code mode", "call_tool_chain", "mcp tools", "tool orchestration", "context reduction"), then H1, then a one-line `>` blockquote pitch.
- Section 1 = AT A GLANCE (4-row table). Section 2 = OVERVIEW with "Why This Skill Exists" (problem-first) then "What It Does". Then QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, an optional VERIFICATION, and a final RELATED DOCUMENTS section. Drop any section that does not fit and renumber.
- Voice: no em dashes, no semicolons, no Oxford commas, no banned words, no setup phrases. Lead with the reader. Prose carries the explanation; tables only for genuine 4-plus-item lookups. Vary subsection counts.
- Lead the distinctive value: Code Mode is the execution engine that lets an agent call hundreds of external MCP tools by writing TypeScript that runs in one execution, discovering tool schemas on demand (progressive disclosure) so the context stays flat (roughly 98% smaller) regardless of how many servers are configured. It is the shared transport the other mcp-* skills build on. In QUICK START show the four-step workflow (search_tools, tool_info, then a `call_tool_chain({ code })` block). In HOW IT WORKS cover the four tools, progressive disclosure, the naming translation rule, state persistence and error handling. INTEGRATION states that Code Mode only reaches `.utcp_config.json` tools (not native MCP in opencode.json) and that mcp-chrome-devtools and mcp-click-up consume it.
- Target length roughly 230 to 330 lines. Every command shows its expected output.

Return the complete README as one ```markdown fenced block. Nothing else.
