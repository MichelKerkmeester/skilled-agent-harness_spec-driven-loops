---
title: "Feature Specification: Phase 6: guard-retirement-notes"
description: "Retired sk-code guards record their gap without an owner or a partial successor, and the retired Lane C index has no successor note."
trigger_phrases:
  - "guard retirement notes"
  - "phase 6 guard retirement notes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: guard-retirement-notes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-09 |
| **Branch** | `scaffold/006-guard-retirement-notes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-review-output-additions |
| **Successor** | None |
| **Handoff Criteria** | Every retired guard names a successor or a gap and an owner |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the sk-code Ponytail 5 refinement specification.

**Scope Boundary**: Notes in the drift-guard umbrella script and the retired benchmark index.

**Dependencies**:
- Section 10, idea 3, of `../001-ponytail-deep-research/research/research.md`

**Deliverables**:
- A retirement note per retired guard

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The drift-guard umbrella script already records the retired router-sync guard as missing (`sk-code-opencode/scripts/run-all-drift-guards.sh:50-53`), but it names no owner for the gap and does not mention that `.github/workflows/routing-registry-drift.yml` partly covers it. The retired Lane C index carries no successor note at all.

### Purpose
A reader can tell, for each retired guard, what covers it now or that nothing does.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a successor or gap note for each retired guard in `run-all-drift-guards.sh`
- Point the retired router-sync guard at `.github/workflows/routing-registry-drift.yml` as partial coverage
- Add the same note to the retired Lane C index
- Point the docs that describe the retired router-sync suite at the same successor note: `sk-code-opencode/scripts/README.md:12`, `sk-code-opencode/SKILL.md:55-59` and `:173`, and `sk-code-opencode/references/shared/alignment-verification-automation.md`

### Out of Scope
- Reviving any retired guard

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` | Modify | Retirement notes |
| `.skilled/skills/sk-code/benchmark/README.md` | Modify | Lane C successor note |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/README.md` | Modify | Successor note |
| `.skilled/skills/sk-code/sk-code-opencode/SKILL.md` | Modify | Successor note |
| `.skilled/skills/sk-code/sk-code-opencode/references/shared/alignment-verification-automation.md` | Modify | Successor note |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every retired guard noted | Each retired entry names a successor, or a gap and an owner |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Script still runs | `run-all-drift-guards.sh` exits as it did before the edit |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No retired guard is silent about its successor
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The umbrella script path differs from the one researched | Low | Locate it with rg before editing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. sk-code owns the gaps no current guard covers.
<!-- /ANCHOR:questions -->

---


