# Iteration 36 — gpt55

**Angle:** Audit every OpenCode agent `mcpServers:` value against actual registered server names (`mk-spec-memory`, `mk-code-index`, `mk-skill-advisor`, `sequential_thinking`, `code_mode`).

**Findings:** 1

- **[P1] dead** `.opencode/agents/context.md:22` — Context agent references unregistered MCP server `code_graph`
  - evidence: `  - code_graph`
  - fix: Replace `code_graph` with the registered code-index MCP server name `mk-code-index` in the `mcpServers:` list.
