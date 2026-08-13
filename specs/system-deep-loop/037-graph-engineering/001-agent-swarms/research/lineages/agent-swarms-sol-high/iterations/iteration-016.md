# Iteration 16: Temporal Provenance and Contradiction

## Focus

A durable graph must represent when a fact was valid and when it was learned, while refusing unsafe identity merges.

## Findings

1. The corpus argues for bitemporal edges: world-valid time and system-observed time. Contradicted facts close their validity interval and are superseded rather than overwritten. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/What is Graph Engineering.md:144-159]
2. Decision: `KnowledgeAssertionV1` carries canonical subject/object ids, controlled predicate, source span digest, extractor/version, asserted confidence, `valid_from/valid_until`, `observed_at`, and status (`active|superseded|contradicted|uncertain`). [INFERENCE: turns temporal knowledge into reviewable assertions instead of mutable triples]
3. Contradiction and supersession are separate typed edges. Contradiction preserves competing claims; supersession requires an accepted identity/predicate match plus newer-validity evidence. Neither operation deletes source history. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering replaced RAG at Microsoft, Stanford and Anthropic. Here's how it works.md:312-372]
4. Entity resolution is a gated proposal with aliases, candidate ids, evidence, confidence, and reviewer/deterministic outcome. Exact curated identifiers may auto-link; fuzzy merges remain uncertain until verified because per-hop identity errors compound across paths. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/What is Graph Engineering.md:184-198]
5. Query results must expose the as-of time, observed-time cutoff, identity assumptions, active and contradictory paths, and source spans. An evidence graph can cite an uncertain knowledge assertion but cannot promote its confidence or hide the uncertainty. [INFERENCE: maintains provenance across the knowledge/evidence boundary]
6. When not to use: do not build an extracted entity graph for a small corpus with reliable direct links or exact identifiers; prefer curated links and lexical retrieval. Do not infer causal edges from co-occurrence. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering replaced RAG at Microsoft, Stanford and Anthropic. Here's how it works.md:230-310]

## Ruled Out

- Overwriting stale facts; fuzzy auto-merge; co-occurrence-as-causation.

## Assessment

- New information ratio: 0.79
- Novelty: adds bitemporal assertion identity and contradiction-preserving resolution.
- Questions addressed/answered: q-hybrid-routing temporal/provenance controls.

## Recommended Next Focus

Integrate observability, trajectory evaluation, negative controls, and cost accounting.
