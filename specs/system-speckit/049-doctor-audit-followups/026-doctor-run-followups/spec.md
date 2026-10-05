---
title: "Feature Specification: Phase 26: doctor-run-followups"
description: "Two follow-ups from the scenario runs: the sk-doc script tests were red on main because a test assumed every hook-flags example line turns a switch on, and graph validation warned on 14 curated skill metadata blocks that never carried a sanitizer version."
trigger_phrases:
  - "doctor run followups"
  - "sanitizer version stamp"
  - "hook flags example kill switch test"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 26: doctor-run-followups

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-05 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 26 of 26 |
| **Predecessor** | 025-doctor-scenario-runs |
| **Successor** | None |
| **Handoff Criteria** | The sk-doc script tests pass, and graph validation warns only on the skills whose curated labels the sanitizer would change |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 26** of the doctor audit follow-ups. Phase 025 found the sk-doc script tests failing on main and DOC-362 stopping at PARTIAL on 14 sanitizer warnings. The operator approved fixing both, then chose to stamp only blocks whose labels pass the sanitizer unchanged.

**Scope Boundary**: One sk-doc test and the `derived.sanitizer_version` key in seven skill-root `graph-metadata.json` files.

**Dependencies**:
- The sanitizer in `system-skill-advisor/runtime/lib/derived/sanitizer.ts`
- The Jev feature switch reader, which reads hook-flags config

**Deliverables**:
- A passing `test_validation_switch.py` that accepts kill-switch example lines
- `sanitizer_version` on seven skills whose labels pass the sanitizer unchanged
- A report of the 22 labels in seven other skills the sanitizer would drop

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The test required every uncommented example line to turn its switch on, but `JEV_FEATURE_*=0` lines are kill switches whose written value turns a feature off. The graph validator warns on any v2 derived block without `sanitizer_version`, and the only writer of that field replaces curated routing phrases with extracted ones.

### Purpose
A green sk-doc test run on main, and sanitizer warnings that point only at labels the sanitizer really would change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Hold each example line to the value it shows, while still requiring non-zero lines to switch on
- Run every curated label through the current sanitizer and stamp only blocks where nothing changes

### Out of Scope
- Running the derived sync, which would rewrite curated routing phrases
- Changing the sanitizer or the curated labels it would drop - an operator decision

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/scripts/tests/test_validation_switch.py` | Modify | Accept kill-switch lines |
| Seven skill-root `graph-metadata.json` files | Modify | Add `sanitizer_version` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The sk-doc script tests pass | `run-script-tests.sh` reports all tests passed |
| REQ-002 | A stamp is only applied where it is true | Every label in a stamped block passes the sanitizer unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Routing is unchanged | The derived regenerator reports 0 changes and the advisor suite passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The test still fails on an example line that does not take effect.
- **SC-002**: Graph validation warnings fall from 14 to the 7 skills with labels the sanitizer would drop.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A stamp hides a later sanitizer change | Low | The validator still flags a stamped block whose version predates the current sanitizer |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

