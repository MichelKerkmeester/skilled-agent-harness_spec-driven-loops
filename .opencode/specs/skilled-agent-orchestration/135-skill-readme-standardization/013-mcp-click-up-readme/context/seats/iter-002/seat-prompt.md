Spec folder: skilled-agent-orchestration/135-skill-readme-standardization/013-mcp-click-up-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file, and do not run or install anything. Return findings as your final assistant message only.

Role: You are verifying exact facts about the `.opencode/skills/mcp-click-up/` skill so a README rewrite cites them correctly. This pass locks the precise, citable details and finds stale facts.

Context: Read `.opencode/skills/mcp-click-up/SKILL.md` in full, its current `README.md`, its `INSTALL_GUIDE.md`, and the `references/` and `examples/` files. Verify against real file contents, not memory. The skill routes between the `cupt` CLI (daily task ops) and the official ClickUp MCP via Code Mode (documents, goals, bulk).

Action: Report under exactly these six headings, every claim cited to a real file path:

1. EXACT INVOCATION — the precise `cupt` install command and key subcommands/flags (quoted: list, show, done, note, notes, time, tag, context, statuses), and the exact Code Mode MCP `call_tool_chain()` pattern plus the `clickup_*` tool names. Note auth/setup prerequisites.
2. CAPABILITY ROSTER — the exact operation-routing table (which operations go to cupt versus MCP), the agent safety invariants (dry-run, official-MCP-only), and the full command/tool list, copied.
3. KEY FILES — a table of the real files (path + one-line role): SKILL.md, INSTALL_GUIDE.md, every references/ file, examples, scripts.
4. WORKFLOWS & OUTPUTS — the documented end-to-end workflows (the examples scripts: task-queue-workflow, time-tracking-workflow) and what they produce, cited.
5. TROUBLESHOOTING & FAQ — the concrete failure modes (cupt not installed, auth missing, MCP not configured, wrong server) and the 3 to 5 questions a user most likely asks, with short grounded answers.
6. STALE FACTS IN CURRENT README — list every claim in the current `README.md` that disagrees with `SKILL.md`, `INSTALL_GUIDE.md` or the real files (counts, paths, version, command names, the Version History section). Write "none found" if clean.

Format: One structured markdown report under those six numbered headings. Cite real file paths verbatim. Mark anything unverifiable as UNKNOWN. No preamble.
