<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Plan — Phase 007: Native per-iteration model schedule for deep-loop fan-out

## Approach
Model an iteration schedule as an ordered sequence of single-executor lineages (bands) inside the existing fan-out machinery, not as new intra-loop executor rotation. Reframe "nine times M2.7 then one time Opus" as two homogeneous bands the system already supports: band A executor `minimax MiniMax-M2.7-highspeed` iterations 9; band B executor `claude-opus-4-8` iterations 1, `dependsOn` A. Add a thin `iterationPlan` flag (a.k.a. `model-schedule`) over the existing `executors` schema that desugars one-to-one into ordered lineages plus a minimal sequencing hint, reusing `step_fanout_spawn`, `step_fanout_spawn_cli`, `fanout-pool.cjs`, `fanout-run.cjs`, `fanout-salvage.cjs`, `fanout-merge.cjs`, and `executor-config.ts`. Per-band focus/dimensions become optional fields threaded into existing per-iteration prompt construction; merge precedence (Opus overrides MiniMax on conflict) is an ordered band-priority list consumed by `fanout-merge.cjs`, keeping severity rollup as an invariant above priority. Single-executor and homogeneous fan-out stay byte-identical; the mode is opt-in, absent-by-default. Reuse the deep-research-before-build convention if siblings use it, front-loading research to lock the desugaring contract against the real fan-out APIs.

## Steps
1. T1: confirm sibling convention (parent spec + phases 001/005/006) — lean shape, `_memory.continuity` field set, deep-research-before-build usage; mirror it.
2. T2: front-loaded research — document real interfaces of `executor-config.ts`, `step_fanout_spawn`/`step_fanout_spawn_cli` (both auto YAMLs), `fanout-pool.cjs`, `fanout-run.cjs`, `fanout-salvage.cjs`, `fanout-merge.cjs`; capture exact entry points and the desugaring target fields.
3. T3: design the `iterationPlan` schema and the iteration-plan/model-schedule flag — ordered bands, string sugar, validation, one-to-one desugaring into the `executors` lineage array.
4. T4: specify desugaring and dispatch integration — `step_fanout_spawn`/`step_fanout_spawn_cli` consume desugared lineages through `fanout-pool.cjs`/`fanout-run.cjs` unchanged; per-lineage artifact-dir isolation, session id, per-kind state-dir per band.
5. T5: specify ordered/sequential bands — minimal `dependsOn`/`order` extension so band B runs after band A with optional seed-context handoff, inside the existing pool driver (no ad-hoc shell, `/tmp`, or direct CLI loop).
6. T6: specify per-band focus/dimensions — generalize the packet 122 case statement into optional per-band fields threaded into per-iteration prompt construction for both consumers, with a default when omitted.
7. T7: specify per-iteration/per-band audit — band and model attribution in the JSONL state log, deltas, and findings registry (both consumers).
8. T8: specify merge precedence — ordered band-priority list in `fanout-merge.cjs` for conflict resolution, preserving the severity-rollup invariant for review and dedup/attribution for research.
9. T9: map contract compliance and backward compatibility — enumerate each deep-review forbidden pattern; preserve read-only/externalized-state/per-iteration-JSONL; opt-in absent-by-default; byte-identical guarantee; regression checks list.
10. T10: author the Level-2 docs (lean trio plus checklist), populate `_memory.continuity`, generate `description.json` and `graph-metadata.json`, run strict `validate.sh`.

## Verification
Spec/plan/tasks match the Level-2 lean shape used by siblings 001/005/006; `_memory.continuity` carries the full field set with `recent_action`/`next_safe_action` <= 96 chars and non-narrative. `description.json` and `graph-metadata.json` present with child fields (specId `007`, parent chain to packet 123, status `planned`). Each Success criterion maps to at least one task and one risk mitigation. No code files touched; only the canonical docs under this phase folder are created. Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-phase-folder> --strict` (siblings carry the same template-anchor warnings under lean authoring; clear the hard FILE_EXISTS/continuity errors and match sibling shape).
