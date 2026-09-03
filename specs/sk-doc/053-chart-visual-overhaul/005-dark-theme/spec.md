---
title: "Feature Specification: A dark theme for the chart corpus"
description: "A delivered chart is opened in a browser whose operating system has already picked a theme, and every file in this corpus ignores that. This phase adds a media-scoped palette twin with hues re-chosen for a dark ground, re-runs every contrast gate per theme, and amends the contract clause that allows exactly one palette block."
trigger_phrases:
  - "chart dark theme"
  - "prefers color scheme chart"
  - "dark palette twin"
  - "chart contrast gates per theme"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: A dark theme for the chart corpus

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Both research lineages recommended a dark theme, from different halves of the vendored source, and both landed on the same construction: a second block of custom properties behind the operating system preference, with the series hues re-chosen for the dark ground rather than lightened, and the rules drawn as ink at an alpha rather than as a solid grey. Neither lineage could ship it, because the template contract says exactly one palette block per file and a media-scoped twin makes two.

**Key Decisions**: the operator approved the amendment on 2026-09-03, so a file now carries one palette block per theme and two at most. The phase made five calls of its own, and all six are written up in `decision-record.md`.

**Critical Dependencies**: phase 002 owns the chrome the dark values have to answer, so the light palette must be settled before its twin is derived.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-03 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 5 of 7 |
| **Predecessor** | `004-interaction-layer` |
| **Successor** | `006-catalog-and-contract` |
| **Handoff Criteria** | Both themes pass every contrast gate, and the checker asserts the dark block the same way it asserts the light one |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the chart visual overhaul. Phases 1 through 4 settled the taste forks, rolled the chrome, added motion and added interaction. All four assume one ground colour. This phase is the first that asks what the corpus looks like on a dark one, and it is the first that has to change the contract to answer.

**Scope Boundary**: `assets/color/palettes.json`, all twenty-nine asset files under `assets/`, `scripts/check-corpus.cjs`, `references/color-system.md` and `references/template-contract.md`. Nothing outside `.opencode/skills/sk-doc/sk-create-chart/` and this phase folder is touched.

**Dependencies**:
- Phase 002, which settles the light chrome the dark twin has to answer.
- The corpus check, which computes every contrast gate from the palette file on every run.
- The operator, who owns the contract amendment named in section 12.

**Deliverables**:
- Dark fields in `palettes.json` for chrome and for every system's series and emphasis values.
- A media-scoped palette block in each of the twenty-nine asset files, matching the source in both directions.
- A dark section in the corpus check, asserting the same gates against the dark surface.
- An amended contract rule 4 and an amended colour-system derivation rule, each naming what changed and why.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Twenty chart forms, six family deliveries and three palette proof sheets all paint on a warm paper surface. A reader whose operating system is set to dark opens a delivered file and gets a bright rectangle. That is not a rendering bug and it is not going to be fixed by a browser, because the file declares one ground and refers to it everywhere.

The corpus cannot simply lighten its way out. The colour system already says a lighter value comes from mixing toward `surface` and a darker one from mixing toward `ink`, which is the right rule on one ground and the wrong one across two. Lightening a dark navy against a dark ground produces a washed value that fails the mark gate, and the vendored source does not lighten either. It re-hues, and the rotation is visible between its two blocks.

There is also a contract problem that is not cosmetic. Rule 4 says exactly one palette block, matched against the source in both directions, and the `palette-block` check enforces it. A media-scoped twin is a second block, so the rule has to change before the theme can exist, and the check has to learn the second region before the rule means anything again.

### Purpose

A delivered chart answers the theme the reader's system has already chosen, with a palette that was derived under a stated rule and gated at the same thresholds as the light one, and with a contract that says out loud that a file may carry two palette blocks and no more.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Dark chrome values and dark series and emphasis values for all three colour systems in `palettes.json`.
- A `prefers-color-scheme: dark` block inside the existing style element of each of the twenty-nine asset files.
- Dark rules expressed as ink at an alpha rather than as a solid grey, which is how the vendored source keeps a border readable on a dark card.
- A dark section in `scripts/check-corpus.cjs` computing every gate in the colour system against the dark surface.
- The amendment to contract rule 4, and the amendment to the colour-system derivation rule that permits a re-hue across themes.
- The re-run of every contrast gate per theme, reported per theme rather than once.

### Out of Scope

- A theme toggle inside the file. The operating system preference is the only signal, because a control is state and a delivered file has no place to keep it.
- A third theme, or a high-contrast variant. Nothing asks for one, and a scale with no consumer is the mistake the colour document already records for a fourth system.
- Changing the light values. Phase 002 owns them, and a dark twin that quietly edits its light source is two changes wearing one name.
- Rewriting the ungated `rule` role decision. It stays ungated on both grounds, for the reason the colour document already gives.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json` | Modify | Dark chrome, dark series and dark emphasis per system, plus the gate note for the second ground |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/*.html` | Modify | A media-scoped palette block in each of the twenty forms |
| `.opencode/skills/sk-doc/sk-create-chart/assets/examples/*.html` | Modify | The same block in each of the six family deliveries |
| `.opencode/skills/sk-doc/sk-create-chart/assets/color/palette-sheet-*.html` | Modify | The same block in each of the three proof sheets, which are also the skeleton authors copy |
| `.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs` | Modify | A dark section, and a `palette-block` check that accepts exactly two regions |
| `.opencode/skills/sk-doc/sk-create-chart/references/color-system.md` | Modify | The derivation rule across themes, and the gate table stated per theme |
| `.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md` | Modify | Rule 4 amended from one palette block to one per theme |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The operator has answered the contract amendment before any asset file gains a second palette block |
| REQ-002 | `palettes.json` carries dark chrome and dark series and emphasis values for all three systems, and the dark series values are re-chosen hues rather than lightened light ones |
| REQ-003 | Every one of the twenty-nine asset files carries exactly one media-scoped dark palette block, matching the source in both directions |
| REQ-004 | Every contrast gate in the colour system is computed against the dark surface as well as the light one, and both report zero failures |
| REQ-005 | Contract rule 4 states the two-block ceiling, and the `palette-block` check enforces it rather than the old single-block wording |
| REQ-006 | `check-corpus.cjs --render` prints `RESULT: PASSED` from the final state |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | Dark rules are ink at an alpha rather than a solid grey, so a border reads on a dark card without competing with the data |
| REQ-008 | The colour-system document says when a re-hue across themes is honest, so a later author is not left to infer it |
| REQ-009 | The dark section of the corpus check is proved able to fail before it is trusted |
| REQ-010 | Every document authored in this phase reports zero hard blockers under `hvr_scan.py` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -l 'prefers-color-scheme: dark' .opencode/skills/sk-doc/sk-create-chart/assets/**/*.html | wc -l` prints `29`.
- **SC-002**: `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs` prints a `palette-source-dark` line with a nonzero assertion count and `0 failure(s)`.
- **SC-003**: `grep -c 'exactly one palette block' .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md` prints `0`.
- **SC-004**: `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The amendment is applied before the operator answers it | The contract changes on an implementer's judgement, which is the one thing the adjudication reserved to the operator | Task T001 puts the drafted amendment to the operator, and every later task is blocked on the answer |
| Risk | Dark values derived by lightening the light ones | Washed marks that fail the mark gate, and an ordered ramp that stops being monotonic | The derivation rule is amended first, and the dark gate run catches what slips through |
| Risk | The `palette-block` check widened until it stops checking | A second block that drifts from its source is invisible in a diff, which is the failure rule 4 exists to prevent | The check asserts exactly two regions, each matched against its own source projection in both directions, and the widening is proved able to fail |
| Risk | The ordered ramp inverting on the dark ground | Dark reads as more on one theme and as less on the other, so the encoding means two things | Monotonicity is asserted per theme, against that theme's own surface |
| Risk | Twenty-nine files edited by hand | One drifted block, found by nobody | The check prints the exact block to paste when a block has drifted, which is already how the light blocks are maintained |
| Dependency | Phase 002, the chrome rollout | The dark twin answers a light palette that is still moving | The phase does not start until phase 002 closes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A themed file stays one self-contained document that opens with no build step and no network. The second block is more custom properties in the style element that is already there.

### Accessibility
- **NFR-A01**: The text gate holds on both grounds at 4.5 to 1, and the mark gate at 3 to 1, computed rather than restated.
- **NFR-A02**: Colour is still never the only cue on either theme, so a chart printed in greyscale from the dark theme reads the same way it does from the light one.

### Reliability
- **NFR-R01**: A browser that never resolves the media query falls back to the light block, which is the existing behaviour and needs no code.
- **NFR-R02**: The corpus check is the authority on whether a palette block shipped correctly, and a failing run blocks the claim.

---

## 8. EDGE CASES

### Rendering Boundaries
- A print stylesheet or a print to PDF from a dark browser: the media query does not apply to print, so the light block paints and the chart prints on paper the way it always did.
- A reader who forces colours at the operating system level: neither block wins, and the file degrades to the browser's own scheme with the data table intact.

### Derivation Boundaries
- A system whose dark hue clears the mark gate but collides with the dark emphasis: the emphasis separation floor of 1.5 to 1 catches it, and it is computed per theme.
- The lightest step of the ordered ramp on a dark ground: the lightest step is now the one closest to the dark surface, so the 1.15 to 1 floor applies to the opposite end of the ramp and the check has to say which end it is testing.

---

## 9. COMPLEXITY ASSESSMENT

Scored with `bash .opencode/skills/system-spec-kit/scripts/spec/recommend-level.sh --loc 700 --files 33 --architectural`, which returned Level 3 at 71 of 100. That run also reported a phase score of 30 of 50 and suggested two phases. This work stays one phase, because the parent packet is already a seven-phase decomposition and splitting a palette from the check that proves it produces two phases neither of which can close alone.

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: 29 assets plus the palette source, the checker and two references, Systems: 1 |
| Risk | 14/25 | Auth: N, API: N, Breaking: Y, a contract rule changes |
| Research | 10/20 | The recommendation is adjudicated, and the derivation still has to be done by hand |
| Multi-Agent | 2/15 | No dispatch |
| Coordination | 9/15 | Dependencies: phase 002, the corpus check and one operator decision |
| **Total** | **55/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The contract is amended without the operator's answer | H | M | Every implementation task is blocked on T001, and the amendment text is drafted so the answer is a yes or a no |
| R-002 | A dark value that reads on screen and fails the gate | M | H | Gates are computed from the palette file per theme on every run, never restated in a test |
| R-003 | The `palette-block` check widened until a drifted block passes | H | M | The widening is proved able to fail on a mutated copy before it is trusted |
| R-004 | The ordered ramp reversing between themes | M | M | Monotonicity asserted per theme against that theme's own surface |
| R-005 | The phase starting before the light chrome settles | M | M | Sequenced behind phase 002 in the parent handoff table |

---

## 11. USER STORIES

### US-001: Opening a delivered chart on a dark system (Priority: P0)

**As a** reader whose operating system is set to dark, **I want** a delivered chart to answer that setting, **so that** the file does not arrive as a bright rectangle in an otherwise dark window.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Deriving a second palette without guessing (Priority: P1)

**As an** author adding a colour system, **I want** the colour document to say when a re-hue across themes is honest, **so that** I derive the second ground under a stated rule instead of picking values that look right on my own monitor.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

All three are answered. Each answer is written up in `decision-record.md` with what it cost.

- **The contract amendment.** Answered yes by the operator on 2026-09-03. Rule 4 now reads that a file carries one palette block per theme and no more than two, each matched against its own projection of the palette source in both directions. The ceiling stayed a ceiling, and the check counts the sentinel pairs rather than trusting the count. ADR-002.
- **Whether the dark chrome keeps the warm cast.** It keeps the paper's hue angle and cuts its chroma, because thirty-three percent saturation reads as paper at 97 percent lightness and reads as brown at 8 percent. The ground is a value the corpus already had: the light theme's own ink carries the same cast, and the dark ground sits one step deeper than it. ADR-003.
- **Whether the deliveries and the proof sheets need the same treatment.** All twenty-nine, with the proof sheets first. A delivery is what a reader meets, and a proof sheet is the skeleton every future template copies, so one without a dark block would make every new template non-conformant on creation. ADR-004.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Durable Directive**: See `goal.md`
