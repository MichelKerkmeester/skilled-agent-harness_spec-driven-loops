---
title: "Tasks: Codex hook adapter layer"
description: "Planned tasks only; implementation is outside Wave 1."
trigger_phrases: ["Codex hook tasks"]
importance_tier: normal
contextType: planning
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/004-codex-hook-adapter-layer"
    last_updated_at: "2026-07-13T06:25:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase stub for the Codex hook adapter layer"
    next_safe_action: "Implement after the runtime-neutral hook cores are ready"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Codex hook adapter layer
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- ANCHOR:notation -->
## Task Notation
All tasks remain pending.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Verify config location and trust flow.
- [ ] T002 Capture event names, matchers, payloads, and stdout contract.
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T003 Add thin Codex adapters over neutral cores.
- [ ] T004 Add project-local hook registration keyed on `CODEX_PROJECT_DIR`.
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T005 Unit-test adapters.
- [ ] T006 Run live event smoke matrix.
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] All events are verified live and neutral cores remain unchanged.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
## Cross-References
- `spec.md`
- `plan.md`
- `../001-codex-contract-pin/spec.md`
<!-- /ANCHOR:cross-refs -->
