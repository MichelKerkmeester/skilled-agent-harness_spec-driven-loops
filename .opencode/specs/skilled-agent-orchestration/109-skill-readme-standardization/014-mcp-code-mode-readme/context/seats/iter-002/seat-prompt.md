Spec folder: skilled-agent-orchestration/z_archive/109-skill-readme-standardization/014-mcp-code-mode-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file, and do not run or install anything. Return findings as your final assistant message only.

Role: You are verifying exact facts about the `.opencode/skills/mcp-code-mode/` skill so a README rewrite cites them correctly. This pass locks the precise, citable details and finds stale facts.

Context: Read `.opencode/skills/mcp-code-mode/SKILL.md` in full, its current `README.md`, its `INSTALL_GUIDE.md`, and the `references/`, `assets/` and `mcp_server/` files. Verify against real file contents, not memory. This skill is the Code Mode execution engine (TypeScript execution over external MCP tools with progressive disclosure).

Action: Report under exactly these six headings, every claim cited to a real file path:

1. EXACT INVOCATION — the precise signatures of the four tools (`search_tools`, `list_tools`, `tool_info`, `call_tool_chain`), the exact `call_tool_chain` form(s) the skill documents (quote them), and the tool-naming convention with the dotted-vs-underscore rule. Note the `.utcp_config.json` / `.env` setup.
2. CAPABILITY ROSTER — the progressive-disclosure workflow (the ordered steps), the exact context-reduction figure as stated, state persistence and error handling, copied verbatim with citations.
3. KEY FILES — a table of the real files (path + one-line role): SKILL.md, INSTALL_GUIDE.md, every references/ file, assets, scripts, mcp_server.
4. WORKFLOWS & OUTPUTS — the documented end-to-end workflow (discover, confirm syntax, execute) and any example chains, what they produce, cited.
5. TROUBLESHOOTING & FAQ — the concrete failure modes (tool not found, wrong naming format, config missing, native-vs-Code-Mode confusion) and the 3 to 5 questions a user most likely asks, with short grounded answers.
6. STALE FACTS IN CURRENT README — list every claim in the current `README.md` that disagrees with `SKILL.md`, `INSTALL_GUIDE.md` or the real files (counts, paths, version, the context-reduction figure, tool names, the call_tool_chain form). Write "none found" if clean.

Format: One structured markdown report under those six numbered headings. Cite real file paths verbatim. Mark anything unverifiable as UNKNOWN. No preamble.
