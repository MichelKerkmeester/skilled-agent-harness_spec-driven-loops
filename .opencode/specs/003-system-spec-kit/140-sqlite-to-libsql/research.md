---
title: "Deep Technical Research: LibSQL Hybrid-RAG Fit [140-sqlite-to-libsql/research]"
description: "Determine whether LibSQL materially improves the current feature set and increases compatibility/possibility for a hybrid RAG fusion database, given the current System Spec Kit ..."
trigger_phrases:
  - "deep"
  - "technical"
  - "research"
  - "libsql"
  - "hybrid"
  - "140"
  - "sqlite"
importance_tier: "normal"
contextType: "research"
---
# Deep Technical Research: LibSQL Hybrid-RAG Fit

## 1. Metadata
- Spec folder: `specs/003-system-spec-kit/140-sqlite-to-libsql`
- Task: Deep technical research for LibSQL fit vs current hybrid retrieval architecture
- Date: 2026-02-21
- Scope: Research and analysis only (no runtime code changes)
- Recommendation status: **CONDITIONAL GO** (adapter-first), **NO-GO** for immediate direct cutover

## 2. Objective
Determine whether LibSQL materially improves the current feature set and increases compatibility/possibility for a hybrid RAG fusion database, given the current System Spec Kit MCP implementation.

## 3. Method
- Internal evidence: live code and skill docs under `.opencode/skill/system-spec-kit/mcp_server` and this spec folder context mirror.
- External evidence: primary vendor/official docs (`docs.turso.tech`, `github.com/tursodatabase/libsql`, `sqlite.org`).
- Comparison target: current architecture = vector + BM25 + FTS5 + skill graph + RRF fusion.

## 4. Current-State Assumptions (From Code)

### 4.1 Hybrid retrieval is multi-channel and RRF-fused
- Search subsystem is explicitly 4-channel (vector + BM25/FTS5 + graph + SGQS/skill graph) with RRF fusion and adaptive fusion. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:13`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:37`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:58`]
- Runtime code uses `fuseResultsMulti` (RRF), adaptive weighting, MMR, and graph channel integration in the hot path. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:8`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:490`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:503`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:507`]

### 4.2 Vector + lexical layers are SQLite-native today
- Storage driver is `better-sqlite3`; vectors use `sqlite-vec`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:15`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:16`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/package.json:36`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/package.json:37`]
- Schema creates `vec_memories USING vec0(...)` plus FTS5 table/triggers. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1602`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1622`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1630`]
- Vector query path depends on `vec_distance_cosine(...)`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:2118`]
- Lexical path uses in-memory BM25 plus FTS5 `bm25(memory_fts, ...)` weighting. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:223`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:90`]

### 4.3 Strong local-process assumptions exist
- DB is file-path resolved from local env and filesystem (`MEMORY_DB_PATH`, local dirs), with file permission changes and local PRAGMAs (`WAL`, `busy_timeout`, etc.). [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:285`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1152`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1184`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1197`]
- Transactions rely on synchronous `database.transaction(() => ...)` patterns in migrations, indexing, updates, deletes, and checkpoint restore. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1093`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1742`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1854`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:313`]
- DB refresh model uses a local file signal (`DB_UPDATED_FILE`) and module handle reinitialization. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:98`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:101`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:117`]

### 4.4 Skill graph and graph channel are partially DB-independent
- SGQS/skill graph retrieval is snapshot/cached from disk, merged with causal-edge SQL results in unified graph channel. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:313`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:318`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:369`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:371`]

## 5. External Capability Research (Primary Sources)

### 5.1 Replication and remote access model
- libSQL server (`sqld`) provides remote SQL over HTTP with primary/replica topology; replicas serve reads and forward writes to primary, polling WAL updates over gRPC. [SOURCE: `specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/USER_GUIDE.md:25`] [SOURCE: `specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/USER_GUIDE.md:34`] [SOURCE: `specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/USER_GUIDE.md:37`] [DOC: https://github.com/tursodatabase/libsql/blob/main/docs/USER_GUIDE.md]
- Turso connection/auth supports `libsql://`, `wss://`, and `https://`; docs explicitly recommend WebSockets for latency-sensitive/live cases and HTTP for stateless/serverless. [DOC: https://docs.turso.tech/sdk/authentication]

### 5.2 Embedded mode
- libSQL states continued SQLite file/API compatibility and embeddability as explicit compatibility goals. [SOURCE: `specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/README.md:126`] [SOURCE: `specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/README.md:128`] [DOC: https://github.com/tursodatabase/libsql/blob/main/README.md]
- Turso TypeScript SDK supports local file URLs and embedded-replica configuration (`syncUrl`, `syncInterval`, explicit `sync()`, `read_your_writes`). [DOC: https://docs.turso.tech/sdk/ts/reference]

### 5.3 Vector support / extension compatibility
- Turso supports native vectors with dedicated index (`vector_top_k`) and DiskANN ANN behavior (accuracy/speed tradeoff controls). [DOC: https://docs.turso.tech/features/ai-and-embeddings]
- Turso docs also list `sqlite-vec` as an extension option (plan/provider constrained), and list `fts5`/`json` among preloaded extensions. [DOC: https://docs.turso.tech/features/sqlite-extensions]

### 5.4 FTS5 and BM25
- SQLite FTS5 is built into official SQLite builds that include `SQLITE_ENABLE_FTS5`, with bm25 ranking support documented. [DOC: https://www.sqlite.org/fts5.html]
- This is compatible with current architecture intent (FTS5 + bm25 ranking), though query/dialect parity must still be tested on target deployment mode.

### 5.5 JSON support
- SQLite JSON1 is built into SQLite core as of 3.38.0 (opt-out compile flag). [DOC: https://www.sqlite.org/json1.html]
- Turso extension listing includes `json`, indicating expected availability in hosted environments. [DOC: https://docs.turso.tech/features/sqlite-extensions]

### 5.6 Transactional and consistency semantics
- SQLite transactions are ACID-like and provide serializable behavior by serializing writers. [DOC: https://www.sqlite.org/lang_transaction.html]
- libSQL consistency model (sqld doc): primary ops linearizable; process/connection read-your-writes is guaranteed; replicas may diverge across processes; no global ordering guarantee across instances. [SOURCE: `specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/CONSISTENCY_MODEL.md:13`] [SOURCE: `specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/CONSISTENCY_MODEL.md:17`] [DOC: https://github.com/tursodatabase/libsql/blob/main/docs/CONSISTENCY_MODEL.md]
- HTTP v2 protocol is baton-based and requires serialized per-stream request handling. [SOURCE: `specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/HTTP_V2_SPEC.md:14`] [SOURCE: `specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/HTTP_V2_SPEC.md:17`] [DOC: https://raw.githubusercontent.com/tursodatabase/libsql/main/docs/HTTP_V2_SPEC.md]
- Legacy stateless HTTP API executes each batch transactionally but forbids explicit interactive transaction statements in payloads. [SOURCE: `specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/http_api.md:47`] [SOURCE: `specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/http_api.md:49`] [DOC: https://github.com/tursodatabase/libsql/blob/main/docs/http_api.md]

### 5.7 Performance characteristics and ops model
- SQLite WAL mode is documented as often faster than rollback journaling and allows concurrent readers with one writer; however, WAL has caveats (same-host shared memory, not suitable over network filesystems). [DOC: https://www.sqlite.org/wal.html]
- Turso vector docs describe ANN indexing tradeoffs and native vector index path for higher-scale vector workloads. [DOC: https://docs.turso.tech/features/ai-and-embeddings]
- Turso SDK reference documents concurrency knobs and transaction behavior differences in remote contexts (e.g., write forwarding to primary; interactive transaction locking timeout concerns). [DOC: https://docs.turso.tech/sdk/ts/reference]

## 6. Fit-Gap Analysis Against Current Hybrid Architecture

| Current component | Current assumption | LibSQL fit | Migration impact |
|---|---|---|---|
| Vector retrieval (`vec0`, `vec_distance_cosine`) | `sqlite-vec` table/function SQL in-process [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1602`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:2118`] | **Partial**: native vectors exist; `sqlite-vec` may be plan/provider constrained [DOC: https://docs.turso.tech/features/ai-and-embeddings] [DOC: https://docs.turso.tech/features/sqlite-extensions] | **High** (capability profile + query rewrite/parity harness likely needed) |
| FTS5 + BM25 lexical | FTS virtual table/triggers + weighted bm25 SQL [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1622`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:90`] | **Good**: FTS5/json extensions available [DOC: https://docs.turso.tech/features/sqlite-extensions] | **Medium** (validation for ranking drift) |
| BM25 in-memory index | Rebuild from `memory_index` on startup [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:223`] | **Good** (backend-agnostic conceptually) | **Low-Medium** |
| Skill graph channel | SGQS snapshot from files + merged graph results [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:318`] | **Good** (mostly independent of DB engine) | **Low** |
| RRF/adaptive fusion | App-layer score fusion [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:503`] | **Good** (DB-agnostic) | **Low** |
| MMR embedding pull | Direct `SELECT ... FROM vec_memories` [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:520`] | **Uncertain/partial** depending on vector backend schema | **High** |
| Transaction semantics | heavy sync `database.transaction` closures [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1742`] | **Partial**: async client modes and different remote semantics [DOC: https://docs.turso.tech/sdk/ts/reference] | **High** |
| Ops/checkpoint safety | local transaction-wrapped restore, local DB handles [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:313`] | **Partial**: feasible conceptually, but remote consistency/protocol retries add risk | **High** |
| Local lifecycle controls | local paths/PRAGMA/chmod/reinit [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:285`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:101`] | **Weak for direct remote** | **High** |

## 7. Migration Feasibility

### 7.1 Feasible path
Feasible **only** via adapter-first migration, not direct driver swap.

Required minimum workstreams:
1. Introduce database/search capability abstraction (`sqlite_local` vs `libsql_local` vs `turso_hybrid`).
2. Decouple sync `better-sqlite3` transaction closures from retrieval/write pipeline.
3. Introduce vector capability profile (`sqlite_vec_sql`, `native_vector_index`) with parity tests.
4. Add consistency-aware read policy (primary-for-critical flows) and protocol retry/idempotency behavior.
5. Revalidate checkpoint/restore semantics under selected backend mode.

### 7.2 Non-feasible now (without redesign)
- Immediate drop-in replacement of `better-sqlite3` + `sqlite-vec` SQL surface while preserving all existing behavior.
- Immediate full remote cutover without retrieval parity harness and consistency policy.

## 8. Risk Register (Focused)

| Risk | Probability | Impact | Why | Mitigation |
|---|---:|---:|---|---|
| Vector parity drift | High | High | Current SQL path is `vec0`/`vec_distance_cosine` specific | Capability profile + benchmark gate before any write cutover |
| Consistency anomalies across processes/replicas | Medium | High | libSQL docs explicitly allow divergent replica observation across processes | Primary-read policy for correctness-sensitive reads |
| Protocol/state handling bugs | Medium | High | HTTP v2 baton serialization and stream invalidation semantics | Robust retry/idempotency + stream-state tests |
| Transaction model mismatch | High | High | Current code assumes synchronous transaction closures | Async transaction boundary redesign |
| Ops regression (checkpoint/restore) | Medium | High | Restore guarantees currently depend on local transactional control | Keep local authority until remote drills prove safe |

## 9. Decision Matrix

Scoring: 1 (worst) to 5 (best)

| Option | Feature gain | Compatibility now | Migration risk | Time-to-value | Total | Decision |
|---|---:|---:|---:|---:|---:|---|
| A. Keep current SQLite only | 2 | 5 | 5 | 5 | 17 | Stable baseline, but limited expansion |
| B. Adapter-first LibSQL enablement (local first, hybrid pilot later) | 4 | 3 | 3 | 3 | 13 | **Best strategic/operational balance** |
| C. Immediate full Turso/libSQL cutover | 5 | 1 | 1 | 1 | 8 | Not acceptable now |

## 10. Recommendation

### Final posture
- **Adoption now**: **CONDITIONAL GO**
- **Condition**: adopt LibSQL only through an adapter-first phase (no direct full cutover).
- **Immediate direct cutover to full remote/hybrid**: **NO-GO**.

### Why this is the hard recommendation
- LibSQL materially expands possibilities (remote access, replication, embedded replica/sync options, native vector path). [DOC: https://github.com/tursodatabase/libsql/blob/main/README.md] [DOC: https://docs.turso.tech/sdk/ts/reference] [DOC: https://docs.turso.tech/features/ai-and-embeddings]
- But current implementation is tightly coupled to synchronous local SQLite + `sqlite-vec` SQL details and local operational assumptions. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:15`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1602`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:520`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:101`]
- Therefore: strong strategic fit, weak immediate runtime portability.

## 11. GO / CONDITIONAL GO / NO-GO Criteria
- **GO**: Adapter boundary merged + vector parity gates met + consistency policy validated + restore drill pass criteria met.
- **CONDITIONAL GO (current)**: Start adapter-phase only, keep SQLite authoritative.
- **NO-GO**: Any plan to do immediate direct cutover without parity and consistency validation.

## 12. UNKNOWNs
- UNKNOWN: Exact parity behavior for current `sqlite-vec` SQL surface in chosen Turso plan/provider combination for production traffic profile.
- UNKNOWN: True latency/cost envelope for this project’s query mix under remote/hybrid mode.
- UNKNOWN: Which flows in this project must be strict-primary read after write (vs eventually consistent acceptable).

## 13. Source Index

### Internal
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts`
- `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skill/system-spec-kit/mcp_server/package.json`
- `specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/USER_GUIDE.md`
- `specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/CONSISTENCY_MODEL.md`
- `specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/HTTP_V2_SPEC.md`
- `specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/http_api.md`
- `specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/README.md`

### External primary docs
- https://github.com/tursodatabase/libsql/blob/main/README.md
- https://github.com/tursodatabase/libsql/blob/main/docs/USER_GUIDE.md
- https://github.com/tursodatabase/libsql/blob/main/docs/CONSISTENCY_MODEL.md
- https://raw.githubusercontent.com/tursodatabase/libsql/main/docs/HTTP_V2_SPEC.md
- https://github.com/tursodatabase/libsql/blob/main/docs/http_api.md
- https://docs.turso.tech/sdk/authentication
- https://docs.turso.tech/sdk/ts/reference
- https://docs.turso.tech/features/ai-and-embeddings
- https://docs.turso.tech/features/sqlite-extensions
- https://www.sqlite.org/fts5.html
- https://www.sqlite.org/json1.html
- https://www.sqlite.org/lang_transaction.html
- https://www.sqlite.org/wal.html
