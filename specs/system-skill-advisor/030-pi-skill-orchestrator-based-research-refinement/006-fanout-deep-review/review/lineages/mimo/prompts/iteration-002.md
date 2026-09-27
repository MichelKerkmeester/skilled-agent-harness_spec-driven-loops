# Iteration 2 Prompt (rendered, executed in-process by the lineage executor)

Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

STATE SUMMARY: Iteration 2 of 3 | Dimension: security | Prior Findings: P0=0 P1=1 P2=2 | Coverage Age: 1 | Stop policy: max-iterations (convergence telemetry only)

Focus: trust boundaries between prompt content, hook shims, the advisor CLI/daemon request path (incl. the includeCompiledRoute stale-daemon retry), and the OpenCode plugin mirror.

OUTPUT CONTRACT: iterations/iteration-002.md (final line `Review verdict: PASS|CONDITIONAL|FAIL`), deltas/iter-002.jsonl, state record THROUGH the append gateway.
