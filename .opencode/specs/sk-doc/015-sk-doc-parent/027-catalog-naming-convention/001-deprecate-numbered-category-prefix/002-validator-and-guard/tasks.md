---
title: "Tasks: make validate_document.py number-agnostic + add a no-new-numbers guard"
description: "Task breakdown for the structural leaf-classifier change (both copies) and the no-new-numbers regression guard."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention/001-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention/001-deprecate-numbered-category-prefix/002-validator-and-guard"
    last_updated_at: "2026-07-11T19:50:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase tasks authored"
    next_safe_action: "Implement the classifier change"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Make validate_document.py Number-Agnostic + Add a No-New-Numbers Guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation
`[x]` complete · `[ ]` pending.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] Read both `validate_document.py` copies; confirm the `^\d{2}--` parent tests at `:129,135` and their
  surrounding path-segment checks are identical across `scripts/` and `shared/scripts/`.
- [x] Confirm whether `template_rules.json` hard-codes the number in any executable rule (vs prose description).
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] Replace the `^\d{2}--` parent test with the structural "parent is a subfolder, not the catalog root file"
  test in `scripts/validate_document.py` (both `manual_testing_playbook` and `feature_catalog` branches).
- [x] Apply the identical change to `shared/scripts/validate_document.py`.
- [x] Correct any stale `NN--category` prose in `template_rules.json` descriptions (accuracy only).
- [x] Add the no-new-numbers guard (validator/CI check) that FAILS on a new `feature_catalog/NN--*/` or
  `manual_testing_playbook/NN--*/` folder.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] Add fixtures: de-numbered leaf, numbered leaf, root index file, non-leaf negative, new numbered folder.
- [x] De-numbered leaf → typed document; numbered leaf → typed document; root index → NOT a leaf.
- [x] New `NN--` folder → guard FAILS; de-numbered folder → guard PASSES.
- [x] Existing sk-doc validator tests pass; both copies byte-identical in the changed region.
- [x] `validate.sh --strict` Errors 0 on this phase folder.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
Both classifier copies are number-agnostic (tolerate numbered + de-numbered, exclude the root index), the
no-new-numbers guard rejects new numbered folders, and the existing suite is green.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
Foundation for Phase 003 (migration tooling authors against the tolerant classifier) and Phase 004 (rename must
not land until this tolerant classifier ships — ADR-002). Consistent with Phase 001 (convention docs).
<!-- /ANCHOR:cross-refs -->
