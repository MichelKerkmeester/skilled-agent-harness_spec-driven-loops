# Deep Review Strategy — validation gate (claude-runner)

- Target: whole system-deep-loop skill via goal-file-manifest.txt (1985 files)
- Runner: Claude orchestrates the loop; each iteration dispatches ONE fresh codex exec leaf
  (read-only sandbox; leaf returns findings; runner writes all state).
- Executor mix: 24x gpt-5.6-luna xhigh + 16x gpt-5.6-sol high, all service_tier=fast (L,L,L,S,S rotation).
- Dimensions: iteration 1 = inventory; then risk-ordered passes correctness -> security -> traceability -> maintainability, rotating with hotspot revisits.
- Stop policy: max-iterations (40); convergence is telemetry only.
- Scope slices: manifest partitioned per iteration by top-level module group; hotspots revisited across dimensions.

## Known Context
- Prior fanout attempt rejected: codex lineage orchestrators cannot conform (recursion guard vs inline fabrication); replaced by this runner architecture.
- A quarantined non-conformant SOL lineage report exists under lineages/sol-high-fast/ (advisory only).