---
title: "Feature Specification: Phase 4: pi-ambiguous-denial"
description: "The Pi dispatch guard refused an ambiguous command with a message that named neither the problem shape nor the accepted one, while its sibling branch already said what to do."
trigger_phrases:
  - "pi ambiguous denial"
  - "phase 4 pi ambiguous denial"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: pi-ambiguous-denial

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/094-root-cause-ux-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 6 |
| **Predecessor** | 003-stale-jev-canary |
| **Successor** | 005-readme-node-floor |
| **Handoff Criteria** | Every criterion in this phase's `goal.md` passes and the phase is committed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the root cause and UX research packet, which builds the ranked fixes from `../research/research.md`.

**Scope Boundary**: Two files in the Pi dispatch hook: the preflight lint and its test.

**Dependencies**:
- `../research/research.md` section 6, item 4

**Deliverables**:
- A deny reason that names the accepted command shape
- A test that pins it

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
When a command looks like a CLI dispatch but does not name exactly one executor literally, for example through a variable, alias or path, the Pi guard blocked it with "Pi dispatch denied: the command does not prove one direct executor." The reader learns that it failed, not how to pass. The research lineage hit this refusal live and could not tell what to change.

### Purpose
Make the refusal say what an accepted command looks like.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extend the ambiguous-branch reason string
- Add one test that asserts the new guidance

### Out of Scope
- How the inspector classifies a command as ambiguous
- Feature catalog and playbook prose that quote the first sentence, which still holds and belongs to the documentation track

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts` | Modify | Append the accepted shape to the ambiguous deny reason |
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | Modify | One case asserting the guidance |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The ambiguous deny reason names the accepted shape | The new test passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The new test failed before the change | Recorded failing run |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The full Pi lint suite passes.
- **SC-002**: The first sentence of the reason is unchanged, so prose that quotes it stays true.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Longer reason text breaks a consumer that matches it exactly | Low | The suite asserts with `toContain`; no consumer matches the full string |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking the phase.
<!-- /ANCHOR:questions -->

---
