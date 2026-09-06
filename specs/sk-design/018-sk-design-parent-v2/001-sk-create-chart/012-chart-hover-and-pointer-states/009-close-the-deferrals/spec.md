---
title: "Feature Specification: Close every deferral the packet left: repair the pointer-only readings, enforce the readout rule, and require a contract row per form"
description: "The packet closed with four things written down and not done: a hover on distribution-strip that reveals readings its table never carries, a corpus checker that compares declarations to declarations and never a card to a table, a form able to ship with no row in the pointer contract, and a no-script variant recorded as future work. This phase repairs the first, enforces the second and third, and closes the fourth as decided against rather than pending."
trigger_phrases:
  - "chart card readout rule"
  - "pointer contract coverage"
  - "distribution strip table"
  - "close chart deferrals"
  - "card versus table enforcement"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Close every deferral the packet left: repair the pointer-only readings, enforce the readout rule, and require a contract row per form

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states |
| **Predecessor** | `008-closure-and-proof` |
| **Origin** | Operator: "Repair, leave nothing deferred" |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The packet closed honestly and left four things written down rather than done. Three of them
are real work and one is a decision nobody had made.

**A hover that hides its own data.** `distribution-strip` draws one dot per record and its card
opens any single dot. Its table carried five summary cells per cohort, so an observation was
reachable with a pointer and by no other route. Its delivery `pick-times-by-depot` inherited the
same shape. The rule the corpus otherwise keeps is that the table carries whatever the card can
reveal: `scatter` lists every point, `heat-matrix` every cell, `box-plot` the quartiles its card
shows. These two were the exception, and the hover shipped one packet earlier, so it was never
this packet's to notice until the readout was measured.

**A checker that cannot see a card.** `check-corpus.cjs` compares declarations against
declarations. It proves a form declares a register and that the register is internally
consistent, and it never opens a card to see what the card says. That is precisely why the
`distribution-strip` gap survived a green corpus: no rule could express it.

**Silence passing for a decision.** A form with no row in the pointer contract table drew no
error. Absence read as approval, so the table could describe a corpus the directory had already
moved past.

**A no-script variant recorded as future work.** The corpus draws every mark in script and always
has. A pre-drawn static variant is either a build step or 21 hand-maintained duplicates that
drift from their data blocks, and the packet forbids the first outright.

### Purpose

Nothing in the packet is left pending. Every value a pointer reveals is reachable without one,
that property is a corpus rule rather than an observation someone happened to make, a form
cannot ship without stating what a pointer does on it, and the one item that will not be built
is closed with its reason instead of carried forward.

### Non-Goals

- Redesigning any card's content. A card that already agrees with its table is not touched.
- Adding a pointer to a form whose contract is `inert` or `terminal`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every reading a card can reveal is carried by that form's data table.
- A corpus rule that opens each card and compares what it shows against the table.
- A corpus rule that requires a per-form row in the pointer contract for every form on disk.
- Both rules watched failing on a deliberate mutation before either is trusted.
- The no-script question closed as a decision, with its reason.

### Out of Scope
- The colour system, typography and layout - this phase touches readout and enforcement only.
- Any form whose card already agrees with its table - measured, not assumed.
- A pre-drawn static-SVG variant - closed as decided against, see the requirements below.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/distribution-strip.html` | Modify | Table carries every record, not the five-number summary alone |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/stacked-area.html` | Modify | Table foot carries the whole-period series totals the card reads out |
| `.opencode/skills/sk-doc/sk-create-chart/assets/examples/pick-times-by-depot.html` | Modify | Same repair as its parent template |
| `.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs` | Modify | Two new rules: `card-readout` and `pointer-contract-coverage` , plus a bounded single retry on a browser spawn that dies before writing |
| `.opencode/skills/sk-doc/sk-create-chart/scripts/README.md` | Modify | Both rules documented, both mutation recipes written |
| `.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md` | Modify | The readout rule stated, the strip's row corrected |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every number a card can show appears in that form's data table, across all 21 templates and all 6 deliveries, measured rather than asserted. |
| REQ-002 | `check-corpus.cjs` fails a form whose card shows a value its table does not carry, and the rule is watched failing before it is trusted. |
| REQ-003 | `check-corpus.cjs` fails a form on disk with no row in the pointer contract table, and fails a row naming a form that does not exist. Watched failing in both directions. |
| REQ-004 | No file gains an external runtime, a framework, a CDN reference or a build step, and every form still renders with scripting unavailable. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The repaired tables stay readable at a narrow viewport and under both colour schemes. |
| REQ-006 | The no-script static variant is closed as a decision with a stated reason, not carried as future work. |
| REQ-007 | Nothing in the parent packet still reads as deferred: its open items are each either done here or closed with a reason. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `check-corpus.cjs --render` prints `RESULT: PASSED` from the final state with both new rules active.
- **SC-002**: The card-readout rule is watched printing `RESULT: FAILED` and naming the form, then restored.
- **SC-003**: The contract-coverage rule is watched failing in both directions, then restored.
- **SC-004**: A pointer walk over all 27 corpus files reports no card value missing from its table.
- **SC-005**: The parent packet carries no item described as deferred, future work, or open.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A table that lists every reading becomes unreadable | Medium: the strip carries 48 records per cohort | The card wrapper already pans horizontally, and the summary columns stay in front of the readings rather than being replaced by them |
| Risk | The card-readout rule is slow | Medium: it opens a browser per card-carrying file | It runs only under `--render`, alongside the three opens each file already takes |
| Risk | A synthetic pointer event proves less than a human hover | Medium: the rule dispatches `pointermove` rather than moving a mouse | The same walk was used to find the defect it now prevents, and it agrees with the hand walk on every form |
| Dependency | `008-closure-and-proof` | Its measurement is what found the defect | Complete; its decision record carries the finding |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. This phase exists to remove them.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: First paint stays static. The table grows; no pointer logic runs before the figure is readable.
- **NFR-P02**: The per-file size increase from the enlarged tables is measured and reported.

### Security
- **NFR-S01**: No external fetch, no CDN, no remote font or script.

### Reliability
- **NFR-R01**: With scripting unavailable, every form degrades to the readable figure it renders today.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A cell holding a list of readings against a cell holding one large number: a thousands separator is a comma with no space, a list separator is a comma with a space.
- A form that declares a card and whose card never opens under a synthetic pointer.
- A form declaring a card with no data table at all.

### Error Scenarios
- The readout driver failing to attach, which must read as a failure rather than a pass.
- The contract table missing entirely.

### State Transitions
- A form added to the corpus before its contract row exists.
- A contract row surviving a form that was deleted.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Three templates, one delivery, the checker, two reference documents |
| Risk | 8/25 | Presentation and enforcement only, no runtime and no shared contract outside this skill |
| Research | 4/20 | The defect and its measurement are already established |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
