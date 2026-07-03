---
title: "Decision Record: Orphan Sweep Cursor and Corpus Identity Repair"
description: "Four decisions: drain-then-delete for dead-path rows, near_duplicate_of backfill instead of column drop, dedicated maintenance-state table for the sweep cursor, and three separately revertible checkpointed migration steps."
trigger_phrases:
  - "dead row disposal decision"
  - "near duplicate of backfill decision"
  - "sweep cursor storage decision"
  - "separately revertible migrations"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/001-orphan-sweep-cursor-and-corpus-identity-repair"
    last_updated_at: "2026-07-03T12:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored ADR-001 through ADR-004 from deep-dive evidence"
    next_safe_action: "Ratify ADR-001 and ADR-002 after T013 dry-run and T020 winner validation"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/near-duplicate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-orphan-sweep-cursor-and-corpus-identity-repair"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Orphan Sweep Cursor and Corpus Identity Repair

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Dead-Path Rows Are Drain-Then-Deleted, Not Deprecate-Then-Swept

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed (ratify after T013 dry-run counts) |
| **Date** | 2026-07-03 |
| **Deciders** | Michel Kerkmeester (operator), per phase-decomposition §001 |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed to choose how to dispose of the 12,352 index rows citing dead file paths (report §1) once the persisted cursor lets the sweep reach them: hard-delete them as the sweep advances, or soft-retire them (tier='deprecated') and delete later. Deprecated rows are not harmless here: 7,340 existing deprecated rows still surface at 0.85 scores through FTS/BM25/graph channels because exclusion is channel-inconsistent (ledger DUP MECHANISM), and tombstone visibility is itself broken (report §3 #1). Soft-retiring 12k more rows would grow the exact pollution this program is draining.

### Constraints

- Deprecated exclusion is not trustworthy until phase 002 lands its shared active-row predicate.
- The rows point at files that no longer exist, so no canonical content is lost by deletion; the file system holds nothing to re-index.
- Rollback for a hard delete must exist BEFORE the delete: checkpoint_create is available (handlers/checkpoints.ts).
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Drain-then-delete: the advancing sweep hard-deletes rows whose base-resolved path does not exist, after a recorded checkpoint.

**How it works**: Phase 3 hardens path resolution first so relative paths cannot be misclassified. Phase 4 then creates a checkpoint, runs a dry-run classification count against the baseline, and lets the sweep delete dead rows batch by batch until the SQL gate reads zero.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Drain-then-delete (chosen)** | Removes pollution from every channel at once; no dependency on 002's predicate; checkpoint gives full reversal | Hard delete is scarier; requires dry-run discipline and quiesced scans | 8/10 |
| Deprecate-then-sweep | Two-stage feels safer; rows inspectable before final delete | Deprecated rows still rank via lexical/graph channels today, so the user-visible win is deferred to 002; doubles the migration surface; grows the unbounded deprecated set (Chain A step 3) | 4/10 |

**Why this one**: Deletion with a checkpoint is strictly more reversible than deprecation is invisible; the deprecate path fixes nothing until 002 ships.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- 12,352 dead rows stop ranking in every channel immediately (37% corpus rot removed, report §1).
- Health orphan figures become reconcilable with raw SQL (SC-003).

**What it costs**:
- A misclassification bug deletes valid rows. Mitigation: path hardening ships first (REQ-008), dry-run count gate (T013), checkpoint restore drill before the step (T006).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| False-orphan classification via relative paths | H | REQ-008 lands before the drain; adversarial path tests (T011) |
| Watcher writes during the drain shift counts | M | Quiesce scans during the step; re-run verification after |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 37% of the corpus is dead rows that rank (report §1, live-verified) |
| 2 | **Beyond Local Maxima?** | PASS | Deprecate-then-sweep evaluated and scored; rejected on channel-inconsistency evidence |
| 3 | **Sufficient?** | PASS | Delete plus checkpoint is the smallest design that removes pollution from all channels |
| 4 | **Fits Goal?** | PASS | Decomposition §001 success gate: "orphan rows -> 0 on full drain" |
| 5 | **Open Horizons?** | PASS | Leaves 002 free to define archive/tombstone semantics for rows whose files exist |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- lib/storage/incremental-index.ts: sweep resolves paths against base, then deletes confirmed-dead rows.
- handlers/memory-index.ts:684: cursor-fed sweep call so the drain actually progresses.

**How to roll back**: Restore the Phase 4 checkpoint id recorded in implementation-summary.md via the checkpoint tooling; re-run the post-step SQL to confirm pre-drain counts returned.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Backfill near_duplicate_of on Deprecated Losers; Keep the Column

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed (ratify after T020 winner validation) |
| **Date** | 2026-07-03 |
| **Deciders** | Michel Kerkmeester (operator), per phase-decomposition §001 |

---

<!-- ANCHOR:adr-002-context -->
### Context

The `near_duplicate_of` column has never been populated (0 rows live, ledger L1) while live read/clear code exists in lib/storage/near-duplicate.ts:27-113. The dup-hash collapse must decide the column's fate: backfill it during the collapse, or drop it as dead schema. Collapse losers are rows whose files exist (unlike ADR-001's dead rows), so they are deprecated rather than deleted, and provenance from loser to winner matters for later audits and for phase 002's exclusion verification.

### Constraints

- Dropping a column in SQLite means a table rebuild across a 1.3GB DB plus dist churn in every consumer.
- Phase 003 owns the save-time dedup lanes that would WRITE this column going forward; this phase must not preempt that design.
- Losers survive as deprecated rows (files exist), so there is a row to carry the backfill.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Backfill `near_duplicate_of` = winner id on every deprecated loser during the collapse migration, and keep the column.

**How it works**: The collapse migration groups active rows by logical key and content hash, keeps the validated winner (T020), sets losers to deprecated, and writes the winner id into each loser's `near_duplicate_of`. Phase 003 later decides how save-time lanes maintain the column for new near-dups.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Backfill on losers (chosen)** | Cheap (one UPDATE per loser inside the same migration); preserves loser-to-winner provenance; makes reversal a scoped UPDATE; keeps near-duplicate.ts consumers meaningful | Column stays write-once until phase 003 wires save-time population | 8/10 |
| Drop the column | Removes dead schema | Table rebuild on 1.3GB DB; deletes provenance exactly when 12,280 dup groups need it; breaks near-duplicate.ts consumers; contradicts 003's planned dedup work | 2/10 |
| Leave null and document | Zero work now | Perpetuates a never-populated column the deep dive just flagged; loses the one-time chance to backfill at collapse time | 4/10 |

**Why this one**: The collapse is the single moment the system knows every loser-winner pairing; recording it costs one UPDATE and buys auditability and cheap reversal.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Every deprecated loser points at its winner: phase 002 can verify exclusion and later audits can reconstruct the collapse.
- Wrong-winner reversal becomes a tier-swap UPDATE guided by the backfilled pointer, no checkpoint restore needed.

**What it costs**:
- The column remains save-path-dormant until phase 003. Mitigation: recorded as an explicit handoff note to 003 (CHK-143).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Backfill writes wrong winner id | M | Winner heuristic validated on sampled pairs first (T020); idempotent re-run check |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 12,280 dup-hash parents must collapse with recoverable provenance (ledger L1) |
| 2 | **Beyond Local Maxima?** | PASS | Drop and leave-null both scored |
| 3 | **Sufficient?** | PASS | One UPDATE per loser inside the existing migration transaction |
| 4 | **Fits Goal?** | PASS | Decomposition §001 names the backfill-vs-drop decision explicitly |
| 5 | **Open Horizons?** | PASS | Leaves phase 003 free to own save-time population |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- lib/search/vector-index-schema.ts: collapse migration writes `near_duplicate_of` on losers.
- lib/storage/near-duplicate.ts: helper reused/extended for the backfill write.

**How to roll back**: Scoped UPDATE clearing `near_duplicate_of` and restoring tiers for the affected logical keys (loser ledger from T022 identifies rows); checkpoint restore remains the full fallback.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Sweep Cursor Persists in a Dedicated Maintenance-State Table

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-03 |
| **Deciders** | Michel Kerkmeester (operator), per phase-decomposition §001 |

---

<!-- ANCHOR:adr-003-context -->
### Context

The sweep already returns `nextCursor`, but no storage exists for it: handlers/memory-index.ts:684 calls the sweep cursorless, so every scan re-checks the same ~200 lowest-id rows (report §2 Chain B, live-verified). The cursor needs a home that survives process restarts and is visible to any future maintenance job. The schema has no general config/kv table today (vector-index-schema.ts table inventory), so we must add storage or overload an existing table such as vec_metadata or schema_version.

### Constraints

- Must survive daemon restarts and be transactional with the sweep batch it describes.
- Must not overload tables with unrelated contracts (schema_version tracks migrations; vec_metadata belongs to the vector shards).
- Future maintenance cursors (for example an embedding-reconcile cursor in phase 004) will want the same shape.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: A small dedicated key-value maintenance-state table (key TEXT PRIMARY KEY, value, updated_at), written in the same transaction as each sweep batch.

**How it works**: A new migration creates the table; the scan handler reads the cursor key before sweeping, passes it into `sweepOrphanIndexRows({ cursor })`, and persists the returned `nextCursor` (wrapping to 0 past the highest id) in the same transaction as the batch's deletions.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Dedicated maintenance-state table (chosen)** | Clear ownership; transactional with the sweep; reusable for other maintenance cursors | One more table and migration | 9/10 |
| Reuse vec_metadata | No new table | Couples index maintenance to vector-shard metadata contracts; confusing ownership | 4/10 |
| In-memory only (status quo shape) | No schema change | Restart resets the cursor; this is the bug class being fixed | 1/10 |
| File on disk (JSON sidecar) | Trivial to write | Not transactional with the DB; drifts on crash between delete and write | 3/10 |

**Why this one**: The cursor must commit atomically with the batch it describes; only a table in the same DB gives that for one migration's cost.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Scans make monotonic progress; the 12,352-row backlog becomes drainable (Chain B closed).
- Phase 004 gains a ready home for its embedding-reconcile cadence state.

**What it costs**:
- One additional table to document. Mitigation: single-purpose schema with a comment-free, self-describing shape.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cursor advances past rows skipped by a crashed batch | L | Cursor persists in the batch transaction; wraparound re-covers all ids each full cycle |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Cursorless sweep is the direct root cause of 12,352 surviving dead rows (report §3 #4) |
| 2 | **Beyond Local Maxima?** | PASS | Table reuse, sidecar file, and in-memory options scored |
| 3 | **Sufficient?** | PASS | Single-row KV table; ~5 lines of wiring per the report's own estimate (report §7 Wave 1) |
| 4 | **Fits Goal?** | PASS | Gates the drain that delivers SC-001 |
| 5 | **Open Horizons?** | PASS | Generic key shape serves future maintenance cursors |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- lib/search/vector-index-schema.ts: migration creating the maintenance-state table.
- handlers/memory-index.ts:684 and lib/storage/incremental-index.ts:443: cursor load, pass-through, persist, wraparound.

**How to roll back**: Revert the code commit; the table is additive and inert without readers, so no data rollback is needed.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Drain, Heal, and Collapse Ship as Three Separately Revertible Checkpointed Steps

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-03 |
| **Deciders** | Michel Kerkmeester (operator), per phase emphasis in the dispatch and phase-decomposition §001 |

---

<!-- ANCHOR:adr-004-context -->
### Context

This phase deletes or rewrites roughly 12k rows across three logically distinct repairs: dead-row drain, track-prefix identity heal, and dup-hash collapse. One combined migration would be simpler to write, but a defect discovered after the fact would force reverting all three repairs at once, and the heal's correctness depends on the drain having already removed dead rows (a smaller, cleaner heal set), while the collapse depends on the heal having exposed true twins. Migration safety is the core risk of this phase: cursor persistence is trivial code; the one-shot migrations are high blast.

### Constraints

- checkpoint_create must precede every destructive step (REQ-004).
- Steps must be idempotent so an interrupted chunk can re-run (NFR-R01).
- schema_version advances once per step so partial application is observable.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Three separate migration/operation steps (drain, heal, collapse), each with its own checkpoint, its own verification SQL, and its own rollback target, executed in that order.

**How it works**: Each step starts with checkpoint_create (id recorded), runs chunked idempotent transactions, and ends with a SQL gate. A failed step restores only its own checkpoint, preserving completed predecessors. The ordering encodes the data dependency: drain shrinks the heal set; heal exposes the twins the collapse resolves.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Three separately revertible steps (chosen)** | Small blast radius per step; rollback does not undo good work; per-step gates catch defects early | More ceremony: three checkpoints, three verifications | 9/10 |
| One combined migration | Single transaction story; less ceremony | One defect reverts ~12k row-changes across all three repairs; decision-tree bugs surface only at the end; violates the phase's stated migration-safety emphasis | 3/10 |
| Two steps (drain separate, heal+collapse merged) | One less checkpoint | Heal and collapse have different reversal shapes (repoint vs tier-swap); merging blurs the rollback target | 5/10 |

**Why this one**: Reversibility per step is the explicit safety requirement for a ~12k-row rewrite; the ceremony is the point.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- A defect in any repair reverts only that repair (US-003 acceptance criteria).
- Per-step SQL gates localize failures to the step that caused them.

**What it costs**:
- Three checkpoint/verify cycles instead of one. Mitigation: the drill (T006) makes each cycle a documented, repeatable sequence.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Checkpoint storage cost for a 1.3GB DB times three | L | Checkpoints are per-step and deletable after the phase closes and verification holds |
| Restore of step N after step N+1 completed would orphan later work | M | Rollback procedure restores the FAILED step only and halts the sequence; later steps re-run after the fix |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | ~12k rows deleted/rewritten is the highest-blast data operation in the 13-phase program |
| 2 | **Beyond Local Maxima?** | PASS | Combined and two-step packagings scored |
| 3 | **Sufficient?** | PASS | Checkpoint + chunked idempotent transactions + SQL gate per step; nothing heavier (no dual-write, no shadow DB) |
| 4 | **Fits Goal?** | PASS | Directly implements the phase emphasis: plan migrations as separately revertible steps |
| 5 | **Open Horizons?** | PASS | Establishes the checkpointed-step pattern phases 002-005 reuse for their migrations |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- lib/search/vector-index-schema.ts: heal and collapse as distinct migrations; drain runs operationally through the cursor-fed sweep rather than as a schema migration.
- implementation-summary.md: per-step checkpoint id log and verification results.

**How to roll back**: Per step: restore that step's recorded checkpoint id, confirm pre-step SQL counts, fix the defect, re-run the step. Never restore a checkpoint older than the failed step.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!--
Level 3 Decision Record: One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
