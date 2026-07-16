---
title: "Tasks: memory_save Replay Enrichment Repair"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "memory_save enrichment repair tasks"
  - "schema v30 task breakdown"
  - "enrichment marker tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/004-memory-save-enrichment-repair"
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
# Tasks: memory_save Replay Enrichment Repair

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

> Ordered so each step is verifiable before the next. The implementer reads current code at each site first.

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Schema v30 foundation in `lib/search/vector-index-schema.ts`.

- [ ] T001 Bump `SCHEMA_VERSION` 29 → 30 (`mcp_server/lib/search/vector-index-schema.ts`)
- [ ] T002 Add the 4 marker columns to the fresh-schema definition: `post_insert_enrichment_status TEXT NOT NULL DEFAULT 'complete'`, `post_insert_enrichment_state TEXT`, `post_insert_enrichment_completed_at TEXT`, `post_insert_enrichment_version INTEGER` (`mcp_server/lib/search/vector-index-schema.ts`)
- [ ] T003 Add an idempotent v30 migration block (guarded `ADD COLUMN`, safe to run twice) (`mcp_server/lib/search/vector-index-schema.ts`)
- [ ] T004 Add the partial index on `post_insert_enrichment_status != 'complete'` (`mcp_server/lib/search/vector-index-schema.ts`)
- [ ] T005 Verify fresh DB + a v29→v30 upgrade fixture both land identical columns/index and the migration is a no-op on second run (`mcp_server/lib/search/vector-index-schema.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Marker helpers (new file), save-path wiring, and scan backfill.

- [ ] T006 Create `handlers/save/enrichment-state.ts` with `markEnrichmentPending`, `recordEnrichmentResult`, `needsEnrichmentRepair`, `repairEnrichmentOnReplay`, `repairIncompleteMarkers` (`mcp_server/handlers/save/enrichment-state.ts`)
- [ ] T007 Make `repairEnrichmentOnReplay` reuse `runPostInsertEnrichmentIfEnabled()` / `handlers/save/post-insert.ts` machinery - no duplicated enrichment logic (`mcp_server/handlers/save/enrichment-state.ts`)
- [ ] T008 Keep all marker helpers synchronous except the repair functions (which await enrichment) (`mcp_server/handlers/save/enrichment-state.ts`)
- [ ] T009 In the primary write transaction, call `markEnrichmentPending` for the new memory id (commits atomically with the row) (`mcp_server/handlers/memory-save.ts`)
- [ ] T010 Immediately after `runPostInsertEnrichmentIfEnabled()`, call `recordEnrichmentResult` with the real outcome (`mcp_server/handlers/memory-save.ts`)
- [ ] T011 On the `duplicatePrecheck` replay return (row id present), repair if `needsEnrichmentRepair`, then return (`mcp_server/handlers/memory-save.ts`)
- [ ] T012 On the `dupResult` replay return (row id present), same replay-repair behavior (`mcp_server/handlers/memory-save.ts`)
- [ ] T013 Do NOT make `dedup.ts` helpers async (the repair runs in the async caller after the sync verdict) (`mcp_server/handlers/save/dedup.ts`)
- [ ] T014 [P] Under the scan lease, call `repairIncompleteMarkers(deps, { limit })` (bounded) and report the count in the scan response; keep this edit additive + in a distinct region from any packet 005 sentinel check (lines 249-333) (`mcp_server/handlers/memory-index.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Tests for every path, then verify + document.

- [ ] T015 Migration v30 test (fresh + upgrade idempotent) (`mcp_server/`)
- [ ] T016 Save-path marker lifecycle test (pending in txn → complete after) (`mcp_server/`)
- [ ] T017 Replay repair test for `unchanged` and `duplicate` with a pending marker (`mcp_server/`)
- [ ] T018 No-op replay test for `complete` (stable edge/row counts) (`mcp_server/`)
- [ ] T019 `deferred` not repaired on normal replay test (`mcp_server/`)
- [ ] T020 Backfill test: repairs a pending marker under scan + reports count (`mcp_server/`)
- [ ] T021 Repeated-repair idempotency test (`mcp_server/`)
- [ ] T022 Run `npx vitest run` for new + affected suites (all green) and scoped typecheck of touched TS (no new errors) (`mcp_server/`)
- [ ] T023 Fill `implementation-summary.md` (what shipped, evidence, deploy-gated note) and run `validate.sh --strict` for this packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] New + affected vitest suites pass and scoped typecheck has no new errors
- [ ] Boundary respected: no `dist/` rebuild, no daemon restart, no live-DB migration, no edits to launcher/front-proxy files or to packet 005's checkpoint files (branch + unit tests only)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
