---
title: "Feature Specification: Phase 2: Baseline and routing correctness"
description: "Record a baseline for every routing gate and fix the known routing bugs without changing any skill's routing shape."
trigger_phrases:
  - "baseline and routing correctness"
  - "skill routing phase 2"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: Baseline and routing correctness

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
| **Phase** | 2 of 11 |
| **Predecessor** | 001-deep-research |
| **Successor** | 003-routing-canon-and-tooling |
| **Handoff Criteria** | Every P0 requirement below is met and `validate.sh --strict` passes for this folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the skill routing and clarity program. Its plan comes from the phase 001 research at `../001-deep-research/research/research.md`.

**Scope Boundary**: the files listed under Files to Change. Anything else is a later phase or out of scope.

**Dependencies**:
- The research synthesis in phase 001

**Deliverables**:
- The changes in scope, and the gate output that proves them.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Later phases cannot claim no regressions without numbers from before they start, and the research found routing bugs that are independent of any shape change. system-skill-advisor's `RESOURCE_BASES` names `feature_catalog` and `manual_testing_playbook` while the folders are hyphenated, and its `HOOK` intent maps to a leaf missing from its own manifest. sk-code `ROUTER.md` §2 and §9 disagree in both directions.

### Purpose
Record a baseline for every routing gate and fix the known routing bugs without changing any skill's routing shape.
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
- Run and record `parent-skill-check.cjs`, `verify-router-sync.cjs`, `compiled-route-guard.cjs --json`, `package_skill.py --strict`, `check-rule-copies.js`, the router-reach doctor workflow and `sync-skills-hermes.cjs --check`, with output and exit status.
- Recount the unconfirmed drift numbers in the research (per-executor vocabulary, sk-doc trigger terms) and record them as fixtures.
- Fix system-skill-advisor's discovery roots, its `hooks/` coverage and its `HOOK` leaf membership.
- Make sk-code `ROUTER.md` §2 and §9 list the same intents.
- Close the mcp-obsidian stage-one and stage-two gap, align cli-jev's default resource with its hub, update `shared-smart-router.md` from six to seven providers, and remove the retired benchmark claim in cli-external-orchestration.

### Out of Scope
- Any change to where routing lives - phase 003 owns the canon
- Vocabulary consolidation - phase 004 owns it

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/SKILL.md` | Modify | Discovery roots and HOOK leaf |
| `.skilled/skills/sk-code/ROUTER.md` | Modify | §2 and §9 agree |
| `.skilled/skills/mcp-tooling/ROUTER.md` | Modify | Obsidian intents match stage one |
| `.skilled/skills/system-spec-kit/references/cli/shared-smart-router.md` | Modify | Seven providers |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A baseline file in this phase's `scratch/` records every gate's output and exit status before the first edit. |
| REQ-002 | After the fixes, every gate in the baseline passes at least as well as before. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Each fixed defect cites the research finding it closes. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/baseline.md` exists and lists each gate with its exit status.
- **SC-002**: Rerunning the baseline after the fixes shows no gate that got worse.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The research synthesis in phase 001 | Without it the defect list is unconfirmed | Read `../001-deep-research/research/research.md` §5 and §6 |
| Risk | The mcp-obsidian fix changes what reaches the mode | Med | Run the router-reach doctor workflow before and after |
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
| Risk | 6/25 | Low blast radius |
| Research | 4/20 | Phase 001 settled the design |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking planning. Open research questions that bear on this phase are in `../001-deep-research/research/research.md` §12.
<!-- /ANCHOR:questions -->

---
