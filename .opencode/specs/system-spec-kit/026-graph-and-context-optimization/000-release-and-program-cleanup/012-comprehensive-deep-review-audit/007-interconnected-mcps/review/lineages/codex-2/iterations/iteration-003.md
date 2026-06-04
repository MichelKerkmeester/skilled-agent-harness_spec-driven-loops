# Iteration 003 - Traceability

## Focus

Spec/code alignment for code-graph readiness guidance and interconnected MCP operator routing.

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps/spec.md`
- `.opencode/skills/system-code-graph/references/runtime/tool_surface.md`
- `.opencode/skills/system-code-graph/references/readiness/code_graph_readiness_check.md`
- `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts`
- `.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts`

## Findings

### F003 - P2 - Stale graph recovery guidance contradicts the code-graph read path

The system-spec-kit structural bootstrap guidance says that if structural context shows `"stale"`, `mcp__mk_code_index__code_graph_query` still works and a `session_bootstrap` refresh is only recommended [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:953]. The routing rules also route both `fresh` and `stale` to `mcp__mk_code_index__code_graph_query` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:966]. The code-graph query handler, however, blocks every non-fresh state (`readiness.freshness !== 'fresh'`) [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/query.ts:865], and the dispatch returns a blocked payload before answering [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1244].

Impact: the read path is false-safe, so this does not produce incorrect structural answers. It does route operators and recovery prompts into a call that is expected to block, which is avoidable workflow friction and contract drift between system-spec-kit and system-code-graph.

Concrete fix: update the structural bootstrap and routing text so `stale` recommends `session_bootstrap` or `code_graph_scan` before structural queries, or phrase it as "a structural call may attempt bounded repair but can return blocked; scan/bootstrap first when confidence matters."

## Traceability Checks

`spec_code`: partial. The slice requires integration-contract drift assessment [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps/spec.md:61]. F003 is one such drift.

`checklist_evidence`: partial. This Level 1 slice has no `checklist.md`; spec requirements at lines 88-89 are the available acceptance basis.

## P0 Replay

No P0 finding asserted.

Review verdict: PASS
