---
title: "Feature Specification: Align the design agent with the sk-design authoring skill"
description: "The design agent describes itself as an extraction specialist and routes only to sk-design-md-generator, so authoring requests reach an agent that says they are out of scope."
trigger_phrases:
  - "design agent alignment"
  - "design agent routing"
  - "decide versus measure design"
  - "design subagent sk-design"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Align the design agent with the sk-design authoring skill

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-28 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 2 |
| **Predecessor** | 001-skill-build |
| **Successor** | None |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Align the design agent across four runtimes with the sk-design authoring skill specification.

**Scope Boundary**: [To be defined during planning]

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `design` agent was written when extraction was the only surviving design capability. It calls itself an extraction specialist, loads `sk-design-md-generator` unconditionally, and treats deciding new values as out of scope — it even routes that work to "a separate design-spec decision" that did not exist when the line was written.

`sk-design` is now that decision. Until the agent knows it, every authoring request dispatched to `design` reaches an agent whose rules tell it to decline.

### Purpose

One design agent that decides which of the two skills a request needs, loads that one, and states the precedence when both apply.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A routing section that splits requests into measure and decide before any skill loads.
- A decide path built on `sk-design`: entry-point detection, intent-scoped reference loading, values-not-adjectives, and the hard-rule verification.
- A measure path preserving the existing pipeline behavior unchanged.
- The precedence rule stated once: a measurement outranks a default for the surface it covers.
- Quality gates, rules and output format covering both paths.
- The same body across all four runtime copies.

### Out of Scope
- Changes to either skill. Both already state the boundary; this aligns the agent to it.
- The `/design:extract` command, which still maps to the measure path unchanged.
- Runtime frontmatter shape. Each runtime keeps its own permission or tool block; only the description and body change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agents/design.md` | Modify | Canonical agent: description and full body |
| `.claude/agents/design.md` | Modify | Same body, Claude frontmatter |
| `.cursor/agents/design.md` | Inherits | A symlink to the Claude file; carries Claude frontmatter and needs no edit |
| `.pi/agents/design.md` | Modify | Same body, Pi frontmatter |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The agent routes before it loads | A routing section decides measure versus decide, and both paths are reachable from the request text alone |
| REQ-002 | Authoring requests are in scope | No rule declines a decide request; the old out-of-scope escalation is gone |
| REQ-003 | Precedence is stated | A measurement outranks a default for the surface it covers, matching what both skills say |
| REQ-004 | Every cited path resolves | Each reference and skill file the agent names exists on disk |
| REQ-005 | All four runtimes carry the same body | A diff of the post-frontmatter body across runtimes is empty |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | [Requirement description] | [How to verify it's done] |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A request to pick a value reaches `sk-design` and returns a scale step with its reason, instead of an out-of-scope decline.
- **SC-002**: A request to extract a live site still reaches `sk-design-md-generator` and runs the unchanged pipeline.
- **SC-003**: A request that needs both measures first and lets the reference outrank the defaults.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [System/API] | [What if blocked] | [Fallback plan] |
| Risk | [Risk description] | [High/Med/Low] | [Mitigation strategy] |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- [Question 1 requiring clarification]
- [Question 2 requiring clarification]
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
