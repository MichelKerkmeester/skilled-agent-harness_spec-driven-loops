# Iteration 4: Rust Residency in Indexing and Embedding Automation

## Focus

Determine which indexing and embedding automations become materially better when compute resides in Rust, without proposing a like-for-like port of the existing JavaScript indexer, SQLite queue, or publication protocol.

## Actions Taken

1. Read the externalized state, reducer-owned strategy, prior iteration, and immutable run configuration.
2. Traced bundle discovery, metadata hints, canonical hashing, parsing, SQLite commit, vector queue, retry, cache, and generation publication through the current implementation.
3. Measured the checked-in styles surface at approximately 135 MiB across 7,776 files to bound cold-build I/O, while retaining the charter's approximately 1,290-bundle scale.
4. Compared the residency boundaries with Rust's Rayon parallel iterators, `fastembed` local batched inference, ONNX Runtime threading controls, and `notify` filesystem-event guarantees.

## Findings

### F1. The current incremental design already avoids most hashing work; Rust parallelism targets cold verification, not normal updates

The indexer first computes per-bundle metadata hints and only fully reads, SHA-256 hashes, normalizes, and parses candidates whose hints or crawl records changed. A normal unchanged run therefore does not hash all content, while `verifyAll` and full builds deliberately do. The checked-in styles tree is approximately 135 MiB across 7,776 files, so parallel read/hash/parse can reduce a cold rebuild's wall time, but it cannot be called material for normal incremental operation without a measured cold-build profile showing that `VERIFY` plus `PARSE_VALIDATE` dominates. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:181-270] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:670-720] [SOURCE: command `du -sk .opencode/skills/sk-design/styles`, 2026-07-20] [SOURCE: command `rg --files .opencode/skills/sk-design/styles | wc -l`, 2026-07-20]

Rayon makes data-parallel iteration straightforward, but that is capability evidence rather than a speed measurement for this corpus. The viable boundary is a Rust batch function that accepts independently verified bundle paths and returns deterministically ordered parsed projections; JavaScript must retain lifecycle orchestration and SQLite publication. [SOURCE: https://docs.rs/rayon/latest/rayon/iter/index.html]

### F2. Local batched embedding inference is the only indexing automation that adds a clearly new Rust-resident capability

The current drain calls an arbitrary asynchronous embedder once per job in a serial loop, with a default batch limit of 25. It caches by `(retrieval_hash, profile_id)`, validates dimensions, and commits each result independently. This is robust provider-neutral orchestration, but it has no local model runtime, tokenizer ownership, true batch inference, model-artifact acquisition, or execution-provider policy. [SOURCE: .opencode/skills/sk-design/styles/_db/vectors.mjs:129-215] [SOURCE: .opencode/skills/sk-design/styles/_db/vectors.mjs:229-313]

`fastembed` exposes local text embedding for a collection of texts with an explicit batch size, supports user-provided models, and exposes quantized model variants. Its default initialization enables high graph optimization and CPU-wide intra-op threading. ONNX Runtime separately documents that intra-op threads parallelize operators, that graph-parallel execution can help or hurt depending on model shape, and that global pools avoid contention among multiple sessions. A long-lived Rust model worker can therefore add offline/private, reproducible, batched embedding generation while amortizing model startup and keeping tensors out of repeated JavaScript callbacks. [SOURCE: https://docs.rs/fastembed/latest/fastembed/struct.TextEmbedding.html] [SOURCE: https://onnxruntime.ai/docs/performance/tune-performance/threading.html]

This opportunity clears the residency gate only when an offline/private local profile is a product requirement or measured provider latency/cost dominates vector drains. At present there is no active embedding profile or drain benchmark, so Rust local inference is a capability candidate, not a demonstrated current optimization. The smallest contract is `embed_batch(profile_identity, retrieval_hash + text[]) -> vectors[]`; JavaScript should continue to claim jobs, enforce retries and supersession, write SQLite rows, and preserve lexical fallback.

### F3. Parallel streaming ingestion should stop before the single-writer publication boundary

Changed bundles are fully verified before `BEGIN IMMEDIATE`; the transaction then performs ordered normalized-row replacement, FTS trigger updates, vector-job supersession, generation creation, and pointer advancement. Full publication additionally validates a staged database, syncs an immutable generation file, and atomically renames a pointer. Parallel Rust workers can precompute immutable bundle projections and hashes, but parallel SQLite mutation would conflict with this deliberate single-writer atomicity and would not improve model inference. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:809-915] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:947-989] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:1051-1125]

The adoption gate is a stage-timed cold replay where pre-transaction verification is both CPU-bound and at least 30% of total build wall time. Below that threshold, Node's current asynchronous file reads and metadata-candidate filter remain simpler. Any Rust result must be sorted by stable style identity before the existing oracle consumes it so parallel completion order cannot alter generation hashes or row behavior.

### F4. File watching is an invalid correctness authority and is not materially Rust-specific

The current indexer protects correctness by checking size, mtime, and ctime before and after each read, and by requiring a second observation before tombstoning a missing style. `notify` offers native cross-platform watchers and debouncing companions, but its own documentation warns that network filesystems may emit no events, editor save behavior varies, and large directories can lose events. A watcher can only debounce and enqueue a later canonical scan; it cannot replace hint recomputation, stable reads, or missing-item confirmation. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:224-270] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:919-943] [SOURCE: https://docs.rs/notify/latest/notify/]

Because equivalent event APIs exist in the Node host and the authoritative rescan remains JavaScript-owned, adding a Rust watcher creates process and packaging cost without a Rust-resident compute advantage. Reconsider only for a persistent daemon that already hosts local inference and can coalesce high-rate event bursts; even then, periodic reconciliation remains mandatory.

### F5. Content-addressed embedding reuse already exists; a Rust cache is justified only if it crosses process or database boundaries

The schema keys `embedding_cache` by semantic retrieval hash and immutable profile identity, and CSS/source-only changes intentionally leave the retrieval hash unchanged. The drain consults this cache before calling the embedder and can rebuild a profile's projection from cached vectors. Reimplementing that cache in Rust would be a like-for-like ownership transfer, not a new capability. [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:188-229] [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:15-23] [SOURCE: .opencode/skills/sk-design/styles/_db/vectors.mjs:206-281] [SOURCE: .opencode/skills/sk-design/styles/_db/vectors.mjs:316-368]

A separate Rust content-addressed store becomes additive only if a local model worker serves multiple databases or tools and safely reuses model files, tokenized inputs, or vectors under a contract binding model digest, tokenizer digest, normalization version, dimensions, and platform/runtime compatibility. That cross-system cache belongs with the later shared-core question, not the styles-only first phase.

## Questions Answered

- **Which indexing and embedding automations become materially better with Rust?** Local batched model inference can add offline/private and reproducible embeddings while amortizing model residency. Parallel bundle verification is conditional on a cold-build stage profile. File watching and a styles-local content-addressed cache do not clear the materiality gate.
- **What ownership boundary preserves current behavior?** Rust may return deterministic parsed projections or embedding batches. JavaScript retains discovery policy, queue claims, retries, supersession, SQLite writes, generation publication, feature flags, and lexical fallback.
- **What should be adopted now?** No production Rust component yet. First publish an embedding profile and benchmark per-stage cold builds and vector drains; prototype local inference only if offline/privacy, provider cost, or measured drain latency establishes materiality.

## Questions Remaining

- Which visual and multimodal analysis features are practical, and which can share the same resident local-model worker?
- Is a shared Rust inference/search core worth cross-system contract and release coordination?
- What production arrival, facet-selectivity, cold-build stage, and embedding-drain measurements clear the staged gates?
- Can an external vector index or shared cache be atomically bound to the current generation pointer without a new manifest contract?
- Which complete opportunity set clears residency, materiality, and scale gates at current, 10x, and 100x scale?

## Ruled Out Directions

- Porting the complete indexer to Rust: SQLite and JavaScript already own deliberate lifecycle and atomic-publication contracts.
- Treating metadata-hint scans as full-content hashing: unchanged bundles avoid canonical reads and hashes.
- Parallel SQLite writes during publication: the current single transaction is a correctness boundary, not incidental serialization.
- Using filesystem events as correctness evidence: watcher backends can omit, duplicate, or reshape events.
- Reimplementing the styles-local embedding cache: the current retrieval-hash/profile cache already supplies semantic reuse.

## Assessment

- **newInfoRatio:** 0.72
- **Novelty justification:** This iteration located the exact Rust residency boundary, identified local batched inference as the only clear new capability, and converted hashing, watching, and caching ideas into measured conditional gates or ruled-out ownership transfers.
- **Confidence:** High on current queue, cache, hashing, publication, and watcher semantics; medium on local-inference materiality because no active profile, model choice, drain trace, or packaging benchmark exists.

## Next Focus

Evaluate screenshot palette and spacing extraction, perceptual hashes, layout fingerprints, and multimodal embeddings, including whether they can reuse the same optional resident local-model worker.
