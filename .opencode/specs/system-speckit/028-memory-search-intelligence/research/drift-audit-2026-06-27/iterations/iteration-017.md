# Iteration 17 — kimi

**Angle:** MCP tool resolution audit — verify every skill/command that dispatches agents passes MCP tool names matching each runtime's convention

**Findings:** 3

- **[P1] misalignment** `.opencode/agents/context.md:20-22` — OpenCode context agent declares non-existent MCP server 'code_graph'
  - evidence: mcpServers:\n  - mk-spec-memory\n  - code_graph
  - fix: Replace 'code_graph' with 'mk-code-index' (or the OpenCode plugin ID 'mk-code-graph') to match the registered code-graph service.
- **[P1] misalignment** `.opencode/agents/review.md:6-19` — OpenCode review agent body uses detect_changes without granting it
  - evidence: permission block lacks detect_changes/code_graph; line 53 'Use `detect_changes` with the unified diff'; line 100 Tools table lists `detect_changes`
  - fix: Add `detect_changes: allow` (and `code_graph_query: allow`, `code_graph_context: allow`) to the permission block to match the Claude mirror.
- **[P1] drift** `.claude/agents/deep-review.md:4` — Claude deep-review agent body references code_graph_query/context not in tools line
  - evidence: tools: ... mcp__mk_code_index__detect_changes; line 247 'code_graph_query / code_graph_context: structural navigation'; line 249 'code_graph_query: semantic discovery'
  - fix: Add `mcp__mk_code_index__code_graph_query` and `mcp__mk_code_index__code_graph_context` to the tools line, matching the OpenCode mirror.
