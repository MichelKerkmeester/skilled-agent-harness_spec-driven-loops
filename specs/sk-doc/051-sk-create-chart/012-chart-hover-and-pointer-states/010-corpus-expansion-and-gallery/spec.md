---
title: "Feature Specification: Enlarge every pointer target, restyle all forms with richer data, expand the catalogue with new chart types, and ship one light and dark gallery"
description: "Eighty-eight percent of the corpus pointer targets are below the 24px floor, two forms have marks with literally zero height, and the catalogue has not grown since it was written. This phase enlarges every target, restyles all forms with richer data, expands the catalogue with new chart types, and ships one gallery carrying every form in both colour schemes."
trigger_phrases:
  - "chart hit target size"
  - "chart corpus expansion"
  - "chart restyle"
  - "light dark chart gallery"
  - "new chart forms"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Enlarge every pointer target, restyle all forms with richer data, expand the catalogue with new chart types, and ship one light and dark gallery

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
| **Status** | Complete |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | sk-doc/051-sk-create-chart/012-chart-hover-and-pointer-states |
| **Predecessor** | `009-close-the-deferrals` |
| **Origin** | Operator: "The hover click area is sometimes way too small... we should expand and re-do all templates and examples... an example of every chart type in both light and dark mode" |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

**The pointer targets are far smaller than the operator's "sometimes way too small" suggests.**
Measured by rendering every form in headless Chrome and reading `getBoundingClientRect()` on each
`[data-mark]` element, **614 of 695 marks are below the 24 x 24 CSS px floor, which is 88% of the
corpus**. The full table is in `scratch/hit-target-baseline.md`. `daily-line` marks are 4.9px
square. `distribution-strip` marks are 5.8px, and there are 144 of them overlapping in three
bands. `calendar-grid` has 364 marks at 11.1px.

Two forms are worse than small. `grouped-bars` and `stacked-bars` marks report a bounding box of
**zero height**: they are `<path>` marks drawn as a line rather than an area, so a hover only
lands when the pointer sits exactly on the stroke. `candlestick` marks are 3.5px tall, and a
candle body collapses toward a line precisely when open and close are near-equal, which is the
day a reader most wants to inspect.

The cause is one line of shared idiom rather than twenty separate mistakes: `markable()` sets
`data-mark` on the visible geometry itself, so the hit target is the drawn mark and can never be
larger than it. No form in the corpus adds an enlarged invisible target.

**The catalogue has not grown, and the forms carry demo data.** Twenty-one forms cover the common
cases and leave obvious gaps. The example data is placeholder-grade, which makes the corpus read
as a specimen sheet rather than as work someone would copy.

**There is no way to see a form in both colour schemes at once.** Every file carries a dark
palette block behind `prefers-color-scheme`, and the checker proves the block reaches the paint,
but a reviewer comparing the two has to change their system setting and reload.

### Purpose

A pointer lands on what a reader aims at, on every form. The corpus reads as finished work rather
than a specimen sheet. The catalogue covers the shapes people actually need. One page shows every
form in both schemes.

### Non-Goals

- Changing any form's pointer contract. What a card reveals was decided and enforced in the
  phases before this one; this phase changes how easily it can be reached, not what it says.
- Re-deriving the readout rule. `card-readout` already enforces that a card cannot outrun its
  table, and every new form inherits that obligation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### The constraint that still shapes every decision

Self-contained static files. No external runtime, no framework, no CDN, no build step, readable
with scripting unavailable. A new chart form that cannot be drawn under that constraint does not
join the catalogue, and saying so is a result rather than a failure.

### In Scope
- An enlarged pointer target on every form that carries marks, meeting a stated minimum.
- A corpus rule enforcing that minimum, watched failing before it is trusted.
- A restyle of all existing forms, and richer, more realistic data behind them.
- New chart forms added to the catalogue, each with a contract row, a register, and a table.
- One gallery page rendering every form in both colour schemes.
- Regenerated deliveries under `assets/examples/`.

### Out of Scope
- The pointer contracts themselves, decided in phases 001 through 009 of this packet.
- The colour palette source. A restyle uses the existing custom properties; it does not redefine them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/*.html` | Modify | Enlarged targets, restyle, richer data |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/` | Create | The new chart forms |
| `.opencode/skills/sk-doc/sk-create-chart/assets/examples/*.html` | Regenerate | Parity with restyled parents |
| `.opencode/skills/sk-doc/sk-create-chart/assets/` | Create | The light and dark gallery page |
| `.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs` | Modify | The target-size rule |
| `.opencode/skills/sk-doc/sk-create-chart/references/` | Modify | Contract rows for new forms, the target-size rule, the catalogue |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every mark on every form presents a pointer target of at least 24 x 24 CSS px, measured on the rendered page. Where marks are closer together than that, the target is the form's resolved region rather than an overlap that steals a neighbour's hover. |
| REQ-002 | No mark reports a zero-height or zero-width bounding box. |
| REQ-003 | `check-corpus.cjs` fails a form whose rendered targets fall below the floor, and the rule is watched failing before it is trusted. |
| REQ-004 | Enlarging a target changes nothing a reader sees: the drawn figure is pixel-identical to its pre-phase render except where the restyle deliberately changes it. |
| REQ-005 | Every new form carries a pointer contract row, a data table holding everything its card can reveal, and passes every existing corpus rule including `card-readout`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | One gallery page renders every form in both colour schemes, and it is generated from the corpus rather than hand-maintained. |
| REQ-007 | Example data is realistic enough to read as real work, and every number remains internally consistent with its table. |
| REQ-008 | No file gains an external runtime, framework, CDN reference or build step, and every form still reads with scripting unavailable. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A re-run of the baseline probe reports zero marks below 24 x 24 CSS px across the corpus, against 614 today.
- **SC-002**: `check-corpus.cjs --render` prints `RESULT: PASSED` from the final state.
- **SC-003**: The target-size rule is watched failing on a deliberate mutation, then restored.
- **SC-004**: The gallery opens as one self-contained file and shows every form twice, once per scheme.
- **SC-005**: Every new form appears in the catalogue, the contract table, and the gallery.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An enlarged target steals its neighbour's hover | High: on `distribution-strip` the marks are 5.8px and overlap already | Prefer one resolved region per form (nearest-mark on a delegated listener) over per-mark padding wherever marks are denser than the floor |
| Risk | The restyle changes numbers, not just appearance | High: a chart that looks better and reads differently is a regression | Data changes and style changes land in separate children, each with its own gate |
| Risk | A new form cannot meet the readout rule | Medium: some shapes have no natural tabular form | The catalogue is closed against the constraint: a form that cannot carry a table does not join |
| Risk | The gallery goes stale | Medium: a hand-maintained gallery drifts the first time a form changes | Generate it from the corpus, and let the checker treat a missing form as an error |
| Dependency | Phases 001-009 of this packet | The contracts, the register, and `card-readout` are the floor this builds on | Complete |
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
