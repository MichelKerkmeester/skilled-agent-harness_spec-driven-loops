# Iteration 13 — undefined — Depth check F006: is sandbox resolution overridable per lineage?

**Executor**: cli-opencode model=zai-coding-plan/glm-5.2
**sessionId**: fanout-glm-1782805948784-ypcv5r
**status**: complete

## Focus
Depth check F006: is sandbox resolution overridable per lineage?

## Findings
### F006 (P2) Lineage write boundary is enforced by prompt text, not a path-scoped sandbox
- Status: active
- Dimension: security
- Category: security
- Class: defense_in_depth_gap
- [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1287]
- [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1291]
- [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1294]
- Claim: fanout-run.cjs:1287-1293 documents that the lineageDir-only write boundary is enforced by the prompt instruction ("Do not touch any path outside lineageDir") rather than by a narrower sandbox; the sandbox defaults to write-capable so the review subprocess can write its own artifacts. A malformed or non-compliant executor can therefore write outside lineageDir with no OS-level barrier. This is a defense-in-depth gap, not an active exploit.
- Recommendation: When the CLIs expose a path-scoped workspace-write mode, switch the default for review/research lineages to it; until then document the prompt-only boundary as a known limitation in the fanout security note.

## Convergence Telemetry
- newFindingsRatio: 0.000
- findingsSummary: P0=0 P1=0 P2=1
- newFindings: P0=0 P1=0 P2=0
- note: resolveSandboxMode(lineage.sandboxMode) at 1294 allows override but default remains write-capable. F006 survives as P2.

## Scope Proof
All cited evidence is within the declared spec-folder / deep-loop orchestration review scope.

Review verdict: PASS