DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

## STATE

Iteration: 2 of 4
Dimension: security
Prior findings: P0=0 P1=1 P2=1
Dimension coverage: correctness (1/4)
Stop policy: max-iterations; convergence is telemetry before iteration 4.

## TARGET

- Review target: `.opencode/specs/sk-code/019-split-doc-template-alignment`
- Scope: the six Markdown roots in `deep-review-config.json`
- Focus: prior cookie/CDN finding replay, unsafe copy-paste guidance, secrets, input execution, authorization, and third-party script trust boundaries

## CONSTRAINTS

- LEAF iteration; do not dispatch sub-agents.
- Reviewed files are read-only.
- Allowed writes are this lineage's iteration, delta, state, and strategy files only.
- Do not repeat the saturated structural sweep.
- End the iteration narrative with the exact review-verdict line.
