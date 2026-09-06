---
title: "Feature Specification: Phase 4: native-chart-build [template:level-3/spec.md]"
description: "The chart corpus is authored here rather than moved. Nothing from the reference implementation is copied, so the proof is not that a migration preserved behaviour but that a chart built from scratch renders and holds its colour system."
trigger_phrases:
  - "author chart templates"
  - "build the colour system"
  - "lieflat validate.mjs"
  - "native chart corpus"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 4: native-chart-build

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The chart templates and the colour system are written here. The operator ruled that nothing from the reference implementation is copied, so this phase builds from a capability list rather than from a source tree. That makes it the largest phase in the packet and the one where the temptation to copy is strongest.

**Key Decisions**: How many chart types the first corpus carries, and what a chart template is allowed to depend on

**Critical Dependencies**: Phase 3's package shape, and phase 2's capability analysis

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-09-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 6 |
| **Predecessor** | 003-packet-scaffold |
| **Successor** | 005-routing-integration |
| **Handoff Criteria** | Every authored template renders in a browser with no install step, resolves its colour tokens, and passes a validator written for this corpus |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Bring the lieflat-charts skill into this repository as sk-create-chart specification.

**Scope Boundary**: Author inside the package phase 3 built. No file, fragment or snippet from the reference implementation is copied in, and the reference tree is not open while writing.

**Dependencies**:
- Phase 3's package, which is where these files are authored
- Phase 2's capability analysis, which is the written description this phase builds from
- ADR-002, which is why this is a build rather than a migration

**Deliverables**:
- The colour system, meaning the named palettes and the token module
- The chart corpus, authored across the three families
- A validator written for this corpus, and a record of what it checks

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The reference implementation is PolyForm Noncommercial and this repository is MIT and public.
The operator ruled that nothing crosses, so the corpus that made the reference worth studying
has to be written here instead.

That is a large build and it has a specific failure mode. With the reference open in another
window, "written natively" degrades into transcription one template at a time, and nobody
notices until the licence question comes back. The defence is procedural rather than moral:
this phase works from the written capability list phase 2 produced, and the reference tree
stays closed.

The second problem is ordinary engineering. A chart template that cannot resolve its colour
tokens still opens in a browser and still looks like a chart. It fails silently, to the eye,
which is why this phase ships a validator rather than trusting a look.

### Purpose

Every ported file works from its new home, proven by the source's own checks rather than by inspection.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The colour system: the named palettes and the token module every template resolves against
- The chart corpus, covering the three families the capability analysis describes
- A validator for this corpus, checking that each template resolves its tokens and renders
- Worked examples, enough to show a reader what a delivered chart looks like

### Out of Scope

- Any file, fragment or snippet from the reference implementation. This is the whole point of
  ADR-002, and a single copied template reopens the licensing question for the entire package
- Matching the reference's chart count as a target in itself. The corpus is sized by what is
  worth having, not by what another project happened to ship
- A build step. A template that opens in a browser with no install is a property worth keeping,
  and it came from studying the reference rather than from its code

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| The package's template directory | Create | The authored chart templates |
| The package's colour system files | Create | The named palettes and the token module |
| The package's scripts directory | Create | A validator written for this corpus |
| specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/004-native-chart-build/research/corpus-record.md | Create | What was built, what was deliberately left out, and why |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No byte of the reference implementation appears in the package. A scan for its distinctive strings and filenames returns nothing. |
| REQ-002 | Every authored template opens in a browser with no install step and resolves its colour tokens. |
| REQ-003 | The corpus validator runs clean, and a deliberately broken template makes it fail. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The corpus record names what was left out and why, so a later reader can tell a decision from an omission. |
| REQ-005 | Each family carries enough chart types to be useful on its own, rather than one token example per family. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A scan for the reference implementation's distinctive strings and filenames returns nothing inside the package.
- **SC-002**: The corpus validator exits 0, and breaking one template on purpose makes it exit non-zero.
- **SC-003**: A representative template from each family opens and renders with its colour tokens resolved.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 2's capability analysis | Without a written description, the only available reference is the source tree itself, which is what ADR-002 forbids | Do not start until the analysis describes each family well enough to build from |
| Risk | Native authoring degrades into transcription | High. It reopens the licensing question for the whole package, and it is invisible in a diff | Work from the written analysis, keep the reference tree closed, and scan for its strings before closing the phase |
| Risk | A template renders but renders wrong | High. Nothing fails, and the loss is only visible to someone looking at a chart | Ship the validator, and prove it can fail before trusting it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A template opens in a browser without an install step. This is the one property worth carrying over from the reference, and it is an idea rather than an implementation.

### Security
- **NFR-S01**: No third-party code is introduced. The licensing exposure this phase exists to avoid is created by copying, not by running.

### Reliability
- **NFR-R01**: The validator is only worth having once it has been shown to fail. Break a template on purpose before trusting a green run.

---

## 8. EDGE CASES

### Data Boundaries
- A chart type with no meaningful data shape still needs a decision about whether it belongs, rather than being written because the family had a gap.
- A palette referenced by name rather than by path still breaks when the token module changes. Names hide the dependency.

### Error Scenarios
- The validator fails on an authored template: fix the template, never the validator.
- A chart type turns out to need a build step: leave it out and record it, because losing the no-install property costs more than the chart is worth.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 25/25 | The whole corpus is authored. This is the largest phase in the packet by a wide margin. |
| Risk | 18/25 | Auth: N, API: N, Breaking: N. The risk is licensing exposure through transcription, not breakage. |
| Research | 12/20 | Chart design decisions the reference made are described, not available to read. |
| Multi-Agent | 12/15 | Workstreams: the colour system gates the families, then the families are independent. |
| Coordination | 10/15 | Dependencies: reads three earlier phases, feeds two later ones. |
| **Total** | **77/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A template renders with the wrong colours and nothing reports it | H | M | A validator proven able to fail, plus one opened template per family |
| R-002 | Reference content is transcribed rather than rebuilt | H | M | Build from the written analysis with the reference closed, then scan for its strings |
| R-003 | The corpus is sized to match the reference's count rather than to be useful | M | M | The corpus record states what was left out and why |

---

## 11. USER STORIES

### US-001: Charts worth having (Priority: P0)

**As a** user of this skill, **I want** templates that render correctly and open with no install step, **so that** the repository gained the capability it lacked.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Proof rather than inspection (Priority: P1)

**As a** reviewer, **I want** a validator that has been shown to fail, **so that** I can believe a green run without reading every template.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- How many chart types does the first corpus carry? The reference ships 49 in its primary tier by its own count, which is a reference point rather than a target.
- Does a chart template carry its own data, or read a shape the caller supplies? The reference answered this and the answer is a design idea, so it is available to us.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
