---
title: "Tasks: create-* generators and templates (019 phase 003)"
description: "Tasks for phase 003 of the 019 kebab-case filesystem-naming program: create-* generators and templates."
trigger_phrases:
  - "create-* generators and templates tasks"
  - "hyphen naming phase 003 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/003-create-generators-and-templates"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/003-create-generators-and-templates"
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
# Tasks: create-* generators and templates

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

- [ ] T002 create-feature-catalog + create-manual-testing-playbook SKILL.md + templates
- [ ] T003 The `/create:*` generators (reverse the 027 `category_name`/`feature_name.md` emission back to `category-name`/`feature-name.md`)
- [ ] T004 Any other create-* mode that emits filesystem names
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Verify: The create-* generators emit hyphenated folder and file names — A dry-run generation produces `category-name/` and `feature-name.md`
- [ ] T006 Verify: Templates and SKILL docs document the hyphenated canonical form — No template or SKILL example shows an underscore filesystem name
- [ ] T007 Verify: The 027 generator changes are reversed — The generators no longer emit `category_name`/`feature_name.md`
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
