---
title: "Implementation Plan: The interaction layer for the chart corpus"
description: "How the tooltip, the legend, the dim and the hygiene reach twelve template files without breaking the palette rule, the accessibility floor or the promise that two renders of one file agree."
trigger_phrases:
  - "chart interaction plan"
  - "chart tooltip recipe"
  - "per form interaction table"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: The interaction layer for the chart corpus

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Self-contained HTML5 templates with inline SVG and an inline script |
| **Framework** | None by contract. A template depends on nothing at runtime |
| **Storage** | None. Data is a literal array between the data sentinels |
| **Testing** | `scripts/check-corpus.cjs`, structural by default and browser-backed under `--render` |

### Overview

Three behaviours land, each on a named set of forms. A hover tooltip goes on the seven forms whose marks carry a value the picture cannot print. An in-figure legend goes on the four multi-series forms. A dim to 0.3 goes on the five forms where one series is worth isolating from the rest. Twelve files gain a pointer, and the same line of hygiene follows the pointer wherever it goes.

Nothing here is copied. The vendored source is read for the recipe and re-authored in the corpus idiom, because the packet's own rule forbids copying a fragment from an outside chart library and carves out nothing for licence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 003 closed, so the reduce-motion gate the tooltip transition sits behind already exists
- [x] The per-form table below is settled, including the `independent-percentages` question
- [x] Baseline corpus check captured before any edit

### Definition of Done
- [x] All acceptance criteria met
- [x] `check-corpus.cjs --render` prints `RESULT: PASSED` from the final state
- [x] The first-paint determinism proof is recorded with both render hashes
- [x] Docs updated (spec, plan, tasks, acceptance-criteria, goal)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A flat corpus of self-contained documents, checked by one script. Interaction does not change that. Each file gets its own handlers, its own overlay and its own state, because there is no shared runtime to put them in and the contract forbids adding one.

### The tooltip recipe

Every number below comes from the vendored tooltip card at `context/evilcharts/src/registry/ui/recharts-tooltip.tsx:86-92` and its value line at `:152-156`, re-expressed against the corpus palette roles.

| Property | Value | Why it is that value |
|----------|-------|----------------------|
| Minimum width | about 128px | Narrower and a two-line label wraps mid-word |
| Border | 1px at half the rule alpha, written `color-mix(in srgb, var(--chart-rule) 50%, transparent)` | A full-strength rule around a floating card reads as a second chart element |
| Text size | 12px | The corpus tick size is 11px, so the tooltip sits one step above the axis and below the labels |
| Value face | `ui-monospace, SFMono-Regular, Menlo, monospace` with `font-variant-numeric: tabular-nums` | Figures line up between rows, and a system stack keeps the web-font ban intact |
| Value source | the file's own `fmt` | The corpus formatter is fixed-comma and locale-independent, which the vendored source is not |
| Transition | 200ms, behind the reduce-motion preference | Matches the vendored follow delay at `recharts-tooltip.tsx:184-189`, and phase 003 owns the gate |

The value binding is the one correction both lineages converged on. The vendored card formats with `toLocaleString`, which reads the host locale, so a delivered file looks different on the machine that opens it. The corpus formatter already strips float dust and prints an em dash for a reading nobody took. Only the visual treatment is adopted.

### The legend recipe

From `context/evilcharts/src/registry/ui/recharts-legend.tsx:42-49` for the row and `:146-147` for the marker.

- A right-aligned row inside the drawing, above the plot area.
- One swatch per series at 8px square with a 2px corner radius, then the series name at the tick size.
- 4px between a swatch and its name, and a wider gap between entries.
- The subtitle sentence stays the caption. It keeps naming the time range and the argument, and it stops carrying the colour key.
- Each entry is a button rather than a label, because the key is also the control for the dim. A control a pointer can reach has to be reachable from a keyboard, so an entry carries `tabindex`, a button role and a pressed state, and answers Enter and Space as well as a click.

Three of the four forms already carried a key inside the figure and it was rebuilt to this
recipe rather than added. `parallel-axes` names each line where it ends and gained a swatch
beside that name instead of a detached row. Both readings are recorded in ADR-003.

### The dim recipe

From `context/evilcharts/src/registry/charts/recharts-line-chart.tsx:542-548` and `context/evilcharts/src/registry/charts/echarts-bar-chart.tsx:107-108`, which both settle on 0.3.

- Pointing at a series group, or at its legend entry, sets every other series group to 0.3 opacity.
- Clicking a legend entry latches the same state, and clicking it again clears it.
- Leaving the drawing clears the hover state, so no form is left permanently dimmed.

### The hygiene line

From `context/evilcharts/src/app/globals.css:318-337`, scoped down to one declaration.

```css
.figure svg :focus:not(:focus-visible) { outline: none; }
```

The focus half is adopted in the form `:focus-visible` makes possible: the ring is dropped for a reader who clicked and kept for a reader who tabbed, so nothing reachable by keyboard loses its indicator. The text-selection half is dropped outright. `user-select: none` would stop a reader copying a value out of a delivered chart, and the numbers in a delivered chart are meant to be copyable. ADR-002 records the reasoning and what it costs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is the table the phase is judged on. Every one of the twenty forms is listed, and the eight that gain nothing carry the reason.

| id | family | tooltip | legend | dim | hygiene | Reason |
|----|--------|---------|--------|-----|---------|--------|
| `bar-rows` | comparison | no | no | no | no | Each bar already prints its value at the bar end |
| `bar-columns` | comparison | no | no | no | no | Each column already prints its value above the column |
| `grouped-bars` | comparison | no | yes | yes | yes | Two series across categories. Its key was already in the figure and was rebuilt to the recipe, per ADR-003 |
| `unit-grid` | composition | no | no | no | no | Every part already carries its own label beside its block, so there is no detached key to bring inside the figure |
| `unit-ring` | composition | no | no | no | no | Every group already carries its count beside its label |
| `stacked-bars` | composition | no | yes | yes | yes | Segments share an edge, so isolating one stack layer is the reading the form needs. Its key was already in the figure and was rebuilt to the recipe |
| `independent-percentages` | composition | no | no | no | no | Settled by ADR-001. Five independent measures, each already naming itself in the gutter and printing its own value. Colour marks the emphasised row rather than an identity, so there is no key to bring inside the figure |
| `treemap` | composition | yes | no | no | yes | About thirty leaves, and a small cell has no room for a label |
| `daily-line` | time | no | no | yes | yes | One series plus an emphasised point, and the dim is what separates the emphasis from the rest |
| `daily-range` | time | no | no | no | no | The minimum and the maximum are both already printed per day |
| `calendar-grid` | time | yes | no | no | yes | Three hundred and sixty-five cells, none of which can carry a label |
| `waterfall` | time | no | no | no | no | Every step already prints its signed value and the running total |
| `progress-single` | time | no | no | no | no | One value against one goal, both printed |
| `candlestick` | time | yes | no | no | yes | Four values per period, and printing all four per period is unreadable |
| `stacked-area` | time | no | yes | yes | yes | Two to five bands, and the band under the pointer is the reading. Its key was already in the figure and was rebuilt to the recipe |
| `distribution-strip` | distribution | yes | no | no | yes | Tens to a few hundred dots, one record each |
| `box-plot` | distribution | yes | no | no | yes | A five-number summary per group, which no picture prints in place |
| `scatter` | relationship | yes | no | no | yes | Two dimensions per point and no room for a pair of labels per mark |
| `parallel-axes` | relationship | no | yes | yes | yes | One line per entity across several axes, and tracing one line is the whole reading. Its key stays at the line ends and gained a swatch there rather than a detached row |
| `heat-matrix` | matrix | yes | no | no | yes | Up to one hundred cells shaded by value, with the value nowhere in the picture |

Counts the verification depends on: tooltip 7, legend 4, dim 5, hygiene 12, untouched 8. The legend and hygiene counts each dropped by one when ADR-001 settled `independent-percentages`, which is the outcome section 10 of the spec predicted for that reading.

Required inventories:
- Producers of interaction: `grep -l 'data-chart-tooltip\|data-chart-legend\|data-chart-dim' assets/templates/*.html`, checked against the exact file names above rather than against a count, because a count passes on any four files.
- Consumers of the formatter: `grep -o 'fmt(' assets/templates/*.html | wc -l`, run before and after, so a tooltip that formats its own number is visible in the diff. Occurrences rather than matching lines: one call site was split across two lines when the box plot's five readings became five rows, and a line count reads that as a rise nobody made.
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
| Structural | Every template and palette sheet against the fourteen contract rules | `node scripts/check-corpus.cjs` |
| Rendered | Every file opened headless, figure region asserted non-empty | `node scripts/check-corpus.cjs --render` |
| First-paint determinism | Two headless renders of one file with no pointer input, compared byte for byte after the script has run | The render pass, plus a recorded hash of the figure region |
| Manual | Hovering, tapping and tabbing each interactive form in a browser | The manual testing playbook that already covers this mode |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003, the motion layer | Internal | Yellow | The tooltip transition has no reduce-motion gate to sit behind, and the phase ships motion twice |
| Headless Chrome for `--render` | External | Green | Template edits cannot be proven, so none may be applied |
| `check-corpus.cjs` | Internal | Green | No gate, so no template edit is claimable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the corpus check fails on a file this phase touched, and the failure repeats on the same file across runs.
- **Procedure**: restore the affected template from the copy kept beside the work, not from git. Every change here is an uncommitted working-tree edit, so `git checkout -- <file>` would restore the last commit and throw away the phase along with the failure. Keep a copy before mutating anything, and put the copy back.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (baseline, per-form table) ──► Tooltip ──┐
                                               ├──► Hygiene ──► Verify
                                    Legend ────┤
                                    Dim ───────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 003 | Tooltip, Legend, Dim |
| Tooltip | Setup | Hygiene |
| Legend | Setup | Dim, Hygiene |
| Dim | Legend | Hygiene |
| Hygiene | Tooltip, Dim | Verify |
| Verify | Hygiene | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and baseline | Low | 20 minutes |
| Tooltip across seven forms | Medium | 2 hours |
| Legend across four forms | Medium | 1 hour |
| Dim across five forms | Low | 40 minutes |
| Hygiene and contract text | Low | 30 minutes |
| Verification and the determinism proof | Medium | 1 hour |
| **Total** | | **about 5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline corpus check captured before any edit, with its `RESULT:` line read
- [x] The painted picture of every interactive form captured from the committed state, which is what the before-and-after comparison reads
- [x] Nothing committed, so the working tree is the only state to revert, and the only state a careless restore can destroy

### Rollback Procedure
1. Identify the failing file from the `RESULT:` block of the corpus check.
2. Copy the affected template aside before touching it, and restore it from that copy. Never from `git checkout --`: the phase is uncommitted, so a checkout restores the last commit and takes the work with it.
3. Re-run `node scripts/check-corpus.cjs --render` and read the `RESULT:` line.
4. Record the reverted change in the implementation summary as not applied, with the reason.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---

## 8. AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirm the baseline corpus check was captured before any template edit, and its `RESULT:` line read.
- [ ] Confirm the per-form table above is settled, so no form gains a pointer by accident.
- [ ] Confirm every recipe value about to be applied opens at the vendored line it cites.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Build the tooltip on one form and prove it before it reaches the other six. A recipe applied seven times before it is checked once is seven reverts. |
| TASK-SCOPE | Edits stay inside the twelve named templates and `references/template-contract.md`. `scripts/check-corpus.cjs` belongs to phase 007. |
| TASK-GATE | No template edit is claimed until `node scripts/check-corpus.cjs --render` prints `RESULT: PASSED` from the state that includes it. |
| TASK-COLOUR | A tooltip, a swatch or a dim value never introduces a colour literal. Everything reads a palette role, and a derived value goes through `color-mix`. |

### Status Reporting Format

Report phase status as: `Phase 004 status <Planned|Applying|Complete>, tooltip N/7, legend M/4, dim K/5, gate <PASSED|FAILED>`.

### Blocked Task Protocol

A render failure on the same file across repeated runs is a chart drawing nothing, and it blocks the claim until the template is fixed or reverted. A different file each run is the headless browser, and it is retried rather than fixed. A `determinism` failure is never worked around by relaxing the check. If a handler genuinely needs a source the rule bans, the phase stops and the question goes to the operator.
