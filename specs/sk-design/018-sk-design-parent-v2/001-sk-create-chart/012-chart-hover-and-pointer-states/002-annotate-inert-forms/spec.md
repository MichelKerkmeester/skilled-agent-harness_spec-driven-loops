---
title: "Feature Specification: Annotate the six inert forms"
description: "Six chart forms already print every value they encode beside the mark that carries it, so a hover card would only repeat what the reader is looking at. Phase 1 gave the corpus a way to say so. This phase says it, on each of the six."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Annotate the six inert forms

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-09-05 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states` |
| **Depends On** | `001-register-and-contract` (the `data-chart-inert` register and the recorded per-form contract) |
| **Runs With** | `003-excerpt-and-grouped-bars`. Disjoint files: this phase touches six templates that gain an attribute and no code, phase 3 touches one template that gains code and no attribute |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`progress-single`, `unit-ring`, `unit-grid`, `independent-percentages`, `bar-columns` and `bar-rows` each print every value they encode beside the mark that carries it, so none of them needs a hover card. Phase 1 gave `check-corpus.cjs` a register, `data-chart-inert`, and a place in `references/template-contract.md` recording each of these six forms' reason. Neither has reached the six template files yet. Until they carry the attribute, REQ-001's markup half is unmet for all six, and the contract document describes a state the markup does not yet show.

### Purpose
Each of the six forms declares `data-chart-inert` on its figure wrapper, with the exact reason recorded in phase 1's contract table, and the corpus still prints `RESULT: PASSED`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `data-chart-inert="<reason>"` to the `<div class="figure" data-chart-part="figure">` element of each of the six named templates, using the exact reason text from phase 1's contract table.
- Confirm the corpus stays green and that the `interaction-hygiene` check reports zero failures across all six, which confirms the new attribute did not accidentally join `INTERACTION_REGISTERS`.

### Out of Scope
- Any of the seven forms gaining a tooltip (`stacked-bars`, `stacked-area`, `grouped-bars`, `bar-line-composed`, `daily-line`, `daily-range`, plus the six already-shipped and two terminal forms) - not this phase's files.
- Any change to `check-corpus.cjs`, `references/template-contract.md` or `scripts/README.md` - those are phase 1's files and are already landed before this phase starts.
- Any change to the six deliveries under `assets/examples/` - phase 7's decision and, if taken, phase 7's work.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/progress-single.html` | Modify | Add `data-chart-inert` to the figure wrapper (`:161`) |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/unit-ring.html` | Modify | Add `data-chart-inert` to the figure wrapper (`:130`) |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/unit-grid.html` | Modify | Add `data-chart-inert` to the figure wrapper (`:130`) |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/independent-percentages.html` | Modify | Add `data-chart-inert` to the figure wrapper (`:124`) |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-columns.html` | Modify | Add `data-chart-inert` to the figure wrapper (`:149`) |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-rows.html` | Modify | Add `data-chart-inert` to the figure wrapper (`:142`) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of the six correctly-inert forms declares `data-chart-inert` on its figure wrapper, with a non-empty reason matching phase 1's recorded contract. This completes the markup half of REQ-001 for these six forms. The other fifteen are completed by phases 3 through 6. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -c data-chart-inert assets/templates/*.html` returns a non-zero count for exactly `progress-single.html`, `unit-ring.html`, `unit-grid.html`, `independent-percentages.html`, `bar-columns.html` and `bar-rows.html`, and zero for the other fifteen templates (completes AC-001).
- **SC-002**: `node scripts/check-corpus.cjs` prints `RESULT: PASSED`, and the `interaction-hygiene` line in the run summary reports zero failures across the six annotated files (completes AC-001).
- **SC-003**: Every attribute value is a readable clause naming the reason the static figure suffices, not a placeholder or an empty string (completes AC-001).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1's checker rule and contract table | This phase's reason text is copied verbatim from phase 1's contract table, and the checker rule this phase's verification relies on is phase 1's | Confirm phase 1 landed (`data-chart-inert` recognized by `check-corpus.cjs`, all six reasons recorded in `references/template-contract.md`) before annotating |
| Risk | A copy-paste error lands the wrong reason on the wrong form, or lands the attribute somewhere other than the figure wrapper | Low: the checker only validates presence and non-emptiness, not correctness against the contract document, so a mismatch would pass the checker and only be caught by a manual read | Read each attribute value against the contract table row for that form as a final verification step, not just against the checker's `RESULT: PASSED` |
| Risk | The attribute lands on the `<svg>` element instead of the `<div class="figure">` wrapper | Low: the checker reads the whole markup region and does not care where in the file the attribute sits, so this would still pass `check-corpus.cjs` | Place it on the figure wrapper anyway, for consistency with the register table's documented location, and note any deviation if a form's structure genuinely does not have one |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable. A static attribute on a non-interactive form adds no runtime code and cannot change first paint.
- **NFR-P02**: Not applicable. One short attribute per file has no measurable byte impact worth a table.

### Security
- **NFR-S01**: No external fetch, CDN reference or remote resource is introduced.

### Reliability
- **NFR-R01**: Adding a static attribute to six already-shipped, non-interactive forms cannot change their rendered output, since none of them carries any script logic keyed off this attribute.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A reason string containing a double quote: escape it, or rephrase, so the attribute's value parses cleanly. None of the six reasons drafted in phase 1 contains one, but a future edit should check.

### Error Scenarios
- If any of the six forms is found, on inspection, to already carry one of the three interaction registers (it should not, per `research.md`'s verification that none of them declares `data-chart-tooltip`, `data-chart-legend` or `data-chart-dim` today), stop and treat it as a logic-sync issue against phase 1's contract table rather than silently annotating over it.

### State Transitions
- Not applicable. These six forms carry no interactive state before or after this phase.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | Six files, one attribute each, no code |
| Risk | 2/25 | Non-interactive forms, no runtime change, checker only validates non-emptiness |
| Research | 1/20 | Fully decided by phase 1's contract table, nothing left to investigate |
| **Total** | **7/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. `research.md` section 2 and phase 1's contract table already name every form and every reason this phase needs.
<!-- /ANCHOR:questions -->
