---
title: "Implementation Plan: Catalog and contract corrections for the chart corpus"
description: "How five independent corrections reach three reference documents and twenty-three files, in an order that keeps the corpus check green at every step."
trigger_phrases:
  - "chart catalog plan"
  - "chart contract corrections"
  - "chart shared geometry defaults"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Catalog and contract corrections for the chart corpus

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown references, self-contained HTML5 templates, Node CommonJS for the corpus check |
| **Framework** | None by contract. A template depends on nothing at runtime |
| **Storage** | None. Colour lives in one JSON file and data lives in each template |
| **Testing** | `scripts/check-corpus.cjs`, which parses the catalog in both directions on every run |

### Overview

Five corrections, independent of each other, plus one drafted clause that waits on the operator. The system reassignment goes first, because it is the only one that changes a picture and the only one that fails a check if half of it lands. The empty-data notice goes next, form by form, each proved on a fixture. The three documentation items follow in any order. The gradient clause is written and left unapplied.

Nothing here is copied. Two of the five come from reading the corpus against itself rather than from the vendored source at all, which is why they were invisible until two lineages read both.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phases 001 through 005 closed, so the picture the documents describe has stopped moving
- [x] Baseline corpus check captured before any edit, after one flaked run was re-run from the same untouched tree
- [x] The twenty-row system re-check completed before any row was edited, and it found no row to edit

### Definition of Done
- [x] All acceptance criteria met or superseded, with none unmet
- [x] `check-corpus.cjs --render` prints `RESULT: PASSED` from the final state, with `catalog` at 41 assertions and zero failures
- [x] Every empty-data notice proved on a fixture and proved silent on the shipped data, twenty of twenty each way
- [x] Docs updated, plus a decision record and an implementation summary
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Three reference documents describe a flat corpus of self-contained files, and one script checks that the descriptions and the files agree. Every correction below either changes a description to match the corpus or changes the corpus to match a description that was already right.

### Correction 1: the system reassignment

The colour document defines the three systems by what colour encodes: nothing in `neutral`, position on a scale in `ordered`, category membership in `categorical`. The catalog assigns a system per row. Those two documents have never been read against each other row by row.

The research found one mismatch. `grouped-bars` answers "how does this period compare with the last one" across two series and six or fewer categories, and it sits on `neutral`. `stacked-bars` and `stacked-area` answer the same shape of question, series membership across categories, and both sit on `categorical`. The vendored source treats two series as two hues by default, at `context/evilcharts/src/registry/examples/recharts/ex-line-chart.tsx:24-35`, which is corroboration rather than the argument. The argument is the corpus's own definition.

The re-check is a twenty-row reading, and the correction is a paired edit: the catalog cell and the template's own `chart-color-system` meta tag, plus the palette block the check prints for the new system. A one-sided edit fails the `identity` check, which is the right failure.

This is the one correction that changes a picture, and the phase says so out loud rather than letting a documentation phase quietly redraw a chart.

**What the re-check actually returned.** No row moved, `grouped-bars` included. The argument
above is the case for moving it, and ADR-001 of `decision-record.md` carries the three things
that answer it, the strongest being that `categorical` is defined for categories that are
unordered while last year against this year is a time order. The reading did find a different
defect, which is `progress-single` declaring a system whose whole content is that colour encodes
magnitude while painting a fixed value. That is the form the one picture change lands on, through
the sweep rather than through a reassignment.

### Correction 2: the empty-data notice

The contract already states the principle: a notice belongs in the figure when a reader looking at the picture would otherwise draw a wrong conclusion from it. A blank frame is that case. `scatter` past twenty points and `heat-matrix` past a hundred cells already print a count against a ceiling, and the three time forms already report readings left out of a line. None of the twenty says anything when the block is empty.

The idea comes from the vendored source's own non-data figure state at `context/evilcharts/src/registry/ui/recharts-chart.tsx:131-144`. The carrier is the corpus's existing notice element, which is already a text node inside the drawing, already styled and already reachable by a screen reader.

The condition is one guard at the top of each drawing script: nothing readable in the block means an empty array, or an array whose entries all carry values that are not finite numbers. One row is not empty.

### Correction 3: the type scale

Five sizes are already in use across twenty templates: 21px for the headline, 15px for the subtitle, 13px for labels and the source line, 12px for notes, and 11px for ticks. No document names them, so the twenty-first template is a guess. They are published as named roles in the contract's skeleton section, and the roles document what is already there rather than proposing anything new. The vendored source's own 12px chart-text baseline at `context/evilcharts/src/registry/ui/recharts-chart.tsx:112` is what prompted the audit.

### Correction 4: the gap prose

The catalog has a name-map for the forms a reader asks for by an industry name. It has nothing for the forms the corpus does not draw, which reads as an oversight. Three are worth naming, each from the vendored source: sankey at `context/evilcharts/src/registry/charts/recharts-sankey-chart.tsx`, the dual-axis composed form at `recharts-composed-chart.tsx`, and radar at `recharts-radar-chart.tsx`.

| Form | Why it is absent |
|------|------------------|
| sankey | The contract excludes layout-engine forms, and a hand-drawn approximation of a flow diagram is less honest than the real thing. If flow is ever wanted, the exclusion is what to revisit rather than the form |
| composed, or dual-axis | A reported gap rather than a refusal. `waterfall` covers signed steps and nothing covers two measures on one axis. Phase 007 closes it, so this entry is written to be removed rather than edited |
| radar | `parallel-axes` answers the multi-dimension comparison with one scale per axis. A radar normalises every dimension onto one radial scale, which is honest when the dimensions share a unit and misleading when they do not |

### Correction 5: the shared geometry defaults

The skeleton at `assets/color/palette-sheet-neutral.html` is what the contract tells an author to copy. It carries no geometry constants, so each of the twenty forms invents its own margins, gutters and plot insets. The vendored source keeps its defaults at the root of the chart component, at `context/evilcharts/src/registry/charts/recharts-line-chart.tsx:56-60` and `context/evilcharts/src/registry/ui/recharts-chart.tsx:113`.

The corpus cannot share a runtime, so the block is copied rather than imported. It records the values the corpus already uses, which means the correction ships no visual change. A form whose numbers genuinely differ keeps its own and says why in a comment beside them.

### The drafted gradient clause

The operator answered yes on 2026-09-03, scoped to systems that already encode magnitude, so the
clause is written into the colour document and applied. It reaches one form rather than three,
because a calendar cell and a matrix cell each hold one reading and a gradient across one of them
would paint variation inside a single value. ADR-002 carries the scope and the build.

The evidence is the vendored slot gradient at `context/evilcharts/src/registry/charts/recharts-line-chart.tsx:785-809`, which builds a stroke gradient from a series that carries more than one colour. The corpus rule that governs it is the one saying a system encodes one meaning.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The system reassignment is a rename with real consumers, so the inventory is what decides whether it shipped correctly.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `references/catalog.md` system column | Assigns one system per row | update | `grep -E '^\| [a-z-]+ \|'` between the sentinels, read row by row against the colour document |
| `assets/templates/<id>.html` meta tag | Declares the system the file uses | update | `grep -h 'chart-color-system' assets/templates/*.html \| sort \| uniq -c`, before and after |
| `assets/templates/<id>.html` palette block | Carries the values for the declared system | update | The corpus check prints the exact block to paste when a block and its declared system disagree |
| `references/color-system.md` definitions | The authority a row is checked against | update | Read, and restated so a future row cannot disagree with it silently |
| All twenty templates | Draw with hand-typed geometry | update | `grep -c 'GEOMETRY DEFAULTS' assets/templates/*.html` returns a line per template |
| `assets/color/palette-sheet-*.html` | Proof sheets, one of which is the skeleton | update | The skeleton carries the geometry block a new template inherits |

Required inventories:
- Producers of a system assignment: the catalog rows between the sentinels, and each template's `chart-color-system` meta tag.
- Consumers of the type scale: `grep -rn 'font-size' assets/`, run before and after, so a published role that does not match the corpus is visible.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Every asset file against the contract rules, and the catalog in both directions | `node scripts/check-corpus.cjs` |
| Fixture | Each of the twenty forms handed an empty block, then its shipped block | A scratch copy per form, read by eye and by the render pass |
| Rendered | Every file opened headless, figure region asserted non-empty | `node scripts/check-corpus.cjs --render` |
| Before and after | The one form whose system changes, rendered both ways | Screenshots kept in the phase record, since a documentation phase that redraws a chart owes the reader the picture |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001 through 005 | Internal | Yellow | The documents describe a picture that is still moving |
| The operator's answer on the multi-hue clause | External | Yellow | The clause stays drafted and unapplied. Every other correction proceeds |
| Headless Chrome for `--render` | External | Green | Template edits cannot be proven, so none may be applied |
| `check-corpus.cjs` | Internal | Green | No gate, so no catalog or template edit is claimable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the corpus check fails `catalog` or `identity` after a reassignment, and the failure repeats across runs.
- **Procedure**: `git checkout -- <file>` across the catalog and the affected template together, since a reassignment is a paired edit and reverting one half leaves the corpus worse than before. Every change here is a working-tree edit on tracked files, so reverting is a checkout with no history rewrite and no remote step.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (baseline, 20-row re-check) ──► Reassignment ──┐
                                                     ├──► Verify
                                      Empty notice ──┤
                                      Docs ──────────┤
                                      Geometry ──────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 001 to 005 | Everything |
| Reassignment | Setup | Verify |
| Empty notice | Setup | Verify |
| Docs, being the type scale and the gap prose | Setup | Verify |
| Geometry defaults | Setup | Verify |
| Verify | All four | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and the twenty-row re-check | Medium | 1 hour |
| The system reassignment, paired edits and before and after | Low | 40 minutes |
| The empty-data notice across twenty forms, each on a fixture | High | 2 hours 30 minutes |
| The type scale and the gap prose | Low | 45 minutes |
| The shared geometry defaults | Medium | 1 hour |
| The drafted gradient clause | Low | 20 minutes |
| Verification | Medium | 45 minutes |
| **Total** | | **about 7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline corpus check captured before any edit, with its `RESULT:` line read
- [x] Before-state pictures captured. No form's system changed, so all twenty were captured instead of one
- [x] Nothing committed, so the working tree is the only state to revert

### Rollback Procedure
1. Identify the failing file from the `RESULT:` block of the corpus check.
2. `git checkout -- <file>` to restore it, restoring both halves of a paired edit together.
3. Re-run `node scripts/check-corpus.cjs --render` and read the `RESULT:` line.
4. Record the reverted change in the implementation summary as not applied, with the reason.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---

## 8. AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [x] The twenty-row re-check is written down in ADR-001, and its conclusion is that no row moves.
- [x] Baseline captured and read before any edit.
- [x] The condition was proved on `bar-rows` first, and the fixture caught a defect before the guard reached a second form.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | The reassignment lands as one paired edit. A catalog cell changed without its template is a broken corpus between two commands. |
| TASK-SCOPE | Edits stay inside the three references, the twenty templates, the three proof sheets and this phase folder. `scripts/check-corpus.cjs` belongs to phase 007. |
| TASK-GATE | No edit is claimed until `node scripts/check-corpus.cjs --render` prints `RESULT: PASSED` from the state that includes it. |
| TASK-DECIDE | The gradient clause is drafted and not applied. A yes from the operator moves it, and nothing else does. |
| TASK-VISIBLE | A correction that changes a picture is reported with the picture. The system reassignment is the only one, and it owes a before and after. |

### Status Reporting Format

Report phase status as: `Phase 006 status <Planned|Applying|Complete>, rows re-checked N/20, empty notice M/20, gradient clause <drafted|applied|refused>, gate <PASSED|FAILED>`.

### Blocked Task Protocol

An `identity` or `catalog` failure after a reassignment means one half of a paired edit landed, and it is fixed by completing the pair rather than by reverting the other half. An unanswered multi-hue decision blocks only the gradient clause and nothing else, so the phase proceeds and closes with that one item recorded as drafted.
