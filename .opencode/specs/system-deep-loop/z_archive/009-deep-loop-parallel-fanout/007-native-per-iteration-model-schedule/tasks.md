<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks — Phase 007: Native per-iteration model schedule for deep-loop fan-out

All tasks are design/spec only. No code is written in this phase.

- [ ] T1: Confirm sibling convention — read parent spec + phases 001/005/006 for the Level-2 lean shape, the _memory.continuity field set, and deep-research-before-build usage; mirror it.
- [ ] T2: Front-loaded research (deep-research-before-build) — document real interfaces of executor-config.ts, step_fanout_spawn + step_fanout_spawn_cli (both auto YAMLs), fanout-pool.cjs, fanout-run.cjs, fanout-salvage.cjs, fanout-merge.cjs; capture exact entry points and the desugaring target fields.
- [ ] T3: Design the iterationPlan schema + iteration-plan/model-schedule flag — ordered bands (from-to or count; executor kind and model; optional focus/dimensions; optional dependsOn/order), string sugar, validation, one-to-one desugaring into the executors lineage array.
- [ ] T4: Specify desugaring + dispatch integration — step_fanout_spawn + step_fanout_spawn_cli consume desugared lineages through fanout-pool.cjs + fanout-run.cjs unchanged; per-lineage artifact-dir isolation, session id, per-kind state-dir per band.
- [ ] T5: Specify ordered/sequential bands — minimal dependsOn/order extension so band B runs after band A with optional seed-context handoff, inside the existing pool driver (no ad-hoc shell, /tmp dispatch, or direct cli loop).
- [ ] T6: Specify per-band focus/dimensions — generalize the packet 122 run_one.sh dimensions into optional per-band fields threaded into per-iteration prompt construction for both review and research, with a default when omitted.
- [ ] T7: Specify per-iteration/per-band audit + tracing — band and model attribution in the JSONL state log, deltas, and findings registry (both consumers).
- [ ] T8: Specify merge precedence — ordered band-priority list in fanout-merge.cjs for conflict resolution (Opus band overrides MiniMax band), preserving the severity-rollup invariant for review and dedup/attribution for research.
- [ ] T9: Map contract compliance + backward compatibility — enumerate each deep-review forbidden pattern and show the mode satisfies it; preserve read-only/externalized-state/per-iteration-JSONL; opt-in absent-by-default; byte-identical guarantee; list regression checks.
- [ ] T10: Author the Level-2 docs (lean trio plus checklist), populate _memory.continuity, generate description.json + graph-metadata.json, run strict validate.sh.
