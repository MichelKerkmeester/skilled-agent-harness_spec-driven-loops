# Detached lineage phase log

- phase_init: complete. artifact_dir was bound directly to the configured fanout_lineage_artifact_dir; resolveArtifactRoot was not run. The 041 packet and local lineage boundary were read before initialization.
- phase_main_loop: complete. Iterations 001 through 020 were executed as the current cli-codex leaf because nested cli-codex self-dispatch is prohibited. Each iteration has a route-proofed state record, narrative, delta, prompt, and reducer refresh. Convergence remained telemetry-only under max-iterations.
- phase_synthesis: complete. research.md, resource-map.md, findings-registry.json, and deep-research-dashboard.md were produced or refreshed inside this lineage. A synthesis_complete event records maxIterationsReached with 20 iterations and 10 answered questions.
- phase_save: intentionally not run. This detached lineage has no authority to write parent spec integration or memory surfaces; the parent workflow owns that handoff.
