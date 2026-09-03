---
title: "Acceptance Criteria: Roll the settled chrome across the whole chart corpus"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/053-chart-visual-overhaul/002-chrome-rollout"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Filled every row with the evidence observed from the final state"
    next_safe_action: "Hand phase 003 the motion layer on a settled corpus"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json"
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-002-chrome-rollout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No number is formatted by the host locale"
      - "The mono face is a system stack"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Roll the settled chrome across the whole chart corpus

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/053-chart-visual-overhaul/002-chrome-rollout
**Level:** 3
**Status:** Complete
**Date:** 2026-09-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

Every command below runs from the repository root. `CHART` stands for
`.opencode/skills/sk-doc/sk-create-chart`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the grid-bearing files draw a solid grid, When A1 rolls out, Then every one of them draws it dashed at `3 3` in a weakened rule colour | `grep -rl '^\.grid.*stroke-dasharray' $CHART/assets/` lists 13 files and `grep -rn '^\.grid' $CHART/assets/ \| grep -vc 'stroke-dasharray'` returns 0, against a recorded before-count of 2 dashed and 11 solid. The row said ten grid-bearing files, which is the templates-only count. The tree holds thirteen, because three deliveries draw a grid too | Met | - |
| AC-002 | REQ-002 | Given tick ink sits at full strength, When A1b rolls out, Then every `.tick` declaration reads muted | All 14 `.tick` colour declarations read `fill: var(--chart-muted)`, and all 14 already did before this phase. The row was satisfied on arrival: no file in the corpus ever drew a tick at full strength, so A1b reached nothing and changed nothing | Met | - |
| AC-003 | REQ-003 | Given every asset file sets one sans stack, When A2 rolls out, Then every printed number is set in a system mono face with tabular figures | `grep -rl 'ui-monospace' $CHART/assets/ \| wc -l` returns 29, against a recorded before-count of 2, and `find $CHART/assets -name '*.html' \| wc -l` returns 29 | Met | - |
| AC-004 | REQ-004 | Given the corpus formatter is locale-independent on purpose, When the mono treatment lands, Then no file calls a locale-dependent formatter | `grep -rn 'toLocaleString' $CHART/assets/` returns nothing, before and after. The row was satisfied on arrival | Met | - |
| AC-005 | REQ-003 | Given the formatter owns every printed figure, When the face changes, Then the rendered labels change only in face | Every file was rendered twice in headless Chrome, from the committed version and from the working tree, dumping every SVG text node and table cell in document order. `diff -r` over the 29 pairs reports no difference. Evidence: `scratch/acceptance-evidence.txt` | Met | - |
| AC-006 | REQ-005 | Given the line family draws one mark weight, When A7 rolls out, Then it carries small dots and a surface-ringed dot on the headline point | Superseded. The row named `stacked-area.html`, which draws no marks at all, so there is no one-weight dot language there to make two-weight. AC-019 names the files that draw a line | Superseded | ADR-006 |
| AC-007 | REQ-005 | Given area and band fills sit at flat opacity, When A9 rolls out, Then each fades toward the baseline | Superseded. The row named `daily-range.html`, which draws range bars rather than an area, and `stacked-area.html`, whose band fills carry the magnitude the palette gates rank by lightness. AC-018 names the files that draw an area | Superseded | ADR-006 |
| AC-008 | REQ-006 | Given every file types `border-radius: 10px`, When the ladder ships, Then none of them does | `grep -rho 'border-radius: 10px' $CHART/assets/ \| wc -l` returns 0, against a recorded before-count of 29 in `scratch/counts-before.txt`. The row said 20, which is the templates-only count. The tree holds 29, because the six deliveries and the three proof sheets each typed it too | Met | - |
| AC-009 | REQ-006 | Given a convention nothing checks is a wish, When the ladder ships, Then the corpus check asserts it | `node $CHART/scripts/check-corpus.cjs` prints `+ radius: 58 assertion(s), 0 failure(s)` | Met | - |
| AC-010 | REQ-006 | Given a validator that has only ever passed is not evidence, When a template is mutated to type its own corner, Then the check goes red | Three observations in `scratch/radius-negative.txt`. On the untouched corpus the new rule reported 50 failures before any file was fixed. On the finished corpus, a `border-radius: 12px` typed into `bar-columns.html` produces `RESULT: FAILED` naming `radius`, and an `rx: 2` typed into its drawing code does the same through the other branch. Both were restored from a kept copy rather than with `git checkout --`, which reverts to the last commit and silently discards uncommitted work. The run after each restore prints `RESULT: PASSED` | Met | - |
| AC-011 | REQ-008 | Given bar marks draw square corners, When the mark rung lands, Then bar-family marks carry a two pixel radius on the outer visible edge only | Superseded. The row's verification looked for `rx=`, and an `rx` rounds all four corners of a rect, which is the opposite of the requirement it was meant to check. AC-020 verifies the requirement itself | Superseded | ADR-006 |
| AC-012 | REQ-007 | Given twenty-nine files were edited, When the corpus check runs with `--render` from the final state, Then it prints `RESULT: PASSED` | `node $CHART/scripts/check-corpus.cjs --render` prints `RESULT: PASSED` and `Summary: errors: 0`, with `render: 29 assertion(s), 0 failure(s)`. Capture: `scratch/validator-after.txt` | Met | - |
| AC-013 | REQ-007 | Given the check does not judge the picture, When the rollout finishes, Then every file is opened and its labels read | Two passes, recorded in `scratch/acceptance-evidence.txt`. A getBBox probe over all 29 files found three overlapping label pairs, all three present identically before the change and two of them an artefact of a rotated axis name. All 29 were then rendered to PNG and read, which found one real defect and fixed it | Met | - |
| AC-014 | REQ-009 | Given two reference documents describe chrome, When the rollout finishes, Then neither still claims the old behaviour | `references/template-contract.md` §3 shows the block a new form carries, §6 explains where a corner comes from and rule 15 is in the table, which is now headed THE FIFTEEN RULES. `references/color-system.md` §3 lists the corner roles beside the colour roles and §6 names the new enforcement | Met | - |
| AC-015 | REQ-001 | Given the skeleton is what a new form is copied from, When the rollout finishes, Then it carries everything the templates carry | `assets/color/palette-sheet-neutral.html` passes every check the twenty forms pass in the same run, and it was the last file the rollout touched | Met | - |
| AC-016 | REQ-009 | Given one chrome row is carried without being applied, When the phase closes, Then its reason is written down | ADR-004 in `decision-record.md` records the round tick dots row, its vendored evidence and why the corpus has nothing to replace | Met | ADR-004 |
| AC-017 | REQ-010 | Given this phase authored prose, When it is scanned, Then it reports zero hard blockers | `python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <file>` reports no hard blocker on each document in this folder | Met | - |
| AC-018 | REQ-005 | Given a fill sits under a mark that carries the value, When A9 rolls out, Then it fades toward the baseline | `grep -rl 'linearGradient' $CHART/assets/` returns `daily-line.html` and `orders-after-the-price-change.html`, and each paints its stops from `--chart-series-1` at 0.18 down to 0. `daily-range` and `stacked-area` are out of the row's reach and ADR-006 says why | Met | - |
| AC-019 | REQ-005 | Given the line family draws one mark weight, When A7 rolls out, Then it carries a dot at every reading and a surface-ringed dot on the headline point | `daily-line.html` and `orders-after-the-price-change.html` each draw a `.dot` per finite reading at r 2.5 and a `.mark` at r 5 carrying `stroke: var(--chart-surface); stroke-width: 2`. Both were read as rendered images | Met | - |
| AC-020 | REQ-008 | Given bar marks draw square corners, When the mark rung lands, Then a bar rounds only the edge that meets nothing | Five of the six named forms build their bar as a path: `bar-columns`, `grouped-bars` and the top segment of `stacked-bars` round the end away from the baseline, `bar-rows` rounds the end away from the axis, and `waterfall` rounds the top of a total bar while a floating step bar takes all four corners from CSS. The delivery `staff-hours-by-service` matches `bar-rows`. `progress-single` is the sixth and is a pill: its track and fill share the `pill` rung at both ends, because that bar meets a track rather than a baseline. Each was read as a rendered image | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes.

Every row is `Met` or `Superseded`, and each of the three superseded rows names ADR-006, which
exists in `decision-record.md`.

The three supersessions are the phase's real finding, and none of them is a criterion made easier.
Each named a file against a change that file cannot carry: an area fade for a form that draws range
bars, a dot language for a form that draws no marks, and an `rx` attribute to verify a requirement
that an `rx` attribute cannot satisfy, because it rounds all four corners and the requirement is
one edge. The replacements are narrower in the files they name and stricter in what they check.

AC-010 is the row that mattered. The new radius rule was watched failing three separate times
before it was trusted: once across the untouched corpus, where it reported fifty hand-typed corners,
and once through each of its two branches on a deliberately mutated file. It went green again after
each restore.

Two rows, AC-002 and AC-004, were satisfied before the phase began. They are recorded as met with
that stated plainly rather than presented as work.

<!-- /ANCHOR:closure -->
