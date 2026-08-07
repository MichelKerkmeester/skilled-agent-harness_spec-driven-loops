DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 1 Prompt Pack

STATE SUMMARY: Iteration 1 of 10; dimension correctness; prior findings P0=0 P1=0 P2=0; coverage 0/4; core traceability pending; code graph absent; resource-map gate skipped.

- Review target: `.opencode/specs/sk-design/011-sk-design-styles-utilization`
- Focus: phase-parent status, child lifecycle consistency, phase ordering, acceptance-criteria correctness
- Read state from the `sol-c` config, state log, registry, and strategy.
- Write only the iteration-001 narrative, iter-001 delta, append-only state record, and strategy updates under `sol-c`.
- Target files are read-only. Do not implement fixes or dispatch sub-agents.
- ALLOWED WRITE PATHS: only `.opencode/specs/sk-design/011-sk-design-styles-utilization/review/lineages/sol-c/**`.
- BANNED OPERATIONS: `rm`, `mv`, `git rm`, `sed -i`, path deletion, and writes outside the allowed lineage directory.
