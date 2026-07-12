---
title: "Plan: drop the NN-- category-name mandate"
description: "Edit the two sk-doc convention skills, their templates, and the /create:* generators to make the bare slug canonical and document index-owned ordering."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/001-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/001-deprecate-numbered-category-prefix/001-convention-docs"
    last_updated_at: "2026-07-11T19:50:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase plan authored"
    next_safe_action: "Implement the doc edits"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Plan: Drop the NN-- Category-Name Mandate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY
A docs-only edit pass across the two convention skills, their asset templates, and the `/create:*` generators.
No code, no folder renames. Establishes the de-numbered slug as canonical before the tree is migrated.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
Zero surviving `NN--category` mandates/examples in the edited surfaces (grep); ordering documented as
index-owned; `validate.sh --strict` Errors 0 on this phase folder; comment-hygiene N/A (docs).
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Authoritative text lives in `create-feature-catalog/SKILL.md` and `create-manual-testing-playbook/SKILL.md`;
generation lives in the `/create:*` command definitions; scaffolds live in the sk-doc asset templates. Edit all
three layers so an author reading any of them produces a de-numbered folder.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Locate every `NN--` mandate, example, and template snippet in the two skills + templates + generators (grep).
2. Rewrite the naming rule → bare slug; rewrite examples; add the "ordering is index-owned" note.
3. Update the `/create:*` generators to emit de-numbered folders + index rows.
4. Grep-verify no numbered mandate survives; validate --strict.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Grep the edited files for `[0-9][0-9]--` in a *mandate/example* context (not historical prose). Dispatch a
fresh reader to confirm the convention now reads coherently as de-numbered. `validate.sh --strict`.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
Independent of Phase 002; both are foundation and can land in parallel.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
`git checkout` the edited SKILL.md / template / command files. Docs-only; no runtime impact.
<!-- /ANCHOR:rollback -->
