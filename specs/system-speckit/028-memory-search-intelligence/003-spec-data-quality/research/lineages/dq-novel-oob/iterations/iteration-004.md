# Iteration 004 — KQ4: Knowledge-graph enrichment auto-extracted from content + auto-summarization rollup nodes

## Focus

Two candidates that sound green-field but collide with shipped machinery. (a) Knowledge-graph enrichment auto-extracted from doc CONTENT (entities + typed relations). (b) Auto-summarization rollup nodes that compress a packet's children into a synthesized parent embedding.

## What the live code actually does

- A content entity-extractor ALREADY EXISTS. `lib/extraction/entity-extractor.ts` is a rule-based, dependency-free extractor (flag `SPECKIT_AUTO_ENTITIES`) that pulls `proper_noun | technology | key_phrase | heading | quoted` entities from memory `content_text`, with frequency, and stores them in a catalog. `lib/search/entity-linker.ts` computes `computeEdgeDensity`. A causal graph exists (`handlers/causal-graph.ts`, `causal-links-processor.ts`).
- So "auto-extract a knowledge graph from content" is PARTLY shipped: entity MENTIONS and edge density are auto-derived today. What is absent is TYPED RELATIONS between entities (subject-predicate-object), which the rule-based extractor does not produce.
- Rollup nodes: the parent and dq-deep both rejected a NEW rollup node type because the first-class embedded `graph-metadata.derived` rollup record already exists (embedded at weight 0.75). A summarization rollup is a specific instance of that rejected node type.

## The novel delta and where it dies

1. **Typed-relation KG (the genuinely new part).** An LLM could extract typed edges (`packet-A supersedes packet-B`, `spec depends-on schema-X`) that the rule-based extractor cannot. This is novel. But its consumer is the graph-boost path, and the parent measured the typed edges as SPARSE-not-absent (57 files, 103 edges) feeding a weak ranking signal. So a richer typed-relation KG enriches a low-weight signal — L-class governance value, floor-bypassing, but a modest ranking effect. It also risks the self-referential community cycle the parent flagged for any parallel graph lane.
2. **Auto-summarization rollup (the part that is already rejected).** A synthesized parent summary embedding is exactly a new rollup-node-type by another name. The parent's net-negative caution applies in full: a rollup that wins a broad query by displacing a child ALSO displaces a real specific child on a mis-classified narrow query, and the broad-vs-narrow gate is a heuristic not a measurement. Auto-summarization makes this WORSE because an LLM summary can hallucinate or omit, so the displacing row may be lower-fidelity than the child it cut.

## Value per reader

- Typed-relation KG: L logic real (an explicit dependency/supersedes graph is a true logic-reading aid and a navigation surface), R retrieval marginal (enriches the sparse low-weight graph-boost), A low.
- Auto-summarization rollup: R retrieval is the claimed win but it is the parent's single net-negative candidate, amplified by summary infidelity.

## Floor survival

- Typed-relation KG: floor-bypassing for its logic/governance value (it is a navigation and provenance surface, not a vector row), floor-relevant-but-weak for the graph-boost. Safe but modest.
- Auto-summarization rollup: floor-ENGAGED and net-negative-capable. It can only win by displacing a child in the top-3, which is the riskiest move in the whole packet.

## Go / No-Go

- Typed-relation KG auto-extraction (LLM relations on top of the shipped entity extractor): GO-on-cost as an L/governance enrichment, novel relative to the rule-based mention-only extractor, distinct from anything the reuse-first program named. Build as a navigation/provenance surface, NOT as a ranking lane. Reuse the shipped entity catalog as the node set; add typed edges.
- Auto-summarization rollup nodes: NO-GO. It is the rejected new-node-type with an infidelity multiplier, sitting on the parent's one net-negative seam.

## Dead Ends

- A parallel KG index lane: duplicates the shipped entity catalog + causal graph and risks the self-referential community cycle (parent NO-GO).
- Summarized-parent embeddings as a retrieval win: parent net-negative caution + LLM summary infidelity.

## Sources

- `lib/extraction/entity-extractor.ts` (shipped rule-based entity extraction, `SPECKIT_AUTO_ENTITIES`)
- `lib/search/entity-linker.ts computeEdgeDensity`; `handlers/causal-graph.ts` (shipped graph substrate)
- Parent: typed edges sparse-not-absent (57 files/103 edges); rollup net-negative caution; new-node-type NO-GO
- dq-deep: "new metadata file/node type duplicates the derived record" eliminated

## Assessment

newInfoRatio 0.70 — one candidate (auto-summarization rollup) collapses into an already-rejected NO-GO with an added infidelity risk; the other (typed-relation KG) is a real novel GO-on-cost but only as an L/governance surface, never as a ranking lane. The shipped entity extractor is the key correction: KG-from-content is half-built, not green-field.
