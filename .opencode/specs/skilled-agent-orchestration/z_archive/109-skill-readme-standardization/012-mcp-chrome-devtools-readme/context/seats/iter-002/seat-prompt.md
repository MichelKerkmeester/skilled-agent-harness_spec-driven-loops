Spec folder: skilled-agent-orchestration/z_archive/109-skill-readme-standardization/012-mcp-chrome-devtools-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file, and do not run or install anything. Return findings as your final assistant message only.

Role: You are verifying exact facts about the `.opencode/skills/mcp-chrome-devtools/` skill so a README rewrite cites them correctly. This pass locks the precise, citable details and finds stale facts.

Context: Read `.opencode/skills/mcp-chrome-devtools/SKILL.md` in full, its current `README.md`, its `INSTALL_GUIDE.md`, and the `references/` and `examples/` files. Verify against real file contents, not memory. The skill routes between the `bdg` (browser-debugger-cli) CLI path and the Chrome DevTools path via Code Mode MCP.

Action: Report under exactly these six headings, every claim cited to a real file path:

1. EXACT INVOCATION — the precise `bdg` install command and key subcommands/flags (quoted), and the exact Code Mode MCP `call_tool_chain()` pattern plus the tool-naming convention. Note what each path produces and where (screenshots, logs, traces).
2. CAPABILITY ROSTER — the exact routing rule between the CLI and MCP paths, and the concrete capability list (navigation, screenshots, network, console, viewport, clicks, form fill, hover, keyboard, waits, sessions), copied.
3. KEY FILES — a table of the real files (path + one-line role): SKILL.md, INSTALL_GUIDE.md, every references/ file, examples, scripts.
4. WORKFLOWS & OUTPUTS — the documented end-to-end workflows (the examples scripts: animation testing, multi-viewport, performance baseline) and what they produce, cited.
5. TROUBLESHOOTING & FAQ — the concrete failure modes (CLI not installed, Code Mode not configured, browser not reachable, session cleanup) and the 3 to 5 questions a user most likely asks, with short grounded answers.
6. STALE FACTS IN CURRENT README — list every claim in the current `README.md` that disagrees with `SKILL.md`, `INSTALL_GUIDE.md` or the real files (counts, paths, version, install command, tool names). Write "none found" if clean.

Format: One structured markdown report under those six numbered headings. Cite real file paths verbatim. Mark anything unverifiable as UNKNOWN. No preamble.
