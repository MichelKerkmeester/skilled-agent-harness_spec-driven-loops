---
title: "Tasks: cli-codex skill packet"
description: "Planned tasks only; implementation is outside Wave 1."
trigger_phrases: ["cli-codex skill tasks"]
importance_tier: normal
contextType: planning
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/003-cli-codex-skill-packet"
    last_updated_at: "2026-07-13T06:25:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase stub for the cli-codex skill packet"
    next_safe_action: "Implement after the cli-external hub rename lands"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: cli-codex skill packet
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- ANCHOR:notation -->
## Task Notation
All tasks remain pending; `[B]` marks the hub rename dependency.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [B] T001 Wait for `cli-external-orchestration` hub rename.
- [ ] T002 Read the landed hub registry and templates.
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T003 Scaffold the nested skill.
- [ ] T004 Add fail-closed availability and audited dispatch wiring.
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T005 Test binary present and absent paths.
- [ ] T006 Validate the skill and parent hub.
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] Hub dependency landed and all tasks complete.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
## Cross-References
- `spec.md`
- `plan.md`
- `../002-deep-loop-executor-support/spec.md`
<!-- /ANCHOR:cross-refs -->
