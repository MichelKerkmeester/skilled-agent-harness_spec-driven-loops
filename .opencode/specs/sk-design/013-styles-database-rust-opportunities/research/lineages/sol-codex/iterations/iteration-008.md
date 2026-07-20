# Iteration 8: Caches, Vector Representation, and Determinism

## Focus

Separate useful storage/cache evolution from proposals that merely port already deterministic TypeScript kernels.

## Findings

1. Content addressing is already fundamental to indexing. The implementation uses length-framed SHA-256 aggregate hashes, metadata hint hashes, crawl-record hashes, deterministic generation hashes, separate retrieval hashes, and profile-scoped vector job identities. Rewriting those functions in Rust would not add a cache capability. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:58-83,181-221,682-740] [SOURCE: .opencode/skills/sk-design/styles/_db/vectors.mjs:31-119]
2. A net-new shared artifact cache could key model weights, tokenizer files, decoded/preprocessed screenshots, text/image embeddings, and future ANN snapshots by exact bytes plus the full execution profile. This improves offline reuse and cross-system deduplication, but Rust is not necessary: TypeScript can own manifests and atomic publication while native hash/model libraries perform heavy work. Rust becomes useful only when the cache is co-owned by a justified native inference core. [INFERENCE: current hash/profile machinery and cross-system boundary]
3. Vector representation is a more concrete improvement than a Rust ranking port. Current vectors are stored as JSON, transferred from SQLite, parsed in JavaScript, normalized during every cosine comparison, and sorted across the eligible set. Typed binary blobs, pre-normalized vectors, or extension-owned vector columns can reduce parsing/copying and redundant norm work; existing SQLite extensions or Node buffers can implement this without custom Rust. [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:218-249] [SOURCE: .opencode/skills/sk-design/styles/_db/vectors.mjs:14-23]
4. Scalar/product quantization and memory-mapped ANN snapshots are growth optimizations, not present-day needs. They trade accuracy, migration complexity, platform compatibility, and rebuild logic for smaller/faster indexes. At 1,290 vectors the existing full scan is too small to justify them absent measured latency or memory pressure; multimodal region vectors or 10x–100x corpus growth can reopen the gate. [INFERENCE: current 1,290-vector residency decomposition]
5. Deterministic ranking is already explicit: FTS5 ends on `style_id`, vector scores end on `id`, and weighted RRF ends on `id`. Moving cosine or RRF to Rust adds a boundary around tiny arithmetic and creates floating-point and serialization parity work. It fails current materiality and scale gates. [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:200-215,218-283]
6. The repository standard makes that parity cost strict: every migrated behavior must be byte-for-byte identical to the pinned TypeScript oracle, numeric operations must be preserved independently, and every observable sort needs a complete unique tie-break. An approximate ANN result cannot claim byte parity with an exact oracle for arbitrary queries; it needs a separately versioned feature contract, recall/ordering fixtures, exact re-score, and a flag-controlled exact fallback. [SOURCE: .opencode/skills/sk-code/code-opencode/references/rust/quality-standards/determinism-and-parity.md:27-118]
7. Gate verdict: keep hashing, RRF, tie-breaks, and exact cosine in TypeScript today. Prioritize binary/in-database vector representation only as part of an extension spike, and build a shared content-addressed artifact cache only when local inference creates large immutable artifacts worth sharing. Rust is optional for both and should not be the acceptance criterion. [INFERENCE: value/necessity comparison]

## Ruled Out

- Rust port of current content-hash functions.
- Standalone deterministic RRF/cosine crate.
- Quantization at current scale without a measured memory/latency problem.
- Claiming exact byte parity for arbitrary ANN output.
- A cache service before local models or multiple consumers exist.

## Dead Ends

- “Deterministic” is a correctness property, not evidence that a workload belongs in Rust.

## Edge Cases

- Ambiguous input: content-addressed cache can refer to source artifacts, model artifacts, embeddings, or index snapshots; each needs a separate identity schema.
- Contradictory evidence: binary vectors reduce JS parse work, but an existing SQLite extension may remove that work with no Rust code.
- Missing dependencies: vector dimension/profile distribution, measured parse/cosine latency, and model artifact sizes.
- Partial success: add cache/profile identity tests independently of native implementation.

## Sources Consulted

- `.opencode/skills/sk-design/styles/_db/indexer.mjs`
- `.opencode/skills/sk-design/styles/_db/vectors.mjs`
- `.opencode/skills/sk-design/styles/_db/retrieval.mjs`
- `.opencode/skills/sk-code/code-opencode/references/rust/quality-standards/determinism-and-parity.md`
- `.opencode/skills/sk-code/code-opencode/references/rust/quick-reference/overview-and-boundary-template.md`

## Assessment

- New information ratio: 0.55
- Questions addressed: caches and deterministic ranking
- Questions answered: caches and deterministic ranking

## Reflection

- What worked and why: reading the hash and ordering code converted broad cache/determinism ideas into specific already-shipped versus net-new parts.
- What did not work and why: no profiler trace quantifies JSON parse or norm recomputation.
- What I would do differently: add stage-level timing and vector-byte counters before selecting a representation.

## Recommended Next Focus

Define the pure-core/thin-adapter/TypeScript-shell architecture and parity gates for the opportunities that remain credible.
