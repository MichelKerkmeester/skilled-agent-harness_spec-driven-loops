---
title: "Feature Specification: Phase 1: baseline-capture"
description: "Record the pre-change exit status and key metrics of all eight gates that the sk-prompt teardown will move, so every later phase has a real negative control to compare against."
trigger_phrases:
  - "008 phase 001"
  - "sk-prompt baseline capture"
  - "gate baseline sk-prompt"
  - "negative control sk-prompt teardown"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: baseline-capture

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-28 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 8 |
| **Predecessor** | None |
| **Successor** | 002-models-packet-deletion |
| **Handoff Criteria** | All eight gates recorded with captured exit status; every one reads exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the sk-prompt standalone conversion.

**Scope Boundary**: Read-only measurement. This phase changes no source file; it only runs gates and records their output.

**Dependencies**:
- Working tree on `skilled/v4.0.0.0` with the sk-prompt hub intact
- Devin CLI available and authenticated for later phases (probed here, not used)

**Deliverables**:
- Captured stdout and exit status for all eight gates under `scratch/baseline/`
- The three routing metrics later phases must restore or knowingly move

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The teardown deliberately reds several gates before it fixes them, and two of the routing metrics are already sitting exactly at their CI ceilings. Without a recorded pre-change state there is no way to tell a regression the teardown caused from one that was already latent, and no way to prove at the end that the gates returned to where they started.

### Purpose
Every gate the teardown can move has its pre-change output and exit status on disk, so later phases compare against measured fact rather than assumption.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run and capture the three skill-root gates: root metadata class contract, leaf-manifest freshness, derived freshness
- Run and capture the compiled-routing freshness guard and the per-hub parent-skill structural check
- Run and capture the prompt-quality card-sync guard across all four of its checks
- Run and capture the skill-graph compiler validation and the routing-accuracy corpus scorer
- Record the scorer-eval ratchet pins that the deletion will move

### Out of Scope
- Any source modification - this phase is measurement only
- The vitest suites requiring a full advisor install - deferred to the phases that actually move them
- Re-deriving CI thresholds - the checked-in floors are taken as given here

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/baseline/g1.txt` … `g8.txt` | Create | Captured stdout plus exit status per gate |
| `implementation-summary.md` | Create | Recorded results and the metrics later phases must honour |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Capture exit status for all eight gates from the untouched tree | Eight files under `scratch/baseline/` each end with an `exit=` line |
| REQ-002 | Record the routing-accuracy joint counts and headroom | Summary names TT, FT, FF and states which are at their CI ceiling |
| REQ-003 | Record the scorer-eval ratchet pins the deletion will move | Summary names the delegation bucket count and the three corpus sha256 pins |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Confirm the executor used for later phases is reachable | `devin auth status` reports logged in and the binary version is recorded |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All eight captured gates read exit 0, establishing a clean starting line
- **SC-002**: The two routing metrics with zero CI headroom are named explicitly so later phases do not spend slack that does not exist
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Routing corpus scorer needs the built shared dist | Gate 8 cannot run | Confirmed runnable in this checkout before relying on it |
| Risk | A gate is already red before any change | The teardown would inherit a failure it did not cause | Captured first, so an inherited failure is visibly pre-existing |
| Risk | FT and FF sit at their CI ceilings | Any added false fire fails CI immediately | Recorded explicitly so later phases treat them as zero-slack |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None; this phase is measurement and closed on capture.
<!-- /ANCHOR:questions -->
