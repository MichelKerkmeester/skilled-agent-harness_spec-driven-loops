---
title: "Verification Checklist: Phase 4: tombstones-and-edge-promotion [template:level_2/checklist.md]"
description: "Verification acceptance items for Phase 4 tombstones-and-edge-promotion: first-timestamp-idempotent soft-delete, natural-key skip-manual causal-edge promotion, active/purgeable partial indexes, and the entity-not-causal invariant. Plan only — all items unchecked."
trigger_phrases:
  - "tombstone idempotence checklist"
  - "skip-manual edge promotion acceptance"
  - "active purgeable partial index verification"
  - "entity not causal invariant checklist"
  - "first-timestamp deleted_at verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/007-memclaw-derived-memory-hardening/004-tombstones-and-edge-promotion"
    last_updated_at: "2026-06-06T10:10:49Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Draft Level 2 verification checklist for tombstones-and-edge-promotion"
    next_safe_action: "Verify CHK items once tombstone and edge logic implemented"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-tombstones-and-edge-promotion"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
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

- [ ] CHK-001 [P0] First-timestamp tombstone, skip-manual edge promotion, active/purgeable indexes, and the entity-not-causal invariant documented in spec.md
- [ ] CHK-002 [P0] Three-phase write split approach (COALESCE in the transactional delete writer / skip-manual in `insertEdge` / partial indexes in schema) defined in plan.md
- [ ] CHK-003 [P1] Existing substrate (`causal_edges` natural key + `created_by` default `'manual'`, the `deleted_at` column, the retention sweep) confirmed available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Partial-index migration, delete-handler, and `insertEdge` edits pass tsc/lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings from the migration or the delete/edge write-path changes
- [ ] CHK-012 [P1] Skip-manual on-conflict path returns a typed "skipped manual edge" hint rather than throwing or silently overwriting the manual row
- [ ] CHK-013 [P1] COALESCE tombstone and skip-manual edge logic follow the existing transactional-writer patterns (no new delete or edge surface introduced)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All four success criteria (SC-001 idempotent delete, SC-002 manual edge preserved, SC-003 split partial indexes fast, SC-004 entity-not-causal explicit) met
- [ ] CHK-021 [P0] Manual end-to-end check: a repeat delete does not extend retention and a causal search reports "skipped manual edge" plus tombstone state
- [ ] CHK-022 [P1] Edge cases tested: repeat delete on single + bulk paths, auto-promote against a manual edge, and an unknown-provenance edge treated as manual
- [ ] CHK-023 [P1] Error scenarios validated: auto-promoter proposing a stronger edge against a manual row still preserves the manual `created_by`/evidence
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed for soft-delete writers (`deleted_at`) and edge upserts (`insertEdge`/`created_by`), or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the active/purgeable partial indexes, the `insertEdge` on-conflict path, the response "skipped manual edge" hint, the retention sweep, the constitutional loader, and tests.
- [ ] CHK-FIX-004 [P0] Edge-promotion and tombstone tests include adversarial table cases: delete → delete → delete (timestamp stable), auto-promote onto a manual edge with stronger proposed strength, and an existing edge with unknown provenance treated as manual.
- [ ] CHK-FIX-005 [P1] Matrix axes listed before completion: operation (`single delete | bulk delete`) x prior state (`never deleted | already tombstoned`); and edge source (`auto`) x existing-row provenance (`manual | auto | unknown`).
- [ ] CHK-FIX-006 [P1] Hostile-state variant executed: a repeated identical auto-promotion against a manual edge holds skip-manual and overwrites nothing.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in the partial-index migration or the delete/edge handler edits
- [ ] CHK-031 [P0] The manual-vs-auto distinction is server-derived from the existing row's provenance (`created_by`/`source_kind`) and never from a client-asserted strength or flag
- [ ] CHK-032 [P1] A manual `created_by`/evidence is structurally un-overwritable by an auto-promoter through the `insertEdge` on-conflict path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md / plan.md / tasks.md / implementation-summary.md synchronized on the Level 2 scope
- [ ] CHK-041 [P1] First-timestamp tombstones, the skip-manual edge rule, and the active/purgeable indexes documented in the mcp_server README/memory-system docs
- [ ] CHK-042 [P2] Constitutional rule file `entity-cooccurrence-is-not-causal.md` surfaces as advisory in validation output
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 12 | 0/12 |
| P2 Items | 2 | 0/2 |

**Verification Date**: Not started — plan only
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
