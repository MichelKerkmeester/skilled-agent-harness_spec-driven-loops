---
title: "Tasks: Manual testing playbook (032 subtree 008 phase 009)"
description: "The system-spec-kit manual_testing_playbook tree contains 440 underscore-bearing basenames: the root, 18 category directories, and 421 scenario or support files. This phase renames permitted playbook paths to kebab-case and closes every playbook link, index, runner, and path pointer while preserving scenario identity and the program exemption boundary."
trigger_phrases:
  - "system-spec-kit manual testing playbook"
  - "manual_testing_playbook to manual-testing-playbook"
  - "playbook scenario kebab-case"
  - "manual testing phase 009"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit/009-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned manual-playbook tasks"
    next_safe_action: "Execute the manual-playbook path map after catalog evidence is available"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Manual testing playbook

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

- [ ] T001 Freeze the 440-entry playbook inventory and active consumer map.
- [ ] T002 Capture baseline scenario IDs, headings, category assignments, and link/runner resolution output.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Create and review the root/category/scenario semantic map.
- [ ] T004 Rename playbook paths in dependency-closed batches.
- [ ] T005 Update indexes, links, runner globs, catalog handoffs, READMEs, and path-valued metadata.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify: Candidate count and map are complete — evidence: inventory and map hash.
- [ ] T007 Verify: Targets are collision-free — evidence: exact/casefold/NFC collision report.
- [ ] T008 Verify: All playbook consumers resolve — evidence: link/index/runner/handoff output.
- [ ] T009 Verify: Scenario contracts are unchanged — evidence: ID, heading, procedure, and metadata diff audit.
- [ ] T010 Verify: Scenario and category parity is preserved — evidence: pre/post parity report.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green in the central validation worktree
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

