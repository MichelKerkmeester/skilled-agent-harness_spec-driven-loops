---
title: "Feature Specification: Preflight Hook"
description: "A PreToolUse hook that surfaces the relevant git rule at command time, advisory-only, with three suppression tiers."
trigger_phrases:
  - "git preflight hook"
  - "sk-git advisory hook"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/003-preflight-hook"
    last_updated_at: "2026-07-27T23:40:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Built and registered the preflight advisory hook"
    next_safe_action: "Phase 004 measures the fire rate"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-sk-git-016-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Preflight Hook

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-27 |
| **Branch** | `sk-git/0113-016-advisory-hook-build` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 4 |
| **Predecessor** | 002-rule-encoding |
| **Successor** | 004-pathspec-integrity |
| **Handoff Criteria** | The hook fires on a real matching command without blocking it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Git action advisory hook specification.

**Scope Boundary**: Delivery. The rules exist and evaluate; this phase gets them in front of the operator at the moment the command is typed.

**Dependencies**: Phase 002 rules and evaluator extension.

**Deliverables**: A hook script registered in the existing PreToolUse Bash array, with the three suppression tiers prior art showed are not optional.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Encoded rules do nothing until something evaluates them against a real command. The rules were already written as prose and still reached nobody, because prose is surfaced by prompt routing while the damage happens at command time.

### Purpose

Put the relevant rule where the operator is already reading, at the moment it can still change what they do.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A hook script alongside the proven dispatch preflight lint.
- Registration in the existing PreToolUse Bash array.
- Three suppression tiers: per-rule, grouped by prefix, and a global kill.
- A cap on how many advisories one command may draw.

### Out of Scope
- New hook infrastructure. The PreToolUse mechanism exists and is proven.
- Blocking. The hook never returns a deny decision.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-git/scripts/hooks/git-preflight-advisory.mjs` | Create | The hook |
| `.claude/settings.json` | Modify | Register in the existing Bash group |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The hook advises and never blocks | It emits `additionalContext` only, never a permission decision |
| REQ-002 | It fails open on every path | No repository, no rules, bad payload, throwing check — all approve silently |
| REQ-003 | It fast-exits on non-git commands | No git process spawns for an unrelated Bash call |
| REQ-004 | Three suppression tiers exist | Per-rule, grouped, and global, all verified |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The line names the operation just invoked | The advisory quotes the subcommand |
| REQ-006 | Output is capped | A miscalibrated rule set cannot produce a wall of text |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The hook fires on the real failure and stays silent on ordinary commits and non-git commands.
- **SC-002**: Both the global kill and a per-rule opt-out silence it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Latency on every Bash command | Med | Shape test before any git call; state collected lazily |
| Risk | An advisory that reads as a non-sequitur | Med | The line names the operation invoked |
| Risk | Shipping only a global switch | Med | Three tiers, as every comparable system ships |
| Dependency | Phase 002 | Blocking | Complete |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
