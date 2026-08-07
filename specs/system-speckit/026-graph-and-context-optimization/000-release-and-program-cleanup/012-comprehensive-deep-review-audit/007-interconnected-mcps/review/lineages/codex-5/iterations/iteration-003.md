# Iteration 003 - Traceability And Spec Alignment

Session: fanout-codex-5-1780596001496-uhn96t
Executor: cli-codex model=gpt-5.5
Focus: traceability: code-graph and spec alignment

## Scope Reviewed

- `.opencode/skills/system-code-graph/SKILL.md`
- `.opencode/skills/system-code-graph/references/runtime/tool_surface.md`
- `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts`
- `.opencode/skills/system-code-graph/mcp_server/handlers/context.ts`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps/spec.md`

## Findings

### F006 - P2 - Bootstrap guidance says stale code-graph queries work, but the handler blocks every non-fresh read

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:953` says stale graph usage can proceed through `code_graph_query`.
- `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:865` to `:875` returns an error when the graph is stale or missing.

Impact:

The recovery guidance can route agents into a path that cannot return graph data. This is a degradation-path documentation defect, not a runtime correctness blocker.

Concrete fix:

Update bootstrap guidance to distinguish fresh graph reads, scan-required states, and graphless fallback.

### F007 - P2 - Review slice names a non-existent system-code-graph mcp_server/scripts entrypoint directory

Evidence:

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps/spec.md:26` includes `.opencode/skills/system-code-graph/mcp_server/scripts/*`.
- The inspected repository has no `.opencode/skills/system-code-graph/mcp_server/scripts` directory.

Impact:

The slice scope directs reviewers toward a dead path and can make coverage claims ambiguous.

Concrete fix:

Replace the non-existent path with the actual code-graph runtime directories in scope, such as handlers, tool schemas, tooling, and references.

## Traceability Result

Spec-code alignment is partial. The important interconnected MCP tool registrations and handlers exist, but the packet has one dead scoped path and one stale recovery instruction.

Review verdict: PASS
