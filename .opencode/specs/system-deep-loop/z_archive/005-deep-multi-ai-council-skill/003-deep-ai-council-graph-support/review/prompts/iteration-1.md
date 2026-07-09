# Deep-Review Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Iteration: 1 of 7
Dimension: correctness
Prior Findings: P0=0 P1=0 P2=0
Dimension Coverage: [] (0/4)
Traceability: core=pending overlay=pending
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 0
Last 2 ratios: N/A -> N/A
Stuck count: 0
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 1 of 7
Mode: review
Dimension: correctness
Review Target: .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support
Review Scope Files: .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/spec.md, .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/plan.md, .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/tasks.md, .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/checklist.md, .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/decision-record.md, .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/implementation-summary.md, .opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts, .opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-query.ts, .opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/upsert.ts, .opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/query.ts, .opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/status.ts, .opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/convergence.ts, .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts, .opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts, .opencode/skills/system-spec-kit/mcp_server/tools/index.ts, .opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts, .opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts, .opencode/skills/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts, .opencode/skills/deep-ai-council/SKILL.md, .opencode/skills/deep-ai-council/references/graph_support.md, .opencode/skills/deep-ai-council/manual_testing_playbook/05--scope-boundaries/001-graph-support-explicitly-out-of-scope.md
Prior Findings: P0=0 P1=0 P2=0

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security, traceability, maintainability

## TRACEABILITY PROTOCOLS

- **Core**: spec_code, checklist_evidence
- **Overlay**: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

## QUALITY GATES

evidence, scope, coverage

## VERDICTS

`FAIL | CONDITIONAL | PASS` - PASS may set `hasAdvisories=true` when only P2 remain.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/deep-review-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. Iteration narrative markdown at `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/iterations/iteration-001.md`.
2. Canonical JSONL iteration record appended to `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/deep-review-state.jsonl` with `"type":"iteration"` exactly.
3. Per-iteration delta file at `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/review/deltas/iter-001.jsonl` with one `type=iteration` record plus structured finding/traceability/ruled_out records.

Focus this iteration on correctness: storage invariants, query/convergence behavior, handler return semantics, schema/data-model mismatch, and tests that prove behavior. Do not modify reviewed files.
