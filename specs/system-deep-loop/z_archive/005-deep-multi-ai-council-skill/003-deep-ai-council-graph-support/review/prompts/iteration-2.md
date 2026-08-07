# Deep-Review Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Iteration: 2 of 7
Dimension: security
Prior Findings: P0=0 P1=2 P2=0
Dimension Coverage: [correctness] (1/4)
Traceability: core=fail overlay=partial/pending
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 0
Last 2 ratios: N/A -> 1.0
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=false

Review Iteration: 2 of 7
Mode: review
Dimension: security
Review Target: .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support
Prior Findings: P0=0 P1=2 P2=0

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW SCOPE FILES

- `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-query.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/upsert.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/query.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/status.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/convergence.ts`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts`
- `.opencode/skills/deep-ai-council/SKILL.md`
- `.opencode/skills/deep-ai-council/references/graph_support.md`
- `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/spec.md`
- `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/checklist.md`

## STATE FILES

- Config: .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/deep-review-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/iterations/iteration-002.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/deltas/iter-002.jsonl

## OUTPUT CONTRACT

Produce exactly three artifacts:
1. Iteration narrative markdown at the iteration path above.
2. Append one canonical JSONL line to the state log with required keys: type, iteration, mode, run, status, focus, dimensions, filesReviewed, findingsCount, findingsSummary, findingsNew, findingDetails, traceabilityChecks, newFindingsRatio, sessionId, generation, lineageMode, timestamp, durationMs, graphEvents.
3. Delta JSONL at the delta path above. Its first line must be the same full canonical iteration record, followed by structured finding/traceability/ruled_out records.

Constraints: LEAF only; do not dispatch subagents; do not modify reviewed target files; include file:line evidence for each finding; include typed claim-adjudication JSON for each new P0/P1.

Focus this iteration on security: strict input validation, namespace isolation, path/data exposure, prompt-safe output bounds, artifact authority, and whether handlers leak unrelated packet data or return unsafe false-success responses.
