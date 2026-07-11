---
title: "Implementation Summary: drop the NN-- category-name mandate"
description: "PLANNED — will record the convention-doc de-numbering once implemented: which sections of create-feature-catalog / create-manual-testing-playbook, which templates, and which /create:* generators were changed to make the bare slug canonical, plus the grep + validate evidence."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/025-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/025-deprecate-numbered-category-prefix/001-convention-docs"
    last_updated_at: "2026-07-11T19:50:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Convention de-numbered across 18 files; commit 4d0835af00"
    next_safe_action: "Complete"
    blockers: []
    completion_pct: 100
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
| **Status** | Complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built
Removed the `NN--category` folder-naming mandate from the two authoritative sk-doc convention skills
(`create-feature-catalog`, `create-manual-testing-playbook`) — their `SKILL.md`, READMEs, templates, and
examples — and from the `/create:*` generator YAMLs: **18 files** in total. The bare descriptive slug is now
documented as the sole canonical category-folder name, and display ordering is documented as owned by the root
index table (`feature_catalog.md` / `manual_testing_playbook.md`).
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
Grep-located every `NN--` mandate/example across the two convention skills, their READMEs, templates, examples,
and the `/create:*` generator YAMLs; rewrote each to the bare descriptive slug; documented ordering as
index-owned. A follow-up grep confirmed no `NN--` mandate survives outside changelog text. Commit `4d0835af00`.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions
Per `decision-record.md` ADR-006: the descriptive slug is canonical and ordering is documented as owned by the
root index table.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification
`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` Errors 0. Grep is clean
of any `NN--` category mandate outside changelog history across the 18 edited surfaces.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations
Docs-only phase — it removed the naming mandate but renamed no folders; the actual tree rename was executed in
Phase 004. Historical/changelog references to the numbered form are deliberately left intact.
<!-- /ANCHOR:limitations -->
