DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration 3 Prompt Pack

STATE SUMMARY: Iteration 3 of 10. Focus: traceability / topology cross-links. Active findings: P0=0 P1=4 P2=0. Coverage: 2/4. Convergence is telemetry only before iteration 10.

- Review target: '.opencode/specs/sk-doc/017-hyphen-naming-convention'
- Scope: all 674 packet Markdown files, explicit relative links, stale topology language, top-level adjacency.
- Output: 'iterations/iteration-003.md' and 'deltas/iter-003.jsonl'.
- Constraint: LEAF-only; target is read-only; writes stay inside this lineage.
- Graph mode: cited graphless fallback.
