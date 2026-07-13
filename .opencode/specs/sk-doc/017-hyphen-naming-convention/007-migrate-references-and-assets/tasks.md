---
title: "Tasks: migrate references and assets (019 phase 007)"
description: "Tasks for phase 007 of the 019 kebab-case filesystem-naming program: migrate references and assets."
trigger_phrases:
  - "migrate references and assets tasks"
  - "hyphen naming phase 007 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/007-migrate-references-and-assets"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/007-migrate-references-and-assets"
    last_updated_at: "2026-07-13T11:44:19Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Tasks scaffolded from the 019 decomposition"
    next_safe_action: "Plan or execute this phase on the worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Migrate references and assets

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm predecessor phases landed and the execution worktree is clean (per this phase's spec adjacency)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Hyphenate snake_case folders/files under `references/`, `assets/`, `benchmark/` across all skills
- [ ] T003 Rewrite all cross-references and nav links to the renamed paths
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T004 Verify: Zero in-scope underscore names remain under references/assets/benchmark (excl frozen/exempt) — `git ls-files` finds 0 in-scope underscore names in those surfaces
- [ ] T005 Verify: All references to the renamed paths resolve — Markdown-link guard is clean over the touched surfaces
- [ ] T006 Verify: Exemptions are honored in these surfaces — No `.py`/vendored/generated asset name is renamed
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
