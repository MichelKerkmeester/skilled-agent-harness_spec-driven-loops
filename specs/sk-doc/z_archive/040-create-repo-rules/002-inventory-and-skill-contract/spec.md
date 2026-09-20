---
title: "Feature Specification: Phase 2: Inventory and Skill Contract"
description: "Eight shipped rule files converged on a shape nobody wrote down: a Fires-when trigger list, one binding sentence, an uppercase numbered body with dividers, and a closing self-check. This phase reads all eight, extracts the anatomy they actually share, states the tests that decide whether a rule may exist at all, and fixes the boundary against sibling sk-doc modes."
trigger_phrases:
  - "repo rule anatomy"
  - "skill contract"
  - "rule inventory"
  - "always-loaded versus triggered"
  - "mode boundary"
importance_tier: "important"
contextType: "specification"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: Inventory and Skill Contract

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-31 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 7 |
| **Predecessor** | 001-repo-rules-router |
| **Successor** | 003-skill-scaffold-and-template |
| **Handoff Criteria** | Every element of the contract traces to a shipped rule that uses it, and every element a shipped rule uses appears in the contract |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the create-repo-rule packet, and the only one that produces no runtime artifact.

**Scope Boundary**: read the eight shipped rules and the router; write a contract document inside this phase folder. Nothing under `.opencode/skills/` is created here - that is phase 3.

**Dependencies**:
- Phase 1 shipped and validates, so the corpus is stable rather than in flight.

**Deliverables**:
- `rule-anatomy.md` - the structural contract, every element traced to the rules that use it.
- `decision-tests.md` - the tests that decide whether a proposed rule may exist, and where its content belongs if it may not.
- `mode-boundary.md` - what this mode owns against `sk-create-skill`, `sk-create-command`, and the rest of the `sk-doc` family.
- `target-tree.md` - the packet layout phase 3 will scaffold.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The eight rule files agree on a shape, and no document states it. Each was authored by reading its predecessors and matching what they did, which worked because the set is small and one reader wrote most of it. That method does not survive a ninth rule written by someone else, and it has already produced drift a contract would have caught: the set carries three different section counts for the same closing element, one file at 190 lines against a stated ceiling of 160, and a `title:` field that was invalid YAML in all eight until it was parsed rather than read. Worse, the rules that decide whether a rule should exist *at all* live only in prose scattered across six phases of implementation summaries - the always-loaded-versus-triggered test, the router's scope boundary, and the refusal test that turned down ten candidate rules are all findings, not contract.

### Purpose
Write down what the eight files already agree on, and what the six phases already decided, so phase 3 has something to build a template from rather than eight examples to imitate.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A structural inventory of all eight rules plus `REPO RULES.md`: frontmatter fields, section shape, heading format, divider placement, self-check convention, cross-reference style.
- The anatomy contract, with every element traced to at least one shipped rule and every divergence between rules recorded as either a permitted variant or a defect.
- The decision tests, recovered from phases 3 through 6: always-loaded versus triggered, the router's In/Out scope boundary, and the four-part refusal test that declined ten candidate rules.
- The `AGENTS.md` and `REPO RULES.md` integration surface a generated rule must satisfy - stated as requirements here, contracted in phase 5.
- The boundary against sibling `sk-doc` modes, so the new mode does not overlap `sk-create-skill` or `sk-create-command`.
- The target tree for the mode packet.

### Out of Scope
- **Creating the skill packet** - phase 3.
- **Writing the template** - phase 3 builds it from this contract.
- **Fixing divergences found in the inventory** - the shipped rules are closed; a divergence is recorded as a finding for the contract to permit or forbid going forward, not a licence to re-edit phase 1.
- **The command** - phase 6, via `sk-create-command`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `rule-anatomy.md` | Create | Structural contract with per-element traceability |
| `decision-tests.md` | Create | Whether a rule may exist, and where its content goes if not |
| `mode-boundary.md` | Create | Ownership against sibling `sk-doc` modes |
| `target-tree.md` | Create | The packet layout phase 3 scaffolds |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every element in the anatomy contract cites at least one shipped rule that uses it, by file and section. |
| REQ-002 | Every structural divergence between the eight rules is recorded, and classified as a permitted variant or a defect the contract forbids going forward. |
| REQ-003 | The contract states the always-loaded-versus-triggered test, because it is the test that decides whether a rule may exist rather than how it should read. |
| REQ-004 | The contract states the router's In/Out scope boundary and the refusal test, both recovered from the phases that established them rather than restated from memory. |
| REQ-005 | The mode boundary names what `sk-create-repo-rule` does NOT own, with the sibling mode that owns it instead. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The contract distinguishes what a generated rule MUST carry from what it MAY carry, rather than describing one blessed shape. |
| REQ-007 | The frontmatter schema matches the reference-doc schema the eight rules already use, including the quoting rule that made them parse. |
| REQ-008 | The integration surface names every file a generated rule must touch to be reachable, and what a rule that skips one loses. |
| REQ-009 | The target tree is justified against a sibling mode's tree, so the layout is inherited rather than invented. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase 3 can build the template from `rule-anatomy.md` alone, without re-reading the eight rules.
- **SC-002**: A proposed rule can be accepted or refused using `decision-tests.md` alone, and the refusal names which test it failed.
- **SC-003**: Every anatomy element traces to a shipped rule; no element is aspirational.
- **SC-004**: The mode boundary answers "should this be a repo rule or a skill?" without consulting another document.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The contract describes the ideal rather than the shipped set, so the template generates files unlike the eight that exist | High - it would make the mode's first output an outlier in its own corpus | REQ-001 requires per-element traceability; an element with no citation does not enter the contract |
| Risk | Divergences get silently normalized, hiding a real disagreement between rules | Med | REQ-002 requires each one recorded and classified, not resolved by picking a favourite |
| Risk | The decision tests get restated from memory and drift from what the phases actually decided | Med - the phases are the record and they are specific | Each test is recovered by reading the phase that established it, and cites it |
| Risk | The contract grows into a second rule set - doctrine about doctrine | Med | The contract states structure and decisions only; the rules themselves stay the authority on their own content |
| Dependency | The eight shipped rules and `REPO RULES.md` | The corpus is the entire input | Phase 1 is closed and validating |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Traceability
- **NFR-T01**: Every contract element cites file and section.
- **NFR-T02**: Every decision test cites the phase that established it.

### Usability
- **NFR-U01**: `decision-tests.md` is usable as a checklist by someone who has read none of the eight rules.
- **NFR-U02**: `rule-anatomy.md` is ordered as the template will be, so phase 3 reads it top to bottom.

### Restraint
- **NFR-R01**: The contract adds no requirement the shipped set does not already meet, unless the addition is recorded as a deliberate tightening with its reason.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Inventory Boundaries
- **A rule that omits an element the others carry**: recorded as a permitted variant if defensible, a defect if not; either way the contract says which.
- **An element only one rule uses**: not yet a pattern - recorded, and admitted to the contract only with a reason.
- **`REPO RULES.md` itself**: a router, not a rule; inventoried separately because a generated rule must wire into it but never look like it.

### Decision Boundaries
- **Content that must bind every turn**: fails the triggered test; belongs in `AGENTS.md`, and the contract says so.
- **Content the router's scope statement excludes**: refused, with the scope clause quoted.
- **A rule that would duplicate a sibling `sk-doc` mode**: refused by the mode boundary rather than by taste.

### Contract Boundaries
- **A shipped rule that violates the contract being written**: recorded as a known divergence, not retro-fixed - phase 1 is closed.
- **Two shipped rules that disagree**: both cited, the disagreement named, and the contract picks one with a stated reason.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 4 documents, no runtime surface, no code |
| Risk | 6/25 | Produces nothing executable; the risk is a wrong contract propagating into phase 3 |
| Research | 14/20 | Reading nine files structurally plus recovering decisions from six phase records |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the contract permit the 190-line `communication.md` as a variant, or hold the ~160-line ceiling and record it as a known exception? **Leaning: hold the ceiling, record the exception with its reason. A ceiling with one exception is still a ceiling; a ceiling that moves to fit its largest violation is not one.**
- Does the mode own generating `REPO RULES.md` itself for a repository that has none, or only rules for an existing router? **UNKNOWN and deliberately deferred to this phase's inventory, because the answer depends on whether the router's shape is as regular as the rules' - which nobody has checked.**
<!-- /ANCHOR:questions -->

---
