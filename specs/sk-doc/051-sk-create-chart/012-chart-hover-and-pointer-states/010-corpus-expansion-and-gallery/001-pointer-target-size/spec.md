---
title: "Feature Specification: Give every mark a pointer target of at least 24 CSS pixels and enforce it"
description: "Six hundred and fourteen of the corpus 695 marks sit below the 24px pointer floor and two forms have marks with zero height. Eight forms can have their target grown in place; five are denser than the floor and need a delegated nearest-mark region instead. This phase does both and adds the rule that keeps them done."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Give every mark a pointer target of at least 24 CSS pixels and enforce it

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `010-corpus-expansion-and-gallery` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`markable()` sets `data-mark` on the visible geometry, so the pointer target is the drawn mark and
can never be bigger than it. Measured on the rendered page, **614 of 695 marks are under 24 x 24
CSS px**. `daily-line` is 4.9px square, `distribution-strip` 5.8px with 144 marks overlapping,
`calendar-grid` 11.1px across 364 cells, `candlestick` 3.5px tall. `grouped-bars` and
`stacked-bars` marks report **zero height**: they are line paths, so a hover lands only on the
stroke itself.

The full measurement, and the spacing that decides the fix, are in the parent's
`scratch/hit-target-baseline.md`.

### Purpose

Every mark answers a pointer aimed at it, without changing what the reader sees or what the card says.

### Non-Goals

- Changing any card's content or any pointer contract. This phase changes reachability only.
- Restyling. The figure must render pixel-identical apart from the target change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### The decision, already made from measurement

**One mechanism, not two.** The plan began with a split: grow the target in place where marks are
far apart, use a delegated region where they are close. Building it removed the need for the split.
A nearest-mark resolver hands every mark the whole region closer to it than to any other, which is
larger than a 24px stroke wherever marks are further apart than 24px and the largest possible target
wherever they are closer. It adds no node and does not depend on whether a browser hit-tests a
transparent stroke, which `pointer-events: visiblePainted` leaves genuinely uncertain.

Applied to the nine forms carrying marks under the floor: `scatter`, `calendar-grid`,
`distribution-strip`, `daily-line`, `candlestick`, `daily-range`, `bar-line-composed`,
`stacked-bars`, `box-plot`. The four already clearing it are untouched: `grouped-bars`,
`heat-matrix`, `stacked-area`, `treemap`.

Resolution is ordered, and the order carries the design: a direct DOM hit wins; otherwise the
smallest mark box containing the pointer; otherwise the nearest mark centre within a bounded reach,
so pointing away from the drawing still means nothing. The containing step exists because
nearest-centre alone is wrong for stacked rectangles, confirmed on `stacked-bars` where a point
inside one segment sits nearer another segment's centre.

### In Scope
- The thirteen forms that carry marks, and the deliveries built from them.
- A corpus rule enforcing the floor, watched failing before it is trusted.

### Out of Scope
- The eight forms with no marks: inert and terminal by decided contract.
- Any change to a card's content, a table, or a contract row.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/*.html` | Modify | The thirteen mark-carrying forms |
| `.opencode/skills/sk-doc/sk-create-chart/assets/examples/*.html` | Modify | The four deliveries that carry marks |
| `.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs` | Modify | The `pointer-target-size` rule |
| `.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md` | Modify | The floor, stated as a rule |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | Every pointer position within a form's drawing resolves to exactly one mark, and to the mark nearest the reader's aim. No dead zone inside the plot. |
| REQ-002 | The resolver reads geometry from `getBBox()`, not from the painted box, so a mark's region does not move while its entry animation runs. |
| REQ-003 | The drawn figure is pixel-identical to its pre-phase render. A transparent target that changes the picture is a defect. |
| REQ-004 | An enlarged target never opens a neighbour's card. Proven per form by pointing at a mark and reading back which mark the card names. |
| REQ-005 | `check-corpus.cjs` fails a form below the floor, watched failing before it is trusted. |
| REQ-006 | Keyboard, touch pin-and-dismiss, reduced motion and no-script behaviour are unchanged. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every pointer position within the drawing resolves to exactly one mark, and to the mark nearest the reader's aim. A resolver does not enlarge marks, so "zero marks under 24 x 24" is not the achievable claim and is not made.
- **SC-002**: Every form's screenshot is byte-identical to its pre-phase capture.
- **SC-003**: A hover aimed at each sampled mark opens that mark's card and not its neighbour's.
- **SC-004**: `check-corpus.cjs --render` prints `RESULT: PASSED`, and the new rule is watched failing.
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

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: [Response time target - e.g., <200ms p95]
- **NFR-P02**: [Throughput target - e.g., 100 req/sec]

### Security
- **NFR-S01**: [Auth requirement - e.g., JWT tokens required]
- **NFR-S02**: [Data protection - e.g., TLS + encrypted at rest]

### Reliability
- **NFR-R01**: [Uptime target - e.g., 99.9%]
- **NFR-R02**: [Error rate - e.g., <1%]
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: [How system handles]
- Maximum length: [Limit and behavior]
- Invalid format: [Validation response]

### Error Scenarios
- External service failure: [Fallback behavior]
- Network timeout: [Retry strategy]
- Concurrent access: [Conflict resolution]

### State Transitions
- Partial completion: [Recovery behavior]
- Session expiry: [User experience]
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | [/25] | [Files, LOC, systems] |
| Risk | [/25] | [Auth, API, breaking changes] |
| Research | [/20] | [Investigation needs] |
| **Total** | **[/70]** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- [Question 1 requiring clarification]
- [Question 2 requiring clarification]
<!-- /ANCHOR:questions -->

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
