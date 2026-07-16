---
title: "Tasks: system-skill-advisor hooks"
description: "Concrete tasks for the advisor hook filename inventory, conditional rename, registration closure, and behavior-parity verification."
trigger_phrases:
  - "advisor hooks tasks"
  - "hook registration tasks"
  - "prompt submit audit tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/004-hooks"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/004-hooks"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored hooks tasks"
    next_safe_action: "Begin with the advisor hook inventory and ownership scan"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/hooks"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The visible hook filenames are already kebab-case; a no-rename result requires evidence."
---

# Tasks: system-skill-advisor hooks

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

Task format: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Inventory every advisor hook filename and runtime directory
- [ ] T002 Inventory registrations and path references in settings, docs, plugin bridge, and tests
- [ ] T003 Classify advisor-owned, cross-skill, tool-mandated, and already-compliant paths
- [ ] T004 Capture BASE hook envelope, timeout, fail-open, and discovery behavior
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Rename a real non-mandated snake_case hook filename only if the pinned inventory finds one
- [ ] T006 Repair live advisor hook registrations and path examples
- [ ] T007 Preserve user-prompt-submit.ts, skill-advisor-cli-fallback.ts, event names, environment keys, and code identifiers
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Prove the hook inventory has zero unclassified snake_case filenames
- [ ] T009 Resolve each advisor registration to an existing source path
- [ ] T010 Run hook parity, timeout, fail-open, and prompt-safe output checks
- [ ] T011 Record no-rename or rename evidence for the subtree gate
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked [x]
- [ ] No [B] blocked tasks remain
- [ ] Every requirement in spec.md has pinned evidence
- [ ] The phase checklist is fully satisfied by the central verifier
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
- **Checklist**: See checklist.md
<!-- /ANCHOR:cross-refs -->
