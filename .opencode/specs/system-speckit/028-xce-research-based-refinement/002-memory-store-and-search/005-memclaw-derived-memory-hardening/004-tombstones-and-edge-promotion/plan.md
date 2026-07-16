---
title: "Implementation Plan: Phase 4: tombstones-and-edge-promotion"
description: "Keeps default hard-delete behavior, gates first-timestamp tombstones behind SPECKIT_SOFT_DELETE_TOMBSTONES, preserves manual causal edges during auto promotion, and keeps active/purgeable partial indexes plus the entity-not-causal invariant."
trigger_phrases:
  - "tombstone soft-delete idempotent deleted_at"
  - "causal edge promotion skip manual created_by"
  - "active purgeable partial index split"
  - "natural-key edge upsert preserve manual provenance"
  - "tombstones edge promotion plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/005-memclaw-derived-memory-hardening/004-tombstones-and-edge-promotion"
    last_updated_at: "2026-06-10T14:30:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Reconciled plan to flag-gated tombstones"
    next_safe_action: "Keep tombstone flag off until recall filters land"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-tombstones-and-edge-promotion"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: tombstones-and-edge-promotion

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript / Node |
| **Framework** | Spec Kit Memory MCP server (`.opencode/skills/system-spec-kit/mcp_server/`) |
| **Storage** | SQLite + vector store |
| **Testing** | vitest |

### Overview
This phase fixes delete and causal-edge lifecycle hazards without changing shipped delete behavior by default. The existing hard-delete path stays active while `SPECKIT_SOFT_DELETE_TOMBSTONES` is unset. When the flag is set to `true`, the tombstone writer COALESCE-preserves the original `deleted_at` so a repeat delete cannot extend retention. `insertEdge` in `causal-edges.ts` is natural-key idempotent and skip-manual: its on-conflict path does not overwrite a manual `created_by`/evidence. Two partial indexes (active `deleted_at IS NULL`, purgeable `deleted_at IS NOT NULL`) are additive at schema version 37, and the retention sweep uses the purgeable partition only when the tombstone flag is enabled. The entity-not-causal boundary is recorded as an advisory invariant.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented - spec.md corrected the hard-delete premise and the default-off tombstone flag.
- [x] Success criteria measurable - vitest covers hard-delete default, flag-on first timestamp, and retention partitioning.
- [x] Dependencies identified - recall-filter follow-up is documented as the blocker for enabling tombstones.

### Definition of Done
- [x] All acceptance criteria met - skip-manual, partial indexes, default delete behavior, and flag-on tombstones are covered.
- [x] Tests passing - targeted vitest suite passed 4 files and 48 tests.
- [x] Docs updated - spec, plan, tasks, checklist, implementation summary, metadata, and env reference reconciled.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three-phase write split (program-wide architectural rule). Each invariant lives in the correct phase of the memory write path: the first-timestamp tombstone belongs to the transactional writer (the soft-delete UPDATE itself), the natural-key skip-manual decision belongs to the transactional writer in `causal-edges.ts` (`insertEdge`), and the partial indexes are schema. Post-mutation hooks (cache invalidation, audit append, advisory enrichment) stay out of these integrity decisions; the retention sweep and post-insert enrichment only consume the results.

### Key Components
- **Default-off tombstone flag (`handlers/memory-crud-delete.ts`, `handlers/memory-bulk-delete.ts`)**: The default path calls `vectorIndex.deleteMemory` and preserves hard-delete cleanup. `SPECKIT_SOFT_DELETE_TOMBSTONES=true` switches to `deleted_at = COALESCE(deleted_at, <now>)` so the first tombstone moment wins.
- **Natural-key skip-manual edge promotion (`lib/storage/causal-edges.ts`)**: `insertEdge` already dedups on the natural key `(source_id, target_id, relation, source_anchor, target_anchor)`; its on-conflict branch currently runs `created_by = ?` unconditionally. The change: when the existing row is manual provenance, skip the `created_by`/evidence overwrite (skip the update, or add parallel low-strength evidence only). New auto edges still respect the bounded auto-edge caps.
- **Partial indexes (`lib/search/vector-index-schema.ts`)**: Add an active partial index (`WHERE deleted_at IS NULL`) for default recall and a purgeable partial index (`WHERE deleted_at IS NOT NULL`) for the retention sweep, with a forward migration. Each path scans only its partition.
- **Promotion callers + sweep (`handlers/causal-graph.ts`, `handlers/causal-links-processor.ts`, `lib/governance/memory-retention-sweep.ts`)**: Auto-promotion callers pass provenance so the skip-manual rule has the signal; the retention sweep uses the purgeable index only when the tombstone flag is enabled and otherwise reaps active expired rows as before. Entity/co-occurrence stays recall evidence only.
- **Entity-not-causal invariant (`constitutional/entity-cooccurrence-is-not-causal.md`)**: Records that entity/co-occurrence signals are recall evidence only and never causal truth; advisory in validation.

### Data Flow
A delete request reaches `memory-crud-delete.ts` or `memory-bulk-delete.ts`. With `SPECKIT_SOFT_DELETE_TOMBSTONES` unset, the handler calls `vectorIndex.deleteMemory` and the row is removed through the existing cleanup path. With the flag set to `true`, the handler writes `deleted_at = COALESCE(deleted_at, <now>)`, so a row already tombstoned keeps its original timestamp and retention is computed from the first delete. Separately, post-insert enrichment in `causal-links-processor.ts`/`causal-graph.ts` proposes causal edges; each goes through `insertEdge`. On a natural-key match, `insertEdge` checks the existing row's provenance and preserves manual rows. Recall filtering for tombstones is a follow-up requirement before enabling the flag.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `handlers/memory-crud-delete.ts` | Producer: deletes a single memory row. | update - default to existing hard delete; use COALESCE tombstone only when `SPECKIT_SOFT_DELETE_TOMBSTONES=true`. | Vitest proves default row removal and flag-on first timestamp. |
| `handlers/memory-bulk-delete.ts` | Producer: deletes many rows in one pass. | update - default to existing hard delete; use COALESCE tombstone only when `SPECKIT_SOFT_DELETE_TOMBSTONES=true`. | Vitest proves flag-on bulk first timestamp. |
| `lib/storage/causal-edges.ts` | Producer/storage: `insertEdge` upserts on the natural key; on-conflict runs `created_by = ?`. | update — skip the `created_by`/evidence overwrite when the existing row is manual provenance. | Skip-manual vitest; `rg -n 'insertEdge|created_by|ON CONFLICT|UPDATE causal_edges' lib/storage/causal-edges.ts`. |
| `handlers/causal-graph.ts` | Consumer: auto-promotion entry point that calls into edge insert. | update — pass provenance so skip-manual has the signal; report "skipped manual edge". | `rg -n 'insertEdge|insertEdgesBatch|created_by|skipped' handlers/causal-graph.ts`; skipped-edge hint in vitest. |
| `handlers/causal-links-processor.ts` | Consumer: post-insert enrichment that proposes/promotes edges. | update — route promotions through the skip-manual path; keep entity/co-occurrence as recall evidence only. | `rg -n 'insertEdge|promote|created_by|entity|co-occur' handlers/causal-links-processor.ts`. |
| `lib/search/vector-index-schema.ts` | Owns the memory index schema and migrations. | update — add active (`deleted_at IS NULL`) + purgeable (`deleted_at IS NOT NULL`) partial indexes + forward migration. | Migration runs clean; query plan uses each index; `rg -n 'deleted_at|CREATE INDEX|WHERE' lib/search/vector-index-schema.ts`. |
| `lib/governance/memory-retention-sweep.ts` | Consumer: retention sweep that reports ledger/tombstone state. | update - default to active TTL reaping; use the purgeable partial index only when the tombstone flag is enabled. | Vitest proves flag-off active expiry and flag-on purgeable partition. |
| `constitutional/` loader + validation | Loads constitutional rules and surfaces them in validation. | update (add-only) — register the entity-not-causal rule; advisory surfacing. | Rule appears in validation output; loader picks up the new file. |

Required inventories:
- Same-class producers (soft-delete writers): `rg -n 'deleted_at' .opencode/skills/system-spec-kit/mcp_server/handlers .opencode/skills/system-spec-kit/mcp_server/lib`.
- Same-class producers (edge upserts): `rg -n 'insertEdge|insertEdgesBatch|created_by|ON CONFLICT' .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts .opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts .opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts`.
- Consumers of changed symbols: `rg -n 'deleted_at|insertEdge|created_by' .opencode/skills/system-spec-kit --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: operation (`single delete | bulk delete`) x prior state (`never deleted | already tombstoned`); and edge promotion source (`auto`) x existing-row provenance (`manual | auto | unknown`). Required rows: a repeat delete on both paths, and an auto-promote against each provenance class.
- Algorithm invariant: a repeat soft-delete MUST NOT change `deleted_at` (COALESCE keeps the first value); an auto edge promotion MUST NOT overwrite a manual `created_by`/evidence (skip or parallel low-strength evidence only); entity/co-occurrence MUST stay recall evidence and never set causal `created_by`. Adversarial cases: delete → delete → delete (timestamp stable), auto-promote onto a manual edge with stronger proposed strength, and an existing edge with unknown provenance (treated as manual).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Add the active (`deleted_at IS NULL`) and purgeable (`deleted_at IS NOT NULL`) partial indexes to `vector-index-schema.ts` with a forward migration.
- [x] Confirm the delete writer location and gate tombstones behind `SPECKIT_SOFT_DELETE_TOMBSTONES`.
- [x] Confirm the manual-provenance signal the skip-manual rule keys off (`causal_edges.created_by` default `'manual'`; `source_kind` provenance pass-through).

### Phase 2: Core Implementation
- [x] Make single-row tombstones first-timestamp-idempotent behind the default-off flag.
- [x] Apply the same COALESCE-preserve to the bulk tombstone path behind the default-off flag.
- [x] Make `insertEdge` skip-manual in `causal-edges.ts`: on a natural-key match against a manual row, never overwrite `created_by`/evidence.
- [x] Pass provenance from the auto-promotion callers and keep entity/co-occurrence as recall evidence only.
- [x] Point the retention sweep at the purgeable partial index only when the tombstone flag is enabled; otherwise active TTL reaping remains unchanged.
- [x] Add the entity-not-causal constitutional rule file under `constitutional/`.

### Phase 3: Verification
- [x] vitest: default delete hard-removes the row; flag-on repeat delete (single and bulk) preserves the first `deleted_at`.
- [x] vitest: auto edge promotion against a manual edge never overwrites `created_by`/evidence.
- [x] vitest / query-plan check: additive partial indexes exist and the retention sweep uses the purgeable partition only when flag-on.
- [x] Update phase docs and env reference to describe the default-off flag, recall-filter follow-up, skip-manual edge rule, and entity-not-causal invariant.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | First-timestamp tombstone idempotence (single + bulk soft-delete) and `insertEdge` skip-manual on a natural-key match. | vitest |
| Integration | Delete → repeat delete round-trip via the handlers (retention unchanged); auto-promote against manual/auto/unknown edges through `causal-graph.ts` / `causal-links-processor.ts`. | vitest |
| Manual | One end-to-end check that a repeat delete does not extend retention and that `/memory:manage` / causal search reports "skipped manual edge" and tombstone state. | MCP call / `/memory:manage` / `/doctor memory` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 provenance (`source_kind`) as the manual-vs-auto distinguisher | Internal | Green | Skip-manual can still key off `causal_edges.created_by` alone, but is less precise without `source_kind`. |
| `causal_edges` natural unique key + `created_by` column (schema v18) | Internal | Green | REQ-002 blocked — the skip-manual rule has no natural-key match or provenance marker to branch on. |
| Existing soft-delete writer (`memory-crud-delete.ts`, `memory-bulk-delete.ts`) | Internal | Green | REQ-001 blocked — the COALESCE-preserve change has no transactional writer to land in. |
| Retention sweep (`memory-retention-sweep.ts`) + bounded auto-edge caps | Internal | Green | Purgeable-index wiring (REQ-003) and cap-respecting promotion lose their existing host; idempotence still possible. |
| Constitutional rule loader + validation surface | Internal | Green | REQ-004 blocked — the entity-not-causal invariant cannot be registered or surfaced as advisory. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The COALESCE-preserve change breaks delete semantics or leaves inconsistent tombstone state, the skip-manual rule wrongly blocks legitimate auto promotion, or the partial-index migration degrades recall/sweep performance.
- **Procedure**: The COALESCE change is a one-line revert in each delete handler (drop back to a plain `deleted_at = <now>` write) and is behaviorally reversible. The partial indexes are additive and droppable via the migration's down path with no data change. The skip-manual branch in `insertEdge` can be reverted to the prior unconditional `created_by = ?` on-conflict update; treat unknown provenance as manual while the rule is active so the failure mode is "too cautious" (a skipped auto edge), never "manual edge clobbered". Revert the handler/storage/schema edits and re-run the migration's down path.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: partial indexes + migration, confirm writer + provenance signal) ──► Phase 2 (Core: COALESCE tombstone, skip-manual insertEdge, sweep + rule) ──► Phase 3 (Verify: vitest + query-plan + manual)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None (substrate already exists: `causal_edges` natural key + `created_by`, `deleted_at` column, retention sweep) | Core |
| Core | Setup (the partial indexes must exist before the sweep targets the purgeable one; the writer/provenance signal must be confirmed before COALESCE + skip-manual land) | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (active + purgeable partial indexes + forward migration + confirm soft-delete writer and manual-provenance signal) | Low | 1-2 hours |
| Core Implementation (COALESCE-preserve tombstone single + bulk, skip-manual `insertEdge`, provenance-passing callers, purgeable-index sweep, entity-not-causal rule) | Med | 4-6 hours |
| Verification (vitest repeat-delete + skip-manual + provenance-matrix cases, query-plan coverage for both indexes, manual MCP check, docs) | Low | 1-2 hours |
| **Total** | | **6-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup of the memory SQLite DB taken before running the partial-index migration
- [ ] Skip-manual rule wired to treat unknown provenance as manual (the failure mode is a skipped auto edge, never a clobbered manual edge)
- [ ] Query plan reviewed so recall uses the active index and the retention sweep uses the purgeable index before first production sweep

### Rollback Procedure
1. Revert the `insertEdge` skip-manual branch to the prior unconditional `created_by = ?` on-conflict update so auto promotion resumes its previous behavior.
2. Revert the delete handlers (`memory-crud-delete.ts`, `memory-bulk-delete.ts`) from `deleted_at = COALESCE(deleted_at, <now>)` back to the plain `deleted_at = <now>` write.
3. Re-run the migration's down path to drop the active and purgeable partial indexes, then smoke-test `memory_delete` / bulk delete and a causal search round-trip and confirm no tombstone or edge rows were lost.
4. No stakeholder notification needed — this is a local single-user system whose only user-visible signal is the quiet "skipped manual edge" hint.

### Data Reversal
- **Has data migrations?** Yes — the forward migration adds the active and purgeable partial indexes over the existing `deleted_at` column.
- **Reversal procedure**: Run the migration's down path to drop both partial indexes; existing rows are unaffected because the indexes are additive and no `deleted_at`, `created_by`, or evidence value was overwritten by the index change.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
