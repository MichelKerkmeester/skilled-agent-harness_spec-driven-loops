# Iteration 001 - Structural Layout And Detached-Lineage Boundary

## Focus

Validate the target `system-deep-loop/` layout and the detached fan-out write boundary.

## Findings

1. The target layout should keep `runtime/` as infrastructure, not as a mode. The current mode registry distinguishes public `workflowMode`, graph-backed `runtimeLoopType`, and `backendKind`, and only research/review/council use the runtime loop key. Improvement lanes stay host/external-adapter backed, which supports the child 002 decision not to add a seventh runtime mode. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:1-27] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:29-101]

2. The graph-metadata consolidation design is sound: the current workflow hub depends on `deep-loop-runtime`, while the runtime graph repeats workflow edges. A fresh `system-deep-loop/graph-metadata.json` with no nested runtime graph is cleaner than a merge. [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:7-45] [SOURCE: .opencode/skills/deep-loop-runtime/graph-metadata.json:8-69]

3. New P0: detached fan-out prompt and YAML state machine conflict. `fanout-run.cjs` tells each CLI lineage to write all outputs to its lineage directory and not touch outside it, but `deep_research_auto.yaml` still has pre-init branches that create/edit `{spec_folder}/spec.md` and a post-synthesis generated findings writeback to the same `spec.md`. In this lineage, I deferred those steps to preserve the explicit boundary. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1004-1017] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:376-406] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:1510-1532]

## Ruled Out

- Adding `runtime` to `mode-registry.json` is a category error; it would blur backend infrastructure with public workflow modes.
- Letting detached lineages write `spec.md` is not safe in fan-out because every replica would race on the same file and violate the prompt boundary.

## Next Focus

Check the concrete path-repair table against actual runtime/workflow imports and tests.
