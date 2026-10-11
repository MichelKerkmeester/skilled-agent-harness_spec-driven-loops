---
title: "Feature Specification: Phase 2: admission-corpus-pin"
description: "The compiled-route admission test pinned the live gold corpus at 80 scenarios while the corpus holds 86, so the suite failed one test on every clean checkout."
trigger_phrases:
  - "admission corpus pin"
  - "phase 2 admission corpus pin"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: admission-corpus-pin

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
| **Phase** | 2 of 6 |
| **Predecessor** | 001-compiled-route-manifest-suite |
| **Successor** | 003-stale-jev-canary |
| **Handoff Criteria** | Every criterion in this phase's `goal.md` passes and the phase is committed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the root cause and UX research packet, which builds the ranked fixes from `../research/research.md`.

**Scope Boundary**: One file: the admission test. The admission report rerun is written into this phase's evidence folder; the original baseline in its own packet is not overwritten.

**Dependencies**:
- `../research/research.md` section 5

**Deliverables**:
- An admission suite that passes
- A rerun admission report in `evidence/`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`LIVE_CORPUS_SIZE` is a deliberate change detector: its comment says a change means scenarios were added and the baseline report needs a rerun. Scenarios were added across the hubs and the pin stayed at 80, so `node --test` on the suite printed 29 tests, 28 pass, 1 fail, `actual: 86, expected: 80`.

### Purpose
Re-pin the corpus size to the live count and rerun the report the comment names.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Change the pinned size from 80 to 86
- Rerun the admission report over every hub into `evidence/`

### Out of Scope
- Overwriting the baseline report under `specs/system-speckit/.../017-build-compiled-serving-gold-admission-checker/baseline/`, which is another packet's recorded evidence
- The one drift verdict the rerun shows for system-deep-loop, which this phase reports and does not fix

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/tests/compiled-route-admission.test.cjs` | Modify | Pin 86 instead of 80 |
| `evidence/admission-report.md`, `evidence/admission-report.json` | Create | Rerun of the admission report |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The admission suite passes | `node --test` prints `fail 0` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The report is rerun | `evidence/admission-report.md` exists and its scenario counts sum to 86 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The pin equals the live corpus size.
- **SC-002**: The rerun report covers all seven admitted hubs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Keeping a literal pin means the next scenario added fails the test again | Low | That failure is the pin's purpose; its comment says to rerun the report |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking the phase.
<!-- /ANCHOR:questions -->

---
