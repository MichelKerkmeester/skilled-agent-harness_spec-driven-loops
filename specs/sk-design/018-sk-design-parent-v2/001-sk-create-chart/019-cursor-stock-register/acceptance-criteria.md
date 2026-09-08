---
title: "Acceptance Criteria: cursor bundle as the stock chart register"
description: "Acceptance criteria for making the cursor Style Reference the stock chart register."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/019-cursor-stock-register"
    last_updated_at: "2026-09-08T10:05:17Z"
    last_updated_by: "scaffold"
    recent_action: "Rebased the stock register on the cursor reference and regenerated the corpus"
    next_safe_action: "Commit with the chart package"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: cursor bundle as the stock chart register

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/019-cursor-stock-register
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
| AC-001 | REQ-001 | Given the palette source, When the checker gates it, Then every chrome, series and emphasis value clears its gate on both grounds and every value is a cursor table value or one of the four named moves | `assets/color/palettes.json:3` names the four moves; `palette-source` 38 and `palette-source-dark` 34 assertions, 0 failures; `scratch/derive-cursor.cjs` prints each ratio | Met | - |
| AC-002 | REQ-002 | Given the 35 stock files, When the corpus is checked and rendered, Then every block matches the source canonically, the typeface is set, and the gates pass with captures regenerated | `scratch/rebase-cursor.cjs` rewrote 35 files; `check-corpus.cjs --render` printed RESULT: PASSED; `rendered 37, failed 0`; `screenshots/templates/daily-line.png` shows the register | Met | - |

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

Both criteria are met by the palette gates, the canonical block comparison in every stock file, the render gate and the regenerated captures.
<!-- /ANCHOR:closure -->
