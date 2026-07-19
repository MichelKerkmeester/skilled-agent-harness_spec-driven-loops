---
title: "Tasks: sk-git manual testing playbook (020 phase 008/012/003)"
description: "Tasks for the sk-git manual-testing-playbook directory and scenario filename rename."
trigger_phrases:
  - "sk-git manual playbook tasks"
  - "020 manual scenario rename tasks"
  - "playbook discovery parity tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/012-sk-git/003-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/012-sk-git/003-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the manual-playbook phase task breakdown"
    next_safe_action: "Verify the manual-playbook tree is already kebab on v4 and re-count against its actual entries"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/manual-testing-playbook/"
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/skills/sk-git/README.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: sk-git manual testing playbook

> **SUPERSEDED — VERIFY-ONLY (v4 reconciliation, 2026-07-15).** Concurrent v4 work already committed this rename (on `skilled/v4.0.0.0`). The tasks below are now VERIFICATION tasks for the completed kebab state — not rename execution. Do NOT re-run or reverse any rename. Re-count the 49-entry map against v4's actual tree (42 files / 8 dirs). See the packet's v4-reconciliation-inventory.md.

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| [ ] | Pending |
| [x] | Completed |
| [P] | Parallelizable |
| [B] | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Pin BASE and record the 49-entry manual-playbook map hash.
- [ ] T002 Inventory the root index, seven category directories, 41 scenario files, GIT IDs, links, modes, and metadata.
- [ ] T003 [P] Confirm references, assets, benchmark, changelog, feature-catalog, and sibling-surface boundaries are excluded.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename manual_testing_playbook.md -> manual-testing-playbook.md when present.
- [ ] T005 Rename commit_formation -> commit-formation and its four scenario files.
- [ ] T006 Rename cross_cli_orchestration -> cross-cli-orchestration and its three scenario files.
- [ ] T007 Rename integration_and_pr -> integration-and-pr and its four scenario files.
- [ ] T008 Rename owner_first_worktree_tooling -> owner-first-worktree-tooling and its 19 scenario files.
- [ ] T009 Rename recovery_and_edge_cases -> recovery-and-edge-cases and its four scenario files.
- [ ] T010 Rename safety_refusals -> safety-refusals and its four scenario files.
- [ ] T011 Rename worktree_setup -> worktree-setup and its three scenario files.
- [ ] T012 Rewrite the root index, package-artifact list, category links, scenario links, SKILL.md/README.md pointers, and in-tree path references.
- [ ] T013 Preserve GIT-001 through GIT-041, scenario metadata, content, and category membership; record baseline no-op dispositions.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Verify the 49-entry map has one disposition per path and no source/target duplicate.
- [ ] T015 Verify every root-index row and in-tree playbook link resolves to one hyphenated target.
- [ ] T016 Verify the GIT-001 through GIT-041 set, count, category membership, and index multiplicity are unchanged.
- [ ] T017 Verify scenario bytes/fields, commands, frontmatter, keys, modes, and symlinks outside path values.
- [ ] T018 Verify the diff is limited to the manual playbook and its listed pointer consumers.
- [ ] T019 Record commands, exit codes, counts, candidate SHA, BASE SHA, and map hash in the SOL report.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked [x].
- [ ] No [B] blocked tasks remain.
- [ ] Every phase requirement has evidence in the checklist and SOL report.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
- **Acceptance contract**: See checklist.md
- **Parent map**: See ../spec.md
<!-- /ANCHOR:cross-refs -->
