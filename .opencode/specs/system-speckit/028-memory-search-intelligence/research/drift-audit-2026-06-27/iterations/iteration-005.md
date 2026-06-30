# Iteration 5 — deepseek

**Angle:** Agent drift: .claude/.opencode/.codex agent defs — cross-runtime agreement + match to the skills/commands that dispatch them (tools, model, routing).

**Findings:** 4

- **[P1] drift** `.claude/agents/context.md:4` — Claude context agent lacks code_graph MCP grant but body instructs its use
  - evidence: tools: Read, Grep, Glob, mcp__mk_spec_memory__* — no mcp__mk_code_index__*; body lines 38/58/64-66 instruct code_graph_status/query/context. .opencode counterpart grants both via mcpServers (lines 20-22).
  - fix: Add mcp__mk_code_index__* to the tools list in .claude/agents/context.md:4
- **[P1] drift** `.claude/agents/deep-research.md:4` — Claude deep-research agent lacks code_graph MCP grant but wedged-daemon fallback references it
  - evidence: tools: ... mcp__mk_spec_memory__* — no mcp__mk_code_index__*; line 317 wedged-daemon fallback says "If any mcp__mk_code_index__* call hangs or errors...". .opencode counterpart grants code_graph_query/context (lines 15-16).
  - fix: Add mcp__mk_code_index__code_graph_query and mcp__mk_code_index__code_graph_context to .claude/agents/deep-research.md:4 tools list
- **[P2] undocumented** `.claude/agents/deep-research.md:4` — WebSearch tool in Claude deep-research has no OpenCode equivalent
  - evidence: tools: Read, Write, Edit, Bash, Grep, Glob, WebFetch, WebSearch, mcp__mk_spec_memory__* — WebSearch is present at line 4. .opencode counterpart has webfetch: allow (line 13) but no web-search tool.
  - fix: Either add a WebSearch equivalent to .opencode or document WebSearch as Claude-only in the agent's description
- **[P2] misalignment** `.codex/agents/` — Inconsistent profile field across codex agent definitions
  - evidence: 4 of 13 .codex agents declare a profile field (orchestrate='orchestrate', markdown/prompt-improver/deep-improvement='default'). 9 agents (context, code, debug, review, deep-research, deep-review, deep-context, design, ai-council) omit it entirely.
  - fix: Audit and normalize: either add profile to all agents or remove from the 4 that have it
