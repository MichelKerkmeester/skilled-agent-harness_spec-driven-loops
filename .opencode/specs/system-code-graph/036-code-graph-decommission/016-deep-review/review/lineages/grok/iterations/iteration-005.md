# Iteration 005 — Broadened stabilization (harness + re-check)

## Focus
Forced fifth pass under stopPolicy=max-iterations: broaden into stress/durability harnesses and re-validate prior P0 class (broken imports) rather than synthesize early. Convergence telemetry only.

## Method
- Read substrate stress harness mk_code_index wiring
- Confirmed durability stress import of CODE_GRAPH_TOOL_SCHEMAS
- Re-checked tool-schemas L8 comments
- Spot-checked `.opencode/agents` for residual grants (no matches earlier)

## Findings

### P0 - Blockers
- **P0-005**: Durability stress test imports deleted CODE_GRAPH_TOOL_SCHEMAS — `release-cleanup-new-surfaces-stress.vitest.ts:39`. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/stress-test/durability/release-cleanup-new-surfaces-stress.vitest.ts:39]

### P1 - Required
- **P1-009**: Stress harness still wires mk_code_index client and deleted DB path — `run-substrate-stress-harness.mjs:408`. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/stress-test/substrate/run-substrate-stress-harness.mjs:408]

### P2 - Advisories
- **P2-003**: tool-schemas still carry live L8 migration comments naming deleted server — `tool-schemas.ts:893`. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/tool-schemas.ts:893]

## Stabilization notes
- Prior P0-001/P0-002 (live guidance) re-confirmed present; not downgraded.
- Agent mirrors under `.opencode/agents` previously grepped clean of retired identities.
- Doctor command tree previously grepped clean.

## Convergence telemetry (not a stop signal)
- Dimensions covered: correctness, security, traceability, maintainability (4/4)
- newFindingsRatio still elevated due to new P0/P1 this pass
- stopPolicy=max-iterations reached after this iteration

## Recommended Next Focus
Synthesis → review-report.md; triage each P0/P1 against owning phase before any fix commits.

Review verdict: FAIL
