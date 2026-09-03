---
title: "Feature Specification: Prove the chrome on two forms and settle the weight and glow forks"
description: "The agreed static chrome goes onto one line form and one bar form, then the two changes the research lineages contradicted each other on are rendered side by side so the operator chooses by looking. Nothing rolls out until that answer arrives."
trigger_phrases:
  - "chart chrome proof"
  - "stroke weight fork"
  - "chart glow fork"
  - "chart visual decision record"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Prove the chrome on two forms and settle the weight and glow forks

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress. Chrome and the weight comparison shipped, ADR-001 awaiting the operator |
| **Created** | 2026-09-03 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 7 |
| **Predecessor** | None |
| **Successor** | 002-chrome-rollout |
| **Handoff Criteria** | The operator has answered both forks against rendered evidence, and two templates carry the settled chrome with the corpus check green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Twenty templates share one visual register, so any chrome change is a twenty-file change. Rolling
a change across all twenty and then discovering the operator dislikes it costs twenty reverts and
buys nothing. The research also left two changes genuinely undecided. One lineage ranks thinning
the series stroke from two pixels to 0.8 as the highest-payoff change in its list. The other
rejects the same change outright. A glow layer behind the emphasis line splits them the same way.

Neither fork can be settled by reading source, because both are questions of taste about a
deliberate choice. Argument has already been tried across nine research iterations and it
produced two confident answers pointing in opposite directions.

One thing the corpus itself says is worth recording. `assets/templates/daily-line.html:101` reads
"A hairline is the right weight here", while `assets/templates/daily-line.html:61` sets
`stroke-width: 2`. No file in the packet writes down why two pixels was chosen. The comment and
the value disagree, and that disagreement is part of what the render has to settle.

### Purpose

Two templates carry the agreed chrome and render correctly, and the operator has chosen a stroke
weight and a glow verdict by looking at the same chart drawn both ways.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The agreed static chrome applied to exactly two templates: `daily-line.html` as the line form
  and `bar-columns.html` as the bar form.
- A rendered comparison for the stroke weight fork, at the three weights the research named.
- ~~A rendered comparison for the glow fork, at one low-opacity layer against no layer.~~
  Superseded by ADR-002. The operator cut the glow on 2026-09-03 before the sheet was built,
  so nothing is rendered for it.
- A decision record that carries both forks, the losing argument intact, and the operator's
  answer once it arrives.

### Out of Scope

- The other eighteen templates, the six family deliveries and the skeleton. Those are phase 002,
  and holding them back is the point of doing this phase first.
- Motion of any kind. The reveal wipe and the bar growth are phase 003.
- Hover, tooltip, legend and dim. Those are phase 004.
- The four-layer glow stack the vendored source ships. Both lineages reject the stack, and only
  a single layer is on the table.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/daily-line.html` | Modify | Chrome proof on the line form, and the subject of both forks |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-columns.html` | Modify | Chrome proof on the bar form |
| `decision-record.md` | Create | The two forks, their evidence and the operator's answer |
| `scratch/forks/` | Create | The rendered variants the operator compares |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The five agreed chrome rows below are applied to the two named templates and to nothing else |
| REQ-002 | The stroke weight fork renders as one comparison sheet holding the same data at 2px, 1px and 0.8px. Every weight comes from a source: 2px is what the corpus draws today at `assets/templates/daily-line.html:61`, and 1px and 0.8px are the two ends of the range the adopting lineage proposed, whose lower end is the vendored constant at `src/registry/charts/recharts-line-chart.tsx:56` |
| REQ-003 | ~~The glow fork renders as one comparison sheet holding the same data with a single low-opacity layer and without it~~ Superseded by ADR-002: the operator rejected the glow outright, so there is nothing to compare |
| REQ-004 | Every edit passes `node scripts/check-corpus.cjs --render` from the final state |
| REQ-005 | No chrome value is copied from the vendored source. Each is re-implemented against the corpus custom properties |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The decision record carries both losing arguments in full, so neither fork is relitigated later |
| REQ-007 | Everything authored in this phase reports zero hard blockers under `hvr_scan.py` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.

### The five agreed chrome rows

Each row carries the vendored evidence and the corpus file it changes. Every path in the middle
column resolves under
`specs/sk-doc/051-sk-create-chart/008-evilcharts-reference-research/context/evilcharts/`, and
every path in the right column resolves under `.opencode/skills/sk-doc/sk-create-chart/`.

| Row | Change | Vendored evidence | Corpus target |
|-----|--------|-------------------|---------------|
| A1 | Grid dashed at `3 3`, drawn in a weakened rule colour, horizontal only | `src/registry/charts/recharts-bar-chart.tsx:484-489`, `src/registry/charts/echarts-line-chart.tsx:775` | `assets/templates/daily-line.html:62`, `assets/templates/bar-columns.html:62` |
| A1b | Tick text in muted ink rather than at full strength | `src/registry/ui/recharts-chart.tsx:112` | `assets/templates/daily-line.html:65`, `assets/templates/bar-columns.html:64` |
| A2 | Every number in a system mono face with tabular figures, bound to the corpus formatter | `src/registry/ui/recharts-tooltip.tsx:152-156` | `assets/templates/daily-line.html:31` and `:122`, `assets/templates/bar-columns.html:31` and `:120` |
| A7 | A two-weight dot language, small dots with a surface-coloured ring on the emphasized point | `src/registry/ui/recharts-dot.tsx:83-116` | `assets/templates/daily-line.html:63` |
| A9 | The area fill fades toward the baseline rather than sitting at a flat opacity | `src/registry/charts/recharts-area-chart.tsx:766-768` | `assets/templates/daily-line.html:60` |

A2 carries a correction both lineages made. The vendored source formats values with
`toLocaleString`, which is host-locale dependent. The corpus formatter at
`assets/templates/daily-line.html:122` is stricter and stays. Only the visual treatment is
adopted, and the mono stack is a system stack so the no-web-font rule still holds.

A1b is not a lineage row on its own. It is the tick half of the same one-pass restyle the
`glm-flash-xhigh` lineage ranked first, and it is listed separately here because it touches a
different CSS rule than the grid.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render` prints `RESULT: PASSED` from the final state.
- **SC-002**: `git diff --name-only` over the packet lists exactly two template files.
- **SC-003**: The weight comparison sheet exists under `scratch/forks/` and opens in a browser with no install step. The glow sheet is superseded by ADR-002.
- **SC-004**: `decision-record.md` carries an ADR per fork, each holding both arguments and a disposition field.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Headless Chrome for `--render` | No edit can be proven, so none may be applied | The corpus check names `CHROME_PATH` and the usual install paths |
| Dependency | The operator's answer | Phase 002 cannot start | The phase stops and reports rather than picking a default |
| Risk | A comparison sheet is a gallery | A gallery carries every variant's demo data and is not a deliverable | The sheets live in `scratch/` and are never presented as chart output |
| Risk | The mono stack changes label widths | A width estimate that counts characters at a sans advance goes wrong | Re-render both templates and read the axis labels rather than trusting the check |
| Risk | The chrome edits pass structurally and draw nothing | A silent empty box reads as a pass | `--render` asserts real elements inside the figure region |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A touched template stays one file that opens with no build step and no network.
- **NFR-P02**: A dashed grid and a gradient fill add no runtime cost beyond the existing paint.

### Security
- **NFR-S01**: No content enters the packet from the vendored source. Every value is re-typed against the corpus custom properties.

### Reliability
- **NFR-R01**: The corpus check is the authority on whether an edit shipped correctly, and a failing run blocks the claim.
- **NFR-R02**: Two renders of a touched template agree, because nothing added here reads the clock or a random source.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A series with a single reading: the fade gradient still needs two stops, and a one-point path has no length to fade along.
- A value wide enough to collide with its neighbour once the mono face lands: mono advances are wider than the sans advances the current spacing was tuned against.

### Error Scenarios
- The render check fails on a different file each run: that is the headless browser rather than the corpus.
- The render check fails on the same file every run: that is a chart drawing nothing, and it blocks the claim.

### State Transitions
- The operator answers one fork and not the other: the answered one may proceed into phase 002 and the other holds, because the two forks touch different CSS rules.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | Files: 2 templates plus a decision record and a scratch render set, Systems: 1 |
| Risk | 6/25 | Auth: N, API: N, Breaking: N, two files inside a checked corpus |
| Research | 4/20 | The research is done. This phase renders its output rather than extending it |
| **Total** | **23/70** | **Level 2** |

`recommend-level.sh --loc 300 --files 12 --architectural` returns Level 2 at 57 of 100, with a
phase score of 10 of 50. The phase score is below the decomposition threshold, which is correct:
this is a child phase and it is not decomposed further.
<!-- /ANCHOR:complexity -->

---

## 7. OPEN QUESTIONS

- Which stroke weight the operator picks, and whether the answer differs between the line form and the bar form.
- ~~Whether a single glow layer survives a print test.~~ Answered on 2026-09-03: the operator cut the glow because a delivered chart is often printed and a blur reads as a smudge. Recorded as ADR-002.
- Whether the ring on the emphasized point should use the surface token or the card ground, which differ when a chart is embedded rather than delivered whole.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Closure Gate**: See `acceptance-criteria.md`
- **Durable Directive**: See `goal.md`
