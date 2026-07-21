# Rust Opportunity Assessment for the sk-design Styles Database

> Detached deep-research lineage `sol-codex`; session `fanout-sol-codex-1784520993412-ps7omk`; executor `cli-codex` / `gpt-5.6-sol`; 10/10 iterations; stop reason `max-iterations`. Convergence was telemetry only until the forced cap.

## 1. Executive Summary

The strongest opportunities are real, but the first implementation should not be Rust. The current styles database already executes SQLite and FTS5 natively. At approximately 1,290 bundles, the only query-time corpus-scaled JavaScript work is vector JSON decode, exact cosine, and sorting; the tokenizer and weighted RRF are bounded. Porting those kernels would fail the repository's residency, materiality, and scale gates.

The best net-new capability is local multimodal inference: offline/private/reproducible text embeddings plus screenshot embeddings for text-to-render and image-to-image style search. This introduces genuinely material model compute rather than moving existing arithmetic. Rust is still not required for the MVP because `onnxruntime-node`, Transformers.js, and Sharp/libvips expose native compute behind a TypeScript shell. The recommended sequence is to ship that JavaScript-facing baseline first, make it the pinned behavior oracle, measure its value and operational cost, then extract one pure Rust inference/vector core behind a thin napi-rs adapter only if package/runtime measurements or a second consumer justify it.

ANN, SQLite vector extensions, binary vectors, artifact caches, batch indexing, and file watching remain useful directions, but most do not require Rust. ANN is growth-gated and has a direct tension with byte-for-byte parity. A custom Rust HNSW or SQLite extension is not recommended when mature native engines already expose JavaScript, WASM, SQLite, or service surfaces.

## 2. Question and Decision Frame

The research asks what Rust could **add or materially improve**, not whether existing code can be rewritten in Rust. Every candidate was assessed against five questions:

1. What concrete product or operational capability appears?
2. Is Rust necessary, or can a JavaScript/WASM/native-addon/library path provide it?
3. What are the implementation effort and correctness/operational risks?
4. Does it clear the JS-residency, materiality, and scale gates at 1,290 bundles or only under growth?
5. Can it fit one pure core plus one thin adapter while TypeScript retains transport, modes, flags, persistence, fallback, and a pinned byte oracle?

## 3. Methodology

Ten forced-depth iterations covered residency/scale, ANN, SQLite extensions, local inference, indexing automation, screenshot analysis, cross-system reuse, caches/determinism, boundary architecture, and final ranking. Evidence came from direct repository reads, bounded filesystem counts, repository Rust standards, primary algorithm papers, and upstream project/runtime documentation. No synthetic language benchmark was treated as evidence. No Rust code or production benchmark was created.

The local code graph was empty, so exact source reads and `rg` were used. A published styles SQLite generation and production query trace were unavailable; therefore latency crossover numbers remain explicit benchmark gates, not claims.

## 4. Confirmed Residency and Scale Baseline

- The source corpus contains exactly 1,290 non-internal style directories and 1,290 canonical JSON files, about 135 MiB in total. This affects offline indexing, not normal persistent read traversal. [SOURCE: iterations/iteration-001.md]
- FTS5 creation, `MATCH`, and `bm25()` execute inside SQLite through `node:sqlite`. Rust has no claim on that already-native work. [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:147-186] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:200-215]
- The vector lane selects vector JSON from SQLite, parses it in JavaScript, computes exact cosine for every eligible vector, sorts by score then ID, and slices to `candidateK <= 200`: approximately `O(E×D + E log E)` for eligible count `E` and dimension `D`. [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:218-249]
- Query tokenization caps unique terms at 12. Weighted RRF touches bounded lane results—at current caps, roughly no more than 600 entries—and ends on a deterministic ID tie-break. [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:19-24,48-55,259-283]
- Incremental metadata hints, content hashes, semantic retrieval hashes, vector-job supersession, embedding cache identity, and immutable generation publication already exist. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:181-221,622-740] [SOURCE: .opencode/skills/sk-design/styles/_db/vectors.mjs:31-119,206-295]
- Normal mode selection remains `legacy|shadow|persistent`, defaulting to legacy; shadow returns legacy behavior plus comparison evidence. [SOURCE: .opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:16-18,97-166]

Performance implication: Rust must not be credited for FTS5/SQLite, source-tree scanning on normal reads, native hashing primitives, or the existence of incremental caching. The only current query-scaled V8 work is vector representation/parsing plus exact scoring/sort, and its present set is small.

## 5. Ranked Opportunity Matrix

| opportunity | class: feature/optimization/automation/integration | capability unlocked | Rust necessary? | effort | risk | gate verdict |
|---|---|---|---|---|---|---|
| **1. Local text + image embedding runtime** | feature / integration | Offline, private, reproducible semantic and visual retrieval without an external embedding API | **No for MVP.** Rust becomes strategically useful for one audited multimodal runtime | Medium–high | Medium–high: model package, license, tokenizer/pooling, cold start, numerical parity | Capability clears today because inference is new material compute; Rust clears only after Node baseline shows material cost or reuse |
| **2. Multimodal screenshot retrieval** | feature | Text-to-render and image-to-image discovery beyond canonical text metadata | **No.** CLIP-class models can run through Node native runtimes | High | High: screenshot availability/provenance, model relevance, evaluation | Feature clears today if screenshot coverage and judged queries exist; Rust follows opportunity 1 conditionally |
| **3. Continuous dirty-set indexing + batch embedding scheduler** | automation | Automatic freshness, event coalescing, batched inference, quiet-window immutable publication | **No.** Chokidar and bounded TypeScript scheduling are sufficient | Medium | Medium: lost events, races, memory/concurrency, recovery | Automation clears today; standalone Rust watcher fails present residency/materiality gate |
| **4. Palette, pHash, contrast, simple layout descriptors** | feature / automation | Duplicate clustering, screenshot change detection, rendered-versus-declared validation | **No.** Sharp/libvips already performs pixel work natively | Medium | Low–medium: false matches and missing/mutable screenshots | Feature clears today; Rust fails necessity unless co-located with a justified inference core |
| **5. Existing SQLite vector extension + binary/in-DB vectors** | integration / optimization | Eliminate JSON vector transfer/parsing and compose vector candidates with SQLite data | **No.** Prefer a pinned existing extension | Medium | High: trusted extension loading, artifacts, maturity, constraint/filter pushdown | Spike is reasonable; performance adoption is profiler/growth-gated, not justified by 1,290 rows alone |
| **6. Content-addressed model/vector/index cache** | automation / optimization | Reuse immutable model, preprocessing, embedding, and index artifacts across builds/systems | **No** | Medium | Low–medium: complete identity and eviction/lifecycle | Clears after local models or a second consumer create large reusable artifacts |
| **7. ANN HNSW/IVF candidate index** | feature / optimization | Scalable semantic retrieval for 10×–100× corpus or many image-region vectors | **No.** Mature native addons/extensions/services exist | High | High: recall, filtering, determinism, rebuilds, parity | Growth-gated; benchmark 1.3k/10k/50k/100k/1M with actual dimensions/selectivity |
| **8. Shared Rust inference/vector primitive crate** | integration | One audited model/vector/cache implementation across styles, spec memory, and code graph | Rust is necessary only if this implementation is chosen; reuse itself is language-neutral | High | High: common-denominator API, release/version coupling, platform packaging | Two-consumer gate with identical pinned workload/profile; not justified for styles alone |
| **9. Learned region/layout fingerprinting** | feature | Composition/component-region retrieval beyond global screenshot similarity | **No** | High | High: labelled data, segmentation quality, inference cost | Relevance-gated after global CLIP plus simple geometry demonstrates a concrete miss |
| **10. Vector quantization or memory-mapped snapshots** | optimization | Reduce large-index memory/storage and improve cache locality | **No** | High | High: recall/accuracy, migration, target variation | Growth-only; fails today's scale gate |
| **11. Rust file watcher** | automation | Native change notification | **No** | Medium | Medium: platform semantics and daemon recovery | Not worth Rust; TypeScript watcher plus periodic reconciliation is sufficient |
| **12. Rust cosine/RRF/tokenizer/hash port** | optimization | No new capability; replaces bounded existing behavior | **No** | Low coding cost, high verification drag | Medium: numeric/byte parity and ABI surface | **Reject.** Fails present materiality and scale gates |
| **13. Custom Rust SQLite vector extension** | integration / optimization | Duplicates vector-in-SQL capability already available from native extensions | No unique need | Very high | Very high: C ABI/unsafe review, security, packaging | **Reject** unless all existing extensions fail a documented must-have requirement |

## 6. First Plausible Rust Opportunity: Local Multimodal Inference

Local inference adds privacy, offline use, reproducible profiles, no per-call API charge, and an always-available semantic lane. Initial and rebuild embedding is real model execution; unlike the current cosine loop, it is material native compute even with 1,290 documents. The existing `embedder` callback, vector job queue, cache, current-identity recheck, and profile table provide a low-churn integration seam. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:622-655,872-900] [SOURCE: .opencode/skills/sk-design/styles/_db/vectors.mjs:206-295]

Rust is not required. `onnxruntime-node` already invokes native ONNX Runtime kernels, and Transformers.js offers another JavaScript-facing path. A Rust `ort` wrapper would reach the same engine while adding a custom boundary. Candle is more strategically distinct because it can host text and vision families in a Rust-native model stack, but that advantage matters only when multimodal breadth, packaging control, or cross-system reuse is required. [SOURCE: https://onnxruntime.ai/docs/get-started/with-javascript/node.html] [SOURCE: https://huggingface.co/docs/transformers.js/en/index] [SOURCE: https://github.com/pykeio/ort] [SOURCE: https://github.com/huggingface/candle]

Model profile identity must include model and tokenizer digests, pooling, normalization, quantization, runtime/version, dimensions, and execution profile. Accelerated and canonical CPU outputs must not share an identity if their bytes can diverge.

## 7. Screenshot-Derived Intelligence

The schema already stores `screenshot_url`, and canonical records already contain color/layout/imagery information. Screenshot analysis should add rendered evidence rather than redundantly reconstruct authored metadata. [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:97-107] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:118-172]

Two lanes have different risk:

- Deterministic descriptors—palette, histogram/contrast, aspect/density, pHash, simple geometry—support duplicate detection, change detection, and metadata discrepancy checks. Sharp/libvips makes Rust unnecessary. [SOURCE: https://github.com/lovell/sharp] [SOURCE: https://github.com/libvips/libvips]
- CLIP-class embeddings align images with language, enabling descriptive text-to-render and image-to-image retrieval. This is new semantics, not a faster exact cosine loop. It requires a judged relevance set, screenshot content hashing/provenance, and a text-only fallback. [SOURCE: https://arxiv.org/abs/2103.00020]

Learned region segmentation/layout fingerprinting is a later feature. It should enter only when simpler global embeddings plus geometry fail a labelled query class.

## 8. Indexing and Watch Automation

The worthwhile automation is continuous dirty-set indexing: watch supported artifact paths, debounce atomic/chunked writes, map paths to style IDs, coalesce by content hash, enqueue compatible embedding batches, and publish one immutable generation after a quiet window. Periodic hint reconciliation remains the correctness authority because filesystem watchers can lose or coalesce events.

Rust is not required. Chokidar normalizes common cross-platform watcher behavior, bounded Promise pools can parallelize I/O, `node:crypto` already performs SHA-256 natively, and Node worker threads are intended for CPU-heavy JavaScript rather than asynchronous I/O. The material gap is batch-aware inference scheduling: current queue draining awaits one embedder call per job. [SOURCE: https://nodejs.org/api/fs.html#fswatchfilename-options-listener] [SOURCE: https://nodejs.org/api/worker_threads.html] [SOURCE: https://github.com/paulmillr/chokidar] [SOURCE: .opencode/skills/sk-design/styles/_db/vectors.mjs:174-216]

## 9. SQLite Vector Extension and Vector Representation

An existing SQLite extension is a credible spike because it can keep compact vectors in database-native structures, compute distance/ANN in SQLite, join candidates with lifecycle/provenance/facets, and return only top-k rows. This does not replace FTS5.

The current `node:sqlite` connection does not enable extensions. Adoption requires `allowExtension: true` at construction, a fixed trusted binary path, integrity checks, platform artifacts, and fail-closed fallback. Filter pushdown and recall under joins must be proven rather than assumed. `sqlite-vec` ANN modes also carry maturity risk. [SOURCE: https://nodejs.org/api/sqlite.html] [SOURCE: https://www.sqlite.org/loadext.html] [SOURCE: https://github.com/asg017/sqlite-vec] [SOURCE: https://github.com/asg017/sqlite-vec/issues/196] [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:360-391]

Authoring a Rust extension adds no unique feature; SQLite's extension ABI is C, and existing C/C++ engines already expose the needed surface.

## 10. ANN and Growth

HNSW changes the algorithm from exact linear scan to graph search; it is not evidence that Rust itself is faster. Upstream embedded/vector engines retain exact scanning for small collections because ANN traversal has fixed costs. At 1,290 styles, exact search remains the baseline. [SOURCE: https://arxiv.org/abs/1603.09320] [SOURCE: https://github.com/unum-cloud/USearch] [SOURCE: https://qdrant.tech/documentation/manage-data/indexing/]

ANN becomes credible with 10×–100× corpus growth, multiple embeddings per style, screenshot regions, or cross-system aggregation. Benchmarks must cover 1.3k, 10k, 50k, 100k, and 1M vectors with actual dimensions and eligibility selectivity. Required evidence includes recall@k against exact search, filter recall, p50/p95/p99 latency, memory, build/update time, crash recovery, index checksum/version behavior, and exact fallback.

Eligibility is load-bearing: licensing, lifecycle, facets, and axes currently filter before scoring. ANN needs filter-aware search, sub-indexing, or oversample/filter/exact-rescore logic. A graph that returns attractive but ineligible candidates is not a correct replacement.

## 11. Shared Core and Content-Addressed Artifacts

A cross-system core is coherent only for provider/profile identity, deterministic preprocessing, batch local inference, vector validation/encoding, content-addressed model/index artifacts, optional index interfaces, and tie-break helpers. It must not absorb styles facets/cards, memory graph/feedback/MMR/chunk logic, code-graph traversal, SQLite schemas, result DTOs, or transport. [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/README.md] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/pipeline/README.md] [SOURCE: .opencode/specs/system-code-graph/035-rust-backend-rewrite/001-research/spec.md]

The repository already shares TypeScript embedder contracts across systems. Rust extraction is therefore gated on a second committed consumer needing the same material native operation and exact pinned profile. One styles consumer is not evidence for a “search core.”

## 12. Required Rust Architecture

If the conditional Rust gate opens, use:

```text
TypeScript shell
  ├─ transport, screenshot fetch, validation, timeouts
  ├─ legacy | shadow | persistent database mode
  ├─ native feature flag and JS fallback selection
  ├─ batching, DB jobs/writes, generation publication
  ├─ eligibility, FTS5, fusion, cards, pagination
  └─ pinned TypeScript oracle and telemetry
          │ owned DTOs / copied buffers
          ▼
thin napi-rs adapter
  └─ DTO conversion, AsyncTask dispatch, typed error mapping
          ▼
pure Rust core (`#![forbid(unsafe_code)]`)
  └─ deterministic preprocessing, model inference, vector encoding,
     optional visual primitives and later versioned index interface
```

Use one adapter per phase. napi-rs best matches the current Node host and CPU/blocking inference. Baseline WASM does not create parallelism; a sidecar is justified only by measured process isolation, GPU/runtime conflict, or shared-model memory/startup value. Rust must not open the style database, choose flags/modes, fetch models/screenshots, or silently select itself. [SOURCE: .opencode/skills/sk-code/code-opencode/references/rust/quick-reference/overview-and-boundary-template.md] [SOURCE: .opencode/skills/sk-code/code-opencode/references/rust/style-guide/interop-errors-and-parity.md:194-214,273-296]

Rollback is a feature-flag flip to the JS fallback plus optional-package removal. Profile-versioned vectors avoid database rollback.

## 13. Determinism and Parity

Every shipped native behavior must replay bytes produced by a pinned TypeScript oracle. Fixtures cover preprocessing, tokenizer output, profile/cache keys, vector bytes, palette/pHash, DTO field omission/order, errors, Unicode, numeric edge cases, final cards, and native-package load failure. Golden bytes originate from TypeScript, not Rust. [SOURCE: .opencode/skills/sk-code/code-opencode/references/rust/quality-standards/determinism-and-parity.md]

Model numerical drift must be eliminated with a canonical CPU/runtime path or isolated into a distinct versioned profile with an explicit serialization/quantization contract. Semantic similarity is not byte parity.

ANN is structurally difficult: approximate traversal can return different candidates/order than the exact oracle and can vary with request limit. It can ship only under an accepted separately versioned capability contract, a pinned engine/index/search profile, fixed-fixture stability, exact deterministic re-score/tie-break, recall gates, and exact fallback. If repository policy requires arbitrary-query whole-result equality, ANN cannot satisfy it unless native and fallback use the same pinned engine/index.

## 14. Ranked Recommendation

1. **Do not start with Rust.** Instrument stage timings, inventory screenshots, build judged relevance fixtures, and implement local text/image embeddings plus visual descriptors through Node ONNX/Sharp. Add batch queue draining and watcher/reconciliation automation behind flags and shadow telemetry.
2. **Make local multimodal inference the first conditional Rust extraction.** Proceed only when the JS baseline proves product value and either native packaging/runtime data or a second consumer clears the Rust boundary gate.
3. **Evaluate an existing SQLite vector extension independently.** Adopt only if profiler/growth evidence justifies vector representation/search changes; do not author a Rust extension.
4. **Add ANN after measured growth.** Use an existing engine, preserve filters/exact rescore/fallback, and resolve the parity policy first.
5. **Share only after two consumers exist.** Extract primitives, not domain retrieval policy.

## 15. Phased Adoption Path

### Phase 0 — Evidence and contract

- Measure query stages, index stages, queue wait/service time, vector bytes, and memory.
- Inventory screenshot fetchability, byte stability, rights, and failure rate.
- Label text and visual query relevance; benchmark exact search at representative sizes.
- Freeze the profile/preprocessing/serialization/error oracle.
- Exit: baseline, judged queries, and pinned TS bytes exist.

### Phase 1 — TypeScript-shell capability MVP

- Add Node ONNX local text/image profiles, Sharp descriptors, Chokidar plus reconciliation, and compatible-profile batch scheduling.
- Keep storage mode unchanged; use independent default-off flags and shadow evidence.
- Exit: relevance, rebuild latency, memory, package size, cold start, failure/fallback, and determinism targets pass.

### Phase 2 — Conditional Rust inference extraction

- Enter only if inference/preprocessing is materially costly after native Node kernels, packaging/control is unacceptable, or two consumers need the identical workload.
- Build a pure core plus one thin napi-rs adapter; preserve the JS fallback and TypeScript authority.
- Exit: end-to-end measured improvement survives boundary copies/package cost, every supported target passes byte replay, and rollback works.
- Valid outcome: **do not adopt Rust** if the Node baseline meets targets.

### Phase 3 — Conditional vector-store growth

- Spike a checksum-pinned existing SQLite vector extension in exact mode with filter query-plan tests.
- Add ANN only after exact search fails an explicit representative SLO.
- Exit: recall/filter recall, latency distribution, memory, index build/update, recovery, integrity, and parity-policy gates pass.

### Phase 4 — Cross-system extraction

- Enter with a second committed consumer and identical model/profile/cache/index primitive.
- Share only domain-neutral artifacts and computation.
- Adopt a sidecar only if measured shared-model memory/startup savings justify coupled operations.

## 16. Not Worth Rust

- SQLite/FTS5: already native.
- Exact cosine/RRF/tokenizer/hashes at current scale: bounded or small and parity-sensitive.
- File watcher: Node/Chokidar solves the platform problem; reconciliation, not language, ensures correctness.
- Palette/pHash alone: Sharp/libvips already keeps pixels outside JavaScript.
- Custom SQLite vector extension: duplicates existing native work and adds FFI/security/package risk.
- Custom HNSW today: scale and measurements do not justify ownership.
- A generic cross-system crate with one consumer: abstraction without reuse evidence.

## 17. Risks, Unknowns, and Decisions Required

- No published database/query trace establishes current exact-search latency or ANN crossover.
- Screenshot coverage, mutability, rights, dimensions, and fetch policy are unmeasured.
- No embedding model, license, output dimension, package-size target, or hardware matrix is selected.
- A judged style-query set and acceptance metrics do not yet exist.
- sqlite-vec/alternative extension version, platform support, filter pushdown, and production maturity require a spike.
- The repository needs an explicit interpretation of byte parity for approximate retrieval before ANN can graduate.
- Supported native binary targets and supply-chain signing/checksum policy remain to be specified.

## 18. Final Verdict

Rust can unlock a defensible **local multimodal inference core** and later support a large-scale embedded vector index, but it does not currently unlock enough value to justify immediate implementation. The correct near-term move is to add and measure the features through native Node dependencies inside the existing TypeScript shell. If that path meets the targets, “no Rust” is the correct result. If it exposes a material model-runtime, packaging, or multi-consumer need, extract one pure Rust core behind one thin napi-rs adapter and preserve the JS fallback and byte oracle.

The other candidates are either TypeScript/native-library features, growth-gated optimizations, or explicit non-opportunities. No performance conclusion in this report depends on the hand-wave that “Rust is faster”; every recommendation follows the actual `retrieval.mjs` and `vectors.mjs` residency boundary.
