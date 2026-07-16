---
title: "Feature Specification: system-spec-kit integration"
description: "Integrate the local /goal OpenCode plugin into system-spec-kit skill routing, references, catalog assets, and validation guidance."
trigger_phrases:
  - "goal plugin system-spec-kit integration"
  - "mk-goal system spec kit"
  - "goal plugin references"
  - "active_goal docs"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/026-goal-opencode-plugin/008-system-spec-kit-integration"
    last_updated_at: "2026-06-30T18:05:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Completed system-spec-kit goal plugin docs integration"
    next_safe_action: "Phase complete; restart OpenCode before relying on changed plugin docs in a fresh session"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/SKILL.md"
      - ".opencode/skills/system-spec-kit/references/hooks/goal_plugin.md"
      - ".opencode/skills/system-spec-kit/references/config/hook_system.md"
    session_dedup:
      fingerprint: "sha256:d7f9897a1b0c171fbcea51fcbca27de263b1d59012460d22d05fae9c695d2e65"
      session_id: "goal-system-spec-kit-integration-20260630"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use phase 008 under the existing 032 goal plugin packet"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: system-spec-kit integration

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-30 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 |
| **Predecessor** | 007-sk-prompt-goal-enhancement |
| **Successor** | None |
| **Handoff Criteria** | System-spec-kit docs route `mk-goal` as a known OpenCode plugin surface and validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the `/goal` OpenCode plugin packet. Earlier phases built the plugin and command; this phase makes the plugin discoverable from the `system-spec-kit` skill the same way related OpenCode plugin surfaces are documented.

**Scope Boundary**: documentation and reference integration only. This phase does not change `mk-goal.js` runtime behavior, command routing, or stored goal-state schema.

**Dependencies**:
- Existing `/goal` plugin and command from phases 001-007.
- Existing system-spec-kit hook, feature catalog, manual playbook, and environment-reference conventions.

**Deliverables**:
- A routed `references/hooks/goal_plugin.md` operator contract.
- System-spec-kit `SKILL.md`, hook-system, architecture, bridge-boundary, feature-catalog, manual-playbook, and env-reference updates.
- Phase 008 spec docs and changelog.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `/goal` plugin existed as OpenCode plugin code and a dedicated implementation packet, but `system-spec-kit` did not yet route, catalog, or explain it alongside the other OpenCode plugin surfaces. Operators looking at system-spec-kit references could find `mk-spec-memory`, `mk-code-graph`, and `mk-skill-advisor` plugin behavior, but not `mk-goal`.

### Purpose
Make `mk-goal` a first-class documented OpenCode plugin surface inside `system-spec-kit` without moving runtime ownership away from `.opencode/plugins/mk-goal.js`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add routed system-spec-kit reference coverage for `/goal`, `mk-goal`, `active_goal`, and `goalPrompt`.
- Add feature catalog and manual testing playbook assets for the goal plugin.
- Update hook/runtime docs to distinguish bridge-backed plugins from the standalone local goal plugin.
- Document `MK_GOAL_*` environment variables in the system-spec-kit env reference.

### Out of Scope
- Runtime code changes to `.opencode/plugins/mk-goal.js` - phase 007 already completed prompt enhancement behavior.
- Changes to `.opencode/commands/goal_opencode.md` - the command must remain a thin router.
- Moving goal state into Spec Kit Memory - goal state remains session-local plugin JSON.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/SKILL.md` | Modify | Route goal-plugin intent to the new hook reference and summarize the local plugin contract. |
| `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md` | Create | Operator contract for plugin paths, behavior, env vars, boundaries, and verification. |
| `.opencode/skills/system-spec-kit/references/config/hook_system.md` | Modify | Add goal plugin to OpenCode plugin transport and session-objective contract. |
| `.opencode/skills/system-spec-kit/ARCHITECTURE.md` | Modify | Clarify bridge-backed versus standalone local plugins. |
| `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/README.md` | Modify | Record why `mk-goal` is not a plugin bridge. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Document `MK_GOAL_*` runtime controls. |
| `.opencode/skills/system-spec-kit/feature_catalog/ux-hooks/goal-opencode-plugin.md` | Create | Feature catalog entry for the goal plugin. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/ux-hooks/goal-opencode-plugin.md` | Create | Manual validation scenario for `/goal` status and injection. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | System-spec-kit skill routing knows goal-plugin intent | `SKILL.md` includes `mk-goal`, `/goal`, and `active_goal` routing to `references/hooks/goal_plugin.md`. |
| REQ-002 | Hook/runtime docs describe `mk-goal` accurately | `hook_system.md` and architecture docs distinguish local plugin behavior from daemon bridge behavior. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Operator assets document validation and manual checks | Feature catalog and manual testing playbook files link back to the goal-plugin reference. |
| REQ-004 | Environment controls are discoverable | `ENV_REFERENCE.md` lists `MK_GOAL_*` variables consumed by `mk-goal.js`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Searching system-spec-kit docs for `mk-goal`, `/goal`, or `active_goal` finds the goal plugin contract.
- **SC-002**: The docs do not imply `mk-goal` is an MCP daemon bridge.
- **SC-003**: Strict validation passes for the parent goal-plugin packet after metadata restamp.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing `mk-goal.js` behavior | Docs must describe current behavior, not planned behavior | Cite current plugin paths and verification tests. |
| Risk | Misclassifying `mk-goal` as a bridge-backed daemon plugin | Operators may look for a nonexistent bridge or CLI | Add explicit non-bridge boundary in bridge README and goal reference. |
| Risk | Stale OpenCode sessions after plugin edits | Users may test old loaded plugin code | Repeat the restart requirement in operator docs and playbook. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The user selected the existing 032 packet and approved the new phase path `008-system-spec-kit-integration`.
- Runtime ownership stays in `.opencode/plugins/mk-goal.js`; system-spec-kit owns documentation, routing, and operator references only.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
