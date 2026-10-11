---
title: "Feature Specification: Phase 17: release-changelog"
description: "The v4.0.0.4 release entry did not mention the sk-code Ponytail refinement or the feature catalog template anchor work, though both reached main for that release."
trigger_phrases:
  - "release changelog"
  - "phase 17 release changelog"
  - "v4.0.0.4 refinement epic entries"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 17: release-changelog

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-11 |
| **Branch** | `worktrees/100-v4004-changelog-epic` |
| **Parent Spec** | ../spec.md |
| **Phase** | 17 of 17 |
| **Predecessor** | 016-residual-closeout |
| **Successor** | None |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of the sk-code Ponytail 5 refinement phase parent. It records the epic's user-facing changes in the Skilled v4.0.0.4 release entry, together with the feature catalog template anchor work in `sk-doc/066-feature-catalog-template-anchor-deprecation`.

**Scope Boundary**: Only `.skilled/changelog/skilled/v4.0.0.4.md` and this packet's own docs change.

**Dependencies**:
- Every phase of both spec trees is complete and on origin/main.

**Deliverables**:
- Release entries for what an external user of the repository would notice or have to act on.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Other sessions filled the v4.0.0.4 release entry with the spec tooling, deep-loop and security work. Nothing in it named the review contract, hook deadlines, dispatch guard, advisor routing, commit gate, script renames, Node floor or the retired catalog comment that this epic and its sibling track shipped.

### Purpose
A reader of v4.0.0.4 learns every change from both tracks that alters what they see or have to do, each fact said once, in the sk-create-changelog voice.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New and changed behavior, commands, flags, hooks and checks
- Routing changes, new failure modes, renamed scripts, the Node floor and the retired template comment
- Upgrade Notes lines for each action a user has to take

### Out of Scope
- Research rounds, review rounds, goal refreshes, version bumps and trigger index rebuilds, because no external user notices them
- Other sessions' entries in the file, which stay as they are

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/changelog/skilled/v4.0.0.4.md` | Modify | Add the two tracks' entries |
| This phase's docs and the parent phase map and goal | Create/Modify | Record the phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every user-facing change of both tracks appears once | Each entry traces to a commit carrying one of the two Spec trailers |
| REQ-002 | The voice gate holds | `hvr_scan.py` reports 0 hard blockers and a ceiling no lower than before the edit |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The changelog validator passes | `validate_document.py` prints VALID |
| REQ-090 | Strict validation of the parent passes | validate.sh --recursive --strict prints RESULT: PASSED |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every completion criterion in goal.md passes when the orchestrator reruns it.
- **SC-002**: The phase lands as one conventional commit in the worktree.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Another session edits v4.0.0.4 at the same time | Med | Fetch origin/main before the commit and keep both sets of entries |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
