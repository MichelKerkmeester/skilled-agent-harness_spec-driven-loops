---
title: "Feature Specification: Phase 5: readme-node-floor"
description: "The root README told adopters Node.js 20.11 was enough, while its own install steps install packages that declare Node 20.19 or 22.12 as their floor."
trigger_phrases:
  - "readme node floor"
  - "phase 5 readme node floor"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: readme-node-floor

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/094-root-cause-ux-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-pi-ambiguous-denial |
| **Successor** | 006-hook-late-write-test |
| **Handoff Criteria** | Every criterion in this phase's `goal.md` passes and the phase is committed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the root cause and UX research packet, which builds the ranked fixes from `../research/research.md`.

**Scope Boundary**: One line in the root README.

**Dependencies**:
- `../research/research.md` section 6, item 2, corrected here

**Deliverables**:
- A README prerequisite line that matches the documented install steps

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The README prerequisite says Node.js 20.11+. Its install step 3 runs `npm --prefix .skilled/skills/system-skill-advisor/runtime install`, and that lockfile installs rolldown 1.2.8 and vite 8.3.0 with engines `^20.19.0 || >=22.12.0`. An adopter on Node 20.11 to 20.18 follows the README and gets engine warnings and a test stack built for a newer Node. The research had cited the wrong lockfile, `.skilled/package-lock.json`, where the matching entry is an optional Android binding; the spec-kit package's own floor of 20.11 is correct for spec-kit alone.

### Purpose
State the floor the documented install actually needs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The Node line in the root README prerequisites

### Out of Scope
- `.skilled/skills/system-spec-kit/package.json` engines, which match that package's own dependencies
- The advisor runtime's `package.json`, which declares no engines and belongs to the skill-authoring track; recorded as a handoff
- The spec-kit README, whose 20.11 floor is right for spec-kit alone

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md` | Modify | Node.js 20.11+ becomes 20.19+ |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The README floor covers every package its install steps install | Line 160 reads Node.js 20.19+ |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The README still validates | `validate_document.py README.md` prints VALID |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No 20.11 floor remains in the root README.
- **SC-002**: The spec-kit package floor is unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Raising the stated floor turns away users the spec-kit alone would serve | Low | The parenthetical and the spec-kit README still describe spec-kit's own needs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking the phase.
<!-- /ANCHOR:questions -->

---
