---
title: "Implementation Plan: Memory Schema and Concurrency Remediation"
description: "Fix approach for the derived-id split, in-lock embedding and retention spare-only stale snapshot."
trigger_phrases:
  - "028 memory schema concurrency plan"
  - "derived-id consolidation retention fix plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/006-review-remediation/002-memory-schema-and-concurrency"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created PENDING memory-schema-and-concurrency plan"
    next_safe_action: "Confirm the cited facts before changing storage code"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-plan-006-002-memory-schema-and-concurrency"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Memory Schema and Concurrency Remediation

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, better-sqlite3 |
| **Framework** | Spec Kit Memory storage and governance layer |
| **Storage** | SQLite vector index, causal-edge tables, retention sweep |
| **Testing** | Vitest concurrency and migration-safety tests, strict spec validation |

### Overview
Three independent storage-layer fixes. The derived-id fix aligns the migration backfill identity with the live default. The consolidation fix moves the embedding pass out of the write lock and refreshes the maintenance marker. The retention fix re-validates the spare axes inside the delete transaction. None changes a default-on runtime path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The `rule_version` hashing in `content-id.ts:67` and live default in `causal-edges.ts:125` are confirmed.
- [ ] The `BEGIN IMMEDIATE` boundary at `consolidation.ts:684` and embedding call at `701` are confirmed.
- [ ] The pre-tx snapshot at `memory-retention-sweep.ts:539-542` and in-tx apply at `612` are confirmed.

### Definition of Done
- [ ] Derived-id is single-valued across migration and live.
- [ ] Embedding runs outside the immediate transaction with a refreshed handle.
- [ ] Spare axes are re-validated in-transaction before delete.
- [ ] Strict validation exits 0 for this child phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Storage-layer correctness fixes across identity, locking and retention.

### Key Components
- **Derived-id reconciliation**: align backfill and live rule_version so identity is content-addressed and stable.
- **Out-of-tx embedding**: relocate the embedding loop and wrap it in a maintenance handle with `refresh()`.
- **In-tx spare-axis guard**: re-read and re-evaluate the spare axes before applying the delete.

### Data Flow
For identity, the same edge content plus a single rule_version yields one `derived_id` regardless of write path. For consolidation, embeddings are computed outside the lock and the long phase keeps the maintenance lease fresh. For retention, the delete decision is re-checked against committed-time axis values before removal.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `vector-index-schema.ts:1126` | v40 backfill hardcodes legacy rule_version | Align with live default | Backfilled and live edge share one `derived_id` |
| `consolidation.ts:701` | Embedding inside `BEGIN IMMEDIATE` | Move out of tx and add maintenance handle | Lock held only for the DB write, marker refreshed |
| `memory-retention-sweep.ts:612` | Applies stale spare-only decision | Re-validate spare axes in-tx | Concurrent trust raise protects the row |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the three cited identity and concurrency facts against source.
- [ ] Reconfirm the lineage stale-key and bitemporal-read caveats noted by the review where relevant.
- [ ] Capture the current test baseline for the affected suites.

### Phase 2: Core Implementation
- [ ] Align the v40 backfill rule_version with the live default and reconcile any existing skew.
- [ ] Move the semantic-edge embedding pass out of `BEGIN IMMEDIATE` and wrap it in a maintenance handle with explicit `refresh()`.
- [ ] Re-validate the spare axes inside the retention transaction before the delete at `line 687`.

### Phase 3: Verification
- [ ] Add a test proving identity parity across migration and live.
- [ ] Add a test proving the embedding pass does not hold the write lock and keeps the lease fresh.
- [ ] Add a test forcing the concurrent-writer interleaving that previously lost protection.
- [ ] Run strict validation for this child folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Identity parity | Backfill vs live `derived_id` | Vitest, content-id assertions |
| Lock behavior | Consolidation embedding pass | Vitest, lock-hold timing assertions |
| Concurrency window | Retention spare-only delete | Vitest, forced interleaving |
| Spec validation | Child phase docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `maintenance-marker.ts` TTL API | Internal | Green | Cannot refresh the lease without it |
| Existing migration test harness | Internal | Green | Cannot prove migration safety without it |
| Spec-kit validator | Internal | Green | Cannot claim phase validation without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The backfill change touches live rows or a concurrency fix regresses a default path.
- **Procedure**: Revert the specific fix, restore from the pre-change DB copy and record the blocker.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|------------|--------|
| 002 | `../spec.md` | Parent roster orders the remediation phases |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| Derived-id reconciliation | Medium | Migration-safety sensitive |
| Out-of-tx embedding | Medium | Requires maintenance-handle wiring |
| Spare-axis re-validation | Medium | Requires forced-interleaving test |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- Keep a pre-change DB copy before running the backfill reconciliation.
- Revert any fix that regresses a default-on path or an existing suite.
- Re-run `validate.sh --strict` after rollback.
<!-- /ANCHOR:enhanced-rollback -->
