# Iteration 45 — undefined — Stabilization: re-confirm F003 prompt naming

**Executor**: cli-opencode model=zai-coding-plan/glm-5.2
**sessionId**: fanout-glm-1782805948784-ypcv5r
**status**: complete

## Focus
Stabilization: re-confirm F003 prompt naming

## Findings
### F003 (P1) CLI fan-out prompt names the deep-review agent and instructs it to run the full loop
- Status: active
- Dimension: traceability
- Category: traceability
- Class: agent_contract_conflict
- [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:806]
- [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:816]
- [SOURCE: .opencode/agents/deep-review.md:34]
- [SOURCE: .opencode/agents/deep-review.md:54]
- [SOURCE: .opencode/agents/deep-review.md:64]
- Claim: The generated CLI lineage prompt opens with "You are a ${agentName} agent running a fan-out lineage" and instructs it to "Run phase_init, phase_main_loop ... and phase_synthesis" (fanout-run.cjs:806, 816). For review lineages agentName resolves to "deep-review", whose contract (agents/deep-review.md:34, 54-64) states it executes EXACTLY ONE iteration, is LEAF-only, and MUST NOT run the full loop. The prompt therefore contradicts the agent contract it names.
- Recommendation: Render CLI lineage prompts as command-host/orchestrator prompts (the subprocess is the /deep:review loop owner, not the LEAF agent), or dispatch through the command surface directly, so LEAF-only agent instructions are not placed in conflict with full-loop phase execution.

## Convergence Telemetry
- newFindingsRatio: 0.000
- findingsSummary: P0=0 P1=1 P2=0
- newFindings: P0=0 P1=0 P2=0
- note: F003 prompt unchanged.

## Scope Proof
All cited evidence is within the declared spec-folder / deep-loop orchestration review scope.

Review verdict: CONDITIONAL