---
title: "Tasks: migrate catalog and playbook content (019 phase 006)"
description: "Tasks for phase 006 of the 019 kebab-case filesystem-naming program: migrate catalog and playbook content."
trigger_phrases:
  - "migrate catalog and playbook content tasks"
  - "hyphen naming phase 006 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/006-migrate-catalog-and-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/006-migrate-catalog-and-playbook"
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
# Tasks: Migrate catalog and playbook content

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

- [ ] T002 Rename the two catalog/playbook roots and all underscore content folders/files back to hyphens, all skills
- [ ] T003 Rewrite index tables + `category:` frontmatter + cross-references in lockstep
- [ ] T004 Validate each family against the 002 classifier before commit
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Verify: Zero underscore catalog/playbook filesystem names remain (excl frozen) — `git ls-files` finds 0 underscore names under the two roots
- [ ] T006 Verify: The catalog roots are hyphenated and still classify correctly — Leaves under `feature-catalog` type correctly under the 002 logic
- [ ] T007 Verify: All catalog/playbook references resolve after the rename — Index tables + frontmatter + cross-refs point at hyphenated paths
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
