# Iteration 1: Vector Search Architecture by Scale

## Focus

Pressure-test ANN and in-database vector-search options against the current `retrieval.mjs` residency decomposition and corpus scenarios of 1,290, 12,900, and 129,000 style bundles.

## Actions Taken

1. Traced the current vector lane from SQLite row selection through JSON decoding, cosine scoring, sorting, and candidate truncation.
2. Compared SQLite-extension, native-addon, in-process HNSW, and WASM deployment boundaries using primary project documentation.
3. Checked repository precedent for `sqlite-vec`, including dependency reuse and native ABI isolation costs.
4. Evaluated each architecture against exact-result parity, eligibility filtering, persistence, and the three scale scenarios.

## Findings

### F1. Exact search remains the correct baseline at 1,290 and is still the default hypothesis at 10x

The current vector lane selects only eligible, active, retrieval-hash-matching rows for one profile, then parses every `vector_json`, computes cosine in JS, sorts, and truncates. Its variable work is therefore linear in eligible rows and dimensions, plus JSON materialization and an `O(N log N)` full sort. At the three corpus sizes, cosine alone visits `1,290*d`, `12,900*d`, and `129,000*d` vector components per query; the current design also crosses the SQLite/JS boundary with all selected vectors. [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:232-249]

That residency creates a legitimate optimization target, but not an ANN requirement. USearch's own documentation says approximate methods are predominantly useful when exact search becomes too expensive, typically at millions of entries, and demonstrates an exact API on 10,000 vectors. This is vendor evidence rather than a repository benchmark, so it supports retaining exact search as the 1,290/10x baseline, not a latency claim. [SOURCE: https://raw.githubusercontent.com/unum-cloud/usearch/main/README.md]

**Scale verdict:** 1,290: no new engine. 12,900: keep exact and benchmark only if measured query latency is material. 129,000: benchmark compact native exact search against ANN; size alone does not prove ANN is needed.

### F2. `sqlite-vec` is the smallest near-term experiment, but it is neither ANN nor a Rust opportunity

`sqlite-vec` supplies a `vec0` virtual table, compact binary vectors, KNN-style SQL, Node packaging, and WASM portability. Moving exact distance calculation into SQLite would avoid `vector_json` parsing and returning all vectors to JS, while preserving SQL-local row IDs for joining back to styles. However, the project describes itself as pre-v1 and "fast enough"; its published README does not claim an ANN index. It should be classified as an in-database exact-search experiment, not HNSW/IVF and not evidence that custom Rust is needed. [SOURCE: https://raw.githubusercontent.com/asg017/sqlite-vec/main/README.md]

The repository already ships `sqlite-vec` for Spec Kit Memory, so dependency and operational knowledge can be reused. It also records the real cost: native modules may target a different Node ABI and are isolated behind a bridge process. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/package.json:58-73] [SOURCE: .opencode/plugins/mk-code-graph.js:9-14]

`node:sqlite` can load shared extensions only when `DatabaseSync` is opened with `allowExtension: true`; the API was added in Node 22.13/23.5, and extension loading is disabled by default. The styles database currently opens `DatabaseSync` without that option. This makes version floor, trusted binary distribution, ABI/platform coverage, and explicit fallback behavior acceptance gates for a pilot. [SOURCE: https://nodejs.org/api/sqlite.html#databaseloadextensionpath-entrypoint] [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:360-369]

### F3. A maintained native HNSW addon should precede a custom Rust HNSW core

Both USearch and `hnswlib-node` already expose Node-callable HNSW indexes with persistence. USearch additionally exposes Rust, JavaScript, WASM, SQLite, memory-mapped index views, quantization, and exact search from one engine; `hnswlib-node` exposes index initialization, insertion, KNN search, and synchronous save/load. [SOURCE: https://raw.githubusercontent.com/unum-cloud/usearch/main/README.md] [SOURCE: https://raw.githubusercontent.com/yoshoku/hnswlib-node/main/README.md]

This weakens the case for authoring a styles-specific Rust ANN implementation. The Rust-specific capability that could matter later is not raw HNSW: USearch's matrix exposes filter predicates and user-defined metrics in Rust but not in its JavaScript binding. That matters because the current pipeline computes policy and facet eligibility before vector scoring. An ANN candidate generator that cannot apply equivalent filtering may need over-fetch/retry logic and can lose recall after filtering. [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:160-176] [SOURCE: https://raw.githubusercontent.com/unum-cloud/usearch/main/README.md]

**Rust gate:** consider a thin Rust adapter only if a measured 100x workload needs filter-aware ANN, custom multimodal metrics, or deterministic index lifecycle behavior unavailable through maintained Node bindings. Otherwise, use an existing addon behind the TS-owned `legacy|shadow|persistent` selection and fallback contract.

### F4. ANN changes retrieval semantics and therefore cannot satisfy exact oracle parity by implementation identity

HNSW is approximate and tunes recall through construction/search expansion; it also introduces a second persisted projection that must remain synchronized with SQLite generation, profile, retrieval hash, deletes, and eligibility state. USearch documents configurable `connectivity`, `expansion_add`, and `expansion_search`, as well as save/load/view behavior. [SOURCE: https://raw.githubusercontent.com/unum-cloud/usearch/main/README.md]

The adoption oracle must therefore compare a stable contract rather than demand byte-identical candidate order from ANN: measure recall@K against the exact TS lane, enforce deterministic tie handling after candidate generation, and fall back to exact search when the ANN projection is stale or unavailable. Exact parity remains achievable for an exact native kernel or `sqlite-vec`; ANN requires an explicitly approved approximation budget.

### F5. WASM and IVF do not clear the current materiality gate

Both `sqlite-vec` and USearch advertise WASM portability, but the styles database is a local Node/SQLite subsystem, not a browser runtime. WASM would add another artifact and adapter without removing the SQLite integration or proving better latency than a native extension/addon. It is useful only if browser-side style search becomes a concrete product requirement. [SOURCE: https://raw.githubusercontent.com/asg017/sqlite-vec/main/README.md] [SOURCE: https://raw.githubusercontent.com/unum-cloud/usearch/main/README.md]

No current requirement needs IVF's trained coarse quantizer, and none of the inspected maintained Node-facing candidates makes IVF the simplest path. At 129,000 rows, HNSW is the first ANN architecture to benchmark because mature Node-callable implementations and persistence already exist. IVF is ruled out until corpus size, memory pressure, or batch-rebuild economics are measured to favor it.

## Questions Answered

- **Which vector-search architecture unlocks meaningful capability at 1,290, 10x, and 100x?** At 1,290, retain the exact TS oracle. At 10x, first test compact in-database exact search (`sqlite-vec`) or a maintained native exact kernel; neither requires custom Rust. At 100x, run a recall/latency/index-lifecycle benchmark between exact native search and maintained HNSW. A custom Rust core is conditional on filter-aware or custom-metric capability absent from Node bindings. WASM and IVF do not clear today's gate.

## Questions Remaining

- What measured p50/p95 query latency, vector dimension, eligible-row distribution, and query rate trigger the 10x or 100x migration gate?
- Can the existing generation publication model atomically publish an external HNSW index with the SQLite database, or does it require a new manifest contract?
- Which indexing and embedding automations materially improve with Rust?
- Which visual and multimodal analysis features are practical?
- Is a shared Rust search core worth cross-system coordination?
- Which complete opportunity set clears residency, materiality, and scale gates?

## Sources Consulted

- `.opencode/skills/sk-design/styles/_db/retrieval.mjs:160-249`
- `.opencode/skills/sk-design/styles/_db/schema.mjs:360-369`
- `.opencode/skills/system-spec-kit/mcp-server/package.json:58-73`
- `.opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-store.ts:16-27`
- `.opencode/plugins/mk-code-graph.js:9-14`
- `https://raw.githubusercontent.com/asg017/sqlite-vec/main/README.md`
- `https://raw.githubusercontent.com/unum-cloud/usearch/main/README.md`
- `https://raw.githubusercontent.com/yoshoku/hnswlib-node/main/README.md`
- `https://nodejs.org/api/sqlite.html`

## Assessment

- **newInfoRatio:** 0.86
- **Novelty justification:** This first iteration converted the broad ANN question into scale-specific gates, identified in-database exact search as distinct from ANN, and found repository-native ABI precedent plus a Rust-only filter capability that may become material at 100x.
- **Confidence:** High on current residency and integration boundaries; medium on scale thresholds because no styles-specific benchmark or production query distribution exists yet.

## Reflection

Primary project documentation plus repository code was sufficient to distinguish capability from language choice. Vendor benchmark claims were not converted into local performance claims. A guessed underscore-form path for two Spec Kit files was absent; locating the canonical `mcp-server` path resolved the lookup without any mutation.

### Ruled Out Directions

- Custom Rust HNSW at current scale: existing maintained native bindings expose the base capability, while no measured bottleneck justifies ownership.
- Treating `sqlite-vec` as ANN: current public documentation supports exact KNN-style vector search but does not establish a shipped ANN index.
- WASM as the Node default: portability without a browser requirement does not create material value.
- IVF before measurement: added training/rebuild complexity lacks a current scale or memory requirement.

## Next Focus

Map the current embedding queue, retrieval-hash cache, generation publication, and corpus rebuild path to identify whether parallel streaming ingestion, content-addressed caching, local inference, or file watching contains enough JS-resident work for Rust to unlock a new automation rather than merely accelerate existing control flow.
