---
title: "Acceptance Criteria: Phase 7: manual-review-remediation"
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
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/007-manual-review-remediation"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase 7 acceptance criteria: one AC row per finding plus three corpus invariants"
    next_safe_action: "Meet, waive or supersede the open criteria once T001-T042 execute"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/007-manual-review-remediation/spec.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/007-manual-review-remediation/plan.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/006-capture-and-judgment/scratch/evidence/manual-review-opus.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-007-manual-review-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 7: manual-review-remediation

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-design/019-sk-design-diagram-upgrade/007-manual-review-remediation
**Level:** 2
**Status:** Draft
**Date:** 2026-09-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.
`AC-001` through `AC-034` map 1:1 to the review's `F1` through `F34`; `AC-035` through `AC-037`
cover the three corpus-wide invariants every fix must hold.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `template-full.html`'s last legend row draws below its `viewBox`, When the legend is moved to `y="682"` and the `viewBox` extended, Then every row including "Security group" renders fully inside the frame | Re-render `template-full.html`; `grep -n viewBox` shows the extended height | Unmet | - |
| AC-002 | REQ-002 | Given `example-timeline.html`'s five events run 52-70 px/month with the JAN '26 tick 60 px from its event, When all five are rescaled to one px/month value, Then every adjacent gap is equal and the tick aligns with the event | Recomputed px/month from the new `cx` values; re-rendered visual alignment check | Unmet | - |
| AC-003 | REQ-004 | Given `template-full.html`'s legend starts at `y="544"` though its own comment says `y="682"`, When T004's combined edit lands, Then the legend visibly sits outside the dashed AWS REGION box | Re-render, confirm the legend reads as separate from the region box | Unmet | - |
| AC-004 | REQ-003 | Given the Tag→ArticleTag line in `example-er.html` is fully covered by its own masks, When the line is lengthened and the masks moved beside it, Then a visible connector with "1"/"N" labels renders | Re-render `example-er.html` | Unmet | - |
| AC-005 | REQ-003 | Given the Astro node in `example-architecture.html` overpaints two arrow labels, When both labels move clear of the node, Then neither label's leading glyph is clipped | Re-render `example-architecture.html` | Unmet | - |
| AC-006 | REQ-003 | Given the `RESP` label mask in `example-architecture.html` erases part of its own arrow shaft, When the mask is raised off the line, Then the arrow renders as one continuous dashed line | Re-render `example-architecture.html` | Unmet | - |
| AC-007 | REQ-003 | Given the focal bar in `example-gantt.html` breaks 4 px through zone 2's own border, When zone 2 is extended to `height="132"`, Then the bar sits fully inside with zone 3's clearance | Re-render `example-gantt.html` | Unmet | - |
| AC-008 | REQ-006 | Given `example-gantt.html`'s "12-week plan" carries only month labels, When a week-number row is added, Then 12 week labels render under the month headers | `grep -c '>W'` reports 12; re-render `example-gantt.html` | Unmet | - |
| AC-009 | REQ-003 | Given `example-layers.html`'s L3 fill matches the page paper and L1/L2 share one fill, When a hairline is added to all four bands and the two fills stepped apart, Then five distinct bands render | Re-render `example-layers.html` | Unmet | - |
| AC-010 | REQ-003 | Given `polish` and `critique` in `example-tree.html` touch at their shared edge, When `polish` shifts left by 20, Then the pair shows the same gap as every other sibling pair | Re-render `example-tree.html` | Unmet | - |
| AC-011 | REQ-003 | Given both Venn circle arcs in `example-venn.html` cross their own sublabels, When both labels move inward, Then neither is crossed by a circle outline | Re-render `example-venn.html` | Unmet | - |
| AC-012 | REQ-004 | Given the axis title in `example-scatter.html` sits inside the legend row, When it moves under the tick labels, Then it no longer reads as a legend entry | Re-render `example-scatter.html` | Unmet | - |
| AC-013 | REQ-003 | Given the Postgres node in `example-import-mermaid.html` straddles its zone's boundary, When it moves to `y="344"`, Then it sits entirely inside the CORE SERVICES zone | Re-render `example-import-mermaid.html` | Unmet | - |
| AC-014 | REQ-004 | Given the revision connector's dash pattern in `example-swimlane.html` is unreadable and mismatches its legend swatch, When the connector is lengthened and the swatch's dasharray matched, Then both show the same visible dash pattern | Re-render `example-swimlane.html` | Unmet | - |
| AC-015 | REQ-004 | Given the "needs setup / gap" legend entry in `example-org-chart.html` keys no real node, When the treatment is applied to a real node or the entry dropped, Then every legend entry keys at least one element | Re-render `example-org-chart.html` | Unmet | - |
| AC-016 | REQ-006 | Given the logging connector in `example-dp-integration.html` is labelled `AUTH` and severed by the identity bar's mask, When it is relabelled `AUDIT` and drawn above the bar, Then it reads as one continuous, correctly-labelled line | Re-render `example-dp-integration.html` | Unmet | - |
| AC-017 | REQ-005 | Given the four cell fills in `example-dp-security-matrix.html` are indistinguishable and `.none-text` measures 3.48:1, When the fills are stepped apart and `.none-text` set to `#4f5d75`, Then the four states are visually separable and the text clears 4.5:1 | `node scripts/color-gates.cjs` reports ≥4.5:1; re-render | Unmet | - |
| AC-018 | REQ-003 | Given `example-high-level.html`'s four source connectors run along the container's own border, When the riser moves to `x=172`, Then the connectors read as a bus separable from the boundary | Re-render `example-high-level.html` | Unmet | - |
| AC-019 | REQ-005 | Given the write-back arrowhead in `example-high-level.html` is darker than its own shaft, When the shaft's stroke/opacity is matched to the marker, Then the arrowhead's tone matches its shaft | Re-render `example-high-level.html` | Unmet | - |
| AC-020 | REQ-005 | Given the grid in `example-radar.html` is buried and three of four series unreadable, When non-focal fills drop to 0.08, rings raise to 0.18 and are drawn after fills, Then all four series and the rings are traceable | Re-render `example-radar.html` | Unmet | - |
| AC-021 | REQ-008 | Given the focal tint in `example-quadrant-consultant.html` overruns its quadrant by 100 px, When it is resized to `x="500" y="60" width="300" height="240"`, Then it exactly matches the quadrant | Re-render `example-quadrant-consultant.html` | Unmet | - |
| AC-022 | REQ-005 | Given the three cadence figures in `example-pyramid.html` measure 3.48:1, When they are set to `#4f5d75`, Then the text clears 4.5:1 | `node scripts/color-gates.cjs` reports ≥4.5:1; re-render | Unmet | - |
| AC-023 | REQ-005 | Given white chip text in `example-data-flow.html`/`example-process.html` measures 2.70:1 on the TB chip, When an already-declared role is set per chip via `color-gates.cjs` measurement, Then every chip/text pairing clears 4.5:1 with no new hex introduced | `node scripts/color-gates.cjs` reports ≥4.5:1 for all pairings in both files; re-render both | Unmet | - |
| AC-024 | REQ-005 | Given `On-prem RDBMS` in `example-it-state.html` is the only unkeyed green element, When a legend entry is added or it is rendered in `--color-ink`, Then every distinctly-coloured node has a matching key | Re-render `example-it-state.html` | Unmet | - |
| AC-025 | REQ-008 | Given three zone-label masks in `example-it-state.html` and five tab masks in `example-nested.html` run ~30 px past their labels, When all are trimmed to label-width-plus-8, Then no border shows a white gap past its label | Re-render both files | Unmet | - |
| AC-026 | REQ-007 | Given `diagram-palette.json` lists `example-sequence-oauth-dark.html` as `untokenized` though it carries the recorded dark skin exactly, When the entry and its naming sentence are deleted, Then the file gates as a plain dark-skin example under `derivation-gates` | `grep -c untokenized` reports 0 on both files; `check-diagram-corpus.cjs` output covers the file | Unmet | - |
| AC-027 | REQ-008 | Given the ALT fragment in `example-sequence-oauth-full.html` has no visible figure/ground against its panel, When one container frame is dropped and the fragment fill darkened one step, Then its edges are visually distinct | Re-render `example-sequence-oauth-full.html` | Unmet | - |
| AC-028 | REQ-006 | Given `example-medallion.html`'s catalog row promises an access policy the cards do not show, When a fourth card field is added or the row narrowed, Then every card shows an access-policy field, or the row no longer claims one | Re-render; `references/catalog.md` row read | Unmet | - |
| AC-029 | REQ-006 | Given `example-state.html`'s catalog row promises transition guards the diagram does not show, When a guard is added beneath each event or the row narrowed, Then every transition shows a guard, or the row no longer claims one | Re-render; `references/catalog.md` row read | Unmet | - |
| AC-030 | REQ-005 | Given `template-terminal.html`'s `h1::before` glyph measures 2.76:1 on `--color-soft`, When it is set to `--color-muted`, Then the glyph clears 5.4:1 | `node scripts/color-gates.cjs` reports 5.4:1; re-render | Unmet | - |
| AC-031 | REQ-007 | Given `template-dark.html`'s palette comments call a cool/neutral palette "warm", When the comments are corrected to `/* jet-black */`/`/* white-smoke */`, Then no stale description remains | `grep -n warm` reports 0 matches | Unmet | - |
| AC-032 | REQ-007 | Given `template.html`/`template-dark.html` hard-code `arrow-link` outside their sentinel blocks and `template-full.html`'s declared `--color-link` is unused in its markers, When `--color-link` is declared and referenced by all three templates' markers, Then re-theming the link role repaints every arrow-link marker | `apply-diagram-tokens.cjs --default --examples` re-theme test repaints all three; `grep -c 'var(--color-link)'` nonzero in each | Unmet | - |
| AC-033 | REQ-008 | Given the annotation leader in `example-nested.html` lands on a border rather than its subject, When the endpoint moves into the box above the `CLAUDE.md` label, Then the leader points at its subject | Re-render `example-nested.html` | Unmet | - |
| AC-034 | REQ-008 | Given `example-line.html`/`example-bar.html` leave the zero baseline unlabelled and the line chart's gridlines overrun the last data point, When a `0` tick is added to both and the line chart's gridlines trimmed to W8, Then both read correctly | Re-render both files | Unmet | - |
| AC-035 | REQ-009 | Given every fix in AC-001 through AC-034, When `apply-diagram-tokens.cjs --default --out <tmp>` and `--default --examples --out <tmp>` run, Then `diff -rq` against the live corpus is empty for both | Two empty `diff -rq` outputs | Unmet | - |
| AC-036 | REQ-010 | Given all 34 findings are addressed, When `check-diagram-corpus.cjs` and `node --test scripts/tests/` run, Then the checker prints `RESULT: PASSED`, the suite passes, and `grid-baseline.json`'s counts fall or hold against the pre-remediation snapshot | `RESULT: PASSED`; `node --test` exit 0; snapshot diff shows no increase | Unmet | - |
| AC-037 | REQ-011 | Given a fix nobody viewed is a claim, not evidence, When each of the 31 touched files is re-rendered, Then every render is looked at and cited before its task closes | 31 fresh renders, each read against its task's check line | Unmet | - |

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

**Closeable:** No

This packet is authored, not executed: T001-T042 have not run, so every AC row above is
observationally `Unmet` by construction. It closes only after the P1 pair lands (T004-T005), all
six lanes land (T006-T037) with every colour fix measured through `color-gates.cjs` and every
geometry fix re-rendered and viewed, the corpus invariants hold (T038-T040: `RESULT: PASSED`,
byte-identical `--default`/`--default --examples`, `node --test` green with no `grid-baseline.json`
regression), the view-before-ticket gate is satisfied for all 31 touched files (T041), CI reads
green (T042), and this document is re-read with every row moved to `Met`, `Waived` or `Superseded`.
<!-- /ANCHOR:closure -->
