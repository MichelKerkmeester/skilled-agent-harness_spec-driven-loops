---
title: "Acceptance Criteria: shadcn visual upgrade of the chart corpus"
description: "Acceptance criteria for the shadcn visual upgrade of the standalone chart corpus."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/015-shadcn-visual-upgrade"
    last_updated_at: "2026-09-08T05:12:18Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: shadcn visual upgrade of the chart corpus

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/015-shadcn-visual-upgrade
**Level:** 2
**Status:** Complete
**Date:** 2026-09-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given any template with an axis, When it is rendered, Then it shows the card header, content and footer, ticks without axis or tick lines at 12px muted, and horizontal dashed rules only | `screenshots/templates/daily-line.png` and `grouped-bars.png` regenerated 2026-09-08 show header, content and footer, ticks without axis or tick lines, horizontal dashed rules; `card-parts` 172 and `type-scale` 457 assertions, 0 failures | Met | - |
| AC-002 | REQ-002 | Given a bar, line or area form, When it is rendered, Then bars round their free corners, lines are 2px without per-point dots, areas fill with the vertical gradient | `radius` 102 assertions, 0 failures; `daily-line.png` shows a 2px dot-free line with the highlighted point and a gradient fill; `grouped-bars.png` shows rounded free corners | Met | - |
| AC-003 | REQ-003 | Given a tooltip-bearing form, When a mark is hovered, Then a bordered HTML card with per-series indicator, muted label and mono value appears, built from `READOUT`, and a form with the old SVG text group fails `tooltip-card` | `check-corpus.cjs:1487` `checkTooltipCard`; `tooltip-card` 189 assertions, 0 failures; the recorded mutation in `scratch/mutations.md` line 14 returned `FAIL [tooltip-card]`; `card-readout` 22 and `pointer-reach` 22 render assertions, 0 failures | Met | - |
| AC-004 | REQ-004 | Given a multi-series form, When it is rendered, Then a centred chip legend keyed to its declared series appears below the plot, and a form without one fails `legend` | `check-corpus.cjs:1446` `checkLegend`; `legend` 36 assertions, 0 failures on the six keyed forms; the recorded mutation in `scratch/mutations.md` line 13 returned `FAIL [legend]` | Met | - |
| AC-005 | REQ-005 | Given the final corpus, When the render gate runs, Then it prints RESULT: PASSED with zero errors, and each new assertion has a recorded failing mutation | `check-corpus.cjs --render` on 2026-09-08 printed `Summary: errors: 0` and `RESULT: PASSED`; both mutations recorded in `scratch/mutations.md` | Met | - |
| AC-006 | REQ-006 | Given the regenerated gallery, When its capture is opened, Then the light column is light and the dark column is dark | `screenshots/gallery.png` regenerated after the light pin fix (`:root:not([data-scheme="light"])` in every palette dark block and in `canonicalDarkBlock`) shows a light left column and a dark right column | Met | - |
| AC-007 | REQ-007 | Given `screenshots/`, When listed, Then every form and delivery has a fresh light and dark capture from the final corpus | `render-screenshots.cjs ./assets ./screenshots` printed `rendered 36, failed 0` and `--check` printed `sources 36, missing 0` | Met | - |
| AC-008 | REQ-008 | Given the references and changelog, When read, Then the visual system, the single-series rule and the version bump are stated | `references/template-contract.md` section "The shadcn visual register"; `references/color-system.md` single-series rule; `changelog/v1.3.0.0.md`; `SKILL.md` version 1.3.0.0 | Met | - |
| AC-009 | REQ-009 | Given the diff, When reviewed, Then no palette value or gate changed, no family count fell, no external reference entered, and phase 14's contracts still hold | `git diff --stat -- assets/color` empty; no family count fell (table in `implementation-summary.md`); `no-external` 210 assertions, 0 failures; `series-mapping` 128, `number-format` 320, `curve-contract` 16 unchanged | Met | - |

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

**Closeable:** Yes

All nine criteria are met by the static and render gates, the two recorded mutations, the regenerated captures and the reference updates. The single-series colour rule was amended during the build (spec section 3 item 8) and is recorded in the goal log.
<!-- /ANCHOR:closure -->
