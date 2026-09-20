---
title: "Implementation Plan: Codex hook adapter layer"
description: "Planned live-contract verification and thin adapter implementation."
trigger_phrases: ["Codex hook adapter plan"]
importance_tier: normal
contextType: planning
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/027-cli-codex-revival/004-codex-hook-adapter-layer"
    last_updated_at: "2026-07-13T06:25:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase stub for the Codex hook adapter layer"
    next_safe_action: "Implement after the runtime-neutral hook cores are ready"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Codex hook adapter layer
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- ANCHOR:summary -->
## 1. SUMMARY
Probe the native hook schema first, map payloads to existing neutral-core inputs, implement host-only adapters, and smoke every event in a trusted project.
<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- [ ] Live schema evidence exists before wiring.
- [ ] Neutral cores have no behavioral rewrite.
- [ ] Every event has payload and stdout assertions.
<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Host adapter translates Codex JSON to runtime-neutral functions and translates neutral results back to the verified Codex response envelope.
<!-- /ANCHOR:architecture -->
<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
| Surface | Current Role | Action | Verification |
|---|---|---|---|
| Neutral hook cores | Behavior authority | Read only | Diff confirms unchanged |
| Codex adapters | Host translation | Create | Unit and live smoke tests |
<!-- /ANCHOR:affected-surfaces -->
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: Setup
- [ ] Verify config, trust, event, matcher, and payload contracts.
### Phase 2: Core Implementation
- [ ] Add thin adapters and project configuration.
### Phase 3: Verification
- [ ] Smoke each event against 0.144.1.
<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Use fixture payload tests plus a live trusted-project smoke matrix for all events.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Codex native hook schema | External | Yellow | Cannot safely wire adapters. |
<!-- /ANCHOR:dependencies -->
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Remove Codex adapters and project hook registration; leave neutral cores untouched.
<!-- /ANCHOR:rollback -->
