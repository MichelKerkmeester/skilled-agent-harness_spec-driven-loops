# Iteration 001 - Structural Layout And Detached-Lineage Boundary

## Focus

Validate the target `system-deep-loop/` layout and the detached fan-out write boundary against the YAML state machine.

## Findings

1. The target layout is mechanically sound: `runtime/` should remain infrastructure, NOT a workflow mode. The mode registry's three-tier discriminator (`workflowMode` / `runtimeLoopType` / `backendKind`) already models this cleanly — only research/review/council carry a non-null `runtimeLoopType` (research|review|council), while the four improvement/benchmark lanes stay `improvement-host`/`external-adapter` backed. This confirms child 002's decision NOT to add an eighth runtime mode for the nested runtime. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:5-27] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:29-197]

2. The graph-metadata consolidation approach (fresh-author, drop the `deep-loop-runtime ↔ deep-loop-workflows` edges as they become intra-skill structure) is correct. Keeping a nested `runtime/graph-metadata.json` would re-introduce the duplicate-edge problem child 002 already solves by deleting it. [SOURCE: 002-hub-rename-and-runtime-nesting/plan.md:101-103]

3. **NEW P0 — YAML `spec.md` mutation steps are not gated on the fan-out boundary.** `deep_research_auto.yaml:131` does `branch_on: "config.fanout_lineage_artifact_dir"` to bind `artifact_dir`/`artifact_root_dir`/`artifact_archive_root` to the lineage directory (lines 131-137), but the pre-init `spec.md` branch (lines 376-419, `create`/`edit` on `{spec_folder}/spec.md`) and the post-synthesis generated-findings writeback (lines 1511-1533, `edit: "{spec_folder}/spec.md"`) have NO equivalent fan-out branch. A detached executor following the YAML literally would mutate the shared parent `spec.md` from N concurrent replicas, racing on the same generated fence and violating its own detached-boundary prompt. This lineage deferred those steps (consistent with the gpt55-fast-2 precedent and my invocation), but the gap is real for an automated executor. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:131-137] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:376-419] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:1511-1533]

4. **NEW P1 — the convergence-floor test that enforces this phase's REQ-002 hardcodes the old name.** `deep-research-convergence-floor.vitest.ts:20-28` resolves `configPath = repoRoot/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json` and reads `yamlPath = repoRoot/commands/deep/assets/deep_research_auto.yaml`. This is the very test that validates the `minIterations: 3` anti-convergence floor spec.md REQ-002 relies on. After the rename, it reads a non-existent path and fails unless updated. Child 002's plan lists "7 files in `runtime/tests/unit/*.vitest.ts`" for Class A, but the actual count is 10 — and this load-bearing test is one of the un-enumerated ones. [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/deep-research-convergence-floor.vitest.ts:19-29] [SOURCE: 002-hub-rename-and-runtime-nesting/plan.md:76]

## Ruled Out

- Adding `runtime` as a mode-registry entry is a category error; it would blur backend infrastructure with public workflow modes.
- Letting each detached lineage write `{spec_folder}/spec.md` is unsafe in fan-out — every replica would race on the same generated fence. Write-back must be parent-owned after fan-out merge.

## Next Focus

Check the Class A + Class B path-repair tables against the ACTUAL reverse-coupling inventory — the plan's reverse-coupling table omits several load-bearing seams (reduce-state shims, runtime-capabilities shims, replay-graph repo-root absolute paths).
