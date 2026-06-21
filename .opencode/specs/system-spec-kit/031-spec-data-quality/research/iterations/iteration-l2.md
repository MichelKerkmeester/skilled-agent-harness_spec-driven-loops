# Iteration L2 - Rollup-Node Design and Set-Merge Necessity (deepseek, retrieval)

## TITLE

Cohort L2 retrieval. Model deepseek-v4-pro. Angle takes the rollup candidate from feasibility to a concrete first-class embedded design, confirms the 0.02 trap in code, and judges whether the LightRAG incremental set-merge is needed for the v1 rollup at all.

## FINDINGS

The 0.02 trap is code-confirmed. Community-summary results today enter only through the fallback at `memory-search.ts:1286`, where the community score scale of 0.02 floors every community row at or below 0.02. That sits at the degradation quality threshold (`hybrid-search.ts:318`) and far below any candidate that survives truncation. The fallback is gated on a weak result with fewer than 3 hits on global or auto (`memory-search.ts:1237-1238`). So community summaries are structurally incapable of reaching the production top-3 even on the broadest queries, and the summaries themselves are cheap syntactic templates with no embedding (`community-summaries.ts:74-108`).

The rollup-node path is genuinely distinct from the deleted edge-lanes. 028 deleted graph and edge retrieval because no graph file carried populated manual edge slots and because tail-additive lanes never displace the top-3. A rollup enters as a first-class index record with its own full vector embedding, competing at candidate generation, not injected post-ranking at the tail. It rides the populated `derived.causal_summary` field, not the empty manual slots.

Cheap concatenation is the safe v1 and LLM aggregation is additive. The existing summary builder already concatenates member titles, folders, and ids into a short string. A track or phase rollup would concatenate children's causal summaries plus each child status, importance tier, and packet id. This is hash-stable, zero-cost, and already structured by the parent and children fields in the graph schema and the parent chain in the description. The truncation law means the rollup only has to rank above random child hits, so even a structured concatenation that opens with the track name carries a retrieval signature absent from any single child. The broad-versus-specific gate is already half-wired. The retrieval-level parameter already distinguishes local, global, and auto, so a rollup record with a rollup context type is excluded on local and included on global or auto with no new routing pipeline.

The incremental set-merge is unnecessary for the v1 rollup. LightRAG incremental updates target node-level additions to a live graph. Cheap-concat rollups change only when a child causal summary changes, which happens at save time as an already-triggered rebuild, or when the child set changes on packet create or delete. Full rebuild on save is cheap and community detection already runs as a full rebuild on trigger, which stays correct at this scale. The hash-drift hazard is real but bounded. If a child summary changes but the rollup re-index is deferred, the stored rollup content goes stale and the content-keyed embedding cache reuses a stale vector (`embedding-pipeline.ts:121-123`). Mitigation is a rollup content-version in the cache key plus a periodic health check that recomputes rollup content from current children and flags a mismatch for re-index. Rollup records must also be excluded from causal-graph and community-detection input to avoid a self-referential cycle.

## CONCRETE CHANGE

Candidate 6. Add a rollup generator that runs at save time. For each track and each phase parent, concatenate children's causal summary, status, importance tier, and packet id into a structured markdown string, save it as a synthetic index record with a rollup context type and a rollups file path, and send it through the full embedding pipeline. Filter rollup records out at candidate generation on local retrieval and include them on global or auto.

Candidate 7. Skip incremental set-merge for v1. Add a periodic full-rebuild health check that recomputes rollup content from children and compares the hash against the stored content, flagging stale rollups for re-index. Exclude rollup records from causal-graph and community-detection input.

## EVIDENCE

- 0.02 multiplier and threshold: `memory-search.ts:1286`, `hybrid-search.ts:318`.
- Fallback gate on weak result plus global or auto: `memory-search.ts:1237-1238`.
- Community summary is cheap syntactic concatenation with no embedding: `community-summaries.ts:74-108`, stored keyword-only at `community-storage.ts:121-148`.
- Graph schema carries a populated causal summary, manual edges empty: `graph-metadata-schema.ts:61-71`, manual slots empty in the local packet graph file.
- 028 truncation law: `028/before-vs-after.md:161`, `:169`.
- Confidence truncation in prod, skipped in eval: `confidence-truncation.ts:35`, `hybrid-search.ts:2049-2067`.
- Embedding cache key uses normalized content: `embedding-pipeline.ts:121-123`.
- retrievalLevel already distinguishes local, global, auto: `memory-search.ts:362-363`.
- Brief citations: GraphRAG community hierarchy and LightRAG dual-level retrieval at `stage-0-external-findings.md:31-32`, candidate ranking at `:96`.

## READER

Retrieval primary. A rollup as a first-class index record with its own embedding competes at candidate generation, and for a broad query a single rollup summarizing many children has a better shot at the top-3 than any one child covering one angle. Logic secondary. The track and phase hierarchy becomes machine-readable through structured rollup content, serving the GraphRAG community purpose on the production path rather than the 0.02 fallback.

## ON-WRITE OR RETROACTIVE

Both. The rollup generator runs at save time on-write. A one-time retroactive scan during index reconciliation generates rollups for all existing tracks and phase parents. The hash-staleness check is a retroactive periodic health check.

## RISK

Concatenated causal summaries may lack the coherence of an LLM synthesis, and a noisy rollup could displace a real specific hit, so measure broad versus narrow prod impact before default-on and keep cheap-concat as v1 with LLM aggregation additive. An imperfect broad-versus-specific classification leaks a rollup into local and wastes a top-3 slot, mitigated by gating on the existing caller-controlled retrieval level. Rollups in the causal graph or community detection create cycles, mitigated by filtering the rollup context type at the detection boundary. A deferred re-embed leaves stale rollup content while children are current, mitigated by the content-version cache key and the periodic hash check.
