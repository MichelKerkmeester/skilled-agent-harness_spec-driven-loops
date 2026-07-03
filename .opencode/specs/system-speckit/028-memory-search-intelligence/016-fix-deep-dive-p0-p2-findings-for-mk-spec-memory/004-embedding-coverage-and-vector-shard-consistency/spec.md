---
title: "Feature Specification: Phase 4: embedding-coverage-and-vector-shard-consistency"
description: "43% of the 33,101-row memory corpus is invisible to vector search and 367 success rows have no stored vector; this phase repairs embedding coverage, shard-write consistency, model provenance, scan lifecycle races, and resolves the chunking decision."
trigger_phrases:
  - "embedding coverage repair"
  - "vector shard consistency"
  - "pending vectors drain"
  - "memory embedding reconcile"
  - "chunking safe-swap fix"
  - "embedding model backfill"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/004-embedding-coverage-and-vector-shard-consistency"
    last_updated_at: "2026-07-03T10:20:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 3 planning docs from deep-dive sources"
    next_safe_action: "Run Phase 1 baseline + verify-first tasks (T001-T009) before any code change"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-016-004-embedding-coverage"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Adaptive drain scaling vs raised static rate"
      - "Triage the 4,247 failed rows by failure class before wholesale requeue?"
      - "Gate the drain on phases 001-003 corpus repair to avoid embedding doomed rows?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 4: embedding-coverage-and-vector-shard-consistency

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

Live production numbers (measured 2026-07-03, deep-dive report §1) show 43% of the memory corpus is invisible to vector search: 8,761 pending + 4,247 failed + 1,260 retry rows out of 33,101, plus 367 rows reporting embedding success with no stored vector and 27,706 rows missing `embedding_model` attribution (with two spellings of the same model). This phase drains the backlog, makes the retry drain write the active vector shard, reconciles the success/vector desync, repairs provenance, fixes scan-lifecycle races, and resolves the dormant-chunking decision, fixing the verified P0 safe-swap self-delete either way.

**Key Decisions**: ADR-001 (wire chunked indexing into the scan path vs document the single-vector truncation policy), drain-rate scaling strategy.

**Critical Dependencies**: Program execution order (phases 011, 001-003 precede this phase so the drain does not embed dead or duplicate rows); embedder endpoint availability for ~14k pending embeddings.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-07-03 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 13 |
| **Predecessor** | 003-content-hash-normalization-and-save-dedup-lanes |
| **Successor** | 005-trigger-phrase-quality-and-matcher-guards |
| **Handoff Criteria** | SC-001..SC-005 green with evidence; ADR-001 Accepted; checklist P0/P1 verified; validate.sh --strict exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Deep dive remediation phase children specification.

**Scope Boundary**: Embedding coverage (pending/failed/retry backlog, success-without-vector reconcile), vector shard-write consistency (active `vec_<dim>` vs `vec_memories`), embedding-model provenance and query-time identity assertion, the chunking decision plus its P0 safe-swap fix, and scan-lifecycle races (coalescing, cancel-cooldown, heartbeat lease). Ranking (007), corpus identity (001), tier exclusions (002), content-hash dedup (003), and trigger quality (005) are out of scope.

**Dependencies**:
- Phase 011 (daemon freshness/health truthfulness) restores a trustworthy CLI/health surface for before/after measurement.
- Phases 001-003 (corpus repair) precede per program order so the drain targets surviving active rows, not the 12,352 dead-path rows.
- Phase 002's shared active-row predicate informs which rows deserve embedding priority.

**Deliverables**:
- Retry-manager drain writing the active vector shard with scaled drain rate and dead-end rescue.
- `memory_embedding_reconcile` executed and scheduled (wired into /memory:manage + maintenance cadence).
- embedding_model normalization + backfill migration and query-time embedder identity assertion.
- Fixed chunking safe-swap (P0 #3) plus an Accepted ADR-001 resolving scan-path chunking vs documented truncation policy.
- Scan-lifecycle fixes: scope-aware coalescing, cancel-cooldown, heartbeat lease.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
43% of the 33,101-row memory corpus is invisible to vector search: 8,761 rows are pending, 4,247 failed, and 1,260 sit in retry, while 367 rows report embedding success with no stored vector. The retry drain writes only `vec_memories` and never the active `vec_<dim>` shard (report §3 #16, `retry-manager.ts:747`), drains at a default 5 rows/5min (report §4 item 9, weeks for an 8.7k backlog), and `memory_embedding_reconcile` has never run (ledger L3). Provenance is broken (27,706 rows with empty `embedding_model`, two spellings of the same nomic model), chunking is dormant with a verified P0 self-delete in its safe-swap update path (report §3 #3, ledger L9), and scan-lifecycle races (scope-blind coalescing, cancel-cooldown, phantom heartbeat lease) undermine the scan path that must drain all of this.

### Purpose
Every successfully indexed active row has a queryable vector in the active shard, the backlog drains in under a day, provenance supports query-time embedder identity assertion, and the chunking question is decided and implemented with the safe-swap P0 fixed either way.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run + schedule `memory_embedding_reconcile`; wire into /memory:manage + maintenance cadence (367 success-no-vector, ledger L3).
- Retry-manager drain: write active shard via `writeActiveVectorPayload` (#16); sync-vs-drain embedded-text parity + embedding cache-key fix (Agent F P2 x2); drain batch/interval scaling by queue size (report §4 item 9); retry@max dead-end rescue (Agent F P2).
- embedding_model attribution: normalize the two nomic spellings, backfill 27,706 empty rows from shard provenance, assert embedder identity at query time (ledger L3).
- 'auto' embedder shard-repair sentinel fix (counts vs writes mismatch, Agent F contract).
- Chunking decision (ADR-001): wire chunked indexing into the scan path for over-threshold docs OR document the single-vector truncation policy + FTS-only tail coverage; fix the P0 safe-swap self-delete either way (#3, `chunking-orchestrator.ts:488-553`, `vector-index-store.ts:1857`); un-skip/cover the update path in tests.
- Scan lifecycle: pendingVectors undercount on updated files, scope-blind coalescing, cancel-cooldown, heartbeat phantom lease (Agent F P2 x4).

### Out of Scope
- Ranking/fusion behavior and filter bypasses - phase 007 owns them.
- Orphan sweep, corpus identity, dup-hash collapse - phase 001 owns them.
- Archived/deprecated tier exclusions - phase 002 owns the shared predicate.
- Content-hash normalization and save dedup lanes - phase 003.
- Scan-side performance beyond the lifecycle races listed above (statSync batching etc.) - phase 010.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts | Modify | Drain writes active shard via writeActiveVectorPayload (:747-765); embedded-text parity; adaptive batch/interval; dead-end rescue |
| .opencode/skills/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts | Modify | Safe-swap self-delete fix (:311, :488-553): append-only staging or oldChildIds = old minus new |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts | Modify | get_by_folder_and_path dedup parent filter (:1857-1873) feeding the safe-swap fix |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts | Modify | writeActiveVectorPayload call surface consumed by the drain path (confirmed symbol location) |
| .opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts | Modify | Reconcile scheduling, /memory:manage wiring, retry@max pickup |
| .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts | Modify (conditional) | Scan-path chunking wiring per ADR-001 Option A; :2511 is today's only indexChunkedMemoryFile call site |
| Scan lifecycle modules (coalescing/cooldown/lease; exact files located in T007) | Modify | Scope-aware coalescing, cancel does not arm cooldown, heartbeat cannot resurrect a released lease |
| embedding_model provenance migration (new script under mcp_server) | Create | Spelling normalization + backfill from shard provenance, with before-value logging for reversal |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fix the chunking safe-swap self-delete (report §3 P0 #3, mechanism verified; `chunking-orchestrator.ts:488-553` + `vector-index-store.ts:1857-1873`): staging dedups to update-in-place, then finalize bulk-deletes oldChildIds captured post-staging, deleting the just-updated chunk rows and leaving the parent 'partial' and mtime-skipped forever. Fix via append-only staging or oldChildIds = old minus new. Required under BOTH ADR-001 options | Re-save of a chunked memory keeps all fresh child rows; parent never left 'partial' after a successful swap; previously skipped update-path tests un-skipped and passing |
| REQ-002 | Retry-manager drain writes the active `vec_<dim>` shard via `writeActiveVectorPayload`, not only `vec_memories` (report §3 P1 #16, `retry-manager.ts:747-765`; 031 T-0175 class residue; matches the live 367) | Drained rows are immediately queryable through the active vector surface; new drains produce zero success-without-vector rows |
| REQ-003 | Run `memory_embedding_reconcile` once against the live desync (367 success-no-vector, ledger L3; maintenance.lastRunAt currently null) and schedule it: maintenance cadence + /memory:manage wiring | Health consistency check reports 0 success-without-vector rows; a recurring cadence and a manual /memory:manage entry point exist |
| REQ-004 | Scale the drain batch/interval by queue size (default 5 rows/5min, report §4 item 9; 8,761 pending is days-to-weeks at default) | Projected full drain of the pending backlog < 24h, measured over a bounded observation window; no event-loop lag warnings during drain |
| REQ-005 | Resolve ADR-001: wire chunked indexing into the scan path for over-threshold docs OR document the single-vector truncation policy + explicit FTS-only tail coverage (decomposition §004; ledger L9: 39 docs >50KB, max 193KB, single vector) | decision-record.md ADR-001 status Accepted with spike evidence; implementation matches the accepted option |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Retry@max dead-end rescue: rows at max retries are invisible to both scan reindex and the retry queue (Agent F P2, 24h dead-end) | Rows at retry@max re-enter a repair path (reconcile pickup or scan reindex); no row stays permanently invisible while its source file exists |
| REQ-007 | Sync-vs-drain embedded-text parity + cache-key fix: drain embeds different text than the sync path and poisons the shared embedding cache under the same key (Agent F P2 x2) | Drain and sync paths embed identical weighted text for the same row; cache key covers the embedded-text projection; poisoning regression test passes |
| REQ-008 | embedding_model normalization + backfill: two spellings of the same model ('nomic-ai/nomic-embed-text-v1.5' 1,405 vs 'nomic-embed-text-v1.5' 3,990) and 27,706 empty rows, backfilled from shard provenance (ledger L3) | 0 rows with empty embedding_model; exactly one canonical spelling remains; migration logs before-values for reversal |
| REQ-009 | Assert embedder identity at query time: stale-model vectors must not be silently compared against a different query embedder (decomposition §004) | Mismatch between query embedder and stored vector model is detected and handled (exclude or re-queue with telemetry), never a silent cross-space comparison |
| REQ-010 | Fix the 'auto' embedder shard-repair sentinel: it counts `vec_<dim>` while writes go to `vec_memories`, so it never clears (Agent F contract) | Sentinel clears after repair; its count reads the shard the writes actually target |
| REQ-011 | Scan lifecycle races: coalescing is scope-blind (scoped scan B reports success without scanning), a cancelled scan arms the 30s cooldown, and a heartbeat can resurrect a released lease (Agent F P2 x3) | Adversarial tests pass: scoped scan during in-flight scan actually scans its scope; cancel does not arm cooldown; released lease cannot be resurrected |
| REQ-012 | Fix pendingVectors undercount on updated files (Agent F P2, via decomposition §004) | pendingVectors count includes updated files; undercount regression test passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Success-row count == vector-row count on the active shard (367 desync -> 0; health consistency check clean). [Decomposition §004 gate]
- **SC-002**: Pending backlog drains in < 24h at the scaled drain rate (8,761 pending baseline). [Decomposition §004 gate]
- **SC-003**: Big docs are searchable beyond the embedder window if chunking is chosen; otherwise the single-vector truncation policy + FTS-only tail coverage is explicitly documented. [Decomposition §004 gate, conditional on ADR-001]
- **SC-004**: embedding_model attribution complete: 0 empty rows (from 27,706) and one canonical model spelling.
- **SC-005**: Baseline-before-delta honored: vitest full-gate baseline + live SQL counts captured before changes, whole gate re-run after, delta reported with no unexplained regressions.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Program order: 011 then 001-003 land first | Drain wastes embedder cycles on 12,352 dead-path rows and dup snapshots | Run reconcile/drain after corpus repair, or scope the drain to the phase-002 active-row predicate |
| Dependency | Embedder endpoint (nomic) availability for ~14k embeddings | Backlog drain stalls | Throttled, resumable drain queue; failure classes recorded, not retried blindly |
| Risk | Provenance backfill mislabels embedding_model | High | Dry-run count report before write; before-values logged; DB backup restore path |
| Risk | Drain-rate scaling overloads the embedder or event loop | Med | Bounded batch sizes, adaptive interval, watch event-loop lag during observation window |
| Risk | Scan-path chunking (if chosen) inflates row counts or scan latency | Med | Flag-gated, threshold-gated (>50KB) rollout; baseline scan timings compared |
| Risk | Active-shard write change regresses the dual-write path (T-0175 class) | Med | Parity tests on both shards; vitest baseline comparison |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: memory_search latency does not regress vs the captured baseline while the drain runs (p50 delta within noise).
- **NFR-P02**: Drain sustains >= 400 rows/hour (clears 8.7k pending in < 24h) without event-loop lag warnings.

### Security
- **NFR-S01**: Migrations and reconcile run locally against the packet DB with a pre-write backup; all SQL parameterized; no memory content interpolated into commands.

### Reliability
- **NFR-R01**: Reconcile, backfill, and drain are idempotent and resumable; re-running any of them on a healthy corpus is a no-op.

---

## 8. EDGE CASES

### Data Boundaries
- Rows at retry@max: currently invisible to scan reindex AND retry queue; rescue path must pick them up (REQ-006).
- Docs larger than the embedder window: 39 docs >50KB, max 193KB; tail invisible to vector search today (ADR-001 decides the fix vs the documented policy).
- Empty/zero pending queue: adaptive drain must idle cheaply, not busy-poll.

### Error Scenarios
- Embedder endpoint outage mid-drain: rows stay pending/retry with failure class recorded; drain resumes without double-embedding.
- Model-spelling mismatch at query time: identity assertion handles stale-model vectors (exclude or re-queue), never silent wrong-space similarity (REQ-009).
- Cache poisoning: same cache key with different embedded text between sync and drain paths must be impossible after REQ-007.
- Re-save of a chunked memory (update path): safe-swap must not delete the fresh children (REQ-001).
- Scoped scan requested during an in-flight scan: coalescing must not report success without scanning that scope (REQ-011).
- Cancelled scan / released lease: cooldown and heartbeat must not block or resurrect subsequent scans (REQ-011).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Files: ~8, LOC: ~600+ incl. migration + tests, Systems: MCP memory server + sqlite-vec shards |
| Risk | 15/25 | Auth: N, API: N, Breaking: possible on shard write path + write migrations |
| Research | 12/20 | Verify-first battery on 7 agent-verified findings + ADR-001 spike |
| Multi-Agent | 4/15 | Workstreams: 4 batteries, single executor |
| Coordination | 8/15 | Dependencies: program order 011/001-003, ADR gate inside the phase |
| **Total** | **55/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Backfill migration writes wrong provenance, corrupting identity assertion | H | L | Dry-run diff, before-value log, backup restore |
| R-002 | Drain scaling floods embedder endpoint; backlog thrashes between retry states | M | M | Adaptive interval + bounded batches + failure-class triage |
| R-003 | Chunking activation (Option A) explodes chunk-row count / scan latency | M | M | Flag + >50KB threshold + spike measurement before acceptance |
| R-004 | Safe-swap fix changes update-path semantics for existing chunked saves | H | L | Un-skip update-path tests + adversarial re-save test before merge |
| R-005 | Reconcile mutates rows concurrently with the file-watcher scan | M | M | Run under maintenance lease/window; idempotent writes |

---

## 11. USER STORIES

### US-001: Full vector visibility for indexed rows (Priority: P0)

**As a** memory-search user, **I want** every successfully indexed active row to have a queryable vector in the active shard, **so that** semantic search sees the whole active corpus instead of 57% of it.

**Acceptance Criteria**:
1. **Given** the live desync of 367 success-without-vector rows, **When** `memory_embedding_reconcile` runs (REQ-003), **Then** the health consistency check reports 0 such rows.
2. **Given** a row drained by the retry manager after REQ-002, **When** it is queried through the active `vec_<dim>` surface, **Then** it is returned like any sync-path embedded row.

### US-002: Backlog drains in a day, not weeks (Priority: P0)

**As an** operator, **I want** the pending-embedding backlog to drain within 24 hours, **so that** newly saved docs become vector-searchable promptly.

**Acceptance Criteria**:
1. **Given** the 8,761-row pending baseline and the scaled drain (REQ-004), **When** drain throughput is measured over a bounded window, **Then** the projected full-drain time is under 24 hours.
2. **Given** rows stuck at retry@max, **When** the rescue path (REQ-006) runs, **Then** they re-enter reconcile or scan reindex instead of staying invisible.

### US-003: Trustworthy embedding provenance (Priority: P1)

**As a** maintainer, **I want** embedding_model attribution complete and canonical, **so that** query-time embedder identity assertion (REQ-009) can reject or re-queue stale-model vectors instead of comparing across vector spaces.

**Acceptance Criteria**:
1. **Given** the 27,706 empty-attribution rows and two nomic spellings, **When** the normalization + backfill migration (REQ-008) completes, **Then** 0 rows are empty and exactly one spelling remains.
2. **Given** a stored vector whose model differs from the query embedder, **When** a search runs, **Then** the mismatch is detected and handled with telemetry, never silently scored.

### US-004: Predictable behavior for oversized docs (Priority: P1)

**As a** user searching large spec documents, **I want** content beyond the embedder window either chunk-indexed or explicitly documented as FTS-only, **so that** retrieval behavior on the 39 oversized docs is predictable.

**Acceptance Criteria**:
1. **Given** ADR-001 resolves to Option A (scan-path chunking), **When** the tail of a >50KB doc is queried, **Then** the vector channel returns it (SC-003).
2. **Given** ADR-001 resolves to Option B (documented policy), **When** a reader consults the memory-system docs, **Then** the single-vector truncation limit and FTS-only tail coverage are stated explicitly.

---

## 12. OPEN QUESTIONS

- Adaptive queue-size-based drain scaling vs a raised static rate: decide in implementation from the T025 throughput measurement.
- Should the 4,247 failed rows be triaged by failure class before wholesale requeue, to avoid re-burning embedder cycles on permanently failing content?
- Should the one-shot reconcile + drain be sequenced strictly after phases 001-003 land, or scoped to the phase-002 active-row predicate if run earlier?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Program Sources**: `../research/phase-decomposition.md` (§004), `../research/deep-dive-report.md` (§1, §3 P0 #3 + P1 #16, §4 item 9), `../research/findings-ledger.md` (L3, L9, Agent F)

---

<!--
LEVEL 3 SPEC
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
