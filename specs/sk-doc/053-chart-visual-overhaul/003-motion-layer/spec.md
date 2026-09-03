---
title: "Feature Specification: Add the reveal wipe and the bar growth, both gated and both deterministic"
description: "The corpus has no motion at all. This phase adds a one second first-paint reveal to the time-series forms and a half-second bar growth to the bar forms, both behind the reduce-motion preference, and proves that two renders of one file still agree once the motion has settled."
trigger_phrases:
  - "chart reveal wipe"
  - "chart bar growth"
  - "chart reduce motion"
  - "chart determinism proof"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Add the reveal wipe and the bar growth, both gated and both deterministic

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-03 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 of 7 |
| **Predecessor** | 002-chrome-rollout |
| **Successor** | 004-interaction-layer |
| **Handoff Criteria** | Motion ships behind the reduce-motion preference, and two renders of every animating file agree after it settles |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`grep -rn 'prefers-reduced-motion' assets/` over the corpus returns nothing, and so does a search
for `@keyframes`. Twenty forms paint instantly and stay still. Both research lineages read the
same vendored source and both came back with the same two motions: a one second left-to-right
wipe that reveals a time series, and a half-second growth that lifts bars off the baseline.

Motion in a corpus like this one is a risk rather than a decoration. Contract rule 12 says two
renders of one file have to agree, and it exists so a screenshot review compares a chart against
itself rather than against noise. Contract rule 13 says a file that animates carries a
`prefers-reduced-motion` fallback. Rule 13 has never fired on a real file, because no file in the
corpus has ever animated. This phase is its first consumer.

There is a gap worth naming before any code is written. The corpus check reads the motion rule
from the stylesheet regions alone, at `scripts/check-corpus.cjs`. A motion driven from script with
no CSS animation would pass rule 13 without carrying a fallback, silently.

### Purpose

The two motions both lineages recommended ship, they turn themselves off for a reader who asked
their system for no motion, and the file they animate still renders the same picture twice.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A first-paint reveal on the time-series forms: a one second left-to-right mask wipe on the
  eased curve the vendored source uses.
- A growth on the bar forms: half a second, cubic-out, lifting each bar from its own anchor with
  a small stagger between them.
- A reduce-motion fallback on every file that gains either motion.
- A determinism proof that renders each animating file twice and compares the settled result.
- Whatever the corpus check needs so that rule 13 cannot be passed by a motion it does not look at.

### Out of Scope

- Any motion that repeats. An endless animation makes two renders of one file disagree by
  construction, and both lineages rejected the animated dash for exactly that reason.
- Hover, tooltip, legend and dim. Those respond to a reader rather than to first paint, and they
  are phase 004.
- The loading skeleton the vendored source ships. A static file has no async phase, and the
  skeleton generator is random, which rule 12 bans outright.
- Motion on the palette proof sheets, which exist to show colour rather than to be delivered.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/daily-line.html` | Modify | Reveal wipe on the line form |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/daily-range.html` | Modify | Reveal wipe on the range form |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/stacked-area.html` | Modify | Reveal wipe on the band form |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-columns.html` | Modify | Bar growth, vertical |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-rows.html` | Modify | Bar growth, horizontal |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/grouped-bars.html` | Modify | Bar growth across two series |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/stacked-bars.html` | Modify | Bar growth on a stack |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/waterfall.html` | Modify | Bar growth from each step's own anchor |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/progress-single.html` | Modify | Bar growth on one bar against a goal |
| `.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs` | Modify | Close the script-driven motion gap, and add the two-render comparison |
| `.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md` | Modify | Rule 13 gains the settle-time requirement that makes rule 12 checkable |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The three time-series forms reveal on first paint over one second, left to right, on the eased curve the research named |
| REQ-002 | The six bar forms grow their marks over half a second on a cubic-out curve, with a stagger between consecutive marks |
| REQ-003 | Every file that animates carries a `prefers-reduced-motion` fallback that removes the motion rather than shortening it |
| REQ-004 | Every animation settles to a fixed final state, and two renders of the same file produce the same settled result |
| REQ-005 | No animation repeats, and no rendering code reads the clock or a random source |
| REQ-006 | `node scripts/check-corpus.cjs --render` prints `RESULT: PASSED` from the final state |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | The corpus check cannot be satisfied by a motion it does not inspect, so rule 13 covers script-driven motion as well as stylesheet motion |
| REQ-008 | The contract states the settle-time requirement, because rule 12 is only checkable once a settle time is named |
| REQ-009 | Everything authored in this phase reports zero hard blockers under `hvr_scan.py` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.

### The rows this phase carries

Every path in the middle column resolves under
`specs/sk-doc/051-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/`. Every
path in the right column resolves under `.opencode/skills/sk-doc/sk-create-chart/`.

| Row | Change | Vendored evidence | Corpus target |
|-----|--------|-------------------|---------------|
| A6 | First-paint reveal, a one second left-to-right mask wipe, gated on the reduce-motion preference | `src/registry/charts/recharts-line-chart.tsx:59-76`, where the reveal runs for one second on the curve `[0, 0.7, 0.5, 1]` and falls back to none under the operating system preference | `assets/templates/daily-line.html`, `assets/templates/daily-range.html`, `assets/templates/stacked-area.html` |
| Bar growth | Marks rise from their anchor over half a second on a cubic-out curve, staggered | `src/registry/charts/recharts-bar-chart.tsx:49-50`, where the grow runs half a second with a 0.05 second stagger, and `src/registry/charts/echarts-bar-chart.tsx:101` and `:1325-1326`, where the same values appear in milliseconds with the easing named | `assets/templates/bar-columns.html`, `bar-rows.html`, `grouped-bars.html`, `stacked-bars.html`, `waterfall.html`, `progress-single.html` |
| Determinism proof | Two renders of one file agree once the motion has settled | Contract rule 12 at `references/template-contract.md`, and the existing render path in `scripts/check-corpus.cjs` which already advances virtual time before dumping the document | `scripts/check-corpus.cjs` |

The reveal is a mask wipe rather than a path-length trick, because a mask reveals the marks and
the labels together. A stroke-dasharray reveal draws the line and leaves every dot and every tick
sitting there from the first frame, which reads as a glitch rather than as an entrance.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -rlc 'prefers-reduced-motion' .opencode/skills/sk-doc/sk-create-chart/assets/templates/` lists exactly the nine files that animate, and no others.
- **SC-002**: Two `--dump-dom` renders of each animating file, taken after the virtual time budget has passed, are identical.
- **SC-003**: `node scripts/check-corpus.cjs --render` prints `RESULT: PASSED`, with the `motion` check reporting a nonzero count and zero failures.
- **SC-004**: The motion check fails on a file given an animation with the fallback removed, before that file is restored.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 closed | The chrome and the motion touch the same stylesheets, so an unfinished rollout produces a conflicted file | The phase does not start until the corpus check is green over twenty-nine files |
| Dependency | Headless Chrome for `--render` and for the two-render comparison | The determinism proof is the deliverable and it cannot run | The corpus check already resolves a browser and names `CHROME_PATH` |
| Risk | A script-driven motion bypasses rule 13 | Motion ships to a reader who asked for none, and the check says nothing | Motion is authored in CSS, and the check is extended so the script regions are inspected too |
| Risk | The settled state depends on when the render was taken | Two renders disagree and rule 12 is broken by the phase meant to protect it | Every animation ends at a fixed state, and the settle time is named in the contract so the render budget can exceed it |
| Risk | A waterfall step has no baseline to grow from | The growth reads as marks sliding rather than rising | Each step grows from its own anchor, which is what a waterfall step is measured against anyway |
| Risk | Scaling a mark also scales its stroke | A separator stroke thickens during the growth and settles wrong | The route is chosen against a rendered comparison rather than by preference |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Every touched file stays one document that opens with no build step and no network.
- **NFR-P02**: Motion runs once at first paint and never again, so a file left open costs nothing.

### Reliability
- **NFR-R01**: Two renders of one file agree, which is contract rule 12 and the property this phase is most able to break.
- **NFR-R02**: The motion check is proven able to fail before the phase claims rule 13 is enforced.

### Accessibility
- **NFR-A01**: A reader whose system asks for reduced motion sees the settled picture immediately, with no shortened animation and no fade.
- **NFR-A02**: Nothing about the chart's meaning is carried by the motion, so removing it removes nothing a reader needs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A waterfall step that falls rather than rises: it grows downward from its own anchor, and the growth direction follows the sign.
- A bar whose value is zero: it has no height to grow into, so it stays at zero rather than animating to nothing.
- A stacked bar: the whole stack grows as one, because animating each segment separately would show the segments arriving in an order the data does not have.

### Error Scenarios
- The render budget is shorter than the settle time: the dump catches a mid-animation frame and the two renders disagree. The settle time named in the contract is what makes this diagnosable rather than mysterious.
- A browser that does not animate an SVG geometry property: the marks jump to their final state, which is the same picture the reduce-motion path shows.

### State Transitions
- Reduce motion switched on while a file is open: the file was already painted, so the reader sees the settled picture either way.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Files: 9 templates plus the checker and the contract, Systems: 1 |
| Risk | 11/25 | Auth: N, API: N, Breaking: N, but the phase can break contract rule 12 for the whole corpus |
| Research | 5/20 | The research is done. The open work is which animation route survives a render |
| **Total** | **30/70** | **Level 2** |

`recommend-level.sh --loc 350 --files 12 --architectural` returns Level 2 at 59 of 100, with a
phase score of 10 of 50. The architectural flag is claimed because the phase adds a gate to the
corpus check and amends a contract rule, rather than because it edits nine files.
<!-- /ANCHOR:complexity -->

---

## 7. OPEN QUESTIONS

All three are answered. The answers are kept here because each one shaped the implementation.

- **Which animation route survives a render on a bar.** The transform. A clip resolves against
  each element's own box, so clipping the segments of a stack detaches them and the column arrives
  in pieces. The transform scales the whole stack about the axis and the seams hold. Both routes
  were rendered as paused mid-animation frames and read side by side, in `scratch/route-test/`.
- **Whether the reveal covers the axis labels or only the marks.** The whole figure. A wipe that
  leaves the axis standing reads as a chart being drawn on top of a chart, and the drawing code
  appends straight to the `<svg>` rather than into a plot group, so clipping the marks alone would
  have meant restructuring every one of the three files.
- **What settle time the contract should name.** One second. It bounds both motions and stays a
  third of the render budget. It is only true if the stagger cannot grow without limit, so the
  delay is capped at half a second rather than accumulated, which keeps the ceiling honest for a
  file whose data block a reader has doubled.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Closure Gate**: See `acceptance-criteria.md`
- **Durable Directive**: See `goal.md`
