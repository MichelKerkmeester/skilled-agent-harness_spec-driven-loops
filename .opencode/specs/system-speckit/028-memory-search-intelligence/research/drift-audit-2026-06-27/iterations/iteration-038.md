# Iteration 38 — gpt55

**Angle:** Verify OpenCode command `allowed-tools:` normalization: `mcp__mk_code_index__*` vs native `mk-code-index_*` tool names.

**Findings:** 5

- **[P1] misalignment** `.opencode/commands/speckit/plan.md:4` — /speckit:plan omits Code Graph allowed tool required by workflow asset
  - evidence: plan.md:4 allowed-tools lists Read, Write, Edit, Bash, Grep, Glob, Task and mk_spec_memory tools only; speckit_plan_auto.yaml:546 says "Use Code Graph structural queries (code_graph_query) + Grep for concept discovery."
  - fix: Add mcp__mk_code_index__code_graph_query to /speckit:plan allowed-tools, or remove the workflow instruction to use code_graph_query.
- **[P1] misalignment** `.opencode/commands/speckit/complete.md:4` — /speckit:complete omits Code Graph allowed tool required by workflow asset
  - evidence: complete.md:4 allowed-tools lists Read, Write, Edit, Bash, Grep, Glob, Task and mk_spec_memory tools only; speckit_complete_confirm.yaml:727 says "Use Code Graph structural queries (code_graph_query) + Grep for concept discovery."
  - fix: Add mcp__mk_code_index__code_graph_query to /speckit:complete allowed-tools, or remove the workflow instruction to use code_graph_query.
- **[P2] misalignment** `.opencode/commands/create/agent.md:4` — /create:agent omits Code Graph allowed tool while asset instructs code_graph_query
  - evidence: agent.md:4 says "allowed-tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite"; create_agent_auto.yaml:79 says "Use Code Graph structural queries (code_graph_query) + Grep for concept discovery".
  - fix: Add mcp__mk_code_index__code_graph_query to /create:agent allowed-tools, or remove the code_search_note from the create_agent assets.
- **[P2] misalignment** `.opencode/commands/create/sk-skill.md:4` — /create:sk-skill omits Code Graph allowed tool while asset instructs code_graph_query
  - evidence: sk-skill.md:4 says "allowed-tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite"; create_sk_skill_auto.yaml:72 says "Use Code Graph structural queries (code_graph_query) + Grep for concept discovery".
  - fix: Add mcp__mk_code_index__code_graph_query to /create:sk-skill allowed-tools, or remove the code_search_note from the create_sk_skill assets.
- **[P2] misalignment** `.opencode/commands/create/changelog.md:4` — /create:changelog omits Code Graph allowed tool while asset instructs code_graph_query
  - evidence: changelog.md:4 says "allowed-tools: Read, Write, Edit, Bash, Glob, Grep"; create_changelog_auto.yaml:80 says "Use Code Graph structural queries (code_graph_query) + Grep for concept discovery".
  - fix: Add mcp__mk_code_index__code_graph_query to /create:changelog allowed-tools, or remove the code_search_note from the create_changelog assets.
