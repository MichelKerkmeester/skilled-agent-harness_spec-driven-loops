---
title: "Feature Specification: Orphan Sweep Cursor and Corpus Identity Repair"
description: "The memory index carries 12,352 rows citing dead file paths (37% of the corpus) because the orphan-sweep cursor is never persisted, plus 7,012 cross-prefix duplicate pairs from the unhealed system-spec-kit to system-speckit track rename. This phase persists the sweep cursor, drains the dead rows, heals track-prefix identity, and collapses duplicate-hash rows behind a DB checkpoint."
trigger_phrases:
  - "orphan sweep cursor"
  - "dead path rows"
  - "corpus identity repair"
  - "track prefix identity heal"
  - "duplicate hash collapse"
  - "active memory projection repoint"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/001-orphan-sweep-cursor-and-corpus-identity-repair"
    last_updated_at: "2026-07-04T14:08:36.105Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 3 planning docs from deep-dive report Chains A/B and findings ledger"
    next_safe_action: "Program complete (016 shipped + pushed)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/near-duplicate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-orphan-sweep-cursor-and-corpus-identity-repair"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Winner heuristic for dup-hash collapse: confirm freshest-mtime-current-prefix rule against live data before migration"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Orphan Sweep Cursor and Corpus Identity Repair

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

37% of the memory index (12,352 of 33,101 rows) points at files that no longer exist, and 12,280 duplicate content-hash parents plus 7,012 cross-prefix twins stack the same document into the top-K of live searches. Root causes are two mechanical bugs: the orphan-sweep cursor is echoed but never persisted (report §2 Chain B), and the `system-spec-kit/` to `system-speckit/` track rename was never healed because move-reconciliation matches per-folder, not per-track (report §2 Chain A step 6). This phase fixes the trivial cursor bug, then runs three separately revertible corpus repairs (dead-row drain, identity heal, dup-hash collapse), because those repairs delete or rewrite roughly 12k rows and are the highest-blast data operations in the remediation program. The bounded identity-heal and dup-collapse migrations run behind `checkpoint_create` snapshots; the dead-row drain, which advances across scheduled scans over ~24h with the file-watcher live, cannot be cleanly restored from one pre-drain checkpoint, so it is made safe by deleting only file-absent rows and reconciling deletion counts (restore-by-count-verification).

**Key Decisions**: Drain-then-delete for dead-path rows (ADR-001), backfill `near_duplicate_of` on deprecated dup losers in the active `{id, ...}` JSON shape rather than dropping the column (ADR-002), persist the sweep cursor in a dedicated maintenance-state table (ADR-003), package drain/heal/collapse as three separately revertible steps with checkpoint-clean heal/collapse and count-verified drain (ADR-004)

**Critical Dependencies**: `checkpoint_create` tooling before the bounded heal/collapse steps; phase 002's shared active-row predicate for user-visible exclusion of deprecated dup losers

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-03 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 13 |
| **Predecessor** | 011-daemon-freshness-and-health-truthfulness (first in recommended execution order) |
| **Successor** | 002-archived-tier-and-tombstone-read-exclusions |
| **Handoff Criteria** | Orphan rows drained to 0; one active row per logical key (SQL-level invariant, cross-prefix duplicate active rows collapsed to 0) with deprecated losers still visible in ranked channels until 002's predicate lands; cursor persisted across scans; baseline-vs-after delta report committed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Deep dive remediation phase children specification.

**Scope Boundary**: Corpus and index-row repair only: orphan-sweep cursor persistence, dead-path row drain, track-prefix identity heal, `active_memory_projection` repoint, dup-hash collapse, orphan path-resolution hardening, and legacy `specs/` scope-prefix acceptance. No ranking, tier, or content-hash algorithm changes (those belong to phases 002, 003, 006, and 007).

**Dependencies**:
- Phase 011 (recommended predecessor): a trustworthy daemon/CLI surface and honest health numbers make before/after verification believable.
- Phase 002 (forward dependency): deprecated dup-collapse losers only disappear from every channel once 002's shared active-row predicate lands; this phase records loser rows so 002 can verify exclusion.
- `checkpoint_create` (`.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts`) must be operational before the bounded heal and collapse steps; the drain uses count-verification instead (no pre-drain checkpoint).

**Deliverables**:
- Persisted orphan-sweep cursor fed into `sweepOrphanIndexRows({ cursor })` with wraparound (report §3 #4).
- Full drain of the 12,352 dead-path rows via the advancing sweep, made safe by deleting only file-absent rows and reconciling deletion counts (restore-by-count-verification), not a pre-drain checkpoint (report §1; §2 Chain B).
- One-shot track-prefix identity-heal migration repointing `system-spec-kit/*` rows to `system-speckit/*` where the target exists, plus track-level rename support in move-reconciliation (report §2 Chain A step 6).
- `active_memory_projection` repoint inside `reconcileMoves` and chunked-doc reconcile coverage (report §3 #17).
- Dup-hash collapse keeping one winner per logical key, with the ADR-002 `near_duplicate_of` decision executed (ledger L1).
- Orphan path-resolution hardening and legacy `specs/` scope-prefix acceptance (ledger agent F).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`handlers/memory-index.ts:684` calls `sweepOrphanIndexRows({ limit: 200 })` with no cursor; the function defaults cursor=0 and returns `nextCursor`, which is echoed in scan results but never persisted or fed back, so every scan re-checks the same ~200 lowest-id rows forever (report §2 Chain B; ledger L2, live-verified 🟢). As a result 12,352 rows citing dead file paths (37% of 33,101) survive and rank, while health reports `orphanFiles: 25` from a 200-row sample. Independently, the `system-spec-kit/` to `system-speckit/` track rename was never healed (12,306 stale-prefix rows vs 5,658 current, 7,012 cross-prefix duplicate pairs, 12,280 duplicate content-hash parents overall), and result-time dedup keys on row id only (`hybrid-search.ts:949`), so a live query for "packet 028 memory search intelligence status" returned the same spec.md in ranks 1-4 (ledger L1 🟢).

### Purpose
After this phase, a full scan cycle drains orphan rows to zero, every logical document resolves to exactly one active index row under the current track prefix (SQL-level; search-level one-row-per-doc lands once 002's predicate excludes the deprecated losers), the identity-heal and dup-collapse migrations are each revertible from a recorded DB checkpoint, and the dead-row drain is revertible by count-verification because it deletes only file-absent rows.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Orphan-sweep cursor persistence across scans and process restarts, feeding `sweepOrphanIndexRows({ cursor })` (report §3 #4; Chain B).
- Dead-path row drain: full sweep of the 12,352 rows whose stored path no longer resolves, deleting only file-absent rows with deletion-count reconciliation (no pre-drain checkpoint; the drain spans ~24h of scheduled scans with the watcher live) (report §1).
- Track-prefix identity heal: one-shot migration repointing `system-spec-kit/*` rows to `system-speckit/*` where the target file exists; extend move-reconciliation to track-level renames (Chain A step 6).
- `active_memory_projection` repoint inside `reconcileMoves`, and reconcile coverage for chunked docs (the LIMIT 2 guard) (report §3 #17).
- Dup-hash collapse of the 12,280 duplicate content-hash parents: keep one winner per logical key, deprecate losers with `near_duplicate_of` backfill per ADR-002 (ledger L1).
- Orphan path-resolution hardening: resolve relative stored paths against the base path before the existence check (decomposition §001, ledger agent F P2 🟡).
- Legacy `specs/` scope-prefix acceptance in `normalizeSpecFolderScope`, and alignment of `getSpecsBasePaths` vs `findSpecDocuments` discovery surfaces (ledger agent F 🟡).

### Out of Scope
- Archived-tier semantics, tombstone visibility, and the shared active-row read-exclusion predicate - phase 002 owns them (report §3 #1).
- Content-hash normalization and save/dedup lane fixes that stop new snapshot churn at the source - phase 003 owns them (Chain A steps 1-3).
- Deprecated-row exclusion from FTS/BM25/graph channels - phase 002; this phase only records which rows it deprecates.
- Ranking, rescue-layer, and score-scale changes - phases 006 and 007.
- Embedding coverage and vector-shard consistency - phase 004.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts | Modify | Load persisted cursor, pass `{ cursor }` into the `sweepOrphanIndexRows` call at line 684, persist `nextCursor` after each sweep |
| .opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts | Modify | `sweepOrphanIndexRows` (line 443): path-resolution hardening + cursor contract; `reconcileMoves` (line 547): repoint `active_memory_projection` (line 657 region), track-level renames, chunked-doc coverage |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts | Modify | New migrations (current SCHEMA_VERSION 41): maintenance-state table for the cursor, identity-heal step, dup-collapse step; each separately revertible |
| .opencode/skills/system-spec-kit/mcp_server/lib/storage/near-duplicate.ts | Modify | Execute ADR-002: backfill `near_duplicate_of` on deprecated dup losers during collapse, writing the SAME `{id: winnerId, similarity, threshold}` JSON as the active writer at :141-146 (`NearDuplicateHint` shape, :12-16), never a bare integer, so the existing reader `parseNearDuplicateHint` (handlers/save/response-builder.ts:386-390, emitted :698-699) hits no format collision |
| .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts | Modify | `normalizeSpecFolderScope` (line 97): accept legacy `specs/`-prefixed scopes instead of silently rejecting |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts | Modify | Align `getSpecsBasePaths` (line 1304) with `findSpecDocuments` discovery surfaces |
| .opencode/skills/system-spec-kit/mcp_server/lib/discovery/spec-document-finder.ts | Modify | Counterpart of the discovery-surface alignment (verify in T003; may reduce to no-op) |
| .opencode/skills/system-spec-kit/mcp_server/tests/ | Modify | Unit/integration coverage for cursor persistence, heal decision tree, collapse winner rule, projection repoint |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Persist the orphan-sweep cursor across scans and restarts, and feed it back into `sweepOrphanIndexRows({ cursor })` (report §3 #4 🟢; Chain B; ledger L2) | Two consecutive scans check different id windows; cursor survives daemon restart; wraparound to 0 after the highest id; unit test asserts persisted cursor equals returned `nextCursor` |
| REQ-002 | Drain all dead-path rows once the cursor advances, deleting only file-absent rows with deletion-count reconciliation (report §1: 12,352 rows; Chain B) | After full drain cycles: `SELECT COUNT(*)` of rows citing nonexistent files = 0; the deletion count reconciles with the baseline dead-row class (no valid row deleted); rollback is restore-by-count-verification, not a checkpoint restore, because the drain spans ~24h of scheduled scans with the watcher live |
| REQ-003 | One-shot identity-heal migration repoints `system-spec-kit/*` rows to `system-speckit/*` where the target file exists, without violating `idx_memory_logical_key_active_unique` (Chain A step 6; ledger L1; vector-index-schema.ts:2402) | Post-migration: 0 active rows under the stale prefix whose target exists under the current prefix; no unique-index collision during migration (collision cases routed to the dup-collapse step); migration is individually revertible |
| REQ-004 | DB checkpoint via `checkpoint_create` before each bounded identity-heal and dup-collapse migration step (checkpoint-clean, restorable). The dead-row drain takes no restorable pre-drain checkpoint (it spans ~24h of scheduled scans with the watcher live; one checkpoint restore would lose a day of legitimate writes); its safety is restore-by-count-verification: delete only file-absent rows, reconcile deletion counts against the baseline dead-row class (phase emphasis: ~12k rows deleted/rewritten) | Checkpoint ids logged for heal and collapse; restore drill executed once on a copy and documented; drain deletion counts reconciled against the baseline with no valid-row deletion |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Repoint `active_memory_projection` inside `reconcileMoves` so path reuse cannot leave a moved row permanently unsearchable, including rows with `embedding_status='failed'` that the reconcile UPDATE guard at incremental-index.ts:665 currently excludes (report §3 #17 🟡; incremental-index.ts:657-666) | Confirm-before-fix reproduction recorded (T001); after fix, move-then-reuse scenario test shows the moved row searchable via projection; a failed-embedding fixture row is repointed, not skipped (T031) |
| REQ-006 | Extend move-reconciliation to track-level renames and to chunked docs (the LIMIT 2 guard), and cover rows with `embedding_status='failed'` that the chunked candidate select (incremental-index.ts:599-600) and the repoint UPDATE (:665) currently skip (decomposition §001; Chain A step 6) | Track-rename fixture reconciles all child rows in one pass; chunked parent with >2 rows reconciles completely; a `embedding_status='failed'` child row is included, not silently missed (T031) |
| REQ-007 | Collapse dup-hash rows: keep one winner per logical key, deprecate losers, execute ADR-002 `near_duplicate_of` backfill in the active JSON shape (ledger L1: 12,280 dup-hash parents, 7,012 cross-prefix pairs) | Post-collapse: 0 cross-prefix duplicate active-row pairs; exactly one active row per logical key; loser rows carry `near_duplicate_of` JSON `{id: winnerId, similarity, threshold}` (matching the active writer's shape), not a bare integer |
| REQ-008 | Harden orphan path resolution: resolve relative stored paths against the base path before the existence check (decomposition §001; ledger agent F P2 🟡) | Confirm-before-fix check recorded (T002); relative-path fixture rows are not falsely swept |
| REQ-009 | Accept legacy `specs/`-prefixed scopes in `normalizeSpecFolderScope` and align `getSpecsBasePaths` vs `findSpecDocuments` discovery surfaces (ledger agent F 🟡) | Confirm-before-fix check recorded (T003); scoped search with a legacy `specs/`-prefixed scope returns the same rows as the canonical scope |
| REQ-010 | Health `orphanFiles` reports an honest number or is labeled as sampled (decomposition §001 success gate; ledger L2) | `memory_health` orphan figure matches raw SQL within a documented definition after the drain |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Orphan rows drain to 0 on a full drain cycle (decomposition §001 success gate; baseline 12,352).
- **SC-002**: At 001-completion (SQL-level invariant): cross-prefix duplicate active rows drop to 0 (baseline 7,012 pairs) and exactly 1 active row exists per logical key; 001 deprecates the losers. The search-level guarantee (scoped searches return exactly 1 row per logical document) is DEFERRED to post-002, where 002's shared active-row predicate excludes the deprecated losers from ranked channels (baseline live-repro: same spec.md at ranks 1-4).
- **SC-003**: Health `orphanFiles` is honest: figure reconciles with raw SQL, or is explicitly labeled a sample (baseline: reports 25 from a 200-row sample against 12,352 actual).
- **SC-004**: The bounded heal and collapse steps each have a recorded checkpoint id and a demonstrated restore path; the dead-row drain is revertible by count-verification (deletes only file-absent rows, deletion counts reconciled against the baseline) rather than a pre-drain checkpoint. All three steps are individually revertible.
- **SC-005**: Vitest suite re-run after changes matches the captured baseline except for tests intentionally updated by this phase; the delta is reported, not asserted from memory.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `checkpoint_create` tooling (handlers/checkpoints.ts) | No safe rollback for the bounded heal/collapse row mutations | Verify checkpoint create/restore on a DB copy in Phase 1 before the heal/collapse steps; the drain instead uses count-verification (delete only file-absent rows) because it spans ~24h with the watcher live |
| Dependency | Phase 002 shared active-row predicate | Deprecated dup losers still surface via FTS/BM25/graph until 002 lands | Record loser row ids for 002 verification; note residual visibility in implementation-summary.md |
| Dependency | Live file-watcher indexing during migration | Row set shifts mid-migration (index grew +30 rows during read-only probing, ledger L6) | Quiesce or pause scans during migration steps; re-run count verification after |
| Risk | Drain deletes rows whose path is live but stored relative (false orphan) | Data loss of valid rows | REQ-008 path-resolution hardening ships BEFORE the drain; drain dry-run count compared to baseline first |
| Risk | Identity heal collides with existing current-prefix twin on the partial unique index | Migration aborts mid-way | Decision tree routes collision cases to dup-collapse instead of repoint (see §8 Edge Cases); each step in its own transaction |
| Risk | Wrong winner chosen in dup collapse | Freshest content deprecated, stale content wins | Winner heuristic confirmed against live data first (open question OQ-1); losers deprecated not deleted, so reversal is an UPDATE |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Sweep batches stay bounded (limit ~200 per batch) so scan-path event-loop stalls do not worsen; full drain completes across scheduled scans within 24h, not weeks.
- **NFR-P02**: Identity-heal and dup-collapse migrations run in chunked transactions sized so no single transaction holds the write lock longer than ~1s at 33k rows.

### Security
- **NFR-S01**: Migrations touch only the spec-kit memory SQLite DB; no path outside the DB and its checkpoint directory is written.
- **NFR-S02**: Path-resolution hardening must not resolve stored paths outside the workspace base (no traversal via `..` segments).

### Reliability
- **NFR-R01**: Each destructive step is idempotent on re-run (re-running the heal or collapse after success changes 0 rows).
- **NFR-R02**: A failed bounded migration step (heal or collapse) leaves the DB restorable from its recorded checkpoint with a single documented command sequence. The drain has no such checkpoint; a divergent drain deletion count halts the sweep for count-verification instead.

---

## 8. EDGE CASES

### Data Boundaries
- Stale-prefix row whose target exists under the current prefix AND a current-prefix row already exists: this is a duplicate, not a move; route to dup-collapse (deprecate the stale twin), never repoint (unique-index collision otherwise).
- Stale-prefix row whose target exists under the current prefix and NO current-prefix row exists: repoint the row (identity heal).
- Stale-prefix row whose target exists under neither prefix: dead row; drain-delete per ADR-001.
- Relative stored paths: resolve against the base before the existence check; a row must never be classified dead because of resolution, only because the resolved file is absent (REQ-008).

### Error Scenarios
- Checkpoint creation fails: abort the bounded step (heal or collapse) before any mutation; no heal/collapse migration statement runs without a recorded checkpoint id. The drain has no checkpoint gate (it deletes only file-absent rows and reconciles counts), so a checkpoint failure does not apply to it.
- Migration interrupted mid-chunk: chunked transactions mean completed chunks persist; re-run continues via idempotent predicates (NFR-R01).
- Watcher indexes a file mid-heal: post-step verification counts re-run; discrepancy above 0 triggers investigation before the next step.

### State Transitions
- Dup loser that is also a dead-path row: drain wins (delete); collapse only processes rows whose files exist.
- Chunked parent docs: reconcile must cover all child rows, not the first 2 (LIMIT 2 guard removed or parameterized per REQ-006).
- Failed-embedding rows (`embedding_status='failed'`, ~4,247 live per the deep-dive live-DB count): `reconcileMoves` skips them because the repoint UPDATE guard (incremental-index.ts:665) and the chunked candidate select (:599-600) both carry `AND embedding_status != 'failed'`. Projection repoint (REQ-005) and track-heal (REQ-006) must include these rows or explicitly route them, or a moved/renamed failed-embedding row stays stale and unsearchable (covered by T031).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: 7 source + tests, LOC: ~400-600, Systems: index scan path + schema migrations |
| Risk | 22/25 | Breaking: destructive one-shot migrations over ~12k rows; partial unique index collision potential |
| Research | 8/20 | Findings already verified live (🟢) or queued for confirm-before-fix (🟡) |
| Multi-Agent | 3/15 | Single direct executor; no parallel workstreams |
| Coordination | 8/15 | Forward dependency on 002 predicate; sequencing with 011 |
| **Total** | **55/100** | **Level 3** (risk-driven override: high-blast data migration) |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Drain deletes valid rows misclassified as orphans (relative-path bug live at drain time) | H | M | Land REQ-008 first; dry-run count vs baseline; delete only file-absent rows with deletion-count reconciliation (no checkpoint restore for the drain, which spans ~24h with the watcher live) |
| R-002 | Identity heal mispoints rows (wrong target mapping across prefixes) | H | L | Deterministic prefix mapping only where target file exists; per-chunk verification queries |
| R-003 | Dup collapse keeps a stale winner and deprecates fresh content | M | M | Winner heuristic validated against sampled live pairs before migration (OQ-1); losers deprecated not deleted |
| R-004 | Unique-index collision aborts the heal migration mid-way | M | M | Decision tree routes twins to collapse; chunked idempotent transactions |
| R-005 | Checkpoint restore loses writes that landed after the checkpoint | M | L | Heal/collapse quiesce scans and are bounded, so their restore window is small; the drain avoids this risk entirely by using count-verification (no pre-drain checkpoint) since it spans ~24h with the watcher live |
| R-006 | Cursor persistence bug re-sweeps or skips id ranges | L | M | Unit tests for persist/advance/wraparound; sweep is read-mostly and re-checkable |

---

## 11. USER STORIES

### US-001: Scans that finish the job (Priority: P0)

**As a** memory-system operator, **I want** the orphan sweep to resume from a persisted cursor each scan, **so that** dead index rows are eventually drained instead of the same 200 rows being re-checked forever.

**Acceptance Criteria**:
1. **Given** a persisted cursor from scan N, **When** scan N+1 runs, **Then** the sweep window starts at the persisted cursor and the cursor advances to the returned `nextCursor`.
2. **Given** the cursor reaches the highest row id, **When** the next scan runs, **Then** the cursor wraps to 0 and a full drain cycle is complete.
3. **Given** a daemon restart between scans, **When** the next scan runs, **Then** the sweep resumes from the persisted cursor, not from 0.

### US-002: One document, one result (Priority: P0)

**As a** memory-search user, **I want** each logical document to have exactly one active index row, **so that** a scoped search returns distinct documents instead of four snapshots of the same spec.md.

**Acceptance Criteria**:
1. **Given** the identity heal and dup collapse have run at 001-completion, **When** I inspect active rows by logical key, **Then** exactly one active row exists per logical key (SQL-level invariant). The search-level guarantee (a scoped search for "packet 028 memory search intelligence status" returns no two results resolving to the same canonical file path) lands post-002, once 002's active-row predicate excludes the deprecated losers from ranked channels.
2. **Given** a stale-prefix row whose target exists under the current prefix with no current twin, **When** the heal runs, **Then** the row is repointed and remains searchable.
3. **Given** cross-prefix twins for the same content, **When** the collapse runs, **Then** exactly one winner stays active and the loser is deprecated carrying `near_duplicate_of` JSON `{id: winnerId, similarity, threshold}` (the active writer's shape).

### US-003: Reversible migrations (Priority: P0)

**As a** repo maintainer, **I want** the bounded heal/collapse migrations checkpointed and the drain count-verified, each separately revertible, **so that** a bad repair over ~12k rows is an UPDATE, a scoped restore, or a halt-and-reconcile away from recovery, not a corpus rebuild.

**Acceptance Criteria**:
1. **Given** the identity-heal or dup-collapse (bounded) step is about to run, **When** the step starts, **Then** a `checkpoint_create` id is recorded before the first mutation.
2. **Given** a completed heal/collapse step produced wrong results, **When** I follow the documented rollback, **Then** the DB returns to the recorded checkpoint state for that step without undoing earlier completed steps.
3. **Given** the dead-row drain runs across scheduled scans over ~24h with the watcher live, **When** rows are deleted, **Then** only file-absent rows are removed and the deletion count is reconciled against the baseline dead-row class (restore-by-count-verification), because a single pre-drain checkpoint cannot be cleanly restored.

### US-004: Honest health numbers (Priority: P1)

**As a** memory-system operator, **I want** `memory_health` orphan figures to match reality or say they are sampled, **so that** a healthy-looking report cannot hide 12k dead rows again.

**Acceptance Criteria**:
1. **Given** the drain completed, **When** I run `memory_health`, **Then** the orphan figure reconciles with raw SQL within the documented definition.

---

## 12. OPEN QUESTIONS

- **OQ-1**: Winner heuristic for dup-hash collapse: current-prefix row with freshest source mtime is the working rule; confirm against a sample of the 7,012 live pairs before the migration (tracked as T004/T017).
- **OQ-2**: Should dead rows that are also `z_archive` content be excluded from the drain and left for phase 002's archive migration? Working answer: no, dead is dead (the file does not exist under any prefix); 002 handles rows whose files exist in z_archive. Confirm during T005 baseline capture.
- **OQ-3**: Does `findSpecDocuments` need its own change or is the `getSpecsBasePaths` alignment sufficient? Resolved by T003 confirm-before-fix evidence.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Evidence Sources**: `../research/deep-dive-report.md` (§1 live state, §2 Chains A/B, §3 findings #4/#17), `../research/findings-ledger.md` (L1, L2, agent F), `../research/phase-decomposition.md` (§ 001)

---

<!--
LEVEL 3 SPEC
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
