---
title: "Feature Specification: Durability Stress Domain"
description: "The 013 memory-index-scan roadmap shipped four durability surfaces (checkpoint-v2 file snapshots, schema-v30 enrichment markers, the single-writer index_scan lease, and the launcher front-proxy recycle path) with only happy-path correctness unit tests. This packet adds a new mcp_server/stress_test/durability domain that load/soak/concurrency-tests those surfaces against throwaway isolated databases, plus a stress:durability npm script."
trigger_phrases:
  - "durability stress domain"
  - "checkpoint contention stress"
  - "index scan coalescing stress"
  - "daemon recycle transparency stress"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/004-stress-test-durability-domain"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored durability stress domain (4 cases) + stress:durability script"
    next_safe_action: "None binding; durability domain green (12/12)"
    blockers: []
    key_files:
      - "mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts"
      - "mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts"
      - "mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts"
      - "mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "durability-stress-domain-setup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Durability Stress Domain

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The 013 memory-index-scan roadmap shipped four durability surfaces — checkpoint-v2 file snapshots, schema-v30 post-insert enrichment markers, the single-writer `index_scan` lease, and the launcher front-proxy daemon-recycle path — but every existing test under `mcp_server/tests/*` is a single happy-path correctness check, not a load test. This packet adds a new `mcp_server/stress_test/durability/` domain with four cases that exercise those surfaces under contention, flood, and recycle, plus a `stress:durability` npm script that mirrors the existing stress scripts. Every case runs against throwaway temp/in-memory databases and the proxy's pure-logic helpers, so the domain is safe to run against a live operator session.

**Key Decisions**: Reuse the storage-layer and front-proxy public APIs directly (no daemon spin-up) over re-running the substrate daemon harness; assert durability invariants (lossless round-trips, bounded backlog, single-writer, transparent recycle) over raw throughput numbers.

**Critical Dependencies**: The injectable `reopen` hook on `restoreCheckpoint`, the `repairIncompleteMarkers` backfill, the `acquireIndexScanLease`/`completeIndexScanLease` config-table lease, and the front-proxy `__testing.createPendingRequestsTracker`/`classifyFrame` helpers.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Implemented — domain green (12/12) |
| **Created** | 2026-06-02 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The durability surfaces shipped by the 013 roadmap each have a correctness unit test under `mcp_server/tests/*` (`checkpoints-v2-create/restore`, `vector-index-schema-enrichment-v30`, `handler-memory-index-async-scan`, `launcher-session-proxy`). Those tests prove the behavior is correct once, on a single happy path. None of them exercise the behavior under contention (many interleaved checkpoint round-trips), under flood (a backlog of pending enrichment markers), under concurrent acquisition (a burst of index-scan requests), or across a backend recycle (in-flight requests during a daemon RSS-recycle). The `stress_test/` tree has `search-quality`, `matrix`, `memory`, `session`, and `substrate` domains but no durability domain, so the production-breaking failure modes those surfaces were built to prevent are not load-tested at all.

### Purpose
Add a `mcp_server/stress_test/durability/` domain that load/soak/concurrency-tests the four durability surfaces against throwaway isolated databases, and a `stress:durability` npm script that runs it through the existing `vitest.stress.config.ts`. The domain must never touch the production DB at `~/.mk-spec-memory` or the live `daemon-ipc` socket.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new `mcp_server/stress_test/durability/` directory with four stress cases and a README.
- Checkpoint-v2 create→restore round-trips under contention, asserting lossless round-trips, a bounded on-disk snapshot set, and no orphaned snapshot/`.tmp-` directories.
- Schema-v30 enrichment-marker backfill convergence under a save flood, asserting markers drain to `complete` through bounded passes and the partial-index-eligible set drains to empty.
- `index_scan` lease coalescing under a concurrent acquisition burst, asserting single-writer admission, clean structured back-off, cooldown coalescing, and stale-lease reclaim.
- Daemon RSS-recycle transparency through the front-proxy, asserting replayable reads survive a recycle, unsafe mutations are refused with the retryable `-32001` signal, and `-32002` stays terminal.
- A `stress:durability` npm script mirroring `stress:substrate`/`stress:matrix`/`stress:harness`.

### Out of Scope
- Modifying any production runtime code under `lib/`, `handlers/`, `core/`, or `.opencode/bin/` — this packet adds tests and one script only.
- Spinning up a real daemon for the durability cases (the substrate domain already owns daemon-harness coverage; re-inventing it here is rejected).
- Bumping the README "36-tool" count or `SCHEMA_VERSION` — those are correct as shipped; this packet adds behavioral coverage only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts` | Create | Interleaved checkpoint-v2 create+restore round-trips under contention. |
| `mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts` | Create | Schema-v30 marker backfill convergence under a save flood. |
| `mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts` | Create | `index_scan` lease coalescing under a concurrent acquisition burst. |
| `mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts` | Create | Front-proxy recycle transparency for in-flight requests. |
| `mcp_server/stress_test/durability/README.md` | Create | Domain overview, scope table, run recipe, isolation boundary. |
| `mcp_server/package.json` | Modify | Add the `stress:durability` script. |
| `mcp_server/vitest.stress.config.ts` | Reference | Already includes `stress_test/**`; no change needed. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Checkpoint-v2 round-trips stay lossless and orphan-free under contention. | Many interleaved create+restore cycles restore memory to a fixed baseline every time, leave no orphaned snapshot or `.tmp-` directory, and keep the on-disk snapshot set bounded by `MAX_CHECKPOINTS`. |
| REQ-002 | Enrichment markers converge under a save flood. | A flood of `pending` schema-v30 markers drains to `complete` through repeated bounded `repairIncompleteMarkers` passes, the incomplete set reaches zero, and each flooded row is repaired exactly once. |
| REQ-003 | `index_scan` admits exactly one writer under a concurrent burst. | A concurrent `acquireIndexScanLease` burst admits exactly one writer; the rest back off with a structured `lease_active`/`cooldown` reason, not a raw error. |
| REQ-004 | Every case is hermetically isolated. | Every case uses throwaway temp/`:memory:` databases or pure-logic helpers; none touch `~/.mk-spec-memory` or the live `daemon-ipc` socket. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The restore barrier is observable so mutating handlers back off. | During a restore swap, `getRestoreBarrierStatus()` returns the `E_RESTORE_IN_PROGRESS` code and clears to null after the restore finishes. |
| REQ-006 | The cooldown coalesces immediate re-acquisitions and a stale lease is reclaimable. | After completion, an immediate acquisition burst is fully coalesced by the cooldown; past the cooldown one acquires; an expired lease is reclaimed so a crashed scan never wedges the slot. |
| REQ-007 | The recycle path replays reads and refuses mutations. | Across a simulated recycle, in-flight replayable reads are re-sent, unsafe mutations are dropped with the retryable `-32001` signal, and the pending set drains with no leak. |
| REQ-008 | `-32001` stays live and `-32002` stays terminal. | The domain asserts `-32001` is the live `RETRYABLE_RECYCLE_ERROR` (NOT removed) and `-32002` is the terminal `PROTOCOL_MISMATCH_ERROR`. |
| REQ-009 | The domain runs through the existing stress config and script convention. | `npm run stress:durability` runs the domain via `vitest.stress.config.ts`, and the broader stress suite stays green (no config breakage). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npm run stress:durability` passes (all four cases green).
- **SC-002**: Running the durability domain alongside an existing pure-logic domain through the shared config stays green, proving no config breakage.
- **SC-003**: No case reads or writes the production DB at `~/.mk-spec-memory` or connects to the live `daemon-ipc` socket.
- **SC-004**: `validate.sh --strict` on this packet passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Injectable `reopen` on `restoreCheckpoint` | The contention case needs an in-process file swap, not a real daemon reopen | Reuse the `flatReopen` pattern from `checkpoints-v2-restore.vitest.ts`. |
| Dependency | `repairIncompleteMarkers` backfill semantics | Backfill only scans `pending`/`partial`/`failed` markers | Flood only `pending` markers so every row is scanned and converges. |
| Dependency | `db-state.init` vector-index injection | The coalescing case drives the real lease against a throwaway DB | Inject a minimal `VectorIndexLike` whose `getDb()` returns the temp handle. |
| Risk | A case accidentally touches the production DB or live socket | High | Per-test `mkdtemp`/`:memory:` DBs and pure-logic proxy helpers; no socket opened, no daemon spawned. |
| Risk | A false invariant (e.g. catalog bounded post-restore) makes the test wrong | Med | Assert the true on-disk integrity property; restore intentionally merges the snapshot catalog. |
| Risk | Asserting `-32001` was removed | High | `-32001` is the LIVE retryable recycle signal; the domain asserts it stays live, never removed. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The whole durability domain must complete in a few seconds on a developer machine (no daemon startup), keeping it cheap enough to run in the stress gate.

### Security
- **NFR-S01**: No case may read or write outside its own throwaway temp directory or in-memory database.

### Reliability
- **NFR-R01**: Each case must be deterministic and order-independent, tearing down its temp DB in `afterEach`.

---

## 8. EDGE CASES

### Data Boundaries
- Empty backlog: bounded backfill over a clean DB is a no-op (`scanned: 0, repaired: 0, failed: 0`).
- Stale index-scan lease: an expired lease is cleared inside the reservation transaction so a crashed scan never wedges the writer slot.

### Error Scenarios
- In-flight unsafe mutation during a recycle: the client receives the retryable `-32001` recycle error and re-drives it rather than risking a double mutation.
- Reopen failure mid-restore: the `.bak` rollback restores the live DB; asserted by the existing restore unit tests and respected by the contention case (errors must stay empty across all cycles).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: 5 created + 1 script, LOC: 500+, Systems: storage, schema, db-state, front-proxy |
| Risk | 14/25 | Auth: N, API: N (tests only), Breaking: N (no runtime code touched), isolation-critical |
| Research | 14/20 | Four runtime surfaces, each needing its real public API and true invariant traced to source |
| Multi-Agent | 6/15 | Single executor authoring tests; orchestrator-verified gates |
| Coordination | 9/15 | One domain, four cases, one script; gated by the stress run plus strict validate |
| **Total** | **57/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A case touches the production DB or live daemon socket | H | L | Per-test throwaway DBs; pure-logic proxy helpers; no socket/daemon. |
| R-002 | A wrong durability invariant makes a test assert a false property | M | M | Trace each invariant to the source before asserting; on-disk integrity over catalog count. |
| R-003 | The new domain breaks the shared `vitest.stress.config.ts` | M | L | Mirror the existing domain layout; run durability + an existing domain together. |
| R-004 | Claiming `-32001` was removed | H | L | Assert `-32001` stays the live retryable recycle signal; never claim removal. |

---

## 11. USER STORIES

### US-001: Contention-safe checkpoint round-trips (Priority: P0)

**As an** operator who relies on checkpoint-v2 as a rollback net, **I want** the create→restore round-trip proven under repeated contention, **so that** I trust it stays lossless and never leaks snapshot directories during a busy migration window.

**Acceptance Criteria**:
1. Given many interleaved create+restore cycles against one throwaway DB, When the domain runs, Then every restore returns memory to a fixed baseline and no orphaned snapshot or `.tmp-` directory survives.

### US-002: Transparent daemon recycle (Priority: P1)

**As an** operator running a long MCP session, **I want** an in-flight read to survive a backend RSS-recycle while an unsafe mutation is safely refused, **so that** a daemon recycle is transparent for reads and never double-applies a mutation.

**Acceptance Criteria**:
1. Given a flood of in-flight requests across a simulated recycle, When the proxy replays the pending snapshot, Then replayable reads are re-sent and unsafe mutations are refused with the retryable `-32001` signal.

---

## 12. OPEN QUESTIONS

- Should the contention case also drive the real `reopenActiveDatabase` coordinator (currently the live verification's job), or is the in-process `flatReopen` swap sufficient for a stress gate?
- Should a future soak variant raise the round-trip and flood counts behind an opt-in env flag for longer nightly runs?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
