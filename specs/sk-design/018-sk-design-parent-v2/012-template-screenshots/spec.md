---
title: "Feature Specification: Give the chart and diagram modes a rendered picture of every template and example"
description: "Both canvas modes ship HTML that has to be opened in a browser to be judged. 26 chart templates, 6 chart examples, 4 diagram templates and 34 diagram examples, and no way to see any of them without rendering it yourself. A catalog of forms nobody can"
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Give the chart and diagram modes a rendered picture of every template and example

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

75 PNGs rendered from the two modes' HTML, mirroring the source layout, produced by a script rather
than by hand so they can be regenerated. Two properties of this corpus shaped the capture: charts
animate on first paint, so the frame is taken after a virtual time budget lets the animation settle,
and Chrome ignores the colour-scheme flags in headless capture, so the theme follows the host
machine.

**Key Decisions**: a regenerable script, not hand-made images; screenshots live beside assets/ rather than inside it

**Critical Dependencies**: a headless Chrome, already a dependency of the chart corpus checker

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
| **Phase** | 12 of 12 |
| **Predecessor** | `011-router-vocabulary-repair` |
| **Successor** | None |
| **Handoff Criteria** | Nothing follows; both canvas modes carry a picture of every form they ship |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the router vocabulary repair and template screenshots specification.

**Scope Boundary**: The two canvas modes' HTML sources and a new `screenshots/` directory in each. No template is
modified; nothing is rendered that is not already shipped.

**Dependencies**:
- Headless Chrome, already required by the chart corpus checker
- The leaf-manifest generator, which decides what counts as a routable resource

**Deliverables**:
- 36 chart and 39 diagram screenshots, mirroring the source tree
- A shared render script with a `--check` mode that answers whether every source is covered
- A section in each mode's README naming the regeneration command

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Both canvas modes ship HTML that has to be opened in a browser to be judged. 26 chart templates, 6
chart examples, 4 diagram templates and 34 diagram examples, and no way to see any of them without
rendering it yourself. A catalog of forms nobody can look at is a list of filenames.

### Purpose
Every template and example can be judged without opening a browser.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rendering every `.html` under each mode's `assets/`
- A script with a coverage check
- Documenting the regeneration command and the host-theme property

### Out of Scope
- Modifying any template or example to render better
- Rendering both colour schemes: Chrome ignores the scheme flags in headless capture
- Screenshots for any other skill

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/shared/scripts/render-screenshots.cjs` | Create | The renderer, with a coverage check |
| `.opencode/skills/sk-design/sk-design-chart/screenshots/**` | Create | 36 PNGs |
| `.opencode/skills/sk-design/sk-design-diagram/screenshots/**` | Create | 39 PNGs |
| Both modes' `README.md` | Modify | How to regenerate, and why the theme follows the host |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every `.html` under each mode's `assets/` has a PNG at the mirrored path. |
| REQ-002 | The screenshots are produced by a committed script, not by hand. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Screenshots do not enter the routable leaf surface. |
| REQ-004 | A chart screenshot shows a settled figure, not a half-drawn entry animation. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `--check` reports 0 missing for both modes.
- **SC-002**: The leaf manifest hash is unchanged by the addition.
- **SC-003**: The chart corpus checker still prints `RESULT: PASSED`.
- **SC-004**: A sampled chart screenshot shows bars at full height and a rendered data table.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Headless Chrome | No renderer, no screenshots | Already a dependency of the corpus checker |
| Risk | A frame is captured mid-animation | High | A virtual time budget lets the entry animation finish |
| Risk | Screenshots become routable leaves | High | Store them beside `assets/`, not inside it |
| Risk | A spawn dies before painting and looks like a broken template | Medium | One bounded retry, matching the corpus checker's own guard |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A full render of both modes takes a few minutes and is run on demand, never in a gate.

### Security
- **NFR-S01**: No credential or network call beyond whatever a template itself loads.

### Reliability
- **NFR-R01**: `--check` answers coverage, which is the property that rots. A stale picture still opens; a missing one is what a reader notices.

---

## 8. EDGE CASES

### Data Boundaries
- A template that loads a webfont over the network: renders with whatever the fetch returns, which is what a reader would see.
- A source added later: `--check` reports it missing rather than silently omitting it.

### Error Scenarios
- A spawn that dies before painting: retried once, because a real failure repeats and a lost race does not.
- A capture that produces no file: reported by name, never counted as success.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 11/25 | Files: 1 script, 75 images, 2 READMEs |
| Risk | 7/25 | Auth: N, API: N, Breaking: N; additive only |
| Research | 8/20 | Finding that the scheme flags do not work took the probing |
| Multi-Agent | 1/15 | Single workstream |
| Coordination | 4/15 | Touches only the two canvas modes |
| **Total** | **[/100]** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Screenshots swept into the leaf manifest | H | H | Stored beside `assets/`; leaf hash verified unchanged |
| R-002 | Mid-animation capture | H | M | Virtual time budget, verified by reading a rendered frame |
| R-003 | Images rot as templates change | H | M | `--check` reports coverage; regeneration is one command |

---

## 11. USER STORIES

### US-001: A form can be judged without opening a browser (Priority: P0)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A changed template is noticed as an uncovered source rather than a stale picture (Priority: P1)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Whether coverage should be a gate rather than an on-demand check. A changed template silently keeps
  its old picture, and only `--check` on a missing file would catch it.
- Whether both colour schemes are worth capturing. Chrome ignores the scheme flags in headless
  capture, so it would need a different driver.
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
