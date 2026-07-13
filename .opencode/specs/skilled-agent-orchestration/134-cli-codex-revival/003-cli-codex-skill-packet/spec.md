---
title: "Feature Specification: cli-codex skill packet"
description: "Plan an availability-gated Codex CLI skill under the renamed external orchestration hub."
trigger_phrases: ["cli-codex skill packet"]
importance_tier: important
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
# Feature Specification: cli-codex skill packet
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned, blocked |
| **Created** | 2026-07-13 |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../002-deep-loop-executor-support/spec.md` |
| **Successor** | `../004-codex-hook-adapter-layer/spec.md` |
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
Runtime support alone does not provide a safe user-facing Codex route. The current external CLI hub is being renamed in a parallel workstream, so creating the skill now would target a stale topology.
### Purpose
After the rename lands, create a nested `cli-codex` packet that advertises Codex only when the binary is available and delegates through the audited runtime contract.
<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- Future nested skill under `cli-external-orchestration`.
- Binary availability probe, executor invocation contract, and docs/tests.
### Out of Scope
- Any Wave 1 implementation or edits to the current `cli-external` hub.
### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `.opencode/skills/cli-external-orchestration/cli-codex/**` | Planned create | Availability-gated executor skill. |
<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-001 | Wait for renamed hub | Target parent exists and its registry contract is stable. |
| REQ-002 | Fail closed | Missing `codex` binary suppresses/rejects the route cleanly. |
### P1 - Required
| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-003 | Preserve audited dispatch | Skill uses the phase-002 runtime path rather than a second adapter. |
<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- Skill validates under the renamed hub and cannot advertise an absent binary.
<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | Hub rename | Wrong topology | Remain blocked until it lands. |
| Risk | Probe/dispatch divergence | Advertised but unusable route | Share one availability contract. |
<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
- Confirm the renamed hub registry keys and executor packet naming after workstream C lands.
<!-- /ANCHOR:questions -->
