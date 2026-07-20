# Rust Opportunities for the sk-design Styles Database

## 1. Executive Summary

The research does **not** support a Rust rewrite of the styles database. SQLite storage and FTS5 already execute natively through `node:sqlite`; the remaining JavaScript-resident retrieval work is vector JSON materialization, exact cosine over eligible vectors, sorting, and a candidate-bounded weighted RRF. At approximately 1,290 bundles, none of those kernels independently justifies a Rust boundary. [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:200-283]

The best near-term opportunities are new capabilities and enabling contracts that do not require Rust:

1. A versioned multi-artifact generation manifest.
2. Stage telemetry and a pinned TypeScript differential oracle.
3. DOM-derived responsive layout fingerprints.
4. Screenshot palette/statistics and perceptual dedupe.
5. A shadow multimodal retrieval lane using the existing Transformers.js/ONNX Runtime stack.
6. A cross-generation parsed-projection cache if cold-build telemetry proves reuse valuable.

Rust becomes credible only after one of two conditions is measured:

- A resident local-model worker needs crash/RSS isolation, bounded preprocessing, a specific execution provider, or a materially better deployment profile than the existing native ONNX stack.
- A representative 100x vector workload requires filter-aware ANN, custom multimodal metrics, or lifecycle behavior unavailable from maintained Node-callable engines.

No production Rust component clears residency, materiality, scale, publication, and parity gates today.

## 2. Current Residency Decomposition

| Stage | Actual residency | Scale characteristic | Rust implication |
|---|---|---|---|
| Storage, joins, FTS5/BM25 | SQLite native engine through `node:sqlite` | Database and query dependent | Do not port; already native. |
| Eligibility policy | SQL reads plus JS set/filter orchestration | Active and eligible rows | Policy remains TypeScript-owned. |
| Vector row fetch | SQLite returns `vector_json` for every eligible row | `O(eligible rows)` bytes and parses | First exact-search optimization target, but not automatically a Rust target. |
| Cosine | JS loop over eligible vectors | `O(eligible rows * dimensions)` | Material only after a real vector profile and representative trace exist. |
| Vector sort | JS full sort before truncation | `O(eligible rows log eligible rows)` | Compact exact or ANN architecture may remove it at scale. |
| Weighted RRF | JS map over at most 3 x 200 lane candidates | Candidate-bounded, not corpus-scaled | Not worth a standalone Rust component. |
| Hashing | `node:crypto` native SHA-256 | Current full pass measured at 1.188 s | Keep durable identity; Rust does not create native residency. |
| Embedding inference | No active styles profile; existing repo paths use native model runtimes | Model, batch, and modality dependent | Rust wrapper over ONNX is not an inference-kernel relocation. |

The vector lane loads all eligible vectors from SQLite, parses JSON, computes cosine, sorts, and truncates. [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:232-249] Weighted RRF is capped by `MAX_CANDIDATE_K = 200`, so even three full lanes produce about 600 contributions regardless of corpus growth. [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:19-24] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:259-283]

## 3. Evidence Baseline

- Persistent mode is opt-in and no active published SQLite generation or embedding profile exists in this workspace. The only measured replay exercised the legacy path, so it cannot justify a vector-kernel migration. [SOURCE: iteration-003.md:20-40]
- Repository-derived positive query shapes were generally broad, admitting all 1,290 bundles; this is useful test evidence but not a production selectivity distribution. [SOURCE: iteration-003.md:26-30]
- The current SQL shape creates one host parameter per eligible ID. SQLite's default limit is 32,766 variables, so broad 100x queries can hit a correctness ceiling before ANN performance matters. [SOURCE: iteration-002.md:28-32]
- The styles tree is approximately 135 MiB and 7,776 files. Incremental metadata hints avoid most full hashing on normal unchanged runs; full immutable builds deliberately verify all content. [SOURCE: iteration-004.md:16-20]
- Existing Spec Kit embedding infrastructure already provides resident local batching, health, latency, and queue telemetry. A shared Rust inference plane would duplicate that capability unless it wins a specific measured or model-support gate. [SOURCE: iteration-005.md:22-32]

## 4. Ranked Opportunity Matrix

| opportunity | class: feature/optimization/automation/integration | capability unlocked | Rust necessary? | effort | risk | gate verdict |
|---|---|---|---|---|---|---|
| Versioned multi-artifact generation manifest | integration | Atomically publishes SQLite, screenshot-derived features, model profiles, and optional ANN projections under one generation pointer | No | Medium | Medium | **Adopt now.** Prerequisite for every query-visible external artifact. |
| Stage telemetry and pinned TS differential oracle | automation | Makes residency, materiality, rollback, byte parity, recall, RSS, and package tradeoffs measurable | No | Medium | Low | **Adopt now.** Blocks every Rust experiment until present. |
| DOM-derived responsive layout fingerprints | feature | Adds geometry/topology/spacing similarity and facets across viewports | No | Medium | Low | **Adopt TS baseline now.** Crawler already owns exact rectangles and computed layout. |
| Screenshot palette/statistics | feature | Adds rendered-color facets, contrast/saturation descriptors, and viewport stability | No | Medium | Medium | **Use native-backed JS first.** `sharp`/libvips is the baseline. |
| Perceptual screenshot dedupe and recrawl triage | automation | Avoids duplicate processing and flags material visual changes | No | Low-Medium | Low-Medium | **Use existing native/WASM library first.** Never use as semantic style rank. |
| Joint text/image multimodal retrieval | feature | Adds text-to-visual and image-to-style search fused with existing lanes | No initially | High | High | **Relevance-gated.** Labeled judgments must beat structured, lexical, and text-vector baselines. |
| Cross-generation parsed-projection cache | automation | Reuses verified normalized bundle projections across immutable full builds | No | Medium | Medium | **Benchmark-gated.** Valuable feature is language-neutral; cache remains disposable. |
| Resident Rust `ort` multimodal sidecar | integration | Isolates crashes/RSS, bounds preprocessing, and keeps model sessions resident | Conditional | High | High | **10x benchmark-gated; credible at 100x.** Must beat the existing native ONNX oracle end to end. |
| Candle model worker | integration | Removes ONNX Runtime for a named supported model or enables a Candle-specific backend/package | Conditional and model-specific | Very high | Very high | **Defer.** Require named-model support and material target-host advantage. |
| Compact in-database/native exact vector search | optimization | Eliminates JSON vector materialization, JS cosine, and full JS sort | No custom Rust | Medium | Medium | **10x benchmark-gated.** Prefer maintained `sqlite-vec`/native addon; exact output must match the TS oracle. |
| Bounded parallel verification/parsing core | optimization | Reduces cold-build time while bounding RSS and preserving serial publication | No initially; conditional | High | Medium | **10x/100x growth plus benchmark gate.** Node workers are mandatory baseline. |
| Maintained HNSW projection | optimization | Reduces broad vector candidate-generation latency at 100x | No custom Rust initially | High | High | **100x growth-gated.** Fix bounded SQL eligibility first; require filtered recall and atomic publication. |
| Custom filter-aware Rust ANN core | feature | Supplies eligibility-aware ANN or custom multimodal metrics absent from maintained bindings | Yes, only if the gap is proven | Very high | Very high | **Deferred 100x conditional.** Maintained exact/HNSW options must fail a required capability contract. |
| Narrow two-consumer inference ABI | integration | Shares ordered batch/profile/diagnostic execution between styles and Spec Memory | Not yet | High | High | **Coordination-gated.** Require two consumers with one identical contract and measured superiority. |
| Rust file watcher | automation | Debounces filesystem events and schedules reindex | No | Medium | Medium | **Not worth Rust.** Chokidar plus canonical reconciliation supplies the capability. |
| Standalone deterministic ranking/hash core | optimization | Centralizes RRF, comparators, and identity primitives | No | Medium | Medium | **Not worth Rust.** Supporting parity infrastructure only; no independent material workload. |

## 5. Ranked Recommendation

1. **Build the multi-artifact manifest and evidence plane first.** This is the highest-leverage work because every screenshot feature, model profile, or external vector projection needs atomic publication and rollback.
2. **Ship non-Rust style-analysis features next.** DOM layout fingerprints, palette statistics, and perceptual dedupe add useful retrieval and curation data without a new runtime.
3. **Prove multimodal product value with the installed native ONNX stack.** Rust cannot rescue a retrieval lane that has not demonstrated relevance gain.
4. **Add the parsed-projection cache only after cold-build telemetry.** It is a real missing automation, but language choice follows the measured bottleneck.
5. **Benchmark maintained exact vector engines at 10x only when the vector stage crosses its gate.** Do not author Rust to replace an exact engine available as a maintained extension/addon.
6. **Evaluate a supervised Rust `ort` sidecar only for worker isolation or deployment value.** Both Node and Rust wrappers execute native ONNX Runtime kernels, so inference speed is not presumed.
7. **Evaluate maintained HNSW around a representative 100x workload.** Custom Rust is last, and only for a capability that maintained bindings cannot provide.

## 6. Scale And Materiality Gates

### Current Scale: Approximately 1,290 Bundles

- No Rust search, ranking, hashing, cache, watcher, or indexing component is justified.
- Add publication contracts, instrumentation, layout/palette/dedupe features, and relevance fixtures.
- Use a shadow Transformers.js/ONNX multimodal profile if visual retrieval is desired.

### 10x Scale: Approximately 12,900 Bundles

- Retain exact retrieval unless the observed eligible set, active dimensions, and stage timings cross the measurement gate.
- Pilot compact exact search when vector p50 exceeds 25 ms, vector p95 exceeds 50 ms, or JSON fetch/decode consumes at least 25% of end-to-end p95. These are provisional decision thresholds, not observed styles performance. [SOURCE: iteration-002.md:38-48]
- Consider a Rust worker only when Node-worker/native baselines miss an approved build, drain, RSS, or isolation SLO.

### 100x Scale: Approximately 129,000 Bundles

- First replace the eligible-ID host-parameter shape; broad requests can exceed SQLite's default limit at about 25.4% eligibility. [SOURCE: iteration-002.md:28-32]
- Benchmark exact native search against maintained HNSW after query correctness and generation publication are solved.
- Consider custom Rust only if filter-aware ANN, custom metrics, or lifecycle contracts are required and unavailable through maintained bindings.

## 7. sk-code/018 Architecture Fit

Any surviving Rust component must follow one shape:

```text
TypeScript shell
  owns schemas, feature flags, adapter selection, queues, policy filters,
  SQLite writes, generation publication, cursors, telemetry, rollback, fallback
        |
        v
thin napi-rs / WASM / sidecar adapter
  owns DTO validation, copy/ownership, typed error mapping, lifecycle framing
        |
        v
pure Rust core
  owns only the measured transport-neutral kernel
```

The core accepts owned immutable inputs and returns owned deterministic outputs. `#![forbid(unsafe_code)]` is the default; JS-controlled input must not reach `unwrap`, `expect`, or panic. The adapter does not own public routing or policy. [SOURCE: .opencode/skills/sk-code/code-opencode/references/rust/style-guide/interop-model.md:33-52]

Adapter choice follows the workload:

- **napi-rs:** measured Node-only in-process CPU work where IPC would dominate.
- **WASM:** only a real browser/portable-runtime requirement; no such requirement exists today.
- **Sidecar:** resident models or large ANN indexes where crash/RSS isolation and independent lifecycle justify IPC.

## 8. Feature Opportunities

### Responsive Layout Fingerprints

The crawler already captures rectangles, padding, margins, gaps, flex/grid topology, landmarks, and five viewports. A canonical viewport-normalized JSON projection can support responsive-layout facets and similarity without image segmentation. [SOURCE: iteration-006.md:16-22]

### Rendered Palette And Visual Dedupe

Add explicit screenshot artifact identity first: viewport, content digest, source/capture metadata, rights scope, algorithm version, and owning corpus generation. Then derive palette shares, contrast/saturation descriptors, entropy, and perceptual hashes. The computation should start in existing native-backed image tooling, not bespoke Rust. [SOURCE: iteration-006.md:24-38]

### Multimodal Retrieval

A joint text/image profile enables text-to-visual and image-to-style queries. It needs deterministic preprocessing, modality-aware profile identity, image-content hashes, viewport aggregation policy, and labeled relevance cases. The existing text embedding ABI cannot be reused unchanged. [SOURCE: iteration-006.md:40-52]

## 9. Automation Opportunities

### Parsed-Projection Cache

Full immutable builds currently re-read and re-parse all bundles because the staging database has no prior index state. A detached cache keyed by aggregate SHA-256 plus parser/schema version can reuse normalized projections while remaining non-authoritative and rebuildable. [SOURCE: iteration-008.md:16-23]

### Parallel Cold-Build Precompute

Parallelism is safe before the transaction: stable reads, hashing, parsing, and projection construction. SQLite mutation, FTS synchronization, duplicate checks, generation insertion, and pointer publication remain serial correctness boundaries. Results must be slug-sorted before TypeScript consumes them. [SOURCE: iteration-008.md:30-36]

### Reindex Watcher

Filesystem events are hints, never freshness or deletion authority. Use Chokidar first, coalesce dirty slugs, reconcile on startup/overflow/interval, and retain two-observation deletion rules. Rust `notify` has the same platform limitations and does not add correctness. [SOURCE: iteration-008.md:38-42]

## 10. Integration Opportunities

### In-Database Exact Vector Search

`sqlite-vec` is a compact exact-search experiment, not ANN and not a custom Rust opportunity. It may remove vector JSON transfer and JS exact scoring, but extension loading, Node version floors, trusted binary distribution, and fallback must be tested. [SOURCE: iteration-001.md:24-30]

### Shared Inference ABI

Only model execution and transport-neutral vector validation plausibly overlap between styles and Spec Memory. Their queues, profile activation, cache identity, storage, filters, fusion, and publication remain local. system-code-graph has no current semantic-vector workload and must not be forced into a shared search platform. [SOURCE: iteration-005.md:16-46]

## 11. Phased Adoption Path

### Phase 0: Contract And Evidence

- Define one immutable multi-artifact generation manifest.
- Add stage telemetry for discovery, verify, parse, commit, vector drain, publish, query lanes, image preprocessing, model load, RSS, and QPS.
- Create representative 1x/10x/100x replay fixtures and labeled visual relevance judgments.
- Pin TypeScript byte fixtures for outputs, errors, hashes, numeric spelling, ordering, and edge cases.
- Ship no Rust.

### Phase 1: Capability Baselines

- Add DOM layout fingerprints.
- Add screenshot artifact identity, palette/statistics, and perceptual dedupe.
- Add a modality-aware profile and shadow Transformers.js/ONNX multimodal lane.
- Add the parsed-projection cache only if cold-build telemetry establishes value.

### Phase 2: Measured Native Experiments

- Compare Node workers with a bounded Rust parse core when verify/parse misses a build SLO.
- Compare current exact vectors with maintained in-database/native exact search when vector-stage thresholds are crossed.
- Compare the TS ONNX worker with a supervised Rust `ort` sidecar when isolation, RSS, startup, preprocessing, or deployment misses an SLO.
- Require end-to-end wins after IPC, startup, package size, memory, and fallback costs.

### Phase 3: Growth Architecture

- Fix bounded eligibility/query shape and publish query-visible projections through the manifest.
- At representative 100x scale, compare exact native search with maintained HNSW.
- Add custom Rust only for a proven filter-aware/custom-metric/lifecycle gap.
- Keep ANN rebuildable; SQLite plus the generation manifest remain authoritative.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Port native SQLite/FTS5 work | Already executes in native SQLite; no JS-resident kernel is removed | `retrieval.mjs:200-215` | 1, 9, 10 |
| Port cosine/RRF as-is | Current scale is small; RRF is bounded to about 600 contributions | `retrieval.mjs:218-283` | 1, 9, 10 |
| Custom Rust HNSW now | Maintained Node-callable engines exist and no measured workload clears ownership cost | USearch/hnswlib evidence | 1, 10 |
| Treat `sqlite-vec` as ANN | Public contract supports exact KNN-style search, not a shipped ANN index | sqlite-vec README | 1 |
| IVF before HNSW measurement | Training/rebuild complexity has no measured requirement | Architecture comparison | 1 |
| Rust file watcher as authority | Rust and Node consume equally fallible OS events; canonical rescan remains required | Node, Chokidar, notify docs | 4, 8, 10 |
| Rust embedding cache | Retrieval-hash/profile content-addressed reuse already exists | `vectors.mjs:197-281` | 4, 10 |
| BLAKE3 canonical identity | SHA-256 is already native and persisted; current full pass is only 1.188 s | Current-host measurement | 8, 10 |
| Screenshot-first spacing inference | DOM and computed styles already expose exact geometry | Crawler types/capture | 6, 10 |
| Bespoke Rust palette engine | Native-backed JS image tooling supplies the first baseline | sharp/libvips evidence | 6, 10 |
| Perceptual hash as semantic rank | It detects near-duplicate pixels, not design-language similarity | Image-hash semantics | 6, 10 |
| Rust for offline/privacy alone | Locality is model provisioning and network policy, not host language | Existing Transformers.js local path | 7, 10 |
| Rust `ort` for presumed inference speed | Both Node and Rust wrappers execute native ONNX Runtime | ORT Node and Rust docs | 7, 10 |
| Shared three-system Rust search core | code-graph has no vector workload; the two vector systems have incompatible policy/storage | Ownership and isolation evidence | 5, 9, 10 |
| WASM default | No browser requirement; packaging and single-threaded baseline add no present value | Adapter analysis | 1, 9, 10 |

## Divergence Map

- **Saturated directions:** like-for-like ports; standalone RRF/hash kernels; watcher authority; styles-local cache rewrite; generic three-system search core; WASM without browser demand.
- **Pivots taken:** none. `stopPolicy=max-iterations` broadened focus manually across vector architecture, measurements, automation, shared-core fit, visual features, local models, caches/watchers, and parity.
- **Pivot failures:** none.
- **Audited overrides:** convergence telemetry did not stop the loop before iteration 10.
- **Remaining frontier:** product SLOs, production traces, active embedding dimensions, labeled multimodal judgments, and target-host runtime benchmarks.

## 12. Open Questions

1. What approved product SLO and minimum end-to-end improvement define materiality?
2. What are production or representative eligible-row, dimension, QPS, and stage-latency distributions after persistent opt-in?
3. Do labeled text-to-visual and image-to-style tasks materially outperform structured, lexical, and text-vector retrieval?
4. Which named multimodal model and target platforms should define the ONNX/`ort`/Candle comparison?
5. What exact manifest migration preserves existing generation readers and rollback?

These are implementation-phase measurements and contract decisions, not evidence that Rust should ship now.

## 13. Risks

| Risk | Consequence | Mitigation |
|---|---|---|
| Optimizing legacy replay numbers | Moves an unmeasured persistent/vector stage | Publish a vector profile and instrument stages first. |
| Native artifact matrix | Platform/ABI failures and release burden | Prefer maintained binaries; narrow adapter; JS fallback and kill switch. |
| Approximate retrieval drift | Relevant styles disappear after filtering | Exact oracle, filtered recall@K, over-fetch policy, shadow comparison. |
| Model/profile drift | Non-reproducible vectors and caches | Immutable digests for weights, tokenizer, preprocessing, runtime, dimensions. |
| Multi-artifact skew | SQLite and ANN/image features represent different generations | One immutable manifest selected by one atomic pointer. |
| Over-shared core | Cross-skill release coupling and policy leakage | Share only a proven transport-neutral kernel used by two consumers. |

## 14. Benchmark And Promotion Plan

Record corpus rows, active rows, eligible p50/p95/max, profile dimensions, vectors/bytes returned, warm/cold state, per-stage p50/p95, end-to-end p50/p95, sustained/burst QPS, CPU, event-loop delay, RSS, startup, package size, exact result hash, and recall@K where approximation is allowed.

Promotion requires:

- A declared reference host and representative trace.
- A failed approved SLO, not corpus size alone.
- The smallest alternative comparison: TS baseline, existing native addon/extension, then custom Rust.
- Material end-to-end improvement after boundary and deployment costs.
- Shadow operation, rollback, and fallback evidence.

## 15. Determinism And Parity Contract

Exact Rust paths must match a pinned TypeScript oracle byte for byte across DTO shape, error codes/messages, hashes and preimages, numeric spelling, negative zero, ordering, tie-breaks, omitted fields, and serialization. Parity-visible reductions remain sequential unless fixtures prove another order identical. [SOURCE: .opencode/skills/sk-code/code-opencode/references/rust/style-guide/interop-errors-and-parity.md:127-188]

ANN cannot guarantee byte-identical candidate sets by definition. A strict byte-parity requirement therefore blocks ANN unless the product contract explicitly admits approximation. If approximation is approved, byte parity still governs inputs, profile identity, serialization, errors, exact re-scoring, fusion, cursors, and fallback; candidate quality is governed separately by filtered recall@K and relevance acceptance.

## 16. References

- `.opencode/skills/sk-design/styles/_db/retrieval.mjs`
- `.opencode/skills/sk-design/styles/_db/vectors.mjs`
- `.opencode/skills/sk-design/styles/_db/indexer.mjs`
- `.opencode/skills/sk-design/styles/_db/schema.mjs`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts`
- `.opencode/skills/sk-code/code-opencode/references/rust/style-guide/interop-model.md`
- `.opencode/skills/sk-code/code-opencode/references/rust/style-guide/interop-errors-and-parity.md`
- Iteration narratives `iterations/iteration-001.md` through `iteration-010.md`
- Primary external documentation cited within the iteration narratives: SQLite limits and extension loading, sqlite-vec, USearch, hnswlib-node, Rayon, fastembed, ONNX Runtime, notify, Chokidar, Playwright, sharp, Transformers.js, Candle, BLAKE3.

## 17. Convergence Report

- **Stop reason:** `maxIterationsReached`
- **Total iterations:** 10
- **Configured threshold:** 0.05; convergence was telemetry only under `stopPolicy=max-iterations`
- **newInfoRatio trend:** 0.86, 0.78, 0.64, 0.72, 0.68, 0.76, 0.74, 0.71, 0.58, 0.46
- **Last three iterations:** incremental cache/watch/publication (0.71), deterministic core/parity (0.58), final adjudication (0.46)
- **Question status:** all five architecture questions adjudicated; measurement and product-quality evidence remains open
- **Source diversity:** repository implementation and standards, direct current-host measurements, and primary external project/runtime documentation
- **Negative knowledge:** consolidated in Eliminated Alternatives; no early synthesis occurred
- **Divergence:** no Council pivots; breadth was forced through ten distinct focus angles

The declining novelty trend is consistent with synthesis readiness, but completion is attributed to the configured hard cap, not an early convergence stop.
