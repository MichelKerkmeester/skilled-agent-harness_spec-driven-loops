---
title: "Verification Checklist: Phase 1: provenance-and-audit [template:level_2/checklist.md]"
description: "Verification acceptance items for Phase 1 provenance-and-audit: server-derived source_kind on every write, the auto-cannot-overwrite-manual/constitutional guard at write ingress, deduped mutation_ledger audit, and the constitutional immunity rule. Plan only — all items unchecked."
trigger_phrases:
  - "provenance audit checklist"
  - "source_kind verification items"
  - "overwrite guard acceptance"
  - "mutation_ledger audit checklist"
  - "constitutional immunity verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/007-memclaw-derived-memory-hardening/001-provenance-and-audit"
    last_updated_at: "2026-06-06T10:10:45Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Draft Level 2 verification checklist for provenance-and-audit"
    next_safe_action: "Verify CHK items once provenance guard implemented"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-provenance-and-audit"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 1: provenance-and-audit

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

- [ ] CHK-001 [P0] `source_kind` enum, write-ingress overwrite guard, audit, and constitutional rule documented in spec.md
- [ ] CHK-002 [P0] Three-phase write split approach (pre-mutation guard / writer / post-write audit) defined in plan.md
- [ ] CHK-003 [P1] Existing write path (`create-record.ts`, `memory-crud-update.ts`, `mutation_ledger`, `provenance_source`) confirmed available as substrate
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Schema migration and handler edits pass tsc/lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings from the migration or write-path changes
- [ ] CHK-012 [P1] Overwrite-guard refusal path returns a typed hint rather than throwing or silently dropping all fields
- [ ] CHK-013 [P1] `source_kind` derivation and guard follow the existing handler/provenance patterns (no new write surface introduced)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All four success criteria (SC-001 provenance-tagged, SC-002 manual protected, SC-003 deduped audit, SC-004 zero added steps) met
- [ ] CHK-021 [P0] Manual end-to-end check: an automated update of a human-authored field is skipped and the response carries the "skipped to protect manual data" hint
- [ ] CHK-022 [P1] Edge cases tested: legacy null `source_kind` backfill, mixed manual+safe payload, and `agent`→`human` origin transition
- [ ] CHK-023 [P1] Error scenarios validated: `mutation_ledger` append failure surfaces a warning without blocking the write
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed for `source_kind`/`provenance_source` writers, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the new `source_kind` column, the ledger audit-append entry point, the response `hints[]` field, the constitutional loader, and tests.
- [ ] CHK-FIX-004 [P0] Overwrite-guard tests include adversarial table cases: mixed manual+safe payload, repeated identical automated mutation, legitimate human-over-automated write, and a defaulted/ambiguous origin.
- [ ] CHK-FIX-005 [P1] Matrix axes listed before completion: `source_kind` (`human|agent|system|import|feedback`) x operation (`create|update`) x target field class (`manual/constitutional | safe`).
- [ ] CHK-FIX-006 [P1] Hostile-state variant executed: audit dedup holds under retried/duplicated mutation delivery.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in the schema migration or handler edits
- [ ] CHK-031 [P0] `source_kind` is server-derived from caller/path/tool at write ingress and never accepted from a client-asserted field (provenance cannot be forged)
- [ ] CHK-032 [P1] Manual/constitutional fields are structurally un-overwritable by an automated (`source_kind != human`) write through every normal save/update path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md / plan.md / tasks.md / implementation-summary.md synchronized on the Level 2 scope
- [ ] CHK-041 [P1] `source_kind` and the write-ingress overwrite guard documented in the mcp_server README/memory-system docs
- [ ] CHK-042 [P2] Constitutional rule file `automated-writers-never-overwrite-manual.md` surfaces as advisory in validation output
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
