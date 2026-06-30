# Iteration 37 — kimi

**Angle:** Cross-check each `.claude/agents/*.md` `tools:` line against body references for missing code-graph/detect_changes grants.

**Findings:** 2

- **[P1] misalignment** `.claude/agents/context.md:4` — context agent frontmatter omits required code-graph tool grants
  - evidence: tools line is `tools: Read, Grep, Glob, mcp__mk_spec_memory__*`; body repeatedly instructs `code_graph_status()` (line 38), `code_graph_query`/`code_graph_context` (lines 64-66, 88, 112, 134, 167, 409-411)
  - fix: Add `mcp__mk_code_index__code_graph_status`, `mcp__mk_code_index__code_graph_query`, `mcp__mk_code_index__code_graph_context` to the frontmatter tools line
- **[P1] misalignment** `.claude/agents/deep-review.md:4` — deep-review frontmatter omits code-graph grants referenced in body
  - evidence: tools line grants only `mcp__mk_code_index__detect_changes`; body lists `code_graph_query` / `code_graph_context` as structural navigation tools at lines 247-249
  - fix: Add `mcp__mk_code_index__code_graph_query` and `mcp__mk_code_index__code_graph_context` to the frontmatter tools line
