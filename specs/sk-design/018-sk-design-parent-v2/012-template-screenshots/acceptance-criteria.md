---
title: "Acceptance Criteria: Phase 2: template-screenshots"
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
    packet_pointer: "scaffold/012-template-screenshots"
    last_updated_at: "2026-09-06T20:37:15Z"
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
# Acceptance Criteria: Phase 2: template-screenshots

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `sk-design/018-sk-design-parent-v2/012-template-screenshots`
**Level:** 3
**Status:** Complete
**Date:** 2026-09-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given 70 HTML sources with no pictures, When the renderer runs, Then every source has a PNG at the mirrored path | `--check`: sk-design-chart 36 sources 0 missing, sk-design-diagram 39 sources 0 missing | Met | - |
| AC-002 | REQ-002 | Given images that will rot as templates change, When they are produced, Then a committed script produces them and a check reports coverage | `shared/scripts/render-screenshots.cjs`, one command per mode, `--check` shipped alongside | Met | - |
| AC-003 | REQ-003 | Given a leaf manifest that lists what a mode loads, When screenshots are added, Then they do not enter it | Writing to `assets/screenshots/` grew the leaf set 181 to 256 with 75 PNG leaves; moving to `<mode>/screenshots/` returned the hash to `ec5c48a2ca9a`, identical to before | Met | - |
| AC-004 | REQ-004 | Given charts that animate on first paint, When a frame is captured, Then it shows a settled figure | A rendered chart read directly: bars at full height, labels placed, data table present. A rendered diagram read directly: full org chart with legend | Met | - |
| AC-005 | REQ-002 | Given a colour scheme that should not vary by machine, When the capture is taken, Then the scheme is fixed | Chrome ignores `--force-prefers-color-scheme`, `--blink-settings=preferredColorScheme` and `--headless=new`; all four attempts produced byte-identical output on a dark host. The theme follows the machine, documented in both READMEs | Superseded | ADR-002 |

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

AC-003 carried this phase and was caught by a gate rather than by me: the first render wrote inside
`assets/` and swept 75 images into the routable leaf surface, growing it by two fifths. AC-005 is
`Superseded` rather than `Met`: four approaches to fixing the colour scheme all failed, so the
property is documented where a regenerating operator will read it instead of being worked around with
a new browser driver.
<!-- /ANCHOR:closure -->
