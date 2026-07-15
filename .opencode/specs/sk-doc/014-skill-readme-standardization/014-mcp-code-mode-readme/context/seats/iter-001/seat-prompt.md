Spec folder: sk-doc/014-skill-readme-standardization/014-mcp-code-mode-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file, and do not run the skill or install anything. Return findings as your final assistant message only.

Role: You are a documentation analyst gathering an accurate factual map of one skill so its README can be rewritten.

Context: The skill lives at `.opencode/skills/mcp-code-mode/`. Read its `SKILL.md` in full, its current `README.md`, its `INSTALL_GUIDE.md`, and the files under `references/`, `assets/`, `scripts/` and `mcp_server/`. Stay within that skill directory. This skill is the Code Mode execution engine: it lets an agent call external MCP tools by writing TypeScript that runs in one execution, loading tool schemas on demand (progressive disclosure) rather than injecting every tool definition into context. The sibling mcp-* skills (mcp-chrome-devtools, mcp-click-up) consume Code Mode; describe that boundary.

Action: Produce a factual map for a README rewrite. Report under exactly these eight headings:

1. PURPOSE — one sentence: what the skill does.
2. PROBLEM — 2 to 4 sentences: the human pain point it removes (problem-first, not a feature list). Why loading every external MCP tool definition into the context window is expensive, and how on-demand discovery plus one TypeScript execution fixes it.
3. MODES & CAPABILITIES — the four Code Mode tools (`search_tools`, `list_tools`, `tool_info`, `call_tool_chain`) and what each does, plus the headline capabilities (progressive disclosure, the context reduction, state persistence across a chain, built-in error handling), each one line.
4. INVOCATION — how the four tools are called, the `call_tool_chain` form(s) this skill documents, and the tool-naming convention (`{manual_name}.{manual_name}_{tool_name}`, including the dotted-list vs underscore-call gotcha). Note `.utcp_config.json` and `.env` setup.
5. KEY FILES — a table of the real files (path + one-line purpose): SKILL.md, INSTALL_GUIDE.md, references, assets, scripts, mcp_server.
6. BOUNDARIES — what it does NOT do (Code Mode only accesses tools in `.utcp_config.json`, not native MCP servers in opencode.json), and that the consumer mcp-* skills build on it.
7. TROUBLESHOOTING & FAQ MATERIAL — common failure modes (tool not found, naming format, config missing), gotchas, and the 2 to 4 questions a user actually asks.
8. STALE FACTS — anything in the current README.md that is inaccurate versus SKILL.md and the real files (counts, paths, version, the context-reduction figure, tool names). Write "none found" if clean.

Format: Return one structured markdown report under those eight numbered headings. Cite real file paths verbatim. Mark anything you cannot verify as UNKNOWN. No preamble, no closing commentary.
