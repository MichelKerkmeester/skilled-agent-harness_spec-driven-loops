---
title: "Tasks: sk-git benchmark (032 phase 008/012/004)"
description: "Tasks for the sk-git benchmark profile-directory and path-value rename phase."
trigger_phrases:
  - "sk-git benchmark tasks"
  - "032 benchmark profile rename tasks"
  - "benchmark evidence parity tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/012-sk-git/004-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/012-sk-git/004-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the benchmark phase task breakdown"
    next_safe_action: "Execute the task list against the pinned migration worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/benchmark/"
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/skills/sk-git/README.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: sk-git benchmark

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

- [ ] T001 Pin BASE and record the benchmark-map hash.
- [ ] T002 Inventory the two profile directories, four report files, nested fixture/storage-guide paths, path values, modes, and symlinks.
- [ ] T003 [P] Confirm references, assets, manual-playbook, feature-catalog, changelog, and sibling-surface boundaries are excluded.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename live_glm_5.2_high -> live-glm-5.2-high.
- [ ] T005 Rename live_kimi_2.7 -> live-kimi-2.7.
- [ ] T006 Update exact profile/report/fixture/storage-guide path values and SKILL.md/README.md pointers.
- [ ] T007 Preserve skill-benchmark-report.json and skill-benchmark-report.md filenames; record their no-op dispositions.
- [ ] T008 Preserve report keys, schemas, scenario IDs, scores, labels, transcripts, and non-path values.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Verify both profiles and all four report files are discoverable after the rename.
- [ ] T010 Verify every discovered path value resolves and no active pointer retains either source profile name.
- [ ] T011 Verify benchmark JSON/Markdown structure, keys, IDs, scores, labels, fixtures, and storage semantics are unchanged.
- [ ] T012 Verify the diff is limited to benchmark paths and listed consumers.
- [ ] T013 Record commands, exit codes, counts, candidate SHA, BASE SHA, and map hash in the SOL report.
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
