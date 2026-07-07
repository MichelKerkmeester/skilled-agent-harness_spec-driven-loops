---
title: "Checklist: Phase 1 — sk-code-review Checklist Rows"
description: "Verification checklist for the three additive sk-code-review checklist rows."
trigger_phrases:
  - "phase 1 checklist sk-code-review rows"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: .opencode/specs/sk-code/z_archive/010-sk-code-ponytail-based-refinement/001-skreview-checklist-rows
    last_updated_at: 2026-06-13T11:40:00Z
    last_updated_by: claude-opus
    recent_action: "Phase 1 planned from 146 research recs #2/#6/#7"
    next_safe_action: "/speckit:implement — verify each item on completion"
---
# Checklist: Phase 1 — sk-code-review Checklist Rows

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Doc-edit phase. Verification = wording correctness + a dry-run review + strict validate. Mark `[x]` with evidence.

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P1] Read the live `code_quality_checklist.md` §6/§7 and `removal_plan.md` §2 so new rows match existing style + headings.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-002 [P0] §6 hand-rolled-stdlib row added, phrased "prefer the standard API when behavior AND edge cases match".
- [x] CHK-003 [P0] §6 native-duplication row added (custom/dependency code duplicating a platform/runtime feature).
- [x] CHK-004 [P0] §7 needed-ness prompt added, routed to a removal recommendation, P2 default / P1 if risk, cross-ref `removal_plan.md` (not duplicated).
- [x] CHK-005 [P0] `Replacement` column added to `removal_plan.md` §2.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-006 [P1] Dry-run review on a reinvented-stdlib + unrequested-code snippet fires all three rows; the removal recommendation names a replacement.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-007 [P1] No severity-model change — over-engineering defaults P2; no numeric gate; P0/P1/P2 contract + `Review status:` final line unchanged.
- [x] CHK-008 [P2] No duplication of the CLAUDE.md anti-pattern table or existing KISS/DRY rows (cross-reference instead).

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-009 [P1] The needed-ness/removal prompts never apply to security/auth/persistence/sandboxing/public-contract/correctness findings.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-010 [P1] Both reference docs read cleanly; rows are self-contained and evidence-oriented.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-011 [P2] Only `code_quality_checklist.md` + `removal_plan.md` touched; nothing else in scope.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-012 [P0] `validate.sh <this-phase> --strict` exit 0; all P0/P1 items checked with evidence before claiming completion.

<!-- /ANCHOR:summary -->
