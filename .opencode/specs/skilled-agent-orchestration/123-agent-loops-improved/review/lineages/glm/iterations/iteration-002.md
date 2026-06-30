# Iteration 2 — undefined — Fan-out lineage session id discarded in review init

**Executor**: cli-opencode model=zai-coding-plan/glm-5.2
**sessionId**: fanout-glm-1782805948784-ypcv5r
**status**: insight

## Focus
Fan-out lineage session id discarded in review init

## Findings
### F002 (P1) Fan-out lineage session id is discarded during review init
- Status: active
- Dimension: correctness
- Category: correctness
- Class: state_identity_drift
- [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1281]
- [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:788]
- [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:373]
- [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:410]
- [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:415]
- Claim: fanout-run.cjs:1281 builds a concrete sessionId (`fanout-${lineage.label}-${runId}`) and threads it into the lineage prompt, but deep_review_auto.yaml review init writes sessionId from {ISO_8601_NOW} in config (line 373), state log (line 410), and findings registry (line 415) instead of the supplied lineage id. Result: every fan-out lineage records an unrelated timestamp as its identity, breaking lineage traceability across config/state/registry and graph convergence events.
- Recommendation: Bind the supplied session_id into review init and reuse it across config, state, registry, and synthesis events. The native path (buildNativeCommandInput) already pre-binds lineage identity; the CLI/LeAF prompt path must do the same in the YAML init steps.

## Convergence Telemetry
- newFindingsRatio: 1.000
- findingsSummary: P0=0 P1=1 P2=0
- newFindings: P0=0 P1=1 P2=0
- note: Discovered F002; re-read fanout-run.cjs:1281 and YAML init lines.

## Scope Proof
All cited evidence is within the declared spec-folder / deep-loop orchestration review scope.

Review verdict: CONDITIONAL