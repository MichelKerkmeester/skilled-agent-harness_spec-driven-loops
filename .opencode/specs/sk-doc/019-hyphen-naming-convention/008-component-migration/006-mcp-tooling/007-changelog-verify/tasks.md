---
title: "Tasks: mcp-tooling changelog verification (017 phase 007)"
description: "Tasks for phase 007 of the mcp-tooling component naming migration: verify append-only changelog entries and version bumps without renaming files."
trigger_phrases:
  - "mcp-tooling changelog tasks"
  - "mcp tooling version verification tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/006-mcp-tooling/007-changelog-verify"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/006-mcp-tooling/007-changelog-verify"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored phase 007 tasks"
    next_safe_action: "Build the changelog version matrix"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/changelog/"
      - ".opencode/skills/mcp-tooling/mcp-chrome-devtools/changelog/"
      - ".opencode/skills/mcp-tooling/mcp-click-up/changelog/"
      - ".opencode/skills/mcp-tooling/mcp-figma/changelog/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: mcp-tooling Changelog Verification

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

- [ ] T001 Record current latest and expected next versions for root, Chrome, ClickUp, and Figma
- [ ] T002 Load phase 001-006 evidence and capture prior changelog hashes
- [ ] T003 Confirm the phase is verification-only and has no rename scope
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Verify the root v1.0.1.0 entry
- [ ] T005 Verify Chrome v1.0.9.0, ClickUp v1.0.1.0, and Figma v1.0.1.0 entries
- [ ] T006 Verify scope, exemptions, benchmark zero-candidate note, and append-only placement
- [ ] T007 Verify prior entries and non-changelog paths were not changed by this phase
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify: all four latest entries exist and versions increment from the baseline
- [ ] T009 Verify: each entry matches the actual mcp-tooling phase map and evidence
- [ ] T010 Verify: existing history is byte-for-byte unchanged
- [ ] T011 Verify: candidate diff contains no filesystem rename or unauthorized mutation
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All P0 checklist checks have evidence
- [ ] No unexpected tracked mutation remains after verification
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
<!-- /ANCHOR:cross-refs -->
