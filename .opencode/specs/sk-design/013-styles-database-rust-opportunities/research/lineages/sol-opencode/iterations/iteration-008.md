# Iteration 8: Incremental Corpus Automation and Reindex Triggers

## Focus

Assess content-addressed caches, incremental hashing, parallel streaming corpus indexing, and a Rust file watcher for automatic reindex, locating the actual JavaScript-resident work and defining correctness, publication, alternative, and scale gates.

## Actions Taken

1. Read the externalized state, reducer-owned strategy, configuration, prior iteration, and iteration output contract.
2. Traced discovery, metadata hints, canonical hashing, parsing, SQLite commit, vector caching, immutable generation publication, and operator entry points in the styles database.
3. Measured the current corpus footprint and a read-only full SHA-256 pass over admitted artifacts on the reference host.
4. Compared Node filesystem watching and Chokidar normalization with Rust `notify`, and inspected BLAKE3's incremental, mmap, and Rayon capabilities.

## Findings

### F1. Incremental hashing and content-addressed reuse already exist, but full immutable builds cannot reuse parsed projections

The indexer stores a metadata hint over path, size, mtime, and ctime, then canonically verifies candidates with SHA-256 over raw artifact bytes. It separately identities aggregate bundle content, semantic retrieval content, crawl records, corpus generations, and embedding cache entries. This is already an incremental and content-addressed design; a Rust replacement would duplicate correctness machinery rather than add it. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:181-221] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:224-303] [SOURCE: .opencode/skills/sk-design/styles/_db/vectors.mjs:197-216]

The actual reuse gap is between immutable full builds. `operator build` creates a fresh staging database, and `buildStyleDatabase()` forces `verifyAll: true`; because the staging database has no prior index state, every bundle is read, hashed, parsed, and reinserted even when its aggregate hash is unchanged from the published generation. [SOURCE: .opencode/skills/sk-design/styles/_db/operator.mjs:124-133] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:1051-1072]

A new feature could be a detached projection cache keyed by the existing SHA-256 aggregate hash plus schema/parser version. Cached entries may contain parsed retrieval documents, derived facets, and normalized child rows, but must be treated as rebuildable acceleration: verify raw bytes against the aggregate identity, validate the cache schema, and let TypeScript's existing transaction and generation pointer remain authoritative. This feature is useful independent of Rust; Rust is only a candidate producer/decoder if measurement shows that parallel verification and parsing dominate cold builds.

### F2. Hashing is already native; changing SHA-256 to BLAKE3 would change identity without clearing a current materiality gate

JavaScript calls `node:crypto`, so SHA-256 computation is native rather than JavaScript arithmetic. On the declared host, the current styles tree is about 135 MiB, contains 1,290 canonical bundles and 7,740 admitted artifacts, and a read-only SHA-256 pass over those artifacts completed in 1.188 seconds. That makes hashing alone too small to justify a Rust package and ABI at current scale. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:5-15] [SOURCE: command `du -sk styles`; `rg --files ... | shasum -a 256`, 2026-07-20]

The Rust BLAKE3 implementation supports streaming, mmap, and optional Rayon parallelism, but adopting it as the canonical key would invalidate the current hash contract, generation names, persisted state, tests, and parity oracle. [SOURCE: https://docs.rs/blake3/latest/blake3/] Keep SHA-256 as the durable cross-language identity. A faster hash may be benchmarked only as a non-authoritative candidate hint or inside a versioned new cache, and only if full verification is measured as a material share of the cold-build critical path.

### F3. The parallelizable seam is pre-transaction bundle verification and parsing, not SQLite publication

Current discovery processes slugs serially: hint collection, symlink containment checks, stable before/after stats, file reads, SHA-256, JSON parsing, Markdown normalization, and derived-document construction all occur before `BEGIN IMMEDIATE`. The subsequent normalized-row replacement, FTS synchronization, relationship resolution, missing-style quarantine, generation insertion, and pointer advance are intentionally serialized in one transaction. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:657-721] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:809-980]

The safe optimization is a bounded worker pool that emits deterministic, slug-sorted verified bundle records into the existing TypeScript commit path. Streaming should mean bounded in-flight bundles and early buffer release, not streaming partial records into SQLite before whole-corpus duplicate-ID and consistency checks. Node promises or worker threads are the mandatory baseline because file I/O and crypto are already native; a Rust sidecar/addon clears the gate only when a representative replay shows material end-to-end improvement after IPC, serialization, package, and fallback costs.

At current scale, no Rust gate clears. At 10x, benchmark only if cold-build telemetry shows VERIFY plus PARSE_VALIDATE consumes a dominant share of a missed build SLO. At 100x, the present footprint projects linearly to roughly 1.35 GiB and 77,400 admitted artifacts, making bounded parallel precompute plausible, but adoption still requires an end-to-end win, bounded RSS/open files, byte-for-byte SHA-256 identity, deterministic parsed output, and exact database/oracle parity. Corpus count alone is not sufficient.

### F4. Neither Rust `notify` nor Node watchers are correctness authorities; Chokidar already supplies the needed automation baseline

Node documents platform-dependent `fs.watch` behavior. Chokidar normalizes raw events, supports atomic-write coalescing and `awaitWriteFinish`, and may use polling for network or non-standard filesystems. Rust `notify` exposes native and polling backends but documents the same fundamental limitations: network filesystems may emit no events, editor save patterns differ, large directories can lose events, and platform watch limits apply. [SOURCE: https://nodejs.org/api/fs.html#fswatchfilename-options-listener] [SOURCE: https://github.com/paulmillr/chokidar] [SOURCE: https://docs.rs/notify/latest/notify/]

Therefore a watcher can only debounce and coalesce dirty slugs before requesting the canonical rescan. Startup, overflow/error, periodic reconciliation, and suspicious delete/rename sequences must still run authoritative discovery; the existing two-observation quarantine/tombstone rule must remain intact. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:917-944] Chokidar is the lower-cost baseline because it integrates directly with the TypeScript operator and already handles common atomic/chunked-write behavior. A Rust watcher is justified only as part of an independently warranted resident Rust worker, or after measured watcher-scale/resource failures that Chokidar plus reconciliation cannot meet; it does not add correctness by itself.

### F5. Atomic publication value comes from extending one manifest, not from a shared cache or watcher

The current durable cutover syncs an immutable SQLite generation file, then atomically renames a pointer containing only `schemaVersion`, `generationHash`, and `databaseFile`. Readers bind to that database generation. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:1014-1048] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:1093-1125]

A detached parse cache needs no publication coupling because it is disposable build input. In contrast, any query-serving external ANN index or screenshot-derived feature artifact must be listed in a versioned generation manifest with its file basename, content digest, profile/schema identity, and owning corpus generation; otherwise the pointer rename cannot atomically bind those files to SQLite. The current pointer contract cannot safely publish such external query artifacts unchanged. This reinforces the boundary: caches and watcher queues remain non-authoritative, while every query-visible projection must join the single atomic generation manifest.

## Questions Answered

- **Which indexing automations materially benefit from Rust today?** None at current scale. Only bounded pre-transaction verification/parsing is a plausible Rust seam, and it remains benchmark-gated behind Node concurrency alternatives.
- **Is a new content-addressed cache useful?** A cross-generation parsed-projection cache is a real missing capability; the embedding cache and incremental hash identities already exist. The new cache is language-neutral and disposable.
- **Does a Rust watcher improve correctness?** No. Rust and Node consume fallible platform event streams. Use Chokidar first, and treat events only as hints that schedule canonical rescans.
- **Where must atomicity remain?** TypeScript-owned SQLite commit and generation publication. External query-visible artifacts require a versioned multi-artifact manifest; caches do not.
- **What is the scale gate?** Instrument per-stage cold builds first. Consider Rust only after VERIFY/PARSE dominates a missed SLO and a representative prototype materially improves end-to-end time with bounded resources and exact parity.

## Questions Remaining

- What are measured DISCOVER, VERIFY, PARSE_VALIDATE, COMMIT, VECTOR_DRAIN, and PUBLISH p50/p95 times for no-op, one-bundle, and cold full builds?
- What build-latency SLO and minimum end-to-end improvement define materiality on the reference host?
- What exact versioned generation-manifest schema atomically binds SQLite, screenshot features, and an external ANN projection?
- Which complete opportunity set clears residency, materiality, and scale gates after the final evidence iterations?

## Ruled Out Directions

- Replacing existing content identities and embedding cache with a Rust cache: the capability already exists.
- Replacing canonical SHA-256 with BLAKE3 for an unmeasured speed claim: this changes persisted identity and parity contracts.
- Parallel SQLite publication: the transaction is the correctness boundary; parallelism belongs before it.
- Treating any watcher as deletion or freshness authority: all available backends can miss, merge, reshape, or delay events.
- Shipping a standalone Rust watcher at current scale: Chokidar plus authoritative reconciliation supplies the automation without a new binary lifecycle.

## Assessment

- **newInfoRatio:** 0.71
- **Novelty justification:** This iteration found the cross-generation parsed-projection cache as the real missing capability, measured current hashing cost, isolated the safe bounded pre-transaction worker seam, and proved that watcher correctness and external-artifact publication are separate contracts.
- **Confidence:** High on repository residency, publication boundaries, and watcher limitations; medium on 10x/100x materiality because stage telemetry and representative cold-build replays do not yet exist.

## Next Focus

Define the versioned multi-artifact generation manifest and benchmark matrix that can atomically bind SQLite, screenshot-derived features, and a conditional external ANN index while measuring each cold-build stage.
