---
title: "Tasks: sk-prompt manual-testing-playbook trees (020 phase 004.004)"
description: "Tasks for phase 004 of the sk-prompt kebab-case program: rename both playbook trees, update active links, and verify scenario coverage."
trigger_phrases:
  - "sk-prompt manual testing playbook tasks"
  - "sk-prompt phase 004 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/004-sk-prompt/004-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/004-sk-prompt/004-manual-testing-playbook"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the two-tree playbook rename and coverage tasks"
    next_safe_action: "Run T001 against the pinned playbook trees"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/manual_testing_playbook/"
      - ".opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/"
      - ".opencode/skills/sk-prompt/SKILL.md"
      - ".opencode/skills/sk-prompt/prompt-improve/SKILL.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Hub and prompt-improve playbooks are both in this phase; benchmark paths are not."
---
# Tasks: sk-prompt manual-testing-playbook trees

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

- [ ] T001 Confirm the phase 003 handoff, pinned BASE, and two-tree playbook ownership boundary.
- [ ] T002 [P] Capture hub SP-001–SP-004 and prompt-improve scenario/category manifests.
- [ ] T003 Record exact source-target pairs for both roots, `hub_routing/`, seven categories, and all scenario files.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename the hub `manual_testing_playbook/`, `hub_routing/`, root index, and four routing scenarios.
- [ ] T005 Rename the prompt-improve `manual_testing_playbook/`, seven category directories, root index, and scenario files.
- [ ] T006 Update active skill, README, index, and scenario cross-reference paths.
- [ ] T007 Preserve scenario IDs, category membership, content semantics, identifiers, keys, and frozen changelog prose.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify: Both playbook trees are kebab-case — Every in-scope directory/file source has one existing target.
- [ ] T009 Verify: Active links are closed — Both indexes, skill docs, READMEs, and scenario cross-references resolve.
- [ ] T010 Verify: Coverage is preserved — Hub SP-001–SP-004 and the prompt-improve 27-scenario set match BASE by ID and category.
- [ ] T011 Verify: Scope is clean — Changelog/generated/exempt paths and scenario content semantics were not changed.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (path/reference and scenario-manifest checks as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
