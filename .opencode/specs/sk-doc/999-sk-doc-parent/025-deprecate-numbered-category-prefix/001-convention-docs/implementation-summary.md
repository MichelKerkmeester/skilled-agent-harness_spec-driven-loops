---
title: "Implementation Summary: drop the NN-- category-name mandate"
description: "PLANNED — will record the convention-doc de-numbering once implemented: which sections of create-feature-catalog / create-manual-testing-playbook, which templates, and which /create:* generators were changed to make the bare slug canonical, plus the grep + validate evidence."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/999-sk-doc-parent/025-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-sk-doc-parent/025-deprecate-numbered-category-prefix/001-convention-docs"
    last_updated_at: "2026-07-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Stub — phase not yet implemented"
    next_safe_action: "Implement doc edits"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Drop the NN-- Category-Name Mandate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | 001-convention-docs |
| **Status** | Planned (not yet implemented) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built
_Planned._ To be filled on completion with the exact sections/templates/generators edited to make the bare
descriptive slug the sole canonical category-folder form.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
_Planned._ Grep-locate every `NN--` mandate/example, rewrite to the bare slug, update the `/create:*`
generators, then grep-verify and validate.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions
Per `decision-record.md` ADR-006: the descriptive slug is canonical and ordering is documented as owned by the
root index table.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification
_Planned._ `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` Errors 0,
plus a grep asserting no surviving numbered mandate/example in the edited surfaces.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations
_Planned._ Docs-only phase; the tree still carries numbered folders until Phase 004 executes the rename.
<!-- /ANCHOR:limitations -->
