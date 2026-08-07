DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

## STATE

Iteration: 4 of 4
Dimension: maintainability
Evidence-backed findings: P0=0 P1=2 P2=1
Dimension coverage: correctness, security, traceability (3/4)
Stop policy: max-iterations; this is the final required pass before synthesis.

## TARGET

- Review target: `.opencode/specs/sk-code/019-split-doc-template-alignment`
- Scope: the six Markdown roots and active finding evidence
- Focus: routing clarity, residual boilerplate, unresolved markers, Related Resources placement, and active-finding stabilization

## CONSTRAINTS

- LEAF iteration; do not dispatch sub-agents.
- Reviewed files are read-only.
- Allowed writes are this lineage's iteration, delta, state, and strategy files only.
- Do not duplicate stable active findings as new findings.
- End the iteration narrative with the exact review-verdict line.
