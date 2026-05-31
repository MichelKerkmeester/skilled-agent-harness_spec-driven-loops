---
title: "Decision Record: memory_index_scan self-maintaining index [system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/decision-record]"
description: "Architecture decisions for the memory_index_scan implementation: the coalescing async job contract, lexical-first async-mode indexing, and packet-identity move reconciliation — each with alternatives, consequences, and a five-lens check."
trigger_phrases:
  - "memory index scan implementation decisions"
  - "013 memory index ADR"
  - "memory index coalescing contract decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation"
    last_updated_at: "2026-05-31T15:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored ADRs for the implementation design"
    next_safe_action: "Implement Phase 1 per ADR-001"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Decision Record: memory_index_scan Self-Maintaining Index

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Coalescing async scan-job contract (not sync + caller-visible cooldown)

<!-- ANCHOR:adr-001-context -->
### Context
`memory_index_scan` reserves a global lease inside the request and returns a raw `E429` when a second call lands inside the hardcoded 30s window (`handlers/memory-index.ts:245-260`, `core/config.ts:126`). The lease already distinguishes `lease_active` (`db-state.ts:443`) from `cooldown` (`:456`) but the handler collapses both into one error. This is the session's observed foot-gun.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision
Make `memory_index_scan` return a success envelope that joins the in-flight/recent job (`coalesced:true`), keyed by a stable `scanKey` (normalized scope + options + DB identity). The 30s cooldown becomes an internal worker-start guard, never a caller error. Reuse the `embedder_status` job model (jobId/progress/eta) for the poll surface.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered
- **Keep sync + cooldown** — rejected: preserves both the E429 foot-gun and the timeout class (research.md §7).
- **Pure async job without coalescing** — rejected as primary: fixes deadlines but lets repeat callers enqueue duplicate work / fight the lease.
- **Streaming-first progress** — optional enhancement only; transport-dependent, no idempotency by itself.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences
- (+) Repeat/concurrent scans are always safe; the foot-gun disappears with the least code.
- (+) Additive: existing completed-response fields wrap inside job metadata; current callers degrade gracefully.
- (−) Callers must poll (`nextPollAfterMs`) instead of one blocking call — mechanical, documented.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five-Lens Check
- **Clarity:** envelope is simpler to reason about than a thrown rate-limit.
- **Systems:** reuses lease + embedder-job primitives; no new lock.
- **Bias:** fixes the real observed failure, not a hypothetical.
- **Sustainability:** one job model for scans + embeds.
- **Scope:** Phase 1 only; no embedding-pipeline change required.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation Notes
Phase 1, tasks P1.1-P1.2. Touch `handlers/memory-index.ts` (envelope) + read lease reason from `core/db-state.ts`. No schema change required for the minimal coalescing (reuse lease state).
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Lexical-first async-mode indexing (defer vectors, never block the scan)

<!-- ANCHOR:adr-002-context -->
### Context
The scan runs embedding synchronously (`memory-index.ts:489`, default `asyncEmbedding=false`) over the full discovered set under one MCP deadline, so a `force` scan on a large tree blows `-32001`. Async mode already exists: it returns `status:'pending'` without calling the provider (`embedding-pipeline.ts:140`) and `indexMemoryDeferred` makes rows BM25/FTS-searchable immediately (`vector-index-mutations.ts:337`).
<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-decision -->
### Decision
Flip scan indexing to async mode and split the job into bounded walk → commit-lexical (rows `pending`, per-tick cap) → async vector drain. The request returns at `lexical_complete` / `complete_with_pending_vectors`. The vector drain checks composed provider/circuit state BEFORE the atomic pending→retry claim (`retry-manager.ts:303`).
<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered
- **Lower `BATCH_SIZE`** — rejected: reduces concurrency, not total request-bound work; doesn't address the structural cause (research.md §12).
- **Keep sync, raise the MCP deadline** — rejected: unbounded corpus always re-finds the ceiling.
<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-consequences -->
### Consequences
- (+) Eliminates the `-32001` class structurally; lexical search always available.
- (+) Provider outages never fail a scan; clean `pending` rows are never burned into prunable `retry` (`:493-519`).
- (−) Vectors are eventually-consistent — surfaced via `degraded` + `nextVectorAttemptAfter`.
<!-- /ANCHOR:adr-002-consequences -->

<!-- ANCHOR:adr-002-five-checks -->
### Five-Lens Check
- **Clarity:** explicit phase states beat an opaque blocking call.
- **Systems:** composes the two circuit breakers into one provider-state.
- **Bias:** targets the measured timeout, not a guess.
- **Sustainability:** bounded per-tick work caps peak RSS.
- **Scope:** Phase 2; gated behind Phase 1.
<!-- /ANCHOR:adr-002-five-checks -->

<!-- ANCHOR:adr-002-impl -->
### Implementation Notes
Phase 2, tasks P2.1-P2.5. Touch `handlers/memory-index.ts`, `handlers/save/embedding-pipeline.ts`; reuse `retry-manager.ts` claim + `reindex.ts` job model.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Move identity = packet_id + doc role/anchor (not path, not content hash alone)

<!-- ANCHOR:adr-003-context -->
### Context
Rows are identified by `spec_folder` + canonical path + anchor (`vector-index-mutations.ts:232-256`), so a `git mv` is delete-old + add-new (orphan + needless re-embed). Stale cleanup is gated to incremental + non-force + zero-failure scans (`memory-index.ts:373-380`,`:600-608`), which is why the renested orphan persisted this session.
<!-- /ANCHOR:adr-003-context -->

<!-- ANCHOR:adr-003-decision -->
### Decision
Detect a path move by matching vanished→new on `graph-metadata.json.packet_id` (`graph-metadata-schema.ts:61-71`) + doc role/anchor, with a unique-match guard (no competing live path); content hash is confirmation only. On a strong match, update the row's path fields in place (preserve id, vector rowid, embedding, history); otherwise fall back to delete+add. Run a bounded orphan sweep on every completed scan, ungated from scope, via `delete_memory_from_database()`.
<!-- /ANCHOR:adr-003-decision -->

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered
- **Content hash as primary identity** — rejected: copied/template-identical files collide (false-positive merges).
- **Keep path identity + manual rescans** — rejected: the status-quo orphan foot-gun.
<!-- /ANCHOR:adr-003-alternatives -->

<!-- ANCHOR:adr-003-consequences -->
### Consequences
- (+) Renests heal automatically without re-embedding; orphans removed regardless of who scanned.
- (+) `memory_health.index` makes freshness visible.
- (−) Requires `packet_id` present in `graph-metadata.json` (already a required schema field).
<!-- /ANCHOR:adr-003-consequences -->

<!-- ANCHOR:adr-003-five-checks -->
### Five-Lens Check
- **Clarity:** identity by stable packet id is more intuitive than path.
- **Systems:** reuses `delete_memory_from_database()` (vec + BM25 + cache + main row).
- **Bias:** closes the exact orphan this session hit.
- **Sustainability:** self-healing index needs no manual scans.
- **Scope:** Phase 3 (move) + Phase 1 (sweep).
<!-- /ANCHOR:adr-003-five-checks -->

<!-- ANCHOR:adr-003-impl -->
### Implementation Notes
Phase 1 sweep (P1.4-P1.5) + Phase 3 move reconcile (P3.3). Touch `lib/search/incremental-index.ts`, `lib/search/vector-index-mutations.ts`; read `packet_id` from `graph-metadata.json`.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
