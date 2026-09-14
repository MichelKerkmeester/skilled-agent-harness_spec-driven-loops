---
title: "Feature Specification: Phase 7: hermes-playbook-and-catalog"
description: "Hermes playbook and catalog: a 36-scenario manual-testing playbook at the Pi depth with 22 live scenarios executed twice and 14 hermetic stress cells, a fail-closed feature catalog for the cli-hermes surface, and the hub catalog counting seven packets."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 7: hermes-playbook-and-catalog

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The packet's claims are now executable. A 36-scenario playbook (22 Hermes-specific, 14 shared stress cells) was authored to the Pi package shape and the 22 live scenarios were run twice: the first pass found two failures and four boundaries, the runtime and plugin were fixed, and the second pass passed 22 of 22. A feature catalog inventories the shipped cli-hermes surface with symbol-level anchors and validates fail-closed.

**Key Decisions**: playbook and catalog authored with `sk-create-manual-testing-playbook` and `sk-create-feature-catalog`; every live scenario re-executed after the contract changed rather than carried forward

**Critical Dependencies**: phases 002 to 007; the operator steps on this machine

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Complete — playbook executed twice and catalog validated 2026-09-14 |
| **Created** | 2026-09-14 |
| **Branch** | `scaffold/008-hermes-playbook-and-catalog` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 9 |
| **Predecessor** | 007-hermes-model-registry-and-routing |
| **Successor** | 009-docs-governance-and-closeout |
| **Handoff Criteria** | Playbook scenarios executed with recorded evidence; catalog validates |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the cli-hermes creation packet; its durable directive and closure criteria are in `goal.md`, derived from the phase 001 synthesis and confirmed by the operator on 2026-09-14.

**Scope Boundary**: Author the manual-testing playbook and feature catalog with their create modes and execute the scenarios; optional.

**Dependencies**:
- Phases 002 to 007 shipped

**Deliverables**:
- Playbook root plus scenarios, benchmark reports, feature catalog

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The packet had a playbook root with categories and no scenarios, no recorded execution, and no catalog. Every sibling mode ships both, and the sibling stress matrix listed fourteen pending cells for `cli-hermes`.

### Purpose
The cli-hermes packet carries a playbook and a catalog at the sibling depth, and the playbook has been executed with recorded evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Playbook root plus 22 Hermes-specific scenario files across ten categories and 14 `stress/` cells
- Two recorded runs under `benchmark/reports/`
- `cli-hermes/feature-catalog/` (root plus 11 leaves) and the hub catalog counting seven packets

### Out of Scope
- Running the 14 hermetic stress cells by hand - the runtime suite `cli-hermes.vitest.ts` executes them
- Fixing the pre-existing hub-catalog parity warnings - they predate this packet

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/**` | Create/Modify | root v1.1.0.0, 22 scenarios, 14 stress cells |
| `.opencode/skills/cli-external-orchestration/cli-hermes/benchmark/reports/2026-09-14-phase-008-{first,second}-pass/` | Create | recorded runs |
| `.opencode/skills/cli-external-orchestration/cli-hermes/feature-catalog/**` | Create | root plus 11 leaves |
| `.opencode/skills/cli-external-orchestration/feature-catalog/**` | Modify | seven packets |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Playbook root plus scenario files exist and the count is proportional to `cli-pi`'s (37) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | At least half the scenarios executed with recorded evidence under `benchmark/reports/` |
| REQ-003 | The catalog validates with the hub's feature-catalog checker |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: operator contract validator `PASS ... scenarios=36 categories=11 violations=0`
- **SC-002**: second pass 22 PASS, 0 FAIL, 0 SKIP; catalog validator `PASS: 0 violations`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Live provider and the four operator steps | Scenarios would SKIP | Already configured on this machine |
| Risk | A scenario records a command it no longer runs | Med | Every live scenario re-executed after the contract change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each live scenario bounded by a 300 s alarm; the corrected toolset brought the slowest from 295 s to 31 s

### Security
- **NFR-S01**: No credential in any scenario or report; destructive controls confined to the scratchpad

### Reliability
- **NFR-R01**: Stress matrix bijection `missing tests: 0, missing playbooks: 0`

---

## 8. EDGE CASES

### Data Boundaries
- A dispatch the session hook refuses (write-shaped without `--yolo`): run from a scratch script and recorded as such
- Exit 0 with empty or fragment stdout: the content gate in the empty-stdout scenario catches both

### Error Scenarios
- Gateway stall: the 300 s alarm ends the run and the scenario records FAIL with the cause
- None else

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: ~60, docs only |
| Risk | 6/25 | Live runs against the gateway |
| Research | 8/20 | Two execution passes |
| Multi-Agent | 8/15 | Two lanes |
| Coordination | 10/15 | Every earlier phase |
| **Total** | **46/100** | **Level 3 (inherited from the packet)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A first-pass finding is fixed in code but the playbook keeps the old command | M | M | Second pass re-ran every live scenario and renamed the one whose slug named the wrong mechanism |

---

## 11. USER STORIES

### US-001: Reproduce a Hermes claim (Priority: P0)

**As an** operator, **I want** each packet claim as a runnable scenario with recorded evidence, **so that** a regression shows up as a failed scenario, not a surprise.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: See the shipped surface (Priority: P1)

**As a** reviewer, **I want** one catalog of what cli-hermes ships with source anchors, **so that** I can check a claim against the code it names.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---


