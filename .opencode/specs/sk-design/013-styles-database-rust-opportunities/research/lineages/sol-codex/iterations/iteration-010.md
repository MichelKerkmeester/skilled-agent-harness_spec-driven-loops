# Iteration 10: Ranked Opportunities and Adoption Gates

## Focus

Convert nine evidence rounds into a ranked decision, explicitly separating worthwhile product features from worthwhile Rust investments.

## Ranked Opportunity Matrix

| Rank | opportunity | class: feature/optimization/automation/integration | capability unlocked | Rust necessary? | effort | risk | gate verdict |
|---:|---|---|---|---|---|---|---|
| 1 | Local text + image embedding runtime | feature / integration | Offline, private, reproducible semantic and visual retrieval without an external embedding API | No for MVP; strategically useful for one audited multimodal runtime | Medium–high | Medium–high: model packaging, numerical parity, licenses | Capability clears today; Rust clears only after Node ONNX/Sharp baseline shows material packaging/runtime or reuse benefit |
| 2 | Multimodal screenshot retrieval | feature | Text-to-render and image-to-image style discovery not present in canonical text vectors | No; CLIP via Node runtime can prove value | High | High: screenshot coverage, provenance, relevance evaluation | Feature clears today if screenshots/relevance set exist; Rust remains conditional on rank 1 |
| 3 | Continuous dirty-set indexing + batch embedding scheduler | automation | Automatic freshness, coalesced changes, batched local inference, immutable quiet-window publication | No; Chokidar + bounded TS batching first | Medium | Medium: dropped events, job races, resource limits | Automation clears today; standalone Rust watcher fails residency/materiality gate |
| 4 | Palette, pHash, contrast, and simple layout descriptors | feature / automation | Duplicate detection, visual change detection, metadata/render discrepancy checks | No; Sharp/libvips already native | Medium | Low–medium: false duplicates, image availability | Feature clears today; Rust fails necessity gate unless co-located with justified rank-1 core |
| 5 | Existing SQLite vector extension + binary/in-DB vectors | integration / optimization | Remove vector JSON transfer/parsing and compose filtering/search with SQLite | No; use pinned sqlite-vec/USearch-class extension | Medium | High: extension loading, platform artifacts, maturity, filter pushdown | Spike is reasonable; performance gate is growth or profiler evidence, not 1,290 rows |
| 6 | Content-addressed model/vector/index cache | automation / optimization | Reuse immutable model, preprocessing, embedding, and index artifacts across rebuilds/systems | No | Medium | Low–medium: identity invalidation, storage lifecycle | Clears only after local models or a second consumer create large reusable artifacts |
| 7 | ANN HNSW/IVF candidate index | feature / optimization | Scalable semantic search for 10x–100x corpus or many region/image vectors | No; mature native add-ons/extensions/services exist | High | High: recall, filtering, determinism, rebuilds, parity policy | Growth-gated; benchmark 1.3k/10k/50k/100k/1M and require recall/exact-rescore gates |
| 8 | Shared Rust inference/vector primitive crate | integration | One audited local model/vector/cache implementation across styles, memory, and code graph | Yes only if this option is selected; reuse itself is language-neutral | High | High: common-denominator API, versioning, distribution | Two-consumer gate plus identical pinned workload/profile; not justified for styles alone |
| 9 | Learned region/layout fingerprinting | feature | Retrieve by composition and component regions beyond global screenshot similarity | No; runtime choice follows model | High | High: labelling, segmentation quality, compute | Relevance-gated after global CLIP + simple geometry demonstrate a miss |
| 10 | Vector quantization/memory-mapped snapshots | optimization | Reduce memory/storage and accelerate large indexes | No | High | High: accuracy and migration | Growth-only; fails today's scale gate |
| 11 | Rust file watcher | automation | Native change notification | No | Medium | Medium: platform semantics, daemon recovery | Not worth Rust today; TypeScript watcher plus reconciliation is sufficient |
| 12 | Rust deterministic cosine/RRF/tokenizer/hash port | optimization | No new capability; replaces bounded existing behavior | No | Low implementation, high verification drag | Medium: float/byte parity and ABI surface | Reject: fails materiality and scale gates at 1,290 bundles |
| 13 | Custom Rust SQLite vector extension | integration / optimization | Same vector-in-SQL capability available from existing native extensions | No unique need | Very high | Very high: C ABI/unsafe review, packaging, extension security | Reject unless existing extensions fail a documented must-have requirement |

## Ranked Recommendation

1. Do not begin with Rust. Build the value oracle in the TypeScript shell: instrument current stage timings; inventory screenshot coverage; create judged text/visual queries; add a Node ONNX/Sharp fallback for local text/image embeddings and simple visual descriptors; batch the existing vector queue; run in shadow mode.
2. Treat local multimodal inference as the first plausible Rust extraction, not because Rust is inherently faster, but because model inference is genuinely new material native compute and can consolidate text/image preprocessing, inference, and artifact identity. Extract only after the JS baseline establishes value and either package/runtime measurements or a second consumer justify the boundary.
3. Spike a pinned existing SQLite vector extension independently if profiling shows JSON transfer/parse or exact scan latency matters. Do not author a Rust extension and do not replace FTS5.
4. Add ANN only after corpus/multi-vector growth crosses a measured exact-search threshold and the repository accepts an approximation parity contract. Use an existing engine before custom code.
5. Extract a shared crate only after two systems sign up for the same pinned model/profile and native operation. Share primitives, never domain ranking or schemas.

## Phased Adoption Path

### Phase 0 — Evidence and contracts

- Add per-stage read/index/inference measurements and corpus/vector-byte counters.
- Inventory screenshot availability/provenance and label a compact relevance suite.
- Freeze embedding profile identity, preprocessing, output encoding, error shapes, and byte serialization.
- Exit: measured baseline, judged queries, and a pinned TS oracle exist.

### Phase 1 — TypeScript-shell feature MVP

- Add Node ONNX Runtime for local text/image embeddings, Sharp for deterministic descriptors, Chokidar plus reconciliation, and batch-aware queue draining.
- Preserve `legacy|shadow|persistent`; run new signals behind independent feature flags and shadow comparison.
- Exit: relevance, rebuild latency, memory, package size, failure/fallback, and deterministic fixture results meet explicit targets.

### Phase 2 — Conditional Rust inference extraction

- Enter only if inference/preprocessing is materially costly or at least two consumers require the same runtime.
- Implement a pure `styles-search-core` and one thin napi-rs adapter; TypeScript retains transport, selection, DB writes, flags, timeouts, and fallback.
- Require byte-for-byte differential fixtures against the Phase-1 oracle across supported targets; rollback is the native feature flag.
- Exit: measured end-to-end improvement after boundary copies/package cost, full fallback replay, and no contract drift.

### Phase 3 — Conditional vector-store growth work

- First test a pinned existing SQLite extension with filtered queries and exact mode.
- Add ANN only when exact search misses a latency/SLO target at a representative larger corpus; preserve exact re-score and exact fallback.
- Exit: recall@k, filter recall, tail latency, memory, build/update time, crash recovery, and parity-policy gates pass.

### Phase 4 — Cross-system extraction

- Enter only with a second committed consumer using the same model/profile/cache/index primitive.
- Extract profile, inference, vector encoding/index interfaces, and content-addressed artifacts; leave domain ranking and schemas local.
- Prefer separate thin adapters; use a shared sidecar only after model-sharing memory/startup measurements justify operational coupling.

## Ruled Out

- Any like-for-like rewrite of native SQLite/FTS5 or bounded TypeScript math.
- Rust as the prerequisite for shipping local embeddings, visual descriptors, watchers, or SQLite vector search.
- Custom ANN/SQLite code before existing engines fail a documented requirement.
- Shared domain ranking across styles, memory, and code graph.

## Edge Cases

- A product feature can rank highly while its Rust implementation ranks low; the matrix intentionally separates those decisions.
- If screenshot coverage is poor, local text embeddings remain viable while multimodal work pauses.
- If strict byte parity requires exact result equality for all queries, ANN remains experimental or must use the same pinned engine/index in native and fallback paths.
- If Node ONNX/Sharp meets all targets, the correct Phase-2 decision is “no Rust.”

## Assessment

- New information ratio: 0.48
- Questions addressed: ranked recommendation and adoption path
- Questions answered: ranked recommendation and adoption path
- Stop reason: max iterations reached; convergence was telemetry only by operator instruction.

## Reflection

- What worked and why: ranking product value separately from language necessity avoided both blanket rejection and Rust-first bias.
- What did not work and why: numeric thresholds cannot be invented without local baselines and SLOs.
- What I would do differently: run the Phase-0 measurements before assigning calendar estimates.

## Recommended Next Focus

Synthesize the complete lineage into `research.md` and `resource-map.md`.
