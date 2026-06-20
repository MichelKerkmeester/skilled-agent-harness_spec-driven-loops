---
title: "Verification Checklist: Phase 4: tombstones-and-edge-promotion"
description: "Verified checklist for default-off tombstone gating, hard-delete preservation, skip-manual edge promotion, active/purgeable partial indexes, and entity-not-causal advisory documentation."
trigger_phrases:
  - "SPECKIT_SOFT_DELETE_TOMBSTONES default off"
  - "tombstone idempotence checklist"
  - "skip-manual edge promotion acceptance"
  - "active purgeable partial index verification"
  - "entity not causal invariant checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/005-memclaw-derived-memory-hardening/004-tombstones-and-edge-promotion"
    last_updated_at: "2026-06-10T14:30:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Checked tombstone phase evidence"
    next_safe_action: "Keep tombstone flag off until recall filters land"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-tombstones-and-edge-promotion"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Default delete remains hard-delete"
      - "Tombstone flag stays off until recall filters land"
---
# Verification Checklist: Phase 4: tombstones-and-edge-promotion

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Corrected scope documented in spec.md: default hard-delete remains active; `SPECKIT_SOFT_DELETE_TOMBSTONES=true` enables COALESCE first-timestamp tombstones.
- [x] CHK-002 [P0] Three-phase write split reconciled in plan.md: default delete gate in handlers, skip-manual in `insertEdge`, partial indexes in schema.
- [x] CHK-003 [P1] Existing substrate confirmed through source and tests: `vectorIndex.deleteMemory`, `deleted_at`, retention sweep, causal natural key, and manual provenance path.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] TypeScript check passed: `npx tsc --noEmit -p tsconfig.json` returned clean.
- [x] CHK-011 [P0] Targeted vitest passed without suite failures: 4 files, 48 tests.
- [x] CHK-012 [P1] Skip-manual edge path remains covered by `tests/causal-edges-write-safety.vitest.ts` and was not altered by this repair.
- [x] CHK-013 [P1] Delete logic follows existing writer patterns: flag-off calls `vectorIndex.deleteMemory`; flag-on keeps the single COALESCE UPDATE.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Success criteria covered: hard-delete default, flag-on tombstone first timestamp, skip-manual edge preservation, split indexes, and entity-not-causal docs.
- [x] CHK-021 [P0] Source-based delete check passed: default single delete removes the row from `memory_index` and cleans related edges.
- [x] CHK-022 [P1] Edge cases tested: repeat single delete, repeat bulk delete, flag-off active TTL reaping, and flag-on purgeable partition.
- [x] CHK-023 [P1] Stronger/automated edge overwrite risk covered by existing causal-edge write-safety suite; manual provenance is preserved.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded: cross-consumer, because delete producers and recall/retention consumers disagree unless the tombstone feature is gated.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed for single and bulk delete writers; both now use the same default-off flag gate.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for retention sweep, causal-edge tests, env docs, and phase docs; recall surfaces are documented as follow-up.
- [x] CHK-FIX-004 [P0] Adversarial table cases covered: delete hard-removes by default; flag-on delete to delete to delete keeps the first timestamp; bulk repeat preserves first timestamp.
- [x] CHK-FIX-005 [P1] Matrix axes executed: operation (`single delete | bulk delete`) x flag state (`off | on`); retention (`active expired | tombstoned expired`) x flag state (`off | on`).
- [x] CHK-FIX-006 [P1] Hostile-state edge variant remains green in causal-edge write-safety tests: repeated auto promotion does not overwrite manual provenance.
- [x] CHK-FIX-007 [P1] Evidence is pinned to explicit files and commands rather than a moving branch: targeted vitest command, tsc command, ENV count, and schema constant check.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets introduced; the new flag reads only `SPECKIT_SOFT_DELETE_TOMBSTONES`.
- [x] CHK-031 [P0] Manual-vs-auto distinction remains server-derived from existing provenance; no client flag can claim manual standing.
- [x] CHK-032 [P1] Manual `created_by`/evidence remains structurally un-overwritable by auto promotion through the existing skip-manual guard.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md, tasks.md, checklist.md, and implementation-summary.md synchronized on default-off tombstones and the recall-filter follow-up.
- [x] CHK-041 [P1] `ENV_REFERENCE.md` documents `SPECKIT_SOFT_DELETE_TOMBSTONES` and total unique variables increased from 175 to 176.
- [x] CHK-042 [P2] Entity/co-occurrence-not-causal invariant remains in place as an advisory constitutional rule; implementation summary confirms it was kept as-is.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files were written in the phase folder.
- [x] CHK-051 [P1] No scratch cleanup needed; no scratch artifacts were created.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 12 | 12/12 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-10
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
