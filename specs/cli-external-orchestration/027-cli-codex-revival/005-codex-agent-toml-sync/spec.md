---
title: "Feature Specification: Codex agent TOML sync"
description: "Plan generated Codex agent TOMLs from the live canonical OpenCode agent set with a parity guard."
trigger_phrases: ["Codex agent TOML sync"]
importance_tier: important
contextType: planning
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/027-cli-codex-revival/005-codex-agent-toml-sync"
    last_updated_at: "2026-07-13T10:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Generated Codex agent adapters and parity check"
    next_safe_action: "Run live Codex 0.144.1 agent-load smoke"
    blockers: ["Live Codex agent-load smoke requires orchestrator"]
    completion_pct: 90
    open_questions: ["Will all generated agents load in a live Codex 0.144.1 session?"]
    answered_questions: ["The canonical set is the 13 live Markdown filenames"]
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
| **Status** | Implemented; live agent-load smoke pending |
| **Created** | 2026-07-13 |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../004-codex-hook-adapter-layer/spec.md` |
| **Successor** | `../006-docs-and-closeout/spec.md` |
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
Historical Codex agent TOMLs no longer match the canonical OpenCode Markdown set. Earlier prose assumed 14 agents and a prior plan assumed 15, while the live source has 13.
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
| `.codex/agents/*.toml` | Created | Generated runtime agents. |
| `.opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs` | Created | Canonical conversion and parity enforcement. |
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
- None. The generator derives the canonical set from live `.opencode/agents/*.md` filenames.
<!-- /ANCHOR:questions -->
