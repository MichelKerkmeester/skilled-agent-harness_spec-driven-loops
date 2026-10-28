---
title: "Feature Specification: Phase 11: Regeneration and verification"
description: "Regenerate every derived surface and prove the whole fleet against the phase 002 baseline."
trigger_phrases:
  - "regeneration and verification"
  - "skill routing phase 11"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 11: Regeneration and verification

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-10-28 |
| **Branch** | `worktrees/254-skill-routing-and-clarity` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 11 |
| **Predecessor** | 010-prose-clarity-pass |
| **Successor** | None |
| **Handoff Criteria** | Every P0 requirement below is met and `validate.sh --strict` passes for this folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the skill routing and clarity program. Its plan comes from the phase 001 research at `../001-deep-research/research/research.md`.

**Scope Boundary**: the files listed under Files to Change. Anything else is a later phase or out of scope.

**Dependencies**:
- All earlier phases

**Deliverables**:
- The changes in scope, and the gate output that proves them.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every change in the earlier phases reaches runtime mirrors and generated files: Hermes text copies, command prompt stubs, leaf manifests and compiled routes. A green gate in one phase does not prove the whole fleet is consistent.

### Purpose
Regenerate every derived surface and prove the whole fleet against the phase 002 baseline.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
N/A: this phase is Planned. Its first task records the measured behavior before any edit.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Regenerate the Hermes copies with `sync-skills-hermes.cjs`, the prompt stubs with `sync-prompts.cjs` and `sync-prompts-hermes.cjs`, every leaf manifest, and every compiled route.
- Rerun every gate in the phase 002 baseline and report the delta.
- Bump each changed skill's version and changelog, which check 13d compares.

### Out of Scope
- New routing changes

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.hermes/skills/` | Modify | Regenerated copies |
| `.skilled/skills/*/changelog/` | Create | Version entries |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every gate in the phase 002 baseline passes, and the report states the delta. |
| REQ-002 | `sync-skills-hermes.cjs --check` and `sync-runtime-mirrors.cjs --check` pass. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The phase docs record the gate output that proves each P0 requirement. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The delta report shows no gate worse than the baseline.
- **SC-002**: Both mirror checks pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | All earlier phases | This phase verifies their output | Run last |
| Risk | A stale mirror ships an old SKILL.md to one runtime | Med | Run both mirror checks last |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: documentation and tooling changes with no service to measure.

### Security
- **NFR-S01**: No change names an operator-local surface in a tracked file.

### Reliability
- **NFR-R01**: Every gate this phase touches passes at least as well as in the phase 002 baseline.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a skill with no routing section is left as it is and recorded.
- Maximum input: the largest file in scope is changed last, after the shape is proven on smaller ones.
- Failure path: a gate that gets worse blocks the next file until it is fixed or the change is reverted.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | See Files to Change |
| Risk | 10/25 | Medium blast radius |
| Research | 4/20 | Phase 001 settled the design |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking planning. Open research questions that bear on this phase are in `../001-deep-research/research/research.md` §12.
<!-- /ANCHOR:questions -->

---
