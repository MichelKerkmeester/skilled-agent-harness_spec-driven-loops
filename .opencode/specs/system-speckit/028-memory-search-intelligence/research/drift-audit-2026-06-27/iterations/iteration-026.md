# Iteration 26 — mimo

**Angle:** Authorized MCP tool capability vs. route mutating class — audit every read-only route's mcp_tools for tools whose schemas expose mutating parameters (memory_index_scan, memory_causal_stats backfill, code_graph_apply, advisor_rebuild, skill_graph_scan)

**Findings:** 2

- **[P2] misalignment** `.opencode/commands/doctor/_routes.yaml:35` — memory route lists memory_index_scan in mcp_tools despite being read-only
  - evidence: 
  - fix: 
- **[P2] drift** `.opencode/commands/doctor/_routes.yaml:67` — causal-graph route lists memory_causal_stats which has mutating backfill parameter
  - evidence: 
  - fix: 
