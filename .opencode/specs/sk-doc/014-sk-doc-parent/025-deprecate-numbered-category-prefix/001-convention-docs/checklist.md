---
title: "Checklist: drop the NN-- category-name mandate"
description: "Verification checklist for the convention-doc de-numbering pass."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/025-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/025-deprecate-numbered-category-prefix/001-convention-docs"
    last_updated_at: "2026-07-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase checklist authored"
    next_safe_action: "Implement doc edits"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Drop the NN-- Category-Name Mandate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol
Every item carries a grep or fresh-reader evidence line.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] Enumerated every `NN--` mandate/example in the two skills + templates + generators.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] Docs-only; no code touched; edits read coherently as de-numbered.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [x] Grep: zero surviving numbered mandate/example in edited surfaces (historical prose excluded).
- [x] `validate.sh --strict` Errors 0 on this phase folder.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] Both convention skills, their templates, and both `/create:*` generators edited (no surface missed).
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [x] No executable/config behavior changed; docs-only edit with no gate or allowlist impact.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [x] Ordering documented as owned by the root index table (both skills).
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [x] Edits confined to sk-doc convention skills, templates, and `/create:*` generators.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
De-numbered slug is the sole documented canonical form; generators emit it; grep clean; validate --strict Errors 0.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off
Convention de-numbered and internally consistent with decision-record ADR-006.
<!-- /ANCHOR:sign-off -->
