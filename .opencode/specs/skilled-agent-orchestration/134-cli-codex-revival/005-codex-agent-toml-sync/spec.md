---
title: "Feature Specification: Codex agent TOML sync"
description: "Plan generated Codex agent TOMLs from the live canonical OpenCode agent set with a parity guard."
trigger_phrases: ["Codex agent TOML sync"]
importance_tier: important
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
# Feature Specification: Codex agent TOML sync
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../004-codex-hook-adapter-layer/spec.md` |
| **Successor** | `../006-docs-and-closeout/spec.md` |
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
Historical Codex agent TOMLs no longer match the canonical OpenCode Markdown set, and a prior plan assumed 15 agents while the live source currently has 14.
### Purpose
Generate accepted Codex TOMLs from the live canonical set and enforce parity so count and content drift self-correct.
<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- Agent-schema verification against Codex 0.144.1.
- Deterministic Markdown-to-TOML synchronization and mirror check.
### Out of Scope
- Hand-maintaining a fixed 15-agent list.
- Implementing TOMLs in Wave 1.
### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `.codex/agents/*.toml` | Planned create | Generated runtime agents. |
| Sync/check scripts | Planned create | Canonical conversion and parity enforcement. |
<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-001 | Use live canonical set | Generated filenames equal `.opencode/agents/*.md`. |
| REQ-002 | Verify TOML schema | Codex 0.144.1 accepts every generated agent. |
### P1 - Required
| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-003 | Enforce parity | Mirror check fails on additions, removals, or stale output. |
<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- Generated TOMLs match the canonical live set exactly and pass Codex schema validation.
<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Risk | Hardcoded count | Immediate drift | Derive from canonical filenames. |
| Dependency | Codex agent schema | Invalid TOMLs | Validate live before generation contract is frozen. |
<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
- Is the canonical set still 14 when this phase begins, or has a fifteenth runtime agent landed?
<!-- /ANCHOR:questions -->
