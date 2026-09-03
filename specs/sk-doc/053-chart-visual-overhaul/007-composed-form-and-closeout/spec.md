---
title: "Feature Specification: The composed form and the packet closeout"
description: "The corpus gains one new form, bars for a count series with a line for a rate series, authored through the catalog's own workflow. Then every invariant phases 004 through 006 introduced gains a check that is proved able to fail, and the packet takes its version bump."
trigger_phrases:
  - "chart composed form"
  - "bar line composed chart"
  - "chart corpus checker extension"
  - "chart packet closeout"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: The composed form and the packet closeout

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

The last phase does three jobs. It builds the one form both research lineages agreed the catalog is missing. It closes the checker gap the three preceding phases opened, because a phase that introduces an invariant and no assertion has shipped a wish. Then it takes the version bump and writes the changelog entry.

**Key Decisions**: adding the composed form to the catalog is one of the four calls the adjudication left to the operator, and this phase names it rather than assuming it. The draggable range window is allowed by the adjudication and has no consumer in the corpus as the catalog currently shapes it, which is a finding rather than an omission.

**Critical Dependencies**: phases 004, 005 and 006 all introduce invariants this phase asserts, so all three have to close first.

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
| **Phase** | 7 of 7 |
| **Predecessor** | `006-catalog-and-contract` |
| **Successor** | None |
| **Handoff Criteria** | Every invariant phases 004 through 006 introduced has a check that was proved to fail before it passed, the packet version is bumped and the changelog entry exists |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the chart visual overhaul, and the last. Phases 1 through 6 changed the picture, added behaviour and corrected the documents. This one adds the single form the corpus was missing, makes the corpus check enforce everything the packet introduced, and closes the packet.

**Scope Boundary**: one new template, the catalog, the six family deliveries, `scripts/check-corpus.cjs`, the version fields across seven files and one new changelog entry. Nothing outside `.opencode/skills/sk-doc/sk-create-chart/` and this phase folder is touched.

**Note on the parent's aggregate file table**: the parent `spec.md` lists `assets/examples/*.html` as changed in phases 002 and 005. This phase reads and where needed edits all six, for the scenario naming audit, so that row needs one edit when the orchestrator reconciles the parent.

**Dependencies**:
- Phases 004, 005 and 006, each of which introduces invariants this phase asserts.
- The operator, who owns the catalog decision named in section 10.

**Deliverables**:
- `assets/templates/bar-line-composed.html`, authored through the catalog's own workflow, plus its catalog row.
- A written verdict on each of the six family deliveries against the headline-as-argument rule.
- One assertion per invariant introduced by phases 004 through 006, each proved to fail before it passes.
- The version bump across the packet, and `changelog/v1.2.0.0.md`.
- A recorded disposition on the draggable range window.

**Changelog**:
- This phase writes the packet changelog entry for the whole overhaul, not only for its own work.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Three problems, and they close the packet together.

The catalog has no form for a count and a rate on the same axis. A reader who wants to see order volume against conversion rate over the same eight weeks has to pick one of them and throw the other away, or ask for two charts and lose the comparison that was the point. Both research lineages found the gap. They disagreed on what to do about it, and the adjudication settled it: build the form, late, because a new form does not fix how the existing twenty look.

The corpus check has fallen behind the corpus. Phase 004 adds a tooltip, a legend and a dim. Phase 005 adds a second palette region and a second gate run. Phase 006 adds an empty-data notice, a system column that has to agree with the colour document, and a shared geometry block. Some of those got a check in their own phase. Several did not, by design, so the assertions land in one pass with one person thinking about what a good failure looks like. Until then, each is a rule the tooling does not check, which the packet's own documents describe as a wish rather than a rule.

The packet version has not moved since the fidelity phase, and a reader comparing the shipped mode to its changelog would find six phases of change with no entry.

### Purpose

The catalog answers the count-and-rate question with one form. Every rule this packet introduced is enforced by a check somebody watched fail. The version and the changelog say what happened.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- One new chart form at `assets/templates/bar-line-composed.html`, drawn by hand with both scales computed from the data block, and its catalog row.
- A second scale on the right only when the two magnitudes differ by an order, with the rule written down and the condition visible in the file.
- A written audit of the six family deliveries against the headline-as-argument rule, with fixes where a headline is a label rather than an argument.
- One assertion in `scripts/check-corpus.cjs` per invariant introduced by phases 004, 005 and 006, each proved to fail before it passes.
- The version bump across `SKILL.md`, `README.md`, the three references, `scripts/README.md` and the new changelog file.
- A recorded disposition on the draggable range window, applied only where a form is genuinely dense.

### Out of Scope

- Any form other than the composed one. Pie, radar and sankey are refused with reasons the corpus and the adjudication both already carry.
- Renaming the six family deliveries. They already carry scenario names, and section 10 records what that leaves for this phase to do.
- Re-litigating any rejected row. The decorative background patterns, the loading state, the engine twins and the locale-dependent formatter are each refused with a reason in the adjudication.
- A seventh family delivery for the composed form, unless the audit finds that the new form represents its family better than the current one.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-line-composed.html` | Create | The composed magnitude-and-rate form |
| `.opencode/skills/sk-doc/sk-create-chart/references/catalog.md` | Modify | The new row, and the removal of the composed gap entry phase 006 wrote |
| `.opencode/skills/sk-doc/sk-create-chart/assets/examples/*.html` | Modify | Headline and subtitle fixes where the audit finds a label rather than an argument |
| `.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs` | Modify | One assertion per invariant from phases 004 to 006 |
| `.opencode/skills/sk-doc/sk-create-chart/SKILL.md` | Modify | Version bump |
| `.opencode/skills/sk-doc/sk-create-chart/README.md` | Modify | Version bump |
| `.opencode/skills/sk-doc/sk-create-chart/references/*.md` | Modify | Version bump |
| `.opencode/skills/sk-doc/sk-create-chart/scripts/README.md` | Modify | Version bump, and the new checks described |
| `.opencode/skills/sk-doc/sk-create-chart/changelog/v1.2.0.0.md` | Create | The changelog entry for the whole overhaul |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The operator has answered the catalog decision before the composed form is added to the index |
| REQ-002 | `bar-line-composed.html` satisfies every contract rule, and the catalog resolves it in both directions |
| REQ-003 | The second scale appears only when the two series magnitudes differ by an order, and the file states the rule where an editor will see it |
| REQ-004 | Every invariant introduced by phases 004, 005 and 006 has an assertion in `scripts/check-corpus.cjs` |
| REQ-005 | Every new assertion is shown to fail on a mutated fixture before it is trusted, and the mutation is reverted |
| REQ-006 | `check-corpus.cjs --render` prints `RESULT: PASSED` from the final state |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | Each of the six family deliveries carries a headline that states a conclusion rather than a label, verified one by one and recorded |
| REQ-008 | The packet version is bumped consistently across every file that carries one, and `changelog/v1.2.0.0.md` describes the whole overhaul |
| REQ-009 | The draggable range window has a recorded disposition, applied only where a form is genuinely dense and refused in writing otherwise |
| REQ-010 | Every document authored in this phase reports zero hard blockers under `hvr_scan.py` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs` reports `chart forms under assets/templates: 21`.
- **SC-002**: `grep -c 'bar-line-composed' .opencode/skills/sk-doc/sk-create-chart/references/catalog.md` prints a number greater than `0`, and the `catalog` check reports zero failures.
- **SC-003**: `grep -c 'version: 1.2.0.0' .opencode/skills/sk-doc/sk-create-chart/SKILL.md` prints `1`, and `.opencode/skills/sk-doc/sk-create-chart/changelog/v1.2.0.0.md` exists.
- **SC-004**: `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A second scale on a chart whose magnitudes do not need one | The classic dual-axis lie, where two unrelated scales are made to cross wherever the author placed them | The order-of-magnitude condition is computed from the data block and the file draws one axis when it is not met |
| Risk | A new assertion written to pass rather than to catch | A green run that means nothing, which is worse than no run | Every assertion is proved on a mutated fixture first, and the mutation and the revert are both recorded |
| Risk | The version bumped in some files and not others | A reader trusts the first version string they find | The bump is one task with a grep that has to return the same string everywhere |
| Risk | The range window built where no form is dense | Interaction added without need, which the adjudication allows only where a form is genuinely dense | The catalog ceiling for `daily-line` is thirty readings and the threshold is past thirty, so the disposition starts from that arithmetic rather than from enthusiasm |
| Risk | The composed form built before the operator answers | A catalog gains a row on an implementer's judgement | Task T001 puts the decision, and the authoring tasks are blocked on it |
| Dependency | Phases 004, 005 and 006 | The assertions have nothing to assert | The phase runs last by construction |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The composed form stays one self-contained file that opens with no build step and no network, like every other form.

### Accessibility
- **NFR-A01**: The composed form carries a title inside its vector output, an accessible role, a resolving label and a hidden data table with both series, from the first draft rather than as a retrofit.

### Reliability
- **NFR-R01**: Both scales are computed from the data block, so an editor who changes the numbers gets a chart that still fits.
- **NFR-R02**: A check that has never been seen to fail is not trusted, and this phase does not claim one that has not.

---

## 8. EDGE CASES

### Data Boundaries
- Two series whose magnitudes are within an order of each other: one axis, and the file says why it chose one.
- A rate series with a value above one hundred percent: the axis ceiling follows the data rather than clamping, because a rate over one hundred is a real reading in some domains and silently clipping it is a lie.
- A count series with a zero period: the bar has zero height and the rate line still draws through that period.

### Authoring Boundaries
- The family the new row belongs to is an authoring judgement, recorded in section 10 rather than assumed here.
- A new form arrives after the empty-data notice and the shared geometry defaults land, so it inherits both rather than being retrofitted.

---

## 9. COMPLEXITY ASSESSMENT

Scored with `bash .opencode/skills/system-spec-kit/scripts/spec/recommend-level.sh --loc 750 --files 15`, which returned Level 2 at 48 of 100 and did not recommend further phasing at a phase score of 0 of 50. The architectural flag was not passed, because a form added through the catalog's own documented workflow and assertions added to an existing checker are both additive rather than structural.

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: 1 new template, 6 deliveries, the checker and 7 version-bearing files, Systems: 1 |
| Risk | 7/25 | Auth: N, API: N, Breaking: N, additive only |
| Research | 5/20 | Adjudicated already, and the second-scale rule is the only judgement left |
| Multi-Agent | 2/15 | No dispatch |
| Coordination | 8/15 | Dependencies: three preceding phases and one operator decision |
| **Total** | **34/100** | **Level 2** |

---

## 10. OPEN QUESTIONS

The first item is an operator decision the adjudication named, and this phase does not assume an answer to it.

- **The composed form.** Whether the catalog gains a bar-and-line form with a second scale. One lineage proposed building it and the other proposed recording it as a catalog gap, and the cross-lineage adjudication settled that split in favour of building it late. The adjudication still lists the catalog addition among the four operator decisions, so both are true: the implementer question is settled and the product question is not. The operator answers yes or no. A no leaves phase 006's gap entry standing and closes this phase on the checker extension and the version bump alone.
- Which family the new row belongs to. `relationship` fits the reader's question, which is whether the rate moved with the count, and the family already covers whether two variables move together. `time` fits the axis, since the periods run left to right. The default this phase carries is `relationship`, and the implementer settles it against the catalog's own family prose rather than against preference.
- The draggable range window. The adjudication allows it last and only where a form is genuinely dense, at more than thirty points, opening at the full range so first paint is identical every time. The catalog's documented shape for `daily-line` is thirty readings or fewer, and `stacked-area` is two to five series over a continuous axis with no point ceiling stated. On today's shapes no form clears the threshold, so the window has no consumer unless a documented shape is raised first. That is a finding rather than an omission, and it is recorded either way.
- Whether the six family deliveries need any change at all. All six already carry scenario filenames and headlines that state a conclusion. What the recommendation asks for may already be satisfied, and the honest work is an audit with a written verdict rather than a rewrite in search of one.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Durable Directive**: See `goal.md`
