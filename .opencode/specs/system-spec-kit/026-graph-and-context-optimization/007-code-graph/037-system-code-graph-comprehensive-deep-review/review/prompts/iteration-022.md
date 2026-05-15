# Iteration 022 Prompt — Verify P0-2 CCC Readiness Claim

## SITUATION

The packet 037 review-report promotes P0-2 as a release-blocking defect: all `ccc_*` CocoIndex bridge handlers allegedly return fake readiness through hardcoded `buildUnavailableReadiness('readiness_not_applicable')`.

## TASK

Verify whether the three handlers contain the literal calls at the reported lines, then check whether `tool-schemas.ts` advertises readiness for `ccc_status`, `ccc_reindex`, or `ccc_feedback`.

## SCOPE

- `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-status.ts`
- `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-reindex.ts`
- `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts`
- `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts`

## CONSTRAINTS

- Read-only on `.opencode/skills/system-code-graph/`.
- Distinguish intentional readiness N/A from a false readiness contract.
- Cite file:line evidence for every verdict.

## OUTPUT FORMAT

Mirror the deep-review iteration format: Summary, Files Reviewed, Findings grouped by severity, and Convergence Signal.
