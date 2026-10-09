---
title: "Feature Specification: Playbooks for the modes that act on another mode's output"
description: "Three sk-doc modes with no manual testing playbook: sk-create-manual-testing-playbook,sk-create-quality-control,sk-create-skill. Nothing states what any of them doing its job looks like."
trigger_phrases:
  - "sk-create-manual-testing-playbook playbook"
  - "sk-create-quality-control playbook"
  - "sk-create-skill playbook"
  - "meta and quality mode playbooks"
importance_tier: "high"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 3: meta-and-quality

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

This phase gives the modes that act on another mode's output (`sk-create-manual-testing-playbook`, `sk-create-quality-control`, `sk-create-skill`) a manual testing playbook each, so an operator has a written scenario that says what the mode doing its job looks like. The three packages were authored and committed in `ad9d93df3be` (2026-09-01) under another packet; this phase records that delivery against its own requirements.

**Key Decisions**: Scenario frontmatter follows the operator-scenario contract with the Lane C benchmark fields omitted; every mode carries scenarios in both directions, one it must act on and one it must leave alone.

**Critical Dependencies**: The package validator `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs`, read on its operator count rather than its exit status.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-01 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-artifact-producers |
| **Successor** | None |
| **Handoff Criteria** | Each package validates as an operator-scenario package: `PASS` with a non-zero `operator` count and `routing_gold_excluded=0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Give every sk-doc mode the manual testing playbook it lacks specification.

**Scope Boundary**: The `manual-testing-playbook/` package of `sk-create-manual-testing-playbook`, `sk-create-quality-control`, `sk-create-skill`. No mode behaviour changes.

**Dependencies**:
- The operator-scenario contract owned by `sk-create-manual-testing-playbook` and its validator.

**Deliverables**:
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook/`
- `.skilled/skills/sk-doc/sk-create-quality-control/manual-testing-playbook/`
- `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/`

**Delivery record**: The packages landed in commit `ad9d93df3be` under `sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/007-sk-doc`. This phase did not author them; it records them. See `implementation-summary.md`.
<!-- /ANCHOR:phase-context -->

---
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Each of these takes another mode's output as its input. One of them authors playbooks and has never had one, which is the sharpest instance of the gap this packet closes.

None of the three has a playbook, so none has a written statement of correct behaviour, and an operator asked to check one has nothing to follow.

### Purpose

These three modes can be checked by an operator following a written scenario.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A manual testing playbook package for `sk-create-manual-testing-playbook`.
- A manual testing playbook package for `sk-create-quality-control`.
- A manual testing playbook package for `sk-create-skill`.
- Scenario frontmatter written to the operator-scenario contract, with the Lane C benchmark fields omitted, matching the playbooks that already exist.
- Coverage in both directions per mode: what it must catch, and what it must leave alone.

### Out of Scope

- Changing any of the three modes. A playbook records what a mode already does.
- The other six modes in this packet. They belong to sibling phases and can be written at the same time.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook/**` | Create | The playbook package for sk-create-manual-testing-playbook |
| `.opencode/skills/sk-doc/sk-create-quality-control/manual-testing-playbook/**` | Create | The playbook package for sk-create-quality-control |
| `.opencode/skills/sk-doc/sk-create-skill/manual-testing-playbook/**` | Create | The playbook package for sk-create-skill |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every package reports `PASS` with `operator=N routing_gold_excluded=0` |
| REQ-002 | Exit zero alone is not accepted as evidence, because a fully excluded package exits zero with `operator=0` and status `SKIP` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Each mode has at least one scenario it must pass and one it must fail |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate-playbook-package.cjs` reports `PASS` and a non-zero `operator` count for all three
- **SC-002**: `routing_gold_excluded=0` for all three, proving the operator contract was actually exercised
- **SC-003**: The connectivity gate still reports no failure across the fleet
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `validate-playbook-package.cjs` | Without it no package can be checked against the contract | Run it per package with `--package <root>` and read the summary line |
| Risk | A package whose scenarios carry the routing-gold signature is excluded, giving `operator=0`, status `SKIP` and exit zero | High: a sweep that reads exit status calls it clean | Every package is judged on its `operator` count and `routing_gold_excluded=0`, never on exit status |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: A package validates the same way on every run: the validator reads files only and writes nothing.

### Maintainability
- **NFR-M01**: Each scenario names its exact prompt, command sequence and PASS/FAIL line, so an operator needs no outside context to run it.

---

## 8. EDGE CASES

- A package with zero operator scenarios exits zero with status `SKIP`; the requirement rejects that outcome explicitly (REQ-002).
- A scenario later retired with its feature leaves the package smaller but still valid; the validator count is read at the time of closure.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Three packages of markdown, no code |
| Risk | 6/25 | No runtime surface; the SKIP-at-exit-zero trap |
| Research | 4/20 | Each mode's current behaviour, read from its SKILL.md and references |
| Multi-Agent | 3/15 | One lineage per package |
| Coordination | 3/15 | Independent of the sibling phases |
| **Total** | **24/100** | **Level 3 (inherited from the packet scaffold)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A fully excluded package reads as clean | H | M | Assert `operator` greater than zero per package |
| R-002 | A playbook asserts a bug because the mode was edited while writing it | M | L | Out of scope: no mode behaviour changes in this phase |

---

## 11. USER STORIES

### US-001: Check a mode against a written scenario (Priority: P0)

**As an** operator, **I want** a scenario for each of these modes with an exact prompt and a PASS/FAIL line, **so that** I can tell whether the mode still does its job.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-001, AC-002).

---

### US-002: Catch over-reach as well as under-reach (Priority: P1)

**As an** operator, **I want** each mode to carry a scenario it must leave alone, **so that** a mode that starts acting outside its job also fails.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-003).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Implementation Summary**: See `implementation-summary.md`
