# Iteration 001 - Structural Layout And Detached Fan-Out Write Boundary

## Focus

Validate the `system-deep-loop/` target layout and confirm the detached fan-out prompt boundary is compatible with the research YAML's `spec.md` mutation steps.

## Findings

1. The structural layout is mechanically sound and matches the three-tier discriminator already encoded in `mode-registry.json`. The registry separates `workflowMode` (public command/advisor key), `runtimeLoopType` (graph-backed loop key: research|review|council), and `backendKind` (runtime-loop-type | improvement-host | external-adapter). Folding runtime in as nested infrastructure — not as an eighth workflow mode — is the correct categorization; runtime has no `workflowMode`, so adding one would be a category error. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:10-27] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:29-45]

2. graph-metadata fresh-authoring (not N-way merge) is the right call. `deep-loop-runtime/graph-metadata.json` repeats edges already in `deep-loop-workflows/graph-metadata.json` (`depends_on`/`enhances`/`siblings`), so a single fresh hub graph with `runtime/` edges collapsed to intra-skill structure is strictly simpler than merging. [SOURCE: ls deep-loop-runtime/graph-metadata.json] [SOURCE: 002/plan.md graph-metadata consolidation]

3. NEW P0 — the detached fan-out boundary conflicts with YAML `spec.md` mutation, and the guard is one-sided. `step_resolve_artifact_root` (yaml:128-137) correctly `branch_on: config.fanout_lineage_artifact_dir` to rebind `artifact_dir` into the lineage dir. But `step_detect_spec_present` (yaml:361) and `step_writeback_spec_findings` (yaml:1510) still target `{spec_folder}/spec.md` with NO fanout guard. Meanwhile `fanout-run.cjs:1004-1017` emits the prompt "Do not touch any path outside {lineageDir}". Result: artifact_dir is overridden but spec.md mutation is not, so in a fan-out of N replicas the same shared `{spec_folder}/spec.md` would be raced by every replica, violating each replica's own prompt boundary. This lineage deferred both spec.md steps to preserve the boundary. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:128-137] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:361] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:1510-1518] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1004-1017]

## Ruled Out

- Adding `runtime` as a `workflowMode`/mode-registry entry — it is infrastructure, not a public mode.
- Letting each detached replica edit shared `{spec_folder}/spec.md` — unsafe under fan-out; parent-owned writeback after merge is the only safe owner.

## Next Focus

Enumerate every bidirectional path-coupling between the two skills and check the 002 Class A/Class B repair tables against the real require() inventory.
