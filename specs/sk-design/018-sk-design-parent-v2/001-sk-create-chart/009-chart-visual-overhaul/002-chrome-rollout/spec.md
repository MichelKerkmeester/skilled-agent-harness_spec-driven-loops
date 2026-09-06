---
title: "Feature Specification: Roll the settled chrome across the whole chart corpus"
description: "The chrome proven on two forms goes to all twenty templates, the six family deliveries and the skeleton, and the corner radius stops being twenty hand-typed values and becomes a token ladder the checker can assert."
trigger_phrases:
  - "chart chrome rollout"
  - "chart radius ladder"
  - "chart mono tabular figures"
  - "corpus wide restyle"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Roll the settled chrome across the whole chart corpus

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Phase 001 proves five chrome rows on two files and settles two forks. This phase takes the
result to every file the corpus ships: twenty chart forms, six family deliveries and three
palette proof sheets. The grid goes dashed, the tick ink goes muted, every printed number moves
to a system mono face with tabular figures still routed through the corpus formatter, the line
family gains the two-weight dot language, and area fills fade toward the baseline.

The sixth row is different in kind. One lineage measured that `border-radius: 10px` is already
identical across all twenty forms and proposed formalizing it. The other proposed a contextual
ladder, where a card, a tooltip, a swatch and a bar end each get their own step. Both land: the
ladder is the change, and tokens are what turn a claim about uniformity into something the
corpus check can assert.

**Key Decisions**: every number binds to the corpus formatter and never to a locale-dependent
one, the mono face is a system stack so the no-web-font rule holds, and the radius tokens
arrive with a check in the same phase rather than as an unenforced convention.

**Critical Dependencies**: phase 001 has to have closed with an operator answer on the stroke
weight, because the weight is a property of the same `.line` rule this phase touches in nine
files.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-03 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 7 |
| **Predecessor** | 001-visual-proof-and-forks |
| **Successor** | 003-motion-layer |
| **Handoff Criteria** | Every asset file carries the settled chrome, the radius ladder reads from tokens, and the corpus check passes with `--render` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the chart visual overhaul. Phase 001 answered what the chrome should look
like on one line form and one bar form. This phase is the twenty-nine file consequence of that
answer, and it is where a wrong call in phase 001 becomes expensive.

**Scope Boundary**: the asset tree at `.opencode/skills/sk-doc/sk-create-chart/assets/`, the
palette source, the corpus check and the two reference documents that describe chrome. The
catalog is out of scope, because the corrections it needs belong to phase 006.

**Dependencies**:
- Phase 001, closed, with a recorded stroke weight and a recorded glow verdict.
- The corpus check, which is the authoritative gate for every file this phase touches.

**Deliverables**:
- Twenty-nine asset files carrying the same chrome.
- A radius ladder expressed as tokens, with a check that fails a hand-typed radius.
- Two reference documents updated to describe what the corpus now does.

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Twenty templates were authored one at a time, and every one of them re-types the same chrome by
hand. `grep -n '^\.grid' assets/templates/*.html` returns ten identical declarations. The corner
radius returns twenty identical values. That duplication is invisible while nothing changes, and
it is the whole cost the moment something does.

It also makes a claim nobody can check. One lineage measured the radius as uniform across all
twenty forms and noted that the uniformity is unenforced. A convention that holds only because
twenty authors happened to agree is a convention that breaks on the twenty-first file, silently,
in a diff nobody reads closely.

### Purpose

Every file the corpus ships carries the same chrome, and the parts of that chrome that are meant
to be identical everywhere are identical because a check says so.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The five agreed chrome rows from phase 001, applied to every asset file that can carry them.
- The stroke weight and glow verdicts from phase 001, applied wherever the relevant rule appears.
- A radius ladder expressed as tokens, covering the card, the mark and any rounded surface the
  corpus draws.
- A bar-end radius on the outer visible edge of bar-family marks.
- The corpus check extended so a hand-typed radius fails the same way a hand-typed colour does.
- The two reference documents that describe chrome, updated to state what shipped.

### Out of Scope

- **Motion.** The reveal wipe and the bar growth are phase 003.
- **Interaction.** Tooltip, legend, hover dim and the hygiene pair are phase 004.
- **The dark theme.** A second media-scoped palette block is a contract amendment and it is phase 005.
- **The catalog.** The system reassignment, the gap prose, the type scale, the empty-data notice and the shared geometry defaults are phase 006.
- **Round tick dots in place of tick marks.** One lineage keeps this row, citing
  `src/registry/charts/echarts-line-chart.tsx:775` where the ECharts twin draws width-3 round
  tick dots. It is carried here rather than dropped, and it is not applied, because the corpus
  draws no tick marks at all. There is nothing to replace. If phase 006 adds tick marks, this row
  arrives with them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/*.html` | Modify | Twenty chart forms take the chrome and the radius tokens |
| `.opencode/skills/sk-doc/sk-create-chart/assets/examples/*.html` | Modify | Six family deliveries take the same chrome, so a delivery and a form still look alike |
| `.opencode/skills/sk-doc/sk-create-chart/assets/color/palette-sheet-*.html` | Modify | The three proof sheets, one of which is the skeleton every new form is copied from |
| `.opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json` | Modify | The radius ladder becomes source data rather than twenty typed values |
| `.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs` | Modify | A radius assertion, so the ladder is enforced rather than described |
| `.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md` | Modify | The skeleton section names the chrome block and the radius tokens |
| `.opencode/skills/sk-doc/sk-create-chart/references/color-system.md` | Modify | The role vocabulary gains the radius roles |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every asset file that draws a grid draws it dashed at `3 3` in a weakened rule colour, horizontal only |
| REQ-002 | Every asset file that prints a tick sets its ink to muted rather than to full strength |
| REQ-003 | Every printed number in the corpus is set in a system mono face with tabular figures, and every one of them is routed through the file's own formatter |
| REQ-004 | No file in the corpus calls `toLocaleString`, because a host-locale format breaks the rule that a delivered file looks the same on the machine that opens it |
| REQ-005 | The line family carries the two-weight dot language, and every area fill fades toward the baseline |
| REQ-006 | The radius ladder is expressed as tokens, and a radius typed directly into a stylesheet fails the corpus check |
| REQ-007 | `node scripts/check-corpus.cjs --render` prints `RESULT: PASSED` from the final state |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | Bar-family marks carry a two pixel radius on every edge that meets nothing and stay square on every edge that meets something, and a stacked segment gets it on the top segment. Written first as `the outer visible edge only`, which holds for a column, a row and a stack top. It does not hold for the two forms whose bars meet nothing at more than one edge, and AC-020 names both |
| REQ-009 | The two chrome reference documents describe what shipped, with no sentence left claiming the old behaviour |
| REQ-010 | Everything authored in this phase reports zero hard blockers under `hvr_scan.py` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.

### The rows this phase carries

Every path in the middle column resolves under
`specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/`. Every
path in the right column resolves under `.opencode/skills/sk-doc/sk-create-chart/`.

| Row | Change | Vendored evidence | Corpus target |
|-----|--------|-------------------|---------------|
| A1 | Grid dashed at `3 3` in a weakened rule colour, on the value axis only | `src/registry/charts/recharts-bar-chart.tsx:484-489`, `src/registry/charts/echarts-line-chart.tsx:775` | Thirteen `.grid` declarations, not the ten this row predicted: ten templates and three deliveries. On a form whose value axis runs across the page, such as `distribution-strip`, the grid runs down it |
| A1b | Tick text in muted ink rather than at full strength | `src/registry/ui/recharts-chart.tsx:112` | Every `.tick` declaration, at `assets/templates/daily-line.html:65` and its siblings |
| A2 | Every number in a system mono face with tabular figures, bound to the corpus formatter | `src/registry/ui/recharts-tooltip.tsx:152-156` | The body font stack at `assets/templates/daily-line.html:31` and its twenty-eight siblings, and the formatter at `:122` |
| A7 | A two-weight dot language, small dots with a surface-coloured ring on the emphasized point | `src/registry/ui/recharts-dot.tsx:83-116` | `assets/templates/daily-line.html:63`, `assets/templates/stacked-area.html` |
| A9 | Area fills fade toward the baseline rather than sitting at a flat opacity | `src/registry/charts/recharts-area-chart.tsx:766-768` | `assets/templates/daily-line.html:60`, `assets/templates/stacked-area.html`, `assets/templates/daily-range.html` |
| Radius ladder | A contextual ladder in place of one uniform corner, expressed as tokens | `src/app/globals.css:47-56` where one radius knob drives a calc ladder | `assets/color/palettes.json`, and twenty-nine `border-radius: 10px` declarations plus twenty-one `rx` literals across the whole asset tree |
| Bar-end radius | Two pixels on the outer visible edge of a bar | `src/registry/charts/recharts-bar-chart.tsx:45` and `:654-658`, `src/registry/charts/echarts-bar-chart.tsx:98` | `assets/templates/bar-columns.html`, `bar-rows.html`, `grouped-bars.html`, `stacked-bars.html`, `waterfall.html`, `progress-single.html` |

A2 carries a correction both lineages made and one lineage recorded as a reversal of its own
earlier finding. The vendored source formats values with `toLocaleString` at
`src/registry/ui/recharts-tooltip.tsx:152-156`. The corpus formatter at
`assets/templates/daily-line.html:122` fixes the grouping separator to a comma on purpose, strips
six-decimal dust and prints an em dash for a reading nobody took. It is stricter and it stays.
Only the visual treatment is adopted.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: MET. Zero across `assets/` whole, against a recorded before-count of 29 rather than the 20 written here. Twenty is the templates-only figure, and the six deliveries and the three proof sheets typed the same value.
- **SC-002**: MET. `RESULT: PASSED` with `radius: 58 assertion(s), 0 failure(s)`.
- **SC-003**: MET. Nothing, before or after.
- **SC-004**: MET, three times over. The rule reported 50 failures across the untouched corpus, then one per branch on a deliberately mutated file, and went green after each restore.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001's stroke weight answer | Nine `.line` rules cannot be finalised | The phase does not start until the decision record carries a disposition |
| Dependency | Headless Chrome for `--render` | No edit is provable across twenty-nine files | The corpus check names `CHROME_PATH` and the usual install paths |
| Risk | The palette block carries colour values only | A radius token may not belong inside the `CHART_PALETTE` sentinels | Two routes are planned. The phase picks one against the checker's behaviour rather than by preference |
| Risk | Mono advances are wider than sans advances | Label width estimates that count characters go wrong across twenty files | Re-render every file and read the axis labels, because the check does not look at the picture |
| Risk | A twenty-nine file edit passes structurally and draws nothing somewhere | An empty box reads as a pass | `--render` opens every file and asserts real elements in the figure region |
| Risk | A bar-end radius on a stacked segment leaks the segment below | Two data colours share a rounded edge | Only the top segment carries it, and the separator stroke contract already prevents colour sharing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Every touched file stays one document that opens with no build step and no network.
- **NFR-P02**: The mono face resolves from a system stack, so no web font is fetched and none is embedded.

### Reliability
- **NFR-R01**: The corpus check is the authority on whether an edit shipped correctly, and a failing run blocks the claim.
- **NFR-R02**: The radius assertion is proven able to fail before the phase claims it enforces anything.

### Maintainability
- **NFR-M01**: A chrome value that is meant to be identical everywhere lives in one place and is read, not re-typed.
- **NFR-M02**: A new form copied from the skeleton inherits the ladder without its author knowing the ladder exists.

---

## 8. EDGE CASES

### Data Boundaries
- A bar shorter than twice the radius: a two pixel corner on a three pixel bar renders as a lozenge rather than as a bar.
- A single-reading series in the line family: a fade gradient needs two stops and a one-point path has no length to fade along.

### Error Scenarios
- The radius check fires on the palette proof sheets, which are not chart forms: the check has to scope itself the way the catalog check already does.
- A file already using a radius the ladder does not define: that is a value to place on a rung rather than a value to keep.

### State Transitions
- Phase 001 answered one fork and not the other: the answered chrome may roll and the unanswered rule holds at its current value, because the two forks touch different declarations.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: 29 asset files plus the palette source, the checker and two references, Systems: 1 |
| Risk | 10/25 | Auth: N, API: N, Breaking: N, but the palette source is read by every file in the corpus |
| Research | 6/20 | The research is done. This phase applies its output |
| Multi-Agent | 4/15 | None dispatched |
| Coordination | 8/15 | Depends on phase 001's answer and hands off to phase 003 |
| **Total** | **48/100** | **Level 3** |

`recommend-level.sh --loc 1050 --files 33 --architectural --api` returns Level 3 at 83 of 100,
with a phase score of 40 of 50. The phase score clears the decomposition threshold, and this
folder stays undecomposed because it is already a child of a phase parent and its work is one
pass over one tree.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A chrome edit breaks a template silently, passing structure and drawing nothing | H | M | The render check opens every file and asserts real elements in the figure |
| R-002 | The radius ladder ships as a description rather than as an enforced rule | M | M | The check arrives in the same phase, and it is proven able to fail |
| R-003 | The mono face changes label metrics and collides labels somewhere in twenty files | M | H | Every file is re-rendered and read, because the check does not judge the picture |
| R-004 | A palette source change breaks every template's palette block at once | H | L | The check compares the block against the source in both directions and prints the exact block to paste |

---

## 11. USER STORIES

### US-001: Copying a form and inheriting the chrome (Priority: P0)

**As an** author starting a new chart form, **I want** the skeleton to carry the chrome and the radius ladder, **so that** I do not re-type twenty values and get one of them wrong.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Reading a deck of charts as one product (Priority: P0)

**As a** reader given four charts from this corpus, **I want** the grid, the tick ink, the number face and the corners to match, **so that** the set reads as one product rather than as four files.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Whether the radius tokens belong inside the `CHART_PALETTE` sentinels or beside them. The block is documented as the only place a colour value appears, and a length is not a colour.
- Which rungs the ladder actually needs. The vendored source ships four steps driven by one knob, and the corpus currently draws a card, a bar end and a legend swatch, which is three consumers.
- Whether the six family deliveries should track the templates automatically or be re-cut from them, given that a delivery carries real data a template does not.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Closure Gate**: See `acceptance-criteria.md`
- **Decision Records**: See `decision-record.md`
- **Durable Directive**: See `goal.md`
