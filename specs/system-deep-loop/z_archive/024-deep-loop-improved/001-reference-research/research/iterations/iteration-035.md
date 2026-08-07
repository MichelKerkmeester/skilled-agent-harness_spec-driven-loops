# Iteration 35: S5-06 Per-Iteration Memory Upsert Hook

## Focus

D3 cross-cutting research for [S5-06]: where a per-iteration `memory_save` / `memory_context` hook should fire so deep-research findings stream into Spec Kit Memory continuously instead of waiting for the final `generate-context.js` save.

## Actions Taken

- Checked prior iteration artifacts and registry text for overlap with recent S4 work. S4-04 covered single-loop heartbeat telemetry; this pass stays on memory upsert placement.
- Read the live deep-research lifecycle and output contracts, especially the current workflow-start `memory_context`, post-dispatch validation, reducer, graph upsert, and final save phase.
- Mined loop-cli-main for lifecycle-event persistence boundaries and diff-guarded state writes.
- Mined kasper for the evaluated-session persistence path and the later context-injection hook that consumes aggregate/recent state.
- Checked Spec Kit Memory docs for the distinction between `generate-context.js` continuity routing and direct `memory_save({ filePath })` indexing.

## Findings

1. Rank 1: Fire the per-iteration upsert after validated outputs, reducer refresh, and graph upsert, not inside the leaf agent.

   Reference mechanism: loop-cli-main wires state persistence to controller lifecycle events (`run:start`, `run:end`, `paused`, `resumed`, `triggered`, `waiting`, `stopped`) and then writes only when the serialized loop snapshot changes [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:263`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:280`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:285`]. The run record is created before execution and completed before `run:end` fires, so subscribers see a complete persisted run boundary [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:342`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:347`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:451`].

   Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`. Add `step_memory_upsert_iteration` after `step_graph_upsert` and before `step_evaluate_results`, because the workflow has already validated the iteration/delta files, refreshed registry/dashboard/strategy, and persisted graphEvents at that point [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:756`] [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:780`] [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:797`] [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:812`]. Port-difficulty: med. Tag: quick-win. Why it helps: memory receives only canonical, reducer-approved iteration evidence, while the leaf agent remains a file-writing research worker rather than a memory mutator.

2. Rank 2: Use direct file indexing for iteration artifacts; do not run the final continuity writer on every iteration.

   Reference mechanism: kasper records each evaluated session as a durable unit, updates aggregate state, and marks the store dirty in `recordSession` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:299`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:308`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:239`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:258`]. It does not wait for a final session summary before preserving the observation.

   Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`. The per-iteration step should call `memory_save` on the iteration narrative and/or a compact generated digest derived from the delta, not `generate-context.js`. The current final save phase composes a structured payload and routes continuity through `generate-context.js` only after synthesis [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:975`] [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:982`] [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:999`]. The workflow already documents `memory_save({ filePath })` as the direct indexing primitive when immediate visibility is required [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:1003`] [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:1006`]. Port-difficulty: easy. Tag: quick-win. Why it helps: per-iteration streaming becomes an indexing operation over write-once research evidence, while final `generate-context.js` remains the canonical continuity/save boundary.

3. Rank 3: Refresh `memory_context` before rendering the next prompt, after the previous iteration has been upserted.

   Reference mechanism: kasper injects context by reading aggregate and recent-session state at context-build time, then appending feedback into `output.context` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/index.ts:718`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/index.ts:723`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/index.ts:729`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/index.ts:781`]. The feedback loop is closed because evaluation writes state first, and later session context reads that state.

   Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`. Today `memory_context` fires only at workflow start before `phase_init` [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:55`]. Add a focused per-iteration refresh in `step_dispatch_iteration.pre_dispatch` before `render_prompt_pack`, using `{research_topic}`, `{next_focus}`, and `{current_iteration}` as the input envelope [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:582`] [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:590`] [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:598`]. Port-difficulty: med. Tag: quick-win. Why it helps: streamed findings from iteration N can shape the prompt for iteration N+1, and concurrent deep-loop runs can see each other's indexed evidence without waiting for final synthesis.

4. Rank 4: Make the hook idempotent and best-effort, with write-amplification guards matching both reference repos.

   Reference mechanism: loop-cli-main skips persistence when the serialized snapshot is unchanged [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:280`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:281`]. Kasper debounces dirty state to a later flush [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:889`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:894`]. Spec Kit Memory already treats `memory_save()` as content-hash based indexing, so unchanged files can be skipped at the memory layer [TARGET-CONTEXT: `.opencode/skills/system-spec-kit/references/memory/memory_system.md:549`].

   Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`. The new `step_memory_upsert_iteration` should be non-fatal: log a warning event if indexing fails, continue loop execution, and rely on final save / later `memory_index_scan` as recovery. Port-difficulty: easy. Tag: quick-win. Why it helps: memory visibility improves without turning transient MCP/indexer failures into research-loop failures or duplicating unchanged iteration artifacts.

5. Rank 5: For the deeper version, have the reducer emit a compact memory digest beside registry/dashboard updates.

   Reference mechanism: kasper separates raw session recording from aggregated context consumption: `recordSession` writes normalized session state, then aggregate/recent getters drive later feedback context [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:240`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:271`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/index.ts:723`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/index.ts:729`].

   Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`. A deeper backlog item is to derive `research/memory-digests/iter-NNN.md` from the latest canonical iteration record, findings, graphEvents, and answered questions during reducer execution, then have the YAML call `memory_save` on that digest rather than indexing the full narrative/delta directly. The reducer already finds latest iteration records and reads per-iteration deltas [TARGET: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:427`] [TARGET: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:982`] [TARGET: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:1042`]. Port-difficulty: hard. Tag: deep-rewrite. Why it helps: memory receives stable, low-noise retrieval text while the packet still preserves full raw evidence locally.

## Questions Answered

- S5-06 is answered: the upsert should be orchestrator-owned and fire after `post_dispatch_validate`, `step_reduce_state`, and `step_graph_upsert`, before `step_evaluate_results` / iteration increment.
- `memory_context` should refresh before the next prompt render, not during leaf-agent execution and not only at workflow start.
- Per-iteration streaming should use direct `memory_save` indexing over iteration artifacts or reducer-generated digests. Final `generate-context.js` should remain the synthesis/save continuity boundary.

## Questions Remaining

- Decide whether the quick-win path indexes the full iteration markdown, the delta JSONL, or a generated digest file. The digest is cleaner, but it is the deeper rewrite.
- Decide the exact warning event shape for memory-upsert failures so reducers and dashboards can show degraded memory streaming without treating the research iteration as failed.
- Update the deep-research protocol docs if the per-iteration hook lands; the current reference still states that `generate-context.js` is the supported save boundary for the workflow.

## Next Focus

Suggested next focus: a D2 target-mapping pass for the concrete memory-upsert contract: file selection, idempotency key, warning event schema, and whether `memory_save` should index iteration narratives directly or only reducer-generated memory digests.
