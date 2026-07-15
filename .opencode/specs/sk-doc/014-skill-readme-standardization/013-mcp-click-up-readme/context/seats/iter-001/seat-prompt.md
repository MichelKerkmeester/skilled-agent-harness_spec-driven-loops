Spec folder: sk-doc/014-skill-readme-standardization/013-mcp-click-up-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file, and do not run the skill or install anything. Return findings as your final assistant message only.

Role: You are a documentation analyst gathering an accurate factual map of one skill so its README can be rewritten.

Context: The skill lives at `.opencode/skills/mcp-click-up/`. Read its `SKILL.md` in full, its current `README.md`, its `INSTALL_GUIDE.md`, and the files under `references/`, `examples/` and `scripts/`. Stay within that skill directory. This skill is an orchestrator that routes ClickUp work between the `cupt` command-line tool (primary, daily task ops) and the official ClickUp MCP server through Code Mode (secondary, documents, goals, bulk). Note the sibling skill `mcp-code-mode` only to describe the boundary (it owns the MCP transport).

Action: Produce a factual map for a README rewrite. Report under exactly these eight headings:

1. PURPOSE — one sentence: what the skill does.
2. PROBLEM — 2 to 4 sentences: the human pain point it removes (problem-first, not a feature list). Why managing ClickUp from an agent or terminal is painful, and why one tool is not enough so the skill splits daily ops from heavy operations.
3. MODES & CAPABILITIES — the two paths and the operation-based routing rule (cupt for daily task ops like list, show, done, notes, time tracking and tags; official MCP for documents, goals, bulk creates and audit), plus the agent safety invariants (dry-run on destructive ops, official MCP only), each one line.
4. INVOCATION — how each path is triggered: the `cupt` install and the key subcommands, and the MCP `call_tool_chain()` pattern with the `clickup_*` tool names. Note prerequisites and setup (INSTALL_GUIDE, scripts/install.sh, auth).
5. KEY FILES — a table of the real files (path + one-line purpose): SKILL.md, INSTALL_GUIDE.md, references, examples, scripts.
6. BOUNDARIES — what it does NOT own or support (community ClickUp MCP servers are excluded, what mcp-code-mode owns, that cupt and MCP cover different operation sets).
7. TROUBLESHOOTING & FAQ MATERIAL — common failure modes, gotchas, and the 2 to 4 questions a user actually asks.
8. STALE FACTS — anything in the current README.md that is inaccurate versus SKILL.md and the real files (counts, paths, version, command names, the Version History section). Write "none found" if clean.

Format: Return one structured markdown report under those eight numbered headings. Cite real file paths verbatim. Mark anything you cannot verify as UNKNOWN. No preamble, no closing commentary.
