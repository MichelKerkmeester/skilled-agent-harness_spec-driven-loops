---
title: "Feature Specification: Remove em-dashes from authored READMEs, per the Human Voice Rules"
description: "The Human Voice Rules carry an explicit Em Dash Ban: never use one, prefer a comma, full stop or colon. 149 authored READMEs carried 909 of them. The rule has been written down and unenforced, so every README reads with the punctuation the rules name"
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Remove em-dashes from authored READMEs, per the Human Voice Rules

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

909 em-dashes across 149 authored READMEs, replaced by the comma, colon or full stop each sentence
actually wants rather than one blanket substitution. Vendored context and historical spec records keep
theirs, because rewriting a copy of someone else's project or a record of what was written then is not
a voice fix. Table cells holding a lone dash keep it: that is a not-applicable glyph, not
punctuation.

**Key Decisions**: replace by sentence shape rather than one blanket substitution; leave vendored, historical and glyph uses alone

**Critical Dependencies**: the Human Voice Rules, which name the ban and the three replacements

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | `009-router-conformance` |
| **Successor** | None |
| **Handoff Criteria** | Nothing follows; the authored READMEs satisfy the punctuation rule the repository documents |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the router conformance and readme voice specification.

**Scope Boundary**: Authored READMEs under `.opencode/` plus the repository root README. Vendored content under
`specs/**/context/` and `specs/**/research/`, and historical spec records, are out.

**Dependencies**:
- The Human Voice Rules, which supply the ban and the permitted replacements
- `hvr_scan.py`, which counts em-dash findings before and after

**Deliverables**:
- Zero prose em-dashes across the authored README set
- Lone-dash table cells and code blocks preserved
- A before-and-after scanner reading on the heaviest files

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Human Voice Rules carry an explicit Em Dash Ban: never use one, prefer a comma, full stop or
colon. 149 authored READMEs carried 909 of them. The rule has been written down and unenforced, so
every README reads with the punctuation the rules name as the clearest tell of machine-written
prose.

### Purpose
Authored READMEs follow the punctuation rule the repository already documents.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Authored READMEs under `.opencode/` and the root README
- Prose em-dashes, spaced and unspaced, including inside table cells that carry prose

### Out of Scope
- 377 em-dashes in vendored context directories - copies of external projects
- 153 in historical spec records - they describe what was written then
- 88 lone-dash table cells meaning not-applicable - a glyph, not punctuation
- 13 inside fenced code blocks - not prose
- 835 semicolons the scanner also flags as hard blockers - a different HVR rule, not this request

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/**/README.md`, `README.md` | Modify | 689 lines across 147 files |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No prose em-dash remains in an authored README. |
| REQ-002 | Each replacement is the punctuation the sentence wants: a colon after a label or before an independent clause, a comma for a short appositive, a full stop where the continuation was already sentence-shaped. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | No line without an em-dash is edited, so the sweep cannot drift into unrelated prose. |
| REQ-004 | Lone-dash table cells, code blocks, ascii art, vendored content and historical records are untouched. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Prose em-dashes in the authored set: 0, from 909.
- **SC-002**: `hvr_scan.py` reports no `punctuation —` finding on the swept files.
- **SC-003**: Zero comma splices introduced, audited line by line against `HEAD`.
- **SC-004**: Zero edits to lines that carried no em-dash.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `hvr_scan.py` | It is the independent check that the ban is satisfied | Run it on the heaviest files before and after |
| Risk | A blanket comma substitution creates comma splices | High | Replace by sentence shape; audit every changed line against `HEAD` |
| Risk | The sweep edits prose it was never scoped to | High | Only lines containing an em-dash may change, verified line by line |
| Risk | A not-applicable glyph is read as punctuation | Medium | A table cell whose whole content is a dash is left alone |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime target; this is prose.

### Security
- **NFR-S01**: No credential, dependency or network call is added.

### Reliability
- **NFR-R01**: Every change is reversible per line, because no line without an em-dash was touched.

---

## 8. EDGE CASES

### Data Boundaries
- A dash that is the entire table cell: left, because it means not-applicable.
- A dash inside ascii art or a code fence: left, because it is not prose.

### Error Scenarios
- A sentence wrapped across two lines with the dash at the end: a line-based pass cannot see it, so those were found by scan and fixed by hand.
- A replacement that reads worse than the dash: caught by reading the diff, not by a gate.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: 147 READMEs, 689 lines |
| Risk | 10/25 | Auth: N, API: N, Breaking: N; prose only, but easy to damage silently |
| Research | 6/20 | Classifying the usages before touching any |
| Multi-Agent | 2/15 | Single workstream |
| Coordination | 3/15 | Independent of every other phase |
| **Total** | **[/100]** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Comma splices from a blanket substitution | H | H | Replace by sentence shape; audit against `HEAD` |
| R-002 | Editing prose outside the scope | H | H | Only em-dash-carrying lines may change |
| R-003 | Losing a not-applicable glyph | M | M | Whole-cell dashes preserved |

---

## 11. USER STORIES

### US-001: A README reads as written by a person rather than generated (Priority: P0)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A vendored README still matches the project it was copied from (Priority: P1)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Whether the same sweep should run on the 835 semicolons the scanner flags in the same files. The
  rules ban them too; this request named em-dashes only.
- Whether historical spec records should ever be voice-corrected. This phase says no, on the same
  reasoning that keeps benchmark reports as written.
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
