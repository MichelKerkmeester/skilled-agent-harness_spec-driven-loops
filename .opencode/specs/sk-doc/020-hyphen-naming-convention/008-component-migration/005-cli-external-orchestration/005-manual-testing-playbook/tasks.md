---
title: "Tasks: cli-external-orchestration manual-testing-playbook naming (020 phase 005.005)"
description: "Tasks for the four-tree playbook migration: inventory categories and scenarios, build a complete path map, update recursive links, preserve scenario contracts, and verify ownership boundaries."
trigger_phrases:
  - "cli-external manual playbook tasks"
  - "manual-testing-playbook path map tasks"
  - "cli-external phase 005 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/005-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/005-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored playbook tasks"
    next_safe_action: "Enumerate the four playbook roots"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/manual_testing_playbook/"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/manual_testing_playbook/"
      - ".opencode/skills/cli-external-orchestration/cli-claude-code/manual_testing_playbook/"
      - ".opencode/skills/cli-external-orchestration/cli-codex/manual_testing_playbook/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The four-tree baseline is 34 directories and 116 files."
---
# Tasks: cli-external-orchestration manual-testing-playbook naming

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Pin BASE and candidate SHAs and capture all four playbook inventories (`manual_testing_playbook/` roots)
- [ ] T002 [P] Enumerate category directories and scenario files, including the observed root/OpenCode/Claude/Codex category sets (`manual_testing_playbook/`)
- [ ] T003 [P] Snapshot scenario IDs, frontmatter fields, headings, and recursive path references (`playbook documents`)
- [ ] T004 Build the four-tree ownership/disposition ledger and map hash (`phase evidence/disposition-map.tsv`)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Map the root `manual_testing_playbook`, `hub_routing`, and `plugins_and_hooks` paths and their scenario files (`root playbook`)
- [ ] T006 [P] Map cli-opencode categories/files, including `cross_repo_cross_server`, `intra_routing_recall`, `parallel_detached`, and `gpt_5_5`/`deepseek_v4` scenario names (`cli-opencode/manual_testing_playbook/`)
- [ ] T007 [P] Map cli-claude-code categories/files, including `cost_and_background`, `permission_modes`, and `reasoning_and_models` (`cli-claude-code/manual_testing_playbook/`)
- [ ] T008 [P] Map cli-codex categories/files, including `built_in_tools`, `codex_cloud`, `reasoning_effort`, and `sandbox_modes` (`cli-codex/manual_testing_playbook/`)
- [ ] T009 [P] Rename all mapped paths and update skill/README/index/relative path references (`four playbook trees`)
- [ ] T010 Preserve scenario IDs, frontmatter fields, headings, content keys, and manual-test meaning (`playbook documents`)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Re-enumerate all four trees and reconcile every path with exactly one ledger disposition (`phase evidence/disposition-map.tsv`)
- [ ] T012 Resolve recursive Markdown/path references and search for stale source segments (`four playbook trees`, skill/README files)
- [ ] T013 Compare scenario IDs, frontmatter, headings, file counts, and content semantics with BASE (`playbook evidence`)
- [ ] T014 Review the diff for component-reference, benchmark, key/identifier, generated, frozen, and sibling-phase leakage (`phase evidence`)
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remain
- [ ] The complete four-tree map and map hash are recorded
- [ ] Links resolve and scenario/frontmatter parity is proven
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verifier contract**: See `checklist.md`
- **Boundary decisions**: See `decision-record.md`
- **Parent phase map**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

