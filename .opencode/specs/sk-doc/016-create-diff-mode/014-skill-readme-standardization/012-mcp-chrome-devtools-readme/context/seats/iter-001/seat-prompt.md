Spec folder: sk-doc/014-skill-readme-standardization/012-mcp-chrome-devtools-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file, and do not run the skill or install anything. Return findings as your final assistant message only.

Role: You are a documentation analyst gathering an accurate factual map of one skill so its README can be rewritten.

Context: The skill lives at `.opencode/skills/mcp-chrome-devtools/`. Read its `SKILL.md` in full, its current `README.md`, its `INSTALL_GUIDE.md`, and the files under `references/`, `examples/` and `scripts/`. Stay within that skill directory. This skill is an orchestrator that routes between two approaches: the `bdg` (browser-debugger-cli) command-line path and the Chrome DevTools path through Code Mode MCP. Note the sibling skill `mcp-code-mode` only to describe the boundary (it owns the MCP transport).

Action: Produce a factual map for a README rewrite. Report under exactly these eight headings:

1. PURPOSE — one sentence: what the skill does.
2. PROBLEM — 2 to 4 sentences: the human pain point it removes (problem-first, not a feature list). Why driving a browser from an agent or terminal is painful, and why one tool is not enough so the skill offers two paths.
3. MODES & CAPABILITIES — the two approaches and when each wins (bdg CLI as the fast, token-efficient priority path; Code Mode MCP as the multi-tool-integration fallback), the routing rule between them, and the concrete capabilities (screenshots, network capture, console, viewport, clicks, form fill, waits, sessions), each one line.
4. INVOCATION — how each path is triggered: the `bdg` install command and the key subcommands or flags, and the MCP `call_tool_chain()` pattern with the tool-naming convention. Note prerequisites and setup (INSTALL_GUIDE, scripts/install.sh).
5. KEY FILES — a table of the real files (path + one-line purpose): SKILL.md, INSTALL_GUIDE.md, references, examples, scripts.
6. BOUNDARIES — what it does NOT own or support (cross-browser limits, what mcp-code-mode owns, that it is not a test framework).
7. TROUBLESHOOTING & FAQ MATERIAL — common failure modes, gotchas, and the 2 to 4 questions a user actually asks.
8. STALE FACTS — anything in the current README.md that is inaccurate versus SKILL.md and the real files (counts, paths, version, install command). Write "none found" if clean.

Format: Return one structured markdown report under those eight numbered headings. Cite real file paths verbatim. Mark anything you cannot verify as UNKNOWN. No preamble, no closing commentary.
