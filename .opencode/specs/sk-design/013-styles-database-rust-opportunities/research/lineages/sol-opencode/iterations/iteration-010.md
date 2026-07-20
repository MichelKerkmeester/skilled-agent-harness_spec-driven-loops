# Iteration 10: Final Opportunity Adjudication

## Focus

Adjudicate the complete opportunity set, classify each candidate as unconditional, benchmark-gated, growth-gated, or ruled out, and define a phased path that preserves TypeScript shell ownership and pinned-oracle parity.

## Actions Taken

1. Replayed the nine prior iteration records, strategy, and reducer-owned findings registry as the evidence base.
2. Cross-compared every candidate against the repository's residency, materiality, scale, publication, and parity gates.
3. Ranked the surviving opportunities by capability unlocked, not by whether Rust could implement them.
4. Derived the minimum multi-artifact generation contract and phased adoption sequence required before any query-serving Rust projection can ship.

## Findings

### F1. The highest-priority work is unconditional, but it is TypeScript-owned enabling infrastructure rather than a Rust component

The styles database cannot safely publish screenshot-derived features, model/profile artifacts, or an external ANN projection through the current pointer, which binds only a SQLite generation. The first investment is a versioned generation manifest that atomically names the SQLite file and every query-visible projection by basename, digest, schema/profile identity, and owning corpus generation. Detached parse caches remain rebuildable inputs and stay outside this authoritative manifest. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:1014-1048] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:1093-1125] [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/research/lineages/sol-opencode/iterations/iteration-008.md:44-48]

The minimum manifest contract is: `manifestVersion`; immutable `generationHash`; one SQLite artifact with file, SHA-256 digest, and schema version; zero or more derived artifacts with kind, file, SHA-256 digest, producer/schema version, profile fingerprint, source generation, and optional viewport/model identity; plus publication time. Readers must validate the complete manifest before opening any artifact, and the final pointer rename must select one immutable manifest. TypeScript continues to own staging, validation, sync, rename, rollback, feature flags, and fallback.

The second unconditional investment is instrumentation plus a pinned TypeScript oracle: stage p50/p95, eligible-row distribution, active dimensions, QPS/utilization, model load/RSS, image preprocessing, exact result hashes, and byte fixtures for numeric/order/error boundaries. Existing tests do not provide representative vector latency or byte-complete cross-language parity. [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/research/lineages/sol-opencode/iterations/iteration-002.md:16-20] [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/research/lineages/sol-opencode/iterations/iteration-009.md:28-34]

### F2. Final ranked opportunity matrix

| Rank | opportunity | class | capability unlocked | Rust necessary? | effort | risk | gate verdict |
|---:|---|---|---|---|---|---|---|
| 1 | Versioned multi-artifact generation manifest | Enabling contract | Atomic publication of SQLite, screenshot features, model profiles, and optional ANN projections | No | Medium | Medium | **Unconditional now**; prerequisite for every query-visible external artifact |
| 2 | Stage telemetry and pinned TS differential oracle | Enabling contract | Evidence-based adoption and byte-level rollback confidence | No | Medium | Low | **Unconditional now**; no Rust prototype before this gate |
| 3 | DOM-derived responsive layout fingerprints | New feature | Geometry/topology style search without image inference | No | Medium | Low | **TS baseline now**; crawler already owns exact geometry [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:51-108] |
| 4 | Screenshot palette/statistics and perceptual dedupe | New feature | Rendered-color facets, duplicate detection, recrawl-change triage | No | Medium | Medium | **TS/native baseline now** using existing image tooling; do not build a bespoke Rust image stack [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/research/lineages/sol-opencode/iterations/iteration-006.md:26-46] |
| 5 | Joint text/image multimodal retrieval | New feature | Text-to-visual and image-to-style search fused with existing lanes | No initially; conditional for worker isolation | High | High | **Relevance-gated**: labeled tasks must beat structured, lexical, and text-vector baselines before runtime optimization |
| 6 | Cross-generation parsed-projection cache | Build automation | Reuse verified normalized projections across immutable full builds | No | Medium | Medium | **Benchmark-gated**; language-neutral feature, Rust only if VERIFY/PARSE dominates a missed build SLO [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/research/lineages/sol-opencode/iterations/iteration-008.md:16-36] |
| 7 | Resident Rust `ort` multimodal sidecar | Optimization/integration | Crash/RSS isolation, bounded native preprocessing, model residency | Conditional | High | High | **Benchmark-gated at 10x; credible at 100x** only after TS ONNX oracle misses an operational SLO and Rust materially improves end-to-end metrics |
| 8 | Compact in-database/native exact vector search | Optimization | Removes JSON vector materialization and JS cosine residency | No custom Rust | Medium | Medium | **10x benchmark-gated** at vector p50 >25 ms, p95 >50 ms, or JSON decode >=25% of end-to-end p95; prefer maintained extension/addon [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/research/lineages/sol-opencode/iterations/iteration-002.md:40-46] |
| 9 | Bounded parallel verification/parsing core | Optimization | Faster cold rebuilds with bounded RSS and deterministic projections | No initially; conditional | High | Medium | **10x/100x growth plus benchmark gate**; Node workers are the mandatory baseline, SQLite commit remains serial |
| 10 | Maintained HNSW projection | Optimization/capability | Lower-latency vector candidate generation at broad 100x eligibility | No custom Rust initially | High | High | **100x growth-gated** after fixing the 32,766-variable query shape and exact p50 >50 ms/p95 >100 ms; require filtered recall@K and atomic manifest publication |
| 11 | Custom filter-aware Rust ANN core | New native capability | Eligibility-aware ANN or custom multimodal metrics unavailable in maintained Node bindings | Yes, only if the gap is proven | Very high | Very high | **Deferred 100x conditional**; maintained exact/HNSW candidates must first fail a required capability contract |
| 12 | Shared two-consumer inference ABI | Integration | Common ordered batch/profile/diagnostic seam for styles and Spec Memory | Not yet | High | High | **Coordination-gated**: require two consumers with one identical profile/normalization contract and measured superiority over the resident service |

The ordering deliberately puts feature value and safety contracts ahead of native implementation. Local/offline multimodal inference is already possible through the installed Transformers.js/ONNX Runtime stack; Rust does not create locality or move ONNX kernels into native residency because they are native already. [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/research/lineages/sol-opencode/iterations/iteration-007.md:16-32]

### F3. Plain not-worth-Rust decisions

- **Weighted RRF, comparator chains, and canonical SHA-256:** RRF is bounded to roughly 600 contributions, SHA-256 already runs in native code, and both are parity contracts rather than product capabilities. Keep them as the TS oracle; port only as private support inside an independently justified component. [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:23-24] [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/research/lineages/sol-opencode/iterations/iteration-009.md:16-20]
- **Standalone Rust watcher:** filesystem events remain fallible across languages. Use Chokidar to debounce hints and preserve authoritative startup/periodic rescans and two-observation deletion rules. [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/research/lineages/sol-opencode/iterations/iteration-008.md:38-42]
- **Rust embedding cache or complete indexer rewrite:** retrieval-hash/profile caching, incremental identities, retries, publication, and fallback already exist; moving ownership adds no capability. [SOURCE: .opencode/skills/sk-design/styles/_db/vectors.mjs:197-281]
- **BLAKE3 as canonical identity:** the measured full SHA-256 pass is only 1.188 seconds at current scale, while changing identity invalidates persisted contracts and oracle fixtures. [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/research/lineages/sol-opencode/iterations/iteration-008.md:24-28]
- **WASM default, bespoke palette engine, screenshot-based spacing extraction, and perceptual hash as semantic rank:** no browser requirement exists; native-backed Node image tooling and exact DOM geometry already cover the first baselines; perceptual similarity is dedupe, not design-language relevance. [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/research/lineages/sol-opencode/iterations/iteration-006.md:16-46]
- **Shared Rust search platform across three systems:** system-code-graph has no vector workload, and styles and Spec Memory intentionally differ in ranking, storage, publication, and fallback. A shared search core would create release coordination without shared compute residency. [SOURCE: .opencode/skills/system-code-graph/SKILL.md:16-26] [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/research/lineages/sol-opencode/iterations/iteration-005.md:16-44]

### F4. Phased adoption path preserves TS ownership and makes Rust removable

**Phase 0, contract and evidence:** extend generation publication to one immutable multi-artifact manifest; add stage telemetry, representative 1x/10x/100x replay fixtures, labeled visual-retrieval judgments, and TS-authored byte fixtures. No Rust ships.

**Phase 1, capability baselines:** add TS-owned layout fingerprints, image statistics/perceptual dedupe, modality-aware profile identity, and a shadow Transformers.js/ONNX multimodal lane. Add the detached parsed-projection cache only after cold-build telemetry establishes reuse value. Every feature has lexical/structured fallback and can publish without an external ANN index.

**Phase 2, measured native experiments:** when a declared SLO fails, compare the smallest relevant alternative: Node workers versus a bounded Rust parse core; current exact vector lane versus a maintained compact exact extension; TS ONNX worker versus a supervised Rust `ort` sidecar. Run shadow mode against pinned TS fixtures and require material end-to-end improvement after IPC, package, startup, RSS, and fallback costs. A kernel win hidden by I/O, capture, or SQLite commit fails the gate.

**Phase 3, growth architecture:** only around a representative 100x workload, after bounded SQL eligibility and manifest publication are solved, benchmark exact native search against maintained HNSW. Adopt custom Rust only for a measured filter-aware/custom-metric/lifecycle gap that maintained bindings cannot satisfy. ANN remains a rebuildable projection; SQLite and the manifest remain authoritative.

At every phase TypeScript owns public schemas, profile and adapter selection, queues, feature flags, policy filters, fusion, cursors, telemetry, publication, rollback, and fallback. Rust receives immutable bounded inputs and returns deterministic outputs behind a replaceable adapter. The release gate is pinned TS-oracle parity for success and error bytes, exact identity preimages, deterministic ordering, shadow result comparison, and kill-switch fallback. [SOURCE: .opencode/skills/sk-code/code-opencode/references/rust/style-guide/interop-model.md:33-52] [SOURCE: .opencode/skills/sk-code/code-opencode/references/rust/style-guide/interop-errors-and-parity.md:152-188]

### F5. All five key questions are adjudicated, but measurement gaps remain intentionally open

The architecture verdict is exact TS at 1x, maintained compact exact search as the first 10x experiment, maintained HNSW only at a measured 100x gate, and custom Rust only for an unavailable filter-aware/custom-metric capability. Indexing value lies in a language-neutral projection cache and conditionally parallel pre-transaction work; hashing, watching, queueing, SQLite commit, and publication stay with existing owners. Visual features are practical in layers, with Rust plausible only for a materially superior resident model worker. A shared search core is rejected; a narrow inference ABI remains coordination-gated. No production Rust component clears all residency, materiality, scale, publication, and parity gates today.

## Questions Answered

- **Which vector architecture unlocks capability by scale?** Exact TS at 1x; maintained compact exact at a measured 10x gate; maintained HNSW at a measured 100x gate; custom filter-aware Rust only after maintained candidates fail a required capability.
- **Which indexing and embedding automations materially improve with Rust?** None today. Projection reuse is valuable but language-neutral; parallel parse and resident inference remain benchmark-gated.
- **Which visual features are practical?** DOM fingerprints, screenshot statistics, and dedupe are practical without Rust. Multimodal retrieval is practical only after labeled relevance evidence; Rust is a conditional runtime optimization.
- **Is a shared Rust search core worthwhile?** No. A narrow two-consumer inference ABI may be revisited after identical contracts and measured superiority exist.
- **Which opportunities clear the gates?** The manifest, telemetry/oracle, and non-Rust feature baselines clear now. Rust inference, preprocessing, exact search, and ANN remain benchmark/growth gated; ownership-transfer rewrites are ruled out.

## Questions Remaining

- What are the measured stage p50/p95, eligibility/selectivity, QPS, model load/RSS, image preprocessing, and embedding-drain distributions on the declared reference host?
- Do labeled text-to-visual and image-to-style judgments show material relevance gain over structured, lexical, and text-vector retrieval?
- Which declared product SLO and minimum end-to-end improvement threshold should govern promotion from shadow to persistent mode?

These are implementation-phase measurements, not unresolved architecture choices; the matrix remains valid until evidence crosses one of its explicit gates.

## Ruled Out Directions

- Like-for-like Rust ports of weighted RRF, SHA-256, embedding cache, watcher authority, SQLite publication, or the complete indexer.
- A three-system shared Rust search platform.
- WASM without a browser requirement, IVF before measured HNSW limits, and a custom HNSW implementation before maintained candidates fail.
- Rust as the source of privacy/offline behavior or as an automatic ONNX inference speedup.
- Query-visible external artifacts published outside one immutable generation manifest.

## Assessment

- **newInfoRatio:** 0.46
- **Novelty justification:** This final iteration converted nine evidence rounds into one ranked gate matrix, made the multi-artifact manifest and oracle the unconditional first phase, and separated worthwhile capability work from conditional Rust residency.
- **Confidence:** High on current ownership, scale, publication, and parity verdicts; medium on future promotion thresholds because representative production traces and labeled multimodal judgments do not yet exist.

## Next Focus

Synthesize the research packet, then plan Phase 0 only: the versioned generation manifest, telemetry matrix, labeled relevance set, and pinned TypeScript byte oracle. Do not schedule a Rust implementation until one measured gate fails.
