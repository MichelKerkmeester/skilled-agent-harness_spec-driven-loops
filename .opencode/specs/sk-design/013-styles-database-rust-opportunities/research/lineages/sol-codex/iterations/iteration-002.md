# Iteration 2: Approximate Nearest-Neighbor Search

## Focus

Test whether HNSW/ANN is a genuine new capability, when it becomes material, what filtered eligibility does to the design, and whether a Rust-owned implementation is justified.

## Findings

1. HNSW is an algorithmic change, not a language-speed claim: it builds hierarchical proximity graphs and searches from sparse upper layers toward dense lower layers. The original paper describes logarithmic scaling behavior, while exact vector ranking remains linear in eligible vectors. [SOURCE: https://arxiv.org/abs/1603.09320] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:232-249]
2. ANN does not clear the present-day materiality gate. USearch's own guidance says ANN is predominantly useful when exact search becomes too expensive, typically around millions of entries, and offers exact SIMD search for smaller collections. Qdrant similarly defaults to full scan below a vector-volume threshold because graph traversal is not always cheaper. At 1,290 styles, exact search is the proper baseline until measured otherwise. [SOURCE: https://github.com/unum-cloud/USearch/blob/main/README.md#exact-vs-approximate-search] [SOURCE: https://qdrant.tech/documentation/manage-data/indexing/#vector-index]
3. The opportunity becomes credible under 10×–100× growth, multiple embeddings per style, image-region embeddings, or cross-system aggregation. The crossover must be measured at 1.3k, 10k, 50k, 100k, and 1M points across actual dimensions and facet selectivity; “sub-millisecond” is a benchmark target, not a supported claim from today's repository. [INFERENCE: current 1,290 count plus exact `O(E×D)` lane and upstream full-scan guidance]
4. Eligibility complicates ANN. Today provenance, licensing, facets, axes, and lifecycle filter the corpus before vector scoring. A standalone HNSW index either needs filter-aware graph traversal, separate sub-indexes, or a candidate-then-filter loop; strict filters can disconnect ordinary HNSW graphs. Qdrant's filterable HNSW adds payload-aware edges and its planner may choose exact rescoring for strict filters. [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:121-169] [SOURCE: https://qdrant.tech/documentation/manage-data/indexing/#filterable-hnsw-index]
5. Rust is not necessary for ANN. USearch is a C++ engine with JavaScript, Rust, WebAssembly, and SQLite surfaces; hnswlib is C++ with incremental updates and marked deletions; Qdrant is a Rust sidecar/service. A custom Rust core is justified only if ownership, cross-system reuse, embedded operation, and native/WASM parity outweigh adopting one of those mature native engines. [SOURCE: https://github.com/unum-cloud/USearch] [SOURCE: https://github.com/nmslib/hnswlib] [SOURCE: https://qdrant.tech/documentation/overview/]
6. Approximation creates a parity risk. Current pagination binds exact fused score and ID; upstream Qdrant explicitly notes HNSW results can change with requested limit. Any adopted ANN lane needs a pinned serialized index/profile, deterministic tie-breaks, exact rescoring of retrieved candidates, recall@k gates against the TypeScript exact oracle, and a feature-flagged exact fallback. Byte-for-byte parity can cover the shell, serialization, exact rescoring, and frozen-fixture outputs; it cannot be casually assumed for arbitrary approximate traversal. [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:281-283,430-446] [SOURCE: https://qdrant.tech/documentation/faq/qdrant-fundamentals/#if-i-run-the-same-query-with-limit20-and-limit100-are-the-first-20-results-guaranteed-to-match]

## Ruled Out

- Build a custom Rust HNSW immediately: present corpus and missing benchmarks do not justify maintenance risk.
- Treat “10× faster implementation” vendor claims as repository evidence: hardware, recall, dimensions, and workload are not controlled.
- ANN after filtering without a filter plan: strict filters can erase the graph's advantage or recall.

## Dead Ends

- A universal fixed corpus threshold is not defensible; vector dimension, selectivity, update rate, recall target, and hardware move the crossover.

## Edge Cases

- Ambiguous input: “10×–100× corpus scale” could mean 12.9k–129k bundles or far more vectors when each screenshot contributes regions; both must be benchmarked.
- Contradictory evidence: USearch suggests ANN typically at millions, while Qdrant exposes a much lower byte-volume planner threshold. This is resolved as workload dependence, not a single threshold.
- Missing dependencies: no production embeddings or query trace exist for recall/latency evaluation.
- Partial success: architecture and gates are clear; exact crossover remains unmeasured.

## Sources Consulted

- https://arxiv.org/abs/1603.09320
- https://github.com/unum-cloud/USearch
- https://github.com/nmslib/hnswlib
- https://qdrant.tech/documentation/manage-data/indexing/
- https://qdrant.tech/documentation/faq/qdrant-fundamentals/

## Assessment

- New information ratio: 0.84
- Questions addressed: ANN materiality and boundary
- Questions answered: ANN materiality and boundary

## Reflection

- What worked and why: comparing an algorithm paper, embedded library, and filtered vector engine exposed both value and operational caveats.
- What did not work and why: vendor benchmark numbers were unsuitable as repository performance evidence.
- What I would do differently: obtain real vector dimensions, query traces, and filter distributions before choosing HNSW parameters.

## Recommended Next Focus

Evaluate an in-database vector extension as an alternative that preserves SQLite transactions, eligibility joins, and the TypeScript shell.
