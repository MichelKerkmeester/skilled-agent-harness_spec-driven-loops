---
title: "Tasks: Codex agent TOML sync"
description: "Planned tasks only; implementation is outside Wave 1."
trigger_phrases: ["Codex agent sync tasks"]
importance_tier: normal
contextType: planning
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/005-codex-agent-toml-sync"
    last_updated_at: "2026-07-13T06:25:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase stub for the .codex agents TOML sync"
    next_safe_action: "Implement after the cli-codex skill packet lands"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Codex agent TOML sync
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- ANCHOR:notation -->
## Task Notation
All tasks remain pending.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Inventory canonical agents at implementation time.
- [ ] T002 Verify Codex 0.144.1 TOML schema.
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T003 Build deterministic generator.
- [ ] T004 Generate `.codex/agents/*.toml`.
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T005 Add and run mirror parity check.
- [ ] T006 Smoke agent loading in Codex.
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] Generated set exactly matches the live canonical set.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
## Cross-References
- `spec.md`
- `plan.md`
- `../001-codex-contract-pin/spec.md`
<!-- /ANCHOR:cross-refs -->
