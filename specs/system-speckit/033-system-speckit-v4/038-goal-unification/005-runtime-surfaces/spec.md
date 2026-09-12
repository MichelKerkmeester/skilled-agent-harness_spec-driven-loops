---
title: "Feature Specification: Runtime surfaces"
description: "Ship goal commands and hooks on pi, opencode, cursor and devin over the packet-backed core, and give Claude Code and Codex nesting through speckit commands and natural conversation without a new /goal."
trigger_phrases:
  - "goal command every runtime"
  - "goal-pi goal-opencode goal-cursor goal-devin"
  - "claude code goal nesting"
  - "codex goal nesting"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Runtime surfaces

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 7 |
| **Predecessor** | 004-goal-core-packet-backed |
| **Successor** | 006-speckit-command-integration |
| **Handoff Criteria** | See the parent Phase Handoff Criteria row for this phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Goal unification: packet goal.md as the single goal surface across runtimes specification.

**Scope Boundary**: Every runtime in ADR-5 reaches the same packet goal.md: four with a command, two through speckit and conversation.

**Dependencies**:
- 004-goal-core-packet-backed Complete

**Deliverables**:
- `.opencode/commands/goal-opencode.md` and `.opencode/plugins/opencode-goal.js` converged with goal-core or declared a thin client
- `.opencode/hooks/goal/pi/goal-context.ts` and `.pi/prompts/goal-pi.md`
- `cursor/goal-inject.mjs` and `.cursor/commands/goal-cursor.md` with the refusal lifted where binding supplies identity

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Only opencode has a working goal command. Cursor refuses for lack of session identity, devin was removed, and Claude Code and Codex have native goal commands that must not be shadowed.

### Purpose
Every runtime in ADR-5 reaches the same packet goal.md: four with a command, two through speckit and conversation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.opencode/commands/goal-opencode.md` and `.opencode/plugins/opencode-goal.js` converged with goal-core or declared a thin client
- `.opencode/hooks/goal/pi/goal-context.ts` and `.pi/prompts/goal-pi.md`
- `cursor/goal-inject.mjs` and `.cursor/commands/goal-cursor.md` with the refusal lifted where binding supplies identity
- A devin surface re-added under ADR-5
- Claude Code and Codex: hook entries and an optional /goal-nesting command, per ADR-5
- Every command authored through sk-create-command

### Out of Scope
- A /goal command for Claude Code or Codex
- speckit command bodies (006)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/goal-opencode.md` | Modify | Packet-backed actions |
| `.opencode/plugins/opencode-goal.js` | Modify | Converge keying and caps |
| `.opencode/hooks/goal/pi/goal-context.ts` | Modify | Packet-backed |
| `.opencode/hooks/goal/cursor/goal-inject.mjs` | Modify | Packet-backed |
| `.cursor/commands/goal-cursor.md` | Modify | Lift refusal per ADR-5 |
| `.devin/` | Create | Goal surface per ADR-5 |
| `.claude/settings.json, .claude/commands/, .codex/prompts/` | Modify/Create | Nesting reach per ADR-5 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | pi, opencode, cursor and devin each set, show and clear against the same packet goal.md | Manual playbook run per runtime, recorded |
| REQ-002 | Claude Code and Codex native goal commands are untouched and a speckit path sets the nested goal | Playbook run on both |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No surface injects frontmatter | Test per adapter |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Four runtime playbooks pass and are recorded in implementation-summary.md
- **SC-002**: Adapter test suites pass: pi, cursor, opencode plugin
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | opencode-goal.js drifts from goal-core | Two implementations | Declare thin client or converge; snapshot test on injection labels |
| Risk | Devin re-add contradicts 009/006 | Landed decision reversed | ADR-5 records the new decision explicitly |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether cursor's refusal can be lifted once binding is packet-based
<!-- /ANCHOR:questions -->

---


