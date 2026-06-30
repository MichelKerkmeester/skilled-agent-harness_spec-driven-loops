# Iteration 12 — undefined — Adversarial replay of F005: comment markers still present?

**Executor**: cli-opencode model=zai-coding-plan/glm-5.2
**sessionId**: fanout-glm-1782805948784-ypcv5r
**status**: complete

## Focus
Adversarial replay of F005: comment markers still present?

## Findings
### F005 (P1) Review workflow YAML carries ephemeral finding-id comments
- Status: active
- Dimension: maintainability
- Category: maintainability
- Class: comment_hygiene_violation
- [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:395]
- [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:408]
- Claim: deep_review_auto.yaml embeds `<!-- F-010-B5-04 -->` markers at lines 395 and 408. The active comment-hygiene rule forbids ephemeral artifact/finding identifiers in durable code or workflow comments; only the durable WHY should remain.
- Recommendation: Remove the F-010-B5-04 markers and keep only the durable rationale for honoring the parsed --no-resource-map flag (the existing prose already explains it).

## Convergence Telemetry
- newFindingsRatio: 0.000
- findingsSummary: P0=0 P1=1 P2=0
- newFindings: P0=0 P1=0 P2=0
- note: Lines 395 and 408 still carry F-010-B5-04. F005 survives.

## Scope Proof
All cited evidence is within the declared spec-folder / deep-loop orchestration review scope.

Review verdict: CONDITIONAL