---
title: "Tasks: mcp-code-mode runtime (020 component 011 phase 004)"
description: "Tasks for the runtime filename census, no-op proof, conditional rename closure, and executable path verification."
trigger_phrases:
  - "mcp-code-mode runtime tasks"
  - "mcp-code-mode phase 004 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/004-runtime"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/004-runtime"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored runtime audit tasks"
    next_safe_action: "Enumerate runtime files"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: mcp-code-mode runtime

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

- [ ] T001 Record BASE and enumerate runtime/hooks/claude, runtime/hooks/codex, and runtime/lib
- [ ] T002 [P] Inventory direct runtime path consumers and manual-scenario references
- [ ] T003 Classify the four observed mcp-route-guard filenames and any additional runtime name
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Freeze the runtime map, accepting an empty map only with census evidence
- [ ] T005 Rename each eligible runtime filename, if any
- [ ] T006 Update direct loader, require, test, and manual-scenario runtime path references
- [ ] T007 Keep phase-005 manual-playbook filename changes outside this phase
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run node --check on the runtime CommonJS files
- [ ] T009 Run the route-guard test path and resolve affected references
- [ ] T010 Verify no eligible runtime snake_case name remains
- [ ] T011 Pin the map result, dispositions, commands, and exit codes
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test/link as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
<!-- /ANCHOR:cross-refs -->
