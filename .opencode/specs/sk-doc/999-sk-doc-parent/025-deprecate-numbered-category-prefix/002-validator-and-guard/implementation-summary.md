---
title: "Implementation Summary: make validate_document.py number-agnostic + add a no-new-numbers guard"
description: "PLANNED — will record the structural leaf-classifier change once implemented: the exact edits to both validate_document.py copies (the `^\\d{2}--` parent test at `:129,135` → structural subfolder test), any template_rules.json prose correction, the new no-new-numbers guard, and the fixture + test evidence."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/999-sk-doc-parent/025-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-sk-doc-parent/025-deprecate-numbered-category-prefix/002-validator-and-guard"
    last_updated_at: "2026-07-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Stub — phase not yet implemented"
    next_safe_action: "Implement the classifier change"
    blockers: []
    completion_pct: 0
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
| **Status** | Planned (not yet implemented) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built
_Planned._ To be filled on completion with the exact edits that re-base catalog/playbook leaf classification in
both `validate_document.py` copies from the `^\d{2}--` parent test to a structural subfolder test, plus the new
no-new-numbers guard and any `template_rules.json` prose correction.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
_Planned._ Confirm the `:129,135` tests are identical across `scripts/` and `shared/scripts/`, replace each with
the structural "parent is a subfolder, not the catalog/playbook root file" test, add the guard, add fixtures
(de-numbered leaf, numbered leaf, root index, non-leaf negative, new numbered folder), then run the existing
sk-doc validator suite and validate.
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
_Planned._ `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-doc/999-sk-doc-parent/025-deprecate-numbered-category-prefix/002-validator-and-guard --strict`
Errors 0, plus fixture assertions (de-numbered leaf and numbered leaf both classify; root index excluded; new
`NN--` folder trips the guard) and a green run of the existing sk-doc validator tests.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations
_Planned._ The classifier tolerates BOTH numbered and de-numbered forms by design (transition state); the tree
still carries numbered folders until Phase 004 executes the rename, after which the no-new-numbers guard keeps
the de-numbered form the only legal one.
<!-- /ANCHOR:limitations -->
