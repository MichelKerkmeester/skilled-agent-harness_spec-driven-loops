# System Code Graph — Removed

The `system-code-graph` subsystem no longer exists. This note explains why the
paths referenced throughout this track's packets no longer resolve.

## What was removed

`.opencode/skills/system-code-graph/` was the live implementation of the
`mk_code_index` MCP server. It exposed eight tools — `code_graph_scan`,
`code_graph_query`, `code_graph_status`, `code_graph_context`,
`code_graph_classify_query_intent`, `code_graph_verify`, `code_graph_apply`, and
`detect_changes` — backed by a SQLite graph store and a CLI front door.

The skill tree, its MCP registrations across every runtime, both OpenCode
plugins, the per-runtime freshness hooks, the launcher and CLI shim, the
`/doctor` route, the boundary inside `system-spec-kit`, and the skill-advisor
node were all removed together.

## What replaced it

Nothing. Structural code search was retired rather than reimplemented. Code
discovery routes to Grep and Glob; `memory_search` continues to serve spec docs
and saved memory and was never part of this subsystem.

## What this means for the packets in this track

Every packet under this track predates the removal. Their file paths, tool
names, and command examples were accurate when written and have been left
untouched on purpose — rewriting them would falsify a decision trail that is
still worth reading. Treat them as history, not as instructions.

The same applies to changelogs, benchmark reports, and anything under
`.worktrees/`, which carry full copies of the removed tree and will match any
repository-wide search.

## Where the reasoning lives

`036-code-graph-decommission/` holds the work: `001-touchpoint-research/` for the
inventory that drove it and `002-decommission-decision-record/` for the ratified
decisions, including what was accepted as lost and how a rollback would proceed.

One decision is worth repeating here, because it is the trap most likely to bite
someone cleaning up later: `.opencode/bin/lib/launcher-ipc-bridge.cjs` and
`launcher-session-proxy.cjs` look like code-graph infrastructure but are shared
with the two surviving daemons. They were stripped, never deleted.

## Unrelated graph subsystems that survive

Matching on the word "graph" will reach several systems that have nothing to do
with this one and are still live:

- Spec Memory's causal and knowledge graphs
- the skill advisor's skill graph
- deep-loop's coverage and council graphs
