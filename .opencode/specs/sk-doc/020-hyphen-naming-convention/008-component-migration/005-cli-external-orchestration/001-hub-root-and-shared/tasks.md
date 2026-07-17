---
title: "Tasks: cli-external-orchestration hub root and shared boundary (032 phase 005.001)"
description: "Tasks for the cli-external-orchestration root/shared boundary: build the ownership ledger, preserve exact routing contracts, and verify delegated playbook and benchmark ownership."
trigger_phrases:
  - "cli-external hub root tasks"
  - "cli external shared boundary tasks"
  - "cli-external phase 001 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored hub boundary tasks"
    next_safe_action: "Run the root/shared census"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/"
      - ".opencode/skills/cli-external-orchestration/hub-router.json"
      - ".opencode/skills/cli-external-orchestration/mode-registry.json"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The live shared/ directory is absent."
---
# Tasks: cli-external-orchestration hub root and shared boundary

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

- [ ] T001 Pin BASE and candidate SHAs and capture the direct root inventory (`.opencode/skills/cli-external-orchestration/`)
- [ ] T002 [P] Check for `shared/`; record the explicit absent result when it is not present (`.opencode/skills/cli-external-orchestration/shared/`)
- [ ] T003 [P] Capture protected hub filenames, routing values, and delegated child roots (`SKILL.md`, `hub-router.json`, `mode-registry.json`)
- [ ] T004 Build the root/shared ownership and classification ledger (`phase evidence/disposition-map.tsv`)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add explicit source-to-target entries for each owned authored root/shared path (`phase evidence/disposition-map.tsv`)
- [ ] T006 Rename only owned root/shared paths to kebab-case (`.opencode/skills/cli-external-orchestration/`)
- [ ] T007 [P] Update root/shared path-valued references without changing routing keys or semantics (`SKILL.md`, `README.md`, routing metadata)
- [ ] T008 [P] Confirm root/component playbook and benchmark trees remain outside this phase's diff (`.opencode/skills/cli-external-orchestration/`)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Re-enumerate the root/shared boundary and reconcile every path with one disposition (`phase evidence/disposition-map.tsv`)
- [ ] T010 Parse routing files and compare protected names, mode values, and resource targets with BASE (`hub-router.json`, `mode-registry.json`)
- [ ] T011 Search for stale owned source paths and resolve all root/shared-owned references (`SKILL.md`, `README.md`)
- [ ] T012 Review the diff for delegated-scope leakage, key/identifier changes, and untracked scaffold artifacts (`phase evidence`)
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remain
- [ ] Root/shared census, ownership ledger, and map hash are recorded
- [ ] Protected hub contracts and delegated ownership checks pass
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verifier contract**: See `checklist.md`
- **Boundary decisions**: See `decision-record.md`
- **Parent phase map**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

