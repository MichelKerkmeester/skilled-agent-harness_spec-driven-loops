# Iteration 15: Hybrid Evidence and Knowledge-Graph Routing

## Focus

The orientation asks for graph-assisted retrieval without confusing workflow evidence, domain knowledge, or vector similarity.

## Findings

1. AgentSwarms implements hybrid lexical/vector retrieval by normalizing scores within each ranked list, weighting them, deduplicating by chunk id, and exposing which retriever found each result. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/kbRag.ts:160-252]
2. Its graph retriever selects lexical seed entities and expands one and two hops with hard caps before returning triples, facts, and citations. This is bounded graph traversal, not a universal replacement for retrieval. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/utils/tools/kb-graph.server.ts:117-240]
3. Decision: keep two typed graphs. The `EvidenceGraph` records run artifacts, claims, findings, source spans, verdicts, contradictions, and certificates. The `KnowledgeGraph` records domain entities and relationships extracted from corpora. Cross-links are explicit `SUPPORTED_BY|CONTRADICTED_BY|DERIVED_FROM` edges carrying source and extraction policy. [INFERENCE: prevents execution truth from inheriting uncertain entity-resolution claims]
4. A deterministic query classifier chooses `lexical`, `vector`, `graph`, or `hybrid`; lexical handles exact ids/symbols, vector handles semantic lookup, graph handles multi-hop/temporal/relationship questions, and hybrid fuses candidates before evidence reranking. The route and candidate provenance are trace events. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md:160-195]
5. Retrieved paths are evidence candidates, never authorization. A claim bundle must include the exact source spans and traversal path; missing provenance downgrades it to discovery-only. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering replaced RAG at Microsoft, Stanford and Anthropic. Here's how it works.md:312-372]
6. When not to use: vector/lexical retrieval wins for simple lookup; graph traversal is reserved for relation, temporal, contradiction, or multi-hop questions. Do not incur entity-resolution and traversal cost when the query has no structural need. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/What is Graph Engineering.md:160-182]

## Ruled Out

- One combined authority/knowledge graph; graph-only retrieval; provenance-free graph answers.

## Assessment

- New information ratio: 0.85
- Novelty: separates graph purposes and makes the retrieval route observable and reviewable.
- Questions addressed/answered: q-hybrid-routing base architecture.

## Recommended Next Focus

Add temporal validity, supersession, contradiction, and entity-resolution controls.
