# Iteration 50 — gpt55

**Angle:** Audit whether the router's allowed-tools union in speckit.md includes mutating tools that could bypass per-route mcp_tools restrictions

**Findings:** 4

- **[P1] misalignment** `.opencode/commands/doctor/scripts/route-validate.py:14` — Validator allows extra mutating tools in router frontmatter
  - evidence: "F. Each route's mcp_tools is a subset of the router's frontmatter allowed-tools union"; the check at lines 223-233 only rejects route tools missing from frontmatter, not mutating frontmatter tools missing from the selected route.
  - fix: Add a reverse/safety validation that flags frontmatter MCP tools not declared by any routed target, and separately flags mutating MCP tools present in the router union without a per-target enforcement boundary.
- **[P1] contradiction** `.opencode/commands/doctor/speckit.md:4` — Read-only code-graph route can access scan/apply tools from router union
  - evidence: Frontmatter grants "mcp__mk_code_index__code_graph_scan, mcp__mk_code_index__code_graph_apply" while _routes.yaml declares code-graph "mutating: read-only" and its mcp_tools list only status/query/context/detect_changes at lines 84-90.
  - fix: Remove code_graph_scan and code_graph_apply from the router allowed-tools union, or split mutating code-graph apply work into a separate confirmed command/router.
- **[P1] contradiction** `.opencode/commands/doctor/speckit.md:4` — Causal diagnostic forbids link writes but router grants memory_causal_link
  - evidence: Frontmatter grants "mcp__mk_spec_memory__memory_causal_link" while doctor_causal-graph.yaml says "it never calls memory_causal_link" at line 28 and "Never call memory_causal_link in diagnostic mode." at line 182.
  - fix: Remove memory_causal_link from /doctor router frontmatter; keep it only on commands that actually perform confirmed causal-edge writes.
- **[P1] misalignment** `.opencode/commands/doctor/_routes.yaml:35` — Read-only memory doctor route declares memory_index_scan despite no-mutation contract
  - evidence: The memory route is "mutating: read-only" at line 31 but includes "mcp__mk_spec_memory__memory_index_scan" at line 35; memory/manage documents `scan` as `memory_index_scan` with confirmation "Yes" at .opencode/commands/memory/manage.md:45.
  - fix: Remove memory_index_scan from the memory doctor route and router union, or reclassify the route as mutating with Gate 3 and explicit confirmation before scan execution.
