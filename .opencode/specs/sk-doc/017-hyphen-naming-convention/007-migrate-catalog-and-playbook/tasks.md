---
title: "Tasks: migrate catalog and playbook (017 phase 007)"
description: "Tasks for phase 007 of the 017 kebab-case filesystem-naming program: migrate catalog and playbook."
trigger_phrases:
  - "migrate catalog and playbook tasks"
  - "hyphen naming phase 007 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/007-migrate-catalog-and-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/007-migrate-catalog-and-playbook"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Tasks authored from the 16-phase decomposition"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Migrate catalog and playbook

<!-- SPECKIT_LEVEL: 2 -->
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

- [ ] T001 Confirm predecessor phases landed and the pinned worktree is clean (per this phase's spec adjacency)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Rename `feature_catalog`->`feature-catalog`, `manual_testing_playbook`->`manual-testing-playbook`, and all underscore content back to hyphens, all skills
- [ ] T003 Rewrite index tables + `category:` frontmatter VALUES + cross-references in lockstep
- [ ] T004 Validate each family against the 002 classifier before commit; enumerate every leaf type
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Verify: Zero underscore catalog/playbook filesystem names remain (excl frozen) — `git ls-files` finds 0 underscore names under the two roots
- [ ] T006 Verify: The catalog roots are hyphenated and still classify correctly — Every leaf under `feature-catalog` types correctly under the 002 logic — zero `readme` downgrade
- [ ] T007 Verify: All catalog/playbook references resolve after the rename — Index tables + frontmatter values + cross-refs point at hyphenated paths
- [ ] T008 Verify: Only frontmatter VALUES that are paths/slugs change; keys are untouched — Frontmatter key diff is empty; only path-valued fields moved
- [ ] T009 Verify: Lane C scenario IDs and semantics are unchanged vs baseline — Scenario IDs, prompts, expectations, and scores match the 000 snapshot
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
