---
title: "Tasks: verify orchestrate agent naming (032 phase 011)"
description: "Tasks for phase 011 of the 032 agents component migration: verify the orchestrate filename candidate set."
trigger_phrases:
  - "orchestrate agent naming tasks"
  - "agents phase 011 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/014-agents"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/014-agents/011-orchestrate-verify"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored orchestrate phase docs"
    next_safe_action: "Execute verify-only inventory"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Orchestrate Agent Naming Verification

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

- [ ] T001 Confirm the 032 naming policy, exemption boundary, and pinned BASE for this read-only phase
- [ ] T002 Confirm the three expected orchestrate definition paths in the runtime inventory
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Record the OpenCode, Claude, and Codex path, extension, and basename for orchestrate
- [ ] T004 Classify the three basenames against the kebab-case filesystem rule
- [ ] T005 Record the rename-candidate set as exactly ∅ when all three names are compliant; create no rename task
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify: all three expected paths are present and match the scoped component
- [ ] T007 Verify: no in-scope snake_case filesystem name appears in the three definition filenames
- [ ] T008 Verify: no runtime agent file, content field, or reference is changed by this phase
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with path-level evidence
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
<!-- /ANCHOR:cross-refs -->
