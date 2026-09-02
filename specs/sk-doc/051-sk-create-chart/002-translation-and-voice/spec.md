---
title: "Feature Specification: Phase 2: translation-and-voice [template:level-3/spec.md]"
description: "The source's primary documentation is Chinese, with English kept as a secondary README. Translation is the step where the instruction to stay literal is either honoured or quietly lost, so it gets its own phase and its own log."
trigger_phrases:
  - "translate lieflat charts"
  - "chinese to english skill docs"
  - "literal translation log"
  - "human voice pass"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 2: translation-and-voice

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Every authored word becomes English, and the voice standard applies to the result. A translation log records each place where a literal rendering and a natural one pulled apart, because that is where meaning goes missing without anyone noticing.

**Key Decisions**: How literal is literal, and whether user-visible strings inside the templates count as authored text

**Critical Dependencies**: Phase 1's character census, which sizes this work

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
| **Phase** | 2 of 6 |
| **Predecessor** | 001-source-inventory-and-placement |
| **Successor** | 003-packet-scaffold |
| **Handoff Criteria** | No authored document carries Chinese text, the voice scanner is clean, and the translation log accounts for every divergence between literal and natural |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Bring the lieflat-charts skill into this repository as sk-create-chart specification.

**Scope Boundary**: Authored prose only. Template rendering logic is not edited here, even where it contains a string.

**Dependencies**:
- Phase 1's character census, which names the files and their sizes

**Deliverables**:
- English versions of every authored source document
- A translation log, one row per divergence
- A clean voice-scanner run over the translated set

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Roughly 15,000 Chinese characters sit across six authored documents, the largest being the source `SKILL.md` at 8,304. English exists, but as a secondary README rather than as the primary text, so it is a summary and not a translation.

The operator's instruction is to keep the source as literal as possible. That instruction is easy to agree with and hard to hold, because a literal rendering of instructional Chinese often reads badly in English, and the natural fix is to rewrite. A rewrite dressed as a translation is the failure mode here, and it leaves no trace unless something records it.

### Purpose

Every authored word is English, reads as though written here, and still says what the source said.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Translating the source `SKILL.md`, README, catalog, report catalog, examples README and colour README
- The voice standard applied to the translated result, not to the source
- A translation log recording every place where a literal rendering and a natural one diverged, with the choice made
- A decision on user-visible strings inside the chart templates, recorded either way

### Out of Scope

- Restructuring the source documents. Section order and emphasis are part of what is being adopted
- Improving the source's instructions. Something that reads wrong gets logged as a finding, not fixed inside a translation
- The templates' own logic. Only strings a reader sees are in question here

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/sk-doc/051-sk-create-chart/002-translation-and-voice/scratch/translated/` | Create | English primary text for every source document, mirroring the source tree. Phase 4 carries these to whichever home phase 1 chose, which is what lets this phase run beside phase 1 rather than behind it |
| specs/sk-doc/051-sk-create-chart/002-translation-and-voice/research/translation-log.md | Create | One row per divergence between literal and natural |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A character scan over the authored set reports zero Chinese characters. |
| REQ-002 | The voice scanner exits clean over the translated documents. |
| REQ-003 | Every divergence between a literal and a natural rendering has a row in the translation log, with the choice and the reason. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The source's own English README is used as a cross-check rather than as the translation, and disagreements between it and the Chinese are noted. |
| REQ-005 | User-visible strings inside templates are decided explicitly, translated or left, with the reason recorded once. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A character scan over authored files returns zero Chinese characters.
- **SC-002**: `hvr_scan.py` exits 0 over the translated set.
- **SC-003**: Every section present in a source document is present in its translation, so nothing was dropped for being awkward.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1's census | Without it the phase cannot size itself and may miss a file | Do not start until the census reconciles against a fresh scan |
| Risk | Translation drifting into rewrite | High. The thing being adopted is quietly replaced by an English approximation of it | Require the log, and require a section-for-section match |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable. Documents only.

### Security
- **NFR-S01**: Not applicable. No credential or runtime surface is touched.

### Reliability
- **NFR-R01**: The section-for-section match is the reliability check. A translation that lost a section is a failure even if it reads well.

---

## 8. EDGE CASES

### Data Boundaries
- A document with mixed Chinese and English gets translated as a whole rather than patched in the Chinese parts, so the register stays consistent.
- A term with no clean English equivalent keeps the source term and gains a one-line gloss.

### Error Scenarios
- The source says something that appears wrong: log it as a finding and translate it faithfully anyway.
- The source's English README contradicts the Chinese: the Chinese is the source of truth, and the disagreement is recorded.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: 6 authored documents, around 15,000 Chinese characters. |
| Risk | 10/25 | Auth: N, API: N, Breaking: N. The risk is silent meaning loss, not breakage. |
| Research | 8/20 | Translation, not investigation. |
| Multi-Agent | 6/15 | Workstreams: 1, though the documents are independent. |
| Coordination | 8/15 | Dependencies: phase 1 sizes it, phase 4 carries the result. |
| **Total** | **46/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A rewrite ships as a translation | H | H | The log, plus a section-for-section match against the source |
| R-002 | The voice standard flattens a distinctive instruction into house style | M | M | Voice applies to how it reads, never to what it claims |
| R-003 | A file is missed because the census undercounted | M | L | Re-scan for Chinese characters across the whole ported tree at phase end |

---

## 11. USER STORIES

### US-001: Faithful English (Priority: P0)

**As a** reader of the adopted skill, **I want** the English to say what the Chinese said, **so that** I can trust the instructions without checking the original.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A record of the hard calls (Priority: P1)

**As a** reviewer, **I want** to see where literal and natural pulled apart, **so that** I can check the judgment instead of taking it on trust.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Do user-visible strings inside the chart templates count as authored text? They are seen by a reader of the output, not of the skill.
- Where the source's English README already disagrees with its Chinese, is that a translation error upstream or a deliberate difference?
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
