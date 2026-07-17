<!-- iteration 41 | model glm (zai-coding-plan/glm-5.2) | angle: Knowledge-graph / GraphRAG accumulation loops | 2026-07-15T00:33:51.738Z -->

I'll research Knowledge-graph / GraphRAG accumulation loops for this iteration. Let me search for real, current repos and techniques not yet catalogued.
Good finds. Let me explore more incremental KG and graph-expansion loop repos.
Let me verify a couple more: the KAG repo and iText2KG for iterative entity linking loops.
Let me verify HippoRAG — the memory-consolidation analogue that fast-graphrag builds on, likely uncatalogued.
## Analysis: Knowledge-graph / GraphRAG accumulation loops

The `microsoft/graphrag` parent was catalogued, but its **entire accumulation-focused successor ecosystem was unmapped** — and that ecosystem is precisely the literature on iterative graph expansion for knowledge accumulation. Six verified, high-signal repos emerged, all distinct mechanisms:

1. **HKUDS/LightRAG** (~37.7k★, EMNLP'25, 8,741 commits, active through 2026) — accumulates by *local-build-then-set-merge*: each new chunk builds a local graph that's merged into the global graph via set union, never a global rebuild. Plus a `SOURCE_IDS_LIMIT_METHOD` that **stops enriching an entity once it's "rich enough"** — a saturation signal. This is the canonical continuity-threading pattern.

2. **gusye1234/nano-graphrag** (~3.9k★, 2024) — the cleanest demonstration of hash-keyed idempotent accumulation (md5 of content as key) **and** its documented failure mode: "each insert re-computes ALL communities + re-generates ALL community reports." The cost-saving claim is directly contradicted by its own caveat.

3. **circlemind-ai/fast-graphrag** (~3.8k★) — retrieval over the accumulated graph via **personalized PageRank** (query seeds the walk), and an explicit `checkpointing.ipynb` "to avoid irreversible data corruption" — accumulation is destructive, so it must be checkpointed.

4. **OpenSPG/KAG** (~8.9k★, v0.8.0 Jun 2025) — argues schema-free OpenIE accumulation *degrades* quality via noise, fixed only by schema-constrained construction + conceptual semantic reasoning. Added static vs iterative task-planning modes.

5. **OpenSPG/openspg** (~2.2k★) — the engine; explicit "continuous iterative evolution of incomplete data states" with entity-linking/normalization operators.

6. **OSU-NLP-Group/HippoRAG** (~3.9k★, NeurIPS'24 + ICML'25 "From RAG to Memory") — neurobiologically-inspired continual learning; claims *fewer* offline indexing resources than GraphRAG/LightRAG yet wins continual-learning benchmarks, and explicitly frames accumulation as **memory consolidation**.

**Transfer to system-deep-loop:** the runtime's `continuity-threading` should accumulate each iteration's deltas via content-keyed set-merge (not re-derive the whole graph) — LightRAG's model. `dedup-novelty` currently keys on hash/similarity, but KAG/OpenSPG prove that **without an entity-resolution/canonicalization step, the accumulated structure fragments** (e.g. "deep-loop" vs "deep_loop" vs "system-deep-loop" become 3 nodes) and novelty scoring silently breaks. `budget-cost` gains a saturation gate: stop spending tokens on a node flagged "rich enough." `deep-research`'s next-iteration broadening seed should come from a **graph-walk (PageRank)** over accumulated findings, not a flat re-rank. And because accumulation is destructive, every merge must be `state-jsonl-checkpointing`-wrapped for rollback — fast-graphrag learned this the hard way.

```json
{
  "new_repos": [
    {"name":"HKUDS/LightRAG","url":"https://github.com/HKUDS/LightRAG","stars":"~37.7k","what":"GraphRAG alt (EMNLP'25) with dual-layer KG+vector; incremental KB via local-graph set-merge, no global rebuild","lesson":"Accumulate per-iteration deltas by local-build-then-set-merge keyed on content, not global re-derivation; add a 'rich-enough' saturation gate that stops enriching a node","maps_to":["runtime/continuity-threading","runtime/budget-cost","runtime/dedup-novelty"],"confidence":"high"},
    {"name":"gusye1234/nano-graphrag","url":"https://github.com/gusye1234/nano-graphrag","stars":"~3.9k","what":"Minimal GraphRAG (~1100 LOC) with md5-hash-keyed incremental insert","lesson":"Content-hash idempotency is necessary but NOT sufficient: its own caveat shows global re-clustering every insert balloons cost — accumulate idempotently but never globally re-derive structure per iteration","maps_to":["runtime/dedup-novelty","runtime/budget-cost"],"confidence":"high"},
    {"name":"circlemind-ai/fast-graphrag","url":"https://github.com/circlemind-ai/fast-graphrag","stars":"~3.8k","what":"Promptable GraphRAG using personalized PageRank graph exploration (HippoRAG-inspired) with incremental updates + checkpointing notebook","lesson":"Query the accumulated graph by graph-walk (PageRank seeded by query) rather than flat similarity; wrap every destructive merge in a checkpoint to roll back bad accumulations","maps_to":["deep-research","runtime/state-jsonl-checkpointing","runtime/fan-out-fan-in"],"confidence":"high"},
    {"name":"OpenSPG/KAG","url":"https://github.com/OpenSPG/KAG","stars":"~8.9k","what":"Knowledge-Augmented Generation (v0.8.0 Jun 2025); schema-constrained construction + conceptual semantic reasoning to fix OpenIE noise; static & iterative task-planning","lesson":"Schema-free entity accumulation degrades; a schema + semantic-alignment/canonicalization step at accumulation time is what keeps the knowledge structure coherent across iterations","maps_to":["runtime/dedup-novelty","runtime/continuity-threading","deep-research"],"confidence":"high"},
    {"name":"OpenSPG/openspg","url":"https://github.com/OpenSPG/openspg","stars":"~2.2k","what":"Ant Group KG engine; explicit 'continuous iterative evolution of incomplete data states', entity-linking/normalization operators, KGDSL logical reasoning","lesson":"Model the loop as iterative evolution over an incomplete-but-typed state: typed schema + normalization operators beat schema-free OpenIE for long-running accumulation","maps_to":["runtime/continuity-threading","runtime/dedup-novelty"],"confidence":"med"},
    {"name":"OSU-NLP-Group/HippoRAG","url":"https://github.com/OSU-NLP-Group/HippoRAG","stars":"~3.9k","what":"NeurIPS'24 + ICML'25 'From RAG to Memory'; personalized PageRank + continual knowledge integration across documents","lesson":"Frame cross-iteration accumulation as memory consolidation (continuous integration), and that cheaper indexing can beat heavier GraphRAG on continual-learning — budget and quality are not opposed when the consolidation mechanism is right","maps_to":["runtime/continuity-threading","runtime/budget-cost","deep-research"],"confidence":"high"}
  ],
  "insights": [
    {"insight":"Accumulate per-iteration findings by local-build-then-set-merge into a persistent graph, never re-derive the whole structure per iteration — that's both the continuity mechanism AND the budget control","evidence":"HKUDS/LightRAG incremental set-merge; contrasted with nano-graphrag's global re-clustering cost","maps_to":["runtime/continuity-threading","runtime/budget-cost"],"confidence":"high"},
    {"insight":"A 'rich-enough' saturation signal (stop enriching a node once its description is saturated) is a natural, content-driven accumulation/budget stop that replaces arbitrary caps","evidence":"LightRAG SOURCE_IDS_LIMIT_METHOD + MAX_SOURCE_IDS env knobs","maps_to":["runtime/budget-cost","runtime/dedup-novelty"],"confidence":"high"},
    {"insight":"Hash/similarity dedup is insufficient for accumulation: without an explicit entity-resolution/canonicalization step the graph fragments and novelty scoring silently breaks — typed schema + semantic alignment is the fix","evidence":"OpenSPG/KAG 'knowledge alignment using conceptual semantic reasoning to alleviate OpenIE noise'; openspg normalization operators","maps_to":["runtime/dedup-novelty","runtime/continuity-threading"],"confidence":"high"},
    {"insight":"The next-iteration broadening seed should be a graph-walk (personalized PageRank over accumulated findings) seeded by the current query, not a flat re-rank of the delta pile — graph topology drives coverage","evidence":"HippoRAG + circlemind-ai/fast-graphrag personalized PageRank retrieval","maps_to":["deep-research","runtime/fan-out-fan-in"],"confidence":"med"},
    {"insight":"Because accumulation is destructive (merges mutate shared state), every merge must be checkpoint-wrapped for rollback — a bad entity-extraction pass otherwise permanently corrupts the accumulated memory","evidence":"circlemind-ai/fast-graphrag checkpointing.ipynb 'to avoid irreversible data corruption'","maps_to":["runtime/state-jsonl-checkpointing","runtime/locks-recovery"],"confidence":"high"}
  ],
  "contradictions": [
    {"claim":"'Incremental insert avoids duplicate computation' (nano-graphrag marketing)","counter":"nano-graphrag's own README caveat: 'each insert re-computes ALL communities and re-generates ALL community reports' — the cost-saving is contradicted by the actual re-clustering cost","evidence":"gusye1234/nano-graphrag readme incremental-insert section + Issues note"},
    {"claim":"Schema-free GraphRAG accumulation improves answer quality over iterations (LightRAG positioning)","counter":"Schema-free OpenIE noise degrades quality unless fixed by schema-constrained + semantic-alignment construction","evidence":"OpenSPG/KAG paper arXiv:2409.13731 'alleviate the noise problem caused by OpenIE' vs HKUDS/LightRAG set-merge gains"},
    {"claim":"More/heavier offline indexing yields better accumulated memory","counter":"HippoRAG 2 uses 'significantly fewer offline indexing resources than GraphRAG/RAPTOR/LightRAG' yet wins continual-learning benchmarks","evidence":"OSU-NLP-Group/HippoRAG readme + ICML'25 paper arXiv:2502.14802"}
  ],
  "next_angles": [
    "Entity resolution / record-linkage libraries (splink, zingg, dedupe) as a canonicalization engine for accumulation dedup — current loop dedup is hash/similarity, not probabilistic entity resolution, which is exactly the fragmentation root cause KAG identified",
    "CRDTs / set-reconciliation for graphs: concurrent accumulation from parallel fan-out subagents needs merge that is associative+commutative (no last-writer-wins corruption) — formalizes fan-in correctness for the accumulated knowledge structure",
    "Bi-temporal / time-versioned knowledge-graph edges: facts found in iteration N may be superseded by iteration N+5; accumulation needs valid-time intervals, mirroring the asOf bitemporal reads already in code-graph",
    "Memory consolidation & decay (synaptic homeostasis) over the accumulated graph: which nodes to prune to keep the graph queryable and budget-bounded across very long research loops — the forgetting complement to accumulation"
  ],
  "notes": "The GraphRAG successor/acumulation ecosystem (LightRAG, nano-graphrag, fast-graphrag, HippoRAG, KAG, openspg) was entirely absent despite microsoft/graphrag being catalogued — this whole accumulation-loops family was the core of the angle. Could NOT verify: HKUDS/AutoKG (404), quqxui/GraphRAG-ToolKit (404), Hugobyt/iText2KG (404) — all marked low-confidence/unverified and excluded. RAG-Anything/VideoRAG (HKUDS) appeared as LightRAG sub-projects but are multimodal extensions, not accumulation-loop mechanisms, so omitted."
}
```


----- stderr -----
[0m
> build · glm-5.2
[0m
[0m✗ [0mWebFetch https://github.com/HKUDS/AutoKG failed
[91m[1mError: [0mStatusCode: non 2xx status code (404 GET https://github.com/HKUDS/AutoKG)
[0m% [0mWebFetch https://github.com/gusye1234/nano-graphrag
[0m% [0mWebFetch https://github.com/HKUDS/LightRAG
[0m✗ [0mWebFetch https://github.com/quqxui/GraphRAG-ToolKit failed
[91m[1mError: [0mStatusCode: non 2xx status code (404 GET https://github.com/quqxui/GraphRAG-ToolKit)
[0m% [0mWebFetch https://github.com/OpenSPG/openspg
[0m% [0mWebFetch https://github.com/circlemind-ai/fast-graphrag
[0m✗ [0mWebFetch https://github.com/Hugobyt/iText2KG failed
[91m[1mError: [0mStatusCode: non 2xx status code (404 GET https://github.com/Hugobyt/iText2KG)
[0m% [0mWebFetch https://github.com/OpenSPG/KAG
[0m% [0mWebFetch https://github.com/OSU-NLP-Group/HippoRAG
