---
title: "Feature Specification: Codex hook adapter layer"
description: "Plan thin Codex host adapters over existing runtime-neutral hook cores, validated against Codex 0.144.1."
trigger_phrases: ["Codex hook adapters"]
importance_tier: important
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
# Feature Specification: Codex hook adapter layer
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Source implemented; dist and live smoke pending |
| **Created** | 2026-07-13 |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../003-cli-codex-skill-packet/spec.md` |
| **Successor** | `../005-codex-agent-toml-sync/spec.md` |
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
Codex native hooks are stable, but no Codex adapters exist and the historical two-event configuration predates 0.144.1.
### Purpose
Add thin adapters over existing neutral cores only after verifying event names, payloads, matchers, output shapes, and trust behavior live.
<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- Future `hooks/codex/` adapters and `.codex` hook configuration.
- Live smoke tests for each supported event and response shape.
### Out of Scope
- Rewriting runtime-neutral hook cores.
- Implementing any adapter in Wave 1.
### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `system-spec-kit/mcp_server/hooks/codex/**` | Planned create | Thin host adapters. |
| `.codex/hooks.json` or verified replacement | Planned create | Native hook registration. |
<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-001 | Verify 0.144.1 schema | Configuration and all event names pass live smoke tests. |
| REQ-002 | Preserve neutral cores | Adapters translate only host payload/output contracts. |
### P1 - Required
| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-003 | Use `CODEX_PROJECT_DIR` | Hooks resolve the project consistently. |
<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- Every configured event fires once with validated payload and output behavior; neutral cores remain unchanged.
<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Risk | Claude-shaped assumptions | Hooks silently fail | Validate against live Codex, event by event. |
| Risk | Project trust denial | Local hooks skipped | Pin current trust flow and test it. |
<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
- Does 0.144.1 use standalone `hooks.json`, TOML `[hooks]`, or both?
- Which five additional event names and tool matchers are accepted?
<!-- /ANCHOR:questions -->
