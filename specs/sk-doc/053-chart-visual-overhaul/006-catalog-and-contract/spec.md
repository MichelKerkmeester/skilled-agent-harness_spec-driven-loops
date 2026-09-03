---
title: "Feature Specification: Catalog and contract corrections for the chart corpus"
description: "One catalog row claims a colour system the colour document contradicts, three forms the reference has are missing from the corpus with no note saying why, the type scale is undocumented, an empty data block draws a blank box, and the geometry constants are hand-varied per template. This phase fixes all five and adds the one gradient rule the corpus is missing."
trigger_phrases:
  - "chart catalog correction"
  - "chart contract correction"
  - "chart empty data notice"
  - "chart type scale"
  - "chart gradient stroke rule"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Catalog and contract corrections for the chart corpus

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

This is the phase that pays the documentation debt the research found, plus the two corpus behaviours nobody wrote down. Neither research lineage ranked any of it first, and that is the right ranking. None of it changes how a chart looks. All of it changes whether the next author can trust what the corpus says about itself.

**Key Decisions**: the gradient stroke rests on an operator decision the adjudication named, and this phase drafts the colour-system clause rather than assuming the answer.

**Critical Dependencies**: none beyond the corpus check. The five corrections are independent of each other, which is why they are one phase rather than five.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-09-03 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 6 of 7 |
| **Predecessor** | `005-dark-theme` |
| **Successor** | `007-composed-form-and-closeout` |
| **Handoff Criteria** | The catalog and the contract state what the corpus now does, no row claims a system the colour document contradicts, and the corpus check resolves the catalog in both directions with zero failures |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the chart visual overhaul. Phases 1 through 5 changed the picture. This one changes the documents that describe it, and it adds the two behaviours that were always meant to be there.

**Scope Boundary**: `references/catalog.md`, `references/color-system.md`, `references/template-contract.md`, the twenty chart forms and the three palette proof sheets. `scripts/check-corpus.cjs` is not edited here, because phase 007 owns the assertions for every invariant phases 004 through 006 introduce.

**Note on the parent's aggregate file table**: the parent `spec.md` lists `assets/templates/*.html` and `assets/color/*.html` as changed in phases 001, 002, 003, 004, 005 and 007. This phase changes both as well, for the empty-data notice and the shared geometry defaults, so that row needs one edit when the orchestrator reconciles the parent.

**Dependencies**:
- The corpus check, which parses the catalog in both directions and would catch a row that stops resolving.
- The operator, who owns the multi-hue decision named in section 10.

**Deliverables**:
- Every catalog row's system column re-checked against the colour document's own definition, and any mismatch corrected in the row and in the file it names.
- Catalog prose naming the three forms the reference has and the corpus does not, each with the reason it is absent.
- The type scale published as named roles in the contract skeleton.
- A notice in the figure when the data block holds nothing readable, on all twenty forms.
- One block of shared geometry defaults in the skeleton, so the corpus stops varying margins by hand.
- A drafted colour-system clause permitting a gradient stroke on ordered-system forms only.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Five separate defects, one theme. The corpus says things about itself that are not quite true, and the places it is silent are the places an author has to guess.

The catalog says `grouped-bars` uses the `neutral` system. The colour document says `neutral` encodes nothing and ranks series by lightness, while `categorical` encodes category membership. Two series across six categories is a category comparison, and the two forms that answer the same shape of question, `stacked-bars` and `stacked-area`, both sit on `categorical`. One of the two is wrong, and the research found it by reading the two documents against each other rather than by looking at a chart.

The catalog also carries a name-map for the forms a reader asks for by an industry name, and it has nothing at all for the forms the corpus does not draw. A reader looking for a sankey, a dual-axis composed chart or a radar gets silence, which reads as an oversight rather than as a decision.

The type scale is real and undocumented. Twenty templates use the same five sizes and no document names them, so the twenty-first is a guess.

An empty data block draws an empty box. The contract already says a form prints a notice in the figure when a reader would otherwise draw a wrong conclusion from the picture, and a blank frame is the clearest case of that. Two forms already print a notice past their documented ceiling. None prints one when the data holds nothing.

The geometry constants are hand-varied. Margins, gutters and plot insets differ per template with no shared source, so the corpus drifts one file at a time.

### Purpose

The catalog and the contract say what the corpus actually does, an empty figure says it is empty, and the geometry an author starts from is one block they copy rather than five numbers they invent.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Re-checking every one of the twenty catalog rows against the colour system's own definition, and correcting the rows that disagree, including the declared system inside the template file itself.
- Catalog prose naming sankey, the dual-axis composed form and radar, each with the reason it is absent.
- The type scale published as named roles in the contract skeleton section.
- An empty-data notice on all twenty chart forms, in the voice the existing notices already use.
- One block of shared geometry defaults in the skeleton, with each template reading from it.
- A drafted colour-system clause allowing a gradient stroke on ordered-system forms and forbidding it elsewhere.

### Out of Scope

- `scripts/check-corpus.cjs`. Phase 007 asserts every invariant this phase introduces.
- Building the composed form. Phase 007 owns it, and this phase records it as a named gap so that phase has something to close.
- Reopening pattern fills. The colour document already refuses them in writing, and the adjudication rejected the decorative background patterns on the same grounds.
- Adding a diverging colour system. The colour document already records the refusal and names the form that would reopen it.
- Changing any chart's marks, colours or motion. Phases 001 through 005 own the picture.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-chart/references/catalog.md` | Modify | The system column re-checked row by row, plus the gap prose for the three absent forms |
| `.opencode/skills/sk-doc/sk-create-chart/references/color-system.md` | Modify | The drafted gradient clause, and the system definitions restated so a row cannot disagree with them silently |
| `.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md` | Modify | The type scale as named roles, the shared geometry block in the skeleton section, and the empty-data notice as a stated behaviour |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/*.html` | Modify | The empty-data notice on all twenty, the reassigned palette block on any row whose system changed, and the gradient stroke on the ordered forms if the operator allows it |
| `.opencode/skills/sk-doc/sk-create-chart/assets/color/palette-sheet-*.html` | Modify | The shared geometry defaults block, since one of the three sheets is the skeleton every new template copies |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every catalog row's system column is checked against the colour document's definition, and a row that disagrees is corrected in the catalog and in the template it names |
| REQ-002 | All twenty chart forms print a notice in the figure when the data block holds nothing readable, rather than drawing a blank frame |
| REQ-003 | The corpus check resolves the catalog in both directions with zero failures after every reassignment |
| REQ-004 | `check-corpus.cjs --render` prints `RESULT: PASSED` from the final state |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The catalog names sankey, the dual-axis composed form and radar, each with the reason it is absent, written so the composed entry is removed rather than edited when phase 007 lands |
| REQ-006 | The contract publishes the type scale as named roles, matching the sizes twenty templates already use |
| REQ-007 | The skeleton carries one block of shared geometry defaults, and every template reads its margins from it rather than from hand-typed values |
| REQ-008 | The colour document carries a drafted clause on the gradient stroke, applied only if the operator answers the multi-hue decision yes |
| REQ-009 | Every document authored in this phase reports zero hard blockers under `hvr_scan.py` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -E '^\| grouped-bars \|' .opencode/skills/sk-doc/sk-create-chart/references/catalog.md` prints a row whose system cell reads `categorical`, and the same string appears in that template's `chart-color-system` meta tag.
- **SC-002**: `grep -l 'CHART_EMPTY_NOTICE' .opencode/skills/sk-doc/sk-create-chart/assets/templates/*.html | wc -l` prints `20`.
- **SC-003**: `grep -n 'sankey' .opencode/skills/sk-doc/sk-create-chart/references/catalog.md` prints at least one line outside the machine-read sentinels.
- **SC-004**: `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render` prints `RESULT: PASSED`, with `catalog` at zero failures.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A system reassignment done in the catalog and not in the template | The catalog names a system the file does not declare, and the `identity` check fails | Every reassignment is a paired edit, and the paste comes from the block the check prints |
| Risk | The reassignment changing how a chart looks | A phase scoped to documentation quietly redraws a chart | A system change is a colour change by definition. The before and after of the affected form is captured and shown, and the change is named in the phase record rather than buried |
| Risk | The empty-data notice firing on a form that has data | Twenty charts print a notice nobody asked for | The condition is proved on a fixture with an empty block and on the shipped block, per form |
| Risk | The gradient stroke applied before the operator answers | A contract-level colour rule changes on an implementer's judgement | The clause is drafted and not applied. Task T014 is blocked on the answer |
| Risk | Shared geometry defaults changing the drawn size of a form | A chart that was correct at 720 units wide reflows, and rule 14's floor stops matching its viewBox | The defaults record the values the corpus already uses. A form whose numbers differ keeps its own and says why in a comment |
| Dependency | `check-corpus.cjs` | No gate, so no catalog or template edit is claimable | The check parses the catalog in both directions already |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A form with an empty-data notice stays one self-contained file that opens with no build step and no network.

### Accessibility
- **NFR-A01**: The empty-data notice is a text element inside the drawing, so a screen reader reaches it the same way it reaches the existing ceiling notices.

### Reliability
- **NFR-R01**: The corpus check is the authority on whether a catalog edit shipped correctly. A row that names a file it cannot reach fails, and so does a file with no row.
- **NFR-R02**: The catalog table between the sentinels is machine-read. Prose outside them is free to change, and the header names and the two id-bearing columns are the contract.

---

## 8. EDGE CASES

### Data Boundaries
- A data block with an empty array: the notice fires.
- A data block whose entries all carry values that are not finite numbers: the notice fires, because nothing readable is present even though the array has length.
- A data block with one row: the notice does not fire, and the axis ladder still has to produce a readable scale from a single value.

### Documentation Boundaries
- A catalog row whose system is ambiguous under the colour document's definition: the row keeps its current system, and the ambiguity is recorded rather than resolved by preference.
- The composed form's gap entry: it exists for one phase only, and phase 007 removes it when the form arrives.

---

## 9. COMPLEXITY ASSESSMENT

Scored with `bash .opencode/skills/system-spec-kit/scripts/spec/recommend-level.sh --loc 520 --files 25 --architectural`, which returned Level 2 at 67 of 100 and did not recommend further phasing at a phase score of 20 of 50.

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | Files: 20 templates, 3 proof sheets and 3 references, Systems: 1 |
| Risk | 8/25 | Auth: N, API: N, Breaking: N, one colour reassignment that changes a picture |
| Research | 6/20 | Adjudicated already. The row-by-row re-check is the only judgement left |
| Multi-Agent | 2/15 | No dispatch |
| Coordination | 7/15 | Dependencies: the corpus check and one operator decision |
| **Total** | **38/100** | **Level 2** |

---

## 10. OPEN QUESTIONS

The first item is an operator decision the adjudication named, and this phase does not assume an answer to it.

- **The multi-hue series.** Allowing one series to carry a colour range needs the colour document to say when that is honest. The drafted clause reads: a single series may carry a gradient along its own system ramp only when the system encodes magnitude, because a sweep along an ordered ramp restates the ordering the data already has, and the same sweep on a `neutral` or `categorical` series invents an ordering the data does not have. That would permit it on `calendar-grid`, `heat-matrix` and `progress-single` and forbid it everywhere else. The operator answers yes or no. A no leaves the clause recorded and nothing applied.
- Whether any catalog row besides `grouped-bars` changes system. The research named one. The re-check is a row-by-row reading of twenty rows against one definition, and it may find none more or several.
- Whether the shared geometry block belongs in the skeleton or in the contract prose. The skeleton is what an author copies, which argues for the skeleton. The contract is what an author reads, which argues for both, and the cost of both is that two places can drift.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Durable Directive**: See `goal.md`
