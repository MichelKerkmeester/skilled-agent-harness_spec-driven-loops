---
title: "Deep Research: memory_index_scan UX hardening — toward a self-maintaining index"
description: "Evidence-backed design for making the spec-kit memory indexing subsystem (memory_index_scan + embedding pipeline) future-proof, foot-gun-proof, always-completing, degradation-tolerant, and self-healing. DESIGN research only — recommendations for a follow-on implementation packet."
trigger_phrases:
  - "memory index scan ux hardening research"
  - "memory_index_scan async scan job design"
  - "memory index self-healing orphan reconciliation"
  - "memory index E429 timeout design"
importance_tier: "important"
contextType: "research"
---

# Deep Research: `memory_index_scan` UX Hardening — Toward a Self-Maintaining Index

<!-- ANCHOR:deep-research-memory-index-scan-ux-hardening -->

## 1. Executive Summary

The spec-kit memory indexing subsystem has three observed failure classes, all surfaced this session: (1) `memory_index_scan` returns a raw `E429` to the caller when a second scan lands inside a hardcoded 30-second lease window; (2) a `force:true` scan on a large tree (~674 docs) blows the MCP request deadline (`-32001`) because discovery, indexing, and synchronous embedding all run inside one request; (3) renamed/renested spec folders leave orphan index rows (`File not found` on read) because stale cleanup is scoped only to the scanned set and identity is path-based with no move reconciliation.

Five deep-research iterations (one per design angle, cli-codex + cli-opencode `gpt-5.5`, all claims cited to `file:line`) converge on one architecture: **turn `memory_index_scan` into an idempotent, coalescing, phased async scan job that always commits lexical rows first, drains vectors in the background without ever failing the scan on embedder trouble, and self-heals moves/orphans behind a freshness/health surface.** The 30s cooldown stays — but becomes an internal worker-start guard, never a caller-visible error.

Critically, **almost every building block already exists**: the async/deferred embedding path (rows are BM25/FTS-searchable as `pending`), the `embedder_status` job model (jobId + progress + eta), the atomic claim-by-update concurrency primitive, batch/byte chunking, and two circuit breakers. The work is mostly composition and contract change, not new infrastructure.

## 2. Problem Statement

`memory_index_scan` couples three concerns inside a single synchronous MCP request under a global lease: scope discovery, per-file lexical indexing, and per-file vector embedding. That coupling produces a foot-gun (raw E429 on repeat calls), an unbounded-work timeout (large/forced scans), and — combined with path-based identity — orphan rows after folder moves. The goal: a scan that is **always safe to call, always completes regardless of corpus size, degrades gracefully when the embedder is slow/absent, and keeps the index self-correcting** with no manual intervention.

## 3. Research Questions (the five angles)

- **A1 — Scan lifecycle & caller contract:** is sync request/response right for a lease-holding, unbounded-work operation under a fixed deadline?
- **A2 — Unbounded-work / timeout hardening:** how does a full scan/re-embed always complete regardless of tree size?
- **A3 — Concurrency & multi-writer:** correct lease/coalescing semantics under N sessions/daemons/worktrees.
- **A4 — Embedder resilience & degraded-mode:** never fail a scan wholesale on embedder trouble.
- **A5 — Self-healing & observability:** close the orphan-row + freshness gap.

## 4. Methodology

Five convergence-gated iterations (max 5), executor `gpt-5.5` (iter 1 cli-codex reasoning xhigh; iters 2-5 cli-opencode variant high), one primary angle per iteration, each reading the actual `mcp_server/` source and citing `file:line`. Reducer refreshed registry/dashboard/strategy after each pass. DESIGN research only: read + analyze + recommend; no production code changed. newInfoRatio trend: 0.92 → 0.86 → 0.78 → 0.74 → 0.62 (monotonic decline; each angle genuinely new). Stop reason: max_iterations reached with all five angles answered.

## 5. Key Findings

### A1 — Caller contract (iteration 1, ratio 0.92)
- The scan reserves the lease inside the request and returns caller-visible `E429` with `waitSeconds` when blocked (`handlers/memory-index.ts:238`, `:245`); cooldown is hardcoded `30000` (`core/config.ts:126`), only batch size is env-tunable (`core/config.ts:116`).
- The lease already distinguishes two internal reasons — `lease_active` (`core/db-state.ts:443`) and `cooldown` (`core/db-state.ts:456`) — but the handler collapses both into one raw error. The data to return a job handle (active vs recent) already exists; the contract throws it away.
- The `embedder_status` job model is the reusable pattern: a job table with `id`/`total`/`processed`/`status`/`eta` (`lib/embedders/reindex.ts:78`), enqueue-without-awaiting + `startReindex` returns a job id immediately (`reindex.ts:592`), resumes on startup (`reindex.ts:658`), and a caller-friendly poll surface (`handlers/embedder-status.ts:117`).

### A2 — Timeout hardening (iteration 2, ratio 0.86)
- The whole request is bound: discovery (`memory-index.ts:273`), in-memory dedup (`:301`), incremental categorize only when `incremental && !force` (`:444`), then `await processBatches(...)` over the full set (`:476`) plus mtime/stale/causal/hooks before response. `BATCH_SIZE=5` limits concurrency, not total request work — so `force` on a big tree is structurally a timeout, not a tuning problem.
- Lexical-first is already implementable: async mode returns `status:'pending'` without calling the provider (`embedding-pipeline.ts:140`) and `indexMemoryDeferred` upserts `memory_index` with `embedding_status='pending'`, stores `content_text`, and the row is BM25/FTS5-searchable (`vector-index-mutations.ts:337`).
- **Key correctness catch:** vector drain must check provider/circuit state *before* the atomic pending→retry claim (`retry-manager.ts:303`), because retention only prunes `retry`/non-zero-retry-count rows (`retry-manager.ts:493-519`) — so a provider outage that claims clean `pending` rows into `retry` can make a large clean backlog eligible for pruning/failure.

### A3 — Concurrency & multi-writer (iteration 3, ratio 0.78)
- Lease is DB-global, transaction-backed, and **fail-open** on exceptions (`core/db-state.ts:420`, `:470`) — safe for liveness, best-effort under DB errors.
- The atomic claim-by-update (`retry-manager.ts:303`) is the proven single-writer primitive to reuse for scan work, not a new lock.
- SQLite WAL + busy_timeout (`core/db-init.ts:40`) protect row integrity but are coarse scheduling — coordination belongs at the job layer.
- Worktree-per-session ⇒ per-dir DB ⇒ independent lease domains (`shared/config.ts`); the contention case that matters is multiple clients on ONE shared DB. Stale/dead workers recovered via heartbeat/lease-steal after the ~60s expiry (`DEFAULT_SCAN_LEASE_EXPIRY_MS`).

### A4 — Embedder resilience & degraded-mode (iteration 4, ratio 0.74)
- Lexical commit has no hard embedder dependency **in async mode** (`embedding-pipeline.ts:140` → `vector-index-mutations.ts:337`); the scan currently runs SYNC (`memory-index.ts:489`, default `asyncEmbedding=false` `memory-save.ts:2700`) — so **flipping scan indexing to async mode is the single highest-leverage degraded-mode change**.
- Two independent circuit breakers over one provider — shared embeddings (`shared/embeddings.ts:49/59`, `SPECKIT_EMBEDDING_CB_COOLDOWN_MS`=60000) and retry-manager (`retry-manager.ts:386`, ~120s) — can double-penalize; compose into one provider-state + single backoff timestamp.
- Drain sizing: claim ≤50/tick (`reindex.ts:74`) and let the router chunk by `SPECKIT_EMBED_CLIENT_MAX_BATCH`=256 + byte budget (`execution-router.ts:39/194`) → peak RSS bounded to one batch + chunk.
- ENOSPC splits: cache/metadata write failure degrades vectors only (`embedding-cache.ts`); main-DB transaction failure is a hard per-file index failure (lexical durability point).

### A5 — Self-healing & observability (iteration 5, ratio 0.62)
- Stale cleanup is NOT raw-scoped to the scan folder: `categorizeFilesForIndexing` runs a global stale pass via `listStaleIndexedPaths(filePaths)` over all distinct indexed paths, excluding only the current scan's discovered set, checking both `file_path` and `canonical_file_path` on disk before marking a row stale (`incremental-index.ts:233-277`, `:280-327`). The real gap is reliability/UX, not total absence: it's gated to incremental + non-force scans, only runs when `results.failed === 0`, and only surfaces as `staleDeleted` (`memory-index.ts:373-380`, `:444-450`, `:600-608`). That gating is why the renested `031-embedding-stack-hardening/spec.md` orphan persisted.
- Vector cleanup is correct when it runs: stale main-row deletion uses `vectorIndex.deleteMemory()` → `delete_memory_from_database()`, which removes the active `vec_memories` row, ancillary/projection rows, BM25, and embedding-cache by content hash, then the `memory_index` row (`vector-index-mutations.ts:577-627`). Integrity mode auto-cleans vec rows whose rowid lost its main row (`vector-index-queries.ts:1391-1423`); file-row cleanup needs `autoClean && cleanFiles` (`:1440-1488`, wired in `memory-crud-health.ts:578-585`). ⇒ an orphan sweep must reuse `delete_memory_from_database()`, never raw-delete `memory_index`.
- No move reconciliation: rows are identified by `spec_folder`+canonical path+anchor, not packet identity (`vector-index-mutations.ts:232-256`, `:328-360`), so a `git mv` is add-new + delete-old (needless re-embed). Safe identity = **`graph-metadata.json.packet_id` + doc role/anchor** (both required schema fields, `graph-metadata-schema.ts:61-71`); content hash is confirmation only, never primary (copied/template-identical files collide). Strong-move rule requires a *unique* packet/doc-identity match with no competing live path.
- `memory_health`/`memory_stats`/`embedder_status`/retry-telemetry are fragmented; none answer "is my index fresh?" and the scan lease (`last_index_scan`/`scan_started_at`, `db-state.ts:384-405`) isn't surfaced. A debounced file-watcher with content-hash dedup already exists (`file-watcher.ts:365-447`), and search already emits `contentError:'File not found'` (`search-results.ts:923-943`) — the seam for lazy self-repair. The post-commit hook is code-graph-only today (`post-commit:1-43`).

## 6. Recommended Design — The Self-Maintaining Index

`memory_index_scan` becomes an **idempotent async scan job**:
1. **Coalescing contract (A1):** always returns a success envelope with `{jobId, scanKey, status, phase, progress, eta, coalesced, degraded, nextPollAfterMs}`. A 2nd call for the same `scanKey` (hash of normalized scope+options+DB identity) joins the in-flight/recent job (`coalesced:true`); the 30s cooldown becomes an internal worker-start guard, never a raw E429. Poll via a `memory_index_scan_status({jobId})` surface mirroring `embedder_status`.
2. **Phased execution (A2):** Phase 1 bounded walk (manifest by mtime+hash) → Phase 2 commit-lexical (rows `pending`, BM25/FTS-searchable immediately, per-tick cap) → Phase 3 async vector drain. Request returns after Phase 1-2; phase boundary = `phase:'lexical_complete'`, `status:'complete_with_pending_vectors'`. Eliminates the `-32001` class structurally.
3. **Single-writer correctness (A3):** global serialization of lexical workers per DB + atomic claim-by-update for file/vector work items; heartbeat + lease-epoch recovery for stale workers; per-worktree DBs are independent domains.
4. **Degradation tolerance (A4):** run scan indexing in **async mode** so lexical always commits; vector drain checks the (composed) provider/circuit state before claiming, leaving clean rows `pending` (never burning retry budget) during outages; `degraded` + `nextVectorAttemptAfter` surfaced; main-DB ENOSPC is the only hard per-file failure.
5. **Self-healing (A5):** a bounded `orphan_sweep` job phase (paged by id/`updated_at`, per-tick cap, reusing `delete_memory_from_database()` — never a raw delete) runs on every completed scan regardless of force/scope, plus a `move_reconcile` phase that matches vanished→new path by **`packet_id` + doc role/anchor** (content hash as confirmation only, unique-match guard) and updates the row's path fields in place (preserving id, vector rowid, embedding, history); `memory_health` gains an `index` block with a single `summary` enum (`healthy_fresh` / `healthy_lagging_vectors` / `stale_needs_scan` / `degraded_needs_repair` / `unavailable`) + counts (on-disk delta, orphan files/vectors/chunks, pending/retry/failed vectors, last-scan age, active scan/embedder jobs); triggers = lazy reconcile-on-`File not found`-search (enqueues a bounded verify job, never mutates in result formatting) + daemon file-watcher routed into the A1 queue + a lightweight post-commit *stale marker* (not a full scan), all feeding the A1 coalescer.

**Through-line:** the index becomes eventually-consistent and self-correcting — lexical search always available, vectors converging in the background, moves and orphans healed automatically.

## 7. Comparison of Alternatives (A1 contract)
| Option | Fixes E429 | Fixes timeout | Idempotent | Migration cost | Verdict |
|---|---|---|---|---|---|
| Current sync + lease + cooldown | ✗ | ✗ | ✗ | none | rejected (preserves both failures) |
| Pure async job (no coalescing) | partial | ✓ | ✗ (dup work / lease fights) | high | rejected as primary |
| **Async job + scanKey coalescing** | ✓ | ✓ | ✓ | moderate (additive) | **recommended** |
| Streaming-first progress | ✗ alone | ✗ alone | ✗ alone | high (transport-dep) | optional enhancement layer only |

## 8. Risks & Tradeoffs
- **Complexity:** a scan-job state machine + coalescing + resume is real complexity, but maps onto the existing embedder-job model. Mitigate by the minimal-slice path (§10).
- **Latency:** callers get fast ack + poll instead of one blocking call; `nextPollAfterMs` makes polling mechanical.
- **Move-reconciliation false positives:** require a *unique* packet_id/content-hash match before updating a path in place; otherwise fall back to delete+add.
- **Trigger thrash:** auto-reindex triggers must feed the coalescing scanKey so rapid commits collapse onto one job.
- **Migration safety:** keep the current completed-response fields wrapped inside job metadata (additive), so existing callers degrade gracefully.

## 9. Open Questions (for implementation planning, not research)
- New `index_scan_jobs` / `index_scan_work_items` tables vs reusing the embedder job table with a type discriminator.
- Exact `memory_health` freshness field names + the single `fresh|stale|degraded` rule.
- Orphan-sweep frequency (maintenance cadence vs on-demand) and inactive-shard vector GC scope.
- Whether `INDEX_SCAN_COOLDOWN` should become env-tunable once it's internal-only (likely unnecessary if coalescing is correct).

## 10. Recommended Next Steps — Minimal First Slice
Highest UX/hardening per unit effort, independent of the full async-job refactor:
1. **Caller-contract coalescing** — a 2nd `memory_index_scan` returns the in-flight/recent job instead of E429 (reuses the existing lease data; kills the foot-gun with the least code).
2. **Global orphan sweep + freshness counts in `memory_health`** — directly fixes the observed orphan rows and makes index health visible.
Then: the phased async scan job (A2) + async-mode indexing (A4) as slice 2; move reconciliation (A5) as slice 3. Route via `/speckit:plan` against this packet.

## 11. Evidence & Citations
All current-behavior claims cite `file:line` in the per-iteration narratives (`research/iterations/iteration-001.md` … `iteration-005.md`) and structured deltas (`research/deltas/iter-001.jsonl` … `iter-005.jsonl`). Primary sources: `mcp_server/handlers/memory-index.ts`, `core/db-state.ts`, `core/config.ts`, `core/db-init.ts`, `lib/embedders/reindex.ts`, `lib/embedders/execution-router.ts`, `handlers/embedder-status.ts`, `handlers/save/embedding-pipeline.ts`, `handlers/save/create-record.ts`, `lib/search/vector-index-mutations.ts`, `lib/providers/retry-manager.ts`, `shared/embeddings.ts`, `lib/cache/embedding-cache.ts`, `handlers/memory-crud-health.js`, `shared/config.ts`, `.opencode/scripts/git-hooks/`.

## 12. Ruled-Out Directions
- **Current sync + cooldown as the contract** — preserves both observed failure classes.
- **Streaming progress as the primary contract** — transport/client-dependent; does not by itself give idempotency or resume; keep only as an optional layer over the job model.
- **Pure async without coalescing** — fixes deadlines but lets repeated callers enqueue duplicate work / fight the lease.
- **Lowering `BATCH_SIZE` to fix timeouts** — reduces concurrency, not total request-bound work; does not address the structural cause.

## 13. Cross-Angle Synthesis
A1 (coalescing contract) removes the foot-gun; A2 (phased job) removes the deadline; A3 (single-writer + scope-keyed coalescing) keeps concurrency correct; A4 (async-mode + outage-safe drain) makes the embedder non-blocking; A5 (orphan sweep + move reconciliation + freshness surface + triggers) keeps it correct over time. Together: **one eventually-consistent, self-maintaining index** where lexical search is always available and vectors + correctness converge in the background.

## 14. Glossary
- **scanKey** — stable hash of normalized scope + options + DB identity; the coalescing key.
- **coalesce** — a new call joins an in-flight/recent job instead of starting duplicate work or erroring.
- **lexical-complete / complete_with_pending_vectors** — success state where rows are FTS/BM25-searchable but vectors still draining.
- **claim-by-update** — atomic single-statement status transition that gives single-writer semantics without a separate lock.
- **degraded** — caller-facing flag: indexed + searchable now, vectors lagging due to provider trouble, will retry at `nextVectorAttemptAfter`.

## 15. Appendix — Iteration Index
| Iter | Angle | Executor | newInfoRatio | Status |
|---|---|---|---|---|
| 1 | A1 scan lifecycle & caller contract | cli-codex gpt-5.5 xhigh | 0.92 | complete |
| 2 | A2 unbounded-work / timeout hardening | cli-opencode gpt-5.5 high | 0.86 | insight |
| 3 | A3 concurrency & multi-writer | cli-opencode gpt-5.5 high | 0.78 | insight |
| 4 | A4 embedder resilience & degraded-mode | cli-opencode gpt-5.5 high | 0.74 | insight |
| 5 | A5 self-healing & observability + synthesis | cli-opencode gpt-5.5 high | 0.62 | insight |

## 16. References
- Per-iteration narratives + deltas under `research/iterations/` and `research/deltas/`.
- Strategy + dashboard: `research/deep-research-strategy.md`, `research/deep-research-dashboard.md`.
- Related shipped work (context, not re-litigated): `011-embedding-stack-hardening` (embedding stack), `014-infra-memory-db-and-graph-churn` (daemon lifecycle / FTS healing).

## 17. Convergence Report
- **Stop reason:** maxIterationsReached (all five angles answered)
- **Total iterations:** 5 / 5
- **Questions answered:** 5 / 5 (A1-A5)
- **newInfoRatio trend:** 0.92 → 0.86 → 0.78 → 0.74 → 0.62 (monotonic decline; healthy progression, no stuck signal)
- **Convergence threshold:** 0.05 (not crossed — capped by max iterations, which is expected for a 5-angle/5-iteration design loop where each iteration opens a new angle)
- **Outcome:** A complete, evidence-backed design with a minimal first implementation slice, ready for `/speckit:plan`.

<!-- /ANCHOR:deep-research-memory-index-scan-ux-hardening -->
