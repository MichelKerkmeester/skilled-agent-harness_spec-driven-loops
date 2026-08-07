# Deep-Review Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Iteration: 4 of 7
Dimension: maintainability
Prior Findings: P0=0 P1=3 P2=0
Dimension Coverage: [correctness, security, traceability] (3/4)
Traceability: core=fail overlay=pass/partial
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 0
Last 2 ratios: 1.0 -> 0.0
Stuck count: 1
Graph convergence: STOP_BLOCKED by uncovered_dimensions, so continue to maintainability.
Provisional Verdict: CONDITIONAL hasAdvisories=false

Review Iteration: 4 of 7
Mode: review
Dimension: maintainability
Review Target: .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support

## PRIOR ACTIVE P1 FINDINGS

- P1-001: Empty upsert violates documented no-op contract at `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/upsert.ts:52`.
- P1-002: Checklist claims convergence CONTINUE coverage not exercised at `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts:142`.
- P1-003: Arbitrary metadata is returned as prompt-safe output without redaction or size bounds at `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-query.ts:67`.

## REVIEW SCOPE FILES

- `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-query.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/upsert.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/query.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/status.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/convergence.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts`
- `.opencode/skills/deep-ai-council/references/graph_support.md`
- `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/plan.md`
- `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/implementation-summary.md`

## STATE FILES

- Config: .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/deep-review-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/iterations/iteration-004.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/deltas/iter-004.jsonl

## OUTPUT CONTRACT

Produce exactly three artifacts. The state-log and delta first-line iteration records must include required keys: type, iteration, mode, run, status, focus, dimensions, filesReviewed, findingsCount, findingsSummary, findingsNew, findingDetails, traceabilityChecks, newFindingsRatio, sessionId, generation, lineageMode, timestamp, durationMs, graphEvents.

Constraints: LEAF only; do not dispatch subagents; do not modify reviewed target files; include file:line evidence for each finding; include typed claim-adjudication JSON for each new P0/P1.

Focus this iteration on maintainability: implementation pattern consistency, duplication, code clarity, test readability, maintenance cost of graph schema/query helpers, rollback/replay ergonomics, and whether active P1s indicate systemic maintainability risk.
