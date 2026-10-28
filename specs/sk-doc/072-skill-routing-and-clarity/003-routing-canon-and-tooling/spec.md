---
title: "Feature Specification: Phase 3: Routing canon and tooling"
description: "Change the canon and tooling once, prove the new packet shape on one packet, and only then let later phases roll it out."
trigger_phrases:
  - "routing canon and tooling"
  - "skill routing phase 3"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: Routing canon and tooling

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
| **Phase** | 3 of 11 |
| **Predecessor** | 002-baseline-and-routing-correctness |
| **Successor** | 004-single-vocabulary-source |
| **Handoff Criteria** | Every P0 requirement below is met and `validate.sh --strict` passes for this folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the skill routing and clarity program. Its plan comes from the phase 001 research at `../001-deep-research/research/research.md`.

**Scope Boundary**: the files listed under Files to Change. Anything else is a later phase or out of scope.

**Dependencies**:
- Phase 002 baseline

**Deliverables**:
- The changes in scope, and the gate output that proves them.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The templates and checks that shape every skill still teach the long inline routing section. `package_skill.py` requires an H2 named `SMART ROUTING` with three marker words, and nobody has tested whether a final machine-router appendix keeps `parseRouter`, `verify-router-sync.cjs`, `package_skill.py` and `parent-skill-check.cjs` green.

### Purpose
Change the canon and tooling once, prove the new packet shape on one packet, and only then let later phases roll it out.
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
- Define the target packet shape in the create-skill and parent-skill templates: an 8 to 12 line SMART ROUTING section, then a final `## MACHINE ROUTER` appendix, or no block where the hub names the leaves.
- Prove the shape on one low-blast packet and run `verify-router-sync.cjs`, `package_skill.py --strict` and `parent-skill-check.cjs` on it.
- Adjust `package_skill.py`, `router-replay-lib.cjs` or `verify-router-sync.cjs` only where the proof shows they reject the shape, including leg 2's empty `SHARED_CONTROL_RESOURCES` case.
- Pick one name for the no-match outcome and one glossary location per hub.
- Make sk-create-skill produce the new shape by default: its skill and parent-skill templates and scaffolds (`.skilled/skills/sk-doc/sk-create-skill/assets/`), the reference docs that teach skill creation (`sk-create-skill/references/`), and the `/create:skill` and `/create:skill-parent` command workflows and presentation assets (`.skilled/commands/create/`).
- Make a check that already runs on skill creation reject a new or changed `SKILL.md` in the old shape: a SMART ROUTING section over the agreed length, a machine router block that is not the final appendix, or a `ROUTER.md` inside a mode packet. Extend `package_skill.py --strict` for `/create:skill` and `parent-skill-check.cjs` for `/create:skill-parent`; the parent flow gates on the latter and does not run the former. Existing skills are listed as known debt for phases 005 to 009, so the fleet run does not break CI.

### Out of Scope
- Rolling the shape out to more than the proof packet - phases 005 to 009 do that

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-skill/assets/` | Modify | Packet and parent-skill templates |
| `.skilled/skills/sk-doc/scripts/package_skill.py` | Modify | Only if the proof needs it |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Modify | Only if the proof needs it |
| `.skilled/skills/sk-doc/sk-create-skill/references/` | Modify | Skill-creation guidance teaches the new shape |
| `.skilled/commands/create/` | Modify | `/create:skill` and `/create:skill-parent` workflows and presentation assets produce the new shape |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/` | Modify | The existing creation check rejects the old shape, with a known-debt list for existing skills |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | One proof packet uses the new shape and `verify-router-sync.cjs`, `package_skill.py --strict` and `parent-skill-check.cjs` pass on it. |
| REQ-002 | Every tooling change ships with a test that fails without it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The templates describe the new shape in plain words with one example. |
| REQ-004 | sk-create-skill produces the new shape by default, through its templates, scaffolds, reference docs and the `/create:skill` and `/create:skill-parent` workflows. |
| REQ-005 | Both default creation checks reject a new or changed `SKILL.md` in the old shape: `package_skill.py --strict` for `/create:skill` and `parent-skill-check.cjs` for `/create:skill-parent`. Tests prove each check rejects an old-shape fixture, and a fleet run lists existing skills as known debt without failing CI. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three gates pass on the proof packet.
- **SC-002**: The template diff shows the short routing section and the appendix.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 baseline | Without it a green gate means nothing | Compare against `../002-baseline-and-routing-correctness/scratch/baseline.md` |
| Risk | A template change reaches every future skill | High | Prove on one packet first and keep the tooling change minimal |
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
