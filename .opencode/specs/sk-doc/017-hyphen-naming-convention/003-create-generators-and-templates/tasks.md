---
title: "Tasks: create-* generators and templates (017 phase 003)"
description: "Tasks for phase 003 of the 017 kebab-case filesystem-naming program: create-* generators and templates."
trigger_phrases:
  - "create-* generators and templates tasks"
  - "hyphen naming phase 003 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/003-create-generators-and-templates"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/003-create-generators-and-templates"
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
# Tasks: create-* generators and templates

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

- [ ] T002 create-feature-catalog + create-manual-testing-playbook SKILL.md + templates
- [ ] T003 The `/create:*` generators (reverse the 027 `category_name`/`feature_name.md` emission back to `category-name`/`feature-name.md`)
- [ ] T004 `create-skill/scripts/package_skill.py` and its regression tests
- [ ] T005 Any other create-* mode that emits filesystem names
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify: The create-* generators emit hyphenated folder and file names — A dry-run generation produces `category-name/` and `feature-name.md`
- [ ] T007 Verify: Templates and SKILL docs document the hyphenated canonical form — No template or SKILL example shows an underscore filesystem name
- [ ] T008 Verify: The 027 generator changes are reversed — The generators no longer emit `category_name`/`feature_name.md`
- [ ] T009 Verify: `package_skill.py` emits and checks hyphenated names and its tests pass — The package_skill regression tests are green against the hyphenated policy
- [ ] T010 Verify: Every generator produces only canonical names when run into a temp dir — A generate-into-temp comparison finds no underscore filesystem name
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
