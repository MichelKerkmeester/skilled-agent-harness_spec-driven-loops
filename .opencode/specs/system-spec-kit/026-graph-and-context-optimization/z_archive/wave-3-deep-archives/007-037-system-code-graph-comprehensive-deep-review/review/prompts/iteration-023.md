# Iteration 023 Prompt — Verify P1-B Runtime Correctness Cluster

## SITUATION

The packet 037 review-report lists P1-B1 through P1-B7 as runtime correctness issues in the MCP server, scan/query/context/status/apply paths.

## TASK

Verify each P1-B claim against the cited source lines. Mark each as VERIFIED, HALLUCINATED, or PARTIAL.

## SCOPE

- `.opencode/skills/system-code-graph/mcp_server/index.ts`
- `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts`
- `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts`
- `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts`
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts`
- `.opencode/skills/system-code-graph/mcp_server/handlers/status.ts`
- `.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/context/shared-payload.ts`

## CONSTRAINTS

- Read-only on `.opencode/skills/system-code-graph/`.
- Prefer exact line evidence over inference.
- Note overclaims separately from confirmed defects.

## OUTPUT FORMAT

Mirror the deep-review iteration format: Summary, Files Reviewed, Findings grouped by severity, and Convergence Signal.
