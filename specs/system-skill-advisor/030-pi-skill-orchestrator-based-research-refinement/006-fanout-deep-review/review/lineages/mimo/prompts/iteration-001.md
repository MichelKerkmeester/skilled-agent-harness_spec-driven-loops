# Iteration 1 Prompt (rendered, executed in-process by the lineage executor)

Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

STATE SUMMARY: Iteration 1 of 3 | Dimension: correctness (+inventory) | Prior Findings: P0=0 P1=0 P2=0 | Coverage Age: 0 | Stop policy: max-iterations (convergence telemetry only)

Review Target: specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/006-fanout-deep-review (spec-folder; scope = goal-file-manifest.txt, 38 files)

Focus: densest changed logic slices — pi-cache-optimizer hash-verified edits section, pi directive-lifecycle dedup, render fallback heads, deep-loop step_convergence_report in both workflow families.

OUTPUT CONTRACT: iterations/iteration-001.md (final line `Review verdict: PASS|CONDITIONAL|FAIL`), deltas/iter-001.jsonl (type=iteration record + finding/classification/traceability-check records), state record THROUGH the append gateway.
