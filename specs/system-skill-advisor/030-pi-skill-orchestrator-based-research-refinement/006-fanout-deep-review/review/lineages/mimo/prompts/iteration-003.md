# Iteration 3 Prompt (rendered, executed in-process by the lineage executor)

Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

STATE SUMMARY: Iteration 3 of 3 | Dimension: traceability + maintainability (broadened final pass) | Prior Findings: P0=0 P1=1 P2=4 | Coverage Age: 2 | Stop policy: max-iterations (final pass; synthesis follows)

Focus: manifest ↔ ../002..005 requirements ↔ tests ↔ docs mapping; duplication/drift risks in the changed surface.

OUTPUT CONTRACT: iterations/iteration-003.md (final line `Review verdict: PASS|CONDITIONAL|FAIL`), deltas/iter-003.jsonl, state record THROUGH the append gateway.
