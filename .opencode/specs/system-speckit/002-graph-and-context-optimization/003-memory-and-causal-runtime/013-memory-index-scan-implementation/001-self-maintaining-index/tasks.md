---
title: "Tasks: memory_index_scan self-maintaining index [system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/001-self-maintaining-index/tasks]"
description: "Task breakdown for the 3-phase memory_index_scan implementation: coalescing contract + health + orphan sweep (P1), phased async execution + degraded-mode (P2), single-writer concurrency + move reconciliation (P3)."
trigger_phrases:
  - "memory index scan implementation tasks"
  - "013 memory index tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/001-self-maintaining-index"
    last_updated_at: "2026-05-31T15:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored task breakdown"
    next_safe_action: "Execute Phase 1 tasks via cli-opencode"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: memory_index_scan Self-Maintaining Index

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` not started · `[~]` in progress · `[x]` complete (with evidence) · `[!]` blocked
- Each task names its target file(s) and the verification that closes it.
- Phases are strictly sequential; a phase's gate (`tsc` + tests) must pass before the next phase starts.
- `P#.N` = Phase number . task number.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

**Phase theme — Coalescing Contract + Health + Orphan Sweep.**

- [ ] **P1.1** Replace the raw `E429` return (`handlers/memory-index.ts:245-260`) with a success envelope that joins the in-flight/recent job: `{jobId, scanKey, status, phase, coalesced:true, reason, nextPollAfterMs}`, derived from the existing lease reason (`lease_active` / `cooldown`). Cooldown becomes internal-only.
- [ ] **P1.2** Compute `scanKey` = stable hash of normalized scope (`spec_folder`) + options (`force`, `incremental`, includes) + DB identity. Same key ⇒ coalesce.
- [ ] **P1.3** Add `memory_health.index` block (`handlers/memory-crud-health.ts`): `summary` enum (`healthy_fresh`/`healthy_lagging_vectors`/`stale_needs_scan`/`degraded_needs_repair`/`unavailable`) + counts (on-disk delta, orphan files/vectors, pending/retry/failed vectors, last-scan age, active scan/embedder job). Derive from existing `memory_stats`/`embedder_status`/retry telemetry + lease (`db-state.ts:384-405`).
- [ ] **P1.4** Add bounded global orphan sweep in `lib/storage/incremental-index.ts`: ungated from the scan's discovery scope, paged by id/`updated_at`, per-tick cap, removes rows whose `file_path` AND `canonical_file_path` are absent on disk, via `delete_memory_from_database()` (`vector-index-mutations.ts:577-627`) — never a raw `memory_index` delete.
- [ ] **P1.5** Wire the orphan sweep to run on every completed scan regardless of `force`/scope (currently gated `memory-index.ts:373-380`,`:600-608`).
- [ ] **P1.6** Tests: repeat-scan coalescing (no E429); `memory_health.index` populated; renested orphan row removed; existing scan path unchanged.
- [ ] **P1.7 GATE** `tsc` (zero new errors) + spec-kit suite green → record evidence in checklist.md before Phase 2.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Phase theme — Phased Async Execution + Degraded-Mode.**

- [ ] **P2.1** Flip scan indexing to async mode (`handlers/save/embedding-pipeline.ts:140` path; scan currently sync `memory-index.ts:489`) so lexical rows commit `pending` (BM25/FTS-searchable) without the provider.
- [ ] **P2.2** Implement the 3-phase job: bounded walk (manifest by mtime+hash) → commit-lexical (per-tick cap) → async vector drain; request returns at `phase:'lexical_complete'`, `status:'complete_with_pending_vectors'`.
- [ ] **P2.3** Vector drain checks composed provider/circuit state BEFORE the atomic pending→retry claim (`retry-manager.ts:303`); clean `pending` rows are never promoted to `retry` during an outage (retention prunes `retry` `:493-519`).
- [ ] **P2.4** Compose the two circuit breakers (`shared/embeddings.ts:49/59` + `retry-manager.ts:386`) into one provider-state + single backoff timestamp; surface `degraded` + `nextVectorAttemptAfter`.
- [ ] **P2.5** Drain sizing: claim ≤50/tick (`reindex.ts:74`), router chunks by `SPECKIT_EMBED_CLIENT_MAX_BATCH` + byte budget (`execution-router.ts`); peak RSS bounded.
- [ ] **P2.6** Tests: `force` scan on large tree returns within deadline; outage leaves rows `pending` not `retry`; degraded flags surfaced; vectors converge after provider recovers.
- [ ] **P2.7 GATE** `tsc` + suite green → record evidence before Phase 3.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

**Phase theme — Single-Writer Concurrency + Move Reconciliation.**

- [ ] **P3.1** Job-layer single-writer: serialize lexical workers per DB + atomic claim-by-update for file/vector work items (`retry-manager.ts:303` pattern); per-worktree DBs are independent domains.
- [ ] **P3.2** Heartbeat + lease-epoch recovery for stale/dead workers (steal after ~60s expiry, `DEFAULT_SCAN_LEASE_EXPIRY_MS`).
- [ ] **P3.3** Move reconciliation: detect vanished→new path by `packet_id` (`graph-metadata.json`, schema `graph-metadata-schema.ts:61-71`) + doc role/anchor; unique-match guard (no competing live path); content hash confirmation only; update row path in place (preserve id/vector rowid/embedding/history); else delete+add.
- [ ] **P3.4** Triggers feeding the coalescer: (a) lazy reconcile-on-`File not found`-search (`search-results.ts:923-943`) enqueues a bounded verify job, never mutates in result formatting; (b) daemon file-watcher (`file-watcher.ts:365-447`) → A1 queue; (c) post-commit stale marker (extend `.opencode/scripts/git-hooks/post-commit`, today code-graph-only) — not a full scan.
- [ ] **P3.5** Tests: concurrent callers coordinate (no dup work / corruption / raw error); `git mv`'d folder updates path in place without re-embed; trigger thrash collapses onto one job.
- [ ] **P3.6 GATE** `tsc` + FULL suite green; `validate.sh --strict` exit 0; checklist fully checked.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 1-3 gates passed with recorded evidence.
- [ ] spec.md §5 success criteria SC1-SC5 demonstrably met.
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` exit 0.
- [ ] `checklist.md` items all `[x]` with evidence; `implementation-summary.md` reconciled to final state.
- [ ] No raw `E429`/`-32001` regression; existing memory search/save unchanged.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Spec**: `spec.md` (requirements R1-R6, success criteria SC1-SC5)
- **Plan**: `plan.md` (phase architecture + gates)
- **Decisions**: `decision-record.md` (ADRs for contract change, async-mode flip, move-identity key)
- **Research**: `../012-memory-index-scan-ux-hardening/research/research.md` (§6 design, §10 minimal slice)
<!-- /ANCHOR:cross-refs -->
