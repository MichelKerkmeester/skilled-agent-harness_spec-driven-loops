---
title: "Feature Specification: Phase 4: webflow-checker-fix"
description: "The Webflow minified-runtime checker, a pre-deploy gate, passes scripts whose deferred callbacks throw, and neither it nor the stack-folder validator has a known-bad test input."
trigger_phrases:
  - "webflow checker fix"
  - "phase 4 webflow checker fix"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: webflow-checker-fix

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-10-09 |
| **Branch** | `scaffold/004-webflow-checker-fix` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 6 |
| **Predecessor** | 003-doctrine-pass |
| **Successor** | 005-review-output-additions |
| **Handoff Criteria** | Seeded deferred-throw script fails; known-good scripts still pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the sk-code Ponytail 5 refinement specification.

**Scope Boundary**: Error capture in the Webflow checker and known-bad inputs for two checkers.

**Dependencies**:
- Section 7, D1, of `../001-ponytail-deep-research/research/research.md`

**Deliverables**:
- Callback error capture in the checker
- A known-bad fixture for the checker
- A known-bad fixture for the stack-folder validator

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Stand-in `setTimeout`, `requestAnimationFrame` and `Webflow.push` run callbacks inside empty catch blocks, and `addEventListener` is a no-op, so a PASS only means top-level code ran. Re-review reproduced it: a script whose deferred callbacks all throw got PASS. The stand-in page returns null for every element lookup, so failing on every callback error would also fail working scripts.

### Purpose
The checker fails a script whose invoked callbacks throw, and still passes real scripts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Collect errors from callbacks the checker actually invokes in `test-minified-runtime.mjs` and fail on any, with a nesting cap so a script that polls for a missing element does not overflow the stack
- Update the two script README tables that list the checkers and their fixtures
- Add a known-bad deferred-throw fixture and a known-good control
- Add a known-bad orphan-folder fixture for `verify_stack_folders.py`

### Out of Scope
- Dispatching synthetic events to every listener - only where a real target needs it
- The Codex mirror gap - handed off to its owner

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs` | Modify | Callback error capture |
| `.skilled/skills/sk-code/sk-code-webflow/assets/scripts/` | Create | Known-bad and known-good fixtures |
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/` | Create | Validator known-bad fixture |
| `.skilled/skills/sk-code/sk-code-webflow/assets/scripts/README.md` | Modify | Checker and fixture table |
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/README.md` | Modify | Validator and fixture table |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Deferred throw fails | The seeded deferred-throw fixture exits non-zero |
| REQ-002 | Real scripts pass | The known-good controls, including a polling script, and every runnable in-repo asset still pass; the Webflow project's own minified scripts are checked in that project, since they are not in this repository |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Validator known-bad input | A unittest that adds an orphan language folder to a temporary copy of the validator's tree makes `verify_stack_folders.py` exit 1 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No deferred callback error passes the pre-deploy gate silently
- **SC-002**: Both checkers have a known-bad input that proves they can fail
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Null element lookups surface as false failures | High | Capture only errors from invoked callbacks, as the research recommends |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The known-good control set is the in-repo controls, including a polling script, plus every runnable in-repo asset (REQ-002); the Webflow project's own scripts are checked in that project.
<!-- /ANCHOR:questions -->

---


