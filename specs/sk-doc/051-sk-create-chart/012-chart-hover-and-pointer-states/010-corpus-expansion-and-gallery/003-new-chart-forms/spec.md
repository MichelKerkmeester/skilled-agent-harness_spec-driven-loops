---
title: "Feature Specification: Research and add the chart forms the catalogue is missing"
description: "The catalogue has twenty-one forms and five obvious gaps. This child adds bullet, funnel, dumbbell, histogram and population-pyramid, each adapted from the existing form closest to it in structure, and records why gauge, radar, pareto, lollipop and sankey were considered and left out."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Research and add the chart forms the catalogue is missing

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

[2-3 sentence high-level overview for stakeholders who need quick context]

**Key Decisions**: [Major decision 1], [Major decision 2]

**Critical Dependencies**: [Blocking dependency]

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `010-corpus-expansion-and-gallery` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Twenty-one forms cover the common cases and leave gaps a reader hits quickly: there is no way to
show a measure against a target with qualitative bands, no sequential drop-off, no before-and-after
per category, no binned distribution, and nothing that diverges from a centre axis.

The catalogue also has no stated admission rule, so "add more forms" has no end. This child sets
one: **a form joins only if it can honestly carry a data table holding everything its card
reveals.** That is not a style preference. It is the corpus's accessibility floor, enforced by
`card-readout`, and it is what stops the catalogue growing into shapes that look impressive and
hide their numbers.

### Purpose

Five genuine gaps closed, each form indistinguishable in construction from the twenty-one already
there, and a written reason for every candidate that did not make it.

### Non-Goals

- Variants of forms that already exist. A lollipop is a bar with a dot on it.
- Any form that cannot carry a table. See the exclusions below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### The five, and the form each is adapted from

| New form | Adapted from | The gap it closes |
|----------|--------------|-------------------|
| `bullet` | `progress-single` | A measure against its target with qualitative bands behind it. The existing progress form has neither a target nor bands |
| `funnel` | `bar-rows` | Sequential drop-off through stages of one flow, where `bar-rows` compares independent categories |
| `dumbbell` | `daily-range` | Two readings per category and the change between them, where `daily-range` is a range over time |
| `histogram` | `bar-columns` | A binned distribution. `distribution-strip` draws every observation, which is the opposite trade and cannot show shape at volume |
| `population-pyramid` | `bar-rows` | Two populations mirrored about a centre. No existing form diverges from an axis |

Adapting rather than authoring fresh is deliberate. Each file must satisfy twenty corpus rules, and
a form written from nothing fails several of them in ways that are tedious to find. Adapting keeps
the palette block, the geometry block, the card mechanism, the pointer resolver, the empty-data
guard and the accessibility wiring byte-for-byte, and changes only the data, the drawing loop, the
titles and the table.

### Considered and excluded, with reasons

| Candidate | Why not |
|-----------|---------|
| `gauge` | Duplicates `progress-single` and `unit-ring`. A dial is a bar bent into an arc |
| `radar` | Duplicates `parallel-axes`, which compares the same measures across the same entities and reads better |
| `pareto` | Duplicates `bar-line-composed`, which already carries bars against a line on a second scale |
| `lollipop` | A bar with a dot on the end. Not a form |
| `sankey` | The one real omission. It would carry a table cleanly as source, target and value, but drawing curved flows with no library is a large enough job to dominate this child. Deferred deliberately, not overlooked |

### In Scope
- Five new templates under `assets/templates/`, a contract row each, and a catalogue entry each.

### Out of Scope
- New deliveries under `assets/examples/`. A delivery is built from a template that already exists.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/` | Create | The five new forms |
| `.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md` | Modify | A pointer contract row per new form |
| `.opencode/skills/sk-doc/sk-create-chart/references/catalog.md` | Modify | A catalogue entry per new form |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | Every new form passes every corpus rule, including `card-readout`, `pointer-reach`, the palette rules, the type scale and the empty-data notice. |
| REQ-002 | Every value a new form's card reveals appears in its data table. A form that cannot satisfy this does not join the catalogue, and its exclusion is recorded. |
| REQ-003 | Every new form has a row in the per-form pointer contract and an entry in the catalogue, or `pointer-contract-coverage` fails. |
| REQ-004 | No new form carries an external runtime, framework, CDN reference or build step. |
| REQ-005 | A new form enters `assets/templates/` only after it passes. A half-built form in that directory fails the gate for all twenty-seven files. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `check-corpus.cjs --render` prints `RESULT: PASSED` with 26 templates rather than 21.
- **SC-002**: Each new form's card values all appear in its table, proven by `card-readout`.
- **SC-003**: Each new form answers a pointer everywhere within reach, proven by `pointer-reach`.
- **SC-004**: The contract table and the directory agree in both directions.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [System/API] | [What if blocked] | [Fallback plan] |
| Risk | [Risk description] | [High/Med/Low] | [Mitigation strategy] |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: [Response time target - e.g., <200ms p95]

### Security
- **NFR-S01**: [Auth requirement - e.g., JWT tokens required]

### Reliability
- **NFR-R01**: [Uptime target - e.g., 99.9%]

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: [How system handles]
- Maximum length: [Limit and behavior]

### Error Scenarios
- External service failure: [Fallback behavior]
- Network timeout: [Retry strategy]

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | [/25] | [Files: X, LOC: Y, Systems: Z] |
| Risk | [/25] | [Auth: Y/N, API: Y/N, Breaking: Y/N] |
| Research | [/20] | [Investigation needs] |
| Multi-Agent | [/15] | [Workstreams: X] |
| Coordination | [/15] | [Dependencies: X] |
| **Total** | **[/100]** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | [Risk] | [H/M/L] | [H/M/L] | [Strategy] |

---

## 11. USER STORIES

### US-001: [Title] (Priority: P0)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: [Title] (Priority: P1)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- [Question 1 requiring clarification]
- [Question 2 requiring clarification]
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
