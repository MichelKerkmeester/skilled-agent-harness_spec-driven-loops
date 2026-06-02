---
title: "Implementation Summary: memory_save Replay Enrichment Repair"
description: "PLANNED stub: schema v30 enrichment-completion marker + repair-on-replay + scan-lease backfill. Filled with shipped state and evidence after implementation."
trigger_phrases:
  - "memory_save enrichment repair summary"
  - "schema v30 implementation status"
  - "enrichment repair shipped state"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

> Status: PLANNED - implementation pending (gpt-5.5-fast xhigh, isolated worktree). This summary is authored at planning time and will be filled with shipped state + evidence after implementation. Production DB stays on schema v29; the v30 migration is implemented + unit-tested on a branch only, never run against the live DB in this packet.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-memory-save-enrichment-repair |
| **Completed** | Pending (planned) |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The plan is authored (spec/plan/tasks/checklist/decision-record) and no code is written yet. When implemented, this packet closes the last known replay-idempotency hole in `memory_save`: a row that is committed but killed before secondary enrichment finishes becomes searchable again on the next replay instead of staying invisible until a full scan.

### Schema v30 enrichment marker

Bumps `SCHEMA_VERSION` 29 → 30 in `mcp_server/lib/search/vector-index-schema.ts` and adds four narrow, defaulted columns - `post_insert_enrichment_status` (TEXT NOT NULL DEFAULT 'complete'), `post_insert_enrichment_state` (TEXT JSON of completed steps), `post_insert_enrichment_completed_at` (TEXT ISO), `post_insert_enrichment_version` (INTEGER) - plus an idempotent v30 migration and a partial index on `status != 'complete'`. Status: planned.

### Marker helpers and repair

Adds `mcp_server/handlers/save/enrichment-state.ts` with `markEnrichmentPending`, `recordEnrichmentResult`, `needsEnrichmentRepair`, `repairEnrichmentOnReplay`, and `repairIncompleteMarkers`. Repair reuses the existing `runPostInsertEnrichmentIfEnabled()` machinery (`handlers/save/post-insert.ts`) so there is no duplicated enrichment logic. Status: planned.

### Save-path wiring and scan backfill

`mcp_server/handlers/memory-save.ts` marks `pending` inside the primary transaction, records the result after enrichment, and repairs on the `duplicatePrecheck` and `dupResult` replay returns when `needsEnrichmentRepair`. `mcp_server/handlers/memory-index.ts` runs a bounded `repairIncompleteMarkers({ limit })` under the scan lease and reports the count, kept additive and in a distinct region from packet 005's edit at lines 249-333. Status: planned.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/search/vector-index-schema.ts` | Modified (planned) | Schema v30 columns + idempotent migration + partial index |
| `mcp_server/handlers/save/enrichment-state.ts` | Created (planned) | Marker helpers + idempotent repair entrypoints |
| `mcp_server/handlers/memory-save.ts` | Modified (planned) | Mark pending in txn, record result, repair on replay returns |
| `mcp_server/handlers/memory-index.ts` | Modified (planned) | Bounded scan-lease backfill + reported repair count |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery is gated and not yet executed. The implementation runs on an isolated branch against throwaway test DBs only, verified by new + affected vitest suites and a scoped typecheck, then `validate.sh --strict` for the packet. The v30 migration runs on the shared DB only on a separate, explicitly-confirmed daemon deploy - no `dist/` rebuild, no daemon restart, and no live-DB migration happen inside this packet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Durable marker + repair-on-replay (not in-transaction enrichment) | Keeps the current save latency model; only a cheap marker write joins the primary transaction while enrichment stays outside it |
| 4 marker columns, default `complete` | Enables targeted per-step repair and avoids a mass re-enrichment storm on upgrade because history defaults to already-enriched |
| `deferred` is skipped by normal replay/backfill | Respects intentional planner-first / feature-disabled non-enrichment; only an explicit operator backfill processes it |
| `dedup.ts` stays synchronous | Avoids an async ripple through every dedup caller; the async repair runs in the `memory-save.ts` caller after the sync verdict |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Migration v30 (fresh + upgrade idempotent) | Pending |
| Save-path marker lifecycle (pending in txn → complete after) | Pending |
| Replay repair (`unchanged` + `duplicate` with pending marker) | Pending |
| No-op replay of `complete` (stable edge/row counts) | Pending |
| `deferred` not repaired on normal replay | Pending |
| Scan backfill repairs a pending marker + reports count | Pending |
| Repeated-repair idempotency | Pending |
| vitest (new + affected suites) | Pending |
| Scoped typecheck of touched TS | Pending |
| `validate.sh --strict` (this packet) | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Deploy is gated.** The v30 migration runs on the shared DB only on a separate, explicitly-confirmed daemon deploy. See decision-record ADR-2 (default `complete`) and the ADR-4 deploy open-question.
2. **`deferred` rows need explicit backfill.** Normal replay and scan backfill skip `deferred`; an operator backfill is the only path that enriches them.
3. **Shared-file integration risk.** `memory-index.ts` is also edited by packet 005 (lines 249-333); this packet's edit must stay additive and in a distinct region to ease integration.
<!-- /ANCHOR:limitations -->
