---
title: "Feature Specification: Phase 6: sk-doc hub and mode packets"
description: "Bring the remaining sk-doc packets and the hub routing section to the canon shape."
trigger_phrases:
  - "sk-doc hub and mode packets"
  - "skill routing phase 6"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: sk-doc hub and mode packets

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-28 |
| **Branch** | `worktrees/254-skill-routing-and-clarity` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 11 |
| **Predecessor** | 005-sk-code-hub |
| **Successor** | 007-sk-design-and-deep-loop-hubs |
| **Handoff Criteria** | Every P0 requirement below is met and `validate.sh --strict` passes for this folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the skill routing and clarity program. Its plan comes from the phase 001 research at `../001-deep-research/research/research.md`.

**Scope Boundary**: the files listed under Files to Change. Anything else is a later phase or out of scope.

**Dependencies**:
- Phases 003 and 004

**Deliverables**:
- The changes in scope, and the gate output that proves them.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-doc has 14 packets. Nine already route with no machine block because the hub `ROUTER.md` names their leaves, and five still carry one. Its hub `SKILL.md` §2 packs both stages, the advisor handoff and the source-of-truth rule into one paragraph.

### Purpose
Bring the remaining sk-doc packets and the hub routing section to the canon shape.
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
- Bring the five packets that carry machine blocks to the canon shape, or drop the block where the hub already names the leaves.
- Rewrite the hub routing paragraph at `SKILL.md:53` as short sentences, with the authority phase 004 settled.
- Keep the reason the machine block stays out of the hub `SKILL.md` in one place and link to it.

### Out of Scope
- The vocabulary authority decision - phase 004

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/SKILL.md` | Modify | Routing section |
| `.skilled/skills/sk-doc/sk-create-*/SKILL.md` | Modify | Canon packet shape |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `parent-skill-check.cjs`, `package_skill.py --strict` and `compiled-route-guard.cjs` pass after the change. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The separation rationale appears once, and every other copy links to it. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The sk-doc gates pass.
- **SC-002**: `rg -c 'must not move into'` across hub `SKILL.md` files finds one full statement.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 003 and 004 | Shape and vocabulary | Read both phase folders |
| Risk | sk-doc is the canon owner, so its edits are copied elsewhere | Med | Change it after the canon is proven in phase 003 |
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
