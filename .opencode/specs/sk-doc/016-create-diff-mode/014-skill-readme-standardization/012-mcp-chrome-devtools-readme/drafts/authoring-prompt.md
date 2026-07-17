Spec folder: sk-doc/014-skill-readme-standardization/012-mcp-chrome-devtools-readme (pre-approved, skip Gate 3). OUTPUT-ONLY task: do NOT write, create or edit any file. Return ONLY the finished README markdown in a single fenced ```markdown block as your final message. No preamble, no commentary.

Role: You are a technical writer rewriting the README for the `mcp-chrome-devtools` skill in a specific house voice.

Context you must use:
- The factual map is in `.opencode/specs/sk-doc/014-skill-readme-standardization/012-mcp-chrome-devtools-readme/context/context-report.md`. Read it. Every fact, path and command must come from it (or from re-reading `.opencode/skills/mcp-chrome-devtools/` to confirm).
- The required structure and voice are in `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md`. Read it and follow the fillable scaffold exactly.
- The golden example is `.opencode/skills/sk-git/README.md`. Read it; yours should read like it.
- The voice rules are in `.opencode/skills/sk-doc/references/global/hvr_rules.md`. Read and obey them.

Hard requirements on facts (this skill has heavy internal drift, so follow these exactly):
- Do NOT cite any version number anywhere (the docs disagree: 1.0.7.0, 1.0.8.0, 2.1.0).
- Do NOT pin a CDP method count (the docs say both 300+ and 644). Instead say the CLI reaches the full Chrome DevTools Protocol surface while the MCP path exposes a curated subset.
- Do NOT cite a hard MCP tool count (the docs say 7, 12 and 26). List capability categories instead.
- Use the bdg command forms from the context report (SKILL.md authority): `bdg dom screenshot <path>`, `bdg console --list`, `bdg network har <path>`, `bdg dom eval`, `bdg dom query`, `bdg cdp --list` / `--describe` / `--search`. Do NOT use the INSTALL_GUIDE shorthand (`bdg screenshot`, `bdg js`, `bdg --list`).
- Use `chrome-devtools-mcp@latest` (not `@0.26.0`) and Node 18+ (not 14.x+).
- Every cited path must resolve. Do not cite `.opencode/skills/.advisor-state/...`.

Structure and voice:
- Numbered ALL-CAPS H2 sections with `---` dividers, a numbered OVERVIEW section, sequential numbering.
- Frontmatter (title `mcp-chrome-devtools`, one-sentence description, trigger_phrases such as "chrome devtools", "browser debugging", "bdg", "screenshot", "browser automation"), then H1, then a one-line `>` blockquote pitch.
- Section 1 = AT A GLANCE (4-row table). Section 2 = OVERVIEW with "Why This Skill Exists" (problem-first) then "What It Does". Then QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, an optional VERIFICATION, and a final RELATED DOCUMENTS section. Drop any section that does not fit and renumber.
- Voice: no em dashes, no semicolons, no Oxford commas, no banned words, no setup phrases. Lead with the reader. Prose carries the explanation; tables only for genuine 4-plus-item lookups. Vary subsection counts.
- Lead the distinctive value: it drives a real browser from the agent through two paths, a fast token-efficient CLI (`bdg`, self-documenting, full CDP surface) for the common case and a Code Mode MCP path for parallel isolated sessions and multi-tool chaining, and it routes between them. In QUICK START show the CLI install plus a `bdg` command, and a `call_tool_chain()` MCP example. In HOW IT WORKS cover the routing rule, the CLI path, the MCP path (isolated instances), and the example workflows. INTEGRATION states the boundary with `mcp-code-mode` (which owns the MCP transport) and that this is not a cross-browser test framework (Chrome, Chromium and Edge only).
- Target length roughly 230 to 330 lines. Every command shows its expected output.

Return the complete README as one ```markdown fenced block. Nothing else.
