# Iteration 10 review prompt

Perform the terminal max-iterations pass. Re-read the packet closure documents,
the 438-entry bounded scope evidence, the findings registry, strategy,
dashboard, resource map, config and all prior iteration/delta artifacts. Check
that active findings, severity counts, traceability status, verdict mapping and
the terminal reason agree. Do not synthesize early, do not run repository
tooling, and do not modify the target packet or implementation files.

Setup bindings:

- review_target: .opencode/specs/system-speckit/052-memory-decommission-landing
- review_target_type: spec-folder
- review_dimensions: all
- spec_folder: .opencode/specs/system-speckit/052-memory-decommission-landing
- execution_mode: AUTONOMOUS
- lineage_mode: auto
- executor: cli-codex model=gpt-5.6-luna
- nested_dispatch: false

This is iteration 10 of 10. The terminal stop reason is maxIterationsReached.
Convergence remains telemetry only; synthesize only after this iteration is
recorded.
