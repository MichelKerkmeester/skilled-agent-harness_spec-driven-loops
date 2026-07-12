---
title: "Plan: make validate_document.py number-agnostic + add a no-new-numbers guard"
description: "Re-base the catalog/playbook leaf classifier in both validate_document.py copies from the `^\\d{2}--` parent test to a structural subfolder test, keep template_rules.json prose accurate, and add a regression guard that rejects new numbered category folders."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/001-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/001-deprecate-numbered-category-prefix/002-validator-and-guard"
    last_updated_at: "2026-07-11T19:50:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase plan authored"
    next_safe_action: "Implement the classifier change"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Plan: Make validate_document.py Number-Agnostic + Add a No-New-Numbers Guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY
A small, surgical code change in two mirrored files plus a new regression guard. Replace the number-anchored
`^\d{2}--` parent test in `detect_document_type()` with a structural "parent is a subfolder of the catalog /
playbook root, not the root file itself" test so both the numbered and de-numbered forms classify during the
transition, then add a guard that FAILS when a new numbered category folder is introduced. No folders are
renamed here; this is the foundation that makes the later rename safe.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
De-numbered leaf classifies as its typed document; numbered leaf still classifies; root index file stays
excluded; new `NN--` folder trips the guard; existing sk-doc validator tests pass; both copies byte-identical in
the changed region; `validate.sh --strict` Errors 0 on this phase folder; comment-hygiene respected (no
ephemeral spec/ADR ids in code comments — keep the durable WHY).
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Leaf classification lives in `detect_document_type()` in two identical files:
`.opencode/skills/sk-doc/scripts/validate_document.py` and `.opencode/skills/sk-doc/shared/scripts/validate_document.py`
(both at `:129` for `manual_testing_playbook` and `:135` for `feature_catalog`). Today each guards its typed
return behind `re.match(r'^\d{2}--', parent)`. The structural rule keys on presence of the `feature_catalog/` /
`manual_testing_playbook/` path segment plus "the immediate parent is not the root index file" — number-agnostic
and still root-excluding. `template_rules.json` carries only prose descriptions of the shape; it is edited for
accuracy, not behavior. The no-new-numbers guard is a distinct check that scans category folders and fails on a
`^\d{2}--` basename, owned alongside the classifier so one place owns the rule.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Read both `validate_document.py` copies; confirm the `:129,135` `^\d{2}--` tests and the surrounding
   path-segment checks are identical.
2. Replace each number-anchored test with the structural subfolder test (parent is not the catalog/playbook root
   file); apply identically to both copies.
3. Correct any stale `NN--category` prose in `template_rules.json` descriptions (accuracy only).
4. Add the no-new-numbers guard (validator/CI check) that FAILS on a new `NN--` category folder.
5. Add fixtures (de-numbered leaf, numbered leaf, root index, new numbered folder) and verify; run the existing
   sk-doc validator tests; `validate.sh --strict` on this phase folder.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Unit-level fixtures exercising `detect_document_type()`: a de-numbered leaf → typed document; a numbered leaf →
typed document; the root index file → NOT a leaf; a non-leaf file under the catalog root → NOT a leaf (negative
case). Guard tests: a freshly created `NN--` folder → FAIL; a de-numbered folder → PASS. Re-run the existing
sk-doc validator test suite for no regression. `validate.sh --strict` on this phase folder.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
Independent of Phase 001; both are foundation and can land in parallel. Must land before Phase 003 authors the
migration script against the tolerant classifier and before Phase 004 renames any folder (ADR-002 sequencing).
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
`git checkout` the two `validate_document.py` copies, `template_rules.json`, and the guard/fixtures. The change
is additive-tolerant (it widens what classifies, it does not narrow), so reverting restores the prior
number-anchored behavior with no data impact.
<!-- /ANCHOR:rollback -->
