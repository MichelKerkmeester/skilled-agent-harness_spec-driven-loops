---
title: "Feature Specification: Phase 7: lineage-reducer-compliance"
description: "A CLI research lineage can finish without ever running the reducer, writing its dashboard and findings registry by hand in a shape the merge does not expect, and the runner still reports it fulfilled."
trigger_phrases:
  - "lineage reducer compliance"
  - "phase 7 lineage reducer compliance"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: lineage-reducer-compliance

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-09 |
| **Branch** | `scaffold/007-lineage-reducer-compliance` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-research-lineage-reducer-path |
| **Successor** | None |
| **Handoff Criteria** | Cause located and a detection or enforcement change chosen |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Review and CLI lineage specification.

**Scope Boundary**: Detect, and if cheap prevent, a fan-out research lineage that skips the reducer. Reducer path handling is already fixed in phase 006.

**Dependencies**:
- Phase 006, which made the reducer write into the lineage folder
- The proof-run evidence kept at `../006-research-lineage-reducer-path/research/lineages/`

**Deliverables**:
- A diagnosis of why the lineage skipped the reducer
- A check that flags a lineage whose projections were not produced by the reducer

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
In a live two-lineage proof run on 2026-10-09, both cli-pi DeepSeek V4.1 Flash lineages exited 0 and the runner reported 2 of 2 fulfilled. Lineage `proof-b` ran the reducer: its registry, dashboard and strategy were written together, in the reducer's shape, with an `events/` folder. Lineage `proof-a` never ran it: its `findings-registry.json` uses a different, smaller key set, its dashboard lacks the reducer's "Auto-generated" header, it has no `events/` folder, and hand-drafted event files sit in its `tmp/`. A merge over such a lineage reads data the reducer never validated.

### Purpose
A lineage whose projections did not come from the reducer is detected before the fan-out merge reads it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the `proof-a` lineage artifacts and the cli-pi prompt the runner rendered for it, and find where the workflow lets the reducer step be skipped
- Choose between detection at merge time (registry shape or a reducer-written marker) and enforcement in the runner (run the reducer after each lineage iteration itself)
- Add a regression case built from the `proof-a` shape

### Out of Scope
- Reducer output-path handling - fixed in phase 006
- Model choice for lineages - the issue is the workflow allowing the skip, not one model

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` or the fan-out merge script | Modify | Detection or enforcement, chosen during planning |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A lineage with hand-written projections is flagged | A fixture shaped like `proof-a` fails or is flagged before merge; a `proof-b`-shaped fixture passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The cause is recorded | The implementation summary names the step that let the reducer be skipped, with path:line |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No fan-out merge reads a lineage registry the reducer did not write without a warning
- **SC-002**: Existing deep-research fan-out tests still pass
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The skip is model behavior that does not reproduce | Med | Build the check from the saved `proof-a` artifacts rather than relying on a rerun |
| Risk | Enforcing the reducer in the runner duplicates the workflow's own call | Low | Prefer detection unless the diagnosis shows the workflow cannot be fixed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Detection at merge, or the runner running the reducer itself?
<!-- /ANCHOR:questions -->

---


