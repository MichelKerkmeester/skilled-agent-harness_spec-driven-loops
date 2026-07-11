---
title: "Tasks: drop the NN-- category-name mandate"
description: "Task breakdown for the convention-doc de-numbering pass."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/999-sk-doc-parent/025-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-sk-doc-parent/025-deprecate-numbered-category-prefix/001-convention-docs"
    last_updated_at: "2026-07-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase tasks authored"
    next_safe_action: "Implement the doc edits"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Drop the NN-- Category-Name Mandate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation
`[x]` complete · `[ ]` pending.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] Grep the two convention skills + templates + `/create:*` generators for every `NN--` mandate/example.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] Rewrite `create-feature-catalog/SKILL.md` naming rule + examples to the bare slug.
- [x] Rewrite `create-manual-testing-playbook/SKILL.md` naming rule + examples to the bare slug.
- [x] Update the sk-doc asset templates (frontmatter/scaffold snippets) to de-numbered form.
- [x] Update the `/create:feature-catalog` + `/create:manual-testing-playbook` generators.
- [x] Add the "ordering is owned by the root index table" note to both skills.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] Grep confirms zero surviving numbered mandate/example in edited surfaces.
- [x] Fresh reader confirms coherence; `validate.sh --strict` Errors 0.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
Convention + templates + generators emit only de-numbered slugs; ordering documented as index-owned.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
Foundation for Phase 004 (rename) and consistent with Phase 002 (no-new-numbers guard).
<!-- /ANCHOR:cross-refs -->
