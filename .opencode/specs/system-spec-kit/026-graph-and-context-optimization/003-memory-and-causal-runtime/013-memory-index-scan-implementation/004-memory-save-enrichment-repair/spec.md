---
title: "Feature Specification: memory_save Replay Enrichment Repair (durable marker + repair-on-replay)"
description: "memory_save commits the primary row, then runs secondary enrichment (FTS/vector/graph) afterward. A post-grace SIGKILL in that window leaves the row committed but unenriched; replay short-circuits via dedup and never repairs it. This packet adds a durable enrichment-completion marker and repairs incomplete markers on dedup replay and under the scan lease."
trigger_phrases:
  - "memory_save enrichment repair"
  - "replay enrichment window"
  - "post-insert enrichment marker"
  - "schema v30 enrichment status"
  - "secondary index idempotency memory_save"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/004-memory-save-enrichment-repair"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored enrichment-repair packet plan from follow-up research"
    next_safe_action: "Implement schema v30 marker + repair-on-replay via gpt-5.5-fast xhigh"
    blockers: []
    key_files:
      - "mcp_server/lib/search/vector-index-schema.ts"
      - "mcp_server/handlers/memory-save.ts"
      - "mcp_server/handlers/save/enrichment-state.ts"
      - "mcp_server/handlers/memory-index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "enrichment-repair-packet-setup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: memory_save Replay Enrichment Repair

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

`memory_save` writes the primary memory row inside `writeTransaction.immediate()`, then runs secondary enrichment (FTS, vector embedding, entity/summary, causal/graph edges) in a separate phase after the transaction commits. A SIGKILL in the window between the primary commit and enrichment completing leaves the row durably committed but unenriched, and the next `memory_save` of the same content short-circuits via dedup (`unchanged`/`duplicate`) without ever repairing it. This packet adds a durable enrichment-completion marker and repairs incomplete markers both on the dedup replay path and as a bounded backfill under the existing scan lease.

**Key Decisions**: Durable completion marker plus repair-on-replay (not in-transaction enrichment, not scan-only backfill); 4-column marker shape defaulting to `complete` for back-compat.

**Critical Dependencies**: Bumps the shared production DB schema (29 → 30); blocked behind a separate, explicitly-confirmed daemon deploy that runs the v30 migration on the live DB.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-02 |
| **Branch** | `004-memory-save-enrichment-repair` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`memory_save` commits the primary row inside `writeTransaction.immediate()`, then runs secondary enrichment (FTS, vector, entity/summary, causal/graph edges) afterward via `runPostInsertEnrichmentIfEnabled()`. If the process is SIGKILLed between the primary commit and enrichment completing (a post-grace RSS-recycle kill or a daemon crash), the row is durably committed but its secondary indexes are missing, and the next `memory_save` of the same content short-circuits through the dedup pre-check (`unchanged`/`duplicate`) and returns without ever repairing the missing enrichment. The memory stays silently invisible to FTS/vector/graph search until an unrelated full scan happens to re-index it. This is the only known replay-idempotency hole left in `memory_save` after the front-proxy work: primary-row dedup correctly prevents duplicate rows, but nothing tracks or repairs partial enrichment.

### Purpose
Make secondary enrichment durably recoverable by tracking enrichment completion with a per-row marker and repairing incomplete markers on dedup replay and as a bounded backfill under the scan lease, with no duplicate rows, no duplicate edges, and no save-latency regression.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Schema: bump `SCHEMA_VERSION` 29 → 30; add narrow, defaulted enrichment-marker columns; idempotent v30 migration (fresh + upgrade) and a pending-status partial index.
- New `handlers/save/enrichment-state.ts`: marker helpers (mark pending, record result, needs-repair check, repair-on-replay, bounded backlog repair).
- `memory-save.ts`: mark `pending` inside the primary transaction; persist the enrichment result immediately after `runPostInsertEnrichmentIfEnabled()`; on a dedup `unchanged`/`duplicate` return carrying a row id, run replay repair before returning.
- `memory-index.ts`: bounded repair of incomplete markers under the scan lease, reported in the response counts.
- Tests for every path (migration, save-path marker, replay repair, no-op replay, deferred, backfill, repeated-repair idempotency).

### Out of Scope
- Deploying - no `dist/` rebuild, no daemon restart, no migration against the live production DB. This packet is implemented and unit-tested on a branch; deployment (which runs the v30 migration on the shared DB) is a separate, explicitly-confirmed step.
- Changing the primary-row dedup contract or the enrichment logic itself - both stay as-is so the change stays surgical.
- Touching the launcher/front-proxy files - those are the 003 follow-ups #1/#2 and out of this packet's boundary.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/vector-index-schema.ts` | Modify | Bump SCHEMA_VERSION 29 → 30, add 4 marker columns to fresh schema, add idempotent v30 migration + partial index |
| `mcp_server/handlers/save/enrichment-state.ts` | Create | Marker helpers: markEnrichmentPending, recordEnrichmentResult, needsEnrichmentRepair, repairEnrichmentOnReplay, repairIncompleteMarkers |
| `mcp_server/handlers/memory-save.ts` | Modify | Mark pending in primary txn, record result after enrichment, repair on duplicatePrecheck + dupResult replay returns |
| `mcp_server/handlers/memory-index.ts` | Modify | Bounded backfill repair under the scan lease (additive, distinct region from packet 005's edit at lines 249-333) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Schema v30 with defaulted marker columns and idempotent migration | `SCHEMA_VERSION === 30`; fresh DB creates 4 marker columns + partial index; v29 → v30 upgrade migrates idempotently (second run is a no-op) and defaults existing rows to `complete` |
| REQ-002 | Save-path marker lifecycle | A successful `memory_save` writes `pending` inside the primary transaction and flips it to `complete` after `runPostInsertEnrichmentIfEnabled()` returns, verifiable by reading the marker |
| REQ-003 | Replay repair on dedup return | A replay (`unchanged`/`duplicate`) of a row whose marker is `pending`/`partial`/`failed` triggers idempotent enrichment repair and updates the marker to `complete`; a replay of a `complete` row is a no-op with no duplicate edges |
| REQ-004 | Repeated repair is idempotent | FTS/vector/graph state after one repair equals state after N repairs (stable row/edge counts) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `deferred` rows are not repaired on normal replay | A `deferred` marker (planner-first / feature-disabled) is untouched by normal replay; only explicit backfill processes it |
| REQ-006 | Scan-lease backfill repairs a bounded set | `memory_index_scan` repairs a bounded number of incomplete markers under its lease and reports the repair count in the response |
| REQ-007 | Verification gates pass | All new + existing affected vitest suites pass; scoped typecheck has no new errors; `validate.sh --strict` passes for this packet |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A row killed mid-enrichment is repaired to `complete` on the next replay, making it visible to FTS/vector/graph search without waiting for a full scan.
- **SC-002**: No duplicate rows and no duplicate causal/graph edges are produced by repair, on either the replay path or the backfill path.
- **SC-003**: Save latency is unchanged because enrichment stays outside the primary transaction; only the cheap `pending` marker write joins the transaction.
- **SC-004**: The historical corpus is not re-enriched on upgrade because pre-existing rows default to `complete`, keeping the partial index tiny.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Bumps the shared production DB schema (every `memory_save` uses this path) | High | Narrow defaulted columns, idempotent migration tested on fresh + upgraded DBs, no-deploy boundary (production stays on v29 until an explicit confirmed deploy) |
| Risk | Duplicate edges on repair | Medium | Idempotent causal/graph writes (upsert/dedup), FTS/vector rows replaced not appended, repeated-repair test asserts stable counts |
| Risk | Save-latency regression | Medium | Keep enrichment OUTSIDE the primary transaction; only the cheap `pending` marker write is inside it (rejected in-transaction alternative recorded in decision-record ADR-1) |
| Dependency | Separate confirmed daemon deploy to run v30 migration on the shared DB | Blocks production rollout | Confirm the deploy window separately; concurrent v29 sessions must drain or upgrade confirmed safe under the launcher single-writer lease |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Save-path latency is unchanged versus v29; only the `pending` marker write (a single cheap UPSERT) is added inside the primary transaction.

### Security
- **NFR-S01**: No new external input is accepted; marker columns are written from internal enrichment state only, so there is no new injection or trust boundary.

### Reliability
- **NFR-R01**: The v30 migration is idempotent (running it twice is a no-op) and defaults existing rows to `complete`, so an interrupted or repeated upgrade leaves the schema in a consistent state.

---

## 8. EDGE CASES

### Data Boundaries
- Empty enrichment state: a row that recorded no completed steps (`_state` null/empty) is treated as needing full repair when its status is non-`complete`.
- Partial enrichment state: `_state` records which steps finished (fts/vector/entity/graph) so repair redoes only the missing steps rather than re-running everything.

### Error Scenarios
- Enrichment throws after the primary commit: the marker stays non-`complete` (`pending`/`failed`) and is repaired on the next replay or backfill.
- `deferred` row reached by normal replay: skipped by design; only an explicit operator backfill may process `deferred`.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 4 (1 new), schema + 3 handlers, ~500 LOC incl. tests, 1 system (memory MCP) |
| Risk | 22/25 | Auth: N, API: N, Breaking: Y (shared DB schema bump on the hot save path) |
| Research | 12/20 | Design source + origin finding already researched; remaining work is locating exact edit sites |
| Multi-Agent | 4/15 | Workstreams: 1 (single implementer) |
| Coordination | 8/15 | Dependencies: deploy gate + integration with packet 005 in the same file |
| **Total** | **64/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | v30 migration runs against the live DB before the deploy is confirmed | H | L | No-deploy boundary; production stays on v29; deploy is a separate explicit step |
| R-002 | Repair produces duplicate causal/graph edges | M | M | Idempotent upsert/dedup writes; repeated-repair test asserts stable edge/row counts |
| R-003 | Edit to `memory-index.ts` collides with packet 005's edit at lines 249-333 | M | M | Keep this edit additive and in a distinct region/function to ease integration |
| R-004 | Defaulting markers to `pending` triggers a mass re-enrichment storm | H | L | Default to `complete` so the historical corpus is treated as already enriched |

---

## 11. USER STORIES

### US-001: Killed-mid-enrichment row recovers on replay (Priority: P0)

**As a** memory MCP operator, **I want** a row that was committed but not enriched (due to a mid-window kill) to repair itself on the next save of the same content, **so that** the memory becomes searchable without waiting for a full re-index scan.

**Acceptance Criteria**:
1. Given a row with a `pending` marker, When a `memory_save` of the same content returns `unchanged` or `duplicate`, Then enrichment repair runs idempotently and the marker becomes `complete`.

---

### US-002: No-op replay of an enriched row stays cheap (Priority: P1)

**As a** memory MCP operator, **I want** replays of already-enriched rows to do no extra work, **so that** dedup stays fast and no duplicate edges are created.

**Acceptance Criteria**:
1. Given a row with a `complete` marker, When a replay returns `unchanged`/`duplicate`, Then no enrichment runs and FTS/vector/graph row and edge counts stay stable.

---

## 12. OPEN QUESTIONS

- Deploy gate: the v30 migration runs against the shared production DB only on the next daemon deploy. The deploy window must be confirmed separately, and concurrent v29 sessions must drain or the upgrade must be confirmed safe under the launcher's single-writer lease before restart.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Design source**: `../003-mcp-front-proxy/research/research-followups.md` §2 (current gap → options → recommended approach → risks → tests).
- **Origin finding**: `../003-mcp-front-proxy/research/research.md` (P2: commit-before-enrichment replay).
