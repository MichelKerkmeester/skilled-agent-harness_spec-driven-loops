# Iteration 025 Prompt — Synthesis and Packet 038 Scope

## SITUATION

Iterations 021-024 independently verified the release-gating P0s and selected P1 clusters from packet 037. The addendum must give packet 038 a corrected remediation scope.

## TASK

Aggregate the verification verdicts into a table covering all P0 and P1 findings from `review-report.md`, including spot-check evidence for P1s outside the explicit 021-024 iteration plan. Count VERIFIED, HALLUCINATED, and PARTIAL findings, and recommend what remains in packet 038.

## SCOPE

- `review-report.md`
- Iteration 021-024 evidence
- Additional read-only spot checks for remaining P1-C, P1-D, P1-F, P1-G, P1-H1, and P1-H3 claims

## CONSTRAINTS

- Do not modify `.opencode/skills/system-code-graph/`.
- Do not touch packet 038.
- No commits or branches.

## OUTPUT FORMAT

Write `iteration-025.md` and `verification-addendum.md` with table-driven verdicts, counts, adjusted packet 038 scope, and any new findings.
