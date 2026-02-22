# Research: libsql Fit Against Current 139 Hybrid-RAG-Fusion Features

Date: 2026-02-22  
Scope: evaluate whether our **current local libsql snapshot** can improve recently delivered `139-hybrid-rag-fusion` behavior, with strict evidence from local code/docs and external recency checks.

## Executive summary

The current 139 stack is a mature, SQLite-first architecture built around synchronous `better-sqlite3`, `sqlite-vec`, FTS5, in-memory BM25, deterministic hybrid fallback, and transaction-wrapped recovery/checkpoint controls. Evidence is strong that quality and reliability gates were closed in `006` on 2026-02-22.  
Evidence: `.opencode/specs/003-system-spec-kit/139-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/spec.md:23`, `.opencode/specs/003-system-spec-kit/139-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/tasks.md:188`, `.opencode/specs/003-system-spec-kit/139-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/implementation-summary.md:27`

Local libsql snapshot confirms workspace `0.9.29` and `libsql-server 0.24.33`, with sqld replication, transactional consistency guarantees, and HTTP v2 stateful stream semantics available in docs/source.  
Evidence: `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/Cargo.toml:28`, `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/libsql-server/Cargo.toml:3`, `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/USER_GUIDE.md:25`, `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/CONSISTENCY_MODEL.md:13`, `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/HTTP_V2_SPEC.md:14`

Decision posture:
- **NOW**: do local-first adapter spikes (file-backed `@libsql/client`) for parity and risk retirement.
- **NEXT**: test embedded-replica sync + PITR guardrails on non-critical paths.
- **NOT-NOW**: full remote cutover of retrieval/session-critical flows until async/stateful protocol and consistency guardrails are proven.

## What changed recently in 139 (feature baseline)

### 006 hardening baseline (most recent)

Recent 139 closure (`006`) expanded to ten subsystems and explicitly retained SQLite-first architecture while hardening retrieval/fusion, graph contracts, cognitive scoring, session-learning, CRUD re-embedding, parser/index invariants, storage reliability, telemetry governance, and runbook automation.  
Evidence: `.opencode/specs/003-system-spec-kit/139-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/spec.md:23`, `.opencode/specs/003-system-spec-kit/139-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/spec.md:27`, `.opencode/specs/003-system-spec-kit/139-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/spec.md:63`

All P0 tasks were closed, with performance/recovery/automation gates and bug sweeps completed, and one P2 memory-save task intentionally deferred.  
Evidence: `.opencode/specs/003-system-spec-kit/139-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/tasks.md:188`, `.opencode/specs/003-system-spec-kit/139-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/tasks.md:161`

### 005 and 004 carry-forward behavior

`005-auto-detected-session-bug` finalized deterministic session selection and low-confidence-safe behavior with regression coverage (`32 passed`).  
Evidence: `.opencode/specs/003-system-spec-kit/139-hybrid-rag-fusion/005-auto-detected-session-bug/implementation-summary.md:37`, `.opencode/specs/003-system-spec-kit/139-hybrid-rag-fusion/005-auto-detected-session-bug/implementation-summary.md:61`

`004-frontmatter-indexing` finalized normalization + migration idempotency + successful reindex (`STATUS=OK`), protecting parser/index invariants now expected by 006.  
Evidence: `.opencode/specs/003-system-spec-kit/139-hybrid-rag-fusion/004-frontmatter-indexing/implementation-summary.md:41`, `.opencode/specs/003-system-spec-kit/139-hybrid-rag-fusion/004-frontmatter-indexing/implementation-summary.md:43`, `.opencode/specs/003-system-spec-kit/139-hybrid-rag-fusion/004-frontmatter-indexing/implementation-summary.md:67`

## Local libsql snapshot (what version/capabilities we actually have)

### Version reality (local snapshot)

- Workspace package version: `0.9.29`
- `libsql-server` package version: `0.24.33`
- Workspace includes `libsql`, `libsql-hrana`, replication, server, bindings.

Evidence: `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/Cargo.toml:3`, `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/Cargo.toml:28`, `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/libsql-server/Cargo.toml:2`, `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/libsql-server/Cargo.toml:3`

### Capability snapshot (local docs)

- sqld supports primary/replica topology: writes delegated to primary; reads on replicas; WAL polling over gRPC.
- Consistency model: serializable transactions; primary linearizability; replicas can lag; monotonic reads on replicas.
- HTTP v2 is stateful via baton, serialized request stream, optional sticky `base_url`.
- HTTP v1 endpoint is stateless batch transaction, forbids interactive transaction statements.
- Incremental snapshots are supported and must be applied sequentially per log.

Evidence: `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/USER_GUIDE.md:34`, `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/CONSISTENCY_MODEL.md:9`, `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/CONSISTENCY_MODEL.md:13`, `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/HTTP_V2_SPEC.md:14`, `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/http_api.md:49`, `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/USER_GUIDE.md:235`

### Current runtime coupling (today)

Current server runtime is tightly coupled to synchronous `better-sqlite3` + `sqlite-vec` + local SQL primitives:

- Dependencies: `better-sqlite3`, `sqlite-vec`; no `@libsql/client` currently in MCP server package.
- Hybrid search and vector modules assume local sync DB handles.
- Runtime explicitly falls back when `sqlite-vec` is unavailable.
- Checkpoint restore safety is transaction-wrapped and local-table-centric.

Evidence: `.opencode/skill/system-spec-kit/mcp_server/package.json:36`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:408`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1169`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1174`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:308`

## Capability mapping matrix (139 feature -> libsql fit now)

| 139 baseline feature | Local current implementation evidence | libsql improvement potential | Classification |
|---|---|---|---|
| Retrieval/fusion deterministic fallback | Hybrid RRF + fallback chain; vector/FTS/BM25 pipeline | Native vector datatypes/indexing can reduce extension fragility; still needs query/path adapter | **Adapter required** |
| Graph/causal channel contracts | Graph channel + metrics are app-layer logic | DB change gives little direct benefit; mostly unchanged | **Not a fit (directly)** |
| Cognitive FSRS/decay scoring | FSRS and decay are app-side scoring + SQL expressions | Minimal direct DB value beyond transaction/scalability envelope | **Not a fit (directly)** |
| Session manager + session-learning hardening | Session dedup/boost/routing are handler/service logic | No direct libsql feature replacement | **Not a fit (directly)** |
| Memory CRUD re-embedding consistency | Pending/partial embedding states + fallback indices | Batch/transaction APIs can harden mutation bundles and retries | **Adapter required** |
| Parser/index invariants + index health | Frontmatter/index invariants already enforced | Mostly app/test logic; minor operational gains only | **Not a fit (directly)** |
| Storage reliability + ledger consistency | Transaction recovery + mutation/checkpoint safeguards | PITR + replication provide additional recovery layers | **Improve now (guarded)** |
| Telemetry/trace schema governance | Telemetry/docs drift controls in app tooling | DB migration alone does not improve this materially | **Not a fit (directly)** |
| Deferred/skipped-path test hardening | Extensive regression closure already done | Indirect benefit only via new integration tests | **Not a fit (directly)** |
| Self-healing runbooks and ops drills | Runbook automation and failure-class drills in place | PITR + embedded replica sync can strengthen operational recovery playbooks | **Adapter required** |
| 004 frontmatter indexing idempotency | Migration + idempotent dry-run + reindex validated | Better remote/local sync path possible, but not automatic | **Adapter required** |
| 005 auto-detected session safety | Session selection confidence safeguards | DB choice does not solve session classifier quality | **Not a fit (directly)** |

Evidence anchors:
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:626`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:703`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1038`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:450`
- `.opencode/specs/003-system-spec-kit/139-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/spec.md:117`
- `.opencode/specs/003-system-spec-kit/139-hybrid-rag-fusion/004-frontmatter-indexing/implementation-summary.md:66`
- `.opencode/specs/003-system-spec-kit/139-hybrid-rag-fusion/005-auto-detected-session-bug/implementation-summary.md:37`

## Specific improvements we can do with libsql

### Local-first path (no immediate remote cutover)

1. Introduce `@libsql/client` in file-backed mode (`file:` URL) behind a DB adapter for a small, isolated flow (not whole runtime).  
External evidence: TypeScript reference supports local file URL and local auth token is optional.
2. Run parity experiment replacing one vector query path with libsql native vector types/functions/index (`FLOAT32`, `vector_distance_cos`, `libsql_vector_idx`, `vector_top_k`).  
3. Keep existing BM25/FTS behavior initially; only swap vector substrate first to limit blast radius.
4. Validate transaction parity using batch and interactive transaction APIs for mutation bundles.

Evidence:
- `.opencode/skill/system-spec-kit/mcp_server/package.json:36`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:2109`
- https://docs.turso.tech/sdk/ts/reference
- https://docs.turso.tech/features/ai-and-embeddings

### Hybrid/remote path (controlled expansion)

1. Pilot embedded replicas (`syncUrl`, `sync()`, `syncInterval`) for read-heavy queries while pinning strict write/read-after-write flows to primary.
2. Add token/JWKS auth path for remote usage in non-local environments.
3. Add PITR-backed recovery drill mapping for checkpoint/restore incident playbooks.
4. Evaluate protocol choice per workload (`libsql://` websocket style vs HTTP) under measured latency.

Evidence:
- https://docs.turso.tech/sdk/ts/reference
- https://docs.turso.tech/sdk/authentication
- https://docs.turso.tech/features/point-in-time-recovery
- `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/CONSISTENCY_MODEL.md:13`

## Constraints, risks, and guardrails

### Consistency guardrails

- Primary is linearizable but replicas may lag; same-replica distinct processes can observe different points in time.  
Guardrail: session-critical reads and post-write validations must target primary or enforce explicit sync barrier.

Evidence: `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/CONSISTENCY_MODEL.md:13`

### Protocol statefulness guardrails

- HTTP v2 stream requires baton chaining and serialized requests; stream validity ends on protocol errors/idle closure.  
Guardrail: implement stream manager with baton lifecycle + idempotent retry strategy; avoid mixing old baton state.

Evidence: `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/HTTP_V2_SPEC.md:14`, `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/HTTP_V2_SPEC.md:24`, `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/HTTP_V2_SPEC.md:94`

### Transaction guardrails

- HTTP v1 is stateless and forbids interactive transaction statements; TypeScript SDK provides batch and interactive transactions but interactive writes can lock with timeout pressure.  
Guardrail: default to bounded batch transactions for routine mutations; reserve interactive for narrowly scoped workflows.

Evidence: `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/http_api.md:49`, `https://docs.turso.tech/sdk/ts/reference`

### Restore-safety guardrails

- Current checkpoint restore relies on local transactional DELETE/INSERT rollback semantics and schema validation.  
Guardrail: keep local transactional restore path until remote PITR drills and rollback semantics are validated end-to-end.

Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:293`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:313`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:450`, `https://docs.turso.tech/features/point-in-time-recovery`

## Recommended phased experiments (short, concrete)

### Phase 0 (1 day): Adapter spike
- Build minimal DB adapter interface for one read path.
- Acceptance: same top-10 IDs and ordering tolerance vs current path.

### Phase 1 (2-3 days): Vector parity on local-first libsql client
- Reproduce one `vector_search` + fallback flow using libsql-native vector index.
- Acceptance: no regression in deterministic fallback behavior under missing embeddings.

### Phase 2 (2 days): Mutation and restore safety parity
- Compare current checkpoint + transaction safety behavior against libsql batch/transaction path.
- Acceptance: failure-injection tests preserve rollback guarantees.

### Phase 3 (2-3 days): Embedded replica consistency pilot
- Enable `syncUrl`/manual sync in staging for read-only workloads.
- Acceptance: no session misroute increase; staleness envelope documented and bounded.

### Phase 4 (1-2 days): PITR drill integration
- Run operator recovery drill using PITR playbook.
- Acceptance: reproducible restore point selection, explicit RTO/RPO evidence.

## Clear decision posture (now/next/not-now)

### NOW
- Approve local-first adapter + vector parity spikes (Phases 0-2).
- Keep existing SQLite-first runtime as control.

### NEXT
- Pilot embedded replicas + PITR drills for read-heavy and ops-recovery paths (Phases 3-4).

### NOT-NOW
- Full replacement of synchronous `better-sqlite3` runtime core across all search/session modules.
- Full remote-only critical path for session/routing until baton/consistency/restore guardrails are proven.

## UNKNOWN register

UNKNOWN: Exact one-to-one equivalence between current `better-sqlite3` pragmas/trigger behavior and `@libsql/client` local-file mode is not yet proven in this codebase.

UNKNOWN: Whether all existing checkpoint/restore semantics (including working-memory restore edge cases) can be preserved on a remote-first path without interim local transactional fallback.

## Recency checks (external/official + observed package facts)

### Official doc links checked

- https://docs.turso.tech/sdk/ts/reference
- https://docs.turso.tech/features/ai-and-embeddings
- https://docs.turso.tech/features/sqlite-extensions
- https://docs.turso.tech/sdk/authentication
- https://docs.turso.tech/features/point-in-time-recovery
- https://docs.turso.tech/

### Observed package recency facts (as requested)

- `@libsql/client` latest observed: `0.17.0`, modified/published date observed: `2026-01-07`.
- crates `libsql` max/newest observed: `0.9.29`, updated/published date observed: `2025-11-17`.

Direct verification note (2026-02-22):
- `npm view @libsql/client version time --json` -> version `0.17.0`, modified `2026-01-07T09:25:15.765Z`
- `curl -s https://crates.io/api/v1/crates/libsql | jq '.crate.max_version, .crate.newest_version, .crate.updated_at'` -> `0.9.29`, `0.9.29`, `2025-11-17T15:16:05.441868Z`

## Source index (local evidence + external links)

### Local evidence files

- `.opencode/specs/003-system-spec-kit/139-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/spec.md`
- `.opencode/specs/003-system-spec-kit/139-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/tasks.md`
- `.opencode/specs/003-system-spec-kit/139-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/implementation-summary.md`
- `.opencode/specs/003-system-spec-kit/139-hybrid-rag-fusion/005-auto-detected-session-bug/implementation-summary.md`
- `.opencode/specs/003-system-spec-kit/139-hybrid-rag-fusion/004-frontmatter-indexing/implementation-summary.md`
- `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/Cargo.toml`
- `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/libsql-server/Cargo.toml`
- `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/README.md`
- `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/USER_GUIDE.md`
- `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/CONSISTENCY_MODEL.md`
- `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/HTTP_V2_SPEC.md`
- `.opencode/specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/http_api.md`
- `.opencode/skill/system-spec-kit/mcp_server/package.json`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts`

### External links

- https://docs.turso.tech/sdk/ts/reference
- https://docs.turso.tech/features/ai-and-embeddings
- https://docs.turso.tech/features/sqlite-extensions
- https://docs.turso.tech/sdk/authentication
- https://docs.turso.tech/features/point-in-time-recovery
- https://docs.turso.tech/
- https://www.npmjs.com/package/@libsql/client
- https://crates.io/crates/libsql
- https://crates.io/api/v1/crates/libsql
