---
title: "Implementation Summary: make validate_document.py number-agnostic + add a no-new-numbers guard"
description: "PLANNED — will record the structural leaf-classifier change once implemented: the exact edits to both validate_document.py copies (the `^\\d{2}--` parent test at `:129,135` → structural subfolder test), any template_rules.json prose correction, the new no-new-numbers guard, and the fixture + test evidence."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/001-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/001-deprecate-numbered-category-prefix/002-validator-and-guard"
    last_updated_at: "2026-07-12T11:46:10Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Structural leaf classifier + no-new-numbers guard; commit cc422d6037"
    next_safe_action: "Complete"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Make validate_document.py Number-Agnostic + Add a No-New-Numbers Guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | 002-validator-and-guard |
| **Status** | Complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built
Changed the leaf classification in `validate_document.py` from an `^\d{2}--` parent-prefix test to a structural
grandparent test (`parent.parent == feature_catalog` / `manual_testing_playbook`), so BOTH the numbered
`NN--slug` form and the de-numbered `slug` form classify as their typed document while the root index file stays
excluded. Added a standalone opt-in no-new-numbers guard (`check_no_numbered_categories.py`), symlinked into
`scripts/`.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
Replaced the `^\d{2}--` parent test with the structural grandparent test so a catalog/playbook leaf classifies
by *being a subfolder* of the typed root rather than by its numeric prefix; added the standalone opt-in guard
and its `scripts/` symlink, and covered both with a new classification + guard suite. Commit `cc422d6037`.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions
Per `decision-record.md`: ADR-003 (classify catalog/playbook leaves by structure, not by number — applies
identically to both copies) and ADR-005 (add a no-new-numbers regression guard that fails on a newly introduced
numbered category folder, grandfathering nothing). Sequencing follows ADR-002: this tolerant classifier lands
before any rename.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification
`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-doc/014-sk-doc-parent/027-catalog-naming-convention/001-deprecate-numbered-category-prefix/002-validator-and-guard --strict`
Errors 0. New classification + guard suite **9/9 PASS** (de-numbered leaf and numbered leaf both classify; root
index excluded; new `NN--` folder trips the guard); existing `test_feature_catalog_validation` **6/6 PASS**.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations
The classifier tolerates BOTH numbered and de-numbered forms by design; after Phase 004's rename the
no-new-numbers guard keeps the de-numbered form the only legal one going forward. The guard is standalone and
opt-in — it is not wired into the default validator run.
<!-- /ANCHOR:limitations -->
