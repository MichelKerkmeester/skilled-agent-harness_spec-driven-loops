---
title: "Decision Record: Orphan Sweep Cursor and Corpus Identity Repair"
description: "Four decisions: drain-then-delete for dead-path rows, near_duplicate_of backfill matching the active JSON writer instead of column drop, dedicated maintenance-state table for the sweep cursor, and three separately revertible migration steps (checkpoint-clean heal/collapse, count-verified drain)."
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
    last_updated_at: "2026-07-04T17:51:11.784Z"
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
- The drain runs across scheduled scans over ~24h with the file-watcher live, so a single pre-drain checkpoint cannot be cleanly restored (restoring it would discard a day of legitimate writes). The drain's safety therefore rests on deleting ONLY rows whose base-resolved path is absent and reconciling deletion counts against the baseline dead-row class (restore-by-count-verification), not on a checkpoint restore.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Drain-then-delete: the advancing sweep hard-deletes rows whose base-resolved path does not exist, after a recorded checkpoint.

**How it works**: Phase 3 hardens path resolution first so relative paths cannot be misclassified. Phase 4 then captures the baseline dead-row count, runs a dry-run classification count against it, and lets the advancing sweep delete only base-resolved-absent rows batch by batch across scheduled scans until the SQL gate reads zero, reconciling the running deletion count against the baseline class (restore-by-count-verification). Because the drain spans ~24h with the watcher live, it does not rely on a restorable pre-drain checkpoint; heal and collapse (ADR-004) remain checkpoint-clean bounded transactions.
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
- A misclassification bug deletes valid rows. Mitigation: path hardening ships first (REQ-008), dry-run count gate (T013), and running deletion-count reconciliation against the baseline dead-row class; because the drain deletes only base-resolved-absent rows, no valid row enters the delete set when resolution is correct. The checkpoint restore drill (T006) covers the bounded heal/collapse steps, not the drain.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| False-orphan classification via relative paths | H | REQ-008 lands before the drain; adversarial path tests (T011) |
| Watcher writes during the drain shift counts | M | Expected: the drain runs via scheduled scans with the watcher live, so classification is by current file-absence at delete time; live writes never enter the file-absent delete set; reconcile deletion counts each cycle |
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

**How to roll back**: The drain has no clean pre-drain checkpoint to restore (it spans ~24h of scheduled scans with the watcher live, so a restore would discard a day of legitimate writes). Rollback is restore-by-count-verification: because only base-resolved-absent rows are deleted, reconcile the deletion count against the baseline dead-row class; any discrepancy beyond that class halts the drain for investigation before more rows are removed. Dead rows point at absent files, so there is nothing on disk to re-index if a mismatch is found.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Backfill near_duplicate_of on Deprecated Losers; Keep the Column

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed (ratify after T004 format/consumer confirm and T020 winner validation) |
| **Date** | 2026-07-03 |
| **Deciders** | Michel Kerkmeester (operator), per phase-decomposition §001 |

---

<!-- ANCHOR:adr-002-context -->
### Context

The `near_duplicate_of` column carries no rows in the live corpus today (ledger L1), but it is NOT dead schema. `lib/storage/near-duplicate.ts:141-146` has an ACTIVE save-time writer that stores a JSON hint `{id, similarity, threshold}` (the `NearDuplicateHint` shape at near-duplicate.ts:12-16; `JSON.stringify(hint)` at :146; gated by `isMemoryIdempotencyEnabled()`), and `handlers/save/response-builder.ts:386-390` parses it back via `parseNearDuplicateHint` and emits it at :698-699. The earlier premise that "only read/clear code exists" was false: an active writer and reader already agree on a JSON format. The dup-hash collapse must decide the column's fate: backfill it during the collapse, or drop it as dead schema. Because a live writer/reader already define the on-disk shape, any backfill MUST write the SAME `{id, ...}` JSON, never a bare integer id, or it collides with that format and the reader (`parseNearDuplicateHint`, which requires all three numeric fields, near-duplicate.ts:43-51) rejects it. Collapse losers are rows whose files exist (unlike ADR-001's dead rows), so they are deprecated rather than deleted, and provenance from loser to winner matters for later audits and for phase 002's exclusion verification.

### Constraints

- Dropping a column in SQLite means a table rebuild across a 1.3GB DB plus dist churn in every consumer.
- The existing near-duplicate writer (near-duplicate.ts:141-146) already defines the on-disk JSON format, so the backfill must match it exactly; phase 003 owns broader save-time dedup design and must not be preempted.
- Losers survive as deprecated rows (files exist), so there is a row to carry the backfill.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Backfill `near_duplicate_of` on every deprecated loser during the collapse migration using the SAME JSON shape the active writer uses (`{id: winnerId, similarity, threshold}`, never a bare integer), and keep the column.

**How it works**: The collapse migration groups active rows by logical key and content hash, keeps the validated winner (T020), sets losers to deprecated, and writes `{id: winnerId, similarity, threshold}` (matching `NearDuplicateHint` at near-duplicate.ts:12-16) into each loser's `near_duplicate_of` so the existing reader `parseNearDuplicateHint` (response-builder.ts:386-390) parses it without a format collision. The reader requires all three numeric fields (near-duplicate.ts:43-51), so the backfill supplies the collapse's similarity/threshold (content-hash-identical losers, finalized in T004/T021), not just an id. Phase 003 later decides how save-time lanes maintain the column for new near-dups.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Backfill on losers (chosen)** | Cheap (one UPDATE per loser inside the same migration); preserves loser-to-winner provenance; makes reversal a scoped UPDATE; writes the SAME `{id, similarity, threshold}` JSON the active near-duplicate.ts writer/reader already use | Must exactly match that JSON shape or the reader rejects it (mitigated by reusing the `NearDuplicateHint` shape); save-time population for new near-dups still lands in phase 003 | 8/10 |
| Drop the column | Removes assumed-dead schema | Table rebuild on 1.3GB DB; deletes provenance exactly when 12,280 dup groups need it; breaks the ACTIVE near-duplicate.ts writer (:141-146) and the response-builder reader (:386-390/:698-699); contradicts 003's planned dedup work | 2/10 |
| Leave null and document | Zero work now | Leaves collapse provenance unrecorded even though an active writer/reader already use the column; loses the one-time chance to backfill at collapse time | 4/10 |

**Why this one**: The collapse is the single moment the system knows every loser-winner pairing; recording it costs one UPDATE and buys auditability and cheap reversal.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Every deprecated loser points at its winner in the active `{id, similarity, threshold}` JSON shape: phase 002 can verify exclusion, the existing response-builder reader surfaces the pointer without a format collision, and later audits can reconstruct the collapse.
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
| 3 | **Sufficient?** | PASS | One UPDATE per loser inside the existing migration transaction, writing the active `{id, ...}` JSON shape so no new format is introduced |
| 4 | **Fits Goal?** | PASS | Decomposition §001 names the backfill-vs-drop decision explicitly |
| 5 | **Open Horizons?** | PASS | Leaves phase 003 free to own save-time population |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- lib/search/vector-index-schema.ts: collapse migration writes `near_duplicate_of` on losers as `{id: winnerId, similarity, threshold}` JSON.
- lib/storage/near-duplicate.ts: the existing writer's JSON shape (`NearDuplicateHint`, :12-16; `JSON.stringify` at :146) is reused for the backfill so the format matches the live writer and the `parseNearDuplicateHint` reader.

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
## ADR-004: Drain, Heal, and Collapse Ship as Three Separately Revertible Steps (Checkpoint-Clean Heal/Collapse, Count-Verified Drain)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-03 |
| **Deciders** | Michel Kerkmeester (operator), per phase emphasis in the dispatch and phase-decomposition §001 |

---

<!-- ANCHOR:adr-004-context -->
### Context

This phase deletes or rewrites roughly 12k rows across three logically distinct repairs: dead-row drain, track-prefix identity heal, and dup-hash collapse. One combined migration would be simpler to write, but a defect discovered after the fact would force reverting all three repairs at once, and the heal's correctness depends on the drain having already removed dead rows (a smaller, cleaner heal set), while the collapse depends on the heal having exposed true twins. Migration safety is the core risk of this phase: cursor persistence is trivial code; the one-shot migrations are high blast. The three steps also have DIFFERENT rollback shapes. The bounded heal and collapse migrations run inside a single quiesced window, so they are cleanly checkpoint-restorable. The drain does not: it runs as the advancing sweep across scheduled scans over ~24h with the file-watcher live, so a single pre-drain checkpoint cannot be cleanly restored (it would discard a day of legitimate writes). The drain's safety is restore-by-count-verification (delete only file-absent rows, reconcile counts), not checkpoint restore.

### Constraints

- checkpoint_create must precede each bounded migration step (heal, collapse). The drain instead deletes only file-absent rows and reconciles deletion counts (restore-by-count-verification), because it spans ~24h of scheduled scans with the watcher live and has no cleanly restorable pre-drain checkpoint.
- Steps must be idempotent so an interrupted chunk can re-run (NFR-R01).
- schema_version advances once per migration step so partial application is observable.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Three separate steps (drain, heal, collapse), each with its own verification SQL and its own rollback target, executed in that order. The bounded heal and collapse migrations each take a checkpoint (checkpoint-clean, restorable); the drain, which runs across scheduled scans, uses restore-by-count-verification (delete only file-absent rows, reconcile counts) instead of a checkpoint.

**How it works**: Each bounded migration step (heal, collapse) starts with checkpoint_create (id recorded), runs chunked idempotent transactions, and ends with a SQL gate; a failed migration restores only its own checkpoint, preserving completed predecessors. The drain instead runs as the advancing sweep across scheduled scans, deleting only file-absent rows and reconciling deletion counts against the baseline (no checkpoint restore, because the ~24h watcher-live window would lose legitimate writes). The ordering encodes the data dependency: drain shrinks the heal set; heal exposes the twins the collapse resolves.
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
| Checkpoint storage cost for a 1.3GB DB times two (heal, collapse; the drain takes none) | L | Checkpoints are per-migration and deletable after the phase closes and verification holds |
| Restore of step N after step N+1 completed would orphan later work | M | Rollback procedure restores the FAILED step only and halts the sequence; later steps re-run after the fix |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | ~12k rows deleted/rewritten is the highest-blast data operation in the 13-phase program |
| 2 | **Beyond Local Maxima?** | PASS | Combined and two-step packagings scored |
| 3 | **Sufficient?** | PASS | Checkpoint (heal/collapse) or count-verification (drain) + chunked idempotent transactions + SQL gate per step; nothing heavier (no dual-write, no shadow DB) |
| 4 | **Fits Goal?** | PASS | Directly implements the phase emphasis: plan migrations as separately revertible steps |
| 5 | **Open Horizons?** | PASS | Establishes the checkpointed-step pattern phases 002-005 reuse for their migrations |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- lib/search/vector-index-schema.ts: heal and collapse as distinct checkpointed migrations; drain runs operationally through the cursor-fed sweep rather than as a schema migration, so it has no schema-migration checkpoint and relies on count-verification.
- implementation-summary.md: per-migration checkpoint id log (heal, collapse), the drain's baseline/deletion-count reconciliation, and verification results.

**How to roll back**: Per bounded migration (heal, collapse): restore that step's recorded checkpoint id, confirm pre-step SQL counts, fix the defect, re-run the step; never restore a checkpoint older than the failed step. For the drain: there is no checkpoint to restore (it spans ~24h of scheduled scans with the watcher live); reconcile the deletion count against the baseline dead-row class and halt the sweep if the count diverges from the file-absent class.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!--
Level 3 Decision Record: One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
