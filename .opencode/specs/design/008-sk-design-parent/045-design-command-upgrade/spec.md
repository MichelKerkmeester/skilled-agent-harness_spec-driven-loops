---
title: "Feature Specification: design command upgrade"
description: "Plan the follow-on command-surface upgrade for the sk-design family after the routing and enforcement research. The packet is intentionally planned, not implemented: it scopes command specificity, design-mode dispatch, and verification before any command files change."
trigger_phrases:
  - "design command upgrade"
  - "design command specificity"
  - "sk-design command surface"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/045-design-command-upgrade"
    last_updated_at: "2026-06-30T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Converted the command-upgrade scaffold into an honest planned packet"
    next_safe_action: "Run command alias inventory"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-154-045-design-command-upgrade"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which /design command aliases should become hard routing contracts versus advisory convenience aliases?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: design command upgrade

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The prior routing and integration research produced an implementation backlog for making design-command behavior more specific and testable. This packet scopes that command-surface work without claiming it has shipped.

**Key Decisions**: keep this as a planned implementation packet; treat command routing, loaded resources, and replay fixtures as the acceptance surface.

**Critical Dependencies**: the current `/design:*` command files, the `sk-design` parent router, and the routing-benchmark fixtures.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-06-30 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../044-design-routing-and-integration-research/spec.md |
| **Successor** | None |
| **Handoff Criteria** | command-surface scope approved, replay fixtures selected, and verification commands named before edits begin |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The design command surface has accumulated broad aliases and prose-level routing guidance, but the research backlog shows that command specificity needs firmer evidence. Without a scoped upgrade packet, command changes risk drifting from the `sk-design` mode router and the replay fixtures that prove mode selection.

### Purpose
Define the command-upgrade implementation scope so future edits can make `/design:*` behavior more deterministic, easier to replay, and traceable to the `sk-design` family contracts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit current `/design:*` command aliases and mode-specific routing language.
- Identify which aliases should route to interface, foundations, motion, audit, or md-generator modes.
- Add or update replay fixtures for command-to-mode expectations before implementation claims.
- Document rollback and compatibility behavior for any command rename or alias tightening.

### Out of Scope
- Changing design-skill craft guidance inside the mode packets.
- Editing Figma, Open Design, browser, or other transport MCP behavior.
- Removing public command aliases without a compatibility note and replay evidence.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/design*.md` | Planned modify | Tighten command specificity and mode routing language |
| `.opencode/skills/sk-design/**/SKILL.md` | Planned inspect | Confirm command language matches the mode router |
| `.opencode/skills/sk-design/**/manual_testing_playbook/**` | Planned modify | Add replay fixtures if command behavior changes |
| `045-design-command-upgrade/*` | Update | Keep packet docs synchronized while work is planned |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete before implementation claim)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Command alias inventory exists before edits | `rg -n "/design|design:" .opencode/commands .opencode/skills/sk-design` output is reviewed and summarized in the implementation notes |
| REQ-002 | Mode routing expectations are replayable | Every changed command has a replay fixture or documented no-op reason |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Command language matches the parent router | Command descriptions and `sk-design` mode routing use the same mode names and boundaries |
| REQ-004 | Compatibility is explicit | Any tightened alias documents whether old invocations still work, warn, or intentionally fail |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The command-upgrade scope is specific enough to implement without re-opening the research packet.
- **SC-002**: No command change can be marked complete without a replay fixture or a documented no-op reason.
- **SC-003**: Parent phase validation remains clean while this packet is planned.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A command alias is tightened too aggressively | Existing user workflows break | Keep compatibility notes and replay old/new aliases |
| Risk | Router prose and command prose diverge | Agents load the wrong design mode | Treat the parent router as the source of truth and verify command text against it |
| Dependency | Routing benchmark fixtures | No objective proof of command behavior | Add fixtures before claiming implementation completion |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Command routing changes must be replayable from checked-in fixtures before completion.

### Compatibility
- **NFR-C01**: Tightened aliases must document whether old invocations still work, warn, or fail.

### Maintainability
- **NFR-M01**: Command prose and parent-router mode names must stay synchronized.

---

## 8. EDGE CASES

### Alias Boundaries
- Broad command alias maps to more than one mode: keep compatibility behavior explicit and add a replay row for the chosen route.
- Existing alias remains advisory: document the no-op reason instead of adding fake replay coverage.

### Verification Boundaries
- Replay fixture cannot be added yet: leave the task unchecked and do not claim implementation completion.
- Parent router changes independently: rerun the command alias inventory before editing command files.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | command docs plus possible replay fixtures |
| Risk | 8/25 | compatibility risk for user-facing aliases |
| Research | 4/20 | predecessor research exists |
| Multi-Agent | 0/15 | no multi-agent implementation planned |
| Coordination | 5/15 | parent router and command docs must agree |
| **Total** | **25/100** | **Level 3 retained because this packet carries a decision record and command-surface compatibility gate** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Tightened alias breaks an existing workflow | High | Medium | replay old and new aliases; document compatibility |
| R-002 | Command text drifts from parent router | Medium | Medium | compare mode names during inventory |

---

## 11. USER STORIES

### US-001: Deterministic Command Routing (Priority: P1)

**As a** design command user, **I want** command aliases to route to the expected design mode, **so that** the right design guidance loads without manual correction.

**Acceptance Criteria**:
1. Given a changed command alias, When replay runs, Then the expected mode is selected.

### US-002: Compatibility Visibility (Priority: P1)

**As a** maintainer, **I want** compatibility behavior documented for tightened aliases, **so that** old invocations do not break silently.

**Acceptance Criteria**:
1. Given an alias changes, When the implementation summary is written, Then old/new behavior is recorded.

---

## 12. OPEN QUESTIONS

- Which broad aliases should remain as compatibility aliases after command-specific routing is introduced?
- Should command-upgrade implementation ship in one pass or split by design mode?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent spec**: `../spec.md`
- **Predecessor research**: `../044-design-routing-and-integration-research/spec.md`
- **Current packet plan**: `plan.md`
