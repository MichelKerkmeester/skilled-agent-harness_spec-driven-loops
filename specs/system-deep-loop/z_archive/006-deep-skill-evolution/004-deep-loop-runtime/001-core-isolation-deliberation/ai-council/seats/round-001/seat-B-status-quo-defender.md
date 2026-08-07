---
round: 1
seat: 2
seat_letter: B
executor: cli-codex
lens: status-quo-defender
model: gpt-5.5
reasoning: xhigh
status: complete
timestamp: 2026-05-22T17:01:38Z
---

# Seat B — Status-Quo Defender

## Position

Keep the 18 deep-loop and coverage-graph files under `system-spec-kit/mcp_server/`, and document the placement as intentional shared runtime infrastructure for deep-review and deep-research. The dependency survey proves the code is deep-loop-specific, but it does not prove the MCP server is the wrong host; the contested files register stable MCP tools, manage MCP-server-owned SQLite state, and run under the MCP server's test harness. The right fix is an ADR and a CLAUDE.md note that make the host boundary explicit, not a relocation PR that buys ownership aesthetics at the cost of import churn, tool-registration risk, and test-layout complexity.

## Argument

MCP tool handler code belongs where the MCP server registers and dispatches MCP tools. `mcp__mk_spec_memory__deep_loop_graph_*` is not a private deep-review function family; it is a public tool surface in the `mk_spec_memory` MCP server namespace. The repo already follows this convention with server handlers under `mcp_server/handlers/`, including memory and skill handlers. Moving coverage-graph handler implementations into skill folders would make deep-loop the exception: tools still registered by the spec memory server, but source code hidden outside the server tree that owns the public API.

The SQLite database lifecycle makes the current placement more than historical accident. `deep-loop-graph.sqlite` is MCP-server-managed state, and `coverage-graph-db.ts` owns schema creation, allow-lists, and query semantics for data accessed through MCP tools. Splitting schema-owner code out of the server that opens, migrates, and serves the database creates a circular ownership problem: the deep-* skills would own the schema, the MCP server would own the lifecycle, and future migrations would have to coordinate across that boundary. Keeping DB code in `mcp_server/lib/coverage-graph/` keeps the lifecycle and schema in one package.

The deep-loop helpers are runtime infrastructure shared by two skills, not product logic owned by either one. Executor config parsing, atomic JSONL writes, locks, permissions gates, validation, Bayesian scoring, and fallback routing are the substrate that both deep-review and deep-research rely on. That is different from the skill-local assets, reducers, references, and prompt templates that already sit inside the deep-* folders. The current split is coherent: skill-specific materials live with the skill; shared execution and MCP runtime infrastructure live with the shared host.

Caller count is useful evidence, but it is not an ownership proof. A 100% deep-* consumption result can mean "move this into a deep runtime package," but it can also mean "this MCP server hosts one specialized tool family used by two specialized workflows." The latter is normal. Tool handlers often have narrow caller sets because they expose a bounded API. Relocating now would preempt future cross-consumer uses and make the server import back into skill folders for code that still semantically presents as server-hosted capability.

The PR cost is not clerical. This is roughly 18 production file moves, workflow YAML path updates, vitest relocation or cross-package imports, package and TypeScript config changes, and cleanup across docs, memory, and ADR references that cite the existing paths. Every moved file creates a chance to break module resolution, test discovery, MCP registration, or an operator's documented debug path. For a change whose main benefit is ownership clarity, that risk is poorly priced.

## Risks of opposing positions

Seat A's isolation framing treats architectural purity as the primary goal, but MCP-server-resident handler code is already an architectural boundary. The stable thing users and agents interact with is the `mk_spec_memory` tool namespace, not the private folder that happens to hold a handler. If the MCP server continues to register, expose, and lifecycle-manage the tools and database, moving implementation files out of the server tree makes the physical layout less honest, not more.

Seat C's likely partial split is worse than either extreme because it would create two ownership stories for one runtime. Moving `lib/deep-loop/` while leaving coverage-graph handlers and DB code in spec-kit splits iteration execution from convergence state. Moving handlers but leaving DB/query/signals under spec-kit splits public tool behavior from storage semantics. Moving only docs and YAML references leaves the same future-reviewer confusion in place. Partial relocation turns one debatable boundary into several hard-to-explain boundaries.

## Documentation alternative (instead of moving)

Add an ADR in this packet stating that `system-spec-kit/mcp_server/` intentionally hosts deep-loop runtime infrastructure because the public MCP tools, SQLite lifecycle, schema migrations, and vitest harness are server-owned. Add a short CLAUDE.md note near the MCP server conventions explaining that deep-review and deep-research own their skill-local assets and reducers, while shared deep-loop execution and graph infrastructure remains under the spec memory MCP server. Also add a path comment or resource-map note pointing maintainers from the deep-* skills to `mcp_server/lib/deep-loop/` and `mcp_server/lib/coverage-graph/`, so dependency surveys do not re-flag this as accidental drift.

## Confidence

88/100. The narrow caller set is real, but MCP tool ID stability, database lifecycle ownership, server-handler conventions, and test harness colocation make the current placement pragmatically stronger than a relocation.

---

Recommendation: KEEP
