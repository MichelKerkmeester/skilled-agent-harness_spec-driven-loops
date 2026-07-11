---
title: "Checklist: make validate_document.py number-agnostic + add a no-new-numbers guard"
description: "Verification checklist for the structural leaf-classifier change (both copies) and the no-new-numbers regression guard."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/025-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/025-deprecate-numbered-category-prefix/002-validator-and-guard"
    last_updated_at: "2026-07-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase checklist authored"
    next_safe_action: "Implement the classifier change"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Make validate_document.py Number-Agnostic + Add a No-New-Numbers Guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol
Every item carries a fixture result, test-run, or grep evidence line.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] Confirmed the `^\d{2}--` parent tests at `:129,135` and their surrounding path-segment checks are
  identical across both `validate_document.py` copies.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] Both copies changed identically and stay byte-identical in the changed region (no drift).
- [x] No ephemeral spec/ADR/phase ids embedded in code comments; comments keep the durable WHY.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [x] De-numbered leaf → classified `feature_catalog` / `playbook_feature` (not `readme`).
- [x] Numbered `NN--slug` leaf → still classified as its typed document.
- [x] Root `feature_catalog.md` / `manual_testing_playbook.md` index → NOT classified as a leaf.
- [x] New `NN--` category folder → no-new-numbers guard FAILS; de-numbered folder → guard PASSES.
- [x] Existing sk-doc validator tests pass (no regression).
- [x] `validate.sh --strict` Errors 0 on this phase folder.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] Both `validate_document.py` copies, the guard, and (if needed) `template_rules.json` prose all updated —
  no surface missed.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [x] Change only widens classification and adds a fail-closed guard; no gate, allowlist, or execution-path
  behavior weakened.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [x] `template_rules.json` prose descriptions no longer imply the number is required for classification.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [x] Edits confined to the two sk-doc `validate_document.py` copies, `template_rules.json`, and the new guard +
  its fixtures.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
Both classifier copies tolerate numbered + de-numbered leaves and exclude the root index; the no-new-numbers
guard rejects new numbered folders; existing suite green; validate --strict Errors 0.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off
Classifier is number-agnostic and internally consistent with decision-record ADR-003 (structural
classification) and ADR-005 (no-new-numbers guard).
<!-- /ANCHOR:sign-off -->
