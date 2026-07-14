DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

## STATE

Iteration: 1 of 4
Dimension: correctness
Prior findings: P0=0 P1=0 P2=0
Dimension coverage: 0/4
Stop policy: max-iterations; convergence is telemetry before iteration 4.

## TARGET

- Review target: `.opencode/specs/sk-code/019-split-doc-template-alignment`
- Scope: the six Markdown roots in `deep-review-config.json`
- Focus: deterministic template conformance, prior structural-remediation replay, and scoped link integrity

## CONSTRAINTS

- LEAF iteration; do not dispatch sub-agents.
- Reviewed files are read-only.
- Allowed writes are this lineage's iteration, delta, state, and strategy files only.
- Report P0/P1/P2 findings with concrete file:line evidence.
- End the iteration narrative with the exact review-verdict line.
