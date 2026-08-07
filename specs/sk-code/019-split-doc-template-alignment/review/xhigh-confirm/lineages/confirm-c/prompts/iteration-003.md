DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack

## STATE

Iteration: 3 of 4
Dimension: traceability
Prior evidence-backed findings: P0=0 P1=1 P2=1
Dimension coverage: correctness, security (2/4)
Stop policy: max-iterations; convergence is telemetry before iteration 4.

## TARGET

- Review target: `.opencode/specs/sk-code/019-split-doc-template-alignment`
- Traceability files: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`
- Focus: execute `spec_code` and `checklist_evidence`; classify `feature_catalog_code` and `playbook_capability`

## CONSTRAINTS

- LEAF iteration; do not dispatch sub-agents.
- Reviewed files are read-only.
- Allowed writes are this lineage's iteration, delta, state, and strategy files only.
- Re-read cited evidence before any P0/P1 severity call.
- End the iteration narrative with the exact review-verdict line.
