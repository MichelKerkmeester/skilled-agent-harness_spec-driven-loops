# Iteration 9 review prompt

Revalidate the highest-risk carried findings against the current bounded tree:
retrieval wrapper/lane parity and parser boundaries, HF model identity and
response dimensions, direct Unix-socket lifecycle, forced-depth exact-once
state validation, and retrieval corpus symlink containment. Trace each
producer through its consumer and its focused negative tests. Distinguish a
reconfirmation of an existing finding from a new independent defect. Do not
modify the target or run repository tooling.

Setup bindings:

- review_target: .opencode/specs/system-speckit/052-memory-decommission-landing
- review_target_type: spec-folder
- review_dimensions: all
- spec_folder: .opencode/specs/system-speckit/052-memory-decommission-landing
- execution_mode: AUTONOMOUS
- lineage_mode: auto
- executor: cli-codex model=gpt-5.6-luna
- nested_dispatch: false

This is iteration 9 of 10. Convergence is telemetry only.
