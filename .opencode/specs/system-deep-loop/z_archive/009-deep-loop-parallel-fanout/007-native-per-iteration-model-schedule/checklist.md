<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Checklist — Phase 007: Native per-iteration model schedule for deep-loop fan-out

Design/spec phase. "Done" means the design artifact answers each item; no runtime behavior is
built here.

## Design coverage
- [ ] [P1] Command surface specified for both `/deep:start-review-loop` and `/deep:start-research-loop` (iteration-plan / model-schedule flag).
- [ ] [P1] One-to-one desugaring from iterationPlan bands into the existing `executors` lineage array specified.
- [ ] [P1] Desugaring pinned to real entry points (executor-config.ts, step_fanout_spawn, step_fanout_spawn_cli, fanout-pool.cjs, fanout-run.cjs).
- [ ] [P1] No parallel dispatcher introduced; existing machinery reused (checked against scope-out).
- [ ] [P1] Ordered/sequential bands (dependsOn/order) with optional seed-context handoff specified inside the existing pool driver.
- [ ] [P2] Per-band focus/dimensions assignment specified for both consumers, with a default when omitted.
- [ ] [P1] Per-iteration/per-band audit and tracing (band + model attribution) specified in the JSONL state log, deltas, and findings registry.
- [ ] [P1] Merge precedence specified as an ordered band-priority list in fanout-merge.cjs.
- [ ] [P1] Severity-rollup invariant preserved above band priority (any active P0 from any band forces merged FAIL).
- [ ] [P2] Research dedup/attribution behavior specified alongside review severity-rollup, with two-consumer differences called out.

## Contract compliance
- [ ] [P1] Every deep-review forbidden pattern enumerated and shown satisfied (no ad-hoc shell fan-out; no direct cli loop; no /tmp prompt dispatch; no Task-tool agent dispatch; no skipping the JSONL state machine; state under the local packet).
- [ ] [P1] Read-only, externalized-state, and per-iteration-JSONL contracts preserved.
- [ ] [P1] All new fields opt-in/absent-by-default.
- [ ] [P1] Byte-identical guarantee stated for single-executor and homogeneous fan-out when the plan is unset.
- [ ] [P2] Regression checks the future implementation must pass are listed.

## Phase hygiene
- [ ] [P2] Level-2 lean structure (Purpose, Scope, Success) present in spec.
- [ ] [P2] Tasks T1-T10 present and all unchecked at authoring time.
- [ ] [P2] Risks enumerated with mitigations.
- [ ] [P1] description.json and graph-metadata.json present with correct child fields.
- [ ] [P1] _memory.continuity fields within length and non-narrative limits.
