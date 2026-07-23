# Iteration 2: Persistent Backend Readiness and Missing Wiring

## Focus

Assess whether the database is merely a sketch or a deployable projection, then enumerate what still separates it from a safe default.

## Findings

1. The persistent implementation is technically substantial, not a stub: schema v2 contains normalized style/provenance/artifact/facet/section tables, external-content FTS5, embeddings/jobs/vectors, relationships, immutable corpus generations, and indexes. [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:35-269]
2. Publication and rollback are implemented around immutable generation files plus an atomic `.current.json` manifest pointer. The operator supports `status`, `build`, `cutover`, `rollback`, and vector `repair`, retaining current plus one rollback generation. [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:6-49] [SOURCE: .opencode/skills/sk-design/styles/_db/operator.mjs:75-185] [SOURCE: .opencode/skills/sk-design/styles/_db/operator.mjs:207-247]
3. Query semantics exceed today's consumer needs: structured, FTS5, and optional vector lanes feed deterministic weighted RRF, generation-bound cursors, attribution, and channel-local degradation. Consumers currently ask for at most five reference cards and do not supply evidence that vector search or pagination is required. [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:13-25] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:168-294] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:364-510] [INFERENCE: iteration 1 consumer evidence]
4. The code deliberately avoids implicit construction: `buildStyleDatabase()` is never invoked by query or hydrate, and the operator requires an explicit corpus path. Therefore changing the mode default alone would fail on a clean checkout because neither the default SQLite artifact nor its pointer exists. [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:40-43] [SOURCE: .opencode/skills/sk-design/styles/_db/operator.mjs:213-226] [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:11-23]
5. A production cutover needs more than one successful build: it needs a refresh owner tied to corpus extraction/update, artifact distribution or deterministic local bootstrap, status/repair observability, and a failure policy. No such default-path lifecycle is visible in the facade or operator; reads fail closed rather than auto-building, which is correct for integrity but leaves operations unowned. [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:27-49] [SOURCE: .opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:144-166]
6. Shadow mode is a useful migration gate but its parity comparison intentionally tolerates generation hashes, content hashes, score values, and ranking mode. It checks projected cards and eligibility, not strict rank/score equivalence; default cutover should additionally use the differential oracle and live-corpus relevance/latency evidence. [SOURCE: .opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:113-141] [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:89-131]

## Ruled Out

- Calling the database "unfinished": the storage, publication, query, hydration, telemetry, and operator machinery is implemented and tested.
- Flipping `legacy` to `persistent` as the entire wiring plan: it would point clean checkouts at a missing publication pointer.

## Dead Ends

- Treating feature richness as proof of default-path value. The vector/cursor/relationship machinery is capability supply; observed consumer demand remains separate.

## Edge Cases

- Ambiguous input: "build and populate" could commit a generated DB or bootstrap locally. Both remain viable, but either requires an explicit freshness/distribution owner.
- Contradictory evidence: the implementation is deployable in isolation while the product integration is incomplete. This is not a code-quality contradiction; it is an ownership gap.
- Missing dependencies: no production workload trace or committed DB artifact.
- Partial success: readiness is established statically, not through a live full-corpus build in this write-restricted research lineage.

## Sources Consulted

- `.opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:1-357`
- `.opencode/skills/sk-design/styles/_db/README.md:1-147`
- `.opencode/skills/sk-design/styles/_db/indexer.mjs:1-480`
- `.opencode/skills/sk-design/styles/_db/schema.mjs:1-360`
- `.opencode/skills/sk-design/styles/_db/retrieval.mjs:1-520`
- `.opencode/skills/sk-design/styles/_db/operator.mjs:1-268`

## Assessment

- New information ratio: 0.85
- Novelty justification: Five findings are new and one refines the consumer-demand result from iteration 1.
- Questions addressed: persistent implementation completeness and exact default-path gap.
- Questions answered: the implementation is mature, but no build/distribution/refresh owner or cutover evidence makes it a real default.
- Confidence: high on static readiness; medium on operational effort until a full-corpus build and workload trace are measured.

## Reflection

- What worked and why: separating implementation completeness from integration completeness resolved the apparent "built but unused" paradox.
- What did not work and why: reading only the first indexer segment did not expose the full build function, but the operator and README independently establish its lifecycle and invocation contract.
- What I would do differently: quantify current benefits and recurring costs before treating the missing lifecycle as work worth funding.

## Recommended Next Focus

Measure the economic case from available evidence: corpus size, legacy query work, existing benchmark claims, DB build/repair burden, and missing relevance/workload validation.
