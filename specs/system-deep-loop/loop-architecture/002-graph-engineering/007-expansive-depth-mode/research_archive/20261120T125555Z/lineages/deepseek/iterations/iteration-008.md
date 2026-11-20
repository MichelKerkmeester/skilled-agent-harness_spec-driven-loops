# Iteration 8: Q1 restraint — concrete deletions that keep every promise

## Focus

Q1 restraint: what can be deleted, merged or collapsed across `frontier-admit.cjs`, both `reduce-state.cjs` reducers, `convergence.cjs`, `fanout-run.cjs` and the two workflow YAMLs while every promise stays kept?

**Edge case, recorded:** the strategy's Next Focus carried this lineage's own iteration-7 closing instruction ("Close F-2-008 as answered…") verbatim, because the reducer reads the latest leaf `Recommended Next Focus` when the frontier is terminal. The loop is therefore working Q1 on the next open question rather than following that instruction. This is a real defect and is recorded for the design-question iteration; it does not change this iteration's scope.

## Findings

1. **`dispatch-iteration.cjs` builds half its executors by hand and half through `buildLineageCommand`, and the hand-built half is where the parity bugs live.** `runClaude` (`:354-453`) and `runCodex` (`:919-995`) construct argv inline, while `runLineageBuiltin`, `runResearchOpencode`, `runDeepseekHarness` and the review opencode handler call the shared builder (`:478, :540, :599, :793`). One concrete change: route claude and codex through `buildLineageCommand` plus the existing audit wrapper and delete the two inline builders, which removes roughly 300 lines and the `acceptEdits` drift found in iteration 5 in the same edit. Value: the largest single deletion in the runtime, and it closes a live permission defect. Effort M. Risk medium (the claude `--claude-config-dir` and codex stdin paths must be preserved in the adapter). [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:354] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:919] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:478]

2. **Six of the eight executor branches in each YAML are the same command, and their notes restate the capability matrix.** `deep-research.yaml:1762-1837` and the review YAML carry eight `if_cli_*` blocks; six differ only in `--executor <kind>`, and the notes under them repeat `EXECUTOR_KIND_FLAG_SUPPORT`. One concrete change: one `if_cli` branch with `--executor "{config.executor.kind}"`, keep the claude config-dir and dsh spec-folder special cases, delete the notes. Value: about 100 lines per YAML, and the matrix stays the only place capabilities are stated. Effort S. Risk low. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1762] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1819] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:112]

3. **The research YAML writes the same frontier seed step twice and the same fan-out command twice.** `step_frontier_seed` appears at `:395-415` (fan-out) and `:816-834` (phase_init) with the same command and different `skip_when`; `step_fanout_dry_run_preview` (`:300-313`) repeats `step_fanout_spawn_cli`'s command (`:439-452`) verbatim apart from `--preview`; and `step_reject_extend_with_fanout` (`:372-382`) plus `step_reject_frontier_caps_with_fanout` (`:384-393`) are two copies of one guard shape. One concrete change: one seed step with a branch on `config.fanout`, one spawn command with a `--preview` modifier, and one "usage errors refused before spawn" step. Value: about 50 lines removed and one place to edit each rule. Effort S. Risk low. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:395] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:816] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:300] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:372]

4. **The frontier marker grammar and the frontier dashboard renderer are implemented twice, in different trees.** `convergence.cjs:1360-1364` builds `frontierMarkerPattern`, and `deep-research/scripts/reduce-state.cjs:2485-2496` re-implements the same regex in `frontierNodeVisitRecords`; the review reducer renders `10B. FRONTIER` with an active-node line while the research reducer renders `6B. FRONTIER` without it. One concrete change: one shared `runtime/lib/deep-loop/frontier-projection` module exporting the marker, `visits`, `pickFocus` and `renderDashboardSection`, imported by both reducers and convergence. Value: one grammar and one dashboard, and the review reducer's visit logic becomes the research reducer's for free. Effort M. Risk low. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1360] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2485] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2520]

5. **Two small copies remain: the Flash effort pin and the `native` fan-out adapter.** `fanout-run.cjs:2650-2668` mirrors `executor-config.ts:328-337` (`isFlashMaxPinnedModel`, `pinReasoningEffortForModel`), and `native` is a fan-out adapter (`:3558`) that cannot start on OpenCode v2 (`:2640-2645`) while `dispatch-iteration.cjs` already rejects it (`:64`). One concrete change: import the pin, delete the mirror, and remove `native` from the adapter table in favour of the command host. Value: about 45 lines removed and one less version-dependent path. Effort S. Risk low. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2650] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:328] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3558] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2640]

## Ruled Out

- Deleting `frontier-admit.cjs` as a whole: it is shared by both reducers and both loops, so it is the one place the frontier rules already live; the duplication is around it, not inside it.
- Collapsing the two reducers into one file: the review reducer carries dimension coverage and the research reducer carries novelty questions; the shared part is the frontier projection, not the whole reducer.

## Dead Ends

- Searching for dead `if_cli_*` branches: all eight are reachable, so the deletion is a merge, not a dead-code removal.
- Looking for a shared YAML macro system: the workflow format has no include mechanism, so duplication must be collapsed at the step level, not by templating.

## Edge Cases

- Ambiguous input: "deleted" could mean lines or concepts. Both are counted where they apply; the line counts are approximate, the concepts are exact.
- Contradictory evidence: none; the duplicate code is textual.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:354,478,919`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2640,2650,3558`
- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1360`
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2520`
- `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2485`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:112,328`
- `.skilled/commands/deep/assets/deep-research.yaml:300,372,395,816,1762,1819`

## Assessment

- New information ratio: 1.0
- Questions addressed: Q1 restraint
- Questions answered: Q1: five concrete deletions, about 500 lines plus one shared module, with the live claude permission defect closed by the largest one.

## Reflection

- What worked and why: counting the built-by-hand versus built-by-adapter handlers turned "parity" into a deletion with a defect fix attached.
- What did not work and why: looking for dead branches found none; the duplication is live code on both paths, which is why it drifted.
- What I would do differently: start the restraint pass from the largest files' function tables, where duplication is visible as pairs of function names.

## Recommended Next Focus

Q5 design questions (research stuck scoping, lineage completion for older runs, pivot admission), then Q6 prior art, then synthesis.
