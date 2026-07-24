---
title: "Verification Checklist: Cursor model registry and routing"
description: "Verification checklist for the Cursor model registry and routing phase."
trigger_phrases: ["cli-cursor model registry checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/005-cursor-model-registry-and-routing"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Authored checklist.md for phase 005 (Planned)"
    next_safe_action: "Author phase 006"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Cursor model registry and routing

All items below are unchecked — this phase is Planned, not yet implemented.

<!-- ANCHOR:protocol -->
## Verification Protocol
| Priority | Handling |
|---|---|
| P0 | Must pass before this phase is Complete |
| P1 | Should pass; document any gap |
| P2 | Nice-to-have; document if skipped |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION
- [ ] CHK-001 [P0] Requirements documented in `spec.md`
- [ ] CHK-002 [P0] Technical approach defined in `plan.md`
- [ ] CHK-003 [P1] Existing per-model profile read as the structural template
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## CODE QUALITY
- [ ] CHK-004 [P1] `composer.md` matches the structural shape of the existing `references/models/*.md` profiles
- [ ] CHK-005 [P1] `model-profiles.json` Composer entry is consistent with the existing entries' shape
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## TESTING
- [ ] CHK-006 [P0] Composer's auth-gated specs (context window, pricing, version slug) are TBD with a verify-at-impl-time note, not fabricated
- [ ] CHK-007 [P1] `check-prompt-quality-card-sync.sh` passes with `cli-cursor` included in its coverage arrays
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS
- [ ] CHK-008 [P1] All coverage arrays in the sync script edited consistently (no partially-gated card)
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## SECURITY
- [ ] CHK-009 [P1] No API key or account token embedded in the Composer profile or model-profiles entry
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## DOCUMENTATION
- [ ] CHK-010 [P1] `composer.md` labels Composer as Cursor-native/exclusive (the analog to Devin's swe-1.6)
- [ ] CHK-011 [P2] `_index.md` lists Composer
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION
- [ ] CHK-012 [P1] Temp files in `scratch/` only; cleaned before completion
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified |
|---|---|---|
| P0 Items | 3 | [ ]/3 |
| P1 Items | 7 | [ ]/7 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: Planned — not yet executed.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`
