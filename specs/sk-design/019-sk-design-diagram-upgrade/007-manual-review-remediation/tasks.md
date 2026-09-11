---
title: "Tasks: Phase 7: manual-review-remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: manual-review-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [P] Confirm the pre-remediation baseline: run `node scripts/check-diagram-corpus.cjs`, confirm `RESULT: PASSED`, and spot-check that the line numbers this phase's tasks cite still match the live files (D16) (scripts/check-diagram-corpus.cjs) — check: the printed `RESULT: PASSED` line; a diff-free spot check against `template-full.html:181`, `example-timeline.html:82-116`, `example-er.html:79`
- [ ] T002 [P] Read `scripts/color-gates.cjs`'s exported functions and `assets/color/diagram-palette.json`'s role tables for all three skins, so every colour-lane fix (F17, F22, F23, F30) resolves to an existing role rather than a new literal (D1) (scripts/color-gates.cjs, assets/color/diagram-palette.json) — check: a `node -e` print of the exported function names and the light/dark/terminal role counts
- [ ] T003 [P] Snapshot `grid-baseline.json`'s current per-file counts, the ceiling this phase's fixes must not raise (D5) (scripts/families/grid-baseline.json) — check: a copied snapshot, compared against the same file after T040's post-fix run
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Dispatched in seven lanes, per `plan.md` §3: the P1 pair first, then six thematic lanes covering
the 28 P2s and 4 P3-numbered findings. Each lane is one conductor-composed brief to DeepSeek V4.1
Flash at max thinking, via cli-pi and llmgateway (D15); verification of every lane's output is the
conductor's own step below, never the executor's.

**P1 fixes (F1, F2)**

- [ ] T004 Fix F1 and F3 together in `templates/template-full.html`: the last legend row draws below the `viewBox="0 0 1000 700"` (`:359-360`) and the whole legend block starts at `y="544"` though the file's own comment (`:328-331`) states it should start at `y="682"` — move the legend block to start at `y="682"` and extend the `viewBox` to `0 0 1000 720`, so every row, including "Security group," renders fully outside the AWS REGION boundary (F1; F3) (assets/templates/template-full.html) — check: re-render, confirm all ten legend rows are visible and sit below the dashed boundary; `grep -n viewBox` shows the extended height
- [ ] T005 Fix F2 in `examples/example-timeline.html`: the five event `cx` values (100, 240, 500, 740, 900 at `:90,96,102,109,116`) run 52-70 px/month against a caption claiming proportional spacing, and the JAN '26 year tick (`x="680"`, `:82`) sits 60 px from the JAN 2026 event (`x="740"`) — rescale every event to one px/month value from `x=100` (14 months → 57.14 px/month: `cx` = 100, 214, 500, 729, 900) and move the year tick to `x="729"` to match (F2) (assets/examples/example-timeline.html) — check: recompute px/month between each adjacent pair from the new `cx` values, confirm all four gaps equal; re-render and confirm the tick and the event align

**Geometry-and-overdraw lane (F4, F5, F6, F7, F9, F10, F11, F13, F18)**

- [ ] T006 [P] Fix F4 in `examples/example-er.html`: the Tag→ArticleTag line (`:79`, 32 px tall) is entirely covered by its own two cardinality masks (`:94,97`) and renders as nothing — lengthen the line to `y1="248" y2="288"`, move the ArticleTag box to `y="288"`, and shift both masks to `x="888"` so they sit beside the line (F4) (assets/examples/example-er.html) — check: re-render, confirm a visible connector with its "1"/"N" labels beside it, not on it
- [ ] T007 [P] Fix F5 in `examples/example-architecture.html`: the Astro Origin node (`x="416" width="160"`, `:129`) overpaints the leading 8-12 px of the `READ MDX` (`:105`) and `QUERY` (`:108`) label masks — move both labels clear of the node (`x="584" width="60"` / text `x="614"` for `READ MDX`; `x="584" width="44"` / text `x="606"` for `QUERY`) (F5) (assets/examples/example-architecture.html) — check: re-render, confirm neither label's leading glyph is clipped
- [ ] T008 [P] Fix F6 in `examples/example-architecture.html`: the `RESP` label mask (`:99`, `y="278" height="12"`) crosses the dashed return line at `y=288` (`:93`), erasing the shaft from x=172 to 204 — raise the mask to `y="272"` and its text to `y="281"`, matching the `HTTPS` label above it (F6) (assets/examples/example-architecture.html) — check: re-render, confirm one continuous dashed arrow from x=220 to the x=168 arrowhead
- [ ] T009 [P] Fix F7 in `examples/example-gantt.html`: zone 2 (`y="172" height="120"`, `:43`) ends at y=292 but the focal `Design review` bar (`y="272" height="24"`, `:106-107`) extends to y=296, breaking the zone's own border by 4 px — set zone 2's `height="132"` so it ends at y=304, matching zone 3's 4 px clearance (F7) (assets/examples/example-gantt.html) — check: re-render, confirm the bar sits fully inside its zone with zone 3's clearance
- [ ] T010 [P] Fix F9 in `examples/example-layers.html`: L3's band (`fill="#f5f5f5"`, `:98`) matches the page paper exactly and L1/L2 (`:105,112`) share one fill with no divider, so five layers render as four bands — add `stroke="rgba(45,49,66,0.12)" stroke-width="1"` to all four bands (`:84,98,105,112`) and step L2 to `#ececec` / L1 to `#e4e4e4` (F9) (assets/examples/example-layers.html) — check: re-render, confirm five visually distinct, bordered bands
- [ ] T011 [P] Fix F10 in `examples/example-tree.html`: `polish` (`x="60" width="160"`) and `critique` (`x="220" width="160"`, `:127,133`) touch at x=220, reading as one double-wide box, while every other sibling pair keeps a 20 px gap — set `polish`'s box and text to `x="40"` (shifting its text −20) to restore the gap (F10) (assets/examples/example-tree.html) — check: re-render, confirm the same 20 px gap as the `review` sibling pair
- [ ] T012 [P] Fix F11 in `examples/example-venn.html`: the Feasible circle's arc crosses `WE CAN BUILD IT` at its sublabel baseline (`:97-98`), and the mirrored Viable arc crosses `BUSINESS SUSTAINS` (`:101-102`) — move both sublabels inward (`x="360"` and `x="640"`) clear of their circles' arcs (F11) (assets/examples/example-venn.html) — check: re-render, confirm neither sublabel is crossed by a circle outline
- [ ] T013 [P] Fix F13 in `examples/example-import-mermaid.html`: the Postgres node (`y="384" height="56"`, `:58`) straddles the CORE SERVICES zone's bottom edge (y=416), 32 px inside and 24 px outside — move it to `y="344"` (text baselines to 368/384), leaving 16 px clearance inside the zone (F13) (assets/examples/example-import-mermaid.html) — check: re-render, confirm the node sits entirely inside the CORE SERVICES boundary
- [ ] T014 [P] Fix F18 in `examples/example-high-level.html`: all four source connectors turn vertical at `x=164` (`:110-113`), the same x as the Kubernetes boundary's own left border (`:100`), running on top of it in a darker stroke for up to 152 px — move the shared riser to `x=172` in all four `Q`/`V` commands (F18) (assets/examples/example-high-level.html) — check: re-render, confirm the four connectors read as a bus inside the cluster, separable from the boundary's edge

**Legend-fidelity lane (F3, F12, F14, F15)**

- [ ] T015 Fix F3 (already-satisfied by T004): confirm `templates/template-full.html`'s legend, moved in T004, now starts at `y="682"` outside the dashed AWS REGION boundary as the file's own comment (`:328-331`) specifies (F3) (assets/templates/template-full.html) — check: re-render and confirm the legend visually reads as separate from the region box; this task makes no additional edit beyond T004's
- [ ] T016 [P] Fix F12 in `examples/example-scatter.html`: the `DEPLOYS PER WEEK` axis title (`y="492"`, `:39`) sits below the `LEGEND` heading (`y="478"`, `:128`) and reads as a fourth legend entry — move it to `y="452"`, under the x tick labels and above the legend rule, keeping it centred at `x="520"` (F12) (assets/examples/example-scatter.html) — check: re-render, confirm the axis title sits with the tick labels, not among the legend entries
- [ ] T017 [P] Fix F14 in `examples/example-swimlane.html`: the revision connector (`y1="224" y2="256"`, `stroke-dasharray="5,4"`, `:97`) is 32 px long with its `REVISE` label mask covering the middle, so the dash pattern does not read, and the legend swatch (`:164`) uses a different pattern (`4,3`) — lengthen the connector to `y1="220" y2="268"` (moving `Polish copy` down 12) and set the legend swatch to `stroke-dasharray="5,4"` (F14) (assets/examples/example-swimlane.html) — check: re-render, confirm the connector's dash pattern is visible and matches the legend swatch exactly
- [ ] T018 [P] Fix F15 in `examples/example-org-chart.html`: the legend's "needs setup / gap" entry (`stroke="#7a8399" stroke-dasharray="4,4"`, `:44`) matches no node in the drawing, only the prose note bar (`:42`) — apply the dashed treatment to the specialists the note names, or drop the legend entry and the subtitle's "setup gaps" claim if the drawing does not draw them (F15) (assets/examples/example-org-chart.html) — check: re-render, confirm every legend entry keys at least one real element in the drawing

**Colour-and-contrast lane (F17, F19, F22, F23, F24, F30)**

- [ ] T019 [P] Fix F17 in `examples/example-dp-security-matrix.html`: the four cell fills (`.full`, `.write`, `.read`, `.none`, `:19`) are indistinguishable to the eye, and `.value.none-text{fill:#7a8399}` (`:20`) carries the matrix's data at 3.48:1, below the recorded "structural use only" limit — step the fills apart (e.g. `.full` to `rgba(45,49,66,.16)`, `.read` to `rgba(79,93,117,.09)`, add a dash or diagonal to `.none`) and set `.none-text` to `#4f5d75` (F17) (assets/examples/example-dp-security-matrix.html) — check: `node scripts/color-gates.cjs` confirms `#4f5d75` clears 4.5:1 on paper; re-render, confirm the four states read as visually distinct
- [ ] T020 [P] Fix F19 in `examples/example-high-level.html`: the write-back line (`stroke="rgba(45,49,66,0.30)"`, `:129`) carries a `marker-end` whose polygon (`#arrow`, `:63`) is fully opaque `#4f5d75`, so the arrowhead renders darker than its own shaft — match the shaft's stroke and opacity to the marker fill (F19) (assets/examples/example-high-level.html) — check: re-render, confirm the write-back arrowhead's tone matches its shaft
- [ ] T021 [P] Fix F22 in `examples/example-pyramid.html`: the three cadence figures (`~240/yr`, `~48/yr`, `~4/yr`, `:82,88,94`) are `fill="#7a8399"` at 3.48:1, below the recorded departure's "may not carry sublabel or eyebrow text" limit, while carrying the diagram's quantitative payload — set all three to `fill="#4f5d75"` (F22) (assets/examples/example-pyramid.html) — check: `node scripts/color-gates.cjs` confirms `#4f5d75` clears 4.5:1 on paper; re-render, confirm the three figures read clearly
- [ ] T022 [P] Fix F23 in `examples/example-data-flow.html:88-89` and `examples/example-process.html`: `.chip-text{fill:#fff}` measures 2.70:1 on the TB mustard chip (`#b8915a`) and 3.49:1 on the LS sage chip (`#7c8f6f`), both below the 4.5:1 text gate, and neither of the review's own candidate hexes is a declared role — measure every already-declared skin role against each of the four chip fills with `node scripts/color-gates.cjs` and set `.chip-text` per chip to the darkest role that clears 4.5:1, introducing no new hex (F23; D1) (assets/examples/example-data-flow.html, assets/examples/example-process.html) — check: `node scripts/color-gates.cjs` reports ≥4.5:1 for every chip/text pairing in both files; re-render both, confirm no chip text reads as washed out
- [ ] T023 [P] Fix F24 in `examples/example-it-state.html`: `On-prem RDBMS` (`.node-name.survivor{fill:#7c8f6f}`, `:34,97`) is the only green element on the page and the four-entry legend (`:119-123`) has no key for it — add a legend entry for the survivor state, or render it in `--color-ink` and carry the distinction through the existing `external`/`bottleneck` vocabulary (F24) (assets/examples/example-it-state.html) — check: re-render, confirm every distinctly-coloured node has a matching legend key
- [ ] T024 [P] Fix F30 in `templates/template-terminal.html`: `h1::before{content:"# "; color: var(--color-soft)}` (`:107-110`) renders the title's sigil at 2.76:1, below both the 3.0:1 large-text bar and the record's own "never carries text" exemption reason — set `color: var(--color-muted)` (F30) (assets/templates/template-terminal.html) — check: `node scripts/color-gates.cjs` confirms `--color-muted` clears 5.4:1 on the terminal paper; re-render, confirm the glyph is legible

**Meaning-versus-catalog lane (F8, F16, F28, F29)**

- [ ] T025 [P] Fix F8 in `examples/example-gantt.html`: the source works in weeks and the title reads "12-week plan" (`:31-41`), but the rendered axis carries only month labels with nine unlabelled week hairlines — add a week-number row under the month headers (`W1`…`W12` at `x = 200 + i*63 + 31`, 7 px mono, `--color-soft`'s structural role) (F8) (assets/examples/example-gantt.html) — check: re-render, count 12 visible week labels; `grep -c '>W'` reports 12
- [ ] T026 [P] Fix F16 in `examples/example-dp-integration.html`: the Centralized-logging connector (`:47`) is labelled `AUTH` (`:50`) though logging is not an auth path, and the identity bar's mask (`:70`) cuts the shaft in two — relabel the connector `AUDIT` (matching the bar's own "audit trail" sublabel), centre each label on its own line (`x="592"`/`x="624"`), and draw the transit line after the identity bar so it crosses on top (F16) (assets/examples/example-dp-integration.html) — check: re-render, confirm the connector reads as one continuous line labelled `AUDIT`, unbroken by the identity bar
- [ ] T027 [P] Fix F28 in `examples/example-medallion.html`: the catalog row promises "under which access policies," but each tier card carries only Tool, Format, Writer and an example, with no access-policy field anywhere — add a fourth card field (`Access`, e.g. "platform-read · eng-write") to each of the five tiers, or narrow the catalog row to what the card actually shows (F28) (assets/examples/example-medallion.html) — check: re-render, confirm every tier card shows an access-policy field, or confirm `references/catalog.md`'s medallion row no longer claims one
- [ ] T028 [P] Fix F29 in `examples/example-state.html`: the catalog row promises "what guards each transition," but all five transitions (`SUBMIT`, `APPROVE`, `REJECT · REVISE`, `EXPIRE`, `PURGE`) are event names with no `[condition]` notation anywhere — add a guard beneath each event label in the established `[condition]` form, or narrow the catalog row (F29) (assets/examples/example-state.html) — check: re-render, confirm every transition shows a guard condition, or confirm the catalog row no longer claims one

**Skin-and-token-hygiene lane (F26, F31, F32)**

- [ ] T029 [P] Fix F26: `assets/color/diagram-palette.json` lists `example-sequence-oauth-dark.html` under `examples.untokenized`, though every one of its eight colour literals matches the recorded dark skin exactly, removing the corpus's only dark-skin exercise from `derivation-gates` — delete the `untokenized` entry and the sentence naming it in `references/foundations/derivation-record.md` §1 (F26) (assets/color/diagram-palette.json, references/foundations/derivation-record.md) — check: `grep -c untokenized` on both files reports 0; `check-diagram-corpus.cjs`'s `derivation-gates` output now covers `example-sequence-oauth-dark.html` as a plain dark-skin file
- [ ] T030 [P] Fix F31 in `templates/template-dark.html`: `--color-paper: #2d3142` and `--color-ink: #f5f5f5` (`:12-13`) carry stale "warm" comments, though both are cool/neutral values `style-guide.md` §1 and the derivation record already call by their correct names — set the comments to `/* jet-black */` and `/* white-smoke */`, matching `template.html:12-15` (F31) (assets/templates/template-dark.html) — check: `grep -n warm` reports 0 matches
- [ ] T031 Fix F32 across `templates/template.html`, `templates/template-dark.html` and `templates/template-full.html`: `template.html` and `template-dark.html` (`:70`) hard-code the `arrow-link` fill (`#2e5aa8` light, `#6a95d8` dark) outside their `DIAGRAM_PALETTE` sentinel blocks though `link` is a recorded primary in both skins, and `template-full.html` (`:23,205`) declares `--color-link` but still hard-codes the marker and six drawing elements — add `--color-link` to the light and dark sentinel blocks in `template.html`/`template-dark.html` and reference `var(--color-link)` in all three templates' markers, following `example-dp-integration.html:22-24`'s working pattern (F32) (assets/templates/template.html, assets/templates/template-dark.html, assets/templates/template-full.html) — check: run `node scripts/apply-diagram-tokens.cjs --default --examples --out <tmp>`, re-theme a copy's link role, confirm every arrow-link marker in all three templates repaints; `grep -c 'var(--color-link)'` is nonzero in each

**Polish lane (F20, F21, F25, F27, F33, F34)**

- [ ] T032 [P] Fix F20 in `examples/example-radar.html`: the five grid rings (`rgba(45,49,66,0.10)`, `:74-77`) sit under four series fills at 0.18 alpha each (`:103,105,107,110`), and where three or four overlap the union buries the rings and blends three of four series into one brown — drop the three non-focal fills to `0.08` (keep strokes full colour), raise the rings to `rgba(45,49,66,0.18)`, and draw the rings after the fills (F20) (assets/examples/example-radar.html) — check: re-render, confirm all four series are traceable and the ring gridlines are visible through the fills
- [ ] T033 [P] Fix F21 in `examples/example-quadrant-consultant.html`: the focal tint (`x="500" y="80" width="400" height="220"`, `:77`) overruns the upper-right quadrant's own bounds (500-800, 60-300, `:113,116`) by 100 px horizontally and starts 20 px short vertically — set the tint to `x="500" y="60" width="300" height="240"`, matching the quadrant exactly (F21) (assets/examples/example-quadrant-consultant.html) — check: re-render, confirm the tint's bounds exactly match the quadrant
- [ ] T034 Fix F25 in `examples/example-it-state.html` and `examples/example-nested.html`: the `COLLECTION`/`PROCESSING`/`DISSEMINATION` zone-label masks (`width="92"`, `width="92"`, `width="116"`, `:64,67,70`) run roughly 30 px past their label text, and `example-nested.html`'s five level tabs carry the same pattern — set the three masks to `width="68"`, `width="68"`, `width="86"` (label width plus 8 px) and apply the same label-width-plus-8 rule to `example-nested.html`'s five tabs (F25) (assets/examples/example-it-state.html, assets/examples/example-nested.html) — check: re-render both files, confirm no zone or tab border shows a white gap past its label
- [ ] T035 [P] Fix F27 in `examples/example-sequence-oauth-full.html`: the ALT fragment's fill sits within a few percent of the panel behind it, inside two nested container frames, so its edges are barely visible — drop the outer container frame level (keeping the inner panel) and darken the fragment fill one step against it (F27) (assets/examples/example-sequence-oauth-full.html) — check: re-render, confirm the ALT fragment's edges are visually distinct from the panel it sits on
- [ ] T036 [P] Fix F33 in `examples/example-nested.html`: the annotation leader from "no imports, no configuration" terminates on the `/project` box's top stroke, left of centre, rather than on the CLAUDE.md node it describes — move the leader's endpoint into the box, just above the `CLAUDE.md` label (F33) (assets/examples/example-nested.html) — check: re-render, confirm the leader's dot lands inside the box near the label it describes
- [ ] T037 [P] Fix F34 in `examples/example-line.html` and `examples/example-bar.html`: both charts label the y axis from the first step up, leaving the baseline unnamed, and `example-line.html`'s gridlines run ~48 px past the last data point (W8) — add a `0` tick to both charts' y axes, and end `example-line.html`'s gridlines at the W8 x position (F34) (assets/examples/example-line.html, assets/examples/example-bar.html) — check: re-render both files, confirm a labelled `0` baseline on each and no trailing empty column on the line chart
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T038 Run `node .opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs` against the fully remediated corpus and confirm `RESULT: PASSED` — the first full post-fix run this phase's completion depends on (D16) (scripts/check-diagram-corpus.cjs) — check: the printed `RESULT: PASSED` line
- [ ] T039 Run `node scripts/apply-diagram-tokens.cjs --default --out <tmp>` and `--default --examples --out <tmp>`, confirming `diff -rq` against the live corpus is empty, proving every fix in T004-T037 resolved to an existing role rather than a new literal (REQ-009; D1) (scripts/apply-diagram-tokens.cjs) — check: two empty `diff -rq` outputs
- [ ] T040 Run `node --test scripts/tests/` and confirm it passes, then compare `grid-baseline.json`'s per-file counts against T003's snapshot, confirming every count fell or held (REQ-010; D5) (scripts/tests/, scripts/families/grid-baseline.json) — check: `node --test` exit 0; a diff of the two snapshots showing no file's count increased
- [ ] T041 Re-render every one of the 31 files this phase touched and view each render against its finding's stated check before any task above is marked `[x]` — a fix nobody viewed is a claim, not evidence (REQ-011) (assets/examples/*.html, assets/templates/*.html) — check: 31 fresh renders, one per touched file, each read against its own task's check line
- [ ] T042 Push a confirming commit and read the CI run for `.github/workflows/diagram-corpus.yml`: corpus check green, mutation suite green, no backlog — the literal 007 completion signal `goal.md` depends on (.github/workflows/diagram-corpus.yml) — executor: human review
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md — REQ-001 through REQ-011 present
- [ ] CHK-002 [P0] Technical approach defined in plan.md — Technical Context, FIX ADDENDUM present
- [ ] CHK-003 [P1] Dependencies identified and available — 005's checker/suite, 002's derivation record, 003's applicator/color-gates, and 006's manual-review-opus.md all read and cited
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every edited SVG/HTML file remains well-formed — checked by `check-diagram-corpus.cjs`'s own parse step
- [ ] CHK-011 [P0] No console errors — `render-screenshots.cjs` reports rendered N, failed 0 after every lane
- [ ] CHK-012 [P1] Error handling — not applicable; every task is a static markup/attribute edit, not executable logic
- [ ] CHK-013 [P1] No comment in any edited file embeds a finding id, task id, or spec path (comment-hygiene hard block); F31's corrected `/* jet-black */`/`/* white-smoke */` comments name a colour, not a finding
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met — AC-001 through AC-037 in acceptance-criteria.md
- [ ] CHK-021 [P0] `validate.sh specs/sk-design/019-sk-design-diagram-upgrade/007-manual-review-remediation --strict` reports `RESULT: PASSED` (run by the orchestrator, not this authoring pass)
- [ ] CHK-022 [P1] Edge cases tested — the already-satisfied-by-another-fix case (F3), the no-existing-role-clears-the-gate case (F23), and the document-only fix case (F26) each map to a task above
- [ ] CHK-023 [P1] Every finding this phase owns (F1-F34) appears in a task line above; no systemic pattern (S1-S10) is planned here
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each of the 34 findings carries a finding class: F1-F21, F24-F25, F27, F31-F34 are `instance-only` (one file's own geometry, text or comment is wrong); F17, F22, F23, F30 are `matrix/evidence` (a contrast value that must be measured, not assumed); F26 is `cross-consumer` (a JSON exemption list and a markdown record both reference the same wrong fact) — recorded per task above
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: `rg -n 'fill="#7a8399"'` confirms F17/F22 are two of ten `soft`-as-text instances S2 already tracks; the other eight stay 008's, since S2 is a systemic pattern, not a numbered finding this phase owns
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for F26: `rg -n 'untokenized'` against `diagram-palette.json` and `derivation-record.md` confirms exactly two consumers of the wrong fact, both edited in T029
- [ ] CHK-FIX-004 [P0] No security/path/parser/redaction surface is touched by this phase; the adversarial-table requirement does not apply — every fix is a static SVG/CSS attribute value
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed: finding (34) × lane (7) is a single-membership mapping, recorded in plan.md's FIX ADDENDUM
- [ ] CHK-FIX-006 [P1] No process-wide or global state is read by any fix; not applicable
- [ ] CHK-FIX-007 [P1] Evidence for each task is pinned to the file's own line numbers, re-confirmed against the live corpus in T001, not a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets — no file this phase touches reads a credential or environment variable
- [ ] CHK-031 [P0] Input validation implemented — not applicable; every file is local static markup with no input surface
- [ ] CHK-032 [P1] Auth/authz working correctly — not applicable; no auth surface exists in this corpus (NFR-S01, spec.md §7)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized — REQ ids in spec.md match task citations here and AC rows in acceptance-criteria.md
- [ ] CHK-041 [P1] Code comments adequate — F31's corrected comments and F32's new sentinel declarations are the only comment-adjacent changes; comment hygiene holds (CHK-013)
- [ ] CHK-042 [P2] README updated (if applicable) — `assets/examples/README.md`'s `Demonstrates` column is already confirmed accurate by the review's §4; re-checked only if F28 or F29's task narrows a catalog row instead of drawing the missing field
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only — this authoring pass created no temp files; any `--out <tmp>` directory T039 uses is a throwaway comparison target, not a committed artifact
- [ ] CHK-051 [P1] scratch/ cleaned before completion — not applicable; nothing was added to this packet's scratch/ by this authoring pass
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-11
<!-- /ANCHOR:summary -->

---
