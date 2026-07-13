---
title: "Implementation Plan: cli-codex skill packet"
description: "Planned skill work after the external hub rename lands."
trigger_phrases: ["cli-codex skill plan"]
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
# Implementation Plan: cli-codex skill packet
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- ANCHOR:summary -->
## 1. SUMMARY
Inspect the renamed hub contract, scaffold a nested skill from the canonical skill template, and bind availability and dispatch to the runtime contract from phase 002.
<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- [ ] Renamed hub has landed.
- [ ] Missing-binary route suppression is tested.
- [ ] Parent-skill and skill validation pass.
<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
The skill owns user-facing routing; the deep-loop runtime owns execution. Availability is checked before route advertisement and again before process construction.
<!-- /ANCHOR:architecture -->
<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
| Surface | Current Role | Action | Verification |
|---|---|---|---|
| Renamed external hub | Parent registry | Add nested packet | Hub validator |
| Runtime phase 002 | Executor authority | Reuse unchanged | Integration test |
<!-- /ANCHOR:affected-surfaces -->
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: Setup
- [ ] Inspect landed hub topology.
### Phase 2: Core Implementation
- [ ] Scaffold skill and availability gate.
### Phase 3: Verification
- [ ] Run skill, hub, and absent-binary tests.
<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Test binary present/absent matrices and one audited non-interactive smoke dispatch.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Hub rename | Internal | Green | Rename landed; phase unblocked. |
<!-- /ANCHOR:dependencies -->
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Remove the nested packet and registry entry without changing phase-002 runtime support.
<!-- /ANCHOR:rollback -->
