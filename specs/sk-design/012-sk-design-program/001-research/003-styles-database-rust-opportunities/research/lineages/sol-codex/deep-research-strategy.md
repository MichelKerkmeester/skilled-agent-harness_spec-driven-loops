# Deep Research Strategy — Rust Opportunities for the Styles Database

## 1. OVERVIEW

Ten forced-depth iterations assess net-new capability, not a rewrite. Every candidate is judged on value, Rust necessity, effort, risk, present-day versus growth-gated materiality, and fit with the repository's pure-core/thin-adapter/TypeScript-shell standard.

## 2. TOPIC

Identify features, optimizations, automations, and integrations that Rust could unlock or materially improve for the styles database without porting SQLite/FTS5 or the current small cosine/RRF/tokenizer kernels as-is.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] What is the exact current residency and scale baseline, and which claimed bottlenecks are false?
- [x] At what corpus/query regimes would ANN become materially useful, and does Rust own a defensible implementation boundary?
- [x] Would an SQLite vector extension improve architecture, and must that extension be Rust?
- [x] Can local embedding inference remove an external service dependency, and is a Rust runtime necessary?
- [x] Which indexing, hashing, scheduling, and file-watch automations are genuinely improved by Rust?
- [x] Which screenshot-derived style features create new retrieval value, and what implementation options compete with Rust?
- [x] Is a reusable cross-system Rust search core coherent across sk-design, code graph, and spec memory?
- [x] Which cache, ranking, and determinism ideas add value versus merely porting mature TypeScript behavior?
- [x] What adapter/package/fallback/parity architecture satisfies the repository Rust standard?
- [x] What ranked recommendation and phased adoption path survives cost, risk, and gate pressure-testing?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Porting native SQLite or FTS5 work into Rust.
- Porting the current regex tokenizer, brute-force cosine loop, or weighted RRF as-is.
- Treating synthetic language shootouts as evidence of value.
- Replacing TypeScript ownership of transport, adapter selection, feature flags, or JavaScript fallback.

## 5. STOP CONDITIONS

- Run all 10 iterations regardless of early convergence telemetry.
- Stop only at the hard iteration cap, unrecoverable packet corruption, or three consecutive execution failures.
- Synthesis must contain the requested ranked matrix, recommendation, and phased adoption path.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- Current residency and scale baseline: native SQLite/FTS5, JavaScript exact-vector parse/cosine/sort, bounded tokenizer/RRF, 1,290 bundles.
- ANN: algorithmically valuable under measured growth or multi-vector expansion, but not justified today and not inherently Rust-owned.
- SQLite vector extension: strong in-database integration candidate, but existing native extensions make Rust authorship unnecessary.
- Local inference: clears present-day value/materiality gates; Rust is optional for MVP and strongest when reused for multimodal/cross-system inference.
- Automation: TypeScript watcher plus reconciliation is sufficient; batch inference scheduling is material, and Rust fits only when co-located with a justified native inference core.
- Visual analysis: Sharp is sufficient for palette/pHash/geometry; multimodal embeddings add new value, with Rust optional until a shared local-inference core is justified.
- Shared core: reuse only profile/inference/vector/cache primitives after a second consumer commits; domain ranking, schemas, and transport remain separate.
- Caches/determinism: existing hashing and ranking stay TypeScript; binary vectors and artifact caches are conditional improvements that do not require Rust.
- Architecture: one pure core plus thin napi-rs adapter; TypeScript owns transport, modes, flags, persistence, fallbacks, and the pinned byte oracle.
- Final ranking: build the Node local-inference/visual/automation oracle first; extract Rust inference conditionally; vector extension and ANN follow measured growth gates.

<!-- /ANCHOR:answered-questions -->

<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

Grounding supplied by the operator plus direct source inspection established the initial scope.
- Exact filesystem counts plus line-anchored source decomposition prevented false performance claims.
- Cross-checking ANN paper/library/service sources separated algorithmic value from language choice.
- Runtime constructor inspection exposed the explicit extension-loading and security seam.
- Starting from the existing embedder callback produced a low-churn adoption path.
- Decomposing I/O, native hashing, inference, and publication isolated the actual scheduler opportunity.
- Separating deterministic image descriptors from learned embeddings prevented a blanket Rust recommendation.
- Comparing real contracts exposed a narrow reusable primitive layer and a two-consumer extraction gate.

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Code graph is empty; exact source reads and repository search are the local fallback.
- Memory trigger lookup was cancelled; this lineage uses the supplied grounding and checked-in sources.

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

- Like-for-like rewrite of SQLite/FTS5, tokenizer, cosine, or weighted RRF — BLOCKED by the research charter.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Porting SQLite/FTS5, the bounded tokenizer, or weighted RRF alone does not clear the Rust gates.
- Immediate custom Rust HNSW is premature; filter-blind ANN and unqualified vendor speed claims are rejected.
- A custom Rust SQLite vector extension adds no unique capability over existing native extensions.
- Rust wrapping ONNX Runtime only for speed, GPU-first scope, and profile IDs that ignore runtime identity are rejected.
- Porting existing hash policy, worker threads for I/O, a standalone Rust watcher today, and watcher-only correctness are rejected.
- A Rust-first screenshot pipeline, canonical-metadata replacement, and premature learned layout segmentation are rejected.
- A cross-system ranking/schema core, one-consumer generic crate, and unmeasured shared sidecar are rejected.
- Hash/RRF/cosine ports, current-scale quantization, arbitrary ANN byte-parity claims, and a premature cache service are rejected.
- Rust behavior authority, speculative multi-adapter packaging, nonfunctional fallback, semantic-only parity, and core-owned downloads are rejected.

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

Initial frontier: ANN, SQLite extensions, local embeddings, indexing automation, visual analysis, shared search core, caches/determinism, and boundary architecture.

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

No research questions remain open; synthesis must preserve the explicit conditional “no Rust” outcome.

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Complete — synthesis and resource map emitted at the bound lineage root.

<!-- /ANCHOR:next-focus -->

## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Persistent retrieval is implemented in `.opencode/skills/sk-design/styles/_db/retrieval.mjs`; SQLite and FTS5 are already native through `node:sqlite`.
- Vector data is JSON in SQLite and parsed into JavaScript for exact cosine ranking.
- Vector job/cache machinery already exists in `.opencode/skills/sk-design/styles/_db/vectors.mjs`.
- Normal persistent reads do not walk the source corpus; `legacy|shadow|persistent` remains a TypeScript-owned adapter choice.
- The checked-in Rust standard requires a pure core, a thin napi-rs/WASM/sidecar adapter, TypeScript contract ownership, JavaScript fallback, and byte-for-byte oracle parity.
- Code graph state is absent/empty; source-pointer evidence is authoritative for this run.

## 13. RESEARCH BOUNDARIES

- Read access is repository-wide; writes are restricted to this lineage directory.
- Current library/tool claims require primary upstream sources.
- Performance statements must identify the resident work and scale regime; no generic “Rust is faster” claims.
