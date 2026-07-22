# Deep Research Strategy: Rust Opportunities for the Styles Database

## 2. TOPIC
Identify which new features, optimizations, automations, and integrations a Rust component could add or improve for the sk-design styles database, explicitly not a like-for-like rewrite.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Which vector-search architecture, if any, unlocks meaningful capability at 1,290, 10x, and 100x bundles: in-process HNSW/IVF, a SQLite loadable extension, WASM, or an existing native addon?
- [ ] Which indexing and embedding automations become materially better with Rust: parallel streaming ingestion, incremental content hashing, local model inference, file watching, and content-addressed caches?
- [ ] Which new visual/style-analysis features are practical: screenshot palette and spacing extraction, perceptual hashing, layout fingerprints, and multimodal embeddings?
- [ ] Is a shared Rust search core across sk-design, system-code-graph, and Spec Kit Memory valuable enough to justify contract, release, and ownership coordination?
- [ ] Which opportunities clear the repository's residency, materiality, and scale gates today versus only under measured growth, and what phased adoption preserves TS ownership and exact oracle parity?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS
- Do not propose porting FTS5 or SQLite storage already executed natively by `node:sqlite`.
- Do not propose a like-for-like port of the current cosine loop, weighted RRF, or regex tokenizer.
- Do not implement Rust or alter production styles-database code.
- Do not claim speedups from language choice without locating the compute residency and scale threshold.

## 5. STOP CONDITIONS
- Complete exactly 10 evidence iterations; convergence before iteration 10 is telemetry only.
- Synthesize a ranked opportunity matrix and phased adoption path after iteration 10.
- Stop early only for unrecoverable state corruption or a write-boundary violation.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Is a shared Rust search core worth cross-system coordination? (iteration 1)
- Which visual and multimodal analysis features are practical? (iteration 1)
- Which complete opportunity set clears residency, materiality, and scale gates? (iteration 1)
- Can the existing generation publication model atomically publish an external HNSW index with the SQLite database, or does it require a new manifest contract? (iteration 1)
- Which indexing and embedding automations materially improve with Rust? (iteration 1)
- What measured p50/p95 query latency, vector dimension, eligible-row distribution, and query rate trigger the 10x or 100x migration gate? (iteration 1)
- What are the measured production or replayed eligibility percentiles, active embedding dimensions, stage p50/p95 values, and query-rate distribution on the declared reference host? (iteration 2)
- What are production arrival-rate percentiles and representative facet-selectivity percentiles after persistent opt-in? (iteration 3)
- Which vector-search architecture, if any, unlocks meaningful capability once a published vector projection and representative trace exist? (iteration 3)
- Which indexing and embedding automations become materially better with Rust? (iteration 3)
- Can an external vector index or shared cache be atomically bound to the current generation pointer without a new manifest contract? (iteration 4)
- What production arrival, facet-selectivity, cold-build stage, and embedding-drain measurements clear the staged gates? (iteration 4)
- Which visual and multimodal analysis features are practical, and which can share the same resident local-model worker? (iteration 4)
- Which complete opportunity set clears residency, materiality, and scale gates at current, 10x, and 100x scale? (iteration 4)
- Is a shared Rust inference/search core worth cross-system contract and release coordination? (iteration 4)
- Which screenshot palette, spacing, perceptual-hash, layout-fingerprint, and multimodal-embedding features are practical, and which can reuse the existing resident model-service shape? (iteration 5)
- Which complete opportunity set clears residency, materiality, and scale gates today versus conditionally? (iteration 5)
- Can an external ANN index be atomically bound to the styles generation pointer without a new manifest contract? (iteration 5)
- What measured arrival, selectivity, cold-build, embedding-drain, and end-to-end query values clear phased adoption at current, 10x, and 100x scale? (iteration 5)
- What screenshot artifact and derived-feature schema binds viewport, capture provenance, algorithm/model profile, and generation publication atomically? (iteration 6)
- What measured arrival, selectivity, cold-build, image-processing, embedding-drain, and end-to-end query values clear phased adoption at current, 10x, and 100x scale? (iteration 6)
- Which labeled visual-search tasks and relevance judgments demonstrate that multimodal retrieval adds value beyond existing tokens, prose, and text embeddings? (iteration 6)
- Which labeled text-to-visual and image-to-style tasks prove a joint embedding profile adds retrieval value over structured tokens, prose, and text embeddings? (iteration 7)
- What measured cold-load, warm-batch, RSS, package-size, preprocessing, drain, and end-to-end thresholds define “material” on the reference host? (iteration 7)
- What exact model/profile manifest and screenshot-derived-feature schema joins local artifacts to an immutable styles generation? (iteration 7)
- Which complete opportunity set clears residency, materiality, and scale gates after the remaining evidence iterations? (iteration 7)
- Can the existing generation pointer atomically publish screenshot features and an external vector index without a new manifest contract? (iteration 7)
- Which complete opportunity set clears residency, materiality, and scale gates after the final evidence iterations? (iteration 8)
- What are measured DISCOVER, VERIFY, PARSE_VALIDATE, COMMIT, VECTOR_DRAIN, and PUBLISH p50/p95 times for no-op, one-bundle, and cold full builds? (iteration 8)
- What build-latency SLO and minimum end-to-end improvement define materiality on the reference host? (iteration 8)
- What exact versioned generation-manifest schema atomically binds SQLite, screenshot features, and an external ANN projection? (iteration 8)
- What exact versioned generation-manifest schema atomically binds SQLite, screenshot-derived features, model/profile identity, and a conditional external ANN projection? (iteration 9)
- What measured DISCOVER, VERIFY, PARSE_VALIDATE, COMMIT, VECTOR_DRAIN, PUBLISH, query-stage, model-load, and image-processing values clear each current, 10x, and 100x adoption gate? (iteration 9)
- Which final ranked opportunity set is unconditional, benchmark-gated, growth-gated, or ruled out? (iteration 9)
- Do labeled text-to-visual and image-to-style judgments show material relevance gain over structured, lexical, and text-vector retrieval? (iteration 10)
- Which declared product SLO and minimum end-to-end improvement threshold should govern promotion from shadow to persistent mode? (iteration 10)
- What are the measured stage p50/p95, eligibility/selectivity, QPS, model load/RSS, image preprocessing, and embedding-drain distributions on the declared reference host? (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
What are the measured stage p50/p95, eligibility/selectivity, QPS, model load/RSS, image preprocessing, and embedding-drain distributions on the declared reference host?

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT
- The current lexical lane runs as FTS5 SQL through `node:sqlite`; vector rows are loaded from SQLite and only cosine scoring/sorting occurs in JS. [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:200-249]
- Weighted RRF is a deterministic map-and-sort over already-ranked candidate lists. [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:252-283]
- Vector embedding work already has an incremental queue, retrieval-hash cache, bounded retries, and lexical fallback semantics. [SOURCE: .opencode/skills/sk-design/styles/_db/vectors.mjs:78-313]
- Rust must remain a pure core behind thin adapters; TypeScript owns transport, feature flags, fallback selection, and public routing. [SOURCE: .opencode/skills/sk-code/code-opencode/references/rust/style-guide/interop-model.md:33-52]
- The active charter fixes the current corpus at about 1,290 bundles and forbids a straight rewrite. [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/spec.md:48-76]
- `resource-map.md` was not present at init; skipping the coverage-map preload.

### Bounded Context Snapshot
- Source pointers: `styles/_db/retrieval.mjs`, `styles/_db/vectors.mjs`, the styles schema/build adapters, and the Rust interop/parity standards.
- Reuse candidates: retrieval hashes, embedding profiles, queue retry semantics, generation publication, weighted-RRF oracle, and legacy/shadow/persistent adapter selection.
- Integration points: query vector lane, vector projection build, style corpus ingestion, screenshot/provenance records, code graph, and memory retrieval systems.
- Constraints: packet-local writes only; no production edits; no speed claim without residency and scale evidence.

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05, telemetry only before the hard cap
- Stop policy: max-iterations
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Current generation: 1
- Started: 2026-07-20T04:20:12Z
