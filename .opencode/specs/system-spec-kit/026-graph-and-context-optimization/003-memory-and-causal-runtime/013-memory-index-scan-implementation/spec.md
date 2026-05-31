---
title: "Feature Specification: memory_index_scan self-maintaining index implementation [system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/spec]"
description: "Implement the full 5-angle self-maintaining index design from the 012 deep-research packet: idempotent coalescing async scan job, phased lexical-first execution, single-writer concurrency, degraded-mode embedding, and self-healing orphan/move reconciliation behind a memory_health.index freshness surface."
trigger_phrases:
  - "memory index scan implementation"
  - "memory_index_scan async scan job implementation"
  - "memory index coalescing E429 fix"
  - "memory_health index freshness surface"
  - "memory index orphan sweep move reconciliation"
  - "017 memory index implementation packet"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation"
    last_updated_at: "2026-05-31T15:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-3 spec for full 5-angle implementation"
    next_safe_action: "Dispatch Phase 1 (coalescing + health + orphan sweep) via cli-opencode"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/core/db-state.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Feature Specification: memory_index_scan Self-Maintaining Index Implementation

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress (Phase 1 starting) |
| **Created** | 2026-05-31 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (003-memory-and-causal-runtime) |
| **Research Source** | `../012-memory-index-scan-ux-hardening/research/research.md` (17 sections, file:line-cited) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`memory_index_scan` couples scope discovery, lexical indexing, and synchronous vector embedding inside one MCP request under a global lease. That coupling produces three observed, reproduced-this-session failure classes:

1. **Raw `E429` foot-gun** — a second scan inside the hardcoded 30s lease window returns a caller-visible rate-limit error (`handlers/memory-index.ts:245-260`), even though the lease already distinguishes the two internal reasons `lease_active` (`core/db-state.ts:443`) and `cooldown` (`core/db-state.ts:456`).
2. **`-32001` request-deadline timeout** — a `force:true` scan on a large tree (~674 docs) re-embeds everything synchronously inside one MCP request (`memory-index.ts:476`), structurally exceeding the deadline; `BATCH_SIZE=5` (`core/config.ts:117`) caps concurrency, not total request work.
3. **Orphan index rows after moves** — stale cleanup is gated to incremental + non-force + zero-failure scans (`memory-index.ts:373-380`, `:600-608`) and identity is path-based with no move reconciliation, so a renested folder leaves `File not found` rows.

### Purpose
Implement the **self-maintaining index** design that the 012 deep-research packet converged on (research.md §6): `memory_index_scan` becomes an **idempotent, coalescing, phased async scan job** that always commits lexical rows first, drains vectors in the background without ever failing the scan on embedder trouble, and self-heals moves/orphans behind a `memory_health.index` freshness surface. The 30s cooldown stays but becomes an internal worker-start guard, never a caller-visible error. Almost every building block already exists (async/deferred embedding path, `embedder_status` job model, atomic claim-by-update, batch chunking, two circuit breakers) — the work is mostly composition and contract change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
The full 5-angle design, delivered in three gated phases:
- **Phase 1 (A1 + A5-partial):** coalescing caller contract (2nd scan joins the in-flight/recent job instead of raw E429) + `memory_health.index` freshness block + bounded global orphan sweep reusing `delete_memory_from_database()`.
- **Phase 2 (A2 + A4):** phased execution (bounded walk → commit-lexical `pending` → async vector drain) + async-mode scan indexing so lexical always commits; outage-safe drain that checks provider/circuit state before the atomic pending→retry claim.
- **Phase 3 (A3 + A5-move):** job-layer single-writer via atomic claim-by-update work items + heartbeat/lease-epoch recovery; move reconciliation keyed on `packet_id` + doc role/anchor; auto-reindex triggers (lazy reconcile-on-`File not found`, watcher→queue, post-commit stale marker) feeding the coalescer.

### Out of Scope
- Switching the active embedder provider or redesigning vector-shard storage architecture (explicitly out per research.md §3).
- Making `INDEX_SCAN_COOLDOWN` env-tunable (research.md §9 — likely unnecessary once coalescing is correct).
- Any change to spec-folder *content* or unrelated MCP handlers.

### Files to Change
| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `mcp_server/handlers/memory-index.ts` | Modify | 1,2 | Coalescing envelope instead of raw E429; phased execution + async-mode indexing |
| `mcp_server/core/db-state.ts` | Modify | 1,3 | Surface lease reason as coalescable job state; heartbeat/lease-epoch recovery |
| `mcp_server/handlers/memory-crud-health.ts` | Modify | 1 | Add `index` freshness block (summary enum + counts) |
| `mcp_server/lib/search/incremental-index.ts` | Modify | 1 | Bounded global orphan sweep (ungated from scan scope) |
| `mcp_server/lib/search/vector-index-mutations.ts` | Reuse | 1,3 | Orphan delete via `delete_memory_from_database()`; move-path update in place |
| `mcp_server/handlers/save/embedding-pipeline.ts` | Modify | 2 | Async-mode scan indexing path |
| `mcp_server/lib/providers/retry-manager.ts` | Reuse | 2,3 | Provider/circuit pre-check before pending→retry claim; claim-by-update |
| `mcp_server/lib/embedders/reindex.ts` | Reuse | 2,3 | Job model pattern for scan job |
| `013-.../{spec,plan,tasks,checklist,decision-record,implementation-summary}.md`, `description.json`, `graph-metadata.json` | Create | this | Packet docs + metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
- **R1 (A1):** A scan MUST never surface a raw `E429`. A second concurrent/repeat call returns a success envelope joining the in-flight/recent job (`coalesced:true`); the 30s cooldown becomes an internal thrash-guard.
- **R2 (A2):** A scan/re-embed MUST always complete regardless of corpus size — no `-32001` request-deadline class. Lexical rows commit first (BM25/FTS-searchable as `pending`); vectors drain async after the request returns.
- **R6 (gate):** Every phase passes `tsc` build + the spec-kit test suite before the next phase is dispatched; no phase claims completion without stack-appropriate verification.

### P1 - Required (complete OR user-approved deferral)
- **R3 (A3):** Concurrent callers coordinate without index corruption, duplicate embedding work, or a raw error (single-writer via atomic claim-by-update; per-worktree DBs independent domains).
- **R4 (A4):** Embedder slowness/absence degrades to "indexed + searchable, vectors pending" (`degraded` + `nextVectorAttemptAfter`), never a wholesale scan failure; clean `pending` rows are never burned into `retry` during an outage.
- **R5 (A5):** Moves/renames and orphaned rows self-heal without manual scans, behind a `memory_health.index` freshness summary; orphan delete reuses `delete_memory_from_database()` (never a raw `memory_index` delete).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC1:** Two back-to-back `memory_index_scan` calls both return success (the second `coalesced:true`), with zero raw `E429` observed.
- **SC2:** A `force` scan on the 026 root returns within the MCP deadline (lexical committed) with `status:'complete_with_pending_vectors'`; vectors converge in the background.
- **SC3:** `memory_health` returns an `index` block with a single `summary` enum (`healthy_fresh` / `healthy_lagging_vectors` / `stale_needs_scan` / `degraded_needs_repair` / `unavailable`) and counts (on-disk delta, orphan/pending/retry/failed, last-scan age).
- **SC4:** A renested spec folder no longer leaves `File not found` orphan rows after the next completed scan (sweep ungated from scope); a `git mv`'d folder updates its row path in place without re-embedding (move reconciliation).
- **SC5:** Each phase passes `tsc` + tests; no production regression in existing memory search/save behavior (additive contract — existing completed-response fields wrapped in job metadata).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Severity | Mitigation |
|------|----------|------------|
| Build-while-live: daemon (7 procs) running during edits to its own source | High | Edit source only; do not restart/rebuild the live daemon mid-phase; verify with isolated `tsc`; coordinate restart as a discrete step |
| RM-8 destructive cli-opencode dispatch (precedent: 44 files deleted) | High | Clean recovery baseline commit recorded; BANNED OPS (no move/delete/create outside scope); disjoint file scope per phase; agent does NO git writes; SIGKILL between dispatches |
| Move-reconciliation false positives (copied/template-identical files) | Medium | Require a *unique* `packet_id` + doc role/anchor match with no competing live path; content hash is confirmation only; else fall back to delete+add |
| Outage converts clean `pending` backlog into prunable `retry` rows | Medium | Vector drain checks provider/circuit state BEFORE the atomic pending→retry claim (`retry-manager.ts:303`); retention only prunes `retry` (`:493-519`) |
| Auto-reindex trigger thrash | Medium | All triggers feed the coalescing `scanKey`; rapid commits collapse onto one job |
| Comment-hygiene HARD BLOCK | Process | No ADR/REQ/task-id/spec-path labels in code comments; durable WHY only |

### Dependencies
- Existing building blocks: `embedder_status` job model (`lib/embedders/reindex.ts`), `pending`/`retry` embeddingStatus (`retry-manager.ts`), atomic claim-by-update (`retry-manager.ts:303`), deferred lexical upsert (`vector-index-mutations.ts:337`), `delete_memory_from_database()` (`vector-index-mutations.ts:577-627`).
- cli-opencode `openai/gpt-5.5 --variant high` executor (per `cli-opencode/SKILL.md`).
- Canonical design source: `../012-memory-index-scan-ux-hardening/research/research.md`.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Q1 (Phase 2/3): new `index_scan_jobs` / `index_scan_work_items` tables vs reusing the embedder job table with a type discriminator (research.md §9). **Resolved at Phase 2 plan** — default to reuse-with-discriminator to minimize migration surface; revisit if the job semantics diverge.
- Q2 (Phase 1): exact `memory_health.index` field names — fixed by this spec's SC3 enum; counts derive from existing `memory_stats` / `embedder_status` / retry telemetry.
- Q3 (Phase 3): orphan-sweep cadence (every completed scan vs maintenance interval) — default to "every completed scan, bounded per-tick" per research.md §6.5.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Canonical research synthesis**: `../012-memory-index-scan-ux-hardening/research/research.md` (17 sections, file:line-cited)
- **Plan**: `plan.md` · **Tasks**: `tasks.md` · **Checklist**: `checklist.md` · **Decisions**: `decision-record.md`
- **Parent track**: `../spec.md` (003-memory-and-causal-runtime)
