DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 1 prompt pack

Executor: cli-codex model=gpt-5.6-luna
Session: fanout-luna-1786567036073-2o1pe1
Focus: Establish the end-to-end quality ceiling from message assembly through protected spans, provider prompt, restoration, and fidelity/semantic validation.
Stop policy: max-iterations; convergence is telemetry only.

Read state first. Write only iteration-001.md, the append-only state log record, and deltas/iter-001.jsonl; the workflow owns reducer projections.
