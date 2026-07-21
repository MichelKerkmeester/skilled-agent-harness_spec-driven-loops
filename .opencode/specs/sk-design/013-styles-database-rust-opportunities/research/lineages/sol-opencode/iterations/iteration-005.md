# Iteration 5: Shared Rust Inference and Search Core

## Focus

Determine whether sk-design, system-code-graph, and Spec Kit Memory share enough inference or search semantics to justify a common Rust core, release train, and ownership contract.

## Actions Taken

1. Read the externalized state, reducer-owned strategy, prior indexing/embedding findings, and iteration-output contract.
2. Compared each subsystem's declared purpose, persistence boundary, ranking path, embedding profile, and publication lifecycle.
3. Traced Spec Kit Memory's existing shared embedder contract, resident local-model server, batched inference path, vector-shard reindex, and atomic active-profile swap.
4. Examined repository isolation gates and Rust interop rules to identify the coordination cost of a cross-skill native artifact.

## Findings

### F1. system-code-graph is not a current consumer candidate, so there is no three-system search-core opportunity

`system-code-graph` explicitly implements structural AST indexing rather than embedding-based semantic search. Its documented query surface is calls, imports, containment, symbols, and blast radius; concept search is routed elsewhere. It owns a skill-local SQLite database and single-writer scan loop so graph algorithms can evolve independently of workflow and memory state. [SOURCE: .opencode/skills/system-code-graph/SKILL.md:16-26] [SOURCE: .opencode/skills/system-code-graph/SKILL.md:49-53] [SOURCE: .opencode/skills/system-code-graph/references/runtime/ownership-boundary.md:55-77] [SOURCE: .opencode/skills/system-code-graph/references/config/database-path-policy.md:79-99]

This is enforced rather than aspirational: CI rejects production imports from `system-code-graph` into `system-spec-kit`, including `@spec-kit/*` aliases. Adding a shared inference/search dependency for a capability code-graph does not ship would reverse the settled isolation boundary and create release coordination without a resident workload. [SOURCE: .github/workflows/isolation-check.yml:43-65] [SOURCE: .github/workflows/isolation-check.yml:110-114] [SOURCE: .opencode/skills/system-code-graph/references/runtime/ownership-boundary.md:89-107]

### F2. Spec Kit Memory already supplies the reusable inference plane that a first Rust proposal would duplicate

Spec Kit's shared embedding package already owns provider selection, immutable manifest identity, dimensions, query/document prefixes, local-first fallback, and a batch adapter returning ordered `Float32Array` vectors. The provider interface exposes batch inference, warmup, health, metadata, p50/p95 latency, and queue depth. [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/README.md:15-25] [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/adapter.ts:18-71] [SOURCE: .opencode/skills/system-spec-kit/shared/types.ts:53-89]

Its `hf-local` path is already a long-lived model-server client: it posts multiple prepared inputs in one request, checks row count and dimension, normalizes results, retries readiness failures, and preserves input order. Therefore "resident local model plus true batching" is not a missing cross-repository primitive; Rust must beat this measured service on a declared model, host, startup/RSS, throughput, and packaging gate rather than merely reproduce it. [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:900-948] [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:963-1015]

### F3. sk-design and Spec Kit Memory can share an inference ABI, but not profile ownership or storage

The common seam is narrow: `embed_batch(profile fingerprint, input kind, ordered texts) -> ordered vectors plus typed diagnostics`. Both systems require model identity, dimensions, query/document distinction, and deterministic row order. The styles queue currently accepts a per-job embedder callback and then independently owns claims, retries, supersession, cache lookup, dimension enforcement, SQLite publication, and vector-projection revisions. [SOURCE: .opencode/skills/sk-design/styles/_db/vectors.mjs:129-228] [SOURCE: .opencode/skills/sk-design/styles/_db/vectors.mjs:229-313] [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/types.ts:22-75]

The ABI must not own profile pointers, cache keys, queues, or writes. Styles keys semantic reuse by `(retrieval_hash, profile_id)` and binds vectors to an immutable corpus-generation lifecycle, while Spec Memory derives profile-specific shard paths and owns active-embedder selection. The existing embedding package itself states that storage and retrieval remain caller-owned. [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:188-229] [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:6-23] [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/README.md:117-136]

### F4. Search is policy-heavy and materially incompatible across the two vector consumers

Styles applies hard eligibility and provenance filters before ranking, computes exact cosine only over eligible style vectors, then fuses structured, FTS5, and vector ranks with versioned weighted RRF. Its cursor binds corpus generation, fusion profile, candidate K, vector revision, and final key. [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:200-249] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:252-283] [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:52-62]

Spec Memory instead selects an active dimension-tagged vec0 table, guards active model aliases and embedding status, scopes by spec folder and governance fields, and benchmarks scalar cosine joins against SQLite `MATCH` KNN with a 20% adoption threshold. Its reindex stages a complete shard, atomically renames it, and flips active profile/status in a separate completion transaction. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-queries.ts:77-112] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-queries.ts:135-180] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-queries.ts:193-240] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/embedders/reindex.ts:586-669] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/embedders/reindex.ts:720-757]

A shared search API would either leak both storage schemas and policy matrices into Rust or collapse them into a lowest-common-denominator nearest-neighbor call. The latter is only a numeric kernel and does not justify shared release ownership until both consumers choose the same ANN algorithm and measurements show it dominates end-to-end latency.

### F5. The coordination gate is two proven consumers of one transport-neutral kernel, not three named systems

Repository Rust standards require TypeScript to retain MCP schemas, daemon/CLI wiring, feature flags, fallback selection, public routing, and compatibility orchestration; Rust receives only measured kernels behind narrow adapters. [SOURCE: .opencode/skills/sk-code/code-opencode/references/rust/style-guide/interop-model.md:33-52]

Accordingly, no shared Rust search core clears today's residency or materiality gates. A phased path is: (1) let styles call the existing provider-neutral batch contract through an adapter or sidecar and collect comparable traces; (2) add a Rust inference backend only if it beats the current resident `hf-local` path or enables a required model/runtime unavailable there; (3) keep independent caches, indexes, generations, and ranking; and (4) extract a neutral versioned native artifact only after two production consumers pass identical golden vectors and justify coordinated ABI/artifact releases. `system-code-graph` remains outside unless a separately approved semantic-code-search product changes its scope.

## Questions Answered

- **Is a shared Rust inference/search core worth cross-system contract and release coordination?** No for search and no across all three systems today. A narrow inference backend may eventually be shared by sk-design and Spec Memory, but only after an existing-contract baseline proves Rust adds model support, privacy, throughput, memory, or packaging value.
- **What remains shared versus local?** Only model execution and transport-neutral vector validation are plausible shared kernels. Text construction, profile activation, cache identity, queues, storage, generation publication, filters, fusion, cursors, telemetry, and fallback remain TypeScript-owned per subsystem.
- **What is the adoption gate?** Two real consumers, one identical profile/normalization contract, golden-vector parity, and measured superiority over the existing resident batched local service. A third system's name is not evidence of shared residency.

## Questions Remaining

- Which screenshot palette, spacing, perceptual-hash, layout-fingerprint, and multimodal-embedding features are practical, and which can reuse the existing resident model-service shape?
- Can an external ANN index be atomically bound to the styles generation pointer without a new manifest contract?
- What measured arrival, selectivity, cold-build, embedding-drain, and end-to-end query values clear phased adoption at current, 10x, and 100x scale?
- Which complete opportunity set clears residency, materiality, and scale gates today versus conditionally?

## Ruled Out Directions

- A three-system Rust search platform: code-graph intentionally has no semantic-vector workload and is CI-isolated.
- Moving subsystem ranking and filtering into one core: styles and Spec Memory have different policy, storage, publication, and fallback contracts.
- Treating a resident batched Rust model worker as automatically novel: Spec Memory already ships a resident batched local-model service.
- Sharing vector caches or active-profile pointers: cache identity and publication correctness are subsystem-local.
- Creating a native release train before two consumers prove the same kernel contract: this front-loads ABI and artifact coordination without measured value.

## Assessment

- **newInfoRatio:** 0.68
- **Novelty justification:** This iteration removed system-code-graph from the assumed shared workload, found an existing resident batch-inference plane in Spec Kit Memory, and narrowed any viable cross-system Rust work to a two-consumer inference ABI with explicit evidence gates.
- **Confidence:** High on current ownership, isolation, inference, storage, and ranking contracts; medium on future Rust inference materiality because no cross-consumer benchmark or required unsupported model exists.

## Next Focus

Evaluate practical visual and multimodal analysis features, especially whether screenshot palette/spacing extraction, perceptual hashes, layout fingerprints, and multimodal embeddings can reuse the existing resident model-service shape without coupling their storage or ranking policies.
