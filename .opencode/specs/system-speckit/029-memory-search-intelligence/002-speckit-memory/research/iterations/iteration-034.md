# Iteration 34: Round I Implementation Sketch — C9 graceful embedder-degrade (needs-validation-first)

## Focus
Round I: build sketch for C9 (route embedder-unavailable → lexical instead of throwing). Read-only.

## Build sketch (newInfoRatio 0.45) — **NEEDS-VALIDATION-FIRST**
- **TOUCH:** `pipeline/stage1-candidate-gen.ts:705-707` (hybrid throw), `:1018-1020` (vector throw), `:680-682` (multi-concept throw) — all convert a null embedding (root: `vector-index-queries.ts:824-826` catches ALL embedder errors → null) into a throw. + `pipeline/types.ts:226` add `embedderAvailable?:boolean`.
- **CHANGE:** at each throw site set `embedderAvailable=false` + run lexical channels. Hybrid (`:705`) drops to fts/bm25/graph via the LIVE `useVector=false` substrate (`hybrid-search.ts:940-969 getAllowedChannels`). **Nuance:** the vector (`:1018`) + multi-concept (`:680`) branches have NO in-branch lexical fallback (call vectorSearch directly) — they must route to `keyword_search` (`vector-index-queries.ts:840`) or re-enter via the hybrid `useVector=false` path. Surface `embedder_available:false` through Stage1Output.metadata → PipelineResult.metadata.stage1; flip orchestrator's existing `degraded` flag.
- **WHAT-BREAKS:** the orchestrator's MANDATORY-stage1 contract (`orchestrator.ts:7,49,62` "throws on failure") — relaxing the all-or-nothing invariant is the real blast radius. No code keys on `PIPELINE_STAGE1_FAILED` (grep clean), but any `executePipeline` caller that catches the throw to detect an outage must switch to reading the flag.
- **READINESS:** needs-validation-first (verify how the vector/multi-concept branches reach a lexical generator — the `useVector=false` substrate is wired for the hybrid entry path, NOT these branches; enumerate throw-catchers).

## Next Focus
C9 is a solid degrade sketch but the vector/multi-concept branches need a lexical-route confirmation (the substrate covers only the hybrid entry path). Feeds Round J + the validation list.
