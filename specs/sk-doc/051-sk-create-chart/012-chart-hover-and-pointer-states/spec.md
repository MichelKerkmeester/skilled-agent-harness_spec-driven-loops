---
title: "Feature Specification: Give every chart form a hover and pointer state, with the logic and templates to carry it"
description: "Seven of the twenty-one chart forms carry a real hover tooltip, seven carry a legend or dim but no tooltip, and seven answer a pointer with nothing at all. This phase decides per form what a pointer should reveal, builds the shared logic and template surface to carry it, and makes the corpus checker enforce the result instead of leaving it hand-applied."
trigger_phrases:
  - "chart hover state"
  - "chart pointer interaction"
  - "chart tooltip corpus"
  - "sk-create-chart interaction layer"
  - "hover template enforcement"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Give every chart form a hover and pointer state

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-05 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | sk-doc/051-sk-create-chart |
| **Predecessor** | `009-chart-visual-overhaul/004-interaction-layer` |
| **Origin** | Operator: "add logic, templates, etc so that charts also get hover states etc" |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The corpus answers a pointer inconsistently, and the inconsistency is not a design decision. It is where the previous phase stopped.

`009-chart-visual-overhaul/004-interaction-layer` is Complete and deliberately scoped itself to "the forms that can carry it rather than all twenty": a hover tooltip on seven mark-dense forms, an in-figure legend on four multi-series forms, and a series dim on five. That was the right call for that phase. It left the corpus in three tiers, measured by counting pointer markers (`tooltip`, `mouseenter`, `mousemove`, `pointerenter`, `pointermove`, `:hover`) across `assets/templates/`:

| Tier | Count | Forms |
|------|-------|-------|
| Real hover implementation, 5-6 markers | 7 | `distribution-strip`, `box-plot`, `calendar-grid`, `candlestick`, `heat-matrix`, `scatter`, `treemap` |
| Partial, 1-2 markers, a legend or dim but no tooltip | 7 | `parallel-axes`, `stacked-bars`, `stacked-area`, `grouped-bars`, `bar-line-composed`, `daily-line`, `waterfall` |
| No pointer response at all, 0 markers | 7 | `bar-columns`, `bar-rows`, `daily-range`, `independent-percentages`, `progress-single`, `unit-grid`, `unit-ring` |

**The commonly repeated figure, "thirteen forms have no hover", is wrong** and this packet should not carry it forward. It comes from subtracting the seven tooltip forms from twenty and conflates "no tooltip" with "no pointer response". Seven forms have a legend or a dim and no tooltip; a different seven have nothing. The distinction matters because the two groups need different work.

Two further gaps the predecessor recorded in its own Known Limitations: touch is unresolved, a tap gets whatever the browser chooses, and the behaviours were applied per form rather than carried by a shared surface, so nothing prevents the next form from shipping inert.

### Purpose

Every form has a deliberate pointer contract, including the forms whose contract is "correctly inert". The behaviour is carried by shared logic and the templates rather than hand-applied per form, and the corpus checker fails a form that violates its contract.

### Non-Goals

- Re-deriving what the predecessor shipped. The seven working tooltips stay unless the research shows a defect in them.
- Turning a static file into an application. See the constraint below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### The constraint that shapes every decision

These are self-contained static files. A chart must not stop being static on first paint, must carry no external runtime, no framework, no CDN and no build step, and must degrade to a readable figure with scripting unavailable. A technique that cannot survive that is out, and naming it as non-transferable is a useful result rather than a failure.

### In Scope
- A per-form pointer contract for all 21 templates, including an explicit "inert, and here is why" for forms where the static figure already carries every value.
- Shared hover and pointer logic, so behaviour is defined once rather than per form.
- Template changes in `assets/templates/` and regenerated examples in `assets/examples/`.
- Keyboard and screen-reader equivalence for anything a pointer reveals.
- A touch decision, which the predecessor left open.
- Corpus-checker enforcement so a form cannot silently ship without its contract.
- The contract text in `references/`.

### Out of Scope
- The colour system, typography and layout. This phase touches interaction only.
- The chart command surface, which `011-chart-command-surface` owns.
- Any chart form not already in the corpus.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/*.html` | Modify | Per-form pointer contract, applied through the shared surface |
| `.opencode/skills/sk-doc/sk-create-chart/assets/examples/*` | Regenerate | Rendered corpus reflects the template changes |
| `.opencode/skills/sk-doc/sk-create-chart/references/` | Modify | The pointer contract, per form and in general |
| `.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs` | Modify | Enforce the contract rather than leaving it hand-applied |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every one of the 21 templates has a recorded pointer contract, and a contract of "inert" names the reason the static figure already suffices. |
| REQ-002 | Anything a pointer reveals is reachable without a pointer. A hover-only affordance that hides data from keyboard and screen-reader users does not ship. **MET across all 21 templates and all 6 deliveries.** It was briefly false of two files: `distribution-strip` revealed each individual observation on hover while its table carried only `Records`, `Lowest`, `Median` and `Highest` per cohort, and its delivery `pick-times-by-depot` inherited the same gap. Phase `009-close-the-deferrals` repaired both, gave `stacked-area` the totals foot its card reads out, and turned the property into a corpus rule (`card-readout`) that opens each card under a pointer and compares what it shows against the table. The rule was watched failing before it was trusted. |
| REQ-003 | Every form still renders as a readable static figure with scripting unavailable, and still paints correctly on first paint. |
| REQ-004 | Pointer behaviour is carried by a shared surface. A new form inherits the contract rather than reimplementing it. |
| REQ-005 | `check-corpus.cjs` fails a form whose rendered output does not match its declared pointer contract. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The seven partial forms either gain the missing tooltip or record why a legend or dim is the right terminal state for them. |
| REQ-007 | Touch has a stated decision, even if the decision is that a single static file cannot normalise it and the tap fallback is accepted. |
| REQ-008 | No file gains an external runtime, a framework, a CDN reference or a build step. |

> Acceptance criteria live in `acceptance-criteria.md`, which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader can get every value the chart encodes, by pointer or by keyboard, on every form whose contract promises it.
- **SC-002**: `check-corpus.cjs --render` prints `RESULT: PASSED` from the final state.
- **SC-003**: Adding a new form to the corpus without a pointer contract fails the checker, proven by a deliberate mutation rather than asserted.
- **SC-004**: Every form still opens and reads correctly as a single file with no network and no scripting.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Hover added where it adds nothing | Medium: noise on a figure that was already complete | The inert tier is a first-class outcome, and REQ-001 makes "inert" require a stated reason rather than an omission |
| Risk | A shared surface inflates every file | Medium: these are self-contained, so shared code is duplicated into each output | Measure the per-file size delta and treat a large one as a design signal, not a cost of doing business |
| Risk | Accessibility regression | High: a hover-only affordance removes data from non-pointer users | REQ-002 is a blocker, not a nice-to-have |
| Dependency | The research run in `research/` | Its per-form findings drive the plan | Three forced-depth iterations, GLM-5.3-Flash at `max` through cli-pi on the DevPass route |
| Dependency | `009-chart-visual-overhaul/004-interaction-layer` | Its seven tooltips are the reference implementation | Complete; its patterns are the starting point rather than something to redesign |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: First paint stays static. No pointer logic runs before the figure is readable.
- **NFR-P02**: The per-file size increase from the shared surface is measured and reported, not assumed negligible.

### Security
- **NFR-S01**: No external fetch, no CDN, no remote font or script. The file stays self-contained.

### Reliability
- **NFR-R01**: With scripting unavailable, every form degrades to the same readable figure it renders today.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A single-datum chart, where a tooltip may duplicate a label already printed beside the mark.
- A dense form where marks overlap within a pointer's width, so nearest-mark resolution has to choose.
- A form whose values are already printed beside every mark, which is the strongest case for the inert tier.

### Error Scenarios
- Scripting unavailable: the figure must still read.
- A pointer that never arrives, which is the touch and keyboard case.

### State Transitions
- Pointer leaves the figure while a tooltip is open.
- Focus moves by keyboard while a pointer tooltip is already showing.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 21 templates, the examples they render, the contract and the checker |
| Risk | 9/25 | Presentation-layer only, no runtime and no shared contract outside this skill |
| Research | 12/20 | Per-form decisions are genuinely unknown until the research lands |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Held for the research run rather than guessed:

- Which of the seven inert forms should stay inert?
- Do the seven partial forms want a tooltip, or is a legend their correct terminal state?
- What is the keyboard equivalent that does not turn a static figure into a widget?
- Is there a touch answer a single static file can actually honour?
<!-- /ANCHOR:questions -->
